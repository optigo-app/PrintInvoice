import React from 'react';
import { useState } from 'react';
import Loader from '../../components/Loader';
import { useEffect } from 'react';
import { ExportToExcel, NumberWithCommas, apiCall, isObjectEmpty, otherAmountDetail } from '../../GlobalFunctions';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import style from "../../assets/css/prints/exporttojsondownloadA.module.css";

const ExcelToJsonDownloadJ1 = ({ urls, token, invoiceNo, printName, evn }) => {

    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [header, setHeader] = useState({});
    const [data, setData] = useState([]);
    const [length, setLength] = useState({
        diamonds: 0,
        colorStones: 0,
        miscs: 0
    })

    const loadData = (data) => {
        // console.log(data);
        let json0Data = data?.BillPrint_Json[0];
        let diaLength = 0;
        let csLength = 0;
        let miscLength = 0;
        let blankArr = [];
        data?.BillPrint_Json1.forEach((e, i) => {
            let CHAINNETWT75GOLDRATE = 0;
            let diamonds = [];
            let colorStones = [];
            let miscs = [];
            let findingWt = 0;
            let diaTotal = {
                "CARAT": 0,
                "NO:STONE": 0,
                "VALUE": 0
            }
            let csTotal = {
                "CARAT": 0,
                "NO:STONE": 0,
                "VALUE": 0
            }
            let chainMakingCharge = 0;
            let certificationCharge = "";
            let HALLMARKCHARGE = "";
            let DancingColletCharge = "";
            let MegnetCharges = ""

            let otherCharges = otherAmountDetail(e?.OtherAmtDetail);

            otherCharges.forEach((ele, i) => {
                // if ((ele.label).toLowerCase() === "hall mark") {
                //     console.log(ele);
                //     HALLMARKCHARGE = ele?.value;
                // }  
                // if ((ele.label).toLowerCase() === "certification charge") {
                //     certificationCharge = ele?.value;
                // } 
                 if ((ele.label).toLowerCase() === "dancing collet") {
                    DancingColletCharge = ele?.value;
                } 
                 if ((ele.label).toLowerCase() === "magnet charges") {
                    MegnetCharges = ele?.value;
                }
            })

            data?.BillPrint_Json2.forEach((ele, i) => {
                if (e?.SrJobno === ele?.StockBarcode) {
                    let materialobj = {
                        "SHAPE": ele?.ShapeName,
                        "CLARITY": ele?.QualityName,
                        "COLOUR": ele?.Colorname,
                        "CARAT": ele?.Wt,
                        "NO:STONE": ele?.Pcs,
                        "VALUE": ele?.Amount,
                        "RATE": ele?.Rate
                    }
                    if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
                        diamonds.push(materialobj);
                        diaTotal["CARAT"] += ele?.Wt;
                        diaTotal["NO:STONE"] += ele?.Pcs;
                        diaTotal["VALUE"] += ele?.Amount;
                     
                    } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
                        colorStones.push(materialobj);
                        csTotal["CARAT"] += ele?.Wt;
                        csTotal["NO:STONE"] += ele?.Pcs;
                        csTotal["VALUE"] += ele?.Amount;
                    } else if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
                        if(ele?.IsHSCOE === 0){
                            miscs.push(materialobj);
                        }else{
                            if(ele?.ShapeName === "Certification_IGI"){
                                certificationCharge += (ele?.Rate*ele?.Pcs);
                            }
                            if(ele?.ShapeName === "Hallmark"){
                                HALLMARKCHARGE += (ele?.Rate*ele?.Pcs);
                            }
                           
                        }
                    } else if (ele?.MasterManagement_DiamondStoneTypeid === 5) {
                        findingWt += ele?.Wt;
                        chainMakingCharge += ele?.Wt * ele?.SettingRate;
                    }else if(ele?.MasterManagement_DiamondStoneTypeid === 4){
                        CHAINNETWT75GOLDRATE += ele?.Rate;
                    }
                }
            });
            CHAINNETWT75GOLDRATE = CHAINNETWT75GOLDRATE * findingWt;
            if (diaLength < diamonds.length) {
                diaLength = diamonds.length;
            }
            if (csLength < colorStones.length) {
                csLength = colorStones.length;
            }
            if (miscLength < miscs.length) {
                miscLength = miscs.length;
            }
            let obj = {
                "JOY DESIGINE NO": e?.MFG_DesignNo,
                "Vendor Design No.": e?.designno,
                "Vendor Job No.": e?.SrJobno,
                "Item Details": e?.Categoryname,
                "PCS": 1,
                "GROSS WEIGHT": e?.grosswt,
                "NET WEIGHT 1": e?.NetWt + findingWt,
                "TOTAL AMOUNT WITH OUT GST,TCS": e?.UnitCost,
                "PURITY": e?.MetalPurity,
                "Color": e?.MetalColor,
                "NET WT 2": e?.NetWt,
                "NET WEIGHT * 75% RATE": e?.MetalAmount,
                "CHAIN NET WT (Finding weight)": findingWt,
                "CHAIN NET WT *75 GOLD RATE (Finding amount)": CHAINNETWT75GOLDRATE,
                "ORNAMENT MAKING CHARGE": e?.MakingAmount,
                "CHAIN MAKING CHARGE (Finding labour)": chainMakingCharge,
                "HUID NUMBER": e?.HUID,
                "Certificate No.": e?.CertificateNo,
                "diamonds": diamonds,
                "TOTAL DIAMOND CARAT": "",
                "TOTAL DIAMOND NO:STONE": "",
                "TOTAL DIAMOND VALUE": "",
                "colorStones": colorStones,
                "TOTAL COLOR STONE CARAT WT": "",
                "TOTAL COLOR STONE NO:STONE": "",
                "TOTAL COLOR STONE VALUE": "",
                "CERTIFICATION CHARGE": certificationCharge,
                "HALLMARK CHARGE": HALLMARKCHARGE,
                "Dancing Collet Charge": DancingColletCharge,
                "Megnet Charges": MegnetCharges,
                "miscs": miscs,
                "SIZE": e?.Size,
                "diamonds": diamonds,
                "colorStones": colorStones,
                "miscs": miscs,
                "diaTotal": diaTotal,
                "csTotal": csTotal,
            };
            blankArr.push(obj);
            let lengths = { ...length };
            lengths.diamonds = diaLength;
            lengths.colorStones = csLength;
            lengths.miscs = miscLength;
            setLength(lengths);
        });
        setData(blankArr);
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
                            {length?.diamonds > 0 && Array.from({ length: length?.diamonds }).map((_, ind) => {
                                return <th width="560" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={7}>
                                    Diamond Detail {ind + 1}
                                </th>
                            })}

                            <th width="240" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={3}>
                                Diamond Detail Total
                            </th>
                            {length?.colorStones > 0 && Array.from({ length: length?.colorStones }).map((_, ind) => {
                                return <th width="560" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={7}>
                                    Color Stone Detail  {ind + 1}
                                </th>
                            })}
                            <th width="240" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={3}>
                                Colorstone  Detail Total
                            </th>
                            <th width="320" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={4}>
                                All Other Charges
                            </th>
                            {length?.miscs > 0 && Array.from({ length: length?.miscs }).map((_, ind) => {
                                return <th width="560" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={7}>
                                    Misc Details {ind + 1}
                                </th>
                            })}

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
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' bgcolor="lightgrey">
                                WITH OUT BACK CHAIN NET WT
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' bgcolor="lightgrey">
                                GOLD RATE
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                ONLY BACK CHAIN
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                GOLD RATE
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' bgcolor="lightgrey">
                                WITHOUT BACKCHAIN MAKING CHARGE
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                ONLY BACKCHAIN MAKING CHARGE
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                            </th>
                            <th width="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                            </th>
                            {length?.diamonds > 0 && Array.from({ length: length?.diamonds }).map((_, ind) => {
                                return <th width="560" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={7}>
                                    DIAMOND STONE DETAIL {ind + 1} SEIVE SIZE
                                </th>
                            })}
                            <th width="240" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={3}>
                                TOTAL DIAMOND
                            </th>

                            {length?.colorStones > 0 && Array.from({ length: length?.colorStones }).map((_, ind) => {
                                return <th width="560" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={7}>
                                    COLOR STONE  {ind + 1}
                                </th>
                            })}
                            <th width="240" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={3}>
                                TOTAL COLOR STONE
                            </th>
                            <th width="320" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={4}>

                            </th>
                            {length?.miscs > 0 && Array.from({ length: length?.miscs }).map((_, ind) => {
                                return <th width="560" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center' colSpan={7}>
                                    Misc Details   {ind + 1}
                                </th>
                            })}
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                SIZE
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

                            {length?.diamonds > 0 && Array.from({ length: length?.diamonds }).map((_, ind) => {
                                return <>
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
                                </>
                            })}


                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                CARAT
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                NO:STONE
                            </th>
                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                VALUE
                            </th>


                            {length?.colorStones > 0 && Array.from({ length: length?.colorStones }).map((_, ind) => {
                                return <>
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
                                </>
                            })}

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


                            {length?.miscs > 0 && Array.from({ length: length?.miscs }).map((_, ind) => {
                                return <>
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
                                </>
                            })}

                            <th width="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                Size
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {data?.length > 0 && data.map((e, i) => {
                            return <tr>
                                <td widtd="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {NumberWithCommas(i + 1, 0)}
                                </td>
                                <td widtd="150" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["JOY DESIGINE NO"]}                            </td>
                                <td widtd="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["Vendor Design No."]}
                                </td>
                                <td widtd="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["Vendor Job No."]}
                                </td>
                                <td widtd="150" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>

                                </td>
                                <td widtd="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["Item Details"]}
                                </td>
                                <td widtd="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["PCS"]}
                                </td>
                                <td widtd="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["GROSS WEIGHT"]}
                                </td>
                                <td widtd="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["NET WEIGHT 1"]}
                                </td>
                                <td widtd="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["TOTAL AMOUNT WITH OUT GST,TCS"]}
                                </td>
                                <td widtd="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["PURITY"]}
                                </td>
                                <td widtd="100" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["Color"]}
                                </td>
                                <td widtd="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["NET WT 2"]}
                                </td>
                                <td widtd="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["NET WEIGHT * 75% RATE"]}
                                </td>
                                <td widtd="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["CHAIN NET WT (Finding weight)"]}
                                </td>
                                <td widtd="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["CHAIN NET WT *75 GOLD RATE (Finding amount)"]}
                                </td>
                                <td widtd="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["ORNAMENT MAKING CHARGE"]}
                                </td>
                                <td widtd="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["CHAIN MAKING CHARGE (Finding labour)"]}
                                </td>
                                <td widtd="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["HUID NUMBER"]}
                                </td>
                                <td widtd="120" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["Certificate No."]}
                                </td>
                                {length?.diamonds > 0 && Array.from({ length: length?.diamonds }).map((_, ind) => {
                                    return <>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                        </td>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                            {e?.diamonds[ind]?.SHAPE ?? ""}
                                        </td>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                            {e?.diamonds[ind]?.CLARITY ?? ""}
                                        </td>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                            {e?.diamonds[ind]?.COLOUR ?? ""}
                                        </td>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>

                                        </td>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                            {e?.diamonds[ind]?.CARAT ?? ""}
                                        </td>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                            {e?.diamonds[ind]?.["NO:STONE"] ?? ""}
                                        </td>
                                    </>
                                })}
                                <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["diaTotal"]?.["CARAT"] ?? ""}
                                </td>
                                <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["diaTotal"]?.["NO:STONE"] ?? ""}
                                </td>
                                <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["diaTotal"]?.["VALUE"] ?? ""}
                                </td>

                                {length?.colorStones > 0 && Array.from({ length: length?.colorStones }).map((_, ind) => {
                                    return <>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                        </td>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                            {e?.colorStones[ind]?.SHAPE ?? ""}
                                        </td>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                            {e?.colorStones[ind]?.CLARITY ?? ""}
                                        </td>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                            {e?.colorStones[ind]?.COLOUR ?? ""}
                                        </td>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                            {e?.colorStones[ind]?.["CARAT"] ?? ""}
                                        </td>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                            {e?.colorStones[ind]?.["NO:STONE"] ?? ""}
                                        </td>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                            {e?.colorStones[ind]?.["VALUE"] ?? ""}
                                        </td>
                                    </>
                                })}

                                <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["csTotal"]?.["CARAT"] ?? ""}
                                </td>
                                <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["csTotal"]?.["NO:STONE"] ?? ""}
                                </td>
                                <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["csTotal"]?.["VALUE"] ?? ""}
                                </td>

                                <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["CERTIFICATION CHARGE"] ?? ""}
                                </td>
                                <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["HALLMARK CHARGE"] ?? ""}
                                </td>
                                <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["Dancing Collet Charge"] ?? ""}
                                </td>
                                <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["Megnet Charges"] ?? ""}
                                </td>

                                {length?.miscs > 0 && Array.from({ length: length?.miscs }).map((_, ind) => {
                                    return <>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                            {e?.miscs[ind]?.SHAPE ?? ""}
                                        </td>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                            {e?.miscs[ind]?.CLARITY ?? ""}
                                        </td>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                            {e?.miscs[ind]?.COLOUR ?? ""}
                                        </td>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                            {e?.miscs[ind]?.CARAT ?? ""}
                                        </td>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                            {e?.miscs[ind]?.["NO:STONE"] ?? ""}
                                        </td>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                            {e?.miscs[ind]?.RATE ?? ""}
                                        </td>
                                        <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                            {e?.miscs[ind]?.VALUE ?? ""}
                                        </td>
                                    </>
                                })}

                                <td widtd="80" height="70" style={{ border: '1px solid black', padding: '1px' }} className='text-center'>
                                    {e?.["SIZE"]}
                                </td>

                            </tr>
                        })}
                    </tbody>
                </table>
            </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}</>
    )
}

export default ExcelToJsonDownloadJ1