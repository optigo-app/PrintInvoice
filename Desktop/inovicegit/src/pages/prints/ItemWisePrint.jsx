import React, {useState, useEffect} from "react";
import "../../assets/css/prints/itemwiseprint.css";
import { apiCall, handlePrint, taxGenrator, isObjectEmpty, NumberWithCommas} from "../../GlobalFunctions";
import { usePDF } from "react-to-pdf";
import { ToWords } from 'to-words';
import Loader from "../../components/Loader";

const ItemWisePrint = ({ token, invoiceNo, printName, urls, evn }) => {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const [loader, setLoader] = useState(true);
  const toWords = new ToWords();
  const [json0Data, setjson0Data] = useState({});
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({
    count: 0,
    gwt: 0,
    nwt: 0,
    mamt: 0,
    labourAmt: 0,
    fineAmt: 0,
    totalAmt: 0,
    igst: 0,
    numberToWords: "",
    cgst: 0,
    sgst: 0,
    less: 0,
    dPcs: 0,
    dWt: 0,
    dAmt: 0,
    cPcs: 0,
    cWt: 0,
    cAmt: 0,
  });
  const [taxes, setTaxes] = useState([]);
  const loadData = (data) => {
    // console.log(data);
    setjson0Data(data?.BillPrint_Json[0]);
    let totals = { ...total };
    let arr = [];
    data?.BillPrint_Json1.forEach((e, i) => {
      let findIndex = arr.findIndex(
        (ele, ind) =>
          ele?.Categoryname === e?.Categoryname &&
          ele?.Collectionname === e?.Collectionname &&
          ele?.Wastage === e?.Wastage,
      );
      if (findIndex === -1) {
        let count = 1;
        let obj = { ...e };
        obj.diamondPcs = 0;
        obj.diamondWt = 0;
        obj.diamondAmt = 0;
        obj.diamondRate = 0;
        obj.colorStonePcs = 0;
        obj.colorStoneWt = 0;
        obj.colorStoneAmt = 0;
        obj.colorStoneRate = 0;
        obj.metalPcs = 0;
        obj.metalWt = 0;
        obj.metalAmt = 0;
        obj.metalRate = 0;
        obj.count = count;
        obj.otherAmt = e?.TotalDiamondHandling+e?.OtherCharges+e?.MiscAmount;
        let srJobArr = [];
        srJobArr.push(e?.SrJobno);
        obj.srJobArr = srJobArr;
        arr.push(obj);
      } else {
        arr[findIndex].count += 1;
        arr[findIndex].grosswt += e?.grosswt;
        arr[findIndex].NetWt += e?.NetWt;
        arr[findIndex].MakingAmount += e?.MakingAmount;
        // arr[findIndex].MetalPriceRatio += e?.MetalPriceRatio;
        // arr[findIndex].Wastage += e?.Wastage;
        arr[findIndex].OtherCharges += e?.OtherCharges;
        arr[findIndex].TotalAmount += e?.TotalAmount;
        arr[findIndex].MetalAmount += e?.MetalAmount;
        arr[findIndex].otherAmt += e?.TotalDiamondHandling+e?.OtherCharges+e?.MiscAmount;
        arr[findIndex].srJobArr.push(e?.SrJobno);
      }
    });
    let resultArr = [];
    arr.forEach((e, i) => {
      let obj = { ...e };
      obj.FineWt = 0;
      obj.OtherAmount = 0;
      data?.BillPrint_Json2.forEach((ele, ind) => {
        obj.srJobArr.map((elem, index) => {
          // if (obj?.id === ele?.Hid) {
          // obj.OtherAmount
          if (elem === ele?.StockBarcode) {
            if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
              obj.metalPcs += ele?.Pcs;
              obj.metalWt += ele?.Wt;
              obj.metalAmt += ele?.Amount;
              obj.FineWt += ele?.FineWt;
              // metal
            } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
              // color stone
              obj.colorStonePcs += ele?.Pcs;
              totals.cPcs += ele?.Pcs;
              totals.cWt += ele?.Wt;
              totals.cAmt += ele?.Amount;
              obj.colorStoneWt += ele?.Wt;
              obj.colorStoneAmt += ele?.Amount;
            } else if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
              // diamond
              obj.diamondPcs += ele?.Pcs;
              totals.dPcs += ele?.Pcs;
              totals.dWt += ele?.Wt;
              totals.dAmt += ele?.Amount;
              obj.diamondWt += ele?.Wt;
              obj.diamondAmt += ele?.Amount;
            }
          }
        })
      });
      resultArr.push(obj);
    });
    resultArr.sort((a, b) => {
      const nameA = a.Collectionname.toLowerCase();
      const nameB = b.Collectionname.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }

      if (nameA > nameB) {
        return 1;
      }

      return 0; // names are equal
    });

    resultArr.forEach((e, i) => {
      totals.count += e?.count;
      totals.gwt += e?.grosswt;
      totals.nwt += e?.NetWt;
      totals.mamt += e?.MetalAmount;
      totals.labourAmt += e?.MakingAmount;
      totals.fineAmt += e?.FineWt;
      totals.totalAmt += e?.TotalAmount;
    });
    totals.igst = (totals.totalAmt * data?.BillPrint_Json[0]?.IGST) / 100;
    totals.cgst = (totals.totalAmt * data?.BillPrint_Json[0]?.CGST) / 100;
    totals.sgst = (totals.totalAmt * data?.BillPrint_Json[0]?.SGST) / 100;
    totals.less = data?.BillPrint_Json[0]?.AddLess;
    // totals.totalAmt = totals.totalAmt + totals.cgst + totals.sgst + totals.less;
    // tax
    let taxValue = taxGenrator(data?.BillPrint_Json[0], totals.totalAmt);
    setTaxes(taxValue);
    taxValue.length > 0 && taxValue.forEach((e, i) => {
      totals.totalAmt += +(e?.amount);
    });
    totals.numberToWords = toWords.convert(totals.totalAmt);

    // tax end
    totals.totalAmt += totals.less;
    totals.totalAmt = (totals.totalAmt)?.toFixed(2);
    setTotal(totals);
    setData(resultArr);
  };

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
    };
    sendData();
  }, []);

  return (<>
    {loader ? <Loader /> : msg === "" ? <div className="itemWisePrintfont pad_60_allPrint">
        {/* Print Button */}
        <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 pt-4 portrait_container ">
          {/* <div className="form-check">
                    <input type="button" className="btn_white blue" value="Pdf" onClick={() => toPDF()} />
                </div> */}
          <div className="form-check printLeftitemWise">
            <input
              type="button"
              className="btn_white blue"
              value="Print"
              onClick={(e) => handlePrint(e)}
            />
          </div>
        </div>
        <div
          ref={targetRef}
          className="portrait_container itemWisePrintContainer mt-2"
        >
          {/* Heading */}
          <div className="bgLightPink p-2 border">
            {/* <p className="fw-bold">{atob(printName).toUpperCase()}</p> */}
            <p className="fw-bold">{json0Data?.PrintHeadLabel}</p>
          </div>
          {/* Address */}
          <div className="border-start border-end border-bottom p-2 d-flex justify-content-between">
            <div className="col-6">
              <p className="fw-bold">TO, {json0Data?.customerfirmname}</p>
              <p className="px-2">{json0Data?.customerregion}</p>
              <p className="px-2">
                {json0Data?.customercity}-{json0Data?.PinCode}
              </p>
              <p className="px-2">Phno:-{json0Data?.customermobileno}</p>
            </div>
            <div className="col-3">
              <div className="d-flex">
                <div className="col-6">
                  <p>INVOICE NO</p>
                </div>
                <div className="col-6">
                  <p className="fw-bold">{json0Data?.InvoiceNo}</p>
                </div>
              </div>
              <div className="d-flex">
                <div className="col-6">
                  <p>DATE</p>
                </div>
                <div className="col-6">
                  <p className="fw-bold">{json0Data?.EntryDate}</p>
                </div>
              </div>
              <div className="d-flex">
                <div className="col-6">
                  <p>24K RATE</p>
                </div>
                <div className="col-6">
                  <p className="fw-bold">{json0Data?.MetalRate24K}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Table Heading */}
          <div className="bgLightPink d-flex border-start border-end border-bottom main_pad_item_wise_print">
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'metaltypeItemWisePrint' : 'metaltypeItemWisePrint1'} border-end`}>
              <p className="fw-bold">METAL TYPE</p>
            </div>
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'categoryItemWisePrint' : 'categoryItemWisePrint1'} border-end`}>
              <p className="fw-bold">CATEGORY</p>
            </div>
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'pkgItemWisePrint' : 'pkgItemWisePrint1'} border-end`}>
              <p className="fw-bold">PKG WT</p>
            </div>
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'countItemWisePrint' : 'countItemWisePrint1'} border-end`}>
              <p className="fw-bold">COUNT</p>
            </div>
            {atob(printName).toLowerCase() === "item wise print" && (
              <>
                <div className="dpcsItemWisePrint border-end">
                  <p className="fw-bold">DPCS</p>
                </div>
                <div className="dpcsItemWisePrint border-end">
                  <p className="fw-bold">DWT</p>
                </div>
                <div className="dpcsItemWisePrint border-end">
                  <p className="fw-bold">RATE</p>
                </div>
                <div className="dpcsItemWisePrint border-end">
                  <p className="fw-bold">DAMT</p>
                </div>
                <div className="dpcsItemWisePrint border-end">
                  <p className="fw-bold">CPCS</p>
                </div>
                <div className="dpcsItemWisePrint border-end">
                  <p className="fw-bold">CWT</p>
                </div>
                <div className="dpcsItemWisePrint border-end">
                  <p className="fw-bold">RATE</p>
                </div>
                <div className="dpcsItemWisePrint border-end">
                  <p className="fw-bold">CAMT</p>
                </div>
              </>
            )}
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'gwtItemWisePrint' : 'gwtItemWisePrint1'} border-end`}>
              <p className="fw-bold">GWT</p>
            </div>
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'gwtItemWisePrint' : 'gwtItemWisePrint1'} border-end`}>
              <p className="fw-bold">NWT</p>
            </div>

            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'rateItemWisePrint' : 'rateItemWisePrint1'} border-end`}>
              <p className="fw-bold">RATE</p>
            </div>

            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'mAmtItemWisePrint' : 'mAmtItemWisePrint1'} border-end`}>
              <p className="fw-bold">M AMT</p>
            </div>

            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'otherAmtItemWisePrint' : 'otherAmtItemWisePrint1'} border-end`}>
              <p className="fw-bold">OTHER AMT</p>
            </div>

            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'percentageItemWiseprint' : 'percentageItemWiseprint1'} border-end`}>
              <p className="fw-bold">%</p>
            </div>

            <div className={`wastageItemWisePrint border-end`}>
              <p className="fw-bold">WASTAGE</p>
            </div>
            <div className={`makingItemWisePrint border-end`}>
              <p className="fw-bold">MAKING KG</p>
            </div>
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'labourItemWisePrint' : 'labourItemWisePrint1'} border-end`}>
              <p className="fw-bold">LABOR AMT</p>
            </div>
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'fineAmt' : 'fineAmt1'} border-end`}>
              <p className="fw-bold">FINE</p>
            </div>
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'totalAmt' : 'totalAmt1'}`}>
              <p className="fw-bold">TOTAL AMT</p>
            </div>
          </div>
          {/* Data */}
          {data.length > 0 &&
            data.map((e, i) => {
              return (
                <div className={`d-flex border-start border-end border-bottom ${atob(printName).toLowerCase() === "item wise print" ? 'main_pad_item_wise_print_row' : 'main_pad_item_wise_print_row1'}`} key={i}>
                  <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'metaltypeItemWisePrint' : 'metaltypeItemWisePrint1'} border-end`}>
                    <p className="fw-bold">
                      {e?.MetalType} {e?.MetalPurity}
                    </p>
                  </div>
                  <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'categoryItemWisePrint' : 'categoryItemWisePrint1'} border-end`}>
                    <p className="fw-bold">
                      {e?.Collectionname}-{e?.Categoryname}
                    </p>
                  </div>
                  <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'pkgItemWisePrint' : 'pkgItemWisePrint1'} border-end`}>
                    <p className="fw-bold text-end"></p>
                  </div>
                  <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'countItemWisePrint' : 'countItemWisePrint1'} border-end`}>
                    <p className="fw-bold text-end">{e?.count}</p>
                  </div>
                  {atob(printName).toLowerCase() === "item wise print" && (
                    <>
                      <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">
                          {e?.diamondPcs !== 0 && e?.diamondPcs}
                        </p>
                      </div>
                      <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">
                          {e?.diamondWt !== 0 && (e?.diamondWt).toFixed(3)}
                        </p>
                      </div>
                      <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">
                          {e?.diamondWt !== 0 &&
                            e?.diamondAmt / e?.diamondWt &&
                            (e?.diamondAmt / e?.diamondWt).toFixed(2)}
                        </p>
                      </div>
                      <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">
                          {e?.diamondAmt !== 0 && (e?.diamondAmt).toFixed(3)}
                        </p>
                      </div>
                      <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">
                          {e?.colorStonePcs !== 0 && e?.colorStonePcs}
                        </p>
                      </div>
                      <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">
                          {e?.colorStoneWt !== 0 && (e?.colorStoneWt).toFixed(3)}
                        </p>
                      </div>
                      <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">
                          {e?.colorStoneWt !== 0 &&
                            e?.colorStoneAmt / e?.colorStoneWt &&
                            (e?.colorStoneAmt / e?.colorStoneWt).toFixed(3)}
                        </p>
                      </div>
                      <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">
                          {e?.colorStoneAmt !== 0 &&
                            (e?.colorStoneAmt).toFixed(3)}
                        </p>
                      </div>
                    </>
                  )}
                  <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'gwtItemWisePrint' : 'gwtItemWisePrint1'} border-end`}>
                    <p className="fw-bold text-end">
                      {e?.grosswt !== 0 && (e?.grosswt).toFixed(3)}
                    </p>
                  </div>
                  <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'gwtItemWisePrint' : 'gwtItemWisePrint1'} border-end`}>
                    <p className="fw-bold text-end">
                      {e?.NetWt !== 0 && (e?.NetWt).toFixed(3)}
                    </p>
                  </div>

                  <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'rateItemWisePrint' : 'rateItemWisePrint1'} border-end`}>
                    <p className="fw-bold text-end">
                      {e?.metalWt !== 0 &&
                        e?.MetalAmount / e?.metalWt !== 0 &&
                        (e?.MetalAmount / e?.metalWt).toFixed(2)}
                    </p>
                  </div>

                  <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'mAmtItemWisePrint' : 'mAmtItemWisePrint1'} border-end`}>
                    <p className="fw-bold text-end">
                      {e?.MetalAmount !== 0 && (e?.MetalAmount).toFixed(2)}
                    </p>
                  </div>

                  <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'otherAmtItemWisePrint' : 'otherAmtItemWisePrint1'} border-end`}>
                    <p className="fw-bold text-end">
                      {e?.otherAmt !== 0 && (e?.otherAmt).toFixed(2)}
                    </p>
                  </div>

                  <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'percentageItemWiseprint' : 'percentageItemWiseprint1'} border-end`}>
                    <p className="fw-bold text-end">
                      {e?.MetalPriceRatio !== 0 && <>{atob(printName).toLowerCase() === "item wise print2" ? (e?.MetalPriceRatio + e?.Wastage).toFixed(3) : e?.MetalPriceRatio.toFixed(3)}</>}
                    </p>
                  </div>

                  <div className="wastageItemWisePrint border-end">
                    <p className="fw-bold text-end">
                      {e?.Wastage !== 0 && atob(printName).toLowerCase() === "item wise print2" ? "" : e?.Wastage.toFixed(3)}
                    </p>
                  </div>
                  <div className="makingItemWisePrint border-end">
                    <p className="fw-bold text-end">{NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p>
                  </div>
                  <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'labourItemWisePrint' : 'labourItemWisePrint1'} border-end`}>
                    <p className="fw-bold text-end">
                      {(e?.MakingAmount).toFixed(2)}
                    </p>
                  </div>

                  <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'fineAmt' : 'fineAmt1'} border-end`}>
                    <p className="fw-bold text-end">
                      {e?.FineWt !== 0 && e?.FineWt}
                    </p>
                  </div>
                  <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'totalAmt' : 'totalAmt1'}`}>
                    <p className="fw-bold text-end">
                      {e?.TotalAmount !== 0 && (e?.TotalAmount).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          {/* Tax */}
          <div className={`bgLightPink d-flex border-start border-end border-bottom ${atob(printName).toLowerCase() === "item wise print" ? 'main_pad_item_wise_print_row' : 'main_pad_item_wise_print_row1'}`}>
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'cgstTotalItemWiseRow' : 'cgstTotalItemWiseRow1'}  border-end`}>
              {taxes.length > 0 && taxes.map((e, i) => {
                return <p className="fw-bold text-end pb-1 pe-1" key={i}>{e?.name} @ {e?.per}</p>
              })}
              <p className="fw-bold text-end pb-1 pe-1">LESS @ {json0Data?.AddLess}%</p>
            </div>
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'cgstAmountItemWiseRow' : 'cgstAmountItemWiseRow1'}`}>
              {taxes.length > 0 && taxes.map((e, i) => {
                return <p className="fw-bold text-end pb-1 pb-1" key={i}>{e?.amount}</p>
              })}
              <p className="fw-bold text-end pb-1 pb-1">{(total?.less)?.toFixed(2)}</p>
            </div>
          </div>
          {/* Total */}
          <div className={`d-flex border-start border-end border-bottom ${atob(printName).toLowerCase() === "item wise print" ? 'main_pad_item_wise_print_row' : 'main_pad_item_wise_print_row1'}`}>
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'metaltypeItemWisePrint' : 'metaltypeItemWisePrint1'} border-end d-flex justify-content-center align-items-center`}>
              <p className="fw-bold">Total</p>
            </div>
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'categoryItemWisePrint' : 'categoryItemWisePrint1'} border-end`}>
              <p className="fw-bold"></p>
            </div>
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'pkgItemWisePrint' : 'pkgItemWisePrint1'} border-end`}>
              <p className="fw-bold text-end"></p>
            </div>
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'countItemWisePrint' : 'countItemWisePrint1'} border-end`}>
              <p className="fw-bold text-end">{total.count}</p>
            </div>
            {atob(printName).toLowerCase() === "item wise print" && (
              <>
                <div className="dpcsItemWisePrint border-end">
                  <p className="fw-bold text-end">{total?.dPcs}</p>
                </div>
                <div className="dpcsItemWisePrint border-end">
                  <p className="fw-bold text-end">{(total?.dWt)?.toFixed(3)}</p>
                </div>
                <div className="dpcsItemWisePrint border-end">
                  <p className="fw-bold text-end"></p>
                </div>
                <div className="dpcsItemWisePrint border-end">
                  <p className="fw-bold text-end">{(total?.dAmt)?.toFixed(3)}</p>
                </div>
                <div className="dpcsItemWisePrint border-end">
                  <p className="fw-bold text-end">{total?.cPcs}</p>
                </div>
                <div className="dpcsItemWisePrint border-end">
                  <p className="fw-bold text-end">{(total?.cWt)?.toFixed(3)}</p>
                </div>
                <div className="dpcsItemWisePrint border-end">
                  <p className="fw-bold text-end"></p>
                </div>
                <div className="dpcsItemWisePrint border-end">
                  <p className="fw-bold text-end">{(total?.cAmt)?.toFixed(3)}</p>
                </div>
              </>
            )}
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'gwtItemWisePrint' : 'gwtItemWisePrint1'} border-end`}>
              <p className="fw-bold text-end">{(total?.gwt).toFixed(3)}</p>
            </div>
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'gwtItemWisePrint' : 'gwtItemWisePrint1'} border-end`}>
              <p className="fw-bold text-end">{(total?.nwt).toFixed(3)}</p>
            </div>

            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'rateItemWisePrint' : 'rateItemWisePrint1'} border-end`}>
              <p className="fw-bold text-end"></p>
            </div>

            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'mAmtItemWisePrint' : 'mAmtItemWisePrint1'} border-end`}>
              <p className="fw-bold text-end">{(total?.mamt).toFixed(2)}</p>
            </div>

            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'otherAmtItemWisePrint' : 'otherAmtItemWisePrint1'} border-end`}>
              <p className="fw- text-end"></p>
            </div>

            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'percentageItemWiseprint' : 'percentageItemWiseprint1'} border-end`}>
              <p className="fw-bold text-end"></p>
            </div>

            <div className={`wastageItemWisePrint border-end`}>
              <p className="fw-bold text-end"></p>
            </div>
            <div className={`makingItemWisePrint border-end`}>
              <p className="fw-bold text-end"></p>
            </div>
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'labourItemWisePrint' : 'labourItemWisePrint1'} border-end`}>
              <p className="fw-bold text-end">{(total?.labourAmt).toFixed(2)}</p>
            </div>

            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'fineAmt' : 'fineAmt1'} border-end`}>
              <p className="fw-bold text-end">{(total?.fineAmt).toFixed(3)}</p>
            </div>
            <div className={`${atob(printName).toLowerCase() === "item wise print" ? 'totalAmt' : 'totalAmt1'}`}>
              <p className="fw-bold text-end">{total?.totalAmt}</p>
            </div>
          </div>
          {/* Amount In Words */}
          <div className="d-flex border-start border-end border-bottom p-2">
            <p className="min_width_max">Amount in Words : </p>
            <p className="fw-bold ps-1"> {total?.numberToWords}</p>
          </div>
          <div className="d-flex border-start border-end border-bottom p-2">
            <p className="pe-3">
              Order Due Days : <span className="fw-bold">1</span>
            </p>
            <p>
              Order Due Date :
              <span className="fw-bold">{json0Data?.EntryDate}</span>
            </p>
          </div>
        </div>
      </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
  </>
  );
};

export default ItemWisePrint;
