import React from 'react'
import TrainingDataGrid from './components/TrainingDataGrid'
import { ThemeProvider } from '@mui/material'
import mainTheme from "./@core/theme/theme"
const TrainingGridHome = () => {
        const queryString = window?.location?.search;
        const queryParam = new URLSearchParams(queryString);
        const ex_url = atob(queryParam.get("ex_url"));
  return (
    <div style={{backgroundColor:'#f8f7fa'}}>
      <ThemeProvider theme={mainTheme}>
        <TrainingDataGrid ex_url={ex_url} />
      </ThemeProvider>
    </div>
  )
}

export default TrainingGridHome