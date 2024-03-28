// import React, { useEffect, useState } from 'react'
// import style from "../../assets/css/prints/retailInvoicePrint6.module.css";
// import { ToWords } from 'to-words';
// import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
// import { cloneDeep } from 'lodash';
// import Loader from '../../components/Loader';
// import {
//     HeaderComponent,
//     NumberWithCommas,
//     apiCall,
//     handleImageError,
//     handlePrint,
//     isObjectEmpty,
//     taxGenrator,
//     FooterComponent,
//     fixedValues,
// } from "../../GlobalFunctions";

// const RetailInvoicePrint6 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
//     const [msg, setMsg] = useState("");
//     const [loader, setLoader] = useState(true);
//     const toWords = new ToWords();
//     const [data, setData] = useState({});
//     const [label, setlabel] = useState([]);
//     const [headerData, setHeaderData] = useState({});
//     const [header, setHeader] = useState(null);
//     const [footer, setFooter] = useState(null);
//     const [document, setDocument] = useState({
//         aadharcard: "",
//         nri: "",
//         passport: "",
//     });
//     const [isImageWorking, setIsImageWorking] = useState(true);
//   const handleImageErrors = () => {
//     setIsImageWorking(false);
//   };
//     const loadData = (data) => {
//         let head = HeaderComponent("1", data?.BillPrint_Json[0]);
//         setHeader(head);
//         let footers = FooterComponent("2", data?.BillPrint_Json[0]);
//         setFooter(footers);
//         setHeaderData(data?.BillPrint_Json[0]);
//         let printArr = data?.BillPrint_Json[0]?.Printlable.split("\r\n");
//         setlabel(printArr);
//         let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
//         let resultArray = [];
//         datas?.resultArray?.forEach((e, i) => {
//             let obj = cloneDeep(e);
//             let diamondRate = e?.diamonds?.reduce((acc, cobj) => acc + cobj?.Rate, 0);
//             diamondRate = diamondRate / e?.diamonds?.length;
//             obj.diamondRate = diamondRate / data?.BillPrint_Json[0]?.CurrencyRate;
//             let metalRate = e?.metal?.reduce((acc, cObj) => acc + cObj?.Rate, 0);
//             obj.metalRate = metalRate / data?.BillPrint_Json[0]?.CurrencyRate;
//             resultArray.push(obj);
//         });
//         datas.resultArray = resultArray;
//         setData(datas);
//         let documentDetails = data?.BillPrint_Json[0]?.DocumentDetail.split("#@#");
//         let documents = {
//             aadharcard: "",
//             nri: "",
//             passport: "",
//         };
//         documentDetails?.forEach((e, i) => {
//             let data = e?.split("#-#");
//             if (data[0] === "Aadhar Card") {
//                 documents.aadharcard = data[1];
//             } else if (data[0] === "NRI ID") {
//                 documents.nri = data[1];
//             } else if (data[0] === "FOREIGN PASSPORT") {
//                 documents.passport = data[1];
//             }
//         });
//         setDocument(documents);
//     }

//     useEffect(() => {
//         const sendData = async () => {
//             try {
//                 const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
//                 if (data?.Status === '200') {
//                     let isEmpty = isObjectEmpty(data?.Data);
//                     if (!isEmpty) {
//                         loadData(data?.Data);
//                         setLoader(false);
//                     } else {
//                         setLoader(false);
//                         setMsg("Data Not Found");
//                     }
//                 } else {
//                     setLoader(false);
//                     setMsg(data?.Message);
//                 }
//             } catch (error) {
//                 console.error(error);
//             }
//         }
//         sendData();
//     }, []);

//     return (
//         loader ? <Loader /> : msg === "" ? <>
//             <div className={`container max_width_container ${style?.retailInvoicePrint6} pad_60_allPrint px-1 mt-1`}>
//                 {/* buttons */}
//                 <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
//                     <div className="form-check ps-3">
//                         <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
//                     </div>
//                 </div>
//                 {/* header */}
//                 {header}
//                 {/* sub header */}
//                 <div className="border d-flex">
//                     <div className="col-7 border-end p-2">
//                         <p>{headerData?.lblBillTo}</p>
//                         <p className='fw-bold'>{headerData?.CustName}</p>
//                         <p>{headerData?.customerAddress1}</p>
//                         <p>{headerData?.customerAddress2}</p>
//                         <p>{headerData?.customercity}{headerData?.customerpincode}</p>
//                         <p>{headerData?.customercountry}</p>
//                         <p>{headerData?.customeremail1}</p>
//                         <p>Phno:{headerData?.customermobileno}</p>
//                         <p>{headerData?.vat_cst_pan}</p>
//                         <p>{headerData?.Cust_CST_STATE} {headerData?.Cust_CST_STATE_No}</p>
//                     </div>
//                     <div className="col-5 p-2">
//                         <div className="d-flex">
//                             <div className="col-6"> <p className='fw-bold'>INVOICE NO</p> </div>
//                             <div className="col-6"> <p>{headerData?.InvoiceNo}</p> </div>
//                         </div>
//                         <div className="d-flex">
//                             <div className="col-6"> <p className='fw-bold'>DATE</p> </div>
//                             <div className="col-6"> <p>{headerData?.EntryDate}</p> </div>
//                         </div>
//                         <div className="d-flex">
//                             <div className="col-6"> <p className='fw-bold'>{headerData?.HSN_No_Label} </p> </div>
//                             <div className="col-6"> <p>{headerData?.HSN_No}</p> </div>
//                         </div>
//                         <div className="d-flex">
//                             <div className="col-6"> <p className='fw-bold'>Reverse Charge </p> </div>
//                             <div className="col-6 d-flex"> <input type="checkbox" /> <p className='px-1'> Yes</p> <input type="checkbox" /> <p className='px-1'> No</p> </div>
//                         </div>
//                         <div className="d-flex">
//                             <div className="col-6"> <p className='fw-bold'>AADHAR CARD </p> </div>
//                             <div className="col-6 d-flex">  <p className='px-1'>{document?.aadharcard}</p>  </div>
//                         </div>
//                         <div className="d-flex">
//                             <div className="col-6"> <p className='fw-bold'>NRI ID </p> </div>
//                             <div className="col-6 d-flex">  <p className='px-1'>{document?.nri}</p>  </div>
//                         </div>
//                         <div className="d-flex">
//                             <div className="col-6"> <p className='fw-bold'>FOREIGN PASSPORT</p> </div>
//                             <div className="col-6 d-flex">  <p className='px-1'>{document?.passport}</p>  </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* table header */}
//                 <div className="pt-1">
//                     <div className=" d-flex border">
//                         <div className={`${style?.Sr} py-1 d-flex justify-content-center align-items-center border-end`}><p className="fw-bold">Sr#</p></div>
//                         <div className={`${style?.Product} py-1 d-flex justify-content-center align-items-center border-end`}><p className="fw-bold">Product Description</p></div>
//                         <div className={`${style?.Material} border-end`}>
//                             <div className="d-grid h-100">
//                                 <div className="d-flex border-bottom"><p className="fw-bold w-100 text-center py-1">Material Description</p></div>
//                                 <div className="d-flex">
//                                     <p className="fw-bold col-2 text-center border-end py-1">Material</p>
//                                     <p className="fw-bold col-2 text-center border-end py-1">Carat</p>
//                                     <p className="fw-bold col-2 text-center border-end py-1">GWT</p>
//                                     <p className="fw-bold col-2 text-center border-end py-1">STONE/DIA Wt.</p>
//                                     <p className="fw-bold col-2 text-center border-end py-1">NWT</p>
//                                     <p className="fw-bold col-2 text-center py-1">Rate</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className={`${style?.Making} py-1 d-flex justify-content-center align-items-center border-end`}><p className="fw-bold">Making</p></div>
//                         <div className={`${style?.Others} py-1 d-flex justify-content-center align-items-center border-end`}><p className="fw-bold">Others</p></div>
//                         <div className={`${style?.Total} py-1 d-flex justify-content-center align-items-center`}><p className="fw-bold">Total</p></div>
//                     </div>
//                 </div>
//                 {/* table body */}
//                 {data?.resultArray?.map((e, i) => {
//                     return <div className=" d-flex border-start border-end border-bottom no_break" key={i}>
//                         <div className={`${style?.Sr} p-1 d-flex justify-content-center align-items-center border-end`}><p className=" text-center">{NumberWithCommas(i + 1, 0)}</p></div>
//                         <div className={`${style?.Product} p-1 border-end`}>
//                             <p className="">{e?.SubCategoryname}  {e?.Categoryname} </p>
//                             <p className="">{e?.designno} | {e?.SrJobno}</p>
//                             <img src={e?.DesignImage} alt="" className='imgWidth' onError={handleImageError} />
//                             <p className="text-center">HUID-{e?.HUID}</p>
//                         </div>
//                         <div className={`${style?.Material} border-end`}>
//                             <div className="d-grid h-100">
//                                 <div className="d-flex border-bottom" >
//                                     <p className=" col-2 border-end p-1">{e?.MetalType}</p>
//                                     <div className=" col-2 border-end p-1">
//                                         <p>{NumberWithCommas(e?.totals?.metal?.Wt * 5, 3)}</p>
//                                         <p>{NumberWithCommas(e?.Tunch, 2)}%</p>
//                                         {e?.other_details?.map((elem, index) => {
//                                             return <p key={index}>{elem?.label}</p>
//                                         })}
//                                     </div>
//                                     <p className=" col-2 text-end border-end p-1">{NumberWithCommas(e?.grosswt, 3)}</p>
//                                     <p className=" col-2 text-end border-end p-1"></p>
//                                     <p className=" col-2 text-end border-end p-1">{NumberWithCommas(e?.NetWt, 3)}</p>
//                                     <p className=" col-2 text-end p-1">{NumberWithCommas(e?.metalRate, 2)}</p>
//                                 </div>

