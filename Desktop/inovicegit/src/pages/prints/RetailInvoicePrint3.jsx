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
                <div className="bgGrey p-2">
                    <p className="fs-5 text-white fw-bold">{headerData?.PrintHeadLabel}</p>
                </div>
                <div className='px-2 pb-2 border-bottom'>
                    <p className="fs-5 fw-bold">Optigo</p>
                    <p>57 Bansant lok</p>
                    <p>New Delhi-605001, GUJARAT(India)</p>
                    <p>T 9510213588 | TOLL FREE 1800-2568-28667</p>
                    <p>darren@orail.co.in | www.optigoapps.com</p>
                </div>
                <div className="py-2 d-flex justify-content-between">
                    <div className="col-3 px-2">
                        <div className="d-flex border-black border px-2">
                            <div className="col-6 fw-bold"><p>BILL NO :</p></div>
                            <div className="col-6"><p>SK19082022</p></div>
                        </div>
                    </div>
                    <div className="col-3 px-2">
                        <div className="d-flex border-black border px-2">
                            <div className="col-6 fw-bold"><p>HSN :</p></div>
                            <div className="col-6"><p>85213</p></div>
                        </div>
                    </div>
                    <div className="col-3 px-2">
                        <div className="d-flex border-black border px-2">
                            <div className="col-6 fw-bold"><p>Date :</p></div>
                            <div className="col-6"><p>09 Feb 2024</p></div>
                        </div>
                    </div>
                </div>
                <div className="border border-black d-flex">
                    <div className='px-2'> <p className="fw-bold">TO,</p>	</div>
                    <div className='px-2'>
                        <p className="fw-bold">Prashant Rajput	</p>
                        <p>Near nimzari naka , near karwan naka , near engineering collage, market main road</p>
                        <p>Near Nimazari naka</p>
                        <p>Shirpur-425405</p>
                    </div>
                </div>
                <div className="border-start border-end border-bottom border-black d-flex px-2">
                    <p className="fw-bold">test</p>
                </div>
                <div className="border-start border-end border-bottom  border-black ">
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
                    <div className="d-flex px-2 border-bottom">
                        <div className={`${style?.Variant}`}> <p className=''>1829/1/15263 18K Ring</p></div>
                        <div className={`${style?.KT}`}> <p className='text-center'>18K </p></div>
                        <div className={`${style?.Qty}`}> <p className='text-center'>1 </p></div>
                        <div className={`${style?.Gross}`}> <p className='text-center'>15.000 </p></div>
                        <div className={`${style?.Dia}`}> <p className='text-center'>0.000</p></div>
                        <div className={`${style?.Stone}`}> <p className='text-center'>0.000 </p></div>
                        <div className={`${style?.Misc}`}> <p className='text-center'>0.000 </p></div>
                        <div className={`${style?.Net}`}> <p className='text-center'>15.750</p></div>
                        <div className={`${style?.Price}`}> <p className='text-center'>93,206.65</p></div>
                        <div className={`${style?.Discount}`}> <p className='text-center'>0.00</p></div>
                        <div className={`${style?.Product}`}> <p className='text-end'>93,806.65</p></div>
                    </div>
                    <div className="d-flex border-bottom px-2">
                        <div className={`${style?.Variant}`}> <p className=''>Total</p></div>
                        <div className={`${style?.KT}`}> <p className='text-center'> </p></div>
                        <div className={`${style?.Qty}`}> <p className='text-center'>8 </p></div>
                        <div className={`${style?.Gross}`}> <p className='text-center'>69.380</p></div>
                        <div className={`${style?.Dia}`}> <p className='text-center'>27.786</p></div>
                        <div className={`${style?.Stone}`}> <p className='text-center'>7.000 </p></div>
                        <div className={`${style?.Misc}`}> <p className='text-center'>0.500 </p></div>
                        <div className={`${style?.Net}`}> <p className='text-center'>64.348</p></div>
                        <div className={`${style?.Price}`}> <p className='text-center'>1,72,868.74</p></div>
                        <div className={`${style?.Discount}`}> <p className='text-center'>5,479.15</p></div>
                        <div className={`${style?.Product}`}> <p className='text-end'>1,67,989.60</p></div>
                    </div>
                    <div className="border-bottom border-black d-flex justify-content-end px-2">
                        <div className="col-4 d-flex justify-content-between">
                            <div><p>Product Total Value</p></div>
                            <div><p>1,67,989.60</p></div>
                        </div>
                    </div>
                    <div className="d-flex">
                        <div className="col-6 border-end border-black">
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
                        </div>
                        <div className="col-6 border-bottom border-black">
                            <div className="d-flex justify-content-between border-bottom border-black">
                                <p>Total Value</p>
                                <p>1,67,989.60</p>
                            </div>
                            <div className="d-flex justify-content-between border-bottom border-black">
                                <p>CGST @ 0.13%</p>
                                <p>218.39</p>
                            </div>

                            SGST @ 0.13%218.39 Less:- Other Discount0.38 Value after Discount1,67,989.22 Net Invoice Value1,68,426.00 Total Amount to be paid Rs.Rs.97,51,164
                        </div>
                    </div>
                </div>

            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default RetailInvoicePrint3
