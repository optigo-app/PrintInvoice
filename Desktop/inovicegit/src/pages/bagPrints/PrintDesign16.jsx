// import React, { useEffect, useState } from 'react';
// import printData from "../json/print_2.json";
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';
// import queryString from 'query-string';
// import "../../assets/css/bagprint/print16.css";
// import Loader from '../../components/LoaderBag';
// import BarcodeGenerator from '../../components/BarcodeGenerator';

// const PrintDesign16 = ({ queries, headers }) => {
//     const location = useLocation();
//     const queryParams = queryString.parse(location.search);
//     let jobs = queryParams.str_srjobno;
//     if (Object.keys(queryParams).length !== 0) {
//         jobs = jobs.split(",");
//     }
//     const [print, setprint] = useState(jobs);
//     const [data, setData] = useState([]);
//     const chunkSize = 15;
//     useEffect(() => {
//         if (Object.keys(queryParams).length !== 0) {
//             atob(queryParams.imagepath);
//         }
//         const fetchData = async () => {
//             try {
//                 const responseData = [];
//                 for (const url of print) {
//                     let p_tag = { "SerialJobno": `${url}`, "customerid": `${queries.custid}`, "BagPrintName": `${queries.printname}` };
//                     let jsonString = JSON.stringify(p_tag);
//                     let base64String = btoa(jsonString);
//                     let Body = {
//                         "con": `{\"id\":\"\",\"mode\":\"${queries.printname}\",\"appuserid\":\"${queries.appuserid}\"}`,
//                         "p": `${base64String}`,
//                         "f": `${queries.appuserid} ${queries.printname}`
//                     };
//                     let urls = atob(queries.url);
//                     const response = await axios.post(urls, Body, { headers: headers });

//                     let datas = JSON.parse(response.data.d);
//                     let length = 0;
//                     let clr = {
//                         clrPcs: 0,
//                         clrWt: 0
//                     };
//                     let dia = {
//                         diaPcs: 0,
//                         diaWt: 0
//                     };
//                     let diamondData = [];
//                     let clrData = [];
//                     let diamondWeight = 0;
//                     let diamondPcs = 0;
//                     let clrWeight = 0;
//                     let clrpcs = 0;
//                     datas.rd1.map((e, i) => {
//                         if (e.MasterManagement_DiamondStoneTypeid === 3 || e.MasterManagement_DiamondStoneTypeid === 4) {
//                             length++;
//                         }
//                         if (e.MasterManagement_DiamondStoneTypeid === 3) {
//                             dia.diaPcs = dia.diaPcs + e.ActualPcs;
//                             dia.diaWt = dia.diaWt + e.ActualWeight;
//                             diamondData.push(e);
//                             diamondWeight = diamondWeight + e.ActualWeight;
//                             diamondPcs = diamondPcs + e.ActualPcs;
//                         } else if (e.MasterManagement_DiamondStoneTypeid === 4) {
//                             clr.clrPcs = clr.clrPcs + e.ActualPcs;
//                             clr.clrWt = clr.clrWt + e.ActualWeight;
//                             clrData.push(e);
//                             clrWeight = clrWeight + e.ActualWeight;
//                             clrpcs = clrpcs + e.ActualPcs;
//                         }
//                     });

//                     if (diamondData.length > 0) {
//                         let diamondDataObject = {
//                             ActualPcs: diamondPcs,
//                             ActualWeight: diamondWeight,
//                             ColorCode: "",
//                             ColorName: "",
//                             ConcatedFullShapeQualityColorCode: "",
//                             ConcatedFullShapeQualityColorName: "",
//                             ConcatedShapeQualityColorName: "",
//                             IssuePcs: "",
//                             IssueWeight: "",
//                             LimitedShapeQualityColorCode: "",
//                             MasterManagement_DiamondStoneTypeid: "",
//                             MetalColor: "",
//                             Quality: "",
//                             QualityCode: "",
//                             Quality_DisplayOrder: "",
//                             SerialJobno: "",
//                             Shapecode: "",
//                             Shapename: "Total",
//                             Size_DisplayOrder: "",
//                             Sizename: "",
//                             TruncateShapename: "",
//                             totalFontWeight: "900"
//                         };
//                         diamondData.push(diamondDataObject);
//                     }
//                     if (clrData.length > 0) {
//                         let clrDataObject = {
//                             ActualPcs: clrpcs,
//                             ActualWeight: clrWeight,
//                             ColorCode: "",
//                             ColorName: "",
//                             ConcatedFullShapeQualityColorCode: "",
//                             ConcatedFullShapeQualityColorName: "",
//                             ConcatedShapeQualityColorName: "",
//                             IssuePcs: "",
//                             IssueWeight: "",
//                             LimitedShapeQualityColorCode: "",
//                             MasterManagement_DiamondStoneTypeid: "",
//                             MetalColor: "",
//                             Quality: "",
//                             QualityCode: "",
//                             Quality_DisplayOrder: "",
//                             SerialJobno: "",
//                             Shapecode: "",
//                             Shapename: "Total",
//                             Size_DisplayOrder: "",
//                             Sizename: "",
//                             TruncateShapename: "",
//                             totalFontWeight: "900"
//                         };
//                         clrData.push(clrDataObject);
//                     }
//                     let originlData = [...diamondData, ...clrData];
//                     let chData = [];
//                     let count = 0;
//                     for (let i = 0; i < originlData.length; i += chunkSize) {
//                         let len = 15 - (originlData.slice(i, i + chunkSize)).length;
//                         count++;

