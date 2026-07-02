import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { ThemeProvider } from 'next-themes'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "743075831057-0i0esmvt13qbbmk4b49vc5182gfae8od.apps.googleusercontent.com"

ReactDOM.createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
         <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <App />
         </GoogleOAuthProvider>
      </ThemeProvider>
   </React.StrictMode>,
)
