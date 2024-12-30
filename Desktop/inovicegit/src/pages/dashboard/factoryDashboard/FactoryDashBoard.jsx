import React, { useEffect, useState } from 'react'
import "./factoryDashboard.css";
import { Box, Button, Card, Grid, Typography, useTheme } from '@mui/material';
import moment from 'moment';

import DatePicker from 'react-datepicker'

import CustomInput from '../@core/components/pickersComponent/PickersCustomInput';
import "../@core/components/pickersComponent/datepickerc.css";
import FactoryDataSummary from './components/FactoryDataSummary';
import MarginCt from './components/MarginCt';
import InOutDuration from './components/InOutDuration';
import SettingPerGram from './components/SettingPerGram';
import TotalLabour from './components/TotalLabour';
import VendorWiseSetPGram from './components/VendorWiseSetPGram';
import WastageWiseLabourPGram from './components/WastageWiseLabourPGram';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFactoryData } from './redux/slices/FactoryApi';

const FactoryDashBoard = () => {

    const dispatch = useDispatch();
    const all = useSelector(state => state);
  

    const theme = useTheme();

    const [fdate, setFDate] = useState(null);
    const [tdate, setTDate] = useState(null);
    const [fdatef, setFDatef] = useState("");
    const [tdatef, setTDatef] = useState("");
    const [popperPlacement, setPopperPlacement] = useState('bottom-start');

    useEffect(() => {
        const today = moment();
    
        const financialYearStart = moment()?.month(3)?.date(1); 
        const financialYearEnd = moment(financialYearStart)?.add(1, "year")?.subtract(1, "day");
        setFDate(financialYearStart?.toDate());
        setTDate(today?.isAfter(financialYearEnd) ? financialYearEnd?.toDate() : today?.toDate());
    
        // setTimeout(() => {
        //   handleApply();
        // },0);

        // dispatch(fetchFactoryData());
      
      }, []);
    
      const handleFDateChange = (date) => {
        setFDate(date); 
      };
    
      const handleTDateChange = (date) => {
        setTDate(date);
      };
    
    
      const handleApply = () => {
        if (fdate) {
          const formattedFDate = moment(fdate)?.format('MM/DD/YYYY');
          console.log('From Date (API Format):', formattedFDate);
          setFDatef(formattedFDate);
        }else{
          setFDatef('');
        }
        if (tdate) {
          const formattedTDate = moment(tdate)?.format('MM/DD/YYYY');
          console.log('To Date (API Format):', formattedTDate);
          setTDatef(formattedTDate);
        }else{
          setTDatef('');  
        }

        dispatch(fetchFactoryData());

      };
    

  return (
    <div className='facd' style={{width:'95%', margin:'0 auto', paddingBottom:'2rem'}}>
        <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
                <Card className='fs_facd bs_facd' sx={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', p:2, minHeight:'100px', display:'flex', alignItems:'center', justifyContent:'center'}}><Typography variant='h3' sx={{fontFamily:"Public Sans Light", color:theme?.palette?.customColors?.purple}}>Factory Dashboard</Typography></Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
                    <Card className='fs_facd bs_facd' sx={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', p:2, minHeight:'100px', display:'flex', alignItems:'flex-end'}}>
                    <div style={{display:'flex'}}>
                        <div style={{display:'flex', flexDirection:'column'}}>
                        <span className='fs_analytics_l' style={{color:theme?.palette?.customColors?.purple}}>From Date</span>
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
                        <span className='fs_analytics_l' style={{color:theme?.palette?.customColors?.purple}}>To Date</span>
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
                    <div><Button variant='contained' sx={{backgroundColor:theme?.palette?.customColors?.green}} size='large' onClick={() => handleApply()}>Apply</Button></div>
                    </Card>
            </Grid>
            <Grid item xs={12}  >
                <FactoryDataSummary bgColor={theme?.palette?.customColors?.purple} />
            </Grid>
            {/* <Grid item xs={4} sm={4} md={4} >
                <MarginCt bgColor={theme?.palette?.customColors?.purple} />
            </Grid> */}
            <Grid item xs={12} sm={12} md={4} >
                <SettingPerGram bgColor={theme?.palette?.customColors?.purple} />
            </Grid>
            <Grid item xs={12} sm={12} md={8} >
                <InOutDuration bgColor={theme?.palette?.customColors?.purple} />
            </Grid>
            <Grid item xs={12} sm={12} md={4} >
                <TotalLabour bgColor={theme?.palette?.customColors?.purple} />
            </Grid>
            <Grid item xs={12} sm={12} md={4} >
                <WastageWiseLabourPGram bgColor={theme?.palette?.customColors?.purple} />
            </Grid>
            <Grid item xs={12} sm={12} md={4} >
                <VendorWiseSetPGram bgColor={theme?.palette?.customColors?.purple} />
            </Grid>
            
        </Grid>
    </div>
  )
}

export default FactoryDashBoard;