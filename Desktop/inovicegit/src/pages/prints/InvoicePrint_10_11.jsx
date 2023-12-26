import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import style from "../../assets/css/prints/InvoicePrint_10_11.module.css";
import {
  FooterComponent,
  HeaderComponent,
  apiCall,
  handlePrint,
  isObjectEmpty,
} from "../../GlobalFunctions";
import BarcodePrintGenerator from "../../components/barcodes/BarcodePrintGenerator";

const InvoicePrint_10_11 = ({ token, invoiceNo, printName, urls, evn }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [header, setHeader] = useState(null);
  const [footer, setFooter] = useState(null);
  const [headerData, setHeaderData] = useState({});
  const [customerAddress, setCustomerAddress] = useState([]);

  const loadData = (data) => {
    console.log(data);
    let head = HeaderComponent("1", data?.BillPrint_Json[0]);
    setHeader(head);
    setHeaderData(data?.BillPrint_Json[0]);
    let footers = FooterComponent("2", data?.BillPrint_Json[0]);
    setFooter(footers);
    let custAddress = data?.BillPrint_Json[0]?.Printlable.split("\n");
    setCustomerAddress(custAddress);
    let resultArr = [];
    let diamond = {
      Wt: 0,
      Pcs: 0,
      Amount: 0,
      title: "DIAMOND",
    };

    let colorStone = {
      Wt: 0,
      Pcs: 0,
      Amount: 0,
      title: "COLOR STONE",
    };

    let miscs = {
      Wt: 0,
      Pcs: 0,
      Amount: 0,
      title: "MISCS",
    };

    data.BillPrint_Json1.forEach((e, i) => {
      let obj = { ...e };
      if (obj?.GroupJob === "") {
        let metalRate = 0;
        data?.BillPrint_Json2.forEach((ele, ind) => {
          if (ele?.StockBarcode === e?.SrJobno) {
            if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
              metalRate += ele?.Amount / ele?.Wt;
            } else if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
              diamond.Wt += ele?.Wt;
              diamond.Pcs += ele?.Pcs;
              diamond.Amount += ele?.Amount;
            } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
              colorStone.Wt += ele?.Wt;
              colorStone.Pcs += ele?.Pcs;
              colorStone.Amount += ele?.Amount;
            } else if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
              miscs.Wt += ele?.Wt;
              miscs.Pcs += ele?.Pcs;
              miscs.Amount += ele?.Amount;
            }
          }
        });
      }
    });

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
      className={`container container-fluid max_width_container mt-1 ${style?.InvoicePrint_10_11} pad_60_allPrint`}
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
      {/* header */}
      {header}

      {/* barcodes */}
      <div className="my-1">
        <div className="d-flex justify-content-between border p-2 pb-1">
          <div className={`${style?.barcode}`}>
            <BarcodePrintGenerator data={headerData?.InvoiceNo} />
            <p className="fw-bold text-center">{headerData?.InvoiceNo}</p>
          </div>
          <div className={`${style?.barcode}`}>
            <BarcodePrintGenerator data={headerData?.InvoiceNo} />
            <p className="fw-bold text-center">{headerData?.InvoiceNo}</p>
          </div>
        </div>
      </div>

      <div className="border d-flex">
        <div className="col-4 px-2 border-end">
          <p>{headerData?.lblBillTo}</p>
          <p className="fw-bold pe-2">{headerData?.customerfirmname}</p>
          <p>{headerData?.customerAddress1}</p>
          <p>{headerData?.customerAddress2}</p>
          <p>
            {headerData?.customercity1}
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
            <div className="fw-bold col-6">HSN</div>
            <div className="col-6">{headerData?.HSN_No} </div>
          </div>
          <div className="d-flex">
            <div className="fw-bold col-6">NAME OF GOODS</div>
            <div className="col-6">Jewellery </div>
          </div>
          <div className="d-flex">
            <div className="fw-bold col-6">PLACE OF SUPPLY</div>
            <div className="col-6">{headerData?.State} </div>
          </div>
          <div className="d-flex">
            <div className="fw-bold col-6">TERMS</div>
            <div className="col-6">0 </div>
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
              <div className="fw-bold col-2 px-1">Detail</div>
              <div className="fw-bold col-2 px-1 text-end">Gross Wt. </div>
              <div className="fw-bold col-2 px-1 text-end">Net Wt. </div>
              <div className="fw-bold col-1 px-1 text-end">Pcs </div>
              <div className="fw-bold col-1 px-1 text-end">Qty </div>
              <div className="fw-bold col-2 px-1 text-end">Rate </div>
              <div className="fw-bold col-2 px-1 text-end">Amount</div>
            </div>
          </div>
        </div>
        <div className="d-flex border-start border-end border-bottom">
          <div className="col-3 border-end d-flex align-items-center justify-content-center flex-column">
            <p>DIAMOND STUDDED JEWELLERY</p>
            <p className="fw-bold">Total Pcs : 1</p>
          </div>
          <div className="col-9">
            <div className="d-flex border-bottom">
              <div className="col-2 px-1">
                <p className={`${style?.min_height_21}`}>GOLD 18K</p>
                <p className={`${style?.min_height_21}`}>DIAMOND</p>
                <p className={`${style?.min_height_21}`}>LABOUR</p>
                <p className={`${style?.min_height_21}`}>OTHER</p>
                <p className={`${style?.min_height_21}`}>HANDLING </p>
              </div>
              <div className="col-2 px-1">
                <p className={`${style?.min_height_21} text-end`}>
                  34.000 Gms{" "}
                </p>
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
              </div>
              <div className="col-2 px-1">
                <p className={`${style?.min_height_21} text-end`}>
                  31.790 Gms{" "}
                </p>
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
              </div>
              <div className="col-1 px-1">
                <p className={`${style?.min_height_21} text-end`}> </p>
                <p className={`${style?.min_height_21} text-end`}>5</p>
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
              </div>

              <div className="col-1 px-1">
                <p className={`${style?.min_height_21} text-end`}> </p>
                <p className={`${style?.min_height_21} text-end`}>16.500 Ctw</p>
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
              </div>
              <div className="col-2 px-1">
                <p className={`${style?.min_height_21} text-end`}>456.00 </p>
                <p className={`${style?.min_height_21} text-end`}>
                  133.33 / Wt
                </p>
                <p className={`${style?.min_height_21} text-end`}>200.00</p>
                <p className={`${style?.min_height_21} text-end`}></p>
                <p className={`${style?.min_height_21} text-end`}></p>
              </div>
              <div className="col-2 px-1">
                <p className={`${style?.min_height_21} text-end`}>14,496.24</p>
                <p className={`${style?.min_height_21} text-end`}>2,200.00</p>
                <p className={`${style?.min_height_21} text-end`}>9,958.00</p>
                <p className={`${style?.min_height_21} text-end`}>50.00</p>
                <p className={`${style?.min_height_21} text-end`}>8,250.00</p>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex border-start border-end border-bottom mb-1">
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
                  14,496.24
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex border">
          <div className="col-8 border-end"></div>
          <div className="col-4 px-1">
            <div className="d-flex justify-content-between">
              <p>IGST @ 0.25%</p>
              <p>87.39</p>
            </div>
            <div className="d-flex justify-content-between">
              <p>Less</p>
              <p>-0.12</p>
            </div>
          </div>
        </div>
        <div className="d-flex border-start border-end border-bottom">
          <div className="col-8 border-end px-1">
            <p className="fw-bold"> IN Words Indian Rupees</p>
            <p className="fw-bold">
              Thirty-Five Thousand and Forty-One Point Fifty-One Only.
            </p>
          </div>
          <div className="col-4 px-1 d-flex justify-content-between align-items-center">
            <p className="text-end fw-bold">Grand Total </p>
            <p className="text-end fw-bold">35,041.51</p>
          </div>
        </div>
        <div
          className=" border-start border-end border-bottom p-1"
          dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}
        ></div>
        <p className="p-1">
          <span className="fw-bold"> REMARKS :</span> Tax invoice 1 Print
        </p>
        {footer}
      </div>
    </div>
  ) : (
    <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
      {msg}
    </p>
  );
};

export default InvoicePrint_10_11;
