import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/estimationPrint.module.css"
import { NumberWithCommas, apiCall, handlePrint, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';

const EstimationPrint = ({ token, invoiceNo, printName, urls, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const [headerData, setHeaderData] = useState({});
    const [checkBox, setCheckBox] = useState({
        image: false,
    });

    const handleChange = (e) => {
        const { name, checked } = e?.target;
        setCheckBox({ ...checkBox, [name]: checked });
    };

    const loadData = (data) => {
        setHeaderData(data?.BillPrint_Json[0]);
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
        console.log(data);
        console.log(datas);
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
        loader ? <Loader /> : msg === "" ? <div className={`container max_width_container pad_60_allPrint mt-2 ${style?.estimationPrint} px-1`}>
            {/* print button */}
            <div className={`d-flex justify-content-center mb-4 align-items-center ${style?.print_sec_sum4} pt-4 pb-4 `}>
                <div className="form-check d-flex align-items-center">
                    <input
                        className="border-dark me-2"
                        type="checkbox"
                        checked={checkBox?.image}
                        onChange={(e) => handleChange(e)}
                        name="image"
                    />
                    <label className="">With Image</label>
                </div>
                <div className="form-check ps-3">
                    <input
                        type="button"
                        className="btn_white blue"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            {/* customer details */}
            <div className="bgGrey p-2" style={{ minHeight: "40px", }}>
                <p className="fs-6 text-white fw-bold">
                    {headerData?.PrintHeadLabel}
                </p>
            </div>
            <div className="mt-1 d-flex border">
                <div className="col-7 p-2 border-end">
                    <p> To, </p>
                    <p className="fw-bold">sale and company (RUDRADIV) </p>
                </div>
                <div className="col-5 p-2">
                    <div className="d-flex">
                        <div className="col-3"> <p className='fw-bold pe-2'>BILL NO</p></div>
                        <div className="col-6"><p>{headerData?.InvoiceNo}</p></div>
                    </div>
                    <div className="d-flex">
                        <div className="col-3"> <p className='fw-bold pe-2'>DATE</p></div>
                        <div className="col-6"><p>{headerData?.EntryDate}</p></div>
                    </div>
                    <div className="d-flex">
                        <div className="col-3"> <p className='fw-bold pe-2'>{headerData?.HSN_No_Label}</p></div>
                        <div className="col-6"><p>{headerData?.HSN_No}</p></div>
                    </div>
                </div>
            </div>
            {/* table header */}
            <div className="d-flex border-start border-end border-bottom">
                <div className={`${style?.Sr} border-end d-flex align-items-center justify-content-center`}><p className='p-1 fw-bold  text-center'>Sr</p></div>
                <div className={`${style?.Design} border-end d-flex align-items-center justify-content-center`}><p className='p-1 fw-bold  text-center'>Design</p></div>
                <div className={`${style?.Diamond} border-end`}>
                    <div className="d-grid h-100">
                        <div className="d-flex">
                            <p className='fw-bold text-center w-100 p-1'>Diamond</p>
                        </div>
                        <div className="d-flex border-top">
                            <div className="col-2 border-end"><p className='p-1 fw-bold  text-center'>Code</p></div>
                            <div className="col-2 border-end"><p className='p-1 fw-bold  text-center'>Size</p></div>
                            <div className="col-2 border-end"><p className='p-1 fw-bold  text-center'>Pcs</p></div>
                            <div className="col-2 border-end"><p className='p-1 fw-bold  text-center'>Wt</p></div>
                            <div className="col-2 border-end"><p className='p-1 fw-bold  text-center'>Rate</p></div>
                            <div className="col-2"><p className='p-1 fw-bold  text-center'>Amount</p></div>
                        </div>
                    </div>
                </div>
                <div className={`${style?.Making} border-end`}>
                    <div className="d-grid h-100">
                        <div className="d-flex">
                            <p className='fw-bold text-center w-100 p-1'>Making</p>
                        </div>
                        <div className="d-flex border-top">
                            <div className="col-6 border-end"><p className='p-1 fw-bold  text-center'>Rate	</p></div>
                            <div className="col-6"><p className='p-1 fw-bold  text-center'>Amount</p></div>
                        </div>
                    </div>
                </div>
                <div className={`${style?.Product} border-end d-flex align-items-center justify-content-center`}><p className='p-1 fw-bold  text-center'>Product Amount</p></div>
                <div className={`${style?.Discount} border-end d-flex align-items-center justify-content-center`}><p className='p-1 fw-bold  text-center'>Discount</p></div>
                <div className={`${style?.Total} d-flex align-items-center justify-content-center`}><p className='p-1 fw-bold  text-center'>Total Amount</p></div>
            </div>
            {/* table data */}
            <div className="d-flex border-start border-end border-bottom">
                <div className={`${style?.Sr} border-end d-flex align-items-center justify-content-center`}><p className='p-1  text-center'>Sr</p></div>
                <div className={`${style?.Design} border-end d-flex align-items-center justify-content-center`}><p className='p-1'>Design</p></div>
                <div className={`${style?.Diamond} border-end`}>
                    <div className="d-flex flex-column justify-content-betwen">
                        <div className="d-flex ">
                            <div className="col-2"><p className='p-1 '>Tr PD PD</p></div>
                            <div className="col-2"><p className='p-1'>1mm</p></div>
                            <div className="col-2"><p className='p-1 text-end'>1</p></div>
                            <div className="col-2"><p className='p-1 text-end'>0.275</p></div>
                            <div className="col-2"><p className='p-1 text-end'>100</p></div>
                            <div className="col-2"><p className='p-1 text-end'>27.50</p></div>
                        </div>
                        <div>
                            <div className="d-flex lightGrey border-top">
                                <div className="col-2"><p className='p-1 fw-bold '></p></div>
                                <div className="col-2"><p className='p-1 fw-bold'></p></div>
                                <div className="col-2"><p className='p-1 fw-bold text-end'>1</p></div>
                                <div className="col-2"><p className='p-1 fw-bold text-end'>0.275</p></div>
                                <div className="col-2"><p className='p-1 fw-bold text-end'></p></div>
                                <div className="col-2"><p className='p-1 fw-bold text-end'>27.50</p></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${style?.Making} border-end`}>
                    <div className="d-flex flex-column justify-content-betwen">
                        <div className="d-flex">
                            <div className="col-6"><p className='p-1 text-end'>200.00	</p></div>
                            <div className="col-6"><p className='p-1 text-end'>3,060.80</p></div>
                        </div>
                        <div className="d-flex lightGrey border-top">
                            <div className="col-6"><p className='p-1 fw-bold text-end'></p></div>
                            <div className="col-6"><p className='p-1 fw-bold text-end'>3,060.80</p></div>
                        </div>
                    </div>
                </div>
                <div className={`${style?.Product} border-end`}>
                    <div className="d-flex justify-content-between h-100 flex-column">
                        <p className='p-1  text-end'>200.00	</p>
                        <p className='p-1  text-end lightGrey fw-bold border-top'>200.00	</p>
                    </div>
                </div>
                <div className={`${style?.Discount} border-end`}>
                    <div className="d-flex justify-content-between h-100 flex-column">
                        <p className='p-1  text-end'>0.00	</p>
                        <p className='p-1  text-end lightGrey fw-bold border-top'>0.00	</p>
                    </div>
                </div>
                <div className={`${style?.Total}`}>
                    <div className="d-flex justify-content-between h-100 flex-column">
                        <p className='p-1  text-end'>88,920.30</p>
                        <p className='p-1  text-end lightGrey fw-bold border-top'>88,920.30</p>
                    </div>
                </div>
            </div>
            {/* table total */}
            <div className="d-flex border-start border-end border-bottom lightGrey">
                <div className={`${style?.total} border-end d-flex align-items-center justify-content-center`}><p className='p-1 fw-bold'>TOTAL</p></div>
                <div className={`${style?.Diamond} border-end d-flex`}>
                    <div className="col-2"><p className='p-1 fw-bold '></p></div>
                    <div className="col-2"><p className='p-1 fw-bold'></p></div>
                    <div className="col-2"><p className='p-1 fw-bold text-end'>1</p></div>
                    <div className="col-2"><p className='p-1 fw-bold text-end'>0.275</p></div>
                    <div className="col-2"><p className='p-1 fw-bold text-end'></p></div>
                    <div className="col-2"><p className='p-1 fw-bold text-end'>27.50</p></div>
                </div>
                <div className={`${style?.Making} border-end d-flex`}>
                    <div className="col-6"><p className='p-1 fw-bold text-end'></p></div>
                    <div className="col-6"><p className='p-1 fw-bold text-end'>3,060.80</p></div>
                </div>
                <div className={`${style?.Product} border-end`}>
                    <p className='p-1  text-end  fw-bold'>200.00	</p>
                </div>
                <div className={`${style?.Discount} border-end`}>
                    <p className='p-1  text-end  fw-bold'>0.00	</p>
                </div>
                <div className={`${style?.Total}`}>
                    <p className='p-1  text-end  fw-bold'>88,920.30</p>
                </div>
            </div>
            {/* summary */}
            <div className="d-flex">
                <div className="col-6 p-1">
                    <div className="border">
                        <p className="fw-bold border-bottom lightGrey text-center">SUMMARY</p>
                        <div className="d-flex">
                            <div className="col-6 border-end px-2">
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold">GROSS WT</p>
                                    <p>31.810 gm</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold">DIAMOND WT</p>
                                    <p>6 / 6.655 cts</p>
                                </div>
                            </div>
                            <div className="col-6 px-2">
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold">DIAMOND</p>
                                    <p>731.50</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold">MAKING</p>
                                    <p>4,607.20</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold">OTHER</p>
                                    <p>1,775.00</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold">LESS</p>
                                    <p>-0.48</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold">TOTAL</p>
                                    <p>1,22,909.00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3 p-1"></div>
            </div>

        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default EstimationPrint
