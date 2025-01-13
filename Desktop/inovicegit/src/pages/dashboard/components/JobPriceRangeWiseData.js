import { Card, CardHeader, styled, useTheme } from '@mui/material'
import React from 'react'
import ReactApexcharts from '../@core/components/react-apexcharts';
const JobPriceRangeWiseData = ({tkn,  fdate, tdate, country, MetalTypeColorWiseSaleData, IsEmpLogin, jobWisePriceRangeData}) => {
    
  const series = [
    {
      data: [280, 200, 220, 180, 270, 250, 0, 90, 200, 150, 160, 100, 150, 100, 50]
    }
  ]

  const theme = useTheme()

  const options = {
    // chart: {
    //   parentHeightOffset: 0,
    //   zoom: { enabled: false },
    //   toolbar: { show: true }
    // },
    colors: ['#989898'],
    stroke: { curve: 'straight' },
    dataLabels: { enabled: false },
    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      colors: ['#ff9f43'],
      strokeColors: ['#fff']
    },
    grid: {
      padding: { top: 10 },
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: true }
      }
    },
    tooltip: {
      custom(data) {
        return `<div class='bar-chart'>
          <span>${data.series[data.seriesIndex][data.dataPointIndex]}%</span>
        </div>`
      }
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.disabled }
      }
    },
    xaxis: {
      axisBorder: { show: true },
      axisTicks: { color: theme.palette.divider },
      crosshairs: {
        stroke: { color: theme.palette.divider }
      },
      labels: {
        // style: { colors: theme.palette.text.disabled }
      },
      categories: [
        '7/12',
        '8/12',
        '9/12',
        '10/12',
        '11/12',
        '12/12',
        '13/12',
        '14/12',
        '15/12',
        '16/12',
        '17/12',
        '18/12',
        '19/12',
        '20/12',
        '21/12'
      ]
    }
  }

  return (
    <>
    <Card className='fs_analytics_l tableHeight' style={{ boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)' }}>
        <CardHeader
            title='Jobs Count With Price Range'
            titleTypographyProps={{ sx: { mb: [2, 0] } }}
            sx={{
            py: 2.5,
            flexDirection: ['column', 'row'],
            '& .MuiCardHeader-action': { m: 0 },
            alignItems: ['flex-start', 'center']
            }}
        />
           <ReactApexcharts type='line' height={400} options={options} series={series} />
    </Card>
    </>
  )
}

export default JobPriceRangeWiseData

// import { Card, CardHeader, styled, useTheme } from '@mui/material'
// import React from 'react'
// import ReactApexcharts from '../@core/components/react-apexcharts';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// const JobPriceRangeWiseData = ({tkn,  fdate, tdate, country, MetalTypeColorWiseSaleData, IsEmpLogin, jobWisePriceRangeData}) => {
//   console.log(jobWisePriceRangeData?.DT1);
  
//   const theme = useTheme()
//   // const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
//   // const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
//   // const xLabels = ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];

//   // const chartData = xLabels.map((label, index) => ({
//   //   name: label,
//   //   uData: uData[index],
//   //   pData: pData[index],
//   // }));

//     // Function to group data by 5K price range
//     const groupDataByPriceRange = (data) => {
//       const groupedData = [];
//       let currentRangeStart = 0;
//       let currentRangeEnd = 5000;
//       let maxPriceTo = 0;
  
//       // Determine max price range from the data
//       data.forEach(entry => {
//         if (entry.PriceTo > maxPriceTo) {
//           maxPriceTo = entry.PriceTo;
//         }
//       });
  
//       // Create price range groups
//       while (currentRangeStart <= maxPriceTo) {
//         let totalJobCnt = 0;
        
//         // Sum JobCnt for all entries that fall into this range
//         data.forEach(entry => {
//           const { PriceFrom, PriceTo, JobCnt } = entry;
//           if ((PriceFrom >= currentRangeStart && PriceFrom <= currentRangeEnd) || 
//               (PriceTo >= currentRangeStart && PriceTo <= currentRangeEnd) ||
//               (PriceFrom < currentRangeStart && PriceTo > currentRangeEnd)) {
//             totalJobCnt += JobCnt;
//           }
//         });
  
//         // Only add the range if the total JobCnt is > 0
//         if (totalJobCnt > 0) {
//           groupedData.push({
//             name: `${currentRangeStart} - ${currentRangeEnd}`,
//             JobCnt: totalJobCnt,
//           });
//         }
  
//         // Move to the next range (5K increment)
//         currentRangeStart += 5000;
//         currentRangeEnd += 5000;
//       }
  
//       return groupedData;
//     };
  
