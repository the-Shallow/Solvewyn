import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { JSX } from "react";

const ProtectedRoute = ({children} : {children : JSX.Element}) => {
    const {isLoggedIn, loading} = useAuth();
    console.log(loading,isLoggedIn)

    if(loading){
        return
    }
    return !isLoggedIn ? <Navigate to="/login" replace /> : children
};

export default ProtectedRoute;