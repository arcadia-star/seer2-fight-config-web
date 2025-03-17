import App from "@/App.tsx";
import Layout from "@/app/layout.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./tailwindcss.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Layout>
            <App />
        </Layout>
    </StrictMode>,
);
