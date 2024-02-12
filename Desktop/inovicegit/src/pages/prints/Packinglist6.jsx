import React, { useEffect, useState } from "react";
import style from "../../assets/css/prints/PackingList6.module.css";
import Loader from "../../components/Loader";
import {
    apiCall,
    fixedValues,
    FooterComponent,
    handleImageError,
    handlePrint,
    HeaderComponent,
    isObjectEmpty,
    NumberWithCommas,
    otherAmountDetail,
} from "../../GlobalFunctions";
import { taxGenrator } from "./../../GlobalFunctions";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { ToWords } from "to-words";
const Packinglist6 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const toWords = new ToWords();
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const [header, setHeader] = useState(null);
    const [footer, setFooter] = useState(null);
    const [headerData, setHeaderData] = useState({});
    const loadData = (data) => {
        let head = HeaderComponent("1", data?.BillPrint_Json[0]);
        setHeader(head);
        let footers = FooterComponent("2", data?.BillPrint_Json[0]);
        setFooter(footers);
        setHeaderData(data?.BillPrint_Json[0]);
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
        setData(datas);
        // console.log(datas);
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
            <div className={`container max_width_container ${style?.Packinglist6} pad_60_allPrint px-1 mt-1`}>
                {/* buttons */}
                <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
                    <div className="form-check ps-3 position-fixed" style={{ right: "5px" }}>
                        <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* header */}
                <div>
                    <img src={headerData?.PrintLogo} alt="" className="logoimg d-block mx-auto" />
                    <p className="fw-bold text-center">{headerData?.CompanyAddress} {headerData?.CompanyAddress2} {headerData?.CompanyCity}-{headerData?.CompanyPinCode}</p>
                    {headerData?.PrintHeadLabel !== "" && <p className="fs-6 fw-bold">{headerData?.PrintHeadLabel}</p>}
                    <div className="d-flex justify-content-between">
                        <p><span className="fw-bold">Party :  </span>{headerData?.customerfirmname}</p>
                        <div>
                            <p>Invoice No : <span className="fw-bold">{headerData?.InvoiceNo}</span></p>
                            <p>Date : <span className="fw-bold">{headerData?.EntryDate}</span></p>
                        </div>
                    </div>

                </div>
                {/* table header */}
                <div className="border-bottom">
                    <div className="d-flex  border-start border-end border-top border-black">
                        <div className={`${style?.srNo} border-end d-flex justify-content-center align-items-center`}><p className="fw-bold">Sr. No.</p></div>
                        <div className={`${style?.Jewelcode} border-end d-flex justify-content-center align-items-center`}><p className="fw-bold">Jewelcode	</p></div>
                        <div className={`${style?.Metal} border-end`}>
                            <div className="d-grid h-100">
                                <div className="d-flex border-bottom justify-content-center"><p className="fw-bold text-center">Metal</p></div>
                                <div className="d-flex">
                                    <p className={`fw-bold border-end text-center ${style?.w_20}`}>Kt</p>
                                    <p className={`fw-bold border-end text-center ${style?.w_20}`}>Gr Wt</p>
                                    <p className={`fw-bold border-end text-center ${style?.w_20}`}>Net Wt</p>
                                    <p className={`fw-bold border-end text-center ${style?.w_20}`}>Rate</p>
                                    <p className={`fw-bold text-center ${style?.w_20}`}>Amount</p>
                                </div>
                            </div>
                        </div>
                        <div className={`${style?.Stone} border-end`}>
                            <div className="d-grid h-100">
                                <div className="d-flex border-bottom justify-content-center"><p className="fw-bold text-center">Stone</p></div>
                                <div className="d-flex">
                                    <p className="fw-bold col-3 border-end text-center">Shape</p>
                                    <p className="fw-bold col-3 border-end text-center">Wt</p>
                                    <p className="fw-bold col-3 border-end text-center">Rate</p>
                                    <p className="fw-bold col-3 text-center">Amount</p>
                                </div>
                            </div>
                        </div>
                        <div className={`${style?.Labour} border-end`}>
                            <div className="d-grid h-100">
                                <div className="d-flex border-bottom justify-content-center"><p className="fw-bold text-center">Labour</p></div>
                                <div className="d-flex">
                                    <p className="fw-bold text-center col-6 border-end">Rate</p>
                                    <p className="fw-bold text-center col-6">Amount</p>
                                </div>
                            </div>
                        </div>
                        <div className={`${style?.Other} border-end`}>
                            <div className="d-grid h-100">
                                <div className="d-flex border-bottom justify-content-center"><p className="fw-bold text-center">Other</p></div>
                                <div className="d-flex">
                                    <p className="fw-bold text-center col-4 border-end">Code</p>
                                    <p className="fw-bold text-center col-4 border-end">Number</p>
                                    <p className="fw-bold text-center col-4">Amount</p>
                                </div>
                            </div>
                        </div>
                        <div className={`${style?.Price} d-flex justify-content-center align-items-center`}><p className="fw-bold text-center">Price</p></div>
                    </div>
                </div>
                {/* table data */}
                {data?.resultArray?.map((e, i) => {
                    return <React.Fragment key={i}>
                        <div className="border-start border-end border-black no_break">
                            <div className="d-flex border-bottom">
                                <div className={`${style?.srNo} border-end d-flex justify-content-center align-items-center`}><p className="">{i + 1}</p></div>
                                <div className={`${style?.Jewelcode} border-end`}>
                                    <div className="d-flex justify-content-between px_1">
                                        <p className="">{e?.SrJobno}</p>
                                        <p className="">{e?.designno}</p>
                                    </div>
                                    <img src={e?.DesignImage} alt="" className="imgWidth" onError={handleImageError} />
                                </div>
                                <div className={`${style?.Metal} border-end d-flex`}>
                                    <div className={`${style?.w_20} border-end  d-flex justify-content-between flex-column`}>
                                        <div>
                                            {
                                                e?.metal?.map((ele, ind) => {
                                                    return <p className={`min_height_9_6`} key={ind}>{ele?.ShapeName} {ele?.QualityName} </p>
                                                })
                                            }
                                        </div>
                                        <div className="border-top lightGrey">
                                            <p className={` min_height_9_6 fw-bold`}></p>
                                        </div>
                                    </div>
                                    <div className={`${style?.w_20} border-end  d-flex justify-content-between flex-column`}>
                                        <div>
                                            {
                                                e?.metal?.map((ele, ind) => {
                                                    return <p className={`min_height_9_6 text-end`} key={ind}>{ind === 0 && NumberWithCommas(e?.grosswt, 3)} </p>
                                                })
                                            }
                                        </div>
                                        <div className="border-top lightGrey">
                                            <p className={`min_height_9_6 text-end fw-bold`}>{NumberWithCommas(e?.grosswt, 3)} </p>
                                        </div>
                                    </div>
                                    <div className={`${style?.w_20} border-end  d-flex justify-content-between flex-column`}>
                                        <div>
                                            <p className={`min_height_9_6 text-end`}>{NumberWithCommas(e?.NetWt + e?.LossWt, 3)} </p>
                                        </div>
                                        <div className="border-top lightGrey">
                                            <p className={` text-end min_height_9_6 fw-bold`}>
                                                {NumberWithCommas(e?.NetWt + e?.LossWt, 3)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`${style?.w_20} border-end  d-flex justify-content-between flex-column`}>
                                        <div>
                                            {
                                                e?.metal?.map((ele, ind) => {
                                                    return <p className={`min_height_9_6 text-end`} key={ind}>{NumberWithCommas(ele?.Rate, 2)} </p>
                                                })
                                            }
                                        </div>
                                        <div className="border-top lightGrey">
                                            <p className={` text-end min_height_9_6 fw-bold`}></p>
                                        </div>
                                    </div>
                                    <div className={`${style?.w_20} d-flex justify-content-between flex-column`}>
                                        <div>
                                            {
                                                e?.metal?.map((ele, ind) => {
                                                    return <p className={`min_height_9_6 text-end`} key={ind}>{NumberWithCommas(ele?.Amount, 2)} </p>
                                                })
                                            }
                                        </div>
                                        <div className="border-top lightGrey">
                                            <p className=" text-end fw-bold">{NumberWithCommas(e?.totals?.metal?.Amount, 2)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${style?.Stone} border-end d-flex`}>
                                    <div className=" col-3 border-end text-end d-flex justify-content-between flex-column">
                                        <div> {
                                            e?.colorstone?.map((ele, ind) => {
                                                return <p key={ind}>{ele?.ShapeName}</p>
                                            })
                                        }
                                        </div>
                                        <div className="border-top lightGrey "><p className="min_height_9_6 fw-bold"></p></div>
                                    </div>
                                    <div className=" col-3 border-end text-end d-flex justify-content-between flex-column">
                                        <div>
                                            {
                                                e?.colorstone?.map((ele, ind) => {
                                                    return <p key={ind}>{NumberWithCommas(ele?.Wt, 3)}</p>
                                                })
                                            }
                                        </div>
                                        <div className="border-top lightGrey ">
                                            <p className="text-end min_height_9_6 fw-bold">{e?.totals?.colorstone?.Wt !== 0 && NumberWithCommas(e?.totals?.colorstone?.Wt, 3)}</p>
                                        </div>
                                    </div>
                                    <div className=" col-3 border-end text-end d-flex justify-content-between flex-column">
                                        <div>
                                            {
                                                e?.colorstone?.map((ele, ind) => {
                                                    return <p key={ind}>{NumberWithCommas(ele?.Rate, 2)}</p>
                                                })
                                            }
                                        </div>
                                        <div className="border-top lightGrey">
                                            <p className="min_height_9_6 fw-bold"></p>
                                        </div>
                                    </div>
                                    <div className=" col-3 text-end d-flex justify-content-between flex-column">
                                        <div>
                                            {
                                                e?.colorstone?.map((ele, ind) => {
                                                    return <p key={ind}>{NumberWithCommas(ele?.Amount, 2)}</p>
                                                })
                                            }
                                        </div>
                                        <div className="border-top lightGrey">
                                            <p className="min_height_9_6 fw-bold"> {e?.totals?.colorstone?.Amount !== 0 && NumberWithCommas(e?.totals?.colorstone?.Amount, 2)} </p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${style?.Labour} border-end d-flex`}>
                                    <div className="text-end col-6 border-end d-flex flex-column justify-content-between">
                                        <div>
                                            <p>{NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p>
                                        </div>
                                        <div className="border-top lightGrey ">
                                            <p className="min_height_9_6 fw-bold"></p>
                                        </div>
                                    </div>
                                    <div className=" text-end col-6 d-flex flex-column justify-content-between">
                                        <div>
                                            <p>{NumberWithCommas(e?.MakingAmount+e?.MiscAmount, 2)}</p>
                                        </div>
                                        <div className="border-top lightGrey">
                                            <p className="min_height_9_6 fw-bold">{NumberWithCommas(e?.MakingAmount, 2)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${style?.Other} border-end d-flex`}>
                                    <div className=" col-4 border-end  d-flex flex-column justify-content-between">
                                        <div>
                                            {e?.other_details?.map((ele, ind) => {
                                                return <p className="" key={ind}>{ele?.label}</p>
                                            })}

                                        </div>
                                        <div className="border-top lightGrey">
                                            <p className="min_height_9_6 fw-bold"></p>
                                        </div>
                                    </div>
                                    <div className="col-4 border-end  d-flex flex-column justify-content-between">
                                        <div>
                                            <p className="text-end" ></p>
                                        </div>
                                        <div className="border-top lightGrey">
                                            <p className="min_height_9_6 text-end fw-bold"></p>
                                        </div>
                                    </div>
                                    <div className=" text-center col-4  d-flex flex-column justify-content-between">
                                        <div>
                                            {e?.other_details?.map((ele, ind) => {
                                                return <p className="text-end" key={ind}>{NumberWithCommas(+ele?.value, 2)}</p>
                                            })}
                                        </div>
                                        <div className="border-top lightGrey">
                                            <p className="min_height_9_6 text-end fw-bold">{NumberWithCommas(e?.OtherCharges, 2)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${style?.Price} d-flex justify-content-between flex-column`}>
                                    <div>
                                        <p className="text-end">{NumberWithCommas(e?.UnitCost, 2)}</p>
                                    </div>
                                    <div className="border-top lightGrey">
                                        <p className="min_height_9_6 text-end fw-bold">{NumberWithCommas(e?.UnitCost, 2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-bottom  no_break">
                            {e?.Discount !== 0 && <div className="d-flex  border-start border-end border-black">
                                <div className={`${style?.srNo} border-end d-flex justify-content-center align-items-center`}><p className="fw-bold px_1"></p></div>
                                <div className={`${style?.Jewelcode} border-end d-flex justify-content-center align-items-center`}><p className="fw-bold px_1"></p></div>
                                <div className={`${style?.discount} border-end lightGrey`}>
                                    <p className={`fw-bold text-end px_1`}>Discount {e?.Discount}% @Total Amount	</p>
                                </div>
                                <div className={`${style?.otherAmount} border-end lightGrey`}>
                                    <p className={`fw-bold text-end px_1`}>{NumberWithCommas(e?.DiscountAmt, 2)}</p>
                                </div>
                                <div className={`${style?.Price} lightGrey`}><p className="fw-bold text-end px_1">{NumberWithCommas(e?.TotalAmount, 2)} </p></div>
                            </div>}
                        </div>
                    </React.Fragment>
                })}
                {/* table total */}
                <div className="border-bottom lightGrey no_break">
                    <div className="d-flex  border-start border-end border-black">
                        <div className={`${style?.total} border-end d-flex justify-content-center align-items-center`}><p className="fw-bold px_1">Total</p></div>
                        <div className={`${style?.Metal} border-end d-flex`}>
                            <p className={`fw-bold border-end text-center ${style?.w_20} px_1`}></p>
                            <p className={`fw-bold border-end text-end ${style?.w_20} px_1`}>{NumberWithCommas(data?.mainTotal?.grosswt, 3)}</p>
                            <p className={`fw-bold border-end text-end ${style?.w_20} px_1`}>{NumberWithCommas(data?.mainTotal?.netwt + data?.mainTotal?.lossWt, 3)}</p>
                            <p className={`fw-bold border-end text-end ${style?.w_20} px_1`}></p>
                            <p className={`fw-bold text-end ${style?.w_20} px_1`}>{NumberWithCommas(data?.mainTotal?.metal?.Amount, 2)}</p>
                        </div>
                        <div className={`${style?.Stone} border-end d-flex`}>
                            <p className="fw-bold col-3 border-end px_1"></p>
                            <p className="fw-bold col-3 border-end text-end px_1">{NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)}</p>
                            <p className="fw-bold col-3 border-end text-end px_1"></p>
                            <p className="fw-bold col-3 text-end px_1">{NumberWithCommas(data?.mainTotal?.colorstone?.Amount, 2)}</p>
                        </div>
                        <div className={`${style?.Labour} border-end d-flex`}>
                            <p className="fw-bold text-end col-6 border-end px_1"></p>
                            <p className="fw-bold text-end col-6 px_1">{NumberWithCommas(data?.mainTotal?.total_labour?.labour_amount, 2)}</p>
                        </div>
                        <div className={`${style?.Other} border-end d-flex`}>
                            <p className="fw-bold text-center col-4 border-end"></p>
                            <p className="fw-bold text-center col-4 border-end"></p>
                            <p className="fw-bold text-end col-4 px_1">{NumberWithCommas(data?.mainTotal?.total_other_charges, 2)}	</p>
                        </div>
                        <div className={`${style?.Price}`}><p className="fw-bold text-end px_1">{NumberWithCommas(data?.mainTotal?.total_unitcost, 2)}
                        </p></div>
                    </div>
                </div>
                {/* table taxes */}
                <div className="border-start border-end border-bottom border-black d-flex no_break">
                    <div className={`${style?.taxes} border-end px_1`}>
                        {data?.mainTotal?.total_discount_amount !== 0 && <p className="text-end">Total Discount</p>}
                        {data?.allTaxes?.map((e, i) => {
                            return <p key={i} className="text-end">{e?.name} @ {e?.per}%	</p>
                        })}
                        {headerData?.AddLess !== 0 && <p className="text-end">{headerData?.AddLess > 0 ? "Add" : "Less"}</p>}
                        <p className="text-end">Grand Total</p>
                    </div>
                    <div className={`${style?.Price} px_1`}>
                        {data?.mainTotal?.total_discount_amount !== 0 && <p className="text-end">{NumberWithCommas(data?.mainTotal?.total_discount_amount, 2)}</p>}
                        {data?.allTaxes?.map((e, i) => {
                            return <p key={i} className="text-end">{NumberWithCommas(+e?.amount, 2)}	</p>
                        })}
                               {headerData?.AddLess !== 0 && <p className="text-end">{headerData?.AddLess}</p>}
                        <p className="text-end">{NumberWithCommas(data?.finalAmount, 2)}</p>
                    </div>
                </div>
            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default Packinglist6
