import React, { useEffect, useState } from "react";
import {
  FooterComponent,
  HeaderComponent,
  NumberWithCommas,
  SubheaderComponent,
  apiCall,
  isObjectEmpty,
  numberToWord,
} from "../../GlobalFunctions";
import { OrganizeDataPrint } from "./../../GlobalFunctions/OrganizeDataPrint";
import Loader from "../../components/Loader";
import "../../assets/css/prints/detailprint7.css";
import imgs from "../../default.jpg";

const DetailPrint7 = ({ token, invoiceNo, printName, urls, evn }) => {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [headerComp, setHeaderComp] = useState(null);
  const [subHeaderComp, setSubHeaderComp] = useState(null);
  const [footerComp, setFooterComp] = useState(null);
  async function loadData(data) {
    try {
      let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
      data.BillPrint_Json[0].address = address;
      const datas = OrganizeDataPrint(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );
      console.log(datas);
      setResult(datas);
      const headerCompo = HeaderComponent(
        data?.BillPrint_Json[0]?.headNo,
        data?.BillPrint_Json[0]
      );
      setHeaderComp(headerCompo);
      const subheaderCompo = SubheaderComponent(
        data?.BillPrint_Json[0]?.headNo,
        data?.BillPrint_Json[0]
      );
      setSubHeaderComp(subheaderCompo);
      const footer_comp = FooterComponent("2", data?.BillPrint_Json[0]);
      setFooterComp(footer_comp);
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn);
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
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="container pb-5 mb-5">
                {/* table header */}
                <div className="w-100">{headerComp}</div>

                {/* table sub header */}
                <div className="d-flex subhead">
                  <div className="subheaddiv1">
                    <div className="fsgdp7 lhdp7">
                      {result?.header?.lblBillTo}
                    </div>
                    <div className="fsgdp7 lhdp7">
                      <b>{result?.header?.customerfirmname}</b>
                    </div>
                    <div className="fsgdp7 lhdp7">
                      {result?.header?.customerAddress1}
                    </div>
                    <div className="fsgdp7 lhdp7">
                      {result?.header?.customerAddress2}
                    </div>
                    <div className="fsgdp7 lhdp7">
                      {result?.header?.customercity1}{" "}
                      {result?.header?.customerpincode}
                    </div>
                    <div className="fsgdp7 lhdp7">
                      {result?.header?.customeremail1}
                    </div>
                    <div className="fsgdp7 lhdp7">
                      {result?.header?.vat_cst_pan}
                    </div>
                    <div className="fsgdp7 lhdp7">
                      {result?.header?.Cust_CST_STATE}{" "}
                      {result?.header?.Cust_CST_STATE_No}
                    </div>
                  </div>
                  <div className="subheaddiv2">
                    <div className="fsgdp7 lhdp7">Ship To,</div>
                    <div className="fsgdp7 lhdp7">
                      <b>{result?.header?.customerfirmname}</b>
                    </div>
                    {result?.header?.address?.map((e, i) => {
                      return (
                        <div className="fsgdp7 lhdp7" key={i}>
                          {e}
                        </div>
                      );
                    })}
                  </div>
                  <div className="subheaddiv3">
                    <div className="fsgdp7 lhdp7 d-flex justify-content-between">
                      <span className="w-50 fw-bold">INVOICE NO</span>
                      <span className="w-50 d-flex justify-content-start">
                        {result?.header?.InvoiceNo}
                      </span>
                    </div>
                    <div className="fsgdp7 lhdp7 d-flex justify-content-between">
                      <span className="w-50 fw-bold">DATE</span>
                      <span className="w-50 d-flex justify-content-start">
                        {result?.header?.EntryDate}
                      </span>
                    </div>
                    <div className="fsgdp7 lhdp7 d-flex justify-content-between">
                      <span className="w-50 fw-bold">HSN</span>
                      <span className="w-50 d-flex justify-content-start">
                        {result?.header?.HSN_No}
                      </span>
                    </div>
                    <div className="fsgdp7 lhdp7 d-flex justify-content-between">
                      <span className="w-50 fw-bold">Delivery Mode</span>
                      <span className="w-50 d-flex justify-content-start"></span>
                    </div>
                    <div className="fsgdp7 lhdp7 d-flex justify-content-between">
                      <span className="w-50 fw-bold">Sales Person</span>
                      <span className="w-50 d-flex justify-content-start">
                        shekhar
                      </span>
                    </div>
                  </div>
                </div>

                {/* table head */}
                <div className="tabledp7">
                  <div className="theaddp7">
                    <div className="col1dp7 dp7cen">SR#</div>
                    <div className="col2dp7 dp7cen">DESIGN DESCRIPTION</div>
                    <div className="col3dp7 dp7cen">KT/COL</div>
                    <div className="col4dp7 dp7cen">GROSS</div>
                    <div className="col5dp7 dp7cen">NET</div>
                    <div className="col6dp7 dp7cen">WASTAGE</div>
                    <div className="col7dp7 d-flex flex-column h-100">
                      <div className="dp7cen brbdp7 h-50">
                        STONE DESCRIPTION
                      </div>
                      <div className="d-flex subcoldp7 h-50">
                        <div className="dp7cen w_subcoldp7 brdp7">MIS TYPE</div>
                        <div className="dp7cen w_subcoldp7 brdp7">PCS</div>
                        <div className="dp7cen w_subcoldp7 brdp7">WT</div>
                        <div className="dp7cen w_subcoldp7 brdp7">RATE</div>
                        <div className="dp7cen w_subcoldp7 brdp7">AMOUNT</div>
                      </div>
                    </div>
                    <div className="col8dp7 dp7cen d-flex flex-column">
                      <span>OTHER</span>
                      <span>CHARGES</span>
                    </div>
                    <div className="col9dp7 dp7cen border-end-0">FINE</div>
                  </div>
                  <div className="tbodydp7">
                    <div className="d-flex">
                      <div className="rcol1dp7 dp7cen1">1</div>
                      <div className="rcol2dp7 d-flex flex-column align-items-start p-1">
                        <div className="d-flex justify-content-between align-items-start w-100">
                          <div>1715</div>
                          <div>1/15339</div>
                        </div>
                        <div className="w-100 d-flex justify-content-center align-items-start">
                          <img src={imgs} alt="design" className="rowimgdp7" />
                        </div>
                        <div className="w-100 d-flex justify-content-center align-items-start">
                          HUID-AFSFA001
                        </div>
                      </div>
                      <div className="rcol3dp7 dp7cen1">18K/Yellow</div>
                      <div className="rcol4dp7 dp7cen2">10.000</div>
                      <div className="rcol5dp7 dp7cen2">10.084</div>
                      <div className="rcol6dp7 dp7cen2">0.000</div>
                      <div className="rcol7dp7 dp7cen1">Round</div>
                      <div className="rcol8dp7 dp7cen2">5</div>
                      <div className="rcol9dp7 dp7cen2">0.080</div>
                      <div className="rcol10dp7 dp7cen2">10000.00</div>
                      <div className="rcol11dp7 dp7cen2">800.00</div>
                      <div className="rcol12dp7 dp7cen2">50.00</div>
                      <div className="rcol13dp7 dp7cen2 border-end-0">
                        7.588
                      </div>
                    </div>
                  </div>
                </div>

                {/* table all row total */}
                <div className="totaldp7 w-100 brtdp7">
                  <div className="totcol1dp7"></div>
                  <div className="totcol2dp7 dp7cen2">{result?.mainTotal?.grosswt}</div>
                  <div className="totcol3dp7 dp7cen2">{result?.mainTotal?.misc?.Wt}</div>
                  <div className="totcol4dp7"></div>
                  <div className="totcol5dp7 dp7cen2">51,120.00</div>
                  <div className="totcol6dp7 dp7cen2">{result?.mainTotal?.total_other?.toFixed(2)}</div>
                  <div className="totcol7dp7 dp7cen2">32.198</div>
                </div>

                {/* table total */}
                <div className="w-100 brtdp7 dp7cen2 bradp7">85,503.37</div>

                {/* taxes */}
                {result?.allTaxes?.map((e, i) => {
                  return (
                    
                      <div className="w-100 bradp7 border-bottom-0 border-top-0 taxdp7" key={i}>
                        <div className="taxdp7d1">
                          {e?.amountInWords}
                        </div>
                        <div className="taxdp7d2 dp7cen2">{e?.name} @ {e?.per}</div>
                        <div className="taxdp7d3 dp7cen2">{e?.amount}</div>
                      </div>
                    
                  );
                })}

                {/* <div className="w-100 bradp7 border-bottom-0 border-top-0 taxdp7">
                  <div className="taxdp7d1">
                    TOTAL SGST IN WORDS : One Hundred and Eleven Point Fifteen
                  </div>
                  <div className="taxdp7d2 dp7cen2">CGST @ 0.13%</div>
                  <div className="taxdp7d3 dp7cen2">111.15</div>
                </div> */}
                <div className="w-100 bradp7 border-top-0 taxdp7">
                  <div className="taxdp7d4"></div>
                  <div className="taxdp7d2 dp7cen2 bldp7">
                    Sales Rounded Off
                  </div>
                  <div className="taxdp7d3 dp7cen2">-0.15</div>
                </div>

                {/* grand total */}
                <div className="w-100 bradp7 border-top-0 taxdp7 finalAmt_h">
                  <div className="taxdp7d1 fw-bold ps-1 h-100 dp7cen1">
                    Total
                  </div>
                  <div className="taxdp7d2 dp7cen2 bldp7 h-100"></div>
                  <div className="taxdp7d3 dp7cen2 fw-bold pe-2 h-100 border-end-0">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: result?.header?.Currencysymbol,
                      }}
                    ></div>
                    <div className="ps-1">
                      {" "}
                      {NumberWithCommas(result?.finalAmount)}
                    </div>
                  </div>
                </div>
                <div className="w-100 d-flex brbdp7 brdp7 bldp7">
                  <div className="brdp7 fw-bold ps-1" style={{ width: "3%" }} dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}}>
                  </div>
                  <div className="ps-2 fw-bold" style={{ width: "97%" }}>
                    {numberToWord(result?.finalAmount)} Only
                  </div>
                </div>

                {/* summary */}
                <div className="summary_container_dp7">
                  <div className="summary_container_dp7_product_table">
                    <div className="summary_container_dp7_product_title">
                      PRODUCT SUMMARY
                    </div>
                    <div className="summary_container_dp7_product_head">
                      <div className="sum_prod_head_col_1 dp7cen">CATEGORY</div>
                      <div className="sum_prod_head_col_2 dp7cen">PIECES</div>
                      <div className="sum_prod_head_col_3 dp7cen">GORSS WT</div>
                      <div className="sum_prod_head_col_4 dp7cen">NET WT</div>
                      <div className="sum_prod_head_col_5 dp7cen">WASTAGE</div>
                      <div className="sum_prod_head_col_6 dp7cen">FINE</div>
                    </div>
                    <div className="summary_container_dp7_product_body">
                      <div className="sum_prod_head_col_1 dp7cen1">Earring</div>
                      <div className="sum_prod_head_col_2 dp7cen2">1</div>
                      <div className="sum_prod_head_col_3 dp7cen2">4.000</div>
                      <div className="sum_prod_head_col_4 dp7cen2">4.010</div>
                      <div className="sum_prod_head_col_5 dp7cen2">0.000</div>
                      <div className="sum_prod_head_col_6 dp7cen2">3.017</div>
                    </div>
                    <div className="summary_container_dp7_product_total fw-bold">
                      <div className="sum_prod_head_col_1 dp7cen1">Total</div>
                      <div className="sum_prod_head_col_2 dp7cen2">7</div>
                      <div className="sum_prod_head_col_3 dp7cen2">47.760</div>
                      <div className="sum_prod_head_col_4 dp7cen2">41.731 </div>
                      <div className="sum_prod_head_col_5 dp7cen2"></div>
                      <div className="sum_prod_head_col_6 dp7cen2">32.198</div>
                    </div>
                  </div>
                  <div style={{ height: "16px" }}></div>
                  <div className="summary_container_dp7_misc_table">
                    <div className="summary_container_dp7_misc_title">
                      MISC SUMMARY
                    </div>

                    <div className="summary_container_dp7_misc_head w-100 fw-bold">
                      <div className="summary_container_dp7_misc_head_col_1 dp7cen">
                        TYPE
                      </div>
                      <div className="summary_container_dp7_misc_head_col_2 dp7cen">
                        PIECES
                      </div>
                      <div className="summary_container_dp7_misc_head_col_3 dp7cen">
                        RATE
                      </div>
                      <div className="summary_container_dp7_misc_head_col_4 dp7cen">
                        WT
                      </div>
                      <div className="summary_container_dp7_misc_head_col_5 dp7cen border-end-0">
                        AMOUNT
                      </div>
                    </div>

                    <div className="summary_container_dp7_misc_body">
                      <div className="summary_container_dp7_misc_head_col_1 dp7cen1">
                        ASR
                      </div>
                      <div className="summary_container_dp7_misc_head_col_2 dp7cen2">
                        7
                      </div>
                      <div className="summary_container_dp7_misc_head_col_3 dp7cen2">
                        2000.00
                      </div>
                      <div className="summary_container_dp7_misc_head_col_4 dp7cen2">
                        0.530 Ctw
                      </div>
                      <div className="summary_container_dp7_misc_head_col_5 dp7cen2 border-end-0">
                        1060.00
                      </div>
                    </div>

                    <div className="summary_container_dp7_misc_total">
                      <div className="summary_container_dp7_misc_head_col_1 dp7cen1">
                        Total
                      </div>
                      <div className="summary_container_dp7_misc_head_col_2 dp7cen2">
                        45
                      </div>
                      <div className="summary_container_dp7_misc_head_col_3 dp7cen1"></div>
                      <div className="summary_container_dp7_misc_head_col_4 dp7cen2 d-flex flex-column">
                        <div className="w-100 dp7cen2">5.560 Ctw</div>
                        <div className="w-100 dp7cen2"> 26.800 Gm</div>
                      </div>
                      <div className="summary_container_dp7_misc_head_col_5 dp7cen2 border-end-0">
                        4170.00
                      </div>
                    </div>
                  </div>
                </div>

                {/* footer */}
                <div
                  className="mt-1 bradp7 p-1"
                  dangerouslySetInnerHTML={{
                    __html: result?.header?.Declaration,
                  }}
                >
                  {}
                </div>
                <div className="border-top-0 bradp7 border-bottom-0">
                  REMARKS : {result?.header?.PrintRemark}
                </div>
                <div className="d-flex footer_bank">
                    <div className="subheaddiv_1">
                        <div className="fw-bold">Bank Detail</div>
                        <div>Bank Name: {result?.header?.bankname}</div>
                        <div>Branch: {result?.header?.bankaddress}</div>
                        <div>Account Name: {result?.header?.accountname}</div>
                        <div>Account No. : {result?.header?.accountnumber}</div>
                        <div>RTGS/NEFT IFSC: Kotak00000405</div>
                        <div>Enquiry No. (E & OE)</div>
                    </div>
                    <div className="subheaddiv_1 d-flex flex-column justify-content-between align-items-start">
                        <div>Signature</div><div className="fw-bold mb-2">{result?.header?.customerfirmname}</div>
                    </div>
                    <div className="subheaddiv_1 d-flex flex-column justify-content-between align-items-start">
                        <div>Signature</div><div className="fw-bold mb-2">{result?.header?.CompanyFullName}</div>
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

export default DetailPrint7;
