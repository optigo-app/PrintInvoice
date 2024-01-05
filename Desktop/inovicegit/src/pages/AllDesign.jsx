import React, { useEffect, Suspense, useState } from "react";
import { useLocation } from "react-router-dom";
// import AllDesignBagPrint from './AllDeisgnBagPrint';
import AllDesignPrint from "./AllDesignPrint";
import AllDesignBagPrint2 from "./AllDesignBagPrint2";
import AllGrids from "./AllGrids";

const AllDesign = () => {
  const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  const [loadedComponent, setLoadedComponent] = useState(null);

  const openProject = (searchUrl) => {
    if (searchUrl?.includes("pnm")) {
      return <AllDesignPrint />;
    } else if (searchUrl?.includes("printname")) {
      return <AllDesignBagPrint2 />;
    } else if (searchUrl?.includes("grids")) {
      return <AllGrids />;
    } else {
      return null;
    }
    // console.log(atob(queryParams.get('pnm')));
  };
  useEffect(() => {
    const component = openProject(location.search);
    setLoadedComponent(component);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loadedComponent}
      {/* {queryParams.get('printname') && <AllDesignBagPrint2 />}
      {queryParams.get('pnm') && <AllDesignPrint />}
      {queryParams.get('grids') && <AllGrids />} */}
    </>
  );
};

export default AllDesign;
