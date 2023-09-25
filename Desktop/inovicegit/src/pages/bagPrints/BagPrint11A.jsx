import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import "../../assets/css/bagprint/print11A.css";
import BarcodeGenerator from '../../components/BarcodeGenerator';
import Loader from '../../components/LoaderBag';
import { GetData } from '../../GlobalFunctions/GetData';
import { GetChunkData } from '../../GlobalFunctions/GetChunkData';
import { formatDate } from '../../GlobalFunctions/DateFormat';
import { handlePrint } from '../../GlobalFunctions/HandlePrint';
import { handleImageError } from '../../GlobalFunctions/HandleImageError';

const BagPrint11A = ({ queries, headers }) => {
    const [data, setData] = useState([]);
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    let jobs = queryParams.str_srjobno;
    if (Object.keys(queryParams).length !== 0) {
        jobs = jobs.split(",");
    }

    const [print, setPrint] = useState(jobs);
    const chunkSize17 = 8;

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

                    ArrofSevenSize.push(dia);
                    ArrofFiveSize.push(clr);
                    ArrofFSize.push(f);
                    ArrofMISize.push(misc);

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
                    //     let len = 8 - (mainArr.slice(i, i + chunkSize17)).length;
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


    return (
        <>
            {
                data.length === 0 ? <Loader /> : <><div className="print_btn"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
                    Print
                </button></div>


                    <div className='print11A'>
                        {Array.from({ length: queries?.pageStart }, (_, index) => (
                            index > 0 && <div key={index} className="container11A" style={{border:"0px"}}></div>
                        ))}
                        {
                            data.length > 0 && data.map((e, i) => {
                                return (
                                    <>
                                        <div className='container11A'>
                                            <div className='header11A'>
                                                <div className='jobInfo11A'>
                                                    <div className='jobRow11A'>
                                                        <div><b>{e?.data?.rd[0]?.serialjobno}</b></div>
                                                        <div><b>{e?.data?.rd[0]?.Designcode}</b></div>
                                                        <div><b style={{ paddingRight: "3px" }}>{e?.data?.rd[0]?.MetalType} {e?.data?.rd[0]?.MetalColorCo}</b></div>
                                                        

                                                    </div>
                                                    <div className='jobHead11A'>
                                                        <div className='border11A c11A'>PRIORITY</div>
                                                        <div className='border11A c11A'>LOC.</div>
                                                        <div className='border11A c11A'>Q.C.</div>
                                                    </div>
                                                    <div className='infoFlex11A'>
                                                        <div className='info11A'>
                                                            <div className='flex11A'><p className='p11A'>SALES REP.</p><p className='p11A'>{e?.data?.rd[0]?.SalesrepCode}</p></div>
                                                            <div className='flex11A'><p className='p11A'>CUSTOMER</p><p className='p11A'>{e?.data?.rd[0]?.CustomerCode}</p></div>
                                                            <div className='flex11A'><p className='p11A'>SIZE</p><p className='p11A'>{e?.data?.rd[0]?.Size}</p></div>
                                                        </div>
                                                        <div className='info11A'>
                                                            <div className='flex11A'><p className='p11A'>ORDER DATE</p><p className='p11A'>{e?.data?.rd[0]?.orderDatef ?? ''}</p></div>
                                                            <div className='flex11A'><p className='p11A'>DEL DATE</p><p className='p11A'>{e?.data?.rd[0]?.promiseDatef ?? ''}</p></div>
                                                            <div className='flex11A'><p className='p11A'>NET WT</p><p className='p11A'>{e?.data?.rd[0]?.netwt?.toFixed(3)}</p></div>
                                                        </div>
                                                    </div>
                                                    <div className='jobHead11A'>
                                                        <div className='border11A c11A'>TR NO.</div>
                                                        <div className='border11A c11A'>TR NO.</div>
                                                        <div className='border11A c11A'>TR NO.</div>
                                                    </div>
                                                    <div className='jobHead11A'>
                                                        <div className='border11A c11A'>TR WT.</div>
                                                        <div className='border11A c11A'>TR WT.</div>
                                                        <div className='border11A c11A'>TR WT.</div>
                                                    </div>
                                                </div>
                                                <div className='img11A'>
                                                    <img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} id="img11A" alt="" onError={e => handleImageError(e)} loading="eager"  /></div>
                                            </div>
                                            <div className='main11A'>
                                                <div className='bar11A'>
                                                    <div className='mainSet11A'>
                                                        <div className='tablehead11A'>
                                                            <div className='tHead11A' style={{ borderBottom: "1px solid #989898" }}>
                                                                <div className='sideHead11A'>DEPT</div>
                                                                <div className='sideHead11B'>ISSUE</div>
                                                                <div className='sideHead11B'>RECEIVE</div>
                                                                <div className='sideHead11B'>SCRAP</div>
                                                                <div className='sideHead11C'>PCS</div>
                                                                <div className='sideHead11B'>WORKER</div>
                                                            </div>
                                                            <div className='tHead11A '>
                                                                <div className='sideHead11A'>MLT.</div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11C'></div>
                                                                <div className='sideHead11B'></div>
                                                            </div>
                                                            <div className='tHead11A'>
                                                                <div className='sideHead11A'>TP.</div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11C'></div>
                                                                <div className='sideHead11B'></div>
                                                            </div>
                                                            <div className='tHead11A'>
                                                                <div className='sideHead11A'>FLC.</div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11C'></div>
                                                                <div className='sideHead11B'></div>
                                                            </div>
                                                            <div className='tHead11A'>
                                                                <div className='sideHead11A'>CNC.</div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11C'></div>
                                                                <div className='sideHead11B'></div>
                                                            </div>
                                                            <div className='tHead11A'>
                                                                <div className='sideHead11A'>FIL.</div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11C'></div>
                                                                <div className='sideHead11B'></div>
                                                            </div>
                                                            <div className='tHead11A'>
                                                                <div className='sideHead11A'>HM.</div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11C'></div>
                                                                <div className='sideHead11B'></div>
                                                            </div>
                                                            <div className='tHead11A'>
                                                                <div className='sideHead11A'>TNG.</div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11C'></div>
                                                                <div className='sideHead11B'></div>
                                                            </div>
                                                            <div className='tHead11A'>
                                                                <div className='sideHead11A '>PLH.</div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11B'></div>
                                                                <div className='sideHead11C'></div>
                                                                <div className='sideHead11B'></div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className='barcode11A'>
                                                    {/* <div className=''> */}
                                                        {(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd[0]?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd[0]?.serialjobno} />}</>}
                                                    </div>
                                                </div>
                                                <div className='ins11A'>
                                                    <div className='ins11A1'><div className='sls11A'>SLS. INS.</div><div className='insVal11A'></div></div>
                                                    <div className='ins11A1'><div className='sls11A'>PRD. INS.</div><div className='insVal11A'></div></div>
                                                    <div className='ins11A1' style={{ borderBottom: "0px" }}><div className='sls11A'>QC. INS.</div><div className='insVal11A'></div></div>
                                                </div>
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

export default BagPrint11A;