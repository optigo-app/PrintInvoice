import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/bagprint/print7A.css";
import { GetData } from "../../GlobalFunctions/GetData";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import BarcodeGenerator from "../../components/BarcodeGenerator";
import Loader from "../../components/Loader";
import { organizeData } from "../../GlobalFunctions/OrganizeBagPrintData";
import { GetUniquejob } from "../../GlobalFunctions/GetUniqueJob";
import { checkInstruction } from "../../GlobalFunctions";
import { GetChunkData } from "../../GlobalFunctions/GetChunkData";
const BagPrint7A = ({ queries, headers }) => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const resultString = GetUniquejob(queryParams?.str_srjobno);
  const chunkSize7 = 6;
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

        // eslint-disable-next-line array-callback-return
        datas?.map((a) => {
  
          let length = 0;
          let clr = {
            Shapename: "TOTAL",
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 4,
          };
          let dia = {
            Shapename: "TOTAL",
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 3,
          };
          let misc = {
            Shapename: "TOTAL",
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 7,
          };
          let f = {
            Shapename: "TOTAL",
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 5,
          };
          let DiamondList = [];
          let ColorStoneList = [];
          let MiscList = [];
          let FindingList = [];
          // eslint-disable-next-line array-callback-return
          a?.rd1?.map((e, i) => {
            if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
              length++;
            }
            if (e?.MasterManagement_DiamondStoneTypeid === 3) {
              DiamondList.push(e);
              dia.ActualPcs = dia.ActualPcs + e?.ActualPcs;
              dia.ActualWeight = dia.ActualWeight + e?.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
              ColorStoneList.push(e);
              clr.ActualPcs = clr.ActualPcs + e?.ActualPcs;
              clr.ActualWeight = clr.ActualWeight + e?.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 5) {
              FindingList.push(e);
              f.ActualPcs = f.ActualPcs + e?.ActualPcs;
              f.ActualWeight = f.ActualWeight + e?.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
              MiscList.push(e);
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
          if(dia.ActualPcs !== 0 && dia.ActualWeight !== 0){
            DiamondList.push(dia);
          }
          if(clr.ActualPcs !== 0 && clr.ActualWeight !== 0){
            ColorStoneList.push(clr);
          }
          if(f.ActualPcs !== 0 && f.ActualWeight !== 0){
            FindingList.push(f);
          }
          if(misc.ActualPcs !== 0 && misc.ActualWeight !== 0){
            MiscList.push(misc);
          }  

          let arr = [];
          let mainArr = arr?.concat(
            DiamondList,
            ColorStoneList,
            MiscList,
            FindingList
          );
          let imagePath = queryParams?.imagepath;
          imagePath = atob(queryParams?.imagepath);
          let img = imagePath + a?.rd?.ThumbImagePath;
            let chunkData =  GetChunkData(chunkSize7, mainArr)
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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

          <div className="print7A pad_60_allPrint">
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
                      e?.additional?.pages?.map((ele, ind) => {
                        return (
                          <div className="container7A" key={ind}>
                            <div className="head7A">
                              <div className="head7AjobInfo">
                                <div
                                  className="head7AjobInfoJobNO"
                                  style={{
                                    backgroundColor: `${e?.data?.rd?.prioritycolorcode}`,
                                  }}
                                >
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
                                <div
                                  className="party7A"
                                  style={{
                                    backgroundColor: `${e?.data?.rd?.prioritycolorcode}`,
                                  }}
                                >
                                  <div>
                                    Party: <b>{e?.data?.rd?.CustomerCode}</b>
                                  </div>
                                  <div style={{ paddingBottom: "4px" }}>
                                    Ord No. : <b>{e?.data?.rd?.OrderNo}</b>
                                  </div>
                                </div>
                                <div
                                  className="party7A"
                                  style={{
                                    backgroundColor: `${e?.data?.rd?.prioritycolorcode}`,
                                  }}
                                >
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
                                <div
                                  className="party7A"
                                  style={{
                                    backgroundColor: `${e?.data?.rd?.prioritycolorcode}`,
                                  }}
                                >
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
                                      {e?.data?.rd?.ActualGrossweight?.toFixed(
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
                                      {e?.additional?.dia?.ActualWeight?.toFixed(
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
                                      {e?.additional?.clr?.ActualWeight?.toFixed(
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
                                      Array.from(
                                        { length: ele?.length },
                                        (_, index) => (
                                       
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
                
                                    }
                                  </div>
                                  <div className="size7AHeight">
                                   
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
                                {" " + checkInstruction(e?.data?.rd?.officeuse) + " " + checkInstruction(e?.data?.rd?.ProductInstruction)}
                              </b>
                              
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="container7A">
                        <div className="head7A">
                      
                          <div className="head7AjobInfo">
                            <div
                              className="head7AjobInfoJobNO"
                              style={{
                                backgroundColor: `${e?.data?.rd?.prioritycolorcode}`,
                              }}
                            >
                              <div>Ord. : {e?.data?.rd?.orderDatef ?? ""}</div>
                              <div>Due : {e?.data?.rd?.promiseDatef ?? ""}</div>
                              <div>
                                <b>{e?.data?.rd?.serialjobno}</b>
                              </div>
                            </div>
                            <div
                              className="party7A"
                              style={{
                                backgroundColor: `${e?.data?.rd?.prioritycolorcode}`,
                              }}
                            >
                              <div>
                                Party: <b>{e?.data?.rd?.CustomerCode}</b>
                              </div>
                              <div style={{ paddingBottom: "4px" }}>
                                Ord No. : <b>{e?.data?.rd?.OrderNo}</b>
                              </div>
                            </div>
                            <div
                              className="party7A"
                              style={{
                                backgroundColor: `${e?.data?.rd?.prioritycolorcode}`,
                              }}
                            >
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
                            <div
                              className="party7A"
                              style={{
                                backgroundColor: `${e?.data?.rd?.prioritycolorcode}`,
                              }}
                            >
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
                                  {e?.data?.rd?.ActualGrossweight.toFixed(3)}
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
                                  {e?.additional?.dia?.ActualWeight.toFixed(3)}
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
                                  {e?.additional?.clr?.ActualWeight.toFixed(3)}
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
                                  {e?.additional?.misc?.ActualWeight.toFixed(3)}
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
                        </div>
                        <div className="main7A">
                          <div className="main7AEntry">
                            <div className="d-flex justify-content-between align-items-center dup7Aemt">
                              <div className="w7A">Type</div>
                              <div className="w7A">Purity</div>
                              <div className="w7A">Color</div>
                              <div className="w7A">Size</div>
                              <div className="w7A">Pcs</div>
                              <div className="w7A">Wt</div>
                            </div>
                            {Array.from({ length: 5 }, (_, index) => (
                              <div className="d-flex" key={index}>
                                <div className="w7AD "></div>
                                <div className="w7AD "></div>
                                <div className="w7AD "></div>
                                <div className="w7AD "></div>
                                <div className="w7AD "></div>
                                <div className="w7AD "></div>
                              </div>
                            ))}
                            <div
                              className="tableHead7A"
                              style={{ borderBottom: "1px solid #989898" }}
                            >
                   
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
                            {" " + checkInstruction(e?.data?.rd?.officeuse) + " " + checkInstruction(e?.data?.rd?.ProductInstruction)}
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
