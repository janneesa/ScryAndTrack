import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import ContentWrapper from "./components/utility/ContentWrapper";

import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import NewGame from "./pages/NewGame";

function App() {
  const { user } = useContext(UserContext);

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <ContentWrapper>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={user ? <Home /> : <Login />} />
            <Route path="/newgame" element={user ? <NewGame /> : <Login />} />
          </Routes>
        </ContentWrapper>
        <NavBar />
      </BrowserRouter>
    </div>
  );
}

export default App;
