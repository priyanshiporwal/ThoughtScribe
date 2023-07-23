import React from 'react'
import { isLoggedIn } from './Login'
import { Navigate, Outlet} from 'react-router-dom'

const Private = () => {
  if(isLoggedIn()){
    return <Outlet/>
  } 
  return <Navigate to="/login"/>
}

export default Private
