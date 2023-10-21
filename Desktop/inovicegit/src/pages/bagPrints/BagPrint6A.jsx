import axios from "axios";
import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/bagprint/print6A.css";
import { formatDate } from "../../GlobalFunctions/DateFormat";
import { GetChunkData } from "../../GlobalFunctions/GetChunkData";
import { GetData } from "../../GlobalFunctions/GetData";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import QRCodeGenerator from "../../components/QRCodeGenerator";
import Loader from "../../components/Loader";
import { organizeData } from "../../GlobalFunctions/OrganizeBagPrintData";
import { GetUniquejob } from "../../GlobalFunctions/GetUniqueJob";
const BagPrint6A = ({ queries, headers }) => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const resultString = GetUniquejob(queryParams?.str_srjobno);
  const chunkSize7 = 11;

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
          
          let PType = "";
          if (a?.rd?.ProductType !== (null || undefined || "")) {
            if (
              a?.rd?.ProductType?.length > 0 &&
              a?.rd?.ProductType?.length < 12
            ) {
              a.rd.PType = a?.rd?.ProductType;
            } else {
              let splited = a?.rd?.ProductType?.split(" ");
              a.rd.PType = splited[0];
            }
          }

          let length = 0;
          let clr = {
            // Shapename: "TOTAL",
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
            // heading: "COLOR STONE DETAIL"
          };
          let dia = {
            // Shapename: "TOTAL",
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
            // heading: "DIAMOND DETAIL"
          };
          let misc = {
            // Shapename: "TOTAL",
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
            // heading: "MISC DETAIL"
          };
          let f = {
            // Shapename: "TOTAL",
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

          a?.rd1?.map((e, i) => {
            if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
              length++;
            }
            if (e?.MasterManagement_DiamondStoneTypeid === 3) {
              ArrofSevenSize.push(e);
              // ArrofSevenSize[0].heading = "DIAMOND DETAIL";
              dia.ActualPcs = dia.ActualPcs + e?.ActualPcs;
              dia.ActualWeight = dia.ActualWeight + e?.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
              ArrofFiveSize.push(e);
              // ArrofFiveSize[0].heading = "COLOR STONE DETAIL";
              clr.ActualPcs = clr.ActualPcs + e?.ActualPcs;
              clr.ActualWeight = clr.ActualWeight + e?.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 5) {
              ArrofFSize.push(e);
              // ArrofFSize[0].heading = "FINDING DETAIL";
              f.ActualPcs = f.ActualPcs + e?.ActualPcs;
              f.ActualWeight = f.ActualWeight + e?.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
              ArrofMISize.push(e);
              // ArrofMISize[0].heading = "MISC DETAIL";
              misc.ActualPcs = misc.ActualPcs + e?.ActualPcs;
              misc.ActualWeight = misc.ActualWeight + e?.ActualWeight;
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

          ArrofSevenSize?.map((e) => {
            if (e?.ActualPcs === 0 && e?.ActualWeight === 0) {
              ArrofSevenSize = [];
            } else {
              e.heading = "DIAMOND DETAIL";
            }
          });
          ArrofFiveSize?.map((e) => {
            if (e?.ActualPcs === 0 && e?.ActualWeight === 0) {
              ArrofFiveSize = [];
            } else {
              e.heading = "COLOR STONE DETAIL";
            }
          });
          ArrofMISize?.map((e) => {
            if (e?.ActualPcs === 0 && e?.ActualWeight === 0) {
              ArrofMISize = [];
            } else {
              e.heading = "MISC DETAIL";
            }
          });
          ArrofFSize?.map((e) => {
            if (e?.ActualPcs === 0 && e?.ActualWeight === 0) {
              ArrofFSize = [];
            } else {
              e.heading = "FINDING DETAIL";
            }
          });

          let arr = [];
          let mainArr = arr.concat(
            ArrofSevenSize,
            ArrofFiveSize,
            ArrofMISize,
            ArrofFSize
          );
          let imagePath = queryParams?.imagepath;
          imagePath = atob(queryParams?.imagepath);

          let img = imagePath + a?.rd?.ThumbImagePath;
          let arrofchunk = GetChunkData(chunkSize7, mainArr);
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
        });

        //OLD
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
        //   const orderDatef = formatDate(datas?.rd[0]?.OrderDate);
        //   const promiseDatef = formatDate(datas?.rd[0]?.promisedate);

        //   datas?.rd?.map((e) => {
        //     e.orderDatef = orderDatef;
        //     e.promiseDatef = promiseDatef;
        //     //
        //   });
        //   // let p_tag = { "SerialJobno": `${print[url]}`, "customerid": `${queries.custid}`, "BagPrintName": `${queries.printname}` };
        //   // let jsonString = JSON.stringify(p_tag);
        //   // let base64String = btoa(jsonString);
        //   // let Body = {
        //   //     "con": `{\"id\":\"\",\"mode\":\"${queries.printname}\",\"appuserid\":\"${queries.appuserid}\"}`,
        //   //     "p": `${base64String}`,
        //   //     "f": `${queries.appuserid} ${queries.printname}`
        //   // };
        //   // let urls = atob(queries.url);
        //   // const response = await axios.post(urls, Body, { headers: headers });
        //   // let datas = JSON.parse(response.data.d);

        //   datas?.rd?.map((e) => {
        //     let PType = "";
        //     if (e?.ProductType !== (null || undefined || "")) {
        //       if (e?.ProductType?.length > 0 && e?.ProductType?.length < 12) {
        //         e.PType = e?.ProductType;
        //       } else {
        //         let a = e?.ProductType?.split(" ");
        //         e.PType = a[0];
        //       }
        //     }
        //   });

        //   let length = 0;
        //   let clr = {
        //     // Shapename: "TOTAL",
        //     Sizename: "",
        //     ActualPcs: 0,
        //     ActualWeight: 0,
        //     // heading: "COLOR STONE DETAIL"
        //   };
        //   let dia = {
        //     // Shapename: "TOTAL",
        //     Sizename: "",
        //     ActualPcs: 0,
        //     ActualWeight: 0,
        //     // heading: "DIAMOND DETAIL"
        //   };
        //   let misc = {
        //     // Shapename: "TOTAL",
        //     Sizename: "",
        //     ActualPcs: 0,
        //     ActualWeight: 0,
        //     // heading: "MISC DETAIL"
        //   };
        //   let f = {
        //     // Shapename: "TOTAL",
        //     Sizename: "",
        //     ActualPcs: 0,
        //     ActualWeight: 0,
        //     // heading: "FINDING DETAIL"
        //   };
        //   let ArrofSevenSize = [];
        //   //arr for colorstone
        //   let ArrofFiveSize = [];
        //   let ArrofMISize = [];
        //   let ArrofFSize = [];

        //   datas.rd1.map((e, i) => {
        //     if (e.ConcatedFullShapeQualityColorCode !== "- - - ") {
        //       length++;
        //     }
        //     if (e.MasterManagement_DiamondStoneTypeid === 3) {
        //       ArrofSevenSize.push(e);
        //       // ArrofSevenSize[0].heading = "DIAMOND DETAIL";
        //       dia.ActualPcs = dia.ActualPcs + e.ActualPcs;
        //       dia.ActualWeight = dia.ActualWeight + e.ActualWeight;
        //     } else if (e.MasterManagement_DiamondStoneTypeid === 4) {
        //       ArrofFiveSize.push(e);
        //       // ArrofFiveSize[0].heading = "COLOR STONE DETAIL";
        //       clr.ActualPcs = clr.ActualPcs + e.ActualPcs;
        //       clr.ActualWeight = clr.ActualWeight + e.ActualWeight;
        //     } else if (e.MasterManagement_DiamondStoneTypeid === 5) {
        //       ArrofFSize.push(e);
        //       // ArrofFSize[0].heading = "FINDING DETAIL";
        //       f.ActualPcs = f.ActualPcs + e.ActualPcs;
        //       f.ActualWeight = f.ActualWeight + e.ActualWeight;
        //     } else if (e.MasterManagement_DiamondStoneTypeid === 7) {
        //       ArrofMISize.push(e);
        //       // ArrofMISize[0].heading = "MISC DETAIL";
        //       misc.ActualPcs = misc.ActualPcs + e.ActualPcs;
        //       misc.ActualWeight = misc.ActualWeight + e.ActualWeight;
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
        //   // ArrofFiveSize.push(clr);
        //   // ArrofFSize.push(f);
        //   // ArrofMISize.push(misc);

        //   ArrofSevenSize.map((e) => {
        //     if (e.ActualPcs === 0 && e.ActualWeight === 0) {
        //       ArrofSevenSize = [];
        //     } else {
        //       e.heading = "DIAMOND DETAIL";
        //     }
        //   });
        //   ArrofFiveSize.map((e) => {
        //     if (e.ActualPcs === 0 && e.ActualWeight === 0) {
        //       ArrofFiveSize = [];
        //     } else {
        //       e.heading = "COLOR STONE DETAIL";
        //     }
        //   });
        //   ArrofMISize.map((e) => {
        //     if (e.ActualPcs === 0 && e.ActualWeight === 0) {
        //       ArrofMISize = [];
        //     } else {
        //       e.heading = "MISC DETAIL";
        //     }
        //   });
        //   ArrofFSize.map((e) => {
        //     if (e.ActualPcs === 0 && e.ActualWeight === 0) {
        //       ArrofFSize = [];
        //     } else {
        //       e.heading = "FINDING DETAIL";
        //     }
        //   });
        //   let arr = [];
        //   let mainArr = arr.concat(
        //     ArrofSevenSize,
        //     ArrofFiveSize,
        //     ArrofMISize,
        //     ArrofFSize
        //   );
        //   let imagePath = queryParams.imagepath;
        //   imagePath = atob(queryParams.imagepath);

        //   let img = imagePath + datas?.rd[0]?.ThumbImagePath;
        //   let arrofchunk = GetChunkData(chunkSize7, mainArr);
        //   // for (let i = 0; i < mainArr.length; i += chunkSize7) {
        //   //     const chunks = mainArr.slice(i, i + chunkSize7);
        //   //     let len = 12 - (mainArr.slice(i, i + chunkSize7)).length;
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

  useEffect(() => {
    if (data.length !== 0) {
      setTimeout(() => {
        window.print();
      }, 5000);
    }
  }, [data]);

  return (
    <>
      {data.length === 0 ? (
        <Loader />
      ) : (
        <>
          <div className="print_btn">
            <button
              className="btn_white blue print_btn"
              onClick={(e) => handlePrint(e)}
            >
              Print
            </button>
          </div>

          <div className="print6Aflex pad_60_allPrint">
            {Array.from(
              { length: queries?.pageStart },
              (_, index) =>
                index > 0 && (
                  <div
                    key={index}
                    className="container6A"
                    style={{ border: "0px" }}
                  ></div>
                )
            )}
            {data.length > 0 &&
              data.map((e, inx) => {
                return (
                  <React.Fragment key={inx}>
                    {e?.additional?.pages?.length > 0 ? (
                      e?.additional?.pages.map((ele, i) => {
                        return (
                          <div className="container6A" key={i}>
                            <div className="jobInfo6A">
                              <div className="jobInfo6Aheader">
                                <div
                                  className="jobName6AD h6A"
                                  style={{ fontWeight: "bold" }}
                                >
                                  <div>{e?.data?.rd?.serialjobno}</div>
                                  <div>{e?.data?.rd?.Designcode}</div>
                                  <div className="text-danger">
                                    {e?.data?.rd?.MetalType +
                                      " " +
                                      e?.data?.rd?.MetalColorCo}
                                  </div>
                                </div>
                                <div className="jobName6A">
                                  <div className="job6Ahww text-secondary">
                                    TR NO.
                                  </div>
                                  <div className="job6Ahww text-secondary">
                                    TR NO.
                                  </div>
                                  <div className="job6Ahww text-secondary">
                                    TR NO.
                                  </div>
                                  <div className="job6Ahww borderRight6A">
                                    {e?.data?.rd?.OrderNo}
                                  </div>
                                </div>
                                <div className="jobName6A">
                                  <div className="job6Ahww">
                                    {e?.data?.rd?.PType}
                                  </div>
                                  <div className="job6Ahww">
                                    {e?.data?.rd?.Size}
                                  </div>
                                  <div className="job6Ahww">
                                    {e?.data?.rd?.CustomerCode}
                                  </div>
                                  <div className="job6Ahww borderRight6A">
                                    {e?.data.rd?.PO}
                                  </div>
                                </div>
                                <div className="jobName6A">
                                  <div className="job6Ahww">CS WT/PC</div>
                                  <div className="job6Ahww">DIA WT/PC</div>
                                  <div className="job6Ahww">Nt Wt/Gr Wt</div>
                                  <div className="job6Ahww borderRight6A">
                                    {e?.data?.rd?.prioritycode}
                                  </div>
                                </div>
                                <div
                                  className="jobName6A"
                                  style={{ borderBottom: "0px" }}
                                >
                                  <div className="job6Ahww">
                                    {e?.additional?.clr?.ActualWeight?.toFixed(
                                      3
                                    )}
                                    /{e?.additional?.clr?.ActualPcs}
                                  </div>
                                  <div className="job6Ahww">
                                    {e?.additional?.dia?.ActualWeight?.toFixed(
                                      3
                                    )}
                                    /{e?.additional?.dia?.ActualPcs}
                                  </div>
                                  <div className="job6Ahww">
                                    {e?.data?.rd?.MetalWeight?.toFixed(3)}/
                                    {e?.data?.rd?.ActualGrossweight?.toFixed(3)}
                                  </div>
                                  <div className="job6Ahww borderRight6A">
                                    {e?.data?.rd?.orderDatef ?? ""}
                                  </div>
                                </div>
                              </div>
                              <div className="imgSize6A">
                                {" "}
                                <img
                                  src={
                                    e?.additional?.img !== ""
                                      ? e?.additional?.img
                                      : require("../../assets/img/default.jpg")
                                  }
                                  id="img6A"
                                  alt=""
                                  
                                  onError={(e) => handleImageError(e)}
                                  loading="eager"
                                />
                              </div>
                            </div>
                            <div className="main6A">
                              <div className="required6A">
                                <div className="lbh6A">Required Material</div>
                                <div
                                  className="main6Ahead"
                                  style={{ height: "16px" }}
                                >
                                  <div className="right6Aa code6A">CODE</div>
                                  <div className="right6Ab code6A">SIZE</div>
                                  <div className="right6Ac code6A">PCS</div>
                                  <div className="right6Ad code6A">WT</div>
                                </div>
                                <div className="main6Ahead">
                                  <div
                                    className="right6Aa"
                                    style={{ width: "188px" }}
                                  >
                                    {e?.data?.rd?.MetalType +
                                      " " +
                                      e?.data?.rd?.MetalColor}
                                  </div>
                                  {/* <div className="right6Ab"></div> */}
                                  <div className="right6Ac"></div>
                                  <div className="right6Ad"></div>
                                </div>
                                {ele?.data.map((a, i) => {
                                  return (
                                    <div className="main6Ahead" key={i}>
                                      {/* {
                                                                                         a?.Shapename === "TOTAL" ? <div className='right6Aa'>{a?.Shapename}</div> : 
                                                                                        <div className='right6Aa'>{a?.ConcatedFullShapeQualityColorCode}</div>}  */}
                                      <div className="right6Aa">
                                        {a?.ConcatedFullShapeQualityColorCode}
                                      </div>
                                      <div className="right6Ab">
                                        {a?.Sizename}
                                      </div>
                                      <div className="right6Ac">
                                        {a?.ActualPcs}
                                      </div>
                                      <div className="right6Ad">
                                        {a?.ActualWeight?.toFixed(3)}
                                      </div>
                                    </div>
                                  );
                                })}
                                {Array.from(
                                  { length: ele?.length },
                                  (_, index) => (
                                    <div className="main6Ahead" key={index}>
                                      <div className="right6Aa"></div>
                                      <div className="right6Ab"></div>
                                      <div className="right6Ac"></div>
                                      <div className="right6Ad"></div>
                                    </div>
                                  )
                                )}
                              </div>
                              <div className="issue6A">
                                <div className="lbh6A">
                                  <div className="dflex6A">
                                    <p
                                      className="pflex6A"
                                      style={{
                                        borderRight: "0px solid #989898",
                                        height: "20px",
                                        width: "75px",
                                      }}
                                    >
                                      Issue Material
                                    </p>
                                    {/* <p className='pflex6A' style={{ height: "20px" }}>Material</p> */}
                                  </div>
                                </div>
                                <div
                                  className="aside6A"
                                  style={{ height: "16px" }}
                                >
                                  <div
                                    className="right6Ac"
                                    style={{ height: "16px" }}
                                  >
                                    PCS
                                  </div>
                                  <div
                                    className="right6Ad"
                                    style={{ height: "16px" }}
                                  >
                                    WT
                                  </div>
                                </div>
                                <div className="aside6A">
                                  <div className="right6Ac"></div>
                                  <div className="right6Ad"></div>
                                </div>
                                {Array.from({ length: 11 }, (_, index) => (
                                  <div className="aside6A" key={index}>
                                    <div className="right6Ac"></div>
                                    <div className="right6Ad"></div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="job6Afooter">
                              <div
                                className="job6AfooterDesc"
                                style={{ borderTop: "0px" }}
                              >
                                <div className="cust6A">
                                  <p className="f6A">
                                    CUST. INS.
                                    <span className="f6A ">
                                      {e?.data?.rd?.ProductInstruction !==
                                        null &&
                                      e?.data?.rd?.ProductInstruction !==
                                        "null" &&
                                      e?.data?.rd?.ProductInstruction !==
                                        undefined
                                        ? e?.data?.rd?.ProductInstruction?.slice(
                                            0,
                                            120
                                          )
                                        : ""}
                                    </span>
                                  </p>
                                </div>
                                <div className="cust6A">
                                  <p className="f6A">
                                    PRD. INS.
                                    <span className="f6A ">
                                      {e?.data?.rd?.officeuse !== null &&
                                      e?.data?.rd?.officeuse !== "null" &&
                                      e?.data?.rd?.officeuse !== undefined &&
                                      e?.data?.rd?.ProductInstruction !==
                                        undefined &&
                                      e?.data?.rd?.ProductInstruction !==
                                        null &&
                                      e?.data?.rd?.ProductInstruction !== "null"
                                        ? e?.data?.rd?.officeuse
                                            //   e?.data?.rd?.ProductInstruction
                                            ?.slice(0, 135)
                                        : ""}
                                    </span>
                                  </p>
                                </div>
                                <div
                                  className="cust6A"
                                  style={{ borderBottom: "0px" }}
                                >
                                  <p className="f6A">
                                    STM. INS.
                                    <span className="f6A ">
                                      {e?.data?.rd?.stamping}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div>
                                <QRCodeGenerator
                                  text={e?.data?.rd.serialjobno}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="container6A" key={inx}>
                        <div className="jobInfo6A">
                          <div className="jobInfo6Aheader">
                            <div
                              className="jobName6AD h6A"
                              style={{ fontWeight: "bold" }}
                            >
                              <div>{e?.data?.rd?.serialjobno}</div>
                              <div>{e?.data?.rd?.Designcode}</div>
                              <div>{e?.data?.rd?.MetalType}</div>
                              <div className="borderRight6A">
                                {e?.data?.rd?.MetalColorCo}
                              </div>
                            </div>
                            <div className="jobName6A">
                              <div className="job6Ahww">TR NO.</div>
                              <div className="job6Ahww">TR NO.</div>
                              <div className="job6Ahww">TR NO.</div>
                              <div className="job6Ahww borderRight6A">
                                {e?.data?.rd?.OrderNo}
                              </div>
                            </div>
                            <div className="jobName6A">
                              <div className="job6Ahww">
                                {e?.data?.rd?.PType}
                              </div>
                              <div className="job6Ahww">
                                {e?.data?.rd?.Size}
                              </div>
                              <div className="job6Ahww">
                                {e?.data?.rd?.CustomerCode}
                              </div>
                              <div className="job6Ahww borderRight6A">
                                {e?.data.rd?.PO}
                              </div>
                            </div>
                            <div className="jobName6A">
                              <div className="job6Ahww">CS WT/PC</div>
                              <div className="job6Ahww">DIA WT/PC</div>
                              <div className="job6Ahww">Nt Wt/Gr Wt</div>
                              <div className="job6Ahww borderRight6A">
                                {e?.data?.rd?.prioritycode}
                              </div>
                            </div>
                            <div
                              className="jobName6A"
                              style={{ borderBottom: "0px" }}
                            >
                              <div className="job6Ahww">
                                {e?.additional?.clr?.ActualPcs}/
                                {e?.additional?.clr?.ActualWeight?.toFixed(2)}
                              </div>
                              <div className="job6Ahww">
                                {e?.additional?.dia?.ActualPcs}/
                                {e?.additional?.dia?.ActualWeight?.toFixed(2)}
                              </div>
                              <div className="job6Ahww">
                                {e?.data?.rd?.MetalWeight?.toFixed(2)}/
                                {e?.data?.rd?.ActualGrossweight?.toFixed(2)}
                              </div>
                              <div className="job6Ahww borderRight6A">
                                {e?.data?.rd?.orderDatef ?? ""}
                              </div>
                            </div>
                          </div>
                          <div className="imgSize6A">
                            {" "}
                            <img
                              src={
                                e?.additional?.img !== ""
                                  ? e?.additional?.img
                                  : require("../../assets/img/default.jpg")
                              }
                              id="img6A"
                              alt=""
                              onError={(e) => handleImageError(e)}
                              loading="eager"
                           
                            />
                          </div>
                        </div>
                        <div className="main6A">
                          <div className="required6A">
                            <div className="lbh6A">Required Material</div>
                            <div className="main6Ahead">
                              <div className="right6Aa">CODE</div>
                              <div className="right6Ab">SIZE</div>
                              <div className="right6Ac">PCS</div>
                              <div className="right6Ad">WT</div>
                            </div>

                            {Array.from({ length: 7 }, (_, ind) => (
                              <div className="main6Ahead" key={ind}>
                                <div className="right6Aa"></div>
                                <div className="right6Ab"></div>
                                <div className="right6Ac"></div>
                                <div className="right6Ad"></div>
                              </div>
                            ))}
                          </div>
                          <div className="issue6A">
                            <div className="lbh6A">
                              <p style={{ borderRight: "1px solid black" }}>
                                Issue
                              </p>
                              <p>Material</p>
                            </div>
                            <div className="aside6A">
                              <div className="right6Ac">PCS</div>
                              <div className="right6Ad">WT</div>
                            </div>
                            {Array.from({ length: 7 }, (_, i) => (
                              <div className="aside6A" key={i}>
                                <div className="right6Ac"></div>
                                <div className="right6Ad"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="job6Afooter">
                          <div
                            className="job6AfooterDesc"
                            style={{ borderTop: "0px" }}
                          >
                            <div className="cust6A">
                              <p className="f6A">
                                CUST. INS.<span className="f6A f6Ared"></span>
                              </p>
                            </div>
                            <div className="cust6A">
                              <p className="f6A">
                                PRD. INS.<span className="f6A f6Ared"></span>
                              </p>
                            </div>
                            <div
                              className="cust6A"
                              style={{ borderBottom: "0px" }}
                            >
                              <p className="f6A">
                                STM. INS.<span className="f6A f6Ared"></span>
                              </p>
                            </div>
                          </div>
                          <div>
                            <QRCodeGenerator text={e?.data?.rd?.serialjobno} />
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
          </div>
        </>
      )}
    </>
  );
};

export default BagPrint6A;
