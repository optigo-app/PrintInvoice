import React from "react";
import "../../assets/css/prints/estimateprintK.css";
import { ToWords } from "to-words";
import { useState } from "react";
import Loader from "../../components/Loader";
import Button from "../../GlobalFunctions/Button";
import { useEffect } from "react";
import {
  apiCall,
  checkMsg,
  formatAmount,
  isObjectEmpty,
} from "../../GlobalFunctions";
import { cloneDeep } from "lodash";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { deepClone } from "@mui/x-data-grid/utils/utils";

const EstimatePrintK = ({
  token,
  invoiceNo,
  printName,
  urls,
  evn,
  ApiVer,
}) => {
  const toWords = new ToWords();
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [image, setImage] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);
  const [purityWise, setPurityWise] = useState([]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = (data) => {
    const copydata = cloneDeep(data);

    let address = copydata?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    copydata.BillPrint_Json[0].address = address;

    const datas = OrganizeDataPrint(
      copydata?.BillPrint_Json[0],
      copydata?.BillPrint_Json1,
      copydata?.BillPrint_Json2
    );
    setResult(datas);

    let pwise = [];

    datas?.resultArray?.forEach((el) => {
      let obj = deepClone(el);
      let findRec = pwise?.findIndex(
        (a) => a?.MetalTypePurity === obj?.MetalTypePurity
      );
      if (findRec === -1) {
        pwise.push(obj);
      } else {
        pwise[findRec].grosswt += obj?.grosswt;
        pwise[findRec].NetWt += obj?.NetWt;
        pwise[findRec].LossWt += obj?.LossWt;
      }
    });
    pwise.sort((a, b) => {
      const purityA = parseInt(a.MetalTypePurity.match(/\d+/)[0]);
      const purityB = parseInt(b.MetalTypePurity.match(/\d+/)[0]);
      return purityA - purityB;
    });
    setPurityWise(pwise);
  };

  const handleImageErrors = () => {
    setIsImageWorking(false);
  };

  const handleChangeImage = (e) => {
    image ? setImage(false) : setImage(true);
  };

  const taxes = result?.allTaxes?.map((e) =>
    e?.amountInNumber != null ? e.amountInNumber : parseFloat(e?.amount)
  );
  const totalTax = taxes?.reduce((acc, val) => acc + (isNaN(val) ? 0 : val), 0);

  const finalAmount =
  (result?.mainTotal?.TotalAmount + result?.header?.FreightCharges) /
    result?.header?.CurrencyExchRate +
    result?.allTaxesTotal;
  const decimalPart = parseFloat(
    (finalAmount - Math.floor(finalAmount)).toFixed(2)
  );
  let roundedAmount = finalAmount;
  if (decimalPart < 0.5) {
    roundedAmount = finalAmount - decimalPart;
  } else {
    roundedAmount = finalAmount + (1 - decimalPart);
  }
  console.log("resultdata", result);

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="container_jts">
                <div className="d-flex justify-content-end align-items-center d_none_jts">
                    {/* <div className="form-check pe-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={image}
                        onChange={handleChangeImage}
                      />
                      <label
                        className="form-check-label pt-1"
                        htmlFor="flexCheckDefault"
                      >
                        With Image
                      </label>
                    </div> */}
                  <Button />
                </div>
                <div className="align-items-center">
                  <div className="fs_jts brb_jts">
                    <div className="fs2_jts fw-bold">
                      {result?.header?.CompanyFullName}
                    </div>
                    <div>{result?.header?.CompanyAddress}</div>
                    <div>{result?.header?.CompanyAddress2}</div>
                    <div>
                      {result?.header?.CompanyCity}-
                      {result?.header?.CompanyPinCode},{" "}
                      {result?.header?.CompanyState}(
                      {result?.header?.CompanyCountry})
                    </div>
                    <div>T {result?.header?.CompanyTellNo}</div>
                    <div>
                      {result?.header?.CompanyEmail} |{" "}
                      {result?.header?.CompanyWebsite}
                    </div>
                    <div>
                      {result?.header?.Company_VAT_GST_No} |{" "}
                      {result?.header?.Company_CST_STATE}-
                      {result?.header?.Company_CST_STATE_No} | PAN-
                      {result?.header?.Com_pannumber}
                    </div>
                  </div>
                  <div>
                    <div className="fs2_jts1">
                      Invoice No:{" "}
                      <span className="fw-bold">
                        {result?.header?.InvoiceNo}
                      </span>
                    </div>
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

export default EstimatePrintK;
