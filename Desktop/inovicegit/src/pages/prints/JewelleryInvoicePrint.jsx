import React, { useState, useEffect } from "react";
import "../../assets/css/prints/jewellaryinvoiceprint.css";
import {
  apiCall,
  CapitalizeWords,
  isObjectEmpty,
  NumberWithCommas,
  taxGenrator,
} from "../../GlobalFunctions";
import convertor from "number-to-words";
import Button from "./../../GlobalFunctions/Button";
import Loader from "../../components/Loader";

const JewelleryInvoicePrint = ({ urls, token, invoiceNo, printName, evn }) => {
  const [headerData, setHeaderData] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [dynamicList1, setDynamicList1] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [dynamicList2, setDynamicList2] = useState([]);
  const [resultArray, setResultArray] = useState([]);
  const [mainTotal, setMainTotal] = useState({});
  const [grandTot, setGrandTot] = useState(0);
  const [taxTotal, setTaxTotal] = useState([]);
  const [inWords, setInWords] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [groupedArr, setGroupedArr] = useState([]);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  async function loadData(data) {
    try {

      let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
      data.BillPrint_Json[0].address = address;
      setHeaderData(data?.BillPrint_Json[0]);
      setDynamicList1(data?.BillPrint_Json1);
      setDynamicList2(data?.BillPrint_Json2);
      organizeData(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  }
  const organizeData = (arr, arr1, arr2) => {
    let totamt = 0;
    let FineArr = [];

    // eslint-disable-next-line array-callback-return
    arr1?.map((e, i) => {
      // eslint-disable-next-line array-callback-return
      arr2?.map((el, i) => {
        if (e?.SrJobno === el?.StockBarcode) {
          if (e?.MetalPurity === el?.QualityName) {
            FineArr.push(el);
          }
        }
      });
    });
    let blankArr = [];

    // eslint-disable-next-line array-callback-return
    arr1.map((e) => {
      let obj = { ...e };
      obj.FineWt = 0;
      obj.MRate = 0;
      // eslint-disable-next-line array-callback-return
      FineArr?.map((el) => {
        if (e?.SrJobno === el?.StockBarcode) {
          obj.FineWt += el?.FineWt;
          obj.MRate += el?.Rate;
        }
      });
      blankArr.push(obj);
    });
    let mainTotal = {
      diamonds: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      colorstone: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      metal: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      misc: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      finding: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      totalnetwt: {
        netwt: 0,
      },
      totalgrosswt: {
        grosswt: 0,
      },
      totallabourAmount: 0,
      totalOtherAmount: 0,
      totalunitCost: 0,
    };

    let resultArr = [];

    // eslint-disable-next-line array-callback-return
    arr1.map((e, i) => {
      let diamonds = [];
      let colorstone = [];
      let metal = [];
      let misc = [];
      let finding = [];
      let totals = {
        diamonds: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },
        colorstone: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },
        metal: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },
        misc: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },
        finding: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },
        labourAmount: 0,
        OtherAmount: 0,
      };

      totals.OtherAmount += +e?.OtherCharges + e?.MiscAmount;

      totals.labourAmount += e?.MakingAmount;

      totamt += e?.TotalAmount;

      mainTotal.totalunitCost += e?.TotalAmount;

      mainTotal.totalgrosswt.grosswt += e?.grosswt;

      mainTotal.totalnetwt.netwt += +e?.NetWt + +e?.LossWt;

      mainTotal.totalOtherAmount =
        mainTotal.totalOtherAmount + e?.OtherCharges + e?.MiscAmount;

      mainTotal.totallabourAmount =
        mainTotal.totallabourAmount + e?.MakingAmount;

      arr2.map((ele, ind) => {
        if (e.SrJobno === ele?.StockBarcode) {
          if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
            ele.finewt = ele?.FineWt;
            diamonds.push(ele);
            totals.diamonds.Wt += ele?.Wt;
            totals.diamonds.Pcs += ele?.Pcs;
            totals.diamonds.Rate += ele?.Rate;
            totals.diamonds.Amount += ele?.Amount;
            mainTotal.diamonds.Wt += ele?.Wt;
            mainTotal.diamonds.Pcs += ele?.Pcs;
            mainTotal.diamonds.Rate += ele?.Rate;
            mainTotal.diamonds.Amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
            colorstone.push(ele);
            totals.colorstone.Wt += ele?.Wt;
            totals.colorstone.Pcs += ele?.Pcs;
            totals.colorstone.Rate += ele?.Rate;
            totals.colorstone.Amount += ele?.Amount;
            mainTotal.colorstone.Wt += ele?.Wt;
            mainTotal.colorstone.Pcs += ele?.Pcs;
            mainTotal.colorstone.Rate += ele?.Rate;
            mainTotal.colorstone.Amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
            misc.push(ele);
            totals.misc.Wt += ele?.Wt;
            totals.misc.Pcs += ele?.Pcs;
            totals.misc.Rate += ele?.Rate;
            totals.misc.Amount += ele?.Amount;
            mainTotal.misc.Wt += ele?.Wt;
            mainTotal.misc.Pcs += ele?.Pcs;
            mainTotal.misc.Rate += ele?.Rate;
            mainTotal.misc.Amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            metal.push(ele);
            totals.metal.Wt += ele?.Wt;
            totals.metal.Pcs += ele?.Pcs;
            totals.metal.Rate += ele?.Rate;
            totals.metal.Amount += ele?.Amount;
            mainTotal.metal.Wt += ele?.Wt;
            mainTotal.metal.Pcs += ele?.Pcs;
            mainTotal.metal.Rate += ele?.Rate;
            mainTotal.metal.Amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 5) {
            finding.push(ele);
            totals.finding.Wt += ele?.Wt;
            totals.finding.Pcs += ele?.Pcs;
            totals.finding.Rate += ele?.Rate;
            totals.finding.Amount += ele?.Amount;
            mainTotal.finding.Wt += ele?.Wt;
            mainTotal.finding.Pcs += ele?.Pcs;
            mainTotal.finding.Rate += ele?.Rate;
            mainTotal.finding.Amount += ele?.Amount;
          }
        }
      });
      let obj = { ...e };
      // let separte = separatedOthAmt(obj);
      // obj.OtherAmountInfo = separte;

      obj.diamonds = diamonds;
      obj.colorstone = colorstone;
      obj.metal = metal;
      obj.misc = misc;
      obj.finding = finding;
      obj.totals = totals;
      let sumoflbr = e?.MakingAmount;
      obj.LabourAmountSum = sumoflbr;
      let sumofOth = e?.OtherCharges + e?.MiscAmount;
      obj.OtherChargeAmountSum = sumofOth;
      resultArr.push(obj);
    });

    let blankArray = [];

    arr1.forEach((e, i) => {
      let obj = { ...e };
      let diamonds = [];
      let colorStones = [];
      let metal = [];
      arr2.forEach((ele, ind) => {
        if (e?.SrJobno === ele?.StockBarcode) {
          if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            metal.push(ele);
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
            let findIndex = colorStones.findIndex(
              (elem) =>
                elem?.ShapeName === ele?.ShapeName &&
                elem?.Colorname === ele?.Colorname &&
                elem?.QualityName === ele?.QualityName
            );
            if (findIndex === -1) {
              colorStones.push(ele);
            } else {
              colorStones[findIndex].Pcs += ele?.Pcs;
              colorStones[findIndex].Wt += ele?.Wt;
            }
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
            let findIndex = diamonds.findIndex(
              (elem) =>
                elem?.ShapeName === ele?.ShapeName &&
                elem?.Colorname === ele?.Colorname &&
                elem?.QualityName === ele?.QualityName
            );
            if (findIndex === -1) {
              diamonds.push(ele);
            } else {
              diamonds[findIndex].Pcs += ele?.Pcs;
              diamonds[findIndex].Wt += ele?.Wt;
            }
          }
        }
      });
      obj.diamonds = diamonds;
      obj.colorStones = colorStones;
      obj.metal = metal;
      blankArray.push(obj);
    });

    setResultArray(blankArray);
    setMainTotal(mainTotal);

    const groupedObjects = {};
    arr2.forEach((item) => {
      if (arr1.some((srItem) => srItem.SrJobno === item.StockBarcode)) {
        if (!groupedObjects[item.StockBarcode]) {
          groupedObjects[item.StockBarcode] = [];
        }
        groupedObjects[item.StockBarcode].push(item);
      }
    });
    const resultArray = Object.keys(groupedObjects).map((key) => ({
      SrjobNo: key,
      data: groupedObjects[key],
    }));

    let arrResult = [];
    resultArray.forEach((e, i) => {
      const mergedArray = e.data.reduce((result, current) => {
        const existingItem = result.find(
          (item) =>
            item.Rate === current.Rate && item.ShapeName === current.ShapeName
        );
        if (existingItem) {
          existingItem.gwt += current.gwt;
          existingItem.cst += current.cst;
          existingItem.Rate += current.Rate;
          existingItem.Amount += current.Amount;
        } else {
          result.push({ ...current });
        }

        return result;
      }, []);
      arrResult.push({ jobNo: e.SrjobNo, data: mergedArray });
    });
    setGroupedArr(resultArray);

    let grandTot = totamt + arr?.AddLess;
    let allTax = taxGenrator(arr, grandTot);

    setTaxTotal(allTax);
    allTax?.forEach((el, i) => {
      totamt = totamt + +el?.amount;
    });
    setGrandTot(totamt);
    let words = CapitalizeWords(convertor.toWords(Math.round(totamt)));
    setInWords(words);
  };
  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn);
        if (data?.Status === "200") {
          let isEmpty = isObjectEmpty(data?.Data);
          if (!isEmpty) {
            loadData(data?.Data);
            setLoader(false);
          } else {
            setLoader(false);
            setMsg("Data Not Found");
          }
        } else {
          setLoader(false);
          setMsg(data?.Message);
        }
      } catch (error) {
        console.error(error);
      }
    };
    sendData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="containerJL pad_60_allPrint">
                <div className="btnpcl mb-4">
                  <Button />
                </div>
                <div className="printJL">
                  <div className="headlineJL">
                    <b style={{ fontSize: "15px" }}>
                      {headerData?.PrintHeadLabel}
                    </b>
                  </div>
                  <div className="headJL">
                    <div className="headJLContent">
                      <div className="fslhJL">
                        <h5>
                          <b style={{ fontSize: "13px", color: "black" }}>
                            {headerData?.CompanyFullName}
                          </b>
                        </h5>
                      </div>
                      <div className="fslhJL">{headerData?.CompanyAddress}</div>
                      <div className="fslhJL">
                        {headerData?.CompanyAddress2}
                      </div>
                      <div className="fslhJL">
                        {headerData?.CompanyCity}-{headerData?.CompanyPinCode},{" "}
                        {headerData?.CompanyState}({headerData?.CompanyCountry})
                      </div>
                      <div className="fslhJL">
                        Tell No: {headerData?.CompanyTellNo}
                      </div>
                      <div className="fslhJL">
                        {headerData?.CompanyEmail} |{" "}
                        {headerData?.CompanyWebsite}
                      </div>
                      <div className="fslhJL">
                        {headerData?.Company_VAT_GST_No} |{" "}
                        {headerData?.Cust_CST_STATE}-{headerData?.vat_cst_pan}
                      </div>
                    </div>
                    <div className="headJLImg">
                      <img
                        src={headerData?.PrintLogo}
                        alt="#"
                        id="JLImg"
                      />
                    </div>
                  </div>
                  <div className="dynamicHeadJLmain">
                    <div className="dynamicHeadJL1">
                      <div className="fslhJL">{headerData?.lblBillTo}</div>
                      <div className="fslhJL">
                        <b className="JL13">{headerData?.customerfirmname}</b>
                      </div>
                      {headerData?.customerAddress1?.length > 0 ? (
                        <div className="fslhJL">
                          {headerData?.customerAddress1}
                        </div>
                      ) : (
                        ""
                      )}
                      {headerData?.customerAddress2?.length > 0 ? (
                        <div className="fslhJL">
                          {headerData?.customerAddress2}
                        </div>
                      ) : (
                        ""
                      )}
                      {headerData?.customerAddress3?.length > 0 ? (
                        <div className="fslhJL">
                          {headerData?.customerAddress3}
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="fslhJL">
                        {headerData?.customercity}
                        {headerData?.customerpincode}
                      </div>
                      <div className="fslhJL">{headerData?.customeremail1}</div>
                      <div className="fslhJL">{headerData?.vat_cst_pan}</div>
                      <div className="fslhJL">
                        {headerData?.Cust_CST_STATE}{" "}
                        {headerData?.Cust_CST_STATE_No}
                      </div>
                    </div>
                    <div className="dynamicHeadJL2">
                      <div className="fslhJL">Ship to</div>
                      <div className="fslhJL">
                        <b className="JL13">{headerData?.customerfirmname}</b>
                      </div>
                      <div>
                        {
                          headerData?.address?.length > 0 &&
                          headerData?.address?.map((e, i) => {
                            return(
                              <div className="fslhJL"  key={i}>{e}</div>
                            )
                          })
                        }
                      </div>
                    </div>
                    <div className="dynamicHeadJL3">
                      <div className="billnoJL">
                        <div className="JLbillnow fslhJL ">
                          <b className="JL13">BILL NO</b>
                        </div>
                        <div className="billno3pdlJL JL13 w-100">
                          {headerData?.InvoiceNo}
                        </div>
                      </div>
                      <div className="billnoJL">
                        <div className="JLbillnow fslhJL">
                          <b className="JL13">DATE</b>
                        </div>
                        <div className="billno3pdlJL JL13 w-100">
                          {headerData?.EntryDate}
                        </div>
                      </div>
                      <div className="billnoJL">
                        <div className="JLbillnow fslhJL">
                          <b className="JL13">HSN</b>
                        </div>
                        <div className="billno3pdlJL JL13 w-100">
                          {headerData?.HSN_No}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tableJL">
                    <div className="theadJL fw-bold">
                      <div className="tc1JL h-100">Sr#</div>
                      <div className="tc2JL h-100">Description</div>
                      <div className="tc5JL h-100">
                        <div className="tc5JL1">Gold</div>
                        <div className="tc5JL2">
                          <div className="d-flex justify-content-center align-items-center w-50 h-100 brrJL">
                            Quality
                          </div>
                          <div className="d-flex justify-content-center align-items-center w-50 h-100">
                            Gross/Net.
                          </div>
                        </div>
                      </div>
                      <div className="tc5JL h-100">
                        <div className="tc5JL1">Diamond</div>
                        <div className="tc5JL2">
                          <div className="d-flex justify-content-center align-items-center w-50 h-100 brrJL">
                            Detail
                          </div>
                          <div className="d-flex justify-content-center align-items-center w-50 h-100">
                            Wt.
                          </div>
                        </div>
                      </div>
                      <div className="tc5JL h-100">
                        <div className="tc5JL1">Colorstone</div>
                        <div className="tc5JL2">
                          <div className="d-flex justify-content-center align-items-center w-50 h-100 brrJL">
                            Detail
                          </div>
                          <div className="d-flex justify-content-center align-items-center w-50 h-100">
                            Wt.
                          </div>
                        </div>
                      </div>
                      <div className="tc6JL d-flex justify-content-center h-100">
                        Others
                      </div>
                      <div className="tc7JL d-flex justify-content-center h-100">
                        Labour
                      </div>
                      <div
                        className="tc8JL d-flex justify-content-center h-100"
                        style={{ borderRight: "0px" }}
                      >
                        Total
                      </div>
                    </div>
                    <div className="tbodyJL ">
                      {resultArray.length > 0 &&
                        resultArray?.map((e, i) => {
                          return (
                            <div className="trowJL no_break fsJL" key={i}>
                              <div className="tc1JL">{e?.SrNo}</div>
                              <div className="tc2JL">
                                <div>{e?.Categoryname}</div>
                                <div className="d-flex">
                                  <div>{e?.designno} | </div>
                                  <div>{e?.SrJobno}</div>
                                </div>
                              </div>
                              <div className="tc3JL">
                                <div className="tc4JL2 h-100">
                                  <div className="d-flex justify-content-start align-items-center w-50 h-100  brrJL ps-1">
                                    {e?.MetalPurity} / {e?.MetalType}{" "}
                                    {e?.MetalColor}
                                  </div>
                                  <div className="d-flex justify-content-end align-items-center w-50 h-100  pe-1">
                                    {e?.grosswt?.toFixed(3)}/
                                    {e?.NetWt?.toFixed(3)}
                                  </div>
                                </div>
                              </div>
                              <div className="tc4JL">
                                {e?.diamonds?.length > 0 ? (
                                  e?.diamonds?.map((el, i) => {
                                    return (
                                      <div className="tc4JL2 h-100" key={i}>
                                        <div className="d-flex justify-content-start ps-1 align-items-center w-50 h-100 brrJL">
                                          {el?.ShapeName} {el?.QualityName}{" "}
                                          {el?.Colorname}
                                        </div>
                                        <div className="d-flex justify-content-end pe-1 align-items-center h-100 w-50 ">
                                          {el?.Pcs}/{el?.Wt?.toFixed(3)}
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="tc4JL2 h-100" key={i}>
                                    <div className="d-flex justify-content-center align-items-center w-50 h-100 brrJL">
                                      {/* {el?.ShapeName} {el?.QualityName} {el?.Colorname} */}
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center h-100 w-50 ">
                                      {/* {el?.Pcs}/{el?.Wt?.toFixed(3)} */}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="tc5JL">
                                {e?.colorStones?.length > 0 ? (
                                  e?.colorStones?.map((el, i) => {
                                    return (
                                      <div className="tc4JL2 h-100" key={i}>
                                        <div className="d-flex justify-content-start ps-1 align-items-center w-50 h-100 brrJL">
                                          {el?.ShapeName} {el?.QualityName}{" "}
                                          {el?.Colorname}
                                        </div>
                                        <div className="d-flex justify-content-end pe-1 align-items-center h-100 w-50 ">
                                          {el?.Pcs}/{el?.Wt?.toFixed(3)}
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="tc4JL2 h-100" key={i}>
                                    <div className="d-flex justify-content-center align-items-center w-50 h-100 brrJL">
                                      {/* {el?.ShapeName} {el?.QualityName} {el?.Colorname} */}
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center h-100 w-50 ">
                                      {/* {el?.Pcs}/{el?.Wt?.toFixed(3)} */}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="tc6JL">
                                {NumberWithCommas(e?.OtherCharges, 2)}
                              </div>
                              <div className="tc7JL">
                                {NumberWithCommas(e?.MakingAmount, 2)}
                              </div>
                              <div
                                className="tc8JL"
                                style={{ borderRight: "0px" }}
                              >
                                {NumberWithCommas(e?.UnitCost, 2)}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    <div
                      className="totalrowJL fw-bold fsJL no_break"
                      style={{ borderTop: "0px" }}
                    >
                      <div className="tc1JL h-100"></div>
                      <div className="tc2JL fs-6 h-100">TOTAL</div>
                      <div className="tc3JL h-100">
                        <div className="tc4JL2 h-100">
                          <div className="d-flex justify-content-center align-items-center w-50 h-100 brrJL"></div>
                          <div className="d-flex justify-content-end pe-1 align-items-center w-50 h-100">
                            {mainTotal?.totalgrosswt?.grosswt?.toFixed(3)}/
                            {mainTotal?.totalnetwt?.netwt?.toFixed(3)}
                          </div>
                        </div>
                      </div>
                      <div className="tc4JL h-100">
                        <div className="tc4JL2 h-100">
                          <div className="d-flex justify-content-center align-items-center w-50 h-100 brrJL"></div>
                          <div className="d-flex justify-content-end pe-1 align-items-center w-50 h-100">
                            {mainTotal?.diamonds?.Pcs}/
                            {mainTotal?.diamonds?.Wt?.toFixed(3)}
                          </div>
                        </div>
                      </div>
                      <div className="tc5JL h-100">
                        <div className="tc5JL2 h-100">
                          <div className="d-flex justify-content-center align-items-center w-50 h-100 brrJL"></div>
                          <div className="d-flex justify-content-end pe-1 align-items-center w-50 h-100">
                            {mainTotal?.colorstone?.Pcs}/
                            {mainTotal?.colorstone?.Wt?.toFixed(3)}
                          </div>
                        </div>
                      </div>
                      <div className="tc6JL d-flex justify-content-end pe-1 h-100">
                        {/* {mainTotal?.totalOtherAmount?.toFixed(2)} */}
                        {NumberWithCommas(mainTotal?.totalOtherAmount, 2)}
                      </div>
                      <div className="tc7JL d-flex justify-content-end pe-1 h-100">
                        {/* {mainTotal?.totallabourAmount?.toFixed(2)} */}
                        {NumberWithCommas(mainTotal?.totallabourAmount, 2)}
                      </div>
                      <div
                        className="tc8JL d-flex justify-content-end pe-1 h-100"
                        style={{ borderRight: "0px" , fontSize:"10px"}}
                      >
                        {/* {mainTotal?.totalunitCost?.toFixed(2)} */}
                        {NumberWithCommas(mainTotal?.totalunitCost, 2)}
                      </div>
                    </div>
                    <div className="footerJL fsJL d-flex justify-content-between align-items-end no_break ">
                      <div className="inWordsJL">
                        <div className="fw-bold py-1 px-1">
                          In Words Indian Rupees
                        </div>
                        <div className="fw-bold py-2 px-1">{inWords}</div>
                      </div>
                      <div className="footerTotJL">
                        <div className="brJL">
                          <div className="d-flex flex-column justify-content-between px-1">
                            {taxTotal?.map((e, i) => {
                              return (
                                <div
                                  className="d-flex justify-content-between px-1"
                                  key={i}
                                >
                                  <div className="w-50 d-flex justify-content-end align-items-center pe-1 brrJL">
                                    {e?.name} {e?.per}
                                  </div>
                                  <div className="w-50 d-flex justify-content-end align-items-center ">
                                    {NumberWithCommas(e?.amount, 2)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 d-flex justify-content-end align-items-center pe-1 brrJL">
                              Less
                            </div>
                            <div className="w-50 d-flex justify-content-end align-items-center pe-1 ">
                              {headerData?.AddLess?.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between px-1 grandTotalJL">
                          <div
                            className="fw-bold w-50 d-flex align-items-center justify-content-end  pe-1 brrJL"
                            style={{ fontSize: "15px" }}
                          >
                            Grand Total
                          </div>
                          <div
                            className="fw-bold w-50 d-flex align-items-center justify-content-end pe-1"
                            style={{ fontSize: "15px" }}
                          >
                             {NumberWithCommas(grandTot, 2)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="noteJL fw-bold p-1 no_break"
                      
                      dangerouslySetInnerHTML={{
                        __html: headerData?.Declaration,
                      }}
                    ></div>
                    <div
                      className="dynamicHeadJLmain no_break"
                      style={{ marginTop:"2px", marginBottom:"2rem" }}
                    >
                      <div className="dynamicHeadJL1">
                        <div className="fslhJL fw-bold">Bank Detail</div>
                        <div className="fslhJL">
                          <b className="JL13 fw-normal">
                            Bank Name : {headerData?.bankname}
                          </b>
                        </div>
                        <div className="fslhJL">
                          BRANCH: {headerData?.bankaddress}
                        </div>
                        <div className="fslhJL">
                          Account Name : {headerData?.accountname}
                        </div>
                        <div className="fslhJL">
                          Account Number : {headerData?.accountnumber}
                        </div>
                        <div className="fslhJL">
                          RTGS/NEFT IFSC:{headerData?.customerAddress3}
                        </div>
                        <div className="fslhJL"></div>
                      </div>
                      <div className="dynamicHeadJL2D">
                        <div className="mt-1">Signature</div>
                        <div className="fw-bold mb-2">{headerData?.customerfirmname}</div>
                      </div>
                      <div className="dynamicHeadJL3D ">
                        <div>Signature</div>
                        <div className="fw-bold">{headerData?.CompanyFullName}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
              {msg}
            </p>
          )}
        </>
      )}
    </>
  );
};

export default JewelleryInvoicePrint;
