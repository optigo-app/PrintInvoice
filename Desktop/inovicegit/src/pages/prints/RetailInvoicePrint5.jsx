// import React, { useEffect, useState } from 'react'
// import style from "../../assets/css/prints/retailInvoicePrint5.module.css";
// import { ToWords } from 'to-words';
// import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
// import Loader from '../../components/Loader';
// import { cloneDeep } from 'lodash';
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
// const RetailInvoicePrint5 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
//     const [msg, setMsg] = useState("");
//     const [loader, setLoader] = useState(true);
//     const toWords = new ToWords();
//     const [data, setData] = useState({});
//     const [label, setlabel] = useState([]);
//     const [headerData, setHeaderData] = useState({});
//     const [header, setHeader] = useState(null);
//     const [footer, setFooter] = useState(null);
//     const [nri, setNri] = useState("");
//     const [foreignPassport, setForeignPassport] = useState("");
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
//         let totals = 0;
//         let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
//         let nri = data?.BillPrint_Json[0]?.DocumentDetail?.split("#@#").map(e => e.split("#-#"));
//         let findNri = nri?.findIndex((e, i) => e[0] === "NRI ID");
//         if (findNri !== -1) {
//             setNri(nri[findNri][1]);
//         }
//         let findForeignPassPort = nri?.findIndex((e, i) => e[0] === "FOREIGN PASSPORT");
//         if (findForeignPassPort !== -1) {
//             setForeignPassport(nri[findForeignPassPort][1]);
//         }

//         let finalArr = [];
//         datas?.resultArray?.forEach((e, i) => {
//             if (e?.GroupJobid !== 0) {
//                 let findIndex = finalArr?.findIndex((ele, ind) => ele?.GroupJob === e?.GroupJob);
//                 if (findIndex === -1) {
//                     let obj = cloneDeep(e);
//                     let findPrimaryMetal = e?.metal?.findIndex((ele, ind) => ele?.IsPrimaryMetal === 1);
//                     let metalRate = 0;
//                     if (findPrimaryMetal !== -1) {
//                         metalRate = e?.metal?.[findPrimaryMetal]?.Rate;
//                     }
//                     obj.metalRate = metalRate;
//                     finalArr.push(obj);
//                 } else {
//                     let findPrimaryMetal = e?.metal?.findIndex((ele, ind) => ele?.IsPrimaryMetal === 1);
//                     let metalRate = 0;
//                     if (findPrimaryMetal !== -1) {
//                         metalRate = e?.metal?.[findPrimaryMetal]?.Rate;
//                     }
//                     finalArr[findIndex].metalRate = (finalArr[findIndex].metalRate + metalRate) / 2;
//                     if (e?.SrJobno === e?.GroupJob) {
//                         let other_details = finalArr[findIndex].other_details.concat(e?.other_details);
//                         let otherDetails = [];
//                         other_details?.forEach((ele, ind) => {
//                             let findOther = otherDetails?.findIndex((elem, index) => elem?.label === ele?.label);
//                             if (findOther === -1) {
//                                 otherDetails.push(ele);
//                             } else {
//                                 otherDetails[findOther].value = +otherDetails[findOther].value + +e?.value;
//                             }
//                         })
//                         finalArr[findIndex].MetalPurity = e?.MetalPurity;
//                         finalArr[findIndex].MetalType = e?.MetalType;
//                         finalArr[findIndex].MetalTypePurity = e?.MetalTypePurity;
//                         finalArr[findIndex].grosswt += e?.grosswt;
//                         // finalArr[findIndex].other_details = finalArr[findIndex].other_details.concat(e?.other_details);
//                         finalArr[findIndex].other_details = otherDetails;
//                         finalArr[findIndex].totals.diamonds.Wt += e?.totals?.diamonds?.Wt;
//                         finalArr[findIndex].totals.colorstone.Wt += e?.totals?.colorstone?.Wt;
//                         finalArr[findIndex].totals.finding.Wt += e?.totals?.finding?.Wt;
//                         finalArr[findIndex].NetWt += e?.NetWt;
//                         finalArr[findIndex].metalRate = (finalArr[findIndex].metalRate + metalRate) / 2;
//                         finalArr[findIndex].MaKingCharge_Unit += e?.MaKingCharge_Unit;
//                         finalArr[findIndex].OtherCharges += e?.OtherCharges;
//                         finalArr[findIndex].TotalAmount += e?.TotalAmount;
//                     }
//                 }
//             }
//         });

