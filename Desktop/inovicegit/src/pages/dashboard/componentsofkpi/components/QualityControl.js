import React, { useEffect, useState } from 'react'
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
import { CircularProgress, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { checkNullUndefined } from './global';
const QualityControl = ({tkn, bgColor, tdate, fdate, QCData, QuaC }) => {
    const theme = useTheme();
    const [qcData, setQCData] = useState([]);
    const kpiMFGFlag = useSelector((state) => state?.kpi?.mfg);
    const apiCall = useSelector(state => state?.kpi?.apiCall);


      useEffect(() => {
        if(fdate && tdate){
          setQCData(QCData);
        }
      },[QCData]);

    const renderStats = () => {
        return QCData?.map((sale, index) => (
          <Grid item xs={6} md={6} key={index}>
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              {/* <CustomAvatar skin='light' color={sale.color} sx={{ mr: 4, width: 42, height: 42 }}>
                <Icon icon={sale.icon} fontSize='1.5rem' />
              </CustomAvatar> */}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h6' color={bgColor} >{checkNullUndefined(sale.title)}</Typography>
                <Typography variant='h5' color={theme?.palette?.grey?.[700]} sx={{fontWeight:'bolder'}}>{checkNullUndefined(sale.stats)}</Typography>
              </Box>
            </Box>
          </Grid>
        ))
      }

  return (
    <Card  className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'198px'}}>
        {/* <CardHeader
            title='Quality Control'
            sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
            // action={
            //     <Typography variant='body2' sx={{ color: 'text.disabled' }}>
            //     Updated 1 month ago
            //     </Typography>
            // }
            /> */}
        {
          kpiMFGFlag ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding:'1rem',  }}>
          <CircularProgress sx={{color:'black'}} />
        </Box> :
          <CardContent
            sx={{ pt: theme => `${theme.spacing(3)} !important`, pb: theme => `${theme.spacing(3)} !important` }}
            >
        <Grid container spacing={6}>
            {renderStats()}
        </Grid>
        </CardContent>}
  </Card>
  )
}

export default QualityControl;
// import React from 'react'
// // ** MUI Imports
// import Box from '@mui/material/Box'
// import Grid from '@mui/material/Grid'
// import Card from '@mui/material/Card'
// import CardHeader from '@mui/material/CardHeader'
// import Typography from '@mui/material/Typography'
// import CardContent from '@mui/material/CardContent'

// import CustomAvatar from "../../@core/components/icon"

// // ** Icon Imports
// import Icon from '../../@core/components/icon'
// import { useTheme } from '@mui/material';
// const QualityControl = ({tkn, bgColor}) => {
//     const theme = useTheme();
//     const data = [
//         {
//           stats: '230',
//           title: 'Inward',
//         //   color: `${theme?.palette?.}`,
//           // icon: 'tabler:chart-pie-2'
//         },
//         {
//         //   color: 'info',
//           stats: '549',
//           title: 'Outward',
//           // icon: 'tabler:users'
//         },
//         {
//         //   color: 'error',
//           stats: '423',
//           title: 'Total Jobs',
//           // icon: 'tabler:shopping-cart'
//         },
//         {
//           stats: '45 Days',
//         //   color: 'success',
//           title: 'Avg. Prs. Time',
//           // icon: 'tabler:currency-dollar'
//         }
//       ]

//     const renderStats = () => {
//         return data.map((sale, index) => (
//           <Grid item xs={6} md={6} key={index}>
//             <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
//               {/* <CustomAvatar skin='light' color={sale.color} sx={{ mr: 4, width: 42, height: 42 }}>
//                 <Icon icon={sale.icon} fontSize='1.5rem' />
//               </CustomAvatar> */}
//               <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                 <Typography variant='h6' color={bgColor} sx={{fontWeight:'bolder'}}>{sale.title}</Typography>
//                 <Typography variant='h4' color={theme?.palette?.grey?.[700]}>{sale.stats}</Typography>
//               </Box>
//             </Box>
//           </Grid>
//         ))
//       }

//   return (
//     <Card  className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}}>
//         {/* <CardHeader
//             title='Quality Control'
//             sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
//             // action={
//             //     <Typography variant='body2' sx={{ color: 'text.disabled' }}>
//             //     Updated 1 month ago
//             //     </Typography>
//             // }
//             /> */}
//         <CardContent
//             sx={{ pt: theme => `${theme.spacing(3)} !important`, pb: theme => `${theme.spacing(3)} !important` }}
//             >
//         <Grid container spacing={6}>
//             {renderStats()}
//         </Grid>
//         </CardContent>
//   </Card>
//   )
// }

// export default QualityControl