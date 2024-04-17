import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import style from "../../assets/css/prints/InvoicePrint_10_11.module.css";
import {
  FooterComponent,
  HeaderComponent,
  NumberWithCommas,
  apiCall,
  fixedValues,
  handlePrint,
  isObjectEmpty,
  taxGenrator,
} from "../../GlobalFunctions";
import { ToWords } from "to-words";
import BarcodePrintGenerator from "../../components/barcodes/BarcodePrintGenerator";
import style2 from "../../assets/css/headers/header1.module.css";
import footerStyle from "../../assets/css/footers/footer2.module.css";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { cloneDeep } from "lodash";

const InvoicePrint_10_11 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [otherMaterial, setOtherMaterial] = useState([]);
  const [header, setHeader] = useState(null);
  const [footer, setFooter] = useState(null);
  const [headerData, setHeaderData] = useState({});
  const [customerAddress, setCustomerAddress] = useState([]);
  const [total, setTotal] = useState({
    total: 0,
    grandtotal: 0,
    totals: 0,
    discounttotals: 0
  });
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  // const [discount, setDiscount] = useState(0);
  // const [taxes, setTaxes] = useState([]);
  const [pnm, setPnm] = useState(atob(printName).toLowerCase());
  const [totalpcsss, setTotalPcsss] = useState(0);
  const toWords = new ToWords();
  const [discount, setDiscount] = useState(0);
  const [taxes, setTaxes] = useState([]);
  const [mainDatas, setMainDatas] = useState({});

  const [mainData, setMainData] = useState({
    resultArr: [],
    findings: [],
    diamonds: [],
    colorStones: [],
    miscs: [],
    otherCharges: [],
    misc2: [],
    labour: {},
    labours: [],
    diamondHandling: 0,
    secondaryMetal: [],
  });
  const [totalss, setTotalss] = useState({
    total: 0,
    discount: 0,
    totalPcs: 0,
    SettingAmount: 0,
  })

  const loadData = (data) => {
    let discounts = 0
    let head = HeaderComponent("1", data?.BillPrint_Json[0]);
    setHeader(head);
    setHeaderData(data?.BillPrint_Json[0]);
    let footers = FooterComponent("2", data?.BillPrint_Json[0]);
    setFooter(footers);
    let custAddress = data?.BillPrint_Json[0]?.Printlable.split("\n");
    setCustomerAddress(custAddress);


    let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
    setMainDatas(datas)
    console.log(datas);
    // let secondaryMetals = datas?.json2?.filter(ele=> ele?.IsPrimaryMetal !== 1 && ele?.MasterManagement_DiamondStoneTypeid === 4);
    // console.log(secondaryMetals);
    // let findingss = datas?.json2?.filter(ele=> ele?.MasterManagement_DiamondStoneTypeid === 5);
    // console.log(findingss);
    let resultArr = [];
    let findings = [];
    let diamonds = [];
    let colorStones = [];
    let misc2 = [];
    let labour = { label: "LABOUR", primaryWt: 0, makingAmount: 0, totalAmount: 0 };
    let labours = [];
    let miscs = [];
    let otherCharges = [];
    let secondaryMetal = [];
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
    let SettingAmount = datas?.mainTotal?.diamonds?.SettingAmount + datas?.mainTotal?.colorstone?.SettingAmount;
    datas?.resultArray?.map((e, i) => {
      let obj = cloneDeep(e);
      let findingWt = 0;
      let findingsWt = 0;
      let findingsAmount = 0;
      let secondaryMetalAmount = 0;
      let findLabour = labours?.findIndex((ele, ind) => ele?.MaKingCharge_Unit === e?.MaKingCharge_Unit);
      if(findLabour === -1){
        labours?.push({label: "LABOUR", MaKingCharge_Unit: e?.MaKingCharge_Unit, MakingAmount: e?.MakingAmount});
      }else{
        labours.MakingAmount += e?.MakingAmount
      }
      obj.primaryMetal = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1);
      e?.finding?.forEach((ele, ind) => {
        // if (ele?.ShapeName !== obj?.primaryMetal?.ShapeName && ele?.QualityName !== obj?.primaryMetal?.QualityName) {
        let obb = cloneDeep(ele);
        if (obj?.primaryMetal) {
          obb.Rate = obj?.primaryMetal?.Rate;
          obb.Amount = (ele?.Wt * obb?.Rate);
          findingsAmount += (ele?.Wt * obb?.Rate);
        }
        obb.count = 1;
        findingsWt += ele?.Wt;
        let findFinding = findings?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName && elem?.QualityName === ele?.QualityName);
        if (findFinding === -1) {
          findings?.push(obb);
        } else {
          findings[findFinding].Wt += ele?.Wt;
          findings[findFinding].Pcs += ele?.Pcs;
          findings[findFinding].Rate = findings[findFinding].Rate + obb?.Rate;
          findings[findFinding].Amount += obb?.Amount;
          findings[findFinding].count += 1;
        }

        total2.total += (obb?.Amount);
        // }
        if (ele?.Supplier?.toLowerCase() === "customer") {
          findingWt += ele?.Wt
        }
      });
      let secondaryWt = 0;
      e?.metal?.forEach((ele, ind) => {
        if (ele?.IsPrimaryMetal !== 1) {
          let findSecondary = secondaryMetal?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName && elem?.QualityName === ele?.QualityName && elem?.Rate === ele?.Rate);
          if (findSecondary === -1) {
            secondaryMetal?.push(ele)
          } else {
            secondaryMetal[findSecondary].Wt += ele?.Wt;
            secondaryMetal[findSecondary].Pcs += ele?.Pcs;
            secondaryMetal[findSecondary].Amount += ele?.Amount;
          }
          secondaryWt += ele?.Wt;
        }
      })

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
      let netWtFinal = e?.NetWt + e?.LossWt - findingsWt;

      diamondHandling += e?.TotalDiamondHandling;
      e?.metal?.forEach((ele, ind) => {
        count += 1;
        if (ele?.IsPrimaryMetal === 1) {
          primaryWt += ele?.Wt;
        } else {
          secondaryMetalAmount += ele?.Amount;
        }
      });
      primaryWt = primaryWt - findingsWt
      // labour.primaryWt += primaryWt;
      labour.makingAmount += e?.MakingAmount;
      labour.totalAmount += e?.MakingAmount + e?.TotalDiaSetcost + e?.TotalCsSetcost;
      total2.discount += e?.DiscountAmt;
      obj.primaryWt = primaryWt;
      obj.netWtFinal = netWtFinal;
      obj.metalAmountFinal = e?.MetalAmount - findingsAmount + secondaryMetalAmount;
      if (count <= 1) {
        primaryWt = e?.NetWt + e?.LossWt;
      }
      if (obj?.primaryMetal) {
        total2.total += obj?.metalAmountFinal;
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
          resultArr[findRecord].metalAmountFinal += obj?.metalAmountFinal;
        }
      }

      jobWiseLabourCalc += ((e?.MetalDiaWt - findingWt) * e?.MaKingCharge_Unit);
      jobWiseMinusFindigWt += (e?.MetalDiaWt - findingWt);

      e?.diamonds?.forEach((ele, ind) => {
        let findDiamond = diamonds?.findIndex((elem, index) => elem?.isRateOnPcs === ele?.isRateOnPcs);
        diamondTotal += (ele?.Amount);
        if (findDiamond === -1) {
          diamonds?.push(ele);
        } else {
          diamonds[findDiamond].Wt += ele?.Wt;
          diamonds[findDiamond].Pcs += ele?.Pcs;
          diamonds[findDiamond].Amount += (ele?.Amount);
        }
      });

      e?.colorstone?.forEach((ele, ind) => {
        // total2.total += (ele?.Amount );
        let findColorStones = colorStones?.findIndex((elem, index) => elem?.isRateOnPcs === ele?.isRateOnPcs);
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
    findings?.forEach((ele, ind) => {
      ele.Rate = ele?.Amount / ele?.Wt;
    })

    let totalPcs = totalPcss?.reduce((acc, cObj) => acc + cObj?.value, 0);
    // total2.total += labour?.totalAmount
    total2.total += (diamondTotal / data?.BillPrint_Json[0]?.CurrencyExchRate) + (colorStone1Total1 / data?.BillPrint_Json[0]?.CurrencyExchRate) +
      (colorStone2Total2 / data?.BillPrint_Json[0]?.CurrencyExchRate) + (misc1Total1 / data?.BillPrint_Json[0]?.CurrencyExchRate) +
      (misc2Total2 / data?.BillPrint_Json[0]?.CurrencyExchRate) + labour?.totalAmount + diamondHandling;

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
    setTotalss({ ...totalss, total: total2?.total, discount: total2?.discount, totalPcs: totalPcs, SettingAmount: SettingAmount, });
    setMainData({
      ...mainData, resultArr: resultArr, findings: findings, diamonds: diamonds, colorStones: colorStones,
      miscs: miscs, otherCharges: otherCharges, misc2: misc2, labour: labour, diamondHandling: diamondHandling, secondaryMetal: secondaryMetal, labours: labours
    });
  };

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
  }, []);

  return loader ? (
    <Loader />
  ) : msg === "" ? (
    <div
      className={`container container-fluid max_width_container mt-1 ${style?.InvoicePrint_10_11} pad_60_allPrint`}
    >
      {/* buttons */}
      <div
        className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}
      >
        <div className={`form-check ps-3 ${style?.printBtn}`}>
          <input
            type="button"
            className="btn_white blue py-2 mt-2"
            value="Print"
            onClick={(e) => handlePrint(e)}
          />
        </div>
      </div>
      {/* header */}
      <div className={`${style2.headline} headerTitle`}>{headerData?.PrintHeadLabel}</div>
      <div className={style2.companyDetails}>
        <div className={`${style2.companyhead} p-2`}>
          <div className={style2.lines} style={{ fontWeight: "bold" }}>
            {headerData?.CompanyFullName}
          </div>
          <div className={style2.lines}>{headerData?.CompanyAddress}</div>
          <div className={style2.lines}>{headerData?.CompanyAddress2}</div>
          <div className={style2.lines}>{headerData?.CompanyCity}-{headerData?.CompanyPinCode},{headerData?.CompanyState}({headerData?.CompanyCountry})</div>
          {/* <div className={style2.lines}>Tell No: {headerData?.CompanyTellNo}</div> */}
          <div className={style2.lines}>T:  {headerData?.CompanyTellNo} | TOLL FREE {headerData?.CompanyTollFreeNo} | TOLL FREE {headerData?.CompanyTollFreeNo}</div>
          <div className={style2.lines}>
            {headerData?.CompanyEmail} | {headerData?.CompanyWebsite}
          </div>
          <div className={style2.lines}>
            {/* {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber} */}
            {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber}
          </div>
        </div>
        <div style={{ width: "30%" }} className="d-flex justify-content-end align-item-center h-100">
          {isImageWorking && (headerData?.PrintLogo !== "" &&
            <img src={headerData?.PrintLogo} alt=""
              className='w-100 h-auto ms-auto d-block object-fit-contain'
              style={{ maxWidth: '116px' }}
              onError={handleImageErrors} height={120} width={150} />)}
          {/* <img src={headerData?.PrintLogo} alt="" className={style2.headerImg} /> */}
        </div>
      </div>
      {/* barcodes */}
      {pnm === "invoice print 10" && <div className="mb-1">
        <div className="d-flex justify-content-between border p-2 pb-1">
          <div className={`${style?.barcode}`}>
            <BarcodePrintGenerator data={headerData?.VenCode} />
            <p className="fw-bold text-center">{headerData?.VenCode}</p>
          </div>
          <div className={`${style?.barcode}`}>
            <BarcodePrintGenerator data={headerData?.InvoiceNo} />
            <p className="fw-bold text-center">{headerData?.InvoiceNo}</p>
          </div>
        </div>
      </div>}

      <div className="border d-flex">
        <div className="col-4 px-2 border-end">
          <p>{headerData?.lblBillTo}</p>
          <p className="fw-bold pe-2">{headerData?.customerfirmname}</p>
          <p>{headerData?.customerAddress1}</p>
          <p>{headerData?.customerAddress2}</p>
          <p>
            {headerData?.customercity1} - {" "}
            {headerData?.PinCode}
          </p>
          <p>{headerData?.customeremail1}</p>
          <p>{headerData?.vat_cst_pan}</p>
          <p>
            {headerData?.Cust_CST_STATE}-{headerData?.Cust_CST_STATE_No}
          </p>
        </div>
        <div className="col-4 px-2 border-end">
          <p>Ship To,</p>
          <p className="fw-bold">{headerData?.customerfirmname}</p>
          {customerAddress.map((e, i) => {
            return <p key={i}>{e}</p>;
          })}
        </div>
        <div className="col-4 px-2">
          <div className="d-flex">
            <div className="fw-bold col-6">BILL NO</div>
            <div className="col-6">{headerData?.InvoiceNo} </div>
          </div>
          <div className="d-flex">
            <div className="fw-bold col-6">DATE</div>
            <div className="col-6">{headerData?.EntryDate} </div>
          </div>
          <div className="d-flex">
            <div className="fw-bold col-6">{headerData?.HSN_No_Label}</div>
            <div className="col-6">{headerData?.HSN_No} </div>
          </div>
          <div className="d-flex">
            <div className="fw-bold col-6">NAME OF GOODS</div>
            <div className="col-6">{headerData?.NameOfGoods} </div>
          </div>
          <div className="d-flex">
            <div className="fw-bold col-6">PLACE OF SUPPLY</div>
            <div className="col-6">{headerData?.customerstate} </div>
          </div>
          <div className="d-flex">
            <div className="fw-bold col-6">TERMS</div>
            <div className="col-6">{headerData?.DueDays} </div>
          </div>
        </div>
      </div>

      <div className="my-1">
        <div className="d-flex border">
          <div className="col-3 border-end">
            <p className="text-center fw-bold border-bottom">DESCRIPTION</p>
          </div>
          <div className="col-9">
            <div className="d-flex border-bottom">
              <div style={{ minWidth: "17%", width: "17%" }} className="fw-bold px-1">Detail</div>
              <div style={{ minWidth: "14.5%", width: "14.5%" }} className="fw-bold px-1 text-end">Gross Wt. </div>
              <div style={{ minWidth: "14.5%", width: "14.5%" }} className="fw-bold px-1 text-end">Net Wt. </div>
              <div style={{ minWidth: "9%", width: "9%" }} className="fw-bold px-1 text-end">Pcs </div>
              <div style={{ minWidth: "15%", width: "15%" }} className="fw-bold px-1 text-end">Qty </div>
              <div style={{ minWidth: "15%", width: "15%" }} className="fw-bold px-1 text-end">Rate </div>
              <div style={{ minWidth: "15%", width: "15%" }} className="fw-bold px-1 text-end">Amount</div>
            </div>
          </div>
        </div>
        <div className="d-flex border-start border-end border-bottom">
          <div className="col-3 border-end d-flex align-items-center justify-content-center flex-column">
            <p className="w-100 text-center">DIAMOND STUDDED JEWELLERY</p>
            <p className="fw-bold">Total Pcs : {NumberWithCommas(totalpcsss, 0)}</p>
          </div>
          <div className="col-9">
            {mainData?.resultArr?.map((e, i) => {
              return <div className="d-flex" key={i}>
                <div style={{ minWidth: "17%", width: "17%" }} className=" px-1"><p>{e?.primaryMetal?.ShapeName} {e?.primaryMetal?.QualityName}</p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className=" px-1 text-end"><p>{NumberWithCommas(e?.grosswt, 3)} Gms</p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className=" px-1 text-end"><p>{NumberWithCommas(e?.primaryWt, 3)} Gms</p></div>
                <div style={{ minWidth: "9%", width: "9%" }} className=" px-1"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className=" px-1"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p>{NumberWithCommas(e?.primaryMetal?.Rate, 2)}</p></div>
                {/* <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p>{NumberWithCommas(e?.primaryMetal?.Amount, 2)}</p></div> */}
                <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p>{NumberWithCommas(e?.primaryWt * e?.primaryMetal?.Rate, 2)}</p></div>
              </div>
            })}
            {mainData?.findings?.map((e, i) => {
              return <div className="d-flex" key={i}>
                <div style={{ minWidth: "17%", width: "17%" }} className="px-1"><p>{e?.ShapeName} {e?.QualityName}</p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Wt, 3)} Gms</p></div>
                <div style={{ minWidth: "9%", width: "9%" }} className="px-1"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Rate, 2)}</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Amount / headerData?.CurrencyExchRate, 2)}</p></div>
              </div>
            })}
            {mainData?.secondaryMetal?.map((e, i) => {
              return <div className="d-flex" key={i}>
                <div style={{ minWidth: "17%", width: "17%" }} className="px-1"><p>{e?.ShapeName} {e?.QualityName}</p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Wt, 3)} Gms</p></div>
                <div style={{ minWidth: "9%", width: "9%" }} className="px-1"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Rate, 2)}</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Amount / headerData?.CurrencyExchRate, 2)}</p></div>
              </div>
            })}
            {mainData?.diamonds?.map((e, i) => {
              return <div className="d-flex" key={i}>
                <div style={{ minWidth: "17%", width: "17%" }} className="px-1"><p>{e?.MasterManagement_DiamondStoneTypeName}</p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "9%", width: "9%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Pcs, 0)}</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Wt, 3)} Ctw</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{(e?.isRateOnPcs === 0 ? (e?.Wt !== 0 && <>{NumberWithCommas(e?.Amount / e?.Wt, 2)} / Wt</>) : (e?.Pcs !== 0 && <>{NumberWithCommas(e?.Amount / e?.Pcs, 2)} / Pcs</>))}</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Amount / headerData?.CurrencyExchRate, 2)}</p></div>
              </div>
            })}
            {mainData?.colorStones?.map((e, i) => {
              return <div className="d-flex" key={i}>
                <div style={{ minWidth: "17%", width: "17%" }} className=" px-1"><p>{e?.MasterManagement_DiamondStoneTypeName}</p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className=" px-1 text-end"><p></p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className=" px-1 text-end"><p></p></div>
                <div style={{ minWidth: "9%", width: "9%" }} className=" px-1 text-end"><p>{NumberWithCommas(e?.Pcs, 0)}</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p>{NumberWithCommas(e?.Wt, 3)} Ctw</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p>{(e?.isRateOnPcs === 0 ? (e?.Wt !== 0 && <>{NumberWithCommas(e?.Amount / e?.Wt, 2)} / Wt</>) : (e?.Pcs !== 0 && <>{NumberWithCommas(e?.Amount / e?.Pcs, 2)} / Pcs</>))}</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p>{NumberWithCommas(e?.Amount / headerData?.CurrencyExchRate, 2)}</p></div>
              </div>
            })}
            {mainData?.misc2?.map((e, i) => {
              return <div className="d-flex" key={i}>
                <div style={{ minWidth: "17%", width: "17%" }} className="px-1"><p>OTHER MATERIAL</p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "9%", width: "9%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Pcs, 0)}</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Wt, 3)} Gms</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{(e?.isRateOnPcs === 0 ? (e?.Wt !== 0 && <>{NumberWithCommas(e?.Amount / e?.Wt, 2)} / Wt</>) : (e?.Pcs !== 0 && <>{NumberWithCommas(e?.Amount / e?.Pcs, 2)} / Pcs</>))}</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Amount / headerData?.CurrencyExchRate, 2)}</p></div>
              </div>
            })}
            {
              mainData?.labours?.map((ele, ind) => {
                return <div className="d-flex" key={ind}>
                <div style={{ minWidth: "17%", width: "17%" }} className="px-1"><p>{ele?.label}</p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "9%", width: "9%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(ele?.MaKingCharge_Unit, 2)}</p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(ele?.MakingAmount, 2)}</p></div>
              </div>
              })
            }
            {/* <div className="d-flex">
              <div style={{ minWidth: "17%", width: "17%" }} className="px-1"><p>{mainData?.labour?.label}</p></div>
              <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
              <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
              <div style={{ minWidth: "9%", width: "9%" }} className="px-1 text-end"><p></p></div>
              <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p></p></div>
              <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{mainData?.labour?.primaryWt !== 0 && NumberWithCommas(mainData?.labour?.makingAmount / mainData?.labour?.primaryWt, 2)}</p></div>
              <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(mainData?.labour?.totalAmount / headerData?.CurrencyExchRate, 2)}</p></div>
            </div> */}
            {mainData?.miscs?.map((e, i) => {
              return <div className="d-flex" key={i}>
                <div style={{ minWidth: "17%", width: "17%" }} className="px-1"><p>{e?.ShapeName}</p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "9%", width: "9%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className="px-1 text-end"><p>{NumberWithCommas(e?.Amount / headerData?.CurrencyExchRate, 2)}</p></div>
              </div>
            })}
            {mainData?.diamondHandling !== 0 && <div className="d-flex">
              <div style={{ minWidth: "17%", width: "17%" }} className=" px-1"><p>HANDLING</p></div>
              <div style={{ minWidth: "14.5%", width: "14.5%" }} className=" px-1 text-end"><p></p></div>
              <div style={{ minWidth: "14.5%", width: "14.5%" }} className=" px-1 text-end"><p></p></div>
              <div style={{ minWidth: "9%", width: "9%" }} className=" px-1 text-end"><p></p></div>
              <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p></p></div>
              <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p></p></div>
              <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p>{NumberWithCommas(mainData?.diamondHandling, 2)}</p></div>
            </div>}
            {mainData?.otherCharges?.map((e, i) => {
              return <div className="d-flex" key={i}>
                <div style={{ minWidth: "17%", width: "17%" }} className=" px-1"><p>{e?.label}</p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className=" px-1 text-end"><p></p></div>
                <div style={{ minWidth: "14.5%", width: "14.5%" }} className=" px-1 text-end"><p></p></div>
                <div style={{ minWidth: "9%", width: "9%" }} className=" px-1 text-end"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p></p></div>
                <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p>{NumberWithCommas(+e?.value, 2)}</p></div>
              </div>
            })}
            {totalss?.SettingAmount !== 0 && <div className="d-flex">
              <div style={{ minWidth: "17%", width: "17%" }} className=" px-1"><p>SETTING</p></div>
              <div style={{ minWidth: "14.5%", width: "14.5%" }} className=" px-1 text-end"><p></p></div>
              <div style={{ minWidth: "14.5%", width: "14.5%" }} className=" px-1 text-end"><p></p></div>
              <div style={{ minWidth: "9%", width: "9%" }} className=" px-1 text-end"><p></p></div>
              <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p></p></div>
              <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p></p></div>
              <div style={{ minWidth: "15%", width: "15%" }} className=" px-1 text-end"><p>{NumberWithCommas(totalss?.SettingAmount, 2)}</p></div>
            </div>}
          </div>
        </div>
        {/* total */}
        <div className={`d-flex border-start border-end border-bottom mb-1 no_break ${style?.font_15}`}>
          <div className="col-3 border-end d-flex align-items-center justify-content-center flex-column"></div>
          <div className="col-9">
            <div className="d-flex border-bottom">
              <div className="col-2 px-1">
                <p className={`${style?.min_height_21} fw-bold`}>Total</p>
              </div>
              <div className="col-2 px-1">
                <p className={`${style?.min_height_21} text-end`}></p>
              </div>
              <div className="col-2 px-1">
                <p className={`${style?.min_height_21} text-end`}></p>
              </div>
              <div className="col-1 px-1">
                <p className={`${style?.min_height_21} text-end`}></p>
              </div>

              <div className="col-1 px-1">
                <p className={`${style?.min_height_21} text-end`}></p>
              </div>
              <div className="col-2 px-1">
                <p className={`${style?.min_height_21} text-end`}></p>
              </div>
              <div className="col-2 px-1">
                <p className={`${style?.min_height_21} text-end fw-bold`}>
                  {NumberWithCommas(totalss?.total, 2)}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* taxes */}
        <div className="d-flex border no_break">
          <div className="col-8 border-end"></div>
          <div className="col-4 px-1">
            {discount !== 0 && <><div className="d-flex justify-content-between">
              <p>
                Discount
              </p>
              <p>{NumberWithCommas(discount, 2)}</p>
            </div>
              <div className="d-flex justify-content-between">
                <p className="fw-bold"> Total Amount </p>
                <p className="fw-bold"> {NumberWithCommas(total?.discounttotals, 2)}</p>
              </div></>
            }


            {taxes?.map((e, i) => {
              return (
                <div className="d-flex justify-content-between" key={i}>
                  <p>
                    {e?.name} @ {e?.per}
                  </p>
                  <p>{e?.amount}</p>
                </div>
              );
            })}
            {headerData?.AddLess !== 0 && (
              <div className="d-flex justify-content-between">
                <p>{headerData?.AddLess > 0 ? "Add" : "Less"}</p>
                <p>{headerData?.AddLess}</p>
              </div>
            )}
          </div>
        </div>
        <div className="d-flex border-start border-end border-bottom no_break">
          <div className="col-8 border-end px-1">
            <p className="fw-bold"> IN Words Indian Rupees</p>
            <p className="fw-bold">
              {toWords.convert(+fixedValues(total?.grandtotal, 2))} Only.
            </p>
          </div>
          <div className="col-4 px-1 d-flex justify-content-between align-items-center">
            <p className="text-end fw-bold">Grand Total </p>
            <p className="text-end fw-bold">
              {NumberWithCommas(total?.grandtotal, 2)}
            </p>
          </div>
        </div>
        <div
          className=" border-start border-end border-bottom p-1 no_break"
          dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}
        ></div>
        <p className="p-1 no_break">
          <span className="fw-bold"> REMARKS :</span> {headerData?.PrintRemark}
        </p>
        {/* {footer} */}
        <div className={`${footerStyle.container} no_break`}>
          <div
            className={footerStyle.block1f3}
            style={{ width: "33.33%", borderRight: "1px solid #e8e8e8" }}
          >
            <div className={footerStyle.linesf3} style={{ fontWeight: "bold" }}>Bank Detail</div>
            <div className={footerStyle.linesf3}>Bank Name: {headerData?.bankname}</div>
            <div className={footerStyle.linesf3}>Branch: {headerData?.bankaddress}</div>
            <div className={footerStyle.linesf3}>Account Name: {headerData?.accountname}</div>
            <div className={footerStyle.linesf3}>Account No. : {headerData?.accountnumber}</div>
            <div className={footerStyle.linesf3}>RTGS/NEFT IFSC: {headerData?.rtgs_neft_ifsc}</div>
            <div className={footerStyle.linesf3}>Enquiry No. </div>
            <div className={footerStyle.linesf3}> (E & OE)</div>
          </div>
          <div
            className={footerStyle.block2f3}
            style={{ width: "33.33%", borderRight: "1px solid #e8e8e8" }}
          >
            <div className={`${footerStyle.linesf3} fw-normal`}>Signature</div>
            <div className={footerStyle.linesf3}>{headerData?.customerfirmname}</div>
          </div>
          <div className={footerStyle.block2f3} style={{ width: "33.33%" }}>
            <div className={`${footerStyle.linesf3} fw-normal`}>Signature</div>
            <div className={footerStyle.linesf3}>{headerData?.CompanyFullName}</div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
      {msg}
    </p>
  );
};

export default InvoicePrint_10_11;
