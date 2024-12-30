import React from 'react'
// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import { CircularProgress, useTheme } from '@mui/material';
import { useSelector } from 'react-redux'
const FactoryDataSummary = ({tkn, bgColor}) => {

    const all = useSelector(state => state);
  console.log(all);
  
    const theme = useTheme();
    const data = [
        {
          stats: '0.67',
          title: 'Avg. D.ctw',
        },
        {
          stats: '21.61',
          title: 'Total Labour',
        },
        {
          stats: '8.65',
          title: 'Labour Per Gram',
        },
        {
          stats: '10.50',
          title: 'Setting Per Gram',
        },
        {
          stats: '4.01',
          title: 'Avg. NetWt',
        },
        {
          stats: '11.842',
          title: 'Total Unit',
        },
        {
          stats: '5.07',
          title: 'Gold Loss',
        },
        {
          stats: '16.09',
          title: 'In/Out Duration',
        },
        {
          stats: '1543.70',
          title: 'Cost Per Carat',
        },
        {
          stats: '1781.76',
          title: 'Sold Per Carat',
        }
      ]

    const renderStats = () => {
        return data.map((sale, index) => (
          <Grid item xs={6} sm={6} md={2.4} key={index}>
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h5' color={bgColor} sx={{fontWeight:'bolder'}} >{sale.title}</Typography>
                <Typography variant='h4' color={theme?.palette?.grey?.[700]} >{sale.stats}</Typography>
              </Box>
            </Box>
          </Grid>
        ))
      }
  return (
    <>
       <Card  className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}}>
            {/* <CardHeader
                title='Raw Material'
                sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
                // action={
                //     <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                //     Updated 1 month ago
                //     </Typography>
                // }
                /> */}
            { all?.loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding:'1rem', minHeight:'204px' }}>
                                    <CircularProgress sx={{color:'lightgrey'}} />
                                    </Box> : <CardContent
                sx={{ pt: theme => `${theme.spacing(3)} !important`, pb: theme => `${theme.spacing(3)} !important` }}
                >
              <Grid container spacing={6}>
                  {renderStats()}
              </Grid>
            </CardContent>}
        </Card>
    </>
  )
}

export default FactoryDataSummary