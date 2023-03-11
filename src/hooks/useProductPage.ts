import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { ICartProduct, IProduct, ValidSize } from '../interfaces';
import { CartContext } from '../context/cart';

export const useProductPage = ( product: IProduct ) => {

    const router = useRouter();

    const { onAddProductToCart } = useContext( CartContext );


    const [ tempCartProduct, setTempCartProduct ] = useState<ICartProduct>({
        _id: product._id!,
        gender: product.gender,
        image: product.images[0],
        price: product.price,
        quantity: 0,
        size: undefined,
        slug: product.slug,
        title: product.title
    });
    
    const onSelectedSize = ( size: ValidSize ) => {

        if ( size === tempCartProduct.size ) {
            return setTempCartProduct( currentProduct => ({
            ...currentProduct,
            size: undefined,
            }))
        }

        setTempCartProduct( currentProduct => ({
            ...currentProduct,
            size,
        }));

    }

    const onAddButtonClick = ( newQuantity: number ) => {

        if ( tempCartProduct.quantity === product.inStock ) return;

        setTempCartProduct( currentProduct => ({
            ...currentProduct,
            quantity: newQuantity,
        }));

    }

    const onRemoveButtonClick = ( newQuantity: number ) => {

        if ( tempCartProduct.quantity === 0 ) return;

        setTempCartProduct( currentProduct => ({
            ...currentProduct,
            quantity: newQuantity,
        }));

    }

    const onAddProduct = ( ) => {
        if ( !tempCartProduct.size ) return;
        
        onAddProductToCart( tempCartProduct );
        router.push('/cart');
        
    }


    return {
        tempCartProduct,
        onSelectedSize,
        onAddButtonClick,
        onRemoveButtonClick,
        onAddProduct,
        
    }
      

}
