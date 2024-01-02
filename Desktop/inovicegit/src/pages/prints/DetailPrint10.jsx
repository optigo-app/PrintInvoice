import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  HeaderComponent,
  apiCall,
  formatAmount,
  handleImageError,
  handlePrint,
  isObjectEmpty,
} from "../../GlobalFunctions";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import "../../assets/css/prints/detailprint10.css";

const DetailPrint10 = ({ token, invoiceNo, printName, urls, evn }) => {
  const [result, setResult] = useState(null);
  const [headerCom, setHeaderCom] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [imgFlag, setImgFlag] = useState(true);

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
    console.log(datas);

    const headerComp = HeaderComponent(
      data?.BillPrint_Json[0]?.HeaderNo,
      data?.BillPrint_Json[0]
    );
    setHeaderCom(headerComp);

    setResult(datas);
  }
  const handleCheckbox = () => {
    if (imgFlag) {
      setImgFlag(false);
    } else {
      setImgFlag(true);
    }
  };
  return (
    <>
      <div className="containerdp10">
        <div className="d-flex justify-content-end align-items-center">
          <input
            type="checkbox"
            id="imghideshow"
            className="mx-1"
            checked={imgFlag}
            onChange={handleCheckbox}
          />
          <label htmlFor="imghideshow" className="me-3">
            Image Show
          </label>
          <button
            className="btn_white blue mb-0 hidedp10 m-0"
            onClick={(e) => handlePrint(e)}
          >
            Print
          </button>
        </div>
        {/* header */}
        <div className="w-100 mt-3">{headerCom}</div>
        {/* subheader */}
        <div className="subheaderdp10">
          <div className="subdiv1dp10 border-end fsgdp10 ">
            <div className="px-1">{result?.header?.lblBillTo}</div>
            <div className="px-1 fw-bold">
              {result?.header?.customerfirmname}
            </div>
            <div className="px-1">{result?.header?.customerAddress2}</div>
            <div className="px-1">{result?.header?.customerAddress1}</div>
            <div className="px-1">{result?.header?.customerAddress3}</div>
            <div className="px-1">
              {result?.header?.customercity1}-{result?.header?.PinCode}
            </div>
            <div className="px-1">{result?.header?.customeremail1}</div>
            <div className="px-1">{result?.header?.vat_cst_pan}</div>
            <div className="px-1">
              {result?.header?.Cust_CST_STATE}-
              {result?.header?.Cust_CST_STATE_No}
            </div>
          </div>
          <div className="subdiv2dp10 border-end fsgdp10">
            <div className="px-1">Ship To,</div>
            <div className="px-1 fw-bold">
              {result?.header?.customerfirmname}
            </div>
            {result?.header?.address?.map((e, i) => {
              return (
                <div className="px-1" key={i}>
                  {e}
                </div>
              );
            })}
          </div>
          <div className="subdiv3dp10 fsgdp10">
            <div className="d-flex justify-content-between px-1">
              <div className="w-50 fw-bold">BILL NO</div>
              <div className="w-50">{result?.header?.InvoiceNo}</div>
            </div>
            <div className="d-flex justify-content-between px-1">
              <div className="w-50 fw-bold">DATE</div>
              <div className="w-50">{result?.header?.EntryDate}</div>
            </div>
            <div className="d-flex justify-content-between px-1">
              <div className="w-50 fw-bold">{result?.header?.HSN_No_Label}</div>
              <div className="w-50">{result?.header?.HSN_No}</div>
            </div>
            <div className="d-flex justify-content-end mt-5 px-2 fw-bold">
              Gold Rate 500.00 Per Gram
            </div>
          </div>
        </div>
        {/* table */}
        <div className="tabledp10">
          {/* tablehead */}
          <div className="theaddp10 fw-bold fsg2dp10">
            <div className="col1dp10 center_sdp10">Sr</div>
            <div className="col2dp10 center_sdp10 fw-bold">Design</div>
            <div className="col3dp10">
              <div className="h-50 centerdp10 fw-bold w-100">Diamond</div>
              <div className="d-flex justify-content-between align-items-center h-50 border-top w-100">
                <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
                  Code
                </div>
                <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
                  Size
                </div>
                <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
                  Pcs
                </div>
                <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
                  Wt
                </div>
                <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
                  Rate
                </div>
                <div className="centerdp10 h-100 theadsubcol1_dp10">Amount</div>
              </div>
            </div>
            <div className="col4dp10 ">
              <div className="h-50 centerdp10 fw-bold w-100">Metal</div>
              <div className="d-flex justify-content-between align-items-center h-50 border-top w-100">
                <div
                  className="theadsubcol2_dp10 border-end h-100 centerdp10"
                  style={{ width: "40%" }}
                >
                  Quality
                </div>
                <div className="theadsubcol2_dp10 centerdp10 border-end h-100">
                  N+L
                </div>
                <div className="theadsubcol2_dp10 centerdp10 border-end h-100">
                  Rate
                </div>
                <div className="theadsubcol2_dp10 centerdp10 h-100">Amount</div>
              </div>
            </div>
            <div className="col3dp10">
              <div className="h-50 centerdp10 fw-bold w-100">Stone</div>
              <div className="d-flex justify-content-between align-items-center h-50 border-top w-100">
                <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
                  Code
                </div>
                <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
                  Size
                </div>
                <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
                  Pcs
                </div>
                <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
                  Wt
                </div>
                <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
                  Rate
                </div>
                <div className="centerdp10 h-100 theadsubcol1_dp10">Amount</div>
              </div>
            </div>
            <div className="col6dp10">
              <div className="d-flex justify-content-center align-items-center h-50 w-100">
                Other
              </div>
              <div className="d-flex justify-content-center align-items-center h-50 w-100">
                Charges
              </div>
            </div>
            <div className="col7dp10">
              <div className="h-50 centerdp10 fw-bold w-100">Labour</div>
              <div className="d-flex justify-content-between align-items-center h-50 border-top w-100">
                <div className="w-50 h-100 centerdp10 border-end">Rate</div>
                <div className="w-50 h-100 centerdp10">Amount</div>
              </div>
            </div>
            <div className="col8dp10">
              <div className="d-flex justify-content-center align-items-center h-50 border-top w-100">
                Total
              </div>
              <div className="d-flex justify-content-center align-items-center h-50 w-100">
                Amount
              </div>
            </div>
          </div>
          {/* table body */}
          <div className="tbodydp10">
            {result?.resultArray?.map((e, i) => {
              return (
                <div className="tbrowdp10 h-100" key={i}>
                  <div className="tbcol1dp10 center_sdp10">{e?.SrNo}</div>
                  <div className="tbcol2dp10">
                    <div className="d-flex justify-content-between px-1 ">
                      <div>{e?.designno}</div>
                      <div>{e?.SrJobno}</div>
                    </div>
                    <div className="d-flex justify-content-end px-1">
                      {e?.MetalColor}
                    </div>
                    {imgFlag ? (
                      <div className="w-100 d-flex justify-content-center align-items-start">
                        <img
                          src={e?.DesignImage}
                          onError={(e) => handleImageError(e)}
                          alt="design"
                          className="imgdp10"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="centerdp10 fw-bold">PO: {e?.PO}</div>
                    {e?.HUID !== "" ? (
                      <div className="centerdp10">HUID - {e?.HUID}</div>
                    ) : (
                      ""
                    )}
                    <div className="centerdp10">
                      Tunch : &nbsp;<b>{e?.Tunch?.toFixed(3)}</b>
                    </div>
                    <div className="centerdp10">
                      <b>{e?.grosswt?.toFixed(3)} gm</b>&nbsp; Gross
                    </div>
                    <div className="centerdp10">
                      {" "}
                      {e?.Size === "" ? "" : `Size : ${e?.Size}`}
                    </div>
                  </div>
                  <div className="tbcol3dp10 ">
                    {e?.diamonds?.map((el, idia) => {
                      return (
                        <div className="d-flex p-1" key={idia}>
                          <div className="theadsubcol1_dp10">
                            {el?.ShapeName} {el?.QualityName} {el?.Colorname}
                          </div>
                          <div className="theadsubcol1_dp10">
                            {el?.SizeName}
                          </div>
                          <div className="theadsubcol1_dp10 end_dp10">
                            {el?.Pcs}
                          </div>
                          <div className="theadsubcol1_dp10 end_dp10">
                            {el?.Wt}
                          </div>
                          <div className="theadsubcol1_dp10 end_dp10">
                            {formatAmount(el?.Rate)}
                          </div>
                          <div className="theadsubcol1_dp10 fw-bold end_dp10">
                            {formatAmount(el?.Amount)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="tbcol4dp10">
                    {e?.metal?.map((el, imet) => {
                      return (
                        <div className="d-flex w-100" key={imet}>
                          <div
                            className="theadsubcol2_dp10 d-flex justify-content-start border-end h-100 p-1 border-end-0"
                            style={{ width: "40%" }}
                          >
                            {el?.ShapeName} {el?.QualityName}
                          </div>
                          <div className="theadsubcol2_dp10 centerdp10 border-end h-100 p-1 border-end-0 end_dp10">
                            {(e?.NetWt + e?.LossWt)?.toFixed(3)}
                          </div>
                          <div className="theadsubcol2_dp10 centerdp10 border-end h-100 p-1 border-end-0 end_dp10">
                            {el?.Rate?.toFixed(2)}
                          </div>
                          <div className="theadsubcol2_dp10 centerdp10 border-end h-100 p-1 border-end-0 end_dp10">
                            {el?.Amount?.toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="tbcol3dp10">
                    {e?.colorstone?.map((el, ics) => {
                      return (
                        <div className="d-flex p-1" key={ics}>
                          <div className="theadsubcol1_dp10">
                            {el?.ShapeName}
                          </div>
                          <div className="theadsubcol1_dp10">
                            {el?.SizeName}
                          </div>
                          <div className="theadsubcol1_dp10 end_dp10">
                            {el?.Pcs?.toFixed(3)}
                          </div>
                          <div className="theadsubcol1_dp10 end_dp10">
                            {el?.Wt?.toFixed(3)}
                          </div>
                          <div className="theadsubcol1_dp10 end_dp10">
                            {el?.Rate?.toFixed(2)}
                          </div>
                          <div className="theadsubcol1_dp10 end_dp10 fw-bold">
                            {el?.Amount?.toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="tbcol6dp10 end_dp10 p-1">
                    {e?.OtherCharges?.toFixed(2)}
                  </div>
                  <div className="tbcol7dp10 border-end">
                    <div className="d-flex">
                      <div className="w-50 end_dp10 border-end">
                        {formatAmount(e?.MaKingCharge_Unit)}
                      </div>
                      <div className="w-50 end_dp10">
                        {formatAmount(e?.MakingAmount)}
                      </div>
                    </div>
                  </div>
                  <div className="tbcol8dp10 end_dp10 fw-bold p-1">
                    {formatAmount(e?.TotalAmount)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="d-flex justify-content-end align-items-center">
            <div style={{ width: "13%" }}>
              <div className="d-flex justify-content-between">
                <div className="w-50">Net Amount</div>
                <div className="w-50">{result?.mainTotal?.total_amount?.toFixed(2)}</div>
              </div>
              <div className="d-flex justify-content-between">
                <div className="w-50">Total Discount</div>
                <div className="w-50">{result?.mainTotal?.total_discount_amount?.toFixed(2)}</div>
              </div>
              <div>
                {result?.allTaxes?.map((e, i) => {
                  return (
                    <div className="d-flex justify-content-between">
                      <div className="w-50">{e?.name} { e?.per }</div>
                      <div className="w-50">{e?.amount}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPrint10;
