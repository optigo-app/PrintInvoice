import React, { useEffect, useState } from 'react';
import "../../assets/css/prints/miscPrint1.css";
import { apiCall, fixedValues, handleImageError, handlePrint, isObjectEmpty, NumberWithCommas, otherAmountDetail } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import style from "../../assets/css/prints/packingList1.module.css";

const PackingList1 = ({ urls, token, invoiceNo, printName, evn }) => {

    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [json0Data, setJson0Data] = useState({});
    const [data, setData] = useState([]);

    const loadData = (data) => {
        // console.log(data);
        let exchangerate = data?.BillPrint_Json[0]?.CurrencyExchRate;
        setJson0Data(data?.BillPrint_Json[0]);
        let newArr = [];
        let metalArr = [];
        data?.BillPrint_Json1.forEach((e, i) => {
            let obj = { ...e };
            let object = {
                groupjob: e?.GroupJob,
                netwt: e?.NetWt,
                grosswt: e?.grosswt,
                rate: 0,
                amount: 0
            }
            let otherTotal = [];
            let diamonds = [];
            let colors = [];
            let metals = [];
            let metalRate = 0;
            let metalAmount = 0;
            let otherCharge = otherAmountDetail(e?.OtherAmtDetail);
            let rowWiseDiamondTotal = {
                Wt: 0,
                Pcs: 0,
                Amount: 0,
            }
            let rowWiseColorStoneTotal = {
                Wt: 0,
                Pcs: 0,
                Amount: 0,
            }
            let rowWiseMetalTotal = {
                grossWt: e?.grosswt,
                NetWt: e?.NetWt,
                Amount: 0,
            }
            data?.BillPrint_Json2.forEach((ele, ind) => {
              if(ele?.StockBarcode === e?.SrJobno){
                if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
                    if (ele?.IsCenterStone === 1) {
                        ele.MasterManagement_DiamondStoneTypeName = "CENTER STONE";
                    }
                    diamonds.push(ele);
                    rowWiseDiamondTotal.Wt += ele?.Wt;
                    rowWiseDiamondTotal.Pcs += ele?.Pcs;
                    rowWiseDiamondTotal.Amount += ele?.Amount;
                } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
                    colors.push(ele);
                    rowWiseColorStoneTotal.Wt += ele?.Wt;
                    rowWiseColorStoneTotal.Pcs += ele?.Pcs;
                    rowWiseColorStoneTotal.Amount += ele?.Amount;
                } else if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                    metals.push(ele);
                    metalRate += ele?.Rate;
                    object.rate += ele?.Rate;
                    object.amount += ele?.Amount;
                    metalAmount += ele?.Amount;
                    rowWiseMetalTotal.Amount += ele?.Amount;
                }
              }
            });
            obj.metalRate = metalRate;
            obj.metalAmount = metalAmount;
            obj.diamonds = diamonds;
            obj.colors = colors;
            obj.metals = metals;
            obj.otherTotal = otherTotal;
            obj.otherCharge = otherCharge;
            obj.rowWiseDiamondTotal = rowWiseDiamondTotal;
            obj.rowWiseColorStoneTotal = rowWiseColorStoneTotal;
            obj.rowWiseMetalTotal = rowWiseMetalTotal;
            newArr.push(obj);
            if (e?.GroupJob !== "") {
                let findRecord = metalArr.findIndex(elem => elem.groupjob === e?.GroupJob);
                if (findRecord === -1) {
                    metalArr.push(object);
                } else {
                    metalArr[findRecord].netwt += object.netwt;
                    metalArr[findRecord].rate += object.rate;
                    metalArr[findRecord].amount += object.amount;
                    metalArr[findRecord].grosswt += object.grosswt;
                }
            }
        });

        let finalArr = [];
        newArr.forEach((e, i) => {
            let findRecord = finalArr.findIndex((ele, ind) => ele?.GroupJob === e?.GroupJob && e?.GroupJob !== "");
            let obj = { ...e };
            if (findRecord === -1) {
                obj.goldPrice = obj.metalRate;
                let obbj = {
                    kt: obj.MetalTypePurity,
                    grwt: obj.grosswt,
                    netwt: obj.NetWt,
                    rate: obj.goldPrice,
                    amount: obj.metalAmount
                }
                obj.metals.forEach((e, i) => {
                    e.kt = obj.MetalTypePurity;
                    e.grwt = obj.grosswt;
                    e.netwt = obj.NetWt;
                })
                obj.otherTotal = obj.otherCharge;
                finalArr.push(obj);
            } else {
                let obbj = {
                    kt: "",
                    grwt: 0,
                    netwt: 0,
                    rate: 0,
                    amount: 0
                }
                if (finalArr[findRecord]?.GroupJob !== finalArr[findRecord]?.SrJobno) {
                    finalArr[findRecord].JewelCodePrefix = obj?.JewelCodePrefix;
                    finalArr[findRecord].designno = obj?.designno;
                    finalArr[findRecord].SrJobno = obj?.SrJobno;
                    finalArr[findRecord].DesignImage = obj?.DesignImage;
                    finalArr[findRecord].MetalTypePurity = obj?.MetalTypePurity;
                    obbj.kt = finalArr[findRecord].MetalTypePurity;
                } else {
                    obbj.kt = obj.MetalTypePurity;
                }
                let rowWiseDiamondTotal = {
                    Wt: 0,
                    Pcs: 0,
                    Amount: 0,
                }
                let rowWiseColorStoneTotal = {
                    Wt: 0,
                    Pcs: 0,
                    Amount: 0,
                }
                let rowWiseMetalTotal = {
                    grossWt: 0,
                    NetWt: 0,
                    Amount: 0,
                }
                // metal logic
                let findMetalDetails = metalArr.findIndex((elem, indd) => elem.groupjob === finalArr[findRecord]?.GroupJob);
                if (findMetalDetails !== 1) {
                    obbj.grwt = metalArr[findMetalDetails].grosswt;
                    obbj.netwt = metalArr[findMetalDetails].netwt;
                    obbj.rate = (metalArr[findMetalDetails].amount) / (obbj.netwt * exchangerate);
                    obbj.amount = metalArr[findMetalDetails].amount;
                }
                rowWiseMetalTotal.grossWt = obbj.grwt;
                rowWiseMetalTotal.NetWt = obbj.netwt;
                rowWiseMetalTotal.Amount = obbj.amount;
                let metals = [finalArr[findRecord].metals, obj.metals].flat();
                let blankMetals = [];
                metals.forEach((ele, ind) => {
                    let findRec = blankMetals.findIndex(elem => elem?.ShapeName === ele?.ShapeName && elem?.Colorname === ele?.Colorname &&
                        elem?.QualityName === ele?.QualityName && elem?.Rate === ele?.Rate);
                    if (findRec === -1) {
                        blankMetals.push(ele)
                    } else {
                        blankMetals[findRec].amount += ele?.Amount;
                    }
                });
                blankMetals.forEach((ell, inn) => {
                    ell.kt = obbj.kt;
                    ell.grwt = obbj.grwt;
                    ell.netwt = obbj.netwt;
                    ell.Rate = obbj.rate;
                });
                finalArr[findRecord].metals = blankMetals;

                // diamond logic
                let diamonds = [finalArr[findRecord].diamonds, obj.diamonds].flat();
                let blankDiamonds = [];
                diamonds.forEach((el, indd) => {
                    let findRec = blankDiamonds.findIndex(ele => ele?.ShapeName === el?.ShapeName && ele?.Colorname === el?.Colorname &&
                        ele?.QualityName === el?.QualityName && ele?.Rate === el?.Rate && el?.SizeName === ele?.SizeName);
                    if (findRec === -1) {
                        blankDiamonds.push(el)
                    } else {
                        blankDiamonds[findRec].Amount += el?.Amount;
                        blankDiamonds[findRec].Wt += el?.Wt;
                        blankDiamonds[findRec].Pcs += el?.Pcs;
                        blankDiamonds[findRec].Rate = (blankDiamonds[findRec].Rate + el?.Rate) / 2;
                    }
                    rowWiseDiamondTotal.Wt = el?.Wt;
                    rowWiseDiamondTotal.Pcs = el?.Pcs;
                    rowWiseDiamondTotal.Amount = el?.Amount;
                });
                finalArr[findRecord].diamonds = blankDiamonds;

                // colorstone logic
                let colorStones = [finalArr[findRecord].colors, obj.colors].flat();
                let blankColorstones = [];
                colorStones.forEach((el, indd) => {
                    let findRec = blankColorstones.findIndex(ele => ele?.ShapeName === el?.ShapeName && ele?.Colorname === el?.Colorname &&
                        ele?.QualityName === el?.QualityName && ele?.Rate === el?.Rate && el?.SizeName === ele?.SizeName);
                    if (findRec === -1) {
                        blankColorstones.push(el)
                    } else {
                        blankColorstones[findRec].Amount += el?.Amount;
                        blankColorstones[findRec].Wt += el?.Wt;
                        blankColorstones[findRec].Pcs += el?.Pcs;
                        blankColorstones[findRec].Rate = (blankColorstones[findRec].Rate + el?.Rate) / 2;
                    }
                    rowWiseColorStoneTotal.Wt = el?.Wt;
                    rowWiseColorStoneTotal.Pcs = el?.Pcs;
                    rowWiseColorStoneTotal.Amount = el?.Amount;
                });
                finalArr[findRecord].colors = blankColorstones;

                // other charges logic
                let otherTotal = [finalArr[findRecord]?.otherCharge, obj?.otherCharge].flat();
                let blankOtherTotal = [];
                otherTotal.forEach((el, indd) => {
                    let findRec = blankOtherTotal.findIndex(ell => ell?.label === el?.label);
                    if (findRec === -1) {
                        blankOtherTotal.push(el);
                    } else {
                        blankOtherTotal[findRec].value = +blankOtherTotal[findRec]?.value + +el?.value;
                    }
                });
                finalArr[findRecord].otherTotal = blankOtherTotal;

                // rowwise total logic
                finalArr[findRecord].rowWiseDiamondTotal = rowWiseDiamondTotal;
                finalArr[findRecord].rowWiseColorStoneTotal = rowWiseColorStoneTotal;
                finalArr[findRecord].rowWiseMetalTotal = rowWiseMetalTotal;
            }
        });
        finalArr.sort((a, b) => {
            let nameA = a?.SrJobno.toUpperCase();
            let nameB = b?.SrJobno.toUpperCase();
            if(nameA > nameB){
                return 1
            }else if(nameA < nameB){
                return -1
            }else{
                return a-b
            }
        })
        setData(finalArr);
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
        <>{loader ? <Loader /> : msg === "" ? <>
            <div className={`container max_width_container pad_60_allPrint ${style?.container}`}>
                {/* print Button */}
                <div className="printBtn_sec text-end  pt-4 ">
                    <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                </div>
                {/* Print Logo */}
                <div className="pt-2">
                    <img src={json0Data?.PrintLogo} alt="" className={`${style?.img} d-block mx-auto`} />
                    <p className="text-center pt-1">    {json0Data?.CompanyAddress} {json0Data?.CompanyAddress2}{" "}
                        {json0Data?.CompanyCity} - {json0Data?.CompanyPinCode}</p>
                </div>
                {/* Party */}
                <div className="pt-4 d-flex justify-content-between aling-items-between">
                    <div className='col-6'>
                        <p><span className="fw-bold">Party:</span> {json0Data?.customerfirmname}</p>
                    </div>
                    <div className='text-end col-4'>
                        <div className='d-flex justify-content-end'>
                            <p className='col-4'>Invoice No :</p>
                            <p className='col-6 text-end fw-bold'>{json0Data?.InvoiceNo}</p>
                        </div>
                        <div className='d-flex justify-content-end'>
                            <p className='col-4'>Date :</p>
                            <p className='col-6 text-end fw-bold'>{json0Data?.EntryDate}</p>
                        </div>
                    </div>
                </div>
                {/* Table Header */}
                <div className="d-flex border lightGrey">
                    <div className={`${style?.pad_1} fw-bold ${style?.srNo} border-end`}>
                        <div className="d-grid h-100">
                            <p className='d-flex justify-content-center align-items-center'>Sr. No.</p>
                        </div>
                    </div>
                    <div className={`${style?.pad_1} fw-bold ${style?.design} border-end`}>
                        <div className="d-grid h-100">
                            <p className='d-flex justify-content-center align-items-center'>Jewelcode</p>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.diamond} border-end d-flex flex-wrap`}>
                        <div className="d-grid h-100 w-100">
                            <p className="d-flex w-100 fw-bold justify-content-center">Diamond</p>
                            <div className="d-flex w-100 border-top">
                                <p className={`col-2 text-center border-end`}>Shape</p>
                                <p className={`col-2 text-center border-end`}>Size</p>
                                <p className={`col-2 text-center border-end`}>Wt</p>
                                <p className={`col-2 text-center border-end`}>Pcs</p>
                                <p className={`col-2 text-center border-end`}>Rate</p>
                                <p className={`col-2 text-center`}>Amount</p>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.metal} border-end`}>
                        <div className="d-grid h-100 w-100">
                            <p className="d-flex w-100 fw-bold justify-content-center">Metal</p>
                            <div className="d-flex w-100 border-top">
                                <p className={`${style?.wid_20} text-center border-end`}>Kt</p>
                                <p className={`${style?.wid_20} text-center border-end`}>Gr Wt</p>
                                <p className={`${style?.wid_20} text-center border-end`}>Net Wt</p>
                                <p className={`${style?.wid_20} text-center border-end`}>Rate</p>
                                <p className={`${style?.wid_20} text-center`}>Amount</p>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.stone} border-end`}>
                        <div className="d-grid h-100 w-100">
                            <p className="d-flex w-100 fw-bold justify-content-center">Stone</p>
                            <div className="d-flex w-100 border-top">
                                <p className={`${style?.wid_20} text-center border-end`}>Shape</p>
                                <p className={`${style?.wid_20} text-center border-end`}>Wt</p>
                                <p className={`${style?.wid_20} text-center border-end`}>Pcs</p>
                                <p className={`${style?.wid_20} text-center border-end`}>Rate</p>
                                <p className={`${style?.wid_20} text-center`}>Amount</p>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.labour} border-end`}>
                        <div className="d-grid h-100 w-100">
                            <p className="d-flex w-100 fw-bold justify-content-center">Labour</p>
                            <div className="d-flex w-100 border-top">
                                <p className={`${style?.pad_1} col-6 text-center border-end`}>Rate</p>
                                <p className={`${style?.pad_1} col-6 text-center`}>Amount</p>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.other} border-end`}>
                        <div className="d-grid h-100 w-100">
                            <p className="d-flex w-100 fw-bold justify-content-center">Other</p>
                            <div className="d-flex w-100 border-top">
                                <p className={`${style?.pad_1} col-6 text-center border-end`}>Code</p>
                                <p className={`${style?.pad_1} col-6 text-center`}>Amount</p>
                            </div>
                        </div>
                    </div>
                    <div className={`${style?.pad_1} fw-bold ${style?.price}`}>
                        <div className="d-grid h-100">
                            <p className='d-flex justify-content-center align-items-center'>Price</p>
                        </div>
                    </div>
                </div>
                {/* Table Data */}
                {/* <div className="d-flex border-start border-end border-bottom">
                    <div className={`${style?.pad_1} fw-bold ${style?.srNo} border-end text-center`}>
                        <p>1</p>
                    </div>
                    <div className={`${style?.pad_1} fw-bold ${style?.design} border-end`}>
                        <div className="d-grid h-100">
                            <p className='d-flex justify-content-center align-items-center'>AJWC15654</p>
                            <img src="http://zen/lib/jo/28/images/default.jpg" alt="" className={`w-100 ${style?.img} pb-1`} />
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.diamond} border-end d-flex flex-wrap`}>
                        <div className="d-flex w-100 ">
                            <div className={`col-2 border-end pb-3 position-relative h-100`}>
                                <p>RND</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                            <div className={`col-2 text-end border-end pb-3 position-relative h-100`}>
                                <p>1.31</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                            <div className={`col-2 text-end border-end pb-3 position-relative h-100`}>
                                <p>0.140</p>
                                <p className={`position-absolute w-100 border-top  bottom-0 ${style?.min_height}`}>0.140</p>
                            </div>
                            <div className={`col-2 text-end border-end pb-3 position-relative h-100`}>
                                <p>1</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}>1</p>
                            </div>
                            <div className={`col-2 text-end border-end pb-3 position-relative h-100`}>
                                <p>0.00</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                            <div className={`col-2 text-end pb-3 position-relative h-100`}>
                                <p>0.00</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.metal} border-end d-flex flex-wrap`}>
                        <div className="d-flex w-100">
                            <div className={`${style?.wid_20} border-end position-relative h-100 pb-3`}>
                                <p>GOLD 18K</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                            <div className={`${style?.wid_20} text-end border-end position-relative h-100`}>
                                <p>5.028</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                            <div className={`${style?.wid_20} text-end border-end position-relative h-100`}>
                                <p>5.000</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                            <div className={`${style?.wid_20} text-end border-end position-relative h-100`}>
                                <p>456.00</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                            <div className={`${style?.wid_20} text-end position-relative h-100`}>
                                <p>2,280.0</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.stone} border-end d-flex flex-wrap`}>
                        <div className="d-flex w-100">
                            <div className={`${style?.wid_20} border-end position-relative h-100 pb-3`}>
                                <p>RND</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                            <div className={`${style?.wid_20} text-end border-end position-relative h-100 pb-3`}>
                                <p>0.140</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                            <div className={`${style?.wid_20} text-end border-end position-relative h-100 pb-3`}>
                                <p>1</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                            <div className={`${style?.wid_20} text-end border-end position-relative h-100 pb-3`}>
                                <p>0.00</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                            <div className={`${style?.wid_20} text-end position-relative h-100 pb-3`}>
                                <p>0.00</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.labour} border-end d-flex flex-wrap`}>
                        <div className="d-flex w-100">
                            <div className={`${style?.pad_1} col-6 text-end border-end position-relative h-100 pb-3`}>
                                <p>1,000.00</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                            <div className={`${style?.pad_1} col-6 text-end position-relative h-100 pb-3`}>
                                <p>5,000.00</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.other} border-end d-flex flex-wrap`}>
                        <div className="d-flex w-100">
                            <div className={`${style?.pad_1} col-6 border-end position-relative h-100 pb-3`}>
                                <p>Certification Charge</p>
                                <p>Hall Mark</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                            <div className={`${style?.pad_1} col-6 text-end position-relative h-100 pb-3`}>
                                <p>200</p>
                                <p>200</p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                        </div>
                    </div>
                    <div className={`${style?.pad_1} fw-bold ${style?.price} d-flex flex-wrap`}>
                        <div className="d-flex w-100">
                            <div className={`${style?.pad_1} position-relative h-100 pb-3 text-end w-100`}>
                                <p>7,680.00 </p>
                                <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                            </div>
                        </div>

                    </div>
                </div> */}
                {data.length > 0 && data?.map((e, i) => {
                    return <div className="d-flex border-start border-end border-bottom" key={i}>
                        <div className={`${style?.pad_1} fw-bold ${style?.srNo} border-end text-center`}>
                            <p>{NumberWithCommas(i + 1, 0)}</p>
                        </div>
                        <div className={`${style?.pad_1} fw-bold ${style?.design} border-end`}>
                            <div className="d-grid h-100">
                                <p className='d-flex justify-content-center align-items-center'>{e?.JewelCodePrefix}{e?.designno}{e?.SrJobno}</p>
                                <img src={e?.DesignImage} alt="" className={`w-100 ${style?.img} pb-1`} onError={handleImageError} />
                            </div>
                        </div>
                        <div className={` fw-bold ${style?.diamond} border-end d-flex flex-wrap`}>
                            <div className="d-flex w-100 ">
                                <div className={`col-2 border-end pb-3 position-relative h-100`}>
                                    {e?.diamonds.map((el, indd) => {
                                        return <p key={indd}>{el?.ShapeName}</p>
                                    })}
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                                </div>
                                <div className={`col-2 border-end pb-3 position-relative h-100`}>
                                    {e?.diamonds.map((el, indd) => {
                                        return <p key={indd}>{el?.SizeName}</p>
                                    })}
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                                </div>
                                <div className={`col-2 text-end border-end pb-3 position-relative h-100`}>
                                    {e?.diamonds.map((el, indd) => {
                                        return <p key={indd}>{NumberWithCommas(el?.Wt, 3)}</p>
                                    })}
                                    <p className={`position-absolute w-100 border-top  bottom-0 ${style?.min_height}`}>{NumberWithCommas(e?.rowWiseDiamondTotal.Wt, 3)}</p>
                                </div>
                                <div className={`col-2 text-end border-end pb-3 position-relative h-100`}>
                                    {e?.diamonds.map((el, indd) => {
                                        return <p key={indd}>{NumberWithCommas(el?.Pcs, 0)}</p>
                                    })}
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}>{NumberWithCommas(e?.rowWiseDiamondTotal.Pcs, 0)}</p>
                                </div>
                                <div className={`col-2 text-end border-end pb-3 position-relative h-100`}>
                                    {e?.diamonds.map((el, indd) => {
                                        return <p key={indd}>{NumberWithCommas(el?.Rate, 2)}</p>
                                    })}
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                                </div>
                                <div className={`col-2 text-end pb-3 position-relative h-100`}>
                                    {e?.diamonds.map((el, indd) => {
                                        return <p key={indd}>{NumberWithCommas(el?.Amount, 2)}</p>
                                    })}
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}>{NumberWithCommas(e?.rowWiseDiamondTotal.Amount, 3)}</p>
                                </div>
                            </div>
                        </div>
                        <div className={` fw-bold ${style?.metal} border-end d-flex flex-wrap`}>
                            <div className="d-flex w-100">
                                <div className={`${style?.wid_20} border-end position-relative h-100 pb-3`}>
                                    {e?.metals.map((el, indd) => {
                                        return <p key={indd}>{indd === 0 && el?.kt}</p>
                                    })}
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                                </div>
                                <div className={`${style?.wid_20} text-end border-end position-relative h-100`}>
                                    {e?.metals.map((el, indd) => {
                                        return <p key={indd}>{indd === 0 && NumberWithCommas(el?.grwt, 3)}</p>
                                    })}
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}>{NumberWithCommas(e?.rowWiseMetalTotal.grossWt, 3)}</p>
                                </div>
                                <div className={`${style?.wid_20} text-end border-end position-relative h-100`}>
                                    {e?.metals.map((el, indd) => {
                                        return <p key={indd}>{indd === 0 && NumberWithCommas(el?.netwt, 3)}</p>
                                    })}
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}>{NumberWithCommas(e?.rowWiseMetalTotal.NetWt, 3)}</p>
                                </div>
                                <div className={`${style?.wid_20} text-end border-end position-relative h-100`}>
                                    {e?.metals.map((el, indd) => {
                                        return <p key={indd}>{indd === 0 && NumberWithCommas(el?.Rate, 2)}</p>
                                    })}
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                                </div>
                                <div className={`${style?.wid_20} text-end position-relative h-100`}>
                                    {e?.metals.map((el, indd) => {
                                        return <p key={indd}>{indd === 0 && NumberWithCommas(el?.Amount, 2)}</p>
                                    })}
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}>{NumberWithCommas(e?.rowWiseMetalTotal.Amount, 2)}</p>
                                </div>
                            </div>
                        </div>
                        <div className={` fw-bold ${style?.stone} border-end d-flex flex-wrap`}>
                            <div className="d-flex w-100">
                                <div className={`${style?.wid_20} border-end position-relative h-100 pb-3`}>
                                    {e?.colors.map((el, indd) => {
                                        return <p key={indd}>{el?.ShapeName}</p>
                                    })}
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                                </div>
                                <div className={`${style?.wid_20} text-end border-end position-relative h-100 pb-3`}>
                                    {e?.colors.map((el, indd) => {
                                        return <p key={indd}>{NumberWithCommas(el?.Wt, 3)}</p>
                                    })}
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}>{NumberWithCommas(e?.rowWiseColorStoneTotal.Wt, 3)}</p>
                                </div>
                                <div className={`${style?.wid_20} text-end border-end position-relative h-100 pb-3`}>
                                    {e?.colors.map((el, indd) => {
                                        return <p key={indd}>{NumberWithCommas(el?.Pcs, 0)}</p>
                                    })}
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}>{NumberWithCommas(e?.rowWiseColorStoneTotal.Pcs, 0)}</p>
                                </div>
                                <div className={`${style?.wid_20} text-end border-end position-relative h-100 pb-3`}>
                                    {e?.colors.map((el, indd) => {
                                        return <p key={indd}>{NumberWithCommas(el?.Rate, 2)}</p>
                                    })}
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                                </div>
                                <div className={`${style?.wid_20} text-end position-relative h-100 pb-3`}>
                                    {e?.colors.map((el, indd) => {
                                        return <p key={indd}>{NumberWithCommas(el?.Amount, 2)}</p>
                                    })}
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}>{NumberWithCommas(e?.rowWiseColorStoneTotal.Amount, 3)}</p>
                                </div>
                            </div>
                        </div>
                        <div className={` fw-bold ${style?.labour} border-end d-flex flex-wrap`}>
                            <div className="d-flex w-100">
                                <div className={`${style?.pad_1} col-6 text-end border-end position-relative h-100 pb-3`}>
                                    <p>1,000.00</p>
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                                </div>
                                <div className={`${style?.pad_1} col-6 text-end position-relative h-100 pb-3`}>
                                    <p>5,000.00</p>
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                                </div>
                            </div>
                        </div>
                        <div className={` fw-bold ${style?.other} border-end d-flex flex-wrap`}>
                            <div className="d-flex w-100">
                                <div className={`${style?.pad_1} col-6 border-end position-relative h-100 pb-3`}>
                                    <p>Certification Charge</p>
                                    <p>Hall Mark</p>
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                                </div>
                                <div className={`${style?.pad_1} col-6 text-end position-relative h-100 pb-3`}>
                                    <p>200</p>
                                    <p>200</p>
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                                </div>
                            </div>
                        </div>
                        <div className={`${style?.pad_1} fw-bold ${style?.price} d-flex flex-wrap`}>
                            <div className="d-flex w-100">
                                <div className={`${style?.pad_1} position-relative h-100 pb-3 text-end w-100`}>
                                    <p>7,680.00 </p>
                                    <p className={`position-absolute w-100 border-top bottom-0 ${style?.min_height}`}></p>
                                </div>
                            </div>

                        </div>
                    </div>
                })}
                {/* Total */}
                <div className="d-flex border-start border-end border-bottom">
                    <div className={`${style?.pad_1} fw-bold ${style?.total} text-center border-end`}>
                        <p className='fw-bold'>TOTAL</p>
                    </div>
                    <div className={` fw-bold ${style?.diamond} border-end d-flex flex-wrap`}>
                        <div className="d-flex w-100 ">
                            <div className={`col-2 border-end`}>
                                <p></p>
                            </div>
                            <div className={`col-2 text-end border-end`}>
                                <p></p>
                            </div>
                            <div className={`col-2 text-end border-end`}>
                                <p>0.140</p>
                            </div>
                            <div className={`col-2 text-end border-end`}>
                                <p>1</p>
                            </div>
                            <div className={`col-2 text-end border-end`}>
                                <p></p>
                            </div>
                            <div className={`col-2 text-end`}>
                                <p></p>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.metal} border-end d-flex flex-wrap`}>
                        <div className="d-flex w-100">
                            <div className={`${style?.wid_20} border-end`}>
                                <p></p>
                            </div>
                            <div className={`${style?.wid_20} text-end border-end`}>
                                <p>5.028</p>
                            </div>
                            <div className={`${style?.wid_20} text-end border-end`}>
                                <p>5.000</p>
                            </div>
                            <div className={`${style?.wid_20} text-end border-end`}>
                                <p></p>
                            </div>
                            <div className={`${style?.wid_20} text-end`}>
                                <p>2,280.0</p>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.stone} border-end d-flex flex-wrap`}>
                        <div className="d-flex w-100">
                            <div className={`${style?.wid_20} border-end`}>
                                <p></p>
                            </div>
                            <div className={`${style?.wid_20} text-end border-end`}>
                                <p>0.140</p>
                            </div>
                            <div className={`${style?.wid_20} text-end border-end`}>
                                <p>1</p>
                            </div>
                            <div className={`${style?.wid_20} text-end border-end`}>
                                <p></p>
                            </div>
                            <div className={`${style?.wid_20} text-end`}>
                                <p>0.00</p>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.labour} border-end d-flex flex-wrap`}>
                        <div className="d-flex w-100">
                            <div className={`${style?.pad_1} col-6 text-end border-end`}>
                                <p></p>
                            </div>
                            <div className={`${style?.pad_1} col-6 text-end`}>
                                <p>5,000.00</p>
                            </div>
                        </div>
                    </div>
                    <div className={` fw-bold ${style?.other} border-end d-flex flex-wrap`}>
                        <div className="d-flex w-100">
                            <div className={`${style?.pad_1} col-6 border-end`}>
                                <p></p>
                            </div>
                            <div className={`${style?.pad_1} col-6 text-end`}>
                                <p>200</p>
                            </div>
                        </div>
                    </div>
                    <div className={`${style?.pad_1} fw-bold ${style?.price} d-flex flex-wrap`}>
                        <div className="d-flex w-100">
                            <div className={`${style?.pad_1} text-end w-100`}>
                                <p>7,680.00 </p>
                            </div>
                        </div>

                    </div>
                </div>
                {/* Tax */}
                <div className="d-flex border-start border-end border-bottom">
                    <div className={`${style?.pad_1} fw-bold ${style?.discount} text-end border-end`}>
                        <p className='fw-bold'>Total Discount</p>
                        <p className='fw-bold'>TCGST @ 0.13%</p>
                        <p className='fw-bold'>TSGST @ 0.13%</p>
                        <p className='fw-bold'>TAdd	0.00</p>
                        <p className='fw-bold'>TGrand Total	</p>
                    </div>
                    <div className={`${style?.pad_1} fw-bold ${style?.price} d-flex flex-wrap`}>
                        <div className="d-flex w-100">
                            <div className={`${style?.pad_1} text-end w-100`}>
                                <p>0.00 </p>
                                <p>0.00</p>
                                <p>9.98</p>
                                <p>9.98</p>
                                <p>7,699.96</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}</>
    )
}

export default PackingList1