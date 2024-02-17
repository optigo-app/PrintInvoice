import React, { useEffect, useState } from 'react'
import style from "../../assets/css/prints/retailInvoicePrint5.module.css";
import { ToWords } from 'to-words';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import Loader from '../../components/Loader';
import { cloneDeep } from 'lodash';
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
const RetailInvoicePrint5 = ({ urls, token, invoiceNo, printName, evn }) => {
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const toWords = new ToWords();
    const [data, setData] = useState({});
    const [label, setlabel] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const [header, setHeader] = useState(null);
    const [footer, setFooter] = useState(null);
    const [nri, setNri] = useState("");
    const [foreignPassport, setForeignPassport] = useState("");

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
        let nri = data?.BillPrint_Json[0]?.DocumentDetail?.split("#@#").map(e => e.split("#-#"));
        let findNri = nri?.findIndex((e, i) => e[0] === "NRI ID");
        if (findNri !== -1) {
            setNri(nri[findNri][1]);
        }
        let findForeignPassPort = nri?.findIndex((e, i) => e[0] === "FOREIGN PASSPORT");
        if (findForeignPassPort !== -1) {
            setForeignPassport(nri[findForeignPassPort][1]);
        }

        let finalArr = [];
        datas?.resultArray?.forEach((e, i) => {
            if (e?.GroupJobid !== 0) {
                let findIndex = finalArr?.findIndex((ele, ind) => ele?.GroupJob === e?.GroupJob);
                if (findIndex === -1) {
                    let obj = cloneDeep(e);
                    let findPrimaryMetal = e?.metal?.findIndex((ele, ind) => ele?.IsPrimaryMetal === 1);
                    let metalRate = 0;
                    if (findPrimaryMetal !== -1) {
                        metalRate = e?.metal?.[findPrimaryMetal]?.Rate;
                    }
                    obj.metalRate = metalRate;
                    finalArr.push(obj);
                } else {
                    let findPrimaryMetal = e?.metal?.findIndex((ele, ind) => ele?.IsPrimaryMetal === 1);
                    let metalRate = 0;
                    if (findPrimaryMetal !== -1) {
                        metalRate = e?.metal?.[findPrimaryMetal]?.Rate;
                    }
                    finalArr[findIndex].metalRate = (finalArr[findIndex].metalRate + metalRate) / 2;
                    if (e?.SrJobno === e?.GroupJob) {
                        let other_details = finalArr[findIndex].other_details.concat(e?.other_details);
                        let otherDetails = [];
                        other_details?.forEach((ele, ind) => {
                            let findOther = otherDetails?.findIndex((elem, index) => elem?.label === ele?.label);
                            if (findOther === -1) {
                                otherDetails.push(ele);
                            } else {
                                otherDetails[findOther].value = +otherDetails[findOther].value + +e?.value;
                            }
                        })
                        finalArr[findIndex].MetalPurity = e?.MetalPurity;
                        finalArr[findIndex].MetalType = e?.MetalType;
                        finalArr[findIndex].MetalTypePurity = e?.MetalTypePurity;
                        finalArr[findIndex].grosswt += e?.grosswt;
                        // finalArr[findIndex].other_details = finalArr[findIndex].other_details.concat(e?.other_details);
                        finalArr[findIndex].other_details = otherDetails;
                        finalArr[findIndex].totals.diamonds.Wt += e?.totals?.diamonds?.Wt;
                        finalArr[findIndex].totals.colorstone.Wt += e?.totals?.colorstone?.Wt;
                        finalArr[findIndex].totals.finding.Wt += e?.totals?.finding?.Wt;
                        finalArr[findIndex].NetWt += e?.NetWt;
                        finalArr[findIndex].metalRate = (finalArr[findIndex].metalRate + metalRate) / 2;
                        finalArr[findIndex].MaKingCharge_Unit += e?.MaKingCharge_Unit;
                        finalArr[findIndex].OtherCharges += e?.OtherCharges;
                        finalArr[findIndex].TotalAmount += e?.TotalAmount;
                    }
                }
            }
        });

        let resultArr = [];
        datas?.resultArray?.forEach((e, i) => {
            if (e?.GroupJobid === 0) {
                let findPrimaryMetal = e?.metal?.findIndex((ele, ind) => ele?.IsPrimaryMetal === 1);
                let metalRate = 0;
                if (findPrimaryMetal !== -1) {
                    metalRate = e?.metal[findPrimaryMetal]?.Rate;
                }
                let obj = cloneDeep(e);
                obj.metalRate = metalRate;
                resultArr.push(obj);
            } else {
                let findData = finalArr?.findIndex(ele => ele?.GroupJob === e?.GroupJob);
                if (findData !== -1) {
                    let obj = cloneDeep(e);
                    if (obj?.MaKingCharge_Unit === finalArr[findData]?.MaKingCharge_Unit) {
                        let findD = resultArr?.findIndex(ele => ele?.GroupJob === obj?.GroupJob && ele?.MaKingCharge_Unit === obj?.MaKingCharge_Unit);
                        if (findD === -1) {
                            let other_details = obj.other_details.concat(finalArr[findData]?.other_details);
                            let otherDetails = [];
                            other_details?.forEach((ele, ind) => {
                                let findOther = otherDetails?.findIndex((elem, index) => elem?.label === ele?.label);
                                if (findOther === -1) {
                                    otherDetails.push(ele);
                                } else {
                                    otherDetails[findOther].value = +otherDetails[findOther]?.value + +ele?.value;
                                }
                            })
                            obj.MetalPurity = finalArr[findData]?.MetalPurity;
                            obj.MetalType = finalArr[findData]?.MetalType;
                            obj.MetalTypePurity = finalArr[findData]?.MetalTypePurity;
                            obj.grosswt += finalArr[findData]?.grosswt;
                            // obj.other_details = obj.other_details.concat(finalArr[findData]?.other_details);
                            // obj.other_details = otherDetails;
                            obj.totals.diamonds.Wt += finalArr[findData]?.totals?.diamonds?.Wt;
                            obj.totals.colorstone.Wt += finalArr[findData]?.totals?.colorstone?.Wt;
                            obj.NetWt += finalArr[findData]?.NetWt;
                            obj.metalRate += finalArr[findData]?.metalRate;
                            // obj.MaKingCharge_Unit += finalArr[findData]?.MaKingCharge_Unit;
                            obj.OtherCharges += finalArr[findData]?.OtherCharges;
                            obj.TotalAmount += finalArr[findData]?.TotalAmount;
                            resultArr.push(obj);
                        }
                    } else {
                        let other_details = obj.other_details.concat(finalArr[findData]?.other_details);
                        let otherDetails = [];
                        other_details?.forEach((ele, ind) => {
                            let findOther = otherDetails?.findIndex((elem, index) => elem?.label === ele?.label);
                            if (findOther === -1) {
                                otherDetails.push(ele);
                            } else {
                                otherDetails[findOther].value = +otherDetails[findOther]?.value + +ele?.value;
                            }
                        })
                        // obj.other_details = otherDetails;
                        obj.MetalPurity = finalArr[findData]?.MetalPurity;
                        obj.MetalType = finalArr[findData]?.MetalType;
                        obj.MetalTypePurity = finalArr[findData]?.MetalTypePurity;
                        obj.grosswt += finalArr[findData]?.grosswt;
                        // obj.other_details = obj.other_details.concat(finalArr[findData]?.other_details);
                        obj.totals.diamonds.Wt += finalArr[findData]?.totals?.diamonds?.Wt;
                        obj.totals.colorstone.Wt += finalArr[findData]?.totals?.colorstone?.Wt;
                        obj.NetWt += finalArr[findData]?.NetWt;
                        obj.metalRate += finalArr[findData]?.metalRate;
                        obj.OtherCharges += finalArr[findData]?.OtherCharges;
                        obj.TotalAmount += finalArr[findData]?.TotalAmount;
                        resultArr.push(obj);
                    }
                }
            }
        });

        datas.resultArray = resultArr;
        setData(datas);

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
        loader ? <Loader /> : msg === "" ? <>
            <div className={`container max_width_container ${style?.retailInvoicePrint5} pad_60_allPrint px-1 mt-1`}>
                {/* buttons */}
                <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
                    <div className="form-check ps-3">
                        <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* header */}
                {header}
                <div className="border d-flex">
                    <div className="col-8 border-end px-2">
                        <p>To, </p>
                        <p className='fw-bold'>{headerData?.CustName}</p>
                        <p>{headerData?.customerAddress1}</p>
                        <p>{headerData?.customerAddress2}</p>
                        <p>{headerData?.customercity}-{headerData?.PinCode}</p>
                        <p>{headerData?.customercountry}</p>
                        <p>{headerData?.CompanyEmail}</p>
                        <p>Phno:{headerData?.customermobileno}</p>
                        <p>GSTIN-{headerData?.CustGstNo} | PAN-{headerData?.CustPanno} | Aadhar-{headerData?.aadharno}</p>
                        <p>STATE CODE-{headerData?.Cust_CST_STATE_No}</p>
                    </div>
                    <div className="col-4 px-2">
                        <div className="d-flex">
                            <div className="col-6"> <p>INVOICE NO</p></div>
                            <div className="col-6"><p>{headerData?.InvoiceNo}</p></div>
                        </div>
                        <div className="d-flex">
                            <div className="col-6"><p>DATE	{headerData?.EntryDate}</p></div>
                            <div className="col-6"><p>{headerData?.HSN_No_Label}	{headerData?.HSN_No}</p></div>
                        </div>
                        <div className='d-flex'>
                            <div className="col-6">  <p>Reverse Charge</p>	 </div>
                            <div className='col-6 d-flex'><input type="checkbox" /><p className='px-1'>Yes</p> <input type="checkbox" /> <p className='px-1'>No</p></div></div>
                        <div className="d-flex">
                            <div className="col-6"><p>AADHAR CARD</p></div>
                            <div className="col-6"><p>{headerData?.aadharno}</p></div>
                        </div>
                        <div className="d-flex">
                            <div className="col-6"><p>NRI ID</p></div>
                            <div className="col-6"><p>{nri}^</p></div>
                        </div>
                        <div className="d-flex">
                            <div className="col-6"><p>FOREIGN PASSPORT</p></div>
                            <div className="col-6"><p>{foreignPassport}</p></div>
                        </div>
                    </div>
                </div>
                {/* table header */}
                <div className="pt-1">
                    <div className="d-flex border">
                        <div className={`${style?.Sr} border-end d-flex justify-content-center align-items-center`}><p className="fw-bold text-center p-1">Sr#</p></div>
                        <div className={`${style?.Product} border-end d-flex justify-content-center align-items-center`}><p className="fw-bold text-center p-1">Product Description</p></div>
                        <div className={`${style?.Material} border-end `}>
                            <div className="d-grid h-100">
                                <div className="d-flex">
                                    <p className="fw-bold text-center p-1 w-100 border-bottom">Material Description</p>
                                </div>
                                <div className="d-flex">
                                    <div className='col-2 border-end'><p className="fw-bold text-center p-1">Material</p></div>
                                    <div className='col-2 border-end'><p className="fw-bold text-center p-1">Carat</p></div>
                                    <div className='col-2 border-end'><p className="fw-bold text-center p-1">GWT</p></div>
                                    <div className='col-2 border-end'><p className="fw-bold text-center p-1">STONE/DIA Wt.</p></div>
                                    <div className='col-2 border-end'><p className="fw-bold text-center p-1">NWT</p></div>
                                    <div className='col-2'><p className="fw-bold text-center p-1">Rate</p></div>
                                </div>
                            </div>
                        </div>
                        <div className={`${style?.Making} border-end d-flex justify-content-center align-items-center`}><p className="fw-bold text-center p-1">Making</p></div>
                        <div className={`${style?.Others} border-end d-flex justify-content-center align-items-center`}><p className="fw-bold text-center p-1">Others</p></div>
                        <div className={`${style?.Total} d-flex justify-content-center align-items-center`}><p className="fw-bold text-center p-1">Total</p></div>
                    </div>
                </div>
                {/* table data */}
                {data?.resultArray?.map((e, i) => {
                    return <div className="d-flex border-start border-bottom border-end" key={i}>
                        <div className={`${style?.Sr} border-end`}><p className="fw-bold text-center p-1">{NumberWithCommas(i + 1, 0)}</p></div>
                        <div className={`${style?.Product} border-end p-1`}>
                            <p>{e?.SubCategoryname} {e?.Categoryname}</p>
                            <p>{e?.designno} | {e?.SrJobno}</p>
                            <img src={e?.DesignImage} alt="" className='imgWidth' />
                            <p>HUID-{e?.HUID}</p>
                        </div>
                        <div className={`${style?.Material} border-end `}>
                            <div className={`d-grid h-100`}>
                                <div className={`d-flex ${(e?.totals?.diamonds?.Wt !== 0 || e?.totals?.colorstone?.Wt !== 0 || e?.totals?.finding?.Wt !== 0) && 'border-bottom'}`}>
                                    <div className='col-2 border-end'><p className=" p-1">{e?.MetalType}</p></div>
                                    <div className='col-2 border-end'><p className=" p-1">{e?.MetalPurity} / {e?.Tunch}% {e?.other_details?.map((ele, ind) => <span key={ind}>{ele?.label}</span>)}</p></div>
                                    <div className='col-2 border-end'><p className="text-end p-1">{NumberWithCommas(e?.grosswt, 3)}</p></div>
                                    <div className='col-2 border-end'><p className=" p-1"></p></div>
                                    <div className='col-2 border-end'><p className="text-end p-1">{NumberWithCommas(e?.NetWt, 3)}</p></div>
                                    <div className='col-2'><p className="text-end p-1">{NumberWithCommas(e?.metalRate, 2)}</p></div>
                                </div>
                                {
                                    e?.totals?.diamonds?.Wt !== 0 && <div className="d-flex">
                                        <div className='col-2 border-end'><p className=" p-1">Diamond</p></div>
                                        <div className='col-2 border-end'><p className=" p-1"></p></div>
                                        <div className='col-2 border-end'><p className="text-end p-1"></p></div>
                                        <div className='col-2 border-end'><p className="text-end p-1">{NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}</p></div>
                                        <div className='col-2 border-end'><p className="text-end p-1"></p></div>
                                        <div className='col-2'><p className="text-end p-1">{NumberWithCommas(e?.totals?.diamonds?.Amount, 2)}</p></div>
                                    </div>
                                }
                                {
                                    e?.totals?.colorstone?.Wt !== 0 && <div className="d-flex">
                                        <div className='col-2 border-end'><p className=" p-1">Colorstone</p></div>
                                        <div className='col-2 border-end'><p className=" p-1"></p></div>
                                        <div className='col-2 border-end'><p className="text-end p-1"></p></div>
                                        <div className='col-2 border-end'><p className="text-end p-1">{NumberWithCommas(e?.totals?.colorstone?.Wt, 3)}</p></div>
                                        <div className='col-2 border-end'><p className="text-end p-1"></p></div>
                                        <div className='col-2'><p className="text-end p-1">{NumberWithCommas(e?.totals?.colorstone?.Amount, 2)}</p></div>
                                    </div>
                                }
                                {
                                    e?.totals?.finding?.Wt !== 0 && <div className="d-flex">
                                        <div className='col-2 border-end'><p className=" p-1"></p></div>
                                        <div className='col-2 border-end'><p className=" p-1"></p></div>
                                        <div className='col-2 border-end'><p className="text-end p-1"></p></div>
                                        <div className='col-2 border-end'><p className="text-end p-1">{NumberWithCommas(e?.totals?.finding?.Wt, 3)}</p></div>
                                        <div className='col-2 border-end'><p className="text-end p-1"></p></div>
                                        <div className='col-2'><p className="text-end p-1"></p></div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className={`${style?.Making} border-end`}><p className="text-end p-1">{NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p></div>
                        <div className={`${style?.Others} border-end`}><p className="text-end p-1">{NumberWithCommas(e?.OtherCharges, 2)}</p></div>
                        <div className={`${style?.Total}`}><p className="text-end p-1">{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
                    </div>
                })}

                {/* table total */}
                <div className="d-flex border-start border-bottom border-end">
                    <div className={`${style?.Sr} border-end`}><p className="fw-bold text-center p-1">	</p></div>
                    <div className={`${style?.Product} border-end p-1`}>
                        <p className='fw-bold'>TOTAL</p>
                    </div>
                    <div className={`${style?.Material} border-end `}>
                        <div className="d-grid h-100">
                            <div className="d-flex">
                                <div className='col-2 border-end p-1'><p className=""></p></div>
                                <div className='col-2 border-end p-1'><p className=""></p></div>
                                <div className='col-2 border-end p-1'><p className="text-end fw-bold">{NumberWithCommas(data?.mainTotal?.grosswt, 3)} gm	</p></div>
                                <div className='col-2 border-end p-1'>
                                    <p className="text-end fw-bold">{NumberWithCommas(data?.mainTotal?.diamonds?.Wt + data?.mainTotal?.colorstone?.Wt + data?.mainTotal?.finding?.Wt, 3)} Ctw</p>
                                    <p className='text-end fw-bold'>{NumberWithCommas((data?.mainTotal?.diamonds?.Wt + data?.mainTotal?.colorstone?.Wt + data?.mainTotal?.finding?.Wt) / 5, 3)} gm</p>
                                </div>
                                <div className='col-2 border-end p-1'><p className="text-end fw-bold">{NumberWithCommas(data?.mainTotal?.netwtWithLossWt, 3)} gm	</p></div>
                                <div className='col-2 p-1'><p className="text-end fw-bold"></p></div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style?.Making} border-end`}><p className="text-end p-1 fw-bold"></p></div>
                    <div className={`${style?.Others} border-end`}><p className="text-end p-1 fw-bold">{NumberWithCommas(data?.mainTotal?.total_other_charges, 2)}</p></div>
                    <div className={`${style?.Total}`}><p className="text-end p-1 fw-bold">{NumberWithCommas(data?.mainTotal?.total_unitcost, 2)}</p></div>
                </div>
                {/* amount in words */}
                <div className="d-flex border-start border-bottom border-end">
                    <div className={`${style?.inWords} border-end d-flex flex-column justify-content-between`}>
                        <div className='p-1'> </div>
                        <div className='p-1'>
                            <p>
                                In Words Indian Rupees
                            </p>
                            <p className="fw-bold">
                                {toWords.convert(+fixedValues(data?.finalAmount, 2))} Only
                                {/* One Lakh Sixty-Eight Thousand Eight Hundred and Twenty-Seven Point Zero Four  */}
                            </p>
                        </div>
                        <div className='p-1'>
                            Old Gold Purchase Description : <span className="fw-bold">{headerData?.Remark}</span>
                        </div>
                    </div>
                    <div className={`${style?.grandTotal} border-end py-1`}>
                        {data?.mainTotal?.total_discount_amount !== 0 && <p className="text-end px-1">Discount</p>}
                        <p className="text-end px-1">Total Amt.</p>
                        {data?.allTaxes?.map((e, i) => {
                            return <p className="text-end px-1" key={i}>{e?.name} @ {e?.per} </p>
                        })}
                        {headerData?.AddLess !== 0 && <p className="text-end px-1">{headerData?.AddLess > 0 ? "Add" : "Less"}</p>}
                        <p className="text-end px-1">Total Amt. after Tax</p>
                        <p className="text-end px-1">Old Gold</p>
                        <p className="text-end px-1">Recv.in Cash</p>
                        <p className="text-end px-1">Recv.in Bank</p>
                        <p className="text-end px-1">Net Bal. Amount</p>
                        <p className="p-1 text-end border-top fw-bold">
                            GRAND TOTAL
                        </p>
                    </div>
                    <div className={`${style?.Total} py-1`}>
                        {data?.mainTotal?.total_discount_amount !== 0 && <p className="text-end px-1">{NumberWithCommas(data?.mainTotal?.total_discount_amount, 2)}</p>}
                        <p className="text-end px-1">{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p>
                        {data?.allTaxes?.map((e, i) => {
                            return <p className="text-end px-1" key={i}>{NumberWithCommas(e?.amount, 2)} </p>
                        })}
                        {headerData?.AddLess !== 0 && <p className="text-end px-1">{NumberWithCommas(headerData?.AddLess, 2)}</p>}
                        <p className="text-end px-1">{NumberWithCommas(data?.finalAmount, 2)}</p>
                        <p className="text-end px-1">{NumberWithCommas(headerData?.OldGoldAmount, 2)}</p>
                        <p className="text-end px-1">{NumberWithCommas(headerData?.CashReceived, 2)}</p>
                        <p className="text-end px-1">{NumberWithCommas(headerData?.BankReceived, 2)}</p>
                        <p className="text-end px-1">{NumberWithCommas(data?.finalAmount, 2)}</p>
                        <p className="p-1 text-end border-top fw-bold">
                            <span dangerouslySetInnerHTML={{__html: headerData?.Currencysymbol}}></span> {NumberWithCommas(data?.finalAmount, 2)}
                        </p>
                    </div>
                </div>
                {/* declaration */}
                <div className="d-flex border-start border-end border-bottom p-1">
                    <p className={``} dangerouslySetInnerHTML={{__html: headerData?.Declaration}}>
                    </p>
                </div>
                {/* bank details */}
                {footer}
            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default RetailInvoicePrint5
