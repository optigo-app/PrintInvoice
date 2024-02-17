import React, { useEffect, useState } from 'react'
import style from "../../assets/css/prints/solitaireTaxInvoice.module.css";
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

const SolitaireTaxInvoice = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
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
        let resultArray = [];
        datas?.resultArray?.map((e, i) => {
            let obj = cloneDeep(e);
            let metalRate = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1)?.Rate || 0;
            obj.metalRate = metalRate;
            resultArray.push(obj);
        });
        datas.resultArray = resultArray;
        setData(datas);
        console.log(datas);
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
            <div className={`container max_width_container ${style?.solitaireTaxInvoice} pad_60_allPrint px-1 mt-1`}>
                {/* buttons */}
                <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
                    <div className="form-check ps-3">
                        <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* header */}
                <div className="d-flex border p-2 justify-content-between align-items-center">
                    <p className="fw-bold" style={{ fontSize: "22px" }}>{headerData?.PrintHeadLabel}</p>
                    <img src={headerData?.PrintLogo} alt='logo' className='logoimg' />
                </div>
                {/* sub header */}
                <div className="d-flex border-start border-end border-bottom p-2 justify-content-between">
                    <div className="col-6">
                        <p>{headerData?.lblBillTo}</p>
                        <p className='fs-6 fw-bold'>{headerData?.customerfirmname}</p>
                        <p>{headerData?.customerstreet}</p>
                        <p>{headerData?.customerregion}</p>
                        <p>{headerData?.customercity} - {headerData?.PinCode}</p>
                        <p>Tel : {headerData?.customermobileno}</p>
                        <p>{headerData?.CompanyEmail}</p>
                    </div>
                    <div className="col-4">
                        <p>Invoice#: <span className="fw-bold">{headerData?.InvoiceNo}</span> Dated <span className="fw-bold"> {headerData?.EntryDate}</span></p>
                        <p>{headerData?.HSN_No_Label}: <span className="fw-bold">{headerData?.HSN_No}</span></p>
                        <p>PAN#: <span className="fw-bold">PAN2023</span></p>
                        <p>GSTIN <span className="fw-bold">GST2023 | </span>STATE CODE GS</p>
                        <p>Ref.Name: <span className="fw-bold">Umesh Bhoi</span></p>
                    </div>
                </div>
            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default SolitaireTaxInvoice;
