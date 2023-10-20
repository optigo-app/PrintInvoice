// import { useLocation } from "react-router-dom";
// import queryString from 'query-string';
// import { useEffect, useState } from "react";
// import axios from "axios";
// import Loader from "./Loader";
// import "../assets/css/print15.css";
// import BarcodeGenerator from "./BarcodeGenerator";
// const BagPrint15A = ({ queries, headers }) => {
//     const [data, setData] = useState([]);
//     const location = useLocation();
//     const queryParams = queryString.parse(location.search);
//     let jobs = queryParams.str_srjobno;
//     if (Object.keys(queryParams).length !== 0) {
//         jobs = jobs.split(",");
//     }
//     const [print] = useState(jobs);
//     const chunkSize17 = 12;

//     useEffect(() => {
//         if (Object.keys(queryParams).length !== 0) {
//             atob(queryParams.imagepath);
//         }
//         const fetchData = async () => {
//             try {
//                 const responseData = [];
//                 for (let url in print) {
//                     let chunkData = [];
//                     let p_tag = { "SerialJobno": `${print[url]}`, "customerid": `${queries.custid}`, "BagPrintName": `${queries.printname}` };
//                     let jsonString = JSON.stringify(p_tag);
//                     let base64String = btoa(jsonString);
//                     let Body = {
//                         // eslint-disable-next-line no-useless-escape
//                         "con": `{\"id\":\"\",\"mode\":\"${queries.printname}\",\"appuserid\":\"${queries.appuserid}\"}`,
//                         "p": `${base64String}`,
//                         "f": `${queries.appuserid} ${queries.printname}`
//                     };
//                     let urls = atob(queries.url);
//                     const response = await axios.post(urls, Body, { headers: headers });
//                     let datas = JSON.parse(response.data.d);
//                     let length = 0;
//                     let clr = {
//                         Shapename: "TOTAL",
//                         Sizename: "",
//                         ActualPcs: 0,
//                         ActualWeight: 0,
//                         MasterManagement_DiamondStoneTypeid: 4
//                         // heading: "COLOR STONE DETAIL"
//                     };
//                     let dia = {
//                         Shapename: "TOTAL",
//                         Sizename: "",
//                         ActualPcs: 0,
//                         ActualWeight: 0,
//                         MasterManagement_DiamondStoneTypeid: 3
//                         // heading: "DIAMOND DETAIL"
//                     };
//                     let misc = {
//                         Shapename: "TOTAL",
//                         Sizename: "",
//                         ActualPcs: 0,
//                         ActualWeight: 0,
//                         // heading: "MISC DETAIL"
//                     };
//                     let f = {
//                         Shapename: "TOTAL",
//                         Sizename: "",
//                         ActualPcs: 0,
//                         ActualWeight: 0,
//                         // heading: "FINDING DETAIL"
//                     };
//                     let ArrofSevenSize = [];
//                     //arr for colorstone
//                     let ArrofFiveSize = [];
//                     let ArrofMISize = [];
//                     let ArrofFSize = [];

//                     // eslint-disable-next-line array-callback-return
//                     datas.rd1.map((e, i) => {
//                         if (e.ConcatedFullShapeQualityColorCode !== "- - - ") {
//                             length++;
//                         }
//                         if (e.MasterManagement_DiamondStoneTypeid === 3) {
//                             ArrofSevenSize.push(e);
//                             dia.ActualPcs = dia.ActualPcs + e.ActualPcs;
//                             dia.ActualWeight = dia.ActualWeight + e.ActualWeight;
//                         } else if (e.MasterManagement_DiamondStoneTypeid === 4) {
//                             ArrofFiveSize.push(e);
//                             clr.ActualPcs = clr.ActualPcs + e.ActualPcs;
//                             clr.ActualWeight = clr.ActualWeight + e.ActualWeight;
//                         } else if (e.MasterManagement_DiamondStoneTypeid === 5) {
//                             ArrofFSize.push(e);
//                             f.ActualPcs = f.ActualPcs + e.ActualPcs;
//                             f.ActualWeight = f.ActualWeight + e.ActualWeight;
//                         } else if (e.MasterManagement_DiamondStoneTypeid === 7) {
//                             ArrofMISize.push(e);
//                             misc.ActualPcs = misc.ActualPcs + e.ActualPcs;
//                             misc.ActualWeight = misc.ActualWeight + e.ActualWeight;
//                         }
//                     });
//                     dia.ActualPcs = +(dia.ActualPcs.toFixed(3));
//                     dia.ActualWeight = +(dia.ActualWeight.toFixed(3));
//                     clr.ActualPcs = +(clr.ActualPcs.toFixed(3));
//                     clr.ActualWeight = +(clr.ActualWeight.toFixed(3));
//                     misc.ActualPcs = +(misc.ActualPcs.toFixed(3));
//                     misc.ActualWeight = +(misc.ActualWeight.toFixed(3));
//                     f.ActualPcs = +(f.ActualPcs.toFixed(3));
//                     f.ActualWeight = +(f.ActualWeight.toFixed(3));

//                     ArrofSevenSize.push(dia);
//                     ArrofFiveSize.push(clr);
//                     ArrofFSize.push(f);
//                     ArrofMISize.push(misc);

//                     // eslint-disable-next-line array-callback-return
//                     ArrofSevenSize.map((e) => {
//                         if (e.ActualPcs === 0 && e.ActualWeight === 0) {
//                             ArrofSevenSize = [];
//                         }

//                     }
//                     );
//                     // eslint-disable-next-line array-callback-return
//                     ArrofFiveSize.map((e) => {
//                         if (e.ActualPcs === 0 && e.ActualWeight === 0) {
//                             ArrofFiveSize = [];
//                         }

//                     }
//                     );
//                     // eslint-disable-next-line array-callback-return
//                     ArrofMISize.map((e) => {
//                         if (e.ActualPcs === 0 && e.ActualWeight === 0) {
//                             ArrofMISize = [];
//                         }

//                     }
//                     );
//                     // eslint-disable-next-line array-callback-return
//                     ArrofFSize.map((e) => {
//                         if (e.ActualPcs === 0 && e.ActualWeight === 0) {
//                             ArrofFSize = [];
//                         }

