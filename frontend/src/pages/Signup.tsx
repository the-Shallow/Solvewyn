import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader,CardTitle } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

const Signup = () => {
    // const {login} = useAuth();
    const [formData, setFormData] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        confirmPassword:""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value,
        });
    };

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        if(formData.password !== formData.confirmPassword){
            alert("Passwords don't match");
            return;
        }

        if(!agreeToTerms){
            alert("Please agree to the terms and conditions");
            return;
        }

        console.log("Signup attempt: " , formData);
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/auth/signup/email",formData);

            const {access_token} = response.data;
            
            // login(access_token);
            console.log("Login Successfull!");
            navigate("/profile");
        }catch(err:any){
            console.error("Login Failed", err);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Link to="/" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>

                <Card className="shadow-strong">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">
                            Create your account
                        </CardTitle>
                        <CardDescription>
                            Join PackHusky and find your prefect home
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input 
                                        id="firstName"
                                        name="firstName"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input 
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                    <Input 
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="john@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="h-11"
                                    />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input 
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="h-11 pr-10"
                                    />

                                    <button
                                        type="button"
                                        onClick={()=>setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input 
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="h-11 pr-10"
                                    />

                                    <button
                                        type="button"
                                        onClick={()=>setShowConfirmPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="terms"
                                    checked={agreeToTerms}
                                    onCheckedChange={(checked)=>setAgreeToTerms(checked as boolean)}
                                />

                                <Label htmlFor="terms" className="text-sm text-muted-foreground">
                                    I agree to the {" "}
                                    <Link to="/terms" className="text-primary hover:underline">
                                        Terms of Service
                                    </Link>{" "} and {" "}
                                    <Link to="/privacy" className="text-primary hover:underline">
                                        Privacy Policy 
                                    </Link>
                                </Label>
                            </div>
                            
                            <Button type="submit" className="w-full h-11 text-base">
                                Create Account
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Already have an account ? {" "}
                                <Link to="/login" className="text-primary hover:underline font-medium">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Signup