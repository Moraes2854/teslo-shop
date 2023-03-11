import { db } from './';
import { IOrder } from '../interfaces';
import { isValidObjectId } from 'mongoose';
import { Order } from '../models';

export const getOrderByID = async( id: string ): Promise<IOrder|null> => {

    if ( !isValidObjectId( id ) ) return null;

    await db.connect();

    const order = await Order.findById( id ).lean();
    
    await db.disconnect();

    if ( !order ) return null;

    return JSON.parse( JSON.stringify( order ) );
}

export const getOrdersByUserID = async( id: string ): Promise<IOrder[]> => {

    if ( !isValidObjectId( id ) ) return [];

    await db.connect();

    const orders = await Order.find({ user: id }).lean();
    
    await db.disconnect();

    if ( !orders ) return [];

    return JSON.parse( JSON.stringify( orders ) );
}
