import { CartState } from './';
import { ICartProduct, ShippingAddress } from '../../interfaces';


type CartActionType = 
   | { type: '[Cart] - Add Product to Cart', payload: ICartProduct } 
   | { type: '[Cart] - Set Cart from cookies', payload: ICartProduct[] } 
   | { type: '[Cart] - Set Cart', payload: ICartProduct[] } 
   | { type: '[Cart] - Set ShippingAddress from cookies', payload: ShippingAddress } 
   | { type: '[Cart] - Update ShippingAddress', payload: ShippingAddress } 
   | { 
      type: '[Cart] - Update order summary', 
      payload: {
         numberOfItems: number;
         subTotal: number;
         tax: number;
         total: number;
      }
   }
   | { type: '[Cart] - Order complete', }


export const cartReducer = ( state: CartState, action: CartActionType ): CartState => {

   switch (action.type) {
      case '[Cart] - Add Product to Cart':
         return {
            ...state,
            cart: [...state.cart, action.payload],
         };

      case '[Cart] - Set Cart':
         return {
            ...state,
            cart: [...action.payload]
         };

      case '[Cart] - Set Cart from cookies':
         return {
            ...state,
            cart: [...action.payload],
            isLoaded: true,
         };

         case '[Cart] - Update ShippingAddress':
         case '[Cart] - Set ShippingAddress from cookies':
         return {
            ...state,
            shippingAddress: action.payload,
         };

      case '[Cart] - Update order summary':
         return {
            ...state,
            ...action.payload
         };

      case '[Cart] - Order complete':
         return {
            ...state,
            cart: [],
            numberOfItems: 0,
            subTotal: 0,
            tax: 0,
            total: 0,
         } 

      default:
         return state;
   }

}