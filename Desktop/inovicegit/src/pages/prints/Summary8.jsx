import React, { useEffect, useState } from 'react'
import { ToWords } from 'to-words';
import {
    apiCall,
    isObjectEmpty,
    NumberWithCommas,
    handlePrint
} from "../../GlobalFunctions";

import style from '../../assets/css/prints/summary8.module.css';
import Loader from "../../components/Loader";
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import style2 from "../../assets/css/headers/header1.module.css";
import footerStyle from "../../assets/css/footers/footer2.module.css";

const Summary8 = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const [summary, setSummary] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const toWords = new ToWords();

    const loadData = (data) => {
        setHeaderData(data?.BillPrint_Json[0]);
        let datas = OrganizeDataPrint(
            data?.BillPrint_Json[0],
            data?.BillPrint_Json1,
            data?.BillPrint_Json2
        );
        let resultArray = [];
        let summaries = [];

        datas?.resultArray.map((e, i) => {
            let metalRate = e?.metal.find((elem, index) => elem?.IsPrimaryMetal === 1);
            let findRecord = resultArray.findIndex((ele, ind) => e?.MetalTypePurity === ele?.MetalTypePurity &&
                metalRate?.Rate === ele?.metalRate &&
                e?.Categoryname === ele?.Categoryname &&
                e?.MaKingCharge_Unit === ele?.MaKingCharge_Unit);
            if (findRecord === -1) {
                let obj = { ...e };
                obj.metalRate = metalRate?.Rate;
                resultArray.push(obj);
            } else {
                resultArray[findRecord].totals.metal.Pcs += e.totals.metal.Pcs;
                resultArray[findRecord].grosswt += e.grosswt;
                resultArray[findRecord].NetWt += e.NetWt;
                resultArray[findRecord].TotalAmount += e.TotalAmount;
                resultArray[findRecord].Quantity += e.Quantity;
            }
            let findSummary = summaries.findIndex(ele => ele?.MetalTypePurity === e?.MetalTypePurity);
            if (findSummary === -1) {
                summaries.push({ MetalTypePurity: e?.MetalTypePurity, grosswt: e?.grosswt });
            } else {
                summaries[findSummary].grosswt += e?.grosswt;
            }
        });
        setSummary(summaries);
        datas.resultArray = resultArray;
        datas?.resultArray.sort((acc, cobj) => acc.Categoryname.localeCompare(cobj.Categoryname));
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
            className={`container container-fluid max_width_container mt-1 ${style?.summary8} pad_60_allPrint`}
        >
            {/* buttons */}
            <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`} >
                <div className={`form-check ps-3 ${style?.printBtn}`}>
                    <input
                        type="button"
                        className="btn_white blue py-2 mt-2"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            {/* header */}
            <div className={`${style2.headline} headerTitle`}>{headerData?.PrintHeadLabel}</div>
            <div className={style2.companyDetails}>
                <div style={{ width: "43%" }} className="d-flex align-item-center h-100"><img src={headerData?.PrintLogo} alt="" className={style2.headerImg} style={{ maxWidth: "145px"}}/></div>
                <div className={`${style2.companyhead} p-2`} style={{ width: "57%" }}>
                    <div className={style2.lines} style={{ fontWeight: "bold" }}>
                        {headerData?.CompanyFullName}
                    </div>
                    <div className={style2.lines}>{headerData?.CompanyAddress}</div>
                    <div className={style2.lines}>{headerData?.CompanyAddress2}</div>
                    <div className={style2.lines}>{headerData?.CompanyCity}-{headerData?.CompanyPinCode},{headerData?.CompanyState}({headerData?.CompanyCountry})</div>
                    {/* <div className={style2.lines}>Tell No: {headerData?.CompanyTellNo}</div> */}
                    <div className={style2.lines}>T:  {headerData?.CompanyTellNo}
                        {/* | TOLL FREE {headerData?.CompanyTollFreeNo} | TOLL FREE {headerData?.CompanyTollFreeNo} */}
                    </div>
                    <div className={style2.lines}>
                        {headerData?.CompanyEmail} | {headerData?.CompanyWebsite}
                    </div>
                    <div className={style2.lines}>
                        {/* {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber} */}
                        {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber}
                    </div>
                </div>
            </div>
            {/* title */}
            <div className="lightGrey p-1 text-center border border-black">
                <p className="fs-4 fw-bold">{headerData?.PrintHeadLabel}</p>
            </div>
            {/* customer details */}
            <div className="py-1">
                <div className="d-flex justify-content-between">
                    <div className="col-6 px-1">
                        <p>{headerData?.lblBillTo}</p>
                        <p className="fw-bold">{headerData?.customerfirmname}</p>
                        <p>{headerData?.customerAddress1}</p>
                        <p>{headerData?.customerAddress2}</p>
                        <p>{headerData?.customerAddress3}</p>
                        <p>{headerData?.customercity} - {headerData?.PinCode}</p>
                        <p>Tel : {headerData?.customermobileno}</p>
                        <p>{headerData?.customeremail1}</p>
                        <p>{headerData?.Cust_CST_STATE_No_}</p>
                        <p>{headerData?.CustGstNo} | PAN-{headerData?.CustPanno}</p>
                    </div>
                    <div className="col-3 px-1">
                        <p>Date :<span className="fw-bold"> {headerData?.EntryDate}</span></p>
                        <p>Invoice No :<span className="fw-bold"> {headerData?.InvoiceNo}</span></p>
                        <p>Due Date:<span className="fw-bold"> {headerData?.DueDate}</span></p>
                    </div>
                </div>
            </div>
            {/* table header */}
            <div className="d-flex border border-black lightGrey" >
                <div className={`${style?.Category} p-1 fw-bold text-center border-black border-end`}><p>Category</p></div>
                <div className={`${style?.Metal} p-1 fw-bold text-center border-black border-end`}><p>Metal</p></div>
                <div className={`${style?.Hsn} p-1 fw-bold text-center border-black border-end`}><p>HSN</p></div>
                <div className={`${style?.Pcs} p-1 fw-bold text-center border-black border-end`}><p>Pcs</p></div>
                <div className={`${style?.Gross} p-1 fw-bold text-center border-black border-end`}><p>Gross</p></div>
                <div className={`${style?.Net} p-1 fw-bold text-center border-black border-end`}><p>Net Wt</p></div>
                <div className={`${style?.Rate} p-1 fw-bold text-center border-black border-end`}><p>Rate</p></div>
                <div className={`${style?.Making} p-1 fw-bold text-center border-black border-end`}><p>Making Rate</p></div>
                <div className={`${style?.Total} p-1 fw-bold text-center`}><p>Total Amount</p></div>
            </div>
            {/* table data */}
            {data?.resultArray.map((e, i) => {
                return <div className="d-flex border-start border-end border-bottom border-black">
                    <div className={`${style?.Category} p-1 border-black border-end`}><p>{e?.Categoryname}</p></div>
                    <div className={`${style?.Metal} p-1 border-black border-end`}><p>{e?.MetalTypePurity}</p></div>
                    <div className={`${style?.Hsn} p-1 border-black border-end`}><p>{headerData?.HSN_No}</p></div>
                    <div className={`${style?.Pcs} p-1 text-end border-black border-end`}><p>{NumberWithCommas(e?.Quantity, 0)}</p></div>
                    <div className={`${style?.Gross} p-1 text-end border-black border-end`}><p>{NumberWithCommas(e?.grosswt, 3)}</p></div>
                    <div className={`${style?.Net} p-1 text-end border-black border-end`}><p>{NumberWithCommas(e?.NetWt + e?.LossWt, 3)}</p></div>
                    <div className={`${style?.Rate} p-1 text-end border-black border-end`}><p>{NumberWithCommas(e?.metalRate, 2)}</p></div>
                    <div className={`${style?.Making} p-1 text-end border-black border-end`}><p>{NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p></div>
                    <div className={`${style?.Total} p-1 text-end`}><p>{NumberWithCommas(e?.TotalAmount / headerData?.CurrencyExchRate, 2)}</p></div>
                </div>
            })
            }
            {/* table total */}
            <div className="d-flex border border-black my-1 lightGrey">
                <div className={`${style?.Category} p-1 border-black border-end fw-bold`}><p>TOTAL</p></div>
                <div className={`${style?.Metal} p-1 border-black border-end`}><p></p></div>
                <div className={`${style?.Hsn} p-1 border-black border-end`}><p></p></div>
                <div className={`${style?.Pcs} p-1 text-end border-black border-end fw-bold`}><p>{NumberWithCommas(data?.mainTotal?.total_Quantity, 0)}</p></div>
                <div className={`${style?.Gross} p-1 text-end border-black border-end fw-bold`}><p>{NumberWithCommas(data?.mainTotal?.grosswt, 3)}</p></div>
                <div className={`${style?.Net} p-1 text-end border-black border-end fw-bold`}><p>{NumberWithCommas(data?.mainTotal?.netwtWithLossWt, 3)}</p></div>
                <div className={`${style?.Rate} p-1 text-end border-black border-end`}><p></p></div>
                <div className={`${style?.Making} p-1 text-end border-black border-end`}><p></p></div>
                <div className={`${style?.Total} p-1 text-end fw-bold`}><p>{NumberWithCommas(data?.mainTotal?.total_amount / headerData?.CurrencyExchRate, 2)}</p></div>
            </div>
            {/* table taxes */}
            <div className="border border-black my-1 lightGrey">
                {data?.allTaxes?.map((e, i) => {
                    return <div className="d-flex border-black border-bottom" key={i}>
                        <div className={`${style?.tax} p-1 border-black border-end fw-semibold text-end`}><p>{e?.name} @ {e?.per} </p></div>
                        <div className={`${style?.Total} p-1 text-end fw-semibold`}><p>{e?.amount}</p></div>
                    </div>
                })}

                {headerData?.AddLess !== 0 && <div className="d-flex border-black border-bottom">
                    <div className={`${style?.tax} p-1 border-black border-end fw-semibold text-end`}><p>ADD/LESS </p></div>
                    <div className={`${style?.Total} p-1 text-end fw-semibold`}><p>{NumberWithCommas(headerData?.AddLess, 2)}</p></div>
                </div>}
                <div className="d-flex">
                    <div className={`${style?.tax} p-1 border-black border-end fw-semibold text-end`}><p>GRAND TOTAL </p></div>
                    <div className={`${style?.Total} p-1 text-end fw-semibold`}><p>{NumberWithCommas(data?.finalAmount, 2)}</p></div>
                </div>
            </div>
            {/* bank details */}
            <div className={`d-flex no_break border-black p-0 h-100 py-0 align-items-start mb-0 border`}>
                <div className={`col-4 border-black p-2`} style={{ width: "33.33%" }} >
                    <div className={footerStyle.linesf3}>Payment Details</div>
                </div>
                <div className={`col-4  border-black border-end border-start p-2`} style={{ width: "33.33%" }}>
                    {summary.map((e, i) => {
                        return <div className="d-flex w-100" key={i}>
                            <div className="col-6 fw-normal">{e?.MetalTypePurity}</div>
                            <div className="col-6 fw-normal">{NumberWithCommas(e?.grosswt, 3)}</div>
                        </div>
                    })}
                    <div className="d-flex w-100" >
                        <div className="col-6 fw-normal">Gross Wt:</div>
                        <div className="col-6 fw-normal">{NumberWithCommas(data?.mainTotal?.grosswt, 3)}</div>
                    </div>
                    <div className="d-flex w-100" >
                        <div className="col-6 fw-normal">Net Wt:</div>
                        <div className="col-6 fw-normal">{NumberWithCommas(data?.mainTotal?.netwt, 3)}</div>
                    </div>
                </div>
                <div className={`col-4 p-2`} style={{ width: "33.33%", borderRight: "1px solid #e8e8e8" }} >
                    <div className={footerStyle.linesf3} style={{ fontWeight: "bold" }}>Bank Detail</div>
                    <div className={footerStyle.linesf3}>Bank Name: {headerData?.bankname}</div>
                    <div className={footerStyle.linesf3}>Branch: {headerData?.bankaddress}</div>
                    <div className={footerStyle.linesf3}>Account Name: {headerData?.accountname}</div>
                    <div className={footerStyle.linesf3}>Account No. : {headerData?.accountnumber}</div>
                    <div className={footerStyle.linesf3}>RTGS/NEFT IFSC: {headerData?.rtgs_neft_ifsc}</div>
                </div>
            </div>
            {/* footer */}
            <div className="my-1 border border-black d-flex ">
                <div className="col-6 d-flex flex-column justify-content-between p-2 border-end border-black" style={{ minHeight: "200px" }}>
                    <p> Signature</p>
                    <p className='fw-bold'>{headerData?.customerfirmname}</p>
                </div>
                <div className="col-6 d-flex flex-column justify-content-between p-2" style={{ minHeight: "200px" }}>
                    <p> Signature</p>
                    <p className='fw-bold'>{headerData?.CompanyFullName}</p>
                </div>
            </div>
        </div>
    ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
        </p>
    );
}

export default Summary8