import { FC } from "react"
import Head from 'next/head';
import { Sidebar } from "../ui";
import { AdminNavbar } from '../admin';
import { Box, Typography } from '@mui/material';

interface AdminLayoutProps {
    children: JSX.Element | JSX.Element[];
    title: string;
    subTitle: string;
    icon?: JSX.Element;
}

export const AdminLayout: FC<AdminLayoutProps> = ({ children, subTitle, title, icon }) => {
  return (
    <>
        <Head>
            <title>Admin</title>
        </Head>

        <nav>
            <AdminNavbar />
        </nav>

        <Sidebar />

            <main style={{
                margin: '80px auto',
                maxWidth: '1440px',
                padding: '0px 30px'
            }}>

                <Box display='flex' flexDirection='column' >
                    <Typography variant='h1'>
                        { icon }
                        { '  ' } { title }
                    </Typography>
                    <Typography variant='h2' sx={{ mb: 1 }}>{ subTitle }</Typography>
                </Box>

                <Box className='fadeIn'>
                    { children }
                </Box>
            </main>
    </>
  )
}
