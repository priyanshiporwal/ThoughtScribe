import React from "react";

const Comment = ({ name, content, date }) => {
  return (
    <>
      <h4>{name}</h4>
      <p>{content}</p>
      <p>{date}</p>
      <hr />
    </>
  );
};

export default Comment;
