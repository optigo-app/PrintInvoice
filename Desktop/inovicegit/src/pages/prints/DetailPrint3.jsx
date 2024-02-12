import React, { useEffect, useState } from "react";
import "../../assets/css/prints/detailprint3.css";
import { apiCall, formatAmount, handleImageError, handlePrint, isObjectEmpty } from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
const DetailPrint3 = ({ token, invoiceNo, printName, urls, evn }) => {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [imgFlag, setImgFlag] = useState(true);
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
    
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
      data.BillPrint_Json[0].address = address;
 
      const datas = OrganizeDataPrint(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );
      // console.log(datas);
      setResult(datas);
      setLoader(false);
  }
  const handleImgShow = (e) => {
    if (imgFlag) setImgFlag(false);
    else {
      setImgFlag(true);
    }
  };

  return (
    <>
    {
      loader ? <Loader /> : <>
      {
        msg === '' ? <>
        <div className="containerdp3">
      {/* print pop up and img show */}
      <div className="d-flex justify-content-end align-items-center user-select-none printHide_dp3">
        <div className="mb-3 me-2 justify-content-center align-items-center">
          <input type="checkbox" className="me-2" value={imgFlag} checked={imgFlag} onChange={(e) => handleImgShow(e)} id="imgshowdp3" />
          <label htmlFor="imgshowdp3"> With Image </label>
        </div>
        <div className="mb-3"><button className="btn_white blue py-1" onClick={(e) => handlePrint(e)}>Print</button></div>
      </div>
      {/* header */}
      <div>
        <div className="headlabeldp3 fw-bold">{result?.header?.PrintHeadLabel}</div>
        <div className="d-flex justify-content-between align-items-center fs_dp3">
          <div className="w-25">
            <div className="ps-2">To,</div>
            <div className="fw-bold ps-2">{result?.header?.Customercode}</div>
          </div>
          <div className="w-25">
            <div className="d-flex w-100">
              <div className="w-50 end_dp3">Invoice#&nbsp;&nbsp;&nbsp;:</div>
              <div className="fw-bold w-50 start_dp3">{result?.header?.InvoiceNo}</div>
            </div>
            <div className="d-flex w-100">
              <div className="w-50 end_dp3">Date&nbsp;&nbsp;&nbsp;:</div>
              <div className="fw-bold w-50 start_dp3">{result?.header?.EntryDate}</div>
            </div>
            <div className="d-flex w-100">
              <div className="w-50 end_dp3">{result?.header?.HSN_No_Label}&nbsp;&nbsp;&nbsp;:</div>
              <div className="fw-bold w-50 start_dp3">{result?.header?.HSN_No}</div>
            </div>
          </div>
        </div>
      </div>
      {/* table */}
      <div>
        {/* table head */}
        <div className="d-flex theaddp3 fw-bold fs_dp3">
          <div className="col1_dp3 border-secondary border-end center_dp3">
            Sr
          </div>
          <div className="col2_dp3 border-secondary border-end center_dp3">
            Design
          </div>
          <div className="col3_dp3 border-secondary border-end">
            <div className="w-100 center_dp3 h-50">Diamond</div>
            <div className="d-flex w-100 border-secondary border-top h-50">
              <div className="center_dp3 col_w_dp3 border-secondary border-end">
                Code
              </div>
              <div className="center_dp3 col_w_dp3 border-secondary border-end">
                Wt
              </div>
              <div className="center_dp3 col_w_dp3">Amount</div>
            </div>
          </div>
          <div className="col4_dp3 border-secondary border-end">
            <div className="center_dp3 h-50 w-100">Metal</div>
            <div className="d-flex h-50 w-100 border-secondary border-top">
              <div className="center_dp3 w-25 border-secondary border-end">
                Quality
              </div>
              <div className="center_dp3 w-25 border-secondary border-end">
                Wt(M+D)
              </div>
              <div className="center_dp3 w-25 border-secondary border-end">
                N+L
              </div>
              <div className="center_dp3 w-25">Amount</div>
            </div>
          </div>
          <div className="col5_dp3 border-secondary border-end">
            <div className="w-100 center_dp3 h-50">Stone</div>
            <div className="d-flex w-100 border-secondary border-top h-50">
              <div className="center_dp3 col_w_dp3 border-secondary border-end">
                Code
              </div>
              <div className="center_dp3 col_w_dp3 border-secondary border-end">
                Wt
              </div>
              <div className="center_dp3 col_w_dp3">Amount</div>
            </div>
          </div>
          <div className="col6_dp3 border-secondary border-end center_dp3">
            Other
          </div>
          <div className="col7_dp3 border-secondary border-end">
            <div className="h-50 center_dp3 w-100">Labour</div>
            <div className="d-flex w-100 border-secondary border-top h-50">
              <div className="w-100 border-secondary border-end center_dp3">
                Rate
              </div>
              <div className="w-100 center_dp3">Amount</div>
            </div>
          </div>
          <div className="col8_dp3 center_dp3">Total Amount</div>
        </div>
        {/* table body */}
        <div>
          {
            result?.resultArray?.map((e, i) => {
              return(
                <div className="fs_dp3" key={i}>
                <div className="d-flex border-secondary border-start border-end border-bottom w-100">
                  <div className="col1_dp3 border-secondary border-end center_top_dp3">
                    {i + 1}
                  </div>
                  <div className="col2_dp3 border-secondary border-end">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>{e?.designno}</div>
                      <div>{e?.SrJobno}</div>
                    </div>
                    {
                      imgFlag ? <div className="center_dp3">
                      <img src={e?.DesignImage} alt="#designimg" onError={(e) => handleImageError(e)} className="designimg_dp3" />
                    </div> : ''
                    }
                   { e?.HUID === '' ? '' : <div className="center_dp3">HUID: {e?.HUID}</div> } 
                  </div>
                  <div className="col3_dp3 border-secondary border-end">
                    <div>
                      {
                        e?.diamonds?.map((el, ind) => {
                          return(
                                  <div className="d-flex" key={ind}>
                                      <div className="col_w_dp3 start_dp3">{el?.QualityName}</div>
                                      <div className="col_w_dp3 end_dp3">{el?.Wt?.toFixed(3)}</div>
                                      <div className="col_w_dp3 end_dp3">{formatAmount(el?.Amount)}</div>
                                  </div>  
                                )
                        })
                      }
                    
                    </div>
                  </div>
                  <div className="col4_dp3 border-secondary border-end">
                    <div>
                    {
                      e?.metal?.map((el, ind) => {
                        return(
                      <div className="d-flex border-secondary border-bottom" key={ind}>
                        <div className="w-25 start_dp3">{e?.MetalTypePurity}</div>
                        <div className="w-25 end_dp3">{e?.grosswt?.toFixed(3)}</div>
                        <div className="w-25 end_dp3">{(e?.NetWt + e?.LossWt)?.toFixed(3)}</div>
                        <div className="w-25 end_dp3 fw-bold">{formatAmount(el?.Amount)}</div>
                      </div>
                        )
                      })
                    }
                    </div>
                  </div>
                  <div className="col5_dp3 border-secondary border-end">
                    <div>
                      {
                        e?.colorstone?.map((el, ind) => {
                          return(
                            <div className="d-flex" key={ind}>
                              <div className="col_w_dp3 start_dp3">{el?.QualityName}</div>
                              <div className="col_w_dp3 end_dp3">{el?.Wt?.toFixed(3)}</div>
                              <div className="col_w_dp3 end_dp3">{formatAmount(el?.Amount)}</div>
                            </div>
                          )
                        })
                      }
                    
                    </div>
                  </div>
                  <div className="col6_dp3 border-secondary border-end end_top_dp3">{formatAmount(e?.OtherCharges + e?.TotalDiamondHandling + e?.MiscAmount)}</div>
                  <div className="col7_dp3 border-secondary border-end">
                    <div className="d-flex"><div className="w-50 end_top_dp3">{formatAmount(e?.MaKingCharge_Unit)}</div>
                    <div className="w-50 end_top_dp3">{formatAmount(e?.totals?.makingAmount_settingAmount)}</div></div>
                  </div>
                  <div className="col8_dp3 end_top_dp3">{formatAmount(e?.TotalAmount)}</div>
                </div>
                {/* table row wise total */}
                <div className="d-flex border-secondary border-start border-end border-bottom w-100 bgc_dp3 fw-bold">
                  <div className="col1_dp3 border-secondary border-end center_top_dp3">
                    
                  </div>
                  <div className="col2_dp3 border-secondary border-end"><div className="fw-bold center_dp3">
                      {e?.grosswt?.toFixed(3)} gm Gross
                    </div>
                  </div>
                  <div className="col3_dp3 border-secondary border-end">
                    <div>
                    <div className="d-flex">
                      <div className="col_w_dp3 start_dp3"></div>
                      <div className="col_w_dp3 end_dp3">{e?.totals?.diamonds?.Wt?.toFixed(3)}</div>
                      <div className="col_w_dp3 end_dp3">{formatAmount(e?.totals?.diamonds?.Amount)}</div>
                    </div>
                    </div>
                  </div>
                  <div className="col4_dp3 border-secondary border-end">
                    <div>
                      <div className="d-flex">
                        <div className="w-25 start_dp3"></div>
                        <div className="w-25 end_dp3">{e?.totals?.metal?.Wt?.toFixed(3)}</div>
                        <div className="w-25 end_dp3">{e?.totals?.metal?.Wt?.toFixed(3)}</div>
                        <div className="w-25 end_dp3">{formatAmount(e?.totals?.metal?.Amount)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col5_dp3 border-secondary border-end">
                    <div>
                    <div className="d-flex">
                      <div className="col_w_dp3 start_dp3"></div>
                      <div className="col_w_dp3 end_dp3">{e?.totals?.colorstone?.Wt?.toFixed(3)}</div>
                      <div className="col_w_dp3 end_dp3">{formatAmount(e?.totals?.colorstone?.Amount)}</div>
                    </div>
                    </div>
                  </div>
                  <div className="col6_dp3 border-secondary border-end end_top_dp3">{formatAmount((e?.OtherCharges + e?.TotalDiamondHandling + e?.MiscAmount))}</div>
                  <div className="col7_dp3 border-secondary border-end">
                    <div className="d-flex"><div className="w-50 end_top_dp3"></div>
                    <div className="w-50 end_top_dp3">{formatAmount(e?.totals?.makingAmount_settingAmount)}</div></div>
                  </div>
                  <div className="col8_dp3 end_top_dp3">{formatAmount(e?.TotalAmount)}</div>
                </div>
              </div>        
              )
            })
          }
        
        </div>
        {/* tax total */}
        <div className="d-flex justify-content-end align-items-start border border-top-0 border-secondary fs_dp3">
          <div style={{width:'15%'}}>
            {
              result?.allTaxes
              ?.map((el, ind) => {
                return(
                    <div className="d-flex" key={ind}>
                      <div className="w-50 end_top_dp3">{el?.name + " @ " + el?.per}</div>
                      <div className="w-50 end_top_dp3">{el?.amount}</div>
                    </div>
                )
              })
            }
                    <div className="d-flex">
                      <div className="w-50 end_top_dp3">Add/Less</div>
                      <div className="w-50 end_top_dp3">{result?.header?.AddLess}</div>
                    </div>
          </div>
        </div>
        {/* table total */}
        <div className="d-flex border-secondary border-start border-end border-bottom w-100 fs_dp3 fw-bold bgc_dp3">
            <div className="col1_dp3 border-secondary border-end center_top_dp3">
              
            </div>
            <div className="col2_dp3 border-secondary border-end center_dp3 fw-bold">
              TOTAL
            </div>
            <div className="col3_dp3 border-secondary border-end">
              <div>
              <div className="d-flex">
                <div className="col_w_dp3 start_dp3"></div>
                <div className="col_w_dp3 end_dp3">{result?.mainTotal?.diamonds?.Wt?.toFixed(3)}</div>
                <div className="col_w_dp3 end_dp3">{formatAmount(result?.mainTotal?.diamonds?.Amount)}</div>
              </div>
              </div>
            </div>
            <div className="col4_dp3 border-secondary border-end">
              <div>
                <div className="d-flex">
                  <div className="w-25 start_dp3"></div>
                  <div className="w-25 end_dp3">{result?.mainTotal?.netwt?.toFixed(3)}</div>
                  <div className="w-25 end_dp3">{result?.mainTotal?.metal?.Wt?.toFixed(3)}</div>
                  <div className="w-25 end_dp3">{formatAmount(result?.mainTotal?.metal?.Amount)}</div>
                </div>
              </div>
            </div>
            <div className="col5_dp3 border-secondary border-end">
              <div>
              <div className="d-flex">
                <div className="col_w_dp3 start_dp3"></div>
                <div className="col_w_dp3 end_dp3">{result?.mainTotal?.colorstone?.Wt?.toFixed(3)}</div>
                <div className="col_w_dp3 end_dp3">{formatAmount(result?.mainTotal?.colorstone?.Amount)}</div>
              </div>
              </div>
            </div>
            <div className="col6_dp3 border-secondary border-end end_top_dp3">{formatAmount(result?.mainTotal?.total_otherCharge_Diamond_Handling)}</div>
            <div className="col7_dp3 border-secondary border-end">
              <div className="d-flex"><div className="w-50 end_top_dp3"></div>
              <div className="w-50 end_top_dp3">{formatAmount(result?.mainTotal?.total_MakingAmount_Setting_Amount)}</div></div>
            </div>
            <div className="col8_dp3 end_top_dp3">{formatAmount((result?.finalAmount))}</div>
          </div>
      </div>
      {/* summary & footer */}
      <div className="d-flex justify-content-between align-items-start fs_dp3 border-bottom">
        <div className="d-flex" style={{width:'50%'}}>
          <div className="border-bottom border-secondary" style={{width:'65%'}}>
            <div className="summary_dp3_head border-secondary border border-top-0 fw-bold">SUMMARY</div>
            <div className="d-flex w-100">
              <div className="w-50">
                <div className="d-flex justify-content-between"><div className="border-secondary border-start pad_s_dp3 fw-bold">GOLD IN 24KT</div><div className="border-secondary border-end pad_e_dp3">cts</div></div>
                <div className="d-flex justify-content-between"><div className="border-secondary border-start pad_s_dp3 fw-bold">GROSS WT</div><div className="border-secondary border-end pad_e_dp3">{result?.mainTotal?.grosswt?.toFixed(3)} cts</div></div>
                <div className="d-flex justify-content-between"><div className="border-secondary border-start pad_s_dp3 fw-bold">G+D WT</div><div className="border-secondary border-end pad_e_dp3">cts</div></div>
                <div className="d-flex justify-content-between"><div className="border-secondary border-start pad_s_dp3 fw-bold">NET WT</div><div className="border-secondary border-end pad_e_dp3">{result?.mainTotal?.netwt?.toFixed(3)} cts</div></div>
                <div className="d-flex justify-content-between"><div className="border-secondary border-start pad_s_dp3 fw-bold">DIAMOND WT</div><div className="border-secondary border-end pad_e_dp3">{result?.mainTotal?.diamonds?.Wt?.toFixed(3)} cts</div></div>
                <div className="d-flex justify-content-between"><div className="border-secondary border-start pad_s_dp3 fw-bold">STONE WT</div><div className="border-secondary border-end pad_e_dp3"> {result?.mainTotal?.colorstone?.Wt?.toFixed(3)} cts</div></div>
                <div className="summary_dp3_head border-secondary border border-start border-bottom-0"></div>
              </div>
              <div className="w-50">
                <div className="d-flex justify-content-between"><div className="pad_s_dp3 fw-bold">GOLD</div><div className="border-secondary border-end pad_e_dp3">{formatAmount(result?.mainTotal?.MetalAmount)}</div></div>
                <div className="d-flex justify-content-between"><div className="pad_s_dp3 fw-bold">DIAMOND</div><div className="border-secondary border-end pad_e_dp3">{formatAmount(result?.mainTotal?.diamonds?.Amount)} </div></div>
                <div className="d-flex justify-content-between"><div className="pad_s_dp3 fw-bold">CST</div><div className="border-secondary border-end pad_e_dp3">{formatAmount(result?.mainTotal?.colorstone?.Amount)}</div></div>
                <div className="d-flex justify-content-between"><div className="pad_s_dp3 fw-bold">MAKING</div><div className="border-secondary border-end pad_e_dp3">{formatAmount(result?.mainTotal?.total_MakingAmount_Setting_Amount)}</div></div>
                <div className="d-flex justify-content-between"><div className="pad_s_dp3 fw-bold">OTHER</div><div className="border-secondary border-end pad_e_dp3">{formatAmount(result?.mainTotal?.total_otherCharge_Diamond_Handling)}</div></div>
                <div className="d-flex justify-content-between"><div className="pad_s_dp3 fw-bold">ADD/LESS</div><div className="border-secondary border-end pad_e_dp3">{result?.header?.AddLesss}</div></div>
                <div className="d-flex justify-content-between  border-secondary border border-bottom-0 border-start-0 bgc_dp3">
                  <div className="pad_s_dp3 fw-bold">TOTAL</div>
                  <div className="pad_e_dp3">{formatAmount(result?.finalAmount)}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="" style={{width:'35%'}}>
            <div className="summary_dp3_head border-secondary border border-start-0 border-top-0 fw-bold">Remark</div>
            <div className="border-secondary border-bottom border-end pad_s_dp3">{result?.header?.PrintRemark}</div>
          </div>
        </div>
        <div className="check_dp3 border-secondary border border-bottom d-flex justify-content-center align-items-end border-top-0" style={{width:'15%'}}>
          Checked By
        </div>
      </div>
      <div className="text-secondary printHide_dp3">**   THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF TRANSACTIONS</div>
        </div>
        </> : 
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
          {msg}
        </p>
      }
      </>
    }
    </>
  );
};

export default DetailPrint3;
