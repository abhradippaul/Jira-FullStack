import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import QueryClient_Provider from "./provider/queryclient-provider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <QueryClient_Provider>
    <App />
    <Toaster />
  </QueryClient_Provider>
);
