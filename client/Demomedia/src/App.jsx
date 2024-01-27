import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import { Routes,Route,Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/messenger";

function App() {
  const { user } = useContext(AuthContext);
  return (
  <Routes>
  <Route exact path='/' element={ user ? <Home/> :<Register/>  }/>
  <Route path='/login' element={ user ? <Navigate replace to={"/"}/> :<Login/> }/>
  <Route path='/register'element={ user ? <Navigate replace to={"/"}/> :<Register/> }/>
  <Route path='/messenger'element={ user ? <Messenger/>:<Navigate replace to={"/"}/>  }/>
  <Route path='/profile/:username' element={<Profile/>}/>
 </Routes>
 );
}

export default App;
     
