import React from 'react'
import { useState } from 'react';
import Loader from '../../components/Loader';
import { useEffect } from 'react';
import { ExportToExcel, apiCall, isObjectEmpty } from '../../GlobalFunctions';

const ExcelToJsonDownload = ({ urls, token, invoiceNo, printName, evn }) => {

    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");

    const loadData = (data) => {

    //     let arr = [{
    //         sheetName: "sheet1",
    //         details: data?.BillPrint_Json
    //     }, 
    //     {
    //         sheetName: "sheet2",
    //         details: data?.BillPrint_Json1
    //     },
    //     {
    //         sheetName: "sheet3",
    //         details: data?.BillPrint_Json2
    //     },
    //     {
    //         sheetName: "sheet4",
    //         details: groupArr
    //     }
    // ]

        // ExportToExcel(arr);
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
        <>{loader ? <Loader /> : msg === "" ?
            "cHJpbnQ=" : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}</>
    )
}

export default ExcelToJsonDownload