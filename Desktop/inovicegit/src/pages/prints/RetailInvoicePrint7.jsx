import React, { useEffect, useState } from 'react'
import style from "../../assets/css/prints/retailInvoicePrint7.module.css";
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

const RetailInvoicePrint7 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
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
            <div className={`container max_width_container ${style?.retailInvoicePrint7} pad_60_allPrint px-1 mt-1`}>
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
                {/* table header */}
                <div className="pt-1">
                    <div className=" d-flex border">
                        <div className={`${style?.Sr} py-1 d-flex justify-content-center align-items-center border-end`}><p className="fw-bold">Sr#</p></div>
                        <div className={`${style?.Product} py-1 d-flex justify-content-center align-items-center border-end`}><p className="fw-bold">Product Description</p></div>
                        <div className={`${style?.Material} border-end`}>
                            <div className="d-grid h-100">
                                <div className="d-flex border-bottom"><p className="fw-bold w-100 text-center py-1">Material Description</p></div>
                                <div className="d-flex">
                                    <p className="fw-bold col-3 text-center border-end py-1">Material</p>
                                    <p className="fw-bold col-3 text-center border-end py-1">Purity</p>
                                    <p className="fw-bold col-3 text-center border-end py-1">Quantity</p>
                                    <p className="fw-bold col-3 text-center py-1">Rate</p>
                                </div>
                            </div>
                        </div>
                        <div className={`${style?.Total} py-1 d-flex justify-content-center align-items-center`}><p className="fw-bold">Total</p></div>
                    </div>
                </div>
                {/* table body */}
                {data?.resultArray?.map((e, i) => {
                    return <div className=" d-flex border-start border-end border-bottom no_break" key={i}>
                        <div className={`${style?.Sr} p-1 d-flex justify-content-center align-items-center border-end`}><p className=" text-center">{NumberWithCommas(i + 1, 0)}</p></div>
                        <div className={`${style?.Product} p-1 border-end`}>
                            <p className="">{e?.SubCategoryname}  {e?.Categoryname} </p>
                            <p className="">{e?.designno} | {e?.SrJobno}</p>
                            {/* <p className="text-center">HUID-{e?.HUID}</p> */}
                        </div>
                        <div className={`${style?.Material} border-end`}>
                            <div className="d-grid h-100">
                                <div className="d-flex" >
                                    <p className="  col-3 border-end p-1">{e?.MetalType}</p>
                                    <div className="col-3 border-end p-1"> <p>{e?.MetalPurity}</p> </div>
                                    <p className="  col-3 text-end border-end p-1">{NumberWithCommas(e?.Quantity, 0)}</p>
                                    <p className="  col-3 text-end p-1">{NumberWithCommas(e?.metalRate, 2)}</p>
                                </div>
                            </div>
                        </div>
                        <div className={`${style?.Total} p-1 text-end`}><p className="">{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
                    </div>
                })
                }
                {/* table total */}
                <div className=" d-flex border-start border-end border-bottom no_break">
                    <div className={`${style?.Sr} p-1 d-flex justify-content-center align-items-center border-end`}></div>
                    <div className={`${style?.Product} p-1 border-end`}><p className="fw-bold fs-6">TOTAL</p></div>
                    <div className={`${style?.Material} border-end d-flex `}>
                        <p className="   col-3 border-end p-1"></p>
                        <p className="   col-3 border-end p-1"></p>
                        <p className="   col-3 text-end border-end p-1 fw-bold"></p>
                        <div className=" col-3 text-end p-1 fw-bold"> <p></p> </div>
                    </div>
                    <div className={`${style?.Total} p-1 text-end`}><p className="fw-bold">{NumberWithCommas(data?.mainTotal?.total_unitcost / headerData?.CurrencyRate, 2)}</p></div>
                </div>
                {/* in words */}
                <div className="d-flex border-start border-end border-bottom no_break">
                    <div className={`${style?.inwords} border-end d-flex flex-column justify-content-between py-1`}>
                        <div></div>
                        <div>
                            <p className='px-1'>In Words Indian Rupees</p>
                            <p className='px-1 fw-bold'>{toWords?.convert(+fixedValues(data?.finalAmount / headerData?.CurrencyRate, 2))} Only</p>
                        </div>
                        <div><p className='px-1'>Old Gold Purchase Description : <span className="fw-bold">{headerData?.PrintRemark}</span>	</p></div>
                    </div>
                    <div className={`${style?.taxes} border-end`}>
                        {/* <p className="text-end px-1">Discount</p> */}
                        <p className="text-end px-1">Total Amt. </p>
                        {data?.allTaxes?.map((e, i) => {
                            return <p className="text-end px-1" key={i}>{e?.name} @ {e?.per}</p>
                        })}
                        {headerData?.AddLess !== 0 && <p className="text-end px-1">{headerData?.AddLess > 0 ? "Add" : "Less"}</p>}
                        {/* <p className="text-end px-1">Total Amt. after Tax</p> */}
                        <p className="text-end px-1">Old Silver</p>
                        <p className="text-end px-1">Recv.in Cash</p>
                        <p className="text-end px-1">Recv.in Bank</p>
                        <p className="text-end px-1">Net Bal. Amount</p>
                        <p className="text-end mt-1 border-top p-1 fw-bold">GRAND TOTAL</p>
                    </div>
                    <div className={`${style?.Total}`}>
                        {/* <p className='text-end px-1'>{NumberWithCommas(data?.mainTotal?.total_discount_amount, 2)}</p> */}
                        <p className='text-end px-1'>{NumberWithCommas(data?.mainTotal?.total_amount / headerData?.CurrencyRate, 2)}</p>
                        {data?.allTaxes?.map((e, i) => {
                            return <p className="text-end px-1" key={i}>{e?.amount}</p>
                        })}
                        {headerData?.AddLess !== 0 && <p className="text-end px-1">{NumberWithCommas(headerData?.AddLess, 2)}</p>}
                        {/* <p className='text-end px-1'>{NumberWithCommas(data?.mainTotal?.total_amount / headerData?.CurrencyRate, 2)}</p> */}
                        <p className='text-end px-1'>{NumberWithCommas(headerData?.OldGoldAmount, 2)}</p>
                        <p className='text-end px-1'>{NumberWithCommas(headerData?.CashReceived, 2)}</p>
                        <p className='text-end px-1'>{NumberWithCommas(headerData?.BankReceived, 2)}</p>
                        <p className='text-end px-1'>{NumberWithCommas(data?.finalAmount / headerData?.CurrencyRate, 2)}</p>
                        <p className="text-end mt-1 border-top p-1 fw-bold"><span dangerouslySetInnerHTML={{__html: headerData?.Currencysymbol}} className='pe-1'></span>{NumberWithCommas(data?.finalAmount / headerData?.CurrencyRate, 2)}</p>
                    </div>
                </div>
                {/* declaration */}
                <div className="border-start border-end border-bottom p-2 no_break">
                    <div dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}></div>
                </div>
                {/* bank details */}
                {footer}
            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default RetailInvoicePrint7
