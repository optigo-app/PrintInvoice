import React from 'react'
// import KPIAnalytics from '../KPINew';
import KPIAnalytics from '../KPIAnalytics';
// import KPIAnalytics from '../KPIBijoProject';


const KPIDashboardHome = ({tkn, sv, url, hostName}) => {
  return (
    <>  
            <KPIAnalytics tkn={tkn} sv={sv} url={url} hostName={hostName} />
            {/* <KPIAnalytics tkn={tkn} sv={sv} url={url} hostName={hostName} /> */}
            {/* <KPIAnalytics tkn={tkn} sv={sv} url={url} hostName={hostName} /> */}
    </>
  )
}

export default KPIDashboardHome