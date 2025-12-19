// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=Sk1JLzQxMC8yMDI1&evn=bWVtbw==&pnm=TWVtbyBTR0wgQQ==&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvU2FsZUJpbGxfSnNvbg==&ctv=NzE=&ifid=PackingList3&pid=undefined&etp=ZXhjZWw=
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { apiCall, checkMsg, fixedValues, formatAmount, handleImageError, isObjectEmpty, NumberWithCommas } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { MetalShapeNameWiseArr } from '../../GlobalFunctions/MetalShapeNameWiseArr';

const InvoiceExcelO = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
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
        let Solitaire = []
        datas?.json2?.forEach((e) => {
            if (e?.MasterManagement_DiamondStoneTypeid === 1) {
                if (e?.IsCenterStone === 1) {
                    Solitaire.push(e);
                }

                if (e.ShapeName?.toLowerCase() === "rnd") {
                    diaonlyrndarr1.push(e);
                } else {
                    diaonlyrndarr2.push(e);
                }
            }
        });
        
        console.log("Solitaire Data: ", Solitaire);  // Log Solitaire data to check if the `SrJobno` exists

    // Ensure `resultArray` exists before processing
    if (!datas?.resultArray) {
        console.error("resultArray is undefined or missing in the data object.");
        return;
    }

    // Log the structure of resultArray
    console.log("resultArray structure: ", datas?.resultArray);

    // Log each SrJobno in Solitaire to see if it's correct
    Solitaire.forEach((solitaireItem, index) => {
        console.log(`Solitaire SrJobno [${index}]: `, solitaireItem?.SrJobno);
    });

    // Now that we have `Solitaire` filled, we can start adding it to `resultArray`
    console.log("Processing resultArray...");  // Log the start of processing resultArray
    datas?.resultArray?.forEach((resultItem) => {
        // Initialize the `solitaire` array for each result item if it doesn't exist
        resultItem.solitaire = resultItem.solitaire || [];

        // Log the SrJobno of the current resultItem being processed
        console.log(`Processing resultItem with SrJobno: ${resultItem?.SrJobno}`);  // Log each result item

        // Compare and log SrJobno from both resultItem and solitaireItem
        Solitaire.forEach((solitaireItem) => {
            console.log("Comparing SrJobno in resultItem and solitaireItem: ");
            console.log("resultItem SrJobno: ", resultItem?.SrJobno, typeof resultItem?.SrJobno);
            console.log("solitaireItem SrJobno: ", solitaireItem?.SrJobno, typeof solitaireItem?.SrJobno);

            // Ensure SrJobno is compared as string to avoid type mismatch issues
            if (String(solitaireItem?.SrJobno) === String(resultItem?.SrJobno)) {
                console.log(`Matching SrJobno found: ${solitaireItem?.SrJobno}`);  // Log when a match is found
                // Push the matching solitaire item into the result item's `solitaire` array
                resultItem.solitaire.push(solitaireItem);
            }
        });

        // Log the updated resultItem after processing solitaire
        console.log(`Updated resultItem with SrJobno ${resultItem?.SrJobno}: `, resultItem?.solitaire);
    });

    // Log the final resultArray to check if it's updated correctly
    console.log("Updated resultArray with solitaire data: ", datas?.resultArray);
        
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
        // console.log("datas", datas);
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
    const brTopLit = {
        borderTop: "0.5px solid #000000",
    };
    const spSTy = {
        backgroundColor: "#F1F1F1",
        fontWeight: "bold",
    }
    const hdSty = {
        backgroundColor: "#F5F5F5",
    };
    const styBld = {
        fontWeight: "bold",
    }
    const txtCen = {
        textAlign: "center",
    }
    const spFnt = {
        color: "red"
    }
    const spbgClr = {
        backgroundColor: "yellow"
    }
    const spBgclr = {
        backgroundColor: "rgb(253, 199, 174)"
    }
    const totalGrosswt = result?.resultArray?.reduce((acc, obj) => acc + obj.grosswt, 0);
    const totalNetWt = result?.resultArray?.reduce((acc, obj) => acc + obj.NetWt, 0);
    const totalqty = result?.resultArray?.reduce((acc, obj) => acc + obj.Quantity, 0);

    return (
        <>
            {loader ? <Loader /> : msg === "" ?
                <> <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                    table="table-to-xls"
                    filename={`Memo_SGL_A_${result?.header?.InvoiceNo}_${Date.now()}`}
                    sheet="tablexls"
                    buttonText="Download as XLS" />
                    <table id="table-to-xls" className='d-none'>
                        <tbody>
                            <tr />
                            <tr>
                                <td />
                                <td />
                                <td colSpan={14}></td>
                            </tr>
                            <tr>
                                <th width={40} style={{ ...brRight, ...brTop, ...hdSty }}>Sr.</th>
                                <th width={180} style={{ ...brRight, ...brTop, ...hdSty }}>Product</th>
                                <th width={80} style={{ ...brRight, ...brTop, ...hdSty }}>Style</th>
                                <th width={80} style={{ ...brRight, ...brTop, ...hdSty }}>Customer</th>
                                <th width={80} style={{ ...brRight, ...brTop, ...hdSty }}>Gross</th>
                                <th width={80} style={{ ...brRight, ...brTop, ...hdSty }}>Dia</th>
                                <th width={80} style={{ ...brRight, ...brTop, ...hdSty }}>Dia</th>
                                <th width={80} style={{ ...brRight, ...brTop, ...hdSty }}>Dia Clarity</th>
                                <th width={80} style={{ ...brRight, ...brTop, ...hdSty }}>Dia Color</th>
                                <th width={80} style={{ ...brRight, ...brTop, ...hdSty }}>Diamind</th>
                                <th width={80} style={{ ...brRight, ...brTop, ...hdSty }}>Cut</th>
                                <th width={80} style={{ ...brRight, ...brTop, ...hdSty }}>Stamp</th>
                                <th width={80} style={{ ...brRight, ...brTop, ...hdSty }}>Metal</th>
                                <th width={80} style={{ ...brRight, ...brTop, ...hdSty }}>Sol Dia</th>
                                <th width={80} style={{ ...brRight, ...brTop, ...hdSty }}>Sol Dia</th>
                                <th width={80} style={{ ...brRight, ...brTop, ...hdSty }}>Sol Dia</th>
                                <th width={80} style={{ ...brRight, ...brTop, ...hdSty }}>Sol Dia</th>
                                <th colSpan={3} width={240} style={{ ...brRight, ...brTop, ...hdSty }}>For Office Use</th>
                            </tr>
                            <tr>
                                <th width={40} style={{ ...brRight, ...brBotmdrk, ...hdSty }}></th>
                                <th width={180} style={{ ...brRight, ...brBotmdrk, ...hdSty }}></th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...hdSty }}>No.</th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...hdSty }}>ID</th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...hdSty }}>Wt.</th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...hdSty }}>Wt.</th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...hdSty }}>Pcs</th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...hdSty }}>LL</th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...hdSty }}>LL</th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...hdSty }}>Type</th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...hdSty }}></th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...hdSty }}></th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...hdSty }}></th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...hdSty }}>Wt.</th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...hdSty }}>Pcs.</th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...hdSty }}>Clarity LL</th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...hdSty }}>Color LL</th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...brTopLit, ...hdSty }}>SGL NO.</th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...brTopLit, ...hdSty }}>Clarity SGL</th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...brTopLit, ...hdSty }}>Color SGL</th>
                            </tr>

                            {result?.resultArray?.map((e, i) => {
                                return <tr key={i}>
                                    <td width={40} style={{ ...brRight, ...brBotm, ...txtTop }}><div>{i + 1}</div></td>

                                    <td width={180} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div>{e?.Categoryname}</div>
                                    </td>

                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div>{e?.designno}</div>
                                    </td>

                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div>{`\u00A0 ${e?.SrJobno}`}</div>
                                    </td>

                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div>{fixedValues(e?.grosswt, 3)}</div>
                                    </td>

                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div>{fixedValues(e?.totals?.diamonds?.Wt, 3)}</div>
                                    </td>

                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div>{e?.totals?.diamonds?.Pcs}</div>
                                    </td>

                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {e?.diamonds?.map((el, id) => (<div key={id}>{el?.QualityName}{`\u00A0`}</div>))}
                                    </td>

                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {e?.diamonds?.map((el, id) => (<div key={id}>{el?.Colorname}{`\u00A0`}</div>))}
                                    </td>

                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {e?.diamonds?.map((el, id) => (<div key={id}>{el?.MaterialTypeName}{`\u00A0`}</div>))}
                                    </td>

                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        {e?.diamonds?.map((el, id) => (<div key={id}>{el?.ShapeName}{`\u00A0`}</div>))}
                                    </td>

                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div>{e?.MetalPurity}</div>
                                    </td>

                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div>{e?.MetalType}</div>
                                    </td>

                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div></div>
                                    </td>

                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div></div>
                                    </td>

                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div></div>
                                    </td>

                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div></div>
                                    </td>

                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div></div>
                                    </td>

                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div></div>
                                    </td>

                                    <td width={80} style={{ ...brRight, ...brBotm, ...txtTop }}>
                                        <div></div>
                                    </td>
                                </tr>
                            })}

                            {/* <tr>
                                <td width={80} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={80} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>TOTAL</td>
                                <td width={80} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {totalqty}
                                </td>
                                <td width={120} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={140} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {totalGrosswt?.toFixed(3)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {totalNetWt?.toFixed(3)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {formatAmount(result?.mainTotal?.metal?.IsPrimaryMetal_Amount)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    { (result?.mainTotal?.diamonds?.Pcs) + (result?.mainTotal?.colorstone?.Pcs) + (result?.mainTotal?.misc?.Pcs) }
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {fixedValues( (result?.mainTotal?.diamonds?.Wt) + (result?.mainTotal?.colorstone?.Wt) + (result?.mainTotal?.misc?.Wt),3 )}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {formatAmount( (result?.mainTotal?.diamonds?.Amount) + (result?.mainTotal?.colorstone?.Amount) + (result?.mainTotal?.misc?.Amount) )}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {formatAmount( (result?.mainTotal?.diamonds?.Amount) + (result?.mainTotal?.colorstone?.Amount) + (result?.mainTotal?.misc?.Amount) )}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {result?.mainTotal?.diamonds?.Wt?.toFixed(3)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {result?.mainTotal?.diamonds?.Pcs}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    { (result?.mainTotal?.colorstone?.Wt) + (result?.mainTotal?.misc?.Wt) }
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    { (result?.mainTotal?.colorstone?.Pcs) + (result?.mainTotal?.misc?.Pcs) }
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {result?.mainTotal?.total_labour?.labour_amount}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}>
                                    {formatAmount( (result?.finalAmount) - (result?.allTaxesTotal) )}
                                </td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk, ...spBgclr }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk }}></td>
                                <td width={100} style={{ ...txtCen, ...spFnt, ...styBld, ...brTop, ...brBotmdrk, ...brRight }}></td>
                            </tr> */}
                        </tbody>
                    </table>
                </>
                : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
        </>
    )
}

export default InvoiceExcelO;