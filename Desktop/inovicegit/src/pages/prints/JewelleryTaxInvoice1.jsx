import React from 'react'
import "../../assets/css/prints/jewellerytaxinvoice1.css";
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';
import { apiCall, isObjectEmpty } from '../../GlobalFunctions';
import { useEffect } from 'react';
import { useState } from 'react';
import Loader from '../../components/Loader';
import Button from '../../GlobalFunctions/Button';
const JewelleryTaxInvoice1 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
    const [result, setResult] = useState(null);
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const [isImageWorking, setIsImageWorking] = useState(true);
    const [purityWise, setPurityWise] = useState([]);

          
    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
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

        setResult(datas);
        
    };

    const handleImageErrors = () => {
        setIsImageWorking(false);
      };
  
      console.log(result);

  return (
    <>
    {
        loader ? <Loader /> : <>
        {
            msg === '' ? <>
                <div className='container_jtip1'>
                <div className='mb-5 pb-5 d-flex justify-content-end align-items-center mt-5 pt-5 d_none_jti2'><Button /></div>
                <div className='d-flex justify-content-between align-items-center'>
                    <div><img src="" alt="#headerlogo" /></div>
                    <div></div>
                </div>
                </div>
            </> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
          </p>
        }
        </>
    }
    </>
  )
}

export default JewelleryTaxInvoice1