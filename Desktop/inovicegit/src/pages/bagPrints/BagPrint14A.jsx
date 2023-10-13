import axios from 'axios';
import queryString from 'query-string';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import "../../assets/css/bagprint/print14.css";
import { formatDate } from '../../GlobalFunctions/DateFormat';
import { GetChunkData } from '../../GlobalFunctions/GetChunkData';
import { GetData } from '../../GlobalFunctions/GetData';
import { handleImageError } from '../../GlobalFunctions/HandleImageError';
import { handlePrint } from '../../GlobalFunctions/HandlePrint';
import BarcodeGenerator from '../../components/BarcodeGenerator';
import Loader from '../../components/LoaderBag';

function BagPrint14A({ queries, headers }) {
    const [data, setData] = useState([]);
    const location = useLocation();
    const queryParams = queryString.parse(location?.search);
    let jobs = queryParams?.str_srjobno;
    if (Object.keys(queryParams)?.length !== 0) {
        jobs = jobs.split(",");
    }

    const [print, setPrint] = useState(jobs);
    const chunkSize17 = 11;

    useEffect(() => {
        if (Object.keys(queryParams)?.length !== 0) {
            atob(queryParams?.imagepath);
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
                    // let p_tag = { "SerialJobno": `${print[url]}`, "customerid": `${queries?.custid}`, "BagPrintName": `${queries?.printname}` };
                    // let jsonString = JSON.stringify(p_tag);
                    // let base64String = btoa(jsonString);
                    // let Body = {
                    //     "con": `{\"id\":\"\",\"mode\":\"${queries?.printname}\",\"appuserid\":\"${queries?.appuserid}\"}`,
                    //     "p": `${base64String}`,
                    //     "f": `${queries?.appuserid} ${queries?.printname}`
                    // };
                    // let urls = atob(queries?.url);
                    // const response = await axios.post(urls, Body, { headers: headers });
                    // let datas = JSON.parse(response?.data?.d);

                    let length = 0;
                    let total = {
                        ActualPcs: 0,
                        ActualWeight: 0,
                    };
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

                    datas.rd1.map((e, i) => {

                        if (e?.MasterManagement_DiamondStoneTypeid !== 0) {
                            total.ActualPcs = total?.ActualPcs + e?.ActualPcs;
                            total.ActualWeight = total?.ActualWeight + e?.ActualWeight;
                        }
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
                        if (e.ActualPcs === 0 && e.ActualWeight == 0) {
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
                    //     let len = 11 - (mainArr.slice(i, i + chunkSize17)).length;
                    //     chunkData.push({ data: chunks, length: len });
                    // }
                    responseData.push({ data: datas, additional: { length: length, clr: clr, dia: dia, f: f, img: img, misc: misc, total: total, pages: arrofchunk } });

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

    useEffect(() => {
        if (data.length !== 0) {
            setTimeout(() => {
                window.print();
            }, 5000);
        }

    }, [data]);

    const handleImageLoad = (eve, i, dataLen) => {

        // if (i === dataLen - 1) {
        //     setTimeout(window.print(), 5000);
        // }
    };

    return (
        <>
            {
                data.length === 0 ? <Loader /> : <><div className="print_btn"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
                    Print
                </button></div>


                    <div className='bag14Aflex'>
                        <div className='straight_print'>
                            {Array.from({ length: queries.pageStart }, (_, index) => (
                                index > 0 && <div key={index} className="container_1" style={{ border: "0px" }}></div>
                            ))}
                            {
                                data?.length > 0 && data.map((e, i) => {
                                    let totpcs = 0;
                                    let totwt = 0;
                                    return (
                                        <React.Fragment key={i}>
                                            {
                                                e?.additional?.pages?.length > 0 ? 
                                                    
                                                        e?.additional?.pages?.map((a, index) => {

                                                            return (
                                                                
                                                                    <div className='container_1' key={index}>
                                                                        <div className='firstpart'>
                                                                            <div className='firstpart_header'>
                                                                                <div className='firstpart_one'>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color'>BAG NO</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd[0]?.serialjobno}`}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color'>ORDER NO</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd[0]?.OrderNo}`}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color'>CUSTOMER</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd[0]?.CustomerCode}`}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color'>ORDER DATE</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd[0]?.orderDatef ?? ''}`}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color'>ORDER PCS</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd[0]?.Quantity}`}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color'>PROMISE DATE</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd[0]?.promiseDatef ?? ''}`}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color' style={{ borderRight: "none" }}></div><div className='firstpart_one_chunk_val workbreak'></div></div>
                                                                                </div>
                                                                                <div className='firstpart_two'>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color'>SIZE</div><div className='firstpart_two_chunk workbreak'>{`${e?.data?.rd[0]?.Size}`}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color'>TONE</div><div className='firstpart_two_chunk workbreak'>{`${e?.data?.rd[0]?.MetalColorCo}`}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color'>KT</div><div className='firstpart_two_chunk workbreak'>{e?.data?.rd[0]?.MetalType?.split(" ")?.[1]}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color'>PO. NO</div><div className='firstpart_two_chunk workbreak'>{`${e?.data?.rd[0]?.PO}`}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color'>S.P.</div><div className='firstpart_two_chunk workbreak'>{`${e?.data?.rd[0]?.SalesrepCode}`}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color'>PRIORITY</div><div className='firstpart_two_chunk workbreak'>{`${e?.data?.rd[0]?.prioritycode}`}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk '>PROPOSED</div><div className='firstpart_two_chunk workbreak'>ISSUE</div></div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='firstpart_footer'>
                                                                                <div className='footer_one'>
                                                                                    <div className='firstpart_one_1'>
                                                                                        <div className='firstpart_one_chunk _color'>RM CODE</div>
                                                                                        <div className='firstpart_one_chunk_val _color'>RM SIZE</div>
                                                                                    </div>
                                                                                    <div className='firstpart_one_2'>
                                                                                        <div className='semi _color'>PCS</div>
                                                                                        <div className='semi _color'>WT</div>
                                                                                    </div>
                                                                                    <div className='firstpart_one_1'>
                                                                                        <div className='semi _color'>PCS</div>
                                                                                        <div className='semi _color'>WT</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <div>
                                                                                    {

                                                                                        a?.data?.map((ele, i) => {

                                                                                            return (
                                                                                                
                                                                                                    <div style={{ display: "flex" }} key={i}>
                                                                                                        <div className='firstpart_one_1'>
                                                                                                            {/* <div className='firstpart_one_chunk workbreak' style={{ fontWeight: ele?.Shapename === 'TOTAL' ? 'bold' : 'normal' }}>{ele?.Shapename}</div> */}
                                                                                                            {ele?.Shapename === "TOTAL" ? <div className='firstpart_one_chunk workbreak'><b>{ele?.Shapename}</b></div> : <div className='firstpart_one_chunk workbreak'>{ele?.ConcatedFullShapeQualityColorCode}</div>}
                                                                                                            <div className='firstpart_one_chunk_val workbreak'>{ele?.Sizename}</div>
                                                                                                        </div>
                                                                                                        <div className='firstpart_one_2'>
                                                                                                            <div className="semi workbreak" style={{ fontWeight: ele?.Shapename === 'TOTAL' ? 'bold' : 'normal' }}>{ele?.ActualPcs}</div>
                                                                                                            <div className="semi workbreak" style={{ fontWeight: ele?.Shapename === 'TOTAL' ? 'bold' : 'normal' }}>{ele?.ActualWeight?.toFixed(3)}</div>
                                                                                                        </div>
                                                                                                        <div className='firstpart_one_1'>
                                                                                                            <div className='semi workbreak'></div>
                                                                                                            <div className='semi workbreak'></div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                
                                                                                            );
                                                                                        })

                                                                                    }
                                                                                </div>
                                                                                <div>
                                                                                    {
                                                                                        // logic of empty chunks
                                                                                        Array.from({ length: (a?.length) }, (i) => {
                                                                                            return (
                                                                                                <div style={{ display: "flex" }} key={i}>
                                                                                                    <div className='firstpart_one_1'>
                                                                                                        <div className='firstpart_one_chunk _color'></div>
                                                                                                        <div className='firstpart_one_chunk_val _color'></div>
                                                                                                    </div>
                                                                                                    <div className='firstpart_one_2'>
                                                                                                        <div className="semi _color"></div>
                                                                                                        <div className="semi _color"></div>
                                                                                                    </div>
                                                                                                    <div className='firstpart_one_1'>
                                                                                                        <div className='semi _color'></div>
                                                                                                        <div className='semi _color'></div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            );
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                                <div>



                                                                                    <div style={{ display: "flex" }} key={i}>
                                                                                        <div className='firstpart_one_1'>
                                                                                            <div className='firstpart_one_chunk _color'><b style={{ color: "black" }}>TOTAL</b></div>
                                                                                            <div className='firstpart_one_chunk_val _color'></div>
                                                                                        </div>
                                                                                        <div className='firstpart_one_2'>
                                                                                            <div className="semi _color"><b style={{ color: "black" }}>{e?.additional?.total?.ActualPcs}</b></div>
                                                                                            <div className="semi _color"><b style={{ color: "black" }}>{e?.additional?.total?.ActualWeight?.toFixed(3)}</b></div>
                                                                                        </div>
                                                                                        <div className='firstpart_one_1'>
                                                                                            <div className='semi _color'></div>
                                                                                            <div className='semi _color'></div>
                                                                                        </div>
                                                                                    </div>


                                                                                </div>
                                                                            </div>

                                                                            <div className='footer_one'>
                                                                                <div className='firstpart_one_1'>
                                                                                    <div className='firstpart_one_chunk workbreak _color'>PARTICLUAR</div>
                                                                                    <div className='firstpart_one_chunk_val workbreak _color'>DATE</div>
                                                                                </div>
                                                                                <div className='firstpart_one_2'>
                                                                                    <div className='semi workbreak _color'>PCS</div>
                                                                                    <div className='semi workbreak _color'>WT</div>
                                                                                </div>
                                                                                <div className='firstpart_one_1'>
                                                                                    <div className='semi workbreak _color'>WORKER</div>
                                                                                    <div className='semi workbreak _color'>WORKER</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='footer_one'>
                                                                                <div className='firstpart_one_1'>
                                                                                    <div className='firstpart_one_chunk workbreak _color'>WT TOLERANCE</div>
                                                                                    <div className='firstpart_one_chunk_val workbreak'></div>
                                                                                </div>
                                                                                <div className='firstpart_one_2'>
                                                                                    <div className='semi workbreak'></div>
                                                                                    <div className='semi workbreak'></div>
                                                                                </div>
                                                                                <div className='firstpart_one_1'>
                                                                                    <div className='semi workbreak'></div>
                                                                                    <div className='semi workbreak'></div>
                                                                                </div>
                                                                            </div>


                                                                        </div>
                                                                        <div className='secondpart'>
                                                                            <div className='firstpart_one_1'><div className='firstpart_one_chunk_val _color '>DESIGN NO</div><div className='firstpart_one_chunk workbreak' style={{ borderRight: "none" }}>{`${e?.data?.rd[0]?.Designcode}`}</div></div>
                                                                            <div className='imagediv'><img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} id="img15" alt="" onError={e => handleImageError(e)} loading="eager" onLoad={eve => handleImageLoad(eve, i , data?.length)} /></div>
                                                                            <div className='barcodediv'><div className='barcode14'>
                                                                                {(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd[0]?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd[0]?.serialjobno} />}</>}
                                                                            </div></div>
                                                                            <div className='firstpart_one_1'><div className='semi _color'>SPE REM.	:</div><div className='semi_border workbreak flexSPE'>{e?.data?.rd[0]?.ProductInstruction}</div></div>
                                                                            <div className='info workbreak flex_data' style={{ fontSize: "12px" }}>
                                                                                <div>{e?.data?.rd[0]?.productinfo}</div>
                                                                            </div>
                                                                            <div className='secondpart_footer_2'>
                                                                                <div className='fg_info_1 _color font_size'>FG DETAILS</div>
                                                                                <div className='fg_info_2 _color font_size'>RM TRANSACTION</div>
                                                                            </div>
                                                                            <div className='secondpart_footer_2'>
                                                                                <div className='fg_info_1'><div className='last_1 _color font_size' style={{ borderRight: "1px solid grey" }}>QTY</div><div className='last_1 _color font_size'>WT</div></div>
                                                                                <div className='fg_info_2'>
                                                                                    <div className='last_2 _color font_size'>RM CODE </div>
                                                                                    <div className='last_2 _color font_size'> ISSUE </div>
                                                                                    <div className='last_2 _color font_size' style={{ borderRight: "none" }}> RETURN </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='secondpart_footer_2'>
                                                                                <div className='fg_info_1'><div className='last_1 workbreak' style={{ borderRight: "1px solid grey" }}></div><div className='last_1 workbreak'></div></div>
                                                                                <div className='fg_info_2'>
                                                                                    <div className='last_2 workbreak' > </div>
                                                                                    <div className='last_2 workbreak'>  </div>
                                                                                    <div className='last_2 workbreak' style={{ borderRight: "none" }}> </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='secondpart_footer_2'>
                                                                                <div className='fg_info_1'><div className='last_1' style={{ borderRight: "1px solid grey" }}></div><div className='last_1'></div></div>
                                                                                <div className='fg_info_2'>
                                                                                    <div className='last_2' > </div>
                                                                                    <div className='last_2'>  </div>
                                                                                    <div className='last_2' style={{ borderRight: "none" }}> </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='secondpart_footer_2'>
                                                                                <div className='fg_info_1'><div className='last_1' style={{ borderRight: "1px solid grey" }}></div><div className='last_1'></div></div>
                                                                                <div className='fg_info_2'>
                                                                                    <div className='last_2' > </div>
                                                                                    <div className='last_2'>  </div>
                                                                                    <div className='last_2' style={{ borderRight: "none" }}> </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='secondpart_footer_2'>
                                                                                <div className='fg_info_1'><div className='last_1' style={{ borderRight: "1px solid grey" }}></div><div className='last_1'></div></div>
                                                                                <div className='fg_info_2'>
                                                                                    <div className='last_2' > </div>
                                                                                    <div className='last_2'>  </div>
                                                                                    <div className='last_2' style={{ borderRight: "none" }}>  </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                
                                                            );
                                                        })
                                                      :
                                                    <div className='container_1'>
                                                        <div className='firstpart'>
                                                            <div className='firstpart_header'>
                                                                <div className='firstpart_one'>
                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color'>BAG NO</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd[0]?.serialjobno ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color'>ORDER NO</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd[0]?.OrderNo ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color'>CUSTOMER</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd[0]?.CustomerCode ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color'>ORDER DATE</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd[0]?.orderDatef ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color'>ORDER PCS</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd[0]?.Quantity ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color'>PROMISE DATE</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd[0]?.promiseDatef ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color' style={{ borderRight: "none" }}></div><div className='firstpart_one_chunk_val workbreak'></div></div>
                                                                </div>
                                                                <div className='firstpart_two'>
                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color'>SIZE</div><div className='firstpart_two_chunk workbreak'>{`${e?.data?.rd[0]?.Size ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color'>TONE</div><div className='firstpart_two_chunk workbreak'>{`${e?.data?.rd[0]?.MetalColorCo ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color'>KT</div><div className='firstpart_two_chunk workbreak'>{e?.data?.rd[0]?.MetalType ?? ''}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color'>PO. NO</div><div className='firstpart_two_chunk workbreak'>{`${e?.data?.rd[0]?.PO ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color'>S.P.</div><div className='firstpart_two_chunk workbreak'>{`${e?.data?.rd[0]?.SalesrepCode ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color'>PRIORITY</div><div className='firstpart_two_chunk workbreak'>{`${e?.data?.rd[0]?.prioritycode ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk '>PROPOSED</div><div className='firstpart_two_chunk workbreak'>ISSUE</div></div>
                                                                </div>
                                                            </div>
                                                            <div className='firstpart_footer'>
                                                                <div className='footer_one'>
                                                                    <div className='firstpart_one_1'>
                                                                        <div className='firstpart_one_chunk _color'>RM CODE</div>
                                                                        <div className='firstpart_one_chunk_val _color'>RM SIZE</div>
                                                                    </div>
                                                                    <div className='firstpart_one_2'>
                                                                        <div className='semi _color'>PCS</div>
                                                                        <div className='semi _color'>WT</div>
                                                                    </div>
                                                                    <div className='firstpart_one_1'>
                                                                        <div className='semi _color'>PCS</div>
                                                                        <div className='semi _color'>WT</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='footer_one'>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='firstpart_one_chunk'></div>
                                                                    <div className='firstpart_one_chunk_val'></div>
                                                                </div>
                                                                <div className='firstpart_one_2'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                            </div>
                                                            <div className='footer_one'>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='firstpart_one_chunk'></div>
                                                                    <div className='firstpart_one_chunk_val'></div>
                                                                </div>
                                                                <div className='firstpart_one_2'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                            </div>
                                                            <div className='footer_one'>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='firstpart_one_chunk'></div>
                                                                    <div className='firstpart_one_chunk_val'></div>
                                                                </div>
                                                                <div className='firstpart_one_2'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                            </div>
                                                            <div className='footer_one'>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='firstpart_one_chunk'></div>
                                                                    <div className='firstpart_one_chunk_val'></div>
                                                                </div>
                                                                <div className='firstpart_one_2'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                            </div>
                                                            <div className='footer_one'>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='firstpart_one_chunk'></div>
                                                                    <div className='firstpart_one_chunk_val'></div>
                                                                </div>
                                                                <div className='firstpart_one_2'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                            </div>
                                                            <div className='footer_one'>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='firstpart_one_chunk'></div>
                                                                    <div className='firstpart_one_chunk_val'></div>
                                                                </div>
                                                                <div className='firstpart_one_2'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                            </div>
                                                            <div className='footer_one'>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='firstpart_one_chunk'></div>
                                                                    <div className='firstpart_one_chunk_val'></div>
                                                                </div>
                                                                <div className='firstpart_one_2'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                            </div>
                                                            <div className='footer_one'>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='firstpart_one_chunk'></div>
                                                                    <div className='firstpart_one_chunk_val'></div>
                                                                </div>
                                                                <div className='firstpart_one_2'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                            </div>
                                                            <div className='footer_one'>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='firstpart_one_chunk'></div>
                                                                    <div className='firstpart_one_chunk_val'></div>
                                                                </div>
                                                                <div className='firstpart_one_2'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                            </div>
                                                            <div className='footer_one'>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='firstpart_one_chunk'></div>
                                                                    <div className='firstpart_one_chunk_val'></div>
                                                                </div>
                                                                <div className='firstpart_one_2'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                            </div>
                                                            <div className='footer_one'>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='firstpart_one_chunk'></div>
                                                                    <div className='firstpart_one_chunk_val'></div>
                                                                </div>
                                                                <div className='firstpart_one_2'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                            </div>
                                                            <div className='footer_one'>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='firstpart_one_chunk'><b>TOTAL</b></div>
                                                                    <div className='firstpart_one_chunk_val'></div>
                                                                </div>
                                                                <div className='firstpart_one_2'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='semi'></div>
                                                                    <div className='semi'></div>
                                                                </div>
                                                            </div>
                                                            <div className='footer_one'>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='firstpart_one_chunk _color'>PARTICULAR</div>
                                                                    <div className='firstpart_one_chunk_val _color'>DATE</div>
                                                                </div>
                                                                <div className='firstpart_one_2'>
                                                                    <div className='semi _color'>PCS</div>
                                                                    <div className='semi _color'>WT</div>
                                                                </div>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='semi _color'>WORKER</div>
                                                                    <div className='semi _color'>WORKER</div>
                                                                </div>
                                                            </div>
                                                            <div className='footer_one'>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='firstpart_one_chunk _color' style={{ borderBottom: "none" }}> WT TOLERANCE</div>
                                                                    <div className='firstpart_one_chunk_val' style={{ borderBottom: "none" }}></div>
                                                                </div>
                                                                <div className='firstpart_one_2'>
                                                                    <div className='semi' style={{ borderBottom: "none" }}></div>
                                                                    <div className='semi' style={{ borderBottom: "none" }}></div>
                                                                </div>
                                                                <div className='firstpart_one_1'>
                                                                    <div className='semi' style={{ borderBottom: "none" }}></div>
                                                                    <div className='semi' style={{ borderBottom: "none" }}></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='secondpart'>
                                                            <div className='firstpart_one_1'><div className='firstpart_one_chunk_val _color'>DESIGN NO</div><div className='firstpart_one_chunk' style={{ borderRight: "none" }}>{`${e?.data?.rd[0]?.Designcode ?? ''}`}</div></div>
                                                            <div className='imagediv'><img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} id="img15" alt="" onError={e => handleImageError(e)} loading="eager"  onLoad={eve => handleImageLoad(eve, i ,data?.length)}/></div>
                                                            <div className='barcodediv'><div className='barcode14'>
                                                                {(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd[0]?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd[0]?.serialjobno ?? ''} />}</>}
                                                            </div></div>
                                                            <div className='firstpart_one_1'><div className='semi _color'>SPE REM.	:</div><div className='semi_border flexSPE workbreak'></div></div>
                                                            <div className='info flex_data workbreak' style={{ fontSize: "12px" }}>
                                                                {/* <div>Customer INS :  <p></p></div>
                                                                <div>Wax. INS :</div>
                                                                <div>Finding INS :</div> */}
                                                            </div>
                                                            <div className='secondpart_footer_2'>
                                                                <div className='fg_info_1 _color'>FG DETAILS</div>
                                                                <div className='fg_info_2 _color'>RM TRANSACTION</div>
                                                            </div>
                                                            <div className='secondpart_footer_2'>
                                                                <div className='fg_info_1'><div className='last_1 _color' style={{ borderRight: "1px solid grey" }}>QTY</div><div className='last_1 _color'>WT</div></div>
                                                                <div className='fg_info_2'>
                                                                    <div className='last_2 _color' style={{ fontSize: "10.5px" }}>RM CODE </div>
                                                                    <div className='last_2 _color'> ISSUE </div>
                                                                    <div className='last_2 _color' style={{ borderRight: "none" }}> RETURN </div>
                                                                </div>
                                                            </div>
                                                            <div className='secondpart_footer_2'>
                                                                <div className='fg_info_1'><div className='last_1' style={{ borderRight: "1px solid grey" }}></div><div className='last_1'></div></div>
                                                                <div className='fg_info_2'>
                                                                    <div className='last_2' > </div>
                                                                    <div className='last_2'>  </div>
                                                                    <div className='last_2' style={{ borderRight: "none" }}> </div>
                                                                </div>
                                                            </div>
                                                            <div className='secondpart_footer_2'>
                                                                <div className='fg_info_1'><div className='last_1' style={{ borderRight: "1px solid grey" }}></div><div className='last_1'></div></div>
                                                                <div className='fg_info_2'>
                                                                    <div className='last_2' > </div>
                                                                    <div className='last_2'>  </div>
                                                                    <div className='last_2' style={{ borderRight: "none" }}> </div>
                                                                </div>
                                                            </div>
                                                            <div className='secondpart_footer_2'>
                                                                <div className='fg_info_1'><div className='last_1' style={{ borderRight: "1px solid grey" }}></div><div className='last_1'></div></div>
                                                                <div className='fg_info_2'>
                                                                    <div className='last_2' > </div>
                                                                    <div className='last_2'>  </div>
                                                                    <div className='last_2' style={{ borderRight: "none" }}> </div>
                                                                </div>
                                                            </div>
                                                            <div className='secondpart_footer_2'>
                                                                <div className='fg_info_1'><div className='last_1' style={{ borderRight: "1px solid grey" }}></div><div className='last_1'></div></div>
                                                                <div className='fg_info_2'>
                                                                    <div className='last_2' > </div>
                                                                    <div className='last_2'>  </div>
                                                                    <div className='last_2' style={{ borderRight: "none" }}>  </div>
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
                </>
            }
        </>
    );
}

export default BagPrint14A;






