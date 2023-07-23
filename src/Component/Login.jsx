import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import "../style/login.css"
import { useGetTokenMutation } from "../service/ApiUtils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const isLoggedIn=()=>{
  return localStorage.getItem("token")!==null
}
export const userDetails=()=>{
  return JSON.parse(localStorage.getItem("user"))
}
export const userToken=()=>{
  if(isLoggedIn){
    return localStorage.getItem("token")
  }
}
const Login = () => {
  const [createToken, getTokenResponse] = useGetTokenMutation();
  const navigate=useNavigate();
  const initialState = {
    username: "",
    password: "",
  };
  const [data, setData] = useState(initialState);
  const [required, setRequired] = useState(["username", "password"]);
  const handleChange = (e) => {
    let newRequired = [...required];
    const { name, value } = e.target;
    if (value === "") {
      newRequired.push(name);
    } else {
      newRequired = required.filter((item) => item !== name);
    }
    setData({ ...data, [name]: value });
    setRequired(newRequired);
  };
  useEffect(()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },[])
  const handleLogin = () => {
    createToken(data);
    
    // if(getTokenResponse.isSuccess){
    //   // toast.success("Logged In Successfully", {
    //   //   position: toast.POSITION.BOTTOM_CENTER,
    //   // });
    
    // localStorage.setItem("token",getTokenResponse?.data?.token)
    // localStorage.setItem("user",JSON.stringify(getTokenResponse?.data?.userDto))
    
    // }

    // // getTokenResponse.isError &&
    // //   toast.error("Bad Credentials", {
    // //     position: toast.POSITION.BOTTOM_CENTER,
    // //   });
  };
  useEffect(()=>{
   if(getTokenResponse.isSuccess){
    localStorage.setItem("token",getTokenResponse?.data?.token)
    localStorage.setItem("user",JSON.stringify(getTokenResponse?.data?.userDto))
    toast.success("Logged In Successfully", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      setTimeout(()=>{
        navigate("/private/post")
      },1000)
    
   }
  },[getTokenResponse.isSuccess])

  useEffect(()=>{
    if(getTokenResponse.isError){
     toast.error("Bad Credentials", {
         position: toast.POSITION.BOTTOM_CENTER,
       });
    }
   },[getTokenResponse.isError])

  return (
    <>
      <div className="header">
        <h1 className="p-5">ThoughtScribe</h1>
      </div>
      <div
        style={{ height: "80%", width: "100vw" }}
        className="d-flex flex-column justify-content-center align-items-center"
      >
        <Form style={{ width: "45%" }} className="mt-2">
          <h1 className="m-5">Hi, Welcome Back!</h1>
          <Form.Group className="m-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Username"
              name="username"
              value={data.username}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="m-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              name="password"
              value={data.password}
              onChange={handleChange}
            />
          </Form.Group>
          <Button
            className="m-3"
            style={{ width: "95%" }}
            onClick={handleLogin}
            disabled={required.length}
          >
            Log In
          </Button>
          <Link className="m-3" to="/">Don't have an account?</Link>
        </Form>
      </div>
    </>
  );
};

export default Login;
