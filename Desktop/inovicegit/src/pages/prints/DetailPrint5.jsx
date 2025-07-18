import React, { useEffect, useState } from "react";
import {
  HeaderComponent,
  NumberWithCommas,
  apiCall,
  checkMsg,
  handleImageError,
  handlePrint,
  isObjectEmpty,
  taxGenrator,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import style from "../../assets/css/prints/detailPrint5.module.css";
import { MetalShapeNameWiseArr } from "../../GlobalFunctions/MetalShapeNameWiseArr";
import ImageComponent from "../../components/ImageComponent ";
import { styled } from "@mui/material";
const DetailPrint5 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [logoStyle, setlogoStyle] = useState({ maxWidth: "120px", maxHeight: "95px", minHeight: "95px" });
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [image, setImage] = useState(true);
  const [header, setHeader] = useState(null);
  const [headerData, setHeaderData] = useState({});
  const [address, setAddress] = useState([]);
  const [total, setTotal] = useState({
    diaTotal: {
      Pcs: 0,
      Wt: 0,
      Amount: 0,
    },
    metalTotal: {
      Wt: 0,
      NL: 0,
      Amount: 0,
    },
    csTotal: {
      Pcs: 0,
      Wt: 0,
      Amount: 0,
    },
    OtherCharges: 0,
    MaKingCharge_Unit: 0,
    MakingAmount: 0,
    TotalAmount: 0,
    gold24kt: 0,
    grosswt: 0,
  });
  
  const [taxes, setTaxes] = useState([]);
  const [diamondDetail, setdDiamondDetails] = useState([]);
  const [otherAmt, setOtherAmt] = useState(0);
  const [discountAmt, setDiscountAmt] = useState(0);
  const [brokarage, setBrokarage] = useState([]);
  const [isImageWorking, setIsImageWorking] = useState(true);

  const [MetShpWise, setMetShpWise] = useState([]);
  const [notGoldMetalTotal, setNotGoldMetalTotal] = useState(0);
  const [notGoldMetalWtTotal, setNotGoldMetalWtTotal] = useState(0);

  const handleImageErrors = () => {
    setIsImageWorking(false);
  };

  const loadData = (data) => {
    let head = HeaderComponent("1", data?.BillPrint_Json[0]);
    setHeader(head);
    setHeaderData(data?.BillPrint_Json[0]);
    let adr = data?.BillPrint_Json[0]?.Printlable.split(`\r\n`);
    setAddress(adr);
    let resultArr = [];
    let totals = { ...total };
    let otherAmount = 0;
    let discountAmts = 0;

    let met_shp_arr = MetalShapeNameWiseArr(data?.BillPrint_Json2);
      
    setMetShpWise(met_shp_arr);
    let tot_met = 0;
    let tot_met_wt = 0;
    met_shp_arr?.forEach((e, i) => {
      tot_met += e?.Amount;
      tot_met_wt += e?.metalfinewt;
    })    
    setNotGoldMetalTotal(tot_met);
    setNotGoldMetalWtTotal(tot_met_wt);

    data?.BillPrint_Json1.forEach((e, i) => {
      let obj = { ...e };
      let diamonds = [];
      let colorStones = [];
      let metals = [];
      let otherAmt = 0;
      let diaTotal = {
        Pcs: 0,
        Wt: 0,
        Amount: 0,
      };
      let metalTotal = {
        Wt: 0,
        NL: 0,
        Amount: 0,
      };
      let csTotal = {
        Pcs: 0,
        Wt: 0,
        Amount: 0,
      };
      let findingSetting = 0;
      discountAmts += e?.DiscountAmt;
      otherAmount += e?.OtherCharges + e?.TotalDiamondHandling;
      otherAmt += e?.OtherCharges + e?.TotalDiamondHandling;
      let findingTotal = {
        Pcs: 0,
        Wt: 0,
        Amount: 0,
      }
      let netWtLoss = 0;
      let count = 0;
      data?.BillPrint_Json2.forEach((ele, ind) => {
        if (ele?.StockBarcode === e?.SrJobno) {
          obj.MakingAmount += ele.SettingAmount;
          if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
            diamonds.push(ele);
            diaTotal.Wt += ele?.Wt;
            diaTotal.Amount += ele?.Amount;
            diaTotal.Pcs += ele?.Pcs;

          } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
            colorStones.push(ele);
            csTotal.Wt += ele?.Wt;
            csTotal.Amount += ele?.Amount;
            csTotal.Pcs += ele?.Pcs;
          } else if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            metals.push(ele);
            metalTotal.Wt += ele?.Wt;
            metalTotal.Amount += ele?.Amount;
            if(ele?.IsPrimaryMetal === 1){
              netWtLoss += ele?.Wt;
            }else{
              count ++;
            }
          } else if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
            otherAmount += ele?.Amount;
            otherAmt += ele?.Amount;
          } else if(ele?.MasterManagement_DiamondStoneTypeid === 5) {
            findingTotal.Pcs += ele?.Pcs;
            findingTotal.Wt += ele?.Wt;
            findingTotal.Amount += ele?.Amount;
            findingSetting += ele?.SettingAmount;
          }
        }
      });
      totals.diaTotal.Amount += diaTotal.Amount;
      totals.diaTotal.Pcs += diaTotal.Pcs;
      totals.diaTotal.Wt += diaTotal.Wt;
      // totals.gold24kt += e?.convertednetwt;
      totals.gold24kt += e?.PureNetWt;

      totals.csTotal.Amount += csTotal.Amount;
      totals.csTotal.Pcs += csTotal.Pcs;
      totals.csTotal.Wt += csTotal.Wt;

      totals.OtherCharges += otherAmt;
      totals.MaKingCharge_Unit += obj?.MaKingCharge_Unit;

      totals.MakingAmount += obj?.MakingAmount - findingSetting;
      totals.TotalAmount += obj?.TotalAmount;
      totals.grosswt += obj?.grosswt;

      // metalTotal.NL += e?.NetWt + e?.LossWt;
    
      metalTotal.Wt -= metals[0].Wt;
      metals[0].Wt = obj?.NetWt + diaTotal?.Wt / 5;
      metalTotal.Wt += metals[0].Wt;
      totals.metalTotal.Wt += metalTotal.Wt;
      // totals.metalTotal.NL += metalTotal.NL;
      totals.metalTotal.Amount += metalTotal.Amount;

      if(count === 0){
        netWtLoss = e?.NetWt + e?.LossWt;
      }
      totals.metalTotal.NL += netWtLoss;
      metalTotal.NL += netWtLoss;
      obj.diamonds = diamonds;
      obj.netWtLoss = netWtLoss;
      obj.colorStones = colorStones;
      obj.metals = metals;
      obj.findingSetting = findingSetting;
      obj.diaTotal = diaTotal;
      obj.metalTotal = metalTotal;
      obj.csTotal = csTotal;
      obj.otherAmt = otherAmt;
      obj.findingTotal = findingTotal;
      resultArr.push(obj);
    });
    setDiscountAmt(discountAmts);
    let taxValue = taxGenrator(data?.BillPrint_Json[0], totals?.TotalAmount);
    setTaxes(taxValue);
    setOtherAmt(otherAmount);
    let diamondDetails = [];

    data?.BillPrint_Json2.forEach((ele, ind) => {
      if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
        if (ele?.ShapeName === "RND") {
          let findRnd = diamondDetails.findIndex(
            (elem, index) =>
              elem?.ShapeName === ele?.ShapeName &&
              elem?.Colorname === ele?.Colorname &&
              elem?.QualityName === ele?.QualityName
          );
          if (findRnd === -1) {
            let obj = { ...ele };
            obj.label = "RND";
            diamondDetails.push(obj);
          } else {
            diamondDetails[findRnd].Wt += ele?.Wt;
            diamondDetails[findRnd].Pcs += ele?.Pcs;
          }
        } else {
          let findOther = diamondDetails.findIndex(
            (elem, index) => elem?.label === "OTHER"
          );
          if (findOther === -1) {
            let obj = { ...ele };
            obj.label = "OTHER";
            diamondDetails.push(obj);
          } else {
            diamondDetails[findOther].Wt += ele?.Wt;
            diamondDetails[findOther].Pcs += ele?.Pcs;
          }
        }
      }
    });

    diamondDetails.sort((a, b) => {
      if (a.label === "OTHER") {
        return -1;
      } else if (b.label === "OTHER") {
        return -1;
      } else {
        return 0;
      }
    });

    setdDiamondDetails(diamondDetails);

    totals.TotalAmount +=
      taxValue.reduce((acc, cbj) => {
        return acc + +cbj?.amount;
      }, 0) + data?.BillPrint_Json[0]?.AddLess;
    setData(resultArr);
    setTotal(totals);

    resultArr.sort((a, b) => {
      const designNoA = a.designno;
      const designNoB = b.designno;
  
      // Convert design numbers to actual numbers for numeric comparison
      const designNoANumber = parseInt(designNoA);
      const designNoBNumber = parseInt(designNoB);
  
      // If both designnos are numbers, compare them numerically
      if (!isNaN(designNoANumber) && !isNaN(designNoBNumber)) {
          return designNoANumber - designNoBNumber;
      }
  
      // If only one designno is a number, it should come before the other
      if (!isNaN(designNoANumber)) {
          return -1;
      }
      if (!isNaN(designNoBNumber)) {
          return 1;
      }
  
      // Both designnos are strings, compare them as strings
      return designNoA.localeCompare(designNoB);
  });

    let brokr = (data?.BillPrint_Json[0]?.Brokerage.split("@-@"));
    brokr = brokr.map(ele => ele?.split('#-#'));
    setBrokarage(brokr);
  };

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
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

  return loader ? (
    <Loader />
  ) : msg === "" ? (
    <div className={`container container-fluid max_width_container mt-1 ${style?.detailPrint5} pad_60_allPrint detailPrint5Container`} >
      {/* buttons */}
      <div
        className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}
      >
        <div className="form-check pe-3 pt-2">
          <input
            className="form-check-input border-dark"
            type="checkbox"
            checked={image}
            id="imghs"
            onChange={(e) => setImage(!image)}
          />
          <label className="form-check-label" htmlFor="imghs">With Image</label>
        </div>
        <div className="form-check ps-3">
          <input
            type="button"
            className="btn_white blue py-1 mt-2"
            value="Print"
            onClick={(e) => handlePrint(e)}
          />
        </div>
      </div>
      {/* header */}
      {/* {header} */}
      <div className={`${style.headline} headerTitle headline_dp5 target_header`}>{headerData?.PrintHeadLabel}</div>
        <div className={` target_header d-flex justify-content-between`}>
          <div className={` p-2`}>
            <div  style={{ fontWeight: "bold" }}>
              {headerData?.CompanyFullName}
            </div>
            <div >{headerData?.CompanyAddress}</div>
            <div >{headerData?.CompanyAddress2}</div>
            <div >{headerData?.CompanyCity}-{headerData?.CompanyPinCode},{headerData?.CompanyState}({headerData?.CompanyCountry})</div>
            {/* <div >Tell No: {headerData?.CompanyTellNo}</div> */}
            {/* <div >Tell No:  {headerData?.CompanyTellNo}</div> */}
          <div >
            {headerData?.CompanyEmail} | {headerData?.CompanyWebsite}
          </div>
          <div >
            {/* {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber} */}
            {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber}
          </div>
          <div >Toll Free No:  {headerData?.CompanyTellNo}</div>
        </div>
        <div style={{ width: "30%" }} className="d-flex justify-content-end align-item-center h-100">
          <ImageComponent imageUrl={headerData?.PrintLogo} styles={logoStyle} />
        </div>
      </div>
      {/* sub header */}
      <div className="d-flex border mb-1 subHeadFont" style={{fontSize: "9px", lineHeight: "11px"}}>
        <div className="col-4 border-end p-2">
          <p>{headerData?.lblBillTo}</p>
          <p className="fw-semibold">{headerData?.customerfirmname}</p>
          <p>{headerData?.customerAddress2}</p>
          <p>{headerData?.customerAddress1}</p>
          <p>{headerData?.customerAddress3}</p>
          <p>
            {headerData?.customercity1}
            {headerData?.customerpincode}
          </p>
          <p>{headerData?.customeremail1}</p>

          <p>
            {/* GSTIN-{headerData?.CustGstNo} | {headerData?.Cust_CST_STATE}-
            {headerData?.Cust_CST_STATE_No} | PAN-{headerData?.CustPanno} */}
            {headerData?.vat_cst_pan}
          </p>
          {headerData?.Cust_CST_STATE_No !== "" && (
            <p>
              {headerData?.Cust_CST_STATE}-{headerData?.Cust_CST_STATE_No}
            </p>
          )}
        </div>
        <div className="col-5 border-end p-2">
          <p>Ship To,</p>
          <p className="fw-semibold">{headerData?.customerfirmname}</p>
          {address?.map((e, i) => {
            return <p key={i}>{e}</p>;
          })}
        </div>
        <div className="col-3 p-2">
          <div className="d-flex">
            <div className="col-3">
              <p className="fw-semibold pe-2">BILL NO</p>
            </div>
            <div className="col-9">
              <p>{headerData?.InvoiceNo}</p>
            </div>
          </div>
          <div className="d-flex">
            <div className="col-3">
              <p className="fw-semibold pe-2">DATE</p>
            </div>
            <div className="col-9">
              <p>{headerData?.EntryDate}</p>
            </div>
          </div>
          <div className="d-flex">
            <div className="col-3">
              <p className="fw-semibold pe-2">HSN</p>
            </div>
            <div className="col-9">
              <p>{headerData?.HSN_No}</p>
            </div>
          </div>
        </div>
      </div>
      {/* table Header */}
      <div className={`${style?.detailPrint5Table}`}>
        <div className="d-flex border lightGrey">
          <div className={`${style?.srNo} border-end d-flex justify-content-center align-items-center fw-bold`} >
            Sr
          </div>
          <div className={`${style?.design} border-end d-flex justify-content-center align-items-center fw-bold`} >
            Design
          </div>
          <div className={`${style?.diamond} border-end fw-bold`}>
            <div className="d-grid h-100 w-100">
              <div className="d-flex w-100 border-bottom justify-content-center">
                Diamond
              </div>
              <div className="d-flex w-100">
                <div className="col-2 border-end text-center">Code</div>
                <div className="col-2 border-end text-center">Size</div>
                <div className="col-2 border-end text-center">Pcs</div>
                <div className="col-2 border-end text-center">Wt</div>
                <div className="col-2 border-end text-center">Rate</div>
                <div className="col-2 text-center">Amount</div>
              </div>
            </div>
          </div>

          <div className={`${style?.metal} border-end fw-bold`}>
            <div className="d-grid h-100 w-100">
              <div className="d-flex w-100 border-bottom justify-content-center justify-content-center">
                Metal
              </div>
              <div className="d-flex w-100">
                <div className={`${style?.w_20} border-end text-center`}>
                  Quality
                </div>
                <div className={`${style?.w_20} border-end text-center`}>
                  *Wt
                </div>
                <div className={`${style?.w_20} border-end text-center`}>
                  N+L
                </div>
                <div className={`${style?.w_20} border-end text-center`}>
                  Rate
                </div>
                <div className={`${style?.w_20} text-center`}>Amount</div>
              </div>
            </div>
          </div>

          <div className={`${style?.stone} border-end fw-bold`}>
            <div className="d-grid h-100 w-100">
              <div className="d-flex w-100 border-bottom justify-content-center">
                Stone
              </div>
              <div className="d-flex w-100">
                <div className={`col-2 border-end text-center`}>Code</div>
                <div className={`col-2 border-end text-center`}>Size</div>
                <div className={`col-2 border-end text-center`}>Pcs</div>
                <div className={`col-2 border-end text-center`}>Wt</div>
                <div className={`col-2 border-end text-center`}>Rate</div>
                <div className={`col-2 text-center`}>Amount</div>
              </div>
            </div>
          </div>

          <div
            className={`${style?.otherAmount} border-end d-flex justify-content-center align-items-center text-center fw-bold`}
          >
            Other Amount
          </div>
          <div className={`${style?.labour} border-end text-center fw-bold`}>
            <div className="d-grid h-100 w-100">
              <div className="d-flex w-100 border-bottom justify-content-center">
                Labour
              </div>
              <div className="d-flex w-100">
                <div className={`col-6 border-end text-center border-end`}>
                  Rate
                </div>
                <div className={`col-6 text-center`}>Amount</div>
              </div>
            </div>
          </div>
          <div
            className={`${style?.totalAmount} d-flex justify-content-center align-items-center text-center fw-bold`}
          >
            Total Amount
          </div>
        </div>

        {/* table data */}
        {data.map((e, i) => {
          return (
            <React.Fragment key={i}>
              <div className="d-flex border-start border-end" >
                <div className={`${style?.srNo} border-end text-center p-1 ${style?.wordBreak}`}>
                  {i + 1}
                </div>
                <div className={`${style?.design} border-end p-1`}>
                  <div className="d-flex justify-content-between">
                    <p> {e?.designno} </p>
                    <div>
                      <p className="text-end">{e?.SrJobno}</p>
                      <p className="text-end">{e?.MetalColor}</p>
                    </div>
                  </div>
                  <img
                    src={e?.DesignImage}
                    alt=""
                    className={`${style?.img} mx-auto d-block w-100 ${!image && `d-none`
                      }`}
                    onError={handleImageError}
                  />
                  {e?.HUID !== "" && (
                    <p className="text-center">HUID: {e?.HUID}</p>
                  )}
                  <p className="text-center">
                    <span className="fw-bold">PO: {e?.PO}</span>
                  </p>
                  {e?.batchnumber !== "" && (
                    <p className="text-center">{e?.batchnumber}</p>
                  )}

                  <p className="text-center">
                    Tunch :{" "}
                    <span className="fw-bold">
                      {NumberWithCommas(e?.Tunch, 3)}
                    </span>
                  </p>
                  <p className="text-center">
                    <span className="fw-bold">
                      {NumberWithCommas(e?.grosswt, 3)} gm
                    </span>{" "}
                    Gross
                  </p>
                </div>
                <div className={`${style?.diamond} border-end position-relative pb-4`} >
                  {e?.diamonds.map((ele, ind) => {
                    return (
                      <div className="d-flex w-100" key={ind}>
                        <div className={`col-2`}>
                          {ele?.ShapeName} {ele?.QualityName} {ele?.Colorname}
                        </div>
                        <div className={`col-2 ${style?.wordBreak} text-center`}>{ele?.SizeName}</div>
                        <div className={`col-2 text-end ${style?.wordBreak}`}>
                          {NumberWithCommas(ele?.Pcs, 0)}
                        </div>
                        <div className={`col-2 text-end ${style?.wordBreak}`}>
                          {NumberWithCommas(ele?.Wt, 3)}
                        </div>
                        <div className={`col-2 text-end ${style?.wordBreak}`}>
                          {NumberWithCommas(ele?.Rate, 2)}
                        </div>
                        <div className={`col-2 text-end fw-bold ${style?.wordBreak}`}>
                          {NumberWithCommas(ele?.Amount, 2)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={`${style?.metal} border-end position-relative pb-4`} >
                  {e?.metals.map((ele, ind) => {
                    return (
                      <div className="d-flex w-100" key={ind}>
                        <div className={`${style?.w_20}`}>
                          {ele?.ShapeName} {ele?.QualityName}{" "}
                        </div>
                        <div className={`${style?.w_20} text-end  ${style?.wordBreak}`}>
                          {NumberWithCommas(ele?.Wt, 3)}
                        </div>
                        <div className={`${style?.w_20} text-end  ${style?.wordBreak}`}>
                          {ind === 0 &&
                            NumberWithCommas(e?.netWtLoss, 3)}
                            {ele?.IsPrimaryMetal === 0 && NumberWithCommas(ele?.Wt, 3)}
                        </div>
                        <div className={`${style?.w_20} text-end  ${style?.wordBreak}`}>
                          {NumberWithCommas(ele?.Rate, 2)}
                        </div>
                        <div className={`${style?.w_20} text-end fw-bold  ${style?.wordBreak}`}>
                          {NumberWithCommas(ele?.Amount, 2)}
                        </div>
                      </div>
                    );
                  })}

                  {e?.JobRemark !== "" && (
                    <div className="d-flex w-100">
                      <div>
                        <p>Remark:</p>
                        <p className={`fw-bold`}>{e?.JobRemark}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`${style?.stone} border-end position-relative pb-4`} >
                  {e?.colorStones.map((ele, ind) => {
                    return (
                      <div className="d-flex w-100" key={ind}>
                        <div className={`col-2`}>
                          {ele?.ShapeName} {ele?.QualityName} {ele?.Colorname}
                        </div>
                        <div className={`col-2 text-center ${style?.wordBreak}`}>
                          {ele?.SizeName}
                        </div>
                        <div className={`col-2 ${style?.wordBreak} text-end`}>
                          {NumberWithCommas(ele?.Pcs, 0)}
                        </div>
                        <div className={`col-2 ${style?.wordBreak} text-end`}>
                          {NumberWithCommas(ele?.Wt, 3)}
                        </div>
                        <div className={`col-2 text-center ${style?.wordBreak}`}>
                          {NumberWithCommas(ele?.Rate, 2)}
                        </div>
                        <div className={`col-2 fw-bold ${style?.wordBreak} text-end`}>
                          {NumberWithCommas(ele?.Amount, 2)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={`${style?.otherAmount} border-end  text-end position-relative`} >
                  <div className="d-grid h-100 w-100">
                    <div>
                      <p className="text-end">
                        {NumberWithCommas(e?.otherAmt, 2)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`${style?.labour} border-end text-center position-relative pb-4 ${style?.wordBreak}`} >
                  <div className="d-grid h-100 w-100">
                    <div>
                      <div className={`d-flex w-100 ${style?.wordBreak}`}>
                        <div className={`col-6 text-end`}>
                          {e?.MaKingCharge_Unit !== 0 &&
                            NumberWithCommas(e?.MaKingCharge_Unit, 2)}
                        </div>
                        <div className={`col-6 text-end`}>
                          {e?.MakingAmount !== 0 &&
                            NumberWithCommas(e?.MakingAmount - e?.findingSetting, 2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${style?.totalAmount}  text-end position-relative pb-4 ${style?.wordBreak}`} >
                  <div className={`d-grid h-100 w-100`}>
                    <div>
                      <p className={`text-end fw-bold`}>
                        {e?.TotalAmount !== 0 &&
                          NumberWithCommas(e?.UnitCost, 2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex border-bottom border-start border-end">
                <div className={`${style?.srNo} border-end text-center p-1 ${style?.wordBreak}`}>
                </div>
                <div className={`${style?.design} border-end px-1`}>
                  {e?.Size !== "" && (
                    <p className="text-center">Size: {e?.Size}</p>
                  )}
                </div>
                <div className={`${style?.diamond} border-end lightGrey border-top`} >
                    <div className="d-flex w-100">
                      <div className="col-2 text-end"></div>
                      <div className="col-2 text-end"></div>
                      <div className={`col-2 text-end fw-bold ${style?.wordBreak}`}>
                        {e?.diaTotal?.Pcs !== 0 &&
                          NumberWithCommas(e?.diaTotal?.Pcs, 0)}
                      </div>
                      <div className={`col-2 text-end fw-bold ${style?.wordBreak}`}>
                        {e?.diaTotal?.Wt !== 0 &&
                          NumberWithCommas(e?.diaTotal?.Wt, 3)}
                      </div>
                      {/* <div className="col-2 text-end"></div> */}
                      <div className={`col-4 text-end fw-bold ${style?.wordBreak}`}>
                        {e?.diaTotal?.Amount !== 0 &&
                          NumberWithCommas(e?.diaTotal?.Amount, 2)}
                      </div>
                    </div>
                </div>

                <div className={`${style?.metal} border-end lightGrey border-top`} >
                    <div className={`d-flex w-100 ${style?.wordBreak}`}>
                      {/* <div className={`${style?.w_20} text-end`}></div> */}
                      <div className={`${style?.w_20} text-end fw-bold`} style={{width:'40%'}}>
                        {e?.metalTotal?.Wt !== 0 &&
                          NumberWithCommas(e?.metalTotal?.Wt, 3)}
                      </div>
                      <div className={`${style?.w_20} text-end fw-bold`}>
                        {e?.netWtLoss !== 0 &&
                          NumberWithCommas(e?.netWtLoss, 3)}
                      </div>
                      {/* <div className={`${style?.w_20} text-end`}></div> */}
                      <div className={`${style?.w_20} text-end fw-bold`} style={{width:'40%'}}>
                        {e?.metalTotal?.Amount !== 0 &&
                          NumberWithCommas(e?.metalTotal?.Amount, 2)}
                      </div>
                    </div>
                </div>

                <div className={`${style?.stone} border-end lightGrey border-top`} >
                    <div className={`d-flex w-100 ${style?.wordBreak}`}>
                      <div className={`col-2 text-end`}></div>
                      <div className={`col-2 text-end`}></div>
                      <div className={`col-2 text-end fw-bold`}>
                        {e?.csTotal?.Pcs !== 0 &&
                          NumberWithCommas(e?.csTotal?.Pcs, 0)}
                      </div>
                      <div className={`col-2 text-end fw-bold`}>
                        {e?.csTotal?.Wt !== 0 &&
                          NumberWithCommas(e?.csTotal?.Wt, 3)}
                      </div>
                      {/* <div className={`col-2 text-end`}></div> */}
                      <div className={`col-4 text-end fw-bold`}>
                        {e?.csTotal?.Amount !== 0 &&
                          NumberWithCommas(e?.csTotal?.Amount, 2)}
                      </div>
                    </div>
                </div>

                <div className={`${style?.otherAmount} border-end border-top text-end lightGrey`} >
                    <div className={`d-flex w-100 justify-content-end ${style?.wordBreak}`}>
                      <p className={` text-end fw-bold`}>
                          {NumberWithCommas(e?.otherAmt, 2)}
                      </p>
                    </div>
                </div>
                <div className={`${style?.labour} border-end text-center ${style?.wordBreak} lightGrey border-top`} >
                    <div className={`d-flex w-100 ${style?.totaltotal}`}>
                      {/* <div className={`col-6 text-end`}>
                        {e?.MaKingCharge_Unit !== 0 &&
                        NumberWithCommas(e?.MaKingCharge_Unit, 2)}
                      </div> */}
                      <div className={`col-12 text-end fw-bold`}>
                        {e?.MakingAmount !== 0 &&
                          NumberWithCommas(e?.MakingAmount - e?.findingSetting, 2)}
                      </div>
                    </div>
                </div>
                <div className={`${style?.totalAmount}  text-end lightGrey ${style?.wordBreak} border-top`} >
                    <div className="w-100">
                      <p className={`text-end fw-bold`}>
                        {e?.TotalAmount !== 0 &&
                          NumberWithCommas(e?.UnitCost, 2)}
                      </p>
                    </div>
                </div>
              </div>
              {e?.DiscountAmt !== 0 && (
                <div className={`d-flex border-bottom border-start border-end ${style?.wordBreak}`} key={i + "i"} >
                  <div
                    className={`${style?.srNo} border-end text-center p-1`}
                  ></div>
                  <div className={`${style?.design} border-end p-1`}></div>
                  <div className={`${style?.diamond} border-end`}></div>

                  <div className={`${style?.metal} border-end`}></div>

                  <div className={`${style?.stone} border-end`}>
                    <p className="text-end fw-bold">
                      Discount {NumberWithCommas(e?.Discount, 2)}
                      {!e?.isdiscountinamount
                        ? "% @Total Amount	"
                        : " On Amount	"}{" "}
                    </p>
                  </div>

                  <div
                    className={`${style?.otherAmount} border-end  text-end`}
                  ></div>
                  <div className={`${style?.labour} border-end text-center`}>
                    <p className="text-end fw-bold">
                      {NumberWithCommas(e?.DiscountAmt, 2)}
                    </p>
                  </div>
                  <div className={`${style?.totalAmount} text-end fw-bold`}>
                    <p className="text-end fw-bold">
                      {NumberWithCommas(e?.TotalAmount, 2)}
                    </p>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}

        {/* taxes */}
        <div className="d-flex  border-bottom border-start border-end">
          <div className={`${style?.taxes} border-end `}>
            {discountAmt !== 0 && <p className="text-end">
              Total Discount
            </p>}
            {taxes.map((e, i) => {
              return (
                <p className="text-end" key={i}>
                  {e?.name} @ {e?.per}
                </p>
              );
            })}
            {headerData?.AddLess !== 0 && (
              <p className="text-end">
                {headerData?.AddLess > 0 ? "Add" : "Less"}
              </p>
            )}
          </div>
          <div className={`${style?.totalAmount} `}>
            {discountAmt !== 0 && <p className="text-end">
              {NumberWithCommas(discountAmt, 2)}
            </p>}
            {taxes.map((e, i) => {
              return (
                <p className="text-end" key={i}>
                  {e?.amount}
                </p>
              );
            })}
            {headerData?.AddLess !== 0 && (
              <p className="text-end">
                {NumberWithCommas(headerData?.AddLess, 2)}
              </p>
            )}
          </div>
        </div>
        {/* table total */}
        <div className={`d-flex border-bottom border-start border-end lightGrey ${style?.wordBreak}`}>
          <div className={`${style?.total} border-end`}>
            <p className="text-center fw-bold">TOTAL</p>
          </div>
          <div className={`${style?.diamond} border-end`}>
            <div className={`d-flex w-100 ${style?.totaltotal}`}>
              <div className="col-2 text-end"></div>
              <div className="col-2 text-end"></div>
              <div className="col-2 text-end fw-bold">
                {total?.diaTotal?.Pcs !== 0 &&
                  NumberWithCommas(total?.diaTotal?.Pcs, 0)}
              </div>
              <div className="col-2 text-end fw-bold">
                {total?.diaTotal?.Wt !== 0 &&
                  NumberWithCommas(total?.diaTotal?.Wt, 3)}
              </div>
              {/* <div className="col-2 text-end"></div> */}
              <div className="col-4 fw-bold d-flex justify-content-end align-items-center">
                {total?.diaTotal?.Amount !== 0 &&
                  NumberWithCommas(total?.diaTotal?.Amount, 2)}
              </div>
            </div>
          </div>

          <div className={`${style?.metal} border-end`}>
            <div className={`d-flex w-100 ${style?.totaltotal}`}>
              {/* <div className={`${style?.w_20} text-end`}></div> */}
              <div className={`${style?.w_20} text-end fw-bold`} style={{width:'40%'}}>
                {total?.metalTotal?.Wt !== 0 &&
                  NumberWithCommas(total?.metalTotal?.Wt, 3)}
              </div>
              <div className={`${style?.w_20} text-end fw-bold`}>
                {total?.metalTotal?.NL !== 0 &&
                  NumberWithCommas(total?.metalTotal?.NL, 3)}
              </div>
              {/* <div className={`${style?.w_20} text-end`}></div> */}
              <div className={`${style?.w_20} text-end fw-bold`} style={{width:'40%'}}>
                {total?.metalTotal?.Amount !== 0 &&
                  NumberWithCommas(total?.metalTotal?.Amount, 2)}
              </div>
            </div>
          </div>

          <div className={`${style?.stone} border-end`}>
            <div className={`d-flex w-100 ${style?.totaltotal}`}>
              <div className={`col-2 text-end`}></div>
              <div className={`col-2 text-end`}></div>
              <div className={`col-2 text-end fw-bold`}>
                {total?.csTotal?.Pcs !== 0 &&
                  NumberWithCommas(total?.csTotal?.Pcs, 0)}
              </div>
              <div className={`col-2 text-end fw-bold`}>
                {total?.csTotal?.Wt !== 0 &&
                  NumberWithCommas(total?.csTotal?.Wt, 3)}
              </div>
              {/* <div className={`col-2 text-end`}></div> */}
              <div className={`col-4 text-end fw-bold`}>
                {total?.csTotal?.Amount !== 0 &&
                  NumberWithCommas(total?.csTotal?.Amount, 2)}
              </div>
            </div>
          </div>

          <div className={`${style?.otherAmount} border-end  text-end`}>
            <div>
              <p className="text-end fw-bold">
                {" "}
                {total?.OtherCharges !== 0 &&
                  NumberWithCommas(total?.OtherCharges, 2)}
              </p>
            </div>
          </div>
          <div className={`${style?.labour} border-end text-center`}>
            <div className={`d-flex w-100 ${style?.totaltotal}`}>
              {/* <div className={`col-6 text-end`}></div> */}
              <div className={`col-12 text-end fw-bold`}>
                {total?.MakingAmount !== 0 &&
                  NumberWithCommas(total?.MakingAmount, 2)}
              </div>
            </div>
          </div>
          <div className={`${style?.totalAmount}  text-end`}>
            <div>
              <p className={`text-end fw-bold`}>
                {total?.TotalAmount !== 0 &&
                  NumberWithCommas(total?.TotalAmount, 2)}
              </p>
            </div>
          </div>
        </div>
        {/* summary */}
        <div className="d-flex" style={{fontSize: "9px"}}>
          <div className="col-6">
            <div className="d-flex">
              <div className="col-8 border-bottom border-start border-end">
                <h6
                  className={`fw-bold text-center border-bottom ${style?.min_height_15} d-flex justify-content-center align-items-center lightGrey`}
                >
                  SUMMARY
                </h6>
                <div className="d-flex">
                  <div className="col-6 border-end position-relative pb-3 px-1 sumFont">
                    <div className="d-flex justify-content-between">
                      <p className="fw-bold">GOLD IN 24KT </p>
                      <p>{NumberWithCommas((total?.gold24kt - notGoldMetalWtTotal), 3)} gm</p>
                    </div>
                    {
                      MetShpWise?.map((e, i) => {
                        return <div className="d-flex justify-content-between" key={i}> 
                        <p className="fw-bold">{e?.ShapeName}</p>
                        <p>{NumberWithCommas(e?.metalfinewt, 3)} gm</p>
                      </div>
                      })
                    }
                    <div className="d-flex justify-content-between">
                      <p className="fw-bold">GROSS WT</p>
                      <p>{NumberWithCommas(total?.grosswt, 3)} gm</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p className="fw-bold">*(G+D) WT</p>
                      <p>{NumberWithCommas(total?.metalTotal?.Wt, 3)} gm</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p className="fw-bold">NET WT</p>
                      <p>{NumberWithCommas(total?.metalTotal?.NL, 3)} gm</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p className="fw-bold">DIAMOND WT</p>
                      <p>
                        {NumberWithCommas(total?.diaTotal?.Pcs, 0)} /{" "}
                        {NumberWithCommas(total?.diaTotal?.Wt, 3)} Cts
                      </p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p className="fw-bold">STONE WT</p>
                      <p>
                        {NumberWithCommas(total?.csTotal?.Pcs, 0)} /{" "}
                        {NumberWithCommas(total?.csTotal?.Wt, 3)} Cts
                      </p>
                    </div>
                    <div
                      className={`d-flex justify-content-between position-absolute left-0 bottom-0 ${style?.min_height_15} border-top w-100 lightGrey end-0`}
                      style={{minHeight: "16px"}}
                    >
                      <p></p>
                      <p></p>
                    </div>
                  </div>
                  <div className="col-6 border-end position-relative pb-3 px-1 sumFont">
                    <div className="d-flex justify-content-between">
                      <p className="fw-bold">GOLD </p>
                      <p>{NumberWithCommas((total?.metalTotal?.Amount - notGoldMetalTotal), 2)}</p>
                    </div>
                    {
                      MetShpWise?.map((e, i) => {
                        return <div className="d-flex justify-content-between" key={i}> 
                        <p className="fw-bold">{e?.ShapeName}</p>
                        <p>{NumberWithCommas(e?.Amount, 2)}</p>
                      </div>
                      })
                    }
                    <div className="d-flex justify-content-between">
                      <p className="fw-bold">DIAMOND</p>
                      <p>{NumberWithCommas(total?.diaTotal?.Amount, 2)}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p className="fw-bold">CST</p>
                      <p>{NumberWithCommas(total?.csTotal?.Amount, 2)}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p className="fw-bold">MAKING</p>
                      <p>{NumberWithCommas(total?.MakingAmount, 2)}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p className="fw-bold">OTHER</p>
                      <p>{NumberWithCommas(total?.OtherCharges, 2)}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p className="text-end fw-bold">
                        {headerData?.AddLess > 0 ? "Add" : "Less"}
                      </p>
                      <p className="text-end">
                        {NumberWithCommas(headerData?.AddLess, 2)}
                      </p>
                    </div>
                    <div
                      className={`d-flex justify-content-between position-absolute left-0 bottom-0 ${style?.min_height_15} border-top w-100 lightGrey end-0 ps-1 pe-1`}
                    >
                      <p className="fw-bold">TOTAL</p>
                      <p className="">{NumberWithCommas(total?.TotalAmount, 2)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4 border-end border-bottom position-relative pb-3 sumFont">
                <h6
                  className={`${style?.min_height_15} ${style?.sumCent} border-bottom fw-bold lightGrey text-center justify-content-center align-items-center`}
                >
                  Diamond Details
                </h6>
                {diamondDetail.map((e, i) => {
                  return (
                    <div
                      className="d-flex justify-content-between px-1"
                      key={i}
                    >
                      <p className="fw-bold">
                        {e?.label === "OTHER" ? (
                          e?.label
                        ) : (
                          <>
                            {e?.label} {e?.Colorname} {e?.QualityName}
                          </>
                        )}{" "}
                      </p>
                      <p>
                        {e?.Pcs} / {NumberWithCommas(e?.Wt, 3)} Cts
                      </p>
                    </div>
                  );
                })}

                <div
                  className={`d-flex justify-content-between position-absolute left-0 bottom-0 ${style?.min_height_15} border-top w-100`}
                >
                  <p></p>
                  <p></p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-2 border-bottom  h-100 border-end sumFont">
            <h6
              className={`fw-bold text-center justify-content-center align-items-center border-bottom ${style?.min_height_15} ${style?.sumCent} lightGrey`}
            >
              OTHER DETAILS
            </h6>
            <div>
              {brokarage.map((e, i) => {
                return <div className="d-flex justify-content-between px-1" key={i}>
                  <p className="fw-bold">{e[0]} </p>
                  <p>{e[1] && NumberWithCommas(e[1], 2)}</p>
                </div>
              })}
              <div className="d-flex justify-content-between px-1">
                <p className="fw-bold">RATE IN 24KT </p>
                <p>{NumberWithCommas(headerData?.MetalRate24K, 2)}</p>
              </div>

            </div>
          </div>
          <div className={`col-2 border-bottom h-100 border-start ${style?.sumFont}`}>
            {headerData?.PrintRemark !== "" && <>  <h6 className={`fw-bold text-center justify-content-center align-items-center border-bottom ${style?.sumCent} ${style?.min_height_15} lightGrey`} >
                REMARK
              </h6>
              <div className={`${style?.min_height_15}`}>
                <p className="px-1" dangerouslySetInnerHTML={{ __html: headerData?.PrintRemark }}></p>
              </div></>}
          </div>
          <div className="col-2 d-flex sumFont">
            <div
              className={`d-flex border-start border-end border-bottom ${style?.height_createBy} w-100 h-100`}
            >
              <div className="col-6 d-flex align-items-end h-100 justify-content-center border-end">
                <p className="pb-1"><i>Created By</i> </p>
              </div>
              <div className="col-6 d-flex align-items-end h-100 justify-content-center">
                <p className="pb-1"><i>Checked By</i> </p>
              </div>
            </div>
          </div>
        </div>
        {/* pre generated text */}
        <pre className="pre pt-3">**   THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF TRANSACTIONS </pre>
      </div>
    </div>
  ) : (
    <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
      {msg}
    </p>
  );
};

export default DetailPrint5;
