import React from 'react';
import { useState } from 'react';
import Loader from '../../components/Loader';
import { useEffect } from 'react';
import { NumberWithCommas, apiCall, isObjectEmpty } from '../../GlobalFunctions';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import style from "../../assets/css/prints/exporttojsondownloadR.module.css";
import { OrganizeDataPrint } from "./../../GlobalFunctions/OrganizeDataPrint";

const ExcelToJsonDownloadR = ({ token, invoiceNo, printName, urls, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [header, setHeader] = useState({});
    const [data, setData] = useState([]);

    const loadData = (data) => {
        let json0Data = data?.BillPrint_Json[0];
        let datas = OrganizeDataPrint(
            data?.BillPrint_Json[0],
            data?.BillPrint_Json1,
            data?.BillPrint_Json2
        );
        let resultArr = [];
        datas?.resultArray?.forEach((e, i) => {
            let obj = { ...e };
            let diaClr = [...obj?.diamonds, ...obj?.colorstone].flat();
            let findMetal = obj?.metal.findIndex(ele => ele?.IsPrimaryMetal);
            let metalrate = 0;
            if (findMetal === -1) {
                metalrate = findMetal?.Rate;
            }
            let miscCeramicWt = obj?.misc?.reduce((acc, cobj) => (cobj?.acc + cobj?.Wt), 0)

            diaClr.forEach((ele, ind) => {
                let objectType = {
                    image: false,
                    id: ind === 0 ? i + 1 : 0,
                    mtpyColName: ind === 0 ? obj?.MetalTypePurity + " " + obj?.MetalColor : "",
                    Quantity: ind === 0 ? obj?.Quantity : 0,
                    metalRate: ind === 0 ? metalrate : 0,
                    diaclrquality: ele?.QualityName,
                    diaclrsize: ele?.SizeName,
                    diaclrPcs: ele?.Pcs,
                    diaclrWt: ele?.Wt,
                    diarate: ele?.Rate,
                    diaAmount: ele?.Amount,
                    metalAmount: ind === 0 ? obj?.totals?.metal?.Amount : 0,
                    eneaml: (ind === 0 && obj?.totals?.colorstone?.Amount !== 0) ? obj?.totals?.colorstone?.Amount : 0,
                    otherCharges: ind === 0 ? obj?.OtherCharges : 0,
                    TotalAmount: ind === 0 ? obj?.TotalAmount : 0,
                };
                resultArr.push(objectType);
            });

            if (diaClr?.length === 0) {
                let objectType = {
                    image: false,
                    id: i + 1,
                    mtpyColName: obj?.MetalTypePurity + " " + obj?.MetalColor,
                    Quantity: obj?.Quantity,
                    metalRate: metalrate,
                    diaclrquality: 0,
                    diaclrsize: 0,
                    diaclrPcs: 0,
                    diaclrWt: 0,
                    diarate: 0,
                    diaAmount: 0,
                    metalAmount: obj?.totals?.metal?.Amount,
                    eneaml: (obj?.totals?.colorstone?.Amount !== 0) ? obj?.totals?.colorstone?.Amount : "",
                    otherCharges: obj?.OtherCharges,
                    TotalAmount: obj?.TotalAmount,
                };
                resultArr.push(objectType);
            }

            let objectTypeImage = {
                image: true,
                src: obj?.DesignImage
            }
            resultArr.push(objectTypeImage);
        });
        datas.resultArray = resultArr;
        setData(datas);
        setTimeout(() => {
            const button = document.getElementById('test-table-xls-button');
            if (button !== null) {
                button.click();
            }
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
                        <tr></tr>
                        <tr>
                            <th></th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>#</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}></th>
                            <th width={200} style={{ border: "0.5px solid #000", padding: "1px" }}>Barcode Number</th>
                            <th width={100} style={{ border: "0.5px solid #000", padding: "1px" }}>SKU No.</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Length </th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Kt/Clr </th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Pcs </th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}> </th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>Metal Rate</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>Issue Weight</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>After Repair Weight</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>Repair Weight Loss</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>Repair Gold Add in product</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>Return Gold to Caratlane Weight</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>Consumable Add</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>Consumable  Loss</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Quality</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Sieve Size</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Pcs</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Wt.</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Rate </th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Amount</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>Certificate No</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Fnd Amt</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Metal Amt.</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>GS Handling Charges</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Labour Per Gm</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Enemal</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Sandblast</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Metal Labour</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>Cert/HallMark. Charges</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Total Amount</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>REMARK</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.resultArray?.map((e, i) => {
                            return (!e?.image ? 
                            <tr>
                                <td></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>{e?.id !== 0 && NumberWithCommas(e?.id, 0)}</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}> </td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>{e?.mtpyColName}  </td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>{NumberWithCommas(e?.Qunatity, 0)} </td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}> </td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>{NumberWithCommas(e?.metalRate, 2)}</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>{e?.eneaml !== 0 && "ColorStone"}</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>{NumberWithCommas(e?.eneaml, 2)} </td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>example</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}> </td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>{e?.diaclrquality}</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>{e?.diaclrsize}</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>{NumberWithCommas(e?.diaclrPcs, 0)}</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>{NumberWithCommas(e?.diaclrWt, 3)}</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>{NumberWithCommas(e?.diaclrRate, 2)} </td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>{NumberWithCommas(e?.diaAmount, 2)}</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>0</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>300</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                            </tr> : 
                            <tr>
                                <td></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }} colSpan={3}> <img src="https://img.freepik.com/premium-photo/beautiful-royal-indian-wedding-jewelry-wallpaper-special-day-generative-ai_753390-3773.jpg" alt="" width={375} height={75} style={{ objectFit: "contain" }} /> </td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}> </td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>  </td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}> </td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}> </td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>gross</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>gross</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>gross</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>Name#</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>loss wight </td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>--</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>0</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>0.000</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>value</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}>Amount</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                            </tr>)
                        })}

                    </tbody>
                </table>
            </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}</>
    )
}

export default ExcelToJsonDownloadR