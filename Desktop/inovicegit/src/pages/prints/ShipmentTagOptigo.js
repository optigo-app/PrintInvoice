// http://localhost:3001/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=SlMvMTUyLzI1LTI2&evn=SmV3ZWxsZXJ5U2FsZQ==&pnm=c2hpcG1lbnQgb3B0aWdv&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvU2hpcG1lbnRfSnNvbg==&ctv=NzE=&ifid=PackingList3&pid=undefined
import React, { useEffect, useState } from "react";
import "../../assets/css/prints/ShipmentOptigo.scss";
import QRCode from "react-qr-code";
import { apiCall, checkMsg, isObjectEmpty, handlePrint, } from "../../GlobalFunctions";
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
                    className="logo"
                    src="https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4"
                    alt="Optigo Logo"
                  />
                  <div className="address-block">
                    <strong>FROM:</strong>
                    <p className="spbrWord spBold">{e?.ShippingFrom}</p>
                    <p className="spbrWord">{e?.ShippingFromPrintlable}</p>
                  </div>
                </div>
                <div className="party2 to">
                  <div className="address-block">
                    <strong className="spPadg">TO:</strong>
                    <p className="spbrWord spBold">{e?.ShippingTo}</p>
                    <p className="spbrWord">
                      {e?.ShippingAddressline}
                      <br />
                      {e?.ShippingCity}‑{e?.ShippingPincode}, {e?.ShippingState} ‑ {e?.ShippingCountry}
                      <br />
                      Phone: {e?.ShippingMobileNo}
                    </p>
                  </div>
                </div>
              </div>
  
              <hr className="divider" />
  
              {/* Mid section */}
              <div className="mid-section">
                <div className="secondOPart1">
                  <div style={{ borderBottom: "1px solid" }}>
                    <p>Date:</p> <span className="label">{e?.Shipmentdate}</span>
                  </div>
                  <div style={{ borderBottom: "1px solid" }}>
                    <p> Delivery By:</p>
                    <span className="label">{e?.Deliveredby}</span>
                  </div>
                  <div>
                    <p> Shipment:</p> <span className="label">{e?.Shipmentno}</span>
                  </div>
                </div>
                <div className="secondOPart2">
                  <div className="order-no">
                    <p style={{ fontSize: '12px', margin: '0px' }}>Order No.</p>
                    <strong>{e?.BillNo}</strong>
                  </div>
                </div>
                <div className="secondOPart3">
                  <QRCode
                    size={256}
                    style={{ height: "140px", width: "140px" }}
                    value={e?.BillNo}
                    viewBox={`0 0 256 256`}
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