//                         if (count % 5 === 0) {
//                         }
//                         chData.push({ data: originlData.slice(i, i + chunkSize), length: len });
//                     }
//                     if (chData.length === 0) {
//                         length = 15;
//                     } else {
//                         length = 13 - length;
//                     }
//                     let imagePath = queryParams.imagepath;
//                     imagePath = atob(queryParams.imagepath);
//                     let img = imagePath + datas?.rd[0]?.ThumbImagePath;
//                     responseData.push({ data: datas, additional: { length: length, clr: clr, dia: dia, img: img, chdata: chData } });
//                 }
//                 setData(responseData);
//             } catch (error) {
//                 console.log(error);
//             }
//         };
//         fetchData();
//     }, []);

//     const handleImageError = (e) => {
//         e.target.src = require('../assets/images/default.jpg');
//     };

//     useEffect(() => {
//         if (data.length !== 0) {
//             setTimeout(() => {
//                 window.print();
//             }, 5000);
//         }

//     }, [data]);

//     const handlePrint = (e) => {
//         e.preventDefault();
//         window.print();
//     };
//     const handleImageLoad = (eve, i, dataLen) => {
//         if(i == dataLen - 1){
//             setTimeout(() => window.print(), 5000)
//         }
//     }
//     return (
//         <div>
//             {data?.length === 0 ? <Loader /> :
//                 <>
//                     <div className="print_btn"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
//                         Print
//                     </button></div>
//                     <div className="d_flex flex_wrap  print_section bag_design_2"  >

//                         {Array.from({ length: queries.pageStart }, (_, index) => (
//                             index > 0 && <div key={index} className="container_2 ml_8mm mb_2 mt_2 pt_2 bag_2" style={{ minHeight: "139mm" }}></div>

//                         ))}
//                         {data?.map((e, i) => {
//                             if (e?.additional?.chdata?.length === 0) {
//                                 return <>
//                                     <div className="container_2 ml_8mm mb_2 mt_2 pt_2 bag_2" key={`bagprint16${i}`}>
//                                         <div className="print_2 ">
//                                             <div className="border_collapse print_design_2">
//                                                 <div style={{ justifyContent: "space-between", borderBottom: "2px solid", borderTop: "0.5291666667mm solid #000", borderRight: "0.2645833333mm solid #000" }} className='d_flex'>
//                                                     <div className='print_design_2_head'>
//                                                         <div className='thikborder' style={{ background: ``, borderRight: "1px solid black" }}>
//                                                             {/* <div className='thikborder' style={{ background: `${e?.data?.rd[0].prioritycolorcode}`, borderRight: "1px solid black" }}> */}
//                                                             <div className='d_flex print_2_head px_2'>
//                                                                 <div className="text_end pt_2px pr_2"><span style={{ fontWeight: "900", paddingRight: "1.3229166667mm", fontSize: "14px" }}>{e?.data?.rd[0]?.serialjobno}</span></div>
//                                                                 <div className="text_start pt_2px pl_3">ORD: <span style={{ fontWeight: "700" }}>
//                                                                     {e?.data?.rd[0]?.OrderDate}
//                                                                 </span></div>
//                                                                 <div className="text_start pt_2px" style={{ color: "red" }}>DUE:
//                                                                     {e?.data?.rd[0]?.promisedate === "01 Jan 1900 " ?
//                                                                         <span style={{ fontWeight: "700" }}></span> :
//                                                                         <span style={{ fontWeight: "700" }}>{e?.data?.rd[0]?.promisedate}</span>}
//                                                                 </div>
//                                                             </div>
//                                                             <div className='d_flex print_2_head'>
//                                                                 <div className="text_start  pl_3">PARTY: <span style={{ fontWeight: "700" }} className="text_start">{e?.data?.rd[0]?.CustomerCode}</span><span style={{ fontWeight: "normal" }}></span></div>
//                                                                 <div style={{ paddingRight: "1.3229166667mm", textAlign: "right" }}>{e?.data?.rd[0]?.MetalType} {" "} {e?.data?.rd[0]?.MetalColor}</div>
//                                                             </div>
//                                                             <div className='d_flex print_2_head'>
//                                                                 <div className="text_start  pl_3">DGN:
//                                                                     <span style={{ fontWeight: "700", fontSize: "2.5mm" }}>
//                                                                         {e?.data?.rd[0]?.Quantity === 0 ?
//                                                                             `${(e?.data?.rd[0]?.Designcode1)?.length > 0 ? (e?.data?.rd[0]?.Designcode1) : ''}(${1}PCS)` :
//                                                                             `${(e?.data?.rd[0]?.Designcode1)?.length > 0 ? (e?.data?.rd[0]?.Designcode1) : ''}(${(e?.data?.rd[0]?.Quantity)?.length > 0 ? (e?.data?.rd[0]?.Quantity) : '0 '}PCS)`
//                                                                         }
//                                                                     </span>
//                                                                     <span style={{ fontWeight: "normal" }}>
//                                                                     </span>
//                                                                 </div>
//                                                                 <div className="text_start" style={{ textAlign: "right", paddingRight: "1.3229166667mm" }}>ORD NO:- <span style={{ fontWeight: "700" }}>{e?.data?.rd[0]?.OrderNo}</span></div>
//                                                             </div>
//                                                             <div className='d_flex print_2_head border_bottom2'>
//                                                                 <div className="text_start pl_3">SIZE:<span style={{ fontWeight: "700" }}>{e?.data?.rd[0]?.Size}</span></div>
//                                                                 <div className="text_start">OrT: <span style={{ fontWeight: "700" }}>{e?.data?.rd[0]?.OrderTypeName}</span></div>
//                                                                 <div className="text_start" style={{ "textAlign": "center", display: "flex", alignItems: "center", justifyContent: "center" }}>{e?.data?.rd[0]?.prioritycode}</div>
//                                                             </div>
//                                                         </div>

