import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';
import { v2 as cloudinary } from "cloudinary";
cloudinary.config( process.env.CLOUDINARY_URL || '' );

import { IProduct } from '../../../interfaces';
import { db } from '../../../database';
import { Product } from '../../../models';

type Data = 
    | { message: string }
    | IProduct
    | IProduct[]

export default function ( req: NextApiRequest, res: NextApiResponse<Data> ) {

    switch ( req.method ) {
        case 'GET':
            
            return getProducts( req, res );

        case 'PUT':

            return updateProduct( req, res );

        case 'POST':
            return createProduct( req, res );
    
        default:
            return res.status( 400 ).json({ message: 'Bad request' });
    }

    
}

export const getProducts = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {
    await db.connect();

    const products = await Product.find()
        .sort({ title: 'asc'})
        .lean();

    await db.disconnect();

    const updatedProducts = products.map( product => {

        product.images = product.images.map( img => {
            return img.includes('http') ? img : `${process.env.HOST_NAME}products/${ img }`
        });

        return product;
    });

    return res.status( 200 ).json( updatedProducts );
}

export const updateProduct = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { _id = '', images = [] } = req.body as IProduct;

    if ( !isValidObjectId( _id ) ) return res.status( 400 ).json({ message: 'El id del producto no es válido' });

    if ( images.length < 2 ) return res.status( 400 ).json({ message: 'Son necesarias al menos dos imágenes' });

    try {
        await db.connect();

        const product = await Product.findById( _id );

        if ( !product ) {
            await db.disconnect();
            return res.status( 400 ).json({ message: 'No existe un producto con el id ingresado' });
        }

        product.images.forEach( async( image )=> {
            if ( !images.includes( image ) ) {
                const [ fileID, extension ] = image.substring( image.lastIndexOf('/') + 1 ).split('.');
                await cloudinary.uploader.destroy( fileID );
            }
        })
        
        await product.update( req.body );
        await db.disconnect();

        return res.status( 200 ).json( product );

    } catch (error) {
        console.log( error )
        await db.disconnect();
        return res.status( 400 ).json({ message: 'Check server logs' });
    }




}

export const createProduct = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { images = [] } = req.body as IProduct;


    if ( images.length < 2 ) return res.status( 400 ).json({ message: 'Son necesarias al menos dos imágenes' });

    try {
        
        await db.connect();
        
        const product = new Product( req.body );

        await product.save();

        await db.disconnect();

        return res.status( 201 ).json( product );

    } catch (error) {
        console.log( error )
        await db.disconnect();
        return res.status( 400 ).json({ message: 'Check server logs' });
    }

}