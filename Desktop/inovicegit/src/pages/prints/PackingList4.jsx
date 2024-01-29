import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/PackingList4.module.css";
import Loader from "../../components/Loader";
import {
    apiCall,
    handleImageError,
    handlePrint,
    isObjectEmpty,
    NumberWithCommas,
    otherAmountDetail,
} from "../../GlobalFunctions";
import { taxGenrator } from "./../../GlobalFunctions";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
const PackingList4 = ({ urls, token, invoiceNo, printName, evn }) => {
    const [headerData, setHeaderData] = useState({});
    const [msg, setMsg] = useState("");
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(true);
    const loadData = (data) => {
        setHeaderData(data?.BillPrint_Json[0]);
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
        setData(datas)
        console.log(datas);
    }

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

    return (
        <>
            {loader ? (
                <Loader />
            ) : (
                <>
                    {msg === "" ? (
                        <>
                            <div className={`pad_60_allPrint container max_width_container ${style?.pad_top} ${style?.pkgList4} px-1`}>
                                {/* print button */}
                                <div className={`position-fixed ${style?.print_sec_sum4}`}>
                                    <div className={`d-flex justify-content-end align-items-center  w-100`}>
                                        <div className="form-check">
                                            <input type="button" className="btn_white blue mt-0" value="Print" onClick={(e) => handlePrint(e)} />
                                        </div>
                                    </div>
                                </div>
                                {/* company details */}
                                <div className="text-center">
                                    <img src={headerData?.PrintLogo} alt="" className='imgWidth' />
                                    <p className="fw-medium">{headerData?.CompanyAddress} {headerData?.CompanyAddress2} {headerData?.CompanyCity}-{headerData?.CompanyPinCode}</p>
                                    <p className="fs-6 fw-bold">{headerData?.PrintHeadLabel}</p>
                                    <p className="fw-medium">({headerData?.PrintRemark})</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <p><span className="fw-bold">Party : </span> {headerData?.customerfirmname}</p>
                                    </div>
                                    <div>
                                        <p>Invoice No :	<span className="fw-bold">{headerData?.InvoiceNo}</span></p>
                                        <p> Date : <span className="fw-bold">{headerData?.EntryDate}</span></p>
                                    </div>
                                </div>
                                {/* table header */}
                                <div className="d-flex border">
                                    <div className={`border-end ${style?.srNo} d-flex justify-content-center align-items-center`}><p className='fw-semibold text-center'>Sr. No.</p></div>
                                    <div className={`border-end ${style?.jewelcode} d-flex justify-content-center align-items-center`}><p className='fw-semibold text-center'>Jewelcode</p></div>
                                    <div className={`border-end ${style?.diamond}`}>
                                        <p className='fw-semibold text-center border-bottom'>Diamond</p>
                                        <div className="d-flex">
                                            <div className={`border-end col-2`}><p className="fw-semibold text-center">Shape</p></div>
                                            <div className={`border-end col-2`}><p className="fw-semibold text-center">Size</p></div>
                                            <div className={`border-end col-2`}><p className="fw-semibold text-center">Pcs</p></div>
                                            <div className={`border-end col-2`}><p className="fw-semibold text-center">Wt</p></div>
                                            <div className={`border-end col-2`}><p className="fw-semibold text-center">Rate</p></div>
                                            <div className={`col-2`}><p className="fw-semibold text-center">Amount</p></div>
                                        </div>
                                    </div>
                                    <div className={`border-end ${style?.metal}`}>
                                        <p className='fw-semibold text-center border-bottom'>Metal</p>
                                        <div className="d-flex">
                                            <div className={`border-end ${style?.w_20}`}><p className='fw-semibold text-center'>Kt</p></div>
                                            <div className={`border-end ${style?.w_20}`}><p className='fw-semibold text-center'>Gr Wt</p></div>
                                            <div className={`border-end ${style?.w_20}`}><p className='fw-semibold text-center'>N+L</p></div>
                                            <div className={`border-end ${style?.w_20}`}><p className='fw-semibold text-center'>Rate</p></div>
                                            <div className={`${style?.w_20}`}><p className='fw-semibold text-center'>Amount</p></div>
                                        </div>
                                    </div>
                                    <div className={`border-end ${style?.stone}`}>
                                        <p className='fw-semibold text-center border-bottom'>Stone</p>
                                        <div className="d-flex">
                                            <div className={`border-end ${style?.w_20}`}><p className='fw-semibold text-center'>Shape</p></div>
                                            <div className={`border-end ${style?.w_20}`}><p className='fw-semibold text-center'>Pcs</p></div>
                                            <div className={`border-end ${style?.w_20}`}><p className='fw-semibold text-center'>Wt</p></div>
                                            <div className={`border-end ${style?.w_20}`}><p className='fw-semibold text-center'>Rate</p></div>
                                            <div className={`${style?.w_20}`}><p className='fw-semibold text-center'>Amount</p></div>
                                        </div>
                                    </div>
                                    <div className={`border-end ${style?.labour}`}>
                                        <p className='fw-semibold text-center border-bottom'>Labour</p>
                                        <div className="d-flex">
                                            <div className='border-end col-6'><p className="fw-semibold text-center">Rate</p></div>
                                            <div className='col-6'><p className="fw-semibold text-center">Amount</p></div>
                                        </div>
                                    </div>
                                    <div className={`border-end ${style?.other}`}>
                                        <p className='fw-semibold text-center border-bottom'>Other</p>
                                        <div className="d-flex">
                                            <div className='border-end col-6'> <p className="fw-semibold text-center">Code</p> </div>
                                            <div className='col-6'> <p className="fw-semibold text-center">Amount</p></div>
                                        </div>
                                    </div>
                                    <div className={`${style?.amount} d-flex justify-content-center align-items-center`}><p className='fw-semibold text-center'>Amount</p></div>
                                </div>
                                {/* table data */}
                                {/* <div className="d-flex border-start border-end border-bottom">
                                    <div className={`border-end ${style?.srNo}`}><p className=' text-center'>1</p></div>
                                    <div className={`border-end ${style?.jewelcode}`}>
                                        <p className=''>1941</p>
                                        <img src="http://zen/lib/jo/28/images/default.jpg" alt="" className='imgWidth2 d-block mx-auto' />
                                    </div>
                                    <div className={`border-end ${style?.diamond}`}>
                                        <div className="d-flex h-100">
                                            <div className={`border-end col-2`}>
                                                <div className="d-flex flex-column h-100 justify-content-between">
                                                    <div>
                                                        <p className="">Shape</p>
                                                    </div>
                                                    <div>
                                                        <p className="lightGrey border-top fw-semibold min_height_13">Shape</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`border-end col-2`}>
                                                <div className="d-flex flex-column h-100 justify-content-between">
                                                    <div>
                                                        <p className="">Size</p>
                                                    </div>
                                                    <div>
                                                        <p className="lightGrey border-top fw-semibold min_height_13">Size</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`border-end col-2`}>
                                                <div className="d-flex flex-column h-100 justify-content-between">
                                                    <div>
                                                        <p className="text-end">Pcs</p>
                                                    </div>
                                                    <div>
                                                        <p className="lightGrey border-top text-end fw-semibold min_height_13">Pcs</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`border-end col-2`}>
                                                <div className="d-flex flex-column h-100 justify-content-between">
                                                    <div>
                                                        <p className="text-end">Wt</p>
                                                    </div>
                                                    <div>
                                                        <p className="lightGrey border-top text-end fw-semibold min_height_13">Wt</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`border-end col-2`}>
                                                <div className="d-flex flex-column h-100 justify-content-between">
                                                    <div>
                                                        <p className="text-end">Rate</p>
                                                    </div>
                                                    <div>
                                                        <p className="lightGrey border-top text-end fw-semibold min_height_13">Rate</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`col-2`}>
                                                <div className="d-flex flex-column h-100 justify-content-between">
                                                    <div>
                                                        <p className="text-end">Amount</p>
                                                    </div>
                                                    <div>
                                                        <p className="lightGrey border-top text-end fw-semibold min_height_13">Amount</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`border-end ${style?.metal}`}>
                                        <div className="d-flex h-100">
                                            <div className={`border-end ${style?.w_20}`}>
                                                <div className="d-flex flex-column justify-content-between h-100">
                                                    <div>
                                                        <p className=''>Kt</p>
                                                    </div>
                                                    <div>
                                                        <p className="lightGrey border-top fw-semibold min_height_13">Kt</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`border-end ${style?.w_20}`}>
                                                <div className="d-flex flex-column justify-content-between h-100">
                                                    <div>     <p className=' text-end'>Gr Wt</p></div>
                                                    <div>     <p className='lightGrey border-top fw-semibold text-end min_height_13'>Gr Wt</p></div>
                                                </div>
                                            </div>
                                            <div className={`border-end ${style?.w_20}`}>
                                                <div className="d-flex flex-column justify-content-between h-100">
                                                    <div>
                                                        <p className=' text-end'>N+L</p>
                                                    </div>
                                                    <div>
                                                        <p className='lightGrey border-top fw-semibold text-end min_height_13'>N+L</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`border-end ${style?.w_20}`}>
                                                <div className="d-flex flex-column justify-content-between h-100">
                                                    <div>
                                                        <p className=' text-end'>Rate</p>
                                                    </div>
                                                    <div>
                                                        <p className='lightGrey border-top fw-semibold text-end min_height_13'>Rate</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`${style?.w_20}`}>
                                                <div className="d-flex flex-column justify-content-between h-100">
                                                    <div>
                                                        <p className=' text-end'>Amount</p>
                                                    </div>
                                                    <div>
                                                        <p className='lightGrey border-top fw-semibold text-end min_height_13'>Amount</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className={`border-end ${style?.stone}`}>
                                        <div className="d-flex h-100">
                                            <div className={`border-end ${style?.w_20}`}>
                                                <div className="d-flex flex-column justify-content-between h-100">
                                                    <div>
                                                        <p className=''>Shape</p>
                                                    </div>
                                                    <div>
                                                        <p className="lightGrey border-top fw-semibold min_height_13">Shape</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`border-end ${style?.w_20}`}>
                                                <div className="d-flex flex-column justify-content-between h-100">
                                                    <div>
                                                        <p className=''>Pcs</p>
                                                    </div>
                                                    <div>
                                                        <p className="lightGrey border-top fw-semibold text-end min_height_13">Pcs</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`border-end ${style?.w_20}`}>
                                                <div className="d-flex flex-column justify-content-between h-100">
                                                    <div>
                                                        <p className=''>Wt</p>
                                                    </div>
                                                    <div>
                                                        <p className="lightGrey border-top fw-semibold text-end min_height_13">Wt</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`border-end ${style?.w_20}`}>
                                                <div className="d-flex flex-column justify-content-between h-100">
                                                    <div>
                                                        <p className=''>Rate</p>
                                                    </div>
                                                    <div>
                                                        <p className="lightGrey border-top fw-semibold text-end min_height_13">Rate</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`${style?.w_20}`}>
                                                <div className="d-flex flex-column justify-content-between h-100">
                                                    <div>
                                                        <p className=''>Amount</p>
                                                    </div>
                                                    <div>
                                                        <p className="lightGrey border-top fw-semibold text-end min_height_13">Amount</p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className={`border-end ${style?.labour}`}>
                                        <div className="d-flex h-100">
                                            <div className={`border-end col-6`}>
                                                <div className="d-flex flex-column justify-content-between h-100">
                                                    <div>
                                                        <p className='text-end'>Rate</p>
                                                    </div>
                                                    <div>
                                                        <p className="lightGrey border-top fw-semibold text-end min_height_13">Rate</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`col-6`}>
                                                <div className="d-flex flex-column justify-content-between h-100">
                                                    <div>
                                                        <p className='text-end'>Amount</p>
                                                    </div>
                                                    <div>
                                                        <p className="lightGrey border-top fw-semibold text-end min_height_13">Amount</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`border-end ${style?.other}`}>
                                        <div className="d-flex h-100">
                                            <div className="col-6">
                                                <div className="d-flex flex-column justify-content-between h-100">
                                                    <div>
                                                        <p className=''>Code</p>
                                                    </div>
                                                    <div>
                                                        <p className="lightGrey border-top fw-semibold text-end min_height_13"></p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="d-flex flex-column justify-content-between h-100">
                                                    <div>
                                                        <p className=' text-end min_height_13'>Amount</p>
                                                    </div>
                                                    <div>
                                                        <p className="lightGrey border-top fw-semibold text-end min_height_13">Amount</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${style?.amount}`}>
                                        <div className="d-flex flex-column justify-content-between h-100">
                                            <p className='text-end'>Amount</p>
                                            <p className=' lightGrey border-top text-end fw-semibold'>Amount</p>
                                        </div>
                                    </div>
                                </div> */}
                                {
                                    data?.resultArray?.map((e, i) => {
                                        return <div className="d-flex border-start border-end border-bottom" key={i}>
                                            <div className={`border-end ${style?.srNo}`}><p className=' text-center'>{i + 1}</p></div>
                                            <div className={`border-end ${style?.jewelcode}`}>
                                                <p className=''>{e?.designno}</p>
                                                <img src={e?.DesignImage} alt="" className='imgWidth2 d-block mx-auto' onError={handleImageError} />
                                            </div>
                                            <div className={`border-end ${style?.diamond}`}>
                                                <div className="d-flex h-100">
                                                    <div className={`border-end col-2`}>
                                                        <div className="d-flex flex-column h-100 justify-content-between">
                                                            <div>
                                                                {e?.diamonds?.map((ele, ind) => {
                                                                    return <p className="">{ele?.ShapeName}</p>
                                                                })}
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold min_height_13"></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`border-end col-2`}>
                                                        <div className="d-flex flex-column h-100 justify-content-between">
                                                            <div>
                                                            {e?.diamonds?.map((ele, ind) => {
                                                                    return <p className="">{ele?.SizeName}</p>
                                                                })}
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold min_height_13"></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`border-end col-2`}>
                                                        <div className="d-flex flex-column h-100 justify-content-between">
                                                            <div>
                                                                
                                                                {e?.diamonds?.map((ele, ind) => {
                                                                    return <p className="text-end">{NumberWithCommas(ele?.Pcs, 0)}</p>
                                                                })}
                                                            </div>
                                                            <div>   
                                                                <p className="lightGrey border-top text-end fw-semibold min_height_13">{NumberWithCommas(e?.totals?.diamonds?.Pcs, 0)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`border-end col-2`}>
                                                        <div className="d-flex flex-column h-100 justify-content-between">
                                                            <div>
                                                                <p className="text-end">Wt</p>
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top text-end fw-semibold min_height_13">Wt</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`border-end col-2`}>
                                                        <div className="d-flex flex-column h-100 justify-content-between">
                                                            <div>
                                                                <p className="text-end">Rate</p>
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top text-end fw-semibold min_height_13">Rate</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`col-2`}>
                                                        <div className="d-flex flex-column h-100 justify-content-between">
                                                            <div>
                                                                <p className="text-end">Amount</p>
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top text-end fw-semibold min_height_13">Amount</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`border-end ${style?.metal}`}>
                                                <div className="d-flex h-100">
                                                    <div className={`border-end ${style?.w_20}`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                <p className=''>Kt</p>
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold min_height_13">Kt</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`border-end ${style?.w_20}`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>     <p className=' text-end'>Gr Wt</p></div>
                                                            <div>     <p className='lightGrey border-top fw-semibold text-end min_height_13'>Gr Wt</p></div>
                                                        </div>
                                                    </div>
                                                    <div className={`border-end ${style?.w_20}`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                <p className=' text-end'>N+L</p>
                                                            </div>
                                                            <div>
                                                                <p className='lightGrey border-top fw-semibold text-end min_height_13'>N+L</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`border-end ${style?.w_20}`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                <p className=' text-end'>Rate</p>
                                                            </div>
                                                            <div>
                                                                <p className='lightGrey border-top fw-semibold text-end min_height_13'>Rate</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`${style?.w_20}`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                <p className=' text-end'>Amount</p>
                                                            </div>
                                                            <div>
                                                                <p className='lightGrey border-top fw-semibold text-end min_height_13'>Amount</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className={`border-end ${style?.stone}`}>
                                                <div className="d-flex h-100">
                                                    <div className={`border-end ${style?.w_20}`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                <p className=''>Shape</p>
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold min_height_13">Shape</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`border-end ${style?.w_20}`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                <p className=''>Pcs</p>
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">Pcs</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`border-end ${style?.w_20}`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                <p className=''>Wt</p>
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">Wt</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`border-end ${style?.w_20}`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                <p className=''>Rate</p>
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">Rate</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`${style?.w_20}`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                <p className=''>Amount</p>
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">Amount</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className={`border-end ${style?.labour}`}>
                                                <div className="d-flex h-100">
                                                    <div className={`border-end col-6`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                <p className='text-end'>Rate</p>
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">Rate</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`col-6`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                <p className='text-end'>Amount</p>
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">Amount</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`border-end ${style?.other}`}>
                                                <div className="d-flex h-100">
                                                    <div className="col-6">
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                <p className=''>Code</p>
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold text-end min_height_13"></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                <p className=' text-end min_height_13'>Amount</p>
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">Amount</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`${style?.amount}`}>
                                                <div className="d-flex flex-column justify-content-between h-100">
                                                    <p className='text-end'>Amount</p>
                                                    <p className=' lightGrey border-top text-end fw-semibold'>Amount</p>
                                                </div>
                                            </div>
                                        </div>
                                    })
                                }
                                {/* table total */}
                                <div className="d-flex border-start border-end border-bottom">
                                    <div className={`border-end ${style?.srNo}`}><p className='lightGrey text-center min_height_13'></p></div>
                                    <div className={`border-end ${style?.jewelcode}`}>
                                        <p className='lightGrey fw-semibold text-center'>Total</p>
                                    </div>
                                    <div className={`border-end ${style?.diamond}`}>
                                        <div className="d-flex h-100">
                                            <div className={`border-end col-2`}>
                                                <p className="lightGrey border-top fw-semibold min_height_13">Shape</p>
                                            </div>
                                            <div className={`border-end col-2`}>
                                                <p className="lightGrey border-top fw-semibold min_height_13">Size</p>
                                            </div>
                                            <div className={`border-end col-2`}>
                                                <p className="lightGrey border-top text-end fw-semibold min_height_13">Pcs</p>
                                            </div>
                                            <div className={`border-end col-2`}>
                                                <p className="lightGrey border-top text-end fw-semibold min_height_13">Wt</p>
                                            </div>
                                            <div className={`border-end col-2`}>
                                                <p className="lightGrey border-top text-end fw-semibold min_height_13">Rate</p>
                                            </div>
                                            <div className={`col-2`}>
                                                <p className="lightGrey border-top text-end fw-semibold min_height_13">Amount</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`border-end ${style?.metal}`}>
                                        <div className="d-flex h-100">
                                            <div className={`border-end ${style?.w_20}`}>
                                                <p className="lightGrey border-top fw-semibold min_height_13"></p>
                                            </div>
                                            <div className={`border-end ${style?.w_20}`}>
                                                <p className='lightGrey border-top fw-semibold text-end min_height_13'></p>
                                            </div>
                                            <div className={`border-end ${style?.w_20}`}>
                                                <p className='lightGrey border-top fw-semibold text-end min_height_13'>N+L</p>
                                            </div>
                                            <div className={`border-end ${style?.w_20}`}>
                                                <p className='lightGrey border-top fw-semibold text-end min_height_13'>Rate</p>
                                            </div>
                                            <div className={`${style?.w_20}`}>
                                                <p className='lightGrey border-top fw-semibold text-end min_height_13'>Amount</p>
                                            </div>
                                        </div>

                                    </div>
                                    <div className={`border-end ${style?.stone}`}>
                                        <div className="d-flex h-100">
                                            <div className={`border-end ${style?.w_20}`}>
                                                <p className="lightGrey border-top fw-semibold min_height_13">Shape</p>
                                            </div>
                                            <div className={`border-end ${style?.w_20}`}>
                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">Pcs</p>
                                            </div>
                                            <div className={`border-end ${style?.w_20}`}>
                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">Wt</p>
                                            </div>
                                            <div className={`border-end ${style?.w_20}`}>
                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">Rate</p>
                                            </div>
                                            <div className={`${style?.w_20}`}>
                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">Amount</p>
                                            </div>

                                        </div>
                                    </div>
                                    <div className={`border-end ${style?.labour}`}>
                                        <div className="d-flex h-100">
                                            <div className={`border-end col-6`}>
                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">Rate</p>
                                            </div>
                                            <div className={`col-6`}>
                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">Amount</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`border-end ${style?.other}`}>
                                        <div className="d-flex h-100">
                                            <div className="col-6">
                                                <p className="lightGrey border-top fw-semibold text-end min_height_13"></p>
                                            </div>
                                            <div className="col-6">
                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">Amount</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${style?.amount}`}>
                                        <div className="d-flex flex-column justify-content-between h-100">
                                            <p className=' lightGrey border-top text-end fw-semibold'>Amount</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
                            {msg}
                        </p>
                    )}
                </>
            )}
        </>
    );
}

export default PackingList4
