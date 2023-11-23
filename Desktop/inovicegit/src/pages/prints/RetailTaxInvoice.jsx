import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { ToWords } from 'to-words';
import { NumberWithCommas, apiCall, handlePrint, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';

const RetailTaxInvoice = ({ urls, token, invoiceNo, printName, evn }) => {

    const [loader, setLoader] = useState(true);
    const [headerData, setHeaderData] = useState({});
    const [msg, setMsg] = useState("");
    const [taxes, setTaxes] = useState([]);
    const toWords = new ToWords();

    const loadData = (data) => {
        setHeaderData(data?.BillPrint_Json[0])
    }

    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls, evn);
                if (data?.Status === '200') {
                    let isEmpty = isObjectEmpty(data?.Data);
                    if (!isEmpty) {
                        loadData(data?.Data);
                        setLoader(false);
                    } else {
                        setLoader(false);
                        setMsg("Data Not Found");
                    }
                } else {
                    setLoader(false);
                    setMsg(data?.Message);
                }
            } catch (error) {
                console.error(error);
            }
        }
        sendData();
    }, []);

    return (
        <>  {loader ? <Loader /> : msg === "" ? <div className='container containerRetailPrint mt-5 pad_60_allPrint'>
            {/* print button */}
            <div className="d-flex w-100 justify-content-end align-items-baseline print_sec_sum4 no_break pb-4">
                <div className="printBtn_sec text-end ">
                    <input type="button" className="btn_white blue me-0" value="Print" onClick={(e) => handlePrint(e)} />
                </div>
            </div>
            {/* headline retail print */}
             {/* <div className="containerinvp3 pad_60_allPrint" id="divToPrint">
                <div className="headinvp3">
                  <div className="headerinvp3">
                    <div className="head1invp3">
                      <p className="fw-bold fsinvp3 w-50">BILL NO</p>
                      <p className="fsinvp3 w-50 text-end">{headerData?.InvoiceNo}</p>
                    </div>
                    <div className="head1invp3">
                      <p className="fw-bold fsinvp3">DATE</p>
                      <p className="fsinvp3">{headerData?.EntryDate}</p>
                    </div>
                    <div className="head1invp3">
                      <p className="fw-bold fsinvp3">HSN</p>
                      <p className="fsinvp3">{headerData?.HSN_No}</p>
                    </div>
                  </div>
                </div>
                <div className="header2invp3">
                  <div>
                    <p className="fw-bold fs-6">
                      {headerData?.customerfirmname}
                    </p>
                    <p className="fsinvp3">{headerData?.customerstreet}</p>
                    <p className="fsinvp3">{headerData?.customerregion}</p>
                    <p className="fsinvp3">
                      {headerData?.customercity} {headerData?.customerpincode}
                    </p>
                    <p className="fsinvp3">
                      Mobile : {headerData?.customermobileno}
                    </p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between winvp3">
                      <p className="fw-bold fsinvp3">
                        {headerData?.vat_cst_pan?.split("|")?.[0]}
                      </p>
                    </div>
                    <p className="fw-bold fsinvp3">
                      {headerData?.vat_cst_pan?.split("|")?.[1]}
                    </p>
                    <div className="d-flex justify-content-between winvp3">
                      <p className="w-50 fw-bold fsinvp3">
                        {headerData?.Cust_CST_STATE}
                      </p>
                      <p className="w-50 fsinvp3">
                        {headerData?.Cust_CST_STATE_No}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="d-flex"
                  style={{
                    borderBottom: "2px solid #d8d7d7",
                    borderLeft: "2px solid #d8d7d7",
                  }}
                >
                  <div className="w-50 d-flex flex-column justify-content-between position-relative d-flex">
                    <div className="w-100">
                      <div className="discHeadinvp3">DESCRIPTION</div>
                      <div className="w-100">{}</div>
                    </div>
                    <div className="empdivinvp3"></div>
                  </div>
                
                  <div className="tableinvp3">
                    <div className="theadinvp3">
                      <p
                        className="wp1invp3 fsinvp3"
                        style={{
                          justifyContent: "flex-start",
                          paddingLeft: "3px",
                        }}
                      >
                        DETAIL
                      </p>
                      <p className="wp3invp3 fsinvp3">WEIGHT</p>
                      <p className="wp3invp3 fsinvp3">RATE</p>
                      <p className="wp3invp3 fsinvp3">AMOUNT</p>
                    </div>
                    <div className="tablebodyinvp3">
                  
                    </div>
                  </div>
                </div>
                <div className="summaryinvp3">
                  <div className="totalinvp3">
                    <div className="d-flex justify-content-between px-2">
                      <p className="w-50 text-start fsinvp3">Discount</p>
                      <p className="w-50 text-end fsinvp3">
                      </p>
                    </div>
                    <div className="d-flex justify-content-between px-2">
                      <p className="fw-bold fsinvp3">Total Amount</p>
                      <p className="w-50 text-end fsinvp3">
                      </p>
                    </div>
                  

                    <div className="d-flex justify-content-between px-2">
                      <p className="fsinvp3">
                        {headerData?.AddLess > 0 ? "Add" : "Less"}
                      </p>
                      <p className="w-50 text-end fsinvp3">
                        {headerData?.AddLess}
                      </p>
                    </div>
                    <div
                      className="d-flex justify-content-between px-2 mt-1"
                      style={{ borderTop: "5px solid #e8e8e8" }}
                    >
                      <p className="fw-bold fsinvp3">Grand Total</p>
                      <p className="fw-bold w-50 text-end fsinvp3">
                        {}
                      </p>
                    </div>
                  </div>
                  <div className="wordsinvp3 fsinvp3 px-2 fw-bold">
                    {}
                  </div>
                  <div className="wordsinvp3 fsinvp3">
                    <p className="fw-bold px-2">NOTE:</p>
                    <p
                      className="fsinvp3"
                      dangerouslySetInnerHTML={{
                        __html: headerData?.PrintRemark,
                      }}
                    ></p>
                  </div>
                </div>
              </div>  */}
      
        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}</>
    )
}

export default RetailTaxInvoice