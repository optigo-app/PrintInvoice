import React, { useEffect, useState } from 'react';
import "../../assets/css/prints/miscPrint1.css";
import { apiCall, fixedValues, handlePrint, isObjectEmpty, NumberWithCommas } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import style from "../../assets/css/prints/packingList1.module.css";

const PackingList1 = ({ urls, token, invoiceNo, printName, evn }) => {

    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [json0Data, setJson0Data] = useState({});

    const loadData = (data) => {
        console.log(data);
        setJson0Data(data?.BillPrint_Json[0]);
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
        <>{loader ? <Loader /> : msg === "" ? <>
            <div className={`container max_width_container pad_60_allPrint ${style?.container}`}>
                {/* print Button */}
                <div className="printBtn_sec text-end  pt-4 ">
                    <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                </div>
                {/* Print Logo */}
                <div className="pt-2">
                    <img src={json0Data?.PrintLogo} alt="" className={`${style?.img} d-block mx-auto`} />
                    <p className="text-center pt-1">    {json0Data?.CompanyAddress} {json0Data?.CompanyAddress2}{" "}
                        {json0Data?.CompanyCity} - {json0Data?.CompanyPinCode}</p>
                </div>
                {/* Party */}
                <div className="pt-4 d-flex justify-content-between aling-items-between">
                    <div className='col-6'>
                        <p><span className="fw-bold">Party:</span> {json0Data?.customerfirmname}</p>
                    </div>
                    <div className='text-end col-4'>
                        <div className='d-flex justify-content-end'>
                            <p className='col-4'>Invoice No :</p>
                            <p className='col-6 text-end fw-bold'>{json0Data?.InvoiceNo}</p>
                        </div>
                        <div className='d-flex justify-content-end'>
                            <p className='col-4'>Date :</p>
                            <p className='col-6 text-end fw-bold'>{json0Data?.EntryDate}</p>
                        </div>
                    </div>
                </div>
                {/* Table Header */}
                <div className="d-flex border lightGrey">
                    <div className={`${style?.pad_1} fw-bold ${style?.srNo} border-end`}>
                        <div className="d-grid h-100">
                            <p className='d-flex justify-content-center align-items-center'>Sr. No.</p>
                        </div>
                    </div>
                    <div className={`${style?.pad_1} fw-bold ${style?.design} border-end`}>
                        <div className="d-grid h-100">
                            <p className='d-flex justify-content-center align-items-center'>Jewelcode</p>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.diamond} border-end d-flex flex-wrap`}>
                        <div className="d-grid h-100 w-100">
                            <p className="d-flex w-100 fw-bold justify-content-center">Diamond</p>
                            <div className="d-flex w-100 border-top">
                                <p className={`col-2 text-center border-end`}>Shape</p>
                                <p className={`col-2 text-center border-end`}>Size</p>
                                <p className={`col-2 text-center border-end`}>Wt</p>
                                <p className={`col-2 text-center border-end`}>Pcs</p>
                                <p className={`col-2 text-center border-end`}>Rate</p>
                                <p className={`col-2 text-center`}>Amount</p>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.metal} border-end`}>
                        <div className="d-grid h-100 w-100">
                            <p className="d-flex w-100 fw-bold justify-content-center">Metal</p>
                            <div className="d-flex w-100 border-top">
                                <p className={`${style?.wid_20} text-center border-end`}>Kt</p>
                                <p className={`${style?.wid_20} text-center border-end`}>Gr Wt</p>
                                <p className={`${style?.wid_20} text-center border-end`}>Net Wt</p>
                                <p className={`${style?.wid_20} text-center border-end`}>Rate</p>
                                <p className={`${style?.wid_20} text-center`}>Amount</p>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.stone} border-end`}>
                        <div className="d-grid h-100 w-100">
                            <p className="d-flex w-100 fw-bold justify-content-center">Stone</p>
                            <div className="d-flex w-100 border-top">
                                <p className={`${style?.wid_20} text-center border-end`}>Shape</p>
                                <p className={`${style?.wid_20} text-center border-end`}>Wt</p>
                                <p className={`${style?.wid_20} text-center border-end`}>Pcs</p>
                                <p className={`${style?.wid_20} text-center border-end`}>Rate</p>
                                <p className={`${style?.wid_20} text-center`}>Amount</p>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.labour} border-end`}>
                        <div className="d-grid h-100 w-100">
                            <p className="d-flex w-100 fw-bold justify-content-center">Labour</p>
                            <div className="d-flex w-100 border-top">
                                <p className={`${style?.pad_1} col-6 text-center border-end`}>Rate</p>
                                <p className={`${style?.pad_1} col-6 text-center`}>Amount</p>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.other} border-end`}>
                        <div className="d-grid h-100 w-100">
                            <p className="d-flex w-100 fw-bold justify-content-center">Other</p>
                            <div className="d-flex w-100 border-top">
                                <p className={`${style?.pad_1} col-6 text-center border-end`}>Code</p>
                                <p className={`${style?.pad_1} col-6 text-center`}>Amount</p>
                            </div>
                        </div>
                    </div>
                    <div className={`${style?.pad_1} fw-bold ${style?.price}`}>
                        <div className="d-grid h-100">
                            <p className='d-flex justify-content-center align-items-center'>Price</p>
                        </div>
                    </div>
                </div>
                {/* Table Data */}
                <div className="d-flex border-start border-end border-bottom lightGrey">
                    <div className={`${style?.pad_1} fw-bold ${style?.srNo} border-end`}>
                        <div className="d-grid h-100">
                            <p className='d-flex justify-content-center align-items-center'>1</p>
                        </div>
                    </div>
                    <div className={`${style?.pad_1} fw-bold ${style?.design} border-end`}>
                        <div className="d-grid h-100">
                            <p className='d-flex justify-content-center align-items-center'>AJWC15654</p>
                            <img src="http://zen/lib/jo/28/images/default.jpg" alt="" className='w-100' />
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.diamond} border-end d-flex flex-wrap`}>
                            <div className="d-flex w-100 position-relative">
                                <div className={`col-2 border-end pb-3 position-relative`}>
                                    <p>RND</p>
                                </div>
                                <div className={`col-2 text-end border-end pb-3 position-relative h-100`}>
                                    <p>1.31</p>
                                    <p className='position-absolute w-100 border-top left-0 bottom-0'>asdasd</p>
                                </div>
                                <div className={`col-2 text-end border-end pb-3 position-relative`}>
                                    <p>0.140</p>
                                </div>
                                <div className={`col-2 text-end border-end pb-3 position-relative`}>
                                    <p>1</p>
                                </div>
                                <div className={`col-2 text-end border-end pb-3 position-relative`}>
                                    <p>0.00</p>
                                </div>
                                <div className={`col-2 text-end pb-3 position-relative`}>
                                    <p>0.00</p>
                                </div>
                            </div>
                    </div>
                    <div className={` fw-bold ${style?.metal} border-end`}>
                        <div className="d-grid h-100 w-100">
                            <div className="d-flex w-100 border-top">
                                <div className={`${style?.wid_20} border-end`}>
                                    <p>GOLD 18K</p>
                                </div>
                                <div className={`${style?.wid_20} text-end border-end`}>
                                    <p>5.028</p> 
                                    </div>
                                <div className={`${style?.wid_20} text-end border-end`}>
                                    <p>5.000</p> 
                                    </div>
                                <div className={`${style?.wid_20} text-end border-end`}>
                                    <p>456.00</p>
                                </div>
                                <div className={`${style?.wid_20} text-end`}>
                                    <p>2,280.0</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.stone} border-end`}>
                        <div className="d-grid h-100 w-100">
                            <div className="d-flex w-100 border-top">
                                <div className={`${style?.wid_20} border-end`}>RND</div>
                                <div className={`${style?.wid_20} text-end border-end`}>0.140</div>
                                <div className={`${style?.wid_20} text-end border-end`}>1</div>
                                <div className={`${style?.wid_20} text-end border-end`}>0.00</div>
                                <div className={`${style?.wid_20} text-end`}>0.00</div>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.labour} border-end`}>
                        <div className="d-grid h-100 w-100">
                            <div className="d-flex w-100 border-top">
                                <p className={`${style?.pad_1} col-6 text-center border-end`}>
                                1,000.00	
                                </p>
                                <p className={`${style?.pad_1} col-6 text-center`}>
                                5,000.00
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.other} border-end`}>
                        <div className="d-grid h-100 w-100">
                            <div className="d-flex w-100 border-top">
                                <div className={`${style?.pad_1} col-6 border-end`}>
                                    <p>Certification Charge</p>
                                    <p>Hall Mark</p>
                                </div>
                                <div className={`${style?.pad_1} col-6 text-end`}>
                                    <p>200</p>
                                    <p>200</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style?.pad_1} fw-bold ${style?.price}`}>
                            <p className='text-end'>7,680.00 </p>
                    </div>
                </div>
            </div>
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}</>
    )
}

export default PackingList1