//                                                         <div className=''>
//                                                             <div className='header_16'>
//                                                                 <div className='jobInfo16'>
//                                                                     <div className='net16A'><b>NET WT:</b></div>
//                                                                     <div className='net16A'><b>DIA PCS:</b></div>
//                                                                     <div className='net16A'><b>CLR PCS:</b></div>
//                                                                     <div className='net16A' style={{ borderBottom: "0px" }}><b>QT NO.</b></div>
//                                                                 </div>
//                                                                 <div className='jobInfo16'>
//                                                                     <div className='net16A'><b>{(e?.data?.rd[0]?.netwt ?? 0).toFixed(3)}</b></div>
//                                                                     <div className='net16A'><b>{e?.additional?.dia?.diaPcs === 0 ? 0 : e?.additional?.dia?.diaPcs}</b></div>
//                                                                     <div className='net16A'><b>{e?.additional?.clr?.clrPcs === 0 ? 0 : e?.additional?.clr?.clrPcs}</b></div>
//                                                                     <div className='net16A' style={{ borderBottom: "0px" }}><b>{e?.data?.rd[0]?.Quotation_SKUNo === '' ? 0 : e?.data?.rd[0]?.Quotation_SKUNo}</b></div>
//                                                                 </div>
//                                                                 <div className='jobInfo16'>
//                                                                     <div className='net16A' style={{ width: "67px" }}><b>GR WT:</b></div>
//                                                                     <div className='net16A' style={{ width: "67px" }}><b>DIA WT:</b></div>
//                                                                     <div className='net16A' style={{ width: "67px" }}><b>CLR WT:</b></div>
//                                                                     <div className='net16A' style={{ width: "67px", borderBottom: "0px" }}><b>CREATED BY:</b></div>
//                                                                 </div>
//                                                                 <div className='jobInfo16' style={{ borderRight: "0px", borderLeft: "0px solid" }}>
//                                                                     <div className='net16A'><b>{(e?.data?.rd[0]?.ActualGrossweight ?? 0).toFixed(3)}</b></div>
//                                                                     <div className='net16A'><b>{(e?.additional?.dia?.diaWt === 0 ? 0 : e?.additional?.dia?.diaWt).toFixed(3)}</b></div>
//                                                                     <div className='net16A'><b>{(e?.additional?.clr?.clrWt === 0 ? 0 : e.additional?.clr?.clrWt).toFixed(3)}</b></div>
//                                                                     <div className='net16A' style={{ borderBottom: "0px" }}><b>{e?.data?.rd[0]?.createby === '' ? '' : e?.data?.rd[0]?.createby}</b></div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>

//                                                     <div style={{ height: "130px" }} className="text_start position_relative thikborder">
//                                                         <div >
//                                                             <img src={e.additional.img !== "" ? e.additional.img : require("../assets/images/default.jpg")} alt="" className="img16" onError={e => handleImageError(e)} loading="eager" onLoad={eve => handleImageLoad(eve, i, data?.length)} id='img16' />
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className='border_bottom_0 border_right'>
//                                                     <div className='thikborder'>


