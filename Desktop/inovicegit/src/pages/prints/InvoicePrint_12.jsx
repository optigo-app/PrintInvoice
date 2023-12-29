import React, { useEffect, useState } from "react";
import {
  NumberWithCommas,
  apiCall,
  handlePrint,
  isObjectEmpty,
  FooterComponent,
  fixedValues,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import style from "../../assets/css/prints/invoiceprint_12.module.css";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { ToWords } from 'to-words';

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
      let findData = finalArr.findIndex(
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

        let otherAmtDetails = [
          ...finalArr[findData]?.other_amount_details,
          ...e?.other_amount_details,
        ].flat();
        let otherAmtDetail = [];
        otherAmtDetails.forEach((elem, index) => {
          let findOther = otherAmtDetail.findIndex(
            (ele) => ele?.label === elem?.label
          );
          if (findOther === -1) {
            otherAmtDetail.push(elem);
          } else {
            otherAmtDetail[findOther].value =
              +otherAmtDetail[findOther]?.value + +elem?.value;
          }
        });
        finalArr[findData].otherAmtDetails = otherAmtDetail;
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
            className="btn_white blue py-0 mt-2"
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
          <p>{headerData?.customerregion}</p>
          <p>
            {headerData?.customercity}
            {headerData?.customerpincode}
          </p>
          <p>{headerData?.customeremail1}</p>
          <p>{headerData?.vat_cst_pan}</p>
          <p>{headerData?.Cust_CST_STATE_No_},</p>
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
            <p>: 24AAAAA0000A1Z51</p>
            <p>: DL05A0000051</p>
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
              {e?.otherAmtDetails.map((ele, ind) => {
                return (
                  <div className="d-flex justify-content-between" key={ind}>
                    <p>{ele?.label}</p>
                    <p>{NumberWithCommas(+ele?.value, 2)}</p>
                  </div>
                );
              })}
            </div>
            <div className={`${style?.Making} border-end`}>
              <p className="text-end">{NumberWithCommas(e?.MakingAmount, 2)}</p>
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
          <p className="text-end">{NumberWithCommas(total?.total_Quantity, 0)}</p>
        </div>
        <div className={`${style?.Gross} border-end fw-semibold`}>
          <p className="text-end">{NumberWithCommas(total?.grosswt, 3)}</p>
        </div>
        <div className={`${style?.Dia} border-end fw-semibold`}>
          <p className="text-end">{NumberWithCommas(total?.diamonds?.Wt, 3)}</p>
        </div>
        <div className={`${style?.Stone} border-end fw-semibold`}>
          <p className="text-end">{NumberWithCommas(total?.colorstone?.Wt, 3)}</p>
        </div>
        <div className={`${style?.Net} border-end fw-semibold`}>
          <p className="text-end">{NumberWithCommas(total?.netwt, 3)}</p>
        </div>
        <div className={`${style?.Other} border-end fw-semibold`}>
          <p className="text-end">{NumberWithCommas(total?.total_other, 2)}</p>
        </div>
        <div className={`${style?.Making} border-end fw-semibold`}>
          <p className="text-end">{NumberWithCommas(total?.total_Making_Amount, 2)} </p>
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
              36641.25
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
              <div className={`${style?.totalAmtValue} text-end`}>{NumberWithCommas(headerData?.AddLess, 2)}</div>
            </div>
          )}

          <div className={`d-flex ${style?.table} border-top py-2`}>
            <div
              className={`${style?.totalAmtWord} border-end text-end fw-bold`}
            >
              Total Amount To be Paid:
            </div>
            <div className={`${style?.totalAmtValue} text-end fw-bold`}>
              <span dangerouslySetInnerHTML={{__html: headerData?.Currencysymbol}}></span>{NumberWithCommas(grandTotal, 2)}
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

export default InvoicePrint_12;
