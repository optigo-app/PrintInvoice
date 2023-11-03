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


    const loadData = (data) => {
        let json0Data = data?.BillPrint_Json[0];

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
            <div className='d-none'>
                <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                    table="table-to-xls"
                    filename={`Sale_Format_A_${header?.InvoiceNo}_${Date.now()}`}
                    sheet="tablexls"
                    buttonText="Download as XLS" />
                <table id='table-to-xls' className={`${style?.excelToJsonDownloadATable}`}>
                    <thead>
                        <tr>
                            <th>Sr No</th>
                            <th width="140">Item No</th>
                            <th width="140">Tag</th>
                            <th width="140">Design No</th>
                            <th width="140">Purity</th>
                            <th width="140">Jewellery Size</th>
                            <th>Pcs</th>
                            <th>Gr Wt</th>
                            <th width="140">Total Net Wt</th>
                            <th width="200">Total Gold Amount</th>
                            <th width="140">Total DWt</th>
                            <th width="140">Total DPcs</th>
                            <th width="140">Total DAmt</th>
                            <th width="140">D Shape</th>
                            <th width="140">D Quality</th>
                            <th width="140">D Color</th>
                            <th width="140">D Pcs</th>
                            <th width="140">D WT</th>
                            <th width="140">D RATE</th>
                            <th width="140">D AMT</th>

                            <th width="120">D Shape1</th>
                            <th width="120">D Quality1</th>
                            <th width="120">D Color1</th>
                            <th width="120">D Pcs1</th>
                            <th width="120">D WT1</th>
                            <th width="120">D RATE1</th>
                            <th width="120">D AMT1</th>
                            <th width="120">D Shape2</th>

                            <th width="120">D Quality2</th>
                            <th width="120">D Color2</th>
                            <th width="120">D Pcs2</th>
                            <th width="120">D WT2</th>
                            <th width="120">D RATE2</th>
                            <th width="120">D AMT2</th>
                            <th width="120">D Shape3</th>
                            <th width="120">D Quality3</th>

                            <th width="120">D Color3</th>
                            <th width="120">D Pcs3</th>
                            <th width="120">D WT3</th>
                            <th width="120">D RATE3</th>
                            <th width="120">D AMT3</th>
                            <th width="120">D Shape4</th>
                            <th width="120">D Quality4</th>

                            <th width="120">D Color4</th>
                            <th width="120">D Pcs4</th>
                            <th width="120">D WT4</th>
                            <th width="120">D RATE4</th>
                            <th width="120">D AMT4</th>
                            <th width="120">D Shape5</th>
                            <th width="120">D Quality5</th>

                            <th width="120">D Color5</th>
                            <th width="120">D Pcs5</th>
                            <th width="120">D WT5</th>
                            <th width="120">D RATE5</th>
                            <th width="120">D AMT5</th>
                            <th width="120">D Shape6</th>
                            <th width="120">D Quality6</th>

                            <th width="120">C Color6</th>
                            <th width="120">C Pcs6</th>
                            <th width="120">C WT6</th>
                            <th width="120">C RATE6</th>
                            <th width="120">C AMT6</th>
                            <th width="120">Mi Shape</th>
                            <th width="120">Mi Quality</th>

                            <th width="120">Mi Color</th>
                            <th width="120">Mi Pcs</th>
                            <th width="120">Mi WT</th>
                            <th width="120">Mi RATE</th>
                            <th width="120">Mi AMT</th>
                            <th width="120">Mi Shape1</th>
                            <th width="120">Mi Quality1</th>

                            <th width="120">Mi Color1</th>
                            <th width="120">Mi Pcs1</th>
                            <th width="120">Mi WT1</th>

                            <th width="120">Mi RATE1</th>
                            <th width="120">Mi AMT1</th>
                            <th width="120">Mi Shape2</th>
                            <th width="120">Mi Quality2</th>

                            <th width="120">Mi Color2</th>
                            <th width="120">Mi Pcs2</th>
                            <th width="120">Mi WT2</th>
                            <th width="120">Mi RATE2</th>
                            <th width="120">Mi AMT2</th>
                            <th width="120">Mi Shape3</th>
                            <th width="120">Mi Quality3</th>

                            <th width="120">Mi Color3</th>
                            <th width="120">Mi Pcs3</th>
                            <th width="120">Mi WT3</th>
                            <th width="120">Mi RATE3</th>
                            <th width="120">Mi AMT3</th>
                            <th width="120">Mi Shape4</th>
                            <th width="120">Mi Quality4</th>

                            <th width="120">Mi Color3</th>
                            <th width="120">Mi Pcs3</th>
                            <th width="120">Mi WT3</th>
                            <th width="120">Mi RATE3</th>
                            <th width="120">Mi AMT3</th>
                            <th width="120">Mi Shape4</th>
                            <th width="120">Mi Quality4</th>

                            
                            
                            
                            
                            
                            
                            



                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}</>
    )
}

export default ExcelToJsonDownloadJ1