//                                                         <div className='d_flex'>
//                                                             <div className="border_right border_bottom display" style={{ height: "3.7041666667mm", fontWeight: "900", paddingLeft: "0.79375mm", width: "14.853583333mm" }}>RM TYPE</div>
//                                                             <div className="border_right border_bottom display" style={{ height: "3.7041666667mm", fontSize: "11.5px", fontWeight: "900", width: "12mm", paddingLeft: "1px" }}>QUALITY</div>
//                                                             <div className="border_right border_bottom display" style={{ height: "3.7041666667mm", fontWeight: "900", paddingLeft: "0.79375mm", width: "12.0015mm" }}>COLOR</div>
//                                                             <div className="border_right border_bottom display" style={{ height: "3.7041666667mm", fontWeight: "900", paddingLeft: "0.79375mm", width: "18.880666667mm" }}>SIZE</div>
//                                                             <div className="border_right border_bottom display" style={{ height: "3.7041666667mm", fontWeight: "900", textAlign: "center", paddingLeft: "0.79375mm", width: "16.345958333mm" }}>ACTUAL</div>
//                                                             <div className="border_right2 border_bottom display" style={{ height: "3.7041666667mm", fontWeight: "900", paddingTop: "2px", paddingLeft: "0.79375mm", width: "10.7mm" }}>WT</div>
//                                                             <div className=" border_bottom position_relative barcode_design_2" rowSpan={16} style={{ padding: "0" }} >
//                                                                 {e?.data?.rd[0]?.serialjobno !== undefined && <>{(e?.data?.rd[0]?.serialjobno !== undefined) && <BarcodeGenerator data={e?.data?.rd[0]?.serialjobno} />}</>}
//                                                             </div>
//                                                         </div>
//                                                         {
//                                                             Array.from({ length: e?.additional?.length }, (_, index) => (
//                                                                 <div className='d_flex ' key={index}>
//                                                                     <div className="border_right border_bottom display" style={{ width: "14.853583333mm", fontSize: "1.8520833333", height: "3.7041666667mm" }}></div>
//                                                                     <div className="border_right border_bottom display" style={{ width: "12.0015mm", fontSize: "1.8520833333", height: "3.7041666667mm", display: "-webkit-box", lineClamp: "1", boxOrient: 'vertical', overflow: "hidden" }}></div>
//                                                                     <div className="border_right border_bottom display" style={{ width: "12.0015mm", fontSize: "1.8520833333", height: "3.7041666667mm" }}></div>
//                                                                     <div className="border_right border_bottom display" style={{ width: "18.880666667mm", fontSize: "1.8520833333", height: "3.7041666667mm" }}></div>
//                                                                     <div className="border_right border_bottom display" style={{ width: "7.3792291667mm", fontSize: "1.8520833333", height: "3.7041666667mm" }}></div>
//                                                                     <div className="border_right border_bottom display" style={{ width: "8.9667291667mm", fontSize: "1.8520833333", height: "3.7041666667mm" }}></div>
//                                                                     <div className="border_right2 border_bottom display" style={{ width: "10.79525mm", fontSize: "1.8520833333", height: "3.7041666667mm" }}></div>
//                                                                 </div>
//                                                             ))
//                                                         }
//                                                     </div>
//                                                 </div>
//                                                 <div className="bag_footer_border_remove border_right">
//                                                     <div className='thikborder'>
//                                                         <div className="bag_footer d_flex">
//                                                             <div className="border_top2 border_right border_bottom bag_td " style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px", fontWeight: "900" }}></div>
//                                                             <div className="border_top2 border_right border_bottom bag_td " style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px", fontWeight: "900" }}>GRAND</div>
//                                                             <div className="border_top2 border_right border_bottom bag_td " style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px", fontWeight: "900" }}>FILLING</div>
//                                                             <div className="border_top2 border_right border_bottom bag_td " style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px", fontWeight: "900" }}>EPD</div>
//                                                             <div className="border_top2 border_right border_bottom bag_td " style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px", fontWeight: "900" }}>P.P.</div>
//                                                             <div className="border_top2 border_right border_bottom bag_td " style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px", fontWeight: "900" }}>SET.</div>
//                                                             <div className="border_top2 border_right border_bottom bag_td " style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px", fontWeight: "900" }}>F.P.</div>
//                                                             <div className="border_top2 border_bottom bag_td " style={{ paddingLeft: "0.79375mm", fontSize: "1.8520833333", height: "3.7041666667mm", fontWeight: "900" }}>RHD-QC</div>
//                                                         </div>
//                                                         {printData[2]?.map((e, i) => {
//                                                             if (e["0"] !== 'DGN INS:' && e["0"] !== 'PRD INS:' && e["0"] !== 'CUST INS:') {
//                                                                 return <div className="bag_footer d_flex last_line" key={i}>
//                                                                     <div className="border_right border_bottom bag_td" style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "11px" }}>{e["0"] === "0" ? "" : e["0"]}</div>
//                                                                     <div className="border_right border_bottom bag_td" style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "1.8520833333" }}>{e["GRAND"] === "0" ? "" : e["GRAND"]}</div>
//                                                                     <div className="border_right border_bottom bag_td" style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "1.8520833333" }}>{e["FILLING"] === "0" ? "" : e["FILLING"]}</div>
//                                                                     <div className="border_right border_bottom bag_td" style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "1.8520833333" }}>{e["EPD"] === "0" ? "" : e["EPD"]}</div>
//                                                                     <div className="border_right border_bottom bag_td" style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "1.8520833333" }}>{e["P.P"] === "0" ? "" : e["P.P"]}</div>
//                                                                     <div className="border_right border_bottom bag_td" style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "1.8520833333" }}>{e["SET"] === "0" ? "" : e["SET"]}</div>
//                                                                     <div className="border_right border_bottom bag_td" style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "1.8520833333" }}>{e["F.P"] === "0" ? "" : e["F.P"]}</div>
//                                                                     <div className="border_bottom bag_td" style={{ fontSize: "1.8520833333", paddingLeft: "0.79375mm", height: "3.7041666667mm" }}>{e["RHD-QC"] === "0" ? "" : e["RHD-QC"]}</div>
//                                                                 </div>;
//                                                             }
//                                                         })}
//                                                     </div>
//                                                     <div style={{ borderTop: "0px solid" }}>
//                                                         <div className="bag_footer d_flex last_line" >
//                                                             <div className="border_right2 border_bottom border_top bag_td line_clamp_2" style={{ paddingLeft: "0.79375mm", height: "7mm", width: "94mm", fontSize: "1.8520833333", minWidth: "100%", color: "red", lineHeight: "9.5px" }}>
//                                                                 DGN INS: {(e?.data?.rd[0]?.officeuse?.length > 0 ? e?.data?.rd[0]?.officeuse : '')}
//                                                             </div>
//                                                         </div>
//                                                         <div className="bag_footer d_flex last_line">
//                                                             <div className="border_right2 border_bottom bag_td line_clamp_2" style={{ paddingLeft: "0.79375mm", height: "7mm", width: "94mm", fontSize: "1.8520833333", minWidth: "100%", color: "red", lineHeight: "9.5px" }}>
//                                                                 PRD INS: {(e?.data?.rd[0]?.ProductInstruction)?.length > 0 ? e?.data?.rd[0]?.ProductInstruction : ''}
//                                                             </div>

