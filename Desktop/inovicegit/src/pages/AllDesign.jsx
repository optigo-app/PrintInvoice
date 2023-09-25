import React from 'react';
import { useLocation } from 'react-router-dom';
import AllDesignBagPrint from './AllDeisgnBagPrint';
import AllDesignPrint from './AllDesignPrint';

const AllDesign = () => {
    const location = useLocation();
    const queryParamss = new URLSearchParams(location.search);
  return (
    <>
     {queryParamss.get('printname') ? <AllDesignBagPrint /> : <AllDesignPrint />}
  </>
  )
}

export default AllDesign