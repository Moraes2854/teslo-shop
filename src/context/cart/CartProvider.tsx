import { FC, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';

import { CartContext, cartReducer } from './';
import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { countries } from '../../utils';
import { tesloApi } from '../../api';
import axios from 'axios';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined,
}

interface CartProviderProps {
   children:JSX.Element;
}

export const CartProvider:FC<CartProviderProps> = ({ children }) => {
    
    const [ state, dispatch ] = useReducer( cartReducer , CART_INITIAL_STATE );

    useEffect(() => {
        try {
            const cookieProducts = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ) : [];
            dispatch({ type: '[Cart] - Set Cart from cookies', payload: cookieProducts });
        } catch (error) {
            dispatch({ type: '[Cart] - Set Cart from cookies', payload: [] });
        }
    }, []);

    
    useEffect(() => {
      if ( state.cart.length > 0) Cookie.set('cart', JSON.stringify( state.cart ) );
    //   if ( state.cart.length === 0 ) Cookie.set('cart', JSON.stringify( [] ) );
    }, [state.cart]);

    useEffect(() => {
        
        const numberOfItems = state.cart.reduce( ( prev, current ) => current.quantity + prev , 0 );
        const subTotal = state.cart.reduce( ( prev, current ) => (current.price * current.quantity) + prev, 0 );
        const taxRate =  Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    
        const orderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal + ( subTotal * taxRate )
        }

        dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });
        
    }, [state.cart]);

    useEffect(()=>{
        if ( Cookie.get('firstName') ){
            const shippingAddressFromCookies: ShippingAddress = {
                address   : Cookie.get('address')   || '',
                address2  : Cookie.get('address2')  || '',
                city      : Cookie.get('city')      || '',
                country   : Cookie.get('country')   || countries[0].code,
                firstName : Cookie.get('firstName') || '',
                lastName  : Cookie.get('lastName')  || '',
                phone     : Cookie.get('phone')     || '',
                zip       : Cookie.get('zip')       || '',
            };
    
            dispatch({ type: '[Cart] - Set ShippingAddress from cookies', payload: shippingAddressFromCookies });
        }
    
    }, [])

    const onAddProductToCart = ( newProductInCart: ICartProduct ) => {

        const existingProductInCart = state.cart.find( ( p ) => p._id === newProductInCart._id && p.size === newProductInCart.size );

        if ( existingProductInCart ) {

            const newCart:ICartProduct[] = state.cart.map( ( p ) => {
                if ( p._id !== newProductInCart._id ) return p;
                if ( p.size !== newProductInCart.size ) return p;
                return {
                    ...newProductInCart,
                    quantity: p.quantity + newProductInCart.quantity
                };
            });
            
            dispatch({ type: '[Cart] - Set Cart', payload: newCart });

        }

        else dispatch({ type: '[Cart] - Add Product to Cart', payload: newProductInCart });
    }

    const updateProductInCart = ( updatedProductInCart: ICartProduct ) => {

        const existingProductInCart = state.cart.find( ( p ) => p._id === updatedProductInCart._id && p.size === updatedProductInCart.size );

        if ( existingProductInCart ) {

            const newCart:ICartProduct[] = state.cart.map( ( p ) => {
                
                if ( p._id !== updatedProductInCart._id ) return p;
                if ( p.size !== updatedProductInCart.size ) return p;

                return updatedProductInCart;
            });
            
            dispatch({ type: '[Cart] - Set Cart', payload: newCart });
        };

    }

    const deleteProductInCart = ( productToDelete: ICartProduct ) => {

        const newCart:ICartProduct[] = state.cart.filter( ( p ) => {
                
            if ( p._id !== productToDelete._id ) return true;
            if ( p.size !== productToDelete.size ) return true;

            return false;
        });
        
        dispatch({ type: '[Cart] - Set Cart', payload: newCart });
    }

    const updateAddress = ( address: ShippingAddress ) => {
        Cookie.set('address',   address.address);
        Cookie.set('address2',  address.address2 || '');
        Cookie.set('city',      address.city);
        Cookie.set('country',   address.country);
        Cookie.set('firstName', address.firstName);
        Cookie.set('lastName',  address.lastName);
        Cookie.set('phone',     address.phone);
        Cookie.set('zip',       address.zip);
        
        dispatch({ type: '[Cart] - Update ShippingAddress', payload: address });
    }

    const createOrder = async(): Promise<{ hasError: boolean, message: string }> => {

        if ( !state.shippingAddress ) throw new Error('No hay direcciónn de entrega');

        const body: IOrder = {
            orderItems      : state.cart.map( ( product ) => ({ ...product, gender: product.gender!, size: product.size! })),
            shippingAddress : state.shippingAddress,
            numberOfItems   : state.numberOfItems,
            subTotal        : state.subTotal,
            tax             : state.tax,
            total           : state.total,
            isPaid          : false,
        };

        try {
            
            const { data } = await tesloApi.post<IOrder>('/orders', body );
            dispatch({ type: '[Cart] - Order complete' });
            Cookie.set('cart', JSON.stringify( [] ) );
            
            return {
                hasError: false,
                message: data._id!
            }

        } catch (error) {
            console.log(error);

            if ( axios.isAxiosError( error ) ) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'Error no controlado. Hable con el administrador'
            }
            
        }
    }

    return (
        <CartContext.Provider value={{
            ...state,
            deleteProductInCart,
            onAddProductToCart,
            updateProductInCart,
            updateAddress,

            createOrder,
        }}>
            { children }
        </CartContext.Provider>
    )
};