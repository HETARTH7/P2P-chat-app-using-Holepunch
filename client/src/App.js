import React from "react";
import Home from "./components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "./components/Chat";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:serverID" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
