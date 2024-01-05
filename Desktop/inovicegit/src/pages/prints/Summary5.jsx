import React, { useEffect, useState } from "react";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { apiCall, isObjectEmpty } from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import "../../assets/css/prints/summary5.css";

const Summary5 = ({ urls, token, invoiceNo, printName, evn }) => {
  const [result, setResult] = useState(null);
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
    let cateWise = [];
    datas?.resultArray?.forEach((e) => {
      console.log(e);
      let findRecord = cateWise?.findIndex(
        (el) => el?.Categoryname === e?.Categoryname
      );
      if (findRecord === -1) {
        cateWise.push(e);
      } else {
        cateWise[findRecord].Quantity += e?.Quantity;
      }
    });
    // setCategoryNameWise(cateWise);
    setResult(datas);
    console.log(datas);
  }

  const handleHideShowS5 = (e) => {
    let val = e.target.value;
    if (val === "netwts2") {
      //   if (hsnetwt) {
      //     sethsnetwt(false);
      //   } else {
      //     sethsnetwt(true);
      //   }
    }
    if (val === "images2") {
      //   if (hsimg) {
      //     sethsimg(false);
      //   } else {
      //     sethsimg(true);
      //   }
    }
    if (val === "brands2") {
      //   if (hsbrand) {
      //     sethsbrand(false);
      //   } else {
      //     sethsbrand(true);
      //   }
    }
  };
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="containers5">
                    <div className="fsgs5 d-flex justify-content-between">
                        <div>
                            <div className="fw-bold">{result?.header?.CompanyFullName}</div>
                            <div>{result?.header?.CompanyAddress}</div>
                            <div>{result?.header?.CompanyCity}-{result?.header?.CompanyPinCode}-{result?.header?.CompanyState}({result?.header?.CompanyCountry})</div>
                            <div>T-{result?.header?.CompanyTellNo} | Toll Free { result?.header?.CompanyTollFreeNo }</div>
                            <div>{result?.header?.CompanyEmail} | {result?.header?.CompanyWebsite}</div>
                            <div>{result?.header?.Company_VAT_GST_No} | {result?.header?.Company_CST_STATE}-{result?.header?.Company_CST_STATE_No} | PAN-{result?.header?.Pannumber}</div>
                        </div>
                        <div><img src={result?.header?.PrintLogo} alt="#companylogo" className="" /></div>
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

export default Summary5;
