import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { Typography, Grid, Card, CardContent, Divider, Box, Chip, CircularProgress } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { OrderResponseBody } from '@paypal/paypal-js/types'

import { ShopLayout } from '../../components/layouts/ShopLayout';
import { CartList, OrderSummary } from '../../components/cart';

import { getOrderByID } from '../../database';
import { IOrder } from '../../interfaces';
import { tesloApi } from '../../api';

interface OrderPageProps {
    order: IOrder
}

const OrderPage: NextPage<OrderPageProps> = ({ order }) => {

  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const { shippingAddress } = order;

  const onOrderComplete = async( details: OrderResponseBody ) => {

    if ( details.status !== 'COMPLETED' ) return alert('No hay pago en paypal');

    setIsPaying( true )

    try {

        const { data } = await tesloApi.post('/orders/pay', {
            transactionId: details.id,
            orderId: order._id
        });
        
        router.reload();

    } catch (error) {
        setIsPaying( false );
        console.log(error);
        alert('Error');    
    }

  }

  return (
    <ShopLayout title='Resumen de la orden' pageDescription={'Resumen de la orden'}>
        <Typography variant='h1' component='h1'>Orden: { order._id }</Typography>

        {
            order.isPaid
            ? (
                <Chip 
                    sx={{ my: 2 }}
                    label="Orden ya fue pagada"
                    variant='outlined'
                    color="success"
                    icon={ <CreditScoreOutlined /> }
                />
            ):
            (
                <Chip 
                    sx={{ my: 2 }}
                    label="Pendiente de pago"
                    variant='outlined'
                    color="error"
                    icon={ <CreditCardOffOutlined /> }
                />
            )
        }

        <Grid container className='fadeIn'>

            <Grid item xs={ 12 } sm={ 7 }>
                <CartList products={  order.orderItems } />
            </Grid>
            
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen ({ order.numberOfItems } { order.numberOfItems > 1 ? 'productos': 'producto'})</Typography>
                        <Divider sx={{ my:1 }} />

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Dirección de entrega</Typography>
                        </Box>

                        
                        <Typography>{ shippingAddress.firstName } { shippingAddress.lastName }</Typography>
                        <Typography>{ shippingAddress.address } { shippingAddress.address2 ? `, ${ shippingAddress.address2 }`: '' }</Typography>
                        <Typography>{ shippingAddress.city }, { shippingAddress.zip }</Typography>
                        <Typography>{ shippingAddress.country }</Typography>
                        <Typography>{ shippingAddress.phone }</Typography>

                        <Divider sx={{ my:1 }} />


                        <OrderSummary 
                            orderValues={{
                                numberOfItems: order.numberOfItems,
                                subTotal: order.subTotal,
                                total: order.total,
                                tax: order.tax,
                            }} 
                        />

                        <Box sx={{ mt: 3 }} display="flex" flexDirection='column'>
                        
                            <Box sx={{ display: isPaying ? 'flex' : 'none' }} justifyContent='center' className='fadeIn'>
                                <CircularProgress />
                            </Box>
    
                            <Box sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }} flexDirection='column' >
                             
                                {
                                    order.isPaid
                                    ? (
                                        <Chip 
                                            sx={{ my: 2 }}
                                            label="Orden ya fue pagada"
                                            variant='outlined'
                                            color="success"
                                            icon={ <CreditScoreOutlined /> }
                                        />

                                    ):(
                                        <PayPalButtons
                                            createOrder={( data, actions ) => {
                                                return actions.order.create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: `${ order.total }`,
                                                            },
                                                        },
                                                    ],
                                                });
                                            }}
                                            onApprove={( data, actions ) => {
                                                return actions.order!.capture().then(( details ) => {
                                                    onOrderComplete( details );
                                                });
                                            }}
                                        />
                                    )
                                }
                            </Box>

                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>


    </ShopLayout>
  )
}



export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query;
    const session: any = await getSession({ req });
    

    if ( !session ) {
        return {
            redirect: {
                destination: `/auth/login?page=/orders/${ id }`,
                permanent: false
            }
        }
    }

    const order = await getOrderByID( id.toString() );

    if ( !order ) {
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false,
            }
        }
    }

    if ( order.user !== session.user.id ){
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false,
            }
        }
    }

    return {
        props: {
            order
        }
    }
}

export default OrderPage;