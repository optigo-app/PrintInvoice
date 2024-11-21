import { ThemeProvider, createTheme } from '@mui/material';
import React, { useState } from 'react'
import customTheme from "./@core/theme/theme"
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { useLocation } from 'react-router-dom';
import KPIAnalytics from './componentsofkpi/KPIAnalytics';
const Dashboard = () => {
    let theme = createTheme(customTheme);
    const location = useLocation();
    const queryParam = location?.search;
    const params = new URLSearchParams(queryParam);
    const [url, setUrl] = useState('');

    // Extract specific parameters
    const tkn = atob(params.get('tkn'));
    const pid = (params.get('pid'));
  return (
    <>
    <ThemeProvider theme={theme}>
        <div style={{
            width:'100%',
            maxWidth:'100vw',
            backgroundColor:'#F8F7FA',
        }}>
            { pid === '18145' && <div style={{
                width:'95%', margin:'0 auto',
                boxSizing:'border-box',
                padding:'2rem'}}><AnalyticsDashboard tkn={tkn} /> 
                {/* // padding:'2rem', paddingTop:'0px'}}><KPIAnalytics tkn={tkn} /> */}
            </div>}
            { pid === '18146' && <div style={{
                width:'95%', margin:'0 auto',
                boxSizing:'border-box',
                padding:'2rem', paddingTop:'0px'}}><KPIAnalytics tkn={tkn} />
            </div>}
        </div>
    </ThemeProvider>
    </>
  )
}

export default Dashboard