// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=U0sxOTk5MjAyNA==&evn=c2FsZSByZXR1cm4=&pnm=cGFja2luZyBsaXN0IDNh&up=aHR0cDovL3plbi9qby9hcGktbGliL0FwcC9TYWxlQmlsbF9Kc29u&ctv=NzE=&ifid=PackingList3&pid=undefined
import React, { useEffect, useState } from "react";
import "../../assets/css/prints/PackingList3A.scss";
import {
  apiCall,
  formatAmount,
  handleImageError,
  isObjectEmpty,
} from "../../GlobalFunctions";
import { OrganizeInvoicePrintData } from "../../GlobalFunctions/OrganizeInvoicePrintData";
import Loader from "../../components/Loader";

function PackingList3A({ token, invoiceNo, printName, urls, evn, ApiVer }) {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);
  const [total, setTotal] = useState([]);

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
  }, []);

  const loadData = (data) => {
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;
    const datas = OrganizeInvoicePrintData(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );

    setResult(datas);
    let metalData = [];
    let shapeMetalData = [];

    datas?.json2?.map((data) => {
      if (data?.MasterManagement_DiamondStoneTypeid == 4) {
        metalData?.push(data);
      }
    });

    let silverObj = {
      name: "SILVER",
      amount: 0,
    };

    let goldObj = {
      name: "GOLD",
      amount: 0,
    };

    metalData?.map((data) => {
      if (data?.ShapeName === "GOLD") {
        goldObj.amount += data?.Amount;
      }

      if (data?.ShapeName === "SILVER") {
        silverObj.amount += data?.Amount;
        // shapeMetalData?.push(data);
      }
    });

    shapeMetalData?.push(goldObj);
    shapeMetalData?.push(silverObj);
    setTotal(shapeMetalData);
  };

  const handleImageErrors = () => {
    setIsImageWorking(false);
  };

  console.log("ress", result);
  return (
    <div className="packList_3a_main">
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <div className="packingListDemo_main_App pb-5">
              <div style={{ marginTop: "20px" }} className="w-100 d-flex justify-content-end mb-3">
                <button
                  className="btn_white blue"
                  id="printbtn"
                  accessKey="p"
                  onClick={() => window.print()}
                >
                  Print
                </button>
              </div>
              <div className="packing_list7_main_header">
                <p style={{ margin: "0px", color: "white" }}>
                  PRODUCT DETAIL SHEET
                </p>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p style={{ display: "flex" }}>
                      <b>{result?.header?.CompanyFullName}</b>
                    </p>
                    <p style={{ display: "flex" }}>
                      {result?.header?.CompanyAddress}
                    </p>
                    <p style={{ display: "flex" }}>
                      {result?.header?.CompanyAddress2}
                    </p>
                    <p style={{ display: "flex" }}>
                      {result?.header?.customercity1}-
                      {result?.header?.CompanyPinCode},
                      {result?.header?.CompanyState}(
                      {result?.header?.CompanyCountry})
                    </p>
                    <p style={{ display: "flex" }}>
                      T {result?.header?.CompanyTellNo} | TOLL FREE{" "}
                      {result?.header?.CompanyTollFreeNo} | TOLL FREE{" "}
                      {result?.header?.CompanyTollFreeNo}
                    </p>
                    <p style={{ display: "flex" }}>
                      {result?.header?.CompanyEmail} |{" "}
                      {result?.header?.CompanyWebsite}
                    </p>
                    <p style={{ display: "flex" }}>
                      {result?.header?.Company_VAT_GST_No}|{" "}
                      {result?.header?.Company_CST_STATE}-
                      {result?.header?.Company_CST_STATE_No} | PAN-
                      {result?.header?.Com_pannumber}
                    </p>
                  </div>
                  <div>
                    {isImageWorking && (
                      <img
                        src={result?.header?.PrintLogo}
                        style={{
                          width: "100%",
                          maxWidth: "120px",
                          objectFit: "contain",
                        }}
                        onError={handleImageErrors}
                      />
                    )}
                  </div>
                </div>

                <div
                  className="paking_3a_top_addressbox"
                  style={{ marginTop: "10px" }}
                >
                  <div className="paking3a_topBox1">
                    <p className="topBox_p">To,</p>
                    <p className="topBox_p">
                      <b>{result?.header?.customerfirmname}</b>
                    </p>
                    <p className="topBox_p">
                      {" "}
                      {result?.header?.customerAddress1}{" "}
                    </p>
                    <p className="topBox_p">
                      {result?.header?.customerAddress2}
                    </p>
                    <p className="topBox_p">
                      {result?.header?.customercity}
                      {result?.header?.PinCode}
                    </p>
                    <p className="topBox_p">{result?.header?.customeremail1}</p>
                    <p className="topBox_p">{result?.header?.vat_cst_pan}</p>
                    <p className="topBox_p">
                      {result?.header?.Cust_CST_STATE}-
                      {result?.header?.Cust_CST_STATE_No}
                    </p>
                  </div>
                  <div className="paking3a_topBox2">
                    <p className="topBox_p"> Ship To,</p>
                    <p className="topBox_p">
                      <b>{result?.header?.customerfirmname}</b>
                    </p>
                    {result?.header?.address?.map((line, index) => (
                      <React.Fragment key={index}>
                        <p className="topBox_p">{line}</p>
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="paking3a_topBox3">
                    <p className="topBox_p">
                      <b style={{ width: "100px", display: "flex" }}>BILL NO</b>{" "}
                      {result?.header?.InvoiceNo}
                    </p>
                    <p className="topBox_p">
                      {" "}
                      <b style={{ width: "100px", display: "flex" }}>DATE </b>
                      {result?.header?.EntryDate}
                    </p>
                    <p className="topBox_p">
                      <b style={{ width: "100px", display: "flex" }}>
                        {" "}
                        {result?.header?.HSN_No_Label}{" "}
                      </b>
                      {result?.header?.HSN_No}
                    </p>
                  </div>
                </div>
              </div>

              <div className="paking3a_TableView_main_div">
                <div className="paking3a_second_box_top_title">
                  <div className="paking3a_col1">
                    <p className="paking3a_second_box_Title">Sr</p>
                  </div>
                  <div className="paking3a_col2">
                    <p className="paking3a_second_box_Title">Design</p>
                  </div>
                  <div className="paking3a_col3">
                    <div>
                      <p className="paking3a_second_box_Title_withSub">
                        Diamond
                      </p>
                    </div>
                    <div className="paking3a_col3_sub_div">
                      <p className="paking3a_col3_sub_div_more_sub1"> Code</p>
                      <p className="paking3a_col3_sub_div_more_sub2">Size</p>
                      <p className="paking3a_col3_sub_div_more_sub3">Pcs</p>
                      <p className="paking3a_col3_sub_div_more_sub4">Wt</p>
                      <p className="paking3a_col3_sub_div_more_sub5">Rate</p>
                      <p className="paking3a_col3_sub_div_more_sub6">Amount</p>
                    </div>
                  </div>
                  <div className="paking3a_col4">
                    <div>
                      <p className="paking3a_second_box_Title_withSub">Metal</p>
                    </div>
                    <div className="paking3a_col4_sub_div">
                      <p className="paking3a_col4_sub_div_p"> Quality</p>
                      <p className="paking3a_col4_sub_div_p">Gwt</p>
                      <p className="paking3a_col4_sub_div_p">N + L</p>
                      <p className="paking3a_col4_sub_div_p">Rate</p>
                      <p className="paking3a_col4_sub_div_p_last">Amount</p>
                    </div>
                  </div>
                  <div className="paking3a_col5">
                    <div>
                      <p className="paking3a_second_box_Title_withSub">
                        Stone & Misc
                      </p>
                    </div>
                    <div className="paking3a_col3_sub_div">
                      <p className="paking3a_col3_sub_div_more_sub1"> Code</p>
                      <p className="paking3a_col3_sub_div_more_sub2">Size</p>
                      <p className="paking3a_col3_sub_div_more_sub3">Pcs</p>
                      <p className="paking3a_col3_sub_div_more_sub4">Wt</p>
                      <p className="paking3a_col3_sub_div_more_sub5">Rate</p>
                      <p className="paking3a_col3_sub_div_more_sub6">Amount</p>
                    </div>
                  </div>
                  <div className="paking3a_col6">
                    <div>
                      <p className="paking3a_second_box_Title_withSub">
                        Labour & Other Charges
                      </p>
                    </div>
                    <div className="paking3a_col6_sub_div">
                      <p className="paking3a_col6_sub_div_p">Charges</p>
                      <p className="paking3a_col6_sub_div_p">Rate</p>
                      <p className="paking3a_col6_sub_div_p_last">Amount</p>
                    </div>
                  </div>
                  <div className="paking3a_col7">
                    <p className="paking3a_second_box_Title">Total Amount</p>
                  </div>
                </div>

                <div>
                  {result?.resultArray?.map((data, ind) => {
                    return (
                      <div className="paking3a_table_Data_box">
                        <div className="paking3a_tabledata_col1">
                          <p className="paking3a_second_box_Title">{ind + 1}</p>
                        </div>
                        <div className="paking3a_tabledata_col2">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <div>{data?.SrJobno}</div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <p>{data?.designno}</p>
                              <p>{data?.MetalColor}</p>
                            </div>
                          </div>
                          <div>
                            <img
                              src={data?.DesignImage}
                              style={{
                                height: "75px",
                                width: "75px",
                                objectFit: "contain",
                              }}
                              onError={handleImageError}
                              className="paking3a_design_img"
                            />
                          </div>
                          <div>
                            HUID : <b>{data?.HUID}</b>
                            <br />
                            <b> PO:- {data?.PO}</b>
                            <br />
                            Tunch: <b>{data?.Tunch}</b>
                            <br />
                            <b> {data?.grosswt} gm</b> Gross
                          </div>
                        </div>
                        <div
                          className="paking3a_tabledata_col3"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            {data?.diamonds?.map((e, i) => {
                              return (
                                <div className="paking3a_col3_sub_div" key={i}>
                                  <p className="paking3a_col3_sub_div_more_sub1">
                                    {" "}
                                    {e?.ShapeName}
                                  </p>
                                  <p className="paking3a_col3_sub_div_more_sub2">
                                    {e?.SizeName}
                                  </p>
                                  <p className="paking3a_col3_sub_div_more_sub3">
                                    {e?.Pcs}
                                  </p>
                                  <p className="paking3a_col3_sub_div_more_sub4">
                                    {e?.Wt}
                                  </p>
                                  <p className="paking3a_col3_sub_div_more_sub5">
                                    {e?.Rate}
                                  </p>
                                  <p className="paking3a_col3_sub_div_more_sub6">
                                    <b>
                                      {(
                                        e?.Amount /
                                        result?.header?.CurrencyExchRate
                                      )?.toFixed(2)}
                                    </b>
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          <div
                            className="paking3a_col3_sub_div_totalValue"
                            style={{ borderTop: "1px solid #bdbdbd" }}
                          >
                            <p className="paking3a_col3_sub_div_more_sub1"></p>
                            <p className="paking3a_col3_sub_div_more_sub2"></p>
                            <p className="paking3a_col3_sub_div_more_sub3">
                              <b>{data?.totals?.diamonds?.Pcs}</b>
                            </p>
                            <p className="paking3a_col3_sub_div_more_sub4">
                              <b> {data?.totals?.diamonds?.Wt?.toFixed(3)}</b>
                            </p>
                            <p className="paking3a_col3_sub_div_more_sub5"></p>
                            <p className="paking3a_col3_sub_div_more_sub6">
                              <b>
                                {(
                                  data?.totals?.diamonds?.Amount /
                                  result?.header?.CurrencyExchRate
                                )?.toFixed(2)}
                              </b>
                            </p>
                          </div>
                        </div>
                        <div className="paking3a_tabledata_col4">
                          {/* <div className="paking3a_col4_sub_div">
                            <p className="paking3a_col4_sub_div_finalValus">
                              {" "}
                              {data?.MetalType}
                              {data?.MetalPurity}
                            </p>
                            <p className="paking3a_col4_sub_div_finalValus">
                              {data?.grosswt}
                            </p>
                            <p className="paking3a_col4_sub_div_finalValus">
                              {data?.NetWt + data?.LossWt}
                            </p>
                            <p className="paking3a_col4_sub_div_finalValus">
                              {data?.metal_rate}
                            </p>
                            <p className="paking3a_col4_sub_div_finalValus_amount">
                              <b> {data?.MetalAmount}</b>
                            </p>
                          </div> */}
                          <div
                            style={{
                              width: "100%",
                            }}
                          >
                            {data?.metal?.map((data2, index) => {
                              return (
                                <div
                                  className="paking3a_col4_sub_div"
                                  key={index}
                                >
                                  <p className="paking3a_col4_sub_div_finalValus">
                                    {" "}
                                    {data2?.ShapeName}
                                    {data2?.QualityName}
                                  </p>
                                  <p className="paking3a_col4_sub_div_finalValus">
                                    {index == 0 && data?.grosswt}
                                  </p>
                                  <p className="paking3a_col4_sub_div_finalValus">
                                    {data2?.Wt + data?.LossWt}
                                  </p>
                                  <p className="paking3a_col4_sub_div_finalValus">
                                    {data2?.Rate}
                                  </p>
                                  <p className="paking3a_col4_sub_div_finalValus_amount">
                                    <b> {data2?.Amount}</b>
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          <div
                            className="paking3a_col4_sub_div_value"
                            style={{ borderTop: "1px solid #bdbdbd" }}
                          >
                            <p className="paking3a_col4_sub_div_finalValus"></p>
                            <p className="paking3a_col4_sub_div_finalValus">
                              <b>{data?.grosswt?.toFixed(2)}</b>
                            </p>
                            <p className="paking3a_col4_sub_div_finalValus">
                              <b>{data?.NetWt + data?.LossWt}</b>
                            </p>
                            <p className="paking3a_col4_sub_div_finalValus"></p>
                            <p className="paking3a_col4_sub_div_finalValus_amount">
                              <b>{formatAmount(data?.totals?.metal?.Amount)}</b>
                            </p>
                          </div>
                        </div>
                        <div
                          className="paking3a_tabledata_col5"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            {data?.colorstone?.map((e, i) => {
                              return (
                                <div className="paking3a_col5_sub_div" key={i}>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    {e?.ShapeName}
                                  </p>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    {e?.SizeName}
                                  </p>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    {e?.Pcs}
                                  </p>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    {e?.Wt}
                                  </p>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    {e?.Rate}
                                  </p>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    <b>
                                      {e?.Amount /
                                        result?.header?.CurrencyExchRate}
                                    </b>
                                  </p>
                                </div>
                              );
                            })}
                            {data?.misc?.map((e, i) => {
                              return (
                                <div className="paking3a_col5_sub_div" key={i}>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    M:{e?.ShapeName}
                                  </p>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    {e?.SizeName}
                                  </p>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    {e?.Pcs}
                                  </p>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    {e?.Wt}
                                  </p>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    {e?.Rate}
                                  </p>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    <b>
                                      {(
                                        e?.Amount /
                                        result?.header?.CurrencyExchRate
                                      )?.toFixed(2)}
                                    </b>
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          <div
                            className="paking3a_col5_sub_div"
                            style={{
                              backgroundColor: "#f5f5f5",
                              borderTop: "1px solid #bdbdbd",
                            }}
                          >
                            <p className="paking3a_col5_sub_div_finalValus"></p>
                            <p className="paking3a_col5_sub_div_finalValus"></p>
                            <p className="paking3a_col5_sub_div_finalValus">
                              <b>
                                {data?.totals?.colorstone?.Pcs +
                                  data?.totals?.misc?.Pcs}
                              </b>
                            </p>
                            <p className="paking3a_col5_sub_div_finalValus">
                              <b>
                                {" "}
                                {data?.totals?.colorstone?.Wt +
                                  data?.totals?.misc?.Wt}
                              </b>
                            </p>
                            <p className="paking3a_col5_sub_div_finalValus"></p>
                            <p className="paking3a_col5_sub_div_finalValus">
                              <b>
                                {(
                                  (data?.totals?.colorstone?.Amount +
                                    data?.totals?.misc?.Amount) /
                                  result?.header?.CurrencyExchRate
                                )?.toFixed(2)}
                              </b>
                            </p>
                          </div>
                        </div>
                        <div
                          className="paking3a_tabledata_col6"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div className="paking3a_col6_sub_div">
                            <p className="paking3a_col6_sub_div_finalValus">
                              Labour
                            </p>
                            <p className="paking3a_col6_sub_div_finalValus">
                              {data?.MaKingCharge_Unit}
                            </p>
                            <p className="paking3a_col6_sub_div_finalValus">
                              {data?.MakingAmount}
                            </p>
                          </div>
                          <div
                            className="paking3a_col6_sub_div"
                            style={{
                              backgroundColor: "#f5f5f5",
                              borderTop: "1px solid #bdbdbd",
                            }}
                          >
                            <p className="paking3a_col6_totalData"></p>
                            <p className="paking3a_col6_totalData"></p>
                            <p className="paking3a_col6_totalData">
                              {formatAmount(data?.MakingAmount)}
                            </p>
                          </div>
                        </div>
                        <div
                          className="paking3a_tabledata_col7"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <p className="paking3a_second_box_Title paking3a_end">
                            {formatAmount(data?.TotalAmount)}
                          </p>

                          <p
                            className="paking3a_second_box_Title paking3a_end"
                            style={{
                              backgroundColor: "#f5f5f5",
                              width: "100%",
                              borderTop: "1px solid #bdbdbd",
                            }}
                          >
                            {formatAmount(data?.TotalAmount)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div
                    className="paking3a_table_Data_box"
                    style={{ backgroundColor: "#f5f5f5" }}
                  >
                    <div className="paking3a_tabledata_col1"></div>
                    <div className="paking3a_tabledata_col2">
                      <b>Total</b>
                    </div>
                    <div className="paking3a_tabledata_col3">
                      <div className="paking3a_col3_sub_div">
                        <p className="paking3a_col3_sub_div_more_sub1"></p>
                        <p className="paking3a_col3_sub_div_more_sub2"></p>
                        <p className="paking3a_col3_sub_div_more_sub3">
                          <b>{result?.mainTotal?.diamonds?.Pcs}</b>
                        </p>
                        <p
                          className="paking3a_col3_sub_div_more_sub4"
                          style={{ width: "20%" }}
                        >
                          {" "}
                          <b> {result?.mainTotal?.diamonds?.Wt?.toFixed(3)}</b>
                        </p>
                        <p className="paking3a_col3_sub_div_more_sub5"></p>
                        <p className="paking3a_col3_sub_div_more_sub6">
                          <b>
                            {" "}
                            {(
                              result?.mainTotal?.diamonds?.Amount /
                              result?.header?.CurrencyExchRate
                            )?.toFixed(2)}
                          </b>
                        </p>
                      </div>
                    </div>
                    <div className="paking3a_tabledata_col4">
                      <div className="paking3a_col4_sub_div">
                        <p className="paking3a_col4_sub_div_finalValus"></p>
                        <p className="paking3a_col4_sub_div_finalValus">
                          <b>{result?.mainTotal?.grosswt}</b>
                        </p>
                        <p className="paking3a_col4_sub_div_finalValus">
                          <b>
                            {(
                              result?.mainTotal?.NetWt +
                              result?.mainTotal?.LossWt
                            )?.toFixed(3)}
                          </b>
                        </p>
                        <p
                          className="paking3a_col4_sub_div_finalValus"
                          style={{ width: "40%" }}
                        >
                          <b>
                            {" "}
                            {(
                              result?.mainTotal?.metal?.Amount /
                              result?.header?.CurrencyExchRate
                            )?.toFixed(2)}
                          </b>
                        </p>
                      </div>
                    </div>
                    <div className="paking3a_tabledata_col5">
                      <div className="paking3a_col5_sub_div">
                        <p className="paking3a_col3_sub_div_more_sub1"></p>
                        <p className="paking3a_col3_sub_div_more_sub2"></p>
                        <p className="paking3a_col3_sub_div_more_sub3">
                          <b>{result?.mainTotal?.colorstone?.Pcs}</b>
                        </p>
                        <p
                          className="paking3a_col3_sub_div_more_sub4"
                          style={{ width: "20%" }}
                        >
                          <b>
                            {" "}
                            {result?.mainTotal?.colorstone?.Wt?.toFixed(3)}
                          </b>
                        </p>
                        <p className="paking3a_col3_sub_div_more_sub5"></p>
                        <p className="paking3a_col3_sub_div_more_sub6">
                          <b>
                            {" "}
                            {(
                              result?.mainTotal?.colorstone?.Amount /
                              result?.header?.CurrencyExchRate
                            )?.toFixed(3)}
                          </b>
                        </p>
                      </div>
                    </div>
                    <div className="paking3a_col6">
                      <div className="paking3a_col6_sub_div">
                        {/* <p className="paking3a_col6_sub_div_p"></p>
                              <p className="paking3a_col6_sub_div_p"></p> */}
                        <p
                          className="paking3a_col6_sub_div_p_last"
                          style={{ width: "100%" }}
                        >
                          {formatAmount(
                            result?.mainTotal?.MakingAmount /
                              result?.header?.CurrencyExchRate
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="paking3a_col7">
                      <p className="paking3a_second_box_Title paking3a_end">
                        {formatAmount(
                          result?.mainTotal?.TotalAmount /
                            result?.header?.CurrencyExchRate
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "4px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                  className="paking3a_total_avoid"
                >
                  <div>
                    <div className="paking3a_total_div">
                      <p>Total Amount</p>
                      {formatAmount(result?.mainTotal?.TotalAmount)}
                    </div>
                    {result?.allTaxes?.map((data, index) => {
                      return (
                        <div className="paking3a_total_div" key={index}>
                          <p>
                            {data?.name} @ {data?.per}
                          </p>
                          {data?.amountInNumber}
                        </div>
                      );
                    })}
                    <div className="paking3a_total_div">
                      <p>{result?.header?.AddLess >= 0 ? "Add" : "Less"}</p>
                      {formatAmount(result?.header?.AddLess)}
                    </div>
                    <div className="paking3a_total_div">
                      <p>BY INTERNATIONAL</p>
                      {result?.header?.FreightCharges?.toFixed(2)}
                    </div>
                    <div className="paking3a_total_div">
                      <p>Final Amount</p>
                      {formatAmount(
                        (result?.mainTotal?.TotalAmount +
                          result?.header?.AddLess +
                          result?.header?.FreightCharges +
                          result?.allTaxesTotal) /
                          result?.header?.CurrencyExchRate
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="paking3a__bottomSection_main">
                <div className="paking3a__bottomSection_Box1">
                  <div className="paking3a__bottomSection_Box1_subBox1">
                    <div>
                      <p
                        style={{
                          backgroundColor: "#f1f1f1",
                          borderBottom: "1px solid #bdbdbd",
                        }}
                      >
                        <b>SUMMARY</b>
                      </p>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          width: "50%",
                          borderRight: "1px solid #bdbdbd",
                          padding: "3px",
                        }}
                      >
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>GOLD IN 24KT </b>
                          </p>
                          <p>{result?.mainTotal?.PureNetWt} gm</p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>SILVER</b>
                          </p>
                          <p>{result?.mainTotal?.PureNetWt} gm</p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>GROSS WT</b>
                          </p>
                          <p>{result?.mainTotal?.grosswt?.toFixed(3)} gm</p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>NET WT</b>
                          </p>
                          <p>
                            {(
                              result?.mainTotal?.NetWt +
                              result?.mainTotal?.LossWt
                            )?.toFixed(3)}{" "}
                            gm
                          </p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>LOSSS WT</b>
                          </p>
                          <p>{result?.mainTotal?.LossWt?.toFixed(3)} gm</p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>DIAMOND WT</b>
                          </p>
                          <p>
                            {result?.mainTotal?.diamonds?.Pcs} /{" "}
                            {result?.mainTotal?.diamonds?.Wt?.toFixed(3)} cts
                          </p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>STONE WT</b>
                          </p>
                          <p>
                            {result?.mainTotal?.colorstone?.Pcs} /{" "}
                            {result?.mainTotal?.colorstone?.Wt?.toFixed(3)} gm
                          </p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>MISC WT</b>
                          </p>
                          <p>
                            {result?.mainTotal?.misc?.IsHSCODE_0_pcs} /{" "}
                            {result?.mainTotal?.misc?.Wt?.toFixed(3)} gm
                          </p>
                        </div>
                      </div>

                      <div
                        style={{
                          width: "50%",
                          padding: "3px",
                        }}
                      >
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>GOLD </b>
                          </p>
                          <p>{total[0]?.amount?.toFixed(2)}</p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>SILVER</b>
                          </p>
                          <p>{total[1]?.amount?.toFixed(2)}</p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>DIAMOND</b>
                          </p>
                          <p>
                            {" "}
                            {formatAmount(
                              result?.mainTotal?.diamonds?.Amount /
                                result?.header?.CurrencyExchRate
                            )}
                          </p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>CST</b>
                          </p>
                          <p>
                            {formatAmount(
                              result?.mainTotal?.colorstone?.Amount /
                                result?.header?.CurrencyExchRate
                            )}
                          </p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>MISC</b>
                          </p>
                          <p>
                            {formatAmount(
                              result?.mainTotal?.misc?.IsHSCODE_0_amount /
                                result?.header?.CurrencyExchRate
                            )}
                          </p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>MAKING</b>
                          </p>
                          <p>
                            {formatAmount(
                              (result?.mainTotal?.MakingAmount +
                                result?.mainTotal?.diamonds?.SettingAmount +
                                result?.mainTotal?.colorstone?.SettingAmount) /
                                result?.header?.CurrencyExchRate
                            )}
                          </p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>OTHER</b>
                          </p>
                          <p>
                            {formatAmount(
                              result?.mainTotal?.misc?.IsHSCODE_3_amount
                            )}
                          </p>
                          {/* <p>{formatAmount(result?.mainTotal?.OtherCharges)}</p> */}
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>
                              {result?.header?.AddLess >= 0 ? "ADD" : "LESS"}
                            </b>
                          </p>
                          <p>{formatAmount(result?.header?.AddLess)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="paking3a__bottomSection_Box1_subBox2">
                    <div>
                      <p
                        style={{
                          backgroundColor: "#f1f1f1",
                          borderBottom: "1px solid #bdbdbd",
                        }}
                      >
                        <b> Diamond Detail</b>
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "2px",
                        }}
                      >
                        <p>OTHERS</p>
                        <p>
                          {result?.mainTotal?.diamonds?.Pcs} /{" "}
                          {result?.mainTotal?.diamonds?.Wt} cts
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="paking3a__bottomSection_Box2">
                  <div className="paking3a__bottomSection_Box2_subBox1">
                    <p
                      style={{
                        backgroundColor: "#f1f1f1",
                        borderBottom: "1px solid #bdbdbd",
                      }}
                    >
                      <b>OTHER DETAILS</b>
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "2px",
                      }}
                    >
                      <p>RATE IN 24KT</p>
                      <p>7800.00</p>
                    </div>
                  </div>
                  <div className="paking3a__bottomSection_Box2_subBox2">
                    <p
                      style={{
                        backgroundColor: "#f1f1f1",
                        borderBottom: "1px solid #bdbdbd",
                      }}
                    >
                      <b>Remark</b>
                    </p>
                    <div
                      style={{
                        display: "flex",
                        padding: "2px",
                      }}
                    >
                      <p>{result?.header?.Remark}</p>
                    </div>
                  </div>
                  <div className="paking3a__bottomSection_Box2_subBox3">
                    <div className="paking3a__bottomSection_Box2_subBox3_1">
                      <p style={{ display: "flex", margin: "0px" }}>
                        Created By
                      </p>
                    </div>
                    <div className="paking3a__bottomSection_Box2_subBox3_2">
                      <p style={{ display: "flex", margin: "0px" }}>
                        Created By
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
              {" "}
              {msg}{" "}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default PackingList3A;
