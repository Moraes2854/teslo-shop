import { FC, useContext } from 'react';
import NextLink from 'next/link';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';

import { ItemCounter } from '../ui';
import { CartContext } from '../../context';
import { ICartProduct, IOrderItem } from '../../interfaces';

interface CartListProps {
    editable?: boolean;
    products?: IOrderItem[];
}



export const CartList: FC<CartListProps> = ({ editable = false, products }) => {
    
  const { cart: productsInCart, updateProductInCart, deleteProductInCart } = useContext( CartContext );

  const productsToShow = products ? products : productsInCart;
  return (
    <>
        {
            productsToShow.map( ( product ) => (
                <Grid container spacing={ 2 } sx={{ mb: 1 }} key={ `${product.slug}-${ product.size || Date.now }` } >

                    <Grid item xs={ 3 }>
                        <NextLink href={`/product/${ product.slug }`} passHref legacyBehavior>
                            <Link>
                                <CardActionArea>
                                    <CardMedia 
                                        image={ product.image }
                                        component='img'
                                        sx={{ borderRadius: '5px' }}
                                    />
                                </CardActionArea>
                            </Link>
                        </NextLink>
                    </Grid>

                    <Grid item xs={ 7 }>
                        <Box display='flex' flexDirection='column'>
                            <Typography>{ product.title }</Typography>
                            <Typography>Talla: <strong>{product.size}</strong></Typography>
                            {
                                ( editable && product._id ) 
                                ? <ItemCounter 
                                        currentValue={ product.quantity } 
                                        onAddButtonClick={ ( newQuantity ) => { 
                                            const productToUpdate: ICartProduct = { ...product, quantity: newQuantity } as ICartProduct;
                                            updateProductInCart(productToUpdate);
                                        }} 
                                        onRemoveButtonClick={ ( newQuantity ) => {
                                            if ( newQuantity < 1 ) return; 
                                            const productToUpdate: ICartProduct = { ...product, quantity: newQuantity } as ICartProduct;
                                            updateProductInCart(productToUpdate);
                                        }}  
                                   />
                                : <Typography variant='h5'>{ product.quantity } producto{product.quantity > 1 ? 's' : ''}</Typography>
                            }
                        </Box>
                    </Grid>

                    <Grid item xs={ 2 } display='flex' alignItems='center' flexDirection='column' >
                        <Typography variant='subtitle1'>${ product.price }</Typography>
                        {
                            ( editable && product._id ) && (
                                <Button variant='text' color='error' onClick={ () => deleteProductInCart( product as ICartProduct ) } >
                                    Remover
                                </Button>
                            )
                        }
                    </Grid>

                </Grid>
            ))
        }
    </>
  )
}
