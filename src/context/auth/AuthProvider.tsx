import { FC, useReducer, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSession, signOut } from "next-auth/react";

import { AuthContext, authReducer } from './';
import { IUser, AuthResponse } from '../../interfaces';
import tesloApi from '../../api/tesloApi';

export interface AuthState {
    isLoggedIn: boolean;
    user: IUser|null;
}


const Auth_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: null,
}

interface AuthProviderProps {
    children: JSX.Element | JSX.Element[];
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    
    const { data, status } = useSession();
    const router = useRouter();

    const [ state, dispatch ] = useReducer( authReducer , Auth_INITIAL_STATE );

    const loginUser = async ( email: string, password: string ): Promise<boolean> => {

        try {
        
            const { data } = await tesloApi.post('/auth/login', { email, password } );
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
            return true;
        
        } catch (error) {
            return false;
        }

    }

    const registerUser = async ( name: string, email: string, password: string ): Promise<{ hasError: boolean; message: string; }> => {

        try {
            const { data } = await tesloApi.post('/user/register', { name, email, password } );
            const { token, user } = data;

            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });

            return {
                hasError: false,
                message: 'Usuario registrado existosamente',
            }

        } catch (error) {
            //@ts-ignore
            console.log( {...error} );
            if ( axios.isAxiosError( error ) ) {
                return {
                    hasError: true,
                    message: error.response?.data.message,
                }
            }

            return {
                hasError: true,
                message: 'No se pudo crear el usuario, intente de nueno',
            }
        }

    }

    const checkToken = async ( ) => {
        
        const token = Cookies.get('token');

        if ( !token ) return;

        try {

            const { data } = await tesloApi.get('/auth/validate-token');
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });

        } catch (error) {
            
            Cookies.remove('token');
            dispatch({ type: '[Auth] - Logout' });
        }

    }

    const logoutUser = () => {
        Cookies.remove('address');
        Cookies.remove('address2');
        Cookies.remove('city');
        Cookies.remove('country');
        Cookies.remove('firstName');
        Cookies.remove('lastName');
        Cookies.remove('phone');
        Cookies.remove('zip');
        Cookies.remove('cart');
        
        signOut();
       
        // Cookies.remove('token');
        // router.reload();

    }

    useEffect(() => {

        if ( status === 'authenticated' ) dispatch({ type: '[Auth] - Login', payload: data.user as IUser });

    }, [ data, status ])
    
    return (
        <AuthContext.Provider value={{
            ...state,
            loginUser,
            registerUser,
            logoutUser
        }}>
            { children }
        </AuthContext.Provider>
    )
};