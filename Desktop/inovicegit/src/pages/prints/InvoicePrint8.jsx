// import React, { useEffect, useState } from 'react';
// import style from "../../assets/css/prints/InvoicePrint8.module.css";
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
// import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
// import { cloneDeep } from 'lodash';
// import { ToWords } from "to-words";
// import ImageComponent from '../../components/ImageComponent ';
// import style2 from "../../assets/css/headers/header1.module.css";

// const InvoicePrint8 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
//     const toWords = new ToWords();
//     const [loader, setLoader] = useState(true);
//     const [msg, setMsg] = useState("");
//     const [image, setImage] = useState(false);
//     const [header, setHeader] = useState(null);
//     const [footer, setFooter] = useState(null);
//     const [headerData, setHeaderData] = useState({});
//     const [label, setlabel] = useState([]);
//     const [other, setOther] = useState({
//         other1: [],
//         other2: [],
//     });
//     const [isImageWorking, setIsImageWorking] = useState(true);
//   const handleImageErrors = () => {
//     setIsImageWorking(false);
//   };
//     const [metal, setMetal] = useState([]);
//     const [data, setData] = useState({});
//     const [finding, setFinding] = useState([]);
//     const [count, setCount] = useState(0);
//     const [total, setTotal] = useState(0);
//     const [logoStyle, setlogoStyle] = useState({ maxWidth: "120px", maxHeight: "95px", minHeight: "95px" });

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
//         console.log(datas);
//         setData(datas);
//         let metals = [];
//         let diamonds = [];
//         let colorstone = [];
//         let misc = [];
//         let othercharges1 = [];
//         let othercharges2 = [];
//         let counts = 0;
//         let findingMetals = [];
//         datas?.resultArray?.forEach((e, i) => {
//             if (e?.GroupJob === "") {
//                 counts += e?.Quantity
//             } else {
//                 if (e?.GroupJob === e?.SrJobno) {
//                     counts += e?.Quantity
//                 }
//             }
//             let findGold = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1);
//             if (findGold !== undefined) {
//                 let findMetals = metals?.findIndex((elem, index) => elem?.metalRate === findGold?.Rate && elem?.MetalTypePurity === e?.MetalTypePurity);
//                 totals += e?.totals?.metal?.Amount;
//                 if (findMetals === -1) {
//                     let obj = cloneDeep(e);
//                     obj.metalRate = findGold?.Rate;
//                     obj.metalAmount = findGold?.Amount;
//                     obj.metalPcs = findGold?.Pcs;
//                     obj.metalWt = findGold?.Wt;
//                     if (obj?.GroupJob === obj?.SrJobno) {
//                         obj.grosswt = datas?.resultArray?.reduce((acc, cObj) => {
//                             if (cObj?.GroupJob === obj?.GroupJob) {
//                                 return acc + cObj?.grosswt;
//                             } else {
//                                 return acc
//                             }
//                         }, 0);
//                     }
//                     metals.push(obj);
//                 } else {
//                     metals[findMetals].grosswt += e?.grosswt;
//                     metals[findMetals].NetWt += e?.NetWt;
//                     metals[findMetals].LossWt += e?.LossWt;
//                     metals[findMetals].TotalAmount += e?.TotalAmount;
//                     metals[findMetals].metalAmount += findGold?.Amount;
//                     metals[findMetals].totals.metal.Amount += e?.totals?.metal?.Amount;
//                     metals[findMetals].UnitCost += e?.totals?.UnitCost;

//                     if (metals[findMetals]?.GroupJob === metals[findMetals]?.SrJobno) {
//                         metals[findMetals].grosswt = datas?.resultArray?.reduce((acc, cObj) => {
//                             if (cObj?.GroupJob === metals[findMetals]?.GroupJob) {
//                                 return acc + cObj?.grosswt;
//                             } else {
//                                 return acc
//                             }
//                         }, 0);
//                     }
//                 }
//                 e?.other_details?.forEach((ele, ind) => {
//                     let findOther = othercharges1?.findIndex((elem, index) => elem?.label === ele?.label);
//                     if (findOther === -1) {
//                         othercharges1.push(ele);
//                         totals += +ele?.value;
//                     } else {
//                         othercharges1[findOther].value = +othercharges1[findOther].value + +ele?.value;
//                         totals += +ele?.value;
//                     }
//                 });
//             }
//         });
//         setCount(counts);
//         data?.BillPrint_Json2?.forEach((ele, ind) => {
//             if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
//                 if (ele?.IsHSCOE !== 0) {
//                     let findOther = othercharges2?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName);
//                     if (findOther === -1) {
//                         othercharges2.push(ele);
//                         totals += ele?.Amount;
//                     } else {
//                         othercharges2[findOther].Wt += ele?.Wt;
//                         othercharges2[findOther].Pcs += ele?.Pcs;
//                         othercharges2[findOther].Amount += ele?.Amount;
//                         totals += ele?.Amount;
//                     }
//                 }
//             }else if(ele?.MasterManagement_DiamondStoneTypeid === 5){
//                 let findMetals = findingMetals?.findIndex((elem, index) => ele?.ShapeName === elem?.ShapeName && ele?.QualityName === elem?.QualityName);
//                 if(findMetals === -1){
//                     findingMetals?.push(ele);
//                 }else{
//                     findingMetals[findMetals].Wt +=ele?.Wt;
//                     findingMetals[findMetals].Pcs +=ele?.Pcs;
//                     findingMetals[findMetals].Amount +=ele?.Amount;
//                 }
//             }
            
//         });

//         setFinding(findingMetals);