//                                                         </div>
//                                                         <div className="bag_footer d_flex last_line">
//                                                             <div className="border_right2 border_bottom2 bag_td line_clamp_2" style={{ paddingLeft: "0.79375mm", height: "6mm", width: "94mm", fontSize: "1.8520833333", minWidth: "100%", color: "red", borderBottom: "3px solid black", lineHeight: "9.5px" }}>CUST INS:
//                                                                 {(e?.data?.rd[0]?.custInstruction)?.length > 0 ? e?.data?.rd[0]?.custInstruction : ''}</div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </>;
//                             }
//                             else {
//                                 return e.additional.chdata.map((chunk, index) => {
//                                     return <>
//                                         <div className="container_2 ml_8mm mb_2 mt_2 pt_2 bag_2" key={index}>
//                                             <div className="print_2 ">
//                                                 <div className="border_collapse print_design_2">
//                                                     <div style={{ justifyContent: "space-between", borderBottom: "2px solid", borderTop: "0.5291666667mm solid #000", borderRight: "0.2645833333mm solid #000" }} className='d_flex'>
//                                                         <div className='print_design_2_head'>
//                                                             <div className='thikborder' style={{ background: `${e?.data?.rd[0]?.prioritycolorcode}` }}>
//                                                                 <div className='d_flex print_2_head px_2'>
//                                                                     <div className="text_end pt_2px pr_2"><span style={{ fontWeight: "900", paddingRight: "1.3229166667mm", fontSize: "13px" }}>{e?.data?.rd[0]?.serialjobno}</span></div>
//                                                                     <div className="text_start pt_2px pl_3">ORD: <span style={{ fontWeight: "700" }}>
//                                                                         {e?.data?.rd[0]?.OrderDate?.slice(0, 12)}
//                                                                     </span></div>
//                                                                     <div className="text_start pt_0.5291666667mm" style={{ color: "red" }}>DUE:
//                                                                         {e.data.rd[0].promisedate === "01 Jan 1900 " ?
//                                                                             <span style={{ fontWeight: "700" }}></span> :
//                                                                             <span style={{ fontWeight: "700" }}>{e?.data?.rd[0]?.promisedate?.slice(0, 12)}</span>}
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className='d_flex print_2_head'>
//                                                                     <div className="text_start  pl_3">PARTY: <span style={{ fontWeight: "700" }} className="text_start">{e?.data?.rd[0]?.CustomerCode}</span><span style={{ fontWeight: "normal" }}></span></div>
//                                                                     <div style={{ paddingRight: "1.3229166667mm", textAlign: "right", fontSize: "11px" }}>{e?.data?.rd[0]?.MetalType} {" "} {e?.data?.rd[0]?.MetalColor}</div>
//                                                                 </div>
//                                                                 <div className='d_flex print_2_head'>
//                                                                     <div className="text_start  pl_3">DGN:
//                                                                         <span style={{ fontWeight: "700", fontSize: "2.5mm" }}>
//                                                                             {e?.data?.rd[0]?.Quantity === 0 ?
//                                                                                 `${e?.data?.rd[0]?.Designcode1}(${1}PCS)` :
//                                                                                 `${e?.data?.rd[0]?.Designcode1}(${e?.data?.rd[0]?.Quantity}PCS)`
//                                                                             }
//                                                                         </span>
//                                                                         <span style={{ fontWeight: "normal" }}>
//                                                                         </span>
//                                                                     </div>
//                                                                     <div className="text_start" style={{ textAlign: "right", paddingRight: "1.3229166667mm" }}>ORD NO:- <span style={{ fontWeight: "normal" }}>{e?.data?.rd[0]?.OrderNo}</span></div>
//                                                                 </div>
//                                                                 <div className='d_flex print_2_head border_bottom2'>
//                                                                     <div className="text_start pl_3">SIZE:<span style={{ fontWeight: "700" }}>{e?.data?.rd[0]?.Size}</span></div>
//                                                                     <div className="text_start">OrT: <span style={{ fontWeight: "700" }}>{e?.data?.rd[0]?.OrderTypeName}</span></div>
//                                                                     <div className="text_start" style={{ "textAlign": "center", display: "flex", alignItems: "center", justifyContent: "center" }}>{e?.data?.rd[0]?.prioritycode}</div>
//                                                                 </div>
//                                                             </div>
//                                                             <div className='thikborder' style={{ borderBottom: "0px solid" }}>
//                                                                 <div className='header_16'>
//                                                                     <div className='jobInfo16'>
//                                                                         <div className='net16A'><b>NET WT:</b></div>
//                                                                         <div className='net16A'><b>DIA PCS:</b></div>
//                                                                         <div className='net16A'><b>CLR PCS:</b></div>
//                                                                         <div className='net16A' style={{ borderBottom: "0px" }}><b>QT NO.</b></div>
//                                                                     </div>
//                                                                     <div className='jobInfo16'>
//                                                                         <div className='net16A'><b>{((e?.data?.rd[0]?.netwt ?? 0)?.toFixed(3))?.slice(0, 8)}</b></div>
//                                                                         <div className='net16A'><b>{e?.additional?.dia?.diaPcs === 0 ? 0 : e?.additional?.dia?.diaPcs}</b></div>
//                                                                         <div className='net16A'><b>{e?.additional?.clr?.clrPcs === 0 ? 0 : e?.additional?.clr?.clrPcs}</b></div>
//                                                                         <div className='net16A' style={{ borderBottom: "0px" }}><b>{e?.data?.rd[0]?.Quotation_SKUNo === '' ? 0 : (e?.data?.rd[0]?.Quotation_SKUNo)?.slice(0, 7)}</b></div>
//                                                                     </div>
//                                                                     <div className='jobInfo16'>
//                                                                         <div className='net16A' style={{ width: "67px" }}><b>GR WT:</b></div>
//                                                                         <div className='net16A' style={{ width: "67px" }}><b>DIA WT:</b></div>
//                                                                         <div className='net16A' style={{ width: "67px" }}><b>CLR WT:</b></div>
//                                                                         <div className='net16A' style={{ width: "67px", borderBottom: "0px" }}><b>CREATED BY:</b></div>
//                                                                     </div>
//                                                                     <div className='jobInfo16' style={{ borderRight: "0px", borderLeft: "0px solid" }}>
//                                                                         <div className='net16A'><b>{(e?.data?.rd[0]?.ActualGrossweight ?? 0)?.toFixed(3)}</b></div>
//                                                                         <div className='net16A'><b>{(e?.additional?.dia?.diaWt === 0 ? 0 : e?.additional?.dia?.diaWt)?.toFixed(3)}</b></div>
//                                                                         <div className='net16A'><b>{(e?.additional?.clr?.clrWt === 0 ? 0 : e?.additional?.clr?.clrWt)?.toFixed(3)}</b></div>
//                                                                         <div className='net16A' style={{ borderBottom: "0px" }}><b>{e?.data?.rd[0]?.createby === '' ? '' : e?.data?.rd[0]?.createby}</b></div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         <div style={{ borderBottom: "0px solid" }} className="text_start position_relative thikborder" >
//                                                             <div>
//                                                                 <img src={e.additional.img !== "" ? e.additional.img : require("../assets/images/default.jpg")} alt="" className="img16" onError={e => handleImageError(e)} loading="eager" onLoad={eve => handleImageLoad(eve, i, data?.length)} id='img16' />
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <div className='border_bottom_0 border_right thikborder'>
//                                                         <div className='d_flex'>
//                                                             <div className="border_right border_bottom display" style={{ height: "3.7041666667mm", fontWeight: "900", paddingLeft: "0.79375mm", width: "17.853583333mm" }}>RM TYPE</div>
//                                                             <div className="border_right border_bottom display" style={{ height: "3.7041666667mm", fontSize: "11px", paddingLeft: "2px", fontWeight: "900", width: "46px" }}>QUALITY</div>
//                                                             <div className="border_right border_bottom display" style={{ height: "3.7041666667mm", fontWeight: "900", paddingLeft: "0.79375mm", width: "11.0015mm" }}>COLOR</div>
//                                                             <div className="border_right border_bottom display" style={{ height: "3.7041666667mm", fontWeight: "900", paddingLeft: "0.79375mm", width: "15.880666667mm" }}>SIZE</div>
//                                                             <div className="border_right border_bottom display" style={{ height: "3.7041666667mm", fontWeight: "900", textAlign: "center", paddingLeft: "0.79375mm", width: "16.345958333mm" }}>ACTUAL</div>
//                                                             <div className="border_right2 border_bottom display" style={{ height: "3.7041666667mm", fontWeight: "900", paddingTop: "2px", paddingLeft: "0.79375mm", width: "11.5mm" }}>WT</div>
//                                                             <div className=" border_bottom position_relative barcode_design_2" rowSpan={16} style={{ padding: "0" }}>
//                                                                 {e?.data?.rd1[0]?.SerialJobno !== undefined && <BarcodeGenerator data={e?.data?.rd1[0]?.SerialJobno} />}
//                                                             </div>
//                                                         </div>

