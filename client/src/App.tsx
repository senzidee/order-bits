import React from "react";
import { Routes, Route } from "react-router-dom";
import ListComponents from "./actions/ListComponents";
import AddComponent from "./actions/AddComponent";
import EditComponent from "./actions/EditComponent";
import ViewComponent from "./actions/ViewComponent";
import NavBar from "./NavBar";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<ListComponents />} />
        <Route path="/add" element={<AddComponent />} />
        <Route path="/edit/:id" element={<EditComponent />} />
        <Route path="/view/:id" element={<ViewComponent />} />
      </Routes>
    </>
  );
}
