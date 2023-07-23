import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userToken } from "../Component/Login";
export const ApiUtil = createApi({
  reducerPath: "ApiUtil",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/",
  }),
  tagTypes: ["comment", "post","category"],
  endpoints: (builder) => ({
    getToken: builder.mutation({
      query: (payload) => {
        return {
          url: "public/login",
          method: "POST",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    getAllPosts: builder.query({
      query: (payload) => ({
        url: `post/all?pageNo=${payload?.pageNo}&pageSize=${payload?.pageSize}&sortDir=${payload?.sortDir}&sortBy=${payload?.sortBy}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken()}`,
        },
      }),
      providesTags: ["post","category"],
    }),
    getPostById: builder.query({
      query: (id) => ({
        url: `post/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken()}`,
        },
      }),
      providesTags: ["comment"],
    }),
    getAllCategories: builder.query({
      query: () => ({
        url: `category/all`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken()}`,
        },
      }),
      providesTags: ["category"],
    }),
    createPost: builder.mutation({
      query: (payload) => ({
        url: `post/create/user/${payload.userId}/category/${payload.categoryId}`,
        method: "POST",
        body: payload.postData,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${userToken()}`,
        },
      }),
      invalidatesTags: ["post"],
    }),
    getAllCommentsOnPost: builder.query({
      query: (payload) => ({
        url: `comment/post/${payload.id}?pageNo=${payload.pageNo}&pageSize=${payload.pageSize}&sortBy=${payload.sortBy}&sortDir=${payload.sortDir}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken()}`,
        },
      }),
      providesTags: ["comment"],
    }),
    createComment: builder.mutation({
      query: (payload) => ({
        url: `comment/create/user/${payload.userId}/post/${payload.postId}`,
        method: "POST",
        body: payload.content,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${userToken()}`,
        },
      }),
      invalidatesTags: ["comment"],
    }),
    getAllComments: builder.query({
      query: (payload) => ({
        url: `comment/all?pageNo=${payload.pageNo}&pageSize=${payload.pageSize}&sortBy=${payload.sortBy}&sortDir=${payload.sortDir}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken()}`,
        },
      }),
      providesTags: ["comment"],
    }),
    uploadImage: builder.mutation({
      query: (payload) => {
        let body = new FormData();
        let img = payload.img;
        body.append("Content-type", img.type);
        body.append("multipartFile", img);
        return {
          url: `image/${payload.postId}`,
          method: "POST",
          body,
          headers: {
            // "Content-Type": "multipart/form-data;",
            Authorization: `Bearer ${userToken()}`,
          },
          formData: true,
        };
      },
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `post/${id}`,
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${userToken()}`,
        },
      }),
      invalidatesTags: ["post"],
    }),
    getPostByCategory: builder.query({
      query: (payload) => ({
        url: `post/category/${payload.categoryId}?pageNo=${payload.pageNo}&pageSize=${payload.pageSize}&sortBy=${payload.sortBy}&sortDir=${payload.sortDir}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken()}`,
        },
      }),
      providesTags: ["category"],
    }),
    updatePost: builder.mutation({
      query: (payload) => ({
        url: `post/update?id=${payload.postId}`,
        method: "PUT",
        body: payload.postData,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${userToken()}`,
        },
      }),
      invalidatesTags: ["post"],
    }),
    createUser: builder.mutation({
      query: (payload) => ({
        url: `public/users/create`,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
    }),
    getPostByUser: builder.query({
      query: (payload) => ({
        url: `post/user/${payload.userId}?pageNo=${payload.pageNo}&pageSize=${payload.pageSize}&sortBy=${payload.sortBy}&sortDir=${payload.sortDir}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken()}`,
        },
      }),
    }),
    getPostByCategoryAndUser: builder.query({
      query: (payload) => ({
        url: `post/category/${payload.categoryId}/user/${payload.userId}?pageNo=${payload.pageNo}&pageSize=${payload.pageSize}&sortBy=${payload.sortBy}&sortDir=${payload.sortDir}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken()}`,
        },
      }),
    }),
  }),
});
export const {
  useGetTokenMutation,
  useGetAllPostsQuery,
  useGetPostByIdQuery,
  useGetAllCategoriesQuery,
  useCreatePostMutation,
  useGetAllCommentsOnPostQuery,
  useCreateCommentMutation,
  useGetAllCommentsQuery,
  useUploadImageMutation,
  useDeletePostMutation,
  useGetPostByCategoryQuery,
  useUpdatePostMutation,
  useCreateUserMutation,
  useGetPostByUserQuery,
  useGetPostByCategoryAndUserQuery,
} = ApiUtil;
