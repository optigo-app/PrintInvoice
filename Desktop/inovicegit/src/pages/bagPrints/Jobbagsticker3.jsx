import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "../../assets/css/bagprint/jobbagsticker3.css";
import Loader from '../../components/Loader';
import BarcodeStickerGen from './BarcodeStickerGen';
import { GetData } from './../../GlobalFunctions/GetData';
import { organizeData } from './../../GlobalFunctions/OrganizeBagPrintData';
import { GetUniquejob } from '../../GlobalFunctions/GetUniqueJob';
import { handleImageError } from '../../GlobalFunctions/HandleImageError';
import { handlePrint } from '../../GlobalFunctions/HandlePrint';
import { checkInstruction } from '../../GlobalFunctions';

function Jobbagsticker3({ queries, headers }) {
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    const resultString = GetUniquejob(queryParams?.str_srjobno);
    const [data, setData] = useState([]);
    useEffect(() => {
        if (Object.keys(queryParams)?.length !== 0) {
            atob(queryParams?.imagepath);
        }
    }, [queryParams]);
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
                  let allDatas = await GetData(objs);
          
                  let datas = organizeData(allDatas?.rd, allDatas?.rd1);

                  // eslint-disable-next-line array-callback-return
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
                    let ArrofSevenSize = [];
                    let ArrofFiveSize = [];
                    // eslint-disable-next-line array-callback-return
                    a?.rd1?.map((e, i) => {
                        if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
                            length++;
                        }
                        if (e?.MasterManagement_DiamondStoneTypeid === 3) {
                            dia.diaPcs = dia.diaPcs + e?.ActualPcs;
                            dia.diaWt = dia.diaWt + e?.ActualWeight;
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
                            clr.clrPcs = clr.clrPcs + e?.ActualPcs;
                            clr.clrWt = clr.clrWt + e?.ActualWeight;
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
                            misc.miscWt = misc.miscWt + e?.ActualWeight;
                        }
                        if (e?.MasterManagement_DiamondStoneTypeid === 3) {
                            ArrofSevenSize.push(e);
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
                            ArrofFiveSize.push(e);
                        } else {
                            return '';
                        }
                    });
                    let imagePath = queryParams?.imagepath;
                    imagePath = atob(queryParams?.imagepath);
                    
                    let img = imagePath + a?.rd?.ThumbImagePath;
                    responseData.push({ data: a, additional: { length: length, clr: clr, dia: dia, img: img, misc: misc } });


                  })
                setData(responseData);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (data?.length !== 0) {
            setTimeout(() => {
                window.print();
            }, 4000);
        }
}, [data]);

    return (
        <>
            {
                data.length === 0 ? <Loader /> : <><div className="print_btn"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
                    Print
                </button></div>
                <div className='pad_60_allPrint'>

                
                    {Array.from({ length: queries?.pageStart }, (_, index) => (
                        index > 0 && <div key={index} className="container  ml_5 mb_10"></div>
                    ))}
                    {
                        data?.length > 0 ? 
                            <div className='container_job_bag_sticker_3'>
                                {
                                    data?.map((e, i) => {
                                        return (
                                            <div className='bag_space' key={i}>
                                                <div className="heading_job_3">
                                                    <div className='img_aside_3'>
                                                        <div className='img_job3'><img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} alt="" onError={e => handleImageError(e)} loading="eager" id='jobsticker3' /></div>
                                                        <div className='ins_3' >
                                                            <h1 className='h1_3' style={{ lineHeight: "28px" }}>{(" " + checkInstruction(e?.data?.rd?.ProductInstruction))?.slice(0, 62) }</h1>
                                                        </div>
                                                    </div>
                                                    <div className='databarcode_3' style={{position:"relative"}}>
                                                        <div className='data_center_3'>
                                                            <h1 className='h1_3'> {e?.data?.rd?.serialjobno}</h1>
                                                            <h1 className='h1_3'> {e?.data?.rd?.Designcode}</h1>
                                                            <h1 className='h1_3'> {e?.data?.rd?.MetalType}</h1>
                                                            <h1 className='h1_3'> {e?.data?.rd?.MetalColorCo}</h1>
                                                            <h1 className='h1_3'> {e?.data?.rd?.category}</h1>
                                                            <h1 className='h1_3'> {e?.data?.rd?.CustomerCode}</h1>
                                                        </div>
                                                        <div style={{ position: "absolute", right: "-13px" }}>
                                                            {(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd?.serialjobno !== undefined && <BarcodeStickerGen data={e?.data?.rd?.serialjobno} />}</>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                         : 'Data Not Found!'
                    }
                    </div>
                </>
            }
        </>
    );
}

export default Jobbagsticker3;