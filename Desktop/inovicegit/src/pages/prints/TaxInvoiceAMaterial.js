// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=TVMvMzY0LzIwMjQ=&evn=TWF0ZXJpYWwgc2FsZQ==&pnm=dGF4IGludm9pY2UgYQ==&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvTWF0ZXJpYWxCaWxsX0pzb24=&ctv=NzE=&ifid=DetailPrintR&pid=undefined
import React, { useEffect } from "react";
import "../../assets/css/prints/TaxInvoiceA.scss";
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

const TaxInvoiceAMaterial = ({
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
  const [checkBoxNew, setCheckBoxNew] = useState("Triplicate for Supplier");
  const [finalD, setFinalD] = useState({});
  const [custAddress, setCustAddress] = useState([]);
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };

  const handleChangeNew = (label) => {
    setCheckBoxNew(label);
  };

  const options = [
    "Triplicate for Supplier",
    "Duplicate for Transporter",
    "Original for Recipient",
  ];

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

            setJson0Data(data?.Data?.MaterialBill_Json[0]);
            setFinalD(data?.Data?.MaterialBill_Json1);
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

  console.log("finalDfinalDfinalD", json0Data, finalD);


  const summary = finalD?.reduce((acc, item) => {
  acc.totalPieces += item.pieces;
  acc.totalWeight += item.Weight;
  acc.totalAmount += item.TotalAmount;
  return acc;
}, {
  totalPieces: 0,
  totalWeight: 0,
  totalAmount: 0
});

  const styles = `
    @media print {
      @page {
        size: A4;

            @bottom-right {
          content: "Page " counter(page) " of " counter(pages);
          font-family: Arial, sans-serif;
          font-size: 10pt;
          color: #666;
        }
      }
      .no-print {
        display: none !important;
      }

      .footerForThe_print {
        page-break-inside: avoid;
      }
      
    }
  `;

  return (
    <>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        <div className="container containerDetailPrint1 pt-4 ">
          <style>{styles}</style>
          <div
            className="tax_invoice_main_allPrint"
            style={{
              border: "2px solid black",
              position: "relative",
              // backgroundImage: watermarkimg ? `url(${watermarkimg})` : "none",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="print_watermark_element"></div>
            <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 pt-4">
              {/* <div className="form-check d-flex align-items-center detailPrint1L_font_13">
                <input
                  className="border-dark me-2"
                  type="checkbox"
                  checked={checkBox?.image}
                  onChange={(e) => handleChange(e)}
                  name="image"
                />
                <label className="pt-1">With Image</label>
              </div> */}
              {options?.map((labelText, index) => (
                <div
                  key={index}
                  className="form-check d-flex align-items-center detailPrint1L_font_13"
                >
                  <input
                    className="border-dark me-2"
                    type="checkbox"
                    checked={checkBoxNew === labelText}
                    onChange={() => handleChangeNew(labelText)}
                  />
                  <label className="pt-1">{labelText}</label>
                </div>
              ))}
              <div className="form-check detailPrint1L_font_14">
                <input
                  type="button"
                  className="btn_white blue mt-0"
                  value="Print"
                  onClick={(e) => handlePrint(e)}
                />
              </div>
            </div>
            {/* header line*/}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  position: "absolute",
                  right: "20px",
                  top: "-10px",
                }}
              >
                <p>{checkBoxNew}</p>
              </div>
              <div
                className="col-6"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                {isImageWorking && json0Data?.PrintLogo !== "" && (
                  <img
                    src={json0Data?.PrintLogo}
                    alt=""
                    onError={handleImageErrors}
                    height={120}
                    width={150}
                  />
                )}
              </div>
              <p style={{ textAlign: "center" }}>
                <b>TAX INVOICE</b>
              </p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 5px 10px 5px",
              }}
            >
              <div style={{ width: "40%" }}>
                <p className="lhDetailPrint1 ">
                  <b>Bill To,</b>
                </p>
                <div className="header_top_content_main_class">
                  <p className="Header_top_title_name">Name </p>
                  <p className="Header_top_title_value_name">
                    {json0Data?.customerfirmname}
                  </p>
                </div>
                <div className="header_top_content_main_class">
                  <p className="Header_top_title_name">Address</p>
                  <p
                    className="Header_top_title_value_name"
                    style={{
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    <span>
                      <span>{json0Data?.customerAddress1}</span>
                      {json0Data?.customerAddress2 && (
                        <span>{json0Data.customerAddress2}, </span>
                      )}
                      {json0Data?.customerAddress3 && (
                        <span style={{ wordBreak: "auto-phrase" }}>
                          {json0Data.customerAddress3}{" "}
                        </span>
                      )}
                      {json0Data?.customercity1 && (
                        <span style={{ wordBreak: "auto-phrase" }}>
                          {json0Data.customercity1},{" "}
                        </span>
                      )}
                      {json0Data?.State && <span>{json0Data.State} </span>}
                      {json0Data?.customerpincode && (
                        <span>{json0Data.customerpincode}</span>
                      )}
                    </span>
                  </p>
                </div>

                <div className="header_top_content_main_class">
                  <p className="Header_top_title_name">State Code </p>
                  <p className="Header_top_title_value_name"></p>
                </div>
                <div className="header_top_content_main_class">
                  <p className="Header_top_title_name">Contact No. </p>
                  <p className="Header_top_title_value_name">
                    {json0Data?.customermobileno}
                  </p>
                </div>
                <div className="header_top_content_main_class">
                  <p className="Header_top_title_name">Email </p>
                  <p className="Header_top_title_value_name">
                    {json0Data?.customeremail}
                  </p>
                </div>
                <div className="header_top_content_main_class">
                  <p className="Header_top_title_name">PAN No. </p>
                  <p className="Header_top_title_value_name">
                    {json0Data?.customerPANno}
                  </p>
                </div>
                <div className="header_top_content_main_class">
                  <p className="Header_top_title_name">GST No. </p>
                  <p className="Header_top_title_value_name">
                    {json0Data?.Cust_VAT_GST}
                  </p>
                </div>
              </div>

              <div style={{ padding: "0px 5px", width: "35%" }}>
                <div>
                  <p className="lhDetailPrint1">
                    <b>Ship To,</b>
                  </p>
                  <div className="header_top_content_main_class">
                    <p className="Header_top_title_value_name">
                      {json0Data?.customerfirmname}
                    </p>
                  </div>
                  <div className="header_top_content_main_class">
                    <p className="Header_top_title_value_name">
                      {custAddress?.map((e, i) => {
                        return <p key={i}>{e}</p>;
                      })}
                      {/* {json0Data?.Printlable} , {json0Data?.customerstate}{" "} */}
                    </p>
                  </div>
                  <div className="header_top_content_main_class">
                    <p className="Header_top_title_value_name">
                      {json0Data?.customerstate}
                    </p>
                  </div>
                  <div className="header_top_content_main_class">
                    <p className="Header_top_title_value_name">
                      {finalD?.header?.CustPanno}
                    </p>
                  </div>
                  <div
                    className="header_top_content_main_class"
                    style={{ minHeight: "40px" }}
                  >
                    <p className="Header_top_title_value_name">
                      {finalD?.header?.address?.map((e, i) => {
                        return <div key={i}>{e}</div>;
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: "30%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <div>
                  <div className="header_top_content_main_class">
                    <p className="Header_top_title_name">Invoice No.</p>
                    <p className="Header_top_title_value_name">
                      <b>{json0Data?.MaterialBillNo}</b>
                    </p>
                  </div>
                  <div className="header_top_content_main_class">
                    <p className="Header_top_title_name">Date </p>
                    <p className="Header_top_title_value_name">
                      {json0Data?.EntryDate}
                    </p>
                  </div>
                  <div className="header_top_content_main_class">
                    <p className="Header_top_title_name">HSN Code</p>
                    <p className="Header_top_title_value_name">
                      {json0Data?.HSN_No}
                    </p>
                  </div>
                  <div className="header_top_content_main_class">
                    <p className="Header_top_title_name">Location Code </p>
                    <p className="Header_top_title_value_name">2001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* table header*/}
            <table style={{ width: "100%" }}>
              {/* {finalD?.resultArray?.length > 6 ? ( */}
              <thead>
                <div
                  style={{
                    borderTop: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                  className="d-flex w-100 recordDetailPrint1 detailPrint1L_font_11"
                >
                  <div className="designDetalPrint1 d-flex justify-content-center align-items-center flex-column">
                    <p className="fw-bold" style={{ fontSize: "11px" }}>
                      Sr No.
                    </p>
                  </div>
                  <div
                    className="designDetalPrint3 d-flex justify-content-center align-items-center"
                    style={{ width: "25%" }}
                  >
                    <p className="fw-bold p-1" style={{ fontSize: "11px" }}>
                      Description
                    </p>
                  </div>
                  <div
                    className="designDetalPrint4 d-flex align-items-center"
                    style={{ width: "10%" , display: 'flex', justifyContent: 'flex-end'}}
                  >
                    <p className="fw-bold p-1" style={{ fontSize: "11px" }}>
                      Qty (pcs)
                    </p>
                  </div>
                  <div
                    className="designDetalPrint5 d-flex justify-content-left align-items-center"
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <p className="fw-bold p-1" style={{ fontSize: "11px" }}>
                      Weight(Carat)
                    </p>
                  </div>
                  <div
                    className="designDetalPrint6  d-flex justify-content-left align-items-center"
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      width: "15%",
                    }}
                  >
                    <p className="fw-bold p-1" style={{ fontSize: "11px" }}>
                      Rate Per Carat(INR)
                    </p>
                  </div>
                  <div
                    className="designDetalPrint7 d-flex justify-content-left align-items-center"
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      width: "15%",
                    }}
                  >
                    <p className="fw-bold p-1" style={{ fontSize: "11px" }}>
                      Discount (INR)
                    </p>
                  </div>
                  <div
                    className="designDetalPrint8 d-flex justify-content-left align-items-center"
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      width: "18%",
                    }}
                  >
                    <p className="fw-bold p-1" style={{ fontSize: "11px" }}>
                      Total Amount (INR)
                    </p>
                  </div>
                </div>
              </thead>

              {/* data */}
              <div
                style={{
                  minHeight: "300px",
                }}
              >
                {finalD?.map((e, i) => {
                  return (
                    <div
                      key={i}
                      className="recordDetailPrint1 detailPrint1L_font_11"
                    >
                      <div className="d-flex w-100">
                        <div className="designDetalPrint1 pt-1">
                          <p className="text-center">
                            {NumberWithCommas(i + 1, 0)}
                          </p>
                        </div>

                        <div
                          className="designDetalPrint3   p-1 "
                          style={{ width: "25%" }}
                        >
                          <div className="d-flex justify-content-between">
                            <p>
                              Diamond 2 Lab Grown {e?.MaterialTypeName}{" "}
                              {e?.MetalPurity} {e?.shape}/{e?.quality}/
                              {e?.color}
                              {e?.LotNo ? `, Cert#: ${e.LotNo}` : ""}
                            </p>
                          </div>
                        </div>
                        <div
                          className="designDetalPrint4   p-1 "
                          style={{ width: "10%", display:'flex', justifyContent: 'flex-end' }}
                        >
                          <div className="d-flex justify-content-between">
                            <p style={{ width: "100%", textAlign: "center" }}>
                              {e?.pieces}
                            </p>
                          </div>
                        </div>
                        <div
                          className="designDetalPrint5   p-1 "
                        >
                          <div className="d-flex justify-content-between">
                            <p style={{ width: "100%", textAlign: "right" }}>
                              {(e?.Weight)?.toFixed(3)}
                            </p>
                          </div>
                        </div>
                        <div
                          className="designDetalPrint6 p-1 "
                          style={{ width: "15%" }}
                        >
                          <div className="d-flex justify-content-between">
                            <p style={{ width: "100%", textAlign: "right" }}>
                              {formatAmount(e?.Rate)}
                            </p>
                          </div>
                        </div>
                        <div
                          className="designDetalPrint7 p-1"
                          style={{ width: "15%" }}
                        >
                          <div className="d-flex justify-content-between">
                            <p
                              style={{
                                width: "100%",
                                textAlign: "right",
                                width: "15%",
                              }}
                            >
                              {" "}
                              {/* {formatAmount(
                                e?.DiscountAmt /
                                  finalD?.header?.CurrencyExchRate
                              )} */}
                            </p>
                          </div>
                        </div>
                        <div
                          className="designDetalPrint8"
                          style={{ padding: ".25rem 10px", width: "18%" }}
                        >
                          <div className="d-flex justify-content-between">
                            <p style={{ width: "100%", textAlign: "right" }}>
                              {formatAmount(e?.TotalAmount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="myToalaSection">
                <div
                  style={{
                    display: "flex",
                    borderTop: "1px solid green",
                    borderBottom: "1px solid green",
                  }}
                  // className={finalD?.resultArray?.length > 3 && "page_break"}
                >
                  <div style={{ width: "20%" }}></div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1px",
                      width: "80%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        borderBottom: "1px solid green",
                        paddingBlock: "5px",
                      }}
                    >
                      <p style={{ width: "22%" }}>Sub Total</p>
                      <div
                        style={{
                          display: "flex",
                          width: "78%",
                          paddingRight: "10px",
                        }}
                      >
                        <p style={{ width: "12%" }}>
                          <b>{summary?.totalPieces}</b>
                        </p>
                        <p style={{ width: "50%" }}>
                          <b>
                            {(summary?.totalWeight)?.toFixed(3)} ctw
                          </b>
                        </p>
                        <p
                          style={{
                            width: "38%",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <b>{formatAmount(summary?.totalAmount)}</b>
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        borderBottom: "1px solid green",
                        justifyContent: "space-between",
                        paddingRight: "10px",
                      }}
                    >
                      <p>Discount</p>
                      <p>
                        <b>
                          {formatAmount(
                            finalD?.mainTotal?.total_discount_amount
                          )}
                        </b>
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        borderBottom: "1px solid green",
                        justifyContent: "space-between",
                        paddingRight: "10px",
                      }}
                    >
                      <p>Taxable Value</p>
                      <p>
                        <b>{formatAmount(finalD?.mainTotal?.total_amount)}</b>
                      </p>
                    </div>
                    {finalD?.allTaxes?.map((e, i) => {
                      return (
                        <div
                          style={{
                            display: "flex",
                            borderBottom: "1px solid green",
                            justifyContent: "space-between",
                            paddingRight: "10px",
                          }}
                          key={i}
                        >
                          <p>
                            {" "}
                            {e?.name} {e?.per}{" "}
                          </p>
                          <p>
                            {" "}
                            <b>{formatAmount(e?.amountInNumber)}</b>{" "}
                          </p>
                        </div>
                      );
                    })}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingRight: "10px",
                      }}
                    >
                      <p>Total</p>
                      <p>
                        <b>
                          {" "}
                          {formatAmount(
                            finalD?.mainTotal?.total_amount /
                              finalD?.header?.CurrencyExchRate +
                              finalD?.allTaxesTotal +
                              finalD?.header?.FreightCharges /
                                finalD?.header?.CurrencyExchRate
                          )}
                        </b>
                      </p>
                    </div>
                  </div>
                </div>
                {json0Data?.Declaration && (
                  <div
                    className="second_main_box_div"
                    style={{ padding: "4px" }}
                  >
                    <p className="memo1_title_secondBox_bottom_desc">
                      <b>Terms & Conditions :</b>
                    </p>
                    <div
                      className="tax_inoivea_declartion"
                      dangerouslySetInnerHTML={{
                        __html: json0Data?.Declaration,
                      }}
                    ></div>
                  </div>
                )}
                <div
                  style={{
                    borderTop: "1px solid green",
                    borderBottom: "1px solid green",
                    paddingBottom: "5px",
                  }}
                >
                  <div className="col-6 p-1 w-100">
                    <p>
                      <b>Banking & GST information:</b>
                    </p>
                    <div style={{ display: "flex", lineHeight: "11px" }}>
                      <p style={{ minWidth: "120px" }}>Baneficiary Name :</p>
                      <p>{json0Data?.CompanyFullName}</p>
                    </div>
                    <div style={{ display: "flex", lineHeight: "11px" }}>
                      <p style={{ minWidth: "120px" }}>Bank Name & Address:</p>
                      <p>
                        {json0Data?.bankname} , {json0Data?.bankaddress}
                      </p>
                    </div>
                    <div style={{ display: "flex", lineHeight: "11px" }}>
                      <p style={{ minWidth: "120px" }}>Account Name :</p>
                      <p>{json0Data?.accountname}</p>
                    </div>
                    <div style={{ display: "flex", lineHeight: "11px" }}>
                      <p style={{ minWidth: "120px" }}>Account Number :</p>
                      <p>{json0Data?.accountnumber}</p>
                    </div>
                    <div style={{ display: "flex", lineHeight: "11px" }}>
                      <p style={{ minWidth: "120px" }}>Bank IFSC Code :</p>
                      <p>{json0Data?.rtgs_neft_ifsc}</p>
                    </div>
                    <div style={{ display: "flex", lineHeight: "11px" }}>
                      <p style={{ minWidth: "120px" }}>Bank MICR Code :</p>
                      <p></p>
                    </div>
                    <div style={{ display: "flex", lineHeight: "11px" }}>
                      <p style={{ minWidth: "120px" }}>Bank SWIFT Code :</p>
                      <p></p>
                    </div>
                    <div style={{ display: "flex", lineHeight: "11px" }}>
                      <p style={{ minWidth: "120px" }}>GST Number :</p>
                      <p>{json0Data?.Company_VAT_GST_No}</p>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid green",
                    minHeight: "80px",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px",
                  }}
                  className="bottomo_section_for_print"
                >
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <p>
                      <b style={{ fontSize: "12px" }}>Buyer`s Signature</b>
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>
                      <b style={{ fontSize: "11px" }}>
                        For Aryamond Luxury Products Private Limited
                      </b>
                    </p>
                    <p>
                      <b
                        style={{
                          fontSize: "12px",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        Authorized Signature
                      </b>
                    </p>
                  </div>
                </div>
              </div>
              <tfoot>
                <tr>
                  <td>
                    <div
                      className="footerForThe_print"
                      style={{
                        // borderTop: "1px solid black",
                        paddingTop: "10px",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          marginBlock: "5px",
                          width: "60%",
                          margin: "auto",
                        }}
                      >
                        <h2
                          style={{ textAlign: "center" }}
                          className="fw-bold detailPrint1L_font_16"
                        >
                          {json0Data?.CompanyFullName}
                        </h2>
                        <p
                          style={{ textAlign: "center" }}
                          className="lhDetailPrint1"
                        >
                          {json0Data?.CompanyAddress2}{" "}
                          {json0Data?.CompanyAddress} {json0Data?.CompanyCity}-
                          {json0Data?.CompanyPinCode}, {json0Data?.CompanyState}{" "}
                          ({json0Data?.CompanyCountry})
                        </p>
                        <p
                          style={{ textAlign: "center" }}
                          className="lhDetailPrint1"
                        >
                          {json0Data?.CompanyEmail} | T{" "}
                          {json0Data?.CompanyTellNo}
                        </p>
                        <p
                          className="lhDetailPrint1"
                          style={{
                            textAlign: "center",
                          }}
                        >
                          {json0Data?.CompanyWebsite}
                        </p>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          right: "20px",
                          top: "10px",
                        }}
                      >
                        <img
                          src={signatureLogo}
                          alt="Signature"
                          className="jewel_design_images"
                          style={{ maxWidth: "100px" }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>{" "}
        </div>
      ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
          {msg}
        </p>
      )}
    </>
  );
};

export default TaxInvoiceAMaterial;
