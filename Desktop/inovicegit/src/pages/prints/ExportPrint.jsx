import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/exportPrint.module.css";
import { apiCall, handlePrint } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { handleImageError } from '../../GlobalFunctions/HandleImageError';

const ExportPrint = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [invoice, setInvoice] = useState("");
    const [customerCode, setCustomerCode] = useState("")
    const [data, setData] = useState([]);
    const [checkBox, setCheckbox] = useState({
        invoiceNo: false,
        customerCode: false
    })

    const loadData = (data) => {
        console.log(data);
        setInvoice(data?.BillPrint_Json[0]?.InvoiceNo);
        setCustomerCode(data?.BillPrint_Json[0]?.Customercode);
        setData(data?.BillPrint_Json1);
    }

    const handleChange = (e) => {
        const {name, checked} = e?.target;
        setCheckbox({...checkBox, [name]: checked});
    }

    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls, evn);
                loadData(data?.Data);
                setLoader(false);
            } catch (error) {
                console.error(error);
            }
        }
        sendData();
    }, []);


    return (loader ? <Loader /> : <div className={`${style?.containerExportPrint}`}>
        {/* print button */}
        <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} pb-4 mt-5 w-100`} >
            <div className="form-check d-flex align-items-center">
                <input className="border-dark me-2" type="checkbox" checked={checkBox?.invoiceNo} onChange={e => handleChange(e)} name='invoiceNo' />
                <label className="">
                    Invoice No
                </label>
            </div>
            <div className="form-check d-flex align-items-center">
                <input className="border-dark me-2" type="checkbox" checked={checkBox?.customerCode} onChange={e => handleChange(e)} name='customerCode' />
                <label className="">
                    Customer Code
                </label>
            </div>
            <div className="form-check ps-3">
                <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
            </div>
        </div>
        {checkBox?.invoiceNo && <p className='pt-2 px-2'>Invoice No: <span className="fw-bold">{invoice}</span></p>}
        {checkBox?.customerCode && <p className='px-2'>Customer Code: <span className="fw-bold">{customerCode}</span></p>}

        
        {/* data */}
        <div className={`d-flex flex-wrap pt-2 pad_60_allPrint`}>
            {data && data.map((e, i) => {
                return <div className="col-3 p-2" key={i}>
                    <div className="border rounded border-black">
                    <img src={e?.DesignImage} alt="" className='w-100 pt-2 object-fit-contain' onError={handleImageError} />
                    <div className="p-1 border-top border-black">
                        <div className="d-flex justify-content-between w-100">
                            <p className='fw-bold'>{e?.SrNo}</p>
                            <p className='fw-bold'>{e?.designno}</p>
                        </div>
                        <p className='fw-bold'>{e?.SrJobno} </p>
                    </div>
                </div>
                </div>
            })}
        </div>

        {/* <div className={`d-flex flex-wrap pt-2 pad_60_allPrint`}>
            {data && data.map((e, i) => {
                return <div className="col-3 p-2">
                    <div className="border rounded border-black" key={i}>
                    <img src={e?.DesignImage} alt="" className='w-100 pt-2 object-fit-contain' onError={handleImageError} />
                    <div className="p-1 border-top border-black">
                        <div className="d-flex justify-content-between w-100">
                            <p className='fw-bold'>{e?.SrNo}</p>
                            <p className='fw-bold'>{e?.designno}</p>
                        </div>
                        <p className='fw-bold'>{e?.SrJobno} </p>
                    </div>
                </div>
                </div>
            })}
        </div> */}
    </div>
    )
}

export default ExportPrint