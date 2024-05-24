import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { apiCall, formatAmount, handleImageError, isObjectEmpty } from '../../GlobalFunctions';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import Loader from '../../components/Loader';
import '../../assets/css/prints/summary4quote.css'

const Summary4Quote = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
    const [result, setResult] = useState(null);
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const [imgFlag, setImgFlag] = useState(true);

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





    // http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=UVQyNTcxNw==&evn=cXVvdGU=&pnm=c3VtbWFyeSA0&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvU2FsZUJpbGxfSnNvbg==&ifid=DetailPrint11&pid=undefined&ctv=NjU=

    return (
        <>
            {loader ? <Loader /> : msg === '' ?
                <div className='container_smp'>
                    <div>
                        {result?.header?.PrintHeadLabel === "" ? "" :
                            <h3 className='heading'>{result?.header?.PrintHeadLabel}</h3>
                        }
                        <div className='d_flex_smp justify_between_smp header_border_smp'>
                            <div className='font_13_5_smp'>
                                <p className="font_bold_smp font_20_smp">{result?.header?.CompanyFullName}</p>
                                <p>{result?.header?.CompanyAddress}</p>
                                <p>{result?.header?.CompanyAddress2}</p>
                                <p>{result?.header?.CompanyCity}-{result?.header.CompanyPinCode}, {result?.header?.CompanyState}({result?.header?.CompanyCountry})</p>
                                <p>T {result?.header?.CompanyTellNo} | TOLL FREE {result?.header?.CompanyTollFreeNo}</p>
                                <p>{result?.header?.CompanyEmail} | {result?.header?.CompanyWebsite}</p>
                                <p>{result?.header?.Company_VAT_GST_No} | {result?.header?.Company_CST_STATE}-{result?.header?.Company_CST_STATE_No} | PAN-{result?.header?.Com_pannumber}</p>
                                <p>CIN-{result?.header.CINNO} | MSME-{result?.header.MSME}</p>
                            </div>
                            <div>
                                <img height={"90px"} src={result?.header.PrintLogo}></img>
                            </div>
                        </div>
                    </div>
                    <div className='margin_10_smp'>
                        <div className='d_flex_smp justify_between_smp font_18_smp br_all_smp padding_all_smp'>
                            <div className='d_flex_smp'>
                                QUOTATION# :
                                <div className='font_bold_smp'>&nbsp;{result?.header?.InvoiceNo}</div>
                            </div>
                            <div className='d_flex_smp'>
                                DATE :
                                <div className='font_bold_smp'>&nbsp;{result?.header?.DueDate}</div>
                            </div>
                        </div>
                        <div className='br_all_smp'>
                            <div className='d_flex_smp justify_between_smp padding_all_smp'>
                                <div className=''>
                                    <p>Quote To,</p>
                                    <p className='font_14_smp font_bold_smp'>{result?.header?.customerfirmname}</p>
                                    <p>{result?.header?.customerAddress1}</p>
                                    <p>{result?.header?.customerAddress2}</p>
                                    <p>{result?.header?.customerAddress3}</p>
                                    <p>{result?.header?.customercity}{result?.header?.customerpincode}</p>
                                    <p>{result?.header?.customeremail1}</p>
                                    <p>STATE NAME : {result?.header?.State},{result?.header?.Cust_CST_STATE}-{result?.header?.Cust_CST_STATE_No}</p>
                                    <p>{result?.header?.vat_cst_pan}</p>
                                </div>
                                <div className='font_15_smp'>
                                    <div>Gold Rate:{result?.header?.MetalRate24K}</div>
                                </div>
                            </div>

                            <div className='d_flex_smp w_main_smp text_center_smp br_top_smp height_34_smp font_bold_smp font_wrap_smp'>
                                <div className='w_child1_smp pad_2_px br_right_smp'>SR#</div>
                                <div className='w_child2_smp pad_2_px br_right_smp'>DESIGN</div>
                                <div className='w_child3_smp pad_2_px br_right_smp'>Remark</div>
                                <div className='w_child4_smp pad_2_px br_right_smp'>DIA WT<div>(ctw)</div></div>
                                <div className='w_child5_smp pad_2_px br_right_smp'>DIA RATE</div>
                                <div className='w_child6_smp pad_2_px br_right_smp'>DIA AMT</div>
                                <div className='w_child7_smp pad_2_px br_right_smp'>G WT<div>(gm)</div></div>
                                <div className='w_child8_smp pad_2_px br_right_smp'>NWT<div>(gm)</div></div>
                                <div className='w_child9_smp pad_2_px br_right_smp'>OTHER<div>AMT</div></div>
                                <div className='w_child10_smp pad_2_px br_right_smp'>CS WT<div>(ctw)</div></div>
                                <div className='w_child11_smp pad_2_px br_right_smp'>CS RATE</div>
                                <div className='w_child12_smp pad_2_px br_right_smp'>CS AMT</div>
                                <div className='w_child13_smp pad_2_px br_right_smp'>GOLD<div>FINE (gm)</div></div>
                                <div className='w_child14_smp pad_2_px br_right_smp'>GOLD AMT</div>
                                <div className='w_child15_smp pad_2_px br_right_smp'>AMOUNT</div>
                            </div>


                            {result?.resultArray?.map((j1, i1) => {
                                return (
                                    <div className='d_flex_smp w_main_smp br_bottom_smp'>
                                        <div className='w_child1_smp pad_2_px br_right_smp'>{j1.SrNo}</div>
                                        <div className='w_child2_smp pad_2_px br_right_smp'>
                                            <div className='font_13_smp font_bold_smp'>{j1.designno} - {j1.Categoryname}</div>
                                            <div className='text_center_smp'><img
                                                src={j1?.DesignImage}
                                                onError={(e) => handleImageError(e)}
                                                alt="design"
                                                className="imgdp10 i_qp1"
                                                width={"60px"}
                                                height="60px"
                                            /></div>
                                        </div>
                                        <div className='w_child3_smp pad_2_px br_right_smp'>Remark</div>
                                        <div className='w_child4_smp pad_2_px br_right_smp'>DIA WT (ctw)</div>
                                        <div className='w_child5_smp pad_2_px br_right_smp'>DIA RATE</div>
                                        <div className='w_child6_smp pad_2_px br_right_smp'>DIA AMT</div>
                                        <div className='w_child7_smp pad_2_px br_right_smp'>G WT (gm)</div>
                                        <div className='w_child8_smp pad_2_px br_right_smp'>NWT (gm)</div>
                                        <div className='w_child9_smp pad_2_px br_right_smp'>OTHER AMT</div>
                                        <div className='w_child10_smp pad_2_px br_right_smp'>CS WT (ctw)</div>
                                        <div className='w_child11_smp pad_2_px br_right_smp'>CS RATE</div>
                                        <div className='w_child12_smp pad_2_px br_right_smp'>CS AMT</div>
                                        <div className='w_child13_smp pad_2_px br_right_smp'>GOLD FINE (gm)</div>
                                        <div className='w_child14_smp pad_2_px br_right_smp'>GOLD AMT</div>
                                        <div className='w_child15_smp pad_2_px br_right_smp'>AMOUNT</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto"> {msg} </p>}
        </>
    )
}

export default Summary4Quote;