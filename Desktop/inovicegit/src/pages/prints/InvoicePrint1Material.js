// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=TVMvNDk0LzIwMjQ=&evn=TWF0ZXJpYWwgU2FsZQ==&pnm=SW52b2ljZSBQcmludCAx&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvTWF0ZXJpYWxCaWxsX0pzb24=&ctv=NzE=&ifid=TaxInvoiceA&pid=undefined
import React, { useEffect } from "react";
import "../../assets/css/prints/InvoicePrint1MaterialSale.css";
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
import { ToWords } from "to-words";

const InvoicePrint1Material = ({
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

  const totalMiscWeight = (Array.isArray(finalD) ? finalD : []).reduce((sum, item) => {
    const weight = parseFloat(item?.Weight);
    if (item?.ItemName === 'MISC') {
      return sum + (isNaN(weight) ? 0 : weight);
    }
    return sum;
  }, 0);

  const totalMetalWeight = (Array.isArray(finalD) ? finalD : []).reduce((sum, item) => {
    const weight = parseFloat(item?.Weight);
    if (item?.ItemName === 'METAL') {
      return sum + (isNaN(weight) ? 0 : weight);
    }
    return sum;
  }, 0);

  const metalAndMiscWeight = totalMetalWeight + totalMiscWeight;
  
  const remainingWeight = (Array.isArray(finalD) ? finalD : []).reduce((sum, item) => {
    const weight = parseFloat(item?.Weight);
    if (item?.ItemName !== 'METAL' && item?.ItemName !== 'MISC') {
      return sum + (isNaN(weight) ? 0 : weight);
    }
    return sum;
  }, 0);

  const totalAmount = (Array.isArray(finalD) ? finalD : []).reduce((sum, item) => {
    const Amount = parseFloat(item?.Amount);
    return sum + (isNaN(Amount) ? 0 : Amount);
  }, 0);

  const GrandTotal = 
    (totalAmount || 0) +
    (taxAmont?.CGSTTotalAmount || 0) +
    (taxAmont?.SGSTTotalAmount || 0);

  const EndGrandTotal = 
    (totalAmount || 0) +
    (taxAmont?.CGSTTotalAmount || 0) +
    (taxAmont?.SGSTTotalAmount || 0) +
    (taxAmont?.tax1Amount || 0) +
    (taxAmont?.tax2Amount || 0) +
    (taxAmont?.tax3Amount || 0);
  const amountStr = formatAmount(GrandTotal, 2);
  const isWide = amountStr.length >= 9;

  // console.log("taxAmont", taxAmont);
  // console.log("extraTaxAmont", extraTaxAmont);
  // console.log("json0Data", json0Data);
  // console.log("finalD", finalD);

  function convertWithAnd(amount) {
    let words = toWords.convert(amount);

    const pattern = /\bHundred\b\s+(?!(Thousand|Lakh|Crore|Only))(.+)/i;
    if (pattern.test(words)) {
      words = words.replace(pattern, (match, p1, p2) => {
        return `Hundred and ${p2}`;
      });
    }

    return words;
  }

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
                  {json0Data?.PrintHeadLbl}
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
                  <div className={`${taxAmont?.tax3Amount !== 0 ? "col2_inv2IG" : "col2_inv2"} spfntBld`}>DESCRIPTION</div>
                  <div className="col3_inv2 spfntBld spfnted">WEIGHT</div>
                  <div className="col4_inv2 spfntBld spfnted">RATE</div>
                  {taxAmont?.tax3Amount !== 0 ? "" : <div className="col5_inv2 spfntBld spfnted">AMOUNT</div>}
                  <div className="col6_inv2 spfntBld spfnted">HSN#</div>
                  <div className="col7_inv2 spfntBld spfnted">CGST%</div>
                  <div className="col8_inv2 spfntBld spfnted">CGST</div>
                  <div className="col9_inv2 spfntBld spfnted">SGST%</div>
                  <div className="col10_inv2 spfntBld spfnted">SGST</div>
                  {taxAmont?.tax3Amount !== 0 && ( <>
                    <div className="col9_inv2IG spfntBld spfnted">IGST%</div>
                    <div className="col10_inv2IG spfntBld spfnted">IGST</div>
                  </>)}
                  <div className="col11_inv2 spfntBld spfnted">{taxAmont?.tax3Amount !== 0 ? "AMOUNT" : "TOTAL AMT"}</div>
                </div>
              </div>

              {/** Data */}
              <div className="disflx spfntbH spbrRht spbrlFt spveheit">
                <div className="col1_inv2 spbrRht spfntCen spbrWord" style={{ paddingTop: "70px" }}>STONE</div>
                <div className="w90inOld">
                  {finalD?.map((e) => {
                    return (
                      <div className="disflx">
                        <div className={`${taxAmont?.tax3Amount !== 0 ? "Sucol2_inv2IG" : "Sucol2_inv2"} spbrWord`}>
                          {e?.ItemName === "DIAMOND" ? "CUT AND POLISHED DIAMOND" 
                            : e?.ItemName === "COLOR STONE" ? "STONE"   
                              : e?.ItemName === "METAL" && e?.shape === "Gold" ? e?.quality ? `GOLD ${e?.quality}` : 'GOLD' 
                                : e?.ItemName === "METAL" && e?.shape === "Silver" ? "SILVER"   
                                  : e?.ItemName === "MISC" ? "MISC" 
                                    : e?.ItemName === "ALLOY" ? "ALLOY" 
                                      : e?.ItemName === "MOUNT" ? "M" 
                                        : e?.ItemName === "FINDING" ? "F:" 
                                          : ""}
                        </div>
                        <div className="Sucol3_inv2 spfnted">{fixedValues(e?.Weight === "" ? "-" : e?.Weight,3)}</div>
                        <div className="Sucol4_inv2 spfnted">{formatAmount(e?.Rate === "" ? "-" : e?.Rate,2)}</div>
                        {taxAmont?.tax3Amount !== 0 ? "" : <div className="Sucol5_inv2 spfnted">{formatAmount(e?.Amount === "" ? "-" : e?.Amount,2)}</div>}
                        <div className="Sucol6_inv2 spfnted">{e?.HSN_No === "" ?  "-"  : e?.HSN_No }</div>
                        <div className="Sucol7_inv2 spfnted">{fixedValues(e?.CGST === 0 ? taxAmont?.tax1_value : e?.CGST,3)}</div>
                        <div className="Sucol8_inv2 spfnted">{formatAmount(e?.CGSTAmount === 0 ? taxAmont?.tax1Amount : e?.CGSTAmount,2)}</div>
                        <div className="Sucol9_inv2 spfnted">{fixedValues(e?.SGST === 0 ? taxAmont?.tax2_value : e?.SGST,3)}</div>
                        <div className="Sucol10_inv2 spfnted">{formatAmount(e?.SGSTAmount === 0 ? taxAmont?.tax2Amount : e?.SGSTAmount,2)}</div>
                        {taxAmont?.tax3Amount !== 0 && ( <>
                          <div className="Sucol9_inv2IG spfnted">{fixedValues(taxAmont?.tax3_value,3)}</div>
                          <div className="Sucol10_inv2IG spfnted">{formatAmount(taxAmont?.tax3Amount,2)}</div>
                        </>)}
                        <div className="Sucol11_inv2 spfnted">{formatAmount(e?.Amount === "" ? "-" : e?.Amount + e?.CGSTAmount + e?.SGSTAmount,2)}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/** Table Total */}
              <div className="disflx brbxAll spfntbH spveheit1">
                <div className="col1_inv2 spfntBld spbrRht spfntCen"></div>
                <div className="disflx w90inOld">
                  <div className={`${taxAmont?.tax3Amount !== 0 ? "FtSucol2_inv2IG" : "FtSucol2_inv2"} spfntBld spVefntCen`}>TOTAL</div>
                  <div className="FtSucol3_inv2 spfnted spfntBld spVefntCen">
                    {remainingWeight ? ` ${fixedValues(remainingWeight,3)} ctw` : ""}<br />{metalAndMiscWeight ? `${fixedValues(metalAndMiscWeight,3)} gm` : ""}
                  </div>
                  <div className="FtSucol4_inv2"></div>
                  {taxAmont?.tax3Amount !== 0 ? "" :  <div className="FtSucol5_inv2 spfnted spfntBld spVefntCen">{formatAmount(totalAmount,2)}</div>}
                  <div className="FtSucol6_inv2"></div>
                  <div className="FtSucol7_inv2"></div>
                  <div className="FtSucol8_inv2 spfnted spfntBld spVefntCen">
                    {formatAmount(taxAmont?.CGSTTotalAmount === 0 ? taxAmont?.tax1Amount : taxAmont?.CGSTTotalAmount,2)}
                  </div>
                  <div className={`FtSucol9_inv2 spfntBld ${isWide ? 'FtSucol9_inv2_wide' : 'FtSucol9_inv2_shrnk'}`}></div>
                  <div className="FtSucol10_inv2 spfnted spfntBld spVefntCen">
                    {formatAmount(taxAmont?.SGSTTotalAmount === 0 ? taxAmont?.tax2Amount : taxAmont?.SGSTTotalAmount,2)}
                  </div>
                  {taxAmont?.tax3Amount !== 0 && ( <>
                    <div className={`FtSucol9_inv2IG spfntBld ${isWide ? 'FtSucol9_inv2_wide' : 'FtSucol9_inv2_shrnk'}`}></div>
                    <div className="FtSucol10_inv2IG spfnted spfntBld spVefntCen">{formatAmount(taxAmont?.tax3Amount,2)}</div>
                  </>)}
                  <div className={`spfnted spfntBld spVefntCen FtSucol11_inv2 ${isWide ? 'FtSucol11_inv2_wide' : 'FtSucol11_inv2_shrnk'}`}>{amountStr}</div>
                </div>
              </div>

              {/** Tax & Total */}
              <div className="disflx spacTpm">
              <div className="wdthHd1Old"></div>
              <div className="wdthHdOld brbxAll spfntbH">
                <div className="vheit">
                <div>
                {taxAmont?.tax1_taxname !== "" && (
                  <div className="disflx">
                    <div className="taxwdth1 spacLft2">
                      <p>{taxAmont?.tax1_taxname} @ {fixedValues(taxAmont?.tax1_value,3)} %</p>
                    </div>
                    <div className="taxwdth2">
                      <p>{formatAmount(taxAmont?.tax1Amount,2)}</p>
                    </div>
                  </div>
                )}
                {taxAmont?.tax2_taxname !== "" && (
                  <div className="disflx">
                    <div className="taxwdth1 spacLft2">
                      <p>{taxAmont?.tax2_taxname} @ {fixedValues(taxAmont?.tax2_value,3)} %</p>
                    </div>
                    <div className="taxwdth2">
                      <p>{formatAmount(taxAmont?.tax2Amount,2)}</p>
                    </div>
                  </div>
                )}
                {taxAmont?.tax3_taxname !== "" && (
                  <div className="disflx">
                    <div className="taxwdth1 spacLft2">
                      <p>{taxAmont?.tax3_taxname} @ {fixedValues(taxAmont?.tax3_value,3)} %</p>
                    </div>
                    <div className="taxwdth2">
                      <p>{formatAmount(taxAmont?.tax3Amount,2)}</p>
                    </div>
                  </div>
                )}
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
                {taxAmont?.IGSTTotalAmount !== 0 && (
                  <div className="disflx">
                    <div className="taxwdth1 spacLft2">
                      <p>IGST</p>
                    </div>
                    <div className="taxwdth2">
                      <p>{formatAmount(taxAmont?.IGSTTotalAmount,2)}</p>
                    </div>
                  </div>
                )}
                </div>
                <div className="disflx brTpm">
                  <div className="taxwdth1 spfntBld spacLft2" style={{ alignItems: "center" }}>GRAND TOTAL</div>
                  <div className="taxwdth2 spfntBld">
                    <span dangerouslySetInnerHTML={{ __html: json0Data?.CurrSymbol }} />
                    &nbsp;{NumberWithCommas(EndGrandTotal,2)}</div>
                </div>
              </div>
              </div>
              </div>

              {/** Total In Word */}
              <div className="taxwdth brbxAll spfntbH pgbrkIsd">
                <span className="spfntBld">Rs.</span> <span>{convertWithAnd(Number(EndGrandTotal?.toFixed(2)))} Only</span>
              </div>

              
              {/** Note */}
              <div className="sprmrk brbxAll spfntbH pgbrkIsd">
                <div className="spfntBld">NOTE :</div>
                {json0Data?.Declaration && ( 
                  <div className="spinst" dangerouslySetInnerHTML={{ __html: json0Data?.Declaration,}}></div>
                )}
              </div>
                
              {/** Company Details */}
              <div className="brbxAll spfntbH spbnkdtl spbrRht spacTpm pgbrkIsd">
                  <div className="spfntBld">COMPANY DETAILS :</div>
                  <div>GSTIN :<span>{json0Data?.Company_VAT_GST_No}</span></div>
                  <div>STATE CODE :<span>{json0Data?.Company_CST_STATE_No}</span></div>
                  <div>PAN NO. :</div>
                  <div>Kindly make your payment by the name of <span className="spfntBld">"{json0Data?.accountname}"</span></div>
                  <div>Payable at Surat (Gujarat) by cheque or DD</div>
                  <div>Bank Detail : Bank Account No <span className="spfntBld">{json0Data?.accountnumber}</span></div>
                  <div>Bank Name : {json0Data?.bankname}, {json0Data?.bankaddress}</div>
                  <div>RTGS/NEFT IFSC:<span>{json0Data?.rtgs_neft_ifsc}</span></div>
              </div>

              {/** Signature */}
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

export default InvoicePrint1Material;
