import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
    apiCall,
    checkMsg,
    fixedValues,
    formatAmount,
    handleImageError,
    handlePrint,
    isObjectEmpty,
    NumberWithCommas,
} from "../../GlobalFunctions";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import "../../assets/css/prints/packinglist7.css";
import Loader from "../../components/Loader";
import { cloneDeep } from "lodash";
import { MetalShapeNameWiseArr } from "../../GlobalFunctions/MetalShapeNameWiseArr";
import { ToWords } from 'to-words';

function RepairJobPrint({ token, invoiceNo, printName, urls, evn, ApiVer }) {
    const [result, setResult] = useState(null);
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const [diamondWise, setDiamondWise] = useState([]);
    const [imgFlag, setImgFlag] = useState(true);
    const [imgFlag2, setImgFlag2] = useState(true);
    const [isImageWorking, setIsImageWorking] = useState(true);
    const evname = atob(evn);
    const [MetShpWise, setMetShpWise] = useState([]);
    const [notGoldMetalTotal, setNotGoldMetalTotal] = useState(0);
    const [notGoldMetalWtTotal, setNotGoldMetalWtTotal] = useState(0);
    const [diamondDetails, setDiamondDetails] = useState([]);
        const toWords = new ToWords();


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
        // console.log("data", data);

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
        met_shp_arr?.forEach((e) => {
            tot_met += e?.Amount;
            tot_met_wt += e?.metalfinewt;
        });
        setNotGoldMetalTotal(tot_met);
        setNotGoldMetalWtTotal(tot_met_wt);

        //grouping of jobs and isGroupJob is 1

        let finalArr = [];
        datas?.resultArray?.forEach((a) => {
            if (a?.GroupJob === "") {
                finalArr.push(a);
            } else {
                let b = cloneDeep(a);
                let find_record = finalArr.findIndex(
                    (el) => el?.GroupJob === b?.GroupJob
                );
                if (find_record === -1) {
                    finalArr.push(b);
                } else {
                    if (
                        finalArr[find_record]?.GroupJob !== finalArr[find_record]?.SrJobno
                    ) {
                        finalArr[find_record].designno = b?.designno;
                        finalArr[find_record].HUID = b?.HUID;
                        finalArr[find_record].DesignImage = b?.DesignImage; // CQ Solving PSJewels 16/01/26
                    }

                    // if (!finalArr[find_record].DesignImage && b?.DesignImage) {
                    //   finalArr[find_record].DesignImage = b?.DesignImage;
                    // }

                    finalArr[find_record].grosswt += b?.grosswt;
                    finalArr[find_record].NetWt += b?.NetWt;
                    finalArr[find_record].LossWt += b?.LossWt;
                    finalArr[find_record].TotalAmount += b?.TotalAmount;
                    finalArr[find_record].DiscountAmt += b?.DiscountAmt;
                    finalArr[find_record].UnitCost += b?.UnitCost;
                    finalArr[find_record].MakingAmount += b?.MakingAmount;
                    finalArr[find_record].OtherCharges += b?.OtherCharges;
                    finalArr[find_record].TotalDiamondHandling += b?.TotalDiamondHandling;
                    finalArr[find_record].Quantity += b?.Quantity;
                    finalArr[find_record].Wastage += b?.Wastage;
                    finalArr[find_record].totals.metal.IsPrimaryMetal += b?.totals?.metal?.IsPrimaryMetal;
                    finalArr[find_record].totals.metal.Wt += b?.totals?.metal?.Wt;
                    finalArr[find_record].totals.diamonds.Wt += b?.totals?.diamonds?.Wt;
                    // finalArr[find_record].diamonds_d = [...finalArr[find_record]?.diamonds ,...b?.diamonds]?.flat();
                    finalArr[find_record].diamonds = [
                        ...finalArr[find_record]?.diamonds,
                        ...b?.diamonds,
                    ]?.flat();
                    // finalArr[find_record].colorstone_d = [...finalArr[find_record]?.colorstone ,...b?.colorstone]?.flat();
                    finalArr[find_record].colorstone = [
                        ...finalArr[find_record]?.colorstone,
                        ...b?.colorstone,
                    ]?.flat();
                    // finalArr[find_record].metal_d = [...finalArr[find_record]?.metal ,...b?.metal]?.flat();

                    // CQ Was Solved 09/10/2025
                    // finalArr[find_record].metal = [
                    //   ...(finalArr[find_record]?.metal || []),
                    //   ...(b?.metal || [])
                    // ].flat();
                    if (!finalArr[find_record].metal) {
                        finalArr[find_record].metal = [];
                    }
                    if (Array.isArray(b?.metal)) {
                        finalArr[find_record].metal.push(...cloneDeep(b.metal));
                    }
                    // console.log("finalArr[find_record]?.metal", finalArr[find_record]?.metal);
                    // CQ Was Solved 09/10/2025

                    finalArr[find_record].misc = [
                        ...finalArr[find_record]?.misc,
                        ...b?.misc,
                    ]?.flat();
                    finalArr[find_record].finding = [
                        ...finalArr[find_record]?.finding,
                        ...b?.finding,
                    ]?.flat();

                    finalArr[find_record].totals.finding.Wt += b?.totals?.finding?.Wt;
                    finalArr[find_record].totals.finding.Pcs += b?.totals?.finding?.Pcs;
                    finalArr[find_record].totals.finding.Amount +=
                        b?.totals?.finding?.Amount;
                    finalArr[find_record].totals.diamonds.Pcs += b?.totals?.diamonds?.Pcs;
                    finalArr[find_record].totals.diamonds.Amount +=
                        b?.totals?.diamonds?.Amount;

                    finalArr[find_record].totals.colorstone.Wt +=
                        b?.totals?.colorstone?.Wt;
                    finalArr[find_record].totals.colorstone.Pcs +=
                        b?.totals?.colorstone?.Pcs;
                    finalArr[find_record].totals.colorstone.Amount +=
                        b?.totals?.colorstone?.Amount;

                    finalArr[find_record].totals.misc.Wt += b?.totals?.misc?.Wt;
                    finalArr[find_record].totals.misc.allservwt +=
                        b?.totals?.misc?.allservwt;
                    finalArr[find_record].totals.misc.Pcs += b?.totals?.misc?.Pcs;
                    finalArr[find_record].totals.misc.Amount += b?.totals?.misc?.Amount;

                    finalArr[find_record].totals.metal.Amount += b?.totals?.metal?.Amount;
                    finalArr[find_record].totals.metal.IsPrimaryMetal +=
                        b?.totals?.metal?.IsPrimaryMetal;
                    finalArr[find_record].totals.metal.IsPrimaryMetal_Amount +=
                        b?.totals?.metal?.IsPrimaryMetal_Amount;

                    finalArr[find_record].totals.misc.withouthscode1_2_pcs +=
                        b?.totals?.misc?.withouthscode1_2_pcs;
                    finalArr[find_record].totals.misc.withouthscode1_2_wt +=
                        b?.totals?.misc?.withouthscode1_2_wt;
                    finalArr[find_record].totals.misc.onlyHSCODE3_amt +=
                        b?.totals?.misc?.onlyHSCODE3_amt;
                    finalArr[find_record].totals.misc.onlyIsHSCODE0_Wt +=
                        b?.totals?.misc?.onlyIsHSCODE0_Wt;
                    finalArr[find_record].totals.misc.onlyIsHSCODE0_Pcs +=
                        b?.totals?.misc?.onlyIsHSCODE0_Pcs;
                    finalArr[find_record].totals.misc.onlyIsHSCODE0_Amount +=
                        b?.totals?.misc?.onlyIsHSCODE0_Amount;
                }
            }
        });

        // CQ Was Solving 09/10/2025
        // finalArr.forEach((item, idx) => {
        //   console.log(`Record ${idx} GroupJob: ${item.GroupJob} has metal count:`, item.metal?.length);
        // });
        // console.log("Final finalArr stringified:\n", JSON.stringify(finalArr, null, 2));
        // CQ Was Solving 09/10/2025

        datas.resultArray = finalArr;

        //after groupjob
        datas?.resultArray?.forEach((e) => {
            let dia2 = [];
            e?.diamonds?.forEach((el) => {
                // let findrec = dia2?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname && a?.GroupName === el?.GroupName)
                let findrec = dia2?.findIndex(
                    (a) =>
                        a?.ShapeName === el?.ShapeName &&
                        a?.QualityName === el?.QualityName &&
                        a?.Colorname === el?.Colorname &&
                        a?.SizeName === el?.SizeName &&
                        a?.Rate === el?.Rate
                );
                let ell = cloneDeep(el);
                if (findrec === -1) {
                    dia2.push(ell);
                } else {
                    dia2[findrec].Wt += ell?.Wt;
                    dia2[findrec].Pcs += ell?.Pcs;
                    dia2[findrec].Amount += ell?.Amount;
                    // dia2[findrec].Rate += ell?.Rate; // CQ Fixed 22/11/2025
                    // if(dia2[findrec]?.SizeName !== ell?.SizeName){
                    //   // dia2[findrec].SizeName = 'Mix'
                    //   dia2[findrec].SizeName = ell?.GroupName;
                    // }
                }
            });
            e.diamonds = dia2;

            //diamond
            let clr2 = [];

            e?.colorstone?.forEach((el) => {
                // let findrec = dia2?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname && a?.GroupName === el?.GroupName)
                let findrec = clr2?.findIndex(
                    (a) =>
                        a?.ShapeName === el?.ShapeName &&
                        a?.QualityName === el?.QualityName &&
                        a?.Colorname === el?.Colorname &&
                        a?.SizeName === el?.SizeName &&
                        a?.Rate === el?.Rate &&
                        a?.isRateOnPcs === el?.isRateOnPcs
                );
                let ell = cloneDeep(el);
                if (findrec === -1) {
                    clr2.push(ell);
                } else {
                    clr2[findrec].Wt += ell?.Wt;
                    clr2[findrec].Pcs += ell?.Pcs;
                    clr2[findrec].Amount += ell?.Amount;
                    clr2[findrec].Rate += ell?.Rate;
                    // if(dia2[findrec]?.SizeName !== ell?.SizeName){
                    //   // dia2[findrec].SizeName = 'Mix'
                    //   dia2[findrec].SizeName = ell?.GroupName;
                    // }
                }
            });
            e.colorstone = clr2;

            //misc
            let misc0 = [];
            e?.misc?.forEach((el) => {
                if (el?.IsHSCOE === 0) {
                    misc0?.push(el);
                }
            });

            e.misc = misc0;

            if (e?.GroupJob !== "") {
                e.metal = e.metal?.map((a) => ({
                    ...a,
                    GroupJob: e.GroupJob,
                }));
            }
            // CQ Was Solved 09/10/2025

        });

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
        datas?.json2?.forEach((e) => {
            if (e?.MasterManagement_DiamondStoneTypeid === 1) {
                if (e.ShapeName?.toLowerCase() === "rnd") {
                    diaonlyrndarr1.push(e);
                } else {
                    diaonlyrndarr2.push(e);
                }
            }
        });

        diaonlyrndarr1?.forEach((e) => {
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

        diaonlyrndarr2?.forEach((e) => {
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

        diaonlyrndarr4?.forEach((e) => {
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

        let diamondDetail = [];
        data?.BillPrint_Json2?.forEach((e) => {
            if (e?.MasterManagement_DiamondStoneTypeid === 1) {
                let findDiamond = diamondDetail?.findIndex(
                    (ele) =>
                        ele?.ShapeName === e?.ShapeName &&
                        ele?.QualityName === e?.QualityName &&
                        ele?.Colorname === e?.Colorname
                );
                if (findDiamond === -1) {
                    diamondDetail.push(e);
                } else {
                    diamondDetail[findDiamond].Pcs += e?.Pcs;
                    diamondDetail[findDiamond].Wt += e?.Wt;
                    diamondDetail[findDiamond].Amount += e?.Amount;
                }
            }
        });
        let findRND = [];
        let remaingDia = [];
        diamondDetail?.forEach((ele) => {
            if (ele?.ShapeName === "RND") {
                findRND.push(ele);
            } else {
                remaingDia.push(ele);
            }
        });

        let resultArr = [];
        findRND.sort((a, b) => {
            if (a.ShapeName !== b.ShapeName) {
                return a.ShapeName.localeCompare(b.ShapeName); // Sort by ShapeName
            } else if (a.QualityName !== b.QualityName) {
                return a.QualityName.localeCompare(b.QualityName); // If ShapeName is same, sort by QualityName
            } else {
                return a.Colorname.localeCompare(b.Colorname); // If QualityName is same, sort by Colorname
            }
        });

        remaingDia.sort((a, b) => {
            if (a.ShapeName !== b.ShapeName) {
                return a.ShapeName.localeCompare(b.ShapeName); // Sort by ShapeName
            } else if (a.QualityName !== b.QualityName) {
                return a.QualityName.localeCompare(b.QualityName); // If ShapeName is same, sort by QualityName
            } else {
                return a.Colorname.localeCompare(b.Colorname); // If QualityName is same, sort by Colorname
            }
        });
        if (findRND?.length > 6) {
            let arr = findRND.slice(0, 6);
            let anotherArr = [...findRND.slice(6), remaingDia].flat();
            let obj = { ...anotherArr[0] };
            anotherArr?.reduce((acc, cobj) => {
                obj.Pcs += cobj?.Pcs;
                obj.Wt += cobj?.Wt;
                obj.Amount += cobj?.Amount;
            }, obj);
            obj.ShapeName = "OTHER";
            resultArr = [...arr, obj].flat();
        } else {
            let arr = [...findRND].flat();
            let smallArr = [...remaingDia.slice(0, 6 - findRND?.length)].flat();
            let largeArr = [...remaingDia.slice(6 - findRND?.length)].flat();
            let finalArr = [...arr, ...smallArr].flat();

            let obj = { ...largeArr[0] };
            obj.Pcs = 0;
            obj.Wt = 0;
            obj.Amount = 0;
            largeArr?.reduce((acc, cobj) => {
                obj.Pcs += cobj?.Pcs;
                obj.Wt += cobj?.Wt;
                obj.Amount += cobj?.Amount;
            }, obj);
            obj.ShapeName = "OTHER";
            resultArr = [...finalArr, obj].flat();
        }

        setDiamondDetails(resultArr);

        diarndotherarr5 = [...diaonlyrndarr6, diaObj];
        const sortedData = diarndotherarr5?.sort(customSort);
        // setDiamonds(sortedData);
        setDiamondWise(sortedData);

        setResult(datas);
    }

    const handleCheckbox = () => {
        if (imgFlag) {
            setImgFlag(false);
        } else {
            setImgFlag(true);
        }
    };
    const handleCheckbox2 = () => {
        if (imgFlag2) {
            setImgFlag2(false);
        } else {
            setImgFlag2(true);
        }
    };

    const handleImageErrors = () => {
        setIsImageWorking(false);
    };

    const customSort = (a, b) => {
        if (a?.ShapeName === "OTHER" && b?.ShapeName !== "OTHER") {
            return 1; // "OTHER" comes after any other ShapeName
        } else if (a?.ShapeName !== "OTHER" && b?.ShapeName === "OTHER") {
            return -1; // Any other ShapeName comes before "OTHER"
        } else {
            // If ShapeNames are equal, compare by QualityName
            if (a?.QualityName < b?.QualityName) {
                return -1;
            } else if (a?.QualityName > b?.QualityName) {
                return 1;
            } else {
                // If QualityNames are equal, compare by Colorname
                return a?.Colorname?.localeCompare(b?.Colorname);
            }
        }
    };

    // height: auto;
    // width: 720px;
    // padding: 15px;
    // font-family: Calibri !important;
    // font-size: 13px;
    const handlePrint = (e) => {
        window.print();
    };


    return (
        <>
            {loader ? (
                <Loader />
            ) : (
                <>
                    {msg === "" ? (
                        <>
                            <div style={{ height: "auto", width: "750px", padding: "15px", fontFamily: "Calibri !important", fontSize: "12px", margin: "0 auto" }}>

                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <input
                                        type="button"
                                        className="btn_white blue py-1 mt-2 mb-3"
                                        value="Print"
                                        onClick={(e) => handlePrint(e)}
                                    />
                                </div>
                                {/* Title */}
                                <div
                                    style={{
                                        fontSize: "26px",
                                        backgroundColor: "#939292",
                                        color: "#FFF",
                                        padding: "4px 0px 5px 6px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    JEWELLERY RECEIVE TO REPAIR
                                </div>
                                {/* Company Header */}
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "13.5px", padding: "0 8px" }}>
                                    <div style={{ width: "70%" }}>
                                        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                                            {result?.header?.CompanyFullName}
                                        </div>
                                        <div> {result?.header?.CompanyAddress}</div>
                                        <div> {result?.header?.CompanyAddress2}</div>
                                        <div>{result?.header?.CompanyCity}-{result?.header?.CompanyPinCode}, {result?.header?.CompanyState}({result?.header?.CompanyCountry})</div>
                                        <div>T {result?.header?.CompanyTellNo} | TOLL FREE {result?.header?.CompanyTollFreeNo}</div>
                                        <div style={{ fontSize: "12px" }}> {result?.header?.CompanyEmail} | {result?.header?.CompanyWebsite}</div>
                                        <div style={{ fontSize: "12px" }}>
                                            {/* GSTIN-{result?.header?.Company_VAT_GST_No} | {result?.header?.Company_CST_STATE}-{result?.header?.Company_CST_STATE_No} | PAN-{result?.header?.Com_pannumber} */}
                                            {
                                                [
                                                    result?.header?.Company_VAT_GST_No &&
                                                    `GSTIN-${result.header.Company_VAT_GST_No}`,

                                                    result?.header?.Company_CST_STATE &&
                                                    result?.header?.Company_CST_STATE_No &&
                                                    `${result.header.Company_CST_STATE}-${result.header.Company_CST_STATE_No}`,

                                                    result?.header?.Com_pannumber &&
                                                    `PAN-${result.header.Com_pannumber}`,
                                                ]
                                                    .filter(Boolean)
                                                    .join(" | ")
                                            }
                                        </div>
                                    </div>

                                    <div>
                                        <img
                                            src="http://nzen/R50B3/UFS/orail25TNBVD0LO2UFPRZ4YH/companylogo/projectlogo.png"
                                            alt="logo"
                                            style={{ height: "90px" }}
                                        />
                                    </div>
                                </div>

                                {/* From + Inward Section */}
                                <div
                                    style={{
                                        border: "1px solid #DCDCDC",
                                        marginTop: "10px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "10px"
                                    }}
                                >
                                    {/* From */}
                                    <div style={{ width: "10%" }}>
                                        <span style={{ fontWeight: "bold", fontSize: "13px" }}>From</span>
                                    </div>
                                    <div style={{ width: "60%" }}>
                                        <div>
                                            {result?.header?.customerfirmname && (
                                                <div>
                                                    <span style={{ fontSize: "17px" }}>
                                                        {result.header.customerfirmname}
                                                    </span>
                                                </div>
                                            )}

                                            {result?.header?.customerAddress1 && (
                                                <div style={{ fontSize: "14px" }}>
                                                    {result.header.customerAddress1}
                                                </div>
                                            )}

                                            {result?.header?.customerAddress2 && (
                                                <div style={{ fontSize: "14px" }}>
                                                    {result.header.customerAddress2}
                                                </div>
                                            )}

                                            {result?.header?.customerAddress3 && (
                                                <div style={{ fontSize: "14px" }}>
                                                    {result.header.customerAddress3}
                                                </div>
                                            )}

                                            {(result?.header?.customercity1 || result?.header?.customerpincode) && (
                                                <div style={{ fontSize: "14px" }}>
                                                    {result?.header?.customercity1}
                                                    {result?.header?.customercity1 && result?.header?.customerpincode ? " - " : ""}
                                                    {result?.header?.customerpincode}
                                                </div>
                                            )}

                                            {result?.header?.customeremail1 && (
                                                <div style={{ fontSize: "14px" }}>
                                                    {result.header.customeremail1}
                                                </div>
                                            )}

                                            {result?.header?.customermobileno1 && (
                                                <div style={{ fontSize: "14px" }}>
                                                    {result.header.customermobileno1}
                                                </div>
                                            )}
                                        </div>


                                    </div>

                                    {/* Inward Info */}
                                    <div style={{ width: "26%" }}>
                                        <div style={{ display: "flex" }}>
                                            <div style={{ fontWeight: "bold", fontSize: "13px", width: "40%" }}>INWARD</div> <span>{result?.header?.InvoiceNo}</span>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <div style={{ fontWeight: "bold", fontSize: "13px", width: "40%" }}>DATE</div> <span>{result?.header?.EntryDate}</span>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <div style={{ fontWeight: "bold", fontSize: "13px", width: "40%" }}>HSN</div> <span>{result?.header?.HSN_No}</span>
                                        </div>
                                    </div>
                                </div>


                                <div className="actual_details">
                                    <div style={{ padding: "10px 0px", fontWeight: "bold" }}>Actual Details</div>
                                    {result?.resultArray?.map((e, i) => {
                                        console.log("TCL: RepairJobPrint -> e", e)

                                        return (
                                            <div style={{ border: "1px solid #DCDCDC", padding: "15px" }} key={i}>

                                                <div className="jobDetails" style={{ fontSize: "14px" }}>
                                                    <div>
                                                        <b>{e?.SrJobno}</b> with <b>{e?.MetalTypePurity} ({e?.MetalColor})</b>
                                                    </div>

                                                    <div>
                                                        Metal Weight <b>{e?.MetalWeight.toFixed(3)}</b> [ Tunch : <b>{e?.Tunch.toFixed(3)}</b> ] <b>|</b> Gross Weight <b>{e?.grosswt.toFixed(3)}</b>
                                                    </div>
                                                </div>


                                                {e?.diamonds.length > 0 && (

                                                    <>
                                                        <div style={{ padding: "10px 0" }}><b>Diamond</b></div>



                                                        <div style={{ border: "1px solid #EEEEEE", width: "100%" }}>

                                                            <div style={{ display: "flex", background: "#EEEEEE", color: "#6B696B", fontWeight: "bold", textAlign: "center" }}>
                                                                <div style={{ width: "65px", padding: "5px" }}>SR#</div>
                                                                <div style={{ width: "90px", padding: "5px" }}>TYPE</div>
                                                                <div style={{ width: "90px", padding: "5px" }}>SHAPE</div>
                                                                <div style={{ width: "84px", padding: "5px" }}>QUALITY</div>
                                                                <div style={{ width: "90px", padding: "5px" }}>COLOR</div>
                                                                <div style={{ width: "95px", padding: "5px" }}>SIZE</div>
                                                                <div style={{ width: "95px", padding: "5px" }}>SUPPLIER</div>
                                                                <div style={{ width: "85px", padding: "5px" }}>PCS.</div>
                                                                <div style={{ width: "95px", padding: "5px" }}>POINTER</div>
                                                                <div style={{ width: "95px", padding: "5px" }}>CTW</div>
                                                            </div>

                                                            {/* ROW */}
                                                            {e?.diamonds?.map((el, i) => {

                                                                return (
                                                                    <div style={{ display: "flex", borderTop: "1px solid #EEEEEE" }} key={i}>
                                                                        <div style={{ width: "65px", padding: "5px", textAlign: "center", borderRight: "1px solid #EEEEEE" }}>{i + 1}</div>
                                                                        <div style={{ width: "90px", padding: "5px", borderRight: "1px solid #EEEEEE" }}></div>
                                                                        <div style={{ width: "90px", padding: "5px", borderRight: "1px solid #EEEEEE" }}>{el?.ShapeName}</div>
                                                                        <div style={{ width: "84px", padding: "5px", borderRight: "1px solid #EEEEEE" }}>{el?.QualityName}</div>
                                                                        <div style={{ width: "90px", padding: "5px", borderRight: "1px solid #EEEEEE" }}>{el?.Colorname}</div>
                                                                        <div style={{ width: "95px", padding: "4px", borderRight: "1px solid #EEEEEE" }}>{el?.SizeName}</div>
                                                                        <div style={{ width: "95px", padding: "5px", borderRight: "1px solid #EEEEEE" }}>{el?.Supplier}</div>
                                                                        <div style={{ width: "85px", padding: "5px", textAlign: "right", borderRight: "1px solid #EEEEEE" }}>{el?.Pcs}</div>
                                                                        <div style={{ width: "95px", padding: "5px", textAlign: "right", borderRight: "1px solid #EEEEEE" }}>{el.pointer?.toFixed(3)}</div>
                                                                        <div style={{ width: "95px", padding: "5px", textAlign: "right" }}>{el?.Wt.toFixed(3)}</div>
                                                                    </div>
                                                                )
                                                            })}


                                                        </div>
                                                    </>
                                                )}


                                                {e?.colorstone.length > 0 && (
                                                    <>
                                                        <div style={{ padding: "10px 0" }}><b>Color Stone</b></div>


                                                        <div style={{ border: "1px solid #EEEEEE", width: "100%" }}>

                                                            <div style={{ display: "flex", background: "#EEEEEE", color: "#6B696B", fontWeight: "bold", textAlign: "center" }}>
                                                                <div style={{ width: "65px", padding: "5px" }}>SR#</div>
                                                                <div style={{ width: "90px", padding: "5px" }}>TYPE</div>
                                                                <div style={{ width: "90px", padding: "5px" }}>SHAPE</div>
                                                                <div style={{ width: "75px", padding: "5px" }}>QUALITY</div>
                                                                <div style={{ width: "90px", padding: "5px" }}>COLOR</div>
                                                                <div style={{ width: "95px", padding: "5px" }}>SIZE</div>
                                                                <div style={{ width: "95px", padding: "5px" }}>SUPPLIER</div>
                                                                <div style={{ width: "95px", padding: "5px" }}>PCS.</div>
                                                                <div style={{ width: "95px", padding: "5px" }}>CTW</div>
                                                            </div>

                                                            {e?.colorstone?.map((el, i) => {
                                                                return (
                                                                    <div style={{ display: "flex", borderTop: "1px solid #EEEEEE" }} key={i}>
                                                                        <div style={{ width: "65px", padding: "5px", textAlign: "center", borderRight: "1px solid #EEEEEE" }}>{i + 1}</div>
                                                                        <div style={{ width: "90px", padding: "5px", borderRight: "1px solid #EEEEEE" }}></div>
                                                                        <div style={{ width: "90px", padding: "5px", borderRight: "1px solid #EEEEEE" }}>{el?.ShapeName}</div>
                                                                        <div style={{ width: "75px", padding: "5px", borderRight: "1px solid #EEEEEE" }}>{el?.QualityName}</div>
                                                                        <div style={{ width: "90px", padding: "5px", borderRight: "1px solid #EEEEEE" }}>{el?.Colorname}</div>
                                                                        <div style={{ width: "95px", padding: "5px", borderRight: "1px solid #EEEEEE" }}>{el?.SizeName}</div>
                                                                        <div style={{ width: "95px", padding: "5px", borderRight: "1px solid #EEEEEE" }}>{el?.Supplier}</div>
                                                                        <div style={{ width: "95px", padding: "5px", textAlign: "right", borderRight: "1px solid #EEEEEE" }}>{el?.Pcs} </div>
                                                                        <div style={{ width: "95px", padding: "5px", textAlign: "right", borderRight: "1px solid #EEEEEE" }}>{el?.Wt.toFixed(3)}</div>
                                                                    </div>
                                                                )
                                                            })}



                                                        </div>
                                                    </>
                                                )}




                                                {e?.misc.length > 0 && (

                                                    <>
                                                        <div style={{ padding: "10px 0" }}><b>Misc</b></div>



                                                        <div style={{ border: "1px solid #EEEEEE", width: "100%" }}>

                                                            <div style={{ display: "flex", background: "#EEEEEE", color: "#6B696B", fontWeight: "bold", textAlign: "center" }}>
                                                                <div style={{ width: "65px", padding: "5px" }}>SR#</div>
                                                                <div style={{ width: "90px", padding: "5px" }}>TYPE</div>
                                                                <div style={{ width: "90px", padding: "5px" }}>SHAPE</div>
                                                                <div style={{ width: "75px", padding: "5px" }}>QUALITY</div>
                                                                <div style={{ width: "90px", padding: "5px" }}>COLOR</div>
                                                                <div style={{ width: "95px", padding: "5px" }}>SIZE</div>
                                                                <div style={{ width: "95px", padding: "5px" }}>SUPPLIER</div>
                                                                <div style={{ width: "95px", padding: "5px" }}>PCS.</div>
                                                                <div style={{ width: "95px", padding: "5px" }}>Gm</div>
                                                                <div style={{ width: "95px", padding: "5px" }}>Add in Gr Wt</div>
                                                            </div>
                                                            {e?.misc?.map((el, i) => {
                                                                return (
                                                                    <div style={{ display: "flex", borderTop: "1px solid #EEEEEE" }} key={i}>
                                                                        <div style={{ width: "65px", padding: "5px", textAlign: "center", borderRight: "1px solid #EEEEEE" }}>{i + 1}</div>
                                                                        <div style={{ width: "90px", padding: "5px", borderRight: "1px solid #EEEEEE" }}></div>
                                                                        <div style={{ width: "90px", padding: "5px", borderRight: "1px solid #EEEEEE" }}>{el?.ShapeName}</div>
                                                                        <div style={{ width: "75px", padding: "5px", borderRight: "1px solid #EEEEEE" }}>{el?.QualityName}</div>
                                                                        <div style={{ width: "90px", padding: "5px", borderRight: "1px solid #EEEEEE" }}>{el?.Colorname}</div>
                                                                        <div style={{ width: "95px", padding: "5px", borderRight: "1px solid #EEEEEE" }}>{el?.SizeName}</div>
                                                                        <div style={{ width: "95px", padding: "5px", borderRight: "1px solid #EEEEEE" }}>{el?.Supplier}</div>
                                                                        <div style={{ width: "95px", padding: "5px", textAlign: "right", borderRight: "1px solid #EEEEEE" }}>{el?.Pcs}</div>
                                                                        <div style={{ width: "95px", padding: "5px", textAlign: "right", borderRight: "1px solid #EEEEEE" }}>{el?.Wt.toFixed(3)}</div>
                                                                        <div style={{ width: "95px", padding: "5px", textAlign: "center" }}>Yes</div>
                                                                    </div>
                                                                )
                                                            })}


                                                        </div></>
                                                )}

                                            </div>
                                        )

                                    })}

                                </div>


                                <div className="new_added_mat">
                                    <div style={{ padding: "10px 0px", fontWeight: "bold" }}>New Added Material
                                    </div>

                                    <div style={{ border: "1px solid #DCDCDC", padding: "15px" }}>

                                        <div style={{ paddingBottom: "10px" }}>
                                            <b>1/2121</b> with <b>GOLD 18K (YELLOW)</b>
                                        </div>

                                        <div style={{ border: "1px solid #D2D2D2", width: "100%" }}>

                                            {/* Header Row */}
                                            <div style={{ display: "flex", textAlign: "center", borderBottom: "1px solid #D2D2D2" }}>

                                                <div style={{ flex: 1, padding: "5px" }}>
                                                    New Gross Wt
                                                </div>

                                                <div style={{ flex: 1, padding: "5px" }}>
                                                    Net Wt
                                                </div>

                                                <div style={{ flex: 1, padding: "5px", borderRight: "1px solid #D2D2D2" }}>
                                                    Gross Wt
                                                </div>

                                                <div style={{ flex: 1, padding: "5px" }}>
                                                    Making Charge Unit
                                                </div>

                                                <div style={{ flex: 1, padding: "5px" }}>
                                                    Making Charge On
                                                </div>

                                            </div>

                                            {/* Data Row */}
                                            <div style={{ display: "flex", textAlign: "center" }}>

                                                <div style={{ flex: 1, padding: "5px", fontWeight: "bold" }}>
                                                    0.000
                                                </div>

                                                <div style={{ flex: 1, padding: "5px", fontWeight: "bold" }}>
                                                    2.700
                                                </div>

                                                <div style={{ flex: 1, padding: "5px", fontWeight: "bold", borderRight: "1px solid #D2D2D2" }}>
                                                    4.800
                                                </div>

                                                <div style={{ flex: 1, padding: "5px", fontWeight: "bold" }}>
                                                    0.00
                                                </div>

                                                <div style={{ flex: 1, padding: "5px", fontWeight: "bold" }}>
                                                    Metal Wt
                                                </div>

                                            </div>

                                        </div>

                                    </div>


                                </div>
                                <div id="divtaxes" style={{ textAlign: "left", fontSize: "16px", width: "100%" }}>

                                    <div style={{ display: "flex", width: "100%" }}>

                                        {/* Left Section - In Words */}
                                        <div
                                            style={{
                                                width: "70%",
                                                border: "1px solid #DCDCDC",
                                                paddingLeft: "10px",
                                                display:"flex",
                                                justifyContent:"flex-end",
                                                flexDirection:"column",
                                                fontSize:"14px",
                                                lineHeight: 1.3,
                                                borderTop:"0px",
                                                borderRight:"0px"
                                            }}
                                        >
                                            <p>In Words  {result?.header?.Currencyname}</p>
                                            <p className="fw-bold">{toWords.convert(+( result?.mainTotal?.total_amount /
                                                                                   result?.header?.CurrencyExchRate +
                                                                                   result?.allTaxesTotal +
                                                                                   result?.header?.FreightCharges /
                                                                                     result?.header?.CurrencyExchRate +
                                                                                   result?.header?.AddLess /
                                                                                     result?.header?.CurrencyExchRate)?.toFixed(2))} Only</p>
                                          
                                        </div>

                                        {/* Right Section */}
                                        <div style={{ width: "30%", display: "flex", flexDirection: "column" }}>

                                            {/* Total Amount */}
                                            <div style={{ display: "flex" }}>
                                                <div
                                                    style={{
                                                        width: "66%",
                                                        fontSize: "13px",
                                                        textAlign: "left",
                                                        paddingLeft: "10px",
                                                        border: "1px solid #DCDCDC",
                                                        fontWeight: "bold",
                                                        borderRight:"0px",
                                                        borderTop:"0px"
                                                    }}
                                                >
                                                    Total Amount
                                                </div>
                                                <div
                                                    style={{
                                                        width: "34%",
                                                        fontSize: "13px",
                                                        textAlign: "right",
                                                        paddingRight: "7px",
                                                        border: "1px solid #DCDCDC",
                                                        fontWeight: "bold"
                                                    }}
                                                >
                                                    {formatAmount(
                                                                                 result?.mainTotal?.total_amount /
                                                                                   result?.header?.CurrencyExchRate
                                                    )}
                                                </div>
                                            </div>

                                          

                                            
                                             {result?.allTaxes?.map((e, i) => {
                                                                        return (
                                                                          <div
                                                                          style={{ display: "flex" }}
                                                                            key={i}
                                                                          >
                                                                            <div className=" "
                                                                               style={{
                                                                                width: "66%",
                                                                                fontSize: "13px",
                                                                                textAlign: "left",
                                                                                paddingLeft: "10px",
                                                                                borderLeft: "1px solid #DCDCDC",
                                                                                
                                                                            }}
                                                                            >
                                                                              {" "}
                                                                              {e?.name} {e?.per}{" "}
                                                                            </div>
                                                                            <div className=""
                                                                             style={{
                                                                                width: "34%",
                                                                                fontSize: "13px",
                                                                                textAlign: "right",
                                                                                paddingRight: "7px",
                                                                                borderLeft: "1px solid #DCDCDC",
                                                                                borderRight: "1px solid #DCDCDC"
                                                                            }}>
                                                                              {" "}
                                                                              {formatAmount(e?.amountInNumber)}{" "}
                                                                            </div>
                                                                          </div>
                                                                        );
                                            })}
                                             {/* SGST */}
                                             <div style={{ display: "flex",borderBottom:"1px solid #DCDCDC" }}>
                                                <div
                                                    style={{
                                                        width: "66%",
                                                        fontSize: "13px",
                                                        textAlign: "left",
                                                        paddingLeft: "10px",
                                                        borderLeft: "1px solid #DCDCDC",
                                                         
                                                    }}
                                                >
                                                    <b>Grand Total</b>
                                                </div>
                                                <div
                                                    style={{
                                                        width: "34%",
                                                        fontSize: "13px",
                                                        textAlign: "right",
                                                        paddingRight: "7px",
                                                        borderLeft: "1px solid #DCDCDC",
                                                        borderRight: "1px solid #DCDCDC"
                                                    }}
                                                >
                                                   {formatAmount(
                                                                                 result?.mainTotal?.total_amount /
                                                                                   result?.header?.CurrencyExchRate +
                                                                                   result?.allTaxesTotal +
                                                                                   result?.header?.FreightCharges /
                                                                                     result?.header?.CurrencyExchRate +
                                                                                   result?.header?.AddLess /
                                                                                     result?.header?.CurrencyExchRate
                                                                               )}
                                                </div>
                                            </div>

                                            {/* Hidden Row */}
                                            <div style={{ display: "none" }}>
                                                <div></div>
                                                <div></div>
                                            </div>

                                        </div>

                                    </div>

                                   

                                </div>

                                <div style={{ width: "100%", paddingTop: "10px", display: "flex" }}>

                                    <div
                                        style={{
                                            width: "50%",
                                            height: "80px",
                                            textAlign: "center",
                                            verticalAlign: "bottom",
                                            paddingBottom: "10px",
                                            border: "1px solid #DCDCDC",
                                            display: "flex",
                                            alignItems: "flex-end",
                                            justifyContent: "center"
                                        }}
                                    >
                                        RECEIVER's NAME & SIGNATURE
                                    </div>

                                    <div
                                        style={{
                                            width: "50%",
                                            height: "80px",
                                            textAlign: "center",
                                            paddingBottom: "10px",
                                            border: "1px solid #DCDCDC",
                                            borderLeft: "0px",
                                            display: "flex",
                                            alignItems: "flex-end",
                                            justifyContent: "center"
                                        }}
                                    >
                                        For, <span id="CompanyFullName_sign">Classmate Corporation Pvt Ltd</span>
                                    </div>

                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
                            {msg}
                        </p>
                    )}
                </>
            )}
        </>
    );
}

export default RepairJobPrint
