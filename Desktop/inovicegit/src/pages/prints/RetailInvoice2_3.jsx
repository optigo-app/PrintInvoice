import React, { useEffect, useState } from 'react'
import { apiCall, handlePrint, isObjectEmpty, HeaderComponent } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import style from '../../assets/css/prints/retailInovice2_3.module.css';

const RetailInvoice2_3 = ({ token, invoiceNo, printName, urls, evn }) => {

    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [headerComp, setHeaderComp] = useState(null);

    const loadData = (data) => {
        console.log(data?.BillPrint_Json[0]);
        let headerData = data?.BillPrint_Json[0];
        let head = HeaderComponent(headerData?.HeaderNo, headerData);
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
            {/* Print Button */}
            <div className={`container ${style?.containerretailInvoice2} pad_60_allPrint`}>
                <div className="printBtn_sec text-end container pt-4">
                    <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                </div>
                <div className="">
                    {headerComp}
                </div>
            </div>
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default RetailInvoice2_3