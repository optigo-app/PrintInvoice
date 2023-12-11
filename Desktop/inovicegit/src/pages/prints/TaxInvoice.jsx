import React, { useState } from "react";
import style from "../../assets/css/prints/taxInvoice.module.css";
import { apiCall, handlePrint, isObjectEmpty } from "../../GlobalFunctions";
import Header from "../../components/Header";
import { useEffect } from "react";
import { HeaderComponent } from "./../../GlobalFunctions";
import Loader from "../../components/Loader";
const TaxInvoice = ({ token, invoiceNo, printName, urls, evn }) => {
  const [image, setimage] = useState(false);
  const [loader, setLoader] = useState(true);
  const [json0Data, setJson0Data] = useState({});
  const [headerComp, setHeaderComp] = useState(null);
  const [msg, setMsg] = useState("");
  const handleChange = (e) => {
    image ? setimage(false) : setimage(true);
  };

  const loadData = (data) => {
    console.log(data);
    setJson0Data(data?.BillPrint_Json[0]);
    let head = HeaderComponent("1", data?.BillPrint_Json[0]);
    setHeaderComp(head);
  }

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn);
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

    <>{
      loader ? <Loader /> : msg === "" ?
        <div className={`container pt-5  ${style.tax_invoice_container} pad_60_allPrint max_width_container`}>
          <div className={`d-flex justify-content-end mb-4 align-items-center ${style?.print_sec_sum4}`}>
            <div className="form-check pe-3">
              <input
                className="form-check-input border-dark"
                type="checkbox"
                checked={image}
                onChange={(e) => handleChange(e)}
              />
              <label className="form-check-label">With Image</label>
            </div>
            <div className="form-check ps-3">
              <input
                type="button"
                className="btn_white blue"
                value="Print"
                onClick={(e) => handlePrint(e)}
              />
            </div>
          </div>
          {headerComp}
          <div className="d-flex border p-2 justify-content-between">
            <div className="col-7">
              <p className={`fw-semibold ${style?.customerFirmName}`}>To, {json0Data?.customerfirmname}</p>
              <p>{json0Data?.customerstreet}</p>
              <p>{json0Data?.customerregion}</p>
              <p>{json0Data?.customercity} -{json0Data?.customerpincode}</p>
              <p>Phno:- {json0Data?.customermobileno}</p>
              <p>{json0Data?.vat_cst_pan} | {json0Data?.Cust_CST_STATE}-{json0Data?.Cust_CST_STATE_No}</p>
            </div>
            <div className="col-5 d-flex flex-column align-items-end">
              <div className="d-flex col-8">
                <div className="col-6"><p className="text-end">INVOICE# :	</p></div>
                <div className="col-6"><p className="text-end">{json0Data?.InvoiceNo}</p></div>
              </div>
              <div className="d-flex col-8">
                <div className="col-6"><p className="text-end">DATE :	</p></div>
                <div className="col-6"><p className="text-end">{json0Data?.DueDate}</p></div>
              </div>
              <div className="d-flex col-8">
                <div className="col-6"><p className="text-end">HSN :	</p></div>
                <div className="col-6"><p className="text-end">{json0Data?.HSN_No}</p></div>
              </div>
            </div>
          </div>
          <div className={`${style?.container}`}>
            {/* table header */}
            <div className="mt-2 d-flex border-top border-start border-end border-black">
              <div className={`${style?.srno} border-end d-flex align-items-center justify-content-center border-bottom`}><p className={`fw-bold ${style?.pad_1}`}>Sr</p></div>
              <div className={`${style?.design} border-end d-flex align-items-center justify-content-center border-bottom`}><p className={`fw-bold ${style?.pad_1}`}>Design</p></div>
              <div className={`${style?.diamond} border-end border-bottom`}>
                <div className="d-grid h-100 w-100">
                  <div className="d-flex border-bottom w-100 justify-content-center"><p className={`fw-bold ${style?.pad_1}`}>Diamond</p></div>
                  <div className="d-flex w-100">
                    <div className="col-2 border-end"><p className={`text-center fw-bold ${style?.pad_1}`}>Code</p></div>
                    <div className="col-2 border-end"><p className={`text-center fw-bold ${style?.pad_1}`}>Size</p></div>
                    <div className="col-2 border-end"><p className={`text-center fw-bold ${style?.pad_1}`}>Pcs</p></div>
                    <div className="col-2 border-end"><p className={`text-center fw-bold ${style?.pad_1}`}>Wt</p></div>
                    <div className="col-2 border-end"><p className={`text-center fw-bold ${style?.pad_1}`}>Rate</p></div>
                    <div className="col-2"><p className={`fw-bold ${style?.pad_1}`}>Amount</p></div>
                  </div>
                </div>
              </div>
              <div className={`${style?.metal} border-end border-bottom`}>
                <div className="d-grid h-100 w-100">
                  <div className="d-flex border-bottom w-100 justify-content-center"><p className={`fw-bold ${style?.pad_1}`}>Metal</p></div>
                  <div className="d-flex w-100">
                    <div className="col-3 border-end"><p className={`text-center fw-bold ${style?.pad_1}`}>Quality</p></div>
                    <div className="col-3 border-end"><p className={`text-center fw-bold ${style?.pad_1}`}>Wt</p></div>
                    <div className="col-3 border-end"><p className={`text-center fw-bold ${style?.pad_1}`}>Rate</p></div>
                    <div className="col-3"><p className={`text-center fw-bold ${style?.pad_1}`}>Amount</p></div>
                  </div>
                </div>
              </div>
              <div className={`${style?.stone} border-end border-bottom`}>
                <div className="d-grid h-100 w-100">
                  <div className="d-flex border-bottom w-100 justify-content-center"><p className={`fw-bold ${style?.pad_1}`}>Stone</p></div>
                  <div className="d-flex w-100">
                    <div className="col-2 border-end"><p className={`text-center fw-bold ${style?.pad_1}`}>Code</p></div>
                    <div className="col-2 border-end"><p className={`text-center fw-bold ${style?.pad_1}`}>Size</p></div>
                    <div className="col-2 border-end"><p className={`text-center fw-bold ${style?.pad_1}`}>Pcs</p></div>
                    <div className="col-2 border-end"><p className={`text-center fw-bold ${style?.pad_1}`}>Wt</p></div>
                    <div className="col-2 border-end"><p className={`text-center fw-bold ${style?.pad_1}`}>Rate</p></div>
                    <div className="col-2"><p className={`fw-bold ${style?.pad_1}`}>Amount</p></div>
                  </div>
                </div>
              </div>
              <div className={`${style?.otherAmount} border-end d-flex align-items-center justify-content-center border-bottom`}><p className={`text-center fw-bold ${style?.pad_1}`}>Other Amount</p></div>
              <div className={`${style?.labourAmount} border-end border-bottom`}>
                <div className="d-grid h-100 w-100">
                  <div className="d-flex border-bottom w-100 justify-content-center"><p className={`fw-bold ${style?.pad_1}`}>Labour</p></div>
                  <div className="d-flex w-100">
                    <div className="col-6 border-end"><p className={`text-center fw-bold ${style?.pad_1}`}>Rate</p></div>
                    <div className="col-6"><p className={`text-center fw-bold ${style?.pad_1}`}>Amount</p></div>
                  </div>
                </div>
              </div>
              <div className={`${style?.totalAmount} d-flex align-items-center justify-content-center border-bottom`}><p className={`text-center fw-bold ${style?.pad_1}`}>Total Amount</p></div>
            </div>
            {/* table data */}
            <div className="d-flex border-start border-end border-black no_break">
              <div className={`${style?.srno} border-end d-flex align-items-center justify-content-center border-bottom`}><p className={`${style?.pad_1}`}>1</p></div>
              <div className={`${style?.design} border-end border-bottom`}>
                <div className="d-flex justify-content-between pb-1 flex-wrap">
                  <p className={`${style?.pad_1}`}>1715</p>
                  <p className={`${style?.pad_1}`}>1/15339</p>
                </div>
                <img src="http://zen/R50B3/UFS/ufs2/orail228FT0OWNGEI6DC3BVS/Design_Image/bD8ZTq6u5WMDE0ODkxMQ==/Red_Thumb/0148911_22112023120600745.jpg" alt="" className="imgWidth" />
                <p>Tunch : <span className="fw-bold">76.000</span></p>
                <p><span className="fw-bold">10.000 gm</span> Gross</p>
              </div>
              <div className={`${style?.diamond} border-end border-bottom`}>
                <div className="d-grid h-100 w-100">
                  <div className="d-flex w-100">
                    <div className="col-2"><p className={`${style?.pad_1}`}>Round vvs mix	</p></div>
                    <div className="col-2"><p className={`${style?.pad_1}`}>1.25MM	</p></div>
                    <div className="col-2"><p className={`${style?.pad_1} text-end`}>5</p></div>
                    <div className="col-2"><p className={`${style?.pad_1} text-end`}>0.080	</p></div>
                    <div className="col-2"><p className={`${style?.pad_1} text-end`}>10,000	</p></div>
                    <div className="col-2"><p className={`${style?.pad_1} text-end`}>6,240.00</p></div>
                  </div>
                </div>
              </div>
              <div className={`${style?.metal} border-end border-bottom`}>
                <div className="d-grid h-100 w-100">
                  <div className="d-flex w-100">
                    <div className="col-3"><p className={`${style?.pad_1}`}>GOLD 18K</p></div>
                    <div className="col-3"><p className={`${style?.pad_1} text-end`}>9.984</p></div>
                    <div className="col-3"><p className={`${style?.pad_1} text-end`}>380.00</p></div>
                    <div className="col-3"><p className={`${style?.pad_1} text-end`}>3,831.92</p></div>
                  </div>
                </div>
              </div>
              <div className={`${style?.stone} border-end border-bottom`}>
                <div className="d-grid h-100 w-100">
                  <div className="d-flex w-100">
                    <div className="col-2"><p className={`${style?.pad_1}`}>heart PD PD</p></div>
                    <div className="col-2"><p className={`${style?.pad_1}`}>1mm</p></div>
                    <div className="col-2"><p className={`${style?.pad_1}`}>1</p></div>
                    <div className="col-2"><p className={`${style?.pad_1}`}>4.000</p></div>
                    <div className="col-2"><p className={`${style?.pad_1}`}>2,000</p></div>
                    <div className="col-2"><p className={`${style?.pad_1}`}>62,400.00</p></div>
                  </div>
                </div>
              </div>
              <div className={`${style?.otherAmount} border-end border-bottom`}><p className={`${style?.pad_1} text-end`}>39.00</p></div>
              <div className={`${style?.labourAmount} border-end border-bottom`}>
                <div className="d-grid h-100 w-100">
                  <div className="d-flex w-100">
                    <div className="col-6"><p className={`${style?.pad_1} text-end`}>150.00	</p></div>
                    <div className="col-6"><p className={`${style?.pad_1} text-end`}>11,681.28</p></div>
                  </div>
                </div>
              </div>
              <div className={`${style?.totalAmount} border-bottom`}><p className={`${style?.pad_1} text-end`}>21,792.20</p></div>
            </div>
            {/* table tax */}
            <div className="d-flex border-start border-end border-black no_break">
              <div className={`${style?.cgst} border-end border-bottom`}>
                <p className={`${style?.pad_1} text-end`}>CGST @ 0.13%	</p>
                <p className={`${style?.pad_1} text-end`}>CGST @ 0.13%	</p>
                <p className={`${style?.pad_1} text-end`}>CGST @ 0.13%	</p>
                <p className={`${style?.pad_1} text-end`}>CGST @ 0.13%	</p>
              </div>
              <div className={`${style?.totalAmount} border-bottom`}>
                <p className={`${style?.pad_1} text-end`}>2,810.19</p>
                <p className={`${style?.pad_1} text-end`}>2,810.19</p>
                <p className={`${style?.pad_1} text-end`}>2,810.19</p>
                <p className={`${style?.pad_1} text-end`}>2,810.19</p>
              </div>
            </div>
            {/* table total */}
            <div className="d-flex border-start border-end border-bottom border-black no_break lightGrey">
              <div className={`${style?.srno} border-end d-flex align-items-center justify-content-center border-bottom`}><p className={`${style?.pad_1}`}></p></div>
              <div className={`${style?.design} border-end border-bottom d-flex align-items-center justify-content-center`}>
                <p className="fw-bold">TOTAL</p>
              </div>
              <div className={`${style?.diamond} border-end border-bottom d-flex`}>
                    <div className="col-2 d-flex align-items-center justify-content-center"><p className={`${style?.pad_1}`}>	</p></div>
                    <div className="col-2 d-flex align-items-center justify-content-center"><p className={`${style?.pad_1}`}>	</p></div>
                    <div className="col-2 d-flex align-items-center justify-content-center"><p className={`${style?.pad_1} text-end`}>10</p></div>
                    <div className="col-2 d-flex align-items-center justify-content-center"><p className={`${style?.pad_1} text-end`}>0.080	</p></div>
                    <div className="col-2 d-flex align-items-center justify-content-center"><p className={`${style?.pad_1} text-end`}>	</p></div>
                    <div className="col-2 d-flex align-items-center justify-content-center"><p className={`${style?.pad_1} text-end`}>6,240.00</p></div>
              </div>
              <div className={`${style?.metal} border-end border-bottom d-flex`}>
                    <div className="col-3 d-flex align-items-center justify-content-center"><p className={`${style?.pad_1}`}>GOLD 18K</p></div>
                    <div className="col-3 d-flex align-items-center justify-content-center"><p className={`${style?.pad_1} text-end`}>9.984</p></div>
                    <div className="col-3 d-flex align-items-center justify-content-center"><p className={`${style?.pad_1} text-end`}>380.00</p></div>
                    <div className="col-3 d-flex align-items-center justify-content-center"><p className={`${style?.pad_1} text-end`}>3,831.92</p></div>
              </div>
              <div className={`${style?.stone} border-end border-bottom d-flex`}>
                    <div className="col-2 d-flex align-items-center justify-content-center"><p className={`${style?.pad_1}`}></p></div>
                    <div className="col-2 d-flex align-items-center justify-content-center"><p className={`${style?.pad_1}`}></p></div>
                    <div className="col-2 d-flex align-items-center justify-content-center"><p className={`${style?.pad_1}`}></p></div>
                    <div className="col-2 d-flex align-items-center justify-content-center"><p className={`${style?.pad_1}`}>4.000</p></div>
                    <div className="col-2 d-flex align-items-center justify-content-center"><p className={`${style?.pad_1}`}>2,000</p></div>
                    <div className="col-2 d-flex align-items-center justify-content-center"><p className={`${style?.pad_1}`}>62,400.00</p></div>
              </div>
              <div className={`${style?.otherAmount} border-end border-bottom`}><p className={`${style?.pad_1} text-end`}>39.00</p></div>
              <div className={`${style?.labourAmount} border-end border-bottom`}>
                <div className="d-grid h-100 w-100">
                  <div className="d-flex w-100">
                    <div className="col-6"><p className={`${style?.pad_1} text-end`}>150.00	</p></div>
                    <div className="col-6"><p className={`${style?.pad_1} text-end`}>11,681.28</p></div>
                  </div>
                </div>
              </div>
              <div className={`${style?.totalAmount} border-bottom`}><p className={`${style?.pad_1} text-end`}>21,792.20</p></div>
            </div>
            {/* table summary */}
            <div className="d-flex border-start border-end border-bottom no_break">
              <div className="col-4 border-end">
                  <div className="lightGrey text-center border-bottom">
                    <p className={`fw-bold ${style?.pad_1}`}>SUMMARY</p>
                    <div className="d-flex">
                      <div className="col-6 border-end">

                      </div>
                      <div className="col-6">

                      </div>
                    </div>
                  </div>
              </div>
              <div className="col-3"></div>
              <div className="col-3"></div>
              <div className="col-2"></div>
            </div>
          </div>
        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    }</>
  );
};

export default TaxInvoice;
