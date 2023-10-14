import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/bagprint/print10A.css";
import { GetChunkData } from "../../GlobalFunctions/GetChunkData";
import { GetData } from "../../GlobalFunctions/GetData";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import BarcodeGenerator from "../../components/BarcodeGenerator";
import Loader from "../../components/LoaderBag";
import { organizeData } from './../../GlobalFunctions/OrganizeBagPrintData';
const BagPrint10A = ({ queries, headers }) => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  let jobs = queryParams.str_srjobno;
  const parts = jobs.split(",");
  const resultString = parts.map((part) => `'${part}'`).join(",");
  if (Object.keys(queryParams).length !== 0) {
    jobs = jobs.split(",");
  }

  const [print, setPrint] = useState(jobs);
  const chunkSize17 = 17;

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

          // ArrofSevenSize.push(dia);
          // ArrofFiveSize.push(clr);
          // ArrofFSize.push(f);
          // ArrofMISize.push(misc);

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
          let mainArr = arr?.concat(
            ArrofSevenSize,
            ArrofFiveSize,
            ArrofMISize,
            ArrofFSize
          );
          let imagePath = queryParams?.imagepath;
          imagePath = atob(queryParams?.imagepath);

          let img = imagePath + a?.rd?.ThumbImagePath;
          let arrofchunk = GetChunkData(chunkSize17, mainArr);
          // for (let i = 0; i < mainArr.length; i += chunkSize17) {
          //     const chunks = mainArr.slice(i, i + chunkSize17);
          //     let len = 17 - (mainArr.slice(i, i + chunkSize17)).length;
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

        //   let length = 0;
        //   let clr = {
        //     Shapename: "TOTAL",
        //     Sizename: "",
        //     ActualPcs: 0,
        //     ActualWeight: 0,
        //     // heading: "COLOR STONE DETAIL"
        //   };
        //   let dia = {
        //     Shapename: "TOTAL",
        //     Sizename: "",
        //     ActualPcs: 0,
        //     ActualWeight: 0,
        //     // heading: "DIAMOND DETAIL"
        //   };
        //   let misc = {
        //     Shapename: "TOTAL",
        //     Sizename: "",
        //     ActualPcs: 0,
        //     ActualWeight: 0,
        //     // heading: "MISC DETAIL"
        //   };
        //   let f = {
        //     Shapename: "TOTAL",
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
        //   let imagePath = queryParams?.imagepath;
        //   imagePath = atob(queryParams?.imagepath);

        //   let img = imagePath + datas?.rd[0]?.ThumbImagePath;
        //   let arrofchunk = GetChunkData(chunkSize17, mainArr);
        //   // for (let i = 0; i < mainArr.length; i += chunkSize17) {
        //   //     const chunks = mainArr.slice(i, i + chunkSize17);
        //   //     let len = 17 - (mainArr.slice(i, i + chunkSize17)).length;
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
        setLoader(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // function handlePrint(e) {
  //     e.preventDefault();
  //     window.print();
  // }

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

  const handleImageLoad = (eve, i, dataLen) => {
    // if (i === dataLen - 1) {
    //     setTimeout(window.print(), 5000);
    // }
  };

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

          <div className="bag10Afinal">
            {Array.from(
              { length: queries.pageStart },
              (_, index) =>
                index > 0 && (
                  <div
                    key={index}
                    className="container10A"
                    style={{ border: "0px" }}
                  ></div>
                )
            )}
            {data?.length > 0 &&
              data.map((e, i) => {
                return (
                  <React.Fragment key={i}>
                    {e?.additional?.pages?.length > 0 ? (
                      e?.additional?.pages.map((ele, index) => {
                        return (
                          <div className="print10A" key={index}>
                            <div className="container10A">
                              <div className="bag10A">
                                <div className="flex10A">
                                  <div className="header10A">
                                    <div className="head10A">
                                      <div className="head10Ajob">
                                        <div style={{ lineHeight: "9px" }}>
                                          {e?.data?.rd?.serialjobno}
                                        </div>
                                        <div style={{ lineHeight: "9px" }}>
                                          {e?.data?.rd?.Designcode}
                                        </div>
                                        <div style={{ lineHeight: "9px" }}>
                                          {e?.data?.rd?.MetalType}{" "}
                                          {e?.data?.rd?.MetalColorCo}
                                        </div>
                                        {/* <div>{e?.data?.rd?.MetalColorCo}</div> */}
                                      </div>
                                      <div className="head10Ainfo">
                                        <div className="info10Amid">
                                          <p className="f10A diffColor">
                                            CUST.
                                          </p>
                                          <p className="f10A">
                                            {e?.data?.rd?.CustomerCode}
                                          </p>
                                        </div>
                                        <div className="info10Amid">
                                          <p className="f10A diffColor">
                                            ORD. DT.
                                          </p>
                                          <p className="f10A">
                                            {e?.data?.rd?.orderDatef ?? ""}
                                          </p>
                                        </div>
                                        <div className="info10Aend">
                                          <p className="f10A diffColor">
                                            DEL. DT.
                                          </p>
                                          <p className="f10A">
                                            {e?.data?.rd?.promiseDatef ?? ""}
                                          </p>
                                        </div>
                                        <div className="info10Alast">
                                          <p
                                            className="f10A diffColor"
                                            style={{ borderRight: "0px" }}
                                          >
                                            SIZE
                                          </p>
                                          <p
                                            className="f10A"
                                            style={{ borderRight: "0px" }}
                                          >
                                            {e?.data?.rd?.Size}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="section10A">
                                    <div className="seaction10AheadA">
                                      <div className="seaction10AheadCode">
                                        CODE
                                      </div>
                                      <div className="seaction10AheadSize">
                                        SIZE
                                      </div>
                                      <div className="seaction10AheadPcs">
                                        PCS
                                      </div>
                                      <div
                                        className="seaction10AheadWT"
                                        style={{ width: "40px" }}
                                      >
                                        WT
                                      </div>
                                      <div className="seaction10AheadPcs">
                                        PCS
                                      </div>
                                      <div className="seaction10AheadWT">
                                        WT
                                      </div>
                                    </div>
                                    <div className="seaction10AheadA">
                                      <div
                                        className="seaction10AheadCode"
                                        style={{ fontWeight: "normal" }}
                                      >
                                        {e?.data?.rd?.MetalType}{" "}
                                        {e?.data?.rd?.MetalColorCo}
                                      </div>
                                      <div className="seaction10AheadSize"></div>
                                      <div className="seaction10AheadPcs"></div>
                                      <div
                                        className="seaction10AheadWT"
                                        style={{ width: "40px" }}
                                      ></div>
                                      <div className="seaction10AheadPcs"></div>
                                      <div className="seaction10AheadWT"></div>
                                    </div>
                                    {ele?.data.map((a, i) => {
                                      return (
                                        <React.Fragment key={i}>
                                          {a.MasterManagement_DiamondStoneTypeid ===
                                          5 ? (
                                            <div
                                              className="seaction10Amid"
                                              key={i}
                                            >
                                              <div
                                                className="seaction10Ahead"
                                                style={{ fontWeight: "normal" }}
                                              >
                                                <div
                                                  className="seaction10AheadCode"
                                                  style={{ width: "138px" }}
                                                >
                                                  {
                                                    a?.LimitedShapeQualityColorCode
                                                  }{" "}
                                                  {
                                                    a?.QualityCode?.split(
                                                      " "
                                                    )?.[1]
                                                  }{" "}
                                                  {a?.ColorName}
                                                </div>
                                                <div className="seaction10AheadPcs">
                                                  {a?.ActualPcs}
                                                </div>
                                                <div
                                                  className="seaction10AheadWT"
                                                  style={{ width: "40px" }}
                                                >
                                                  {a?.ActualWeight?.toFixed(3)}
                                                </div>
                                                <div className="seaction10AheadPcs"></div>
                                                <div className="seaction10AheadWT"></div>
                                              </div>
                                            </div>
                                          ) : (
                                            <div
                                              className="seaction10Amid"
                                              key={i}
                                            >
                                              <div
                                                className="seaction10Ahead"
                                                style={{ fontWeight: "normal" }}
                                              >
                                                {a?.Shapename === "TOTAL" ? (
                                                  <div className="seaction10AheadCode">
                                                    {a?.Shapename}
                                                  </div>
                                                ) : (
                                                  <div className="seaction10AheadCode">
                                                    {
                                                      a?.LimitedShapeQualityColorCode
                                                    }
                                                  </div>
                                                )}
                                                <div className="seaction10AheadSize">
                                                  {a?.Sizename}
                                                </div>
                                                <div className="seaction10AheadPcs">
                                                  {a?.ActualPcs}
                                                </div>
                                                <div
                                                  className="seaction10AheadWT"
                                                  style={{ width: "40px" }}
                                                >
                                                  {a?.ActualWeight?.toFixed(3)}
                                                </div>
                                                <div className="seaction10AheadPcs"></div>
                                                <div className="seaction10AheadWT"></div>
                                              </div>
                                            </div>
                                          )}
                                        </React.Fragment>
                                      );
                                    })}
                                    {Array.from(
                                      { length: ele?.length - 1 },
                                      (_, index) => (
                                        <div
                                          className="seaction10Amid"
                                          key={index}
                                        >
                                          <div
                                            className="seaction10Ahead"
                                            style={{ fontWeight: "normal" }}
                                          >
                                            <div className="seaction10AheadCode"></div>
                                            <div className="seaction10AheadSize"></div>
                                            <div className="seaction10AheadPcs"></div>
                                            <div
                                              className="seaction10AheadWT"
                                              style={{ width: "40px" }}
                                            ></div>
                                            <div className="seaction10AheadPcs"></div>
                                            <div className="seaction10AheadWT"></div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                  <div className="footer10A imp10A">
                                    <p className="footer10AIns">
                                      {" "}
                                      <span
                                        className="footer10AIns"
                                        style={{
                                          color: "red",
                                          paddingLeft: "2px",
                                          lineHeight: "11px",
                                        }}
                                      >
                                        CUST INS.
                                        {(
                                          e?.data?.rd?.custInstruction +
                                          e?.data?.rd?.QuoteRemark +
                                          e?.data?.rd?.ProductInstruction
                                        ).length > 0
                                          ? e?.data?.rd?.custInstruction +
                                              e?.data?.rd?.QuoteRemark +
                                              e?.data?.rd
                                                ?.ProductInstruction ==
                                            (null || "null")
                                            ? ""
                                            : (
                                                e?.data?.rd
                                                  ?.custInstruction +
                                                e?.data?.rd?.QuoteRemark +
                                                e?.data?.rd
                                                  ?.ProductInstruction
                                              )?.slice(0, 230)
                                          : ""}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="aside10A">
                                  <div className="imgPart10A">
                                    <div className="img10A">
                                      <img
                                        src={
                                          e?.additional?.img !== ""
                                            ? e?.additional?.img
                                            : require("../../assets/img/default.jpg")
                                        }
                                        id="img10A"
                                        alt=""
                                        onError={(e) => handleImageError(e)}
                                        loading="eager"
                                        onLoad={(eve) =>
                                          handleImageLoad(eve, i, data?.length)
                                        }
                                      />
                                    </div>
                                    <div className="barcodeInfo10A">
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <div className="diaInfo10A">
                                          <div className="diaflex10A">
                                            <p className="f10Aval">DIAMOND</p>
                                            <p className="diaVal10A">
                                              {e.additional.dia.ActualPcs}/
                                              {e.additional.dia.ActualWeight.toFixed(
                                                3
                                              )}
                                            </p>{" "}
                                          </div>
                                        </div>
                                        <div className="diaInfo10A">
                                          <div className="diaflex10A">
                                            <p
                                              className="f10Aval"
                                              style={{ height: "33px" }}
                                            ></p>{" "}
                                          </div>
                                        </div>
                                        <div className="diaInfo10A">
                                          <div className="diaflex10A">
                                            <p className="f10Aval">CS</p>
                                            <p className="diaVal10A">
                                              {e.additional.clr.ActualPcs}/
                                              {e.additional.clr.ActualWeight.toFixed(
                                                3
                                              )}
                                            </p>{" "}
                                          </div>
                                        </div>
                                        <div className="diaInfo10A">
                                          <div className="diaflex10A">
                                            <p
                                              className="f10Aval"
                                              style={{ height: "33px" }}
                                            ></p>{" "}
                                          </div>
                                        </div>
                                        <div className="diaInfo10A">
                                          <div className="diaflex10A">
                                            <p className="f10Aval">METAL</p>
                                            <p className="diaVal10A">
                                              {e?.data?.rd?.netwt.toFixed(3)}
                                            </p>{" "}
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            borderRight: "1px solid #989898",
                                            height: "39px",
                                          }}
                                        ></div>
                                      </div>
                                      <div className="barcode10A">
                                        {e?.data?.rd?.length !== 0 &&
                                          e?.data?.rd !== undefined && (
                                            <>
                                              {e?.data?.rd?.serialjobno !==
                                                undefined && (
                                                <BarcodeGenerator
                                                  data={
                                                    e?.data?.rd?.serialjobno
                                                  }
                                                />
                                              )}
                                            </>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="print10A">
                        <div className="container10A">
                          <div className="bag10A">
                            <div className="flex10A">
                              <div className="header10A">
                                <div className="head10A">
                                  <div className="head10Ajob">
                                    <div>{e?.data?.rd?.serialjobno}</div>
                                    <div>{e?.data?.rd?.Designcode}</div>
                                    <div>
                                      {e?.data?.rd?.MetalType}{" "}
                                      {e?.data?.rd?.MetalColorCo}
                                    </div>
                                    {/* <div>{e?.data?.rd?.MetalColorCo}</div> */}
                                  </div>
                                  <div className="head10Ainfo">
                                    <div className="info10Amid">
                                      <p className="f10A diffColor">CUST.</p>
                                      <p className="f10A">
                                        {e?.data?.rd?.CustomerCode}
                                      </p>
                                    </div>
                                    <div className="info10Amid">
                                      <p className="f10A diffColor">ORD. DT.</p>
                                      <p className="f10A">
                                        {e?.data?.rd?.orderDatef ?? ""}
                                      </p>
                                    </div>
                                    <div className="info10Aend">
                                      <p className="f10A diffColor">DEL. DT.</p>
                                      <p className="f10A">
                                        {e?.data?.rd?.promiseDatef ?? ""}
                                      </p>
                                    </div>
                                    <div className="info10Alast">
                                      <p
                                        className="f10A diffColor"
                                        style={{ borderRight: "0px" }}
                                      >
                                        SIZE
                                      </p>
                                      <p
                                        className="f10A"
                                        style={{ borderRight: "0px" }}
                                      >
                                        {e?.data?.rd?.Size}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="section10A">
                                <div className="seaction10AheadA">
                                  <div className="seaction10AheadCode">
                                    CODE
                                  </div>
                                  <div className="seaction10AheadSize">
                                    SIZE
                                  </div>
                                  <div className="seaction10AheadPcs">PCS</div>
                                  <div className="seaction10AheadWT">WT</div>
                                  <div className="seaction10AheadPcs">PCS</div>
                                  <div className="seaction10AheadWT">WT</div>
                                </div>

                                {Array.from({ length: 17 }, (_, index) => (
                                  <div className="seaction10Amid" key={index}>
                                    <div
                                      className="seaction10Ahead"
                                      style={{ fontWeight: "normal" }}
                                    >
                                      <div className="seaction10AheadCode"></div>
                                      <div className="seaction10AheadSize"></div>
                                      <div className="seaction10AheadPcs"></div>
                                      <div className="seaction10AheadWT"></div>
                                      <div className="seaction10AheadPcs"></div>
                                      <div className="seaction10AheadWT"></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="footer10A imp10A">
                                <p className="footer10AIns">
                                  {" "}
                                  <span
                                    className="footer10AIns"
                                    style={{
                                      color: "red",
                                      paddingLeft: "2px",
                                      lineHeight: "11px",
                                    }}
                                  >
                                    CUST INS.
                                    {(
                                      e?.data?.rd?.custInstruction +
                                      e?.data?.rd?.QuoteRemark +
                                      e?.data?.rd?.ProductInstruction
                                    ).length > 0
                                      ? e?.data?.rd?.custInstruction +
                                          e?.data?.rd?.QuoteRemark +
                                          e?.data?.rd?.ProductInstruction ==
                                        (null || "null")
                                        ? ""
                                        : (
                                            e?.data?.rd?.custInstruction +
                                            e?.data?.rd?.QuoteRemark +
                                            e?.data?.rd?.ProductInstruction
                                          )?.slice(0, 230)
                                      : ""}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="aside10A">
                              <div className="imgPart10A">
                                <div className="img10A">
                                  <img
                                    src={
                                      e?.additional?.img !== ""
                                        ? e?.additional?.img
                                        : require("../../assets/img/default.jpg")
                                    }
                                    id="img10A"
                                    alt=""
                                    onError={(e) => handleImageError(e)}
                                    loading="eager"
                                    onLoad={(eve) =>
                                      handleImageLoad(eve, i, data?.length)
                                    }
                                  />
                                </div>
                                <div className="barcodeInfo10A">
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <div className="diaInfo10A">
                                      <div className="diaflex10A">
                                        <p className="f10Aval">DIAMOND</p>
                                        <p className="diaVal10A">
                                          {e.additional.dia.ActualPcs}/
                                          {e.additional.dia.ActualWeight.toFixed(
                                            2
                                          )}
                                        </p>{" "}
                                      </div>
                                    </div>
                                    <div className="diaInfo10A">
                                      <div className="diaflex10A">
                                        <p
                                          className="f10Aval"
                                          style={{ height: "33px" }}
                                        ></p>{" "}
                                      </div>
                                    </div>
                                    <div className="diaInfo10A">
                                      <div className="diaflex10A">
                                        <p className="f10Aval">CS</p>
                                        <p className="diaVal10A">
                                          {e.additional.clr.ActualPcs}/
                                          {e.additional.clr.ActualWeight.toFixed(
                                            2
                                          )}
                                        </p>{" "}
                                      </div>
                                    </div>
                                    <div className="diaInfo10A">
                                      <div className="diaflex10A">
                                        <p
                                          className="f10Aval"
                                          style={{ height: "33px" }}
                                        ></p>{" "}
                                      </div>
                                    </div>
                                    <div className="diaInfo10A">
                                      <div className="diaflex10A">
                                        <p className="f10Aval">METAL</p>
                                        <p className="diaVal10A">
                                          {e.additional.misc.ActualPcs}/
                                          {e.additional.misc.ActualWeight.toFixed(
                                            2
                                          )}
                                        </p>{" "}
                                      </div>
                                    </div>
                                    <div
                                      style={{
                                        borderRight: "1px solid #989898",
                                        height: "39px",
                                      }}
                                    ></div>
                                  </div>
                                  <div className="barcode10A">
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
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="print10A">
                      <div className="container10A">
                        <div className="header10AD">
                          <div className="sectionHead10A">
                            <div className="head10AjobD">
                              <div>{e?.data?.rd?.serialjobno}</div>
                              <div>{e?.data?.rd?.Designcode}</div>
                              <div>
                                {e?.data?.rd?.MetalType}{" "}
                                {e?.data?.rd?.MetalColorCo}
                              </div>
                              {/* <div>{e?.data?.rd?.MetalColorCo}</div> */}
                            </div>
                            <div className="mat10AD">
                              <div
                                className="border10A"
                                style={{
                                  color: "#c7c7c7",
                                  textAlign: "center",
                                  paddingTop: "2px",
                                }}
                              >
                                PRIORITY
                              </div>
                              <div
                                className="border10A"
                                style={{
                                  color: "#c7c7c7",
                                  textAlign: "center",
                                  paddingTop: "2px",
                                }}
                              >
                                LOC.
                              </div>
                              <div
                                className="border10A"
                                style={{
                                  borderRight: "0px",
                                  color: "#c7c7c7",
                                  textAlign: "center",
                                  paddingTop: "2px",
                                }}
                              >
                                Q.C.
                              </div>
                            </div>
                            <div className="mat10ADE">
                              <div className="border10A hw10A">
                                <p className="f10ADuplicate">SALES REP.</p>{" "}
                                <p className="f10ADuplicate">
                                  {e?.data?.rd?.SalesrepCode}
                                </p>
                              </div>
                              <div className="border10A hw10A">
                                <p className="f10ADuplicate">FROSTING</p>{" "}
                                <p className="f10ADuplicate">
                                  {e?.data?.rd?.MetalFrosting}
                                </p>
                              </div>
                              <div
                                className="border10A hw10A"
                                style={{ borderRight: "0px" }}
                              >
                                <p className="f10ADuplicate">ENAMELING</p>
                                <p className="f10ADuplicate">
                                  {e?.data?.rd?.Enamelling}
                                </p>
                              </div>
                            </div>
                            <div className="mat10ADE">
                              <div className="border10A hw10A">
                                <p className="f10ADuplicate">LAB</p>{" "}
                                <p className="f10ADuplicate">
                                  {e?.data?.rd?.MasterManagement_labname}
                                </p>
                              </div>
                              <div className="border10A hw10A">
                                <p className="f10ADuplicate">SNAP</p>{" "}
                                <p className="f10ADuplicate">
                                  {
                                    e?.data?.rd
                                      ?.MasterManagement_ProductImageType
                                  }
                                </p>
                              </div>
                              <div
                                className="border10A hw10A"
                                style={{ borderRight: "0px" }}
                              >
                                <p className="f10ADuplicate">MAKETYPE</p>
                                <p className="f10ADuplicate">
                                  {
                                    e?.data?.rd
                                      ?.mastermanagement_maketypename
                                  }
                                </p>{" "}
                              </div>
                            </div>
                            <div className="mat10AD">
                              <div
                                className="border10A"
                                style={{
                                  color: "#c7c7c7",
                                  textAlign: "center",
                                  paddingTop: "2px",
                                }}
                              >
                                TR NO.
                              </div>
                              <div
                                className="border10A"
                                style={{
                                  color: "#c7c7c7",
                                  textAlign: "center",
                                  paddingTop: "2px",
                                }}
                              >
                                TR NO.
                              </div>
                              <div
                                className="border10A"
                                style={{
                                  borderRight: "0px",
                                  color: "#c7c7c7",
                                  textAlign: "center",
                                  paddingTop: "2px",
                                }}
                              >
                                TR NO.
                              </div>
                            </div>
                            <div
                              className="mat10AD"
                              style={{ borderBottom: "0px" }}
                            >
                              <div
                                className="border10A"
                                style={{
                                  color: "#c7c7c7",
                                  textAlign: "center",
                                  paddingTop: "2px",
                                }}
                              >
                                TR WT.
                              </div>
                              <div
                                className="border10A"
                                style={{
                                  color: "#c7c7c7",
                                  textAlign: "center",
                                  paddingTop: "2px",
                                }}
                              >
                                TR WT.
                              </div>
                              <div
                                className="border10A"
                                style={{
                                  borderRight: "0px",
                                  color: "#c7c7c7",
                                  textAlign: "center",
                                  paddingTop: "2px",
                                }}
                              >
                                TR WT.
                              </div>
                            </div>
                          </div>
                          <div className="img10AD">
                            <img
                              src={
                                e?.additional?.img !== ""
                                  ? e?.additional?.img
                                  : require("../../assets/img/default.jpg")
                              }
                              id="img10A"
                              alt=""
                              onError={(e) => handleImageError(e)}
                              loading="eager"
                              onLoad={(eve) =>
                                handleImageLoad(eve, i, data?.length)
                              }
                            />
                          </div>
                        </div>
                        <div className="enteryBarcode10AD">
                          <div className="enteryBarcode3ADyn">
                            <div
                              className="entry3AHead"
                              style={{ fontWeight: "normal", width: "290px" }}
                            >
                              <div
                                className="rmcode3a"
                                style={{ width: "43px" }}
                              >
                                DEPT{" "}
                              </div>
                              <div
                                className="rmcode3a"
                                style={{ width: "52px" }}
                              >
                                ISSUE
                              </div>
                              <div
                                className="rmcode3a"
                                style={{ width: "52px" }}
                              >
                                RECEIVE
                              </div>
                              <div
                                className="rmcode3a"
                                style={{ width: "52px" }}
                              >
                                SCRAP
                              </div>
                              <div
                                className="rmcode3a"
                                style={{ width: "37px" }}
                              >
                                PCS
                              </div>
                              <div
                                className="rmcode3a"
                                style={{ borderRight: "0px", width: "56px" }}
                              >
                                WORKER
                              </div>
                            </div>
                            <div className="entryheader3A">
                              <div
                                className="entry3AHeadD"
                                style={{ fontWeight: "normal" }}
                              >
                                <div
                                  className="rmcode3aD"
                                  style={{
                                    width: "46px",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    paddingLeft: "3px",
                                  }}
                                >
                                  GRD{" "}
                                </div>
                                <div
                                  className="rmcode3aD"
                                  style={{
                                    width: "46px",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    paddingLeft: "3px",
                                  }}
                                >
                                  FIL
                                </div>
                                <div
                                  className="rmcode3aD"
                                  style={{
                                    width: "46px",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    paddingLeft: "3px",
                                  }}
                                >
                                  PPL
                                </div>
                                <div
                                  className="rmcode3aD"
                                  style={{
                                    width: "46px",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    paddingLeft: "3px",
                                  }}
                                >
                                  SET.
                                </div>
                                <div
                                  className="rmcode3aD"
                                  style={{
                                    width: "46px",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    paddingLeft: "3px",
                                  }}
                                >
                                  ASM
                                </div>
                                <div
                                  className="rmcode3aD"
                                  style={{
                                    width: "46px",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    paddingLeft: "3px",
                                  }}
                                >
                                  FPL
                                </div>
                                <div
                                  className="rmcode3aD"
                                  style={{
                                    width: "46px",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    paddingLeft: "3px",
                                  }}
                                >
                                  PLT
                                </div>
                                <div
                                  className="rmcode3aD"
                                  style={{
                                    width: "46px",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    paddingLeft: "3px",
                                  }}
                                >
                                  ENM
                                </div>
                                <div
                                  className="rmcode3aD"
                                  style={{
                                    borderBottom: "1px solid #989898",
                                    width: "46px",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    paddingLeft: "3px",
                                  }}
                                >
                                  F.G.
                                </div>
                              </div>
                              {
                                <div>
                                  {Array.from({ length: 9 }, (_, index) => (
                                    <div
                                      className="entry3AHeadEntry"
                                      key={index}
                                      style={{ fontWeight: "normal" }}
                                    >
                                      <div
                                        className="rmcode3aDE"
                                        style={{ width: "52px" }}
                                      ></div>
                                      <div
                                        className="rmcode3aDE"
                                        style={{ width: "51px" }}
                                      ></div>
                                      <div
                                        className="rmcode3aDE"
                                        style={{ width: "51px" }}
                                      ></div>
                                      <div
                                        className="rmcode3aDE"
                                        style={{ width: "37px" }}
                                      ></div>
                                      <div
                                        className="rmcode3aDE"
                                        style={{
                                          width: "56px",
                                          borderRight: "0px",
                                        }}
                                      ></div>
                                    </div>
                                  ))}
                                </div>
                              }
                            </div>
                            <div>
                              <div className="ins10Afooter">
                                <p style={{ fontSize: "12px" }}>SLS. INS.{}</p>
                              </div>
                              <div className="ins10Afooter">
                                <p style={{ fontSize: "12px" }}>PRD. INS.{}</p>
                              </div>
                              <div
                                className="ins10Afooter"
                                style={{ borderBottom: "0px" }}
                              >
                                <p style={{ fontSize: "12px" }}>QC. INS.{}</p>
                              </div>
                            </div>
                          </div>
                          <div className="barcode10AD">
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
                      </div>
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

export default BagPrint10A;
