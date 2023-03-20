import React from "react";
import ReactDOM from "react-dom/client";
import { RenderApp } from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RenderApp />
  </React.StrictMode>,
);
