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

const RetailInvoicePrint3 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
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
                <div className="bgGrey p-2">
                    <p className="fs-5 text-white fw-bold">{headerData?.PrintHeadLabel}</p>
                </div>
                <div className='px-2 pb-2 border-bottom'>
                    <p className="fs-5 fw-bold">{headerData?.CompanyFullName}</p>
                    <p>{headerData?.CompanyAddress}</p>
                    <p>{headerData?.CompanyCity}-{headerData?.CompanyPinCode}, {headerData?.CompanyState}({headerData?.CompanyCountry})</p>
                    <p>T {headerData?.CompanyTellNo} | TOLL FREE {headerData?.CompanyTollFreeNo}</p>
                    <p>{headerData?.CompanyEmail} | {headerData?.CompanyWebsite}</p>
                </div>
                <div className="py-2 d-flex justify-content-between">
                    <div className="col-3 px-2">
                        <div className="d-flex border-black border px-2">
                            <div className="col-6 fw-bold"><p>BILL NO :</p></div>
                            <div className="col-6"><p>{headerData?.InvoiceNo}</p></div>
                        </div>
                    </div>
                    <div className="col-3 px-2">
                        <div className="d-flex border-black border px-2">
                            <div className="col-6 fw-bold"><p>{headerData?.HSN_No_Label} :</p></div>
                            <div className="col-6"><p>{headerData?.HSN_No}</p></div>
                        </div>
                    </div>
                    <div className="col-3 px-2">
                        <div className="d-flex border-black border px-2">
                            <div className="col-6 fw-bold"><p>Date :</p></div>
                            <div className="col-6"><p>{headerData?.EntryDate}</p></div>
                        </div>
                    </div>
                </div>
                <div className="border border-black d-flex">
                    <div className='px-2'> <p className="fw-bold">TO,</p>	</div>
                    <div className='px-2'>
                        <p className="fw-bold">{headerData?.CustName}	</p>
                        <p>{headerData?.customerAddress2} {headerData?.customerAddress1} {headerData?.customerAddress3}</p>
                        <p>{headerData?.customerregion}</p>
                        <p>{headerData?.customercity}-{headerData?.PinCode}</p>
                    </div>
                </div>
                <div className="border-start border-end border-bottom border-black d-flex px-2">
                    <p className="fw-bold">test</p>
                </div>
                <div className="border-start border-end border-bottom  border-black">
                    <div className='px-2 border-bottom d-flex'>
                        <div className={`${style?.Variant}`}> <p className=''>Variant No/ Product Description </p></div>
                        <div className={`${style?.KT}`}> <p className='text-center'>KT </p></div>
                        <div className={`${style?.Qty}`}> <p className='text-center'>Qty </p></div>
                        <div className={`${style?.Gross}`}> <p className='text-center'>Gross Wt(gms) </p></div>
                        <div className={`${style?.Dia}`}> <p className='text-center'>Dia Wt  (ctw.) </p></div>
                        <div className={`${style?.Stone}`}> <p className='text-center'>Stone Wt  (ctw.) </p></div>
                        <div className={`${style?.Misc}`}> <p className='text-center'>Misc Wt(gms) </p></div>
                        <div className={`${style?.Net}`}> <p className='text-center'>Net Wt(gms) </p></div>
                        <div className={`${style?.Price}`}> <p className='text-center'>Price(Rs) </p></div>
                        <div className={`${style?.Discount}`}> <p className='text-center'>Discount(Rs) </p></div>
                        <div className={`${style?.Product}`}> <p className='text-end'>Product Amount(Rs) </p></div>
                    </div>
                    {
                        data?.resultArray?.map((e, i) => {
                            return <div className="d-flex px-2 border-bottom" key={i}>
                                <div className={`${style?.Variant}`}> <p className=''>{e?.designno} / {e?.SrJobno} {e?.MetalPurity} {e?.Categoryname}</p></div>
                                <div className={`${style?.KT}`}> <p className='text-center'>{e?.MetalPurity} </p></div>
                                <div className={`${style?.Qty}`}> <p className='text-center'>{e?.Quantity} </p></div>
                                <div className={`${style?.Gross}`}> <p className='text-center'>{NumberWithCommas(e?.grosswt, 3)} </p></div>
                                <div className={`${style?.Dia}`}> <p className='text-center'>{NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}</p></div>
                                <div className={`${style?.Stone}`}> <p className='text-center'>{NumberWithCommas(e?.totals?.colorstone?.Wt, 3)} </p></div>
                                <div className={`${style?.Misc}`}> <p className='text-center'>{NumberWithCommas(e?.totals?.misc?.Wt, 3)} </p></div>
                                <div className={`${style?.Net}`}> <p className='text-center'>{NumberWithCommas(e?.NetWt, 3)}</p></div>
                                <div className={`${style?.Price}`}> <p className='text-center'>{NumberWithCommas(e?.MetalAmount + e?.Making_Amount_Other_Charges, 2)}</p></div>
                                <div className={`${style?.Discount}`}> <p className='text-center'>{NumberWithCommas(e?.DiscountAmt, 2)}</p></div>
                                <div className={`${style?.Product}`}> <p className='text-end'>{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
                            </div>
                        })
                    }

                    <div className="d-flex border-bottom px-2">
                        <div className={`${style?.Variant}`}> <p className=''>Total</p></div>
                        <div className={`${style?.KT}`}> <p className='text-center'> </p></div>
                        <div className={`${style?.Qty}`}> <p className='text-center'>{NumberWithCommas(data?.mainTotal?.total_Quantity, 0)} </p></div>
                        <div className={`${style?.Gross}`}> <p className='text-center'>{NumberWithCommas(data?.mainTotal?.grosswt, 3)}</p></div>
                        <div className={`${style?.Dia}`}> <p className='text-center'>{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)}</p></div>
                        <div className={`${style?.Stone}`}> <p className='text-center'>{NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)} </p></div>
                        <div className={`${style?.Misc}`}> <p className='text-center'>{NumberWithCommas(data?.mainTotal?.misc?.Wt, 3)}</p></div>
                        <div className={`${style?.Net}`}> <p className='text-center'>{NumberWithCommas(data?.mainTotal?.netwt, 3)}</p></div>
                        <div className={`${style?.Price}`}> <p className='text-center'>{NumberWithCommas(data?.mainTotal?.MetalAmount, 2)}</p></div>
                        <div className={`${style?.Discount}`}> <p className='text-center'>{NumberWithCommas(data?.mainTotal?.total_discount_amount, 2)}</p></div>
                        <div className={`${style?.Product}`}> <p className='text-end'>{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p></div>
                    </div>
                    <div className="border-bottom border-black d-flex justify-content-end px-2">
                        <div className="col-4 d-flex justify-content-between">
                            <div><p>Product Total Value</p></div>
                            <div><p>{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p></div>
                        </div>
                    </div>
                    <div className="d-flex">
                        <div className="col-6 border-end border-black position-relative">
                            <p className="fw-bold px-2">Payment Details  </p>
                            <div className="d-flex justify-content-between border-bottom px-2 border-black">
                                <p>Payment Mode</p>
                                <p>Doc No.</p>
                                <p>Customer Name</p>
                                <p>Amount(Rs)</p>
                            </div>
                            <div className="d-flex justify-content-between px-2 border-bottom border-black">
                                <p>NA</p>
                                <p>NA</p>
                                <p></p>
                                <p>NA</p>
                            </div>
                            <div className="d-flex justify-content-between px-2 border-bottom border-black">
                                <p className='fw-bold'>Total Amount Paid</p>
                                <p className='fw-bold'>0.00</p>
                            </div>
                            <div className="d-flex justify-content-between px-2 border-bottom border-black">
                                <p className='fw-bold'>Balance Amount</p>
                                <p className='fw-bold'>Rs.97,51,164</p>
                            </div>
                            <div className="pt-5 px-2 position-absolute bottom-0 left-0">
                                <p className=''> Customer Name : Prashant Rajput</p>
                                <p className='pt-5'>  Customer Signature</p>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="d-flex justify-content-between border-bottom border-black px-2">
                                <p>Total Value</p>
                                <p>{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p>
                            </div>
                            {
                                data?.allTaxes?.map((e, i) => {
                                    return <div className="d-flex justify-content-between border-bottom border-black px-2" key={i}>
                                        <p>{e?.name} @ {e?.per}</p>
                                        <p>{NumberWithCommas(e?.amount, 2)}</p>
                                    </div>
                                })
                            }
                            {headerData?.AddLess !== 0 && <div className="d-flex justify-content-between border-bottom border-black px-2">
                                <p>{headerData?.AddLess > 0 ? "Add" : "Less"}:- Other Discount</p>
                                <p>{NumberWithCommas(Math.abs(headerData?.AddLess), 2)}</p>
                            </div>}
                            <div className="d-flex justify-content-between border-bottom border-black px-2">
                                <p>Value after Discount </p>
                                <p>{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p>
                            </div>
                            <div className="d-flex justify-content-between border-bottom border-black px-2">
                                <p>Net Invoice Value</p>
                                <p>{NumberWithCommas(data?.mainTotal?.total_amount , 2)}</p>
                            </div>
                            <div className="d-flex justify-content-between border-bottom border-black px-2">
                                <p>Total Amount to be paid</p>
                                <p>Rs.Rs.97,51,164</p>
                            </div>
                            <div className=" border-bottom border-black px-2">
                                <p> Value In Words :- Rupees One Lakh Sixty-Eight Thousand Four Hundred and Twenty-Six Only</p>
                            </div>
                            <div className="pt-5 px-2">
                                <p className='pt-5'>For Optigo</p>
                                <p className='pt-5'>Authorised Signatory</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-black border-top px-2">
                        <p className="fw-bold py-1">NOTE:-</p>
                        <div dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}></div>
                    </div>
                </div>

            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default RetailInvoicePrint3