//         let resultArr = [];
//         datas?.resultArray?.forEach((e, i) => {
//             if (e?.GroupJobid === 0) {
//                 let findPrimaryMetal = e?.metal?.findIndex((ele, ind) => ele?.IsPrimaryMetal === 1);
//                 let metalRate = 0;
//                 if (findPrimaryMetal !== -1) {
//                     metalRate = e?.metal[findPrimaryMetal]?.Rate;
//                 }
//                 let obj = cloneDeep(e);
//                 obj.metalRate = metalRate;
//                 resultArr.push(obj);
//             } else {
//                 let findData = finalArr?.findIndex(ele => ele?.GroupJob === e?.GroupJob);
//                 if (findData !== -1) {
//                     let obj = cloneDeep(e);
//                     if (obj?.MaKingCharge_Unit === finalArr[findData]?.MaKingCharge_Unit) {
//                         let findD = resultArr?.findIndex(ele => ele?.GroupJob === obj?.GroupJob && ele?.MaKingCharge_Unit === obj?.MaKingCharge_Unit);
//                         if (findD === -1) {
//                             let other_details = obj.other_details.concat(finalArr[findData]?.other_details);
//                             let otherDetails = [];
//                             other_details?.forEach((ele, ind) => {
//                                 let findOther = otherDetails?.findIndex((elem, index) => elem?.label === ele?.label);
//                                 if (findOther === -1) {
//                                     otherDetails.push(ele);
//                                 } else {
//                                     otherDetails[findOther].value = +otherDetails[findOther]?.value + +ele?.value;
//                                 }
//                             })
//                             obj.MetalPurity = finalArr[findData]?.MetalPurity;
//                             obj.MetalType = finalArr[findData]?.MetalType;
//                             obj.MetalTypePurity = finalArr[findData]?.MetalTypePurity;
//                             obj.grosswt += finalArr[findData]?.grosswt;
//                             // obj.other_details = obj.other_details.concat(finalArr[findData]?.other_details);
//                             // obj.other_details = otherDetails;
//                             obj.totals.diamonds.Wt += finalArr[findData]?.totals?.diamonds?.Wt;
//                             obj.totals.colorstone.Wt += finalArr[findData]?.totals?.colorstone?.Wt;
//                             obj.NetWt += finalArr[findData]?.NetWt;
//                             obj.metalRate += finalArr[findData]?.metalRate;
//                             // obj.MaKingCharge_Unit += finalArr[findData]?.MaKingCharge_Unit;
//                             obj.OtherCharges += finalArr[findData]?.OtherCharges;
//                             obj.TotalAmount += finalArr[findData]?.TotalAmount;
//                             resultArr.push(obj);
//                         }
//                     } else {
//                         let other_details = obj.other_details.concat(finalArr[findData]?.other_details);
//                         let otherDetails = [];
//                         other_details?.forEach((ele, ind) => {
//                             let findOther = otherDetails?.findIndex((elem, index) => elem?.label === ele?.label);
//                             if (findOther === -1) {
//                                 otherDetails.push(ele);
//                             } else {
//                                 otherDetails[findOther].value = +otherDetails[findOther]?.value + +ele?.value;
//                             }
//                         })
//                         // obj.other_details = otherDetails;
//                         obj.MetalPurity = finalArr[findData]?.MetalPurity;
//                         obj.MetalType = finalArr[findData]?.MetalType;
//                         obj.MetalTypePurity = finalArr[findData]?.MetalTypePurity;
//                         obj.grosswt += finalArr[findData]?.grosswt;
//                         // obj.other_details = obj.other_details.concat(finalArr[findData]?.other_details);
//                         obj.totals.diamonds.Wt += finalArr[findData]?.totals?.diamonds?.Wt;
//                         obj.totals.colorstone.Wt += finalArr[findData]?.totals?.colorstone?.Wt;
//                         obj.NetWt += finalArr[findData]?.NetWt;
//                         obj.metalRate += finalArr[findData]?.metalRate;
//                         obj.OtherCharges += finalArr[findData]?.OtherCharges;
//                         obj.TotalAmount += finalArr[findData]?.TotalAmount;
//                         resultArr.push(obj);
//                     }
//                 }
//             }
//         });

