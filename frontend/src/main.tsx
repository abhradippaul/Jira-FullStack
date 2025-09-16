import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import QueryClient_Provider from "./provider/queryclient-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <QueryClient_Provider>
    <App />
  </QueryClient_Provider>
);