//         setTotal(totals);
//         setMetal(metals);
//         setOther({ ...other, other1: othercharges1, other2: othercharges2 });
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
//             <div className={`container max_width_container ${style?.invoiceprint8} pad_60_allPrint px-1 mt-1`}>
//                 {/* buttons */}
//                 <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
//                     <div className="form-check ps-3">
//                         <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
//                     </div>
//                 </div>
//                 {/* header */}
//                 {/* {header} */}
//                 <div className={`${style2.headline} headerTitle target_header ${style?.PrintHeadLabel}`}>{headerData?.PrintHeadLabel}</div>
//                 <div className={`${style2.companyDetails} target_header`}>
//                     <div className={`${style2.companyhead} p-2`}>
//                         <div className={`${style2.lines} ${style?.CompanyFullName}`} style={{ fontWeight: "bold", }}>
//                             {headerData?.CompanyFullName}
//                         </div>
//                         <div className={`${style2.lines} ${style?.CompanyAddress}`}>{headerData?.CompanyAddress}</div>
//                         <div className={`${style2.lines} ${style?.CompanyAddress}`}>{headerData?.CompanyAddress2}</div>
//                         <div className={`${style2.lines} ${style?.CompanyAddress}`}>{headerData?.CompanyCity}-{headerData?.CompanyPinCode},{headerData?.CompanyState}({headerData?.CompanyCountry})</div>
//                         {/* <div className={`${style2.lines} ${style?.CompanyAddress}`}>Tell No:  {headerData?.CompanyTellNo}</div> */}
//                         <div className={style2?.lines}>T {headerData?.CompanyTellNo} | TOLL FREE {headerData?.CompanyTollFreeNo} | TOLL FREE {headerData?.CompanyTollFreeNo}</div>
//                         <div className={`${style2.lines} ${style?.CompanyAddress}`}>
//                             {headerData?.CompanyEmail} | {headerData?.CompanyWebsite}
//                         </div>
//                         <div className={`${style2.lines} ${style?.CompanyAddress}`}>
//                             {/* {data?.Company_VAT_GST_No} | {data?.Company_CST_STATE}-{data?.Company_CST_STATE_No} | PAN-{data?.Pannumber} */}
//                             {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber}
//                         </div>
//                     </div>
//                     <div style={{ width: "30%" }} className="d-flex justify-content-end align-item-center h-100">
//                         <ImageComponent imageUrl={headerData?.PrintLogo} styles={logoStyle} />
//                         {/* <img src={data?.PrintLogo} alt="" className={style.headerImg} /> */}
//                     </div>
//                 </div>
//                 {/* sub header */}
//                 <div className={`d-flex border ${style?.subHeaderSec}`}>
//                     <div className="col-4 border-end p-2">
//                         <p>Bill To,</p>
//                         <p className={`fw-bold ${style?.customerfirmname}`}>{headerData?.customerfirmname}</p>
//                         <p>{headerData?.customerAddress1}</p>
//                         <p>{headerData?.customerAddress2}</p>
//                         <p>{headerData?.customercity}-{headerData?.PinCode}</p>
//                         <p>{headerData?.CompanyEmail}</p>
//                         <p>{headerData?.vat_cst_pan}</p>
//                         <p>{headerData?.CustGstNo}</p>
//                     </div>
//                     <div className="col-4 border-end p-2">

