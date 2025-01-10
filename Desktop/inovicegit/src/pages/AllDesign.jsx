import React, { useEffect, Suspense, useState } from "react";
import { useLocation } from "react-router-dom";
import AllDesignPrint from "./AllDesignPrint";
import AllDesignBagPrint2 from "./AllDesignBagPrint2";
import AllGrids from "./AllGrids";
// import AllDesignBagPrint from './AllDeisgnBagPrint';
import ErrorPage from "./error/ErrorPage";
import Loader from "../components/Loader";
import  QcReport  from "./qcreport/QcReport";
import MRPBill from "./MRPBill/MRPBill";
import AllMaterialWisePrint from "./AllMaterialWisePrint";
import Dashboard from "./dashboard/Dashboard";
import TitanWip from "./MyReports/TitanWip/TitanWip";
import TrainingGridHome from "./TrainingGrid/TrainingGridHome";
import MasterForm from "./MyReports/MasterForm/MasterForm";

const AllDesign = () => {
  
  const location = useLocation();

  // const queryParams = new URLSearchParams(location.search);
  const [loadedComponent, setLoadedComponent] = useState(null);

//   const queryParams = useQueryParams();
//   const pid= queryParams.get("pid");
// console.log("pid",pid);


  const openProject = (searchUrl) => {
    if (searchUrl?.includes("pnm")) {
      return <AllDesignPrint />;
    } else if (searchUrl?.includes("printname")) {
      return <AllDesignBagPrint2 />;
    } else if (searchUrl?.includes("matsale")) {
      return <AllMaterialWisePrint />;
    }
    //  else if (searchUrl?.includes("grids")) {
    //   return <AllGrids />;
    // }
     else if (searchUrl?.includes("pid=18126")) {
      return <MRPBill />;
    } else if (searchUrl?.includes("pid=18145") || searchUrl?.includes("pid=18146") || searchUrl?.includes("pid=18147")){
      return <Dashboard />;
    } else if (searchUrl?.includes("pid=18149")){
      return <TitanWip />;
    } else if (searchUrl?.includes("pid=18152")){
      return <TrainingGridHome />;
    } else if (searchUrl?.includes("pid=18152")){
      return <TrainingGridHome />;
    } else if (searchUrl?.includes("pid=18160")){
      return <QcReport />;
    }
     else {
      return <ErrorPage />;
    }
  };

  useEffect(() => {
    const component = openProject(location?.search);
    setLoadedComponent(component);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      {loadedComponent}
    </Suspense>
  );
};

export default AllDesign;
