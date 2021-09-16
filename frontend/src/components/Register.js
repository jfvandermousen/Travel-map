import React, {useState, useRef} from 'react'
import './register.css'
import { Room, Cancel } from '@material-ui/icons';
import axios from "axios";

export default function Register({setShowRegister}) {

    const [success,setSuccess] = useState(false);
    const [error,setError] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handlesubmit = async(e) => {  
        e.preventDefault();
        const newUser = {
            username:nameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value,
        };

        try {
            await axios.post("/users/register",newUser);
            setError(false)
            setSuccess(true)
        } catch (error) {
            setError(true)
            
        }



    }


    return (
        <div className="registerContainer">
        <Cancel className="registerCancel" onClick={()=>setShowRegister(false)}/>
            <div className="logo ">
                    <Room />
                    <div><b className="">TravelPin</b></div>
                    
            </div>
            
            
            <form onSubmit={handlesubmit}>
                <input type="text" placeholder="username" ref={nameRef}/>
                <input type="email" placeholder="email" ref={emailRef}/>
                <input type="password" placeholder="password" ref={passwordRef}/>
                <button className="registerBtn">Register</button>
                {success && (
                    <span className="success">Successfull!<br/>You can login now.</span>
                )}
                {error && (
                    <span className="error">Something went wrong</span>
                )}
                
            </form>
            
            
        </div>

    )
}
