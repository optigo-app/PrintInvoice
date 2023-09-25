import axios from 'axios';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "../../assets/css/bagprint/jobbagsticker3.css";
import Loader from '../../components/LoaderBag';
import BarcodeStickerGen from './BarcodeStickerGen';

function Jobbagsticker3({ queries, headers }) {
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    let jobs = queryParams.str_srjobno;
    if (Object.keys(queryParams).length !== 0) {
        jobs = jobs.split(",");
    }
    const [print, setPrint] = useState(jobs);
    const [data, setData] = useState([]);
    useEffect(() => {
        if (Object.keys(queryParams).length !== 0) {
            atob(queryParams.imagepath);
        }
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = [];
                for (const url in print) {

                    let p_tag = { "SerialJobno": `${print[url]}`, "customerid": `${queries.custid}`, "BagPrintName": `${queries.printname}` };
                    let jsonString = JSON.stringify(p_tag);
                    let base64String = btoa(jsonString);
                    let Body = {
                        "con": `{\"id\":\"\",\"mode\":\"${queries.printname}\",\"appuserid\":\"${queries.appuserid}\"}`,
                        "p": `${base64String}`,
                        "f": `${queries.appuserid} ${queries.printname}`
                    };
                    const urls = atob(queries.url);
                    const response = await axios.post(urls, Body, { headers: headers });
                    let datas = JSON.parse(response.data.d);
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
                    let ArrofSevenSize = [];
                    //arr for colorstone
                    let ArrofFiveSize = [];
                    datas.rd1.map((e, i) => {
                        if (e.ConcatedFullShapeQualityColorCode !== "- - - ") {
                            length++;
                        }
                        if (e.MasterManagement_DiamondStoneTypeid === 3) {
                            dia.diaPcs = dia.diaPcs + e.ActualPcs;
                            dia.diaWt = dia.diaWt + e.ActualWeight;
                        } else if (e.MasterManagement_DiamondStoneTypeid === 4) {
                            clr.clrPcs = clr.clrPcs + e.ActualPcs;
                            clr.clrWt = clr.clrWt + e.ActualWeight;
                        } else if (e.MasterManagement_DiamondStoneTypeid === 7) {
                            misc.miscWt = misc.miscWt + e.ActualWeight;
                        }
                        if (e.MasterManagement_DiamondStoneTypeid === 3) {
                            ArrofSevenSize.push(e);
                        } else if (e.MasterManagement_DiamondStoneTypeid === 4) {
                            ArrofFiveSize.push(e);
                        } else {
                            return '';
                        }
                    });
                    let imagePath = queryParams.imagepath;
                    imagePath = atob(queryParams.imagepath);
                    try {
                        let cutProductIns = datas?.rd[0]?.ProductInstruction ?? '';
                        let cutProductionInstruction = cutProductIns.slice(0, 61);
                        datas.rd[0].ProductInstruction = cutProductionInstruction;
                    } catch (error) {
                        console.log(error);
                    }
                    let img = imagePath + datas.rd[0].ThumbImagePath;
                    responseData.push({ data: datas, additional: { length: length, clr: clr, dia: dia, img: img, misc: misc } });
                }
                setData(responseData);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);
    const handleImageError = (e) => {
        try {
            e.target.src = require("../bags/default.jpg");
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (data.length !== 0) {
            setTimeout(() => {
                window.print();
            }, 4000);
        }
    }, [data]);
    const handlePrint = (e) => {
        e.preventDefault();
        window.print();
    };

    // Check if the 'str' variable is not null before accessing its 'length' property
    return (
        <>
            {
                data.length === 0 ? <Loader /> : <><div className="print_btn"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
                    Print
                </button></div>

                    {Array.from({ length: queries.pageStart }, (_, index) => (
                        index > 0 && <div key={index} className="container  ml_5 mb_10"></div>
                    ))}
                    {
                        data.length > 0 ? <>
                            <div className='container_job_bag_sticker_3'>
                                {
                                    data.map((e, i) => {
                                        return (
                                            <div className='bag_space' key={i}>
                                                <div className="heading_job_3">
                                                    <div className='img_aside_3'>
                                                        <div className='img_job3'><img src={e.additional.img !== "" ? e.additional.img : require("../../assets/img/default.jpg")} alt="" onError={e => handleImageError(e)} loading="lazy" id='jobsticker3' /></div>
                                                        <div className='ins_3' >
                                                            <h1 className='h1_3' style={{ lineHeight: "28px" }}>{e.data.rd[0].ProductInstruction ?? ''}</h1>
                                                        </div>
                                                    </div>
                                                    <div className='databarcode_3'>
                                                        <div className='data_center_3'>
                                                            <h1 className='h1_3'> {e.data.rd[0].serialjobno}</h1>
                                                            <h1 className='h1_3'> {e.data.rd[0].Designcode}</h1>
                                                            <h1 className='h1_3'> {e.data.rd[0].MetalType}</h1>
                                                            <h1 className='h1_3'> {e.data.rd[0].MetalColorCo}</h1>
                                                            <h1 className='h1_3'> {e.data.rd[0].category}</h1>
                                                            <h1 className='h1_3'> {e.data.rd[0].CustomerCode}</h1>
                                                        </div>
                                                        <div style={{ position: "absolute", right: "-13px" }}>
                                                            {(e.data.rd.length !== 0 && e.data.rd !== undefined) && <>{e.data.rd[0].serialjobno !== undefined && <BarcodeStickerGen data={e.data.rd[0].serialjobno} />}</>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </> : ''
                    }
                </>
            }
        </>
    );
}

export default Jobbagsticker3;