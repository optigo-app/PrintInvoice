import React from 'react'
// import KPIAnalytics from '../KPIAnalytics';
import KPIAnalytics from '../KPIBijoProject';
import { Provider } from 'react-redux';
import store from '../redux/store';


const KPIDashboardHome = ({tkn, sv, url, hostName}) => {
  return (
    <>  
        <Provider store={store}>
            {/* <KPIAnalytics tkn={tkn} sv={sv} url={url} hostName={hostName} /> */}
            <KPIAnalytics tkn={tkn} sv={sv} url={url} hostName={hostName} />
        </Provider>
    </>
  )
}

export default KPIDashboardHome