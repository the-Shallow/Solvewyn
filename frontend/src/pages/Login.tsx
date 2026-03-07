import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Navigate } from "react-router-dom"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Eye, EyeOff, ArrowLeft, Github } from "lucide-react"
import axios from "axios"
import { GITHUB_REDIRECT_URI } from "../config";

console.log(import.meta.env)


const Login = () => {
    const { login } = useAuth();
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [showPassword,setShowPassword] = useState(false)
    const navigate = useNavigate();
    const GITHUB_CLIENT_ID = "Ov23liZL9Kiq6pk9zkO3";
    const REDIRECT_URI = GITHUB_REDIRECT_URI;
    const handleGithubLogin = async (e:React.FormEvent) => {
        e.preventDefault()
        // console.log("Login attempt: ", {email,password});

        try {
            window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email`
        }catch(err:any){
            console.error("Login Failed", err);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Sign in to continue</h1>
                    <p className="text-lg text-muted-foreground">Welcome to Solvewyn</p>
                </div>

                <Card className="shadow-strong border-0">
                    <CardContent className="p-8">
                        <Button
                            onClick={handleGithubLogin}
                            variant="outline"
                            className="w-full h-12 text-base font-medium border-2 hover:bg-accent/50 transition-all duration-200"
                        >

                            <Github className="h-5 w-5 mr-3"/>
                            Continue with Github
                        </Button>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                By signing in, you agree to our {""}
                            </p>
                            <Link
                                to="/terms"
                                className="text-primary hover:underline"
                            >
                                Terms of Service
                            </Link>
                            {" "} and {" "}
                            <Link
                                to="/privacy"
                                className="text-primary hover:underline"
                            >
                                Privacy Policy
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Login;