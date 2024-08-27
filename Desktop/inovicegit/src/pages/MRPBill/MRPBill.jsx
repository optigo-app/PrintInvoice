import React, { useRef, useState } from "react";
import "./mrpbill.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import img from "../../assets/img/default.png";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import scanImg from "../../assets/img/scanimg.gif";
import { handleImageError } from "./MRPGlobalFunctions";
import { useLocation } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import QRreader from "./QRBarcodeReader";
import { CircularProgress } from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';

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

  //scan
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

  // Extract specific parameters
  const tkn = params.get('tkn');
  const pid = params.get('pid');


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
                    break;
                  case 'currency':
                    setCurrencyID(e?.id);
                    setSelectVal(e?.Currencycode);
                    break;
                  case 'book':
                    setBookId(e?.id);
                    setSelectBook(e?.id);
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

  //go button logic and job api calling
  const handleGoClick = async() => {

    const areAllSalePricesSet = () => {
      return jobList.every(job => job.salePrice !== '');
    };
    const isValid = checkValidation();

    const isCustValid = false;

    customerData?.forEach((e) => {
      if(e?.custId === custId && e?.TypoLabel?.toLowerCase() === searchVal?.toLowerCase()){
        isCustValid = true;
      }else{
        setCustErrorMsg('Invalid Customer');
      }
    })
    
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
                         if(isJobPresent){
                          console.log('already present');
                          setMsg('Already Present');
                          setJobDetail([]);
                          setIsLoading(false);
                          setDisableSelect(true);
                         }else{
                          setJobDetail(response?.data?.Data?.DT)
                          let newobj = {...response?.data?.Data?.DT[0]};
                          newobj.salePrice = '';
                          setJobList((prev) => [...prev, newobj]);
                          setDisableSelect(true);
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

  };

  //job delete logic
  const handleJobDelete = (obj) => {
        const updatedJL = jobList?.filter((e) => e?.StockBarcode !== obj?.StockBarcode)
        setJobList(updatedJL);
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
  };
  const handleSearchCustomer = (val) => {
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
  }
  const handleSelectBlur = () => {
      setTimeout(() => {
        setFilteredCustomers([]);
        setSelectedIndex(-1);
      }, 1000)  
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

  }

  //book change logic
  const handleBookChange = (e) => {
      setSelectBook(e.target.value);
      setBookId(e.target.value)
  }

  //save bill logic
  const saveMRP = async(e, args) => {
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

    // if (!custId && searchVal !== '') {
    //   setCustErrorMsg('Customer is required');
    //   isValid = false;
    // } else {
    //   setCustErrorMsg('');
    // }
    if (!custId && searchVal !== '') {
      const matchedCustomer = customerData?.find(
        (customer) => customer?.TypoLabel?.toLowerCase() === searchVal?.toLowerCase()
      );
  
      // If no match is found or the match does not align with the customer ID
      if (!matchedCustomer || matchedCustomer?.id !== custId) {
        setCustErrorMsg('Invalid customer');
        isValid = false;
      } else {
        // If valid, set the customer ID
        setCustID(matchedCustomer?.id);
        setCustErrorMsg('');
      }
    } else if (!custId && searchVal === '') {
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

  const handlePrintUrl = () => {

    window.open(printUrl, '_blank');

  }
  return (
    <>
            {isLoading && (
                <div className="loader-overlay">
                    <CircularProgress className='loadingBarManage' />
                </div>
            )}
      { !scanCompFlag && <div className="container_mrp">

        <div className="head_mrp">ADD MRP AND PROCCED TO BILL</div>
        
        {/* <div className="d-flex justify-content-between align-items-start p-2 py-4 flex_Start_mrp d_none_mrp">
          <div className="d-flex align-items-start ">
            <label className="cust_name_title" htmlFor="custtitle">
              CUSTOMER NAME
            </label>
            <div className="">
              <input
                type="text"
                value={custSearch}
                placeholder="customer name"
                className="form-control p-2  border border-secondary minW_search_mrp"
                id="custtitle"
                onChange={(e) => handleSearchCustomer(e.target.value)}
                onBlur={() => handleSelectBlur()}
                onKeyDown={handleKeyDown}
              />
               {filteredCustomers?.length > 0 && (
        <ul className="list-group position-absolute custom_scrollbar" style={{ zIndex: 1000, width:'max-content', minWidth:'50px', maxHeight:'180px', overflowY:'scroll', minWidth:'240px' }}>
          {filteredCustomers?.map((customer, index) => (
            <li
              key={index}
              className={`list-group-item list-group-item-action p-1 ${selectedIndex === index ? "search_sug_line active" : "search_sug_line"}`}
              // onClick={() => handleSelectCustomer(customer?.userid)}
              onClick={() => handleSelectCustomer(customer)}
            >
              {customer?.userid}
            </li>
          ))}
        </ul>
                )}
                <div className="text-danger">{custErrorMsg}</div>
            </div>
          </div>
          <div className="currW_mrp">
            <div className=" d-flex flex-column align-items-start minH_erorr">
              <div>
              <label htmlFor="currency" className="pe-3 cust_name_title">
                LOCKER
              </label>
              <select
                name="currency"
                id="currency"
                value={selectLocker}
                className="lock_select minW_lockSelect"
                onChange={(e) => handleLockerChange(e)}
                style={{border:'1px solid #989898', borderRadius:'8px'}}
              >
                <option  value="">Select</option>
                {
                    lockerData?.map((e, i) => {
                        return <option key={i} data-lockId={e?.id} value={e?.Lockername}>{e?.Lockername}</option>
                    })
                }
              </select>
              </div>
              <div className="lockerErrorMsg_mrp text-danger">{lockerErrorMsg}</div>
            </div>
          </div>
          <div className="">
            <div className=" d-flex flex-column align-items-start ">
              <div>
              <label htmlFor="currency" className="pe-3 cust_name_title">
                CURRENCY
              </label>
              <select
                name="currency"
                id="currency"
                value={selectVal}
                className="lock_select minW_CurrSelect"
                onChange={(e) => handleCurrencyChange(e)}
                style={{border:'1px solid #989898',  borderRadius:'8px'}}
              >
                <option  value="">Select</option>
                {
                    currencyData?.map((e, i) => {
                        return <option key={i} data-curr_Rate={e?.CurrencyRate} data-currId={e?.id} value={e?.Currencycode}>{e?.Currencycode}</option>
                    })
                }
              </select>
              </div>
              <div className="lockerErrorMsg_mrp text-danger">{currErrorMsg}</div>
            </div>
          </div>
        </div> */}

        <div className="p-1 d_grid">
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
                disabled={disableSelect}
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
                <img src={scanImg} alt="#scanjob" className="scanJobImg" />
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <input
                type="text"
                id="jobno"
                className="form-control border border-secondary"
                value={jobnoVal}
                autoFocus={true}
                onChange={(e) => handleJobNoChange(e)}
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
            { billSavedFlag !== true && <div className="tableDiv_mrp">
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
                      1
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

        { billSavedFlag !== true && <div className="w-100 d-flex justify-content-center align-items-center mt-1">
          <button className="continue_btn_bill mx-2" disabled={jobList?.length === 0 ? true : false} onClick={(e) => saveMRP(e, 'bill')}>SAVE BILL</button>
          <button className="continue_btn_est mx-2" disabled={jobList?.length === 0 ? true : false} onClick={(e) => saveMRP(e, 'estimate')}>SAVE ESTIMATE</button>
        </div>}
        <div className="d-flex flex-column justify-content-center align-items-center w-100 mb-4 pb-2">
        { billSavedFlag === true &&
        <>
          <div className="generatedBill">Generate Bill No : {billNo} <span><PrintIcon titleAccess="click here for Print" style={{cursor:'pointer'}} onClick={() => handlePrintUrl()} /></span></div>
          <button className="continue_btn_next mx-2"  onClick={(e) => saveNextBill(e, 'next')}>NEXT BILL</button>
        </>
        }
        </div>
      </div>}
      {
        scanCompFlag && <QRreader setScanCompFlag={setScanCompFlag} />
      }
    </>
  );
};

export default MRPBill;
