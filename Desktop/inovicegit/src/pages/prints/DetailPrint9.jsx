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
  const [data, setData] = useState([]);
  const toWords = new ToWords();
  const [headerData, setHeaderData] = useState({});
  const [footer, setFooter] = useState(null);
  const [header, setHeader] = useState(null);
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
    setData(datas);
    console.log(datas);
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
        <h4 className="fw-bold min_height_title d-flex align-items-center">
          {headerData?.PrintHeadLabel}
        </h4>
        <h4 className="fw-bold min_height_title d-flex align-items-center">
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
                  <p className="fw-bold text-center pad_1">
                    Quality
                  </p>
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
      <div className="d-flex border-start border-end border-bottom">
        <div
          className={`${style?.sr} pad_1 border-end d-flex align-items-center justify-content-center`}
        >
          <p className="fw-bold">1</p>
        </div>
        <div className={`${style?.design} pad_1 border-end`}>
          <div className="d-flex justify-content-between">
            <p>1941</p>
            <div>
              <p>1/16349</p>
              <p>Pure White </p>
            </div>
          </div>
          <img src="" alt="" onError={handleImageError} className="imgWidth" />
          <p className="text-center">Amazon Jewellry</p>
          <p className="text-center">
            <span className="fw-bold">10.560 gm </span>Gross
          </p>
          <p className="text-center">Size:1mm</p>
        </div>
        <div
          className={`${style?.diamond} border-end position-relative ${style?.pad_bot_15}`}
        >
          <div className="d-flex">
            <div className="w_20">
              <p className="pad_1">Tr PD PD</p>
            </div>
            <div className="w_20">
              <p className="pad_1">1mm</p>
            </div>
            <div className="w_20">
              <p className="text-end pad_1">0.25</p>
            </div>
            <div className="w_20">
              <p className="text-end pad_1">100.00</p>
            </div>
            <div className="w_20">
              <p className="text-end pad_1">25.30</p>
            </div>
          </div>
          <div className="d-flex">
            <div className="w_20">
              <p className="text-center pad_1">Tr PD PD</p>
            </div>
            <div className="w_20">
              <p className="text-center pad_1">2mm</p>
            </div>
            <div className="w_20">
              <p className="text-end pad_1">1.32</p>
            </div>
            <div className="w_20">
              <p className="text-end pad_1">200.00</p>
            </div>
            <div className="w_20">
              <p className="text-end pad_1">264.00</p>
            </div>
          </div>
          <div className="d-flex position-absolute bottom-0 left-0 w-100 border-top lightGrey">
            <div className="w_20">
              <p className="text-center pad_1"></p>
            </div>
            <div className="w_20">
              <p className="text-center pad_1"></p>
            </div>
            <div className="w_20">
              <p className="text-end pad_1">1.32</p>
            </div>
            <div className="w_20">
              <p className="text-end pad_1"></p>
            </div>
            <div className="w_20">
              <p className="text-end pad_1">264.00</p>
            </div>
          </div>
        </div>
        <div
          className={`${style?.stone} border-end position-relative ${style?.pad_bot_15}`}
        >
          <div className="d-flex">
            <div className="col-3">
              <p className="pad_1">Tr PD PD</p>
            </div>
            <div className="col-3">
              <p className="pad_1">1mm</p>
            </div>
            <div className="col-3">
              <p className="text-end pad_1">0.25</p>
            </div>
            <div className="col-3">
              <p className="text-end pad_1">100.00</p>
            </div>
          </div>
          <div className="d-flex position-absolute bottom-0 left-0 w-100 border-top lightGrey">
            <div className="col-3">
              <p className="text-center pad_1"></p>
            </div>
            <div className="col-3">
              <p className="text-end pad_1">1.32</p>
            </div>
            <div className="col-3">
              <p className="text-end pad_1"></p>
            </div>
            <div className="col-3">
              <p className="text-end pad_1">264.00</p>
            </div>
          </div>
        </div>
        <div
          className={`${style?.labour} border-end position-relative ${style?.pad_bot_15}`}
        >
          <div className="d-flex">
            <div className="col-6">
              <p className="text-center border-end">200.00</p>
            </div>
            <div className="col-6">
              <p className="text-center">3,554.60 </p>
            </div>
          </div>
          <div className="border-top position-absolute left-0 bottom-0 w-100 lightGrey">
            <p className="text-end pad_1">3,554.60 </p>
          </div>
        </div>
        <div
          className={`${style?.other} border-end position-relative ${style?.pad_bot_15}`}
        >
          <div className="d-flex justify-content-center">
            <p className="w-100 text-end pad_1">3,554.60 </p>
          </div>
          <div className="border-top position-absolute left-0 bottom-0 w-100 lightGrey">
            <p className="text-end pad_1">3,554.60 </p>
          </div>
        </div>
        <div
          className={`${style?.metal} border-end position-relative ${style?.pad_bot_15}`}
        >
          <div className="d-flex">
            <div className="col-2">
              <p className="pad_1">GOLD 18K</p>
            </div>
            <div className="col-2">
              <p className="text-end pad_1">10.560</p>
            </div>
            <div className="col-2">
              <p className="text-end pad_1">8.723</p>
            </div>
            <div className="col-2">
              <p className="text-end pad_1">456.00</p>
            </div>
            <div className="col-2">
              <p className="text-end pad_1">456.00</p>
            </div>
            <div className="col-2">
              <p className="text-end pad_1">3,977.69</p>
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
              <p className="text-end pad_1">1.32</p>
            </div>
            <div className="col-2">
              <p className="text-end pad_1"></p>
            </div>
            <div className="col-2">
              <p className="text-end pad_1">264.00</p>
            </div>
            <div className="col-2">
              <p className="text-end pad_1">264.00</p>
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
              <p className="text-end pad_1">9,388.84</p>
            </div>
          </div>
          <div className="d-flex position-absolute bottom-0 left-0 w-100 border-top lightGrey">
          <div className="col-6 border-end">
              <p className="text-end pad_1"></p>
            </div>
            <div className="col-6">
              <p className="text-end pad_1">9,388.84</p>
            </div>
          </div>
        </div>
      </div>

      {/* table total */}
      <div className="d-flex border-start border-end border-bottom">
        <div className={`${style?.sr} pad_1 lightGrey`}>
          <p className="fw-bold"></p>
        </div>
        <div className={`${style?.design} pad_1 border-end lightGrey`}>
          <p className="fw-bold text-center">TOTAL</p>
        </div>
        <div className={`${style?.diamond} border-end`}>
          <div className="d-flex lightGrey">
            <div className="w_20">
              <p className="pad_1 fw-bold">Tr PD PD</p>
            </div>
            <div className="w_20">
              <p className="pad_1 fw-bold">1mm</p>
            </div>
            <div className="w_20">
              <p className="text-end pad_1 fw-bold">0.25</p>
            </div>
            <div className="w_20">
              <p className="text-end pad_1 fw-bold">100.00</p>
            </div>
            <div className="w_20">
              <p className="text-end pad_1 fw-bold">25.30</p>
            </div>
          </div>
        </div>
        <div className={`${style?.stone} border-end`}>
          <div className="d-flex lightGrey">
            <div className="col-3">
              <p className="pad_1 fw-bold">Tr PD PD</p>
            </div>
            <div className="col-3">
              <p className="pad_1 fw-bold">1mm</p>
            </div>
            <div className="col-3">
              <p className="text-end pad_1 fw-bold">0.25</p>
            </div>
            <div className="col-3">
              <p className="text-end pad_1 fw-bold">100.00</p>
            </div>
          </div>
        </div>
        <div className={`${style?.labour} border-end`}>
          <div className="d-flex lightGrey">
            <div className="col-6">
              <p className="text-center border-end fw-bold">200.00</p>
            </div>
            <div className="col-6">
              <p className="text-center fw-bold">3,554.60 </p>
            </div>
          </div>
        </div>
        <div className={`${style?.other} border-end`}>
          <div className="d-flex justify-content-center lightGrey">
            <p className="w-100 text-end pad_1 fw-bold">3,554.60 </p>
          </div>
        </div>
        <div className={`${style?.metal} border-end`}>
          <div className="d-flex lightGrey">
            <div className="col-2">
              <p className="pad_1 fw-bold">GOLD 18K</p>
            </div>
            <div className="col-2">
              <p className="text-end pad_1 fw-bold">10.560</p>
            </div>
            <div className="col-2">
              <p className="text-end pad_1 fw-bold">8.723</p>
            </div>
            <div className="col-2">
              <p className="text-end pad_1 fw-bold">456.00</p>
            </div>
            <div className="col-2">
              <p className="text-end pad_1 fw-bold">456.00</p>
            </div>
            <div className="col-2">
              <p className="text-end pad_1 fw-bold">3,977.69</p>
            </div>
          </div>
        </div>
        <div className={`${style?.totalAmount}`}>
          <div className="d-flex lightGrey">
            <div className="col-6 border-end">
              <p className="text-end border-end pad_1"></p>
            </div>
            <div className="col-6">
              <p className="text-end pad_1 fw-bold">9,388.84</p>
            </div>
          </div>
        </div>
      </div>

      {/* table taxes */}
      <div className="d-flex border-start border-end border-bottom">
        <div className={`${style?.taxWords}`}>
          <p className="text-end">CGST @ 0.13%</p>
          <p className="text-end">SGST @ 0.13%</p>
          <p className="text-end">Less</p>
          <p className="text-end fw-bold">TOTAL</p>
          <p className="text-end">Recv. in Cash</p>
          <p className="text-end">Recv. in Bank</p>
        </div>
        <div className={`${style?.taxAmount}`}>
          <p className="text-end">53.38</p>
          <p className="text-end">53.38</p>
          <p className="text-end">-0.09</p>
          <p className="text-end fw-bold">41,166.00</p>
          <p className="text-end">0.00</p>
          <p className="text-end">0.00</p>
        </div>
      </div>
  0.000 gm	            GOLD	    21,754.87
  54.380 gm	            DIAMOND	    4,047.36
  52.880 gm	            CST	        660.00
  48.598 gm	            MAKING	    13,349.60
  27.79 cts	            OTHER	    1,247.50
  5.000 cts	            LESS	    -0.09
          {/* table summary */}
          <div className="d-flex">
            <div className="col-4 border-start border-end border-bottom">
                <h4 className="lightGrey pad_1 fw-bold text-center">SUMMARY</h4>
                <div className="d-flex">
                    <div className="col-6 border-end pad_1">
                        <div className="d-flex justify-content-between">
                            <p className="fw-bold">GOLD IN 24KT</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="fw-bold">GROSS WT	</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="fw-bold">*(G+D) WT	</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="fw-bold">NET WT	    </p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="fw-bold">DIAMOND WT	</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="fw-bold">STONE WT	</p>
                        </div>
                    </div>
                    <div className="col-6 pad_1"></div>
                </div>
            </div>
            <div className="col-4 border-start border-end border-bottom"></div>
            <div className="col-4 ps-2">

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
