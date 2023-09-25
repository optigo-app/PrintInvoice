import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "../../assets/css/bagprint/print5A.css";
import { formatDate } from '../../GlobalFunctions/DateFormat';
import { GetChunkData } from '../../GlobalFunctions/GetChunkData';
import { GetData } from '../../GlobalFunctions/GetData';
import { handlePrint } from '../../GlobalFunctions/HandlePrint';
import { handleImageError } from '../../GlobalFunctions/HandleImageError';
import BarcodeGenerator from '../../components/BarcodeGenerator';
import Loader from '../../components/LoaderBag';
const BagPrint5A = ({ queries, headers }) => {
    const [data, setData] = useState([]);
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    let jobs = queryParams.str_srjobno;
    if (Object.keys(queryParams).length !== 0) {
        jobs = jobs.split(",");
    }

    const [print, setPrint] = useState(jobs);
    const chunkSize17 = 17;

    useEffect(() => {
        if (Object.keys(queryParams).length !== 0) {
            atob(queryParams.imagepath);
        }
        const fetchData = async () => {
            try {
                const responseData = [];
                for (let url in print) {
                    let chunkData = [];
                    const objs = {
                        jobno: print[url],
                        custid: queries.custid,
                        printname: queries.printname,
                        appuserid: queries.appuserid,
                        url: queries.url,
                        headers: headers,
                    };
                    let datas = await GetData(objs);
                    const orderDatef = formatDate(datas?.rd[0]?.OrderDate);
                    const promiseDatef = formatDate(datas?.rd[0]?.promisedate);

                    datas?.rd?.map((e) => {
                        e.orderDatef = orderDatef;
                        e.promiseDatef = promiseDatef;
                    });

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

                    let length = 0;
                    let clr = {
                        // Shapename: "TOTAL",
                        // Sizename: "",
                        ActualPcs: 0,
                        ActualWeight: 0,
                        // heading: "COLOR STONE DETAIL"
                    };
                    let dia = {
                        // Shapename: "TOTAL",
                        // Sizename: "",
                        ActualPcs: 0,
                        ActualWeight: 0,
                        // heading: "DIAMOND DETAIL"
                    };
                    let misc = {
                        // Shapename: "TOTAL",
                        // Sizename: "",
                        ActualPcs: 0,
                        ActualWeight: 0,
                        // heading: "MISC DETAIL"
                    };
                    let f = {
                        // Shapename: "TOTAL",
                        // Sizename: "",
                        ActualPcs: 0,
                        ActualWeight: 0,
                        // heading: "FINDING DETAIL"
                    };
                    let ArrofSevenSize = [];
                    //arr for colorstone
                    let ArrofFiveSize = [];
                    let ArrofMISize = [];
                    let ArrofFSize = [];

                    datas.rd1.map((e, i) => {
                        if (e.ConcatedFullShapeQualityColorCode !== "- - - ") {
                            length++;
                        }
                        if (e.MasterManagement_DiamondStoneTypeid === 3) {
                            ArrofSevenSize.push(e);
                            // ArrofSevenSize[0].heading = "DIAMOND DETAIL";
                            dia.ActualPcs = dia.ActualPcs + e.ActualPcs;
                            dia.ActualWeight = dia.ActualWeight + e.ActualWeight;
                        } else if (e.MasterManagement_DiamondStoneTypeid === 4) {
                            ArrofFiveSize.push(e);
                            // ArrofFiveSize[0].heading = "COLOR STONE DETAIL";
                            clr.ActualPcs = clr.ActualPcs + e.ActualPcs;
                            clr.ActualWeight = clr.ActualWeight + e.ActualWeight;
                        } else if (e.MasterManagement_DiamondStoneTypeid === 5) {
                            ArrofFSize.push(e);
                            // ArrofFSize[0].heading = "FINDING DETAIL";
                            f.ActualPcs = f.ActualPcs + e.ActualPcs;
                            f.ActualWeight = f.ActualWeight + e.ActualWeight;
                        } else if (e.MasterManagement_DiamondStoneTypeid === 7) {
                            ArrofMISize.push(e);
                            // ArrofMISize[0].heading = "MISC DETAIL";
                            misc.ActualPcs = misc.ActualPcs + e.ActualPcs;
                            misc.ActualWeight = misc.ActualWeight + e.ActualWeight;
                        }
                    });
                    dia.ActualPcs = +(dia.ActualPcs.toFixed(3));
                    dia.ActualWeight = +(dia.ActualWeight.toFixed(3));
                    clr.ActualPcs = +(clr.ActualPcs.toFixed(3));
                    clr.ActualWeight = +(clr.ActualWeight.toFixed(3));
                    misc.ActualPcs = +(misc.ActualPcs.toFixed(3));
                    misc.ActualWeight = +(misc.ActualWeight.toFixed(3));
                    f.ActualPcs = +(f.ActualPcs.toFixed(3));
                    f.ActualWeight = +(f.ActualWeight.toFixed(3));

                    // ArrofSevenSize.push(dia);
                    // ArrofFiveSize.push(clr);
                    // ArrofFSize.push(f);
                    // ArrofMISize.push(misc);

                    ArrofSevenSize.map((e) => {
                        if (e.ActualPcs === 0 && e.ActualWeight === 0) {
                            ArrofSevenSize = [];
                        } else {
                            e.heading = "DIAMOND DETAIL";
                        }
                    }
                    );
                    ArrofFiveSize.map((e) => {
                        if (e.ActualPcs === 0 && e.ActualWeight === 0) {
                            ArrofFiveSize = [];
                        } else {
                            e.heading = "COLOR STONE DETAIL";
                        }
                    }
                    );
                    ArrofMISize.map((e) => {
                        if (e.ActualPcs === 0 && e.ActualWeight === 0) {
                            ArrofMISize = [];
                        } else {
                            e.heading = "MISC DETAIL";
                        }
                    }
                    );
                    ArrofFSize.map((e) => {
                        if (e.ActualPcs === 0 && e.ActualWeight === 0) {
                            ArrofFSize = [];
                        } else {
                            e.heading = "FINDING DETAIL";
                        }
                    }
                    );
                    let arr = [];
                    let mainArr = arr.concat(ArrofSevenSize, ArrofFiveSize, ArrofMISize, ArrofFSize);
                    let imagePath = queryParams.imagepath;
                    imagePath = atob(queryParams.imagepath);


                    let img = imagePath + datas?.rd[0]?.ThumbImagePath;
                    let arrofchunk = GetChunkData(chunkSize17, mainArr);
                    // for (let i = 0; i < mainArr.length; i += chunkSize17) {
                    //     const chunks = mainArr.slice(i, i + chunkSize17);
                    //     let len = 17 - (mainArr.slice(i, i + chunkSize17)).length;
                    //     chunkData.push({ data: chunks, length: len });
                    // }
                    responseData.push({ data: datas, additional: { length: length, clr: clr, dia: dia, f: f, img: img, misc: misc, pages: arrofchunk } });

                }
                setData(responseData);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    // function handlePrint(e) {
    //     e.preventDefault();
    //     window.print();
    // }

    // const handleImageError = (e) => {
    //     e.target.src = require('../../assets/img/default.jpg');
    // };

    const handleImageLoad = (eve, i, dataLen) => {

        // if (i === dataLen - 1) {
        //     setTimeout(window.print(), 5000);
        // }
    };
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
                    <div className='bag5Afinal'>
                        {Array.from({ length: queries?.pageStart }, (_, index) => (
                            index > 0 && <div key={index} className="container5A" style={{ border: "0px" }}></div>
                        ))}
                        {
                            data?.length > 0 && data.map((e, i) => {
                                return (
                                    <>
                                        {
                                            e?.additional?.pages?.length > 0 ? e?.additional?.pages.map((ele, index) => {
                                                return (
                                                    <>
                                                        <div className='print5A' key={index}>
                                                            <div className='container5A'>
                                                                <div className='bag5A'>
                                                                    <div className='flex5A'>
                                                                        <div className='header5A'>
                                                                            <div className='head5A'>
                                                                                <div className='head5Ajob'>
                                                                                    <div>{e?.data?.rd[0]?.serialjobno}</div>
                                                                                    <div>{e?.data?.rd[0]?.Designcode}</div>
                                                                                    <div className='pr5A'>{e?.data?.rd[0]?.MetalType} {e?.data?.rd[0]?.MetalColorCo}</div>
                                                                                    {/* <div>{e?.data?.rd[0]?.MetalColorCo}</div> */}
                                                                                </div>
                                                                                <div className='head5Ainfo'>
                                                                                    <div className='info5Amid'><p className='f5A diffColor' >CUST.</p><p className='f5A'>{e?.data?.rd[0]?.CustomerCode}</p></div>
                                                                                    <div className='info5Amid'><p className='f5A diffColor' >ORD. DT.</p><p className='f5A'>{e?.data?.rd[0]?.orderDatef ?? ''}</p></div>
                                                                                    <div className='info5Aend'><p className='f5A diffColor'>DEL. DT.</p><p className='f5A'>{e?.data?.rd[0]?.promiseDatef ?? ''}</p></div>
                                                                                    <div className='info5Alast'><p className='f5A diffColor' style={{ borderRight: "0px" }}>SIZE</p><p className='f5A' style={{ borderRight: "0px" }}>{e?.data?.rd[0]?.Size}</p></div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className='section5A'>
                                                                            <div className='seaction5AheadA'>
                                                                                <div className='seaction5AheadCode'>CODE</div>
                                                                                <div className='seaction5AheadSize'>SIZE</div>
                                                                                <div className='seaction5AheadPcs'>PCS</div>
                                                                                <div className='seaction5AheadWT'>WT</div>
                                                                                <div className='seaction5AheadPcs'>PCS</div>
                                                                                <div className='seaction5AheadWT'>WT</div>
                                                                            </div>
                                                                            {
                                                                                ele?.data.map((a, i) => {
                                                                                    return (
                                                                                        <>
                                                                                            {
                                                                                                a.MasterManagement_DiamondStoneTypeid === 5
                                                                                                    ?
                                                                                                    <div className='seaction5Amid' key={i}>
                                                                                                        <div className='seaction5Ahead' style={{ fontWeight: "normal" }}>
                                                                                                            {/* <div className='seaction5AheadCode' style={{ width: "138px" }}>{a?.Shapename}</div> */}
                                                                                                            {/* <div className='seaction5AheadCode' style={{ width: "138px" }}>{a?.Shapename + " "+ a?.ColorName}</div> */}
                                                                                                            <div className='seaction5AheadCode' style={{ width: "138px" }}>{a?.LimitedShapeQualityColorCode} {a?.Quality} {a?.ColorName}</div>
                                                                                                            <div className='seaction5AheadPcs'>{a?.ActualPcs}</div>
                                                                                                            <div className='seaction5AheadWT'>{a?.ActualWeight?.toFixed(3)}</div>
                                                                                                            <div className='seaction5AheadPcs'></div>
                                                                                                            <div className='seaction5AheadWT'></div>
                                                                                                        </div>
                                                                                                    </div> : <div className='seaction5Amid' key={i}>
                                                                                                        <div className='seaction5Ahead' style={{ fontWeight: "normal" }}>
                                                                                                            {/* { a?.Shapename === "TOTAL" ? <div className='seaction5AheadCode'>{a?.Shapename}</div> : <div className='seaction5AheadCode'>{a?.LimitedShapeQualityColorCode}</div>}   */}
                                                                                                            <div className='seaction5AheadCode'>{a?.LimitedShapeQualityColorCode}</div>
                                                                                                            <div className='seaction5AheadSize'>{a?.Sizename}</div>
                                                                                                            <div className='seaction5AheadPcs'>{a?.ActualPcs}</div>
                                                                                                            <div className='seaction5AheadWT'>{a?.ActualWeight?.toFixed(3)}</div>
                                                                                                            <div className='seaction5AheadPcs'></div>
                                                                                                            <div className='seaction5AheadWT'></div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                            }

                                                                                        </>
                                                                                    );
                                                                                })
                                                                            }

                                                                            {
                                                                                Array.from({ length: ele?.length }, (_, index) => (
                                                                                    <div className='seaction5Amid' key={index}>
                                                                                        <div className='seaction5Ahead' style={{ fontWeight: "normal" }}>
                                                                                            <div className='seaction5AheadCode'></div>
                                                                                            <div className='seaction5AheadSize'></div>
                                                                                            <div className='seaction5AheadPcs'></div>
                                                                                            <div className='seaction5AheadWT'></div>
                                                                                            <div className='seaction5AheadPcs'></div>
                                                                                            <div className='seaction5AheadWT'></div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                        <div className='footer5A imp5A'>
                                                                            <p className='footer5AIns'> <p className='footer5AIns' style={{ color: "red", paddingLeft: "2px", lineHeight: "11px" }}>CAST INS.{
                                                                                (((e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction).length > 0)) ? ((e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction == (null || 'null') ? '' : e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction)?.slice(0, 179))
                                                                                    : ''}</p></p>
                                                                        </div>
                                                                    </div>
                                                                    <div className='aside5A'>
                                                                        <div className='imgPart5A'>
                                                                            <div className='img5A'>
                                                                                <img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} id="img5A" alt="" onError={e => handleImageError(e)} loading="eager" onLoad={eve => handleImageLoad(eve, i, data?.length)} />
                                                                            </div>
                                                                            <div className='barcodeInfo5A'>
                                                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                                                    <div className='diaInfo5A'>
                                                                                        <div className='diaflex5A'><p className='f5Aval'>DIAMOND</p><p className='diaVal5A'>{e?.additional?.dia?.ActualPcs}/{e?.additional?.dia?.ActualWeight?.toFixed(3)}</p> </div>
                                                                                    </div>
                                                                                    <div className='diaInfo5A'>
                                                                                        <div className='diaflex5A'><p className='f5Aval' style={{ height: "33px" }}></p> </div>
                                                                                    </div>
                                                                                    <div className='diaInfo5A'>
                                                                                        <div className='diaflex5A'><p className='f5Aval'>CS</p><p className='diaVal5A'>{e?.additional?.clr?.ActualPcs}/{e?.additional?.clr?.ActualWeight?.toFixed(3)}</p> </div>
                                                                                    </div>
                                                                                    <div className='diaInfo5A'>
                                                                                        <div className='diaflex5A'><p className='f5Aval' style={{ height: "33px" }}></p> </div>
                                                                                    </div>
                                                                                    <div className='diaInfo5A'>
                                                                                        <div className='diaflex5A'><p className='f5Aval'>METAL</p><p className='diaVal5A'>{e?.data?.rd[0]?.netwt?.toFixed(3)}</p> </div>
                                                                                    </div>
                                                                                    <div style={{ borderRight: "1px solid #989898", height: "39px" }}></div>
                                                                                </div>
                                                                                <div className='barcode5A'>
                                                                                    {(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd[0]?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd[0]?.serialjobno} />}</>}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </>
                                                );
                                            }) : <div className='print5A'>
                                                <div className='container5A'>
                                                    <div className='bag5A'>
                                                        <div className='flex5A'>
                                                            <div className='header5A'>
                                                                <div className='head5A'>
                                                                    <div className='head5Ajob'>
                                                                        <div>{e?.data?.rd[0]?.serialjobno}</div>
                                                                        <div>{e?.data?.rd[0]?.Designcode}</div>
                                                                        <div className='pr5A'>{e?.data?.rd[0]?.MetalType} {e?.data?.rd[0]?.MetalColorCo}</div>
                                                                        {/* <div>{e?.data?.rd[0]?.MetalColorCo}</div> */}
                                                                    </div>
                                                                    <div className='head5Ainfo'>
                                                                        <div className='info5Amid'><p className='f5A diffColor' >CUST.</p><p className='f5A'>{e?.data?.rd[0]?.CustomerCode}</p></div>
                                                                        <div className='info5Amid'><p className='f5A diffColor' >ORD. DT.</p><p className='f5A'>{e?.data?.rd[0]?.orderDatef ?? ''}</p></div>
                                                                        <div className='info5Aend'><p className='f5A diffColor'>DEL. DT.</p><p className='f5A'>{e?.data?.rd[0]?.promiseDatef ?? ''}</p></div>
                                                                        <div className='info5Alast'><p className='f5A diffColor' style={{ borderRight: "0px" }}>SIZE</p><p className='f5A' style={{ borderRight: "0px" }}>{e?.data?.rd[0]?.Size}</p></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='section5A'>
                                                                <div className='seaction5AheadA'>
                                                                    <div className='seaction5AheadCode'>CODE</div>
                                                                    <div className='seaction5AheadSize'>SIZE</div>
                                                                    <div className='seaction5AheadPcs'>PCS</div>
                                                                    <div className='seaction5AheadWT'>WT</div>
                                                                    <div className='seaction5AheadPcs'>PCS</div>
                                                                    <div className='seaction5AheadWT'>WT</div>
                                                                </div>

                                                                {
                                                                    Array.from({ length: 17 }, (_, index) => (
                                                                        <div className='seaction5Amid' key={index}>
                                                                            <div className='seaction5Ahead' style={{ fontWeight: "normal" }}>
                                                                                <div className='seaction5AheadCode'></div>
                                                                                <div className='seaction5AheadSize'></div>
                                                                                <div className='seaction5AheadPcs'></div>
                                                                                <div className='seaction5AheadWT'></div>
                                                                                <div className='seaction5AheadPcs'></div>
                                                                                <div className='seaction5AheadWT'></div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                            <div className='footer5A imp5A'>
                                                                <p className='footer5AIns'> <p className='footer5AIns' style={{ color: "red", paddingLeft: "2px", lineHeight: "11px" }}>CAST INS.{((e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction).length > 0) ? ((e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction == (null || 'null') ? '' : e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction))?.slice(0, 179) : ''}</p></p>
                                                            </div>
                                                        </div>
                                                        <div className='aside5A'>
                                                            <div className='imgPart5A'>
                                                                <div className='img5A'>
                                                                    <img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} id="img5A" alt="" onError={e => handleImageError(e)} loading="eager" onLoad={eve => handleImageLoad(eve, i, data?.length)} />
                                                                </div>
                                                                <div className='barcodeInfo5A'>
                                                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                                                        <div className='diaInfo5A'>
                                                                            <div className='diaflex5A'><p className='f5Aval'>DIAMOND</p><p className='diaVal5A'>{e.additional.dia.ActualPcs}/{e.additional.dia.ActualWeight.toFixed(2)}</p> </div>
                                                                        </div>
                                                                        <div className='diaInfo5A'>
                                                                            <div className='diaflex5A'><p className='f5Aval' style={{ height: "33px" }}></p> </div>
                                                                        </div>
                                                                        <div className='diaInfo5A'>
                                                                            <div className='diaflex5A'><p className='f5Aval'>CS</p><p className='diaVal5A'>{e.additional.clr.ActualPcs}/{e.additional.clr.ActualWeight.toFixed(2)}</p> </div>
                                                                        </div>
                                                                        <div className='diaInfo5A'>
                                                                            <div className='diaflex5A'><p className='f5Aval' style={{ height: "33px" }}></p> </div>
                                                                        </div>
                                                                        <div className='diaInfo5A'>
                                                                            <div className='diaflex5A'><p className='f5Aval'>METAL</p><p className='diaVal5A'>{e.additional.misc.ActualPcs}/{e.additional.misc.ActualWeight.toFixed(2)}</p> </div>
                                                                        </div>
                                                                        <div style={{ borderRight: "1px solid #989898", height: "39px" }}></div>
                                                                    </div>
                                                                    <div className='barcode5A'>
                                                                        {(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd[0]?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd[0]?.serialjobno} />}</>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        }
                                        <div className='container5A'>
                                            <div className='header5AD'>
                                                <div className='sectionHead5A'>
                                                    <div className='head5AjobD'>
                                                        <div>{e?.data?.rd[0]?.serialjobno}</div>
                                                        <div>{e?.data?.rd[0]?.Designcode}</div>
                                                        <div className='pr5A'>{e?.data?.rd[0]?.MetalType} {e?.data?.rd[0]?.MetalColorCo}</div>
                                                        {/* <div>{e?.data?.rd[0]?.MetalColorCo}</div> */}
                                                    </div>
                                                    <div className='mat5AD'>
                                                        <div className='border5A' style={{ color: "#c7c7c7", textAlign: "center" }}>PRIORITY</div>
                                                        <div className='border5A' style={{ color: "#c7c7c7", textAlign: "center" }}>LOC.</div>
                                                        <div className='border5A' style={{ borderRight: "0px", color: "#c7c7c7", textAlign: "center" }}>Q.C.</div>
                                                    </div>
                                                    <div className='mat5ADE'>
                                                        <div className='border5A hw5A'><p className='f5ADuplicate'>SALES REP.</p> <p className='f5ADuplicate'>{e?.data?.rd[0]?.SalesrepCode}</p></div>
                                                        <div className='border5A hw5A'><p className='f5ADuplicate'>FROSTING</p> <p className='f5ADuplicate'>{e?.data?.rd[0]?.MetalFrosting}</p></div>
                                                        <div className='border5A hw5A' style={{ borderRight: "0px" }}><p className='f5ADuplicate'>ENAMELING</p><p className='f5ADuplicate'>{e?.data?.rd[0]?.Enamelling}</p></div>
                                                    </div>
                                                    <div className='mat5ADE'>
                                                        <div className='border5A hw5A'><p className='f5ADuplicate'>LAB</p> <p className='f5ADuplicate'>{e?.data?.rd[0]?.MasterManagement_labname}</p></div>
                                                        <div className='border5A hw5A'><p className='f5ADuplicate'>SNAP</p> <p className='f5ADuplicate'>{e?.data?.rd[0]?.Management_ProductImageType}</p></div>
                                                        <div className='border5A hw5A' style={{ borderRight: "0px" }}><p className='f5ADuplicate'>MAKETYPE</p><p className='f5ADuplicate'>{e?.data?.rd[0]?.mastermanagement_maketypename}</p> </div>
                                                    </div>
                                                    <div className='mat5AD'>
                                                        <div className='border5A' style={{ color: "#c7c7c7", textAlign: "center" }}>TR NO.</div>
                                                        <div className='border5A' style={{ color: "#c7c7c7", textAlign: "center" }}>TR NO.</div>
                                                        <div className='border5A' style={{ borderRight: "0px", color: "#c7c7c7", textAlign: "center" }}>TR NO.</div>
                                                    </div>
                                                    <div className='mat5AD' style={{ borderBottom: "0px" }}>
                                                        <div className='border5A' style={{ color: "#c7c7c7", textAlign: "center" }}>TR WT.</div>
                                                        <div className='border5A' style={{ color: "#c7c7c7", textAlign: "center" }}>TR WT.</div>
                                                        <div className='border5A' style={{ borderRight: "0px", color: "#c7c7c7", textAlign: "center" }}>TR WT.</div>
                                                    </div>
                                                </div>
                                                <div className='img5AD'><img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} id="img5A" alt="" onError={e => handleImageError(e)} loading="eager" onLoad={eve => handleImageLoad(eve, i, data?.length)} /></div>
                                            </div>
                                            <div className='enteryBarcode5AD'>
                                                <div className='enteryBarcode3ADyn'>
                                                    <div className='entry3AHead' style={{ fontWeight: "normal", width: "290px" }}>
                                                        <div className='rmcode3a' style={{ width: "43px", display: "flex", justifyContent: "center" }}>DEPT </div>
                                                        <div className='rmcode3a' style={{ width: "52px", display: "flex", justifyContent: "center" }}>ISSUE</div>
                                                        <div className='rmcode3a' style={{ width: "52px", display: "flex", justifyContent: "center" }}>RECEIVE</div>
                                                        <div className='rmcode3a' style={{ width: "52px", display: "flex", justifyContent: "center" }}>SCRAP</div>
                                                        <div className='rmcode3a' style={{ width: "37px", display: "flex", justifyContent: "center" }}>PCS</div>
                                                        <div className='rmcode3a' style={{ borderRight: "0px", width: "56px", display: "flex", justifyContent: "center" }}>WORKER</div>
                                                    </div>
                                                    <div className='entryheader3A'>
                                                        <div className='entry3AHeadD' style={{ fontWeight: "normal" }}>
                                                            <div className='rmcode3aD' style={{ width: "46px" }}>GRD </div>
                                                            <div className='rmcode3aD' style={{ width: "46px" }}>FIL</div>
                                                            <div className='rmcode3aD' style={{ width: "46px" }}>PPL</div>
                                                            <div className='rmcode3aD' style={{ width: "46px" }}>SET.	</div>
                                                            <div className='rmcode3aD' style={{ width: "46px" }}>ASM</div>
                                                            <div className='rmcode3aD' style={{ width: "46px" }}>FPL</div>
                                                            <div className='rmcode3aD' style={{ width: "46px" }}>PLT</div>
                                                            <div className='rmcode3aD' style={{ width: "46px" }}></div>
                                                            <div className='rmcode3aD' style={{ borderBottom: "1px solid #989898", width: "46px" }}></div>
                                                        </div>
                                                        {
                                                            <div>
                                                                {
                                                                    Array.from({ length: 9 }, (_, index) => (
                                                                        <div className='entry3AHeadEntry' style={{ fontWeight: "normal" }}>
                                                                            <div className='rmcode3aDE' style={{ width: "52px" }}></div>
                                                                            <div className='rmcode3aDE' style={{ width: "51px" }}></div>
                                                                            <div className='rmcode3aDE' style={{ width: "51px" }}></div>
                                                                            <div className='rmcode3aDE' style={{ width: "37px" }}></div>
                                                                            <div className='rmcode3aDE' style={{ width: "56px", borderRight: "0px" }}></div>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                    <div>
                                                        <div className='ins5Afooter' ><p style={{ fontSize: "12px" }}>SLS. INS.{ }</p></div>
                                                        <div className='ins5Afooter' ><p style={{ fontSize: "12px" }}>PRD. INS.{ }</p></div>
                                                        <div className='ins5Afooter' style={{ borderBottom: "0px" }}><p style={{ fontSize: "12px" }}>QC. INS.{ }</p></div>
                                                    </div>
                                                </div>
                                                <div className='barcode5AD'>{(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd[0]?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd[0]?.serialjobno} />}</>}</div>
                                            </div>
                                        </div>
                                    </>
                                );
                            })
                        }
                    </div>
                </>
            }
        </>

    );
};

export default BagPrint5A;
