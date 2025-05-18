import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import axios from "axios";

// ——— Axios Global Defaults ———
// Point all axios calls at your backend base URL:
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
// Include cookies on every request for session auth:
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);

