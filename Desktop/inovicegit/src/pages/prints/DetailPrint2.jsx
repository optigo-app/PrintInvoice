import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/DetailPrint2.module.css";
import { NumberWithCommas, apiCall, handleImageError, handlePrint, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';

const DetailPrint2 = ({ token, invoiceNo, printName, urls, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [headerData, setHeaderData] = useState({});
    const [data, setData] = useState({});
    const [checkBox, setCheckbox] = useState({
        image: false,
    });

    const loadData = (data) => {
        // console.log(data);
        setHeaderData(data?.BillPrint_Json[0]);
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
        let resultArr = [];
        datas?.resultArray?.forEach((e, i) => {
            let obj = cloneDeep(e);
            let diamonds = [];
            obj?.diamonds?.forEach((ele, ind) => {
                let findDiamond = diamonds?.findIndex((elem, index) =>
                    // elem?.ShapeName === ele?.ShapeName && ele?.Colorname === elem?.Colorname && 
                    ele?.QualityName === elem?.QualityName && ele?.Rate === elem?.Rate);
                if (findDiamond === -1) {
                    diamonds.push(ele);
                } else {
                    diamonds[findDiamond].Wt += ele?.Wt;
                    diamonds[findDiamond].Pcs += ele?.Pcs;
                    diamonds[findDiamond].Amount += ele?.Amount;
                }
            });
            obj.diamonds = diamonds;
            obj.JobRemark = e?.JobRemark;
            resultArr?.push(obj);
        })
        datas.resultArray = resultArr;
        setData(datas);
    }

    const handleCheck = (eve) => {
        const { name, checked } = eve?.target;
        setCheckbox({ ...checkBox, [name]: checked });
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
    }, []);

    return loader ? (
        <Loader />
    ) : msg === "" ? (
        <>
            {/* buttons */}
            <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4 mt-4 position-fixed w-100`} >
                <div className="px-1">
                    <input
                        type="checkbox"
                        checked={checkBox?.image}
                        id="netwts2"
                        name="image"
                        value="netwts2"
                        className="mx-1"
                        onChange={handleCheck}
                    />
                    <label htmlFor="netwts2">With Image</label>
                </div>
                <div className="form-check ps-3">
                    <input
                        type="button"
                        value="Print"
                        className="btn_white blue py-1"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            <div className={`container max_width_container pad_60_allPrint ${style?.detailPrint2} pt-2`} >
                <h4 className='lightGrey min_height_label px-2'>{headerData?.PrintHeadLabel}</h4>
                <div className="d-flex pt-2 justify-content-between">
                    <div className='col-6'>
                        <p>To</p>
                        <p className="fw-semibold">{headerData?.Customercode}</p>
                    </div>
                    <div className='col-4'>
                        <div className="d-flex">
                            <div className="col-6">
                                <p className='text-end'>Invoice# :</p>
                            </div>
                            <div className="col-6">
                                <p className="fw-semibold ps-4"> {headerData?.InvoiceNo}</p>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="col-6">
                                <p className='text-end'>Date :</p>
                            </div>
                            <div className="col-6">
                                <p className="fw-semibold ps-4"> {headerData?.EntryDate}</p>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="col-6">
                                <p className='text-end'>{headerData?.HSN_No_Label}:</p>
                            </div>
                            <div className="col-6">
                                <p className="fw-semibold ps-4"> {headerData?.HSN_No}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* table header */}
                <div className="d-flex border-start border-end border-top border-black">
                    <div className={`${style?.sr} border-bottom text-center fw-bold border-end d-flex justify-content-center align-items-center`}><p>Sr</p></div>
                    <div className={`${style?.design} border-bottom text-center fw-bold border-end d-flex justify-content-center align-items-center`}><p>Design</p></div>
                    <div className={`${style?.diamond} border-bottom text-center fw-bold border-end`}>
                        <p className='border-bottom'>Diamond</p>
                        <div className="d-flex">
                            <div className='col-3'><p className='text-center fw-bold border-end'>Code</p></div>
                            <div className='col-3'><p className='text-center fw-bold border-end'>Wt</p></div>
                            <div className='col-3'><p className='text-center fw-bold border-end'>Rate</p></div>
                            <div className='col-3'><p className='text-center fw-bold border-end'>Amount</p></div>
                        </div>
                    </div>
                    <div className={`${style?.metal} border-bottom text-center fw-bold border-end`}>
                        <p className='border-bottom'>Metal</p>
                        <div className="d-flex">
                            <div className='col-3'><p className='text-center fw-bold border-end'>Quality</p></div>
                            <div className='col-3'><p className='text-center fw-bold border-end'>Wt(M+D)</p></div>
                            <div className='col-3'><p className='text-center fw-bold border-end'>N+L</p></div>
                            <div className='col-3'><p className='text-center fw-bold border-end'>Amount</p></div>
                        </div>
                    </div>
                    <div className={`${style?.stone} border-bottom text-center fw-bold border-end`}>
                        <p className='border-bottom'>Stone</p>
                        <div className="d-flex">
                            <div className='col-6'><p className='text-center fw-bold border-end'>Code</p></div>
                            <div className='col-6'><p className='text-center fw-bold border-end'>Amount</p></div>
                        </div>
                    </div>
                    <div className={`${style?.other} border-bottom text-center fw-bold border-end d-flex justify-content-center align-items-center`}><p>Other Amount</p></div>
                    <div className={`${style?.labour} border-bottom text-center fw-bold border-end d-flex justify-content-center align-items-center`}><p>Labour Amount</p></div>
                    <div className={`${style?.total} border-bottom text-center fw-bold d-flex justify-content-center align-items-center`}><p>Total Amount</p></div>
                </div>
                {/* table data */}
                {data?.resultArray?.map((e, i) => {
                    return <div className='border-start border-end border-black no_break' key={i}>
                        <div className="d-flex border-top">
                            <div className={`${style?.sr} border-bottom text-center border-end d-flex justify-content-center align-items-center`}><p>{NumberWithCommas(i + 1, 0)}</p></div>
                            <div className={`${style?.design} border-bottom border-end`}>
                                <div className="d-flex flex-column justify-content-between h-100">
                                    <div>
                                        <div className="d-flex justify-content-between">
                                            <p>{e?.designno}</p>
                                            <p>{e?.SrJobno}</p>
                                        </div>
                                        <img src={e?.DesignImage} alt="" width={75} height={75} className={`mx-auto d-block ${!checkBox?.image && 'd-none'}`} onError={handleImageError} />
                                    </div>
                                    <div className="border-top" style={{ minHeight: "13.5px" }}>
                                        <p className="fw-bold text-center">{NumberWithCommas(e?.grosswt, 3)} gm Gross</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.diamond} border-bottom  border-end`}>
                                <div className="d-flex h-100 flex-column justify-content-between">
                                    <div>
                                        {e?.diamonds?.map((ele, ind) => {
                                            return <div className="d-flex" key={ind}>
                                                <div className='col-3'><p className=''>{ele?.QualityName}</p></div>
                                                <div className='col-3 text-end'><p className='text-end'>{NumberWithCommas(ele?.Wt, 3)}</p></div>
                                                <div className='col-3 text-end'><p className='text-end'>{NumberWithCommas(ele?.Rate, 2)}</p></div>
                                                <div className='col-3 text-end'><p className='text-end'>{NumberWithCommas(ele?.Amount, 2)}</p></div>
                                            </div>
                                        })}
                                    </div>
                                    <div className="border-top d-flex lightGrey" style={{ minHeight: "13.5px" }}>
                                        <p className="text-center col-3 fw-semibold"></p>
                                        <p className="text-end col-3 fw-semibold">{NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}</p>
                                        <p className="text-end col-3 fw-semibold"></p>
                                        <p className="text-end col-3 fw-semibold">{NumberWithCommas(e?.totals?.diamonds?.Amount, 2)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.metal} border-bottom  border-end`}>
                                <div className="d-flex h-100 flex-column justify-content-between">
                                    <div>
                                        {e?.metal?.map((ele, ind) => {
                                            return <div className="d-flex h-100" key={ind}>
                                                <div className='col-3'><p className='border-end border-bottom'>{ele?.ShapeName} {ele?.QualityName}</p></div>
                                                <div className='col-3'><p className='border-end border-bottom text-end'>{ind === 0 && NumberWithCommas((e?.NetWt + (e?.totals?.diamonds?.Wt / 5)), 3)}</p></div>
                                                <div className='col-3'><p className='border-end border-bottom text-end'>{NumberWithCommas(ele?.Wt, 3)}</p></div>
                                                <div className='col-3'><p className='border-end border-bottom text-end'>{NumberWithCommas(ele?.Amount, 2)}</p></div>
                                            </div>
                                        })}
                                        {e?.JobRemark !== "" && <div>
                                            <p>Remark:</p>
                                            <p>{e?.JobRemark}</p>
                                        </div>}

                                    </div>
                                    <div className="border-top d-flex lightGrey">
                                        <div className='col-3'><p className='fw-semibold'></p></div>
                                        <div className='col-3'><p className='fw-semibold text-end'>{NumberWithCommas((e?.NetWt + (e?.totals?.diamonds?.Wt / 5)), 3)}</p></div>
                                        <div className='col-3'><p className='fw-semibold text-end'>{NumberWithCommas(e?.totals?.metal?.Wt, 3)}</p></div>
                                        <div className='col-3'><p className='fw-semibold text-end'>{NumberWithCommas(e?.totals?.metal?.Amount, 2)}</p></div>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.stone} border-bottom  border-end`}>
                                <div className="d-flex h-100 flex-column justify-content-between">
                                    <div>
                                        {e?.colorstone?.map((ele, ind) => {
                                            return <div className="d-flex" key={ind}>
                                                <div className='col-6'><p className=''>COLOR STONE	</p></div>
                                                <div className='col-6'><p className='text-end'>{NumberWithCommas(ele?.Amount, 2)}</p></div>
                                            </div>
                                        })}
                                    </div>
                                    <div className="border-top lightGrey">
                                        <p className='text-end fw-semibold' style={{ minHeight: "13.5px" }}>{e?.totals?.colorstone?.Amount !== 0 && NumberWithCommas(e?.totals?.colorstone?.Amount, 2)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.other} border-bottom  border-end text-end`}>
                                <div className="d-flex h-100 flex-column justify-content-between">
                                    <div>
                                        <p className='text-end'>{NumberWithCommas(e?.OtherCharges, 2)}</p>
                                    </div>
                                    <div className='border-top lightGrey'>
                                        <p className='text-end fw-semibold'> {NumberWithCommas(e?.OtherCharges, 2)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.labour} border-bottom  border-end text-end`}>
                                <div className="d-flex h-100 flex-column justify-content-between">
                                    <div>
                                        <p className='text-end'>{NumberWithCommas(e?.MakingAmount, 2)}</p>
                                    </div>
                                    <div className='border-top lightGrey'>
                                        <p className='text-end fw-semibold'> {NumberWithCommas(e?.MakingAmount, 2)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.total} border-bottom  text-end`}>
                                <div className="d-flex h-100 flex-column justify-content-between">
                                    <div>
                                        <p className='text-end'>{NumberWithCommas(e?.TotalAmount, 2)}</p>
                                    </div>
                                    <div className='border-top lightGrey'>
                                        <p className='text-end fw-semibold'> {NumberWithCommas(e?.TotalAmount, 2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                })}
                {/* taxes */}
                <div className='border-start border-end border-black d-flex no_break'>
                    <div className={`${style?.cgst} text-end`}>
                        {data?.allTaxes?.map((e, i) => {
                            return <p key={i}>{e?.name} @ {e?.per}</p>
                        })}
                        {headerData?.AddLess !== 0 && <p>Add/Less</p>}
                    </div>
                    <div className={`${style?.cgstNumber} text-end`}>
                        {data?.allTaxes?.map((e, i) => {
                            return <p key={i}>{NumberWithCommas(+e?.amount, 2)}</p>
                        })}
                        {headerData?.AddLess !== 0 && <p>{headerData?.AddLess}</p>}
                    </div>
                </div>
                {/* table total */}
                <div className='border-start border-end border-black lightGrey border-bottom no_break'>
                    <div className="d-flex border-top">
                        <div className={`${style?.totalWord}  border-end`}>
                            <p className="fw-bold text-center  fw-semibold">TOTAL</p>
                        </div>
                        <div className={`${style?.diamond} border-end d-flex`}>
                            <div className='col-3'><p className=' fw-semibold'></p></div>
                            <div className='col-3 text-end'><p className='text-end fw-semibold'>{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)}</p></div>
                            <div className='col-3 text-end'><p className='text-end fw-semibold'></p></div>
                            <div className='col-3 text-end'><p className='text-end fw-semibold'>{NumberWithCommas(data?.mainTotal?.diamonds?.Amount, 2)}</p></div>
                        </div>
                        <div className={`${style?.metal}  border-end d-flex`}>
                            <div className='col-3'><p className=' fw-semibold'></p></div>
                            <div className='col-3'><p className=' text-end fw-semibold'>{NumberWithCommas((data?.mainTotal?.diamonds?.Wt/5) + data?.mainTotal?.netwt, 3 )}</p></div>
                            <div className='col-3'><p className=' text-end fw-semibold'>{NumberWithCommas(data?.mainTotal?.metal?.Wt, 3)}</p></div>
                            <div className='col-3'><p className=' text-end fw-semibold'>{NumberWithCommas(data?.mainTotal?.metal?.Amount, 2)}</p></div>
                        </div>
                        <div className={`${style?.stone}   border-end `}>
                            <p className='text-end fw-semibold'>{NumberWithCommas(data?.mainTotal?.colorstone?.Amount, 2)}</p>
                        </div>
                        <div className={`${style?.other}   border-end text-end`}>
                            <p className='text-end fw-semibold'> {NumberWithCommas(data?.mainTotal?.totalMiscAmount + data?.mainTotal?.total_other, 2)}</p>
                        </div>
                        <div className={`${style?.labour}   border-end text-end`}>
                            <p className='text-end fw-semibold'> {NumberWithCommas(data?.mainTotal?.total_Making_Amount, 2)}</p>
                        </div>
                        <div className={`${style?.total}   text-end`}>
                            <p className='text-end fw-semibold'> {NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p>
                        </div>
                    </div>
                </div>
                {/* table summary */}
                <div className='d-flex no_break'>
                    <div className={`${style?.summary} col-5 border-bottom border-start border-end border-top h-100`}>
                        <p className="fw-bold lightGrey text-center border-bottom">Summary</p>
                        <div className='d-flex'>
                            <div className="col-6 border-end ">
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>GOLD IN 24KT	</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.convertednetwt, 3)} gm	</p>
                                </div>
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>GROSS WT	</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.grosswt, 3)} gm	</p>
                                </div>
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>G+D WT</p>
                                    <p>{NumberWithCommas((data?.mainTotal?.diamonds?.Wt/5) + data?.mainTotal?.netwt, 3 )} gm	</p>
                                </div>
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>NET WT</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.netwtWithLossWt, 3)} gm	</p>
                                </div>
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>DIAMOND WT</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)} cts	</p>
                                </div>
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>STONE WT</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)} cts	</p>
                                </div>
                                <div className="d-flex justify-content-between border-top lightGrey px-1" style={{ minHeight: "13.5px" }}>
                                    <p className='fw-bold'></p>
                                    <p>	</p>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>GOLD</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.MetalAmount, 2)} 	</p>
                                </div>
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>DIAMOND</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.diamonds?.Amount, 2)} 	</p>
                                </div>
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>CST</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.colorstone?.Amount, 2)} 	</p>
                                </div>
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>MAKING</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.total_Making_Amount, 2)} 	</p>
                                </div>
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>OTHER</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.totalMiscAmount + data?.mainTotal?.total_other, 2)} 	</p>
                                </div>
                                {headerData?.AddLess !== 0 && <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>ADD / LESS	</p>
                                    <p>{NumberWithCommas(headerData?.AddLess)} 	</p>
                                </div>}
                                <div className="d-flex justify-content-between border-top lightGrey px-1">
                                    <p className='fw-bold'>TOTAL</p>
                                    <p>{NumberWithCommas(data?.finalAmount, 2)} 	</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style?.remark} col-3 border-start border-end border-bottom h-100 border-top`}>
                        <p className="fw-bold lightGrey text-center border-bottom">Remark</p>
                        <p style={{ minHeight: "24px" }} className='px-1'>{headerData?.PrintRemark}</p>
                    </div>
                    <div className={`${style?.blank} col-2`}></div>
                    <div className={`${style?.checkedBy} col-2 d-flex justify-content-center align-items-end border-start border-end border-bottom border-top`} style={{ minHeight: "150px" }}>
                        <p><i>Checked by</i></p>
                    </div>
                </div>
            </div >
        </>
    ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
        </p>
    );
}

export default DetailPrint2;