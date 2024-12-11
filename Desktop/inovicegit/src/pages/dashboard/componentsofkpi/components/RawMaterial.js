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
import moment from 'moment';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { checkNullUndefined } from './global';
const RawMaterial = ({tkn, bgColor, fdate, tdate, RMData}) => {
    const theme = useTheme();
    const kpiMFGFlag = useSelector((state) => state?.kpi?.mfg);
    const apiCall = useSelector(state => state?.kpi?.apiCall);

    const [apiData, setApiData] = useState([]);
    const [rawMaterial, setRawMaterial] = useState([]);

      useEffect(() => { 

        setRawMaterial(apiData);

      },[apiData]);

      // useEffect(() => {

      //   if(tdate && fdate){          
      //     getKPIProductionData();
      //   }
      // },[fdate, tdate]);

    const getKPIProductionData = async() => {
      try {

        const currentTime = moment().format('HH:mm:ss');
        // Combine selected date and current time
        const formattedStartDate = moment(fdate, 'MM/DD/YYYY').format('DD/MM/YYYY') + ` ${currentTime}`;
        const formattedEndDate = moment(tdate, 'MM/DD/YYYY').format('DD/MM/YYYY') + ` ${currentTime}`;
          const body = {
            "con":"{\"id\":\"\",\"mode\":\"kpidashboard\",\"appuserid\":\"admin@hs.com\"}",
            "p":`{\"fdate\":\"${fdate}\",\"tdate\":\"${tdate}\"}`,  
            "f":"m-test2.orail.co.in (ConversionDetail)"
          }

        const headers = {
          Authorization:`Bearer ${tkn}`,
          YearCode:"e3t6ZW59fXt7MjB9fXt7b3JhaWwyNX19e3tvcmFpbDI1fX0=",
          version:"v4",
          sv:0
        }
        if(fdate && tdate){
          const response = await axios.post("http://zen/api/report.aspx", body, { headers: headers });
          if(response?.status === 200){
              if(response?.data?.Status === '200'){
                if(response?.data?.Data?.rd?.length > 0){

                  const apiArr = response?.data?.Data?.rd;

                  const data = [
                    {
                      stats: apiArr[0]?.rm_baggingcompleted,
                      title: 'Bagging Completed',
                    },
                    {
                      stats: ((apiArr[0]?.rm_avg_proc_time / (60 * 60 * 24))?.toFixed(2)),
                      title: 'Avg. Process Time',
                    },
                    {
                      stats: apiArr[0]?.rm_grossloss === null ? 0 : apiArr[0]?.rm_grossloss,
                      title: 'Gross Loss',
                    },
                    {
                      stats: apiArr[0]?.rm_goldstock === null ? 0 : apiArr[0]?.rm_goldstock,
                      title: 'Gold Stock',
                      wt: apiArr[0]?.rm_goldstock_wt === null ? 0 : apiArr[0]?.rm_goldstock_wt
                    },
                    {
                      stats: apiArr[0]?.rm_diastock === null ? 0 : apiArr[0]?.rm_diastock,
                      title: 'Diamond Stock',
                      wt:apiArr[0]?.rm_diastock_wt === null ? 0 : apiArr[0]?.rm_diastock_wt
                    },
                    {
                      stats: apiArr[0]?.rm_csstock === null ? 0 : apiArr[0]?.rm_csstock,
                      title: 'Colour Stone Stock',
                      wt:apiArr[0]?.rm_csstock_wt === null ? 0 : apiArr[0]?.rm_csstock_wt
                    }
                ];
                setApiData(data);

                }
              }
          }
        }


      } catch (error) {
        console.log(error);
      }
  }

    const renderStats = () => {
        return RMData?.map((sale, index) => (
          <Grid item xs={6} md={4} key={index}>
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', pt:0 }}>
           
              <Box sx={{ display: 'flex', flexDirection: 'column', pt:0 }}>
                <Typography variant='h6' color={bgColor}  >{sale.title}</Typography>
                <Typography variant='h5' color={theme?.palette?.grey?.[700]} sx={{fontWeight:'bolder'}} >{((sale.stats))}</Typography>
                { sale.wt === undefined ? <div>&nbsp;</div> : <Typography variant='h5' color={theme?.palette?.grey?.[700]} sx={{fontWeight:'bolder'}} >{((sale.wt))} </Typography>}
              </Box>
            </Box>
          </Grid>
        ))
      }
  return (
    <>
       <Card  className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'198px'}}>
          
            {  kpiMFGFlag ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding:'1rem',  }}>
              <CircularProgress sx={{color:'black'}} />
            </Box> :
            <CardContent
                sx={{ pt: theme => `${theme.spacing(1)} !important`, pb: theme => `${theme.spacing(1)} !important` }}
                >
            <Grid container spacing={2}>
                {renderStats()}
            </Grid>
            </CardContent>}
        </Card>
    </>
  )
}

export default RawMaterial
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
// const RawMaterial = ({tkn, bgColor}) => {
//     const theme = useTheme();
//     const data = [
//         {
//           stats: '230',
//           title: 'Bagging Completed',
//         //   color: `${theme?.palette?.}`,
//           // icon: 'tabler:chart-pie-2'
//         },
//         {
//         //   color: 'info',
//           stats: '54 Days',
//           title: 'Avg. Process Time',
//           // icon: 'tabler:users'
//         },
//         {
//         //   color: 'error',
//           stats: '4%',
//           title: 'Gross Loss',
//           // icon: 'tabler:shopping-cart'
//         },
//         {
//           stats: '74 gm',
//         //   color: 'success',
//           title: 'Gold Stock',
//           // icon: 'tabler:currency-dollar'
//         },
//         {
//         //   color: 'error',
//           stats: '423 ctw',
//           title: 'Diamond Stock',
//           // icon: 'tabler:shopping-cart'
//         },
//         {
//           stats: '45 ctw',
//         //   color: 'success',
//           title: 'Colour Stone Stock',
//           // icon: 'tabler:currency-dollar'
//         }
//       ]

//     const renderStats = () => {
//         return data.map((sale, index) => (
//           <Grid item xs={6} md={4} key={index}>
//             <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
//               {/* <CustomAvatar skin='light' color={sale.color} sx={{ mr: 4, width: 42, height: 42 }}>
//                 <Icon icon={sale.icon} fontSize='1.5rem' />
//               </CustomAvatar> */}
//               <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                 <Typography variant='h6' color={bgColor} sx={{fontWeight:'bolder'}} >{sale.title}</Typography>
//                 <Typography variant='h4' color={theme?.palette?.grey?.[700]} >{sale.stats}</Typography>
//               </Box>
//             </Box>
//           </Grid>
//         ))
//       }
//   return (
//     <>
//        <Card  className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}}>
//             {/* <CardHeader
//                 title='Raw Material'
//                 sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
//                 // action={
//                 //     <Typography variant='body2' sx={{ color: 'text.disabled' }}>
//                 //     Updated 1 month ago
//                 //     </Typography>
//                 // }
//                 /> */}
//             <CardContent
//                 sx={{ pt: theme => `${theme.spacing(3)} !important`, pb: theme => `${theme.spacing(3)} !important` }}
//                 >
//             <Grid container spacing={6}>
//                 {renderStats()}
//             </Grid>
//             </CardContent>
//         </Card>
//     </>
//   )
// }

// export default RawMaterial