//                                                         {chunk?.data?.map((e, i) => {
//                                                             return <div className='d_flex' key={i}>
//                                                                 <div className={`border_right border_bottom display ${(e?.Shapename)?.length > 15 ? "line_height_fontSmall" : ""}`}
//                                                                     style={{
//                                                                         width: "17.853583333mm",
//                                                                         fontWeight: e?.totalFontWeight === "900" ? "900" : "bold",
//                                                                         boxSizing: "border-box",
//                                                                         fontSize: '9px', height: "3.7041666667mm", paddingRight: "1.3229166667mm", paddingLeft: "0.79375mm", paddingTop: '0rem', lineHeight: "7px"
//                                                                     }}>{e?.Shapename === 'Total' ? <b>{e?.Shapename}</b> : e?.Shapename?.slice(0, 15)}</div>

//                                                                 <div className={`border_right border_bottom display ${(e?.Quality)?.length > 10 ? "line_height_fontSmall" : ""}`}
//                                                                     style={{
//                                                                         width: "45.0015px", fontWeight: "bold", justifyContent: "center",
//                                                                         fontSize: '9px', height: "3.7041666667mm", textAlign: "end", lineClamp: "1", boxOrient: 'vertical',
//                                                                         overflow: "hidden", lineHeight: "7px"
//                                                                     }}>{e?.Quality?.slice(0, 10)}</div>

