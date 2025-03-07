// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
// import Tab from '@mui/material/Tab'
// import TabList from '@mui/lab/TabList'
// import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import TabContext from '@mui/lab/TabContext'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// ** Custom Components Import
// import Icon from 'src/@core/components/icon'
// import OptionsMenu from 'src/@core/components/option-menu'
// import CustomAvatar from 'src/@core/components/mui/avatar'
// import ReactApexcharts from 'src/@core/components/react-apexcharts'
import Icon from '../@core/components/option-menu'
import OptionsMenu from '../@core/components/option-menu'

import ReactApexcharts from '../@core/components/react-apexcharts'

// ** Util Import
// import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { hexToRGBA } from '../@core/utils/hex-to-rgba'
import { Tab } from '@mui/material';
import { TabList, TabPanel } from '@mui/lab';
import { capitalizeFirstLetter, fetchDashboardData, formatAmount, formatAmountKWise } from '../GlobalFunctions';




const CustWiseSalesProfitAmount = ({tkn,  fdate, tdate, country, CustomerWiseSaleAmountData, IsEmpLogin}) => {
  // ** State
  const [value, setValue] = useState('sales');


  const [apiData, setApiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {

        // Fetch MonthWiseSaleAmount data
        // let CustomerWiseSaleAmount = await fetchDashboardData(tkn,  fdate, tdate, "CustomerWiseSaleAmount");
        setApiData(CustomerWiseSaleAmountData);
        setFilteredData(CustomerWiseSaleAmountData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData(); 

  // },[fdate, tdate]);
},[CustomerWiseSaleAmountData]);

  const salesAmt = CustomerWiseSaleAmountData?.map((e) => e?.SaleAmount);
  const ProfitAmt = CustomerWiseSaleAmountData?.map((e) => e?.Profit);
  // const ProfitAmt = CustomerWiseSaleAmountData?.map((e) => e?.Profit < 0 ? Math.abs(e?.Profit) : e?.Profit);
  const custNames = CustomerWiseSaleAmountData?.map((e) => capitalizeFirstLetter(e?.Customer));

  const tabData = [
    // {
    //   type: 'orders',
    //   avatarIcon: 'tabler:shopping-cart',
    //   series: [{ data: [28, 10, 45, 38, 15, 30, 35, 28, 8] }]
    // },
    {
      type: 'sales',
      // avatarIcon: 'tabler:chart-bar',
      avatarIcon: 'tabler:chart-bar',
      // series: [{ data: [35, 25, 15, 40, 42, 25, 48, 8, 30] }]
      series: [{ data: salesAmt }]
    },
    ...(IsEmpLogin === 0 ? [{
      type: 'profit',
      avatarIcon: 'tabler:currency-dollar',
      // series: [{ data: [10, 22, 27, 33, 42, 32, 27, 22, 8] }]
      series: [{ data: ProfitAmt }]
    }] : []),
    // {
    //   type: 'income',
    //   avatarIcon: 'tabler:chart-pie-2',
    //   series: [{ data: [5, 9, 12, 18, 20, 25, 30, 36, 48] }]
    // }
  ]

  const renderTabs = (value, theme) => {
    return tabData?.map((item, index) => {
      // const RenderAvatar = item.type === value ? CustomAvatar : Avatar
      const RenderAvatar = item.type === value ? Avatar : Avatar
  
      return (
        <Tab
          key={index}
          value={item.type}
          label={
            <Box
              sx={{
                width: 70,
                height: 54,
                borderWidth: 1,
                display: 'flex',
                alignItems: 'center',
                borderRadius: '10px',
                flexDirection: 'column',
                justifyContent: 'center',
                borderStyle: item.type === value ? 'solid' : 'dashed',
                borderColor: item.type === value ? theme?.palette?.customColors?.purple : theme?.palette?.divider
              }}
            >
              {/* <RenderAvatar
                variant='rounded'
                {...(item.type === value && { skin: 'light' })}
                sx={{ mb: 2, width: 34, height: 34, ...(item.type !== value && { backgroundColor: 'action.selected' }) }}
              >
                <Icon icon={item.avatarIcon} />
              </RenderAvatar> */}
              {/* <Avatar
                variant='rounded'
                {...(item.type === value && { skin: 'light' })}
                sx={{ mb: 2, width: 34, height: 34, ...(item?.type !== value && { backgroundColor: 'action.selected' }) }}
              >
                <Icon icon={item?.avatarIcon} />
              </Avatar> */}
              <Typography sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
                {item.type}
              </Typography>
            </Box>
          }
        />
      )
    })
  }
  
  const renderTabPanels = (value, theme, options, colors) => {
    return tabData.map((item, index) => {
      const max = Math?.max(...item?.series[0]?.data)
      const seriesIndex = item?.series[0]?.data?.indexOf(max)
      // const finalColors = colors?.map((color, i) => (seriesIndex === i ? hexToRGBA(theme?.palette?.primary?.main, 1) : color))
      const finalColors = colors?.map((color, i) => (seriesIndex === i ? hexToRGBA(theme?.palette?.customColors?.purple, 1) : color))
      // const finalColors = colors.map((color, i) => (seriesIndex === i ? (theme?.palette?.primary?.main) : color))
      
      return (
        <TabPanel key={index} value={item?.type} >
          <ReactApexcharts type='bar' height={300} options={{ ...options, colors: finalColors }} series={item?.series} />
        </TabPanel>
      )
    })
  }
  

  // ** Hook
  const theme = useTheme()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  // const colors = Array(9).fill(hexToRGBA(theme.palette.primary.main, 0.16))
  // const colors = Array(9)?.fill((theme?.palette?.primary?.main))
  const colors = Array(10)?.fill((theme?.palette?.customColors?.purple))

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '35%',
        startingShape: 'rounded',
        dataLabels: { position: 'top' }
      }
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: {
      offsetY: -15,
      // formatter: (val, opts) => {
      //   const index = opts.dataPointIndex;
      //   const originalValue = CustomerWiseSaleAmountData[index]?.Profit; // Use the original value
      //   return `${originalValue < 0 ? '-' : ''}${formatAmountKWise(Math.abs(originalValue / +country))}`;
      // },
      formatter: val => `${formatAmountKWise((val / (+country)))}`,
      style: {
        fontWeight: 500,
        colors: [theme.palette.text.secondary],
        fontSize: theme.typography.body1.fontSize
      }
    },
    colors,
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      show: false,
      padding: {
        top: 20,
        left: -5,
        right: -8,
        bottom: -12
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { color: theme.palette.divider },
      // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      categories: custNames,
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -15,
        formatter: val => `${formatAmountKWise((val / (+country)))}`,
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        }
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: { columnWidth: '60%' }
          },
          grid: {
            padding: { right: 20 }
          }
        }
      }
    ]
  }

  return (
    <Card  className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}}>
      <CardHeader
        title='Top Customers'
        subheader='Sale Amount and Profit Amount'
        // action={
        //   <OptionsMenu
        //     options={['Last Week', 'Last Month', 'Last Year']}
        //     iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
        //   />
        // }
      />
      <CardContent sx={{ '& .MuiTabPanel-root': { p: 0, pb:0 } }}>
        <TabContext value={value}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleChange}
            aria-label='earning report tabs'
            sx={{
              border: '0 !important',
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': { p: 0, minWidth: 0, borderRadius: '10px', '&:not(:last-child)': { mr: 4 } }
            }}
          >
            {renderTabs(value, theme)}
            {/* <Tab
              disabled
              value='add'
              label={
                <Box
                  sx={{
                    width: 110,
                    height: 94,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '10px',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: `1px dashed ${theme.palette.divider}`
                  }}
                >
                  <Avatar variant='rounded' sx={{ width: 34, height: 34, backgroundColor: 'action.selected' }}>
                    <Icon icon='tabler:plus' />
                  </Avatar>
                </Box>
              }
            /> */}
          </TabList>
          {renderTabPanels(value, theme, options, colors)}
        </TabContext>
      </CardContent>
    </Card>
  )
}

export default CustWiseSalesProfitAmount
