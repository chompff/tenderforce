import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
// Initialize Firebase Analytics
import "@/lib/firebase";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);