import { FC } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

interface ItemCounterProps {

  onAddButtonClick: ( newValue: number ) => void;
  onRemoveButtonClick: ( newValue: number ) => void;
  currentValue: number;
  maxValue?: number;

}

export const ItemCounter: FC<ItemCounterProps> = ({ currentValue, onAddButtonClick, onRemoveButtonClick, maxValue }) => {

  return (
    <Box display='flex' alignItems='center' >
        <IconButton onClick={ () => onRemoveButtonClick( currentValue - 1 ) }>
            <RemoveCircleOutline/>
        </IconButton>
        <Typography sx={{ width: 40, textAlign: 'center' }}>{ currentValue }</Typography>
        <IconButton onClick={ () => onAddButtonClick( currentValue + 1) }>
            <AddCircleOutline />
        </IconButton>
    </Box>
  )
}
