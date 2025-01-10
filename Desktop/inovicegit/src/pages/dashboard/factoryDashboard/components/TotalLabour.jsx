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
import Icon from '../../@core/components/option-menu'
import OptionsMenu from '../../@core/components/option-menu'

import ReactApexcharts from '../../@core/components/react-apexcharts'

// ** Util Import
// import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { hexToRGBA } from '../../@core/utils/hex-to-rgba'
import { CircularProgress, Tab } from '@mui/material';
import { TabList, TabPanel } from '@mui/lab';
import { capitalizeFirstLetter, fetchDashboardData, formatAmount, formatAmountKWise } from '../../GlobalFunctions';
import { useSelector } from 'react-redux'




const TotalLabour = ({tkn,  fdate, tdate, selectMaterial}) => {

  const { loading, data, error } = useSelector(state => state?.Summary_Purchase);
    
  // ** State
  const [value, setValue] = useState('Net Wt');



  const [ vendorWiseNameList, setVendorWiseNameList ] = useState([]);
  const [ yAxis, setYAxis ] = useState([]);
  const [label, setlabel] = useState('');
  const [label2, setlabel2] = useState('');
  
  useEffect(() => {
    if(selectMaterial === 1 || selectMaterial === '1'){
      setlabel('Dia. Pcs');
      setlabel2('Dia. Carat');
    }
    if(selectMaterial === 2 || selectMaterial === '2'){
      setlabel('CS. Pcs');
      setlabel2('CS. Carat');
    }
    if(selectMaterial === 3 || selectMaterial === '3'){
      setlabel('Misc. Pcs');
      setlabel2('Misc. Gm');
    }
    setValue('Net Wt');
  },[selectMaterial]);

  useEffect(() => {
    if(data?.DT1?.length > 0){

        if((selectMaterial === 1 || selectMaterial === '1') && value?.toLowerCase() === "net wt"){
          let arr0 = data?.DT1?.slice()?.sort((a, b) => b?.Netwt - a?.Netwt)?.slice(0, 10)?.map(e => e?.Vendor);
          setVendorWiseNameList(arr0);
          let arr = data?.DT1?.slice()?.sort((a, b) => b?.Netwt - a?.Netwt)?.slice(0, 10)?.map(e => e?.Netwt);
          setYAxis(arr);
        }
        if((selectMaterial === 1 || selectMaterial === '1') && value?.toLowerCase() === "job count"){
          let arr0 = data?.DT1?.slice()?.sort((a, b) => b?.TotalJobCnt - a?.TotalJobCnt)?.slice(0, 10)?.map(e => e?.Vendor);
          setVendorWiseNameList(arr0);
          let arr = data?.DT1?.slice()?.sort((a, b) => b?.TotalJobCnt - a?.TotalJobCnt)?.slice(0, 10)?.map(e => e?.TotalJobCnt);
          setYAxis(arr);
        }
        if((selectMaterial === 1 || selectMaterial === '1') && value?.toLowerCase() === "dia. pcs"){
          let arr0 = data?.DT1?.slice()?.sort((a, b) => b?.DiaPcs - a?.DiaPcs)?.slice(0, 10)?.map(e => e?.Vendor);
          setVendorWiseNameList(arr0);
          let arr = data?.DT1?.slice()?.sort((a, b) => b?.DiaPcs - a?.DiaPcs)?.slice(0, 10)?.map(e => e?.DiaPcs);
          setYAxis(arr);
        }
        if((selectMaterial === 1 || selectMaterial === '1') && value?.toLowerCase() === "dia. carat"){
          let arr0 = data?.DT1?.slice()?.sort((a, b) => b?.DiaWt - a?.DiaWt)?.slice(0, 10)?.map(e => e?.Vendor);
          setVendorWiseNameList(arr0);
          let arr = data?.DT1?.slice()?.sort((a, b) => b?.DiaWt - a?.DiaWt)?.slice(0, 10)?.map(e => e?.DiaWt);
          setYAxis(arr);
        }
        if((selectMaterial === 2 || selectMaterial === '2') && value?.toLowerCase() === "net wt"){
          let arr0 = data?.DT1?.slice()?.sort((a, b) => b?.Netwt - a?.Netwt)?.slice(0, 10)?.map(e => e?.Vendor);
          setVendorWiseNameList(arr0);
          let arr = data?.DT1?.slice()?.sort((a, b) => b?.Netwt - a?.Netwt)?.slice(0, 10)?.map(e => e?.Netwt);
          setYAxis(arr);
        }
        if((selectMaterial === 2 || selectMaterial === '2') && value?.toLowerCase() === "job count"){
          let arr0 = data?.DT1?.slice()?.sort((a, b) => b?.TotalJobCnt - a?.TotalJobCnt)?.slice(0, 10)?.map(e => e?.Vendor);
          setVendorWiseNameList(arr0);
          let arr = data?.DT1?.slice()?.sort((a, b) => b?.TotalJobCnt - a?.TotalJobCnt)?.slice(0, 10)?.map(e => e?.TotalJobCnt);
          setYAxis(arr);
        }
        if((selectMaterial === 2 || selectMaterial === '2') && value?.toLowerCase() === "cs. pcs"){
          let arr0 = data?.DT1?.slice()?.sort((a, b) => b?.CSPcs - a?.CSPcs)?.slice(0, 10)?.map(e => e?.Vendor);
          setVendorWiseNameList(arr0);
          let arr = data?.DT1?.slice()?.sort((a, b) => b?.CSPcs - a?.CSPcs)?.slice(0, 10)?.map(e => e?.CSPcs);
          setYAxis(arr);
        }
        if((selectMaterial === 2 || selectMaterial === '2') && value?.toLowerCase() === "cs. carat"){
          let arr0 = data?.DT1?.slice()?.sort((a, b) => b?.CSWt - a?.CSWt)?.slice(0, 10)?.map(e => e?.Vendor);
          setVendorWiseNameList(arr0);
          let arr = data?.DT1?.slice()?.sort((a, b) => b?.CSWt - a?.CSWt)?.slice(0, 10)?.map(e => e?.CSWt);
          setYAxis(arr);
        }
        if((selectMaterial === 3 || selectMaterial === '3') && value?.toLowerCase() === "net wt"){
          let arr0 = data?.DT1?.slice()?.sort((a, b) => b?.Netwt - a?.Netwt)?.slice(0, 10)?.map(e => e?.Vendor);
          setVendorWiseNameList(arr0);
          let arr = data?.DT1?.slice()?.sort((a, b) => b?.Netwt - a?.Netwt)?.slice(0, 10)?.map(e => e?.Netwt);
          setYAxis(arr);
        }
        if((selectMaterial === 3 || selectMaterial === '3') && value?.toLowerCase() === "job count"){
          let arr0 = data?.DT1?.slice()?.sort((a, b) => b?.TotalJobCnt - a?.TotalJobCnt)?.slice(0, 10)?.map(e => e?.Vendor);
          setVendorWiseNameList(arr0);
          let arr = data?.DT1?.slice()?.sort((a, b) => b?.TotalJobCnt - a?.TotalJobCnt)?.slice(0, 10)?.map(e => e?.TotalJobCnt);
          setYAxis(arr);
        }
        if((selectMaterial === 3 || selectMaterial === '3') && value?.toLowerCase() === "misc. pcs"){
          let arr0 = data?.DT1?.slice()?.sort((a, b) => b?.MISCPcs - a?.MISCPcs)?.slice(0, 10)?.map(e => e?.Vendor);
          setVendorWiseNameList(arr0);
          let arr = data?.DT1?.slice()?.sort((a, b) => b?.MISCPcs - a?.MISCPcs)?.slice(0, 10)?.map(e => e?.MISCPcs);
          setYAxis(arr);
        }
        if((selectMaterial === 3 || selectMaterial === '3') && value?.toLowerCase() === "misc. gm"){
          let arr0 = data?.DT1?.slice()?.sort((a, b) => b?.CSWt - a?.CSWt)?.slice(0, 10)?.map(e => e?.Vendor);
          setVendorWiseNameList(arr0);
          let arr = data?.DT1?.slice()?.sort((a, b) => b?.MISCWt - a?.MISCWt)?.slice(0, 10)?.map(e => e?.MISCWt);
          setYAxis(arr);
        }
        
    }
  },[selectMaterial, data, value]);


  // useEffect(() => {
  //   if (data?.DT1?.length > 0) {
  //     let sortedData;
  //     let vendors;
  //     let yAxisData;
  
  //     const getSortedData = (field) =>
  //       data?.DT1?.slice()?.sort((a, b) => b[field] - a[field])?.slice(0, 10);
  
  //     const setGraphData = (field, vendorField) => {
  //       sortedData = getSortedData(field);
  //       vendors = sortedData?.map(e => e[vendorField]);
  //       yAxisData = sortedData?.map(e => e[field]);
  //       setVendorWiseNameList(vendors);
  //       setYAxis(yAxisData);
  //     };
  
  //     if (selectMaterial === 1 || selectMaterial === '1') {
  //       switch (value?.toLowerCase()) {
  //         case "net wt":
  //           setGraphData('Netwt', 'Vendor');
  //           break;
  //         case "job count":
  //           setGraphData('TotalJobCnt', 'Vendor');
  //           break;
  //         case "dia. pcs":
  //           setGraphData('DiaPcs', 'Vendor');
  //           break;
  //         case "dia. carat":
  //           setGraphData('DiaWt', 'Vendor');
  //           break;
  //         default:
  //           break;
  //       }
  //     }
  
  //     if (selectMaterial === 2 || selectMaterial === '2') {
  //       switch (value?.toLowerCase()) {
  //         case "net wt":
  //           setGraphData('Netwt', 'Vendor');
  //           break;
  //         case "job count":
  //           setGraphData('TotalJobCnt', 'Vendor');
  //           break;
  //         case "cs. pcs":
  //           setGraphData('CSPcs', 'Vendor');
  //           break;
  //         case "cs. carat":
  //           setGraphData('CSWt', 'Vendor');
  //           break;
  //         default:
  //           break;
  //       }
  //     }
  //   }
  // }, [selectMaterial, data, value]);
  














  const [apiData, setApiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // useEffect(() => {

  //   const fetchData = async () => {
  //     try {

  //       // Fetch MonthWiseSaleAmount data
  //       let CustomerWiseSaleAmount = await fetchDashboardData(tkn,  fdate, tdate, "CustomerWiseSaleAmount");
  //       setApiData(CustomerWiseSaleAmount);
  //       setFilteredData(CustomerWiseSaleAmount);

  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  
  //   // fetchData(); 

  // },[fdate, tdate]);


  
  const custNames = ['TIFFANY', 'XBO', 'SA', 'CHOW', 'YF', 'KK', 'Pariya', 'Nancy']?.map((e) => capitalizeFirstLetter(e));

  const NetWtArr = [3.99, 2.74, 2.86, 5.89, 24.65, 1.24, 3.14, 12.76];
  const JobCountArr = [7, 42, 367, 7953, 779, 1581, 200, 150];
  const DiaPcsArr = [7, 21, 4, 1, 10, 17, 43, 57];
  const DiaCaratArr = [30.19, 29.89,22.17,22.15,22.10,18,15.94,18.90];

  const tabData = [
    {
      type: 'Net Wt',
      series: [{ data: yAxis }]
    },
    {
      type: 'Job Count',
      series: [{ data: yAxis }]
    },
    {
      type: `${label}`,
      series: [{ data: yAxis }]
    },
    {
      type: `${label2}`,
      series: [{ data: yAxis }]
    },
    // {
    //   type: 'CS. Pcs',
    //   series: [{ data: DiaPcsArr }]
    // },
    // {
    //   type: 'Cs. Carat',
    //   series: [{ data: DiaCaratArr }]
    // },
  ]

  const renderTabs = (value, theme) => {
    return tabData?.map((item, index) => {
      const RenderAvatar = item.type === value ? Avatar : Avatar
  
      return (
        <Tab
          key={index}
          value={item.type}
          label={
            <Box
              sx={{
                width: 100,
                height: 54,
                borderWidth: 1,
                display: 'flex',
                alignItems: 'center',
                borderRadius: '10px',
                flexDirection: 'column',
                justifyContent: 'center',
                borderStyle: item.type === value ? 'solid' : 'dashed',
                borderColor: item.type === value ? '#FF9F43' : theme?.palette?.divider
              }}
            >
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
      // const max = Math?.max(...yAxis)
      const seriesIndex = item?.series[0]?.data?.indexOf(max)
      // const seriesIndex = yAxis?.indexOf(max)
      const finalColors = colors?.map((color, i) => (seriesIndex === i ? hexToRGBA('#FF9F43', 1) : color))
      
      return (
        <TabPanel key={index} value={item?.type} >
          {/* <ReactApexcharts type='bar' height={300} options={{ ...options, colors: finalColors }} series={item?.series} /> */}
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
//   const colors = Array(8)?.fill((theme?.palette?.customColors?.purple))
  const colors = Array(10)?.fill(('#FF9F43'))

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
      // formatter: val => `${formatAmountKWise(val)}`,
      formatter: val => (value?.toLowerCase() === "job count" || value?.toLowerCase() === "dia. pcs" || value?.toLowerCase() === 'cs. pcs' || value?.toLowerCase() === 'misc. pcs') ? val : `${formatAmountKWise(val)}` ,
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
      // categories: custNames,
      categories: vendorWiseNameList,
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
        // formatter: val => `${formatAmountKWise(val)}`,
        formatter: val =>  (value?.toLowerCase() === "job count" || value?.toLowerCase() === "dia. pcs" || value?.toLowerCase() === 'cs. pcs' || value?.toLowerCase() === 'misc. pcs') ? val : `${formatAmountKWise(val)}` ,
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
        title='Total Labour'
        subheader='Labour Wise NetWt, Job Count, Diamond Pcs & Wt'
        // action={
        //   <OptionsMenu
        //     options={['Last Week', 'Last Month', 'Last Year']}
        //     iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
        //   />
        // }
      />
      { loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding:'1rem', minHeight:'394px' }}>
                                    <CircularProgress sx={{color:'lightgrey'}} />
                                    </Box> : <CardContent sx={{ '& .MuiTabPanel-root': { p: 0, pb:0 } }}>
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
      </CardContent>}
    </Card>
  )
}

export default TotalLabour
