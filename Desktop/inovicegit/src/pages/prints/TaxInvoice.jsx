import React, { useState } from "react";
import style from "../../assets/css/prints/taxInvoice.module.css";
import { apiCall, handlePrint } from "../../GlobalFunctions";
import Header from "../../components/Header";
import { useEffect } from "react";
import { HeaderComponent } from "./../../GlobalFunctions";
const TaxInvoice = ({ token, invoiceNo, printName, urls, evn }) => {
  const [image, setimage] = useState(false);
  const [loader, setLoader] = useState(true);
  const [json0Data, setJson0Data] = useState({});
  const [headerComp, setHeaderComp] = useState(null);
  const handleChange = (e) => {
    image ? setimage(false) : setimage(true);
  };

  const loadData = (data) => {
    setJson0Data(data?.BillPrint_Json[0]);
    let head = HeaderComponent(2, data?.BillPrint_Json[0]);
    setHeaderComp(head);
  }

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn);
        loadData(data);
        setLoader(false);

      } catch (error) {
        console.error(error);
      }
    }

    sendData();
    const addPrefixToCSS = (cssString, prefix) => {
      const lines = cssString.split('\n');
      let modifiedCSS = '';

      lines.forEach((line) => {
        // Match and replace class names with the prefix
        const modifiedLine = line.replace(/\.(\w+)/g, `${prefix}$1`);
        modifiedCSS += modifiedLine + '\n';
      });

      // Replace closing curly braces with the prefix
      modifiedCSS = modifiedCSS.replace(/}/g, `${prefix}}`);

      return modifiedCSS.trim(); // Remove trailing newline
    };
    let data = `.tax_invoice_container { background-color: blue } .headerInvoice1{ background-color: orange } `;
    const prefixedCSS = addPrefixToCSS(data, '${style.');
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `.tax_invoice_container {
        background-color: blue
    }
    .headerInvoice1{
        background-color: orange
    }
    `;
    document.head.appendChild(styleElement);
  }, []);

  return (
    <div className={`container pt-5  ${style.tax_invoice_container} pad_60_allPrint`}>
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
      {headerComp}
    </div>
  );
};

export default TaxInvoice;
