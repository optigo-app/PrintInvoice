import React from 'react'
import FactoryDashBoard from './FactoryDashBoard'
import { Provider } from 'react-redux'
import store from './redux/store'

const FactoryDashboardHome = ({ tkn, LId ,IsEmpLogin }) => {
  return (
    <div>
        <Provider store={store}>            
            <FactoryDashBoard tkn={tkn} LId={LId} IsEmpLogin={IsEmpLogin} />
        </Provider>
    </div>
  )
}

export default FactoryDashboardHome