//                     }
//                     );
//                     let arr = [];
//                     let mainArr = arr.concat(ArrofSevenSize, ArrofFiveSize);
//                     let imagePath = queryParams.imagepath;
//                     imagePath = atob(queryParams.imagepath);


//                     let img = imagePath + datas.rd.ThumbImagePath;

//                     let arrs = [];
//                     mainArr.forEach((ee, ii) => {
//                         if (ee.Shapename === "TOTAL") {
//                             arrs.push(ii);
//                         }
//                     });
//                     for (let i = 0; i < ArrofSevenSize.length; i += chunkSize) {
//                         const dia = ArrofSevenSize.slice(i, i + chunkSize);
//                         let len = 7 - (ArrofSevenSize.slice(i, i + chunkSize)).length;
//                         diamond.push({ dia: dia, length: len });
//                     }
//                     for (let i = 0; i < ArrofFiveSize.length; i += sizeofChunk) {
//                         const clr = ArrofFiveSize.slice(i, i + sizeofChunk);
//                         let len = 5 - (ArrofFiveSize.slice(i, i + sizeofChunk)).length;
//                         colorstone.push({ clr: clr, length: len });
//                     }
//                     // arrs.forEach((ee, ii) => {
//                     //     if (!mainArr[ee + 1]?.heading) {
//                     //         let ele = mainArr[ee + 1];
//                     //         if (ele?.MasterManagement_DiamondStoneTypeid === 3 && mainArr[ee].Shapename === "TOTAL") {
//                     //             mainArr.splice(ee + 1, 0, { heading: "Diamond Sieve Size", MasterManagement_DiamondStoneTypeid: 3 });
//                     //         }
//                     //         if (ele?.MasterManagement_DiamondStoneTypeid === 4 && mainArr[ee].Shapename === "TOTAL") {
//                     //             mainArr.splice(ee + 1, 0, { heading: "Colorstone Sieve Size", MasterManagement_DiamondStoneTypeid: 4 });
//                     //         }
//                     //     }
//                     // });
//                     // for (let i = 0; i < mainArr.length; i += chunkSize17) {
//                     //     const chunks = mainArr.slice(i, i + chunkSize17);
//                     //     if (chunks[0].MasterManagement_DiamondStoneTypeid === 3) {
//                     //         chunks.unshift({ heading: "Diamond Sieve Size", MasterManagement_DiamondStoneTypeid: 3 });
//                     //     } else if (chunks[0].MasterManagement_DiamondStoneTypeid === 4) {
//                     //         chunks.unshift({ heading: "Colorstone Sieve Size", MasterManagement_DiamondStoneTypeid: 4 });
//                     //     }
//                     //     let len = 13 - (mainArr.slice(i, i + chunkSize17)).length;
//                     //     chunkData.push({ data: chunks, length: len });
//                     // }
//                     responseData.push({ data: datas, additional: { length: length, clr: clr, dia: dia, f: f, img: img, misc: misc, pages: chunkData } });

//                 }
//                 setData(responseData);
//             } catch (error) {
//                 console.log(error);
//             }
//         };
//         fetchData();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     function handlePrint(e) {
//         e.preventDefault();
//         window.print();
//     }

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
//     console.log(data);
//     return (
//         <>
//             {
//                 data.length === 0 ? <Loader /> : <><div className="print_btn"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
//                     Print
//                 </button></div>


//                     {Array.from({ length: queries.pageStart }, (_, index) => (
//                         index > 0 && <div key={index} className="container  ml_5 mb_10"></div>
//                     ))}
//                     {data?.length > 0 && data.map((e, i) => {
//                         return (<>
//                             <div key={i}>
//                                 {
//                                     e?.additional?.pages?.length > 0 ? e?.additional?.pages.map((ele) => {

//                                         return (
//                                             <>
//                                                 <div className="container15A" id="main_container " style={{ border: "2px solid black" }}>
//                                                     <div>
//                                                         <div className="head15A">
//                                                             <div className="center15A"><b style={{ fontSize: "20px" }}>{e?.data?.rd?.CustomerCode} / {e?.data?.rd[0]?.serialjobno}</b></div>
//                                                             <div className="barcode15A">{(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd[0]?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd[0]?.serialjobno} />}</>}</div>
//                                                         </div>
//                                                         <div className="heading15A">
//                                                             <div className="head15Adns">
//                                                                 <div className="dtype15A">DNS Type</div>
//                                                                 <div className="dtype15A">{e?.data?.rd[0]?.category}</div>
//                                                                 <div className="dtype15A">Item count</div>
//                                                                 <div className="dtype15A" style={{ borderRight: "0px solid" }}>{e?.data?.rd[0]?.Quantity}</div>
//                                                             </div>
//                                                         </div>
//                                                         <div className="head15Adns">
//                                                             <div className="dtype15A">DNS Name</div>
//                                                             <div className="dtype15A">{e?.data?.rd[0]?.Designcode}</div>
//                                                             <div className="dtype15A">Priority</div>
//                                                             <div className="dtype15A" style={{ borderRight: "0px solid" }}>{e?.data?.rd[0]?.prioritycode}</div>
//                                                         </div>
//                                                         <div className="head15Adns">
//                                                             <div className="dtype15A">DNS Size</div>
//                                                             <div className="dtype15A">{e?.data?.rd[0]?.Size}</div>

//                                                         </div>
//                                                     </div>
//                                                     <div className="main15A">
//                                                         <div className="mid15A">
//                                                             <div className="mid15ADNS">
//                                                                 <div className="dtype15AB">Raw Metal</div>
//                                                                 <div className="dtype15AB">{e?.data?.rd[0]?.MetalType} {e?.data?.rd[0]?.MetalColorCo}</div>
//                                                             </div>
//                                                             <div className="mid15ADNS">
//                                                                 <div className="dtype15AB">Metal wt</div>
//                                                                 <div className="dtype15AB">{e?.data?.rd[0]?.MetalWeight.toFixed(3)}</div>
//                                                             </div>
//                                                             <div className="mid15ADNS">
//                                                                 <div className="dtype15AB">Dia Clarity</div>
//                                                                 <div className="dtype15AB"></div>

