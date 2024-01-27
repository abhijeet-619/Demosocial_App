import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Topbar() {
  const { user } = useContext(AuthContext);
  const PF= import.meta.env.VITE_PUBLIC_FOLDER;
  const navigate=useNavigate();
  const searchFriend= async()=>{
    const searchName=document.getElementsByClassName("searchInput")[0].value;
    //console.log(searchName);
    const searchUser=await axios.get(`/api/users?username=${searchName}`);
    console.log(searchUser);
    if(searchUser){
      navigate(`/profile/${searchName}`);  
    }else{
      document.alert("No User Found");
    }

  };
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Demosocial</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" onClick={searchFriend}/>
          <input
            type="text"
            placeholder="Search for friend"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
        <Link to={'/'} style={{ textDecoration: "none",color:"white" }}>
          <span className="topbarLink">Homepage</span>
          </Link>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <Link to={'/messenger'} style={{ color: "white" }}>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          </Link>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
