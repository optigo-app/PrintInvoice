import React, { useEffect } from 'react'
import TrainingDataGrid from './components/TrainingDataGrid'
import { ThemeProvider } from '@mui/material'
import mainTheme from "./@core/theme/theme"
const TrainingGridHome = () => {
        const queryString = window?.location?.search;
        const queryParam = new URLSearchParams(queryString);
        const ex_url = atob(queryParam.get("ex_url"));

        // useEffect(() => {
        //   const currentUrl = window.location.href;
        //   console.log('Current URL:', currentUrl); 
        //   const allowedReferrer = 'http://llocalhost:3000/';
        //   console.log('Referrer:', document.referrer); // Debugging line
        //   // if (!document.referrer || !document.referrer.startsWith(allowedReferrer)) {
        //   //   window.location.href = '/unauthorized';
        //   // }
        // }, []);

  return (
    <div style={{backgroundColor:'#f8f7fa'}}>
      <ThemeProvider theme={mainTheme}>
        <TrainingDataGrid ex_url={ex_url} />
      </ThemeProvider>
    </div>
  )
}

export default TrainingGridHome