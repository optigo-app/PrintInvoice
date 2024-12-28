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
import { checkNullUndefined, safeValue } from './global';
import { formatAmount } from '../../GlobalFunctions'
const RawMaterial = ({tkn, bgColor, fdate, tdate, RMData, bgComp, g_loss, rmStock, lossLoader, rmStockLoader, bgLoader}) => {
    const theme = useTheme();
    const kpiMFGFlag = useSelector((state) => state?.kpi?.mfg);
    const apiCall = useSelector(state => state?.kpi?.apiCall);

    const [apiData, setApiData] = useState([]);
    const [rawMaterial, setRawMaterial] = useState([]);

      // useEffect(() => { 

      //   formateArray();

      // },[apiData]);


      // const formateArray = () => {
      //   try {
      //     const combinedData = {};
      //     const allLocations = new Set();
        
      //     // Merge data from kpidashboard_mfg
      //     obj?.kpidashboard_mfg?.forEach((item) => {
      //       const location = item?.manufacturelocationname || "NoLocation";
        
      //       if (!combinedData[location]) {
      //         combinedData[location] = {};
      //       }
        
      //       // If manufacturelocationname is "-", merge with "NoLocation"
      //       if (location === "-") {
      //         combinedData["NoLocation"] = {
      //           ...combinedData["NoLocation"],
      //           "Production (gm)": (combinedData["NoLocation"]?.["Production (gm)"] || 0) + (item?.mfg_production_gms || 0),
      //           Jobs: (combinedData["NoLocation"]?.Jobs || 0) + (item?.mfg_jobs || 0),
      //           "Gross Loss (%)": (combinedData["NoLocation"]?.["Gross Loss (%)"] || 0) + (item?.mfg_grossloss || 0),
      //           "Rejection (%)": (combinedData["NoLocation"]?.["Rejection (%)"] || 0) + (item?.mfg_rejection || 0),
      //         };
      //       } else {
      //         combinedData[location] = {
      //           ...combinedData[location],
      //           "Production (gm)": (item?.mfg_production_gms)?.toFixed(3) || 0.000,
      //           Jobs: (item?.mfg_jobs) || 0.00,
      //           "Gross Loss (%)": (item?.mfg_grossloss)?.toFixed(3) || 0.000,
      //           "Rejection (%)": (item?.mfg_rejection)?.toFixed(3) || 0.000,
      //         };
      //       }
        
      //       allLocations.add(location);
      //     });
        
      //     // Merge data from SalesMarketing_TotalSaleLocationWise
      //     obj?.SalesMarketing_TotalSaleLocationWise?.forEach((item) => {
      //       const location = item?.locationname || "NoLocation";
        
      //       if (!combinedData[location]) {
      //         combinedData[location] = {};
      //       }
        
      //       // If locationname is "NoLocation", sum the respective fields
      //       if (location === "NoLocation") {
      //         combinedData["NoLocation"] = {
      //           ...combinedData["NoLocation"],
      //           "Labour Amount": (combinedData["NoLocation"]?.["Labour Amount"] || 0) + (item?.LabourAmount || 0),
      //         };
      //       } else {
      //         combinedData[location] = {
      //           ...combinedData[location],
      //           "Labour Amount": item?.LabourAmount || 0.00,
      //         };
      //       }
        
      //       allLocations.add(location);
      //     });
        
      //     // Define KPIs
      //     const kpis = [
      //       "Production (gm)",
      //       "Jobs",
      //       "Labour Amount",
      //       "Gross Loss (%)",
      //       "Rejection (%)",
      //     ];
        
      //     // Create Rows for the Table
      //     const tableRows = kpis?.map((kpi, index) => {
      //       const row = { id: index + 1, KPI: kpi };
      //       allLocations.forEach((location) => {
      //         // Apply conditional decimal formatting based on KPI name
      //         if (kpi === "Labour Amount") {
      //           row[location] = parseFloat(combinedData[location]?.[kpi] || 0.00)?.toFixed(2); // 2 decimals for amount
      //         } else if (kpi === "Production (gm)" || kpi === "Gross Loss (%)" || kpi === "Rejection (%)") {
      //           row[location] = parseFloat(combinedData[location]?.[kpi] || 0.000)?.toFixed(3); // 3 decimals for weight/loss
      //         } else {
      //           row[location] = (combinedData[location]?.[kpi] || 0.00);
      //         }
      //       });
      //       return row;
      //     });
        
      //     // Define Columns for the Table
      //     const tableColumns = [
      //       { field: "KPI", headerName: "KPI", width: 200 },
      //       ...Array?.from(allLocations)?.map((location) => ({
      //         field: location,
      //         headerName: location,
      //         flex: 1,
      //         minWidth: 170,
      //         maxWidth: 300,
      //       })),
      //     ];
        
      //     // Rename NoLocation header if necessary
      //     tableColumns?.forEach((e) => {
      //       if (e?.headerName?.toLowerCase() === "nolocation") {
      //         e.headerName = "OutRight";
      //       }
      //     });
        
      //     setMFGData(tableRows);
      //     setColumns(tableColumns);
      //   } catch (error) {
      //     console.log(error);
      //     setPleaseWaitFlag(false);
      //   }
        
      // }

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


  const data6 = [
                
    {
      stats: `${safeValue(bgComp?.rm_baggingcompleted)} jobs`,
      title: 'Bagging Completed',
    },

    {
      stats: `${(parseInt((safeValue(bgComp?.rm_avg_proc_time) / (60 * 60 * 24)))?.toFixed(0))} Days`,
      title: 'Avg. Process Time',
    },
    
    // {
    //   stats: ` ${ g_loss?.rm_grossloss === null ? '-' : <>{(safeValue(g_loss?.rm_grossloss)?.toFixed(3))} gm</>} `,
    //   title: 'Gross Loss',
    // },
    {
      stats: g_loss?.rm_grossloss === null ? '-' : (
        <>
          {(safeValue(g_loss?.rm_grossloss)?.toFixed(3))} gm
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
      stats: (rmStock?.rm_goldstock_amt === null || rmStock?.rm_goldstock_amt === undefined) ? 0 : ` ₹ ${formatAmount(safeValue((rmStock?.rm_goldstock_amt)?.toFixed(2)))} `,
      title: 'Gold Stock',
      wt: `${(+(safeValue(rmStock?.rm_goldstock_wt)))?.toFixed(3)} gm`
    },
 
    {
      stats: (rmStock?.rm_diastock_amt === null || rmStock?.rm_diastock_amt === undefined) ? 0 : ` ₹ ${formatAmount(safeValue((rmStock?.rm_diastock_amt))?.toFixed(2))}`,
      title: 'Diamond Stock',
      wt: `${(+(safeValue(rmStock?.rm_diastock_wt)))?.toFixed(3)} ctw`
    },
    {
      stats: (rmStock?.rm_csstock_amt === null || rmStock?.rm_csstock_amt === undefined) ? 0 : ` ₹ ${formatAmount(safeValue((rmStock?.rm_csstock_amt))?.toFixed(2))}`,
      title: 'Colour Stone Stock',
      wt: `${(+(safeValue(rmStock?.rm_csstock_wt)))?.toFixed(3)} ctw`
    },
    {
      stats: (rmStock?.rm_miscstock_amt === null || rmStock?.rm_miscstock_amt === undefined) ? 0 : ` ₹ ${formatAmount(safeValue((rmStock?.rm_miscstock_amt))?.toFixed(2))}`,
      title: 'Misc Stock',
      wt: `${(+(safeValue(rmStock?.rm_miscstock_wt)))?.toFixed(3)} ctw`
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