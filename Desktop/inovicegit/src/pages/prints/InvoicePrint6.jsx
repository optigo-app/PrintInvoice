import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/invoicePrint6.module.css";
import {
    FooterComponent,
    HeaderComponent,
    apiCall,
    fixedValues,
    handleImageError,
    isObjectEmpty,
    numberToWord,
    NumberWithCommas,
    taxGenrator,
    handlePrint
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import { ToWords } from "to-words";
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import style2 from "../../assets/css/headers/header1.module.css";
import { split } from 'lodash';

const InvoicePrint6 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const [header, setHeader] = useState(null);
    const [headerData, setHeaderData] = useState({});
    const [address, setAddress] = useState([]);
    const [footer, setFooter] = useState(null);
    const [extra, setExtra] = useState({
        json1: [],
        json2: [],
    });
    const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
    const toWords = new ToWords();
    const loadData = (data) => {
        let head = HeaderComponent("1", data?.BillPrint_Json[0]);
        setHeader(head);
        setHeaderData(data?.BillPrint_Json[0]);
        let adr = data?.BillPrint_Json[0]?.Printlable.split(`\r\n`);
        setAddress(adr);
        setFooter(FooterComponent("2", data?.BillPrint_Json[0]));
        let datas = OrganizeDataPrint(
            data?.BillPrint_Json[0],
            data?.BillPrint_Json1,
            data?.BillPrint_Json2
        );
        let resultArr = [];
        console.log(datas);
        let extraChargesJson1 = [];
        let extraChargesJson2 = [];
        datas.resultArray.forEach((e, i) => {
            let otherChares = e?.OtherAmtDetail?.split("#@#");
            let otherChares1 = [];
            if (otherChares?.length !== 1 && otherChares[0] !== "") {
                otherChares?.forEach((ele, ind) => {
                    otherChares1?.push(ele?.split("#-#"));
                })
            };

            otherChares1?.forEach((ele, ind) => {
                // console.log(extraChargesJson1);
                let findRecord = extraChargesJson1?.findIndex((elem, index) => elem?.label === ele[0]);
                if (findRecord === -1) {
                    extraChargesJson1?.push({ label: ele[0], value: ele[1] });
                } else {
                    extraChargesJson1[findRecord].value = +extraChargesJson1[findRecord].value + +ele[1];
                }
            });

            e?.misc?.forEach((ele, ind) => {
                if (ele?.IsHSCOE !== 0) {
                    let findRecord = extraChargesJson2?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName);
                    if (findRecord === -1) {
                        extraChargesJson2?.push(ele);
                    } else {
                        extraChargesJson2[findRecord].Pcs += ele?.Pcs;
                        extraChargesJson2[findRecord].Wt += ele?.Wt;
                        extraChargesJson2[findRecord].Amount += ele?.Amount;
                    }
                }
            });

            let findPMetal = e?.metal.findIndex((ele, ind) => ele?.IsPrimaryMetal === 1);
            let findRec = resultArr.findIndex((el, inde) => {
                if (e?.MetalTypePurity === el?.MetalTypePurity) {
                    let findprimaryMetal = el?.metal.findIndex((ele, ind) => ele?.IsPrimaryMetal === 1);
                    if (findprimaryMetal !== -1) {
                        if (e?.metal[findPMetal].Rate === el.metal[findprimaryMetal].Rate) {
                            return el
                        }
                    }
                }
            });
            if (findRec === -1) {
                let obj = { ...e };
                obj.metalrate = obj.metal[findPMetal].Rate;
                resultArr.push(obj);
            } else {
                resultArr[findRec].TotalAmount += e?.TotalAmount;
                resultArr[findRec].NetWt += e?.NetWt;
                resultArr[findRec].PureNetWt += e?.PureNetWt;
                resultArr[findRec].LossWt += e?.LossWt;
                resultArr[findRec].MaKingCharge_Unit += e?.MaKingCharge_Unit;
                resultArr[findRec].MakingAmount += e?.MakingAmount;
                resultArr[findRec].Making_Amount_Other_Charges += e?.Making_Amount_Other_Charges;
                resultArr[findRec].MetalAmount += e?.MetalAmount;
                resultArr[findRec].MetalDiaWt += e?.MetalDiaWt;
                resultArr[findRec].MetalPriceRatio += e?.MetalPriceRatio;
                resultArr[findRec].OtherCharges += e?.OtherCharges;
                resultArr[findRec].PureNetWt += e?.PureNetWt;
                resultArr[findRec].Tunch += e?.Tunch;
                resultArr[findRec].UnitCost += e?.UnitCost;
                resultArr[findRec].UnitCost += e?.UnitCost;

                let other_amt = [e?.other_details, resultArr[findRec]?.other_details]?.flat();
                let otheramts = [];
                // console.log(e);
                other_amt?.forEach((elee, indd) => {
                    let findOther = otheramts.findIndex((element, index) => element?.label === elee?.label);
                    if (findOther === -1) {
                        otheramts.push(elee);
                    } else {
                        // console.log(otheramts[findOther]);
                        otheramts[findOther].value = (+otheramts[findOther]?.value) + (+elee?.value);
                    }
                });
                resultArr[findRec].other_details += otheramts;
                resultArr[findRec].totals.Making_Amount_Other_Charges += e?.totals?.Making_Amount_Other_Charges;

                resultArr[findRec].totals.colorstone.Amount += e?.totals.colorstone.Amount;
                resultArr[findRec].totals.colorstone.FineWt += e?.totals.colorstone.FineWt;
                resultArr[findRec].totals.colorstone.Pcs += e?.totals.colorstone.Pcs;
                resultArr[findRec].totals.colorstone.Rate += e?.totals.colorstone.Rate;
                resultArr[findRec].totals.colorstone.SettingAmount += e?.totals.colorstone.SettingAmount;
                resultArr[findRec].totals.colorstone.Wt += e?.totals.colorstone.Wt;
                resultArr[findRec].totals.colorstone.length += e?.totals.colorstone.length;

                resultArr[findRec].totals.diamonds.Amount += e?.totals.diamonds.Amount;
                resultArr[findRec].totals.diamonds.FineWt += e?.totals.diamonds.FineWt;
                resultArr[findRec].totals.diamonds.Pcs += e?.totals.diamonds.Pcs;
                resultArr[findRec].totals.diamonds.Rate += e?.totals.diamonds.Rate;
                resultArr[findRec].totals.diamonds.SettingAmount += e?.totals.diamonds.SettingAmount;
                resultArr[findRec].totals.diamonds.Wt += e?.totals.diamonds.Wt;
                resultArr[findRec].totals.diamonds.length += e?.totals.diamonds.length;

                resultArr[findRec].totals.finding.Amount += e?.totals.finding.Amount;
                resultArr[findRec].totals.finding.FineWt += e?.totals.finding.FineWt;
                resultArr[findRec].totals.finding.Pcs += e?.totals.finding.Pcs;
                resultArr[findRec].totals.finding.Rate += e?.totals.finding.Rate;
                resultArr[findRec].totals.finding.SettingAmount += e?.totals.finding.SettingAmount;
                resultArr[findRec].totals.finding.Wt += e?.totals.finding.Wt;
                resultArr[findRec].totals.finding.length += e?.totals.finding.length;

                resultArr[findRec].totals.metal.Amount += e?.totals.metal.Amount;
                resultArr[findRec].totals.metal.FineWt += e?.totals.metal.FineWt;
                resultArr[findRec].totals.metal.Pcs += e?.totals.metal.Pcs;
                resultArr[findRec].totals.metal.Rate += e?.totals.metal.Rate;
                resultArr[findRec].totals.metal.SettingAmount += e?.totals.metal.SettingAmount;
                resultArr[findRec].totals.metal.Wt += e?.totals.metal.Wt;
                resultArr[findRec].totals.metal.length += e?.totals.metal.length;

                resultArr[findRec].totals.misc.Amount += e?.totals.misc.Amount;
                resultArr[findRec].totals.misc.FineWt += e?.totals.misc.FineWt;
                resultArr[findRec].totals.misc.Pcs += e?.totals.misc.Pcs;
                resultArr[findRec].totals.misc.Rate += e?.totals.misc.Rate;
                resultArr[findRec].totals.misc.SettingAmount += e?.totals.misc.SettingAmount;
                resultArr[findRec].totals.misc.Wt += e?.totals.misc.Wt;
                resultArr[findRec].totals.misc.length += e?.totals.misc.length;

                resultArr[findRec].totals.stone_misc.Amount += e?.totals.stone_misc.Amount;
                resultArr[findRec].totals.stone_misc.FineWt += e?.totals.stone_misc.FineWt;
                resultArr[findRec].totals.stone_misc.Pcs += e?.totals.stone_misc.Pcs;
                resultArr[findRec].totals.stone_misc.Rate += e?.totals.stone_misc.Rate;
                resultArr[findRec].totals.stone_misc.SettingAmount += e?.totals.stone_misc.SettingAmount;
                resultArr[findRec].totals.stone_misc.Wt += e?.totals.stone_misc.Wt;
                resultArr[findRec].totals.stone_misc.length += e?.totals.stone_misc.length;
            }
        });
        setExtra({ ...extra, json1: extraChargesJson1, json2: extraChargesJson2 });
        datas.resultArray = resultArr;
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
        <div
            className={`container container-fluid max_width_container mt-1 ${style?.invoicePrint6} pad_60_allPrint`}
        >
            {/* buttons */}
            <div
                className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}
            >
                <div className="form-check ps-3">
                    <input
                        type="button"
                        className="btn_white blue py-1 mt-2"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            {/* header */}
            <div className={`${style2.headline} headerTitle`}>{headerData?.PrintHeadLabel}</div>
            <div className={`d-flex justify-content-between align-items-center border-bottom mb-3 py-3`}>
                <div className={`${style2.companyhead} p-2`} style={{}}>
                    <div className={style2.lines} style={{ fontWeight: "bold", fontSize: "16px" }}>
                        {headerData?.CompanyFullName}
                    </div>
                    <div className={style2.lines} style={{ fontSize: "12px" }}>{headerData?.CompanyAddress}</div>
                    <div className={style2.lines} style={{ fontSize: "12px" }}>{headerData?.CompanyCity}-{headerData?.CompanyPinCode},{headerData?.CompanyState}({headerData?.CompanyCountry})</div>
                    <div className={style2.lines} style={{ fontSize: "12px" }}>T  {headerData?.CompanyTellNo} | TOLL FREE {headerData?.CompanyTollFreeNo}</div>
                    <div className={style2.lines} style={{ fontSize: "12px" }}>
                        {headerData?.CompanyEmail} | {headerData?.CompanyWebsite}
                    </div>
                </div>
                <div style={{ width: "30%" }} className="d-flex justify-content-end align-item-center h-100">
                {isImageWorking && (headerData?.PrintLogo !== "" && 
                      <img src={headerData?.PrintLogo} alt="" 
                      className='w-25 h-auto ms-auto d-block object-fit-contain'
                      onError={handleImageErrors} height={120} width={150} />)}
                        {/* <img src={headerData?.PrintLogo} alt="" className={style2.headerImg} /> */}
                    </div>
            </div>
            {/* bill no */}
            <div className="d-flex justify-content-end py-1">
                <div className="col-3 border border-black border-2">
                    <p style={{ fontSize: "12px", display: "flex" }}>
                        <p className="fw-semibold px-2" style={{ minWidth: "60px" }}>BILL NO </p>{" "}
                        <p>{headerData?.InvoiceNo}</p>
                    </p>
                    <p style={{ fontSize: "12px", display: "flex" }}>
                        <p className="fw-semibold px-2" style={{ minWidth: "60px" }}>DATE </p>{" "}
                        <p>{headerData?.EntryDate}</p>
                    </p>
                    <p style={{ fontSize: "12px", display: "flex" }}>
                        <p className="fw-semibold px-2" style={{ minWidth: "60px" }}>HSN </p>
                        <p>{headerData?.HSN_No}</p>
                    </p>
                </div>
            </div>
            {/* sub header */}
            <div className="d-flex border border-black mb-1 align-items-center border-2">
                <div className="col-8 p-2">
                    <p className="fw-semibold" style={{fontSize: "14px"}}>To, {headerData?.customerfirmname}</p>
                    <p className='fw-light ps-3' style={{ fontSize: "12px", lineHeight: "140% ", }}>{headerData?.customerstreet}</p>
                    <p className='fw-light ps-3' style={{ fontSize: "12px", lineHeight: "140% ", }}>{headerData?.customerregion}</p>
                    <p className='fw-light ps-3' style={{ fontSize: "12px", lineHeight: "140% ", }}>
                        {headerData?.customercity}
                        {headerData?.customerpincode}
                    </p>
                    <p className='fw-light  ps-3' style={{ fontSize: "12px", lineHeight: "140% ", }}>STATE NAME : {headerData?.customerstate}</p>
                    {/* <p className='fw-light lh-1 ps-3' style={{ fontSize: "12px", lineHeight: "140% ", }}>{headerData?.vat_cst_pan}</p> */}
                </div>
                <div className="col-4 p-2">
                    <p style={{ fontSize: "12px", display: "flex", }}>
                        <span className="fw-semibold pe-2" style={{ minWidth: "80px" }}>GSTIN : </span>{" "}
                        <span style={{ minWidth: "80px" }}>{headerData?.CustGstNo}</span>
                    </p>
                    <p style={{ fontSize: "12px", display: "flex", }}>
                        <span className="fw-semibold pe-2" style={{ minWidth: "80px" }}>STATE CODE : </span>{" "}
                        <span style={{ minWidth: "80px" }}>{headerData?.Cust_CST_STATE_No}</span>
                    </p>
                    <p style={{ fontSize: "12px", display: "flex", }}>
                        <span className="fw-semibold pe-2" style={{ minWidth: "80px" }}>PAN NO : </span>{" "}
                        <span style={{ minWidth: "80px" }}>{headerData?.CustPanno}</span>
                    </p>
                </div>
            </div>
            {/* table header */}
            <div className="d-flex border border-black border-2">
                <div className="col-3 border-end border-black border-2">
                    <p className="fw-bold text-center">DESCRIPTION</p>
                </div>
                <div className="col-9 d-flex">
                    <div className="col-4">
                        <p className="fw-bold pe-1 ps-2">DETAIL</p>
                    </div>
                    <div className="col-8 d-flex">
                        <div className="col-4"><p className="fw-bold text-end px-1">WEIGHT</p></div>
                        <div className="col-4"><p className="fw-bold text-end px-1">RATE</p></div>
                        <div className="col-4"><p className="fw-bold text-end ps-1 pe-2">AMOUNT</p></div>
                    </div>
                </div>
            </div>
            {/* table data */}
            <div className="d-flex border-start border-end border-bottom border-black border-2">
                <div className="col-3 border-end d-flex justify-content-center  pb-4 border-black border-2 pt-5">
                    <p className="text-center">GOLD BAR</p>
                </div>
                <div className="col-9 d-flex pb-4 px-1">
                    <div className="col-4">
                        {
                            data?.resultArray.map((e, i) => {
                                return <p className="px-1" key={i}>{e?.MetalTypePurity}</p>
                            })
                        }
                        <p className={`px-1 ${style?.min_height_24}`} >LABOUR</p>
                        {
                            extra?.json1?.map((e, i) => {
                                return <p className={`px-1 ${style?.min_height_24}`} key={i}>{e?.label}</p>
                            })
                        }
                        {
                            extra?.json2?.map((e, i) => {
                                return <p className={`px-1 ${style?.min_height_24}`} key={i}>{e?.ShapeName}</p>
                            })
                        }
                        {/* <p className={`px-1 ${style?.min_height_24}`} >OTHER</p> */}

                    </div>
                    <div className="col-8 d-flex">
                        <div className="col-4">
                            {
                                data?.resultArray.map((e, i) => {
                                    return <p className="text-end px-1" key={i}>{NumberWithCommas(e?.MetalDiaWt, 3)}</p>
                                })
                            }
                            {/* <p className={`text-end px-1 ${style?.min_height_24}`} ></p>
                            <p className={`text-end px-1 ${style?.min_height_24}`} ></p> */}
                        </div>
                        <div className="col-4">
                            {
                                data?.resultArray.map((e, i) => {
                                    return <p className="text-end px-1" key={i}>{NumberWithCommas(e?.metalrate, 2)}</p>
                                })
                            }
                             <p className={`text-end px-1 ${style?.min_height_24}`} >{NumberWithCommas(data?.mainTotal?.total_labour?.labour_rate/data?.mainTotal?.netwt, 2)}</p>
                            {/* <p className={`px-1 text-end ${style?.min_height_24}`} ></p> */}
                        </div>
                        <div className="col-4">
                            {
                                data?.resultArray.map((e, i) => {
                                    return <p className="text-end px-1" key={i}>{NumberWithCommas(e?.MetalAmount, 2)}</p>
                                })
                            }
                            <p className={`text-end px-1 ${style?.min_height_24}`} >{NumberWithCommas(data?.mainTotal?.total_labour?.labour_amount, 2)}</p>

                            {
                                extra?.json1?.map((e, i) => {
                                    return <p className={`text-end px-1 ${style?.min_height_24}`} key={i}>{NumberWithCommas(+e?.value, 2)}</p>
                                })
                            }
                            {
                                extra?.json2?.map((e, i) => {
                                    return <p className={`text-end px-1 ${style?.min_height_24}`} key={i}>{e?.Amount !== 0 && NumberWithCommas(e?.Amount, 2)}</p>
                                })
                            }
                            {/* <p className={`text-end px-1 ${style?.min_height_24}`} >{NumberWithCommas(data?.mainTotal?.total_other, 2)}</p> */}
                        </div>
                    </div>
                </div>
            </div>
            {/* table total */}
            <div className="d-flex border-start border-end border-bottom mb-1 border-black border-2">
                <div className="col-3 border-end d-flex justify-content-center align-items-center pb-4 border-black border-2">
                    <p className="text-center"></p>
                </div>
                <div className="col-9 d-flex justify-content-between px-1 align-items-center">
                    <p className="px-1 fw-bold">Total</p>
                    <p className="text-end px-1 fw-bold">{NumberWithCommas(data?.mainTotal?.total_unitcost, 2)}</p>
                </div>
            </div>
            {/* taxes */}
            <div className="d-flex  my-2 justify-content-end">
                <div className="col-4">
                    <p><span className="fw-bold"> Note:</span> {headerData?.PrintRemark}</p>
                </div>
                <div className="col-5 border border-black border-2">
                    <div style={{ minHeight: "126px" }}>
                        {data?.mainTotal?.total_discount_amount !== 0 && <div className="d-flex justify-content-between px-1 pt-1">
                            <p className='ps-1'>Discount	</p>
                            <p className='pe-1'>{NumberWithCommas(data?.mainTotal?.total_discount_amount, 2)}</p>
                        </div>}
                        <div className="d-flex justify-content-between px-1">
                            <p className='fw-bold ps-1'>Total Amount	</p>
                            <p className='fw-bold pe-1'>{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p>
                        </div>
                        {
                            data?.allTaxes.map((e, i) => {
                                return <div className="d-flex justify-content-between px-1" key={i}>
                                    <p className='ps-1'>{e?.name} @ {e?.per}	</p>
                                    <p className='pe-1'>{NumberWithCommas(+e?.amount, 2)}</p>
                                </div>
                            })
                        }
                        {headerData?.AddLess !== 0 && <div className="d-flex justify-content-between px-1">
                            <p className='ps-1'>{headerData?.AddLess > 0 ? "Add" : "Less"}</p>
                            <p className='pe-1'>{NumberWithCommas(headerData?.AddLess, 2)}</p>
                        </div>}
                    </div>
                    <div className="d-flex justify-content-between px-1 border-top border-black border-2">
                        <p className='fw-bold ps-1'>Grand Total</p>
                        <p className='fw-bold pe-1'>{NumberWithCommas(data?.finalAmount, 2)}</p>
                    </div>
                </div>
            </div>
            {/* in words */}
            <div className="my-2 border p-1 border-black border-2">
                <p className="fw-bold">Rs.{toWords.convert(+fixedValues(data?.finalAmount, 2))} Only.</p>
            </div>
            {/* note */}
            <div className="my-2 border p-1 border-black border-2">
                <p className="fw-bold">NOTE : </p>
                <div dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}></div>
            </div>
            {/* company details */}
            <div className="my-2 border p-1 border-black border-2">
                <p className="fw-bold">COMPANY DETAILS :</p>
                <p>GSTIN. : {headerData?.Company_VAT_GST_No.split("GSTIN-")[1]}</p>
                <p>STATE CODE. : {headerData?.Company_CST_STATE_No}</p>
                <p>PAN NO. : {headerData?.Pannumber}</p>
                <p>Kindly make your payment by the name of "<span className='fw-bold'>{headerData?.accountname}</span>"</p>
                <p>Payable at {headerData?.customercity} ({headerData?.CompanyState}) by cheque or DD</p>
                <p>Bank Detail : Bank Account No <span className='fw-bold'>{headerData?.accountnumber}</span></p>
                <p>Bank Name : {headerData?.bankname}, {headerData?.bankaddress}</p>
                <p>RTGS/NEFT IFSC : {headerData?.rtgs_neft_ifsc}</p>
            </div>
            {/* signs */}
            <div className="my-2 d-flex">
                <div className={`col-6 pe-1`}>
                    <div className={` border border-black border-2 ${style?.min_height_130} p-1 text-center border-end border-black`}><p className='fw-bold'>AUTHORISED, {headerData?.customerfirmname}</p></div>
                </div>
                <div className={`col-6 ps-1`}>
                    <div className={` border border-black border-2 ${style?.min_height_130} p-1 text-center border-end border-black`}><p className='fw-bold'>AUTHORISED, {headerData?.CompanyFullName}</p></div>
                </div>
                {/* <div className={`col-6 border border-black border-2 ${style?.min_height_100} p-1 text-center`}><p className='fw-bold'>AUTHORISED, {headerData?.CompanyFullName}</p></div> */}
            </div>
            {/* footer */}
            {/* <div className="d-flex border mt-1 border-black">
                <div className="col-4 border-end p-2 border-black">
                    <p className="fw-bold">Bank Detail</p>
                    <p>Bank Name: {headerData?.bankname}</p>
                    <p>Branch: {headerData?.bankaddress}</p>
                    <p>Account Name: {headerData?.accountname}</p>
                    <p>Account No. : {headerData?.accountnumber}</p>
                    <p>RTGS/NEFT IFSC: {headerData?.rtgs_neft_ifsc}</p>
                </div>
                <div className="col-4 border-end p-2 d-flex flex-column justify-content-between border-black">
                    <p className="fw-bold">Signature</p>
                    <p>
                        <span className="fw-bold">{headerData?.CustName}</span>
                        <span className={`${style?.sup}`}></span> (With Stamp)
                    </p>
                </div>
                <div className="col-4 p-2 d-flex flex-column justify-content-between">
                    <p className="fw-bold">Signature</p>
                    <p className="fw-bold">{headerData?.CompanyFullName}</p>
                </div>
            </div> */}
        </div>
    ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
        </p>
    );
}

export default InvoicePrint6;

