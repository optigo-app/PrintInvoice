// ** MUI Import
import Grid from '@mui/material/Grid'

// // ** Demo Component Imports
// import AnalyticsProject from 'src/views/dashboards/analytics/AnalyticsProject'
// import AnalyticsOrderVisits from 'src/views/dashboards/analytics/AnalyticsOrderVisits'
// import AnalyticsTotalEarning from 'src/views/dashboards/analytics/AnalyticsTotalEarning'
// import AnalyticsSourceVisits from 'src/views/dashboards/analytics/AnalyticsSourceVisits'
// import AnalyticsEarningReports from 'src/views/dashboards/analytics/AnalyticsEarningReports'
// import AnalyticsSupportTracker from 'src/views/dashboards/analytics/AnalyticsSupportTracker'
// import AnalyticsSalesByCountries from 'src/views/dashboards/analytics/AnalyticsSalesByCountries'
// import AnalyticsMonthlyCampaignState from 'src/views/dashboards/analytics/AnalyticsMonthlyCampaignState'
// import AnalyticsWebsiteAnalyticsSlider from 'src/views/dashboards/analytics/AnalyticsWebsiteAnalyticsSlider'

// ** Custom Component Import
// import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
// import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
// import CardStatsWithAreaChart from 'src/@core/components/card-statistics/card-stats-with-area-chart'
import KeenSliderWrapper from '../@core/styles/libs/keen-slider'
import ApexChartWrapper from '../@core/styles/libs/react-apexcharts'
import CardStatsWithAreaChart from '../@core/components/card-statistics/card-stats-with-area-chart'


import AnalyticsWebsiteAnalyticsSlider from './AnalyticsWebsiteAnalyticsSlider';
import AnalyticsOrderVisits from './AnalyticsOrderVisits';
import AnalyticsEarningReports from './AnalyticsEarningReports';
import AnalyticsSupportTracker from './AnalyticsSupportTracker';
import AnalyticsSalesByCountries from './AnalyticsSalesByCountries';
import AnalyticsTotalEarning from './AnalyticsTotalEarning';
import AnalyticsMonthlyCampaignState from './AnalyticsMonthlyCampaignState';
import AnalyticsSourceVisits from './AnalyticsSourceVisits';
import AnalyticsProject from './AnalyticsProject';
import RechartsPieChart from '../charts/recharts/RechartsPieChart';
import ApexRadialBarChart from '../charts/apex-charts/ApexRadialBarChart';
import CardStatsVertical from './../@core/components/card-statistics/card-stats-vertical/index';
import AnalyticsCustomerTypeWise from './AnalyticsCustomerTypeWise';
import AnalyticsFilters from './AnalyticsFilters';
import AnalyticsSalesEarningReport from './AnalyticsSalesEarningReport';
import AnalyticsSalesRepWiseSaleAmt from './AnalyticsSalesRepWiseSaleAmt';
import { useEffect, useState } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import moment from 'moment';

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from '../@core/components/pickersComponent/PickersCustomInput';
import "../@core/components/pickersComponent/datepickerc.css";
import { fetchDashboardData } from '../GlobalFunctions';
import axios from 'axios';

const AnalyticsDashboard = ({tkn, hostName, LId}) => {
  
  const [fdate, setFDate] = useState(null);
  const [tdate, setTDate] = useState(null);
  const [fdatef, setFDatef] = useState("");
  const [tdatef, setTDatef] = useState("");
  const [popperPlacement, setPopperPlacement] = useState('bottom-start');
  const theme = useTheme();

  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(7.8);
  const [salesList, setSalesList] = useState([]);
  const [selectedSales, setSelectedSales] = useState('');
  const [officeList, setOfficeList] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState('');

  //main api data 
  const [monthWiseSaleApiData, setMonthWiseSaleApiData] = useState([]);
  const [summryApiData, setSummaryApiData] = useState([]);
  const [orderTrackerApiData, setOrderTrackerApiData] = useState([]);
  const [CountryWiseSaleAmount, setCountryWiseSaleAmount] = useState([]);
  const [CustomerWiseSaleAmount, setCustomerWiseSaleAmount] = useState([]);
  const [CategoryWiseSaleAmount, setCategoryWiseSaleAmount] = useState([]);
  const [MetalTypeColorWiseSale, setMetalTypeColorWiseSale] = useState([]);
  const [CustomerTypeWiseSaleAmount, setCustomerTypeWiseSaleAmount] = useState([]);
  const [VendorWiseNetWt, setVendorWiseNetWt] = useState([]);
  const [SalesrepWiseSaleAmount, setSalesrepWiseSaleAmount] = useState([]);


  const countryListHandleChange = (e) => {
    setSelectedCountry(e.target.value);
  }
  const salesmanListHandleChange = (e) => {
    setSelectedSales(e.target.value);
  }
  const officeListHandleChange = (e) => {
    setSelectedOffice(e.target.value);
  }

  useEffect(() => {
    let apiUrl_kayra = '';

    if(hostName?.toLowerCase() === 'zen' || hostName?.toLowerCase() === 'localhost'){
      apiUrl_kayra = 'http://zen/jo/api-lib/App/DashBoard';
    }else{
      apiUrl_kayra = 'https://view.optigoapps.com/linkedapp/App/DashBoard';
    }

    const fetchDropdownData = async() => {
      try {
        const body = {
          "Token" : `${tkn}`  
          ,"ReqData":`[{\"Token\":\"${tkn}\",\"LoginId\":\"${LId}\",\"Evt\":\"Master\"}]`
        }
    
        const response = await axios.post(apiUrl_kayra, body);
        
        if(response?.data?.Status === '200'){
          if(response?.data?.Data){
            if(response?.data?.Data?.DT?.length > 0){
              setCountryList(response?.data?.Data?.DT);
            }
            if(response?.data?.Data?.DT1?.length > 0){
              setSalesList(response?.data?.Data?.DT1);
            }
            if(response?.data?.Data?.DT2?.length > 0){
              setOfficeList(response?.data?.Data?.DT2);
            }
          }
        }
        
      } catch (error) {
        console.log(error);
        
      }
    }

    fetchDropdownData();

    

    // ========================================================================================
    // Get today's date
    const today = moment();

    // Financial year start: 1st April of the current year
    const financialYearStart = moment()?.month(3)?.date(1); // April is 3rd month (0-based index)
    const financialYearEnd = moment(financialYearStart)?.add(1, "year")?.subtract(1, "day");
    // Set initial values
    setFDate(financialYearStart?.toDate());
    setTDate(today?.isAfter(financialYearEnd) ? financialYearEnd?.toDate() : today?.toDate());
    setTDatef(financialYearStart?.toDate());
    setTDatef(today?.isAfter(financialYearEnd) ? financialYearEnd?.toDate() : today?.toDate());

    setTimeout(() => {
      handleApply();
    },0);
  
  }, []);

  const handleFDateChange = (date) => {
    setFDate(date); // Store the actual date
  };

  const handleTDateChange = (date) => {
    setTDate(date);
  };

  const handleApply = () => {
    // Check if the 'from' and 'to' dates are valid

    

    // if (fdate && tdate) {
      const startDate = moment(fdate);
      const endDate = moment(tdate);
  
      // if (!startDate?.isValid() || !endDate?.isValid()) {
      //   alert('Please select valid dates.');
      //   return;
      // }
  
      // // Check if the end date is before the start date
      // if (endDate?.isBefore(startDate)) {
      //   alert('Invalid dates.');
      //   return;
      // }
  
      // Format the dates and set the state
      const formattedFDate = startDate?.format('MM/DD/YYYY');
      const formattedTDate = endDate?.format('MM/DD/YYYY');
      setFDatef(formattedFDate);
      setTDatef(formattedTDate);
  
      // Fetch API Data Here
      fetchData(formattedFDate, formattedTDate, selectedCountry, selectedSales, selectedOffice);
    // }
    //  else {
    //   alert('Please select both From and To dates.');
    // }
  };
  
  // Separate function to fetch data
  const fetchData = async (fdatef, tdatef, country, sales, office) => {
    const today = moment();
    const financialYearStart = moment()?.month(3)?.date(1); // April is 3rd month (0-based index)
    const financialYearEnd = moment(financialYearStart)?.add(1, "year")?.subtract(1, "day");
    if(fdatef === '' || fdatef === "Invalid date"){
      fdatef = moment(financialYearStart?.toDate())?.format("MM/DD/YYYY");
    }
    if(tdatef === '' || tdatef === "Invalid date"){
      tdatef = today?.isAfter(financialYearEnd) ? moment(financialYearEnd?.toDate())?.format("MM/DD/YYYY") : moment(today?.toDate())?.format("MM/DD/YYYY");
    }
    
      // Parse the dates to check if tdatef is before fdatef
  const startDate = moment(fdatef, "MM/DD/YYYY");
  const endDate = moment(tdatef, "MM/DD/YYYY");

  // Validate if end date is before start date
  if (endDate.isBefore(startDate)) {
    alert("Error: End date cannot be before Start date.");
    return; // Exit the function if validation fails
  }

    
    try {
      const monthWiseSaleData = await fetchDashboardData(tkn, hostName, fdatef, tdatef, "MonthWiseSaleAmount", sales, office);
      setMonthWiseSaleApiData(monthWiseSaleData);
  
      const summaryData = await fetchDashboardData(tkn, hostName, fdatef, tdatef, "Summary", sales, office);
      setSummaryApiData(summaryData.length > 0 ? summaryData[0] : {});
  
      const progressWiseOrder = await fetchDashboardData(tkn, hostName, fdatef, tdatef, "ProgressWiseOrder", sales, office);
      setOrderTrackerApiData(progressWiseOrder);
  
      const countryWiseSaleAmount = await fetchDashboardData(tkn, hostName, fdatef, tdatef, "CountryWiseSaleAmount", sales, office);
      setCountryWiseSaleAmount(countryWiseSaleAmount);
  
      const customerWiseSaleAmount = await fetchDashboardData(tkn, hostName, fdatef, tdatef, "CustomerWiseSaleAmount", sales, office);
      setCustomerWiseSaleAmount(customerWiseSaleAmount);
  
      const categoryWiseSaleAmount = await fetchDashboardData(tkn, hostName, fdatef, tdatef, "CategoryWiseSaleAmount", sales, office);
      setCategoryWiseSaleAmount(categoryWiseSaleAmount);
  
      const metalTypeColorWiseSale = await fetchDashboardData(tkn, hostName, fdatef, tdatef, "MetalTypeColorWiseSale", sales, office);
      setMetalTypeColorWiseSale(metalTypeColorWiseSale);
  
      const customerTypeWiseSaleAmount = await fetchDashboardData(tkn, hostName, fdatef, tdatef, "CustomerTypeWiseSaleAmount", sales, office);
      setCustomerTypeWiseSaleAmount(customerTypeWiseSaleAmount);
  
      const vendorWiseNetWt = await fetchDashboardData(tkn, hostName, fdatef, tdatef, "VendorWiseNetWt", sales, office);
      setVendorWiseNetWt(vendorWiseNetWt);
  
      const salesrepWiseSaleAmount = await fetchDashboardData(tkn, hostName, fdatef, tdatef, "SalesrepWiseSaleAmount", sales, office);
      setSalesrepWiseSaleAmount(salesrepWiseSaleAmount);
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

useEffect(() => {
  const today = moment();
  const financialYearStart = moment().month(3).date(1); // April 1st (financial year start)
  const financialYearEnd = moment(financialYearStart).add(1, "year").subtract(1, "day");

  // Set the default values for fdate and tdate
  const defaultFDate = financialYearStart.toDate();
  const defaultTDate = today.isAfter(financialYearEnd) ? financialYearEnd.toDate() : today.toDate();

  // Set both formatted and actual date states
  setFDate(defaultFDate);
  setTDate(defaultTDate);
  setFDatef(moment(defaultFDate).format("MM/DD/YYYY"));
  setTDatef(moment(defaultTDate).format("MM/DD/YYYY"));

  handleApply();

}, []);

// useEffect(() => {
//   if (fdatef && tdatef) {
//     handleApply();
//   }
// }, [fdatef, tdatef]);



  return (
    <ApexChartWrapper style={{paddingBottom:'2.5rem', paddingTop:'1rem', width:'95%', margin:'0 auto'}}>
   
      <KeenSliderWrapper>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <div className='d-flex justify-content-start align-items-end w-100'>
            <Box style={{margin:'5px', width:'22%', display:'flex', alignItems:'flex-end', marginBottom:'0px'}}>
              <div style={{display:'flex'}}>
                <div style={{display:'flex', flexDirection:'column'}}>
                  <span className='fs_analytics_l'>From Date</span>
                  <DatePicker
                    selected={fdate}
                    id='basic-input'
                    popperPlacement={popperPlacement}
                    onChange={handleFDateChange}
                    dateFormat="dd-MM-yyyy"
                    placeholderText={ "DD-MM-YYYY"}
                    customInput={<CustomInput className='fs_analytics_l' sx={{border:'1px solid #989898', backgroundColor:'white', marginRight:'10px'}}  />}
                    className='fs_analytics_l'
                  />
                </div>
                <div style={{display:'flex',  flexDirection:'column'}}>
                  <span className='fs_analytics_l'>To Date</span>
                  <DatePicker
                    selected={tdate}
                    id='basic-input'
                    popperPlacement={popperPlacement}
                    onChange={handleTDateChange}
                    dateFormat="dd-MM-yyyy"
                    placeholderText={ "DD-MM-YYYY"}
                    customInput={<CustomInput className='fs_analytics_l' sx={{border:'1px solid #989898',  backgroundColor:'white', marginRight:'10px'}}  />}
                    className='fs_analytics_l'
                  />
                </div>
              </div>
            </Box>
            <Box className="me-1" style={{minWidth:'200px'}}>
              <label htmlFor="country">Country</label>
              <select className='form-control kayrafilter' value={selectedCountry}  name="country" id="country" onChange={(e) => countryListHandleChange(e)}>
                <option value="" disabled selected>select</option>
                {
                  countryList?.map((e, i) => {
                    return <option key={i} value={e?.CurrencyRate}>{e?.Currencycode}</option>
                  })
                }
                {/* <option value="7.8">USA</option>
                <option value="1">INR</option> */}
              </select>
            </Box>
            <Box className="me-1" style={{minWidth:'200px'}}>
              <label htmlFor="salesman">Salesman</label>
              <select className='form-control' name="salesman"  value={selectedSales} id="salesman" onChange={(e) => salesmanListHandleChange(e)}>
                <option value="" disabled selected>select </option>
                {
                  salesList?.map((e, i) => {
                    return <option key={i} value={e?.SaleRepId}>{e?.CustomerCode}</option>
                  })
                }
              </select>
            </Box>
            <Box className="me-1" style={{minWidth:'200px'}}>
            <label htmlFor="office">Office</label>
              <select className='form-control' name="office" id="office"  value={selectedOffice} onChange={(e) => officeListHandleChange(e)}>
                <option value="" disabled selected>select </option>
                {
                  officeList?.map((e, i) => {
                    return <option key={i} value={e?.LockerId}>{e?.LockerName}</option>
                  })
                }
              </select>
            </Box>
            <div style={{marginBottom:'3px'}}><Button variant='contained' sx={{backgroundColor:theme?.palette?.customColors?.green, marginLeft:'10px', padding:'9px 0px'}} size='large' onClick={() => handleApply()}>Apply</Button></div>
            </div>
          </Grid>
         
          <Grid item xs={12} md={6} lg={9} style={{paddingTop:'25px'}}>
            <AnalyticsEarningReports tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCountry} salesman={selectedSales} office={selectedOffice} monthWiseSaleData={monthWiseSaleApiData} summaryData={summryApiData} />
          </Grid>
          <Grid item xs={12} md={6} lg={3} style={{paddingTop:'25px'}}>
            <AnalyticsSupportTracker tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCountry} salesman={selectedSales} office={selectedOffice} orderTracker={orderTrackerApiData} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} style={{paddingTop:'25px'}}>
            <AnalyticsSalesByCountries tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCountry} salesman={selectedSales} office={selectedOffice} countryWiseSale={CountryWiseSaleAmount} />
          </Grid>
          <Grid item xs={12} sm={6} md={8} lg={9} style={{paddingTop:'25px'}}>
            {/* <AnalyticsCustomerTypeWise tkn={tkn} /> */}
            <AnalyticsSalesEarningReport tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCountry} salesman={selectedSales} office={selectedOffice} CustomerWiseSaleAmountData={CustomerWiseSaleAmount} />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}  style={{paddingTop:'25px'}}>
            <AnalyticsTotalEarning tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCountry} salesman={selectedSales} office={selectedOffice} CategoryWiseSaleAmountData={CategoryWiseSaleAmount} />
            {/* <AnalyticsSalesEarningReport /> */}
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} style={{paddingTop:'25px'}}>
            <AnalyticsProject tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCountry} salesman={selectedSales} office={selectedOffice} MetalTypeColorWiseSaleData={MetalTypeColorWiseSale} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} style={{paddingTop:'25px'}}>
            <ApexRadialBarChart tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCountry} salesman={selectedSales} office={selectedOffice} CustomerTypeWiseSaleAmountData={CustomerTypeWiseSaleAmount} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} style={{paddingTop:'25px'}}>
            <RechartsPieChart tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCountry} salesman={selectedSales} office={selectedOffice} VendorWiseNetWtData={VendorWiseNetWt} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} style={{paddingTop:'25px'}}>
            <AnalyticsSalesRepWiseSaleAmt tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCountry} salesman={selectedSales} office={selectedOffice} SalesrepWiseSaleAmount={SalesrepWiseSaleAmount} />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
