import type { NextApiRequest, NextApiResponse } from 'next'
import moongose from 'mongoose';

import { db } from '@/database';
import { Product } from '@/models';
import { IProduct } from '@/interfaces';
type Data = 
    | { message: string }
    | IProduct
    | boolean
    
export default function ( req: NextApiRequest, res: NextApiResponse<Data> ) {


    switch (req.method) {
        case 'GET':
            return getProductBySlug( req, res );
        // case 'PUT':
        //     return updateEntry( req, res );
        // case 'DELETE':
        //     return deleteEntry (req, res);

        default:
            return res.status(400).json({ message: `El método no existe`});
    }

}


const getProductBySlug = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { slug } = req.query;

    await db.connect();

    const product = await Product.findOne({ slug });
    
    await db.disconnect();

    if ( !product ) return res.status(400).json({ message: `Producto no encontrado`});

    product.images = product.images.map( img => {
        return img.includes('http') ? img : `${process.env.HOST_NAME}products/${ img }`
    });
    

    return res.status(200).json( product )
}

