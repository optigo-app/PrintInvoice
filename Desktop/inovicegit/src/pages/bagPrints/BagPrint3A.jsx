import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import "../../assets/css/bagprint/print3A.css";
import BarcodeGenerator from '../../components/BarcodeGenerator';
import Loader from '../../components/LoaderBag';
import { GetData } from '../../GlobalFunctions/GetData';
import { GetChunkData } from '../../GlobalFunctions/GetChunkData';
import { formatDate } from '../../GlobalFunctions/DateFormat';
import { handleImageError } from '../../GlobalFunctions/HandleImageError';
const BagPrint3A = ({ queries, headers }) => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  let jobs = queryParams.str_srjobno;
  if (Object.keys(queryParams).length !== 0) {
    jobs = jobs.split(",");
  }
  const [print, setPrint] = useState(jobs);
  const chunkSize13 = 13;
  // const handleImageError = (e) => {
  //   e.target.src = require('../../assets/images/default.jpg');
  // };
  useEffect(() => {
    if (Object.keys(queryParams).length !== 0) {
      atob(queryParams.imagepath);
    }
    const fetchData = async () => {
      try {
        const responseData = [];
        for (let url in print) {
          let chunkData = [];
          const obj = {
            jobno: print[url],
            custid: queries.custid,
            printname: queries.printname,
            appuserid: queries.appuserid,
            url: queries.url,
            headers: headers,
          };

          let datas = await GetData(obj);
          const orderDatef = formatDate(datas?.rd[0]?.OrderDate);
          const promiseDatef = formatDate(datas?.rd[0]?.promisedate);

          datas?.rd?.map((e) => {
            e.orderDatef = orderDatef;
            e.promiseDatef = promiseDatef;
            // 
          });
          // let p_tag = { "SerialJobno": `${print[url]}`, "customerid": `${queries.custid}`, "BagPrintName": `${queries.printname}` };
          // let jsonString = JSON.stringify(p_tag);
          // let base64String = btoa(jsonString);
          // let Body = {
          //   "con": `{\"id\":\"\",\"mode\":\"${queries.printname}\",\"appuserid\":\"${queries.appuserid}\"}`,
          //   "p": `${base64String}`,
          //   "f": `${queries.appuserid} ${queries.printname}`
          // };
          // let urls = atob(queries.url);
          // const response = await axios.post(urls, Body, { headers: headers });
          // let datas = JSON.parse(response.data.d);


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
          //arr for colorstone
          let ArrofSevenSize = [];
          let ArrofFiveSize = [];
          let ArrofMISize = [];
          let ArrofFSize = [];

          datas.rd1.map((e, i) => {
            if (e.ConcatedFullShapeQualityColorCode !== "- - - ") {
              length++;
            }
            if (e.MasterManagement_DiamondStoneTypeid === 3) {
              ArrofSevenSize.push(e);
              // ArrofSevenSize[0].heading = "DIAMOND DETAIL";
              dia.ActualPcs = dia.ActualPcs + e.ActualPcs;
              dia.ActualWeight = dia.ActualWeight + e.ActualWeight;
            } else if (e.MasterManagement_DiamondStoneTypeid === 4) {
              ArrofFiveSize.push(e);
              // ArrofFiveSize[0].heading = "COLOR STONE DETAIL";
              clr.ActualPcs = clr.ActualPcs + e.ActualPcs;
              clr.ActualWeight = clr.ActualWeight + e.ActualWeight;
            } else if (e.MasterManagement_DiamondStoneTypeid === 5) {
              ArrofFSize.push(e);
              // ArrofFSize[0].heading = "FINDING DETAIL";
              f.ActualPcs = f.ActualPcs + e.ActualPcs;
              f.ActualWeight = f.ActualWeight + e.ActualWeight;
            } else if (e.MasterManagement_DiamondStoneTypeid === 7) {
              ArrofMISize.push(e);
              // ArrofMISize[0].heading = "MISC DETAIL";
              misc.ActualPcs = misc.ActualPcs + e.ActualPcs;
              misc.ActualWeight = misc.ActualWeight + e.ActualWeight;
            }
          });
          dia.ActualPcs = +(dia.ActualPcs.toFixed(3));
          dia.ActualWeight = +(dia.ActualWeight.toFixed(3));
          clr.ActualPcs = +(clr.ActualPcs.toFixed(3));
          clr.ActualWeight = +(clr.ActualWeight.toFixed(3));
          misc.ActualPcs = +(misc.ActualPcs.toFixed(3));
          misc.ActualWeight = +(misc.ActualWeight.toFixed(3));
          f.ActualPcs = +(f.ActualPcs.toFixed(3));
          f.ActualWeight = +(f.ActualWeight.toFixed(3));

          ArrofSevenSize.push(dia);
          ArrofFiveSize.push(clr);
          ArrofFSize.push(f);
          ArrofMISize.push(misc);

          ArrofSevenSize.map((e) => {
            if (e.ActualPcs === 0 && e.ActualWeight === 0) {
              ArrofSevenSize = [];
            } else {
              e.heading = "DIAMOND DETAIL";
            }
          }
          );
          ArrofFiveSize.map((e) => {
            if (e.ActualPcs === 0 && e.ActualWeight === 0) {
              ArrofFiveSize = [];
            } else {
              e.heading = "COLOR STONE DETAIL";
            }
          }
          );
          ArrofMISize.map((e) => {
            if (e.ActualPcs === 0 && e.ActualWeight === 0) {
              ArrofMISize = [];
            } else {
              e.heading = "MISC DETAIL";
            }
          }
          );
          ArrofFSize.map((e) => {
            if (e.ActualPcs === 0 && e.ActualWeight === 0) {
              ArrofFSize = [];
            } else {
              e.heading = "FINDING DETAIL";
            }
          }
          );
          let arr = [];
          // let mainArr = arr.concat(ArrofSevenSize, ArrofFiveSize, ArrofMISize, ArrofFSize);
          let mainArr = arr.concat(ArrofSevenSize, ArrofFiveSize, ArrofMISize);
          let imagePath = queryParams?.imagepath;
          imagePath = atob(queryParams.imagepath);


          let img = imagePath + datas?.rd[0]?.ThumbImagePath;
          let arrofchunk = GetChunkData(chunkSize13, mainArr);
          // for (let i = 0; i < mainArr.length; i += chunkSize13) {
          //   const chunks = mainArr.slice(i, i + chunkSize13);
          //   let len = 13 - (mainArr.slice(i, i + chunkSize13)).length;
          //   chunkData.push({ data: chunks, length: len });
          // }
          responseData.push({ data: datas, additional: { length: length, clr: clr, dia: dia, f: f, img: img, misc: misc, pages: arrofchunk } });

        }
        setData(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  function handlePrint(e) {
    e.preventDefault();
    window.print();
  }

  useEffect(() => {
    if (data.length !== 0) {
      setTimeout(() => {
        window.print();
      }, 5000);
    }

  }, [data]);

  return (
    <>
      {
        data.length === 0 ? <Loader /> : <><div className="print_btn"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
          Print
        </button></div>

          <div className='job3Aflex'>
            <div className='print3A'>
              {Array.from({ length: queries.pageStart }, (_, index) => (
                index > 0 && <div key={index} className="container_3A" style={{ border: "0px" }}></div>
              ))}
              {
                data.length > 0 && data.map((e, i) => {
                  return (
                    <>
                      {
                        e?.additional?.pages?.length > 0 ? e?.additional?.pages?.map((ele, i) => {
                          return (
                            <>
                              <div className='container_3A'>
                                <div className='header3A'>
                                  <div className='header3ADesc'>
                                    <div className='jobno3A' style={{ height: "20px", display: "flex", alignItems: "center" }}><p className='job3Ahead'>{e?.data?.rd[0]?.serialjobno}</p><p className='job3Ahead'>{e?.data?.rd[0]?.Designcode}</p><p className='job3Ahead' style={{ marginRight: "3px" }}>{e?.data?.rd[0]?.MetalType} {e?.data?.rd[0]?.MetalColorCo}</p></div>
                                    <div className='info3A'>
                                      <p className='info3Acust hw3A'>Cust.</p>
                                      <p className='info3Acust hw3A' ><b>{e?.data?.rd[0]?.CustomerCode}</b></p>
                                      <p className='info3Acust hw3Asr'>Sales Rep.</p>
                                      <p className='info3Acust hw3Asr' style={{ borderRight: "0px" }}>{e?.data?.rd[0]?.SalesrepCode}</p>
                                    </div>
                                    <div className='info3A'>
                                      <p className='info3Acust hw3A' >SIZE</p>
                                      <p className='info3Acust hw3A' ><b>{e?.data?.rd[0]?.Size}</b></p>
                                      <p className='info3Acust hw3Asr' >PO</p>
                                      <p className='info3Acust hw3Asr' style={{ borderRight: "0px" }}>{e?.data?.rd[0]?.PO}</p>
                                    </div>
                                    <div className='info3A'>
                                      <p className='info3Acust hw3AD' >Order</p>
                                      {/* <p className='info3Acust hw3AD' ><b style={{ fontSize: "9.5px" }}>{e?.data?.rd[0]?.OrderDate?.replace(/\s+/g, "")?.slice(0, 12)}</b></p> */}
                                      <p className='info3Acust hw3AD' ><b style={{ fontSize: "9.5px" }}>{e?.data?.rd[0]?.orderDatef?.replace(/\s+/g, "")?.slice(0, 12)}</b></p>
                                      <p className='info3Acust hw3Asr' style={{ width: "50px" }}><b>Metal</b></p>
                                      <p className='info3Acust hw3Asr dia3Acss'><b className='dia3Acss'>Dia.</b></p>
                                      <p className='info3Acust hw3Asr dia3Acss' style={{ borderRight: "0px" }}><b className='dia3Acss'>CST</b></p>
                                    </div>
                                    <div className='info3A'>
                                      <p className='info3Acust hw3AD' >Promise</p>
                                      {/* <p className='info3Acust hw3AD' style={{ fontSize: "8.5px" }}>{(e?.data?.rd[0]?.promisedate)?.replace(/\s+/g, "")?.slice(0, 12)}</p> */}
                                      <p className='info3Acust hw3AD' style={{ fontSize: "8.5px" }}>{(e?.data?.rd[0]?.promiseDatef)?.replace(/\s+/g, "")?.slice(0, 12)}</p>
                                      <p className='info3Acust hw3Asr' style={{ width: "50px" }}>{e?.data?.rd[0]?.MetalWeight?.toFixed(3)}</p>
                                      <p className='info3Acust hw3Asr dia3Acss'>{e?.additional?.dia?.ActualPcs}/{e?.additional?.dia?.ActualWeight.toFixed(2)}</p>
                                      <p className='info3Acust hw3Asr dia3Acss' style={{ borderRight: "0px" }}>{e?.additional?.clr?.ActualPcs}/{e?.additional?.clr?.ActualWeight.toFixed(2)}</p>
                                    </div>
                                    <div className='info3A' style={{ borderBottom: "0px" }}>
                                      <p className='info3Acust hw3AD' >FG By</p>
                                      <p className='info3Acust hw3AD' ><b></b></p>
                                      <p className='info3Acust hw3Asr' >Delivery</p>
                                      <p className='info3Acust hw3Asr' ><b></b></p>
                                      <p className='info3Acust hw3Asr' style={{ borderRight: "0px" }}><b></b></p>
                                    </div>
                                  </div>
                                  <div className='imgBox3A'><img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} id="img3A" alt="" onError={e => handleImageError(e)} loading="eager"  /></div>
                                </div>
                                <div className='Ins3A' style={{ color: "red", display: "flex" }}><p style={{ fontSize: "12px" }}>Instruction :{((e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction)?.length > 0 ? ((e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction) == (null || 'null') ? '' : (e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction))?.slice(0, 115) : '')}</p></div>
                                <div className='enteryBarcode3A'>
                                  <div className='enteryBarcode3ADyn'>
                                    <div className='entry3AHead'>
                                      <div className='rmcode3a' style={{ width: "109px" }}>RM CODE</div>
                                      <div className='rmcode3a' style={{ width: "78px" }}>RM SIZE</div>
                                      <div className='rmcode3a' style={{ width: "80px" }}>ACTUAL</div>
                                      <div className='rmcode3a' style={{ borderRight: "0px", width: "43px" }}>ISSUE</div>
                                    </div>
                                    {
                                      ele?.data.map((a, i) => {

                                        return (
                                          <>
                                            <div className='entry3AHead' style={{ fontWeight: "normal", lineHeight: "8px" }} key={i}>
                                              {/* {a.Shapename === "TOTAL" ? <div className='rmcode3a' style={{ width: '109px' }}><b>{a.Shapename}</b></div> : <div className='rmcode3a' style={{ width: '109px' }}>{a.Shapename}</div>} */}
                                              {a.Shapename === "TOTAL" ? <div className='rmcode3a' style={{ width: '109px', justifyContent: "flex-start" }}><b>{a.Shapename}</b></div> : <div className='rmcode3a code3Acss' style={{ width: '109px' }}>{a?.LimitedShapeQualityColorCode}</div>}
                                              <div className='rmcode3a' style={{ width: '78px', justifyContent: "flex-start", paddingLeft: "2px", lineHeight: "8px" }}>{a.Sizename}</div>
                                              {a.Shapename === "TOTAL" ? <div className='rmcode3a' style={{ width: '35px' }}><b>{a.ActualPcs}</b></div> : <div className='rmcode3a' style={{ width: '35px' }}>{a.ActualPcs}</div>}
                                              {a.Shapename === "TOTAL" ? <div className='rmcode3a' style={{ width: '45px' }}><b>{a.ActualWeight.toFixed(3)}</b></div> : <div className='rmcode3a' style={{ width: '45px' }}>{a.ActualWeight.toFixed(3)}</div>}
                                              <div className='rmcode3a' style={{ width: '21px' }}></div>
                                              <div className='rmcode3a' style={{ borderRight: '0px', width: '21px' }}></div>
                                            </div>
                                          </>
                                        );
                                      })
                                    }
                                    {
                                      Array.from({ length: ele?.length }, (_, index) => (
                                        <div className='entry3AHead' style={{ fontWeight: "normal", lineHeight: "8px" }} key={index}>
                                          <div className='rmcode3a' style={{ width: '109px' }}></div>
                                          <div className='rmcode3a' style={{ width: '78px' }}></div>
                                          <div className='rmcode3a' style={{ width: '35px' }}></div>
                                          <div className='rmcode3a' style={{ width: '45px' }}></div>
                                          <div className='rmcode3a' style={{ width: '21px' }}></div>
                                          <div className='rmcode3a' style={{ borderRight: '0px', width: '21px' }}></div>
                                        </div>
                                      ))
                                    }
                                  </div>
                                  <div className='barcode3A'>{(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd[0]?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd[0]?.serialjobno} />}</>}</div>
                                </div>
                              </div>

                            </>
                          );
                        }) : <div className='container_3A'>
                          <div className='header3A'>
                            <div className='header3ADesc'>
                              <div className='jobno3A'><p className='job3Ahead'>{e?.data?.rd[0]?.serialjobno}</p><p className='job3Ahead'>{e?.data?.rd[0]?.Designcode}</p><p className='job3Ahead'>{e?.data?.rd[0]?.MetalType}</p><p className='job3Ahead'>{e?.data?.rd[0]?.MetalColorCo}</p></div>
                              <div className='info3A'>
                                <p className='info3Acust hw3A'>Cust.</p>
                                <p className='info3Acust hw3A' ><b>{e?.data?.rd[0]?.CustomerCode}</b></p>
                                <p className='info3Acust hw3Asr'>Sales Rep.</p>
                                <p className='info3Acust hw3Asr' style={{ borderRight: "0px" }}>{e?.data?.rd[0]?.SalesrepCode}</p>
                              </div>
                              <div className='info3A'>
                                <p className='info3Acust hw3A' >SIZE</p>
                                <p className='info3Acust hw3A' ><b>{e?.data?.rd[0]?.Size}</b></p>
                                <p className='info3Acust hw3Asr' >PO</p>
                                <p className='info3Acust hw3Asr' style={{ borderRight: "0px" }}>{e?.data?.rd[0]?.PO}</p>
                              </div>
                              <div className='info3A'>
                                <p className='info3Acust hw3AD' >Order</p>
                                <p className='info3Acust hw3AD' ><b>{e?.data?.rd[0]?.OrderDate?.slice(0, 12)}</b></p>
                                <p className='info3Acust hw3Asr' style={{ width: "50px" }}><b>Metal</b></p>
                                <p className='info3Acust hw3Asr'><b>Dia.</b></p>
                                <p className='info3Acust hw3Asr' style={{ borderRight: "0px" }}><b>CST</b></p>
                              </div>
                              <div className='info3A'>
                                <p className='info3Acust hw3AD' >Promise</p>
                                <p className='info3Acust hw3AD' style={{ fontSize: "8.5px" }}>{(e?.data?.rd[0]?.promisedate)?.replace(/\s+/g, "")}</p>
                                <p className='info3Acust hw3Asr' style={{ width: "50px" }}>{e?.data?.rd[0]?.MetalWeight}</p>
                                <p className='info3Acust hw3Asr'>{e.additional.dia.ActualPcs}/{e.additional.dia.ActualWeight.toFixed(2)}</p>
                                <p className='info3Acust hw3Asr' style={{ borderRight: "0px" }}>{e.additional.clr.ActualPcs}/{e.additional.clr.ActualWeight.toFixed(2)}</p>
                              </div>
                              <div className='info3A' style={{ borderBottom: "0px" }}>
                                <p className='info3Acust hw3AD' >FG By</p>
                                <p className='info3Acust hw3AD' ><b></b></p>
                                <p className='info3Acust hw3Asr' >Delivery</p>
                                <p className='info3Acust hw3Asr' ><b></b></p>
                                <p className='info3Acust hw3Asr' style={{ borderRight: "0px" }}><b></b></p>
                              </div>
                            </div>
                            <div className='imgBox3A'><img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} id="img3A" alt="" onError={e => handleImageError(e)} loading="eager"  /></div>
                          </div>
                          <div className='Ins3A' style={{ color: "red", display: "flex" }}><p style={{ fontSize: "12px" }}>Instruction :{((e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction)?.length > 0 ? ((e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction) == (null || 'null') ? '' : (e?.data?.rd[0]?.officeuse + e?.data?.rd[0]?.custInstruction + e?.data?.rd[0]?.ProductInstruction))?.slice(0, 131) : '')}</p></div>
                          <div className='enteryBarcode3A'>
                            <div className='enteryBarcode3ADyn'>
                              <div className='entry3AHead'>
                                <div className='rmcode3a' style={{ width: "35%" }}>RM CODE</div>
                                <div className='rmcode3a' style={{ width: "25%" }}>RM SIZE</div>
                                <div className='rmcode3a' style={{ width: "26%" }}>ACTUAL</div>
                                <div className='rmcode3a' style={{ borderRight: "0px", width: "14%" }}>ISSUE</div>
                              </div>

                              {
                                Array.from({ length: 13 }, (_, index) => (
                                  <div className='entry3AHead' style={{ fontWeight: "normal", lineHeight: "8px" }} key={index}>
                                    <div className='rmcode3a' style={{ width: '35%' }}></div>
                                    <div className='rmcode3a' style={{ width: '25%' }}></div>
                                    <div className='rmcode3a' style={{ width: '13%' }}></div>
                                    <div className='rmcode3a' style={{ width: '13%' }}></div>
                                    <div className='rmcode3a' style={{ width: '7%' }}></div>
                                    <div className='rmcode3a' style={{ borderRight: '0px', width: '7%' }}></div>
                                  </div>
                                ))
                              }
                            </div>
                            <div className='barcode3A'>{(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd[0]?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd[0]?.serialjobno} />}</>}</div>
                          </div>
                        </div>
                      }
                      <div className='container_3A'>
                        <div className='header3A' style={{ height: "103px" }}>
                          <div className='header3ADesc' style={{ height: "103px" }}>
                            <div className='jobno3A' style={{ height: "20px", display: "flex", alignItems: "center" }}><p className='job3Ahead'>{e?.data?.rd[0]?.serialjobno}</p><p className='job3Ahead'>{e?.data?.rd[0]?.Designcode}</p><p className='job3Ahead' style={{ marginRight: "3px" }}>{e?.data?.rd[0]?.MetalType} {e?.data?.rd[0]?.MetalColorCo}</p></div>
                            <div className='write3A'>
                              <div className='prlocqc3A'>PRIORITY</div>
                              <div className='prlocqc3A'>LOC</div>
                              <div className='prlocqc3A' style={{ borderRight: "0px" }}>Q.C.</div>
                            </div>
                            <div className='write3AD'>
                              <div className='prlocqc3AD'><p>SALERS REP.</p><p><b style={{ lineHeight: "9px" }}>{e?.data?.rd[0]?.SalesrepCode}</b></p></div>
                              <div className='prlocqc3AD'><p>FROSTING</p><p><b style={{ lineHeight: "9px" }}>{e?.data?.rd[0]?.MetalFrosting}</b></p></div>
                              <div className='prlocqc3AD' style={{ borderRight: "0px", lineHeight: "9px" }}><p>ENAMELING</p><p><b style={{ lineHeight: "9px" }}>{e?.data?.rd[0]?.Enamelling}</b></p></div>
                            </div>
                            <div className='write3AE'>
                              <div className='prlocqc3AE'><p>LAB</p><p><b style={{ lineHeight: "9px", fontSize: "10.5px" }}>{e?.data?.rd[0]?.MasterManagement_labname}</b></p></div>
                              <div className='prlocqc3AE'><p>SNAP</p><p><b>{e?.data?.rd[0]?.MasterManagement_ProductImageType}</b></p></div>
                              <div className='prlocqc3AE' style={{ borderRight: "0px", lineHeight: "9px" }}><p>MAKETYPE</p><p><b style={{ lineHeight: "9px" }}>{e?.data?.rd[0]?.mastermanagement_maketypename}</b></p></div>
                            </div>
                          </div>
                          <div className='imgBox3A' style={{ height: "103px" }}><img src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} id="img3A" alt="" onError={e => handleImageError(e)} loading="eager"  /></div>
                        </div>
                        <div className='enteryBarcode3A'>
                          <div className='enteryBarcode3ADyn'>
                            <div className='entry3AHead' style={{ fontWeight: "normal", width: "290px" }}>
                              <div className='rmcode3a' style={{ width: "43px" }}>DEPT </div>
                              <div className='rmcode3a' style={{ width: "52px" }}>ISSUE</div>
                              <div className='rmcode3a' style={{ width: "52px" }}>RECEIVE</div>
                              <div className='rmcode3a' style={{ width: "52px" }}>SCRAP</div>
                              <div className='rmcode3a' style={{ width: "37px" }}>PCS</div>
                              <div className='rmcode3a' style={{ borderRight: "0px", width: "56px" }}>WORKER</div>
                            </div>
                            <div className='entryheader3A'>
                              <div className='entry3AHeadD' style={{ fontWeight: "normal" }}>
                                <div className='rmcode3aD' style={{ width: "46px" }}>GRD </div>
                                <div className='rmcode3aD' style={{ width: "46px" }}>FIL</div>
                                <div className='rmcode3aD' style={{ width: "46px" }}>PPL</div>
                                <div className='rmcode3aD' style={{ width: "46px" }}>SET.	</div>
                                <div className='rmcode3aD' style={{ width: "46px" }}>ASM</div>
                                <div className='rmcode3aD' style={{ width: "46px" }}>FPL</div>
                                <div className='rmcode3aD' style={{ width: "46px" }}>PLT</div>
                                <div className='rmcode3aD' style={{ width: "46px" }}>ENM</div>
                                <div className='rmcode3aD' style={{ borderBottom: "1px solid #989898", width: "46px" }}>F.G.</div>
                              </div>
                              {
                                <div>
                                  {
                                    Array.from({ length: 9 }, (_, index) => (
                                      <div className='entry3AHeadEntry' style={{ fontWeight: "normal" }}>
                                        <div className='rmcode3aDE' style={{ width: "52px" }}></div>
                                        <div className='rmcode3aDE' style={{ width: "51px" }}></div>
                                        <div className='rmcode3aDE' style={{ width: "51px" }}></div>
                                        <div className='rmcode3aDE' style={{ width: "37px" }}></div>
                                        <div className='rmcode3aDE' style={{ width: "56px", borderRight: "0px" }}></div>
                                      </div>
                                    ))
                                  }
                                </div>
                              }
                            </div>
                            <div style={{ color: "red" }}>
                              Order Instruction:
                              {/* Order Instruction: {(e?.data?.rd[0]?.officeuse?.slice(0, 100)) + " " +(e?.data?.rd[0]?.ProductInstruction?.slice(0, 100))} */}
                            </div>
                          </div>
                          <div className='barcode3AD'>{(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd[0]?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd[0]?.serialjobno} />}</>}</div>
                        </div>
                      </div>
                    </>
                  );
                })
              }
            </div>
          </div>
        </>
      }
    </>
  );
};

export default BagPrint3A;