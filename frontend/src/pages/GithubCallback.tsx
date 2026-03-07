import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

const GithubCallback = () => {
    const navigate = useNavigate();

    useEffect(()=>{
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get("code");
        // console.log(code);

        if(code){
            const back_callback = async () => {
                const res = await axios.post(`${API_BASE_URL}/users/auth/${code}`,{ code: JSON.stringify({code})},{
                    withCredentials:true,
                    headers:{
                        'Access-Control-Allow-Origin': '*',
                        "Content-Type":"application/json"
                    }
                });

                console.log(res.headers)
                if(res.status == 200 || res.status == 201){
                    console.log("Login Successfull!");
                    // localStorage.setItem("token",token);
                    navigate("/");
                }
            }

            back_callback();
        }
    },[navigate]);

    return <p>Authorizing....</p>
}

export default GithubCallback;