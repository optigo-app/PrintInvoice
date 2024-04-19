import React, { useEffect, useState } from 'react';
import "../../assets/css/prints/invoicePrint.css";
import { NumberWithCommas, apiCall, fixedValues, handlePrint, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { json } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { ToWords } from "to-words";
import { Diamond } from '@mui/icons-material';

const InvoicePrint = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
  const toWords = new ToWords();
  const [loader, setLoader] = useState(true);
  const [json0, setJson0] = useState({});
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");
  const [datass, setDatas] = useState({});
  const [isImageWorking, setIsImageWorking] = useState(true);
  // const [metal, setMetal] = useState([]);
  // const [diamond, setDiamond] = useState([]);
  // const [colorstone, setColorstone] = useState([]);
  const [mainData, setMainData] = useState({
    resultArr: [],
    findings: [],
    diamonds: [],
    colorStones: [],
    miscs: [],
    otherCharges: [],
    misc2: [],
    labour: {},
    diamondHandling: 0,
  });
  const [totalss, setTotalss] = useState({
    total: 0,
    discount: 0,
    totalPcs: 0,
  });
  // const [clr, setClr] = useState([]);

  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const findOtherName = (arr, ele) => {
    let findIndex = arr.findIndex((e, i) => e?.MasterManagement_DiamondStoneTypeid === ele?.MasterManagement_DiamondStoneTypeid && e?.Rate === ele?.Rate);
    if (findIndex === -1) {
      arr.push(ele);
    } else {
      arr[findIndex].Wt += ele?.Wt;
      // arr[findIndex].Rate += ele?.Rate;
      arr[findIndex].Amount += ele?.Amount;
      arr[findIndex].Pcs += ele?.Pcs;
    }
    return arr;
  }

  const findMetalName = (arr, ele) => {
    let findIndex = arr.findIndex((e, i) => { if (e?.ShapeName === ele?.ShapeName) { if (e?.QualityName === ele?.QualityName) { if (e?.Rate === ele?.Rate) { return ele; } } } });
    if (findIndex === -1) {
      arr.push(ele);
    } else {
      arr[findIndex].Wt += ele?.Wt;
      arr[findIndex].Rate += ele?.Rate;
      arr[findIndex].Amount += ele?.Amount;
      arr[findIndex].Pcs += ele?.Pcs;
    }
    return arr;
  }

  const [other, setOther] = useState({
    other1: [],
    other2: [],
  })

  const compare = (a, b) => {
    if (a.Rate !== b.Rate) {
      return a.Rate - b.Rate;
    } else {
      if (a.designno < b.designno) {
        return -1;
      } else if (a.designno > b.designno) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  const loadData = (data) => {


    setJson0(data?.BillPrint_Json[0]);

    let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
    setDatas(datas);
    console.log(datas);
    let resultArr = [];
    let findings = [];
    let diamonds = [];
    let colorStones = [];
    let misc2 = [];
    let labour = { label: "LABOUR", primaryWt: 0, makingAmount: 0, totalAmount: 0, rate: 0, amount: 0 };
    let miscs = [];
    let otherCharges = [];
    let total2 = { ...totalss };
    let diamondTotal = 0;
    let colorStone1Total1 = 0;
    let colorStone2Total2 = 0;
    let misc1Total1 = 0;
    let misc2Total2 = 0;
    let diamondHandling = 0;
    let totalPcss = [];
    let jobWiseLabourCalc = 0;
    let jobWiseMinusFindigWt = 0;
    let labourWt = 0;
    let labourAmt = 0;
    let labourRate = 0
    datas?.resultArray?.map((e, i) => {
      let obj = cloneDeep(e);
      let findingWt = 0;
      let findingsWt = 0;
      let findingsAmount = 0;
      let secondaryMetalAmount = 0;
      let labourFindWt = 0
      obj.primaryMetal = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1);
      e?.finding?.forEach((ele, ind) => {
        if (ele?.ShapeName !== obj?.primaryMetal?.ShapeName && ele?.QualityName !== obj?.primaryMetal?.QualityName) {
          // console.log(ele);
          let obb = cloneDeep(ele);
          if (obj?.primaryMetal) {
            obb.Rate = obj?.primaryMetal?.Rate;
            obb.Amount = (ele?.Wt * obb?.Rate);
            findingsAmount += (ele?.Wt * obb?.Rate);
          }
          findingsWt += ele?.Wt;
          findings?.push(obb);
          total2.total += (obb?.Amount);
        }
        if (ele?.Supplier?.toLowerCase() === "customer") {
          findingWt += ele?.Wt
          labourFindWt += ele?.Wt;
        }
      });
      labourWt += (e?.MetalDiaWt - labourFindWt);
      labourAmt += ((e?.MetalDiaWt - labourFindWt) * e?.MaKingCharge_Unit);

      let findPcss = totalPcss?.findIndex((ele, ind) => ele?.GroupJob === e?.GroupJob);
      if (findPcss === -1) {
        totalPcss?.push({ GroupJob: e?.GroupJob, value: e?.Quantity });
      } else {
        if (e?.GroupJob === "") {
          let findQuantity = totalPcss?.findIndex((ele, ind) => ele?.GroupJob === '');
          if (findQuantity === -1) {
            totalPcss?.push({ GroupJob: e?.GroupJob, value: e?.Quantity });
          } else {
            totalPcss[findQuantity].value += e?.Quantity;
          }
        }
      }

      let primaryWt = 0;
      let count = 0;
      // console.log(findingsWt);

      let secondaryWt = 0;
      diamondHandling += e?.TotalDiamondHandling;
      e?.metal?.forEach((ele, ind) => {
        count += 1;
        if (ele?.IsPrimaryMetal === 1) {
          primaryWt += ele?.Wt;
        } else {
          secondaryMetalAmount += ele?.Amount;
          secondaryWt += ele?.Wt;
        }
      });
      let netWtFinal = e?.NetWt + e?.LossWt - secondaryWt
      // labour.primaryWt += primaryWt;
      labour.makingAmount += e?.MakingAmount;
      labour.totalAmount += e?.MakingAmount + e?.TotalDiaSetcost + e?.TotalCsSetcost;
      total2.discount += e?.DiscountAmt;
      obj.primaryWt = primaryWt;
      obj.netWtFinal = netWtFinal;
      obj.metalAmountFinal = e?.MetalAmount
      if (count <= 1) {
        primaryWt = e?.NetWt + e?.LossWt;
      }
      if (obj?.primaryMetal) {
        total2.total += (obj?.metalAmountFinal / data?.BillPrint_Json[0]?.CurrencyExchRate);
        let findRecord = resultArr?.findIndex((ele, ind) => ele?.primaryMetal?.ShapeName === obj?.primaryMetal?.ShapeName && ele?.primaryMetal?.QualityName === obj?.primaryMetal?.QualityName && ele?.primaryMetal?.Rate === obj?.primaryMetal?.Rate);
        if (findRecord === -1) {
          resultArr?.push(obj);
        } else {
          resultArr[findRecord].grosswt += obj?.grosswt;
          resultArr[findRecord].NetWt += obj?.NetWt;
          resultArr[findRecord].LossWt += obj?.LossWt;
          resultArr[findRecord].primaryWt += obj?.primaryWt;
          resultArr[findRecord].primaryMetal.Pcs += obj?.primaryMetal.Pcs;
          resultArr[findRecord].primaryMetal.Wt += obj?.primaryMetal.Wt;
          resultArr[findRecord].primaryMetal.Amount += obj?.primaryMetal.Amount;
          resultArr[findRecord].netWtFinal += obj?.netWtFinal;
          resultArr[findRecord].metalAmountFinal += obj?.metalAmountFinal
        }
      }

      jobWiseLabourCalc += ((e?.MetalDiaWt - findingWt) * e?.MaKingCharge_Unit);
      jobWiseMinusFindigWt += (e?.MetalDiaWt - findingWt);

      e?.diamonds?.forEach((ele, ind) => {
        diamondTotal += (ele?.Amount);
        if (ele?.Rate === 0) {
          let findDiamond = diamonds?.findIndex((elem, index) => elem?.Rate === 0);
          if (findDiamond === -1) {
            diamonds?.push(ele);
          } else {
            diamonds[findDiamond].Wt += ele?.Wt;
            diamonds[findDiamond].Pcs += ele?.Pcs;
            diamonds[findDiamond].Amount += ele?.Amount;
            diamonds[findDiamond].RMwt += ele?.RMwt;
          }
        } else {
          // let findDiamond = diamonds?.findIndex((elem, index) => elem?.MaterialTypeName === ele?.MaterialTypeName && elem?.ShapeName === ele?.ShapeName &&
          //   elem?.Colorname === ele?.Colorname && elem?.QualityName === ele?.QualityName && elem?.Rate === ele?.Rate);
          let findDiamond = diamonds?.findIndex((elem, index) => elem?.MaterialTypeName === ele?.MaterialTypeName &&
            // elem?.ShapeName === ele?.ShapeName && elem?.Colorname === ele?.Colorname && 
            elem?.QualityName === ele?.QualityName && elem?.Rate === ele?.Rate);
          if (findDiamond === -1) {
            // let findDiamonds = diamonds?.findIndex((elem, index) => elem?.QualityName === ele?.QualityName && elem?.Rate === ele?.Rate && elem?.MaterialTypeName === ele?.MaterialTypeName);
            // if (findDiamonds === -1) {
            diamonds?.push(ele);
            // } else {
            //   diamonds[findDiamonds].Wt += ele?.Wt;
            //   diamonds[findDiamonds].Pcs += ele?.Pcs;
            //   diamonds[findDiamonds].Amount += ele?.Amount;
            //   diamonds[findDiamonds].RMwt += ele?.RMwt;
            // }
          } else {
            diamonds[findDiamond].Wt += ele?.Wt;
            diamonds[findDiamond].Pcs += ele?.Pcs;
            diamonds[findDiamond].Amount += ele?.Amount;
            diamonds[findDiamond].RMwt += ele?.RMwt;
          }
        }

      });

      e?.colorstone?.forEach((ele, ind) => {
        // total2.total += (ele?.Amount );
        // let findColorStones = colorStones?.findIndex((elem, index) => elem?.isRateOnPcs === ele?.isRateOnPcs && elem?.MaterialTypeName === ele?.MaterialTypeName && elem?.ShapeName === ele?.ShapeName &&
        //   elem?.Colorname === ele?.Colorname && elem?.QualityName === ele?.QualityName);
        let findColorStones = colorStones?.findIndex((elem, index) => elem?.MaterialTypeName === ele?.MaterialTypeName && elem?.Rate === ele?.Rate);
        if (findColorStones === -1) {
          colorStones?.push(ele);
        } else {
          colorStones[findColorStones].Wt += ele?.Wt;
          colorStones[findColorStones].Pcs += ele?.Pcs;
          colorStones[findColorStones].Amount += (ele?.Amount);
        }
        if (ele?.isRateOnPcs === 0) {
          colorStone1Total1 += ele?.Amount
        } else {
          colorStone2Total2 += ele?.Amount
        }
      });

      e?.misc?.forEach((ele, ind) => {
        if (ele?.isRateOnPcs === 0) {
          misc1Total1 += ele?.Amount;
        } else {
          misc2Total2 += ele?.Amount;
        }
        if (ele?.IsHSCOE !== 0) {
          let findMisc = miscs?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName);
          if (findMisc === -1) {
            miscs?.push(ele);
          } else {
            miscs[findMisc].Wt += ele?.Wt
            miscs[findMisc].Pcs += ele?.Pcs
            miscs[findMisc].Amount += (ele?.Amount)
          }
          // total2.total += (ele?.Amount);
        }
        else if (ele?.IsHSCOE === 0) {
          // total2.total += ele?.Amount;
          let findMisc = misc2?.findIndex((elem, index) => elem?.isRateOnPcs === ele?.isRateOnPcs);
          if (findMisc === -1) {
            misc2?.push(ele);
          } else {
            misc2[findMisc].Wt += ele?.Wt;
            misc2[findMisc].Pcs += ele?.Pcs;
            misc2[findMisc].Amount += (ele?.Amount);
          }

        }
      });

      e?.other_details?.forEach((ele, ind) => {
        let findOther = otherCharges?.findIndex((elem, index) => elem?.label === ele?.label);
        total2.total += (+ele?.value);
        if (findOther === -1) {
          otherCharges?.push(ele);
        } else {
          otherCharges[findOther].value = +otherCharges[findOther]?.value + +ele?.value;
        }
      });

    });
    console.log(labourAmt);
    if (labourWt !== 0) {
      labourRate = Math?.round(labourAmt / labourWt);
    }
    labour.rate = labourRate;
    labour.amount = labourAmt;
    let totalPcs = totalPcss?.reduce((acc, cObj) => acc + cObj?.value, 0);
    // total2.total += labour?.totalAmount
    total2.total += (diamondTotal / data?.BillPrint_Json[0]?.CurrencyExchRate) + (colorStone1Total1 / data?.BillPrint_Json[0]?.CurrencyExchRate) +
      (colorStone2Total2 / data?.BillPrint_Json[0]?.CurrencyExchRate) + (misc1Total1 / data?.BillPrint_Json[0]?.CurrencyExchRate) +
      (misc2Total2 / data?.BillPrint_Json[0]?.CurrencyExchRate) + (labour?.totalAmount / data?.BillPrint_Json[0]?.CurrencyExchRate) + (diamondHandling / data?.BillPrint_Json[0]?.CurrencyExchRate);

    labour.primaryWt = jobWiseMinusFindigWt;
    resultArr.sort((a, b) => {
      const labelA = a.MetalTypePurity.toLowerCase();
      const labelB = b.MetalTypePurity.toLowerCase();

      // Check if labels contain numbers
      const hasNumberA = /\d/.test(labelA);
      const hasNumberB = /\d/.test(labelB);

      if (hasNumberA && !hasNumberB) {
        return -1; // Label with number comes before label without number
      } else if (!hasNumberA && hasNumberB) {
        return 1; // Label without number comes after label with number
      } else {
        // Both labels have numbers or both don't, sort alphabetically
        return labelA.localeCompare(labelB);
      }
    });


    diamonds.sort(compare);
    colorStones.sort(compare);

    miscs?.sort((a, b) => {
      if (a.ShapeName < b.ShapeName) {
        return -1;
      } else if (a.ShapeName > b.ShapeName) {
        return 1; 
      } else {
       return 0
      }
    })

    otherCharges?.sort((a, b) => {
      if (a.label < b.label) {
        return -1;
      } else if (a.label > b.label) {
        return 1; 
      } else {
       return 0
      }
    })

    console.log(colorStones[1], colorStones[2]);
    setTotalss({ ...totalss, total: total2?.total, discount: total2?.discount, totalPcs: totalPcs, });
    setMainData({
      ...mainData, resultArr: resultArr, findings: findings, diamonds: diamonds, colorStones: colorStones,
      miscs: miscs, otherCharges: otherCharges, misc2: misc2, labour: labour, diamondHandling: diamondHandling
    });

  }

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
        if (data?.Status === '200') {
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
    }
    sendData();
  }, []);

  return (
    loader ? <Loader /> : msg === "" ? <div className='container portraitContainer inoviceprintContainer max_width_container pad_60_allPrint mt-2 px-1'>
      {/* buttons */}
      <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 pt-4">
        <div className="form-check">
          <input type="button" className="btn_white blue" value="Print" style={{ fontSize: "15px" }} onClick={(e) => handlePrint(e)} />
        </div>
      </div>
      {/* heading */}
      <div className="bgGrey text-uppercase fs-5 fw-bold p-2 text-white mb-2 no_break">{json0?.PrintHeadLabel}</div>
      {/* address */}
      <div className="w-100 d-flex justify-content-between py-2 no_break">
        <div className='col-10 p-1 border border-2 border-white p-1'>
          <p className='fw-bold fs-6 pb-1'>{json0?.CompanyFullName}</p>
          <p className='pb-1'>{json0?.CompanyAddress}</p>
          <p className='pb-1'>{json0?.CompanyCity}-{json0?.CompanyPinCode}, {json0?.CompanyState}{json0?.CompanyCountry !== "" && `(${json0?.CompanyCountry})`}</p>
          {/* <p>{json0?.CompanyAddress2}-{json0?.CompanyPinCode}, {json0?.CompanyState}({json0?.CompanyCountry})</p> */}
          <p className='pb-1'>T {json0?.CompanyTellNo} | TOLL FREE {json0?.CompanyTollFreeNo}</p>
          <p className='pb-1'>{json0?.CompanyEmail} | {json0?.CompanyWebsite}</p>
        </div>
        <div className='col-2'>
          {isImageWorking && (json0?.PrintLogo !== "" &&
            <img src={json0?.PrintLogo} alt=""
              className='w-100 h-auto ms-auto d-block object-fit-contain'
              style={{ maxWidth: '138px' }}
              onError={handleImageErrors} height={120} width={150} />)}
          {/* <img src={json0?.PrintLogo} alt="" className='w-100 invoicePrintLogo' /> */}
        </div>
      </div>
      {/* bill no */}
      <div className="w-100 d-flex justify-content-between border-top py-2 no_break">
        <div className='col-9'>
        </div>
        <div className='col-3'>
          <div className="border border-2 p-2 border-black">
            <div className="d-flex pb-1">
              <p className='col-3 fw-bold'>BILL NO</p>
              <p className='col-9 ps-2'>{json0?.InvoiceNo}</p>
            </div>
            <div className="d-flex pb-1">
              <p className='col-3 fw-bold'>DATE</p>
              <p className='col-9 ps-2'>{json0?.EntryDate}</p>
            </div>
            <div className="d-flex pb-1">
              <p className='col-3 fw-bold'>HSN</p>
              <p className='col-9 ps-2'>{json0?.HSN_No}</p>
            </div>
          </div>
        </div>
      </div>
      {/* customer address */}
      <div className="pb-2 no_break">
        <div className="d-flex border-2 border border-black p-1">
          <div className="col-6">
            <p className='pb-1 fs-6 fw-bold'> To,	{json0?.customerfirmname}</p>
            <p className="pb-1 ps-4">{json0?.customerstreet}</p>
            <p className="pb-1 ps-4">{json0?.customerAddress2}</p>
            <p className="pb-1 ps-4">{json0?.customercity}{json0?.customerpincode}</p>
            <p className="pb-1 ps-4">STATE NAME : {json0?.State}</p>
          </div>
          <div className="col-3"></div>
          <div className="col-3 d-flex justify-content-center align-items-start flex-column">
            <p className='d-flex w-100 pb-1'><span className='fw-bold' style={{ minWidth: "70px" }}>GSTIN: </span><span className='ps-2'>{json0?.CustGstNo}</span></p>
            <p className='d-flex w-100 pb-1'><span className='fw-bold' style={{ minWidth: "70px" }}>STATE CODE: </span><span className='ps-2'>{json0?.Cust_CST_STATE_No}</span></p>
            <p className='d-flex w-100 pb-1'><span className='fw-bold' style={{ minWidth: "70px" }}>PAN NO : </span><span className='ps-2'>{json0?.CustPanno}</span></p>
          </div>
        </div>
      </div>
      {/* discription */}
      <div className="pb-2 no_break">
        <div className="d-flex border border-2 border-black">
          <div className="col-3 border-end border-2 border-black position-relative">
            <p className="fw-bold p-1 text-center border-bottom border-2 border-black">DESCRIPTION</p>
            <div className="minHieght150InvoicePrint d-flex justify-content-center pt-5 mt-3 h-100">
              <p>{datass?.mainTotal?.diamonds?.Pcs > 0 ? "DIAMOND STUDDED" : "GOLD"}  JEWELLERY</p>
            </div>
            <div className="minHieght28InvoicePrint border-top border-2 border-black position-absolute bottom-0 left-0 w-100"></div>
          </div>
          <div className="col-9">
            <div className="d-flex border-bottom border-black border-2 p-1">
              <div className="col-4">
                <p className="fw-bold">DETAIL	</p>
              </div>
              <div className="col-3">
                <p className="fw-bold text-end">WEIGHT	</p>
              </div>
              <div className="col-2">
                <p className="fw-bold text-end">
                  RATE
                </p>
              </div>
              <div className="col-3">
                <p className="fw-bold text-end">
                  AMOUNT
                </p>
              </div>
            </div>
            <div className="minHieght150InvoicePrint pt-1">
              {mainData?.resultArr?.map((e, i) => {
                return <div className="d-flex pb-1" key={i}>
                  <div className="col-4 px-1 text-uppercase"><p>{e?.primaryMetal?.ShapeName} {e?.primaryMetal?.QualityName}</p></div>
                  <div className="col-3 px-1 text-end"><p>{NumberWithCommas(e?.netWtFinal, 3)} </p></div>
                  <div className="col-2 px-1 text-end"><p>{e?.netWtFinal !== 0 && NumberWithCommas((e?.metalAmountFinal / json0?.CurrencyExchRate) / e?.netWtFinal, 2)}</p></div>
                  <div className="col-3 px-1 text-end"><p>{NumberWithCommas(e?.metalAmountFinal / json0?.CurrencyExchRate, 2)}</p></div>
                </div>
              })}
              {mainData?.diamonds?.map((e, i) => {
                return <div className="d-flex pb-1" key={i}>
                  <div className="px-1 text-uppercase col-4"><p>{e?.MasterManagement_DiamondStoneTypeName} {e?.MaterialTypeName !== "" && `(${e?.MaterialTypeName})`}</p></div>
                  <div className="px-1 text-end col-3"><p>{NumberWithCommas(e?.Wt, 3)} </p></div>
                  <div className="px-1 text-end col-2"><p>{(e?.isRateOnPcs === 0 ? (e?.Wt !== 0 && <>{NumberWithCommas((e?.Amount / e?.Wt) / json0?.CurrencyExchRate, 0)} </>) : (e?.Pcs !== 0 && <>{NumberWithCommas((e?.Amount / e?.Pcs) / json0?.CurrencyExchRate, 0)} / Pcs</>))}</p></div>
                  <div className="px-1 text-end col-3"><p>{NumberWithCommas(e?.Amount, 2)}</p></div>
                </div>
              })}
              {mainData?.colorStones?.map((e, i) => {
                return <div className="d-flex pb-1" key={i}>
                  <div className="col-4 px-1 text-uppercase"><p>STONE {e?.MaterialTypeName !== "" && `(${e?.MaterialTypeName})`}</p></div>
                  <div className="col-3  px-1 text-end"><p>{NumberWithCommas(e?.Wt, 3)} </p></div>
                  <div className="col-2  px-1 text-end"><p>{(e?.isRateOnPcs === 0 ? (e?.Wt !== 0 && <>{NumberWithCommas((e?.Amount / e?.Wt) / json0?.CurrencyExchRate, 0)} </>) : (e?.Pcs !== 0 && <>{NumberWithCommas((e?.Amount / e?.Pcs) / json0?.CurrencyExchRate, 0)} </>))}</p></div>
                  <div className="col-3  px-1 text-end"><p>{NumberWithCommas(e?.Amount, 2)}</p></div>
                </div>
              })}
              <div className="d-flex pb-1">
                <div className="px-1 col-4 text-uppercase"><p>{mainData?.labour?.label}</p></div>
                <div className="px-1 col-3 text-end"><p></p></div>
                <div className="px-1 col-2 text-end"><p>{mainData?.labour?.primaryWt !== 0 && NumberWithCommas((mainData?.labour?.rate), 0)}</p></div>
                <div className="px-1 col-3 text-end"><p>{NumberWithCommas(datass?.mainTotal?.total_Making_Amount + datass?.mainTotal?.diamonds?.SettingAmount +
                  datass?.mainTotal?.colorstone?.SettingAmount + datass?.mainTotal?.misc?.Amount + datass?.mainTotal?.total_diamondHandling, 2)}</p></div>
              </div>
              {mainData?.miscs?.map((e, i) => {
                return <div className="d-flex pb-1" key={i}>
                  <div className="col-4 px-1 text-uppercase"><p>{e?.ShapeName}</p></div>
                  <div className="col-3 px-1 text-end"><p></p></div>
                  <div className="col-2 px-1 text-end"><p></p></div>
                  <div className="col-3 px-1 text-end"><p>{NumberWithCommas(e?.Amount / json0?.CurrencyExchRate, 2)}</p></div>
                </div>
              })}
              {mainData?.otherCharges?.map((e, i) => {
                return <div className="d-flex pb-1" key={i}>
                  <div className="col-4 px-1 text-uppercase"><p>{e?.label}</p></div>
                  <div className="col-3 px-1 text-end"><p></p></div>
                  <div className="col-2 px-1 text-end"><p></p></div>
                  <div className="col-3 px-1 text-end"><p>{NumberWithCommas(+e?.value, 2)}</p></div>
                </div>
              })}
            </div>
            <div className="minHieght28InvoicePrint d-flex justify-content-between align-items-center py-1 px-2 border-top border-black border-2">
              <p className='fw-bold text-end'>Total</p>
              <p className='fw-bold'>{NumberWithCommas(datass?.mainTotal?.total_unitcost, 2)}</p>
            </div>
          </div>
        </div>
      </div>
      {/* cgst */}
      <div className="pb-2 d-flex justify-content-end no_break">
        <div className='col-3'>
          <span className="fw-bold">  Note: </span>{json0?.PrintRemark}
        </div>
        <div className="col-6 border-2 border-black border">
          {datass?.mainTotal?.total_discount_amount !== 0 && <div className="d-flex py-1 justify-content-between px-2 ">
            <p>Discount	 </p>
            <p>{NumberWithCommas(datass?.mainTotal?.total_discount_amount, 2)} </p>
          </div>}
          <div className="d-flex p-1 justify-content-between py-1 px-2">
            <p className='fw-bold'>Total Amount	 </p>
            <p className='fw-bold'>{NumberWithCommas(datass?.mainTotal?.total_amount, 2)} </p>
          </div>
          {
            datass?.allTaxes?.map((e, i) => {
              return <div className="d-flex p-1 justify-content-between py-1 px-2" key={i}>
                <p>{e?.name} @ {e?.per}</p>
                <p>{NumberWithCommas(+e?.amount * json0?.CurrencyExchRate, 2)} </p>
              </div>
            })
          }
          {json0?.AddLess !== 0 && <div className="d-flex justify-content-between py-1 px-2">
            <p className='fw-bold'>{json0?.AddLess > 0 ? "Add" : "Less"} </p>
            <p>{NumberWithCommas(json0?.AddLess, 2)}</p>
          </div>}
          {json0?.AddLess !== 0 && <div className="d-flex justify-content-between py-1 px-2 border-top border-2 border-black">
            <p className='fw-bold'>Grand Total </p>
            <p className='fw-bold'>{NumberWithCommas(datass?.mainTotal?.total_amount + datass?.allTaxes?.reduce((acc, cObj) => acc + (+cObj?.amount * json0?.CurrencyExchRate), 0) + json0?.AddLess, 2)}</p>
          </div>}
        </div>
      </div>
      {/* total price in text */}
      <div className="pb-2 no_break">
        <div className="border border-2 border-black p-1">
          <p className="fw-bold">Rs. {toWords?.convert(+fixedValues(datass?.mainTotal?.total_amount + datass?.allTaxes?.reduce((acc, cObj) => acc + (+cObj?.amount * json0?.CurrencyExchRate), 0) + json0?.AddLess, 2))} Only.</p>
        </div>
      </div>
      {/* note */}
      <div className="pb-2 no_break">
        <div className="border border-2 border-black p-1">
          <p className='fw-bold'>NOTE :</p>
          <p className='declarationInvoicePrint' dangerouslySetInnerHTML={{ __html: json0?.Declaration }}></p>
        </div>
      </div>
      {/* company details */}
      <div className="pb-2 no_break">
        <div className="border border-2 border-black p-1">
          <p className="fw-bold pb-1">COMPANY DETAILS :</p>
          <p className='pb-1'>GSTIN. : {json0?.Company_VAT_GST_No?.split("-")[1]}</p>
          <p className='pb-1'>{json0?.Company_CST_STATE} : {json0?.Company_CST_STATE_No}</p>
          <p className='pb-1'>PAN NO. : {json0?.Pannumber}</p>
          <p className='pb-1'>Kindly make your payment by the name of <span className="fw-bold">"{json0?.accountname}"</span></p>
          <p className='pb-1'>Payable at ST (GJ) by cheque or DD</p>
          <p className='pb-1'>Bank Detail : Bank Account No - <span className="fw-bold">{json0?.accountnumber}</span></p>
          <p className='pb-1'>Bank Name : {json0?.bankname} {json0?.bankaddress}</p>
          <p className=''>RTGS/NEFT IFSC : -{json0?.rtgs_neft_ifsc}</p>
        </div>
      </div>
      {/* authorised amigos */}
      <div className="pb-2 d-flex justify-content-between no_break">
        <div className="w-50 pe-1">
          <div className="border border-2 border-black d-flex justify-content-center minHieght138InvoicePrint">
            <p className='fw-bold'> AUTHORISED, {json0?.customerfirmname}</p>
          </div>
        </div>
        <div className="w-50 ps-1">
          <div className="border border-2 border-black d-flex justify-content-center minHieght138InvoicePrint">
            <p className='fw-bold'>AUTHORISED, {json0?.CompanyFullName}</p>
          </div>
        </div>
      </div>
    </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
  )
}

export default InvoicePrint;