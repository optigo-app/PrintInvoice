import React from 'react'
import { useEffect } from 'react';
import { HeaderComponent, apiCall, handlePrint, isObjectEmpty } from '../../GlobalFunctions';
import { useState } from 'react';
import Loader from '../../components/Loader';

const Summary11 = ({ urls, token, invoiceNo, printName, evn }) => {

    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [headerComp, setHeaderComp] = useState(null);

    const loadData = (data) => {
        let head = HeaderComponent(data?.BillPrint_Json[0]?.HeaderNo, data?.BillPrint_Json[0]);
        setHeaderComp(head);
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
            <div className='container max_width_container mt-5 pad_60_allPrint'>
                {/* buttons */}
                <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4">
                    <div className="form-check ps-3">
                        <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* header */}
                {headerComp}
                <div className="mt-3 border-top "></div>
                <div className="mt-2 border">
                    <div className="d-flex justify-content-betwee">

                    </div>
                </div>
                {/* table header */}
            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default Summary11