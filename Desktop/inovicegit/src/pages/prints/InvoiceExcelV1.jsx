// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=SlMvNjMzLzI1LTI2&evn=c2FsZQ==&pnm=SW52b2ljZSBFeGNlbCBWMQ==&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvU2FsZUJpbGxfSnNvbg==&ctv=NzE=&ifid=PackingList3&pid=undefined&etp=ZXhjZWw=
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { apiCall, checkMsg, fixedValues, formatAmount, isObjectEmpty, NumberWithCommas } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { MetalShapeNameWiseArr } from '../../GlobalFunctions/MetalShapeNameWiseArr';

const InvoiceExcelV1 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    // console.log("User has navigated to this file.");
    const [result, setResult] = useState(null);
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [diamondWise, setDiamondWise] = useState([]);
    const [MetShpWise, setMetShpWise] = useState([]);
    const [notGoldMetalTotal, setNotGoldMetalTotal] = useState(0);
    const [notGoldMetalWtTotal, setNotGoldMetalWtTotal] = useState(0);
    const [isImageWorking, setIsImageWorking] = useState(true);
    const handleImageErrors = () => {
        setIsImageWorking(false);
    };

    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(
                    token,
                    invoiceNo,
                    printName,
                    urls,
                    evn,
                    ApiVer
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
                    // setMsg(data?.Message);
                    const err = checkMsg(data?.Message);
                    console.log(data?.Message);
                    setMsg(err);
                }
            } catch (error) {
                console.log(error);
            }
        };
        sendData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function loadData(data) {
        let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
        data.BillPrint_Json[0].address = address;

        const datas = OrganizeDataPrint(
            data?.BillPrint_Json[0],
            data?.BillPrint_Json1,
            data?.BillPrint_Json2
        );

        let met_shp_arr = MetalShapeNameWiseArr(datas?.json2);

        setMetShpWise(met_shp_arr);
        let tot_met = 0;
        let tot_met_wt = 0;
        met_shp_arr?.forEach((e, i) => {
            tot_met += e?.Amount;
            tot_met_wt += e?.metalfinewt;
        });
        setNotGoldMetalTotal(tot_met);
        setNotGoldMetalWtTotal(tot_met_wt);

        let diaObj = {
            ShapeName: "OTHERS",
            wtWt: 0,
            wtWts: 0,
            pcPcs: 0,
            pcPcss: 0,
            rRate: 0,
            rRates: 0,
            amtAmount: 0,
            amtAmounts: 0,
        };

        let diaonlyrndarr1 = [];
        let diaonlyrndarr2 = [];
        let diaonlyrndarr3 = [];
        let diaonlyrndarr4 = [];
        let diarndotherarr5 = [];
        let diaonlyrndarr6 = [];
        // Step 1: Track unique MaterialTypeName values
        datas?.resultArray?.forEach((e) => {
            const materialTypes = {}; // Local object to track unique MaterialTypeName values

            e?.diamonds?.forEach((diamond) => {
                if (diamond?.MasterManagement_DiamondStoneTypeid === 1) {
                    const materialType = diamond?.MaterialTypeName;
                    if (materialType && !materialTypes[materialType]) {
                        materialTypes[materialType] = materialType;
                    }
                }
            });

            // Step 2: Add materialTypes to each element in resultArray
            e.materialTypes = materialTypes;
        });

        datas?.json2?.forEach((e) => {
            if (e?.MasterManagement_DiamondStoneTypeid === 1) {
                if (e.ShapeName?.toLowerCase() === "rnd") {
                    diaonlyrndarr1.push(e);
                } else {
                    diaonlyrndarr2.push(e);
                }
            }
        });

        diaonlyrndarr1.forEach((e) => {
            let findRecord = diaonlyrndarr3.findIndex(
                (a) =>
                    e?.StockBarcode === a?.StockBarcode &&
                    e?.ShapeName === a?.ShapeName &&
                    e?.QualityName === a?.QualityName &&
                    e?.Colorname === a?.Colorname
            );

            if (findRecord === -1) {
                let obj = { ...e };
                obj.wtWt = e?.Wt;
                obj.pcPcs = e?.Pcs;
                obj.rRate = e?.Rate;
                obj.amtAmount = e?.Amount;
                diaonlyrndarr3.push(obj);
            } else {
                diaonlyrndarr3[findRecord].wtWt += e?.Wt;
                diaonlyrndarr3[findRecord].pcPcs += e?.Pcs;
                diaonlyrndarr3[findRecord].rRate += e?.Rate;
                diaonlyrndarr3[findRecord].amtAmount += e?.Amount;
            }
        });

        diaonlyrndarr2.forEach((e) => {
            let findRecord = diaonlyrndarr4.findIndex(
                (a) =>
                    e?.StockBarcode === a?.StockBarcode &&
                    e?.ShapeName === a?.ShapeName &&
                    e?.QualityName === a?.QualityName &&
                    e?.Colorname === a?.Colorname
            );

            if (findRecord === -1) {
                let obj = { ...e };
                obj.wtWt = e?.Wt;
                obj.wtWts = e?.Wt;
                obj.pcPcs = e?.Pcs;
                obj.pcPcss = e?.Pcs;
                obj.rRate = e?.Rate;
                obj.rRates = e?.Rate;
                obj.amtAmount = e?.Amount;
                obj.amtAmounts = e?.Amount;
                diaonlyrndarr4.push(obj);
            } else {
                diaonlyrndarr4[findRecord].wtWt += e?.Wt;
                diaonlyrndarr4[findRecord].wtWts += e?.Wt;
                diaonlyrndarr4[findRecord].pcPcs += e?.Pcs;
                diaonlyrndarr4[findRecord].pcPcss += e?.Pcs;
                diaonlyrndarr4[findRecord].rRate += e?.Rate;
                diaonlyrndarr4[findRecord].rRates += e?.Rate;
                diaonlyrndarr4[findRecord].amtAmount += e?.Amount;
                diaonlyrndarr4[findRecord].amtAmounts += e?.Amount;
            }
        });

        diaonlyrndarr4.forEach((e) => {
            diaObj.wtWt += e?.wtWt;
            diaObj.wtWts += e?.wtWts;
            diaObj.pcPcs += e?.pcPcs;
            diaObj.pcPcss += e?.pcPcss;
            diaObj.rRate += e?.rRate;
            diaObj.rRates += e?.rRates;
            diaObj.amtAmount += e?.amtAmount;
            diaObj.amtAmounts += e?.amtAmounts;
        });

        diaonlyrndarr3?.forEach((e) => {
            let find_record = diaonlyrndarr6?.findIndex(
                (a) =>
                    e?.ShapeName === a?.ShapeName &&
                    e?.QualityName === a?.QualityName &&
                    e?.Colorname === a?.Colorname
            );
            if (find_record === -1) {
                let obj = { ...e };
                obj.wtWts = e?.wtWt;
                obj.pcPcss = e?.pcPcs;
                obj.rRates = e?.rRate;
                obj.amtAmounts = e?.amtAmount;
                diaonlyrndarr6.push(obj);
            } else {
                diaonlyrndarr6[find_record].wtWts += e?.wtWt;
                diaonlyrndarr6[find_record].pcPcss += e?.pcPcs;
                diaonlyrndarr6[find_record].rRates += e?.rRate;
                diaonlyrndarr6[find_record].amtAmounts += e?.amtAmount;
            }
        });

        diarndotherarr5 = [...diaonlyrndarr6, diaObj];
        setDiamondWise(diarndotherarr5);
        setResult(datas);
        setTimeout(() => {
            const button = document.getElementById('test-table-xls-button');
            button.click();
        }, 500);
    }

    // console.log("result", result);

    // Style...
    const txtTop = {
        verticalAlign: "top",
    };
    const brRight = {
        borderRight: "0.5px solid #000000",
    };
    const brBotm = {
        borderBottom: "0.5px solid #000000",
    };
    const brBotmdrk = {
        borderBottom: "1px solid #000000",
    };
    const brTop = {
        borderTop: "1px solid #000000",
    };
    const hdSty = {
        backgroundColor: "rgb(6, 80, 150)",
        color: "#FFFFFF"
    };
    const styBld = {
        fontWeight: "bold",
    }
    const txtCen = {
        textAlign: "center",
    }
    const txtEnd = {
        textAlign: "right",
    }
    const spFnt = {
        color: "red"
    }
    const totalGrosswt = result?.resultArray?.reduce((acc, obj) => acc + obj.grosswt, 0);
    const totalNetWt = result?.resultArray?.reduce((acc, obj) => acc + obj.NetWt, 0);

    return (
        <>
            {loader ? <Loader /> : msg === "" ?
                <> <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                    table="table-to-xls"
                    filename={`Invoice_ExcelV1_${result?.header?.InvoiceNo}_${Date.now()}`}
                    sheet="tablexls"
                    buttonText="Download as XLS" />
                    <table id="table-to-xls" className='d-none'>
                        <tbody>
                            <tr>
                                <th width={80} style={{ ...hdSty, ...brRight, ...brBotm }}>SR NO</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>DESIGN CODE</th>
                                <th width={140} style={{ ...hdSty, ...brRight, ...brBotm }}>ITEM DESCRIPTION</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>LAB</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>CERT NO.</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>METAL COLOUR</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>GOLD KARAT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>GROSS WEIGHT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>NET WT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>WASTAGE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>GOLD FINE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>GOLD RATE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>GOLD VALUE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>DIAMOND TYPE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL STONE WT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL STONE PCS</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>DIAMOND WT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>DIAMOND PCS</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>COLOUR</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>CLARITY</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>SHAPE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>MM SIZE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>DIAMONDS RATE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>DIAMOND AMOUNT {result?.header?.CurrencyCode}</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>DIAMOND VALUE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>COLORSTONE WT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>COLORSTONE PCS</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>COLORSTONE VALUE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL LABOUR</th>
                                <th width={100} style={{ ...brRight, ...brBotm, ...spFnt, ...hdSty, ...styBld }}>TOTAL VALUE</th>
                            </tr>
                            {result?.resultArray?.map((e, i) => {
                                return <tr key={i}>
                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}><div>{i + 1}</div></td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop, ...styBld }}><div>{e?.designno}</div><div>{e?.SrJobno}</div></td>

                                    <td width={140} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div>{e?.Categoryname}</div>
                                    </td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {e?.misc
                                            ?.filter((el) => el?.ShapeName?.includes("Certification_"))
                                            .map((el, id) => {
                                                const shapeNameAfterCertification = el?.ShapeName?.split("Certification_")[1];
                                                return shapeNameAfterCertification ? <div key={id}>{shapeNameAfterCertification}</div> : null;
                                            })}
                                    </td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div>{e?.CertificateNo}</div>
                                    </td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {e?.metal?.map((el, id) => (<div key={id}>{el?.ShapeName} {el?.Colorname}</div>))}
                                    </td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div>{e?.MetalPurity}</div>
                                    </td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div>{fixedValues(e?.grosswt, 3)}</div>
                                    </td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div>{fixedValues(e?.NetWt, 3)}</div>
                                    </td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div>{fixedValues(e?.Wastage, 3)}</div>
                                    </td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div>{fixedValues(e?.PureNetWt, 3)}</div>
                                    </td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop, ...txtEnd }}>
                                        {e?.metal?.map((el, id) => (<div key={id}>{NumberWithCommas(el?.Rate, 2)}</div>))}
                                    </td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop, ...txtEnd }}>
                                        {e?.metal?.map((el, id) => (<div key={id}>{NumberWithCommas(el?.Amount, 2)}</div>))}
                                    </td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {e?.materialTypes && Object.keys(e?.materialTypes).map((key, id) => (
                                            <div key={id}>{e.materialTypes[key]}</div>
                                        ))}
                                    </td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {fixedValues((e?.totals?.diamonds?.Wt) + (e?.totals?.colorstone?.Wt) + (e?.totals?.misc?.Wt), 3)}
                                    </td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {(e?.totals?.diamonds?.Pcs) + (e?.totals?.colorstone?.Pcs) + (e?.totals?.misc?.Pcs)}
                                    </td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {e?.diamonds?.map((el, id) => (
                                            <div key={id}>{fixedValues(el?.Wt, 3)}</div>
                                        ))}
                                    </td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {e?.diamonds?.map((el, id) => (
                                            <div key={id}>{el?.Pcs}</div>
                                        ))}
                                    </td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {e?.diamonds?.map((el, id) => (
                                            <div key={id}>{el?.Colorname}</div>
                                        ))}
                                    </td> {/* Color */}

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {e?.diamonds?.map((el, id) => (
                                            <div key={id}>{el?.QualityName}</div>
                                        ))}
                                    </td> {/* Clarity */}

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {e?.diamonds?.map((el, id) => (
                                            <div key={id}>{el?.ShapeName}</div>
                                        ))}
                                    </td> {/* Shape */}

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop, textAlign: "left" }}>
                                        {e?.diamonds?.map((el, id) => (
                                            <div key={id}>{el?.SizeName}</div>
                                        ))}
                                    </td> {/* Size */}

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {e?.diamonds?.map((el, id) => (
                                            <div key={id}>{formatAmount(el?.Rate, 2)}</div>
                                        ))}
                                    </td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {e?.diamonds?.map((el, id) => (
                                            <div key={id}>{formatAmount(el?.Amount, 2)}</div>
                                        ))}
                                    </td> {/* Total AMT */}

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {<div>{formatAmount(e?.totals?.diamonds?.Amount, 2)}</div>}
                                    </td>{ /* Per Job DMD Total */}

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {e?.totals?.colorstone?.Wt?.toFixed(3)}
                                    </td>{/* Per Job Total CLR Wt */}

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {e?.totals?.colorstone?.Pcs}
                                    </td>{/* Per Job Total CLR PCS */}

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {formatAmount(e?.totals?.colorstone?.Amount, 2)}
                                    </td>{/* Per Job Total CLR Amount */}

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div>{formatAmount(e?.MakingAmount * e?.Quantity, 2)}</div>
                                    </td>

                                    <td width={100} style={{ ...brRight, ...brBotm, ...txtTop, ...txtEnd }}>
                                        {formatAmount(e?.TotalAmount * e?.Quantity, 2)}
                                    </td>
                                </tr>
                            })}
                            <tr>
                                <td width={80} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={140} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {totalGrosswt?.toFixed(3)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {totalNetWt?.toFixed(3)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {formatAmount(result?.mainTotal?.total_Wastage, 2)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {fixedValues(result?.mainTotal?.total_purenetwt, 3)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {formatAmount(result?.mainTotal?.metal?.Amount, 2)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {fixedValues((result?.mainTotal?.diamonds?.Wt) + (result?.mainTotal?.colorstone?.Wt), 3)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {(result?.mainTotal?.diamonds?.Pcs) + (result?.mainTotal?.colorstone?.Pcs)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {fixedValues(result?.mainTotal?.diamonds?.Wt, 3)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {result?.mainTotal?.diamonds?.Pcs}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {formatAmount(result?.mainTotal?.diamonds?.Amount, 2)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {formatAmount(result?.mainTotal?.diamonds?.Amount, 2)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {fixedValues(result?.mainTotal?.colorstone?.Wt, 3)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {result?.mainTotal?.colorstone?.Pcs}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {formatAmount(result?.mainTotal?.colorstone?.Amount, 2)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {result?.mainTotal?.total_labour?.labour_amount}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk, ...brRight }}>
                                    {formatAmount((result?.finalAmount) - (result?.allTaxesTotal), 2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </>
                : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
        </>
    )
}

export default InvoiceExcelV1;