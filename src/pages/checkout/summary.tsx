import NextLink from 'next/link';
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip } from '@mui/material';

import { ShopLayout } from '../../components/layouts/ShopLayout';
import { CartList, OrderSummary } from '../../components/cart';
import { countries } from '../../utils';
import { useSummaryPage } from '../../hooks';

const SummaryPage = () => {

  const {
    errorMessage,
    isPosting,
    numberOfItems,
    onCreateOrder,
    shippingAddress,
  } = useSummaryPage();

  if ( !shippingAddress ) {
    return <></>;
  }

  const { firstName, lastName, address, address2 = '', city, country, phone, zip } = shippingAddress;

  return (
    <ShopLayout title='Resumen de orden' pageDescription='Resumen de la orden'>

        <Typography variant='h1' component='h1'>Resumen de la orden</Typography>

        <Grid container>
            
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList />
            </Grid>

            <Grid item xs={ 12 } sm={ 5 } >
                <Card className='summary-card'>
                    
                    <CardContent>
                        
                        <Typography>Resumen ({ numberOfItems + ' producto'+`${ numberOfItems > 1 ? 's' : '' }`}) </Typography>

                        <Divider sx={{ my: 1 }}/>

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Dirección de entrega:</Typography>

                            <NextLink href='/checkout/address' passHref legacyBehavior>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box> 
                        
                        <Typography >{ firstName + ' ' + lastName }</Typography>
                        <Typography >{ address }, { address2 ? address2  : ''} </Typography>

                        <Typography >{ city + ' ' + zip }</Typography>
                        <Typography >{( countries.find(( c ) => c.code ===  country ) ) ? countries.find(( c ) => c.code ===  country )!.name : '' } </Typography>
                        <Typography >{ phone }</Typography>


                        <Divider sx={{ my: 1 }}/>

                        <Box display='flex' justifyContent='end'>
                            <NextLink href='/cart' passHref legacyBehavior>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box> 

                        <OrderSummary />

                        <Box sx={{ mt: 3 }} display='flex' flexDirection='column' >
                            <Button 
                                color="primary" 
                                className='circular-btn' 
                                fullWidth
                                onClick={ onCreateOrder }
                                disabled={ isPosting }
                            >
                                Confirmar orden
                            </Button>
                            <Chip
                                color='error'
                                label={ errorMessage }
                                sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
                            />
                        </Box>

                    </CardContent>
                </Card>
            </Grid>

        </Grid>
    </ShopLayout>
  )
}

export default SummaryPage;