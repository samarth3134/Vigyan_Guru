
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import AdminDashboard from "./app/AdminDashboard.tsx";
import App from "./app/App.tsx";
import LandingPage from "./app/LandingPage.tsx";
import ResetPassword from "./app/ResetPassword";
import "./styles/index.css";

function Main() {
  const [showLanding, setShowLanding] = useState(() => {
    return !sessionStorage.getItem("landing-done");
  });
  const location = useLocation();

  const handleEnter = () => {
    sessionStorage.setItem("landing-done", "true");
    setShowLanding(false);
  };

  if (location.pathname.startsWith("/admin")) return <AdminDashboard />;
  if (location.pathname === "/reset-password") return <ResetPassword />;
  if (showLanding) return <LandingPage onEnter={handleEnter} />;
  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Main />
  </BrowserRouter>
);
  
