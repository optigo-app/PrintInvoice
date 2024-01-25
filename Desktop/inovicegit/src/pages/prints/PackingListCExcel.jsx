import React, { useEffect, useState } from 'react'
import { NumberWithCommas, apiCall, checkImageExists, checkImageExistss, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import style from "../../assets/css/prints/PackingListCExcel.module.css"
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';

const PackingListCExcel = ({ token, invoiceNo, printName, urls, evn }) => {

    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [headerData, setHeaderData] = useState({});

    const [checkBox, setCheckbox] = useState({
        image: false,
    });

    const [data, setData] = useState([]);

    const loadData = async(data) => {
        // console.log(data);
        let resultArr = [];
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
            for (const e of datas?.resultArray || []) {
            let goldRate = 0;
            let goldAmount = 0;
            let findgoldDetails = e?.metal.find((ele, ind) => ele?.IsPrimaryMetal === 1);
            if (findgoldDetails !== undefined) {
                goldRate += findgoldDetails?.Rate;
                goldAmount += findgoldDetails?.Amount;
            }
            let obj = {
                jobNo: e?.SrJobno,
                designNo: e?.designno,
                image: e?.DesignImage,
                showImage: false,
                category: e?.Categoryname,
                grosswt: e?.grosswt,
                netwt: e?.NetWt,
                mop: "",
                goldRate: goldRate,
                goldAmount: goldAmount,
                totalPcs: e?.totals?.diamonds?.Pcs,
                totalCts: e?.totals?.diamonds?.Wt,
                size: e?.Size,
                remark: e?.JobRemark
            };

            try {
                const exists = await checkImageExists(e?.DesignImage);
                if (exists) {
                    obj.showImage = true;
                    resultArr.push(obj);
                } else {
                    // console.log("Image does not exist:", e?.DesignImage);
                    resultArr.push(obj);
                }
            } catch (error) {
                // console.error("Error checking image existence:", error);
                resultArr.push(obj);
            }
      
        };

        setData(resultArr)

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
                    setMsg(data?.Message);
                }
            } catch (error) {
                console.error(error);
            }
        };
        sendData();
    }, []);

    return loader ? (
        <Loader />
    ) : msg === "" ? (
        <>
            {/* buttons */}
            <div className='d-none'>
                <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                    table="table-to-xls"
                    filename={`Packing_List_C_${headerData?.InvoiceNo}_${Date.now()}`}
                    sheet="tablexls"
                    buttonText="Download as XLS" />
                <table id='table-to-xls'>
                    <thead>
                        <tr>
                            <th height={10}></th>
                        </tr>
                        <tr>
                            <th width={10} height={50}></th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>SR NO</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>JOB no</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>DESIGN NO.</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={150}>IMAGES</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>CATEGORY</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>GROSS WT</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>NET WT</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>MOP & ENAMEL</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>Gold Rate</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>Gold amt</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>Total pcs</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>Total Cts</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D S-LC (pcs)</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D S-LC (CW)	"D S-LB (pcs)</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>S-LB (CW)</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D WT pcs +11</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D WT CW +11</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D BUG(S-LB)pcs</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D BUG (S-LB) CW</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D PR PCS</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D PR CW</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D.RATE(-2 DIA)</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D.RATE +2-11</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D.RATE +11</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D.RATE-BG</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D PR RATE</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D AMT</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>SIZE</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>REMARK</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((e, i) => {
                            return <tr key={i}>
                                <td width={10} height={e?.showImage ? 150 : 35}></td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> {i + 1}</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> {e?.jobNo}</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> {e?.designNo}</td>
                                <td style={{ padding: "10px", border: "0.5px solid #000", }} align='center'>{e?.showImage && <img src={e?.image} alt=' ' width={148} height={148} />}</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> {e?.category}</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> {NumberWithCommas(e?.grosswt, 3)}</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> {NumberWithCommas(e?.netwt, 3)}</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 0</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> {NumberWithCommas(e?.goldRate, 2)}</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> {NumberWithCommas(e?.goldAmount, 2)}</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 1246</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 6.926</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 905	5.450</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 341</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 1.476</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 0.000</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 0.000</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 0</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 0.000</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 0</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 0</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 0</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 0</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 0</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 0</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 0</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 0</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> {e?.size}</td>
                                <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> {e?.remark}</td>
                            </tr>
                        })}


                        <tr>
                            <td width={10} height={40}></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center' colSpan={3}> <b>TOTAL</b></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 34.250</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 32.865</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 1246</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 6.926</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 905	5.450</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 341</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 1.476</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> 4141.44</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'></td>
                        </tr>

                        <tr>
                            <td width={10} ></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} ></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", }} > </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
        </p>
    );
}

export default PackingListCExcel
