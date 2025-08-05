// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=TVMvMzY0LzIwMjQ=&evn=TWF0ZXJpYWwgc2FsZQ==&pnm=dGF4IGludm9pY2UgYQ==&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvTWF0ZXJpYWxCaWxsX0pzb24=&ctv=NzE=&ifid=DetailPrintR&pid=undefined
import React, { useEffect } from "react";
import "../../assets/css/prints/InvoicePrint2MaterialSale.css";
import { useState } from "react";
import {
  NumberWithCommas,
  apiCall,
  brokarageDetail,
  checkMsg,
  fixedValues,
  formatAmount,
  handleImageError,
  handlePrint,
  isObjectEmpty,
  otherAmountDetail,
  taxGenrator,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import { cloneDeep } from "lodash";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { MetalShapeNameWiseArr } from "../../GlobalFunctions/MetalShapeNameWiseArr";
import watermarkimg from "../../assets/img/watermark.png";
import signatureLogo from "../../assets/img/signatureLogo.png";
import { ToWords } from "to-words";

const InvoicePrint2Material = ({
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

  const summary = Array.isArray(finalD)
    ? finalD.reduce(
        (acc, item) => {
          acc.totalPieces += item.pieces || 0;
          acc.totalWeight += item.Weight || 0;
          acc.totalAmount += item.TotalAmount || 0;
          return acc;
        },
        {
          totalPieces: 0,
          totalWeight: 0,
          totalAmount: 0,
        }
      )
    : {
        totalPieces: 0,
        totalWeight: 0,
        totalAmount: 0,
      };

  let TotalCGSTAmount = 0;
  let TotalSGSTAmount = 0;
  let TotalIGSTAmount = 0;

  if (Array.isArray(finalD)) {
    finalD.forEach((item) => {
      TotalCGSTAmount += Number(item.CGSTAmount) || 0;
      TotalSGSTAmount += Number(item.SGSTAmount) || 0;
      TotalIGSTAmount += Number(item.IGSTAmount) || 0;
    });

    // console.log("TotalCGSTAmount:", TotalCGSTAmount);
    // console.log("TotalSGSTAmount:", TotalSGSTAmount);
    // console.log("TotalIGSTAmount:", TotalIGSTAmount);
  } 

  function PrintableText({ json0Data }) {
    const htmlContent = json0Data?.Printlable?.replace(/\n/g, '<br />');
  
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

  const totalAmount = (Array.isArray(finalD) ? finalD : []).reduce((sum, item) => {
    const Amount = parseFloat(item?.Amount);
    return sum + (isNaN(Amount) ? 0 : Amount);
  }, 0);

  const totalEtraTaxAmount = (Array.isArray(extraTaxAmont) ? extraTaxAmont : []).reduce((sum, item) => {
    const amount = parseFloat(item?.TaxAmount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0); 

  const getDueDate = (entryDateStr, orderDue) => {
    const date = new Date(entryDateStr);
    date.setDate(date.getDate() + orderDue);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  const DueDate = getDueDate(json0Data?.EntryDate, json0Data?.OrderDue)
  const GrandTotal = totalAmount + totalEtraTaxAmount;

  console.log("taxAmont", taxAmont);
  console.log("extraTaxAmont", extraTaxAmont);

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
              {/** Header */}
              <div className="disflx brbxAll">
                <div className="w1_inv2 spbrRht spfnthead">
                  <div style={{ paddingTop: "2px" }}>Bill To,</div>
                  <div className="spfntsZ spfntBld">{json0Data?.customerfirmname}</div>
                  <div>{json0Data?.customerAddress1}</div>
                  <div>{json0Data?.customerAddress2}</div>
                  <div>{json0Data?.CompanyCity} {json0Data?.PinCode}</div>
                  <div>{json0Data?.customeremail}</div>
                  <div>{json0Data?.Cust_VAT_GST}-{json0Data?.Cust_VAT_GST_No} | PAN-{json0Data?.customerPANno}</div>
                  <div>{json0Data?.Cust_CST_STATE}-{json0Data?.Cust_CST_STATE_No}</div>
                </div>
                <div className="w2_inv2 spbrRht spfnthead">
                  <div style={{ paddingTop: "2px" }}>Ship To,</div>
                  <div className="spfntsZ spfntBld">{json0Data?.customerfirmname}</div>
                  <div><PrintableText json0Data={json0Data} /></div>
                </div>
                <div className="w30_inv2 spfnthead">
                  <div className="disflx" style={{ paddingTop: "2px" }}>
                    <div className="wdthHd spfntBld">BILL NO</div>
                    <div className="wdthHd1">{json0Data?.InvoiceNo}</div>
                  </div>
                  <div className="disflx">
                    <div className="wdthHd spfntBld">DATE</div>
                    <div className="wdthHd1">{json0Data?.EntryDate}</div>
                  </div>
                  <div className="disflx">
                    <div className="wdthHd spfntBld">DUE DATE</div>
                    <div className="wdthHd1">{DueDate}</div>
                  </div>
                </div>
              </div>

              {/** Table Header */}
              <div className="disflx brbxAll spfntbH" style={{ marginTop: "5px"}}>
                <div className="col1_inv2 spfntBld spbrRht spfntCen">Sr#</div>
                <div className="col2_inv2 spfntBld spfntCen spbrRht">Description</div>
                <div className="col3_inv2 spfntBld spbrRht spfntCen">Shape</div>
                <div className="col4_inv2 spbrRht spfntBld spfntCen">Quality</div>
                <div className="spbrRht col5_inv2 spfntBld spfntCen">Color</div>
                <div className="col6_inv2 spfntBld spbrRht spfntCen">Size</div>
                <div className="col7_inv2 spbrRht spfntBld spfntCen">Weight</div>
                <div className="col8_inv2 spfntBld spbrRht spfntCen">Rate</div>
                <div className="col9_inv2 spfntBld spfntCen">Amount</div>
              </div>

              {/** table Body */}
              {finalD?.map((e, i) => {
                return (
                  <div key={i} className="disflx spbrlFt brBtom spfntbH">
                    <div className="col1_inv2 spbrRht spfntCen">{i + 1}</div>
                    <div className="Sucol2_inv2 spbrRht">
                      {e?.ItemName === "DIAMOND" ? "CUT AND POLISHED DIAMOND" : e?.ItemName === "COLOR STONE" ? "STONE" : e?.ItemName === "METAL" && e?.shape === "gold" ? "GOLD" : e?.ItemName === "METAL" && e?.shape === "silver" ? "SILVER" : e?.ItemName === "MISC" ? "MISC" : ""}
                    </div>
                    <div className="Sucol3_inv2 spbrRht">{e?.shape === "" || e?.ItemName === "METAL" ? "-" : e?.shape}</div>
                    <div className="Sucol4_inv2 spbrRht">{e?.quality === "" ? "-" : e?.quality}</div>
                    <div className="col5_inv2 spbrRht">{e?.color === "" ? "-" : e?.color}</div>
                    <div className="Sucol6_inv2 spbrRht">{e?.size === "" ? "-" : e?.size}</div>
                    <div className="Sucol7_inv2 spfntCen spbrRht">{fixedValues(e?.Weight === "" ? "-" : e?.Weight,3)}</div>
                    <div className="Sucol8_inv2 spfnted spbrRht">{formatAmount(e?.Rate === "" ? "-" : e?.Rate,2)}</div>
                    <div className="Sucol9_inv2 spfnted spbrRht">{formatAmount(e?.Amount === "" ? "-" : e?.Amount,2)}</div>
                  </div>
                )
              })}

              {/** Table Total */}
              <div className="disflx spbrlFt brBtom spfntbH">
                <div className="col1_inv2 spbrRht spfntCen"></div>
                <div className="Sucol2_inv2 spbrRht"></div>
                <div className="Sucol3_inv2 spbrRht"></div>
                <div className="Sucol4_inv2 spbrRht"></div>
                <div className="col5_inv2 spbrRht"></div>
                <div className="Sucol6_inv2 spbrRht"></div>
                <div className="Sucol7_inv2 spfntCen spfntBld spbrRht">{fixedValues(totalWeight,3)}</div>
                <div className="Sucol8_inv2 spfnted spbrRht"></div>
                <div className="Sucol9_inv2 spfnted spfntBld spbrRht">{formatAmount(totalAmount,2)}</div>
              </div>

              {/** Tax Amount */}
              <div className="disflx spfntbH">
                <div className="taxwdth spbrlFt spbrRht"></div>
                <div className="taxwdth1 spbrRht brBtom">
                  {extraTaxAmont?.map?.((e, i) => {
                    return (
                      <p key={i} className="spfntBld">{e?.TaxName}</p>
                    )
                  })}
                </div>
                <div className="taxwdth2 spbrRht brBtom">
                  {extraTaxAmont?.map?.((e, i) => {
                    return (
                      <p key={i} className="spfntBld">{formatAmount(e?.TaxAmount,2)}</p>
                    )
                  })}
                </div>
              </div>

              {/**Gran Total */}
              <div className="disflx spfntbH">
                <div className="taxwdth spbrlFt spbrRht" style={{ paddingLeft: "5px", paddingTop: "5px" }}>
                  In Words Indian Rupees <br /><span className="spfntBld">Rupees {rupeesInWords + paiseInWords} Only</span>
                </div>
                <div className="taxwdth1 spbrRht spfntBld grtHet" style={{ alignItems: "center" }}>GRAND TOTAL</div>
                <div className="taxwdth2 spbrRht spfntBld grtHet">{NumberWithCommas(GrandTotal,2)}</div>
              </div>
              
              {/** Remarks */}
              <div className="sprmrk brbxAll">
                <div className="spfntBld">REMARKS :</div>
              </div>
              
              {/** Instuction */}
              {json0Data?.Declaration && ( 
                <div className="brbxAll" style={{ borderTop: "none" }}>
                  <div className="spbrWord spinst" dangerouslySetInnerHTML={{ __html: json0Data?.Declaration,}}></div>
                </div>
              )}

              <div className="disflx brbxAll spfntbH" style={{ borderTop: "none" }}>
                <div className="spbnkdtl spbrRht">
                  <div className="spfntBld">Bank Detail</div>
                  <div>Bank Name:<span>{json0Data?.bankname}</span></div>
                  <div>Branch:<span>{json0Data?.bankaddress}</span></div>
                  <div>Account Name:<span>{json0Data?.accountname}</span></div>
                  <div>Account No:<span>{json0Data?.accountnumber}</span></div>
                  <div>RTGS/NEFT IFSC:<span>{json0Data?.rtgs_neft_ifsc}</span></div>
                </div>
                <div className="spbnkdtl1 spbrRht">
                  <div>Signature</div>
                  <div className="spfntBld">{json0Data?.customerfirmname}</div>
                </div>
                <div className="spbnkdtl1">
                  <div>Signature</div>
                  <div className="spfntBld">{json0Data?.CompanyFullName}</div>
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

export default InvoicePrint2Material;
