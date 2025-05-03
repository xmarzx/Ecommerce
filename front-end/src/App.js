import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./routes/Login";
import Home from "./routes/Home";
import Collection from "./routes/Collection";
import About from "./routes/About";
import Contact from "./routes/Contact";
import Product from "./routes/Product";
import Cart from "./routes/Cart";
import PlaceOrder from "./routes/PlaceOrder";
import Orders from "./routes/Orders";
import Navbar from "./components/Navbar";
import ListImages from "./routes/ListImages";
import ListHeroImages from "./routes/ListHeroImages";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listImages" element={<ListImages />} />
          <Route path="/listHeroImages" element={<ListHeroImages />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
