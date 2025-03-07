import React, { useRef, useState } from "react";
import "./mrpbill.css";
import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import img from "../../assets/img/default.png";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import scanImg from "../../assets/img/scanimg.gif";
import qrImg from "../../assets/img/Qrcode.png";
import f2Img from "../../assets/img/f2.gif";
import { handleImageError } from "./MRPGlobalFunctions";
import { useLocation } from "react-router-dom";
// import { Html5Qrcode } from "html5-qrcode";
// import QRreader from "./QRBarcodeReader";
import { Box, CircularProgress, TextField } from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
// import ScanWithDevice from "./ScanWithDevice";
// import useBarcodeScanner from "./useBarcodeScanner";
// import { scannedValue } from './../../recoil/atom';
// import { useRecoilValue, useSetRecoilState } from "recoil";
import { Helmet } from "react-helmet-async";
import moment from "moment/moment";

const ConfirmDialog = ({ open, onClose, onConfirm  }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%'}}>Generate Bill</DialogTitle>
    <DialogContent>
      <Typography variant="body1">Are you sure you want to proceed ?</Typography>
    </DialogContent>
    <DialogActions style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%'}}>
      <Button onClick={onConfirm}  variant="contained" color="success">
        Confirm
      </Button>
      <Button onClick={onClose} variant="contained" color="error">
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);
// const SaveBillButton = () => {
//   const [open, setOpen] = useState(false);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleConfirm = () => {
//     // Add logic for what should happen when confirmed
//     setOpen(false);
//   };


