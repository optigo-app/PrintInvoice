import React, { useEffect, useState } from "react";
import convertor from "number-to-words";
import "../../assets/css/prints/taxInvoice1.css";
import {
  CapitalizeWords,
  NumberWithCommas,
  ReceiveInBank,
  apiCall,
  fixedValues,
  handleImageError,
  handlePrint,
  isObjectEmpty,
  taxGenrator,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import { ToWords } from "to-words";

const TaxInvoice1 = ({ urls, token, invoiceNo, printName, evn }) => {
  const [image, setimage] = useState(false);
  const [BillPrint_Json, setBillPrint_Json] = useState({});
  const [BillPrint_Jso1, setBillPrint_Json1] = useState([]);
  const [BillPrint_Json2, setBillPrint_Json2] = useState([]);
  const [resultArr, setResultArr] = useState([]);
  const [totalAmount, setTotalAmount] = useState({});
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const toWords = new ToWords();
  const [taxes, setTaxes] = useState([]);
  const [bank, setBank] = useState([]);

  const handleChange = (e) => {
    image ? setimage(false) : setimage(true);
  };

  const findMaterials = (json2, json1, json0) => {
    const groupedObjects = {};
    json2.forEach((item) => {
      if (json1.some((srItem) => srItem.SrJobno === item.StockBarcode)) {
        if (!groupedObjects[item.StockBarcode]) {
          groupedObjects[item.StockBarcode] = [];
        }
        groupedObjects[item.StockBarcode].push(item);
      }
    });
    const resultArray = Object.keys(groupedObjects).map((key) => ({
      SrjobNo: key,
      data: groupedObjects[key],
    }));

    let arrResult = [];
    resultArray.forEach((e, i) => {
      const mergedArray = e.data.reduce((result, current) => {
        const existingItem = result.find(
          (item) =>
            item.Rate === current.Rate && item.ShapeName === current.ShapeName
        );
        if (existingItem) {
          existingItem.gwt += current.gwt;
          existingItem.cst += current.cst;
          existingItem.Rate += current.Rate;
          existingItem.Amount += current.Amount;
        } else {
          result.push({ ...current });
        }

        return result;
      }, []);
      arrResult.push({ jobNo: e.SrjobNo, data: mergedArray });
    });
    let finalArr = [];
    let totalobj = {
      TotalAmount: 0,
      totalOtherAmount: 0,
      netWeight: 0,
      diaWt: 0,
      gwt: 0,
      discountAmt: 0,
      weightInGram: 0,
      UnitCost: 0,
    };
    json1.forEach((e, i) => {
      // totalobj.totalOtherAmount += e?.MetalAmount + e?.OtherCharges;
      arrResult.forEach((ele, ind) => {
        if (e.SrJobno === ele.jobNo) {
          // let totalAmount = 0;
          let arr = [];
          ele.data.forEach((element, index) => {
            let obj = { ...element };
            if (element.MasterManagement_DiamondStoneTypeid === 4) {
              obj.materialCharges = 0;
            } else {
              // obj.materialCharges = +((obj.Rate * obj.Wt).toFixed(2));
              obj.materialCharges = obj?.Amount;
              // totalobj.totalOtherAmount += obj.materialCharges;
            }
            arr.push(obj);
            // totalobj.TotalAmount += element.Amount;
            if (
              element?.MasterManagement_DiamondStoneTypeid !== 4 &&
              element?.MasterManagement_DiamondStoneTypeid !== 3 &&
              element?.MasterManagement_DiamondStoneTypeid !== 5
            ) {
              totalobj.diaWt += element.Wt;
            }
            if (element?.MasterManagement_DiamondStoneTypeid === 3) {
              totalobj.weightInGram += element.Wt;
            }
          });
          // finalArr.push({ jobNo: e.SrJobno, data: arr, mainData: e, totalAmount: totalAmount });
          finalArr.push({ jobNo: e.SrJobno, data: arr, mainData: e });
        }
      });
      totalobj.TotalAmount += e?.TotalAmount;
      totalobj.UnitCost += e?.UnitCost;
      // totalobj.totalOtherAmount += e?.OtherCharges;
      totalobj.netWeight += e?.NetWt + e?.LossWt;
      totalobj.gwt += e?.grosswt;
      totalobj.discountAmt += e?.DiscountAmt;
    });
    totalobj.cgstTax = +((json0[0].CGST / 100) * +totalobj.TotalAmount).toFixed(
      2
    );
    totalobj.sgstTax = +((json0[0].SGST / 100) * +totalobj.TotalAmount).toFixed(
      2
    );
    totalobj.TotalAmount = +totalobj.TotalAmount.toFixed(2);
    // totalobj.totalOtherAmount = +totalobj.totalOtherAmount.toFixed(2);
    // totalobj.totalAmountAfterTax = +((totalobj.TotalAmount + totalobj.cgstTax + totalobj.sgstTax - totalobj.discountAmt).toFixed(2));

    // tax
    totalobj.totalAmountAfterTax = 0;
    let taxValue = taxGenrator(json0[0], totalobj.TotalAmount);
    setTaxes(taxValue);
    taxValue.forEach((e, i) => {
      totalobj.totalAmountAfterTax += +e?.amount;
    });
    totalobj.totalAmountAfterTax +=
      json0[0].AddLess - totalobj.discountAmt + totalobj.TotalAmount;
    totalobj.totalAmountAfterTax = totalobj.totalAmountAfterTax.toFixed(2);
    // tax end

    totalobj.gwt = +totalobj.gwt.toFixed(2);
    totalobj.discountAmt = +totalobj.discountAmt.toFixed(2);
    let debitCardinfo = ReceiveInBank(json0[0]?.BankPayDet);
    setBank(debitCardinfo);
    // totalobj.netBalanceAmount = +((totalobj.totalAmountAfterTax - json0[0].OldGoldAmount - json0[0].AdvanceAmount - json0[0].CashReceived - json0[0].BankReceived).toFixed(2));
    totalobj.netBalanceAmount = +(
      totalobj.totalAmountAfterTax -
      json0[0].OldGoldAmount -
      json0[0].AdvanceAmount -
      json0[0].CashReceived
    );
    debitCardinfo.length > 0 &&
      debitCardinfo.forEach((e, i) => {
        totalobj.netBalanceAmount -= e?.amount;
      });
    // totalobj.textnumber = CapitalizeWords(convertor.toWords(Math.round(totalobj.netBalanceAmount)));
    totalobj.textnumber =
      toWords.convert(+totalobj.netBalanceAmount?.toFixed(2)) + " Only";

 
    setResultArr(finalArr);

    let semiFinalArr = [];

    finalArr.forEach((e, i) => {
      let obj = { ...e };
      if (obj?.mainData?.GroupJob === "") {
        let findMetals = obj.data?.findIndex(
          (ele, ind) => ele?.MasterManagement_DiamondStoneTypeid === 4
        );
        if (findMetals !== -1) {
        //   obj.data[findMetals].materialCharges = obj.data[findMetals]?.Amount;
        }
        semiFinalArr.push(obj);
      } else {
        let findRec = semiFinalArr.findIndex(
          (ele, ind) => ele?.mainData?.GroupJob === obj?.mainData?.GroupJob
        );
        if (findRec === -1) {
          semiFinalArr.push(obj);
        } else {
          let mainMetals = [];
          let whichArr = "";
          if (
            semiFinalArr[findRec].mainData.SrJobno !==
            semiFinalArr[findRec].mainData.GroupJob
          ) {
            semiFinalArr[findRec].mainData.SrJobno =
              semiFinalArr[findRec].mainData.GroupJob;
          } else {
            mainMetals = semiFinalArr[findRec].data.filter(
              (ele, ind) => ele?.MasterManagement_DiamondStoneTypeid === 4
            );
            whichArr = "semiFinal";
          }
          if (obj.mainData.SrJobno === obj.mainData.GroupJob) {
            semiFinalArr[findRec].mainData.Categoryname =
              obj.mainData.Categoryname;
            semiFinalArr[findRec].mainData.SubCategoryname =
              obj.mainData.SubCategoryname;
            semiFinalArr[findRec].mainData.Collectionname =
              obj.mainData.Collectionname;
            semiFinalArr[findRec].mainData.designno = obj.mainData.designno;
            semiFinalArr[findRec].mainData.HUID = obj.mainData.HUID;
            mainMetals = obj.data.filter(
              (ele, ind) => ele?.MasterManagement_DiamondStoneTypeid === 4
            );
            whichArr = "obj";
          }

          semiFinalArr[findRec].mainData.MakingAmount +=
            obj.mainData.MakingAmount;
          semiFinalArr[findRec].mainData.TotalAmount +=
            obj.mainData.TotalAmount;
          semiFinalArr[findRec].mainData.grosswt += obj.mainData.grosswt;
          semiFinalArr[findRec].mainData.NetWt += obj.mainData.NetWt;
          semiFinalArr[findRec].mainData.LossWt += obj.mainData.LossWt;
          semiFinalArr[findRec].mainData.MetalAmount +=
            obj.mainData.MetalAmount;
          semiFinalArr[findRec].mainData.UnitCost =
            +semiFinalArr[findRec].mainData.UnitCost + +obj.mainData.UnitCost;
            semiFinalArr[findRec].mainData.OtherCharges += obj.mainData.OtherCharges
            

          // semiFinalArr[findRec].data.TotalAmount += obj.data.TotalAmount;

          // for metals
          let blankMetals = [];
          if (whichArr === "semiFinal") {
            let otherMetals = obj.data.filter(
              (ele, ind) => ele?.MasterManagement_DiamondStoneTypeid === 4
            );
            otherMetals.forEach((ele, ind) => {
              let objj = { ...ele };
              let newMetal = true;
              mainMetals.forEach((elem, index) => {
                if (elem?.ShapeName === objj?.ShapeName) {
                  elem.Amount += objj?.Amount;
                  elem.Pcs += objj?.Pcs;
                  elem.Wt += objj?.Wt;
                  // elem.materialCharges += +((objj.Rate * objj.Wt).toFixed(2));
                  // console.log(objj?.Amount, elem.materialCharges);
                //   elem.materialCharges += objj?.Amount + elem?.Amount;
                  // elem.materialCharges = objj?.Amount;
                  newMetal = false;
                  if (
                    elem?.IsPrimaryMetal !== 1 &&
                    objj?.IsPrimaryMetal === 1
                  ) {
                    elem.QualityName = objj?.QualityName;
                  }
                }
              });
              if (newMetal) {
                mainMetals.push(objj);
              }
            });
            blankMetals = mainMetals;
          } else if (whichArr === "obj") {
            let otherMetals = semiFinalArr[findRec].data.filter(
              (ele, ind) => ele?.MasterManagement_DiamondStoneTypeid === 4
            );
            otherMetals.forEach((ele, ind) => {
              let objj = { ...ele };
              let newMetal = true;
              mainMetals.forEach((elem, index) => {
                if (elem?.ShapeName === objj?.ShapeName) {
                  elem.Amount += objj?.Amount;
                  elem.Pcs += objj?.Pcs;
                  elem.Wt += objj?.Wt;
                  newMetal = false;
                  // elem.materialCharges += +((objj.Rate * objj.Wt).toFixed(2));
                  elem.materialCharges += objj.Amount;
                  if (
                    elem?.IsPrimaryMetal !== 1 &&
                    objj?.IsPrimaryMetal === 1
                  ) {
                    elem.QualityName = objj?.QualityName;
                  }
                }
              });
              if (newMetal) {
                mainMetals.push(objj);
              }
            });
            blankMetals = mainMetals;
          } else {
            let metals = [
              semiFinalArr[findRec].data.filter(
                (ele, ind) => ele?.MasterManagement_DiamondStoneTypeid === 4
              ),
              obj.data.filter(
                (ele, ind) => ele?.MasterManagement_DiamondStoneTypeid === 4
              ),
            ].flat();
            let blankM = [];
            metals.forEach((ele, ind) => {
              let findMetals = blankM.findIndex(
                (elee) => elee?.ShapeName === ele?.ShapeName
              );
              if (findMetals === -1) {
                blankM.push(ele);
              } else {
                blankM[findMetals].Wt += ele?.Wt;
                blankM[findMetals].Pcs += ele?.Pcs;
                blankM[findMetals].amount += ele?.amount;
                // blankM[findMetals].materialCharges += +((ele.Rate * ele.Wt).toFixed(2));
                blankM[findMetals].materialCharges += ele?.Amount;
                if (
                  blankM[findMetals].IsPrimaryMetal !== 1 &&
                  ele?.IsPrimaryMetal === 1
                ) {
                  blankM[findMetals].QualityName = ele?.QualityName;
                }
              }
            });
            blankMetals = blankM;
          }

          let findMetalRate =
          semiFinalArr[findRec].mainData.MetalAmount /
            (semiFinalArr[findRec].mainData.NetWt +
              semiFinalArr[findRec].mainData.LossWt);
          blankMetals[0].Rate = findMetalRate;
          // for materials
          let blankMaterials = [];
          let materials = [
            semiFinalArr[findRec].data.filter(
              (ele, ind) => ele?.MasterManagement_DiamondStoneTypeid !== 4
            ),
            obj.data.filter(
              (ele, ind) => ele?.MasterManagement_DiamondStoneTypeid !== 4
            ),
          ].flat();
          materials.forEach((ele, ind) => {
            let findMaterial = blankMaterials.findIndex(
              (elem, index) =>
                elem?.MasterManagement_DiamondStoneTypeid ===
                  ele?.MasterManagement_DiamondStoneTypeid &&
                elem?.ShapeName === ele?.ShapeName
              // elem?.Colorname === ele?.Colorname &&
              // elem?.QualityName === ele?.QualityName &&
              // elem?.SizeName === ele?.SizeName &&
              // elem?.Rate === ele?.Rate
            );
            if (findMaterial === -1) {
              blankMaterials.push(ele);
            } else {
              blankMaterials[findMaterial].Wt += ele?.Wt;
              blankMaterials[findMaterial].Pcs += ele?.Pcs;
              blankMaterials[findMaterial].Amount += ele?.Amount;
              // blankMaterials[findMaterial].materialCharges += +((ele.Rate * ele.Wt).toFixed(2));
              blankMaterials[findMaterial].materialCharges += ele?.Amount;
            }
          });
          blankMaterials.sort((a, b) => {
            if (
              a.MasterManagement_DiamondStoneTypeid ===
              b.MasterManagement_DiamondStoneTypeid
            ) {
              return a.id - b.id; // If mastermanagementtypeid is the same, sort by ID
            } else {
              return (
                a.MasterManagement_DiamondStoneTypeid -
                b.MasterManagement_DiamondStoneTypeid
              );
            }
          });
          semiFinalArr[findRec].data = [
            ...blankMetals,
            ...blankMaterials,
          ].flat();
        }
      }
    });
    // console.log(semiFinalArr);
    semiFinalArr.sort((a, b) => {
      const nameA = a.mainData.SrJobno.toUpperCase(); // Convert names to uppercase for case-insensitive comparison
      const nameB = b.mainData.SrJobno.toUpperCase();

      if (nameA < nameB) {
        return -1; // 'a' comes before 'b'
      }
      if (nameA > nameB) {
        return 1; // 'b' comes before 'a'
      }
      return 0; // Names are equal
    });
    setResultArr(semiFinalArr);

    semiFinalArr.forEach((e, i) => {
            totalobj.totalOtherAmount += e?.mainData?.MetalAmount + e?.mainData?.OtherCharges;
            e.data.forEach((ele, ind) => {
              if(ele?.MasterManagement_DiamondStoneTypeid !== 4){
                totalobj.totalOtherAmount += ele.Amount;
              }
            })
    })
    setTotalAmount(totalobj);
  };

  const loadData = (datas) => {
    setBillPrint_Json(datas?.BillPrint_Json[0]);
    setBillPrint_Json1(datas?.BillPrint_Json1);
    setBillPrint_Json2(datas?.BillPrint_Json2);
    findMaterials(
      datas?.BillPrint_Json2,
      datas?.BillPrint_Json1,
      datas?.BillPrint_Json
    );
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

  return (
    <>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        <div className="container-fluid taxinvoice1 pt-5 mt-5 taxInvoicePirnt1 pad_60_allPrint">
          <div className="d-flex justify-content-end align-items-center print_sec_sum4 pb-4">
            <div className="form-check pe-3 mb-0 pt-2">
              <input
                className="form-check-input border-dark"
                type="checkbox"
                checked={image}
                onChange={(e) => handleChange(e)}
              />
              <label className="form-check-label h6 mb-0 pt-1">
                With Image
              </label>
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
          <div className="d-flex justify-content-center">
            <p className="pe-1">{BillPrint_Json?.Company_VAT_GST_No}</p>
            <p className="ps-1 pe-1">|</p>
            <p className="ps-1 pe-1">
              {BillPrint_Json?.Company_CST_STATE}-
              {BillPrint_Json?.Company_CST_STATE_No}
            </p>
            <p className="pe-1 ps-1">|</p>
            <p className="ps-1">PAN-EDJHF236D</p>
          </div>
          <div className="taxinvoice1Head fw-bold text-center mb-1">
            {BillPrint_Json?.PrintHeadLabel}
          </div>
          <div className="headerInvoice1 d-flex border mb-1 border-2 border-black">
            <div className="header_textInvoice1 border-end p-1 header_textInvoicePrint1">
              <p className="customer_name_invoice1">
                Customer Name:{" "}
                <span className="fw-bold">{BillPrint_Json?.CustName}</span>
              </p>
              <p>{BillPrint_Json?.customerAddress1}</p>
              <p>{BillPrint_Json?.customerAddress2}</p>
              <p>
                {BillPrint_Json?.customercity}
                {BillPrint_Json?.customerpincode}
              </p>
              <p>{BillPrint_Json?.CompanyCountry}</p>
              <p>{BillPrint_Json?.CompanyEmail}</p>
              <p>Phno:{BillPrint_Json?.customermobileno}</p>
              <p>{BillPrint_Json?.vat_cst_pan}</p>
              <p>
                {BillPrint_Json?.Cust_CST_STATE} -{" "}
                {BillPrint_Json?.Cust_CST_STATE_No}
              </p>
            </div>
            <div className="header_text_invoice_num header_text_invoice_numPrint1 p-1">
              <div className="d-flex w-100 justify-content-between">
                <p className="customer_data_invoice1 fw-bold">INVOICE NO</p>
                <p>{BillPrint_Json?.InvoiceNo}</p>
              </div>
              <div className="d-flex w-100 justify-content-between">
                <p className="customer_data_invoice1 fw-bold">DATE</p>
                <p>{BillPrint_Json?.EntryDate}</p>
              </div>
            </div>
          </div>
          <div className="d-flex border-top border-bottom table_invoice1 border-2 border-black">
            <div className="sr_invoice1 sr_invoicePrint1 d-flex align-items-center justify-content-center fw-bold border-start border-2 border-black">
              Sr#
            </div>
            <div className="product_discription_invoice1 product_discription_invoice_print_1 d-flex align-items-center justify-content-center border-start fw-bold border-end">
              Product Description
            </div>
            <div className="hsn_invoice1 hsn_invoicePrint1 d-flex align-items-center justify-content-center fw-bold border-end">
              HSN
            </div>
            <div className="material_invoice1 materialInvoicePrint1">
              <div className="headHeightInvoice1 d-flex align-items-center justify-content-center fw-bold border-end border-bottom">
                Material Description
              </div>
              <div className="headHeightInvoice1 d-flex w-100">
                <div className=" d-flex align-items-center justify-content-center fw-bold border-end col-2">
                  Material
                </div>
                <div className=" d-flex align-items-center justify-content-center fw-bold border-end col-2">
                  Carat
                </div>
                <div className=" d-flex align-items-center justify-content-center fw-bold border-end col-2">
                  GWT
                </div>
                <div className=" d-flex align-items-center justify-content-center fw-bold border-end col-2">
                  Less Wt
                </div>
                <div className=" d-flex align-items-center justify-content-center fw-bold border-end col-2">
                  NWT
                </div>
                <div className=" d-flex align-items-center justify-content-center fw-bold border-end  col-2">
                  Rate
                </div>
              </div>
            </div>
            <div className="making_invoice1 making_invoicePrint1 d-flex align-items-center justify-content-center fw-bold border-end">
              Making
            </div>
            <div className="others_invoice1 others_invoicePrint1 d-flex align-items-center justify-content-center fw-bold border-end flex-column">
              <p>Material</p>
              <p>Charge</p>
            </div>
            <div className="total_invoice1 total_invoicePrint1 d-flex align-items-center justify-content-center fw-bold border-end border-2 border-black">
              Total
            </div>
          </div>
          {resultArr.length > 0 &&
            resultArr.map((e, i) => {
              return (
                <div
                  className="d-flex w-100 border-bottom table_row_invoice1 border-2 border-black"
                  key={i}
                >
                  <div className="sr_invoice1 sr_invoicePrint1 min_padding_invoice1 border-start border-2 border-black">
                    {i + 1}
                  </div>
                  <div className="product_discription_invoice1 product_discription_invoice_print_1 min_padding_invoice1 border-start border-end">
                    <p>
                      {" "}
                      {e?.mainData?.SubCategoryname} {e?.mainData?.Categoryname}{" "}
                    </p>
                    <p>
                      {e?.mainData?.designno} | {e?.mainData?.SrJobno}
                    </p>
                    {image && (
                      <img
                        src={e?.mainData?.DesignImage}
                        alt=""
                        className="w-100 p-1 imgTaxInvoice1"
                        onError={handleImageError}
                      />
                    )}
                    {e?.mainData?.HUID !== "" && (
                      <p className={`${!image && "pt-3"}`}>
                        HUID-{e?.mainData?.HUID}{" "}
                      </p>
                    )}
                  </div>
                  <div className="hsn_invoice1 hsn_invoicePrint1 min_padding_invoice1 border-end">
                    {BillPrint_Json?.HSN_No}
                  </div>
                  <div className="material_invoice_inner1 border-end materialInvoicePrint1">
                    {e?.data.length > 0 &&
                      e?.data.map((ele, ind) => {
                        return (
                          <div
                            className={`d-flex ${
                              ind !== e?.data?.length - 1 && `border-bottom`
                            } material_inner_invoice1`}
                            key={ind}
                          >
                            <div className="min_padding_invoice1  border-end justify-content-center col-2">
                              {ele?.ShapeName}
                            </div>
                            <div className="min_padding_invoice1  border-end justify-content-center col-2">
                              {ind === 0 && ele?.QualityName}
                            </div>
                            <div className="min_padding_invoice1  border-end justify-content-center col-2">
                              {ind === 0 &&
                                fixedValues(e?.mainData?.grosswt, 3)}
                            </div>
                            <div className="min_padding_invoice1  border-end justify-content-center col-2">
                              {ele?.ShapeName !== "GOLD" &&
                                fixedValues(ele?.Wt, 3)}
                            </div>
                            <div className="min_padding_invoice1  border-end justify-content-center col-2">
                              {ind === 0 &&
                                fixedValues(
                                  e?.mainData?.NetWt + e?.mainData?.LossWt,
                                  3
                                )}
                            </div>
                            <div className="min_padding_invoice1  justify-content-end col-2">
                            <p className="text-end">  {ele?.MasterManagement_DiamondStoneTypeid === 4 &&
                                NumberWithCommas(ele?.Rate, 2)}</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  {/* <div className='d-flex align-items-center justify-content-center making_invoice1 making_invoicePrint1 p-1 border-end'>{NumberWithCommas(e?.mainData?.MakingAmount, 2)}</div> */}
                  <div className="d-flex align-items-center justify-content-center making_invoice1 making_invoicePrint1 p-1 border-end">
                    {NumberWithCommas(e?.mainData?.MaKingCharge_Unit, 2)}
                  </div>
                  <div className="others_invoice1 others_invoicePrint1  border-end">
                    <div className="d-grid h-100">
                      <div className="text-end border-bottom material_inner_invoice1 p-1 minHeight20_5_taxInvoice1">
                        {NumberWithCommas(e?.mainData?.MetalAmount, 2)}
                      </div>
                      {e?.data.length > 0 &&
                        e?.data.map((ele, ind) => {
                          return (
                            ele?.materialCharges !== 0 && (
                              <div
                                className={`text-end ${
                                  (e?.mainData?.OtherCharges !== 0 ||
                                    ind !== e?.data.length) &&
                                  `border-bottom`
                                } material_inner_invoice1 p-1 minHeight20_5_taxInvoice1`}
                                key={ind}
                              >
                                {NumberWithCommas(ele?.materialCharges, 2)}
                              </div>
                            )
                          );
                        })}
                      {e?.mainData?.OtherCharges !== 0 && (
                        <div className="text-end border-bottom material_inner_invoice1 p-1 minHeight20_5_taxInvoice1">
                          {NumberWithCommas(e?.mainData?.OtherCharges, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-end total_invoice1 total_invoicePrint1 min_padding_invoice1 border-end border-2 border-black">
                    {NumberWithCommas(+e?.mainData?.UnitCost, 2)}
                  </div>
                </div>
              );
            })}
          <div className="d-flex headHeightInvoice1 border-bottom print_break_avoid_invoice1 border-2 border-black">
            <div className="p-1 d-flex align-items-center sr_invoice1 sr_invoicePrint1 border-start border-2 border-black"></div>
            <div className="p-1 d-flex align-items-center product_discription_invoice1 product_discription_invoice_print_1 border-end border-start total_sec_invoice1 fw-bold">
              TOTAL
            </div>
            <div className="p-1 d-flex align-items-center hsn_invoice1 hsn_invoicePrint1 border-end"></div>
            <div className="d-flex align-items-center material_invoice_inner1 border-end materialInvoicePrint1">
              <div className="d-flex material_inner_invoice1 h-100 w-100">
                <div className="p-1 min_padding_invoice1  border-end col-2"></div>
                <div className="p-1 min_padding_invoice1  border-end col-2"></div>
                <div className="p-1 min_padding_invoice1  border-end justify-content-center col-2">
                  <p className="fw-bold">{fixedValues(totalAmount?.gwt, 3)}</p>
                </div>
                <div className="  border-end fw-bold d-block text-center col-2">
                  <p>{fixedValues(totalAmount?.diaWt, 3)} Ctw </p>
                  <p>{fixedValues(totalAmount?.weightInGram, 3)} gm</p>
                </div>
                <div className="p-1  border-end fw-bold d-block align-items-center d-flex justify-content-center col-2">
                  {fixedValues(totalAmount?.netWeight, 3)}
                </div>
                <div className="p-1 min_padding_invoice1  fw-bold col-2"></div>
              </div>
            </div>
            <div className="p-1 d-flex align-items-center making_invoice1 making_invoicePrint1 border-end"></div>
            <div className="p-1 d-flex align-items-center others_invoice1 others_invoicePrint1 border-end fw-bold justify-content-end">
              {NumberWithCommas(totalAmount?.totalOtherAmount, 2)}
            </div>
            <div className="p-1 d-flex align-items-center total_invoice1 total_invoicePrint1 border-end fw-bold justify-content-end border-2 border-black">
              {NumberWithCommas(totalAmount?.UnitCost, 2)}
            </div>
          </div>
          <div className="d-flex border-start border-end border-bottom print_break_avoid_invoice1 border-2 border-black">
            <div className="oldGoldInvoice1 border-end d-grid oldGoldInvoicePrint1">
              <div className="d-flex p-1 border-bottom">
                <div>
                  Narration / <span className="fw-bold">Remark:</span>{" "}
                  <div
                    dangerouslySetInnerHTML={{ __html: BillPrint_Json?.Remark }}
                  ></div>
                </div>
              </div>
              <div className="d-flex border-bottom p-1 flex-column">
                <p className="pb-1">Old Gold Purchase Description :</p>
                <p className="fw-bold pb-1">Total Weight :</p>
                <p>Total Amount : {BillPrint_Json?.OldGoldAmount}</p>
              </div>
            </div>
            <div className="cgst_inovice1 border-end p-1 text-end cgstinvoicePrint1">
              {totalAmount?.discountAmt !== 0 && <p>Discount</p>}
              <p>Total Amt. before Tax</p>
              {taxes.length > 0 &&
                taxes?.map((e, i) => {
                  return (
                    <p key={i}>
                      {e?.name} @ {e?.per}
                    </p>
                  );
                })}
              <p>Total Amt. after Tax</p>
              <p>Old Gold</p>
              <p>Advance</p>
              <p>Recv.in Cash</p>
              {bank.length > 0 &&
                bank.map((e, i) => {
                  return <p key={i}>Recv.in Bank({e?.label})</p>;
                })}
              <p>Net Bal. Amount</p>
            </div>
            <div className="total_sum_invoice_print_1 total_sum_invoiceprint1 p-1 text-end">
              {totalAmount?.discountAmt !== 0 && (
                <p>{NumberWithCommas(totalAmount?.discountAmt, 2)}</p>
              )}
              <p>{totalAmount?.TotalAmount?.toFixed(2)}</p>
              {taxes.length > 0 &&
                taxes?.map((e, i) => {
                  return <p key={i}>{NumberWithCommas(+e?.amount, 2)}</p>;
                })}
              <p>{totalAmount?.totalAmountAfterTax}</p>
              <p>
                {BillPrint_Json?.OldGoldAmount !== undefined &&
                  NumberWithCommas(BillPrint_Json?.OldGoldAmount, 2)}
              </p>
              <p>
                {BillPrint_Json?.AdvanceAmount !== undefined &&
                  NumberWithCommas(BillPrint_Json?.AdvanceAmount, 2)}
              </p>
              <p>
                {BillPrint_Json?.CashReceived !== undefined &&
                  NumberWithCommas(BillPrint_Json?.CashReceived, 2)}
              </p>
              {bank.length > 0 &&
                bank.map((e, i) => {
                  return <p key={i}>{NumberWithCommas(e?.amount, 2)}</p>;
                })}
              {/* <p>{BillPrint_Json?.BankReceived !== undefined && NumberWithCommas(BillPrint_Json?.BankReceived, 2)}</p> */}
              <p>
                {totalAmount?.netBalanceAmount !== undefined &&
                  NumberWithCommas(totalAmount?.netBalanceAmount, 2)}
              </p>
            </div>
          </div>
          <div className="d-flex border-start border-end border-bottom border-2 border-black print_break_avoid_invoice1">
            <div className="p-1 totalNumbersinvoice1 border-end totalNumbersinvoicePrint1">
              <p>In Words Indian Rupees</p>
              <p className="fw-bold">{totalAmount?.textnumber}</p>
            </div>
            <div className="p-1 totalTaxinvoice1 totalTaxinvoicePrint1 border-end text-end align-items-center d-flex justify-content-end fw-bold">
              GRAND TOTAL
            </div>
            <div className="p-1 d-flex align-items-center justify-content-end totalTaxNumberinvoice_print_1 fw-bold totalTaxNumberinvoiceprint1">
              ₹{" "}
              {totalAmount?.netBalanceAmount !== undefined &&
                NumberWithCommas(totalAmount?.netBalanceAmount, 2)}
            </div>
          </div>
          <div className="d-flex border-start border-end border-bottom p-1 print_break_avoid_invoice1 border-2 border-black">
            <div
              dangerouslySetInnerHTML={{ __html: BillPrint_Json?.Declaration }}
              className="pt-1"
            ></div>
          </div>
          <div className="d-flex border-start border-end border-bottom print_break_avoid_invoice1 border-2 border-black">
            <div className=" border-end p-1 col-4">
              <p className="fw-bold">Bank Detail</p>
              <p>Bank Name: {BillPrint_Json?.bankname}</p>
              <p>Branch: {BillPrint_Json?.bankaddress}</p>
              <p>Account Name: {BillPrint_Json?.accountname}</p>
              <p>Account No. : {BillPrint_Jso1?.accountnumber}</p>
              <p>RTGS/NEFT IFSC: {BillPrint_Json?.rtgs_neft_ifsc}</p>
            </div>
            <div className=" border-end d-flex justify-content-between flex-column p-1 col-4">
              <p>Signature</p>
              <p className="fw-bold">{BillPrint_Json?.CustName}</p>
            </div>
            <div className=" d-flex justify-content-between flex-column p-1 col-4">
              <p>Signature</p>
              <p className="fw-bold">{BillPrint_Json?.CompanyFullName}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
          {msg}
        </p>
      )}
    </>
  );
};

export default TaxInvoice1;
