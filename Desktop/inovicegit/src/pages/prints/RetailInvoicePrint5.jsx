import React, { useEffect, useState } from 'react'
import style from "../../assets/css/prints/retailInvoicePrint5.module.css";
import { ToWords } from 'to-words';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import Loader from '../../components/Loader';
import { cloneDeep } from 'lodash';
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
const RetailInvoicePrint5 = ({ urls, token, invoiceNo, printName, evn}) => {
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const toWords = new ToWords();
    const [data, setData] = useState({});
    const [label, setlabel] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const [header, setheader] = useState(null);
    const loadData = (data) => {
        console.log(data);
        let head = HeaderComponent("1", data?.BillPrint_Json[0]);
        setheader(head);
        let footers = FooterComponent("2", data?.BillPrint_Json[0]);
        setHeaderData(data?.BillPrint_Json[0]);
        let printArr = data?.BillPrint_Json[0]?.Printlable.split("\r\n");
        setlabel(printArr);
        let totals = 0;
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
        console.log(datas);
        setData(datas);
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
    loader ? <Loader /> : msg === "" ? <>
    <div className={`container max_width_container ${style?.retailInvoicePrint3} pad_60_allPrint px-1 mt-1`}>
        {/* buttons */}
        <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
            <div className="form-check ps-3">
                <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
            </div>
        </div>
        {/* header */}
        {/* <div className="bgGrey p-2">
            <p className="fs-5 text-white fw-bold">{headerData?.PrintHeadLabel}</p>
        </div>
        <div className='px-2 pb-2 border-bottom'>
            <p className="fs-5 fw-bold">{headerData?.CompanyFullName}</p>
            <p>{headerData?.CompanyAddress}</p>
            <p>{headerData?.CompanyCity}-{headerData?.CompanyPinCode}, {headerData?.CompanyState}({headerData?.CompanyCountry})</p>
            <p>T {headerData?.CompanyTellNo} | TOLL FREE {headerData?.CompanyTollFreeNo}</p>
            <p>{headerData?.CompanyEmail} | {headerData?.CompanyWebsite}</p>
        </div> */}
        {header}
        <div className="border d-flex">
            <div className="col-8 border-end px-2">
                <p>To, </p>
                <p className='fw-bold'>Prashant Rajput</p>
                <p>Karawan naka</p>
                <p>Near nimzari naka</p>
                <p>Shirpur-425405</p>
                <p>India</p>
                <p>darren@orail.co.in</p>
                <p>Phno:951-021-3588</p>
                <p>GSTIN-GST2023 | PAN-PAN2023 | Aadhar-20231017</p>
                <p>STATE CODE-GS</p>
            </div>
            <div className="col-4 px-2">
                <p>INVOICE NO	SK19082022</p>
                <p>DATE	09 Feb 2024</p>
                <p>HSN	85213</p>
                <p>Reverse Charge	 Yes  No</p>
                <p>AADHAR CARD	ABCDF</p>
                <p>NRI ID	!@$%^</p>
                <p>FOREIGN PASSPORT	%^</p>
            </div>
        </div>

    </div>
    {/* <SampleDetailPrint11 /> */}
</> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
  )
}

export default RetailInvoicePrint5
