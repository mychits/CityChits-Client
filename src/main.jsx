import { RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import mainRoutes from "./routes/mainRoutes.jsx";



createRoot(document.getElementById("root")).render(
  <RouterProvider router={mainRoutes} />
);
