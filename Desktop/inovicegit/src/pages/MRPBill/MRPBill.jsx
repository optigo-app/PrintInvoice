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
  const [jobDetail, setJobDetail] = useState(null);
  const [msg, setMsg] = useState('');
  const [addnew, setAddNew] = useState('');

  const [jobList, setJobList] = useState([]);

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
  }
  const handleLockerChange = (e) => {
    setSelectLocker(e.target.value);
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
                    setJobDetail(response?.data?.Data?.DT)
                    setMsg('')
                    setJobnoVal('');
                    setIsJobPresent(true);
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
                value={searchVal}
                placeholder="customer name"
                className="form-control p-2  border border-secondary"
                id="custtitle"
                
              />
            </div>
          </div>
          <div className="">
            <div className=" d-flex align-items-center ">
              <label htmlFor="currency" className="pe-3 cust_name_title">
                LOCKER
              </label>
              <select
                name="currency"
                id="currency"
                value={selectLocker}
                className="lock_select"
                onChange={(e) => handleLockerChange(e)}
              >
                {
                    lockerData?.map((e, i) => {
                        return <option key={i} value={e?.Lockername}>{e?.Lockername}</option>
                    })
                }
              </select>
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
              >
                {
                    currencyData?.map((e, i) => {
                        return <option key={i} value={e?.Currencycode}>{e?.Currencycode}</option>
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
                />
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
                {
                    lockerData?.map((e, i) => {
                        return <option key={i} value={e?.Lockername}>{e?.Lockername}</option>
                    })
                }
                </select>
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
                {
                    currencyData?.map((e, i) => {
                        return <option key={i} value={e?.Currencycode}>{e?.Currencycode}</option>
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
            <div className="text-danger px-2">{msg}</div>
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

        <div className="tableDiv_mrp">
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
        </div>

        <div className="w-100 d-flex justify-content-center align-items-center">
          <div className="continue_btn_mrp mx-2">SAVE MRP</div>
          <div className="continue_btn_mrp">SAVE MRP</div>
        </div>
        <div className="w-100 d-flex justify-content-center align-items-center">
          <div className="continue_btn_mrp mx-2">CONTINUE TO BILL</div>
        </div>
      </div>
    </>
  );
};

export default MRPBill;
