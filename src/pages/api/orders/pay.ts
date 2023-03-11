import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

import { PayPalOrderStatusResponse } from '../../../interfaces';
import { db } from '../../../database';
import { Order } from '../../../models';
import { getSession } from 'next-auth/react';
import { isValidObjectId } from 'mongoose';

type Data = 
    |{ message: string }


export default function handler( req: NextApiRequest, res: NextApiResponse<Data> ) {

    switch( req.method ){
        case 'POST':
            return payOrder( req, res );
        
        default:
            return res.status( 400 ).json({ message: 'Bad Request' })
    }
}

const getPaypalBearerToken = async(): Promise<string|null> =>
{

    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
    const PAYPAL_SECRET_ID = process.env.PAYPAL_SECRET_ID || '';

    const base64Token = Buffer.from(`${ PAYPAL_CLIENT_ID }:${ PAYPAL_SECRET_ID }`, 'utf-8').toString('base64');
    const body = new URLSearchParams('grant_type=client_credentials');

    try {

        const { data } = await axios.post( process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${ base64Token }`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return data.access_token;

    } catch (error) {
        if ( axios.isAxiosError( error ) ) console.log( error.response?.data );
        else console.log( error );

        return null;

    }

}

const payOrder = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const session: any = await getSession({ req });

    if ( !session ) return res.status(401).json({ message: 'Se debe estar autenticado para hacer esto' });


    const paypalBearerToken = await getPaypalBearerToken();

    if ( !paypalBearerToken ) return res.status( 400 ).json({ message: 'No se pudó confirmar token de paypal' });

    const { transactionId = '', orderId = '' } = req.body;

    if ( !isValidObjectId( orderId ) ) return res.status( 400 ).json({ message: 'El ID de la orden es erroneo' });

    const { data } = await axios.get<PayPalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${ transactionId }`, {
        headers: {
            'Authorization': `Bearer ${ paypalBearerToken }`, 
        }
    });

    if ( data.status !== 'COMPLETED' ) return res.status( 401 ).json({ message: 'Orden no reconocida' });

    await db.connect();
    const dbOrder = await Order.findById( orderId );

    if ( !dbOrder ) {  
        await db.disconnect();
        return res.status( 401 ).json({ message: 'La orden no existe en la base de datos' });
    }

    if ( dbOrder.total !== Number(data.purchase_units[0].amount.value) ) {
        await db.disconnect();
        return res.status( 400 ).json({ message: 'Los montos de paypal no coinciden con los de nuestra orden' });
    }

    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;
    await dbOrder.save();

    await db.disconnect();



    return res.status( 200 ).json({ message: paypalBearerToken })
}