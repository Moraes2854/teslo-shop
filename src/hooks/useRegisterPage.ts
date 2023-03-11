import { useState, useContext } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { AuthContext } from '../context';

type FormData = {
    name    : string;
    email   : string;
    password: string;
};

export const useRegisterPage = ( ) => {

  const router = useRouter();
  const { registerUser } = useContext( AuthContext )
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [ showError, setShowError ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState<string|null>(null);

  const onRegisterUser = async( { name, email, password }: FormData ) => {
    
    setShowError( false );
    setErrorMessage( null );

    const { hasError, message } = await registerUser( name, email, password );

    if ( hasError ) {

      setErrorMessage( message ); 

      setShowError( true );
      
      setTimeout(() => {
          setShowError(false);
      }, 3000);

      return;
    }

    // const destination = router.query.page?.toString() || '/';

    // router.replace(destination);
    await signIn('credentials', { email, password });
  }

  return {
      errorMessage,
      showError,
      errors,
      register,

      handleSubmit,
      onRegisterUser,

  }

}