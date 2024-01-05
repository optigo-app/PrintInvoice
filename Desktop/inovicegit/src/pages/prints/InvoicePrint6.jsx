import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/invoicePrint6.module.css";
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
import Loader from "../../components/Loader";
import { ToWords } from "to-words";
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';

const InvoicePrint6 = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState([]);
    const [header, setHeader] = useState(null);
    const [headerData, setHeaderData] = useState({});
    const [address, setAddress] = useState([]);
    const [footer, setFooter] = useState(null);
    const toWords = new ToWords();
    const loadData = (data) => {
        // console.log(data);
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
                        className="btn_white blue py-2 mt-2"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            {/* header */}
            {header}
            {/* bill no */}
            <div className="d-flex justify-content-end py-1">
                <div className="col-4 border">
                    <p>
                        <span className="fw-semibold px-2">BILL NO </span>{" "}
                        {headerData?.InvoiceNo}
                    </p>
                    <p>
                        <span className="fw-semibold px-2">DATE </span>{" "}
                        {headerData?.EntryDate}
                    </p>
                    <p>
                        <span className="fw-semibold px-2">HSN </span> {headerData?.HSN_No}
                    </p>
                </div>
            </div>
            {/* sub header */}
            <div className="d-flex border mb-1 align-items-center">
                <div className="col-8 p-2 border-end">
                    <p className="fw-semibold">{headerData?.lblBillTo} {headerData?.customerfirmname}</p>
                    <p>{headerData?.customerAddress1}</p>
                    <p>{headerData?.customerregion}</p>
                    <p>
                        {headerData?.customercity}
                        {headerData?.customerpincode}
                    </p>
                    <p>STATE NAME : {headerData?.customerstate}</p>
                    <p>{headerData?.vat_cst_pan}</p>
                </div>
                <div className="col-4 p-2">
                    <p>
                        <span className="fw-semibold pe-2">GSTIN : </span>{" "}
                        {headerData?.CustGstNo}
                    </p>
                    <p>
                        <span className="fw-semibold pe-2">STATE CODE : </span>{" "}
                        {headerData?.Cust_CST_STATE_No}
                    </p>
                    <p>
                        <span className="fw-semibold pe-2">PAN NO : </span>{" "}
                        {headerData?.CustPanno}
                    </p>
                </div>
            </div>
            {/* table header */}
            <div className="d-flex border">
                <div className="col-3 border-end">
                    <p className="fw-bold text-center">DESCRIPTION</p>
                </div>
                <div className="col-9 d-flex">
                    <div className="col-4">
                        <p className="fw-bold text-center px-1">DETAIL</p>
                    </div>
                    <div className="col-8 d-flex">
                        <div className="col-4"><p className="fw-bold text-end px-1">WEIGHT</p></div>
                        <div className="col-4"><p className="fw-bold text-end px-1">RATE</p></div>
                        <div className="col-4"><p className="fw-bold text-end px-1">AMOUNT</p></div>
                    </div>
                </div>
            </div>
            {/* table data */}
            <div className="d-flex border-start border-end border-bottom">
                <div className="col-3 border-end d-flex justify-content-center align-items-center pb-4">
                    <p className="text-center">GOLD BAR</p>
                </div>
                <div className="col-9 d-flex pb-4">
                    <div className="col-4">
                        <p className="px-1">GOLD 14K</p>
                        <p className="px-1">GOLD 14K</p>
                        <p className="px-1">GOLD 14K</p>
                        <p className="px-1">GOLD 14K</p>
                    </div>
                    <div className="col-8 d-flex">
                        <div className="col-4">
                            <p className="text-end px-1">9.337</p>
                            <p className="text-end px-1">9.337</p>
                            <p className="text-end px-1">9.337</p>
                        </div>
                        <div className="col-4">
                            <p className="text-end px-1">296.00</p>
                            <p className="text-end px-1">296.00</p>
                            <p className="text-end px-1">296.00</p>
                        </div>
                        <div className="col-4">
                            <p className="text-end px-1">2,763.75</p>
                            <p className="text-end px-1">2,763.75</p>
                            <p className="text-end px-1">2,763.75</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* table total */}
            <div className="d-flex border-start border-end border-bottom mb-1">
                <div className="col-3 border-end d-flex justify-content-center align-items-center pb-4">
                    <p className="text-center"></p>
                </div>
                <div className="col-9 d-flex justify-content-between">
                    <p className="px-1 fw-bold">Total</p>
                    <p className="text-end px-1 fw-bold">86,452.97</p>
                </div>
            </div>
            {/* taxes */}
            <div className="d-flex border mb-1 justify-content-end">
                <div className="col-4">
                    <p><span className="fw-bold"> Note:</span> Insert remark here</p>
                </div>
                <div className="col-5 border p-1">
                    <div className="d-flex justify-content-between">
                        <p>Discount	</p>
                        <p>949.60</p>
                    </div>
                </div>
            </div>
            {/* footer */}
            <div className="d-flex border mt-1">
                <div className="col-4 border-end p-2">
                    <p className="fw-bold">Bank Detail</p>
                    <p>Bank Name: {headerData?.bankname}</p>
                    <p>Branch: {headerData?.bankaddress}</p>
                    <p>Account Name: {headerData?.accountname}</p>
                    <p>Account No. : {headerData?.accountnumber}</p>
                    <p>RTGS/NEFT IFSC: {headerData?.rtgs_neft_ifsc}</p>
                </div>
                <div className="col-4 border-end p-2 d-flex flex-column justify-content-between">
                    <p className="fw-bold">Signature</p>
                    <p>
                        <span className="fw-bold">{headerData?.CustName}</span>
                        <span className={`${style?.sup}`}></span> (With Stamp)
                    </p>
                </div>
                <div className="col-4 p-2 d-flex flex-column justify-content-between">
                    <p className="fw-bold">Signature</p>
                    <p className="fw-bold">{headerData?.CompanyFullName}</p>
                </div>
            </div>
        </div>
    ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
        </p>
    );
}

export default InvoicePrint6