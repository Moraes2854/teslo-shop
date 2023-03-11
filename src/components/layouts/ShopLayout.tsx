import Head from "next/head"
import { FC } from "react"
import { Navbar, Sidebar } from "../ui";

interface ShopLayoutProps {
    children: JSX.Element | JSX.Element[];
    imageFullUrl?: string;
    pageDescription: string;
    title: string;
}

export const ShopLayout: FC<ShopLayoutProps> = ({ children, imageFullUrl, pageDescription, title }) => {
  return (
    <>
      <Head>
          <title>{ title }</title>

          <meta name="description" content={ pageDescription } />
          
          
          <meta name="og:title" content={ title } />
          <meta name="og:description" content={ pageDescription } />

          {
              imageFullUrl && (
                  <meta name="og:image" content={ imageFullUrl } />
              )
          }

      </Head> 

      <nav>
          <Navbar />
      </nav>

      <Sidebar />

        <main style={{
            margin: '80px auto',
            maxWidth: '1440px',
            padding: '0px 30px'
        }}>
            { children }
        </main>

        {/* Footer */}
        <footer>
            {/* TODO: mi custom footer */}
        </footer>

    </>
  )
}
