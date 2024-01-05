import React, { useEffect, Suspense, useState } from 'react';
import { useLocation } from 'react-router-dom';
// import AllDesignBagPrint from './AllDeisgnBagPrint';
import AllDesignPrint from './AllDesignPrint';
import AllDesignBagPrint2 from './AllDesignBagPrint2';
import AllGrids from './AllGrids';

const AllDesign = () => {
  const location = useLocation();
  const queryParamss = new URLSearchParams(location.search);
  const [loadedComponent, setLoadedComponent] = useState(null);

  // const openProject = async () => {
  //   if (queryParamss.get('printname')) {
  //     return import('./AllDesignBagPrint2');
  //   } else if (queryParamss.get('pnm')) {
  //     return import('./AllDesignPrint');
  //   } else if (queryParamss.get('grids')) {
  //     return import('./AllGrids');
  //   }
  // };

  // useEffect(() => {
  //   const loadComponent = async () => {
  //     const component = await openProject();
  //     setLoadedComponent(component.default);
  //   };

  //   loadComponent();
  // }, [queryParamss]);
  return (
    <>
      {queryParamss.get('printname') && <AllDesignBagPrint2 />}
      {queryParamss.get('pnm') && <AllDesignPrint />}
      {queryParamss.get('grids') && <AllGrids />}
    </>
  )
}

export default AllDesign