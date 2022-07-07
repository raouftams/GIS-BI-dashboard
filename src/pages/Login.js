import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const navigate = useNavigate()
    const [loginError, setLoginError] = useState()
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    const connect = () => {
        if(username === 'admin' && password === 'admin'){
            navigate("/dashboard")
        }else{
            setLoginError("Nom d'utilisateur ou mot de passe incorrect")
        }
    }

    const getUsername = (e) => {
        if(e.target.value !== username){
            setUsername(e.target.value)
        }
    }

    const getPassword = (e) => {
        if(e.target.value !== password){
            setPassword(e.target.value)
        }
    }
    

    return (
        <div className="bg-dark-50 w-full h-screen rounded-lg">
            <div className='bg-dark-100 w-2/5 h-86 py-5 mx-auto my-36'>
                <p className='text-center text-gray-300 font-bold text-3xl'>Se connecter</p>
                {loginError ? 
                    <p className='text-red-600 bg-red-100 border border-red-300 rounded-sm mx-14 h-8 py-1 text-center mt-2'>{loginError}</p> 
                : 
                    null
                }
                <div className='flex flex-col justify-center mt-2 mb-5'>
                    <div className='flex flex-col mx-10 mt-4 mb-2'>
                        <label className='text-white mx-4'>Nom d'utilisateur:</label>
                        <input value={username} onChange={e => getUsername(e)} className='bg-dark-50 text-white font-medium text-base border border-gray-300 rounded-sm mx-4 h-9 px-1' type='text' name='username'/>
                    </div>
                    <div className='flex flex-col mx-10 mt-4 mb-2'>
                        <label className='text-white mx-4'>Mot de passe:</label>
                        <input onChange={e => getPassword(e)} className='bg-dark-50 text-white font-medium text-base border border-gray-300 rounded-sm mx-4 h-9 px-1' type='password' name='username'/>
                        <a className='text-white text-sm mx-4 mt-2 hover:text-blue-400' href='#'>Mot de passe oublié ?</a>
                    </div>
                    <div className='flex justify-center mt-5'>
                        <button className='w-2/5 h-10 bg-gray-200 text-dark-100 rounded-sm hover:bg-gray-700 hover:text-white' onClick={connect}>Se connecter</button>
                    </div>
                </div>

            </div>
        </div>
  )
}

export default Login