//                                 {e?.totals?.diamonds?.Wt !== 0 && <div className="d-flex border-bottom">
//                                     <p className="col-2 border-end p-1">Diamond</p>
//                                     <div className="col-2 border-end p-1"><p></p></div>
//                                     <p className="col-2 text-end border-end p-1"></p>
//                                     <p className="col-2 text-end border-end p-1">{NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}</p>
//                                     <p className="col-2 text-end border-end p-1"></p>
//                                     <p className="col-2 text-end p-1">{NumberWithCommas(e?.diamondRate, 2)}</p>
//                                 </div>
//                                 }

//                                 {e?.totals?.colorstone?.Wt !== 0 && <div className="d-flex border-bottom">
//                                     <p className="col-2 border-end p-1">Colorstone</p>
//                                     <div className="col-2 border-end p-1"><p></p></div>
//                                     <p className="col-2 text-end border-end p-1"></p>
//                                     <p className="col-2 text-end border-end p-1">{NumberWithCommas(e?.totals?.colorstone?.Wt, 3)}</p>
//                                     <p className="col-2 text-end border-end p-1"></p>
//                                     <p className="col-2 text-end p-1">{NumberWithCommas(e?.totals?.colorstone?.Amount, 2)}</p>
//                                 </div>
//                                 }

//                                 {e?.totals?.misc?.Wt !== 0 && <div className="d-flex border-bottom">
//                                     <p className="col-2 border-end p-1">Misc</p>
//                                     <div className="col-2 border-end p-1"><p></p></div>
//                                     <p className="col-2 text-end border-end p-1"></p>
//                                     <p className="col-2 text-end border-end p-1">{NumberWithCommas(e?.totals?.misc?.Wt, 3)}</p>
//                                     <p className="col-2 text-end border-end p-1"></p>
//                                     <p className="col-2 text-end p-1">{NumberWithCommas(e?.totals?.misc?.Amount, 2)}</p>
//                                 </div>
//                                 }

//                                 {e?.totals?.finding?.Wt !== 0 && <div className="d-flex border-bottom">
//                                     <p className="col-2 border-end p-1"></p>
//                                     <div className="col-2 border-end p-1"><p></p></div>
//                                     <p className="col-2 text-end border-end p-1"></p>
//                                     <p className="col-2 text-end border-end p-1">{NumberWithCommas(e?.totals?.finding?.Wt, 3)}</p>
//                                     <p className="col-2 text-end border-end p-1"></p>
//                                     <p className="col-2 text-end p-1"></p>
//                                 </div>
//                                 }

