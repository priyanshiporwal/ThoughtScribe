import React from 'react'
import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Login from './Login'
import "../style/global.css"

const Sidebar = () => {
  return (
    <>
    <div style={{backgroundColor:"#212529",color:"white", textDecoration:"none", position:"fixed", width:"100%"}} className='d-flex justify-content-around p-3 mt-0'>
     
    <NavLink end to="/private/post/create" activeClassName="active" className="nav">Create Post</NavLink>
      <NavLink end to="/private/post" className="nav" activeClassName="active">News Feed</NavLink>
      <NavLink end to="/private/myPost" className="nav" activeClassName="active">My Posts</NavLink>
      {/* <NavLink end to="/private/create/category" className="nav" activeClassName="active">Category</NavLink> */}
      <NavLink end to="/logout" className="nav" activeClassName="active">Logout</NavLink>
    </div>
    </>
  )
}

export default Sidebar
