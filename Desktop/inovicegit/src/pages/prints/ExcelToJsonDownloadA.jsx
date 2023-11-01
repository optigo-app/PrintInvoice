import React from 'react'
import { useState } from 'react';
import Loader from '../../components/Loader';
import { useEffect } from 'react';
import { ExportToExcel, NumberWithCommas, apiCall, isObjectEmpty } from '../../GlobalFunctions';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

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
                    if (element.MasterManagement_DiamondStoneTypeid === 1) {
                        total.csPcs += element.Pcs;
                        total.csWt += element.Wt;
                    }
                }
                return total;
            }, { diaPcs: 0, diaWt: 0, csPcs: 0, csWt: 0 });
            let diamonds = '';
            let colorStones = '';
            if(diaInfo?.diaWt !== 0){
                diamonds =  `With Diamond ${e?.MetalPurity} weight ${e?.NetWt} grams No of Diamond ${diaInfo?.diaPcs} Piece Diamond Weight ${diaInfo?.diaWt} cts`;
            }
            if(diaInfo?.csWt !== 0){
                colorStones =  `With ColorStone ${e?.MetalPurity} weight ${e?.NetWt} grams No of ColorStone ${diaInfo?.csPcs} Piece ColorStone Weight ${diaInfo?.csWt} cts`;
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
                grossWt: e?.grosswt,
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
                <table id='table-to-xls'>
                    <thead>
                        <tr>
                            <th width="100">Sr. No.</th>
                            <th width="100">Barcode</th>
                            <th width="100">Design No</th>
                            <th width="100"></th>
                            <th width="100"></th>
                            <th width="500"></th>
                            <th width="100"></th>
                            <th width="100"></th>
                            <th width="100">HKD</th>
                            <th width="100">Gross weight</th>
                            <th width="100"></th>
                            <th width="100"></th>
                            <th width="100">Barcode</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 && data.map((e, i) => {
                            return <tr key={i}>
                                <td width="100">&nbsp;{NumberWithCommas(i+1, 0)}</td>
                                <td width="100">{e?.barcode}</td>
                                <td width="100">{e?.designNo}</td>
                                <td width="100">{e?.jewellery}</td>
                                <td width="100">{e?.goldJewellery}</td>
                                <td width="500">{e?.description}</td>
                                <td width="100">&nbsp;{NumberWithCommas(e?.pcs, 0)}</td>
                                <td width="100">{e?.piece}</td>
                                <td width="100">&nbsp;{NumberWithCommas(e?.hkd, 2)}</td>
                                <td width="100">&nbsp;{NumberWithCommas(e?.grossWt, 3)}</td>
                                <td width="100">{e?.gramSymbol}</td>
                                <td width="100">{e?.cn}</td>
                                <td width="100">{e?.barcode}</td>
                            </tr>
                        })}

                    </tbody>
                </table>
            </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}</>
    )
}

export default ExcelToJsonDownloadA