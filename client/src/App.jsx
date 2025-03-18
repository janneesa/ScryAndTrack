import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";

function App() {
  const { user } = useContext(UserContext);

  return (
    <div className="App">
      <BrowserRouter>
        <div className="App-content">moi</div>
        <Routes></Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
