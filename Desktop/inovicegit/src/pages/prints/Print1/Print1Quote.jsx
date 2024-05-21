import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { apiCall, formatAmount, handleImageError, isObjectEmpty } from '../../../GlobalFunctions';
import { OrganizeDataPrint } from '../../../GlobalFunctions/OrganizeDataPrint';
import Loader from '../../../components/Loader';
import "../../../assets/css/prints/print1.css"

const Print1Quote = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
    const [result, setResult] = useState(null);
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const [imgFlag, setImgFlag] = useState(true);
    const [summary, setsummary_details] = useState([]);

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
                console.log(error);
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

        setResult(datas);
    }

    const handleImgShow = (e) => {
        if (imgFlag) setImgFlag(false);
        else {
            setImgFlag(true);
        }
    };

    useEffect(() => {
        if (result === null) {

        }
        else {
            let summary_details = []
            result.json1.map((v, i) => {
                summary_details.push({
                    "Categoryname": v.Categoryname,
                    "Categoryname_value": 1,
                })
            })

            var mergedObj = {};

            summary_details.forEach(function (obj) {
                var key = obj.Categoryname;
                if (mergedObj.hasOwnProperty(key)) {
                    mergedObj[key].Categoryname_value += obj.Categoryname_value;
                } else {
                    mergedObj[key] = {
                        "Categoryname": obj.Categoryname,
                        "Categoryname_value": obj.Categoryname_value,
                    };
                }
            });

            setsummary_details(Object.values(mergedObj));
        }
    }, [result])

    const handlePrintwithprice = () => {
        window.print();
    };

    const handlePrintwithoutprice = () => {
        window.print();
    };

    return (
        <>
            {loader ? <Loader /> : msg === '' ? <div><div className='container_qp1'>
                <div className='d_flex_qp1 flex_direction_colum_qp1'>
                    <div className='d_flex_qp1'>
                        <div className='printbtn_qp1 print_btn_qp1' onClick={handlePrintwithoutprice}>Print WithOut Price</div>
                        <div className='printbtn2_qp1 print_btn_qp1' onClick={handlePrintwithprice}>Print With Price</div>
                    </div>
                    <div className='d_flex_qp1'>
                        <div>Quotation# :</div>
                        <div className='quoteno_qp1 font_bold_qp1'>{result?.header?.InvoiceNo?.toUpperCase()}</div>
                        <div>Customer :</div>
                        <div className='quoteno_qp1 font_bold_qp1'>{result?.header?.CustName}</div>
                    </div>
                    <div>
                        {result?.resultArray?.map((res, i) => {
                            return (
                                <div className='main_div_qp1' key={i}>
                                    <div className='itemdiv_qp1 b_t_qp1'>
                                        <div className='text_center_qp1'><img
                                            src={res?.DesignImage}
                                            onError={(e) => handleImageError(e)}
                                            alt="design"
                                            className="imgdp10 i_qp1"
                                            width={"100%"}
                                            height="100%"
                                        />
                                        </div>
                                        <div className='d_flex_qp1 justify_between_qp1'>
                                            <div>Sr.No.{res?.SrNo}</div>
                                            <div>{res?.designno}</div>
                                        </div>
                                        <div className='d_flex_qp1 font_bold_qp1 main_width_qp1 text_center_qp1'>
                                            <div className='child1_w_qp1'></div>
                                            <div className='child2_w_qp1'>Wt</div>
                                            <div className='child3_w_qp1 text_end_qp1'>Amount</div>
                                        </div>
                                        <div>
                                            <div className='d_flex_qp1 text_end_qp1'>
                                                <div className='child1_w_qp1 text_start_qp1'>{res?.MetalType} {res?.MetalPurity} {res?.MetalColor}</div>
                                                <div className='child2_w_qp1'>{res?.MetalWeight?.toFixed(3)}</div>
                                                <div className='child3_w_qp1'>{formatAmount(res?.MetalAmount)}</div>
                                            </div>
                                            <div className='d_flex_qp1 text_end_qp1'>
                                                <div className='child1_w_qp1 text_start_qp1'>Diamond</div>
                                                <div className='child2_w_qp1'>{res.totals?.diamonds?.Wt?.toFixed(3)}</div>
                                                <div className='child3_w_qp1'>{formatAmount(res?.totals?.diamonds?.Amount)}</div>
                                            </div>
                                            <div className='d_flex_qp1 text_end_qp1'>
                                                <div className='child1_w_qp1 text_start_qp1'>Color Stone</div>
                                                <div className='child2_w_qp1'>{res.totals?.colorstone?.Wt?.toFixed(3)}</div>
                                                <div className='child3_w_qp1'>{formatAmount(res?.totals?.colorstone?.Amount)}</div>
                                            </div>
                                            <div className='d_flex_qp1 text_end_qp1'>
                                                <div className='child1_w_qp1 text_start_qp1'>Labour</div>
                                                <div className='child2_w_qp1'></div>
                                                <div className='child3_w_qp1'>{formatAmount(res?.MakingAmount)}</div>
                                            </div>
                                            <div className='d_flex_qp1 text_end_qp1'>
                                                <div className='child1_w_qp1 text_start_qp1'>Other</div>
                                                <div className='child2_w_qp1'></div>
                                                <div className='child3_w_qp1'>{formatAmount(res?.OtherCharges)}</div>
                                            </div>
                                            <div className='d_flex_qp1 text_end_qp1'>
                                                <div className='child1_w_qp1 text_start_qp1'>Total</div>
                                                <div className='child2_w_qp1'></div>
                                                <div className='child3_w_qp1'>{formatAmount(res?.TotalAmount)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                    <div className='d_flex_qp1 '>
                        <div className='d_flex_qp1 summary_w_qp1'>
                            <div className='d_flex_qp1 summary2_w_qp1 br_black_qp1 br_right_remove_qp1'>
                                <div className='fix_bottom_qp1'>
                                    <div>
                                        <div className='background_qp1 font_bold_qp1 text_center_qp1 br_bottom_qp1'>SUMMARY</div>
                                        <div className='d_flex_qp1'>
                                            <div className='d_flex_qp1 summary3_w_qp1 justify_between_qp1 br_right_qp1'>
                                                <div className='padding_left_qp1 font_bold_qp1'>
                                                    <p>GOLD IN 24KT</p>
                                                    <p>GROSS WT</p>
                                                    <p>*(G+D) WT</p>
                                                    <p>NET WT</p>
                                                    <p>DIAMOND WT</p>
                                                    <p>STONE WT</p>
                                                </div>
                                                <div className='padding_right_qp1 text_end_qp1'>
                                                    <p>{result?.mainTotal?.total_purenetwt.toFixed(3)}</p>
                                                    <p>{result?.mainTotal?.grosswt.toFixed(3)}</p>
                                                    <p>{((result?.mainTotal?.diamonds?.Wt / 5) + result?.mainTotal?.netwt)?.toFixed(3)}</p>
                                                    <p>{result?.mainTotal?.netwt.toFixed(3)}</p>
                                                    <p>{result?.mainTotal?.diamonds?.Pcs} / {result?.mainTotal?.diamonds?.Wt.toFixed(3)}</p>
                                                    <p>{result?.mainTotal?.colorstone?.Pcs} / {result?.mainTotal?.colorstone?.Wt.toFixed(3)}</p>
                                                </div>
                                            </div>
                                            <div className='d_flex_qp1 summary4_w_qp1 justify_between_qp1'>
                                                <div className='padding_left_qp1 font_bold_qp1'>
                                                    <p>GOLD</p>
                                                    <p>DIAMOND</p>
                                                    <p>CST</p>
                                                    <p>MAKING</p>
                                                    <p>OTHER</p>
                                                    <p>{result?.header?.AddLess >= 0 ? "Add" : "Less"}</p>
                                                </div>
                                                <div className='padding_right_qp1 text_end_qp1'>
                                                    <p>{formatAmount(result?.mainTotal?.MetalAmount)}</p>
                                                    <p>{formatAmount(result?.mainTotal?.diamonds?.Amount)}</p>
                                                    <p>{formatAmount(result?.mainTotal?.colorstone?.Amount)}</p>
                                                    <p>{formatAmount(result?.mainTotal?.total_labour?.labour_amount)}</p>
                                                    <p>{formatAmount(result?.mainTotal?.total_other_charges)}</p>
                                                    <p>{formatAmount(result?.header?.AddLess)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='d_flex_qp1 justify_between_qp1 background_qp1 br_top_qp1'>
                                            <div className='summary3_w_qp1'>
                                                <div></div>
                                                <div></div>
                                            </div>
                                            <div className='d_flex_qp1 summary4_w_qp1 justify_between_qp1 br_left_qp1'>
                                                <div className='padding_left_qp1 font_bold_qp1'>TOTAL</div>
                                                <div className='padding_right_qp1'>{formatAmount(result?.mainTotal?.MetalAmount + result?.mainTotal?.diamonds?.Amount + result?.mainTotal?.colorstone?.Amount + result?.mainTotal?.total_labour?.labour_amount + result?.mainTotal?.total_other_charges + result?.header?.AddLess)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='summary2_w_qp1 d_flex_qp1'>
                                <div className='summary3_w_qp1 br_black_qp1 br_right_remove_qp1'>
                                    <div className='background_qp1 font_bold_qp1 text_center_qp1'>SUMMARY</div>
                                    <div className='d_flex_qp1 justify_between_qp1 br_all_qp1'>
                                        <div className='padding_left_qp1 font_bold_qp1'>
                                            {summary.map((v, i) => {
                                                return (
                                                    <p key={i}>{v.Categoryname}</p>
                                                )
                                            })}
                                        </div>
                                        <div className='padding_right_qp1 text_end_qp1'>
                                            {summary.map((v, i) => {
                                                return (
                                                    <p key={i}>{v.Categoryname_value}</p>
                                                )
                                            })}
                                        </div>

                                    </div>
                                    <div>
                                        <div></div>
                                    </div>
                                </div>
                                <div className='d_flex_qp1 summary_check_qp1 br_black_qp1 check_w_qp1'>
                                    <div className='padding_bottom_qp1'>
                                        Checked By
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div></div> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto"> {msg} </p>}
        </>
    )
}

export default Print1Quote