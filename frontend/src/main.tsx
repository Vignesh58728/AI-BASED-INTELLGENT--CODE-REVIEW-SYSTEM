import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { ThemeProvider } from 'next-themes'

const GOOGLE_CLIENT_ID = "233739439925-n7khfukipgg2ce6g3gndki6rl1n1pefm.apps.googleusercontent.com"

ReactDOM.createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
         <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <App />
         </GoogleOAuthProvider>
      </ThemeProvider>
   </React.StrictMode>,
)
