import React, { useEffect, useState } from 'react'
import { apiCall, handlePrint, isObjectEmpty, HeaderComponent, NumberWithCommas, taxGenrator, numberToWord, ReceiveInBank } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import style from '../../assets/css/prints/retailInovice2_3.module.css';
import Footer2 from '../../components/footers/Footer2';
import { handleImageError } from '../../GlobalFunctions/HandleImageError';


const RetailInvoice2_3 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {

    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [headerComp, setHeaderComp] = useState(null);
    const [json0Data, setJson0Data] = useState({});
    const [retailInvoice3, setRetailInvoice3] = useState(atob(printName).toLowerCase() === "retail invoice 3" ? true : false);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState({
        Qty: 0,
        grosswt: 0,
        diaWt: 0,
        csWt: 0,
        miscWt: 0,
        NetWt: 0,
        UnitCost: 0,
        DiscountAmt: 0,
        TotalAmount: 0,
    });
    const [tax, setTax] = useState([]);
    const [amount, setAmount] = useState({
        valueAfterDiscount: 0,
        netInvoiceValue: 0,
        totalAmountPaid: 0,
        balanceAmount: 0
    });
    const [styles, setStyles] = useState({});
    const [isImageWorking, setIsImageWorking] = useState(true);
    const handleImageErrors = () => {
        setIsImageWorking(false);
    };
    const [debitCard, setDebitCard] = useState([]);

    const loadData = (data) => {
        console.log(data);
        let totals = { ...total };
        let headerData = data?.BillPrint_Json[0];
        setJson0Data(headerData);
        let head = HeaderComponent(headerData?.HeaderNo, headerData);
        setHeaderComp(head);
        let resultArr = [];
        data?.BillPrint_Json1.forEach((e, i) => {
            let diaWt = 0;
            let csWt = 0;
            let miscWt = 0;
            let metalRate = 0;
            let metalQuality = "";
            let Qty = 1;
            let netWtLoss = 0;
            let metalWt = 0;
            let count = 0;

            data?.BillPrint_Json2.forEach((ele, ind) => {
                if (e?.SrJobno === ele?.StockBarcode) {
                    if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                        metalQuality = ele?.QualityName;
                        metalRate = ele?.Rate;
                        count++;
                        if (ele?.IsPrimaryMetal === 1) {
                            metalWt += ele?.Wt;
                        }
                    } else if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
                        diaWt += ele?.Wt;
                    }
                    else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
                        csWt += ele?.Wt;
                    }
                    else if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
                        miscWt += ele?.Wt;
                    }
                }
            });
            if (count === 1) {
                netWtLoss =  e?.NetWt + e?.LossWt;
            }else{
                netWtLoss = metalWt;
            }
            totals.Qty += e?.Quantity;
            totals.diaWt += diaWt;
            totals.csWt += csWt;
            totals.miscWt += miscWt;
            totals.NetWt += e?.NetWt;
            totals.grosswt += e?.grosswt;
            totals.UnitCost += e?.UnitCost;
            totals.DiscountAmt += e?.DiscountAmt;
            totals.TotalAmount += e?.TotalAmount;

            let obj = { ...e };
            obj.diaWt = diaWt;
            obj.csWt = csWt;
            obj.miscWt = miscWt;
            obj.metalRate = metalRate;
            obj.metalQuality = metalQuality;
            obj.netWtLoss = netWtLoss
            obj.Qty = Qty;
            if (obj.GroupJob === "") {
                resultArr.push(obj);
            } else {
                let findIndex = resultArr.findIndex((ele, ind) => ele?.GroupJob === e?.GroupJob);
                if (findIndex === -1) {
                    resultArr.push(obj);
                } else {
                    if (resultArr[findIndex].metalQuality === obj?.metalQuality) {
                        let object = resultArr[findIndex];
                        object.diaWt += obj.diaWt;
                        object.csWt += obj.csWt;
                        object.miscWt += obj.miscWt;
                        object.UnitCost += obj.UnitCost;
                        object.DiscountAmt += obj.DiscountAmt;
                        object.TotalAmount += obj.TotalAmount;
                        object.Qty += obj.Qty;
                        if (resultArr[findIndex].SrJobno === obj?.GroupJob) {
                            resultArr.push(object);
                            object.netWtLoss += obj?.netWtLoss;
                        } else {
                            obj.diaWt = object.diaWt;
                            obj.csWt = object.csWt;
                            obj.miscWt = object.miscWt;
                            obj.UnitCost = object.UnitCost;
                            obj.DiscountAmt = object.DiscountAmt;
                            obj.TotalAmount = object.TotalAmount;
                            obj.Qty = object.Qty;
                            resultArr.push(obj);
                        }
                    } else {
                        resultArr.push(obj);
                    }
                }
            }
        });
        resultArr?.sort((a, b) => {
            let nameA = a?.designno?.toLowerCase() + a?.SrJobno?.toLowerCase();
            let nameB = b?.designno?.toLowerCase() + b?.SrJobno?.toLowerCase();

            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        })
        setData(resultArr);
        setTotal(totals);
        let taxValue = taxGenrator(headerData, totals?.TotalAmount);
        setTax(taxValue);
        let amounts = taxValue.reduce((acc, current) => {
            acc.tax += +(current.amount);
            return acc;
        }, { tax: 0 });
        let summaryAmounts = { ...amount };
        let valueAfterDiscounts = totals?.TotalAmount + headerData?.AddLess;
        let netInvoiceValue = valueAfterDiscounts + amounts?.tax;
        let debitCardinfo = ReceiveInBank(headerData?.BankPayDet);
        let debitInfo = debitCardinfo.reduce((acc, current) => {
            acc += +(current.amount);
            return acc;
        }, 0);
        summaryAmounts.valueAfterDiscount = valueAfterDiscounts;
        summaryAmounts.netInvoiceValue = netInvoiceValue;
        summaryAmounts.totalAmountPaid = debitInfo;
        summaryAmounts.balanceAmount = netInvoiceValue - debitInfo;
        setAmount(summaryAmounts);
        setDebitCard(debitCardinfo);
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
        let print3 = atob(printName).toLowerCase() === "retail invoice 3";
        // console.log(print3);
        let styless = { ...styles };
        styless.discription = print3 ? style?.discription_retailInvoice_2_3_3 : style?.discription_retailInvoice_2_3;
        styless.kt = print3 ? style?.kt_retailInvoice_2_3_3 : style?.kt_retailInvoice_2_3;
        styless.dwt = print3 ? style?.dwt_retailInvoice_2_3_3 : style?.dwt_retailInvoice_2_3;
        styless.gwt = print3 ? style?.gwt_retailInvoice_2_3_3 : style?.gwt_retailInvoice_2_3;
        styless.scheme = print3 ? style?.scheme_retailInvoice_2_3_3 : style?.scheme_retailInvoice_2_3;
        styless.diaWt = print3 ? style?.diaWt_retailInvoice_2_3_3 : style?.diaWt_retailInvoice_2_3;
        // styless.srNo = print3 ? style?.discription_retailInvoice_2_3_3 : style?.discription_retailInvoice_2_3;
        setStyles(styless);
    }, []);

    return (
        loader ? <Loader /> : msg === "" ? <>
            <div className={`container ${style?.containerretailInvoice2} pad_60_allPrint`}>
                {/* Print Button */}
                <div className={`${style?.printBtn_sec} text-end container pt-4 pb-4 px-0`}>
                    <input type="button" className="btn_white blue me-0" value="Print" onClick={(e) => handlePrint(e)} />
                </div>
                {/* Header */}
                <div className={`retailInvoice_2_3`}>
                    {headerComp}
                </div>
                <div className={`${style?.containerretailInvoice2_font}`}>
                    {/* Invoice Details */}
                    <div className={`d-flex justify-content-between pt-2 ${style?.font_13}`}>
                        <div className="col-3 border-black border p-2 d-flex">
                            <div className="col-6">
                                <p className="fw-bold mb-0">BILL NO: </p>
                            </div>
                            <div className="col-6">
                                <p className="mb-0">{json0Data?.InvoiceNo}</p>
                            </div>
                        </div>
                        <div className="col-3 border-black border p-2 d-flex">
                            <div className="col-6">
                                <p className="fw-bold mb-0">HSN: </p>
                            </div>
                            <div className="col-6">
                                <p className="mb-0">{json0Data?.HSN_No}</p>
                            </div>
                        </div>
                        <div className="col-3 border-black border p-2 d-flex">
                            <div className="col-6">
                                <p className="fw-bold mb-0">Date: </p>
                            </div>
                            <div className="col-6">
                                <p className="mb-0">{json0Data?.EntryDate}</p>
                            </div>
                        </div>
                    </div>
                    {/* Customer Details */}
                    <div className="d-flex pt-2 w-100">
                        <div className="border-black border p-2 w-100">
                            <div className="d-flex w-100">
                                <div className='pe-4'><p className={`fw-bold mb-0 ${style?.font_13}`}>TO, </p></div>
                                <div>
                                    <p className={`fw-bold mb-0 ${style?.font_12} pb-1`}>{json0Data?.CustName}</p>
                                    <p className={`mb-0 ${style?.font_13}`}>{json0Data?.customerstreet}</p>
                                    <p className={`mb-0 ${style?.font_13}`}>{json0Data?.customerAddress2}</p>
                                    <p className={`mb-0 ${style?.font_13}`}>{json0Data?.customercity}{json0Data?.customerpincode}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Retailer product Issued */}
                    <div className="d-flex pt-2 w-100">
                        <div className="border-black border p-2 w-100">
                            <p className={`fw-bold mb-0 ${style?.font_13}`}>Retailer product Issued</p>
                        </div>
                    </div>
                    {/* table */}
                    <div className="pt-2">
                        {/* table header */}
                        <div className={`border-black border p-2 w-100 d-flex ${style?.font_13}`}>
                            <div className={`${styles?.discription}`}><p>Product Description</p></div>
                            <div className={`${styles?.kt}`}><p className='text-center'>KT</p></div>
                            <div className={`${styles?.kt}`}><p className='text-center'>Qty</p></div>
                            <div className={`${styles?.gwt}`}><p className='text-center'>Gross Wt(gms)</p></div>
                            <div className={`${styles?.diaWt}`}><p className='text-center'>Dia Wt</p><p className='text-center'>(gms/carat)</p></div>
                            <div className={`${styles?.dwt}`}><p className='text-center'>Stone Wt</p><p className='text-center'>(carat)</p></div>
                            <div className={`${styles?.dwt}`}><p className='text-center'>Misc Wt</p><p className='text-center'>(gms)</p></div>
                            {!retailInvoice3 && <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-center'>Metal Rate</p></div>}
                            <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-center'>Net Wt(gms)</p></div>
                            <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-center'>Price(Rs)</p></div>
                            {!retailInvoice3 && <div className={`${style?.image_retailInvoice_2_3}`}><p className='text-center'>Image</p></div>}
                            {!retailInvoice3 && <div className={`${styles?.scheme}`}><p className='text-center'>Scheme</p><p className='text-center'>Discount</p></div>}
                            <div className={`${styles?.scheme}`}> {!retailInvoice3 && <p className='text-center'>Scheme</p>}<p className='text-center'>Discount(Rs)</p></div>
                            <div className={`${styles?.scheme}`}><p className='text-end'>Product</p><p className='text-end'> {!retailInvoice3 ? `Value` : `Amount`}(Rs)</p></div>
                        </div>
                        {/* table data */}
                        {data.length > 0 && data.map((e, i) => {
                            return <div className={`border-black border-start border-end p-2 w-100 d-flex ${style?.font_13}`} key={i}>
                                <div className={`${styles?.discription}`}><p>{e?.designno} {e?.SrJobno}</p><p>{e?.MetalPurity} {e?.Categoryname}</p></div>
                                <div className={`${styles?.kt}`}><p className=''>{e?.metalQuality}</p></div>
                                <div className={`${styles?.kt}`}><p className='text-center'>{NumberWithCommas(e?.Quantity, 0)}</p></div>
                                <div className={`${styles?.gwt}`}><p className='text-center'>{NumberWithCommas(e?.grosswt, 3)}</p></div>
                                <div className={`${styles?.diaWt}`}><p className='text-center'>{NumberWithCommas(e?.diaWt, 3)}</p></div>
                                <div className={`${styles?.dwt}`}><p className='text-center'>{NumberWithCommas(e?.csWt, 3)}</p></div>
                                <div className={`${styles?.dwt}`}><p className='text-center'>{NumberWithCommas(e?.miscWt, 3)}</p></div>
                                {!retailInvoice3 && <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-center'>{NumberWithCommas(e?.metalRate, 2)}</p></div>}
                                <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-center'>{NumberWithCommas(e?.netWtLoss, 3)}</p></div>
                                <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-center'>{NumberWithCommas(e?.UnitCost, 2)}</p></div>
                                {!retailInvoice3 && <div className={`${style?.image_retailInvoice_2_3}`}><img src={e?.DesignImage} alt="" className={`${style?.img_retailInvoice_2_3} w-100 px-2`} onError={handleImageError} /></div>}
                                {!retailInvoice3 && <div className={`${styles?.scheme}`}><p className='text-center'>{e?.Discount !== 0 ? <> {NumberWithCommas(e?.Discount, 2)}% On Total Amount</> : "-"}</p></div>}
                                <div className={`${styles?.scheme}`}><p className='text-center'>{NumberWithCommas(e?.DiscountAmt, 2)}</p></div>
                                <div className={`${styles?.scheme}`}><p className='text-end'>{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
                            </div>
                        })}
                        <div className={`border-black border-start border-end p-2 w-100 d-flex border-bottom ${style?.font_13}`}>
                            <div className={`${styles?.discription} fw-bold`}><p>Total</p></div>
                            <div className={`${styles?.kt}`}><p className=''></p></div>
                            <div className={`${styles?.kt}`}><p className='text-end'>{NumberWithCommas(total?.Qty, 0)}</p></div>
                            <div className={`${styles?.gwt}`}><p className='text-end'>{NumberWithCommas(total?.grosswt, 3)}</p></div>
                            <div className={`${styles?.diaWt}`}><p className='text-end'>{NumberWithCommas(total?.diaWt, 3)}</p></div>
                            <div className={`${styles?.dwt}`}><p className='text-end'>{NumberWithCommas(total?.csWt, 3)}</p></div>
                            <div className={`${styles?.dwt}`}><p className='text-end'>{NumberWithCommas(total?.miscWt, 3)}</p></div>
                            {!retailInvoice3 && <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-end'></p></div>}
                            <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-end'>{NumberWithCommas(total?.NetWt, 3)}</p></div>
                            <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-end'>{NumberWithCommas(total?.UnitCost, 2)}</p></div>
                            <div className={`${style?.image_retailInvoice_2_3}`}></div>
                            <div className={`${styles?.scheme}`}><p className='text-end'></p></div>
                            <div className={`${styles?.scheme}`}><p className='text-end'>{NumberWithCommas(total?.DiscountAmt, 2)}</p></div>
                            <div className={`${styles?.scheme}`}><p className='text-end'>{NumberWithCommas(total?.TotalAmount, 2)}</p></div>
                        </div>
                        <div className={`border-black border-start border-end border-bottom p-2 w-100 d-flex justify-content-end ${style?.font_13}`}>
                            <div className={`${style?.pad_end_retail_invoice_2_3}`}><p>Product Total Value</p></div>
                            <div><p>{NumberWithCommas(total?.TotalAmount, 2)}</p></div>
                        </div>
                        <div className={`border-black border-start border-end border-bottom w-100 d-flex ${style?.font_13}`}>
                            <div className="col-6 border-black border-end">
                                <p className="fw-bold p-2">Payment Details</p>
                                <div className="d-flex p-2 border-black border-bottom">
                                    <div className="col-4"><p>Payment Mode</p></div>
                                    <div className="col-2"><p>Doc no.</p></div>
                                    <div className="col-4"><p>Customer Name</p></div>
                                    <div className="col-2 text-end"><p>Amount(Rs)</p></div>
                                </div>
                                <div className="d-flex p-2 border-black border-bottom justify-content-between">
                                    <div className="col-4"><p>Cash</p></div>
                                    <div className="col-2"><p></p></div>
                                    <div className="col-4"><p></p></div>
                                    <div className="col-2 text-end"><p>{NumberWithCommas(json0Data?.CashReceived, 2)}</p></div>
                                </div>
                                {debitCard.length > 0 && debitCard.map((e, i) => {
                                    return <div className="d-flex p-2 border-black border-bottom justify-content-between" key={i}>
                                        <div className="col-4"><p>{e?.label}</p></div>
                                        <div className="col-2"><p></p></div>
                                        <div className="col-4"><p></p></div>
                                        <div className="col-2 text-end"><p className='fw-bold'>{NumberWithCommas(e?.amount, 2)}</p></div>
                                    </div>
                                })}
                                <div className="d-flex p-2 border-black border-bottom justify-content-between">
                                    <div className="col-4"><p className='fw-bold'>Total Amount Paid</p></div>
                                    <div className="col-2"><p className='fw-bold'></p></div>
                                    <div className="col-4"><p className='fw-bold'></p></div>
                                    <div className="col-2 text-end"><p className='fw-bold'>{NumberWithCommas(amount?.totalAmountPaid, 2)}</p></div>
                                </div>
                                <div className="d-flex p-2 justify-content-between">
                                    <div className="col-4"><p className='fw-bold'>Balance Amount</p></div>
                                    <div className="col-2"><p className='fw-bold'></p></div>
                                    <div className="col-4"><p className='fw-bold'></p></div>
                                    <div className="col-2 text-end"><p className='fw-bold'>{NumberWithCommas(amount?.balanceAmount, 2)}</p></div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex border-black border-bottom justify-content-between p-2">
                                    <p>Total Value</p>
                                    <p>{NumberWithCommas(total?.TotalAmount, 2)}</p>
                                </div>
                                {tax.length > 0 && tax.map((e, i) => {
                                    return <div className="d-flex border-black border-bottom justify-content-between p-2" key={i}>
                                        <p>{e?.name} @ {e?.per}</p>
                                        <p>{e?.amount}</p>
                                    </div>
                                })}
                                {json0Data?.AddLess !== 0 && <div className="d-flex border-black border-bottom justify-content-between p-2">
                                    <p>{json0Data?.AddLess > 0 ? `Add` : `Less`} :- Other Discount</p>
                                    <p>{NumberWithCommas(json0Data?.AddLess, 2)}</p>
                                </div>}
                                <div className="d-flex border-black border-bottom justify-content-between p-2">
                                    <p>Value after Disocunt</p>
                                    <p>{NumberWithCommas(amount?.valueAfterDiscount, 2)}</p>
                                </div>
                                <div className="d-flex border-black border-bottom justify-content-between p-2">
                                    <p>Net Invoice Value</p>
                                    <p>{NumberWithCommas(amount?.netInvoiceValue, 2)}</p>
                                </div>
                                <div className="d-flex border-black border-bottom justify-content-between p-2">
                                    <p>Total Amount to be Paid</p>
                                    <p>{NumberWithCommas(amount?.netInvoiceValue, 2)}</p>
                                </div>
                                <div className="d-flex justify-content-between p-2">
                                    <p>Value In Words :- Rupees {numberToWord(amount?.netInvoiceValue)} Only</p>
                                </div>
                            </div>
                        </div>
                        <div className={`border-black border-start border-end border-bottom w-100 py-1 px-2 ${style?.font_13}`}>
                            <p className="fw-bold">TERMS AND CONDITIONS:-</p>
                            <div dangerouslySetInnerHTML={{ __html: json0Data?.Declaration }} className=''></div>
                        </div>
                    </div>
                    <div className='retailInvoice_2_3_footer_Font_12'>

                        <Footer2 data={json0Data} className={``} />
                    </div>
                </div>
            </div>
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default RetailInvoice2_3