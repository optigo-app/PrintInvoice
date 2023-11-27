import React, { useEffect, useState } from 'react';
import "../../assets/css/prints/estimatePrint.css";
import { NumberWithCommas, ReceiveInBank, apiCall, fixedValues, handleImageError, handlePrint, isObjectEmpty, otherAmountDetail, taxGenrator } from '../../GlobalFunctions';
import Loader2 from '../../components/Loader2';
import Loader from '../../components/Loader';

const EstimatePrint = ({ urls, token, invoiceNo, printName, evn }) => {
    const [image, setImage] = useState(false);
    const [json1Data, setJson1Data] = useState({});
    const [json2Data, setJson2Data] = useState([]);
    const [imageLoading, setImageLoading] = useState(true);
    const [msg, setMsg] = useState("");
    const [diamondDetailss, setDiamondDetailss] = useState({});
    // const [changePrint, setChangeprint] = useState(atob(printName).toLowerCase() === "estimate print change" ? true : false);
    const [total, setTotal] = useState({
        totalamount: 0,
        cgstAmount: 0,
        sgstAmount: 0,
        finalAmount: 0,
        weightWithDiamondLoss: 0,
        finalDiamondTotal: {
            pcs: 0,
            weight: 0,
            rate: 0,
            amount: 0
        },
        finalMetalsTotal: {
            pcs: 0,
            weight: 0,
            rate: 0,
            amount: 0
        },
        finalColorStonesTotal: {
            pcs: 0,
            weight: 0,
            rate: 0,
            amount: 0
        },
        finalmiscsTotal: {
            pcs: 0,
            weight: 0,
            rate: 0,
            amount: 0
        },
        otherAmount: 0,
        gold24Kt: 0,
        grosswt: 0,
        gdWt: 0,
        NetWt: 0,
        diaWt: 0,
        diaPcs: 0,
        stoneWt: 0,
        stonePcs: 0,
        miscWt: 0,
        miscPcs: 0,
        goldAmount: 0,
        diamondAmount: 0,
        colorStoneAmount: 0,
        miscAmount: 0,
        makingAmount: 0,
        summaryTotalAmount: 0,
        labourAmount: 0,
    });
    const [taxes, setTaxes] = useState([]);
    const [diamondDetail, setDiamondDetail] = useState([]);
    const [loader, setLoader] = useState(true);
    const [brokrage, setBrokrage] = useState(false);
    const [brokarage, setBrokarage] = useState([]);

    const handleChange = (e) => {
        const { name } = e?.target;
        if (name === "image") {
            image ? setImage(false) : setImage(true);
        } else if (name === "brokrage") {
            brokrage ? setBrokrage(false) : setBrokrage(true);
        }
    }

    const caiculateMaterial = (data) => {
        let resultArr = [];
        let totals = { ...total };
        let diamondDetailList = [];
        let diamondDetailList2 = [{ shapeQualityColor: "others", pcs: 0, wt: 0 }];
        let diamondDetails = {
            pcs: 0,
            wt: 0
        };
        data?.BillPrint_Json1.forEach((e, i) => {
            let settingAmount = 0;
            let totalSetttingAmount = 0;
            totalSetttingAmount += e?.MakingAmount;
           
            let settingRate = 0;
            let obj = { ...e };
            obj.OtherCharges = obj?.OtherCharges + obj?.TotalDiamondHandling;
            totals.otherAmount += obj?.OtherCharges;

            let diamonds = [];
            let metals = [];
            let colorStones = [];
            let mics = [];
            let otherAmountDetails = otherAmountDetail(e?.OtherAmtDetail);
            let diamondTotal = {
                pcs: 0,
                weight: 0,
                rate: 0,
                amount: 0
            }
            let metalsTotal = {
                pcs: 0,
                weight: 0,
                rate: 0,
                amount: 0,
                weightWithDiamondLoss: 0,
            }
            let colorStonesTotal = {
                pcs: 0,
                weight: 0,
                rate: 0,
                amount: 0
            }
            let miscsTotal = {
                pcs: 0,
                weight: 0,
                rate: 0,
                amount: 0
            }
            totals.gold24Kt += e?.convertednetwt;
            data?.BillPrint_Json2.forEach((ele, ind) => {
                if (e?.SrJobno === ele?.StockBarcode) {
                    if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                        if (ele?.ShapeName === "GOLD") {
                            if (ele?.QualityName === '24K') {
                                // totals.gold24Kt += ele?.Wt;
                            }
                            totals.goldAmount += ele?.Amount;
                        }
                        ele.Weight = e?.NetWt + (e?.DiamondCTWwithLoss / 5);
                        metalsTotal.weightWithDiamondLoss = ele.Weight;
                        totals.weightWithDiamondLoss += ele.Weight;
                        metals.push(ele);
                    }
                    if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
                        colorStones.push(ele);
                        totals.stoneWt += ele?.Wt;
                        totals.stonePcs += ele?.Pcs;
                        totals.colorStoneAmount += ele?.Amount;
                    }
                    if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
                        diamondDetails.pcs += ele?.Pcs;
                        diamondDetails.wt += ele?.Wt;
                        diamonds.push(ele);
                        totals.diaWt += ele?.Wt;
                        totals.diaPcs += ele?.Pcs;
                        totals.diamondAmount += ele?.Amount;
                        if (diamondDetailList.length > 0) {
                            let findRecord = diamondDetailList.findIndex((el, indd) => {
                                return el.data.ShapeName === ele.ShapeName && el.data.QualityName === ele.QualityName && el.data.Colorname === ele.Colorname
                            });
                            if (findRecord !== -1) {
                                diamondDetailList[findRecord].pcs += ele?.Pcs;
                                diamondDetailList[findRecord].wt += ele?.Wt;
                            } else {
                                diamondDetailList.push({ data: ele, pcs: ele?.Pcs, wt: ele?.Wt, shapeQualityColor: ele?.ShapeName + " " + ele?.QualityName + " " + ele?.Colorname });
                            }
                        } else {
                            diamondDetailList.push({ data: ele, pcs: ele?.Pcs, wt: ele?.Wt, shapeQualityColor: ele?.ShapeName + " " + ele?.QualityName + " " + ele?.Colorname });
                        }
                    }
                    if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
                        mics.push(ele);
                        totals.miscWt += ele?.Wt;
                        totals.miscPcs += ele?.Pcs;
                        totals.miscAmount += ele?.Amount;
                    }
                    settingAmount += ele?.SettingAmount;
                    totalSetttingAmount += ele?.SettingAmount;
                    settingRate += ele?.SettingRate;
                 
                }
            });
            totals.labourAmount += totalSetttingAmount;
            if (diamonds.length > 0) {
                diamonds.reduce((accumulator, currentObject) => {
                    accumulator.amount += currentObject.Amount;
                    accumulator.weight += currentObject.Wt;
                    accumulator.pcs += currentObject.Pcs;
                    accumulator.rate += currentObject.Rate;
                    totals.finalDiamondTotal.amount += currentObject.Amount;
                    totals.finalDiamondTotal.weight += currentObject.Wt;
                    totals.finalDiamondTotal.pcs += currentObject.Pcs;
                    totals.finalDiamondTotal.rate += currentObject.Rate;

                    // accumulator.size += +(currentObject.SizeName);
                    return accumulator;
                }, diamondTotal);
            }
            if (metals.length > 0) {
                metals.reduce((accumulator, currentObject) => {
                    accumulator.amount += currentObject.Amount;
                    accumulator.weight += currentObject.Wt;
                    accumulator.pcs += currentObject.Pcs;
                    accumulator.rate += currentObject.Rate;
                    totals.finalMetalsTotal.amount += currentObject.Amount;
                    totals.finalMetalsTotal.weight += currentObject.Wt;
                    totals.finalMetalsTotal.pcs += currentObject.Pcs;
                    totals.finalMetalsTotal.rate += currentObject.Rate;
                    return accumulator;
                }, metalsTotal);
            }
            if (colorStones.length > 0) {
                colorStones.reduce((accumulator, currentObject) => {
                    accumulator.amount += currentObject.Amount;
                    accumulator.weight += currentObject.Wt;
                    accumulator.pcs += currentObject.Pcs;
                    accumulator.rate += currentObject.Rate;
                    totals.finalColorStonesTotal.amount += currentObject.Amount;
                    totals.finalColorStonesTotal.weight += currentObject.Wt;
                    totals.finalColorStonesTotal.pcs += currentObject.Pcs;
                    totals.finalColorStonesTotal.rate += currentObject.Rate;
                    return accumulator;
                }, colorStonesTotal);
            }
            if (mics.length > 0) {
                mics.reduce((accumulator, currentObject) => {
                    accumulator.amount += currentObject.Amount;
                    accumulator.weight += currentObject.Wt;
                    accumulator.pcs += currentObject.Pcs;
                    accumulator.rate += currentObject.Rate;
                    totals.finalmiscsTotal.amount += currentObject.Amount;
                    totals.finalmiscsTotal.weight += currentObject.Wt;
                    totals.finalmiscsTotal.pcs += currentObject.Pcs;
                    totals.finalmiscsTotal.rate += currentObject.Rate;
                    return accumulator;
                }, miscsTotal);
            }
            obj.otherAmountDetails = otherAmountDetails;
            obj.mics = mics;
            obj.diamonds = diamonds;
            obj.totalSetttingAmount = totalSetttingAmount;
            obj.metals = metals;
            obj.colorStones = colorStones;
            obj.diamondTotal = diamondTotal;
            obj.metalsTotal = metalsTotal;
            obj.colorStonesTotal = colorStonesTotal;
            obj.miscsTotal = miscsTotal;
            obj.settingAmount = settingAmount;
            obj.settingRate = settingRate;
            totals.totalamount += e?.TotalAmount;
            totals.grosswt += e?.grosswt;

            totals.gdWt += e?.MetalDiaWt;
            totals.NetWt += e?.NetWt;
            totals.makingAmount += e?.MakingAmount;

            resultArr.push(obj);
        });
        setDiamondDetailss(diamondDetails);
        totals.cgstAmount = data?.BillPrint_Json[0]?.CGST * totals.totalamount / 100;
        totals.sgstAmount = data?.BillPrint_Json[0]?.SGST * totals.totalamount / 100;
        // totals.finalAmount = totals.totalamount + totals.cgstAmount + totals.sgstAmount + data?.BillPrint_Json[0]?.AddLess;
        totals.summaryTotalAmount = (totals.goldAmount + totals.diamondAmount + totals.colorStoneAmount + totals.miscAmount +
            totals.makingAmount + totals.otherAmount + data?.BillPrint_Json[0].AddLess).toFixed(3);

        // taxes
        let taxValue = taxGenrator(data?.BillPrint_Json[0], totals?.totalamount);
        setTaxes(taxValue);
        taxValue.forEach((e, i) => {
            totals.finalAmount += +(e?.amount);
        });
        totals.finalAmount += totals.totalamount + data?.BillPrint_Json[0]?.AddLess;
        totals.finalAmount = (totals.finalAmount)?.toFixed(2);
        // taxes end

        totals.gold24Kt = (totals.gold24Kt).toFixed(3);
        // totals.grosswt = (totals.grosswt / 5).toFixed(3);
        // totals.gdWt = (totals.gdWt / 5).toFixed(3);
        totals.NetWt = (totals.NetWt / 5).toFixed(3);
        totals.diaWt = (totals.diaWt / 5).toFixed(3);
        totals.stoneWt = (totals.stoneWt / 5).toFixed(3);
        totals.miscWt = (totals.miscWt / 5).toFixed(3);
        totals.goldAmount = (totals.goldAmount).toFixed(3);
        totals.colorStoneAmount = (totals.colorStoneAmount).toFixed(3);
        totals.diamondAmount = (totals.diamondAmount).toFixed(3);
        totals.miscAmount = (totals.miscAmount).toFixed(3);
        totals.makingAmount = (totals.makingAmount).toFixed(3);
        totals.otherAmount = (totals.otherAmount).toFixed(3);
        diamondDetailList.forEach((e, i) => {
            if (i >= 7) {
                diamondDetailList2[diamondDetailList2.length - 1].pcs += +((e.pcs).toFixed(2));
                diamondDetailList2[diamondDetailList2.length - 1].wt += +((e.wt).toFixed(2));
            } else {
                diamondDetailList2.unshift({ shapeQualityColor: e.shapeQualityColor, pcs: +((e.pcs).toFixed(2)), wt: +((e.wt).toFixed(2)) });
            }
        });
        setDiamondDetail(diamondDetailList2);
        setTotal(totals);
        setJson2Data(resultArr);
        let brokarage = ReceiveInBank(data?.BillPrint_Json[0]?.Brokerage);
        setBrokarage(brokarage);
    }

    const loadData = (data) => {
        setJson1Data(data?.BillPrint_Json[0]);
        caiculateMaterial(data);
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


    const handleImageLoad = () => {
        setImageLoading(false);
    };

    return (<>
        {loader ? <Loader /> : msg === "" ? <div className='container containerEstimate pad_60_allPrint'>
            {/* print button */}
            <div className="d-flex justify-content-end align-items-center print_sec_sum4 pb-4 mt-5 w-100" >
                <div className="form-check pe-3 mb-0">
                    <input className="form-check-input border-dark" type="checkbox" checked={image} onChange={e => handleChange(e)} name='image' />
                    <label className="form-check-label h6 mb-0 pt-1">
                        With Image
                    </label>
                </div>
                <div className="form-check pe-3 mb-0">
                    <input className="form-check-input border-dark" type="checkbox" checked={brokrage} onChange={e => handleChange(e)} name='brokrage' />
                    <label className="form-check-label h6 mb-0 pt-1">
                        With Brokrage
                    </label>
                </div>
                <div className="form-check ps-3">
                    <input type="button" className="btn_white blue mt-0" value="Print" onClick={(e) => handlePrint(e)} />
                </div>
            </div>
            {/* print name */}
            <div className="border p-1 mt-5 border-2 min_height_label" >
                <p className='text-uppercase fw-bold'>{json1Data?.PrintHeadLabel}</p>
            </div>
            {/* customer detail */}
            <div className="py-2 d-flex justify-content-between px-1" >
                <div>
                    <p>To,</p>
                    <p className='text-uppercase fw-bold'>{json1Data?.CustName}</p>
                </div>
                <div>
                    <div className="d-flex justify-conetnt-between">
                        <p className='mainDetailEstimate text-end pe-3'>Invoice# : </p>
                        <p className='fw-bold'>{json1Data?.InvoiceNo}</p>
                    </div>
                    <div className="d-flex justify-conetnt-between">
                        <p className='mainDetailEstimate text-end pe-3'>Date : </p>
                        <p className='fw-bold'>{json1Data?.EntryDate}</p>
                    </div>
                    <div className="d-flex justify-conetnt-between">
                        <p className='mainDetailEstimate text-end pe-3'>HSN : </p>
                        <p className='fw-bold'>{json1Data?.HSN_No}</p>
                    </div>
                </div>
            </div>
            <div className="my-2 w-100" >
                {/* heading */}
                <div className="border-start border-top border-end d-flex border-bottom recordEstimatePrint overflow-hidden border-black">
                    <div className="srNoEstimatePrint border-end p-1 d-flex align-items-center justify-content-center">
                        <p className='fw-bold'>Sr</p>
                    </div>
                    <div className="designEstimatePrint border-end p-1 d-flex align-items-center justify-content-center">
                        <p className='fw-bold'>Design</p>
                    </div>
                    <div className="diamondEstimatePrint border-end">
                        <div className='p-1 text-center border-bottom'><p className='fw-bold'>Diamond</p></div>
                        <div className='d-flex h-100'>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center fw-bold'>Code</p></div>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center fw-bold'>Size</p></div>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center fw-bold'>Pcs</p></div>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center fw-bold'>Wt</p></div>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center fw-bold'>Rate</p></div>
                            <div className='width20EstimatePrint p-1'><p className='text-center fw-bold'>Amount</p></div>
                        </div>
                    </div>
                    <div className="metalEstimatePrint border-end">
                        <div className='p-1 text-center border-bottom'><p className='fw-bold'>Metal</p></div>
                        <div className='d-flex h-100'>
                            <div className='width_40_estimatePrint p-1 border-end'><p className='text-center fw-bold'>Quality</p></div>
                            <div className='width_40_estimatePrint p-1 border-end'><p className='text-center fw-bold'>*Wt</p></div>
                            <div className='width_40_estimatePrint p-1 border-end'><p className='text-center fw-bold'>Net Wt</p></div>
                            <div className='width_40_estimatePrint p-1 border-end'><p className='text-center fw-bold'>Rate</p></div>
                            <div className='width_40_estimatePrint p-1'><p className='text-center fw-bold'>Amount</p></div>
                        </div>
                    </div>
                    <div className="stoneEstimatePrint border-end">
                        <div className='p-1 text-center border-bottom'><p className='fw-bold'>Stone & Misc</p></div>
                        <div className='d-flex h-100'>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center fw-bold'>Code</p></div>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center fw-bold'>Size</p></div>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center fw-bold'>Pcs</p></div>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center fw-bold'>Wt</p></div>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center fw-bold'>Rate</p></div>
                            <div className='width20EstimatePrint p-1'><p className='text-center fw-bold'>Amount</p></div>
                        </div>
                    </div>
                    <div className="OtherAmountEstimatePrint border-end p-1 d-flex align-items-center justify-content-center flex-wrap">
                        <p className='text-center fw-bold'>Other </p>
                        <p className='text-center fw-bold'>Amount </p>
                    </div>
                    <div className="labourEstimatePrint border-end">
                        <div className='p-1 text-center border-bottom'><p className='fw-bold'>Labour</p></div>
                        <div className='d-flex h-100'>
                            <div className='col p-1 border-end text-center'><p className='fw-bold'>Rate</p></div>
                            <div className='col p-1 text-center'><p className='fw-bold'>Amount</p></div>
                        </div>
                    </div>
                    <div className="totalAmountEstimatePrint p-1 d-flex align-items-center justify-content-center flex-wrap">
                        <p className='text-center fw-bold'>Total </p>
                        <p className='text-center fw-bold'>Amount </p>
                    </div>
                </div>
                {/* data */}
                <div className='border-end border-start border-black'>
                    {json2Data.length > 0 && json2Data.map((e, i) => {
                        return <div className="d-flex border-bottom recordEstimatePrint overflow-hidden " key={i}>
                            <div className="srNoEstimatePrint border-end p_1Estimate">
                                <p>{e?.SrNo}</p>
                            </div>
                            <div className="designEstimatePrint border-end p_1Estimate">
                                <div className="d-flex justify-content-between">
                                    <div>{e?.designno}</div>
                                    <div className='text-end'>
                                        <p>{e?.SrJobno}</p>
                                        <p>Pure White</p>
                                    </div>
                                </div>
                                <div className='pb-2'>
                                    {image && <>{imageLoading && <Loader2 />}{<img src={e?.DesignImage} alt="" className='w-100 estimate_img' onError={handleImageError} onLoad={handleImageLoad} style={{ display: imageLoading ? 'none' : 'block' }} />}</>}
                                </div>
                                <div>
                                    {e?.HUID !== "" && <p className='fw-bold text-center'>HUID{e?.HUID}</p>}
                                    {e?.PO !== "" && <p className='fw-bold text-center'>PO:{e?.PO}</p>}
                                    <div className="d-flex justify-content-between">
                                    </div>
                                    <p className='text-center'>Tunch : <span className="fw-bold">{NumberWithCommas(e?.Tunch, 3)}</span> </p>
                                    <p className='text-center'><span className='fw-bold'>{fixedValues(e?.grosswt, 3)}</span> gm Gross </p>
                                </div>
                            </div>
                            <div className="diamondEstimatePrint border-end position-relative">
                                <div className='h-100 d-grid pad_bot_29_estimatePrint'>
                                    {e?.diamonds.length > 0 && e?.diamonds.map((ele, ind) => {
                                        return <div className='d-flex ' key={ind}>
                                            <div className='width20EstimatePrint p_1Estimate'><p className=''>{ele?.ShapeName} {ele?.QualityName} {ele?.Colorname}</p></div>
                                            <div className='width20EstimatePrint p_1Estimate'><p className=''>{ele?.SizeName}</p></div>
                                            <div className='width20EstimatePrint p_1Estimate'><p className='text-end'>{NumberWithCommas(ele?.Pcs, 0)}</p></div>
                                            <div className='width20EstimatePrint p_1Estimate'><p className='text-end'>{fixedValues(ele?.Wt, 3)}</p></div>
                                            <div className='width20EstimatePrint p_1Estimate'><p className='text-end'>{NumberWithCommas(ele?.Rate, 2)}</p></div>
                                            <div className='width20EstimatePrint p_1Estimate'><p className='fw-bold text-end'>{NumberWithCommas(ele?.Amount, 2)}</p></div>
                                        </div>
                                    })}
                                </div>
                                <div className={`d-flex totalBgEstimatePrint position-absolute bottom-0 height_28_5_estimatePrint w-100 ${e?.diamonds.length === 0 && "border-top height_29_5_estimatePrint"}`}>
                                    <div className='width20EstimatePrint p_1Estimate'><p className='fw-bold'></p></div>
                                    <div className='width20EstimatePrint p_1Estimate'><p className='fw-bold'></p></div>
                                    <div className='width20EstimatePrint p_1Estimate d-flex align-items-center justify-content-end'><p className='text-end fw-bold'>{NumberWithCommas(e?.diamondTotal?.pcs, 0)}</p></div>
                                    <div className='width20EstimatePrint p_1Estimate d-flex align-items-center justify-content-end'><p className='text-end fw-bold'>{fixedValues(e?.diamondTotal?.weight, 3)}</p></div>
                                    <div className='width20EstimatePrint p_1Estimate d-flex align-items-center justify-content-end'><p className='text-end fw-bold'></p></div>
                                    <div className='width20EstimatePrint p_1Estimate d-flex align-items-center justify-content-end'><p className='text-end fw-bold'>{NumberWithCommas(e?.diamondTotal?.amount, 2)}</p></div>
                                </div>
                            </div>
                            <div className="metalEstimatePrint border-end position-relative">
                                <div className='h-100 d-grid pad_bot_29_estimatePrint'>
                                    {e?.metals.length > 0 && e?.metals.map((ele, ind) => {
                                        return <div className='d-flex' key={ind}>
                                            <div className='width_40_estimatePrint p_1Estimate'><p className=''>{ele?.ShapeName} {ele?.QualityName}</p></div>
                                            <div className='width_40_estimatePrint p_1Estimate'><p className='text-end '>{fixedValues(ele?.Weight, 3)}</p></div>
                                            <div className='width_40_estimatePrint p_1Estimate'><p className='text-end '>{fixedValues(ele?.Wt, 3)}</p></div>
                                            <div className='width_40_estimatePrint p_1Estimate'><p className='text-end '>{NumberWithCommas(ele?.Rate, 2)}</p></div>
                                            <div className='width_40_estimatePrint p_1Estimate'><p className='text-end '>{NumberWithCommas(ele?.Amount, 2)}</p></div>
                                        </div>
                                    })}
                                </div>
                                <div className={`d-flex totalBgEstimatePrint position-absolute bottom-0 height_28_5_estimatePrint w-100 ${e?.metals.length === 0 && "border-top height_29_5_estimatePrint"}`}>
                                    <div className='width200EstimatePrint p_1Estimate'><p></p></div>
                                    <div className='width200EstimatePrint p_1Estimate d-flex align-items-center justify-content-end'><p className='text-end fw-bold'>{fixedValues(e?.metalsTotal?.weightWithDiamondLoss, 3)}</p></div>
                                    <div className='width200EstimatePrint p_1Estimate d-flex align-items-center justify-content-end'><p className='text-end fw-bold'>{fixedValues(e?.metalsTotal?.weight, 3)}</p></div>
                                    <div className='width200EstimatePrint p_1Estimate d-flex align-items-center justify-content-end'><p className='text-end fw-bold'></p></div>
                                    <div className='width200EstimatePrint p_1Estimate d-flex align-items-center justify-content-end'><p className='text-end fw-bold'>{NumberWithCommas(e?.metalsTotal?.amount, 2)}</p></div>
                                </div>
                            </div>
                            <div className="stoneEstimatePrint border-end position-relative">
                                <div className='h-100 d-grid pad_bot_29_estimatePrint'>
                                    {e?.colorStones.length > 0 && e?.colorStones.map((ele, ind) => {
                                        return <div className='d-flex ' key={ind}>
                                            <div className='width20EstimatePrint p_1Estimate'><p>{ele?.ShapeName} {ele?.QualityName} {ele?.Colorname}</p></div>
                                            <div className='width20EstimatePrint p_1Estimate'><p className=''>{ele?.SizeName}</p></div>
                                            <div className='width20EstimatePrint p_1Estimate'><p className='text-end'>{NumberWithCommas(ele?.Pcs, 0)}</p></div>
                                            <div className='width20EstimatePrint p_1Estimate'><p className='text-end'>{fixedValues(ele?.Wt, 3)}</p></div>
                                            <div className='width20EstimatePrint p_1Estimate'><p className='text-end'>{NumberWithCommas(ele?.Rate, 2)}</p></div>
                                            <div className='width20EstimatePrint p_1Estimate'><p className='fw-bold text-end'>{NumberWithCommas(ele?.Amount, 2)}</p></div>
                                        </div>
                                    })}
                                    {
                                        e?.mics.length > 0 && e?.mics.map((ele, ind) => {
                                            return <div className='d-flex' key={ind}>
                                                <div className='width20EstimatePrint p_1Estimate'><p>M: {ele?.ShapeName} {ele?.QualityName} {ele?.Colorname}</p></div>
                                                <div className='width20EstimatePrint p_1Estimate'><p className=''>{ele?.SizeName}</p></div>
                                                <div className='width20EstimatePrint p_1Estimate'><p className='text-end'>{NumberWithCommas(ele?.Pcs, 0)}</p></div>
                                                <div className='width20EstimatePrint p_1Estimate'><p className='text-end'>{fixedValues(ele?.Wt, 3)}</p></div>
                                                <div className='width20EstimatePrint p_1Estimate'><p className='text-end'>{NumberWithCommas(ele?.Rate, 2)}</p></div>
                                                <div className='width20EstimatePrint p_1Estimate'><p className='fw-bold text-end'>{NumberWithCommas(ele?.Amount, 2)}</p></div>
                                            </div>
                                        })
                                    }
                                </div>
                                <div className={`d-flex totalBgEstimatePrint position-absolute bottom-0 height_28_5_estimatePrint w-100 ${e?.colorStones.length === 0 && "border-top height_29_5_estimatePrint"}`}>
                                    <div className='width20EstimatePrint p_1Estimate'><p></p></div>
                                    <div className='width20EstimatePrint p_1Estimate'><p></p></div>
                                    <div className='width20EstimatePrint p_1Estimate d-flex align-items-center justify-content-end'><p className='text-end fw-bold'>{NumberWithCommas(e?.colorStonesTotal?.pcs + e?.miscsTotal?.pcs, 0)}</p></div>
                                    <div className='width20EstimatePrint p_1Estimate d-flex align-items-center justify-content-end'><p className='text-end fw-bold'>{fixedValues(e?.colorStonesTotal?.weight + e?.miscsTotal?.weight, 3)}</p></div>
                                    <div className='width20EstimatePrint p_1Estimate d-flex align-items-center justify-content-end'><p className='text-end fw-bold'></p></div>
                                    <div className='width20EstimatePrint p_1Estimate d-flex align-items-center justify-content-end'><p className='text-end fw-bold'>{NumberWithCommas(e?.colorStonesTotal?.amount + e?.miscsTotal?.amount, 2)}</p></div>
                                </div>
                            </div>
                            <div className="OtherAmountEstimatePrint border-end position-relative">
                                <div className='h-100 d-grid pad_bot_29_estimatePrint'>
                                    <div className="border-bottom p_1Estimate">
                                        {/* <p className='text-center'>Certification Charge 5,227.00 </p> */}
                                        {e?.otherAmountDetails.length > 0 && e?.otherAmountDetails.map((ele, ind) => {
                                            return <p className='p_1Estimate' key={ind}>{ele?.label} {ele?.value}</p>
                                        })}
                                        <p className='p_1Estimate'>Total Diamond Handling: {NumberWithCommas(e?.TotalDiamondHandling, 2)}</p>

                                    </div>
                                </div>
                                <div className="totalBgEstimatePrint position-absolute bottom-0 height_28_5_estimatePrint w-100 d-flex align-items-center justify-content-end">
                                    <div className='text-end p_1Estimate'><p className='fw-bold'>{NumberWithCommas(e?.OtherCharges, 2)}</p></div>
                                </div>
                            </div>
                            <div className="labourEstimatePrint border-end position-relative">
                                <div className="h-100 d-grid pad_bot_29_estimatePrint">
                                    <div className='d-flex border-bottom'>
                                        <div className='w-50 text-end p_1Estimate'><p>{NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p><p>{NumberWithCommas(e?.settingRate, 2)}</p></div>
                                        {/* <div className='w-50 text-end p_1Estimate'></div>
                                    <div className='w-50 text-end p_1Estimate'></div> */}
                                        <div className='w-50 text-end p_1Estimate'><p>{NumberWithCommas(e?.MakingAmount, 2)}</p><p>{NumberWithCommas(e?.settingAmount, 2)}</p></div>
                                    </div>
                                </div>
                                <div className="totalBgEstimatePrint position-absolute bottom-0 height_28_5_estimatePrint w-100 d-flex align-items-center justify-content-end">
                                    <div className=''><p className='text-end p_1Estimate fw-bold'>{NumberWithCommas(e?.totalSetttingAmount, 2)}</p></div>
                                </div>
                            </div>
                            <div className="totalAmountEstimatePrint position-relative">
                                <div className="h-100 d-grid pad_bot_29_estimatePrint">
                                    <div className='border-bottom'>
                                        <p className='text-end p_1Estimate pe-1'>{NumberWithCommas(e?.TotalAmount, 2)}</p>
                                    </div>
                                </div>
                                <div className="totalBgEstimatePrint position-absolute bottom-0  height_29_5_estimatePrint w-100 d-flex align-items-center justify-content-end pe-1">
                                    <div className='text-end p_1Estimate'><p className='fw-bold'><span dangerouslySetInnerHTML={{ __html: json1Data?.Currencysymbol }}></span>{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
                {/* cgst */}
                <div className="border-black border-end border-start">
                    <div className="d-flex  recordEstimatePrint overflow-hidden border-bottom" >
                        <div className="srNoEstimatePrint p_1Estimate">
                        </div>
                        <div className="designEstimatePrint p_1Estimate">

                        </div>
                        <div className="diamondEstimatePrint position-relative">

                        </div>
                        <div className="metalEstimatePrint position-relative">

                        </div>
                        <div className="stoneEstimatePrint position-relative">

                        </div>
                        <div className="OtherAmountEstimatePrint position-relative">

                        </div>
                        <div className="labourEstimatePrint border-end">
                            <div className='text-end'>
                                {taxes.length > 0 && taxes.map((e, i) => {
                                    return <p key={i}>{e?.name} @ {e?.per}</p>
                                })}
                                <p>{json1Data?.AddLess<0 ? "Less" : "Add"}</p>
                            </div>
                        </div>
                        <div className="totalAmountEstimatePrint">
                            <div className='text-end'>
                                {taxes.length > 0 && taxes.map((e, i) => {
                                    return <p key={i}>{NumberWithCommas(e?.amount, 2)}</p>
                                })}
                                {/* <p>{total?.cgstAmount}</p> */}
                                {/* <p>{total?.sgstAmount}</p> */}
                                <p>{NumberWithCommas(json1Data?.AddLess, 2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* total */}
                <div className="d-flex recordEstimatePrint overflow-hidden border-end border-start border-bottom  border-black" >
                    <div className="totalEstimatePrint border-end totalBgEstimatePrint ">
                        <p className='text-center fw-bold h-100'>Total</p>
                    </div>
                    <div className="diamondEstimatePrint border-end">
                        <div className="d-flex totalBgEstimatePrint w-100">
                            <div className='width20EstimatePrint p_1Estimate h-100'><p></p></div>
                            <div className='width20EstimatePrint p_1Estimate h-100'><p></p></div>
                            <div className='width20EstimatePrint p_1Estimate h-100'><p className='text-end fw-bold'>{NumberWithCommas(total?.finalDiamondTotal?.pcs, 0)}</p></div>
                            <div className='width20EstimatePrint p_1Estimate h-100'><p className='text-end fw-bold'>{NumberWithCommas(total?.finalDiamondTotal?.weight, 3)}</p></div>
                            <div className='width20EstimatePrint p_1Estimate h-100'></div>
                            <div className='width20EstimatePrint p_1Estimate h-100'><p className='text-end fw-bold'>{NumberWithCommas(total?.finalDiamondTotal?.amount, 2)}</p></div>
                        </div>
                    </div>
                    <div className="metalEstimatePrint border-end" >
                        <div className="d-flex totalBgEstimatePrint bottom-0 w-100">
                            <div className='width200EstimatePrint p_1Estimate h-100'><p className='fw-bold fw-bold'></p></div>
                            <div className='width200EstimatePrint p_1Estimate h-100'><p className='fw-bold fw-bold text-end'>{fixedValues(total?.weightWithDiamondLoss, 3)}</p></div>
                            <div className='width200EstimatePrint p_1Estimate h-100'><p className='fw-bold fw-bold text-end'>{fixedValues(total?.finalMetalsTotal?.weight, 3)}</p></div>
                            {/* <div className='width200EstimatePrint p_1Estimate h-100'><p className='fw-bold fw-bold text-end'>{NumberWithCommas(total?.finalMetalsTotal?.rate, 2)}</p></div> */}
                            <div className='width200EstimatePrint p_1Estimate h-100'><p className='fw-bold fw-bold text-end'></p></div>
                            <div className='width200EstimatePrint p_1Estimate h-100'><p className='fw-bold fw-bold text-end'>{NumberWithCommas(total?.finalMetalsTotal?.amount, 2)}</p></div>
                        </div>
                    </div>
                    <div className="stoneEstimatePrint border-end" >
                        <div className="d-flex totalBgEstimatePrint bottom-0 w-100">
                            <div className='width20EstimatePrint p_1Estimate h-100'><p className='fw-bold'></p></div>
                            <div className='width20EstimatePrint p_1Estimate h-100'><p className='fw-bold'></p></div>
                            <div className='width20EstimatePrint p_1Estimate h-100'><p className='text-end fw-bold'>{NumberWithCommas(total?.finalColorStonesTotal?.pcs+total?.finalmiscsTotal?.pcs, 0)}</p></div>
                            <div className='width20EstimatePrint p_1Estimate h-100'><p className='text-end fw-bold'>{fixedValues(total?.finalColorStonesTotal?.weight+total?.finalmiscsTotal?.weight, 3)}</p></div>
                            <div className='width20EstimatePrint p_1Estimate h-100'></div>
                            <div className='width20EstimatePrint p_1Estimate h-100'><p className='text-end fw-bold'>{NumberWithCommas(total?.finalColorStonesTotal?.amount+total?.finalmiscsTotal?.amount, 2)}</p></div>
                        </div>
                    </div>
                    <div className="OtherAmountEstimatePrint border-end" >
                        <div className="totalBgEstimatePrint bottom-0 w-100 h-100">
                            <div className='h-100 text-end p_1Estimate'><p className='fw-bold'>{NumberWithCommas(total?.otherAmount, 2)}</p></div>
                        </div>
                    </div>
                    <div className="labourEstimatePrint border-end" >
                        <div className="d-flex totalBgEstimatePrint w-100 h-100 justify-content-end">
                            <div className='p_1Estimate fw-bold'><p>{NumberWithCommas(total?.labourAmount, 2)}</p></div>
                        </div>
                    </div>
                    <div className="totalAmountEstimatePrint d-flex" >
                        <div className="totalBgEstimatePrint w-100 h-100">
                            <div className='text-end p_1Estimate'><p className='fw-bold'><span dangerouslySetInnerHTML={{ __html: json1Data?.Currencysymbol }}></span>{NumberWithCommas(total?.finalAmount, 2)}</p></div>
                        </div>
                    </div>
                </div>
                <div className="d-flex recordEstimatePrint overflow-hidden border-bottom border-start border-end">
                    {/* summary */}
                    <div className="min_height_100EstimatePrint border-end position-relative col-3">
                        <div className='totalBgEstimatePrint text-center border-bottom'>
                            <p className='fw-bold p-1'>SUMMARY</p>
                        </div>
                        <div className="d-grid h-100 pb-4">
                            <div className="d-flex w-100 justify-content-between">
                                <div className='w-50 border-end h-100 pb-4'>
                                    <div className="d-flex justify-content-between p-1">
                                        <p className='fw-bold'>GOLD IN 24KT</p>
                                        <p>{fixedValues(total?.gold24Kt, 3)} gm</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p className='fw-bold'>GROSS WT</p>
                                        <p>{fixedValues(total?.grosswt, 3)} gm</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p className='fw-bold'>*(G+D) WT</p>
                                        <p>{fixedValues(total?.weightWithDiamondLoss, 3)} gm</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p className='fw-bold'>NET WT</p>
                                        <p>{fixedValues(total?.gdWt, 3)} gm</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p className='fw-bold'>DIAMOND WT</p>
                                        <p>{NumberWithCommas(total?.diaPcs, 0)} / {NumberWithCommas(total?.finalDiamondTotal?.weight, 3)} cts</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p className='fw-bold'>STONE WT</p>
                                        <p>{NumberWithCommas(total?.stonePcs, 0)} / {fixedValues(total?.finalColorStonesTotal?.weight, 3)} cts</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p className='fw-bold'>MISC WT</p>
                                        <p>{NumberWithCommas(total?.miscPcs, 0)} / {fixedValues(total?.finalmiscsTotal?.weight, 3)} gm</p>
                                    </div>
                                </div>
                                <div className='w-50 h-100 pb-4'>
                                    <div className="d-flex justify-content-between p-1">
                                        <p className='fw-bold'>GOLD</p>
                                        <p>{NumberWithCommas(total?.goldAmount, 2)}</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p className='fw-bold'>DIAMOND</p>
                                        <p>{NumberWithCommas(total?.diamondAmount, 2)}</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p className='fw-bold'>CST</p>
                                        <p>{NumberWithCommas(total?.colorStoneAmount, 2)}</p>
                                    </div><div className="d-flex justify-content-between p-1">
                                        <p className='fw-bold'>MISC</p>
                                        <p>{NumberWithCommas(total?.miscAmount, 2)}</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p className='fw-bold'>MAKING</p>
                                        <p>{NumberWithCommas(total?.makingAmount, 2)}</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p className='fw-bold'>OTHER</p>
                                        <p>{NumberWithCommas(total?.otherAmount, 2)}</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p className='fw-bold'>ADD</p>
                                        <p>{NumberWithCommas(json1Data?.AddLess, 2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex totalBgEstimatePrint position-absolute bottom-0 w-100 border-top">
                            <div className='p-1 min_height_24_estimatePrint w-50 border-end'><p> </p></div>
                            <div className='p-1 min_height_24_estimatePrint w-50'>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="fw-bold"><p>TOTAL</p></div>
                                    <div><p>{NumberWithCommas(total?.finalAmount, 2)}</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* diamond details */}
                    <div className="min_height_100EstimatePrint border-end position-relative col-2">
                        <div className="totalBgEstimatePrint text-center border-bottom">
                            <p className="fw-bold p-1">
                                Diamond Detail
                            </p>
                        </div>
                        <div className="h-100 pad_bot_25_estimatePrint">
                            {/* {diamondDetail.length > 0 && diamondDetail.map((e, i) => {
                                return <div className="d-flex w-100 justify-content-between p-1" key={i}>
                                    <p className='fw-bold'>{e?.shapeQualityColor}</p>
                                    <p>{NumberWithCommas(e?.pcs, 0)} / {fixedValues(e?.wt, 3)} cts</p>
                                </div>
                            })} */}
                            <div className="d-flex w-100 justify-content-between p-1">
                                    <p className='fw-bold'>Others</p>
                                    <p>{NumberWithCommas(diamondDetailss.pcs, 0)} / {fixedValues(diamondDetailss.wt, 3)} cts</p>
                                </div>
                            <div className="d-flex w-100 justify-content-between p-1">
                                <p></p>
                                <p></p>
                            </div>
                        </div>

                     
                        <div className="d-flex totalBgEstimatePrint position-absolute bottom-0 w-100 border-top">
                            <div className='p-1 min_height_24_estimatePrint w-50'><p> </p></div>
                            <div className='p-1 min_height_24_estimatePrint w-50'><p> </p></div>
                        </div>
                    </div>
                    {/* other details */}
                    <div className="min_height_100EstimatePrint  border-end position-relative col-2">
                        <div className="totalBgEstimatePrint text-center border-bottom"><p className="fw-bold p-1">OTHER DETAILS</p></div>
                        {brokrage && (brokarage.length > 0 && brokarage.map((e, i) => {
                            return <div className="d-flex w-100 justify-content-between p-1" key={i}>
                                <p className='fw-bold'>{e?.BankName}</p>
                                <p>{NumberWithCommas(+e?.label, 2)}</p>
                            </div>
                        }))}
                        <div className="d-flex w-100 justify-content-between p-1">
                            <p className='fw-bold'>RATE IN 24KT	</p>
                            <p>{fixedValues(json1Data?.MetalRate24K, 3)}</p>
                        </div>
                    </div>
                    {/* remark details  */}
                    <div className="min_height_100EstimatePrint col-2">
                        <div className="totalBgEstimatePrint text-center border-bottom"><p className="fw-bold p-1">REMARK</p></div>
                        <div className="p-1">
                            <div dangerouslySetInnerHTML={{ __html: json1Data?.PrintRemark }}></div>
                        </div>
                    </div>
                    {/* created by */}
                    <div className="min_height_100EstimatePrint d-flex border-start col-3">
                        <div className="d-flex h-100 w-100">
                            <div className="position-relative border-end w-50"><p className='position-absolute bottom-0 w-100 text-center'>Created By</p></div>
                            <div className="position-relative w-50"><p className='position-absolute bottom-0 w-100  text-center'>Checked By</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
    </>
    )
}

export default EstimatePrint