// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=TVMvNDk0LzIwMjQ=&evn=TWF0ZXJpYWwgU2FsZQ==&pnm=SW52b2ljZSBQcmludA==&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvTWF0ZXJpYWxCaWxsX0pzb24=&ctv=NzE=&ifid=TaxInvoiceA&pid=undefined
import React, { useEffect } from "react";
import "../../assets/css/prints/InvoicePrintOldMaterialSale.css";
import { useState } from "react";
import {
  NumberWithCommas,
  apiCall,
  checkMsg,
  fixedValues,
  formatAmount,
  handlePrint,
  isObjectEmpty,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import { cloneDeep } from "lodash";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { MetalShapeNameWiseArr } from "../../GlobalFunctions/MetalShapeNameWiseArr";
import { ToWords } from "to-words";

const InvoicePrintOldMaterial = ({
  token,
  invoiceNo,
  printName,
  urls,
  evn,
  ApiVer,
}) => {
  const [loader, setLoader] = useState(true);
  const [json0Data, setJson0Data] = useState({});
  const [msg, setMsg] = useState("");
  const [finalD, setFinalD] = useState({});
  const [custAddress, setCustAddress] = useState([]);
  const [taxAmont , setTaxAmount] = useState();
  const [extraTaxAmont , setExtraTaxAmount] = useState();
  const toWords = new ToWords();  
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };

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
            let address =
              data?.Data?.MaterialBill_Json[0]?.Printlable?.split("\r\n");
            setCustAddress(address);
            console.log("data", data);
            
            setJson0Data(data?.Data?.MaterialBill_Json[0]);
            const sortedItems = [...(data?.Data?.MaterialBill_Json1 || [])].sort(
              (a, b) => parseFloat(a?.ItemId || 0) - parseFloat(b?.ItemId || 0)
            );
            setFinalD(sortedItems);
            setTaxAmount(data?.Data?.MaterialBill_Json2[0]);
            setExtraTaxAmount(data?.Data?.MaterialBill_Json3);
            
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

  function PrintableText({ json0Data }) {
    const htmlContent = json0Data?.Printlable?.replace(/\n/g, '');
  
    return (
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }

  const totalWeight = (Array.isArray(finalD) ? finalD : []).reduce((sum, item) => {
    const weight = parseFloat(item?.Weight);
    return sum + (isNaN(weight) ? 0 : weight);
  }, 0);

  const totalPureWeight = (Array.isArray(finalD) ? finalD : []).reduce((sum, item) => {
    const PureWeight = parseFloat(item?.PureWeight);
    return sum + (isNaN(PureWeight) ? 0 : PureWeight);
  }, 0);  
  
  const totalPieces = (Array.isArray(finalD) ? finalD : []).reduce((sum, item) => {
    const pieces = parseFloat(item?.pieces);
    return sum + (isNaN(pieces) ? 0 : pieces);
  }, 0);

  const totalAmount = (Array.isArray(finalD) ? finalD : []).reduce((sum, item) => {
    const Amount = parseFloat(item?.Amount);
    return sum + (isNaN(Amount) ? 0 : Amount);
  }, 0);

  const GrandTotal = totalAmount + taxAmont?.CGSTTotalAmount + taxAmont?.SGSTTotalAmount;

  console.log("taxAmont", taxAmont);
  console.log("extraTaxAmont", extraTaxAmont);
  console.log("json0Data", json0Data);
  console.log("finalD", finalD);

  const amount = Number(GrandTotal || 0);
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  const rupeesInWords = toWords.convert(rupees);
  const paiseInWords = paise > 0 ? ` and ${toWords.convert(paise)} Paise` : '';

  return (
    <>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        <>
          <div className="w-full flex">
            <div className="w-full flex prnt_btn">
              <input
                type="button"
                className="btn_white blue mt-0"
                value="Print"
                onClick={(e) => handlePrint(e)}
              />
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="container_inv2">
              <div className="headlineJL w-100 p-2">
                <b style={{ fontSize: "20px" }}>
                  TAX INVOICE
                </b>
              </div>

              {/** Bill Number & Date */}
              <div className="disflx">
                <div className="w1_inv2 spfnthead">
                </div>
                <div className="w30_inv2 spfnthead brbxAll">
                  <div className="disflx" style={{ paddingTop: "2px" }}>
                    <div className="wdthHd spfntBld">BILL NO</div>
                    <div className="wdthHd1">{json0Data?.InvoiceNo}</div>
                  </div>
                  <div className="disflx">
                    <div className="wdthHd spfntBld">DATE</div>
                    <div className="wdthHd1">{json0Data?.EntryDate}</div>
                  </div>
                </div>
              </div>

              {/** Header */}
              <div className="disflx brbxAll spfnthead spacTpm">
                <div className="w1_invold">
                  <div className="disflx spacTpm spfntBld"><div>TO, </div><div className="spacLft">{json0Data?.customerfirmname}</div></div>
                  <div className="disflx spacLft1"><PrintableText json0Data={json0Data} /></div>
                </div>
                <div className="w2_invold">
                    <div className="disflx spacTpm"><div className="wdthHdOld spfntBld">GSTIN</div><div className="wdthHdOld1">{json0Data?.Cust_VAT_GST_No}</div></div>
                    <div className="disflx spacTpm"><div className="wdthHdOld spfntBld">STATE CODE</div><div className="wdthHdOld1">{json0Data?.Cust_CST_STATE_No}</div></div>
                    <div className="disflx spacTpm"><div className="wdthHdOld spfntBld">PAN NO</div><div className="wdthHdOld1">{json0Data?.customerPANno}</div></div>
                </div>
              </div>

              {/** Table Header */}
              <div className="disflx brbxAll spacTpm spfntbH">
                <div className="col1_inv2 spfntBld spbrRht spfntCen">DESCRIPTION</div>
                <div className="disflx w90inOld">
                  <div className="col2_inv2 spfntBld">DESCRIPTION</div>
                  <div className="col3_inv2 spfntBld spfnted">WEIGHT</div>
                  <div className="col4_inv2 spfntBld spfnted">RATE</div>
                  <div className="col5_inv2 spfntBld spfnted">AMOUNT</div>
                  <div className="col6_inv2 spfntBld spfnted">HSN#</div>
                  <div className="col7_inv2 spfntBld spfnted">CGST%</div>
                  <div className="col8_inv2 spfntBld spfnted">CGST</div>
                  <div className="col9_inv2 spfntBld spfnted">SGST%</div>
                  <div className="col10_inv2 spfntBld spfnted">SGST</div>
                  <div className="col11_inv2 spfntBld spfnted">TOTAL AMT</div>
                </div>
              </div>

              {/** Data */}
              <div className="disflx spfntbH spbrRht spbrlFt">
                <div className="col1_inv2 spbrRht spfntCen spbrWord" style={{ alignContent: "center" }}>RAW MATERIAL</div>
                <div className="w90inOld">
                  {finalD?.map((e) => {
                    return (
                      <div className="disflx">
                        <div className="Sucol2_inv2 spbrWord">
                          {e?.ItemName === "DIAMOND" ? "CUT AND POLISHED DIAMOND" : e?.ItemName === "COLOR STONE" ? "STONE" : e?.ItemName === "METAL" && e?.shape === "gold" ? e?.quality ? `GOLD ${e?.quality}` : 'GOLD' : e?.ItemName === "METAL" && e?.shape === "silver" ? "SILVER" : e?.ItemName === "MISC" ? "MISC" : ""}
                        </div>
                        <div className="Sucol3_inv2 spfnted">{fixedValues(e?.Weight === "" ? "-" : e?.Weight,3)}</div>
                        <div className="Sucol4_inv2 spfnted">{formatAmount(e?.Rate === "" ? "-" : e?.Rate,2)}</div>
                        <div className="Sucol5_inv2 spfnted">{formatAmount(e?.Amount === "" ? "-" : e?.Amount,2)}</div>
                        <div className="Sucol6_inv2 spfnted">{e?.HSN_No === "" ?  "-"  : e?.HSN_No }</div>
                        <div className="Sucol7_inv2 spfnted">{fixedValues(e?.CGST === "" ? "-" : e?.CGST,3)}</div>
                        <div className="Sucol8_inv2 spfnted">{formatAmount(e?.CGSTAmount === "" ? "-" : e?.CGSTAmount,2)}</div>
                        <div className="Sucol9_inv2 spfnted">{fixedValues(e?.SGST === "" ? "-" : e?.SGST,3)}</div>
                        <div className="Sucol10_inv2 spfnted">{formatAmount(e?.SGSTAmount === "" ? "-" : e?.SGSTAmount,2)}</div>
                        <div className="Sucol11_inv2 spfnted">{formatAmount(e?.Amount === "" ? "-" : e?.Amount + e?.CGSTAmount + e?.SGSTAmount,2)}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/** Table Total */}
              <div className="disflx brbxAll spfntbH">
                <div className="col1_inv2 spfntBld spbrRht spfntCen"></div>
                <div className="disflx w90inOld">
                  <div className="Sucol2_inv2 spfntBld">TOTAL</div>
                  <div className="Sucol3_inv2"></div>
                  <div className="Sucol4_inv2"></div>
                  <div className="Sucol5_inv2 spfnted spfntBld">{formatAmount(totalAmount,2)}</div>
                  <div className="Sucol6_inv2"></div>
                  <div className="Sucol7_inv2"></div>
                  <div className="Sucol8_inv2 spfnted spfntBld">{formatAmount(taxAmont?.CGSTTotalAmount)}</div>
                  <div className="Sucol9_inv2 spfntBld"></div>
                  <div className="Sucol10_inv2 spfnted spfntBld">{formatAmount(taxAmont?.SGSTTotalAmount)}</div>
                  <div className="Sucol11_inv2 spfnted spfntBld">{formatAmount(GrandTotal,2)}</div>
                </div>
              </div>

              {/** Tax & Total */}
              <div className="disflx spacTpm">
              <div className="wdthHd1Old"></div>
              <div className="wdthHdOld brbxAll spfntbH">
                <div className="vheit">
                <div>
                {taxAmont?.CGSTTotalAmount !== 0 && (
                  <div className="disflx">
                    <div className="taxwdth1 spacLft2">
                      <p>CGST</p>
                    </div>
                    <div className="taxwdth2">
                      <p>{formatAmount(taxAmont?.CGSTTotalAmount,2)}</p>
                    </div>
                  </div>
                )}
                {taxAmont?.SGSTTotalAmount !== 0 && (
                  <div className="disflx">
                    <div className="taxwdth1 spacLft2">
                      <p>SGST</p>
                    </div>
                    <div className="taxwdth2">
                      <p>{formatAmount(taxAmont?.SGSTTotalAmount,2)}</p>
                    </div>
                  </div>
                )}
                </div>
                <div className="disflx brTpm">
                  <div className="taxwdth1 spfntBld spacLft2" style={{ alignItems: "center" }}>GRAND TOTAL</div>
                  <div className="taxwdth2 spfntBld">{NumberWithCommas(GrandTotal,2)}</div>
                </div>
              </div>
              </div>
              </div>

              {/** Total In Word */}
              <div className="taxwdth brbxAll spfntbH pgbrkIsd">
                <b>Rs.</b> <span>Rupees {rupeesInWords + paiseInWords} Only</span>
              </div>

              
              {/** Note */}
              <div className="sprmrk brbxAll spfntbH pgbrkIsd">
                <div className="spfntBld">NOTE :</div>
                <div>1 Graded material</div>
                <div>2 All goods manufactured and delivered at surat (gujarat)</div>
                <div>3 Goods once sold will not be taken back or replaced</div>
                <div>4 Subject to Surat (Gujarat) Juridiction</div>
              </div>

              <div className="brbxAll spfntbH spbnkdtl spbrRht spacTpm pgbrkIsd">
                  <div className="spfntBld">COMPANY DETAILS :</div>
                  <div>GSTIN :<span>{json0Data?.Company_VAT_GST_No}</span></div>
                  <div>STATE CODE :<span>{json0Data?.Company_CST_STATE_No}</span></div>
                  <div>PAN NO. :</div>
                  <div>Kindly make your payment by the name of <b>{json0Data?.accountname}</b></div>
                  <div>Payable at Surat (Gujarat) by cheque or DD</div>
                  <div>Bank Detail : Bank Account No <b>{json0Data?.accountnumber}</b></div>
                  <div>Bank Name : {json0Data?.bankname}, {json0Data?.bankaddress}</div>
                  <div>RTGS/NEFT IFSC:<span>{json0Data?.rtgs_neft_ifsc}</span></div>
              </div>
              <div className="disflx spacTpm spfntbH pgbrkIsd">
                <div className="spbnkdtl1 brbxAll spaceRht">
                    <div className="spfntBld">AUTHORISED, {json0Data?.customerfirmname}</div>
                </div>
                <div className="spbnkdtl1 brbxAll spaceLft">
                  <div className="spfntBld">AUTHORISED, {json0Data?.CompanyFullName}</div>
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
  );
};

export default InvoicePrintOldMaterial;
