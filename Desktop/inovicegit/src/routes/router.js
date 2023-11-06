import * as React from "react";

import {
  createBrowserRouter,
} from "react-router-dom";
import AllDesign from "../pages/AllDesign";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <AllDesign />,
  },
]);

export default router