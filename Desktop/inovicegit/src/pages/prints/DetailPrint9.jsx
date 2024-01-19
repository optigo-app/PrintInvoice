import React, { useEffect, useState } from "react";
import style from "../../assets/css/prints/detailPrint9.module.css";
import {
  FooterComponent,
  HeaderComponent,
  NumberWithCommas,
  apiCall,
  fixedValues,
  handleImageError,
  handlePrint,
  isObjectEmpty,
  otherAmountDetail,
  taxGenrator,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { ToWords } from "to-words";
import style2 from "../../assets/css/headers/header1.module.css";

const DetailPrint9 = ({ token, invoiceNo, printName, urls, evn }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState({});
  const toWords = new ToWords();
  const [headerData, setHeaderData] = useState({});
  const [footer, setFooter] = useState(null);
  const [header, setHeader] = useState(null);
  const [custAddress, setCustAddress] = useState([]);
  const [category, setCategory] = useState([]);

  const loadData = (data) => {
    setHeaderData(data?.BillPrint_Json[0]);
    let footers = FooterComponent("2", data?.BillPrint_Json[0]);
    setFooter(footers);
    let headers = HeaderComponent("1", data?.BillPrint_Json[0]);
    setHeader(headers);
    let address = data?.BillPrint_Json[0]?.Printlable.split("\r\n");
    setCustAddress(address);
    let datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );
    let resultArr = [];
    let categories = [];
    datas?.resultArray.forEach((e, i) => {
      if (e?.GroupJobid === 0) {
        resultArr.push(e);
      } else {
        let findRecord = resultArr.findIndex((ele, ind) => ele?.GroupJob === e?.GroupJob);
        if (findRecord === -1) {
          resultArr.push(e);
        } else {
          if (resultArr[findRecord]?.GroupJob !== resultArr[findRecord]?.SrJobno) {
            resultArr[findRecord].designno = e?.designno;
            resultArr[findRecord].SrJobno = e?.SrJobno;
            resultArr[findRecord].MetalColor = e?.MetalColor;
            resultArr[findRecord].BrandName = e?.BrandName;
            resultArr[findRecord].HUID = e?.HUID;
            resultArr[findRecord].Size = e?.Size;
            // resultArr[findRecord].metal
            let findPrimaryMetal = e?.metal.findIndex((elem, index) => elem?.IsPrimaryMetal === 1);
            if (findPrimaryMetal !== -1) {
              let FindRecMetal = resultArr[findRecord]?.metal.findIndex((elem, index) => elem?.IsPrimaryMetal === 1);
              if (FindRecMetal !== -1) {
                resultArr[findRecord].metal[FindRecMetal].Rate = e?.metal[findPrimaryMetal].Rate;
              }
            }
          }
          resultArr[findRecord].grosswt += e?.grosswt;
          resultArr[findRecord].TotalAmount += e?.TotalAmount;
          resultArr[findRecord].MakingAmount += e?.MakingAmount;
          resultArr[findRecord].MaKingCharge_Unit += e?.MaKingCharge_Unit;
          resultArr[findRecord].NetWt += e?.NetWt;
          resultArr[findRecord].LossWt += e?.LossWt;
          resultArr[findRecord].Tunch += e?.Tunch;
          resultArr[findRecord].OtherCharges += e?.OtherCharges;

          // other amount
          let otherAmts = [];
          let otherAmtsDts = [...resultArr[findRecord]?.other_details, ...e?.other_details].flat();
          otherAmtsDts.forEach((ele, ind) => {
            let findRec = otherAmts.findIndex((elem, index) => elem?.label === ele?.label);
            if (findRec === -1) {
              otherAmts.push(ele);
            } else {
              otherAmts[findRec].value = +otherAmts[findRec].value + +ele?.value;
            }
          });
          resultArr[findRecord].other_details = otherAmts;

          // diamonds
          let diamonds = [];
          let diamondsArr = [...resultArr[findRecord]?.diamonds, ...e?.diamonds].flat();

          diamondsArr.forEach((ele, ind) => {
            let findDiamond = diamonds.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName &&
              elem?.SizeName === ele?.SizeName && elem?.QualityName === ele?.QualityName &&
              elem?.Colorname === ele?.Colorname && elem?.Rate === ele?.Rate);
            if (findDiamond === -1) {
              diamonds.push(ele);
            } else {
              diamonds[findDiamond].Amount += ele?.Amount;
            }
          });

          resultArr[findRecord].diamonds = diamonds;
          resultArr[findRecord].totals.diamonds.Wt += e?.totals.diamonds.Wt;
          resultArr[findRecord].totals.diamonds.Amount += e?.totals.diamonds.Amount;
          resultArr[findRecord].totals.diamonds.Pcs += e?.totals.diamonds.Pcs;
          resultArr[findRecord].totals.diamonds.FineWt += e?.totals.diamonds.FineWt;

          // color stones
          let colorstone = [];
          let colorstoneArr = [...resultArr[findRecord]?.colorstone, ...e?.colorstone].flat();

          colorstoneArr.forEach((ele, ind) => {
            let findDiamond = colorstone.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName &&
              elem?.SizeName === ele?.SizeName && elem?.QualityName === ele?.QualityName &&
              elem?.Colorname === ele?.Colorname && elem?.Rate === ele?.Rate);
            if (findDiamond === -1) {
              colorstone.push(ele);
            } else {
              colorstone[findDiamond].Amount += ele?.Amount;
            }
          });

          resultArr[findRecord].colorstone = colorstone;
          resultArr[findRecord].totals.colorstone.Wt += e?.totals.colorstone.Wt;
          resultArr[findRecord].totals.colorstone.Amount += e?.totals.colorstone.Amount;
          resultArr[findRecord].totals.colorstone.Pcs += e?.totals.colorstone.Pcs;
          resultArr[findRecord].totals.colorstone.FineWt += e?.totals.colorstone.FineWt;

          // metals
          resultArr[findRecord].totals.metal.Wt += e?.totals.metal.Wt;
          resultArr[findRecord].totals.metal.Amount += e?.totals.metal.Amount;
          resultArr[findRecord].totals.metal.Pcs += e?.totals.metal.Pcs;
          resultArr[findRecord].totals.metal.FineWt += e?.totals.metal.FineWt;
        }
      }
      let findCategory = categories.findIndex((ele, ind) => ele?.label === e?.Categoryname);
      if (findCategory === -1) {
        categories.push({ label: e?.Categoryname, value: e?.Quantity })
      } else {
        categories[findCategory].value += e?.Quantity
      }
    })
    datas.resultArray = resultArr;
    datas.afterReceive = datas?.finalAmount - data?.BillPrint_Json[0]?.BankReceived - data?.BillPrint_Json[0]?.CashReceived;

    setCategory(categories);
    setData(datas);
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
  }, []);

  return loader ? (
    <Loader />
  ) : msg === "" ? (
    <div
      className={`container container-fluid max_width_container mt-1 ${style?.detailprint9} pad_60_allPrint`}
    >
      {/* buttons */}
      <div
        className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}
      >
        <div className="form-check ps-3">
          <input
            type="button"
            className="btn_white blue mt-2"
            value="Print"
            onClick={(e) => handlePrint(e)}
          />
        </div>
      </div>
      {/* Title */}
      <div className="bgGrey text-white py-1 px-2 d-flex justify-content-between">
        <h4 className="fw-bold min_height_title_20 d-flex align-items-center">
          {headerData?.PrintHeadLabel}
        </h4>
        <h4 className="fw-bold min_height_title_20 d-flex align-items-center">
          {headerData?.EntryDate}
        </h4>
      </div>
      {/* header */}
      <div className={style2?.companyDetails}>
        <div className={`${style2?.companyhead} p-2`}>
          <div className={`${style2?.lines}`} style={{ fontWeight: "bold" }}>
            <p>{headerData?.CompanyFullName}</p>
          </div>
          <div className={style2?.lines}>{headerData?.CompanyAddress}</div>
          <div className={style2?.lines}>{headerData?.CompanyAddress2}</div>
          <div className={style2?.lines}>
            {headerData?.CompanyCity}-{headerData?.CompanyPinCode},
            {headerData?.CompanyState}({headerData?.CompanyCountry})
          </div>
          {/* <div className={style2?.lines}>Tell No: {headerData?.CompanyTellNo}</div> */}
          <div className={style2?.lines}>
            Tell No: {headerData?.CompanyTellNo} | TOLL FREE{" "}
            {headerData?.CompanyTollFreeNo}
          </div>
          <div className={style2?.lines}>
            {headerData?.CompanyEmail} | {headerData?.CompanyWebsite}
          </div>
          <div className={style2?.lines}>
            {/* {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber} */}
            {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-
            {headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber}
          </div>
        </div>
        <div
          style={{ width: "30%" }}
          className="d-flex justify-content-end align-item-center h-100"
        >
          <img
            src={headerData?.PrintLogo}
            alt=""
            className={style2?.headerImg}
          />
        </div>
      </div>

      {/* sub header */}
      <div className="d-flex border">
        <div className="col-3 border-end p-2">
          <p>{headerData?.lblBillTo}</p>
          <p className="fw-bold">{headerData?.customerfirmname}</p>
          <p>{headerData?.customerAddress2}</p>
          <p>{headerData?.customerAddress3}</p>
          <p>{headerData?.customerAddress1}</p>
          <p>
            {headerData?.customercity1}
            {headerData?.customerpincode}
          </p>
          <p>{headerData?.customeremail1}</p>
          <p>{headerData?.vat_cst_pan}</p>
          <p>
            {headerData?.Cust_CST_STATE}-{headerData?.Cust_CST_STATE_No}
          </p>
        </div>
        <div className="col-6 border-end p-2 d-flex">
          <div className="col-6">
            <p> Ship To,</p>
            <p className="fw-bold">{headerData?.customerfirmname}</p>
            {custAddress.map((e, i) => {
              return <p key={i}>{e}</p>;
            })}
          </div>
          <div className="col-6 d-flex justify-content-end align-items-end pb-5">
            <p className="fw-bold">
              <span className="pe-2">Bill No</span>
              {headerData?.InvoiceNo}
            </p>
          </div>
        </div>
        <div className="col-3 p-2 text-end">
          <p>
            <span className="fw-bold pe-4">Gold Rate</span>{" "}
            {NumberWithCommas(headerData?.MetalRate24K, 2)}{" "}
          </p>
        </div>
      </div>

      {/* table header */}
      <div className="pt-1">
        <div className="d-flex border lightGrey">
          <div
            className={`${style?.sr} pad_1 border-end d-flex align-items-center justify-content-center`}
          >
            <p className="fw-bold">Sr</p>
          </div>
          <div
            className={`${style?.design} pad_1 border-end d-flex align-items-center justify-content-center`}
          >
            <p className="fw-bold">Design</p>
          </div>
          <div className={`${style?.diamond} border-end`}>
            <div className="d-grid h-100">
              <div className="d-flex justify-content-center">
                <p className="fw-bold border-bottom w-100 text-center pad_1">
                  Diamond
                </p>
              </div>
              <div className="d-flex">
                <div className="w_20 border-end">
                  <p className="fw-bold text-center pad_1">Code</p>
                </div>
                <div className="w_20 border-end">
                  <p className="fw-bold text-center pad_1">Size</p>
                </div>
                <div className="w_20 border-end">
                  <p className="fw-bold text-center pad_1">Wt</p>
                </div>
                <div className="w_20 border-end">
                  <p className="fw-bold text-center pad_1">Rate</p>
                </div>
                <div className="w_20">
                  <p className="fw-bold text-center pad_1">Amount</p>
                </div>
              </div>
            </div>
          </div>
          <div className={`${style?.stone} border-end`}>
            <div className="d-grid h-100">
              <div className="d-flex justify-content-center">
                <p className="fw-bold border-bottom w-100 text-center pad_1">
                  Stone
                </p>
              </div>
              <div className="d-flex">
                <div className="col-3 border-end">
                  <p className="fw-bold text-center pad_1">Code</p>
                </div>
                <div className="col-3 border-end">
                  <p className="fw-bold text-center pad_1">Wt</p>
                </div>
                <div className="col-3 border-end">
                  <p className="fw-bold text-center pad_1">Rate</p>
                </div>
                <div className="col-3">
                  <p className="fw-bold text-center pad_1">Amount</p>
                </div>
              </div>
            </div>
          </div>
          <div className={`${style?.labour} border-end`}>
            <div className="d-grid h-100">
              <div className="d-flex justify-content-center">
                <p className="fw-bold border-bottom w-100 text-center pad_1">
                  Labour
                </p>
              </div>
              <div className="d-flex">
                <div className="col-6 border-end">
                  <p className="fw-bold text-center">Rate</p>
                </div>
                <div className="col-6">
                  <p className="fw-bold text-center">Amount</p>
                </div>
              </div>
            </div>
            <p className="fw-bold"></p>
          </div>
          <div className={`${style?.other} border-end`}>
            <div className="d-grid h-100">
              <div className="d-flex justify-content-center">
                <p className="fw-bold border-bottom w-100 text-center pad_1">
                  Other
                </p>
              </div>
              <div className="d-flex justify-content-center">
                <p className="fw-bold w-100 text-center pad_1">Amount</p>
              </div>
            </div>
          </div>
          <div className={`${style?.metal} border-end`}>
            <div className="d-grid h-100">
              <div className="d-flex justify-content-center">
                <p className="fw-bold border-bottom w-100 text-center pad_1">
                  Metal
                </p>
              </div>
              <div className="d-flex">
                <div className="col-2 border-end">
                  <p className="fw-bold text-center pad_1">Quality</p>
                </div>
                <div className="col-2 border-end">
                  <p className="fw-bold text-center pad_1">GWt</p>
                </div>
                <div className="col-2 border-end">
                  <p className="fw-bold text-center pad_1">NWt</p>
                </div>
                <div className="col-2 border-end">
                  <p className="fw-bold text-center pad_1">Tunch</p>
                </div>
                <div className="col-2 border-end">
                  <p className="fw-bold text-center pad_1">Rate</p>
                </div>
                <div className="col-2">
                  <p className="fw-bold text-center pad_1">Amount</p>
                </div>
              </div>
            </div>
          </div>
          <div className={`${style?.totalAmount}`}>
            <div className="d-grid h-100">
              <div className="d-flex justify-content-center">
                <p className="fw-bold border-bottom w-100 text-center pad_1">
                  Total Amount
                </p>
              </div>
              <div className="d-flex">
                <div className="col-6 border-end">
                  <p className="fw-bold text-center pad_1">Fine</p>
                </div>
                <div className="col-6">
                  <p className="fw-bold text-center pad_1">Amount</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* table data */}
      {data?.resultArray.map((e, i) => {
        return <div key={i}>
          <div className="d-flex border-start border-end border-bottom">
            <div  
              className={`${style?.sr} pad_1 border-end d-flex align-items-center justify-content-center`}
            >
              <p className="fw-bold">{i + 1}</p>
            </div>
            <div className={`${style?.design} pad_1 border-end`}>
              <div className="d-flex justify-content-between">
                <p>{e?.designno}</p>
                <div>
                  <p>{e?.SrJobno}</p>
                  <p>{e?.MetalColor} </p>
                </div>
              </div>
              <img src={e?.DesignImage} alt="" onError={handleImageError} className="imgWidth" />
              {e?.BrandName !== "" && <p className="text-center">{e?.BrandName}</p>}
              {e?.HUID !== "" && <p className="text-center">HUID-{e?.HUID}</p>}
              <p className="text-center">
                <span className="fw-bold">{NumberWithCommas(e?.grosswt, 3)} gm </span>Gross
              </p>
              {e?.Size !== "" && <p className="text-center">Size:{e?.Size}</p>}
            </div>
            <div className={`${style?.diamond} border-end position-relative ${style?.pad_bot_15}`} >
              {e?.diamonds.map((ele, ind) => {
                return <div className="d-flex" key={ind}>
                  <div className="w_20">
                    <p className="pad_1">{ele?.ShapeName} {ele?.Colorname} {ele?.QualityName}</p>
                  </div>
                  <div className="w_20">
                    <p className="pad_1">{ele?.SizeName}</p>
                  </div>
                  <div className="w_20">
                    <p className="text-end pad_1">{NumberWithCommas(ele?.Wt, 3)}</p>
                  </div>
                  <div className="w_20">
                    <p className="text-end pad_1">{NumberWithCommas(ele?.Rate, 2)}</p>
                  </div>
                  <div className="w_20">
                    <p className="text-end pad_1">{NumberWithCommas(ele?.Amount, 2)}</p>
                  </div>
                </div>
              })}
              <div className="d-flex position-absolute bottom-0 left-0 w-100 border-top lightGrey">
                <div className="w_20">
                  <p className="text-center pad_1"></p>
                </div>
                <div className="w_20">
                  <p className="text-center pad_1"></p>
                </div>
                <div className="w_20">
                  <p className="text-end pad_1">{NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}</p>
                </div>
                <div className="w_20">
                  <p className="text-end pad_1"></p>
                </div>
                <div className="w_20">
                  <p className="text-end pad_1">{NumberWithCommas(e?.totals?.diamonds?.Amount, 2)}</p>
                </div>
              </div>
            </div>
            <div className={`${style?.stone} border-end position-relative ${style?.pad_bot_15}`} >
              {e?.colorstone.map((ele, ind) => {
                return <div className="d-flex" key={ind}>
                  <div className="col-3">
                    <p className="pad_1">{ele?.ShapeName} {ele?.Colorname} {ele?.QualityName}</p>
                  </div>
                  <div className="col-3">
                    <p className="pad_1">{ele?.SizeName}</p>
                  </div>
                  <div className="col-3">
                    <p className="text-end pad_1">{NumberWithCommas(ele?.Rate, 2)}</p>
                  </div>
                  <div className="col-3">
                    <p className="text-end pad_1">{NumberWithCommas(ele?.Amount, 2)}</p>
                  </div>
                </div>
              })}
              <div className="d-flex position-absolute bottom-0 left-0 w-100 border-top lightGrey">
                <div className="col-3">
                  <p className="text-center pad_1"></p>
                </div>
                <div className="col-3">
                  <p className="text-end pad_1">{NumberWithCommas(e?.totals?.colorstone?.Wt, 3)}</p>
                </div>
                <div className="col-3">
                  <p className="text-end pad_1"></p>
                </div>
                <div className="col-3">
                  <p className="text-end pad_1">{NumberWithCommas(e?.totals?.colorstone?.Amount, 2)}</p>
                </div>
              </div>
            </div>
            <div
              className={`${style?.labour} border-end position-relative ${style?.pad_bot_15}`}
            >
              <div className="d-flex">
                <div className="col-6">
                  <p className="text-end ">{NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p>
                </div>
                <div className="col-6">
                  <p className="text-end">{NumberWithCommas(e?.MakingAmount, 2)} </p>
                </div>
              </div>
              <div className="border-top position-absolute left-0 bottom-0 w-100 lightGrey">
                <p className="text-end pad_1">{NumberWithCommas(e?.MakingAmount, 2)} </p>
              </div>
            </div>
            <div
              className={`${style?.other} border-end position-relative ${style?.pad_bot_15}`}
            >
              {e?.other_details.map((ele, ind) => {
                return <div className="d-flex justify-content-center" key={ind}>
                  <p className="w-100 text-end pad_1">{NumberWithCommas(+ele?.value, 2)}</p>
                </div>
              })}
              <div className="border-top position-absolute left-0 bottom-0 w-100 lightGrey">
                <p className="text-end pad_1">{NumberWithCommas(e?.OtherCharges, 2)} </p>
              </div>
            </div>
            <div
              className={`${style?.metal} border-end position-relative ${style?.pad_bot_15}`}
            >
              <div className="d-flex">
                <div className="col-2">
                  <p className="pad_1">{e?.MetalTypePurity}</p>
                </div>
                <div className="col-2">
                  <p className="text-end pad_1">{NumberWithCommas(e?.grosswt, 3)}</p>
                </div>
                <div className="col-2">
                  <p className="text-end pad_1">{NumberWithCommas(e?.NetWt + e?.LossWt, 3)}</p>
                </div>
                <div className="col-2">
                  <p className="text-end pad_1">
                    {NumberWithCommas(e?.Tunch, 3)}
                  </p>
                </div>
                <div className="col-2">
                  {e?.metal.map((ele, ind) => {
                    return ele?.IsPrimaryMetal === 1 && <p key={ind} className="text-end pad_1">{NumberWithCommas(ele?.Rate, 2)}</p>
                  })}
                </div>
                <div className="col-2">
                  {e?.metal.map((ele, ind) => {
                    return ele?.IsPrimaryMetal === 1 && <p className="text-end pad_1" key={ind}>{NumberWithCommas(e?.totals?.metal?.Amount, 2)}</p>
                  })}
                </div>
              </div>
              <div className="d-flex position-absolute bottom-0 left-0 w-100 border-top lightGrey">
                <div className="col-2">
                  <p className="text-center pad_1"></p>
                </div>
                <div className="col-2">
                  <p className="text-center pad_1"></p>
                </div>
                <div className="col-2">
                  <p className="text-end pad_1">{NumberWithCommas(e?.NetWt + e?.LossWt, 3)}</p>
                </div>
                <div className="col-2">
                  <p className="text-end pad_1"></p>
                </div>
                <div className="col-2">
                  <p className="text-end pad_1"></p>
                </div>
                <div className="col-2">
                  <p className="text-end pad_1">{NumberWithCommas(e?.totals?.metal?.Amount, 2)}</p>
                </div>
              </div>
            </div>
            <div
              className={`${style?.totalAmount} position-relative ${style?.pad_bot_15}`}
            >
              <div className="d-flex h-100">
                <div className="col-6 border-end">
                  <p className="text-end pad_1"></p>
                </div>
                <div className="col-6">
                  <p className="text-end pad_1">{NumberWithCommas(e?.TotalAmount, 2)}</p>
                </div>
              </div>
              <div className="d-flex position-absolute bottom-0 left-0 w-100 border-top lightGrey">
                <div className="col-6 border-end">
                  <p className="text-end pad_1">0.00</p>
                </div>
                <div className="col-6">
                  <p className="text-end pad_1">{NumberWithCommas(e?.UnitCost, 2)}</p>
                </div>
              </div>
            </div>
          </div>
          {e?.DiscountAmt !== 0 && <div className="d-flex border-start border-end border-bottom">
            <div
              className={`${style?.sr} pad_1 border-end d-flex align-items-center justify-content-center`}
            >
              <p className="fw-bold"></p>
            </div>
            <div className={`${style?.design} pad_1 border-end`}>
              <div className="d-flex justify-content-between">
                <p></p>
              </div>
            </div>
            <div className={`${style?.diamond} lightGrey`} >
              <div className="d-flex">
                <div className="w_20">
                  <p className="pad_1"></p>
                </div>
                <div className="w_20">
                  <p className="pad_1"></p>
                </div>
                <div className="w_20">
                  <p className="text-end pad_1"></p>
                </div>
                <div className="w_20">
                  <p className="text-end pad_1"></p>
                </div>
                <div className="w_20">
                  <p className="text-end pad_1"></p>
                </div>
              </div>
            </div>
            <div className={`${style?.stone} lightGrey`} >
              <div className="d-flex" >
                <div className="col-3">
                  <p className="pad_1"></p>
                </div>
                <div className="col-3">
                  <p className="pad_1"></p>
                </div>
                <div className="col-3">
                  <p className="text-end pad_1"></p>
                </div>
                <div className="col-3">
                  <p className="text-end pad_1"></p>
                </div>
              </div>
            </div>
            <div className={`${style?.labour} lightGrey`} >
              <div className="d-flex">
                <div className="col-6">
                  <p className="text-end "></p>
                </div>
                <div className="col-6">
                  <p className="text-end"> </p>
                </div>
              </div>
            </div>
            <div className={`${style?.other} lightGrey`} >
              <div className="d-flex justify-content-center">
                <p className="w-100 text-end pad_1"></p>
              </div>
            </div>
            <div className={`${style?.metal} lightGrey`} >
           <p className="text-end fw-bold p-1">Discount {NumberWithCommas(e?.Discount, 2)}{e?.isdiscountinamount === 0  && "%"} @Total Amount	</p>
            </div>
            <div className={`${style?.totalAmount} lightGrey`} >
              <div className="d-flex h-100">
                <div className="col-6 border-end">
                  <p className="text-end py-1 pad_1 fw-bold">{NumberWithCommas(e?.DiscountAmt, 2)}</p>
                </div>
                <div className="col-6">
                  <p className="text-end py-1 pad_1 fw-bold">{NumberWithCommas(e?.TotalAmount, 2)}</p>
                </div>
              </div>
            </div>
          </div>}
        </div>
      })}

      {/* table total */}
      <div className="d-flex border-start border-end border-bottom no_break">
        <div className={`${style?.sr} pad_1 lightGrey`}>
          <p className="fw-bold"></p>
        </div>
        <div className={`${style?.design} pad_1 border-end lightGrey`}>
          <p className="fw-bold text-center">TOTAL</p>
        </div>
        <div className={`${style?.diamond} border-end`}>
          <div className="d-flex lightGrey">
            <div className="w_20">
              <p className="pad_1 fw-bold"></p>
            </div>
            <div className="w_20">
              <p className="pad_1 fw-bold"></p>
            </div>
            <div className="w_20">
              <p className="text-end pad_1 fw-bold">{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)}</p>
            </div>
            <div className="w_20">
              <p className="text-end pad_1 fw-bold"></p>
            </div>
            <div className="w_20">
              <p className="text-end pad_1 fw-bold">{NumberWithCommas(data?.mainTotal?.diamonds?.Amount, 2)}</p>
            </div>
          </div>
        </div>
        <div className={`${style?.stone} border-end`}>
          <div className="d-flex lightGrey">
            <div className="col-3">
              <p className="pad_1 fw-bold"></p>
            </div>
            <div className="col-3">
              <p className="pad_1 fw-bold">{NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)}</p>
            </div>
            <div className="col-3">
              <p className="text-end pad_1 fw-bold"></p>
            </div>
            <div className="col-3">
              <p className="text-end pad_1 fw-bold">{NumberWithCommas(data?.mainTotal?.colorstone?.Amount, 2)}</p>
            </div>
          </div>
        </div>

        <div className={`${style?.labour} border-end`}>
          <div className="d-flex lightGrey">
            <div className="col-6">
              {/* <p className="text-end fw-bold">{NumberWithCommas(data?.mainTotal?.total_labour?.labour_rate, 2)}</p> */}
              <p className="text-end fw-bold"></p>
            </div>
            <div className="col-6">
              <p className="text-end fw-bold">{NumberWithCommas(data?.mainTotal?.total_labour?.labour_amount, 2)} </p>
            </div>
          </div>
        </div>
        <div className={`${style?.other} border-end`}>
          <div className="d-flex justify-content-center lightGrey">
            <p className="w-100 text-end pad_1 fw-bold">{NumberWithCommas(data?.mainTotal?.total_other, 2)}</p>
          </div>
        </div>
        <div className={`${style?.metal} border-end`}>
          <div className="d-flex lightGrey">
            <div className="col-2">
              <p className="pad_1 fw-bold"></p>
            </div>
            <div className="col-2">
              <p className="text-end pad_1 fw-bold">{NumberWithCommas(data?.mainTotal?.grosswt, 3)}</p>
            </div>
            <div className="col-2">
              <p className="text-end pad_1 fw-bold">{NumberWithCommas(data?.mainTotal?.netwt + data?.mainTotal?.lossWt, 3)}</p>
            </div>
            <div className="col-2">
              <p className="text-end pad_1 fw-bold"></p>
            </div>
            <div className="col-2">
              <p className="text-end pad_1 fw-bold"></p>
            </div>
            <div className="col-2">
              <p className="text-end pad_1 fw-bold">{NumberWithCommas(data?.mainTotal?.metal?.Amount, 2)}</p>
            </div>
          </div>
        </div>
        <div className={`${style?.totalAmount}`}>
          <div className="d-flex lightGrey">
            <div className="col-6 border-end">
              <p className="text-end border-end pad_1">0.000</p>
            </div>
            <div className="col-6">
              <p className="text-end pad_1 fw-bold">{NumberWithCommas(data?.mainTotal?.total_unitcost, 2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* table taxes */}
      <div className="d-flex border-start border-end border-bottom no_break pt-1">
        <div className={`${style?.taxWords}`}>
          {data?.allTaxes.map((e, i) => {
            return <p className="text-end" key={i}>{e?.name} @ {e?.per}</p>
          })}
          {headerData?.AddLess !== 0 && <p className="text-end">{headerData?.AddLess > 0 ? "Add" : "Less"}</p>}
          <p className="text-end fw-bold">TOTAL</p>
          {headerData?.CashReceived !== 0 && <p className="text-end">Recv. in Cash</p>}
          {headerData?.BankReceived !== 0 && <p className="text-end">Recv. in Bank</p>}
        </div>
        <div className={`${style?.taxAmount}`}>
          {data?.allTaxes.map((e, i) => {
            return <p className="text-end" key={i}>{e?.amount}</p>
          })}
          {headerData?.AddLess !== 0 && <p className="text-end">{headerData?.AddLess}</p>}
          <p className="text-end fw-bold">{NumberWithCommas(data?.finalAmount, 2)}</p>
          {headerData?.CashReceived !== 0 && <p className="text-end">{NumberWithCommas(headerData?.CashReceived, 2)}</p>}
          {headerData?.BankReceived !== 0 && <p className="text-end">{NumberWithCommas(headerData?.BankReceived, 2)}</p>}
        </div>
      </div>

      {/* table summary */}
      <div className="d-flex position-relative">
        <div className="col-4 border-start border-end border-bottom">
          <h4 className="lightGrey fw-bold text-center">SUMMARY</h4>
          <div className="d-flex">
            <div className={`col-6 border-end pad_1 ${style?.pad_bot_12} position-relative`}>
              <div className="d-flex justify-content-between pad_1">
                <p className="fw-bold">GOLD IN 24KT</p>
                <p>{NumberWithCommas(data?.mainTotal?.total_purenetwt, 3)} gm</p>
              </div>
              <div className="d-flex justify-content-between pad_1">
                <p className="fw-bold">GROSS WT </p>
                <p>{NumberWithCommas(data?.mainTotal?.grosswt, 3)} gm</p>
              </div>
              <div className="d-flex justify-content-between pad_1">
                <p className="fw-bold">*(G+D) WT </p>
                <p>52.880 gm</p>
              </div>
              <div className="d-flex justify-content-between pad_1">
                <p className="fw-bold">NET WT </p>
                <p>{NumberWithCommas(data?.mainTotal?.netwt + data?.mainTotal?.lossWt, 3)} gm</p>
              </div>
              <div className="d-flex justify-content-between pad_1">
                <p className="fw-bold">DIAMOND WT </p>
                <p>{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)} cts</p>
              </div>
              <div className="d-flex justify-content-between pad_1">
                <p className="fw-bold">STONE WT </p>
                <p>{NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)} cts</p>
              </div>
              <div className={`d-flex justify-content-between pad_1 position-absolute left-0 bottom-0 w-100 lightGrey ${style?.min_height_12} px-1`}>
                <p className="fw-bold"> </p>
                <p></p>
              </div>
            </div>
            <div className={`col-6 pad_1 ${style?.pad_bot_12} position-relative`}>
              <div className="d-flex justify-content-between pad_1">
                <p className="fw-bold">GOLD</p>
                <p>{NumberWithCommas(data?.mainTotal?.metal?.Amount, 2)}</p>
              </div>
              <div className="d-flex justify-content-between pad_1">
                <p className="fw-bold">DIAMOND</p>
                <p>{NumberWithCommas(data?.mainTotal?.diamonds?.Amount, 2)}</p>
              </div>
              <div className="d-flex justify-content-between pad_1">
                <p className="fw-bold">CST</p>
                <p>{NumberWithCommas(data?.mainTotal?.colorstone?.Amount, 2)}</p>
              </div>
              <div className="d-flex justify-content-between pad_1">
                <p className="fw-bold">MAKING</p>
                <p>{NumberWithCommas(data?.mainTotal?.total_Making_Amount, 2)}</p>
              </div>
              <div className="d-flex justify-content-between pad_1">
                <p className="fw-bold">OTHER</p>
                <p>{NumberWithCommas(data?.mainTotal?.total_other, 2)}</p>
              </div>
              {headerData?.AddLess !== 0 && <div className="d-flex justify-content-between pad_1">
                <p className="fw-bold">{headerData?.AddLess > 0 ? "ADD" : "LESS"}</p>
                <p>{NumberWithCommas(headerData?.AddLess, 2)}</p>
              </div>}
              <div className={`d-flex justify-content-between pad_1 position-absolute left-0 bottom-0 w-100 lightGrey ${style?.min_height_12} px-1`}>
                <p className="fw-bold">TOTAL</p>
                <p>85,725.52</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-4 d-flex">
          <div className="col-6 border-start border-end border-bottom">
            <h4 className="lightGrey fw-bold text-center">Summary Detail</h4>
            {category.map((e, i) => {
              return <div className="d-flex justify-content-between" key={i}>
                <p className="fw-bold">{e?.label}</p>
                <p>{NumberWithCommas(e?.value, 0)}</p>
              </div>
            })}
          </div>
          <div className="col-6 border-start border-end border-bottom d-flex">
            <div
              className={`col-6 border-end pad_1 ${style?.min_height_100} d-flex flex-column justify-content-between`}
            >
              <p>Signature</p>
              <p className="fw-bold">{headerData?.customerfirmname}</p>
            </div>
            <div
              className={`col-6 pad_1 ${style?.min_height_100} d-flex flex-column justify-content-between`}
            >
              <p>Signature</p>
              <p className="fw-bold">{headerData?.CompanyFullName}</p>
            </div>
          </div>
        </div>
        <div className="col-4 ps-1">
          <div className="border-start border-end border-bottom d-flex">
            <div className="col-4 border-end d-flex align-items-center">
              <p className="fw-bold p-1">Grand Total </p>
            </div>
            <div className="col-8">
              <div className="d-flex border-bottom">
                <div
                  className={`col-4 border-end ${style?.min_height_30} d-flex justify-content-center align-items-center fw-bold`}
                >
                  Amount{" "}
                </div>
                <div
                  className={`col-4 border-end ${style?.min_height_30} d-flex justify-content-center align-items-center fw-bold`}
                ></div>
                <div
                  className={`col-4 ${style?.min_height_30} d-flex justify-content-center align-items-center fw-bold`}
                >
                  {NumberWithCommas(data?.afterReceive, 2)}
                </div>
              </div>
              <div className="d-flex">
                <div
                  className={`col-4 border-end ${style?.min_height_30} d-flex justify-content-center align-items-center fw-bold`}
                >
                  Fine{" "}
                </div>
                <div
                  className={`col-4 border-end ${style?.min_height_30} d-flex justify-content-center align-items-center fw-bold`}
                >
                  0.000{" "}
                </div>
                <div
                  className={`col-4 ${style?.min_height_30} d-flex justify-content-center align-items-center fw-bold`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* declaration */}
      <div
        className="my-1 border p-2"
        dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}
      ></div>

      {/* footer */}
      {footer}
    </div>
  ) : (
    <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
      {msg}
    </p>
  );
};

export default DetailPrint9;
