import React, { useEffect, useState } from 'react'
import { HeaderComponent, apiCall, isObjectEmpty } from '../../GlobalFunctions';

const TaxInvoice3 = ({ token, invoiceNo, printName, urls, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState([]);
    const [header, setHeader] = useState(null);
    const [address, setAddress] = useState([]);
    const [headerData, setHeaderData] = useState({});


    const loadData = (data) => {
        console.log(data);
        let head = HeaderComponent("1", data?.BillPrint_Json[0]);
        setHeader(head);
        setHeaderData(data?.BillPrint_Json[0]);
        let adr = data?.BillPrint_Json[0]?.Printlable.split(`\r\n`);
        setAddress(adr);
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
    <div>TaxInvoice3</div>
  )
}

export default TaxInvoice3