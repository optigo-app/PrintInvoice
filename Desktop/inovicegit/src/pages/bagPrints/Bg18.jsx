import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import "../../assets/css/bagprint/bg18.css";
import Button from "../../GlobalFunctions/Button";
import { formatDate } from "../../GlobalFunctions/DateFormat";
import { GetChunkData } from "../../GlobalFunctions/GetChunkData";
import { GetData } from "../../GlobalFunctions/GetData";
import Loader from "../../components/LoaderBag";
const Bg18 = ({ queries, headers }) => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location?.search);
  let jobs = queryParams?.str_srjobno;
  if (Object.keys(queryParams)?.length !== 0) {
    jobs = jobs.split(",");
  }

  const [print, setPrint] = useState(jobs);
  const chunkSize11 = 13;

  useEffect(() => {
    if (Object.keys(queryParams)?.length !== 0) {
      atob(queryParams?.imagepath);
    }
    const fetchData = async () => {
      try {
        const responseData = [];
        for (let url in print) {
          let chunkData = [];
          const objs = {
            jobno: print[url],
            custid: queries.custid,
            printname: queries.printname,
            appuserid: queries.appuserid,
            url: queries.url,
            headers: headers,
          };
          let datas = await GetData(objs);
          const orderDatef = formatDate(datas?.rd[0]?.OrderDate);
          const promiseDatef = formatDate(datas?.rd[0]?.promisedate);

          datas?.rd?.map((e) => {
            e.orderDatef = orderDatef;
            e.promiseDatef = promiseDatef;
            //
          });
          // let p_tag = { "SerialJobno": `${print[url]}`, "customerid": `${queries?.custid}`, "BagPrintName": `${queries?.printname}` };
          // let jsonString = JSON.stringify(p_tag);
          // let base64String = btoa(jsonString);
          // let Body = {
          //     "con": `{\"id\":\"\",\"mode\":\"${queries?.printname}\",\"appuserid\":\"${queries?.appuserid}\"}`,
          //     "p": `${base64String}`,
          //     "f": `${queries?.appuserid} ${queries?.printname}`
          // };
          // let urls = atob(queries?.url);
          // const response = await axios.post(urls, Body, { headers: headers });
          // let datas = JSON.parse(response?.data?.d);

          // console.log(datas.rd1);
          let diamondArr = [];
          let colorStoneArr = [];
          let miscArr = [];
          let findingDetailArr = [];

          datas?.rd1?.forEach((e, i) => {
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

          datas?.rd1?.map((e, i) => {
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
          dia.ActualPcs = +dia.ActualPcs.toFixed(3);
          dia.ActualWeight = +dia.ActualWeight.toFixed(3);
          clr.ActualPcs = +clr.ActualPcs.toFixed(3);
          clr.ActualWeight = +clr.ActualWeight.toFixed(3);
          misc.ActualPcs = +misc.ActualPcs.toFixed(3);
          misc.ActualWeight = +misc.ActualWeight.toFixed(3);
          f.ActualPcs = +f.ActualPcs.toFixed(3);
          f.ActualWeight = +f.ActualWeight.toFixed(3);

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
          let mainArr = arr.concat(
            ArrofSevenSize,
            ArrofFiveSize,
            ArrofMISize,
            ArrofFSize
          );

          let imagePath = queryParams?.imagepath;
          imagePath = atob(queryParams?.imagepath);

          let img = imagePath + datas?.rd[0]?.ThumbImagePath;
          let arrofchunk = GetChunkData(chunkSize11, mainArr);
          // for (let i = 0; i < mainArr.length; i += chunkSize11) {
          //     const chunks = mainArr.slice(i, i + chunkSize11);
          //     let len = 13 - (mainArr.slice(i, i + chunkSize11)).length;
          //     chunkData.push({ data: chunks, length: len });
          // }
          responseData.push({
            data: datas,
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
        }
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
      }, 10000);
    }
  }, [data]);

  return (
    <>
      {data.length === 0 ? (
        <Loader />
      ) : (
        <>
          <div className="printBg18">
            <div className="btnpcl">
              <Button />
            </div>
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
            )}
            {data?.length > 0 &&
              data?.map((e, i) => {
                return (
                  <>
                    {e?.additional?.pages?.length > 0 &&
                      e?.additional?.pages?.map((e, i) => {
                        return (
                          <>
                            <div className="containerBg18">
                              <div className="headBg18">
                                <div className="h2Bg18">
                                  <div>Date</div>
                                  <div>Job No:</div>
                                  <div>Bag No:</div>
                                  <div>:</div>
                                </div>
                                <div className="h2Bg18">
                                  <div>STYLE NO:</div>
                                  <div>METAL:</div>
                                  <div></div>
                                </div>
                                <div className="h2Bg18">
                                  <div>KT/COLOUR</div>
                                  <div>GROSS WT:</div>
                                  <div></div>
                                </div>
                                <div className="h2Bg18">
                                  <div className="d-flex">
                                    <div>FINDING NAME :</div>
                                    <div> Total Qty.</div>
                                  </div>
                                  <div>NET WT:</div>
                                </div>
                              </div>
                              <div className="tableBg18">
                                <div className="theadBg18">
                                  <div
                                    className="fw-bold wc1Bg18"
                                    style={{ width: "112px" }}
                                  >
                                    REQUIRED ITEM
                                  </div>
                                  <div
                                    className="hBg18"
                                    style={{ borderLeft: "1px solid black" }}
                                  >
                                    <div className="fw-bold wc1Bg18 bbBg18">
                                      ISSUED
                                    </div>
                                    <div className="d-flex wc1Bg18 d-flex justify-content-between align-items-center">
                                      <div className="fw-bold w-50 d-flex justify-content-center align-items-center h-100 brBg18">
                                        PCS.
                                      </div>
                                      <div className="fw-bold w-50 d-flex justify-content-center align-items-center h-100">
                                        WT.
                                      </div>
                                    </div>
                                  </div>
                                  <div className="hBg18">
                                    <div className="fw-bold wc1Bg18 bbBg18">
                                      RECEIVED
                                    </div>
                                    <div className="d-flex wc1Bg18 d-flex justify-content-between align-items-center">
                                      <div className="fw-bold w-50 d-flex justify-content-center align-items-center h-100 brBg18">
                                        PCS.
                                      </div>
                                      <div className="fw-bold w-50 d-flex justify-content-center align-items-center h-100">
                                        WT.
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className="hBg18"
                                    style={{ borderRight: "0px solid" }}
                                  >
                                    <div className="fw-bold wc1Bg18 bbBg18">
                                      SCRAP.
                                    </div>
                                    <div className="d-flex wc1Bg18 d-flex justify-content-between align-items-center">
                                      <div className="fw-bold w-50 d-flex justify-content-center align-items-center h-100 brBg18">
                                        PCS.
                                      </div>
                                      <div className="fw-bold w-50 d-flex justify-content-center align-items-center h-100">
                                        WT.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="tbodyBg18">
                                  {Array.from({ length: 11 }, (_, index) => (
                                    <div className="tbodyrBg18">
                                      <div
                                        className="d-flex justify-content-center align-items-center h-100 brBg18"
                                        style={{ width: "113px" }}
                                      ></div>
                                      <div className="d-flex justify-content-center align-items-center h-100 wc1Bg18 brBg18">
                                        <div className="w-50 d-flex justify-content-center align-items-center h-100 brBg18 fontall">
                                          000000
                                        </div>
                                        <div className="w-50 d-flex justify-content-center align-items-center h-100 fontall">
                                          0000.000
                                        </div>
                                      </div>
                                      <div className="d-flex justify-content-center align-items-center h-100 wc1Bg18 brBg18">
                                        <div className="w-50 d-flex justify-content-center align-items-center h-100 brBg18"></div>
                                        <div className="w-50 d-flex justify-content-center align-items-center h-100"></div>
                                      </div>
                                      <div className="d-flex justify-content-center align-items-center h-100 wc1Bg18">
                                        <div className="w-50 d-flex justify-content-center align-items-center h-100 brBg18"></div>
                                        <div className="w-50 d-flex justify-content-center align-items-center h-100"></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })}
                  </>
                );
              })}
          </div>
        </>
      )}
    </>
  );
};

export default Bg18;
