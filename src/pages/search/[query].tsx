import { NextPage, GetServerSideProps } from "next";
import { Typography, Box } from '@mui/material';

import { ShopLayout } from "../../components/layouts";
import { getAllProducts, getProductsByTerm } from '../../database/dbProducts';
import { IProduct } from '../../interfaces';

interface SearchPageProps {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<SearchPageProps> = ({ foundProducts, products, query }) => {


  return (
    <ShopLayout title={'Teslo-Shop - SearchPage'} pageDescription={'Buscá los mejores productos de Teslo aquí'}>
      
      <Typography variant='h1' component='h1'>Buscar Productos</Typography>
      
      {
        foundProducts 
        ? <Typography variant='h2' sx={{ mb: 1 }} textTransform='capitalize'>Término: { query }</Typography>
        : (
          <Box display='flex'>
            <Typography variant='h2' sx={{ mb: 1 }}>No encontramos ningún producto</Typography>
            <Typography variant='h2' sx={{ mb: 1, ml: 1 }} color='secondary' textTransform='capitalize' >{ query }</Typography>
          </Box>
        )
      }


      

    </ShopLayout>
  )
}



export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const { query = '' } = ctx.params as { query: string };
  
  if ( query.length === 0 ) {
    return {
      redirect: {
        destination: '/',
        permanent: true
      }
    }
  } 

  let products = await getProductsByTerm( query );
 
  const foundProducts = products.length > 0;

  if ( !foundProducts ) products = await getAllProducts();
   

  return {
    props: {
      products,
      foundProducts,
      query
    }
  }
}

export default SearchPage;