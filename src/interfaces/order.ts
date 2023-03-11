import { IUser, ShippingAddress, ValidGender, ValidSize } from './';

export interface IOrder {
    _id?            : string;
    isPaid          : boolean;
    numberOfItems   : number;
    orderItems      : IOrderItem[];
    paidAt?         : string;
    paymentResult?  : string;
    shippingAddress : ShippingAddress;
    subTotal        : number;
    tax             : number;
    total           : number;
    transactionId?  : string;
    user?           : IUser | string;
    createdAt?      : string;
    updatedAt?      : string;
}

export interface IOrderItem {
    _id?     : string;
    gender   : ValidGender;
    image    : string;
    price    : number;
    quantity : number;
    size     : ValidSize;
    slug     : string;
    title    : string;
}