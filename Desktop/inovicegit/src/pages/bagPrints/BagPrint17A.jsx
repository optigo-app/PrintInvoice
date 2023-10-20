import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/bagprint/print17A.css";
// import print17 from "../../assets/css/bagprint/bagprint17copy.module.css"
import { formatDate } from "../../GlobalFunctions/DateFormat";
import { GetChunkData } from "../../GlobalFunctions/GetChunkData";
import { GetData } from "../../GlobalFunctions/GetData";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import BarcodeGenerator from "../../components/BarcodeGenerator";
import Loader from "../../components/Loader";
import { organizeData } from './../../GlobalFunctions/OrganizeBagPrintData';

const BagPrint17A = ({ queries, headers }) => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location?.search);
  let jobs = queryParams?.str_srjobno;
  const parts = jobs.split(",");
  const resultString = parts.map((part) => `'${part}'`).join(",");
  if (Object.keys(queryParams)?.length !== 0) {
    jobs = jobs.split(",");
  }

  const [print, setPrint] = useState(jobs);
  const chunkSize11 = 14;

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
          let diamondArr = [];
          let colorStoneArr = [];
          let miscArr = [];
          let findingDetailArr = [];

          a?.rd1?.forEach((e, i) => {
            if (e?.MasterManagement_DiamondStoneTypeid === 3) {
              diamondArr.push(e);
            }
            if (e?.MasterManagement_DiamondStoneTypeid === 4) {
              colorStoneArr.push(e);
            }
            if (e?.MasterManagement_DiamondStoneTypeid === 5) {
              findingDetailArr.push(e);
            }
            if (e?.MasterManagement_DiamondStoneTypeid === 7) {
              miscArr.push(e);
            }
          });

          let length = 0;
          let clr = {
            // Shapename: "TOTAL",
            // Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 4,
            // heading: "COLOR STONE DETAIL"
          };
          let dia = {
            // Shapename: "TOTAL",
            // Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 3,
            // heading: "DIAMOND DETAIL"
          };
          let misc = {
            // Shapename: "TOTAL",
            // Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 7,
            // heading: "MISC DETAIL"
          };
          let f = {
            // Shapename: "TOTAL",
            // Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 5,
            // heading: "FINDING DETAIL"
          };
          let ArrofSevenSize = [];
          //arr for colorstone
          let ArrofFiveSize = [];
          let ArrofMISize = [];
          let ArrofFSize = [];

          a?.rd1?.map((e, i) => {
            if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
              length++;
            }
            if (e?.MasterManagement_DiamondStoneTypeid === 3) {
              ArrofSevenSize.push(e);
              dia.ActualPcs = dia?.ActualPcs + e?.ActualPcs;
              dia.ActualWeight = dia?.ActualWeight + e?.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
              ArrofFiveSize.push(e);
              clr.ActualPcs = clr?.ActualPcs + e?.ActualPcs;
              clr.ActualWeight = clr?.ActualWeight + e?.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 5) {
              ArrofFSize.push(e);
              f.ActualPcs = f?.ActualPcs + e?.ActualPcs;
              f.ActualWeight = f?.ActualWeight + e?.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
              ArrofMISize.push(e);
              misc.ActualPcs = misc?.ActualPcs + e?.ActualPcs;
              misc.ActualWeight = misc?.ActualWeight + e?.ActualWeight;
            }
          });
          dia.ActualPcs = +dia.ActualPcs?.toFixed(3);
          dia.ActualWeight = +dia.ActualWeight?.toFixed(3);
          clr.ActualPcs = +clr.ActualPcs?.toFixed(3);
          clr.ActualWeight = +clr.ActualWeight?.toFixed(3);
          misc.ActualPcs = +misc.ActualPcs?.toFixed(3);
          misc.ActualWeight = +misc.ActualWeight?.toFixed(3);
          f.ActualPcs = +f.ActualPcs?.toFixed(3);
          f.ActualWeight = +f.ActualWeight?.toFixed(3);

          // ArrofSevenSize.push(dia);
          // ArrofSevenSize[0].heading = "DIAMOND DETAIL";
          // ArrofSevenSize.unshift({ heading: "DIAMOND DETAIL", MasterManagement_DiamondStoneTypeid: 3 });

          // ArrofFiveSize.push(clr);
          // ArrofFiveSize[0].heading = "COLOR STONE DETAIL";
          // ArrofFiveSize.unshift({ heading: "COLOR STONE DETAIL", MasterManagement_DiamondStoneTypeid: 4 });

          // ArrofFSize.push(f);
          // ArrofFSize[0].heading = "FINDING DETAIL";
          // ArrofFSize.unshift({ heading: "FINDING DETAIL", MasterManagement_DiamondStoneTypeid: 5 });

          // ArrofMISize.push(misc);
          // ArrofMISize[0].heading = "MISC DETAIL";
          // ArrofMISize.unshift({ heading: "MISC DETAIL", MasterManagement_DiamondStoneTypeid: 7 });

          // ArrofSevenSize.map((e) => {
          //     if (e.ActualPcs === 0 && e.ActualWeight === 0) {
          //         ArrofSevenSize = [];
          //     }
          // }
          // );

          // ArrofFiveSize.map((e) => {
          //     if (e.ActualPcs === 0 && e.ActualWeight === 0) {
          //         ArrofFiveSize = [];
          //     }
          // }
          // );

          // ArrofMISize.map((e) => {
          //     if (e.ActualPcs === 0 && e.ActualWeight === 0) {
          //         ArrofMISize = [];
          //     }
          // }
          // );

          // ArrofFSize.map((e) => {
          //     if (e.ActualPcs === 0 && e.ActualWeight === 0) {
          //         ArrofFSize = [];
          //     }
          // }
          // );

          let arr = [];
          let mainArr = arr?.concat(
            ArrofSevenSize,
            ArrofFiveSize,
            ArrofMISize,
            ArrofFSize
          );

          let imagePath = queryParams?.imagepath;
          imagePath = atob(queryParams?.imagepath);

          let img = imagePath + a?.rd?.ThumbImagePath;
          let arrofchunk = GetChunkData(chunkSize11, mainArr);
          // for (let i = 0; i < mainArr.length; i += chunkSize11) {
          //     const chunks = mainArr.slice(i, i + chunkSize11);
          //     let len = 14 - (mainArr.slice(i, i + chunkSize11)).length;
          //     chunkData.push({ data: chunks, length: len });
          // }
          responseData.push({
            data: a,
            additional: {
              length: length,
              clr: clr,
              dia: dia,
              f: f,
              img: img,
              misc: misc,
              pages: arrofchunk,
            },
          });
        })


        // for (let url in print) {
        //   let chunkData = [];
        //   const objs = {
        //     jobno: print[url],
        //     custid: queries.custid,
        //     printname: queries.printname,
        //     appuserid: queries.appuserid,
        //     url: queries.url,
        //     headers: headers,
        //   };
        //   let datas = await GetData(objs);
        //   const orderDatef = formatDate(datas?.rd?.OrderDate);
        //   const promiseDatef = formatDate(datas?.rd?.promisedate);

        //   datas?.rd?.map((e) => {
        //     e.orderDatef = orderDatef;
        //     e.promiseDatef = promiseDatef;
        //     //
        //   });
        //   // let p_tag = { "SerialJobno": `${print[url]}`, "customerid": `${queries?.custid}`, "BagPrintName": `${queries?.printname}` };
        //   // let jsonString = JSON.stringify(p_tag);
        //   // let base64String = btoa(jsonString);
        //   // let Body = {
        //   //     "con": `{\"id\":\"\",\"mode\":\"${queries?.printname}\",\"appuserid\":\"${queries?.appuserid}\"}`,
        //   //     "p": `${base64String}`,
        //   //     "f": `${queries?.appuserid} ${queries?.printname}`
        //   // };
        //   // let urls = atob(queries?.url);
        //   // const response = await axios.post(urls, Body, { headers: headers });
        //   // let datas = JSON.parse(response.data.d);

        //   // console.log(datas.rd1);
        //   let diamondArr = [];
        //   let colorStoneArr = [];
        //   let miscArr = [];
        //   let findingDetailArr = [];

        //   datas?.rd1?.forEach((e, i) => {
        //     if (e?.MasterManagement_DiamondStoneTypeid === 3) {
        //       diamondArr.push(e);
        //     }
        //     if (e?.MasterManagement_DiamondStoneTypeid === 4) {
        //       colorStoneArr.push(e);
        //     }
        //     if (e?.MasterManagement_DiamondStoneTypeid === 5) {
        //       findingDetailArr.push(e);
        //     }
        //     if (e?.MasterManagement_DiamondStoneTypeid === 7) {
        //       miscArr.push(e);
        //     }
        //   });

        //   let length = 0;
        //   let clr = {
        //     // Shapename: "TOTAL",
        //     // Sizename: "",
        //     ActualPcs: 0,
        //     ActualWeight: 0,
        //     MasterManagement_DiamondStoneTypeid: 4,
        //     // heading: "COLOR STONE DETAIL"
        //   };
        //   let dia = {
        //     // Shapename: "TOTAL",
        //     // Sizename: "",
        //     ActualPcs: 0,
        //     ActualWeight: 0,
        //     MasterManagement_DiamondStoneTypeid: 3,
        //     // heading: "DIAMOND DETAIL"
        //   };
        //   let misc = {
        //     // Shapename: "TOTAL",
        //     // Sizename: "",
        //     ActualPcs: 0,
        //     ActualWeight: 0,
        //     MasterManagement_DiamondStoneTypeid: 7,
        //     // heading: "MISC DETAIL"
        //   };
        //   let f = {
        //     // Shapename: "TOTAL",
        //     // Sizename: "",
        //     ActualPcs: 0,
        //     ActualWeight: 0,
        //     MasterManagement_DiamondStoneTypeid: 5,
        //     // heading: "FINDING DETAIL"
        //   };
        //   let ArrofSevenSize = [];
        //   //arr for colorstone
        //   let ArrofFiveSize = [];
        //   let ArrofMISize = [];
        //   let ArrofFSize = [];

        //   datas?.rd1?.map((e, i) => {
        //     if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
        //       length++;
        //     }
        //     if (e?.MasterManagement_DiamondStoneTypeid === 3) {
        //       ArrofSevenSize.push(e);
        //       dia.ActualPcs = dia?.ActualPcs + e?.ActualPcs;
        //       dia.ActualWeight = dia?.ActualWeight + e?.ActualWeight;
        //     } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
        //       ArrofFiveSize.push(e);
        //       clr.ActualPcs = clr?.ActualPcs + e?.ActualPcs;
        //       clr.ActualWeight = clr?.ActualWeight + e?.ActualWeight;
        //     } else if (e?.MasterManagement_DiamondStoneTypeid === 5) {
        //       ArrofFSize.push(e);
        //       f.ActualPcs = f?.ActualPcs + e?.ActualPcs;
        //       f.ActualWeight = f?.ActualWeight + e?.ActualWeight;
        //     } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
        //       ArrofMISize.push(e);
        //       misc.ActualPcs = misc?.ActualPcs + e?.ActualPcs;
        //       misc.ActualWeight = misc?.ActualWeight + e?.ActualWeight;
        //     }
        //   });
        //   dia.ActualPcs = +dia.ActualPcs.toFixed(3);
        //   dia.ActualWeight = +dia.ActualWeight.toFixed(3);
        //   clr.ActualPcs = +clr.ActualPcs.toFixed(3);
        //   clr.ActualWeight = +clr.ActualWeight.toFixed(3);
        //   misc.ActualPcs = +misc.ActualPcs.toFixed(3);
        //   misc.ActualWeight = +misc.ActualWeight.toFixed(3);
        //   f.ActualPcs = +f.ActualPcs.toFixed(3);
        //   f.ActualWeight = +f.ActualWeight.toFixed(3);

        //   // ArrofSevenSize.push(dia);
        //   // ArrofSevenSize[0].heading = "DIAMOND DETAIL";
        //   // ArrofSevenSize.unshift({ heading: "DIAMOND DETAIL", MasterManagement_DiamondStoneTypeid: 3 });

        //   // ArrofFiveSize.push(clr);
        //   // ArrofFiveSize[0].heading = "COLOR STONE DETAIL";
        //   // ArrofFiveSize.unshift({ heading: "COLOR STONE DETAIL", MasterManagement_DiamondStoneTypeid: 4 });

        //   // ArrofFSize.push(f);
        //   // ArrofFSize[0].heading = "FINDING DETAIL";
        //   // ArrofFSize.unshift({ heading: "FINDING DETAIL", MasterManagement_DiamondStoneTypeid: 5 });

        //   // ArrofMISize.push(misc);
        //   // ArrofMISize[0].heading = "MISC DETAIL";
        //   // ArrofMISize.unshift({ heading: "MISC DETAIL", MasterManagement_DiamondStoneTypeid: 7 });

        //   // ArrofSevenSize.map((e) => {
        //   //     if (e.ActualPcs === 0 && e.ActualWeight === 0) {
        //   //         ArrofSevenSize = [];
        //   //     }
        //   // }
        //   // );

        //   // ArrofFiveSize.map((e) => {
        //   //     if (e.ActualPcs === 0 && e.ActualWeight === 0) {
        //   //         ArrofFiveSize = [];
        //   //     }
        //   // }
        //   // );

        //   // ArrofMISize.map((e) => {
        //   //     if (e.ActualPcs === 0 && e.ActualWeight === 0) {
        //   //         ArrofMISize = [];
        //   //     }
        //   // }
        //   // );

        //   // ArrofFSize.map((e) => {
        //   //     if (e.ActualPcs === 0 && e.ActualWeight === 0) {
        //   //         ArrofFSize = [];
        //   //     }
        //   // }
        //   // );

        //   let arr = [];
        //   let mainArr = arr.concat(
        //     ArrofSevenSize,
        //     ArrofFiveSize,
        //     ArrofMISize,
        //     ArrofFSize
        //   );

        //   let imagePath = queryParams?.imagepath;
        //   imagePath = atob(queryParams?.imagepath);

        //   let img = imagePath + datas?.rd[0]?.ThumbImagePath;
        //   let arrofchunk = GetChunkData(chunkSize11, mainArr);
        //   // for (let i = 0; i < mainArr.length; i += chunkSize11) {
        //   //     const chunks = mainArr.slice(i, i + chunkSize11);
        //   //     let len = 14 - (mainArr.slice(i, i + chunkSize11)).length;
        //   //     chunkData.push({ data: chunks, length: len });
        //   // }
        //   responseData.push({
        //     data: datas,
        //     additional: {
        //       length: length,
        //       clr: clr,
        //       dia: dia,
        //       f: f,
        //       img: img,
        //       misc: misc,
        //       pages: arrofchunk,
        //     },
        //   });
        // }
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

  // function handlePrint(e) {
  //     e.preventDefault();
  //     window.print();
  // }

  // useEffect(() => {
  //     if (data.length !== 0) {
  //         // setTimeout(() => {
  //         //     window.print();
  //         // }, 5000);
  //     }
  // }, [data]);


  useEffect(() => {
    if (data?.length !== 0) {
      setTimeout(() => {
        window.print();
      }, 5000);
    }
  }, [data]);

  return (
    <>
      {data?.length === 0 ? (
        <Loader />
      ) : (
        <>
          <button
            className="btn_white blue print_btn btn17"
            onClick={(e) => handlePrint(e)}
          >
            Print
          </button>
          <div className="samebgp17A pad_60_allPrint">
            {Array.from(
              { length: queries?.pageStart },
              (_, index) =>
                index > 0 && (
                  <div
                    key={index}
                    className="bgn17A"
                    style={{ border: "0px" }}
                  ></div>
                )
              // index > 0 && <div key={index} className="container  ml_5 mb_10"></div>
            )}
            {data?.length > 0 &&
              data?.map((e, i) => {
                return (
                  <React.Fragment key={i}>
                    {e?.additional?.pages?.length > 0 ? (
                      e?.additional?.pages?.map((ele, index) => {
                        return (
                          <div className="bgn17A" key={index}>
                            <div className="headn17A">
                              <div className="headInfon17A">
                                <div className="jobn17A">
                                  <p className="fsn17A">
                                    <span className="fsbn17Ajob">
                                      {e?.data?.rd?.serialjobno}
                                    </span>
                                  </p>
                                  <p className="fsn17A">
                                    {e?.data?.rd?.Designcode}
                                  </p>
                                  <p
                                    className="fsn17A"
                                    style={{ marginRight: "3px" }}
                                  >
                                    {e?.data?.rd?.MetalType}{" "}
                                    {e?.data?.rd?.MetalColorCo}
                                  </p>
                                </div>
                                <div className="maten17A">
                                  <div className="custn17Amate">
                                    <p className="cparan17A">CUST</p>
                                    <p className="cparaValn17A">
                                      {e?.data?.rd?.CustomerCode}
                                    </p>
                                  </div>
                                  <div className="custn17Amate">
                                    <p className="cparan17A">SIZE</p>
                                    <p className="cparaValn17A">{e?.data?.rd?.Size}</p>
                                    
                                  </div>
                                  <div className="custn17Amate">
                                    <p className="cparan17A">ORD.DT.</p>
                                    <p className="cparaValn17A">{e?.data?.rd?.orderDatef ?? ""}</p>
                                    
                                  </div>
                                  <div className="custn17Amate brn17A">
                                    <p className="cpara18A">DEL.DT.</p>
                                    <p className="cparaValn17A">{e?.data?.rd?.promiseDatef ?? ""}</p>
                                    
                                  </div>
                                </div>
                                <div
                                  className="insn17A"
                                  style={{ color: "red" }}
                                >
                                  INS: &nbsp;
                                  {(
                                    e?.data?.rd?.officeuse +
                                    e?.data?.rd?.ProductInstruction
                                  )?.length > 0 &&
                                  e?.data?.rd?.officeuse +
                                    e?.data?.rd?.ProductInstruction !==
                                    (null || "null" || undefined)
                                    ? (
                                        e?.data?.rd?.officeuse +
                                        "\u00a0\u00a0" +
                                        e?.data?.rd?.ProductInstruction
                                      )?.slice(0, 140)
                                    : ""}
                                </div>
                              </div>
                              <div className="imgn17A">
                                <img
                                  src={
                                    e?.additional?.img !== ""
                                      ? e?.additional?.img
                                      : require("../../assets/img/default.jpg")
                                  }
                                  alt=""
                                  onError={(e) => handleImageError(e)}
                                  id="imgn17A"
                                  loading="eager"
                                 
                                />
                              </div>
                            </div>
                            <div className="mateTablen17A">
                              <div>
                                <div className="mateHeadn17A">
                                  <p className="fshn17A coden17A">CODE</p>
                                  <p className="fshn17A sizen17A">SIZE</p>
                                  <p className="fshn17A pcsn17A">PCS</p>
                                  <p className="fshn17A pcsn17A">WT</p>
                                  <p className="fshn17A wtn17A">PCS</p>
                                  <p className="fshn17A wtn17A">WT</p>
                                </div>
                                {ele?.data?.length > 0 &&
                                  ele?.data?.map((a, sr) => {
                                    return (
                                      
                                        <div className="mateBodyn17A" key={sr}>
                                          <p className="bodycoden17A coden17A">
                                            {a?.ConcatedFullShapeQualityColorName?.toUpperCase()}
                                          </p>
                                          <p
                                            className="bodyn17A sizen17A"
                                            style={{
                                              justifyContent: "flex-start",
                                              paddingLeft: "2px",
                                            }}
                                          >
                                            {a?.Sizename}
                                          </p>
                                          <p className="bodyn17A pcsn17A">
                                            {a?.ActualPcs}
                                          </p>
                                          <p className="bodyn17A pcsn17A">
                                            {a?.ActualWeight?.toFixed(3)}
                                          </p>
                                          <p className="bodyn17A wtn17A"></p>
                                          <p className="bodyn17A wtn17A"></p>
                                        </div>
                                      
                                    );
                                  })}
                                {Array.from(
                                  { length: ele?.length },
                                  (_, ai) => (
                                    <div className="mateBodyn17A" key={ai}>
                                      <p className="fshn17A coden17A"></p>
                                      <p className="fshn17A sizen17A"></p>
                                      <p className="fshn17A pcsn17A"></p>
                                      <p className="fshn17A pcsn17A"></p>
                                      <p className="fshn17A wtn17A"></p>
                                      <p className="fshn17A wtn17A"></p>
                                    </div>
                                  )
                                )}
                              </div>
                              <div className="barcoden17A">
                                {e?.data?.rd?.serialjobno !==
                                  (null || "" || undefined) && (
                                  <BarcodeGenerator
                                    data={e?.data?.rd?.serialjobno}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="footern17A">
                              <div className="dian17A">
                                <div className="fsn17A brbn17A">DIAM.</div>
                                <div className="fsn17A">
                                  {e?.additional?.dia?.ActualPcs}/
                                  {e?.additional?.dia?.ActualWeight?.toFixed(3)}
                                </div>
                                <div className="fsn17A"></div>
                              </div>
                              <div className="dian17A">
                                <div className="fsn17A brbn17A">CS</div>
                                <div className="fsn17A">
                                  {e?.additional?.clr?.ActualPcs}/
                                  {e?.additional?.clr?.ActualWeight?.toFixed(3)}
                                </div>
                                <div className="fsn17A"></div>
                              </div>
                              <div className="miscn17A">
                                <div className="fsn17A brbn17A">METAL</div>
                                <div className="fsn17A">
                                  {e?.data?.rd?.QuotGrossWeight?.toFixed(3)}
                                </div>
                                <div className="fsn17A"></div>
                              </div>
                              <div
                                className="miscn17A"
                                style={{ marginRight: "32.5px" }}
                              >
                                <div className="fsn17A brbn17A">MISC</div>
                                <div className="fsn17A">
                                  {e?.additional?.misc?.ActualWeight?.toFixed(
                                    3
                                  )}
                                </div>
                                <div className="fsn17A"></div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="bgn17A">
                        <div className="headn17A">
                          <div className="headInfon17A">
                            <div className="jobn17A">
                              <p className="fsn17A">
                                <span className="fsbn17Ajob">
                                  {e?.data?.rd?.serialjobno}
                                </span>
                              </p>
                              <p className="fsn17A">
                                {e?.data?.rd?.Designcode}
                              </p>
                              <p
                                className="fsn17A"
                                style={{ marginRight: "3px" }}
                              >
                                {e?.data?.rd?.MetalType}{" "}
                                {e?.data?.rd?.MetalColorCo}
                              </p>
                            </div>
                            <div className="maten17A">
                              <div className="custn17Amate">
                                <p className="cparan17A">CUST</p>
                                <p className="cparaValn17A"></p>
                                {e?.data?.rd?.CustomerCode}
                              </div>
                              <div className="custn17Amate">
                                <p className="cparan17A">SIZE</p>
                                <p className="cparaValn17A">{e?.data?.rd?.Size}</p>
                                
                              </div>
                              <div className="custn17Amate">
                                <p className="cparan17A">ORD.DT.</p>
                                <p className="cparaValn17A">{e?.data?.rd?.orderDatef}</p>
                                
                              </div>
                              <div className="custn17Amate brn17A">
                                <p className="cpara18A">DEL.DT.</p>
                                <p className="cparaValn17A">
                                  {e?.data?.rd?.promiseDatef}
                                </p>
                              </div>
                            </div>
                            <div className="insn17A">
                              INS :
                              {(
                                e?.data?.rd?.officeuse +
                                e?.data?.rd?.ProductInstruction
                              )?.length > 0 &&
                              e?.data?.rd?.officeuse +
                                e?.data?.rd?.ProductInstruction !==
                                ("null" || null || undefined)
                                ? (
                                    e?.data?.rd?.officeuse +
                                    "   " +
                                    e?.data?.rd?.ProductInstruction
                                  )?.slice(0, 140)
                                : ""}
                            </div>
                          </div>
                          <div className="imgn17A">
                            <img
                              src={
                                e?.additional?.img !== ""
                                  ? e?.additional?.img
                                  : require("../../assets/img/default.jpg")
                              }
                              alt=""
                              onError={(e) => handleImageError(e)}
                              id="img18A"
                              loading="eager"
                            
                            />
                          </div>
                        </div>
                        <div className="mateTablen17A">
                          <div>
                            <div className="mateHeadn17A">
                              <p className="fshn17A coden17A">CODE</p>
                              <p className="fshn17A sizen17A">SIZE</p>
                              <p className="fshn17A pcsn17A">PCS</p>
                              <p className="fshn17A pcsn17A">WT</p>
                              <p className="fshn17A wtn17A">PCS</p>
                              <p className="fshn17A wtn17A">WT</p>
                            </div>

                            {/* {
            ele?.data?.length > 0 && ele?.data?.map((a, sr) => {

                return (
                    <>
                        <div className='mateBody18A' key={sr}>
                            <p className='bodycode18A code18A'>{a?.LimitedShapeQualityColorCode?.toUpperCase()?.slice(0, 20)}</p>
                            <p className='body18A size18A'>{a?.Sizename}</p>
                            <p className='body18A pcs18A'>{a?.ActualPcs}</p>
                            <p className='body18A pcs18A'>{a?.ActualWeight?.toFixed(3)}</p>
                            <p className='body18A wt18A'></p>
                            <p className='body18A wt18A'></p>
                        </div>
                    </>
                );
            })
        } */}
                            {Array.from({ length: 14 }, (_, ai) => (
                              <div className="mateBodyn17A" key={ai}>
                                <p className="fshn17A coden17A"></p>
                                <p className="fshn17A sizen17A"></p>
                                <p className="fshn17A pcsn17A"></p>
                                <p className="fshn17A pcsn17A"></p>
                                <p className="fshn17A wtn17A"></p>
                                <p className="fshn17A wtn17A"></p>
                              </div>
                            ))}
                          </div>
                          <div className="barcoden17A">
                            {e?.data?.rd?.serialjobno !==
                              (null || "" || undefined) && (
                              <BarcodeGenerator
                                data={e?.data?.rd?.serialjobno}
                              />
                            )}
                          </div>
                        </div>
                        <div className="footern17A">
                          <div className="dian17A">
                            <div className="fsn17A brbn17A">DIAM.</div>
                            <div className="fs18A">
                              {e?.additional?.dia?.ActualPcs}/
                              {e?.additional?.dia?.ActualWeight?.toFixed(3)}
                            </div>
                            <div className="fsn17A"></div>
                          </div>
                          <div className="dian17A">
                            <div className="fsn17A brbn17A">CS</div>
                            <div className="fs18A">
                              {e?.additional?.clr?.ActualPcs}/
                              {e?.additional?.clr?.ActualWeight?.toFixed(3)}
                            </div>
                            <div className="fsn17A"></div>
                          </div>
                          <div className="miscn17A">
                            <div className="fsn17A brbn17A">METAL</div>
                            <div className="fs18A">
                              {e?.data?.rd?.QuotGrossWeight}
                            </div>
                            <div className="fsn17A"></div>
                          </div>
                          <div
                            className="miscn17A"
                            style={{ marginRight: "3rem" }}
                          >
                            <div className="fsn17A brbn17A">MISC</div>
                            <div className="fs18A">
                              {e?.additional?.misc?.ActualWeight?.toFixed(3)}
                            </div>
                            <div className="fsn17A"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="bgn17A">
                      <div className="headn17AD">
                        <div className="headInfon17AD">
                          <div className="jobn17A">
                            <p className="fs18A">
                              <span className="fsbn17Ajob">
                                {e?.data?.rd?.serialjobno}
                              </span>
                            </p>

                            <p className="fsn17A">
                              {e?.data?.rd?.Designcode}
                            </p>

                            <p className="fsn17A">
                              {e?.data?.rd?.MetalType}{" "}
                              {e?.data?.rd?.MetalColorCo}
                            </p>
                          </div>
                          <div className="Dmaten17A">
                            <div className="custn17Amate">
                              <p className="cparan17A">SALES REP.</p>
                              <p className="cparaValn17A">
                                {e?.data?.rd?.SalesrepCode}
                              </p>
                            </div>

                            <div className="custn17Amate">
                              <p className="cparan17A">FROS</p>
                              <p className="cparaValn17A">
                                {e?.data?.rd?.MetalFrosting}
                              </p>
                            </div>

                            <div className="custn17Amate">
                              <p className="cparan17A">LAB</p>
                              <p className="cparaValn17A">
                                {e?.data?.rd?.MasterManagement_labname}
                              </p>
                            </div>

                            <div className="custn17Amate brn17A">
                              <p className="cparan17A">MAKETYPE</p>
                              <p className="cparaValn17A">
                                {e?.data?.rd?.mastermanagement_maketypename}
                              </p>
                            </div>
                          </div>
                          <div className="testn17A">
                            <p>{e?.data?.rd?.PO}</p>
                          </div>

                          <div className="tronn17A">
                            <p className="pn17AD">Y TR NO</p>
                            <p className="pn17AD">W TR NO</p>
                            <p className="pn17AD">P TR NO</p>
                            <p className="pn17AD">Y CST WT.</p>
                            <p className="pn17AD">W CST WT.</p>
                            <p
                              className="pn17AD"
                              style={{ borderRight: "0px" }}
                            >
                              P CST WT.
                            </p>
                          </div>
                          <div className="metn17AD">
                            <div>METAL</div>
                          </div>
                        </div>
                        <div className="imgn17AD">
                          <img
                            src={
                              e?.additional?.img !== ""
                                ? e?.additional?.img
                                : require("../../assets/img/default.jpg")
                            }
                            alt=""
                            onError={(e) => handleImageError(e)}
                            id="imgn17AD"
                            loading="eager"
                           
                          />
                        </div>
                      </div>
                      <section>
                        <div className="cvdn17A">
                          <div className="stvin17A">
                            <div className="onen17A">STONE</div>
                            <div className="onen17A">VISUAL</div>
                          </div>
                          <div>
                            <div className="cvdtestn17A">CVD TEST</div>
                          </div>
                          <div className="barcoden17AD">
                            {e?.data?.rd?.serialjobno !==
                              (null || "" || undefined) && (
                              <BarcodeGenerator
                                data={e?.data?.rd?.serialjobno}
                              />
                            )}
                          </div>
                        </div>
                      </section>
                      <main className="mainn17A">
                        <div className="theadrown17A">
                          <p className="thrown17A deptn17Aw">DEPT.</p>
                          <p className="thrown17A apn17Aw">AP</p>
                          <p className="thrown17A issuen17Aw">ISSUE</p>
                          <p className="thrown17A workn17Aw">RECEIVE</p>
                          <p className="thrown17A workn17Aw">SCRAP</p>
                          <p className="thrown17A issuen17Aw">PCS</p>
                          <p className="thrown17A workn17Aw br177Anone">
                            WORKER
                          </p>
                        </div>
                        <div className="theadrown17A">
                          <p className="thrown17A deptn17Aw">GRD.</p>
                          <p className="thrown17A apn17Aw"></p>
                          <p className="thrown17A issuen17Aw"></p>
                          <p className="thrown17A workn17Aw"></p>
                          <p className="thrown17A workn17Aw"></p>
                          <p className="thrown17A issuen17Aw"></p>
                          <p className="thrown17A workn17Aw br177Anone"></p>
                        </div>
                        <div className="theadrown17A">
                          <p className="thrown17A deptn17Aw">FIL.</p>
                          <p className="thrown17A apn17Aw"></p>
                          <p className="thrown17A issuen17Aw"></p>
                          <p className="thrown17A workn17Aw"></p>
                          <p className="thrown17A workn17Aw"></p>
                          <p className="thrown17A issuen17Aw"></p>
                          <p className="thrown17A workn17Aw br177Anone"></p>
                        </div>
                        <div className="theadrown17A">
                          <p className="thrown17A deptn17Aw">ASM.</p>
                          <p className="thrown17A apn17Aw"></p>
                          <p className="thrown17A issuen17Aw"></p>
                          <p className="thrown17A workn17Aw"></p>
                          <p className="thrown17A workn17Aw"></p>
                          <p className="thrown17A issuen17Aw"></p>
                          <p className="thrown17A workn17Aw br177Anone"></p>
                        </div>
                        <div className="theadrown17A">
                          <p className="thrown17A deptn17Aw">CNC.</p>
                          <p className="thrown17A apn17Aw"></p>
                          <p className="thrown17A issuen17Aw"></p>
                          <p className="thrown17A workn17Aw"></p>
                          <p className="thrown17A workn17Aw"></p>
                          <p className="thrown17A issuen17Aw"></p>
                          <p className="thrown17A workn17Aw br177Anone"></p>
                        </div>
                        <div className="theadrown17A">
                          <p className="thrown17A deptn17Aw">EP/PI.</p>
                          <p className="thrown17A apn17Aw"></p>
                          <p className="thrown17A issuen17Aw"></p>
                          <p className="thrown17A workn17Aw"></p>
                          <p className="thrown17A workn17Aw"></p>
                          <p className="thrown17A issuen17Aw"></p>
                          <p className="thrown17A workn17Aw br177Anone"></p>
                        </div>
                        <div className="theadrown17A">
                          <p className="thrown17A deptn17Aw">SET.</p>
                          <p className="thrown17A apn17Aw"></p>
                          <p className="thrown17A issuen17Aw"></p>
                          <p className="thrown17A workn17Aw"></p>
                          <p className="thrown17A workn17Aw"></p>
                          <p className="thrown17A issuen17Aw"></p>
                          <p className="thrown17A workn17Aw br177Anone"></p>
                        </div>
                        <div className="theadrown17A">
                          <p className="thrown17A deptn17Aw">FPL.</p>
                          <p className="thrown17A apn17Aw"></p>
                          <p className="thrown17A issuen17Aw"></p>
                          <p className="thrown17A workn17Aw"></p>
                          <p className="thrown17A workn17Aw"></p>
                          <p className="thrown17A issuen17Aw"></p>
                          <p className="thrown17A workn17Aw br177Anone"></p>
                        </div>
                        <div className="theadrown17A">
                          <p className="thrown17A deptn17Aw">PLT.</p>
                          <p className="thrown17A apn17Aw"></p>
                          <p className="thrown17A issuen17Aw"></p>
                          <p className="thrown17A workn17Aw"></p>
                          <p className="thrown17A workn17Aw"></p>
                          <p className="thrown17A issuen17Aw"></p>
                          <p className="thrown17A workn17Aw br177Anone"></p>
                        </div>
                        <div
                          className="theadrown17A"
                          style={{ borderBottom: "0px" }}
                        >
                          <p className="thrown17A deptn17Aw">ENM.</p>
                          <p className="thrown17A apn17Aw"></p>
                          <p className="thrown17A issuen17Aw"></p>
                          <p className="thrown17A workn17Aw"></p>
                          <p className="thrown17A workn17Aw"></p>
                          <p className="thrown17A issuen17Aw"></p>
                          <p className="thrown17A workn17Aw br177Anone"></p>
                        </div>
                      </main>
                    </div>
                  </React.Fragment>
                );
              })}
          </div>
        </>
      )}
    </>
  );
};

export default BagPrint17A;
