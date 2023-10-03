import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/exportPrint1.module.css";
import { apiCall, handlePrint, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { ToWords } from 'to-words';

const ExportPrint1 = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [data, setData] = useState([]);
    const [json0Data, setJson0Data] = useState({});
    const [msg, setMsg] = useState("");
    const toWords = new ToWords();

    const loadData = (data) => {
        let arr = [];
        data?.BillPrint_Json1.forEach((e, i) => {
            let findIndex = arr.findIndex((ele, ind) => ele?.designno === e?.designno);
            if (findIndex === -1) {
                let obj = { ...e };
                obj.quantityPcs = 1;
                arr.push(obj);
            } else {
                arr[findIndex].grosswt += e?.grosswt;
                arr[findIndex].TotalAmount += e?.TotalAmount;
                arr[findIndex].quantityPcs += 1;
            }
        })
        setData(arr);
        setJson0Data(data?.BillPrint_Json[0])
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
        loader ? <Loader /> : msg === "" ? <div className={style.containerExportPrint1}>
            {/* print button */}
            <div className={`d-flex justify-content-end mb-4 align-items-center print_sec_sum4 pt-4 pb-4`}>
                <div className="form-check ps-3 mt-2">
                    <input
                        type="button"
                        className="btn_white blue"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            {/* company address */}
            <div className="d-flex border">
                <div className="col-6 border-end p-2">
                    <p className='fs-6'>{json0Data?.CompanyFullName}</p>
                    <p className='fs-6'>{json0Data?.CompanyAddress}</p>
                    <p className='fs-6'>{json0Data?.CompanyAddress2},{json0Data?.CompanyCity}-{json0Data?.CompanyPinCode}</p>
                    <p className='fs-6'>T {json0Data?.CompanyTellNo}</p>
                </div>
                <div className="col-6">
                    <div className="border-bottom p-2">
                        <p>Invoice No :- {json0Data?.InvoiceNo}</p>
                        <p>Date :- {json0Data?.EntryDate}</p>
                    </div>
                    <div className="d-flex">
                        <div className="col-6 p-2 border-end">
                            <p>Country of origin of goods (Company's Country)</p>
                        </div>
                        <div className="col-6 p-2">
                            <p>Country of Final Destination (Customer's Country)</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* customer address */}
            <div className="d-flex border-start border-end border-bottom">
                <div className="col-6 p-2 border-end">
                    <p>To,</p>
                    <p className='fs-6'>{json0Data?.customerfirmname}</p>
                    <p>{json0Data?.customerAddress1}</p>
                    <p>{json0Data?.customerAddress2}</p>
                    <p>{json0Data?.customercity}{json0Data?.customerpincode}</p>
                    <p>{json0Data?.customeremail1}</p>
                    <p>{json0Data?.vat_cst_pan}</p>
                    <p>{json0Data?.Cust_CST_STATE}-{json0Data?.Cust_CST_STATE_No}</p>
                </div>
                <div className="col-6 p-2">
                    <p>Other Refernce(s)</p>
                    <p>Attn:-</p>
                    <p>Buyer's Order No.& Date</p>
                </div>
            </div>
            {/* title */}
            <div className="border-start border-end border-bottom p-2">
                <p className="fw-bold text-center fs-6">{json0Data?.PrintHeadLabel} </p>
            </div>
            {/* table heading */}
            <div className={`d-flex border-bottom border-start border-end ${style.rowExport1}`}>
                <div className={`${style.srNoExport1} border-end`}><p className='text-center '>Sr#</p></div>
                <div className={`${style.discriptionExport1} border-end`}><p className='text-center '>Description</p></div>
                <div className={`${style.designExport1} border-end`}><p className='text-center '>Design#</p></div>
                <div className={`${style.QuantityPcsExport1} border-end`}><p className='text-center '>Quantity Pcs</p></div>
                <div className={`${style.HSNCODEExport1} border-end`}><p className='text-center '>HSN CODE</p></div>
                <div className={`${style.GrossWtExport1} border-end`}><p className='text-center '>Gross Wt</p></div>
                <div className={`${style.RateExport1} border-end`}><p className='text-center '>Rate</p></div>
                <div className={`${style.AmountExport1} `}><p className='text-center'>Amount</p></div>
            </div>
            {/* data */}
            {data && data.map((e, i) => {
                console.log(e);
                return <div className={`d-flex border-bottom border-start border-end ${style.rowExport1}`} key={i}>
                    <div className={`${style.srNoExport1} border-end`}><p className='text-center '>{e?.SrNo}</p></div>
                    <div className={`${style.discriptionExport1} border-end`}><p className='text-center '>{e?.Categoryname} ({e?.MetalPurity})</p></div>
                    <div className={`${style.designExport1} border-end`}><p className='text-center '>{e?.designno}</p></div>
                    <div className={`${style.QuantityPcsExport1} border-end`}><p className='text-center '>{e?.quantityPcs}</p></div>
                    <div className={`${style.HSNCODEExport1} border-end`}><p className='text-center '>{json0Data?.HSN_No}</p></div>
                    <div className={`${style.GrossWtExport1} border-end`}><p className='text-center '>{e?.grosswt}</p></div>
                    <div className={`${style.RateExport1} border-end`}><p className='text-center '>{e?.TotalAmount}</p></div>
                    <div className={`${style.AmountExport1} `}><p className='text-center'>{(e?.TotalAmount).toFixed(2)}</p></div>
                </div>
            })}
            {/* RMk */}
            <div className="d-flex justify-content-between pb-2 pt-2 border-start border-end px-2">
                <div className="col-6">
                    <div className="border d-flex">
                        <div className="col-2 p-1 border-end">RM K</div>
                        <div className="col-2 p-1 border-end">NetWt</div>
                        <div className="col-2 p-1 border-end">PureWt</div>
                        <div className="col-2 p-1 border-end">Loss%</div>
                        <div className="col-2 p-1 border-end">LossWt</div>
                        <div className="col-2 p-1">Total</div>
                    </div>
                    <div className="border-start border-end border-bottom d-flex">
                        <div className="col-2 p-1 border-end">18K	</div>
                        <div className="col-2 p-1 border-end">30.800</div>
                        <div className="col-2 p-1 border-end">23.100</div>
                        <div className="col-2 p-1 border-end">1.000 %</div>
                        <div className="col-2 p-1 border-end">0.308	</div>
                        <div className="col-2 p-1">23.408</div>
                    </div>
                </div>
                <div className="col-5">
                    <div className="border d-flex">
                        <div className="col-4 d-flex align-items-center justify-content-center p-1 border-end">
                            <p>35.000</p>
                        </div>
                        <div className="col-8">
                            <div className={`d-flex border-bottom ${style?.minHeight_24_8ExportPrint1}`}>
                                <div className="col-6 p-1 border-end"><p>FOB</p></div>
                                <div className="col-6 p-1 text-end"><p>1,00,335</p></div>
                            </div>
                            <div className={`d-flex border-bottom ${style?.minHeight_24_8ExportPrint1}`}>
                                <div className="col-6 p-1 border-end"><p></p></div>
                                <div className="col-6 p-1 text-end"><p></p></div>
                            </div>
                            <div className={`d-flex ${style?.minHeight_24_8ExportPrint1}`}>
                                <div className="col-6 p-1 border-end"><p>CFR</p></div>
                                <div className="col-6 p-1 text-end"><p>1,00,335</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* FOB */}
            <p className='border-bottom border-start border-end p-2'>FOB IN Word:  {toWords.convert(23094820.45)}</p>
            {/* I/we hereby certify */}
            <div dangerouslySetInnerHTML={{ __html: json0Data?.Declaration }} className='border-bottom border-start border-end ps-2 pe-2 pb-2 pt-4'></div>
            <div className="d-flex border-start border-end border-bottom">
                {/* Bank Detail */}
                <div className="col-9 p-2 border-end">
                    <p>Bank Detail</p>
                    <p>Bank Name: {json0Data?.bankname}</p>
                    <p>Branch: {json0Data?.bankaddress}</p>
                    <p>Account Name: {json0Data?.accountname}</p>
                    <p>Account No. : {json0Data?.accountnumber}</p>
                    <p>RTGS/NEFT IFSC: {json0Data?.rtgs_neft_ifsc}</p>
                    <p>Enquiry No.</p>
                    <p>(E & OE)</p>
                </div>
                {/* ORAIL SERVICE */}
                <div className="col-3 p-2">
                    <div className="d-flex h-100 justify-content-between align-items-center flex-column">
                        <p>{json0Data?.CompanyFullName}</p>
                        <p>Authorised Signature</p>
                    </div>
                </div>
            </div>
        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default ExportPrint1;