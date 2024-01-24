import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/DetailPrint2.module.css";
import { apiCall, handlePrint, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';

const DetailPrint2 = ({ token, invoiceNo, printName, urls, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [headerData, setHeaderData] = useState({});

    const [checkBox, setCheckbox] = useState({
        image: false,
    });

    const loadData = (data) => {
        console.log(data);
        setHeaderData(data?.BillPrint_Json[0]);
    }

    const handleCheck = (eve) => {
        const { name, checked } = eve?.target;
        setCheckbox({ ...checkBox, [name]: checked });
    }

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
        <>
            {/* buttons */}
            <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4 mt-4 position-fixed w-100`} >
                <div className="px-1">
                    <input
                        type="checkbox"
                        checked={checkBox?.image}
                        id="netwts2"
                        name="image"
                        value="netwts2"
                        className="mx-1"
                        onChange={handleCheck}
                    />
                    <label htmlFor="netwts2">With NetWt</label>
                </div>
                <div className="form-check ps-3">
                    <input
                        type="button"
                        value="Print"
                        className="btn_white blue py-1"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            <div className={`container max_width_container pad_60_allPrint ${style?.detailPrint2} pt-2`} >
                <h4 className='lightGrey min_height_label px-2'>{headerData?.PrintHeadLabel}</h4>
                <div className="d-flex pt-2 justify-content-between">
                    <div className='col-6'>
                        <p>To</p>
                        <p className="fw-semibold">{headerData?.Customercode}</p>
                    </div>
                    <div className='col-4'>
                        <div className="d-flex">
                            <div className="col-6">
                                <p className='text-end'>Invoice# :</p>
                            </div>
                            <div className="col-6">
                                <p className="fw-semibold ps-4"> {headerData?.InvoiceNo}</p>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="col-6">
                                <p className='text-end'>Date :</p>
                            </div>
                            <div className="col-6">
                                <p className="fw-semibold ps-4"> {headerData?.EntryDate}</p>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="col-6">
                                <p className='text-end'>{headerData?.HSN_No_Label}:</p>
                            </div>
                            <div className="col-6">
                                <p className="fw-semibold ps-4"> {headerData?.HSN_No}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* table header */}
                <div className="d-flex border-start border-end border-top border-black">
                    <div className={`${style?.sr} border-bottom text-center fw-bold border-end d-flex justify-content-center align-items-center`}><p>Sr</p></div>
                    <div className={`${style?.design} border-bottom text-center fw-bold border-end d-flex justify-content-center align-items-center`}><p>Design</p></div>
                    <div className={`${style?.diamond} border-bottom text-center fw-bold border-end`}>
                        <p className='border-bottom'>Diamond</p>
                        <div className="d-flex">
                            <div className='col-3'><p className='text-center fw-bold border-end'>Code</p></div>
                            <div className='col-3'><p className='text-center fw-bold border-end'>Wt</p></div>
                            <div className='col-3'><p className='text-center fw-bold border-end'>Rate</p></div>
                            <div className='col-3'><p className='text-center fw-bold border-end'>Amount</p></div>
                        </div>
                    </div>
                    <div className={`${style?.metal} border-bottom text-center fw-bold border-end`}>
                        <p className='border-bottom'>Metal</p>
                        <div className="d-flex">
                            <div className='col-3'><p className='text-center fw-bold border-end'>Quality</p></div>
                            <div className='col-3'><p className='text-center fw-bold border-end'>Wt(M+D)</p></div>
                            <div className='col-3'><p className='text-center fw-bold border-end'>N+L</p></div>
                            <div className='col-3'><p className='text-center fw-bold border-end'>Amount</p></div>
                        </div>
                    </div>
                    <div className={`${style?.stone} border-bottom text-center fw-bold border-end`}>
                        <p>Stone</p>
                        <div className="d-flex">
                            <div className='col-6'><p className='text-center fw-bold border-end'>Code</p></div>
                            <div className='col-6'><p className='text-center fw-bold border-end'>Amount</p></div>
                        </div>
                    </div>
                    <div className={`${style?.other} border-bottom text-center fw-bold border-end d-flex justify-content-center align-items-center`}><p>Other Amount</p></div>
                    <div className={`${style?.labour} border-bottom text-center fw-bold border-end d-flex justify-content-center align-items-center`}><p>Labour Amount</p></div>
                    <div className={`${style?.total} border-bottom text-center fw-bold d-flex justify-content-center align-items-center`}><p>Total Amount</p></div>
                </div>
                {/* table */}

            </div>
        </>
    ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
        </p>
    );
}

export default DetailPrint2;