//                         <p>Ship To,</p>
//                         <p className={`fw-bold ${style?.customerfirmname}`}>{headerData?.customerfirmname}</p>
//                         {label?.map((ele, ind) => {
//                             return <p key={ind}>{ele}</p>
//                         })}
//                     </div>
//                     <div className="col-4 p-2">
//                         <div className='d-flex'><p className="fw-bold col-6">BILL NO</p> <p className='col-6'>	{headerData?.InvoiceNo}</p></div>
//                         <div className='d-flex'><p className="fw-bold col-6">DATE</p> <p className='col-6'>	{headerData?.EntryDate}</p></div>
//                         <div className='d-flex'><p className="fw-bold col-6">{headerData?.HSN_No_Label}</p> <p className='col-6'>{headerData?.HSN_No}	</p></div>
//                         <div className='d-flex'><p className="fw-bold col-6">NAME OF GOODS</p> <p className='col-6'>	{headerData?.NameOfGoods}</p></div>
//                         <div className='d-flex'><p className="fw-bold col-6">PLACE OF SUPPLY</p> <p className='col-6'>	{headerData?.State}</p></div>
//                         <div className='d-flex'><p className="fw-bold col-6">TERMS</p><p className='col-6'>{headerData?.DueDays}</p></div>
//                     </div>
//                 </div>
//                 {/* table header */}
//                 <div className="d-flex border-start border-end border-bottom ">
//                     <div className="col-3 border-end px-1"><p className={`fw-bold text-center ${style?.font_15}`}>DESCRIPTION</p></div>
//                     <div className="col-9 d-flex px-1">
//                         <p className={`fw-bold ${style?.Detail} ${style?.font_15}`}>Detail</p>
//                         <p className={`fw-bold text-end ${style?.Gross} ${style?.font_15}`}>Gross Wt.</p>
//                         <p className={`fw-bold text-end ${style?.Net} ${style?.font_15}`}>Net Wt.</p>
//                         <p className={`fw-bold text-end ${style?.Pcs} ${style?.font_15}`}>Pcs</p>
//                         <p className={`fw-bold text-end ${style?.Qty} ${style?.font_15}`}>Qty</p>
//                         <p className={`fw-bold text-end ${style?.Rate} ${style?.font_15}`}>Rate</p>
//                         <p className={`fw-bold text-end ${style?.Amount} ${style?.font_15}`}>Amount</p>
//                     </div>
//                 </div>
//                 {/* table data */}
//                 <div className={`d-flex border-start border-end border-bottom ${style?.font_size_13}`}>
//                     <div className="col-3 border-end px-1 d-flex align-items-center flex-column pt-5"><p className=" text-center">DIAMOND STUDDED JEWELLERY</p><p className={`fw-bold text-center ${style?.font_17}`}>Total Pcs : {NumberWithCommas(count, 0)}</p></div>
//                     <div className="col-9 px-1">
//                         {
//                             metal?.map((e, i) => {
//                                 return e?.metalAmount !== 0 && <div className="d-flex no_break" key={i}>
//                                     <p className={`p-1 ${style?.Detail}`}>{e?.MetalTypePurity} </p>
//                                     <p className={`p-1 text-end ${style?.Gross}`}>{e?.GroupJob !== "" ? (e?.GroupJob === e?.SrJobno && `${NumberWithCommas(e?.grosswt, 3)} Gms`) : `${NumberWithCommas(e?.grosswt, 3)} Gms`} </p>
//                                     <p className={`p-1 text-end ${style?.Net}`}>{NumberWithCommas(e?.NetWt + e?.LossWt, 3)} Gms	</p>
//                                     <p className={`p-1 text-end ${style?.Pcs}`}></p>
//                                     <p className={`p-1 text-end ${style?.Qty}`}> </p>
//                                     <p className={`p-1 text-end ${style?.Rate}`}>{NumberWithCommas(e?.metalRate, 2)}</p>
//                                     <p className={`p-1 text-end ${style?.Amount}`}>{NumberWithCommas(e?.totals?.metal?.Amount, 2)}</p>
//                                 </div>
//                             })
//                         }
//                         {
//                             finding?.map((e, i) => {
//                                 return <div className="d-flex no_break" key={i}>
//                                 <p className={`p-1  ${style?.Detail}`}>{e?.ShapeName} {e?.QualityName} </p>
//                                 <p className={`p-1 text-end ${style?.Gross}`}> </p>
//                                 <p className={`p-1 text-end ${style?.Net}`}>{NumberWithCommas(e?.Wt, 3)} Gms	</p>
//                                 <p className={`p-1 text-end ${style?.Pcs}`}></p>
//                                 <p className={`p-1 text-end ${style?.Qty}`}> </p>
//                                 <p className={`p-1 text-end ${style?.Rate}`}>{NumberWithCommas(e?.Rate, 2)}</p>
//                                 <p className={`p-1 text-end ${style?.Amount}`}>{NumberWithCommas(e?.Amount, 2)}</p>
//                             </div>
//                             })
//                         }
//                         {data?.mainTotal?.diamonds?.Pcs > 0 && <div className="d-flex no_break">
//                             <p className={`p-1  ${style?.Detail}`}>DIAMOND</p>
//                             <p className={`p-1 text-end ${style?.Gross}`}></p>
//                             <p className={`p-1 text-end ${style?.Net}`}>	</p>
//                             <p className={`p-1 text-end ${style?.Pcs}`}>{NumberWithCommas(data?.mainTotal?.diamonds?.Pcs, 0)}</p>
//                             <p className={`p-1 text-end ${style?.Qty}`}>{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)} Ctw</p>
//                             <p className={`p-1 text-end ${style?.Rate}`}>{NumberWithCommas(data?.mainTotal?.diamonds?.Rate, 2)} / Wt</p>
//                             <p className={`p-1 text-end ${style?.Amount}`}>{NumberWithCommas(data?.mainTotal?.diamonds?.Amount, 2)}</p>
//                         </div>}
//                         {data?.mainTotal?.colorstone?.Pcs > 0 && <div className="d-flex no_break">
//                             <p className={`p-1  ${style?.Detail}`}>COLOR STONE	</p>
//                             <p className={`p-1 text-end ${style?.Gross}`}></p>
//                             <p className={`p-1 text-end ${style?.Net}`}></p>
//                             <p className={`p-1 text-end ${style?.Pcs}`}>{NumberWithCommas(data?.mainTotal?.colorstone?.Pcs, 0)}</p>
//                             <p className={`p-1 text-end ${style?.Qty}`}>{NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)} Ctw</p>
//                             <p className={`p-1 text-end ${style?.Rate}`}>{NumberWithCommas(data?.mainTotal?.colorstone?.Rate, 2)} / Wt</p>
//                             <p className={`p-1 text-end ${style?.Amount}`}>{NumberWithCommas(data?.mainTotal?.colorstone?.Amount, 2)}</p>
//                         </div>}
//                         {data?.mainTotal?.colorstone?.Pcs > 0 && <div className="d-flex no_break">
//                             <p className={`p-1  ${style?.Detail}`}>OTHER MATERIAL	</p>
//                             <p className={`p-1 text-end ${style?.Gross}`}></p>
//                             <p className={`p-1 text-end ${style?.Net}`}></p>
//                             <p className={`p-1 text-end ${style?.Pcs}`}>{NumberWithCommas(data?.mainTotal?.misc?.Pcs, 0)}</p>
//                             <p className={`p-1 text-end ${style?.Qty}`}>{NumberWithCommas(data?.mainTotal?.misc?.Wt, 3)} gms</p>
//                             <p className={`p-1 text-end ${style?.Rate}`}>{NumberWithCommas(data?.mainTotal?.misc?.Rate, 2)} / Wt</p>
//                             <p className={`p-1 text-end ${style?.Amount}`}>{NumberWithCommas(data?.mainTotal?.misc?.Amount, 2)}</p>
//                         </div>}
//                         <div className="d-flex no_break">
//                             <p className={`p-1  ${style?.Detail}`}>LABOUR	</p>
//                             <p className={`p-1 text-end ${style?.Gross}`}></p>
//                             <p className={`p-1 text-end ${style?.Net}`}></p>
//                             <p className={`p-1 text-end ${style?.Pcs}`}></p>
//                             <p className={`p-1 text-end ${style?.Qty}`}></p>
//                             <p className={`p-1 text-end ${style?.Rate}`}>{NumberWithCommas(data?.mainTotal?.misc?.Rate, 2)} </p>
//                             <p className={`p-1 text-end ${style?.Amount}`}>{NumberWithCommas(data?.mainTotal?.total_labour?.labour_amount, 2)}</p>
//                         </div>
//                         {
//                             other?.other1?.map((e, i) => {
//                                 return <div className="d-flex no_break" key={i}>
//                                     <p className={`p-1  ${style?.Detail}`}>{e?.label}	</p>
//                                     <p className={`p-1 text-end ${style?.Gross}`}></p>
//                                     <p className={`p-1 text-end ${style?.Net}`}></p>
//                                     <p className={`p-1 text-end ${style?.Pcs}`}></p>
//                                     <p className={`p-1 text-end ${style?.Qty}`}></p>
//                                     <p className={`p-1 text-end ${style?.Rate}`}> </p>
//                                     <p className={`p-1 text-end ${style?.Amount}`}>{NumberWithCommas(+e?.value, 2)}</p>
//                                 </div>
//                             })
//                         }
//                         {
//                             other?.other2?.map((e, i) => {
//                                 return <div className="d-flex no_break no_break" key={i}>
//                                     <p className={`p-1  ${style?.Detail}`}>{e?.ShapeName}	</p>
//                                     <p className={`p-1 text-end ${style?.Gross}`}></p>
//                                     <p className={`p-1 text-end ${style?.Net}`}></p>
//                                     <p className={`p-1 text-end ${style?.Pcs}`}></p>
//                                     <p className={`p-1 text-end ${style?.Qty}`}></p>
//                                     <p className={`p-1 text-end ${style?.Rate}`}> </p>
//                                     <p className={`p-1 text-end ${style?.Amount}`}>{NumberWithCommas(e?.Amount, 2)}</p>
//                                 </div>
//                             })
//                         }
//                         {data?.mainTotal?.total_diamondHandling > 0 && <div className="d-flex no_break">
//                             <p className={`p-1  ${style?.Detail}`}>Handling</p>
//                             <p className={`p-1 text-end ${style?.Gross}`}></p>
//                             <p className={`p-1 text-end ${style?.Net}`}>	</p>
//                             <p className={`p-1 text-end ${style?.Pcs}`}></p>
//                             <p className={`p-1 text-end ${style?.Qty}`}></p>
//                             <p className={`p-1 text-end ${style?.Rate}`}></p>
//                             <p className={`p-1 text-end ${style?.Amount}`}>{NumberWithCommas(data?.mainTotal?.total_diamondHandling, 2)}</p>
//                         </div>}

//                     </div>
//                 </div>
//                 {/* table total */}
//                 <div className="d-flex border-start border-end border-bottom ">
//                     <div className="col-3 border-end px-1 d-flex justify-content-center align-items-center flex-column"><p className=" text-center"></p></div>
//                     <div className="col-9 p-1 d-flex justify-content-between">
//                         <p className={` ${style?.Detail} fw-bold ${style?.font_15}`}>Total</p>
//                         <p className={`text-end ${style?.Amount} fw-bold ${style?.font_15}`}>{NumberWithCommas(data?.finalAmount, 2)}</p>
//                     </div>
//                 </div>
//                 {/* table taxes */}
//                 {/* <div className="d-flex border-start border-end border-bottom">
//                     <div className="col-8 border-end"></div>
//                     <div className="col-4 d-flex">
//                         <div className="col-6 px-1">
//                             <p>Discount</p>
//                             <p className='fw-bold'>Total Amount</p>
//                             <p>CGST @ 0.13%</p>
//                             <p>SGST @ 0.13%</p>
//                             <p>Less</p>
//                         </div>
//                         <div className="col-6 text-end px-1">
//                             <p>1,857.50</p>
//                             <p className='fw-bold'>2,75,000.18</p>
//                             <p>357.37</p>
//                             <p>357.37</p>
//                             <p>-0.92</p>
//                         </div>
//                     </div>
//                 </div> */}
//                 {/* taxes */}
//                 <div className={`mt-1 `}>
//                     <div className="border d-flex">
//                         <div className="col-8 border-end px-2">
//                         </div>
//                         <div className="col-4 p-2">
//                             <div className='d-flex justify-content-between'>
//                                 <p className={`${style?.font_15}`}>Discount	</p>
//                                 <p className={`${style?.font_15}`}>{NumberWithCommas(data?.mainTotal?.total_discount_amount, 2)}</p>
//                             </div>
//                             <div className='d-flex justify-content-between'>
//                                 <p className={`fw-bold ${style?.font_15}`}>Total Amount	</p>
//                                 <p className={`fw-bold ${style?.font_15}`}>{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p>
//                             </div>
//                             {
//                                 data?.allTaxes?.map((e, i) => {
//                                     return <div className='d-flex justify-content-between' key={i}>
//                                         <p className={`${style?.font_15}`}>{e?.name} @ {e?.per} </p>
//                                         <p className={`${style?.font_15}`}>{NumberWithCommas(+e?.amount, 2)}</p>
//                                     </div>
//                                 })
//                             }

