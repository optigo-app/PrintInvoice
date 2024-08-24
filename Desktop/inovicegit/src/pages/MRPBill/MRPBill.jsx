import React, { useState } from "react";
import "./mrpbill.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import img from "../../assets/img/default.png";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import scanImg from "../../assets/img/scanimg.gif";
import { handleImageError } from "./MRPGlobalFunctions";


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


  const fetchMRPData = async () => {
    try {
      const url = "http://zen/jo/api-lib/App/API_MRPBill";
      const token = "9065471700535651";
  
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
  
  const handleCurrencyChange = (e) => {
    setSelectVal(e.target.value);
    const selectedOption = e.target.options[e.target.selectedIndex];
    const currencyRate = selectedOption.getAttribute('data-curr_Rate');
    const currencyId = selectedOption.getAttribute('data-currId');
    setCurrencyRate(currencyRate);
    setCurrencyID(currencyId);
  }
  const handleLockerChange = (e) => {
    setSelectLocker(e.target.value);
    const selectedOption = e.target.options[e.target.selectedIndex];
    const lockerId = selectedOption.getAttribute('data-lockId');
    setLockerId(lockerId);
    setLockerErrorMsg('');
  }
  const handleJobNoChange = (e) => {
    setJobnoVal(e.target.value);
    setMsg('');
  }
  const handleGoClick = async() => {
    if(jobnoVal !== ''){
        const url = "http://zen/jo/api-lib/App/API_MRPBill";
        const body = JSON.stringify({
            Token : "9065471700535651",
            ReqData:`[{\"Token\":\"9065471700535651\",\"Mode\":\"GetJobDeatil\",\"STB\":\"${jobnoVal}\"}]`
        })
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
                         }else{
                          setJobDetail(response?.data?.Data?.DT)
                          setMsg('')
                          setJobnoVal('');
                          setIsJobPresent(true);
                         }
                    }else{
                      setJobDetail(response?.data?.Data?.DT)
                      setMsg('')
                      setJobnoVal('');
                      setIsJobPresent(true);
                    }
                    
                }else{
                    setJobDetail([]);
                    console.log(response?.data?.Data?.DT);
                    setMsg('')
                    setIsJobPresent(false);
                }
            }else{
                console.log(response?.data?.Data);
                setIsJobPresent(false);
            }
        }else{
            console.log(response?.data?.Data);
            setMsg('Invalid Job');
            setIsJobPresent(false);
        }

    }
  }
  const isEmptyObject = (obj) => Object.keys(obj).length === 0;
  const handleAddNew = (obj) => {
      let newobj = {...obj};
      newobj.salePrice = Number(addnew);

      setJobList((prev) => [...prev, newobj]);
      setAddNew('');
      setJobnoVal('');
      setIsJobPresent(false);

  }
  const handleAddNewChange = (e) => {
    setAddNew(e.target.value);
  }
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
  const handleJobDelete = (obj) => {
        const updatedJL = jobList?.filter((e) => e?.StockBarcode !== obj?.StockBarcode)
        setJobList(updatedJL);
  }

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
  const saveMRP = async(e, args) => {
    let IsForEst = 0;
    if(args === 'bill'){
      IsForEst = 1;
    }
    if(args === 'estimate'){
      IsForEst = 0;
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
          "Token" : "9065471700535651","ReqData":`[{\"Token\":\"9065471700535651\",\"Mode\":\"BillSave\",\"CustomerId\":\"${custId}\",\"LockerId\":\"${lockerId}\",\"CurrencyId\":\"${currencyId}\",\"CurrencyRate\":\"${currencyRate}\",\"IsForEst\":\"${IsForEst}\",\"loginid\":\"8\",\"BillDetail\":${JSON.stringify(bill_detail)}}]`
        }
        console.log(body);

        const response = await axios.post("http://zen/jo/api-lib/App/API_MRPBill", body);

        if(response?.status === 200 && response?.data?.Status === '200'){
          console.log(response?.data?.Data?.DT[0]?.BillNo);
          setBillNo(response?.data?.Data?.DT[0]?.BillNo);
          setBillSavedFlag(true);
        }else{
          toast.error("Some Error Occured");
        }

        console.log(response);
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

  }

  return (
    <>
      <div className="container_mrp">

        <div className="head_mrp">ADD MRP AND PROCCED TO BILL</div>
        
        <div className="d-flex justify-content-around align-items-center p-2 py-4 flex_Start_mrp d_none_mrp">
          <div className="d-flex align-items-center ">
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
          <div className="">
            <div className=" d-flex flex-column align-items-center ">
              <div>
              <label htmlFor="currency" className="pe-3 cust_name_title">
                LOCKER
              </label>
              <select
                name="currency"
                id="currency"
                value={selectLocker}
                className="lock_select"
                onChange={(e) => handleLockerChange(e)}
                style={{border:'1px solid #989898'}}
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
            <div className=" d-flex align-items-center ">
              <label htmlFor="currency" className="pe-3 cust_name_title">
                CURRENCY
              </label>
              <select
                name="currency"
                id="currency"
                value={selectVal}
                className="lock_select"
                onChange={(e) => handleCurrencyChange(e)}
                style={{border:'1px solid #989898'}}
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
            <div className="grid-item">
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
                <div>{custErrorMsg}</div>
            </div>
            <div className="grid-item">
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
                <div>{lockerErrorMsg}</div>
            </div>
            <div className="grid-item">
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
              }) : <tr><td colSpan={5} align="center">No Jobs Data Present</td></tr>}
            </tbody>
          </table>
        </div>}

        { billSavedFlag !== true && <div className="w-100 d-flex justify-content-center align-items-center mt-1">
          <div className="continue_btn_bill mx-2" disabled={jobList?.length === 0 ? true : false} onClick={(e) => saveMRP(e, 'bill')}>SAVE BILL</div>
          <div className="continue_btn_est mx-2" disabled={jobList?.length === 0 ? true : false} onClick={(e) => saveMRP(e, 'estimate')}>SAVE ESTIMATE</div>
        </div>}
        <div className="d-flex flex-column justify-content-center align-items-center w-100">
        { billSavedFlag === true &&
        <>
          <div className="generatedBill">Generate Bill No : {billNo}</div>
          <div className="continue_btn_next mx-2"  onClick={(e) => saveNextBill(e, 'next')}>NEXT BILL</div>
        </>
        }
        </div>
      </div>
    </>
  );
};

export default MRPBill;
