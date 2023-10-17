import queryString from "query-string";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/bagprint/print7Acopy.css";
import BarcodeGenerator from "../../components/BarcodeGenerator";
import Loader from "../../components/LoaderBag";
import { GetData } from "../../GlobalFunctions/GetData";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import { organizeData } from "../../GlobalFunctions/OrganizeBagPrintData";

const BagPrint7Acopy = ({ queries, headers }) => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  let jobs = queryParams.str_srjobno;
  const parts = jobs.split(",");
  const resultString = parts.map((part) => `'${part}'`).join(",");
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
        console.log(datas);

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
        });
        setData(responseData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  //  useEffect(() => {
  //     if (data?.length !== 0) {
  //       setTimeout(() => {
  //         window.print();
  //       }, 5000);
  //     }
  //   }, [data]);

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
          <div className="d-flex flex-wrap mb-5">
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
                            <div className="container7Acopy">
                              <div className="head7Acopy">
                                <div className="headerdesc7Acopy">
                                  <div className="headW7Acopy">
                                    <div className="jobno7Acopy">
                                      <div>
                                        <span className="fs7Acopy">
                                          Ord Dt:
                                        </span>
                                        <span>{e?.data?.rd?.orderDatef}</span>
                                      </div>
                                      <div>
                                        <span className="fs7Acopy">
                                          Due Dt:
                                        </span>
                                        <span>{e?.data?.rd?.promiseDatef}</span>
                                      </div>
                                      <div className="fs7Acopy">
                                        <span>Party:</span>
                                        <span>{e?.data?.rd?.CustomerCode}</span>
                                      </div>
                                    </div>
                                    <div className="barcodebag7Acopy">
                                      <div>
                                        <div className="h7Acopy fs7Acopy d-flex justify-content-between">
                                          <span className="fs7Acopy">
                                            Bag No:
                                          </span>
                                          <span className="fs7Acopy">
                                            {e?.data?.rd?.serialjobno}
                                          </span>
                                        </div>
                                        <div className="h7Acopy fs7Acopy d-flex justify-content-between">
                                          <span className="fs7Acopy">
                                            Dgn No:
                                          </span>
                                          <span className="fs7Acopy">
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
                                        <span> Remark:</span> <span></span>
                                      </div>
                                      <div className="matinfo7Acopy">
                                        <div className="h327Acopy d-flex justify-content-between p-1">
                                          KT/CLR:
                                        </div>
                                        <div className="h327Acopy d-flex justify-content-between p-1">
                                          <span>Size:</span>
                                          <span>{e?.data?.rd?.Size}</span>
                                        </div>
                                        <div
                                          className="h327Acopy d-flex justify-content-between p-1"
                                          style={{ borderBottom: "0px" }}
                                        >
                                          <span>Est Wt:</span>
                                          <span></span>
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
                                    <div>Dia Detail:</div>
                                    <div className="mb-2">
                                      {e?.additional?.dia?.ActualPcs}/
                                      {e?.additional?.dia?.ActualWeight?.toFixed(
                                        3
                                      )}
                                    </div>
                                    <div>CS Detail:</div>
                                    <div>
                                      {e?.additional?.clr?.ActualPcs}/
                                      {e?.additional?.clr?.ActualWeight?.toFixed(
                                        3
                                      )}
                                    </div>
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
                                <div className="footer7Acopy brbnone7Acopy brl7Acopy2">
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
                                  <span className="fs7Acopy">Ord Dt:</span>
                                  <span>{e?.data?.rd?.orderDatef}</span>
                                </div>
                                <div>
                                  <span className="fs7Acopy">Due Dt:</span>
                                  <span>{e?.data?.rd?.promiseDatef}</span>
                                </div>
                                <div className="fs7Acopy">
                                  <span>Party:</span>
                                  <span>{e?.data?.rd?.CustomerCode}</span>
                                </div>
                              </div>
                              <div className="barcodebag7Acopy">
                                <div>
                                  <div className="h7Acopy fs7Acopy">
                                    <span className="fs7Acopy">Bag No:</span>
                                    <span className="fs7Acopy">
                                      {e?.data?.rd?.serialjobno}
                                    </span>
                                  </div>
                                  <div className="h7Acopy fs7Acopy">
                                    <span className="fs7Acopy">Dgn No:</span>
                                    <span className="fs7Acopy">
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
                                  <span> Remark:</span>{" "}
                                  <span>{e?.data?.rd?.remark}</span>
                                </div>
                                <div className="matinfo7Acopy">
                                  <div className="h327Acopy">KT/CLR:</div>
                                  <div className="h327Acopy">
                                    <span>Size:</span>
                                    <span>{e?.data?.rd?.Size}</span>
                                  </div>
                                  <div
                                    className="h327Acopy"
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

export default BagPrint7Acopy;
