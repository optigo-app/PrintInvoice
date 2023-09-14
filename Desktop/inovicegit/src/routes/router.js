import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AllDesign from "../pages/AllDesign";



const router = createBrowserRouter([
  {
    path: "/*",
    element: <AllDesign />,
  },
]);

export default router