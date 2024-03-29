import React, { useState } from "react";
import {
  FooterComponent,
  HeaderComponent,
  NumberWithCommas,
  apiCall,
  formatAmount,
  isObjectEmpty,
  numberToWord,
  taxGenrator,
} from "../../GlobalFunctions";
import { useEffect } from "react";
import Loader from "../../components/Loader";
import Button from "../../GlobalFunctions/Button";
import "../../assets/css/prints/invoiceprint4.css";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";

const InvoicePrint4 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
  const [header, setHeader] = useState(null);
  const [headerData, setHeaderData] = useState({});
  const [subheader, setSubHeader] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [resultArray, setResultArray] = useState();
  const [result, setResult] = useState();
  const [mainTotal, setMainTotal] = useState({});
  const [descArr, setDescArr] = useState("");
  const [inWords, setInWords] = useState("");
  const [grandTotal, setGrandTotal] = useState(0);
  const [LOM, setLOM] = useState([]);
  const [groupedArr, setGroupedArr] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [groupedArrAmountTotal, setGroupedArrAmountTotal] = useState(0);
  const [taxTotal, setTaxTotal] = useState([]);
  const [loader, setLoader] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [totDiscount, setTotDiscount] = useState(0);
  const [msg, setMsg] = useState("");
  const [isImageWorking, setIsImageWorking] = useState(true);

  const [diamond_s, setDiamond_s] = useState([]);
  const [colorstone_s, setColorStone_s] = useState([]);
  const [metal_s, setMetal_s] = useState([]);
  const [descText, setDescText] = useState();

  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const organizeData = (headerdata, json1, json2) => {
    let resultArr = [];
    let groupedAmtTotal = 0;
    let totLbrAmt = 0;
    let totOthAmt = 0;
    // eslint-disable-next-line no-unused-vars
    let totAmt = 0;
    let totdis = 0;
    let aa = 0;
    // eslint-disable-next-line no-unused-vars
    let totmiscAmt = 0;
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
      totAmount: {
        TotalAmount: 0,
      },
      totlbrAmt: {
        Amount: 0,
      },
      totOthAmt: {
        Amount: 0,
      },
    };
    
    json1?.forEach((e, i) => {
      let diamondlist = [];
      let colorstonelist = [];
      let misclist = [];
      let metallist = [];
      let findinglist = [];

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
      totdis = totdis + e?.DiscountAmt;
      mainTotal.totAmount.TotalAmount += e?.TotalAmount;
      mainTotal.totOthAmt.Amount += e?.OtherCharges + e?.MiscAmount;
      mainTotal.totalgrosswt.grosswt += e?.grosswt;
      mainTotal.totalnetwt.netwt += e?.NetWt;
      totAmt += e?.TotalAmount;
      totLbrAmt += e?.MakingAmount;
      totOthAmt += e?.OtherCharges;
      totmiscAmt += e?.MiscAmount;
      json2?.forEach((ele) => {
        if (e?.SrJobno === ele?.StockBarcode) {
          if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
            diamondlist.push(ele);
            totals.diamonds.Amount += ele?.Amount;
            totals.diamonds.Rate += ele?.Rate;
            totals.diamonds.Pcs += ele?.Pcs;
            totals.diamonds.Wt += ele?.Wt;
            mainTotal.diamonds.Amount += ele?.Amount;
            mainTotal.diamonds.Rate += ele?.Rate;
            mainTotal.diamonds.Pcs += ele?.Pcs;
            mainTotal.diamonds.Wt += ele?.Wt;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
            colorstonelist.push(ele);
            totals.colorstone.Amount += ele?.Amount;
            totals.colorstone.Rate += ele?.Rate;
            totals.colorstone.Pcs += ele?.Pcs;
            totals.colorstone.Wt += ele?.Wt;
            mainTotal.colorstone.Amount += ele?.Amount;
            mainTotal.colorstone.Rate += ele?.Rate;
            mainTotal.colorstone.Pcs += ele?.Pcs;
            mainTotal.colorstone.Wt += ele?.Wt;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
            misclist.push(ele);
            totals.misc.Amount += ele?.Amount;
            totals.misc.Rate += ele?.Rate;
            totals.misc.Pcs += ele?.Pcs;
            totals.misc.Wt += ele?.Wt;
            mainTotal.misc.Amount += ele?.Amount;
            mainTotal.misc.Rate += ele?.Rate;
            mainTotal.misc.Pcs += ele?.Pcs;
            mainTotal.misc.Wt += ele?.Wt;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            metallist.push(ele);
            totals.metal.Amount += ele?.Amount;
            totals.metal.Rate += ele?.Rate;
            totals.metal.Pcs += ele?.Pcs;
            totals.metal.Wt += ele?.Wt;
            mainTotal.metal.Amount += ele?.Amount;
            mainTotal.metal.Rate += ele?.Rate;
            mainTotal.metal.Pcs += ele?.Pcs;
            mainTotal.metal.Wt += ele?.Wt;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 5) {
            diamondlist.push(ele);
            totals.finding.Amount += ele?.Amount;
            totals.finding.Rate += ele?.Rate;
            totals.finding.Pcs += ele?.Pcs;
            totals.finding.Wt += ele?.Wt;
            mainTotal.finding.Amount += ele?.Amount;
            mainTotal.finding.Rate += ele?.Rate;
            mainTotal.finding.Pcs += ele?.Pcs;
            mainTotal.finding.Wt += ele?.Wt;
          }
        }
      });
      let obj = { ...e };
      obj.diamonds = diamondlist;
      obj.colorstone = colorstonelist;
      obj.misc = misclist;
      obj.metal = metallist;
      obj.finding = findinglist;
      obj.jobwisetotal = totals;
      resultArr.push(obj);
    });

    setMainTotal(mainTotal);
    let head = HeaderComponent(headerdata?.HeaderNo, headerdata);
    setHeader(head);
    let subhead = FooterComponent("2", headerdata);
    setSubHeader(subhead);
    setResultArray(resultArr);

    let arr = [];

    // eslint-disable-next-line array-callback-return
    json2.map((ele) => {
      if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
        if(ele?.IsPrimaryMetal === 1){

        
        if (arr?.length === 0) {
          arr.push(ele);
        } else {
          let findIndex = arr.findIndex(
            (e) =>
              // e?.ShapeName === ele?.ShapeName &&
              e?.Rate === ele?.Rate &&
              e?.QualityName === ele?.QualityName
          );
          if (findIndex === -1) {
            arr.push(ele);
          } else {
            arr[findIndex].Wt += ele?.Wt;
            arr[findIndex].Amount += ele?.Amount;
          }
        }
      }
      } 
      // else if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
      //   if (arr.length === 0) {
      //     arr.push(ele);
      //   } else {
      //     let findIndex = arr.findIndex((e) => e?.Rate === ele?.Rate);
      //     if (findIndex === -1) {
      //       arr.push(ele);
      //     } else {
      //       arr[findIndex].Wt += ele?.Wt;
      //       arr[findIndex].Amount += ele?.Amount;
      //     }
      //   }
      // }
       else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
        if (arr.length === 0) {
          arr.push(ele);
        } else {
          let findIndex = arr.findIndex((e) => e?.Rate === ele?.Rate);
          if (findIndex === -1) {
            arr.push(ele);
          } else {
            arr[findIndex].Wt += ele?.Wt;
            arr[findIndex].Amount += ele?.Amount;
          }
        }
      } else if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
        if (arr.length === 0) {
          arr.push(ele);
        } else {
          let findIndex = arr.findIndex((e) => e?.Rate === ele?.Rate);
          if (findIndex === -1) {
            arr.push(ele);
          } else {
            arr[findIndex].Wt += ele?.Wt;
            arr[findIndex].Amount += ele?.Amount;
          }
        }
      }
    });

   
    // eslint-disable-next-line array-callback-return
    json1?.map((e) => {
      aa += e?.TotalAmount;
    });

    groupedAmtTotal = groupedAmtTotal + totLbrAmt + totOthAmt;
    let obj1 = {
      ShapeName: "OTHER",
      QualityName: "",
      Amount: totOthAmt,
    };
    let obj2 = {
      ShapeName: "LABOUR",
      QualityName: "",
      Amount: totLbrAmt,
    };
    // eslint-disable-next-line no-unused-vars
    // let obj3 = {
    //   ShapeName: "MISC",
    //   QualityName: "",
    //   Amount: totmiscAmt,
    // };
    let LOM = [];
    // LOM.push(obj3, obj2, obj1);
    LOM.push(obj2, obj1);
    setLOM(LOM);
    setGroupedArrAmountTotal(groupedAmtTotal);


    arr.sort((a, b) => {
      if (
        a.MasterManagement_DiamondStoneTypeid === 4 &&
        b.MasterManagement_DiamondStoneTypeid !== 4
      ) {
        return -1; // a comes before b if a is 'Gold' and b is not
      } else if (
        b.MasterManagement_DiamondStoneTypeid === 4 &&
        a.MasterManagement_DiamondStoneTypeid !== 4
      ) {
        return 1; // b comes before a if b is 'Gold' and a is not
      } else {
        if (
          a.MasterManagement_DiamondStoneTypeid === 1 &&
          b.MasterManagement_DiamondStoneTypeid !== 1
        ) {
          return -1;
        } else if (
          b.MasterManagement_DiamondStoneTypeid === 1 &&
          a.MasterManagement_DiamondStoneTypeid !== 1
        ) {
          return 1;
        } else {
          return a.MasterManagement_DiamondStoneTypeName.localeCompare(
            b.MasterManagement_DiamondStoneTypeName
          ); // Sort by name if metalType is not 'Gold'
        }
      }
    });

    setGroupedArr(arr);

    setMainTotal(mainTotal);


    let allTax = taxGenrator(headerdata, aa);
    setTaxTotal(allTax);

    allTax?.forEach((e) => {
      aa += +e?.amount;
    });

    let ab = +aa?.toFixed(2);
    let words = numberToWord(ab) + " Only";
    setInWords(words);
    setGrandTotal(aa);
    setTotDiscount(totdis);
    const groupedData = arr.reduce((result, item) => {
      let groupName;

      switch (item.MasterManagement_DiamondStoneTypeid) {
        case 1:
          groupName = "DIAMOND";
          break;
        case 2:
          groupName = "COLORSTONE";
          break;
        case 3:
          groupName = "CZ STUDDED JEWELLERY";
          break;
        case 4:
          groupName = "GOLD";
          break;
        default:
          groupName = "OTHER";
      }

      // Initialize the group if it doesn't exist
      if (!result[groupName]) {
        result[groupName] = [];
      }

      // Add the item to the corresponding group
      result[groupName].push(item);

      return result;
    }, {});

    const groupNamesArray = Object.keys(groupedData);
    const sentence = groupNamesArray?.join(", ");
    // setDescArr(sentence);
  };

  async function loadData(data) {
    try {
      setHeaderData(data?.BillPrint_Json[0]);
      organizeData(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );



      setLoader(false);


      let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
      data.BillPrint_Json[0].address = address;
 
      const datas = OrganizeDataPrint(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );

      let sen = '';
      let metal = datas?.json2?.filter((e) => e?.MasterManagement_DiamondStoneTypeid === 4)
      if(metal.length > 0){
        sen = 'GOLD';
      }
      let sen2 = '';
      let diamond = datas?.json2?.filter((e) => e?.MasterManagement_DiamondStoneTypeid === 1)
      if(diamond.length > 0){
        sen2 = 'DIAMOND'
      }
      let sen3 = '';
      let colorstone = datas?.json2?.filter((e) => e?.MasterManagement_DiamondStoneTypeid === 2)
      if(colorstone.length > 0){
        sen3 = 'COLORSTONE'
      }
      let sen4 = '';
      let misc = datas?.json2?.filter((e) => e?.MasterManagement_DiamondStoneTypeid === 3)
      if(misc.length > 0){
        sen4 = 'CZ STUDDED'
      }
      let result1 = [(sen === '' ? 'GOLD' : 'GOLD'), sen2, sen3, sen4]?.join(", ");
      setDescArr(result1);

      let diamonds = [];
      let colorstones = [];
      let metals = [];
      datas?.resultArray?.forEach((e) => {
        // let dia = [];
        e?.diamonds?.forEach((el) => {
          let findRecord = diamonds?.findIndex((a) => a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname && a?.ShapeName === el?.ShapeName)
          if(findRecord === -1){
            let obj = {...el};
            obj.wt = obj?.Wt;
            obj.rate = obj?.Rate;
            obj.amount = obj?.Amount;
            diamonds.push(obj);
          }else{
            diamonds[findRecord].wt += el?.Wt;
            diamonds[findRecord].rate += el?.Rate;
            diamonds[findRecord].amount += el?.Amount;
          }
        })
        
        // e.diamonds = dia;
        // diamonds = dia;

        // let cls = [];
        e?.colorstone?.forEach((el) => {
          let findRecord = colorstones?.findIndex((a) => a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname && a?.ShapeName === el?.ShapeName)
          if(findRecord === -1){
            let obj = {...el};
            obj.wt = obj?.Wt;
            obj.rate = obj?.Rate;
            obj.amount = obj?.Amount;
            colorstones.push(obj);
          }else{
            colorstones[findRecord].wt += el?.Wt;
            colorstones[findRecord].rate += el?.Rate;
            colorstones[findRecord].amount += el?.Amount;
          }
        })
        
        // e.colorstone = cls;

        // let miscs = [];
        // e?.misc?.forEach((el) => {
        //   let findRecord = cls?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.QualityName === el?.QualityName)
        //   if(findRecord === -1){
        //     let obj = {...el};
        //     obj.wt = obj?.Wt;
        //     obj.rate = obj?.Rate;
        //     obj.amount = obj?.Amount;
        //     miscs.push(obj);
        //   }else{
        //     miscs[findRecord].wt += el?.Wt;
        //     miscs[findRecord].rate += el?.Rate;
        //     miscs[findRecord].amount += el?.Amount;
        //   }
        // })

        // e.misc = miscs;

        // let met = [];
        e?.metal?.forEach((el) => {
          if(el?.IsPrimaryMetal === 1){

            let findRecord = metals?.findIndex((a) => a?.QualityName === el?.QualityName && a?.Rate === el?.Rate)
            if(findRecord === -1){
            let obj = {...el};
            obj.wt = obj?.Wt;
            obj.rate = obj?.Rate;
            obj.amount = obj?.Amount;
            metals.push(obj);
          }else{
            metals[findRecord].wt += el?.Wt;
            metals[findRecord].rate += el?.Rate;
            metals[findRecord].amount += el?.Amount;
          }
        }
        })
        // e.metal = met;
      })
      // let mainarr = [...metals, ...diamonds, ...colorstones];
      setDiamond_s(diamonds);
      setColorStone_s(colorstones);
      setMetal_s(metals);
      setResult(datas);

    } catch (error) {
      console.log(error);
    }
  }
