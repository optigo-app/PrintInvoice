import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "../../assets/css/bagprint/print16A.css";
import { formatDate } from '../../GlobalFunctions/DateFormat';
import { GetData } from '../../GlobalFunctions/GetData';
import { handleImageError } from '../../GlobalFunctions/HandleImageError';
import { handlePrint } from '../../GlobalFunctions/HandlePrint';
import BarcodeGenerator from '../../components/BarcodeGenerator';
import Loader from '../../components/LoaderBag';

const BagPrint16A = ({ queries, headers }) => {
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    let jobs = queryParams.str_srjobno;
    if (Object.keys(queryParams).length !== 0) {
        jobs = jobs.split(",");
    }
    const [print, setprint] = useState(jobs);
    const [data, setData] = useState([]);


    const [isLoading, setIsLoading] = useState(true);
    const chunkSize = 14;
    const imgUrls = [];
    useEffect(() => {
        if (Object.keys(queryParams).length !== 0) {
            atob(queryParams.imagepath);
        }
        const fetchData = async () => {
            try {
                const responseData = [];
                for (const url of print) {
                    const objs = {
                        jobno: url,
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
                    // let p_tag = { "SerialJobno": `${url}`, "customerid": `${queries.custid}`, "BagPrintName": `${queries.printname}` };
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



                    datas?.rd?.map(e => imgUrls.push(e?.ThumbImagePath));

                    let length = 0;
                    let clr = {
                        clrPcs: 0,
                        clrWt: 0
                    };
                    let dia = {
                        diaPcs: 0,
                        diaWt: 0
                    };
                    let diamondData = [];
                    let clrData = [];
                    let diamondWeight = 0;
                    let diamondPcs = 0;
                    let clrWeight = 0;
                    let clrpcs = 0;

                    datas?.rd1?.map((e, i) => {
                        if (e.MasterManagement_DiamondStoneTypeid === 3 || e.MasterManagement_DiamondStoneTypeid === 4) {
                            length++;
                        }
                        if (e.MasterManagement_DiamondStoneTypeid === 3) {
                            dia.diaPcs = dia.diaPcs + e.ActualPcs;
                            dia.diaWt = dia.diaWt + e.ActualWeight;
                            diamondData.push(e);
                            diamondWeight = diamondWeight + e.ActualWeight;
                            diamondPcs = diamondPcs + e.ActualPcs;
                        } else if (e.MasterManagement_DiamondStoneTypeid === 4) {
                            clr.clrPcs = clr.clrPcs + e.ActualPcs;
                            clr.clrWt = clr.clrWt + e.ActualWeight;
                            clrData.push(e);
                            clrWeight = clrWeight + e.ActualWeight;
                            clrpcs = clrpcs + e.ActualPcs;
                        }
                    });

                    if (diamondData.length > 0) {
                        let diamondDataObject = {
                            ActualPcs: diamondPcs,
                            ActualWeight: diamondWeight,
                            ColorCode: "",
                            ColorName: "",
                            ConcatedFullShapeQualityColorCode: "",
                            ConcatedFullShapeQualityColorName: "",
                            ConcatedShapeQualityColorName: "",
                            IssuePcs: "",
                            IssueWeight: "",
                            LimitedShapeQualityColorCode: "",
                            MasterManagement_DiamondStoneTypeid: "",
                            MetalColor: "",
                            Quality: "",
                            QualityCode: "",
                            Quality_DisplayOrder: "",
                            SerialJobno: "",
                            Shapecode: "",
                            Shapename: "TOTAL",
                            Size_DisplayOrder: "",
                            Sizename: "",
                            TruncateShapename: "",
                            totalFontWeight: "900"
                        };
                        diamondData.push(diamondDataObject);
                    }
                    if (clrData.length > 0) {
                        let clrDataObject = {
                            ActualPcs: clrpcs,
                            ActualWeight: clrWeight,
                            ColorCode: "",
                            ColorName: "",
                            ConcatedFullShapeQualityColorCode: "",
                            ConcatedFullShapeQualityColorName: "",
                            ConcatedShapeQualityColorName: "",
                            IssuePcs: "",
                            IssueWeight: "",
                            LimitedShapeQualityColorCode: "",
                            MasterManagement_DiamondStoneTypeid: "",
                            MetalColor: "",
                            Quality: "",
                            QualityCode: "",
                            Quality_DisplayOrder: "",
                            SerialJobno: "",
                            Shapecode: "",
                            Shapename: "TOTAL",
                            Size_DisplayOrder: "",
                            Sizename: "",
                            TruncateShapename: "",
                            totalFontWeight: "900"
                        };
                        clrData.push(clrDataObject);
                    }
                    let originlData = [...diamondData, ...clrData];
                    let chData = [];
                    let count = 0;
                    for (let i = 0; i < originlData.length; i += chunkSize) {
                        let len = 14 - (originlData.slice(i, i + chunkSize)).length;
                        count++;

                        if (count % 5 === 0) {
                        }
                        chData.push({ data: originlData.slice(i, i + chunkSize), length: len });
                    }
                    if (chData.length === 0) {
                        length = 14;
                    } else {
                        length = 12 - length;
                    }
                    // for (let i = 0; i < originlData.length; i += chunkSize) {
                    //     let len = 15 - (originlData.slice(i, i + chunkSize)).length;
                    //     count++;

                    //     if (count % 5 === 0) {
                    //     }
                    //     chData.push({ data: originlData.slice(i, i + chunkSize), length: len });
                    // }
                    // if (chData.length === 0) {
                    //     length = 15;
                    // } else {
                    //     length = 13 - length;
                    // }
                    let imagePath = queryParams.imagepath;
                    imagePath = atob(queryParams.imagepath);
                    let img = imagePath + datas?.rd[0]?.ThumbImagePath;
                    responseData.push({ data: datas, additional: { length: length, clr: clr, dia: dia, img: img, chdata: chData } });
                }

                setData(responseData);

            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    // const handleImageError = (e) => {
    //     e.target.src = require('../../assets/img/default.jpg');
    // };

    useEffect(() => {
        if (data?.length !== 0) {
            setTimeout(() => {
                window.print();
            }, 10000);
        }
    }, [data]);

    // useEffect(() => {
    //     const loadImagePromises = imgUrls.map((imageUrl) => {
    //         return new Promise((resolve) => {
    //             const img = new Image();
    //             img.src = imageUrl;
    //             img.onload = resolve;
    //             img.onerror = resolve; // Handle errors if needed
    //         });
    //     });
    //     // console.log(loadImagePromises);

    //     Promise.all(loadImagePromises)
    //         .then(() => {

    //             // All images have loaded
    //             if (data?.length !== 0) {
    //                 setTimeout(() => {
    //                     window.print();
    //                 }, 5000);
    //             }
    //             setIsLoading(false);
    //         })
    //         .catch((error) => {
    //             console.error('Image loading error:', error);
    //             // Handle image loading errors if needed
    //         });
    //     // if (data.length !== 0) {
    //     //     if ((rds?.rd?.length !== 0) && (rds?.rd?.length !== 0)) {
    //     //         setTimeout(() => {
    //     //             window.print();
    //     //         }, 5000);
    //     //     }
    //     // }
    // }, [data]);

    // const handlePrint = (e) => {
    //     e.preventDefault();
    //     window.print();
    // };

    const handleImageLoad = (eve, i, dataLen) => {

        // if (i === dataLen - 1) {
        //     setTimeout(window.print(), 5000);
        // }
    };
    return (
        <>
            <div style={{ marginBottom: "2rem" }}>
                {
                    (data?.length === 0) ? <Loader /> : <>
                        <div className="print_btn"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
                            Print
                        </button></div>
                        <div className='print16A'>
                            {Array.from({ length: queries?.pageStart }, (_, index) => (
                                index > 0 && <div key={index} className="containerprint16A" style={{ border: "0px" }}></div>
                            ))}
                            {
                                data?.map((e, i) => {
                                    if (e?.additional?.chdata?.length === 0) {
                                        return (
                                            
                                                <div className='containerprint16A' key={i}>
                                                    <div className='head16A'>
                                                        <div className='header16A'>
                                                            <div className='headJob16A'>
                                                                <div className='header16AjobInfo'>
                                                                    <div className='job16A'><div><b style={{ fontSize: "15px" }}>{e?.data?.rd[0]?.serialjobno}</b></div><div>ORD: <b>{e?.data?.rd[0]?.orderDatef ?? ''}</b></div><div>DUE:<b style={{ paddingRight: "1px" }}>{e?.data?.rd[0]?.promiseDatef ?? ''}</b></div></div>
                                                                    <div className='job16A'><div>PARTY: <b>{e?.data?.rd[0]?.CustomerCode}</b></div><div><b style={{ paddingRight: "1px" }}>{e?.data?.rd[0]?.MetalType ?? ''} {e?.data?.rd[0]?.MetalColorCo ?? ''}</b></div> </div>
                                                                    <div className='job16A'><div>DGN:<b>{e?.data?.rd[0]?.Designcode}</b></div><div>ORD NO:- <b>{e?.data?.rd[0]?.OrderNo}</b></div></div>
                                                                    <div className='job16A'><div>SIZE:<b>{e?.data?.rd[0]?.Size}</b></div><div>PO: {e?.data?.rd[0]?.PO?.slice(0, 6)}</div><div><b>{e?.data?.rd[0]?.prioritycode}</b></div></div>
                                                                </div>
                                                                <div className='header16AjobInfo2'>
                                                                    <div className='material16A'>
                                                                        <div className='mate16A'>
                                                                            <div className='prop16A pcs16Aw'><b className='fs16A'>NET WT:</b></div>
                                                                            <div className='prop16A pcs16Aw'><b className='fs16A'>DIA PCS:</b></div>
                                                                            <div className='prop16A pcs16Aw'><b className='fs16A'>CLR PCS:</b></div>
                                                                            <div className='prop16A pcs16Aw' style={{ borderBottom: "0px" }}><b className='fs16A'>QT NO:</b></div>
                                                                        </div>
                                                                        <div className='mate16A' style={{ width: "15rem" }}>
                                                                            <div className='prop16A wt16A'><b className='fs16A'>{e?.data?.rd[0]?.netwt ?? 0}</b></div>
                                                                            <div className='prop16A wt16A'><b className='fs16A'>{e?.additional?.dia?.diaPcs}</b></div>
                                                                            <div className='prop16A wt16A'><b className='fs16A'>{e?.additional?.clr?.clrPcs}</b></div>
                                                                            <div className='prop16A wt16A' style={{ borderBottom: "0px" }}><b className='fs16A'>{e?.data?.rd[0]?.Quotation_SKUNo}</b></div>
                                                                        </div>
                                                                        <div className='mate16A'>
                                                                            <div className='prop16A grw16A'><b className='fs16A'>GR WT:</b></div>
                                                                            <div className='prop16A grw16A'><b className='fs16A'>DIA WT:</b></div>
                                                                            <div className='prop16A grw16A'><b className='fs16A'>CLR WT:</b></div>
                                                                            <div className='prop16A grw16A' style={{ borderBottom: "0px" }}><b className='fs16A'>CREATED BY:</b></div>
                                                                        </div>
                                                                        <div className='mate16A' style={{ borderRight: "0px solid", width: "14rem" }}>
                                                                            <div className='prop16A wt16A'><b className='fs16A'>{e?.data?.rd[0]?.ActualGrossweight?.toFixed(3)}</b></div>
                                                                            <div className='prop16A wt16A'><b className='fs16A'>{e?.additional?.dia?.diaWt?.toFixed(3)}</b></div>
                                                                            <div className='prop16A wt16A'><b className='fs16A'>{(e.additional?.clr?.clrWt)?.toFixed(3)}</b></div>
                                                                            <div className='prop16A wt16A' style={{ borderBottom: "0px" }}><b className='fs16A'>{e?.data?.rd[0]?.createby}</b></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='img16A'><img src={e.additional.img !== "" ? e.additional.img : require("../../assets/img/default.jpg")} alt="" id="img16A" className="img16Aid" preload="auto" onError={e => handleImageError(e)} onLoad={e => handleImageLoad(e, i, data?.length)} loading="eager" /></div>
                                                        </div>
                                                    </div>
                                                    <div className='main16A'>
                                                        <div className='tableBarcdoe16A'>
                                                            <div className='hello'>
                                                                <div className='table16A'>
                                                                    <div className='thead16A'>
                                                                        <div className='mate16AD rmw16Apx'><div className='rmtype16A '><b style={{ width: "100%", display: "flex", justifyContent: "center" }}>RM TYPE</b></div></div>
                                                                        <div className='mate16AD qw16Apx'><div className='rmtype16A '><b style={{ width: "100%", display: "flex", justifyContent: "center" }}>QUALITY</b></div></div>
                                                                        <div className='mate16AD qw16Apx'><div className='rmtype16A '><b style={{ width: "100%", display: "flex", justifyContent: "center" }}>COLOR</b></div></div>
                                                                        <div className='mate16AD sw16Apx'><div className='rmtype16A '><b style={{ width: "100%", display: "flex", justifyContent: "center" }}>SIZE</b></div></div>
                                                                        <div className='mate16AD a16Apx'><div className='rmtype16A '><b style={{ width: "100%", display: "flex", justifyContent: "center" }}>ACTUAL</b></div></div>
                                                                        <div className='mate16AD w16Apx'><div className='rmtype16A '><b style={{ width: "100%", display: "flex", justifyContent: "center" }}>WT</b></div></div>
                                                                    </div>
                                                                </div>
                                                                {
                                                                    Array.from({ length: 14 }, (_, indexmt) => (
                                                                        <div className='table16A' key={indexmt}>
                                                                            <div className='thead16A'>
                                                                                <div className='mate16AD rmw16Apx'><div className='rmtype16A '></div></div>
                                                                                <div className='mate16AD qw16Apx'><div className='rmtype16A '></div></div>
                                                                                <div className='mate16AD qw16Apx'><div className='rmtype16A '></div></div>
                                                                                <div className='mate16AD sw16Apx'><div className='rmtype16A '></div></div>
                                                                                <div className='mate16AD a16Apx'><div className='actpcs16A '><div className='rmtype16A pcswtactual16A' style={{ borderRight: "1px solid black" }}></div><div className='rmtype16A pcswtactual16AA'></div></div></div>
                                                                                <div className='mate16AD w16Apx'><div className='rmtype16A '></div></div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                            <div className='barcode16A'>{e?.data?.rd[0]?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd[0]?.serialjobno ?? ''} />}</div>
                                                        </div>
                                                        <div>
                                                            <div style={{ borderTop: "0.5px solid black" }}>
                                                                <div className='issue16A'>
                                                                    <div className='rmtype16AE'></div>
                                                                    <div className='rmtype16AE'><b>GRAND</b></div>
                                                                    <div className='rmtype16AE'><b>FILLING</b></div>
                                                                    <div className='rmtype16AE'><b>EPD</b></div>
                                                                    <div className='rmtype16AE'><b>P.P.</b></div>
                                                                    <div className='rmtype16AE'><b>SET.</b></div>
                                                                    <div className='rmtype16AE'><b>F.P.</b></div>
                                                                    <div className='rmtype16AE' style={{ borderRight: "0px" }}><b>RHD-QC</b></div>
                                                                </div>
                                                                <div>
                                                                    <div className='issue16A'>
                                                                        <div className='rmtype16AE'>ISSUE</div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE' style={{ borderRight: "0px" }}></div>
                                                                    </div>
                                                                    <div className='issue16A'>
                                                                        <div className='rmtype16AE'>RECEIVE</div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE' style={{ borderRight: "0px" }}></div>
                                                                    </div>
                                                                    <div className='issue16A'>
                                                                        <div className='rmtype16AE'>PCS</div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE' style={{ borderRight: "0px" }}></div>
                                                                    </div>
                                                                    <div className='issue16A'>
                                                                        <div className='rmtype16AE'>SCRAP</div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE' style={{ borderRight: "0px" }}></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='footer16A'>
                                                        <div className='ins16A b16A' style={{ height: "27px" }}>DGN INS: {e?.data?.rd[0]?.officeuse?.slice(0, 100)}</div>
                                                        <div className='ins16A b16A' style={{ height: "27px" }}>PRD INS: {e?.data?.rd[0]?.ProductInstruction?.slice(0, 100)}</div>
                                                        <div className='ins16A b16A' style={{ borderBottom: "0px", height: "25px" }}>CUST INS: {e?.data?.rd[0]?.custInstruction?.slice(0, 100)}</div>
                                                    </div>
                                                </div>
                                            
                                        );
                                    } else {
                                        return e?.additional?.chdata?.length > 0 && e?.additional?.chdata?.map((chunk, indexnmt) => {

                                            return <React.Fragment key={indexnmt}>
                                                <div className='containerprint16A' >
                                                    <div className='head16A'>
                                                        <div className='header16A'>
                                                            <div className='headJob16A'>
                                                                <div className='header16AjobInfo'>
                                                                    <div className='job16A'><div><b style={{ fontSize: "12px" }}>{e?.data?.rd[0]?.serialjobno}</b></div><div>ORD: <b>{e?.data?.rd[0]?.orderDatef?.slice(0, 11)}</b></div><div>DUE:<b style={{ paddingRight: "1px" }}>{e?.data?.rd[0]?.promiseDatef?.slice(0, 11)}</b></div></div>
                                                                    <div className='job16A'><div>PARTY: <b>{e?.data?.rd[0]?.CustomerCode}</b></div><div><b style={{ paddingRight: "1px" }}>{e?.data?.rd[0]?.MetalType + " " + e?.data?.rd[0]?.MetalColorCo}</b></div> </div>
                                                                    <div className='job16A'><div>DGN:<b>{e?.data?.rd[0]?.Designcode}</b></div><div>ORD NO:- <b>{e?.data?.rd[0]?.OrderNo}</b></div></div>
                                                                    <div className='job16A'><div>SIZE:<b>{e?.data?.rd[0]?.Size}</b></div><div>PO: <b>{e?.data?.rd[0]?.PO?.slice(0, 6)}</b></div><div><b>{e?.data?.rd[0]?.prioritycode}</b></div></div>
                                                                </div>
                                                                <div className='header16AjobInfo2'>
                                                                    <div className='material16A'>
                                                                        <div className='mate16A'>
                                                                            <div className='prop16A pcs16Aw'><b className='fs16A '>NET WT:</b></div>
                                                                            <div className='prop16A pcs16Aw'><b className='fs16A '>DIA PCS:</b></div>
                                                                            <div className='prop16A pcs16Aw'><b className='fs16A '>CLR PCS:</b></div>
                                                                            <div className='prop16A pcs16Aw' style={{ borderBottom: "0px" }}><b className='fs16A'>QT NO :</b></div>
                                                                        </div>
                                                                        <div className='mate16A' style={{ width: "15rem" }}>
                                                                            <div className='prop16A wt16A'><b className='fs16A'>{(e?.data?.rd[0]?.netwt ?? 0).toFixed(3)}</b></div>
                                                                            <div className='prop16A wt16A'><b className='fs16A'>{e?.additional?.dia?.diaPcs === 0 ? 0 : e?.additional?.dia?.diaPcs}</b></div>
                                                                            <div className='prop16A wt16A'><b className='fs16A'>{e?.additional?.clr?.clrPcs === 0 ? 0 : e?.additional?.clr?.clrPcs}</b></div>
                                                                            <div className='prop16A wt16A' style={{ borderBottom: "0px" }}><b className='fs16A'>{e?.data?.rd[0]?.Quotation_SKUNo}</b></div>
                                                                        </div>
                                                                        <div className='mate16A'>
                                                                            <div className='prop16A grw16A'><b className='fs16A'>GR WT:</b></div>
                                                                            <div className='prop16A grw16A'><b className='fs16A'>DIA WT:</b></div>
                                                                            <div className='prop16A grw16A'><b className='fs16A'>CLR WT:</b></div>
                                                                            <div className='prop16A grw16A' style={{ borderBottom: "0px" }}><b className='fs16A'>CREATED BY:</b></div>
                                                                        </div>
                                                                        <div className='mate16A' style={{ borderRight: "0px solid", width: "13rem" }}>
                                                                            <div className='prop16A wt16A'><b className='fs16A'>{e?.data?.rd[0]?.ActualGrossweight?.toFixed(3)}</b></div>
                                                                            <div className='prop16A wt16A'><b className='fs16A'>{(e?.additional?.dia?.diaWt === 0 ? 0 : e?.additional?.dia?.diaWt).toFixed(3)}</b></div>
                                                                            <div className='prop16A wt16A'><b className='fs16A'>{(e?.additional?.clr?.clrWt === 0 ? 0 : e.additional?.clr?.clrWt).toFixed(3)}</b></div>
                                                                            <div className='prop16A wt16A' style={{ borderBottom: "0px" }}><b className='fs16A'>{e?.data?.rd[0]?.createby}</b></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='img16A'>
                                                                <img src={e.additional.img !== "" ? e.additional.img : require("../../assets/img/default.jpg")} alt="" className="img16Aid" preload="auto" onError={e => handleImageError(e)} onLoad={e => handleImageLoad(e, i, data?.length)} loading="eager" id='img16A' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='main16A'>
                                                        <div className='tableBarcdoe16A'>
                                                            <div className='hello'>
                                                                <div className='table16A'>
                                                                    <div className='thead16A'>
                                                                        <div className='mate16AD rmw16Apx'><div className='rmtype16A'><b style={{ width: "100%", display: "flex", justifyContent: "center" }}>RM TYPE</b></div></div>
                                                                        <div className='mate16AD qw16Apx'><div className='rmtype16A'><b style={{ width: "100%", display: "flex", justifyContent: "center" }}>QUALITY</b></div></div>
                                                                        <div className='mate16AD qw16Apx'><div className='rmtype16A'><b style={{ width: "100%", display: "flex", justifyContent: "center" }}>COLOR</b></div></div>
                                                                        <div className='mate16AD sw16Apx'><div className='rmtype16A'><b style={{ width: "100%", display: "flex", justifyContent: "center" }}>SIZE</b></div></div>
                                                                        <div className='mate16AD a16Apx'><div className='rmtype16A'><b style={{ width: "100%", display: "flex", justifyContent: "center" }}>ACTUAL</b></div></div>
                                                                        <div className='mate16AD w16Apx'><div className='rmtype16A'><b style={{ width: "100%", display: "flex", justifyContent: "center" }}>WT</b></div></div>
                                                                    </div>
                                                                </div>
                                                                {
                                                                    chunk?.data?.map((e, indexmap) => {
                                                                        return (
                                                                            
                                                                                <div className='table16A' key={indexmap}>
                                                                                    <div className='thead16A'>
                                                                                        {e?.Shapename === "TOTAL" ? <div className='mate16AD rmw16Apx'><div className='rmtype16A'><b style={{ fontSize: "9.5px" }}>{e?.Shapename?.slice(0, 15)}</b></div></div> : <div className='mate16AD rmw16Apx'><div className='rmtype16A'>{e?.Shapename?.slice(0, 15)}</div></div>}
                                                                                        <div className='mate16AD qw16Apx'><div className='rmtype16A '>{e?.QualityCode?.slice(0, 9)}</div></div>
                                                                                        <div className='mate16AD qw16Apx'><div className='rmtype16A '>{e?.MetalColor?.slice(0, 9)}</div></div>
                                                                                        <div className='mate16AD sw16Apx'><div className='rmtype16A '>{e?.Sizename?.slice(0, 15)}</div></div>
                                                                                        {e?.Shapename === "TOTAL" ?
                                                                                            <div className='mate16AD a16Apx'>
                                                                                                <div className='actpcs16A '>
                                                                                                    <div className='rmtype16A pcswtactual16A' style={{ borderRight: "1px solid black" }}><b style={{ fontSize: "8.5px", display: "flex", justifyContent: "flex-end", width: "100%", paddingRight: "1px" }}>{(e?.ActualPcs)?.toString()}</b></div>
                                                                                                    <div className='rmtype16A pcswtactual16AA'><b style={{ fontSize: "8.5px", width: "100%", lineHeight: "7px", display: "flex", justifyContent: "flex-end", alignItems: "center", paddingRight: "1px" }}>{((e?.ActualWeight)?.toFixed(3))?.toString()}</b></div>
                                                                                                </div>
                                                                                            </div> :
                                                                                            <div className='mate16AD a16Apx'>
                                                                                                <div className='actpcs16A '>
                                                                                                    <div className='rmtype16A pcswtactual16A' style={{ borderRight: "1px solid black", fontSize: "8.5px", display: "flex", justifyContent: "flex-end", paddingRight: "1px" }}>{(e?.ActualPcs)}</div>
                                                                                                    <div className='rmtype16A pcswtactual16AA' style={{ display: "flex", justifyContent: "flex-end", fontSize: "8.5px", alignItems: "center", paddingRight: "1px" }}>{((e?.ActualWeight)?.toFixed(3))?.toString()}</div>
                                                                                                </div>
                                                                                            </div>}
                                                                                        <div className='mate16AD w16Apx'><div className='rmtype16A '></div></div>
                                                                                    </div>
                                                                                </div>
                                                                            
                                                                        );
                                                                    })
                                                                }
                                                                {
                                                                    Array.from({ length: chunk?.length }, (_, nth) => (
                                                                        <div className='table16A' key={nth}>
                                                                            <div className='thead16A'>
                                                                                <div className='mate16AD rmw16Apx'><div className='rmtype16A'></div></div>
                                                                                <div className='mate16AD qw16Apx'><div className='rmtype16A'></div></div>
                                                                                <div className='mate16AD qw16Apx'><div className='rmtype16A'></div></div>
                                                                                <div className='mate16AD sw16Apx'><div className='rmtype16A'></div></div>
                                                                                <div className='mate16AD a16Apx'><div className='actpcs16A'><div className='rmtype16A pcswtactual16A' style={{ borderRight: "1px solid black" }}></div><div className='rmtype16A pcswtactual16AA'></div></div></div>
                                                                                <div className='mate16AD w16Apx'><div className='rmtype16A'></div></div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                            <div className='barcode16A'> {e?.data?.rd1[0]?.SerialJobno !== undefined && <BarcodeGenerator data={e?.data?.rd1[0]?.SerialJobno} />}</div>
                                                        </div>
                                                        <div>
                                                            <div style={{ borderTop: "0.5px solid black" }}>
                                                                <div className='issue16A'>
                                                                    <div className='rmtype16AE'></div>
                                                                    <div className='rmtype16AE'><b>GRAND</b></div>
                                                                    <div className='rmtype16AE'><b>FILLING</b></div>
                                                                    <div className='rmtype16AE'><b>EPD</b></div>
                                                                    <div className='rmtype16AE'><b>P.P.</b></div>
                                                                    <div className='rmtype16AE'><b>SET.</b></div>
                                                                    <div className='rmtype16AE'><b>F.P.</b></div>
                                                                    <div className='rmtype16AE' style={{ borderRight: "0px" }}><b>RHD-QC</b></div>
                                                                </div>
                                                                <div>
                                                                    <div className='issue16A'>
                                                                        <div className='rmtype16AE'>ISSUE</div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE' style={{ borderRight: "0px" }}></div>
                                                                    </div>
                                                                    <div className='issue16A'>
                                                                        <div className='rmtype16AE'>RECEIVE</div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE' style={{ borderRight: "0px" }}></div>
                                                                    </div>
                                                                    <div className='issue16A'>
                                                                        <div className='rmtype16AE'>PCS</div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE' style={{ borderRight: "0px" }}></div>
                                                                    </div>
                                                                    <div className='issue16A'>
                                                                        <div className='rmtype16AE'>SCRAP</div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE'></div>
                                                                        <div className='rmtype16AE' style={{ borderRight: "0px" }}></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='footer16A'>
                                                        <div className='ins16A b16A' style={{ height: "27px" }}>DGN INS: {e?.data?.rd[0]?.officeuse?.slice(0, 100)}</div>
                                                        <div className='ins16A b16A' style={{ height: "27px" }}>PRD INS: {e?.data?.rd[0]?.ProductInstruction?.slice(0, 100)}</div>
                                                        <div className='ins16A b16A' style={{ borderBottom: "0px", height: "25px" }}>CUST INS: {e?.data?.rd[0]?.custInstruction?.slice(0, 100)}</div>
                                                    </div>
                                                </div>
                                            </React.Fragment>;
                                        });

                                    }
                                })}
                        </div>
                    </>
                }

            </div>
        </>
    );
};

export default BagPrint16A;