import React, { useEffect, useState } from "react";
import {
  FooterComponent,
  HeaderComponent,
  NumberWithCommas,
  apiCall,
  fixedValues,
  handlePrint,
  isObjectEmpty,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import style from "../../assets/css/prints/TaxInvoice5.module.css";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { ToWords } from "to-words";
import style2 from "../../assets/css/headers/header1.module.css";

const TaxInvoice5 = ({ token, invoiceNo, printName, urls, evn }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [header, setHeader] = useState(null);
  const [footer, setFooter] = useState(null);
  const [address, setAddress] = useState([]);
  const [headerData, setHeaderData] = useState({});
  const [image, setImage] = useState(true);
  const [pnm, setPnm] = useState(atob(printName).toLowerCase());
  const toWords = new ToWords();

  const loadData = (data) => {
    // console.log(data);
    let head = HeaderComponent("1", data?.BillPrint_Json[0]);
    setHeader(head);
    setHeaderData(data?.BillPrint_Json[0]);
    let adr = data?.BillPrint_Json[0]?.Printlable.split(`\r\n`);
    setAddress(adr);
    setFooter(FooterComponent("2", data?.BillPrint_Json[0]));
    let datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );
    let resultArr = [];
    datas?.resultArray.forEach((e, i) => {
      if (e?.GroupJob === "") {
        let obj = {...e};
        obj.srjobno = e?.SrJobno.split("/");
        resultArr.push(obj);
      } else {
        let findRecord = resultArr.findIndex(
          (elem, index) =>
            elem?.GroupJob === e?.GroupJob && elem?.GroupJob !== ""
        );
        if (findRecord === -1) {
          let obj = {...e};
          obj.srjobno = e?.SrJobno.split("/");
          resultArr.push(obj);
        } else {
          if (e?.GroupJob === e?.SrJobno) {
            resultArr[findRecord].MetalPurity = e?.MetalPurity;
            resultArr[findRecord].JewelCodePrefix = e?.JewelCodePrefix;
            resultArr[findRecord].designno = e?.designno;
            resultArr[findRecord].SrJobno = e?.SrJobno;
          }
          resultArr[findRecord].grosswt += e?.grosswt;
          resultArr[findRecord].NetWt += e?.NetWt;
          resultArr[findRecord].totals.diamonds.Wt += e?.totals?.diamonds?.Wt;
          resultArr[findRecord].totals.colorstone.Wt +=
            e?.totals?.colorstone?.Wt;
          resultArr[findRecord].TotalAmount += e?.TotalAmount;
        }
      }
    });
    datas.resultArray = resultArr;
    datas?.resultArray.sort((a, b) => {
      var nameA = a.SrJobno.toUpperCase(); // Convert names to uppercase for case-insensitive comparison
      var nameB = b.SrJobno.toUpperCase();

      if (nameA < nameB) {
        return -1; // A should come before B
      }
      if (nameA > nameB) {
        return 1; // A should come after B
      }
      return 0; // Names are equal
    });
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
      className={`container container-fluid max_width_container mt-1 ${style?.taxinvoice5} pad_60_allPrint`}
    >
      {/* buttons */}
      <div
        className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}
      >
        <div className="form-check pe-3 pt-2">
          <input
            className="form-check-input border-dark"
            type="checkbox"
            checked={image}
            onChange={(e) => setImage(!image)}
          />
          <label className="form-check-label">With Image</label>
        </div>
        <div className="form-check ps-3">
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
          <div className={`${style2.lines} fw-bold`}>
            {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber}
          </div>
          <div className={style2.lines}>
            CIN-{headerData?.CINNO}
          </div>

        </div>
        <div style={{ width: "30%" }} className="d-flex justify-content-end align-item-center h-100"><img src={headerData?.PrintLogo} alt="" className={style2.headerImg} /></div>
      </div>
      {/* sub header */}
      <div className="d-flex border mb-1">
        <div className="col-4 border-end p-2">
          <p>{headerData?.lblBillTo}</p>
          <p className="fw-semibold">{headerData?.CustName}</p>
          <p>{headerData?.customerAddress1}</p>
          <p>{headerData?.customerAddress2}</p>
          <p>
            {headerData?.customercity1}
            {headerData?.customerpincode}
          </p>
          <p>{headerData?.Cust_CST_STATE_No_}</p>
          <p>{headerData?.vat_cst_pan}</p>
        </div>
        <div className="col-4 border-end p-2">
          <p>Ship To,</p>
          <p className="fw-semibold">{headerData?.CustName}</p>
          {address.map((e, i) => {
            return <p key={i}>{e}</p>;
          })}
        </div>
        <div className="col-4 p-2">
          <p className="d-flex">
            <span className="col-6 fw-semibold pe-2">INVOICE NO	 </span>{" "}
            <span className="col-6">: {headerData?.InvoiceNo}</span>
          </p>
          <p className="d-flex">
            <span className="col-6 fw-semibold pe-2">DATE </span>{" "}
            <span className="col-6">: {headerData?.EntryDate}</span>
          </p>
          <p className="d-flex">
            <span className="col-6 fw-semibold pe-2">{headerData?.HSN_No_Label} </span> 
            <span className="col-6">: {headerData?.HSN_No}</span>
          </p>
          <p className="d-flex">
            <span className="col-6 fw-semibold pe-2">TERMS </span> 
            <span className="col-6">: {headerData?.DueDays}</span>
          </p>
        </div>
      </div>
      {/* table Header */}
      <div className="d-flex mt-1 border">
        <div className={`${style?.Sr} border-end`}>
          <p className="text-center fw-bold">Sr. No. </p>
        </div>
        <div className={`${style?.Jewel} border-end`}>
          <p className="text-center fw-bold">Jewel Code </p>
        </div>
        <div className={`${style?.KT} border-end`}>
          <p className="text-center fw-bold">KT </p>
        </div>
        {pnm === "tax invoice 6" && (
          <div className={`${style?.Diamond} border-end`}>
            <p className="text-center fw-bold">HSN </p>
          </div>
        )}
        <div className={`${style?.Gross} border-end`}>
          <p className="text-center fw-bold">Gross Wt <span className="fw-normal">(in gm)</span> </p>
        </div>
        <div className={`${style?.Net} border-end`}>
          <p className="text-center fw-bold">Net Wt <span className="fw-normal">(in gm)</span> </p>
        </div>
        {pnm !== "tax invoice 6" && (
          <div className={`${style?.Diamond} border-end`}>
            <p className="text-center fw-bold">Diamond <span className="fw-normal">(in ct)</span> </p>
          </div>
        )}
        <div className={`${style?.Stone} border-end`}>
          <p className="text-center fw-bold">Stone <span className="fw-normal">(in ct)</span> </p>
        </div>
        <div className={`${style?.Price}`}>
          <p className="text-center fw-bold">Price</p>
        </div>
      </div>
      {/* table data */}
      {data?.resultArray.map((e, i) => {
        return (
          <div className="d-flex border-start border-end border-bottom" key={i}>
            <div className={`${style?.Sr} border-end`}>
              <p className="text-center p-1">{i + 1}</p>
            </div>
            <div className={`${style?.Jewel} border-end`}>
              <p className="p-1">
                {e?.JewelCodePrefix}
                {e?.Category_Prefix}
                {e?.srjobno[1]}
              </p>
            </div>
            <div className={`${style?.KT} border-end`}>
              <p className="p-1">{e?.MetalPurity} </p>
            </div>
            {pnm === "tax invoice 6" && (
              <div className={`${style?.Diamond} border-end`}>
                <p className="text-end p-1">{headerData?.HSN_No}</p>
              </div>
            )}
            <div className={`${style?.Gross} border-end`}>
              <p className="text-end p-1">{NumberWithCommas(e?.grosswt, 3)}</p>
            </div>
            <div className={`${style?.Net} border-end`}>
              <p className="text-end p-1">
                {NumberWithCommas(e?.NetWt + e?.LossWt, 3)}
              </p>
            </div>
            {pnm !== "tax invoice 6" && (
              <div className={`${style?.Diamond} border-end`}>
                <p className="text-end p-1">
                  {NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}
                </p>
              </div>
            )}
            <div className={`${style?.Stone} border-end`}>
              <p className="text-end p-1">
                {NumberWithCommas(e?.totals?.colorstone?.Wt, 3)}{" "}
              </p>
            </div>
            <div className={`${style?.Price}`}>
              <p className="text-end p-1">
                {NumberWithCommas(e?.TotalAmount, 2)}{" "}
              </p>
            </div>
          </div>
        );
      })}

      {/* table total */}
      <div className="d-flex border-start border-end border-bottom">
        <div className={`${style?.Sr} border-end`}>
          <p className="text-center p-1"></p>
        </div>
        <div className={`${style?.Jewel} border-end`}>
          <p className="p-1 fw-bold">TOTAL</p>
        </div>
        <div className={`${style?.KT} border-end`}>
          <p className="p-1"> </p>
        </div>
        {pnm === "tax invoice 6" && (
          <div className={`${style?.Diamond} border-end`}>
            <p className="text-end p-1"></p>
          </div>
        )}
        <div className={`${style?.Gross} border-end`}>
          <p className="text-end p-1 fw-bold">
            {NumberWithCommas(data?.mainTotal?.grosswt, 3)}
          </p>
        </div>
        <div className={`${style?.Net} border-end`}>
          <p className="text-end p-1 fw-bold">
            {NumberWithCommas(
              data?.mainTotal?.netwt + data?.mainTotal?.lossWt,
              3
            )}
          </p>
        </div>
        {pnm !== "tax invoice 6" && <div className={`${style?.Diamond} border-end`}>
          <p className="text-end p-1 fw-bold">
            {NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)}
          </p>
        </div>}
        <div className={`${style?.Stone} border-end`}>
          <p className="text-end p-1 fw-bold">
            {NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)}
          </p>
        </div>
        <div className={`${style?.Price}`}>
          <p className="text-end p-1 fw-bold">
            {NumberWithCommas(data?.mainTotal?.total_amount, 2)}
          </p>
        </div>
      </div>
      {/* In Words */}
      <div className="d-flex border-start border-end border-bottom">
        <div
          className={`${style?.words} border-end p-1 d-flex justify-content-end flex-column`}
        >
          <p>In Words Indian Rupees</p>
          <p className="fw-bold">
            {toWords.convert(+fixedValues(data?.finalAmount, 2))} Only
          </p>
        </div>
        <div className={`${style?.grandTotal}`}>
          <div className="d-flex">
            <div className={`${style?.grandTotalWord} text-end border-end p-1`}>
              {data?.allTaxes.map((e, i) => {
                return (
                  <p key={i}>
                    {e?.name} @ {e?.per}
                  </p>
                );
              })}
              {headerData?.AddLess !== 0 && (
                <p>{headerData?.AddLess > 0 ? "Add" : "Less"}</p>
              )}
            </div>
            <div className={`${style?.grandTotalValue} p-1 text-end`}>
              {data?.allTaxes.map((e, i) => {
                return <p key={i}>{e?.amount}</p>;
              })}
              {headerData?.AddLess !== 0 && (
                <p>{NumberWithCommas(headerData?.AddLess, 2)}</p>
              )}
            </div>
          </div>
          <div className="d-flex border-top">
            <div className={`${style?.grandTotalWord} text-end border-end p-1`}>
              <p className="fw-bold">GRAND TOTAL</p>
            </div>
            <div className={`${style?.grandTotalValue} p-1 text-end`}>
              <p className="fw-bold">{NumberWithCommas(data?.finalAmount, 2)}</p>
            </div>
          </div>
        </div>
      </div>
            {/* remarks */}
            <div className="border-start border-end border-bottom p-2">
          <p className="fw-bold">REMARKS : </p>
         <p> {headerData?.PrintRemark}</p>
      </div>
      {/* declaration */}
      <div
        className="border-start border-end border-bottom p-2"
        dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}
      ></div>


      {/* footer */}
      <div className="d-flex border-start border-end border-bottom">
      <div className="col-4 border-end p-2 d-flex flex-column justify-content-between">
          <p className="fw-bold">Signature</p>
          <p>
            <span className="fw-bold">{headerData?.CustName}</span>
            <span className={`${style?.sup}`}></span> (With Stamp)
          </p>
        </div>
        <div className="col-4 border-end p-2">
          <p className="fw-bold">Bank Detail</p>
          <p>Bank Name: {headerData?.bankname}</p>
          <p>Branch: {headerData?.bankaddress}</p>
          <p>Account Name: {headerData?.accountname}</p>
          <p>Account No. : {headerData?.accountnumber}</p>
          <p>RTGS/NEFT IFSC: {headerData?.rtgs_neft_ifsc}</p>
        </div>
        <div className="col-4 p-2 d-flex flex-column justify-content-between">
          <p className="fw-bold">Signature</p>
          <p className="fw-bold">{headerData?.CompanyFullName}</p>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
      {msg}
    </p>
  );
};

export default TaxInvoice5;