//                                                                 <div className={`border_right border_bottom display ${(e?.MetalColor)?.length > 10 ? "line_height_fontSmall" : ""}`}
//                                                                     style={{
//                                                                         width: "11.0015mm", fontWeight: "bold", fontSize: '9px', height: "3.7041666667mm", textAlign: "end",
//                                                                         lineHeight: "7px", justifyContent: "center",
//                                                                     }}>{e?.MetalColor?.slice(0, 10)}</div>

//                                                                 <div className={`border_right border_bottom display ${(e?.Sizename)?.length > 15 ? "line_height_fontSmall" : ""}`}
//                                                                     style={{
//                                                                         width: "15.880666667mm", fontWeight: "bold", fontSize: "9px",
//                                                                         height: "3.7041666667mm", textAlign: "center", "lineHeight": '7px', justifyContent: "center",
//                                                                         display: "flex", alignItems: "center"
//                                                                     }}>{e?.Sizename?.slice(0, 15)}</div>

//                                                                 <div className={`border_right border_bottom display ${(e?.ActualPcs)?.length > 7 ? "line_height_fontSmall" : ""}`}
//                                                                     style={{
//                                                                         width: "7.3792291667mm",
//                                                                         fontWeight: e.totalFontWeight === "900" ? "900" : "bold",
//                                                                         fontSize: '9px', height: "3.7041666667mm", textAlign: "end", paddingRight: "0.2645833333mm", paddingLeft: "1.3229166667mm", lineHeight: "7px"
//                                                                     }}>{e?.Shapename === 'Total' ? <b style={{ fontSize: e?.Shapename === 'Total' ? "10px" : 'inherit' }}>{+(e?.ActualPcs)}</b> : +(e?.ActualPcs)}</div>

//                                                                 <div className={`border_right border_bottom display ${(e?.ActualWeight)?.length > 7 ? "line_height_fontSmall" : ""}`}
//                                                                     style={{
//                                                                         width: "8.9667291667mm",
//                                                                         fontWeight: e.totalFontWeight === "900" ? "900" : "bold",
//                                                                         fontSize: '9px', height: "3.7041666667mm", textAlign: "end", paddingRight: "1.3229166667mm", paddingLeft: "1.3229166667mm", lineHeight: "7px"
//                                                                     }}>{e?.Shapename === 'Total' ? <b style={{ fontSize: e?.Shapename === 'Total' ? "9.5px" : 'inherit' }}>{(e?.ActualWeight).toFixed(3)}</b> : (e?.ActualWeight).toFixed(3)}</div>

//                                                                 <div className={`border_right2 border_bottom display ${(e?.Sizename)?.length > 12 ? "line_height_fontSmall" : ""}`}
//                                                                     style={{
//                                                                         width: "11.7952mm", fontWeight: "bold", fontSize: '10px', height: "3.7041666667mm", textAlign: "end",
//                                                                         paddingRight: "1.3229166667mm", paddingLeft: "1.3229166667mm", lineHeight: "7px"
//                                                                     }}></div>
//                                                             </div>;
//                                                         })}
//                                                         {
//                                                             Array.from({ length: chunk?.length }, (_, index) => (
//                                                                 <div className='d_flex ' key={index}>
//                                                                     <div className="border_right border_bottom display" style={{ width: "17.853583333mm", fontSize: '10px', height: "3.7041666667mm" }}></div>
//                                                                     <div className="border_right border_bottom display" style={{ width: "45.0015px", fontSize: '10px', height: "3.7041666667mm", display: "-webkit-box", lineClamp: "1", boxOrient: 'vertical', overflow: "hidden" }}></div>
//                                                                     <div className="border_right border_bottom display" style={{ width: "11.0015mm", fontSize: '10px', height: "3.7041666667mm" }}></div>
//                                                                     <div className="border_right border_bottom display" style={{ width: "15.880666667mm", fontSize: '10px', height: "3.7041666667mm" }}></div>
//                                                                     <div className="border_right border_bottom display" style={{ width: "7.3792291667mm", fontSize: "1.8520833333mm", height: "3.7041666667mm" }}></div>
//                                                                     <div className="border_right border_bottom display" style={{ width: "8.9667291667mm", fontSize: "1.8520833333mm", height: "3.7041666667mm" }}></div>
//                                                                     <div className="border_right2 border_bottom display" style={{ width: "11.7952mm", fontSize: "1.8520833333mm", height: "3.7041666667mm" }}></div>
//                                                                 </div>
//                                                             ))
//                                                         }

