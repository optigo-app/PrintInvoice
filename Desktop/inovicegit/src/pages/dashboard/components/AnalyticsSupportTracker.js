// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
// import Icon from 'src/@core/components/icon'
// import OptionsMenu from 'src/@core/components/option-menu'
// import CustomAvatar from 'src/@core/components/mui/avatar'
// import ReactApexcharts from 'src/@core/components/react-apexcharts'
import Icon from '../@core/components/icon'
import OptionsMenu from '../@core/components/option-menu'
import CustomAvatar from '../@core/components/mui/avatar'
import ReactApexcharts from '../@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from '../@core/utils/hex-to-rgba'
import { useEffect, useState } from 'react';
import { fetchDashboardData } from '../GlobalFunctions';
import { CircularProgress } from '@mui/material'



const AnalyticsSupportTracker = ({tkn, fdate, tdate}) => {

  const [apiData, setApiData] = useState([]);
  const [totalOrder, setTotalOrder] = useState(0);
  const [task, setTask] = useState(85);
  const [taskLabel, setTaskLabel] = useState('In Stock');

  const [loader, setLoader] = useState(true);

  useEffect(() => {

    const fetchData = async () => {
      try {

        setLoader(true);
        // Fetch MonthWiseSaleAmount data
        const ProgressWiseOrder = await fetchDashboardData(tkn, fdate, tdate, "ProgressWiseOrder");
        setApiData(ProgressWiseOrder);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoader(false);
      }
    };
  
    fetchData(); 

  },[fdate, tdate]);


  // ** Hook
  const theme = useTheme()


  const data = [
    {
      subtitle: `${apiData[0]?.NewOrder === NaN ? 0 : apiData[0]?.NewOrder}`,
      title: 'New Order',
      // avatarIcon: 'tabler:ticket'
      avatarIcon: ''
    },
    {
      subtitle: `${apiData[0]?.InWIP === NaN ? 0 : apiData[0]?.InWIP}`,
      title: 'In WIP',
      avatarColor: 'warning',
      // avatarIcon: 'tabler:clock'
      avatarIcon: ''
    },
    {
      subtitle: `${apiData[0]?.InStock === NaN ? 0 : apiData[0]?.InStock}`,
      avatarColor: 'info',
      title: 'In Stock',
      // avatarIcon: 'tabler:circle-check'
      avatarIcon: ''
    }
    
  ]


  const options = {
    chart: {
      sparkline: { enabled: true }
    },
    stroke: { dashArray: 10 },
    // labels: ['Completed Task'],
    labels: [taskLabel],
    // colors: [hexToRGBA(theme.palette.primary.main, 1)],
    // colors: [hexToRGBA(theme?.palette?.customColors?.purple, 1)],
    colors: [(theme?.palette?.customColors?.purple)],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        opacityTo: 0.5,
        opacityFrom: 1,
        shadeIntensity: 0.5,
        stops: [30, 70, 100],
        inverseColors: false,
        // gradientToColors: [theme.palette.primary.main]
        gradientToColors: [theme?.palette?.customColors?.purple]
      }
    },
    plotOptions: {
      radialBar: {
        endAngle: 130,
        startAngle: -140,
        hollow: { size: '60%' },
        track: { background: 'transparent' },
        dataLabels: {
          name: {
            offsetY: -15,
            color: theme.palette.text.disabled,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.body2.fontSize
          },
          value: {
            offsetY: 15,
            fontWeight: 500,
            formatter: value => `${value}%`,
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.h3.fontSize
          }
        }
      }
    },
    grid: {
      padding: {
        top: -30,
        bottom: 12
      }
    },
    responsive: [
      {
        breakpoint: 1300,
        options: {
          grid: {
            padding: {
              left: 22
            }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          grid: {
            padding: {
              left: 0
            }
          }
        }
      }
    ]
  }


  const handleTask = (item) => {
    if(item?.title?.toLowerCase() === 'in stock'){
      const inStockPercentage = totalOrder ? (apiData[0]?.InStock / totalOrder) * 100 : 0;
      setTask(Math.round(inStockPercentage));
      setTaskLabel('In Stock')
    }
    if(item?.title?.toLowerCase() === 'in wip'){
      const inWIPPercentage = totalOrder ? (apiData[0]?.InWIP / totalOrder) * 100 : 0;
      setTask(Math.round(inWIPPercentage));
      setTaskLabel('In WIP')
    }
  }

  useEffect(() => {
    console.log(apiData[0]?.InStock, apiData[0]?.InWIP , apiData[0]?.NewOrder);
    
      const totalOrder = checkNaNVal((apiData[0]?.InStock === NaN ? 0 : apiData[0]?.InStock) + (apiData[0]?.InWIP === NaN ? 0 : apiData[0]?.InWIP) + (apiData[0]?.NewOrder === NaN ? 0 : apiData[0]?.NewOrder));
      console.log(totalOrder);
      
      const inStockPercentage = totalOrder ? ( totalOrder === 0 ? 0 : (checkNaNVal(apiData[0]?.InStock / totalOrder))) * 100 : 0;
      setTask(Math.round(inStockPercentage));
    if(totalOrder === NaN || totalOrder === undefined){
      setTotalOrder(0);
    }else{
      setTotalOrder(totalOrder);
    }
      setLoader(false);
  },[apiData]);

  const checkNaNVal = (val) => {
    if(val === NaN || val === "NaN" || val === -Infinity || val === Infinity){
      return 0
    }else{
      return val;
    }
  }


console.log(totalOrder, );

  return (
    <Card  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}} className='fs_analytics_l'>
      <CardHeader
      sx={{pb:2, mb:0}}
        title='Order Tracker'
        subheader='Order Progress & Stock Status'
        // action={
        //   <OptionsMenu
        //     options={['Refresh', 'Edit', 'Share']}
        //     iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
        //   />
        // }
      />
      {
        loader ? '' : <CardContent style={{paddingBottom:'45px'}}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={5}>
            { totalOrder === NaN ? '' : <Typography variant='h4'>{totalOrder === NaN ? 0 : checkNaNVal(totalOrder)}</Typography>}
            <Typography sx={{ pb: 3, color: 'text.secondary' }}>Total Orders</Typography>
            {data?.map((item, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', 
                alignItems: 'center', 
                // mb: index !== data.length - 1 ? 4 : undefined 
                // mb: index !== data?.length - 1 ? 2 : undefined 
                mb:2
              }}
              >
                {/* <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={item.avatarColor}
                  sx={{ mr: 4, width: 34, height: 34 }}
                >
                  <Icon icon={item.avatarIcon}  />
                </CustomAvatar> */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor:'pointer' }} onClick={() => handleTask(item)}>
                  <Typography variant='h6'>{item.title}</Typography>
                  <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                    {item.subtitle}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Grid>
          <Grid item xs={12} sm={7} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* <ReactApexcharts type='radialBar' width={325} height={300} options={options} series={[85]} /> */}
            <ReactApexcharts type='radialBar' width={325} height={350} options={options} series={[task]}  />
          </Grid>
        </Grid>
      </CardContent>
      }
    </Card>
  )
}

export default AnalyticsSupportTracker
