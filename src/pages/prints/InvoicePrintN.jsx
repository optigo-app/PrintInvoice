import React, { useState, useEffect } from "react";
import "../../assets/css/prints/jewellaryinvoiceprint.css";
import style from "../../assets/css/prints/jewelleryRetailinvoicePrint3.module.css";
import {
  apiCall,
  CapitalizeWords,
  checkMsg,
  fixedValues,
  GovernMentDocuments,
  handleImageError,
  isObjectEmpty,
  NumberWithCommas,
  ReceiveInBank,
  taxGenrator,
} from "../../GlobalFunctions";
import Button from "../../GlobalFunctions/Button";
import Loader from "../../components/Loader";
import { ToWords } from "to-words";

const InvoicePrintN = ({
  urls,
  token,
  invoiceNo,
  printName,
  evn,
  ApiVer,
}) => {
  const [headerData, setHeaderData] = useState({});
  const [data, setdata] = useState([]);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
    const [summary, setSummary] = useState([]);
  const toWords = new ToWords();
  const [image, setImage] = useState(true);
  const [summ, setSummy] = useState(true);
   
  const [retail, setRetail] = useState(true);
  const [customerAddress, setCustomerAddress] = useState([]);
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
    netBalAmount: 0,
    beforeTax: 0,
    diamondColorStoneWt: 0,
    multiMetalMiscHsCode: 0,
    otherCharge: 0,
  });
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const [taxes, setTaxes] = useState([]);
  const [bank, setBank] = useState([]);
  const [document, setDocument] = useState([]);
  function loadData(data) {
    // console.log("datadatadata", data);

    try {
      setHeaderData(data?.BillPrint_Json[0]);

      let custAddress = data?.BillPrint_Json[0]?.Printlable.split("\n");
      setCustomerAddress(custAddress);
      let blankArr = [];
      let diamondWt = 0;
    let colorStoneWt = 0;
    let grossWt = 0;
      let metalArr = [];
      let totals = { ...total };
      let groupInfo = [];
      data?.BillPrint_Json1.forEach((e, i) => {
        let findRecord = metalArr.findIndex(
          (elem) => elem?.label === e?.MetalTypePurity
        );
        if (findRecord === -1) {
          metalArr.push({
            label: e?.MetalTypePurity,
            value: e?.NetWt * e?.Quantity,
            gm: true,
          });
        } else {
          metalArr[findRecord].value += e?.NetWt * e?.Quantity;
        }
        grossWt += e?.grosswt * e?.Quantity;
        let obj = { ...e };
        totals.gwt += e?.grosswt;
        totals.beforeTax += e?.TotalAmount;
        // totals.nwt += e?.NetWt;
        totals.nwt += e?.MetalDiaWt;
        totals.others += e?.OtherCharges;
        totals.total += e?.UnitCost;
        totals.discount += e?.DiscountAmt;
        let hallmarkingCount = 0;
        let materials = [];
        let primaryMetal = [];
        let otherMetals = [];
        let diamonds = [];
        let colorstones = [];
        let miscs = [];
        let finding = [];
        let diamondAmount = 0;
        // let diamondWt = 0;
        let diamondRate = 0;
        let colorStoneAmount = 0;
        // let colorStoneWt = 0;
        let colorStoneRate = 0;
        let miscsAmount = 0;
        let miscsWt = 0;
        let miscsRate = 0;
        let findingWt = 0;
        let otherCharge = 0;
        let others = e?.OtherCharges;
        if ((e?.NetWt + e?.LossWt) !== 0 && others !== undefined) {
          otherCharge = others / (e?.NetWt + e?.LossWt);
        }
        totals.otherCharge += +otherCharge.toFixed(2);
        let metalMaking = obj?.MetalAmount + obj?.MakingAmount;
        data?.BillPrint_Json2.forEach((ele, ind) => {
          if (e?.SrJobno === ele?.StockBarcode) {
            if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
              materials.unshift(ele);
              if (ele?.IsPrimaryMetal === 1) {
                primaryMetal?.push(ele);
              } else {
                otherMetals?.push(ele);
                totals.multiMetalMiscHsCode += ele?.Wt;
                hallmarkingCount += 1;
              }
            } else if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
              diamonds?.push(ele);
              totals.diaColorWt += ele?.Wt;
              diamondAmount += ele?.Amount;
              diamondWt += ele?.Wt;
              let findIndex = materials.findIndex(
                (elem) => elem?.MasterManagement_DiamondStoneTypeid === 1
              );
              if (findIndex === -1) {
                materials.push(ele);
              } else {
                materials[findIndex].Wt += ele?.Wt;
                materials[findIndex].Amount += ele?.Amount;
              }
            } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
              colorStoneAmount += ele?.Amount;
              colorStoneWt += ele?.Wt;
              colorstones?.push(ele);
              totals.diaColorWt += ele?.Wt;
              let findIndex = materials.findIndex(
                (elem) => elem?.MasterManagement_DiamondStoneTypeid === 2
              );
              if (findIndex === -1) {
                materials.push(ele);
              } else {
                materials[findIndex].Wt += ele?.Wt;
                materials[findIndex].Amount += ele?.Amount;
              }
            } else if (
              ele?.MasterManagement_DiamondStoneTypeid === 3 &&
              ele?.IsHSCOE === 0
            ) {
              miscsAmount += ele?.Amount;
              miscsWt += ele?.Wt;
              miscs?.push(ele);
              totals.stoneWt += ele?.Wt;
              materials.push(ele);
              totals.multiMetalMiscHsCode += ele?.Wt;
            } else if (ele?.MasterManagement_DiamondStoneTypeid === 5) {
              finding?.push(ele);
              findingWt += ele?.Wt;
              hallmarkingCount += 1;
            }
          }
        });
        if (diamondWt !== 0 && diamondAmount !== 0) {
          diamondRate = diamondAmount / diamondWt;
        }
        if (colorStoneWt !== 0 && colorStoneAmount !== 0) {
          colorStoneRate = colorStoneAmount / colorStoneWt;
        }
        if (miscsWt !== 0 && miscsAmount !== 0) {
          miscsRate = miscsAmount / miscsWt;
        }
        obj.materials = materials;
        obj.otherCharge = otherCharge;
        obj.metalMaking = metalMaking;
        obj.primaryMetal = primaryMetal;
        obj.diamondWt = diamondWt;
        obj.colorStoneWt = colorStoneWt;
        obj.miscsWt = miscsWt;
        obj.otherMetals = otherMetals;
        obj.diamonds = diamonds;
        obj.colorstones = colorstones;
        obj.miscs = miscs;
        obj.diamondRate = diamondRate;
        obj.colorStoneRate = colorStoneRate;
        obj.findingWt = findingWt;
        obj.miscsRate = miscsRate;
        obj.finding = finding;
        obj.diamondAmount = diamondAmount;
        obj.colorStoneAmount = colorStoneAmount;
        obj.hallmarkingCount = hallmarkingCount;
        obj.miscsAmount = miscsAmount;
        blankArr.push(obj);


        let findGroupinfo = groupInfo?.findIndex(
          (ele, ind) => ele?.GroupJob === e?.GroupJob && e?.GroupJob !== ""
        );
        if (findGroupinfo !== -1) {
          groupInfo[findGroupinfo].diamondWt += diamondWt;
          groupInfo[findGroupinfo].colorStoneWt += colorStoneWt;
          groupInfo[findGroupinfo].miscsWt += miscsWt;
          groupInfo[findGroupinfo].diamondAmount += diamondAmount;
          groupInfo[findGroupinfo].colorStoneAmount += colorStoneAmount;
          groupInfo[findGroupinfo].miscsAmount += miscsAmount;
          groupInfo[findGroupinfo].hallmarkingCount += hallmarkingCount;
          groupInfo[findGroupinfo].findingWt += findingWt;
          groupInfo[findGroupinfo].otherCharge += otherCharge;
          if (e?.GroupJob === e?.SrJobno) {
            groupInfo[findGroupinfo].designno = e?.designno;
            groupInfo[findGroupinfo].DesignImage = e?.DesignImage;
            groupInfo[findGroupinfo].Categoryname = e?.Categoryname;
            groupInfo[findGroupinfo].SubCategoryname = e?.SubCategoryname;
            groupInfo[findGroupinfo].HUID = e?.HUID;
            groupInfo[findGroupinfo].SrJobno = e?.SrJobno;
          }
        } else if (e?.GroupJob !== "" && findGroupinfo === -1) {
          groupInfo?.push({
            GroupJob: e?.GroupJob,
            diamondWt: diamondWt,
            colorStoneWt: colorStoneWt,
            miscsWt: miscsWt,
            diamondAmount: diamondAmount,
            colorStoneAmount: colorStoneAmount,
            miscsAmount: miscsAmount,
            designno: e?.designno,
            DesignImage: e?.DesignImage,
            Categoryname: e?.Categoryname,
            SubCategoryname: e?.SubCategoryname,
            HUID: e?.HUID,
            SrJobno: e?.GroupJob,
            hallmarkingCount: hallmarkingCount,
            findingWt: findingWt,
            otherCharge: otherCharge,
          });
        }
      });

      metalArr.push({ label: "Diamond Wt", value: diamondWt, gm: false });
      metalArr.push({ label: "Stone Wt", value: colorStoneWt, gm: false });
      metalArr.push({ label: "Gross Wt", value: grossWt, gm: true });

      setSummary(metalArr);
      let taxValue = taxGenrator(data?.BillPrint_Json[0], totals?.total);
      taxValue.forEach((e, i) => {
        totals.afterTax += +e?.amount;
      });
      totals.afterTax += totals?.beforeTax + data?.BillPrint_Json[0]?.AddLess;
      let debitCardinfo = ReceiveInBank(data?.BillPrint_Json[0]?.BankPayDet);
      setBank(debitCardinfo);
      // console.log("bank", debitCardinfo);
      totals.netBalAmount =
        totals.afterTax - data?.BillPrint_Json[0]?.OldGoldAmount;
      debitCardinfo.length > 0 &&
        debitCardinfo.forEach((e, i) => {
          totals.netBalAmount -= e.amount;
        });
      setTaxes(taxValue);
      // console.log("taxValue", taxValue);

      blankArr?.forEach((e, i) => {
        if (e?.GroupJob !== "") {
          let findRecord = groupInfo?.find(
            (ele, ind) => ele?.GroupJob === e?.GroupJob
          );
          if (findRecord !== undefined) {
            e.designno = findRecord?.designno;
            e.SrJobno = findRecord?.SrJobno;
            e.DesignImage = findRecord?.DesignImage;
            e.Categoryname = findRecord?.Categoryname;
            e.SubCategoryname = findRecord?.SubCategoryname;
            e.diamondWt = findRecord?.diamondWt;
            e.diamondAmount = findRecord?.diamondAmount;
            e.colorStoneWt = findRecord?.colorStoneWt;
            e.colorStoneAmount = findRecord?.colorStoneAmount;
            // totals.diamondColorStoneWt += findRecord?.diamondWt + findRecord?.colorStoneWt;
            e.miscsWt = findRecord?.miscsWt;
            e.diamondAmount = findRecord?.diamondAmount;
            e.colorStoneAmount = findRecord?.colorStoneAmount;
            e.miscsAmount = findRecord?.miscsAmount;
            e.diamondRate = findRecord?.diamondAmount / findRecord?.diamondWt;
            e.colorStoneRate =
              findRecord?.colorStoneAmount / findRecord?.colorStoneWt;
            e.miscsRate = findRecord?.miscsAmount / findRecord?.miscsWt;
            e.hallmarkingCount = findRecord?.hallmarkingCount;
            e.findingWt = findRecord?.findingWt;
            e.otherCharge = findRecord?.otherCharge;
          }
        } else {
          // totals.diamondColorStoneWt += e?.diamondWt + e?.colorStoneWt;
        }
      });
      let resultArr = [];
      blankArr.forEach((e, i) => {
        if (e?.GroupJob !== "") {
          let findIndex = resultArr.findIndex(
            (ele) =>
              ele?.GroupJob === e?.GroupJob &&
              ele?.primaryMetal[0]?.Rate === e?.primaryMetal[0]?.Rate
          );
          if (findIndex === -1) {
            resultArr.push(e);
            totals.diamondColorStoneWt += e?.diamondWt + e?.colorStoneWt;
          } else {
            // totals.diamondColorStoneWt += resultArr[findIndex]?.diamondWt + resultArr[findIndex]?.colorStoneWt;
            resultArr[findIndex].MakingAmount += e?.MakingAmount;
            resultArr[findIndex].MetalAmount += e?.MetalAmount;
            resultArr[findIndex].OtherCharges += e?.OtherCharges;
            resultArr[findIndex].TotalAmount += e?.TotalAmount;
            resultArr[findIndex].UnitCost += e?.UnitCost;
            resultArr[findIndex].grosswt += e?.grosswt;
            resultArr[findIndex].NetWt += e?.NetWt;
            resultArr[findIndex].LossWt += e?.LossWt;
            let arr = [resultArr[findIndex], e];
            let findRecord = arr.find((elem) => elem?.SrJobno === e?.GroupJob);
            resultArr[findIndex].SubCategoryname = findRecord?.SubCategoryname;
            resultArr[findIndex].Collectionname = findRecord?.Collectionname;
            resultArr[findIndex].designno = findRecord?.designno;
            resultArr[findIndex].SrJobno = findRecord?.SrJobno;
            resultArr[findIndex].DesignImage = findRecord?.DesignImage;
            resultArr[findIndex].otherMetals = [
              ...resultArr[findIndex].otherMetals,
              ...e?.otherMetals,
            ]?.flat();
            resultArr[findIndex].primaryMetal[0].Wt += e?.primaryMetal[0]?.Wt;
            resultArr[findIndex].primaryMetal[0].Amount +=
              e?.primaryMetal[0]?.Amount;
            let miscs = [...resultArr[findIndex]?.miscs, ...e?.miscs]?.flat();
            let misc = [];
            miscs?.forEach((ele, ind) => {
              if (misc?.length === 0) {
                misc?.push(ele);
              } else {
                misc[0].Wt += ele?.Wt;
                misc[0].Amount += ele?.Amount;
              }
            });
          }
        } else {
          resultArr.push(e);
          totals.diamondColorStoneWt += e?.diamondWt + e?.colorStoneWt;
        }
      });
      resultArr?.sort((a, b) => {
        let nameA = a?.designno?.toUpperCase();
        let nameB = b?.designno?.toUpperCase();
        if (nameA > nameB) {
          return 1;
        } else if (nameA < nameB) {
          return -1;
        } else {
          return 0;
        }
      });
      let documentDetail = GovernMentDocuments(
        data?.BillPrint_Json[0]?.DocumentDetail
      );
      setDocument(documentDetail);
      setdata(resultArr);
      setTotal(totals);

      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(
          token,
          invoiceNo,
          printName,
          urls,
          evn,
          ApiVer
        );
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
          // setMsg(data?.Message);
          const err = checkMsg(data?.Message);
          console.log(data?.Message);
          setMsg(err);
        }
      } catch (error) {
        console.error(error);
      }
    };
    sendData();
  }, []);
  // console.log("data", data);
  // console.log("headerData", headerData);
  // console.log("total", total);

  const handleChangeImage = (e) => {
    image ? setImage(false) : setImage(true);
  };

  const handleChangeSummary = (e) => {
    summ ? setSummy(false) : setSummy(true);
  };
 
  const handleChangeRetail = (e) => {
    retail ? setRetail(false) : setRetail(true);
  };


  const totalConverted = total?.afterTax / headerData?.CurrencyExchRate;
  const totalPayments =
    headerData?.OldGoldAmount +
    headerData?.CashReceived +
    headerData?.AdvanceAmount +
    bank?.reduce((acc, cObj) => acc + +cObj?.amount, 0);

  const difference = Math.round((totalConverted - totalPayments) * 100) / 100;

  //   const diaTotal= data.map((e,i)=>{
  //      const tl=e?.diamonds.reduce((acc,d)=>{
  //         return acc + d?.RMwt * d?.Rate
  //      },0);

  //      return tl
  //   })

  //   const csTotal= data.map((e,i)=>{
  //     const tl=e?.colorstones.reduce((acc,d)=>{
  //        return acc + d?.RMwt * d?.Rate
  //     },0);

  //     return tl
  //  })

  //  let jobtotal=0
  //   data.forEach((e,i)=>{
  //     jobtotal+=e.MetalAmount

  // })

  const totalsWithMat = data.reduce(
    (acc, e) => {
      // Diamond Total
      acc.diaTotal += (e?.diamonds ?? []).reduce(
        (sum, d) => sum + (d?.RMwt ?? 0) * (d?.Rate ?? 0),
        0
      );

      // Color Stone Total
      acc.csTotal += (e?.colorstones ?? []).reduce(
        (sum, d) => sum + (d?.RMwt ?? 0) * (d?.Rate ?? 0),
        0
      );

      // Metal Total
      acc.jobTotal += e?.MetalAmount ?? 0;

      return acc;
    },
    {
      diaTotal: 0,
      csTotal: 0,
      jobTotal: 0
    }
  );

  const grandTotalWithMat = Object.values(totalsWithMat).reduce(
    (acc, value) => acc + (value ?? 0),
    0
  );







  const mergeByKey = ({
    data = [],
    groupKey = "Rate",
    sumFields = ["Pcs", "RMwt", "Amount"]
  }) => {
    return Object.values(
      (data ?? []).reduce((acc, item) => {
        const key = item?.[groupKey] ?? 0;

        if (!acc[key]) {
          acc[key] = { [groupKey]: key };

          // initialize sum fields
          sumFields.forEach(field => {
            acc[key][field] = 0;
          });
        }

        // sum dynamic fields
        sumFields.forEach(field => {
          acc[key][field] += item?.[field] ?? 0;
        });

        return acc;
      }, {})
    );
  };


  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              {" "}
              <div
                className={`container-fluid ${style?.jewelelryRetailInvoiceContainer} pad_60_allPrint position-relative px-1 ${style?.RetailInvoiceprint4}`}
              >
                <div
                  className={`btnpcl align-items-baseline position-absolute right-0 top-0 m-0 ${style?.right_retailInvoicePrintsBtn} d-flex`}
                  style={{ right: "-330px" }}
                >

                  <div className="form-check pe-3">
                    <input
                      className="form-check-input"
                      id="retail"
                      type="checkbox"
                      checked={retail}
                      onChange={handleChangeRetail}
                    />
                    <label
                      className="form-check-label pt-1"
                      htmlFor="flexCheckDefault"
                      for="retail"
                    >
                      Retail
                    </label>
                  </div>

                   
                  <div className="form-check pe-3">
                    <input
                      className="form-check-input"
                      id="image"
                      type="checkbox"
                      checked={summ}
                      onChange={handleChangeSummary}
                    />
                    <label
                      className="form-check-label pt-1"
                      for="image"
                    >
                      Summary
                    </label>
                  </div>
                  <div className="form-check pe-3">
                    <input
                      className="form-check-input"
                      id="image"
                      type="checkbox"
                      checked={image}
                      onChange={handleChangeImage}
                    />
                    <label
                      className="form-check-label pt-1"
                      for="image"
                    >
                      With Image
                    </label>
                  </div>
                  <Button />
                </div>
                <div className="pt-2 d-flex flex-column">
                  <div className="headlineJL w-100 p-2">
                    {" "}
                    <b style={{ fontSize: "20px" }}>
                      {" "}
                      {headerData?.PrintHeadLabel}{" "}
                      {retail ? "RETAIL INVOICE" : "TAX INVOICE"}
                    </b>{" "}
                  </div>
                  <div className="d-flex w-100">
                    <div className="col-10 p-2">
                      <div className="fslhJL">
                        <h5>
                          {" "}
                          <b style={{ fontSize: "16px", color: "black" }}>
                            {" "}
                            {headerData?.CompanyFullName}{" "}
                          </b>{" "}
                        </h5>
                      </div>
                      <div className="fslhJL">{headerData?.CompanyAddress}</div>
                      <div className="fslhJL">
                        {headerData?.CompanyAddress2}
                      </div>
                      <div className="fslhJL">
                        {headerData?.CompanyCity}-{headerData?.CompanyPinCode},
                        {headerData?.CompanyState}({headerData?.CompanyCountry})
                      </div>
                      
                      <div className="fslhJL">
                        {headerData?.CompanyEmail} |{headerData?.CompanyWebsite}
                      </div>
                      {/* <div className='fslhpcl3'>{headerData?.Company_VAT_GST_No} | {headerData?.Cust_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-EDJHF236D</div> */}
                      <div className="fslhJL">
                        {headerData?.Company_VAT_GST_No}
                        {headerData?.Company_CST_STATE_No !== "" &&
                          headerData?.Company_CST_STATE !== "" &&
                          `| ${headerData?.Company_CST_STATE}-${headerData?.Company_CST_STATE_No}`}
                        {headerData?.Com_pannumber !== "" &&
                          ` | PAN-${headerData?.Com_pannumber}`}
                      </div>
                      <div className="fslhJL">
                        T {headerData?.CompanyTellNo} 
                        {/* | TOLL FREE{" "}
                        {headerData?.CompanyTollFreeNo} */}
                      </div>
                    </div>
                    <div className="col-2 d-flex align-items-center justify-content-center">
                      {/* <img
                      src={headerData?.PrintLogo}
                      alt="#"
                      className={`w-100 d-block ms-auto ${style?.imgJewelleryRetailinovicePrint3}`}
                    /> */}
                      {isImageWorking && headerData?.PrintLogo !== "" && (
                        <img
                          src={headerData?.PrintLogo}
                          alt=""
                          className={`w-100 d-block ms-auto ${style?.imgJewelleryRetailinovicePrint3}`}
                          onError={handleImageErrors}
                          height={120}
                          width={150}
                        />
                      )}
                    </div>
                  </div>
                  {/* header data */}
                  <div className="d-flex border w-100 no_break">
                    <div className={`col-${!retail ? 4 : 8} p-2 b border-end`}>
                      {/* <div className="fslhJL">{headerData?.lblBillTo}</div> */}
                      <div className="fslhJL"> Bill To,</div>
                      <div className="fslhJL">
                        <b className="JL13" style={{ fontSize: "14px" }}>
                          {headerData?.CustName}
                        </b>
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
                      <div className="fslhJL">{headerData?.CompanyCountry}</div>
                      <div className="fslhJL">{headerData?.customeremail1}</div>
                      <div className="fslhJL">
                        Phno: {headerData?.customermobileno}
                      </div>
                      <div className="fslhJL">
                        {headerData?.vat_cst_pan}{" "}
                        {headerData?.aadharno !== "" &&
                          `| Aadhar-${headerData?.aadharno}`}
                      </div>
                      <div className="fslhJL">
                        {headerData?.Cust_CST_STATE}-
                        {headerData?.Cust_CST_STATE_No}
                      </div>
                    </div>

                    { !retail && (
                      <div className="col-4 p-2 border-end">
                        <p>Ship To,</p>
                        <p className={`fw-bold ${style?.font_14}`}>
                          {headerData?.customerfirmname}
                        </p>
                        {customerAddress.map((e, i) => {
                          return <p key={i}>{e}</p>;
                        })}
                      </div>
                    )}


                    <div className="col-4 p-2 position-relative">
                      <div className="d-flex">
                        <div className="col-6">
                          <b className="JL13">Bill No</b>
                        </div>
                        <div className="col-6">{headerData?.InvoiceNo}</div>
                      </div>
                      <div className="d-flex">
                        <div className="col-6">
                          <b className="JL13">DATE</b>
                        </div>
                        <div className="col-6">{headerData?.EntryDate}</div>
                      </div>
                      <div className="d-flex">
                        <div className="col-6">
                          <b className="JL13">DUE DATE</b>
                        </div>
                        <div className="col-6">{headerData?.DueDate}</div>
                      </div>
                      <div className="d-flex">
                        <div className="col-6">
                          <b className="JL13">DUE DAYS</b>
                        </div>
                        <div className="col-6">{headerData?.DueDays}</div>
                      </div>
                      <div className="d-flex">
                        <div className="col-6">
                          <b className="JL13">HSN</b>
                        </div>
                        <div className="col-6">{headerData?.HSN_No}</div>
                      </div>

                      <div className="d-flex">
                        <div className="col-6">
                          <b className="JL13">NAME OF GOODS</b>
                        </div>
                        <div className="col-6">{headerData?.NameOfGoods}</div>
                      </div>
                      <div className="d-flex">
                        <div className="col-6">
                          <b className="JL13">PLACE OF SUPPLY
                          </b>
                        </div>
                        <div className="col-6">{headerData?.customerstate}</div>
                      </div>
                      {document?.map((e, i) => {
                        return (
                          <div className="d-flex" key={i}>
                            <div className="col-6">
                              <b className="JL13">{e?.label}</b>
                            </div>
                            <div className="col-6">{e?.value}</div>
                          </div>
                        );
                      })}
                      {/* {headerData?.aadharno !== "" && <div className="d-flex">
                      <div className="col-4">
                        <b className="JL13">AADHAR CARD</b>
                      </div>
                      <div className="col-8">
                        {headerData?.aadharno}
                      </div>
                    </div>} */}
                      {/* <div className="d-flex  position-absolute w-100 pb-2 bottom-0">
                      <div className="d-flex">
                        <b className="JL13 fs-5 pe-2">24K Gold Rate</b>
                        <b className="fs-5"> {NumberWithCommas(headerData?.MetalRate24K, 2)}</b>
                      </div>
                    </div> */}
                    </div>
                  </div>
                  {/* Table Heading */}
                  <div className="pt-1 no_break">
                    <div className="border d-flex">
                      <div
                        className={`${style?.srNoJewerryRetailInvoicePrint} border-end p-1 d-flex align-items-center justify-content-center`}
                      >
                        <p className="fw-bold">Sr#</p>
                      </div>
                      <div
                        className={`${style?.productJewerryRetailInvoicePrint} border-end p-1 fw-bold d-flex align-items-center justify-content-center`}
                      >
                        <p className="fw-bold"> Description</p>
                      </div>
                      <div
                        className={`${style?.materialJewerryRetailInvoicePrint}`}
                        style={{ width: "60%" }}
                      >

                        <div className="d-flex">
                          <div
                            className={`col-2 d-flex align-items-center justify-content-center`}
                          >
                            <p className="fw-bold p-1">Detail</p>
                          </div>
                          <div
                            className={`col-2 d-flex align-items-center justify-content-center `}
                            style={{ width: "13%" }}
                          >
                            <p className="fw-bold p-1">HSN</p>
                          </div>
                          <div
                            className={`col-2 d-flex align-items-center justify-content-center `}
                            style={{ width: "7%" }}
                          >
                            <p className="fw-bold p-1">QTY</p>
                          </div>
                          <div
                            className={`col-2 d-flex align-items-center justify-content-center  p-1 flex-column`}
                            style={{ width: "14%" }}
                          >
                            <p className="fw-bold">Gross. Wt</p>

                          </div>
                          <div
                            className={`col-2 d-flex align-items-center justify-content-center `}
                            style={{ width: "11%" }}
                          >
                            <p className="fw-bold p-1">Net Wt.</p>
                          </div>
                          <div
                            className={`col-2 d-flex align-items-center justify-content-center `}
                            style={{ width: "12%" }}
                          >
                            <p className="fw-bold p-1">Pcs</p>
                          </div>
                          <div
                            className={`col-2 d-flex align-items-center justify-content-center `}
                            style={{ width: "12%" }}
                          >
                            <p className="fw-bold p-1">Wt.</p>
                          </div>
                          <div
                            className={`col-2 d-flex align-items-center justify-content-center`}
                            style={{ width: "14%" }}
                          >
                            <p className="fw-bold p-1">Rate</p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${style?.othersJewerryRetailInvoicePrint}   d-flex align-items-center justify-content-center`}
                        style={{ width: "6%" }}
                      >
                        <p className="fw-bold"> V.A</p>
                      </div>
                      <div
                        className={`${style?.othersJewerryRetailInvoicePrint}   d-flex align-items-center justify-content-center`}
                        style={{ width: "8%" }}
                      >
                        <p className="fw-bold"> V.A</p>
                      </div>
                      <div
                        className={`${style?.othersJewerryRetailInvoicePrint}  d-flex align-items-center justify-content-center`}
                      >
                        <p className="fw-bold">Handling</p>
                      </div>
                      <div
                        className={`${style?.totalJewerryRetailInvoicePrint} d-flex align-items-center justify-content-center`}
                      >
                        <p className="fw-bold">Amount</p>
                      </div>
                    </div>
                  </div>
                  {/* data */}
                  {data.length > 0 &&
                    data.map((e, i) => {
                      console.log("TCL: e", e)
                      return (
                        <>
                          <div
                            className="border-start border-end   d-flex no_break"
                            key={i}
                          >
                            <div
                              className={`${style?.srNoJewerryRetailInvoicePrint} border-end p-1 d-flex align-items-center justify-content-center`}
                            >
                              <p className="">{i + 1}</p>
                            </div>
                            <div
                              className={`${style?.productJewerryRetailInvoicePrint} border-end p-1 `}
                            >
                              <p className="" style={{ wordBreak: "normal" }}>
                                {e?.SubCategoryname} {e?.Categoryname}
                              </p>
                              <p className="" style={{ wordBreak: "normal" }}>
                                {e?.designno} | {e?.SrJobno}
                              </p>
                              {image && (
                                <img
                                  src={e?.DesignImage}
                                  alt=""
                                  onError={handleImageError}
                                  lazy="eagar"
                                  className={`w-100 mx-auto d-block p-1 ${style?.imageJewelleryC}`}
                                  style={{ maxWidth: "75px", maxHeight: "75px" }}
                                />
                              )}
                              {e?.HUID !== "" && (
                                <p
                                  style={{ wordBreak: "normal" }}
                                  className={`text-center ${!image && "pt-3"}`}
                                >
                                  HUID-{e?.HUID}
                                </p>
                              )}
                            </div>
                            <div
                              className={`${style?.materialJewerryRetailInvoicePrint}  `}
                              style={{ width: "60%" }}
                            >
                              <div className=" h-100">
                                {e?.primaryMetal?.map((ele, ind) => {
                                  return (
                                    <div
                                      className={`d-flex`}
                                      key={ind}
                                    >
                                      <div
                                        className={`col-2  d-flex align-items-start`}
                                      >
                                        <p className="p-1 lh-1">
                                          {ele?.ShapeName}
                                        </p>
                                      </div>
                                      <div
                                        className={`col-2  d-flex align-items-start justify-content-center`}
                                        style={{ wordBreak: "normal", textAlign: "right", width: "13%" }}

                                      >
                                        <p
                                          className="p-1 lh-1"
                                          style={{ wordBreak: "normal" }}
                                        >
                                          {e?.HSNNo}
                                        </p>
                                      </div>
                                      <div
                                        className={`col-2 d-flex align-items-start justify-content-center `}
                                        style={{ width: "7%" }}
                                      >
                                        <p className=" p-1">{e?.BulkPurchaseQTY}</p>
                                      </div>
                                      <div
                                        className={`col-2  d-flex align-items-start justify-content-end`}
                                        style={{ width: "14%" }}
                                      >
                                        <p className=" p-1 text-end lh-1">
                                          {fixedValues(e?.grosswt, 3)}
                                        </p>
                                      </div>

                                      <div
                                        className={`col-2  d-flex align-items-start justify-content-end`}
                                        style={{ width: "11%" }}
                                      >
                                        <p className=" p-1 text-end lh-1">
                                          {e?.otherMetals?.length === 0
                                            ? NumberWithCommas(
                                              e?.NetWt + e?.LossWt,
                                              3
                                            )
                                            : NumberWithCommas(ele?.Wt, 3)}
                                        </p>
                                      </div>
                                      <div
                                        className={`col-2 d-flex align-items-start justify-content-center  `}
                                        style={{ width: "12%" }}
                                      >
                                        <p className="fw-bold p-1"></p>
                                      </div>
                                      <div
                                        className={`col-2 d-flex align-items-start justify-content-center  `}
                                        style={{ width: "12%" }}
                                      >
                                        <p className="fw-bold p-1"></p>
                                      </div>
                                      <div
                                        className={`col-2 d-flex align-items-start justify-content-end`}
                                        style={{ width: "14%" }}
                                      >
                                        <p className=" p-1 text-end lh-1">
                                          {NumberWithCommas(
                                            ele?.Rate /
                                            headerData?.CurrencyExchRate,
                                            2
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                                {e?.diamondWt !== 0 && (() => {
                                  const mergedDiamonds = mergeByKey({
                                    data: e?.diamonds,
                                    groupKey: "Rate",
                                    sumFields: ["Pcs", "RMwt", "Amount"]
                                  });

                                  return mergedDiamonds.map((d, i) => (
                                    // <div key={i}>
                                    //   Diamond {d.Pcs} {d.RMwt} {d.Rate}
                                    // </div>
                                    <div className={`d-flex `}>
                                      <div
                                        className={`col-2  d-flex align-items-center`}
                                      >
                                        <p className="p-1 lh-1">DIAMOND</p>
                                      </div>
                                      <div
                                        className={`col-2  d-flex align-items-center`}
                                        style={{ width: "13%" }}
                                      >
                                        <p className="p-1 lh-1"></p>
                                      </div>
                                      <div
                                        className={`col-2 d-flex align-items-center justify-content-center `}
                                        style={{ width: "7%" }}
                                      >
                                        <p className="fw-bold p-1"></p>
                                      </div>
                                      <div
                                        className={`col-2  d-flex align-items-center justify-content-end`}
                                        style={{ width: "14%" }}
                                      >
                                        <p className=" p-1 text-end lh-1"></p>
                                      </div>
                                      <div
                                        className={`col-2  p-1 d-flex align-items-center justify-content-end`}
                                        style={{ width: "11%" }}
                                      >
                                        <p className=" text-end lh-1">

                                        </p>
                                      </div>

                                      <div
                                        className={`col-2 d-flex align-items-center justify-content-center `}
                                        style={{ width: "12%" }}
                                      >
                                        <p className=" p-1">{NumberWithCommas(d.Pcs)}{" "}</p>
                                      </div>
                                      <div
                                        className={`col-2 d-flex align-items-center justify-content-center `}
                                        style={{ width: "12%" }}
                                      >
                                        <p className=" p-1">{NumberWithCommas(d.RMwt, 2)}{" Ctw"}</p>
                                      </div>
                                      <div
                                        className={`col-2  d-flex align-items-center justify-content-end`}
                                        style={{ width: "14%" }}
                                      >
                                        <p className=" p-1 text-end lh-1" >{NumberWithCommas(d.Rate, 2)}{" "}</p>
                                      </div>

                                    </div>
                                  ));
                                })()}

                                {e?.colorStoneWt !== 0 && (() => {
                                  const mergedCS = mergeByKey({
                                    data: e?.colorstones,
                                    groupKey: "Rate",
                                    sumFields: ["Pcs", "RMwt", "Amount"]
                                  });

                                  return mergedCS.map((d, i) => (
                                    // <div key={i}>
                                    //   Diamond {d.Pcs} {d.RMwt} {d.Rate}
                                    // </div>
                                    <div className={`d-flex `}>
                                      <div
                                        className={`col-2  d-flex align-items-center`}
                                      >
                                        <p className="p-1 lh-1">COLORSTONE</p>
                                      </div>
                                      <div
                                        className={`col-2  d-flex align-items-center`}
                                        style={{ width: "13%" }}
                                      >
                                        <p className="p-1 lh-1"></p>
                                      </div>
                                      <div
                                        className={`col-2 d-flex align-items-center justify-content-center `}
                                        style={{ width: "7%" }}
                                      >
                                        <p className="fw-bold p-1"></p>
                                      </div>
                                      <div
                                        className={`col-2  d-flex align-items-center justify-content-end`}
                                        style={{ width: "14%" }}
                                      >
                                        <p className=" p-1 text-end lh-1"></p>
                                      </div>
                                      <div
                                        className={`col-2  p-1 d-flex align-items-center justify-content-end`}
                                        style={{ width: "11%" }}
                                      >
                                        <p className=" text-end lh-1">

                                        </p>
                                      </div>

                                      <div
                                        className={`col-2 d-flex align-items-center justify-content-center `}
                                        style={{ width: "12%" }}
                                      >
                                        <p className=" p-1">{NumberWithCommas(d.Pcs)}{" "}</p>
                                      </div>
                                      <div
                                        className={`col-2 d-flex align-items-center justify-content-center `}
                                        style={{ width: "12%" }}
                                      >
                                        <p className=" p-1">{NumberWithCommas(d.RMwt, 2)}{" Ctw"}</p>
                                      </div>
                                      <div
                                        className={`col-2  d-flex align-items-center justify-content-end`}
                                        style={{ width: "14%" }}
                                      >
                                        <p className=" p-1 text-end lh-1" >{NumberWithCommas(d.Rate, 2)}{" "}</p>
                                      </div>

                                    </div>
                                  ));
                                })()}


                                {e?.miscs?.map((ele, ind) => {
                                  return (
                                    <div className={`d-flex border-bottom`}>
                                      <div
                                        className={`col-2 border-end d-flex align-items-center`}
                                      >
                                        <p className="p-1 lh-1">MISC</p>
                                      </div>
                                      <div
                                        className={`col-2 border-end d-flex align-items-center`}
                                        style={{ width: "13%" }}
                                      >
                                        <p className="p-1 lh-1"></p>
                                      </div>
                                      <div
                                        className={`col-2 border-end d-flex align-items-center justify-content-end`}
                                      >
                                        <p className=" p-1 text-end lh-1"></p>
                                      </div>
                                      <div
                                        className={`col-2 border-end p-1 d-flex align-items-center justify-content-end`}
                                      >
                                        <p className=" text-end lh-1">
                                          {NumberWithCommas(ele?.Wt, 3)}
                                        </p>
                                      </div>
                                      <div
                                        className={`col-2 border-end d-flex align-items-center justify-content-end`}
                                      >
                                        <p className=" p-1 text-end lh-1"></p>
                                      </div>
                                      <div
                                        className={`col-2 d-flex align-items-center justify-content-end`}
                                      >
                                        <p className=" p-1 text-end lh-1">
                                          {NumberWithCommas(
                                            ele?.Amount / ele?.Wt,
                                            2
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                                {e?.otherMetals?.length !== 0 && (
                                  <div className={`d-flex border-bottom`}>
                                    <div
                                      className={`col-2 border-end d-flex align-items-center`}
                                    >
                                      <p className="p-1 lh-1"></p>
                                    </div>
                                    <div
                                      className={`col-2 border-end d-flex align-items-center`}
                                    >
                                      <p className="p-1 lh-1"></p>
                                    </div>
                                    <div
                                      className={`col-2 border-end d-flex align-items-center justify-content-end`}
                                    >
                                      <p className=" p-1 text-end lh-1"></p>
                                    </div>
                                    <div
                                      className={`col-2 border-end p-1 d-flex align-items-center justify-content-end`}
                                    >
                                      <p className=" text-end lh-1">
                                        {NumberWithCommas(
                                          e?.otherMetals?.reduce(
                                            (acc, cObj) => acc + cObj?.Wt,
                                            0
                                          ),
                                          3
                                        )}
                                      </p>
                                    </div>
                                    <div
                                      className={`col-2 border-end d-flex align-items-center justify-content-end`}
                                    >
                                      <p className=" p-1 text-end lh-1"></p>
                                    </div>
                                    <div
                                      className={`col-2 d-flex align-items-center justify-content-end`}
                                    >
                                      <p className=" p-1 text-end lh-1"></p>
                                    </div>
                                  </div>
                                )}
                                {e?.findingWt !== 0 && (
                                  <div className={`d-flex border-bottom`}>
                                    <div
                                      className={`col-2 border-end d-flex align-items-center`}
                                    >
                                      <p className="p-1 lh-1"></p>
                                    </div>
                                    <div
                                      className={`col-2 border-end d-flex align-items-center`}
                                    >
                                      <p className="p-1 lh-1"></p>
                                    </div>
                                    <div
                                      className={`col-2 border-end d-flex align-items-center justify-content-end`}
                                    >
                                      <p className=" p-1 text-end lh-1"></p>
                                    </div>
                                    <div
                                      className={`col-2 border-end p-1 d-flex align-items-center justify-content-end`}
                                    >
                                      <p className=" text-end lh-1">
                                        {NumberWithCommas(e?.findingWt, 3)}
                                      </p>
                                    </div>
                                    <div
                                      className={`col-2 border-end d-flex align-items-center justify-content-end`}
                                    >
                                      <p className=" p-1 text-end lh-1"></p>
                                    </div>
                                    <div
                                      className={`col-2 d-flex align-items-center justify-content-end`}
                                    >
                                      <p className=" p-1 text-end lh-1"></p>
                                    </div>
                                  </div>
                                )}
                                {e?.primaryMetal?.length === 0 &&
                                  e?.diamondWt === 0 &&
                                  e?.colorStoneWt === 0 &&
                                  e?.miscsWt === 0 &&
                                  e?.findingWt !== 0 && (
                                    <div className="d-flex">
                                      <div className={` border-end`}>
                                        <p className="p-1 lh-1"></p>
                                      </div>
                                      <div className={` border-end`}>
                                        <p className="p-1 lh-1"></p>
                                      </div>
                                      <div className={` border-end`}>
                                        <p className="p-1 text-end lh-1"></p>
                                      </div>
                                      <div className={` border-end p-1 `}>
                                        <p className="text-end lh-1"></p>
                                      </div>
                                      <div className={`border-end `}>
                                        <p className="p-1 text-end lh-1"></p>
                                      </div>
                                      <div className={` `}>
                                        <p className="p-1 text-end lh-1"></p>
                                      </div>
                                    </div>
                                  )}
                                {/* 
                        {e?.materials.length > 0 ? e?.materials.map((ele, ind) => {
                          return <div className={`d-flex ${ind !== e?.materials.length - 1 && 'border-bottom'}`} key={ind}>
                            <div className={`col-2 border-end d-flex align-items-center`}><p className="p-1 lh-1">{ele?.MasterManagement_DiamondStoneTypeid === 4 ? ele?.ShapeName : ele?.MasterManagement_DiamondStoneTypeName}</p></div>
                            <div className={`col-2 border-end d-flex align-items-center`}><p className="p-1 lh-1">{ele?.MasterManagement_DiamondStoneTypeid === 4 && ele?.QualityName}{((ind === 0 && e?.Tunch !== 0) && ` / ${NumberWithCommas(e?.Tunch, 2)}%`)}</p></div>
                            <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1">{ele?.MasterManagement_DiamondStoneTypeid === 4 && fixedValues(e?.grosswt, 3)}</p></div>
                            <div className={`col-2 border-end p-1 d-flex align-items-center justify-content-end`}><p className=" text-end lh-1">{ele?.MasterManagement_DiamondStoneTypeid !== 4 && fixedValues(ele?.Wt, 3)}</p></div>
                            <div className={`col-2 border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1">{ele?.MasterManagement_DiamondStoneTypeid === 4 && fixedValues(e?.MetalDiaWt, 3)}</p></div>
                            <div className={`col-2 d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1">{ele?.MasterManagement_DiamondStoneTypeid === 4 ? NumberWithCommas(ele?.Rate, 2) : NumberWithCommas(ele?.Amount / ele?.Wt, 2)}</p></div>
                          </div>
                        }) : <div className="d-flex">
                          <div className={` border-end`}><p className="p-1 lh-1"></p></div>
                          <div className={` border-end`}><p className="p-1 lh-1"></p></div>
                          <div className={` border-end`}><p className="p-1 text-end lh-1"></p></div>
                          <div className={` border-end p-1 `}><p className="text-end lh-1"></p></div>
                          <div className={`border-end `}><p className="p-1 text-end lh-1"></p></div>
                          <div className={` `}><p className="p-1 text-end lh-1"></p></div>
                        </div>} */}
                              </div>
                            </div>
                            <div
                              className={`${style?.metalMakingJewerryRetailInvoicePrint}  align-items-start d-flex justify-content-end`}
                              style={{ width: "6%" }}
                            >
                              <p className="text-end p-1">
                                {e?.Wastage !== 0 ? `${NumberWithCommas(e?.Wastage, 2)}` : "0.00"}
                              </p>
                            </div>
                            <div
                              className={`${style?.othersJewerryRetailInvoicePrint}  align-items-start d-flex justify-content-end`}
                              style={{ width: "8%" }}
                            >
                              <p className=" text-end p-1">


                                {


                                  NumberWithCommas(
                                    (e?.MakingAmount ?? 0) +
                                    (e?.miscsAmount ?? 0) +
                                    (e?.OtherCharges ?? 0) +
                                    // (e?.TotalDiamondHandling ?? 0) +
                                    (e?.TotalCsSetcost ?? 0) +
                                    (e?.TotalDiaSetcost ?? 0) +
                                    (e?.totals?.finding?.SettingAmount ?? 0) / headerData?.CurrencyExchRate
                                    , 2
                                  )
                                }
                              </p>
                            </div>
                            <div
                              className={`${style?.othersJewerryRetailInvoicePrint}  align-items-start d-flex justify-content-end`}
                            >
                              <p className=" text-end p-1">
                                {/* {NumberWithCommas(e?.OtherCharges, 2)} */}
                                {NumberWithCommas(e?.TotalDiamondHandling, 2)}
                              </p>
                            </div>
                            <div
                              className={`${style?.totalJewerryRetailInvoicePrint} `}
                            >

                              {e?.primaryMetal?.map((ele, ind) => {
                                return (


                                  <p className=" text-end p-1">

                                    {NumberWithCommas((e?.otherMetals?.length === 0 ? e?.NetWt + e?.LossWt : ele?.Wt) * (ele?.Rate / headerData?.CurrencyExchRate), 2)}
                                  </p>
                                );
                              })}
                              {e?.diamondWt !== 0 && (() => {
                                const mergedDiamonds = mergeByKey({
                                  data: e?.diamonds,
                                  groupKey: "Rate",
                                  sumFields: ["Pcs", "RMwt", "Amount"]
                                });

                                return mergedDiamonds.map((d, i) => (
                                  <p className=" text-end p-1">
                                    {NumberWithCommas(d?.RMwt * d?.Rate, 2)}
                                  </p>
                                ));
                              })()
                              }
                              {e?.diamondWt !== 0 && (() => {
                                const mergedDiamonds = mergeByKey({
                                  data: e?.colorstones,
                                  groupKey: "Rate",
                                  sumFields: ["Pcs", "RMwt", "Amount"]
                                });

                                return mergedDiamonds.map((d, i) => (
                                  <p className=" text-end p-1">
                                    {(d?.RMwt * d?.Rate, 2)}
                                  </p>
                                ));
                              })()
                              }



                            </div>
                          </div>

                          <div className="border-start border-end border-bottom d-flex" style={{ borderTop: "none"}}>
                            <div
                              className={`${style?.srNoJewerryRetailInvoicePrint} border-end    p-1 d-flex align-items-center justify-content-center`}
                            >
                              <p className="fw-bold"> </p>
                            </div>
                            <div
                              className={`${style?.productJewerryRetailInvoicePrint} border-end p-1 fw-bold d-flex align-items-center justify-content-center`}
                            >
                              <p className="fw-bold"> </p>
                            </div>
                            <div
                              className={`${style?.materialJewerryRetailInvoicePrint}`}
                              style={{ width: "60%" }}
                            >

                              <div className="d-flex">
                                <div
                                  className={`col-2 d-flex align-items-center justify-content-center`}
                                >
                                  <p className="fw-bold p-1"></p>
                                </div>
                                <div
                                  className={`col-2 d-flex align-items-center justify-content-center `}
                                  style={{ width: "13%" }}
                                >
                                  <p className="fw-bold p-1"> </p>
                                </div>
                                <div
                                  className={`col-2 d-flex align-items-center justify-content-center `}
                                  style={{ width: "7%" }}
                                >
                                  <p className="fw-bold p-1"> </p>
                                </div>
                                <div
                                  className={`col-2 d-flex align-items-center justify-content-center  p-1 flex-column`}
                                  style={{ width: "14%" }}
                                >
                                  <p className="fw-bold"> </p>

                                </div>
                                <div
                                  className={`col-2 d-flex align-items-center justify-content-center `}
                                  style={{ width: "11%" }}
                                >
                                  <p className="fw-bold p-1"> </p>
                                </div>
                                <div
                                  className={`col-2 d-flex align-items-center justify-content-center `}
                                  style={{ width: "12%" }}
                                >
                                  <p className="fw-bold p-1"> </p>
                                </div>
                                <div
                                  className={`col-2 d-flex align-items-center justify-content-center `}
                                  style={{ width: "12%" }}
                                >
                                  <p className="fw-bold p-1"> </p>
                                </div>
                                <div
                                  className={`col-2 d-flex align-items-center justify-content-center`}
                                  style={{ width: "14%" }}
                                >
                                  <p className="fw-bold p-1"> </p>
                                </div>
                              </div>
                            </div>
                            <div
                              className={`${style?.othersJewerryRetailInvoicePrint}   d-flex align-items-center justify-content-center`}
                              style={{ width: "6%" }}
                            >
                              <p className="fw-bold">  </p>
                            </div>
                            <div
                              className={`${style?.othersJewerryRetailInvoicePrint}   d-flex align-items-center justify-content-center`}
                              style={{ width: "8%" }}
                            >
                              <p className="fw-bold">  </p>
                            </div>
                            <div
                              className={`${style?.othersJewerryRetailInvoicePrint}  d-flex align-items-center justify-content-center`}
                            >
                              <p className="fw-bold"> </p>
                            </div>
                            <div
                              className={`${style?.totalJewerryRetailInvoicePrint} d-flex align-items-center justify-content-end`}
                              style={{paddingRight:"4px"}}
                            >
                              <p className="fw-bold">
                                {NumberWithCommas(
                                  (e.UnitCost) 
                                ,2)}
                              </p>
                            </div>
                          </div>
                        </>

                      );
                    })}
                  {/* total */}
                  <div
                    className={`${style?.minHeight20RetailinvoicePrint3} border-start border-end border-bottom d-flex no_break`}
                  >
                    <div
                      className={`${style?.srNoJewerryRetailInvoicePrint} border-end p-1`} style={{ width: "5.6%" }}
                    >
                      <p className="fw-bold"></p>
                    </div>
                    <div
                      className={`${style?.srNoJewerryRetailInvoicePrint} border-end p-1`}
                      style={{ width: "23.6%" }}

                    >
                      <p className="fw-bold"></p>
                    </div>
                    <div
                      className={`${style?.productJewerryRetailInvoicePrint}   p-1 fw-bold d-flex align-items-center`}
                    >
                      <p className="fw-bold" style={{ fontSize: "17px" }}>
                        TOTAL
                      </p>
                    </div>
                    <div
                      className={`${style?.materialJewerryRetailInvoicePrint}   d-flex`}
                      style={{ width: "60%" }}
                    >
                      <div
                        className={`${style?.w_20JewerryRetailInvoicePrint}  d-flex align-items-center justify-content-end`}
                      >
                        <p className="fw-bold p-1 lh-1"></p>
                      </div>
                      <div
                        className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-end`}
                      ></div>
                      <div
                        className={`${style?.w_20JewerryRetailInvoicePrint}  d-flex align-items-center justify-content-end`}
                      >

                      </div>
                      <div
                        className={`${style?.w_20JewerryRetailInvoicePrint}   p-1 flex-column d-flex align-items-end justify-content-center`}
                      >

                      </div>
                      <div
                        className={`${style?.w_20JewerryRetailInvoicePrint}    d-flex align-items-center justify-content-end`}
                      >

                      </div>
                      <div
                        className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-end`}
                      >
                        <p className="fw-bold p-1 text-end lh-1"></p>
                      </div>
                    </div>
                    <div
                      className={`${style?.metalMakingJewerryRetailInvoicePrint}   flex-column d-flex align-items-center justify-content-end`}
                    >
                      <p className="fw-bold text-end p-1"></p>
                    </div>
                    <div
                      className={`${style?.othersJewerryRetailInvoicePrint}   d-flex align-items-center justify-content-end`}
                    >
                    </div>
                    <div
                      className={`${style?.totalJewerryRetailInvoicePrint} d-flex align-items-center justify-content-end`}
                      style={{ width: "12%" }}
                    >
                      <p className="fw-bold text-end p-1">

                        {NumberWithCommas(
                                                  total?.total / headerData?.CurrencyExchRate,
                                                  2
                                                )}
                      </p>
                    </div>
                  </div>
                  {/* tax */}
                  <div className="d-flex border-start border-end border-bottom w-100 no_break">
                    <div
                      className={`d-flex justify-content-between align-items-start  border-end  `}
                      style={{width:"66%"}}
                    >
                      <div
                        className={`${style?.wordsJewerryRetailInvoicePrint}p-2 d-flex align-items-center  `   }
                        style={{height:"100%"}}
                      >
                        <div className="p-2 pt-4">
                          <p>In Words {headerData?.Currencyname}</p>
                          <p className="fw-bold">
                            {toWords.convert(
                              +(
                                total?.beforeTax /
                                headerData?.CurrencyExchRate +
                                taxes?.reduce(
                                  (acc, cObj) =>
                                    acc +
                                    +cObj?.amount /
                                    headerData?.CurrencyExchRate,
                                  0
                                ) +
                                headerData?.AddLess /
                                headerData?.CurrencyExchRate
                              )?.toFixed(2)
                            )}{" "}
                            Only
                          </p>
                        </div>
                      </div>
                        
                      <div
                        className={`${style?.RemarkJewelleryInvoicePrintC} p-2`}
                      >

                      </div>
                     {summ &&
                         <div
                         className="col_r_2 p-1 border-start "
                         style={{ width: "37%",height:"100%"  }}
                       >
                         {summary.map((e, i) => {
                           return (
                             <React.Fragment key={i}>
                               {e?.value === 0 ? (
                                 ""
                               ) : (
                                 <div
                                   className="d-flex"
                                    
                                   key={i}
                                 >
                                   <p key={i} className="remark_fs fs_jti_Sale" style={{ minWidth: '50%' }}>
                                     {e?.label}:{" "}
                                   </p>
                                   <p className="remark_fs fs_jti_Sale">
                                     {NumberWithCommas(e?.value, 3)} {e?.gm ? "gm" : "cts"}
                                   </p>
                                 </div>
                               )}
                             </React.Fragment>
                           );
                         })}
           </div>
                     }
                    </div>
                    <div
                      className={`${style?.discountJewerryRetailInvoicePrint456} d-flex`}
                    >
                      <div
                        className={`${style?.wordsJewellryRetailInvoice4Taxes} border-end`}
                      >
                        <p className="pb-1 px-1 text-end">Discount</p>
                        <p className="pb-1 px-1 text-end">
                          Total Amt before Tax
                        </p>
                        {taxes.length > 0 &&
                          taxes.map((e, i) => {
                            return (
                              <p className="pb-1 px-1 text-end" key={i}>
                                {e?.name} @ {e?.per}
                              </p>
                            );
                          })}
                        {headerData?.AddLess !== 0 && (
                          <p className="pb-1 px-1 text-end">
                            {headerData?.AddLess >= 0 ? "Add" : "Less"}
                          </p>
                        )}

                           

                          {
                          headerData?.FreightCharges !== 0 &&
                          <p className="pb-1 px-1 text-end">
                          { headerData?.ModeOfDel }
                        </p>
                        }


                        
                        {
                          retail &&

                          <>
                          <p className="pb-1 px-1 text-end">
                          Total Amt after Tax
                        </p>
                           <p className="pb-1 px-1 text-end">Old Gold</p>
                   
                   
                   <p className="pb-1 px-1 text-end">Recv. in Cash</p>
                   
                 
                  
                   {/* <p className="pb-1 px-1">Recv. in Bank</p> */}
                   <p className="pb-1 px-1 text-end">Advance</p>
                   <p className="pb-1 px-1 text-end">Net Bal. Amount</p>
                          </>
                        }
                        <p className="fw-bold p-1 border-top text-end">
                          GRAND TOTAL
                        </p>
                      </div>
                      <div
                        className={`${style?.wordsJewellryRetailInvoice4TaxesNumbers}`}
                      >
                        <p className="text-end pb-1 px-1">
                          {NumberWithCommas(total?.discount, 2)}{/** Discount */}
                        </p>
                        <p className="text-end pb-1 px-1">
                          {NumberWithCommas(
                            total?.beforeTax / headerData?.CurrencyExchRate,
                            2
                          )}{/** Before Tax */}
                        </p>
                        {taxes.length > 0 &&
                          taxes.map((e, i) => {
                            return (
                              <p className="pb-1 px-1 text-end" key={i}>
                                {NumberWithCommas(
                                  +e?.amount / headerData?.CurrencyExchRate,
                                  2
                                )}
                              </p>
                            );
                          })} {/** CGST SGST */}
                        {headerData?.AddLess !== 0 && (
                          <p className="pb-1 px-1 text-end">
                            {NumberWithCommas(
                              headerData?.AddLess /
                              headerData?.CurrencyExchRate,
                              2
                            )}
                          </p>
                        )} {/** Add/Less */}

                        {
                          headerData?.FreightCharges !== 0 &&
                          <p className="pb-1 px-1 text-end">
                          {NumberWithCommas(
                            headerData?.FreightCharges  ,
                            2
                          )}
                        </p>
                        }

                          
                        

                       {
                        retail &&

                        <>
                        <p className="pb-1 px-1 text-end">
                          {NumberWithCommas(
                            total?.afterTax +  headerData?.FreightCharges ||0  / headerData?.CurrencyExchRate,
                            2
                          )} {/** After Tax */}
                        </p>
                        <p className="pb-1 px-1 text-end">
                          {NumberWithCommas(headerData?.OldGoldAmount, 2)} {/** Old Gold */}
                        </p>
                         <p className="pb-1 px-1 text-end">
                          {NumberWithCommas(headerData?.CashReceived, 2)} {/** Amount That Receive In Cash */}
                        </p>
                        {bank.length > 0 &&
                          bank.map((e, i) => {
                            return (
                              <p className="pb-1 px-1 text-end" key={i}>
                                {NumberWithCommas(e?.amount, 2)} {/** Amount That Receive In Bank */}
                              </p>
                            );
                          })}
                        {/* <p className="pb-1 px-1 text-end">{NumberWithCommas(headerData?.BankReceived, 2)}</p> */}
                        <p className="pb-1 px-1 text-end">
                          {NumberWithCommas(headerData?.AdvanceAmount, 2
                          )} {/** Advance Given Amount */}
                        </p>


                        
                        <p className="pb-1 px-1 text-end">
                          {
                            NumberWithCommas(difference, 2)
                          } {/** Net Balance Amount */}
                        </p>
                        </>
                       }





                        <p className="fw-bold text-end p-1 border-top">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: headerData?.Currencysymbol,
                            }}
                          ></span>
                           {NumberWithCommas(
                                                      (total?.beforeTax / headerData?.CurrencyExchRate +
                                                      
                                                        taxes?.reduce(
                                                          (acc, cObj) =>
                                                            acc +
                                                            +cObj?.amount / headerData?.CurrencyExchRate,
                                                          0
                                                        ) +
                                                        headerData?.AddLess /
                                                          headerData?.CurrencyExchRate)+headerData?.FreightCharges ||0 ,
                                                      2
                                                    )} {/** Grand Total */}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* remark */}
                  <div className="border-start border-end border-bottom p-2 no_break pb-3">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: headerData?.Declaration,
                      }}
                      className={`${style?.declarationUlJewelleryRetailInvoicePrntc} ${style?.retailinvoicePrint3}`}
                    ></div>
                  </div>
                  {/* bank detail */}
                  <div className="border-start border-end border-bottom d-flex no_break">
                    <div className="col-4 p-2 border-end">
                      <p className="fw-bold">Bank Detail</p>
                      <p>Bank name: {headerData?.bankname}</p>
                      <p style={{ wordBreak: "normal" }}>
                        Branch: {headerData?.bankaddress}
                      </p>
                      {/* <p>{headerData?.PinCode}</p> */}
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
                      <p className="fw-bold">{headerData?.CompanyFullName}</p>
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

export default InvoicePrintN;
