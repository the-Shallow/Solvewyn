import {QueryClient , QueryClientProvider} from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import ProblemDetail from "./pages/ProblemDetail";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import GithubCallback from "./pages/GithubCallback";
import Problems from "./pages/Problems";

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/submission/:id" element={
                            <ProtectedRoute>
                                <ProblemDetail />
                            </ProtectedRoute>
                            } />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/auth/callback" element={<GithubCallback />} />
                        <Route path="/" element={
                            <ProtectedRoute>
                            <Problems />
                            </ProtectedRoute>
                            } />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;