//                             </div>
//                         </div>
//                         <div className={`${style?.Making} p-1 border-end text-end`}><p className="">{NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p></div>
//                         <div className={`${style?.Others} p-1 border-end text-end`}><p className="">{NumberWithCommas(e?.OtherCharges, 2)}</p></div>
//                         <div className={`${style?.Total} p-1 text-end`}><p className="">{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
//                     </div>
//                 })
//                 }
//                 {/* table total */}
//                 <div className=" d-flex border-start border-end border-bottom no_break">
//                     <div className={`${style?.Sr} p-1 d-flex justify-content-center align-items-center border-end`}></div>
//                     <div className={`${style?.Product} p-1 border-end`}><p className="fw-bold">TOTAL</p></div>
//                     <div className={`${style?.Material} border-end d-flex `}>
//                         <p className=" col-2 border-end p-1"></p>
//                         <p className=" col-2 border-end p-1"></p>
//                         <p className=" col-2 text-end border-end p-1 fw-bold">{NumberWithCommas(data?.mainTotal?.grosswt, 3)}</p>
//                         <div className=" col-2 text-end border-end p-1 fw-bold">
//                             <p>{NumberWithCommas(data?.mainTotal?.diamonds?.Wt + data?.mainTotal?.colorstone?.Wt + data?.mainTotal?.finding?.Wt, 3)} Ctw</p>
//                             <p>{NumberWithCommas(data?.mainTotal?.metal?.Wt, 3)} gm</p>
//                         </div>
//                         <p className=" col-2 text-end border-end p-1 fw-bold">{NumberWithCommas(data?.mainTotal?.netwt, 3)}</p>
//                         <p className=" col-2 text-end p-1"></p>
//                     </div>
//                     <div className={`${style?.Making} p-1 border-end text-end`}><p className=""></p></div>
//                     <div className={`${style?.Others} p-1 border-end text-end`}><p className="fw-bold">{NumberWithCommas(data?.mainTotal?.total_other_charges, 2)}</p></div>
//                     <div className={`${style?.Total} p-1 text-end`}><p className="fw-bold">{NumberWithCommas(data?.mainTotal?.total_amount / headerData?.CurrencyRate, 2)}</p></div>
//                 </div>
//                 {/* in words */}
//                 <div className="d-flex border-start border-end border-bottom no_break">
//                     <div className={`${style?.inwords} border-end d-flex flex-column justify-content-between py-1`}>
//                         <div></div>
//                         <div>
//                             <p className='px-1'>In Words Indian Rupees</p>
//                             <p className='px-1 fw-bold'>{toWords?.convert(+fixedValues(data?.finalAmount / headerData?.CurrencyRate, 2))} Only</p>
//                         </div>
//                         <div><p className='px-1'>Old Gold Purchase Description : <span className="fw-bold">{headerData?.PrintRemark}</span>	</p></div>
//                     </div>
//                     <div className={`${style?.taxes} border-end`}>
//                         <p className="text-end px-1">Discount</p>
//                         <p className="text-end px-1">Total Amt. before Tax</p>
//                         {data?.AllTaxes?.map((e, i) => {
//                             return <p className="text-end px-1" key={i}>{e?.label} @ {e?.per}%</p>
//                         })}
//                         {headerData?.AddLess !== 0 && <p className="text-end px-1">{headerData?.AddLess > 0 ? "Add" : "Less"}</p>}
//                         <p className="text-end px-1">Total Amt. after Tax</p>
//                         <p className="text-end px-1">Old Gold</p>
//                         <p className="text-end px-1">Recv.in Cash</p>
//                         <p className="text-end px-1">Recv.in Bank</p>
//                         <p className="text-end px-1">Net Bal. Amount</p>
//                         <p className="text-end mt-1 border-top p-1 fw-bold">GRAND TOTAL</p>
//                     </div>
//                     <div className={`${style?.Total}`}>
//                         <p className='text-end px-1'>{NumberWithCommas(data?.mainTotal?.total_discount_amount, 2)}</p>
//                         <p className='text-end px-1'>{NumberWithCommas(data?.mainTotal?.total_unitcost/headerData?.CurrencyRate, 2)}</p>
//                         {data?.AllTaxes?.map((e, i) => {
//                             return <p className="text-end px-1" key={i}>{e?.amount}</p>
//                         })}
//                             {headerData?.AddLess !== 0 && <p className="text-end px-1">{NumberWithCommas(headerData?.AddLess, 2)}</p>}
//                         <p className='text-end px-1'>{NumberWithCommas(data?.mainTotal?.total_amount / headerData?.CurrencyRate, 2)}</p>
//                         <p className='text-end px-1'>{NumberWithCommas(headerData?.OldGoldAmount, 2)}</p>
//                         <p className='text-end px-1'>{NumberWithCommas(headerData?.CashReceived, 2)}</p>
//                         <p className='text-end px-1'>{NumberWithCommas(headerData?.BankReceived, 2)}</p>
//                         <p className='text-end px-1'>{NumberWithCommas(data?.mainTotal?.total_amount / headerData?.CurrencyRate, 2)}</p>
//                         <p className="text-end mt-1 border-top p-1 fw-bold">{NumberWithCommas(data?.finalAmount / headerData?.CurrencyRate, 2)}</p>
//                     </div>
//                 </div>
//                 {/* declaration */}
//                 <div className="border-start border-end border-bottom p-2 no_break">
//                         <div dangerouslySetInnerHTML={{__html: headerData?.Declaration}}></div>
//                 </div>
//                 {/* bank details */}
//                 {footer}
//             </div>
//             {/* <SampleDetailPrint11 /> */}
//         </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
//     )
// }

// export default RetailInvoicePrint6
import React, { useState, useEffect } from "react";
import "../../assets/css/prints/jewellaryinvoiceprint.css";
import style from "../../assets/css/prints/jewelleryRetailinvoicePrint3.module.css";
import {
    apiCall,
    CapitalizeWords,
    fixedValues,
    GovernMentDocuments,
    handleImageError,
    isObjectEmpty,
    NumberWithCommas,
    ReceiveInBank,
    taxGenrator,
} from "../../GlobalFunctions";
import Button from "../../GlobalFunctions/Button";
import Loader from "../../components/Loader";
import { ToWords } from 'to-words';

