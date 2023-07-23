import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const PostStructure = ({user,title,description,id}) => {
  return (
    <>
    <div className='d-flex flex-column align-items-center m-3'>
      <h1>{user}</h1>
      <h3>{title}</h3>
      <h4>{description.substr(0,5)+"..."}<Link to={`/private/post/${id}`}>Read More</Link></h4>
    </div>
    <hr/>
    </>
  )
}

export default PostStructure