//         datas.resultArray = resultArr;
//         setData(datas);

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
//             <div className={`container max_width_container ${style?.retailInvoicePrint5} pad_60_allPrint px-1 mt-1`}>
//                 {/* buttons */}
//                 <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
//                     <div className="form-check ps-3">
//                         <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
//                     </div>
//                 </div>
//                 {/* header */}
//                 {header}
//                 <div className="border d-flex">
//                     <div className="col-8 border-end px-2">
//                         <p>To, </p>
//                         <p className='fw-bold'>{headerData?.CustName}</p>
//                         <p>{headerData?.customerAddress1}</p>
//                         <p>{headerData?.customerAddress2}</p>
//                         <p>{headerData?.customercity}-{headerData?.PinCode}</p>
//                         <p>{headerData?.customercountry}</p>
//                         <p>{headerData?.CompanyEmail}</p>
//                         <p>Phno:{headerData?.customermobileno}</p>
//                         <p>GSTIN-{headerData?.CustGstNo} | PAN-{headerData?.CustPanno} | Aadhar-{headerData?.aadharno}</p>
//                         <p>STATE CODE-{headerData?.Cust_CST_STATE_No}</p>
//                     </div>
//                     <div className="col-4 px-2">
//                         <div className="d-flex">
//                             <div className="col-6"> <p>INVOICE NO</p></div>
//                             <div className="col-6"><p>{headerData?.InvoiceNo}</p></div>
//                         </div>
//                         <div className="d-flex">
//                             <div className="col-6"><p>DATE	{headerData?.EntryDate}</p></div>
//                             <div className="col-6"><p>{headerData?.HSN_No_Label}	{headerData?.HSN_No}</p></div>
//                         </div>
//                         <div className='d-flex'>
//                             <div className="col-6">  <p>Reverse Charge</p>	 </div>
//                             <div className='col-6 d-flex'><input type="checkbox" /><p className='px-1'>Yes</p> <input type="checkbox" /> <p className='px-1'>No</p></div></div>
//                         <div className="d-flex">
//                             <div className="col-6"><p>AADHAR CARD</p></div>
//                             <div className="col-6"><p>{headerData?.aadharno}</p></div>
//                         </div>
//                         <div className="d-flex">
//                             <div className="col-6"><p>NRI ID</p></div>
//                             <div className="col-6"><p>{nri}^</p></div>
//                         </div>
//                         <div className="d-flex">
//                             <div className="col-6"><p>FOREIGN PASSPORT</p></div>
//                             <div className="col-6"><p>{foreignPassport}</p></div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* table header */}
//                 <div className="pt-1">
//                     <div className="d-flex border">
//                         <div className={`${style?.Sr} border-end d-flex justify-content-center align-items-center`}><p className="fw-bold text-center p-1">Sr#</p></div>
//                         <div className={`${style?.Product} border-end d-flex justify-content-center align-items-center`}><p className="fw-bold text-center p-1">Product Description</p></div>
//                         <div className={`${style?.Material} border-end `}>
//                             <div className="d-grid h-100">
//                                 <div className="d-flex">
//                                     <p className="fw-bold text-center p-1 w-100 border-bottom">Material Description</p>
//                                 </div>
//                                 <div className="d-flex">
//                                     <div className='col-2 border-end'><p className="fw-bold text-center p-1">Material</p></div>
//                                     <div className='col-2 border-end'><p className="fw-bold text-center p-1">Carat</p></div>
//                                     <div className='col-2 border-end'><p className="fw-bold text-center p-1">GWT</p></div>
//                                     <div className='col-2 border-end'><p className="fw-bold text-center p-1">STONE/DIA Wt.</p></div>
//                                     <div className='col-2 border-end'><p className="fw-bold text-center p-1">NWT</p></div>
//                                     <div className='col-2'><p className="fw-bold text-center p-1">Rate</p></div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className={`${style?.Making} border-end d-flex justify-content-center align-items-center`}><p className="fw-bold text-center p-1">Making</p></div>
//                         <div className={`${style?.Others} border-end d-flex justify-content-center align-items-center`}><p className="fw-bold text-center p-1">Others</p></div>
//                         <div className={`${style?.Total} d-flex justify-content-center align-items-center`}><p className="fw-bold text-center p-1">Total</p></div>
//                     </div>
//                 </div>
//                 {/* table data */}
//                 {data?.resultArray?.map((e, i) => {
//                     return <div className="d-flex border-start border-bottom border-end" key={i}>
//                         <div className={`${style?.Sr} border-end`}><p className="fw-bold text-center p-1">{NumberWithCommas(i + 1, 0)}</p></div>
//                         <div className={`${style?.Product} border-end p-1`}>
//                             <p>{e?.SubCategoryname} {e?.Categoryname}</p>
//                             <p>{e?.designno} | {e?.SrJobno}</p>
//                             <img src={e?.DesignImage} alt="" className='imgWidth' />
//                             <p>HUID-{e?.HUID}</p>
//                         </div>
//                         <div className={`${style?.Material} border-end `}>
//                             <div className={`d-grid h-100`}>
//                                 <div className={`d-flex ${(e?.totals?.diamonds?.Wt !== 0 || e?.totals?.colorstone?.Wt !== 0 || e?.totals?.finding?.Wt !== 0) && 'border-bottom'}`}>
//                                     <div className='col-2 border-end'><p className=" p-1">{e?.MetalType}</p></div>
//                                     <div className='col-2 border-end'><p className=" p-1">{e?.MetalPurity} / {e?.Tunch}% {e?.other_details?.map((ele, ind) => <span key={ind}>{ele?.label}</span>)}</p></div>
//                                     <div className='col-2 border-end'><p className="text-end p-1">{NumberWithCommas(e?.grosswt, 3)}</p></div>
//                                     <div className='col-2 border-end'><p className=" p-1"></p></div>
//                                     <div className='col-2 border-end'><p className="text-end p-1">{NumberWithCommas(e?.NetWt, 3)}</p></div>
//                                     <div className='col-2'><p className="text-end p-1">{NumberWithCommas(e?.metalRate, 2)}</p></div>
//                                 </div>
//                                 {
//                                     e?.totals?.diamonds?.Wt !== 0 && <div className="d-flex">
//                                         <div className='col-2 border-end'><p className=" p-1">Diamond</p></div>
//                                         <div className='col-2 border-end'><p className=" p-1"></p></div>
//                                         <div className='col-2 border-end'><p className="text-end p-1"></p></div>
//                                         <div className='col-2 border-end'><p className="text-end p-1">{NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}</p></div>
//                                         <div className='col-2 border-end'><p className="text-end p-1"></p></div>
//                                         <div className='col-2'><p className="text-end p-1">{NumberWithCommas(e?.totals?.diamonds?.Amount, 2)}</p></div>
//                                     </div>
//                                 }
//                                 {
//                                     e?.totals?.colorstone?.Wt !== 0 && <div className="d-flex">
//                                         <div className='col-2 border-end'><p className=" p-1">Colorstone</p></div>
//                                         <div className='col-2 border-end'><p className=" p-1"></p></div>
//                                         <div className='col-2 border-end'><p className="text-end p-1"></p></div>
//                                         <div className='col-2 border-end'><p className="text-end p-1">{NumberWithCommas(e?.totals?.colorstone?.Wt, 3)}</p></div>
//                                         <div className='col-2 border-end'><p className="text-end p-1"></p></div>
//                                         <div className='col-2'><p className="text-end p-1">{NumberWithCommas(e?.totals?.colorstone?.Amount, 2)}</p></div>
//                                     </div>
//                                 }
//                                 {
//                                     e?.totals?.finding?.Wt !== 0 && <div className="d-flex">
//                                         <div className='col-2 border-end'><p className=" p-1"></p></div>
//                                         <div className='col-2 border-end'><p className=" p-1"></p></div>
//                                         <div className='col-2 border-end'><p className="text-end p-1"></p></div>
//                                         <div className='col-2 border-end'><p className="text-end p-1">{NumberWithCommas(e?.totals?.finding?.Wt, 3)}</p></div>
//                                         <div className='col-2 border-end'><p className="text-end p-1"></p></div>
//                                         <div className='col-2'><p className="text-end p-1"></p></div>
//                                     </div>
//                                 }
//                             </div>
//                         </div>
//                         <div className={`${style?.Making} border-end`}><p className="text-end p-1">{NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p></div>
//                         <div className={`${style?.Others} border-end`}><p className="text-end p-1">{NumberWithCommas(e?.OtherCharges, 2)}</p></div>
//                         <div className={`${style?.Total}`}><p className="text-end p-1">{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
//                     </div>
//                 })}

