import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import "../../assets/css/prints/invoiceprint3.css";
import { CapitalizeWords } from '../../GlobalFunctions';
import convertor from "number-to-words";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const InvoicePrint3 = ({ urls, token, invoiceNo, printName }) => {
    const [headerData, setHeaderData] = useState();
    const [json1, setJson1] = useState();
    const [json2, setJson2] = useState();
    const [resultArray, setResultArray] = useState();
    const [grandTotal, setGrandTotal] = useState(0);
    const [totDiscount, setTotDiscount] = useState(0);
    const [inWords, setInWords] = useState('');
    const [mainTotal, setMainTotal] = useState({});
    const [groupedArr, setGroupedArr] = useState([]);
    const [groupedArrAmountTotal, setGroupedArrAmountTotal] = useState(0);
    const [LOM, setLOM] = useState([]);
    const [descArr, setDescArr] = useState('');

    async function loadData() {
        try {

            const body = {
                "token": token,
                "invoiceno": invoiceNo,
                "printname": printName
            };

            const data = await axios.post(urls, body);
            if (data?.data?.Status == 200) {
                let datas = data?.data?.Data;
                // setResponsejson(datas);
                setHeaderData(datas?.BillPrint_Json[0]);
                setJson1(datas?.BillPrint_Json1);
                setJson2(datas?.BillPrint_Json2);
                organizeData(datas?.BillPrint_Json[0], datas?.BillPrint_Json1, datas?.BillPrint_Json2);
                // countCategorySubCategory(datas?.BillPrint_Json1);
                // countCategories(datas?.BillPrint_Json1);

            } else {
                console.log(data?.data?.Status, data?.data?.Message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const organizeData = (json, json1, json2) => {
        let resultArr = [];
        let grandTotal = 0;
        let totAmt = 0;
        let totdis = 0;
        let groupedAmtTotal = 0;
        let totOthAmt = 0;
        let totLbrAmt = 0;
        let totmiscAmt = 0;
        let mainTotal = {
            diamonds: {
                Wt: 0,
                Pcs: 0,
                Rate: 0,
                Amount: 0,
            },
            colorstone: {
                Wt: 0,
                Pcs: 0,
                Rate: 0,
                Amount: 0,
            },
            metal: {
                Wt: 0,
                Pcs: 0,
                Rate: 0,
                Amount: 0,
            },
            misc: {
                Wt: 0,
                Pcs: 0,
                Rate: 0,
                Amount: 0,
            },
            finding: {
                Wt: 0,
                Pcs: 0,
                Rate: 0,
                Amount: 0,
            },
            totalnetwt: {
                netwt: 0,
            },
            totalgrosswt: {
                grosswt: 0,
            },
            totAmount: {
                TotalAmount: 0,
            },
            totlbrAmt: {
                Amount: 0,
            },
            totOthAmt: {
                Amount: 0,
            }
        };
        // eslint-disable-next-line array-callback-return
        json1.map((e) => {
            let diamondlist = [];
            let colorstonelist = [];
            let metallist = [];
            let misclist = [];
            let findinglist = [];


            let totals = {
                diamonds: {
                    Wt: 0,
                    Pcs: 0,
                    Rate: 0,
                    Amount: 0,
                },

                colorstone: {
                    Wt: 0,
                    Pcs: 0,
                    Rate: 0,
                    Amount: 0,
                },

                metal: {
                    Wt: 0,
                    Pcs: 0,
                    Rate: 0,
                    Amount: 0,
                },

                misc: {
                    Wt: 0,
                    Pcs: 0,
                    Rate: 0,
                    Amount: 0,
                },

                finding: {
                    Wt: 0,
                    Pcs: 0,
                    Rate: 0,
                    Amount: 0,
                },

                labour: {
                    labourAmount: 0,
                },

                OtherCh: {
                    OtherAmount: 0,
                }
            };

            // eslint-disable-next-line array-callback-return
            // console.log(json);

            totdis = totdis + e?.DiscountAmt;
            mainTotal.totAmount.TotalAmount += e?.TotalAmount;
            mainTotal.totOthAmt.Amount += e?.OtherCharges + e?.MiscAmount;
            mainTotal.totalgrosswt.grosswt += e?.grosswt;
            mainTotal.totalnetwt.netwt += e?.NetWt;
            totAmt += e?.TotalAmount;
            totLbrAmt += e?.MakingAmount;
            totOthAmt += e?.OtherCharges;
            totmiscAmt += e?.MiscAmount;

            json2.map((ele) => {

                if (ele?.StockBarcode === e?.SrJobno) {
                    if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
                        diamondlist.push(ele);
                        totals.diamonds.Pcs += ele?.Pcs;
                        totals.diamonds.Wt += ele?.Wt;
                        totals.diamonds.Amount += ele?.Amount;
                        totals.diamonds.Rate += ele?.Rate;
                        mainTotal.diamonds.Pcs += ele?.Pcs;
                        mainTotal.diamonds.Wt += ele?.Wt;
                        mainTotal.diamonds.Rate += ele?.Rate;
                        mainTotal.diamonds.Amount += ele?.Amount;
                    }

                    if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
                        colorstonelist.push(ele);
                        totals.colorstone.Pcs += ele?.Pcs;
                        totals.colorstone.Wt += ele?.Wt;
                        totals.colorstone.Amount += ele?.Amount;
                        totals.colorstone.Rate += ele?.Rate;
                        mainTotal.colorstone.Pcs += ele?.Pcs;
                        mainTotal.colorstone.Wt += ele?.Wt;
                        mainTotal.colorstone.Rate += ele?.Rate;
                        mainTotal.colorstone.Amount += ele?.Amount;
                    }
                    if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
                        misclist.push(ele);
                        totals.colorstone.Pcs += ele?.Pcs;
                        totals.colorstone.Wt += ele?.Wt;
                        totals.colorstone.Amount += ele?.Amount;
                        totals.colorstone.Rate += ele?.Rate;
                        mainTotal.misc.Pcs += ele?.Pcs;
                        mainTotal.misc.Wt += ele?.Wt;
                        mainTotal.misc.Rate += ele?.Rate;
                        mainTotal.misc.Amount += ele?.Amount;
                    }
                    if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                        metallist.push(ele);
                        totals.metal.Pcs += ele?.Pcs;
                        totals.metal.Wt += ele?.Wt;
                        totals.metal.Amount += ele?.Amount;
                        totals.metal.Rate += ele?.Rate;
                        mainTotal.metal.Pcs += ele?.Pcs;
                        mainTotal.metal.Wt += ele?.Wt;
                        mainTotal.metal.Rate += ele?.Rate;
                        mainTotal.metal.Amount += ele?.Amount;
                    }
                    if (ele?.MasterManagement_DiamondStoneTypeid === 5) {
                        findinglist.push(ele);
                        totals.finding.Pcs += ele?.Pcs;
                        totals.finding.Wt += ele?.Wt;
                        totals.finding.Amount += ele?.Amount;
                        totals.finding.Rate += ele?.Rate;
                        mainTotal.finding.Pcs += ele?.Pcs;
                        mainTotal.finding.Wt += ele?.Wt;
                        mainTotal.finding.Rate += ele?.Rate;
                        mainTotal.finding.Amount += ele?.Amount;
                    }
                }
                // console.log(mainTotal);
            });

            let obj = { ...e };
            obj.diamondsDetails = diamondlist;
            obj.colorstoneDetails = colorstonelist;
            obj.metalDetails = metallist;
            obj.miscDetails = misclist;
            obj.findingDetails = findinglist;
            obj.AllJobsTotal = mainTotal;
            obj.JobWiseTotal = totals;
            resultArr.push(obj);
            setResultArray(resultArr);

        });
        let arr = [];

        json2.map((ele) => {
            if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                if (arr.length === 0) {
                    arr.push(ele);
                } else {
                    let findIndex = arr.findIndex(e => e?.ShapeName === ele?.ShapeName && e?.Rate === ele?.Rate && e?.QualityName === ele?.QualityName);
                    if (findIndex === -1) {
                        arr.push(ele);
                    } else {
                        arr[findIndex].Wt += ele?.Wt;
                        arr[findIndex].Amount += ele?.Amount;

                    }
                }
            }
            else if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
                if (arr.length === 0) {
                    arr.push(ele);
                } else {
                    let findIndex = arr.findIndex(e => e?.Rate === ele?.Rate);
                    if (findIndex === -1) {
                        arr.push(ele);
                    } else {
                        arr[findIndex].Wt += ele?.Wt;
                        arr[findIndex].Amount += ele?.Amount;
                    }
                }
            }
            else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
                if (arr.length === 0) {
                    arr.push(ele);
                } else {
                    let findIndex = arr.findIndex(e => e?.Rate === ele?.Rate);
                    if (findIndex === -1) {
                        arr.push(ele);
                    } else {
                        arr[findIndex].Wt += ele?.Wt;
                        arr[findIndex].Amount += ele?.Amount;
                    }
                }
            }
            else if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
                if (arr.length === 0) {
                    arr.push(ele);
                } else {
                    let findIndex = arr.findIndex(e => e?.Rate === ele?.Rate);
                    if (findIndex === -1) {
                        arr.push(ele);
                    } else {
                        arr[findIndex].Wt += ele?.Wt;
                        arr[findIndex].Amount += ele?.Amount;
                    }
                }
            }
        });

        arr.map((e) =>
            groupedAmtTotal += e?.Amount
        );

        groupedAmtTotal = groupedAmtTotal + totLbrAmt + totOthAmt;
        let obj1 = {
            ShapeName: 'OTHER',
            QualityName: '',
            Amount: totOthAmt,
        };
        let obj2 = {
            ShapeName: 'LABOUR',
            QualityName: '',
            Amount: totLbrAmt,
        };
        let obj3 = {
            ShapeName: 'MISC',
            QualityName: '',
            Amount: totmiscAmt,
        };
        let LOM = [];
        LOM.push(obj3, obj2, obj1);
        setLOM(LOM);
        setGroupedArrAmountTotal(groupedAmtTotal);
        setGroupedArr(arr);

        setMainTotal(mainTotal);

        let grandTot = totAmt + json?.AddLess + json?.TotalCGSTAmount + json?.TotalSGSTAmount;
        let words = CapitalizeWords(convertor.toWords(Math.round(grandTot)));
        setInWords(words);
        setGrandTotal(grandTot);
        setTotDiscount(totdis);
        const groupedData = arr.reduce((result, item) => {
            let groupName;

            switch (item.MasterManagement_DiamondStoneTypeid) {
                case 1:
                    groupName = "Diamond";
                    break;
                case 2:
                    groupName = "ColorStone";
                    break;
                case 3:
                    groupName = "CZ";
                    break;
                case 4:
                    groupName = "Gold";
                    break;
                default:
                    groupName = "Other";
            }

            // Initialize the group if it doesn't exist
            if (!result[groupName]) {
                result[groupName] = [];
            }

            // Add the item to the corresponding group
            result[groupName].push(item);

            return result;
        }, {});

        const groupNamesArray = Object.keys(groupedData);
        const sentence = groupNamesArray.join(', ');
        setDescArr(sentence);
    };


    useEffect(() => {
        loadData();
    }, []);

    ;

    // const printDocument = () => {
    //     const input = document.getElementById("divToPrint");
    //     html2canvas(input).then((canvas) => {
    //         const imgData = canvas.toDataURL("image/png");
    //         const pdf = new jsPDF();
    //         pdf.addImage(imgData, "JPEG", 0, 0);
    //         pdf.save("download.pdf");
    //     });
    // };
    // console.log(groupedArr);
    return (
        <>
            {/* <button onClick={printDocument}>Print</button> */}
            <div className='containerinvp3' id="divToPrint">
                <div className='headinvp3'>
                    <div className='headerinvp3'>
                        <div className='head1invp3'>
                            {/* <p className='fw-bold'>BILL NO</p><p className='fsinvp3' dangerouslySetInnerHTML={{ __html: headerData?.PrintRemark}}></p> */}
                            <p className='fw-bold fsinvp3'>BILL NO</p><p className='fsinvp3'>{headerData?.PrintRemark}</p>
                        </div>
                        <div className='head1invp3'>
                            <p className='fw-bold fsinvp3'>DATE</p><p className='fsinvp3'>{headerData?.EntryDate}</p>
                        </div>
                        <div className='head1invp3'>
                            <p className='fw-bold fsinvp3'>HSN</p><p className='fsinvp3'>{headerData?.HSN_No}</p>
                        </div>
                    </div>
                </div>
                <div className='header2invp3'>
                    <div>
                        <p className='fw-bold fs-6'>{headerData?.customerfirmname}</p>
                        <p className='fsinvp3'>{headerData?.customerstreet}</p>
                        <p className='fsinvp3'>{headerData?.customerregion}</p>
                        <p className='fsinvp3'>{headerData?.customercity} {headerData?.customerpincode}</p>
                        <p className='fsinvp3'>Mobile : {headerData?.customermobileno}</p>
                    </div>
                    <div>
                        <p className='d-flex justify-content-between winvp3'>
                            <p className='fw-bold fsinvp3'>{headerData?.vat_cst_pan?.split("|")?.[0]}</p>
                            {/* <p className='fw-bold'>{headerData?.vat_cst_pan?.split("|")?.[1]}</p> */}
                            {/* <p className='w-50 fw-bold fsinvp3'>GSTIN :</p><p className='w-50 fsinvp3'>{headerData?.vat_cst_pan?.split("-")[1]}</p> */}
                        </p>
                        <p className='fw-bold fsinvp3'>{headerData?.vat_cst_pan?.split("|")?.[1]}</p>
                        <p className='d-flex justify-content-between winvp3'><p className='w-50 fw-bold fsinvp3'>{headerData?.Cust_CST_STATE} :</p><p className='w-50 fsinvp3'>{headerData?.Cust_CST_STATE_No}</p></p>
                    </div>
                </div>
                <div className='d-flex'>
                    <div className='descinvp3'>
                        <div className='discHeadinvp3'>DESCRIPTION</div>
                        <div className='discBodyinvp3'>
                            <div>
                                <p>{descArr}</p>
                            </div>
                        </div>
                        <div className='totspaceinvp3'></div>
                    </div>
                    <div className='tableinvp3'>
                        <div className='theadinvp3'>
                            {/* <p className='wp1invp3 fsinvp3' style={{ borderRight: "2px solid #d8d7d7" }}>DESCRIPTION</p> */}
                            <p className='wp1invp3 fsinvp3' style={{ justifyContent: "flex-start", paddingLeft: "3px" }}>DETAIL</p>
                            <p className='wp3invp3 fsinvp3'>WEIGHT</p>
                            <p className='wp3invp3 fsinvp3'>RATE</p>
                            <p className='wp3invp3 fsinvp3'>AMOUNT</p>
                        </div>
                        <div className='tablebodyinvp3'>
                            {
                                // json1?.map((e, i) => {
                                groupedArr?.map((e, i) => {
                                    return (
                                        <>
                                            <div className='tbodyinvp3'>
                                                {/* <p className='wp1tbinvp3 brrightinvp3 fsinvp3'>{e?.MasterManagement_DiamondStoneTypeid === 4 && 'Gold' }
                                            {e?.MasterManagement_DiamondStoneTypeid === 1 && 'Gold Diamond' }
                                            {e?.MasterManagement_DiamondStoneTypeid === 2 && 'Gold Diamond ColorStone'}
                                            {e?.MasterManagement_DiamondStoneTypeid === 3 && 'Gold Diamond ColorStone CZ'}</p> */}
                                                <p className='wp1tbinvp3 fsinvp3'>{e?.MasterManagement_DiamondStoneTypeid === 4 ? e?.ShapeName + " " + e?.QualityName : e?.MasterManagement_DiamondStoneTypeName}</p>
                                                <p className='wp3tbinvp3 fsinvp3'>{e?.Wt?.toFixed(3)}</p>
                                                <p className='wp3tbinvp3 fsinvp3'>{e?.Rate}</p>
                                                <p className='wp3tbinvp3 fsinvp3'>{e?.Amount?.toFixed(2)}</p>
                                            </div>
                                        </>
                                    );
                                })
                            }
                            {
                                LOM.map((e) => {
                                    return (
                                        <>
                                            <div className='tbodyinvp3'>
                                                {/* <p className='wp1tbinvp3 brrightinvp3 fsinvp3'></p> */}
                                                {((e?.ShapeName === 'MISC') && (e?.Amount === 0)) ? '' : <p className='wp1tbinvp3 fsinvp3'>{e?.ShapeName}</p>}
                                                <p className='wp3tbinvp3 fsinvp3'>{e?.Wt?.toFixed(3)}</p>
                                                <p className='wp3tbinvp3 fsinvp3'>{e?.Rate}</p>
                                                {((e?.ShapeName === 'MISC') && (e?.Amount === 0)) ? '' : <p className='wp3tbinvp3 fsinvp3'>{e?.Amount?.toFixed(2)}</p>}
                                            </div>
                                        </>
                                    );
                                })
                            }
                            <div className='tbodyinvp3 brtopinvp3'>
                                {/* <p className='wp1tbinvp3 brrightinvp3'></p> */}
                                <p className='wp1tbinvp3 fw-bold fsinvp3 px-2'>TOTAL</p>
                                <p className='wp3tbinvp3'></p>
                                <p className='wp3tbinvp3'></p>
                                <p className='wp3tbinvp3 fw-bold fsinvp3'>{groupedArrAmountTotal?.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='summaryinvp3'>
                    <div className='totalinvp3'>
                        <p className='d-flex justify-content-between px-2'><p className='w-50 text-start fsinvp3'>Discount</p><p className='w-50 text-end fsinvp3'>{totDiscount?.toFixed(2)}</p></p>
                        <p className='d-flex justify-content-between px-2'><p className='fw-bold fsinvp3'>Total Amount</p><p className='w-50 text-end fsinvp3'>{mainTotal?.totAmount?.TotalAmount?.toFixed(2)}</p></p>
                        <p className='d-flex justify-content-between px-2'><p className='fsinvp3'>CGST @ {headerData?.CGST?.toFixed(2)}%</p><p className='w-50 text-end fsinvp3'>{headerData?.TotalCGSTAmount?.toFixed(2)}</p></p>
                        <p className='d-flex justify-content-between px-2'><p className='fsinvp3'>SGST @ {headerData?.SGST?.toFixed(2)}%</p><p className='w-50 text-end fsinvp3'>{headerData?.TotalSGSTAmount?.toFixed(2)}</p></p>
                        <p className='d-flex justify-content-between px-2'><p className='fsinvp3'>{headerData?.AddLess > 0 ? 'Add' : 'Less'}</p><p className='w-50 text-end fsinvp3'>{headerData?.AddLess}</p></p>
                        <p className='d-flex justify-content-between px-2 mt-1' style={{ borderTop: "5px solid #e8e8e8" }}><p className='fw-bold fsinvp3'>Grand Total</p><p className='fw-bold w-50 text-end fsinvp3'>{grandTotal}</p></p>
                    </div>
                    <div className='wordsinvp3 fsinvp3 px-2 fw-bold'><p>Rs.Nine Thousand One Hundred and Thirty-Seven Point Fifty-Six Only.</p></div>
                    <div className='wordsinvp3 fsinvp3'><p className='fw-bold px-2'>NOTE:</p><p className='fsinvp3'>{headerData?.PrintRemark}</p></div>
                </div>
            </div>

        </>
    );
};

export default InvoicePrint3;