import React, { useState, useEffect } from 'react'
import { NumberWithCommas, apiCall, fixedValues, handleImageError, handlePrint, isObjectEmpty, taxGenrator } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const DetailPrint11Excel = ({ urls, token, invoiceNo, printName, evn }) => {
  const [loader, setLoader] = useState(true);
  const [json0Data, setJson0Data] = useState({});
  const [json1Data, setJson1Data] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn);
        if (data?.Status === '200') {
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
    }
    sendData();
  }, []);

  const loadData = (data) => {
    console.log(data);
    setJson0Data(data?.BillPrint_Json[0]);
    setTimeout(() => {
      const button = document.getElementById('test-table-xls-button');
      button.click();
    }, 0);
  }
  return (
    loader ? <Loader /> : msg === "" ? <>

      <div className="container max_width_container pad_60_allPrint mt-4">
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
          table="table-to-xls"
          filename={`Sale_Format_A_${json0Data?.InvoiceNo}_${Date.now()}`}
          sheet="tablexls"
          buttonText="Download as XLS" />
        <table id='table-to-xls' >
          <tbody>
            <tr>
              <td colSpan={16} style={{ border: '1px solid black', padding: '1px' }} className='d-flex justify-content-between'>
                <div>
                  <p>ORAIL SERVICE</p>
                  <p>57 Bansant lok</p>
                  <p>Vasant vihar</p>
                  <p>New Delhi 605001 GUJARAT India</p>
                  <p>darren@orail.co.in | www.optigoapps.com</p>
                  <p>GSTIN-24AAAAA0000A1Z51 | STATE CODE-24 | PAN-EDJHF236D</p>
                </div>
                <div>
                  <img src="http://zen/R50B3/UFS/ufs2/orail228FT0OWNGEI6DC3BVS/companylogo/projectlogo.png" alt="" className='w-25 h-auto ms-auto d-block' />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        asdasd
      </div>
    </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
  )
}

export default DetailPrint11Excel