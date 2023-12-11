import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/manufacturemgt.module.css";
import Loader from '../../components/Loader';
import { FooterComponent, HeaderComponent, NumberWithCommas, apiCall, handleImageError, handlePrint, isObjectEmpty, taxGenrator } from '../../GlobalFunctions';

const ManufactureMgt = ({ token, invoiceNo, printName, urls, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [headerComp, setHeaderComp] = useState(null);
    const [headerData, setHeaderData] = useState({});
    const [data, setData] = useState([]);
    const [total, SetTotal] = useState({
        totalAmount: 0,
        grandTotal: 0
    });
    const [tax, setTax] = useState([]);

    const loadData = (data) => {
        setHeaderData(data?.BillPrint_Json[0]);
        let headerDatas = data?.BillPrint_Json[0];
        let head = HeaderComponent(2, headerDatas);
        setHeaderComp(head);

        let resultArr = [];
        let totals = { ...total };
        data?.BillPrint_Json1.forEach((e, i) => {
            totals.totalAmount += e?.TotalAmount;
            let obj = { ...e };
            let metalColorCode = "";
            let diamonds = [];

            let diamondWt = 0;
            let colorWt = 0;
            let miscWt = 0;

            let diamondRepairedWt = 0;
            let colorRepairedWt = 0;
            let miscRepairedWt = 0;

            let metalWt = 0;

            let miscRepairWt = 0;
            let receivedJewelleryGrossWt = 0;

            let repairedJewelleryGrossWt = 0;
            let repairedJewelleryNetWt = 0;

            let materialIsAdded = 0;

            let metalAdded = 0;
            let diamondAdded = 0;
            let colorStoneAdded = 0;
            let miscAdded = 0;
            let findingAdded = 0;

            let grossWtAdded = 0;
            let netWtdded = 0;
            let materialAdded = [];

            let netDetach = 0;
            let diamondDetach = 0;
            let colorStoneDetach = 0;
            let metalDetach = 0;
            let FindingDetach = 0;

            data?.BillPrint_Json2.forEach((ele, ind) => {
                if (ele?.StockBarcode === e?.SrJobno) {
                    if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                        metalWt += ele?.Wt;
                        if (ele?.IsPrimaryMetal === 1) {
                            metalColorCode = ele?.MetalColorCode;
                        } else if (metalColorCode === "") {
                            metalColorCode = ele?.MetalColorCode;
                        }
                        // if (ele?.IsRepireEdit === 1) {
                        //     metalAdded += ele?.Wt;
                        // }
                          
                        if (ele?.DetachWeight !== null) {
                            metalDetach += ele?.DetachWeight;
                        }
                        repairedJewelleryNetWt += (ele?.Wt + ele?.WtAdd - ele?.DetachWeight);
                        metalAdded += ele?.WtAdd;

                    } else if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
                        diamondWt += ele?.Wt;
                        diamonds.push(ele);
                        if (ele?.IsRepireEdit === 1) {
                            diamondAdded += ele?.Wt;
                            materialAdded.push(ele);
                        }
                        if (ele?.DetachWeight !== null) {
                            diamondDetach += ele?.DetachWeight;
                            diamondRepairedWt += (ele?.Wt - ele?.DetachWeight);
                        } else {
                            diamondRepairedWt += ele?.Wt;
                        }
                    } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
                        colorWt += ele?.Wt;
                        if (ele?.IsRepireEdit === 1) {
                            colorStoneAdded += ele?.Wt;
                            materialAdded.push(ele);

                        }
                        if (ele?.DetachWeight !== null) {
                            colorStoneDetach += ele?.DetachWeight;
                            colorRepairedWt += (ele?.Wt - ele?.DetachWeight);
                        } else {
                            colorRepairedWt += ele?.Wt;
                        }
                    } else if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
                        miscWt += ele?.Wt;
                        if (ele?.IsRepireEdit === 0) {
                            miscRepairWt += ele?.Wt;
                        }
                        if (ele?.IsRepireEdit === 1) {
                            materialAdded.push(ele);
                            miscAdded += ele?.Wt;
                        }
                        if (ele?.IsReapirDelete !== 1) {
                            miscRepairedWt += ele?.Wt;
                        }
                    } else if (ele?.MasterManagement_DiamondStoneTypeid === 5) {
                        if (ele?.IsRepireEdit === 1) {
                            materialAdded.push(ele);
                            findingAdded += ele?.Wt;
                            repairedJewelleryNetWt += ele?.Wt;
                        }
                        if (ele?.DetachWeight !== null) {
                            FindingDetach += ele?.DetachWeight;
                            repairedJewelleryNetWt -= ele?.DetachWeight;
                        }
                    }
                    // if (ele?.MasterManagement_DiamondStoneTypeid === 1 || ele?.MasterManagement_DiamondStoneTypeid === 2) {
                    //     repairedJewelleryGrossWt += (ele?.Wt - ele?.DetachWeight) / 5;
                    // } else {
                    //     repairedJewelleryGrossWt += (ele?.Wt - ele?.DetachWeight);
                    // }
                }
            });

            repairedJewelleryGrossWt = (diamondRepairedWt / 5) + (colorRepairedWt / 5) + miscRepairedWt + repairedJewelleryNetWt;
            // repairedJewelleryNetWt
            // diamondRepairedWt
            // colorRepairedWt
            // miscRepairedWt

            grossWtAdded = metalAdded + ((diamondAdded + colorStoneAdded) / 5) + miscAdded + findingAdded;
            netWtdded = metalAdded + findingAdded;
            let diamondColorWt = (diamondWt + colorWt) / 5;
            netDetach = metalDetach + FindingDetach;
            obj.metalColorCode = metalColorCode;
            obj.diamonds = diamonds;
            obj.diamondWt = diamondWt;
            obj.colorWt = colorWt;
            obj.miscWt = miscWt;
            obj.diamondColorWt = diamondColorWt;
            obj.miscRepairWt = miscRepairWt;
            obj.grossWtAdded = grossWtAdded;
            obj.netWtdded = netWtdded;
            obj.diamondAdded = diamondAdded;
            obj.colorStoneAdded = colorStoneAdded;
            obj.miscAdded = miscAdded;
            obj.materialAdded = materialAdded;
            obj.netDetach = netDetach;
            obj.diamondDetach = diamondDetach;
            obj.colorStoneDetach = colorStoneDetach;

            obj.diamondRepairedWt = diamondRepairedWt;
            obj.colorRepairedWt = colorRepairedWt;
            obj.miscRepairedWt = miscRepairedWt;

            obj.receivedJewelleryGrossWt = miscRepairWt + diamondColorWt + metalWt;
            obj.repairedJewelleryGrossWt = repairedJewelleryGrossWt;
            obj.repairedJewelleryNetWt = repairedJewelleryNetWt;
            resultArr.push(obj);
        });
        SetTotal(totals);
        let taxValue = taxGenrator(data?.BillPrint_Json[0], totals?.totalAmount);
        totals.grandTotal = taxValue.reduce((a, b) => {
            return a + +b.amount;
        }, 0) + totals?.totalAmount + data?.BillPrint_Json[0]?.AddLess;
        setData(resultArr);
        setTax(taxValue);
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
        loader ? <Loader /> : msg === "" ?
            <div className={`container-fluid max_width_container pt-2 ${style?.manufacture_container} pad_60_allPrint`}>
                {/* buttons */}
                <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}>
                    <div className="form-check ps-3">
                        <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* company address */}
                {headerComp}
                {/* customer address */}
                <div className="p-2 border-top d-flex">
                    <div className="col-6">
                        <p>To,</p>
                        <p className='fs-6 fw-bold'>{headerData?.customerfirmname}</p>
                        <p>{headerData?.customerstreet}</p>
                        <p>{headerData?.customerregion}</p>
                        <p>{headerData?.customercity}-{headerData?.customerpincode}</p>
                        <p>Tel: {headerData?.customermobileno}</p>
                        <p>{headerData?.customeremail1}</p>
                    </div>
                    <div className="col-6 d-flex justify-content-end">
                        <div className="col-9 d-flex flex-column justify-content-center">
                            <p>Invoice#: <span className="fw-bold">{headerData?.InvoiceNo}</span> Dated <span className="fw-bold">{headerData?.EntryDate}</span></p>
                            <p>GSTIN: <span className="fw-bold">{headerData?.Cust_VAT_GST_No}</span> | STATE CODE <span className="fw-bold">{headerData?.Cust_CST_STATE_No}</span></p>
                            <p>Due Date: <span className="fw-bold">{headerData?.DueDate}</span></p>
                        </div>
                    </div>
                </div>
                <div className="pt-2">
                    {/* Table Header */}
                    <div className="d-flex border lightGrey">
                        <div className="col-1 border-end">
                            <p className="fw-bold p-1 text-center">SR NO</p>
                        </div>
                        <div className="col-2 border-end">
                            <p className="fw-bold p-1 text-center">ITEM CODE</p>
                        </div>
                        <div className="col-7 border-end">
                            <p className="fw-bold p-1 text-center">DESCRIPTION</p>
                        </div>
                        <div className="col-2">
                            <p className="fw-bold p-1 text-center">AMOUNT({headerData?.CurrencyCode})</p>
                        </div>
                    </div>
                    {/* Table Data */}
                    {data.map((e, i) => {
                        return <div className="d-flex border-start border-bottom border-end" key={i}>
                            <div className="col-1 border-end">
                                <p className="fw-bold p-1">{i + 1}</p>
                            </div>
                            <div className="col-2 border-end">
                                <p className="p-1"> Job: {e?.SrJobno} </p>
                                <p className="p-1"> Design: {e?.designno} </p>
                                <img src={e?.DesignImage} alt="" className={`${style?.img_manufacture} p-1`} onError={handleImageError} />
                            </div>
                            <div className="col-7 border-end">
                                <p className="fw-bold p-1 text_secondary no_break">RECEIVED JEWELLERY</p>
                                <p className="px-1 py-2 no_break">{e?.MetalTypePurity} {e?.metalColorCode} |
                                    {NumberWithCommas(e?.receivedJewelleryGrossWt, 3)} gms GW |
                                    {NumberWithCommas(e?.NetWt, 3)} gms NW |
                                    DIA: {NumberWithCommas(e?.diamondWt, 3)} Cts |
                                    CS: {NumberWithCommas(e?.colorWt, 3)}Cts |
                                    MISC: {NumberWithCommas(e?.miscRepairWt, 3)} gms </p>

                                <p className="fw-bold p-1 text_secondary no_break">REPAIRED JEWELLERY</p>
                                <p className="px-1 py-2 no_break">{e?.MetalTypePurity} {e?.metalColorCode} |
                                    {NumberWithCommas(e?.repairedJewelleryGrossWt, 3)} gms GW |
                                    {NumberWithCommas(e?.repairedJewelleryNetWt, 3)} gms NW |
                                    DIA: {NumberWithCommas(e?.diamondRepairedWt, 3)} Cts |
                                    CS: {NumberWithCommas(e?.colorRepairedWt, 3)}Cts |
                                    MISC: {NumberWithCommas(e?.miscRepairedWt, 3)} gms </p>

                                <p className="fw-bold p-1 text_secondary no_break">ADDED MATERIAL DETAIL</p>
                                <p className="px-1 py-2 no_break">{e?.MetalTypePurity} {e?.metalColorCode} |
                                    {NumberWithCommas(e?.grossWtAdded, 3)} gms GW |
                                    {NumberWithCommas(e?.netWtdded, 3)} gms NW |
                                    DIA: {NumberWithCommas(e?.diamondAdded, 3)} Cts |
                                    CS: {NumberWithCommas(e?.colorStoneAdded, 3)}Cts |
                                    MISC: {NumberWithCommas(e?.miscAdded, 3)} gms </p>

                                {e?.materialAdded.map((ele, ind) => {
                                    return <p key={ind} className='p-1 no_break'>{ele?.MasterManagement_DiamondStoneTypeName}: {NumberWithCommas(ele?.Pcs, 0)} PCs | {NumberWithCommas(ele?.Wt, 3)}
                                        {ele?.MasterManagement_DiamondStoneTypeid === 1 || ele?.MasterManagement_DiamondStoneTypeid === 2 ? " Cts" : " gms"} | {ele?.ShapeName} {ele?.QualityName} {ele?.Colorname}</p>
                                })}

                                <p className="fw-bold p-1 text_secondary no_break">DETACHED MATERIAL</p>
                                <p className="px-1 py-2 no_break">
                                    Net: {NumberWithCommas(e?.netDetach, 3)} gms NW |
                                    DIA: {NumberWithCommas(e?.diamondDetach, 3)} Cts |
                                    CS: {NumberWithCommas(e?.colorStoneDetach, 3)}Cts
                                </p>
                            </div>
                            <div className="col-2">
                                <p className="p-1 text-end"><span dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}></span> {NumberWithCommas(e?.TotalAmount, 2)}</p>
                            </div>
                        </div>
                    })}
                    {/* Table Total */}
                    <div className="d-flex border-start border-end border-bottom lightGrey">
                        <div className="col-1"></div>
                        <div className="col-9 border-end p-1"><p className="fw-bold">TOTAL</p></div>
                        <div className="col-2 p-1">
                            <p className="fw-bold text-end"><span dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}></span> {NumberWithCommas(total?.totalAmount, 2)}</p>
                        </div>
                    </div>
                    {/* Table Tax */}
                    <div className="d-flex border-start border-end border-bottom">
                        <div className="col-10 border-end">
                            {tax.map((ele, ind) => {
                                return <p className='text-end p-1' key={ind}>{ele?.name} @ {ele?.per}</p>
                            })}
                            {headerData?.AddLess !== 0 && <p className='text-end p-1'> {headerData?.AddLess > 0 ? "Add" : "Less"}</p>}
                        </div>
                        <div className="col-2">
                            {tax.map((ele, ind) => {
                                return <p className='text-end p-1 ' key={ind}>{ele?.amount}</p>
                            })}
                            {headerData?.AddLess !== 0 && <p className='text-end p-1'> {headerData?.AddLess}</p>}
                        </div>
                    </div>
                    {/* Table Grand Total */}
                    <div className="d-flex border-start border-end border-bottom lightGrey">
                        <div className="col-10 border-end">
                            <p className="text-end p-1 fw-bold">GRAND TOTAL</p>
                        </div>
                        <div className="col-2">
                            <p className="text-end p-1 fw-bold"><span dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}></span> {NumberWithCommas(total?.grandTotal, 2)}</p>
                        </div>
                    </div>
                    {/* signature */}
                    <div className={`d-flex border-start border-bottom border-end ${style?.height_manufacture} no_break`}>
                        <div className="col-6 p-2 d-flex justify-content-between flex-column border-end position-relative">
                            <p>Signature :</p>
                            <p className="fw-bold">{headerData?.customerfirmname}</p>
                            {/* <p className={`position-absolute ${style?.blankArea} bgGrey border-start border-bottom`}></p> */}
                        </div>
                        <div className="col-6 p-2 d-flex justify-content-between flex-column position-relative">
                            <p>Signature :</p>
                            <p className="fw-bold">{headerData?.CompanyFullName}</p>
                            {/* <p className={`position-absolute ${style?.blankArea} bgGrey border-start border-end border-bottom`}></p> */}
                        </div>
                    </div>
                </div>
            </div> :
            <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default ManufactureMgt