//                                                             </div>
//                                                             <div className="mid15ADNS">
//                                                                 <div className="dtype15AB">Dia no/wt</div>
//                                                                 <div className="dtype15AB">{e?.additional?.dia?.ActualPcs}/{e?.additional?.dia?.ActualWeight.toFixed(3)}</div>
//                                                             </div>
//                                                             <div className="mid15ADNS">
//                                                                 <div className="dtype15AB">CLS no/wt</div>
//                                                                 <div className="dtype15AB">{e?.additional?.clr?.ActualPcs}/{e?.additional?.clr?.ActualWeight.toFixed(3)}</div>
//                                                             </div>
//                                                             <div className="mid15ADNS">
//                                                                 <div className="dtype15AB">Order Date</div>
//                                                                 <div className="dtype15AB">{e?.data?.rd[0]?.OrderDate}</div>
//                                                             </div>
//                                                             <div className="mid15ADNS">
//                                                                 <div className="dtype15AB">Due Date</div>
//                                                                 <div className="dtype15AB">{e?.data?.rd[0]?.promisedate}</div>
//                                                             </div>
//                                                             <div className="img15ABox">
//                                                                 <div><img src={e.additional.img !== "" ? e.additional.img : require("../assets/images/default.jpg")} id="img15" alt="" onError={e => handleImageError(e)} loading="lazy" /></div>

//                                                             </div>
//                                                         </div>
//                                                         <div className="mid15A">
//                                                             <div>

//                                                                 <div>
//                                                                     {
//                                                                         //logic of put data in chunks for diamond 
//                                                                         a?.diachunk?.dia.map((s, i) => {
//                                                                             return (
//                                                                                 <div style={{ display: "flex" }} key={i}>
//                                                                                     <div className="subFirstCell">{s?.Sizename ?? ''}</div>
//                                                                                     <div className="subSecondCell">{s?.ActualPcs ?? ''}</div>
//                                                                                     <div className="subThirdCell">{s?.ActualWeight ?? ''}</div>
//                                                                                 </div>
//                                                                             );
//                                                                         })
//                                                                     }
//                                                                     {a?.diachunk?.dia === undefined && <>
//                                                                         {Array.from({ length: (7) }, (i) => {
//                                                                             return (
//                                                                                 <div style={{ display: "flex" }} key={i}>
//                                                                                     <div className="subFirstCell"></div>
//                                                                                     <div className="subSecondCell"></div>
//                                                                                     <div className="subThirdCell"></div>
//                                                                                 </div>
//                                                                             );
//                                                                         })}
//                                                                     </>}
//                                                                 </div>
//                                                                 <div>
//                                                                     {
//                                                                         // logic of empty chunks
//                                                                         Array.from({ length: (a?.diachunk?.length) }, (i) => {
//                                                                             return (
//                                                                                 <div style={{ display: "flex" }} key={i}>
//                                                                                     <div className="subFirstCell"></div>
//                                                                                     <div className="subSecondCell"></div>
//                                                                                     <div className="subThirdCell"></div>
//                                                                                 </div>
//                                                                             );
//                                                                         })
//                                                                     }
//                                                                 </div>
//                                                             </div>
//                                                             <div>
//                                                                 {/* {

//                                                                     ele?.data.map((s, i) => {
//                                                                         return (
//                                                                             <>
//                                                                                 {

//                                                                                     (s?.heading)
//                                                                                         ?
//                                                                                         <div className='mid15ADNS'>
//                                                                                             <div className="dtype15AC" style={{ width: "180px" }}><b>{s.heading}</b></div>
//                                                                                         </div> : <>
//                                                                                             {
//                                                                                                 s.Shapename === "TOTAL" ?
//                                                                                                     <div className="mid15ADNS" key={i}>
//                                                                                                         <div className="dtype15AC" style={{ width: "65px" }}><b>TOTAL</b></div>
//                                                                                                         <div className="dtype15AC" style={{ width: "52px" }}><b>{s.ActualPcs}</b></div>
//                                                                                                         <div className="dtype15AC" style={{ width: "52px" }}><b>{s.ActualWeight.toFixed(3)}</b></div>
//                                                                                                     </div>
//                                                                                                     : <>
//                                                                                                         {
//                                                                                                             (s.Shapename === "Diamond Sieve Size" || s.Shapename === "Colorstone Sieve Size") ?
//                                                                                                                 <div className="mid15ADNS" key={i}>
//                                                                                                                     <div className="dtype15AC" style={{ width: "180px" }}><b>{s.Shapename}</b></div>
//                                                                                                                 </div> :
//                                                                                                                 <div className="mid15ADNS" key={i}>
//                                                                                                                     <div className="dtype15AC" style={{ width: "65px" }}>{s.Sizename}</div>
//                                                                                                                     <div className="dtype15AC" style={{ width: "52px" }}>{s.ActualPcs}</div>
//                                                                                                                     <div className="dtype15AC" style={{ width: "52px" }}>{s.ActualWeight?.toFixed(3)}</div>
//                                                                                                                 </div>
//                                                                                                         }
//                                                                                                     </>
//                                                                                             }
//                                                                                         </>


//                                                                                 }
//                                                                             </>
//                                                                         );
//                                                                     })
//                                                                 } */}
//                                                                 {/* {
//                                                                     // logic of empty chunks
//                                                                     Array.from({ length: (ele?.length) }, (i) => {
//                                                                         return (
//                                                                             <div className="mid15ADNS" key={i}>
//                                                                                 <div className="dtype15AC" style={{ width: "65px" }}></div>
//                                                                                 <div className="dtype15AC" style={{ width: "52px" }}></div>
//                                                                                 <div className="dtype15AC" style={{ width: "52px" }}></div>
//                                                                             </div>
//                                                                         );
//                                                                     })
//                                                                 } */}
//                                                             </div>
//                                                             <div>
//                                                                 <div className="sub-aside"> <b>Total : {totalPcsofDiamond} pcs</b></div>
//                                                                 <div className="sub-aside"> <b>Type : Colorstone sieve size</b></div>
//                                                                 <div>
//                                                                     <div>
//                                                                         {
//                                                                             //logic of put data in chunks for colorstone
//                                                                             a?.clrchunk?.clr.map((s, i) => {
//                                                                                 return (
//                                                                                     <div style={{ display: "flex" }} key={i}>

