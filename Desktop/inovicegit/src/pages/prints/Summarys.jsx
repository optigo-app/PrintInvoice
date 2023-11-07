import React, { useEffect } from 'react'
import { useState } from 'react';
import { HeaderComponent, apiCall, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import style from "../../assets/css/prints/summarys.module.css";

const Summary2 = ({ token, invoiceNo, printName, urls, evn }) => {
    const [loader, setLoader] = useState(true);
    const [headerData, setHeaderData] = useState({});
    const [headerComp, setHeaderComp] = useState(null);
    const [msg, setMsg] = useState("");
    const [checkBox, setCheckBox] = useState({
        netwt: false,
        image: false,
        brand: false,
    })

    const loadData = (data) => {
        setHeaderData(data?.BillPrint_Json[0]);

        let head = HeaderComponent(data?.BillPrint_Json[0]?.HeaderNo, data?.BillPrint_Json[0]);
        setHeaderComp(head);

    }

    const handleChangeCheck = (e) => {
        const { name, checked } = e?.target;
        setCheckBox({ ...checkBox, [name]: checked });
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
        <>  {loader ? <Loader /> : msg === "" ? <div className={`pad_60_allPrint ${style.summarysContaoiner}`}>
            <div className="container max_width_container">
                <div className="d-flex justify-content-end print_sec_sum4 pt-4 pb-4">
                    <div className="form-check pe-3">
                        <input className="form-check-input" type="checkbox" checked={checkBox?.netwt} onChange={handleChangeCheck} name='netwt' />
                        <label className="form-check-label pt-1" htmlFor="flexCheckDefault">
                            With NetWt
                        </label>
                    </div>
                    <div className="form-check pe-3">
                        <input className="form-check-input" type="checkbox" checked={checkBox?.image} onChange={handleChangeCheck} name='image' />
                        <label className="form-check-label pt-1" htmlFor="flexCheckDefault">
                            With Image
                        </label>
                    </div>
                    <div className="form-check pe-3">
                        <input className="form-check-input" type="checkbox" checked={checkBox?.brand} onChange={handleChangeCheck} name='brand' />
                        <label className="form-check-label pt-1" htmlFor="flexCheckDefault">
                            Brand
                        </label>
                    </div>

                </div>
                {/* header component */}
                {headerComp}
                <div className="border mt-2 p-2">
                    <div className="d-flex justify-content-between">
                        <div><p className='fs-4'>INVOICE# : <span className="fw-bold fs-4">SK16962022</span></p></div>
                        <div className='pb-2'><p className='fs-4'>DATE : <span className="fw-bold fs-4">07 Nov 2023</span></p></div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <div><p className='fs-4'>HSN : <span className="fw-bold fs-4">234434</span></p></div>
                    </div>

                </div>

                <div className="border p-2">
                    <div className="d-flex justify-content-between">
                        <div>
                            <p className='fs-4 fw-bold pb-2 ps-2'>TO,   kirti pvt ltd <span className="fw-bold fs-4">500.00</span></p>
                            <p className='fs-5 ps-5'>Mumbai-395044 </p>
                            <p className='fs-5 ps-5'>Phno:-951-021-3588 </p>
                        </div>
                        <div className='pb-2'><p className='fs-4 fw-bold'>500.00</p></div>
                    </div>
                </div>
                {/* table header */}
                <div className="border-start border-end border-bottom d-flex">
                    <div className={`${style?.sr_no} border-end p-2`}><p className='fw-bold'>SR#</p></div>
                    <div className={`${style?.design} border-end p-2`}><p className='fw-bold'>DESIGN</p></div>
                    <div className={`${style?.amtDetail} border-end p-2`}><p className='fw-bold text-center'>PURITY</p></div>
                    <div className={`${style?.amtDetail} border-end p-2`}><p className='fw-bold text-center'>Detail</p></div>
                    <div className={`${style?.amtDetail} border-end p-2`}><p className='fw-bold text-center'>DIA WT</p></div>
                    <div className={`${style?.amtDetail} border-end p-2`}><p className='fw-bold text-center'>DIA RATE</p></div>
                    <div className={`${style?.amtDetail} border-end p-2`}><p className='fw-bold text-center'>G WT</p></div>
                    <div className={`${style?.amtDetail} border-end p-2`}><p className='fw-bold text-center'>NWT</p></div>
                    <div className={`${style?.amtDetail} border-end p-2`}>
                        <p className='fw-bold text-center'>Making </p>
                        <p className="fw-bold text-center">Charges</p>
                    </div>
                    <div className={`${style?.amtDetail} border-end p-2`}><p className='fw-bold text-center'>CS WT</p></div>
                    <div className={`${style?.amtDetail} border-end p-2`}><p className='fw-bold text-center'>CS RATE</p></div>
                    <div className={`${style?.amtDetail} border-end p-2`}><p className='fw-bold text-center'>GOLD FINE</p></div>
                    <div className={`${style?.amtDetail} border-end p-2`}><p className='fw-bold text-center'>GOLD Rate</p></div>
                    <div className={`${style?.amtDetail} p-2`}><p className='fw-bold'>AMOUNT</p></div>
                </div>
            </div>
        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}</>
    )
}

export default Summary2