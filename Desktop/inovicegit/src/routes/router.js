import * as React from "react";

import {
  createBrowserRouter,
} from "react-router-dom";
import AllDesign from "../pages/AllDesign";
import MRPBill from "../pages/MRPBill/MRPBill";

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
    path: "/mrpbill",
    element: <><MRPBill /></>,
  },
]);

export default router