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
  const chunkSize7 = 35;
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
            Sizename: "C TOTAL",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 4,
          };
          let dia = {
            Shapename: "TOTAL",
            Sizename: "D TOTAL",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 3,
          };
          let misc = {
            Shapename: "TOTAL",
            Sizename: "MISC TOTAL",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 7,
          };
          let f = {
            Shapename: "TOTAL",
            Sizename: "F TOTAL",
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
          let DLIST = [...DiamondList];
          let CLIST = [...ColorStoneList];
          let MLIST = [...MiscList];
          let FLIST = [...FindingList];
          let Dlist2 = DLIST?.filter((e) => e?.Shapename !== 'TOTAL');
          let Clist2 = CLIST?.filter((e) => e?.Shapename !== 'TOTAL');
          let Mlist2 = MLIST?.filter((e) => e?.Shapename !== 'TOTAL');
          let Flist2 = FLIST?.filter((e) => e?.Shapename !== 'TOTAL');
          
          const groupedDiaData = Dlist2?.reduce((acc, obj) => {
            const key = `${obj.Shapecode}-${obj.QualityCode}-${obj.ColorCode}`;
            
            if (!acc[key]) {
              acc[key] = { Shapecode: obj.Shapecode, QualityCode: obj.QualityCode, ColorCode: obj.ColorCode };
            }
            return acc;
          }, {});
          
          const DIAgrouArr = Object.values(groupedDiaData);
          const groupedCLSData = Clist2?.reduce((acc, obj) => {
            const key = `${obj.Shapecode}-${obj.QualityCode}-${obj.ColorCode}`;
            if (!acc[key]) {
              acc[key] = { Shapecode: obj.Shapecode, QualityCode: obj.QualityCode, ColorCode: obj.ColorCode };
            }
            return acc;
          }, {});
          const CLSgrouArr = Object.values(groupedCLSData);

          const groupedMISCData = Mlist2?.reduce((acc, obj) => {
            const key = `${obj.Shapecode}-${obj.QualityCode}-${obj.ColorCode}`;
            if (!acc[key]) {
              acc[key] = { Shapecode: obj.Shapecode, QualityCode: obj.QualityCode, ColorCode: obj.ColorCode };
            }
            return acc;
          }, {});
          const MISCgrouArr = Object.values(groupedMISCData);

          const groupedFData = Flist2?.reduce((acc, obj) => {
            const key = `${obj.Shapecode}-${obj.QualityCode}-${obj.ColorCode}`;
            if (!acc[key]) {
              acc[key] = { Shapecode: obj.Shapecode, QualityCode: obj.QualityCode, ColorCode: obj.ColorCode };
            }
            return acc;
          }, {});
          // eslint-disable-next-line no-unused-vars
          const FgrouArr = Object.values(groupedFData);
          

          let allMaterials = [...DIAgrouArr, ...CLSgrouArr, ...MISCgrouArr];
          
          let arr = [];
          let mainArr = arr?.concat(
            DiamondList,
            ColorStoneList,
            MiscList,
            // FindingList
          );
          let imagePath = queryParams?.imagepath;
          imagePath = atob(queryParams?.imagepath);
          let img = imagePath + a?.rd?.ThumbImagePath;
            let chunkData =  GetChunkData(chunkSize7, mainArr)
            let chunkDatas = allMaterials?.slice(0, 7);
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
              page: mainArr,
              material:chunkDatas
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
                                <div  style={{
                                    backgroundColor: `${e?.data?.rd?.prioritycolorcode}`,
                                  }}>
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
                                    DgN: <b>{e?.data?.rd?.Designcode}</b>
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
                                  <div className="pe-1">({e?.data?.rd?.Quantity})Pcs</div>
                                </div>
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
                                    height: "22px",
                                  }}
                                >
                                  {e?.data?.rd?.MetalType}{" "}
                                  {e?.data?.rd?.MetalColorCo}
                                </div>
                              </div>
                            </div>
                            <div className="main7A">
                              <div className="main7AEntry">
                                <div className="divide7A">
                                  <div className="tableHead7A">
                                    <div
                                      className="type7A"
                                      style={{height:"11px"}}
                                    >
                                      <p
                                        className="w7A"
                                        style={{ width: "82px" }}
                                      > 
                                        <b>Type</b>
                                      </p>
                                      <p
                                        className="w7A"
                                        style={{ width: "82px" }}
                                      >
                                        <b>Purity</b>
                                      </p>
                                      <p
                                        className="w7A"
                                        style={{ width: "80px" }}
                                      >
                                        <b>Color</b>
                                      </p>
                         
                                    </div>
                                  </div>
                      
                                </div>
                                <div className="divide7A">
                                  <div>
                                    {
                                      e?.additional?.material?.length > 0 &&
                                      e?.additional?.material?.map((e, i) => {
                                        return(
                                          <React.Fragment key={i}>
                                            {
                                              e?.Shapename === "TOTAL" ? '' : <div className="tableHead7A">
                                              <div className="w7A d-flex justify-content-start align-items-center" style={{width:"82px", paddingLeft:"1px"}}>{e?.Shapecode}</div>
                                              <div className="w7A d-flex justify-content-start align-items-center" style={{width:"82px", paddingLeft:"1px"}}>{e?.QualityCode}</div>
                                              <div className="w7A d-flex justify-content-start align-items-center" style={{width:"80px",paddingLeft:"1px"}}>{e?.ColorCode}</div>
                                            </div>
                                            }
                                          </React.Fragment>
                                        )
                                      })
                                    }
                                  </div>
                                  
                                </div>
                                <div className="d-flex">
                                  <div>
                                    <div
                                      className="tableHead7B"
                                      
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
                                        <div className="dept7AD w7A70">WAX</div>
                                        <div className="dept7AD w7A70">CAS</div>
                                        <div className="dept7AD w7A70">In Wt</div>
                                        <div className="dept7AD w7A70">GRNDING</div>
                                        <div className="dept7AD w7A70">BUFFING</div>
                                        <div className="dept7AD w7A70">PRE POLI</div>
                                        <div className="dept7AD w7A70">SETTING</div>
                                        <div className="dept7AD w7A70">MTL FSH</div>
                                        <div className="dept7AD w7A70">F POLISH</div>
                                        <div className="dept7AD w7A70"  style={{borderBottom:"0px"}}>RHODIUM</div>
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
                                    <div
                              className="tableHead7B"
                              style={{
                                fontWeight: "bold",
                              }}
                            >
                              <div
                                className="dept7A fs7A"
                                style={{ width: "63px" }}
                              >
                                Gr. Wt{" "}
                              </div>
                              <div className="dept7A fs7A" style={{ width: "63px" }}>Chaki Post</div>
                              <div className="dept7A fs7A" style={{ width: "63px" }}>Taar</div>
                              <div className="dept7A fs7A" style={{ width: "63px" }}>Extra Metal</div>
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
                              <div className="dept7A" style={{ width: "63px" }}></div>
                              <div className="dept7A" style={{ width: "63px" }}></div>
                              <div className="dept7A" style={{ width: "63px" }}></div>
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
                                {" " + (e?.data?.rd?.ProductInstruction?.length > 0 ? checkInstruction(e?.data?.rd?.ProductInstruction) : checkInstruction(e?.data?.rd?.QuoteRemark))}
                              </b>
                              
                            </div>
                                  </div>

                                </div>
                              </div>
                              <div className="main7AEntry2">
                                        <div className="w-100 d-flex justify-content-between align-items-center sizehead7A fw-bold">
                                          <div className="spw7A" style={{width: "54px"}}>Size</div>
                                          <div className="spw7A" style={{width: "30px"}}>Pcs</div>
                                          <div className="spw7A" style={{width: "24px", borderRight:"0px"}}>Wt</div>
                                        </div>
                                        <div>
                                          {
                                            ele?.data?.map((e, i) => {
                                              return(
                                                <div className="w-100 d-flex justify-content-between align-items-center sizehead7A" key={i}>
                                                 { e?.Sizename.includes("TOTAL") ? <div className="spw7AD d-flex justify-content-start align-items-center fw-bold" style={{width: "54px", paddingLeft:"1px"}}>{e?.Sizename}</div> : <div className="spw7AD d-flex justify-content-start align-items-center" style={{width: "54px", paddingLeft:"1px"}}>{e?.Sizename}</div> } 
                                                 { e?.Sizename.includes("TOTAL") ? <div className="spw7AD d-flex justify-content-end align-items-center fw-bold" style={{width: "30px", paddingRight:"1px"}}>{e?.ActualPcs}</div> : <div className="spw7AD d-flex justify-content-end align-items-center" style={{width: "30px", paddingRight:"1px"}}>{e?.ActualPcs}</div> } 
                                                  <div className="spw7AD" style={{width: "24px", borderRight:"0px"}}></div>
                                                </div>
                                              )
                                            })
                                          }
                                        </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="container7A">
                        <div className="head7A">
                          <div className="head7AjobInfo">
                            <div   style={{
                                backgroundColor: `${e?.data?.rd?.prioritycolorcode}`,
                              }}>
                            <div className="head7AjobInfoJobNO">
                              <div>Ord. : {e?.data?.rd?.orderDatef ?? ""}</div>
                              <div>Due : {e?.data?.rd?.promiseDatef ?? ""}</div>
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
                            <div className="party7A" >
                              <div>Size: {e?.data?.rd?.Size}</div>
                              <div className="pe-1">({e?.data?.rd?.Quantity})Pcs</div>
                            </div>
                            </div>

                            <div className="mat7AInfo">
                              <div className="pcswt7AH">
                                <div className="net7A">
                                  <b>Net Wt.</b>
                                </div>
                                <div className="net7A justify-content-end pe-1">
                                  {e?.data?.rd?.netwt?.toFixed(3)}
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
                            <div className="d-flex justify-content-between align-items-center dup7Aemt" style={{paddingTop:"1px"}}>
                              <div className="w7A" style={{width:"82px", fontSize:"9px"}}>Type</div>
                              <div className="w7A" style={{width:"82px", fontSize:"9px"}}>Purity</div>
                              <div className="w7A" style={{width:"80px", fontSize:"9px"}}>Color</div>
                            </div>
                            <div className="tableHead7B">
                              <div className="dept7A" style={{ width: "62px" }}>
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
                                <div className="dept7AD w7A70">WAX</div>
                                <div className="dept7AD w7A70">CAS</div>
                                <div className="dept7AD w7A70">In Wt</div>
                                <div className="dept7AD w7A70">GRNDING</div>
                                <div className="dept7AD w7A70">BUFFING</div>
                                <div className="dept7AD w7A70">PRE POLI</div>
                                <div className="dept7AD w7A70">SETTING</div>
                                <div className="dept7AD w7A70">MTL FSH</div>
                                <div className="dept7AD w7A70">F POLISH</div>
                                <div className="dept7AD w7A70" style={{borderBottom:"0px"}}>RHODIUM</div>
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
                            <div
                          className="tableHead7B"
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          <div
                            className="dept7A fs7A"
                            style={{ width: "63px" }}
                          >
                            Gr. Wt{" "}
                          </div>
                          <div className="dept7A fs7A" style={{ width: "63px" }}>Chaki Post</div>
                          <div className="dept7A fs7A" style={{ width: "63px" }}>Taar</div>
                          <div className="dept7A fs7A" style={{ width: "63px" }}>Extra Metal</div>
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
                          <div className="dept7A" style={{ width: "63px" }}></div>
                          <div className="dept7A" style={{ width: "63px" }}></div>
                          <div className="dept7A" style={{ width: "63px" }}></div>
                          <div
                            className="dept7A"
                            style={{ borderRight: "0px" }}
                          ></div>
                        </div>
                        <div className="footer7A">
                          <b>
                            {}
                            Remark:{" "}
                            {" " +(e?.data?.rd?.ProductInstruction?.length > 0 ? checkInstruction(e?.data?.rd?.ProductInstruction) : checkInstruction(e?.data?.rd?.QuoteRemark))}
                          </b>
                        </div>
                          </div>
                          <div className="main7AEntry2">
                            <div className="d-flex justify-content-between align-items-center fw-bold" style={{height:"11px",width:"110px", paddingTop:"3px",borderBottom:"1px solid #989898"}}>
                              <div  className="w7A"
                                        style={{ width: "54px", fontSize:"9px" }}>Size</div>
                              <div  className="w7A"
                                        style={{ width: "30px", fontSize:"9px" }}>Pcs</div>
                              <div  className="w7A"
                                        style={{ width: "25px", fontSize:"9px" }}>Wt</div>
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
};

export default BagPrint7A;