//                                                                                         <div className="subFirstCell">{s?.Sizename}</div>
//                                                                                         <div className="subSecondCell">{s?.ActualPcs}</div>
//                                                                                         <div className="subThirdCell">{s?.ActualWeight}</div>
//                                                                                     </div>
//                                                                                 );
//                                                                             })
//                                                                         }
//                                                                         {a?.diachunk?.dia === undefined && <>
//                                                                             {Array.from({ length: (5) }, (i) => {
//                                                                                 return (
//                                                                                     <div style={{ display: "flex" }} key={i}>
//                                                                                         <div className="subFirstCell"></div>
//                                                                                         <div className="subSecondCell"></div>
//                                                                                         <div className="subThirdCell"></div>
//                                                                                     </div>
//                                                                                 );
//                                                                             })}
//                                                                         </>}
//                                                                     </div>
//                                                                     <div>
//                                                                         {
//                                                                             // logic of empty chunks
//                                                                             Array.from({ length: (a?.clrchunk?.length) }, (i) => {
//                                                                                 return (
//                                                                                     <div style={{ display: "flex" }} key={i}>
//                                                                                         <div className="subFirstCell"></div>
//                                                                                         <div className="subSecondCell"></div>
//                                                                                         <div className="subThirdCell"></div>
//                                                                                     </div>
//                                                                                 );
//                                                                             })
//                                                                         }
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="sub-aside">
//                                                                     {e.data.rd1.map((a) => {
//                                                                         if (a.MasterManagement_DiamondStoneTypeid == "4") {
//                                                                             console.log("4", totalPcsofColorstone, a.ActualPcs, a.SerialJobno);
//                                                                             totalPcsofColorstone = totalPcsofColorstone + a.ActualPcs;
//                                                                         }
//                                                                     })}
//                                                                     <div > <b>Total : {totalPcsofColorstone} pcs</b></div>
//                                                                 </div>
//                                                                 <div className="sub-aside" style={{ "borderBottom": "none" }}>
//                                                                     <div> Ins. <b style={{ "fontSize": "8px" }}> {e.data.rd[0].officeuse ?? ''}</b></div>
//                                                                     <div> <b style={{ "fontSize": "8px" }}> {e.data.rd[0].custInstruction ?? ''}</b></div>
//                                                                     <div> Ins. <b style={{ "fontSize": "8px" }}>{e.data.rd[0].ProductInstruction}</b></div>
//                                                                     <div> <b style={{ "fontSize": "8px" }}>{e.data.rd[0].QuoteRemark}</b></div>
//                                                                 </div>
//                                                             </div>
//                                                             {/* <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", height: "50px", width: "170px" }}>
//                                                                 Ins. <b></b>
//                                                             </div> */}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </>
//                                         );
//                                     }) : <>
//                                         <div className="container15A" id="main_container " style={{ border: "2px solid black" }}>
//                                             <div>
//                                                 <div className="head15A">
//                                                     <div className="center15A"><b style={{ fontSize: "20px" }}>{e?.data?.rd[0]?.CustomerCode} / {e?.data?.rd[0]?.serialjobno}</b></div>
//                                                     <div className="barcode15A">{(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd[0]?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd[0]?.serialjobno} />}</>}</div>
//                                                 </div>
//                                                 <div className="heading15A">
//                                                     <div className="head15Adns">
//                                                         <div className="dtype15A">DNS Type</div>
//                                                         <div className="dtype15A">{e?.data?.rd[0]?.category}</div>
//                                                         <div className="dtype15A">Item count</div>
//                                                         <div className="dtype15A" style={{ borderRight: "0px solid" }}>{e?.data?.rd[0]?.Quantity}</div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="head15Adns">
//                                                     <div className="dtype15A">DNS Name</div>
//                                                     <div className="dtype15A">{e?.data?.rd[0]?.Designcode}</div>
//                                                     <div className="dtype15A">Priority</div>
//                                                     <div className="dtype15A" style={{ borderRight: "0px solid" }}>{e?.data?.rd[0]?.prioritycode}</div>
//                                                 </div>
//                                                 <div className="head15Adns">
//                                                     <div className="dtype15A">DNS Size</div>
//                                                     <div className="dtype15A">{e?.data?.rd[0]?.Size}</div>
//                                                 </div>
//                                             </div>
//                                             <div className="main15A">
//                                                 <div className="mid15A">
//                                                     <div className="mid15ADNS">
//                                                         <div className="dtype15AB">Raw Metal</div>
//                                                         <div className="dtype15AB">{e?.data?.rd[0]?.MetalType} {e?.data?.rd[0]?.MetalColorCo}</div>
//                                                     </div>
//                                                     <div className="mid15ADNS">
//                                                         <div className="dtype15AB">Metal wt</div>
//                                                         <div className="dtype15AB">{e?.data?.rd[0]?.MetalWeight.toFixed(3)}</div>
//                                                     </div>
//                                                     <div className="mid15ADNS">
//                                                         <div className="dtype15AB">Dia Clarity</div>
//                                                         <div className="dtype15AB"></div>

//                                                     </div>
//                                                     <div className="mid15ADNS">
//                                                         <div className="dtype15AB">Dia no/wt</div>
//                                                         <div className="dtype15AB">{e?.additional?.dia?.ActualPcs}/{e?.additional?.dia?.ActualWeight.toFixed(3)}</div>
//                                                     </div>
//                                                     <div className="mid15ADNS">
//                                                         <div className="dtype15AB">CLS no/wt</div>
//                                                         <div className="dtype15AB">{e?.additional?.clr?.ActualPcs}/{e?.additional?.clr?.ActualWeight.toFixed(3)}</div>
//                                                     </div>
//                                                     <div className="mid15ADNS">
//                                                         <div className="dtype15AB">Order Date</div>
//                                                         <div className="dtype15AB">{e?.data?.rd[0]?.OrderDate}</div>
//                                                     </div>
//                                                     <div className="mid15ADNS">
//                                                         <div className="dtype15AB">Due Date</div>
//                                                         <div className="dtype15AB">{e?.data?.rd[0]?.promisedate}</div>
//                                                     </div>
//                                                     <div className="img15ABox">
//                                                         <div><img src={e.additional.img !== "" ? e.additional.img : require("../assets/images/default.jpg")} id="img15" alt="" onError={e => handleImageError(e)} loading="lazy" /></div>

