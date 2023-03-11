import { ValidGender, ValidSize } from './';

export interface ICartProduct {
    _id: string;
    gender: ValidGender;
    image: string;
    price: number;
    quantity: number;
    size?: ValidSize;
    slug: string;
    title: string;
}