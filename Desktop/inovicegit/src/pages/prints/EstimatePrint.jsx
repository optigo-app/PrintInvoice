import React, { useEffect, useState } from 'react';
import "../../assets/css/prints/estimatePrint.css";
import { apiCall, handleImageError, handleImageLoad, handlePrint } from '../../GlobalFunctions';
import Loader2 from '../../components/Loader2';
import Loader from '../../components/Loader';

const EstimatePrint = ({urls, token, invoiceNo, printName }) => {
    const [image, setImage] = useState(false);
    const [json1Data, setJson1Data] = useState({});
    const [json2Data, setJson2Data] = useState([]);
    const [imageLoading, setImageLoading] = useState(true);
    const [total, setTotal] = useState({
        totalamount: 0,
        cgstAmount: 0,
        sgstAmount: 0,
        finalAmount: 0,
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
        otherAmount: 0,
        summaryTotalAmount: 0
    });
    const [diamondDetail, setDiamondDetail] = useState([]);
    const [loader, setLoader] = useState(true);

    const handleChange = (e) => {
        image ? setImage(false) : setImage(true);
    }

    const caiculateMaterial = (data) => {
        let resultArr = [];
        let totals = { ...total };
        let diamondDetailList = [];
        let diamondDetailList2 = [{ shapeQualityColor: "others", pcs: 0, wt: 0 }];
        data?.BillPrint_Json1.forEach((e, i) => {
            let obj = { ...e };
            let diamonds = [];
            let metals = [];
            let colorStones = [];
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
                amount: 0
            }
            let colorStonesTotal = {
                pcs: 0,
                weight: 0,
                rate: 0,
                amount: 0
            }
            data?.BillPrint_Json2.forEach((ele, ind) => {
                if (e?.SrJobno === ele?.StockBarcode) {
                    if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                        if (ele?.ShapeName === "GOLD") {
                            if (ele?.QualityName === '24K') {
                                totals.gold24Kt += ele?.Wt;
                            }
                            totals.goldAmount += ele?.Amount;
                        }
                        metals.push(ele);
                    }
                    if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
                        colorStones.push(ele);
                        totals.stoneWt += ele?.Wt;
                        totals.stonePcs += ele?.Pcs;
                        totals.colorStoneAmount += ele?.Amount;
                    }
                    if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
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
                        totals.miscWt += ele?.Wt;
                        totals.miscPcs += ele?.Pcs;
                        totals.miscAmount += ele?.Amount;
                    }
                }
            });
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
            obj.diamonds = diamonds;
            obj.metals = metals;
            obj.colorStones = colorStones;
            obj.diamondTotal = diamondTotal;
            obj.metalsTotal = metalsTotal;
            obj.colorStonesTotal = colorStonesTotal;
            totals.totalamount += e?.TotalAmount;
            totals.grosswt += e?.grosswt;
            totals.otherAmount += e?.OtherCharges;
            totals.gdWt += e?.MetalDiaWt;
            totals.NetWt += e?.NetWt;
            totals.makingAmount += e?.MakingAmount;
            totals.otherAmount += e?.OtherCharges;
            resultArr.push(obj);
        });
        totals.cgstAmount = data?.BillPrint_Json[0]?.CGST * totals.totalamount / 100;
        totals.sgstAmount = data?.BillPrint_Json[0]?.SGST * totals.totalamount / 100;
        totals.finalAmount = totals.totalamount + totals.cgstAmount + totals.sgstAmount + data?.BillPrint_Json[0]?.AddLess;
        totals.summaryTotalAmount = (totals.goldAmount + totals.diamondAmount + totals.colorStoneAmount + totals.miscAmount +
            totals.makingAmount + totals.otherAmount + data?.BillPrint_Json[0].AddLess).toFixed(3);
        totals.gold24Kt = (totals.gold24Kt / 5).toFixed(3);
        totals.grosswt = (totals.grosswt / 5).toFixed(3);
        totals.gdWt = (totals.gdWt / 5).toFixed(3);
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
    }

    const loadData = (data) => {
        setJson1Data(data?.BillPrint_Json[0]);
        caiculateMaterial(data);
    }

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


    const handleImageLoad = () => {
        setImageLoading(false);
    };

    return (<>
        {loader ? <Loader /> : <div className='container containerEstimate'>
            {/* print button */}
            <div className="d-flex justify-content-end align-items-center print_sec_sum4 pb-4 mt-5 w-100" >
                <div className="form-check pe-3 mb-0">
                    <input className="form-check-input border-dark" type="checkbox" checked={image} onChange={e => handleChange(e)} />
                    <label className="form-check-label h6 mb-0 pt-1">
                        With Image
                    </label>
                </div>
                <div className="form-check ps-3">
                    <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                </div>
            </div>

            {/* print name */}
            <div className="border p-1 mt-5" >
                <p className='text-uppercase fw-bold'>Estimate</p>
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
                <div className="border-start border-top border-end d-flex border-bottom border-2 recordEstimatePrint overflow-hidden">
                    <div className="srNoEstimatePrint border-end p-1 d-flex align-items-center justify-content-center">
                        <p>Sr</p>
                    </div>
                    <div className="designEstimatePrint border-end p-1 d-flex align-items-center justify-content-center">
                        <p>Design</p>
                    </div>
                    <div className="diamondEstimatePrint border-end">
                        <div className='p-1 text-center border-bottom'><p>Diamond</p></div>
                        <div className='d-flex h-100'>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center'>Code</p></div>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center'>Size</p></div>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center'>Pcs</p></div>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center'>Wt</p></div>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center'>Rate</p></div>
                            <div className='width20EstimatePrint p-1'><p className='text-center'>Amount</p></div>
                        </div>
                    </div>
                    <div className="metalEstimatePrint border-end ">
                        <div className='p-1 text-center border-bottom'><p>Metal</p></div>
                        <div className='d-flex h-100'>
                            <div className='width_40_estimatePrint p-1 border-end'><p className='text-center'>Quality</p></div>
                            <div className='width_40_estimatePrint p-1 border-end'><p className='text-center'>*Wt</p></div>
                            <div className='width_40_estimatePrint p-1 border-end'><p className='text-center'>Net Wt</p></div>
                            <div className='width_40_estimatePrint p-1 border-end'><p className='text-center'>Rate</p></div>
                            <div className='width_45_estimatePrint p-1'><p className='text-center'>Amount</p></div>
                        </div>
                    </div>
                    <div className="stoneEstimatePrint border-end">
                        <div className='p-1 text-center border-bottom'><p>Stone & Misc</p></div>
                        <div className='d-flex h-100'>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center'>Code</p></div>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center'>Size</p></div>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center'>Pcs</p></div>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center'>Wt</p></div>
                            <div className='width20EstimatePrint p-1 border-end'><p className='text-center'>Rate</p></div>
                            <div className='width20EstimatePrint p-1'><p className='text-center'>Amount</p></div>
                        </div>
                    </div>
                    <div className="OtherAmountEstimatePrint border-end p-1 d-flex align-items-center justify-content-center flex-wrap">
                        <p className='text-center'>Other </p>
                        <p className='text-center'>Amount </p>
                    </div>
                    <div className="labourEstimatePrint border-end">
                        <div className='p-1 text-center border-bottom'><p>Labour</p></div>
                        <div className='d-flex h-100'>
                            <div className='col p-1 border-end text-center'><p>Rate</p></div>
                            <div className='col p-1 text-center'><p>Amount</p></div>
                        </div>
                    </div>
                    <div className="totalAmountEstimatePrint p-1 d-flex align-items-center justify-content-center flex-wrap">
                        <p className='text-center'>Total </p>
                        <p className='text-center'>Amount </p>
                    </div>
                </div>

                {/* data */}
                {json2Data.length > 0 && json2Data.map((e, i) => {
                    return <div className="d-flex border-bottom border-2 recordEstimatePrint overflow-hidden border-end border-start" key={i}>
                        <div className="srNoEstimatePrint border-end p-1">
                            <p>{e?.SrNo}</p>
                        </div>
                        <div className="designEstimatePrint border-end p-1">
                            <div className="d-flex justify-content-between">
                                <div>{e?.designno}</div>
                                <div className='text-end'>
                                    <p>{e?.SrJobno}</p>
                                    <p>Pure White</p>
                                </div>
                            </div>
                            <div className='pb-2'>
                                {image && <>{imageLoading && <Loader2 />}{<img src={e?.DesignImage} alt="" className='w-100' onError={handleImageError} onLoad={handleImageLoad} style={{ display: imageLoading ? 'none' : 'block' }} />}</>}
                            </div>
                            <div>
                                <p className='fw-bold'>PO:- </p>
                                <div className="d-flex justify-content-between">

                                </div>
                                <p>Tunch : {e?.Tunch} </p>
                                <p>{e?.grosswt} gm Gross </p>
                            </div>
                        </div>
                        <div className="diamondEstimatePrint border-end position-relative">
                            <div className='h-100 d-grid pad_bot_29_estimatePrint'>
                                {e?.diamonds.length > 0 && e?.diamonds.map((ele, ind) => {
                                    return <div className='d-flex border-bottom' key={ind}>
                                        <div className='width20EstimatePrint p-1 border-end'><p className=''>{ele?.ShapeName} {ele?.QualityName}</p></div>
                                        <div className='width20EstimatePrint p-1 border-end'><p className=''>{ele?.SizeName}</p></div>
                                        <div className='width20EstimatePrint p-1 border-end'><p className='text-end'>{ele?.Pcs}</p></div>
                                        <div className='width20EstimatePrint p-1 border-end'><p className='text-end'>{ele?.Wt}</p></div>
                                        <div className='width20EstimatePrint p-1 border-end'><p className='text-end'>{ele?.Rate}</p></div>
                                        <div className='width20EstimatePrint p-1'><p className='text-end'>{ele?.Amount}</p></div>
                                    </div>
                                })}
                            </div>
                            <div className={`d-flex totalBgEstimatePrint position-absolute bottom-0 height_28_5_estimatePrint w-100 ${e?.diamonds.length === 0 && "border-top height_29_5_estimatePrint"}`}>
                                <div className='width20EstimatePrint p-1'><p></p></div>
                                <div className='width20EstimatePrint p-1'><p></p></div>
                                <div className='width20EstimatePrint p-1 d-flex align-items-center justify-content-end'><p className='text-end'>{e?.diamondTotal?.pcs}</p></div>
                                <div className='width20EstimatePrint p-1 d-flex align-items-center justify-content-end'><p className='text-end'>{(e?.diamondTotal?.weight).toFixed(2)}</p></div>
                                <div className='width20EstimatePrint p-1 d-flex align-items-center justify-content-end'><p className='text-end'>{(e?.diamondTotal?.rate).toFixed(2)}</p></div>
                                <div className='width20EstimatePrint p-1 d-flex align-items-center justify-content-end'><p className='text-end'>{(e?.diamondTotal?.amount).toFixed(2)}</p></div>
                            </div>
                        </div>
                        <div className="metalEstimatePrint border-end position-relative">
                            <div className='h-100 d-grid pad_bot_29_estimatePrint'>
                                {e?.metals.length > 0 && e?.metals.map((ele, ind) => {
                                    return <div className='d-flex border-bottom' key={ind}>
                                        <div className='width_40_estimatePrint p-1 border-end'><p>{ele?.ShapeName} {ele?.QualityName}</p></div>
                                        <div className='width_40_estimatePrint p-1 border-end'><p className='text-end'>{ele?.Wt}</p></div>
                                        <div className='width_40_estimatePrint p-1 border-end'><p className='text-end'>{ }</p></div>
                                        <div className='width_40_estimatePrint p-1 border-end'><p className='text-end'>{ele?.Rate}</p></div>
                                        <div className='width_45_estimatePrint p-1'><p className='text-end'>{ele?.Amount}</p></div>
                                    </div>
                                })}
                            </div>
                            <div className={`d-flex totalBgEstimatePrint position-absolute bottom-0 height_28_5_estimatePrint w-100 ${e?.metals.length === 0 && "border-top height_29_5_estimatePrint"}`}>
                                <div className='width200EstimatePrint p-1'><p></p></div>
                                <div className='width200EstimatePrint p-1 d-flex align-items-center justify-content-end'><p className='text-end'>{(e?.metalsTotal?.weight).toFixed(2)}</p></div>
                                <div className='width200EstimatePrint p-1 d-flex align-items-center justify-content-end'><p className='text-end'>{ }</p></div>
                                <div className='width200EstimatePrint p-1 d-flex align-items-center justify-content-end'><p className='text-end'>{(e?.metalsTotal?.rate).toFixed(2)}</p></div>
                                <div className='width200EstimatePrint p-1 d-flex align-items-center justify-content-end'><p className='text-end'>{(e?.metalsTotal?.amount).toFixed(2)}</p></div>
                            </div>
                        </div>
                        <div className="stoneEstimatePrint border-end position-relative">
                            <div className='h-100 d-grid pad_bot_29_estimatePrint'>
                                {e?.colorStones.length > 0 && e?.colorStones.map((ele, ind) => {
                                    return <div className='d-flex border-bottom' key={ind}>
                                        <div className='width20EstimatePrint p-1 border-end'><p>{ele?.ShapeName} {ele?.QualityName}</p></div>
                                        <div className='width20EstimatePrint p-1 border-end'><p className=''>{ele?.SizeName}</p></div>
                                        <div className='width20EstimatePrint p-1 border-end'><p className='text-end'>{ele?.Pcs}</p></div>
                                        <div className='width20EstimatePrint p-1 border-end'><p className='text-end'>{ele?.Wt}</p></div>
                                        <div className='width20EstimatePrint p-1 border-end'><p className='text-end'>{ele?.Rate}</p></div>
                                        <div className='width20EstimatePrint p-1'><p className='text-end'>{ele?.Amount}</p></div>
                                    </div>
                                })}
                            </div>
                            <div className={`d-flex totalBgEstimatePrint position-absolute bottom-0 height_28_5_estimatePrint w-100 ${e?.colorStones.length === 0 && "border-top height_29_5_estimatePrint"}`}>
                                <div className='width20EstimatePrint p-1'><p></p></div>
                                <div className='width20EstimatePrint p-1'><p></p></div>
                                <div className='width20EstimatePrint p-1 d-flex align-items-center justify-content-end'><p className='text-end'>{e?.colorStonesTotal?.pcs}</p></div>
                                <div className='width20EstimatePrint p-1 d-flex align-items-center justify-content-end'><p className='text-end'>{(e?.colorStonesTotal?.weight).toFixed(2)}</p></div>
                                <div className='width20EstimatePrint p-1 d-flex align-items-center justify-content-end'><p className='text-end'>{(e?.colorStonesTotal?.rate).toFixed(2)}</p></div>
                                <div className='width20EstimatePrint p-1 d-flex align-items-center justify-content-end'><p className='text-end'>{(e?.colorStonesTotal?.amount).toFixed(2)}</p></div>
                            </div>
                        </div>
                        <div className="OtherAmountEstimatePrint border-end position-relative">
                            <div className='h-100 d-grid pad_bot_29_estimatePrint'>
                                <div className="border-bottom p-1">
                                    {/* <p className='text-center'>Certification Charge 5,227.00 </p> */}
                                    <p className='text-end'>{e?.OtherCharges}</p>
                                </div>
                            </div>
                            <div className="totalBgEstimatePrint position-absolute bottom-0 height_28_5_estimatePrint w-100 d-flex align-items-center justify-content-end">
                                <div className=' p-1 text-end'><p>{e?.OtherCharges}</p></div>
                            </div>
                        </div>
                        <div className="labourEstimatePrint border-end position-relative">
                            <div className="h-100 d-grid pad_bot_29_estimatePrint">
                                <div className='d-flex border-bottom'>
                                    <div className='w-50 p-1 text-end'><p>{e?.MaKingCharge_Unit}</p></div>
                                    <div className='w-50 p-1 text-end'><p>{e?.MakingAmount}</p></div>
                                </div>
                            </div>
                            <div className="totalBgEstimatePrint position-absolute bottom-0 height_28_5_estimatePrint w-100 d-flex align-items-center justify-content-end">
                                <div className='p-1'><p className='text-end'>{e?.MaKingCharge_Unit + e?.MakingAmount}</p></div>
                            </div>
                        </div>
                        <div className="totalAmountEstimatePrint position-relative">
                            <div className="h-100 d-grid pad_bot_29_estimatePrint">
                                <div className='border-bottom p-1'>
                                    <p className='text-end'>{e?.TotalAmount}</p>
                                </div>
                            </div>
                            <div className="totalBgEstimatePrint position-absolute bottom-0 border-top height_29_5_estimatePrint w-100 d-flex align-items-center justify-content-end">
                                <div className='p-1 text-end'><p>{e?.TotalAmount}</p></div>
                            </div>
                        </div>
                    </div>
                })}

                {/* cgst */}
                <div className="d-flex border-bottom border-2 recordEstimatePrint overflow-hidden border-end border-start" >
                    <div className="srNoEstimatePrint p-1">
                    </div>
                    <div className="designEstimatePrint p-1">

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
                        <div className='p-1 text-end'>
                            <p>CGST @ 1.50%</p>
                            <p>SGST @ 1.50%</p>
                            <p>Add</p>
                        </div>
                    </div>
                    <div className="totalAmountEstimatePrint">
                        <div className='p-1 text-end'>
                            <p>{total?.cgstAmount}</p>
                            <p>{total?.sgstAmount}</p>
                            <p>{json1Data?.AddLess}</p>
                        </div>
                    </div>
                </div>

                {/* total */}
                <div className="d-flex border-bottom border-2 recordEstimatePrint overflow-hidden border-end border-start" >
                    <div className="totalEstimatePrint p-1 border-end totalBgEstimatePrint" >
                        <p className='text-center fw-bold h-100'>Total</p>
                    </div>
                    <div className="diamondEstimatePrint border-end" >
                        <div className="d-flex totalBgEstimatePrint w-100">
                            <div className='width20EstimatePrint p-1 h-100'><p></p></div>
                            <div className='width20EstimatePrint p-1 h-100'><p></p></div>
                            {/* finalDiamondTotal :
                            amount : 33191.81999999999
                            pcs : 1360
                            rate : 9120
                            weight : 47.778 */}
                            <div className='width20EstimatePrint p-1 h-100'><p className='text-end'>{total?.finalDiamondTotal?.pcs.toFixed(2)}</p></div>
                            <div className='width20EstimatePrint p-1 h-100'><p className='text-end'>{total?.finalDiamondTotal?.weight.toFixed(2)}</p></div>
                            <div className='width20EstimatePrint p-1 h-100'><p className='text-end'>{total?.finalDiamondTotal?.rate.toFixed(2)}</p></div>
                            <div className='width20EstimatePrint p-1 h-100'><p className='text-end'>{total?.finalDiamondTotal?.amount.toFixed(2)}</p></div>
                        </div>
                    </div>
                    <div className="metalEstimatePrint border-end" >
                        <div className="d-flex totalBgEstimatePrint bottom-0 w-100">
                            <div className='width200EstimatePrint p-1 h-100'><p></p></div>
                            <div className='width200EstimatePrint p-1 h-100'><p>{total?.finalMetalsTotal?.weight.toFixed(2)}</p></div>
                            <div className='width200EstimatePrint p-1 h-100'><p></p></div>
                            <div className='width200EstimatePrint p-1 h-100'><p>{total?.finalMetalsTotal?.rate.toFixed(2)}</p></div>
                            <div className='width200EstimatePrint p-1 h-100'><p>{total?.finalMetalsTotal?.amount.toFixed(2)}</p></div>
                        </div>
                    </div>
                    <div className="stoneEstimatePrint border-end" >
                        <div className="d-flex totalBgEstimatePrint bottom-0 w-100">
                            <div className='width20EstimatePrint p-1 h-100'><p></p></div>
                            <div className='width20EstimatePrint p-1 h-100'><p></p></div>
                            <div className='width20EstimatePrint p-1 h-100'><p className='text-end'>{total?.finalColorStonesTotal?.pcs.toFixed(2)}</p></div>
                            <div className='width20EstimatePrint p-1 h-100'><p className='text-end'>{total?.finalColorStonesTotal?.weight.toFixed(2)}</p></div>
                            <div className='width20EstimatePrint p-1 h-100'><p className='text-end'>{total?.finalColorStonesTotal?.rate.toFixed(2)}</p></div>
                            <div className='width20EstimatePrint p-1 h-100'><p className='text-end'>{total?.finalColorStonesTotal?.amount.toFixed(2)}</p></div>
                        </div>
                    </div>
                    <div className="OtherAmountEstimatePrint border-end" >
                        <div className="totalBgEstimatePrint bottom-0 w-100 h-100">
                            <div className='h-100 p-1 text-end'><p>{total?.otherAmount}</p></div>
                        </div>
                    </div>
                    <div className="labourEstimatePrint border-end" >
                        <div className="d-flex totalBgEstimatePrint w-100 h-100">
                            <div className='p-1'><p></p></div>
                        </div>
                    </div>
                    <div className="totalAmountEstimatePrint d-flex" >
                        <div className="totalBgEstimatePrint w-100 h-100">
                            <div className='text-end p-1'><p>{total?.finalAmount}</p></div>
                        </div>
                    </div>
                </div>

                <div className="d-flex recordEstimatePrint overflow-hidden border-2 border-bottom">
                    {/* summary */}
                    <div className="min_height_100EstimatePrint summaryEstimateprint border-end border-start position-relative">
                        <div className='totalBgEstimatePrint text-center border-bottom border-start'>
                            <p className='fw-bold p-1'>SUMMARY</p>
                        </div>
                        <div className="d-grid h-100 pb-4 border-start">
                            <div className="d-flex w-100 justify-content-between">
                                <div className='w-50 border-end h-100 pb-4'>
                                    <div className="d-flex justify-content-between p-1">
                                        <p>GOLD IN 24KT</p>
                                        <p>{total?.gold24Kt} gm</p>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <p>GROSS WT</p>
                                        <p>{total?.grosswt} gm</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p>*(G+D) WT</p>
                                        <p>{total?.gdWt} gm</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p>NET WT</p>
                                        <p>{total?.NetWt} gm</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p>DIAMOND WT</p>
                                        <p>{total?.diaPcs} / {total?.diaWt} cts</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p>STONE WT</p>
                                        <p>{total?.stonePcs} / {total?.stoneWt} cts</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p>MISC WT</p>
                                        <p>{total?.miscPcs} / {total?.miscWt} gm</p>
                                    </div>
                                </div>
                                <div className='w-50 h-100 pb-4'>
                                    <div className="d-flex justify-content-between p-1">
                                        <p>GOLD</p>
                                        <p>{total?.goldAmount}</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p>DIAMOND</p>
                                        <p>{total?.diamondAmount}</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p>CST</p>
                                        <p>{total?.colorStoneAmount}</p>
                                    </div><div className="d-flex justify-content-between p-1">
                                        <p>MISC</p>
                                        <p>{total?.miscAmount}</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p>MAKING</p>
                                        <p>{total?.makingAmount}</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p>OTHER</p>
                                        <p>{total?.otherAmount}</p>
                                    </div>
                                    <div className="d-flex justify-content-between p-1">
                                        <p>ADD</p>
                                        <p>{json1Data?.AddLess}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex totalBgEstimatePrint position-absolute bottom-0 w-100 pt-1 border-start border-top">
                            <div className='p-1 min_height_24_estimatePrint w-50 border-end'><p> </p></div>
                            <div className='p-1 min_height_24_estimatePrint w-50'>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="fw-bold"><p>TOTAL</p></div>
                                    <div><p>{total?.summaryTotalAmount}</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* diamond details */}
                    <div className="min_height_100EstimatePrint diamondDetailEstimateprint border-end position-relative">
                        <div className="totalBgEstimatePrint text-center border-bottom">
                            <p className="fw-bold p-1">
                                Diamond Detail
                            </p>
                        </div>
                        <div className="h-100 pad_bot_25_estimatePrint">
                            {diamondDetail.length > 0 && diamondDetail.map((e, i) => {
                                return <div className="d-flex w-100 justify-content-between p-1" key={i}>
                                    <p>{e?.shapeQualityColor}</p>
                                    <p>{e?.pcs} / {e?.wt} cts</p>
                                </div>
                            })}
                            <div className="d-flex w-100 justify-content-between p-1">
                                <p></p>
                                <p></p>
                            </div>
                        </div>
                        <div className="d-flex totalBgEstimatePrint position-absolute bottom-0 w-100 pt-1 border-top">
                            <div className='p-1 min_height_24_estimatePrint w-50'><p> </p></div>
                            <div className='p-1 min_height_24_estimatePrint w-50'><p> </p></div>
                        </div>
                    </div>
                    {/* other details */}
                    <div className="min_height_100EstimatePrint otherDetailEstimateprint border-end position-relative">
                        <div className="totalBgEstimatePrint text-center"><p className="fw-bold p-1">OTHER DETAILS</p></div>
                        <div className="d-flex w-100 justify-content-between p-1">
                            <p>RATE IN 24KT	</p>
                            <p>{json1Data?.MetalRate24K} gm</p>
                        </div>
                    </div>
                    {/* remark details  */}
                    <div className="min_height_100EstimatePrint blankDetailEstimatePrint">
                        <div className="totalBgEstimatePrint text-center border-bottom"><p className="fw-bold p-1">REMARK</p></div>
                        <div className="p-1">
                            <p dangerouslySetInnerHTML={{ __html: json1Data?.PrintRemark }} className='fs-6'></p>
                        </div>
                    </div>
                    {/* created by */}
                    <div className="min_height_100EstimatePrint createdByEstimatePrint d-flex border-start border-end">
                        <div className="d-flex h-100 w-100">
                            <div className="position-relative border-end w-50"><p className='position-absolute bottom-0 w-100 text-center'>Created By</p></div>
                            <div className="position-relative w-50 border-end"><p className='position-absolute bottom-0 w-100  text-center'>Checked By</p></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>}
    </>
    )
}

export default EstimatePrint