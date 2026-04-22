
  import { createRoot } from "react-dom/client";
  import AdminDashboard from "./app/AdminDashboard.tsx";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  const isAdminRoute = window.location.pathname.startsWith("/admin");

  createRoot(document.getElementById("root")!).render(isAdminRoute ? <AdminDashboard /> : <App />);
  
