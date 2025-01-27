import React from 'react'
// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { CircularProgress, useTheme } from '@mui/material';
import {  safeValue } from './global';
import { formatAmountRound } from '../../GlobalFunctions'
const RawMaterial = ({ bgColor, bgComp, g_loss, rmStock, lossLoader, rmStockLoader, bgLoader}) => {
    const theme = useTheme();
  const data6 = [
                
    {
      stats: `${safeValue(bgComp?.rm_baggingcompleted)} jobs`,
      title: 'Bagging Completed',
    },

    {
      stats: `${(parseInt((safeValue(bgComp?.rm_avg_proc_time) / (60 * 60 * 24)))?.toFixed(0))} Days`,
      title: 'Avg. Process Time',
    },
    {
      stats: g_loss?.rm_grossloss === null ? '-' : (
        <>
          {(safeValue(g_loss?.rm_grossloss)?.toFixed(2))} gm
        </>
      ),
      title: 'Gross Loss',
    },
    {
      stats: '',
      title: '',
      wt: ''
    },
    {
      stats: (rmStock?.rm_goldstock_amt === null || rmStock?.rm_goldstock_amt === undefined) ? 0 : ` ₹ ${formatAmountRound(safeValue((rmStock?.rm_goldstock_amt)?.toFixed(2)))} `,
      title: 'Gold Stock',
      wt: `${(+(safeValue(rmStock?.rm_goldstock_wt)))?.toFixed(2)} gm`
    },
    {
      stats: (rmStock?.rm_diastock_amt === null || rmStock?.rm_diastock_amt === undefined) ? 0 : ` ₹ ${formatAmountRound(safeValue((rmStock?.rm_diastock_amt))?.toFixed(2))}`,
      title: 'Diamond Stock',
      wt: `${(+(safeValue(rmStock?.rm_diastock_wt)))?.toFixed(2)} ctw`
    },
    {
      stats: (rmStock?.rm_csstock_amt === null || rmStock?.rm_csstock_amt === undefined) ? 0 : ` ₹ ${formatAmountRound(safeValue((rmStock?.rm_csstock_amt))?.toFixed(2))}`,
      title: 'Colour Stone Stock',
      wt: `${(+(safeValue(rmStock?.rm_csstock_wt)))?.toFixed(2)} ctw`
    },
    {
      stats: (rmStock?.rm_miscstock_amt === null || rmStock?.rm_miscstock_amt === undefined) ? 0 : ` ₹ ${formatAmountRound(safeValue((rmStock?.rm_miscstock_amt))?.toFixed(2))}`,
      title: 'Misc Stock',
      wt: `${(+(safeValue(rmStock?.rm_miscstock_wt)))?.toFixed(2)} gm`
    }
  ];
  const renderStats = () => {
        return data6?.map((sale, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', pt:0 }}>
           
              <Box sx={{ display: 'flex', flexDirection: 'column', pt:0 }}>
                <Typography variant='h6' color={bgColor}  >{sale.title}</Typography>
                <Typography variant='h5' color={theme?.palette?.grey?.[700]}  sx={{fontWeight:'bolder'}} >{((sale.stats))}</Typography>
                { sale.wt === undefined ? <div>&nbsp;</div> : <Typography variant='h5' color={theme?.palette?.grey?.[700]} sx={{fontWeight:'bolder'}} >{((sale.wt))} </Typography>}
              </Box>
            </Box>
          </Grid>
        ))
    }
    return (
      <>
        <Card  className={`fs_analytics_l ${(bgLoader || rmStockLoader || lossLoader) ? 'center_kpi' : ''} `}  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'198px'}}>
            
              {  (bgLoader || rmStockLoader || lossLoader) ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding:'1rem',  }}>
                <CircularProgress sx={{color:'lightgrey'}} />
              </Box> :
              <CardContent sx={{ pt: theme => `${theme.spacing(1)} !important`, pb: theme => `${theme.spacing(1)} !important` }} >
              <Grid container spacing={2}>
                  {renderStats()}
              </Grid>
              </CardContent>}
          </Card>
      </>
    )
  }

export default RawMaterial;