//                                                     </div>
//                                                 </div>
//                                                 <div className="mid15A">
//                                                     <div>
//                                                         {
//                                                             // logic of empty chunks
//                                                             Array.from({ length: (14) }, (i) => {
//                                                                 return (
//                                                                     <div className="mid15ADNS" key={i}>
//                                                                         <div className="dtype15AC" style={{ width: "65px" }}></div>
//                                                                         <div className="dtype15AC" style={{ width: "52px" }}></div>
//                                                                         <div className="dtype15AC" style={{ width: "52px" }}></div>
//                                                                     </div>
//                                                                 );
//                                                             })
//                                                         }
//                                                     </div>
//                                                     <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", height: "50px", width: "170px" }}>
//                                                         Ins. <b></b>
//                                                     </div>
//                                                 </div>
//                                             </div>


//                                         </div>
//                                     </>
//                                 }

//                             </div>
//                         </>);
//                     })
//                     }
//                 </>
//             }
//         </>

//     );
// };
// export default BagPrint15A;


import { useLocation } from "react-router-dom";
import queryString from 'query-string';
import React, { useEffect, useState } from "react";
import axios from "axios";
import BarcodeGenerator from '../../components/BarcodeGenerator';
import Loader from '../../components/LoaderBag';
import "../../assets/css/bagprint/print15.css";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import { organizeData } from './../../GlobalFunctions/OrganizeBagPrintData';
import { GetData } from './../../GlobalFunctions/GetData';


