import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Button, Form } from "react-bootstrap";
import {
  useGetAllCategoriesQuery,
  useCreatePostMutation,
  useUploadImageMutation,
  useUpdatePostMutation,
} from "../service/ApiUtils";
import { userDetails } from "./Login";
import { toast } from "react-toastify";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const CreatePost = () => {
  const [searchParams]=useSearchParams();
  const navigate=useNavigate();
  const categoryData = useGetAllCategoriesQuery();
  const [createPostFunc, createPostResponse] = useCreatePostMutation();
  const [uploadImage, uploadImageResponse] = useUploadImageMutation();
  const [updatePost,updatePostResponse]=useUpdatePostMutation()
  const initialState = {
    title: searchParams.size>0 ? searchParams.get("title") : "",
    description: searchParams.size>0 ? searchParams.get("description") : "",
    categoryType:searchParams.size>0 ? Number(searchParams.get("category")) : "",
  };
  
  const [required, setRequired] = useState([
    "title",
    "description",
    "categoryType",
  ]);
  const [postData, setPostData] = useState(initialState);
  useEffect(()=>{
   setPostData(initialState)
  },[searchParams])
  
  const [img, setImg] = useState("");

  const [errors, setErrors] = useState({});
  const [postId, setPostId] = useState();
  const handleChage = (e) => {
    const { name, value } = e.target;
    let newRequired = [...required];
    let newErrors = { ...errors };
    if (name === "title" || name === "description") {
      if (value.length <= 2) {
        newErrors[name] = `${name} should be more than 2 characters`;
      } else {
        delete newErrors[name];
      }
    }
    if (value === "") {
      newRequired.push(name);
    } else {
      newRequired = required.filter((item) => item !== name);
    }
    setRequired(newRequired);
    setErrors(newErrors);
    setPostData({ ...postData, [name]: value });
  };
  const handleReset = () => {
    setPostData(initialState);
    setErrors({});
    setRequired(["title", "description", "categoryType"]);
  };
  const handleSubmit = () => {
    const details = userDetails();
    
    if(!searchParams.size){
      const payload = {
        postData,
        userId: details.id,
        categoryId: postData.categoryType,
      };
    createPostFunc(payload).then((data) => {
      setPostId(data.data.id);
    });
    }
    else{
      let postId=searchParams.get("id")
      const payload={
        postData,
        postId:Number(postId)
      }
      updatePost(payload)
    }
  };

  useEffect(() => {
   
    if (createPostResponse.isSuccess && postId) {
      const imgData = {
        postId,
        img,
      };
    
      uploadImage(imgData);
      toast.success("Post created successfully");
      
    }
    else if(updatePostResponse.isSuccess){
      const imgData={
        postId:searchParams.get("id"),
        img
      }
      uploadImage(imgData);
      toast.success("Post updated successfully")
      navigate("/private/post")
    }
    setPostData(initialState);
    setRequired(["title", "description", "categoryType"]);
      
  }, [createPostResponse.isSuccess, postId,updatePostResponse.isSuccess]);

  useEffect(() => {
    if (createPostResponse.isError || updatePostResponse.isError) {
      toast.error("Something went wrong!!");
    }
  }, [createPostResponse.isError,updatePostResponse.isError]);

  const hasError = (name) => {
    const keys = Object.keys(errors);
    return keys.includes(name);
  };
  const imgHandler = (e) => {
    setImg(e.target.files[0]);
  };

  return (
    <div>
      <Sidebar />
      <div
        className="d-flex justify-content-center"
        style={{ paddingTop: "4%" }}
      >
        <Form style={{ width: "50%" }}>
          <Form.Group className="m-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              className={hasError("title") ? "is-invalid" : ""}
              type="text"
              placeholder="Enter title for post"
              name="title"
              value={postData.title}
              onChange={handleChage}
            />
            <Form.Control.Feedback type="invalid">
              {errors["title"]}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="m-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              type="text"
              className={hasError("description") ? "is-invalid" : ""}
              placeholder="Enter description for post"
              name="description"
              value={postData.description}
              onChange={handleChage}
            />
            <Form.Control.Feedback type="invalid">
              {errors["description"]}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="m-3">
            <Form.Label>Choose image</Form.Label>
            <Form.Control type="file" name="image" onChange={imgHandler} />
          </Form.Group>
          <Form.Group className="m-3">
            <Form.Select
              name="categoryType"
              value={postData.categoryType}
              onChange={handleChage}
              disabled={searchParams.size}
            >
              <option>Choose Category</option>
              {categoryData.isSuccess &&
                categoryData?.data?.map((category, index) => {
                  return (
                    <option key={index} value={category.id}>
                      {category.title}
                    </option>
                  );
                })}
            </Form.Select>
          </Form.Group>
          <Button
            variant="info"
            className="m-3 p-2"
            style={{ width: "96%" }}
            // disabled={(!searchParams || Object.keys(errors).length)&& (required.length || Object.keys(errors).length) }
            disabled={(!searchParams.size && required.length) || Object.keys(errors).length }
            onClick={handleSubmit}
          >
            Create Post
          </Button>
          <Button
            variant="warning"
            className="m-3 p-2"
            style={{ width: "96%" }}
            onClick={handleReset}
          >
            Reset
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CreatePost;
