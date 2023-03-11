import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ClientSafeProvider, getProviders, LiteralUnion, signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import { AuthContext } from '../context';
import { BuiltInProviderType } from 'next-auth/providers';

type FormData = {
    email: string,
    password: string,
};

export const useLoginPage = ( ) => {
    
    const router = useRouter();

    const { loginUser } = useContext( AuthContext )
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [ showError, setShowError ] = useState(false);
    const [providers, setProviders] = useState<any>({});

    useEffect(() => {

      getProviders().then( ( prov ) => {
        setProviders( prov );
      });

    }, [])

    useEffect(() => {
      if ( router.query.error ) {
        setShowError( true );
        setTimeout(() => {
            setShowError(false);
        }, 4500);
      }
    }, [])
    

    const onLoginUser = async( { email, password }: FormData ) => {
      
      setShowError( false );
      
      signIn('credentials', { email, password } )
      .then( ( response ) => console.log({ ...response }) )
      .catch( ( err ) => console.log( { ...err }))

      
      // const isValidLogin = await loginUser( email, password );
      // if ( !isValidLogin ) {
      //   setShowError( true );
      //   setTimeout(() => {
      //       setShowError(false);
      //   }, 3000);
      //   return;
      // }
      // const destination = router.query.page?.toString() || '/';
      // router.replace( destination );
      
  
    }

    return {
        errors,
        showError,
        register,

        handleSubmit,
        onLoginUser,
        providers,

    }

}