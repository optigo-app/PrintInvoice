import React from 'react'
import FactoryDashBoard from './FactoryDashBoard'
import { Provider } from 'react-redux'
import store from './redux/store'

const FactoryDashboardHome = () => {
  return (
    <div>
        <Provider store={store}>            
            <FactoryDashBoard />
        </Provider>
    </div>
  )
}

export default FactoryDashboardHome