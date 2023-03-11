import { FC, useMemo, useState } from 'react';
import NextLink from "next/link";
import { Card, CardActionArea, CardMedia, Grid, Box, Typography, Chip } from '@mui/material';
import { IProduct } from '../../interfaces/products';

interface ProductCardProps {
    product: IProduct;
}

export const ProductCard: FC<ProductCardProps> = ({ product }) => {

  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const productImage = useMemo(() => {
    return ( isHovered )
        ? product.images[1]
        : product.images[0]
  }, [isHovered]);


  return (
    <Grid item xs={ 6 } sm={ 4 } onMouseEnter={ () => setIsHovered( true ) } onMouseLeave={ () => setIsHovered( false ) } >
        <Card>
            <NextLink href={`/product/${ product.slug }`} passHref legacyBehavior prefetch={ false } >
                <CardActionArea>

                    {
                        ( product.inStock <= 0 ) 
                        &&  <Chip color='primary' label='No hay disponibles' sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px'}} />
                    }
                   
                    <CardMedia
                        component='img'
                        className='fadeIn'
                        image={ productImage }
                        alt={ product.title }
                        onLoad={ () => setIsImageLoaded(true) }
                    />
                    
                </CardActionArea>
            </NextLink>
        </Card>
        <Box sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className='fadeIn'>

            <Typography fontWeight={ 700 }>{ product.title }</Typography>
            <Typography fontWeight={ 500 }>${ product.price }</Typography>

        </Box>
    </Grid>
  )
}
