import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  HeaderComponent,
  apiCall,
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

  return (
    <>
      <div className="containerdp10">
        <div>
          <button
            className="btn_white blue mb-0 hidedp10"
            onClick={(e) => handlePrint(e)}
          >
            Print
          </button>
        </div>
        <div className="w-100 mt-3">{headerCom}</div>
        <div className="subheaderdp10">
          <div className="subdiv1dp10 border-end fsgdp10 ">
            <div className="px-1">{result?.header?.lblBillTo}</div>
            <div className="px-1 fw-bold">Dar Be Gold Jewelers</div>
            <div className="px-1">Chowk bazaar</div>
            <div className="px-1">45/2 sangram shopping center</div>
            <div className="px-1">near old court</div>
            <div className="px-1">lucknow-385620</div>
            <div className="px-1">Hiralvasoya@vg.com</div>
            <div className="px-1">GSTIN-24FFFF0000B1J64 | PAN-DGJIF543D</div>
            <div className="px-1">STATE CODE-24</div>
          </div>
          <div className="subdiv2dp10 border-end fsgdp10">
            <div className="px-1">Ship To,</div>
            <div className="px-1 fw-bold">{result?.header?.customerfirmname}</div>
            <div className="px-1">Hiral Vasoya</div>
            <div className="px-1">{result?.header?.customerstreet}</div>
            <div className="px-1">{result?.customercity}, Gujarat</div>
            <div className="px-1">India{result?.header?.customerpincode}</div>
            <div className="px-1">Mobile No : {result?.header?.customermobileno}</div>
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
            <div className="d-flex justify-content-end mt-5 px-2 fw-bold">Gold Rate 500.00 Per Gram</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPrint10;
