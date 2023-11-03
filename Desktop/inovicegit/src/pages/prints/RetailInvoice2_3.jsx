import React, { useEffect, useState } from 'react'
import { apiCall, handlePrint, isObjectEmpty, HeaderComponent } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import style from '../../assets/css/prints/retailInovice2_3.module.css';
import Footer2 from '../../components/footers/Footer2';

const RetailInvoice2_3 = ({ token, invoiceNo, printName, urls, evn }) => {

    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [headerComp, setHeaderComp] = useState(null);
    const [json0Data, setJson0Data] = useState({});
    const [data, setData] = useState([]);

    const loadData = (data) => {
        console.log(data);
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
            data?.BillPrint_Json2.forEach((ele, ind) => {
                if (e?.SrJobno === ele?.StockBarcode) {
                    if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                        metalQuality = ele?.QualityName;
                        metalRate = ele?.Rate;
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
            let obj = { ...e };
            obj.diaWt = diaWt;
            obj.csWt = csWt;
            obj.miscWt = miscWt;
            obj.metalRate = metalRate;
            obj.metalQuality = metalQuality;
            obj.Qty = Qty;
            if (obj.GroupJob === "") {
                resultArr.push(obj);
            } else {
                let findIndex = resultArr.find((ele, ind) => ele?.GroupJob === e?.GroupJob);
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
        console.log(resultArr);
        setData(resultArr);
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
            <div className={`container ${style?.containerretailInvoice2} pad_60_allPrint`}>
                {/* Print Button */}
                <div className="printBtn_sec text-end container pt-4 pb-4 px-0">
                    <input type="button" className="btn_white blue me-0" value="Print" onClick={(e) => handlePrint(e)} />
                </div>
                {/* Header */}
                <div>
                    {headerComp}
                </div>
                {/* Invoice Details */}
                <div className="d-flex justify-content-between pt-4">
                    <div className="col-3 border-2 border-black border p-2 d-flex">
                        <div className="col-6">
                            <p className="fw-bold mb-0">BILL NO: </p>
                        </div>
                        <div className="col-6">
                            <p className="mb-0">{json0Data?.InvoiceNo}</p>
                        </div>
                    </div>
                    <div className="col-3 border-2 border-black border p-2 d-flex">
                        <div className="col-6">
                            <p className="fw-bold mb-0">HSN: </p>
                        </div>
                        <div className="col-6">
                            <p className="mb-0">{json0Data?.HSN_No}</p>
                        </div>
                    </div>
                    <div className="col-3 border-2 border-black border p-2 d-flex">
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
                    <div className="border-2 border-black border p-2 w-100">
                        <div className="d-flex w-100">
                            <div className='pe-4'><p className="fw-bold mb-0">To, </p></div>
                            <div>
                                <p className="fw-bold mb-0">{json0Data?.CustName}</p>
                                <p className="mb-0">{json0Data?.customerAddress1}</p>
                                <p className="mb-0">{json0Data?.customerAddress2}</p>
                                <p className="mb-0">{json0Data?.customercity}{json0Data?.customerpincode}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Retailer product Issued */}
                <div className="d-flex pt-2 w-100">
                    <div className="border-2 border-black border p-2 w-100">
                        <p className="fw-bold mb-0">Retailer product Issued</p>
                    </div>
                </div>
                {/* table */}
                <div className="pt-2">
                    {/* table header */}
                    <div className="border-2 border-black border p-2 w-100 d-flex">
                        <div className={`${style?.discription_retailInvoice_2_3}`}><p>Product Description</p></div>
                        <div className={`${style?.kt_retailInvoice_2_3}`}><p className='text-center'>KT</p></div>
                        <div className={`${style?.kt_retailInvoice_2_3}`}><p className='text-center'>Qty</p></div>
                        <div className={`${style?.gwt_retailInvoice_2_3}`}><p className='text-center'>Gross Wt(gms)</p></div>
                        <div className={`${style?.dwt_retailInvoice_2_3}`}><p className='text-center'>Dia Wt</p><p className='text-center'>(gms/carat)</p></div>
                        <div className={`${style?.dwt_retailInvoice_2_3}`}><p className='text-center'>Stone Wt</p><p className='text-center'>(carat)</p></div>
                        <div className={`${style?.dwt_retailInvoice_2_3}`}><p className='text-center'>Misc Wt</p><p className='text-center'>(gms)</p></div>
                        <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-center'>Metal Rate</p></div>
                        <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-center'>Net Wt(gms)</p></div>
                        <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-center'>Price(Rs)</p></div>
                        <div className={`${style?.image_retailInvoice_2_3}`}><p className='text-center'>Image</p></div>
                        <div className={`${style?.scheme_retailInvoice_2_3}`}><p className='text-center'>Scheme</p><p className='text-center'>Discount</p></div>
                        <div className={`${style?.scheme_retailInvoice_2_3}`}><p className='text-center'>Scheme</p><p className='text-center'>Discount(Rs)</p></div>
                        <div className={`${style?.scheme_retailInvoice_2_3}`}><p className='text-center'>Product</p><p className='text-center'>Value(Rs)</p></div>
                    </div>
                    {/* table data */}
                    {data.length > 0 && data.map((e, i) => {
                        return <div className="border-2 border-black border-start border-end p-2 w-100 d-flex" key={i}>
                            <div className={`${style?.discription_retailInvoice_2_3}`}><p>{e?.designno} {e?.SrJobno}</p><p>{e?.MetalPurity} {e?.Categoryname}</p></div>
                            <div className={`${style?.kt_retailInvoice_2_3}`}><p className=''>{e?.metalQuality}</p></div>
                            <div className={`${style?.kt_retailInvoice_2_3}`}><p className='text-end'>{e?.Qty}</p></div>
                            <div className={`${style?.gwt_retailInvoice_2_3}`}><p className='text-end'>{e?.grosswt}</p></div>
                            <div className={`${style?.dwt_retailInvoice_2_3}`}><p className='text-end'>{e?.diaWt}</p></div>
                            <div className={`${style?.dwt_retailInvoice_2_3}`}><p className='text-end'>{e?.csWt}</p></div>
                            <div className={`${style?.dwt_retailInvoice_2_3}`}><p className='text-end'>{e?.miscWt}</p></div>
                            <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-end'>{e?.metalRate}</p></div>
                            <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-end'>{e?.NetWt}</p></div>
                            <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-end'>{e?.UnitCost}</p></div>
                            <div className={`${style?.image_retailInvoice_2_3}`}><img src={"https://shaadiwish.com/blog/wp-content/uploads/2021/12/heavy-bridal-jewellery-1.jpg"} alt="" className={`${style?.img_retailInvoice_2_3} w-100 px-2`} /></div>
                            <div className={`${style?.scheme_retailInvoice_2_3}`}><p className='text-end'>54.00</p></div>
                            <div className={`${style?.scheme_retailInvoice_2_3}`}><p className='text-end'>54.00</p></div>
                            <div className={`${style?.scheme_retailInvoice_2_3}`}><p className='text-end'>54.00</p></div>
                        </div>
                    })}
                    {/* <div className="border-2 border-black border-start border-end p-2 w-100 d-flex">
                        <div className={`${style?.discription_retailInvoice_2_3}`}><p>1694 1/14847</p><p>18K Ring</p></div>
                        <div className={`${style?.kt_retailInvoice_2_3}`}><p className=''>18K</p></div>
                        <div className={`${style?.kt_retailInvoice_2_3}`}><p className='text-end'>1</p></div>
                        <div className={`${style?.gwt_retailInvoice_2_3}`}><p className='text-end'>12.289</p></div>
                        <div className={`${style?.dwt_retailInvoice_2_3}`}><p className='text-end'>2.068</p></div>
                        <div className={`${style?.dwt_retailInvoice_2_3}`}><p className='text-end'>4.000</p></div>
                        <div className={`${style?.dwt_retailInvoice_2_3}`}><p className='text-end'>3.318</p></div>
                        <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-end'>380.00</p></div>
                        <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-end'>10.325</p></div>
                        <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-end'>7588.00</p></div>
                        <div className={`${style?.image_retailInvoice_2_3}`}><img src="https://shaadiwish.com/blog/wp-content/uploads/2021/12/heavy-bridal-jewellery-1.jpg" alt="" className={`${style?.img_retailInvoice_2_3} w-100 px-2`} /></div>
                        <div className={`${style?.scheme_retailInvoice_2_3}`}><p className='text-end'>54.00</p></div>
                        <div className={`${style?.scheme_retailInvoice_2_3}`}><p className='text-end'>54.00</p></div>
                        <div className={`${style?.scheme_retailInvoice_2_3}`}><p className='text-end'>54.00</p></div>
                    </div>
                    <div className="border-2 border-black border-start border-end border-bottom p-2 w-100 d-flex">
                        <div className={`${style?.discription_retailInvoice_2_3}`}><p>1694 1/14847</p><p>18K Ring</p></div>
                        <div className={`${style?.kt_retailInvoice_2_3}`}><p className=''>18K</p></div>
                        <div className={`${style?.kt_retailInvoice_2_3}`}><p className='text-end'>1</p></div>
                        <div className={`${style?.gwt_retailInvoice_2_3}`}><p className='text-end'>12.289</p></div>
                        <div className={`${style?.dwt_retailInvoice_2_3}`}><p className='text-end'>2.068</p></div>
                        <div className={`${style?.dwt_retailInvoice_2_3}`}><p className='text-end'>4.000</p></div>
                        <div className={`${style?.dwt_retailInvoice_2_3}`}><p className='text-end'>3.318</p></div>
                        <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-end'>380.00</p></div>
                        <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-end'>10.325</p></div>
                        <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-end'>7588.00</p></div>
                        <div className={`${style?.image_retailInvoice_2_3}`}><img src="https://shaadiwish.com/blog/wp-content/uploads/2021/12/heavy-bridal-jewellery-1.jpg" alt="" className={`${style?.img_retailInvoice_2_3} w-100 px-2`} /></div>
                        <div className={`${style?.scheme_retailInvoice_2_3}`}><p className='text-end'>54.00</p></div>
                        <div className={`${style?.scheme_retailInvoice_2_3}`}><p className='text-end'>54.00</p></div>
                        <div className={`${style?.scheme_retailInvoice_2_3}`}><p className='text-end'>54.00</p></div>
                    </div> */}

                    <div className="border-2 border-black border-start border-end border-bottom p-2 w-100 d-flex justify-content-end">
                        <div className="col-4 d-flex">
                            <div className="col-6"><p>Product Total Value</p></div>
                            <div className="col-6"><p>11280.11</p></div>
                        </div>
                    </div>
                    <div className="border-2 border-black border-start border-end border-bottom w-100 d-flex">
                        <div className="col-6 border-2 border-black border-end">
                            <p className="fw-bold p-2">Payment Details</p>
                            <div className="d-flex p-2 border-2 border-black border-bottom">
                                <div className="col-4"><p>Payment Mode</p></div>
                                <div className="col-2"><p>Doc no.</p></div>
                                <div className="col-4"><p>Customer Name</p></div>
                                <div className="col-2 text-end"><p>Amount(Rs)</p></div>
                            </div>
                            <div className="d-flex p-2 border-2 border-black border-bottom justify-content-between">
                                <div className="col-4"><p>Cash</p></div>
                                <div className="col-2"><p>2310</p></div>
                                <div className="col-4"><p></p></div>
                                <div className="col-2 text-end"><p>4000.00</p></div>
                            </div>
                            <div className="d-flex p-2 border-2 border-black border-bottom justify-content-between">
                                <div className="col-4"><p>Cash</p></div>
                                <div className="col-2"><p></p></div>
                                <div className="col-4"><p></p></div>
                                <div className="col-2 text-end"><p>4000.00</p></div>
                            </div>
                            <div className="d-flex p-2 border-2 border-black border-bottom justify-content-between">
                                <div className="col-4"><p>Cheque</p></div>
                                <div className="col-2"><p>2310</p></div>
                                <div className="col-4"><p></p></div>
                                <div className="col-2 text-end"><p className='fw-bold'>3859.00</p></div>
                            </div>
                            <div className="d-flex p-2 border-2 border-black border-bottom justify-content-between">
                                <div className="col-4"><p className='fw-bold'>Total Amount Paid</p></div>
                                <div className="col-2"><p className='fw-bold'></p></div>
                                <div className="col-4"><p className='fw-bold'></p></div>
                                <div className="col-2 text-end"><p className='fw-bold'>7859.31</p></div>
                            </div>
                            <div className="d-flex p-2 justify-content-between">
                                <div className="col-4"><p className='fw-bold'>Balance Amount</p></div>
                                <div className="col-2"><p className='fw-bold'></p></div>
                                <div className="col-4"><p className='fw-bold'></p></div>
                                <div className="col-2 text-end"><p className='fw-bold'>3449.31</p></div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="d-flex border-2 border-black border-bottom justify-content-between p-2">
                                <p>Total Value</p>
                                <p>11280.23</p>
                            </div>
                            <div className="d-flex border-2 border-black border-bottom justify-content-between p-2">
                                <p>CGST @ 0.13%</p>
                                <p>11280.13</p>
                            </div>
                            <div className="d-flex border-2 border-black border-bottom justify-content-between p-2">
                                <p>Less:- Other Discount</p>
                                <p>0.12</p>
                            </div>
                            <div className="d-flex border-2 border-black border-bottom justify-content-between p-2">
                                <p>Value after Disocunt</p>
                                <p>11280.11</p>
                            </div>
                            <div className="d-flex border-2 border-black border-bottom justify-content-between p-2">
                                <p>Net Invoice Value</p>
                                <p>11308.11</p>
                            </div>
                            <div className="d-flex border-2 border-black border-bottom justify-content-between p-2">
                                <p>Total Amount to be Paid</p>
                                <p>11308.11</p>
                            </div>
                            <div className="d-flex border-2 border-black border-bottom justify-content-between p-2">
                                <p>Value In Words :- Rupees Eleven thousand Three Hundred and Eight Point thirty-One Only</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-2 border-black border-start border-end border-bottom w-100 p-2">
                        <p className="fw-bold pb-3">TERMS AND CONDITIONS:-</p>
                        <div dangerouslySetInnerHTML={{ __html: json0Data?.Declaration }} className='pb-3'></div>
                    </div>
                </div>
                <Footer2 data={json0Data} />
            </div>
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default RetailInvoice2_3