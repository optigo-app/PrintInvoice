import React, { useEffect, useState } from 'react'
import style from "../../assets/css/prints/RetailPrint2.module.css";
import { ToWords } from 'to-words';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';
import Loader from '../../components/Loader';
import {
    HeaderComponent,
    NumberWithCommas,
    apiCall,
    handleImageError,
    handlePrint,
    isObjectEmpty,
    taxGenrator,
    FooterComponent,
    fixedValues,
} from "../../GlobalFunctions";

const RetailPrint2 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const toWords = new ToWords();
    const [data, setData] = useState({});
    const [label, setlabel] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const [header, setHeader] = useState(null);
    const [footer, setFooter] = useState(null);
    const [document, setDocument] = useState({
        aadharcard: "",
        nri: "",
        passport: "",
    });

    const loadData = (data) => {
        let head = HeaderComponent("1", data?.BillPrint_Json[0]);
        setHeader(head);
        let footers = FooterComponent("2", data?.BillPrint_Json[0]);
        setFooter(footers);
        setHeaderData(data?.BillPrint_Json[0]);
        let printArr = data?.BillPrint_Json[0]?.Printlable.split("\r\n");
        setlabel(printArr);
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
      
        setData(datas);
        let documentDetails = data?.BillPrint_Json[0]?.DocumentDetail.split("#@#");
        let documents = {
            aadharcard: "",
            nri: "",
            passport: "",
        };
        documentDetails?.forEach((e, i) => {
            let data = e?.split("#-#");
            if (data[0] === "Aadhar Card") {
                documents.aadharcard = data[1];
            } else if (data[0] === "NRI ID") {
                documents.nri = data[1];
            } else if (data[0] === "FOREIGN PASSPORT") {
                documents.passport = data[1];
            }
        });
        setDocument(documents);
    }

    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
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
    loader ? <Loader /> : msg === "" ? <>
    <div className={`container max_width_container ${style?.retailInvoicePrint6} pad_60_allPrint px-1 mt-1`}>
        {/* buttons */}
        <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
            <div className="form-check ps-3">
                <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
            </div>
        </div>
        {/* header */}
        {header}
        {/* sub header */}
        <div className="border d-flex">
            <div className="col-7 border-end p-2">
                <p>{headerData?.lblBillTo}</p>
                <p className='fw-bold'>{headerData?.CustName}</p>
                <p>{headerData?.customerAddress1}</p>
                <p>{headerData?.customerAddress2}</p>
                <p>{headerData?.customercity}{headerData?.customerpincode}</p>
                <p>{headerData?.customercountry}</p>
                <p>{headerData?.customeremail1}</p>
                <p>Phno:{headerData?.customermobileno}</p>
                <p>{headerData?.vat_cst_pan}</p>
                <p>{headerData?.Cust_CST_STATE} {headerData?.Cust_CST_STATE_No}</p>
            </div>
            <div className="col-5 p-2">
                <div className="d-flex">
                    <div className="col-6"> <p className='fw-bold'>INVOICE NO</p> </div>
                    <div className="col-6"> <p>{headerData?.InvoiceNo}</p> </div>
                </div>
                <div className="d-flex">
                    <div className="col-6"> <p className='fw-bold'>DATE</p> </div>
                    <div className="col-6"> <p>{headerData?.EntryDate}</p> </div>
                </div>
                <div className="d-flex">
                    <div className="col-6"> <p className='fw-bold'>{headerData?.HSN_No_Label} </p> </div>
                    <div className="col-6"> <p>{headerData?.HSN_No}</p> </div>
                </div>
                <div className="d-flex">
                    <div className="col-6"> <p className='fw-bold'>Reverse Charge </p> </div>
                    <div className="col-6 d-flex"> <input type="checkbox" /> <p className='px-1'> Yes</p> <input type="checkbox" /> <p className='px-1'> No</p> </div>
                </div>
                <div className="d-flex">
                    <div className="col-6"> <p className='fw-bold'>AADHAR CARD </p> </div>
                    <div className="col-6 d-flex">  <p className='px-1'>{document?.aadharcard}</p>  </div>
                </div>
                <div className="d-flex">
                    <div className="col-6"> <p className='fw-bold'>NRI ID </p> </div>
                    <div className="col-6 d-flex">  <p className='px-1'>{document?.nri}</p>  </div>
                </div>
                <div className="d-flex">
                    <div className="col-6"> <p className='fw-bold'>FOREIGN PASSPORT</p> </div>
                    <div className="col-6 d-flex">  <p className='px-1'>{document?.passport}</p>  </div>
                </div>
            </div>
        </div>
        <div className="d-flex border">
            <div className="col-4 border-end p-2">
            <p>{headerData?.lblBillTo}</p>
                <p className='fw-bold'>{headerData?.CustName}</p>
                <p>{headerData?.customerAddress1}</p>
                <p>{headerData?.customerAddress2}</p>
                <p>{headerData?.customercity}{headerData?.customerpincode}</p>
                <p>{headerData?.customercountry}</p>
                <p>{headerData?.customeremail1}</p>
                <p>Phno:{headerData?.customermobileno}</p>
                <p>{headerData?.vat_cst_pan}</p>
                <p>{headerData?.Cust_CST_STATE} {headerData?.Cust_CST_STATE_No}</p>
            </div>
            <div className="col-4 border-end p-2"></div>
            <div className="col-4 p-2"></div>
        </div>
    
 
    </div>
    {/* <SampleDetailPrint11 /> */}
</> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
  )
}

export default RetailPrint2
