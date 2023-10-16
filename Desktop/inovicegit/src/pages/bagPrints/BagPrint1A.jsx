import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/bagprint/print1A.css";
import { formatDate } from "../../GlobalFunctions/DateFormat";
import { GetChunkData } from "../../GlobalFunctions/GetChunkData";
import { GetData } from "../../GlobalFunctions/GetData";
import { GetSeparateData } from "../../GlobalFunctions/GetSeparateData";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import BarcodeGenerator from "../../components/BarcodeGenerator";
import Loader from "../../components/LoaderBag";
import { organizeData } from "../../GlobalFunctions/OrganizeBagPrintData";
function BagPrint1A({ queries, headers }) {
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
  const chunkSize11 = 15;
  const imgUrls = [];
  useEffect(() => {
    if (Object.keys(queryParams).length !== 0) {
      atob(queryParams.imagepath);
    }
    const fetchData = async () => {
      try {
        const responseData = [];
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

        datas?.map((a) => {
          imgUrls?.push(a?.rd?.ThumbImagePath);
          let length = 0;
          let clr = {
            clrPcs: 0,
            clrWt: 0,
          };
          let dia = {
            diaPcs: 0,
            diaWt: 0,
          };
          // let diamondData = [];
          // let clrData = [];
          // let diamondWeight = 0;
          // let diamondPcs = 0;
          // let clrWeight = 0;
          // let clrpcs = 0;
          // let chData = [];

          // let imagePath = queryParams?.imagepath;
          // imagePath = atob(queryParams?.imagepath);
          // let img = imagePath + a?.rd?.ThumbImagePath;

          let separateData = GetSeparateData(a?.rd1);

          separateData?.diamondArr.unshift({
            heading: "DIAMOND DETAIL",
            MasterManagement_DiamondStoneTypeid: 3,
          });

          // ArrofFiveSize.push(clr);
          // ArrofFiveSize[0].heading = "COLOR STONE DETAIL";
          separateData?.colorStoneArr.unshift({
            heading: "COLOR STONE DETAIL",
            MasterManagement_DiamondStoneTypeid: 4,
          });
          // ArrofFiveSize.unshift({ heading: "COLOR STONE DETAIL", MasterManagement_DiamondStoneTypeid: 4 });

          // ArrofFSize.push(f);
          // ArrofFSize[0].heading = "FINDING DETAIL";
          // ArrofFSize.unshift({ heading: "FINDING DETAIL", MasterManagement_DiamondStoneTypeid: 5 });
          separateData?.findingArr.unshift({
            heading: "FINDING DETAIL",
            MasterManagement_DiamondStoneTypeid: 5,
          });

          // ArrofMISize.push(misc);
          // ArrofMISize[0].heading = "MISC DETAIL";
          // ArrofMISize.unshift({ heading: "MISC DETAIL", MasterManagement_DiamondStoneTypeid: 7 });
          separateData?.miscArr.unshift({
            heading: "MISC DETAIL",
            MasterManagement_DiamondStoneTypeid: 7,
          });

          separateData?.diamondArr?.map((e) => {
            if (e?.ActualPcs === 0 && e?.ActualWeight === 0) {
              // ArrofSevenSize = [];
              separateData.diamondArr = [];
            }
          });

          separateData?.colorStoneArr.map((e) => {
            if (e.ActualPcs === 0 && e.ActualWeight === 0) {
              // ArrofFiveSize = [];
              separateData.colorStoneArr = [];
            }
          });

          separateData?.miscArr.map((e) => {
            if (e.ActualPcs === 0 && e.ActualWeight === 0) {
              // ArrofMISize = [];
              separateData.miscArr = [];
            }
          });

          separateData?.findingArr.map((e) => {
            if (e.ActualPcs === 0 && e.ActualWeight === 0) {
              // ArrofFSize = [];
              separateData.findingArr = [];
            }
          });

          let arr = [];
          // let mainArr = arr.concat(ArrofSevenSize, ArrofFiveSize, ArrofMISize, ArrofFSize);
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

        // for (let url in print) {
        //   let chunkData = [];
        //   const obj = {
        //     jobno: print[url],
        //     custid: queries.custid,
        //     printname: queries.printname,
        //     appuserid: queries.appuserid,
        //     url: queries.url,
        //     headers: headers,
        //   };

        //   let datas = await GetData(obj);
        //   const orderDatef = formatDate(datas?.rd[0]?.OrderDate);
        //   const promiseDatef = formatDate(datas?.rd[0]?.promisedate);

        //   datas?.rd?.map((e) => {
        //     e.orderDatef = orderDatef;
        //     e.promiseDatef = promiseDatef;
        //     //
        //   });
        //   let separateData = GetSeparateData(datas?.rd1);

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

        //   // let diamondArr = [];
        //   // let colorStoneArr = [];
        //   // let miscArr = [];
        //   // let findingDetailArr = [];

        //   // let resultArr = [];

        //   // // diamondArr.length > 0 && diamondArr.push({ title: "total", name: "diamond" });
        //   // // colorStoneArr.length > 0 && colorStoneArr.push({ title: "total", name: "colorStone" });
        //   // // miscArr.length > 0 && miscArr.push({ title: "total", name: "misc" });
        //   // // findingDetailArr.length > 0 && findingDetailArr.push({ title: "total", name: "findingDetail" });

        //   // // diamondArr.length > 0 && diamondArr.unshift({ tital: "diamond", title: "diamond" });
        //   // // colorStoneArr.length > 0 && colorStoneArr.unshift({ tital: "colorStone", title: "colorStone" });
        //   // // miscArr.length > 0 && miscArr.unshift({ tital: "misc", title: "misc" });
        //   // // findingDetailArr.length > 0 && findingDetailArr.unshift({ tital: "findingDetail", title: "findingDetail" });
        //   // // let newArr = [];

        //   // // if (diamondArr.length > 0) { newArr = resultArr.concat(diamondArr); }
        //   // // if (colorStoneArr.length > 0) { newArr = resultArr.concat(colorStoneArr); };
        //   // // if (miscArr.length > 0) { newArr = resultArr.concat(miscArr); }
        //   // // if (findingDetailArr.length > 0) { newArr = resultArr.concat(findingDetailArr); }

        //   // function chunkArrayWithHeadingsAndRemoveDuplicates(arr, chunkSize) {
        //   //     const chunks = [];
        //   //     let currentHeading = "";
        //   //     let typeIdFromSecondChunk = null;

        //   //     for (let i = 0; i < arr.length; i += chunkSize) {
        //   //         const chunk = arr.slice(i, i + chunkSize);
        //   //         let typeId = null; // Initialize typeId

        //   //         // Remove "tital" object when "heading" is the same within the chunk
        //   //         const uniqueChunk = [];
        //   //         for (const obj of chunk) {
        //   //             if (obj.heading !== currentHeading) {
        //   //                 uniqueChunk.push(obj);
        //   //                 if (!typeId && obj.MasterManagement_DiamondStoneTypeid) {
        //   //                     typeId = obj.MasterManagement_DiamondStoneTypeid;
        //   //                 }
        //   //             }
        //   //         }

        //   //         // Define headings based on typeId
        //   //         let heading = "";
        //   //         switch (typeId) {
        //   //             case 3:
        //   //                 heading = "diamond";
        //   //                 break;
        //   //             case 4:
        //   //                 heading = "colorstone";
        //   //                 break;
        //   //             case 5:
        //   //                 heading = "finding detail";
        //   //                 break;
        //   //             case 7:
        //   //                 heading = "misc";
        //   //                 break;
        //   //             default:
        //   //                 heading = currentHeading;
        //   //                 // If typeId is not available in the first chunk, use typeId from the second chunk
        //   //                 if (!typeIdFromSecondChunk) {
        //   //                     const secondChunk = arr.slice(chunkSize, chunkSize + chunkSize);
        //   //                     if (secondChunk.length > 0) {
        //   //                         typeIdFromSecondChunk = secondChunk[0].MasterManagement_DiamondStoneTypeid;
        //   //                     }
        //   //                 }
        //   //                 typeId = typeIdFromSecondChunk;
        //   //         }

        //   //         // Add the heading object to the beginning of the chunk
        //   //         uniqueChunk.unshift({ heading });

        //   //         // Update the current heading for the next chunk
        //   //         currentHeading = heading;

        //   //         // Split the uniqueChunk into smaller chunks of 10 objects each
        //   //         for (let j = 0; j < uniqueChunk.length; j += 10) {
        //   //             const subChunk = uniqueChunk.slice(j, j + 10);
        //   //             chunks.push(subChunk);
        //   //         }
        //   //     }

        //   //     return chunks;
        //   // }

        //   // const chunkSize = 10;

        //   // const chunksWithHeadings = chunkArrayWithHeadingsAndRemoveDuplicates(newArr, chunkSize);

        //   // // Split the main array into subarrays
        //   // const subarrays = [];
        //   // for (let i = 0; i < chunksWithHeadings.length; i += chunkSize) {
        //   //     subarrays.push(chunksWithHeadings.slice(i, i + chunkSize));
        //   // }

        //   // let length = 0;
        //   // let clr = {
        //   //     Shapename: "TOTAL",
        //   //     Sizename: "",
        //   //     ActualPcs: 0,
        //   //     ActualWeight: 0,
        //   //     MasterManagement_DiamondStoneTypeid: 4
        //   //     // heading: "COLOR STONE DETAIL"
        //   // };
        //   // let dia = {
        //   //     Shapename: "TOTAL",
        //   //     Sizename: "",
        //   //     ActualPcs: 0,
        //   //     ActualWeight: 0,
        //   //     MasterManagement_DiamondStoneTypeid: 3
        //   //     // heading: "DIAMOND DETAIL"
        //   // };
        //   // let misc = {
        //   //     Shapename: "TOTAL",
        //   //     Sizename: "",
        //   //     ActualPcs: 0,
        //   //     ActualWeight: 0,
        //   //     MasterManagement_DiamondStoneTypeid: 7
        //   //     // heading: "MISC DETAIL"
        //   // };
        //   // let f = {
        //   //     Shapename: "TOTAL",
        //   //     Sizename: "",
        //   //     ActualPcs: 0,
        //   //     ActualWeight: 0,
        //   //     MasterManagement_DiamondStoneTypeid: 5
        //   //     // heading: "FINDING DETAIL"
        //   // };
        //   // let ArrofSevenSize = [];
        //   // //arr for colorstone
        //   // let ArrofFiveSize = [];
        //   // let ArrofMISize = [];
        //   // let ArrofFSize = [];

        //   // datas?.rd1?.map((e, i) => {

        //   //     if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
        //   //         length++;
        //   //     }
        //   //     if (e?.MasterManagement_DiamondStoneTypeid === 3) {
        //   //         diamondArr.push(e);
        //   //         ArrofSevenSize.push(e);
        //   //         dia.ActualPcs = dia.ActualPcs + e?.ActualPcs;
        //   //         dia.ActualWeight = dia.ActualWeight + e?.ActualWeight;

        //   //     } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
        //   //         colorStoneArr.push(e);
        //   //         ArrofFiveSize.push(e);
        //   //         clr.ActualPcs = clr.ActualPcs + e?.ActualPcs;
        //   //         clr.ActualWeight = clr.ActualWeight + e?.ActualWeight;
        //   //     } else if (e?.MasterManagement_DiamondStoneTypeid === 5) {
        //   //         findingDetailArr.push(e);
        //   //         ArrofFSize.push(e);
        //   //         f.ActualPcs = f.ActualPcs + e?.ActualPcs;
        //   //         f.ActualWeight = f.ActualWeight + e?.ActualWeight;
        //   //     } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
        //   //         miscArr.push(e);
        //   //         ArrofMISize.push(e);
        //   //         misc.ActualPcs = misc.ActualPcs + e?.ActualPcs;
        //   //         misc.ActualWeight = misc.ActualWeight + e?.ActualWeight;
        //   //     }
        //   // });

        //   // dia.ActualPcs = +(dia.ActualPcs.toFixed(3));
        //   // dia.ActualWeight = +(dia.ActualWeight.toFixed(3));
        //   // clr.ActualPcs = +(clr.ActualPcs.toFixed(3));
        //   // clr.ActualWeight = +(clr.ActualWeight.toFixed(3));
        //   // misc.ActualPcs = +(misc.ActualPcs.toFixed(3));
        //   // misc.ActualWeight = +(misc.ActualWeight.toFixed(3));
        //   // f.ActualPcs = +(f.ActualPcs.toFixed(3));
        //   // f.ActualWeight = +(f.ActualWeight.toFixed(3));

        //   // ArrofSevenSize.push(dia);
        //   // ArrofSevenSize.push(dia);
        //   // ArrofSevenSize[0].heading = "DIAMOND DETAIL";
        //   // ArrofSevenSize.unshift({ heading: "DIAMOND DETAIL", MasterManagement_DiamondStoneTypeid: 3 });
        //   separateData?.diamondArr.unshift({
        //     heading: "DIAMOND DETAIL",
        //     MasterManagement_DiamondStoneTypeid: 3,
        //   });

        //   // ArrofFiveSize.push(clr);
        //   // ArrofFiveSize[0].heading = "COLOR STONE DETAIL";
        //   separateData?.colorStoneArr.unshift({
        //     heading: "COLOR STONE DETAIL",
        //     MasterManagement_DiamondStoneTypeid: 4,
        //   });
        //   // ArrofFiveSize.unshift({ heading: "COLOR STONE DETAIL", MasterManagement_DiamondStoneTypeid: 4 });

        //   // ArrofFSize.push(f);
        //   // ArrofFSize[0].heading = "FINDING DETAIL";
        //   // ArrofFSize.unshift({ heading: "FINDING DETAIL", MasterManagement_DiamondStoneTypeid: 5 });
        //   separateData?.findingArr.unshift({
        //     heading: "FINDING DETAIL",
        //     MasterManagement_DiamondStoneTypeid: 5,
        //   });

        //   // ArrofMISize.push(misc);
        //   // ArrofMISize[0].heading = "MISC DETAIL";
        //   // ArrofMISize.unshift({ heading: "MISC DETAIL", MasterManagement_DiamondStoneTypeid: 7 });
        //   separateData?.miscArr.unshift({
        //     heading: "MISC DETAIL",
        //     MasterManagement_DiamondStoneTypeid: 7,
        //   });

        //   separateData?.diamondArr?.map((e) => {
        //     if (e?.ActualPcs === 0 && e?.ActualWeight === 0) {
        //       // ArrofSevenSize = [];
        //       separateData.diamondArr = [];
        //     }
        //   });

        //   separateData?.colorStoneArr.map((e) => {
        //     if (e.ActualPcs === 0 && e.ActualWeight === 0) {
        //       // ArrofFiveSize = [];
        //       separateData.colorStoneArr = [];
        //     }
        //   });

        //   separateData?.miscArr.map((e) => {
        //     if (e.ActualPcs === 0 && e.ActualWeight === 0) {
        //       // ArrofMISize = [];
        //       separateData.miscArr = [];
        //     }
        //   });

        //   separateData?.findingArr.map((e) => {
        //     if (e.ActualPcs === 0 && e.ActualWeight === 0) {
        //       // ArrofFSize = [];
        //       separateData.findingArr = [];
        //     }
        //   });

        //   let arr = [];
        //   // let mainArr = arr.concat(ArrofSevenSize, ArrofFiveSize, ArrofMISize, ArrofFSize);
        //   let mainArr = arr.concat(
        //     separateData?.diamondArr,
        //     separateData?.colorStoneArr,
        //     separateData?.miscArr,
        //     separateData?.findingArr
        //   );
        //   // let createdMainArr = [];
        //   // for (let i = 0; i < mainArr.length; i += chunkSize11) {
        //   //     const chunks = mainArr.slice(i, i + chunkSize11);
        //   //     let mainHeading = "";
        //   //     let emptyHeading = "";
        //   //     let createdChunks = [];
        //   //     chunks.map((ele, ind) => {
        //   //         if (ele.MasterManagement_DiamondStoneTypeid && mainHeading === "") {
        //   //             mainHeading = ele.heading;
        //   //             let head = "";
        //   //             if (ele.MasterManagement_DiamondStoneTypeid === 3) {
        //   //                 head = "DIAMOND DETAIL";
        //   //             } else if (ele.MasterManagement_DiamondStoneTypeid === 4) {
        //   //                 head = "COLOR STONE DETAIL";
        //   //             } else if (ele.MasterManagement_DiamondStoneTypeid === 5) {
        //   //                 head = "FINDING DETAIL";
        //   //             } else if (ele.MasterManagement_DiamondStoneTypeid === 7) {
        //   //                 head = "MISC DETAIL";
        //   //             }
        //   //             let obj = {
        //   //                 mainHeading: head
        //   //             };
        //   //             createdChunks.unshift(obj);
        //   //             createdChunks.push(ele);
        //   //         } else if (ele.heading) {
        //   //             if (mainHeading === ele.heading) {
        //   //                 emptyHeading = "full";
        //   //             } else {
        //   //                 createdChunks.push(ele);
        //   //             }
        //   //         } else {
        //   //             createdChunks.push(ele);
        //   //         }
        //   //     });
        //   //     createdMainArr.push(createdChunks);
        //   // }

        //   let imagePath = queryParams?.imagepath;
        //   imagePath = atob(queryParams?.imagepath);

        //   let img = imagePath + datas?.rd[0]?.ThumbImagePath;

        //   let arrofCHunk = GetChunkData(chunkSize11, mainArr);

        

        //   // for (let i = 0; i < mainArr.length; i += chunkSize11) {
        //   //     const chunks = mainArr.slice(i, i + chunkSize11);
        //   //     let len = 15 - (mainArr.slice(i, i + chunkSize11)).length;
        //   //     chunkData.push({ data: chunks, length: len });
        //   // }
        //   responseData.push({
        //     data: datas,
        //     additional: {
        //       length: separateData?.length,
        //       clr: separateData?.clr,
        //       dia: separateData?.dia,
        //       f: separateData?.f,
        //       img: img,
        //       misc: separateData?.misc,
        //       pages: arrofCHunk,
        //     },
        //   });
        //   // responseData.push({ data: datas, additional: { length: length, clr: clr, dia: dia, f: f, img: img, misc: misc, pages: chunkData } });
        // }
        const endTime = performance.now();
        const elapsedTime = (endTime - startTime) / 1000;

        // console.log(`Time taken: ${elapsedTime/60} minutes`);
        // setData(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
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
        <React.Fragment>
          <div
            className="print_btn"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "1rem",
              marginRight: "2rem",
            }}
          >
            <button
              className="btn_white blue print_btn"
              onClick={(e) => handlePrint(e)}
            >
              Print
            </button>
          </div>
          <div className="print1A">
            {Array.from(
              { length: queries?.pageStart },
              (_, indexs) =>
                indexs > 0 && (
                  <div
                    key={indexs}
                    className="mainbag1A"
                    style={{ border: "0px" }}
                  ></div>
                )
            )}
            {data.length > 0 &&
              data.map((e, i) => {
                return (
                  <React.Fragment key={i}>
                    {e?.additional?.pages?.length > 0 ? (
                      e?.additional?.pages?.map((ele, index) => {
                        return (
                          <div className="mainbag1A" key={index}>
                            <div className="print1AStartPart">
                              <div className="print1A_header">
                                <div className="print1A_header_bagInfoPart">
                                  <div className="print1A_header_bagInfoPart1">
                                    <div
                                      className="print1AJobNo lh1Ady"
                                      style={{ fontSize: "12px" }}
                                    >
                                      BAG {e?.data?.rd?.serialjobno}
                                    </div>
                                    <div className="print1AJobNo lh1Ady">
                                      {e?.data?.rd?.Designcode?.toUpperCase()}
                                    </div>
                                    <div className="print1AJobNo lh1Ady">
                                      {e?.data?.rd?.MetalType?.toUpperCase() +
                                        " " +
                                        e?.data?.rd?.MetalColorCo?.toUpperCase()}{" "}
                                    </div>
                                  </div>
                                  <div className="print1AMaterial">
                                    <div className="print1AMaterialCG">
                                      <div className="g1A">CUST.</div>
                                      <div className="custHead1A lh1Ady">
                                        {e?.data?.rd?.CustomerCode?.toUpperCase()}
                                      </div>
                                      <div className="custCode1A">
                                        <b>GOLD</b>
                                      </div>
                                      <div className="cst1A">
                                        <b>DIA</b>
                                      </div>
                                      <div
                                        className="cst1A"
                                        style={{ borderRight: "0px" }}
                                      >
                                        <b>CST</b>
                                      </div>
                                    </div>
                                    <div className="print1AMaterialCG">
                                      <div className="g1A">SIZE</div>
                                      <div
                                        className="custHead1A lh1Ady"
                                        style={{ lineHeight: "8px" }}
                                      >
                                        {e?.data?.rd?.Size?.toUpperCase()}
                                      </div>
                                      <div className="custCode1A lh1Ady">
                                        {e?.data?.rd?.MetalWeight?.toFixed(
                                          3
                                        )}
                                      </div>
                                      <div className="cst1A lh1Ady">
                                        {e?.additional?.dia?.ActualPcs}/
                                        {e?.additional?.dia?.ActualWeight?.toFixed(
                                          2
                                        )}
                                      </div>
                                      <div
                                        className="cst1A lh1Ady"
                                        style={{ borderRight: "0px" }}
                                      >
                                        {e?.additional?.clr?.ActualPcs}/
                                        {e?.additional?.clr?.ActualWeight?.toFixed(
                                          2
                                        )}
                                      </div>
                                    </div>
                                    <div className="print1AMaterialCG">
                                      <div
                                        className="g1A"
                                        style={{ width: "37px" }}
                                      >
                                        PO
                                      </div>
                                      <div
                                        className="custHead1A lh1Ady"
                                        style={{ width: "100px" }}
                                      >
                                        {e?.data?.rd?.PO?.toUpperCase()}
                                      </div>
                                      <div className="cst1A">
                                        <b>BAG DT</b>
                                      </div>
                                      <div
                                        className="cst1A lh1Ady"
                                        style={{
                                          borderRight: "0px",
                                          fontSize: "11.5px",
                                        }}
                                      >
                                        {e?.data?.rd?.orderDatef?.toUpperCase()}
                                      </div>
                                    </div>
                                    {/* {
                                                                                ele.data.map((el, ins) => {

                                                                                    if (el.MasterManagement_DiamondStoneTypeid === 3 && ins === 0) {
                                                                                        return (
                                                                                            <>
                                                                                                <div className='print1Adia'><b>DIAMOND DETAIL</b></div>
                                                                                            </>
                                                                                        );
                                                                                    }
                                                                                    else if (el.MasterManagement_DiamondStoneTypeid === 4 && ins === 0) {
                                                                                        return (
                                                                                            <>
                                                                                                <div className='print1Adia'><b>COLOR STONE DETAIL</b></div>
                                                                                            </>
                                                                                        );
                                                                                    }
                                                                                    else if (el.MasterManagement_DiamondStoneTypeid === 5 && ins === 0) {
                                                                                        return (
                                                                                            <>
                                                                                                <div className='print1Adia'><b>FINDING DETAIL</b></div>
                                                                                            </>
                                                                                        );
                                                                                    }
                                                                                    else if (el.MasterManagement_DiamondStoneTypeid === 7 && ins === 0) {
                                                                                        return (
                                                                                            <>
                                                                                                <div className='print1Adia'><b>MISC DETAIL</b></div>
                                                                                            </>
                                                                                        );
                                                                                    }
                                                                                })
                                                                            } */}
                                  </div>
                                </div>
                                <div className="print1A_header_bagImgPart2">
                                  <img
                                    src={
                                      e?.additional?.img !== ""
                                        ? e?.additional?.img
                                        : require("../../assets/img/default.jpg")
                                    }
                                    id="print1AImg"
                                    alt=""
                                    onError={(e) => handleImageError(e)}
                                    loading="eager"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="print1AtableBarcode">
                              <div className="midpart">
                                <div
                                  className="print1AMiddlePart"
                                  style={{ width: "260px" }}
                                >
                                  <div className="print1AMidHead">
                                    <div
                                      className="print1ARM"
                                      style={{ width: "104px" }}
                                    >
                                      <b>RM CODE</b>
                                    </div>
                                    <div
                                      className="sizename1A"
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
                                      className="actual1Aflex"
                                      style={{ width: "70px" }}
                                    >
                                      <div
                                        className="whA1A"
                                        style={{ width: "70px" }}
                                      >
                                        <b>ACTUAL</b>
                                      </div>
                                      <div
                                        className="child1A"
                                        style={{ width: "70px" }}
                                      >
                                        <p className="pcswtSet1A">
                                          <b>PCS</b>
                                        </p>
                                        <p style={{ fontSize: "12px" }}>
                                          <b>WT</b>
                                        </p>
                                      </div>
                                    </div>
                                    <div
                                      className="actual1Aflex"
                                      style={{
                                        borderRight: "0px",
                                        width: "55px",
                                      }}
                                    >
                                      <div
                                        className="whA1A"
                                        style={{ width: "57px" }}
                                      >
                                        <b>ISSUE</b>
                                      </div>
                                      <div
                                        className="child1A"
                                        style={{ width: "57px" }}
                                      >
                                        <p className="pcswtSet1A">
                                          <b>PCS</b>
                                        </p>
                                        <p style={{ fontSize: "12px" }}>
                                          <b>WT</b>
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {ele?.data?.map((e, iabcd) => {
                                    return (
                                      <React.Fragment key={iabcd}>
                                        {e?.heading === "DIAMOND DETAIL" ||
                                        e?.heading === "COLOR STONE DETAIL" ||
                                        e?.heading === "MISC DETAIL" ||
                                        e?.heading === "FINDING DETAIL" ? (
                                          <div
                                            className="print1AMidBody"
                                            style={
                                              iabcd === 0 && e.heading !== ""
                                                ? { display: "" }
                                                : {}
                                            }
                                          >
                                            <div
                                              className="print1ARM"
                                              style={{
                                                width: "300px",
                                                borderRight: "0px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {e?.heading?.toUpperCase()}
                                            </div>
                                          </div>
                                        ) : (
                                          <div>
                                            {e?.Shapename === "TOTAL" ? (
                                              <div className="print1AMidBody">
                                                <div
                                                  className="print1ARM RMW"
                                                  style={{
                                                    fontWeight: "bold",
                                                    fontSize: "10.5px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                  }}
                                                >
                                                  {e?.Shapename?.toUpperCase()}
                                                </div>
                                                <div
                                                  className="sizename1A"
                                                  style={{ fontSize: "10.5px" }}
                                                >
                                                  {(e?.Sizename &&
                                                    e?.Sizename !== "" &&
                                                    e?.Sizename?.toUpperCase()?.slice(
                                                      0,
                                                      10
                                                    )) ??
                                                    ""}
                                                </div>
                                                <div className="pcswt1A">
                                                  <div className="actualPcsWt">
                                                    <div
                                                      className="pcs1A"
                                                      style={{
                                                        fontWeight: "bold",
                                                        fontSize: "10.5px",
                                                        display: "flex",
                                                        justifyContent:
                                                          "flex-end",
                                                        lineHeight: "7px",
                                                        paddingRight: "2px",
                                                      }}
                                                    >
                                                      {e?.ActualPcs}
                                                    </div>
                                                    <div
                                                      className="pcs1A"
                                                      style={{
                                                        borderRight: "0px",
                                                        width: "38px",
                                                        fontWeight: "bold",
                                                        lineHeight: "8px",
                                                        fontSize: "10.5px",
                                                        display: "flex",
                                                        justifyContent:
                                                          "flex-end",
                                                        paddingRight: "0.5px",
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
                                              <div>
                                                {e?.MasterManagement_DiamondStoneTypeid ===
                                                5 ? (
                                                  <div>
                                                    <div className="print1AMidBody">
                                                      <div
                                                        className="print1ARM"
                                                        style={{
                                                          fontSize: "10.5px",
                                                          lineHeight: "7px",
                                                          width: "174px",
                                                        }}
                                                      >
                                                        {e?.LimitedShapeQualityColorCode?.toUpperCase() +
                                                          " " +
                                                          e?.Quality?.toUpperCase() +
                                                          " " +
                                                          e?.ColorName?.toUpperCase()}
                                                      </div>

                                                      <div className="pcswt1A">
                                                        <div className="actualPcsWt">
                                                          <div
                                                            className="pcs1A"
                                                            style={{
                                                              fontSize:
                                                                "10.5px",
                                                              justifyContent:
                                                                "flex-end",
                                                              paddingRight:
                                                                "2px",
                                                            }}
                                                          >
                                                            {e?.ActualPcs}
                                                          </div>
                                                          <div
                                                            className="pcs1A"
                                                            style={{
                                                              borderRight:
                                                                "0px",
                                                              width: "38px",
                                                              lineHeight: "8px",
                                                              fontSize:
                                                                "10.5px",
                                                              justifyContent:
                                                                "flex-end",
                                                              paddingRight:
                                                                "2px",
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
                                                  </div>
                                                ) : (
                                                  <div>
                                                    <div className="print1AMidBody">
                                                      <div
                                                        className="print1ARM RMW lh1Ady"
                                                        style={{
                                                          fontSize: "10.5px",
                                                        }}
                                                      >
                                                        {e?.LimitedShapeQualityColorCode?.toUpperCase()}
                                                      </div>
                                                      <div
                                                        className="sizename1A lh1Ady"
                                                        style={{
                                                          fontSize: "10.5px",
                                                          justifyContent:
                                                            "flex-start",
                                                          paddingRight: "2px",
                                                        }}
                                                      >
                                                        {(e?.Sizename &&
                                                          e?.Sizename !== "" &&
                                                          e?.Sizename?.toUpperCase()?.slice(
                                                            0,
                                                            12
                                                          )) ??
                                                          ""}
                                                      </div>
                                                      <div className="pcswt1A">
                                                        <div className="actualPcsWt">
                                                          <div
                                                            className="pcs1A lh1Ady"
                                                            style={{
                                                              fontSize:
                                                                "10.5px",
                                                              justifyContent:
                                                                "flex-end",
                                                              paddingRight:
                                                                "2px",
                                                            }}
                                                          >
                                                            {e?.ActualPcs}
                                                          </div>
                                                          <div
                                                            className="pcs1A lh1Ady"
                                                            style={{
                                                              borderRight:
                                                                "0px",
                                                              width: "38px",
                                                              lineHeight: "8px",
                                                              fontSize:
                                                                "10.5px",
                                                              justifyContent:
                                                                "flex-end",
                                                              paddingRight:
                                                                "0.5px",
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
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </React.Fragment>
                                    );
                                  })}
                                  {Array.from(
                                    { length: ele?.length },
                                    (ains) => {
                                      return (
                                        <React.Fragment key={ains}>
                                          {ains !== 0 ? (
                                            <div className="print1AMidBody">
                                              <div className="print1ARM RMW">
                                                {e.Shapename ?? ""}
                                              </div>
                                              <div className="sizename1A">
                                                {e.Sizename ?? ""}
                                              </div>
                                              <div className="pcswt1A">
                                                <div className="actualPcsWt">
                                                  <div className="pcs1A">
                                                    {e?.ActualPcs ?? ""}
                                                  </div>
                                                  <div
                                                    className=""
                                                    style={{
                                                      borderRight: "0px",
                                                      width: "38px",
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

                                                      borderRight: "1px solid",
                                                      borderBottom: "0px solid",
                                                      borderTop: "0px",
                                                    }}
                                                  ></div>
                                                  <div className=""></div>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            <div
                                              className="print1AMidBody"
                                              style={{ display: "none" }}
                                            >
                                              <div className="print1ARM RMW">
                                                {e?.Shapename ?? ""}
                                              </div>
                                              <div className="sizename1A">
                                                {e?.Sizename ?? ""}
                                              </div>
                                              <div className="pcswt1A">
                                                <div className="actualPcsWt">
                                                  <div className="pcs1A">
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
                                                      height: "14px",

                                                      borderRight: "1px solid",
                                                      borderBottom: "0px solid",
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
                                <div
                                  style={{
                                    fontSize: "14px",
                                    paddingLeft: "2px",
                                    paddingTop: "2px",
                                    lineHeight: "14px",
                                    fontSize: "12px",
                                  }}
                                >
                                  <b>INSTRUCTION:</b>
                                  <span style={{ color: "red" }}>
                                    {(
                                      e.data.rd.officeuse +
                                      e?.data?.rd?.custInstruction +
                                      e.data.rd.ProductInstruction
                                    ).length > 0
                                      ? (
                                          e.data.rd.officeuse +
                                          e?.data?.rd?.custInstruction +
                                          e.data.rd.ProductInstruction
                                        )?.slice(0, 96) == (null || "null")
                                        ? ""
                                        : (
                                            e?.data?.rd?.officeuse +
                                            " " +
                                            e?.data?.rd?.custInstruction +
                                            " " +
                                            e?.data?.rd?.ProductInstruction
                                          )
                                            ?.toUpperCase()
                                            ?.slice(0, 88)
                                      : ""}
                                  </span>
                                </div>
                              </div>
                              <div
                                className="barcodeSetPrint1A"
                                style={{ height: "285px", marginTop: "3px" }}
                              >
                                <div className="barcodeprint1A">
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
                        );
                      })
                    ) : (
                      <div className="mainbag1A" key={i}>
                        <div className="print1AStartPart">
                          <div className="print1A_header">
                            <div className="print1A_header_bagInfoPart">
                              <div className="print1A_header_bagInfoPart1">
                                <div
                                  className="print1AJobNo"
                                  style={{
                                    fontSize: "12px",
                                    lineHeight: "8px",
                                  }}
                                >
                                  BAG {e?.data?.rd?.serialjobno}
                                </div>
                                <div
                                  className="print1AJobNo"
                                  style={{ lineHeight: "8px" }}
                                >
                                  {e?.data?.rd?.Designcode}
                                </div>
                                <div
                                  className="print1AJobNo"
                                  style={{ lineHeight: "8px" }}
                                >
                                  {e?.data?.rd?.MetalType}
                                </div>
                                <div
                                  className="print1AJobNo"
                                  style={{
                                    paddingRight: "3px",
                                    lineHeight: "8px",
                                  }}
                                >
                                  {e?.data?.rd?.MetalColorCo}
                                </div>
                              </div>

                              <div className="print1AMaterial">
                                <div className="print1AMaterialCG">
                                  <div className="g1A">CUST.</div>
                                  <div className="custHead1A">
                                    {e?.data?.rd?.CustomerCode}
                                  </div>
                                  <div className="custCode1A">
                                    <b>GOLD</b>
                                  </div>
                                  <div className="cst1A">
                                    <b>DIA</b>
                                  </div>
                                  <div
                                    className="cst1A"
                                    style={{ borderRight: "0px" }}
                                  >
                                    <b>CST</b>
                                  </div>
                                </div>
                                <div className="print1AMaterialCG">
                                  <div className="g1A">SIZE</div>
                                  <div className="custHead1A">
                                    {e?.data?.rd?.Size}
                                  </div>
                                  <div className="custCode1A">
                                    {e?.data?.rd?.MetalWeight?.toFixed(3)}
                                  </div>
                                  <div className="cst1A">
                                    {e?.additional?.dia?.ActualPcs}/
                                    {e?.additional?.dia?.ActualWeight?.toFixed(
                                      3
                                    )}
                                  </div>
                                  <div
                                    className="cst1A"
                                    style={{ borderRight: "0px" }}
                                  >
                                    {e?.additional?.clr?.ActualPcs}/
                                    {e?.additional?.clr?.ActualWeight?.toFixed(
                                      3
                                    )}
                                  </div>
                                </div>
                                <div className="print1AMaterialCG">
                                  <div
                                    className="g1A"
                                    style={{ width: "37px" }}
                                  >
                                    PO
                                  </div>
                                  <div
                                    className="custHead1A"
                                    style={{ width: "100px" }}
                                  >
                                    {e?.data?.rd?.PO}
                                  </div>
                                  <div className="cst1A">
                                    <b>BAG DT</b>
                                  </div>
                                  <div
                                    className="cst1A"
                                    style={{ borderRight: "0px" }}
                                  >
                                    {e?.data?.rd?.OrderDate}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="print1A_header_bagImgPart2">
                              <img
                                src={
                                  e?.additional?.img !== ""
                                    ? e?.additional?.img
                                    : require("../../assets/img/default.jpg")
                                }
                                id="print1AImg"
                                alt=""
                                onError={(e) => handleImageError(e)}
                                loading="eager"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="print1AtableBarcode">
                          <div className="midpart">
                            <div className="print1AMiddlePart">
                              <div className="print1AMidHead">
                                <div
                                  className="print1ARM"
                                  style={{ width: "104px" }}
                                >
                                  <b>RM CODE</b>
                                </div>
                                <div
                                  className="sizename1A"
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    fontSize: "14px",
                                    width: "69px",
                                  }}
                                >
                                  <b>RM SIZE</b>
                                </div>
                                <div className="actual1Aflex">
                                  <div className="whA1A">
                                    <b>ACTUAL</b>
                                  </div>
                                  <div className="child1A">
                                    <p className="pcswtSet1A">
                                      <b>PCS</b>
                                    </p>
                                    <p style={{ fontSize: "12px" }}>
                                      <b>WT</b>
                                    </p>
                                  </div>
                                </div>
                                <div
                                  className="actual1Aflex"
                                  style={{ borderRight: "0px" }}
                                >
                                  <div className="whA1A">
                                    <b>ISSUE</b>
                                  </div>
                                  <div className="child1A">
                                    <p className="pcswtSet1A">
                                      <b>PCS</b>
                                    </p>
                                    <p style={{ fontSize: "12px" }}>
                                      <b>WT</b>
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {Array.from({ length: 15 }, (ai) => {
                                return (
                                  <div className="print1AMidBody" key={ai}>
                                    <div className="print1ARM RMW">
                                      {e?.Shapename ?? ""}
                                    </div>
                                    <div className="sizename1A">
                                      {e?.Sizename ?? ""}
                                    </div>
                                    <div className="pcswt1A">
                                      <div className="actualPcsWt">
                                        <div className="pcs1A">
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
                            <div
                              style={{
                                fontSize: "14px",
                                borderRight: "1px solid black",
                                height: "34px",
                              }}
                            >
                              <b>INSTRUCTION:</b>
                              <span style={{ color: "red" }}>
                                {(
                                  e?.data?.rd?.officeuse +
                                  e?.data?.rd?.custInstruction +
                                  e?.data?.rd?.ProductInstruction
                                )?.length > 0
                                  ? (
                                      e?.data?.rd?.officeuse +
                                      e?.data?.rd?.custInstruction +
                                      e?.data?.rd?.ProductInstruction
                                    )?.slice(0, 95) == (null || "null")
                                    ? ""
                                    : (
                                        e?.data?.rd?.officeuse +
                                        e?.data?.rd?.e?.data?.rd
                                          ?.custInstruction +
                                        e?.data?.rd?.ProductInstruction
                                      )?.slice(0, 95)
                                  : ""}
                              </span>
                            </div>
                          </div>
                          <div className="barcodeSetPrint1A">
                            <div className="barcodeprint1A">
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
                    )}
                  </React.Fragment>
                );
              })}
          </div>
        </React.Fragment>
      )}
    </>
  );
}

export default BagPrint1A;
