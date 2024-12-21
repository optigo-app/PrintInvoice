import React, { useEffect, useState } from 'react'
// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import { CircularProgress, Modal, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { fetchKPIDashboardData } from '../../GlobalFunctions';
import { checkNullUndefined } from './global';
import CancelIcon from '@mui/icons-material/Cancel';

//SALES AND MARKETING 3ST BLOCK
const RawMaterial = ({tkn, fdate, tdate, bgColor, SM1, popUpList}) => {
    const theme = useTheme();
    const isMaxWidth599px = useMediaQuery('(max-width:599px)');
    const [mainData, setMainData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [orderModal, setOrderModal] = useState(false);
    const [popupDetails, setPopUpDetails] = useState([]);
    const [popUpHeader, setPopUpHeader] = useState('');

    const [popUpFlag, setPopUpFlag] = useState('');

    // useEffect(() => {
    //         if(fdate && tdate){
    //           getSalesMarketingData();
    //         }
    // },[fdate, tdate]);

    const orderDetails = [
      {
        orderType:"All Order Type",
        orderValue:152036.327
      },
      {
        orderType:"Urgent Order",
        orderValue:705.749
      },
      {
        orderType:"Job Work",
        orderValue:4040.582
      },
      {
        orderType:"Regular Order",
        orderValue:4040.582
      },
    ]

    const getSalesMarketingData = async() => {
        try {
            setLoading(true);
            // const InventoryTurnOverRatio = await fetchKPIDashboardData(tkn, fdate, tdate, "InventoryTurnOverRatio");
            const InventoryTurnOverRatio = [];
            // const SalesMarketing_TotalSale = await fetchKPIDashboardData(tkn, fdate, tdate, "SalesMarketing_TotalSale");
            const SalesMarketing_TotalSale = [];
            // const SalesMarketing_Order = await fetchKPIDashboardData(tkn, fdate, tdate, "SalesMarketing_Order");
            const SalesMarketing_Order = [];
            // const SalesMarketing_OrderCompletion = await fetchKPIDashboardData(tkn, fdate, tdate, "SalesMarketing_OrderCompletion");
            const SalesMarketing_OrderCompletion = [];
            if(SalesMarketing_TotalSale || SalesMarketing_Order || SalesMarketing_OrderCompletion){
                setLoading(false);
            }
            const obj = {
                stats: `${SalesMarketing_Order[0]?.TotalOrder?.toFixed(3)} Gm`,
                title: 'Total Order',
            }
            const obj1 = {
                stats: `${SalesMarketing_Order[0]?.AvgOrderSize}`,
                title: 'Avg. Order Size',
            }
            const obj2 = {
                stats: `${SalesMarketing_OrderCompletion[0]?.LeadTime}`,
                title: 'Lead Time',
            }
            const obj3 = {
                stats: `${SalesMarketing_OrderCompletion[0]?.DelayTime}`,
                title: 'Delay Time',
            }
            const obj4 = {
                stats: `${SalesMarketing_TotalSale[0]?.AvgLabour}`,
                title: 'Avg. Labour',
            }
            const obj5 = {
                stats: `${SalesMarketing_TotalSale[0]?.SaleReturnPer === null ? '' : SalesMarketing_TotalSale[0]?.SaleReturnPer}`,
                title: 'Sales Return (%)',
            }
            const obj6 = {
                stats: `${SalesMarketing_Order[0]?.StockCountWithOutClub}`,
                title: 'Stock Book Jobs',
            }
            const obj7 = {
                stats: ``,
                title: 'Overdue Debtors',
            }

            const arr = [obj, obj1, obj2, obj3, obj4, obj5, obj6, obj7];

            setMainData(arr);


        } catch (error) {
          console.log(error);
          setLoading(false);
        }
    }

    const handleOpenOrderModal = (sale) => {
      
        if(sale?.title?.toLowerCase() === "total order" && parseFloat(sale?.stats) > 0){
          setOrderModal(true);
          setPopUpDetails(popUpList);
          setPopUpHeader('Order Details');
          setPopUpFlag("order");
        }
        
        if(sale?.title?.toLowerCase() === "avg. order size" && parseFloat(sale?.stats) > 0){
          setOrderModal(true);
          setPopUpDetails(popUpList);
          setPopUpHeader('Average Order Size Details');
          setPopUpFlag("orderavgsize");
        }
        
    }

    const renderStats = () => {
        return SM1?.map((sale, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} style={{paddingTop:isMaxWidth599px ? 20 : 48}}>
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              { !isMaxWidth599px && <>
              <Box sx={{ display: 'flex', flexDirection:'column' }}>
                <Typography variant='h6' color={bgColor} >{checkNullUndefined(sale.title)}</Typography>
                <Typography variant='h5' 
                onClick={() => handleOpenOrderModal(sale)} 
                style={{textDecoration:` ${(((sale?.title === 'Total Order' || sale?.title === "Avg. Order Size") && parseFloat(sale?.stats)) > 0) ? 'underline' : ''}`, 
                cursor: (((sale?.title === "Total Order" || sale?.title === "Avg. Order Size") && parseFloat(sale?.stats)) > 0) ? "pointer" : "default", 
                color : `${((sale?.title === "Total Order" || sale?.title === "Avg. Order Size") && (parseFloat(sale?.stats) > 0)) ? bgColor : theme?.palette?.grey?.[700]}`
              }}
                //  color={((sale?.title === "Total Order") && (sale?.stats > 0)) ? theme?.palette?.customColors?.purple : theme?.palette?.grey?.[700]} 
                 sx={{fontWeight:'bolder'}}>{checkNullUndefined(sale.stats)}</Typography>
              </Box></>
              }
              { isMaxWidth599px && <>
              <Box sx={{ display: 'flex', justifyContent:'space-between', alignItems:'center', width:'100%' }}>
                <Typography variant='h6' color={bgColor} >{checkNullUndefined(sale.title)}</Typography>
                <Typography variant='h5' onClick={() => handleOpenOrderModal(sale)}  
                style={{textDecoration:` ${(((sale?.title === 'Total Order' || sale?.title === "Avg. Order Size") && parseFloat(sale?.stats)) > 0) ? 'underline' : ''}`, 
                cursor: (((sale?.title === "Total Order" || sale?.title === "Avg. Order Size") && parseFloat(sale?.stats)) > 0) ? "pointer" : "default",
                color : `${((sale?.title === "Total Order" || sale?.title === "Avg. Order Size") && (parseFloat(sale?.stats) > 0)) ? bgColor : theme?.palette?.grey?.[700]}`
                }} 
                // color={ ((sale?.title === "Total Order" && parseFloat(sale?.stats) > 0)) ? theme?.palette?.customColors?.purple : theme?.palette?.grey?.[700]} 
                sx={{fontWeight:'bolder'}}>{checkNullUndefined(sale.stats)}</Typography>
              </Box></>
              }
            </Box>
          </Grid>
        ))
      }
      const safeValue = (value) => {
        if (
            value === null || 
            value === undefined || 
            value === "null" || 
            value === "undefined" || 
            value === Infinity || 
            value === -Infinity || 
            isNaN(value)
        ) {
            return 0;
        }
        return value;
    };
  return (
    <>
       <Card  className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'230px'}}>
 
            { loading ?
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding:'1rem',  }}>
              <CircularProgress sx={{color:'black'}} />
            </Box> :
              <CardContent
                sx={{ pt: theme => `${theme.spacing(4)} !important`, pb: theme => `${theme.spacing(4)} !important` }}
                >
            <Grid container spacing={6}>
                {renderStats()}
                {
                    orderModal && (
                      <Modal
                        open={orderModal}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description"
                        onClose={() => setOrderModal(false)}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 550,
                            maxHeight:'500px',
                            overflow:'auto',
                            // backgroundColor: 'linear-gradient(135deg, #f3f4f6, #ffffff)',
                            backgroundColor:'white',
                            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
                            pt: 4,
                            px: 5,
                            pb: 3,
                            borderRadius: '12px',
                            outline:'none',
                            pt:0
                          }}
                          className="boxShadow_hp"
                        >
                          {/* <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}> */}
                          <Box 
                            sx={{
                              position: 'sticky',
                              top: 0,
                              zIndex: 10, // Ensure it stays above content
                              backgroundColor: 'white', // To make sure the header stays opaque over the content
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0 15px',
                              paddingTop:'20px',
                              paddingBottom:'10px',
                              marginBottom: '16px', // Adds a small gap to content below the sticky header
                              borderRadius: '12px 12px 0 0',
                              zIndex:1000
                              // boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', // Optional: Adds a small shadow to make it stand out
                            }}
                          >
                            <span></span>
                            <Typography
                              id="parent-modal-title"
                              variant="h5"
                              component="h2"
                              sx={{
                                textAlign: 'center',
                                color: '#333',
                                fontWeight: 'bold',
                                // pb: 2,
                                // borderBottom: '1px solid #ccc',
                              }}
                              className='fs_analytics_l'
                            >
                              {popUpHeader}
                            </Typography>
                            <Tooltip title="Close" style={{cursor:'pointer'}} onClick={() => setOrderModal(false)}><CancelIcon /></Tooltip>
                          </Box>
                          <Box
                            sx={{
                              mt: 3,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: "18px",
                            }}
                          >
                            {popupDetails?.DT1?.map((e, i) => (
                              <Box
                                key={i}
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '10px 15px',
                                  backgroundColor: '#f9fafb',
                                  borderRadius: '8px',
                                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                  transition: 'transform 0.2s, box-shadow 0.2s',
                                  margin: "0px 5px",
                                  '&:hover': {
                                    transform: 'scale(1.02)',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                                  },
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: '500',
                                    color: '#555',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                  }}
                                  className='fs_analytics_l'
                                >
                                  {/* Add an icon here */}
                                  {e?.OrderTypeName}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontWeight: 'bold',
                                    color: '#222',
                                  }}
                                  className='fs_analytics_l'
                                >
                                  {/* { popUpFlag === "order" ?  `${(e?.NetWt)?.toFixed(3)} gm`}` : `${(e?.NetWt / e?.OrderCnt)?.toFixed(3)}` } */}
                                  { popUpFlag === "order" && <>{e?.NetWt?.toFixed(3)} gm</>}
                                  { popUpFlag !== "order" && <>{(safeValue(e?.NetWt / e?.OrderCnt))?.toFixed(2)} </>}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              mt: 3,
                            }}
                          >
                            <button
                              style={{
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                                letterSpacing:'1.2px'
                              }}
                              className='fs_analytics_l'
                              onClick={() => setOrderModal(false)}
                              onMouseOver={(e) =>
                                (e.target.style.backgroundColor = '#0056b3')
                              }
                              onMouseOut={(e) =>
                                (e.target.style.backgroundColor = '#007bff')
                              }
                            >
                              Close
                            </button>
                          </Box>
                        </Box>
                      </Modal>
  )
}

            </Grid>
            </CardContent>
            }
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
// import { useMediaQuery, useTheme } from '@mui/material';
// const RawMaterial = ({tkn, bgColor}) => {
//     const theme = useTheme();
//     const isMaxWidth599px = useMediaQuery('(max-width:599px)');
//     const data = [
//         {
//           stats: '230',
//           title: 'Total Order',
//         //   color: `${theme?.palette?.}`,
//           // icon: 'tabler:chart-pie-2'
//         },
//         {
//         //   color: 'info',
//           stats: '849',
//           title: 'Avg. Order Size',
//           // icon: 'tabler:users'
//         },
//         {
//         //   color: 'error',
//           stats: '14 Days',
//           title: 'Lead Time',
//           // icon: 'tabler:shopping-cart'
//         },
//         {
//           stats: '94 Days',
//         //   color: 'success',
//           title: 'Delay Time',
//           // icon: 'tabler:currency-dollar'
//         },
//         {
//         //   color: 'error',
//           stats: '123',
//           title: 'Avg. Labour',
//           // icon: 'tabler:shopping-cart'
//         },
//         {
//           stats: '6.97%',
//         //   color: 'success',
//           title: 'Sales Return (%)',
//           // icon: 'tabler:currency-dollar'
//         },
//         {
//           stats: '45',
//         //   color: 'success',
//           title: 'Stock Book Jobs',
//           // icon: 'tabler:currency-dollar'
//         },
//         {
//           stats: '745',
//         //   color: 'success',
//           title: 'Inventory TurnOver (%)',
//           // icon: 'tabler:currency-dollar'
//         },
//       ]

