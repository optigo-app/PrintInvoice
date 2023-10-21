import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/bagprint/print18A.css";
import { formatDate } from "../../GlobalFunctions/DateFormat";
import { GetChunkData } from "../../GlobalFunctions/GetChunkData";
import { GetData } from "../../GlobalFunctions/GetData";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import BarcodeGenerator from "../../components/BarcodeGenerator";
import Loader from "../../components/Loader";
import { organizeData } from './../../GlobalFunctions/OrganizeBagPrintData';
import { GetUniquejob } from "../../GlobalFunctions/GetUniqueJob";

const BagPrint18A = ({ queries, headers }) => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location?.search);
  const resultString = GetUniquejob(queryParams?.str_srjobno);
  const chunkSize11 = 13;

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
          //     let len = 13 - (mainArr.slice(i, i + chunkSize11)).length;
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
        //   // let datas = JSON.parse(response?.data?.d);

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

        //   let img = imagePath + datas?.rd?.ThumbImagePath;
        //   let arrofchunk = GetChunkData(chunkSize11, mainArr);
        //   // for (let i = 0; i < mainArr.length; i += chunkSize11) {
        //   //     const chunks = mainArr.slice(i, i + chunkSize11);
        //   //     let len = 13 - (mainArr.slice(i, i + chunkSize11)).length;
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
  //     window.print();
  // }
  useEffect(() => {
    if (data.length !== 0) {
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
          <div className="print18Asame pad_60_allPrint">
            {Array.from(
              { length: queries?.pageStart },
              (_, index) =>
                index > 0 && (
                  <div
                    key={index}
                    className="bg18A"
                    style={{ border: "0px" }}
                  ></div>
                )
                // index > 0 && <div key={index} className="container  ml_5 mb_10"></div>
            )}
            {data?.length > 0 &&
              data?.map((e, index) => {
                return (
                  <React.Fragment key={index}>
                    {e?.additional?.pages?.length > 0 ? (
                      e?.additional?.pages?.map((ele, i) => {
                        return (
                          <div className="bg18A" key={i}>
                            <div className="head18A">
                              <div className="headInfo18A">
                                <div className="job18A">
                                  <p className="fs18A">
                                    <span className="fsb18Ajob">
                                      {e?.data?.rd?.serialjobno}
                                    </span>
                                  </p>
                                  <p className="fs18A">
                                    {e?.data?.rd?.Designcode}
                                  </p>
                                  <p
                                    className="fs18A"
                                    style={{ marginRight: "3px" }}
                                  >
                                    {e?.data?.rd?.MetalType}{" "}
                                    {e?.data?.rd?.MetalColorCo}
                                  </p>
                                </div>
                                <div className="mate18A">
                                  <div className="cust18Amate">
                                    <p className="cpara18A">CUST</p>
                                    <p className="cparaVal18A">
                                      {e?.data?.rd?.CustomerCode}
                                    </p>
                                  </div>
                                  <div className="cust18Amate">
                                    <p className="cpara18A">SIZE</p>
                                    <p className="cparaVal18A">
                                      {e?.data?.rd?.Size}
                                    </p>
                                  </div>
                                  <div className="cust18Amate">
                                    <p className="cpara18A">ORD.DT.</p>
                                    <p className="cparaVal18A">
                                      {e?.data?.rd?.orderDatef ?? ""}
                                    </p>
                                  </div>
                                  <div className="cust18Amate br18A">
                                    <p className="cpara18A">DEL.DT.</p>
                                    <p className="cparaVal18A">
                                      {e?.data?.rd?.promiseDatef ?? ""}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  className="ins18A"
                                  style={{ color: "red" }}
                                >
                                  INS :{" "}
                                  {!(
                                    e?.data?.rd?.officeuse === null ||
                                    e?.data?.rd?.officeuse === "null" ||
                                    e?.data?.rd?.officeuse === undefined
                                  ) &&
                                  !(
                                    e?.data?.rd?.stamping === null ||
                                    e?.data?.rd?.stamping === "null" ||
                                    e?.data?.rd?.stamping === undefined
                                  ) &&
                                  !(
                                    e?.data?.rd?.ProductInstruction ===
                                      null ||
                                    e?.data?.rd?.ProductInstruction ===
                                      "null" ||
                                    e?.data?.rd?.ProductInstruction ===
                                      undefined
                                  )
                                    ? (
                                        e?.data?.rd?.officeuse +
                                        " " +
                                        e?.data?.rd?.stamping +
                                        " " +
                                        e?.data?.rd?.ProductInstruction
                                      )?.slice(0, 140)
                                    : ""}
                                </div>
                                {/* {console.log(((e?.data?.rd?.ProductInstruction !== "null") && (e?.data?.rd?.ProductInstruction !== null) && (e?.data?.rd?.ProductInstruction !== undefined)))} */}
                                {/* {console.log(e?.data?.rd?.ProductInstruction)} */}
                                {/* <div className='ins18A' style={{ color: "red" }}>INS : {


                                                                        // (e?.data?.rd?.officeuse + e?.data?.rd?.stamping + e?.data?.rd?.ProductInstruction)?.length > 0 &&
                                                                        // (e?.data?.rd?.officeuse + e?.data?.rd?.stamping + e?.data?.rd?.ProductInstruction) !== (null || 'null' || undefined)
                                                                        (((e?.data?.rd?.officeuse !== "null") && (e?.data?.rd?.officeuse !== null) && (e?.data?.rd?.officeuse !== undefined)) ||
                                                                            ((e?.data?.rd?.stamping !== "null") && (e?.data?.rd?.stamping !== null) && (e?.data?.rd?.stamping !== undefined)) ||
                                                                            (!((e?.data?.rd?.ProductInstruction === "null") && (e?.data?.rd?.ProductInstruction === null) && (e?.data?.rd?.ProductInstruction === undefined))))
                                                                            ? (e?.data?.rd?.officeuse + " " + e?.data?.rd?.stamping + " " + e?.data?.rd?.ProductInstruction)?.slice(0, 140) : ''}</div> */}
                              </div>
                              <div className="img18A">
                                {" "}
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
                            <div className="mateTable18A">
                              <div>
                                <div className="mateHead18A">
                                  <p className="fsh18A code18A">CODE</p>
                                  <p className="fsh18A size18A">SIZE</p>
                                  <p className="fsh18A pcs18A">PCS</p>
                                  <p className="fsh18A pcs18A">WT</p>
                                  <p className="fsh18A wt18A">PCS</p>
                                  <p className="fsh18A wt18A">WT</p>
                                </div>

                                {ele?.data?.length > 0 &&
                                  ele?.data?.map((a, sr) => {
                                    return (
                                      <div className="mateBody18A" key={sr}>
                                        <p className="bodycode18A code18A code18Ad">
                                          {a?.ConcatedFullShapeQualityColorName?.toUpperCase()}
                                        </p>
                                        <p
                                          className="body18A size18A"
                                          style={{
                                            justifyContent: "flex-start",
                                            paddingLeft: "1px",
                                          }}
                                        >
                                          {a?.Sizename}
                                        </p>
                                        <p className="body18A pcs18A">
                                          {a?.ActualPcs}
                                        </p>
                                        <p className="body18A pcs18A">
                                          {a?.ActualWeight?.toFixed(3)}
                                        </p>
                                        <p className="body18A wt18A"></p>
                                        <p className="body18A wt18A"></p>
                                      </div>
                                    );
                                  })}
                                {Array.from(
                                  { length: ele?.length },
                                  (_, ai) => (
                                    <div className="mateBody18A" key={ai}>
                                      <p className="body18A code18A"></p>
                                      <p className="body18A size18A"></p>
                                      <p className="body18A pcs18A"></p>
                                      <p className="body18A pcs18A"></p>
                                      <p className="body18A wt18A"></p>
                                      <p className="body18A wt18A"></p>
                                    </div>
                                  )
                                )}
                              </div>
                              {/* <div className='barcode18A'> */}
                              <div className="barcode18A">
                                {e?.data?.rd?.serialjobno !==
                                  (null || "" || undefined) && (
                                  <BarcodeGenerator
                                    data={e?.data?.rd?.serialjobno}
                                  />
                                )}
                              </div>
                              {/* {
                                                                        // e?.data?.rd?.serialjobno !== (null || '' || undefined) && 
                                                                        <BarcodeGenerator data={e?.data?.rd?.serialjobno} />
                                                                    } */}
                              {/* </div> */}
                            </div>
                            <div className="footer18A">
                              <div className="dia18A">
                                <div className="fs18A brb18A">DIAM.</div>
                                <div className="fs18A">
                                  {e?.additional?.dia?.ActualPcs}/
                                  {e?.additional?.dia?.ActualWeight?.toFixed(3)}
                                </div>
                              </div>
                              <div className="dia18A">
                                <div className="fs18A brb18A">CS</div>
                                <div className="fs18A">
                                  {e?.additional?.clr?.ActualPcs}/
                                  {e?.additional?.clr?.ActualWeight?.toFixed(3)}
                                </div>
                              </div>
                              <div className="misc18A">
                                <div className="fs18A brb18A">METAL</div>
                                <div className="fs18A">
                                  {e?.data?.rd?.QuotGrossWeight}
                                </div>
                              </div>
                              <div
                                className="misc18A"
                                style={{ marginRight: "3rem" }}
                              >
                                <div className="fs18A brb18A">MISC</div>
                                <div className="fs18A">
                                  {e?.additional?.misc?.ActualWeight?.toFixed(
                                    3
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="bg18A">
                        <div className="head18A">
                          <div className="headInfo18A">
                            <div className="job18A">
                              <p className="fs18A">
                                <span className="fsb18Ajob">
                                  {e?.data?.rd?.serialjobno}
                                </span>
                              </p>
                              <p className="fs18A">
                                {e?.data?.rd?.Designcode}
                              </p>
                              <p className="fs18A">
                                {e?.data?.rd?.MetalType}{" "}
                                {e?.data?.rd?.MetalColorCo}
                              </p>
                            </div>
                            <div className="mate18A">
                              <div className="cust18Amate">
                                <p className="cpara18A">CUST</p>
                                <p className="cparaVal18A">
                                  {e?.data?.rd?.CustomerCode}
                                </p>
                              </div>
                              <div className="cust18Amate">
                                <p className="cpara18A">SIZE</p>
                                <p className="cparaVal18A">
                                  {e?.data?.rd?.Size}
                                </p>
                              </div>
                              <div className="cust18Amate">
                                <p className="cpara18A">ORD.DT.</p>
                                <p className="cparaVal18A">
                                  {e?.data?.rd?.orderDatef ?? ""}
                                </p>
                              </div>
                              <div className="cust18Amate br17AA">
                                <p className="cpara18A">DEL.DT.</p>
                                <p className="cparaVal18A">
                                  {e?.data?.rd?.promiseDatef ?? ""}
                                </p>
                              </div>
                            </div>
                            <div className="ins18A" style={{ color: "red" }}>
                              INS :
                              {
                                !(
                                  e?.data?.rd?.officeuse === null ||
                                  e?.data?.rd?.officeuse === "null" ||
                                  e?.data?.rd?.officeuse === undefined
                                ) &&
                                !(
                                  e?.data?.rd?.stamping === null ||
                                  e?.data?.rd?.stamping === "null" ||
                                  e?.data?.rd?.stamping === undefined
                                ) &&
                                !(
                                  e?.data?.rd?.ProductInstruction === null ||
                                  e?.data?.rd?.ProductInstruction ===
                                    "null" ||
                                  e?.data?.rd?.ProductInstruction ===
                                    undefined
                                )
                                  ? (
                                      e?.data?.rd?.officeuse +
                                      " " +
                                      e?.data?.rd?.stamping +
                                      " " +
                                      e?.data?.rd?.ProductInstruction
                                    )?.slice(0, 140)
                                  : ""
                                // (e?.data?.rd?.officeuse + e?.data?.rd?.stamping + e?.data?.rd?.ProductInstruction)?.length > 0 &&
                                // (e?.data?.rd?.officeuse + e?.data?.rd?.stamping + e?.data?.rd?.ProductInstruction) !== ('null' || null || undefined)
                                // (
                                //     (((e?.data?.rd?.officeuse !== "null") && (e?.data?.rd?.officeuse !== null) && (e?.data?.rd?.officeuse !== undefined)) &&
                                //         ((e?.data?.rd?.stamping !== "null") && (e?.data?.rd?.stamping !== null) && (e?.data?.rd?.stamping !== undefined)) &&
                                //         ((e?.data?.rd?.ProductInstruction !== "null") && (e?.data?.rd?.ProductInstruction !== null) && (e?.data?.rd?.ProductInstruction !== undefined)))
                                // ) ? (e?.data?.rd?.officeuse + "" + e?.data?.rd?.stamping + " " + e?.data?.rd?.ProductInstruction)?.slice(0, 140) : ''
                              }
                            </div>
                          </div>
                          <div className="img18A">
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
                        <div className="mateTable18A">
                          <div>
                            <div className="mateHead18A">
                              <p className="fsh18A code18A">CODE</p>
                              <p className="fsh18A size18A">SIZE</p>
                              <p className="fsh18A pcs18A">PCS</p>
                              <p className="fsh18A pcs18A">WT</p>
                              <p className="fsh18A wt18A">PCS</p>
                              <p className="fsh18A wt18A">WT</p>
                            </div>
                            {Array.from({ length: 14 }, (_, indexA) => (
                              <div className="mateBody18A" key={indexA}>
                                <p className="body18A code18A"></p>
                                <p className="body18A size18A"></p>
                                <p className="body18A pcs18A"></p>
                                <p className="body18A pcs18A"></p>
                                <p className="body18A wt18A"></p>
                                <p className="body18A wt18A"></p>
                              </div>
                            ))}
                          </div>
                          <div className="barcode18A">
                            {e?.data?.rd?.serialjobno !==
                              (null || "" || undefined) && (
                              <BarcodeGenerator
                                data={e?.data?.rd?.serialjobno}
                              />
                            )}
                          </div>
                        </div>
                        <div className="footer18A">
                          <div className="dia18A">
                            <div className="fs18A brb18A">DIAM.</div>
                            <div className="fs18A">0/0</div>
                          </div>
                          <div className="dia18A">
                            <div className="fs18A brb18A">CS</div>
                            <div className="fs18A">0/0</div>
                          </div>
                          <div className="misc18A">
                            <div className="fs18A brb18A">METAL</div>
                            <div className="fs18A">6.82</div>
                          </div>
                          <div
                            className="misc18A"
                            style={{ marginRight: "3rem" }}
                          >
                            <div className="fs18A brb18A">MISC</div>
                            <div className="fs18A">0</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg18A">
                      <div className="head18AD">
                        <div className="headInfo18AD">
                          <div className="job18A">
                            <p className="fs18A">
                              <span className="fsb18Ajob">
                                {e?.data?.rd?.serialjobno}
                              </span>
                            </p>
                            <p className="fs18A">
                              {e?.data?.rd?.Designcode}
                            </p>
                            <p className="fs18A">
                              {e?.data?.rd?.MetalType}{" "}
                              {e?.data?.rd?.MetalColorCo}
                            </p>
                          </div>
                          <div className="Dmate18A">
                            <div className="cust18Amate">
                              <p className="cpara18A">SALES REP.</p>
                              <p className="cparaVal18A">
                                {e?.data?.rd?.SalesrepCode}
                              </p>
                            </div>
                            <div className="cust18Amate">
                              <p className="cpara18A">FROS</p>
                              <p className="cparaVal18A">
                                {e?.data?.rd?.MetalFrosting}
                              </p>
                            </div>
                            <div className="cust18Amate">
                              <p className="cpara18A">LAB</p>
                              <p className="cparaVal18A">
                                {e?.data?.rd?.MasterManagement_labname}
                              </p>
                            </div>
                            <div className="cust18Amate br18A">
                              <p className="cpara18A">MAKETYPE</p>
                              <p className="cparaVal18A">
                                {e?.data?.rd?.mastermanagement_maketypename}
                              </p>
                            </div>
                          </div>
                          <div className="test18A">
                            <p>{e?.data?.rd?.PO}</p>
                          </div>
                          <div className="tron18A">
                            <p className="p18AD">Y TR NO</p>
                            <p className="p18AD">W TR NO</p>
                            <p className="p18AD">P TR NO</p>
                            <p className="p18AD">Y CST WT.</p>
                            <p className="p18AD">W CST WT.</p>
                            <p className="p18AD" style={{ borderRight: "0px" }}>
                              P CST WT.
                            </p>
                          </div>
                          <div className="met18AD">
                            <div>METAL</div>
                          </div>
                        </div>
                        <div className="img18AD">
                          <img
                            src={
                              e?.additional?.img !== ""
                                ? e?.additional?.img
                                : require("../../assets/img/default.jpg")
                            }
                            alt=""
                            onError={(e) => handleImageError(e)}
                            id="img18AD"
                            loading="eager"
                           
                          />
                        </div>
                      </div>
                      <section>
                        <div className="cvd18A">
                          <div className="stvi18A">
                            <div className="one18A">STONE</div>
                            <div className="one18A">VISUAL</div>
                          </div>
                          <div>
                            <div className="cvdtest18A">CVD TEST</div>
                          </div>
                          <div className="barcode18AD">
                            {e?.data?.rd?.serialjobno !==
                              (null || "" || undefined) && (
                              <BarcodeGenerator
                                data={e?.data?.rd?.serialjobno}
                              />
                            )}
                          </div>
                        </div>
                      </section>
                      <main className="main18A">
                        <div className="theadrow18A">
                          <p className="throw18A dept18Aw">DEPT.</p>
                          <p className="throw18A ap18Aw">AP</p>
                          <p className="throw18A issue18Aw">ISSUE</p>
                          <p className="throw18A work18Aw">RECEIVE</p>
                          <p className="throw18A work18Aw">SCRAP</p>
                          <p className="throw18A issue18Aw">PCS</p>
                          <p className="throw18A work18Aw br177Anone">WORKER</p>
                        </div>
                        <div className="theadrow18A">
                          <p className="throw18A dept18Aw">GRD.</p>
                          <p className="throw18A ap18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw br177Anone"></p>
                        </div>
                        <div className="theadrow18A">
                          <p className="throw18A dept18Aw"> FIL.</p>
                          <p className="throw18A ap18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw br177Anone"></p>
                        </div>
                        <div className="theadrow18A">
                          <p className="throw18A dept18Aw">ASM.</p>
                          <p className="throw18A ap18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw br177Anone"></p>
                        </div>
                        <div className="theadrow18A">
                          <p className="throw18A dept18Aw">CNC.</p>
                          <p className="throw18A ap18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw br177Anone"></p>
                        </div>
                        <div className="theadrow18A">
                          <p className="throw18A dept18Aw">EP/PI.</p>
                          <p className="throw18A ap18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw br177Anone"></p>
                        </div>
                        <div className="theadrow18A">
                          <p className="throw18A dept18Aw">SET.</p>
                          <p className="throw18A ap18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw br177Anone"></p>
                        </div>
                        <div className="theadrow18A">
                          <p className="throw18A dept18Aw">FPL.</p>
                          <p className="throw18A ap18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw br177Anone"></p>
                        </div>
                        <div className="theadrow18A">
                          <p className="throw18A dept18Aw">PLT.</p>
                          <p className="throw18A ap18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw br177Anone"></p>
                        </div>
                        <div className="theadrow18A">
                          <p className="throw18A dept18Aw">ENM.</p>
                          <p className="throw18A ap18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw br177Anone"></p>
                        </div>
                        <div className="theadrow18A">
                          <p className="throw18A dept18Aw">QC.</p>
                          <p className="throw18A ap18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw br177Anone"></p>
                        </div>
                        <div className="theadrow18A">
                          <p className="throw18A dept18Aw">P.P</p>
                          <p className="throw18A ap18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw br177Anone"></p>
                        </div>
                        <div
                          className="theadrow18A"
                          style={{ borderBottom: "0px" }}
                        >
                          <p className="throw18A dept18Aw">F. QC.</p>
                          <p className="throw18A ap18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A work18Aw"></p>
                          <p className="throw18A issue18Aw"></p>
                          <p className="throw18A work18Aw br177Anone"></p>
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

export default BagPrint18A;
