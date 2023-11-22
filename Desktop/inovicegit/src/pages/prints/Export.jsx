import React, { useEffect } from "react";
import style from "../../assets/css/prints/export.module.css";
import { NumberWithCommas, apiCall, fixedValues, handlePrint, isObjectEmpty } from "../../GlobalFunctions";
import { useState } from "react";
import Loader from "../../components/Loader";

const Export = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [json0Data, setJson0Data] = useState({});
    const [data, setData] = useState([]);
    const [msg, setMsg] = useState("");
    const [total, setTotal] = useState({
        qtyPcsPair: 0,
        grossWt: 0,
        netWt: 0,
        golSilValue: 0,
        diaPcs: 0,
        diaCts: 0,
        diaValue: 0,
        czCsPcs: 0,
        czCsCts: 0,
        czCsValue: 0,
        totalCts: 0,
        totalVal: 0,
        labourVal: 0,
        fobValue: 0,
        counts: 0
    });

    const loadData = (data) => {
        setJson0Data(data?.BillPrint_Json[0]);
        let arr = [];
        data?.BillPrint_Json1.forEach((e, i) => {
            let obj = { ...e };
            let counts = 1;
            let metal = [];
            let diamonds = [];
            let colorstones = [];
            data?.BillPrint_Json2.forEach((ele, ind) => {
                if (e?.SrJobno === ele?.StockBarcode) {
                    if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
                        diamonds.push(ele);
                    }
                    if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
                        colorstones.push(ele);
                    }
                    if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                        metal.push(ele);
                    }
                }
            });
            obj.metal = metal;
            obj.diamonds = diamonds;
            obj.colorstones = colorstones;
            obj.counts = counts;
            arr.push(obj);
        });
        let blankArr = [];
        arr.forEach((e, i) => {
            // let findIndex = blankArr.findIndex((ele, ind) => ele?.Collectionname === e?.Collectionname && ele?.Categoryname === e?.Categoryname);
            let findIndex = blankArr.findIndex((ele, ind) => ele?.Categoryname === e?.Categoryname && ele?.MetalPurity === e?.MetalPurity);
            if (findIndex === -1) {
                blankArr.push(e);
            } else {
                blankArr[findIndex].grosswt += e?.grosswt;
                blankArr[findIndex].NetWt += e?.NetWt;
                blankArr[findIndex].MetalAmount += e?.MetalAmount;
                blankArr[findIndex].MakingAmount += e?.MakingAmount;
                blankArr[findIndex].TotalAmount += e?.TotalAmount;
                blankArr[findIndex].metal = (blankArr[findIndex]?.metal).concat(e?.metal);
                blankArr[findIndex].diamonds = (blankArr[findIndex]?.diamonds).concat(e?.diamonds);
                blankArr[findIndex].colorstones = (blankArr[findIndex]?.colorstones).concat(e?.colorstones);
                blankArr[findIndex].counts += 1;
            }
        });
        let totals = { ...total };
        let resultArr = [];
        blankArr.forEach((e, i) => {
            let obj = { ...e };
            obj.totalCts = 0;
            obj.totalVal = 0;
            obj.metalWt = 0;
            obj.metalAmount = 0;
            totals.grossWt += e?.grosswt;
            totals.netWt += e?.NetWt;
            totals.labourVal += e?.MakingAmount;
            totals.fobValue += e?.TotalAmount;
            totals.counts += e?.counts;
            if (e?.diamonds.length > 0) {
                e?.diamonds.forEach((ele, ind) => {
                    obj.totalCts += ele.Wt;
                    obj.totalVal += ele?.Amount;
                    totals.diaPcs += ele?.Pcs;
                    totals.diaCts += ele?.Wt;
                    totals.diaValue += ele?.Amount;
                    totals.totalCts += ele.Wt;
                    totals.totalVal += ele.Amount;
                });
            }
            if (e?.colorstones.length > 0) {
                e?.colorstones.forEach((ele, ind) => {
                    obj.totalCts += ele.Wt;
                    obj.totalVal += ele?.Amount;
                    totals.czCsPcs += ele.Pcs;
                    totals.czCsCts += ele.Wt;
                    totals.czCsValue += ele.Amount;
                    totals.totalCts += ele.Wt;
                    totals.totalVal += ele.Amount;
                });
            }
            if (e?.metal.length > 0) {
                e?.metal.forEach((ele, ind) => {
                    obj.metalWt += ele.Wt;
                    obj.metalAmount += ele?.Amount;
                    totals.golSilValue += ele?.Amount;
                });
            }
            resultArr.push(obj);
        });
        resultArr.sort((a, b) => {
            const nameA = a.Categoryname.toLowerCase();
            const nameB = b.Categoryname.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
        setTotal(totals);
        setData(resultArr);
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
            {/* print button  */}
            <div className="pad_60_allPrint mt-2">
            <div className={`d-flex justify-content-end mb-4 align-items-center ${style?.print_sec_sum4} pt-4 ${style?.exportPrintContainer} `}>
                <div className="form-check ps-3 mt-2">
                    <input
                        type="button"
                        className="btn_white blue p-2"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            <div className={`${style?.exportPrintContainer}`}>
                <div className="">
                    {/* company details */}
                    <div className="d-flex border">
                        <div className="d-flex col-7">
                            <div className="col-2 p-2">
                                <p>CompanyName :  </p>
                                <p>Inv .# : </p>
                                <p>Dated : </p>
                                <p>Party :</p>
                            </div>
                            <div className="col-10 p-2">
                                <p> {json0Data?.customerfirmname} </p>
                                <p> {json0Data?.InvoiceNo} </p>
                                <p> {json0Data?.EntryDate} </p>
                                <p> {json0Data?.CustName}</p>
                            </div>
                        </div>
                    </div>
                    {/* table heading */}
                    <div className={`d-flex border-start border-end border-bottom`}>
                        <div className={`border-end ${style.srNoExport} ${style.rowExport}`}>Sr No</div>
                        <div className={`border-end ${style.itemExport} ${style.rowExport}`}>Item</div>
                        <div className={`border-end ${style.ktColExport} ${style.rowExport}`}>KT/Col</div>
                        <div className={`border-end ${style.qtyExport} ${style.rowExport}`}>Qty (PCS & PAIR)</div>
                        <div className={`border-end ${style.grossExport} ${style.rowExport}`}>Gross Wt</div>
                        <div className={`border-end ${style.netExport} ${style.rowExport}`}>Net Wt</div>
                        <div className={`border-end ${style.wastageExport} ${style.rowExport}`}>wastage</div>
                        <div className={`border-end ${style.totalGoldExport} ${style.rowExport}`}>Total Gold Wt.</div>
                        <div className={`border-end ${style.goldGmExport} ${style.rowExport}`}>Gold & sil Rate/gms $</div>
                        <div className={`border-end ${style.goldValueExport} ${style.rowExport}`}>Gold & sil Value $</div>

                        <div>
                            <div className="d-grid h-100">
                                <div className="d-flex">
                                    <div className={`border-end ${style.diaShapeExport} ${style.rowExport}`}>Dia shape</div>
                                    <div className={`border-end ${style.diamondColorExport} ${style.rowExport}`}>e	Diamond Color/Clarity</div>
                                    <div className={`border-end ${style.diaPcsExport} ${style.rowExport}`}>Dia Pcs</div>
                                    <div className={`border-end ${style.diaCtsExport} ${style.rowExport}`}>Dia Cts	</div>
                                    <div className={`border-end ${style.diaRateExport} ${style.rowExport}`}>Dia Rate</div>
                                    <div className={`border-end ${style.diaValueExport} ${style.rowExport}`}>Dia Value</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="d-grid h-100">
                                <div className="d-flex">
                                    <div className={`border-end ${style.c2csPcsExport}`}>cz/cs Pcs</div>
                                    <div className={`border-end ${style.c2csCtsExport}`}>cz/cs Cts</div>
                                    <div className={`border-end ${style.c2csRateExport}`}>cz/cs Rate</div>
                                    <div className={`border-end ${style.c2csValueExport}`}>cz/cs Value</div>
                                </div>
                            </div>
                        </div>

                        <div className={`border-end ${style.totalCtsExport} ${style.rowExport}`}>Total Cts</div>
                        <div className={`border-end ${style.totalValExport} ${style.rowExport}`}>Total Val $</div>
                        <div className={`border-end ${style.enamelWtExport} ${style.rowExport}`}>enamel wt. gms</div>
                        <div className={`border-end ${style.labourValueExport} ${style.rowExport}`}>VA/Labor Value</div>
                        <div className={`${style.totalFobExport} ${style.rowExport}`}>Total FOB Value $</div>
                    </div>
                    {/* data */}
                    {data && data.map((e, i) => {
                        return <div className={`d-flex border-start border-end border-bottom`} key={i}>
                            <div className={`border-end ${style.srNoExport} d-flex align-items-center justify-content-end ${style.rowExport}`}>{i + 1}</div>
                            <div className={`border-end ${style.itemExport} d-flex align-items-center ${style.rowExport}`}>{e?.Categoryname}</div>
                            <div className={`border-end ${style.ktColExport} d-flex align-items-center ${style.rowExport}`}>{e?.MetalPurity}</div>
                            <div className={`border-end ${style.qtyExport} d-flex align-items-center justify-content-end ${style.rowExport}`}>{NumberWithCommas(e?.counts, 0)}</div>
                            <div className={`border-end ${style.grossExport} d-flex align-items-center justify-content-end ${style.rowExport}`}>{fixedValues(e?.grosswt, 3)}</div>
                            <div className={`border-end ${style.netExport} d-flex align-items-center justify-content-end ${style.rowExport}`}>{fixedValues(e?.NetWt, 3)}</div>
                            <div className={`border-end ${style.wastageExport} d-flex align-items-center justify-content-end ${style.rowExport}`}></div>
                            <div className={`border-end ${style.totalGoldExport} d-flex align-items-center justify-content-end ${style.rowExport}`}>{fixedValues(e?.NetWt, 3)}</div>
                            <div className={`border-end ${style.goldGmExport} d-flex align-items-center justify-content-end ${style.rowExport}`}>{e?.NetWt !== 0 && (NumberWithCommas(e?.metalAmount / e?.NetWt, 2))}</div>
                            <div className={`border-end ${style.goldValueExport} d-flex align-items-center justify-content-end ${style.rowExport}`}>{NumberWithCommas(e?.metalAmount, 2)}</div>
                            <div>
                                <div className="d-grid h-100">
                                    {e?.diamonds.length > 0 ? e?.diamonds.map((ele, ind) => {
                                        return <div className={`d-flex ${ind !== e?.diamonds.length - 1 && `border-bottom`}`} key={ind}>
                                            <div className={`border-end ${style.diaShapeExport} d-flex align-items-center ${style.rowExport}`}>{ele?.ShapeName}</div>
                                            <div className={`border-end ${style.diamondColorExport} d-flex align-items-center ${style.rowExport}`}>{ele?.ShapeName}/{ele?.QualityName}-{ele?.Colorname}</div>
                                            <div className={`border-end ${style.diaPcsExport} d-flex align-items-center justify-content-end ${style.rowExport}`}>{ele?.Pcs}</div>
                                            <div className={`border-end ${style.diaCtsExport} d-flex align-items-center justify-content-end ${style.rowExport}`}>{(ele?.Wt)?.toFixed(2)}</div>
                                            <div className={`border-end ${style.diaRateExport} d-flex align-items-center justify-content-end ${style.rowExport}`}>{(ele?.Rate)?.toFixed(2)}</div>
                                            <div className={`border-end ${style.diaValueExport} d-flex align-items-center justify-content-end ${style.rowExport}`}>{(ele?.Amount)?.toFixed(2)}</div>
                                        </div>
                                    }) : <div className={`d-flex`}>
                                        <div className={`border-end ${style.diaShapeExport} d-flex align-items-center ${style.rowExport}`}></div>
                                        <div className={`border-end ${style.diamondColorExport} d-flex align-items-center ${style.rowExport}`}></div>
                                        <div className={`border-end ${style.diaPcsExport} d-flex align-items-center justify-content-end ${style.rowExport}`}></div>
                                        <div className={`border-end ${style.diaCtsExport} d-flex align-items-center justify-content-end ${style.rowExport}`}></div>
                                        <div className={`border-end ${style.diaRateExport} d-flex align-items-center justify-content-end ${style.rowExport}`}></div>
                                        <div className={`border-end ${style.diaValueExport} d-flex align-items-center justify-content-end ${style.rowExport}`}></div>
                                    </div>}
                                </div>
                            </div>
                            <div>
                                <div className="d-grid h-100">
                                    {e?.colorstones.length > 0 ? e?.colorstones.map((ele, ind) => {
                                        return <div className={`d-flex ${ind !== e?.colorstones.length - 1 && `border-bottom`}`} key={ind}>
                                            <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csPcsExport} ${style.rowExport}`}>{ele?.Pcs}</div>
                                            <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csCtsExport} ${style.rowExport}`}>{(ele?.Wt)?.toFixed(3)}</div>
                                            <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csRateExport} ${style.rowExport}`}>{(ele?.Rate)?.toFixed(2)}</div>
                                            <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csValueExport} ${style.rowExport}`}>{(ele?.Amount)?.toFixed(2)}</div>
                                        </div>
                                    }) : <div className={`d-flex`}>
                                        <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csPcsExport} ${style.rowExport}`}></div>
                                        <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csCtsExport} ${style.rowExport}`}></div>
                                        <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csRateExport} ${style.rowExport}`}></div>
                                        <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csValueExport} ${style.rowExport}`}></div>
                                    </div>}
                                </div>
                            </div>
                            <div className={`d-flex align-items-center justify-content-end border-end ${style.totalCtsExport} ${style.rowExport}`}>{(e?.totalCts)?.toFixed(3)}</div>
                            <div className={`d-flex align-items-center justify-content-end border-end ${style.totalValExport} ${style.rowExport}`}>{(e?.totalVal)?.toFixed(2)}</div>
                            <div className={`d-flex align-items-center justify-content-end border-end ${style.enamelWtExport} ${style.rowExport}`}></div>
                            <div className={`d-flex align-items-center justify-content-end border-end ${style.labourValueExport} ${style.rowExport}`}>{e?.MakingAmount !== 0 && (e?.MakingAmount).toFixed(2)}</div>
                            <div className={`d-flex align-items-center justify-content-end ${style.totalFobExport} ${style.rowExport}`}>{(e?.TotalAmount).toFixed(2)}</div>
                        </div>
                    })}
                    {/* total */}
                    <div className={`d-flex border-start border-end border-bottom`}>
                        <div className={`border-end ${style.srNoExport} d-flex align-items-center justify-content-end ${style.rowExport}`}></div>
                        <div className={`border-end ${style.itemExport} d-flex align-items-center ${style.rowExport}`}></div>
                        <div className={`border-end ${style.ktColExport} d-flex align-items-center ${style.rowExport}`}></div>
                        <div className={`border-end ${style.qtyExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold`}>{total?.counts}</div>
                        <div className={`border-end ${style.grossExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold`}>{(total?.grossWt)?.toFixed(3)}</div>
                        <div className={`border-end ${style.netExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold`}>{(total?.netWt)?.toFixed(3)}</div>
                        <div className={`border-end ${style.wastageExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold`}></div>
                        <div className={`border-end ${style.totalGoldExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold`}></div>
                        <div className={`border-end ${style.goldGmExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold`}></div>
                        <div className={`border-end ${style.goldValueExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold`}>{(total?.golSilValue)?.toFixed(2)}</div>
                        <div className={`d-flex`}>
                            <div className={`border-end ${style.diaShapeExport} d-flex align-items-center ${style.rowExport} fw-bold`}></div>
                            <div className={`border-end ${style.diamondColorExport} d-flex align-items-center ${style.rowExport} fw-bold`}></div>
                            <div className={`border-end ${style.diaPcsExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold`}>{total?.diaPcs}</div>
                            <div className={`border-end ${style.diaCtsExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold`}>{(total?.diaCts)?.toFixed(3)}</div>
                            <div className={`border-end ${style.diaRateExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold`}></div>
                            <div className={`border-end ${style.diaValueExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold`}>{(total?.diaValue)?.toFixed(2)}</div>
                        </div>
                        <div className={`d-flex`}>
                            <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csPcsExport} ${style.rowExport} fw-bold`}>{(total?.czCsPcs)}</div>
                            <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csCtsExport} ${style.rowExport} fw-bold`}>{(total?.czCsCts).toFixed(3)}</div>
                            <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csRateExport} ${style.rowExport} fw-bold`}></div>
                            <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csValueExport} ${style.rowExport} fw-bold`}>{(total?.czCsValue).toFixed(2)}</div>
                        </div>
                        <div className={`d-flex align-items-center justify-content-end border-end ${style.totalCtsExport} ${style.rowExport} fw-bold`}>{(total?.totalCts)?.toFixed(3)}</div>
                        <div className={`d-flex align-items-center justify-content-end border-end ${style.totalValExport} ${style.rowExport} fw-bold`}>{(total?.totalVal)?.toFixed(3)}</div>
                        <div className={`d-flex align-items-center justify-content-end border-end ${style.enamelWtExport} ${style.rowExport} fw-bold`}></div>
                        <div className={`d-flex align-items-center justify-content-end border-end ${style.labourValueExport} ${style.rowExport} fw-bold`}>{(total?.labourVal)?.toFixed(2)}</div>
                        <div className={`d-flex align-items-center justify-content-end ${style.totalFobExport} ${style.rowExport} fw-bold`}>{(total?.fobValue)?.toFixed(2)}</div>
                    </div>
                </div>
            </div>
            </div>
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    );
};

export default Export;
