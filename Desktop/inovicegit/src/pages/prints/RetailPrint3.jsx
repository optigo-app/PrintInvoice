import React, { useEffect, useState } from 'react'
import style from "../../assets/css/prints/RetailPrint3.module.css";
import { ToWords } from 'to-words';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';
import Loader from '../../components/Loader';
import {
    HeaderComponent,
    NumberWithCommas,
    apiCall,
    handleImageError,
    handlePrint,
    isObjectEmpty,
    taxGenrator,
    FooterComponent,
    fixedValues,
} from "../../GlobalFunctions";

const RetailPrint3 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const toWords = new ToWords();
    const [data, setData] = useState({});
    const [label, setlabel] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const [header, setHeader] = useState(null);
    const [footer, setFooter] = useState(null);
    const [document, setDocument] = useState({
        aadharcard: "",
        nri: "",
        passport: "",
    });
    const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
    const loadData = (data) => {
        let head = HeaderComponent("1", data?.BillPrint_Json[0]);
        setHeader(head);
        let footers = FooterComponent("2", data?.BillPrint_Json[0]);
        setFooter(footers);
        setHeaderData(data?.BillPrint_Json[0]);
        let printArr = data?.BillPrint_Json[0]?.Printlable.split("\r\n");
        setlabel(printArr);
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
        let resultArray = [];
        datas?.resultArray?.forEach((e, i) => {
            let obj = cloneDeep(e);
            let diamonds = [];
            obj?.diamonds?.forEach((ele, ind) => {
                let findDiamond = diamonds?.findIndex((elem, index) => elem?.QualityName === ele?.QualityName);
                if (findDiamond === -1) {
                    diamonds.push(ele);
                } else {
                    diamonds[findDiamond].Pcs += ele?.Pcs;
                    diamonds[findDiamond].Wt += ele?.Wt;
                    diamonds[findDiamond].Amount += ele?.Amount;
                }
            });
            obj.quaDia = diamonds;
            resultArray.push(obj);
        });
        datas.resultArray = resultArray;
        console.log(datas);
        setData(datas);
        let documentDetails = data?.BillPrint_Json[0]?.DocumentDetail.split("#@#");
        let documents = {
            aadharcard: "",
            nri: "",
            passport: "",
        };
        documentDetails?.forEach((e, i) => {
            let data = e?.split("#-#");
            if (data[0] === "Aadhar Card") {
                documents.aadharcard = data[1];
            } else if (data[0] === "NRI ID") {
                documents.nri = data[1];
            } else if (data[0] === "FOREIGN PASSPORT") {
                documents.passport = data[1];
            }
        });
        setDocument(documents);
    }

    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
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

    return (
        loader ? <Loader /> : msg === "" ? <>
            <div className={`container max_width_container ${style?.RetailPrint3} pad_60_allPrint px-1 mt-1 RetailPrint3`}>
                {/* buttons */}
                <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
                    <div className="form-check ps-3">
                        <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* header line */}
                <div className="bgGrey px-2 py-1 text-white">
                    <p className="text-white fs-5 fw-bold">TAX INVOICE</p>
                </div>
                {/* header */}
                <div className="my-1 border d-flex">
                    <div className="col-7 p-2">
                        <p>{headerData?.lblBillTo}</p>
                        <p className='fw-bold'>{headerData?.customerfirmname}</p>
                        <p>Address: {headerData?.customerAddress1}</p>
                        <p>{headerData?.customerAddress2}</p>
                        <p>{headerData?.customercity1}-{headerData?.PinCode}</p>
                        <p>{headerData?.customeremail1}</p>
                    </div>
                    <div className="col-5 p-2">
                        <div className="d-flex">
                            <p className='fw-bold col-6'>Tax Invoice No:</p>
                            <p className='col-6'>: {headerData?.InvoiceNo}</p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-6'>Date	:</p>
                            <p className='col-6'>: {headerData?.EntryDate}</p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-6'>{headerData?.HSN_No_Label}/SAC</p>
                            <p className='col-6'>:  {headerData?.HSN_No}</p>
                        </div>
                        <p className='fw-bold'>GSTIN-{headerData?.CustGstNo}</p>
                        <p className='fw-bold'>{headerData?.Cust_CST_STATE}-{headerData?.Company_CST_STATE_No}</p>
                        <p className='fw-bold'>PAN-{headerData?.CustPanno}</p>
                        <p> </p>
                    </div>
                </div>
                {/* table header */}
                {/* <div className="d-flex border">
                    <div className={`d-flex justify-content-center align-items-center ${style?.Sr} border-end`}><p className="fw-bold text-center p-1"> Sr#	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Product} border-end`}><p className="fw-bold text-center p-1"> Product Description	</p></div>
                    <div className={`${style?.Material}`}>
                        <div className="d-grid h-100">
                            <div className="d-flex border-bottom"><p className="fw-bold w-100 text-center p-1">Material Description</p></div>
                            <div className="d-flex">
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.material}`}>Material</p>
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.qty}`}>Qty</p>
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.color}`}>Color</p>
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.pcs}`}>Pcs</p>
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.gWt}`}>GWt.</p>
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.nWt}`}>NWt.</p>
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.rate}`}>Rate</p>
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.amount}`}>Amount</p>
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.making}`}>Making</p>
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.discount}`}>Discount</p>
                                <p className={`fw-bold w-100 text-center p-1 ${style?.total}`}>Total</p>
                            </div>
                        </div>
                    </div>
                </div> */}
                {/* table body */}
                <table className='w-100'>
                    <tbody>
                        <tr className="d-flex border">
                            <td className={`d-flex justify-content-center align-items-center ${style?.Sr} border-end p-0`}><p className="fw-bold text-center p-1"> Sr#	</p></td>
                            <td className={`d-flex justify-content-center align-items-center ${style?.Product} border-end p-0`}><p className="fw-bold text-center p-1"> Product Description	</p></td>
                            <td className={`${style?.Material} p-0`}>
                            <div className="d-flex border-bottom"><p className="fw-bold w-100 text-center p-1">Material Description</p></div>
                                <table className='w-100 p-0'>
                                    <tbody>
                                        <tr>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 ${style?.material}`}>Material</td>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 ${style?.qty}`}>Qty</td>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 ${style?.color}`}>Color</td>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 ${style?.pcs}`}>Pcs</td>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 ${style?.gWt}`}>GWt.</td>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 ${style?.nWt}`}>NWt.</td>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 ${style?.rate}`}>Rate</td>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 ${style?.amount}`}>Amount</td>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 ${style?.making}`}>Making</td>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 ${style?.discount}`}>Discount</td>
                                                    <td className={`p-0 fw-bold text-center p-1 ${style?.total}`}>Total</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        {
                            data?.resultArray?.map((e, i) => {
                                return <tr className="d-flex border-start border-end border-bottom" key={i}>
                                    <td className={`d-flex justify-content-center align-items-center ${style?.Sr} border-end`}><p className="fw-bold text-center p-1"> {i + 1} </p></td>
                                    <td className={`${style?.Product} border-end`}>
                                        <p className="text-center p-1">{e?.SubCategoryname} {e?.Categoryname}  </p>
                                        <p className="fw-bold text-center p-1"> {e?.designno} | {e?.SrJobno} </p>
                                        <img src={e?.DesignImage} alt="" className='imgWidth' onError={handleImageError} />
                                    </td>
                                    <td className={`${style?.Material} p-0`}>
                                        <table className='w-100 h-100'>
                                            <tbody>
                                                <tr>
                                                    <td className={`border-end border-bottom ${style?.material}`}>
                                                        <p className='p-1'>{e?.MetalType}</p>
                                                    </td>
                                                    <td className={`border-end border-bottom ${style?.qty}`}>
                                                        <p className='p-1'>{e?.MetalPurity}</p>
                                                    </td>
                                                    <td className={`border-end border-bottom ${style?.color}`}>
                                                        <p className='p-1'></p>
                                                    </td>
                                                    <td className={`border-end border-bottom ${style?.pcs}`}>
                                                        <p className=' p-1'></p>
                                                    </td>
                                                    <td className={`border-end ${style?.gWt}`} rowSpan={2}>
                                                        <p className='p-1'>{NumberWithCommas(e?.grosswt, 3)}</p>
                                                    </td>
                                                    <td className={`border-end border-bottom ${style?.nWt}`}>
                                                        <p className='p-1'>{NumberWithCommas(e?.NetWt, 3)}</p>
                                                    </td>
                                                    <td className={` text-center border-end border-bottom ${style?.rate}`}>
                                                        <p className='p-1 '>5700.00</p>
                                                    </td>
                                                    <td className={`text-center border-end border-bottom p-1 ${style?.amount}`}>
                                                        <p>57478.80</p>
                                                    </td>
                                                    <td className={`text-center border-end p-1 ${style?.making}`} rowSpan={2}><p>1996.80</p></td>
                                                    <td className={`text-center border-end p-1 ${style?.discount}`} rowSpan={2}><p>0.00</p></td>
                                                    <td className={`text-center p-1 ${style?.total}`} rowSpan={2}><p>59605.60</p></td>
                                                </tr>
                                                <tr>
                                                    <td className={` border-end ${style?.material}`}>
                                                        <p className='p-1'>{e?.MetalType}</p>
                                                    </td>
                                                    <td className={` border-end ${style?.qty}`}>
                                                        <p className='p-1'>{e?.MetalPurity}</p>
                                                    </td>
                                                    <td className={` border-end ${style?.color}`}>
                                                        <p className='p-1'></p>
                                                    </td>
                                                    <td className={` border-end ${style?.pcs}`}>
                                                        <p className='d-flex justify-content-end align-items-center  p-1'></p>
                                                    </td>
                                                    <td className={`text-end border-end   ${style?.nWt}`}>
                                                        <p className='p-1'>{NumberWithCommas(e?.NetWt, 3)}</p>
                                                    </td>
                                                    <td className={` border-end ${style?.rate}`}>
                                                        <p className='p-1 '>5700.00</p>
                                                    </td>
                                                    <td className={`text-center border-end p-1 ${style?.amount}`}>
                                                        <p>57478.80</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
                {/* {
                    data?.resultArray?.map((e, i) => {
                        return <div className="d-flex border-start border-end border-bottom" key={i}>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Sr} border-end`}><p className="fw-bold text-center p-1"> {i + 1} </p></div>
                            <div className={`${style?.Product} border-end`}>
                                <p className="text-center p-1">{e?.SubCategoryname} {e?.Categoryname}  </p>
                                <p className="fw-bold text-center p-1"> {e?.designno} | {e?.SrJobno} </p>
                                <img src={e?.DesignImage} alt="" className='imgWidth' onError={handleImageError} />
                            </div>
                            <div className={`${style?.Material}`}>
                                <div className="d-grid h-100">
                                    <div className="d-flex">
                                        <div className={`d-flex align-items-center w-100 text-center border-end border-bottom ${style?.material}`}>
                                            <p className='p-1'>{e?.MetalType}</p>
                                        </div>
                                        <div className={`d-flex align-items-center w-100 text-center border-end border-bottom ${style?.qty}`}>
                                            <p className='p-1'>{e?.MetalPurity}</p>
                                        </div>
                                        <div className={`d-flex align-items-center w-100 text-center border-end border-bottom ${style?.color}`}>
                                            <p className='p-1'></p>
                                        </div>
                                        <div className={`w-100 text-center border-end border-bottom ${style?.pcs}`}>
                                            <p className='d-flex justify-content-end align-items-center  p-1'></p>
                                        </div>
                                        <div className={`d-flex justify-content-end align-items-center w-100 text-center border-end border-bottom ${style?.gWt}`}><p className='p-1'>{NumberWithCommas(e?.grosswt, 3)}</p></div>
                                        <div className={`w-100 text-end border-end border-bottom d-flex justify-content-end align-items-center  ${style?.nWt}`}>
                                            <p className='p-1'>{NumberWithCommas(e?.NetWt, 3)}</p>
                                        </div>
                                        <div className={`d-flex align-items-center justify-content-end w-100 text-center border-end border-bottom ${style?.rate}`}>
                                            <p className='p-1 '>5700.00</p>
                                        </div>
                                        <div className={`d-flex justify-content-end align-items-center w-100 text-center border-end p-1 ${style?.amount}`}>
                                            <p>57478.80</p>
                                        </div>
                                        <div className={`d-flex justify-content-end align-items-center w-100 text-center border-end p-1 ${style?.making}`}><p>1996.80</p></div>
                                        <div className={`d-flex justify-content-end align-items-center w-100 text-center border-end p-1 ${style?.discount}`}><p>0.00</p></div>
                                        <div className={`d-flex justify-content-end align-items-center w-100 text-center p-1 ${style?.total}`}><p>59605.60</p></div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    })
                } */}

                {/* <tr>
                    <td rowspan="8">1
                    </td>
                    <td rowspan="8">
                        <table border="0" cellpadding="0" cellspacing="0">
                            <tbody><tr>
                                <td class="tddesignNo">kiaan_subcat&nbsp;&nbsp;kiaan_cat<b>IMPORT111 | 1/14896</b>
                                </td>
                            </tr>
                                <tr>
                                    <td colspan="2">
                                        <img class="isImgHide" src="http://zen/lib/jo/28/images/default.jpg" alt="IMPORT111" />
                                    </td>
                                </tr>
                            </tbody></table>
                    </td>
                    <td class="cls-tbl-detail">GOLD</td>
                    <td class="cls-tbl-detail style=">18K</td>
                    <td class="cls-tbl-detail"></td>
                    <td></td>
                    <td></td>
                    <td class="cls-tbl-detail" >5.000</td>
                    <td class="cls-tbl-detail" >5558.07</td>
                    <td class="cls-tbl-detail" >33348.42</td>
                    <td rowspan="8" >3000.00</td>
                    <td rowspan="8" >0.00</td>
                    <td rowspan="8" >111562.92</td>
                </tr> */}

                {/* table total */}
                <div className="d-flex border-start border-end border-bottom">
                    <div className={`d-flex justify-content-center align-items-center ${style?.Sr} border-end`}><p className="fw-bold text-center p-1"> </p></div>
                    <div className={`${style?.Product} border-end`}>
                        <p className="fw-bold text-center p-1"> TOTAL </p>
                    </div>
                    <div className={`${style?.Material}`}>
                        <div className="d-grid h-100">
                            <div className="d-flex h-100">
                                <div className={`fw-bold w-100 text-center border-end  ${style?.material}`}>
                                    <p className='d-flex p-1'></p>
                                </div>
                                <div className={`fw-bold w-100 text-center border-end  ${style?.qty}`}>
                                    <p className='d-flex p-1'></p>
                                </div>
                                <div className={`fw-bold w-100 text-center border-end  ${style?.color}`}>
                                    <p className='d-flex p-1'></p>
                                </div>
                                <div className={`fw-bold w-100 text-end border-end  ${style?.pcs}`}>
                                    <p className='p-1 w-100 text-end'>5</p>
                                </div>
                                <div className={`d-flex justify-content-end align-items-center fw-bold w-100 text-end border-end ${style?.gWt}`}><p className='p-1'>10.00</p></div>
                                <div className={`fw-bold w-100 text-end border-end  ${style?.nWt}`}>
                                    <p className='d-flex p-1 justify-content-end'>10.084</p>
                                </div>
                                <div className={`fw-bold w-100 text-end border-end  ${style?.rate}`}>
                                    <p className='d-flex p-1 justify-content-end'></p>
                                </div>
                                <div className={`d-flex justify-content-end align-items-center fw-bold w-100 text-center border-end p-1 ${style?.amount}`}>
                                    <p>57478.80</p>
                                </div>
                                <div className={`d-flex justify-content-end align-items-center fw-bold w-100 text-center p-1 border-end ${style?.making}`}><p>1996.80</p></div>
                                <div className={`d-flex justify-content-end align-items-center fw-bold w-100 text-center p-1 border-end ${style?.discount}`}><p>0.00</p></div>
                                <div className={`d-flex justify-content-end align-items-center fw-bold w-100 text-center p-1 ${style?.total}`}><p>59605.60</p></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* table amount */}
                <div className="d-flex border-start border-end border-bottom">
                    <div className={`${style?.inWords} border-end p-1`}>
                        <p>In Words Indian Rupees</p>
                        <p className='fw-bold'>Three lakh thirty five thousand five hundred and twenty five point forty eight only</p>
                    </div>
                    <div className={`${style?.inNumbers} border-end pt-1`}>
                        <p className='text-end px-1'>Discount</p>
                        <p className='text-end border-bottom px-1 pb-1'>IGST @ 0.25</p>
                        <p className="fw-bold text-end px-1 pt-1">GRAND TOTAL</p>
                        <p className="text-end px-1 pt-1">RECEIPTS</p>
                        <p className="text-end px-1 pt-1">OLD GOLD</p>
                        <p className="fw-bold text-end px-1 pt-1">BALANCE</p>
                    </div>
                    <div className={` ${style?.totalInNumbers} py-1`}>
                        <p className='text-end px-1'>59605.60</p>
                        <p className='text-end px-1 pb-1 border-bottom'>836.72 </p>
                        <p className="fw-bold text-end px-1 pt-1">335525.48</p>
                        <p className="text-end px-1 pt-1">0.00</p>
                        <p className="text-end px-1 pt-1">0.00</p>
                        <p className="fw-bold text-end px-1 pt-1">335525.48</p>
                    </div>
                </div>
                {/* declaration */}
                <div className="my-1 border p-1">
                    <div>
                        Terms and Condition : 1.I/We hereby certify that my/our registration certificate under the Goods And Service Tax Act 2017. Is in force on the date on which the sale of the goods specified in the tax invoice has been effected by me/us & it shall accounted for in the turnover of sales while filing of return & the due tax.If any payable on the sale has been paid or shall be paids.
                        2.Returns of goods are subject to Terms & Conditions as mentioned in www.orail.com.
                        3.The support is limited to working hours.
                    </div>
                </div>
                <div className="my-1 border">
                    <p className="fw-bold p-1"><span className="text-decoration-underline">Remark :</span></p>
                </div>
                <div className="my-1 border p-1 d-flex">
                    <div className="col-4 border-end">
                        <p className="fw-bold">Bank Details :</p>
                        <p>Bank Name:Kotak Mahindra Bank</p>
                        <p>Branch: SHOP NO-1 WTC , UDHNA DARWAJA SURAT-395004</p>
                        <p>Account Name:Orail</p>
                        <p>Account No. :147275899632</p>
                        <p>RTGS/NEFT IFSC:Kotak00000405</p>
                        <p>GST NO:24AAAAA0000A1Z51</p>
                        <p>PAN NO:FDGH5564CD</p>
                        <p>TELL NO:9510213588</p>
                    </div>
                    <div className="col-4 border-end d-flex justify-content-between p-1 flex-column">
                        <p>Signature</p>
                        <p className='fw-bold pb-3'>SHAH PVT LMT</p>
                    </div>
                    <div className="col-4 d-flex justify-content-between p-1 flex-column">
                        <p>Signature</p>
                        <p className='fw-bold pb-3'>SHAH PVT LMT</p>
                    </div>
                </div>
            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default RetailPrint3;
