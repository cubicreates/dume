import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import VerificationSuccess from './pages/VerificationSuccess';
import VerificationFailed from './pages/VerificationFailed';
import Fields from "./Pages/Fields";
import Test from "./Pages/Test";

function App() {
  // Create a protected route wrapper component
  const ProtectedRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <>
    <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/fields" element={<Fields/>} />
          <Route path="/test" element={<Test/>} />
          <Route path="/verification-success" element={<VerificationSuccess />} />
          <Route path="/verification-failed" element={<VerificationFailed />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
