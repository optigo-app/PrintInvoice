import React from 'react'
import { apiCall, handlePrint, isObjectEmpty } from '../../GlobalFunctions';
import { useState } from 'react';
import { useEffect } from 'react';
import Loader from '../../components/Loader';
import style from "../../assets/css/prints/estimatePrint1.module.css";

const EstimatePrint1 = ({token, invoiceNo, printName, urls, evn}) => {

    const [image, setImage] = useState(true);
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [json0Data, setJson0Data] = useState({});

    
    const loadData = (data) => {
        setJson0Data(data?.BillPrint_Json[0]);
        console.log(data);
    }

    const handleChange = (e) => {
            image ? setImage(false) : setImage(true);
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
    return (<>
        {loader ? <Loader /> : msg === "" ? <div className='container containerEstimate pad_60_allPrint'>
            {/* print button */}
            <div className="d-flex justify-content-end align-items-center print_sec_sum4 pb-4 mt-5 w-100" >
                <div className="form-check pe-3 mb-0">
                    <input className="form-check-input border-dark" type="checkbox" checked={image} onChange={e => handleChange(e)} name='image' />
                    <label className="form-check-label h6 mb-0 pt-1">
                        With Image
                    </label>
                </div>
                <div className="form-check ps-3">
                    <input type="button" className="btn_white blue mt-0 py-0" value="Print" onClick={(e) => handlePrint(e)} />
                </div>
            </div>
            {/* gst no  */}
            <div className='d-flex justify-content-center'>
                <p>{json0Data?.Company_VAT_GST_No} | {json0Data?.Company_CST_STATE}-{json0Data?.Company_CST_STATE_No} | PAN-{json0Data?.Pannumber}</p>
            </div>
            {/* print name */}
            <div className="border p-1 mt-2 border-2 min_height_label bgGrey text-center" >
                <p className='text-uppercase fw-bold text-white'>{json0Data?.PrintHeadLabel}</p>
            </div>
            {/* customer detail */}
       
        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
    </>
    )
}

export default EstimatePrint1