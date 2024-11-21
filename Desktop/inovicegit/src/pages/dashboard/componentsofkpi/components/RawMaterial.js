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
import { useTheme } from '@mui/material';
const RawMaterial = ({tkn, bgColor}) => {
    const theme = useTheme();
    const data = [
        {
          stats: '230',
          title: 'Bagging Completed',
        //   color: `${theme?.palette?.}`,
          // icon: 'tabler:chart-pie-2'
        },
        {
        //   color: 'info',
          stats: '54 Days',
          title: 'Avg. Process Time',
          // icon: 'tabler:users'
        },
        {
        //   color: 'error',
          stats: '4%',
          title: 'Gross Loss',
          // icon: 'tabler:shopping-cart'
        },
        {
          stats: '74 gm',
        //   color: 'success',
          title: 'Gold Stock',
          // icon: 'tabler:currency-dollar'
        },
        {
        //   color: 'error',
          stats: '423 ctw',
          title: 'Diamond Stock',
          // icon: 'tabler:shopping-cart'
        },
        {
          stats: '45 ctw',
        //   color: 'success',
          title: 'Colour Stone Stock',
          // icon: 'tabler:currency-dollar'
        }
      ]

    const renderStats = () => {
        return data.map((sale, index) => (
          <Grid item xs={6} md={4} key={index}>
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              {/* <CustomAvatar skin='light' color={sale.color} sx={{ mr: 4, width: 42, height: 42 }}>
                <Icon icon={sale.icon} fontSize='1.5rem' />
              </CustomAvatar> */}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h6' color={bgColor} sx={{fontWeight:'bolder'}} >{sale.title}</Typography>
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
            <CardContent
                sx={{ pt: theme => `${theme.spacing(3)} !important`, pb: theme => `${theme.spacing(3)} !important` }}
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