import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/InvoicePrint9.module.css";
import Loader from '../../components/Loader';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import {
    HeaderComponent,
    NumberWithCommas,
    apiCall,
    handleImageError,
    handlePrint,
    isObjectEmpty,
    taxGenrator,
    FooterComponent,
} from "../../GlobalFunctions";
import footer2 from "../../assets/css/footers/footer2.module.css";
import { cloneDeep } from 'lodash';

const InvoicePrint9 = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [header, setHeader] = useState(null);
    const [headerCheck, setHeaderCheck] = useState(true);
    const [label, setlabel] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const [data, setData] = useState({});
    const loadData = (data) => {
        let head = HeaderComponent("1", data?.BillPrint_Json[0]);
        setHeader(head);
        setHeaderData(data?.BillPrint_Json[0]);
        let printArr = data?.BillPrint_Json[0]?.Printlable.split("\r\n");
        setlabel(printArr);
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
        let resultArr = [];
        datas?.resultArray?.map((e, i) => {
            let obj = cloneDeep(e);
            let findGold = obj?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1);
            if(findGold !== undefined){
                obj.metalRate = findGold?.Rate;
                obj.metalAmount = findGold?.Amount;
                obj.metalPcs = findGold?.Pcs;
            }
            resultArr.push(obj);
        });
        datas.resultArray = resultArr;
        setData(datas);
        // console.log(datas);
    }
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

    return (
        loader ? <Loader /> : msg === "" ? <>
            <div className={`container max_width_container ${style?.invoiceprint9} pad_60_allPrint px-1 mt-1`}>
                {/* buttons */}
                <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
                    <div className="form-check pe-3 ">
                        <input className="form-check-input border-dark" type="checkbox" checked={headerCheck} onChange={e => setHeaderCheck(!headerCheck)} />
                        <label className="form-check-label pt-1">
                            With Header
                        </label>
                    </div>
                    <div className="form-check ps-3">
                        <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* header */}
                {headerCheck && <div className='pb-2 border-bottom'>
                    {header}
                </div>}
                {/* print heading */}
                <p className="fs-5 text-center fw-bold">{headerData?.PrintHeadLabel}</p>
                {/* sub header */}
                <div className="border d-flex">
                    <div className="col-8 px-1 py-2 border-end">
                        <p className="fw-bold">Buyer Details,</p>
                        <p className="fw-bold">{headerData?.customerfirmname}</p>
                        <p>{headerData?.customerAddress1}</p>
                        <p>{headerData?.customerAddress2}</p>
                        <p>{headerData?.customerAddress3}</p>
                        <p>{headerData?.customercity1}{headerData?.customerpincode}, {headerData?.State}</p>
                        <p>{headerData?.customeremail1}</p>
                        <p>{headerData?.Cust_CST_STATE} {headerData?.Cust_CST_STATE_No}</p>
                    </div>
                    <div className="col-4 py-2 px-1">
                        <div className="d-flex">
                            <p className='fw-bold col-6'>BILL NO</p>
                            <p className='col-6'>   {headerData?.InvoiceNo}  </p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-6'>DATE</p>
                            <p className='col-6'>   {headerData?.EntryDate}  </p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-6'>GSTIN</p>
                            <p className='col-6'>   {headerData?.CustGstNo}  </p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-6'>PAN NO</p>
                            <p className='col-6'>   {headerData?.CustPanno}  </p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-6'>AADHAR NO</p>
                            <p className='col-6'>  {headerData?.aadharno}   </p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-6'>FOREIGN PASSPORT</p>
                            <p className='col-6'>     </p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-6'>DRIVING LICENCE</p>
                            <p className='col-6'>     </p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-6'>MOBILE</p>
                            <p className='col-6'>   {headerData?.customermobileno} [India]  </p>
                        </div>
                    </div>
                </div>
                {/* table header */}
                <div className="d-flex border-start border-end border-bottom py-1">
                    <div className={`${style?.Image} px-1`}><p className="fw-bold ">Image	</p></div>
                    <div className={`${style?.SNo} px-1`}><p className="fw-bold ">S.No	</p></div>
                    <div className={`${style?.Description} px-1`}><p className="fw-bold ">Description	</p></div>
                    <div className={`${style?.HSN} px-1`}><p className="fw-bold ">HSN	</p></div>
                    <div className={`${style?.Pcs} px-1`}><p className="fw-bold  text-end">Pcs	</p></div>
                    <div className={`${style?.GGms} px-1`}><p className="fw-bold  text-end">G.Gms.Mg	</p></div>
                    <div className={`${style?.Stone} px-1`}><p className="fw-bold  text-end">Stone Wt	</p></div>
                    <div className={`${style?.NGms} px-1`}><p className="fw-bold  text-end">N.Gms.Mg	</p></div>
                    <div className={`${style?.Rate} px-1`}><p className="fw-bold  text-end">Rate	</p></div>
                    <div className={`${style?.VA} px-1`}><p className="fw-bold  text-end">V.A	</p></div>
                    <div className={`${style?.Amount} px-1`}><p className="fw-bold  text-end">Amount</p></div>
                </div>
                {/* table data */}
                {
                    data?.resultArray?.map((e, i) => {
                        return <div className="d-flex border-start border-end border-bottom" key={i}>
                            <div className={`${style?.Image} px-1 border-end`}>
                                <p className="fw-bold">{e?.SrJobno}	</p>
                                <img src={e?.DesignImage} alt="" className='imgWidth' onError={handleImageError} />
                            </div>
                            <div className={`${style?.SNo} px-1 border-end`}><p className="fw-bold">{NumberWithCommas(i+1, 0)}</p></div>
                            <div className={`${style?.Description} px-1`}>
                                <p className="fw-bold">{e?.SubCategoryname}-{e?.MetalPurity}</p>
                                {e?.diamonds?.map((ele, ind) => {
                                    return   <p className="pt-1" key={ind}>DIAMONDS  {ele?.Colorname} {ele?.QualityName} {ele?.ShapeName} </p>
                                })}
                            </div>
                            <div className={`${style?.HSN} px-1`}><p className="fw-bold">85213</p></div>
                            <div className={`${style?.Pcs} px-1`}>
                                <p className="fw-bold text-end">{NumberWithCommas(e?.Quantity, 0)}</p>
                                {e?.diamonds?.map((ele, ind) => {
                                    return   <p className="pt-1 text-end" key={ind}>  {NumberWithCommas(ele?.Pcs, 0)} </p>
                                })}
                            </div>
                            <div className={`${style?.GGms} px-1`}><p className="fw-bold text-end">{NumberWithCommas(e?.grosswt, 3)} g</p></div>
                            <div className={`${style?.Stone} px-1`}>
                                <p className="fw-bold text-end">{NumberWithCommas(e?.grosswt, 3)} g</p>
                                {e?.diamonds?.map((ele, ind) => {
                                    return   <p className="pt-1 text-end" key={ind}>  {NumberWithCommas(ele?.Wt, 3)} </p>
                                })}
                            </div>
                            <div className={`${style?.NGms} px-1`}><p className="fw-bold text-end">{NumberWithCommas(e?.NetWt, 3)} g</p></div>
                            <div className={`${style?.Rate} px-1`}>
                                <p className="fw-bold text-end">{NumberWithCommas(e?.metalRate, 2)}</p>
                                {e?.diamonds?.map((ele, ind) => {
                                    return   <p className="pt-1 text-end" key={ind}>  {NumberWithCommas(ele?.Rate, 2)} </p>
                                })}
                            </div>
                            <div className={`${style?.VA} px-1`}><p className="fw-bold text-end">{NumberWithCommas(e?.metalAmount, 2)}</p></div>
                            <div className={`${style?.Amount} px-1`}>
                                <p className="fw-bold text-end">59,475.60</p>
                                {e?.diamonds?.map((ele, ind) => {
                                    return   <p className="pt-1 text-end" key={ind}>  {NumberWithCommas(ele?.Amount, 2)} </p>
                                })}
                            </div>
                        </div>
                    })
                }

                {/* table total */}
                <div className="d-flex border-start border-end border-bottom py-1">
                    <div className={`${style?.total} px-1`}><p className="fw-bold text-center">Total</p></div>
                    <div className={`${style?.HSN} px-1`}><p className="fw-bold"></p></div>
                    <div className={`${style?.Pcs} px-1`}>
                        <p className="fw-bold text-end">{NumberWithCommas(data?.mainTotal?.total_Quantity, 0)}</p>
                    </div>
                    <div className={`${style?.GGms} px-1`}><p className="fw-bold text-end">{NumberWithCommas(data?.mainTotal?.grosswt, 3)} </p></div>
                    <div className={`${style?.Stone} px-1`}>
                        <p className="fw-bold text-end"></p>
                    </div>
                    <div className={`${style?.NGms} px-1`}><p className="fw-bold text-end">{NumberWithCommas(data?.mainTotal?.netwt, 3)}</p></div>
                    <div className={`${style?.Rate} px-1`}>
                        <p className="fw-bold text-end"></p>
                    </div>
                    <div className={`${style?.VA} px-1`}><p className="fw-bold text-end"></p></div>
                    <div className={`${style?.Amount} px-1`}>
                        <p className="fw-bold text-end">{NumberWithCommas(data?.mainTotal?.total_amount, 2)} </p>
                    </div>
                </div>
                {/* table taxes */}
                <div className="d-flex border-start border-end border-bottom">
                    <div className="col-8 border-end p-2">
                        <div className="d-flex justify-content-between">
                            <p className="fw-bold">Advances {headerData?.InvoiceNo}</p>
                            <p className="fw-bold">0.00</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="fw-bold">Remark : </p>
                            <p className="fw-bold">{headerData?.PrintRemark}</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="fw-bold">Credit :	</p>
                            <p className="fw-bold">0.00</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="fw-bold">Cash :	</p>
                            <p className="fw-bold">0.00 </p>
                        </div>
                    </div>
                    <div className="col-4 p-2 d-flex flex-column justify-content-end">
                        {/* <div className="d-flex justify-content-between">
                            <p className="">Discount	</p>
                            <p className="">1,857.50</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="fw-bold">Total Amount</p>
                            <p className="fw-bold">3,14,210.18</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="">CGST @ 0.13%</p>
                            <p className="">408.34</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="">SGST @ 0.13%</p>
                            <p className="">408.34</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="">Less	    </p>
                            <p className="">-0.92</p>
                        </div> */}
                        <div className="d-flex justify-content-between">
                            <p className="fw-bold">Grand Total	</p>
                            <p className="fw-bold">{NumberWithCommas(data?.finalAmount, 2)}</p>
                        </div>
                    </div>
                </div>
                {/* amount in words */}
                <div className="py-1 px-2">
                    <p><span className="fw-bold">Rupees :</span> Three Lakh Fifteen Thousand and Twenty-Five Point Ninety-Four Only.</p>
                </div>
                {/* declaration */}
                <p className="fw-bold pt-1 px-2 pb-2" dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}></p>
                {/* note */}
                <div className={`${footer2.container} no_break target_footer`}>
                    <div
                        className={footer2.block1f3}
                        style={{ width: "33.33%", borderRight: "1px solid #e8e8e8" }}
                    >
                        <div className={footer2.linesf3} style={{ fontWeight: "bold" }}>Bank Detail</div>
                        <div className={footer2.linesf3}>Bank Name: {headerData?.bankname}</div>
                        <div className={footer2.linesf3}>Branch: {headerData?.bankaddress}</div>
                        <div className={footer2.linesf3}>Account Name: {headerData?.accountname}</div>
                        <div className={footer2.linesf3}>Account No. : {headerData?.accountnumber}</div>
                        <div className={footer2.linesf3}>RTGS/NEFT IFSC: {headerData?.rtgs_neft_ifsc}</div>
                    </div>
                    <div
                        className={footer2.block2f3}
                        style={{ width: "33.33%", borderRight: "1px solid #e8e8e8" }}
                    >
                        <div className={footer2.linesf3}>Signature</div>
                        <div className={footer2.linesf3}>{headerData?.customerfirmname}</div>
                    </div>
                    <div className={footer2.block2f3} style={{ width: "33.33%" }}>
                        <div className={footer2.linesf3}>Signature</div>
                        <div className={footer2.linesf3}>{headerData?.CompanyFullName}</div>
                    </div>
                </div>
            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default InvoicePrint9
