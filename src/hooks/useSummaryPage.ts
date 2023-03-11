import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CartContext } from '../context';
import Cookies from 'js-cookie';


export const useSummaryPage = () => {

  const router = useRouter();
  const { shippingAddress, numberOfItems, createOrder } = useContext( CartContext );
  const [ isPosting, setIsPosting ] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // useEffect(() => {
  //   if ( !Cookies.get('firstName') ) {
  //       router.push('/checkout/address');
  //   }
  // }, [ router ]);

  const onCreateOrder = async () => {
    
    setIsPosting(true);
    
    const { hasError, message } = await createOrder();

    if ( hasError ){
        setIsPosting( false );
        setErrorMessage( message );
        return;
    }

    return router.replace(`/orders/${ message }`);

  }

  return {
    errorMessage,
    isPosting,
    numberOfItems,
    onCreateOrder,
    shippingAddress,
  }
}