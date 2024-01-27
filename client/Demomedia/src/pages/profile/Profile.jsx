import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import {useParams} from "react-router-dom"
import { AuthContext } from "../../context/AuthContext";
import { logoutCall } from "../../apiCalls";
import {useNavigate} from "react-router-dom";
import {Edit} from "@material-ui/icons"

export default function Profile() {
  const PF= import.meta.env.VITE_PUBLIC_FOLDER;
  const [user,setUser] = useState({})
  const username=useParams().username;
  const { dispatch } = useContext(AuthContext);
  const navigate=useNavigate();
 const coverImg=useRef();
 const profileImg=useRef();
 const [pImg,setPimg]=useState();
 const [cImg,setCimg]=useState();
  //console.log({username,user});
  useEffect(()=>{
    const fetchUser=async ()=>{
      const res = await axios.get(`/api/users?username=${username}`);
      //console.log(res.data);
      setUser(res.data);
    };
    fetchUser();
  },[username]);
    
  useEffect(()=>{
   const changeCimg=async ()=>{
    if (cImg) {
    const newImg = {
      userId: user._id,
    };
      const data = new FormData();
      const fileName = Date.now() + cImg.name;
      data.append("name", fileName);
      data.append("file", cImg);
      newImg.coverPicture = fileName;
      console.log(newImg);
      try {
        await axios.post("/api/upload", data);
        console.log(data);
      } catch (err) {}
      try {
        await axios.put(`/api/users/${user._id}`, newImg);
        window.location.reload();
      } catch (err) {}
  }
  }
  changeCimg();
},[cImg]);
  //console.log(cImg);

  useEffect(()=>{
    const changeCimg=async ()=>{
     if (pImg) {
     const newImg = {
       userId: user._id,
     };
       const data = new FormData();
       const fileName = Date.now() + pImg.name;
       data.append("name", fileName);
       data.append("file", pImg);
       newImg.profilePicture = fileName;
       console.log(newImg);
       try {
         await axios.post("/api/upload", data);
         console.log(data);
       } catch (err) {}
       try {
         await axios.put(`/api/users/${user._id}`, newImg);
         window.location.reload();
       } catch (err) {}
   }
   }
   changeCimg();
 },[pImg]);

  const handleLogout=(e)=>{
    e.preventDefault();
    logoutCall(dispatch);
    navigate("/login");
    
  };

  const handleUpdateCover=()=>{
    coverImg.current.click();
  };

  const handleUpdateProfile=()=>{
    profileImg.current.click();
  };
 //console.log(cImg);
  
  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={ user.coverPicture? PF +user.coverPicture: `${PF}blank-bg.jpg`}
                alt=""
              />
              <div onClick={handleUpdateCover}>
                <input type="file"  accept="image/*" style={{display:"none"}} ref={coverImg} onChange={(e)=>setCimg(e.target.files[0])}/>
              <span className="editCoverbg"></span>
              <span className="editCover"><Edit/></span>
              </div>
              <img
                className="profileUserImg"
                src={user.profilePicture? PF+ user.profilePicture : `${PF}blank-profile.png`}
                alt=""
              />
              <div onClick={handleUpdateProfile}>
              <input type="file"  accept="image/*" style={{display:"none"}} ref={profileImg} onChange={(e)=>setPimg(e.target.files[0])}/>
              <span className="editProfilebg"></span>
              <span className="editProfile"><Edit/></span>
              </div>
            <button className="logoutButton" onClick={handleLogout}>Logout</button>
            </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">{user.username}</h4>
                <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username}/>
            <Rightbar user={user}/>
          </div>
        </div>
      </div>
    </>
  );
}
