import React, { useEffect, useState } from "react";
import "../../assets/css/prints/laboursummary.css";
import { FooterComponent, HeaderComponent, apiCall, handlePrint, isObjectEmpty, numberToWord } from "../../GlobalFunctions";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { cloneDeep } from "lodash";
import { formatAmount } from './../../GlobalFunctions';
import Loader from './../../components/Loader';

const LabourSummary = ({ token, invoiceNo, printName, urls, evn }) => {

  const [result, setResult] = useState();
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [header, setHeaderComp] = useState(null);
  const [footer, setFooterComp] = useState(null);
  const [qualityTypes, setQualityTypes] = useState('');

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

    let head_comp = HeaderComponent(
      copydata?.BillPrint_Json[0]?.HeaderNo,
      copydata?.BillPrint_Json[0]
    );

    let footer_comp = FooterComponent(
      "2",
      copydata?.BillPrint_Json[0])
    let _QualityTypes = datas?.resultArray?.map(e => e?.MetalPurity);
    let __qualitytypes = new Set(_QualityTypes);
    let ___qualitytypes = [...__qualitytypes];
    // console.log(___qualitytypes);
    let concatenatedString = ___qualitytypes?.join(' | ');
    setQualityTypes(concatenatedString)
    setHeaderComp(head_comp);
    setFooterComp(footer_comp)
    setResult(datas)
  };

  return (
    <>
    {
      loader ? <Loader /> : <>
      {
        msg === '' ? <div className="container_ls">
        {/* print button */}
        <div className="d-flex justify-content-end d_none_ls">
          <button className="btn_white blue m-0 mb-5 mt-5" onClick={(e) => handlePrint(e)}>Print</button>
        </div>
        {/* header */}
        <div>{header}</div>
        {/* sub header */}
        <div className="d-flex border fs_ls">
          <div className="p-1 w_ls">
            <div>Bill To,</div>
            <div className="fw-bold">{result?.header?.customerfirmname}</div>
            <div>{result?.header?.customerAddress1}</div>
            <div>{result?.header?.customerAddress2}</div>
            <div>{result?.header?.customercity}{result?.header?.customerpincode}</div>
            <div>{result?.header?.customeremail1}</div>
            <div>{result?.header?.vat_cst_pan}</div>
            <div>{result?.header?.Cust_CST_STATE}-{result?.header?.Cust_CST_STATE_No}</div>
          </div>
          <div className="p-1 w_ls border border-end border-bottom-0 border-top-0">
            <div>Ship To,</div>
            <div className="fw-bold">{result?.header?.customerfirmname}</div>
            <div>{result?.header?.CustName}</div>
            <div>{result?.header?.customercity}, {result?.header?.customerstate} </div>
            <div>{result?.header?.customercountry}{result?.header?.customerpincode}</div>
            <div>Mobile No : {result?.header?.customermobileno}</div>
          </div>
          <div className="p-1 w_ls">
            <div className="d-flex">
              <div className="fw-bold w-50">BILL NO</div> <div className="w-50">{result?.header?.InvoiceNo}</div>
            </div>
            <div className="d-flex">
              <div className="fw-bold w-50">DATE</div> <div className="w-50">{result?.header?.EntryDate}</div>
            </div>
            <div className="d-flex">
              <div className="fw-bold w-50">{result?.header?.HSN_No_Label}</div> <div className="w-50">{result?.header?.HSN_No}</div>
            </div>
          </div>
        </div>
        {/* table */}
        <div>
            {/* table head */}
            <div className="fw-bold d-flex mt-2 border fs_ls">
                <div className="col1_ls border-end d-flex justify-content-center align-items-center">Sr#</div>
                <div className="col2_ls border-end d-flex justify-content-center align-items-center">Description</div>
                <div className="col3_ls border-end d-flex justify-content-center align-items-center flex-column">
                    <div className="border-bottom w-100 d-flex justify-content-center align-items-center">Gold</div>
                    <div className="d-flex w-100">
                      <div className=" d-flex justify-content-center align-items-center " style={{width:'56%'}}>Quality</div>
                      <div className=" d-flex justify-content-center align-items-center border-start" style={{width:'44%'}}>Net</div>
                    </div>
                </div>
                <div className="col4_ls border-end d-flex justify-content-center align-items-center flex-column">
                  <div className="border-bottom w-100 d-flex justify-content-center align-items-center">Diamond</div>
                  <div className="d-flex w-100">
                    <div className="w-50 d-flex justify-content-center align-items-center">Detail</div>
                    <div className="w-50 d-flex justify-content-center align-items-center border-start">Wt.</div>
                  </div>
                </div>
                <div className="col5_ls border-end d-flex justify-content-center align-items-center flex-column">
                <div className="border-bottom w-100 d-flex justify-content-center align-items-center">Colorstone</div>
                  <div className="d-flex w-100">
                    <div className="w-50 d-flex justify-content-center align-items-center">Detail</div>
                    <div className="w-50 d-flex justify-content-center align-items-center border-start">Wt.</div>
                  </div>
                </div>
                <div className="col6_ls border-end d-flex justify-content-center align-items-center">Others</div>
                <div className="col7_ls border-end d-flex justify-content-center align-items-center">Labour</div>
                <div className="col8_ls d-flex justify-content-center align-items-center">Total</div>
            </div>
            {/* table body */}
            <div>
            <div className="d-flex border border-top-0 fs_ls lh_ls">
                      <div className="col_1_ls border-end d-flex justify-content-center align-items-center">1</div>
                      <div className="col_2_ls border-end d-flex justify-content-start align-items-center ps-1 p-1" style={{wordBreak:'break-word'}}>Diamond Studed Jewellery</div>
                      <div className="col_3_ls border-end d-flex justify-content-start align-items-center ps-1" style={{wordBreak:'break-word'}}>{qualityTypes}</div>
                      <div className="col_4_ls border-end d-flex justify-content-end align-items-center pe-1">{result?.mainTotal?.netwtWithLossWt?.toFixed(3)}</div>
                      <div className="col_5_ls border-end d-flex justify-content-end align-items-center pe-1">	</div>
                      <div className="col_6_ls border-end d-flex justify-content-end align-items-center pe-1">{result?.mainTotal?.diamonds?.Wt?.toFixed(3)}</div>
                      <div className="col_7_ls border-end d-flex justify-content-end align-items-center pe-1"></div>
                      <div className="col_8_ls border-end d-flex justify-content-end align-items-center pe-1">{result?.mainTotal?.colorstone?.Wt?.toFixed(3)}	</div>
                      <div className="col_9_ls border-end d-flex justify-content-end align-items-center pe-1">{formatAmount(result?.mainTotal?.total_otherCharge_Diamond_Handling)}</div>
                      <div className="col_10_ls border-end d-flex justify-content-end align-items-center pe-1">{formatAmount(result?.mainTotal?.total_MakingAmount_Setting_Amount)}	</div>
                      <div className="col_11_ls d-flex justify-content-end align-items-center pe-1">{formatAmount(result?.mainTotal?.total_amount)}</div>
                    </div>
              {
                result?.resultArray?.map((e, i) => {
                  return(
                    <div className="d-flex border border-top-0 fs_ls" key={i} style={{height:'2rem'}}>
                      <div className="col_1_ls border-end d-flex justify-content-center align-items-center"></div>
                      <div className="col_2_ls border-end d-flex justify-content-start align-items-center ps-1" style={{wordBreak:'break-word'}}></div>
                      <div className="col_3_ls border-end d-flex justify-content-start align-items-center ps-1" style={{wordBreak:'break-word'}}></div>
                      <div className="col_4_ls border-end d-flex justify-content-end align-items-center pe-1"></div>
                      <div className="col_5_ls border-end d-flex justify-content-end align-items-center pe-1">	</div>
                      <div className="col_6_ls border-end d-flex justify-content-end align-items-center pe-1"></div>
                      <div className="col_7_ls border-end d-flex justify-content-end align-items-center pe-1">	</div>
                      <div className="col_8_ls border-end d-flex justify-content-end align-items-center pe-1">	</div>
                      <div className="col_9_ls border-end d-flex justify-content-end align-items-center pe-1">	</div>
                      <div className="col_10_ls border-end d-flex justify-content-end align-items-center pe-1">	</div>
                      <div className="col_11_ls d-flex justify-content-end align-items-center pe-1"></div>
                    </div>        
                  )
                })
              }
              {/* table total */}
              <div className="d-flex border border-top-0 fw-bold fs_ls lh_ls" style={{height:'2rem'}}>
                  <div className="col_1_ls border-end d-flex justify-content-center align-items-center"></div>
                  <div className="col_2_ls border-end d-flex justify-content-center align-items-center">TOTAL</div>
                  <div className="col_3_ls border-end d-flex justify-content-center align-items-center"></div>
                  <div className="col_4_ls border-end d-flex justify-content-end align-items-center pe-1">{result?.mainTotal?.netwtWithLossWt?.toFixed(3)}</div>
                  <div className="col_5_ls border-end d-flex justify-content-center align-items-center"></div>
                  <div className="col_6_ls border-end d-flex justify-content-end align-items-center pe-1">{result?.mainTotal?.diamonds?.Wt?.toFixed(3)}</div>
                  <div className="col_7_ls border-end d-flex justify-content-center align-items-center"></div>
                  <div className="col_8_ls border-end d-flex justify-content-end align-items-center pe-1">{result?.mainTotal?.colorstone?.Wt?.toFixed(3)}</div>
                  <div className="col_9_ls border-end d-flex justify-content-end align-items-center pe-1">{formatAmount(result?.mainTotal?.total_otherCharge_Diamond_Handling)}	</div>
                  <div className="col_10_ls border-end d-flex justify-content-end align-items-center pe-1">{formatAmount(result?.mainTotal?.total_MakingAmount_Setting_Amount)}	</div>
                  <div className="col_11_ls d-flex justify-content-end align-items-center pe-1">{formatAmount(result?.mainTotal?.total_amount)}</div>
              </div>
            </div>
            {/* tax total */}
            <div className="d-flex justify-content-end align-items-start fs_ls">
              <div className="w-100 d-flex">
                <div className="tax_w_ls d-flex justify-content-end align-items-start border border-top-0 border-end-0 flex-column ps-1">
                  <div>In Words Indian Rupees</div>
                  <div className="fw-bold">{numberToWord(result?.finalAmount)} Only/-</div>
                </div>
                <div className="tax_w_ls2">
                  {
                    result?.allTaxes?.map((el, ind) => {
                      return(
                        <div className="d-flex border-end border-start" key={ind}>
                            <div className="w-50 border-end d-flex justify-content-end align-items-start pe-1">{el?.name} @ {el?.per}</div>
                            <div className="w-50 d-flex justify-content-end align-items-start pe-1">{el?.amount}</div>
                        </div>
                      )
                    })
                  }
                  <div className="d-flex border-end border-start border-bottom">
                    <div className="w-50 border-end d-flex justify-content-end align-items-start pe-1">{result?.header?.AddLess > 0 ? 'Add' : 'Less'}</div>
                    <div className="w-50 d-flex justify-content-end align-items-start pe-1">{result?.header?.AddLess}</div>
                  </div>
                  <div className="d-flex fw-bold border border-top-0">
                    <div className="w-50 border-end d-flex justify-content-end align-items-start pe-1">GRAND TOTAL</div>
                    <div className="w-50 d-flex justify-content-end align-items-start pe-1">{formatAmount(result?.finalAmount)}</div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        {/* Declaration */}
        <div className="border border-top-0 border-bottom-0 p-1" dangerouslySetInnerHTML={{__html:result?.header?.Declaration}}></div>
        {/* footer */}
        <div>{footer}</div>
      </div> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">{msg}</p>
      }
      </>
    }
      
    </>
  );
};

export default LabourSummary;
