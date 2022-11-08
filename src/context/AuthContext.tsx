import { createContext, ReactNode, useState, useEffect } from "react";
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google'

import {api} from '../services/api'

WebBrowser.maybeCompleteAuthSession();
interface UserProps{
    name: string
    avatarUrl: string
}
export interface AuthContextDataProps{
    user : UserProps;
    singIn: () => Promise<void>
    isUserLoading: Boolean;
}

interface AuthProviderProps{
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({children} : AuthProviderProps){
    const [isUserLoading, setIsUserLoading] = useState(false)
    const [user, setUser] = useState<UserProps>({} as UserProps)

   const [request, response, prompAsync] =  Google.useAuthRequest({
        clientId: '605336444401-j7n7bd69gn3tecbc42mj9r2h941vvrvg.apps.googleusercontent.com',
        redirectUri: AuthSession.makeRedirectUri({useProxy: true}),
        scopes: ['profile', 'email']
    })
   
    async function singIn(){
   try{
    setIsUserLoading(true)
    await prompAsync();
   }catch(error)
   {
    console.log(error)
    throw error;
   }finally{
    setIsUserLoading(false)
   }
    }

    async function signInWithGoogle(acess_token:string) {
        try {
            setIsUserLoading(true);
            const tokenResponse = await api.post('/users', { acess_token });
            
            api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`;

            console.log(acess_token)

            const userInfoResponse = await api.get('/me');
            setUser(userInfoResponse.data.user)
        } catch (error) {
            console.log(error)
        }finally{
            setIsUserLoading(false)
        }
    }
    useEffect(()=>{
        if(response?.type === 'success' && response.authentication?.accessToken){
            signInWithGoogle(response.authentication?.accessToken)
        }
    },[response])
    return(
        <AuthContext.Provider value={{
            singIn,
            isUserLoading,
            user,
        }}>
            {children}
        </AuthContext.Provider>
    )
}