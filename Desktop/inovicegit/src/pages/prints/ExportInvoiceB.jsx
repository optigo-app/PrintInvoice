import React, { useEffect, useState } from "react";
import { apiCall, formatAmount, isObjectEmpty } from "../../GlobalFunctions";
import "../../assets/css/prints/exportinvoiceb.css";
import { OrganizeInvoicePrintData } from "../../GlobalFunctions/OrganizeInvoicePrintData";
import NumToWord, { convertToUppercase } from "../../GlobalFunctions/NumToWord";
import moment from "moment/moment";
import Loader from "../../components/Loader";

const ExportInvoiceB = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [metalValue, setMetalValue] = useState({
    ShapeName: "",
    QualityName: "",
  });
  const [silverValue, setSilverValue] = useState({
    ShapeName: "",
    QualityName: "",
  });
  const [metCatWiseData, setMetCatWiseData] = useState([]);

  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [imgFlag, setImgFlag] = useState(true);
  const [po, setPO] = useState('');
  const [adCode, setAdCode] = useState('6390405');

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
          setMsg(data?.Message);
        }
      } catch (error) {
        console.error(error);
      }
    };
    sendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = (data) => {
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;

    const datas = OrganizeInvoicePrintData(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );
    console.log(datas);
    try {
        if(datas?.resultArray?.length > 0){
            let po = datas?.resultArray[0]?.PO;
            setPO(po)
        }
    } catch (error) {
        console.log(error);
    }
    
    setResult(datas);
  };

  const handleAdCode = (e) => {
    setAdCode(e.target.value);
  }

  return (
    <>
    {
        loader ? <Loader /> : <>
        {
            msg === '' ? <div className="EIB">
            {/* <div className="fs_eib eib_header d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-bold cust_head_eib">
                  {result?.header?.CompanyFullName}
                </div>
                <div>{result?.header?.CompanyAddress}</div>
                <div>{result?.header?.CompanyAddress2}</div>
                <div>
                  {result?.header?.CompanyCity},{result?.header?.CompanyCountry}
                </div>
              </div>
              <div>
                <img
                  src={result?.header?.PrintLogo}
                  alt="#companylogo"
                  className="eib_head_company_logo"
                />
              </div>
            </div> */}
            <div>
              <br />
              <br />
              <br />
              <br />
              
            </div>
            <div className="border border-black ">
              <div className="fs_eib fw-bold border-bottom border-black  w-100 text-center">
                INVOICE
              </div>
              <div className="fs_eib fw-bold border-bottom border-black w-100 text-center border-top-0 border-bottom-0">
                SUPPLUMEANT EXPORT UNDER LUT WITHOUT PAYMENT OF IGST
              </div>
      
              <div className="first_page_eia fs_eib">
                <div className="d-flex border border-end-0 border-start-0 border-black">
                  <div className="p-0 col-6 border-end border-black">
                    <div className="d-flex justify-content-between">
                      <div className="fw-semibold ps-1 fs_sm_ebi pb-2">EXPORTER</div>
                    </div>
                    <div className="fw-bold ps-1">
                      {result?.header?.CompanyFullName}
                    </div>
                    <div className=" ps-1">{result?.header?.CompanyAddress}</div>
                    <div className=" ps-1">{result?.header?.CompanyAddress2}</div>
                    <div className=" ps-1">
                      {result?.header?.CompanyCity +
                        ", " +
                        result?.header?.CompanyCountry + ", " + result?.header?.CompanyPinCode}
                    </div>
                    <div className=" ps-1">
                      fname and lname
                    </div>
                    <div className=" ps-1">
                      Tel :&nbsp;{result?.header?.CompanyTellNo}
                    </div>
              
                  </div>
                  <div className="col-6">
                    <div className="d-flex border-bottom border-black">
                      <div className="col-7 border-end border-black ps-1">
                        <div className=" text-break">
                          <div className="fw-bold">
                            Invoice No. & Date <br/> 
                          </div>
                          <div className="fw-normal">
                            {result?.header?.InvoiceNo} &nbsp;{" "}
                            <div className="fw-normal">DT : {moment(result?.header?.EntryDate).format("DD-MM-YYYY")}</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-5 d-flex flex-column justify-content-between align-items-center ps-1">
                        <div className="text-uppercase fw-semibold w-100 text-start">
                          Exporter's Reference
                        </div>
                        <div className="text-uppercase fw-semibold text-start w-100">UNDER CHAPTER 4</div>
                      </div>
                    </div>
                    <div className="p-1 minH_buyers_ebi">
                      <div className="">Buyer's Order No. & Date</div>
                      <br />
                      <div>{po}</div>
                    </div>
                    <div className="d-flex w-100 justify-content-between border-top border-black head_sub_div">
                      <div className="p-1 border-end w-50 border-black">
                        <div className="">Other Reference(s)</div>
                        <div className="fw-semibold"></div>
                      </div>
                      <div className="ps-1 w-50">
                        <div className="">I.E.CODE NO: <span>{result?.header?.IEC_NO}</span></div>
                        <div className="">PAN NO: <span>{result?.header?.Pannumber}</span></div>
                        <div className="">GST NO: <span>{result?.header?.Company_VAT_GST_No}</span></div>
                        {/* <div className="fw-semibold">EDF No. </div> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex border border-top-0 border-black border-end-0 border-start-0 ">
                  <div className="ps-1  col-6 border-end border-black">
                    <div className="d-flex justify-content-between">
                      <div className="pb-2 fw-semibold fs_sm_ebi"> CONSIGENEE </div>
                    </div>
                    <div className="headline_fs_eia fw-bold py-1">
                      {result?.header?.customerfirmname}
                    </div>
                    <div className="fw-semibold">{result?.header?.customerAddress1}</div>
                    <div className="fw-semibold">{result?.header?.customerAddress2}</div>
                    <div className="fw-semibold">
                      {result?.header?.customerAddress3}{" "}
                      {result?.header?.customercity},{" "}
                      {result?.header?.customercountry}
                    </div>
                    <div className="fw-semibold">
                      Telephone No : {result?.header?.customermobileno}
                    </div>
                    <div className="fw-semibold">
                      Email Id :{result?.header?.customeremail1}
                    </div>
                  </div>
                  <div className="col-6 ">
                    <div className=" ps-1 border-bottom border-black minH_buyers_ebi">
                      <div className="fw-bold">{convertToUppercase('Buyer (if other than consignee)')}</div>
                    </div>
                    <div className=" col-12">
                      <div className="border-bottom border-black">
                          <div className="ps-1 pb-2 fw-semibold">
                              INSURED COVERED BY : {result?.header?.insuranceby}
                          </div>
                          
                          <div className="ps-1 fw-bold">
                              {result?.header?.Company_CST_STATE} : {result?.header?.Company_CST_STATE_No} {result?.header?.CompanyState}
                          </div>
                      </div>
                      <div className="d-flex">
                          <div className="ps-1  border-end border-black w-50">
                              <div className="fw-semibold">COUNTRY OF ORIGIN GOODS</div> <br /> <div className="text-center fw-bold">{convertToUppercase(result?.header?.CompanyCountry)}</div>
                          </div>
                          
                          <div className="ps-1 w-50" >
                          <div className="fw-semibold">COUNTRY OF FINAL DESTINATION</div> <br /> <div className="text-center fw-bold">{convertToUppercase(result?.header?.customercountry)}</div>
                          </div>
                      </div>
                
                    </div>
                  </div>
                </div>
                <div className="d-flex border border-top-0 border-black border-bottom-0 overflow-hidden border-end-0 border-start-0 ">
                  <div className="col-6 border-end border-black">
                    <div className="d-flex border-bottom border-black">
                      <div className="col-6 pt-1 px-1 pb-4 border-end border-black">
                        <p className="fw-normal">Pre-Carriage By </p>
                      </div>
                      <div className="col-6 pt-1 px-1 pb-4">
                        <p className="fw-normal">
                          Place of Receipt by Pre-carrier N.A.{" "}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex border-bottom border-black">
                      <div className="col-6 pt-1 px-1 pb-4 border-end border-black">
                        <p className="fw-normal">Vessel/Flight No.</p>
                        <p className="">{result?.header?.Flight_NO}</p>
                      </div>
                      <div className="col-6 pt-1 px-1 pb-4">
                        <p className="fw-normal">Port of Loading</p>
                        <p className="">{result?.header?.portofloading}</p>
                      </div>
                    </div>
                    <div className="d-flex border-bottom border-black">
                      <div className="col-6 pt-1 px-1 pb-2 border-end border-black">
                        <p className="fw-normal">Port of Discharge</p>
                        <p className="">{result?.header?.portofdischarge}</p>
                      </div>
                      <div className="col-6 pt-1 px-1 ">
                        <p className="fw-normal pb-1">Final Destination</p>
                        <div className="pb-1">{result?.header?.customercountry?.toUpperCase()}</div>
                      </div>
                    </div>
                    <div className="d-flex border-bottom border-black">
                      <div className="col-6 pt-1 px-1 pb-2 border-end  border-black">
                        <p className="fw-normal">MARKS OF NOS.</p>
                        <p className="">{result?.header?.portofdischarge}</p>
                      </div>
                      <div className="col-6 pt-1 px-1 pb-2 ">
                        <p className="fw-normal d-flex justify-content-between align-items-center">
                          <span>NO & KIND OF PKGS</span>
                          <span>DESCRIPTION OF GOODS</span>
                        </p>
                        <span>{result?.header?.customercountry?.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
      
                    <div className="d-flex ">
                      <div className="col-12 ps-1">
                        <div className="fw-semibold pb-2  w-100">
                          
                          TERMS OF DELIVERY AND PAYMENT <br />
                          {result?.header?.DueDays} Days
                        </div>
                        <div className="pb-2 w-100 d-flex justify-content-between align-items-center "><span>BANK : {result?.header?.bankname}</span><span className="pe-1">AD CODE : <input type="text" value={adCode} onChange={handleAdCode} style={{width:'70px'}} /></span></div>
                        <div className="pb-1  w-100">Bank Account Number : {result?.header?.accountnumber}</div>
                        <div className="pb-1  w-100">
                          Address : {
                              result?.header?.bankaddress
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
      
                <div>
                  <div className="border-black border ms-1 mt-1 fs_eib " style={{width:'85%'}}>
                    <div className="d-flex fw-bold ">
                      <div className="col1_eib center_eib border-end border-black">
                        Sr. No
                      </div>
                      <div className="col2_eib center_eib border-end border-black">
                        Description
                      </div>
                      <div className="col3_eib center_eib border-end border-black">
                        Stone/Pcs
                      </div>
                      <div className="col4_eib center_eib border-end border-black">
                        Stone Wt/Pcs
                      </div>
                      <div className="col5_eib center_eib border-end border-black">
                        Pcs
                      </div>
                      <div className="col6_eib center_eib border-end border-black">
                        Wt. In GMS
                      </div>
                      <div className="col7_eib center_eib border-end border-black">
                        Rate
                      </div>
                      <div className="col8_eib center_eib ">Amount</div>
                    </div>
                    {result?.resultArray?.map((e, i) => {
                      return (
                        <div
                          className="d-flex  border-top fs_eib border-black"
                          key={i}
                        >
                          <div className="col1_eib center_eib border-end border-black">
                            {i + 1}
                          </div>
                          <div className="col2_eib  border-end border-black ps-1">
                            <div>{e?.MetalPurity} {e?.MetalColor} {e?.Categoryname} {e?.Size} </div>
                            <div>VENDOR STYLE NO : {e?.designno}</div>
                            <div>ITEM NO : {e?.SrJobno}</div>
                          </div>
                          <div className="col3_eib d-flex justify-content-end align-items-center pe-1 border-end border-black">
                            {e?.totals?.diamonds?.Pcs}
                          </div>
                          <div className="col4_eib d-flex justify-content-end align-items-center pe-1 border-end border-black">
                          {e?.totals?.diamonds?.Wt?.toFixed(3)}
                          </div>
                          <div className="col5_eib d-flex justify-content-end align-items-center pe-1 border-end border-black">
                            {e?.Quantity}
                          </div>
                          <div className="col6_eib d-flex flex-column justify-content-between p-1 border-end border-black">
                            <div className="d-flex justify-content-between">
                              <div>GROSS WT</div>
                              <div>{e?.grosswt?.toFixed(3)}</div>
                            </div>
                            <div className="d-flex justify-content-between">
                              <div>NETWT</div>
                              <div>{e?.NetWt?.toFixed(3)}</div>
                            </div>
                          </div>
                          <div className="col7_eib d-flex justify-content-end align-items-center pe-1 border-end border-black">
                            {formatAmount(e?.metal_rate)}
                          </div>
                          <div className="col8_eib d-flex justify-content-end align-items-center pe-1">{formatAmount(e?.MetalAmount)}</div>
                        </div>
                      );
                    })}
                     <div className="d-flex fw-bold border-top border-black">
                      <div className="col1_eib center_eib border-end border-black">
                        
                      </div>
                      <div className="col2_eib ps-1 border-end border-black">
                        TOTAL
                      </div>
                      <div className="col3_eib center_eib border-end border-black">
                        
                      </div>
                      <div className="col4_eib center_eib border-end border-black">
                        
                      </div>
                      <div className="col5_eib d-flex justify-content-end align-items-center pe-1 border-end border-black">
                      {result?.mainTotal?.Quantity}
                        
                      </div>
                      <div className="col6_eib center_eib border-end border-black">
                      </div>
                      <div className="col7_eib center_eib border-end border-black">
                        
                      </div>
                      <div className="col8_eib d-flex justify-content-end align-items-center pe-1 ">{formatAmount(result?.mainTotal?.MetalAmount)}</div>
                    </div>
                  </div>
                  <div className="d-flex p-1 ps-1" style={{width:'85.8%'}}>
                      <div className="toalDiv_1">
                          <div className="fw-bold fs_eib ">
                              TOTAL GROSS WT. IN GMS {result?.mainTotal?.grosswt?.toFixed(3)}
                          </div>
                          <div className="fw-bold fs_eib ">TOTAL NET WT. IN GMS {result?.mainTotal?.NetWt?.toFixed(3)}</div>
                      </div>
                      <div className="toalDiv_2">Labour : {formatAmount(result?.mainTotal?.MaKingCharge_Unit)}</div>
                      <div className="toalDiv_3 border border-black">
                          <div className="d-flex align-items-center"><div className="w-50 ps-1 border-end border-black">DIAMOND VALUE</div><div className="w-50 end_ebi pe-1">{formatAmount(result?.mainTotal?.MakingAmount)}</div></div>
                          <div className="d-flex align-items-center"><div className="w-50 ps-1 border-end border-black">MAKING VALUE</div><div className="w-50 end_ebi pe-1">{formatAmount(result?.mainTotal?.diamonds?.Amount)}</div></div>
                          <div className="d-flex align-items-center"><div className="w-50 ps-1 border-end border-black">FOB </div><div className="w-50 end_ebi pe-1">{formatAmount(result?.mainTotal?.MetalAmount + result?.mainTotal?.diamonds?.Amount + result?.mainTotal?.MakingAmount)}</div></div>
                          <div className="d-flex align-items-center"><div className="w-50 ps-1 border-end border-black">FRT & INS</div><div className="w-50 end_ebi pe-1">{formatAmount(result?.header?.FreightCharges)}</div></div>
                          <div className="d-flex align-items-center border-top border-black"><div className="w-50 ps-1 border-end border-black">TOTAL</div><div className="w-50 end_ebi pe-1">{formatAmount(result?.mainTotal?.MetalAmount + result?.mainTotal?.diamonds?.Amount + result?.mainTotal?.MakingAmount + result?.header?.FreightCharges)}</div></div>
                      </div>
                  </div>
                  <div className="my-2"></div>
                  <div className="fw-bold fs_eib ps-1">
                    ALL RATE& INVOICE ARE IN US$
                  </div>
                  <div className="fw-semibold fs_eib ps-1">
                    Rate of Gold Per Dunce - US$ 2736.50 (GJE PC)
                  </div>
                  <div className="fw-semibold fs_eib ps-1">
                    Rate Per Gram - 88.42 (0.99%)
                  </div>
                  <div className="fw-semibold fs_eib ps-1">
                    Rate Per Gram - 66.32 (58.33%)
                  </div>
                </div>
      
                <div className="border-top border-bottom border-black p-1 text-break">
                  {result?.header?.PrintRemark}
                </div>
      
                <div className="ps-1">Amount Chargeable : {NumToWord((result?.header?.FreightCharges + result?.mainTotal?.MetalAmount + result?.mainTotal?.MakingAmount + result?.mainTotal?.diamonds?.Amount))} (in words)</div>
                <div className="ps-1">GOLD PURCHASE FROM {result?.header?.Advance_Receipt_No}</div>
                <div className="d-flex justify-content-between align-items-center px-1">
                  <div style={{width:'39.33%'}} className="fw-semibol">GJC/GOLD/N/RATE {result?.header?.E_Reference_No}</div>
                  <div style={{width:'30.33%'}} className="fw-semibol">RATE : {formatAmount(result?.header?.MetalRate24K)}</div>
                  <div style={{width:'30.33%'}} className="fw-semibol">PER Toz FOR 0.000 FINE GOLD</div>
                </div>
      
                <div>
                  <div className="d-flex border border-black border-start-0 border-end-0 fw-semibold">
                    <div className="gcol1_eib center_eib border-end border-black">
                      Gold
                    </div>
                    <div className="gcol2_eib center_eib border-end border-black">
                      Gold
                    </div>
                    <div className="gcol3_eib center_eib border-end border-black">
                      Gold wstg
                    </div>
                    <div className="gcol4_eib center_eib border-end border-black">
                      Total Gold
                    </div>
                    <div className="gcol5_eib center_eib border-end border-black">
                      Gold
                    </div>
                    <div className="gcol6_eib center_eib border-end border-black">
                      Gold
                    </div>
                    <div className="gcol7_eib center_eib border-end border-black">
                      Gold 24K
                    </div>
                    <div className="gcol8_eib center_eib border-end border-black">
                      Net Gold
                    </div>
                    <div className="gcol9_eib center_eib border-end border-black">
                      Wastage
                    </div>
                    <div className="gcol10_eib center_eib border-end border-black">
                      Total
                    </div>
                    <div className="gcol11_eib center_eib border-end border-black">
                      Making
                    </div>
                    <div className="gcol12_eib center_eib border-end border-black">
                      Stone
                    </div>
                    <div className="gcol13_eib center_eib border-end border-black">
                      Kedia
                    </div>
                    <div className="gcol14_eib center_eib border-end border-black">
                      Diamond
                    </div>
                    <div className="gcol15_eib center_eib border-end ">Diamond</div>
                  </div>
                  <div className="d-flex border border-black border-start-0 border-top-0 border-end-0">
                    <div className="gcol1_eib border-end border-black">Gold</div>
                    <div className="gcol2_eib border-end border-black">Gold</div>
                    <div className="gcol3_eib border-end border-black">Gold wstg</div>
                    <div className="gcol4_eib border-end border-black">
                      Total Gold
                    </div>
                    <div className="gcol5_eib border-end border-black">Gold</div>
                    <div className="gcol6_eib border-end border-black">Gold</div>
                    <div className="gcol7_eib border-end border-black">Gold 24K</div>
                    <div className="gcol8_eib border-end border-black">Net Gold</div>
                    <div className="gcol9_eib border-end border-black">Wastage</div>
                    <div className="gcol10_eib border-end border-black">Total</div>
                    <div className="gcol11_eib border-end border-black">Making</div>
                    <div className="gcol12_eib border-end border-black">Stone</div>
                    <div className="gcol13_eib border-end border-black">Kedia</div>
                    <div className="gcol14_eib border-end border-black">Diamond</div>
                    <div className="gcol15_eib border-end ">Diamond</div>
                  </div>
                </div>
      
                <div className="d-flex justify-content-between align-items-start mt-1 ">
                  <div className="w-50 ">
                    <div className="fs_eib ps-1">
                      We Shall file any claim against this invoice under RoDTEP scheme
                      and hipping bill for this invoice is filed with custom icegate
                      info code as ROOTEPY If applicable as per Notification
                    </div>
                    <br />
                    <div className="fs_eib ps-1">
                      Declaration: <br /> We declare that this invoice shows the
                      actual price of the goods described and that all particulars are
                      true and correct
                    </div>
                  </div>
                  <div className="w-25 ps-1 fs_eib border-start border-black signBox_eib border-top fw-semibold">Signature & Date</div>
                </div>
      
           
      
              </div>
      
            </div>
            <div>
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
          </div> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto"> {msg} </p>
        }
        </>
    }
    </>
  );
};

export default ExportInvoiceB;
