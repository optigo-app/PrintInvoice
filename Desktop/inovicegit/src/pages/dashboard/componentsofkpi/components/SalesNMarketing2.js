// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { CircularProgress, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import {  fetchKPIDashboardData,  formatAmount,  formatAmountKWise, formatAmountRound } from '../../GlobalFunctions';
import { checkNullUndefined } from './global';

//SALES AND MARKETING 1ST BLOCK
const SalesNMarketing2 = ({tkn, fdate, tdate, bgColor, SM2, saleMTs, saleMTsLoader}) => {
  const theme = useTheme();

  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  

  // useEffect(() => {
  //         if(fdate && tdate){
  //           getSalesMarketingData();
  //         }
  // },[fdate, tdate]);

  const getSalesMarketingData = async() => {
    try {
      setLoading(true);
        // const SalesMarketing_TotalSale = await fetchKPIDashboardData(tkn, fdate, tdate, "SalesMarketing_TotalSale");
        const SalesMarketing_TotalSale = [];
      if(SalesMarketing_TotalSale){
        setLoading(false);
          const obj = {
            stats: `${SalesMarketing_TotalSale[0]?.NetWt?.toFixed(3)} Gm`,
            title: 'Total Sale(Net)',
          }
          const obj1 = {
            stats: `${SalesMarketing_TotalSale[0]?.MetalAmount}`,
            title: 'Gold Amount',
          }
          const obj2 = {
            stats: `${SalesMarketing_TotalSale[0]?.DiamondAmount}`,
            title: 'Diamond Amount',
          }
          const obj3 = {
            stats: `${SalesMarketing_TotalSale[0]?.ColorStoneAmount}`,
            title: 'Colour Stone Amount',
          }
          const obj6 = {
            stats: `${SalesMarketing_TotalSale[0]?.LabourAmount}`,
            title: 'Labour Amount',
          }
          
          
          let arr = [obj, obj1, obj2, obj3, obj6];
          
          setApiData(arr);
        }


    } catch (error) {
      console.log(error);
      setLoading(false);
    }
}

const data5 = [
  {
  stats: `₹ ${formatAmountRound(parseFloat(checkNullUndefined(saleMTs?.Amount))?.toFixed(2))}`,
  title: 'Total Sale Amt',
  },
 {
  stats: `₹ ${formatAmountRound((checkNullUndefined(saleMTs?.MetalAmount))?.toFixed(2))}`,
  title: 'Metal Amt',
  },
 {
  stats: `₹ ${formatAmountRound((checkNullUndefined(saleMTs?.DiamondAmount))?.toFixed(2))}`,
  title: 'Diamond Amt',
},
 {
  stats: `₹ ${formatAmountRound((checkNullUndefined(saleMTs?.ColorStoneAmount))?.toFixed(2))}`,
  title: 'Color Stone Amt',
},
{
  stats: `₹ ${formatAmountRound((checkNullUndefined((saleMTs?.LabourAmount - saleMTs?.OtherAmount)))?.toFixed(2))}`,
  title: 'Labour Amt (L+DH+S)',
},
{
  stats: `₹ ${formatAmountRound((checkNullUndefined((saleMTs?.OtherAmount + saleMTs?.DeliveryCharged)))?.toFixed(2))}`,
  title: 'Other Charges (O + D + M)',
}
];



  return (
    <Card className={`fs_analytics_l ${saleMTsLoader ? 'center_kpi' : ''}`}  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'230px'}}>

      <CardContent  sx={{
        maxHeight: '412px',
        overflow: 'auto',
        paddingBottom:'0px',
        '&::-webkit-scrollbar': {
          width: '6px',  // Customize scrollbar width
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#BDBDBD',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        },
      }}>
        { saleMTsLoader ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding:'1rem',  }}>
              <CircularProgress sx={{color:'lightgrey'}} />
            </Box> : data5?.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                '& img': { mr: 4 },
                alignItems: 'center',
                // mb: index !== saleMTs?.length - 1 ? 1.89 : undefined,
                mb: index !== SM2?.length - 1 ? 1 : undefined,
                pb:0,
              }}
            >


              <Box
                sx={{
                  rowGap: 1,
                  columnGap: 4,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom:'0px'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant='h6' color={bgColor} >{checkNullUndefined(item?.title)}</Typography>
              
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    '& svg': { mr: 1 },
                    alignItems: 'center',
                   }}
                >
                  <Typography variant='h6' color={theme?.palette?.grey?.[700]} sx={{fontWeight:'bolder'}}>{`${(checkNullUndefined(item?.stats))}`}</Typography>
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default SalesNMarketing2;

// // ** MUI Imports
// import Box from '@mui/material/Box'
// import Card from '@mui/material/Card'
// import Typography from '@mui/material/Typography'
// import CardHeader from '@mui/material/CardHeader'
// import CardContent from '@mui/material/CardContent'

// // ** Icon Imports
// // import Icon from 'src/@core/components/icon'
// // import Icon from '../@core/components/icon'

// // ** Custom Components Imports
// // import OptionsMenu from 'src/@core/components/option-menu'
// // import OptionsMenu from '../@core/components/option-menu'

