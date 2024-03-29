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
import { cloneDeep, findIndex } from 'lodash';
const PackingList4 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [headerData, setHeaderData] = useState({});
    const [msg, setMsg] = useState("");
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(true);
    const [total, setTotal] = useState({
        netWt: 0,
        metalAmount: 0
    })
    const [isImageWorking, setIsImageWorking] = useState(true);
    const handleImageErrors = () => {
        setIsImageWorking(false);
    };
    const loadData = (data) => {
        setHeaderData(data?.BillPrint_Json[0]);
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
        let resultArr = [];
        let netWts = 0;
        let metalAmountss = 0;
        datas?.resultArray?.forEach((e, i) => {
            let obj = cloneDeep(e);
            let netWtss = 0;
            let metalAmounts = 0;
            if (e?.metal?.length <= 1) {
                netWts += e?.NetWt + e?.LossWt;
                netWtss += e?.NetWt + e?.LossWt;
                if (e?.metal?.length === 1) {
                    metalAmounts += e?.metal[0]?.Amount;
                    metalAmountss += e?.metal[0]?.Amount;
                }
            } else {
                let findMetal = e?.metal?.findIndex((ele, ind) => ele?.IsPrimaryMetal === 1);
                if (findMetal !== -1) {
                    netWts += e?.metal[findMetal]?.Wt;
                    netWtss += e?.metal[findMetal]?.Wt;
                    metalAmounts += e?.metal[findMetal]?.Amount;
                    metalAmountss += e?.metal[findMetal]?.Amount;
                }
            }
            obj.netWtss = netWtss;
            obj.metalAmounts = metalAmounts;
            resultArr?.push(obj);
        });
        datas.resultArray = resultArr;
        setTotal({ ...total, netWt: netWts, metalAmount: metalAmountss });
        setData(datas);
        console.log(datas);
    }

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
                                <div className={`position-absolute ${style?.print_sec_sum4}`}>
                                    <div className={`d-flex justify-content-end align-items-center  w-100`}>
                                        <div className={`form-check ${style?.font_14}`}>
                                            <input type="button" className={`btn_white blue mt-0`} value="Print" onClick={(e) => handlePrint(e)} />
                                        </div>
                                    </div>
                                </div>
                                {/* company details */}
                                <div className={`text-center ${style?.font_12}`}>
                                    {/* <img src={headerData?.PrintLogo} alt="" className='imgWidth' style={{ maxWidth: "115px" }} /> */}
                                    {isImageWorking && (headerData?.PrintLogo !== "" &&
                                        <img src={headerData?.PrintLogo} alt=""
                                        className='imgWidth' style={{ maxWidth: "115px" }} 
                                            onError={handleImageErrors}  />)}

                                    <p className="fw-medium fw-bold">{headerData?.CompanyAddress} {headerData?.CompanyAddress2} {headerData?.CompanyCity}-{headerData?.CompanyPinCode}</p>
                                    <p className=" fw-bold" style={{ fontSize: "18px" }}>{headerData?.PrintHeadLabel}</p>
                                    <p className="fw-medium fw-bold" style={{ fontSize: "11px" }}>({headerData?.PrintRemark})</p>
                                </div>
                                <div className={`d-flex justify-content-between`}>
                                    <div className={`${style?.font_14}`}>
                                        <p><span className="fw-bold">Party : </span> {headerData?.customerfirmname}</p>
                                    </div>
                                    <div className={`${style?.font_12}`}>
                                        <p>Invoice No :	<span className="fw-bold">{headerData?.InvoiceNo}</span></p>
                                        <p> Date : <span className="fw-bold">{headerData?.EntryDate}</span></p>
                                    </div>
                                </div>
                                {/* table header */}
                                <div className='border-start border-end border-top border-black mb-1'>
                                    <div className={`d-flex border-bottom lightGrey ${style?.font_1_12}`}>
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
                                </div>
                                {/* table data */}
                                {data?.resultArray?.map((e, i) => {
                                    return <div key={i} className='border-start border-end border-black'>
                                        <div className={`d-flex  border-bottom no_break ${style?.font_1_12} ${i === 0 && "border-top"}`} >
                                            <div className={`border-end ${style?.srNo}`}><p className=' text-center'>{i + 1}</p></div>
                                            <div className={`border-end ${style?.jewelcode}`}>
                                                <p className=''>{e?.designno}</p>
                                                <img src={e?.DesignImage} alt="" className='imgWidth2 d-block mx-auto' onError={handleImageError} />
                                                <p className="text-center">HUID-{e?.HUID}</p>
                                            </div>
                                            <div className={`border-end ${style?.diamond}`}>
                                                <div className="d-flex h-100">
                                                    <div className={`border-end col-2`}>
                                                        <div className="d-flex flex-column h-100 justify-content-between">
                                                            <div>
                                                                {e?.diamonds?.map((ele, ind) => {
                                                                    return <p className="" key={ind}>{ele?.ShapeName}</p>
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
                                                                    return <p className="" key={ind}>{ele?.SizeName}</p>
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
                                                                    return <p className="text-end" key={ind}>{NumberWithCommas(ele?.Pcs, 0)}</p>
                                                                })}
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top text-end fw-semibold min_height_13">{e?.totals?.diamonds?.Pcs > 0 && NumberWithCommas(e?.totals?.diamonds?.Pcs, 0)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`border-end col-2`}>
                                                        <div className="d-flex flex-column h-100 justify-content-between">
                                                            <div>
                                                                {e?.diamonds?.map((ele, ind) => {
                                                                    return <p className="text-end" key={ind}>{NumberWithCommas(ele?.Wt, 3)}</p>
                                                                })}
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top text-end fw-semibold min_height_13">{e?.totals?.diamonds?.Wt > 0 && NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`border-end col-2`}>
                                                        <div className="d-flex flex-column h-100 justify-content-between">
                                                            <div>
                                                                {e?.diamonds?.map((ele, ind) => {
                                                                    return <p className="text-end" key={ind}>{NumberWithCommas(ele?.Rate, 2)}</p>
                                                                })}
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top text-end fw-semibold min_height_13">{e?.totals?.diamonds?.Rate > 0 && NumberWithCommas(e?.totals?.diamonds?.Rate, 2)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`col-2`}>
                                                        <div className="d-flex flex-column h-100 justify-content-between">
                                                            <div>
                                                                {e?.diamonds?.map((ele, ind) => {
                                                                    return <p className="text-end" key={ind}>{NumberWithCommas(ele?.Amount, 2)}</p>
                                                                })}
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top text-end fw-semibold min_height_13">{e?.totals?.diamonds?.Amount > 0 && NumberWithCommas(e?.totals?.diamonds?.Amount, 2)}</p>
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
                                                                {
                                                                    e?.metal?.map((ele, ind) => {
                                                                        return ind === 0 && <p key={ind}>{ele?.ShapeName} {ele?.QualityName}</p>
                                                                    })
                                                                }
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold min_height_13"></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`border-end ${style?.w_20}`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div><p className=' text-end'>{NumberWithCommas(e?.grosswt, 3)}</p></div>
                                                            <div><p className='lightGrey border-top fw-semibold text-end min_height_13'>{e?.grosswt > 0 && NumberWithCommas(e?.grosswt, 3)}</p></div>
                                                        </div>
                                                    </div>
                                                    <div className={`border-end ${style?.w_20}`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                {/* e?.metal?.length === 1 ? NumberWithCommas(e?.NetWt + e?.LossWt, 3) : ( )*/}
                                                                <p className=' text-end'>{e?.netWtss}</p>
                                                            </div>
                                                            <div>
                                                                <p className='lightGrey border-top fw-semibold text-end min_height_13'>{(e?.netWtss > 0) && NumberWithCommas(e?.netWtss, 3)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`border-end ${style?.w_20}`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                {
                                                                    e?.metal?.map((ele, ind) => {
                                                                        return <p key={ind} className='text-end'>{NumberWithCommas(ele?.Rate, 2)} </p>
                                                                    })
                                                                }
                                                            </div>
                                                            <div>
                                                                <p className='lightGrey border-top fw-semibold text-end min_height_13'></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`${style?.w_20}`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                <p className="text-end">{NumberWithCommas(e?.metalAmounts, 2)}</p>
                                                                {/* {
                                                                e?.metal?.map((ele, ind) => {
                                                                    return <p key={ind} className='text-end'>{NumberWithCommas(ele?.Amount, 2)} </p>
                                                                })
                                                            } */}
                                                            </div>
                                                            <div>
                                                                <p className='lightGrey border-top fw-semibold text-end min_height_13'>{e?.metalAmounts > 0 && NumberWithCommas(e?.metalAmounts, 2)}</p>
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
                                                                {e?.colorstone?.map((ele, ind) => {
                                                                    return <p className='' key={ind}>{ele?.ShapeName}</p>
                                                                })}
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold min_height_13"></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`border-end ${style?.w_20}`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                {e?.colorstone?.map((ele, ind) => {
                                                                    return <p className='text-end' key={ind}>{NumberWithCommas(ele?.Pcs, 0)}</p>
                                                                })}
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">{e?.totals?.colorstone?.Pcs > 0 && NumberWithCommas(e?.totals?.colorstone?.Pcs, 0)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`border-end ${style?.w_20}`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                {e?.colorstone?.map((ele, ind) => {
                                                                    return <p className='text-end' key={ind}>{NumberWithCommas(ele?.Wt, 3)}</p>
                                                                })}
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">{e?.totals?.colorstone?.Wt > 0 && NumberWithCommas(e?.totals?.colorstone?.Wt, 3)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`border-end ${style?.w_20}`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                {e?.colorstone?.map((ele, ind) => {
                                                                    return <p className='text-end' key={ind}>{NumberWithCommas(ele?.Rate, 2)}</p>
                                                                })}
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold text-end min_height_13"></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`${style?.w_20}`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                {e?.colorstone?.map((ele, ind) => {
                                                                    return <p className='text-end' key={ind}>{NumberWithCommas(ele?.Amount, 2)}</p>
                                                                })}
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">{e?.totals?.colorstone?.Amount > 0 && NumberWithCommas(e?.totals?.colorstone?.Amount, 2)}</p>
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
                                                                <p className='text-end'>{NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold text-end min_height_13"></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`col-6`}>
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                <p className='text-end'>{NumberWithCommas(e?.MakingAmount + e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount, 2)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">{NumberWithCommas(e?.MakingAmount + e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount, 2)}</p>
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
                                                                {e?.other_details?.map((ele, ind) => {
                                                                    return <p className='' key={ind}>{ele?.label}</p>
                                                                })}
                                                                {e?.TotalDiamondHandling !== 0 && <p className=" min_height_13">Handling</p>}

                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold text-end min_height_13"></p>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="d-flex flex-column justify-content-between h-100">
                                                            <div>
                                                                {e?.other_details?.map((ele, ind) => {
                                                                    return <p className='text-end min_height_13' key={ind}>{NumberWithCommas(+ele?.value, 2)}</p>
                                                                })}
                                                                {e?.TotalDiamondHandling !== 0 && <p className=" text-end min_height_13">{NumberWithCommas(e?.TotalDiamondHandling, 2)}</p>}
                                                            </div>
                                                            <div>
                                                                <p className="lightGrey border-top fw-semibold text-end min_height_13">{e?.OtherCharges > 0 && NumberWithCommas(e?.OtherCharges + e?.TotalDiamondHandling, 2)}</p>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`${style?.amount}`}>
                                                <div className="d-flex flex-column justify-content-between h-100">
                                                    <p className='text-end'>{NumberWithCommas(e?.TotalAmount, 2)}</p>
                                                    <p className=' lightGrey border-top text-end fw-semibold'>{e?.TotalAmount > 0 && NumberWithCommas(e?.TotalAmount, 2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                })
                                }
                                {/* table total */}
                                <div className='border-start border-end border-black'>
                                    <div className={`d-flex  border-bottom no_break lightGrey ${style?.font_1_12}`}>
                                        <div className={`border-end ${style?.srNo}`}><p className=' text-center min_height_13'></p></div>
                                        <div className={`border-end ${style?.jewelcode}`}>
                                            <p className=' fw-semibold text-center'>Total</p>
                                        </div>
                                        <div className={`border-end ${style?.diamond}`}>
                                            <div className="d-flex h-100">
                                                <div className={`border-end col-2`}>
                                                    <p className="lightGrey border-top fw-semibold min_height_13"></p>
                                                </div>
                                                <div className={`border-end col-2`}>
                                                    <p className="lightGrey border-top fw-semibold min_height_13"></p>
                                                </div>
                                                <div className={`border-end col-2`}>
                                                    <p className="lightGrey border-top text-end fw-semibold min_height_13">{data?.mainTotal?.diamonds?.Pcs > 0 && NumberWithCommas(data?.mainTotal?.diamonds?.Pcs, 0)}</p>
                                                </div>
                                                <div className={`border-end col-2`}>
                                                    <p className="lightGrey border-top text-end fw-semibold min_height_13">{data?.mainTotal?.diamonds?.Wt > 0 && NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)}</p>
                                                </div>
                                                <div className={`border-end col-2`}>
                                                    <p className="lightGrey border-top text-end fw-semibold min_height_13"></p>
                                                </div>
                                                <div className={`col-2`}>
                                                    <p className="lightGrey border-top text-end fw-semibold min_height_13">{data?.mainTotal?.diamonds?.Amount > 0 && NumberWithCommas(data?.mainTotal?.diamonds?.Amount, 2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`border-end ${style?.metal}`}>
                                            <div className="d-flex h-100">
                                                <div className={`border-end ${style?.w_20}`}>
                                                    <p className=" border-top fw-semibold min_height_13"></p>
                                                </div>
                                                <div className={`border-end ${style?.w_20}`}>
                                                    <p className=' border-top fw-semibold text-end min_height_13'>{data?.mainTotal?.grosswt > 0 && NumberWithCommas(data?.mainTotal?.grosswt, 3)}</p>
                                                </div>
                                                <div className={`border-end ${style?.w_20}`}>
                                                    <p className=' border-top fw-semibold text-end min_height_13'>{total?.netWt > 0 && NumberWithCommas(total?.netWt, 3)}</p>
                                                </div>
                                                <div className={`border-end ${style?.w_20}`}>
                                                    <p className=' border-top fw-semibold text-end min_height_13'></p>
                                                </div>
                                                <div className={`${style?.w_20}`}>
                                                    <p className=' border-top fw-semibold text-end min_height_13'>{total?.metalAmount > 0 && NumberWithCommas(total?.metalAmount, 2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`border-end ${style?.stone}`}>
                                            <div className="d-flex h-100">
                                                <div className={`border-end ${style?.w_20}`}>
                                                    <p className=" border-top fw-semibold min_height_13"></p>
                                                </div>
                                                <div className={`border-end ${style?.w_20}`}>
                                                    <p className=" border-top fw-semibold text-end min_height_13">{data?.mainTotal?.colorstone?.Pcs > 0 && NumberWithCommas(data?.mainTotal?.colorstone?.Pcs, 0)}</p>
                                                </div>
                                                <div className={`border-end ${style?.w_20}`}>
                                                    <p className=" border-top fw-semibold text-end min_height_13">{data?.mainTotal?.colorstone?.Wt > 0 && NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)}</p>
                                                </div>
                                                <div className={`border-end ${style?.w_20}`}>
                                                    <p className=" border-top fw-semibold text-end min_height_13"></p>
                                                </div>
                                                <div className={`${style?.w_20}`}>
                                                    <p className=" border-top fw-semibold text-end min_height_13">{data?.mainTotal?.colorstone?.Amount > 0 && NumberWithCommas(data?.mainTotal?.colorstone?.Amount, 2)}</p>
                                                </div>

                                            </div>
                                        </div>
                                        <div className={`border-end ${style?.labour}`}>
                                            <div className="d-flex h-100">
                                                <div className={`border-end col-6`}>
                                                    <p className=" border-top fw-semibold text-end min_height_13"></p>
                                                </div>
                                                <div className={`col-6`}>
                                                    <p className=" border-top fw-semibold text-end min_height_13">{(data?.mainTotal?.total_Making_Amount + data?.mainTotal?.totalMiscAmount + data?.mainTotal?.diamonds?.SettingAmount + data?.mainTotal?.colorstone?.SettingAmount) > 0 && NumberWithCommas(data?.mainTotal?.total_Making_Amount + data?.mainTotal?.diamonds?.SettingAmount + data?.mainTotal?.colorstone?.SettingAmount, 2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`border-end ${style?.other}`}>
                                            <div className="d-flex h-100">
                                                <div className="col-6">
                                                    <p className=" border-top fw-semibold text-end min_height_13"></p>
                                                </div>
                                                <div className="col-6">
                                                    <p className=" border-top fw-semibold text-end min_height_13">{data?.mainTotal?.total_otherCharge_Diamond_Handling > 0 && NumberWithCommas(data?.mainTotal?.total_otherCharge_Diamond_Handling, 2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`${style?.amount}`}>
                                            <div className="d-flex flex-column justify-content-between h-100">
                                                <p className='  border-top text-end fw-semibold'>{data?.mainTotal?.total_amount > 0 && NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* taxes */}
                                <div className={`d-flex border-start border-end border-bottom border-black no_break ${style?.font_1_12}`}>
                                    <div className={`${style?.taxes}`}>
                                        {data?.mainTotal?.total_discount_amount > 0 && <p className="text-end">Total Discount </p>}
                                        {data?.allTaxes?.map((e, i) => {
                                            return <p className="text-end" key={i}>{e?.name} @ {e?.per} </p>
                                        })}
                                        {headerData?.AddLess !== 0 && <p className='text-end'>{headerData?.AddLess > 0 ? "Add" : "Less"}</p>}
                                        <p className="text-end">Grand Total	</p>
                                    </div>
                                    <div className={`${style?.amount}`}>
                                        {data?.mainTotal?.total_discount_amount > 0 && <p className="text-end">{NumberWithCommas(data?.mainTotal?.total_discount_amount, 2)} </p>}
                                        {data?.allTaxes?.map((e, i) => {
                                            return <p className="text-end" key={i}>{NumberWithCommas(+e?.amount, 2)} </p>
                                        })}
                                        {headerData?.AddLess !== 0 && <p className='text-end'>{NumberWithCommas(headerData?.AddLess, 2)}</p>}
                                        <p className="text-end">{NumberWithCommas(data?.finalAmount, 2)}</p>
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
