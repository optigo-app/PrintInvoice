import React from 'react'
import KPIAnalytics from '../KPINew';
// import KPIAnalytics from '../KPIAnalytics';
// import KPIAnalytics from '../KPIBijoProject';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { RecoilRoot } from 'recoil';


const KPIDashboardHome = ({tkn, sv, url, hostName}) => {
  return (
    <>  
      <RecoilRoot>
        <Provider store={store}>
            <KPIAnalytics tkn={tkn} sv={sv} url={url} hostName={hostName} />
            {/* <KPIAnalytics tkn={tkn} sv={sv} url={url} hostName={hostName} /> */}
            {/* <KPIAnalytics tkn={tkn} sv={sv} url={url} hostName={hostName} /> */}
        </Provider>
        </RecoilRoot>
    </>
  )
}

export default KPIDashboardHome