useEffect(() => {
  if(diamond_s?.length > 0){
    setDescText('DIAMOND STUDDED JEWELLERY')
  }else{
    setDescText('GOLD JEWELLERY')
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [descArr])

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
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
    <React.Fragment>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div>
                <div className="container max_width_container px-2 print_sec_sum4">
                  <Button />
                </div>
                <div className="containerinvp4 pad_60_allPrint">
                  <div>
                    <div style={{border:"1px solid #e8e8e8", borderBottom:"0px"}}>{header}</div>
                    <div className="subheadinvp4 d-flex justify-content-between p-1" style={{border:"1px solid #e8e8e8", borderBottom:"0px"}}>
                      <div className="w-75 h-100">
                        <div className="linesinvp4">
                          {headerData?.lblBillTo}
                        </div>
                        <div className="linesinvp4">
                          {headerData?.customerfirmname}
                        </div>
                        <div className="linesinvp4">
                          {headerData?.customerAddress1}
                        </div>
                        <div className="linesinvp4">
                          {headerData?.customerAddress2}
                        </div>
                        <div className="linesinvp4">
                          {headerData?.customerAddress3}
                        </div>
                        <div className="linesinvp4">
                          {headerData?.customercity}
                          {headerData?.customerpincode}
                        </div>
                        <div className="linesinvp4">
                          {headerData?.customeremail1}
                        </div>
                        <div className="linesinvp4">
                          {headerData?.Cust_CST_STATE_No_}
                        </div>
                        <div className="linesinvp4">
                          {headerData?.vat_cst_pan}
                        </div>
                      </div>
                      <div className="h-100 w-25">
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <div className="fw-bold w-50 linesinvp4 d-flex justify-content-end align-items-center">
                            INVOICE#
                          </div>

                          <div className="w-50 linesinvp4 d-flex justify-content-end align-items-center">
                            {headerData?.InvoiceNo}
                          </div>
                        </div>
                        <div className="d-flex justify-content-end align-items-center w-100">
                          <div className="linesinvp4 fw-bold">DATE</div>
                          <div className="linesinvp4 w-50 d-flex justify-content-end align-items-center">
                            {headerData?.EntryDate}
                          </div>
                        </div>
                        <div className="d-flex justify-content-end align-items-center w-100">
                          <div className="linesinvp4 fw-bold">HSN</div>
                          <div className="linesinvp4 w-50 d-flex justify-content-end align-items-center">
                            {headerData?.HSN_No}
                          </div>
                        </div>
                        <div className="d-flex justify-content-end align-items-center w-100">
                          <div className="linesinvp4 fw-bold">DUE DATE</div>
                          <div className="linesinvp4 w-50 d-flex justify-content-end align-items-center">
                            {headerData?.DueDate}
                          </div>
                        </div>
                        <div className="d-flex justify-content-end align-items-center w-100">
                          <div className="linesinvp4 fw-bold">MSME</div>
                          <div className="linesinvp4 w-50 d-flex justify-content-end align-items-center">
                            {headerData?.MSME}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div>
                    <div
                      className="d-flex"
                      style={{
                        borderBottom: "1px solid #d8d7d7",
                        borderLeft: "1px solid #d8d7d7",
                      }}
                    >
                      <div className="w-25 d-flex flex-column justify-content-between position-relative d-flex">
                        <div className="w-100 h-100 position-relative">
                          <div className="discHeadinvp4 fs12invp4">DESCRIPTION</div>
                          <div className="w-100 descriptioninovicePrint4 fs12invp4 px-1">
                            <div style={{border:"1px solid #e8e8e8", padding:"1px"}}> {descArr}</div>
                          </div>
                        </div>
                        <div className="empdivinvp4"></div>
                      </div>
                      <div className="tableinvp4 w-75">
                        <div className="theadinvp4">
                          <p
                            className="wp1invp4 fs12invp4"
                            style={{
                              justifyContent: "flex-start",
                              paddingLeft: "3px",
                            }}
                          >
                            DETAIL
                          </p>
                          <p className="wp3invp4 fs12invp4 text-end">WEIGHT</p>
                          <p className="wp3invp4 fs12invp4 text-end">RATE</p>
                          <p className="wp3invp4 fs12invp4 text-end">AMOUNT</p>
                        </div>
                        <div className=" w-100">
                          {groupedArr?.map((e, i) => {
                            return (
                              <div className={`tbodyinvp4 `} key={i}>
                                <p className="wp1tbinvp4 fsinvp4">
                                  {e?.MasterManagement_DiamondStoneTypeid === 4
                                    ? e?.ShapeName + " " + e?.QualityName
                                    : e?.MasterManagement_DiamondStoneTypeName}
                                </p>
                                <p className="wp3tbinvp4 fsinvp4 text-end">
                                  {e?.Wt?.toFixed(3)}
                                </p>
                                <p className="wp3tbinvp4 fsinvp4 text-end">
                                  {NumberWithCommas(e?.Rate, 2)}
                                </p>
                                <p className="wp3tbinvp4 fsinvp4 text-end">
                                  {NumberWithCommas(e?.Amount, 2)}
                                </p>
                              </div>
                            );
                          })}
                          {LOM?.map((e, i) => {
                            return (
                              <div className="tbodyinvp4 " key={i}>
                                {e?.ShapeName === "MISC" && e?.Amount === 0 ? (
                                  ""
                                ) : (
                                  <p className="wp1tbinvp4 fsinvp4">
                                    {e?.ShapeName}
                                  </p>
                                )}
                                <p className="wp3tbinvp4 fsinvp4 text-end">
                                  {e?.Wt?.toFixed(3)}
                                </p>
                                <p className="wp3tbinvp4 fsinvp4 text-end">
                                  {e?.Rate}
                                </p>
                                {e?.ShapeName === "MISC" && e?.Amount === 0 ? (
                                  ""
                                ) : (
                                  <p className="wp3tbinvp4 fsinvp4 text-end">
                                    {NumberWithCommas(e?.Amount, 2)}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                          <div className="tbodyinvp4 brtopinvp4 d-flex align-items-center mt-0.5" style={{ borderTop:"1px solid #e8e8e8", height:"25px"}}>
                            <p
                              className="wp1tbinvp4 fw-bold fsinvp4 "
                              style={{ width: "20%", fontSize:"13px" }}
                            >
                              TOTAL
                            </p>
                            <p
                              className="wp3tbinvp4 fw-bold fsinvp4 d-flex justify-content-end align-items-center text-end"
                              style={{ width: "20%", fontSize:"13px" }}
                            >
                              {NumberWithCommas(
                                mainTotal?.totAmount?.TotalAmount,
                                2
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                   <div
                  // className="d-flex"
                  style={{
                    fontSize:'12px',
                    position:'relative'
                  }}
                >
                  {/* <div className="w-50 d-flex flex-column justify-content-between position-relative d-flex">
                    <div className="w-100 h-100 position-relative">
                      <div className="discHeadinvp3">DESCRIPTION</div>
                      <div className="w-100 descriptioninovicePrint3 px-2">{descArr} JEWELLERY.</div>
                    </div>
                    <div className="empdivinvp3"></div>
                  </div> */}
                 <div className="d-flex w-100 fw-bold mt-1 border">
                  <div style={{width:'40%'}} className="d-flex justify-content-center border-end">DESCRIPTION</div>
                  <div style={{width:'30%'}} className="ps-2">DETAIL</div>
                  <div style={{width:'10%'}}>WEIGHT</div>
                  <div style={{width:'10%'}}>RATE</div>
                  <div style={{width:'10%'}}>AMOUNT</div>
                 </div>
                 {/* <div className="w-100" style={{borderBottom:'2px solid #d8d7d7'}}> */}
                 <div className="w-100 border-bottom" >
                  
                  
                  
                        
                  
                  {
                    metal_s?.map((e, i) => {
                      return(
                        <div key={i} className="d-flex w-100  fsinvp3 border-start border-end" >
                        <div style={{width:'40%'}} className="d-flex justify-content-center border-end"></div>
                        <div style={{width:'30%'}} className="ps-2">
                          {
                           (e?.ShapeName + " " + e?.QualityName)
                          }
                        </div>
                        <div style={{width:'10%'}}>{e?.wt?.toFixed(3)}</div>
                        <div style={{width:'10%'}}>{formatAmount((e?.amount)/((e?.wt === 0 ? 1 : e?.wt)))}</div>
                        <div style={{width:'10%'}}>{formatAmount((e?.amount / result?.header?.CurrencyExchRate))}</div>
                        </div>
                      )
                    })
                  }
                 {/* <div className="d-flex justify-content-start align-items-center border-start border-end"><input type="text" width={"200px"} style={{width:'280px'}} className="d-flex justify-content-center align-items-center ms-5" value={ diamond_s?.length > 0 ? `DIAMOND STUDDED JEWELLERY` : `GOLD JEWELLERY`} /></div> */}
                 <div className="d-flex justify-content-start align-items-center border-start border-end"><input type="text" width={"200px"} style={{width:'280px'}} className="d-flex justify-content-center align-items-center ms-5 position-absolute" value={descText} onChange={(e) => setDescText(e.target.value)} /></div>
                  {
                    diamond_s?.map((e, i) => {
                      return(
                        <div key={i} className="d-flex w-100  fsinvp3 border-start border-end" >
                        <div style={{width:'40%'}} className="d-flex justify-content-center border-end"></div>
                        <div style={{width:'30%'}} className="ps-2">{e?.MasterManagement_DiamondStoneTypeName}</div>
                        <div style={{width:'10%'}}>{e?.wt?.toFixed(3)}</div>
                        <div style={{width:'10%'}}>{formatAmount((e?.amount)/((e?.wt === 0 ? 1 : e?.wt)))}</div>
                        <div style={{width:'10%'}}>{formatAmount(e?.amount)}</div>
                        </div>
                      )
                    })
                  }
                  
                  {
                    colorstone_s?.map((e, i) => {
                      return(
                        <div key={i} className="d-flex w-100  fsinvp3 border-start border-end" >
                        <div style={{width:'40%'}} className="d-flex justify-content-center border-end"></div>
                        <div style={{width:'30%'}} className="ps-2">{e?.MasterManagement_DiamondStoneTypeName}</div>
                        <div style={{width:'10%'}}>{e?.wt?.toFixed(3)}</div>
                        <div style={{width:'10%'}}>{formatAmount((e?.amount)/((e?.wt === 0 ? 1 : e?.wt)))}</div>
                        <div style={{width:'10%'}}>{formatAmount(e?.amount)}</div>
                        </div>
                      )
                    })
                  }
                   {/* <div className="d-flex w-100  fsinvp3 border-start border-end" >
                        <div style={{width:'40%'}} className="d-flex justify-content-center border-end"></div>
                        <div style={{width:'30%'}} className="ps-2">MISC</div>
                        <div style={{width:'10%'}}></div>
                        <div style={{width:'10%'}}></div>
                        <div style={{width:'10%'}}>{formatAmount(result?.mainTotal?.misc?.Amount)}</div>
                        </div> */}
                        <div className="d-flex w-100  fsinvp3 border-start border-end" >
                        <div style={{width:'40%'}} className="d-flex justify-content-center border-end"></div>
                        <div style={{width:'30%'}} className="ps-2">LABOUR</div>
                        <div style={{width:'10%'}}></div>
                        <div style={{width:'10%'}}></div>
                        {/* <div style={{width:'10%'}}>{formatAmount((result?.mainTotal?.total_Making_Amount + result?.mainTotal?.total_TotalCsSetcost + result?.mainTotal?.total_TotalDiaSetcost))}</div> */}
                        {console.log(result)}
                        <div style={{width:'10%'}}>{formatAmount((result?.mainTotal?.total_Making_Amount + result?.mainTotal?.miscAmount))}</div>
                        </div>
                        <div className="d-flex w-100  fsinvp3 border-start border-end">
                        <div style={{width:'40%'}} className="d-flex justify-content-center border-end"></div>
                        <div style={{width:'30%'}} className="ps-2">OTHER</div>
                        <div style={{width:'10%'}}></div>
                        <div style={{width:'10%'}}></div>
                        <div style={{width:'10%'}}>{formatAmount(result?.mainTotal?.total_other)}</div>
                        </div>
                 </div>
                 <div className="d-flex w-100 fw-bold border-top-0 border" style={{ fontSize:'14px'}}>
                  <div style={{width:'40%'}} className="d-flex justify-content-center border-end"></div>
                  <div style={{width:'30%'}} className="ps-2">TOTAL</div>
                  <div style={{width:'10%'}}></div>
                  <div style={{width:'10%'}}></div>
                  <div style={{width:'10%'}}>{formatAmount(result?.mainTotal?.total_unitcost)}</div>
                 </div>
                </div>
                  <div className="summaryinvp4">
                    <div style={{ width: "60%", height: "100%" }}></div>
                    <div style={{ width: "40%" }}>
                      <div style={{ borderLeft: "1px solid #e8e8e8" }}>
                        <div className="d-flex justify-content-between align-items-center ps-1">
                          {result?.allTaxes?.map((e, i) => {
                            return (
                              <div
                                className="d-flex justify-content-between align-items-center w-100"
                                key={i}
                              >
                                <div
                                  className="w-50"
                                  style={{ borderRight: "1px solid #e8e8e8" }}
                                >
                                  {e?.name} {e?.per}
                                </div>
                                <div className="w-50 d-flex justify-content-end align-items-center pe-1">
                                  {formatAmount(e?.amount)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {headerData?.AddLess !== 0 && (
                          <div className="d-flex justify-content-between align-items-center ps-1">
                            <div
                              className="w-50"
                              style={{ borderRight: "1px solid #e8e8e8" }}
                            >
                              {headerData?.AddLess > 0 ? "Add" : "Less"}
                            </div>
                            <div className="w-50 d-flex justify-content-end align-items-center pe-1">
                              {formatAmount(headerData?.AddLess)}
                            </div>
                          </div>
                        )}
                      </div>
                      <div
                        className="d-flex justify-content-between align-items-center ps-1 fw-bold"
                        style={{
                          borderTop: "1px solid #e8e8e8",
                          borderLeft: "1px solid #e8e8e8",
                        }}
                      >
                        <div className="w-50" style={{fontSize:"13px"}}>GRAND TOTAL</div>
                        <div className="w-50 d-flex justify-content-end align-items-center pe-1" style={{fontSize:"13px"}}>
                          {formatAmount(grandTotal)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="wordsinvp4">
                    <div>In Words Indian Rupees</div>
                    <div className="fw-bold">{inWords}</div>
                  </div>
                  <div className="noteinvp4">
                    <div className="fw-bold">NOTE:</div>
                    <div>{headerData?.PrintRemark}</div>
                  </div>
                  <div className="declarationinvp4">
                    <div className="fw-bold fs12invp4">DECLARATION :</div>
                    <div
                      style={{ fontWeight: "bold" }}
                      dangerouslySetInnerHTML={{
                        __html: headerData?.Declaration,
                      }}
                    ></div>
                  </div>
                  <div className="fs12invp4 footerINVP4">{subheader}</div>
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
    </React.Fragment>
  );
};

export default InvoicePrint4;
