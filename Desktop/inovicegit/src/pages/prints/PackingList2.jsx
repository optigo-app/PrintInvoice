import React, { useEffect, useState } from 'react';
import { ToWords } from 'to-words';
import {
    apiCall,
    isObjectEmpty,
    NumberWithCommas,
    handlePrint,
    handleImageError
} from "../../GlobalFunctions";
import style from '../../assets/css/prints/PackingList2.module.css';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import Loader from '../../components/Loader';

const PackingList2 = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const [summary, setSummary] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const toWords = new ToWords();

    const loadData = (data) => {
        setHeaderData(data?.BillPrint_Json[0]);
        let datas = OrganizeDataPrint(
            data?.BillPrint_Json[0],
            data?.BillPrint_Json1,
            data?.BillPrint_Json2
        );
        setData(datas);
    };

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
    }, []);

    return loader ? (
        <Loader />
    ) : msg === "" ? (
        <div className={`container container-fluid max_width_container mt-1 ${style?.packingList2} pad_60_allPrint px-1`} >
            {/* buttons */}
            <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`} >
                <div className={`form-check ps-3 ${style?.printBtn}`}>
                    <input
                        type="button"
                        className="btn_white blue py-2 mt-2"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            {/* company details */}
            <div className='text-center'>
                <img src={headerData?.PrintLogo} alt="" className='logoimg' />
                <p className='fw-bold'>{headerData?.CompanyAddress} {headerData?.CompanyAddress2} {headerData?.CompanyCity}-{headerData?.CompanyPinCode}</p>
                <p className='fw-bold fs-6'>{headerData?.PrintHeadLabel}</p>
                <p className='fw-bold'> (Insert Print Remark for bill)</p>
            </div>
            {/* customer details */}
            <div className='d-flex justify-content-between'>
                <p><span className="fw-bold">Party :</span> {headerData?.customerfirmname}</p>
                <div>
                    <p>Invoice No : <span className="fw-bold">{headerData?.InvoiceNo}</span></p>
                    <p>Date : <span className="fw-bold">{headerData?.EntryDate}</span></p>
                </div>
            </div>
            {/* table header */}
            <div className="d-flex mt-2 border">
                <div className={`${style?.Sr} border-end d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">Sr</p></div>
                <div className={`${style?.Jewelcode} border-end d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">Jewelcode</p></div>
                <div className={`${style?.Diamond} border-end`}>
                    <div className="d-grid h-100">
                        <div className="d-flex border-bottom">
                            <p className="fw-bold text-center w-100">Diamond</p>
                        </div>
                        <div className="d-flex">
                            <div className={`${style?.w_20} border-end`}>
                                <p className="fw-bold text-center">Shape</p>
                            </div>
                            <div className={`${style?.w_20} border-end`}>
                                <p className="fw-bold text-center">Size</p>
                            </div>
                            <div className={`${style?.w_20} border-end`}>
                                <p className="fw-bold text-center">Wt</p>
                            </div>
                            <div className={`${style?.w_20} border-end`}>
                                <p className="fw-bold text-center">Rate</p>
                            </div>
                            <div className={`${style?.w_20}`}>
                                <p className="fw-bold text-center">Amount</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${style?.Metal} border-end`}>
                    <div className="d-grid h-100">
                        <div className="d-flex border-bottom">
                            <p className="fw-bold text-center w-100">Metal</p>
                        </div>
                        <div className="d-flex">
                            <div className={`${style?.w_20} border-end`}>
                                <p className="fw-bold text-center">Kt</p>
                            </div>
                            <div className={`${style?.w_20} border-end`}>
                                <p className="fw-bold text-center">Gr Wt</p>
                            </div>
                            <div className={`${style?.w_20} border-end`}>
                                <p className="fw-bold text-center">N+L</p>
                            </div>
                            <div className={`${style?.w_20} border-end`}>
                                <p className="fw-bold text-center">Rate</p>
                            </div>
                            <div className={`${style?.w_20}`}>
                                <p className="fw-bold text-center">Amount</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${style?.Stone} border-end`}>
                    <div className="d-grid h-100">
                        <div className="d-flex border-bottom">
                            <p className="fw-bold text-center w-100">Stone</p>
                        </div>
                        <div className="d-flex">
                            <div className='col-3 border-end'>
                                <p className="fw-bold text-center">Shape</p>
                            </div>
                            <div className='col-3 border-end'>
                                <p className="fw-bold text-center">Wt</p>
                            </div>
                            <div className='col-3 border-end'>
                                <p className="fw-bold text-center">Rate</p>
                            </div>
                            <div className='col-3'>
                                <p className="fw-bold text-center">Amount</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${style?.Labour} border-end`}>
                    <div className="d-grid h-100">
                        <div className="d-flex border-bottom">
                            <p className="fw-bold text-center w-100">Labour</p>
                        </div>
                        <div className="d-flex">
                            <div className='w-50 border-end'>
                                <p className="fw-bold text-center">
                                    Rate
                                </p>
                            </div>
                            <div className='w-50'>
                                <p className="fw-bold text-center">
                                    Amount
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${style?.Other} border-end`}>
                    <div className="d-grid h-100">
                        <div className="d-flex border-bottom">
                            <p className="fw-bold text-center w-100">Other</p>
                        </div>
                        <div className="d-flex">
                            <div className='w-50 border-end'>
                                <p className="fw-bold text-center">
                                    Code
                                </p>
                            </div>
                            <div className='w-50'>
                                <p className="fw-bold text-center">
                                    Amount
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${style?.Price} d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">Price</p></div>
            </div>
            {/* table data */}
            {
                data?.resultArray?.map((e, i) => {
                    return <div key={i}>
                        {/* data */}
                        <div className="d-flex border-start border-end border-bottom">
                            <div className={`${style?.Sr} border-end`}><p className="text-center">{i + 1}</p></div>
                            <div className={`${style?.Jewelcode} border-end p-1`}>
                                <div className="d-flex justify-content-between flex-wrap">
                                    <p className=""> {e?.designno}</p>
                                    <p className="">{`{{DesignNo}}`}</p>
                                </div>
                                <img src={e?.DesignImage} alt="" className='w-100 imgWidth mt-2' onError={handleImageError} />
                            </div>
                            <div className={`${style?.Diamond} border-end position-relative ${style?.pb_21}`}>
                                <div className="d-grid h-100">
                                    <div className="d-flex">
                                        <div className={`${style?.w_20} border-end`} >
                                            {e?.diamonds?.map((ele, ind) => {
                                                return <p className="" key={ind}>{ele?.ShapeName}</p>
                                            })}
                                        </div>
                                        <div className={`${style?.w_20} border-end`} >
                                            {e?.diamonds?.map((ele, ind) => {
                                                return <p className="" key={ind}>{ele?.SizeName}</p>
                                            })}
                                        </div>
                                        <div className={`${style?.w_20} border-end`}>
                                            {e?.diamonds?.map((ele, ind) => {
                                                return <p className="text-end" key={ind}>{NumberWithCommas(ele?.Wt, 3)}</p>
                                            })}
                                        </div>
                                        <div className={`${style?.w_20} border-end`}>
                                            {e?.diamonds?.map((ele, ind) => {
                                                return <p className="text-end" key={ind}>{NumberWithCommas(ele?.Rate, 2)}</p>
                                            })}
                                        </div>
                                        <div className={`${style?.w_20}`}>
                                            {e?.diamonds?.map((ele, ind) => {
                                                return <p className="text-end" key={ind}>{NumberWithCommas(ele?.Amount, 2)}</p>
                                            })}
                                        </div>
                                    </div>
                                    <div className={`d-flex position-absolute bottom-0 left-0 w-100 border-top ${style?.min_height} lightGrey`}>
                                        <div className={`${style?.w_20} border-end`}>
                                            <p className=" fw-bold"></p>
                                        </div>
                                        <div className={`${style?.w_20} border-end`}>
                                            <p className=" fw-bold"></p>
                                        </div>
                                        <div className={`${style?.w_20} border-end`}>
                                            <p className="text-end fw-bold">{NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}</p>
                                        </div>
                                        <div className={`${style?.w_20} border-end`}>
                                            <p className="text-end fw-bold"></p>
                                        </div>
                                        <div className={`${style?.w_20}`}>
                                            <p className="text-end fw-bold">{NumberWithCommas(e?.totals?.diamonds?.Amount, 2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.Metal} border-end position-relative ${style?.pb_21}`}>
                                {/* <div className="d-grid h-100"> */}
                                <div className="d-flex flex-column">
                                    <div className="d-flex" >
                                        <div className={`${style?.w_20} border-end border-bottom`}>
                                            {e?.metal.map((ele, ind) => {
                                                return <p className="" key={ind}>{ele?.QualityName}</p>
                                            })}
                                        </div>
                                        <div className={`${style?.w_20} border-end border-bottom`}>
                                            {e?.metal.map((ele, ind) => {
                                                return <p className="text-end" key={ind}>{ind === 0 && NumberWithCommas(e?.grosswt, 3)}</p>
                                            })}
                                        </div>
                                        <div className={`${style?.w_20} border-end border-bottom`}>
                                            {e?.metal.map((ele, ind) => {
                                                return <p className="text-end" key={ind}>{ind === 0 && NumberWithCommas(e?.NetWt + e?.LossWt, 3)}</p>
                                            })}
                                        </div>
                                        <div className={`${style?.w_20} border-end border-bottom`}>
                                            {e?.metal.map((ele, ind) => {
                                                <p className="text-end" key={ind}>{NumberWithCommas(ele?.Rate, 2)}</p>
                                            })}
                                        </div>
                                        <div className={`${style?.w_20} border-bottom`}>
                                            {e?.metal.map((ele, ind) => {
                                                <p className="text-end" key={ind}>{NumberWithCommas(ele?.Amount, 2)}</p>
                                            })}
                                        </div>
                                    </div>
                                </div>
                                {e?.JobRemark !== "" && <div className="d-flex" >
                                    <div>
                                        <p></p>  Remark:
                                        <p className="fw-bold">{e?.JobRemark}</p>
                                    </div>
                                </div>}
                                <div className={`d-flex position-absolute bottom-0 left-0 w-100 border-top ${style?.min_height} lightGrey`}>
                                    <div className={`${style?.w_20} border-end`}>
                                        <p className=" fw-bold"></p>
                                    </div>
                                    <div className={`${style?.w_20} border-end`}>
                                        <p className=" fw-bold">{NumberWithCommas(e?.grosswt, 3)}</p>
                                    </div>
                                    <div className={`${style?.w_20} border-end`}>
                                        <p className="text-end fw-bold">{NumberWithCommas(e?.NetWt + e?.LossWt, 3)}</p>
                                    </div>
                                    <div className={`${style?.w_20} border-end`}>
                                        <p className="text-end fw-bold"></p>
                                    </div>
                                    <div className={`${style?.w_20}`}>
                                        <p className="text-end fw-bold">{NumberWithCommas(e?.totals?.metal?.Amount, 2)}</p>
                                    </div>
                                </div>
                                {/* </div> */}
                            </div>
                            <div className={`${style?.Stone} border-end position-relative ${style?.pb_21}`}>
                                <div className="d-grid h-100">
                                    <div className="d-flex">
                                        <div className={`col-3 border-end`} >
                                            {e?.colorstone?.map((ele, ind) => {
                                                return <p className="" key={ind}>{ele?.ShapeName}</p>
                                            })}
                                        </div>
                                        <div className={`col-3 border-end`}>
                                            {e?.colorstone?.map((ele, ind) => {
                                                return <p className="text-end" key={ind}>{NumberWithCommas(ele?.Wt, 3)}</p>
                                            })}
                                        </div>
                                        <div className={`col-3 border-end`}>
                                            {e?.colorstone?.map((ele, ind) => {
                                                return <p className="text-end" key={ind}>{NumberWithCommas(ele?.Rate, 2)}</p>
                                            })}
                                        </div>
                                        <div className={`col-3`}>
                                            {e?.colorstone?.map((ele, ind) => {
                                                return <p className="text-end" key={ind}>{NumberWithCommas(ele?.Amount, 2)}</p>
                                            })}
                                        </div>
                                    </div>
                                    <div className={`d-flex position-absolute bottom-0 left-0 w-100 border-top ${style?.min_height} lightGrey`}>
                                        <div className={`col-3 border-end`}>
                                            <p className=""></p>
                                        </div>
                                        <div className={`col-3 border-end`}>
                                            <p className=" fw-bold">{NumberWithCommas(e?.totals?.colorstone?.Wt, 3)}</p>
                                        </div>
                                        <div className={`col-3 border-end`}>
                                            <p className="text-end"></p>
                                        </div>
                                        <div className={`col-3`}>
                                            <p className="text-end fw-bold">{NumberWithCommas(e?.totals?.colorstone?.Amount, 3)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.Labour} border-end position-relative ${style?.pb_21}`}>
                                <div className="d-grid h-100">
                                    <div className="d-flex">
                                        <div className='w-50 border-end'>
                                            <p className="text-end">
                                                {NumberWithCommas(e?.MaKingCharge_Unit, 2)}
                                            </p>
                                        </div>
                                        <div className='w-50'>
                                            <p className="text-end">
                                                {NumberWithCommas(e?.MakingAmount, 2)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`d-flex position-absolute bottom-0 left-0 w-100 border-top ${style?.min_height} lightGrey`}>
                                        <div className={`w-50 border-end`}>
                                            <p className="fw-bold"></p>
                                        </div>
                                        <div className={`w-50`}>
                                            <p className="text-end fw-bold">  {NumberWithCommas(e?.MakingAmount, 2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.Other} border-end position-relative ${style?.pb_21}`}>
                                <div className="d-grid h-100">
                                    <div className="d-flex">
                                        <div className='w-50 border-end'>
                                            {e?.other_details.map((ele, ind) => {
                                                return <p className="" key={ind}>{ele?.label}</p>
                                            })}
                                        </div>
                                        <div className='w-50'>
                                            {e?.other_details.map((ele, ind) => {
                                                return <p className="text-end" key={ind}>{NumberWithCommas(ele?.value, 2)}</p>
                                            })}
                                        </div>
                                    </div>
                                    <div className={`d-flex position-absolute bottom-0 left-0 w-100 border-top ${style?.min_height} lightGrey`}>
                                        <div className={`w-50 border-end`}>
                                            <p className=""></p>
                                        </div>
                                        <div className={`w-50`}>
                                            <p className="text-end fw-bold">{NumberWithCommas(e?.OtherCharges, 2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.Price} position-relative ${style?.pb_21} `}>
                                <p className="text-end">{NumberWithCommas(e?.TotalAmount, 2)}</p>
                                <div className={` position-absolute bottom-0 left-0 w-100 border-top ${style?.min_height} lightGrey`}>
                                    <p className="text-end fw-bold">{NumberWithCommas(e?.UnitCost, 2)}</p>
                                </div>
                            </div>
                        </div>
                        {/* discount */}
                        {e?.DiscountAmt !== 0 && <div className="d-flex border-start border-end border-bottom ">
                            <div className={`${style?.Sr} border-end`}><p className="text-center"></p></div>
                            <div className={`${style?.Jewelcode} border-end`}>
                            </div>
                            <div className={`${style?.Diamond} border-end lightGrey`}>
                                <div className="d-flex w-100">
                                    <div className={`${style?.w_20} p-1`}>
                                        <p className=""></p>
                                    </div>
                                    <div className={`${style?.w_20} p-1`}>
                                        <p className=""></p>
                                    </div>
                                    <div className={`${style?.w_20} p-1`}>
                                        <p className="text-end"></p>
                                    </div>
                                    <div className={`${style?.w_20} p-1`}>
                                        <p className="text-end"></p>
                                    </div>
                                    <div className={`${style?.w_20} p-1`}>
                                        <p className="text-end"></p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.Metal} border-end lightGrey`}>
                                <div className="d-flex w-100">
                                    <div className={`${style?.w_20} p-1`}>
                                    </div>
                                    <div className={`${style?.w_20} p-1`}>
                                    </div>
                                    <div className={`${style?.w_20} p-1`}>
                                    </div>
                                    <div className={`${style?.w_20} p-1`}>
                                    </div>
                                    <div className={`${style?.w_20} p-1`}>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.stone_labour_other} border-end lightGrey`}>
                                <div className="d-flex w-100">
                                    <div className={`${style?.discount} border-end`}>
                                        <p className="text-end">
                                            Discount {e?.isdiscountinamount === 1 ? `${NumberWithCommas(e?.DiscountAmt, 2)} On` : ` ${NumberWithCommas(e?.Discount)}% @Total`} Amount
                                        </p>
                                    </div>
                                    <div className={`${style?.discount_amount}`}>
                                        <p className="text-end">
                                            {NumberWithCommas(e?.DiscountAmt, 2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.Price} lightGrey`}><p className="text-end">{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
                        </div>}
                    </div>
                })
            }
            {/* table total */}
            <div className="d-flex border-start border-end border-bottom lightGrey">
                <div className={`${style?.Sr} border-end`}><p className="text-center"></p></div>
                <div className={`${style?.Jewelcode} border-end text-center fw-bold`}> TOTAL </div>
                <div className={`${style?.Diamond} border-end d-flex`}>
                    <div className={`${style?.w_20} border-end`}>
                        <p className=""></p>
                    </div>
                    <div className={`${style?.w_20} border-end`}>
                        <p className=""></p>
                    </div>
                    <div className={`${style?.w_20} border-end`}>
                        <p className="text-end fw-bold">{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)}</p>
                    </div>
                    <div className={`${style?.w_20} border-end`}>
                        <p className="text-end"></p>
                    </div>
                    <div className={`${style?.w_20}`}>
                        <p className="text-end fw-bold">{NumberWithCommas(data?.mainTotal?.diamonds?.Amount, 2)}</p>
                    </div>
                </div>
                <div className={`${style?.Metal} border-end d-flex`}>
                    <div className={`${style?.w_20} border-end`}>
                        <p className=""></p>
                    </div>
                    <div className={`${style?.w_20} border-end`}>
                        <p className="text-end fw-bold">{NumberWithCommas(data?.mainTotal?.grosswt, 3)}</p>
                    </div>
                    <div className={`${style?.w_20} border-end`}>
                        <p className="text-end fw-bold">{NumberWithCommas(data?.mainTotal?.netwtWithLossWt, 3)}</p>
                    </div>
                    <div className={`${style?.w_20} border-end`}>
                        <p className="text-end"></p>
                    </div>
                    <div className={`${style?.w_20}`}>
                        <p className="text-end fw-bold">{NumberWithCommas(data?.mainTotal?.metal?.Amount, 2)}</p>
                    </div>
                </div>
                <div className={`${style?.Stone} border-end d-flex`}>
                    <div className='col-3 border-end'>
                        <p className=""></p>
                    </div>
                    <div className='col-3 border-end'>
                        <p className="text-end fw-bold">{NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)}</p>
                    </div>
                    <div className='col-3 border-end'>
                        <p className="text-end"></p>
                    </div>
                    <div className='col-3'>
                        <p className="text-end fw-bold">{NumberWithCommas(data?.mainTotal?.colorstone?.Amount, 2)}</p>
                    </div>
                </div>
                <div className={`${style?.Labour} border-end d-flex`}>
                    <div className='w-50 border-end'>
                        <p className="text-end">

                        </p>
                    </div>
                    <div className='w-50'>
                        <p className="text-end fw-bold">
                            {NumberWithCommas(data?.mainTotal?.total_Making_Amount, 2)}
                        </p>
                    </div>
                </div>
                <div className={`${style?.Other} border-end d-flex`}>
                    <div className='w-50 border-end'>
                        <p className="text-end">

                        </p>
                    </div>
                    <div className='w-50'>
                        <p className="text-end fw-bold">
                            {NumberWithCommas(data?.mainTotal?.total_other + data?.mainTotal?.total_otherChargesMiscHallStamp, 2)}
                        </p>
                    </div>
                </div>
                <div className={`${style?.Price}`}>
                    <p className="text-end fw-bold">{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p>
                </div>
            </div>
            {/* taxble tax */}
            <div className="d-flex border-start border-end border-bottom">
                <div className={`${style?.tax} text-end`}>
                    {data?.mainTotal?.total_discount_amount !== 0 && <p>Total Discount</p>}
                    {data?.allTaxes?.map((ele, ind) => {
                        return <p key={ind}>{ele?.name} @ {ele?.per}</p>
                    })}
                    {headerData?.AddLess !== 0 && <p>{headerData?.AddLess > 0 ? "Add" : "Less"} </p>}
                    <p>Grand Total</p>
                </div>
                <div className={`${style?.Price} text-end`}>
                    {data?.mainTotal?.total_discount_amount !== 0 && <p>{NumberWithCommas(data?.mainTotal?.total_discount_amount, 2)}</p>}
                    {data?.allTaxes?.map((ele, ind) => {
                        return <p key={ind}>{ele?.amount}</p>
                    })}
                    {headerData?.AddLess !== 0 && <p>{NumberWithCommas(headerData?.AddLess, 2)} </p>}
                    <p>{NumberWithCommas(data?.finalAmount, 2)}</p>
                </div>
            </div>
        </div>
    ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
        </p>
    );
}

export default PackingList2