//     const chartData = groupDataByPriceRange(jobWisePriceRangeData?.DT1 ?? []);

//   return (
//     <>
//     <Card className='fs_analytics_l tableHeight' style={{ boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)' }}>
//         <CardHeader
//             title='Jobs Count With Price Range'
//             titleTypographyProps={{ sx: { mb: [2, 0] } }}
//             sx={{
//             py: 2.5,
//             flexDirection: ['column', 'row'],
//             '& .MuiCardHeader-action': { m: 0 },
//             alignItems: ['flex-start', 'center']
//             }}
//         />
//     <ResponsiveContainer width="100%" height={400}>
//       <LineChart data={chartData}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Line type="monotone" dataKey="JobCnt" stroke="#8884d8" />
//       </LineChart>
//     </ResponsiveContainer>
//     </Card>
//     </>
//   )
// }

// export default JobPriceRangeWiseData


// import { Card, CardHeader, styled } from '@mui/material'
// import React from 'react'
// import ReactApexcharts from '../@core/components/react-apexcharts';
// const JobPriceRangeWiseData = ({tkn,  fdate, tdate, country, MetalTypeColorWiseSaleData, IsEmpLogin, jobWisePriceRangeData}) => {
    

//     // const series = [
//     //     {
//     //       name: "Event Timeline",
//     //       data: [
//     //         { x: "Task A", y: [1, 5] },
//     //         { x: "Task B", y: [2, 6] },
//     //         { x: "Task C", y: [4, 8] },
//     //         { x: "Task D", y: [7, 9] },
//     //       ],
//     //     },
//     // ];

//     const options = {
//         // chart: {
//         //   type: "rangeBar",
//         //   height: 350,
//         // },
//         chart: {
//             type: "rangeBar",
//             height: 350,
//             zoom: {
//               enabled: false, // Disables zooming
//             },
//             toolbar: {
//               tools: {
//                 download:false,
//                 zoom: false, // Disable zoom tool
//                 zoomin: false, // Disable zoom-in tool
//                 zoomout: false, // Disable zoom-out tool
//                 pan: false, // Disable pan tool
//                 reset: false, // Disable reset zoom tool
//               },
//             },
//           },
//         plotOptions: {
//           bar: {
//             horizontal: true, // Makes it a horizontal bar chart
//           },
//         },
//         xaxis: {
//           title: {
//             text: "Amount",
//             style:{
//                 fontSize:"15px"
//             }
//           },
//         },
//         yaxis: {
//           title: {
//             text: "Jobs",
//             style:{
//                 fontSize:"15px"
//             }
//           },
//         },
//         dataLabels: {
//           enabled: true,
//           formatter: (val) => `${val[0]} - ${val[1]}`,
//         },
//         // tooltip: {
//         //   enabled: true,
//         //   y: {
//         //     formatter: (val) => `${val}`,
//         //     title: {
//         //       formatter: () => "Duration",
//         //     },
//         //   },
//         // },
//         tooltip: {
//             enabled: false,
//             y: {
//               formatter: (val) => ` ${val}`,
//               title: {
//                 formatter: () => "Jobw With Price Range",
//               },
//             },
//             // followCursor: false, // Ensures the tooltip follows the cursor
//             theme: "light", // Optional: Set a theme for better visibility
//           },
//         title: {
//           text: "",
//           align: "center",
//           class:"fs_analytics_l",
//         },
//     };

//     const seriesData = jobWisePriceRangeData?.DT1?.sort((a, b) => b?.JobCnt - a?.JobCnt)?.map((item) => ({
//         x: ` ${item?.JobCnt}`, // Label with Job Count
//         y: [Math.round((+item?.PriceFrom) / (+country)), Math.round((+item?.PriceTo) / (+country))], // Range for y-axis
//     }));

//     const series = [
//         {
//           name: "Price Ranges",
//           data: seriesData,
//         },
//       ];

//   return (
//     <>
//     <Card className='fs_analytics_l tableHeight' style={{ boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)' }}>
//         <CardHeader
//             title='Jobs Count With Price Range'
//             titleTypographyProps={{ sx: { mb: [2, 0] } }}
//             sx={{
//             py: 2.5,
//             flexDirection: ['column', 'row'],
//             '& .MuiCardHeader-action': { m: 0 },
//             alignItems: ['flex-start', 'center']
//             }}
//         />
//         { jobWisePriceRangeData?.DT1?.length > 0 && <ReactApexcharts options={options} series={series} type="rangeBar" height={350} class="fs_analytics_l jobWisePR" />}
//     </Card>
//     </>
//   )
// }

// export default JobPriceRangeWiseData
