import React, { useEffect, useState } from 'react'
import { CapitalizeWords, NumberWithCommas, apiCall, fixedValues, handleImageError, handlePrint, isObjectEmpty, taxGenrator } from '../../GlobalFunctions';
import "../../assets/css/prints/retailPrint.css";
import Loader from '../../components/Loader';
import { ToWords } from 'to-words';

const RetailPrint = ({ urls, token, invoiceNo, printName, evn }) => {
    const [jsonData1, setJsonData1] = useState({});
    const [dataFill, setDataFill] = useState([]);
    const [total, setTotal] = useState({});
    const [rate, setRate] = useState(true);
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [taxes, setTaxes] = useState([]);
    let pName = atob(printName).toLowerCase();

    const getStyles = (retailPrint1, retailPrint, value) => {
        return pName === 'retail1 print' ?
            (value ? retailPrint1 : `${retailPrint1}NoRate`) :
            (value ? retailPrint : `${retailPrint}NoRate`);
    }

    const [styles, setStyles] = useState({
        Material: getStyles("materialRetailPrint1", "materialRetailPrint", true),
        Qty: getStyles("qtyRetailPrint1", "qtyRetailPrint", true),
        Pcs: getStyles("pcsRetailPrint1", "pcsRetailPrint", true),
        Wt: getStyles("wtRetailPrint1", "wtRetailPrint", true),
        Amount: getStyles("", "amountRetailPrint", true),
    });



    const toWords = new ToWords();

    const loadData = (data) => {
        setJsonData1(data?.BillPrint_Json[0]);
        let resultArr = [];
        let totalObj = {
            pcs: 0,
            materialWeight: 0,
            rate: 0,
            amount: 0,
            making: 0,
            others: 0,
            totalAmount: 0,
            sgstAmount: 0,
            cgstAmount: 0,
            addLess: 0,
            grandTotal: 0,
            textInNumbers: "",
            goldWeight: 0
        }
        data?.BillPrint_Json1.forEach((e, i) => {
            let materialArray = [];
            data?.BillPrint_Json2.forEach((ele, ind) => {
                if (ele?.MasterManagement_DiamondStoneTypeid !== 5) {
                    if (ele?.StockBarcode === e?.SrJobno) {
                        materialArray.push(ele);
                        if (ele?.MasterManagement_DiamondStoneTypeid !== 4) {
                            totalObj.pcs += ele?.Pcs;
                            if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
                                totalObj.materialWeight += ele?.Wt;
                            }
                        } else {
                            totalObj.goldWeight += ele?.Wt;
                        }

                        totalObj.rate += ele?.Rate;
                        totalObj.amount += ele?.Amount;
                    }
                }
            });
            totalObj.addLess = data.BillPrint_Json[0].AddLess;
            totalObj.amount = +((totalObj.amount).toFixed(2));
            totalObj.totalAmount += (e?.TotalAmount);
            totalObj.making += e?.MakingAmount;
            totalObj.others += e?.OtherCharges;
            totalObj.sgstAmount = +(((data?.BillPrint_Json[0]?.SGST) * (e?.TotalAmount) / 100).toFixed(2));
            totalObj.cgstAmount = +(((data?.BillPrint_Json[0]?.CGST) * (e?.TotalAmount) / 100).toFixed(2));
            // totalObj.grandTotal = +((totalObj.totalAmount + totalObj.sgstAmount + totalObj.cgstAmount + totalObj.addLess).toFixed(2));
            let obj = { ...e };
            obj.materials = materialArray;
            resultArr.push(obj);
        });
        let blankArr = [];
        resultArr.forEach((e, i) => {
            if (e?.GroupJob !== "") {
                let findIndex = blankArr.findIndex((ele, ind) => ele?.MetalTypePurity === e?.MetalTypePurity && ele?.GroupJob !== "");
                if (findIndex === -1) {
                    let materials = [];
                    e?.materials.forEach((ele, ind) => {
                        let findIndex = materials.findIndex(elem => elem?.MasterManagement_DiamondStoneTypeid !== 4 && elem?.QualityName === ele?.QualityName && elem?.MasterManagement_DiamondStoneTypeid === ele?.MasterManagement_DiamondStoneTypeid);
                        if (findIndex === -1) {
                            materials.push(ele);
                        } else {
                            materials[findIndex].Pcs += ele?.Pcs;
                            materials[findIndex].Wt += ele?.Wt;
                            materials[findIndex].Rate += ele?.Rate;
                            materials[findIndex].Amount += ele?.Amount;
                        }
                    });
                    let obj = { ...e }
                    obj.materials = materials;
                    blankArr.push(obj);
                } else {
                    blankArr[findIndex].MakingAmount += e?.MakingAmount;
                    blankArr[findIndex].OtherCharges += e?.OtherCharges;
                    blankArr[findIndex].TotalAmount += e?.TotalAmount;

                    blankArr[findIndex].grosswt += e?.grosswt;

                    if (!blankArr[findIndex].SrJobno === blankArr[findIndex].GroupJob) {
                        blankArr[findIndex].DesignImage = e?.DesignImage;
                        blankArr[findIndex].SubCategoryname = e?.SubCategoryname;
                        blankArr[findIndex].Categoryname = e?.Categoryname;
                        blankArr[findIndex].designno = e?.designno;
                        blankArr[findIndex].SrJobno = e?.SrJobno;
                        blankArr[findIndex].Tunch = e?.Tunch;
                        blankArr[findIndex].HUID = e?.HUID;
                        let materials = [];
                        blankArr[findIndex].materials.forEach((ele, ind) => {
                            let findIndex = materials.findIndex(elem => ele?.MasterManagement_DiamondStoneTypeid !== 4 && elem?.QualityName === ele?.QualityName && elem?.MasterManagement_DiamondStoneTypeid === ele?.MasterManagement_DiamondStoneTypeid);
                            if (findIndex === -1) {
                                if (ele?.MasterManagement_DiamondStoneTypeid !== 4) {
                                    materials.push(ele);
                                }
                            } else {
                                materials[findIndex].Pcs += ele?.Pcs;
                                materials[findIndex].Wt += ele?.Wt;
                                materials[findIndex].Rate += ele?.Rate;
                                materials[findIndex].Amount += ele?.Amount;
                            }
                        });
                        e?.materials.forEach((ele, ind) => {
                            let findIndex = materials.findIndex(elem => ele?.MasterManagement_DiamondStoneTypeid !== 4 && elem?.QualityName === ele?.QualityName && elem?.MasterManagement_DiamondStoneTypeid === ele?.MasterManagement_DiamondStoneTypeid);
                            if (findIndex === -1) {
                                materials.push(ele);
                            } else {
                                materials[findIndex].Pcs += ele?.Pcs;
                                materials[findIndex].Wt += ele?.Wt;
                                materials[findIndex].Rate += ele?.Rate;
                                materials[findIndex].Amount += ele?.Amount;
                            }
                        });
                        blankArr[findIndex].materials = materials;
                    } else {
                        let materials = [];
                        blankArr[findIndex].materials.forEach((ele, ind) => {
                            let findIndex = materials.findIndex(elem => ele?.MasterManagement_DiamondStoneTypeid !== 4 && elem?.QualityName === ele?.QualityName && elem?.MasterManagement_DiamondStoneTypeid === ele?.MasterManagement_DiamondStoneTypeid);
                            if (findIndex === -1) {
                                materials.push(ele);
                            } else {
                                materials[findIndex].Pcs += ele?.Pcs;
                                materials[findIndex].Wt += ele?.Wt;
                                materials[findIndex].Rate += ele?.Rate;
                                materials[findIndex].Amount += ele?.Amount;
                            }
                        });
                        e?.materials.forEach((ele, ind) => {
                            let findIndex = materials.findIndex(elem => ele?.MasterManagement_DiamondStoneTypeid !== 4 && elem?.QualityName === ele?.QualityName && elem?.MasterManagement_DiamondStoneTypeid === ele?.MasterManagement_DiamondStoneTypeid);
                            if (findIndex === -1) {
                                if (ele?.MasterManagement_DiamondStoneTypeid !== 4) {
                                    materials.push(ele);
                                }
                            } else {
                                materials[findIndex].Pcs += ele?.Pcs;
                                materials[findIndex].Wt += ele?.Wt;
                                materials[findIndex].Rate += ele?.Rate;
                                materials[findIndex].Amount += ele?.Amount;
                            }
                        });
                        blankArr[findIndex].materials = materials;
                    }
                }

            } else {
                let materials = [];
                e?.materials.forEach((ele, ind) => {
                    let findIndex = materials.findIndex(elem => ele?.MasterManagement_DiamondStoneTypeid !== 4 && elem?.QualityName === ele?.QualityName && ele?.MasterManagement_DiamondStoneTypeid === elem?.MasterManagement_DiamondStoneTypeid);
                    if (findIndex === -1) {
                        materials.push(ele);
                    } else {
                        materials[findIndex].Pcs += ele?.Pcs;
                        materials[findIndex].Wt += ele?.Wt;
                        materials[findIndex].Rate += ele?.Rate;
                        materials[findIndex].Amount += ele?.Amount;
                    }
                });
                let obj = { ...e }
                obj.materials = materials;
                blankArr.push(obj);
            }
        });
        // tax
        let taxValue = taxGenrator(data?.BillPrint_Json[0], totalObj.totalAmount);
        setTaxes(taxValue);
        taxValue.forEach((e, i) => {
            totalObj.grandTotal += +(e?.amount);
        });
        totalObj.grandTotal += totalObj.totalAmount + totalObj.addLess;
        totalObj.totalAmount = (totalObj.totalAmount).toFixed(2);
        totalObj.textInNumbers = toWords.convert(totalObj.grandTotal);
        setTotal(totalObj);
        // setDataFill(resultArr);
        setDataFill(blankArr);
    }

    const handleChange = (e) => {
        rate ? setRate(false) : setRate(true);
        let value = rate ? false : true;
        setStyles({
            ...styles,
            Material: getStyles("materialRetailPrint1", "materialRetailPrint", value),
            Qty: getStyles("qtyRetailPrint1", "qtyRetailPrint", value),
            Pcs: getStyles("pcsRetailPrint1", "pcsRetailPrint", value),
            Wt: getStyles("wtRetailPrint1", "wtRetailPrint", value),
            Amount: getStyles("", "amountRetailPrint", value),
        })
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
            {loader ? <Loader /> : msg === "" ? <div className='container containerRetailPrint mt-5 pad_60_allPrint'>
                {/* print button */}
                <div className="d-flex w-100 justify-content-end align-items-baseline print_sec_sum4 no_break position-relative">
                    <div className="form-check pe-3 mb-0">
                        <input className="form-check-input border-dark" type="checkbox" checked={rate} onChange={e => handleChange(e)} />
                        <label className="form-check-label h6 mb-0 fs-5">
                            With Rate
                        </label>
                    </div>
                    <div className="printBtn_sec text-end position-absolute printBtnRetailPrint">
                        <input type="button" className="btn_white blue me-0" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* headline retail print */}
                <div className="px-1 no_break">
                    <div className='headlinepRetailPrint w-100 mt-4 py-1 px-2 fw-bold'>
                        {jsonData1?.PrintHeadLabel}
                    </div>
                </div>
                {/* company address */}
                <div className="mt-2 px-1 d-flex no_break">
                    <div className="col-6">
                        <h5 className='fw-bold'>{jsonData1?.CompanyFullName}</h5>
                        <p>{jsonData1?.CompanyAddress}</p>
                        <p>{jsonData1?.CompanyAddress2}</p>
                        <p>{jsonData1?.CompanyCity} {jsonData1?.CompanyPinCode} {jsonData1?.CompanyState} {jsonData1?.CompanyCountry}</p>
                        <p>T {jsonData1?.CompanyTellNo} | TOLL FREE {jsonData1?.CompanyTollFreeNo}</p>
                        <p>{jsonData1?.CompanyEmail} | {jsonData1?.CompanyWebsite}</p>
                        <p>{jsonData1?.Company_VAT_GST_No} | {jsonData1?.Cust_CST_STATE} - {jsonData1?.Company_CST_STATE_No} | PAN-{jsonData1?.Pannumber}</p>
                    </div>
                    <div className="col-6">
                        <img src={jsonData1?.PrintLogo} alt="" className='retailPrintLogo d-block ms-auto' />
                    </div>
                </div>
                {/* bill to */}
                <div className="d-flex border mt-2 no_break">
                    <div className="col-4 p-1 border-end">
                        <p className='line_height_110'>{jsonData1?.lblBillTo} </p>
                        <p className='fw-bold line_height_110'>{jsonData1?.customerfirmname}</p>
                        <p className='line_height_110'>{jsonData1?.customerAddress1}</p>
                        <p className='line_height_110'>{jsonData1?.customerAddress2}</p>
                        <p className='line_height_110'>{jsonData1?.customercity}{jsonData1?.customerpincode}</p>
                        <p className='line_height_110'>{jsonData1?.customeremail1}</p>
                        <p className='line_height_110'>{jsonData1?.vat_cst_pan}</p>
                        <p className='line_height_110'>{jsonData1?.Cust_CST_STATE} {jsonData1?.Cust_CST_STATE_No}</p>
                    </div>
                    <div className="col-4 p-1 border-end">
                        <p className='line_height_110'>Ship To, </p>
                        <p className='fw-bold'>{jsonData1?.customerfirmname}</p>
                        <p className='line_height_110'>{jsonData1?.CustName}</p>

                        {/* <p className=''>{jsonData1?.customerAddress2}</p> */}
                        <p className='line_height_110'>{jsonData1?.customercity}, {jsonData1?.State}</p>
                        <p className='line_height_110'>{jsonData1?.CompanyCountry}{jsonData1?.customerpincode}</p>
                        <p className='line_height_110'>Mobile No. : {jsonData1?.customermobileno1}</p>
                    </div>
                    <div className="col-4 p-1 position-relative">
                        <div className="d-flex">
                            <div className="col-3">
                                <p className='fw-bold'>BILL NO</p>
                                <p className='fw-bold'>DATE</p>
                                <p className='fw-bold'>HSN</p>
                            </div>
                            <div className="col-9">
                                <p>{jsonData1?.InvoiceNo}</p>
                                <p>{jsonData1?.EntryDate}</p>
                                <p>{jsonData1?.HSN_No}</p>
                            </div>
                        </div>
                        <p className='mt-5 position-absolute bottom-0 pb-1 ratePara'>{rate && (jsonData1?.MetalRate24K && (jsonData1?.MetalRate24K).toFixed(2))}</p>
                    </div>
                </div>
                {/* table */}
                <div className="d-flex mt-1 border no_break">
                    <div className="srNoRetailPrint border-end d-flex justify-content-center align-items-center">
                        <p className='fw-bold'>Sr#</p>
                    </div>
                    <div className="poductDiscriptionRetailPrint border-end d-flex justify-content-center align-items-center">
                        <p className='fw-bold'>Product Description</p>
                    </div>
                    <div className="materialDescriptionRetailPrint border-end">
                        <div className="border-bottom p-1 d-flex justify-content-center align-items-center">
                            <p className='fw-bold'>Material Description</p>
                        </div>
                        <div className="d-flex">
                            <div className={`${styles.Material} border-end d-flex justify-content-center align-items-center`}>
                                <p className='fw-bold'>Material</p>
                            </div>
                            <div className={`${styles.Qty} border-end d-flex justify-content-center align-items-center`}>
                                <p className='fw-bold'>Qty</p>
                            </div>
                            <div className={`${styles.Pcs} border-end d-flex justify-content-center align-items-center`}>
                                <p className='fw-bold'>Pcs</p>
                            </div>
                            <div className={`${styles.Wt} border-end d-flex justify-content-center align-items-center`}>
                                <p className='fw-bold'>Wt.</p>
                            </div>
                            {rate && <div className={`${pName === 'retail1 print' ? `rateRetailPrint1` : `rateRetailPrint border-end`} d-flex justify-content-center align-items-center`}>
                                <p className='fw-bold'>Rate</p>
                            </div>}
                            {pName !== 'retail1 print' && <div className={`${styles.Amount} d-flex justify-content-center align-items-center`}>
                                <p className='fw-bold'>Amount</p>
                            </div>}
                        </div>
                    </div>
                    <div className="makingRetailPrint border-end d-flex justify-content-center align-items-center">
                        <p className='fw-bold'>Making</p>
                    </div>
                    <div className="othersRetailPrint border-end d-flex justify-content-center align-items-center">
                        <p className='fw-bold'>Others</p>
                    </div>
                    <div className="totalRetailPrint d-flex justify-content-center align-items-center">
                        <p className='fw-bold'>Total</p>
                    </div>
                </div>
                {/* data */}
                {dataFill.map((e, i) => {
                    return <div className="d-flex border-bottom border-start border-end no_break" key={i}>
                        <div className="srNoRetailPrint border-end p-1 d-flex justify-content-center align-items-center">
                            <p className='fw-bold'>{e?.SrNo}</p>
                        </div>
                        <div className="poductDiscriptionRetailPrint border-end p-1">
                            <p>{e?.SubCategoryname} {e?.Categoryname} </p>
                            <p>{e?.designno} | {e?.SrJobno}</p>
                            <img src={e?.DesignImage} alt="" className='w-100 product_image_retailPrint' onError={handleImageError} />
                            <p className='text-center fw-bold pt-1'>Tunch: {NumberWithCommas(e?.Tunch, 3)}</p>
                            {e?.HUID !== "" && <p className='text-center pt-1'>HUID- {e?.HUID}</p>}
                            <p className='text-center fw-bold pt-1'>{fixedValues(e?.grosswt, 3)}gm <span className='fw-normal'>Gross</span></p>
                        </div>
                        <div className="materialDescriptionRetailPrint border-end">
                            <div className="d-grid h-100">
                                {e?.materials.length > 0 && e?.materials.map((ele, ind) => {
                                    return <div className={`d-flex ${ind !== e?.materials.length - 1 && `border-bottom`}`} key={ind}>
                                        <div className={`${styles.Material} border-end p-1 d-flex align-items-center`}>
                                            <p>{ele?.MasterManagement_DiamondStoneTypeid === 4 ? ele?.ShapeName : ele?.MasterManagement_DiamondStoneTypeName}</p>
                                        </div>
                                        <div className={`${styles.Qty} border-end p-1 d-flex align-items-center`}>
                                            <p>{ele?.MasterManagement_DiamondStoneTypeid === 3 ? ele?.ShapeName : ele?.QualityName}</p>
                                        </div>
                                        <div className={`${styles.Pcs} border-end p-1 d-flex align-items-center justify-content-end`}>
                                            <p className='text-end'>{ele?.MasterManagement_DiamondStoneTypeid !== 4 && NumberWithCommas(ele?.Pcs, 0)}</p>
                                        </div>
                                        <div className={`${styles.Wt} border-end p-1 d-flex align-items-center justify-content-end`}>
                                            <p className='text-end'>{fixedValues(ele?.Wt, 3)}</p>
                                        </div>
                                        {rate && <div className={`${pName === 'retail1 print' ? `rateRetailPrint1` : `rateRetailPrint border-end`} p-1 d-flex align-items-center justify-content-end`}>
                                            <p className='text-end'>{NumberWithCommas(ele?.Rate, 2)}</p>
                                        </div>}
                                        {pName !== 'retail1 print' && <div className={`${styles.Amount} p-1 d-flex align-items-center justify-content-end`}>
                                            <p className='text-end'>{NumberWithCommas(ele?.Amount, 2)}</p>
                                        </div>}
                                    </div>
                                })}
                            </div>
                        </div>
                        <div className={`makingRetailPrint border-end p-1 d-flex ${pName === "retail print 1" ? `flex-column align-items-end justify-content-center` : `align-items-center justify-content-end `}`}>
                            {pName === "retail print 1" && <p className='text-end'><span className="fw-bold">R: </span>{NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p>}
                            <p className='text-end'>{NumberWithCommas(e?.MakingAmount, 2)}</p>

                        </div>
                        <div className="othersRetailPrint border-end p-1 d-flex align-items-center justify-content-end">
                            <p className='text-end'>{NumberWithCommas(e?.OtherCharges, 2)}</p>
                        </div>
                        <div className="totalRetailPrint p-1 d-flex align-items-center justify-content-end">
                            <p className='text-end'>{NumberWithCommas(e?.TotalAmount, 2)}</p>
                        </div>
                    </div>
                })}
                {/* total */}
                <div className="d-flex border-bottom border-start border-end no_break">
                    <div className="srNoRetailPrint border-end p-1 d-flex justify-content-center align-items-center">
                    </div>
                    <div className="poductDiscriptionRetailPrint border-end p-1 d-flex align-items-center">
                        <p className="fw-bold">TOTAL</p>
                    </div>
                    <div className="materialDescriptionRetailPrint border-end">
                        <div className="d-flex">
                            <div className={`${styles.Material} border-end p-1 min_height_44_retail_print_1`}>
                                <p className='fw-bold'></p>
                            </div>
                            <div className={`${styles.Qty} border-end p-1 min_height_44_retail_print_1`}>
                                <p className='fw-bold'></p>
                            </div>
                            <div className={`${styles.Pcs} border-end p-1 text-end d-flex align-items-center justify-content-end min_height_44_retail_print_1`}>
                                <p className='fw-bold text-end'>{NumberWithCommas(total?.pcs, 0)}</p>
                            </div>
                            <div className={`${styles.Wt} border-end p-1 d-flex align-items-end justify-content-center flex-column min_height_44_retail_print_1`}>
                                <p className='fw-bold lh-1 text-end'>{fixedValues(total?.materialWeight, 3)} Ctw</p>
                                <p className='fw-bold lh-1 text-end'>{fixedValues(total?.goldWeight, 3)} gm</p>
                            </div>
                            {rate && <div className={`${pName === 'retail1 print' ? `rateRetailPrint1` : `rateRetailPrint border-end`} p-1 d-flex align-items-center justify-content-end min_height_44_retail_print_1`}>
                                <p className='fw-bold text-end'>
                                    {/* {NumberWithCommas(total?.rate, 2)} */}
                                </p>
                            </div>}
                            {pName !== 'retail1 print' && <div className={`${styles.Amount} p-1 d-flex align-items-center justify-content-end min_height_44_retail_print_1`}>
                                <p className='fw-bold text-end'>
                                    {/* {NumberWithCommas(total?.amount, 2)} */}
                                </p>
                            </div>}
                        </div>
                    </div>
                    <div className="makingRetailPrint border-end p-1 d-flex align-items-center justify-content-end">
                        <p className='fw-bold text-end'>{NumberWithCommas(total?.making, 2)}</p>
                    </div>
                    <div className="othersRetailPrint border-end p-1 d-flex align-items-center justify-content-end">
                        <p className='fw-bold text-end'>{NumberWithCommas(total?.others, 2)}</p>
                    </div>
                    <div className="totalRetailPrint p-1 d-flex align-items-center justify-content-end">
                        <p className='fw-bold text-end'>{NumberWithCommas(total?.totalAmount, 2)}</p>
                    </div>
                </div>
                {/* grand total */}
                <div className="d-flex border-start border-end border-bottom no_break">
                    {/* <div className="totalInWordsRetailPrint p-1 d-flex flex-column align-items-start justify-content-end p-1 border-end"> */}
                    <div className="col-8 p-1 d-flex flex-column align-items-start justify-content-end p-1 border-end">
                        <p>In Words Indian Rupees</p>
                        <p className='fw-bold'>{total?.textInNumbers} Only</p>
                    </div>
                    {/* <div className="cgstRetailPrint p-1 text-end p-1 border-end"> */}
                    <div className="col-2 p-1 text-end p-1 border-end">
                        {taxes.length > 0 && taxes.map((e, i) => {
                            return <p key={i} className='pb-1'>{e?.name} @ {e?.per}</p>
                        })}
                        <p>Add</p>
                        <p className='fw-bold py-2 border-top'>GRAND TOTAL</p>
                    </div>
                    {/* <div className="totalRetailPrint p-1 text-end p-1"> */}
                    <div className="col-2  p-1 text-end p-1">
                        {taxes.length > 0 && taxes.map((e, i) => {
                            return <p key={i} className='pb-1'>{NumberWithCommas(+e?.amount, 2)}</p>
                        })}
                        <p>{total?.addLess}</p>
                        <p className='fw-bold py-2 border-top '>₹{NumberWithCommas(total?.grandTotal, 2)}</p>
                    </div>
                </div>
                {/* note */}
                <div className="note border mt-1 p-1 pb-3 no_break">
                    <div dangerouslySetInnerHTML={{ __html: jsonData1?.Declaration }} className='pt-2'></div>
                </div>
                {/* bank detail */}
                <div className="d-flex mt-1 border no_break">
                    <div className="col-4 p-2 border-end">
                        <p className='fw-bold'>Bank Detail</p>
                        <p>Bank Name: {jsonData1?.bankname}</p>
                        <p>Branch: {jsonData1?.bankaddress}</p>
                        <p>{jsonData1?.customercity1}-{jsonData1?.PinCode}</p>
                        <p>Account Name: {jsonData1?.accountname}</p>
                        <p>Account No. : {jsonData1?.accountnumber}</p>
                        <p>RTGS/NEFT IFSC: {jsonData1?.rtgs_neft_ifsc}</p>
                    </div>
                    <div className="col-4 border-end d-flex flex-column justify-content-between p-2">
                        <p>Signature</p>
                        <p className='fw-bold'>{jsonData1?.customerfirmname}</p>
                    </div>
                    <div className="col-4 d-flex flex-column justify-content-between p-2">
                        <p>Signature</p>
                        <p className='fw-bold'>{jsonData1?.CompanyFullName}</p>
                    </div>
                </div>
            </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
        </>
    )
}

export default RetailPrint
