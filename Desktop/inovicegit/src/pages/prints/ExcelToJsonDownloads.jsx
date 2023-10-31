import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { apiCall, fixedValues, handleImageError, isObjectEmpty, NumberWithCommas } from '../../GlobalFunctions';
import Loader from '../../components/Loader';

const ExcelToJsonDownloads = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState([]);
    const [header, setHeader] = useState({});
    const [total, setTotal] = useState({});
    const loadData = (data) => {
        let blankArr = [];
        setHeader(data?.BillPrint_Json[0]);
        let totalsObj = {
            srNo: "",
            srJobNo: "",
            orderPoNumber: "",
            designNo: "",
            sencoDesignNo: "",
            image: "",
            category: "",
            size: "",
            MetalColor: "",
            MetalPurity: "",
            pcs: "",
            grossWt: "",
            NetWt: "",
            metalWtt: "",
            ktRate: "",
            goldAmount: "",
            seiveGroup: "",
            diaColorPcs: 0,
            diaColorCts: 0,
            diaColorRate: "",
            diamondColorStoneQuality: "Total",
            diaColorMiscAmount: 0,
            labourrate: "",
            labourValue: "",
            totalLabour: "",
            totalAmount: 0,
            totalObjTital: true,
        }
        data?.BillPrint_Json1.forEach((e, i) => {
            let diamondsColorStonesMiscs = [];
            let metals = [];
            let goldAmount = 0;
            data?.BillPrint_Json2.forEach((ele, ind) => {
                if(ele?.StockBarcode === e?.SrJobno){
                    if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                        metals.push(ele);
                        goldAmount += ele?.Amount;
                    }
                    if (ele?.MasterManagement_DiamondStoneTypeid === 2 || ele?.MasterManagement_DiamondStoneTypeid === 1 || ele?.MasterManagement_DiamondStoneTypeid === 3) {
                        diamondsColorStonesMiscs.push(ele);
                    }
                }

            });
            let arr = [diamondsColorStonesMiscs, metals];
            let largestLength = -1;
            arr.forEach((ele, i) => {
                if (ele.length > largestLength) {
                    largestLength = ele.length;
                }
            });
            let ktRate = [];
            metals.forEach((ele, ind) => {
                let findindex = ktRate.findIndex(elem => elem === ele?.Rate);
                if (findindex === -1) {
                    ktRate.push(ele?.Rate);
                }
            });
            let ktrates = ktRate.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            let netWt = "";
            let metalWtt = "";
            if (metals.length > 1) {
                netWt = metals[0]?.Wt+e?.LossWt;
                metalWtt = metals[1]?.Wt;
            } else if (metals.length === 1) {
                netWt = e?.NetWt+e?.LossWt;
            }
            let totalObj = {
                srNo: "",
                srJobNo: "",
                orderPoNumber: "",
                designNo: "",
                sencoDesignNo: "",
                image: "",
                category: "",
                size: "",
                MetalColor: "",
                MetalPurity: "",
                pcs: "",
                grossWt: "",
                NetWt: "",
                metalWtt: "",
                ktRate: "",
                goldAmount: "",
                seiveGroup: "",
                diaColorPcs: 0,
                diaColorCts: 0,
                diaColorRate: "",
                diamondColorStoneQuality: "Total",
                diaColorMiscAmount: 0,
                labourrate: "",
                labourValue: "",
                totalLabour: "",
                totalAmount: "",
                totalObjTital: true,
            }
            let totalCount = largestLength+1;
            let designimage=  false;
            Array.from({ length: largestLength }).forEach((ele, ind) => {
                let resultObj = {
                    srNo: "",
                    srJobNo: "",
                    orderPoNumber: "",
                    designNo: "",
                    sencoDesignNo: "",
                    image: "",
                    category: "",
                    size: "",
                    MetalColor: "",
                    MetalPurity: "",
                    pcs: "",
                    grossWt: "",
                    NetWt: "",
                    metalWtt: "",
                    ktRate: "",
                    goldAmount: "",
                    seiveGroup: "",
                    diaColorPcs: "",
                    diaColorCts: "",
                    diaColorRate: "",
                    diamondColorStoneQuality: "",
                    diaColorMiscAmount: "",
                    labourrate: "",
                    labourValue: "",
                    totalLabour: "",
                    totalAmount: "",
                    totalObjTital: false,
                }
                if (ind === 0) {
                    resultObj.srNo = i + 1;
                    resultObj.srJobNo = e?.SrJobno;
                    resultObj.orderPoNumber = e?.PO;
                    resultObj.designNo = e?.designno;
                    resultObj.sencoDesignNo = e?.MFG_DesignNo;
                    resultObj.pcs = 1;
                    resultObj.image = e?.DesignImage;
                    resultObj.category = e?.Categoryname;
                    resultObj.size = e?.Size;
                    resultObj.MetalColor = e?.MetalColor;
                    resultObj.MetalPurity = e?.MetalPurity;
                    resultObj.grossWt = NumberWithCommas(e?.grosswt, 3);
                    resultObj.NetWt = NumberWithCommas(netWt, 3);
                    resultObj.metalWtt = NumberWithCommas(metalWtt, 3);
                    if (goldAmount !== 0) {
                        resultObj.goldAmount = goldAmount;
                    }
                    if (ktrates !== 0) {
                        resultObj.ktRate = ktrates;
                    }
                    if(e?.DesignImage === "") {
                        designimage = true;
                    }
                    resultObj.labourrate =  NumberWithCommas(e?.MaKingCharge_Unit, 2);
                    resultObj.labourValue = NumberWithCommas(e?.MakingAmount, 2);
                    resultObj.totalLabour = NumberWithCommas(e?.MakingAmount, 2);
                    resultObj.totalAmount = NumberWithCommas(e?.TotalAmount, 2);
                    totalsObj.totalAmount += e?.TotalAmount;
                }
                if (diamondsColorStonesMiscs[ind]) {
                    resultObj.diaColorPcs = diamondsColorStonesMiscs[ind]?.Pcs;

                    totalObj.diaColorPcs += diamondsColorStonesMiscs[ind]?.Pcs;
                    totalObj.diaColorCts += diamondsColorStonesMiscs[ind]?.Wt;

                    resultObj.diaColorCts = NumberWithCommas(diamondsColorStonesMiscs[ind]?.Wt, 3);
                    resultObj.diaColorRate = NumberWithCommas(diamondsColorStonesMiscs[ind]?.Rate, 2);
                    let shapeName = "";
                    let seiveGroup = "";
                    if (diamondsColorStonesMiscs[ind]?.MasterManagement_DiamondStoneTypeid === 1) {
                        shapeName = "DIA";
                        seiveGroup = diamondsColorStonesMiscs[ind]?.GroupName;
                    } else if (diamondsColorStonesMiscs[ind]?.MasterManagement_DiamondStoneTypeid === 2) {
                        shapeName = "CS";
                    } else if (diamondsColorStonesMiscs[ind]?.MasterManagement_DiamondStoneTypeid === 3) {
                        shapeName = "M";
                    }
                    // let diaColorMiscShapes = ""; 
                    resultObj.diamondColorStoneQuality = shapeName + " / " +
                        diamondsColorStonesMiscs[ind]?.ShapeName + " / " +
                        diamondsColorStonesMiscs[ind]?.QualityName + " / " +
                        diamondsColorStonesMiscs[ind]?.Colorname + " / " +
                        diamondsColorStonesMiscs[ind]?.SizeName;
                    if (diamondsColorStonesMiscs[ind]?.Amount !== 0 && diamondsColorStonesMiscs[ind]?.Amount !== "") {
                        resultObj.diaColorMiscAmount = NumberWithCommas(diamondsColorStonesMiscs[ind]?.Amount, 2);
                        totalObj.diaColorMiscAmount += diamondsColorStonesMiscs[ind]?.Amount;
                    }
                    resultObj.seiveGroup = seiveGroup;
                   
                }
                blankArr.push(resultObj);
            });
            totalsObj.diaColorPcs += totalObj.diaColorPcs; 
            totalsObj.diaColorCts += totalObj.diaColorCts; 
            totalsObj.diaColorMiscAmount += totalObj?.diaColorMiscAmount; 
            if(totalObj.diaColorMiscAmount !== 0 && totalObj.diaColorMiscAmount!== ""){
                totalObj.diaColorMiscAmount = NumberWithCommas(totalObj?.diaColorMiscAmount, 2);
            }
          
            if(totalObj.diaColorPcs === 0){
                totalObj.diaColorPcs = ""
            }
            if(totalObj.diaColorCts === 0){
                totalObj.diaColorCts = ""
            }
           
            blankArr.push(totalObj);
            if(totalCount < 5 && !designimage){
                Array.from({length: 5-totalCount}).forEach((e, i)=> {
                    let blankLine = {
                        srNo: "",
                        srJobNo: "",
                        orderPoNumber: "",
                        designNo: "",
                        sencoDesignNo: "",
                        image: "",
                        category: "",
                        size: "",
                        MetalColor: "",
                        MetalPurity: "",
                        pcs: "",
                        grossWt: "",
                        NetWt: "",
                        metalWtt: "",
                        ktRate: "",
                        goldAmount: "",
                        seiveGroup: "",
                        diaColorPcs: "",
                        diaColorCts: "",
                        diaColorRate: "",
                        diamondColorStoneQuality: "",
                        diaColorMiscAmount: "",
                        labourrate: "",
                        labourValue: "",
                        totalLabour: "",
                        totalAmount: "",
                        totalObjTital: false,
                    }
                    blankArr.push(blankLine);
                })
            }
        });
        setTotal(totalsObj);
        setData(blankArr);
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
        <>
            {loader ? <Loader /> : msg === "" ?
                <> <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                    table="table-to-xls"
                    filename={`Sale_Format_S_${header?.InvoiceNo}_${Date.now()}`}
                    sheet="tablexls"
                    buttonText="Download as XLS" />
                    <table id="table-to-xls" className='d-none'>
                        <tbody>
                            <tr> <td colSpan={5}>{header?.customerfirmname} </td> </tr>
                            <tr> <td colSpan={5}>{header?.CustName}</td></tr>
                            <tr> <td colSpan={5}>{header?.customerAddress1}, {header?.customerAddress2}</td></tr>
                            <tr> <td colSpan={5}>{header?.customercity}, {header?.State}</td></tr>
                            <tr>
                                <td colSpan={5}>{header?.CompanyCountry}{header?.customerpincode}</td>
                                <td width={160}></td>
                                <td width={100}></td>
                                <td width={100}></td>
                                <td width={100}></td>
                                <td width={100}></td>
                                <td width={100}></td>
                                <td width={100}></td>
                                <td width={100}></td>
                                <td width={100}></td>
                                <td width={100}></td>
                                <td width={100}></td>
                                <td width={100}></td>
                                <td width={100}></td>
                                <td width={100}></td>
                                <td width={100}></td>
                                <td width={300}>Seno Gold Ltd Invoice No.: {header?.InvoiceNo}</td>
                                <td colSpan={2} style={{ textAlign: "center" }}>Date: {header?.EntryDate}</td>
                            </tr>
                            <tr>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Sr. No.</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Job No.</td>
                                <td width={200} style={{ textAlign: "center", fontWeight: "bold" }}>Order/ P.O.No....</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Design</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Senco</td>
                                <td width={160} style={{ textAlign: "center", fontWeight: "bold" }}>Images</td>
                                <td width={150} style={{ textAlign: "center", fontWeight: "bold" }}>Product </td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Ornt.Size</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Gold </td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>KT </td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Pcs</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Gross </td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Net </td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Others</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>KT</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Gold</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Seive</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Dia</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Dia</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Dia/Stone</td>
                                <td width={300} style={{ textAlign: "center", fontWeight: "bold" }}>Stone / Diamond</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Dia</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Labour</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Labour</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Total</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Total</td>
                            </tr>
                            <tr>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}></td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}></td>
                                <td width={200} style={{ textAlign: "center", fontWeight: "bold" }}></td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>No.</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Design No.</td>
                                <td width={160} style={{ textAlign: "center", fontWeight: "bold" }}></td>
                                <td width={150} style={{ textAlign: "center", fontWeight: "bold" }}>Category </td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}></td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Colour </td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Purity</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}></td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Wt</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Wt</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Metal WTT.</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Rate</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Amount</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Group</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Pcs</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Cts</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Rate</td>
                                <td width={300} style={{ textAlign: "center", fontWeight: "bold" }}>Quality</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Value</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Rate</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Value</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Labour</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>Price</td>
                            </tr>
                            {data.length > 0 && data.map((e, i) => {
                                return <tr key={i}>
                                    <td width={100} style={{ textAlign: "center" }}>{e?.srNo}</td>
                                    <td width={100} style={{ textAlign: "center" }}>{e?.srJobNo}</td>
                                    <td width={200} style={{ textAlign: "center" }}>{e?.orderPoNumber}</td>
                                    <td width={100} style={{ textAlign: "center" }}>{e?.designNo}</td>
                                    <td width={100} style={{ textAlign: "center" }}>{e?.sencoDesignNo}</td>
                                    <td width={160} style={{ textAlign: "center" }}>
                                    {(!e?.totalObjTital && e?.image !== "") && <img src={e?.image} alt="" onError={handleImageError} width={150} height={80} style={{paddingLeft: "10px", objectFit: "contain"}}/>}
                                    </td>
                                    <td width={150} style={{ textAlign: "center" }}>{e?.category}</td>
                                    <td width={100} style={{ textAlign: "center" }}>{e?.size}</td>
                                    <td width={100} style={{ textAlign: "center" }}>{e?.MetalColor}</td>
                                    <td width={100} style={{ textAlign: "center" }}>{e?.MetalPurity}</td>
                                    <td width={100} style={{ textAlign: "center" }}>&nbsp;{e?.pcs !== "" && NumberWithCommas(+e?.pcs, 0)}</td>
                                    <td width={100} style={{ textAlign: "center" }}>&nbsp;{e?.grossWt !== "" && fixedValues(+e?.grossWt, 3)}</td>
                                    <td width={100} style={{ textAlign: "center" }}>&nbsp;{e?.NetWt !== "" && fixedValues(+e?.NetWt, 3)}</td>
                                    <td width={100} style={{ textAlign: "center" }}>&nbsp;{e?.metalWtt !== "" && fixedValues(+e?.metalWtt, 3)}</td>
                                    <td width={100} style={{ textAlign: "center" }}>&nbsp;{e?.ktRate && NumberWithCommas(+e?.ktRate, 2)}</td>
                                    <td width={100} style={{ textAlign: "center" }}>&nbsp;{e?.goldAmount && NumberWithCommas(+e?.goldAmount, 2)}</td>
                                    <td width={100} style={{ textAlign: "center" }}>{e?.seiveGroup}</td>
                                    <td width={100} style={{ textAlign: "center", fontWeight: e?.totalObjTital ? "bold" : "normal" }}>&nbsp;{e?.diaColorPcs}</td>
                                    <td width={100} style={{ textAlign: "center", fontWeight: e?.totalObjTital ? "bold" : "normal" }}>&nbsp;{e?.diaColorCts !== "" && fixedValues(+e?.diaColorCts, 3)}</td>
                                    <td width={100} style={{ textAlign: "center" }}>&nbsp;{e?.diaColorRate !== "" && NumberWithCommas(+e?.diaColorRate, 2)}</td>
                                    <td width={300} style={{ textAlign: "center", fontWeight: e?.totalObjTital ? "bold" : "normal" }}>&nbsp;{e?.diamondColorStoneQuality}</td>
                                    <td width={100} style={{ textAlign: "center", fontWeight: e?.totalObjTital ? "bold" : "normal" }} className='keep_zeroes_2' wch="5"> &nbsp;{(e?.diaColorMiscAmount !== "" && e?.diaColorMiscAmount !== 0) && e?.diaColorMiscAmount}</td>
                                    <td width={100} style={{ textAlign: "center" }}>&nbsp;{e?.labourrate}</td>
                                    <td width={100} style={{ textAlign: "center" }}>&nbsp;{e?.labourValue}</td>
                                    <td width={100} style={{ textAlign: "center" }}>&nbsp;{e?.totalLabour}</td>
                                    <td width={100} style={{ textAlign: "center", fontWeight: "bold" }}>&nbsp;{e?.totalAmount}</td>
                                </tr>
                            })}
                            <tr>
                            <td width={100} style={{ textAlign: "center" }}></td>
                                    <td width={100} style={{ textAlign: "center" }}></td>
                                    <td width={200} style={{ textAlign: "center" }}></td>
                                    <td width={100} style={{ textAlign: "center" }}></td>
                                    <td width={100} style={{ textAlign: "center" }}></td>
                                    <td width={160} style={{ textAlign: "center" }}> </td>
                                    <td width={150} style={{ textAlign: "center" }}></td>
                                    <td width={100} style={{ textAlign: "center" }}></td>
                                    <td width={100} style={{ textAlign: "center" }}></td>
                                    <td width={100} style={{ textAlign: "center" }}></td>
                                    <td width={100} style={{ textAlign: "center" }}></td>
                                    <td width={100} style={{ textAlign: "center" }}></td>
                                    <td width={100} style={{ textAlign: "center" }}></td>
                                    <td width={100} style={{ textAlign: "center" }}></td>
                                    <td width={100} style={{ textAlign: "center" }}></td>
                                    <td width={100} style={{ textAlign: "center" }}></td>
                                    <td width={100} style={{ textAlign: "center" }}></td>
                                    <td width={100} style={{ textAlign: "center", fontWeight: total?.totalObjTital ? "bold" : "normal" }}>&nbsp;{total?.diaColorPcs}</td>
                                    <td width={100} style={{ textAlign: "center", fontWeight: total?.totalObjTital ? "bold" : "normal" }}>&nbsp;{total?.diaColorCts !== "" && fixedValues(+total?.diaColorCts, 3)}</td>
                                    <td width={100} style={{ textAlign: "center" }}>&nbsp;{total?.diaColorRate !== "" && NumberWithCommas(+total?.diaColorRate, 2)}</td>
                                    <td width={300} style={{ textAlign: "center", fontWeight: total?.totalObjTital ? "bold" : "normal" }}>&nbsp;{total?.diamondColorStoneQuality}</td>
                                    <td width={100} style={{ textAlign: "center", fontWeight: total?.totalObjTital ? "bold" : "normal"}}>&nbsp;{(total?.diaColorMiscAmount !== "" && total?.diaColorMiscAmount !== 0)  && NumberWithCommas(total?.diaColorMiscAmount, 2)}</td>
                                    <td width={100} style={{ textAlign: "center" }}></td>
                                    <td width={100} style={{ textAlign: "center" }}></td>
                                    <td width={100} style={{ textAlign: "center" }}></td>
                                    <td width={100} style={{ textAlign: "center", fontWeight: "bold" }} className='keep_zeroes_2'>&nbsp;{total?.totalAmount}</td>
                            </tr>
                        </tbody>
                    </table></> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
        </>
    )
}

export default ExcelToJsonDownloads;