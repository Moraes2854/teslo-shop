import { GetServerSideProps } from 'next'
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Grid, Typography, TextField, Button, Link, Chip } from '@mui/material';
import { ErrorOutlined } from '@mui/icons-material';

import { AuthLayout } from '../../components/layouts';
import { useRegisterPage } from '../../hooks';
import { isEmail } from '../../utils';
import { getSession } from 'next-auth/react';


const RegisterPage = () => {
    const router = useRouter();

    const { 

        errorMessage,
        showError,
        errors,
        register,

        handleSubmit,
        onRegisterUser,

    } = useRegisterPage();


  return (
    <AuthLayout title='Registro'>
        <form onSubmit={ handleSubmit(onRegisterUser) } >

            <Box sx={{ width: 350, padding: '10px 20px' }} >

                <Grid container spacing={ 2 }>

                    <Grid item xs={ 12 }>
                        <Typography variant='h1' component='h1'>Crear cuenta</Typography>
                        {
                            showError && (
                                <Chip 
                                    label={ errorMessage }
                                    color="error"
                                    className="fadeIn"
                                    icon={<ErrorOutlined />}
                                />
                            )
                        }
                    </Grid>

                    <Grid item xs={ 12 }>
                        <TextField 
                            label='Nombre completo' 
                            variant='filled'
                            fullWidth
                            { 
                                ...register('name', { 
                                    required: { message: 'Este campo es requerido', value: true }, 
                                    // validate: isEmail
                                }) 
                            }
                            error={ !!errors.name }
                            helperText={ errors.name?.message } 
                        />
                    </Grid>

                    <Grid item xs={ 12 }>
                        <TextField 
                            type='email'
                            label='Correo' 
                            variant='filled' 
                            fullWidth 
                            { 
                                ...register('email', { 
                                    required: { message: 'Este campo es requerido', value: true }, 
                                    validate: isEmail
                                }) 
                            }
                            error={ !!errors.email }
                            helperText={ errors.email?.message } 
                        />
                    </Grid>

                    <Grid item xs={ 12 }>
                        <TextField 
                            label='Contaseña' 
                            type='password' 
                            variant='filled' 
                            fullWidth 
                            { 
                                ...register('password', { 
                                    required: { message: 'Este campo es requerido', value: true }, 
                                    // validate: isEmail
                                }) 
                            }
                            error={ !!errors.password }
                            helperText={ errors.password?.message } 
                        />
                    </Grid>

                    <Grid item xs={ 12 }>
                        <Button 
                            type="submit"
                            color="primary" 
                            className='circular-btn' 
                            size='large' 
                            fullWidth
                            disabled={ showError }
                        > 
                            Registarse
                        </Button>
                    </Grid>

                    <Grid item xs={ 12 } display='flex' justifyContent='end'>
                        <NextLink href={`/auth/login?page=${ router.query.page?.toString() || '/auth/login' }`} passHref legacyBehavior>
                            <Link underline='always'>
                                ¿Ya estas registrado?
                            </Link>
                        </NextLink>
                    </Grid>

                </Grid>
            </Box>
        </form>

    </AuthLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const session = await getSession({ req });
    const { page = '/' } = query;

    if ( session ) {
        return {
            redirect: {
                destination: page.toString(),
                permanent: false,
            }
        }
    }

    return {
        props: { }
    }

}

export default RegisterPage;