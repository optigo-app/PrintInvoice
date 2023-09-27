import React, { useEffect, useState } from 'react';
import "../../assets/css/prints/summary4.css";
import { apiCall, handleImageError, handlePrint } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { usePDF } from 'react-to-pdf';
import html2pdf from 'html2pdf.js';
import '../../assets/css/prints/summary12.css';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const Summary12 = ({ urls, token, invoiceNo, printName }) => {
    const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });

    const [billPrintJson, setBillprintJson] = useState({});
    const [BillPrintJson1, setBillPrintJson1] = useState([]);
    const [summaryDetail, setSummaryDetail] = useState([]);
    const [total, setTotal] = useState({
        diaWt: 0,
        diaRate: 0,
        diaAmt: 0,
        gwt: 0,
        nwt: 0,
        otherAmt: 0,
        csWt: 0,
        csRate: 0,
        csAmt: 0,
        goldFine: 0,
        goldAmt: 0,
        amount: 0,
        gold24Kt: 0,
        afterTaxAmt: 0,
    });
    const [header, setHeader] = useState(true);
    const [image, setimage] = useState(true);
    const [summary, setSummary] = useState(true);
    const [metalType, setMetaltype] = useState([]);
    const [totalSummary, setTotalSummary] = useState({
        gold24Kt: 0,
        gDWt: 0,
        diamondpcs: 0,
        colorStonePcs: 0,
        makingAmount: 0
    });
    const [metaltypeSum, setMetaltypeSum] = useState({
        grosswt: 0,
        NetWt: 0,
        pureWt: 0,
        MetalAmount: 0
    });
    const [lastDiamondTable, setLastDiamondTable] = useState([]);
    const [lastColorStoneTable, setLastColorStoneTable] = useState([]);
    const [lastDiamondTableTotal, setLastDiamondTableTotal] = useState({
        diaCtw: 0,
        diamondAmount: 0
    });
    const [lastColorStoneTableTotal, setLastColorStoneTableTotal] = useState({
        clrCtw: 0,
        colorStoneAmount: 0
    });
    const [loader, setLoader] = useState(true);
    const findMaterialWise = (findElement, elementNo, arr) => {
        let resultArr = arr.filter((e, i) => {
            return e[findElement] === elementNo
        });
        return resultArr
    }

    const findMaterial = (serialJobNo, json2Arr) => {
        let findArr = findMaterialWise("StockBarcode", serialJobNo, json2Arr);
        return findArr
    }

    const findKeyValuePair = (array, firstName, secondName) => {
        const counts = {};
        array.forEach(item => {
            const key = `${item[firstName]} | ${item[secondName]}`;
            counts[key] = (counts[key] || 0) + 1;
        });
        return counts;
    }

    const countCategorySubCategory = (data) => {
        let countArr = findKeyValuePair(data, "Categoryname", "SubCategoryname");
        Object.keys(countArr).forEach(key => {
            const [category, subcategory] = key.split('|');
            if (!subcategory) {
                delete countArr[category];
            }
        });

        const countsArray = Object.entries(countArr)
            .filter(([key, value]) => key.includes('|')) // Filter out single category entries
            .map(([key, value]) => ({ name: key, value }));

        setSummaryDetail(countsArray);
    }

    const countDiamondRate = (materialId, arr) => {
        let findArr = findMaterialWise("MasterManagement_DiamondStoneTypeid", materialId, arr);
        const rateSumMap = {};
        findArr.forEach(item => {
            const { Rate, Wt, Amount } = item;
            if (!rateSumMap[Rate]) {
                rateSumMap[Rate] = {
                    totalWeight: 0,
                    totalAmount: 0
                };
            }
            rateSumMap[Rate].totalWeight += Wt;
            rateSumMap[Rate].totalAmount += Amount;
        });

        const result = Object.keys(rateSumMap).map(rate => ({
            rate: rate,
            totalWeight: (rateSumMap[rate].totalWeight).toFixed(3),
            totalAmount: (rateSumMap[rate].totalAmount).toFixed(3)
        }));
        return result
    }

    const countTotalAmount = (arr) => {
        const totalSum = arr.reduce((sum, item) => sum + item.Amount + item.SettingAmount, 0);
        return Math.round(totalSum);
    }

    const countTotal = (arr, taxJson) => {
        let resultObj = { ...total };
        arr.forEach((e, i) => {
            if (e?.diamondsRate.length > 0) {
                e?.diamondsRate.forEach((ele, ind) => {
                    resultObj.diaRate += +(ele.rate);
                    resultObj.diaWt += +(ele.totalWeight);
                    resultObj.diaAmt += +(ele.totalAmount);
                });
            }
            if (e?.colorStoneRate.length > 0) {
                e?.colorStoneRate.forEach((ele, ind) => {
                    resultObj.csRate += +(ele.rate);
                    resultObj.csWt += +(ele.totalWeight);
                    resultObj.csAmt += +(ele.totalAmount);
                })
            }
            resultObj.gwt += e?.grosswt;
            resultObj.nwt += e?.NetWt;
            resultObj.otherAmt += e?.OtherCharges;
            resultObj.goldFine += e?.convertednetwt;
            resultObj.goldAmt += e?.MetalAmount;
            resultObj.amount += +(e?.TotalAmount);
        })
        resultObj.diaWt = +((resultObj.diaWt).toFixed(3));
        let sgstMinus = taxJson.SGST / 100 * resultObj.amount;
        let cgstMinus = taxJson.CGST / 100 * resultObj.amount;
        let igstMinus = taxJson.IGST / 100 * resultObj.amount;
        resultObj.afterTaxAmt = Math.round(resultObj.amount + sgstMinus + cgstMinus + igstMinus - Math.abs(taxJson?.AddLess));
        setTotal(resultObj);
    }

    const lastDiamondTableFunc = (materialId, arr, json1Arr) => {
        let findArr = findMaterialWise("MasterManagement_DiamondStoneTypeid", materialId, arr);
        const rateSumMap = {};
        if (materialId === 1) {
            findArr.forEach(item => {
                const { Rate, Wt, Amount } = item;
                let record = json1Arr.find((e, i) => e.SrJobno === item?.StockBarcode);
                if (!rateSumMap[Rate]) {
                    rateSumMap[Rate] = {
                        totalWeight: 0,
                        totalAmount: 0,
                        name: "DIAMOND",
                        discount: record.Discount
                    };
                }
                rateSumMap[Rate].totalWeight += Wt;
                rateSumMap[Rate].totalAmount += Amount;
                rateSumMap[Rate].name = "DIAMOND";
                rateSumMap[Rate].discount = record.Discount;
            });

            const result = Object.keys(rateSumMap).map(rate => ({
                rate: rate,
                totalWeight: (rateSumMap[rate].totalWeight).toFixed(3),
                totalAmount: (rateSumMap[rate].totalAmount).toFixed(3),
                name: "DIAMOND",
                discount: rateSumMap[rate].discount
            }));

            let obj = { ...lastDiamondTableTotal };
            result.forEach((e, i) => {
                obj.diaCtw += +(e?.totalWeight);
                obj.diamondAmount += +(e?.totalAmount);
            });
            setLastDiamondTableTotal(obj)
            setLastDiamondTable(result);
        }
        if (materialId === 2) {
            findArr.forEach(item => {
                const { Rate, Wt, Amount } = item;
                let record = json1Arr.find((e, i) => e.SrJobno === item?.StockBarcode);
                if (!rateSumMap[Rate]) {
                    rateSumMap[Rate] = {
                        totalWeight: 0,
                        totalAmount: 0,
                        name: "COLOR STONE",
                        discount: record.Discount
                    };
                }
                rateSumMap[Rate].totalWeight += Wt;
                rateSumMap[Rate].totalAmount += Amount;
                rateSumMap[Rate].name = "COLOR STONE";
                rateSumMap[Rate].discount = record.Discount;
            });

            const result = Object.keys(rateSumMap).map(rate => ({
                rate: rate,
                totalWeight: (rateSumMap[rate].totalWeight).toFixed(3),
                totalAmount: (rateSumMap[rate].totalAmount).toFixed(3),
                name: "COLOR STONE",
                discount: rateSumMap[rate].discount
            }));
            let obj = { ...lastColorStoneTableTotal };
            result.forEach((e, i) => {
                obj.clrCtw += +(e?.totalWeight);
                obj.colorStoneAmount += +(e?.totalAmount);
            });
            setLastColorStoneTableTotal(obj);
            setLastColorStoneTable(result);
        }

    }

    const loadData = (datas) => {
        setBillprintJson(datas?.BillPrint_Json[0]);
        let json1Arr = [];
        datas?.BillPrint_Json1.forEach((e, i) => {
            let findMaterials = findMaterial(e.SrJobno, datas.BillPrint_Json2);
            let diamondsRate = countDiamondRate(1, findMaterials);
            let colorStoneRate = countDiamondRate(2, findMaterials);
            let totalAmount = countTotalAmount(findMaterials);
            let obj = { ...e };
            obj.diamondsRate = diamondsRate;
            obj.colorStoneRate = colorStoneRate;
            obj.totalAmount = totalAmount;
            json1Arr.push(obj);
        });
        countCategorySubCategory(datas?.BillPrint_Json1);
        setBillPrintJson1(json1Arr);
        countTotal(json1Arr, datas?.BillPrint_Json[0]);
        let result = [];
        let gDWt = 0;
        let nWt = 0
        let makingAmount = 0;
        json1Arr.forEach(obj => {
            let diaWt = 0;
            obj?.diamondsRate.length > 0 && obj?.diamondsRate.map((e, i) => {
                diaWt += +(e?.totalWeight);
                gDWt += +(e?.totalWeight);
            });
            const key1Value = obj?.MetalTypePurity;
            const key2Value = obj?.convertednetwt;
            const key3Value = diaWt;
            const key4Value = obj?.grosswt;
            const key5Value = obj?.NetWt;
            const key6Value = obj?.MetalAmount;
            const key7Value = obj?.Tunch;
            const key8Value = +((obj?.Tunch * obj?.NetWt / 100).toFixed(3));
            const foundIndex = result.findIndex(item => item.metalType === key1Value);
            nWt += obj?.NetWt;
            makingAmount += obj.MakingAmount;
            if (foundIndex === -1) {
                result.push({ metalType: key1Value, fineWt: key2Value, diaWt: key3Value, grosswt: key4Value, NetWt: key5Value, MetalAmount: key6Value, tunch: key7Value, pureWt: key8Value });
            } else {
                result[foundIndex].fineWt += key2Value;
                result[foundIndex].diaWt += key3Value;
                result[foundIndex].grosswt += key4Value;
                result[foundIndex].NetWt += key5Value;
                result[foundIndex].MetalAmount += key6Value;
                result[foundIndex].tunch = key7Value;
                result[foundIndex].pureWt = key8Value;
            }
        });
        let findGold24K = result.reduce((sum, item) => sum + item?.fineWt, 0)
        let obj = { ...totalSummary };
        obj.gold24Kt = findGold24K;
        obj.gDWt = ((+((gDWt).toFixed(3)) / 5) + nWt).toFixed(3);
        obj.makingAmount = makingAmount;
        let diamondPcs = 0;
        let colorStonePcs = 0;
        datas?.BillPrint_Json2.forEach((e, i) => {
            if (e?.MasterManagement_DiamondStoneTypeid === 1) {
                diamondPcs += e.Pcs;
            }
            if (e?.MasterManagement_DiamondStoneTypeid === 2) {
                colorStonePcs += e.Pcs;
            }
        });
        obj.diamondpcs = diamondPcs;
        obj.colorStonePcs = colorStonePcs;
        setTotalSummary(obj);
        setMetaltype(result);
        let object = { ...metaltypeSum }
        result.forEach((e, i) => {
            object.grosswt += e?.grosswt;
            object.NetWt += e?.NetWt;
            object.pureWt += e?.pureWt;
            object.MetalAmount += e?.MetalAmount;
        });
        setMetaltypeSum(object);
        lastDiamondTableFunc(1, datas?.BillPrint_Json2, json1Arr);
        lastDiamondTableFunc(2, datas?.BillPrint_Json2, json1Arr);

    }

    const pdfGenerator = () => {
        const content = targetRef.current;
        if (!content) return;

        const pageHeight = 200; // Adjust this value to your page height
        const contentHeight = content.getBoundingClientRect().height;

        if (contentHeight > pageHeight) {
            // Apply a page break before this content
            content.style.pageBreakAfter = 'always';
        }
        // toPDF();
        generatePdf();
    }

    const generatePdf = () => {
        const content = document.getElementById('divToPrint'); // Replace with the ID of your content div
        
        if (content) {
            html2pdf(content);
        }
    };

    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls);
                loadData(data);
                setLoader(false);

            } catch (error) {
                console.error(error);
            }
        }

        sendData();
    }, []);

    const handleChange = (e, name) => {
        if (name === "header") {
            header ? setHeader(false) : setHeader(true);
        }
        if (name === "image") {
            image ? setimage(false) : setimage(true);
        }
        if (name === "summary") {
            summary ? setSummary(false) : setSummary(true);
        }
    }

    const printDocument = () => {
        const input = document.getElementById("divToPrint");
        html2canvas(input).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF();
          pdf.addImage(imgData, "JPEG", 0, 0);
          pdf.save("download.pdf");
        });
      };



    return (<>{loader ? <Loader /> : <><div className=''>
        <div className="d-flex justify-content-end align-items-center print_sec_sum4 container summary12Container pt-4">
            <div className="form-check pe-3">
                <input className="form-check-input border-dark" type="checkbox" checked={header} onChange={e => handleChange(e, "header")} />
                <label className="form-check-label pt-1">
                    With Header
                </label>
            </div>
            <div className="form-check pe-3">
                <input className="form-check-input border-dark" type="checkbox" checked={image} onChange={e => handleChange(e, "image")} />
                <label className="form-check-label pt-1">
                    With Image
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input border-dark" type="checkbox" checked={summary} onChange={e => handleChange(e, "summary")} />
                <label className="form-check-label pt-1">
                    With Summary
                </label>
            </div>
            <div className="form-check ps-3">
                {/* <input type="button" className="btn_white blue me-3" value="Pdf" onClick={() => pdfGenerator()} /> */}
                {/* <input type="button" className="btn_white blue me-3" value="Pdf" onClick={() => handleGeneratePdf()} /> */}
                <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
            </div>
        </div>
        <div className=' pt-4 pb-5 summary12Container portrait_container' ref={targetRef} id="divToPrint">
            {header && <div className="d-flex header_section_sum4 justify-content-between align-items-center pb-2 no_break">
                <div className='address_sum4'>
                    <h1 className='h1_sum4'>{billPrintJson?.CompanyFullName}</h1>
                    <p className='address_para_sum4 lh-1 pb-1'> {billPrintJson?.CompanyAddress} </p>
                    <p className='address_para_sum4 lh-1 pb-1'>{billPrintJson?.CompanyAddress2} </p>
                    <p className='address_para_sum4 lh-1 pb-1'>{billPrintJson?.CompanyCity} {billPrintJson?.CompanyPinCode} {billPrintJson?.CompanyState} {billPrintJson?.CompanyCountry} </p>
                    <p className='address_para_sum4 lh-1 pb-1'>T {billPrintJson?.CompanyTellNo} | TOLL FREE {billPrintJson?.CompanyTollFreeNo} </p>
                    <p className='address_para_sum4 lh-1 pb-1'>{billPrintJson?.CompanyEmail} | {billPrintJson?.CompanyWebsite} </p>
                    <p className='address_para_sum4 lh-1 pb-1'>{billPrintJson?.Company_VAT_GST_No} | {billPrintJson?.Cust_CST_STATE}-{billPrintJson?.Company_CST_STATE_No} | PAN-EDJHF236D </p>
                </div>
                <div className="logo_sec_sum4">
                    <img src={billPrintJson?.PrintLogo} alt="Logo" onError={handleImageError} />
                </div>
            </div>}
            <div>
                <div className="d-flex justify-content-between border-bottom p-2 border mt-4 no_break">
                    <div className="invoice_text_sum4">
                        <h2> INVOICE# : <span>{billPrintJson?.InvoiceNo}</span></h2>
                    </div>
                    <div className="invoice_text_sum4">
                        <h2> DATE : <span>{billPrintJson?.EntryDate}</span></h2>
                    </div>
                </div>
                <div className="d-flex justify-content-between p-2 border no_break">
                    <div className="address_line_sum4">
                        <p>{billPrintJson?.lblBillTo}</p>
                        <h3>{billPrintJson?.customerfirmname}</h3>
                        <p>{billPrintJson?.customerAddress1}</p>
                        <p>{billPrintJson?.customerAddress2}</p>
                        <p>{billPrintJson?.customerAddress3}</p>
                        <p>{billPrintJson?.customercity}-{billPrintJson?.PinCode}</p>
                        <p>{billPrintJson?.customeremail1}</p>
                        <p>{billPrintJson?.Cust_CST_STATE_No_}</p>
                        <p>{billPrintJson?.vat_cst_pan}</p>
                    </div>
                    <div className="address_lines_sum4">
                        <p> Gold Rate: <span>{billPrintJson?.MetalRate24K}</span></p>
                    </div>
                </div>
                <div className="sum4_table">
                    <div className='d-flex border-bottom no_break'>
                        <div className='p-1 fw-bold ps-2 border-start border-end align-middle text-center sr_sum4'>SR#</div>
                        <div className='p-1 fw-bold border-end align-middle text-center design_sum4'>DESIGN</div>
                        <div className='p-1 fw-bold border-end align-middle text-center remark_sum4'>Remark</div>
                        <div className='p-1 fw-bold border-end align-middle text-center dia_wt_ctw_sum4'>DIA WT (ctw)</div>
                        <div className='p-1 fw-bold border-end align-middle text-center dia_rate_sum4'>DIA RATE</div>
                        <div className='p-1 fw-bold border-end align-middle text-center dia_amt_sum4'>DIA AMT</div>
                        <div className='p-1 fw-bold border-end align-middle text-center g_wt_sum4'>G WT (gm)</div>
                        <div className='p-1 fw-bold border-end align-middle text-center nwt_sum4'>NWT (gm)</div>
                        <div className='p-1 fw-bold border-end align-middle text-center other_amt_sum4'>Other AMT</div>
                        <div className='p-1 fw-bold border-end align-middle text-center cs_wt_sum4'>CS WT (ctw)</div>
                        <div className='p-1 fw-bold border-end align-middle text-center cs_rate_sum4'>CS RATE</div>
                        <div className='p-1 fw-bold border-end align-middle text-center cs_amt_sum4'>CS AMT</div>
                        <div className='p-1 fw-bold border-end align-middle text-center gold_fine_sum4'>GOLD FINE (gm)</div>
                        <div className='p-1 fw-bold border-end align-middle text-center gold_amt_sum4'>GOLD AMT</div>
                        <div className='p-1 fw-bold pe-2 border-end align-middle text-center amount_sum_4'>AMOUNT</div>
                    </div>
                    {BillPrintJson1.length > 0 && BillPrintJson1.map((e, i) => {
                        return <div className="d-flex border-bottom no_break" key={i}>
                            <div className='p-1 ps-2 sr_sum4 border-start border-end sr_sum4'> <p> {e?.SrNo} </p> </div>
                            <div className='p-1 design_sum4 border-end'>
                                <p className="fw-bold">{e?.designno}</p>
                                <p className='fw-bold'> {e?.SrJobno} </p>
                                <p className="fw-bold">{e?.Categoryname}</p>
                                {image && <img src={e?.DesignImage} alt="" onError={e => handleImageError(e)} />}
                                <p className='fw-bold'>{e?.MetalTypePurity}</p>
                                {e?.HUID !== "" && <p className='fw-bold'> HUID No. : ${e?.HUID}</p>}
                            </div>
                            <div className="p-1 remark_sum4 border-end text-end remark_sum4"> <p> {e?.CertRemark} </p> </div>
                            <div className="p-1 dia_wt_ctw_sum4 border-end text-end "> {e?.diamondsRate.length > 0 && e.diamondsRate.map((ele, indd) => {
                                return <p key={indd}>{ele?.totalWeight}</p>
                            })}</div>
                            <div className="p-1 dia_rate_sum4 border-end text-end "> {e?.diamondsRate.length > 0 && e.diamondsRate.map((ele, indd) => {
                                return <p key={indd}>{ele?.rate}</p>
                            })}</div>
                            <div className="p-1 dia_amt_sum4 border-end text-end "> {
                                e?.diamondsRate.length > 0 && e.diamondsRate.map((ele, indd) => {
                                    return <p key={indd}>{ele?.totalAmount}</p>
                                })
                            } </div>
                            <div className="p-1 g_wt_sum4 border-end text-end "> <p> {e?.grosswt} </p> </div>
                            <div className="p-1 nwt_sum4 border-end text-end "> <p> {e?.MetalDiaWt} </p> </div>
                            <div className="p-1 other_amt_sum4 border-end text-end "> <p> {e?.OtherCharges} </p> </div>
                            <div className="p-1 cs_wt_sum4 border-end text-end ">{e?.colorStoneRate.length > 0 && e.colorStoneRate.map((ele, indd) => {
                                return <p key={indd}>{ele?.totalWeight}</p>
                            })}</div>
                            <div className="p-1 cs_rate_sum4 border-end text-end "> {e?.colorStoneRate.length > 0 && e.colorStoneRate.map((ele, indd) => {
                                return <p key={indd}>{ele?.rate}</p>
                            })} </div>
                            <div className="p-1 cs_amt_sum4 border-end text-end "> {e?.colorStoneRate.length > 0 && e.colorStoneRate.map((ele, indd) => {
                                return <p key={indd}>{ele?.totalAmount}</p>
                            })} </div>
                            <div className="p-1 gold_fine_sum4 border-end text-end "> <p> {e?.convertednetwt && (e?.convertednetwt).toFixed(3)} </p> </div>
                            <div className="p-1 gold_amt_sum4 border-end text-end "> <p> {e?.MetalAmount && (e?.MetalAmount)?.toFixed(2)} </p> </div>
                            <div className="p-1 pe-2 amount_sum_4 border-end text-end">{e?.TotalAmount}</div>
                        </div>
                    })}
                    <div className="total_sec_sum4 d-flex border-bottom mb-1 no_break">
                        <div className="p-1 ps-2 total_sum4 border-start border-end bg_total_sum4 fw-bold text-center">Total</div>
                        <div className="p-1 remark_sum4 border-end text-end bg_total_sum4 fw-bold remark_sum4"> <p>  </p> </div>
                        <div className="p-1 dia_wt_ctw_sum4 border-end text-end bg_total_sum4 fw-bold "> <p> {total.diaWt} </p> </div>
                        <div className="p-1 dia_rate_sum4 border-end text-end bg_total_sum4 fw-bold "> <p>  </p> </div>
                        <div className="p-1 dia_amt_sum4 border-end text-end bg_total_sum4 fw-bold "> <p> {Math.round(total.diaAmt)} </p> </div>
                        <div className="p-1 g_wt_sum4 border-end text-end bg_total_sum4 fw-bold "> <p> {(total.gwt).toFixed(3)} </p> </div>
                        <div className="p-1 nwt_sum4 border-end text-end bg_total_sum4 fw-bold "> <p> {(total.nwt).toFixed(3)} </p> </div>
                        <div className="p-1 other_amt_sum4 border-end text-end  bg_total_sum4 fw-bold"> <p> {total.otherAmt} </p> </div>
                        <div className="p-1 cs_wt_sum4 border-end text-end bg_total_sum4 fw-bold "> <p> {total.csWt} </p> </div>
                        <div className="p-1 cs_rate_sum4 border-end text-end  bg_total_sum4 fw-bold"></div>
                        <div className="p-1 cs_amt_sum4 border-end text-end  bg_total_sum4 fw-bold"> <p> {Math.round(total.csAmt)} </p> </div>
                        <div className="p-1 gold_fine_sum4 border-end text-end  bg_total_sum4 fw-bold"> <p> {(total.goldFine).toFixed(3)} </p> </div>
                        <div className="p-1 gold_amt_sum4 border-end text-end  bg_total_sum4 fw-bold"> <p> {Math.round(total.goldAmt)} </p> </div>
                        <div className="p-1 pe-2 amount_sum_4 border-end text-end bg_total_sum4 fw-bold"> <p> {total.amount} </p> </div>
                    </div>
                    <div className="d-flex mb-1 no_break">
                        <div className="sgst_sec_sum4 border me-1">
                            <div className="bg_total_sum4 fw-bold ps-2 border-bottom mb-2">
                                Summary Detail
                            </div>
                            <div className="d-flex flex-wrap">
                                {summaryDetail.length > 0 && summaryDetail.map((elem, ind) => {
                                    return <div className="amazon_sum4 d-flex ps-2 pb-2" key={ind}>
                                        <div className="amazon_text_sum4">
                                            {elem.name}
                                        </div>
                                        <div className="amazon_number_sum4">
                                            {elem.value}
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                        <div className="sgst_part_sum4 border">
                            <div className="d-flex justify-content-between px-2 pt-1">
                                <div className="sgst_text_sum4">
                                    CGST @ 1.50%
                                </div>
                                <div className="sgst_text_sum4">
                                    {(1.50 / 100) * total.amount}
                                </div>
                            </div>
                            <div className="d-flex justify-content-between px-2">
                                <div className="sgst_text_sum4">
                                    SGST @ 1.50%
                                </div>
                                <div className="sgst_text_sum4">
                                    {(1.50 / 100) * total.amount}
                                </div>
                            </div>
                            <div className="d-flex justify-content-between px-2">
                                <div className="sgst_text_sum4 fw-bold">
                                    Less
                                </div>
                                <div className="sgst_text_sum4 fw-bold">
                                    {billPrintJson?.AddLess}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="total_sgst_sum4 mt-1 w-100 border bg_total_sum4 mb-1 no_break d-flex">
                        <div className="total_sgst_text_sum4">
                            <p className='text-end fw-bold pe-2'>TOTAL</p>
                        </div>
                        <div className="total_sgst_number_sum4">
                            <div className="d-flex justify-content-between">
                                <p className='ps-2'>CASH :</p>
                                <p className='pe-2 fw-bold'>{total?.afterTaxAmt}</p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p className='ps-2'>Gold in 24K :</p>
                                <p className='pe-2 fw-bold'>43.253</p>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex border-bottom mb-2 no_break">
                        <div className="summary_detail_sum4 border me-1">
                            <div className="fw-bold border-bottom ps-2 bg_total_sum4">
                                SUMMARY
                            </div>
                            <div className="d-flex">
                                <div className="gold_24kt_sum4 w-50 border-end">
                                    <div className="d-flex w-100">
                                        <div className="w-50 fw-bold ps-2">GOLD IN 24KT	</div>
                                        <div className="w-50 text-end pe-2">{totalSummary?.gold24Kt} gm	</div>
                                    </div>
                                    <div className="d-flex w-100">
                                        <div className="w-50 fw-bold ps-2">GROSS WT	</div>
                                        <div className="w-50 text-end pe-2">{(total?.gwt)?.toFixed(3)} gm	</div>
                                    </div>
                                    <div className="d-flex w-100">
                                        <div className="w-50 fw-bold ps-2">*(G+D) WT</div>
                                        <div className="w-50 text-end pe-2">{(totalSummary?.gDWt)} gm	</div>
                                    </div>
                                    <div className="d-flex w-100">
                                        <div className="w-50 fw-bold ps-2">NET WT </div>
                                        <div className="w-50 text-end pe-2">{(total?.nwt)?.toFixed(3)} gm</div>
                                    </div>
                                    <div className="d-flex w-100">
                                        <div className="w-50 fw-bold ps-2">DIAMOND WT</div>
                                        <div className="w-50 text-end pe-2">{totalSummary?.diamondpcs} / {total?.diaWt} ctw</div>
                                    </div>
                                    <div className="d-flex w-100 mb-2">
                                        <div className="w-50 fw-bold ps-2">STONE WT</div>
                                        <div className="w-50 text-end pe-2">{totalSummary?.colorStonePcs} / {total?.csWt} ctw</div>
                                    </div>

                                    <div className="d-flex w-100 bg_total_sum4 py-1">
                                        {/* <div className="w-50 fw-bold ps-2"></div>
                                <div className="w-50 text-end pe-2">468 / 15.003 ctw</div> */}
                                    </div>
                                </div>
                                <div className="gold_24kt_sum4 w-50">
                                    <div className="d-flex w-100">
                                        <div className="w-50 fw-bold ps-2">GOLD</div>
                                        <div className="w-50 text-end pe-2">{(total.goldAmt).toFixed(3)}</div>
                                    </div>
                                    <div className="d-flex w-100">
                                        <div className="w-50 fw-bold ps-2">DIAMOND</div>
                                        <div className="w-50 text-end pe-2">{Math.round(total.diaAmt)}</div>
                                    </div>
                                    <div className="d-flex w-100">
                                        <div className="w-50 fw-bold ps-2">CST</div>
                                        <div className="w-50 text-end pe-2">{total.csAmt}</div>
                                    </div>
                                    <div className="d-flex w-100">
                                        <div className="w-50 fw-bold ps-2">MAKING</div>
                                        <div className="w-50 text-end pe-2">{(totalSummary?.makingAmount)?.toFixed(3)}</div>
                                    </div>
                                    <div className="d-flex w-100">
                                        <div className="w-50 fw-bold ps-2">OTHER</div>
                                        <div className="w-50 text-end pe-2">{(total.otherAmt).toFixed(2)}</div>
                                    </div>
                                    <div className="d-flex w-100 mb-2">
                                        <div className="w-50 fw-bold ps-2">LESS</div>
                                        <div className="w-50 text-end pe-2">{billPrintJson?.AddLess}</div>
                                    </div>
                                    <div className="d-flex w-100 bg_total_sum4 py-1">
                                        <div className="w-50 fw-bold ps-2">Total</div>
                                        <div className="w-50 text-end pe-2">{(+(total.goldAmt) +
                                            Math.round(total.diaAmt) + +(total.csAmt) +
                                            +(totalSummary?.makingAmount) + +((total.otherAmt).toFixed(2)) + +(billPrintJson?.AddLess)).toFixed(2)} </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="cgst_sum4 border">
                            <div className="bg_total_sum4 d-flex py-1">
                                <div className="metal_type_sum4 fw-bold ps-1">
                                    Metal Type
                                </div>
                                <div className="dia_wt_sum4 fw-bold">
                                    Dia Wt (ctw)
                                </div>
                                <div className="GWt_sum4 fw-bold">
                                    GWt (gm)
                                </div>
                                <div className="net_wt_sum4 fw-bold">
                                    Net Wt (gm)
                                </div>
                                <div className="fine_wt_sum4 fw-bold">
                                    Fine Wt (gm)
                                </div>
                                <div className="gold_amount_sum4 text-end pe-1 fw-bold">
                                    Gold Amount
                                </div>
                            </div>
                            {metalType.length > 0 && metalType.map((e, i) => {
                                return <div className=" d-flex py-1" key={i}>
                                    <div className="metal_type_sum4 ps-1 text-start">
                                        {e?.metalType}
                                    </div>
                                    <div className="dia_wt_sum4">
                                        {(e?.diaWt).toFixed(3)}
                                    </div>
                                    <div className="GWt_sum4">
                                        {(e?.grosswt).toFixed(3)}
                                    </div>
                                    <div className="net_wt_sum4">
                                        {(e?.NetWt).toFixed(3)}
                                    </div>
                                    <div className="fine_wt_sum4">
                                        {(e?.fineWt).toFixed(3)}
                                    </div>
                                    <div className="gold_amount_sum4 text-end pe-1">
                                        {(e?.MetalAmount).toFixed(3)}
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                    <div className="w-100 border px-1 mb-2 note_sec_sum4 p-1 no_break">
                        <p className='fw-bold font_15_sum4'> NOTE : </p>
                        {
                            <div dangerouslySetInnerHTML={{ __html: billPrintJson?.Declaration }} className='pt-3' />
                        }
                    </div>
                    <div className='remarks_sum4 no_break'>
                        <p className="fw-bold font_16_sum4">REMARKS : </p>
                        <div dangerouslySetInnerHTML={{ __html: billPrintJson?.PrintRemark }}></div>
                    </div>
                    <p className="fw-bold pb-1 no_break">
                        TERMS INCLUDED :
                    </p>
                    <div className="d-flex border mb-2 no_break">
                        <div className="w-50 border-end height_65_sum4 d-flex justify-content-center align-items-end border-end">
                            <p className="fw-bold font_15_sum4">
                                RECEIVER'S SIGNATURE & SEAL
                            </p>
                        </div>
                        <div className="w-50 height_65_sum4 d-flex justify-content-center align-items-end">
                            <p className="fw-bold font_15_sum4">
                                for,Orail Design
                            </p>
                        </div>
                    </div>
                    {summary && <>
                        <div className="summary_table_sum4 w-100 no_break">
                            <div className="d-flex border height34Sum4 no_break">
                                <div className="metalTypeSum4 border-end d-flex align-items-center justify-content-center fw-bold">
                                    Metal Type
                                </div>
                                <div className="GwtSum4 border-end d-flex align-items-center justify-content-center fw-bold">
                                    Gwt
                                </div>
                                <div className="netWtSum4 border-end d-flex align-items-center justify-content-center fw-bold">
                                    Net wt
                                </div>
                                <div className="tunchSum4 border-end d-flex align-items-center justify-content-center fw-bold">
                                    Tunch
                                </div>
                                <div className="pureWtSum4 border-end d-flex align-items-center justify-content-center fw-bold">
                                    Pure wt
                                </div>
                                <div className="goldPriceSum4 border-end d-flex align-items-center justify-content-center fw-bold">
                                    Gold Price 24 kt
                                </div>
                                <div className="goldAmtSum4 d-flex align-items-center justify-content-center fw-bold">
                                    Gold Amount
                                </div>
                            </div>
                            {metalType.length > 0 && metalType.map((e, i) => {
                                return <div className="d-flex border no_break" key={i}>
                                    <div className="metalTypeSum4 border-end d-flex justify-content-center pe-2">
                                        {e?.metalType}
                                    </div>
                                    <div className="GwtSum4 border-end d-flex justify-content-end pe-2">
                                    {(e?.grosswt).toFixed(3)}
                                    </div>
                                    <div className="netWtSum4 border-end d-flex justify-content-end pe-2">
                                        {(e?.NetWt).toFixed(3)}
                                    </div>
                                    <div className="tunchSum4 border-end d-flex justify-content-end pe-2">
                                        {e?.tunch}
                                    </div>
                                    <div className="pureWtSum4 border-end d-flex justify-content-end pe-2">
                                        {e?.pureWt}
                                    </div>
                                    <div className="goldPriceSum4 border-end d-flex justify-content-end pe-2">
                                        {(billPrintJson?.MetalRate24K).toFixed(2)}
                                    </div>
                                    <div className="goldAmtSum4 d-flex justify-content-end pe-2">
                                        {(e?.MetalAmount).toFixed(3)}
                                    </div>
                                </div>
                            })}
                            <div className="d-flex border height34Sum4 bg_total_sum4 ">
                                <div className="metalTypeSum4 border-end d-flex align-items-center justify-content-end pe-2 fw-bold">
                                    Total
                                </div>
                                <div className="GwtSum4 border-end d-flex align-items-center justify-content-end pe-2 fw-bold">
                                    {(metaltypeSum?.grosswt).toFixed(3)}
                                </div>
                                <div className="netWtSum4 border-end d-flex align-items-center justify-content-end pe-2 fw-bold">
                                    {(metaltypeSum?.NetWt).toFixed(3)}
                                </div>
                                <div className="tunchSum4 border-end d-flex align-items-center justify-content-end pe-2 fw-bold">
                                </div>
                                <div className="pureWtSum4 border-end d-flex align-items-center justify-content-end pe-2 fw-bold">
                                    {(metaltypeSum?.pureWt).toFixed(3)}
                                </div>
                                <div className="goldPriceSum4 border-end d-flex align-items-center justify-content-end pe-2 fw-bold">
                                </div>
                                <div className="goldAmtSum4 d-flex align-items-center justify-content-end pe-2 fw-bold">
                                    {(metaltypeSum?.MetalAmount).toFixed(3)}
                                </div>
                            </div>
                        </div>
                        <div className="d-flex mt-4 justify-content-between no_break">
                            <div className="diamondTypeSum4">
                                <div className="d-flex height34Sum4 border">
                                    <div className="DiamondTypeSum4 d-flex justify-content-center align-items-center border-end fw-bold">Diamond Type</div>
                                    <div className="DiamondCtwSum4 d-flex justify-content-center align-items-center border-end fw-bold">Dia Ctw</div>
                                    <div className="DiamondPriceSum4 d-flex justify-content-center align-items-center border-end fw-bold">Diamond Price</div>
                                    <div className="DiamondDiscountSum4 d-flex justify-content-center align-items-center border-end fw-bold">Discount In %</div>
                                    <div className="DiamondAmountSum4 d-flex justify-content-center align-items-center fw-bold">Diamond Amount</div>
                                </div>
                                {lastDiamondTable.length > 0 && lastDiamondTable.map((e, i) => {
                                    return <div className="d-flex border" key={i}>
                                        <div className="DiamondTypeSum4 d-flex justify-content-center align-items-center border-end">{e?.name}</div>
                                        <div className="DiamondCtwSum4 d-flex justify-content-end pe-2 align-items-center border-end">{e?.totalWeight}</div>
                                        <div className="DiamondPriceSum4 d-flex justify-content-end pe-2 align-items-center border-end">{e?.rate}</div>
                                        <div className="DiamondDiscountSum4 d-flex justify-content-end pe-2 align-items-center border-end">{e?.discount} %</div>
                                        <div className="DiamondAmountSum4 d-flex justify-content-end pe-2 align-items-center">{(e?.totalAmount)}</div>
                                    </div>
                                })}
                                <div className="d-flex height34Sum4 border bg_total_sum4">
                                    <div className="DiamondTypeSum4 d-flex justify-content-center align-items-center border-end fw-bold">Total</div>
                                    <div className="DiamondCtwSum4 d-flex justify-content-center align-items-center border-end fw-bold">{lastDiamondTableTotal?.diaCtw}</div>
                                    <div className="DiamondPriceSum4 d-flex justify-content-center align-items-center border-end fw-bold"></div>
                                    <div className="DiamondDiscountSum4 d-flex justify-content-center align-items-center border-end fw-bold"></div>
                                    <div className="DiamondAmountSum4 d-flex justify-content-center align-items-center fw-bold">{lastDiamondTableTotal?.diamondAmount}</div>
                                </div>
                            </div>
                            <div className="csTypeSum4 height34Sum4">
                                <div className="d-flex border height34Sum4 ">
                                    <div className="cstypeTextSum4 border-end fw-bold d-flex justify-content-center align-items-center">
                                        CS Type
                                    </div>
                                    <div className="cstypeTextSum4 border-end fw-bold d-flex justify-content-center align-items-center">
                                        CS Ctw
                                    </div>
                                    <div className="cstypeTextSum4 border-end fw-bold d-flex justify-content-center align-items-center">
                                        CS Price
                                    </div>
                                    <div className="cstypeTextSum4 fw-bold d-flex justify-content-center align-items-center">
                                        CS Amount
                                    </div>
                                </div>
                                {lastColorStoneTable.length > 0 && lastColorStoneTable.map((e, i) => {
                                    return <div className="d-flex border" key={i}>
                                        <div className="cstypeTextSum4 border-end d-flex justify-content-center">
                                            {e?.name}
                                        </div>
                                        <div className="cstypeTextSum4 border-end d-flex justify-content-end pe-2">
                                            {e?.totalWeight}
                                        </div>
                                        <div className="cstypeTextSum4 border-end d-flex justify-content-end pe-2">
                                            {e?.rate}
                                        </div>
                                        <div className="cstypeTextSum4 d-flex justify-content-end pe-2">
                                            {e?.totalAmount}
                                        </div>
                                    </div>
                                })}
                                <div className="d-flex border bg_total_sum4 height34Sum4">
                                    <div className="cstypeTextSum4 border-end d-flex justify-content-center fw-bold align-items-center">

                                    </div>
                                    <div className="cstypeTextSum4 border-end d-flex justify-content-end pe-2 fw-bold align-items-center">
                                        {lastColorStoneTableTotal?.clrCtw}
                                    </div>
                                    <div className="cstypeTextSum4 border-end d-flex justify-content-end pe-2 fw-bold align-items-center">

                                    </div>
                                    <div className="cstypeTextSum4 d-flex justify-content-end pe-2 fw-bold align-items-center">
                                        {lastColorStoneTableTotal?.colorStoneAmount}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>}
                </div>
            </div>
        </div>
    </div></>}

    </>
    )
}

export default Summary12