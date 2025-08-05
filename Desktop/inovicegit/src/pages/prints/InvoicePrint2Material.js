// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=TVMvMzY0LzIwMjQ=&evn=TWF0ZXJpYWwgc2FsZQ==&pnm=dGF4IGludm9pY2UgYQ==&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvTWF0ZXJpYWxCaWxsX0pzb24=&ctv=NzE=&ifid=DetailPrintR&pid=undefined
import React, { useEffect } from "react";
import "../../assets/css/prints/InvoicePrint2MaterialSale.css";
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
import { ToWords } from "to-words";

const InvoicePrint2Material = ({
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
  const [finalD, setFinalD] = useState({});
  const [custAddress, setCustAddress] = useState([]);
  const [taxAmont , setTaxAmount] = useState();
  const toWords = new ToWords();  
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };

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
            setTaxAmount(data?.Data?.MaterialBill_Json2[0]);
            
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

  const summary = Array.isArray(finalD)
    ? finalD.reduce(
        (acc, item) => {
          acc.totalPieces += item.pieces || 0;
          acc.totalWeight += item.Weight || 0;
          acc.totalAmount += item.TotalAmount || 0;
          return acc;
        },
        {
          totalPieces: 0,
          totalWeight: 0,
          totalAmount: 0,
        }
      )
    : {
        totalPieces: 0,
        totalWeight: 0,
        totalAmount: 0,
      };

  let TotalCGSTAmount = 0;
  let TotalSGSTAmount = 0;
  let TotalIGSTAmount = 0;

  if (Array.isArray(finalD)) {
    finalD.forEach((item) => {
      TotalCGSTAmount += Number(item.CGSTAmount) || 0;
      TotalSGSTAmount += Number(item.SGSTAmount) || 0;
      TotalIGSTAmount += Number(item.IGSTAmount) || 0;
    });

    // console.log("TotalCGSTAmount:", TotalCGSTAmount);
    // console.log("TotalSGSTAmount:", TotalSGSTAmount);
    // console.log("TotalIGSTAmount:", TotalIGSTAmount);
  } 
  function PrintableText({ json0Data }) {
    const htmlContent = json0Data?.Printlable?.replace(/\n/g, '<br />');
  
    return (
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }
  console.log("finalDfinalDfinalD", taxAmont ,json0Data, finalD);

  const amount = Number(finalD?.finalAmount || 0);
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  const rupeesInWords = toWords.convert(rupees);
  const paiseInWords = paise > 0 ? ` and ${toWords.convert(paise)} Paise` : '';

  return (
    <>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        <>
          <div className="w-full flex">
            <div className="w-full flex prnt_btn">
              <input
                type="button"
                className="btn_white blue mt-0"
                value="Print"
                onClick={(e) => handlePrint(e)}
              />
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="container_inv2">

              {/** Header */}
              <div className="disflx brbxAll">
                <div className="w1_inv2 spbrRht spfnthead">
                  <div style={{ paddingTop: "2px" }}>Bill To,</div>
                  <div className="spfntsZ spfntBld">{json0Data?.customerfirmname}</div>
                  <div>{json0Data?.customerAddress1}</div>
                  <div>{json0Data?.customerAddress2}</div>
                  <div>{json0Data?.CompanyCity} {json0Data?.PinCode}</div>
                  <div>{json0Data?.customeremail}</div>
                  <div>{json0Data?.Cust_VAT_GST}-{json0Data?.Cust_VAT_GST_No} | PAN-{json0Data?.customerPANno}</div>
                  <div>{json0Data?.Cust_CST_STATE}-{json0Data?.Cust_CST_STATE_No}</div>
                </div>
                <div className="w2_inv2 spbrRht spfnthead">
                  <div style={{ paddingTop: "2px" }}>Ship To,</div>
                  <div className="spfntsZ spfntBld">{json0Data?.customerfirmname}</div>
                  <div><PrintableText json0Data={json0Data} /></div>
                </div>
                <div className="w30_inv2 spfnthead">
                  <div className="disflx" style={{ paddingTop: "2px" }}>
                    <div className="wdthHd spfntBld">BILL NO</div>
                    <div className="wdthHd1">{json0Data?.InvoiceNo}</div>
                  </div>
                  <div className="disflx">
                    <div className="wdthHd spfntBld">DATE</div>
                    <div className="wdthHd1">{json0Data?.EntryDate}</div>
                  </div>
                  <div className="disflx">
                    <div className="wdthHd spfntBld">DUE DATE</div>
                    <div className="wdthHd1">{json0Data?.EntryDate1}</div>
                  </div>
                </div>
              </div>

              {/** Table Header */}
              <div className="disflx brbxAll spfntbH" style={{ marginTop: "5px"}}>
                <div className="col1_inv2 spfntBld spbrRht spfntCen">Sr#</div>
                <div className="col2_inv2 spfntBld spfntCen spbrRht">Description</div>
                <div className="col3_inv2 spfntBld spbrRht spfntCen">Shape</div>
                <div className="col4_inv2 spbrRht spfntBld spfntCen">Quality</div>
                <div className="spbrRht col5_inv2 spfntBld spfntCen">Color</div>
                <div className="col6_inv2 spfntBld spbrRht spfntCen">Size</div>
                <div className="col7_inv2 spbrRht spfntBld spfntCen">Weight</div>
                <div className="col8_inv2 spfntBld spbrRht spfntCen">Rate</div>
                <div className="col9_inv2 spfntBld spfntCen">Amount</div>
              </div>

              {/** table Body */}
              {finalD?.map((e, i) => {
                return (
                  <div key={i} className="disflx spbrlFt brBtom spfntbH">
                    <div className="col1_inv2">{i + 1}</div>
                    <div className="col2_inv2">{e?.ItemName === "DIAMOND" ? "CUT AND POLISHED DIAMOND" : e?.ItemName === "COLOR STONE" ? "STONE" : e?.ItemName === "METAL" ? "GOLD" : e?.ItemName === "MISC" ? "MISC" : ""}</div>
                    <div className="col3_inv2">{e?.shape}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
          {msg}
        </p>
      )}
    </>
  );
};

export default InvoicePrint2Material;
