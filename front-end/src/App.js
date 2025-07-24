import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

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
import AddProductForm from "./routes/AddProductForm";
import Checkout from "./routes/Checkout";
import OrderConfirmation from "./routes/OrderConfirmation";
import OrderDetails from "./routes/OrderDetails";
import UserList from "./routes/UserList";
import EditUser from "./routes/EditUser";
import AddUser from "./routes/AddUser";

import Login from "./routes/Login";
import Register from "./routes/Register";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/Auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Toaster position="bottom-right" reverseOrder={false} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute allowedRoles={["admin", "customer"]}>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRoles={["admin", "customer"]}>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:orderId"
              element={
                <ProtectedRoute allowedRoles={["admin", "customer"]}>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/place-order"
              element={
                <ProtectedRoute>
                  <PlaceOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addproducts"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AddProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/place-order"
              element={
                <ProtectedRoute allowedRoles={["admin", "customer"]}>
                  <PlaceOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/listImages"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ListImages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/listHeroImages"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ListHeroImages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UserList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-user/:id"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <EditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-user"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AddUser />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
