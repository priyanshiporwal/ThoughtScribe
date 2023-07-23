import React, { useEffect, useState } from "react";
import { createSearchParams, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useGetPostByIdQuery,
  useGetAllCommentsOnPostQuery,
  useCreateCommentMutation,
  useGetAllCommentsQuery,
  useDeletePostMutation,
} from "../service/ApiUtils";
import Sidebar from "./Sidebar";
import defaul from "../images/defaul.png";
import Comment from "./Comment";
import { Button, Form } from "react-bootstrap";
import { userDetails } from "./Login";
import { toast } from "react-toastify";
import { BASE_URL } from "../Constants";
import CustomModal from "../common/CustomModal";
import Modal from "react-bootstrap/Modal";

const PostDetails = () => {
  const { id } = useParams();
  const { data, isSuccess, isError } = useGetPostByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const navigate = useNavigate();
  const [deleteWarning, setDeleteWarning] = useState(false);
  const details = userDetails();
  const queryParamComment = {
    id,
    pageNo: 0,
    pageSize: 5,
    sortBy: "date",
    sortDir: "desc",
  };
  const res = useGetAllCommentsOnPostQuery(queryParamComment, {
    refetchOnMountOrArgChange: true,
  });

  const [commentData, setCommentData] = useState({ content: "" });
  const [required, setRequired] = useState(["content"]);
  const [createComment, createCommentResponse] = useCreateCommentMutation();
  const [deletePost, deletePostResponse] = useDeletePostMutation();

  const [error, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newError = { ...error };
    let newRequired = [...required];
    newRequired = newRequired.filter((item) => item !== name);
    if (value.length < 3) {
      newError[name] = "Comment should be more than three characters";
    } else {
      delete newError[name];
    }
    setRequired(newRequired);
    setErrors(newError);
    setCommentData({ ...commentData, [name]: value });
  };
  const handleComment = () => {
    // const details = userDetails();

    const payload = {
      content: commentData,
      userId: details.id,
      postId: Number(id),
    };
    createComment(payload);
  };
  useEffect(() => {
    if (createCommentResponse.isSuccess) {
      setCommentData({ content: "" });
      toast.success("Comment added successfully");
    }
  }, [createCommentResponse.isSuccess]);
  useEffect(() => {
    if (createCommentResponse.isError) {
      toast.error("Something went wrong!");
    }
  }, [createCommentResponse.isError]);

  const hasError = (name) => {
    const keys = Object.keys(error);
    return keys.includes(name);
  };
  const handleDelete = () => {
    setDeleteWarning(true);
  };
  const hideModal = () => {
    setDeleteWarning(false);
  };
  useEffect(() => {
    if (deletePostResponse.isSuccess) {
      toast.success("Post deleted successfully");
      navigate("/private/myPost");
    }
  }, [deletePostResponse.isSuccess]);
  useEffect(() => {
    if (deletePostResponse.isError) {
      toast.error("Something went wrong!");
    }
  }, [deletePostResponse.isError]);
  return (
    <div>
      <Sidebar />
      <div
        className="d-flex flex-column align-items-center"
        style={{ paddingTop: "5%" }}
      >
        <h1>{data?.user?.name}</h1>
        <h3>{data?.title}</h3>
        <h4>{data?.description}</h4>
        <img
          src={`${BASE_URL}/public/get/image?imgName=${data?.image}`}
          width="60%"
          height="80%"
          alt="image"
        />
        <h6 style={{ marginLeft: "40%" }}>{data?.addedDate}</h6>
        {data && data.user.id === details.id && (
          <>
            <div className="d-flex flex-row">
              <Button variant="danger" className="mx-4" onClick={handleDelete}>
                Delete
              </Button>
              <Button
                variant="warning"
                className="mx-4"
                onClick={() =>
                  navigate({
                    pathname: "/private/post/create",
                    search : createSearchParams({
                      id:data.id,
                      title:data.title,
                      description:data.description,
                      category:data.category.id,
                      image:data.image
                    }).toString()
                  })
                }
              >
                Edit
              </Button>
            </div>
            {/* {deleteWarning && <CustomModal showModal={deleteWarning} hideModal={hideModal} isTrue={false}/>} */}
            {deleteWarning && (
              <Modal
                show={deleteWarning}
                onHide={hideModal}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header>
                  <Modal.Title>
                    Are you sure you want to delete this post?
                  </Modal.Title>
                </Modal.Header>
                {/* <Modal.Body>
              I will not close if you click outside me. Don not even try to press
              escape key.
            </Modal.Body> */}
                <Modal.Footer>
                  <Button variant="secondary" onClick={hideModal}>
                    No
                  </Button>
                  <Button
                    onClick={() => deletePost(Number(id))}
                    variant="danger"
                  >
                    Yes
                  </Button>
                </Modal.Footer>
              </Modal>
            )}
          </>
        )}
        <h1>Comments</h1>
      </div>
      <div
        className="d-flex flex-column justify-content-center"
        style={{ marginLeft: "20%", marginRight: "20%" }}
      >
        <Form className="my-5">
          <Form.Group>
            <Form.Control
              type="text"
              name="content"
              placeholder="write a comment"
              value={commentData.content}
              onChange={handleChange}
              className={hasError("content") ? "is-invalid" : ""}
            ></Form.Control>
            <Form.Control.Feedback type="invalid">
              {error["content"]}
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            className="mt-2"
            onClick={handleComment}
            disabled={Object.keys(error).length || required.length}
          >
            Comment
          </Button>
        </Form>
        {res.isSuccess &&
          res.data.commentDtos.map((comment) => {
            return (
              <Comment
                key={comment.id}
                name={comment.user.name}
                content={comment.content}
                date={comment.date}
              />
            );
          })}
      </div>
    </div>
  );
};

export default PostDetails;