// // import imgIcon from "../images/cards/brazil.png"
// import { useTheme } from '@mui/material';
// import { useEffect } from 'react';
// import { useState } from 'react';
// import { fetchDashboardData, formatAmount, formatAmountKWise } from '../../GlobalFunctions';
// import { cloneDeep } from 'lodash';

// const data = [
//   {
//     title: '$8.45k',
//     trendNumber: 25.8,
//     subtitle: 'United States',
//     imgSrc: '/images/cards/us.png'
//   },
//   {
//     title: '$7.78k',
//     trend: 'negative',
//     trendNumber: 16.2,
//     subtitle: 'Brazil',
//     imgSrc: '/images/cards/brazil.png'
//   },
//   {
//     title: '$6.48k',
//     subtitle: 'India',
//     trendNumber: 12.3,
//     imgSrc: '/images/cards/india.png'
//   },
//   {
//     title: '$5.12k',
//     trend: 'negative',
//     trendNumber: 11.9,
//     subtitle: 'Australia',
//     imgSrc: '/images/cards/australia.png'
//   },
//   {
//     title: '$4.45k',
//     subtitle: 'France',
//     trendNumber: 16.2,
//     imgSrc: '/images/cards/france.png'
//   },
//   {
//     title: '$3.90k',
//     subtitle: 'China',
//     trendNumber: 14.8,
//     imgSrc: '/images/cards/china.png'
//   }
// ]

// const SalesNMarketing2 = ({tkn, bgColor, data4}) => {
//   const theme = useTheme();

//   const [apiData, setApiData] = useState([]);

//   useEffect(() => {

//     const fetchData = async () => {
//       try {

//         // Fetch MonthWiseSaleAmount data
//         let CountryWiseSaleAmount = await fetchDashboardData(tkn, "CountryWiseSaleAmount");

//         const arr = [];

//         CountryWiseSaleAmount?.forEach((e) => {
//           let obj = cloneDeep(e);
//           let findrec = arr?.findIndex((a) => a?.Locker?.toLowerCase() === obj?.Locker?.toLowerCase());
//           if(findrec === -1){
//             arr.push(obj);
//           }else{
//             arr[findrec].SaleAmount += obj?.SaleAmount;
//           }
//         })

//         CountryWiseSaleAmount = arr;

     

//         setApiData(data4);

//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
  
//     fetchData(); 

//   },[]);

//   return (
//     <Card className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}}>
//       {/* <CardHeader
//         title='Sales Overview by Locations'
//         subheader=''
//         sx={{pb:0,mb:2.25}}
//         // action={
//         //   <OptionsMenu
//         //     options={['Last Week', 'Last Month', 'Last Year']}
//         //     iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
//         //   />
//         // }
//       /> */}
//       <CardContent  sx={{
//         maxHeight: '412px',
//         overflow: 'auto',
//         '&::-webkit-scrollbar': {
//           width: '6px',  // Customize scrollbar width
//         },
//         '&::-webkit-scrollbar-track': {
//           background: '#f1f1f1',
//         },
//         '&::-webkit-scrollbar-thumb': {
//           background: '#BDBDBD',
//           borderRadius: '10px',
//         },
//         '&::-webkit-scrollbar-thumb:hover': {
//           background: '#555',
//         },
//       }}>
//         {apiData?.slice(0, 5)?.map((item, index) => {
//           return (
//             <Box
//               key={index}
//               sx={{
//                 display: 'flex',
//                 '& img': { mr: 4 },
//                 alignItems: 'center',
//                 // mb: index !== data.length - 1 ? 4.5 : undefined
//                 mb: index !== apiData?.length - 1 ? 2.15 : undefined
//               }}
//             >
//               {/* <img width={34} height={34} src={item.imgSrc} alt={item.subtitle} /> */}
//               {/* <img width={34} height={34} src={imgIcon} alt={item.subtitle} /> */}

//               <Box
//                 sx={{
//                   rowGap: 1,
//                   columnGap: 4,
//                   width: '100%',
//                   display: 'flex',
//                   flexWrap: 'wrap',
//                   alignItems: 'center',
//                   justifyContent: 'space-between'
//                 }}
//               >
//                 <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
//                   <Typography variant='h6' color={bgColor} sx={{fontWeight:'600'}}>{item?.Locker}</Typography>
//                   {/* <Typography variant='body2' sx={{ color: 'text' }}>
//                     {item?.Country}
//                   </Typography> */}
//                 </Box>
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     '& svg': { mr: 1 },
//                     alignItems: 'center',
//                     // '& > *': { color: item.trend === 'negative' ? 'error.main' : 'success.main' }
//                     // '& > *': { fontWeight:'bolder', color: item.trend === 'negative' ? `${theme?.palette?.customColors?.red}` : `${theme?.palette?.customColors?.green}` }
//                   }}
//                 >
//                   {/* <Icon
//                     fontSize='1.25rem'
//                     icon={item.trend === 'negative' ? 'tabler:chevron-down' : 'tabler:chevron-up'}
//                   /> */}
//                   <Typography variant='h6' color={theme?.palette?.grey?.[700]} sx={{fontWeight:'bolder'}}>{`${formatAmountKWise(item?.SaleAmount)}`}</Typography>
//                 </Box>
//               </Box>
//             </Box>
//           )
//         })}
//       </CardContent>
//     </Card>
//   )
// }

// export default SalesNMarketing2;
