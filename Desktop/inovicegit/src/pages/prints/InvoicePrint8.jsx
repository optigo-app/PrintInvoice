import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/InvoicePrint8.module.css";
import Loader from '../../components/Loader';
import {
    HeaderComponent,
    NumberWithCommas,
    apiCall,
    handleImageError,
    handlePrint,
    isObjectEmpty,
    taxGenrator,
    FooterComponent,
    fixedValues,
} from "../../GlobalFunctions";
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';
import { ToWords } from "to-words";

const InvoicePrint8 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const toWords = new ToWords();
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [image, setImage] = useState(false);
    const [header, setHeader] = useState(null);
    const [footer, setFooter] = useState(null);
    const [headerData, setHeaderData] = useState({});
    const [label, setlabel] = useState([]);
    const [other, setOther] = useState({
        other1: [],
        other2: [],
    });
    const [metal, setMetal] = useState([]);
    const [data, setData] = useState({});
    const [total, setTotal] = useState(0);

    const loadData = (data) => {
        let head = HeaderComponent("1", data?.BillPrint_Json[0]);
        setHeader(head);
        let footers = FooterComponent("2", data?.BillPrint_Json[0]);
        setFooter(footers);
        setHeaderData(data?.BillPrint_Json[0]);
        let printArr = data?.BillPrint_Json[0]?.Printlable.split("\r\n");
        setlabel(printArr);
        let totals = 0;
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
        // console.log(datas);
        setData(datas);
        let metals = [];
        let diamonds = [];
        let colorstone = [];
        let misc = [];
        let othercharges1 = [];
        let othercharges2 = [];
        datas?.resultArray?.forEach((e, i) => {
            let findGold = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1);
            if (findGold !== undefined) {
                let findMetals = metals?.findIndex((elem, index) => elem?.metalRate === findGold?.Rate && elem?.MetalTypePurity === e?.MetalTypePurity);
                totals += e?.totals?.metal?.Amount;
                if (findMetals === -1) {
                    let obj = cloneDeep(e);
                    obj.metalRate = findGold?.Rate;
                    obj.metalAmount = findGold?.Amount;
                    obj.metalPcs = findGold?.Pcs;
                    obj.metalWt = findGold?.Wt;
                    metals.push(obj);
                } else {
                    metals[findMetals].grosswt = e?.grosswt;
                    metals[findMetals].NetWt = e?.NetWt;
                    metals[findMetals].TotalAmount = e?.TotalAmount;
                    metals[findMetals].metalAmount = findGold?.Amount;
                    metals[findMetals].totals.metal.Amount += e?.totals?.metal?.Amount;
                    metals[findMetals].UnitCost += e?.totals?.UnitCost;
                }
                e?.other_details?.forEach((ele, ind) => {
                    let findOther = othercharges1?.findIndex((elem, index) => elem?.label === ele?.label);
                    if (findOther === -1) {
                        othercharges1.push(ele);
                        totals += +ele?.value;
                    } else {
                        othercharges1[findOther].value = +othercharges1[findOther].value + +ele?.value;
                        totals += +ele?.value;
                    }
                });
            }
        });

        data?.BillPrint_Json2?.forEach((ele, ind) => {
            if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
                if (ele?.IsHSCOE !== 0) {
                    let findOther = othercharges2?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName);
                    if (findOther === -1) {
                        othercharges2.push(ele);
                        totals += ele?.Amount;
                    } else {
                        othercharges2[findOther].Wt += ele?.Wt;
                        othercharges2[findOther].Pcs += ele?.Pcs;
                        othercharges2[findOther].Amount += ele?.Amount;
                        totals += ele?.Amount;
                    }
                }
            }
        });

        setTotal(totals);
        setMetal(metals);
        setOther({ ...other, other1: othercharges1, other2: othercharges2 });
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
            <div className={`container max_width_container ${style?.invoiceprint8} pad_60_allPrint px-1 mt-1`}>
                {/* buttons */}
                <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
                    <div className="form-check ps-3">
                        <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* header */}
                {header}
                {/* sub header */}
                <div className="d-flex border">
                    <div className="col-4 border-end p-2">
                        <p>Bill To,</p>
                        <p className="fw-bold">{headerData?.customerfirmname}</p>
                        <p>{headerData?.customerAddress1}</p>
                        <p>{headerData?.customerAddress2}</p>
                        <p>{headerData?.customercity}-{headerData?.PinCode}</p>
                        <p>{headerData?.CompanyEmail}</p>
                        <p>{headerData?.vat_cst_pan}</p>
                        <p>{headerData?.CustGstNo}</p>
                    </div>
                    <div className="col-4 border-end p-2">

                        <p>Ship To,</p>
                        <p className='fw-bold'>{headerData?.customerfirmname}</p>
                        {label?.map((ele, ind) => {
                            return <p key={ind}>{ele}</p>
                        })}
                    </div>
                    <div className="col-4 p-2">
                        <div className='d-flex'><p className="fw-bold col-6">BILL NO</p> <p className='col-6'>	{headerData?.InvoiceNo}</p></div>
                        <div className='d-flex'><p className="fw-bold col-6">DATE</p> <p className='col-6'>	{headerData?.EntryDate}</p></div>
                        <div className='d-flex'><p className="fw-bold col-6">{headerData?.HSN_No}</p> <p className='col-6'>	{headerData?.HSN_No_Label}</p></div>
                        <div className='d-flex'><p className="fw-bold col-6">NAME OF GOODS</p> <p className='col-6'>	{headerData?.NameOfGoods}</p></div>
                        <div className='d-flex'><p className="fw-bold col-6">PLACE OF SUPPLY</p> <p className='col-6'>	{headerData?.State}</p></div>
                        <div className='d-flex'><p className="fw-bold col-6">TERMS</p><p className='col-6'>{headerData?.DueDays}</p></div>
                    </div>
                </div>
                {/* table header */}
                <div className="d-flex border-start border-end border-bottom">
                    <div className="col-4 border-end px-1"><p className="fw-bold text-center">DESCRIPTION</p></div>
                    <div className="col-8 d-flex px-1">
                        <p className={`fw-bold text-center ${style?.Detail}`}>Detail</p>
                        <p className={`fw-bold text-center ${style?.Gross}`}>Gross Wt.</p>
                        <p className={`fw-bold text-center ${style?.Net}`}>Net Wt.</p>
                        <p className={`fw-bold text-center ${style?.Pcs}`}>Pcs</p>
                        <p className={`fw-bold text-center ${style?.Qty}`}>Qty</p>
                        <p className={`fw-bold text-center ${style?.Rate}`}>Rate</p>
                        <p className={`fw-bold text-center ${style?.Amount}`}>Amount</p>
                    </div>
                </div>
                {/* table data */}
                <div className="d-flex border-start border-end border-bottom">
                    <div className="col-4 border-end px-1 d-flex justify-content-center align-items-center flex-column"><p className=" text-center">DIAMOND STUDDED JEWELLERY</p><p className="fw-bold text-center">Total Pcs : 7</p></div>
                    <div className="col-8 px-1">
                        {
                            metal?.map((e, i) => {
                                return e?.metalAmount !== 0 && <div className="d-flex" key={i}>
                                    <p className={` ${style?.Detail}`}>{e?.MetalTypePurity} </p>
                                    <p className={`text-end ${style?.Gross}`}>{NumberWithCommas(e?.grosswt, 3)} Gms</p>
                                    <p className={`text-end ${style?.Net}`}>{NumberWithCommas(e?.NetWt, 3)} Gms	</p>
                                    <p className={`text-end ${style?.Pcs}`}></p>
                                    <p className={`text-end ${style?.Qty}`}> </p>
                                    <p className={`text-end ${style?.Rate}`}>{NumberWithCommas(e?.metalRate, 2)}</p>
                                    <p className={`text-end ${style?.Amount}`}>{NumberWithCommas(e?.totals?.metal?.Amount, 2)}</p>
                                </div>
                            })
                        }
                        {data?.mainTotal?.diamonds?.Pcs > 0 && <div className="d-flex">
                            <p className={` ${style?.Detail}`}>DIAMOND</p>
                            <p className={`text-end ${style?.Gross}`}></p>
                            <p className={`text-end ${style?.Net}`}>	</p>
                            <p className={`text-end ${style?.Pcs}`}>{NumberWithCommas(data?.mainTotal?.diamonds?.Pcs, 0)}</p>
                            <p className={`text-end ${style?.Qty}`}>{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)} Ctw</p>
                            <p className={`text-end ${style?.Rate}`}>{NumberWithCommas(data?.mainTotal?.diamonds?.Rate, 2)} / Wt</p>
                            <p className={`text-end ${style?.Amount}`}>{NumberWithCommas(data?.mainTotal?.diamonds?.Amount, 2)}</p>
                        </div>}
                        {data?.mainTotal?.colorstone?.Pcs > 0 && <div className="d-flex">
                            <p className={` ${style?.Detail}`}>COLOR STONE	</p>
                            <p className={`text-end ${style?.Gross}`}></p>
                            <p className={`text-end ${style?.Net}`}></p>
                            <p className={`text-end ${style?.Pcs}`}>{NumberWithCommas(data?.mainTotal?.colorstone?.Pcs, 0)}</p>
                            <p className={`text-end ${style?.Qty}`}>{NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)} Ctw</p>
                            <p className={`text-end ${style?.Rate}`}>{NumberWithCommas(data?.mainTotal?.colorstone?.Rate, 2)} / Wt</p>
                            <p className={`text-end ${style?.Amount}`}>{NumberWithCommas(data?.mainTotal?.colorstone?.Amount, 2)}</p>
                        </div>}
                        {data?.mainTotal?.colorstone?.Pcs > 0 && <div className="d-flex">
                            <p className={` ${style?.Detail}`}>OTHER MATERIAL	</p>
                            <p className={`text-end ${style?.Gross}`}></p>
                            <p className={`text-end ${style?.Net}`}></p>
                            <p className={`text-end ${style?.Pcs}`}>{NumberWithCommas(data?.mainTotal?.misc?.Pcs, 0)}</p>
                            <p className={`text-end ${style?.Qty}`}>{NumberWithCommas(data?.mainTotal?.misc?.Wt, 3)} gms</p>
                            <p className={`text-end ${style?.Rate}`}>{NumberWithCommas(data?.mainTotal?.misc?.Rate, 2)} / Wt</p>
                            <p className={`text-end ${style?.Amount}`}>{NumberWithCommas(data?.mainTotal?.misc?.Amount, 2)}</p>
                        </div>}

                        <div className="d-flex">
                            <p className={` ${style?.Detail}`}>LABOUR	</p>
                            <p className={`text-end ${style?.Gross}`}></p>
                            <p className={`text-end ${style?.Net}`}></p>
                            <p className={`text-end ${style?.Pcs}`}></p>
                            <p className={`text-end ${style?.Qty}`}></p>
                            <p className={`text-end ${style?.Rate}`}>{NumberWithCommas(data?.mainTotal?.misc?.Rate, 2)} </p>
                            <p className={`text-end ${style?.Amount}`}>{NumberWithCommas(data?.mainTotal?.total_labour?.labour_amount, 2)}</p>
                        </div>
                        {
                            other?.other1?.map((e, i) => {
                                return <div className="d-flex" key={i}>
                                    <p className={` ${style?.Detail}`}>{e?.label}	</p>
                                    <p className={`text-end ${style?.Gross}`}></p>
                                    <p className={`text-end ${style?.Net}`}></p>
                                    <p className={`text-end ${style?.Pcs}`}></p>
                                    <p className={`text-end ${style?.Qty}`}></p>
                                    <p className={`text-end ${style?.Rate}`}> </p>
                                    <p className={`text-end ${style?.Amount}`}>{NumberWithCommas(+e?.value, 2)}</p>
                                </div>
                            })
                        }
                        {
                            other?.other2?.map((e, i) => {
                                return <div className="d-flex" key={i}>
                                    <p className={` ${style?.Detail}`}>{e?.ShapeName}	</p>
                                    <p className={`text-end ${style?.Gross}`}></p>
                                    <p className={`text-end ${style?.Net}`}></p>
                                    <p className={`text-end ${style?.Pcs}`}></p>
                                    <p className={`text-end ${style?.Qty}`}></p>
                                    <p className={`text-end ${style?.Rate}`}> </p>
                                    <p className={`text-end ${style?.Amount}`}>{NumberWithCommas(e?.Amount, 2)}</p>
                                </div>
                            })
                        }

                    </div>
                </div>
                {/* table total */}
                <div className="d-flex border-start border-end border-bottom">
                    <div className="col-4 border-end px-1 d-flex justify-content-center align-items-center flex-column"><p className=" text-center"></p></div>
                    <div className="col-8 p-1 d-flex justify-content-between">
                        <p className={` ${style?.Detail} fw-bold`}>Total</p>
                        <p className={`text-end ${style?.Amount} fw-bold`}>{NumberWithCommas(data?.finalAmount, 2)}</p>
                    </div>
                </div>
                {/* table taxes */}
                {/* <div className="d-flex border-start border-end border-bottom">
                    <div className="col-8 border-end"></div>
                    <div className="col-4 d-flex">
                        <div className="col-6 px-1">
                            <p>Discount</p>
                            <p className='fw-bold'>Total Amount</p>
                            <p>CGST @ 0.13%</p>
                            <p>SGST @ 0.13%</p>
                            <p>Less</p>
                        </div>
                        <div className="col-6 text-end px-1">
                            <p>1,857.50</p>
                            <p className='fw-bold'>2,75,000.18</p>
                            <p>357.37</p>
                            <p>357.37</p>
                            <p>-0.92</p>
                        </div>
                    </div>
                </div> */}
                {/* Grand Total */}
                <div className="my-1">
                    <div className="border d-flex">
                        <div className="col-8 border-end px-2">
                            <p className="fw-bold">IN Words Indian Rupees</p>
                            <p className="fw-bold">{toWords?.convert(+fixedValues(data?.finalAmount, 2))} Only.</p>
                        </div>
                        <div className="col-4 p-2 d-flex justify-content-between">
                            <p className="fw-bold">Grand Total</p>
                            <p className="fw-bold">{NumberWithCommas(data?.finalAmount, 2)}</p>
                        </div>
                    </div>
                </div>
                {/* Note */}
                <div className="border-start border-end border-bottom px-2">
                    <div dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}></div>
                </div>
                {/* print remark */}
                <div className='px-2'>
                    <p><span className="fw-bold">REMARKS : </span> {headerData?.PrintRemark}</p>
                </div>
                {/* note */}
                {footer}
            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default InvoicePrint8