const MRPBill = () => {
  const [searchVal, setSearchVal] = useState("");
  const [selectVal, setSelectVal] = useState("");
  const [selectLocker, setSelectLocker] = useState("");
  const [selectBook, setSelectBook] = useState("");
  const [jobnoVal, setJobnoVal] = useState("");
  const [isJobPresent, setIsJobPresent] = useState(false);

  const [customerEnteredDate, setCustomerEnterDate] = useState('');
  const [customerEnteredDateError, setCustomerEnteredDateError] = useState('');
  const [customerEnteredRemark, setCustomerEnteredRemark] = useState('');
  const [customerEnteredRemarkError, setCustomerEnteredRemarkError] = useState('');
  const [dateRemarkFlag, setDateRemarkFlag] = useState(false);

  const [currencyData, setCurrencyData] = useState([]);
  const [lockerData, setLockerData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [bookData, setBookData] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  
  const [jobDetail, setJobDetail] = useState(null);
  const [msg, setMsg] = useState('');
  const [addnew, setAddNew] = useState('');
  const [custSearch, setSearchCust] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [custId, setCustID] = useState('');
  const [currencyId, setCurrencyID] = useState('');
  const [currencyRate, setCurrencyRate] = useState('');
  const [lockerId, setLockerId] = useState('');
  const [bookId, setBookId] = useState('');

  const [jobList, setJobList] = useState([]);

  const [billNo, setBillNo] = useState(0);
  const [billSavedFlag, setBillSavedFlag] = useState(false);
  
  const [custErrorMsg, setCustErrorMsg] = useState('');
  const [lockerErrorMsg, setLockerErrorMsg] = useState('');
  const [currErrorMsg, setCurrErrorMsg] = useState('');
  const [bookErrorMsg, setBookErrorMsg] = useState('');

  const [disableSelect, setDisableSelect] = useState(false);
  const [disableSelect2, setDisableSelect2] = useState(false);
  const [disableSelect3, setDisableSelect3] = useState(false);
  const [disableSelect4, setDisableSelect4] = useState(false);

  const [editableFlag, setEditTableFlag] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(true);

  const [inpAutoFocus, setInpAutoFocus] = useState(true);

  //scan

  // const scanValue = useRecoilValue(scannedValue);
  // const setScanValue = useSetRecoilState(scannedValue);

  const [scanFlag, setScanFlag] = useState(true);
  const [scannedValue, setScannedValue] = useState('');
  // const [scanFlagError, setScanFlagError] = useState(false);
  // const [scanning, setScanning] = useState(false);
  // const [errorMsg, setErrorMsg] = useState('');
  // const scannerRef = useRef(null);
  // const [scanCompFlag, setScanCompFlag] = useState(false);

  const [printUrl, setPrintUrl] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [disableInp, setDisableInp] = useState(false);

  
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState('');

  const [scanOff, setScanOff] = useState(false);
  const [jobNoFocus, setJobNoFocus] = useState(true);
  const [noJobAdd, setNoJobAdd] = useState(false);
  const [custFocus, setCustFocus] = useState(true);
  

  const location = useLocation();
  const queryParam = location?.search;
  const params = new URLSearchParams(queryParam);

  const inputRef = useRef(null); 
  const custRef = useRef(null); 

  const [url, setUrl] = useState('');

  // Extract specific parameters
  const tkn = params.get('tkn');
  const pid = params.get('pid');
  const cid = params.get('cid');
  const luid = (params?.get('LUId') === null || params?.get('LUId') === undefined) ? '' : atob(params.get('LUId'));
  const lid = (params?.get('LId') === null || params?.get('LId') === undefined) ? '' : atob(params.get('LId'));
  const sid = params?.get("serverid");
  //api calling for dropdowns
  useEffect(() => {
    let url = '';
    if(window.location?.hostname?.toLowerCase() === 'zen' || window.location?.hostname?.toLowerCase() === 'localhost'){
      setUrl('http://zen/jo/api-lib/App/API_MRPBill');
      url = 'http://zen/jo/api-lib/App/API_MRPBill';
    }else{
      setUrl('https://view.optigoapps.com/linkedapp/App/API_MRPBill');
      url = 'https://view.optigoapps.com/linkedapp/App/API_MRPBill';
    }
    fetchMRPData(url);

  }, []);

  //getting intial main data from api
  const fetchMRPData = async (url) => {

    try {
      // const url = "http://zen/jo/api-lib/App/API_MRPBill";
      const token = `${atob(tkn)}`;
      // Utility function for API requests
      const fetchData = async (mode, setData, args) => {
        const body = JSON.stringify({
          Token: token,
          ReqData: `[{"Token":"${token}","Mode":"${mode}"}]`,
        });
        const response = await axios.post(url, body);
        if (response?.status === 200 && response?.data?.Status === '200') {
          if (response?.data?.Data?.DT?.length > 0) {
            setData(response?.data?.Data?.DT);

            response?.data?.Data?.DT?.forEach((e) => {
              if (e?.IsDefault === 1) {
                switch (args) {
                  case 'locker':
                    setLockerId(e?.id);
                    setSelectLocker(e?.Lockername);
                    setTimeout(() => {
                      setLockerId(e?.id);
                      setSelectLocker(e?.Lockername);
                    },0)
                    break;
                  case 'currency':
                    setCurrencyID(e?.id);
                    setSelectVal(e?.Currencycode);
                    setTimeout(() => {
                      setCurrencyID(e?.id);
                      setSelectVal(e?.Currencycode);
                    },0)
                    break;
                  case 'book':
                    setBookId(e?.id);
                    setSelectBook(e?.id);
                    setTimeout(() => {
                      setBookId(e?.id);
                      setSelectBook(e?.id);
                    },0)
                    break;
                  default:
                    break;
                }
              }
            });
         
        

          } else {
            setData([]);
            console.log(response?.data?.Data);
          }
        } else {
          console.log("Some Error Occurred");
        }
      };
  
      // Fetch locker data
      await fetchData("GetLocker", setLockerData, 'locker');
  
      // Fetch currency data
      await fetchData("GetCurrency", setCurrencyData, 'currency');
  
      // Fetch customer data
      await fetchData("GetCustomer", setCustomerData, 'customer');

      // Fetch customer data
      await fetchData("GetBook", setBookData, 'book');
  
    } catch (error) {
      console.log("An error occurred while fetching data:", error);
      toast.error("Some Error Occurred");
    }

  };

  //currency logic
  const handleCurrencyChange = (e) => {
    setSelectVal(e.target.value);
    setCurrErrorMsg('');
    const selectedOption = e.target.options[e.target.selectedIndex];
    const currencyRate = selectedOption.getAttribute('data-curr_Rate');
    const currencyId = selectedOption.getAttribute('data-currId');
    setCurrencyRate(currencyRate);
    setCurrencyID(currencyId);
    setJobnoVal('');
    setDisableInp(false);
  }

  //locker logic
  const handleLockerChange = (e) => {
    setSelectLocker(e.target.value);
    const selectedOption = e.target.options[e.target.selectedIndex];
    const lockerId = selectedOption.getAttribute('data-lockId');
    setLockerId(lockerId);
    setLockerErrorMsg('');
    setJobnoVal('');
    setDisableInp(false);
  }

  //job no input field on change logic
  const handleJobNoChange = (e) => {
    setJobnoVal(e.target.value);
    setMsg('');
    setScanFlag(false);

  }
  const handleKeyDownEnter = (e) => {
    if(searchVal !== ''){
      if (e.key === 'Enter') {
        if(lockerErrorMsg === '' && currErrorMsg === '' && jobnoVal !== ''){
          setDisableInp(true);
          handleGoClick(); // Trigger the Go button's click logic
        }
      }
    }else{
      setCustErrorMsg('Customer required');
    }
  }

  //go button logic and job api calling
  const handleGoClick = async(type) => {
    if(noJobAdd) {
      setJobnoVal('');
      setDisableInp(false);
      return
    }
    setEditTableFlag(false);
    const areAllSalePricesSet = () => {
      return jobList.every(job => job.salePrice !== '');
    };
    const isValid = checkValidation();

    let isCustValid = false;

    // if(cid === undefined){
      customerData?.forEach((e) => {
        if(e?.id === custId && e?.TypoLabel?.toLowerCase() === searchVal?.toLowerCase()){
          isCustValid = true;
          setCustErrorMsg('');
        }
      })
   if( searchVal !== ''){
    if(jobnoVal !== '' && isValid && isCustValid){

      if (jobList.length > 0 && !areAllSalePricesSet()) {
        setMsg('Please add sale price for previous jobs before adding new ones.');
        return;
      }


      try {
        // const url = "http://zen/jo/api-lib/App/API_MRPBill";
        const body = JSON.stringify({
            Token : `${atob(tkn)}`,
            ReqData:`[{\"Token\":\"${atob(tkn)}\",\"Mode\":\"GetJobDeatil\",\"STB\":\"${jobnoVal}\",\"LockerId\":\"${lockerId}\",\"CustomerId\":\"${custId}\"}]`
        })
        setIsLoading(true);
        const response = await axios.post(url, body);
        if(response?.status === 200 && response?.data?.Status === '200'){
            if(!isEmptyObject(response?.data?.Data)){
                if(response?.data?.Data?.DT?.length > 0){
                    if(jobList?.length > 0){
                         let isJobPresent = jobList?.find((al) => al?.StockBarcode === response?.data?.Data?.DT[0]?.StockBarcode);
                         let isJobPresent2 = jobList?.some((al) => al?.StockBarcode === response?.data?.Data?.DT[0]?.StockBarcode);
                         if(isJobPresent && isJobPresent2){
                          console.log('already present');
                          setMsg('Already Present');
                          setTimeout(() => {
                            setMsg('');
                          }, 2000);
                          setTimeout(() => {
                            inputRef.current.focus();
                            setJobNoFocus(true);
                          }, 0);
                          inputRef.current.focus();
                          setJobnoVal('');

                          setJobDetail([]);
                          setIsLoading(false);
                          setDisableSelect(true);
                          setDisableSelect2(true);
                          setDisableSelect3(true);
                          setDisableSelect4(true);
                          setDisableInp(false);
                         }else{
                          setJobDetail(response?.data?.Data?.DT)
                          let newobj = {...response?.data?.Data?.DT[0]};
                          newobj.salePrice = '';
                          setJobList((prev) => [...prev, newobj]);
                          setDisableSelect(true);
                          setDisableSelect2(true);
                          setDisableSelect3(true);
                          setDisableSelect4(true);
                          setMsg('')
                          setJobnoVal('');
                          setIsJobPresent(false);
                          setIsLoading(false);
                          setDisableInp(false);
                         }
                    }else{
                      setJobDetail(response?.data?.Data?.DT)
                      let newobj = {...response?.data?.Data?.DT[0]};
                      newobj.salePrice = '';
                      
                      setJobList((prev) => [...prev, newobj]);
                      setMsg('')
                      setJobnoVal('');
                      setIsJobPresent(false);
                      setDisableSelect(true);
                      setDisableSelect2(true);
                      setDisableSelect3(true);
                      setDisableSelect4(true);
                      setIsLoading(false);
                      setDisableInp(false);

                    }
                }else{
                    setJobDetail([]);
                    console.log(response?.data?.Data?.DT);
                    setMsg('')
                    setIsJobPresent(false);
                    setIsLoading(false);
                    setDisableInp(false);
                }
            }else{
                console.log(response?.data?.Data);
                setIsJobPresent(false);
                setIsLoading(false);
                setDisableInp(false);
            }
        }else{
            console.log(response?.data?.Data);
            setMsg('Invalid Job');
            setTimeout(() => {
              setMsg('');
              inputRef.current.focus();
              setScanFlag(true);
              setJobnoVal('');
            },3000)  
            setIsJobPresent(false);
            setIsLoading(false);
            setDisableInp(false);
        }

      } catch (error) {
        console.log(error);
        toast.error('Some Error Occured');
        setIsLoading(false);
        setDisableInp(false);
      }

    }
   }else{
      setCustErrorMsg('Customer required');
      setDisableInp(false);
   }
  }
  const isEmptyObject = (obj) => Object.keys(obj).length === 0;

  //add new button logic
  const handleAddNew = (obj) => {
      let newobj = {...obj};
      newobj.salePrice = Number(addnew);

      setJobList((prev) => [...prev, newobj]);
      setAddNew('');
      setJobnoVal('');
      setIsJobPresent(false);

  }
  //input field of add new event logic
  const handleAddNewChange = (e) => {
    setAddNew(e.target.value);
  }

  //update price and changes in price logic
  const handlePriceChange = (event, obj) => {

    const newPrice = event?.target?.value?.replace(/,/g, ""); // Remove commas for easier processing
    setDisableInp(false);
    setMsg('');
    if (!isNaN(newPrice)) {

        const updatedJl = jobList.map(item => 
            item.StockBarcode === obj.StockBarcode
                ? { ...item, salePrice: parseFloat(newPrice) }
                : item
        );

        setJobList(updatedJl);

    }
    if(scanFlag){
      setTimeout(() => {
        inputRef.current?.focus();
      }, 1000);
    }
  };

  //job delete logic1/268373

  const handleJobDelete = (obj) => {

    if(deleteFlag){

      const updatedJL = jobList?.filter((e) => e?.StockBarcode !== obj?.StockBarcode)
      setJobList(updatedJL);
      if(updatedJL?.length === 0){
        setDisableSelect(false);
      }
      setMsg('');
      inputRef.current.focus();
      setJobnoVal('');
    }
        // setTimeout(() => {
        //   setMsg('');
        //   inputRef.current.focus();
        //   setJobnoVal('');
        // },0) 
  }

  //customer logic
  const handleSelectCustomer = (customer) => {

    setCustID(customer?.id);

    // setSearchCust(customer?.userid);
    // setSearchVal(customer?.userid);
    setSearchCust(customer?.TypoLabel);
    setSearchVal(customer?.TypoLabel);

    setFilteredCustomers([]); // Clear suggestions after selection

    setSelectedIndex(-1);
    setCustErrorMsg('');
    setJobnoVal('');
    setInpAutoFocus(true);
    inputRef.current?.focus();
    setScanFlag(true);
    
  };
  const handleSearchCustomer = (val) => {
    setInpAutoFocus(true);
    setJobnoVal('');
    let searchValue = val?.toLowerCase();
    setSearchCust(val);
    setSearchVal(val);
    if (searchValue) {
      const filtered = customerData?.filter(customer =>
        customer?.TypoLabel?.toLowerCase()?.includes(searchValue?.toLowerCase())
      );
      setFilteredCustomers(filtered);
      if (filtered?.length === 1 && filtered[0]?.TypoLabel?.toLowerCase() === searchValue?.toLowerCase()) {
        setSearchCust(filtered[0]?.TypoLabel);
        setSearchVal(filtered[0]?.TypoLabel);
        inputRef.current?.focus();
        setCustID(filtered[0]?.id);
        setFilteredCustomers([]); // Hide the dropdown
      }
    }
    // else if(searchVal){
    //   if (searchValue) {
    //     // Split the search value into separate words
    //     const searchWords = searchValue?.split(" ")?.filter(word => word);
    
    //     const filtered = customerData?.filter(customer => {
    //       const customerName = customer?.TypoLabel?.toLowerCase();
    
    //       // Check if all search words are present in the customer name in order
    //       return searchWords?.every((word, index) => {
    //         const wordIndex = customerName.indexOf(word);
    //         if (wordIndex === -1) return false;
    
    //         // Remove the found word and the preceding part for the next word search
    //         customerName = customerName?.slice(wordIndex + word.length);
    //         return true;
    //       });
    //     });
    
    //     setFilteredCustomers(filtered);
    //   }
    // } 
    else {
      setFilteredCustomers([]);
    }
    setCustErrorMsg('');
    setInpAutoFocus(true);
  }
  const handleSelectBlur = () => {
      setTimeout(() => {
        setFilteredCustomers([]);
        setSelectedIndex(-1);
      }, 1000)  
      setInpAutoFocus(true);
      setJobnoVal('');
  }
  const handleKeyDown = (e) => {
    setJobnoVal('');
    if(selectedIndex < filteredCustomers?.length){

      if(e.key === 'ArrowUp' && selectedIndex > 0){
        setSelectedIndex(prev => prev - 1)
    }
    else if(e.key === 'ArrowDown' && selectedIndex < filteredCustomers?.length - 1){
      setSelectedIndex(prev => prev + 1)
    }
    else if(e.key?.toLowerCase() === 'enter' || e.key?.toLowerCase() === 'tab' && selectedIndex >= 0){
      setSearchCust(filteredCustomers[selectedIndex]?.TypoLabel);
      setSearchVal(filteredCustomers[selectedIndex]?.TypoLabel);
      setCustID(filteredCustomers[selectedIndex]?.id);
      setFilteredCustomers([]);
      inputRef.current?.focus();
      setTimeout(() => {
        inputRef.current?.focus();
        setScanFlag(true);
      },10);
    }


        // Scroll the selected item into view
        setTimeout(() => {
          const element = document.querySelector(".search_sug_line.active");
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
            });
          }
        }, 0);

        setCustErrorMsg('');

  }else{
    setCustErrorMsg('');
    setSelectedIndex(-1);
  }
  setInpAutoFocus(true);
  }
  //book change logic
  const handleBookChange = (e) => {
      setBookErrorMsg('');
      setSelectBook(e.target.value);
      setBookId(e.target.value)
      setJobnoVal('');
      setDisableInp(false);
  }

  //save bill logic
  const saveMRP = async(args) => {
    let IsForEst = 0;
    if(args === 'bill'){
      IsForEst = 0;
    }
    if(args === 'estimate'){
      IsForEst = 1;
    }
    const isValid = checkValidation();
    let is_valid = true;
    if (!customerEnteredDate) {
      setCustomerEnteredDateError('Date is required');
      is_valid = false;
    } else {
      setCustomerEnteredDateError('');
    }
    if (!customerEnteredRemark) {
      setCustomerEnteredRemarkError('Remark is required');
      is_valid = false;
    } else {
      setCustomerEnteredRemarkError('');
    }
    // const enterDate = new Date(custEnteredDate)?.toDateString();
    // const enterDate = new Date(customerEnteredDate)?.toLocaleDateString();
    // const enterDateDay = new Date(customerEnteredDate)?.getDate();
    // const enterDateMonth = new Date(customerEnteredDate)?.getMonth();
    // const enterDateYear = new Date(customerEnteredDate)?.getFullYear();
    // // console.log(enterDateDay, enterDateMonth, enterDateYear);


    const formatedDate = moment(customerEnteredDate).format('l'); 
    const formatedRemark = customerEnteredRemark?.slice(0, 500);

    if (!isValid && !is_valid) {
      return; // Stop execution if validation fails
    }
    if(jobList?.length > 0){
      let isEveryNot0 = jobList?.every((e) => e?.salePrice !== 0 || e?.salePrice !== '' || e?.salePrice !== null);
      if(isEveryNot0){

        const bill_detail = jobList?.map((e) => {
        
          return { STB: e?.StockBarcode, MRP: Number(e?.salePrice) };
        })
        
        const body = {
          "Token" : `${atob(tkn)}`,"ReqData":`[{\"Token\":\"${atob(tkn)}\",\"Mode\":\"BillSave\",\"CustomerId\":\"${custId}\",\"LockerId\":\"${lockerId}\",\"BookId\":\"${bookId}\",\"CurrencyId\":\"${currencyId}\",\"CurrencyRate\":\"${currencyRate}\",\"IsForEst\":\"${IsForEst}\",\"loginid\":\"${lid}\",\"userid\":\"${luid}\",\"date\":\"${formatedDate}\",\"remark\":\"${formatedRemark}\",\"BillDetail\":${JSON.stringify(bill_detail)}}]`
        }
        try {
        // let live_url = 'https://view.optigoapps.com/linkedapp/App/API_MRPBill';
        // let zen_url = 'http://zen/jo/api-lib/App/API_MRPBill';
        
        setIsLoading(true);
        const response = await axios.post(url, body);
        if(response?.status === 200 && response?.data?.Status === '200'){
          setBillNo(response?.data?.Data?.DT[0]?.BillNo);
          setPrintUrl(atob(response?.data?.Data?.DT[0]?.PrintUrl));
          setBillSavedFlag(true);
          setTimeout(() => {
            setDisableInp(true);
          },0)  
          setIsLoading(false);
        }else{
          toast.error("Some Error Occured");
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        toast.error('Some Error Occured');
      }
      }
    }
  }
  const checkValidation = () => {
    let isValid = true;

    if (!custId && searchVal !== '') {
      setCustErrorMsg('Customer is required');
      isValid = false;
    } else {
      setCustErrorMsg('');
    }

    if (!lockerId) {
      setLockerErrorMsg('Locker is required');
      isValid = false;
    } else {
      setLockerErrorMsg('');
    }

    if (!currencyId) {
      setCurrErrorMsg('Currency is required');
      isValid = false;
    } else {
      setCurrErrorMsg('');
    }

    if (!bookId) {
      setBookErrorMsg('Book is required');
      isValid = false;
    } else {
      setBookErrorMsg('');
    }

    // if (!customerEnteredDate) {
    //   setCustomerEnteredDateError('Date is required');
    //   isValid = false;
    // } else {
    //   setCustomerEnteredDateError('');
    // }
    // if (!customerEnteredRemark) {
    //   setCustomerEnteredRemarkError('Remark is required');
    //   isValid = false;
    // } else {
    //   setCustomerEnteredRemarkError('');
    // }

    return isValid;
  };

  //next bill button logic
  const saveNextBill = () => {

    setJobDetail(null);
    setMsg('');
    setSearchCust('');
    setSelectedIndex(-1);
    setCustID('');
    setCurrencyID('');
    setLockerId('');
    setCurrencyRate('');
    setJobList([]);
    setSearchVal('');
    setSelectVal('');
    setSelectLocker('');
    setJobnoVal('');
    setIsJobPresent(false);
    setDisableSelect(false);
    setBillSavedFlag(false);
    setDisableInp(false);
    setTimeout(() => {setDisableInp(false)},0);
    setLockerErrorMsg('');
    setCustErrorMsg('');
    setBookErrorMsg('');

    setDisableSelect2(false);
    setDisableSelect3(false);
    setDisableSelect4(false);
    custRef.current?.focus();
    setTimeout(() => {
      custRef.current?.focus();
    }, 0)
    setScanFlag(true);

    setCustomerEnteredRemarkError('');
    setCustomerEnteredDateError('');
    setCustomerEnterDate('');
    setCustomerEnteredRemark('');
    setDateRemarkFlag(false);

    setNoJobAdd(false);

  }

  //   // Handle scanning
  //   const handleScan = (decodedText, decodedResult) => {
  //     setScannedValue(decodedText);
  //     setScanning(false);
  //     stopScanning();
  //     // You can also update jobnoVal or other states as needed here
  //   };
  //   //start scan
  //   const startScanning = () => {
  //     setScanning(true);
  //     const html5QrCode = new Html5Qrcode("scanner");
  //     html5QrCode.start(
  //       { facingMode: "environment" },
  //       {
  //         fps: 10,
  //         qrbox: { width: 250, height: 250 },
  //       },
  //       handleScan,
  //       handleError
  //     ).catch((err) => {
  //       setErrorMsg('Error starting scanner: ' + err);
  //       setScanning(false);
  //     });
  //   };
  //   //stop scan
  //   const stopScanning = () => {
  //     if (scannerRef.current) {
  //       scannerRef.current.stop();
  //     }
  //   };
  
  //   //scanning error logic
  //   const handleError = (error) => {
  //     setErrorMsg('Scanning error: ' + error);
  //   };

  //   //useeffect for job scan focus
  //   useEffect(() => {
  //     if (scannerRef.current) {
  //       scannerRef.current.focus();
  //     }
  // }, [])

  // const handleOpenScanComp = () => {
  //   setScanCompFlag(true);
  // }

  //print url set up
  const handlePrintUrl = () => {
    let printUrl1 = '';
    printUrl1 = printUrl + `&srvid=${sid}`
    window.open(printUrl1, '_blank');
  }

  //customer id and value set up logic
  useEffect(() => {
    if(cid){
      customerData?.forEach((e) => {
        if(e?.id === Number(atob(cid))){
          setSearchVal(e?.TypoLabel);
          setSearchCust(e?.TypoLabel);
          setCustID(Number(atob(cid)));
          setDisableSelect(true);
        }
      })
    }
  },[cid, customerData])

  //job list variable set up of disable
  useEffect(() => {
    if(jobList?.length === 0){
      setDisableSelect(false);
      setDisableSelect2(false);
      setDisableSelect3(false);
      setDisableSelect4(false);
      setEditTableFlag(false);
    }
  },[jobList]);

  //dialog box open logic
  const handleClickOpen = (type) => {
    let is_valid = true;
    if (!customerEnteredDate) {
      setCustomerEnteredDateError('Date is required');
      is_valid = false;
    } else {
      setCustomerEnteredDateError('');
    }
    if (!customerEnteredRemark) {
      setCustomerEnteredRemarkError('Remark is required');
      is_valid = false;
    } else {
      setCustomerEnteredRemarkError('');
    }

    if(is_valid){
      setActionType(type);  // Store the action type
      setTimeout(() => {
        setActionType(type);
      },0)
      setOpen(true);
    }
  };

  //dialog box close logic
  const handleClose = () => {
    setOpen(false);
  };

  //dialog box confirm button logic
  const handleConfirm = () => {
    if (actionType === 'bill') {
      saveMRP('bill');
    } else if (actionType === 'estimate') {
      saveMRP('estimate');
    }
    setOpen(false);
  };

  //continue button logic
  const handleContinue = () => {
    setEditTableFlag(true); // Disable fields
    setScanOff(true);
    setTimeout(() => {
      inputRef.current.focus();
      setNoJobAdd(true);
      setScanFlag(false);
    },0)
    setNoJobAdd(true);
    setDisableInp(true);
    setDateRemarkFlag(true);

    setDeleteFlag(false);

  };

  //back button logic
  const handleBack = () => {
    setEditTableFlag(false); // Enable fields
    setScanOff(true); //make scan on
    setScanFlag(false);
    setNoJobAdd(false);
    setJobnoVal('');
    setDisableInp(false);
    inputRef.current.focus();
    setTimeout(() => {
      setDisableInp(false);
      inputRef.current.focus();
      setScanFlag(true);
    },10);
    setDateRemarkFlag(false);

    setDeleteFlag(true);

  };

  //focus event set up logic
  const handleScanFlagAndComp = (args) => {
  let isCustValid = false;

  // if(cid === undefined){
    customerData?.forEach((e) => {
      if(e?.id === custId && e?.TypoLabel?.toLowerCase() === searchVal?.toLowerCase()){
        isCustValid = true;
        setCustErrorMsg('');
      }
    })
  if(args === 'f2'){
    inputRef.current?.focus();
  }
  if(searchVal !== '' && isCustValid){
    setScanFlag(!scanFlag);
    setInpAutoFocus(true);
  }else{
    setCustErrorMsg('Select Valid Customer');
  }
  // setScanCompFlag(!scanCompFlag);
  }

//scan value handle scan value
useEffect(() => {
  if(scannedValue && !noJobAdd){
    // setTimeout(() => {
    //   setJobnoVal(scannedValue);
    if(!scanOff){
      handleScanJob(scannedValue); 
    }
    //   // handleKeyDownEnter();
    // },10) 

  }
}, [scannedValue]);

//handleScanJob api calling logic
const handleScanJob = async() => {

  if(!noJobAdd){
  
  try {
    const url = "http://zen/jo/api-lib/App/API_MRPBill";
    const body = JSON.stringify({
        Token : `${atob(tkn)}`,
        ReqData:`[{\"Token\":\"${atob(tkn)}\",\"Mode\":\"GetJobDeatil\",\"STB\":\"${scannedValue}\",\"LockerId\":\"${lockerId}\",\"CustomerId\":\"${custId}\"}]`
    })
    setIsLoading(true);
    const response = await axios.post(url, body);
    if(response?.status === 200 && response?.data?.Status === '200'){
      if(!isEmptyObject(response?.data?.Data)){
          if(response?.data?.Data?.DT?.length > 0){
              if(jobList?.length > 0){
                   let isJobPresent = jobList?.find((al) => al?.StockBarcode === response?.data?.Data?.DT[0]?.StockBarcode);
                   if(isJobPresent){
                    console.log('already present');
                    setMsg('Already Present');
                    setTimeout(() => {
                      setMsg('');
                    }, 2000);
                    setTimeout(() => {
                      inputRef.current.focus();
                      setJobNoFocus(true);
                    }, 0);
                    setJobnoVal('');
                    setJobNoFocus(true);
                    inputRef.current.focus();


                    setJobDetail([]);
                    setIsLoading(false);
                    setDisableSelect(true);
                    setDisableSelect2(true);
                    setDisableSelect3(true);
                    setDisableSelect4(true);
                   }else{
                    setJobDetail(response?.data?.Data?.DT)
                    let newobj = {...response?.data?.Data?.DT[0]};
                    newobj.salePrice = '';
                    setJobList((prev) => [...prev, newobj]);
                    setDisableSelect(true);
                    setDisableSelect2(true);
                    setDisableSelect3(true);
                    setDisableSelect4(true);
                    setMsg('')
                    setJobnoVal('');
                    setIsJobPresent(false);
                    setIsLoading(false);
                   }
              }else{
                setJobDetail(response?.data?.Data?.DT)
                let newobj = {...response?.data?.Data?.DT[0]};
                newobj.salePrice = '';
                setJobList((prev) => [...prev, newobj]);
                setMsg('')
                setJobnoVal('');
                setIsJobPresent(false);
                setDisableSelect(true);
                setDisableSelect2(true);
                setDisableSelect3(true);
                setDisableSelect4(true);
                setIsLoading(false);

              }
          }else{
              setJobDetail([]);
              console.log(response?.data?.Data?.DT);
              setMsg('')
              setIsJobPresent(false);
              setIsLoading(false);
          }
      }else{
          console.log(response?.data?.Data);
          setIsJobPresent(false);
          setIsLoading(false);
      }
    }else{
        console.log(response?.data?.Data);
        setTimeout(() => {
          setMsg('Scanned Job Invalid');
          inputRef.current.focus();
          setJobnoVal('');
        },3000)        
        setIsJobPresent(false);
        setIsLoading(false);
    }

  } catch (error) {
    console.log(error);
    toast.error('Some Error Occured');
    setIsLoading(false);
  }

}
}

//scanning main event
useEffect(() => {
  if(!scanOff){
  const handleScan = (event) => {
    // Capture scanned data from keyboard events
    if (event.key === 'Enter') {
      // Process scanned value here
      const value = event.target.value.trim();
      if (value) {
        if(currencyId !== '' && lockerId !== '' && custId !== '' && bookId !== ''){
        setScannedValue(value);
        event.target.value = ''; // Clear input after scan
        }
        else{
        if(custId === ''){
          setCustErrorMsg('Customer required');
          setIsLoading(false);
          setJobnoVal('');
          setDisableInp(false);
        }else{
          setCustErrorMsg('');
          setIsLoading(false);
          setJobnoVal('');
          setDisableInp(false);
        }
        if(lockerId === ''){
          setLockerErrorMsg('Locker required');
          setIsLoading(false);
          setJobnoVal('');
          setDisableInp(false);
        }else{
          setLockerErrorMsg('');
          setIsLoading(false);
          setJobnoVal('');
          setDisableInp(false);
        }
        if(currencyId === ''){
          setCurrErrorMsg('Currency required');
          setIsLoading(false);
          setJobnoVal('');
          setDisableInp(false);
        }else{
          setCurrErrorMsg('');
          setIsLoading(false);
          setJobnoVal('');
          setDisableInp(false);
        }
        if(bookId === ''){
          setBookErrorMsg('Book required');
          setIsLoading(false);
          setJobnoVal('');
          setDisableInp(false);
        }else{
          setBookErrorMsg('');
          setIsLoading(false);
          setJobnoVal('');
          setDisableInp(false);
        }
        }
      }
    }
  };
  
  // Attach event listener for scanning
  const inputElement = document?.getElementById('scanner-input');
  inputElement?.addEventListener('keydown', handleScan);
  
  setMsg('');

  // Cleanup
  return () => {
    inputElement?.removeEventListener('keydown', handleScan);
  };
}

}, [currencyId, lockerId, custId, bookId, scanOff]);
//focus true event
useEffect(() => {
  if (scanFlag) {
    setInpAutoFocus(true);
  }
}, [scanFlag]);

//F2 key event
useEffect(() => {
    const handleKeyDown = (e) => {
      if(e?.key === 'F2'){
        setScanFlag(true);
        setJobnoVal('');
        setDisableInp(false);
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
},[])

//sale price focus and key logic
const handleSalePriceKeyDown = (e) => {
    if(e?.key === 'Enter' || e?.key === 'enter'){
      inputRef.current?.focus();
      setScanFlag(true);
      setJobnoVal('');
      setJobNoFocus(true);
      setDisableInp(false);
      setMsg('');
    }else{
      setScanFlag(false);
    }
    
}
const handleSalePriceFocus = (e) => {
  setScanOff(true);
  setTimeout(() => {
    setScanOff(true);
  },10)
  inputRef.current?.blur();
}

//focus on customer at starting
useEffect(() => {
  if(custId === ''){
    setCustFocus(true);
    setTimeout(() => {
      setCustFocus(true);
      custRef.current.focus();
      setScanFlag(false);
    },20);
  }
},[]);


//customer entered date
const handleCustomerEnteredDate = (e) => {
  const custEnteredDate = e.target.value;
  setCustomerEnterDate(custEnteredDate);
  setCustomerEnteredDateError('');


  // const enterDate = new Date(custEnteredDate)?.toDateString();
  // const enterDate = new Date(custEnteredDate)?.toLocaleDateString();

  // const formatedDate = moment(custEnteredDate).format('l'); 

}
//customer entered remark
const handleCustomerEnteredRemark = (e) => {
  const custEnteredRemark = e.target.value;
  setCustomerEnteredRemark(custEnteredRemark);
  setCustomerEnteredRemarkError('');
}


  return (
    <>
      <Helmet>
        <title>MRP AND BILL</title>
      </Helmet>
            {isLoading && (
                <div className="loader-overlay">
                    <CircularProgress className='loadingBarManage' />
                </div>
            )}
      {  <div className="container_mrp">

        <div className="head_mrp">ADD MRP AND PROCCED TO BILL</div>

        <div className="p-1 px-4 d_grid min_h_92_mrp">
            <div className="grid-item pd10_mrp">
                <label className="cust_name_title pe-3" htmlFor="custtitle">
                CUSTOMER NAME
                </label>
                <input
                type="text"
                value={searchVal}
                placeholder="customer name"
                className="form-control p-2 pd5px_mrp border border-secondary"
                id="custtitle"
                onChange={(e) => handleSearchCustomer(e.target.value)}
                onBlur={() => handleSelectBlur()}
                onKeyDown={handleKeyDown}
                disabled={disableSelect}
                autoComplete="off"
                autoFocus={custFocus}
                ref={custRef}
                />
                {filteredCustomers?.length > 0 && (
        <ul className="list-group position-absolute custom_scrollbar" style={{ zIndex: 1000, width:'max-content', minWidth:'50px', maxHeight:'180px', overflowY:'scroll', minWidth:'240px' }}>
          {filteredCustomers?.map((customer, index) => (
            <li
              key={index}
              className={`list-group-item list-group-item-action li_fs_mrp p-1 ${selectedIndex === index ? "search_sug_line active" : "search_sug_line"}`}
              onClick={() => handleSelectCustomer(customer)}
            >
              {customer?.TypoLabel}
            </li>
          ))}
        </ul>
                )}
                <div className="text-danger">{custErrorMsg}</div>
            </div>
            <div className="grid-item pd10_mrp min_h_92_mrp">
                <label htmlFor="locker" className="pe-3 cust_name_title">
                LOCKER
                </label>
                <select
                name="locker"
                id="locker"
                value={selectLocker}
                className="form-select w-100 b1_9898px"
                onChange={(e) => handleLockerChange(e)}
                disabled={disableSelect2}
                >
                  <option  value="">Select</option>
                {
                    lockerData?.map((e, i) => {
                        return <option key={i} data-lockId={e?.id} value={e?.Lockername}>{e?.Lockername}</option>
                    })
                }
                </select>
                <div className="text-danger">{lockerErrorMsg}</div>
            </div>
            <div className="grid-item pd10_mrp min_h_92_mrp">
              <div className=" d-flex flex-column align-items-start ">
                
                <label htmlFor="currency" className="pe-3 cust_name_title">
                CURRENCY
                </label>
                <select
                name="currency"
                id="currency"
                value={selectVal}
                className="form-select w-100 b1_9898px"
                onChange={(e) => handleCurrencyChange(e)}
                disabled={disableSelect3}
                >
                  <option  value="">Select</option>
                {
                    currencyData?.map((e, i) => {
                        return <option key={i} value={e?.Currencycode} data-curr_Rate={e?.CurrencyRate} data-currId={e?.id} >{e?.Currencycode}</option>
                    })
                }
                </select>
                </div>
                <div className="text-danger px-1">{currErrorMsg}</div>

            </div>
            <div className="grid-item pd10_mrp min_h_92_mrp">
              <div className=" d-flex flex-column align-items-start ">
                <label htmlFor="books" className="pe-3 cust_name_title">
                BOOKS
                </label>
                <select
                name="books"
                id="books"
                value={selectBook}
                className="form-select w-100 b1_9898px"
                onChange={(e) => handleBookChange(e)}
                disabled={disableSelect4}
                >
                  <option  value="">Select</option>
                {
                    bookData?.map((e, i) => {
                        return <option key={i} value={e?.id} >{e?.BookName}</option>
                    })
                }
                </select>
              </div>
              <div className="text-danger px-1">{bookErrorMsg}</div>
            </div>
        </div>

        <div className="w-100 d-flex align-items-baseline p-2 flex_column_mrp minH_mrp mt_top_mrp_head">
          <div className="w-25 d-flex flex-column  align-items-start ps-3 w_50_mrp2 w_100_mrp_scan mt_mrp">
            <div className="scanblock_mrpbill"> {/* <img src={scanImg} alt="#scanjob" className="scanJobImg" onClick={handleOpenScanComp} /> */} 
            { scanFlag ? <> {/* <img src={scanImg} alt="#scanjob" className="scanJobImg scanJobImg2" onClick={() => handleScanFlagAndComp('scan')} /> */} 
            <div className="qrbox_mrp" >
              <img src={qrImg} alt="scanner" style={{
                height: '100%', // equivalent to h-full
                width: '100%', // equivalent to w-full
                objectFit: 'contain' // equivalent to object-contain
              }}
              onClick={() => handleScanFlagAndComp('scan')}
            />
      
      <div style={{
          position: 'absolute', // equivalent to absolute
          top: 0,
          left: 0,
          width: '100%', // equivalent to w-full
          height: '100%' // equivalent to h-full
        }}
      >
        <div
          style={{
            width: '100%', // equivalent to w-full
            height: '0.25rem', // equivalent to h-1
            backgroundColor: '#f56565', // equivalent to bg-red-500
            animation: 'scanner-line 4s infinite linear', // equivalent to animate-scanner-line
            position: 'absolute',
            top: 0
          }}
        ></div>
      </div>
    </div>
                <div className="fs_scanimg"></div></> : 
                <>
                  <img src={f2Img} alt="#scanjob" className="scanJobImg" onClick={() => handleScanFlagAndComp('f2')} />
                  <div className="fw-bold text-danger fs_scanimg d-flex justify-content-center align-items-center">Click Here For Scan</div>
                  <div className="fw-bold text-danger fs_scanimg d-flex justify-content-center align-items-center">OR Press F2 to Scan</div>
                </>}
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <input
                type="text"
                id="jobno"
                className="form-control border border-secondary"
                value={jobnoVal}
                onChange={(e) => handleJobNoChange(e)}
                onKeyDown={(e) => handleKeyDownEnter(e)}
                disabled={disableInp ? true : false}
                autoFocus={jobNoFocus}
                ref={inputRef}
                autoComplete="off"
              />
              <button className="btn_go" disabled={jobnoVal === ''} onClick={() => handleGoClick()}>GO</button>
            </div>
            <div className="text-danger px-2 msg_h_mrpbill">{msg}</div>
          </div>          
            { billSavedFlag !== true && <div className="tableDiv_mrp d-flex flex-column">
          <table className="table max_w_table">
            <thead className="table-head">
              <tr>
                <td width={90} style={{ borderRight: "1px solid #989898", backgroundColor: "#e8e8e8", }} > SrNo </td>
                <td width={90} style={{ borderRight: "1px solid #989898", backgroundColor: "#e8e8e8", }} > Image </td>
                <td width={520} style={{ borderRight: "1px solid #989898", backgroundColor: "#e8e8e8", }} > Description </td>
                <td width={120} style={{ borderRight: "1px solid #989898", backgroundColor: "#e8e8e8", }} > Sale Price </td>
                {/* <td width={90} style={{borderRight:'1px solid #989898', backgroundColor:'#e8e8e8'}}>Edit</td> */}
                <td width={90} style={{ backgroundColor: "#e8e8e8" }}> Delete </td>
              </tr>
            </thead>
            <tbody className="table-body">
              {jobList?.length > 0 ? jobList?.map((e, i) => {
                return (
                  <tr key={i}>
                    <td width={90} className="pd_0" align="center" style={{ borderRight: "1px solid #989898" }} >
                      {i+1}
                    </td>
                    <td width={90} align="center" className="pd_0" style={{ borderRight: "1px solid #989898" }} >
                      <img src={e?.DesignImage} alt="#img" className="tableImg" onError={handleImageError} />
                    </td>
                    <td width={520} style={{ borderRight: "1px solid #989898" }} className="pd_0" >
                      {e?.Description}
                    </td>
                    <td width={120} style={{ borderRight: "1px solid #989898" }}  className="pd_0">
                      <input
                        type="number"
                        value={e?.salePrice}
                        autoFocus={e?.StockBarcode === jobDetail[0]?.StockBarcode ? true : false}
                        onChange={(event) => handlePriceChange(event, e)}
                        onKeyDown={handleSalePriceKeyDown}
                        onFocus={handleSalePriceFocus}
                        style={{
                          width: "100%",
                          border: "none",
                          textAlign: "center",
                          backgroundColor: `${editableFlag ? '#E9ECEF' : "transparent"}`,
                          border:'1px solid #989898'
                        }}
                        disabled={editableFlag}
                      />
                    </td>
                    {/* <td width={90} align="center" style={{borderRight:'1px solid #989898', verticalAlign:'center'}}>
                            <EditIcon titleAccess="update" sx={{color:'grey', cursor:'pointer'}} />
                        </td> */}
                    <td width={90} align="center" className="pd_0" >
                      <DeleteIcon
                        titleAccess="delete"
                        sx={{ color: "grey", cursor: "pointer" }}
                        onClick={() => handleJobDelete(e)} 
                      />
                    </td>
                  </tr>
                );
              }) : <tr><td colSpan={5} align="center">No Data Present</td></tr>}
            </tbody>
          </table>
            
            <div style={{minHeight:'130px', maxWidth:'1000px', width:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-end'}}>
              { dateRemarkFlag && <div style={{paddingTop:'1rem', paddingBottom:'1rem', width:'100%', maxWidth:'1000px', minHeight:'72px'}}>
                <Box style={{display:'flex', alignItems:'center', padding:'0px 10px'}}>
                  <div className="date_mrp" style={{minHeight:'65px'}}>
                  <TextField
                    label="Select Date"
                    type="date"
                    InputLabelProps={{
                      shrink: true,  // This ensures that the label stays above the input field when a date is selected
                    }}
                    style={{padding:'8px !important'}}
                    value={customerEnteredDate}
                    onChange={handleCustomerEnteredDate}
                  />
                  <div className="text-danger">{customerEnteredDateError}</div>
                  </div>
                  <div className="remarkWidth_mrp" style={{minHeight:'65px'}}>
                    <TextField  placeholder="Enter Remark" style={{marginLeft:'10px', width:'100%'}} value={customerEnteredRemark} onChange={handleCustomerEnteredRemark}  />
                    <div className="px-3 text-danger">{customerEnteredRemarkError}</div>
                  </div>
                </Box>
              </div>}

              { jobList?.length !== 0 && <div className="w-100 d-flex justify-content-between align-items-center my-1" style={{ maxWidth: '1000px' }}>
                <>
                <div className="d-flex align-items-center">
                  { editableFlag ? <button className="continue_btn_bill mx-2" disabled={jobList?.length === 0 ? true : false} onClick={() => handleClickOpen('bill')}>SAVE BILL</button> : <div style={{height:'40px'}}></div>}
                  { editableFlag ? <button className="continue_btn_est mx-2" disabled={jobList?.length === 0 ? true : false}  onClick={() => handleClickOpen('estimate')}>SAVE ESTIMATE</button> : <div style={{height:'40px'}}></div>}
                </div>
                <div>

                {!editableFlag ? (
                  <button className="continue_btn_continue" onClick={handleContinue}>Continue</button>
                  ) : (
                    <button className="continue_btn_back" onClick={handleBack}>Back</button>
                    )}
                    </div>
                    </>
              </div>}
            </div>
        </div>}
        </div>

     
        { billSavedFlag !== true && <>
        <div> <ConfirmDialog open={open} onClose={handleClose} onConfirm={() => handleConfirm(actionType)} /></div>
        { jobList?.length !== 0 && <div className="d-flex justify-content-end pe-5"><a className="text-primary cursor-pointer mx-2" onClick={() => saveNextBill()}>Cancel All ?</a></div>}
        </>
        }
        <div className="d-flex flex-column justify-content-center align-items-center w-100 mb-4 pb-2">
        { billSavedFlag === true &&
        <>
          <div className="generatedBill ">Bill No : {billNo} Generated <span className="ps-1"><PrintIcon titleAccess="click here for Print" style={{cursor:'pointer'}} onClick={() => handlePrintUrl()} /></span></div>
          <button className="continue_btn_next mx-2"  onClick={(e) => saveNextBill(e, 'next')}>NEXT BILL</button>
        </>
        }
        </div>
      </div>}
      <div>
        <img 
          src="path-to-your-image.jpg" 
          alt="Scan" 
          onClick={() => document.getElementById('scanner-input').focus()} 
          style={{ cursor: 'pointer', position:'absolute', left:'-9999px' }}
        />
        <input 
          id="scanner-input"
          style={{ position: 'absolute', left: '-9999px' }} 
          // autoFocus={inpAutoFocus}
          // ref={inputRef}
        />
      </div>
    

    
    </>
  );
};

export default MRPBill;
