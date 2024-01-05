import React from 'react';
import { useLocation } from 'react-router-dom';
// import AllDesignBagPrint from './AllDeisgnBagPrint';
import AllDesignPrint from './AllDesignPrint';
import AllDesignBagPrint2 from './AllDesignBagPrint2';

const AllDesign = () => {
    const location = useLocation();
    const queryParamss = new URLSearchParams(location.search);
  return (
    <>
     {/* {queryParamss.get('printname') ? <AllDesignBagPrint /> : <AllDesignPrint />} */}
     {queryParamss.get('printname') ? <AllDesignBagPrint2 /> : <AllDesignPrint />}
  </>
  )
}

export default AllDesign