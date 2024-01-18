import React from 'react';
import { NumberWithCommas, apiCall, fixedValues, handleImageError, handlePrint, isObjectEmpty, otherAmountDetail, taxGenrator } from '../../GlobalFunctions';
import { useState } from 'react';
import { useEffect } from 'react';
import Loader from '../../components/Loader';
import style from "../../assets/css/prints/estimatePrint1.module.css";
import { ToWords } from 'to-words';

const EstimatePrint1 = ({ token, invoiceNo, printName, urls, evn }) => {

    const toWords = new ToWords();
    const [image, setImage] = useState(true);
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [json0Data, setJson0Data] = useState({});
    const [document, setDocument] = useState([]);
    const [data, setData] = useState([]);
    const [total, settotal] = useState({
        grosswt: 0,
        materialWt: 0,
        NetWt: 0,
        OtherCharges: 0,
        UnitCost: 0,
        TotalAmount: 0,
        discount: 0,
        afterTaxAmount: 0,
        netBalanceAmount: 0,
    });
    const [tax, setTax] = useState([]);

    const loadData = (data) => {
        setJson0Data(data?.BillPrint_Json[0]);
        let documnets = otherAmountDetail(data?.BillPrint_Json[0]?.DocumentDetail);
        setDocument(documnets);
        let totals = { ...total };
        let dataArr = [];
        data?.BillPrint_Json1.forEach((e, i) => {
            totals.grosswt += e?.grosswt;
            totals.NetWt += e?.NetWt;
            totals.OtherCharges += e?.MetalAmount + e?.OtherCharges;
            totals.UnitCost += e?.UnitCost;
            totals.TotalAmount += e?.TotalAmount;
            let obj = { ...e };
            let diamonds = [];
            let metals = [];
            data?.BillPrint_Json2.forEach((ele, ind) => {
                if (ele?.StockBarcode === e?.SrJobno) {
                    if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                        metals.push(ele);
                    } else if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
                        totals.materialWt += ele?.Wt;
                        totals.OtherCharges += ele?.Amount;
                        let findDiamonds = diamonds.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName);
                        if (findDiamonds === -1) {
                            diamonds.push(ele);
                        } else {
                            diamonds[findDiamonds].Wt += ele?.Wt;
                        }
                    }
                }
            });
            diamonds.sort((a, b) => {
                let nameA = (a?.ShapeName)?.toLowerCase();
                let nameB = (b?.ShapeName)?.toLowerCase();
                if (nameA > nameB) {
                    return 1;
                } else if (nameB > nameA) {
                    return -1;
                } else {
                    return 0;
                }
            });
            obj.diamonds = diamonds;
            obj.metals = metals;
            let metalRate = 0;
            let metalcount = 0;
            obj.metals.forEach((ele, ind) => {
                metalRate += ele?.Rate;
                metalcount += 1;
            });
            if (metalcount > 0) {
                metalRate = metalRate / metalcount;
            }
            obj.metalRate = metalRate;
            obj.metalcount = metalcount;
            if (e?.GroupJob !== "") {
                let findData = dataArr.findIndex((ele) => ele?.GroupJob === e?.GroupJob);
                if (findData === -1) {
                    dataArr.push(obj);
                } else {
                    if (obj?.GroupJob === obj?.SrJobno) {
                        dataArr[findData].SrJobno = dataArr[findData]?.GroupJob;
                        dataArr[findData].SubCategoryname = obj?.SubCategoryname;
                        dataArr[findData].Categoryname = obj?.Categoryname;
                        dataArr[findData].designno = obj?.designno;
                        dataArr[findData].DesignImage = obj?.DesignImage;
                        dataArr[findData].MetalTypePurity = obj?.MetalTypePurity;
                        dataArr[findData].MetalType = obj?.MetalType;
                        dataArr[findData].MetalPurity = obj?.MetalPurity;
                    } else {
                        obj.SrJobno = obj?.GroupJob;
                        obj.SubCategoryname = dataArr[findData]?.SubCategoryname;
                        obj.Categoryname = dataArr[findData]?.Categoryname;
                        obj.designno = dataArr[findData]?.designno;
                        obj.DesignImage = dataArr[findData]?.DesignImage;
                        obj.MetalTypePurity = dataArr[findData]?.MetalTypePurity;
                        obj.MetalType = dataArr[findData]?.MetalType;
                        obj.MetalPurity = dataArr[findData]?.MetalPurity;
                    }
                    let diamonds = [...obj.diamonds, ...dataArr[findData].diamonds].flat();
                    let blankDiamonds = [];
                    diamonds.forEach((ele, ind) => {
                        let findDiamond = blankDiamonds.findIndex((elem, index) => elem.ShapeName === ele?.ShapeName);
                        if (findDiamond === -1) {
                            blankDiamonds.push(ele);
                        } else {
                            blankDiamonds[findDiamond].Wt += ele?.Wt;
                        }
                    });
                    dataArr[findData].diamonds = blankDiamonds;
                    obj.diamonds = blankDiamonds;
                    dataArr.push(obj);
                }
            } else {
                dataArr.push(obj);
            }
        });

        totals.discount = totals?.UnitCost - totals?.TotalAmount;
        settotal(totals);

        let taxValue = taxGenrator(data?.BillPrint_Json[0], totals?.TotalAmount);
        setTax(taxValue);

        totals.afterTaxAmount = taxValue.reduce((acc, currVal) => {
            return acc + +currVal?.amount;
        }, 0) + totals?.TotalAmount + data?.BillPrint_Json[0]?.AddLess;

        totals.netBalanceAmount = totals.afterTaxAmount -
            data?.BillPrint_Json[0]?.OldGoldAmount -
            data?.BillPrint_Json[0]?.AdvanceAmount -
            data?.BillPrint_Json[0]?.CashReceived -
            data?.BillPrint_Json[0]?.BankReceived;

        dataArr.sort((a, b) => {
            let nameA = (a?.designno)?.toLowerCase();
            let nameB = (b?.designno)?.toLowerCase();
            if (nameA > nameB) {
                return 1;
            } else if (nameB > nameA) {
                return -1;
            } else {
                return 0
            }
        });
        setData(dataArr);
    }

    const handleChange = (e) => {
        image ? setImage(false) : setImage(true);
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
    return (<>
        {loader ? <Loader /> : msg === "" ? <div className={`container max_width_container pad_60_allPrint ${style?.estimate1Container}`}>
            {/* print button */}
            <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} pb-4 mt-5 w-100`}>
                <div className="form-check pe-3 mb-0">
                    <input className="form-check-input border-dark" type="checkbox" checked={image} onChange={e => handleChange(e)} name='image' />
                    <label className="form-check-label h6 mb-0 pt-1">
                        With Image
                    </label>
                </div>
                <div className="form-check ps-3">
                    <input type="button" className="btn_white blue mt-0 py-1" value="Print" onClick={(e) => handlePrint(e)} />
                </div>
            </div>
            {/* gst no  */}
            <div className='d-flex justify-content-center pt-2'>
                <p>{json0Data?.Company_VAT_GST_No} | {json0Data?.Company_CST_STATE}-{json0Data?.Company_CST_STATE_No} | PAN-{json0Data?.Pannumber}</p>
            </div>
            {/* print name */}
            <div className="border p-1 border-2 min_height_label bgGrey text-center" >
                <p className='text-uppercase fw-bold text-white'>{json0Data?.PrintHeadLabel}</p>
            </div>
            {/* customer detail */}
            <div className="my-1 border border-black d-flex">
                <div className="col-7 p-2 border-end">
                    <p>Customer Name : <span className="fw-bold">{json0Data?.CustName}</span></p>
                    <p>{json0Data?.customerAddress1}</p>
                    <p>{json0Data?.customerAddress2}</p>
                    <p>{json0Data?.customercity}-{json0Data?.customerpincode}</p>
                    <p>{json0Data?.customercountry}</p>
                    <p>{json0Data?.customeremail1}</p>
                    <p>Phno:{json0Data?.customermobileno}</p>
                    <p>{json0Data?.vat_cst_pan} | Aadhar-{json0Data?.aadharno}</p>
                    <p>{json0Data?.Cust_CST_STATE} {json0Data?.Cust_CST_STATE_No}</p>
                </div>
                <div className="col-5 p-2">
                    <p><span className="fw-bold">INVOICE NO </span>{json0Data?.InvoiceNo}  </p>
                    <p><span className="fw-bold">DATE </span>{json0Data?.DueDate} </p>
                    {document.map((e, i) => {
                        return <p key={i}><span className="fw-bold">{e?.label} </span>{e?.value}  </p>
                    })}
                </div>
            </div>
            {/* table header */}
            <div className="border d-flex">
                <div className="col-3 d-flex">
                    <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center"><p className="fw-bold">Sr#</p></div>
                    <div className="col-6 p-1 border-end d-flex align-items-center justify-content-center"><p className="fw-bold text-center">Product Description</p></div>
                    <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center"><p className="fw-bold">HSN</p></div>
                </div>
                <div className='col-6'>
                    <div className="d-grid h-100 w-100 border-end">
                        <div className="d-flex align-items-center justify-content-center w-100 border-bottom"><p className="fw-bold">Material Description</p></div>
                        <div className="d-flex align-items-center justify-content-center w-100">
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className='fw-bold'>Material</p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className='fw-bold'>Carat</p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className='fw-bold'>GWT</p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className='fw-bold'>LESS WT.</p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className='fw-bold'>NWT</p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1'><p className='fw-bold'>Rate</p></div>
                        </div>
                    </div>
                </div>
                <div className="col-3 d-flex">
                    <div className="col-4 p-1 border-end d-flex align-items-center justify-content-center"><p className="fw-bold">Making</p></div>
                    <div className="col-4 p-1 border-end d-flex align-items-center justify-content-center"><p className="fw-bold text-center">Material Charges</p></div>
                    <div className="col-4 p-1 d-flex align-items-center justify-content-center"><p className="fw-bold">Total</p></div>
                </div>
            </div>
            {/* table data */}
            {data.map((e, i) => {
                return <div className="border-start border-bottom border-end d-flex no_break" key={i}>
                    <div className="col-3 d-flex">
                        <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center"><p className="">{i + 1}</p></div>
                        <div className="col-6 p-1 border-end">
                            <p> {e?.SubCategoryname}  {e?.Categoryname}</p>
                            <p>{e?.designno} | {e?.SrJobno}</p>
                            {image && <img src={e?.DesignImage} alt="" className={`w-100 ${style?.img}`} onError={handleImageError} />}
                            {e?.HUID !== "" && <p className="text-center">HUID-{e?.HUID}</p>}
                        </div>
                        <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center"><p className="">{json0Data?.HSN_No}</p></div>
                    </div>
                    <div className='col-6'>
                        <div className="d-grid h-100 border-end">
                            <div className="d-flex border-bottom">
                                <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''>{e?.MetalType}</p></div>
                                <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''>{e?.MetalPurity}</p></div>
                                <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''>{NumberWithCommas(e?.grosswt, 3)}	</p></div>
                                <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''></p></div>
                                <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''>{NumberWithCommas(e?.NetWt)}</p></div>
                                <div className='col-2 d-flex align-items-center justify-content-center p-1'><p className=''>{NumberWithCommas(e?.metalRate, 2)}</p></div>
                            </div>
                            {e?.diamonds.map((ele, ind) => {
                                return <div className="d-flex border-bottom" key={ind}>
                                    <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''>{ele?.ShapeName}</p></div>
                                    <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''>	</p></div>
                                    <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''></p></div>
                                    <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''>{NumberWithCommas(ele?.Wt, 3)}</p></div>
                                    <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''></p></div>
                                    <div className='col-2 d-flex align-items-center justify-content-center p-1'><p className=''></p></div>
                                </div>
                            })}
                            <div className="d-flex">
                                <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''>Other Charge	</p></div>
                                <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''>	</p></div>
                                <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''></p></div>
                                <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''></p></div>
                                <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''></p></div>
                                <div className='col-2 d-flex align-items-center justify-content-center p-1'><p className=''></p></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-3 d-flex">
                        <div className="col-4 p-1 border-end d-flex align-items-center justify-content-center"><p className="">{NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p></div>
                        <div className="col-4 border-end d-flex align-items-center justify-content-center">
                            <div className="d-grid h-100 w-100">
                                <div className="d-flex align-items-center justify-content-end p-1 border-bottom"><p className=''>{NumberWithCommas(e?.MetalAmount, 2)}</p> </div>
                                {e?.diamonds.map((ele, ind) => {
                                    return <div className="d-flex align-items-center justify-content-end p-1 border-bottom" key={ind}><p className=''>{NumberWithCommas(ele?.Amount, 2)}</p> </div>
                                })}
                                <div className="d-flex align-items-center justify-content-end p-1 border-bottom"><p className=''>{NumberWithCommas(e?.OtherCharges, 2)}</p> </div>
                            </div>
                        </div>
                        <div className="col-4 p-1 d-flex align-items-center justify-content-end"><p className="">{NumberWithCommas(e?.UnitCost, 2)}</p></div>
                    </div>
                </div>
            })}
            {/* table total */}
            <div className="border-start border-bottom border-end d-flex no_break">
                <div className="col-3 d-flex">
                    <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center"></div>
                    <div className="col-6 p-1 border-end d-flex align-items-center">
                        <p className='fw-bold fs-6'>TOTAL</p>
                    </div>
                    <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center"></div>
                </div>
                <div className='col-6 d-flex border-end'>
                    <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'></div>
                    <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'></div>
                    <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className="fw-bold">{NumberWithCommas(total.grosswt, 3)}</p></div>
                    <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className='fw-bold'>{NumberWithCommas(total?.materialWt, 3)} Ctw	</p></div>
                    <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end flex-column'>
                        <p className='fw-bold'>{NumberWithCommas(total?.NetWt, 3)} gm </p>
                    </div>
                    <div className='col-2 d-flex align-items-center justify-content-center p-1'><p className=''></p></div>
                </div>
                <div className="col-3 d-flex">
                    <div className="col-4 p-1 border-end d-flex align-items-center justify-content-center"></div>
                    <div className="col-4 border-end d-flex align-items-center justify-content-end p-1"> <p className='fw-bold'>{NumberWithCommas(total?.OtherCharges, 2)} </p> </div>
                    <div className="col-4 p-1 d-flex align-items-center justify-content-end"><p className="fw-bold">{NumberWithCommas(total?.UnitCost, 2)} </p></div>
                </div>
            </div>
            {/* tax */}
            <div className="border-start border-bottom border-end d-flex no_break">
                <div className="col-9 border-end">
                    <div className="d-grid w-100 h-100">
                        <div className="border-bottom p-1">
                            <p>Narration / Remark: <span className="fw-bold">{json0Data?.Remark}</span></p>
                        </div>
                        <div className="p-1">
                            <p>Old Gold Purchase Description : </p>
                        </div>
                    </div>
                </div>

                <div className="col-2 border-end">
                    <p className='p-1'>Discount</p>
                    <p className='p-1'>Total Amt. before Tax</p>
                    {tax.map((e, i) => {
                        return <p className='p-1' key={i}>{e?.name} @ {e?.per}</p>
                    })}
                    {json0Data?.AddLess !== 0 && <p className='p-1'>{json0Data?.AddLess > 0 ? "Add" : "Less"}</p>}
                    <p className='p-1'>Total Amt. after Tax</p>
                    <p className='p-1'>Old Gold</p>
                    <p className='p-1'>Advance</p>
                    <p className='p-1'>Recv.in Cash</p>
                    <p className='p-1'>Recv.in Bank</p>
                    <p className='p-1'>Net Bal. Amount</p>
                </div>
                <div className="col-1 ">
                    <p className='p-1 text-end'>{NumberWithCommas(total.discount, 0)}</p>
                    <p className='p-1 text-end'>{NumberWithCommas(total?.TotalAmount, 2)}</p>
                    {tax.map((e, i) => {
                        return <p className='p-1 text-end' key={i}>{e?.amount}</p>
                    })}
                    {json0Data?.AddLess !== 0 && <p className='p-1 text-end'>{json0Data?.AddLess}</p>}
                    <p className='p-1 text-end'>{NumberWithCommas(total?.afterTaxAmount, 2)}</p>
                    <p className='p-1 text-end'>{NumberWithCommas(json0Data?.OldGoldAmount, 2)}</p>
                    <p className='p-1 text-end'>{NumberWithCommas(json0Data?.AdvanceAmount, 2)}</p>
                    <p className='p-1 text-end'>{NumberWithCommas(json0Data?.CashReceived, 2)}</p>
                    <p className='p-1 text-end'>{NumberWithCommas(json0Data?.BankReceived, 2)}</p>
                    <p className='p-1 text-end'>{NumberWithCommas(total?.netBalanceAmount, 2)}</p>
                </div>
            </div>
            {/* grand total */}
            <div className="border-start border-bottom border-end d-flex no_break">
                <div className="col-9 p-1 border-end">
                    <p className=''>In Words Indian Rupees</p>
                    <p className=''>{toWords.convert(+fixedValues(total?.afterTaxAmount, 2))}</p>
                </div>
                <div className="col-2 border-end d-flex align-items-center p-1">
                    <p className="fw-bold">GRAND TOTAL	</p>
                </div>
                <div className="col-1 d-flex align-items-center justify-content-end p-1">
                    <p className="fw-bold"><span dangerouslySetInnerHTML={{__html: json0Data?.Currencysymbol}}></span> {NumberWithCommas(total?.afterTaxAmount, 2)}</p>
                </div>
            </div>
            {/* remark */}
            <div className="border-start border-bottom border-end d-flex pt-2 no_break">
                <div dangerouslySetInnerHTML={{ __html: json0Data?.Declaration }}></div>
            </div>
            {/* bank detail */}
            <div className="border-start border-bottom border-end d-flex no_break">
                <div className="col-4 p-2 border-end">
                    <p className='fw-bold'>Bank Detail</p>
                    <p>Bank Name:{json0Data?.bankname}</p>
                    <p>Branch: {json0Data?.bankaddress}</p>
                    <p>Account Name: {json0Data?.accountname}</p>
                    <p>Account No. : {json0Data?.accountnumber}</p>
                    <p>RTGS/NEFT IFSC: {json0Data?.rtgs_neft_ifsc}</p>
                </div>
                <div className="col-4 d-flex flex-column justify-content-between p-2 border-end">
                    <p>Signature</p>
                    <p className='fw-bold'>{json0Data?.customerfirmname}</p>
                </div>
                <div className="col-4 d-flex flex-column justify-content-between p-2">
                    <p>Signature</p>
                    <p className='fw-bold'>{json0Data?.CompanyFullName}</p>
                </div>
            </div>

        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
    </>
    )
}



export default EstimatePrint1;




// customerfirmname
// CompanyFullName