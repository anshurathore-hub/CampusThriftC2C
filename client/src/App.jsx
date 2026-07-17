import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateListing from "./pages/CreateListing";
import ListingDetails from "./pages/ListingDetails";
import EditListing from "./pages/EditListing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MyListings from "./pages/MyListings";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sell" element={<CreateListing />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/listing/:id/edit" element={<EditListing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