//     const renderStats = () => {
//         return data.map((sale, index) => (
//           <Grid item xs={12} sm={6} md={3} key={index} style={{paddingTop:isMaxWidth599px ? 20 : 48}}>
//             <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
//               {/* <CustomAvatar skin='light' color={sale.color} sx={{ mr: 4, width: 42, height: 42 }}>
//                 <Icon icon={sale.icon} fontSize='1.5rem' />
//               </CustomAvatar> */}
//               { !isMaxWidth599px && <Box sx={{ display: 'flex', flexDirection:'column' }}>
//                 <Typography variant='h6' color={bgColor} sx={{fontWeight:'bolder'}}>{sale.title}</Typography>
//                 <Typography variant='h4' color={theme?.palette?.grey?.[700]}>{sale.stats}</Typography>
//               </Box>}
//               { isMaxWidth599px && <Box sx={{ display: 'flex', justifyContent:'space-between', alignItems:'center', width:'100%' }}>
//                 <Typography variant='h6' color={bgColor} sx={{fontWeight:'bolder'}}>{sale.title}</Typography>
//                 <Typography variant='h6' color={theme?.palette?.grey?.[700]}>{sale.stats}</Typography>
//               </Box>}
//             </Box>
//           </Grid>
//         ))
//       }
//   return (
//     <>
//        <Card  className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}}>
//             {/* <CardHeader
//                 title='Sales & Marketing'
//                 sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
//                 // action={
//                 //     <Typography variant='body2' sx={{ color: 'text.disabled' }}>
//                 //     Updated 1 month ago
//                 //     </Typography>
//                 // }
//                 /> */}
//             <CardContent
//                 sx={{ pt: theme => `${theme.spacing(4)} !important`, pb: theme => `${theme.spacing(4)} !important` }}
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