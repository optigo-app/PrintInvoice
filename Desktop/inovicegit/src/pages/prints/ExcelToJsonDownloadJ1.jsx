import React from 'react'
import { useState } from 'react';
import Loader from '../../components/Loader';
import { useEffect } from 'react';
import { ExportToExcel, NumberWithCommas, apiCall, isObjectEmpty } from '../../GlobalFunctions';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import style from "../../assets/css/prints/exporttojsondownloadA.module.css";

const ExcelToJsonDownloadJ1 = ({ urls, token, invoiceNo, printName, evn }) => {

    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [header, setHeader] = useState({});

    const loadData = (data) => {
        let json0Data = data?.BillPrint_Json[0];
        console.log(data);
        setHeader(json0Data);
        setTimeout(() => {
            const button = document.getElementById('test-table-xls-button');
            button.click();
        }, 0);
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
            // <div className='d-none'>
            <div>
                <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                    table="table-to-xls"
                    filename={`Sale_Format_A_${header?.InvoiceNo}_${Date.now()}`}
                    sheet="tablexls"
                    buttonText="Download as XLS" />
                <table id='table-to-xls' className={`${style?.excelToJsonDownloadATable}`}>
                    <thead>
                        <tr></tr>
                        <tr>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Sr No
                            </th>
                            <th width="150" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Vendor design no
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                design No
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                job No
                            </th>
                            <th width="150" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Customer job No
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Category
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                No of Pcs
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Gross Wt
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Net Wt
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Basic Value
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Purity
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Color
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Main Pcs Net Wt
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Main Pcs Metal Amount
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Finding Wt
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Finding metal amount
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Main Pcs Labour
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Finding Labour
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                HUID NUMBER
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Certificate No.
                            </th>
                            <th width="560" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={7}>
                                Diamond Detail 1
                            </th>
                            <th width="240" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={3}>
                                Diamond Detail Total
                            </th>
                            <th width="560" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={7}>
                                Color Stone Detail 1
                            </th>
                            <th width="240" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={3}>
                                Colorstone  Detail Total
                            </th>
                            <th width="320" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={4}>
                                All Other Charges
                            </th>
                            <th width="560" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={7}>
                                Misc Details 1
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Size
                            </th>
                        </tr>
                        <tr></tr>
                        <tr>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                            </th>
                            <th width="150" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                JADesignCode
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={2}>
                                SUPLIER DESIGN CODE
                            </th>
                            <th width="150" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                ITEM
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                NO
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' bgColor="lightgrey">
                                WITH OUT BACK CHAIN NET WT
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' bgColor="lightgrey">
                                GOLD RATE
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                ONLY BACK CHAIN
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                GOLD RATE
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' bgColor="lightgrey">
                                WITHOUT BACKCHAIN MAKING CHARGE
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                ONLY BACKCHAIN MAKING CHARGE
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                            </th>
                            <th width="560" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={7}>

                            </th>
                            <th width="240" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={3}>

                            </th>
                            <th width="560" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={7}>

                            </th>
                            <th width="240" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={3}>

                            </th>
                            <th width="320" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={4}>

                            </th>
                            <th width="560" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={7}>

                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>

                            </th>
                        </tr>
                        <tr></tr>
                        <tr>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                SR. No.
                            </th>
                            <th width="150" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                JOY DESIGINE NO
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Vendor Design No.
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Vendor Job No.
                            </th>
                            <th width="150" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                JOBCARD NUMBER
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Item Details
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                PCS
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                GROSS WEIGHT
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                NET WEIGHT
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                TOTAL AMOUNT WITH OUT GST,TCS
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                PURITY
                            </th>
                            <th width="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Color
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                NET WT
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                NET WEIGHT * 75% RATE
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                CHAIN NET WT
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                CHAIN NET WT *75 GOLD RATE
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                ORNAMENT MAKING CHARGE
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                CHAIN MAKING CHARGE
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                HUID NUMBER
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Certificate No.
                            </th>

                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                STONE
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                SHAPE
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                CLARITY
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                COLOUR
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                CUT
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                CARAT
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                NO:STONE
                            </th>

                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                CARAT
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                NO:STONE
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                VALUE
                            </th>

                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                STONE
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                SHAPE
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                CLARITY
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                COLOR
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                CARAT WT
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                NO:STONE
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                VALUE
                            </th>

                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                CARAT WT
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                NO:STONE
                            </th>
                             <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                VALUE
                            </th>

                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                CERTIFICATION CHARGE
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                HALLMARK CHARGE
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Dancing Collet Charge
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Megnet Charges
                            </th>

                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                SHAPE
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                CLARITY
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                COLOR
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                WT
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                NO:STONE
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                RATE
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                VALUE
                            </th>

                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Size
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>


                        </tr>
                    </tbody>
                </table>
            </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}</>
    )
}

export default ExcelToJsonDownloadJ1