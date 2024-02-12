import React, { useState } from "react";
import style from "../../assets/css/prints/taxInvoice.module.css";
import { NumberWithCommas, apiCall, handleImageError, handlePrint, isObjectEmpty } from "../../GlobalFunctions";
import Header from "../../components/Header";
import { useEffect } from "react";
import { HeaderComponent } from "./../../GlobalFunctions";
import Loader from "../../components/Loader";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { findIndex } from "lodash";
const TaxInvoice = ({ token, invoiceNo, printName, urls, evn }) => {
  const [image, setimage] = useState(false);
  const [loader, setLoader] = useState(true);
  const [json0Data, setJson0Data] = useState({});
  const [headerComp, setHeaderComp] = useState(null);
  const [data, setData] = useState({});
  const [msg, setMsg] = useState("");
  const [diamonds, setDiamonds] = useState([]);
  let [tax, setTax] = useState(0);
  const handleChange = (e) => {
    image ? setimage(false) : setimage(true);
  };
  const [category, setCategory] = useState([]);

  const customSort = (a, b) => {
    if ('others' in a) {
      return 1; // 'a' goes to the end
    } else if ('others' in b) {
      return -1; // 'b' goes to the end
    } else {
      // Alphabetical sorting by shapename, colorname, and qualityname
      return a.ShapeName.localeCompare(b.ShapeName) ||
        a.Colorname.localeCompare(b.Colorname) ||
        a.QualityName.localeCompare(b.QualityName);
    }
  };

  const findOther = (diamondArr, ele) => {
    let findOther = diamondArr.findIndex((elem, index) => elem?.others === "OTHER");
    if (findOther === -1) {
      let obj = { ...ele };
      obj.others = "OTHER";
      diamondArr.push(obj);
    }
    else {
      diamondArr[findOther].Wt += ele?.Wt;
      diamondArr[findOther].Pcs += ele?.Pcs;
    }
    return diamondArr;
  }

  const loadData = (data) => {
    // console.log(data);
    setJson0Data(data?.BillPrint_Json[0]);
    let head = HeaderComponent("1", data?.BillPrint_Json[0]);
    setHeaderComp(head);
    let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
    setData(datas);
    // console.log(datas);
    let diamondArr = [];
    data?.BillPrint_Json2?.forEach((ele, ind) => {
      if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
        let findDiamondArr = findIndex((elem, index) => ele?.ShapeName === "RND" && ele?.QualityName === elem?.QualityName && ele?.Colorname === elem?.ele?.Colorname);
        if (findDiamondArr === -1) {
          if (ele?.ShapeName === "RND") {
            diamondArr.push(ele);
          } else {
            diamondArr = findOther(diamondArr, ele);
            // let findOther = diamondArr.findIndex((elem, index) => elem?.others === "OTHER");
            // if(findOther === -1){
            //   let obj = {...ele};
            //   obj.others = "OTHER";
            //   diamondArr.push(obj);
            // }
            // else{
            //   diamondArr[findOther].Wt += ele?.Wt;
            //   diamondArr[findOther].Pcs += ele?.Pcs;
            // }

          }
        } else {
          if (ele?.ShapeName === "RND") {
            diamondArr[findDiamondArr].Wt += ele?.Wt;
            diamondArr[findDiamondArr].Pcs += ele?.Pcs;
          } else {
            diamondArr = findOther(diamondArr, ele);
            // let findOther = diamondArr.findIndex((elem, index) => elem?.others === "OTHER");
            // if (findOther === -1) {
            //   let obj = { ...ele };
            //   obj.others = "OTHER";
            //   diamondArr.push(obj);
            // }
            // else {
            //   diamondArr[findOther].Wt += ele?.Wt;
            //   diamondArr[findOther].Pcs += ele?.Pcs;
            // }
          }
        }
      }
    });
    const sortedData = diamondArr.sort(customSort);
    setDiamonds(sortedData);
    let taxValue = datas?.allTaxes.reduce((acc, cobj) => acc + +cobj?.amount, 0);
    setTax(taxValue);
    let categoryArr = [];
    data?.BillPrint_Json1?.forEach((e, i) => {
      let findCategory = categoryArr?.findIndex((ele, index) => ele?.Categoryname === e?.Categoryname);
      if (findCategory === -1) {
        categoryArr.push(e);
      } else {
        categoryArr[findCategory].Quantity += e?.Quantity;
      }
    });
    setCategory(categoryArr);
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
        <div className={`container pt-5 px-1s ${style.tax_invoice_container} pad_60_allPrint max_width_container`}>
          <div className={`d-flex justify-content-end mb-4 align-items-center ${style?.print_sec_sum4}`}>
            <div className="form-check pe-3">
              <input
                className="form-check-input border-dark"
                type="checkbox"
                checked={image}
                onChange={(e) => handleChange(e)}
              />
              <label className="form-check-label" style={{paddingTop: "1.5px", minHeight: "unset !important"}}>With Image</label>
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
            {data?.resultArray?.map((e, i) => {
              return <div className={`d-flex border-start border-end border-black no_break ${style?.wordBreak}`} key={i}>
                <div className={`${style?.srno} border-end d-flex align-items-center justify-content-center border-bottom`}><p className={`${style?.pad_1}`}>{i + 1}</p></div>
                <div className={`${style?.design} border-end border-bottom`}>
                  <div className="d-flex justify-content-between pb-1 flex-wrap">
                    <p className={`${style?.pad_1}`}>{e?.designno}</p>
                    <p className={`${style?.pad_1}`}>{e?.SrJobno}</p>
                  </div>
                  <img src={e?.DesignImage} alt="" className="imgWidth" onError={handleImageError} />
                  <p>Tunch : <span className="fw-bold">{NumberWithCommas(e?.Tunch, 3)}</span></p>
                  <p><span className="fw-bold">{NumberWithCommas(e?.grosswt, 3)} gm</span> Gross</p>
                </div>
                <div className={`${style?.diamond} border-end border-bottom`}>
                  <div className="d-flex justify-content-between flex-column h-100">
                    <div>
                      {e?.diamonds?.map((ele, ind) => {
                        return <div className="d-flex w-100" key={ind}>
                          <div className="col-2"><p className={`${style?.pad_1}`}>{ele?.ShapeName} {ele?.QualityName} {ele?.Colorname}	</p></div>
                          <div className="col-2"><p className={`${style?.pad_1}`}>{ele?.Size}	</p></div>
                          <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(ele?.Pcs, 0)}</p></div>
                          <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(ele?.Wt, 3)}	</p></div>
                          <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(ele?.Rate, 2)}	</p></div>
                          <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(ele?.Amount, 2)}</p></div>
                        </div>
                      })}
                    </div>
                    <div className="d-flex w-100 border-top">
                      <div className="col-2"><p className={`${style?.pad_1}`}>	</p></div>
                      <div className="col-2"><p className={`${style?.pad_1}`}>	</p></div>
                      <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(e?.totals?.diamonds?.Pcs, 0)}</p></div>
                      <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}</p></div>
                      <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(e?.totals?.diamonds?.Rate, 2)}</p></div>
                      <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(e?.totals?.diamonds?.Amount, 2)}</p></div>
                    </div>
                  </div>
                </div>
                <div className={`${style?.metal} border-end border-bottom`}>
                  <div className="d-flex justify-content-between flex-column h-100">
                    <div>
                      {e?.metal?.map((ele, ind) => {
                        return <div className="d-flex w-100" key={ind}>
                          <div className="col-3"><p className={`${style?.pad_1}`}>{ele?.ShapeName} {ele?.QualityName}</p></div>
                          <div className="col-3"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(ele?.Wt, 3)}</p></div>
                          <div className="col-3"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(ele?.Rate, 2)}</p></div>
                          <div className="col-3"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(ele?.Amount, 2)}</p></div>
                        </div>
                      })}
                    </div>
                    <div className="d-flex w-100 border-top" >
                      <div className="col-3"><p className={`${style?.pad_1}`}></p></div>
                      <div className="col-3"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(e?.totals?.metal?.Wt, 3)}</p></div>
                      <div className="col-3"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(e?.totals?.metal?.Rate, 2)}</p></div>
                      <div className="col-3"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(e?.totals?.metal?.Amount, 2)}</p></div>
                    </div>
                  </div>
                </div>
                <div className={`${style?.stone} border-end border-bottom`}>
                  <div className="d-flex justify-content-between flex-column h-100">
                    <div>
                      {e?.colorstone?.map((ele, ind) => {
                        return <div className="d-flex w-100" key={ind}>
                          <div className="col-2"><p className={`${style?.pad_1}`}>{ele?.ShapeName} {ele?.QualityName} {ele?.Colorname}</p></div>
                          <div className="col-2"><p className={`${style?.pad_1}`}>{ele?.Size}</p></div>
                          <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(ele?.Pcs, 0)}</p></div>
                          <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(ele?.Wt, 3)}</p></div>
                          <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(ele?.Rate, 2)}</p></div>
                          <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(ele?.Amount, 2)}</p></div>
                        </div>
                      })}
                    </div>
                    <div>
                      <div className="d-flex w-100 border-top" >
                        <div className="col-2"><p className={`${style?.pad_1}`}></p></div>
                        <div className="col-2"><p className={`${style?.pad_1}`}></p></div>
                        <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(e?.totals?.colorstone?.Pcs, 0)}</p></div>
                        <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(e?.totals?.colorstone?.Wt, 3)}</p></div>
                        <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(e?.totals?.colorstone?.Rate, 2)}</p></div>
                        <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(e?.totals?.colorstone?.Amount, 2)}</p></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${style?.otherAmount} border-end border-bottom`}>
                  <div className="d-flex flex-column justify-content-between h-100">
                    <p className={`${style?.pad_1} text-end`}>{NumberWithCommas(e?.OtherCharges + e?.MiscAmount, 2)}</p>
                    <p className={`${style?.pad_1} text-end border-top`}>{NumberWithCommas(e?.OtherCharges + e?.MiscAmount, 2)}</p>
                  </div>
                </div>
                <div className={`${style?.labourAmount} border-end border-bottom`}>
                  <div className="d-flex flex-column justify-content-between h-100">
                    <div>
                      <div className="d-flex w-100">
                        <div className="col-6"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(e?.MaKingCharge_Unit, 2)}	</p></div>
                        <div className="col-6"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(e?.MakingAmount, 2)}</p></div>
                      </div>
                    </div>
                    <div className="d-flex w-100 border-top">
                      <div className="col-6"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(e?.MaKingCharge_Unit, 2)}	</p></div>
                      <div className="col-6"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(e?.MakingAmount, 2)}</p></div>
                    </div>
                  </div>
                </div>
                <div className={`${style?.totalAmount} border-bottom`}>
                  <div className="d-flex flex-column justify-content-between h-100">
                    <div>
                      <p className={`${style?.pad_1} text-end`}>{NumberWithCommas(e?.TotalAmount, 2)}</p>
                    </div>
                    <div className="border-top">
                      <p className={`${style?.pad_1} text-end`}>{NumberWithCommas(e?.TotalAmount, 2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            })}
            {/* table tax */}
            <div className="d-flex border-start border-end border-black no_break">
              <div className={`${style?.cgst} border-end border-bottom`}>
                {data?.allTaxes?.map((e, i) => {
                  return <p className={`${style?.pad_1} text-end`} key={i}>{e?.name} @ {e?.per}	</p>
                })}
              </div>
              <div className={`${style?.totalAmount} border-bottom`}>
                {data?.allTaxes?.map((e, i) => {
                  return <p className={`${style?.pad_1} text-end`} key={i}>{NumberWithCommas(e?.amount, 2)}</p>
                })}
              </div>
            </div>
            {/* table total */}
            <div className="d-flex border-start border-end border-black no_break lightGrey">
              <div className={`${style?.srno} border-end d-flex align-items-center justify-content-center border-bottom`}><p className={`${style?.pad_1}`}></p></div>
              <div className={`${style?.design} border-end border-bottom d-flex align-items-center justify-content-center`}>
                <p className="fw-bold">TOTAL</p>
              </div>
              <div className={`${style?.diamond} border-end border-bottom d-flex`}>
                <div className="col-2"><p className={`${style?.pad_1}`}>	</p></div>
                <div className="col-2"><p className={`${style?.pad_1}`}>	</p></div>
                <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(data?.mainTotal?.diamonds?.Pcs, 0)}</p></div>
                <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)}</p></div>
                <div className="col-2"><p className={`${style?.pad_1} text-end`}></p></div>
                <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(data?.mainTotal?.diamonds?.Amount, 2)}</p></div>
              </div>
              <div className={`${style?.metal} border-end border-bottom d-flex`}>
                <div className="col-3"><p className={`${style?.pad_1}`}></p></div>
                <div className="col-3"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(data?.mainTotal?.metal?.Pcs, 0)}</p></div>
                <div className="col-3"><p className={`${style?.pad_1} text-end`}></p></div>
                <div className="col-3"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(data?.mainTotal?.metal?.Amount, 2)}</p></div>
              </div>
              <div className={`${style?.stone} border-end border-bottom d-flex`}>
                <div className="col-2"><p className={`${style?.pad_1} text-end`}></p></div>
                <div className="col-2"><p className={`${style?.pad_1} text-end`}></p></div>
                <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(data?.mainTotal?.colorstone?.Pcs, 0)}</p></div>
                <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)}</p></div>
                <div className="col-2"><p className={`${style?.pad_1} text-end`}></p></div>
                <div className="col-2"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(data?.mainTotal?.colorstone?.Amount, 2)}</p></div>
              </div>
              <div className={`${style?.otherAmount} border-end border-bottom`}><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(data?.mainTotal?.total_other_charges + data?.mainTotal?.totalMiscAmount, 2)}</p></div>
              <div className={`${style?.labourAmount} border-end border-bottom`}>
                <div className="d-grid h-100 w-100">
                  <div className="d-flex w-100">
                    <div className="col-6"><p className={`${style?.pad_1} text-end`}></p></div>
                    <div className="col-6"><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(data?.mainTotal?.total_Making_Amount, 2)}</p></div>
                  </div>
                </div>
              </div>
              <div className={`${style?.totalAmount} border-bottom`}><p className={`${style?.pad_1} text-end`}>{NumberWithCommas(data?.finalAmount, 2)}</p></div>
            </div>
            {/* table summary */}
            <div className="d-flex border-start no_break">
              <div className="col-4 border-end">
                <div className=" text-center border-bottom border-end">
                  <p className={`lightGrey fw-bold border-bottom ${style?.pad_1}`}>SUMMARY</p>
                  <div className="d-flex">
                    <div className="col-6 border-end px-1">
                      <div className="d-flex justify-content-between">
                        <div>GROSS WT	</div>
                        <div className="text-end">{NumberWithCommas(data?.mainTotal?.grosswt, 3)} gm	</div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>WT	</div>
                        <div className="text-end">{NumberWithCommas(data?.mainTotal?.metal?.Wt, 3)} gm	</div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div> DIAMOND WT	</div>
                        <div className="text-end">{NumberWithCommas(data?.mainTotal?.diamonds?.Pcs, 0)} / {NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)} cts	</div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>STONE WT	</div>
                        <div className="text-end">{NumberWithCommas(data?.mainTotal?.colorstone?.Pcs, 0)} / {NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)} cts		</div>
                      </div>
                    </div>
                    <div className="col-6 px-1">
                      <div className="d-flex justify-content-between">
                        <div>GOLD	</div>
                        <div className="text-end">{NumberWithCommas(data?.mainTotal?.metal?.Amount, 2)} </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>DIAMOND	</div>
                        <div className="text-end">{NumberWithCommas(data?.mainTotal?.diamonds?.Amount, 2)} </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>CST	</div>
                        <div className="text-end">{NumberWithCommas(data?.mainTotal?.colorstone?.Amount, 2)} </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>MAKING	</div>
                        <div className="text-end">{NumberWithCommas(data?.mainTotal?.total_Making_Amount, 2)} </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>OTHER	</div>
                        <div className="text-end">{NumberWithCommas(data?.mainTotal?.metal?.Amount, 2)} 	</div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>TAX	</div>
                        <div className="text-end"> 	{NumberWithCommas(tax, 2)}		</div>
                      </div>
                      {json0Data?.AddLess !== 0 && <div className="d-flex justify-content-between">
                        <div>{json0Data?.AddLess < 0 ? "LESS" : "ADD"}	</div>
                        <div className="text-end">{NumberWithCommas(json0Data?.AddLess, 2)}	</div>
                      </div>}
                      <div className="d-flex justify-content-between">
                        <div>TOTAL	</div>
                        <div className="text-end">{NumberWithCommas(data?.finalAmount, 2)}	</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" col-2 border-end border-start border-bottom">
                <p className={`lightGrey fw-bold ${style?.pad_1} text-center border-bottom`}>Diamond Detail </p>
                {diamonds.map((e, i) => {
                  return <div key={i} className="d-flex justify-content-between px-1">
                    <p>{e?.others ? "OTHER" : <>{e?.ShapeName} {e?.QualityName} {e?.Colorname}</>}</p>
                    <p>{NumberWithCommas(e?.Pcs, 0)} / {NumberWithCommas(e?.Wt, 3)} Cts</p>
                  </div>
                })
                }
              </div>
              <div className="col-3 border-bottom border-end border-start">
                <p className={`fw-bold ${style?.pad_1} text-center border-bottom p-1`}>Summary Detail </p>
                {category.map((e, i) => {
                  return <div className="d-flex justify-content-between px-1" key={i}>
                    <p>{e?.Categoryname}</p>
                    <p>{NumberWithCommas(e?.Quantity, 0)}</p>
                  </div>
                })}
              </div>
              <div className="col-2 border-bottom border-end border-start">
                <p className={`fw-bold ${style?.pad_1} text-center border-bottom`}>Remark </p>
                <p className="px-1">{json0Data?.PrintRemark}</p>
              </div>
            </div>
            {/* note */}
            <div className="border my-2 no_break">
              <p className="fw-bold pt-2 px-2" style={{ fontSize: "13px" }}> NOTE :</p>
              <div className="p-2" dangerouslySetInnerHTML={{ __html: json0Data?.Declaration }}></div>
            </div>
            {/* signature */}
            <div className="border my-2 no_break d-flex">
              <div className="text-center pt-5 w-50 border-end fw-bold">RECEIVER'S SIGNATURE & SEAL	</div>
              <div className="text-center pt-5 w-50 fw-bold">for, ORAIL SERVICE</div>
            </div>
            <p className="text-secondary">**   THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF TRANSACTIONS</p>
          </div>
        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    }</>
  );
};

export default TaxInvoice;
