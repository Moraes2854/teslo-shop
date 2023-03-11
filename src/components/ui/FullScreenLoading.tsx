import { Box, CircularProgress, Typography } from '@mui/material';


export const FullScreenLoading = () => {
  return (
    <Box 
        flexDirection='column'
        display='flex' 
        justifyContent='center'
        alignItems='center' 
        height='calc(100vh - 200px)'
    >
        <Typography sx={{ mb: 3 }} variant='h2' component='h2' fontWeight={ 300 } fontSize={ 22 }>Cargando...</Typography>
        <CircularProgress thickness={ 2 }/>
    </Box>
  )
}
