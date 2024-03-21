import React, { useEffect, useState } from 'react';
import { ToWords } from 'to-words';
import {
    apiCall,
    isObjectEmpty,
    NumberWithCommas,
    handlePrint,
    handleImageError
} from "../../GlobalFunctions";
import style from "../../assets/css/prints/PackingList2.module.css";
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import Loader from '../../components/Loader';

const PackingList2 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const [summary, setSummary] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const toWords = new ToWords();
    const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
    const loadData = (data) => {
        console.log(data);
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
                        className={`btn_white blue py-1 mt-2 ${style?.font_14}`}
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            {/* company details */}
            <div className='text-center'>
            {isImageWorking && (headerData?.PrintLogo !== "" && 
                      <img src={headerData?.PrintLogo} alt="" 
                      className='w-25 h-auto ms-auto d-block object-fit-contain'
                      onError={handleImageErrors} height={120} width={150} />)}
                {/* <img src={headerData?.PrintLogo} alt="" className='logoimg mb-1' /> */}
                <p className={`fw-bold pb-1 ${style?.font_12}`}>{headerData?.CompanyAddress} {headerData?.CompanyAddress2} {headerData?.CompanyCity}-{headerData?.CompanyPinCode}</p>
                <p className={`fw-bold pb-1 ${style?.font_18}`}>{headerData?.PrintHeadLabel}</p>
                <p className={`fw-bold ${style?.font_11}`}> ({headerData?.PrintRemark})</p>
            </div>
            {/* customer details */}
            <div className={`d-flex justify-content-between no_break `}>
                <p className={`${style?.font_14}`}><span className="fw-bold">Party :</span> {headerData?.customerfirmname}</p>
                <div className={`${style?.font_12}`}>
                <div className='d-flex' style={{minWidth: "170px"}}>
                    <div className="w-50"><p>Invoice No :</p></div>
                    <div className="w-50"><p className="fw-bold">{headerData?.InvoiceNo}</p></div>
                </div>
                <div className='d-flex'>
                    <div className="w-50"><p>Date :</p></div>
                    <div className="w-50"><p className="fw-bold">{headerData?.EntryDate}</p></div>
                </div>
                </div>
            
            </div>
            {/* table header */}
            <div className={`mt-2 border-black border-top border-start no_break border-end mb-1 ${style?.font_12}`}>
                <div className="d-flex border-bottom">
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
            </div>
            {/* table data */}
            {
                data?.resultArray?.map((e, i) => {
                    return <div key={i} className={`border-start border-end border-black no_break ${style?.font_1_12}`}>
                        <div className={`d-flex border-bottom ${i === 0 && "border-top"}`}>
                            <div className={`${style?.Sr} border-end`}><p className="text-center pt-1">{i + 1}</p></div>
                            <div className={`${style?.Jewelcode} border-end p-1`}>
                                <div className="d-flex justify-content-between flex-wrap">
                                <p className=""> {e?.designno}</p>
                                <p className=""> {e?.designno}</p>
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
                                            <p className="text-end fw-bold">{e?.totals?.diamonds?.Wt !== 0 && NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}</p>
                                        </div>
                                        <div className={`${style?.w_20} border-end`}>
                                            <p className="text-end fw-bold"></p>
                                        </div>
                                        <div className={`${style?.w_20}`}>
                                            <p className="text-end fw-bold">{e?.totals?.diamonds?.Amount !== 0 && NumberWithCommas(e?.totals?.diamonds?.Amount, 2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.Metal} border-end position-relative ${style?.pb_21}`}>
                                <div className="d-grid h-100">
                                    <div className="d-flex" >
                                        <div className={`${style?.w_20} border-end`}>
                                            {e?.metal.map((ele, ind) => {
                                                return <p className="" key={ind}>{ele?.QualityName}</p>
                                            })}
                                        </div>
                                        <div className={`${style?.w_20} border-end`}>
                                            {e?.metal.map((ele, ind) => {
                                                return <p className="text-end" key={ind}>{ind === 0 && NumberWithCommas(e?.grosswt, 3)}</p>
                                            })}
                                        </div>
                                        <div className={`${style?.w_20} border-end`}>
                                            {e?.metal.map((ele, ind) => {
                                                return <p className="text-end" key={ind}>{ind === 0 && NumberWithCommas(e?.NetWt + e?.LossWt, 3)}</p>
                                            })}
                                        </div>
                                        <div className={`${style?.w_20} border-end`}>
                                            {e?.metal.map((ele, ind) => {
                                                <p className="text-end" key={ind}>{NumberWithCommas(ele?.Rate, 2)}</p>
                                            })}
                                        </div>
                                        <div className={`${style?.w_20}`}>
                                            {e?.metal.map((ele, ind) => {
                                                <p className="text-end" key={ind}>{NumberWithCommas(ele?.Amount, 2)}</p>
                                            })}
                                        </div>
                                    </div>
                                    <div className={`d-flex position-absolute bottom-0 left-0 w-100 border-top ${style?.min_height} lightGrey`}>
                                    <div className={`${style?.w_20} border-end`}>
                                        <p className=" fw-bold"></p>
                                    </div>
                                    <div className={`${style?.w_20} border-end`}>
                                        <p className=" fw-bold">{e?.grosswt !== 0 && NumberWithCommas(e?.grosswt, 3)}</p>
                                    </div>
                                    <div className={`${style?.w_20} border-end`}>
                                        <p className="text-end fw-bold">{e?.NetWt + e?.LossWt !== 0 && NumberWithCommas(e?.NetWt + e?.LossWt, 3)}</p>
                                    </div>
                                    <div className={`${style?.w_20} border-end`}>
                                        <p className="text-end fw-bold"></p>
                                    </div>
                                    <div className={`${style?.w_20}`}>
                                        <p className="text-end fw-bold">{e?.totals?.metal?.Amount !== 0 && NumberWithCommas(e?.totals?.metal?.Amount, 2)}</p>
                                    </div>
                                </div>
                                {/* {e?.JobRemark !== "" && <div className="d-flex" >
                                    <div>
                                        <p></p>  Remark:
                                        <p className="fw-bold">{e?.JobRemark}</p>
                                    </div>
                                </div>} */}
                             
                                </div>
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
                                            <p className=" fw-bold">{e?.totals?.colorstone?.Wt !== 0 && NumberWithCommas(e?.totals?.colorstone?.Wt, 3)}</p>
                                        </div>
                                        <div className={`col-3 border-end`}>
                                            <p className="text-end"></p>
                                        </div>
                                        <div className={`col-3`}>
                                            <p className="text-end fw-bold">{e?.totals?.colorstone?.Amount !== 0 && NumberWithCommas(e?.totals?.colorstone?.Amount, 3)}</p>
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
                                            {e?.MiscAmount !== 0 && <p className={`${style?.min_height}`}>other</p>}
                                            {e?.other_details.map((ele, ind) => {
                                                return <p className={`${style?.min_height}`} key={ind}>{ele?.label}</p>
                                            })}
                                            {e?.TotalDiamondHandling !== 0 && <p>Charges Handling</p>}
                                        </div>
                                        <div className='w-50'>
                                            {e?.MiscAmount !== 0 && <p className={`${style?.min_height}`}>{NumberWithCommas(e?.MiscAmount, 2)}</p>}
                                            {e?.other_details.map((ele, ind) => {
                                                return <p className={`text-end ${style?.min_height}`} key={ind}>{NumberWithCommas(ele?.value, 2)}</p>
                                            })}
                                            {e?.TotalDiamondHandling !== 0 && <p className='text-end'>{NumberWithCommas(e?.TotalDiamondHandling, 2)}</p>}
                                        </div>
                                    </div>
                                    <div className={`d-flex position-absolute bottom-0 left-0 w-100 border-top ${style?.min_height} lightGrey`}>
                                        <div className={`w-50 border-end`}>
                                            <p className=""></p>
                                        </div>
                                        <div className={`w-50`}>
                                            <p className="text-end fw-bold">{NumberWithCommas(e?.OtherCharges + e?.TotalDiamondHandling + e?.MiscAmount, 2)}</p>
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
            <div className={`border-black border-start border-end no_break ${style?.font_1_12}`}>
                <div className="d-flex border-bottom lightGrey">
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
                                {NumberWithCommas(data?.mainTotal?.total_other + data?.mainTotal?.total_otherChargesMiscHallStamp + data?.mainTotal?.totalMiscAmount+data?.mainTotal?.total_diamondHandling
, 2)}
                            </p>
                        </div>
                    </div>
                    <div className={`${style?.Price}`}>
                        <p className="text-end fw-bold">{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p>
                    </div>
                </div>
            </div>
            {/* taxble tax */}
            <div className={`d-flex border-start border-end border-bottom no_break border-black ${style?.font_1_12}`}>
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