import * as React from "react";

import {
  createBrowserRouter,
} from "react-router-dom";
import AllDesign from "../pages/AllDesign";
import ScanJob from "../pages/scanjob/ScanJob";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <AllDesign />,
  },
  {
    path: "/qcreport",
    element: <></>,
  },
  {
    path: "/scanjob",
    element: <><ScanJob /></>,
  },
]);

export default router