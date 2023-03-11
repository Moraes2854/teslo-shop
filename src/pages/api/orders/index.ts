import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

import { IOrder } from '../../../interfaces';
import { db } from '../../../database';
import { Product, Order } from '../../../models';

type Data = 
        | { message: string }
        | IOrder

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    

    switch( req.method ){
        case 'POST':
            return createOrder( req, res );
        default:
            res.status(400).json({ message: 'Bad Request' })
    }


}

const createOrder = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { orderItems, total } = req.body as IOrder;

    const session = await getSession({ req });

    if ( !session ) return res.status(401).json({ message: 'Se debe estar autenticado para hacer esto' });


    const productsIds = orderItems.map( p => p._id );

    await db.connect();

    const dbProducts = await Product.find( { _id: { $in: productsIds } } );

    try {

        const subTotal = orderItems.reduce( ( prev, current ) => {
            const dbProduct = dbProducts.find( ( p ) => p.id === current._id );

            if ( !dbProduct ) throw new Error('Verifique el carrito nuevamente, el producto no existe');

            return ( dbProduct.price * current.quantity ) + prev;
        }, 0 );

        const taxRate =  Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const backendTotal = subTotal + ( subTotal * taxRate );

        if ( total !== backendTotal ) throw new Error('El total no cuadra con el monto');

        const userId = (session.user! as any).id;
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
        
        //tener 2 decimales
        newOrder.total = Math.round( newOrder.total * 100 ) / 100;

        await newOrder.save();
        await db.disconnect();
        
        return res.status( 201 ).json( newOrder );

    } catch ( error: any ) {

        await db.disconnect();
        console.log(error);
        return res.status(400).json({
            message: error.message || 'Revise logs del servidor',
        });

    }

}