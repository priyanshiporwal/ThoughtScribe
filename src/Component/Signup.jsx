import React, { useEffect, useState } from 'react'
import { Form , Button} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useCreateUserMutation } from '../service/ApiUtils'
import {toast} from "react-toastify"

const Signup = () => {
  const navigate=useNavigate()
  let initialState={
    name:"",
    username:"",
    password:"",
    about:""
  }
  const [error,setError]=useState({});
  const [required,setRequired]=useState(["name","username","password","about"])
  const [data,setData]=useState(initialState)
  const [createAccount,createAccountResponse]=useCreateUserMutation()

  const handleChange=(e)=>{
    const {name,value}=e.target
    let newRequired=[...required]
    let newError={...error}
    if(value.length){
      newRequired=newRequired.filter((req)=>{
        return (
          req!==name
      )
      })
    }
    if(name==="password"){
      let passw=/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
      if( (value.length<7 || value.length>15)){
        newError[name]="Password should be between 7 to 14 characters"
      }
      else if(!value.match(passw)){
        newError[name]="Password should contain atleast one number and one special character"
      }
      
      else{
        delete newError[name]
      }
    }
    if(name==="username"){
      let email=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if(!value.match(email)){
        newError[name]="Invalid Email"
      }
      else{
        delete newError[name]
      }
    }
    else{
      if(value.length<3){
        newError[name]=`${name} should contain atleast 3 characters`
       
      }
      else{
        delete newError[name]
      }
    }
    setRequired(newRequired)
    setError(newError)
    setData({...data,[name]:value})
  }

  const hasError=(name)=>{
   return (Object.keys(error)).includes(name)
  }

  const handleSubmit=()=>{
    createAccount(data)
  }
  useEffect(()=>{
   if(createAccountResponse.isSuccess){
    toast.success("Account created successfully")
    navigate("/login")
   }
  },[createAccountResponse.isSuccess])

  useEffect(()=>{
    if(createAccountResponse.isError){
      if(createAccountResponse.error?.data?.message){
        toast.error(createAccountResponse.error?.data?.message)
      }
      else{
     toast.error("Something went wrong")
      }
    }
   },[createAccountResponse.isError])

  return (
    <>
      <div className="header">
        <h1 className="p-3">ThoughtScribe</h1>
      </div>
      <div
        style={{ height: "90%", width: "100vw"}}
        className="d-flex flex-column justify-content-center align-items-center"
      >
        <Form style={{ width: "45%" }} className="mt-1">
          <h1 className="m-3">Hi, Welcome to ThoughtScribe!</h1>
          <Form.Group className="m-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              className={hasError("name") ? "is-invalid" : ""}
              placeholder="Enter your name"
              name="name"
             value={data.name}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">{error["name"]}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="m-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Username"
              className={hasError("username") ? "is-invalid" : ""}
              name="username"
             value={data.username}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">{error["username"]}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="m-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              className={hasError("password") ? "is-invalid" : ""}
              placeholder="Enter Password"
              name="password"
             value={data.password}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">{error["password"]}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="m-3">
            <Form.Label>About</Form.Label>
            <Form.Control
              type="text"
              placeholder="Tell us something about yourself"
              className={hasError("about") ? "is-invalid" : ""}
              name="about"
             value={data.about}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">{error["about"]}</Form.Control.Feedback>
          </Form.Group>
          <Button
            className="m-3"
            style={{ width: "95%" }}
            onClick={handleSubmit}
            disabled={required.length || Object.keys(error).length}
          >
            Sign up
          </Button>
          <Link className="m-3" to="/login">Already have an account?</Link>
        </Form>
      </div>
    </>
  )
}

export default Signup
