import { useRouter } from 'next/router';
import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';

import { countries } from '../utils';
import { ShippingAddress } from '../interfaces';
import { CartContext } from '../context/cart/CartContext';

const getAddressFromCookies = (): ShippingAddress => ({
    address   : Cookies.get('address')   || '',
    address2  : Cookies.get('address2')  || '',
    city      : Cookies.get('city')      || '',
    country   : Cookies.get('country')   || countries[0].code,
    firstName : Cookies.get('firstName') || '',
    lastName  : Cookies.get('lastName')  || '',
    phone     : Cookies.get('phone')     || '',
    zip       : Cookies.get('zip')       || '',
})

export const useAddressPage = ( ) => {
    
    const router = useRouter();

    const { updateAddress } = useContext( CartContext );

    const { register, handleSubmit, formState: { errors } } = useForm<ShippingAddress>({
        defaultValues: getAddressFromCookies(),
    });

    const [ showError, setShowError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState<string|null>(null);

    const onSubmitAddress = ( data: ShippingAddress ) => {
    
        updateAddress( data );

        router.push('/checkout/summary');

    }

    return {
        countries,
        errorMessage,
        errors,
        handleSubmit,
        onSubmitAddress,
        register,
        showError,
    }
}