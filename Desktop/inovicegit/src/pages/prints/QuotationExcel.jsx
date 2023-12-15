import React from "react";
import { useState } from "react";
import Loader from "../../components/Loader";
import { useEffect } from "react";
import {
  NumberWitdCommas,
  apiCall,
  isObjectEmpty,
} from "../../GlobalFunctions";
import ReactdTMLTableToExcel from "react-html-table-to-excel";
import style from "../../assets/css/prints/exporttojsondownloadA.module.css";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";

const QuotationExcel = ({ urls, token, invoiceNo, printName, evn }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [header, setdeader] = useState({});
  const [data, setData] = useState([]);

  const loadData = (data) => {
    let Mostly_Calculation =  OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1,data?.BillPrint_Json2)
        console.log(Mostly_Calculation);
    let json0Data = data?.BillPrint_Json[0];
    let resultArr = [];
    setData(resultArr);
    setdeader(json0Data);
    setTimeout(() => {
      const button = document.getElementById("test-table-xls-button");
      button.click();
    }, 0);
  };

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
  }, []);

  return (
    <>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        <div className="">
          <ReactdTMLTableToExcel
            id="test-table-xls-button"
            className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
            table="table-to-xls"
            filename={`Sale_Format_A_${header?.InvoiceNo}_${Date.now()}`}
            sheet="tablexls"
            buttonText="Download as XLS"
          />
          <table
            id="table-to-xls"
            // className={`${style?.excelToJsonDownloadATable}`}
          >
            <thead>
              <tr>
                <td width={20}></td>
                <td
                  colSpan={24}
                  align="left"
                  height={40}
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "1px",
                    fontWeight: "bold",
                  }}
                >
                  <p weig>CLASSMATE CORPORATION PVT LTD </p>
                </td>
              </tr>

              <tr>
                <td></td>
                <td colSpan={5} align="left">
                  <p className="">TO</p>
                </td>
                <td colSpan={15} rowSpan={4}></td>
                <td>
                  <p className="fw-normal">Quotation#</p>
                </td>
                <td colSpan={3} align="left" style={{ fontWeight: "bold" }}>
                  <p className="fw-bold">: QT24347</p>
                </td>
              </tr>

              <tr>
                <td></td>
                <td colSpan={5} align="left">
                  <p className="">Kamlesh Patil pvt ltd</p>
                </td>
                <td>
                  <p className="fw-normal">Date</p>
                </td>
                <td colSpan={3} align="left" style={{ fontWeight: "bold" }}>
                  <p className="fw-bold">: 09 Dec 2023</p>
                </td>
              </tr>

              <tr>
                <td></td>
                <td colSpan={5} align="left">
                  <p className="">Near railway station, Vadodara</p>
                </td>
                <td></td>
                <td colSpan={3}></td>
              </tr>

              <tr>
                <td></td>
                <td colSpan={5} align="left">
                  <p className="">VADODARA</p>
                </td>
                <td>
                  <p> </p>
                </td>
                <td colSpan={3}>
                  <p> </p>
                </td>
              </tr>

              {/* table header */}
              <tr>
                <td></td>
                <th
                  width={60}
                  rowSpan={2}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  align="center"
                >
                  <p>Sr</p>
                </th>

                <th
                  rowSpan={2}
                  width={150}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  align="center"
                >
                  <p>Design</p>
                </th>

                <th
                  colSpan={7}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  align="center"
                >
                  Metal
                </th>

                <th
                  width={80}
                  colSpan={6}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Diamond & Stones
                </th>

                <th
                  width={80}
                  colSpan={3}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Setting
                </th>

                <th
                  width={80}
                  colSpan={2}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Making
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  rowSpan={2}
                >
                  Other
                </th>

                <th
                  width={150}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  rowSpan={2}
                >
                  Unit Cost
                </th>

                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  rowSpan={2}
                >
                  Qty
                </th>

                <th
                  width={150}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  rowSpan={2}
                >
                  Total Amount
                </th>
              </tr>
              <tr>
                <td></td>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  align="center"
                >
                  Quality
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Color
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Wt (M+D)
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Net Wt
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Gross Wt
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Rate
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Amt.
                </th>

                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Code
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Size
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Pcs
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Wt
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Rate
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Amt .
                </th>

                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Setting Type
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Setting Rate
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Setting Amt
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Making Rate
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {/* tax */}
              <tr>
                <td></td>
                <td
                  colSpan={23}
                  style={{
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  align="right"
                >
                  CGST @ 0.13%
                </td>
                <td
                  style={{
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  align="right"
                >
                  18.67
                </td>
              </tr>

              {/* total */}
              <tr>
                <td></td>
                <td
                  colSpan={8}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                ></td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  6972
                </td>
                <td
                  colSpan={2}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                </td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  12
                </td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  11.1
                </td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                </td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                         437.5
                </td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  colSpan={2}
                >
                </td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                       0
                </td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                </td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                    3500
                </td>

                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                    0
                </td>

                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                </td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                    3
                </td>
                {/* height={21} */}
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  align="right"
                >
               ₹ 14,396.00
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
          {msg}
        </p>
      )}
    </>
  );
};

export default QuotationExcel;
