import React, { useEffect, useState } from 'react';
import "../../assets/css/bagprint/print12A.css";
import BarcodeGenerator from '../../components/BarcodeGenerator';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Loader from '../../components/LoaderBag';
import { GetData } from '../../GlobalFunctions/GetData';
import { handlePrint } from '../../GlobalFunctions/HandlePrint';
import { handleImageError } from '../../GlobalFunctions/HandleImageError';
import { organizeData } from '../../GlobalFunctions/OrganizeBagPrintData';

const BagPrint12A = ({ queries, headers }) => {

    const [data, setData] = useState([]);
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    let jobs = queryParams.str_srjobno;
    const parts = jobs.split(",");
    const resultString = parts.map((part) => `'${part}'`).join(",");
    if (Object.keys(queryParams).length !== 0) {
        jobs = jobs.split(",");
    }

    const [print, setPrint] = useState(jobs);
    // const handleImageError = (e) => {
    //     e.target.src = require('../../assets/img/default.jpg');
    // };
    useEffect(() => {
        if (Object.keys(queryParams).length !== 0) {
            atob(queryParams.imagepath);
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
          
                  const allDatas = await GetData(objs);
                  let datas = organizeData(allDatas?.rd, allDatas?.rd1);

                datas?.map((a) => {
                    let chunkData = [];
                    let chunkSize = 8;
                    let length = 0;
                    let clr = {
                        Shapename: "TOTAL",
                        Sizename: "",
                        ActualPcs: 0,
                        ActualWeight: 0,
                    };
                    let dia = {
                        Shapename: "TOTAL",
                        Sizename: "",
                        ActualPcs: 0,
                        ActualWeight: 0,
                    };
                    let misc = {
                        Shapename: "TOTAL",
                        Sizename: "",
                        ActualPcs: 0,
                        ActualWeight: 0,
                    };
                    let f = {
                        Shapename: "TOTAL",
                        Sizename: "",
                        ActualPcs: 0,
                        ActualWeight: 0,
                    };
                    a?.rd1?.map((e, i) => {
                        if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
                            length++;
                        }
                        if (e?.MasterManagement_DiamondStoneTypeid === 3) {
                            dia.ActualPcs = dia.ActualPcs + e?.ActualPcs;
                            dia.ActualWeight = dia.ActualWeight + e?.ActualWeight;
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
                            clr.ActualPcs = clr.ActualPcs + e?.ActualPcs;
                            clr.ActualWeight = clr.ActualWeight + e?.ActualWeight;
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 5) {
                            f.ActualPcs = f.ActualPcs + e?.ActualPcs;
                            f.ActualWeight = f.ActualWeight + e?.ActualWeight;
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
                            misc.ActualPcs = misc.ActualPcs + e?.ActualPcs;
                            misc.ActualWeight = misc.ActualWeight + e?.ActualWeight;
                        }
                    });
                    let obj = { ...a };
                    if (obj?.rd !== {}) {
                        obj.rd.instructionData = (obj?.rd?.officeuse + obj?.rd?.custInstruction + obj?.rd?.ProductInstruction)?.substring(0, 113);
                    }
                    
                    let imagePath = queryParams?.imagepath;
                    imagePath = atob(queryParams?.imagepath);
                    let img = imagePath + a?.rd?.ThumbImagePath;
                    for (let i = 0; i < (a?.rd1)?.length; i += chunkSize) {
                        const chunks = (a?.rd1).slice(i, i + chunkSize);
                        let len = 8 - ((a?.rd1).slice(i, i + chunkSize))?.length;
                        chunkData.push({ data: chunks, length: len });
                    }
                    let arrData = a?.rd1?.filter((e, i) => e?.MasterManagement_DiamondStoneTypeid !== 0);
                    let blankData = [];
                    for (let i = 0; i < (arrData).length; i += chunkSize) {
                        const chunks = (arrData).slice(i, i + chunkSize);
                        let blankArr = [];
                        for (let j = 0; j < chunks.length; j += 4) {
                            const sliceChunks = chunks.slice(j, j + 4);
                            let len = 4 - (sliceChunks).length;
                            blankArr.push({ data: sliceChunks, length: len });
                        }
                        if (blankArr?.length === 1) {
                            blankArr.push({ data: [], length: 4 });
                        }
                        blankData.push(blankArr);
                    }
                    responseData.push({ data: obj.rd, additional: { length: length, clr: clr, dia: dia, f: f, img: img, misc: misc, page: chunkData, pages: blankData } });
                })


                // for (let url in print) {
                //     let chunkData = [];
                //     let chunkSize = 8;
                //     const objs = {
                //         jobno: print[url],
                //         custid: queries.custid,
                //         printname: queries.printname,
                //         appuserid: queries.appuserid,
                //         url: queries.url,
                //         headers: headers,
                //     };
                //     let datas = await GetData(objs);
                    
                //     // let p_tag = { "SerialJobno": `${print[url]}`, "customerid": `${queries.custid}`, "BagPrintName": `${queries.printname}` };
                //     // let jsonString = JSON.stringify(p_tag);
                //     // let base64String = btoa(jsonString);
                //     // let Body = {
                //     //     "con": `{\"id\":\"\",\"mode\":\"${queries.printname}\",\"appuserid\":\"${queries.appuserid}\"}`,
                //     //     "p": `${base64String}`,
                //     //     "f": `${queries.appuserid} ${queries.printname}`
                //     // };
                //     // let urls = atob(queries.url);
                //     // const response = await axios.post(urls, Body, { headers: headers });
                //     // let datas = JSON.parse(response.data.d);

                //     let length = 0;
                //     let clr = {
                //         Shapename: "TOTAL",
                //         Sizename: "",
                //         ActualPcs: 0,
                //         ActualWeight: 0,
                //     };
                //     let dia = {
                //         Shapename: "TOTAL",
                //         Sizename: "",
                //         ActualPcs: 0,
                //         ActualWeight: 0,
                //     };
                //     let misc = {
                //         Shapename: "TOTAL",
                //         Sizename: "",
                //         ActualPcs: 0,
                //         ActualWeight: 0,
                //     };
                //     let f = {
                //         Shapename: "TOTAL",
                //         Sizename: "",
                //         ActualPcs: 0,
                //         ActualWeight: 0,
                //     };
                //     datas?.rd1?.map((e, i) => {
                //         if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
                //             length++;
                //         }
                //         if (e?.MasterManagement_DiamondStoneTypeid === 3) {
                //             dia.ActualPcs = dia.ActualPcs + e.ActualPcs;
                //             dia.ActualWeight = dia.ActualWeight + e.ActualWeight;
                //         } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
                //             clr.ActualPcs = clr.ActualPcs + e.ActualPcs;
                //             clr.ActualWeight = clr.ActualWeight + e.ActualWeight;
                //         } else if (e?.MasterManagement_DiamondStoneTypeid === 5) {
                //             f.ActualPcs = f.ActualPcs + e.ActualPcs;
                //             f.ActualWeight = f.ActualWeight + e.ActualWeight;
                //         } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
                //             misc.ActualPcs = misc.ActualPcs + e.ActualPcs;
                //             misc.ActualWeight = misc.ActualWeight + e.ActualWeight;
                //         }
                //     });
                //     let obj = { ...datas };
                //     if (obj?.rd?.length > 0) {
                //         obj.rd[0].instructionData = (datas?.rd[0]?.["officeuse"] + datas?.rd[0]?.["custInstruction"] + datas?.rd[0]?.["ProductInstruction"])?.substring(0, 113);
                //     }
                //     let imagePath = queryParams?.imagepath;
                //     imagePath = atob(queryParams?.imagepath);
                //     let img = imagePath + datas?.rd[0]?.ThumbImagePath;
                //     for (let i = 0; i < (datas?.rd1).length; i += chunkSize) {
                //         const chunks = (datas?.rd1).slice(i, i + chunkSize);
                //         let len = 8 - ((datas?.rd1).slice(i, i + chunkSize)).length;
                //         chunkData.push({ data: chunks, length: len });
                //     }
                //     let arrData = datas?.rd1.filter((e, i) => e?.MasterManagement_DiamondStoneTypeid !== 0);
                //     let blankData = [];
                //     for (let i = 0; i < (arrData).length; i += chunkSize) {
                //         const chunks = (arrData).slice(i, i + chunkSize);
                //         let blankArr = [];
                //         for (let j = 0; j < chunks.length; j += 4) {
                //             const sliceChunks = chunks.slice(j, j + 4);
                //             let len = 4 - (sliceChunks).length;
                //             blankArr.push({ data: sliceChunks, length: len });
                //         }
                //         if (blankArr.length === 1) {
                //             blankArr.push({ data: [], length: 4 });
                //         }
                //         blankData.push(blankArr);
                //     }
                //     responseData.push({ data: obj.rd[0], additional: { length: length, clr: clr, dia: dia, f: f, img: img, misc: misc, page: chunkData, pages: blankData } });
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

    console.log(data);
}, [data]);
    return (
        <>
            {
                data.length === 0 ? <Loader /> : <>
                    <section className='print_12A'>
                        <div className="print_btn d-flex justify-content-end">
                            <button className="btn_white blue print_btn " onClick={(e) => handlePrint(e)}>
                                Print
                            </button>
                        </div>
                        <div className="print_12A_flex pad_60_allPrint">
                            {Array.from({ length: queries?.pageStart }, (_, index) => (
                                index > 0 && <div key={index} className="section_12A"></div>
                            ))}
                            {
                                data?.length > 0 && data?.map((e, i) => {
                                    return (
                                        <>
                                            {
                                                e?.additional?.pages?.length > 0 ? e?.additional?.pages?.map((ele, ind) => {
                                                    return (
                                                        <>
                                                            <div className="section_12A" key={ind}>
                                                                <div className="container_12A">
                                                                    <div className="job_no_12A">
                                                                        <div className="design_no_12A bg12fs">
                                                                            Bag#:{e?.data?.serialjobno}
                                                                        </div>
                                                                        <div className="blank_12A">

                                                                        </div>
                                                                        <div className="design_m3_12A bg12fs">
                                                                            Design#:{e?.data?.Designcode}
                                                                        </div>
                                                                    </div>
                                                                    <div className="d_flex">
                                                                        <div className="order_no_sec_12A">
                                                                            <div className="order_no_12A border_bottom_2_12A">
                                                                                <div className="order_no_text_12A border_right_2_12A">
                                                                                    ORDER NO.
                                                                                </div>
                                                                                <div className="testing_text_12A border_right_2_12A">
                                                                                    {e?.data?.PO}
                                                                                </div>
                                                                                <div className="metal_col_12A border_right_2_12A">
                                                                                    METAL COL/KT
                                                                                </div>
                                                                                <div className="gold_18k_12A border_right_2_12A">
                                                                                    {e?.data?.MetalType} {e?.data?.MetalColorCo}
                                                                                </div>
                                                                            </div>
                                                                            <div className="order_no_12A border_bottom_2_12A">
                                                                                <div className="order_no_text_12A border_right_2_12A">
                                                                                    ORDER DATE.
                                                                                </div>
                                                                                <div className="testing_text_12A border_right_2_12A">
                                                                                    {e?.data?.OrderDate}
                                                                                </div>
                                                                                <div className="metal_col_12A border_right_2_12A">
                                                                                    GROSS WT
                                                                                </div>
                                                                                <div className="gold_18k_12A border_right_2_12A">
                                                                                    {/* {e?.data?.ActualGrossweight} */}
                                                                                </div>
                                                                            </div>
                                                                            <div className="order_no_12A border_bottom_2_12A">
                                                                                <div className="order_no_text_12A border_right_2_12A">
                                                                                    CLIENT CODE
                                                                                </div>
                                                                                <div className="testing_text_12A border_right_2_12A">
                                                                                    {/* {e?.data?.CustomerCode} */}
                                                                                </div>
                                                                                <div className="metal_col_12A border_right_2_12A">
                                                                                    NET WT
                                                                                </div>
                                                                                <div className="gold_18k_12A border_right_2_12A">
                                                                                    {/* {e?.data?.netwt} */}
                                                                                </div>
                                                                            </div>
                                                                            <div className="order_no_12A border_bottom_2_12A">
                                                                                <div className="order_no_text_12A border_right_2_12A">
                                                                                    SIZE INST
                                                                                </div>
                                                                                <div className="testing_text_12A border_right_2_12A">

                                                                                </div>
                                                                                <div className="metal_col_12A border_right_2_12A">
                                                                                    DIA PCS/WT
                                                                                </div>
                                                                                <div className="gold_18k_12A border_right_2_12A" style={{paddingLeft:"0px"}}>
                                                                                <div style={{width:"40.5px", borderRight:"1px solid", height:"10px"}}></div>
                                                                                    <div></div>
                                                                                    {/* {e?.additional?.dia?.ActualPcs}/{e?.additional?.dia?.ActualWeight} */}
                                                                                </div>
                                                                            </div>
                                                                            <div className="order_no_12A border_bottom_2_12A">
                                                                                <div className="order_no_text_12A border_right_2_12A">
                                                                                    DEL. DATE
                                                                                </div>
                                                                                <div className="testing_text_12A border_right_2_12A">
                                                                                    {e?.data?.promisedate}
                                                                                </div>
                                                                                <div className="metal_col_12A border_right_2_12A">
                                                                                    CS PCS/WT
                                                                                </div>
                                                                                <div className="gold_18k_12A border_right_2_12A" style={{paddingLeft:"0px"}}>
                                                                                    <div style={{width:"40.5px", borderRight:"1px solid", height:"10px"}}></div>
                                                                                    <div></div>
                                                                                    {/* {e?.additional?.clr?.ActualPcs}/{(e?.additional?.clr?.ActualWeight)?.toFixed(3)} */}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="img_sec_12A border_bottom_2_12A">
                                                                            <img src="http://zen/R50B3/UFS/ufs2/orail228FT0OWNGEI6DC3BVS/Design_Image/rxGjOQumr7MDE0NTIzMw==/Red_Medium/0145233_05082023173015962.jpg" onError={e => handleImageError(e)} alt="" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="master_detail_12A border_bottom_2_12A">
                                                                        Master detail
                                                                    </div>
                                                                    <div className="table_12A">
                                                                        <div className="master_sec_12A d_flex ">
                                                                            {ele.map((eelem, indexx) => {
                                                                                return (
                                                                                    <div className=''>
                                                                                        <div className="d_flex border_bottom_1_12A">
                                                                                            <div className="Item_sec_12A border_right_1_12A">Item</div>
                                                                                            <div className="Size_sec_12A border_right_1_12A">Size</div>
                                                                                            <div className="Pcs_sec_12A border_right_1_12A">Pcs</div>
                                                                                            <div className={`Wt_sec_12A ${indexx === 0 && "border_right_1_12A"}`}>Wt</div>
                                                                                        </div>
                                                                                        {eelem.data.length > 0 && eelem.data.map((element, indexes) => {
                                                                                            return (
                                                                                                <div className="d_flex border_bottom_1_12A">
                                                                                                    <div className="Item_sec_12A border_right_1_12A hide12A">{indexx === 0 && element?.Shapecode}</div>
                                                                                                    <div className="Size_sec_12A border_right_1_12A hide12A">{indexx === 0 &&element?.Sizename}</div>
                                                                                                    <div className="Pcs_sec_12A border_right_1_12A hide12A">{indexx === 0 &&element?.ActualPcs}</div>
                                                                                                    <div className={`Wt_sec_12A ${indexx === 0 && "border_right_1_12A"} hide12A`}>{indexx === 0 && element?.ActualWeight}</div>
                                                                                                </div>
                                                                                            );
                                                                                        })}
                                                                                        {eelem.length > 0 && Array.from({ length: eelem.length }, (_, index) => (
                                                                                            <div className=" d_flex border_bottom_1_12A" key={index}>
                                                                                                <div className="Item_sec_12A border_right_1_12A"></div>
                                                                                                <div className="Size_sec_12A border_right_1_12A"></div>
                                                                                                <div className="Pcs_sec_12A border_right_1_12A"></div>
                                                                                                <div className={`Wt_sec_12A ${indexx === 0 && "border_right_1_12A"}`}></div>
                                                                                            </div>
                                                                                        ))
                                                                                        }
                                                                                    </div>
                                                                                );
                                                                            })}




                                                                        </div>

                                                                    </div>
                                                                    <div className="d_flex">
                                                                        <div className="dept_12A">
                                                                            <div className="dept_sec_12A border_bottom_1_12A">
                                                                                <div className="dept_sec_text1_12A border_right_1_12A">
                                                                                    DEPT
                                                                                </div>
                                                                                <div className="issue_sec_12A border_right_1_12A">
                                                                                    ISSUE
                                                                                </div>
                                                                                <div className="ex_issue_sec_12A border_right_1_12A">
                                                                                    EX. ISSUE
                                                                                </div>
                                                                                <div className="receive_sec_12A border_right_1_12A">
                                                                                    RECV
                                                                                </div>
                                                                                <div className="ex_receive_sec_12A border_right_1_12A">
                                                                                    EX RECV
                                                                                </div>
                                                                                <div className="dust_sec_12A border_right_1_12A">
                                                                                    DUST
                                                                                </div>
                                                                                <div className="loss_sec_12A border_right_1_12A">
                                                                                    LOSS
                                                                                </div>
                                                                            </div>
                                                                            {
                                                                                Array.from({ length: 7 }, (_, index) => (
                                                                                    <div className="dept_sec_12A border_bottom_1_12A" key={`key${index}`}>
                                                                                        <div className="dept_sec_text1_12A border_right_1_12A">
                                                                                        </div>
                                                                                        <div className="issue_sec_12A border_right_1_12A">
                                                                                        </div>
                                                                                        <div className="ex_issue_sec_12A border_right_1_12A">
                                                                                        </div>
                                                                                        <div className="receive_sec_12A border_right_1_12A">
                                                                                        </div>
                                                                                        <div className="ex_receive_sec_12A border_right_1_12A">
                                                                                        </div>
                                                                                        <div className="dust_sec_12A border_right_1_12A">
                                                                                        </div>
                                                                                        <div className="loss_sec_12A border_right_1_12A">
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                        <div className="barcode_12A border_bottom_1_12A">
                                                                            
                                                                            <BarcodeGenerator data={e?.data?.serialjobno} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="instruction_12A">
                                                                        
                                                                        <p>
                                                                            INST: {(e?.data?.instructionData == (null || 'null') ? '' : e?.data?.instructionData)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    );
                                                }) : <div className="section_12A"   >
                                                    <div className="container_12A">
                                                        <div className="job_no_12A">
                                                            <div className="design_no_12A">
                                                                Bag#:{e?.data?.serialjobno}
                                                            </div>
                                                            <div className="blank_12A">

                                                            </div>
                                                            <div className="design_m3_12A">
                                                                Design#:{e?.data?.Designcode}
                                                            </div>
                                                        </div>
                                                        <div className="d_flex">
                                                            <div className="order_no_sec_12A">
                                                                <div className="order_no_12A border_bottom_2_12A">
                                                                    <div className="order_no_text_12A border_right_2_12A">
                                                                        ORDER NO.
                                                                    </div>
                                                                    <div className="testing_text_12A border_right_2_12A">
                                                                        {e?.data?.OrderNo}
                                                                    </div>
                                                                    <div className="metal_col_12A border_right_2_12A">
                                                                        METAL COL/KT
                                                                    </div>
                                                                    <div className="gold_18k_12A border_right_2_12A">
                                                                        {e?.data?.MetalType} {e?.data?.MetalColorCo}
                                                                    </div>
                                                                </div>
                                                                <div className="order_no_12A border_bottom_2_12A">
                                                                    <div className="order_no_text_12A border_right_2_12A">
                                                                        ORDER DATE.
                                                                    </div>
                                                                    <div className="testing_text_12A border_right_2_12A">
                                                                        {e?.data?.OrderDate}
                                                                    </div>
                                                                    <div className="metal_col_12A border_right_2_12A">
                                                                        GROSS WT
                                                                    </div>
                                                                    <div className="gold_18k_12A border_right_2_12A">
                                                                        {e?.data?.ActualGrossweight}
                                                                    </div>
                                                                </div>
                                                                <div className="order_no_12A border_bottom_2_12A">
                                                                    <div className="order_no_text_12A border_right_2_12A">
                                                                        CLIENT CODE
                                                                    </div>
                                                                    <div className="testing_text_12A border_right_2_12A">
                                                                        {e?.data?.CustomerCode}
                                                                    </div>
                                                                    <div className="metal_col_12A border_right_2_12A">
                                                                        NET WT
                                                                    </div>
                                                                    <div className="gold_18k_12A border_right_2_12A">
                                                                        {e?.data?.netwt}
                                                                    </div>
                                                                </div>
                                                                <div className="order_no_12A border_bottom_2_12A">
                                                                    <div className="order_no_text_12A border_right_2_12A">
                                                                        SIZE INST
                                                                    </div>
                                                                    <div className="testing_text_12A border_right_2_12A">

                                                                    </div>
                                                                    <div className="metal_col_12A border_right_2_12A">
                                                                        DIA PCS/WT
                                                                    </div>
                                                                    <div className="gold_18k_12A border_right_2_12A">
                                                                        {/* {e?.additional?.dia?.ActualPcs}/{e?.additional?.dia?.ActualWeight} */}
                                                                    </div>
                                                                </div>
                                                                <div className="order_no_12A border_bottom_2_12A">
                                                                    <div className="order_no_text_12A border_right_2_12A">
                                                                        DEL. DATE
                                                                    </div>
                                                                    <div className="testing_text_12A border_right_2_12A">
                                                                        {e?.data?.promisedate}
                                                                    </div>
                                                                    <div className="metal_col_12A border_right_2_12A">
                                                                        CS PCS/WT
                                                                    </div>
                                                                    <div className="gold_18k_12A border_right_2_12A">
                                                                        {/* {e?.additional?.clr?.ActualPcs}/{e?.additional?.clr?.ActualWeight} */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="img_sec_12A border_bottom_2_12A">
                                                                <img src="http://zen/R50B3/UFS/ufs2/orail228FT0OWNGEI6DC3BVS/Design_Image/rxGjOQumr7MDE0NTIzMw==/Red_Medium/0145233_05082023173015962.jpg" onError={e => handleImageError(e)} alt="" />
                                                            </div>
                                                        </div>
                                                        <div className="master_detail_12A border_bottom_2_12A">
                                                            Master detail
                                                        </div>
                                                        <div className="table_12A t12A">
                                                            {
                                                                Array.from({length: 5}, (_,index) => (
                                                                    <div className="w4A">
                                                                        <div className='item12A'></div>
                                                                        <div className='size12A'></div>
                                                                        <div className="pcs12A"></div>
                                                                        <div className='wt12A'></div>
                                                                        <div className='item12A'></div>
                                                                        <div className='size12A'></div>
                                                                        <div className="pcs12A"></div>
                                                                        <div className='wt12A' style={{borderRight:"0px"}}></div>
                                                                    </div>
                                                                ))
                                                            }
                                                            {/* <div className="master_sec_12A d_flex "> */}
                                                                
                                                            
                                                                    {/* // return (
                                                                    //     <div className=''>
                                                                    //         <div className="d_flex border_bottom_1_12A">
                                                                    //             <div className="Item_sec_12A border_right_1_12A">Item</div>
                                                                    //             <div className="Size_sec_12A border_right_1_12A">Size</div>
                                                                    //             <div className="Pcs_sec_12A border_right_1_12A">Pcs</div>
                                                                    //             <div className={`Wt_sec_12A ${indexx === 0 && "border_right_1_12A"}`}>Wt</div>
                                                                    //         </div>
                                                                    //         {eelem.data.length > 0 && eelem.data.map((element, indexes) => {
                                                                    //             return (
                                                                    //                 <div className="d_flex border_bottom_1_12A">
                                                                    //                     <div className="Item_sec_12A border_right_1_12A">{element?.Shapecode}</div>
                                                                    //                     <div className="Size_sec_12A border_right_1_12A">{element?.Sizename}</div>
                                                                    //                     <div className="Pcs_sec_12A border_right_1_12A">{element?.ActualPcs}</div>
                                                                    //                     <div className={`Wt_sec_12A ${indexx === 0 && "border_right_1_12A"}`}>{element?.ActualWeight}</div>
                                                                    //                 </div>
                                                                    //             );
                                                                    //         })}
                                                                    //         {eelem.length > 0 && Array.from({ length: eelem.length }, (_, index) => (
                                                                    //             <div className=" d_flex border_bottom_1_12A" key={index}>
                                                                    //                 <div className="Item_sec_12A border_right_1_12A"></div>
                                                                    //                 <div className="Size_sec_12A border_right_1_12A"></div>
                                                                    //                 <div className="Pcs_sec_12A border_right_1_12A"></div>
                                                                    //                 <div className={`Wt_sec_12A ${indexx === 0 && "border_right_1_12A"}`}></div>
                                                                    //             </div>
                                                                    //         ))
                                                                    //         }
                                                                    //     </div>
                                                                    // ); */}
                                                            {/* </div> */}

                                                        </div>
                                                        <div className="d_flex">
                                                            <div className="dept_12A">
                                                                <div className="dept_sec_12A border_bottom_1_12A">
                                                                    <div className="dept_sec_text1_12A border_right_1_12A">
                                                                        DEPT
                                                                    </div>
                                                                    <div className="issue_sec_12A border_right_1_12A">
                                                                        ISSUE
                                                                    </div>
                                                                    <div className="ex_issue_sec_12A border_right_1_12A">
                                                                        EX. ISSUE
                                                                    </div>
                                                                    <div className="receive_sec_12A border_right_1_12A">
                                                                        RECV
                                                                    </div>
                                                                    <div className="ex_receive_sec_12A border_right_1_12A">
                                                                        EX RECV
                                                                    </div>
                                                                    <div className="dust_sec_12A border_right_1_12A">
                                                                        DUST
                                                                    </div>
                                                                    <div className="loss_sec_12A border_right_1_12A">
                                                                        LOSS
                                                                    </div>
                                                                </div>
                                                                {
                                                                    Array.from({ length: 7 }, (_, index) => (
                                                                        <div className="dept_sec_12A border_bottom_1_12A" key={`key${index}`}>
                                                                            <div className="dept_sec_text1_12A border_right_1_12A">
                                                                            </div>
                                                                            <div className="issue_sec_12A border_right_1_12A">
                                                                            </div>
                                                                            <div className="ex_issue_sec_12A border_right_1_12A">
                                                                            </div>
                                                                            <div className="receive_sec_12A border_right_1_12A">
                                                                            </div>
                                                                            <div className="ex_receive_sec_12A border_right_1_12A">
                                                                            </div>
                                                                            <div className="dust_sec_12A border_right_1_12A">
                                                                            </div>
                                                                            <div className="loss_sec_12A border_right_1_12A">
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                            <div className="barcode_12A border_bottom_1_12A">
                                                            <BarcodeGenerator data={e?.data?.serialjobno} />
                                                            </div>
                                                        </div>
                                                        <div className="instruction_12A">
                                                            <p>
                                                                INST: {(e?.data?.instructionData == (null || 'null') ? '' : e?.data?.instructionData)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </>
                                    );
                                })
                            }
                        </div>
                    </section>
                </>
            }
        </>
    );
};

export default BagPrint12A;