import { FormControl, Grid, MenuItem, TextField, Typography, Box, Button } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { useAddressPage } from '../../hooks';
import Cookies from 'js-cookie';

const AddressPage = () => {

  const {
    countries,
    errorMessage,
    errors,
    handleSubmit,
    onSubmitAddress,
    register,
    showError,
  } = useAddressPage();

  return (
    <ShopLayout title='Dirección' pageDescription='Confirmar dirección del destino' >

        <Typography variant='h1' component='h1'>Dirección</Typography>
        
        <form onSubmit={ handleSubmit( onSubmitAddress ) }>

            <Grid container spacing={ 2 } sx={{ mt: 2 }}>

                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField 
                        label='Nombre' 
                        variant='filled' 
                        fullWidth
                        { 
                            ...register('firstName', { 
                                required: { message: 'Este campo es requerido', value: true }, 
                            }) 
                        }
                        error={ !!errors.firstName }
                        helperText={ errors.firstName?.message } 
                    />
                </Grid>

                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField 
                        label='Apellido' 
                        variant='filled' 
                        fullWidth
                        { 
                            ...register('lastName', { 
                                required: { message: 'Este campo es requerido', value: true }, 
                            }) 
                        }
                        error={ !!errors.lastName }
                        helperText={ errors.lastName?.message }  
                    />
                </Grid>

                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField 
                        label='Dirección' 
                        variant='filled' 
                        fullWidth
                        { 
                        ...register('address', { 
                                required: { message: 'Este campo es requerido', value: true }, 
                            }) 
                        }
                        error={ !!errors.address }
                        helperText={ errors.address?.message }  
                    />
                </Grid>

                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField 
                        label='Dirección 2 (opcional)' 
                        variant='filled' 
                        fullWidth
                        { 
                            ...register('address2') 
                        }
                        error={ !!errors.address2 }
                        helperText={ errors.address2?.message }  
                    />
                </Grid>

                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField 
                        label='Código postal' 
                        variant='filled' 
                        fullWidth
                        { 
                            ...register('zip', { 
                                required: { message: 'Este campo es requerido', value: true }, 
                            }) 
                        }
                        error={ !!errors.zip }
                        helperText={ errors.zip?.message }  
                    />
                </Grid>

                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField 
                        label='Ciudad' 
                        variant='filled' 
                        fullWidth
                        { 
                            ...register('city', { 
                                required: { message: 'Este campo es requerido', value: true }, 
                            }) 
                        }
                        error={ !!errors.city }
                        helperText={ errors.city?.message }  
                    />
                </Grid>

                <Grid item xs={ 12 } sm={ 6 }>
                    <FormControl fullWidth>
                        <TextField
                            select
                            variant='filled'
                            label='País'
                            defaultValue={ Cookies.get('country') || countries[0].code }
                            { 
                                ...register('country', { 
                                    required: { message: 'Este campo es requerido', value: true }, 
                                }) 
                            }
                        >
                            {
                                countries.map( ({ code, name }) => <MenuItem key={ code } value={ code }>{ name }</MenuItem> )
                            }
                        </TextField>
                    </FormControl>
                </Grid>

                <Grid item xs={ 12 } sm={ 6 }>

                    <TextField 
                        label='Télefono' 
                        variant='filled'
                         
                        fullWidth
                        { 
                            ...register('phone', { 
                                required: { message: 'Este campo es requerido', value: true }, 
                            }) 
                        }
                        error={ !!errors.phone }
                        helperText={ errors.phone?.message }   
                    />

                </Grid>

            </Grid>
            
            <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
                <Button 
                    type='submit'
                    color='primary' 
                    className='circular-btn' 
                    size='large'
                >
                    Revisar pedido
                </Button>       
            </Box>
        </form>
    </ShopLayout>
  )
}








export default AddressPage;