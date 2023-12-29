import React from 'react'
import { useEffect } from 'react';
import { HeaderComponent, apiCall, isObjectEmpty } from './../../GlobalFunctions';
import { useState } from 'react';
import { OrganizeDataPrint } from './../../GlobalFunctions/OrganizeDataPrint';


const HeaderCheck = ({ urls, token, invoiceNo, printName, evn }) => {
    const [json, setJson] = useState([]);
    const [json1, setJson1] = useState([]);
    const [json2, setJson2] = useState([]);
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const [headerComp, setHeaderComp] = useState(null);
    // const [subHeaderComp, setSubHeaderComp] = useState(null);
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

      
  async function loadData(data) {
    try {
      setJson(data?.BillPrint_Json[0]);
      setJson1(data?.BillPrint_Json1);
      setJson2(data?.BillPrint_Json2);
      OrganizeDataPrint(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );
      let head = HeaderComponent(data?.BillPrint_Json[0]?.HeaderNo, data?.BillPrint_Json[0]);
      setHeaderComp(head);

    //   let subhead = SubheaderComponent(headerDatas?.HeaderNo, headerDatas);
    //   setSubHeaderComp(subhead);
      // countCategorySubCategory(data?.BillPrint_Json1);
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
        <div>
            
            {headerComp}
        </div>
    </>
  )
}

export default HeaderCheck;