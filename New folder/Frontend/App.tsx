import {Routes, Route ,Navigate} from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import { AuthPage } from "./components/AuthPage";
import Buy from "./components/Buy"
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
function App(){
  
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return(
  <>
    <Routes>
    
     <Route path="/" element={isAuthenticated ?<HomePage></HomePage>:<Navigate to="/signup" />}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<AuthPage></AuthPage>}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<LoginPage></LoginPage>}></Route>
     <Route path="/buy" element={isAuthenticated ?<Buy></Buy>:<Navigate to="/signup" />}></Route>

     
    </Routes>
  </>
  )
}

export default App;