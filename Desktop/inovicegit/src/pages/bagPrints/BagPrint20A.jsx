import queryString from "query-string";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/bagprint/print20A.css";
import BarcodeGenerator from "../../components/BarcodeGenerator";
import Loader from "../../components/LoaderBag";
import { GetData } from "../../GlobalFunctions/GetData";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import { organizeData } from "../../GlobalFunctions/OrganizeBagPrintData";

const BagPrint20A = ({ queries, headers }) => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  let jobs = queryParams.str_srjobno;
  const parts = jobs.split(",");
  console.log(parts);
  const resultString = parts.map((part) => `'${part}'`).join(",");
  const chunkSize7 = 10;
  // const chunkSize = 4;
  // const sizeofChunk = 4;
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
          // let diamond = [];
          // let colorstone = [];
          let chunkData = [];
          let length = 0;
          let clr = {
            Shapename: "TOTAL",
            Sizename: "C TOTAL",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 4,
            // heading: "COLOR STONE DETAIL"
          };
          let dia = {
            Shapename: "TOTAL",
            Sizename: "D TOTAL",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 3,
            // heading: "DIAMOND DETAIL"
          };
          let misc = {
            Shapename: "MISC TOTAL",
            Sizename: "MISC TOTAL",
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

          const ProductInstruction = a?.rd?.ProductInstruction;

          // Check if productInstruction is not undefined, null, 'null', or an empty string
          const displayValue =
            ProductInstruction !== undefined &&
            ProductInstruction != null &&
            ProductInstruction !== "null" &&
            ProductInstruction.trim() !== ""
              ? ProductInstruction
              : " ";

          a.rd.updateIns = displayValue;
          // eslint-disable-next-line array-callback-return
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

          let newDia = {
            Shapename: "",
            Sizename: "Diamond Detail",
            ActualPcs: "",
            ActualWeight: "",
            MasterManagement_DiamondStoneTypeid: 3,
          };
          let newCS = {
            Shapename: "",
            Sizename: "Colorstone Detail",
            ActualPcs: "",
            ActualWeight: "",
            MasterManagement_DiamondStoneTypeid: 4,
          };
          let newMisc = {
            Shapename: "",
            Sizename: "Misc Detail",
            ActualPcs: "",
            ActualWeight: "",
            MasterManagement_DiamondStoneTypeid: 7,
          };
          ArrofSevenSize?.length > 0 && ArrofSevenSize.unshift(newDia);
          ArrofFiveSize?.length > 0 && ArrofFiveSize.unshift(newCS);
          ArrofMISize?.length > 0 && ArrofMISize.unshift(newMisc);

          let arr = [];
          let mainArr = arr?.concat(
            ArrofSevenSize,
            ArrofFiveSize,
            ArrofMISize
            // ArrofFSize
          );
          let imagePath = queryParams?.imagepath;
          imagePath = atob(queryParams?.imagepath);

          let img = imagePath + a?.rd?.ThumbImagePath;
          for (let i = 0; i < mainArr?.length; i += chunkSize7) {
            const chunks = mainArr?.slice(i, i + chunkSize7);
            let len = 10 - mainArr?.slice(i, i + chunkSize7)?.length;
            chunkData.push({ data: chunks, length: len });
          }
          // for (let i = 0; i < ArrofSevenSize?.length; i += chunkSize) {
          //   const dia = ArrofSevenSize?.slice(i, i + chunkSize);
          //   let len = 7 - ArrofSevenSize?.slice(i, i + chunkSize)?.length;
          //   diamond?.push({ dia: dia, length: len });
          // }
          // for (let i = 0; i < ArrofFiveSize?.length; i += sizeofChunk) {
          //   const clr = ArrofFiveSize?.slice(i, i + sizeofChunk);
          //   let len = 5 - ArrofFiveSize?.slice(i, i + sizeofChunk)?.length;
          //   colorstone?.push({ clr: clr, length: len });
          // }
          //new arr for creating how many templates are use, storing objects
          // let arr1 = [];
          // if (diamond?.length >= colorstone?.length) {
          //   diamond?.map((e, i) => {
          //     let obj = {};
          //     obj.diachunk = e;
          //     if (colorstone[i] !== undefined) {
          //       obj.clrchunk = colorstone[i];
          //     } else {
          //       obj.clrchunk = { clr: [], length: 5 };
          //     }
          //     arr1?.push(obj);
          //   });
          // } else {
          //   colorstone?.map((e, i) => {
          //     let obj = {};
          //     obj.clrchunk = e;
          //     if (diamond[i] !== undefined) {
          //       obj.diachunk = diamond[i];
          //     } else {
          //       obj.diachunk = { dia: [], length: 7 };
          //     }
          //     arr1?.push(obj);
          //   });
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
              pages: chunkData,
            },
          });
        });
        setData(responseData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (data?.length !== 0) {
      setTimeout(() => {
        window.print();
      }, 5000);
    }
  }, [data]);
  console.log(data);
  return (
    <>
      {data?.length === 0 ? (
        <Loader />
      ) : (
        <>
          <div>
            <button
              className="btn_white blue print_btn"
              onClick={(e) => handlePrint(e)}
            >
              Print
            </button>
          </div>
          <div className="d-flex flex-wrap mb-5 pad_60_allPrint">
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
              data?.map((e, i) => {
                return (
                  <React.Fragment key={i}>
                    {e?.additional?.pages?.length > 0 ? (
                      e?.additional?.pages?.map((el, index) => {
                        return (
                          <React.Fragment key={index}>
                            <div className="container7Acopy ">
                              <div className="head7Acopy">
                                <div className="headerdesc7Acopy">
                                  <div className="headW7Acopy">
                                    <div className="jobno7Acopy">
                                      <div className="h-100 d-flex justify-content-center align-items-center">
                                        <span className="fs20A fw-bold pe-1">
                                          Odr Dt:
                                        </span>
                                        <span className="lh20A fs20A">
                                          {e?.data?.rd?.orderDatef}
                                        </span>
                                      </div>
                                      <div className="h-100 d-flex justify-content-center align-items-center">
                                        <span className="fs20A fw-bold pe-1">
                                          Due Dt:
                                        </span>
                                        <span className="lh20A fs20A">
                                          {e?.data?.rd?.promiseDatef}
                                        </span>
                                      </div>
                                      <div className="h-100 d-flex justify-content-center align-items-center">
                                        <span className="fs20A fw-bold pe-1">
                                          Party:
                                        </span>
                                        <span className="lh20A fs20A">
                                          {e?.data?.rd?.CustomerCode}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="barcodebag7Acopy">
                                      <div style={{ width: "45%" }}>
                                        <div className="h7Acopy fs7Acopy d-flex justify-content-between align-items-center">
                                          <span
                                            className="fs20A fw-bold h-100 d-flex justify-content-center align-items-center"
                                            style={{ fontSize: "11px" }}
                                          >
                                            Bag No :
                                          </span>
                                          <span className="lh20A h-100 d-flex justify-content-center align-items-center fs-6 fw-bold">
                                            {e?.data?.rd?.serialjobno}
                                          </span>
                                        </div>
                                        <div className="fs20A fs7Acopy d-flex justify-content-between align-items-center">
                                          <span className="fs7Acopy fw-bold h-100 d-flex justify-content-center align-items-center" style={{fontSize:"8.5px"}}>
                                            Dgn No :
                                          </span>
                                          <span className="fs20A lh20A h-100 d-flex justify-content-center align-items-center ps-1" style={{fontSize:"8.5px"}}>
                                            {e?.data?.rd?.Designcode}
                                          </span>
                                        </div>
                                      </div>
                                      <div
                                        className="barcodeGenerator7Acopy"
                                        style={{ width: "55%" }}
                                      >
                                        <BarcodeGenerator
                                          data={e?.data?.rd?.serialjobno}
                                        />
                                      </div>
                                    </div>
                                    <div className="remark7Acopy">
                                      <div
                                        style={{
                                          width: "41.45mm",
                                          paddingLeft: "2px",
                                          paddingTop: "1px",
                                        }}
                                      >
                                        <span className="fs20A fw-bold">
                                          {" "}
                                          Remark:
                                        </span>
                                        <span className="text-danger lh20A p-1">
                                          {e?.data?.rd?.updateIns}
                                        </span>
                                      </div>
                                      <div className="matinfo7Acopy">
                                        <div className="h327Acopy d-flex flex-column justify-content-between ">
                                          <span
                                            className="fs20A h-100 d-flex justify-content-start align-items-center w-100 fw-bold"
                                            style={{ fontSize: "8.5px" }}
                                          >
                                            KT/CLR:
                                          </span>
                                          <span
                                            className="fs20A h-100 d-flex justify-content-end align-items-center w-100 lh20A "
                                            style={{ fontSize: "8.5px" }}
                                          >
                                            {e?.data?.rd?.MetalType}
                                          </span>
                                        </div>
                                        <div className="h327Acopy d-flex flex-column justify-content-between ">
                                          <span
                                            className="fs20A h-100 d-flex justify-content-start align-items-center w-100 fw-bold"
                                            style={{ fontSize: "8.5px" }}
                                          >
                                            Size:
                                          </span>
                                          <span className="fs20A h-100 d-flex justify-content-start align-items-center w-100 lh20A">
                                            {e?.data?.rd?.Size}
                                          </span>
                                        </div>
                                        <div
                                          className="h327Acopy d-flex flex-column justify-content-between"
                                          style={{ borderBottom: "0px" }}
                                        >
                                          <span
                                            className="fs20A h-100 d-flex justify-content-start align-items-center w-100 fw-bold"
                                            style={{ fontSize: "8.5px" }}
                                          >
                                            Est Wt:
                                          </span>
                                          <span className="fs20A h-100 d-flex justify-content-start align-items-center w-100 lh20A">
                                            {e?.data?.rd?.ActualGrossweight?.toFixed(
                                              3
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="img7Acopy">
                                  {" "}
                                  <img
                                    src={
                                      e?.additional?.img !== ""
                                        ? e?.additional?.img
                                        : require("../../assets/img/default.jpg")
                                    }
                                    id="img7Acopy"
                                    alt=""
                                    onError={(e) => handleImageError(e)}
                                    loading="eager"
                                  />
                                </div>
                              </div>
                              <div className="emptyTable7Acopy">
                                <div className="thead7Acopy">
                                  <div
                                    style={{
                                      width: "9.86mm",
                                      minWidth: "9.86mm",
                                    }}
                                    className="headCol7Acopy border-start border-top border_color border_top_left_print7Acopy"
                                  >
                                    Dept.
                                  </div>
                                  <div
                                    style={{
                                      width: "12.16mm",
                                      minWidth: "12.16mm",
                                    }}
                                    className="headCol7Acopy border-top border_color"
                                  >
                                    Worker
                                  </div>
                                  <div
                                    style={{
                                      width: "15.30mm",
                                      minWidth: "15.30mm",
                                    }}
                                    className="headCol7Acopy border-top border_color"
                                  >
                                    Metal In.
                                  </div>
                                  <div
                                    style={{
                                      width: "18.94mm",
                                      minWidth: "18.94mm",
                                    }}
                                    className="headCol7Acopy border-top border_color"
                                  >
                                    Ext. less.
                                  </div>
                                  <div
                                    style={{
                                      width: "15.07mm",
                                      minWidth: "15.07mm",
                                    }}
                                    className="headCol7Acopy border-top border_color"
                                  >
                                    Metal Out.
                                  </div>
                                  <div
                                    style={{
                                      width: "11.34mm",
                                      minWidth: "11.34mm",
                                    }}
                                    className="headCol7Acopy border-top border_color"
                                  >
                                    Diff
                                  </div>
                                  <div
                                    style={{
                                      width: "9.89mm",
                                      borderRight: "0px",
                                    }}
                                    className="headCol7Acopy border-top border_color border_top_right_print7Acopy border-end"
                                  >
                                    Entry
                                  </div>
                                </div>
                                <div className="d-flex">
                                  <div>
                                    <div className="wheadsep7Acopy border-start border_color fw-bold">
                                      Grind
                                    </div>
                                    <div className="wheadsep7Acopy border-start border_color fw-bold">
                                      Filli
                                    </div>
                                    <div className="wheadsep7Acopy border-start border_color fw-bold">
                                      Buff.
                                    </div>
                                    <div className="wheadsep7Acopy border-start border_color fw-bold">
                                      Filli.
                                    </div>
                                    <div className="wheadsep7Acopy border-start border_color fw-bold">
                                      PPOL
                                    </div>
                                    <div className="wheadsep7Acopy border-start border_color fw-bold">
                                      Sett.
                                    </div>
                                    <div className="wheadsep7Acopy border-start border_color fw-bold">
                                      M FN
                                    </div>
                                    <div className="wheadsep7Acopy border-start border_color fw-bold">
                                      F POL
                                    </div>
                                    <div className="wheadsep7Acopy border-start border_color fw-bold">
                                      Mina
                                    </div>
                                    <div className="wheadsep7Acopy border_color border-start border_bottom_left_print7Acopy fw-bold">
                                      Other
                                    </div>
                                  </div>
                                  <div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                  </div>
                                  <div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                  </div>
                                  <div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                  </div>
                                  <div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                  </div>
                                  <div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                  </div>
                                  <div>
                                    <div
                                      className="wheadsep7Acopy enbrb7Acopy border-end border_color"
                                      style={{ minWidth: "9.5mm !important" }}
                                    ></div>

                                    <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                                    <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                                    <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                                    <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                                    <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                                    <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                                    <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                                    <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                                    <div className="wheadsep7Acopy enbrb7Acopy border_bottom_right_print7Acopy border-end border_color"></div>
                                  </div>
                                </div>
                              </div>
                              <div className="footerEntry7Acopy">
                                <div className="entry7Acopy">
                                  <div className="entryCol7Acopy">Cast 1:</div>
                                  <div className="entryCol7Acopy">Cast 2:</div>
                                  <div className="entryCol7Acopy">Lock:</div>
                                  <div className="entryCol7Acopy">PTCK:</div>
                                  <div className="entryCol7Acopy">Chain:</div>
                                  <div
                                    className="entryCol7Acopy"
                                    style={{ borderBottom: "0px" }}
                                  >
                                    Ex Mtl:
                                  </div>
                                </div>
                                <div className="diacsentry7Acopy">
                                  <div className="fw-bold ps-1">
                                    {el?.data?.length > 0 &&
                                      el?.data?.map((s, si) => {
                                        return (
                                          <div key={si}>
                                            {" "}
                                            {s?.Sizename === "Diamond Detail" ||
                                            s?.Sizename ===
                                              "Colorstone Detail" ||
                                            s?.Sizename === "Misc Detail" ? (
                                              <div
                                                className="fs20A"
                                                style={{
                                                  paddingTop: "1px",
                                                  paddingBottom: "1px",
                                                }}
                                              >
                                                {s?.Sizename + " : "}
                                              </div>
                                            ) : (
                                              <div
                                                className="fw-normal fs20A"
                                                style={{ fontSize: "9px" }}
                                              >
                                                {s?.Sizename + " "} /{" "}
                                                {s?.ActualPcs + " "}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    {/* <div className=" fs20A">
                                      Diamond Detail: (Size/ Pcs)
                                    </div>
                                    <div className=" lh20A fw-normal">
                                      {
                                        //logic of put data in chunks for diamond
                                        el?.diachunk?.dia?.map((s, is) => {
                                          return (
                                            <div
                                              style={{ display: "flex" }}
                                              key={is}
                                            >
                                              {
                                                s?.Sizename === 'TOTAL' ? <div className="fs20A fw-bold">
                                                {s?.Sizename ?? ""} /
                                                {s?.ActualPcs ?? ""}
                                              </div> : <div className="fs20A">
                                                {s?.Sizename ?? ""} /
                                                {s?.ActualPcs ?? ""}
                                              </div>
                                              }
                                              
                                            </div>
                                          );
                                        })
                                      }
                                    </div> */}

                                    {/* <div className="fw-bold fs20A">ColorStone Detail: (Size/ Pcs)</div> */}
                                    {/* <div className=" lh20A fw-normal">
                                    {
                                        //logic of put data in chunks for diamond
                                        el?.clrchunk?.clr?.map((s, is) => {
                                          return (
                                            <div
                                              style={{ display: "flex" }}
                                              key={is}
                                            >
                                              {
                                                s?.Sizename === 'TOTAL' ? <div className="fs20A fw-bold">
                                                {s?.Sizename ?? ""} /{" "}
                                                {s?.ActualPcs ?? ""}{" "}
                                              </div> : <div className="fs20A">
                                                {s?.Sizename ?? ""} /{" "}
                                                {s?.ActualPcs ?? ""}{" "}
                                              </div>
                                              }
                                              
                                            </div>
                                          );
                                        })
                                      }
                                    </div> */}
                                  </div>
                                </div>
                                <div className="emptybox7Acopy"></div>
                              </div>
                              <div className="footercss7Acopy">
                                <div className="footer7Acopy">
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "16.10mm" }}
                                  >
                                    Gross Wt.
                                  </div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "18.00mm" }}
                                  >
                                    Diamond
                                  </div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "18.00mm" }}
                                  >
                                    Color Stone
                                  </div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "12.00mm" }}
                                  >
                                    Misc
                                  </div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "12.00mm" }}
                                  >
                                    Mina
                                  </div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{
                                      width: "16.10mm",
                                      borderRight: "0px",
                                    }}
                                  >
                                    Net Wt.
                                  </div>
                                </div>

                                <div className="footer7Acopy brbnone7Acopy brl7Acopy1">
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "16.10mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "18.00mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "18.00mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "12.00mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "12.00mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{
                                      width: "16.10mm",
                                      borderRight: "0px",
                                    }}
                                  ></div>
                                </div>
                                <div
                                  className="footer7Acopy brbnone7Acopy brl7Acopy2"
                                  style={{ borderTop: "1px dashed #989898" }}
                                >
                                  {" "}
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "16.10mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "18.00mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "18.00mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "12.00mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "12.00mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{
                                      width: "16.10mm",
                                      borderRight: "0px",
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <div className="container7Acopy">
                        <div className="head7Acopy">
                          <div className="headerdesc7Acopy">
                            <div className="headW7Acopy">
                              <div className="jobno7Acopy">
                                <div>
                                  <span className="fs7Acopy fw-bold pe-1">
                                    Odr Dt:
                                  </span>
                                  <span className="lh20A fs20A">
                                    {e?.data?.rd?.orderDatef}
                                  </span>
                                </div>
                                <div>
                                  <span className="fs7Acopy fw-bold pe-1">
                                    Due Dt:
                                  </span>
                                  <span className="lh20A fs20A">
                                    {e?.data?.rd?.promiseDatef}
                                  </span>
                                </div>
                                <div className="fs7Acopy">
                                  <span className="fw-bold pe-1">Party:</span>
                                  <span className="lh20A fs20A">
                                    {e?.data?.rd?.CustomerCode}
                                  </span>
                                </div>
                              </div>
                              <div className="barcodebag7Acopy">
                                <div>
                                  <div className="h7Acopy fs7Acopy d-flex">
                                    <span className="fs7Acopy fw-bold h-100 d-flex justify-content-center align-items-center">
                                      Bag No:
                                    </span>
                                    <span className="fs7Acopy h-100 d-flex justify-content-center align-items-center">
                                      {e?.data?.rd?.serialjobno}
                                    </span>
                                  </div>
                                  <div className="h7Acopy fs7Acopy d-flex">
                                    <span className="fs7Acopy fw-bold h-100 d-flex justify-content-center align-items-center">
                                      Dgn No:
                                    </span>
                                    <span className="fs7Acopy h-100 d-flex justify-content-center align-items-center ps-1">
                                      {e?.data?.rd?.Designcode}
                                    </span>
                                  </div>
                                </div>
                                <div className="barcodeGenerator7Acopy">
                                  <BarcodeGenerator
                                    data={e?.data?.rd?.serialjobno}
                                  />
                                </div>
                              </div>
                              <div className="remark7Acopy">
                                <div
                                  style={{
                                    width: "41.45mm",
                                    paddingLeft: "2px",
                                    paddingTop: "1px",
                                  }}
                                >
                                  <span className="fw-bold"> Remark:</span>{" "}
                                  <span>{e?.data?.rd?.remark}</span>
                                </div>
                                <div className="matinfo7Acopy">
                                  <div className="h327Acopy fw-bold">
                                    KT/CLR:
                                  </div>
                                  <div className="h327Acopy">
                                    <span className="fw-bold">Size:</span>
                                    <span>{e?.data?.rd?.Size}</span>
                                  </div>
                                  <div
                                    className="h327Acopy fw-bold"
                                    style={{ borderBottom: "0px" }}
                                  >
                                    Est Wt:
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="img7Acopy">
                            {" "}
                            <img
                              src={
                                e?.additional?.img !== ""
                                  ? e?.additional?.img
                                  : require("../../assets/img/default.jpg")
                              }
                              id="img7Acopy"
                              alt=""
                              onError={(e) => handleImageError(e)}
                              loading="eager"
                            />
                          </div>
                        </div>
                        <div className="emptyTable7Acopy">
                          <div className="thead7Acopy">
                            <div
                              style={{
                                width: "9.86mm",
                                minWidth: "9.86mm",
                              }}
                              className="headCol7Acopy border-start border-top border_color border_top_left_print7Acopy"
                            >
                              Dept.
                            </div>
                            <div
                              style={{
                                width: "12.16mm",
                                minWidth: "12.16mm",
                              }}
                              className="headCol7Acopy border-top border_color"
                            >
                              Worker
                            </div>
                            <div
                              style={{
                                width: "15.30mm",
                                minWidth: "15.30mm",
                              }}
                              className="headCol7Acopy border-top border_color"
                            >
                              Metal In.
                            </div>
                            <div
                              style={{
                                width: "18.94mm",
                                minWidth: "18.94mm",
                              }}
                              className="headCol7Acopy border-top border_color"
                            >
                              Ext. less.
                            </div>
                            <div
                              style={{
                                width: "15.07mm",
                                minWidth: "15.07mm",
                              }}
                              className="headCol7Acopy border-top border_color"
                            >
                              Metal Out.
                            </div>
                            <div
                              style={{
                                width: "11.34mm",
                                minWidth: "11.34mm",
                              }}
                              className="headCol7Acopy border-top border_color"
                            >
                              Diff
                            </div>
                            <div
                              style={{
                                width: "9.89mm",
                                borderRight: "0px",
                              }}
                              className="headCol7Acopy border-top border_color border_top_right_print7Acopy border-end"
                            >
                              Entry
                            </div>
                          </div>
                          <div className="d-flex">
                            <div>
                              <div className="wheadsep7Acopy border-start border_color">
                                Grind
                              </div>
                              <div className="wheadsep7Acopy border-start border_color">
                                Filli
                              </div>
                              <div className="wheadsep7Acopy border-start border_color">
                                Buff.
                              </div>
                              <div className="wheadsep7Acopy border-start border_color">
                                Filli.
                              </div>
                              <div className="wheadsep7Acopy border-start border_color">
                                PPOL
                              </div>
                              <div className="wheadsep7Acopy border-start border_color">
                                Sett.
                              </div>
                              <div className="wheadsep7Acopy border-start border_color">
                                M FN
                              </div>
                              <div className="wheadsep7Acopy border-start border_color">
                                F POL
                              </div>
                              <div className="wheadsep7Acopy border-start border_color">
                                Mina
                              </div>
                              <div className="wheadsep7Acopy border_color border-start border_bottom_left_print7Acopy">
                                Other
                              </div>
                            </div>
                            <div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                            </div>
                            <div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                            </div>
                            <div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                            </div>
                            <div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                            </div>
                            <div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                            </div>
                            <div>
                              <div
                                className="wheadsep7Acopy enbrb7Acopy border-end border_color"
                                style={{ minWidth: "9.5mm !important" }}
                              ></div>

                              <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                              <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                              <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                              <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                              <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                              <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                              <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                              <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                              <div className="wheadsep7Acopy enbrb7Acopy border_bottom_right_print7Acopy border-end border_color"></div>
                            </div>
                          </div>
                        </div>
                        <div className="footerEntry7Acopy">
                          <div className="entry7Acopy">
                            <div className="entryCol7Acopy">Cast 1:</div>
                            <div className="entryCol7Acopy">Cast 2:</div>
                            <div className="entryCol7Acopy">Lock:</div>
                            <div className="entryCol7Acopy">PTCK:</div>
                            <div className="entryCol7Acopy">Chain:</div>
                            <div
                              className="entryCol7Acopy"
                              style={{ borderBottom: "0px" }}
                            >
                              Ex Mtl:
                            </div>
                          </div>
                          <div className="diacsentry7Acopy">
                            <div className="fw-bold pt-1 ps-1">
                              CS/ Dia Detail:
                            </div>
                          </div>
                          <div className="emptybox7Acopy"></div>
                        </div>
                        <div className="footercss7Acopy">
                          <div className="footer7Acopy">
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "16.10mm" }}
                            >
                              Gross Wt.
                            </div>
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "18.00mm" }}
                            >
                              Diamond
                            </div>
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "18.00mm" }}
                            >
                              Color Stone
                            </div>
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "12.00mm" }}
                            >
                              Misc
                            </div>
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "12.00mm" }}
                            >
                              Mina
                            </div>
                            <div
                              className="footerCol7Acopyall"
                              style={{
                                width: "16.10mm",
                                borderRight: "0px",
                              }}
                            >
                              Net Wt.
                            </div>
                          </div>
                          <div className="footer7Acopy brbnone7Acopy brl7Acopy1"></div>
                          <div className="footer7Acopy brbnone7Acopy brl7Acopy2"></div>
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

export default BagPrint20A;
