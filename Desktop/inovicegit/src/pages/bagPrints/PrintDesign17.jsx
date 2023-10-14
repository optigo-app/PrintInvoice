import React, { useEffect, useState } from 'react';
// import BackSide from "../json/Back side.json";
import BackSide from "../../assets/json/Back side.json";
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
// import Loader from './Loader';
// import BarcodeGenerator from './BarcodeGenerator';
// import "../assets/css/bagprint17.css";
import "../../assets/css/bagprint/bagprint17.css";
import { GetData } from '../../GlobalFunctions/GetData';
import { organizeData } from '../../GlobalFunctions/OrganizeBagPrintData';
import Loader from '../../components/LoaderBag';
import BarcodeGenerator from '../../components/BarcodeGenerator';

const PrintDesign17 = ({ queries, headers }) => {
    const location = useLocation();

    const queryParams = queryString.parse(location.search);
    let jobs = queryParams.str_srjobno;
    const parts = jobs?.split(",");
    const resultString = parts?.map((part) => `'${part}'`)?.join(",");
    if (Object.keys(queryParams).length !== 0) {
        jobs = jobs.split(",");
    }
    const [print, setprint] = useState(jobs);
    const [data, setData] = useState([]);
    const chunkSize = 14;
    useEffect(() => {
        if (Object.keys(queryParams)?.length !== 0) {
            atob(queryParams?.imagepath);
        }
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
                  let allDatas = await GetData(objs);
          
                  let datas = organizeData(allDatas?.rd, allDatas?.rd1);

                  datas?.map((a) => {

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
                    a?.rd1?.map((e, i) => {
                        if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
                            length++;
                        }
                        if (e?.MasterManagement_DiamondStoneTypeid === 3) {
                            dia.diaPcs = dia?.diaPcs + e?.ActualPcs;
                            dia.diaWt = dia.diaWt + e?.ActualWeight;
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
                            clr.clrPcs = clr.clrPcs + e?.ActualPcs;
                            clr.clrWt = clr.clrWt + e?.ActualWeight;
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
                            misc.miscWt = misc.miscWt + e?.ActualWeight;
                        }
                    });
                    length = 14 - length;
                    let imagePath = queryParams?.imagepath;
                    imagePath = atob(queryParams?.imagepath);
                    let img = imagePath + a?.rd?.ThumbImagePath;

                    const originalData = [];
                    a?.rd1?.map((e) => {
                        if (e?.Shapename !== "-") {
                            originalData?.push(e);
                        }
                    });

                    let chData = [];

                    for (let i = 0; i < originalData?.length; i += chunkSize) {
                        let len = 14 - (originalData?.slice(i, i + chunkSize))?.length;
                        chData.push({ data: originalData?.slice(i, i + chunkSize), length: len });
                    }
                    let obj = { ...a };

                    
                    // obj?.rd?.push({});

                    if ((a?.rd["officeuse"]) != null) {
                    }
                    let officeuse = ((a?.rd["officeuse"] == (null || 'null') ? '' : a?.rd["officeuse"]));
                    let ProductInstruction = ((a?.rd["ProductInstruction"] == (null || 'null') ? '' : a?.rd["ProductInstruction"]));

                    obj.rd.instructionData = ((officeuse?.length > 0 ? officeuse : '') + (ProductInstruction?.length > 0 ? ProductInstruction : ''));
                    obj?.rd?.instructionData?.slice(0, 113);
                    responseData.push({ data: obj, additional: { length: length, clr: clr, dia: dia, img: img, misc: misc, chdata: chData } });


                  })


                // for (const url of print) {
                //     let p_tag = { "SerialJobno": `${url}`, "customerid": `${queries.custid}`, "BagPrintName": `${queries.printname}` };
                //     let jsonString = JSON.stringify(p_tag);
                //     let base64String = btoa(jsonString);
                //     let Body = {
                //         "con": `{\"id\":\"\",\"mode\":\"${queries.printname}\",\"appuserid\":\"${queries.appuserid}\"}`,
                //         "p": `${base64String}`,
                //         "f": `${queries.appuserid} ${queries.printname}`
                //     };
                //     let urls = atob(queries.url);
                //     const response = await axios.post(urls, Body, { headers: headers });
                //     let datas = JSON.parse(response.data.d);
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
                //     datas?.rd1?.map((e, i) => {
                //         if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
                //             length++;
                //         }
                //         if (e?.MasterManagement_DiamondStoneTypeid === 3) {
                //             dia.diaPcs = dia?.diaPcs + e?.ActualPcs;
                //             dia.diaWt = dia.diaWt + e?.ActualWeight;
                //         } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
                //             clr.clrPcs = clr.clrPcs + e?.ActualPcs;
                //             clr.clrWt = clr.clrWt + e?.ActualWeight;
                //         } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
                //             misc.miscWt = misc.miscWt + e?.ActualWeight;
                //         }
                //     });
                //     length = 14 - length;
                //     let imagePath = queryParams?.imagepath;
                //     imagePath = atob(queryParams?.imagepath);
                //     let img = imagePath + datas?.rd[0]?.ThumbImagePath;

                //     const originalData = [];
                //     datas?.rd1?.map((e) => {
                //         if (e?.Shapename !== "-") {
                //             originalData.push(e);
                //         }
                //     });

                //     let chData = [];

                //     for (let i = 0; i < originalData.length; i += chunkSize) {
                //         let len = 14 - (originalData.slice(i, i + chunkSize)).length;
                //         chData.push({ data: originalData.slice(i, i + chunkSize), length: len });
                //     }
                //     let obj = { ...datas };
                //     obj?.rd.push({});
                //     if ((datas?.rd[0]?.["officeuse"]) != null) {
                //     }
                //     let officeuse = ((datas?.rd[0]?.["officeuse"] == (null || 'null') ? '' : datas?.rd[0]?.["officeuse"]));
                //     let ProductInstruction = ((datas?.rd[0]?.["ProductInstruction"] == (null || 'null') ? '' : datas?.rd[0]?.["ProductInstruction"]));

                //     obj.rd[0].instructionData = ((officeuse?.length > 0 ? officeuse : '') + (ProductInstruction?.length > 0 ? ProductInstruction : ''));
                //     obj?.rd[0]?.instructionData?.slice(0, 113);
                //     responseData.push({ data: obj, additional: { length: length, clr: clr, dia: dia, img: img, misc: misc, chdata: chData } });
                // }
                setData(responseData);

            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const handleImageError = (e) => {
        e.target.src = require('../../assets/img/default.jpg');
    };

    useEffect(() => {
        if (data?.length !== 0) {
            setTimeout(() => {
                window.print();
            }, 5000);
        }
    }, [data]);

    const handlePrint = (e) => {
        e.preventDefault();
        window.print();
    };

    const handleImageLoad = (eve, i, dataLen) => {
    //     if (i === dataLen - 1) {
    //         setTimeout(() => {
    //             window.print();
    //         }, 5000);
    //     }
    };
    return (
        <div>
            {data.length === 0 ? <Loader /> : <> <div className="print_btn">
                <button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
                    Print
                </button>
            </div>
                <div className="d_flex flex_wrap m_5 print_section_17">
                    {/* {Array.from({ length: queries.pageStart }, (_, index) => ( */}
                    {Array.from({ length: queries.pageStart }, (_, index) => (
                        // index > 0 && <div key={index} className="container  ml_5 mb_10"></div>
                        index > 0 && <div key={index} className="container mb_2 mt_2 pt_2 container_margin_left"></div>
                    ))}
                    {
                        data?.map((e, i) => {
                            return <>
                                {e?.additional?.chdata?.length > 0 ? e?.additional?.chdata?.map((chunk, index) => {
                                    return <div className="container mb_2 mt_2 pt_2 container_margin_left" key={index}>
                                        <div className="border border-black border-2">
                                            <div className="print_sec d_flex">
                                                <div className="print_text border_right">

                                                    <div className="header_first">
                                                        <p className='fontsize17'>{e?.data?.rd?.["serialjobno"]}</p>
                                                        <p className='fontsize17'>{e?.data?.rd?.["Designcode1"]}</p>
                                                        <p className='fontsize17'>
                                                            {e?.data?.rd?.["MetalType"]}{" "}
                                                            {e?.data?.rd?.["MetalColor"]}{" "}
                                                        </p>
                                                    </div>

                                                    <div className="header_second">
                                                        <div className="w_25 border_right p_3">
                                                            <p className="grey bold fsize17 linehP17">CUST</p>
                                                            <p className="bold fsize17">{e?.data?.rd?.["CustomerCode"]}</p>
                                                        </div>
                                                        <div className="w_25 border_right p_3">
                                                            <p className="grey bold fsize17 linehP17">SIZE</p>
                                                            <p className="bold fsize17">{e?.data?.rd?.["Size"]}</p>
                                                        </div>
                                                        <div className="w_25 border_right p_3">
                                                            <p className="grey bold fsize17 linehP17">ORD.DT.</p>
                                                            <p className="bold fsize17">{e?.data?.rd?.["OrderDate"]}</p>
                                                        </div>
                                                        <div className="w_25 p_3">
                                                            <p className="grey bold fsize17 linehP17">DEL.DT.</p>
                                                            {e?.data?.rd?.["promisedate"] === "01 Jan 1900 " ?
                                                                <p className="bold fsize17"></p> :
                                                                <p className="bold fsize17">{e?.data?.rd?.["promisedate"]}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="printhead_2 border_bottom print_head_2_ins_17" >

                                                        <p className='px_2 bold line_clamp_17' style={{ fontSize: "12px", lineHeight: "9px", padding: "2px", wordBreak: "break-all" }}>INS :  {(e?.data?.rd?.instructionData === (null || 'null') ? '' : e?.data?.rd?.instructionData?.slice(0, 113))}</p>

                                                    </div>
                                                </div>
                                                <div className="print_photo border_bottom" style={{ borderTop: "1px solid black", borderLeft: "1px solid" }}>
                                                    <img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} alt="" onLoad={eve => handleImageLoad(eve, i, data?.length)} onError={e => handleImageError(e)} loading="eager" />
                                                </div>
                                            </div>
                                            <div className="print_sec d_flex border_bottom">
                                                <div className="print_table">
                                                    <div className="h_4 d_flex">
                                                        <div className="code border_right border_bottom bold pl_3">CODE</div>
                                                        <div className="size border_right border_bottom bold  text_center">SIZE</div>
                                                        <div className="pcs border_right border_bottom bold  text_center">PCS</div>
                                                        <div className="wt border_right border_bottom bold  text_center">WT</div>
                                                        <div className="pcs_2 border_right border_bottom bold  text_center">PCS</div>
                                                        <div className="wt_2  border_bottom bold  text_center">WT</div>
                                                    </div>
                                                    <div className='border_bottom_0'>
                                                        {chunk?.data?.map((e, i) => {
                                                            return <div key={i} className="h_41 d_flex">
                                                                <div className="code border_right border_bottom medium pl_3" >{e?.ConcatedFullShapeQualityColorCode?.slice(0, 35)}</div>
                                                                <div className="size border_right border_bottom medium  text_center">{e?.Sizename?.slice(0, 15)}</div>
                                                                <div className="pcs border_right border_bottom medium  text_center">{e?.ActualPcs}</div>
                                                                <div className="wt border_right border_bottom medium  text_center">{e?.ActualWeight}</div>
                                                                <div className="pcs_2 border_right border_bottom  medium text_center"></div>
                                                                <div className="wt_2  border_bottom medium  text_center"></div>
                                                            </div>;
                                                        })}
                                                        {Array.from({ length: chunk?.length }, (_, index) => (
                                                            <div key={index} className="h_41 d_flex">
                                                                <div className="code border_right bold border_bottom"></div>
                                                                <div className=" size border_right bold border_bottom"></div>
                                                                <div className="pcs border_right bold border_bottom"></div>
                                                                <div className="wt border_right bold border_bottom"></div>
                                                                <div className="pcs_2 border_right bold border_bottom"></div>
                                                                <div className="wt_2 bold border_bottom"></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="BARCODE" >

                                                    {(e?.data?.rd1?.length !== 0) && <>{e?.data?.rd1[0]?.SerialJobno !== undefined && <BarcodeGenerator data={e?.data?.rd1[0]?.SerialJobno} />}</>}

                                                </div>
                                            </div>
                                            <div className="print-sec d_flex footer">
                                                <div className="w17Imp border_right"><div className="upper border_bottom text_center center_item"><p className="semibold" style={{ fontSize: "2.2mm" }}>DIAM.</p></div><div className="lower17 center_item bold">{+(e?.additional?.dia?.diaPcs)?.toFixed(2) + "/" + (e?.additional?.dia?.diaWt)?.toFixed(2)}</div></div>
                                                <div className="w_12mm border_right" style={{ borderBottom: "0px solid black" }}><div className="upper"></div><div className="lower17"></div></div>
                                                <div className="w17cs border_right"><div className="upper border_bottom text_center center_item"><p className="semibold" style={{ fontSize: "2.2mm" }}>CS</p></div><div className="lower17 center_item bold">{+(e?.additional?.clr?.clrPcs)?.toFixed(2) + "/" + +(e?.additional?.clr?.clrWt)?.toFixed(2)}</div></div>
                                                <div className="w_12mm border_right" style={{ borderBottom: "0px solid black" }}><div className="upper"></div><div className="lower17"></div></div>
                                                <div className="w_10 border_right"><div className="upper border_bottom text_center center_item"><p className="semibold" style={{ fontSize: "2.2mm" }}>METAL</p></div><div className="lower17 center_item bold">{(e?.data?.rd?.["QuotGrossWeight"])?.toFixed(2)}</div></div>
                                                <div className="w_13 border_right" style={{ borderBottom: "0px solid black" }}><div className="upper"></div><div className="lower17"></div></div>
                                                <div className="w_9 border_right"><div className="upper border_bottom text_center center_item"><p className="semibold" style={{ fontSize: "2.2mm" }}>MISC</p></div><div className="lower17 center_item bold">{+(e?.additional?.misc?.miscWt)?.toFixed(2)}</div></div>
                                                <div className="w_12_5mm" style={{ borderBottom: "0px solid black" }}><div className="upper"></div><div className="lower17"></div></div>
                                            </div>
                                        </div>
                                    </div>;
                                }) : <div className="container mb_2 mt_2 pt_2 container_margin_left" key={i}>
                                    <div className="border border-black border-2">
                                        <div className="print_sec d_flex">
                                            <div className="print_text border_right">
                                                <div className="printhead d_flex justify_content_between ">
                                                    <p className=" bold pl_3 fontsize17">{e?.data?.rd?.["serialjobno"]}</p>
                                                    <p className=" bold pr_3 fontsize17" >{e?.data?.rd?.["Designcode1"]}</p>
                                                    <p className=" bold  pl_3 pr_3 fontsize17">
                                                        {e?.data?.rd?.["MetalType"]}{" "}
                                                        {e?.data?.rd?.["MetalColor"]}{" "}
                                                    </p>
                                                </div>

                                                <div className="empty_17box">
                                                    <div className="header_17two" style={{ borderRight: "0px solid black" }}>
                                                        <p className=''>
                                                            <p className="grey bold fsize17 linehP17">CUST</p>
                                                            <p className="bold fsize17">{e?.data?.rd?.["CustomerCode"]}</p>
                                                        </p>
                                                    </div>
                                                    <div className="header_17two" style={{ borderRight: "0px solid black" }}>
                                                        <p>
                                                            <p className="grey bold fsize17 linehP17">SIZE</p>
                                                            <p className="bold fsize17">{e?.data?.rd?.["Size"]}</p>
                                                        </p>
                                                    </div>
                                                    <div className="header_17two" style={{ borderRight: "0px solid black" }}>
                                                        <p>
                                                            <p className="grey bold fsize17 linehP17">ORD.DT.</p>
                                                            <p className="bold fsize17">{e?.data?.rd?.["OrderDate"]}</p>
                                                        </p>
                                                    </div>
                                                    <div className="header_17two" style={{ borderRight: "0px solid black" }}>
                                                        <p>
                                                            <p className="grey bold fsize17 linehP17">DEL.DT.</p>
                                                            {e?.data?.rd?.["promisedate"] === "01 Jan 1900 " ?
                                                                <p className="bold fsize17"></p> :
                                                                <p className="bold fsize17">{e?.data?.rd?.["promisedate"]}</p>}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="empty_17box_Ins" style={{ height: "30px" }}>
                                                    <p className='px_2 bold line_clamp_17' style={{ fontSize: "12px", lineHeight: "9px", padding: "2px", wordBreak: "break-all" }}>INS :  {(e?.data?.rd?.instructionData === (null || 'null') ? '' : e?.data?.rd?.instructionData?.slice(0, 113))}</p>

                                                </div>
                                            </div>
                                            <div className="print_photo border_bottom" style={{ borderTop: "1px solid black", borderLeft: "1px solid" }}>
                                                <img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} alt="" onError={e => handleImageError(e)} id="img17D" loading="eager"  onLoad={eve => handleImageLoad(eve, i, data?.length)}/>
                                            </div>
                                        </div>
                                        <div className="print_sec d_flex border_bottom">
                                            <div className="print_table">
                                                <div className="h_4 d_flex">
                                                    <div className="code border_right border_bottom bold pl_3">CODE</div>
                                                    <div className="size border_right border_bottom bold  text_center">SIZE</div>
                                                    <div className="pcs border_right border_bottom bold  text_center">PCS</div>
                                                    <div className="wt border_right border_bottom bold  text_center">WT</div>
                                                    <div className="pcs_2 border_right border_bottom bold  text_center">PCS</div>
                                                    <div className="wt_2  border_bottom bold  text_center">WT</div>
                                                </div>
                                                <div className='border_bottom_0'>
                                                    {Array.from({ length: 14 }, (_, index) => (
                                                        <div className="h_41 d_flex" key={index}>
                                                            <div className="code border_right bold border_bottom"></div>
                                                            <div className=" size border_right bold border_bottom"></div>
                                                            <div className="pcs border_right bold border_bottom"></div>
                                                            <div className="wt border_right bold border_bottom"></div>
                                                            <div className="pcs_2 border_right bold border_bottom"></div>
                                                            <div className="wt_2 bold border_bottom"></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="BARCODE">
                                                {(e?.data?.rd !== 0) && <>{e?.data?.rd?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd?.serialjobno} />}</>}
                                            </div>
                                        </div>
                                        <div className="print-sec d_flex footer">
                                            <div className="w17Imp border_right" ><div className="upper border_bottom text_center center_item" ><p className="semibold">DIAM.</p></div><div className="lower17 center_item bold " style={{ borderBottom: "1px solid black" }}>{+(e?.additional?.dia?.diaPcs)?.toFixed(2) + "/" + (e?.additional?.dia?.diaWt)?.toFixed(2)}</div></div>
                                            <div className="w_12mm border_right"><div className="upper"></div><div className="lower17"></div></div>
                                            <div className="w17cs border_right"><div className="upper border_bottom text_center center_item"><p className="semibold">CS</p></div><div className="lower17 center_item bold" style={{ borderBottom: "1px solid black" }}>{+(e?.additional?.clr?.clrPcs)?.toFixed(2) + "/" + +(e?.additional?.clr?.clrWt)?.toFixed(2)}</div></div>
                                            <div className="w_12mm border_right"><div className="upper"></div><div className="lower17"></div></div>
                                            <div className="w_10 border_right"><div className="upper border_bottom text_center center_item"><p className="semibold">METAL</p></div><div className="lower17 center_item bold" style={{ borderBottom: "1px solid black" }}>{(e?.data?.rd?.["QuotGrossWeight"])?.toFixed(2)}</div></div>
                                            <div className="w_13 border_right"><div className="upper"></div><div className="lower17"></div></div>
                                            <div className="w_9 border_right"><div className="upper border_bottom text_center center_item"><p className="semibold">MISC</p></div><div className="lower17 center_item bold" style={{ borderBottom: "1px solid black !important" }}>{+(e?.additional?.misc?.miscWt)?.toFixed(2)}</div></div>
                                            <div className="w_12_5mm"><div className="upper"></div><div className="lower17"></div></div>import { GetData } from './../../GlobalFunctions/GetData';
import Loader from './../../components/LoaderBag';

                                        </div>
                                    </div>
                                </div>}
                                <div className="container mb_2 mt_2 pt_2 container_margin_left" key={i}>
                                    <div className="border border-black border-2     ">
                                        <div className="d_flex">
                                            <div className="side_1_17">
                                                <div className="header_first" style={{ borderRight: "1px solid black" }}>
                                                    <p className='fontsize17'>{e?.data?.rd?.["serialjobno"]}</p>
                                                    <p className='fontsize17'>{e?.data?.rd?.["Designcode1"]}</p>
                                                    <p className='fontsize17'>
                                                        {e?.data?.rd?.["MetalType"]}{" "}
                                                        {e?.data?.rd?.["MetalColor"]}{" "}
                                                    </p>
                                                </div>
                                                <div className="empty_17box_second">
                                                    <div className="w_25 border_right p_3 bold grey "><p className='fsize17 linehP17' style={{ fontSize: "10px" }}>SALES REP.</p><p className="bold black fsize17 linehP17">{e?.data?.rd?.["SalesrepCode"]}</p></div>
                                                    <div className="w_19_p border_right p_3 bold grey fsize17"><p className='fsize17 linehP17'>FROS</p><p className="bold black fsize17 linehP17">{e?.data?.rd?.["MetalFrosting"]}</p></div>
                                                    <div className="w_19_p border_right p_3 bold grey fsize17"><p className='fsize17 linehP17'>LAB</p><p className="bold black fsize17 linehP17">{e?.data?.rd?.["MasterManagement_labname"]}</p></div>
                                                    <div className="w_37_p p_3 bold grey fsize17"><p className='fsize17 linehP17'>MAKETYPE</p><p className="bold black fsize17 linehP17">{e?.data?.rd?.["mastermanagement_maketypename"]}</p></div>
                                                </div>

                                                <div className="border_bottom h_5 d_flex align_center pl_3 border_right">
                                                    <p className="bold">{e?.data?.rd?.["PO"]}</p>
                                                </div>
                                                <div className="d_flex border_bottom border_right" style={{ height: "27px" }}>
                                                    <div className="width_Y border_right p_3 grey bold text_center"><p>Y TR NO  </p></div>
                                                    <div className="width_Y border_right p_3 grey bold text_center"><p>W TR NO  </p></div>
                                                    <div className="width_Y border_right p_3 grey bold text_center"><p>P TR NO  </p></div>
                                                    <div className="width_Y border_right p_3 grey bold text_center"><p>Y CST WT.</p></div>
                                                    <div className="width_Y border_right p_3 grey bold text_center"><p>W CST WT.</p></div>
                                                    <div className="width_Y p_3 grey bold text_center"><p>P CST WT. </p></div>
                                                </div>
                                                <div className="d_flex h_88_17 pl_3 border_bottom border_right" >
                                                    <p className="w_10  grey bold">METAL</p>
                                                    <p className="w_10 center_item">{BackSide[0]?.["METAL"]}</p>
                                                </div>
                                                <div className="d_flex h_88_17 pl_3 border_bottom border_right" style={{ borderRight: "none" }}>
                                                    <p className="w_10  grey bold">STONE</p>
                                                    <p className="w_10 center_item">{BackSide[0]?.["STONE"]}</p>
                                                </div>
                                                <div className="d_flex h_88_17 pl_3  border_right" style={{ borderRight: "none" }}>
                                                    <p className="w_10  grey bold">VISUAL</p>
                                                    <p className="w_10 center_item">{BackSide[0]?.["VISUAL"]}</p>
                                                </div>
                                            </div>
                                            <div className="side_2_17" style={{ borderTop: "1px solid black", borderLeft: "1px solid" }}>
                                                <img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} alt="" onError={e => handleImageError(e)} loading="eager" onLoad={eve => handleImageLoad(eve, i, data?.length)} id='img17duplicate' />
                                                <div className="cvds  pl_3">
                                                    <p className=" bold grey">CVD TEST</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d_flex position_relative">
                                            <div className="d_flex dept">
                                                <div className="w_98 unique17" >
                                                    <div className="d_flex border_bottom h_4_5" style={{ height: "3.5mm" }}>
                                                        <div className="width_dept border_right pl_3 border_top bold">DEPT. </div>
                                                        <div className="width_66 border_right border_top bold text_center">AP </div>
                                                        <div className="width_6 border_right border_top bold text_center">ISSUE</div>
                                                        <div className="width_6 border_right border_top bold text_center">RECEIVE</div>
                                                        <div className="width_6 border_right border_top bold text_center">SCRAP</div>
                                                        <div className="width_6 border_right border_top bold text_center">PCS</div>
                                                        <div className="width_6 border_top bold text_center">WORKER</div>
                                                    </div>
                                                    <div className="d_flex border_bottom h_4_5">
                                                        <div className="width_dept border_right pl_3 bold">GRD.</div>
                                                        <div className="width_66 border_right bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6  pl_3 bold"></div>
                                                    </div>
                                                    <div className="d_flex border_bottom h_4_5">
                                                        <div className="width_dept border_right pl_3 bold">FIL.</div>
                                                        <div className="width_66 border_right bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6  pl_3 bold"></div>
                                                    </div>
                                                    <div className="d_flex border_bottom h_4_5">
                                                        <div className="width_dept border_right pl_3 bold">ASM.</div>
                                                        <div className="width_66 border_right bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6  pl_3 bold"></div>
                                                    </div>
                                                    <div className="d_flex border_bottom h_4_5">
                                                        <div className="width_dept border_right pl_3 bold">CNC.</div>
                                                        <div className="width_66 border_right bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6  pl_3 bold"></div>
                                                    </div>
                                                    <div className="d_flex border_bottom h_4_5">
                                                        <div className="width_dept border_right pl_3 bold">EP/PI.</div>
                                                        <div className="width_66 border_right bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6  pl_3 bold"></div>
                                                    </div>
                                                    <div className="d_flex border_bottom h_4_5">
                                                        <div className="width_dept border_right pl_3 bold">SET.</div>
                                                        <div className="width_66 border_right bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6  pl_3 bold"></div>
                                                    </div>
                                                    <div className="d_flex border_bottom h_4_5">
                                                        <div className="width_dept border_right pl_3 bold">FPL.</div>
                                                        <div className="width_66 border_right bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6  pl_3 bold"></div>
                                                    </div>
                                                    <div className="d_flex border_bottom h_4_5">
                                                        <div className="width_dept border_right pl_3 bold">PLT.</div>
                                                        <div className="width_66 border_right bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6 border_right pl_3 bold"></div>
                                                        <div className="width_6  pl_3 bold"></div>
                                                    </div>
                                                    <div className="d_flex  h_4_5" style={{ height: "4.4mm" }}>
                                                        <div className="width_dept border_right pl_3 bold" style={{ borderBottom: "0px solid black" }}>ENM.</div>
                                                        <div className="width_66 border_right bold" style={{ borderBottom: "0px solid black" }}></div>
                                                        <div className="width_6 border_right pl_3 bold" style={{ borderBottom: "0px solid black" }}></div>
                                                        <div className="width_6 border_right pl_3 bold" style={{ borderBottom: "0px solid black" }}></div>
                                                        <div className="width_6 border_right pl_3 bold" style={{ borderBottom: "0px solid black" }}></div>
                                                        <div className="width_6 border_right pl_3 bold" style={{ borderBottom: "0px solid black" }}></div>
                                                        <div className="width_6  pl_3 bold" style={{ borderBottom: "0px solid black" }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="BARCODE" style={{ height: "61mm", borderBottom: "0px solid" }} >
                                                {(e?.data?.rd !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd?.serialjobno} />}</>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>;
                        })
                    }
                </div></>}
        </div>
    );
};

export default PrintDesign17;