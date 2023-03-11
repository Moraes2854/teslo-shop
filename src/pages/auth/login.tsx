import { GetServerSideProps } from 'next'
import NextLink from 'next/link';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

import { Box, Grid, Typography, TextField, Button, Link, Chip, Divider } from '@mui/material';
import { ErrorOutlined } from '@mui/icons-material';

import { AuthLayout } from '../../components/layouts';
import { isEmail } from '../../utils';
import { useLoginPage } from '../../hooks';





const LoginPage = () => {
    const router = useRouter();
  
    const { 
        
        errors,
        showError,
        register,

        handleSubmit,
        onLoginUser,
        providers,

    } = useLoginPage();


  return (
    <AuthLayout title='Login'>
        <form onSubmit={ handleSubmit( onLoginUser ) } >
            <Box sx={{ width: 450, padding: '10px 20px' }} >

                <Grid container spacing={ 2 }>

                    <Grid item xs={ 12 } display='flex' justifyContent='center' flexDirection='column'>
                        <Typography variant='h1' component='h1' textAlign='center'>Iniciar sesión</Typography>
                        {
                            showError && (
                                <Chip 
                                    label="No reconocemos ese usuario y/o contraseña"
                                    color="error"
                                    className="fadeIn"
                                    icon={<ErrorOutlined />}
                                />
                            )
                        }
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
                                ...register('password',{ 
                                    required: { message: 'Este campo es requerido', value: true }, 
                                    minLength: { value: 6, message: 'Se necesitan mínimo 6 caracteres'}
                                }) 
                            }
                            error={ !!errors.password }
                            helperText={ errors.password?.message } 
                        />
                    </Grid>

                    <Grid item xs={ 12 }>
                        <Button 
                            type='submit'
                            color="primary" 
                            className='circular-btn' 
                            size='large' 
                            fullWidth
                            disabled = { showError }
                        > 
                            Ingresar
                        </Button>
                    </Grid>

                    <Grid item xs={ 12 } display='flex' justifyContent='end'>
                        <NextLink href={`/auth/register?page=${ router.query.page?.toString() || '/auth/register' }`} passHref legacyBehavior>
                            <Link underline='always'>
                                ¿Aún no estas registrado?
                            </Link>
                        </NextLink>
                    </Grid>

                    <Grid item xs={ 12 } display='flex' flexDirection='column' justifyContent='end'>
                        <Divider sx={{ width: '100%', mb: 2 }} />
                        {

                            Object.values( providers ).map( ( p: any ) => {
                                if ( p.name !== 'Custom Login') {
                                    return (
                                        <Button
                                            key={ p.id }
                                            variant='outlined'
                                            fullWidth
                                            color='primary'
                                            sx={{ mb: 1 }}
                                            onClick={ () => signIn( p.id ) }
                                        >
                                            { p.name }
                                        </Button>
                                    )
                                }
                            })
                                
                        }
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

export default LoginPage;