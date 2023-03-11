import NextLink from 'next/link';

import { Box, Link, Typography } from '@mui/material';
import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { ShopLayout } from '../../components/layouts';


const CartEmptyPage = () => {
  return (
    <ShopLayout title='Carrito vacio' pageDescription='No hay artículos en el carrito de compras'>
        <Box 
            sx={{ flexDirection: { xs: 'column', sm: 'row'} }}
            display='flex' 
            justifyContent='center'
            alignItems='center' 
            height='calc(100vh - 200px)'
        >   
            <RemoveShoppingCartOutlined sx={{ fontSize: 80 }}/>
            <Box display='flex' flexDirection='column' alignItems='center' >
                <Typography marginLeft={ 2 }>Su carrito esta vacio</Typography>
                <NextLink href='/' passHref legacyBehavior>
                    <Link typography='h4' color='secondary' underline='none' >
                        Regresar
                    </Link>
                </NextLink>
            </Box>
        </Box>
    </ShopLayout>
  )
}

export default CartEmptyPage ;