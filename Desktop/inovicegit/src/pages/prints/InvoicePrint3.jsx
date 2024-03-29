import React, { useEffect, useState } from "react";
import "../../assets/css/prints/invoiceprint3.css";
import { apiCall, formatAmount, isObjectEmpty, numberToWord, NumberWithCommas } from "../../GlobalFunctions";
import { taxGenrator } from "./../../GlobalFunctions";
import Loader from "../../components/Loader";
import Button from "../../GlobalFunctions/Button";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";

const InvoicePrint3 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
  const [headerData, setHeaderData] = useState();
  // eslint-disable-next-line no-unused-vars
  const [json1, setJson1] = useState();
  // eslint-disable-next-line no-unused-vars
  const [json2, setJson2] = useState();
  // eslint-disable-next-line no-unused-vars
  const [resultArray, setResultArray] = useState();
  const [result, setResult] = useState();
  const [grandTotal, setGrandTotal] = useState(0);
  const [totDiscount, setTotDiscount] = useState(0);
  const [inWords, setInWords] = useState("");
  const [mainTotal, setMainTotal] = useState({});
  const [groupedArr, setGroupedArr] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [groupedArrAmountTotal, setGroupedArrAmountTotal] = useState(0);
  const [LOM, setLOM] = useState([]);
  const [descArr, setDescArr] = useState("");
  const [taxTotal, setTaxTotal] = useState([]);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);

  const [diamond_s, setDiamond_s] = useState([]);
  const [colorstone_s, setColorStone_s] = useState([]);
  const [metal_s, setMetal_s] = useState([]);

  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const organizeData = (json, json1, json2) => {
    let resultArr = [];
    // eslint-disable-next-line no-unused-vars
    let totAmt = 0;
    let totdis = 0;
    let groupedAmtTotal = 0;
    let totOthAmt = 0;
    let totLbrAmt = 0;
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
    // eslint-disable-next-line array-callback-return
    json1.map((e) => {
      let diamondlist = [];
      let colorstonelist = [];
      let metallist = [];
      let misclist = [];
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

      // eslint-disable-next-line array-callback-return

      totdis = totdis + e?.DiscountAmt;
      mainTotal.totAmount.TotalAmount += e?.TotalAmount;
      mainTotal.totOthAmt.Amount += e?.OtherCharges + e?.MiscAmount;
      mainTotal.totalgrosswt.grosswt += e?.grosswt;
      mainTotal.totalnetwt.netwt += e?.NetWt;
      totAmt += e?.TotalAmount;
      totLbrAmt += e?.MakingAmount;
      totOthAmt += e?.OtherCharges;
      totmiscAmt += e?.MiscAmount;

      // eslint-disable-next-line array-callback-return
      json2.map((ele) => {
        if (ele?.StockBarcode === e?.SrJobno) {
          if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
            diamondlist.push(ele);
            totals.diamonds.Pcs += ele?.Pcs;
            totals.diamonds.Wt += ele?.Wt;
            totals.diamonds.Amount += ele?.Amount;
            totals.diamonds.Rate += ele?.Rate;
            mainTotal.diamonds.Pcs += ele?.Pcs;
            mainTotal.diamonds.Wt += ele?.Wt;
            mainTotal.diamonds.Rate += ele?.Rate;
            mainTotal.diamonds.Amount += ele?.Amount;
          }

          if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
            colorstonelist.push(ele);
            totals.colorstone.Pcs += ele?.Pcs;
            totals.colorstone.Wt += ele?.Wt;
            totals.colorstone.Amount += ele?.Amount;
            totals.colorstone.Rate += ele?.Rate;
            mainTotal.colorstone.Pcs += ele?.Pcs;
            mainTotal.colorstone.Wt += ele?.Wt;
            mainTotal.colorstone.Rate += ele?.Rate;
            mainTotal.colorstone.Amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
            misclist.push(ele);
            totals.colorstone.Pcs += ele?.Pcs;
            totals.colorstone.Wt += ele?.Wt;
            totals.colorstone.Amount += ele?.Amount;
            totals.colorstone.Rate += ele?.Rate;
            mainTotal.misc.Pcs += ele?.Pcs;
            mainTotal.misc.Wt += ele?.Wt;
            mainTotal.misc.Rate += ele?.Rate;
            mainTotal.misc.Amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            metallist.push(ele);
            totals.metal.Pcs += ele?.Pcs;
            totals.metal.Wt += ele?.Wt;
            totals.metal.Amount += ele?.Amount;
            totals.metal.Rate += ele?.Rate;
            mainTotal.metal.Pcs += ele?.Pcs;
            mainTotal.metal.Wt += ele?.Wt;
            mainTotal.metal.Rate += ele?.Rate;
            mainTotal.metal.Amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 5) {
            findinglist.push(ele);
            totals.finding.Pcs += ele?.Pcs;
            totals.finding.Wt += ele?.Wt;
            totals.finding.Amount += ele?.Amount;
            totals.finding.Rate += ele?.Rate;
            mainTotal.finding.Pcs += ele?.Pcs;
            mainTotal.finding.Wt += ele?.Wt;
            mainTotal.finding.Rate += ele?.Rate;
            mainTotal.finding.Amount += ele?.Amount;
          }
        }
      });

      let obj = { ...e };
      obj.diamondsDetails = diamondlist;
      obj.colorstoneDetails = colorstonelist;
      obj.metalDetails = metallist;
      obj.miscDetails = misclist;
      obj.findingDetails = findinglist;
      obj.AllJobsTotal = mainTotal;
      obj.JobWiseTotal = totals;
      resultArr.push(obj);
      setResultArray(resultArr);
    });
    let arr = [];

    // eslint-disable-next-line array-callback-return
    json2.map((ele) => {
      if (ele?.MasterManagement_DiamondStoneTypeid === 4 && ele?.IsPrimaryMetal === 1) {
        if (arr?.length === 0) {
          // let obj = {...ele};
          // obj._wt = ele?.Wt;
          // obj._amount = ele?.Amount;
          arr.push(ele);
        } else {
          let findIndex = arr?.findIndex(
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
      } else if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
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
      } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
        if (arr.length === 0) {
          arr.push(ele);
        } else {
          let findIndex = arr.findIndex((e) => e?.QualityName === ele?.QualityName && e?.Colorname === ele?.Colorname && e?.SizeName === ele?.SizeName);
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
          let findIndex = arr.findIndex((e) => e?.QualityName === ele?.QualityName && e?.Colorname === ele?.Colorname && e?.SizeName === ele?.SizeName);
          if (findIndex === -1) {
            arr.push(ele);
          } else {
            arr[findIndex].Wt += ele?.Wt;
            arr[findIndex].Amount += ele?.Amount;
          }
        }
      }
    });
    let aa = 0;
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
    let obj3 = {
      ShapeName: "MISC",
      QualityName: "",
      Amount: totmiscAmt,
    };
    let LOM = [];
    // LOM.push(obj3, obj2, obj1);
    LOM.push(obj2, obj1);
    setLOM(LOM);
    setGroupedArrAmountTotal(groupedAmtTotal);


    // arr.sort((a, b) => {
    //   if (a.MasterManagement_DiamondStoneTypeid !== b.MasterManagement_DiamondStoneTypeid) {
    //     return b.MasterManagement_DiamondStoneTypeid - a.MasterManagement_DiamondStoneTypeid;
    //   } else {
    //     return a.QualityName.localeCompare(b.QualityName);  // If names are the same, sort by age
    //   }
    // });

    arr.sort((a, b) => {
      if (a.MasterManagement_DiamondStoneTypeid === 4 && b.MasterManagement_DiamondStoneTypeid !== 4) {
        return -1; // a comes before b if a is 'Gold' and b is not
      } else if (b.MasterManagement_DiamondStoneTypeid === 4 && a.MasterManagement_DiamondStoneTypeid !== 4) {
        return 1; // b comes before a if b is 'Gold' and a is not
      } else {
        if (a.MasterManagement_DiamondStoneTypeid === 1 && b.MasterManagement_DiamondStoneTypeid !== 1) {
          return -1;
        } else if (b.MasterManagement_DiamondStoneTypeid === 1 && a.MasterManagement_DiamondStoneTypeid !== 1) {
          return 1;
        } else {
          return a.MasterManagement_DiamondStoneTypeName.localeCompare(b.MasterManagement_DiamondStoneTypeName); // Sort by name if metalType is not 'Gold'
        }
      }
    });
  
    // setGroupedArr(arr);

    setMainTotal(mainTotal);


    let allTax = taxGenrator(json, aa);
    setTaxTotal(allTax);

    allTax?.forEach((e) => {
      aa += +e?.amount;
    });
    let ab = (+aa?.toFixed(2));
    let words = numberToWord(ab) + " Only";
    setInWords(words);
    setGrandTotal(aa);
    setTotDiscount(totdis);



    const groupedData = arr?.reduce((result, item) => {
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

    const groupNamesArray = Object?.keys(groupedData);
    const sentence = groupNamesArray?.join(", ");
    console.log(sentence);
    // setDescArr(sentence);
  };
  async function loadData(data) {
    try {
      setHeaderData(data?.BillPrint_Json[0]);
      setJson1(data?.BillPrint_Json1);
      setJson2(data?.BillPrint_Json2);
      organizeData(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );
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
      console.log(result1);
      setDescArr(result1);

      
      
      let diamonds = [];
      let colorstones = [];
      let metals = [];
      datas?.resultArray?.forEach((e) => {
        // let dia = [];
        e?.diamonds?.forEach((el) => {
          let findRecord = diamonds?.findIndex((a) => a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname && a?.SizeName === el?.SizeName)
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
          let findRecord = colorstones?.findIndex((a) => a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname && a?.SizeName === el?.SizeName)
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
      // setGroupedArr(mainarr);
      setResult(datas);
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  }
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
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="container max_width_container px-2 print_sec_sum4">
                <Button />
              </div>
              <div className="containerinvp3 pad_60_allPrint" id="divToPrint">
                <div className="headinvp3">
                  <div className="headerinvp3">
                    <div className="head1invp3">
                      <p className="fw-bold fsinvp3 w-50">BILL NO</p>
                      <p className="fsinvp3 w-50 text-end">{headerData?.InvoiceNo}</p>
                    </div>
                    <div className="head1invp3">
                      <p className="fw-bold fsinvp3">DATE</p>
                      <p className="fsinvp3">{headerData?.EntryDate}</p>
                    </div>
                    <div className="head1invp3">
                      <p className="fw-bold fsinvp3">HSN</p>
                      <p className="fsinvp3">{headerData?.HSN_No}</p>
                    </div>
                  </div>
                </div>
                <div className="header2invp3">
                  <div>
                    <p className="fw-bold fs-6">
                      {headerData?.customerfirmname}
                    </p>
                    <p className="fsinvp3">{headerData?.customerstreet}</p>
                    <p className="fsinvp3">{headerData?.customerregion}</p>
                    <p className="fsinvp3">
                      {headerData?.customercity} {headerData?.customerpincode}
                    </p>
                    <p className="fsinvp3">
                      Mobile : {headerData?.customermobileno}
                    </p>
                  </div>
                  {console.log(result)}
                  <div className="w-25 fsinvp3">
                      <div className="d-flex justify-content-start align-items-center w-100"><div className="fw-bold d-flex justify-content-start align-items-center" style={{width:'33%'}}>GSTIN : </div><div className="d-flex justify-content-start align-items-center" style={{width:'67%'}}>{result?.header?.CustGstNo}</div></div>
                      <div className="d-flex justify-content-start align-items-center w-100"><div className="fw-bold d-flex justify-content-start align-items-center" style={{width:'33%'}}>{result?.header?.Cust_CST_STATE} : </div><div className="w-50" style={{width:'67%'}}>{result?.header?.Cust_CST_STATE_No}</div></div>
                      <div className="d-flex justify-content-start align-items-center w-100"><div className="fw-bold d-flex justify-content-start align-items-center" style={{width:'33%'}}>PAN NO : </div><div className="w-50" style={{width:'67%'}}>{result?.header?.CustPanno}</div></div>
                  </div>
                </div>
                <div
                  // className="d-flex"
                  // style={{
                  //   borderBottom: "2px solid #d8d7d7",
                  //   borderLeft: "2px solid #d8d7d7",
                  // }}
                >
                  {/* <div className="w-50 d-flex flex-column justify-content-between position-relative d-flex">
                    <div className="w-100 h-100 position-relative">
                      <div className="discHeadinvp3">DESCRIPTION</div>
                      <div className="w-100 descriptioninovicePrint3 px-2">{descArr} JEWELLERY.</div>
                    </div>
                    <div className="empdivinvp3"></div>
                  </div> */}
                 <div className="d-flex w-100 fw-bold mt-1" style={{border:'2px solid #d8d7d7'}}>
                  <div style={{width:'40%', borderRight:'2px solid #d8d7d7'}} className="d-flex justify-content-center">DESCRIPTION</div>
                  <div style={{width:'30%'}} className="ps-2">DETAIL</div>
                  <div style={{width:'10%'}}>WEIGHT</div>
                  <div style={{width:'10%'}}>RATE</div>
                  <div style={{width:'10%'}}>AMOUNT</div>
                 </div>
                 <div className="w-100" style={{borderBottom:'2px solid #d8d7d7'}}>
                
                  {
                    metal_s?.map((e, i) => {
                      return(
                        <div key={i} className="d-flex w-100  fsinvp3" style={{borderLeft:'2px solid #d8d7d7', borderRight:'2px solid #d8d7d7'}}>
                        <div style={{width:'40%', borderRight:'2px solid #d8d7d7'}} className="d-flex justify-content-center"></div>
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
                  {
                    diamond_s?.map((e, i) => {
                      return(
                        <div key={i} className="d-flex w-100  fsinvp3" style={{borderLeft:'2px solid #d8d7d7', borderRight:'2px solid #d8d7d7'}}>
                        <div style={{width:'40%', borderRight:'2px solid #d8d7d7'}} className="d-flex justify-content-center">{
                          i === 0 ? `${descArr} JEWELLERY` : ''
                        }</div>
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
                        <div key={i} className="d-flex w-100  fsinvp3" style={{borderLeft:'2px solid #d8d7d7', borderRight:'2px solid #d8d7d7'}}>
                        <div style={{width:'40%', borderRight:'2px solid #d8d7d7'}} className="d-flex justify-content-center"></div>
                        <div style={{width:'30%'}} className="ps-2">{e?.MasterManagement_DiamondStoneTypeName}</div>
                        <div style={{width:'10%'}}>{e?.wt?.toFixed(3)}</div>
                        <div style={{width:'10%'}}>{formatAmount((e?.amount)/((e?.wt === 0 ? 1 : e?.wt)))}</div>
                        <div style={{width:'10%'}}>{formatAmount(e?.amount)}</div>
                        </div>
                      )
                    })
                  }
                   <div className="d-flex w-100  fsinvp3" style={{borderLeft:'2px solid #d8d7d7', borderRight:'2px solid #d8d7d7'}}>
                        <div style={{width:'40%', borderRight:'2px solid #d8d7d7'}} className="d-flex justify-content-center"></div>
                        <div style={{width:'30%'}} className="ps-2">MISC</div>
                        <div style={{width:'10%'}}></div>
                        <div style={{width:'10%'}}></div>
                        <div style={{width:'10%'}}>{formatAmount(result?.mainTotal?.misc?.Amount)}</div>
                        </div>
                        <div className="d-flex w-100  fsinvp3" style={{borderLeft:'2px solid #d8d7d7', borderRight:'2px solid #d8d7d7'}}>
                        <div style={{width:'40%', borderRight:'2px solid #d8d7d7'}} className="d-flex justify-content-center"></div>
                        <div style={{width:'30%'}} className="ps-2">LABOUR</div>
                        <div style={{width:'10%'}}></div>
                        <div style={{width:'10%'}}></div>
                        <div style={{width:'10%'}}>{formatAmount((result?.mainTotal?.total_Making_Amount + result?.mainTotal?.total_TotalCsSetcost + result?.mainTotal?.total_TotalDiaSetcost))}</div>
                        </div>
                        <div className="d-flex w-100  fsinvp3" style={{borderLeft:'2px solid #d8d7d7', borderRight:'2px solid #d8d7d7'}}>
                        <div style={{width:'40%', borderRight:'2px solid #d8d7d7'}} className="d-flex justify-content-center"></div>
                        <div style={{width:'30%'}} className="ps-2">OTHER</div>
                        <div style={{width:'10%'}}></div>
                        <div style={{width:'10%'}}></div>
                        <div style={{width:'10%'}}>{formatAmount(result?.mainTotal?.total_other)}</div>
                        </div>
                 </div>
                 <div className="d-flex w-100 fw-bold border-top-0" style={{border:'2px solid #d8d7d7', fontSize:'14px'}}>
                  <div style={{width:'40%', borderRight:'2px solid #d8d7d7'}} className="d-flex justify-content-center"></div>
                  <div style={{width:'30%'}} className="ps-2">TOTAL</div>
                  <div style={{width:'10%'}}></div>
                  <div style={{width:'10%'}}></div>
                  <div style={{width:'10%'}}>{formatAmount(result?.mainTotal?.total_unitcost)}</div>
                 </div>
                </div>
                <div className="summaryinvp3">
                  <div className="totalinvp3">
                    {totDiscount !== 0 && <div className="d-flex justify-content-between px-1">
                      <p className="w-50 text-start fsinvp3">Discount</p>
                      <p className="w-50 text-end fsinvp3">
                        {formatAmount(totDiscount)}
                      </p>
                    </div>}
                    <div className="d-flex justify-content-between px-1 fw-bold">
                      <p className="fsinvp3">Total Amount</p>
                      <p className="w-50 text-end fsinvp3">
                        {formatAmount(mainTotal?.totAmount?.TotalAmount)}
                      </p>
                    </div>
                    {result?.allTaxes?.length > 0 &&
                      result?.allTaxes?.map((e, i) => {
                        return (
                          <div
                            className="d-flex justify-content-between px-1"
                            key={i}
                          >
                            <div className="fsinvp3">
                              {e?.name} {e?.per}
                            </div>
                            <div className="fsinvp3">{formatAmount(e?.amountInNumber)}</div>
                          </div>
                        );
                      })}

                    {headerData?.AddLess !== 0 && <div className="d-flex justify-content-between px-1">
                      <p className="fsinvp3">
                        {headerData?.AddLess > 0 ? "Add" : "Less"}
                      </p>
                      <p className="w-50 text-end fsinvp3">
                        {formatAmount(headerData?.AddLess)}
                      </p>
                    </div>}
                    <div
                      className="d-flex justify-content-between px-1 mt-1"
                      style={{ borderTop: "2.5px solid #e8e8e8" }}
                    >
                      <p className="fw-bold fsinvp3">Grand Total</p>
                      <p className="fw-bold w-50 text-end fsinvp3">
                        {formatAmount(grandTotal)}
                      </p>
                    </div>
                  </div>
                  <div className="wordsinvp3 fsinvp3 px-1 fw-bold">
                    Rs. {inWords}
                  </div>
                  <div className="wordsinvp3 fsinvp3">
                    <p className="fw-bold px-2">NOTE:</p>
                    <p
                      className="fsinvp3"
                      dangerouslySetInnerHTML={{
                        __html: headerData?.PrintRemark,
                      }}
                    ></p>
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

export default InvoicePrint3;
