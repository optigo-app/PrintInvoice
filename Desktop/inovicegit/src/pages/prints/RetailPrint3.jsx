import React, { useEffect, useState } from 'react'
import style from "../../assets/css/prints/RetailPrint3.module.css";
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

const RetailPrint3 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
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
            let diamonds = [];
            obj?.diamonds?.forEach((ele, ind) => {
                let findDiamond = diamonds?.findIndex((elem, index) => elem?.QualityName === ele?.QualityName);
                if (findDiamond === -1) {
                    diamonds.push(ele);
                } else {
                    diamonds[findDiamond].Pcs += ele?.Pcs;
                    diamonds[findDiamond].Wt += ele?.Wt;
                    diamonds[findDiamond].Amount += ele?.Amount;
                }
            });
            obj.quaDia = diamonds;
            resultArray.push(obj);
        });
        datas.resultArray = resultArray;
        console.log(datas);
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
            <div className={`container max_width_container ${style?.RetailPrint3} pad_60_allPrint px-1 mt-1 RetailPrint3`}>
                {/* buttons */}
                <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
                    <div className="form-check ps-3">
                        <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* header line */}
                <div className="bgGrey px-2 py-1 text-white">
                    <p className="text-white fs-5 fw-bold">TAX INVOICE</p>
                </div>
                {/* header */}
                <div className="my-1 border d-flex">
                    <div className="col-7 p-2">
                        <p>{headerData?.lblBillTo}</p>
                        <p className='fw-bold'>{headerData?.customerfirmname}</p>
                        <p>Address: {headerData?.customerAddress1}</p>
                        <p>{headerData?.customerAddress2}</p>
                        <p>{headerData?.customercity1}-{headerData?.PinCode}</p>
                        <p>{headerData?.customeremail1}</p>
                    </div>
                    <div className="col-5 p-2">
                        <div className="d-flex">
                            <p className='fw-bold col-6'>Tax Invoice No:</p>
                            <p className='col-6'>: {headerData?.InvoiceNo}</p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-6'>Date	:</p>
                            <p className='col-6'>: {headerData?.EntryDate}</p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-6'>{headerData?.HSN_No_Label}/SAC</p>
                            <p className='col-6'>:  {headerData?.HSN_No}</p>
                        </div>
                        <p className='fw-bold'>GSTIN-{headerData?.CustGstNo}</p>
                        <p className='fw-bold'>{headerData?.Cust_CST_STATE}-{headerData?.Company_CST_STATE_No}</p>
                        <p className='fw-bold'>PAN-{headerData?.CustPanno}</p>
                        <p> </p>
                    </div>
                </div>
                {/* table header */}
                <div className="d-flex border">
                    <div className={`d-flex justify-content-center align-items-center ${style?.Sr} border-end`}><p className="fw-bold text-center p-1"> Sr#	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Product} border-end`}><p className="fw-bold text-center p-1"> Product Description	</p></div>
                    <div className={`${style?.Material}`}>
                        <div className="d-grid h-100">
                            <div className="d-flex border-bottom"><p className="fw-bold w-100 text-center p-1">Material Description</p></div>
                            <div className="d-flex">
                                <p className="fw-bold w-100 text-center border-end p-1">Material</p>
                                <p className="fw-bold w-100 text-center border-end p-1">Qty</p>
                                <p className="fw-bold w-100 text-center border-end p-1">Color</p>
                                <p className="fw-bold w-100 text-center border-end p-1">Pcs</p>
                                <p className="fw-bold w-100 text-center border-end p-1">GWt.</p>
                                <p className="fw-bold w-100 text-center border-end p-1">NWt.</p>
                                <p className="fw-bold w-100 text-center border-end p-1">Rate</p>
                                <p className="fw-bold w-100 text-center border-end p-1">Amount</p>
                                <p className="fw-bold w-100 text-center border-end p-1">Making</p>
                                <p className="fw-bold w-100 text-center border-end p-1">Discount</p>
                                <p className="fw-bold w-100 text-center p-1">Total</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* table body */}
                <div className="d-flex border-start border-end border-bottom">
                    <div className={`d-flex justify-content-center align-items-center ${style?.Sr} border-end`}><p className="fw-bold text-center p-1"> 1 </p></div>
                    <div className={`${style?.Product} border-end`}>
                        <p className="fw-bold text-center p-1"> Regular  Necklace </p>
                        <p className="fw-bold text-center p-1"> 1715 | 1/16601 </p>
                        <img src="http://zen/R50B3/UFS/ufs2/orail228FT0OWNGEI6DC3BVS/Design_Image/bD8ZTq6u5WMDE0ODkxMQ==/Red_Thumb/0148911_22112023120600745.jpg?0.52675" alt="" className='imgWidth'/>
                    </div>
                    <div className={`${style?.Material}`}>
                        <div className="d-grid h-100">
                            <div className="d-flex">
                                <p className="fw-bold w-100 text-center border-end p-1">GOLD</p>
                                <p className="fw-bold w-100 text-center border-end p-1">18K</p>
                                <p className="fw-bold w-100 text-center border-end p-1">mix</p>
                                <p className="fw-bold w-100 text-center border-end p-1">5</p>
                                <p className="fw-bold w-100 text-center border-end p-1">10.00</p>
                                <p className="fw-bold w-100 text-center border-end p-1">10.084</p>
                                <p className="fw-bold w-100 text-center border-end p-1">5700.00	</p>
                                <p className="fw-bold w-100 text-center border-end p-1">57478.80</p>
                                <p className="fw-bold w-100 text-center border-end p-1">1996.80	</p>
                                <p className="fw-bold w-100 text-center border-end p-1">0.00</p>
                                <p className="fw-bold w-100 text-center p-1">59605.60</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default RetailPrint3;
