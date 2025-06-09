// // import React from "react";
// // import { BrowserRouter, Routes, Route } from "react-router-dom";
// // import "./App.css";
// // import Login from "./routes/Login";
// // import Home from "./routes/Home";
// // import Collection from "./routes/Collection";
// // import About from "./routes/About";
// // import Contact from "./routes/Contact";
// // import Product from "./routes/Product";
// // import Cart from "./routes/Cart";
// // import PlaceOrder from "./routes/PlaceOrder";
// // import Orders from "./routes/Orders";
// // import Navbar from "./components/Navbar";
// // import ListImages from "./routes/ListImages";
// // import ListHeroImages from "./routes/ListHeroImages";
// // import { CartProvider } from "./context/CartContext";
// // import AddProductForm from "./routes/AddProductForm";
// // import Checkout from "./routes/Checkout"; // Importar Checkout
// // import OrderConfirmation from "./routes/OrderConfirmation"; // Para la página de confirmación

// // function App() {
// //   return (
// //     <CartProvider>
// //       <BrowserRouter>
// //         <Navbar />
// //         <Routes>
// //           <Route path="/" element={<Home />} />
// //           <Route path="/listImages" element={<ListImages />} />
// //           <Route path="/listHeroImages" element={<ListHeroImages />} />
// //           <Route path="/collection" element={<Collection />} />
// //           <Route path="/about" element={<About />} />
// //           <Route path="/contact" element={<Contact />} />
// //           <Route path="/product/:productId" element={<Product />} />
// //           <Route path="/cart" element={<Cart />} />
// //           <Route path="/login" element={<Login />} />
// //           <Route path="/place-order" element={<PlaceOrder />} />
// //           <Route path="/orders" element={<Orders />} />
// //           <Route path="/addproducts" element={<AddProductForm />} />
// //           <Route path="/checkout" element={<Checkout />} />
// //           <Route path="/order-confirmation" element={<OrderConfirmation />} />
// //         </Routes>
// //       </BrowserRouter>
// //     </CartProvider>
// //   );
// // }

// // export default App;

// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Toaster } from "react-hot-toast"; // ¡Importa Toaster aquí!
// import "./App.css";
// // import Login from "./routes/Login";
// import Home from "./routes/Home";
// import Collection from "./routes/Collection";
// import About from "./routes/About";
// import Contact from "./routes/Contact";
// import Product from "./routes/Product";
// import Cart from "./routes/Cart";
// import PlaceOrder from "./routes/PlaceOrder";
// import Orders from "./routes/Orders";
// import Navbar from "./components/Navbar";
// import ListImages from "./routes/ListImages";
// import ListHeroImages from "./routes/ListHeroImages";
// import { CartProvider } from "./context/CartContext";
// import AddProductForm from "./routes/AddProductForm";
// import Checkout from "./routes/Checkout";
// import OrderConfirmation from "./routes/OrderConfirmation";

// // NUEVOS COMPONENTES DE AUTENTICACIÓN
// import Login from "./routes/Login"; // Asegúrate de que apunte al nuevo Login.js
// import Register from "./routes/Register";
// import { AuthProvider } from "./context/AuthContext"; // ¡Importa AuthProvider!

// function App() {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <BrowserRouter>
//           <Navbar />
//           {/* Aquí va el Toaster, después del Navbar y antes de las Routes */}
//           <Toaster position="top-right" reverseOrder={false} />
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/listImages" element={<ListImages />} />
//             <Route path="/listHeroImages" element={<ListHeroImages />} />
//             <Route path="/collection" element={<Collection />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/product/:productId" element={<Product />} />
//             <Route path="/cart" element={<Cart />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/place-order" element={<PlaceOrder />} />
//             <Route path="/orders" element={<Orders />} />
//             <Route path="/addproducts" element={<AddProductForm />} />
//             <Route path="/checkout" element={<Checkout />} />
//             <Route path="/order-confirmation" element={<OrderConfirmation />} />
//             <Route path="/register" element={<Register />} />
//           </Routes>
//         </BrowserRouter>
//       </CartProvider>
//     </AuthProvider>
//   );
// }

// export default App;

// src/App.js (extracto)
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

// Componentes de autenticación
import Login from "./routes/Login";
import Register from "./routes/Register";
import { AuthProvider } from "./context/AuthContext";

// ¡Importa el ProtectedRoute!
import ProtectedRoute from "./components/Auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Toaster position="bottom-right" reverseOrder={false} />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />

            {/* Rutas protegidas para USUARIOS (rol 'user' o 'admin' si también se les permite) */}
            {/* Por ejemplo, el checkout solo para usuarios autenticados */}
            <Route
              path="/checkout"
              element={
                // Aquí, 'checkout' es para cualquiera que esté logueado, sea admin o customer
                <ProtectedRoute allowedRoles={["admin", "customer"]}>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            {/* Mis pedidos, solo para usuarios autenticados */}
            <Route
              path="/orders"
              element={
                // 'orders' es para que tanto 'admin' como 'customer' vean sus pedidos
                <ProtectedRoute allowedRoles={["admin", "customer"]}>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:orderId" // Ruta para ver los detalles de un pedido específico
              element={
                <ProtectedRoute allowedRoles={["admin", "customer"]}>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/place-order" // Si PlaceOrder es parte del flujo de órdenes
              element={
                <ProtectedRoute>
                  <PlaceOrder />
                </ProtectedRoute>
              }
            />

            {/* Rutas protegidas para ADMINISTRADORES (rol 'admin') */}
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
                // Igual que orders, para ambos roles
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
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
