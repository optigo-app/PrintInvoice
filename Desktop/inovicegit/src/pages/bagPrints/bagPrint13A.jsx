import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "../../assets/css/bagprint/print13A.css";
import { formatDate } from '../../GlobalFunctions/DateFormat';
import { GetChunkData } from '../../GlobalFunctions/GetChunkData';
import { GetData } from '../../GlobalFunctions/GetData';
import { handleImageError } from '../../GlobalFunctions/HandleImageError';
import { handlePrint } from '../../GlobalFunctions/HandlePrint';
import BarcodeGenerator from '../../components/BarcodeGenerator';
import Loader from '../../components/LoaderBag';

const BagPrint13A = ({ queries, headers }) => {
    const [data, setData] = useState([]);
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    let jobs = queryParams.str_srjobno;
    if (Object.keys(queryParams).length !== 0) {
        jobs = jobs.split(",");
    }

    const [print, setPrint] = useState(jobs);
    const chunkSize17 = 16;

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
                      // 
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
                        Shapename: "TOTAL",
                        Sizename: "",
                        ActualPcs: 0,
                        ActualWeight: 0,
                        // heading: "COLOR STONE DETAIL"
                    };
                    let dia = {
                        Shapename: "TOTAL",
                        Sizename: "",
                        ActualPcs: 0,
                        ActualWeight: 0,
                        // heading: "DIAMOND DETAIL"
                    };
                    let misc = {
                        Shapename: "TOTAL",
                        Sizename: "",
                        ActualPcs: 0,
                        ActualWeight: 0,
                        // heading: "MISC DETAIL"
                    };
                    let f = {
                        Shapename: "TOTAL",
                        Sizename: "",
                        ActualPcs: 0,
                        ActualWeight: 0,
                        // heading: "FINDING DETAIL"
                    };
                    let ArrofSevenSize = [];
                    //arr for colorstone
                    let ArrofFiveSize = [];
                    let ArrofMISize = [];
                    let ArrofFSize = [];

                    datas?.rd1?.map((e, i) => {
                        if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
                            length++;
                        }
                        if (e?.MasterManagement_DiamondStoneTypeid === 3) {
                            ArrofSevenSize.push(e);
                            dia.ActualPcs = dia.ActualPcs + e?.ActualPcs;
                            dia.ActualWeight = dia.ActualWeight + e?.ActualWeight;
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
                            ArrofFiveSize.push(e);
                            clr.ActualPcs = clr.ActualPcs + e?.ActualPcs;
                            clr.ActualWeight = clr.ActualWeight + e?.ActualWeight;
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 5) {
                            ArrofFSize.push(e);
                            f.ActualPcs = f.ActualPcs + e?.ActualPcs;
                            f.ActualWeight = f.ActualWeight + e?.ActualWeight;
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
                            ArrofMISize.push(e);
                            misc.ActualPcs = misc.ActualPcs + e?.ActualPcs;
                            misc.ActualWeight = misc.ActualWeight + e?.ActualWeight;
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
                    let imagePath = queryParams?.imagepath;
                    imagePath = atob(queryParams?.imagepath);


                    let img = imagePath + datas?.rd[0]?.ThumbImagePath;
                    let arrofchunk = GetChunkData(chunkSize17, mainArr);
                    // for (let i = 0; i < mainArr.length; i += chunkSize17) {
                    //     const chunks = mainArr.slice(i, i + chunkSize17);
                    //     let len = 16 - (mainArr.slice(i, i + chunkSize17)).length;
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
                data.length === 0 ? <Loader /> : <><div className="print_btn"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
                    Print
                </button></div>


                    <div className='bag13Afinal'>
                        {Array.from({ length: queries.pageStart }, (_, index) => (
                            index > 0 && <div key={index} className="container13A" style={{border:"0px"}}></div>
                        ))}
                        {
                            data?.length > 0 && data.map((e, i) => {
                                return (
                                    <>
                                        {
                                            e?.additional?.pages?.length > 0 ? e?.additional?.pages.map((ele, index) => {
                                                return (
                                                    <>
                                                        <div className='container13A' key={index}>
                                                            {/* <div className=''> */}
                                                            {/* <div className='container13A'> */}
                                                            <div className='bag13A'>
                                                                <div className='flex13A'>
                                                                    <div className='header13A'>
                                                                        <div className='head13A'>
                                                                            <div className='head13Ajob'>
                                                                                <div>{e?.data?.rd[0]?.serialjobno}</div>
                                                                                <div>{e?.data?.rd[0]?.Designcode}</div>
                                                                                <div>{e?.data?.rd[0]?.MetalType} {e?.data?.rd[0]?.MetalColorCo}</div>
                                                                                {/* <div>{e?.data?.rd[0]?.MetalColorCo}</div> */}
                                                                            </div>
                                                                            <div className='head13Ainfo'>
                                                                                <div className='info13Amid'><p className='f13A diffColor' >CUST.</p><p className='f13A'>{e?.data?.rd[0]?.CustomerCode}</p></div>
                                                                                <div className='info13Amid'><p className='f13A diffColor' >ORD. DT.</p><p className='f13A'>{e?.data?.rd[0]?.orderDatef ?? ''}</p></div>
                                                                                <div className='info13Aend'><p className='f13A diffColor'>DEL. DT.</p><p className='f13A'>{e?.data?.rd[0]?.promiseDatef ?? ''}</p></div>
                                                                                <div className='info13Alast'><p className='f13A diffColor' style={{ borderRight: "0px" }}>SIZE</p><p className='f13A' style={{ borderRight: "0px" }}>{e?.data?.rd[0]?.Size}</p></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='section13A'>
                                                                        <div className='seaction13AheadA'>
                                                                            <div className='seaction13AheadCode'>CODE</div>
                                                                            <div className='seaction13AheadSize'>SIZE</div>
                                                                            <div className='seaction13AheadPcs'>PCS</div>
                                                                            <div className='seaction13AheadWT'>WT</div>
                                                                            <div className='seaction13AheadPcs'>PCS</div>
                                                                            <div className='seaction13AheadWT'>WT</div>
                                                                        </div>
                                                                        <div className='seaction13AheadA'>
                                                                            <div className='seaction13AheadCode' style={{ fontWeight: "normal" }}>{e?.data?.rd[0]?.MetalType} {e?.data?.rd[0]?.MetalColorCo}</div>
                                                                            <div className='seaction13AheadSize'></div>
                                                                            <div className='seaction13AheadPcs'></div>
                                                                            <div className='seaction13AheadWT'></div>
                                                                            <div className='seaction13AheadPcs'></div>
                                                                            <div className='seaction13AheadWT'></div>
                                                                        </div>
                                                                        {
                                                                            ele?.data.map((a, i) => {

                                                                                return (
                                                                                    <>
                                                                                        {
                                                                                            a.MasterManagement_DiamondStoneTypeid === 5
                                                                                                ?
                                                                                                <div className='seaction13Amid' key={i}>
                                                                                                    <div className='seaction13Ahead' style={{ fontWeight: "normal" }}>
                                                                                                        <div className='seaction13AheadCode' style={{ width: "134px" }}>{a?.ConcatedFullShapeQualityColorCode}</div>
                                                                                                        <div className='seaction13AheadPcs'>{a?.ActualPcs}</div>
                                                                                                        <div className='seaction13AheadWT'>{a?.ActualWeight?.toFixed(3)}</div>
                                                                                                        <div className='seaction13AheadPcs'></div>
                                                                                                        <div className='seaction13AheadWT'></div>
                                                                                                    </div>
                                                                                                </div> : <div className='seaction13Amid' key={i}>
                                                                                                    <div className='seaction13Ahead' style={{ fontWeight: "normal" }}>
                                                                                                        {/* { a?.Shapename === "TOTAL" ? <div className='seaction13AheadCode'>{a?.Shapename}</div> : <div className='seaction13AheadCode'>{a?.ConcatedFullShapeQualityColorCode}</div> } */}
                                                                                                        {a?.Shapename === "TOTAL" ? <div className='seaction13AheadCode'>{a?.Shapename}</div> : <div className='seaction13AheadCode'>{a?.LimitedShapeQualityColorCode}</div>}
                                                                                                        <div className='seaction13AheadSize'>{a?.Sizename}</div>
                                                                                                        <div className='seaction13AheadPcs'>{a?.ActualPcs}</div>
                                                                                                        <div className='seaction13AheadWT'>{a?.ActualWeight?.toFixed(3)}</div>
                                                                                                        <div className='seaction13AheadPcs'></div>
                                                                                                        <div className='seaction13AheadWT'></div>
                                                                                                    </div>
                                                                                                </div>
                                                                                        }

                                                                                    </>
                                                                                );
                                                                            })
                                                                        }
                                                                        {
                                                                            Array.from({ length: ele?.length }, (_, index) => (
                                                                                <div className='seaction13Amid' key={index}>
                                                                                    <div className='seaction13Ahead' style={{ fontWeight: "normal" }}>
                                                                                        <div className='seaction13AheadCode'></div>
                                                                                        <div className='seaction13AheadSize'></div>
                                                                                        <div className='seaction13AheadPcs'></div>
                                                                                        <div className='seaction13AheadWT'></div>
                                                                                        <div className='seaction13AheadPcs'></div>
                                                                                        <div className='seaction13AheadWT'></div>
                                                                                    </div>
                                                                                </div>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                    <div className='footer13A imp13A'>
                                                                        <p className='footer13AIns'> <p className='footer13AIns' style={{ color: "red", paddingLeft: "2px", lineHeight: "11px" }}>CAST INS.{(e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction)?.length > 0 ? ((e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction == (null || 'null') ? '' : (e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction)?.slice(0, 230))) : ''}</p></p>
                                                                    </div>
                                                                </div>
                                                                <div className='aside13A'>
                                                                    <div className='imgPart13A'>
                                                                        <div className='img13A'>
                                                                            <img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} id="img13A" alt="" onError={e => handleImageError(e)} onLoad={eve => handleImageLoad(eve, i, data?.length)} loading="eager" />
                                                                        </div>
                                                                        <div className='barcodeInfo13A'>
                                                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                                                <div className='diaInfo13A'>
                                                                                    <div className='diaflex13A'><p className='f13Aval'>DIAMOND</p><p className='diaVal13A'>{e?.additional?.dia?.ActualPcs}/{e?.additional?.dia?.ActualWeight.toFixed(3)}</p> </div>
                                                                                </div>
                                                                                <div className='diaInfo13A'>
                                                                                    <div className='diaflex13A'><p className='f13Aval' style={{ height: "33px" }}></p> </div>
                                                                                </div>
                                                                                <div className='diaInfo13A'>
                                                                                    <div className='diaflex13A'><p className='f13Aval'>CS</p><p className='diaVal13A'>{e?.additional?.clr?.ActualPcs}/{e?.additional?.clr?.ActualWeight.toFixed(3)}</p> </div>
                                                                                </div>
                                                                                <div className='diaInfo13A'>
                                                                                    <div className='diaflex13A'><p className='f13Aval' style={{ height: "33px" }}></p> </div>
                                                                                </div>
                                                                                <div className='diaInfo13A'>
                                                                                    <div className='diaflex13A'><p className='f13Aval'>METAL</p><p className='diaVal13A'>{e?.data?.rd[0]?.netwt.toFixed(3)}</p> </div>
                                                                                </div>
                                                                                <div style={{ borderRight: "1px solid #989898", height: "39px" }}></div>
                                                                            </div>
                                                                            <div className='barcode13A'>
                                                                                {(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd[0]?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd[0]?.serialjobno} />}</>}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* </div> */}

                                                        </div>
                                                    </>
                                                );
                                            }) :
                                                <div className='container13A'>
                                                    <div className='bag13A'>
                                                        <div className='flex13A'>
                                                            <div className='header13A'>
                                                                <div className='head13A'>
                                                                    <div className='head13Ajob'>
                                                                        <div>{e?.data?.rd[0]?.serialjobno}</div>
                                                                        <div>{e?.data?.rd[0]?.Designcode}</div>
                                                                        <div>{e?.data?.rd[0]?.MetalType}</div>
                                                                        <div>{e?.data?.rd[0]?.MetalColorCo}</div>
                                                                    </div>
                                                                    <div className='head13Ainfo'>
                                                                        <div className='info13Amid'><p className='f13A diffColor' >CUST.</p><p className='f13A'>{e?.data?.rd[0]?.CustomerCode}</p></div>
                                                                        <div className='info13Amid'><p className='f13A diffColor' >ORD. DT.</p><p className='f13A'>{e?.data?.rd[0]?.orderDatef ?? ''}</p></div>
                                                                        <div className='info13Aend'><p className='f13A diffColor'>DEL. DT.</p><p className='f13A'>{e?.data?.rd[0]?.promiseDatef ?? ''}</p></div>
                                                                        <div className='info13Alast'><p className='f13A diffColor' style={{ borderRight: "0px" }}>SIZE</p><p className='f13A' style={{ borderRight: "0px" }}>{e?.data?.rd[0]?.Size}</p></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='section13A'>
                                                                <div className='seaction13AheadA'>
                                                                    <div className='seaction13AheadCode'>CODE</div>
                                                                    <div className='seaction13AheadSize'>SIZE</div>
                                                                    <div className='seaction13AheadPcs'>PCS</div>
                                                                    <div className='seaction13AheadWT'>WT</div>
                                                                    <div className='seaction13AheadPcs'>PCS</div>
                                                                    <div className='seaction13AheadWT'>WT</div>
                                                                </div>

                                                                {
                                                                    Array.from({ length: 17 }, (_, index) => (
                                                                        <div className='seaction13Amid' key={index}>
                                                                            <div className='seaction13Ahead' style={{ fontWeight: "normal" }}>
                                                                                <div className='seaction13AheadCode'></div>
                                                                                <div className='seaction13AheadSize'></div>
                                                                                <div className='seaction13AheadPcs'></div>
                                                                                <div className='seaction13AheadWT'></div>
                                                                                <div className='seaction13AheadPcs'></div>
                                                                                <div className='seaction13AheadWT'></div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                            <div className='footer13A imp13A'>
                                                                <p className='footer13AIns'> <p className='footer13AIns' style={{ color: "red", paddingLeft: "2px", lineHeight: "11px" }}>CUST INS.{(e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction)?.length > 0 ? ((e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction == (null || 'null') ? '' : (e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction)?.slice(0, 230))) : ''}</p></p>
                                                            </div>
                                                        </div>
                                                        <div className='aside13A'>
                                                            <div className='imgPart13A'>
                                                                <div className='img13A'>
                                                                    <img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} id="img13A" alt="" onError={e => handleImageError(e)} loading="eager" onLoad={eve => handleImageLoad(eve, i ,data?.length)} />
                                                                </div>
                                                                <div className='barcodeInfo13A'>
                                                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                                                        <div className='diaInfo13A'>
                                                                            <div className='diaflex13A'><p className='f13Aval'>DIAMOND</p><p className='diaVal13A'>{e?.additional?.dia?.ActualPcs}/{e?.additional?.dia?.ActualWeight.toFixed(2)}</p> </div>
                                                                        </div>
                                                                        <div className='diaInfo13A'>
                                                                            <div className='diaflex13A'><p className='f13Aval' style={{ height: "33px" }}></p> </div>
                                                                        </div>
                                                                        <div className='diaInfo13A'>
                                                                            <div className='diaflex13A'><p className='f13Aval'>CS</p><p className='diaVal13A'>{e?.additional?.clr.ActualPcs}/{e.additional.clr.ActualWeight.toFixed(2)}</p> </div>
                                                                        </div>
                                                                        <div className='diaInfo13A'>
                                                                            <div className='diaflex13A'><p className='f13Aval' style={{ height: "33px" }}></p> </div>
                                                                        </div>
                                                                        <div className='diaInfo13A'>
                                                                            <div className='diaflex13A'><p className='f13Aval'>METAL</p><p className='diaVal13A'>{e.additional.misc.ActualPcs}/{e.additional.misc.ActualWeight.toFixed(2)}</p> </div>
                                                                        </div>
                                                                        <div style={{ borderRight: "1px solid #989898", height: "39px" }}></div>
                                                                    </div>
                                                                    <div className='barcode13A'>
                                                                        {(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd[0]?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd[0]?.serialjobno} />}</>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>


                                        }

                                        <div className='container13A'>
                                            <div className='header13AD'>
                                                <div className='sectionHead13A'>
                                                    <div className='head13AjobD'>
                                                        <div>{e?.data?.rd[0]?.serialjobno}</div>
                                                        <div>{e?.data?.rd[0]?.Designcode}</div>
                                                        <div>{e?.data?.rd[0]?.MetalType} {e?.data?.rd[0]?.MetalColorCo}</div>
                                                        {/* <div>{e?.data?.rd[0]?.MetalColorCo}</div> */}
                                                    </div>
                                                    <div className='mat13AD'>
                                                        <div className='border13A' style={{ color: "#c7c7c7", textAlign: "center", paddingTop: "2px" }}>PRIORITY</div>
                                                        <div className='border13A' style={{ color: "#c7c7c7", textAlign: "center", paddingTop: "2px" }}>LOC.</div>
                                                        <div className='border13A' style={{ borderRight: "0px", color: "#c7c7c7", textAlign: "center", paddingTop: "2px" }}>Q.C.</div>
                                                    </div>
                                                    <div className='mat13ADE'>
                                                        <div className='border13A hw13A'><p className='f13ADuplicate'>SALES REP.</p> <p className='f13ADuplicate'>{e?.data?.rd[0]?.SalesrepCode}</p></div>
                                                        <div className='border13A hw13A'><p className='f13ADuplicate'>FROSTING</p> <p className='f13ADuplicate'>{e?.data?.rd[0]?.MetalFrosting}</p></div>
                                                        <div className='border13A hw13A' style={{ borderRight: "0px" }}><p className='f13ADuplicate'>ENAMELING</p><p className='f13ADuplicate'>{e?.data?.rd[0]?.Enamelling}</p></div>
                                                    </div>
                                                    <div className='mat13ADE'>
                                                        <div className='border13A hw13A'><p className='f13ADuplicate' style={{ fontSize: "8px", fontWeight: "bold" }}>LAB</p><p className='f13ADuplicate' style={{ fontSize: "7px" }}>{e?.data?.rd[0]?.MasterManagement_labname}</p><p className='f13ADuplicate' style={{ fontSize: "7px" }}>PO {e?.data?.rd[0]?.PO}</p></div>
                                                        <div className='border13A hw13A'><p className='f13ADuplicate'>SNAP</p><p className='f13ADuplicate'>{e?.data?.rd[0]?.MasterManagement_ProductImageType}</p></div>
                                                        <div className='border13A hw13A' style={{ borderRight: "0px" }}><p className='f13ADuplicate'>MAKETYPE</p><p className='f13ADuplicate'>{e?.data?.rd[0]?.mastermanagement_maketypename}</p> </div>
                                                    </div>
                                                    <div className='mat13AD'>
                                                        <div className='border13A' style={{ color: "#c7c7c7", textAlign: "center", paddingTop: "2px" }}>TR NO.</div>
                                                        <div className='border13A' style={{ color: "#c7c7c7", textAlign: "center", paddingTop: "2px" }}>TR NO.</div>
                                                        <div className='border13A' style={{ borderRight: "0px", color: "#c7c7c7", textAlign: "center", paddingTop: "2px" }}>TR NO.</div>
                                                    </div>
                                                    <div className='mat13AD' style={{ borderBottom: "0px" }}>
                                                        <div className='border13A' style={{ color: "#c7c7c7", textAlign: "center", paddingTop: "2px" }}>TR WT.</div>
                                                        <div className='border13A' style={{ color: "#c7c7c7", textAlign: "center", paddingTop: "2px" }}>TR WT.</div>
                                                        <div className='border13A' style={{ borderRight: "0px", color: "#c7c7c7", textAlign: "center", paddingTop: "2px" }}>TR WT.</div>
                                                    </div>
                                                </div>
                                                <div className='img13AD'><img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} id="img13A" alt="" onError={e => handleImageError(e)} loading="eager" onLoad={eve => handleImageLoad(eve, i, data?.length)} /></div>
                                            </div>
                                            <div className='enteryBarcode13AD'>
                                                <div className='enteryBarcode3ADyn'>
                                                    <div className='entry3AHead' style={{ fontWeight: "normal", width: "290px" }}>
                                                        <div className='rmcode3a' style={{ width: "43px" }}>DEPT </div>
                                                        <div className='rmcode3a' style={{ width: "52px" }}>ISSUE</div>
                                                        <div className='rmcode3a' style={{ width: "52px" }}>RECEIVE</div>
                                                        <div className='rmcode3a' style={{ width: "52px" }}>SCRAP</div>
                                                        <div className='rmcode3a' style={{ width: "37px" }}>PCS</div>
                                                        <div className='rmcode3a' style={{ borderRight: "0px", width: "56px" }}>WORKER</div>
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
                                                            <div className='rmcode3aD' style={{ width: "46px" }}>ENM</div>
                                                            <div className='rmcode3aD' style={{ borderBottom: "1px solid #989898", width: "46px" }}>F.G.</div>
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
                                                        <div className='ins13Afooter'><p style={{ fontSize: "13px" }}>SLS. INS.{ }</p></div>
                                                        <div className='ins13Afooter'><p style={{ fontSize: "13px" }}>PRD. INS.{ }</p></div>
                                                        <div className='ins13Afooter' style={{ borderBottom: "0px" }}><p style={{ fontSize: "13px" }}>QC. INS.{ }</p></div>
                                                    </div>
                                                </div>
                                                <div className='barcode13AD'>{(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd[0]?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd[0]?.serialjobno} />}</>}</div>
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

export default BagPrint13A;