const RetailInvoiceprint6 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [headerData, setHeaderData] = useState({});
    const [data, setdata] = useState([]);
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const toWords = new ToWords();
    const [image, setImage] = useState(true);
    const [total, setTotal] = useState({
        gwt: 0,
        stoneWt: 0,
        diaColorWt: 0,
        nwt: 0,
        metalMaking: 0,
        others: 0,
        total: 0,
        discount: 0,
        afterTax: 0,
        netBalAmount: 0,
        beforeTax: 0,
        diamondColorStoneWt: 0,
        multiMetalMiscHsCode: 0,
    });
    const [isImageWorking, setIsImageWorking] = useState(true);
    const handleImageErrors = () => {
        setIsImageWorking(false);
    };
    const [taxes, setTaxes] = useState([]);
    const [bank, setBank] = useState([]);
    const [document, setDocument] = useState([]);
    function loadData(data) {
        try {
            setHeaderData(data?.BillPrint_Json[0]);
            let blankArr = [];
            let totals = { ...total };
            let groupInfo = [];
            data?.BillPrint_Json1.forEach((e, i) => {
                let obj = { ...e };
                totals.gwt += e?.grosswt;
                totals.beforeTax += e?.TotalAmount;
                // totals.nwt += e?.NetWt;
                totals.nwt += e?.MetalDiaWt;
                totals.others += e?.OtherCharges;
                totals.total += e?.UnitCost;
                totals.discount += e?.DiscountAmt;
                let hallmarkingCount = 0;
                let materials = [];
                let primaryMetal = [];
                let otherMetals = [];
                let diamonds = [];
                let colorstones = [];
                let miscs = [];
                let finding = [];
                let diamondAmount = 0;
                let diamondWt = 0;
                let diamondRate = 0;
                let colorStoneAmount = 0;
                let colorStoneWt = 0;
                let colorStoneRate = 0;
                let miscsAmount = 0;
                let miscsWt = 0;
                let miscsRate = 0;
                let findingWt = 0;

                let metalMaking = obj?.MetalAmount + obj?.MakingAmount;
                data?.BillPrint_Json2.forEach((ele, ind) => {
                    if (e?.SrJobno === ele?.StockBarcode) {
                        if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                            materials.unshift(ele)
                            if (ele?.IsPrimaryMetal === 1) {
                                primaryMetal?.push(ele);
                            } else {
                                otherMetals?.push(ele);
                                totals.multiMetalMiscHsCode += ele?.Wt
                                hallmarkingCount += 1;
                            }
                        }
                        else if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
                            diamonds?.push(ele);
                            totals.diaColorWt += ele?.Wt;
                            diamondAmount += ele?.Amount;
                            diamondWt += ele?.Wt;
                            let findIndex = materials.findIndex(elem => elem?.MasterManagement_DiamondStoneTypeid === 1);
                            if (findIndex === -1) {
                                materials.push(ele);
                            } else {
                                materials[findIndex].Wt += ele?.Wt;
                                materials[findIndex].Amount += ele?.Amount;
                            }
                        }
                        else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
                            colorStoneAmount += ele?.Amount;
                            colorStoneWt += ele?.Wt;
                            colorstones?.push(ele);
                            totals.diaColorWt += ele?.Wt;
                            let findIndex = materials.findIndex(elem => elem?.MasterManagement_DiamondStoneTypeid === 2);
                            if (findIndex === -1) {
                                materials.push(ele);
                            } else {
                                materials[findIndex].Wt += ele?.Wt;
                                materials[findIndex].Amount += ele?.Amount;
                            }
                        }
                        else if (ele?.MasterManagement_DiamondStoneTypeid === 3 && ele?.IsHSCOE === 0) {
                            miscsAmount += ele?.Amount;
                            miscsWt += ele?.Wt;
                            miscs?.push(ele);
                            totals.stoneWt += ele?.Wt;
                            materials.push(ele);
                            totals.multiMetalMiscHsCode += ele?.Wt
                        } else if (ele?.MasterManagement_DiamondStoneTypeid === 5) {
                            finding?.push(ele);
                            findingWt += ele?.Wt;
                            hallmarkingCount += 1;
                        }
                    }
                });
                if (diamondWt !== 0 && diamondAmount !== 0) {
                    diamondRate = (diamondAmount / diamondWt);
                }
                if (colorStoneWt !== 0 && colorStoneAmount !== 0) {
                    colorStoneRate = (colorStoneAmount / colorStoneWt);
                }
                if (miscsWt !== 0 && miscsAmount !== 0) {
                    miscsRate = (miscsAmount / miscsWt);
                }
                obj.materials = materials;
                obj.metalMaking = metalMaking;
                obj.primaryMetal = primaryMetal;
                obj.diamondWt = diamondWt;
                obj.colorStoneWt = colorStoneWt;
                obj.miscsWt = miscsWt;
                obj.otherMetals = otherMetals;
                obj.diamonds = diamonds;
                obj.colorstones = colorstones;
                obj.miscs = miscs;
                obj.diamondRate = diamondRate;
                obj.colorStoneRate = colorStoneRate;
                obj.findingWt = findingWt
                obj.miscsRate = miscsRate;
                obj.finding = finding;
                obj.diamondAmount = diamondAmount;
                obj.colorStoneAmount = colorStoneAmount;
                obj.hallmarkingCount = hallmarkingCount
                obj.miscsAmount = miscsAmount;
                blankArr.push(obj);
                let findGroupinfo = groupInfo?.findIndex((ele, ind) => ele?.GroupJob === e?.GroupJob && e?.GroupJob !== "");
                if (findGroupinfo !== -1) {
                    groupInfo[findGroupinfo].diamondWt += diamondWt;
                    groupInfo[findGroupinfo].colorStoneWt += colorStoneWt;
                    groupInfo[findGroupinfo].miscsWt += miscsWt;
                    groupInfo[findGroupinfo].diamondAmount += diamondAmount;
                    groupInfo[findGroupinfo].colorStoneAmount += colorStoneAmount;
                    groupInfo[findGroupinfo].miscsAmount += miscsAmount;
                    groupInfo[findGroupinfo].hallmarkingCount += hallmarkingCount;
                    groupInfo[findGroupinfo].findingWt += findingWt;
                    if (e?.GroupJob === e?.SrJobno) {
                        groupInfo[findGroupinfo].designno = e?.designno;
                        groupInfo[findGroupinfo].DesignImage = e?.DesignImage;
                        groupInfo[findGroupinfo].Categoryname = e?.Categoryname;
                        groupInfo[findGroupinfo].SubCategoryname = e?.SubCategoryname;
                        groupInfo[findGroupinfo].HUID = e?.HUID;
                        groupInfo[findGroupinfo].SrJobno = e?.SrJobno;
                    }
                } else if (e?.GroupJob !== "" && findGroupinfo === -1) {
                    groupInfo?.push({
                        GroupJob: e?.GroupJob,
                        diamondWt: diamondWt,
                        colorStoneWt: colorStoneWt,
                        miscsWt: miscsWt,
                        diamondAmount: diamondAmount,
                        colorStoneAmount: colorStoneAmount,
                        miscsAmount: miscsAmount,
                        designno: e?.designno,
                        DesignImage: e?.DesignImage,
                        Categoryname: e?.Categoryname,
                        SubCategoryname: e?.SubCategoryname,
                        HUID: e?.HUID,
                        SrJobno: e?.GroupJob,
                        hallmarkingCount: hallmarkingCount,
                        findingWt: findingWt
                    });
                }
            });
            let taxValue = taxGenrator(data?.BillPrint_Json[0], totals?.total);
            taxValue.forEach((e, i) => {
                totals.afterTax += +e?.amount;
            });
            totals.afterTax += totals?.beforeTax + data?.BillPrint_Json[0]?.AddLess;
            let debitCardinfo = ReceiveInBank(data?.BillPrint_Json[0]?.BankPayDet);
            setBank(debitCardinfo);
            totals.netBalAmount = totals.afterTax - data?.BillPrint_Json[0]?.OldGoldAmount;
            debitCardinfo.length > 0 && debitCardinfo.forEach((e, i) => {
                totals.netBalAmount -= e.amount;
            });
            setTaxes(taxValue);

            blankArr?.forEach((e, i) => {
                if (e?.GroupJob !== "") {
                    let findRecord = groupInfo?.find((ele, ind) => ele?.GroupJob === e?.GroupJob);
                    if (findRecord !== undefined) {
                        // console.log(findRecord);
                        e.designno = findRecord?.designno;
                        e.SrJobno = findRecord?.SrJobno;
                        e.DesignImage = findRecord?.DesignImage;
                        e.Categoryname = findRecord?.Categoryname;
                        e.SubCategoryname = findRecord?.SubCategoryname;
                        e.diamondWt = findRecord?.diamondWt;
                        e.diamondAmount = findRecord?.diamondAmount;
                        e.colorStoneWt = findRecord?.colorStoneWt;
                        e.colorStoneAmount = findRecord?.colorStoneAmount;
                        // totals.diamondColorStoneWt += findRecord?.diamondWt + findRecord?.colorStoneWt;
                        e.miscsWt = findRecord?.miscsWt;
                        e.diamondAmount = findRecord?.diamondAmount;
                        e.colorStoneAmount = findRecord?.colorStoneAmount;
                        e.miscsAmount = findRecord?.miscsAmount;
                        e.diamondRate = (findRecord?.diamondAmount / findRecord?.diamondWt);
                        e.colorStoneRate = (findRecord?.colorStoneAmount / findRecord?.colorStoneWt);
                        e.miscsRate = (findRecord?.miscsAmount / findRecord?.miscsWt);
                        e.hallmarkingCount = findRecord?.hallmarkingCount;
                        e.findingWt = findRecord?.findingWt
                    }
                } else {
                    // totals.diamondColorStoneWt += e?.diamondWt + e?.colorStoneWt;
                }
            })
            let resultArr = [];
            blankArr.forEach((e, i) => {
                if (e?.GroupJob !== "") {
                    let findIndex = resultArr.findIndex(ele => ele?.GroupJob === e?.GroupJob && ele?.primaryMetal[0]?.Rate === e?.primaryMetal[0]?.Rate);
                    if (findIndex === -1) {
                        resultArr.push(e);
                        totals.diamondColorStoneWt += e?.diamondWt + e?.colorStoneWt;
                    } else {
                        // totals.diamondColorStoneWt += resultArr[findIndex]?.diamondWt + resultArr[findIndex]?.colorStoneWt;
                        resultArr[findIndex].MakingAmount += e?.MakingAmount;
                        resultArr[findIndex].MetalAmount += e?.MetalAmount;
                        resultArr[findIndex].OtherCharges += e?.OtherCharges;
                        resultArr[findIndex].TotalAmount += e?.TotalAmount;
                        resultArr[findIndex].UnitCost += e?.UnitCost;
                        resultArr[findIndex].grosswt += e?.grosswt;
                        resultArr[findIndex].NetWt += e?.NetWt;
                        resultArr[findIndex].LossWt += e?.LossWt;
                        let arr = [resultArr[findIndex], e];
                        let findRecord = arr.find(elem => elem?.SrJobno === e?.GroupJob);
                        resultArr[findIndex].SubCategoryname = findRecord?.SubCategoryname;
                        resultArr[findIndex].Collectionname = findRecord?.Collectionname;
                        resultArr[findIndex].designno = findRecord?.designno;
                        resultArr[findIndex].SrJobno = findRecord?.SrJobno;
                        resultArr[findIndex].DesignImage = findRecord?.DesignImage;
                        resultArr[findIndex].otherMetals = [...resultArr[findIndex].otherMetals, ...e?.otherMetals]?.flat();
                        resultArr[findIndex].primaryMetal[0].Wt += e?.primaryMetal[0]?.Wt;
                        resultArr[findIndex].primaryMetal[0].Amount += e?.primaryMetal[0]?.Amount;
                        let miscs = [...resultArr[findIndex]?.miscs, ...e?.miscs]?.flat();
                        let misc = [];
                        miscs?.forEach((ele, ind) => {
                            if (misc?.length === 0) {
                                misc?.push(ele);
                            } else {
                                misc[0].Wt += ele?.Wt;
                                misc[0].Amount += ele?.Amount;
                            }
                        })
                    }
                } else {
                    resultArr.push(e);
                    totals.diamondColorStoneWt += e?.diamondWt + e?.colorStoneWt;
                }
            });
            resultArr?.sort((a, b) => {
                let nameA = a?.designno?.toUpperCase();
                let nameB = b?.designno?.toUpperCase();
                if (nameA > nameB) {
                    return 1
                } else if (nameA < nameB) {
                    return -1
                } else {
                    return 0
                }
            });
            let documentDetail = GovernMentDocuments(data?.BillPrint_Json[0]?.DocumentDetail);
            setDocument(documentDetail);
            setdata(resultArr);
            setTotal(totals);
            console.log(data);
            console.log(resultArr);
            setLoader(false);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
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
                    setMsg(data?.Message);
                }
            } catch (error) {
                console.error(error);
            }
        };
        sendData();
    }, []);

    const handleChangeImage = (e) => {
        image ? setImage(false) : setImage(true);
    }

    return (
        <>
            {loader ? (
                <Loader />
            ) : (
                <>
                    {msg === "" ? (
                        <> <div className={`container-fluid ${style?.jewelelryRetailInvoiceContainer} pad_60_allPrint position-relative`}>
                            <div className={`btnpcl align-items-baseline position-absolute right-0 top-0 m-0 ${style?.right_jewelleryinvoicePrintc} d-flex`}>
                                <div className="form-check pe-3">
                                    <input className="form-check-input" type="checkbox" checked={image} onChange={handleChangeImage} />
                                    <label className="form-check-label pt-1" htmlFor="flexCheckDefault">
                                        With Image
                                    </label>
                                </div>
                                <Button />
                            </div>
                            <div className="pt-2 d-flex flex-column">
                                <div className="headlineJL w-100 p-2"> <b style={{ fontSize: "20px" }}> {headerData?.PrintHeadLabel} </b> </div>
                                <div className="d-flex w-100">
                                    <div className="col-10 p-2">
                                        <div className="fslhJL">
                                            <h5> <b style={{ fontSize: "16px", color: "black" }}> {headerData?.CompanyFullName} </b> </h5>
                                        </div>
                                        <div className="fslhJL">{headerData?.CompanyAddress}</div>
                                        <div className="fslhJL">
                                            {headerData?.CompanyAddress2}
                                        </div>
                                        <div className="fslhJL">
                                            {headerData?.CompanyCity}-{headerData?.CompanyPinCode},
                                            {headerData?.CompanyState}({headerData?.CompanyCountry})
                                        </div>
                                        <div className="fslhJL">
                                            T {headerData?.CompanyTellNo} | TOLL FREE {headerData?.CompanyTollFreeNo}
                                        </div>
                                        <div className="fslhJL">
                                            {headerData?.CompanyEmail} |
                                            {headerData?.CompanyWebsite}
                                        </div>
                                        {/* <div className='fslhpcl3'>{headerData?.Company_VAT_GST_No} | {headerData?.Cust_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-EDJHF236D</div> */}
                                        <div className="fslhJL">
                                            {headerData?.Company_VAT_GST_No} |
                                            {headerData?.Cust_CST_STATE}-{headerData?.Company_CST_STATE_No} | {headerData?.vat_cst_pan}
                                        </div>
                                    </div>
                                    <div className="col-2 d-flex align-items-center justify-content-center">
                                        {/* <img
                      src={headerData?.PrintLogo}
                      alt="#"
                      className={`w-100 d-block ms-auto ${style?.imgJewelleryRetailinovicePrint3}`}
                    /> */}
                                        {isImageWorking && (headerData?.PrintLogo !== "" &&
                                            <img src={headerData?.PrintLogo} alt=""
                                                className={`w-100 d-block ms-auto ${style?.imgJewelleryRetailinovicePrint3}`}
                                                onError={handleImageErrors} height={120} width={150} />)}
                                    </div>
                                </div>
                                {/* header data */}
                                <div className="d-flex border w-100 no_break">
                                    <div className="col-8 p-2 b border-end">
                                        {/* <div className="fslhJL">{headerData?.lblBillTo}</div> */}
                                        <div className="fslhJL">To,</div>
                                        <div className="fslhJL">
                                            <b className="JL13" style={{ fontSize: "14px" }}>{headerData?.CustName}</b>
                                        </div>
                                        {headerData?.customerAddress1?.length > 0 ? (
                                            <div className="fslhJL">
                                                {headerData?.customerAddress1}
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                        {headerData?.customerAddress2?.length > 0 ? (
                                            <div className="fslhJL">
                                                {headerData?.customerAddress2}
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                        {headerData?.customerAddress3?.length > 0 ? (
                                            <div className="fslhJL">
                                                {headerData?.customercity}-{headerData?.PinCode}
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                        <div className="fslhJL">
                                            {headerData?.CompanyCountry}
                                        </div>
                                        <div className="fslhJL">{headerData?.customeremail1}</div>
                                        <div className="fslhJL">Phno: {headerData?.customermobileno}</div>
                                        <div className="fslhJL">{headerData?.vat_cst_pan} {headerData?.aadharno !== "" && `| Aadhar-${headerData?.aadharno}`}</div>
                                        <div className="fslhJL">
                                            {headerData?.Cust_CST_STATE}
                                            {headerData?.Cust_CST_STATE_No}
                                        </div>
                                    </div>
                                    <div className="col-4 p-2 position-relative">
                                        <div className="d-flex">
                                            <div className="col-6">
                                                <b className="JL13">INVOICE NO</b>
                                            </div>
                                            <div className="col-6">
                                                {headerData?.InvoiceNo}
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className="col-6">
                                                <b className="JL13">DATE</b>
                                            </div>
                                            <div className="col-6">
                                                {headerData?.EntryDate}
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className="col-6">
                                                <b className="JL13">HSN</b>
                                            </div>
                                            <div className="col-6">
                                                {headerData?.HSN_No}
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className="col-6">
                                                <b className="JL13">Reverse Charge</b>
                                            </div>
                                            <div className="col-6 d-flex">
                                                <div className="d-flex pe-1">
                                                    <input type="checkbox" name="" id="" className="me-1" />
                                                    <p className="pe-1">Yes</p>
                                                </div>
                                                <div className="d-flex">
                                                    <input type="checkbox" name="" id="" className="me-1" />
                                                    <p className="pe-1">No</p>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            document?.map((e, i) => {
                                                return <div className="d-flex" key={i}>
                                                    <div className="col-6">
                                                        <b className="JL13">{e?.label}</b>
                                                    </div>
                                                    <div className="col-6">
                                                        {e?.value}
                                                    </div>
                                                </div>
                                            })
                                        }
                                        {/* {headerData?.aadharno !== "" && <div className="d-flex">
                      <div className="col-4">
                        <b className="JL13">AADHAR CARD</b>
                      </div>
                      <div className="col-8">
                        {headerData?.aadharno}
                      </div>
                    </div>} */}
                                        {/* <div className="d-flex  position-absolute w-100 pb-2 bottom-0">
                      <div className="d-flex">
                        <b className="JL13 fs-5 pe-2">24K Gold Rate</b>
                        <b className="fs-5"> {NumberWithCommas(headerData?.MetalRate24K, 2)}</b>
                      </div>
                    </div> */}
                                    </div>
                                </div>
                                {/* Table Heading */}
                                <div className="pt-1 no_break">
                                    <div className="border d-flex">
                                        <div className={`${style?.srNoJewerryRetailInvoicePrint} border-end p-1 d-flex align-items-center justify-content-center`}><p className="fw-bold">Sr#</p></div>
                                        <div className={`${style?.productJewerryRetailInvoicePrint} border-end p-1 fw-bold d-flex align-items-center justify-content-center`}><p className="fw-bold">Product Description</p></div>
                                        <div className={`${style?.materialJewerryRetailInvoicePrint} border-end`}
                                        >
                                            <div className="border-bottom">
                                                <p className="fw-bold p-1 text-center">Material Description</p>
                                            </div>
                                            <div className="d-flex">
                                                <div className={`col-2 d-flex align-items-center justify-content-center border-end`}><p className="fw-bold p-1">Material</p></div>
                                                <div className={`col-2 d-flex align-items-center justify-content-center border-end`}><p className="fw-bold p-1">Carat</p></div>
                                                <div className={`col-2 d-flex align-items-center justify-content-center border-end`}><p className="fw-bold p-1">GWT</p></div>
                                                <div className={`col-2 d-flex align-items-center justify-content-center border-end p-1 flex-column`}><p className="fw-bold">STONE/</p><p className="fw-bold">DIA Wt.</p></div>
                                                <div className={`col-2 d-flex align-items-center justify-content-center border-end`}><p className="fw-bold p-1">NWT</p></div>
                                                <div className={`col-2 d-flex align-items-center justify-content-center`}><p className="fw-bold p-1">Rate</p></div>
                                            </div>
                                        </div>
                                        <div className={`${style?.metalMakingJewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-center`}>
                                            <p className="fw-bold"> Making</p>
                                        </div>
                                        <div className={`${style?.othersJewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-center`}><p className="fw-bold">Others</p></div>
                                        <div className={`${style?.totalJewerryRetailInvoicePrint} d-flex align-items-center justify-content-center`}><p className="fw-bold">Total</p></div>
                                    </div>
                                </div>
                                {/* data */}
                                {data.length > 0 && data.map((e, i) => {
                                    return <div className="border-start border-end border-bottom d-flex no_break" key={i}>
                                        <div className={`${style?.srNoJewerryRetailInvoicePrint} border-end p-1 d-flex align-items-center justify-content-center`}><p className="">{i + 1}</p></div>
                                        <div className={`${style?.productJewerryRetailInvoicePrint} border-end p-1 `}>
                                            <p className="">{e?.SubCategoryname} {e?.Categoryname}</p>
                                            <p className="">{e?.designno} | {e?.SrJobno}</p>
                                            {image && <img src={e?.DesignImage} alt="" onError={handleImageError} lazy='eagar' className={`w-75 p-1 ${style?.imageJewelleryC}`} />}
                                            {e?.HUID !== "" && <p className={`text-center ${!image && 'pt-3'}`}>HUID-{e?.HUID}</p>}
                                        </div>
                                        <div className={`${style?.materialJewerryRetailInvoicePrint} border-end`}>
                                            <div className="d-grid h-100">
                                                {
                                                    e?.primaryMetal?.map((ele, ind) => {
                                                        return <div className={`d-flex border-bottom`} key={ind}>
                                                            <div className={`col-2 border-end d-flex align-items-center`}><p className="p-1 lh-1">{ele?.ShapeName}</p></div>
                                                            <div className={`col-2 border-end d-flex align-items-center`} style={{ wordBreak: "normal" }}><p className="p-1 lh-1" style={{ wordBreak: "normal" }}>{e?.Tunch !== 0 && NumberWithCommas(e?.Tunch, 3)}{(e?.Tunch !== 0 && ` / ${NumberWithCommas(e?.Tunch, 2)}% ${e?.hallmarkingCount !== 0 ? "Hallmarking" : ""}`)}</p></div>
                                                            <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1">{fixedValues(e?.grosswt, 3)}</p></div>
                                                            <div className={`col-2 border-end p-1 d-flex align-items-center justify-content-end`}><p className=" text-end lh-1"></p></div>
                                                            <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1">{e?.otherMetals?.length === 0 ? NumberWithCommas(e?.NetWt + e?.LossWt, 3) : NumberWithCommas(ele?.Wt, 3)}</p></div>
                                                            <div className={`col-2 d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1">{NumberWithCommas(ele?.Rate / headerData?.CurrencyExchRate, 2)}</p></div>
                                                        </div>
                                                    })
                                                }
                                                {
                                                    e?.diamondWt !== 0 && <div className={`d-flex border-bottom`} >
                                                        <div className={`col-2 border-end d-flex align-items-center`}><p className="p-1 lh-1">DIAMOND</p></div>
                                                        <div className={`col-2 border-end d-flex align-items-center`}><p className="p-1 lh-1"></p></div>
                                                        <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1"></p></div>
                                                        <div className={`col-2 border-end p-1 d-flex align-items-center justify-content-end`}><p className=" text-end lh-1">{NumberWithCommas(e?.diamondWt, 3)} </p></div>
                                                        <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1"></p></div>
                                                        <div className={`col-2 d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1">{NumberWithCommas(e?.diamondRate / headerData?.CurrencyExchRate, 2)}</p></div>
                                                    </div>
                                                }
                                                {
                                                    e?.colorStoneWt !== 0 && <div className={`d-flex border-bottom`} >
                                                        <div className={`col-2 border-end d-flex align-items-center`}><p className="p-1 lh-1">COLORSTONE</p></div>
                                                        <div className={`col-2 border-end d-flex align-items-center`}><p className="p-1 lh-1"></p></div>
                                                        <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1"></p></div>
                                                        <div className={`col-2 border-end p-1 d-flex align-items-center justify-content-end`}><p className=" text-end lh-1">{NumberWithCommas(e?.colorStoneWt, 3)} </p></div>
                                                        <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1"></p></div>
                                                        <div className={`col-2 d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1">{NumberWithCommas(e?.colorStoneRate / headerData?.CurrencyExchRate, 2)}</p></div>
                                                    </div>
                                                }
                                                {
                                                    e?.miscs?.map((ele, ind) => {
                                                        return <div className={`d-flex border-bottom`} >
                                                            <div className={`col-2 border-end d-flex align-items-center`}><p className="p-1 lh-1">MISC</p></div>
                                                            <div className={`col-2 border-end d-flex align-items-center`}><p className="p-1 lh-1"></p></div>
                                                            <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1"></p></div>
                                                            <div className={`col-2 border-end p-1 d-flex align-items-center justify-content-end`}><p className=" text-end lh-1">{NumberWithCommas(ele?.Wt, 3)}</p></div>
                                                            <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1"></p></div>
                                                            <div className={`col-2 d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1">{NumberWithCommas(ele?.Amount / ele?.Wt, 2)}</p></div>
                                                        </div>
                                                    })
                                                }
                                                {
                                                    e?.otherMetals?.length !== 0 && <div className={`d-flex border-bottom`} >
                                                        <div className={`col-2 border-end d-flex align-items-center`}><p className="p-1 lh-1"></p></div>
                                                        <div className={`col-2 border-end d-flex align-items-center`}><p className="p-1 lh-1"></p></div>
                                                        <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1"></p></div>
                                                        <div className={`col-2 border-end p-1 d-flex align-items-center justify-content-end`}><p className=" text-end lh-1">{NumberWithCommas(e?.otherMetals?.reduce((acc, cObj) => acc + cObj?.Wt, 0), 3)}</p></div>
                                                        <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1"></p></div>
                                                        <div className={`col-2 d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1"></p></div>
                                                    </div>
                                                }
                                                {e?.findingWt !== 0 && <div className={`d-flex border-bottom`} >
                                                    <div className={`col-2 border-end d-flex align-items-center`}><p className="p-1 lh-1"></p></div>
                                                    <div className={`col-2 border-end d-flex align-items-center`}><p className="p-1 lh-1"></p></div>
                                                    <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1"></p></div>
                                                    <div className={`col-2 border-end p-1 d-flex align-items-center justify-content-end`}><p className=" text-end lh-1">{NumberWithCommas(e?.findingWt, 3)}</p></div>
                                                    <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1"></p></div>
                                                    <div className={`col-2 d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1"></p></div>
                                                </div>}
                                                {
                                                    (e?.primaryMetal?.length === 0 && e?.diamondWt === 0 && e?.colorStoneWt === 0 && e?.miscsWt === 0 && e?.findingWt !== 0) && <div className="d-flex">
                                                        <div className={` border-end`}><p className="p-1 lh-1"></p></div>
                                                        <div className={` border-end`}><p className="p-1 lh-1"></p></div>
                                                        <div className={` border-end`}><p className="p-1 text-end lh-1"></p></div>
                                                        <div className={` border-end p-1 `}><p className="text-end lh-1"></p></div>
                                                        <div className={`border-end `}><p className="p-1 text-end lh-1"></p></div>
                                                        <div className={` `}><p className="p-1 text-end lh-1"></p></div>
                                                    </div>
                                                }
                                                {/* 
                        {e?.materials.length > 0 ? e?.materials.map((ele, ind) => {
                          return <div className={`d-flex ${ind !== e?.materials.length - 1 && 'border-bottom'}`} key={ind}>
                            <div className={`col-2 border-end d-flex align-items-center`}><p className="p-1 lh-1">{ele?.MasterManagement_DiamondStoneTypeid === 4 ? ele?.ShapeName : ele?.MasterManagement_DiamondStoneTypeName}</p></div>
                            <div className={`col-2 border-end d-flex align-items-center`}><p className="p-1 lh-1">{ele?.MasterManagement_DiamondStoneTypeid === 4 && ele?.QualityName}{((ind === 0 && e?.Tunch !== 0) && ` / ${NumberWithCommas(e?.Tunch, 2)}%`)}</p></div>
                            <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1">{ele?.MasterManagement_DiamondStoneTypeid === 4 && fixedValues(e?.grosswt, 3)}</p></div>
                            <div className={`col-2 border-end p-1 d-flex align-items-center justify-content-end`}><p className=" text-end lh-1">{ele?.MasterManagement_DiamondStoneTypeid !== 4 && fixedValues(ele?.Wt, 3)}</p></div>
                            <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1">{ele?.MasterManagement_DiamondStoneTypeid === 4 && fixedValues(e?.MetalDiaWt, 3)}</p></div>
                            <div className={`col-2 d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1">{ele?.MasterManagement_DiamondStoneTypeid === 4 ? NumberWithCommas(ele?.Rate, 2) : NumberWithCommas(ele?.Amount / ele?.Wt, 2)}</p></div>
                          </div>
                        }) : <div className="d-flex">
                          <div className={` border-end`}><p className="p-1 lh-1"></p></div>
                          <div className={` border-end`}><p className="p-1 lh-1"></p></div>
                          <div className={` border-end`}><p className="p-1 text-end lh-1"></p></div>
                          <div className={` border-end p-1 `}><p className="text-end lh-1"></p></div>
                          <div className={`border-end `}><p className="p-1 text-end lh-1"></p></div>
                          <div className={` `}><p className="p-1 text-end lh-1"></p></div>
                        </div>} */}
                                            </div>
                                        </div>
                                        <div className={`${style?.metalMakingJewerryRetailInvoicePrint} border-end align-items-center d-flex justify-content-end`}>
                                            <p className="text-end p-1">{NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p>
                                        </div>
                                        <div className={`${style?.othersJewerryRetailInvoicePrint} border-end align-items-center d-flex justify-content-end`}><p className=" text-end p-1">
                                            {/* {NumberWithCommas(e?.OtherCharges, 2)} */}
                                            0.00
                                        </p></div>
                                        <div className={`${style?.totalJewerryRetailInvoicePrint} align-items-center d-flex justify-content-end`}><p className=" text-end p-1">{NumberWithCommas(e?.UnitCost / headerData?.CurrencyExchRate, 2)}</p></div>
                                    </div>
                                })}
                                {/* total */}
                                <div className={`${style?.minHeight20RetailinvoicePrint3} border-start border-end border-bottom d-flex no_break`}>
                                    <div className={`${style?.srNoJewerryRetailInvoicePrint} border-end p-1`}><p className="fw-bold"></p></div>
                                    <div className={`${style?.productJewerryRetailInvoicePrint} border-end p-1 fw-bold d-flex align-items-center`}>
                                        <p className="fw-bold" style={{ fontSize: "17px" }}>TOTAL</p>
                                    </div>
                                    <div className={`${style?.materialJewerryRetailInvoicePrint} border-end d-flex`}>
                                        <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-end`}><p className="fw-bold p-1 lh-1"></p></div>
                                        <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-end`}></div>
                                        <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-end`}> <p className="fw-bold p-1 lh-1 text-end">{fixedValues(total?.gwt, 3)} gm</p> </div>
                                        <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end p-1 flex-column d-flex align-items-end justify-content-center`}> <p className="fw-bold pb-1 text-end lh-1">{fixedValues(total?.diamondColorStoneWt, 3)} Ctw</p> <p className="fw-bold text-end lh-1">{fixedValues(total?.multiMetalMiscHsCode, 3)} gm</p></div>
                                        <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end  d-flex align-items-center justify-content-end`}><p className="fw-bold p-1 text-end lh-1">{fixedValues(total?.nwt, 3)} gm</p></div>
                                        <div className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-end`}><p className="fw-bold p-1 text-end lh-1"></p></div>
                                    </div>
                                    <div className={`${style?.metalMakingJewerryRetailInvoicePrint} border-end flex-column d-flex align-items-center justify-content-end`}>
                                        <p className="fw-bold text-end p-1"></p>
                                    </div>
                                    <div className={`${style?.othersJewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-end`}><p className="fw-bold text-end p-1">
                                        {/* {NumberWithCommas(total?.others, 2)} */}
                                        0.00
                                    </p></div>
                                    <div className={`${style?.totalJewerryRetailInvoicePrint} d-flex align-items-center justify-content-end`}><p className="fw-bold text-end p-1">{NumberWithCommas(total?.total / headerData?.CurrencyExchRate, 2)}</p></div>
                                </div>
                                {/* tax */}
                                <div className="d-flex border-start border-end border-bottom w-100 no_break">
                                    <div className={`d-flex justify-content-between flex-column border-end ${style?.wordsJewellry}`}>
                                        <div className={`${style?.wordsJewerryRetailInvoicePrint}p-2 d-flex align-items-center pt-5`}>
                                            <div className="p-2 pt-4">
                                                <p>In Words Indian Rupees</p>
                                                <p className="fw-bold">{toWords.convert(+(total?.afterTax / headerData?.CurrencyExchRate)?.toFixed(2))} Only</p>
                                            </div>
                                        </div>
                                        <div className={`${style?.RemarkJewelleryInvoicePrintC} p-2`}>
                                            <div className="d-flex ">Old Gold Purchase Description : <div dangerouslySetInnerHTML={{ __html: headerData?.Remark }} className="fw-bold ps-1"></div></div>
                                        </div>
                                    </div>
                                    <div className={`${style?.discountJewerryRetailInvoicePrint} d-flex`}>
                                        <div className="col-7 border-end">
                                            <p className="pb-1 px-1 text-end">Discount</p>
                                            <p className="pb-1 px-1 text-end">Total Amt before Tax</p>
                                            {taxes.length > 0 && taxes.map((e, i) => {
                                                return <p className="pb-1 px-1 text-end" key={i}>{e?.name} @ {e?.per}</p>
                                            })}
                                            <p className="pb-1 px-1 text-end">{headerData?.AddLess >= 0 ? "Add" : "Less"}</p>
                                            <p className="pb-1 px-1 text-end">Total Amt after Tax</p>
                                            <p className="pb-1 px-1 text-end">Old Gold</p>
                                            <p className="pb-1 px-1 text-end">Recv. in Cash</p>
                                            {bank.length > 0 && bank.map((e, i) => {
                                                return <p className="pb-1 px-1 text-end" key={i}>Recv. in Bank ({e?.label})</p>
                                            })}
                                            {/* <p className="pb-1 px-1">Recv. in Bank</p> */}
                                            <p className="pb-1 px-1 text-end">Net Bal. Amount</p>
                                            <p className="fw-bold p-1 border-top text-end">GRAND TOTAL</p>
                                        </div>
                                        <div className="col-5">
                                            <p className="text-end pb-1 px-1">{NumberWithCommas(total?.discount, 2)}</p>
                                            <p className="text-end pb-1 px-1">{NumberWithCommas(total?.beforeTax / headerData?.CurrencyExchRate, 2)}</p>
                                            {taxes.length > 0 && taxes.map((e, i) => {
                                                return <p className="pb-1 px-1 text-end" key={i}>{NumberWithCommas((+e?.amount) / headerData?.CurrencyExchRate, 2)}</p>
                                            })}
                                            <p className="pb-1 px-1 text-end">{NumberWithCommas(headerData?.AddLess / headerData?.CurrencyExchRate, 2)}</p>
                                            <p className="pb-1 px-1 text-end">{NumberWithCommas(total?.afterTax / headerData?.CurrencyExchRate, 2)}</p>
                                            <p className="pb-1 px-1 text-end">{NumberWithCommas(headerData?.OldGoldAmount, 2)}</p>
                                            <p className="pb-1 px-1 text-end">{NumberWithCommas(headerData?.CashReceived, 2)}</p>
                                            {bank.length > 0 && bank.map((e, i) => {
                                                return <p className="pb-1 px-1 text-end" key={i}>{NumberWithCommas(e?.amount, 2)}</p>
                                            })}
                                            {/* <p className="pb-1 px-1 text-end">{NumberWithCommas(headerData?.BankReceived, 2)}</p> */}
                                            <p className="pb-1 px-1 text-end">{NumberWithCommas(((total?.afterTax / headerData?.CurrencyExchRate) - bank?.reduce((acc, cObj) => acc + +cObj?.amount, 0)), 2)}</p>
                                            <p className="fw-bold text-end p-1 border-top"><span dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}></span>{NumberWithCommas((total?.afterTax) / headerData?.CurrencyExchRate, 2)}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* remark */}
                                <div className="border-start border-end border-bottom p-2 no_break pb-3">
                                    <div dangerouslySetInnerHTML={{ __html: headerData?.Declaration }} className={`${style?.declarationUlJewelleryRetailInvoicePrntc} ${style?.retailinvoicePrint3}`}></div>
                                </div>
                                {/* bank detail */}
                                <div className="border-start border-end border-bottom d-flex no_break">
                                    <div className="col-4 p-2 border-end">
                                        <p className="fw-bold">Bank Detail</p>
                                        <p>Bank name: {headerData?.bankname}</p>
                                        <p>Branch: {headerData?.bankaddress}</p>
                                        <p>{headerData?.PinCode}</p>
                                        <p>Account Name: {headerData?.accountname}</p>
                                        <p>Account No: {headerData?.accountnumber}</p>
                                        <p>RTGS NEFT IFSC: {headerData?.rtgs_neft_ifsc}</p>
                                    </div>
                                    <div className="col-4 p-2 border-end d-flex justify-content-between flex-column">
                                        <p>Signature</p>
                                        <p className="fw-bold">{headerData?.CustName}</p>
                                    </div>
                                    <div className="col-4 p-2 d-flex justify-content-between flex-column">
                                        <p>Signature</p>
                                        <p className="fw-bold">{headerData?.CompanyFullName}</p>
                                    </div>
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
};

export default RetailInvoiceprint6;
