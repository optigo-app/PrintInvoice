import React from 'react'
import { useState } from 'react';
import Loader from '../../components/Loader';
import { useEffect } from 'react';
import {NumberWithCommas, apiCall, isObjectEmpty } from '../../GlobalFunctions';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import style from "../../assets/css/prints/exporttojsondownloadA.module.css";

const ExcelToJsonDownloadA = ({ urls, token, invoiceNo, printName, evn }) => {

    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [header, setHeader] = useState({});
    const [data, setData] = useState([]);

    const loadData = (data) => {
        let json0Data = data?.BillPrint_Json[0];
        let resultArr = [];
        data?.BillPrint_Json1.forEach((e, i) => {
            const diaInfo = data?.BillPrint_Json2.reduce((total, element) => {
                if (e?.SrJobno === element?.StockBarcode) {
                    if (element.MasterManagement_DiamondStoneTypeid === 1) {
                        total.diaPcs += element.Pcs;
                        total.diaWt += element.Wt;
                    }
                    if (element.MasterManagement_DiamondStoneTypeid === 2) {
                        total.csPcs += element.Pcs;
                        total.csWt += element.Wt;
                    }
                }
                return total;
            }, { diaPcs: 0, diaWt: 0, csPcs: 0, csWt: 0 });
            let diamonds = '';
            let colorStones = '';
            if (diaInfo?.diaWt !== 0) {
                diamonds = `With Diamond ${e?.MetalPurity} weight ${NumberWithCommas(e?.NetWt, 3)} grams No of Diamond ${NumberWithCommas(diaInfo?.diaPcs, 0)} Piece Diamond Weight ${NumberWithCommas(diaInfo?.diaWt, 3)} cts`;
            }
            if (diaInfo?.csWt !== 0) {
                colorStones = `With ColorStone ${e?.MetalPurity} weight ${NumberWithCommas(e?.NetWt, 3)} grams No of ColorStone ${NumberWithCommas(diaInfo?.csPcs, 0)} Piece ColorStone Weight ${NumberWithCommas(diaInfo?.csWt, 3)} cts`;
            }
            let obj = {
                srNo: i,
                barcode: e?.SrJobno,
                designNo: e?.designno,
                jewellery: 'Jewellery',
                goldJewellery: 'Gold Jewellery',
                description: `${e?.MetalPurity} Jewellery ${e?.Categoryname} ${diamonds} ${colorStones}`,
                pcs: 1,
                piece: `${e?.Categoryname.includes("ear") ? "Pair" : "Piece"}`,
                hkd: e?.TotalAmount,
                grossWt: NumberWithCommas(e?.grosswt, 3),
                gramSymbol: "G",
                cn: "CN",
            };
            resultArr.push(obj);
        });
        setData(resultArr);
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
                            <th width="100"></th>
                            <th width="100"></th>
                            <th width="100"></th>
                            <th width="100"></th>
                            <th width="100"></th>
                            <th width="500"></th>
                            <th width="100"></th>
                            <th width="100"></th>
                            <th width="100"></th>
                            <th width="100"></th>
                            <th width="100"></th>
                            <th width="100"></th>
                            <th width="100"></th>
                        </tr>
                        <tr>
                            <th width="100" style={{ border: '1px solid black', padding: '1px' }}>Sr. No.</th>
                            <th width="100" style={{ border: '1px solid black', padding: '1px' }}>Barcode</th>
                            <th width="100" style={{ border: '1px solid black', padding: '1px' }}>Design No</th>
                            <th width="100" style={{ border: '1px solid black', padding: '1px' }}></th>
                            <th width="100" style={{ border: '1px solid black', padding: '1px' }}></th>
                            <th width="500" style={{ border: '1px solid black', padding: '1px' }}></th>
                            <th width="100" style={{ border: '1px solid black', padding: '1px' }}></th>
                            <th width="100" style={{ border: '1px solid black', padding: '1px' }}></th>
                            <th width="100" style={{ border: '1px solid black', padding: '1px' }}>HKD</th>
                            <th width="100" style={{ border: '1px solid black', padding: '1px' }}>Gross weight</th>
                            <th width="100" style={{ border: '1px solid black', padding: '1px' }}></th>
                            <th width="100" style={{ border: '1px solid black', padding: '1px' }}></th>
                            <th width="100" style={{ border: '1px solid black', padding: '1px' }}>Barcode</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 && data.map((e, i) => {
                            return <tr key={i}>
                                <td width="100"  style={{ border: '1px solid black', padding: '1px' }} className='text-danger'>  &nbsp;{NumberWithCommas(i + 1, 0)}</td>
                                <td width="100" style={{ border: '1px solid black', padding: '1px'}} className='text-danger'>{e?.barcode}</td>
                                <td width="100" style={{ border: '1px solid black', padding: '1px'}} className='text-danger'>{e?.designNo}</td>
                                <td width="100" style={{ border: '1px solid black', padding: '1px'}} className='text-danger'>{e?.jewellery}</td>
                                <td width="100" style={{ border: '1px solid black', padding: '1px'}} className='text-danger'>{e?.goldJewellery}</td>
                                <td width="500" style={{ border: '1px solid black', padding: '1px'}} className='text-danger'>{e?.description}</td>
                                <td width="100" style={{ border: '1px solid black', padding: '1px'}} className='text-danger'>&nbsp;{NumberWithCommas(e?.pcs, 0)}</td>
                                <td width="100" style={{ border: '1px solid black', padding: '1px'}} className='text-danger'>{e?.piece}</td>
                                <td width="100" style={{ border: '1px solid black', padding: '1px'}} className='text-danger'>&nbsp;{NumberWithCommas(e?.hkd, 2)}</td>
                                <td width="100" style={{ border: '1px solid black', padding: '1px'}} className='text-danger'>&nbsp;{NumberWithCommas(e?.grossWt, 3)}</td>
                                <td width="100" style={{ border: '1px solid black', padding: '1px'}} className='text-danger'>{e?.gramSymbol}</td>
                                <td width="100" style={{ border: '1px solid black', padding: '1px'}} className='text-danger'>{e?.cn}</td>
                                <td width="100" style={{ border: '1px solid black', padding: '1px'}} className='text-danger'>{e?.barcode}</td>
                            </tr>
                        })}

                    </tbody>
                </table>
            </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}</>
    )
}

export default ExcelToJsonDownloadA