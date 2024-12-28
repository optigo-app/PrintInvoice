// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { checkNullUndefined } from './global';
import { formatAmount } from '../../GlobalFunctions'

const series = [85]

const AccountNHR = ({tkn, data, bgColor}) => {
  // ** Hook
  const theme = useTheme()

  return (
    <Card  className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'115px'}}>
      <CardContent>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <Typography variant='h6' sx={{ mb: 0.75, color:bgColor,  }}>
                {data?.heading}
              </Typography>
            </div>
            <div>
              <Typography variant='h5' sx={{ mb: 0.75, color:theme?.palette?.grey[700], fontWeight:'bolder' }}>
             
                
                { 
                data?.heading === "Avg. Collection Period" || data?.heading === "Revenue Per Employees" ? 
                `₹ ${formatAmount(data?.totalValue)}` 
                  :
                 ( data?.heading === "Avg. Due Debtors" || data?.heading === "Labour vs Exp"
                  ? 
                  `${parseFloat(checkNullUndefined(data?.totalValue))?.toFixed(2)} %` : parseFloat(checkNullUndefined(data?.totalValue))?.toFixed(2) )
                 }
              </Typography>
    
            </div>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default AccountNHR

// // ** MUI Imports
// import Box from '@mui/material/Box'
// import Card from '@mui/material/Card'
// import { useTheme } from '@mui/material/styles'
// import Typography from '@mui/material/Typography'
// import CardContent from '@mui/material/CardContent'

// // ** Icons Imports
// // import Icon from 'src/@core/components/icon'
// import Icon from '../../@core/components/icon'

// // ** Custom Components Imports
// // import ReactApexcharts from 'src/@core/components/react-apexcharts'
// import ReactApexcharts from '../../@core/components/react-apexcharts'

// // ** Util Import
// import { hexToRGBA } from '../../@core/utils/hex-to-rgba'

// const series = [85]

// const CardStatisticsGeneratedLeads = ({tkn, data, bgColor}) => {
//   // ** Hook
//   const theme = useTheme()

//   const options = {
//     colors: [
//       theme.palette.success.main,
//       hexToRGBA(theme.palette.success.main, 0.7),
//       hexToRGBA(theme.palette.success.main, 0.5),
//       hexToRGBA(theme.palette.success.main, 0.16)
//     ],
//     stroke: { width: 0 },
//     legend: { show: false },
//     tooltip: { enabled: false },
//     dataLabels: { enabled: false },
//     labels: ['Electronic', 'Sports', 'Decor', 'Fashion'],
//     states: {
//       hover: {
//         filter: { type: 'none' }
//       },
//       active: {
//         filter: { type: 'none' }
//       }
//     },
//     grid: {
//       padding: {
//         top: -22,
//         bottom: -18
//       }
//     },
//     plotOptions: {
//       pie: {
//         customScale: 0.8,
//         expandOnClick: false,
//         donut: {
//           size: '90%',
//           labels: {
//             show: true,
//             name: {
//               offsetY: 25,
//               color: theme.palette.text.secondary,
//               fontFamily: theme.typography.fontFamily
//             },
//             value: {
//               offsetY: -15,
//               fontWeight: 500,
//               formatter: val => `${val}`,
//               color: theme.palette.text.primary,
//               fontFamily: theme.typography.fontFamily,
//               fontSize: theme.typography.h2.fontSize
//             },
//             total: {
//               show: true,
//               label: 'Total',
//               color: theme.palette.text.secondary,
//               fontFamily: theme.typography.fontFamily,
//               fontSize: theme.typography.h5.fontSize
//             }
//           }
//         }
//       }
//     }
//   }
//   console.log(theme);
//   return (
//     <Card  className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}}>
//       <CardContent>
//         <Box sx={{ gap: 2, display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>
//           <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//             <div>
//               <Typography variant='h6' sx={{ mb: 0.75, color:bgColor, fontWeight:'bolder' }}>
//                 {data?.heading}
//               </Typography>
//               {/* <Typography variant='body2'>{data?.subheading}</Typography> */}
//             </div>
//             <div>
//               <Typography variant='h4' sx={{ mb: 0.75, color:theme?.palette?.grey[700] }}>
//                 {data?.totalValue}
//               </Typography>
//               {/* <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'success.main' } }}>
//                 <Icon icon='tabler:chevron-up' fontSize='1.25rem' />
//                 <Typography variant='h6' sx={{ color: 'success.main' }}>
//                   15.8%
//                 </Typography>
//               </Box> */}
//             </div>
//           </Box>
//           {/* <ReactApexcharts type='donut' width={150} height={175} series={data?.series} options={options} /> */}
//         </Box>
//       </CardContent>
//     </Card>
//   )
// }

// export default CardStatisticsGeneratedLeads
