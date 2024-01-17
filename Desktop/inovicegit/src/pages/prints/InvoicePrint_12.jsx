import React, { useEffect, useState } from "react";
import {
  NumberWithCommas,
  apiCall,
  handlePrint,
  isObjectEmpty,
  FooterComponent,
  fixedValues,
  otherAmountDetail,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import style from "../../assets/css/prints/invoiceprint_12.module.css";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { ToWords } from "to-words";
import footerStyle from "../../assets/css/footers/footer2.module.css";

const InvoicePrint_12 = ({ urls, token, invoiceNo, printName, evn }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [headerData, setHeaderData] = useState({});
  const [footer, setFooter] = useState(null);
  const [taxes, setTaxes] = useState([]);
  const [total, setTotal] = useState({});
  const [grandTotal, setGrandTotal] = useState(0);
  const toWords = new ToWords();

  const loadData = (data) => {
    setHeaderData(data?.BillPrint_Json[0]);
    let footers = FooterComponent("2", data?.BillPrint_Json[0]);
    setFooter(footers);
    let datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );
    let finalArr = [];
    
    
    datas?.resultArray?.forEach((e, i) => {
      let findData = finalArr?.findIndex(
        (ele) => ele.MetalPurity === e?.MetalPurity
      );
      if (findData === -1) {
        finalArr.push(e);
      } else {
        finalArr[findData].Quantity += e?.Quantity;
        finalArr[findData].grosswt += e?.grosswt;
        finalArr[findData].NetWt += e?.NetWt;
        finalArr[findData].totals.diamonds.Wt += e?.totals?.diamonds?.Wt;
        finalArr[findData].totals.colorstone.Wt += e?.totals?.colorstone?.Wt;
        finalArr[findData].totals.misc.Amount += e?.totals?.misc?.Amount;
        finalArr[findData].TotalDiamondHandling += e?.TotalDiamondHandling;
        finalArr[findData].totals.diamonds.SettingAmount +=
          e?.totals.diamonds.SettingAmount;
        finalArr[findData].totals.colorstone.SettingAmount +=
          e?.totals.colorstone.SettingAmount;
          
        // let otherAmtDetails = [
        //   ...finalArr[findData]?.other_amount_details,
        //   ...e?.other_amount_details,
        // ]?.flat();
        // let otherAmtDetail = [];
        // otherAmtDetails?.forEach((elem, index) => {
        //   let findOther = otherAmtDetail?.findIndex(
        //     (ele) => ele?.label === elem?.label
        //   );
        //   if (findOther === -1) {
        //     otherAmtDetail.push(elem);
        //   } else {
        //     otherAmtDetail[findOther].value =
        //       +otherAmtDetail[findOther]?.value + +elem?.value;
        //   }
        // });
        // finalArr[findData].otherAmtDetails = otherAmtDetail;
        let otherAmtDetails = [
          ...e?.other_details,
          ...finalArr[findData]?.other_details,
        ]?.flat();
        let  otherAmtDetail2 = [];
        otherAmtDetails?.forEach((elem, index) => {
          let findOther = otherAmtDetail2?.findIndex(
            (ele) => ele?.label === elem?.label
          );
          if (findOther === -1) {
            otherAmtDetail2.push(elem);
          } else {
            otherAmtDetail2[findOther].value =
              +otherAmtDetail2[findOther]?.value + +elem?.value;
          }
        });
        finalArr[findData].otherAmtDetails = otherAmtDetail2;
        finalArr[findData].MakingAmount += e?.MakingAmount;
        finalArr[findData].TotalAmount += e?.TotalAmount;
      }
    });
    setData(finalArr);
    setTaxes(datas?.allTaxes);
    setTotal(datas?.mainTotal);
    setGrandTotal(datas?.finalAmount);
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
      className={`container container-fluid max_width_container mt-1 ${style?.InvoicePrint_12} pad_60_allPrint`}
    >

      {/* buttons */}
      <div
        className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}
      >
        <div className="form-check ps-3">
          <input
            type="button"
            className="btn_white blue py-2 mt-2"
            value="Print"
            onClick={(e) => handlePrint(e)}
          />
        </div>
      </div>
      {/* Title */}
      <div className="py-1">
        <h4 className="text-center fs-4 fw-semibold">
          {headerData?.PrintHeadLabel}
        </h4>
      </div>

      {/* header */}
      <div className="d-flex border p-2">
        <div className="col-8">
          <p>{headerData?.lblBillTo}</p>
          <p className="fs-6 fw-semibold">{headerData?.customerfirmname}</p>
          <p>{headerData?.customerAddress1}</p>
          <p>{headerData?.customerAddress2}</p>
          <p>
            {headerData?.customercity1}
            {headerData?.customerpincode}
          </p>
          <p>{headerData?.customeremail1}</p>
          <p>{headerData?.vat_cst_pan}</p>
          <p>{headerData?.Cust_CST_STATE_No_}</p>
        </div>
        <div className="col-4 d-flex ">
          <div className="col-4">
            <p className="fw-semibold">Bill No </p>
            <p className="fw-semibold">DATE </p>
            <p className="fw-semibold">HSN/SAC </p>
            <p className="fw-semibold">{headerData?.Company_CST_STATE}</p>
            <p className="fw-semibold">PAN </p>
            <p className="fw-semibold">GSTIN </p>
            <p className="fw-semibold">MSME NO </p>
          </div>
          <div className="col-8">
            <p>: {headerData?.InvoiceNo}</p>
            <p>: {headerData?.EntryDate}</p>
            <p>: {headerData?.HSN_No}</p>
            <p>: {headerData?.Company_CST_STATE_No}</p>
            <p>: {headerData?.Pannumber}</p>
            <p>: {headerData?.Company_VAT_GST_No.replace("GSTIN-", "")}</p>
            <p>: {headerData?.MSME}</p>
          </div>
        </div>
      </div>

      {/* table header */}
      <div className="d-flex border-bottom border-start border-end">
        <div className={`${style?.Sr} border-end`}>
          <p className="fw-bold text-center">Sr#</p>
        </div>
        <div className={`${style?.Product} border-end`}>
          <p className="fw-bold text-center">Product Description</p>
        </div>
        <div className={`${style?.KT} border-end`}>
          <p className="fw-bold text-center">KT</p>
        </div>
        <div className={`${style?.Qty} border-end`}>
          <p className="fw-bold text-center">Qty</p>
        </div>
        <div className={`${style?.Gross} border-end`}>
          <p className="fw-bold text-center">Gross Wt(gm)</p>
        </div>
        <div className={`${style?.Dia} border-end`}>
          <p className="fw-bold text-center">Dia Wt(ctw)</p>
        </div>
        <div className={`${style?.Stone} border-end`}>
          <p className="fw-bold text-center">Stone Wt(ctw)</p>
        </div>
        <div className={`${style?.Net} border-end`}>
          <p className="fw-bold text-center">Net Wt(gm)</p>
        </div>
        <div className={`${style?.Other} border-end`}>
          <p className="fw-bold text-center">Other charges</p>
        </div>
        <div className={`${style?.Making} border-end`}>
          <p className="fw-bold text-center">Making Amount</p>
        </div>
        <div className={`${style?.ProductVal}`}>
          <p className="fw-bold text-center">Product Value</p>
        </div>
      </div>

      {/* table data */}

      {data.map((e, i) => {
        return (
          <div
            className={`d-flex border-bottom border-start border-end ${style?.table}`}
            key={i}
          >
            <div className={`${style?.Sr} border-end`}>
              <p className="text-center">{i + 1}</p>
            </div>
            <div className={`${style?.Product} border-end`}>
              <p className="">Diamond Studded Gold Jewellery</p>
            </div>
            <div className={`${style?.KT} border-end`}>
              <p className="">{e?.MetalPurity}</p>
            </div>
            <div className={`${style?.Qty} border-end`}>
              <p className="text-end">{e?.Quantity}</p>
            </div>
            <div className={`${style?.Gross} border-end`}>
              <p className="text-end">{NumberWithCommas(e?.grosswt, 3)}</p>
            </div>
            <div className={`${style?.Dia} border-end`}>
              <p className="text-end">
                {NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}
              </p>
            </div>
            <div className={`${style?.Stone} border-end`}>
              <p className="text-end">
                {NumberWithCommas(e?.totals?.colorstone?.Wt, 3)}
              </p>
            </div>
            <div className={`${style?.Net} border-end`}>
              <p className="text-end">{NumberWithCommas(e?.NetWt, 3)}</p>
            </div>
            <div className={`${style?.Other} border-end`}>
              {e?.other_amount_details?.map((ele, ind) => {
                return (
                  <div className="d-flex justify-content-between" key={ind}>
                    <p>{ele?.label}</p>
                    <p>{NumberWithCommas(+ele?.value, 2)}</p>
                  </div>
                );
              })}
              {e?.TotalDiamondHandling !== 0 && (
                <div className="d-flex justify-content-between">
                  <p>Handling</p>
                  <p>{NumberWithCommas(e?.TotalDiamondHandling, 2)}</p>
                </div>
              )}
              {e?.totals?.misc?.Amount !== 0 && (
                <div className="d-flex justify-content-between">
                  <p>Misc</p>
                  <p>{NumberWithCommas(e?.totals?.misc?.Amount, 2)}</p>
                </div>
              )}
            </div>
            <div className={`${style?.Making} border-end`}>
              <p className="text-end">
                {NumberWithCommas(
                  e?.MakingAmount +
                  e?.totals?.diamonds?.SettingAmount +
                  e?.totals?.colorstone?.SettingAmount,
                  2
                )}
              </p>
            </div>
            <div className={`${style?.ProductVal}`}>
              <p className="text-end">{NumberWithCommas(e?.TotalAmount, 2)}</p>
            </div>
          </div>
        );
      })}

      {/* total */}
      <div
        className={`d-flex border-bottom border-start border-end ${style?.table}`}
      >
        <div className={`${style?.Sr} border-end`}>
          <p className="text-center"></p>
        </div>
        <div className={`${style?.Product} border-end fw-semibold`}>
          <p className="">Total</p>
        </div>
        <div className={`${style?.KT} border-end`}>
          <p className=""></p>
        </div>
        <div className={`${style?.Qty} border-end fw-semibold`}>
          <p className="text-end">
            {NumberWithCommas(total?.total_Quantity, 0)}
          </p>
        </div>
        <div className={`${style?.Gross} border-end fw-semibold`}>
          <p className="text-end">{NumberWithCommas(total?.grosswt, 3)}</p>
        </div>
        <div className={`${style?.Dia} border-end fw-semibold`}>
          <p className="text-end">{NumberWithCommas(total?.diamonds?.Wt, 3)}</p>
        </div>
        <div className={`${style?.Stone} border-end fw-semibold`}>
          <p className="text-end">
            {NumberWithCommas(total?.colorstone?.Wt, 3)}
          </p>
        </div>
        <div className={`${style?.Net} border-end fw-semibold`}>
          <p className="text-end">{NumberWithCommas(total?.netwt, 3)}</p>
        </div>
        <div className={`${style?.Other} border-end fw-semibold`}>
          <p className="text-end">
            {NumberWithCommas(
              total?.total_other +
              total?.misc?.Amount +
              total?.total_diamondHandling,
              2
            )}
          </p>
        </div>
        <div className={`${style?.Making} border-end fw-semibold`}>
          <p className="text-end">
            {NumberWithCommas(total?.total_Making_Amount+total?.diamonds?.SettingAmount+total?.colorstone?.SettingAmount, 2)}{" "}
          </p>
        </div>
        <div className={`${style?.ProductVal} fw-semibold`}>
          <p className="text-end">{NumberWithCommas(total?.total_amount, 2)}</p>
        </div>
      </div>

      {/* taxes */}
      <div className={`d-flex border-bottom border-start border-end`}>
        <div
          className={`${style?.words} d-flex justify-content-end flex-column border-end ${style?.table} p-2`}
        >
          <p>Value in Words:</p>
          <p className="fw-semibold">
            {toWords.convert(+fixedValues(grandTotal, 2))} Only.
          </p>
        </div>
        <div className={`${style?.totalAmount}`}>
          <div className={`d-flex ${style?.table}`}>
            <div
              className={`${style?.totalAmtWord} border-end text-end fw-bold`}
            >
              Total Amount
            </div>
            <div className={`${style?.totalAmtValue} fw-bold text-end`}>
              {NumberWithCommas(total?.total_amount, 2)}
            </div>
          </div>
          {taxes.map((e, i) => {
            return (
              <div className={`d-flex ${style?.table}`} key={i}>
                <div className={`${style?.totalAmtWord} border-end text-end`}>
                  {e?.name} @ {e?.per}
                </div>
                <div className={`${style?.totalAmtValue} text-end`}>
                  {e?.amount}
                </div>
              </div>
            );
          })}

          {headerData?.AddLess !== 0 && (
            <div className={`d-flex ${style?.table}`}>
              <div className={`${style?.totalAmtWord} border-end text-end`}>
                {headerData?.AddLess > 0 ? "Add" : "Less"}
              </div>
              <div className={`${style?.totalAmtValue} text-end`}>
                {NumberWithCommas(headerData?.AddLess, 2)}
              </div>
            </div>
          )}

          <div className={`d-flex ${style?.table} border-top py-2`}>
            <div
              className={`${style?.totalAmtWord} border-end text-end fw-bold`}
            >
              Total Amount To be Paid:
            </div>
            <div className={`${style?.totalAmtValue} text-end fw-bold`}>
              <span
                dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}
              ></span>
              {NumberWithCommas(grandTotal, 2)}
            </div>
          </div>
        </div>
      </div>

      {/* remark */}
      <div className={`border-bottom border-start border-end p-2`}>
        <p className="fw-bold text-decoration-underline">Remark : </p>
        <p>  {headerData?.PrintRemark}</p>
      </div>

      {/* declaration */}
      <div className="my-1 border">
        <p className="fw-bold text-decoration-underline px-2 pt-2">Notes: </p>
        <div
          className="px-2 pb-2"
          dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}
        ></div>
      </div>


      {/* footer */}
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
  ) : (
    <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
      {msg}
    </p>
  );
};

export default InvoicePrint_12;
