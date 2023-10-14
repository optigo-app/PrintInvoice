import axios from "axios";
import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/bagprint/print7A.css";
import { formatDate } from "../../GlobalFunctions/DateFormat";
import { GetData } from "../../GlobalFunctions/GetData";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import BarcodeGenerator from "../../components/BarcodeGenerator";
import Loader from "../../components/LoaderBag";
import { organizeData } from "../../GlobalFunctions/OrganizeBagPrintData";

const BagPrint7A = ({ queries, headers }) => {
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
  const chunkSize7 = 6;

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
          let length = 0;
          let clr = {
            Shapename: "TOTAL",
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 4,
            // heading: "COLOR STONE DETAIL"
          };
          let dia = {
            Shapename: "TOTAL",
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 3,
            // heading: "DIAMOND DETAIL"
          };
          let misc = {
            Shapename: "TOTAL",
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 7,
            // heading: "MISC DETAIL"
          };
          let f = {
            Shapename: "TOTAL",
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 5,
            // heading: "FINDING DETAIL"
          };
          let ArrofSevenSize = [];
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

          ArrofSevenSize.push(dia);
          ArrofFiveSize.push(clr);
          ArrofFSize.push(f);
          ArrofMISize.push(misc);

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
          // let sizeArr = [];
          let mainArr = arr?.concat(
            ArrofSevenSize,
            ArrofFiveSize,
            ArrofMISize,
            ArrofFSize
          );
          let imagePath = queryParams?.imagepath;
          imagePath = atob(queryParams?.imagepath);

          // let obj = {};
          // datas?.rd1?.forEach((e) => {
          //   if (e?.MasterManagement_DiamondStoneTypeid !== 0) {
          //     sizeArr.push(e);
          //   }
          //   obj= {...obj, sizeArr}
          //   // chunkData.push(obj)
          // });

          let img = imagePath + a?.rd?.ThumbImagePath;

          for (let i = 0; i < mainArr?.length; i += chunkSize7) {
            const chunks = mainArr?.slice(i, i + chunkSize7);
            let len = 6 - mainArr?.slice(i, i + chunkSize7)?.length;
            chunkData.push({ data: chunks, length: len });
          }

          responseData.push({
            data: a,
            additional: {
              length: length,
              clr: clr,
              dia: dia,
              f: f,
              img: img,
              misc: misc,
              pages: chunkData,
            },
          });

        })

        // const sizeArr = [];
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
        //   // let p_tag = { "SerialJobno": `${print[url]}`, "customerid": `${queries.custid}`, "BagPrintName": `${queries.printname}` };
        //   // let jsonString = JSON.stringify(p_tag);
        //   // let base64String = btoa(jsonString);
        //   // let Body = {
        //   //   "con": `{\"id\":\"\",\"mode\":\"${queries.printname}\",\"appuserid\":\"${queries.appuserid}\"}`,
        //   //   "p": `${base64String}`,
        //   //   "f": `${queries.appuserid} ${queries.printname}`
        //   // };
        //   // let urls = atob(queries.url);
        //   // const response = await axios.post(urls, Body, { headers: headers });
        //   // let datas = JSON.parse(response.data.d);

        //   let length = 0;
        //   let clr = {
        //     Shapename: "TOTAL",
        //     Sizename: "",
        //     ActualPcs: 0,
        //     ActualWeight: 0,
        //     MasterManagement_DiamondStoneTypeid: 4,
        //     // heading: "COLOR STONE DETAIL"
        //   };
        //   let dia = {
        //     Shapename: "TOTAL",
        //     Sizename: "",
        //     ActualPcs: 0,
        //     ActualWeight: 0,
        //     MasterManagement_DiamondStoneTypeid: 3,
        //     // heading: "DIAMOND DETAIL"
        //   };
        //   let misc = {
        //     Shapename: "TOTAL",
        //     Sizename: "",
        //     ActualPcs: 0,
        //     ActualWeight: 0,
        //     MasterManagement_DiamondStoneTypeid: 7,
        //     // heading: "MISC DETAIL"
        //   };
        //   let f = {
        //     Shapename: "TOTAL",
        //     Sizename: "",
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

        //   ArrofSevenSize.push(dia);
        //   ArrofFiveSize.push(clr);
        //   ArrofFSize.push(f);
        //   ArrofMISize.push(misc);

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
        //   // let sizeArr = [];
        //   let mainArr = arr.concat(
        //     ArrofSevenSize,
        //     ArrofFiveSize,
        //     ArrofMISize,
        //     ArrofFSize
        //   );
        //   let imagePath = queryParams.imagepath;
        //   imagePath = atob(queryParams.imagepath);

        //   // let obj = {};
        //   // datas?.rd1?.forEach((e) => {
        //   //   if (e?.MasterManagement_DiamondStoneTypeid !== 0) {
        //   //     sizeArr.push(e);
        //   //   }
        //   //   obj= {...obj, sizeArr}
        //   //   // chunkData.push(obj)
        //   // });

        //   let img = imagePath + datas?.rd?.ThumbImagePath;

        //   for (let i = 0; i < mainArr.length; i += chunkSize7) {
        //     const chunks = mainArr.slice(i, i + chunkSize7);
        //     let len = 6 - mainArr.slice(i, i + chunkSize7).length;

        //     // let sizeArr = [];

        //     chunkData.push({ data: chunks, length: len });
        //   }

        //   responseData.push({
        //     data: datas,
        //     additional: {
        //       length: length,
        //       clr: clr,
        //       dia: dia,
        //       f: f,
        //       img: img,
        //       misc: misc,
        //       pages: chunkData,
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

  // function handlePrint(e) {
  //   e.preventDefault();
  //   window.print();
  // }

  // const handleImageError = (e) => {
  //   e.target.src = require('../../assets/img/default.jpg');
  // };

  const handleImageLoad = (eve, i, dataLen) => {
    // if (i === dataLen - 1) {
    //     setTimeout(window.print(), 5000);
    // }
  };
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
          <div className="print_btn">
            <button
              className="btn_white blue print_btn"
              onClick={(e) => handlePrint(e)}
            >
              Print
            </button>
          </div>

          <div className="print7A">
            {Array.from(
              { length: queries?.pageStart },
              (_, index) =>
                index > 0 && (
                  <div
                    key={index}
                    className="container7A"
                    style={{ border: "0px" }}
                  ></div>
                )
            )}
            {data?.length > 0 &&
              data?.map((e, ins) => {
                return (
                  <React.Fragment key={ins}>
                    {e?.additional?.pages?.length > 0 ? (
                      e?.additional?.pages.map((ele, ind) => {
                        return (
                          <div className="container7A" key={ind}>
                            <div className="head7A">
                              <div className="head7AjobInfo">
                                <div className="head7AjobInfoJobNO">
                                  <div>
                                    Ord. : {e?.data?.rd?.orderDatef ?? ""}
                                  </div>
                                  <div>
                                    Due : {e?.data?.rd?.promiseDatef ?? ""}
                                  </div>
                                  <div>
                                    <b>{e?.data?.rd?.serialjobno}</b>
                                  </div>
                                </div>
                                <div className="party7A">
                                  <div>
                                    Party: <b>{e?.data?.rd?.CustomerCode}</b>
                                  </div>
                                  <div style={{ paddingBottom: "4px" }}>
                                    Ord No. : <b>{e?.data?.rd?.OrderNo}</b>
                                  </div>
                                </div>
                                <div className="party7A">
                                  <div>
                                    Dg No. : <b>{e?.data?.rd?.Designcode}</b>
                                  </div>
                                  <div className="barcode7A">
                                    {e?.data?.rd?.length !== 0 &&
                                      e?.data?.rd !== undefined && (
                                        <>
                                          {e?.data?.rd?.serialjobno !==
                                            undefined && (
                                            <BarcodeGenerator
                                              data={e?.data?.rd?.serialjobno}
                                            />
                                          )}
                                        </>
                                      )}
                                  </div>
                                </div>
                                <div className="party7A">
                                  <div>Size: {e?.data?.rd?.Size}</div>
                                  <div>({e?.data?.rd?.Quantity})Pcs</div>
                                  <div>{e?.data?.rd?.prioritycode}</div>
                                </div>

                                <div className="mat7AInfo">
                                  <div className="pcswt7AH">
                                    <div className="net7A">
                                      <b>Net Wt.</b>
                                    </div>
                                    <div className="net7A justify-content-end pe-1">
                                      {e?.data?.rd?.netwt}
                                    </div>
                                    <div className="net7A">
                                      <b>Gr Wt.</b>
                                    </div>
                                    <div className="net7A justify-content-end pe-1">
                                      {e?.data?.rd?.ActualGrossweight.toFixed(
                                        3
                                      )}
                                    </div>
                                  </div>
                                  <div className="pcswt7AH">
                                    <div className="net7A">
                                      <b>Dia Pcs:</b>
                                    </div>
                                    <div className="net7A justify-content-end pe-1">
                                      {e?.additional?.dia?.ActualPcs}
                                    </div>
                                    <div className="net7A">
                                      <b>Dia Wt.</b>
                                    </div>
                                    <div className="net7A justify-content-end pe-1">
                                      {e?.additional?.dia?.ActualWeight.toFixed(
                                        3
                                      )}
                                    </div>
                                  </div>
                                  <div className="pcswt7AH">
                                    <div className="net7A">
                                      <b>Clr Pcs:</b>
                                    </div>
                                    <div className="net7A justify-content-end pe-1">
                                      {e?.additional?.clr?.ActualPcs}
                                    </div>
                                    <div className="net7A">
                                      <b>Clr Wt.</b>
                                    </div>
                                    <div className="net7A justify-content-end pe-1">
                                      {e?.additional?.clr?.ActualWeight.toFixed(
                                        3
                                      )}
                                    </div>
                                  </div>
                                  <div className="pcswt7AH">
                                    <div className="net7A">
                                      <b>Misc Pcs:</b>
                                    </div>
                                    <div className="net7A justify-content-end pe-1">
                                      {e?.additional?.misc?.ActualPcs}
                                    </div>
                                    <div className="net7A">
                                      <b>Misc Wt.</b>
                                    </div>
                                    <div className="net7A justify-content-end pe-1">
                                      {e?.additional?.misc?.ActualWeight.toFixed(
                                        3
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="imgSize7A">
                                {" "}
                                <img
                                  src={
                                    e?.additional?.img !== ""
                                      ? e?.additional?.img
                                      : require("../../assets/img/default.jpg")
                                  }
                                  id="img7A"
                                  alt=""
                                  onError={(e) => handleImageError(e)}
                                  loading="eager"
                                  onLoad={(eve) =>
                                    handleImageLoad(eve, ins, data?.length)
                                  }
                                />
                                <div
                                  className="borderBottom7A"
                                  style={{
                                    fontSize: "11px",
                                    lineHeight: "9px",
                                    padding: "2px",
                                    height: "21px",
                                  }}
                                >
                                  {e?.data?.rd?.MetalType}{" "}
                                  {e?.data?.rd?.MetalColorCo}
                                </div>
                              </div>
                            </div>
                            <div className="main7A">
                              <div className="main7AEntry">
                                <div style={{ height: "13px" }}></div>
                                <div className="divide7A">
                                  <div className="tableHead7A">
                                    <div
                                      className="type7A"
                                      style={{
                                        borderBottom: "1px solid #989898",
                                        borderTop: "1px solid #989898",
                                      }}
                                    >
                                      <p
                                        className="w7A"
                                        style={{ width: "74px" }}
                                      >
                                        <b>Type</b>
                                      </p>
                                      <p
                                        className="w7A"
                                        style={{ width: "61px" }}
                                      >
                                        <b>Purity</b>
                                      </p>
                                      <p
                                        className="w7A"
                                        style={{ width: "61px" }}
                                      >
                                        <b>Color</b>
                                      </p>
                                      <p
                                        className="w7A"
                                        style={{ width: "74px" }}
                                      >
                                        <b>Size</b>
                                      </p>
                                      <p
                                        className="w7A"
                                        style={{ width: "41px" }}
                                      >
                                        <b>Pcs</b>
                                      </p>
                                      <p
                                        className="w7A"
                                        style={{ width: "41px" }}
                                      >
                                        <b>Wt</b>
                                      </p>
                                    </div>
                                  </div>
                                  {/* <div className='tableHead7A'>
                                      <div className='type7B'>
                                        <p className='size7A' style={{ width: "74px" }}>Size</p>
                                        <p className='size7A'>Pcs</p>
                                        <p className='size7A' style={{ borderRight: "0px" }}>Wt.</p>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="divide7A">
                                  <div>
                                    {ele?.data?.map((a, i) => {
                                      return (
                                        <React.Fragment key={i}>
                                          {a?.Shapename === "TOTAL" ? (
                                            <div className="tableHead7A">
                                              <div
                                                className="type7A"
                                                style={{
                                                  borderBottom:
                                                    "1px solid #989898",
                                                }}
                                              >
                                                <p
                                                  className="w7A"
                                                  style={{ width: "74px" }}
                                                >
                                                  {a?.Sizename}
                                                </p>
                                                <p
                                                  className="w7A"
                                                  style={{ width: "61px" }}
                                                >
                                                  {a?.QualityCode}
                                                </p>
                                                <p
                                                  className="w7A"
                                                  style={{ width: "61px" }}
                                                >
                                                  {a?.ColorCode}
                                                </p>
                                                {a?.MasterManagement_DiamondStoneTypeid ===
                                                  3 && (
                                                  <p
                                                    className="w7A fw-bold"
                                                    style={{ width: "74px" }}
                                                  >
                                                    D {a?.Shapename}
                                                  </p>
                                                )}
                                                {a?.MasterManagement_DiamondStoneTypeid ===
                                                  4 && (
                                                  <p
                                                    className="w7A fw-bold"
                                                    style={{ width: "74px" }}
                                                  >
                                                    C {a?.Shapename}
                                                  </p>
                                                )}
                                                {a?.MasterManagement_DiamondStoneTypeid ===
                                                  5 && (
                                                  <p
                                                    className="w7A fw-bold"
                                                    style={{ width: "74px" }}
                                                  >
                                                    F {a?.Shapename}
                                                  </p>
                                                )}
                                                {a?.MasterManagement_DiamondStoneTypeid ===
                                                  7 && (
                                                  <p
                                                    className="w7A fw-bold"
                                                    style={{ width: "74px" }}
                                                  >
                                                    M {a?.Shapename}
                                                  </p>
                                                )}
                                                <p
                                                  className="w7A fw-bold justify-content-end"
                                                  style={{
                                                    width: "41px",
                                                    paddingRight: "2px",
                                                  }}
                                                >
                                                  {a?.ActualPcs}
                                                </p>
                                                <p
                                                  className="w7A fw-bold justify-content-end"
                                                  style={{
                                                    width: "41px",
                                                    paddingRight: "2px",
                                                  }}
                                                >
                                                  {a?.ActualWeight?.toFixed(3)}
                                                </p>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="tableHead7A">
                                              <div
                                                className="type7A"
                                                style={{
                                                  height: "15px",
                                                  borderBottom:
                                                    "1px solid #989898",
                                                }}
                                              >
                                                <p
                                                  className="w7A"
                                                  style={{ width: "74px" }}
                                                >
                                                  {a?.Shapename}
                                                </p>
                                                <p
                                                  className="w7A"
                                                  style={{ width: "61px" }}
                                                >
                                                  {a?.Quality}
                                                </p>
                                                <p
                                                  className="w7A"
                                                  style={{ width: "61px" }}
                                                >
                                                  {a?.ColorCode}
                                                </p>
                                                <p
                                                  className="w7A"
                                                  style={{ width: "74px" }}
                                                >
                                                  {a?.Sizename}
                                                </p>
                                                <p
                                                  className="w7A justify-content-end"
                                                  style={{
                                                    width: "41px",
                                                    paddingRight: "2px",
                                                  }}
                                                >
                                                  {a?.ActualPcs}
                                                </p>
                                                <p
                                                  className="w7A justify-content-end"
                                                  style={{
                                                    width: "41px",
                                                    paddingRight: "2px",
                                                  }}
                                                >
                                                  {a?.ActualWeight?.toFixed(3)}
                                                </p>
                                              </div>
                                            </div>
                                          )}
                                        </React.Fragment>
                                      );
                                    })}
                                    {
                                      // ele?.data?.map((a) => {
                                      Array.from(
                                        { length: ele?.length },
                                        (_, index) => (
                                          // a.Shapename === "TOTAL" ? <div className='tableHead7A' style={{ display: "none" }}>
                                          //   <div className='type7A' ><p className='w7A'>{a.Shapename}</p><p className='w7A'>{a.QualityCode}</p><p className='w7A'>{a.ColorCode}</p></div>
                                          // </div> :
                                          <div
                                            className="tableHead7A"
                                            key={index}
                                          >
                                            <div
                                              className="type7A"
                                              style={{
                                                height: "15px",
                                                borderBottom:
                                                  "1px solid #989898",
                                              }}
                                            >
                                              <p
                                                className="w7A"
                                                style={{ width: "74px" }}
                                              ></p>
                                              <p
                                                className="w7A"
                                                style={{ width: "61px" }}
                                              ></p>
                                              <p
                                                className="w7A"
                                                style={{ width: "61px" }}
                                              ></p>
                                              <p
                                                className="w7A"
                                                style={{ width: "74px" }}
                                              ></p>
                                              <p
                                                className="w7A"
                                                style={{ width: "41px" }}
                                              ></p>
                                              <p
                                                className="w7A"
                                                style={{ width: "41px" }}
                                              ></p>
                                            </div>
                                          </div>
                                        )
                                      )
                                      // return (
                                      //   <>
                                      //     {
                                      //       a.Shapename === "TOTAL" ? <div className='tableHead7A' style={{ display: "none" }}>
                                      //         <div className='type7A' ><p className='w7A'>{a.Shapename}</p><p className='w7A'>{a.QualityCode}</p><p className='w7A'>{a.ColorCode}</p></div>
                                      //       </div> : <div className='tableHead7A'>
                                      //         <div className='type7A' style={{ height: "15px" }} ><p className='w7A'>{a.Shapename}</p><p className='w7A'>{a.QualityCode}</p><p className='w7A'>{a.ColorCode}</p></div>
                                      //       </div>
                                      //     }

                                      //   </>
                                      // );
                                    }
                                  </div>
                                  <div className="size7AHeight">
                                    {/* {
                                        ele?.data?.map((a) => {
                                          return (
                                            <>
                                              {
                                                a.Shapename === "TOTAL" ?
                                                  <div className=''>
                                                    {
                                                      a?.MasterManagement_DiamondStoneTypeid === 3 && <div className='type7B' style={{ height: "16px" }}>
                                                        <p className='size7A' style={{ width: "74px" }}><b style={{ fontSize: "10px" }}>D TOTAL</b></p>
                                                        <p className='size7A'><b style={{ fontSize: "9px" }}>{a.ActualPcs}</b></p>
                                                        <p className='size7A'><b style={{ borderRight: "0px", fontSize: "9px" }}></b></p>
                                                      </div>
                                                    }
                                                    {
                                                      a?.MasterManagement_DiamondStoneTypeid === 4 && <div className='type7B' style={{ height: "16px" }}>
                                                        <p className='size7A' style={{ width: "74px" }}><b style={{ fontSize: "10px" }}>C TOTAL</b></p>
                                                        <p className='size7A' ><b style={{ fontSize: "9px" }}>{a.ActualPcs}</b></p>
                                                        <p className='size7A' ><b style={{ borderRight: "0px", fontSize: "9px" }}></b></p>
                                                      </div>
                                                    }
                                                    {
                                                      a?.MasterManagement_DiamondStoneTypeid === 5 && <div className='type7B' style={{ height: "16px" }}>
                                                        <p className='size7A' style={{ width: "74px" }}><b style={{ fontSize: "10px" }}>F TOTAL</b></p>
                                                        <p className='size7A'><b style={{ fontSize: "9px" }}>{a.ActualPcs}</b></p>
                                                        <p className='size7A' ><b style={{ borderRight: "0px", fontSize: "9px" }}></b></p>
                                                      </div>
                                                    }
                                                    {
                                                      a?.MasterManagement_DiamondStoneTypeid === 7 && <div className='type7B' style={{ height: "16px" }}>
                                                        <p className='size7A' style={{ width: "74px" }}><b style={{ fontSize: "10px" }}>M TOTAL</b></p>
                                                        <p className='size7A'><b style={{ fontSize: "9px" }}>{a.ActualPcs}</b></p>
                                                        <p className='size7A' ><b style={{ borderRight: "0px solid", fontSize: "9px" }}></b></p>
                                                      </div>
                                                    }

                                                  </div> :
                                                  <div className=''>
                                                    <div className='type7B' style={{ height: "16px" }}>
                                                      <p className='size7A' style={{ width: "74px", display: "flex", justifyContent: "flex-start", paddingLeft: "2px", lineHeight:"8px" }}>{a.Sizename}</p>
                                                      <p className='size7A'>{a?.ActualPcs}</p>
                                                      <p className='size7A' style={{ borderRight: "0px" }}>{ }</p></div>
                                                  </div>
                                              }

                                            </>
                                          );
                                        })

                                      } */}
                                  </div>
                                </div>
                                <div className="d-flex">
                                  <div>
                                    <div
                                      className="tableHead7B"
                                      style={{ borderTop: "1px solid #989898" }}
                                    >
                                      <div
                                        className="dept7A"
                                        style={{ width: "63px" }}
                                      >
                                        Dept
                                      </div>
                                      <div className="dept7A">WrKr</div>
                                      <div className="dept7A">In Wt</div>
                                      <div className="dept7A">OutWt</div>
                                      <div className="dept7A">D Wt</div>
                                      <div
                                        className="dept7A"
                                        style={{ borderRight: "0px" }}
                                      >
                                        (%)
                                      </div>
                                    </div>
                                    <div className="entryVal7A">
                                      <div className="tableHead7C">
                                        <div className="dept7AD">WAX</div>
                                        <div className="dept7AD">CAS</div>
                                        <div className="dept7AD">In Wt</div>
                                        <div className="dept7AD">GRNDING</div>
                                        <div className="dept7AD">BUFFING</div>
                                        <div className="dept7AD">PRE POLI</div>
                                        <div className="dept7AD">SETTING</div>
                                        <div className="dept7AD">MTL FSH</div>
                                        <div className="dept7AD">F POLISH</div>
                                        <div className="dept7AD">RHODIUM</div>
                                      </div>

                                      <div className="dflexcolumn">
                                        {Array.from(
                                          { length: 10 },
                                          (_, index) => {
                                            return (
                                              <div
                                                className="dis7A"
                                                key={index}
                                              >
                                                <div className="dept7AE"></div>
                                                <div className="dept7AE"></div>
                                                <div className="dept7AE"></div>
                                                <div className="dept7AE"></div>
                                                <div
                                                  className="dept7AE"
                                                  style={{ borderRight: "0px" }}
                                                ></div>
                                              </div>
                                            );
                                          }
                                        )}
                                      </div>
                                    </div>
                                    <div className="tableHead7B">
                                      <div
                                        className="dept7A"
                                        style={{ width: "63px" }}
                                      >
                                        MFG
                                      </div>
                                      <div className="dept7A">Gwt</div>
                                      <div className="dept7A">Dwt</div>
                                      <div className="dept7A">Cwt</div>
                                      <div className="dept7A">Nwt</div>
                                      <div
                                        className="dept7A"
                                        style={{ borderRight: "0px" }}
                                      >
                                        Sign
                                      </div>
                                    </div>
                                    <div className="tableHead7B">
                                      <div
                                        className="dept7A"
                                        style={{
                                          width: "63px",
                                          height: "16px",
                                        }}
                                      ></div>
                                      <div className="dept7A"></div>
                                      <div className="dept7A"></div>
                                      <div className="dept7A"></div>
                                      <div className="dept7A"></div>
                                      <div
                                        className="dept7A"
                                        style={{ borderRight: "0px" }}
                                      ></div>
                                    </div>
                                  </div>
                                  {/* <div className="anotherBarcode7A">
                                    hello
                                    <BarcodeGenerator
                                      data={e?.data?.rd?.serialjobno}
                                    />
                                  </div> */}
                                </div>
                              </div>
                            </div>
                            <div
                              style={{ height: "4px", width: "269px" }}
                            ></div>
                            <div
                              className="tableHead7B"
                              style={{
                                fontWeight: "bold",
                                borderTop: "1px solid #989898",
                              }}
                            >
                              <div
                                className="dept7A fs7A"
                                style={{ width: "63px" }}
                              >
                                Gr. Wt{" "}
                              </div>
                              <div className="dept7A fs7A">Chaki Post</div>
                              <div className="dept7A fs7A">Taar</div>
                              <div className="dept7A fs7A">Extra Metal</div>
                              <div
                                className="dept7A fs7A"
                                style={{ borderRight: "0px" }}
                              >
                                Other
                              </div>
                            </div>
                            <div
                              className="tableHead7B"
                              style={{ fontWeight: "bold", height: "16px" }}
                            >
                              <div
                                className="dept7A"
                                style={{ width: "63px" }}
                              ></div>
                              <div className="dept7A"></div>
                              <div className="dept7A"></div>
                              <div className="dept7A"></div>
                              <div
                                className="dept7A"
                                style={{ borderRight: "0px" }}
                              ></div>
                            </div>

                            <div className="footer7A">
                              <b
                                style={{
                                  lineHeight: "8px",
                                  marginTop: "3px",
                                  padding: "2px",
                                }}
                              >
                                Remark:{" "}
                                {(
                                  e?.data?.rd?.custInstruction +
                                  e?.data?.rd?.QuoteRemark +
                                  e?.data?.rd?.ProductInstruction
                                )?.length > 0
                                  ? e?.data?.rd?.custInstruction +
                                      e?.data?.rd?.QuoteRemark +
                                      e?.data?.rd?.ProductInstruction ==
                                    (null || "null")
                                    ? ""
                                    : (
                                        e?.data?.rd?.custInstruction +
                                        e?.data?.rd?.QuoteRemark +
                                        e?.data?.rd?.ProductInstruction
                                      )?.slice(0, 200)
                                  : ""}
                              </b>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="container7A">
                        <div className="head7A">
                          <div className="head7AjobInfo">
                            <div className="head7AjobInfoJobNO">
                              <div>
                                Ord. : {e?.data?.rd?.orderDatef ?? ""}
                              </div>
                              <div>
                                Due : {e?.data?.rd?.promiseDatef ?? ""}
                              </div>
                              <div>
                                <b>{e?.data?.rd?.serialjobno}</b>
                              </div>
                            </div>
                            <div className="party7A">
                              <div>
                                Party: <b>{e?.data?.rd?.CustomerCode}</b>
                              </div>
                              <div>
                                Ord No. : <b>{e?.data?.rd?.OrderNo}</b>
                              </div>
                            </div>
                            <div className="party7A">
                              <div>
                                Dg No. : <b>{e?.data?.rd?.Designcode}</b>
                              </div>
                              <div class Name="barcode7A">
                                {e?.data?.rd?.length !== 0 &&
                                  e?.data?.rd !== undefined && (
                                    <>
                                      {e?.data?.rd?.serialjobno !==
                                        undefined && (
                                        <BarcodeGenerator
                                          data={e?.data?.rd?.serialjobno}
                                        />
                                      )}
                                    </>
                                  )}
                              </div>
                            </div>
                            <div className="party7A">
                              <div>Size: {e?.data?.rd?.Size}</div>
                              <div>(1)Pcs</div>
                            </div>

                            <div className="mat7AInfo">
                              <div className="pcswt7A">
                                <div className="net7A">
                                  <b>Net Wt.</b>
                                </div>
                                <div className="net7A">
                                  {e?.data?.rd?.netwt}
                                </div>
                                <div className="net7A">
                                  <b>Gr Wt.</b>
                                </div>
                                <div className="net7A">
                                  {e?.data?.rd?.ActualGrossweight}
                                </div>
                              </div>
                              <div className="pcswt7A">
                                <div className="net7A">
                                  <b>Dia Pcs:</b>
                                </div>
                                <div className="net7A">
                                  {e?.additional?.dia?.ActualPcs}
                                </div>
                                <div className="net7A">
                                  <b>Dia Wt.</b>
                                </div>
                                <div className="net7A">
                                  {e?.additional?.dia?.ActualWeight?.toFixed(3)}
                                </div>
                              </div>
                              <div className="pcswt7A">
                                <div className="net7A">
                                  <b>Clr Pcs:</b>
                                </div>
                                <div className="net7A">
                                  {e?.additional?.clr?.ActualPcs}
                                </div>
                                <div className="net7A">
                                  <b>Clr Wt.</b>
                                </div>
                                <div className="net7A">
                                  {e?.additional?.clr?.ActualWeight?.toFixed(3)}
                                </div>
                              </div>
                              <div className="pcswt7A">
                                <div className="net7A">
                                  <b>Misc Pcs:</b>
                                </div>
                                <div className="net7A">
                                  {e?.additional?.misc?.ActualPcs}
                                </div>
                                <div className="net7A">
                                  <b>Misc Wt.</b>
                                </div>
                                <div className="net7A">
                                  {e?.additional?.misc?.ActualWeight?.toFixed(
                                    3
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="imgSize7A">
                            {" "}
                            <img
                              src={
                                e?.additional?.img !== ""
                                  ? e?.additional?.img
                                  : require("../../assets/img/default.jpg")
                              }
                              id="img7A"
                              alt=""
                              onError={(e) => handleImageError(e)}
                              loading="eager"
                              onLoad={(eve) =>
                                handleImageLoad(eve, ins, data?.length)
                              }
                            />
                            <div
                              className="borderBottom7A"
                              style={{
                                fontSize: "11px",
                                lineHeight: "8px",
                                padding: "2px",
                                height: "22px",
                              }}
                            >
                              {e?.data?.rd?.MetalType}
                              {e?.data?.rd?.MetalColorCo}
                            </div>
                          </div>
                          {/* <div className='imgSize7A'><div className='img7A'>img</div><div className='borderBottom7A'>GOLD 18K YL</div></div> */}
                        </div>
                        <div className="main7A">
                          <div className="main7AEntry">
                            <div style={{ height: "13px" }}></div>
                            <div
                              className="tableHead7A"
                              style={{ borderBottom: "1px solid #989898" }}
                            >
                              <div className="type7A">
                                <p className="w7A">Type</p>
                                <p className="w7A">Purity</p>
                                <p className="w7A">Color</p>
                              </div>
                              <div className="type7B">
                                <p className="size7A">Size</p>
                                <p className="size7A">Pcs</p>
                                <p
                                  className="size7A"
                                  style={{ borderRight: "0px" }}
                                >
                                  Wt.
                                </p>
                              </div>
                            </div>
                            <div className="tableHead7B">
                              <div className="dept7A" style={{ width: "63px" }}>
                                Dept
                              </div>
                              <div className="dept7A">WrKr</div>
                              <div className="dept7A">In Wt</div>
                              <div className="dept7A">OutWt</div>
                              <div className="dept7A">D Wt</div>
                              <div
                                className="dept7A"
                                style={{ borderRight: "0px" }}
                              >
                                (%)
                              </div>
                            </div>
                            <div className="entryVal7A">
                              <div className="tableHead7C">
                                <div className="dept7AD">WAX</div>
                                <div className="dept7AD">CAS</div>
                                <div className="dept7AD">In Wt</div>
                                <div className="dept7AD">GRNDING</div>
                                <div className="dept7AD">BUFFING</div>
                                <div className="dept7AD">PRE POLI</div>
                                <div className="dept7AD">SETTING</div>
                                <div className="dept7AD">MTL FSH</div>
                                <div className="dept7AD">F POLISH</div>
                                <div className="dept7AD">RHODIUM</div>
                              </div>

                              <div className="dflexcolumn">
                                {Array.from({ length: 10 }, (_, index) => {
                                  return (
                                    <div className="dis7A" key={index}>
                                      <div className="dept7AE"></div>
                                      <div className="dept7AE"></div>
                                      <div className="dept7AE"></div>
                                      <div className="dept7AE"></div>
                                      <div
                                        className="dept7AE"
                                        style={{ borderRight: "0px" }}
                                      ></div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="tableHead7B">
                              <div className="dept7A" style={{ width: "63px" }}>
                                MFG
                              </div>
                              <div className="dept7A">Gwt</div>
                              <div className="dept7A">Dwt</div>
                              <div className="dept7A">Cwt</div>
                              <div className="dept7A">Nwt</div>
                              <div
                                className="dept7A"
                                style={{ borderRight: "0px" }}
                              >
                                Sign
                              </div>
                            </div>
                            <div className="tableHead7B">
                              <div
                                className="dept7A"
                                style={{ width: "63px", height: "16px" }}
                              ></div>
                              <div className="dept7A"></div>
                              <div className="dept7A"></div>
                              <div className="dept7A"></div>
                              <div className="dept7A"></div>
                              <div
                                className="dept7A"
                                style={{ borderRight: "0px" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div style={{ height: "13px", width: "269px" }}></div>
                        <div
                          className="tableHead7B"
                          style={{
                            fontWeight: "bold",
                            borderTop: "1px solid #989898",
                          }}
                        >
                          <div
                            className="dept7A fs7A"
                            style={{ width: "63px" }}
                          >
                            Gr. Wt{" "}
                          </div>
                          <div className="dept7A fs7A">Chaki Post</div>
                          <div className="dept7A fs7A">Taar</div>
                          <div className="dept7A fs7A">Extra Metal</div>
                          <div
                            className="dept7A fs7A"
                            style={{ borderRight: "0px" }}
                          >
                            Other
                          </div>
                        </div>
                        <div
                          className="tableHead7B"
                          style={{ fontWeight: "bold", height: "20px" }}
                        >
                          <div
                            className="dept7A"
                            style={{ width: "63px" }}
                          ></div>
                          <div className="dept7A"></div>
                          <div className="dept7A"></div>
                          <div className="dept7A"></div>
                          <div
                            className="dept7A"
                            style={{ borderRight: "0px" }}
                          ></div>
                        </div>

                        <div className="footer7A">
                          <b>
                            Remark:{" "}
                            {(
                              e?.data?.rd?.custInstruction +
                              e?.data?.rd?.QuoteRemark +
                              e?.data?.rd?.ProductInstruction
                            )?.length > 0
                              ? e?.data?.rd?.custInstruction +
                                  e?.data?.rd?.QuoteRemark +
                                  e?.data?.rd?.ProductInstruction ==
                                (null || "null")
                                ? ""
                                : (
                                    e?.data?.rd?.custInstruction +
                                    e?.data?.rd?.QuoteRemark +
                                    e?.data?.rd?.ProductInstruction
                                  )?.slice(0, 131)
                              : ""}
                          </b>
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

export default BagPrint7A;
