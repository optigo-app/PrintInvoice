import React, { useEffect } from 'react'
import { useState } from 'react';
import { HeaderComponent, NumberWithCommas, apiCall, fixedValues, handleImageError, handlePrint, isObjectEmpty, numberToWord, taxGenrator } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import style from "../../assets/css/prints/summarys.module.css";

const Summary2 = ({ token, invoiceNo, printName, urls, evn }) => {
    const [loader, setLoader] = useState(true);
    const [headerData, setHeaderData] = useState({});
    const [headerComp, setHeaderComp] = useState(null);
    const [msg, setMsg] = useState("");
    const [checkBox, setCheckBox] = useState({
        netwt: false,
        image: false,
        brand: false,
    });
    const [data, setData] = useState([]);
    const [Styles, setstyles] = useState({
        design: checkBox?.netwt ? style?.design : style?.design1,
        total: checkBox?.netwt ? style?.total : style?.total1,
    });
    const [total, setTotal] = useState({
        grosswt: 0,
        NetWt: 0,
        MakingAmount: 0,
        diaWt: 0,
        csWt: 0,
        csRate: 0,
        csAmt: 0,
        convertednetwt: 0,
        metalRates: 0,
        UnitCost: 0,
    });
    const [taxes, setTaxes] = useState([]);
    const [totalAmount, setTotalAmount]=  useState({
        amountAftertax: 0
    });

    const loadData = (data) => {
        // console.log(data);
        setHeaderData(data?.BillPrint_Json[0]);
        let head = HeaderComponent(data?.BillPrint_Json[0]?.HeaderNo, data?.BillPrint_Json[0]);
        setHeaderComp(head);
        let resultArr = [];
        let totals = { ...total };
        data?.BillPrint_Json1.forEach((e, i) => {
            let obj = { ...e };
            let diamonds = [];
            let cs = {
                Rate: 0,
                Wt: 0,
                len: 0
            }
            let metalRates = 0;
            totals.grosswt += e?.grosswt;
            totals.NetWt += e?.NetWt;
            totals.MakingAmount += e?.MaKingCharge_Unit;
            totals.convertednetwt += e?.convertednetwt;
            data?.BillPrint_Json2.forEach((ele, ind) => {
                if (ele?.StockBarcode === e?.SrJobno) {
                    if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
                        diamonds.push(ele);
                        totals.diaWt += ele?.Wt
                    }
                    else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
                        cs.len += 1;
                        cs.Rate += ele?.Rate;
                        cs.Wt += ele?.Wt;
                        totals.csWt += ele?.Wt;
                        totals.csAmt += ele?.Amount;
                        
                    }
                    else if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                        metalRates = ele?.Rate;
                    }
                }
            });
            if (cs.len !== 0) {
                cs.Rate = cs.Rate / cs.len;
                totals.csRate += cs.Rate;
            }
            obj.metalRates = metalRates;
            totals.metalRates += metalRates;
            totals.UnitCost += e?.UnitCost;
            obj.cs = cs;
            obj.diamonds = diamonds;
            resultArr.push(obj)
        });
        let taxValue = taxGenrator(data?.BillPrint_Json[0], totals?.UnitCost);
        let amount = taxValue.reduce((accumulator, currentValue) => accumulator + +currentValue.amount, 0);
        let totalAmounts = {...totalAmount};
        totalAmounts.amountAftertax = amount+totals.UnitCost;
        setTotalAmount(totalAmounts);
        setTaxes(taxValue);
        setData(resultArr);
        setTotal(totals);
    }

    const handleChangeCheck = (e) => {
        const { name, checked } = e?.target;
        setCheckBox({ ...checkBox, [name]: checked });
        if(name === "netwt"){
            checked ? setstyles({...Styles,design: style?.design, total: style?.total}) : setstyles({...Styles,design: style?.design1, total: style?.total1});
        }
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
        <>  {loader ? <Loader /> : msg === "" ? <div className={`pad_60_allPrint ${style.summarysContaoiner}`}>
            <div className="container max_width_container">
                <div className="d-flex justify-content-end print_sec_sum4 pt-4 pb-4 align-items-center">
                    <div className="form-check pe-3">
                        <input className="form-check-input" type="checkbox" checked={checkBox?.netwt} onChange={handleChangeCheck} name='netwt' />
                        <label className="form-check-label pt-1" htmlFor="flexCheckDefault">
                            With NetWt
                        </label>
                    </div>
                    <div className="form-check pe-3">
                        <input className="form-check-input" type="checkbox" checked={checkBox?.image} onChange={handleChangeCheck} name='image' />
                        <label className="form-check-label pt-1" htmlFor="flexCheckDefault">
                            With Image
                        </label>
                    </div>
                    <div className="form-check pe-3">
                        <input className="form-check-input" type="checkbox" checked={checkBox?.brand} onChange={handleChangeCheck} name='brand' />
                        <label className="form-check-label pt-1" htmlFor="flexCheckDefault">
                            Brand
                        </label>
                    </div>
                    <div className="form-check ps-3 mt-2">
                        <input
                            type="button"
                            className="btn_white blue mt-0"
                            value="Print"
                            onClick={(e) => handlePrint(e)}
                        />
                    </div>
                </div>
                {/* header component */}
                {headerComp}
                <div className="border mt-2 p-2">
                    <div className="d-flex justify-content-between">
                        <div><p className='fs-4'>INVOICE# : <span className="fw-bold fs-4">{headerData?.InvoiceNo}</span></p></div>
                        <div className='pb-2'><p className='fs-4'>DATE : <span className="fw-bold fs-4">{headerData?.EntryDate}</span></p></div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <div><p className='fs-4'>HSN : <span className="fw-bold fs-4">{headerData?.HSN_No}</span></p></div>
                    </div>

                </div>
                <div className="border p-2">
                    <div className="d-flex justify-content-between">
                        <div>
                            <p className='fs-4 fw-bold pb-2 ps-2'>TO, {headerData?.customerfirmname}</p>
                            {headerData?.customerAddress1 !== "" && <p className='fs-5 ps-5'>{headerData?.customerAddress1}</p>}
                            {headerData?.customerAddress2 !== "" && <p className='fs-5 ps-5'>{headerData?.customerAddress2}</p>}
                            <p className='fs-5 ps-5'>{headerData?.customercity}{headerData?.customerpincode} </p>
                            <p className='fs-5 ps-5'>Phno:-{headerData?.customermobileno} </p>
                        </div>
                    </div>
                </div>
                {/* table header */}
                <div className="border-start border-end border-bottom d-flex">
                    <div className={`${style?.sr_no} border-end p-2 d-table`}><p className='fw-bold d-table-cell align-middle text-center'>SR#</p></div>
                    <div className={`${Styles?.design} border-end p-2 d-table`}><p className='fw-bold d-table-cell align-middle text-center'>DESIGN</p></div>
                    <div className={`${style?.amtDetail} border-end p-2 d-table`}><p className='fw-bold text-center d-table-cell align-middle'>PURITY</p></div>
                    <div className={`${style?.amtDetail} border-end p-2 d-table`}><p className='fw-bold text-center align-middle d-table-cell'>G WT</p></div>
                    {checkBox.netwt && <div className={`${style?.amtDetail} border-end p-2 d-table`}><p className='fw-bold text-center align-middle d-table-cell'>NWT</p></div>}
                    <div className={`${style?.diamond} border-end`}>
                        <p className="border-bottom fw-bold w-100 text-center p-2">Diamond</p>
                        <div className="d-flex ">
                            <div className={`col-4 border-end p-2 d-table`}><p className='fw-bold text-center align-middle d-table-cell p-2'>Detail</p></div>
                            <div className={`col-4 border-end p-2 d-table`}><p className='fw-bold text-center align-middle d-table-cell p-2'>DIA WT</p></div>
                            <div className={`col-4 p-2 d-table`}><p className='fw-bold text-center align-middle text-center p-2'>DIA RATE</p></div>
                        </div>
                    </div>
                  
                    <div className={`${style?.amtDetail} border-end p-2 d-table`}>
                        <div className=' align-middle d-table-cell'>
                            <p className='fw-bold text-center'>Making </p>
                            <p className="fw-bold text-center">Charges</p>
                        </div>
                    </div>
                    <div className={`${style?.stone} border-end`}>
                        <div className='border-bottom'>
                            <p className='fw-bold text-center p-2'>Stone</p>
                        </div>
                        <div className='d-flex'>
                            <div className={`col-6 border-end p-2`}><p className='fw-bold text-center'>CS WT</p></div>
                            <div className={`col-6 p-2`}><p className='fw-bold text-center'>CS RATE</p></div>
                        </div>
                    </div>
                    <div className={`${style?.amtDetail} border-end p-2 d-table`}><p className='fw-bold text-center align-middle d-table-cell'>GOLD FINE</p></div>
                    <div className={`${style?.amtDetail} border-end p-2 d-table`}><p className='fw-bold text-center align-middle d-table-cell'>GOLD Rate</p></div>
                    <div className={`${style?.amtDetail} p-2 d-table`}><p className='fw-bold align-middle d-table-cell text-center'>AMOUNT</p></div>
                </div>
                {/* table data */}
                {data.length > 0 && data.map((e, i) => {
                    return <div className="border-start border-end border-bottom d-flex" key={i}>
                        <div className={`${style?.sr_no} border-end p-2 `}><p className='fw-bold   p-2'>{i + 1}</p></div>
                        <div className={`${Styles?.design} border-end p-2 `}>
                            <div className="pb-1">
                                <p className='fw-bold px-2 pb-1'>{e?.designno} </p>
                                <p className="fw-bold px-2 pb-1">{checkBox?.brand && e?.BrandName} </p>
                                <p className="fw-bold px-2 pb-1">{e?.SrJobno}</p>
                                {checkBox?.image && <img src={e?.DesignImage} alt="" onError={handleImageError} className='designImagePrintAll d-block mx-auto' />}
                                {e?.HUID !== "" && <p className="fw-bold px-2 pb-1">{e?.HUID}</p>}
                            </div>
                        </div>
                        <div className={`${style?.amtDetail} border-end`}><p className='fw-bold p-2'>{e?.MetalPurity}</p></div>
                        <div className={`${style?.amtDetail} border-end`}><p className='p-2 text-end'>{NumberWithCommas(e?.grosswt, 3)}</p></div>
                        {checkBox.netwt && <div className={`${style?.amtDetail} border-end`}><p className='p-2 text-end'>{NumberWithCommas(e?.NetWt, 3)}</p></div>}
                        <div className={`${style?.diamond} border-end`}>
                            <div className="d-flex h-100">
                                <div className={`border-end col-4`}>
                                    {e?.diamonds.length > 0 && e?.diamonds.map((ele, ind) => {
                                        return <p className='p-2' key={ind}>{ele?.QualityName}</p>
                                    })}
                                </div>
                                <div className={`border-end col-4`}>
                                    {e?.diamonds.length > 0 && e?.diamonds.map((ele, ind) => {
                                        return <p className='p-2' key={ind}>{NumberWithCommas(ele?.Wt, 3)}</p>
                                    })}
                                </div>
                                <div className={`col-4`}>
                                    {e?.diamonds.length > 0 && e?.diamonds.map((ele, ind) => {
                                        return <p className='p-2' key={ind}>{NumberWithCommas(ele?.Rate, 2)}</p>
                                    })}
                                </div>
                            </div>
                        </div>
                    
                        <div className={`${style?.amtDetail} border-end`}> <p className='fw-bold p-2 text-end'>{NumberWithCommas(e?.MaKingCharge_Unit, 2)} </p> </div>
                        <div className={`${style?.stone} d-flex border-end`}>
                            <div className={`border-end col-6`}><p className='fw-bold p-2 text-end'>{NumberWithCommas(e?.cs?.Wt, 3)}</p></div>
                            <div className={`col-6`}><p className='p-2 text-end'>{NumberWithCommas(e?.cs?.Rate, 2)}</p></div>
                        </div>
                        <div className={`${style?.amtDetail} border-end`}><p className='p-2 text-end'>{NumberWithCommas(e?.convertednetwt, 3)}</p></div>
                        <div className={`${style?.amtDetail} border-end`}><p className='p-2 text-end'>{NumberWithCommas(e?.metalRates, 2)}</p></div>
                        <div className={`${style?.amtDetail}`}><p className='p-2 text-end'>{NumberWithCommas(e?.UnitCost, 2)}</p></div>
                    </div>
                })}
                {/* table total */}
                <div className="border-start border-end border-bottom d-flex lightGrey">
                    <div className={`${Styles?.total} border-end`}><p className='fw-bold p-2 text-center'>TOTAL</p></div>
                    <div className={`${style?.amtDetail} border-end`}><p className='fw-bold p-2'></p></div>
                    <div className={`${style?.amtDetail} border-end`}><p className='fw-bold p-2 text-end'>{NumberWithCommas(total?.grosswt, 3)}</p></div>
                    {checkBox.netwt && <div className={`${style?.amtDetail} border-end`}><p className='fw-bold p-2 text-end'>{NumberWithCommas(total?.NetWt, 3)}</p></div>}
                    <div className={`${style?.diamond} d-flex border-end `}>
                        <div className={`border-end col-4`}><p className='fw-bold p-2'></p></div>
                        <div className={`border-end col-4`}><p className='fw-bold p-2 text-end'>{NumberWithCommas(total?.diaWt, 3)}</p></div>
                        <div className={`col-4`}><p className='fw-bold p-2'></p></div>
                    </div>
                
                    <div className={`${style?.amtDetail} border-end`}> <p className='fw-bold p-2 text-end'>{NumberWithCommas(total?.MakingAmount, 3)} </p> </div>
                    <div className={`${style?.stone} d-flex border-end`}>
                        <div className={`border-end col-6`}><p className='fw-bold p-2 text-end'>{NumberWithCommas(total?.csWt, 3)}</p></div>
                        <div className={`col-6`}><p className='fw-bold p-2 text-end'>{NumberWithCommas(total?.csRate, 2)}</p></div>
                    </div>
                    <div className={`${style?.amtDetail} border-end`}><p className='fw-bold p-2 text-end'>{NumberWithCommas(total?.convertednetwt, 3)}</p></div>
                    <div className={`${style?.amtDetail} border-end`}><p className='fw-bold p-2 text-end'>{NumberWithCommas(total?.metalRates, 2)}</p></div>
                    <div className={`${style?.amtDetail} `}><p className='fw-bold p-2 text-end'>{NumberWithCommas(total?.UnitCost, 2)}</p></div>
                </div>
                {/* tax */}
                <div className="d-flex justify-content-end">
                    <div className="col-4 border-start border-end border-bottom ">
                        {taxes.length > 0 && taxes.map((e, i) => {
                            return <div className="d-flex justify-content-between border-bottom" key={i}>
                                <p className='p-2'>{e?.name} @ {e?.per}</p>
                                <p className='p-2'>{e?.amount}</p>
                            </div>
                        })}
                       
                    </div>
                </div>
                {/* Gold in 24K */} 
                <div className="d-flex lightGrey justify-content-between p-2 border my-2">
                    <p className="fw-bold">GOLD in 24K: {NumberWithCommas(total?.convertednetwt, 3)}</p>
                    <p className="fw-bold">TOTAL IN rup: {NumberWithCommas(totalAmount?.amountAftertax, 2)}</p>
                </div>
                {/* Rupees in Words */}
                <div className="lightGrey border p-2">
                    <p className="fw-bold">{numberToWord(+(fixedValues(totalAmount?.amountAftertax, 2)))}</p>
                </div>
                {/* Signs */}
                {/* <div className="d-flex mt-2 border">
                    <div className="col-6 border-end">
                        <p className="fw-bold"></p>
                    </div>
                    <div className="col-6"></div>
                </div> */}
            </div>
        </div> : <p className='text-danger fs-2 fw-bold mt-5 w-50 mx-auto'>{msg}</p>}</>
    )
}

export default Summary2