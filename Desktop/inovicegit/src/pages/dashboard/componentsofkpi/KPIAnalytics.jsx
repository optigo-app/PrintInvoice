
import { Box, Button, Grid, useMediaQuery, useTheme, Select, MenuItem, Typography, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton   } from '@mui/material';
import React, {  useEffect, useState } from 'react';
import "./kpianalytics.css"
import AccountNHR from './components/AccountNHR';
import SalesNMarketing1 from './components/SalesNMarketing1';
import QualityControl from './components/QualityControl';
import Manufacturing from './components/Manufacturing';
import RawMaterial from './components/RawMaterial';
import { fetchKPIDashboardData, formatAmountKWise } from '../GlobalFunctions';
import ProductDevelopment from './components/ProductDevelopment';
import SalesNMarketing2 from './components/SalesNMarketing2';
import HeaderOfCard from './components/HeaderOfCard';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import SalesNMarketing3 from './components/SalesNMarketing3.js';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import CustomInput from '../@core/components/pickersComponent/PickersCustomInput';
import { checkDivByZero, checkIsZero, checkNullUndefined } from './components/global.js';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import "react-datepicker/dist/react-datepicker.css";

const KPIAnalytics = ({tkn, sv, url, hostName}) => {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme?.breakpoints?.down('sm'));
    const isMaxWidth12010px = useMediaQuery('(max-width:1210px)');
    const isMaxWidth1700px = useMediaQuery('(max-width:1700px)');
    const isMaxWidth900px = useMediaQuery('(max-width:899px)');
    const [popperPlacement, setPopperPlacement] = useState('bottom-start');
    
    const [allApiData, setAllApiData] = useState(null);
    const [apiData1, setApiData1] = useState([]);

    const [loading, setLoading] = useState(false);

    const [QCData, setQCData] = useState([]);
    const [PDData, setPDData] = useState([]);
    const [SM1, setSM1] = useState([]);
    const [SM2, setSM2] = useState([]);
    const [SM3, setSM3] = useState([]);
    const [RMData, setRMData] = useState([]);
    const [MFGData, setMFGData] = useState([]);
    const[columns, setColumns] = useState([]);


    const [fdate, setFDate] = useState(moment().format('MM-DD-YYYY'));
    const [tdate, setTDate] = useState(moment().format('MM-DD-YYYY'));
    const [fdatef, setFDatef] = useState(moment().format('MM-DD-YYYY'));
    const [tdatef, setTDatef] = useState(moment().format('MM-DD-YYYY'));
    const [dropdownValue, setDropdownValue] = useState('Today');
    const [daysCount, setDaysCount] = useState(1);
    
    const isMaxWidth720px = useMediaQuery('(max-width:720px)');
    
    const [showPopUp, setShowPopUp] = useState(false);

    const [pleaseWaitFlag, setPleaseWaitFlag] = useState(false);

  

    useEffect(() => {
      callAllApi();
    }, []);


    // const setInitialDateRange = (value) => {
    //   const today = moment();
    //   let startDate, endDate;
  
    //   switch (value) {
    //     case 'Today':
    //       startDate = today;
    //       endDate = today;
    //       break;
    //     case 'Yesterday':
    //       startDate = today.clone().subtract(1, 'day');
    //       endDate = today;
    //       break;
    //     case 'Week':
    //       startDate = today.clone().subtract(6, 'days');
    //       endDate = today;
    //       break;
    //     case 'Month':
    //       startDate = today.clone().subtract(1, 'month').add(1, 'day');
    //       endDate = today;
    //       break;
    //     case '6 Months':
    //       startDate = today.clone().subtract(6, 'months').add(1, 'day');
    //       endDate = today;
    //       break;
    //     case '1 Year':
    //       startDate = today.clone().subtract(1, 'year').add(1, 'day');
    //       endDate = today;
    //       break;
    //     default:
    //       startDate = today;
    //       endDate = today;
    //   }
  
    //   setFDate(startDate.toDate());
    //   setTDate(endDate.toDate());
    // };

    const setInitialDateRange = (value) => {
      const today = moment();
      let startDate, endDate;
    
      switch (value) {
        case 'Today':
          startDate = today;
          endDate = today;
          break;
        case 'Yesterday':
          startDate = today.clone().subtract(1, 'day');
          endDate = today;
          break;
        case 'Week':
          startDate = today.clone().subtract(6, 'days');
          endDate = today;
          break;
        case 'Month':
          startDate = today.clone().subtract(1, 'month').add(1, 'day');
          endDate = today;
          break;
        case '6 Months':
        case '1 Year':
          // Get the current financial year's start date
          const financialYearStart = moment().month(3).date(1); // April 1st of the current year
          startDate = financialYearStart;
    
          // Set the end date to the current date
          endDate = today;
    
          if (value === '6 Months') {
            // For 6 Months, set the start date to 6 months before the current date
            startDate = today.clone().subtract(6, 'months').startOf('month');
          }
    
          break;
        default:
          startDate = today;
          endDate = today;
      }
    
      setFDate(startDate.toDate());
      setTDate(endDate.toDate());
    };
    

    const handlePrevious = () => {
      if (!fdate || !tdate) return;
  
      const start = moment(fdate);
      const end = moment(tdate);
  
      switch (dropdownValue) {
        case 'Today':
          setFDate(start.subtract(1, 'day').toDate());
          setTDate(end.subtract(1, 'day').toDate());
          break;
        case 'Yesterday':
          setFDate(start.subtract(1, 'day').toDate());
          setTDate(end.subtract(1, 'day').toDate());
          break;
        case 'Week':
          setFDate(start.subtract(7, 'days').toDate());
          setTDate(end.subtract(7, 'days').toDate());
          break;
        case 'Month':
          setFDate(start.subtract(1, 'month').toDate());
          setTDate(end.subtract(1, 'month').toDate());
          break;
        case '6 Months':
          setFDate(start.subtract(6, 'months').toDate());
          setTDate(end.subtract(6, 'months').toDate());
          break;
        case '1 Year':
          setFDate(start.subtract(1, 'year').toDate());
          setTDate(end.subtract(1, 'year').toDate());
          break;
        default:
          break;
      }
    };
    const handleNext = () => {
      if (!fdate || !tdate) return;
  
      const start = moment(fdate);
      const end = moment(tdate);
  
      switch (dropdownValue) {
        case 'Today':
          setFDate(start.add(1, 'day').toDate());
          setTDate(end.add(1, 'day').toDate());
          break;
        case 'Yesterday':
          setFDate(start.add(1, 'day').toDate());
          setTDate(end.add(1, 'day').toDate());
          break;
        case 'Week':
          setFDate(start.add(7, 'days').toDate());
          setTDate(end.add(7, 'days').toDate());
          break;
        case 'Month':
          setFDate(start.add(1, 'month').toDate());
          setTDate(end.add(1, 'month').toDate());
          break;
        case '6 Months':
          setFDate(start.add(6, 'months').toDate());
          setTDate(end.add(6, 'months').toDate());
          break;
        case '1 Year':
          setFDate(start.add(1, 'year').toDate());
          setTDate(end.add(1, 'year').toDate());
          break;
        default:
          break;
      }
    };
    const handleDropdownChange = (event) => {
      const selectedValue = event.target.value;
      setDropdownValue(selectedValue);
      setInitialDateRange(selectedValue);
    };
    const autoSetDropdownValue = (start, end) => {
      const startDate = moment(start);
      const endDate = moment(end);
      const diffInDays = endDate.diff(startDate, 'days');
    
      if (diffInDays === 0) {
        setDropdownValue('Today');
      } else if (diffInDays <= 7) {  // Adjusted to include diffInDays == 1
        setDropdownValue('Week');
      } else if (diffInDays > 7 && diffInDays <= 31) {
        setDropdownValue('Month');
      } else if (diffInDays >= 32 && diffInDays <= 180) {
        setDropdownValue('6 Months');
      } else if (diffInDays >= 181 && diffInDays <= 366) {
        setDropdownValue('1 Year');
      } else {
        setDropdownValue('Custom');
      }
    };
    const handleFDateChange = (date) => {
      setFDate(date); // Store the actual date
      // autoSetDropdownValue(date, tdate); 
    };
    const handleTDateChange = (date) => {
      setTDate(date);
      // autoSetDropdownValue(fdate, date)
    };

    // useEffect(() => {
    //   setInitialDateRange(dropdownValue);
    // }, [dropdownValue]);





    const callAllApi = async() => {
      try {
        setLoading(true);
        setPleaseWaitFlag(true);

        let apiUrl_kpi = '';

        // let url = '';
        if(hostName?.toLowerCase() === 'zen' || hostName?.toLowerCase() === 'localhost'){
          // setUrl('http://zen/jo/api-lib/App/KPI_DashBoard');
          apiUrl_kpi = 'http://zen/jo/api-lib/App/KPI_DashBoard';
        }else{
          // setUrl('https://view.optigoapps.com/linkedapp/App/API_MRPBill');
          apiUrl_kpi = 'https://view.optigoapps.com/linkedapp/App/KPI_DashBoard';
        }


        // const PD = await fetchKPIDashboardData(tkn, fdatef, tdatef, "ProductDevelopment");
        // const ACP = await fetchKPIDashboardData(tkn, fdatef, tdatef, "AvgCollectionPeriod");
        // const SMTS = await fetchKPIDashboardData(tkn, fdatef, tdatef, "SalesMarketing_TotalSale");
        // const QC = await fetchKPIDashboardData(tkn, fdatef, tdatef, "QualityControl");
        // const SMO = await fetchKPIDashboardData(tkn, fdatef, tdatef, "SalesMarketing_Order");
        // const SMOC = await fetchKPIDashboardData(tkn, fdatef, tdatef, "SalesMarketing_OrderCompletion");
        // const SMTCSBC = await fetchKPIDashboardData(tkn, fdatef, tdatef, "SalesMarketing_TotalSaleBusinessClassWise");
        // const SMTL = await fetchKPIDashboardData(tkn, fdatef, tdatef, "SalesMarketing_TotalSaleLocationWise");
        const PD = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "ProductDevelopment");
        const ACP = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "AvgCollectionPeriod");
        const SMTS = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "SalesMarketing_TotalSale");
        const QC = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "QualityControl");
        const SMO = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "SalesMarketing_Order");
        const SMOC = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "SalesMarketing_OrderCompletion");
        const SMTCSBC = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "SalesMarketing_TotalSaleBusinessClassWise");
        const SMTL = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "SalesMarketing_TotalSaleLocationWise");
        // const url = "http://zen/jo/api-lib/App/KPI_DashBoard";
     
        const body = JSON.stringify({
          "Token" : `${tkn}`  
          ,"ReqData":`[{\"Token\":\"${tkn}\",\"Evt\":\"InventoryTurnOverRatio\",\"FDate\":\"${moment(fdate)?.format('MM/DD/YYYY')}\",\"TDate\":\"${moment(tdate)?.format('MM/DD/YYYY')}\"}]`
        });
        const headers = {
          "Content-Type":"application/json"
        }
        const ITOR_response = await axios.post(apiUrl_kpi, body, headers);
        
        
        // const replacedUrl = ("http://zen/api/M.asmx/Optigo")?.replace("M.asmx/Optigo", "report.aspx");
        const replacedUrl = (url)?.replace("M.asmx/Optigo", "report.aspx");
        const body2 = {
          "con":"{\"id\":\"\",\"mode\":\"kpidashboard\",\"appuserid\":\"admin@hs.com\"}",
          "p":`{\"fdate\":\"${moment(fdate)?.format('MM/DD/YYYY')}\",\"tdate\":\"${moment(tdate)?.format('MM/DD/YYYY')}\"}`,  
          "f":"m-test2.orail.co.in (ConversionDetail)"
        }

      const headers2 = {
        Authorization:`Bearer ${tkn}`,
        YearCode:"e3t6ZW59fXt7MjB9fXt7b3JhaWwyNX19e3tvcmFpbDI1fX0=",
        version:"v4",
        sv:sv
      }
      // const prdApi = await axios.post("http://zen/api/report.aspx", body2, { headers: headers2 });
      const prdApi = await axios.post(replacedUrl, body2, { headers: headers2 });
      const mainData = prdApi?.data?.Data;

        let obj = {
          ProductDevelopment:'',
          AvgCollectionPeriod:'',
          SalesMarketing_TotalSale:'',
          InventoryTurnOverRatio:'',
          QualityControl:'',
          ProductionApiData : '',
          SalesMarketingOrder:'',
          SalesMarketing_OrderCompletion:'',
          SalesMarketing_TotalSaleBusinessClassWise:'',
          SalesMarketing_TotalSaleLocationWise:''
        }
        if(PD){
          obj.ProductDevelopment = PD;
        }
        if(ACP){
          obj.AvgCollectionPeriod = ACP;
        }
        if(SMTS){
          obj.SalesMarketing_TotalSale = SMTS;
        }
        if(ITOR_response){
          obj.InventoryTurnOverRatio = ITOR_response?.data?.Data;
        }
        if(QC){
          obj.QualityControl = QC;
        }
        if(mainData){
          obj.ProductionApiData = mainData;
        }
        if(SMO){
          obj.SalesMarketingOrder = SMO;
        }
        if(SMOC){
          obj.SalesMarketing_OrderCompletion = SMOC;
        }
        if(SMTCSBC){
          obj.SalesMarketing_TotalSaleBusinessClassWise = SMTCSBC;
        }
        if(SMTL){
          obj.SalesMarketing_TotalSaleLocationWise = SMTL;
        }
        setAllApiData(obj);
        setLoading(false);
        setPleaseWaitFlag(false);
        console.log(obj);
        
              const data = [
                  {
                      heading:'Fix Asset Laverage Ratio',
                      totalValue: parseFloat(checkNullUndefined( 
                        ( 
                        ( 
                          ( obj?.SalesMarketing_TotalSale[0]?.LabourAmount / (obj?.InventoryTurnOverRatio?.DT?.[0]?.AvgInventory))
                          / 
                          (obj?.InventoryTurnOverRatio?.DT?.[0]?.NoOfDays)
                         ) * 365)
                         )),
                      series:[],
                      subheading:'Account & HR'
                  },
                  {
                      heading:'Revenue Per Employees',
                      totalValue: parseFloat(checkNullUndefined(((obj?.SalesMarketing_TotalSale[0]?.OnlySaleLabourAmount / (PD[0]?.RevenueEmployeeCount)))))?.toFixed(2),
                      series:[],
                      subheading:'Account & HR'
                  },
                  {
                      heading:'Avg. OrderDue Debtors',
                      totalValue: parseFloat(checkNullUndefined(checkNullUndefined(obj?.ProductDevelopment[0]?.TotalOverDueDays / obj?.ProductDevelopment[0]?.TotalBillCount)))?.toFixed(2),
                      series:[],
                      subheading:'Account & HR'
                  },
                  {
                      heading:'Inventory Turn Over Ratio',
                      totalValue:parseFloat(checkNullUndefined(obj?.InventoryTurnOverRatio?.DT?.[0]?.InventoryTurnOverRatio))?.toFixed(2),
                      series:[],
                      subheading:'Account & HR'
                  },
                  {
                      heading:'Avg. Collection Period',
                      totalValue: parseFloat(checkNullUndefined(((obj?.AvgCollectionPeriod[0]?.Sun_Debtor / (obj?.SalesMarketing_TotalSale[0]?.Amount)) * 365)))?.toFixed(2),
                      // totalValue: (checkNullUndefined((obj?.AvgCollectionPeriod[0]?.Sun_Debtor ) * 365)),
                      series:[],
                      subheading:'Account & HR'
                  },
                  {
                      heading:'Labour vs Exp',
                      totalValue: parseFloat(checkNullUndefined(((
                        ((obj?.SalesMarketing_TotalSale[0]?.LabourAmount) - 
                        (obj?.InventoryTurnOverRatio?.DT?.[0]?.Direct_Expense + obj?.InventoryTurnOverRatio?.DT1?.[0]?.InDirect_Expense)) / 
                        (obj?.SalesMarketing_TotalSale[0]?.LabourAmount)
                        ) * 100)))?.toFixed(2),
                      series:[],
                      subheading:'Account & HR'
                  }
              ] ;
              setApiData1(data);

              const data2 = [
                {
                  stats: parseFloat(checkNullUndefined(obj?.ProductionApiData?.rd[0]?.qc_avg_inward))?.toFixed(2),
                  title: 'Inward',
             
                },
                {
                  stats: parseFloat(checkNullUndefined(obj?.QualityControl?.[0]?.JobMoveStockBookCount))?.toFixed(2),
                  title: 'Outward',
           
                },
                {
                  stats: (checkNullUndefined(obj?.QualityControl?.[0]?.QACountWithOutClub)),
                  title: 'Total Jobs',
                },
                {
                  stats: parseFloat(checkNullUndefined((obj?.QualityControl?.[0]?.DaysDiff_QA_To_Stock / (obj?.QualityControl?.[0]?.TotalJobCount_QA_To_Stock))))?.toFixed(2),
                  title: 'Avg. Prs. Time',
                }
              ]
              setQCData(data2);

              const data3 = [
                {
                  stats: `${parseFloat(checkNullUndefined(obj?.ProductDevelopment[0]?.Cnt))} / ${parseFloat(checkNullUndefined(obj?.ProductDevelopment[0]?.MetalWeight))?.toFixed(3)} gm`,
                  title: 'New Development',
                },
                {
                  stats: `${parseFloat(checkNullUndefined((obj?.ProductDevelopment[0]?.SaleCount / (obj?.ProductDevelopment[0]?.DesignCnt))))?.toFixed(2)}`,
                  title: 'Repetation Rate',
                },
               
              ]
              setPDData(data3);
              const data4 = [
              {
                stats: `${parseFloat(checkNullUndefined(obj?.SalesMarketingOrder[0]?.TotalOrder))?.toFixed(3)} gm`,
                title: 'Total Order',
            },
             {
                stats: `${parseFloat(checkNullUndefined(obj?.SalesMarketingOrder[0]?.AvgOrderSize))?.toFixed(2)}`,
                title: 'Avg. Order Size',
            },
             {
                stats: `${((obj?.SalesMarketing_OrderCompletion[0]?.LeadTime))}`,
                title: 'Lead Time',
            },
             {
                stats: `${obj?.SalesMarketing_OrderCompletion[0]?.DelayTime}`,
                title: 'Delay Time',
            },
             {
                stats: `${parseFloat(checkNullUndefined(obj?.SalesMarketing_TotalSale[0]?.AvgLabour))?.toFixed(2)}`,
                title: 'Avg. Labour',
            },
             {
                stats: `${parseFloat(checkNullUndefined(obj?.SalesMarketing_TotalSale[0]?.SaleReturnPer))?.toFixed(2)}`,
                title: 'Sales Return (%)',
            },
             {
                stats: `${parseFloat(checkNullUndefined(obj?.SalesMarketingOrder[0]?.StockCountWithOutClub))?.toFixed(2)}`,
                title: 'Avg. Stock Book Jobs',
            },
             {
                stats: parseFloat(checkNullUndefined(obj?.SalesMarketing_OrderCompletion[0]?.OverDueDebtorsAmount))?.toFixed(2),
                title: 'Overdue Debtors',
            }
              ];
              setSM1(data4);

              const data5 = [
                {
                stats: `${parseFloat(checkNullUndefined(obj?.SalesMarketing_TotalSale[0]?.NetWt))?.toFixed(3)} gm`,
                title: 'Total Sale(Net)',
                },
               {
                stats: `${formatAmountKWise(checkNullUndefined(obj?.SalesMarketing_TotalSale[0]?.MetalAmount))}`,
                title: 'Gold Amt',
                },
               {
                stats: `${formatAmountKWise(checkNullUndefined(obj?.SalesMarketing_TotalSale[0]?.DiamondAmount))}`,
                title: 'Diamond Amt',
              },
               {
                stats: `${formatAmountKWise(checkNullUndefined(obj?.SalesMarketing_TotalSale[0]?.ColorStoneAmount))}`,
                title: 'Color Stone Amt',
              },
              {
                stats: `${formatAmountKWise(checkNullUndefined(obj?.SalesMarketing_TotalSale[0]?.LabourAmount))}`,
                title: 'Labour Amt',
              }
              ];
              setSM2(data5);

              if(SMTCSBC){
                let arr = obj?.SalesMarketing_TotalSaleBusinessClassWise?.sort((a, b) => b?.Amount - a?.Amount);
                // const formatedArr = obj?.SalesMarketing_TotalSaleBusinessClassWise?.slice(0, 4);
                const formatedArr = arr?.slice(0, 4);
                // const formatedArr2 = obj?.SalesMarketing_TotalSaleBusinessClassWise?.slice(4);
                const formatedArr2 = arr?.slice(4);
                const obj_cs = {
                  CustomerType : "Other",
                  Amount:0
                }
                
                formatedArr2?.forEach((a) => {
                  obj_cs.Amount += a?.Amount;
                })
                if(obj_cs?.Amount !== 0){
                  formatedArr.push(obj_cs);
                }
                
                setSM3(formatedArr);
              }

              const data6 = [
                {
                  stats: obj?.ProductionApiData?.rd[0]?.rm_baggingcompleted,
                  title: 'Bagging Completed',
                },
                {
                  stats: `${(parseInt((obj?.ProductionApiData?.rd[0]?.rm_avg_proc_time / (60 * 60 * 24)))?.toFixed(0))} Days`,
                  title: 'Avg. Process Time',
                },
                {
                  stats: `${(obj?.ProductionApiData?.rd[0]?.rm_grossloss?.toFixed(3))} gm`,
                  title: 'Gross Loss',
                },
                {
                  stats: (obj?.ProductionApiData?.rd[0]?.rm_goldstock === null || obj?.ProductionApiData?.rd[0]?.rm_goldstock === undefined) ? 0 : `${((obj?.ProductionApiData?.rd[0]?.rm_goldstock)?.toFixed(2))} Amt`,
                  title: 'Gold Stock',
                  // wt: `${+(obj?.ProductionApiData?.rd[0]?.rm_goldstock_wt === null ? 0.000 : (+(obj?.ProductionApiData?.rd[0]?.rm_goldstock_wt)))?.toFixed(3)} gm`
                  wt: `${(+(obj?.ProductionApiData?.rd[0]?.rm_goldstock_wt))?.toFixed(3)} gm`
                },
                {
                  stats: (obj?.ProductionApiData?.rd[0]?.rm_diastock === null || obj?.ProductionApiData?.rd[0]?.rm_diastock === undefined) ? 0 : `${((obj?.ProductionApiData?.rd[0]?.rm_diastock))?.toFixed(2)} Amt`,
                  title: 'Diamond Stock',
                  // wt: `${+(obj?.ProductionApiData?.rd[0]?.rm_diastock_wt === null ? 0.000 : (+(obj?.ProductionApiData?.rd[0]?.rm_diastock_wt)))?.toFixed(3)} ctw`
                  wt: `${(+(obj?.ProductionApiData?.rd[0]?.rm_diastock_wt))?.toFixed(3)} ctw`
                },
                {
                  stats: (obj?.ProductionApiData?.rd[0]?.rm_csstock === null || obj?.ProductionApiData?.rd[0]?.rm_csstock === undefined) ? 0 : `${((obj?.ProductionApiData?.rd[0]?.rm_csstock))?.toFixed(2)} Amt`,
                  title: 'Colour Stone Stock',
                  // wt: obj?.ProductionApiData?.rd[0]?.rm_csstock_wt === null ? 0 : parseInt(checkNullUndefined(obj?.ProductionApiData?.rd[0]?.rm_csstock_wt))?.toFixed(2)
                  // wt: `${+(obj?.ProductionApiData?.rd[0]?.rm_csstock_wt === null ? 0.000 : (+(obj?.ProductionApiData?.rd[0]?.rm_csstock_wt)))?.toFixed(3)} ctw`
                  wt: `${(+(obj?.ProductionApiData?.rd[0]?.rm_csstock_wt))?.toFixed(3)} ctw`
                }
              ];
              setRMData(data6);


              try {
                
              
              const combinedData = {};
              const allLocations = new Set();
              obj?.ProductionApiData?.rd1?.forEach((item) => {
                const location = item?.manufacturelocationname || "NoLocation";
                if (!combinedData[location]) {
                  combinedData[location] = {};
                }
                combinedData[location] = {
                  ...combinedData[location],
                  "Production (gm)": (item?.mfg_production_gms)?.toFixed(3) || 0.000,
                  Jobs: (item?.mfg_jobs) || 0.00,
                  "Gross Loss (%)": (item?.mfg_grossloss)?.toFixed(3) || 0.000,
                  "Rejection (%)": (item?.mfg_rejection)?.toFixed(3) || 0.000,
                };
                allLocations.add(location);
              });
        
              // Merge API 2 Data
              obj?.SalesMarketing_TotalSaleLocationWise?.forEach((item) => {
                const location = item?.locationname || "NoLocation";
                if (!combinedData[location]) {
                  combinedData[location] = {};
                }
                combinedData[location] = {
                  ...combinedData[location],
                  "Labour Amount": item?.LabourAmount || 0.00,
                };
                allLocations.add(location);
              });
        
              // Define KPIs
              const kpis = [
                "Production (gm)",
                "Jobs",
                "Labour Amount",
                "Gross Loss (%)",
                "Rejection (%)",
              ];
        
              // Create Rows for the Table
              // const tableRows = kpis?.map((kpi, index) => {
              //   const row = { id: index + 1, KPI: kpi };
              //   allLocations.forEach((location) => {
              //     row[location] = combinedData[location]?.[kpi] || 0.00;
              //   });
              //   return row;
              // });
              const tableRows = kpis?.map((kpi, index) => {
                const row = { id: index + 1, KPI: kpi };
                allLocations.forEach((location) => {
                  // Apply conditional decimal formatting based on KPI name
                  if (kpi === "Labour Amount") {
                    row[location] = parseFloat(combinedData[location]?.[kpi] || 0.00)?.toFixed(2); // 2 decimals for amount
                  } else if (kpi === "Production (gm)" || kpi === "Gross Loss (%)" || kpi === "Rejection (%)") {
                    // row[location] = parseInt(combinedData[location]?.[kpi] || 0.000)?.toFixed(3); // 3 decimals for weight/loss
                    row[location] = parseFloat(combinedData[location]?.[kpi] || 0.000)?.toFixed(3); // 3 decimals for weight/loss
                  } else {
                    row[location] = (combinedData[location]?.[kpi] || 0.00);
                  }
                });
                return row;
              });
        
              // Define Columns for the Table
              const tableColumns = [
                { field: "KPI", headerName: "KPI", width: 200 },
                ...Array?.from(allLocations)?.map((location) => ({
                  field: location,
                  headerName: location,
                  flex:1,
                  minWidth: 170,
                  maxWidth: 300,
                })),
              ];
        
              
              tableColumns?.forEach((e) => {
                if (e?.headerName?.toLowerCase() === "nolocation") {
                    e.headerName = "OutRight";
                }
                
            });
            
            
              
              setMFGData(tableRows);
              setColumns(tableColumns);
            } catch (error) {
              console.log(error);
              setPleaseWaitFlag(false);
            }
            
        
      } catch (error) {
        console.log(error);
        setLoading(false);
        setPleaseWaitFlag(false);
      }
    }


      // const handleApply = () => {
      //   if (fdate) {
      //     const formattedFDate = moment(fdate)?.format('MM/DD/YYYY');
      //     setFDatef(formattedFDate);
      //   }else{
      //     setFDatef('');
      //   }
      //   if (tdate) {
      //     const formattedTDate = moment(tdate)?.format('MM/DD/YYYY');
      //     setTDatef(formattedTDate);
      //   }else{
      //     setTDatef('');  
      //   }

      //   const startDate = moment(fdate);
      //   const endDate = moment(tdate);

      //   const daysCount = endDate?.diff(startDate, 'days') + 1;
      //   setDaysCount(daysCount);
      //   callAllApi();
      // };
      const handleApply = () => {
        const startDate = moment(fdate);
        const endDate = moment(tdate);
        const diffInDays = endDate.diff(startDate, 'days');

        // if((dropdownValue === "6 Months" && diffInDays >= 180) || (dropdownValue === "1 Year" && diffInDays >= 180) ){
        //   setShowPopUp(true);
        //   return;
        // }

        // Handle popup scenarios
          if((dropdownValue === "Today" || dropdownValue === "Yesterday" || dropdownValue === "Week" || dropdownValue === "Month") && (diffInDays <= 180)){
            setShowPopUp(false);
          }else if ((dropdownValue === "Today" || dropdownValue === "Yesterday" || dropdownValue === "Week" || dropdownValue === "Month") && (diffInDays >= 180)){
            setShowPopUp(true);
            return;
          }else if ((dropdownValue === "Today" || dropdownValue === "Yesterday" || dropdownValue === "Week" || dropdownValue === "Month") && (diffInDays >= 180)){
            setShowPopUp(true);
            return;
          }else if ((dropdownValue === "6 Months" || dropdownValue === "1 Year" ) && (diffInDays >= 180)){
            setShowPopUp(true);
            return;
          }else if ((dropdownValue === "6 Months" || dropdownValue === "1 Year" ) && (diffInDays <= 180)){
            setShowPopUp(false);
          }else{
            setShowPopUp(false);
          }

        if (fdate && tdate) {
          const startDate = moment(fdate);
          const endDate = moment(tdate);
      
          // Validation: Check if startDate is later than endDate
          if (startDate.isAfter(endDate)) {
            alert('Invalid Dates');
            return; // Exit the function to prevent further execution
          }
      
          const daysCount = endDate.diff(startDate, 'days') + 1;
          setDaysCount(daysCount);
        }
      
        if (fdate) {
          const formattedFDate = moment(fdate)?.format('MM/DD/YYYY');
          setFDatef(formattedFDate);
        } else {
          setFDatef('');
        }
      
        if (tdate) {
          const formattedTDate = moment(tdate)?.format('MM/DD/YYYY');
          setTDatef(formattedTDate);
        } else {
          setTDatef('');
        }
      
        callAllApi();
      };
      const handlePopUpConfirm = () => {
        setShowPopUp(false); // Hide the pop-up
        callAllApi(); // Proceed with the API call after user confirmation
      };
      
      // Handle pop-up cancellation
      const handlePopUpCancel = () => {
        setShowPopUp(false); // Hide the pop-up if user cancels
      };
      

      // useEffect(() => {
      //   if (fdate) {
      //     const formattedFDate = moment(fdate).format('MM/DD/YYYY');
      //     setFDatef(formattedFDate);
      //   } else {
      //     setFDatef('');
      //   }
      // }, [fdate]); // This will run whenever fdate changes
      
      // useEffect(() => {
      //   if (tdate) {
      //     const formattedTDate = moment(tdate).format('MM/DD/YYYY');
      //     setTDatef(formattedTDate);
      //   } else {
      //     setTDatef('');
      //   }
      // }, [tdate]);

  return (
    <>
    <Grid container spacing={1} sx={{marginBottom:'3rem', padding: isSmallScreen ? '1rem' : '1rem', width:'95%', margin:'2% auto', marginTop:"0px" }}>
      { 0 ? <Box       sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
        width: '100%',   // Full width of the container
        padding: '1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
        position: 'fixed', // Ensure the overlay stays on top of other content
        top: 0, // Align to the top of the page
        left: 0, // Align to the left of the page
        zIndex: 1000, // Ensure it's above other elements
      }}
      >
              <CircularProgress sx={{color:'white'}} />
            </Box> : <>
                    {/* {pleaseWaitFlag && (
                        <div className="overlay_kpi">
                          <div className="overlaykpi_content">Please Wait...</div>
                        </div>
                      )} */}
            {
                showPopUp && (
                  <Dialog open={showPopUp} onClose={handlePopUpCancel} className='fs_analytics_l'>
                  {/* <DialogTitle variant='h5' sx={{textAlign:'center', borderBottom:'1px solid #989898'}}>Confirm</DialogTitle> */}
                  <DialogTitle 
                    variant='h5' 
                    sx={{ textAlign: 'center', borderBottom: '1px solid #989898', position: 'relative' }}
                  >
                    Confirm
                    {/* Close icon on the top-right corner of the dialog title */}
                    <IconButton
                      title='Close'
                      onClick={handlePopUpCancel}
                      size="small"
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: 9,
                        color: '#000', // Icon color
                        '&:hover': {
                          backgroundColor: '#e8e8e8', // Hover background color
                          color: 'black', // Hover icon color
                        },
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent>
                    <Typography sx={{pt:2}}>
                      <span style={{fontWeight:'bold', color:'#EA5455'}}>Warning</span> : This Process is <span style={{fontWeight:'bold', color:'#EA5455'}}>heavy loaded</span> which can cause effect in other transactions, or It may take some time to calculate.
                    </Typography>
                    <Typography>Are you sure want to calculate?</Typography>
                  </DialogContent>
                  <DialogActions sx={{display:'flex', alignItems:'center', justifyContent:'center', pb:2}}>
                    <Button onClick={handlePopUpCancel} variant='contained' sx={{backgroundColor:'#EA5455', color:'white', fontWeight:'bold', letterSpacing:'1.2px', boxShadow:0}} size='small' className='fs_analytics_l'>
                      Cancel
                    </Button>
                    <Button onClick={handlePopUpConfirm} variant='contained' sx={{backgroundColor:'#00b953', color:'white', fontWeight:'bold', letterSpacing:'1.2px', boxShadow:0}} size='small' className='fs_analytics_l'>
                      Proceed
                    </Button>
                  </DialogActions>
                </Dialog>
                )
              }
            { !isMaxWidth720px && <Box className='fs_analytics_l ' style={{width:'100%', display:'flex', justifyContent:'flex-end'}}> 
                <Box style={{margin:'5px', width:'50%', display:'flex', alignItems:'flex-end'}} className="media_w_100">
                <Select
                    value={dropdownValue}
                    onChange={handleDropdownChange}
                    style={{ width: '150px' }}
                    size='small'
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'gray', // Default border color
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme?.palette?.customColors?.purple, // Purple border when focused
                      },
                    }}
                  >
                  <MenuItem value="" disabled selected>Date Filters</MenuItem>
                  <MenuItem value="Today">Today</MenuItem>
                  <MenuItem value="Yesterday">Yesterday</MenuItem>
                  {/* <MenuItem value="Week">Week</MenuItem> */}
                  <MenuItem value="Month">This Month</MenuItem>
                  <MenuItem value="6 Months">This 6 Months</MenuItem>
                  <MenuItem value="1 Year">This Year</MenuItem>
                </Select>
                <Button variant="contained" size='small' sx={{mx:1, backgroundColor : theme?.palette?.customColors?.purple, maxWidth:'50px'}} onClick={handlePrevious}>
                  <ArrowBackIosNewIcon />
                </Button>
                
              <div style={{display:'flex'}}>
                <div style={{display:'flex', flexDirection:'column'}}>
                  <span className='fs_analytics_l'>From Date</span>
                  <DatePicker
                    selected={fdate}
                    id='basic-input'
                    popperPlacement={popperPlacement}
                    onChange={handleFDateChange}
                    disabled
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
                    disabled
                    dateFormat="dd-MM-yyyy"
                    placeholderText={ "DD-MM-YYYY"}
                    customInput={<CustomInput className='fs_analytics_l' sx={{border:'1px solid #989898',  backgroundColor:'white', marginRight:'10px'}}  />}
                    className='fs_analytics_l'
                  />
                </div>
              </div>
              <div><Button variant='contained' sx={{backgroundColor:theme?.palette?.customColors?.green}} size='large' onClick={() => handleApply()}>Apply</Button></div>
                <Button variant="contained" size='small' sx={{mx:1, backgroundColor : theme?.palette?.customColors?.purple, maxWidth:'50px'}} onClick={handleNext}>
                  <ArrowForwardIosIcon />
                </Button>
            </Box>
            </Box>}
            { isMaxWidth720px && <Box className='fs_analytics_l ' style={{width:'100%', display:'flex', justifyContent:'flex-end'}}> 
                <Box style={{margin:'5px', width:'50%', display:'flex', alignItems:'flex-end'}} className="media_w_100">
                <div className='d-flex'>
                  <Select
                      value={dropdownValue}
                      onChange={handleDropdownChange}
                      style={{ width: '150px' }}
                      size='small'
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'gray', // Default border color
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme?.palette?.customColors?.purple, // Purple border when focused
                        },
                      }}
                    >
                      <MenuItem value="" disabled selected>Date Filters</MenuItem>
                    <MenuItem value="Today">Today</MenuItem>
                  <MenuItem value="Yesterday">Yesterday</MenuItem>
                  {/* <MenuItem value="Week">Week</MenuItem> */}
                  <MenuItem value="Month">This Month</MenuItem>
                  <MenuItem value="6 Months">This 6 Months</MenuItem>
                  <MenuItem value="1 Year">This Year</MenuItem>
                  </Select>
                  <div className='d-flex'>
                    <Button variant="contained" size='small' sx={{mx:1, backgroundColor : theme?.palette?.customColors?.purple, maxWidth:'50px'}} onClick={handlePrevious}>
                      <ArrowBackIosNewIcon />
                    </Button>
                    <Button variant="contained" size='small' sx={{mx:1, backgroundColor : theme?.palette?.customColors?.purple, maxWidth:'50px'}} onClick={handleNext}>
                      <ArrowForwardIosIcon />
                    </Button>
                  </div>
                </div>
                <div className='d-flex align-items-end'>
              <div style={{display:'flex'}}>
                <div style={{display:'flex', flexDirection:'column'}}>
                  <span className='fs_analytics_l'>From Date</span>
                  <DatePicker
                    selected={fdate}
                    id='basic-input'
                    popperPlacement={popperPlacement}
                    onChange={handleFDateChange}
                    dateFormat="dd-MM-yyyy"
                    disabled
                    placeholderText={ "DD-MM-YYYY"}
                    customInput={<CustomInput className='fs_analytics_l' size="small" sx={{border:'1px solid #989898', backgroundColor:'white', marginRight:'10px', maxWidth:'120px'}}  />}
                    className='fs_analytics_l'
                    size="small"
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
                    disabled
                    placeholderText={ "DD-MM-YYYY"}
                    customInput={<CustomInput className='fs_analytics_l' size="small"  sx={{border:'1px solid #989898',  backgroundColor:'white', marginRight:'10px', maxWidth:'120px'}}  />}
                    className='fs_analytics_l'
                    size="small"
                  />
                </div>
              </div>
              <div><Button variant='contained' sx={{backgroundColor:theme?.palette?.customColors?.green}} size='small' onClick={() => handleApply()}>Apply</Button></div>
              </div>
                {/* <Button variant="contained" size='small' sx={{mx:1, backgroundColor : theme?.palette?.customColors?.purple, maxWidth:'50px'}} onClick={handleNext}>
                  <ArrowForwardIosIcon />
                </Button> */}
            </Box>
            </Box>}
        <Grid item xs={12}><HeaderOfCard headerName="ACCOUNT & HR" bgColor={'#7d5ae773'} /></Grid>
            
            {apiData1?.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <AccountNHR tkn={tkn} data={item} bgColor={theme?.palette?.customColors?.purple} fdate={fdatef} tdate={tdatef} />
                </Grid>
            ))}

        { !isMaxWidth12010px && <><Grid item xs={12} md={4} lg={6}><HeaderOfCard headerName="RAW MATERIAL" bgColor={'#7d5ae773'} /></Grid>
        <Grid item xs={12} md={4} lg={3}><HeaderOfCard headerName="QUALTIY CONTROL" bgColor={'#7d5ae773'} /></Grid>
        <Grid item xs={12} md={4} lg={3}><HeaderOfCard headerName="PRODUCT DEVELOPMENT" bgColor={'#7d5ae773'} /></Grid>
        <Grid item xs={12} md={6} lg={6}>
            <RawMaterial tkn={tkn} bgColor={theme?.palette?.customColors?.purple} fdate={fdatef} tdate={tdatef} sv={sv} RMData={RMData} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
            <QualityControl tkn={tkn} bgColor={theme?.palette?.customColors?.purple} fdate={fdatef} tdate={tdatef} QCData={QCData}  />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
            <ProductDevelopment tkn={tkn} fdate={fdatef} tdate={tdatef} bgColor={theme?.palette?.customColors?.purple}  PDData={PDData} />
        </Grid></>}

        { isMaxWidth12010px && <>
        <Grid item xs={12} ><HeaderOfCard headerName="RAW MATERIAL" bgColor={'#7d5ae773'} /></Grid>
            <Grid item xs={12} md={12} lg={12}>
                <RawMaterial tkn={tkn} bgColor={theme?.palette?.customColors?.purple} fdate={fdatef} tdate={tdatef} sv={sv} RMData={RMData} />
            </Grid>
        <Grid item xs={12} md={6} lg={6}><HeaderOfCard headerName="QUALTIY CONTROL" bgColor={'#7d5ae773'} /></Grid>
        { !isMaxWidth900px && <Grid item xs={12} md={6} lg={6}><HeaderOfCard headerName="PRODUCT DEVELOPMENT" bgColor={'#7d5ae773'} /></Grid>}
        
        <Grid item xs={12} md={6} lg={6}>
            <QualityControl tkn={tkn} bgColor={theme?.palette?.customColors?.purple} fdate={fdatef} tdate={tdatef} QCData={QCData}  />
        </Grid>
        { isMaxWidth900px && <Grid item xs={12} md={6} lg={6}><HeaderOfCard headerName="PRODUCT DEVELOPMENT" bgColor={'#7d5ae773'} /></Grid>}
        <Grid item xs={12} md={6} lg={6}>
            <ProductDevelopment tkn={tkn} bgColor={theme?.palette?.customColors?.purple} fdate={fdatef} tdate={tdatef} PDData={PDData} />
        </Grid></>}
        
        
        { !isMaxWidth1700px && <><Grid item xs={12} md={12} lg={12}><HeaderOfCard headerName="SALES & MARKETING" bgColor={'#7d5ae773'} /></Grid>
        <Grid item xs={12} md={6} lg={2}>
            <SalesNMarketing2 tkn={tkn}  bgColor={theme?.palette?.customColors?.purple}  fdate={fdatef} tdate={tdatef} SM2={SM2} />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
            <SalesNMarketing3 tkn={tkn} bgColor={theme?.palette?.customColors?.purple}  fdate={fdatef} tdate={tdatef} SM3={SM3}  />
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
            <SalesNMarketing1 tkn={tkn} bgColor={theme?.palette?.customColors?.purple} fdate={fdatef} tdate={tdatef} SM1={SM1} />
        </Grid></>}
        
        { isMaxWidth1700px && <><Grid item xs={12} md={12} lg={12}><HeaderOfCard headerName="SALES & MARKETING" bgColor={'#7d5ae773'} /></Grid>
        <Grid item xs={12} md={6} lg={6}>
            <SalesNMarketing2 tkn={tkn}  bgColor={theme?.palette?.customColors?.purple}  fdate={fdatef} tdate={tdatef} SM2={SM2} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
            <SalesNMarketing3 tkn={tkn} bgColor={theme?.palette?.customColors?.purple}  fdate={fdatef} tdate={tdatef} SM3={SM3}  />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
            <SalesNMarketing1 tkn={tkn} bgColor={theme?.palette?.customColors?.purple}  fdate={fdatef} tdate={tdatef} SM1={SM1} />
        </Grid></>}
        
        <Grid item xs={12} md={12} lg={12}><HeaderOfCard headerName="MANUFACTURING" bgColor={'#7d5ae773'} /></Grid>
        <Grid item xs={12} md={12} lg={12}>
            <Manufacturing tkn={tkn}  bgColor={theme?.palette?.customColors?.purple} fdate={fdatef} tdate={tdatef} sv={sv} MFGData={MFGData} columns={columns} />
        </Grid>
        </>}
    </Grid>
    </>
  )
}
export default KPIAnalytics;