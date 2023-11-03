import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/bagprint/print2A.css";
import { GetChunkData } from "../../GlobalFunctions/GetChunkData";
import { GetData } from "../../GlobalFunctions/GetData";
import { GetSeparateData } from "../../GlobalFunctions/GetSeparateData";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import BarcodeGenerator from "../../components/BarcodeGenerator";
import Loader from "../../components/Loader";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import { organizeData } from "../../GlobalFunctions/OrganizeBagPrintData";
import { GetUniquejob } from "../../GlobalFunctions/GetUniqueJob";
import { checkInstruction } from './../../GlobalFunctions';

function BagPrint2A({ queries, headers }) {
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const resultString = GetUniquejob(queryParams?.str_srjobno);
  const chunkSize11 = 15;
  const imgUrls = [];
  useEffect(() => {
    if (Object.keys(queryParams)?.length !== 0) {
      atob(queryParams?.imagepath);
    }
    const fetchData = async () => {
      try {
        const responseData = [];
        // eslint-disable-next-line no-unused-vars
        const startTime = performance.now();

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

        // eslint-disable-next-line array-callback-return
        datas?.map((a) => {
          imgUrls?.push(a?.rd?.ThumbImagePath);
          let separateData = GetSeparateData(a?.rd1);
          separateData?.diamondArr.unshift({
            heading: "DIAMOND DETAIL",
            MasterManagement_DiamondStoneTypeid: 3,
          });
          separateData?.colorStoneArr.unshift({
            heading: "COLOR STONE DETAIL",
            MasterManagement_DiamondStoneTypeid: 4,
          });
          separateData?.findingArr.unshift({
            heading: "FINDING DETAIL",
            MasterManagement_DiamondStoneTypeid: 5,
          });
          separateData?.miscArr.unshift({
            heading: "MISC DETAIL",
            MasterManagement_DiamondStoneTypeid: 7,
          });

          // eslint-disable-next-line array-callback-return
          separateData?.diamondArr?.map((e) => {
            if (e?.ActualPcs === 0 && e?.ActualWeight === 0) {
              separateData.diamondArr = [];
            }
          });
          // eslint-disable-next-line array-callback-return
          separateData?.colorStoneArr.map((e) => {
            if (e.ActualPcs === 0 && e.ActualWeight === 0) {
              separateData.colorStoneArr = [];
            }
          });
          // eslint-disable-next-line array-callback-return
          separateData?.miscArr.map((e) => {
            if (e.ActualPcs === 0 && e.ActualWeight === 0) {
              separateData.miscArr = [];
            }
          });
          // eslint-disable-next-line array-callback-return
          separateData?.findingArr.map((e) => {
            if (e.ActualPcs === 0 && e.ActualWeight === 0) {
              separateData.findingArr = [];
            }
          });

          let arr = [];
          let mainArr = arr.concat(
            separateData?.diamondArr,
            separateData?.colorStoneArr,
            separateData?.miscArr,
            separateData?.findingArr
          );
          let imagePath = queryParams?.imagepath;
          imagePath = atob(queryParams?.imagepath);
          let img = imagePath + a?.rd?.ThumbImagePath;
          let arrofCHunk = GetChunkData(chunkSize11, mainArr);
          
          responseData.push({
            data: a,
            additional: {
              length: separateData?.length,
              clr: separateData?.clr,
              dia: separateData?.dia,
              f: separateData?.f,
              img: img,
              misc: separateData?.misc,
              pages: arrofCHunk,
            },
          });
          setData(responseData);
        });
    } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <div className="print_btn ">
            <button
              className="btn_white blue print_btn"
              onClick={(e) => handlePrint(e)}
            >
              Print
            </button>
          </div>

          <div className="print2A pad_60_allPrint">
            {Array.from(
              { length: queries.pageStart },
              (_, index) =>
                index > 0 && (
                  <div
                    key={index}
                    className="mainbag2A"
                    style={{ border: "0px" }}
                  ></div>
                )
            )}
            {data.length > 0 &&
              data.map((e, ind) => {
                return (
                  <React.Fragment key={ind}>
                    {e?.additional?.pages?.length > 0 ? (
                      e?.additional?.pages?.map((ele, i) => {
                        return (
                          <React.Fragment key={i}>
                            <div className="mainbag2A">
                              <div className="print2AStartPart">
                                <div className="print2A_header">
                                  <div className="print2A_header_bagInfoPart">
                                    <div className="print2A_header_bagInfoPart1">
                                      <div
                                        className="print2AJobNo"
                                        style={{ fontSize: "15px" }}
                                      >
                                        {e?.data?.rd?.serialjobno}
                                      </div>
                                      <div className="print2AJobNo">
                                        {e?.data?.rd?.Designcode?.toUpperCase()}
                                      </div>
                                      <div className="print2AJobNo">
                                        {e?.data?.rd?.MetalType?.toUpperCase() +
                                          " " +
                                          e?.data?.rd?.MetalColorCo?.toUpperCase()}
                                      </div>
                                    </div>

                                    <div className="print2AMaterial">
                                      <div className="print2AMaterialCG">
                                        <div className="g2A">CUST.</div>
                                        <div
                                          className="custHead2A"
                                          style={{ width: "60px" }}
                                        >
                                          {e?.data?.rd?.CustomerCode}
                                        </div>
                                        <div className="custCode2A">
                                          <b>GOLD</b>
                                        </div>
                                        <div className="cst2A">
                                          <b>DIA</b>
                                        </div>
                                        <div
                                          className="cst2A"
                                          style={{ borderRight: "0px" }}
                                        >
                                          <b>CST</b>
                                        </div>
                                      </div>
                                      <div className="print2AMaterialCG">
                                        <div className="g2A">SIZE</div>
                                        <div
                                          className="custHead2A lh1Ady"
                                          style={{ width: "60px" }}
                                        >
                                          {e?.data?.rd?.Size}
                                        </div>
                                        <div className="custCode2A">
                                          {e?.data?.rd?.MetalWeight?.toFixed(3)}
                                        </div>
                                        <div className="cst2A">
                                          {e?.additional?.dia?.ActualPcs}/
                                          {e?.additional?.dia?.ActualWeight?.toFixed(
                                            2
                                          )}
                                        </div>
                                        <div
                                          className="cst2A"
                                          style={{ borderRight: "0px" }}
                                        >
                                          {e?.additional?.clr?.ActualPcs}/
                                          {e?.additional?.clr?.ActualWeight?.toFixed(
                                            2
                                          )}
                                        </div>
                                      </div>
                                      <div className="print2AMaterialCG">
                                        <div
                                          className="g2A"
                                          style={{ width: "38px" }}
                                        >
                                          PO
                                        </div>
                                        <div
                                          className="custHead2A lh1Ady"
                                          style={{ width: "100px" }}
                                        >
                                          {e?.data?.rd?.PO}
                                        </div>
                                        <div className="cst2A">
                                          <b>BAG DT</b>
                                        </div>
                                        <div
                                          className="cst2A"
                                          style={{ borderRight: "0px" }}
                                        >
                                          {e?.data?.rd?.orderDatef}
                                        </div>
                                      </div>

                                    </div>
                                  </div>
                                  <div className="print2A_header_bagImgPart2">
                                    <img
                                      src={
                                        e?.additional?.img !== ""
                                          ? e?.additional?.img
                                          : require("../../assets/img/default.jpg")
                                      }
                                      id="print2AImg"
                                      alt=""
                                      onError={(e) => handleImageError(e)}
                                      loading="eager"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div
                                className="print2AtableBarcode"
                                style={{ height: "287px" }}
                              >
                                <div className="midpart2A">
                                  <div className="print2AMiddlePart">
                                    <div className="print2AMidHead">
                                      <div
                                        className="print2ARM"
                                        style={{ width: "104px" }}
                                      >
                                        <b>RM CODE</b>
                                      </div>
                                      <div
                                        className="sizename2A"
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                          fontSize: "14px",
                                          width: "69px",
                                        }}
                                      >
                                        <b>RM SIZE</b>
                                      </div>
                                      <div
                                        className="actual2Aflex"
                                        style={{
                                          borderRight: "1px solid black",
                                          width: "70px",
                                        }}
                                      >
                                        <div
                                          className="whA2A"
                                          style={{ width: "70px" }}
                                        >
                                          <b>ACTUAL</b>
                                        </div>
                                        <div
                                          className="child2A"
                                          style={{ width: "70px" }}
                                        >
                                          <p className="pcswtSet2A">
                                            <b>PCS</b>
                                          </p>
                                          <p
                                            style={{
                                              fontSize: "12px",
                                              paddingTop: "0px",
                                            }}
                                          >
                                            <b>WT</b>
                                          </p>
                                        </div>
                                      </div>
                                      <div
                                        className="actual2Aflex"
                                        style={{ borderRight: "0px" }}
                                      >
                                        <div className="whA2A">
                                          <b>ISSUE</b>
                                        </div>
                                        <div className="child2A">
                                          <p className="pcswtSet2A">
                                            <b>PCS</b>
                                          </p>
                                          <p
                                            style={{
                                              fontSize: "12px",
                                              paddingTop: "0px",
                                            }}
                                          >
                                            <b>WT</b>
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {ele?.data?.map((e, ai) => {
                                      return (
                                        <React.Fragment key={ai}>
                                          {e?.heading === "DIAMOND DETAIL" ||
                                          e?.heading === "COLOR STONE DETAIL" ||
                                          e?.heading === "MISC DETAIL" ||
                                          e?.heading === "FINDING DETAIL" ? (
                                            <div
                                              className="print2AMidBody"
                                              style={
                                                ai === 0 ? { display: "" } : {}
                                              }
                                            >
                                              <div
                                                className="print2ARM"
                                                style={{
                                                  width: "300px",
                                                  borderRight: "0px",
                                                  display: "flex",
                                                  justifyContent: "center",
                                                  alignItems: "center",
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                {e?.heading}
                                              </div>
                                            </div>
                                          ) : (
                                            <React.Fragment>
                                              {e?.Shapename === "TOTAL" ? (
                                                <div className="print2AMidBody">
                                                  <div
                                                    className="print2ARM RMW2A"
                                                    style={{
                                                      fontWeight: "bold",
                                                      fontSize: "10px",
                                                      justifyContent: "center",
                                                    }}
                                                  >
                                                    {e?.Shapename}
                                                  </div>
                                                  <div
                                                    className="sizename2A"
                                                    style={{
                                                      fontSize: "10.7px",
                                                    }}
                                                  >
                                                    {(e?.Sizename &&
                                                      e?.Sizename !== "" &&
                                                      e?.Sizename?.slice(
                                                        0,
                                                        10
                                                      )) ??
                                                      ""}
                                                  </div>
                                                  <div className="pcswt2A">
                                                    <div className="actualPcsWt2A">
                                                      <div
                                                        className="pcs2A"
                                                        style={{
                                                          fontWeight: "bold",
                                                          fontSize: "10px",
                                                          lineHeight: "8px",
                                                        }}
                                                      >
                                                        {e?.ActualPcs}
                                                      </div>
                                                      <div
                                                        className="pcs2A"
                                                        style={{
                                                          borderRight: "0px",
                                                          width: "40px",
                                                          fontWeight: "bold",
                                                          fontSize: "9.5px",
                                                          lineHeight: "8px",
                                                          justifyContent:
                                                            "flex-end",
                                                          paddingRight: "1px",
                                                        }}
                                                      >
                                                        {e?.ActualWeight?.toFixed(
                                                          2
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="">
                                                    <div className="">
                                                      <div
                                                        className="    "
                                                        style={{
                                                          border: "",
                                                          borderRight:
                                                            "1px solid rgb(0, 0, 0)",
                                                          width: "33px",
                                                          height: "14px",
                                                        }}
                                                      ></div>
                                                    </div>
                                                  </div>
                                                </div>
                                              ) : (
                                                <React.Fragment>
                                                  {e?.MasterManagement_DiamondStoneTypeid ===
                                                  5 ? (
                                                    <div className="print2AMidBody">
                                                      <div
                                                        className="print2ARM FIND2A"
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        {e?.LimitedShapeQualityColorCode?.toUpperCase() +
                                                          " " +
                                                          e?.Quality?.toUpperCase() +
                                                          " " +
                                                          e?.ColorName?.toUpperCase()}
                                                      </div>
                                                      <div className="pcswt2A">
                                                        <div className="actualPcsWt2A">
                                                          <div
                                                            className="pcs2A"
                                                            style={{
                                                              fontSize: "10px",
                                                            }}
                                                          >
                                                            {e?.ActualPcs}
                                                          </div>
                                                          <div
                                                            className="pcs2A"
                                                            style={{
                                                              borderRight:
                                                                "0px",
                                                              width: "40px",
                                                              fontSize: "10px",
                                                              lineHeight: "8px",
                                                              justifyContent:
                                                                "flex-end",
                                                              paddingRight:
                                                                "1px",
                                                            }}
                                                          >
                                                            {e?.ActualWeight?.toFixed(
                                                              3
                                                            )}
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="">
                                                        <div className="">
                                                          <div
                                                            className="    "
                                                            style={{
                                                              border: "",
                                                              borderRight:
                                                                "1px solid rgb(0, 0, 0)",
                                                              width: "33px",
                                                              height: "14px",
                                                            }}
                                                          ></div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    <div className="print2AMidBody">

                                                      <div
                                                        className="print2ARM RMW2A lh1Ady"
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        {e?.LimitedShapeQualityColorCode?.toUpperCase()}
                                                      </div>
                                                      <div
                                                        className="sizename2A lh1Ady"
                                                        style={{
                                                          fontSize: "10px",
                                                        }}
                                                      >
                                                        {(e?.Sizename &&
                                                          e?.Sizename !== "" &&
                                                          e?.Sizename?.slice(
                                                            0,
                                                            12
                                                          )) ??
                                                          ""}
                                                      </div>
                                                      <div className="pcswt2A">
                                                        <div className="actualPcsWt2A ">
                                                          <div
                                                            className="pcs2A lh1Ady"
                                                            style={{
                                                              fontSize: "10px",
                                                            }}
                                                          >
                                                            {e?.ActualPcs}
                                                          </div>
                                                          <div
                                                            className="pcs2A lh1Ady"
                                                            style={{
                                                              borderRight:
                                                                "0px",
                                                              width: "40px",
                                                              fontSize: "10px",
                                                              justifyContent:
                                                                "flex-end",
                                                              paddingRight:
                                                                "1px",
                                                            }}
                                                          >
                                                            {e?.ActualWeight?.toFixed(
                                                              2
                                                            )}
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="">
                                                        <div className="">
                                                          <div
                                                            className=""
                                                            style={{
                                                              border: "",
                                                              borderRight:
                                                                "1px solid rgb(0, 0, 0)",
                                                              width: "33px",
                                                              height: "14px",
                                                            }}
                                                          ></div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )}
                                                </React.Fragment>
                                              )}
                                            </React.Fragment>
                                          )}
                                        </React.Fragment>
                                      );
                                    })}
                                    {Array.from(
                                      { length: ele?.length },
                                      (_,iabcd) => {
                                        return (
                                          <React.Fragment key={iabcd}>
                                            {iabcd !== 0 ? (
                                              <div className="print2AMidBody">
                                                <div className="print2ARM RMW2A">
                                                  {e.Shapename ?? ""}
                                                </div>
                                                <div className="sizename2A">
                                                  {e.Sizename ?? ""}
                                                </div>
                                                <div className="pcswt2A">
                                                  <div className="actualPcsWt2A">
                                                    <div className="pcs2A">
                                                      {e?.ActualPcs ?? ""}
                                                    </div>
                                                    <div
                                                      className=""
                                                      style={{
                                                        borderRight: "0px",
                                                        width: "40px",
                                                      }}
                                                    >
                                                      {e?.ActualWeight ?? ""}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="">
                                                  <div className="">
                                                    <div
                                                      className="bordered-div"
                                                      style={{
                                                        width: "33px",
                                                        height: "14px",
                                                        // border: '1px solid black',
                                                        borderRight:
                                                          "1px solid",
                                                        borderBottom:
                                                          "0px solid",
                                                        borderTop: "0px",
                                                      }}
                                                    ></div>
                                                    <div className=""></div>
                                                  </div>
                                                </div>
                                              </div>
                                            ) : (
                                              <div
                                                className="print2AMidBody"
                                                style={{ display: "none" }}
                                              >
                                                <div className="print2ARM RMW2A">
                                                  {e.Shapename ?? ""}
                                                </div>
                                                <div className="sizename2A">
                                                  {e.Sizename ?? ""}
                                                </div>
                                                <div className="pcswt2A">
                                                  <div className="actualPcsWt2A">
                                                    <div className="pcs2A">
                                                      {e?.ActualPcs ?? ""}
                                                    </div>
                                                    <div
                                                      className=""
                                                      style={{
                                                        borderRight: "0px",
                                                        width: "30px",
                                                      }}
                                                    >
                                                      {e?.ActualWeight ?? ""}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="">
                                                  <div className="">
                                                    <div
                                                      className="bordered-div"
                                                      style={{
                                                        width: "33px",
                                                        height: "17px",
                                                        borderRight:
                                                          "1px solid",
                                                        borderBottom:
                                                          "0px solid",
                                                        borderTop: "0px",
                                                      }}
                                                    ></div>
                                                    <div className=""></div>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </React.Fragment>
                                        );
                                      }
                                    )}
                                  </div>
                                  <div>
                                    <span className="fw-bold">
                                      INSTRUCTION :
                                    </span>
                                    <span style={{ color: "red" }}>
                                    {" " + checkInstruction(e?.data?.rd?.officeuse) + " " + checkInstruction(e?.data?.rd?.ProductInstruction)}
                                    </span>
                                  </div>
                                </div>
                                <div
                                  className="barcodeSetPrint2A"
                                  style={{ height: "285px", marginTop: "3px" }}
                                >
                                  <div className="barcodeprint2A">
                                    {e?.data?.rd?.serialjobno !== "" ? (
                                      <BarcodeGenerator
                                        data={e?.data?.rd?.serialjobno}
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <div className="mainbag2A">
                        <div className="print2AStartPart">
                          <div className="print2A_header">
                            <div className="print2A_header_bagInfoPart">
                              <div className="print2A_header_bagInfoPart1">
                                <div
                                  className="print2AJobNo"
                                  style={{ fontSize: "15px" }}
                                >
                                  {e?.data?.rd?.serialjobno}
                                </div>
                                <div className="print2AJobNo">
                                  {e?.data?.rd?.Designcode}
                                </div>
                                <div className="print2AJobNo">
                                  {e?.data?.rd?.MetalType}
                                </div>
                                <div className="print2AJobNo">
                                  {e?.data?.rd?.MetalColorCo}
                                </div>
                              </div>

                              <div className="print2AMaterial">
                                <div className="print2AMaterialCG">
                                  <div className="g2A">CUST.</div>
                                  <div className="custHead2A">
                                    {e?.data?.rd?.CustomerCode}
                                  </div>
                                  <div className="custCode2A">
                                    <b>GOLD</b>
                                  </div>
                                  <div className="cst2A">
                                    <b>DIA</b>
                                  </div>
                                  <div
                                    className="cst2A"
                                    style={{ borderRight: "0px" }}
                                  >
                                    <b>CST</b>
                                  </div>
                                </div>
                                <div className="print2AMaterialCG">
                                  <div className="g2A">SIZE</div>
                                  <div className="custHead2A">
                                    {e?.data?.rd?.Size}
                                  </div>
                                  <div className="custCode2A">
                                    {e?.data?.rd?.MetalWeight?.toFixed(3)}
                                  </div>
                                  <div className="cst2A">
                                    {e?.additional?.dia?.ActualPcs}/
                                    {e?.additional?.dia?.ActualWeight?.toFixed(
                                      3
                                    )}
                                  </div>
                                  <div
                                    className="cst2A"
                                    style={{ borderRight: "0px" }}
                                  >
                                    {e?.additional?.clr?.ActualPcs}/
                                    {e?.additional?.clr?.ActualWeight?.toFixed(
                                      3
                                    )}
                                  </div>
                                </div>
                                <div className="print2AMaterialCG">
                                  <div
                                    className="g2A"
                                    style={{ width: "37px" }}
                                  >
                                    PO
                                  </div>
                                  <div
                                    className="custHead2A"
                                    style={{ width: "100px" }}
                                  >
                                    {e?.data?.rd?.PO}
                                  </div>
                                  <div className="cst2A">
                                    <b>BAG DT</b>
                                  </div>
                                  <div
                                    className="cst2A"
                                    style={{ borderRight: "0px" }}
                                  >
                                    {e?.data?.rd?.OrderDate}
                                  </div>
                                </div>
                                
                              </div>
                            </div>
                            <div className="print2A_header_bagImgPart2">
                              <img
                                src={
                                  e?.additional?.img !== ""
                                    ? e?.additional?.img
                                    : require("../../assets/img/default.jpg")
                                }
                                id="print2AImg"
                                alt=""
                                onError={(e) => handleImageError(e)}
                                loading="eager"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="print2AtableBarcode">
                          <div className="midpart2A">
                            <div className="print2AMiddlePart">
                              <div className="print2AMidHead">
                                <div
                                  className="print2ARM"
                                  style={{ width: "104px" }}
                                >
                                  <b>RM CODE</b>
                                </div>
                                <div
                                  className="sizename2A"
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    fontSize: "14px",
                                    width: "69px",
                                  }}
                                >
                                  <b>RM SIZE</b>
                                </div>
                                <div className="actual2Aflex">
                                  <div className="whA2A">ACTUAL</div>
                                  <div className="child2A">
                                    <p className="pcswtSet2A">PCS</p>
                                    <p
                                      style={{
                                        fontSize: "12px",
                                        paddingTop: "0px",
                                      }}
                                    >
                                      WT
                                    </p>
                                  </div>
                                </div>
                                <div
                                  className="actual2Aflex"
                                  style={{ borderRight: "0px" }}
                                >
                                  <div className="whA2A">ISSUE</div>
                                  <div className="child2A">
                                    <p className="pcswtSet2A">PCS</p>
                                    <p
                                      style={{
                                        fontSize: "12px",
                                        paddingTop: "0px",
                                      }}
                                    >
                                      WT
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {Array.from({ length: 15 }, (_,iad) => {
                                return (
                                  <div className="print2AMidBody" key={iad}>
                                    <div className="print2ARM RMW2A">
                                      {e.Shapename ?? ""}
                                    </div>
                                    <div className="sizename2A">
                                      {e.Sizename ?? ""}
                                    </div>
                                    <div className="pcswt2A">
                                      <div className="actualPcsWt2A">
                                        <div className="pcs2A">
                                          {e?.ActualPcs ?? ""}
                                        </div>
                                        <div
                                          className=""
                                          style={{
                                            borderRight: "0px",
                                            width: "30px",
                                          }}
                                        >
                                          {e?.ActualWeight ?? ""}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="">
                                      <div className="">
                                        <div
                                          className="bordered-div"
                                          style={{
                                            width: "33px",
                                            height: "17px",
                                            borderRight: "1px solid",
                                            borderBottom: "0px solid",
                                            borderTop: "0px",
                                          }}
                                        ></div>
                                        <div className=""></div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div>
                              <span className="fw-bold">INSTRUCTION :</span>
                              <span style={{ color: "red" }}>
                              {checkInstruction(e?.data?.rd?.officeuse) + " " + checkInstruction(e?.data?.rd?.ProductInstruction)}
                              </span>
                            </div>
                          </div>
                          <div className="barcodeSetPrint2A">
                            <div className="barcodeprint2A">
                              {e?.data?.rd?.length !== 0 &&
                                e?.data?.rd !== undefined && (
                                  <>
                                    {e?.data?.rd?.serialjobno !== undefined && (
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
                    )}
                  </React.Fragment>
                );
              })}
          </div>
        </>
      )}
    </>
  );
}

export default BagPrint2A;
