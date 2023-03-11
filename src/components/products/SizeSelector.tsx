import { FC } from 'react';
import { Box, Button } from '@mui/material';

import { ValidSize } from '@/interfaces'

interface SizeSelectorProps {
  onSelectedSize: ( size: ValidSize ) => void;
  selectedSize?: ValidSize;
  sizes: ValidSize[];
}

export const SizeSelector: FC<SizeSelectorProps> = ({ onSelectedSize, selectedSize, sizes }) => {
  return (
    <Box>
      {
        sizes.map( (size) => (
          <Button
            key={ size }
            size='small'
            color={ selectedSize === size ? 'primary' : 'info' }
            onClick={ () => { 
              onSelectedSize( size ); 
            }}
          >
            { size }
          </Button>
        ))
      }
    </Box>
  )
}
