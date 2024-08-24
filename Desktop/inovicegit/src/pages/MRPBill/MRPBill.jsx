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


const MRPBill = () => {
  const [searchVal, setSearchVal] = useState("");
  const [selectVal, setSelectVal] = useState("");
  const [selectLocker, setSelectLocker] = useState("");
  const [jobnoVal, setJobnoVal] = useState("");
  const [isJobPresent, setIsJobPresent] = useState(false);

  const [currencyData, setCurrencyData] = useState([]);
  const [lockerData, setLockerData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
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

  const [jobList, setJobList] = useState([]);

  const [billNo, setBillNo] = useState(0);
  const [billSavedFlag, setBillSavedFlag] = useState(false);
  
  const [custErrorMsg, setCustErrorMsg] = useState('');
  const [lockerErrorMsg, setLockerErrorMsg] = useState('');

  //scan
  const [scannedValue, setScannedValue] = useState('');
  const [scanning, setScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const scannerRef = useRef(null);
  const [scanCompFlag, setScanCompFlag] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

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
      const fetchData = async (mode, setData) => {
        const body = JSON.stringify({
          Token: token,
          ReqData: `[{"Token":"${token}","Mode":"${mode}"}]`,
        });
        const response = await axios.post(url, body);
        if (response?.status === 200 && response?.data?.Status === '200') {
          if (response?.data?.Data?.DT?.length > 0) {
            setData(response?.data?.Data?.DT);
          } else {
            setData([]);
            console.log(response?.data?.Data);
          }
        } else {
          toast.error("Some Error Occurred");
        }
      };
  
      // Fetch locker data
      await fetchData("GetLocker", setLockerData);
  
      // Fetch currency data
      await fetchData("GetCurrency", setCurrencyData);
  
      // Fetch customer data
      await fetchData("GetCustomer", setCustomerData);
  
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
    if(jobnoVal !== ''){
      try {
        const url = "http://zen/jo/api-lib/App/API_MRPBill";
        const body = JSON.stringify({
            Token : `${atob(tkn)}`,
            ReqData:`[{\"Token\":\"${atob(tkn)}\",\"Mode\":\"GetJobDeatil\",\"STB\":\"${jobnoVal}\"}]`
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
                         }else{
                          setJobDetail(response?.data?.Data?.DT)
                          setMsg('')
                          setJobnoVal('');
                          setIsJobPresent(true);
                          setIsLoading(false);
                         }
                    }else{
                      setJobDetail(response?.data?.Data?.DT)
                      setMsg('')
                      setJobnoVal('');
                      setIsJobPresent(true);
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
    console.log("Input value:", e.target.value); // Debugging log
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
    setSearchCust(customer?.userid);
    setFilteredCustomers([]); // Clear suggestions after selection
    setSelectedIndex(-1);
    setCustErrorMsg('');
  };
  const handleSearchCustomer = (val) => {
    let searchValue = val?.toLowerCase();
    setSearchCust(val);
    if (searchValue) {
      const filtered = customerData?.filter(customer =>
        customer?.userid?.toLowerCase()?.includes(searchValue.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } 
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
      setSearchCust(filteredCustomers[selectedIndex]?.userid);
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
      let isEveryNot0 = jobList?.every((e) => e?.salePrice !== 0);
      if(isEveryNot0){

        const bill_detail = jobList?.map((e) => {
        
          return { STB: e?.StockBarcode, MRP:e?.salePrice };
        })

        const body = {
          "Token" : `${atob(tkn)}`,"ReqData":`[{\"Token\":\"${atob(tkn)}\",\"Mode\":\"BillSave\",\"CustomerId\":\"${custId}\",\"LockerId\":\"${lockerId}\",\"CurrencyId\":\"${currencyId}\",\"CurrencyRate\":\"${currencyRate}\",\"IsForEst\":\"${IsForEst}\",\"loginid\":\"8\",\"BillDetail\":${JSON.stringify(bill_detail)}}]`
        }

        try {
        
        setIsLoading(true);
        const response = await axios.post("http://zen/jo/api-lib/App/API_MRPBill", body);

        if(response?.status === 200 && response?.data?.Status === '200'){
          setBillNo(response?.data?.Data?.DT[0]?.BillNo);
          setBillSavedFlag(true);
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

    if (!custId) {
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

    setBillSavedFlag(false);

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
  

  return (
    <>
            {isLoading && (
                <div className="loader-overlay">
                    <CircularProgress className='loadingBarManage' />
                </div>
            )}
      { !scanCompFlag && <div className="container_mrp">

        <div className="head_mrp">ADD MRP AND PROCCED TO BILL</div>
        
        <div className="d-flex justify-content-around align-items-start p-2 py-4 flex_Start_mrp d_none_mrp">
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
            <div className=" d-flex align-items-start ">
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
          </div>
        </div>

        <div className="p-1 d_grid d_unset_mrp">
            <div className="grid-item pd10_mrp">
                <label className="cust_name_title pe-3" htmlFor="custtitle">
                CUSTOMER NAME
                </label>
                <input
                type="text"
                value={searchVal}
                placeholder="customer name"
                className="form-control p-2 border border-secondary"
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
              onClick={() => handleSelectCustomer(customer)}
            >
              {customer?.userid}
            </li>
          ))}
        </ul>
                )}
                <div className="text-danger">{custErrorMsg}</div>
            </div>
            <div className="grid-item pd10_mrp">
                <label htmlFor="locker" className="pe-3 cust_name_title">
                LOCKER
                </label>
                <select
                name="locker"
                id="locker"
                value={selectLocker}
                className="form-select w-100"
                onChange={(e) => handleLockerChange(e)}
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
                <label htmlFor="currency" className="pe-3 cust_name_title">
                CURRENCY
                </label>
                <select
                name="currency"
                id="currency"
                value={selectVal}
                className="form-select w-100"
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
        </div>

        <div className="w-100 d-flex p-2 minH_mrp">
          <div className="w-25 d-flex flex-column  align-items-start ps-3 w_50_mrp2">
            <div className="scanblock_mrpbill">
                <img src={scanImg} alt="#scanjob" className="scanJobImg" onClick={handleOpenScanComp} />
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <input
                type="text"
                id="jobno"
                className="form-control border border-secondary"
                value={jobnoVal}
                autoFocus={true}
                onChange={(e) => handleJobNoChange(e)}
              />
              <button className="btn_go" disabled={jobnoVal === ''} onClick={() => handleGoClick()}>GO</button>
            </div>
            <div className="text-danger px-2 msg_h_mrpbill">{msg}</div>
          </div>
          { isJobPresent && <div className="w-50 d-flex flex-wrap center_jl_mrp w_75_mrp2">
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
          </div>}
        </div>

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

        { billSavedFlag !== true && <div className="w-100 d-flex justify-content-center align-items-center mt-1">
          <div className="continue_btn_bill mx-2" disabled={jobList?.length === 0 ? true : false} onClick={(e) => saveMRP(e, 'bill')}>SAVE BILL</div>
          <div className="continue_btn_est mx-2" disabled={jobList?.length === 0 ? true : false} onClick={(e) => saveMRP(e, 'estimate')}>SAVE ESTIMATE</div>
        </div>}
        <div className="d-flex flex-column justify-content-center align-items-center w-100 mb-4 pb-2">
        { billSavedFlag === true &&
        <>
          <div className="generatedBill">Generate Bill No : {billNo}</div>
          <div className="continue_btn_next mx-2"  onClick={(e) => saveNextBill(e, 'next')}>NEXT BILL</div>
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
