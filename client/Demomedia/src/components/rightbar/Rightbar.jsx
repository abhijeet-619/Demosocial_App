import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState,useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove,Edit} from "@material-ui/icons";

export default function Rightbar({user}) {
 // const newuser=props.newuser;
  //console.log(user);
  const PF= import.meta.env.VITE_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const {user:currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false);
  const [isEdit,setEdit]=useState(false);
  const[newCity,setCity]=useState();
  const[newFrom,setFrom]=useState();
  const[newRelation,setRelation]=useState();
 //console.log(user._id);
  useEffect(()=>{
  const getCurrentUser= async ()=>{
    try{
      if(user._id){
      const res=await axios.get(`https://mern-demosocial-app.onrender.com/api/users?userId=${user._id}`);
     // console.log(res.data);
      (res.data.city)? setCity(res.data.city): setCity(null);
      (res.data.from)? setFrom(res.data.from):setFrom(null);
      (res.data.relationship)? setRelation(res.data.relationship):setRelation(null);
      }

    }catch(err){
      console.log("error occure while fetching current user");
    }
  };
  getCurrentUser();
  },[user]);
  //console.log(currentUser.city);
  //console.log(newFrom);
 // console.log(newRelation);
 
  //console.log(followed);
  //console.log(user);
 
  useEffect(() => {
    //console.log(user._id,currentUser);
    
    const getFriends = async () => {
      try {
        //console.log(user._id);
        setFollowed(currentUser.followings.includes(user._id));
        if(user._id){
        const friendList = await axios.get(`https://mern-demosocial-app.onrender.com/api/users/friends/${user._id}`);
        setFriends(friendList.data);
    }
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    try {

     // console.log(followed)
      if (followed) {
        await axios.put(`https://mern-demosocial-app.onrender.com/api/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`https://mern-demosocial-app.onrender.com/api/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
    }
  };

  const handleEdit=()=>{
    setEdit((toggle)=>!toggle);
  }

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/social_media.avif" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const handleUpdate=async()=>{
      setEdit(false);
      const new_data={userId:currentUser._id,city:newCity,from:newFrom,relationship:newRelation}
      //console.log(new_data);
      //setInfo({...newInfo,...new_data});
      try{
         await axios.put("https://mern-demosocial-app.onrender.com/api/users/"+currentUser._id,new_data)
      }
      catch{
        console.log("error while update");
      };
    
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User information 
         {user._id===currentUser._id && (<span className="editIcon" style={{float:"right",cursor:"pointer"}} onClick={handleEdit}><Edit/>
         </span>)}
        </h4> 
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            {(isEdit)? (<input type="text" style={{border:"none"}} defaultValue={newCity} onBlur={(e)=>{setCity(e.target.value)}}/>):(<span className="rightbarInfoValue">{newCity}</span>)} 
            
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            {(isEdit)? (<input type="text" style={{border:"none"}} defaultValue={newFrom} onBlur={(e)=>{setFrom(e.target.value)}}/>):(<span className="rightbarInfoValue">{newFrom}</span>)} 
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            {(isEdit)? (<select style={{border:"none"}} defaultValue={newRelation} onChange={(e)=>{setRelation(e.target.value)}}>
  <option value="-">Don't Mention</option>
  <option value="Single">Single</option>
  <option value="Married">Married</option>
</select>):(<span className="rightbarInfoValue">{newRelation}</span>)} 
            {(isEdit) &&<button onClick={handleUpdate} className="editButton">Update</button>}
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends?.map((friend) => (             
            <Link
              key={friend._id}
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
