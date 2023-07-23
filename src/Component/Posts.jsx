import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Button, Form } from "react-bootstrap";
import PostStructure from "./PostStructure";
import {
  useGetAllPostsQuery,
  useGetAllCategoriesQuery,
  useGetPostByCategoryQuery,
  useGetPostByUserQuery,
  useGetPostByCategoryAndUserQuery,
} from "../service/ApiUtils";
import { useLocation } from "react-router-dom";
import { userDetails } from "./Login";
import { Pagination } from "react-bootstrap";

const Posts = () => {
  const location = useLocation();
  const details = userDetails();
  const [pageNo, setPageNo] = useState(0);
  const [category, setCategory] = useState();
  const payload = {
    pageNo: pageNo,
    pageSize: 5,
    sortDir: "desc",
    sortBy: "addedDate",
  };

  let categoryPayload = {
    pageNo: pageNo,
    pageSize: 5,
    sortDir: "desc",
    sortBy: "addedDate",
    categoryId: category && Number(category),
  };
  let userPayload = {
    pageNo: pageNo,
    pageSize: 5,
    sortDir: "desc",
    sortBy: "addedDate",
    userId: details.id,
  };

  let categoryAndUserPayload = {
    pageNo: pageNo,
    pageSize: 5,
    sortDir: "desc",
    sortBy: "addedDate",
    userId: details.id,
    categoryId: category && Number(category),
  };

  const { data, isSuccess, isError } = useGetAllPostsQuery(payload);
  const getAllPostByUser = useGetPostByUserQuery(userPayload);
  const getAllPostByCategoryAndUser = useGetPostByCategoryAndUserQuery(
    categoryAndUserPayload,
    {
      skip: !category || category === "Choose Category",
    }
  );
  const res = useGetPostByCategoryQuery(categoryPayload, {
    skip: !category || category === "Choose Category",
  });

  const categoryResponse = useGetAllCategoriesQuery();

  const changePage = (ind) => {
    setPageNo(ind);
  };

  return (
    <div>
      <Sidebar />

      <div style={{ paddingTop: "5%" }}>
        <div
          className="d-flex justify-content-end"
          style={{ marginRight: "3%" }}
        >
          <select
            name="categories"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Choose Category</option>
            {categoryResponse.isSuccess &&
              categoryResponse.data.map((category) => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                );
              })}
          </select>
        </div>

        {location.pathname === "/private/post" &&
          res.isSuccess &&
          res.data.postDtos.map((post) => {
            return (
              <PostStructure
                key={post.id}
                id={post.id}
                user={post.user.name}
                title={post.title}
                description={post.description}
              />
            );
          })}
        {location.pathname === "/private/post" &&
          !res.isSuccess &&
          isSuccess &&
          data.postDtos.map((post) => {
            return (
              <PostStructure
                key={post.id}
                id={post.id}
                user={post.user.name}
                title={post.title}
                description={post.description}
              />
            );
          })}
        {location.pathname === "/private/myPost" &&
          getAllPostByCategoryAndUser.isSuccess &&
          getAllPostByCategoryAndUser.data.postDtos.map((post) => {
            return (
              <PostStructure
                key={post.id}
                id={post.id}
                user={post.user.name}
                title={post.title}
                description={post.description}
              />
            );
          })}
        {location.pathname === "/private/myPost" &&
          getAllPostByUser.isSuccess &&
          !getAllPostByCategoryAndUser.isSuccess &&
          getAllPostByUser.data.postDtos.map((post) => {
            return (
              <PostStructure
                key={post.id}
                id={post.id}
                user={post.user.name}
                title={post.title}
                description={post.description}
              />
            );
          })}

        <div className="d-flex flex-column align-items-center m-3">
          {location.pathname === "/private/post" && (
            <Pagination>
              <Pagination.Item
                disabled={pageNo === 0}
                onClick={() => setPageNo(pageNo - 1)}
              >
                Prev
              </Pagination.Item>
              {[
                ...Array(
                  res.isSuccess ? res?.data.totalPages : data && data.totalPages
                ),
              ].map((c, index) => {
                return (
                  <Pagination.Item
                    key={index}
                    active={index === pageNo}
                    onClick={() => changePage(index)}
                  >
                    {index + 1}
                  </Pagination.Item>
                );
              })}
              <Pagination.Item
                disabled={
                  pageNo === res.isSuccess
                    ? res.data.totalPages - 1
                    : data && data.totalPages - 1
                }
                onClick={() => setPageNo(pageNo + 1)}
              >
                next
              </Pagination.Item>
            </Pagination>
          )}
          {location.pathname === "/private/myPost" && (
            <Pagination>
              <Pagination.Item
                disabled={pageNo === 0}
                onClick={() => setPageNo(pageNo - 1)}
              >
                Prev
              </Pagination.Item>
              {[
                ...Array(
                  getAllPostByCategoryAndUser.isSuccess
                    ? getAllPostByCategoryAndUser?.data.totalPages
                    : getAllPostByUser.isSuccess &&
                        getAllPostByUser.data.totalPages
                ),
              ].map((c, index) => {
                return (
                  <Pagination.Item
                    key={index}
                    active={index === pageNo}
                    onClick={() => changePage(index)}
                  >
                    {index + 1}
                  </Pagination.Item>
                );
              })}
              <Pagination.Item
                disabled={
                  pageNo === getAllPostByCategoryAndUser.isSuccess
                    ? getAllPostByCategoryAndUser?.data.totalPages - 1
                    : getAllPostByUser.isSuccess &&
                      getAllPostByUser.data.totalPages - 1
                }
                onClick={() => setPageNo(pageNo + 1)}
              >
                next
              </Pagination.Item>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;
