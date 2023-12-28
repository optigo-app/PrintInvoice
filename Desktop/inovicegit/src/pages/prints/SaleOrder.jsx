import React, { useEffect, useState } from "react";
import style from "../../assets/css/prints/saleorder.module.css";
import {
  FooterComponent,
  HeaderComponent,
  NumberWithCommas,
  apiCall,
  handleImageError,
  handlePrint,
  isObjectEmpty,
  taxGenrator,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import style2 from "../../assets/css/headers/header1.module.css";

const SaleOrder = ({ token, invoiceNo, printName, urls, evn }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [header, setHeader] = useState(null);
  const [footer, setFooter] = useState(null);
  const [headerData, setHeaderData] = useState({});
  const [summary, setSummary] = useState([]);
  const [summary2, setSummary2] = useState([]);
  const [total, setTotal] = useState({
    TotalAmount: 0,
    afterTax: 0,
    grandTotal: 0,
    UnitCost: 0,
  });
  const [tax, settax] = useState([]);

  const loadData = (data) => {
    let head = HeaderComponent("1", data?.BillPrint_Json[0]);
    setHeader(head);
    setHeaderData(data?.BillPrint_Json[0]);
    let subhead = FooterComponent("2", data?.BillPrint_Json[0]);
    setFooter(subhead);
    data.BillPrint_Json[0].Printlable = (data?.BillPrint_Json[0]?.Printlable).replaceAll(
      "\r\n",
      "<br />"
    );
    let resultArr = [];
    let summaryArr = [];
    let summary2Arr = [];
    let totals = { ...total };
    data?.BillPrint_Json1.forEach((e, i) => {
      let diamondWt = 0;
      let colorStoneWt = 0;
      let miscWt = 0;

      let findGold24Kt = summaryArr.findIndex(
        (ele) => ele?.label === "GOLD IN 24KT"
      );
      if (findGold24Kt === -1) {
        summaryArr.push({
          label: "GOLD IN 24KT",
          value: e?.convertednetwt,
          id: 4,
          suffix: " gm",
          name: "GOLD IN 24KT",
        });
      } else {
        summaryArr[findGold24Kt].value += e?.convertednetwt;
      }

      let findGross = summaryArr.findIndex(
        (ele, ind) => ele?.label === "Gross Wt"
      );
      if (findGross === -1) {
        summaryArr.push({
          label: "Gross Wt",
          value: e?.grosswt,
          id: 1,
          suffix: " gm",
          name: "Gross Wt",
        });
      } else {
        summaryArr[findGross].value += e?.grosswt;
      }

      let mdWt = summaryArr.findIndex((ele, ind) => ele?.label === "(M+D) WT");
      if (mdWt === -1) {
        summaryArr.push({
          label: "(M+D) WT",
          value: e?.MetalDiaWt,
          id: 1,
          suffix: " gm",
          name: "(M+D) WT",
        });
      } else {
        summaryArr[findGross].value += e?.MetalDiaWt;
      }

      let netWt = summaryArr.findIndex((ele, ind) => ele?.label === "NET WT");
      if (netWt === -1) {
        summaryArr.push({
          label: "NET WT",
          value: e?.NetWt,
          id: 1,
          suffix: " gm",
          name: "NET WT",
        });
      } else {
        summaryArr[findGross].value += e?.MetalDiaWt;
      }

      let findLabour = summaryArr.findIndex(
        (ele, ind) => ele?.label === "Labour"
      );
      if (findLabour === -1) {
        summaryArr.push({
          label: "Labour",
          value: 0,
          id: 7,
          suffix: "",
          name: "Labour",
          amount: e?.MakingAmount,
        });
      } else {
        summaryArr[findLabour].amount += e?.MakingAmount;
      }

      let labourAmount = summary2Arr.findIndex(
        (ele) => ele?.label === "LABOUR"
      );
      if (labourAmount === -1) {
        summary2Arr.push({
          label: "LABOUR",
          value: 0,
          id: 5,
          suffix: "",
          name: "LABOUR",
          amount: e?.MakingAmount,
        });
      } else {
        summary2Arr[labourAmount].amount += e?.MakingAmount;
      }

      let otherAmount = summary2Arr.findIndex((ele) => ele?.label === "OTHER");
      if (otherAmount === -1) {
        summary2Arr.push({
          label: "OTHER",
          value: 0,
          id: 6,
          suffix: "",
          name: "OTHER",
          amount: e?.OtherCharges,
        });
      } else {
        summary2Arr[otherAmount].amount += e?.OtherCharges;
      }

      data?.BillPrint_Json2.forEach((ele, index) => {
        if (ele?.StockBarcode === e?.SrJobno) {
          let findMaterial = summaryArr.findIndex(
            (elem, index) =>
              elem?.label === ele?.MasterManagement_DiamondStoneTypeName &&
              ele?.MasterManagement_DiamondStoneTypeid !== 5
          );
          if (findMaterial !== -1) {
            summaryArr[findMaterial].value += ele?.Wt;
            summaryArr[findMaterial].amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
            diamondWt += ele?.Wt;
            if (findMaterial === -1) {
              summaryArr.push({
                label: "DIAMOND",
                value: ele?.Wt,
                id: 1,
                suffix: " Cts",
                name: "Diamond Wt",
                amount: ele?.Amount,
              });
            }

            let diaAmount = summary2Arr.findIndex(
              (ele) => ele?.label === "DIAMOND"
            );
            if (diaAmount === -1) {
              summary2Arr.push({
                label: "DIAMOND",
                value: 0,
                id: 2,
                suffix: "",
                name: "DIAMOND",
                amount: ele?.Amount,
              });
            } else {
              summary2Arr[diaAmount].amount += ele?.Amount;
            }
          } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
            colorStoneWt += ele?.Wt;
            if (findMaterial === -1) {
              summaryArr.push({
                label: "COLOR STONE",
                value: ele?.Wt,
                id: 2,
                suffix: " Cts",
                name: "Stone Wt",
                amount: ele?.Amount,
              });
            }

            let cstAmount = summary2Arr.findIndex(
              (ele) => ele?.label === "CST"
            );
            if (cstAmount === -1) {
              summary2Arr.push({
                label: "CST",
                value: 0,
                id: 3,
                suffix: "",
                name: "CST",
                amount: ele?.Amount,
              });
            } else {
              summary2Arr[cstAmount].amount += ele?.Amount;
            }
          } else if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
            miscWt += ele?.Wt;
            if (findMaterial === -1) {
              summaryArr.push({
                label: "MISC",
                value: ele?.Wt,
                id: 3,
                suffix: " gms",
                name: "Misc Wt",
                amount: ele?.Amount,
              });
            }

            let miscAmount = summary2Arr.findIndex(
              (ele) => ele?.label === "MISC"
            );
            if (miscAmount === -1) {
              summary2Arr.push({
                label: "MISC",
                value: 0,
                id: 4,
                suffix: "",
                name: "MISC",
                amount: ele?.Amount,
              });
            } else {
              summary2Arr[miscAmount].amount += ele?.Amount;
            }
          } else if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            let goldAmount = summary2Arr.findIndex(
              (ele) => ele?.label === "GOLD"
            );
            if (goldAmount === -1) {
              summary2Arr.push({
                label: "GOLD",
                value: 0,
                id: 1,
                suffix: "",
                name: "GOLD",
                amount: ele?.Amount,
              });
            } else {
              summary2Arr[goldAmount].amount += ele?.Amount;
            }

            // let findMetal = summaryArr.findIndex((elem, ind) =>
            //   elem?.label.includes(ele?.QualityName)
            // );
            // if (findMetal === -1) {
            // summaryArr.push({
            //   label: ele?.ShapeName + " " + ele?.QualityName,
            //   value: e?.NetWt,
            //   id: 4,
            //   suffix: " gms",
            //   name: ele?.ShapeName + " " + ele?.QualityName,
            //   amount: ele?.Amount,
            // });

            // }else{
            //   summaryArr[findMetal].value += e?.NetWt;
            //   summaryArr[findMetal].amount += ele?.Amount;
            // }
          }
        }
      });
      let obj = { ...e };
      obj.TotalAmount =
        e?.TotalAmount / data?.BillPrint_Json[0]?.CurrencyExchRate;
      obj.UnitCost = e?.UnitCost / data?.BillPrint_Json[0]?.CurrencyExchRate;
      totals.TotalAmount += obj?.TotalAmount;
      totals.UnitCost += obj?.UnitCost;
      obj.diamondWt = diamondWt;
      obj.colorStoneWt = colorStoneWt;
      obj.miscWt = miscWt;
      resultArr.push(obj);
    });

    summary2Arr.push({
      label: data?.BillPrint_Json[0]?.AddLess > 0 ? "Add" : "Less",
      value: data?.BillPrint_Json[0]?.AddLess,
      id: 7,
      suffix: "",
      name: data?.BillPrint_Json[0]?.AddLess > 0 ? "Add" : "Less",
      amount: data?.BillPrint_Json[0]?.AddLess,
    });

    let taxValue = taxGenrator(data?.BillPrint_Json[0], totals?.TotalAmount);
    settax(taxValue);
    totals.afterTax =
      taxValue.reduce((acc, cobj) => {
        return acc + +cobj?.amount;
      }, 0) + totals?.TotalAmount;
    totals.grandTotal = totals.afterTax + data?.BillPrint_Json[0]?.AddLess;

    setTotal(totals);
    setData(resultArr);

    summary2Arr.sort((a, b) => {
      return a.id - b.id;
    });

    setSummary2(summary2Arr);
    setSummary(summaryArr);
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
      className={`container max_width_container pad_60_allPrint ${style?.containerJewellery} jewelleryinvoiceContain mt-1`}
    >
      {/* print button */}
      <div
        className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}
      >
        <div className="form-check ps-3">
          <input
            type="button"
            className="btn_white blue py-1"
            value="Print"
            onClick={(e) => handlePrint(e)}
          />
        </div>
      </div>
      {/* header  */}
      <div className={`${style2.headline} headerTitle`}>
        {headerData?.PrintHeadLabel}
      </div>
      <div className={style2.companyDetails}>
        <div className={`${style2.companyhead} p-2`}>
          <span className={style2.lines} style2={{ fontWeight: "bold" }}>
            {headerData?.CompanyFullName}
          </span>
          <span className={style2.lines}>{headerData?.CompanyAddress}</span>
          <span className={style2.lines}>{headerData?.CompanyAddress2}</span>
          <span className={style2.lines}>
            {headerData?.CompanyCity}-{headerData?.CompanyPinCode},
            {headerData?.CompanyState}({headerData?.CompanyCountry})
          </span>
          <span className={style2.lines}>
            Tell No: {headerData?.CompanyTellNo}
          </span>
          <span className={style2.lines}>
            {headerData?.CompanyEmail} | {headerData?.CompanyWebsite}
          </span>
          <span className={style2.lines}>
            {/* {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber} */}
            {/* {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber} */}
          </span>
        </div>
        <div
          style={{ width: "30%" }}
          className="d-flex justify-content-end align-item-center h-100"
        >
          <img
            src={headerData?.PrintLogo}
            alt=""
            className={style2.headerImg}
          />
        </div>
      </div>
      {/* customer details */}
      <div className="border d-flex">
        <div className="col-4 p-2 border-end">
          <p> To,</p>
          <p className="fw-bold">{headerData?.customerfirmname}</p>
          <p>{headerData?.customerstreet}</p>
          <p>{headerData?.customerregion}</p>
          <p>{headerData?.customercity}</p>
          <p>
            {headerData?.customerstate} , {headerData?.customercountry}{" "}
            {headerData?.customerpincode}
          </p>
          <p>Tel : {headerData?.customermobileno}</p>
          <p>{headerData?.customeremail1}</p>
        </div>
        <div className="col-4 p-2">
          <p>Ship To,</p>
          <p className="fw-bold">{headerData?.customerfirmname}</p>
          <div
            dangerouslySetInnerHTML={{ __html: headerData?.Printlable }}
          ></div>
        </div>
        <div className="col-4 d-flex justify-content-end p-2">
          <div className="col-9 d-flex flex-column justify-content-center">
            <p>
              DATE:{" "}
              <span className="ps-1 fw-bold">{headerData?.EntryDate}</span>
            </p>
            <p>
              ORDER#:{" "}
              <span className="ps-1 fw-bold">{headerData?.InvoiceNo}</span>{" "}
            </p>
            {data[0]?.PO !== "" && (
              <p>
                PO#: <span className="ps-1 fw-bold">{data[0]?.PO}</span>{" "}
              </p>
            )}
            {headerData?.DueDate !== "" && (
              <p>
                PROMISE DATE#:{" "}
                <span className="ps-1 fw-bold">{headerData?.DueDate}</span>
              </p>
            )}
            {/* <p>
              GSTIN <span className="fw-bold">{headerData?.CustGstNo}</span> |{" "}
              {headerData?.Cust_CST_STATE}{" "}
              <span className="fw-bold">{headerData?.Cust_CST_STATE_No}</span>
            </p> */}
          </div>
        </div>
      </div>
      {/* table header */}
      <div className="border-start border-end border-bottom d-flex lightGrey no_break">
        <div className={`${style?.srNo} p-1 text-center fw-bold border-end`}>
          <p>SR NO</p>
        </div>
        <div className={`${style?.image} p-1 text-center fw-bold border-end`}>
          <p>IMAGE</p>
        </div>
        <div
          className={`${style?.itemCode} p-1 text-center fw-bold border-end`}
        >
          <p> ITEM CODE</p>
        </div>
        <div
          className={`${style?.description} p-1 text-center fw-bold border-end`}
        >
          <p>DESCRIPTION</p>
        </div>
        <div
          className={`${style?.quantity} p-1 text-center fw-bold border-end`}
        >
          <p>QTY</p>
        </div>
        <div
          className={`${style?.unitPrice} p-1 text-center fw-bold border-end`}
        >
          <p> UNIT PRICE</p>
        </div>
        <div className={`${style?.amount} p-1 text-center fw-bold`}>
          <p> AMOUNT (INR)</p>
        </div>
      </div>
      {/* table data */}
      {data.map((e, i) => {
        return (
          <div
            className="border-start border-end border-bottom d-flex no_break"
            key={i}
          >
            <div className={`${style?.srNo} p-1 border-end`}>
              <p className=" text-center">{i + 1}</p>
            </div>
            <div className={`${style?.image} p-1  border-end`}>
              <img
                src={e?.DesignImage}
                alt=""
                onError={handleImageError}
                className={`w-100 imgWidth`}
              />
            </div>
            <div className={`${style?.itemCode} p-1  border-end`}>
              <p>
                {" "}
                DESIGN: <span className="fw-bold">{e?.designno}</span>
              </p>
            </div>
            <div className={`${style?.description} p-1 border-end `}>
              <p>
                {e?.MetalTypePurity} {e?.MetalColor}{" "}
              </p>{" "}
              <p>
                {e?.NetWt !== 0 &&
                  `NET WT: ${NumberWithCommas(e?.NetWt, 3)} gms NW`}{" "}
              </p>
              <p>
                {e?.diamondWt !== 0 &&
                  `DIA WT: ${NumberWithCommas(e?.diamondWt, 3)} Cts  `}{" "}
              </p>
              <p>
                {e?.colorStoneWt !== 0 &&
                  `CS: ${NumberWithCommas(e?.colorStoneWt, 3)} Cts `}
              </p>
              <p>
                {e?.miscWt !== 0 &&
                  ` MISC: ${NumberWithCommas(e?.miscWt, 3)} gms `}
              </p>
              <p>
                {e?.grosswt !== 0 &&
                  `GROSS WT: ${NumberWithCommas(e?.grosswt, 3)} gms GW`}{" "}
              </p>
              {e?.Size !== "" && <p className="pt-1">SIZE: {e?.Size}</p>}
              {(e?.Collectionname !== "" ||
                e?.Categoryname !== "" ||
                e?.SubCategoryname !== "") && (
                <p className="pt-2">
                  PRODUCT: {e?.Collectionname}, {e?.Categoryname},{" "}
                  {e?.SubCategoryname}
                </p>
              )}
              <p className="pt-1">
                {" "}
                <span className="fw-bold">REMARKS:</span> {e?.JobRemark}{" "}
              </p>
            </div>
            <div className={`${style?.quantity} p-1 border-end `}>
              <p className="text-end"> {e?.Quantity}</p>
            </div>
            <div className={`${style?.unitPrice} p-1 border-end text-end`}>
              <p>
                <span
                  dangerouslySetInnerHTML={{
                    __html: headerData?.Currencysymbol,
                  }}
                ></span>{" "}
                {NumberWithCommas(e?.UnitCost / e?.Quantity, 2)}{" "}
              </p>
            </div>
            <div className={`${style?.amount} p-1  text-end`}>
              <p>
                <span
                  dangerouslySetInnerHTML={{
                    __html: headerData?.Currencysymbol,
                  }}
                ></span>{" "}
                {NumberWithCommas(e?.TotalAmount, 2)}
              </p>
            </div>
          </div>
        );
      })}
      {/* table total */}
      <div className="border-start border-end border-bottom d-flex lightGrey no_break">
        <div
          className={`${style?.srNo} p-1 text-center fw-bold border-end`}
        ></div>
        <div className={`${style?.total} p-1 fw-bold border-end`}>
          <p>TOTAL</p>
        </div>
        <div className={`${style?.unitPrice} p-1 text-end fw-bold border-end`}>
          <p>
            {" "}
            <span
              dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}
            ></span>{" "}
            {NumberWithCommas(total?.UnitCost, 2)}{" "}
          </p>
        </div>
        <div className={`${style?.amount} p-1 text-end fw-bold`}>
          <p>
            {" "}
            <span
              dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}
            ></span>{" "}
            {NumberWithCommas(total?.TotalAmount, 2)}
          </p>
        </div>
      </div>
      {/* taxes */}
      <div className="border-start border-end border-bottom d-flex no_break">
      <div className={`${style?.gold18k} border-end`}>
          <p className="fw-semibold text-center border-bottom py-1 lightGrey">SUMMARY</p>
          <div className="d-flex h-100">
            <div className="col-6 border-end p-1 ">
              {summary.map((e, i) => {
                return (
                  e?.value !== 0 && (
                    <div className="d-flex justify-content-between" key={i}>
                      <p className="fw-bold">{e?.name}</p>
                      <p>
                        {NumberWithCommas(e?.value, 3)} {e?.suffix}
                      </p>
                    </div>
                  )
                );
              })}
            </div>
            <div className="col-6 p-1 ">
              {summary2.map((e, i) => {
                return (
                  e?.amount !== 0 && (
                    <div className="d-flex justify-content-between" key={i}>
                      <p className="fw-bold">{e?.name}</p>
                      <p>{NumberWithCommas(e?.amount, 2)}</p>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        </div>
        <div className={`${style?.remarks} p-1 fw-bold border-end`}>
          <p className="fw-bold text-decoration-underline">REMARKS: </p>
          <p>{headerData?.PrintRemark}</p>
        </div>
        <div className={`${style?.grandTotal} p-1 border-end`}>
          {tax.map((e, i) => {
            return (
              <p key={i}>
                {e?.name} @ {e?.per}
              </p>
            );
          })}
          <p className=""> TOTAL </p>
          {/* {summary.map((e, i) => {
            return (
              e?.amount !== 0 &&
              e?.label !== "Gross Wt" && (
                <p key={i}>
                  Total {e?.label === "COLOR STONE" ? "CS" : e?.label} Value
                </p>
              )
            );
          })} */}
          {headerData?.AddLess !== 0 && (
            <p className="">{headerData?.AddLess > 0 ? "ADD" : "LESS"}</p>
          )}
        </div>
        <div className={`${style?.amount} p-1 text-end fw-bold`}>
          {tax.map((e, i) => {
            return (
              <p key={i}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: headerData?.Currencysymbol,
                  }}
                ></span>{" "}
                {e?.amount}
              </p>
            );
          })}
          <p>
            <span
              dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}
            ></span>{" "}
            {NumberWithCommas(total?.afterTax, 2)}
          </p>
          {/* {summary.map((e, i) => {
            return (
              e?.amount !== 0 &&
              e?.label !== "Gross Wt" && (
                <p key={i}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: headerData?.Currencysymbol,
                    }}
                  ></span>{" "}
                  {NumberWithCommas(e?.amount, 2)}
                </p>
              )
            );
          })} */}
          {headerData?.AddLess !== 0 && (
            <p>
              <span
                dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}
              ></span>{" "}
              {NumberWithCommas(headerData?.AddLess, 2)}
            </p>
          )}
        </div>
      </div>
      {/* grand total */}
      <div className="border-start border-end border-bottom d-flex lightGrey no_break">
      <div className={`${style?.gold18k} p-1 border-end d-flex`}>
          <div className="col-6 border-end"></div>
          <div className="col-6 d-flex justify-content-between">
            <p className="fw-bold">TOTAL</p>
            <p>
              {" "}
              <span
                dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}
              ></span>{" "}
              {NumberWithCommas(total?.grandTotal, 2)}
            </p>
          </div>
        </div>
        <div className={`${style?.remarks} p-1 fw-bold border-end`}></div>
        <div className={`${style?.grandTotal} p-1 border-end`}>
          <p className="fw-bold"> GRAND TOTAL</p>
        </div>
        <div className={`${style?.amount} p-1 text-end fw-bold`}>
          <p>
            {" "}
            <span
              dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}
            ></span>{" "}
            {NumberWithCommas(total?.grandTotal, 2)}
          </p>
        </div>
      </div>
      <div className="py-1 no_break">
        <p className="computerGenerated">
          ** THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US
          IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF
          TRANSACTIONS
        </p>
      </div>
      <div className="border-start border-end border-top p-2 no_break">
        <div
          dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}
        ></div>
      </div>
      {footer}
    </div>
  ) : (
    <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
      {msg}
    </p>
  );
};

export default SaleOrder;
