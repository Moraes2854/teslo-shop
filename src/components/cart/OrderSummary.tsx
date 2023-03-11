import { useContext, FC } from 'react';
import { Grid, Typography } from '@mui/material';
import { CartContext } from '../../context';
import { format } from '../../utils';

interface OrderSummaryProps {
  orderValues?: {
    numberOfItems: number;
    subTotal: number;
    total: number;
    tax: number;
  }
}

export const OrderSummary: FC<OrderSummaryProps> = ({ orderValues }) => {

  const { numberOfItems, subTotal, tax, total  } = useContext( CartContext );
  
  const summaryValues = orderValues ? orderValues : { numberOfItems, subTotal, total, tax };

  
  return (
    <Grid container >

      <Grid item xs={ 6 } display='flex'>
        <Typography>No. Productos</Typography>
      </Grid>

      <Grid item xs={ 6 } display='flex' justifyContent='end'>
        <Typography>{summaryValues.numberOfItems}</Typography>
      </Grid>

      <Grid item xs={ 6 } >
        <Typography>Subtotal</Typography>
      </Grid>

      <Grid item xs={ 6 } display='flex' justifyContent='end'>
        <Typography>{format(summaryValues.subTotal)}</Typography>
      </Grid>

      <Grid item xs={ 6 } display='flex'>
        <Typography>Impuestos (15%)</Typography>
      </Grid>

      <Grid item xs={ 6 } display='flex' justifyContent='end'>
        <Typography>{format(summaryValues.tax)}</Typography>
      </Grid>
      

      <Grid item xs={ 6 } display='flex' sx={{ mt: 3 }}>
        <Typography variant='subtitle1'>Total:</Typography>
      </Grid>

      <Grid item xs={ 6 } display='flex' justifyContent='end' sx={{ mt: 3 }}>
        <Typography variant='subtitle1'>{format(summaryValues.total)}</Typography>
      </Grid>

    </Grid>
  )
}

