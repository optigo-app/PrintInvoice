import React, { useState, useEffect } from "react";
import "../../assets/css/prints/jewellaryinvoiceprint.css";
import style from "../../assets/css/prints/jewelleryRetailinvoicePrint3.module.css";
import {
  apiCall,
  CapitalizeWords,
  fixedValues,
  handleImageError,
  isObjectEmpty,
  NumberWithCommas,
  taxGenrator,
} from "../../GlobalFunctions";
import Button from "./../../GlobalFunctions/Button";
import Loader from "../../components/Loader";
import { ToWords } from 'to-words';

const JewelleryRetailInvoicePrint3 = ({ urls, token, invoiceNo, printName, evn }) => {
  const [headerData, setHeaderData] = useState({});
  const [data, setdata] = useState([]);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const toWords = new ToWords();
  const [total, setTotal] = useState({
    gwt: 0,
    stoneWt: 0,
    diaColorWt: 0,
    nwt: 0,
    metalMaking: 0,
    others: 0,
    total: 0,
    discount: 0,
    afterTax: 0,
    netBalAmount: 0
  });
  const [taxes, setTaxes] = useState([]);
  async function loadData(data) {
    try {
      setHeaderData(data?.BillPrint_Json[0]);
      let blankArr = [];
      let totals = { ...total };
      data?.BillPrint_Json1.forEach((e, i) => {
        let obj = { ...e };
        totals.gwt += e?.grosswt;
        totals.nwt += e?.NetWt;
        totals.others += e?.OtherCharges;
        totals.total += e?.TotalAmount;
        totals.discount += e?.DiscountAmt;
        let materials = [];
        let metalMaking = obj?.MetalAmount + obj?.MakingAmount;
        data?.BillPrint_Json2.forEach((ele, ind) => {
          if (e?.SrJobno === ele?.StockBarcode) {
            if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
              materials.unshift(ele)
            };
            if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
              totals.diaColorWt += ele?.Wt;
              let findIndex = materials.findIndex(elem => elem?.MasterManagement_DiamondStoneTypeid === 1);
              if (findIndex === -1) {
                materials.push(ele);
              } else {
                materials[findIndex].Wt += ele?.Wt;
              }
            }
            if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
              totals.diaColorWt += ele?.Wt;
              let findIndex = materials.findIndex(elem => elem?.MasterManagement_DiamondStoneTypeid === 2);
              if (findIndex === -1) {
                materials.push(ele);
              } else {
                materials[findIndex].Wt += ele?.Wt;
              }
            }
            if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
              totals.stoneWt += ele?.Wt;
              let findIndex = materials.findIndex(elem => elem?.MasterManagement_DiamondStoneTypeid === 3);
              if (findIndex === -1) {
                materials.push(ele);
              } else {
                materials[findIndex].Wt += ele?.Wt;
              }
            }
          }
        });
        obj.materials = materials;
        obj.metalMaking = metalMaking;
        blankArr.push(obj);
      });
      let taxValue = taxGenrator(data?.BillPrint_Json[0], totals?.total);
      taxValue.forEach((e, i) => {
        totals.afterTax += +e?.amount;
      });
      totals.afterTax += totals?.total;
      totals.netBalAmount = totals.afterTax - data?.BillPrint_Json[0]?.OldGoldAmount - data?.BillPrint_Json[0]?.CashReceived - data?.BillPrint_Json[0]?.BankReceived;
      setTaxes(taxValue);
      setTotal(totals);
      let resultArr = [];
      blankArr.forEach((e, i) => {
        if (e?.GroupJob !== "") {
          let findIndex = resultArr.findIndex(ele => ele?.GroupJob === e?.GroupJob);
          if (findIndex === -1) {
            resultArr.push(e);
          } else {
            resultArr[findIndex].MakingAmount += e?.MakingAmount;
            resultArr[findIndex].MetalAmount += e?.MetalAmount;
            resultArr[findIndex].OtherCharges += e?.OtherCharges;
            resultArr[findIndex].TotalAmount += e?.TotalAmount;
            resultArr[findIndex].grosswt += e?.grosswt;
            resultArr[findIndex].NetWt += e?.NetWt;
            let arr = [resultArr[findIndex], e];
            let findRecord = arr.find(elem => elem?.SrJobno === e?.GroupJob);
            resultArr[findIndex].SubCategoryname = findRecord?.SubCategoryname;
            resultArr[findIndex].Collectionname = findRecord?.Collectionname;
            resultArr[findIndex].designno = findRecord?.designno;
            resultArr[findIndex].SrJobno = findRecord?.SrJobno;
            resultArr[findIndex].DesignImage = findRecord?.DesignImage;
            e?.materials.forEach((ele, ind) => {
              let arr = [1, 2, 3];
              arr.forEach((element, index) => {
                if (ele?.MasterManagement_DiamondStoneTypeid === element) {
                  let findindexs = resultArr[findIndex].materials.findIndex((elem, index) => elem?.MasterManagement_DiamondStoneTypeid === element);
                  if (findindexs === -1) {
                    resultArr[findIndex].materials.push(ele);
                  } else {
                    resultArr[findIndex].materials[findindexs].Wt += ele?.Wt;
                  }
                }
              });
              if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                let findIndexss = resultArr[findIndex].materials.findIndex((elem, index) => elem?.MasterManagement_DiamondStoneTypeid === 4);
                let findShapenameIndex = findRecord.materials.findIndex(elements => elements?.MasterManagement_DiamondStoneTypeid === 4)
                resultArr[findIndex].materials[findIndexss].ShapeName = findRecord?.materials[findShapenameIndex].ShapeName;
                resultArr[findIndex].materials[findIndexss].QualityName = findRecord?.materials[findShapenameIndex].QualityName;
              }
            })
          }
        } else {
          resultArr.push(e);
        }
      });
      setdata(resultArr);
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  }
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

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <> <div className={`container-fluid ${style?.jewelelryRetailInvoiceContainer}`}>
              <div className="btnpcl"> <Button /> </div>
              <div className=""> <div className="headlineJL w-100 p-2"> <b style={{ fontSize: "15px" }}> {headerData?.PrintHeadLabel} </b> </div>
                <div className="d-flex w-100">
                  <div className="col-10 p-2">
                    <div className="fslhJL">
                      <h5> <b style={{ fontSize: "13px", color: "black" }}> {headerData?.CompanyFullName} </b> </h5>
                    </div>
                    <div className="fslhJL">{headerData?.CompanyAddress}</div>
                    <div className="fslhJL">
                      {headerData?.CompanyAddress2}
                    </div>
                    <div className="fslhJL">
                      {headerData?.CompanyCity}-{headerData?.CompanyPinCode},{" "}
                      {headerData?.CompanyState}({headerData?.CompanyCountry})
                    </div>
                    <div className="fslhJL">
                      T {headerData?.CompanyTellNo} | TOLL FREE {headerData?.CompanyTollFreeNo}
                    </div>
                    <div className="fslhJL">
                      {headerData?.CompanyEmail} |{" "}
                      {headerData?.CompanyWebsite}
                    </div>
                    {/* <div className='fslhpcl3'>{headerData?.Company_VAT_GST_No} | {headerData?.Cust_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-EDJHF236D</div> */}
                    <div className="fslhJL">
                      {headerData?.Company_VAT_GST_No} |{" "}
                      {headerData?.Cust_CST_STATE}-{headerData?.vat_cst_pan}
                    </div>
                  </div>
                  <div className="col-2 p-2">
                    <img
                      src={headerData?.PrintLogo}
                      alt="#"
                      className={`w-100 d-block ms-auto ${style?.imgJewelleryRetailinovicePrint3}`}
                      onError={(e) => handleImageError(e)}
                    />
                  </div>
                </div>
                {/* header data */}
                <div className="d-flex border w-100 no_break">
                  <div className="col-8 p-2 b border-end">
                    <div className="fslhJL">{headerData?.lblBillTo}</div>
                    <div className="fslhJL">
                      <b className="JL13">{headerData?.CustName}</b>
                    </div>
                    {headerData?.customerAddress1?.length > 0 ? (
                      <div className="fslhJL">
                        {headerData?.customerAddress1}
                      </div>
                    ) : (
                      ""
                    )}
                    {headerData?.customerAddress2?.length > 0 ? (
                      <div className="fslhJL">
                        {headerData?.customerAddress2}
                      </div>
                    ) : (
                      ""
                    )}
                    {headerData?.customerAddress3?.length > 0 ? (
                      <div className="fslhJL">
                        {headerData?.customercity}-{headerData?.PinCode}
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="fslhJL">
                      {headerData?.CompanyCountry}
                    </div>
                    <div className="fslhJL">{headerData?.customeremail1}</div>
                    <div className="fslhJL">Phno: {headerData?.customermobileno}</div>
                    <div className="fslhJL">{headerData?.vat_cst_pan}</div>
                    <div className="fslhJL">
                      {headerData?.Cust_CST_STATE}{" "}
                      {headerData?.Cust_CST_STATE_No}
                    </div>
                  </div>
                  <div className="col-4 p-2 position-relative">
                    <div className="d-flex">
                      <div className="col-4">
                        <b className="JL13">INVOICE NO</b>
                      </div>
                      <div className="col-8">
                        {headerData?.InvoiceNo}
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="col-4">
                        <b className="JL13">DATE</b>
                      </div>
                      <div className="col-8">
                        {headerData?.EntryDate}
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="col-4">
                        <b className="JL13">HSN</b>
                      </div>
                      <div className="col-8">
                        {headerData?.HSN_No}
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="col-4">
                        <b className="JL13">AADHAR CARD</b>
                      </div>
                      <div className="col-8">
                        {headerData?.aadharno}
                      </div>
                    </div>
                    <div className="d-flex  position-absolute w-100 pb-2 bottom-0">
                      <div className="col-4">
                        <b className="JL13 fs-6">24K Gold Rate</b>
                      </div>
                      <div className="col-8 fs-6">
                        {NumberWithCommas(headerData?.MetalRate24K, 2)}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Table Heading */}
                <div className="pt-1 no_break">
                  <div className="border d-flex">
                    <div className={`${style?.srNoJewerryRetailInvoicePrint} border-end p-1 d-flex align-items-center justify-content-center`}><p className="fw-bold">Sr#</p></div>
                    <div className={`${style?.productJewerryRetailInvoicePrint} border-end p-1 fw-bold d-flex align-items-center justify-content-center`}><p className="fw-bold">Product Description</p></div>
                    <div className={`${style?.materialJewerryRetailInvoicePrint} border-end`}
                    >
                      <div className="border-bottom">
                        <p className="fw-bold p-1 text-center">Material Description</p>
                      </div>
                      <div className="d-flex">
                        <div className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-center border-end`}><p className="fw-bold p-1">Material</p></div>
                        <div className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-center border-end`}><p className="fw-bold p-1">Carat</p></div>
                        <div className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-center border-end`}><p className="fw-bold p-1">GWT</p></div>
                        <div className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-center border-end p-1 flex-column`}><p className="fw-bold">STONE/</p><p className="fw-bold">DIA Wt.</p></div>
                        <div className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-center`}><p className="fw-bold p-1">NWT</p></div>
                      </div>
                    </div>
                    <div className={`${style?.metalMakingJewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-center flex-column`}>
                      <p className="fw-bold">Metal + Making</p>
                    </div>
                    <div className={`${style?.othersJewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-center`}><p className="fw-bold">Others</p></div>
                    <div className={`${style?.totalJewerryRetailInvoicePrint} d-flex align-items-center justify-content-center`}><p className="fw-bold">Total</p></div>
                  </div>
                </div>
                {/* data */}
                {data.length > 0 && data.map((e, i) => {
                  return <div className="border-start border-end border-bottom d-flex no_break" key={i}>
                    <div className={`${style?.srNoJewerryRetailInvoicePrint} border-end p-1`}><p className="fw-bold">{i + 1}</p></div>
                    <div className={`${style?.productJewerryRetailInvoicePrint} border-end p-1 fw-bold`}>
                      <p className="fw-bold">{e?.SubCategoryname} {e?.Categoryname}</p>
                      <p className="fw-bold">{e?.designno} | {e?.SrJobno}</p>
                      <img src={e?.DesignImage} alt="" onError={handleImageError} lazy='eagar' />
                    </div>
                    <div className={`${style?.materialJewerryRetailInvoicePrint} border-end`}>
                      <div className="d-grid h-100">
                        {e?.materials.length > 0 ? e?.materials.map((ele, ind) => {
                          return <div className={`d-flex ${ind !== e?.materials.length - 1 && 'border-bottom'}`} key={ind}>
                            <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end`}><p className="fw-bold p-1 lh-1">{ele?.MasterManagement_DiamondStoneTypeid === 4 ? ele?.ShapeName : ele?.MasterManagement_DiamondStoneTypeName}</p></div>
                            <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end`}><p className="fw-bold p-1 lh-1">{ele?.MasterManagement_DiamondStoneTypeid === 4 && ele?.QualityName}</p></div>
                            <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end`}><p className="fw-bold p-1 text-end lh-1">{ele?.MasterManagement_DiamondStoneTypeid === 4 && fixedValues(e?.grosswt, 3)}</p></div>
                            <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end p-1 flex-column`}><p className="fw-bold text-end lh-1">{ele?.MasterManagement_DiamondStoneTypeid !== 4 && fixedValues(ele?.Wt, 3)}</p></div>
                            <div className={`${style?.w_20JewerryRetailInvoicePrint} `}><p className="fw-bold p-1 text-end lh-1">{ele?.MasterManagement_DiamondStoneTypeid === 4 && fixedValues(e?.NetWt, 3)}</p></div>
                          </div>
                        }) : <div className="d-flex">
                          <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end`}><p className="fw-bold p-1 lh-1"></p></div>
                          <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end`}><p className="fw-bold p-1 lh-1"></p></div>
                          <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end`}><p className="fw-bold p-1 text-end lh-1"></p></div>
                          <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end p-1 flex-column`}><p className="fw-bold text-end lh-1"></p></div>
                          <div className={`${style?.w_20JewerryRetailInvoicePrint} `}><p className="fw-bold p-1 text-end lh-1"></p></div>
                        </div>}
                      </div>
                    </div>
                    <div className={`${style?.metalMakingJewerryRetailInvoicePrint} border-end flex-column`}>
                      <p className="fw-bold text-end p-1">{NumberWithCommas(e?.metalMaking, 2)}</p>
                    </div>
                    <div className={`${style?.othersJewerryRetailInvoicePrint} border-end`}><p className="fw-bold text-end p-1">{NumberWithCommas(e?.OtherCharges, 2)}</p></div>
                    <div className={`${style?.totalJewerryRetailInvoicePrint}`}><p className="fw-bold text-end p-1">{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
                  </div>
                })}
                {/* total */}
                <div className={`${style?.minHeight20RetailinvoicePrint3} border-start border-end border-bottom d-flex no_break`}>
                  <div className={`${style?.srNoJewerryRetailInvoicePrint} border-end p-1`}><p className="fw-bold"></p></div>
                  <div className={`${style?.productJewerryRetailInvoicePrint} border-end p-1 fw-bold`}>
                    <p className="fw-bold">TOTAL</p>
                  </div>
                  <div className={`${style?.materialJewerryRetailInvoicePrint} border-end d-flex`}>
                    <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end`}><p className="fw-bold p-1 lh-1"></p></div>
                    <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end`}></div>
                    <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end`}> <p className="fw-bold p-1 lh-1 text-end">{fixedValues(total?.gwt, 3)} gm</p> </div>
                    <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end p-1 flex-column`}>
                      <p className="fw-bold p-1 text-end lh-1">{fixedValues(total?.diaColorWt, 3)} Ctw</p>
                      <p className="fw-bold p-1 text-end lh-1">{fixedValues(total?.stoneWt, 3)} gm</p></div>
                    <div className={`${style?.w_20JewerryRetailInvoicePrint} `}><p className="fw-bold p-1 text-end lh-1">{fixedValues(total?.nwt, 3)} gm</p></div>
                  </div>
                  <div className={`${style?.metalMakingJewerryRetailInvoicePrint} border-end flex-column`}>
                    <p className="fw-bold text-end p-1"></p>
                  </div>
                  <div className={`${style?.othersJewerryRetailInvoicePrint} border-end`}><p className="fw-bold text-end p-1">{NumberWithCommas(total?.others, 2)}</p></div>
                  <div className={`${style?.totalJewerryRetailInvoicePrint}`}><p className="fw-bold text-end p-1">{NumberWithCommas(total?.total, 2)}</p></div>
                </div>
                {/* tax */}
                <div className="d-flex border-start border-end border-bottom w-100 no_break">
                  <div className={`d-flex justify-content-between flex-column border-end ${style?.wordsJewellry}`}>
                    <div className={`${style?.wordsJewerryRetailInvoicePrint}p-2 d-flex align-items-center justify-content-center pt-5`}>
                     <div className="p-2 pt-4">
                     <p>In Words Indian Rupees</p>
                      <p className="fw-bold">{toWords.convert(total?.afterTax)}</p>
                     </div>
                    </div>
                    <div className={`${style?.RemarkJewelleryInvoicePrintC} p-2`}>{console.log(headerData)}
                      <div>Old Gold Purchase Description: <div dangerouslySetInnerHTML={{__html: headerData?.Remark}}></div></div>
                    </div>
                  </div>
                  <div className={`${style?.discountJewerryRetailInvoicePrint} d-flex`}>
                    <div className="col-7 border-end">
                      <p className="p-1">Discount</p>
                      <p className="p-1">Total AmT before Tax</p>
                      {taxes.length > 0 && taxes.map((e, i) => {
                        return <p className="p-1" key={i}>{e?.name} @ {e?.per}</p>
                      })}
                      <p className="p-1">Total Amt after Tax</p>
                      <p className="p-1">Old Gold</p>
                      <p className="p-1">Recv. in Cash</p>
                      <p className="p-1">Recv. in Bank</p>
                      <p className="p-1">Net Bal. Amount</p>
                      <p className="fw-bold p-1 border-top">GRAND TOTAL</p>
                    </div>
                    <div className="col-5">
                      <p className="text-end p-1">{NumberWithCommas(total?.discount, 2)}</p>
                      <p className="text-end p-1">{NumberWithCommas(total?.total, 2)}</p>
                      {taxes.length > 0 && taxes.map((e, i) => {
                        return <p className="p-1 text-end" key={i}>{NumberWithCommas(+e?.amount, 2)}</p>
                      })}
                      <p className="p-1 text-end">{NumberWithCommas(total?.afterTax, 2)}</p>
                      <p className="p-1 text-end">{NumberWithCommas(headerData?.OldGoldAmount, 2)}</p>
                      <p className="p-1 text-end">{NumberWithCommas(headerData?.CashReceived, 2)}</p>
                      <p className="p-1 text-end">{NumberWithCommas(headerData?.BankReceived, 2)}</p>
                      <p className="p-1 text-end">{NumberWithCommas(total?.netBalAmount, 2)}</p>
                      <p className="fw-bold text-end p-1 border-top">{NumberWithCommas(total?.afterTax, 2)}</p>
                    </div>
                  </div>
                </div>
                {/* remark */}
                <div className="border-start border-end border-bottom p-2 no_break">
                  <div dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}></div>
                </div>
                {/* bank detail */}
                <div className="border-start border-end border-bottom d-flex no_break">
                  <div className="col-4 p-2 border-end">
                    <p className="fw-bold">Bank Detail</p>
                    <p>Bank name: {headerData?.bankname}</p>
                    <p>Branch: {headerData?.bankaddress}</p>
                    <p>{headerData?.PinCode}</p>
                    <p>Account Name: {headerData?.accountname}</p>
                    <p>Account No: {headerData?.accountnumber}</p>
                    <p>RTGS NEFT IFSC: {headerData?.rtgs_neft_ifsc}</p>
                  </div>
                  <div className="col-4 p-2 border-end d-flex justify-content-between flex-column">
                    <p>Signature</p>
                    <p className="fw-bold">{headerData?.CustName}</p>
                  </div>
                  <div className="col-4 p-2 d-flex justify-content-between flex-column">
                    <p>Signature</p>
                    <p className="fw-bold">{headerData?.accountname}</p>
                  </div>
                </div>
              </div>
            </div>
            </>
          ) : (
            <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
              {msg}
            </p>
          )}
        </>
      )}
    </>
  );
};

export default JewelleryRetailInvoicePrint3;
