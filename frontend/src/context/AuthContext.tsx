import axios from "axios";
import {createContext, useContext, useEffect, useState} from "react";
import type { ReactNode } from "react";
import { API_BASE_URL } from "../config";

interface AuthContextType {
    isLoggedIn:boolean;
    user:any;
    loading:boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children} : {children:ReactNode}) => {
    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const [user,setUser] = useState<any>(null);
    const [err,setError] = useState("");
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        const fetchCurrentUser = async () => {
            try{
                const res = await axios.get(`${API_BASE_URL}/users/me`,{withCredentials:true});
                setUser(res.data[0]);
                setIsLoggedIn(true);
            }catch(err:any){
                setError(err);
            }finally {
                setLoading(false)
            }
        }

        fetchCurrentUser();
    }, []);

    return (
        <AuthContext value={{isLoggedIn,user,loading}}>
            {children}
        </AuthContext>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error("useAuth must be within AuthProvider");
    return context;
};