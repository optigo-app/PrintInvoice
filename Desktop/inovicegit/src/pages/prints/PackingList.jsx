import React, { useEffect, useState } from "react";
import "../../assets/css/prints/packinglist.css";
import Button from "../../GlobalFunctions/Button";
import axios from "axios";
import Loader from "../../components/Loader";
import { taxGenrator } from "../../GlobalFunctions";

const PackingList = ({ urls, token, invoiceNo, printName,evn }) => {
  const [headerData, setHeaderData] = useState({});
  const [dynamicList1, setDynamicList1] = useState([]);
  const [dynamicList2, setDynamicList2] = useState([]);
  const [mainTotal, setMainTotal] = useState({});
  const [resultArray, setAesultArray] = useState([]);
  const [totalgrosswt, setTotalgrosswt] = useState(0);
  const [totalnetlosswt, setTotalnetlosswt] = useState(0);
  const [totalLabourAmount, setTotalLabourAmount] = useState(0);
  const [totalOtherAmount, setTotalOtherAmount] = useState(0);
  const [responsejson, setResponsejson] = useState("");
  const [jwtotlbrAmt, setJwtotlbrAmt] = useState(0);
  const [jwtotothAmt, setJwtotothAmt] = useState(0);
  const [taxtotal, setTaxTotal] = useState([]);
  const [grandtot, setGrandTot] = useState([]);
  const totalObj = {
    totdiapcs: 0,
    totdiawt: 0,
    totdiaamt: 0,
    totcspcs: 0,
    totcswt: 0,
    totcsamt: 0,
    totmiscpcs: 0,
    totmiscwt: 0,
    totmiscamt: 0,
    totmtpcs: 0,
    totmtwt: 0,
    totmtamt: 0,
    totstpcs: 0,
    totstwt: 0,
    totstamt: 0,
    totalAmt: 0,
    totmakingAmt: 0,
    totOthAmt: 0,
    totDiscount: 0,
    totfinewt: 0,
    totgrosswt: 0,
    totnetwt: 0,
    totlbramt: 0,
  };
  let diamondList = [];
  let colorStoneList = [];
  let miscList = [];
  let metalList = [];
  let findingList = [];
  let stoneMiscList = [];

  const organizeData = (arr, arr1, arr2) => {
    let totgrosswt = 0;
    let totnetlosswt = 0;
    let totallbrAmt = 0;
    let totalOtherAmt = 0;

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
    };
    let resultArr = [];
    let totalAmt = 0;
    console.log(arr);
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

        labour: {
          labourAmount: 0,
        },

        OtherCh: {
          OtherAmount: 0,
        },
      };

      totgrosswt += e?.grosswt;

      totnetlosswt = totnetlosswt + +e?.NetWt + +e?.LossWt;
      totals.labour.labourAmount = totals.labour.labourAmount + e?.MakingAmount;
      totals.OtherCh.OtherAmount =
        totals.OtherCh.OtherAmount + e?.OtherCharges + e?.MiscAmount;
      totallbrAmt += e?.MakingAmount;
      totalOtherAmt += e?.OtherCharges + e?.MiscAmount;

      totalAmt = totalAmt + e?.TotalAmount;

      arr2.map((ele, ind) => {
        if (e.SrJobno === ele?.StockBarcode) {
          if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
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

    let allTax = taxGenrator(arr, totalAmt);

    setGrandTot(totalAmt);
    allTax?.forEach((e) => {
      totalAmt += +e?.amount;
    });
    setTaxTotal(allTax);
    setAesultArray(resultArr);
    setMainTotal(mainTotal);
    setTotalgrosswt(totgrosswt);
    setTotalnetlosswt(totnetlosswt);
    setTotalLabourAmount(totallbrAmt);
    setTotalOtherAmount(totalOtherAmt);
  };

  async function loadData() {
    try {
      const body = {
        token: token,
        invoiceno: invoiceNo,
        printname: printName,
        Eventname: evn
      };

      const data = await axios.post(urls, body);
      if (data?.data?.Status == 200) {
        let datas = data?.data?.Data;
        setResponsejson(datas);
        setHeaderData(datas?.BillPrint_Json[0]);
        setDynamicList1(datas?.BillPrint_Json1);
        setDynamicList2(datas?.BillPrint_Json2);
        organizeData(
          datas?.BillPrint_Json[0],
          datas?.BillPrint_Json1,
          datas?.BillPrint_Json2
        );
      } else {
        console.log(data?.data?.Status, data?.data?.Message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  dynamicList2?.length > 0 &&
    dynamicList2.map((e, i) => {
      if (e?.MasterManagement_DiamondStoneTypeid === 1) {
        totalObj.totdiapcs = totalObj.totdiapcs + +e?.Pcs;
        totalObj.totdiawt = totalObj.totdiawt + +e?.Wt;
        totalObj.totdiaamt = totalObj.totdiaamt + +e?.Amount;
        diamondList.push(e);
      }
      if (e?.MasterManagement_DiamondStoneTypeid === 2) {
        totalObj.totcspcs = totalObj.totcspcs + e?.Pcs;
        totalObj.totcswt = totalObj.totcswt + e?.Wt;
        totalObj.totcsamt = totalObj.totcsamt + e?.Amount;
        colorStoneList.push(e);
      }
      if (e?.MasterManagement_DiamondStoneTypeid === 3) {
        totalObj.totmiscpcs = totalObj.totmiscpcs + e?.Pcs;
        totalObj.totmiscwt = totalObj.totmiscwt + e?.Wt;
        totalObj.totmiscamt = totalObj.totmiscamt + e?.Amount;
        miscList.push(e);
      }
      if (e?.MasterManagement_DiamondStoneTypeid === 4) {
        totalObj.totmtpcs = totalObj.totmtpcs + e?.Pcs;
        totalObj.totmtwt = totalObj.totmtwt + e?.Wt;
        totalObj.totmtamt = totalObj.totmtamt + e?.Amount;
        metalList.push(e);
      }
      if (e?.MasterManagement_DiamondStoneTypeid === 5) {
        findingList.push(e);
      }
      if (
        e?.MasterManagement_DiamondStoneTypeid === 2 ||
        e.MasterManagement_DiamondStoneTypeid === 3
      ) {
        totalObj.totstpcs = totalObj.totstpcs + e?.Pcs;
        totalObj.totstwt = totalObj.totstwt + e?.Wt;
        totalObj.totstamt = totalObj.totstamt + e?.Amount;
      }
    });
  const handleImageError = (e) => {
    e.target.src =
      "https://d12oja0ew7x0i8.cloudfront.net/images/Article_Images/ImageForArticle_19533_16006923254289023.png";
  };
  dynamicList1.map((e) => {
    totalObj.totlbramt = totalObj.totlbramt + e?.MaKingCharge_Unit;
    totalObj.totalAmt = totalObj.totalAmt + e?.TotalAmount;
    totalObj.totmakingAmt = totalObj.totmakingAmt + e?.MakingAmount;
    totalObj.totDiscount = totalObj.totDiscount + e?.DiscountAmt;
    totalObj.totgrosswt = totalObj.totgrosswt + e?.grosswt;
    totalObj.totnetwt = totalObj.totnetwt + e?.NetWt;
    totalObj.totOthAmt = totalObj.totOthAmt + e?.OtherCharges + e?.MiscAmount;
  });

  // console.log(headerData);
  // console.log(dynamicList2);

  return (
    <>
      {responsejson?.length === 0 ? (
        <Loader />
      ) : (
        <>
          <div className="btnpcl">
            <Button />
          </div>
          <div className="pclprint">
            <div className="pclheader">
              <div className="orailpcl">
                <img src={headerData?.PrintLogo} alt="orail" id="orailpcl" />
              </div>
              <div className="addresspcl fspcl">
                {headerData?.CompanyAddress} {headerData?.CompanyAddress2}{" "}
                {headerData?.CompanyCity} - {headerData?.CompanyPinCode}
              </div>
              <div className="pclheaderplist">{headerData?.PrintHeadLabel}</div>
              <div>
                <b style={{ fontSize: "12px" }}>{headerData?.PrintRemark}</b>
              </div>
            </div>
            <div className="pclsubheader">
              <div className="partynamepcl">
                <b className="partypcl">Party:</b>
                <div className="contentpclparty">
                  {headerData?.customerfirmname}
                </div>
              </div>
              <div>
                <div className="invnopcl">
                  <div className="invnolabelpcl">Invoice No: </div>
                  <b className="pclinvno">{headerData?.InvoiceNo}</b>
                </div>
                <div className="invnopcl">
                  <div className="invnolabelpcl">Date: </div>
                  <b className="pclinvno">{headerData?.EntryDate}</b>
                </div>
              </div>
            </div>
            <div className="pcltable">
              <div className="pcltablecontent">
                <div className="pcltablehead border-start border-end border-bottom border-black">
                  <div className="srnopclthead centerpcl fwboldpcl fspcl">
                    Sr No
                  </div>
                  <div className="jewpclthead fwboldpcl fspcl">Jewelcode</div>
                  <div className="diamheadpcl">
                    <p className="diamhpclcol1 fwboldpcl fspcl">Diamond</p>
                    <p className="diamhpclcol">
                      <p className="dcolsthpcl centerpcl fwboldpcl fspcl">
                        Shape
                      </p>
                      <p className="dcolsthpcl centerpcl fwboldpcl fspcl">
                        Size
                      </p>
                      <p className="dcolsthpcl centerpcl fwboldpcl fspcl">Wt</p>
                      <p className="dcolsthpcl centerpcl fwboldpcl fspcl">
                        Rate
                      </p>
                      <p
                        className="dcolsthpcl centerpcl fwboldpcl fspcl"
                        style={{ borderRight: "0px" }}
                      >
                        Amount
                      </p>
                    </p>
                  </div>
                  <div className="diamheadpcl">
                    <p className="diamhpclcol1 fwboldpcl fspcl">Metal</p>
                    <p className="diamhpclcol">
                      <p className="dcolsthpcl centerpcl fwboldpcl fspcl">KT</p>
                      <p className="dcolsthpcl centerpcl fwboldpcl fspcl">
                        Gr Wt
                      </p>
                      <p className="dcolsthpcl centerpcl fwboldpcl fspcl">
                        N + L
                      </p>
                      <p className="dcolsthpcl centerpcl fwboldpcl fspcl">
                        Rate
                      </p>
                      <p
                        className="dcolsthpcl centerpcl fwboldpcl fspcl"
                        style={{ borderRight: "0px" }}
                      >
                        Amount
                      </p>
                    </p>
                  </div>
                  <div className="shptheadpcl">
                    <p className="shpcolpcl1 fwboldpcl fspcl">Stone</p>
                    <p className="shpcolpclcol">
                      <p className="shpthcolspcl centerpcl fwboldpcl fspcl">
                        Shape
                      </p>
                      <p className="shpthcolspcl centerpcl fwboldpcl fspcl">
                        Wt
                      </p>
                      <p className="shpthcolspcl centerpcl fwboldpcl fspcl">
                        Rate
                      </p>
                      <p
                        className="shpthcolspcl centerpcl fwboldpcl fspcl"
                        style={{ borderRight: "0px" }}
                      >
                        Amount
                      </p>
                    </p>
                  </div>
                  <div className="lotheadpcl">
                    <p className="lbhthpcl fwboldpcl fspcl">Labour</p>
                    <p className="lbhthpclcol">
                      <p className="lopclcol centerpcl fwboldpcl fspcl">Rate</p>
                      <p
                        className="lopclcol centerpcl fwboldpcl fspcl"
                        style={{ borderRight: "0px" }}
                      >
                        Amount
                      </p>
                    </p>
                  </div>
                  <div className="lotheadpcl">
                    <p className="lbhthpcl fwboldpcl fspcl">Other</p>
                    <p className="lbhthpclcol">
                      <p className="lopclcol centerpcl fwboldpcl fspcl">Code</p>
                      <p
                        className="lopclcol centerpcl fwboldpcl fspcl"
                        style={{ borderRight: "0px" }}
                      >
                        Amount
                      </p>
                    </p>
                  </div>
                  <div className="pricetheadpcl fwboldpcl fspcl">Price</div>
                </div>
                {resultArray?.map((e, i) => {
                  return (
                    <div
                      className="tablebodypcl border-start border-end border-bottom border-black"
                      key={i}
                    >
                      <div className="tbodyrowpcl">
                        <div className="pcltbr1c1 fspcl">{e?.SrNo}</div>
                        <div className="pcltbr1c2 fspcl">
                          <div>{e?.SrJobno}</div>
                          <div className="designimgpcl fspcl">
                            <img
                              src={e?.DesignImage}
                              alt="packinglist"
                              id="designimgpclid"
                            />
                          </div>
                          <div>{e?.CertificateNo}</div>
                          <div>{e?.HUID}</div>
                        </div>
                        {/* diamond */}
                        <div className="pcltbr1c3 fspcl">
                          <div className="dcolsthpcl fspcl">
                            {
                              // eslint-disable-next-line array-callback-return
                              e?.diamonds?.map((ele, i) => {
                                return (
                                  <p className="leftpcl fspcl" key={i}>
                                    {ele?.ShapeName}
                                  </p>
                                );
                                // if (ele?.StockBarcode === e?.SrJobno) {
                                //     return <p>{ele?.ShapeName}</p>;
                                // }
                              })
                            }
                          </div>
                          <div className="dcolsthpcl fspcl">
                            {" "}
                            {
                              // eslint-disable-next-line array-callback-return
                              e?.diamonds?.map((ele, i) => {
                                // if (ele?.StockBarcode === e?.SrJobno) {
                                return (
                                  <p className="leftpcl fspcl" key={i}>
                                    {ele?.SizeName}
                                  </p>
                                );
                                // }
                              })
                            }
                          </div>
                          <div className="dcolsthpcl fspcl">
                            {
                              // eslint-disable-next-line array-callback-return
                              e?.diamonds?.map((ele, i) => {
                                return (
                                  <p className="rightpcl fspcl" key={i}>
                                    {ele?.Wt?.toFixed(3)}
                                  </p>
                                );
                              })
                            }
                          </div>
                          <div className="dcolsthpcl fspcl">
                            {
                              // eslint-disable-next-line array-callback-return
                              e?.diamonds?.map((ele, i) => {
                                return (
                                  <p className="rightpcl fspcl" key={i}>
                                    {ele?.Rate?.toFixed(2)}
                                  </p>
                                );
                              })
                            }
                          </div>
                          <div
                            className="dcolsthpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            {
                              // eslint-disable-next-line array-callback-return
                              e?.diamonds?.map((ele, i) => {
                                return (
                                  <p className="rightpcl fspcl" key={i}>
                                    {ele?.Amount?.toFixed(2)}
                                  </p>
                                );
                              })
                            }
                          </div>
                        </div>
                        {/* metal */}
                        <div className="pcltbr1c3 fspcl">
                          <div className="dcolsthpcl fspcl">
                            {
                              // eslint-disable-next-line array-callback-return
                              e?.metal?.map((ele, i) => {
                                return (
                                  <p className="leftpcl fspcl">
                                    {ele?.ShapeName + " " + ele?.QualityName}
                                  </p>
                                );
                              })
                            }
                          </div>
                          <div className="dcolsthpcl rightpcl fspcl">
                            {e?.grosswt?.toFixed(3)}
                          </div>
                          <div className="dcolsthpcl rightpcl fspcl">
                            {(
                              +e?.NetWt?.toFixed(3) + +e?.LossWt?.toFixed(3)
                            )?.toFixed(3)}
                          </div>
                          <div className="dcolsthpcl fspcl">
                            {" "}
                            {
                              // eslint-disable-next-line array-callback-return
                              e?.metal?.map((ele, i) => {
                                return (
                                  <p className="rightpcl fspcl" key={i}>
                                    {ele?.Rate?.toFixed(2)}
                                  </p>
                                );
                              })
                            }
                          </div>
                          <div
                            className="dcolsthpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            {
                              // eslint-disable-next-line array-callback-return
                              e?.metal?.map((ele, i) => {
                                return (
                                  <p className="rightpcl fspcl" key={i}>
                                    {ele?.Amount?.toFixed(2)}
                                  </p>
                                );
                              })
                            }
                          </div>
                        </div>
                        {/* colorstone */}
                        <div className="pcltbr1c5 fspcl">
                          <div className="shpthcolspcl fspcl">
                            {
                              // eslint-disable-next-line array-callback-return
                              e?.colorstone?.map((ele, i) => {
                                return (
                                  <p className="leftpcl fspcl" key={i}>
                                    {ele?.ShapeName}
                                  </p>
                                );
                              })
                            }
                          </div>
                          <div className="shpthcolspcl fspcl">
                            {
                              // eslint-disable-next-line array-callback-return
                              e?.colorstone?.map((ele, i) => {
                                return (
                                  <p className="rightpcl fspcl" key={i}>
                                    {ele?.Wt?.toFixed(3)}
                                  </p>
                                );
                              })
                            }
                          </div>
                          <div className="shpthcolspcl fspcl">
                            {
                              // eslint-disable-next-line array-callback-return
                              e?.colorstone?.map((ele, i) => {
                                return (
                                  <p className="rightpcl fspcl" key={i}>
                                    {ele?.Rate?.toFixed(2)}
                                  </p>
                                );
                              })
                            }
                          </div>
                          <div
                            className="shpthcolspcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            {
                              // eslint-disable-next-line array-callback-return
                              e?.colorstone?.map((ele, i) => {
                                return (
                                  <p className="rightpcl fspcl" key={i}>
                                    {ele?.Amount?.toFixed(2)}
                                  </p>
                                );
                              })
                            }
                          </div>
                        </div>
                        {/* labour */}
                        <div className="pcltbr1c6 fspcl">
                          <div className="lopclcol rightpcl fspcl">
                            {e?.MaKingCharge_Unit.toFixed(2)}
                          </div>
                          <div
                            className="lopclcol rightpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            {e?.MakingAmount?.toFixed(2)}
                          </div>
                        </div>
                        {/* othercharge */}
                        <div className="pcltbr1c6 fspcl">
                          <div className="lopclcol fspcl"></div>
                          <div
                            className="lopclcol fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            <p className="rightpcl fspcl">
                              {e?.OtherCharges?.toFixed(2)}
                            </p>
                            <p className="rightpcl fspcl">
                              {e?.MiscAmount?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        {/* price */}
                        <div
                          className="pcltbr1c7 rightpcl fwboldpcl fspcl"
                          style={{ borderRight: "0px" }}
                        >
                          {e?.UnitCost?.toFixed(2)}
                        </div>
                      </div>
                      <div
                        className="tbodyrowpcltot fspcl"
                        style={{ borderTop: "1px solid #989898" }}
                      >
                        <div
                          className="srpcltotrowtb fspcl"
                          style={{ backgroundColor: "white", height: "14px" }}
                        ></div>
                        <div
                          className="jwlpcltotrowtb fspcl"
                          style={{ backgroundColor: "white", height: "14px" }}
                        ></div>
                        <div className="diapcltotrowtb fspcl">
                          <p className="dcolsthpcl"></p>
                          <p className="dcolsthpcl"></p>
                          <p className="dcolsthpcl rightpcl fwboldpcl fspcl">
                            {e?.totals?.diamonds?.Wt?.toFixed(3)}
                          </p>
                          <p className="dcolsthpcl"></p>
                          <p
                            className="dcolsthpcl rightpcl fwboldpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            {e?.totals?.diamonds?.Amount?.toFixed(2)}
                          </p>
                        </div>
                        <div className="diapcltotrowtb">
                          <p className="dcolsthpcl"></p>
                          <p className="dcolsthpcl rightpcl fwboldpcl fspcl">
                            {e?.grosswt?.toFixed(3)}
                          </p>
                          <p className="dcolsthpcl rightpcl fwboldpcl fspcl">
                            {(
                              +e?.NetWt?.toFixed(3) + +e?.LossWt?.toFixed(3)
                            )?.toFixed(3)}
                          </p>
                          <p className="dcolsthpcl"></p>
                          <p
                            className="dcolsthpcl rightpcl fwboldpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            {e?.totals?.metal?.Amount?.toFixed(2)}
                          </p>
                        </div>
                        <div className="stnpcltotrowtb">
                          <p className="shpthcolspcl"></p>
                          <p className="shpthcolspcl rightpcl fwboldpcl fspcl">
                            {e?.totals?.colorstone?.Wt?.toFixed(3)}
                          </p>
                          <p className="shpthcolspcl"></p>
                          <p
                            className="shpthcolspcl rightpcl fwboldpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            {e?.totals?.colorstone?.Amount?.toFixed(2)}
                          </p>
                        </div>
                        <div className="lopcltotrowtb">
                          <p className="lopclcol"></p>

                          <p
                            className="lopclcol rightpcl fwboldpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            {e?.LabourAmountSum?.toFixed(2)}
                          </p>
                        </div>
                        <div className="lopcltotrowtb">
                          <p className="lopclcol"></p>
                          <p
                            className="lopclcol rightpcl fwboldpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            {e?.OtherChargeAmountSum?.toFixed(2)}
                          </p>
                        </div>
                        <div
                          className="prpcltotrowtb rightpcl fwboldpcl fspcl"
                          style={{ borderRight: "0px" }}
                        >
                          {e?.UnitCost?.toFixed(2)}
                        </div>
                      </div>
                      <div
                        className="tbodyrowpcltot fspcl"
                        style={{
                          borderTop: "1px solid #989898",
                          borderBottom: "1px solid #989898",
                        }}
                      >
                        <div
                          className="srpcltotrowtb fspcl"
                          style={{ backgroundColor: "white", height: "13px" }}
                        ></div>
                        <div
                          className="jwlpcltotrowtb fspcl"
                          style={{ backgroundColor: "white", height: "13px" }}
                        ></div>
                        <div className="diapcltotrowtb fspcl"></div>
                        <div className="diapcltotrowtb"></div>
                        <div className="stnpcltotrowtb"></div>
                        <div
                          className="lopcltotrowtb dispcltotrowtb"
                          style={{ width: "230.5px" }}
                        >
                          <p className="discpclcs fwboldpcl fspcl">
                            Discount {e?.Discount}% @Total Amount
                          </p>
                          <p
                            className="disvalpclcs rightpcl fwboldpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            {e?.DiscountAmt?.toFixed(2)}
                          </p>
                        </div>
                        <div
                          className="prpcltotrowtb rightpcl fwboldpcl fspcl"
                          style={{ borderRight: "0px" }}
                        >
                          {e?.TotalAmount?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div
                className="tbodyrowpcltot border-start border-end border-black"
                style={{ borderBottom: "1px solid black", height: "16px" }}
              >
                <div className="srpcltotrowtb"></div>
                <div className="jwlpcltotrowtb fspcl">
                  <b>TOTAL</b>
                </div>
                <div className="diapcltotrowtb">
                  <p className="dcolsthpcl"></p>
                  <p className="dcolsthpcl"></p>
                  <p className="dcolsthpcl rightpcl fwboldpcl fspcl">
                    {mainTotal?.diamonds?.Wt?.toFixed(3)}
                    {/* {e?.totals?.diamonds?.Wt?.toFixed(3)} */}
                  </p>
                  <p className="dcolsthpcl"></p>
                  <p
                    className="dcolsthpcl rightpcl fwboldpcl fspcl"
                    style={{ borderRight: "0px" }}
                  >
                    {mainTotal?.diamonds?.Amount?.toFixed(2)}
                  </p>
                </div>
                <div className="diapcltotrowtb">
                  <p className="dcolsthpcl"></p>
                  <p className="dcolsthpcl rightpcl fwboldpcl fspcl">
                    {totalgrosswt?.toFixed(3)}
                    {/* {console.log(mainTotal?.colorstone?.Wt?.toFixed(3))} */}
                    {/* {mainTotal?.colorstone?.Wt?.toFixed(3)} */}
                  </p>
                  <div className="dcolsthpcl rightpcl fwboldpcl fspcl">
                    {totalnetlosswt?.toFixed(3)}`
                    {/* {`
                                (
                                    (+e?.NetWt?.toFixed(3)) + (+e?.LossWt?.toFixed(3))
                                )?.toFixed(3)
                            } */}
                  </div>
                  <p className="dcolsthpcl"></p>
                  <p
                    className="dcolsthpcl rightpcl fwboldpcl fspcl"
                    style={{ borderRight: "0px" }}
                  >
                    {mainTotal.metal?.Amount?.toFixed(2)}
                  </p>
                </div>
                <div className="stnpcltotrowtb">
                  <p className="shpthcolspcl"></p>
                  <p className="shpthcolspcl rightpcl fwboldpcl fspcl">
                    {mainTotal?.colorstone?.Wt?.toFixed(3)}
                  </p>
                  <p className="shpthcolspcl"></p>
                  <p
                    className="shpthcolspcl rightpcl fwboldpcl fspcl"
                    style={{ borderRight: "0px" }}
                  >
                    {mainTotal?.colorstone?.Amount?.toFixed(2)}
                  </p>
                </div>
                <div className="lopcltotrowtb">
                  <p className="lopclcol"></p>
                  <p
                    className="lopclcol rightpcl fwboldpcl fspcl"
                    style={{ borderRight: "0px" }}
                  >
                    {totalObj.totmakingAmt?.toFixed(2)}
                  </p>
                </div>
                <div className="lopcltotrowtb">
                  <p className="lopclcol"></p>
                  <p
                    className="lopclcol rightpcl fwboldpcl fspcl"
                    style={{ borderRight: "0px" }}
                  >
                    {totalOtherAmount?.toFixed(2)}
                  </p>
                  {/* <p className='lopclcol rightpcl fwboldpcl' style={{ borderRight: "0px" }}>{totalObj.totOthAmt?.toFixed(2)}</p> */}
                </div>
                <div
                  className="prpcltotrowtb rightpcl fwboldpcl fspcl"
                  style={{ borderRight: "0px" }}
                >
                  {/* {e?.UnitCost?.toFixed(2)} */}
                  {grandtot?.toFixed(2)}
                </div>
              </div>
              <div className="tablebodypcl  border-start border-end border-bottom border-black">
                <div className="totdispcl">
                  <p className="summaryalignpcl fspcl">Total Discount</p>
                  <p className="fspcl">{totalObj?.totDiscount?.toFixed(2)}</p>
                </div>
                {taxtotal?.length > 0 &&
                  taxtotal?.map((e, i) => {
                    return (
                      <div className="d-flex totdispcl fspcl">
                        <div className="d-flex justify-content-end w-50">
                          {e?.name} {e?.per}
                        </div>

                        <div className="d-flex justify-content-end w-50">
                          {e?.amount}
                        </div>
                      </div>
                    );
                  })}

                <div className="totdispcl">
                  <p className="summaryalignpcl fspcl">
                    {headerData?.AddLess?.toFixed(2) > 0 ? "ADD" : "Less"}
                  </p>
                  <p className="fspcl">{headerData?.AddLess?.toFixed(2)}</p>
                </div>
                <div className="totdispcl">
                  <p className="summaryalignpcl fspcl">Grand Total</p>
                  <p className="fspcl">
                    {(
                      totalObj.totalAmt +
                      headerData?.TotalCGSTAmount +
                      headerData?.TotalSGSTAmount +
                      headerData?.AddLess
                    )?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PackingList;
