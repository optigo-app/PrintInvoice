// http://localhost:3001/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=SlMvMTUyLzI1LTI2&evn=SmV3ZWxsZXJ5U2FsZQ==&pnm=c2hpcG1lbnQgb3B0aWdv&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvU2hpcG1lbnRfSnNvbg==&ctv=NzE=&ifid=PackingList3&pid=undefined
import React, { useEffect, useState } from "react";
import "../../assets/css/prints/ShipmentOptigo.scss";
import QRCode from "react-qr-code";
import { apiCall, checkMsg, isObjectEmpty, handlePrint, handleImageError, } from "../../GlobalFunctions";
import Loader from "../../components/Loader";

export default function ShipmentTagOptigo({ token, invoiceNo, printName, urls, evn, ApiVer }) {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);

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
  const loadData = (data) => {
    setResult(data)
  }
  console.log("resultresult", result);
  return (
    <div>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        <>
          <div>
            <button
              className="btn_white blue mb-0 hidedp10 m-3 p-2"
              onClick={(e) => handlePrint(e)}
            >
              Print
            </button>
          </div>
  
          {result?.Shipment_Json?.map((e, i) => (
            <div key={i} className="invoice-container">
              {/* Header */}
              <div className="header">
                <div className="party1 from" style={{ borderRight: "1px solid" }}>
                  <img
                    src={e?.ShipmentTagOptigo}
                    onError={(e) => handleImageError(e)}
                    className="logo"
                    alt=""
                  />
                  <div className="address-block">
                    <strong className="brBtom" style={{width: "110%"}}>FROM:</strong>
                    <p className="spbrWord spBold">{e?.ShippingFrom}</p>
                    {e?.ShippingFromPrintlable !== null &&<p className="spbrWord">{e?.ShippingFromPrintlable}</p>}
                  </div>
                </div>
                <div className="party2 to">
                  <div className="address-block">
                    <strong className="spPadg">TO:</strong>
                    <div className="spbrWord spBold">{e?.ShippingTo}</div>
                    <div className="spbrWord">
                      {e?.ShippingAddressline !== null && <div className="spbrWord">{e?.ShippingAddressline}</div>}
                      <div>{e?.ShippingCity}‑{e?.ShippingPincode}, {e?.ShippingState} ‑ {e?.ShippingCountry}</div>
                      <div>Phone: {e?.ShippingMobileNo}</div>
                    </div>
                  </div>
                </div>
              </div>
  
              <hr className="divider" />
  
              {/* Mid section */}
              <div className="mid-section">
                <div className="secondOPart1">
                  <div className="brBtom">
                    <div className="spMgl">Date:</div> <div className="spFntst spMgl">{e?.Shipmentdate}</div>
                  </div>
                  <div className="brBtom">
                    <div className="spMgl spMgT"> Delivery By:</div>
                    <div className="spFntst spMgl">{e?.Deliveredby}</div>
                  </div>
                  <div>
                    <div className="spMgl spMgT"> Shipment:</div> <div className="spFntst spMgl">{e?.Shipmentno}</div>
                  </div>
                </div>
                <div className="secondOPart2">
                    <div style={{ fontSize: '8px', }}>Order No.</div>
                    <div style={{ fontSize: '9px', fontWeight: "bold" }}>{e?.BillNo}</div>
                </div>
                <div className="secondOPart3">
                  <QRCode
                    style={{ height: "60px", width: "60px" }}
                    value={e?.BillNo}
                    viewBox={`0 0 128 128`}
                  />
                </div>
              </div>
  
              <hr className="divider" style={{ borderTop: "none" }} />
            </div>
          ))}
        </>
      ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
          {msg}
        </p>
      )}
    </div>
  );
  
}
