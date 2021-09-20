import React, {useState, useRef} from 'react'
import './login.css'
import { Room, Cancel } from '@material-ui/icons';
import {axiosInstance} from "../config";

export default function Login({setShowLogin,setCurrentUsername, myStorage}) {

    const [error,setError] = useState(false);
    const nameRef = useRef();
    const passwordRef = useRef();

    const handlesubmit = async(e) => {  
        e.preventDefault();
        const user = {
            username:nameRef.current.value,
            password:passwordRef.current.value,
        };

        try {
            const res = await axiosInstance.post("/users/login",user);
            setCurrentUsername(res.data.username);
            myStorage.setItem("user",res.data.username);
            setShowLogin(false)
            setError(false)
        } catch (error) {
            setError(true)
            
        }



    }


    return (
        <div className="loginContainer">
        <Cancel className="loginCancel" onClick={()=>setShowLogin(false)}/>
            <div className="logo ">
                    <Room />
                    <div><b className="">TravelPin</b></div>
                    
            </div>
            
            
            <form onSubmit={handlesubmit}>
                <input type="text" placeholder="username" ref={nameRef}/>
                <input type="password" placeholder="password" ref={passwordRef} autocomplete="current-password "/>
                <button className="loginBtn">Login</button>

                {error && (
                    <span className="error">Something went wrong</span>
                )}
                
            </form>
            
            
        </div>

    )
}
