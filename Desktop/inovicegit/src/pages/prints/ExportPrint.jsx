import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/exportPrint.module.css";
import { apiCall, handlePrint } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { handleImageError } from '../../GlobalFunctions/HandleImageError';

const ExportPrint = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [data, setData] = useState([]);

    const loadData = (data) => {
        console.log(data);
        setData(data?.BillPrint_Json1);
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
        <div className="d-flex justify-content-end align-items-center print_sec_sum4 pb-4 mt-5 w-100 " >
            <div className="form-check ps-3">
                <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
            </div>
        </div>
        {/* data */}
        <div className={`${style?.img_container} pt-2 pad_60_allPrint`}>
            {data && data.map((e, i) => {
                return <div className="border rounded " key={i}>
                    <img src={e?.DesignImage} alt="" className='w-100 pt-2' onError={handleImageError}/>
                    <div className="p-1 border-top">
                        <div className="d-flex justify-content-between w-100">
                            <p className='fw-bold'>{e?.SrNo}</p>
                            <p className='fw-bold'>{e?.designno}</p>
                        </div>
                        <p className='fw-bold'>{e?.SrJobno} </p>
                    </div>
                </div>
            })}

        </div>
    </div>
    )
}

export default ExportPrint