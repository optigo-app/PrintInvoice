import React, { useEffect, useState } from 'react';
import "../../assets/css/prints/invoicePrint.css";
import { NumberWithCommas, apiCall, fixedValues, handlePrint, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { json } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { ToWords } from "to-words";
import { Diamond } from '@mui/icons-material';

const InvoicePrint = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
  const toWords = new ToWords();
  const [loader, setLoader] = useState(true);
  const [json0, setJson0] = useState({});
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");
  const [datass, setDatas] = useState({});
  const [isImageWorking, setIsImageWorking] = useState(true);
  const [metal, setMetal] = useState([]);
  const [diamond, setDiamond] = useState([]);
  const [colorstone, setColorstone] = useState([]);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const findOtherName = (arr, ele) => {
    let findIndex = arr.findIndex((e, i) => e?.MasterManagement_DiamondStoneTypeid === ele?.MasterManagement_DiamondStoneTypeid && e?.Rate === ele?.Rate);
    if (findIndex === -1) {
      arr.push(ele);
    } else {
      arr[findIndex].Wt += ele?.Wt;
      // arr[findIndex].Rate += ele?.Rate;
      arr[findIndex].Amount += ele?.Amount;
      arr[findIndex].Pcs += ele?.Pcs;
    }
    return arr;
  }

  const findMetalName = (arr, ele) => {
    let findIndex = arr.findIndex((e, i) => { if (e?.ShapeName === ele?.ShapeName) { if (e?.QualityName === ele?.QualityName) { if (e?.Rate === ele?.Rate) { return ele; } } } });
    if (findIndex === -1) {
      arr.push(ele);
    } else {
      arr[findIndex].Wt += ele?.Wt;
      arr[findIndex].Rate += ele?.Rate;
      arr[findIndex].Amount += ele?.Amount;
      arr[findIndex].Pcs += ele?.Pcs;
    }
    return arr;
  }

  const [other, setOther] = useState({
    other1: [],
    other2: [],
  })

  const loadData = (data) => {

    let newArr = [];
    let diamondArr = [];
    let colorstoneArr = [];
    data?.BillPrint_Json2?.forEach((ele, ind) => {
       if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
          let findDiamond = diamondArr?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName &&
            elem?.Colorname === ele?.Colorname && elem?.QualityName === ele?.QualityName &&
            elem?.MaterialTypeName === ele?.MaterialTypeName && elem?.Rate === ele?.Rate);
          if (findDiamond === -1) {
            diamondArr?.push(ele);
          } else {
            diamondArr[findDiamond].Wt += ele?.Wt;
            diamondArr[findDiamond].Pcs += ele?.Pcs;
            diamondArr[findDiamond].Amount += ele?.Amount;
          }
        }else if(ele?.MasterManagement_DiamondStoneTypeid === 2){
          let findColorstone = colorstoneArr?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName &&
          elem?.Colorname === ele?.Colorname && elem?.QualityName === ele?.QualityName &&
          elem?.MaterialTypeName === ele?.MaterialTypeName && elem?.Rate === ele?.Rate);
        if (findColorstone === -1) {
          colorstoneArr?.push(ele);
        } else {
          colorstoneArr[findColorstone].Wt += ele?.Wt;
          colorstoneArr[findColorstone].Pcs += ele?.Pcs;
          colorstoneArr[findColorstone].Amount += ele?.Amount;
        }
        }
    });
    data?.BillPrint_Json1?.forEach((e, i) => {
      let primaryWt = 0;
      let primaryAmount = e?.MetalAmount;
      let metalRate = 0;
      data?.BillPrint_Json2?.forEach((ele, ind) => {
        if (ele?.StockBarcode === e?.SrJobno) {
          if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            if (ele?.IsPrimaryMetal === 1) {
              primaryWt += ele?.Wt;
              // primaryAmount += ele?.Amount;
              metalRate = ele?.Rate;
            }
          }
        }
      });

      let obj = cloneDeep(e);
      obj.primaryWt = primaryWt;
      obj.primaryAmount = primaryAmount;
      obj.metalRate = metalRate;
      let findRecord = newArr?.findIndex((ele, ind) => {
        if (ele?.MetalTypePurity === obj?.MetalTypePurity && ele?.metalRate === obj?.metalRate) {
          return ind
        }
      });
      if (findRecord === -1) {
        newArr?.push(obj);
      } else {
        newArr[findRecord].primaryWt += obj.primaryWt;
        newArr[findRecord].primaryAmount += obj.primaryAmount;
        // newArr[findRecord].primaryWt
      }

    });
    setDiamond(diamondArr);
    setColorstone(colorstoneArr)
    newArr.sort((a, b) => {
      if (a.ShapeName < b.ShapeName) return -1;
      if (a.ShapeName > b.ShapeName) return 1;

      if (a.QualityName < b.QualityName) return -1;
      if (a.QualityName > b.QualityName) return 1;

      if (a.Colorname < b.Colorname) return -1;
      if (a.Colorname > b.Colorname) return 1;
      return 0; // If both are equal
    });
    setMetal(newArr);
    setJson0(data?.BillPrint_Json[0]);
    let result = [];
    let finding = [];
    let otherchrges1 = [];
    let otherchrges2 = [];
    data?.BillPrint_Json2.map((e, i) => {
      if (e?.MasterManagement_DiamondStoneTypeid !== 3) {
        if (result.length === 0) {
          if (e?.MasterManagement_DiamondStoneTypeid === 4) {
            let newTotal = findMetalName(result, e);
            result = newTotal;
          } else {
            result.push(e);
          }
        } else {
          if (e?.MasterManagement_DiamondStoneTypeid === 4) {
            let newTotal = findMetalName(result, e);
            result = newTotal;
          } else {
            let newTotal = findOtherName(result, e);
            result = newTotal;
          }
        }
      } else {
        if (e?.IsHSCOE !== 0) {
          let findCharge = otherchrges2?.findIndex((ele, ind) => ele?.label === ele?.ShapeName);
          if (findCharge === -1) {
            let obj = {
              label: e?.ShapeName,
              value: e?.Amount,
            }
            otherchrges2.push(obj);
          } else {
            otherchrges2[findCharge].value += e?.Amount;
          }
        }
      }

      if (e?.MasterManagement_DiamondStoneTypeid === 5) {
        finding.push(e);
      }
    });
    let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
    // console.log(datas);

    datas?.resultArray?.forEach((e, i) => {
      // console.log(e);
      e?.other_details?.forEach((ele, ind) => {
        let findCharge = otherchrges1?.findIndex((elem, index) => elem?.label === ele?.label);
        if (findCharge === -1) {
          otherchrges1.push(ele);
        } else {
          otherchrges1[findCharge].value = +otherchrges1[findCharge].value + +ele?.value;
        }
      })
    });

    let finalArr = [];
    result?.forEach((e, i) => {
      let obj = cloneDeep(e);
      if (e?.MasterManagement_DiamondStoneTypeid === 4) {
        let findMaterial = finding?.findIndex((ele, ind) => ele?.StockBarcode === e?.StockBarcode);
        if (findMaterial !== -1) {
          obj.Wt -= finding[findMaterial]?.Wt;
        }
      }
      finalArr.push(obj);
    })
    setData(finalArr);
    setOther({ ...other, other1: otherchrges1, other2: otherchrges2 });
    setDatas(datas);
    console.log(data);
  }

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
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
    loader ? <Loader /> : msg === "" ? <div className='container portraitContainer inoviceprintContainer max_width_container pad_60_allPrint mt-2 px-1'>
      {/* buttons */}
      <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 pt-4">
        <div className="form-check">
          <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
        </div>
      </div>
      {/* heading */}
      <div className="bgGrey text-uppercase fs-5 fw-bold p-2 text-white mb-2 no_break">{json0?.PrintHeadLabel}</div>
      {/* address */}
      <div className="w-100 d-flex justify-content-between py-2 no_break">
        <div className='col-10 p-1 border border-2 border-white p-1'>
          <p className='fw-bold fs-6'>{json0?.CompanyFullName}</p>
          <p>{json0?.CompanyAddress}</p>
          <p>{json0?.CompanyAddress2}-{json0?.CompanyPinCode}, {json0?.CompanyState}({json0?.CompanyCountry})</p>
          <p>T {json0?.CompanyTellNo} | TOLL FREE {json0?.CompanyTollFreeNo}</p>
          <p>{json0?.CompanyEmail} | {json0?.CompanyWebsite}</p>
        </div>
        <div className='col-2'>
          {isImageWorking && (json0?.PrintLogo !== "" &&
            <img src={json0?.PrintLogo} alt=""
              className='w-100 h-auto ms-auto d-block object-fit-contain'
              style={{ maxWidth: '138px' }}
              onError={handleImageErrors} height={120} width={150} />)}
          {/* <img src={json0?.PrintLogo} alt="" className='w-100 invoicePrintLogo' /> */}
        </div>
      </div>
      {/* bill no */}
      <div className="w-100 d-flex justify-content-between border-top py-2 no_break">
        <div className='col-9'>
        </div>
        <div className='col-3'>
          <div className="border border-2 p-2 border-black">
            <div className="d-flex">
              <p className='col-3 fw-bold'>BILL NO</p>
              <p className='col-9 ps-2'>{json0?.InvoiceNo}</p>
            </div>
            <div className="d-flex">
              <p className='col-3 fw-bold'>DATE</p>
              <p className='col-9 ps-2'>{json0?.EntryDate}</p>
            </div>
            <div className="d-flex">
              <p className='col-3 fw-bold'>HSN</p>
              <p className='col-9 ps-2'>{json0?.HSN_No}</p>
            </div>
          </div>
        </div>
      </div>
      {/* customer address */}
      <div className="pb-2 no_break">
        <div className="d-flex border-2 border border-black p-1">
          <div className="col-6">
            <p className='fs-6 fw-bold'> To,	{json0?.customerfirmname}</p>
            <p className="ps-4">{json0?.customerstreet}</p>
            <p className="ps-4">{json0?.customerAddress2}</p>
            <p className="ps-4">{json0?.customercity}{json0?.customerpincode}</p>
            <p className="ps-4">STATE NAME : {json0?.State}</p>
          </div>
          <div className="col-3"></div>
          <div className="col-3 d-flex justify-content-center align-items-start flex-column">
            <p className='d-flex w-100'><span className='fw-bold' style={{ minWidth: "70px" }}>GSTIN: </span><span className='ps-2'>{json0?.CustGstNo}</span></p>
            <p className='d-flex w-100'><span className='fw-bold' style={{ minWidth: "70px" }}>STATE CODE: </span><span className='ps-2'>{json0?.Cust_CST_STATE_No}</span></p>
            <p className='d-flex w-100'><span className='fw-bold' style={{ minWidth: "70px" }}>PAN NO : </span><span className='ps-2'>{json0?.CustPanno}</span></p>
          </div>
        </div>
      </div>
      {/* discription */}
      <div className="pb-2 no_break">
        <div className="d-flex border border-2 border-black">
          <div className="col-3 border-end border-2 border-black position-relative">
            <p className="fw-bold p-1 text-center border-bottom border-2 border-black">DESCRIPTION</p>
            <div className="minHieght150InvoicePrint d-flex justify-content-center pt-5 mt-3 h-100">
              <p>DIAMOND STUDDED JEWELLERY</p>
            </div>
            <div className="minHieght28InvoicePrint border-top border-2 border-black position-absolute bottom-0 left-0 w-100"></div>
          </div>
          <div className="col-9">
            <div className="d-flex border-bottom border-black border-2 py-1 px-2">
              <div className="col-5">
                <p className="fw-bold">DETAIL	</p>
              </div>
              <div className="col-3">
                <p className="fw-bold">WEIGHT	</p>
              </div>
              <div className="col-2">
                <p className="fw-bold">
                  RATE
                </p>
              </div>
              <div className="col-2">
                <p className="fw-bold text-end">
                  AMOUNT
                </p>
              </div>
            </div>
            <div className="minHieght150InvoicePrint">
              {/* {data?.length > 0 && data?.map((e, i) => {
                return <div className="d-flex px-2" key={i}>
                  <div className="col-5">
                    <p className="">{e?.MasterManagement_DiamondStoneTypeid === 4 ? (e?.ShapeName + " " + e?.QualityName) : e?.MasterManagement_DiamondStoneTypeName}</p>
                  </div>
                  <div className="col-3">
                    <p className="">{NumberWithCommas(e?.Wt, 3)}</p>
                  </div>
                  <div className="col-2">
                    <p className="">
                      {NumberWithCommas(e?.Rate, 2)}
                    </p>
                  </div>
                  <div className="col-2">
                    <p className=" text-end">
                      {NumberWithCommas(e?.Amount / json0?.CurrencyExchRate, 2)}
                    </p>
                  </div>
                </div>
              })}
              {
                other?.other1?.map((e, i) => {
                  return <div className="d-flex px-2" key={i}>
                    <div className="col-5">
                      <p className="">{e?.label}</p>
                    </div>
                    <div className="col-3">
                      <p className=""></p>
                    </div>
                    <div className="col-2">
                      <p className="">
                      </p>
                    </div>
                    <div className="col-2">
                      <p className=" text-end">
                        {NumberWithCommas(e?.value, 2)}
                      </p>
                    </div>
                  </div>
                })
              }
              {
                other?.other2?.map((e, i) => {
                  return <div className="d-flex px-2" key={i}>
                    <div className="col-5">
                      <p className="">{e?.label}</p>
                    </div>
                    <div className="col-3">
                      <p className=""></p>
                    </div>
                    <div className="col-2">
                      <p className="">
                      </p>
                    </div>
                    <div className="col-2">
                      <p className=" text-end">
                        {NumberWithCommas(e?.value, 2)}
                      </p>
                    </div>
                  </div>
                })
              } */}
              {metal?.map((e, i) => {
                return <div className="d-flex px-2" key={i}>
                  <div className="col-5">
                    <p className="">{e?.MetalTypePurity}</p>
                  </div>
                  <div className="col-3">
                    <p className="">{NumberWithCommas(e?.primaryWt, 3)}</p>
                  </div>
                  <div className="col-2">
                    <p className="">
                      {e?.primaryWt !== 0 && NumberWithCommas((e?.primaryAmount / json0?.CurrencyExchRate) / e?.primaryWt, 2)}
                    </p>
                  </div>
                  <div className="col-2">
                    <p className=" text-end">
                      {NumberWithCommas(e?.primaryAmount / json0?.CurrencyExchRate, 2)}
                    </p>
                  </div>
                </div>
              })}

              {
                diamond?.map((e, i) => {
                  return <div className="d-flex px-2" key={i}>
                  <div className="col-5">
                    <p className="">{e?.MasterManagement_DiamondStoneTypeName} {e?.MaterialTypeName}</p>
                  </div>
                  <div className="col-3">
                    <p className="">{NumberWithCommas(e?.Wt, 3)}</p>
                  </div>
                  <div className="col-2">
                    <p className="">
                      {e?.Wt !== 0 && NumberWithCommas(e?.Rate, 0)}
                    </p>
                  </div>
                  <div className="col-2">
                    <p className=" text-end">
                      {NumberWithCommas(e?.Amount / json0?.CurrencyExchRate, 2)}
                    </p>
                  </div>
                </div>
                })
              }
               {
                colorstone?.map((e, i) => {
                  return <div className="d-flex px-2" key={i}>
                  <div className="col-5">
                    <p className="">STONE {e?.MaterialTypeName}</p>
                  </div>
                  <div className="col-3">
                    <p className="">{NumberWithCommas(e?.Wt, 3)}</p>
                  </div>
                  <div className="col-2">
                    <p className="">
                      {e?.Wt !== 0 && NumberWithCommas(e?.Rate, 0)}
                    </p>
                  </div>
                  <div className="col-2">
                    <p className=" text-end">
                      {NumberWithCommas(e?.Amount / json0?.CurrencyExchRate, 2)}
                    </p>
                  </div>
                </div>
                })
              }
            </div>
            <div className="minHieght28InvoicePrint d-flex justify-content-between align-items-center py-1 px-2 border-top border-black border-2">
              <p className='fw-bold text-end'>Total</p>
              <p className='fw-bold'>{NumberWithCommas(datass?.mainTotal?.total_unitcost, 2)}</p>
            </div>
          </div>
        </div>
      </div>
      {/* cgst */}
      <div className="pb-2 d-flex justify-content-end no_break">
        <div className='col-3'>
          <span className="fw-bold">  Note: </span>{json0?.PrintRemark}
        </div>
        <div className="col-6 border-2 border-black border">
          {datass?.mainTotal?.total_discount_amount !== 0 && <div className="d-flex py-1 justify-content-between px-2 ">
            <p>Discount	 </p>
            <p>{NumberWithCommas(datass?.mainTotal?.total_discount_amount, 2)} </p>
          </div>}
          <div className="d-flex p-1 justify-content-between py-1 px-2">
            <p className='fw-bold'>Total Amount	 </p>
            <p>{NumberWithCommas(datass?.mainTotal?.total_amount, 2)} </p>
          </div>
          {
            datass?.allTaxes?.map((e, i) => {
              return <div className="d-flex p-1 justify-content-between py-1 px-2" key={i}>
                <p>{e?.name} @ {e?.per}</p>
                <p>{NumberWithCommas(+e?.amount * json0?.CurrencyExchRate, 2)} </p>
              </div>
            })
          }
          {json0?.AddLess !== 0 && <div className="d-flex justify-content-between py-1 px-2">
            <p className='fw-bold'>{json0?.AddLess > 0 ? "Add" : "Less"} </p>
            <p>{NumberWithCommas(json0?.AddLess, 2)}</p>
          </div>}
          {json0?.AddLess !== 0 && <div className="d-flex justify-content-between py-1 px-2 border-top border-2 border-black">
            <p className='fw-bold'>Grand Total </p>
            <p className='fw-bold'>{NumberWithCommas(datass?.mainTotal?.total_amount + datass?.allTaxes?.reduce((acc, cObj) => acc + (+cObj?.amount * json0?.CurrencyExchRate), 0) + json0?.AddLess, 2)}</p>
          </div>}
        </div>
      </div>
      {/* total price in text */}
      <div className="pb-2 no_break">
        <div className="border border-2 border-black p-1">
          <p className="fw-bold">Rs. {toWords?.convert(+fixedValues(datass?.mainTotal?.total_amount + datass?.allTaxes?.reduce((acc, cObj) => acc + (+cObj?.amount * json0?.CurrencyExchRate), 0) + json0?.AddLess, 2))} Only.</p>
        </div>
      </div>
      {/* note */}
      <div className="pb-2 no_break">
        <div className="border border-2 border-black p-1">
          <p className='fw-bold'>NOTE :</p>
          <p className='declarationInvoicePrint' dangerouslySetInnerHTML={{ __html: json0?.Declaration }}></p>
        </div>
      </div>
      {/* company details */}
      <div className="pb-2 no_break">
        <div className="border border-2 border-black p-1">
          <p className="fw-bold pb-1">COMPANY DETAILS :</p>
          <p className='pb-1'>GSTIN. : {json0?.Company_VAT_GST_No?.split("-")[1]}</p>
          <p className='pb-1'>{json0?.Company_CST_STATE} : {json0?.Company_CST_STATE_No}</p>
          <p className='pb-1'>PAN NO. : {json0?.Pannumber}</p>
          <p className='pb-1'>Kindly make your payment by the name of <span className="fw-bold">"{json0?.accountname}"</span></p>
          <p className='pb-1'>Payable at ST (GJ) by cheque or DD</p>
          <p className='pb-1'>Bank Detail : Bank Account No - <span className="fw-bold">{json0?.accountnumber}</span></p>
          <p className='pb-1'>Bank Name : {json0?.bankname} {json0?.bankaddress}</p>
          <p className=''>RTGS/NEFT IFSC : -{json0?.rtgs_neft_ifsc}</p>
        </div>
      </div>
      {/* authorised amigos */}
      <div className="pb-2 d-flex justify-content-between no_break">
        <div className="w-50 pe-1">
          <div className="border border-2 border-black d-flex justify-content-center minHieght138InvoicePrint">
            <p className='fw-bold'> AUTHORISED, {json0?.customerfirmname}</p>
          </div>
        </div>
        <div className="w-50 ps-1">
          <div className="border border-2 border-black d-flex justify-content-center minHieght138InvoicePrint">
            <p className='fw-bold'>AUTHORISED, {json0?.CompanyFullName}</p>
          </div>
        </div>
      </div>
    </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
  )
}

export default InvoicePrint;