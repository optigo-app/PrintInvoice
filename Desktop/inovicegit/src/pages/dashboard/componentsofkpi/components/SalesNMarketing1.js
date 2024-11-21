import React from 'react'
// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import CustomAvatar from "../../@core/components/icon"

// ** Icon Imports
import Icon from '../../@core/components/icon'
import { useMediaQuery, useTheme } from '@mui/material';
const RawMaterial = ({tkn, bgColor}) => {
    const theme = useTheme();
    const isMaxWidth599px = useMediaQuery('(max-width:599px)');
    const data = [
        {
          stats: '230',
          title: 'Total Order',
        //   color: `${theme?.palette?.}`,
          // icon: 'tabler:chart-pie-2'
        },
        {
        //   color: 'info',
          stats: '849',
          title: 'Avg. Order Size',
          // icon: 'tabler:users'
        },
        {
        //   color: 'error',
          stats: '14 Days',
          title: 'Lead Time',
          // icon: 'tabler:shopping-cart'
        },
        {
          stats: '94 Days',
        //   color: 'success',
          title: 'Delay Time',
          // icon: 'tabler:currency-dollar'
        },
        {
        //   color: 'error',
          stats: '123',
          title: 'Avg. Labour',
          // icon: 'tabler:shopping-cart'
        },
        {
          stats: '6.97%',
        //   color: 'success',
          title: 'Sales Return (%)',
          // icon: 'tabler:currency-dollar'
        },
        {
          stats: '45',
        //   color: 'success',
          title: 'Stock Book Jobs',
          // icon: 'tabler:currency-dollar'
        },
        {
          stats: '745',
        //   color: 'success',
          title: 'Inventory TurnOver (%)',
          // icon: 'tabler:currency-dollar'
        },
      ]

    const renderStats = () => {
        return data.map((sale, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} style={{paddingTop:isMaxWidth599px ? 20 : 48}}>
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              {/* <CustomAvatar skin='light' color={sale.color} sx={{ mr: 4, width: 42, height: 42 }}>
                <Icon icon={sale.icon} fontSize='1.5rem' />
              </CustomAvatar> */}
              { !isMaxWidth599px && <Box sx={{ display: 'flex', flexDirection:'column' }}>
                <Typography variant='h6' color={bgColor} sx={{fontWeight:'bolder'}}>{sale.title}</Typography>
                <Typography variant='h4' color={theme?.palette?.grey?.[700]}>{sale.stats}</Typography>
              </Box>}
              { isMaxWidth599px && <Box sx={{ display: 'flex', justifyContent:'space-between', alignItems:'center', width:'100%' }}>
                <Typography variant='h6' color={bgColor} sx={{fontWeight:'bolder'}}>{sale.title}</Typography>
                <Typography variant='h6' color={theme?.palette?.grey?.[700]}>{sale.stats}</Typography>
              </Box>}
            </Box>
          </Grid>
        ))
      }
  return (
    <>
       <Card  className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}}>
            {/* <CardHeader
                title='Sales & Marketing'
                sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
                // action={
                //     <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                //     Updated 1 month ago
                //     </Typography>
                // }
                /> */}
            <CardContent
                sx={{ pt: theme => `${theme.spacing(4)} !important`, pb: theme => `${theme.spacing(4)} !important` }}
                >
            <Grid container spacing={6}>
                {renderStats()}
            </Grid>
            </CardContent>
        </Card>
    </>
  )
}

export default RawMaterial