import React, { useEffect, useState } from "react";
import style from "../../assets/css/prints/detailPrint8.module.css";
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

const DetailPrint8 = ({ token, invoiceNo, printName, urls, evn }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [headerData, setHeaderData] = useState({});
  const [footer, setFooter] = useState(null);
  const [header, setHeader] = useState(null);
  const [taxes, setTaxes] = useState([]);
  const toWords = new ToWords();
  const [custAddress, setCustAddress] = useState([]);
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
    let arr = [];
    datas.resultArray.forEach((e, i) => {
      let obj = { ...e };
      obj.len =
        e?.totals?.diamonds?.length +
        e?.totals?.colorstone?.length +
        e?.totals?.misc?.length;
      obj.materials = [
        ...e?.metal,
        ...e?.diamonds,
        ...e?.colorstone,
        ...e?.misc,
      ];
      arr.push(obj);
    });
    datas.resultArray = [...arr];
    setData(datas);
    // console.log(datas);
  };

  const checkid = (data, keyValueGold, keyValueDiaCsM) => {
    let id = data?.MasterManagement_DiamondStoneTypeid;
    let datas = "";
    switch (id) {
      case 4:
        datas = data?.[keyValueGold];
        break;
      case 3:
      case 2:
      case 1:
        datas = data?.[keyValueDiaCsM];
        break;
      default:
        break;
    }
    return datas;
  };

  const setTitle = (data) => {
    let arr = ["Diamond", "ColorStone", "Misc"];
    let datas = "";
    switch (data?.MasterManagement_DiamondStoneTypeid) {
      case 4:
        datas = data?.ShapeName;
        break;
      case 3:
      case 2:
      case 1:
        datas = arr[data.MasterManagement_DiamondStoneTypeid - 1];
        break;
      default:
        break;
    }
    return datas;
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
      className={`container container-fluid max_width_container mt-1 ${style?.detailprint8} pad_60_allPrint`}
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
      <div className="bgGrey text-white py-1 px-2">
        <h4 className=" fw-bold min_height_title d-flex align-items-center">
          {headerData?.PrintHeadLabel}
        </h4>
      </div>
      {/* header */}
      <div className="text-center pt-4">
        <img src={headerData?.PrintLogo} alt="" className="imgWidth" />
        <p className="fw-bold"> {headerData?.CompanyFullName}</p>
        <p>{headerData?.CompanyAddress}</p>
        <p>{headerData?.CompanyAddress2}</p>
        <p>
          {headerData?.CompanyCity}-{headerData?.CompanyPinCode},{" "}
          {headerData?.CompanyState}({headerData?.CompanyCountry})
        </p>
        <p>
          T {headerData?.CompanyTellNo} | TOLL FREE{" "}
          {headerData?.CompanyTollFreeNo}
        </p>
        <p>
          {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-
          {headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber}
        </p>
        <p>CIN: {headerData?.CINNO} | MSME: {headerData?.MSME}</p>
        <p className="fw-bold pb-2">{headerData?.InvoiceBillType}</p>
      </div>

      {/* sub header */}
      <div className="d-flex border">
        <div className="col-3 border-end p-2">
          <p>To,</p>
          <p className="fw-bold">{headerData?.customerfirmname}</p>
          <p>{headerData?.customerAddress1}</p>
          <p>{headerData?.customerAddress3}</p>
          <p>{headerData?.customerAddress2}</p>
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
        <div className="col-3 border-end p-2">
          <p> Ship To,</p>
          <p className="fw-bold">{headerData?.customerfirmname}</p>
          <p>{headerData?.CustName}</p>
          {custAddress.map((e, i) => {
            return <p key={i}>{e}</p>;
          })}
        </div>
        <div className="col-3 border-end p-2">
          <p>
            <span className="fw-bold">INVOICE NO</span> {headerData?.InvoiceNo}
          </p>
          <p>
            <span className="fw-bold">DATE</span> {headerData?.EntryDate}
          </p>
          <p>
            <span className="fw-bold">Delivery Mode</span>{" "}
          </p>
        </div>
        <div className="col-3 p-2">
          <p>E Way Bill No: </p>
          <p>PAN: {headerData?.CustPanno}</p>
          <p>Advance Receipt No: </p>
          <p>Name of Trasporter: </p>
          <p>Vehical No: </p>
          <p>freight terms: </p>
          <p>E reference No: </p>
          <p>Credit Days: </p>
          <p>Output Types: </p>
          <p>Product Types: </p>
          <p>HSN CODE: {headerData?.HSN_No}</p>
        </div>
      </div>

      {/* table header */}
      <div className="d-flex border mt-1">
        <div
          className={`${style?.Sr} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="fw-bold text-center pad_1">Sr#</p>
        </div>
        <div
          className={`${style?.design} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="fw-bold text-center pad_1">Design</p>
        </div>
        <div className={`${style?.material} border-end`}>
          <div className="d-grid h-100">
            <div className="d-flex justify-content-center border-bottom py-1">
              <p className="fw-bold">Material Description</p>
            </div>
            <div className="d-flex">
              <div
                className={`${style?.Material} pad_1 text-center fw-bold py-1 border-end`}
              >
                Material
              </div>
              <div
                className={`${style?.Shape} pad_1 text-center fw-bold py-1 border-end`}
              >
                Shape
              </div>
              <div
                className={`${style?.Qlty} pad_1 text-center fw-bold py-1 border-end`}
              >
                Qlty
              </div>
              <div
                className={`${style?.Color} pad_1 text-center fw-bold py-1 border-end`}
              >
                Color
              </div>
              <div
                className={`${style?.Size} pad_1 text-center fw-bold py-1 border-end`}
              >
                Size
              </div>
              <div
                className={`${style?.Pcs} pad_1 text-center fw-bold py-1 border-end`}
              >
                Pcs
              </div>
              <div
                className={`${style?.WtCtw} pad_1 text-center fw-bold py-1 border-end`}
              >
                Wt./Ctw.
              </div>
              <div
                className={`${style?.Rate} pad_1 text-center fw-bold py-1 border-end`}
              >
                Rate
              </div>
              <div
                className={`${style?.Amount} pad_1 text-center fw-bold py-1`}
              >
                Amount
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${style?.qty} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="fw-bold text-center pad_1">Qty</p>
        </div>
        <div
          className={`${style?.other} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="fw-bold text-center pad_1">Other</p>
        </div>
        <div className={`${style?.labour} border-end`}>
          <div className="d-grid h-100">
            <div className="d-flex justify-content-center border-bottom py-1">
              <p className="fw-bold ">Labour</p>
            </div>
            <div className="d-flex">
              <div className={`col-6 py-1 border-end text-center pad_1`}>
                Rate
              </div>
              <div className={`col-6 py-1 text-center pad_1`}>Amt</div>
            </div>
          </div>
        </div>
        <div
          className={`${style?.amount} d-flex justify-content-center align-items-center`}
        >
          <p className="fw-bold text-center pad_1">Amount</p>
        </div>
      </div>

      {/* table data */}
      {data?.resultArray.map((e, i) => {
        return (
          <div className="d-flex border-start border-end border-bottom" key={i}>
            <div
              className={`${style?.Sr} border-end d-flex justify-content-center align-items-center`}
            >
              <p className="text-center pad_1">{i + 1}</p>
            </div>
            <div className={`${style?.design} border-end`}>
              <p className="pad_1"> {e?.designno} </p>
              <p className="text-end pad_1">{e?.SrJobno}</p>
              <img
                src={e?.DesignImage}
                alt=""
                className="imgWidth"
                onError={handleImageError}
              />
              <p className="text-center">PO:{e?.PO}</p>
              <p className="text-center">HUID-{e?.HUID}</p>
              <p className="text-center">
                <span className="fw-bold">
                  {NumberWithCommas(e?.grosswt, 3)} gm Gross
                </span>
              </p>
            </div>
            <div className={`${style?.material} border-end d-flex`}>
              <div className="d-grid h-100 w-100">
                {e?.materials.map((ele, ind) => {
                  return (
                    <div
                      className={`d-flex ${
                        ind !== e?.materials.length - 1 && "border-bottom"
                      }`}
                      key={ind}
                    >
                      <div
                        className={`${style?.Material} pad_1 py-1 border-end`}
                      >
                        {setTitle(ele)}
                      </div>
                      <div className={`${style?.Shape} pad_1 py-1 border-end`}>
                        {checkid(ele, "", "ShapeName")}
                      </div>
                      <div className={`${style?.Qlty} pad_1 py-1 border-end`}>
                        {checkid(ele, "QualityName", "")}
                      </div>
                      <div className={`${style?.Color} pad_1 py-1 border-end`}>
                        {checkid(ele, "Colorname", "")}
                      </div>
                      <div className={`${style?.Size} pad_1 py-1 border-end`}>
                        {checkid(ele, "", "SizeName")}
                      </div>
                      <div
                        className={`${style?.Pcs} pad_1 py-1 border-end text-end`}
                      >
                        {checkid(ele, "", "Pcs")}
                      </div>
                      <div
                        className={`${style?.WtCtw} pad_1 py-1 border-end text-end`}
                      >
                        {NumberWithCommas(ele?.Wt, 3)}
                      </div>
                      <div
                        className={`${style?.Rate} pad_1 py-1 border-end text-end`}
                      >
                        {NumberWithCommas(ele?.Rate, 2)}
                      </div>
                      <div className={`${style?.Amount} pad_1 py-1 text-end`}>
                        {NumberWithCommas(ele?.Amount, 2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              className={`${style?.qty} border-end d-flex justify-content-end align-items-center`}
            >
              <p className="pad_1 text-end">
                {NumberWithCommas(e?.Quantity, 0)}
              </p>
            </div>
            <div
              className={`${style?.other} border-end d-flex justify-content-end align-items-center`}
            >
              <p className="pad_1 text-end">
                {NumberWithCommas(e?.OtherCharges, 2)}
              </p>
            </div>
            <div className={`${style?.labour} border-end d-flex`}>
              <div className="col-6 d-flex justify-content-end align-items-center border-end pad_1">
                {NumberWithCommas(e?.MaKingCharge_Unit, 2)}
              </div>
              <div className="col-6 d-flex justify-content-end align-items-center pad_1">
                {NumberWithCommas(e?.MakingAmount, 2)}
              </div>
            </div>
            <div
              className={`${style?.amount} d-flex justify-content-end align-items-center`}
            >
              <p className="pad_1">{NumberWithCommas(e?.TotalAmount, 2)}</p>
            </div>
          </div>
        );
      })}
      {/* table total */}
      <div className="d-flex border-start border-end border-bottom justify-content-end">
        <div
          className={`${style?.amount} d-flex justify-content-end align-items-center`}
        >
          <p className="pad_1">
            {NumberWithCommas(data?.mainTotal?.total_amount, 2)}
          </p>
        </div>
      </div>

      {/* total cgst sgst*/}
      <div className="d-flex border-start border-end border-bottom">
        <div className={`${style?.words} border-end`}>
          {data?.allTaxes.map((e, i) => {
            return (
              <div className="pad_1" key={i}>
                TOTAL {e?.name} IN WORDS : {toWords.convert(+e?.amount)}
              </div>
            );
          })}
        </div>
        <div className={`${style?.taxes} border-end`}>
          {data?.allTaxes.map((e, i) => {
            return (
              <div className="pad_1 text-end" key={i}>
                {e?.name} @ {e?.per}
              </div>
            );
          })}
          <p className="pad_1 text-end">Sales Rounded Off</p>
        </div>
        <div className={`${style?.taxAmount}`}>
          {data?.allTaxes.map((e, i) => {
            return (
              <div className="pad_1 text-end" key={i}>
                {e?.amount}
              </div>
            );
          })}
          <p className="pad_1 text-end">-0.15</p>
        </div>
      </div>

      {/* table total2 */}
      <div className="d-flex border-start border-end border-bottom">
        <div
          className={`${style?.totalt} border-end d-flex justify-content-center align-items-end`}
        >
          <p>Total </p>
        </div>
        <div className={`${style?.qtyt} border-end`}></div>
        <div className={`${style?.dt} border-end`}>
          <p className="pad_1">
            Qty:{NumberWithCommas(data?.mainTotal?.total_Quantity, 0)}
          </p>
          <p className="pad_1">
            D: Company : {NumberWithCommas(data?.mainTotal?.diamonds.Pcs, 0)}/
            {NumberWithCommas(data?.mainTotal?.diamonds.Wt, 3)} Ctw
          </p>
          <p className="pad_1">
            C: Company : {NumberWithCommas(data?.mainTotal?.colorstone.Pcs, 0)}/
            {NumberWithCommas(data?.mainTotal?.colorstone.Wt, 3)} Ctw
          </p>
          <p className="pad_1">
            M: Company : {NumberWithCommas(data?.mainTotal?.metal.Pcs, 0)}/
            {NumberWithCommas(data?.mainTotal?.metal.Wt, 3)} Wt
          </p>
          <p className="pad_1">
            Wt:{NumberWithCommas(data?.mainTotal?.netwtWithLossWt, 3)}
          </p>
          <p className="pad_1">Ctw:31.160</p>
        </div>
        <div
          className={`${style?.ct} border-end d-flex justify-content-end align-items-center`}
        >
          <p className="text-end pad_1 fw-bold">68,305.27 </p>
        </div>
        <div
          className={`${style?.mt} border-end d-flex justify-content-end align-items-center`}
        >
          <p className="text-end pad_1 fw-bold">
            {NumberWithCommas(data?.mainTotal?.total_Quantity, 0)}{" "}
          </p>
        </div>
        <div
          className={`${style?.wtt} border-end d-flex justify-content-end align-items-center`}
        >
          <p className="text-end pad_1 fw-bold">1,050.00 </p>
        </div>
        <div
          className={`${style?.ctwt} border-end d-flex justify-content-end align-items-center`}
        >
          <p className="text-end pad_1 fw-bold">17,097.70 </p>
        </div>
        <div
          className={`${style?.tt} d-flex justify-content-end align-items-center`}
        >
          <p className="text-end pad_1 fw-bold">
            <span
              dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}
            ></span>{" "}
            {NumberWithCommas(data?.finalAmount, 2)}
          </p>
        </div>
        <div></div>
      </div>

      {/* in words */}
      <div className="d-flex border-start border-end border-bottom">
        <div className={`${style?.totalt} border-end pad_1`}>
          <span
            dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}
          ></span>
        </div>
        <div className={`${style?.inWords} pad_1`}>
          <p className="fw-bold">{toWords.convert(data?.finalAmount)} Only</p>
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

export default DetailPrint8;