//                                                     </div>
//                                                     <div className="bag_footer_border_remove border_right ">
//                                                         <div className='thikborder'>


//                                                             <div className="bag_footer d_flex ">
//                                                                 <div className="border_top2 border_right border_bottom bag_td " style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px", fontWeight: "900" }}></div>
//                                                                 <div className="border_top2 border_right border_bottom bag_td " style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px", fontWeight: "900" }}>GRAND</div>
//                                                                 <div className="border_top2 border_right border_bottom bag_td " style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px", fontWeight: "900" }}>FILLING</div>
//                                                                 <div className="border_top2 border_right border_bottom bag_td " style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px", fontWeight: "900" }}>EPD</div>
//                                                                 <div className="border_top2 border_right border_bottom bag_td " style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px", fontWeight: "900" }}>P.P.</div>
//                                                                 <div className="border_top2 border_right border_bottom bag_td " style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px", fontWeight: "900" }}>SET.</div>
//                                                                 <div className="border_top2 border_right border_bottom bag_td " style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px", fontWeight: "900" }}>F.P.</div>
//                                                                 <div className="border_top2 border_bottom bag_td " style={{ paddingLeft: "0.79375mm", fontSize: "10px", height: "3.7041666667mm", fontWeight: "900" }}>RHD-QC</div>
//                                                             </div>
//                                                             {printData[2]?.map((e, i) => {
//                                                                 if (e["0"] !== 'DGN INS:' && e["0"] !== 'PRD INS:' && e["0"] !== 'CUST INS:') {
//                                                                     return <div className="bag_footer d_flex last_line" key={i}>
//                                                                         <div className="border_right border_bottom bag_td" style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px" }}>{e["0"] === "0" ? "" : e["0"]}</div>
//                                                                         <div className="border_right border_bottom bag_td" style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px" }}>{e["GRAND"] === "0" ? "" : e["GRAND"]}</div>
//                                                                         <div className="border_right border_bottom bag_td" style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px" }}>{e["FILLING"] === "0" ? "" : e["FILLING"]}</div>
//                                                                         <div className="border_right border_bottom bag_td" style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px" }}>{e["EPD"] === "0" ? "" : e["EPD"]}</div>
//                                                                         <div className="border_right border_bottom bag_td" style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px" }}>{e["P.P"] === "0" ? "" : e["P.P"]}</div>
//                                                                         <div className="border_right border_bottom bag_td" style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px" }}>{e["SET"] === "0" ? "" : e["SET"]}</div>
//                                                                         <div className="border_right border_bottom bag_td" style={{ paddingLeft: "0.79375mm", height: "3.7041666667mm", fontSize: "10px" }}>{e["F.P"] === "0" ? "" : e["F.P"]}</div>
//                                                                         <div className="border_bottom bag_td" style={{ fontSize: "10px", paddingLeft: "0.79375mm", height: "3.7041666667mm", borderRight: "0px solid" }}>{e["RHD-QC"] === "0" ? "" : e["RHD-QC"]}</div>
//                                                                     </div>;
//                                                                 }
//                                                             })}
//                                                         </div>
//                                                         <div className='thikborder'>


//                                                             <div className="bag_footer d_flex last_line">
//                                                                 <div className="border_right2 border_bottom border_top bag_td line_clamp_2" style={{ paddingLeft: "0.79375mm", height: "7mm", width: "94mm", fontSize: "1.8520833333", minWidth: "100%", color: "red", borderRight: "0px solid", lineHeight: "9.5px" }}>
//                                                                     DGN INS: {(e?.data?.rd[0]?.officeuse)?.length > 0 ? e?.data?.rd[0]?.officeuse : ''}
//                                                                 </div>
//                                                             </div>
//                                                             <div className="bag_footer d_flex last_line">
//                                                                 <div className="border_right2 border_bottom border_top bag_td line_clamp_2" style={{ paddingLeft: "0.79375mm", height: "7mm", width: "94mm", fontSize: "1.8520833333", minWidth: "100%", color: "red", borderRight: "0px solid", lineHeight: "9.5px" }}>
//                                                                     PRD INS: {(e?.data?.rd[0]?.ProductInstruction)?.length > 0 ? e?.data?.rd[0]?.ProductInstruction : ''}
//                                                                 </div>
//                                                             </div>
//                                                             <div className="bag_footer d_flex last_line">
//                                                                 <div className="border_right2 border_bottom border_top bag_td line_clamp_2" style={{ paddingLeft: "0.79375mm", height: "6mm", width: "94mm", fontSize: "1.8520833333", minWidth: "100%", color: "red", borderRight: "0px solid", borderBottom: "3px solid black", lineHeight: "9.5px" }}>CUST INS: {e?.data?.rd[0]?.custInstruction ?? ''}</div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div></>;
//                                 });
//                             }
//                         })}

//                     </div>
//                 </>}
//         </div>
//     );
// };

// export default PrintDesign16;