const BagPrint15A = ({ queries, headers }) => {
    const location = useLocation();
    const queryParams = queryString.parse(location?.search);
    //state for chunksize handle
    let jobs = queryParams?.str_srjobno;
    const parts = jobs.split(",");
  const resultString = parts.map((part) => `'${part}'`).join(",");
    if (Object.keys(queryParams)?.length !== 0) {
        jobs = jobs.split(",");
    }
    // console.log(jobs);
    const [print, setPrint] = useState(jobs);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (Object.keys(queryParams)?.length !== 0) {
            atob(queryParams?.imagepath);
        }
    }, []);

    //chunk size for diamond and colorstone chunks display
    const chunkSize = 7;
    const sizeofChunk = 5;

    //differentiated for which objects are for diamond and which are for colorstone


    // const handleImageError = (e) => {
    //     e.target.src = require('../assets/images/default.jpg');
    // };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = [];

                const objs = {
                    jobno: resultString,
                    custid: queries.custid,
                    printname: queries.printname,
                    appuserid: queries.appuserid,
                    url: queries.url,
                    headers: headers,
                  };
          
                  const allDatas = await GetData(objs);
                  let datas = organizeData(allDatas?.rd, allDatas?.rd1);

                  datas?.map((a) => {
                    let diamond = [];
                    let colorstone = [];
                    let length = 0;
                    let clr = {
                        clrPcs: 0,
                        clrWt: 0
                    };
                    let dia = {
                        diaPcs: 0,
                        diaWt: 0
                    };
                    let misc = {
                        miscWt: 0
                    };
                    let diaQuaCol = [];
                    let ArrofSevenSize = [];
                    //arr for colorstone
                    let ArrofFiveSize = [];
                    a?.rd1?.map((e, i) => {
                        if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
                            length++;
                        }
                        if (e?.MasterManagement_DiamondStoneTypeid === 3) {
                            
                            e.diaclarity = (e?.Quality + " " + e?.ColorName);
                            
                            diaQuaCol.push(e);
                            dia.diaPcs = dia?.diaPcs + e?.ActualPcs;
                            dia.diaWt = dia?.diaWt + e?.ActualWeight;

                        } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
                            clr.clrPcs = clr?.clrPcs + e?.ActualPcs;
                            clr.clrWt = clr?.clrWt + e?.ActualWeight;
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
                            misc.miscWt = misc?.miscWt + e?.ActualWeight;
                        }
                        if (e?.MasterManagement_DiamondStoneTypeid === 3) {
                            ArrofSevenSize.push(e);
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
                            ArrofFiveSize.push(e);
                        } else {
                            return '';
                        }
                    });

                    //important
                    a.rd.diaclarity = diaQuaCol[0]?.diaclarity;
                    


                    let imagePath = queryParams?.imagepath;
                    imagePath = atob(queryParams?.imagepath);
                    let img = imagePath + a?.rd?.ThumbImagePath;
                    

                    for (let i = 0; i < ArrofSevenSize?.length; i += chunkSize) {
                        const dia = ArrofSevenSize?.slice(i, i + chunkSize);
                        let len = 7 - (ArrofSevenSize?.slice(i, i + chunkSize))?.length;
                        diamond?.push({ dia: dia, length: len });
                    }
                    for (let i = 0; i < ArrofFiveSize?.length; i += sizeofChunk) {
                        const clr = ArrofFiveSize?.slice(i, i + sizeofChunk);
                        let len = 5 - (ArrofFiveSize?.slice(i, i + sizeofChunk))?.length;
                        colorstone?.push({ clr: clr, length: len });
                    }
                    //new arr for creating how many templates are use, storing objects 
                    let arr1 = [];
                    if (diamond?.length >= colorstone?.length) {
                        diamond?.map((e, i) => {
                            let obj = {};
                            obj.diachunk = e;
                            if (colorstone[i] !== undefined) {
                                obj.clrchunk = colorstone[i];
                            }
                            else {
                                obj.clrchunk = { clr: [], length: 5 };
                            }
                            arr1?.push(obj);
                        });
                    }
                    else {
                        colorstone?.map((e, i) => {
                            let obj = {};
                            obj.clrchunk = e;
                            if (diamond[i] !== undefined) {
                                obj.diachunk = diamond[i];
                            }
                            else {
                                obj.diachunk = { dia: [], length: 7 };
                            }
                            arr1?.push(obj);
                        });
                    }

                    responseData.push({ data: a, additional: { length: length, clr: clr, dia: dia, img: img, misc: misc, pages: arr1 } });
                    
                  })

                // for (const url in print) {
                //     let diamond = [];
                //     let colorstone = [];
                //     let p_tag = { "SerialJobno": `${print[url]}`, "customerid": `${queries?.custid}`, "BagPrintName": `${queries?.printname}` };
                //     let jsonString = JSON.stringify(p_tag);
                //     let base64String = btoa(jsonString);
                //     let Body = {
                //         "con": `{\"id\":\"\",\"mode\":\"${queries?.printname}\",\"appuserid\":\"${queries?.appuserid}\"}`,
                //         "p": `${base64String}`,
                //         "f": `${queries?.appuserid} ${queries?.printname}`
                //     };
                //     const urls = atob(queries?.url);
                //     const response = await axios.post(urls, Body, { headers: headers });
                //     let datas = JSON.parse(response?.data?.d);

                //     let length = 0;
                //     let clr = {
                //         clrPcs: 0,
                //         clrWt: 0
                //     };
                //     let dia = {
                //         diaPcs: 0,
                //         diaWt: 0
                //     };
                //     let misc = {
                //         miscWt: 0
                //     };
                //     let diaQuaCol = [];
                //     let ArrofSevenSize = [];
                //     //arr for colorstone
                //     let ArrofFiveSize = [];
                //     datas?.rd1?.map((e, i) => {
                //         if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
                //             length++;
                //         }
                //         if (e?.MasterManagement_DiamondStoneTypeid === 3) {
                //             e.diaclarity = (e?.Quality + " " + e.ColorName);
                //             // diaQuaCol = (e.ColorName +" "+ e?.Quality);
                //             diaQuaCol.push(e);
                //             dia.diaPcs = dia?.diaPcs + e?.ActualPcs;
                //             dia.diaWt = dia?.diaWt + e?.ActualWeight;

                //         } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
                //             clr.clrPcs = clr?.clrPcs + e?.ActualPcs;
                //             clr.clrWt = clr?.clrWt + e?.ActualWeight;
                //         } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
                //             misc.miscWt = misc?.miscWt + e?.ActualWeight;
                //         }
                //         if (e?.MasterManagement_DiamondStoneTypeid == "3") {
                //             ArrofSevenSize.push(e);
                //         } else if (e?.MasterManagement_DiamondStoneTypeid == "4") {
                //             ArrofFiveSize.push(e);
                //         } else {
                //             return '';
                //         }
                //     });
                //     // console.log(diaQuaCol[0]?.diaclarity);
                //     datas?.rd?.map((e, i) => {
                //         if (i == 0) {
                //             e.diaclarity = diaQuaCol[0]?.diaclarity;
                //         }
                //     });
                //     let imagePath = queryParams?.imagepath;
                //     imagePath = atob(queryParams?.imagepath);
                //     let img = imagePath + datas?.rd[0]?.ThumbImagePath;
                //     // let diaclarity = (diaQuaCol[0]?.ColorName + diaQuaCol[0]?.Quality);
                //     // console.log("zzzzzzz",(diaQuaCol[0]?.ColorName + diaQuaCol[0]?.Quality));


                //     for (let i = 0; i < ArrofSevenSize.length; i += chunkSize) {
                //         const dia = ArrofSevenSize.slice(i, i + chunkSize);
                //         let len = 7 - (ArrofSevenSize.slice(i, i + chunkSize)).length;
                //         diamond.push({ dia: dia, length: len });
                //     }
                //     for (let i = 0; i < ArrofFiveSize.length; i += sizeofChunk) {
                //         const clr = ArrofFiveSize.slice(i, i + sizeofChunk);
                //         let len = 5 - (ArrofFiveSize.slice(i, i + sizeofChunk)).length;
                //         colorstone.push({ clr: clr, length: len });
                //     }
                //     //new arr for creating how many templates are use, storing objects 
                //     let arr1 = [];
                //     if (diamond?.length >= colorstone?.length) {
                //         diamond.map((e, i) => {
                //             let obj = {};
                //             obj.diachunk = e;
                //             if (colorstone[i] !== undefined) {
                //                 obj.clrchunk = colorstone[i];
                //             }
                //             else {
                //                 obj.clrchunk = { clr: [], length: 5 };
                //             }
                //             arr1?.push(obj);
                //         });
                //     }
                //     else {
                //         colorstone.map((e, i) => {
                //             let obj = {};
                //             obj.clrchunk = e;
                //             if (diamond[i] !== undefined) {
                //                 obj.diachunk = diamond[i];
                //             }
                //             else {
                //                 obj.diachunk = { dia: [], length: 7 };
                //             }
                //             arr1?.push(obj);
                //         });
                //     }

                //     responseData.push({ data: datas, additional: { length: length, clr: clr, dia: dia, img: img, misc: misc, pages: arr1 } });
                // }
                setData(responseData);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (data.length !== 0) {
            setTimeout(() => {
                window.print();
            }, 5000);
        }
}, [data]);



    return (
        <>
            {
                data.length === 0 ? <Loader /> : 
                <div>
                <div className="print_btn"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
                    Print
                </button></div>
                    <div className="p15Awrap pad_60_allPrint">
                        {Array.from({ length: queries?.pageStart }, (_, index) => (
                            index > 0 && <div key={index} className="container15Aold" id="main_container" style={{ border: "0px" }}></div>
                        ))}
                        {data?.length > 0 && data?.map((e, i) => {
                            return (
                            <React.Fragment key={i}>

                                {
                                    e?.additional?.pages?.length > 0 ? e?.additional?.pages?.map((a, index) => {

                                        let totalPcsofDiamond = 0;
                                        let totalPcsofColorstone = 0;
                                        return (
                                            
                                                <div className="container15Aold" id="main_container" key={index}>
                                                    <div className="heading">
                                                        <h1 style={{ display: "flex", fontSize: "15px" }}>bag : {e?.data?.rd?.CustomerCode} / {e?.data?.rd?.serialjobno}</h1>
                                                        <div className=" barcode15">
                                                            {(e?.data?.rd1?.length !== 0 && e?.data?.rd1 !== undefined) && <>{e?.data?.rd?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd?.serialjobno} />}</>}
                                                        </div>
                                                    </div>
                                                    <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                        <div className="firstCell" > <b>DNS type</b></div>
                                                        <div className="secondCell"> {e?.data?.rd?.category}</div>
                                                        <div className="thirdCell"><b>Item count</b></div>
                                                        <div className="fourthCell"> {e?.data?.rd?.Quantity}</div>
                                                    </div>
                                                    <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                        <div className="firstCell" style={{ "borderTop": "0px" }}> <b>DNS Name</b></div>
                                                        <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.Designcode}</div>
                                                        <div className="thirdCell" style={{ "borderTop": "0px" }}> <b>Priority</b></div>
                                                        <div className="fourthCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.prioritycode}</div>
                                                    </div>
                                                    <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                        <div className="firstCell" style={{ "borderTop": "0px" }}> <b>DNS size</b></div>
                                                        <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.Size}</div>
                                                        <div className="thirdCell" style={{ "width": "199.33px", "borderTop": "0px", "borderRight": "0px" }}> <b>Type: Diamond sieve size</b></div>
                                                    </div>
                                                    <div style={{ display: "flex" }}>
                                                        <div>
                                                            <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                                <div className="firstCell" style={{ "borderTop": "0px" }} > <b>Raw Metal</b></div>
                                                                <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.MetalType} {e?.data?.rd?.MetalColorCo}</div>
                                                            </div>
                                                            <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                                <div className="firstCell" style={{ "borderTop": "0px" }}> <b>Metal wt</b></div>
                                                                <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.MetalWeight?.toFixed(3)}</div>
                                                            </div>
                                                            <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                                <div className="firstCell" style={{ "borderTop": "0px" }}> <b>Dia clarity</b></div>
                                                                <div className="secondCell" style={{ borderTop: "0px", fontSize: e?.data?.rd?.diaclarity?.length > 16 ? "10px" : "12px" }}>{(e?.data?.rd?.diaclarity ?? 'NA')?.slice(0, 32)}</div>
                                                            </div>
                                                            <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                                <div className="firstCell" style={{ "borderTop": "0px" }}> <b>Dia no / wt</b></div>
                                                                <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.additional?.dia?.diaPcs}/{e?.additional?.dia?.diaWt.toFixed(3)}</div>
                                                            </div>
                                                            <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                                <div className="firstCell" style={{ "borderTop": "0px" }} > <b>CLS no / wt</b></div>
                                                                <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.additional?.clr?.clrPcs}/{e?.additional?.clr?.clrWt.toFixed(3)}</div>
                                                            </div>
                                                            <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                                <div className="firstCell" style={{ "borderTop": "0px" }}> <b>Order date</b></div>
                                                                <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.OrderDate}</div>
                                                            </div>
                                                            <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                                <div className="firstCell" style={{ "borderTop": "0px" }}> <b>Due date</b></div>
                                                                <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.promisedate}</div>
                                                            </div>
                                                        </div>
                                                        <div>

                                                            <div>
                                                                {
                                                                    //logic of put data in chunks for diamond 
                                                                    a?.diachunk?.dia?.map((s, is) => {
                                                                        return (
                                                                            <div style={{ display: "flex" }} key={is}>
                                                                                <div className="subFirstCell">{s?.Sizename ?? ''}</div>
                                                                                <div className="subSecondCell">{s?.ActualPcs ?? ''}</div>
                                                                                <div className="subThirdCell">{s?.ActualWeight?.toFixed(3) ?? ''}</div>
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                                {a?.diachunk?.dia === undefined && 
                                                                    Array.from({ length: (7) }, (ia) => {
                                                                        return (
                                                                            <div style={{ display: "flex" }} key={ia}>
                                                                                <div className="subFirstCell"></div>
                                                                                <div className="subSecondCell"></div>
                                                                                <div className="subThirdCell"></div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                
                                                            </div>
                                                            <div>
                                                                {
                                                                    // logic of empty chunks
                                                                    Array.from({ length: (a?.diachunk?.length) }, (il) => {
                                                                        return (
                                                                            <div style={{ display: "flex" }} key={il}>
                                                                                <div className="subFirstCell"></div>
                                                                                <div className="subSecondCell"></div>
                                                                                <div className="subThirdCell"></div>
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="aside">
                                                        <div className="imgSize15"><img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} id="img15" alt="" onError={e => handleImageError(e)} loading="eager"  /></div>
                                                        {/* <div>{e?.data?.rd1?.map((a, i) => {
                                                            if (a.MasterManagement_DiamondStoneTypeid == "3") {
                                                                totalPcsofDiamond = totalPcsofDiamond + a.ActualPcs;
                                                            }
                                                        })}
                                                        </div> */}
                                                        <div>
                                                            {/* <div className="sub-aside"> <b>Total : {totalPcsofDiamond} pcs</b></div> */}
                                                            <div className="sub-aside"> <b>Total : {e?.additional?.dia?.diaPcs} pcs</b></div>
                                                            <div className="sub-aside"> <b>Type : Colorstone sieve size</b></div>
                                                            <div>
                                                                <div>
                                                                    {
                                                                        //logic of put data in chunks for colorstone
                                                                        a?.clrchunk?.clr?.map((s, i) => {

                                                                            return (
                                                                                <div style={{ display: "flex" }} key={i}>

                                                                                    <div className="subFirstCell">{s?.Sizename}</div>
                                                                                    <div className="subSecondCell">{s?.ActualPcs}</div>
                                                                                    <div className="subThirdCell">{s?.ActualWeight?.toFixed(3)}</div>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    }
                                                                    {a?.diachunk?.dia === undefined && 
                                                                        Array.from({ length: (5) }, (i) => {
                                                                            return (
                                                                                <div style={{ display: "flex" }} key={i}>
                                                                                    <div className="subFirstCell"></div>
                                                                                    <div className="subSecondCell"></div>
                                                                                    <div className="subThirdCell"></div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    
                                                                </div>
                                                                <div>
                                                                    {
                                                                        // logic of empty chunks
                                                                        Array.from({ length: (a?.clrchunk?.length) }, (i) => {
                                                                            return (
                                                                                <div style={{ display: "flex" }} key={i}>
                                                                                    <div className="subFirstCell"></div>
                                                                                    <div className="subSecondCell"></div>
                                                                                    <div className="subThirdCell"></div>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="sub-aside">
                                                                {/* {e?.data?.rd1?.map((a) => {
                                                                    if (a?.MasterManagement_DiamondStoneTypeid == "4") {
                                                                        totalPcsofColorstone = totalPcsofColorstone + a?.ActualPcs;
                                                                    }
                                                                })} */}
                                                                {/* <div > <b>Total : {totalPcsofColorstone} pcs</b></div> */}
                                                                <div > <b>Total : {e?.additional?.clr?.clrPcs} pcs</b></div>
                                                            </div>
                                                            <div className="sub-aside" style={{ "borderBottom": "none" }}>
                                                                <p style={{ fontSize: "10px", lineHeight: "9px" }}>Ins. {((e?.data?.rd?.officeuse + e?.data?.rd?.ProductInstruction) == "null" ? '' : (e?.data?.rd?.officeuse + e?.data?.rd?.ProductInstruction)?.slice(0, 89))}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            
                                        );
                                    }) : <div className="container15Aold" id="main_container">
                                        <div className="heading">
                                            <h1 style={{ display: "flex", fontSize: "15px" }}>bag : {e?.data?.rd?.CustomerCode} / {e?.data?.rd?.serialjobno}</h1>
                                            <div className=" barcode15">
                                                {(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd?.serialjobno} />}</>}
                                            </div>
                                        </div>
                                        <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                            <div className="firstCell" ><b>DNS type</b></div>
                                            <div className="secondCell"> {e?.data?.rd?.category}</div>
                                            <div className="thirdCell"><b>Item count</b></div>
                                            <div className="fourthCell"> {e?.data?.rd?.Quantity}</div>
                                        </div>
                                        <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                            <div className="firstCell" style={{ "borderTop": "0px" }}> <b>DNS Name</b></div>
                                            <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.Designcode}</div>
                                            <div className="thirdCell" style={{ "borderTop": "0px" }}> <b>Priority</b></div>
                                            <div className="fourthCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.prioritycode}</div>
                                        </div>
                                        <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                            <div className="firstCell" style={{ "borderTop": "0px" }}> <b>DNS size</b></div>
                                            <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.Size}</div>
                                            <div className="thirdCell" style={{ "width": "199.33px", "borderTop": "0px", "borderRight": "0px" }}> <b>Type: Diamond sieve size</b></div>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <div>
                                                <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                    <div className="firstCell" style={{ "borderTop": "0px" }} > <b>Raw Metal</b></div>
                                                    <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.MetalType} {e?.data?.rd?.MetalColorCo}</div>
                                                </div>
                                                <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                    <div className="firstCell" style={{ "borderTop": "0px" }}> <b>Metal wt</b></div>
                                                    <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.MetalWeight?.toFixed(3)}</div>
                                                </div>
                                                <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                    <div className="firstCell" style={{ "borderTop": "0px" }}> <b>Dia clarity</b></div>
                                                    <div className="secondCell" style={{ "borderTop": "0px" }}>{e?.data?.rd?.diaclarity ?? 'NA'}</div>
                                                </div>
                                                <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                    <div className="firstCell" style={{ "borderTop": "0px" }}> <b>Dia no / wt</b></div>
                                                    <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.additional?.dia?.diaPcs}/{e?.additional?.dia?.diaWt?.toFixed(3)}</div>
                                                </div>
                                                <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                    <div className="firstCell" style={{ "borderTop": "0px" }} > <b>CLS no / wt</b></div>
                                                    <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.additional?.clr?.clrPcs}/{e?.additional?.clr?.clrWt?.toFixed(3)}</div>
                                                </div>
                                                <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                    <div className="firstCell" style={{ "borderTop": "0px" }}> <b>Order date</b></div>
                                                    <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.OrderDate}</div>
                                                </div>
                                                <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                    <div className="firstCell" style={{ "borderTop": "0px" }}> <b>Due date</b></div>
                                                    <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.promisedate}</div>
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    {
                                                        // logic of empty chunks
                                                        Array.from({ length: (7) }, (is) => {
                                                            return (
                                                                <div style={{ display: "flex" }} key={is}>
                                                                    <div className="subFirstCell"></div>
                                                                    <div className="subSecondCell"></div>
                                                                    <div className="subThirdCell"></div>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="aside">
                                            <div className="imgSize15"><img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} id="img15" alt="" onError={e => handleImageError(e)} loading="eager"  /></div>
                                            <div>
                                                <div className="sub-aside"> <b>Total : {e?.additional?.dia?.diaPcs} Pcs</b></div>
                                                <div className="sub-aside"> <b>Type: Colorstone sieve size</b></div>
                                                <div>

                                                    <div>
                                                        {
                                                            // logic of empty chunks
                                                            Array.from({ length: (5) }, (i5) => {
                                                                return (
                                                                    <div style={{ display: "flex" }} key={i5}>
                                                                        <div className="subFirstCell"></div>
                                                                        <div className="subSecondCell"></div>
                                                                        <div className="subThirdCell"></div>
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                <div className="sub-aside">
                                                    <div> <b>Total : 0 pcs</b></div>
                                                </div>
                                                <div className="sub-aside" style={{ "borderBottom": "none", fontWeight: "bold" }}>
                                                    <div><p style={{ fontSize: "10px", lineHeight: "9px", padding: "1px" }}>Ins.
                                                        {

                                                            e?.data?.rd?.length > 0 ? <React.Fragment>
                                                                {
                                                                    (((e?.data?.rd?.officeuse !== null) && (e?.data?.rd?.officeuse !== "null") && (e?.data?.rd?.officeuse !== "") && (e?.data?.rd?.officeuse !== undefined)) &&
                                                                        ((e?.data?.rd?.ProductInstruction !== null) && (e?.data?.rd?.ProductInstruction !== "null") && (e?.data?.rd?.ProductInstruction !== "") && (e?.data?.rd?.ProductInstruction !== undefined)))
                                                                        ? ((e?.data?.rd?.officeuse) + (e?.data?.rd?.ProductInstruction))?.slice(0, 89) : ''
                                                                }
                                                            </React.Fragment> : ''
                                                        }
                                                    </p></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                        
                            </React.Fragment>
                            );
                        })
                        }
                    </div>
                </div>
            }
        </>

    );
};
export default BagPrint15A;

