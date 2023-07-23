import Login from "./Component/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Component/Signup";
import Posts from "./Component/Posts";
import "./style/global.css";
import Logout from "./Component/Logout";
import PostDetails from "./Component/PostDetails";
import Private from "./Component/Private";
import MyPost from "./Component/MyPost";
import CreatePost from "./Component/CreatePost";
import CreateCategory from "./Component/CreateCategory";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
          <Route path="/private" element={<Private />}>
            <Route path="post" element={<Posts />} />
            <Route path="post/:id" element={<PostDetails />} />
            <Route path="myPost" element={<Posts/>}/>
            <Route path="post/create" element={<CreatePost/>}/>
            <Route path="create/category" element={<CreateCategory/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