//                 {/* table total */}
//                 <div className="d-flex border-start border-bottom border-end">
//                     <div className={`${style?.Sr} border-end`}><p className="fw-bold text-center p-1">	</p></div>
//                     <div className={`${style?.Product} border-end p-1`}>
//                         <p className='fw-bold'>TOTAL</p>
//                     </div>
//                     <div className={`${style?.Material} border-end `}>
//                         <div className="d-grid h-100">
//                             <div className="d-flex">
//                                 <div className='col-2 border-end p-1'><p className=""></p></div>
//                                 <div className='col-2 border-end p-1'><p className=""></p></div>
//                                 <div className='col-2 border-end p-1'><p className="text-end fw-bold">{NumberWithCommas(data?.mainTotal?.grosswt, 3)} gm	</p></div>
//                                 <div className='col-2 border-end p-1'>
//                                     <p className="text-end fw-bold">{NumberWithCommas(data?.mainTotal?.diamonds?.Wt + data?.mainTotal?.colorstone?.Wt + data?.mainTotal?.finding?.Wt, 3)} Ctw</p>
//                                     <p className='text-end fw-bold'>{NumberWithCommas((data?.mainTotal?.diamonds?.Wt + data?.mainTotal?.colorstone?.Wt + data?.mainTotal?.finding?.Wt) / 5, 3)} gm</p>
//                                 </div>
//                                 <div className='col-2 border-end p-1'><p className="text-end fw-bold">{NumberWithCommas(data?.mainTotal?.netwtWithLossWt, 3)} gm	</p></div>
//                                 <div className='col-2 p-1'><p className="text-end fw-bold"></p></div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className={`${style?.Making} border-end`}><p className="text-end p-1 fw-bold"></p></div>
//                     <div className={`${style?.Others} border-end`}><p className="text-end p-1 fw-bold">{NumberWithCommas(data?.mainTotal?.total_other_charges, 2)}</p></div>
//                     <div className={`${style?.Total}`}><p className="text-end p-1 fw-bold">{NumberWithCommas(data?.mainTotal?.total_unitcost, 2)}</p></div>
//                 </div>
//                 {/* amount in words */}
//                 <div className="d-flex border-start border-bottom border-end">
//                     <div className={`${style?.inWords} border-end d-flex flex-column justify-content-between`}>
//                         <div className='p-1'> </div>
//                         <div className='p-1'>
//                             <p>
//                                 In Words Indian Rupees
//                             </p>
//                             <p className="fw-bold">
//                                 {toWords.convert(+fixedValues(data?.finalAmount, 2))} Only
//                                 {/* One Lakh Sixty-Eight Thousand Eight Hundred and Twenty-Seven Point Zero Four  */}
//                             </p>
//                         </div>
//                         <div className='p-1'>
//                             Old Gold Purchase Description : <span className="fw-bold">{headerData?.Remark}</span>
//                         </div>
//                     </div>
//                     <div className={`${style?.grandTotal} border-end py-1`}>
//                         {data?.mainTotal?.total_discount_amount !== 0 && <p className="text-end px-1">Discount</p>}
//                         <p className="text-end px-1">Total Amt.</p>
//                         {data?.allTaxes?.map((e, i) => {
//                             return <p className="text-end px-1" key={i}>{e?.name} @ {e?.per} </p>
//                         })}
//                         {headerData?.AddLess !== 0 && <p className="text-end px-1">{headerData?.AddLess > 0 ? "Add" : "Less"}</p>}
//                         <p className="text-end px-1">Total Amt. after Tax</p>
//                         <p className="text-end px-1">Old Gold</p>
//                         <p className="text-end px-1">Recv.in Cash</p>
//                         <p className="text-end px-1">Recv.in Bank</p>
//                         <p className="text-end px-1">Net Bal. Amount</p>
//                         <p className="p-1 text-end border-top fw-bold">
//                             GRAND TOTAL
//                         </p>
//                     </div>
//                     <div className={`${style?.Total} py-1`}>
//                         {data?.mainTotal?.total_discount_amount !== 0 && <p className="text-end px-1">{NumberWithCommas(data?.mainTotal?.total_discount_amount, 2)}</p>}
//                         <p className="text-end px-1">{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p>
//                         {data?.allTaxes?.map((e, i) => {
//                             return <p className="text-end px-1" key={i}>{NumberWithCommas(e?.amount, 2)} </p>
//                         })}
//                         {headerData?.AddLess !== 0 && <p className="text-end px-1">{NumberWithCommas(headerData?.AddLess, 2)}</p>}
//                         <p className="text-end px-1">{NumberWithCommas(data?.finalAmount, 2)}</p>
//                         <p className="text-end px-1">{NumberWithCommas(headerData?.OldGoldAmount, 2)}</p>
//                         <p className="text-end px-1">{NumberWithCommas(headerData?.CashReceived, 2)}</p>
//                         <p className="text-end px-1">{NumberWithCommas(headerData?.BankReceived, 2)}</p>
//                         <p className="text-end px-1">{NumberWithCommas(data?.finalAmount, 2)}</p>
//                         <p className="p-1 text-end border-top fw-bold">
//                             <span dangerouslySetInnerHTML={{__html: headerData?.Currencysymbol}}></span> {NumberWithCommas(data?.finalAmount, 2)}
//                         </p>
//                     </div>
//                 </div>
//                 {/* declaration */}
//                 <div className="d-flex border-start border-end border-bottom p-1">
//                     <p className={``} dangerouslySetInnerHTML={{__html: headerData?.Declaration}}>
//                     </p>
//                 </div>
//                 {/* bank details */}
//                 {footer}
//             </div>
//             {/* <SampleDetailPrint11 /> */}
//         </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
//     )
// }

