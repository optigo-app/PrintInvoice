// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=TVMvNDk0LzIwMjQ=&evn=TWF0ZXJpYWwgU2FsZQ==&pnm=SW52b2ljZSBQcmludDQ=&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvTWF0ZXJpYWxCaWxsX0pzb24=&ctv=NzE=&ifid=TaxInvoiceA&pid=undefined
import React, { useEffect } from "react";
import "../../assets/css/prints/solitaireInvoiceMaterial.css";
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

const SolitairInvoiceMaterial = ({
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
    const htmlContent = json0Data?.Printlable?.replace(/\n/g, '<br />');
  
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
  console.log("metalAndMiscWeight", metalAndMiscWeight);
  
  const remainingWeight = (Array.isArray(finalD) ? finalD : []).reduce((sum, item) => {
    const weight = parseFloat(item?.Weight);
    if (item?.ItemName !== 'METAL' && item?.ItemName !== 'MISC') {
      return sum + (isNaN(weight) ? 0 : weight);
    }
    return sum;
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
  const EndGrandTotal = totalAmount + taxAmont?.CGSTTotalAmount + taxAmont?.SGSTTotalAmount + taxAmont?.tax1Amount + taxAmont?.tax2Amount + taxAmont?.tax3Amount;

  console.log("taxAmont", taxAmont);
  console.log("extraTaxAmont", extraTaxAmont);
  console.log("json0Data", json0Data);
  console.log("finalD", finalD);

  const amount = Number(EndGrandTotal || 0);
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
                  SOLITAIRE INVOICE
                </b>
              </div>
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
                  {/* <div className="disflx">
                    <div className="wdthHd spfntBld">DUE DAYS</div>
                    <div className="wdthHd1">{json0Data?.OrderDue}</div>
                  </div> */}
                </div>
              </div>

              {/** Table Header */}
              <div className="disflx brbxAll spfntbH" style={{ marginTop: "5px"}}>
                <div className="col1_inv2 spfntBld spbrRht spfntCen">Sr#</div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "col2_inv2NGSt" : "col2_inv2"} spfntBld spfntCen spbrRht`}>Description</div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "col3_inv2NGSt" : "col3_inv2"} spbrRht spfntBld spfntCen`}>HSN#</div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "col4_inv2NGSt" : "col4_inv2"} spbrRht spfntBld spfntCen`}>Pcs</div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "col5_inv2NGSt" : "col5_inv2"} spfntBld spbrRht spfntCen`}>Wt</div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "col6_inv2NGSt" : "col6_inv2"} spbrRht spfntBld spfntCen`}>Rate</div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "col7_inv2NGSt" : "col7_inv2"} spbrRht spfntBld spfntCen`}>Amt</div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "col8_inv2NGSt" : "col8_inv2"} spfntBld spbrRht spfntCen`}>Disc. Amt</div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "col9_inv2NGSt" : "col9_inv2"} spfntBld spfntCen spbrRht`}>C. Rate</div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "col10_inv2NGSt" : "col10_inv2 spbrRht"} spfntBld spfntCen`}>Amount</div>
                {taxAmont?.CGSTTotalAmount === 0 ? "" : <>
                  <div className="col11_inv2 spbrRht spfntBld spfntCen">CGST(%)</div>
                  <div className="col12_inv2 spbrRht spfntBld spfntCen">CGST</div>
                  <div className="col13_inv2 spbrRht spfntBld spfntCen">SGST(%)</div>
                  <div className="col14_inv2 spbrRht spfntBld spfntCen">SGST</div>
                  <div className="col15_inv2 spfntBld spfntCen">TOTAL AMT</div>
                </>}
              </div>

              {/** table Body */}
              {finalD?.map((e, i) => {
                return (
                  <div key={i} className="disflx spbrlFt brBtom spfntbH2 pagBrkIsid">
                    <div className="col1_inv2 spbrRht spfntCen">{i + 1}</div>
                    <div className={`${e?.CGSTAmount === 0 ? "Sucol2_inv2NGSt" : "Sucol2_inv2"} spbrRht spbrWord spfntSt`}>
                    {e?.ItemName === "DIAMOND" 
                      ? `CUT AND POLISHED DIAMOND:${e?.shape}${e?.shape ? '/' : ''}${e?.quality}${e?.quality ? '/' : ''}${e?.color}${e?.color ? '/' : ''}${e?.size}`
                      : e?.ItemName === "COLOR STONE" 
                        ? `CS:${e?.shape}${e?.shape ? '/' : ''}${e?.quality}${e?.quality ? '/' : ''}${e?.color}${e?.color ? '/' : ''}${e?.size}` 
                        : e?.ItemName === "METAL" 
                          ? `METAL:${e?.shape}${e?.shape ? '/' : ''}${e?.quality}${e?.quality ? '/' : ''}${e?.color}${e?.color ? '/' : ''}${formatAmount(e?.Tunch,3)}`
                          : e?.ItemName === "MISC" 
                            ? `MISC:${e?.shape}${e?.shape ? '/' : ''}${e?.quality}${e?.quality ? '/' : ''}${e?.color}${e?.color ? '/' : ''}${e?.size}`
                            : e?.ItemName === "FINDING" 
                            ? `FINDING:${e?.shape}${e?.shape ? '/' : ''}${e?.quality}${e?.quality ? '/' : ''}${e?.color}${e?.color ? '/' : ''}${e?.size}`
                              : e?.ItemName === "ALLOY" 
                              ? `ALLOY:${e?.shape}${e?.shape ? '/' : ''}${e?.quality}${e?.quality ? '/' : ''}${e?.color}${e?.color ? '/' : ''}${e?.size}`
                                : e?.ItemName === "MOUNT" 
                                ? `MOUNT:${e?.shape}${e?.shape ? '/' : ''}${e?.quality}${e?.quality ? '/' : ''}${e?.color}${e?.color ? '/' : ''}${e?.size}`
                            : ""
                    }
                    </div>
                    <div className={`${e?.CGSTAmount === 0 ? "Sucol3_inv2NGSt" : "Sucol3_inv2"} spbrRht spbrWord spfntSt`}>{e?.HSN_No}</div>
                    <div className={`${e?.CGSTAmount === 0 ? "Sucol4_inv2NGSt" : "Sucol4_inv2"} spbrRht spbrWord spfnted`}>{e?.pieces}</div>
                    <div className={`${e?.CGSTAmount === 0 ? "Sucol5_inv2NGSt" : "Sucol5_inv2"} spbrRht spbrWord spfnted`}>
                      {fixedValues(e?.Weight === "" ? "-" : e?.Weight,3)}
                    </div>
                    <div className={`${e?.CGSTAmount === 0 ? "Sucol6_inv2NGSt" : "Sucol6_inv2"} spfnted spbrRht`}>
                      {formatAmount(e?.Rate === "" ? "-" : e?.Rate,2)}
                    </div>
                    <div className={`${e?.CGSTAmount === 0 ? "Sucol7_inv2NGSt" : "Sucol7_inv2"} spfnted spbrRht`}>
                      {formatAmount(e?.Amount === "" ? "-" : e?.Amount,2)}
                    </div>
                    <div className={`${e?.CGSTAmount === 0 ? "Sucol8_inv2NGSt" : "Sucol8_inv2"} spfnted spbrRht`}>
                      {/** Discount Amount */}
                    </div>
                    <div className={`${e?.CGSTAmount === 0 ? "Sucol9_inv2NGSt" : "Sucol9_inv2"} spfnted spbrRht`}>
                      {/** ColorStone Rate */}
                    </div>
                    <div className={`${e?.CGSTAmount === 0 ? "Sucol10_inv2NGSt" : "Sucol10_inv2"} spbrRht spfnted`}>
                      {formatAmount(e?.Amount === "" ? "-" : e?.Amount,2)}
                    </div>
                    {e?.CGSTAmount === 0 ? "" : <>
                      <div className="Sucol11_inv2 spfnted spbrRht">{fixedValues(e?.CGST === "" ? "-" : e?.CGST,3)}</div>
                      <div className="Sucol12_inv2 spfnted spbrRht">{formatAmount(e?.CGSTAmount === 0 ? "-" : e?.CGSTAmount,2)}</div>
                      <div className="Sucol13_inv2 spfnted spbrRht">{fixedValues(e?.SGST === "" ? "-" : e?.SGST,3)}</div>
                      <div className="Sucol14_inv2 spfnted spbrRht">{formatAmount(e?.SGSTAmount === 0 ? "-" : e?.SGSTAmount,2)}</div>
                      <div className="Sucol15_inv2 spfnted spbrRht">{formatAmount(e?.Amount === "" ? "-" : e?.Amount + e?.CGSTAmount + e?.SGSTAmount,2)}</div>
                    </>}
                  </div>
                )
              })}

              {/** Table Total */}
              <div className="disflx spbrlFt brBtom spfntbH2 pagBrkIsid">
                <div className="col1_inv2 spbrRht"></div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "Sucol2_inv2NGSt" : "Sucol2_inv2"} spbrRht spfntSt`}></div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "Sucol3_inv2NGSt" : "Sucol3_inv2"} spbrRht spfntSt`}></div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "Sucol4_inv2NGSt" : "Sucol4_inv2"} spbrRht spfntBld spfnted`}>{totalPieces}</div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "Sucol5_inv2NGSt" : "Sucol5_inv2"} spbrRht spfntBld spfnted`}>
                  {remainingWeight !== 0 && `${fixedValues(remainingWeight, 3)} ctw`} <br />
                  {metalAndMiscWeight !== 0 && `${fixedValues(metalAndMiscWeight, 3)} gm`}
                </div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "Sucol6_inv2NGSt" : "Sucol6_inv2"} spfnted spfntBld spbrRht`}></div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "Sucol7_inv2NGSt" : "Sucol7_inv2"} spfnted spbrRht`}></div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "Sucol8_inv2NGSt" : "Sucol8_inv2"} spfnted spfntBld spbrRht`}></div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "Sucol9_inv2NGSt" : "Sucol9_inv2"} spfnted spfntBld spbrRht`}></div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "Sucol10_inv2NGSt" : "Sucol10_inv2"} spbrRht spfntBld spfnted`}>{formatAmount(totalAmount,2)}</div>
                {taxAmont?.CGSTTotalAmount === 0 ? "" : <>
                  <div className="Sucol11_inv2 spfnted spfntBld spbrRht"></div>
                  <div className="Sucol12_inv2 spfnted spfntBld spbrRht">{formatAmount(taxAmont?.CGSTTotalAmount)}</div>
                  <div className="Sucol13_inv2 spfnted spfntBld spbrRht"></div>
                  <div className="Sucol14_inv2 spfnted spfntBld spbrRht">{formatAmount(taxAmont?.SGSTTotalAmount)}</div>
                  <div className="Sucol15_inv2 spfnted spfntBld spbrRht">{NumberWithCommas(GrandTotal,2)}</div>
                </>}
              </div>

              {/** Tax Amount */}
              <div className="disflx spfntbH2 pagBrkIsid">
                <div className="taxwdth spbrlFt spbrRht"></div>
                <div className={`taxwdth1 spbrRht 
                  ${taxAmont?.tax1Amount !== 0 || taxAmont?.tax2Amount !== 0 || taxAmont?.tax3Amount !== 0 || 
                    taxAmont?.CGSTTotalAmount !== 0 || taxAmont?.SGSTTotalAmount !== 0 || taxAmont?.IGSTTotalAmount !== 0 ? "brBtom" : ""}`}>
                  {taxAmont?.tax1Amount !== 0 && (
                      <div className="spacLft2 spfntBld">
                        <p>{taxAmont?.tax1_taxname} @ {fixedValues(taxAmont?.tax1_value,3)} %</p>
                      </div>
                  )}
                  {taxAmont?.tax2Amount !== 0 && (
                      <div className="spacLft2 spfntBld">
                        <p>{taxAmont?.tax2_taxname} @ {fixedValues(taxAmont?.tax2_value,3)} %</p>
                      </div>
                  )}
                  {taxAmont?.tax3Amount !== 0 && (
                      <div className="spacLft2 spfntBld">
                        <p>{taxAmont?.tax3_taxname} @ {fixedValues(taxAmont?.tax3_value,3)} %</p>
                      </div>
                  )}
                  {taxAmont?.CGSTTotalAmount !== 0 && (
                      <div className="spacLft2 spfntBld">
                        <p>CGST</p>
                      </div>
                  )}
                  {taxAmont?.SGSTTotalAmount !== 0 && (
                      <div className="spacLft2 spfntBld">
                        <p>SGST</p>
                      </div>
                  )}
                  {taxAmont?.IGSTTotalAmount !== 0 && (
                      <div className="spacLft2 spfntBld">
                        <p>IGST</p>
                      </div>
                  )}
                </div>
                <div className={`taxwdth2 spbrRht 
                  ${taxAmont?.tax1Amount !== 0 || taxAmont?.tax2Amount !== 0 || taxAmont?.tax3Amount !== 0 || 
                    taxAmont?.CGSTTotalAmount !== 0 || taxAmont?.SGSTTotalAmount !== 0 || taxAmont?.IGSTTotalAmount !== 0 ? "brBtom" : ""}`}>
                  {taxAmont?.tax1Amount !== 0 && (
                    <div className="spacLft2 spfntBld">
                        <p>{formatAmount(taxAmont?.tax1Amount,2)}</p>
                      </div>
                  )}
                  {taxAmont?.tax2Amount !== 0 && (
                      <div className="spacLft2 spfntBld">
                        <p>{formatAmount(taxAmont?.tax2Amount,2)}</p>
                      </div>
                  )}
                  {taxAmont?.tax3Amount !== 0 && (
                      <div className="spacLft2 spfntBld">
                        <p>{formatAmount(taxAmont?.tax3Amount,2)}</p>
                      </div>
                  )}
                  {taxAmont?.CGSTTotalAmount !== 0 && (
                      <div className="spacLft2 spfntBld">
                        <p>{formatAmount(taxAmont?.CGSTTotalAmount,2)}</p>
                      </div>
                  )}
                  {taxAmont?.SGSTTotalAmount !== 0 && (
                      <div className="spacLft2 spfntBld">
                        <p>{formatAmount(taxAmont?.SGSTTotalAmount,2)}</p>
                      </div>
                  )}
                  {taxAmont?.IGSTTotalAmount !== 0 && (
                      <div className="spacLft2 spfntBld">
                        <p>{formatAmount(taxAmont?.IGSTTotalAmount,2)}</p>
                      </div>
                  )}
                </div>
              </div>

              {/**Grand Total */}
              <div className="disflx spfntbH2 brBtom pagBrkIsid">
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "taxwdthGST" : "taxwdth"} spbrlFt spbrRht`} style={{ paddingLeft: "5px", paddingTop: "5px" }}>
                  In Words Indian Rupees <br /><span className="spfntBld">Rupees {rupeesInWords + paiseInWords} Only</span>
                </div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "taxwdth1GST" : "taxwdth1"} spbrRht spfntBld grtHet`} style={{ alignItems: "center" }}>
                  GRAND TOTAL
                </div>
                <div className={`${taxAmont?.CGSTTotalAmount === 0 ? "taxwdth2GST" : "taxwdth2"} spbrRht spfntBld grtHet`}>
                  <span dangerouslySetInnerHTML={{ __html: json0Data?.CurrSymbol }} />
                  {NumberWithCommas(EndGrandTotal,2)}
                </div>
              </div>
              
              {/** Instuction */}
              {json0Data?.Declaration && ( 
                <div className="brbxAll pagBrkIsid" style={{ borderTop: "none" }}>
                  <div className="spinst" dangerouslySetInnerHTML={{ __html: json0Data?.Declaration,}}></div>
                </div>
              )}

              <div className="disflx brbxAll spfntbH pagBrkIsid" style={{ borderTop: "none" }}>
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

export default SolitairInvoiceMaterial;