//                             {headerData?.AddLess !== 0 && <div className='d-flex justify-content-between'>
//                                 <p className={`${style?.font_15}`}>{headerData?.AddLess > 0 ? "ADD" : "LESS"}	</p>
//                                 <p className={`${style?.font_15}`}>{NumberWithCommas(headerData?.AddLess, 2)}</p>
//                             </div>}
//                         </div>
//                     </div>
//                 </div>
//                 {/* Grand Total */}
//                 <div className="mb-1">
//                     <div className="border-start border-bottom border-end d-flex">
//                         <div className="col-8 border-end px-2">
//                             <p className={`fw-bold ${style?.font_15}`}>IN Words Indian Rupees</p>
//                             <p className={`fw-bold ${style?.font_15}`}>{toWords?.convert(+fixedValues(data?.finalAmount, 2))} Only.</p>
//                         </div>
//                         <div className="col-4 p-2 d-flex justify-content-between">
//                             <p className={`fw-bold ${style?.font_15}`}>Grand Total</p>
//                             <p className={`fw-bold ${style?.font_15}`}>{NumberWithCommas(data?.finalAmount, 2)}</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Note */}
//                 <div className={`border-start border-end border-bottom px-2 ${style?.Declaration}`}>
//                     <div dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}></div>
//                 </div>
//                 {/* print remark */}
//                 <div className='px-2 pb-1'>
//                     <p className={`${style?.font_14}`}><span className={`fw-bold ${style?.font_14}`}>REMARKS : </span> {headerData?.PrintRemark}</p>
//                 </div>
//                 {/* note */}
//                 <div className={`footer_secInvoicePrint8`}>
//                     {footer}
//                 </div>
//             </div>
//             {/* <SampleDetailPrint11 /> */}
//         </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
//     )
// }

// export default InvoicePrint8


import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import style from "../../assets/css/prints/InvoicePrint_10_11.module.css";
import {
  FooterComponent,
  HeaderComponent,
  NumberWithCommas,
  apiCall,
  fixedValues,
  handlePrint,
  isObjectEmpty,
  taxGenrator,
} from "../../GlobalFunctions";
import { ToWords } from "to-words";
import BarcodePrintGenerator from "../../components/barcodes/BarcodePrintGenerator";
import style2 from "../../assets/css/headers/header1.module.css";
import footerStyle from "../../assets/css/footers/footer2.module.css";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { cloneDeep } from "lodash";

