import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Protected from "./routes/Protected";
import Login from "./routes/Login";
import Dashboard from "./routes/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard/*"
          element={<Protected Component={Dashboard} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
