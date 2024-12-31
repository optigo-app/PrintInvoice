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
import {  fetchMaster, fetchSummary_Purchase, fetchSummary_SaleData, fetchVendor_In_Out_DurationData, fetchVendor_Margin_Per_CaratData } from './redux/slices/FactoryApi';

const FactoryDashBoard = ({ tkn, LId, IsEmpLogin }) => {

    const dispatch = useDispatch();
    const all = useSelector(state => state?.Master?.data);

    const theme = useTheme();

    const [fdate, setFDate] = useState(null);
    const [tdate, setTDate] = useState(null);
    const [fdatef, setFDatef] = useState("");
    const [tdatef, setTDatef] = useState("");
    const [popperPlacement, setPopperPlacement] = useState('bottom-start');

    const [currencyList, setCurrencyList] = useState([]);
    const [selectCurrency, setSelectCurrency] = useState(0);
    const [metalTypeList, setMetalTypeList] = useState([]);
    const [selectMetalType, setSelectMetalType] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [selectCategory, setSelectCategory] = useState(0);
    
    const [selectMaterial, setSelectMaterial] = useState(1);

    // useEffect(() => {
    //     const today = moment();
    
    //     const financialYearStart = moment()?.month(3)?.date(1); 
    //     const financialYearEnd = moment(financialYearStart)?.add(1, "year")?.subtract(1, "day");
    //     setFDate(financialYearStart?.toDate());
    //     setTDate(today?.isAfter(financialYearEnd) ? financialYearEnd?.toDate() : today?.toDate());
      
    //     setTimeout(() => {
    //       handleApply();
    //     },0);

    //     // dispatch(fetchSummary_Purchase(tkn, LId, IsEmpLogin, moment(financialYearStart).format("MM/DD/YYYY"), moment(financialYearEnd).format("MM/DD/YYYY")));
    //     dispatch(fetchSummary_Purchase({
    //       tkn, 
    //       LId, 
    //       IsEmpLogin, 
    //       fdate: moment(financialYearStart).format("MM/DD/YYYY"), 
    //       tdate: moment(financialYearEnd).format("MM/DD/YYYY")
    //     }));
    //     dispatch(fetchMaster({
    //       tkn, 
    //       LId, 
    //       IsEmpLogin, 
    //       fdate: moment(financialYearStart).format("MM/DD/YYYY"), 
    //       tdate: moment(financialYearEnd).format("MM/DD/YYYY")
    //     }));
    //     dispatch(fetchSummary_SaleData({
    //       tkn, 
    //       LId, 
    //       IsEmpLogin, 
    //       fdate: moment(financialYearStart).format("MM/DD/YYYY"), 
    //       tdate: moment(financialYearEnd).format("MM/DD/YYYY")
    //     }));
    //     dispatch(fetchVendor_Margin_Per_CaratData({
    //       tkn, 
    //       LId, 
    //       IsEmpLogin, 
    //       fdate: moment(financialYearStart).format("MM/DD/YYYY"), 
    //       tdate: moment(financialYearEnd).format("MM/DD/YYYY")
    //     }));
    //     dispatch(fetchVendor_In_Out_DurationData({
    //       tkn, 
    //       LId, 
    //       IsEmpLogin, 
    //       fdate: moment(financialYearStart).format("MM/DD/YYYY"), 
    //       tdate: moment(financialYearEnd).format("MM/DD/YYYY")
    //     }));
      
    //   }, []);
    
    useEffect(() => {
      const today = moment();
      const financialYearStart = moment()?.month(3)?.date(1);
      const financialYearEnd = moment(financialYearStart)?.add(1, "year")?.subtract(1, "day");
    
      setFDate(financialYearStart?.toDate());
      setTDate(today?.isAfter(financialYearEnd) ? financialYearEnd?.toDate() : today?.toDate());
    
      setTimeout(() => {
        handleApply();
      }, 0);
    
      const commonPayload = {
        tkn,
        LId,
        IsEmpLogin,
        fdate: moment(financialYearStart).format("MM/DD/YYYY"),
        tdate: moment(financialYearEnd).format("MM/DD/YYYY"),
        metalType:selectMetalType,
        category:selectCategory
      };
    
      const dispatchFunctions = [
        fetchSummary_Purchase,
        fetchMaster,
        fetchSummary_SaleData,
        fetchVendor_Margin_Per_CaratData,
        fetchVendor_In_Out_DurationData,
      ];
    
      dispatchFunctions?.forEach(fn => dispatch(fn(commonPayload)));
    }, []);
    

      const handleFDateChange = (date) => {
        setFDate(date); 
      };
    
      const handleTDateChange = (date) => {
        setTDate(date);
      };
    
    
      // const handleApply = () => {
      //   let formattedFDate;
      //   let formattedTDate;
      //   if (fdate) {
      //      formattedFDate = moment(fdate)?.format('MM/DD/YYYY');
      //     console.log('From Date (API Format):', formattedFDate);
      //     setFDatef(formattedFDate);
      //   }else{
      //     setFDatef('');
      //   }
      //   if (tdate) {
      //      formattedTDate = moment(tdate)?.format('MM/DD/YYYY');
      //     console.log('To Date (API Format):', formattedTDate);
      //     setTDatef(formattedTDate);
      //   }else{
      //     setTDatef('');  
      //   }
      //   if(formattedFDate && formattedTDate){
      //     // dispatch(fetchSummary_Purchase(tkn, LId, IsEmpLogin, formattedFDate, formattedTDate));
      //     if (formattedFDate && formattedTDate) {
      //       // dispatch(fetchSummary_Purchase({
      //       //   tkn, 
      //       //   LId, 
      //       //   IsEmpLogin, 
      //       //   fdate: formattedFDate, 
      //       //   tdate: formattedTDate
      //       // }));
      //       dispatch(fetchSummary_Purchase({
      //         tkn, 
      //         LId, 
      //         IsEmpLogin, 
      //         fdate: formattedFDate, 
      //         tdate: formattedTDate
      //       }));
      //       dispatch(fetchMaster({
      //         tkn, 
      //         LId, 
      //         IsEmpLogin, 
      //         fdate: formattedFDate, 
      //         tdate: formattedTDate
      //       }));
      //       dispatch(fetchSummary_SaleData({
      //         tkn, 
      //         LId, 
      //         IsEmpLogin, 
      //         fdate: formattedFDate, 
      //         tdate: formattedTDate
      //       }));
      //       dispatch(fetchVendor_Margin_Per_CaratData({
      //         tkn, 
      //         LId, 
      //         IsEmpLogin, 
      //         fdate: formattedFDate, 
      //         tdate: formattedTDate
      //       }));
      //       dispatch(fetchVendor_In_Out_DurationData({
      //         tkn, 
      //         LId, 
      //         IsEmpLogin, 
      //         fdate: formattedFDate, 
      //         tdate: formattedTDate
      //       }));
      //     }
      //   }

      // };
    
      const handleApply = () => {
        const formattedFDate = fdate ? moment(fdate)?.format("MM/DD/YYYY") : "";
        const formattedTDate = tdate ? moment(tdate)?.format("MM/DD/YYYY") : "";
      
        setFDatef(formattedFDate);
        setTDatef(formattedTDate);
      
        if (formattedFDate && formattedTDate) {
          const commonPayload = {
            tkn,
            LId,
            IsEmpLogin,
            fdate: formattedFDate,
            tdate: formattedTDate,
            metalType:selectMetalType,
            category:selectCategory
          };
      
          const dispatchFunctions = [
            fetchSummary_Purchase,
            fetchMaster,
            fetchSummary_SaleData,
            fetchVendor_Margin_Per_CaratData,
            fetchVendor_In_Out_DurationData,
          ];
      
          dispatchFunctions.forEach(fn => dispatch(fn(commonPayload)));
        }
      };

      useEffect(() => {
        setCurrencyList(all?.DT)
        setMetalTypeList(all?.DT1)
        setCategoryList(all?.DT2)
      },[all]);

      const materialList = [
        {
          id:1,
          name:'Diamond'
        },
        {
          id:2,
          name:'Colorstone'
        },
        {
          id:3,
          name:'Misc'
        },
      ]
      
      
      const materialListHandleChange = (e) => {
        setSelectMaterial(e.target.value);
      }
      const currencyListHandleChange = (e) => {
        setSelectCurrency(e.target.value);
      }
      const metaltypeListHandleChange = (e) => {
        setSelectMetalType(e.target.value);
      }
      const categoryListHandleChange = (e) => {
        setSelectCategory(e.target.value);
      }

  return (
    <div className='facd' style={{width:'95%', margin:'0 auto', paddingBottom:'2rem'}}>
        <Grid container spacing={2}>
            <Grid item xs={12} md={2}>
                <Card className='fs_facd bs_facd' sx={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', p:2, minHeight:'100px', display:'flex', alignItems:'center', justifyContent:'center'}}><Typography variant='h3' sx={{fontFamily:"Public Sans Light", color:theme?.palette?.customColors?.purple}}>Factory Dashboard</Typography></Card>
            </Grid>
            <Grid item xs={12} sm={12} md={10}>

                    <Card className='fs_facd bs_facd' sx={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', p:2, minHeight:'100px', display:'flex', alignItems:'flex-end'}}>
                    <div className='d-flex align-items-center'>
                      <select name="currency" id="currency" className='form-select me-2' value={selectMaterial} onChange={(e) => materialListHandleChange(e)} disabled={materialList?.length === 0} style={{minWidth:'214px'}}>
                        <option value="0">Select Material</option>
                        {
                          materialList?.map((e, i) => {
                            return <option value={e?.id} key={i}>{e?.name}</option>
                          })
                        }
                      </select>
                      <select name="currency" id="currency" className='form-select me-2' value={selectCurrency} onChange={(e) => currencyListHandleChange(e)} disabled={currencyList?.length === 0} style={{minWidth:'214px'}}>
                        <option value="0">Select Currency</option>
                        {
                          currencyList?.map((e, i) => {
                            return <option value={e?.CurrencyRate} key={i}>{e?.Currencycode}</option>
                          })
                        }
                      </select>
                      <select name="metaltype" id="metaltype" className='form-select me-2' value={selectMetalType} onChange={(e) => metaltypeListHandleChange(e)} disabled={metalTypeList?.length === 0} style={{minWidth:'214px'}}>
                        <option value="0">Select Metaltype</option>
                        {
                          metalTypeList?.map((e, i) => {
                            return <option value={e?.MetalTypeId} key={i}>{e?.MetalTypePurity}</option>
                          })
                        }
                      </select>
                      <select name="category" id="category" className='form-select me-2' value={selectCategory} onChange={(e) => categoryListHandleChange(e)} disabled={categoryList?.length === 0} style={{minWidth:'214px'}}>
                        <option value="0">Select Category</option>
                        {
                          categoryList?.map((e, i) => {
                            return <option value={e?.CategoryId} key={i}>{e?.Category}</option>
                          })
                        }
                      </select>
                    </div>
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
                <FactoryDataSummary bgColor={theme?.palette?.customColors?.purple} selectMaterial={selectMaterial} />
            </Grid>
            {/* <Grid item xs={4} sm={4} md={4} >
                <MarginCt bgColor={theme?.palette?.customColors?.purple} />
            </Grid> */}
            <Grid item xs={12} sm={12} md={4} >
                <SettingPerGram bgColor={theme?.palette?.customColors?.purple} selectMaterial={selectMaterial} />
            </Grid>
            <Grid item xs={12} sm={12} md={8} >
                <InOutDuration bgColor={theme?.palette?.customColors?.purple} selectMaterial={selectMaterial} />
            </Grid>
            <Grid item xs={12} sm={12} md={4} >
                <TotalLabour bgColor={theme?.palette?.customColors?.purple} selectMaterial={selectMaterial} />
            </Grid>
            <Grid item xs={12} sm={12} md={4} >
                <WastageWiseLabourPGram bgColor={theme?.palette?.customColors?.purple} />
            </Grid>
            <Grid item xs={12} sm={12} md={4} >
                <VendorWiseSetPGram bgColor={theme?.palette?.customColors?.purple} selectMaterial={selectMaterial} />
            </Grid>
            
        </Grid>
    </div>
  )
}

export default FactoryDashBoard;