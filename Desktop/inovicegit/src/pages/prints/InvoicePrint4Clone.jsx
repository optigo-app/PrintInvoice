import React, { useEffect, useState } from 'react'
import { NumberWithCommas, apiCall, fixedValues, handleImageError, handlePrint, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import style from "../../assets/css/prints/invoiceprint4clone.module.css";

const InvoicePrint4Clone = ({ token, invoiceNo, printName, urls, evn }) => {

    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [headerData, setHeaderData] = useState({});
    const [datas, setDatas] = useState([]);
    const [discription, setDiscription] = useState("");
    const [another, setAnother] = useState({
        labour: 0,
        other: 0,
    })

    const resultAray = (arr, record) => {
        let findIndex = arr.findIndex(ele => ele?.Rate === record?.Rate);
        if (findIndex === -1) {
            arr.push(record);
        } else {
            if (record.amount !== 0) {
                arr[findIndex].Wt += record?.Wt;
                arr[findIndex].Amount += record?.Amount;
                if (arr[findIndex].Amount !== 0) {
                    arr[findIndex].Rates = arr[findIndex].Wt / arr[findIndex].Amount;
                }
            }
        }
        return arr;
    }

    const loadData = (data) => {
        setHeaderData(data?.BillPrint_Json[0]);
        let arr = [];
        data?.BillPrint_Json2.forEach((e, i) => {
            if (e?.MasterManagement_DiamondStoneTypeid === 4) {
                let findIndex = arr.findIndex(ele => ele?.ShapeName === e?.ShapeName && ele?.QualityName === e?.QualityName && ele?.Rate === e?.Rate);
                if (findIndex === -1) {
                    arr.push(e);
                } else {
                    arr[findIndex].Wt += e?.Wt;
                    arr[findIndex].Amount += e?.Amount;
                    if (arr[findIndex].Amount !== 0) {
                        arr[findIndex].Rates = arr[findIndex].Wt / arr[findIndex].Amount;
                    }
                }
            } else if (e?.MasterManagement_DiamondStoneTypeid === 2 || e?.MasterManagement_DiamondStoneTypeid === 1) {
                let resultArr = resultAray(arr, e);
                arr = [...resultArr];
            }
        });

        arr.sort((a, b) => {
            if (a.MasterManagement_DiamondStoneTypeName < b.MasterManagement_DiamondStoneTypeName) {
                return 1; // a should come before b
            }
            if (a.MasterManagement_DiamondStoneTypeName > b.MasterManagement_DiamondStoneTypeName) {
                return -1; // a should come after b
            }
            return 0; // a and b are equivalent with respect to sorting
        });

        setDatas(arr);
        const result = data?.BillPrint_Json1.reduce((accumulator, currentValue) => {
            return {
                MetalAmount: accumulator.MetalAmount + currentValue.MetalAmount,
                OtherCharges: accumulator.OtherCharges + currentValue.OtherCharges,
            };
        }, { MetalAmount: 0, OtherCharges: 0 });
        let obj = {
            labour: result?.MetalAmount,
            other: result?.OtherCharges
        }
        setAnother(obj);
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

    const handleChangeDiscription = (e) => {
        setDiscription(e?.target?.value);
    }

    return (
        loader ? <Loader /> : msg === "" ? <>
            {/* print button  */}
            <div className={`d-flex justify-content-end mb-4 align-items-center pt-4 container-fluid max_width_container pad_60_allPrint print_sec_sum4`}>
                <div className="form-check ps-3 mt-2">
                    <input
                        type="button"
                        className="btn_white blue"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            <div className={`container-fluid max_width_container ${style?.invoicePrint4CloneContainer}`}>
                {/* Print Label */}
                <p className="fs-2 fw-bold text-center mb-4">{headerData?.PrintHeadLabel}</p>
                {/* Company Address */}
                <div className="d-flex">
                    <div className="col-9 p-2">
                        <p className="fs-4 fw-bold pb-1">{headerData?.CompanyFullName}</p>
                        <p className="pb-1">{headerData?.CompanyAddress} {headerData?.CompanyAddress2} {headerData?.CompanyPinCode} {headerData?.CompanyCountry}</p>
                        <p className="pb-1">{headerData?.CompanyCity}</p>
                        <p className="pb-1">Phone - {headerData?.CompanyTellNo}</p>
                        <p className="pb-1">{headerData?.CompanyEmail}</p>
                        <p className="pb-1">{headerData?.Company_VAT_GST_No}</p>
                        <p className="pb-1">{headerData?.Company_VAT_GST_No}asdasd</p>
                    </div>
                    <div className="col-3 p-2">
                        <img src={headerData?.PrintLogo} alt="" onError={handleImageError} className={`w-100 ${style?.imageLogoInovicePrint4} d-block ms-auto`} />
                    </div>
                </div>
                {/* Customer Address */}
                <div className="border d-flex">
                    <div className="col-6 p-2">
                        <p className="pb-1">{headerData?.lblBillTo}</p>
                        <p className="fs-4 fw-bold pb-1">{headerData?.customerfirmname}</p>
                        <p className="pb-1">{headerData?.customerAddress1}</p>
                        <p className="pb-1">{headerData?.customerAddress2}</p>
                        <p className="pb-1">{headerData?.customercity} - {headerData?.customerpincode}</p>
                        <p className="pb-1">Phone - {headerData?.customermobileno}</p>
                        <p className="pb-1">PAN No - {headerData?.Pannumber}</p>
                    </div>
                    <div className="col-6 p-2 text-end">
                        <p className="pb-1">INVOICE NO - {headerData?.InvoiceNo}</p>
                        <p className="pb-1">DATE - {headerData?.InvoiceNo}</p>
                    </div>
                </div>
                {/* Table */}
                <div className="pt-2">
                    {/* Table Header */}
                    <div className="d-flex border">
                        <div className="col-4 p-2 border-end">
                            <p className="fs-5 fw-bold text-center">DESCRIPTION</p>
                        </div>
                        <div className="col-8 d-flex">
                            <div className="col-3 p-2 fw-bold">DETAIL</div>
                            <div className="col-3 p-2 fw-bold text-center">QTYWEIGHT</div>
                            <div className="col-3 p-2 fw-bold text-center">RATE</div>
                            <div className="col-3 p-2 fw-bold text-end">AMOUNT</div>
                        </div>
                    </div>
                    {/* Table Data */}
                    <div className="d-flex border">
                        {/* <div className="col-4 p-2 border-end"> */}
                        <div className="col-4 p-2 border-end d-flex justify-content-center align-items-center">
                            <input type="text" value={discription} onChange={handleChangeDiscription} />
                            {/* <p className="fs-5 text-center"> GOLD ORNAMENTS </p>
                            <p className="fs-5 text-center"> HSN CODE 7113 </p> */}
                        </div>
                        <div className="col-8">
                            <div className="d-gird h-100 pt-2">
                                {datas?.map((e, i) => {
                                    return <div className="d-flex pb-1" key={i}>
                                        <div className="col-3 px-2">{e?.MasterManagement_DiamondStoneTypeid === 4 ? `${e?.ShapeName} ${e?.QualityName}` : e?.MasterManagement_DiamondStoneTypeName}</div>
                                        <div className="col-3 px-2 text-center">{fixedValues(e?.Wt, 3)}  gm</div>
                                        <div className="col-3 px-2 text-center">{NumberWithCommas(e?.Rate, 2)}</div>
                                        <div className="col-3 px-2 text-end">{NumberWithCommas(e?.Amount, 2)}</div>
                                    </div>
                                })}
                                <div className="d-flex pb-1">
                                    <div className="col-3 px-2">LABOUR</div>
                                    <div className="col-3 px-2 text-center"></div>
                                    <div className="col-3 px-2 text-center"></div>
                                    <div className="col-3 px-2 text-end">{NumberWithCommas(another?.labour, 2)}</div>
                                </div>
                                <div className="d-flex pb-1">
                                    <div className="col-3 px-2">OTHER</div>
                                    <div className="col-3 px-2 text-center"></div>
                                    <div className="col-3 px-2 text-center"></div>
                                    <div className="col-3 px-2 text-end">{NumberWithCommas(another?.other, 2)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex border-start border-end border-bottom">
                        <div className="col-4 p-2 border-end">
                            <p className="fs-5 text-center"> </p>
                        </div>
                        <div className="col-8">
                            <div className="d-flex pb-1">
                                <div className="col-3 p-2 fw-bold">TOTAL</div>
                                <div className="col-3 p-2 text-center">23.372  gm</div>
                                <div className="col-3 p-2 text-center"></div>
                                <div className="col-3 p-2 text-end fw-bold">128000</div>
                            </div>
                        </div>
                    </div>
                    {/* Tax Amount */}
                    <div className="d-flex border-start border-end border-bottom">
                        <div className="col-8 p-2 border-end">
                            <div dangerouslySetInnerHTML={{ __html: headerData?.PrintRemark }}></div>
                        </div>
                        <div className="col-4">
                            <div className="d-flex">
                                <div className="col-6 p-2 border-end text-center">CGST @ 0.00%</div>
                                <div className="col-6 p-2 text-end">0.00</div>
                            </div>
                            <div className="d-flex">
                                <div className="col-6 p-2 border-end text-center">SGST @ 0.00%</div>
                                <div className="col-6 p-2 text-end">0.00</div>
                            </div>
                            <div className="d-flex border-top">
                                <div className="col-6 p-2 border-end text-center fw-bold">GRAND TOTAL</div>
                                <div className="col-6 p-2 text-end fw-bold">128000</div>
                            </div>
                        </div>
                    </div>
                    {/* numbers to words */}
                    <div className="border-start border-end border-bottom p-2">
                        <p className='pb-1'>Amount Chargeable In Words</p>
                        <p className="fw-bold">Rs One Lakh Twenty-Eight Thousand Only</p>
                    </div>
                    {/* Bank Detail */}
                    <div className="d-flex border-start border-end border-bottom">
                        <div className="col-4 p-2 border-end">
                            <p className="fw-bold pb-1">Bank Detail</p>
                            <p className="pb-1">Account Name: {headerData?.accountname}</p>
                            <p className="pb-1">Bank Name: {headerData?.bankname}</p>
                            <p className="pb-1">Branch: {headerData?.bankaddress}</p>
                            <p className="pb-1">Account No.: {headerData?.accountnumber}</p>
                            <p>RTGS/NEFT IFSC: {headerData?.rtgs_neft_ifsc}</p>
                        </div>
                        <div className="col-4 p-2 border-end d-flex justify-content-between flex-column">
                            <p>Signature</p>
                            <p className='fw-bold'>{headerData?.customerfirmname}</p>
                        </div>
                        <div className="col-4 p-2 d-flex justify-content-between flex-column">
                            <p className="fw-bold">For</p>
                            <p className="fw-bold">{headerData?.CompanyFullName}</p>
                        </div>
                    </div>
                </div>
            </div>


        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default InvoicePrint4Clone