import type { NextApiRequest, NextApiResponse } from 'next';
import { Order, Product, User} from '../../../models';
import { DashboardSummaryResponse } from '../../../interfaces';

type Data = DashboardSummaryResponse;

export default async function handler ( req: NextApiRequest, res: NextApiResponse<Data> ) {

    // const numberOfOrders = await Order.find({}).count();
    // const paidOrders = await Order.find({ isPaid: true }).count();
    // const notPaidOrders = await Order.find({ isPaid: false }).count(); 
    // const numberOfClients = await User.find({ role: 'client' }).count();
    // const numberOfProducts = await Product.find({}).count();
    // const productsWithNoInventory = await Product.find({ inStock: 0 }).count(); 
    // const lowInventory = await Product.find({ inStock: { $lte: 10 } }).count(); 

    const [
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    ] = await Promise.all([
        Order.find({}).count(),   
        Order.find({ isPaid: true }).count(),   
        Order.find({ isPaid: false }).count(),   
        User.find({ role: 'client' }).count(),
        Product.find({}).count(),
        Product.find({ inStock: 0 }).count(),
        Product.find({ inStock: { $lte: 10 } }).count(),
    ]);

    return res.status(200).json({ 
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    })
}