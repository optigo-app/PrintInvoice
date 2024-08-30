import React, { useRef, useState } from "react";
import "./mrpbill.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import img from "../../assets/img/default.png";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import scanImg from "../../assets/img/scanimg.gif";
import f2Img from "../../assets/img/f2.gif";
import { handleImageError } from "./MRPGlobalFunctions";
import { useLocation } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import QRreader from "./QRBarcodeReader";
import { CircularProgress } from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import ScanWithDevice from "./ScanWithDevice";
import useBarcodeScanner from "./useBarcodeScanner";
import { scannedValue } from './../../recoil/atom';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Helmet } from "react-helmet-async";

const ConfirmDialog = ({ open, onClose, onConfirm  }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Please Confirm</DialogTitle>
    <DialogContent>
      <Typography variant="body1">Are you sure you want to proceed ?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant="contained" color="error">
        Cancel
      </Button>
      <Button onClick={onConfirm}  variant="contained" color="success">
        Confirm
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
//     console.log('User confirmed the action.');
//     setOpen(false);
//   };


const MRPBill = () => {
  const [searchVal, setSearchVal] = useState("");
  const [selectVal, setSelectVal] = useState("");
  const [selectLocker, setSelectLocker] = useState("");
  const [selectBook, setSelectBook] = useState("");
  const [jobnoVal, setJobnoVal] = useState("");
  const [isJobPresent, setIsJobPresent] = useState(false);

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

  const [disableSelect, setDisableSelect] = useState(false);
  const [disableSelect2, setDisableSelect2] = useState(false);
  const [disableSelect3, setDisableSelect3] = useState(false);
  const [disableSelect4, setDisableSelect4] = useState(false);

  const [editableFlag, setEditTableFlag] = useState(false);

  const [inpAutoFocus, setInpAutoFocus] = useState(true);

  //scan

  // const scanValue = useRecoilValue(scannedValue);
  // const setScanValue = useSetRecoilState(scannedValue);

  const [scanFlag, setScanFlag] = useState(true);
  const [scanFlagError, setScanFlagError] = useState(false);
  const [scannedValue, setScannedValue] = useState('');
  const [scanning, setScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const scannerRef = useRef(null);
  const [scanCompFlag, setScanCompFlag] = useState(false);

  const [printUrl, setPrintUrl] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [disableInp, setDisableInp] = useState(false);

  const location = useLocation();
  const queryParam = location?.search;
  const params = new URLSearchParams(queryParam);

  const inputRef = useRef(null); 

  // Extract specific parameters
  const tkn = params.get('tkn');
  const pid = params.get('pid');
  const cid = params.get('cid');

  let cust_id = '';
  let cust_val = '';
  let book_id = '';
  let book_value = '';
  let curr_id = '';
  let currVal = '';
  let lock_Id = '';
  let locker_Val = '';

  //getting intial main data from api
  const fetchMRPData = async () => {

    try {
      const url = "http://zen/jo/api-lib/App/API_MRPBill";
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
                    lock_Id = e?.id;
                    locker_Val = e?.Lockername;
                    setTimeout(() => {
                      setLockerId(e?.id);
                      setSelectLocker(e?.Lockername);
                    },0)
                    break;
                  case 'currency':
                    setCurrencyID(e?.id);
                    setSelectVal(e?.Currencycode);
                    curr_id = e?.id;
                    currVal = e?.Currencycode;
                    setTimeout(() => {
                      setCurrencyID(e?.id);
                      setSelectVal(e?.Currencycode);
                    },0)
                    break;
                  case 'book':
                    setBookId(e?.id);
                    setSelectBook(e?.id);
                    book_id = e?.id;
                    book_value = e?.id;
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
          toast.error("Some Error Occurred");
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
  
  useEffect(() => {
    fetchMRPData();
  }, []);
  

  //currency logic
  const handleCurrencyChange = (e) => {
    setSelectVal(e.target.value);
    setCurrErrorMsg('');
    const selectedOption = e.target.options[e.target.selectedIndex];
    const currencyRate = selectedOption.getAttribute('data-curr_Rate');
    const currencyId = selectedOption.getAttribute('data-currId');
    setCurrencyRate(currencyRate);
    setCurrencyID(currencyId);
  }

  //locker logic
  const handleLockerChange = (e) => {
    setSelectLocker(e.target.value);
    const selectedOption = e.target.options[e.target.selectedIndex];
    const lockerId = selectedOption.getAttribute('data-lockId');
    setLockerId(lockerId);
    setLockerErrorMsg('');
  }

  //job no input field on change logic
  const handleJobNoChange = (e) => {
    setJobnoVal(e.target.value);
    setMsg('');

  }
  const handleKeyDownEnter = (e) => {
    
    if(searchVal !== ''){
      if (e.key === 'Enter') {
        setIsLoading(true);
        handleGoClick(); // Trigger the Go button's click logic
      }
    }else{
      setCustErrorMsg('Customer required');
    }
  }

  //go button logic and job api calling
  const handleGoClick = async(type) => {
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
        console.log(searchVal);
    if(jobnoVal !== '' && isValid && isCustValid){

      if (jobList.length > 0 && !areAllSalePricesSet()) {
        setMsg('Please add sale price for previous jobs before adding new ones.');
        return;
      }


      try {
        const url = "http://zen/jo/api-lib/App/API_MRPBill";
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
            setMsg('Invalid Job');
            setIsJobPresent(false);
            setIsLoading(false);
        }

      } catch (error) {
        console.log(error);
        toast.error('Some Error Occured');
        setIsLoading(false);
      }

    }
   }else{
      setCustErrorMsg('Customer required');
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

  //job delete logic
  const handleJobDelete = (obj) => {
        const updatedJL = jobList?.filter((e) => e?.StockBarcode !== obj?.StockBarcode)
        setJobList(updatedJL);
        if(updatedJL?.length === 0){
          setDisableSelect(false);
        }
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
    setInpAutoFocus(true);
    inputRef.current?.focus();
    
  };
  const handleSearchCustomer = (val) => {
    setInpAutoFocus(true);
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
  }
  const handleKeyDown = (e) => {
    if(selectedIndex < filteredCustomers?.length){

      if(e.key === 'ArrowUp' && selectedIndex > 0){
        setSelectedIndex(prev => prev - 1)
    }
    else if(e.key === 'ArrowDown' && selectedIndex < filteredCustomers?.length - 1){
      setSelectedIndex(prev => prev + 1)
    }
    else if(e.key === 'Enter' && selectedIndex >= 0){
      setSearchCust(filteredCustomers[selectedIndex]?.TypoLabel);
      setSearchVal(filteredCustomers[selectedIndex]?.TypoLabel);
      setCustID(filteredCustomers[selectedIndex]?.id);
      setFilteredCustomers([]);
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
      setSelectBook(e.target.value);
      setBookId(e.target.value)
  }

  //save bill logic
  const saveMRP = async(args) => {
    console.log(args);
    let IsForEst = 0;
    if(args === 'bill'){
      IsForEst = 0;
    }
    if(args === 'estimate'){
      IsForEst = 1;
    }
    const isValid = checkValidation();
    
    if (!isValid) {
      return; // Stop execution if validation fails
    }
    if(jobList?.length > 0){
      let isEveryNot0 = jobList?.every((e) => e?.salePrice !== 0 || e?.salePrice !== '' || e?.salePrice !== null);
      if(isEveryNot0){

        const bill_detail = jobList?.map((e) => {
        
          return { STB: e?.StockBarcode, MRP: Number(e?.salePrice) };
        })

        const body = {
          "Token" : `${atob(tkn)}`,"ReqData":`[{\"Token\":\"${atob(tkn)}\",\"Mode\":\"BillSave\",\"CustomerId\":\"${custId}\",\"LockerId\":\"${lockerId}\",\"BookId\":\"${bookId}\",\"CurrencyId\":\"${currencyId}\",\"CurrencyRate\":\"${currencyRate}\",\"IsForEst\":\"${IsForEst}\",\"loginid\":\"8\",\"BillDetail\":${JSON.stringify(bill_detail)}}]`
        }

        try {
        
        setIsLoading(true);
        const response = await axios.post("http://zen/jo/api-lib/App/API_MRPBill", body);
        console.log(response);
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

    setDisableSelect2(false);
    setDisableSelect3(false);
    setDisableSelect4(false);
    inputRef.current?.focus();
    
    setScanFlag(true);
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

  const handleOpenScanComp = () => {
    setScanCompFlag(true);
  }

  //print url set up
  const handlePrintUrl = () => {

    window.open(printUrl, '_blank');

  }

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

  useEffect(() => {
    if(jobList?.length === 0){
      setDisableSelect(false);
      setDisableSelect2(false);
      setDisableSelect3(false);
      setDisableSelect4(false);
      setEditTableFlag(false);
    }
  },[jobList]);

  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState('');

  const handleClickOpen = (type) => {
    console.log(type);
    setActionType(type);  // Store the action type
    setTimeout(() => {
      setActionType(type);
    },0)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    if (actionType === 'bill') {
      saveMRP('bill');
    } else if (actionType === 'estimate') {
      saveMRP('estimate');
    }
    setOpen(false);
  };

  const handleContinue = () => {
    setEditTableFlag(true); // Disable fields
  };

  const handleBack = () => {
    setEditTableFlag(false); // Enable fields
  };

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

useEffect(() => {
  console.log('called');
  if(scannedValue){
    console.log('called');
    console.log('scanValue', scannedValue);
    
    // setTimeout(() => {
    //   setJobnoVal(scannedValue);
      handleScanJob(scannedValue); 
    //   // handleKeyDownEnter();
    // },10) 
    

  }
}, [scannedValue]);

const handleScanJob = async() => {
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
      setMsg('Scanned Job Invalid');
      setIsJobPresent(false);
      setIsLoading(false);
  }

  } catch (error) {
    console.log(error);
    toast.error('Some Error Occured');
    setIsLoading(false);
  }
}




useEffect(() => {

  const handleScan = (event) => {
    // Capture scanned data from keyboard events
    if (event.key === 'Enter') {
      // Process scanned value here
      const value = event.target.value.trim();
      if (value) {
        if(currencyId !== '' && lockerId !== '' && custId !== ''){

        setScannedValue(value);
        event.target.value = ''; // Clear input after scan
        }
        else{
        if(custId === ''){
          setCustErrorMsg('Customer required');
          setIsLoading(false);
        }else{
          setCustErrorMsg('');
          setIsLoading(false);
        }
        if(lockerId === ''){
          setLockerErrorMsg('Locker required');
          setIsLoading(false);
        }else{
          setLockerErrorMsg('');
          setIsLoading(false);
        }
        if(currencyId === ''){
          setCurrErrorMsg('Currency required');
          setIsLoading(false);
        }else{
          setCurrErrorMsg('');
          setIsLoading(false);
        }
        }
      }
    }
  };
  
  // Attach event listener for scanning
  const inputElement = document?.getElementById('scanner-input');
  inputElement?.addEventListener('keydown', handleScan);
  
  console.log('called 2', currencyId, lockerId);
  console.log('called 3 cust : ', custId, custId==='', scanFlag);
  setMsg('');

  // Cleanup
  return () => {
    inputElement?.removeEventListener('keydown', handleScan);
  };

}, [currencyId, lockerId, custId]);

useEffect(() => {
  if (scanFlag) {
    setInpAutoFocus(true);
  }
}, [scanFlag]);

const checkScanValidation = () => {
      let isValid = false;
      if(cust_id === '' || custId){
        setCustErrorMsg('Customer required');
        isValid = false;
      }else{
        isValid = true;
        setCustErrorMsg('');
      }
      if(cust_val === '' || searchVal === ''){
        setCustErrorMsg('Customer required');
        isValid = false;
      }else{
        isValid = true;
        setCustErrorMsg('');
      }
      if(lock_Id === '' || lockerId === ''){
        setLockerErrorMsg('Locker required');
        isValid = false;
      }else{
        isValid = true;
        setLockerErrorMsg('');
      }
      if(locker_Val === '' || selectLocker === ''){
        setLockerErrorMsg('Locker required');
        isValid = false;
      }else{
        isValid = true;
        setLockerErrorMsg('');
      }
      if(curr_id === '' || currencyId === ''){
        setCurrErrorMsg('Currency required');
        isValid = false;
      }else{
        isValid = true;
        setCurrErrorMsg('');
      }
      if(currVal === '' || selectVal === ''){
        setCurrErrorMsg('Currency required');
        isValid = false;
      }else{
        isValid = true;
        setCurrErrorMsg('');
      }
      return isValid;
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

        <div className="p-1 px-4 d_grid">
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
            <div className="grid-item pd10_mrp ">
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
            <div className="grid-item pd10_mrp">
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
            <div className="grid-item pd10_mrp">
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
        </div>

        {/* <div className="w-100 d-flex align-items-baseline p-2 minH_mrp"> */}
        <div className="w-100 d-flex align-items-baseline p-2 flex_column_mrp minH_mrp mt_top_mrp_head">
          <div className="w-25 d-flex flex-column  align-items-start ps-3 w_50_mrp2 w_100_mrp_scan mt_mrp">
            <div className="scanblock_mrpbill">
                {/* <img src={scanImg} alt="#scanjob" className="scanJobImg" onClick={handleOpenScanComp} /> */}
                { scanFlag ? <><img src={scanImg} alt="#scanjob" className="scanJobImg" onClick={() => handleScanFlagAndComp('scan')} /><div className="fs_scanimg"></div></> : 
                <>
                  <img src={f2Img} alt="#scanjob" className="scanJobImg" onClick={() => handleScanFlagAndComp('f2')} />
                  <div className="fw-bold text-danger fs_scanimg">Click Here For Scan Image</div>
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
              />
              <button className="btn_go" disabled={jobnoVal === ''} onClick={() => handleGoClick()}>GO</button>
            </div>
            <div className="text-danger px-2 msg_h_mrpbill">{msg}</div>
          </div>
          {/* { isJobPresent && <div className="w-50 d-flex flex-wrap center_jl_mrp w_75_mrp2">
            {jobDetail?.map((e, i) => {
              return (
                <div key={i}>
                  <div className="jobitem_mrp" key={i}>
                    {e?.StockBarcode}
                  </div>
                  <div>
                    <input
                      type="number"
                      className="form-control border border-secondary p-1 mt-2 w-75"
                      value={addnew}
                      onChange={(e) => handleAddNewChange(e)}
                    />
                  </div>
                  <div>
                    <button className="w-75 btn btn-success mt-2" disabled={addnew === ''} onClick={() => handleAddNew(e)}>
                      ADD NEW
                    </button>
                  </div>
                </div>
              );
            })}
          </div>} */}
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
                        style={{
                          width: "100%",
                          border: "none",
                          textAlign: "center",
                          backgroundColor: "transparent",
                          border:'1px solid #989898'
                        }}
                        disabled={editableFlag}
                      />
                    </td>
                    {/* <td width={90} align="center" style={{borderRight:'1px solid #989898', verticalAlign:'center'}}>
                            <EditIcon titleAccess="update" sx={{color:'grey', cursor:'pointer'}} />
                        </td> */}
                    <td width={90} align="center" className="pd_0">
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
        </div>}
        </div>

        {/* { billSavedFlag !== true && <div className="tableDiv_mrp">
          <table className="table max_w_table">
            <thead className="table-head">
              <tr>
                <td width={90} style={{ borderRight: "1px solid #989898", backgroundColor: "#e8e8e8", }} > SrNo </td>
                <td width={90} style={{ borderRight: "1px solid #989898", backgroundColor: "#e8e8e8", }} > Image </td>
                <td width={520} style={{ borderRight: "1px solid #989898", backgroundColor: "#e8e8e8", }} > Description </td>
                <td width={120} style={{ borderRight: "1px solid #989898", backgroundColor: "#e8e8e8", }} > Sale Price </td>
                <td width={90} style={{ backgroundColor: "#e8e8e8" }}> Delete </td>
              </tr>
            </thead>
            <tbody className="table-body">
              {jobList?.length > 0 ? jobList?.map((e, i) => {
                return (
                  <tr key={i}>
                    <td width={90} className="pd_0" align="center" style={{ borderRight: "1px solid #989898" }} >
                      1
                    </td>
                    <td width={90} align="center" className="pd_0" style={{ borderRight: "1px solid #989898" }} >
                      <img src={e?.DesignImage} alt="#img" className="tableImg" onError={handleImageError} />
                    </td>
                    <td width={520} style={{ borderRight: "1px solid #989898" }} className="pd_0" >
                      {e?.Description}
                    </td>
                    <td width={120} style={{ borderRight: "1px solid #989898" }}  className="pd_0">
                      {" "}
                      <input
                        type="number"
                        value={e?.salePrice}
                        onChange={(event) => handlePriceChange(event, e)}
                        style={{
                          width: "100%",
                          border: "none",
                          textAlign: "center",
                          backgroundColor: "transparent",
                          border:'1px solid #989898'
                        }}
                      />
                    </td>
                    <td width={90} align="center" className="pd_0">
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
        </div>} */}

        { billSavedFlag !== true && <>
        <div className="w-100 d-flex justify-content-center align-items-center mt-1">
          {/* <button className="continue_btn_bill mx-2" disabled={jobList?.length === 0 ? true : false} onClick={(e) => saveMRP(e, 'bill')}>SAVE BILL</button>
          <button className="continue_btn_est mx-2" disabled={jobList?.length === 0 ? true : false} onClick={(e) => saveMRP(e, 'estimate')}>SAVE ESTIMATE</button> */}
          {/* { editableFlag ? <button className="continue_btn_bill mx-2" disabled={jobList?.length === 0 ? true : false} onClick={() => handleClickOpen('bill')}>SAVE BILL</button> : <div style={{height:'40px'}}></div>} */}
          {/* { editableFlag ? <button className="continue_btn_est mx-2" disabled={jobList?.length === 0 ? true : false}  onClick={() => handleClickOpen('estimate')}>SAVE ESTIMATE</button> : <div style={{height:'40px'}}></div>} */}
        </div>
        <div> <ConfirmDialog open={open} onClose={handleClose} onConfirm={() => handleConfirm(actionType)} /></div>
        {/* <button className="continue_btn_cen mx-2" onClick={() => saveNextBill()}>CANCEL ALL</button> */}
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
      {
        // scanCompFlag && <QRreader setScanCompFlag={setScanCompFlag} />
        // scanCompFlag && <ScanWithDevice setScanCompFlag={setScanCompFlag} />
      }
      {/* <ScanWithDevice setScanCompFlag={setScanCompFlag}  /> */}
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
          autoFocus={inpAutoFocus}
          ref={inputRef}
        />
      </div>
    
    </>
  );
};

export default MRPBill;
