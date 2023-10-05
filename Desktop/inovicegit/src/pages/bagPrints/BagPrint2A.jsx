import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "../../assets/css/bagprint/print2A.css";
import { formatDate } from '../../GlobalFunctions/DateFormat';
import { GetChunkData } from '../../GlobalFunctions/GetChunkData';
import { GetData } from '../../GlobalFunctions/GetData';
import { GetSeparateData } from '../../GlobalFunctions/GetSeparateData';
import { handleImageError } from '../../GlobalFunctions/HandleImageError';
import BarcodeGenerator from '../../components/BarcodeGenerator';
import Loader from '../../components/LoaderBag';
function BagPrint2A({ queries, headers }) {

    const [data, setData] = useState([]);
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    let jobs = queryParams.str_srjobno;
    if (Object.keys(queryParams).length !== 0) {
        jobs = jobs.split(",");
    }

    const [print, setPrint] = useState(jobs);
    const chunkSize11 = 15;

    useEffect(() => {
        if (Object.keys(queryParams).length !== 0) {
            atob(queryParams.imagepath);
        }
        const fetchData = async () => {
            try {
                const responseData = [];
                for (let url in print) {

                    let chunkData = [];
                    const obj = {
                        jobno: print[url],
                        custid: queries.custid,
                        printname: queries.printname,
                        appuserid: queries.appuserid,
                        url: queries.url,
                        headers: headers,
                    };

                    let datas = await GetData(obj);
                    const orderDatef = formatDate(datas?.rd[0]?.OrderDate);
                    const promiseDatef = formatDate(datas?.rd[0]?.promisedate);
          
                    datas?.rd?.map((e) => {
                      e.orderDatef = orderDatef;
                      e.promiseDatef = promiseDatef;
                      // 
                    });

                    let separateData = GetSeparateData(datas?.rd1);
                    // let p_tag = { "SerialJobno": `${print[url]}`, "customerid": `${queries.custid}`, "BagPrintName": `${queries.printname}` };
                    // let jsonString = JSON.stringify(p_tag);
                    // let base64String = btoa(jsonString);
                    // let Body = {
                    //     "con": `{\"id\":\"\",\"mode\":\"${queries.printname}\",\"appuserid\":\"${queries.appuserid}\"}`,
                    //     "p": `${base64String}`,
                    //     "f": `${queries.appuserid} ${queries.printname}`
                    // };
                    // let urls = atob(queries.url);
                    // const response = await axios.post(urls, Body, { headers: headers });
                    // let datas = JSON.parse(response.data.d);



                    // let length = 0;
                    // let clr = {
                    //     Shapename: "TOTAL",
                    //     Sizename: "",
                    //     ActualPcs: 0,
                    //     ActualWeight: 0,
                    //     MasterManagement_DiamondStoneTypeid: 3
                    //     // heading: "COLOR STONE DETAIL"
                    // };
                    // let dia = {
                    //     Shapename: "TOTAL",
                    //     Sizename: "",
                    //     ActualPcs: 0,
                    //     ActualWeight: 0,
                    //     MasterManagement_DiamondStoneTypeid: 4
                    //     // heading: "DIAMOND DETAIL"
                    // };
                    // let misc = {
                    //     Shapename: "TOTAL",
                    //     Sizename: "",
                    //     ActualPcs: 0,
                    //     ActualWeight: 0,
                    //     MasterManagement_DiamondStoneTypeid: 7
                    //     // heading: "MISC DETAIL"
                    // };
                    // let f = {
                    //     Shapename: "TOTAL",
                    //     Sizename: "",
                    //     ActualPcs: 0,
                    //     ActualWeight: 0,
                    //     MasterManagement_DiamondStoneTypeid: 5
                    //     // heading: "FINDING DETAIL"
                    // };
                    // let ArrofSevenSize = [];
                    // //arr for colorstone
                    // let ArrofFiveSize = [];
                    // let ArrofMISize = [];
                    // let ArrofFSize = [];

                    // datas?.rd1?.map((e, i) => {

                    //     if (e.ConcatedFullShapeQualityColorCode !== "- - - ") {
                    //         length++;
                    //     }
                    //     if (e.MasterManagement_DiamondStoneTypeid === 3) {
                    //         ArrofSevenSize.push(e);
                    //         dia.ActualPcs = dia.ActualPcs + e.ActualPcs;
                    //         dia.ActualWeight = dia.ActualWeight + e.ActualWeight;

                    //     } else if (e.MasterManagement_DiamondStoneTypeid === 4) {
                    //         ArrofFiveSize.push(e);
                    //         // ArrofFiveSize[0].heading = "COLOR STONE DETAIL";
                    //         clr.ActualPcs = clr.ActualPcs + e.ActualPcs;
                    //         clr.ActualWeight = clr.ActualWeight + e.ActualWeight;
                    //     } else if (e.MasterManagement_DiamondStoneTypeid === 5) {
                    //         ArrofFSize.push(e);
                    //         // ArrofFSize[0].heading = "FINDING DETAIL";
                    //         f.ActualPcs = f.ActualPcs + e.ActualPcs;
                    //         f.ActualWeight = f.ActualWeight + e.ActualWeight;
                    //     } else if (e.MasterManagement_DiamondStoneTypeid === 7) {
                    //         ArrofMISize.push(e);
                    //         // ArrofMISize[0].heading = "MISC DETAIL";
                    //         misc.ActualPcs = misc.ActualPcs + e.ActualPcs;
                    //         misc.ActualWeight = misc.ActualWeight + e.ActualWeight;
                    //     }
                    // });
                    // dia.ActualPcs = +(dia.ActualPcs.toFixed(3));
                    // dia.ActualWeight = +(dia.ActualWeight.toFixed(3));
                    // clr.ActualPcs = +(clr.ActualPcs.toFixed(3));
                    // clr.ActualWeight = +(clr.ActualWeight.toFixed(3));
                    // misc.ActualPcs = +(misc.ActualPcs.toFixed(3));
                    // misc.ActualWeight = +(misc.ActualWeight.toFixed(3));
                    // f.ActualPcs = +(f.ActualPcs.toFixed(3));
                    // f.ActualWeight = +(f.ActualWeight.toFixed(3));

                    // ArrofSevenSize.push(dia);
                    // ArrofSevenSize.push(dia);
                    // ArrofSevenSize[0].heading = "DIAMOND DETAIL";
                    separateData?.diamondArr.unshift({ heading: "DIAMOND DETAIL", MasterManagement_DiamondStoneTypeid: 3 });
                    // ArrofSevenSize.unshift({ heading: "DIAMOND DETAIL", MasterManagement_DiamondStoneTypeid: 3 });

                    // ArrofFiveSize.push(clr);
                    // ArrofFiveSize[0].heading = "COLOR STONE DETAIL";
                    // ArrofFiveSize.unshift({ heading: "COLOR STONE DETAIL", MasterManagement_DiamondStoneTypeid: 4 });
                    separateData?.colorStoneArr.unshift({ heading: "COLOR STONE DETAIL", MasterManagement_DiamondStoneTypeid: 4 });

                    // ArrofFSize.push(f);
                    // ArrofFSize[0].heading = "FINDING DETAIL";
                    // ArrofFSize.unshift({ heading: "FINDING DETAIL", MasterManagement_DiamondStoneTypeid: 5 });
                    separateData?.findingArr.unshift({ heading: "FINDING DETAIL", MasterManagement_DiamondStoneTypeid: 5 });

                    // ArrofMISize.push(misc);
                    // ArrofMISize[0].heading = "MISC DETAIL";
                    // ArrofMISize.unshift({ heading: "MISC DETAIL", MasterManagement_DiamondStoneTypeid: 7 });
                    separateData?.miscArr.unshift({ heading: "MISC DETAIL", MasterManagement_DiamondStoneTypeid: 7 });

                    separateData?.diamondArr.map((e) => {
                        if (e.ActualPcs === 0 && e.ActualWeight === 0) {
                            // ArrofSevenSize = [];
                            separateData.diamondArr = [];
                        }

                    }
                    );
                    separateData?.colorStoneArr.map((e) => {
                        if (e.ActualPcs === 0 && e.ActualWeight === 0) {
                            // ArrofFiveSize = [];
                            separateData.colorStoneArr = [];
                        }

                    }
                    );
                    separateData?.miscArr.map((e) => {
                        if (e.ActualPcs === 0 && e.ActualWeight === 0) {
                            // ArrofMISize = [];
                            separateData.miscArr = [];
                        }

                    }
                    );
                    separateData?.findingArr.map((e) => {
                        if (e.ActualPcs === 0 && e.ActualWeight === 0) {
                            // ArrofFSize = [];
                            separateData.findingArr = [];
                        }

                    }
                    );
                    let arr = [];
                    // let mainArr = arr.concat(ArrofSevenSize, ArrofFiveSize, ArrofMISize, ArrofFSize);
                    let mainArr = arr.concat(separateData?.diamondArr, separateData?.colorStoneArr, separateData?.miscArr, separateData?.findingArr);
                    let createdMainArr = [];
                    for (let i = 0; i < mainArr.length; i += chunkSize11) {
                        const chunks = mainArr.slice(i, i + chunkSize11);
                        let mainHeading = "";
                        let emptyHeading = "";
                        let createdChunks = [];
                        chunks.map((ele, ind) => {
                            if (ele.MasterManagement_DiamondStoneTypeid && mainHeading === "") {
                                mainHeading = ele.heading;
                                let head = "";
                                if (ele.MasterManagement_DiamondStoneTypeid === 3) {
                                    head = "DIAMOND DETAIL";
                                } else if (ele.MasterManagement_DiamondStoneTypeid === 4) {
                                    head = "COLOR STONE DETAIL";
                                } else if (ele.MasterManagement_DiamondStoneTypeid === 5) {
                                    head = "FINDING DETAIL";
                                } else if (ele.MasterManagement_DiamondStoneTypeid === 7) {
                                    head = "MISC DETAIL";
                                }
                                let obj = {
                                    mainHeading: head
                                };
                                createdChunks.unshift(obj);
                                createdChunks.push(ele);
                            } else if (ele.heading) {
                                if (mainHeading === ele.heading) {
                                    emptyHeading = "full";
                                } else {
                                    createdChunks.push(ele);
                                }
                            } else {
                                createdChunks.push(ele);
                            }
                        });
                        createdMainArr.push(createdChunks);
                    }

                    let imagePath = queryParams?.imagepath;
                    imagePath = atob(queryParams?.imagepath);

                    let img = imagePath + datas?.rd[0]?.ThumbImagePath;

                    let arrofchunk = GetChunkData(chunkSize11, mainArr);
                    // for (let i = 0; i < mainArr.length; i += chunkSize11) {
                    //     const chunks = mainArr.slice(i, i + chunkSize11);
                    //     let len = 15 - (mainArr.slice(i, i + chunkSize11)).length;
                    //     chunkData.push({ data: chunks, length: len });
                    // }

                    // responseData.push({ data: datas, additional: { length: length, clr: clr, dia: dia, f: f, img: img, misc: misc, pages: arrofchunk } });
                    responseData.push({ data: datas, additional: { length: separateData?.length, clr: separateData?.clr, dia: separateData?.dia, f: separateData?.f, img: img, misc: separateData?.misc, pages: arrofchunk } });

                }
                setData(responseData);
                //     let arr = [];
                //     let mainArr = arr.concat(ArrofSevenSize, ArrofFiveSize, ArrofMISize, ArrofFSize);
                //     let createdMainArr = [];
                //     for (let i = 0; i < mainArr.length; i += chunkSize11) {
                //         const chunks = mainArr.slice(i, i + chunkSize11);
                //         let mainHeading = "";
                //         let emptyHeading = "";
                //         let createdChunks = [];
                //         chunks.map((ele, ind) => {
                //             if (ele.MasterManagement_DiamondStoneTypeid && mainHeading === "") {
                //                 mainHeading = ele.heading;
                //                 let head = "";
                //                 if (ele.MasterManagement_DiamondStoneTypeid === 3) {
                //                     head = "DIAMOND DETAIL";
                //                 } else if (ele.MasterManagement_DiamondStoneTypeid === 4) {
                //                     head = "COLOR STONE DETAIL";
                //                 } else if (ele.MasterManagement_DiamondStoneTypeid === 5) {
                //                     head = "FINDING DETAIL";
                //                 } else if (ele.MasterManagement_DiamondStoneTypeid === 7) {
                //                     head = "MISC DETAIL";
                //                 }
                //                 let obj = {
                //                     mainHeading: head
                //                 };
                //                 createdChunks.unshift(obj);
                //                 createdChunks.push(ele);
                //             } else if (ele.heading) {
                //                 if (mainHeading === ele.heading) {
                //                     emptyHeading = "full";
                //                 } else {
                //                     createdChunks.push(ele);
                //                 }
                //             } else {
                //                 createdChunks.push(ele);
                //             }
                //         });
                //         createdMainArr.push(createdChunks);
                //     }
                //     let imagePath = queryParams?.imagepath;
                //     imagePath = atob(queryParams?.imagepath);



                //     let img = imagePath + datas.rd[0].ThumbImagePath;
                //     for (let i = 0; i < mainArr.length; i += chunkSize11) {
                //         const chunks = mainArr.slice(i, i + chunkSize11);
                //         let len = 13 - (mainArr.slice(i, i + chunkSize11)).length;
                //         chunkData.push({ data: chunks, length: len });
                //     }
                //     responseData.push({ data: datas, additional: { length: length, clr: clr, dia: dia, f: f, img: img, misc: misc, pages: chunkData } });

                // }
                // setData(responseData);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    function handlePrint(e) {
        e.preventDefault();
        window.print();
    }

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
                data.length === 0 ? <Loader /> : <><div className="print_btn "><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
                    Print
                </button></div>

                    <div className='print2A'>
                        {Array.from({ length: queries.pageStart }, (_, index) => (
                            index > 0 && <div key={index} className="mainbag2A" style={{border:"0px"}}></div>
                        ))}
                        {
                            data.length > 0 && data.map((e, i) => {

                                return (
                                    <>
                                        {
                                            e?.additional?.pages?.length > 0 ? e?.additional?.pages?.map((ele, i) => {
                                                return (
                                                    <>
                                                        <div className='mainbag2A'>
                                                            <div className='print2AStartPart'>
                                                                <div className='print2A_header'>
                                                                    <div className='print2A_header_bagInfoPart'>
                                                                        <div className='print2A_header_bagInfoPart1'>
                                                                            <div className='print2AJobNo' style={{ fontSize: "15px" }}>{e?.data?.rd[0]?.serialjobno}</div>
                                                                            <div className='print2AJobNo'>{e?.data?.rd[0]?.Designcode?.toUpperCase()}</div>
                                                                            <div className='print2AJobNo'>{e?.data?.rd[0]?.MetalType?.toUpperCase()}</div>
                                                                            <div className='print2AJobNo'>{e?.data?.rd[0]?.MetalColorCo?.toUpperCase()}</div>
                                                                        </div>

                                                                        <div className='print2AMaterial'>
                                                                            <div className='print2AMaterialCG'>
                                                                                <div className='g2A'>CUST.</div>
                                                                                <div className='custHead2A' style={{ width: "60px" }}>{e?.data?.rd[0]?.CustomerCode}</div>
                                                                                <div className='custCode2A'>
                                                                                    <b>GOLD</b></div>
                                                                                <div className='cst2A'><b>DIA</b></div>
                                                                                <div className='cst2A' style={{ borderRight: "0px" }}><b>CST</b></div>
                                                                            </div>
                                                                            <div className='print2AMaterialCG'>
                                                                                <div className='g2A'>SIZE</div>
                                                                                <div className='custHead2A' style={{ width: "60px" }}>{e?.data?.rd[0]?.Size}</div>
                                                                                <div className='custCode2A'>{e?.data?.rd[0]?.MetalWeight?.toFixed(3)}</div>
                                                                                <div className='cst2A'>{e?.additional?.dia?.ActualPcs}/{e?.additional?.dia?.ActualWeight?.toFixed(3)}</div>
                                                                                <div className='cst2A' style={{ borderRight: "0px" }}>{e?.additional?.clr?.ActualPcs}/{e?.additional?.clr?.ActualWeight?.toFixed(3)}</div></div>
                                                                            <div className='print2AMaterialCG'>
                                                                                <div className='g2A' style={{ width: "39px" }}>PO</div>
                                                                                <div className='custHead2A' style={{ "width": "100px" }}>{e?.data?.rd[0]?.PO}</div>
                                                                                <div className='cst2A'><b>BAG DT</b></div>
                                                                                <div className='cst2A' style={{ borderRight: "0px" }}>{e?.data?.rd[0]?.orderDatef}</div></div>
                                                                            {/* <div className='print1Adia'><b>SKU#{e?.data?.rd[0]?.OrderNo}</b><b>{e?.data[0]?.OrderNo} */}
                                                                            {/* {
                                                                                ele.data.map((el, ins) => {

                                                                                    if (el.MasterManagement_DiamondStoneTypeid === 3 && ins === 0) {
                                                                                        return (
                                                                                            <>
                                                                                                <div><b>DIAMOND DETAIL</b></div>
                                                                                            </>
                                                                                        );
                                                                                    }
                                                                                    else if (el.MasterManagement_DiamondStoneTypeid === 4 && ins === 0) {
                                                                                        return (
                                                                                            <>
                                                                                                <div><b>COLOR STONE DETAIL</b></div>
                                                                                            </>
                                                                                        );
                                                                                    }
                                                                                    else if (el.MasterManagement_DiamondStoneTypeid === 5 && ins === 0) {
                                                                                        return (
                                                                                            <>
                                                                                                <div><b>FINDING DETAIL</b></div>
                                                                                            </>
                                                                                        );
                                                                                    }
                                                                                    else if (el.MasterManagement_DiamondStoneTypeid === 7 && ins === 0) {
                                                                                        return (
                                                                                            <>
                                                                                                <div><b>MISC DETAIL</b></div>
                                                                                            </>
                                                                                        );
                                                                                    }
                                                                                })
                                                                            } */}
                                                                            {/* </b></div> */}
                                                                        </div>
                                                                    </div>
                                                                    <div className='print2A_header_bagImgPart2'><img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} id="print2AImg" alt="" onError={e => handleImageError(e)} loading="eager"  /></div>
                                                                </div>

                                                            </div>
                                                            <div className='print2AtableBarcode' style={{ height: "287px" }}>
                                                                <div className='midpart2A'>
                                                                    <div className='print2AMiddlePart'>
                                                                        <div className='print2AMidHead'>
                                                                            <div className='print2ARM' style={{ width: "104px" }}><b>RM CODE</b></div>
                                                                            <div className='sizename2A' style={{ display: "flex", justifyContent: "center", fontSize: "14px", width: "69px" }}><b>RM SIZE</b></div>
                                                                            <div className='actual2Aflex' style={{ borderRight: "1px solid black" }}><div className='whA2A'><b>ACTUAL</b></div><div className='child2A'><p className='pcswtSet2A'><b>PCS</b></p><p style={{ fontSize: "12px", paddingTop: "0px" }}><b>WT</b></p></div></div>
                                                                            <div className='actual2Aflex' style={{ borderRight: "0px" }}><div className='whA2A'><b>ISSUE</b></div><div className='child2A'><p className='pcswtSet2A'><b>PCS</b></p><p style={{ fontSize: "12px", paddingTop: "0px", }}><b>WT</b></p></div></div>
                                                                        </div>

                                                                        {
                                                                            ele?.data?.map((e, i) => {

                                                                                return (
                                                                                    <>

                                                                                        {
                                                                                            ((e?.heading === "DIAMOND DETAIL") || (e?.heading === "COLOR STONE DETAIL") || (e?.heading === "MISC DETAIL") || (e?.heading === "FINDING DETAIL"))
                                                                                                ?
                                                                                                <div className='print2AMidBody' style={i === 0 ? { display: "" } : {}}>
                                                                                                    <div className='print2ARM' style={{ width: "300px", borderRight: "0px", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }} >{e?.heading}</div>
                                                                                                </div>
                                                                                                :
                                                                                                <>

                                                                                                    {
                                                                                                        (e?.Shapename === "TOTAL") ?
                                                                                                            <div className='print2AMidBody'>
                                                                                                                <div className='print2ARM RMW2A' style={{ fontWeight: "bold", fontSize: "10px" }}>{e?.Shapename}</div>
                                                                                                                <div className='sizename2A' style={{ fontSize: "10.7px" }}>{(((e?.Sizename) && (e?.Sizename !== "")) && e?.Sizename?.slice(0, 10)) ?? ''}</div>
                                                                                                                <div className='pcswt2A'>
                                                                                                                    <div className='actualPcsWt2A'>
                                                                                                                        <div className='pcs2A' style={{ fontWeight: "bold", fontSize: "10px", lineHeight: "8px" }}>{e?.ActualPcs}</div>
                                                                                                                        <div className='pcs2A' style={{ borderRight: "0px", width: "40px", fontWeight: "bold", fontSize: "9.5px", lineHeight: "8px", justifyContent: "flex-end", paddingRight: "1px" }}>{e?.ActualWeight?.toFixed(3)}</div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className=''>
                                                                                                                    <div className=''>
                                                                                                                        <div className='    ' style={{ border: '', borderRight: "1px solid rgb(0, 0, 0)", width: "33px", height: "14px" }}></div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div> :
                                                                                                            <>
                                                                                                                {
                                                                                                                    (e?.MasterManagement_DiamondStoneTypeid === 5) ?
                                                                                                                        <div className='print2AMidBody'>
                                                                                                                            <div className='print2ARM FIND2A' style={{ fontSize: "10px" }}>{e?.LimitedShapeQualityColorCode?.toUpperCase() + " " + e?.Quality?.toUpperCase() + " " + e?.ColorName?.toUpperCase()}</div>
                                                                                                                            <div className='pcswt2A'>
                                                                                                                                <div className='actualPcsWt2A'>
                                                                                                                                    <div className='pcs2A' style={{ fontSize: "10px" }}>{e?.ActualPcs}</div>
                                                                                                                                    <div className='pcs2A' style={{ borderRight: "0px", width: "40px", fontSize: "10px", lineHeight: "8px", justifyContent: "flex-end", paddingRight: "1px" }}>{e?.ActualWeight?.toFixed(3)}</div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className=''>
                                                                                                                                <div className=''>
                                                                                                                                    <div className='    ' style={{ border: '', borderRight: "1px solid rgb(0, 0, 0)", width: "33px", height: "14px" }}></div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div> : <div className='print2AMidBody'>
                                                                                                                            {/* <div className='print1ARM RMW' style={{fontSize:"10px"}}>{e.Shapename}</div> */}
                                                                                                                            <div className='print2ARM RMW2A' style={{ fontSize: "10px" }}>{e?.LimitedShapeQualityColorCode?.toUpperCase()}</div>
                                                                                                                            <div className='sizename2A' style={{ fontSize: "10px" }}>{(((e?.Sizename) && (e?.Sizename !== "")) && e?.Sizename?.slice(0, 10)) ?? ''}</div>
                                                                                                                            <div className='pcswt2A'>
                                                                                                                                <div className='actualPcsWt2A'>
                                                                                                                                    <div className='pcs2A' style={{ fontSize: "10px" }}>{e?.ActualPcs}</div>
                                                                                                                                    <div className='pcs2A' style={{ borderRight: "0px", width: "40px", fontSize: "10px", lineHeight: "8px", justifyContent: "flex-end", paddingRight: "1px" }}>{e?.ActualWeight?.toFixed(3)}</div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className=''>
                                                                                                                                <div className=''>
                                                                                                                                    <div className='' style={{ border: '', borderRight: "1px solid rgb(0, 0, 0)", width: "33px", height: "14px" }}></div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                }
                                                                                                            </>

                                                                                                    }
                                                                                                </>



                                                                                        }

                                                                                    </>
                                                                                );
                                                                            })
                                                                        }
                                                                        {
                                                                            Array.from({ length: (ele?.length) }, (i) => {
                                                                                return (
                                                                                    <>
                                                                                        {
                                                                                            i !== 0 ? <div className='print2AMidBody'>
                                                                                                <div className='print2ARM RMW2A' >{e.Shapename ?? ''}</div>
                                                                                                <div className='sizename2A'>{e.Sizename ?? ''}</div>
                                                                                                <div className='pcswt2A'>
                                                                                                    <div className='actualPcsWt2A'>
                                                                                                        <div className='pcs2A'>{e?.ActualPcs ?? ''}</div>
                                                                                                        <div className='' style={{ borderRight: "0px", width: "40px" }}>{e?.ActualWeight ?? ''}</div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className=''>
                                                                                                    <div className=''>
                                                                                                        <div className='bordered-div' style={{
                                                                                                            width: '33px',
                                                                                                            height: '14px',
                                                                                                            // border: '1px solid black',
                                                                                                            borderRight: '1px solid',
                                                                                                            borderBottom: '0px solid',
                                                                                                            borderTop: '0px'
                                                                                                        }}></div><div className=''></div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div> : <div className='print2AMidBody' style={{ display: "none" }}>
                                                                                                <div className='print2ARM RMW2A' >{e.Shapename ?? ''}</div>
                                                                                                <div className='sizename2A'>{e.Sizename ?? ''}</div>
                                                                                                <div className='pcswt2A'>
                                                                                                    <div className='actualPcsWt2A'>
                                                                                                        <div className='pcs2A'>{e?.ActualPcs ?? ''}</div>
                                                                                                        <div className='' style={{ borderRight: "0px", width: "30px" }}>{e?.ActualWeight ?? ''}</div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className=''>
                                                                                                    <div className=''>
                                                                                                        <div className='bordered-div' style={{
                                                                                                            width: '33px',
                                                                                                            height: '17px',
                                                                                                            // border: '1px solid black',
                                                                                                            borderRight: '1px solid',
                                                                                                            borderBottom: '0px solid',
                                                                                                            borderTop: '0px'
                                                                                                        }}></div><div className=''></div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        }

                                                                                    </>
                                                                                );
                                                                            })
                                                                        }

                                                                    </div>
                                                                    {
                                                                        (((e?.data?.rd[0]?.officeuse !== null) && (e?.data?.rd[0]?.officeuse !== "null") && (e?.data?.rd[0]?.officeuse !== undefined) && (e?.data?.rd[0]?.officeuse !== '')) ||
                                                                            ((e?.data?.rd[0]?.ProductInstruction !== null) && (e?.data?.rd[0]?.ProductInstruction !== "null") && (e?.data?.rd[0]?.ProductInstruction !== undefined) && (e?.data?.rd[0]?.ProductInstruction !== ''))) ? <div style={{ fontSize: "14px", paddingLeft: "2px", paddingTop: "2px", lineHeight: "14px", height: "34px" }}><b>INSTRUCTION:</b><span style={{ color: "red" }}>{(e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction).length > 0 ? ((e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e.data.rd[0].ProductInstruction)?.toUpperCase()?.slice(0, 166) == (null || 'null') ? '' : (e.data.rd[0].officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction)?.slice(0, 95)) : ''}</span></div> : <b>INSTRUCTION:</b>
                                                                    }
                                                                    {/* <div style={{ fontSize: "14px", paddingLeft: "2px", paddingTop: "2px", lineHeight: "14px", height: "34px" }}><b>INSTRUCTION:</b><span style={{ color: "red" }}>{(e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction).length > 0 ? ((e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e.data.rd[0].ProductInstruction)?.toUpperCase()?.slice(0, 166) == (null || 'null') ? '' : (e.data.rd[0].officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction)?.slice(0, 95)) : ''}</span></div> */}
                                                                </div>
                                                                <div className='barcodeSetPrint2A' style={{ height: "285px", marginTop: "3px" }}>
                                                                    <div className='barcodeprint2A'>
                                                                        {e?.data?.rd[0]?.serialjobno !== '' ? <BarcodeGenerator data={e?.data?.rd[0]?.serialjobno} /> : ''}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                );
                                            }) : <div className='mainbag2A'>
                                                <div className='print2AStartPart'>
                                                    <div className='print2A_header'>
                                                        <div className='print2A_header_bagInfoPart'>
                                                            <div className='print2A_header_bagInfoPart1'>
                                                                <div className='print2AJobNo' style={{ fontSize: "15px" }}>{e?.data?.rd[0]?.serialjobno}</div>
                                                                <div className='print2AJobNo'>{e?.data?.rd[0]?.Designcode}</div>
                                                                <div className='print2AJobNo'>{e?.data?.rd[0]?.MetalType}</div>
                                                                <div className='print2AJobNo'>{e?.data?.rd[0]?.MetalColorCo}</div>
                                                            </div>

                                                            <div className='print2AMaterial'>
                                                                <div className='print2AMaterialCG'>
                                                                    <div className='g2A'>CUST.</div>
                                                                    <div className='custHead2A'>{e?.data?.rd[0]?.CustomerCode}</div>
                                                                    <div className='custCode2A'>
                                                                        <b>GOLD</b></div>
                                                                    <div className='cst2A'><b>DIA</b></div>
                                                                    <div className='cst2A' style={{ borderRight: "0px" }}><b>CST</b></div>
                                                                </div>
                                                                <div className='print2AMaterialCG'>
                                                                    <div className='g2A'>SIZE</div>
                                                                    <div className='custHead2A'>{e?.data?.rd[0]?.Size}</div>
                                                                    <div className='custCode2A'>{e?.data?.rd[0]?.MetalWeight?.toFixed(3)}</div>
                                                                    <div className='cst2A'>{e?.additional?.dia?.ActualPcs}/{e?.additional?.dia?.ActualWeight?.toFixed(3)}</div>
                                                                    <div className='cst2A' style={{ borderRight: "0px" }}>{e?.additional?.clr?.ActualPcs}/{e?.additional?.clr?.ActualWeight?.toFixed(3)}</div></div>
                                                                <div className='print2AMaterialCG'>
                                                                    <div className='g2A' style={{ width: "37px" }}>PO</div>
                                                                    <div className='custHead2A' style={{ "width": "100px" }}>{e?.data?.rd[0]?.PO}</div>
                                                                    <div className='cst2A'><b>BAG DT</b></div>
                                                                    <div className='cst2A' style={{ borderRight: "0px" }}>{e?.data?.rd[0]?.OrderDate}</div></div>
                                                                {

                                                                }
                                                                {/* <div className='print1Adia'><b>SKU#{e?.data?.rd[0]?.OrderNo}</b><b>{e?.data[0]?.OrderNo}</b></div> */}
                                                            </div>
                                                        </div>
                                                        <div className='print2A_header_bagImgPart2'><img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} id="print2AImg" alt="" onError={e => handleImageError(e)} loading="eager"  /></div>
                                                    </div>

                                                </div>
                                                <div className='print2AtableBarcode'>
                                                    <div className='midpart2A'>
                                                        <div className='print2AMiddlePart'>
                                                            <div className='print2AMidHead'>
                                                                <div className='print2ARM' style={{ width: "104px" }}><b>RM CODE</b></div>
                                                                <div className='sizename2A' style={{ display: "flex", justifyContent: "center", fontSize: "14px", width: "69px" }}><b>RM SIZE</b></div>
                                                                <div className='actual2Aflex'><div className='whA2A'>ACTUAL</div><div className='child2A'><p className='pcswtSet2A'>PCS</p><p style={{ fontSize: "12px", paddingTop: "0px" }}>WT</p></div></div>
                                                                <div className='actual2Aflex' style={{ borderRight: "0px" }}><div className='whA2A'>ISSUE</div><div className='child2A'><p className='pcswtSet2A'>PCS</p><p style={{ fontSize: "12px", paddingTop: "0px", }}>WT</p></div></div>
                                                            </div>
                                                            {/* <div className='print1AMidHead'>
                                                                <div className='print1ARM' style={{ width: "111px" }}><b>RM CODE</b></div>
                                                                <div className='sizename1A' style={{ display: "flex", justifyContent: "center", fontSize: "14px" }}><b>RM SIZE</b></div>
                                                                <div className='actual1Aflex'><div className='whA1A'>ACTUAL</div><div className='child1A'><p className='pcswtSet1A'>PCS</p><p style={{ fontSize: "12px", paddingTop: "3px" }}>WT</p></div></div>
                                                                <div className='actual1Aflex' style={{ borderRight: "0px" }}><div className='whA1A'>ISSUE</div><div className='child1A'><p className='pcswtSet1A'>PCS</p><p style={{ fontSize: "12px", paddingTop: "3px", }}>WT</p></div></div>
                                                            </div> */}

                                                            {
                                                                Array.from({ length: (15) }, (i) => {
                                                                    return (
                                                                        <>
                                                                            <div className='print2AMidBody' key={i}>
                                                                                <div className='print2ARM RMW2A' >{e.Shapename ?? ''}</div>
                                                                                <div className='sizename2A'>{e.Sizename ?? ''}</div>
                                                                                <div className='pcswt2A'>
                                                                                    <div className='actualPcsWt2A'>
                                                                                        <div className='pcs2A'>{e?.ActualPcs ?? ''}</div>
                                                                                        <div className='' style={{ borderRight: "0px", width: "30px" }}>{e?.ActualWeight ?? ''}</div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className=''>
                                                                                    <div className=''>
                                                                                        <div className='bordered-div' style={{
                                                                                            width: '33px',
                                                                                            height: '17px',
                                                                                            // border: '1px solid black',
                                                                                            borderRight: '1px solid',
                                                                                            borderBottom: '0px solid',
                                                                                            borderTop: '0px'
                                                                                        }}></div><div className=''></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    );
                                                                })
                                                            }


                                                        </div>
                                                        <div style={{ fontSize: "14px", paddingLeft: "2px", paddingRight: "2px" }}><b>INSTRUCTION:</b><span style={{ color: "red" }}>{(e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction)?.length > 0 ? ((e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction)?.slice(0, 166) == (null || 'null') ? '' : (e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction)?.slice(0, 166)) : ''}</span></div>
                                                    </div>
                                                    <div className='barcodeSetPrint2A'>
                                                        <div className='barcodeprin2A'>
                                                            {(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd[0]?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd[0]?.serialjobno} />}</>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                    </>
                                );
                            })
                        }
                    </div>
                </>
            }
        </>
    );
}

export default BagPrint2A;