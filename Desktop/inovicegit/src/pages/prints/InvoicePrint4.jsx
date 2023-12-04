import React, { useState } from "react";
import { HeaderComponent, apiCall, isObjectEmpty } from "../../GlobalFunctions";
import { useEffect } from "react";
import Loader from "../../components/Loader";
import Button from "../../GlobalFunctions/Button";
import "../../assets/css/prints/invoiceprint4.css";
const InvoicePrint4 = ({ urls, token, invoiceNo, printName, evn }) => {
  const [header, setHeader] = useState(null);
  const [resultArray, setResultArray] = useState();
  const [mainTotal, setMainTotal] = useState({});
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const organizeData = (headerdata, json1, json2) => {
    let resultArr = [];
    let mainTotal = {
      diamonds: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      colorstone: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      metal: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      misc: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      finding: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      totalnetwt: {
        netwt: 0,
      },
      totalgrosswt: {
        grosswt: 0,
      },
      totAmount: {
        TotalAmount: 0,
      },
      totlbrAmt: {
        Amount: 0,
      },
      totOthAmt: {
        Amount: 0,
      },
    };

    json1?.forEach((e, i) => {
      let diamondlist = [];
      let colorstonelist = [];
      let misclist = [];
      let metallist = [];
      let findinglist = [];

      let totals = {
        diamonds: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },

        colorstone: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },

        metal: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },

        misc: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },

        finding: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },

        labour: {
          labourAmount: 0,
        },

        OtherCh: {
          OtherAmount: 0,
        },
      };

      let head = HeaderComponent(headerdata?.HeaderNo, headerdata);
      setHeader(head);
    });
  };

  async function loadData(data) {
    try {
      //   setHeaderData(data?.BillPrint_Json[0]);
      //   setJson1(data?.BillPrint_Json1);
      //   setJson2(data?.BillPrint_Json2);
      organizeData(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );

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
    <React.Fragment>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="containerinvp4">
                <div className="container max_width_container px-2 print_sec_sum4">
                  <Button />
                </div>
                <div className="mt-5">
                  <div>
                    <div>{header}</div>
                    <div className="subheadinvp4 d-flex justify-content-between align-items-center p-1">
                      <div className="w-75 h-100">
                        <div className="linesinvp4">Bill To,</div>
                        <div className="linesinvp4">Sample Pvt Ltd</div>
                        <div className="linesinvp4">32 NAandudoshi Line 1</div>
                        <div className="linesinvp4">Katargm</div>
                        <div className="linesinvp4">
                          {" "}
                          Neaf krishna Clinic line2
                        </div>
                        <div className="linesinvp4">Surat-395002</div>
                        <div className="linesinvp4">sample@co.in</div>
                        <div className="linesinvp4">
                          STATE NAME : Gujarat,STATE CODE-25
                        </div>
                        <div className="linesinvp4">GSTIN-25GJERDR202314</div>
                      </div>
                      <div className="d-flex flex-column justify-content-between align-items-center w-25">
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <div className="fw-bold w-50 linesinvp4">
                            INVOICE#
                          </div>
                          <div className="w-50 linesinvp4">SK6692022</div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <div className="linesinvp4 fw-bold">DATE</div>
                          <div className="linesinvp4 w-50">14 Aug 2023</div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <div className="linesinvp4 fw-bold">HSN</div>
                          <div className="linesinvp4 w-50">85213</div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <div className="linesinvp4 fw-bold">DUE DATE</div>
                          <div className="linesinvp4 w-50">19 Aug 2023</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between align-items-center theadinvp4">
                      <div className="fw-bold descinvp4">DESCRIPTION</div>
                      <div
                        className="fw-bold"
                        style={{ width: "33%", paddingLeft: "5px" }}
                      >
                        DETAIL
                      </div>
                      <div className="fw-bold" style={{ width: "15%" }}>
                        WEIGHT
                      </div>
                      <div className="fw-bold" style={{ width: "15%" }}>
                        RATE
                      </div>
                      <div className="fw-bold" style={{ width: "10%" }}>
                        AMOUNT
                      </div>
                    </div>
                    <div className="tbodyinvp4 d-flex justify-content-between align-items-center">
                      <div style={{ width: "28%" }}>desc</div>
                      <div style={{ width: "33%" }}>sil</div>
                      <div style={{ width: "15%" }}>8.5gm</div>
                      <div style={{ width: "15%" }}>2625</div>
                      <div style={{ width: "10%" }}>21414</div>
                    </div>
                  </div>
                  <div></div>
                  <div>footer</div>
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
    </React.Fragment>
  );
};

export default InvoicePrint4;
