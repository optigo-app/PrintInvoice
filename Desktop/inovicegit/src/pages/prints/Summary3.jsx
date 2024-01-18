import React, { useEffect, useState } from "react";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { apiCall, formatAmount, handlePrint, isObjectEmpty } from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import "../../assets/css/prints/summary3.css";

const Summary3 = ({ urls, token, invoiceNo, printName, evn }) => {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [classIs, setClassIs] = useState({
    col1:'col1s3',
    col2:'col2s3',
    col3:'col3s3',
    col4:'col4s3',
    col5:'col5s3',
    col6:'col6s3',
    col7:'col7s3',
    col8:'col8s3',
    col9:'col9s3',
    col10:'col10s3',
    col11:'col11s3',
  })

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

  function loadData(data) {
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;
    const datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );
    setResult(datas);
  }
  useEffect(() => {
    let print_name = atob(printName);
    if (print_name === "summary 3") {
      setClassIs({
        col1:'col1s3',
        col2:'col2s3',
        col3:'col3s3',
        col4:'col4s3',
        col5:'col5s3',
        col6:'col6s3',
        col7:'col7s3',
        col8:'col8s3',
        col9:'col9s3',
        col10:'col10s3',
        col11:'col11s3',
      });
    }
    if (print_name === "summary 3 misc") {
      setClassIs({
        col1:'col1s3m',
        col2:'col2s3m',
        col3:'col3s3m',
        col4:'col4s3m',
        col5:'col5s3m',
        col6:'col6s3m',
        col7:'col7s3m',
        col8:'col8s3m',
        col9:'col9s3m',
        col10:'col10s3m',
        col11:'col11s3m',
      });
    }
  }, [printName]);

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="containers3 fsgs3">
                <div className="btn_print_s3"><button
                      className="btn_white blue m-0 mx-2 p-1 "
                      onClick={(e) => handlePrint(e)}
                    >
                      Print
                    </button></div>
                <div className="headtexts3">ESTIMATE</div>
                <div className="d-flex mt-4 justify-content-between w-100 align-items-center px-3">
                  <div className="fsgs3">
                    Name : <b className="fsgs3">Dar Be Gold Jewelers</b>
                  </div>
                  <div className="fsgs3">
                    Invoice No : <b className="fsgs3">SK17382022</b>
                  </div>
                  <div className="fsgs3">
                    Date : <b className="fsgs3">03 Jan 2024</b>
                  </div>
                </div>
                {/* table */}
                <div className="mt-3 tables3 fsgs3">
                  {/* table head */}
                  <div className="theads3 border border-black">
                    <div className={`${classIs.col1} centers3 border-end border-black h-100`}>Category</div>
                    <div className={`${classIs.col2} centers3 border-end border-black h-100`}>Pcs</div>
                    <div className={`${classIs.col3} centers3 border-end border-black h-100`}>Gross</div>
                    <div className={`${classIs.col4} centers3 border-end border-black h-100`}>Net Wt</div>
                    <div className={`${classIs.col5} centers3 border-end border-black h-100`}>Purity %</div>
                    <div className={`${classIs.col6} centers3 border-end border-black h-100`}>Wastage</div>
                    <div className={`${classIs.col7} centers3 border-end border-black h-100`}>Stone (gm)</div>
                    <div className={`${classIs.col8} centers3 border-end border-black h-100`}> {  atob(printName) === "summary 3" ? 'Stone' : 'Stone (ctw)' } </div>
                    <div className={`${classIs.col9} centers3 border-end border-black h-100`}>Rate</div>
                    <div className="finalcols3 d-block h-100">
                        <div className="d-grid h-100">
                            <div className="d-flex justify-content-center border-black border-bottom">Final</div>
                            <div className="d-flex">
                                <div className="col-6 border-black border-end wfines3">Fine</div>
                                <div className="col-6 wcashs3">Cash</div>
                            </div>
                        </div>
                      
                    </div>
                  </div>
                  {/* table body */}
                  <div>
                    {
                        result?.resultArray?.map((e, i) => {
                            return(
                            <div className="tbodyrows3 border-start border-black border-bottom" key={i}>
                                <div className={`${classIs.col1} centers3 border-end border-black  lefts3 ps-1`}>{e?.Categoryname}</div>
                                <div className={`${classIs.col2} centers3 border-end border-black  rs3 pe-1`}>{e?.Quantity}</div>
                                <div className={`${classIs.col3} centers3 border-end border-black  rs3 pe-1`}>{e?.grosswt?.toFixed(3)}</div>
                                <div className={`${classIs.col4} centers3 border-end border-black  rs3 pe-1`}>{(e?.NetWt + e?.LossWt)?.toFixed(3)}</div>
                                <div className={`${classIs.col5} centers3 border-end border-black  rs3 pe-1`}>{e?.Tunch?.toFixed(3)} </div>
                                <div className={`${classIs.col6} centers3 border-end border-black  rs3 pe-1`}>{e?.Wastage?.toFixed(3)}</div>
                                <div className={`${classIs.col7} centers3 border-end border-black  rs3 pe-1`}>{((e?.totals?.colorstone?.Wt)/5)?.toFixed(3)}</div>
                                <div className={`${classIs.col8} centers3 border-end border-black  rs3 pe-1`}> {  atob(printName) === "summary 3" ? <>{e?.totals?.colorstone?.Wt?.toFixed(3)}</> : <>{e?.totals?.colorstone?.Wt?.toFixed(3)}</> } </div>
                                <div className={`${classIs.col9} centers3 border-end border-black  rs3 pe-1`}>{formatAmount(e?.totals?.metal?.Rate)}</div>
                                <div className={`${classIs.col10} centers3 border-end border-black  rs3 pe-1`}>{e?.convertednetwt?.toFixed(3)}</div>
                                <div className={`${classIs.col11} centers3 border-end border-black  rs3 pe-1`}>{formatAmount(e?.TotalAmount)}</div>      
                            </div>
                            )
                        })
                    }
                    </div>
                     {/* table total */}
                            <div className="d-flex border-black border-top-0 border-end-0 border fw-bold bgcs3 fsgs3">
                                <div className={`${classIs.col1} centers3 border-end border-black  lefts3 ps-1`}>TOTAL</div>
                                <div className={`${classIs.col2} centers3 border-end border-black  rs3 pe-1`}>{result?.mainTotal?.total_Quantity}</div>
                                <div className={`${classIs.col3} centers3 border-end border-black  rs3 pe-1`}>{result?.mainTotal?.grosswt?.toFixed(3)}</div>
                                <div className={`${classIs.col4} centers3 border-end border-black  rs3 pe-1`}>{result?.mainTotal?.netwtWithLossWt?.toFixed(3)}</div>
                                <div className={`${classIs.col5} centers3 border-end border-black `}> </div>
                                <div className={`${classIs.col6} centers3 border-end border-black   rs3 pe-1`}>{result?.mainTotal?.total_Wastage?.toFixed(3)}</div>
                                <div className={`${classIs.col7} centers3 border-end border-black  rs3 pe-1`}>Stone (gm)</div>
                                <div className={`${classIs.col8} centers3 border-end border-black  rs3 pe-1`}> {  atob(printName) === "summary 3" ? <>{result?.mainTotal?.colorstone?.Wt?.toFixed(3)}</> : <>{result?.mainTotal?.colorstone?.Wt?.toFixed(3)}</> } </div>
                                <div className={`${classIs.col9} centers3 border-end border-black  `}></div>
                                <div className={`${classIs.col10} centers3 border-end border-black   rs3 pe-1`}>{result?.mainTotal?.convertednetwt?.toFixed(3)}</div>
                                <div className={`${classIs.col11} centers3 border-end border-black  rs3 pe-1`}>{formatAmount(result?.mainTotal?.total_amount)}</div> 
                            </div>
                    </div>
                    <div className="w-100 border-black border border-top-0 border-bottom-0 fw-bold bgcs3 fsgs3">
                        {
                            result?.allTaxes?.map((e, i) => {
                                return(
                                    <div className="d-flex justify-content-between w-100 border-black border-bottom" key={i}>
                                        <div className="border-black border-end taxws3 px-1">{e?.name} @ {e?.per}</div><div className="taxwamts3 border-black border-start rs3 px-1">{e?.amount}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="fsgs3 w-100 d-flex justify-content-between align-items-center border-black border border-top-0 border-bottom fw-bold bgcs3 "><div className="taxws3 border-end border-black px-1">ADD / LESS</div><div className="taxwamts3 border-black border-start px-1 rs3">{result?.header?.AddLess}</div></div>
                    <div className="fsgs3 w-100 d-flex justify-content-between align-items-center border-black border border-top-0 border-bottom fw-bold bgcs3 "><div className="taxws3 border-end border-black px-1">GRAND TOTAL</div><div className="taxwamts3 border-black border-start px-1 rs3">{formatAmount(result?.finalAmount)}</div></div>
              </div>
            </>
          ) : (
            <p className="text-danger  fs-2 fw-bold mt-5 text-center w-50 mx-auto">
              {msg}
            </p>
          )}
        </>
      )}
    </>
  );
};

export default Summary3;
