import React from 'react'
import { useState } from 'react';
import Loader from '../../components/Loader';
import { useEffect } from 'react';
import { ExportToExcel, apiCall, isObjectEmpty } from '../../GlobalFunctions';

const ExcelToJsonDownload = ({ urls, token, invoiceNo, printName, evn }) => {

    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");

    const loadData = (data) => {
        let json0Data = data?.BillPrint_Json[0];
        let json1Data = data?.BillPrint_Json1;
        let json2Data = data?.BillPrint_Json2;
        let blankArr = [];
        data?.BillPrint_Json1.forEach((e, i) => {
            let obj = { ...e };
            let materials = [];
            data?.BillPrint_Json2.forEach((ele, ind) => {
                if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
                    let findIndex = materials.findIndex((elem, index) => elem?.Rate === ele?.Rate && elem?.GroupName === ele?.GroupName);
                    if (findIndex === -1) {
                        materials.push(ele);
                    } else {
                        materials[findIndex].Wt += ele?.Wt;
                        materials[findIndex].Amount += ele?.Amount;
                        materials[findIndex].Pcs += ele?.Pcs;
                    }
                } else {
                    let findIndex = materials.findIndex((elem, index) => elem?.Rate === ele?.Rate && elem?.MasterManagement_DiamondStoneTypeid === ele?.MasterManagement_DiamondStoneTypeid);
                    if (findIndex === -1) {
                        materials.push(ele);
                    } else {
                        materials[findIndex].Wt += ele?.Wt;
                        materials[findIndex].Amount += ele?.Amount;
                        materials[findIndex].Pcs += ele?.Pcs;
                    }
                }

            });
            let diamonds = materials.filter(ele => ele?.MasterManagement_DiamondStoneTypeid === 1);
            let colorStones = materials.filter(ele => ele?.MasterManagement_DiamondStoneTypeid === 2);
            let metals = materials.filter(ele => ele?.MasterManagement_DiamondStoneTypeid === 4);

            let arr = [diamonds, colorStones, metals];
            let largestLength = -1;

            arr.forEach((ele, i) => {
                if (ele.length > largestLength) {
                    largestLength = ele.length;
                }
            });

            if (materials.length > 0) {
                Array.from({ length: largestLength }).forEach((ele, ind) => {
                    let diamondQualityname = "";
                    let diamondColorName = "";
                    let diamondWt = "";
                    let diamondRate = "";
                    let diamondAmount = "";
                    let diamondGroupname = "";
                    let diamondShapename = "";
                    let diamondPcs = "";
                    if (diamonds[ind]) {
                        diamondQualityname = diamonds[ind]?.QualityName;
                        diamondColorName = diamonds[ind]?.Colorname;
                        diamondWt = diamonds[ind]?.Wt;
                        diamondRate = diamonds[ind]?.Rate;
                        diamondAmount = diamonds[ind]?.Amount;
                        diamondGroupname = diamonds[ind]?.GroupName;
                        diamondShapename = diamonds[ind]?.ShapeName;
                        diamondPcs = diamonds[ind]?.Pcs;
                    }
                    let stoneShape = "";
                    let stonePcs = "";
                    let stoneWt = "";
                    let stoneRate = "";
                    let stoneAmount = "";

                    let metalRate = "";
                    let goldValue = e?.MetalAmount - e?.LossAmt;
                    if (colorStones[ind]) {
                        stoneShape = colorStones[ind]?.ShapeName;
                        stonePcs = colorStones[ind]?.Pcs;
                        stoneWt = colorStones[ind]?.Wt;
                        stoneRate = colorStones[ind]?.Rate;
                        stoneAmount = colorStones[ind]?.Amount;
                    }
                    if (metals[ind]) {
                        // metalPurity = metals[i]?.MetalPurity;
                        // metalColor = metals[i]?.MetalColor;
                        metalRate = metals[ind]?.Rate;
                    }
                    let srJobno = ind === 0 ? e?.SrJobno : "";
                    let designno = ind === 0 ? e?.designno : "";
                    let companyFullName = ind === 0 ? e?.CompanyFullName : "";
                    let categoryname = ind === 0 ? e?.Categoryname : "";
                    let otherAmtDetail = ind === 0 ? e?.OtherAmtDetail : "";
                    let certification = ind === 0 ? e?.OtherCharges : "";
                    let certificateNo = ind === 0 ? e?.CertificateNo : "";
                    let lossAmt = ind === 0 ? e?.LossAmt : "";
                    let LossWt = ind === 0 ? e?.LossWt : "";
                    let metalAmount = ind === 0 ? e?.MetalAmount : "";
                    let makingAmount = ind === 0 ? e?.MakingAmount : "";
                    let totalAmount = ind === 0 ? e?.TotalAmount : "";
                    let qty = ind === 0 ? 1 : "";
                    let subCategory = ind === 0 ? "OPEN SETTING" : "";
                    let rateType = ind === 0 ? "GMS" : "";
                    let certifiedby = ind === 0 ? "IGI" : "";
                    let diamondTotalAmount = ind === 0 ? e?.DiamondAmount : "";
                    let metalPurity = ind === 0 ? e?.MetalPurity : "";
                    let metalColor = ind === 0 ? e?.MetalColor : "";
                    let grosswt = ind === 0 ? e?.grosswt : "";
                    let NetWt = ind === 0 ? e?.NetWt : "";

                    let makeObj = createObj(srJobno, designno, companyFullName, "", qty, "", categoryname, subCategory, "", "", "",
                        diamondQualityname, diamondColorName, diamondGroupname, "", diamondShapename, diamondPcs, diamondWt, diamondRate,
                        diamondAmount, diamondTotalAmount, stoneShape, stonePcs, stoneWt, stoneRate, stoneAmount, "", grosswt, NetWt,
                        LossWt, metalPurity, metalColor, rateType, metalRate, goldValue, lossAmt, metalAmount, makingAmount, totalAmount,
                        "", "", "", "", "", "", "", "", certification, certifiedby, certificateNo);
                    blankArr.push(makeObj);
                });
            }
        });
        ExportToExcel(blankArr)
    }

    const createObj = (srJobno, designno, CompanyFullName, Div, Qty, Type, Categoryname, SubCategory, Brand, Country, DiaDiv, diamondQualityname,
        diamondColorName, diamondGroupname, Sieve, diamondShapename, diamondPcs, diamondWt, diamondRate, diamond_Amount, diamondAmount, stoneShape,
        stonePcs, stoneWt, stoneRate, stoneAmount, MetalDivision, grosswt, NetWt, LossWt, metalPurity, metalColor, rateType, metalRate, goldValue,
        LossAmt, MetalAmount,MakingAmount, TotalAmount, TagPrice1, TagPrice2, tagline1, tagline2, tagline3, tagline4, tagline5, costCode, certification, certifiedby,
        CertificateNo) => {
        let obj = {
            "Stock Code/Prefix": srJobno,
            "Design No.": designno,
            "Supplier Ref": CompanyFullName,
            "Div": Div,
            "Qty": Qty,
            "Type": Type,
            "Category": Categoryname,
            "Sub Category": SubCategory,
            "Brand": Brand,
            "Country": Country,
            "Dia Div": DiaDiv,
            "Clarity": diamondQualityname,
            "Dia Color": diamondColorName,
            "Dia Size": diamondGroupname,
            "Sieve": Sieve,
            "Shape": diamondShapename,
            "No. Of Dia": diamondPcs,
            "Dia Carat": diamondWt,
            "Dia Amt prt ct": diamondRate,
            "Dia value": diamond_Amount,
            "total dia amount": diamondAmount,
            "Stone Shape": stoneShape,
            "No. Of St.": stonePcs,
            "Stone Ct": stoneWt,
            "St Amt per Ct": stoneRate,
            "Stone Value": stoneAmount,
            "Metal Division": MetalDivision,
            "GROSS WT": grosswt,
            "NET WT/GOLD WT": NetWt,
            "gold loss wt": LossWt,
            "Karat": metalPurity,
            "Gold Colour": metalColor,
            "Rate Type": rateType,
            "Rate": metalRate,
            "Gold Value": goldValue,
            "Gold Loss Value": LossAmt,
            "Total Gold Value": MetalAmount,
            "MAKING": MakingAmount,
            "Cost": TotalAmount,
            "Tag Price 1": TagPrice1,
            "Tag Price 2": TagPrice2,
            "tagline1": tagline1,
            "tagline2": tagline2,
            "tagline3": tagline3,
            "tagline4": tagline4,
            "tagline5": tagline5,
            "Cost Code": costCode,
            "CERTIFICATION": certification,
            "CERTIFIED BY": certifiedby,
            "CERTIFICATE NUMBER": CertificateNo
        }
        return obj;
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
            "" : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}</>
    )
}

export default ExcelToJsonDownload