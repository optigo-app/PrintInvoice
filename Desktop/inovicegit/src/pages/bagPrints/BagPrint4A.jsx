import React, { useEffect, useState } from "react";
import "../../assets/css/bagprint/print4A.css";
import BarcodeGenerator from "../../components/BarcodeGenerator";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import Loader from "../../components/Loader";
import { GetData } from "../../GlobalFunctions/GetData";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import { organizeData } from "../../GlobalFunctions/OrganizeBagPrintData";
import { NumberWithCommas, checkInstruction, fixedValues, notZero } from "../../GlobalFunctions";
import { GetUniquejob } from "../../GlobalFunctions/GetUniqueJob";

const BagPrint4A = ({ queries, headers }) => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const resultString = GetUniquejob(queryParams?.str_srjobno);

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

        const allDatas = await GetData(objs);
        let datas = organizeData(allDatas?.rd, allDatas?.rd1);
        datas?.map((a) => {
          let chunkData = [];
          let chunkSize = 14;
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
              dia.ActualPcs = dia.ActualPcs + e.ActualPcs;
              dia.ActualWeight = dia.ActualWeight + e.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
              clr.ActualPcs = clr.ActualPcs + e.ActualPcs;
              clr.ActualWeight = clr.ActualWeight + e.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 5) {
              f.ActualPcs = f.ActualPcs + e.ActualPcs;
              f.ActualWeight = f.ActualWeight + e.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
              misc.ActualPcs = misc.ActualPcs + e.ActualPcs;
              misc.ActualWeight = misc.ActualWeight + e.ActualWeight;
            }
          });

          let blankArr = a?.rd1?.filter((e, i) => e?.MasterManagement_DiamondStoneTypeid !== 0);
          a.rd1 = blankArr;

          let obj = { ...a };
          if (obj?.rd?.length > 0) {
            // let designMaster = datas?.rd[0]?.officeuse ?? '';
            // let custUse = datas?.rd[0]?.custInstruction ?? '';
            // let updateIns = datas?.rd[0]?.ProductInstruction ?? '';
            // let showIns = designMaster + custUse + updateIns;

            // obj.rd[0].instructionData = obj?.rd[0]?.instructionData + (showIns?.length !== 0) ? (showIns)?.substring(0, 113) : '';
            obj.rd.instructionData = (
              a?.rd["officeuse"] +
              a?.rd?.custInstruction +
              a?.rd["ProductInstruction"]
            )?.substring(0, 113);
          }

          let imagePath = queryParams?.imagepath;
          imagePath = atob(queryParams?.imagepath);
          let img = imagePath + a?.rd?.ThumbImagePath;
          for (let i = 0; i < a?.rd1?.length; i += chunkSize) {
            const chunks = a?.rd1?.slice(i, i + chunkSize);
            let len = 14 - a?.rd1?.slice(i, i + chunkSize)?.length;
            chunkData.push({ data: chunks, length: len });
          }
          responseData.push({
            data: obj.rd,
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

        // for (let url in print) {

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

        //     const orderDatef = formatDate(datas?.rd[0]?.OrderDate);
        //     const promiseDatef = formatDate(datas?.rd[0]?.promisedate);

        //     datas?.rd?.map((e) => {
        //         e.orderDatef = orderDatef;
        //         e.promiseDatef = promiseDatef;
        //         //
        //     });

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

        //         // let designMaster = datas?.rd[0]?.officeuse ?? '';
        //         // let custUse = datas?.rd[0]?.custInstruction ?? '';
        //         // let updateIns = datas?.rd[0]?.ProductInstruction ?? '';
        //         // let showIns = designMaster + custUse + updateIns;

        //         // obj.rd[0].instructionData = obj?.rd[0]?.instructionData + (showIns?.length !== 0) ? (showIns)?.substring(0, 113) : '';
        //         obj.rd[0].instructionData = (datas?.rd[0]?.["officeuse"] + datas?.rd[0]?.custInstruction + datas?.rd[0]?.["ProductInstruction"])?.substring(0, 113);
        //     }

        //     let imagePath = queryParams.imagepath;
        //     imagePath = atob(queryParams.imagepath);
        //     let img = imagePath + datas?.rd[0]?.ThumbImagePath;
        //     for (let i = 0; i < (datas?.rd1).length; i += chunkSize) {
        //         const chunks = (datas?.rd1).slice(i, i + chunkSize);
        //         let len = 14 - ((datas?.rd1).slice(i, i + chunkSize)).length;
        //         chunkData.push({ data: chunks, length: len });
        //     }
        //     responseData.push({ data: obj.rd[0], additional: { length: length, clr: clr, dia: dia, f: f, img: img, misc: misc, pages: chunkData } });
        // }
        setData(responseData);
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
          <div className="print_btn ">
            <button
              className="btn_white blue print_btn"
              onClick={(e) => handlePrint(e)}
            >
              Print
            </button>
          </div>
          <section className="print4A pad_60_allPrint">
            {Array.from(
              { length: queries?.pageStart },
              (_, index) =>
                index > 0 && (
                  <div
                    key={index}
                    className="print4Apart_1"
                    style={{ border: "0px" }}
                  ></div>
                )
            )}
            {data?.length > 0 &&
              data?.map((e, i) => {
                return (
                  <>
                    {e?.additional?.pages?.length > 0 ? <> {(
                      e?.additional?.pages?.map((ele, ind) => {
                        return (
                          <>
                            <div className="container4A" key={ind}>
                              <div className="print4Apart_1">
                                <div className="part_1_4A">
                                  <div className="title4A jobDiaGold4A border_bottom4A">
                                    <div className="jobDiaGoldText4A ps-1">
                                      {e?.data?.serialjobno}
                                    </div>
                                    <div className="jobDiaGoldText4A">
                                      {e?.data?.Designcode}
                                    </div>
                                    <div
                                      className="jobDiaGoldText4A border_right4A pe-1"
                                      style={{ paddingRight: "2px" }}
                                    >
                                      {/* {e?.data?.MetalType} */}
                                      {e?.data?.MetalType} {e?.data?.MetalColorCo}
                                    </div>
                                  </div>
                                  <div className="height_border_31_4A border_bottom4A">
                                    <div className="cust4A border_right4A">
                                      <div
                                        className="custText4A"
                                        style={{ paddingTop: "3px" }}
                                      >
                                        CUST
                                      </div>
                                      <div className="custTextRes4A ">
                                        {e?.data?.CustomerCode}
                                      </div>
                                    </div>
                                    <div className="ordDt4A border_right4A">
                                      <div
                                        className="custText4A"
                                        style={{ paddingTop: "3px" }}
                                      >
                                        ORD.DT.
                                      </div>
                                      <div className="custTextRes4A">
                                        {e?.data?.orderDatef ?? ""}
                                      </div>
                                    </div>
                                    <div className="delDt4A border_right4A">
                                      <div
                                        className="custText4A"
                                        style={{ paddingTop: "3px" }}
                                      >
                                        DEL.DT.
                                      </div>
                                      <div className="custTextRes4A">
                                        {e?.data?.promiseDatef ?? ""}
                                      </div>
                                    </div>
                                    <div className="size4A border_right4A size4AA">
                                      <div
                                        className="custText4A"
                                        style={{ paddingTop: "3px" }}
                                      >
                                        SIZE
                                      </div>
                                      <div className="custTextRes4A">
                                        {e?.data?.Size}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="title4A border_bottom4A d_flex4A">
                                    <div className="code4A border_right4A code4A_text d-flex align-items-center">
                                      CODE
                                    </div>
                                    <div className="size4AS border_right4A code4A_text d-flex align-items-center">
                                      SIZE
                                    </div>
                                    <div className="pcs4A border_right4A code4A_text d-flex align-items-center">
                                      PCS
                                    </div>
                                    <div className="wt4A border_right4A code4A_text d-flex align-items-center">
                                      WT
                                    </div>
                                    <div className="pcs4A border_right4A code4A_text d-flex align-items-center">
                                      PCS
                                    </div>
                                    <div className="wt4A border_right4A code4A_text d-flex align-items-center">
                                      WT
                                    </div>
                                  </div>
                                  <div className="height_23_4A border_bottom4A d_flex4A">
                                    <div
                                      className="code4A border_right4A code4A_text"
                                      style={{ width: "94pt" }}
                                    >
                                      <div className="code_4A_change border-end border-black height_23_4A height_11_Print4a code4A_text">
                                      {e?.data?.MetalType} {e?.data?.MetalColorCo}
                                      </div>
                                    </div>
                                    {/* <div className="size4AS border_right4A code4A_text">

                                                                        </div> */}
                                    <div className="pcs4A border_right4A code4A_text"></div>
                                    <div className="wt4A border_right4A code4A_text"></div>
                                    <div className="pcs4A border_right4A code4A_text"></div>
                                    <div className="wt4A border_right4A code4A_text"></div>
                                  </div>
                                  <div className="record_line_1">
                                    {ele?.data.map((elem, index) => {
                                      return elem?.MasterManagement_DiamondStoneTypeid ===
                                        5 ? (
                                        <div
                                          className="record_line_4A border_bottom4A"
                                          key={index}
                                        >
                                          <div
                                            className="code4A border_right4A code4A_text"
                                            style={{
                                              width: "94pt",
                                              lineHeight: "8px",
                                            }}
                                          >
                                            <div className="finding height_23_4A">
                                            {elem?.Shapename} {elem?.Quality}
                                            {elem?.ColorName}
                                            </div>
                                          </div>
                                          {/* <div className="size4AS border_right4A code4A_text">
                                                                                        {elem?.Sizename}
                                                                                    </div> */}
                                          {/* <div className="pcs4A border_right4A code4A_text">
                                            {elem?.ActualPcs}
                                          </div>
                                          <div className="wt4A border_right4A code4A_text">
                                            {elem?.ActualWeight}
                                          </div> */}
                                    <div className="pcs4A border_right4A code4A_text">{NumberWithCommas(elem?.ActualPcs, 0)}</div>
                                          <div className="wt4A border_right4A code4A_text">{fixedValues(elem?.ActualWeight, 3)}</div>
                                          <div className="pcs4A border_right4A code4A_text">{notZero(elem?.IssuePcs) !== "" && NumberWithCommas(notZero(elem?.IssuePcs), 0)}</div>
                                          <div className="wt4A border_right4A code4A_text">{notZero(elem?.IssuePcs) !== "" && fixedValues(notZero(elem?.IssueWeight), 3)}</div>
                                        </div>
                                      ) : (
                                        <div
                                          className="record_line_4A border_bottom4A"
                                          key={index}
                                        >
                                          <div className="code4A border_right4A code4A_text">
                                            {
                                              elem?.ConcatedFullShapeQualityColorName
                                            }
                                          </div>
                                          <div className="size4AS border_right4A code4A_text">
                                            {elem?.Sizename}
                                          </div>
                                          <div className="pcs4A border_right4A code4A_text">{NumberWithCommas(elem?.ActualPcs, 0)}</div>
                                          <div className="wt4A border_right4A code4A_text">{fixedValues(elem?.ActualWeight, 3)}</div>
                                          <div className="pcs4A border_right4A code4A_text">{notZero(elem?.IssuePcs) !== "" && NumberWithCommas(notZero(elem?.IssuePcs), 0)}</div>
                                          <div className="wt4A border_right4A code4A_text">{notZero(elem?.IssuePcs) !== "" && fixedValues(notZero(elem?.IssueWeight), 3)}</div>
                                        </div>
                                      );
                                    })}
                                    {ele?.length !== 0 &&
                                      Array.from(
                                        { length: ele?.length },
                                        (_, index) => (
                                          <div
                                            className="record_line_4A border_bottom4A"
                                            key={index}
                                          >
                                            <div className="code4A border_right4A code4A_text"></div>
                                            <div className="size4AS border_right4A code4A_text"></div>
                                            <div className="pcs4A border_right4A code4A_text"></div>
                                            <div className="wt4A border_right4A code4A_text"></div>
                                            <div className="pcs4A border_right4A code4A_text"></div>
                                            <div className="wt4A border_right4A code4A_text"></div>
                                          </div>
                                        )
                                      )}
                                  </div>
                                </div>
                                <div className="part_2_4A">
                                  <div className="img_sec_4A">
                                    <img
                                      src={e?.additional?.img}
                                      alt=""
                                      onError={(e) => handleImageError(e)}
                                      loading="eager"
                                    />
                                  </div>
                                  <div className="barcode_sticker_4A border-black border-top">
                                    <div className="barcodeText4A">
                                      <div className="BARCODE_TEXT_4A border_right4A">
                                        <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                          DIAMOND
                                        </div>
                                        <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                          {e?.additional?.dia?.ActualPcs}/
                                          {e?.additional?.dia?.ActualWeight?.toFixed(
                                            3
                                          )}
                                        </div>
                                        <div className="diamond_custom_4A border_bottom4A"></div>
                                      </div>
                                      <div className="BARCODE_TEXT_4A border_right4A">
                                        <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                          CS
                                        </div>
                                        <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                          {e?.additional?.clr?.ActualPcs}/
                                          {fixedValues(e?.additional?.clr?.ActualWeight, 2)}
                                        </div>
                                        <div className="diamond_custom_4A border_bottom4A"></div>
                                      </div>
                                      <div className="BARCODE_TEXT_4A border_right4A">
                                        <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                          METAL
                                        </div>
                                        <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                          {/* {e?.data?.netwt?.toFixed(3)} */}
                                          {fixedValues(e?.data?.ActualGrossweight, 3)}
                                        </div>
                                        <div className="diamond_custom_4A "></div>
                                      </div>
                                    </div>
                                    <div className="barcode_img_4A">
                                      <BarcodeGenerator
                                        data={e?.data?.serialjobno}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="part_3_4A">
                                  <div className="cast_ins">
                                    CAST INS.:
                                    <span className="red_4A">
                                      {/* 
                                      {e?.data?.instructionData?.length > 0
                                        ? e?.data?.instructionData ==
                                          (null || "null")
                                          ? ""
                                          : e?.data?.instructionData
                                        : ""} */}
                                      {checkInstruction(e?.data?.officeuse)}
                                      {checkInstruction(e?.data?.ProductInstruction)}
                                      {/* {checkInstruction(e?.data?.custInstruction)} */}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })
                    )} 
                      <div className="container4A" key={i + "a"}>
                        <div className="print4Apart_1">
                          <div className="part_1_container_4A container_print4Apart_1">
                            <div className="title4A jobDiaGold4A border_bottom4A">
                              <div className="jobDiaGoldText4A ps-1">
                                {e?.data?.serialjobno}
                              </div>
                              <div className="jobDiaGoldText4A">
                                {e?.data?.Designcode}
                              </div>
                              <div className="jobDiaGoldText4A border_right4A pe-1">
                                {e?.data?.MetalType} {e?.data?.MetalColorCo} 
                              </div>
                            </div>
                            <div className="priority4A border_bottom4A">
                              <div className="border_right4A priority_text_4A priority_sec_4A ">
                                PRIORITY
                              </div>
                              <div className="border_right4A priority_text_4A loc4A ">
                                LOC
                              </div>
                              <div className="border_right4A priority_text_4A qc4A ">
                                Q.C.
                              </div>
                            </div>
                            <div className="sales_rep_4A border_bottom4A">
                              <div className="priority_sec_4A border_right4A">
                                <div
                                  className="sales_Rep_text_4A"
                                  style={{ paddingTop: "3px" }}
                                >
                                  SALES REP.
                                </div>
                                <div className="sales_Rep_letter_4A">
                                  {e?.data?.SalesrepCode}
                                </div>
                              </div>
                              <div className=" border_right4A  loc4A ">
                                <div
                                  className="sales_Rep_text_4A"
                                  style={{ paddingTop: "3px" }}
                                >
                                  FROSTING
                                </div>
                                <div className="sales_Rep_letter_4A">
                                  {e?.data?.MetalFrosting}
                                </div>
                              </div>
                              <div className=" border_right4A  qc4A ">
                                <div
                                  className="sales_Rep_text_4A"
                                  style={{ paddingTop: "3px" }}
                                >
                                  ENAMELING
                                </div>
                                <div className="sales_Rep_letter_4A">
                                  {e?.data?.Enamelling}
                                </div>
                              </div>
                            </div>
                            <div className="lab_self_4A border_bottom4A">
                              <div className="priority_sec_4A border_right4A d_flex_4a">
                                <div className="sales_Rep_text_4A">
                                  LAB {e?.data?.MasterManagement_labname}
                                </div>
                                <div className="sales_Rep_letter_4A">
                                  {/* {e?.data?.MasterManagement_labname} */}
                                  {console.log(e?.data?.PO, e?.data?.MasterManagement_labname)}
                                  {(e?.data?.PO !== "" && e?.data?.PO !== "-") && `PO ${e?.data?.PO}`}
                                </div>
                              </div>
                              <div className=" border_right4A  loc4A d_flex_4a ">
                                <div className="sales_Rep_text_4A">
                                  SNAP
                                </div>
                                <div className="sales_Rep_letter_4A">
                                  {
                                    e?.data
                                      ?.MasterManagement_ProductImageType
                                  }
                                </div>
                              </div>
                              <div className=" border_right4A  qc4A d_flex_4a ">
                                <div className="sales_Rep_text_4A">
                                  MAKETYPE
                                </div>
                                <div className="sales_Rep_letter_4A">
                                  {e?.data?.mastermanagement_maketypename}
                                </div>
                              </div>
                            </div>
                            <div className="priority4A border_bottom4A">
                              <div className="border_right4A priority_text_4A priority_sec_4A ">
                                TR NO.
                              </div>
                              <div className="border_right4A priority_text_4A loc4A ">
                                TR NO.
                              </div>
                              <div className="border_right4A priority_text_4A qc4A ">
                                TR NO.
                              </div>
                            </div>
                            <div className="priority4A border_bottom4A">
                              <div className="border_right4A priority_text_4A priority_sec_4A ">
                                TR WT
                              </div>
                              <div className="border_right4A priority_text_4A loc4A ">
                                TR WT
                              </div>
                              <div className="border_right4A priority_text_4A qc4A ">
                                TR WT
                              </div>
                            </div>
                          </div>
                          <div className="part_2_container_4A container_print4Apart_1">
                            <div className="img_sec_container_4A border-bottom border-black">
                              <img
                                src={e?.additional?.img}
                                alt=""
                                onError={(e) => handleImageError(e)}
                                loading="eager"
                                id="img4A"
                              />
                            </div>
                          </div>
                          <div className="part_3_container_4A">
                            <div className="part_3_container_4A_sec">
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center justify-content-center px-1">
                                  DEPT
                                </div>
                                <div className="issue_4A border_right4A d-flex align-items-center justify-content-center px-1">
                                  ISSUE
                                </div>
                                <div className="receive_4A border_right4A d-flex align-items-center justify-content-center px-1">
                                  RECEIVE
                                </div>
                                <div className="scrap_4A border_right4A d-flex align-items-center justify-content-center px-1">
                                  QC.Sign
                                </div>
                                <div className="pcs_4A border_right4A d-flex align-items-center justify-content-center px-1">
                                  PCS
                                </div>
                                <div className="worker_4A border_right_4A d-flex align-items-center justify-content-center px-1">
                                  WORKER
                                </div>
                              </div>

                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  FIL.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  PPL.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  SET.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  CUT.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  Fin.W
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  F.PoI.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  Fit.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  FP.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">

                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center">

                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center">

                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record ">
                                <div className=" dept_4A border_right4A d-flex align-items-center">
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center">
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>

                            </div>
                            <div className="barcode_img_container_4A">
                              <BarcodeGenerator
                                data={e?.data?.serialjobno}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>: <>
                      <div className="container4A">
                        <div className="print4Apart_1">
                          <div className="part_1_4A">
                            <div className="title4A jobDiaGold4A border_bottom4A">
                              <div className="jobDiaGoldText4A ps-1">
                                {e?.data?.serialjobno}
                              </div>
                              <div className="jobDiaGoldText4A">
                                {e?.data?.Designcode}
                              </div>
                              <div className="jobDiaGoldText4A border_right4A pe-1">
                                {/* {e?.data?.MetalType} */}
                                {e?.data?.MetalType} {e?.data?.MetalColorCo}
                              </div>
                            </div>
                            <div className="height_border_31_4A border_bottom4A">
                              <div className="cust4A border_right4A">
                                <div
                                  className="custText4A"
                                  style={{ paddingTop: "3px" }}
                                >
                                  CUST
                                </div>
                                <div className="custTextRes4A ">
                                  {e?.data?.CustomerCode}
                                </div>
                              </div>
                              <div className="ordDt4A border_right4A">
                                <div
                                  className="custText4A"
                                  style={{ paddingTop: "3px" }}
                                >
                                  ORD.DT.
                                </div>
                                <div className="custTextRes4A">
                                  {e?.data?.orderDatef ?? ""}
                                </div>
                              </div>
                              <div className="delDt4A border_right4A">
                                <div
                                  className="custText4A"
                                  style={{ paddingTop: "3px" }}
                                >
                                  DEL.DT.
                                </div>
                                <div className="custTextRes4A">
                                  {e?.data?.promiseDatef ?? ""}
                                </div>
                              </div>
                              <div className="size4A border_right4A size4AA">
                                <div
                                  className="custText4A"
                                  style={{ paddingTop: "3px" }}
                                >
                                  SIZE
                                </div>
                                <div className="custTextRes4A">
                                  {e?.data?.Size}
                                </div>
                              </div>
                            </div>
                            <div className="title4A border_bottom4A d_flex4A">
                              <div className="code4A border_right4A code4A_text d-flex align-items-center">
                                CODE
                              </div>
                              <div className="size4AS border_right4A code4A_text d-flex align-items-center">
                                SIZE
                              </div>
                              <div className="pcs4A border_right4A code4A_text d-flex align-items-center">
                                PCS
                              </div>
                              <div className="wt4A border_right4A code4A_text d-flex align-items-center">
                                WT
                              </div>
                              <div className="pcs4A border_right4A code4A_text d-flex align-items-center">
                                PCS
                              </div>
                              <div className="wt4A border_right4A code4A_text d-flex align-items-center">
                                WT
                              </div>
                            </div>
                            <div className="height_23_4A border_bottom4A d_flex4A">
                              <div
                                className="code4A border_right4A code4A_text"
                                style={{ width: "94pt" }}
                              >
                                <div className="code_4A_change border-end border-black height_23_4A">
                                {e?.data?.MetalType} {e?.data?.MetalColorCo}
                                </div>
                              </div>
                              {/* <div className="size4AS border_right4A code4A_text">

                                                        </div> */}
                              <div className="pcs4A border_right4A code4A_text"></div>
                              <div className="wt4A border_right4A code4A_text"></div>
                              <div className="pcs4A border_right4A code4A_text"></div>
                              <div className="wt4A border_right4A code4A_text"></div>
                            </div>
                            <div className="record_line_1">
                              {Array.from({ length: 14 }, (_, index) => (
                                <div
                                  className="record_line_4A border_bottom4A"
                                  key={index}
                                >
                                  <div className="code4A border_right4A code4A_text"></div>
                                  <div className="size4AS border_right4A code4A_text"></div>
                                  <div className="pcs4A border_right4A code4A_text"></div>
                                  <div className="wt4A border_right4A code4A_text"></div>
                                  <div className="pcs4A border_right4A code4A_text"></div>
                                  <div className="wt4A border_right4A code4A_text"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="part_2_4A">
                            <div className="img_sec_4A">
                              <img
                                src={e?.additional?.img}
                                alt=""
                                onError={(e) => handleImageError(e)}
                                loading="eager"
                              />
                            </div>
                            <div className="barcode_sticker_4A border-black border-top">
                              <div className="barcodeText4A">
                                <div className="BARCODE_TEXT_4A border_right4A">
                                  <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                    DIAMOND
                                  </div>
                                  <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                    {e?.additional?.dia?.ActualPcs}/
                                    {e?.additional?.dia?.ActualWeight?.toFixed(
                                      3
                                    )}
                                  </div>
                                  <div className="diamond_custom_4A border_bottom4A"></div>
                                </div>
                                <div className="BARCODE_TEXT_4A border_right4A">
                                  <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                    CS
                                  </div>
                                  <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                    {e?.additional?.clr?.ActualPcs}/
                                    {fixedValues(e?.additional?.clr?.ActualWeight, 3)}
                                  </div>
                                  <div className="diamond_custom_4A border_bottom4A"></div>
                                </div>
                                <div className="BARCODE_TEXT_4A border_right4A">
                                  <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                    METAL
                                  </div>
                                  <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                    {/* {e?.data?.netwt?.toFixed(3) ?? "0.000"} */}
                                    {fixedValues(e?.data?.ActualGrossweight, 3)}
                                  </div>
                                  <div className="diamond_custom_4A "></div>
                                </div>
                              </div>
                              <div className="barcode_img_4A">
                                <BarcodeGenerator data={e?.data?.serialjobno} />
                              </div>
                            </div>
                          </div>
                          <div className="part_3_4A">
                            <div className="cast_ins">
                              CAST INS.:
                              <span className="red_4A">
                                {/* 
                                {e?.data?.instructionData?.length > 0
                                  ? e?.data?.instructionData == (null || "null")
                                    ? ""
                                    : e?.data?.instructionData
                                  : ""} */}
                                {checkInstruction(e?.data?.officeuse)}
                                {checkInstruction(e?.data?.ProductInstruction)}
                                {/* {checkInstruction(e?.data?.custInstruction)} */}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="container4A" key={i + "a"}>
                        <div className="print4Apart_1">
                          <div className="part_1_container_4A container_print4Apart_1">
                            <div className="title4A jobDiaGold4A border_bottom4A">
                              <div className="jobDiaGoldText4A ps-1">
                                {e?.data?.serialjobno}
                              </div>
                              <div className="jobDiaGoldText4A">
                                {e?.data?.Designcode}
                              </div>
                              <div className="jobDiaGoldText4A border_right4A pe-1">
                                {e?.data?.MetalType} {e?.data?.MetalColorCo} 
                              </div>
                            </div>
                            <div className="priority4A border_bottom4A">
                              <div className="border_right4A priority_text_4A priority_sec_4A ">
                                PRIORITY
                              </div>
                              <div className="border_right4A priority_text_4A loc4A ">
                                LOC
                              </div>
                              <div className="border_right4A priority_text_4A qc4A ">
                                Q.C.
                              </div>
                            </div>
                            <div className="sales_rep_4A border_bottom4A">
                              <div className="priority_sec_4A border_right4A">
                                <div
                                  className="sales_Rep_text_4A"
                                  style={{ paddingTop: "3px" }}
                                >
                                  SALES REP.
                                </div>
                                <div className="sales_Rep_letter_4A">
                                  {e?.data?.SalesrepCode}
                                </div>
                              </div>
                              <div className=" border_right4A  loc4A ">
                                <div
                                  className="sales_Rep_text_4A"
                                  style={{ paddingTop: "3px" }}
                                >
                                  FROSTING
                                </div>
                                <div className="sales_Rep_letter_4A">
                                  {e?.data?.MetalFrosting}
                                </div>
                              </div>
                              <div className=" border_right4A  qc4A ">
                                <div
                                  className="sales_Rep_text_4A"
                                  style={{ paddingTop: "3px" }}
                                >
                                  ENAMELING
                                </div>
                                <div className="sales_Rep_letter_4A">
                                  {e?.data?.Enamelling}
                                </div>
                              </div>
                            </div>
                            <div className="lab_self_4A border_bottom4A">
                              <div className="priority_sec_4A border_right4A d_flex_4a">
                                <div className="sales_Rep_text_4A">
                                  LAB {e?.data?.MasterManagement_labname}
                                </div>
                                <div className="sales_Rep_letter_4A">
                                  {/* {e?.data?.MasterManagement_labname} */}
                                  {(e?.data?.PO !== "" && e?.data?.PO !== "-") && `PO ${e?.data?.PO}`}
                                </div>
                              </div>
                              <div className=" border_right4A  loc4A d_flex_4a ">
                                <div className="sales_Rep_text_4A">
                                  SNAP
                                </div>
                                <div className="sales_Rep_letter_4A">
                                  {
                                    e?.data
                                      ?.MasterManagement_ProductImageType
                                  }
                                </div>
                              </div>
                              <div className=" border_right4A  qc4A d_flex_4a ">
                                <div className="sales_Rep_text_4A">
                                  MAKETYPE
                                </div>
                                <div className="sales_Rep_letter_4A">
                                  {e?.data?.mastermanagement_maketypename}
                                </div>
                              </div>
                            </div>
                            <div className="priority4A border_bottom4A">
                              <div className="border_right4A priority_text_4A priority_sec_4A ">
                                TR NO.
                              </div>
                              <div className="border_right4A priority_text_4A loc4A ">
                                TR NO.
                              </div>
                              <div className="border_right4A priority_text_4A qc4A ">
                                TR NO.
                              </div>
                            </div>
                            <div className="priority4A border_bottom4A">
                              <div className="border_right4A priority_text_4A priority_sec_4A ">
                                TR WT
                              </div>
                              <div className="border_right4A priority_text_4A loc4A ">
                                TR WT
                              </div>
                              <div className="border_right4A priority_text_4A qc4A ">
                                TR WT
                              </div>
                            </div>
                          </div>
                          <div className="part_2_container_4A container_print4Apart_1">
                            <div className="img_sec_container_4A border-bottom border-black">
                              <img
                                src={e?.additional?.img}
                                alt=""
                                onError={(e) => handleImageError(e)}
                                loading="eager"
                                id="img4A"
                              />
                            </div>
                          </div>
                          <div className="part_3_container_4A">
                            <div className="part_3_container_4A_sec">
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center justify-content-center px-1">
                                  DEPT
                                </div>
                                <div className="issue_4A border_right4A d-flex align-items-center justify-content-center px-1">
                                  ISSUE
                                </div>
                                <div className="receive_4A border_right4A d-flex align-items-center justify-content-center px-1">
                                  RECEIVE
                                </div>
                                <div className="scrap_4A border_right4A d-flex align-items-center justify-content-center px-1">
                                  QC.Sign
                                </div>
                                <div className="pcs_4A border_right4A d-flex align-items-center justify-content-center px-1">
                                  PCS
                                </div>
                                <div className="worker_4A border_right_4A d-flex align-items-center justify-content-center px-1">
                                  WORKER
                                </div>
                              </div>

                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  FIL.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  PPL.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  SET.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  CUT.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  Fin.W
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  F.PoI.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  Fit.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  FP.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center">

                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center">

                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center">

                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record ">
                                <div className=" dept_4A border_right4A d-flex align-items-center">
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A">
                                <div className=" dept_4A border_right4A d-flex align-items-center">
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>

                            </div>
                            <div className="barcode_img_container_4A">
                              <BarcodeGenerator
                                data={e?.data?.serialjobno}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
</>
                    }
                  </>
                );
              })}
          </section>
        </>
      )}
    </>
  );
};

export default BagPrint4A;








