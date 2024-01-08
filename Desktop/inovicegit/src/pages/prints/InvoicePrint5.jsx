import React, { useEffect, useState } from "react";
import {
  FooterComponent,
  HeaderComponent,
  apiCall,
  formatAmount,
  handlePrint,
  isObjectEmpty,
  numberToWord,
} from "../../GlobalFunctions";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import Loader from "../../components/Loader";
import "../../assets/css/prints/invoiceprint5.css";

const InvoicePrint5 = ({ token, invoiceNo, printName, urls, evn }) => {
  const [classip, setClassip] = useState({
    col1: "",
    col2: "",
    col3: "",
    col4: "",
    col5: "",
    col6: "",
    col7: "",
    col8: "",
    col9: "",
    col10: "",
    col11: "",
  });
  const [result, setResult] = useState(null);
  const [metaltypewise, setMetaltypewise] = useState([]);

  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [footerComp, setFooterComp] = useState(null);
  useEffect(() => {
    let print_name = atob(printName);
    if (print_name === "invoice print 5") {
      setClassip({
        col1: "col1ip5",
        col2: "col2ip5",
        col3: "col3ip5",
        col4: "col4ip5",
        col5: "col5ip5",
        col6: "col5ip5",
        col7: "col5ip5",
        col8: "col5ip5",
        col9: "col6ip5",
        col10: "col7ip5",
        col11: "col8ip5",
      });
    }
    if (print_name === "invoice print 7") {
      setClassip({
        col1: "col1ip7",
        col2: "col2ip7",
        col3: "col3ip7",
        col4: "col4ip7",
        col5: "col5ip7",
        col6: "col5ip7",
        col7: "col5ip7",
        col8: "col5ip7",
        col9: "col6ip7",
        col10: "col7ip7",
        col11: "col8ip7",
      });
    }
  }, [printName]);
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
  function loadData(data) {
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;
    const datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );
    const headerComp = HeaderComponent(
      data?.BillPrint_Json[0]?.HeaderNo,
      data?.BillPrint_Json[0]
    );
    const footerCom = FooterComponent("2", data?.BillPrint_Json[0]);

    let metwise = [];
    datas?.resultArray?.forEach((e) => {
      //   let diamond_metwise = [];
      //   let colorstone_metwise = [];
      let findIndex = metwise?.findIndex(
        (el) => el?.MetalPurity === e?.MetalPurity
      );
      if (findIndex === -1) {
        metwise.push(e);
      } else {
        metwise[findIndex].grosswt += e?.grosswt;
        metwise[findIndex].NetWt += e?.NetWt;
        metwise[findIndex].TotalAmount += e?.TotalAmount;
        metwise[findIndex].MakingAmount += e?.MakingAmount;
        metwise[findIndex].Quantity += e?.Quantity;
        metwise[findIndex].OtherCharges += e?.OtherCharges;
        metwise[findIndex].diamondWtMetalPurityWise +=
          e?.diamondWtMetalPurityWise;
        metwise[findIndex].colorstoneWtMetalPurityWise +=
          e?.colorstoneWtMetalPurityWise;
          metwise[findIndex].totals.diamonds.Wt += e?.totals?.diamonds?.Wt;
          metwise[findIndex].totals.colorstone.Wt += e?.totals?.colorstone?.Wt;
      }
    });
    console.log(datas);
    setMetaltypewise(metwise);
    // console.log(metwise);
    setFooterComp(footerCom);
    setResult(datas);
    
    // datas?.resultArray?.forEach((e) => {
    //   let diaArr = [];
    //   let colorArr = [];

    //   datas?.json2?.forEach((el) => {
    //     if(e?.Srjobno === el?.Stockbarcode){
    //       console.log(e, el);
    //       if( el?.MasterManagement_DiamondStoneTypeid === 1){
    //         let findRecord = diaArr?.findIndex((a) => a?.QualityName === el?.QualityName)
    //         if(findRecord === -1){
    //           diaArr.push(el);
    //         }else{
    //           diaArr[findRecord].Wt += el?.Wt;
    //           diaArr[findRecord].Rate += el?.Rate;
    //           diaArr[findRecord].Wt += el?.amount;
    //         }
    //       }
    //       if( el?.MasterManagement_DiamondStoneTypeid === 2){
    //         let findRecord = colorArr?.findIndex((a) => a?.QualityName === el?.QualityName)
    //         if(findRecord === -1){
    //           colorArr.push(el);
    //         }else{
    //           diaArr[findRecord].Wt += el?.Wt;
    //           diaArr[findRecord].Rate += el?.Rate;
    //           diaArr[findRecord].Wt += el?.amount;
    //         }
    //       }
          
    //     }
    //     let obj = {...e};
    //     obj.diamondMetalJobWise = diaArr;
    //     obj.colorstoneMetalJobWise = colorArr;
    //   })
      
    // })
    console.log(datas);
  }
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="containerIp5">
                {/* print button */}
                <div className="d-flex justify-content-end mb-3 mx-2 hidebtnip5">
                  <button
                    className="btn_white blue m-0 p-1"
                    onClick={(e) => handlePrint(e)}
                  >
                    Print
                  </button>
                </div>

                {/* header */}
                {/* <div>{headerCom}</div> */}
                <div>
                  <div className="hliv5">{result?.header?.PrintHeadLabel}</div>
                  <div className="fsgip5 d-flex justify-content-between p-2">
                    <div className="w-75">
                      <div className="fw-bold lhiv5">{result?.header?.CompanyFullName}</div>
                      <div className="lhiv5">{result?.header?.CompanyAddress}</div>
                      <div className="lhiv5">{result?.header?.CompanyAddress2}</div>
                      <div className="lhiv5">{result?.header?.CompanyCity}-{result?.header?.CompanyPinCode},{result?.header?.CompanyState}({result?.header?.CompanyCountry})</div>
                      <div className="lhiv5">T {result?.header?.CompanyTellNo} | TOLL FREE {result?.header?.CompanyTollFreeNo} </div>
                      <div className="lhiv5">{result?.header?.CompanyEmail}</div>
                      <div className="lhiv5">{result?.header?.Company_VAT_GST_No} | {result?.header?.Company_CST_STATE}-{result?.header?.Company_CST_STATE_No} | PAN-{result?.header?.Pannumber}</div>
                      <div className="lhiv5">{result?.header?.Com_CINNO}</div>
                      <div className="lhiv5">{result?.header?.Com_GoldDealershipRefNo}</div>
                    </div>
                    <div className="w-25 d-flex justify-content-end align-items-center"><img src={result?.header?.PrintLogo} className="printlogoiv5" alt="#" /></div>
                  </div>
                  
                </div>
                {/* sub header */}
                <div className="d-flex justify-content-between border p-2 lhiv5">
                  <div className="fsgip5 subdiv1ip5">
                    <div>{result?.header?.lblBillTo}</div>
                    <div className="fw-bold">
                      {result?.header?.customerfirmname}
                    </div>
                    <div> {result?.header?.customerAddress1}</div>
                    <div>{result?.header?.customerAddress2}</div>
                    <div>
                      {result?.header?.customercity1}
                      {result?.header?.customerpincode}
                    </div>
                    <div>{result?.header?.customeremail1}</div>
                    <div>{result?.header?.vat_cst_pan}</div>
                    <div>{result?.header?.Cust_CST_STATE_No_}</div>
                  </div>
                  <div className="fsgip5 subdiv2ip5">
                    <div className="d-flex justify-content-start">
                      <div className="w-25 fw-bold">BILL NO</div>
                      <div className="w-75">: {result?.header?.InvoiceNo}</div>
                    </div>
                    <div className="d-flex justify-content-start">
                      <div className="w-25 fw-bold">DATE</div>
                      <div className="w-75">: {result?.header?.EntryDate}</div>
                    </div>
                    <div className="d-flex justify-content-start">
                      <div className="w-25 fw-bold">
                        {result?.header?.HSN_No_Label}/SAC
                      </div>
                      <div className="w-75">: {result?.header?.HSN_No}</div>
                    </div>
                  </div>
                </div>
                {/* table */}
                <div>
                  {/* table head */}
                  <div className="theadip5 border mt-1 fw-bold border-bottom fsgip5 ">
                    <div
                      className={`${classip?.col1} h-100 border-end centerip5`}
                    >
                      Sr#
                    </div>
                    <div
                      className={`${classip?.col2} h-100 border-end centerip5`}
                    >
                      Product Description
                    </div>
                    <div
                      className={`${classip?.col3} h-100 border-end centerip5`}
                    >
                      KT
                    </div>
                    <div
                      className={`${classip?.col4} h-100 border-end centerip5`}
                    >
                      Qty
                    </div>
                    <div
                      className={`${classip?.col5} h-100 border-end centerip5`}
                    >
                      Gross Wt(ctw)
                    </div>
                    <div
                      className={`${classip?.col6} h-100 border-end centerip5`}
                    >
                      Dia Wt(ctw)
                    </div>
                    <div
                      className={`${classip?.col7} h-100 border-end centerip5`}
                    >
                      Stone Wt(ctw)
                    </div>
                    <div
                      className={`${classip?.col8} h-100 border-end centerip5`}
                    >
                      Net Wt(gm)
                    </div>
                    <div className={`${classip?.col9} border-end centerip5`}>
                      Other Charges
                    </div>
                    <div
                      className={`${classip?.col10} h-100 border-end centerip5`}
                    >
                      Amount
                    </div>
                    <div className={`${classip?.col11} h-100 centerip5`}>
                      Product Value
                    </div>
                  </div>
                  {/* table body */}
                  <div>
                    {metaltypewise?.map((e, i) => {
                      return (
                        <div
                          className="tbodyip5 border border-top-0 fsgip5 texpartivp5"
                          key={i}
                        >
                          <div
                            className={`${classip?.col1}  border-end centerip5`}
                          >
                            {e?.SrNo}
                          </div>
                          <div
                            className={`${classip?.col2}  border-end startip5 px-1`}
                          >
                            Diamond Studded Gold Jewellery
                          </div>
                          <div
                            className={`${classip?.col3}  border-end startip5 px-1`}
                          >
                            {e?.MetalPurity}
                          </div>
                          <div
                            className={`${classip?.col4}  border-end endip5 px-1`}
                          >
                            {e?.Quantity}
                          </div>
                          <div
                            className={`${classip?.col5}  border-end endip5 px-1`}
                          >
                            {e?.grosswt?.toFixed(3)}
                          </div>
                          <div
                            className={`${classip?.col6}  border-end endip5 px-1`}
                          >
                            {e?.totals?.diamonds?.Wt?.toFixed(3)}
                          </div>
                          <div
                            className={`${classip?.col7}  border-end endip5 px-1`}
                          >
                            {e?.totals?.colorstone?.Wt?.toFixed(3)}
                          </div>
                          <div
                            className={`${classip?.col8}  border-end endip5 px-1`}
                          >
                            {e?.NetWt?.toFixed(3)}
                          </div>
                          <div
                            className={`${classip?.col9}  border-end endip5 px-1`}
                          >
                            {formatAmount(e?.OtherCharges)}
                          </div>
                          <div
                            className={`${classip?.col10}  border-end endip5 px-1`}
                          >
                            {formatAmount(e?.MakingAmount)}
                          </div>
                          <div className={`${classip?.col11} endip5 px-1`}>
                            {formatAmount(e?.TotalAmount)}
                          </div>
                        </div>
                      );
                    })}
                    {/* table total */}
                    <div className="tbodyip5 border border-top-0 fw-bold fsgip5 texpartivp5">
                      <div
                        className={`${classip?.col1}  border-end centerip5`}
                      ></div>
                      <div
                        className={`${classip?.col2}  border-end  startip5 px-1 fsgip5`}
                      >
                        TOTAL
                      </div>
                      <div
                        className={`${classip?.col3}  border-end centerip5`}
                      ></div>
                      <div
                        className={`${classip?.col4}  border-end endip5 px-1`}
                      >
                        {result?.mainTotal?.total_Quantity}
                      </div>
                      <div
                        className={`${classip?.col5}  border-end endip5 px-1`}
                      >
                        {result?.mainTotal?.grosswt?.toFixed(3)}
                      </div>
                      <div
                        className={`${classip?.col6}  border-end endip5 px-1`}
                      >
                        {result?.mainTotal?.diamonds?.Wt?.toFixed(3)}
                      </div>
                      <div
                        className={`${classip?.col7}  border-end endip5 px-1`}
                      >
                        {result?.mainTotal?.colorstone?.Wt?.toFixed(3)}
                      </div>
                      <div
                        className={`${classip?.col8}  border-end endip5 px-1`}
                      >
                        {result?.mainTotal?.netwt?.toFixed(3)}
                      </div>
                      <div
                        className={`${classip?.col9}  border-end endip5 px-1`}
                      >
                        {formatAmount(result?.mainTotal?.total_other)}
                      </div>
                      <div
                        className={`${classip?.col10}  border-end endip5 px-1`}
                      >
                        {formatAmount(
                          result?.mainTotal?.total_labour?.labour_amount
                        )}
                      </div>
                      <div className={`${classip?.col11}  endip5 px-1`}>
                        {formatAmount(result?.mainTotal?.total_unitcost)}
                      </div>
                    </div>
                  </div>
                </div>
                {/* tax part */}
                <div className="d-flex border border-top-0 fsgip5 texpartivp5">
                  <div className="wordsip5 d-flex flex-column justify-content-end align-items-start pb-1 ps-1 border-end">
                    <div>Value in Words:</div>
                    <div className="fw-bold">
                      {numberToWord(result?.finalAmount)} only
                    </div>
                  </div>
                  <div className="taxip5">
                    <div className="d-flex fw-bold">
                      <div className="w-50 px-1 border-end endip5">
                        Total Amount
                      </div>
                      <div className="w-50 px-1 endip5">
                        {formatAmount(result?.mainTotal?.total_unitcost)}
                      </div>
                    </div>
                    {result?.allTaxes?.map((e, i) => {
                      return (
                        <div className="d-flex" key={i}>
                          <div className="w-50 px-1 border-end endip5">
                            {e?.name} @ {e?.per}
                          </div>
                          <div className="w-50 px-1 endip5">{e?.amount}</div>
                        </div>
                      );
                    })}

                    <div className="d-flex">
                      <div className="w-50 px-1 border-end endip5">
                        {result?.header?.AddLess > 0 ? "ADD" : "LESS"}
                      </div>
                      <div className="w-50 px-1 endip5">
                        {result?.header?.AddLess}
                      </div>
                    </div>
                    <div
                      className="d-flex w-100 border-top"
                      style={{ height: "60px" }}
                    >
                      <div className="fw-bold px-1 w-50 border-end centerip5">
                        Total Amount To be Paid:
                      </div>
                      <div className="fw-bold d-flex px-1 w-50 endip5">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: result?.header?.Currencysymbol,
                          }}
                        ></div>
                        <div className="px-1">
                          {formatAmount(result?.finalAmount)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* remarks and description */}
                <div className="mt-1 border p-1 fsgip5">
                  <div className="text-decoration-underline fw-bold">
                    Remarks:
                  </div>
                  <div>{result?.header?.PrintRemark}</div>
                </div>
                <div className="border mt-1 fsgip5">
                  <div className="text-decoration-underline fw-bold">
                    Notes:
                  </div>
                  <div
                    className="p-1 fsgip5"
                    dangerouslySetInnerHTML={{
                      __html: result?.header?.Declaration,
                    }}
                  ></div>
                </div>
                {/* bank details footer */}
                {/* <div className="mt-1 fsgip5">{footerComp}</div> */}
                <div className="mt-1 fsgip5 d-flex border">
                    <div className="border-end fwi5 p-1">
                      <div>Bank Details :</div>
                      <div>Bank Name:Kotak Mahindra Bank</div>
                      <div>Branch: SHOP NO-1 WTC , UDHNA DARWAJA SURAT-395004</div>
                      <div>Account Name:Orail</div>
                      <div>Account No. :147275899632</div>
                      <div>RTGS/NEFT IFSC:Kotak00000405</div>
                    </div>
                    <div className="border-end fwi51 p-1 d-flex flex-column justify-content-between">
                      <div>Signature</div>
                      <div className="fw-bold">Dar Be Gold Jewelers</div>
                    </div>
                    <div className="p-1 fwi51 d-flex flex-column justify-content-between">
                      <div>Signature</div>
                      <div className="fw-bold">ORAIL SERVICE</div>
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

export default InvoicePrint5;
