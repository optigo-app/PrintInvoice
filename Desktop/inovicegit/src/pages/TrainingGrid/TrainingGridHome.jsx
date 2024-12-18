import React from 'react'
import TrainingDataGrid from './components/TrainingDataGrid'
import { ThemeProvider } from '@mui/material'
import mainTheme from "./@core/theme/theme"
const TrainingGridHome = () => {
  return (
    <div style={{backgroundColor:'#f8f7fa'}}>
      <ThemeProvider theme={mainTheme}>
        <TrainingDataGrid />
      </ThemeProvider>
    </div>
  )
}

export default TrainingGridHome