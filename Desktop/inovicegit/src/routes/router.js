import * as React from "react";

import {
  createBrowserRouter,
} from "react-router-dom";
import AllDesign from "../pages/AllDesign";
import QcReport from "../pages/qcreport/QcReport";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <AllDesign />,
  },
  {
    path: "/qcreport",
    element: <QcReport />,
  },
]);

export default router