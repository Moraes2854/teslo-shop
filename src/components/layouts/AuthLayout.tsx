import Head from "next/head"
import { FC } from 'react';
import { Box } from '@mui/material';

interface AuthLayoutProps {
    children: JSX.Element | JSX.Element[];
    title: string;
}

export const AuthLayout: FC<AuthLayoutProps> = ({ children, title}) => {
  return (
    <>
        <Head>
            <title>{ title }</title>
        </Head>
        <main>
            <Box display='flex' justifyContent='center' alignItems='center' height='calc( 100vh - 200px )' >
                { children }
            </Box>
        </main>
    </>
  )
}
