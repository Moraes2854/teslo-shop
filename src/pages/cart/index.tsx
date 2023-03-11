import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography, Grid, Card, CardContent, Divider, Box, Button } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { CartList, OrderSummary } from '../../components/cart';
import { FullScreenLoading } from '../../components/ui';
import { CartContext } from '../../context';

const CartPage = () => {
  const router = useRouter();
  const { numberOfItems, isLoaded, cart } = useContext( CartContext );

  useEffect(()=>{
    if ( isLoaded && cart.length === 0 ) router.replace('/cart/empty');
  }, [ isLoaded, cart, router ]);

  if ( !isLoaded ) return <FullScreenLoading />;
  
  return (
    <ShopLayout title={`Carrito - ${numberOfItems}`} pageDescription='Carrito de compras de la tienda'>

        <Typography variant='h1' component='h1'>Carrito</Typography>
        <Grid container>
            
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList editable/>
            </Grid>

            <Grid item xs={ 12 } sm={ 5 } >
                <Card>
                    <CardContent>
                        
                        <Typography>Orden</Typography>

                        <Divider sx={{ my: 1 }}/>

                        <OrderSummary />

                        <Box sx={{ mt: 3 }}>
                            <Button 
                                color="primary" 
                                className='circular-btn'
                                fullWidth
                                href='/checkout/address'
                            >
                                Checkout
                            </Button>
                        </Box>

                    </CardContent>
                </Card>
            </Grid>

        </Grid>
    </ShopLayout>
  )
}

export default CartPage;