// export default RetailInvoicePrint5


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

const RetailInvoiceprint5 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
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



      // let resultArr = [];

      blankArr?.forEach((e, i) => {
        if (e?.GroupJob !== "") {
          let findRecord = groupInfo?.find((ele, ind) => ele?.GroupJob === e?.GroupJob);
          if (findRecord !== undefined) {
            e.designno = findRecord?.designno;
            e.SrJobno = findRecord?.SrJobno;
            e.DesignImage = findRecord?.DesignImage;
            e.Categoryname = findRecord?.Categoryname;
            e.SubCategoryname = findRecord?.SubCategoryname;
            e.diamondWt = findRecord?.diamondWt;
            e.colorStoneWt = findRecord?.colorStoneWt;
            totals.diamondColorStoneWt += findRecord?.diamondWt + findRecord?.colorStoneWt;
            e.miscsWt = findRecord?.miscsWt;
            e.diamondAmount = findRecord?.diamondAmount;
            e.colorStoneAmount = findRecord?.colorStoneAmount;
            e.miscsAmount = findRecord?.miscsAmount;
            e.diamondRate = (findRecord?.diamondAmount / findRecord?.diamondWt);
            e.colorStoneRate = (findRecord?.colorStoneAmount / findRecord?.colorStoneWt);
            e.miscsRate = (findRecord?.miscsAmount / findRecord?.miscsWt);
            e.hallmarkingCount = findRecord?.hallmarkingCount;
          }
        } else {
          totals.diamondColorStoneWt += e?.diamondWt + e?.colorStoneWt;
        }
      })
      // blankArr.forEach((e, i) => {
      //   if (e?.GroupJob !== "") {
      //     let findIndex = resultArr.findIndex(ele => ele?.GroupJob === e?.GroupJob);
      //     if (findIndex === -1) {
      //       resultArr.push(e);
      //     } else {
      //       resultArr[findIndex].MakingAmount += e?.MakingAmount;
      //       resultArr[findIndex].MetalAmount += e?.MetalAmount;
      //       resultArr[findIndex].OtherCharges += e?.OtherCharges;
      //       resultArr[findIndex].TotalAmount += e?.TotalAmount;
      //       resultArr[findIndex].grosswt += e?.grosswt;
      //       resultArr[findIndex].NetWt += e?.NetWt;
      //       let arr = [resultArr[findIndex], e];
      //       let findRecord = arr.find(elem => elem?.SrJobno === e?.GroupJob);
      //       resultArr[findIndex].SubCategoryname = findRecord?.SubCategoryname;
      //       resultArr[findIndex].Collectionname = findRecord?.Collectionname;
      //       resultArr[findIndex].designno = findRecord?.designno;
      //       resultArr[findIndex].SrJobno = findRecord?.SrJobno;
      //       resultArr[findIndex].DesignImage = findRecord?.DesignImage;
      //       e?.materials.forEach((ele, ind) => {
      //         let arr = [1, 2, 3];
      //         arr.forEach((element, index) => {
      //           if (ele?.MasterManagement_DiamondStoneTypeid === element) {
      //             let findindexs = resultArr[findIndex].materials.findIndex((elem, index) => elem?.MasterManagement_DiamondStoneTypeid === element);
      //             if (findindexs === -1) {
      //               resultArr[findIndex].materials.push(ele);
      //             } else {
      //               resultArr[findIndex].materials[findindexs].Wt += ele?.Wt;
      //             }
      //           }
      //         });
      //         if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
      //           let findIndexss = resultArr[findIndex].materials.findIndex((elem, index) => elem?.MasterManagement_DiamondStoneTypeid === 4);
      //           let findShapenameIndex = findRecord.materials.findIndex(elements => elements?.MasterManagement_DiamondStoneTypeid === 4)
      //           resultArr[findIndex].materials[findIndexss].ShapeName = findRecord?.materials[findShapenameIndex].ShapeName;
      //           resultArr[findIndex].materials[findIndexss].QualityName = findRecord?.materials[findShapenameIndex].QualityName;
      //         }
      //       });

      //     }
      //   } else {
      //     resultArr.push(e);
      //   }
      // });
      blankArr?.sort((a, b) => {
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
      console.log(documentDetail);
      setDocument(documentDetail);
      setdata(blankArr);
      setTotal(totals);
      console.log(data);
      console.log(blankArr);
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
                    {console.log(document)}
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
                              <div className={`col-2 border-end d-flex align-items-center`} style={{ wordBreak: "normal" }}><p className="p-1 lh-1" style={{ wordBreak: "normal" }}>{ele?.QualityName}{(e?.Tunch !== 0 && ` / ${NumberWithCommas(e?.Tunch, 2)}% ${e?.hallmarkingCount !== 0 ? "Hallmarking" : ""}`)}</p></div>
                              <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1">{fixedValues(e?.grosswt, 3)}</p></div>
                              <div className={`col-2 border-end p-1 d-flex align-items-center justify-content-end`}><p className=" text-end lh-1"></p></div>
                              <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1">{fixedValues(e?.MetalDiaWt, 3)}</p></div>
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
                              <div className={`col-2 d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1">{NumberWithCommas(ele?.Rate, 2)}</p></div>
                            </div>
                          })
                        }
                        {/* {
                          e?.miscsWt !== 0 && <div className={`d-flex border-bottom`} >
                            <div className={`col-2 border-end d-flex align-items-center`}><p className="p-1 lh-1">MISC</p></div>
                            <div className={`col-2 border-end d-flex align-items-center`}><p className="p-1 lh-1"></p></div>
                            <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1"></p></div>
                            <div className={`col-2 border-end p-1 d-flex align-items-center justify-content-end`}><p className=" text-end lh-1">{NumberWithCommas(e?.miscsWt, 3)}</p></div>
                            <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1"></p></div>
                            <div className={`col-2 d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1">{NumberWithCommas(e?.miscsRate, 2)}</p></div>
                          </div>
                        } */}
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
                    <div className={`${style?.w_20JewerryRetailInvoicePrint}  d-flex align-items-center justify-content-end`}><p className="fw-bold p-1 text-end lh-1"></p></div>
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
                      {/* {taxes.length > 0 && taxes.map((e, i) => {
                        return <p className="pb-1 px-1 text-end" key={i}>{e?.name} @ {e?.per}</p>
                      })} */}
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
                      {/* {taxes.length > 0 && taxes.map((e, i) => {
                        return <p className="pb-1 px-1 text-end" key={i}>{NumberWithCommas((+e?.amount) / headerData?.CurrencyExchRate, 2)}</p>
                      })} */}
                      <p className="pb-1 px-1 text-end">{NumberWithCommas(headerData?.AddLess / headerData?.CurrencyExchRate, 2)}</p>
                      <p className="pb-1 px-1 text-end">{NumberWithCommas(total?.afterTax / headerData?.CurrencyExchRate, 2)}</p>
                      <p className="pb-1 px-1 text-end">{NumberWithCommas(headerData?.OldGoldAmount, 2)}</p>
                      <p className="pb-1 px-1 text-end">{NumberWithCommas(headerData?.CashReceived, 2)}</p>
                      {bank.length > 0 && bank.map((e, i) => {
                        return <p className="pb-1 px-1 text-end" key={i}>{NumberWithCommas(e?.amount, 2)}</p>
                      })}{console.log(bank?.reduce((acc, cObj) => acc + +cObj?.amount, 0), total?.netBalAmount, total?.netBalAmount - bank?.reduce((acc, cObj) => acc + +cObj?.amount, 0))}
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
                    <p className="fw-bold">{headerData?.accountname}</p>
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

export default RetailInvoiceprint5;
