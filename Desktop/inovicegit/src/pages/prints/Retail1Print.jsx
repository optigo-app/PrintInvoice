import React, { useEffect, useState } from 'react'
import { CapitalizeWords, NumberWithCommas, apiCall, fixedValues, handleImageError, handlePrint, isObjectEmpty, taxGenrator } from '../../GlobalFunctions';
import "../../assets/css/prints/retailPrint.css";
import Loader from '../../components/Loader';
import { ToWords } from 'to-words';
import { cloneDeep, find, findIndex } from 'lodash';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';

const Retail1Print = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [jsonData1, setJsonData1] = useState({});
    const [dataFill, setDataFill] = useState([]);
    const [total, setTotal] = useState({});
    const [rate, setRate] = useState(true);
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [taxes, setTaxes] = useState([]);
    const [finalD, setFinalD] = useState({});
    const [totalss, setTotalss] = useState({
        totalWt: 0,
    })
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
        total: getStyles("totalRetail1Print", "totalRetailPrint", true)
    });

    const toWords = new ToWords();
    const [isImageWorking, setIsImageWorking] = useState(true);
    const handleImageErrors = () => {
        setIsImageWorking(false);
    };
    const loadData = (data) => {
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
        let resultArray = [];
        let totalObj = {
            pcs: datas?.mainTotal?.diamonds?.Pcs + datas?.mainTotal?.colorstone?.Pcs + datas?.mainTotal?.misc?.Pcs,
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
        let totalWt = 0;
        datas?.resultArray?.forEach((e, i) => {
            let obj = cloneDeep(e);
            totalWt += (e?.NetWt - e?.totals?.finding?.Wt) + e?.totals?.diamonds?.Wt + e?.totals?.misc?.Wt;
            let netWtLossWt = 0;
            if (e?.metal?.length === 1) {
                netWtLossWt = e?.NetWt + e?.LossWt;
            } else {
                e?.metal?.forEach((ele, ind) => {
                    if (ele?.IsPrimaryMetal === 1) {
                        netWtLossWt += ele?.Wt;
                    }
                });
            }

            let diamonds = [];
            e?.diamonds?.forEach((ele, ind) => {
                // let findDiamond = diamonds?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName);
                if (diamonds?.length === 0) {
                    diamonds?.push(ele);
                } else {
                    diamonds[0].Wt += ele?.Wt;
                    diamonds[0].Pcs += ele?.Pcs;
                    diamonds[0].Amount += ele?.Amount;
                }
            });
            let colorstone = [];
            let isRateOnPcs = {
                Pcs: 0,
                Amount: 0
            }
            let isRateOnWt = {
                Wt: 0,
                Amount: 0
            }
            e?.colorstone?.forEach((ele, ind) => {
                if (ele?.isRateOnPcs === 0) {
                    isRateOnWt.Wt += ele?.Wt;
                    isRateOnWt.Amount += ele?.Amount;
                } else {
                    isRateOnPcs.Pcs += ele?.Pcs;
                    isRateOnPcs.Amount += ele?.Amount;
                }
                let findColorStones = colorstone?.findIndex((elem, index) => elem?.isRateOnPcs === ele?.isRateOnPcs);
                if (findColorStones === -1) {
                    colorstone?.push(ele);
                } else {
                    colorstone[findColorStones].Wt += ele?.Wt;
                    colorstone[findColorStones].Pcs += ele?.Pcs;
                    colorstone[findColorStones].Amount += ele?.Amount;
                }
            });
            if (isRateOnPcs?.Pcs !== 0) {
                totalWt += isRateOnPcs?.Amount / isRateOnPcs?.Pcs;
            }
            if (isRateOnWt?.Wt !== 0) {
                totalWt += isRateOnWt?.Amount / isRateOnWt?.Wt;
            }

            let misc = [];
            e?.misc?.forEach((ele, ind) => {
                // let findMiscs = misc?.findIndex((elem, index) => {
                //     // elem?.ShapeName === ele?.ShapeName && elem?.ISHSCODE === ele?.ISHSCODE);
                //     if(elem?.IsHSCOE === 0 && ele?.IsHSCOE === 0){
                //         if(elem?.ShapeName === ele?.ShapeName){
                //             return ind
                //         }else{
                //             return -1
                //         }
                //     }else{
                //         if(elem?.IsHSCOE === 3 && ele?.IsHSCOE === 3){
                //             return ind
                //         }else{
                //             return null
                //         }
                //     }
                // });
                let findMiscs = misc?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName && elem?.ISHSCODE === ele?.ISHSCODE);
                if (findMiscs === -1) {
                    misc?.push(ele);
                } else {
                    misc[findMiscs].Wt += ele?.Wt;
                    misc[findMiscs].Pcs += ele?.Pcs;
                    misc[findMiscs].Amount += ele?.Amount;
                }
            });
            let finding = [];
            e?.finding?.forEach((ele, ind) => {
                if (finding?.length === 0) {
                    finding?.push(ele);
                } else {
                    finding[0].Wt += ele?.Wt;
                    finding[0].Pcs += ele?.Pcs;
                    finding[0].Amount += ele?.Amount;
                }
            });

            obj.netWtLossWt = netWtLossWt;
            obj.diamonds = diamonds;
            obj.colorstone = colorstone;
            obj.misc = misc;
            obj.finding = finding;
            resultArray?.push(obj);
            // resultArray?.push(obj);
            // let findObj = resultArray?.findIndex((ele, ind) => ele?.GroupJob === e?.GroupJob && e?.GroupJob !== "");
            // if (findObj === -1) {
            //     console.log(obj);

            // } else {
            //     if (resultArray[findObj]?.GroupJob !== resultArray[findObj]?.SrJobno) {
            //         resultArray[findObj].DesignImage = obj?.DesignImage;
            //         resultArray[findObj].designno = obj?.designno;
            //         resultArray[findObj].SrJobno = resultArray[findObj].GroupJob;
            //         resultArray[findObj].metal[0].QualityName = obj?.metal[0]?.QualityName;
            //         resultArray[findObj].HUID = obj?.HUID;
            //     }
            //     resultArray[findObj].Tunch += obj?.Tunch;
            //     resultArray[findObj].grosswt += obj?.grosswt;
            //     resultArray[findObj].NetWt += obj?.NetWt;
            //     resultArray[findObj].LossWt += obj?.LossWt;
            //     resultArray[findObj].netWtLossWt += obj?.netWtLossWt;
            //     resultArray[findObj].TotalAmount += obj?.TotalAmount;
            //     resultArray[findObj].UnitCost += obj?.UnitCost;
            //     resultArray[findObj].OtherCharges += obj?.OtherCharges;
            //     resultArray[findObj].TotalDiamondHandling += obj?.TotalDiamondHandling;
            //     resultArray[findObj].diamonds.SettingAmount += obj?.diamonds?.SettingAmount;

            //     let allDiamonds = [...resultArray[findObj]?.diamonds, ...obj?.diamonds]?.flat();
            //     let diamondss = [];
            //     allDiamonds?.forEach((ele, ind) => {
            //         let findDiamonds = diamondss?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName);
            //         if (findDiamonds === -1) {
            //             diamondss?.push(ele);
            //         } else {
            //             diamondss[findDiamonds].Wt += ele?.Wt;
            //             diamondss[findDiamonds].Pcs += ele?.Pcs;
            //             diamondss[findDiamonds].Amount += ele?.Amount;
            //         }
            //     });

            //     let allColorStone = [...resultArray[findObj]?.colorstone, ...obj?.colorstone]?.flat();
            //     let colorStoness = [];
            //     allColorStone?.forEach((ele, ind) => {
            //         let findColorStoness = colorStoness?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName);
            //         if (findColorStoness === -1) {
            //             colorStoness?.push(ele);
            //         } else {
            //             colorStoness[findColorStoness].Wt += ele?.Wt;
            //             colorStoness[findColorStoness].Pcs += ele?.Pcs;
            //             colorStoness[findColorStoness].Amount += ele?.Amount;
            //         }
            //     });

            //     let allMiscs = [...resultArray[findObj]?.misc, ...obj?.misc]?.flat();
            //     let miscss = [];
            //     allMiscs?.forEach((ele, ind) => {
            //         let findmiscss = miscss?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName);
            //         if (findmiscss === -1) {
            //             miscss?.push(ele);
            //         } else {
            //             miscss[findmiscss].Wt += ele?.Wt;
            //             miscss[findmiscss].Pcs += ele?.Pcs;
            //             miscss[findmiscss].Amount += ele?.Amount;
            //         }
            //     });

            //     resultArray[findObj].diamonds = allDiamonds;
            //     resultArray[findObj].colorStone = allColorStone;
            //     resultArray[findObj].misc = allMiscs;
            // }
        });

        setTotalss({ ...totalss, totalWt: totalWt });

        datas.resultArray = resultArray;
        setFinalD(datas);

        setJsonData1(data?.BillPrint_Json[0]);

        let taxValue = taxGenrator(data?.BillPrint_Json[0], totalObj.totalAmount);
        setTaxes(taxValue);
        taxValue.forEach((e, i) => {
            totalObj.grandTotal += +(e?.amount);
        });
        totalObj.grandTotal += totalObj.totalAmount + totalObj.addLess;
        totalObj.totalAmount = (totalObj.totalAmount).toFixed(2);
        totalObj.textInNumbers = toWords.convert(totalObj.grandTotal);

        datas?.resultArray?.sort((a, b) => {
            let nameA = a?.designno?.toLowerCase() + a?.SrJobno?.toLowerCase();
            let nameB = b?.designno?.toLowerCase() + b?.SrJobno?.toLowerCase();
            if (nameA < nameB) {
                return -1; // 'a' should come before 'b' in the sorted array
            }
            if (nameA > nameB) {
                return 1; // 'b' should come before 'a' in the sorted array
            }
            return 0;
        });

        console.log(datas);
        setTotal(totalObj);
        setDataFill(datas);
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
                const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
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
                        <label className="form-check-label h6 mb-0 ratePara pt-1">
                            With Rate
                        </label>
                    </div>
                    <div className="printBtn_sec text-end position-absolute printBtnRetailPrint">
                        <input type="button" className="btn_white blue me-0" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* headline retail print */}
                <div className="px-1 no_break">
                    <div className='headlinepRetailPrint w-100 mt-4 px-2 fw-bold'>
                        {jsonData1?.PrintHeadLabel}
                    </div>
                </div>
                {/* company address */}
                <div className="mt-2 px-1 d-flex no_break">
                    <div className="col-6">
                        <h6 className='fw-bold'>{jsonData1?.CompanyFullName}</h6>
                        <p className='ft_12_retailPrint'>{jsonData1?.CompanyAddress}</p>
                        <p className='ft_12_retailPrint'>{jsonData1?.CompanyAddress2}</p>
                        <p className='ft_12_retailPrint'>{jsonData1?.CompanyCity} {jsonData1?.CompanyPinCode} {jsonData1?.CompanyState} {jsonData1?.CompanyCountry}</p>
                        <p className='ft_12_retailPrint'>T {jsonData1?.CompanyTellNo} | TOLL FREE {jsonData1?.CompanyTollFreeNo}</p>
                        <p className='ft_12_retailPrint'>{jsonData1?.CompanyEmail} | {jsonData1?.CompanyWebsite}</p>
                        <p className='ft_12_retailPrint'>{jsonData1?.Company_VAT_GST_No} | {jsonData1?.Cust_CST_STATE} - {jsonData1?.Company_CST_STATE_No} | PAN-{jsonData1?.Pannumber}</p>
                    </div>
                    <div className="col-6">
                        {/* <img src={jsonData1?.PrintLogo} alt="" className='retailPrintLogo d-block ms-auto' /> */}

                        {isImageWorking && (jsonData1?.PrintLogo !== "" &&
                            <img src={jsonData1?.PrintLogo} alt=""
                                className='retailPrintLogo d-block ms-auto'
                                onError={handleImageErrors} height={120} width={150} />)}
                    </div>
                </div>
                {/* bill to */}
                <div className="d-flex border mt-2 no_break">
                    <div className="col-4 p-1 border-end">
                        <p className='line_height_110 ft_12_retailPrint'>{jsonData1?.lblBillTo} </p>
                        <p className='fw-bold line_height_110'>{jsonData1?.customerfirmname}</p>
                        <p className='line_height_110 ft_12_retailPrint'>{jsonData1?.customerAddress1}</p>
                        <p className='line_height_110 ft_12_retailPrint'>{jsonData1?.customerAddress2}</p>
                        <p className='line_height_110 ft_12_retailPrint'>{jsonData1?.customercity}{jsonData1?.customerpincode}</p>
                        <p className='line_height_110 ft_12_retailPrint'>{jsonData1?.customeremail1}</p>
                        <p className='line_height_110 ft_12_retailPrint'>{jsonData1?.vat_cst_pan}</p>
                        <p className='line_height_110 ft_12_retailPrint'>{jsonData1?.Cust_CST_STATE} {jsonData1?.Cust_CST_STATE_No}</p>
                    </div>
                    <div className="col-4 p-1 border-end">
                        <p className='line_height_110 ft_12_retailPrint'>Ship To, </p>
                        <p className='fw-bold'>{jsonData1?.customerfirmname}</p>
                        <p className='line_height_110 ft_12_retailPrint'>{jsonData1?.CustName}</p>

                        {/* <p className=''>{jsonData1?.customerAddress2}</p> */}
                        <p className='line_height_110'>{jsonData1?.customercity}, {jsonData1?.State}</p>
                        <p className='line_height_110'>{jsonData1?.CompanyCountry}{jsonData1?.customerpincode}</p>
                        <p className='line_height_110'>Mobile No. : {jsonData1?.customermobileno1}</p>
                    </div>
                    <div className="col-4 p-1 position-relative">
                        <div className="d-flex">
                            <div className="col-3">
                                <p className='fw-bold ft_12_retailPrint'>BILL NO</p>
                                <p className='fw-bold ft_12_retailPrint'>DATE</p>
                                <p className='fw-bold ft_12_retailPrint'>HSN</p>
                            </div>
                            <div className="col-9">
                                <p className='ft_12_retailPrint'>{jsonData1?.InvoiceNo}</p>
                                <p className='ft_12_retailPrint'>{jsonData1?.EntryDate}</p>
                                <p className='ft_12_retailPrint'>{jsonData1?.HSN_No}</p>
                            </div>
                        </div>
                        <p className='mt-5 position-absolute bottom-0 pb-1 ratePara'>{rate && (jsonData1?.MetalRate24K && (jsonData1?.MetalRate24K).toFixed(2))}</p>
                    </div>
                </div>
                {/* table */}
                <div className="d-flex mt-1 border no_break ft_12_retailPrint">
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
                    <div className={`${styles?.total} d-flex justify-content-center align-items-center`}>
                        <p className='fw-bold'>Total</p>
                    </div>
                </div>
                {/* data */}
                {dataFill?.resultArray?.map((e, i) => {
                    return <div className="d-flex border-bottom border-start border-end no_break ft_12_retailPrint" key={i}>
                        <div className="srNoRetailPrint border-end p-1 d-flex justify-content-center align-items-center">
                            <p className='fw-bold'>{NumberWithCommas(i + 1, 0)}</p>
                        </div>
                        <div className="poductDiscriptionRetailPrint border-end p-1">
                            <p>{e?.SubCategoryname} {e?.Categoryname} </p>
                            {/* <p>{e?.designno} | {e?.SrJobno}</p> */}
                            <img src={e?.DesignImage} alt="" className='w-100 product_image_retailPrint' onError={handleImageError} />
                            {/* <p className='text-center fw-bold pt-1 ft_13_retailPrint'>Tunch: {NumberWithCommas(e?.Tunch, 3)}</p> */}
                            {/* {e?.HUID !== "" && <p className='text-center pt-1'>HUID- {e?.HUID}</p>} */}
                            <p className='text-center fw-bold pt-1'>{fixedValues(e?.grosswt, 3)}gm <span className='fw-normal'>Gross</span></p>
                        </div>
                        <div className="materialDescriptionRetailPrint border-end">
                            <div className="d-grid h-100">
                                {
                                    e?.metal?.map((ele, ind) => {
                                        return <div className={`d-flex border-bottom`} key={ind}>
                                            <div className={`${styles.Material} border-end p-1 d-flex align-items-center`}>
                                                <p>{ele?.IsPrimaryMetal === 1 && ele?.ShapeName}</p>
                                            </div>
                                            <div className={`${styles.Qty} border-end p-1 d-flex align-items-center`}>
                                                <p>{ele?.IsPrimaryMetal === 1 && ele?.QualityName}</p>
                                            </div>
                                            <div className={`${styles.Pcs} border-end p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'>{ }</p>
                                            </div>
                                            <div className={`${styles.Wt} border-end p-1 d-flex align-items-center justify-content-end`}>
                                                {/* <p className='text-end'>{NumberWithCommas(e?.netWtLossWt, 3)}</p> */}
                                                <p className='text-end'>{ind === 0 ? NumberWithCommas(e?.NetWt - e?.totals?.finding?.Wt, 3) : NumberWithCommas(ele?.Wt, 3)}</p>
                                            </div>
                                            {/* {e?.designno === "1942" && console.log(e)} */}
                                            <div className={`${pName === 'retail1 print' ? `rateRetailPrint1` : `rateRetailPrint border-end`} p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'>{NumberWithCommas(ele?.Rate / jsonData1?.CurrencyExchRate, 2)}</p>
                                            </div>
                                            {pName !== 'retail1 print' && <div className={`${styles.Amount} p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'>{NumberWithCommas(ele?.Amount / jsonData1?.CurrencyExchRate, 2)}</p>
                                            </div>}
                                        </div>
                                    })
                                }
                                {
                                    e?.diamonds?.map((ele, ind) => {
                                        return <div className={`d-flex border-bottom`} key={ind}>
                                            <div className={`${styles.Material} border-end p-1 d-flex align-items-center`}>
                                                <p>{ele?.MasterManagement_DiamondStoneTypeName}</p>
                                            </div>
                                            <div className={`${styles.Qty} border-end p-1 d-flex align-items-center`}>
                                                <p></p>
                                            </div>
                                            <div className={`${styles.Pcs} border-end p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'>{NumberWithCommas(ele?.Pcs, 0)}</p>
                                            </div>
                                            <div className={`${styles.Wt} border-end p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'>{NumberWithCommas(ele?.Wt, 3)}</p>
                                            </div>
                                            {rate && <div className={`${pName === 'retail1 print' ? `rateRetailPrint1` : `rateRetailPrint border-end`} p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'>{ele?.Wt !== 0 ? NumberWithCommas(((ele?.Amount / jsonData1?.CurrencyExchRate) / ele?.Wt), 2) : "0.00"}</p>
                                            </div>}
                                            {pName !== 'retail1 print' && <div className={`${styles.Amount} p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'>{NumberWithCommas(ele?.Amount / jsonData1?.CurrencyExchRate, 2)}</p>
                                            </div>}
                                        </div>
                                    })
                                }
                                {
                                    e?.colorstone?.map((ele, ind) => {
                                        return <div className={`d-flex border-bottom`} key={ind}>
                                            <div className={`${styles.Material} border-end p-1 d-flex align-items-center`}>
                                                <p>{ele?.MasterManagement_DiamondStoneTypeName}</p>
                                            </div>
                                            <div className={`${styles.Qty} border-end p-1 d-flex align-items-center`}>
                                                <p></p>
                                            </div>
                                            <div className={`${styles.Pcs} border-end p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'>{NumberWithCommas(ele?.Pcs, 0)}</p>
                                            </div>
                                            <div className={`${styles.Wt} border-end p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'>{NumberWithCommas(ele?.Wt, 3)}</p>
                                            </div>
                                            {rate && <div className={`${pName === 'retail1 print' ? `rateRetailPrint1` : `rateRetailPrint border-end`} p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'>{ele?.isRateOnPcs === 0 ?
                                                    (ele?.Wt !== 0 ? NumberWithCommas(ele?.Amount / (ele?.Wt * jsonData1?.CurrencyExchRate), 2) : "0.00") :
                                                    (ele?.Pcs !== 0 ? NumberWithCommas(ele?.Amount / (ele?.Pcs * jsonData1?.CurrencyExchRate), 2) : "0.00")}</p>
                                            </div>}
                                            {pName !== 'retail1 print' && <div className={`${styles.Amount} p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'>{NumberWithCommas((ele?.Amount / jsonData1?.CurrencyExchRate), 2)}</p>
                                            </div>}
                                        </div>
                                    })
                                }
                                {
                                    e?.misc?.map((ele, ind) => {
                                        return (ele?.Wt !== 0 || ele?.ServWt !== 0) && <div className={`d-flex border-bottom`} key={ind}>
                                            <div className={`${styles.Material} border-end p-1 d-flex align-items-center`}>
                                                <p>{ele?.MasterManagement_DiamondStoneTypeName}</p>
                                            </div>
                                            <div className={`${styles.Qty} border-end p-1 d-flex align-items-center`}>
                                                <p></p>
                                            </div>
                                            <div className={`${styles.Pcs} border-end p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'>{NumberWithCommas(ele?.Pcs, 0)}</p>
                                            </div>
                                            <div className={`${styles.Wt} border-end p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'>{ele?.IsHSCOE === 0 ? NumberWithCommas(ele?.Wt, 3) : NumberWithCommas(ele?.ServWt, 3)}</p>
                                            </div>
                                            {rate && <div className={`${pName === 'retail1 print' ? `rateRetailPrint1` : `rateRetailPrint border-end`} p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'>{ele?.Wt !== 0 ? NumberWithCommas((ele?.Amount / ele?.Wt), 2) : "0.00"}</p>
                                            </div>}
                                            {pName !== 'retail1 print' && <div className={`${styles.Amount} p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'>{NumberWithCommas((ele?.Amount / jsonData1?.CurrencyExchRate) / jsonData1?.CurrencyExchRate, 2)}</p>
                                            </div>}
                                        </div>
                                    })
                                }
                                {
                                    e?.finding?.map((ele, ind) => {
                                        return <div className={`d-flex border-bottom`} key={ind}>
                                            <div className={`${styles.Material} border-end p-1 d-flex align-items-center`}>
                                                <p></p>
                                            </div>
                                            <div className={`${styles.Qty} border-end p-1 d-flex align-items-center`}>
                                                <p></p>
                                            </div>
                                            <div className={`${styles.Pcs} border-end p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'>{NumberWithCommas(ele?.Pcs, 0)}</p>
                                            </div>
                                            <div className={`${styles.Wt} border-end p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'>{NumberWithCommas(ele?.Wt, 3)}</p>
                                            </div>
                                            {rate && <div className={`${pName === 'retail1 print' ? `rateRetailPrint1` : `rateRetailPrint border-end`} p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'></p>
                                            </div>}
                                            {pName !== 'retail1 print' && <div className={`${styles.Amount} p-1 d-flex align-items-center justify-content-end`}>
                                                <p className='text-end'></p>
                                            </div>}
                                        </div>
                                    })
                                }

                            </div>
                        </div>
                        <div className={`makingRetailPrint border-end p-1 d-flex ${pName === "retail print 1" ? `flex-column align-items-end justify-content-center` : `align-items-center justify-content-end `}`}>
                            <p className='text-end'>{NumberWithCommas(e?.MaKingCharge_Unit / jsonData1?.CurrencyExchRate, 2)}</p>
                            {/* <p className='text-end'>{NumberWithCommas(e?.MakingAmount + e?.SettingAmount, 2)}</p> */}

                        </div>
                        <div className="othersRetailPrint border-end p-1 d-flex align-items-center justify-content-end">
                            <p className='text-end'>{NumberWithCommas((e?.OtherCharges + e?.TotalDiamondHandling) / jsonData1?.CurrencyExchRate, 2)}</p>
                        </div>
                        <div className={`${styles?.total} p-1 d-flex align-items-center justify-content-end`}>
                            <p className='text-end'>{NumberWithCommas(e?.TotalAmount / jsonData1?.CurrencyExchRate, 2)}</p>
                        </div>
                    </div>
                })}
                {/* total */}
                <div className="d-flex border-bottom border-start border-end no_break">
                    <div className="srNoRetailPrint border-end p-1 d-flex justify-content-center align-items-center">
                    </div>
                    <div className="poductDiscriptionRetailPrint border-end p-1 d-flex align-items-center">
                        <p className="fw-bold ft_17_retailPrint">TOTAL</p>
                    </div>
                    <div className="materialDescriptionRetailPrint border-end">
                        <div className="d-flex">
                            <div className={`${styles.Material} border-end p-1 min_height_44_retail_print_1 ft_12_retailPrint`}>
                                <p className='fw-bold'></p>
                            </div>
                            <div className={`${styles.Qty} border-end p-1 min_height_44_retail_print_1 ft_12_retailPrint`}>
                                <p className='fw-bold'></p>
                            </div>
                            <div className={`${styles.Pcs} border-end p-1 text-end d-flex align-items-center justify-content-end min_height_44_retail_print_1 ft_12_retailPrint`}>
                                <p className='fw-bold text-end'>{NumberWithCommas(total?.pcs, 0)}</p>
                            </div>
                            <div className={`${styles.Wt} border-end p-1 d-flex align-items-end justify-content-around flex-column min_height_44_retail_print_1 ft_12_retailPrint`}>
                                <p className='fw-bold lh-1 text-end'>{fixedValues(totalss?.totalWt, 3)} </p>
                                {/* <p className='fw-bold lh-1 text-end'>{fixedValues(total?.goldWeight, 3)} gm</p> */}
                            </div>
                            {rate && <div className={`${pName === 'retail1 print' ? `rateRetailPrint1` : `rateRetailPrint border-end`} p-1 d-flex align-items-center justify-content-end min_height_44_retail_print_1 ft_12_retailPrint`}>
                                <p className='fw-bold text-end'>
                                    {/* {NumberWithCommas(total?.rate, 2)} */}
                                </p>
                            </div>}
                            {pName !== 'retail1 print' && <div className={`${styles.Amount} p-1 d-flex align-items-center justify-content-end min_height_44_retail_print_1 ft_12_retailPrint`}>
                                <p className='fw-bold text-end'>
                                    {/* {NumberWithCommas(total?.amount, 2)} */}
                                </p>
                            </div>}
                        </div>
                    </div>
                    <div className="makingRetailPrint border-end p-1 d-flex align-items-center justify-content-end ft_12_retailPrint">
                        <p className='fw-bold text-end'>
                            {/* {NumberWithCommas(total?.making, 2)} */}
                        </p>
                    </div>
                    <div className="othersRetailPrint border-end p-1 d-flex align-items-center justify-content-end ft_12_retailPrint">
                        <p className='fw-bold text-end'>{NumberWithCommas(dataFill?.mainTotal?.total_otherCharge_Diamond_Handling, 2)}</p>
                    </div>
                    <div className={`${styles?.total} p-1 d-flex align-items-center justify-content-end ft_12_retailPrint`}>
                        <p className='fw-bold text-end'>{NumberWithCommas(dataFill?.mainTotal?.total_amount, 2)}</p>
                    </div>
                </div>
                {/* grand total */}
                <div className="d-flex border-start border-end border-bottom no_break">
                    {/* <div className="totalInWordsRetailPrint p-1 d-flex flex-column align-items-start justify-content-end p-1 border-end"> */}
                    <div className="retail1PrintInWords p-1 d-flex flex-column align-items-start justify-content-end p-1 border-end">
                        <p className='ft_12_retailPrint'>In Words Indian Rupees</p>
                        <p className='fw-bold ft_12_retailPrint'>{toWords?.convert(+fixedValues(dataFill?.mainTotal?.total_amount + taxes?.reduce((acc, cObj) => acc + (+cObj?.amount * jsonData1?.CurrencyExchRate), 0) + jsonData1?.AddLess, 2))} Only</p>
                    </div>
                    {/* <div className="cgstRetailPrint p-1 text-end p-1 border-end"> */}
                    <div className="retail1PrintInNumbers py-1 text-end border-end ft_12_retailPrint">
                        {taxes.length > 0 && taxes.map((e, i) => {
                            return <p key={i} className='pb-1 px-1'>{e?.name} @ {e?.per}</p>
                        })}
                        {jsonData1?.AddLess !== 0 && <p className='ft_12_retailPrint px-1'>{jsonData1?.AddLess > 0 ? "Add" : "Less"}</p>}
                        <p className='fw-bold py-1 border-top ft_12_retailPrint px-1'>GRAND TOTAL</p>
                    </div>
                    {/* <div className="totalRetailPrint p-1 text-end p-1"> */}
                    <div className="retail1PrintInNumbers1 py-1 text-end ft_12_retailPrint">
                        {taxes.length > 0 && taxes.map((e, i) => {
                            return <p key={i} className='pb-1 px-1'>{NumberWithCommas(+e?.amount * jsonData1?.CurrencyExchRate, 2)}</p>
                        })}
                        {jsonData1?.AddLess !== 0 && <p className='ft_12_retailPrint px-1'>{NumberWithCommas(jsonData1?.AddLess, 2)}</p>}
                        <p className='fw-bold py-1 border-top ft_12_retailPrint px-1'><span dangerouslySetInnerHTML={{__html: jsonData1?.Currencysymbol}}></span>{NumberWithCommas(dataFill?.mainTotal?.total_amount + taxes?.reduce((acc, cObj) => acc + (+cObj?.amount * jsonData1?.CurrencyExchRate), 0) + jsonData1?.AddLess, 2)}</p>
                    </div>
                </div>
                {/* note */}
                <div className="note border-start border-end border-bottom p-1 pb-3 no_break">
                    <div dangerouslySetInnerHTML={{ __html: jsonData1?.Declaration }} className='pt-2'></div>
                </div>
                <div className='note border-start border-end border-bottom p-1 no_break'>
                    <p><span className="fw-bold">REMARKS : </span>{jsonData1?.PrintRemark}</p>
                </div>
                {/* bank detail */}
                <div className="word_break_normal_retail_print d-flex border-start border-end border-bottom no_break ft_12_retailPrint">
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

export default Retail1Print
