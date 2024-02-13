import React, { useEffect, useState } from 'react'
import style from "../../assets/css/prints/retailInvoicePrint3.module.css";
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

const RetailInvoicePrint6 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const toWords = new ToWords();
    const [data, setData] = useState({});
    const [label, setlabel] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const loadData = (data) => {
        let head = HeaderComponent("1", data?.BillPrint_Json[0]);
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
    <div className={`container max_width_container ${style?.retailInvoicePrint3} pad_60_allPrint px-1 mt-1`}>
        {/* buttons */}
        <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
            <div className="form-check ps-3">
                <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
            </div>
        </div>
        {/* header */}
    

    </div>
    {/* <SampleDetailPrint11 /> */}
</> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
  )
}

export default RetailInvoicePrint6
