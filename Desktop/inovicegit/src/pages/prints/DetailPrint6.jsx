import React, { useEffect, useState } from 'react'
import "../../assets/css/prints/detailprint6.css";
import { ToWords } from "to-words";
import { HeaderComponent, apiCall, isObjectEmpty } from '../../GlobalFunctions';
import { cloneDeep } from 'lodash';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
const DetailPrint6 = ({ token, invoiceNo, printName, urls, evn }) => {

  const toWords = new ToWords();
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

  const loadData = (data) => {
    const copydata = cloneDeep(data);

    let address = copydata?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    copydata.BillPrint_Json[0].address = address;
    const datas = OrganizeDataPrint(
      copydata?.BillPrint_Json[0],
      copydata?.BillPrint_Json1,
      copydata?.BillPrint_Json2
    );
    console.log(datas);
    setResult(datas);
  }

  return (
    <div>
      <div className='container_dp6'>
        <div>
          <div className='headlabel_dp6'>{result?.header?.PrintHeadLabel}</div>
          <div className='d-flex flex-column justify-content-center align-items-center p-1'>
            <div><img src={result?.header?.PrintLogo} alt="#companylogo" className='printlogo_dp6' /></div>
            <div className='fw-bold'>{result?.header?.CompanyFullName}</div>
            <div>{result?.header?.CompanyAddress}</div>
            <div>{result?.header?.CompanyAddress2}</div>
            <div>{result?.header?.CompanyCity}-{result?.header?.CompanyPinCode}, {result?.header?.CompanyState}({result?.header?.CompanyCountry})</div>
            <div>T {result?.header?.CompanyTellNo} | TOLL FREE {result?.header?.CompanyTollFreeNo}</div>
            <div>GSTIN-24AAAAA0000A1Z51 | STATE CODE-24 | PAN-FDGH5564CD</div>
            <div>CIN: {result?.header?.CINNO} | MSME: DL05A0000051</div>
            <div className='fw-bold'>Tax Invoice for Supply of Goods Issued u/section 31(1) of CGST ACT ,2017</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailPrint6