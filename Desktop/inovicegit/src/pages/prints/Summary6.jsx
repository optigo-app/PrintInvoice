import React, { useEffect, useState } from 'react';
import {
    FooterComponent,
    HeaderComponent,
    apiCall,
    fixedValues,
    handleImageError,
    isObjectEmpty,
    numberToWord,
    NumberWithCommas,
    taxGenrator,
    handlePrint
} from "../../GlobalFunctions";
import style from '../../assets/css/prints/summary6.module.css';
import Loader from "../../components/Loader";
import { ToWords } from "to-words";
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';


const Summary6 = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const [header, setHeader] = useState(null);
    const [headerData, setHeaderData] = useState({});
    const [address, setAddress] = useState([]);
    const [footer, setFooter] = useState(null);
    const toWords = new ToWords();

    const loadData = (data) => {
        let head = HeaderComponent("1", data?.BillPrint_Json[0]);
        setHeader(head);
        setHeaderData(data?.BillPrint_Json[0]);
        let adr = data?.BillPrint_Json[0]?.Printlable.split(`\r\n`);
        setAddress(adr);
        setFooter(FooterComponent("2", data?.BillPrint_Json[0]));
        let datas = OrganizeDataPrint(
            data?.BillPrint_Json[0],
            data?.BillPrint_Json1,
            data?.BillPrint_Json2
        );
        console.log(datas);
        setData(datas);
    };

    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls, evn);
                if (data?.Status === "200") {
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
        };
        sendData();
    }, []);

    return loader ? (
        <Loader />
    ) : msg === "" ? (
        <div
            className={`container container-fluid max_width_container mt-1 ${style?.taxinvoice5} pad_60_allPrint`}
        >
            {/* buttons */}
            <div
                className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}
            >
                <div className="form-check ps-3">
                    <input
                        type="button"
                        className="btn_white blue py-1 mt-2"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            {/* header */}
            {header}
            <div className="border-bottom"></div>
            {/* bill info */}
            <div className="mt-2 border d-flex justify-content-between">
                <div className="col-6">
                    <p><span className="fw-bold px-2">##: </span>{headerData?.InvoiceNo}</p>
                </div>
                <div className="col-3 px-2">
                    <p> <span className="fw-bold">DATE : </span> 	{headerData?.EntryDate}  </p>
                    <p> <span className="fw-bold"> {headerData?.HSN_No_Label} :</span>	{headerData?.HSN_No}  </p>
                </div>
            </div>
            {/* customer details */}
            <div className="border-start border-end border-bottom d-flex px-2 pb-2 pt-1">
                <div className="col-6">
                    <p className="fw-bold fs-5">{headerData?.customerfirmname} </p>
                    <p>{headerData?.customerregion}</p>
                    <p>{headerData?.customercity} </p>
                    <p>{headerData?.customermobileno}</p>
                    <p>GSTIN-{headerData?.CustGstNo} | {headerData?.Cust_CST_STATE}-{headerData?.Cust_CST_STATE_No} | PAN-{headerData?.CustPanno}</p></div>
                <div className="col-6"></div>
            </div>
            SR#	DESIGNS / CODE	METAL	GWT	NWT	DPCS	DWT	CSPCS	CSWT.	OTHER	TOTAL
            <div className="d-flex">
                <div className={`${style?.sr}`}>sr
                </div>
                <div className={`${style?.design}`}>design
                </div>
                <div className={`${style?.metal}`}>metal
                </div>
                <div className={`${style?.gwt}`}>gwt
                </div>
                <div className={`${style?.nwt}`}>nwt
                </div>
                <div className={`${style?.dpcs}`}>dpcs
                </div>
                <div className={`${style?.dwt}`}>dwt
                </div>
                <div className={`${style?.cspcs}`}>cspcs
                </div>
                <div className={`${style?.cswt}`}>cswt
                </div>
                <div className={`${style?.order}`}>order
                </div>
                <div className={`${style?.total}`}>total
                </div>
            </div>
        </div>
    ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
        </p>
    );
}

export default Summary6