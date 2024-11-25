import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import "./kpianalytics.css"
import AccountNHR from './components/AccountNHR';
import SalesNMarketing1 from './components/SalesNMarketing1';
import QualityControl from './components/QualityControl';
import Manufacturing from './components/Manufacturing';
import RawMaterial from './components/RawMaterial';
import { fetchDashboardData } from '../GlobalFunctions';
import ProductDevelopment from './components/ProductDevelopment';
import SalesNMarketing2 from './components/SalesNMarketing2';
import HeaderOfCard from './components/HeaderOfCard';
import CardSnippet from './../@core/components/card-snippet/index';
import PickersRange from './../@core/components/pickersComponent/PickersRange';
import * as source from '../@core/components/pickersComponent/PickersSourceCode.js';

const KPIAnalytics = ({tkn}) => {
    const [manufacturingData, setManufacturingData] = useState([]);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme?.breakpoints?.down('sm'));
    const isMaxWidth12010px = useMediaQuery('(max-width:1210px)');
    const isMaxWidth1700px = useMediaQuery('(max-width:1700px)');
    const isMaxWidth900px = useMediaQuery('(max-width:899px)');
    const [popperPlacement, setPopperPlacement] = useState('bottom-start');

    useEffect(() => {

        const fetchData = async () => {
            try {
      
              // Fetch MonthWiseSaleAmount data
              let MetalTypeColorWiseSale = await fetchDashboardData(tkn, "MetalTypeColorWiseSale");
              
              const marr = [
                {
                    id:1,
                    kpi:'Production(gm)',
                    m_1:77.87,
                    m_2:447.10,
                    m_3:468.18,
                    // m_4:471.84,

                },
                {
                    id:2,
                    kpi:'Jobs',
                    m_1:234,
                    m_2:345,
                    m_3:654,
                    // m_4:785,

                },
                {
                    id:3,
                    kpi:'Labour Amount',
                    m_1:46946,
                    m_2:25342,
                    m_3:65465,
                    // m_4:78513,

                },
                {
                    id:4,
                    kpi:'Gross Loss (%)',
                    m_1:'19%',
                    m_2:'28%',
                    m_3:'25%',
                    // m_4:'23%',

                },
                {
                    id:5,
                    kpi:'Rejection (%)',
                    m_1:'58%',
                    m_2:'31%',
                    m_3:'45%',
                    // m_4:'27%',

                },
              ]
              
              setManufacturingData(marr);
      
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };
        
          fetchData(); 

    },[]);

    const data = [
        {
            heading:'Payment Collection',
            totalValue:'85',
            series:[],
            subheading:'Account & HR'
        },
        {
            heading:'Revenue Per Employees',
            totalValue:'59,499',
            series:[],
            subheading:'Account & HR'
        },
        {
            heading:'OrderDue Payment',
            totalValue:'-25',
            series:[],
            subheading:'Account & HR'
        }
    ] 
    const data2 = [
        {
            heading:'Inventory Turn Over Ratio',
            totalValue:'2.77%',
            series:[],
            subheading:'Account & HR'
        },
        {
            heading:'Levarage Ratio',
            totalValue:'2%',
            series:[],
            subheading:'Account & HR'
        },
        {
            heading:'Labour vs Exp',
            totalValue:'6.31%',
            series:[],
            subheading:'Account & HR'
        }
    ] ;
    const data3 = [
        {
            heading:'Total Order',
            totalValue:'175',
            series:[],
            subheading:'Sales & Marketing'
        },
        {
            heading:'Avg. Order Size',
            totalValue:'22',
            series:[],
            subheading:'Sales & Marketing'
        },
        {
            heading:'Lead Time',
            totalValue:'6 ',
            series:[],
            subheading:'Sales & Marketing'
        },
        {
            heading:'Delay Time',
            totalValue:'5',
            series:[],
            subheading:'Sales & Marketing'
        },
        {
            heading:'Avg Labour',
            totalValue:'1475',
            series:[],
            subheading:'Sales & Marketing'
        },
        {
            heading:'Sales Return (%)',
            totalValue:'6.79%',
            series:[],
            subheading:'Sales & Marketing'
        },
        {
            heading:'Sales Book Jobs',
            totalValue:'55',
            series:[],
            subheading:'Sales & Marketing'
        },
        {
            heading:'Inventory Turn Over (%)',
            totalValue:'4%',
            series:[],
            subheading:'Sales & Marketing'
        },
    ] ;
    const data4 = [
        {
          Locker: 'Total Sale(Net)',
          SaleAmount:100,
        },
        {
          Locker: 'Gold Amount',
          SaleAmount:100,
        },
        {
          Locker: 'Diamond Amount',
          SaleAmount:100,
        },
        {
          Locker: 'Colour Stone Amount',
          SaleAmount:100,
        },
        {
          Locker: 'Labour Amount',
          SaleAmount:100,
        }
    ];
    const data5 = [
        {
          Locker: 'Customer-Corporate',
          SaleAmount:24000,
        },
        {
          Locker: 'Customer-Expert',
          SaleAmount:100,
        },
        {
          Locker: 'Customer-Retailer',
          SaleAmount:100,
        },
        {
          Locker: 'Customer-Wholesaler',
          SaleAmount:100,
        },
        {
          Locker: 'Customer-Retail',
          SaleAmount:100,
        }
    ]
    
  return (
    <>
    <Grid container spacing={1} sx={{marginBottom:'3rem', padding: isSmallScreen ? '1rem' : '1rem', width:'95%', margin:'0 auto' }}>
        {/* <Grid container justifyContent={'flex-end'}> */}
            <Box className='fs_analytics_l ' style={{width:'100%', display:'flex', justifyContent:'flex-end'}}> 
                <Box className='fs_analytics_l dp_cmp'  style={{  marginBottom:'3px', padding:'0px', width:'18%'}}>
                    <CardSnippet
                        title='Date Range Pickers'
                        code={{ tsx: null, jsx: source?.PickersRangeJSXCode }}
                        className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}}
                    >
                        <PickersRange popperPlacement={popperPlacement} />
                    </CardSnippet>
                </Box>
            </Box>
        {/* </Grid> */}
        <Grid item xs={12}><HeaderOfCard headerName="ACCOUNT & HR" bgColor={'grey'} /></Grid>
            {[...data, ...data2]?.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                <AccountNHR tkn={tkn} data={item} bgColor={theme?.palette?.primary?.main} /> {/* Passing each item as a separate prop */}
                </Grid>
            ))}
            {/* {data2?.map((item, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                <AccountNHR tkn={tkn} data={item} bgColor={theme?.palette?.primary?.main} /> 
                </Grid>
            ))} */}
        { !isMaxWidth12010px && <><Grid item xs={12} md={4} lg={6}><HeaderOfCard headerName="RAW MATERIAL" bgColor={'grey'} /></Grid>
        <Grid item xs={12} md={4} lg={3}><HeaderOfCard headerName="QUALTIY CONTROL" bgColor={'grey'} /></Grid>
        <Grid item xs={12} md={4} lg={3}><HeaderOfCard headerName="PRODUCT DEVELOPMENT" bgColor={'grey'} /></Grid>
        <Grid item xs={12} md={6} lg={6}>
            <RawMaterial tkn={tkn} bgColor={theme?.palette?.primary?.main} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
            <QualityControl tkn={tkn} bgColor={theme?.palette?.primary?.main} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
            <ProductDevelopment tkn={tkn} bgColor={theme?.palette?.primary?.main} />
        </Grid></>}
        { isMaxWidth12010px && <>
        <Grid item xs={12} ><HeaderOfCard headerName="RAW MATERIAL" bgColor={'grey'} /></Grid>
            <Grid item xs={12} md={12} lg={12}>
                <RawMaterial tkn={tkn} bgColor={theme?.palette?.primary?.main} />
            </Grid>
        <Grid item xs={12} md={6} lg={6}><HeaderOfCard headerName="QUALTIY CONTROL" bgColor={'grey'} /></Grid>
        { !isMaxWidth900px && <Grid item xs={12} md={6} lg={6}><HeaderOfCard headerName="PRODUCT DEVELOPMENT" bgColor={'grey'} /></Grid>}
        
        <Grid item xs={12} md={6} lg={6}>
            <QualityControl tkn={tkn} bgColor={theme?.palette?.primary?.main} />
        </Grid>
        { isMaxWidth900px && <Grid item xs={12} md={6} lg={6}><HeaderOfCard headerName="PRODUCT DEVELOPMENT" bgColor={'grey'} /></Grid>}
        <Grid item xs={12} md={6} lg={6}>
            <ProductDevelopment tkn={tkn} bgColor={theme?.palette?.primary?.main} />
        </Grid></>}
        
        
        { !isMaxWidth1700px && <><Grid item xs={12} md={12} lg={12}><HeaderOfCard headerName="SALES & MARKETING" bgColor={'grey'} /></Grid>
        <Grid item xs={12} md={6} lg={2}>
            <SalesNMarketing2 tkn={tkn}  bgColor={theme?.palette?.primary?.main} data4={data4} />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
            <SalesNMarketing2 tkn={tkn} bgColor={theme?.palette?.primary?.main} data4={data5} />
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
            <SalesNMarketing1 tkn={tkn} bgColor={theme?.palette?.primary?.main} />
        </Grid></>}
        { isMaxWidth1700px && <><Grid item xs={12} md={12} lg={12}><HeaderOfCard headerName="SALES & MARKETING" bgColor={'grey'} /></Grid>
        <Grid item xs={12} md={6} lg={6}>
            <SalesNMarketing2 tkn={tkn}  bgColor={theme?.palette?.primary?.main} data4={data4} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
            <SalesNMarketing2 tkn={tkn} bgColor={theme?.palette?.primary?.main} data4={data5} />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
            <SalesNMarketing1 tkn={tkn} bgColor={theme?.palette?.primary?.main} />
        </Grid></>}
        
        <Grid item xs={12} md={12} lg={12}><HeaderOfCard headerName="MANUFACTURING" bgColor={'grey'} /></Grid>
        <Grid item xs={12} md={12} lg={12}>
            <Manufacturing tkn={tkn} manufacturingData={manufacturingData} bgColor={theme?.palette?.primary?.main} />
        </Grid>
        {/* {data3?.map((item, index) => (
                <Grid item xs={12} md={6} lg={2} key={index}>
                    <SalesNMarketing1 tkn={tkn} data={item} /> 
                </Grid>
            ))} */}
    </Grid>
    </>
  )
}
export default KPIAnalytics;