const InvoicePrint8 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [otherMaterial, setOtherMaterial] = useState([]);
  const [header, setHeader] = useState(null);
  const [footer, setFooter] = useState(null);
  const [headerData, setHeaderData] = useState({});
  const [customerAddress, setCustomerAddress] = useState([]);
  const [mainDatas, setMainDatas] = useState({});
  const [total, setTotal] = useState({
    total: 0,
    grandtotal: 0,
    totals: 0,
    discounttotals: 0
  });
  // const []
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const [discount, setDiscount] = useState(0);
  const [taxes, setTaxes] = useState([]);
  const [pnm, setPnm] = useState(atob(printName).toLowerCase());
  const [totalpcsss, setTotalPcsss] = useState(0);
  const toWords = new ToWords();

  const [mainData, setMainData] = useState({
    resultArr: [],
    findings: [],
    diamonds: [],
    colorStones: [],
    miscs: [],
    otherCharges: [],
    misc2: [],
    labour: {},
    diamondHandling: 0,
  });
  const [totalss, setTotalss] = useState({
    total: 0,
    discount: 0,
    totalPcs: 0,
  })

  const loadData = (data) => {
    let head = HeaderComponent("1", data?.BillPrint_Json[0]);
    setHeader(head);
    setHeaderData(data?.BillPrint_Json[0]);
    let footers = FooterComponent("2", data?.BillPrint_Json[0]);
    setFooter(footers);
    let custAddress = data?.BillPrint_Json[0]?.Printlable.split("\n");
    setCustomerAddress(custAddress);
    let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
    setMainDatas(datas)
    console.log(datas);
    let resultArr = [];
    let findings = [];
    let diamonds = [];
    let colorStones = [];
    let misc2 = [];
    let labour = { label: "LABOUR", primaryWt: 0, makingAmount: 0, totalAmount: 0 };
    let miscs = [];
    let otherCharges = [];
    let total2 = { ...totalss };
    let diamondTotal = 0;
    let colorStone1Total1 = 0;
    let colorStone2Total2 = 0;
    let misc1Total1 = 0;
    let misc2Total2 = 0;
    let diamondHandling = 0;
    let totalPcss = [];
    let jobWiseLabourCalc = 0;
    let jobWiseMinusFindigWt = 0;
    datas?.resultArray?.map((e, i) => {
      let obj = cloneDeep(e);
      let findingWt = 0;
      let findingsWt = 0;
      let findingsAmount = 0;
      let secondaryMetalAmount = 0;
      obj.primaryMetal = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1);
      e?.finding?.forEach((ele, ind) => {
        if (ele?.ShapeName !== obj?.primaryMetal?.ShapeName && ele?.QualityName !== obj?.primaryMetal?.QualityName) {
          console.log(ele);
          let obb = cloneDeep(ele);
          if (obj?.primaryMetal) {
            obb.Rate = obj?.primaryMetal?.Rate;
            obb.Amount = (ele?.Wt * obb?.Rate);
            findingsAmount += (ele?.Wt * obb?.Rate);
          }
          findingsWt += ele?.Wt;
          findings?.push(obb);
          total2.total += (obb?.Amount);
        }
        if (ele?.Supplier?.toLowerCase() === "customer") {
          findingWt += ele?.Wt
        }
      });

      let findPcss = totalPcss?.findIndex((ele, ind) => ele?.GroupJob === e?.GroupJob);
      if (findPcss === -1) {
        totalPcss?.push({ GroupJob: e?.GroupJob, value: e?.Quantity });
      } else {
        if (e?.GroupJob === "") {
          let findQuantity = totalPcss?.findIndex((ele, ind) => ele?.GroupJob === '');
          if (findQuantity === -1) {
            totalPcss?.push({ GroupJob: e?.GroupJob, value: e?.Quantity });
          } else {
            totalPcss[findQuantity].value += e?.Quantity;
          }
        }
      }

      let primaryWt = 0;
      let count = 0;
      console.log(findingsWt);
      let netWtFinal = e?.NetWt + e?.LossWt - findingsWt;

      diamondHandling += e?.TotalDiamondHandling;
      e?.metal?.forEach((ele, ind) => {
        count += 1;
        if (ele?.IsPrimaryMetal === 1) {
          primaryWt += ele?.Wt;
        } else {
          secondaryMetalAmount += ele?.Amount;
        }
      });
      // labour.primaryWt += primaryWt;
      labour.makingAmount += e?.MakingAmount;
      labour.totalAmount += e?.MakingAmount + e?.TotalDiaSetcost + e?.TotalCsSetcost;
      total2.discount += e?.DiscountAmt;
      obj.primaryWt = primaryWt;
      obj.netWtFinal = netWtFinal;
      obj.metalAmountFinal = e?.MetalAmount - findingsAmount + secondaryMetalAmount;
      if (count <= 1) {
        primaryWt = e?.NetWt + e?.LossWt;
      }
      if (obj?.primaryMetal) {
        total2.total += obj?.metalAmountFinal;
        let findRecord = resultArr?.findIndex((ele, ind) => ele?.primaryMetal?.ShapeName === obj?.primaryMetal?.ShapeName && ele?.primaryMetal?.QualityName === obj?.primaryMetal?.QualityName && ele?.primaryMetal?.Rate === obj?.primaryMetal?.Rate);
        if (findRecord === -1) {
          resultArr?.push(obj);
        } else {
          resultArr[findRecord].grosswt += obj?.grosswt;
          resultArr[findRecord].NetWt += obj?.NetWt;
          resultArr[findRecord].LossWt += obj?.LossWt;
          resultArr[findRecord].primaryWt += obj?.primaryWt;
          resultArr[findRecord].primaryMetal.Pcs += obj?.primaryMetal.Pcs;
          resultArr[findRecord].primaryMetal.Wt += obj?.primaryMetal.Wt;
          resultArr[findRecord].primaryMetal.Amount += obj?.primaryMetal.Amount;
          resultArr[findRecord].netWtFinal += obj?.netWtFinal;
          resultArr[findRecord].metalAmountFinal += obj?.metalAmountFinal
        }
      }

      jobWiseLabourCalc += ((e?.MetalDiaWt - findingWt) * e?.MaKingCharge_Unit);
      jobWiseMinusFindigWt += (e?.MetalDiaWt - findingWt);

      e?.diamonds?.forEach((ele, ind) => {
        let findDiamond = diamonds?.findIndex((elem, index) => elem?.isRateOnPcs === ele?.isRateOnPcs);
        diamondTotal += (ele?.Amount);
        if (findDiamond === -1) {
          diamonds?.push(ele);
        } else {
          diamonds[findDiamond].Wt += ele?.Wt;
          diamonds[findDiamond].Pcs += ele?.Pcs;
          diamonds[findDiamond].Amount += (ele?.Amount);
        }
      });

      e?.colorstone?.forEach((ele, ind) => {
        // total2.total += (ele?.Amount );
        let findColorStones = colorStones?.findIndex((elem, index) => elem?.isRateOnPcs === ele?.isRateOnPcs);
        if (findColorStones === -1) {
          colorStones?.push(ele);
        } else {
          colorStones[findColorStones].Wt += ele?.Wt;
          colorStones[findColorStones].Pcs += ele?.Pcs;
          colorStones[findColorStones].Amount += (ele?.Amount);
        }
        if (ele?.isRateOnPcs === 0) {
          colorStone1Total1 += ele?.Amount
        } else {
          colorStone2Total2 += ele?.Amount
        }
      });

      e?.misc?.forEach((ele, ind) => {
        if (ele?.isRateOnPcs === 0) {
          misc1Total1 += ele?.Amount;
        } else {
          misc2Total2 += ele?.Amount;
        }
        if (ele?.IsHSCOE !== 0) {
          let findMisc = miscs?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName);
          if (findMisc === -1) {
            miscs?.push(ele);
          } else {
            miscs[findMisc].Wt += ele?.Wt
            miscs[findMisc].Pcs += ele?.Pcs
            miscs[findMisc].Amount += (ele?.Amount)
          }
          // total2.total += (ele?.Amount);
        }
        else if (ele?.IsHSCOE === 0) {
          // total2.total += ele?.Amount;
          let findMisc = misc2?.findIndex((elem, index) => elem?.isRateOnPcs === ele?.isRateOnPcs);
          if (findMisc === -1) {
            misc2?.push(ele);
          } else {
            misc2[findMisc].Wt += ele?.Wt;
            misc2[findMisc].Pcs += ele?.Pcs;
            misc2[findMisc].Amount += (ele?.Amount);
          }

        }
      });

      e?.other_details?.forEach((ele, ind) => {
        let findOther = otherCharges?.findIndex((elem, index) => elem?.label === ele?.label);
        total2.total += (+ele?.value);
        if (findOther === -1) {
          otherCharges?.push(ele);
        } else {
          otherCharges[findOther].value = +otherCharges[findOther]?.value + +ele?.value;
        }
      });

    });
    let totalPcs = totalPcss?.reduce((acc, cObj) => acc + cObj?.value, 0);
    // total2.total += labour?.totalAmount
    total2.total += (diamondTotal / data?.BillPrint_Json[0]?.CurrencyExchRate) + (colorStone1Total1 / data?.BillPrint_Json[0]?.CurrencyExchRate) +
      (colorStone2Total2 / data?.BillPrint_Json[0]?.CurrencyExchRate) + (misc1Total1 / data?.BillPrint_Json[0]?.CurrencyExchRate) +
      (misc2Total2 / data?.BillPrint_Json[0]?.CurrencyExchRate) + labour?.totalAmount + diamondHandling;

    labour.primaryWt = jobWiseMinusFindigWt;
    resultArr.sort((a, b) => {
      const labelA = a.MetalTypePurity.toLowerCase();
      const labelB = b.MetalTypePurity.toLowerCase();

      // Check if labels contain numbers
      const hasNumberA = /\d/.test(labelA);
      const hasNumberB = /\d/.test(labelB);

      if (hasNumberA && !hasNumberB) {
        return -1; // Label with number comes before label without number
      } else if (!hasNumberA && hasNumberB) {
        return 1; // Label without number comes after label with number
      } else {
        // Both labels have numbers or both don't, sort alphabetically
        return labelA.localeCompare(labelB);
      }
    });
    setTotalss({ ...totalss, total: total2?.total, discount: total2?.discount, totalPcs: totalPcs, });
    setMainData({
      ...mainData, resultArr: resultArr, findings: findings, diamonds: diamonds, colorStones: colorStones,
      miscs: miscs, otherCharges: otherCharges, misc2: misc2, labour: labour, diamondHandling: diamondHandling
    });
  };

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

  return loader ? (
    <Loader />
  ) : msg === "" ? (
    <div
      className={`container container-fluid max_width_container mt-1 ${style?.InvoicePrint_10_11} pad_60_allPrint`}
    >
      {/* buttons */}
      <div
        className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}
      >
        <div className={`form-check ps-3 ${style?.printBtn}`}>
          <input
            type="button"
            className="btn_white blue py-2 mt-2"
            value="Print"
            onClick={(e) => handlePrint(e)}
          />
        </div>
      </div>
      {/* header */}
      <div className={`${style2.headline} headerTitle`}>{headerData?.PrintHeadLabel}</div>
      <div className={`${style?.font_12} ${style2.companyDetails}`}>
        <div className={`${style2.companyhead} p-2`}>
          <div className={`${style2.lines} ${style?.font_16}`} style={{ fontWeight: "bold" }}>
            {headerData?.CompanyFullName}
          </div>
          <div className={style2.lines}>{headerData?.CompanyAddress}</div>
          <div className={style2.lines}>{headerData?.CompanyAddress2}</div>
          <div className={style2.lines}>{headerData?.CompanyCity}-{headerData?.CompanyPinCode},{headerData?.CompanyState}({headerData?.CompanyCountry})</div>
          {/* <div className={style2.lines}>Tell No: {headerData?.CompanyTellNo}</div> */}
          <div className={style2.lines}>T:  {headerData?.CompanyTellNo} | TOLL FREE {headerData?.CompanyTollFreeNo} | TOLL FREE {headerData?.CompanyTollFreeNo}</div>
          <div className={style2.lines}>
            {headerData?.CompanyEmail} | {headerData?.CompanyWebsite}
          </div>
          <div className={style2.lines}>
            {/* {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber} */}
            {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber}
          </div>
        </div>
        <div style={{ width: "30%" }} className="d-flex justify-content-end align-item-center h-100">
          {isImageWorking && (headerData?.PrintLogo !== "" &&
            <img src={headerData?.PrintLogo} alt=""
              className='w-100 h-auto ms-auto d-block object-fit-contain'
              style={{ maxWidth: '116px' }}
              onError={handleImageErrors} height={120} width={150} />)}
          {/* <img src={headerData?.PrintLogo} alt="" className={style2.headerImg} /> */}
        </div>
      </div>
      {/* barcodes */}
      {pnm === "invoice print 10" && <div className={`mb-1 ${style?.font_15}`}>
        <div className={`d-flex justify-content-between border p-2 pb-1 `}>
          <div className={`${style?.barcode}`}>
            <BarcodePrintGenerator data={headerData?.VenCode} />
            <p className="fw-bold text-center">{headerData?.VenCode}</p>
          </div>
          <div className={`${style?.barcode}`}>
            <BarcodePrintGenerator data={headerData?.InvoiceNo} />
            <p className="fw-bold text-center">{headerData?.InvoiceNo}</p>
          </div>
        </div>
      </div>}

      <div className={`border d-flex ${style?.font_12}`}>
        <div className="col-4 px-2 border-end">
          <p>{headerData?.lblBillTo}</p>
          <p className={`fw-bold pe-2 ${style?.font_14}`}>{headerData?.customerfirmname}</p>
          <p>{headerData?.customerAddress1}</p>
          <p>{headerData?.customerAddress2}</p>
          <p>
            {headerData?.customercity1} - {" "}
            {headerData?.PinCode}
          </p>
          <p>{headerData?.customeremail1}</p>
          <p>{headerData?.vat_cst_pan}</p>
          <p>
            {headerData?.Cust_CST_STATE}-{headerData?.Cust_CST_STATE_No}
          </p>
        </div>
        <div className="col-4 px-2 border-end">
          <p>Ship To,</p>
          <p className={`fw-bold ${style?.font_14}`}>{headerData?.customerfirmname}</p>
          {customerAddress.map((e, i) => {
            return <p key={i}>{e}</p>;
          })}
        </div>
        <div className="col-4 px-2">
          <div className="d-flex">
            <div className="fw-bold col-6">BILL NO</div>
            <div className="col-6">{headerData?.InvoiceNo} </div>
          </div>
          <div className="d-flex">
            <div className="fw-bold col-6">DATE</div>
            <div className="col-6">{headerData?.EntryDate} </div>
          </div>
          <div className="d-flex">
            <div className="fw-bold col-6">{headerData?.HSN_No_Label}</div>
            <div className="col-6">{headerData?.HSN_No} </div>
          </div>
          <div className="d-flex">
            <div className="fw-bold col-6">NAME OF GOODS</div>
            <div className="col-6">{headerData?.NameOfGoods} </div>
          </div>
          <div className="d-flex">
            <div className="fw-bold col-6">PLACE OF SUPPLY</div>
            <div className="col-6">{headerData?.customerstate} </div>
          </div>
          <div className="d-flex">
            <div className="fw-bold col-6">TERMS</div>
            <div className="col-6">{headerData?.DueDays} </div>
          </div>
        </div>
      </div>

      <div className="my-1">
        <div className={`d-flex border ${style?.font_15}`}>
          <div className="col-3 border-end">
            <p className="text-center fw-bold border-bottom">DESCRIPTION</p>
          </div>
          <div className="col-9">
            <div className="d-flex border-bottom">
              <div style={{ minWidth: "17%", width: "17%" }} className="fw-bold px-1">Detail</div>
              <div style={{ minWidth: "14.5%", width: "14.5%" }} className="fw-bold px-1 text-end">Gross Wt. </div>
              <div style={{ minWidth: "14.5%", width: "14.5%" }} className="fw-bold px-1 text-end">Net Wt. </div>
              <div style={{ minWidth: "9%", width: "9%" }} className="fw-bold px-1 text-end">Pcs </div>
              <div style={{ minWidth: "15%", width: "15%" }} className="fw-bold px-1 text-end">Qty </div>
              <div style={{ minWidth: "15%", width: "15%" }} className="fw-bold px-1 text-end">Rate </div>
              <div style={{ minWidth: "15%", width: "15%" }} className="fw-bold px-1 text-end">Amount</div>
            </div>
          </div>
        </div>
        <div className="d-flex border-start border-end border-bottom">
          <div className="col-3 border-end d-flex align-items-center pt-5 flex-column">
            <p className={`w-100 text-center pb-1 ${style?.font_13}`}>{mainDatas?.mainTotal?.diamonds?.Pcs > 0 ? "DIAMOND STUDDED" : "GOLD"}  JEWELLERY</p>
            <p className={`fw-bold ${style?.font_17}`}>Total Pcs : {NumberWithCommas(totalss?.totalPcs, 0)}</p>
          </div>
          <div className={`col-9 ${style?.font_13}`}>
            {/* <div className="d-flex border-bottom">
              <div className="col-2 px-1">
                {data.map((e, i) => {
                  return (
                    <p className={`${style?.min_height_21}`} key={i}>
                      {e?.MetalTypePurity}
                    </p>
                  );
                })}
                {otherMaterial.map((e, i) => {
                  return (
                    <p className={`${style?.min_height_21}`} key={i}>
                      {e?.title}
                    </p>
                  );
                })}
              </div>
              <div className="col-2 px-1">
                {data.map((e, i) => {
                  return e?.GroupJob === "" ? (
                    <p className={`${style?.min_height_21} text-end`} key={i}>
                      {e?.grossWt !== 0 && `${NumberWithCommas(e?.grossWt, 3)} gms`}
                    </p>
                  ) : e?.grossShow ? (
                    <p className={`${style?.min_height_21} text-end`} key={i}>
                      {e?.grossWt !== 0 && `${NumberWithCommas(e?.grossWt, 3)} gms`}
                    </p>
                  ) : (
                    <p className={`${style?.min_height_21}`} key={i}></p>
                  );
                })}
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
              </div>
              <div className="col-2 px-1">
                {data.map((e, i) => {
                  return (
                    <p className={`${style?.min_height_21} text-end`} key={i}>
                      {NumberWithCommas(e?.NetWt, 3)} gms
                    </p>
                  );
                })}
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
              </div>
              <div className="col-1 px-1">
                {Array.from({ length: data.length }).map((e, i) => {
                  return (
                    <p
                      key={i}
                      className={`${style?.min_height_21} text-end`}
                    ></p>
                  );
                })}
                {otherMaterial.map((e, i) => {
                  return (
                    <p className={`${style?.min_height_21} text-end`} key={i}>
                      {e?.Pcs !== 0 && NumberWithCommas(e?.Pcs, 0)}
                    </p>
                  );
                })}
              </div>
              <div className="col-1 px-1">
                {Array.from({ length: data.length }).map((e, i) => {
                  return (
                    <p
                      key={i}
                      className={`${style?.min_height_21} text-end`}
                    ></p>
                  );
                })}
                {otherMaterial.map((e, i) => {
                  return (
                    <p className={`${style?.min_height_21} text-end`} key={i}>
                      {e?.Wt !== 0 && e?.Wt}
                    </p>
                  );
                })}
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
              </div>
              <div className="col-2 px-1">
                {data.map((e, i) => {
                  return (
                    <p className={`${style?.min_height_21} text-end`} key={i}>
                      {NumberWithCommas(e?.Rate, 2)}
                    </p>
                  );
                })}
                {otherMaterial.map((e, i) => {
                  return (
                    e?.Rate !== 0 && (
                      <p className={`${style?.min_height_21} text-end`} key={i}>
                        {e?.Rate}
                      </p>
                    )
                  );
                })}
              </div>
              <div className="col-2 px-1">
                {data.map((e, i) => {
                  return (
                    <p className={`${style?.min_height_21} text-end`} key={i}>
                      {NumberWithCommas(e?.Amount, 2)}
                    </p>
                  );
                })}
                {otherMaterial.map((e, i) => {
                  return (
                    <p className={`${style?.min_height_21} text-end`} key={i}>
                      {NumberWithCommas(e?.Amount, 2)}
                    </p>
                  );
                })}
              </div>
            </div> */}
            {mainData?.resultArr?.map((e, i) => {
              return <div className="d-flex" key={i}>
                <div style={{ minWidth: "17%", width: "17%" }} className=" px-1 text-uppercase"><p>{e?.primaryMetal?.ShapeName} {e?.primaryMetal?.QualityName}</p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className=" px-1 text-end"><p>{NumberWithCommas(e?.grosswt, 3)} Gms</p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className=" px-1 text-end"><p>{NumberWithCommas(e?.netWtFinal, 3)} Gms</p></div>
                <div style={{ minWidth: "9%", width: "9%" }} className=" px-1"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className=" px-1"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p>{e?.netWtFinal !== 0 && NumberWithCommas(e?.metalAmountFinal / e?.netWtFinal, 2)}</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p>{NumberWithCommas(e?.metalAmountFinal, 2)}</p></div>
              </div>
            })}
            {mainData?.findings?.map((e, i) => {
              return <div className="d-flex" key={i}>
                <div style={{ minWidth: "17%", width: "17%" }} className="px-1 text-uppercase"><p>{e?.ShapeName} {e?.QualityName}</p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Wt, 3)} Gms</p></div>
                <div style={{ minWidth: "9%", width: "9%" }} className="px-1"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Rate, 2)}</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Amount / headerData?.CurrencyExchRate, 2)}</p></div>
              </div>
            })}
            {mainData?.diamonds?.map((e, i) => {
              return <div className="d-flex" key={i}>
                <div style={{ minWidth: "17%", width: "17%" }} className="px-1 text-uppercase"><p>{e?.MasterManagement_DiamondStoneTypeName}</p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "9%", width: "9%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Pcs, 0)}</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Wt, 3)} Ctw</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{(e?.isRateOnPcs === 0 ? (e?.Wt !== 0 && <>{NumberWithCommas(e?.Amount / e?.Wt, 2)} / Wt</>) : (e?.Pcs !== 0 && <>{NumberWithCommas(e?.Amount / e?.Pcs, 2)} / Pcs</>))}</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Amount / headerData?.CurrencyExchRate, 2)}</p></div>
              </div>
            })}
            {mainData?.colorStones?.map((e, i) => {
              return <div className="d-flex" key={i}>
                <div style={{ minWidth: "17%", width: "17%" }} className="px-1 text-uppercase"><p>{e?.MasterManagement_DiamondStoneTypeName}</p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className=" px-1 text-end"><p></p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className=" px-1 text-end"><p></p></div>
                <div style={{ minWidth: "9%", width: "9%" }} className=" px-1 text-end"><p>{NumberWithCommas(e?.Pcs, 0)}</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p>{NumberWithCommas(e?.Wt, 3)} Ctw</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p>{(e?.isRateOnPcs === 0 ? (e?.Wt !== 0 && <>{NumberWithCommas(e?.Amount / e?.Wt, 2)} / Wt</>) : (e?.Pcs !== 0 && <>{NumberWithCommas(e?.Amount / e?.Pcs, 2)} / Pcs</>))}</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p>{NumberWithCommas(e?.Amount / headerData?.CurrencyExchRate, 2)}</p></div>
              </div>
            })}
            {mainData?.misc2?.map((e, i) => {
              return <div className="d-flex" key={i}>
                <div style={{ minWidth: "17%", width: "17%" }} className="px-1 text-uppercase"><p>OTHER MATERIAL</p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "9%", width: "9%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Pcs, 0)}</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Wt, 3)} Gms</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{(e?.isRateOnPcs === 0 ? (e?.Wt !== 0 && <>{NumberWithCommas(e?.Amount / e?.Wt, 2)} / Wt</>) : (e?.Pcs !== 0 && <>{NumberWithCommas(e?.Amount / e?.Pcs, 2)} / Pcs</>))}</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Amount / headerData?.CurrencyExchRate, 2)}</p></div>
              </div>
            })}
            <div className="d-flex">
              <div style={{ minWidth: "17%", width: "17%" }} className="px-1 text-uppercase"><p>{mainData?.labour?.label}</p></div>
              <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
              <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
              <div style={{ minWidth: "9%", width: "9%" }} className="px-1 text-end"><p></p></div>
              <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p></p></div>
              <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{mainData?.labour?.primaryWt !== 0 && NumberWithCommas(mainData?.labour?.makingAmount / mainData?.labour?.primaryWt, 2)}</p></div>
              <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(mainData?.labour?.totalAmount / headerData?.CurrencyExchRate, 2)}</p></div>
            </div>
            {mainData?.miscs?.map((e, i) => {
              return <div className="d-flex" key={i}>
                <div style={{ minWidth: "17%", width: "17%" }} className="px-1 text-uppercase"><p>{e?.ShapeName}</p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "9%", width: "9%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Amount / headerData?.CurrencyExchRate, 2)}</p></div>
              </div>
            })}
            <div className="d-flex">
              <div style={{ minWidth: "17%", width: "17%" }} className=" px-1 text-uppercase"><p>HANDLING</p></div>
              <div style={{ minWidth: "14.5%", width: "14.5%" }} className=" px-1 text-end"><p></p></div>
              <div style={{ minWidth: "14.5%", width: "14.5%" }} className=" px-1 text-end"><p></p></div>
              <div style={{ minWidth: "9%", width: "9%" }} className=" px-1 text-end"><p></p></div>
              <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p></p></div>
              <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p></p></div>
              <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p>{NumberWithCommas(mainData?.diamondHandling, 2)}</p></div>
            </div>
            {mainData?.otherCharges?.map((e, i) => {
              return <div className="d-flex" key={i}>
                <div style={{ minWidth: "17%", width: "17%" }} className=" px-1 text-uppercase"><p>{e?.label}</p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className=" px-1 text-end"><p></p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className=" px-1 text-end"><p></p></div>
                <div style={{ minWidth: "9%", width: "9%" }} className=" px-1 text-end"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p>{NumberWithCommas(+e?.value, 2)}</p></div>
              </div>
            })}
          </div>
        </div>
        {/* total */}
        <div className={`d-flex border-start border-end border-bottom mb-1 no_break ${style?.font_15}`}>
          <div className="col-3 border-end d-flex align-items-center justify-content-center flex-column"></div>
          <div className="col-9">
            <div className="d-flex border-bottom">
              <div className="col-2 px-1">
                <p className={`${style?.min_height_21} fw-bold`}>Total</p>
              </div>
              <div className="col-2 px-1">
                <p className={`${style?.min_height_21} text-end`}></p>
              </div>
              <div className="col-2 px-1">
                <p className={`${style?.min_height_21} text-end`}></p>
              </div>
              <div className="col-1 px-1">
                <p className={`${style?.min_height_21} text-end`}></p>
              </div>

              <div className="col-1 px-1">
                <p className={`${style?.min_height_21} text-end`}></p>
              </div>
              <div className="col-2 px-1">
                <p className={`${style?.min_height_21} text-end`}></p>
              </div>
              <div className="col-2 px-1">
                <p className={`${style?.min_height_21} text-end fw-bold`}>
                  {NumberWithCommas(totalss?.total, 2)}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* taxes */}
        <div className={`d-flex border no_break ${style?.font_15}`}>
          <div className="col-8 border-end"></div>
          <div className="col-4 px-1">
            {totalss?.discount !== 0 && <><div className="d-flex justify-content-between">
              <p>
                Discount
              </p>
              <p>{NumberWithCommas(totalss?.discount, 2)}</p>
            </div>
            </>
            }
            <div className="d-flex justify-content-between">
              <p className="fw-bold"> Total Amount </p>
              <p className="fw-bold"> {NumberWithCommas(mainDatas?.mainTotal?.total_amount, 2)}</p>
            </div>
            {mainDatas?.allTaxes?.map((e, i) => {
              return (
                <div className="d-flex justify-content-between" key={i}>
                  <p>
                    {e?.name} @ {e?.per}
                  </p>
                  <p>{NumberWithCommas(+e?.amount * headerData?.CurrencyExchRate, 2)}</p>
                </div>
              );
            })}
            {headerData?.AddLess !== 0 && (
              <div className="d-flex justify-content-between">
                <p>{headerData?.AddLess > 0 ? "Add" : "Less"}</p>
                <p>{headerData?.AddLess}</p>
              </div>
            )}
            {headerData?.FreightCharges !== 0 && (
              <div className="d-flex justify-content-between">
                <p>BY COURIER	</p>
                <p>{NumberWithCommas(headerData?.FreightCharges, 2)}</p>
              </div>
            )}
          </div>
        </div>
        <div className={`d-flex border-start border-end border-bottom no_break ${style?.font_15}`}>
          <div className="col-8 border-end px-1">
            <p className="fw-bold"> IN Words Indian Rupees</p>
            <p className="fw-bold">
              {toWords.convert(+fixedValues(mainDatas?.mainTotal?.total_amount+ mainDatas?.allTaxes?.reduce((acc, cObj) => acc + (+cObj?.amount * headerData?.CurrencyExchRate), 0) + headerData?.AddLess + headerData?.FreightCharges, 2))} Only.
            </p>
          </div>
          <div className="col-4 px-1 d-flex justify-content-between align-items-center">
            <p className="text-end fw-bold">Grand Total </p>
            <p className="text-end fw-bold">
              {NumberWithCommas(mainDatas?.mainTotal?.total_amount + mainDatas?.allTaxes?.reduce((acc, cObj) => acc + (+cObj?.amount * headerData?.CurrencyExchRate), 0) +
                headerData?.AddLess + headerData?.FreightCharges, 2)}
            </p>
          </div>
        </div>
        <div
          className={`border-start border-end border-bottom p-1 no_break ${style?.Declaration}`}
          dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}
        ></div>
        <p className="p-1 no_break">
          <span className="fw-bold"> REMARKS :</span> {headerData?.PrintRemark}
        </p>
        {/* {footer} */}
        <div className={`${footerStyle.container} no_break ${style?.font_15} ${style?.footer}`} >
          <div className={`${footerStyle.block1f3} ${style?.footers}`} style={{ width: "33.33%", borderRight: "1px solid #e8e8e8" }} >
            <div className={footerStyle.linesf3} style={{ fontWeight: "bold" }}>Bank Detail</div>
            <div className={footerStyle.linesf3}>Bank Name: {headerData?.bankname}</div>
            <div className={footerStyle.linesf3}>Branch: {headerData?.bankaddress}</div>
            <div className={footerStyle.linesf3}>Account Name: {headerData?.accountname}</div>
            <div className={footerStyle.linesf3}>Account No. : {headerData?.accountnumber}</div>
            <div className={footerStyle.linesf3}>RTGS/NEFT IFSC: {headerData?.rtgs_neft_ifsc}</div>
            <div className={footerStyle.linesf3}>Enquiry No. </div>
            <div className={footerStyle.linesf3}> (E & OE)</div>
          </div>
          <div className={`${footerStyle.block2f3} ${style?.footers}`} style={{ width: "33.33%", borderRight: "1px solid #e8e8e8" }} >
            <div className={`${footerStyle.linesf3} fw-normal`}>Signature</div>
            <div className={footerStyle.linesf3}>{headerData?.customerfirmname}</div>
          </div>
          <div className={`${footerStyle.block2f3} ${style?.footers}`} style={{ width: "33.33%" }}>
            <div className={`${footerStyle.linesf3} fw-normal`}>Signature</div>
            <div className={footerStyle.linesf3}>{headerData?.CompanyFullName}</div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
      {msg}
    </p>
  );
};

export default InvoicePrint8;
