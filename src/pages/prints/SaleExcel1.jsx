// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&fdate=MjAyOC0wMS0wMQ==&tdate=MjAyOC0wMS0zMQ==&evn=U2FsZXM=&pnm=c2FsZSBleGNlbCAx&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvT3JkZXJTYWxlX0pzb24=&etp=ZXhjZWw=&ctv=NzE=

import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { apiCall, checkMsg, fixedValues, formatAmount, handleImageError, isObjectEmpty, NumberWithCommas, saleTallyApiCall } from '../../GlobalFunctions';
import Loader from '../../components/Loader';

const SaleExcel1 = ({ urls, token, printName, evn, ApiVer, fdate, tdate }) => {
    const [result, setResult] = useState(null);
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await saleTallyApiCall(
                    urls,
                    token,
                    printName,
                    evn,
                    ApiVer,
                    fdate,
                    tdate
                );

                if (data?.Status === "200") {
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
                    const err = checkMsg(data?.Message);
                    console.log(data?.Message);
                    setMsg(err);
                }
            } catch (error) {
                console.log(error);
            }
        };
        sendData();
    }, []);

    function loadData(data) {
        setResult(data);
        setTimeout(() => {
            const button = document.getElementById('test-table-xls-button');
            button.click();
        }, 500);
    }

    console.log("result", result);

    const FntStyl = {
        fontFamily: "calibri, sans-serif",
    }
    const txtTop = {
        verticalAlign: "top",
    };
    const brRight = {
        borderRight: "0.5px solid #000000",
    };
    const brBotm = {
        borderBottom: "0.5px solid #000000",
    };
    const hdSty = {
        color: "black"
    };
    const decodedValue = atob(printName);
    const shouldHide = decodedValue !== "Invoice Excel V1";
    return (
        <>
            {loader ? <Loader /> : msg === "" ?
                <> <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                    table="table-to-xls"
                    filename={shouldHide ? (`Invoice_ExcelV_${result?.header?.InvoiceNo}_${Date.now()}`) : (`Invoice_ExcelV1_${result?.header?.InvoiceNo}_${Date.now()}`)}
                    sheet="tablexls"
                    buttonText="Download as XLS" />
                    {/* <table id="table-to-xls"> */}
                    <table id="table-to-xls" className='d-none'>
                        <tbody>
                            <tr>
                                <th width={80} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>SR NO</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>Invoice#</th>
                                <th width={140} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>Invoice Date</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>Customer Name</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>mobile no</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>Billing Company address</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>Shipping Company address</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>PAN CARD NO</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>GST NO</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>HSN CODE </th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>GROSS WEIGHT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>LESS WEIGHT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>NET WEIGHT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>Karat Type</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>Net Amount</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>SGST</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>CGST</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>Total Amount</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>AMOUNT IN BANK</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>DATE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>AMOUNT IN CASH</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>DATE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>OLD GOLD WEIGHT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>OLD SILVER WEIGHT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, }}>OLD METAL AMOUNT</th>
                            </tr>
                            {result?.BillPrint_Json?.map((e, i) => {
                                const prevInvoiceNo = result?.BillPrint_Json[i - 1]?.InvoiceNo;
                                const isSameInvoice = prevInvoiceNo === e?.InvoiceNo;

                                return (
                                    <tr key={i}>
                                        <td>{!isSameInvoice ? i + 1 : ""}</td>
                                        <td>{!isSameInvoice ? e?.InvoiceNo : ""}</td>
                                        <td>{!isSameInvoice ? e?.EntryDate : ""}</td>
                                        <td>{!isSameInvoice ? e?.CustName : ""}</td>
                                        <td>{!isSameInvoice ? e?.customermobileno : ""}</td>
                                        <td>{!isSameInvoice ? e?.CompanyCity : ""}</td>
                                        <td>{!isSameInvoice ? e?.customercity : ""}</td>
                                        <td>{!isSameInvoice ? e?.CustPanno : ""}</td>
                                        <td>{!isSameInvoice ? e?.CustGstNo : ""}</td>

                                        {/* ===== ITEM / SHARE COLUMNS (ALWAYS SHOW) ===== */}
                                        <td>{e?.HSNNo}</td>
                                        <td>{e?.grosswt}</td>
                                        <td>{fixedValues(e?.PureNetWt, 3)}</td>
                                        <td>{e?.NetWt}</td>
                                        <td>{e?.MetalTypePurity}</td>
                                        <td>{e?.TotalAmount}</td>

                                        {/* ===== TAX & TOTAL (ONLY FIRST ROW) ===== */}
                                        <td>{!isSameInvoice ? e?.TotalSGSTAmount : ""}</td>
                                        <td>{!isSameInvoice ? e?.TotalCGSTAmount : ""}</td>
                                        <td>{!isSameInvoice ? e?.FinalTotalAmount : ""}</td>

                                        {/* ===== PAYMENTS (ONLY FIRST ROW) ===== */}
                                        <td>{!isSameInvoice ? e?.BankReceived : ""}</td>
                                        <td>{!isSameInvoice ? e?.EntryDate : ""}</td>
                                        <td>{!isSameInvoice ? e?.CashReceived : ""}</td>
                                        <td>{!isSameInvoice ? e?.EntryDate : ""}</td>

                                        {/* ===== OLD GOLD (ONLY FIRST ROW) ===== */}
                                        <td>{!isSameInvoice ? e?.oggoldwt : ""}</td>
                                        <td>{!isSameInvoice ? e?.ogsilverwt : ""}</td>
                                        <td>{!isSameInvoice ? e?.OldGoldAmount : ""}</td>

                                    </tr>
                                );
                            })}

                        </tbody>
                    </table>
                </>
                : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
        </>
    )
}

export default SaleExcel1;