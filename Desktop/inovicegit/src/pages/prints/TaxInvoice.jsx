import React, { useState } from "react";
import style from "../../assets/css/prints/taxInvoice.module.css";
import { apiCall, handlePrint } from "../../GlobalFunctions";
import Header from "../../components/Header";
import { useEffect } from "react";

const TaxInvoice = ({token, invoiceNo, printName, urls}) => {
  const [image, setimage] = useState(false);
  const [loader, setLoader] = useState(true);
  const [json0Data, setJson0Data] = useState({});
  const handleChange = (e) => {
    image ? setimage(false) : setimage(true);
  };

  const loadData = (data) => {
    console.log(data);
    setJson0Data(data?.BillPrint_Json[0])
  }

  useEffect(() => {
    const sendData = async () => {
        try {
            const data = await apiCall(token, invoiceNo, printName, urls);
            loadData(data);
            setLoader(false);

        } catch (error) {
            console.error(error);
        }
    }

    sendData();
}, []);

  return (
    <div className={`container pt-5  ${style.tax_invoice_container}`}>
      <div className="d-flex justify-content-end mb-4 align-items-center print_sec_sum4">
        <div className="form-check pe-3">
          <input
            className="form-check-input border-dark"
            type="checkbox"
            checked={image}
            onChange={(e) => handleChange(e)}
          />
          <label className="form-check-label pt-1">With Image</label>
        </div>
        <div className="form-check ps-3">
          <input
            type="button"
            className="btn_white blue"
            value="Print"
            onClick={(e) => handlePrint(e)}
          />
        </div>
      </div>
      <div className="bgGrey p-2">
        <p className="fw-bold text-white fs-4"> DELIVERY  CHALLAN </p>
      </div>
      <Header data={json0Data}/>
    </div>
  );
};

export default TaxInvoice;
