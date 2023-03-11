import NextAuth, { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

import { checkUserEmailPassword } from '../../../database';
import { oAuthToDbUser } from '../../../database/dbUsers';

export const authOptions: AuthOptions = {
  providers: [

    CredentialsProvider({
      name: 'Custom Login',

      credentials: {
        email: { label: 'Correo', type: 'email', placeholder: 'correo@google.com'},
        password: { label: 'Contraseña', type: 'password', placeholder: 'Contraseña'},
      },

      async authorize(credentials){

        return await checkUserEmailPassword( credentials?.email || '', credentials?.password || '' );
      }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),

  ],

  pages:{
    error: '/auth/login',
    newUser: '/auth/register',
    signIn:'/auth/login',   
  },

  session:{
    maxAge: 2592000,
    strategy: 'jwt',
    updateAge: 86400,
  },

  callbacks: {
    
    async jwt({ token, account, user }){

      if ( account ){
        token.accessToken = account.access_token;

        switch( account.type ) {

          case 'oauth':
            token.user = await oAuthToDbUser( user?.email || '', user?.name || '');
          break;
          
          case 'credentials':
            token.user = user;
          break;
        
        }
      }


      return token;
    },

    async session({ session, token, user }){

      //@ts-ignore;
      session.accessToken = token.accessToken;
      session.user = token.user as any;
      
      return session;
    },
  }
}

export default NextAuth(authOptions);