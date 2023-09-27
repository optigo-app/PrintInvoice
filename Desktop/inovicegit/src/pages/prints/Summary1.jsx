import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "../../assets/css/prints/summary1.css";
import { CapitalizeWords, handleImageError } from '../../GlobalFunctions';
import convertor from "number-to-words";
import Button from "../../GlobalFunctions/Button";
import Loader from '../../components/Loader';
const Summary1 = ({ urls, token, invoiceNo, printName }) => {
    const [headerData, setHeaderData] = useState({});
    const [dynamicList1, setDynamicList1] = useState([]);
    const [dynamicList2, setDynamicList2] = useState([]);
    const [mainTotal, setMainTotal] = useState({});
    const [resultArray, setAesultArray] = useState([]);
    const [totalgrosswt, setTotalgrosswt] = useState(0);
    const [totalnetlosswt, setTotalnetlosswt] = useState(0);
    const [totalLabourAmount, setTotalLabourAmount] = useState(0);
    const [totalOtherAmount, setTotalOtherAmount] = useState(0);
    const [responsejson, setResponsejson] = useState('');
    const [jwtotlbrAmt, setJwtotlbrAmt] = useState(0);
    const [jwtotothAmt, setJwtotothAmt] = useState(0);
    const [TotalAmount, setTotalAmount] = useState(0);
    const [inWords, setInWords] = useState('');
    const [summaryDetail, setSummaryDetail] = useState({});
    const [mainObj, setMainObj] = useState('');


    const organizeData = (arr1, arr2, headerDatas) => {

        let totgrosswt = 0;
        let totnetlosswt = 0;
        let totallbrAmt = 0;
        let totalOtherAmt = 0;
        let totAmount = 0;
        let mainTotal = {
            diamonds: {
                Wt: 0,
                Pcs: 0,
                Rate: 0,
                Amount: 0,
            },
            colorstone: {
                Wt: 0,
                Pcs: 0,
                Rate: 0,
                Amount: 0,
            },
            metal: {
                Wt: 0,
                Pcs: 0,
                Rate: 0,
                Amount: 0,
            },
            misc: {
                Wt: 0,
                Pcs: 0,
                Rate: 0,
                Amount: 0,
            },
            finding: {
                Wt: 0,
                Pcs: 0,
                Rate: 0,
                Amount: 0,
            },
            totalnetwt: {
                netwt: 0,
            },
            totalgrosswt: {
                grosswt: 0,
            },

        };
        let resultArr = [];
        arr1.map((e, i) => {

            let diamonds = [];
            let colorstone = [];
            let metal = [];
            let misc = [];
            let finding = [];
            let totals = {
                diamonds: {
                    Wt: 0,
                    Pcs: 0,
                    Rate: 0,
                    Amount: 0,
                },

                colorstone: {
                    Wt: 0,
                    Pcs: 0,
                    Rate: 0,
                    Amount: 0,
                },

                metal: {
                    Wt: 0,
                    Pcs: 0,
                    Rate: 0,
                    Amount: 0,
                },

                misc: {
                    Wt: 0,
                    Pcs: 0,
                    Rate: 0,
                    Amount: 0,
                },

                finding: {
                    Wt: 0,
                    Pcs: 0,
                    Rate: 0,
                    Amount: 0,
                },

                labour: {
                    labourAmount: 0,
                },

                OtherCh: {
                    OtherAmount: 0,
                }
            };


            totgrosswt += e?.grosswt;

            totnetlosswt = totnetlosswt + (+e?.NetWt) + (+e?.LossWt);
            totals.labour.labourAmount = totals.labour.labourAmount + e?.MakingAmount;
            totals.OtherCh.OtherAmount = totals.OtherCh.OtherAmount + e?.OtherCharges + e?.MiscAmount;

            totallbrAmt += e?.MakingAmount;
            totalOtherAmt += e?.OtherCharges + e?.MiscAmount;

            totAmount += e?.TotalAmount;

            arr2.map((ele, ind) => {

                if (e.SrJobno === ele?.StockBarcode) {

                    if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
                        diamonds.push(ele);
                        totals.diamonds.Wt += ele?.Wt;
                        totals.diamonds.Pcs += ele?.Pcs;
                        totals.diamonds.Rate += ele?.Rate;
                        totals.diamonds.Amount += ele?.Amount;
                        mainTotal.diamonds.Wt += ele?.Wt;
                        mainTotal.diamonds.Pcs += ele?.Pcs;
                        mainTotal.diamonds.Rate += ele?.Rate;
                        mainTotal.diamonds.Amount += ele?.Amount;
                    }
                    if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
                        colorstone.push(ele);
                        totals.colorstone.Wt += ele?.Wt;
                        totals.colorstone.Pcs += ele?.Pcs;
                        totals.colorstone.Rate += ele?.Rate;
                        totals.colorstone.Amount += ele?.Amount;
                        mainTotal.colorstone.Wt += ele?.Wt;
                        mainTotal.colorstone.Pcs += ele?.Pcs;
                        mainTotal.colorstone.Rate += ele?.Rate;
                        mainTotal.colorstone.Amount += ele?.Amount;
                    }
                    if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
                        misc.push(ele);
                        totals.misc.Wt += ele?.Wt;
                        totals.misc.Pcs += ele?.Pcs;
                        totals.misc.Rate += ele?.Rate;
                        totals.misc.Amount += ele?.Amount;
                        mainTotal.misc.Wt += ele?.Wt;
                        mainTotal.misc.Pcs += ele?.Pcs;
                        mainTotal.misc.Rate += ele?.Rate;
                        mainTotal.misc.Amount += ele?.Amount;
                    }
                    if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                        metal.push(ele);
                        totals.metal.Wt += ele?.Wt;
                        totals.metal.Pcs += ele?.Pcs;
                        totals.metal.Rate += ele?.Rate;
                        totals.metal.Amount += ele?.Amount;
                        mainTotal.metal.Wt += ele?.Wt;
                        mainTotal.metal.Pcs += ele?.Pcs;
                        mainTotal.metal.Rate += ele?.Rate;
                        mainTotal.metal.Amount += ele?.Amount;
                    }
                    if (ele?.MasterManagement_DiamondStoneTypeid === 5) {
                        finding.push(ele);
                        totals.finding.Wt += ele?.Wt;
                        totals.finding.Pcs += ele?.Pcs;
                        totals.finding.Rate += ele?.Rate;
                        totals.finding.Amount += ele?.Amount;
                        mainTotal.finding.Wt += ele?.Wt;
                        mainTotal.finding.Pcs += ele?.Pcs;
                        mainTotal.finding.Rate += ele?.Rate;
                        mainTotal.finding.Amount += ele?.Amount;
                    }

                }
            });
            let obj = { ...e };
            obj.diamonds = diamonds;
            obj.colorstone = colorstone;
            obj.metal = metal;
            obj.misc = misc;
            obj.finding = finding;
            obj.totals = totals;
            let sumoflbr = e?.MakingAmount;
            obj.LabourAmountSum = sumoflbr;
            let sumofOth = e?.OtherCharges + e?.MiscAmount;
            obj.OtherChargeAmountSum = sumofOth;
            resultArr.push(obj);

        });
        // rupeetoWords(totAmount);
        let tots = totAmount + headerDatas?.AddLess + headerDatas?.TotalCGSTAmount + headerDatas?.TotalSGSTAmount;

        let words = CapitalizeWords(convertor.toWords(Math.round(tots)));
        setInWords(words);
        setTotalAmount(totAmount);
        setAesultArray(resultArr);
        setMainTotal(mainTotal);
        setTotalgrosswt(totgrosswt);
        setTotalnetlosswt(totnetlosswt);
        setTotalLabourAmount(totallbrAmt);
        setTotalOtherAmount(totalOtherAmt);

        const array1 = resultArr.slice(0, 12);
        const array2 = resultArr.slice(12);
        let newObj = {
            first: array1,
            second: array2,
            mainTotal: mainTotal,
        };

        setMainObj(newObj);


    };

    async function loadData() {
        try {

            const body = {
                "token": token,
                "invoiceno": invoiceNo,
                "printname": printName
            };

            const data = await axios.post(urls, body);
            if (data?.data?.Status == 200) {
                let datas = data?.data?.Data;
                setResponsejson(datas);
                setHeaderData(datas?.BillPrint_Json[0]);
                setDynamicList1(datas?.BillPrint_Json1);
                setDynamicList2(datas?.BillPrint_Json2);
                organizeData(datas?.BillPrint_Json1, datas?.BillPrint_Json2, datas?.BillPrint_Json[0]);
                countCategorySubCategory(datas?.BillPrint_Json1);


            } else {
                console.log(data?.data?.Status, data?.data?.Message);
            }
        } catch (error) {
            console.log(error);
        }
    };


    const findKeyValuePair = (array, firstName, secondName) => {
        const counts = {};
        array.forEach(item => {
            const key = `${item[firstName]} | ${item[secondName]}`;
            counts[key] = (counts[key] || 0) + 1;
        });
        return counts;
    };

    const countCategorySubCategory = (data) => {

        let countArr = findKeyValuePair(data, "Categoryname", "SubCategoryname");
        Object.keys(countArr).forEach(key => {
            const [category, subcategory] = key.split('|');
            if (!subcategory) {
                delete countArr[category];
            }
        });

        const countsArray = Object.entries(countArr)
            .filter(([key, value]) => key.includes('|')) // Filter out single category entries
            .map(([key, value]) => ({ name: key, value }));

        setSummaryDetail(countsArray);

        let arr1 = countsArray.slice(0, 3);
        let arr2 = countsArray.slice(3, 6);
        let arr3 = countsArray.slice(6, 9);
        let arr4 = countsArray.slice(9, 12);
        let obj = {
            firstArr: arr1,
            secondArr: arr2,
            thirdArr: arr3,
            fourthArr: arr4,
        };
        setSummaryDetail(obj);
    };


    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            {
                resultArray?.length === 0 ? <Loader /> : <>
                    <div className='btnpcl'>
                        <Button />
                    </div>
                    <div className='summary1PrintSum1'>
                        <div className='mainheadersum1'>
                            <div className='head1sum1'>JEWELLERY INVOICE</div>
                            <div className='head2sum1'>
                                <div className='subhead2sum1'>
                                    <div className='headingsum1'>{headerData?.CompanyFullName}</div>
                                    <div className='lhhead1sum1'>{headerData?.CompanyAddress}</div>
                                    <div className='lhhead1 '>{headerData?.CompanyAddress2}-{headerData?.CompanyPinCode}, {headerData?.CompanyState}({headerData?.CompanyCountry})</div>
                                    <div className='lhhead1sum1'>T {headerData?.CompanyTellNo} {headerData?.CompanyTollFreeNo}</div>
                                    <div className='lhhead1sum1'>{headerData?.CompanyEmail} {headerData?.CompanyWebsite}</div>
                                </div>
                                <div><img src={headerData?.PrintLogo} id="sum1Img" alt="#summary1" onError={(e) => handleImageError(e)} /></div>
                            </div>
                            <div className='head3sum1'>
                                <div className='invoicehead3sum1'><b className='binvsum1'>{headerData?.InvTitle}# :</b> {headerData?.InvoiceNo}</div>
                                <div className='invoicehead3sum1 d-flex flex-column'>
                                    <div className='d-flex justify-content-around align-items-center datehead3sum1'><b className='binvsum1'>DATE :</b>{headerData?.EntryDate}</div>
                                    <div className="d-flex justify-content-around align-items-center datehead3sum1"><b className='binvsum1'>HSN :</b>{headerData?.HSN_No}</div>
                                </div>
                            </div>
                            <div className='head4sum1'>
                                <div className='samplehead4sum1'>{headerData?.customerfirmname}</div>
                                <div className='lhhead4sum1'>{headerData?.customerstreet}</div>
                                <div className='lhhead4sum1'>Area {headerData?.customerAddress2}</div>
                                <div className='lhhead4sum1'>{headerData?.customercity}</div>
                                <div className='lhhead4sum1'>{headerData?.customermobileno}</div>
                                <div className='lhhead4sum1'>{headerData?.vat_cst_pan} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No}</div>
                            </div>
                        </div>
                        <div className='tableSectionSum1'>
                            <div className='theadsum1'>
                                <div className='wthsum1 srwsum1'>SR#</div>
                                <div className='wthsum1 designwsum1'>DESIGNS / CODE</div>
                                <div className='wthsum1'>METAL</div>
                                <div className='wthsum1'>GWT</div>
                                <div className='wthsum1'>NWT</div>
                                <div className='wthsum1'>DPCS</div>
                                <div className='wthsum1'>DWT</div>
                                <div className='wthsum1'>CSPCS</div>
                                <div className='wthsum1'>CSWT.</div>
                                <div className='wthsum1'>OTHER</div>
                                <div className='wthsum1 brightsum1'>TOTAL</div>
                            </div>
                            {
                                resultArray?.map((e, i) => {

                                    return (
                                        <>{(i !== 0 && i % 12 === 0) ?
                                            <> <div className='page_break_after' key={i}></div>
                                                <div className='head1sum1' key={i}>JEWELLERY INVOICE</div>
                                                <div className='head2sum1'>
                                                    <div className='subhead2sum1'>
                                                        <div className='headingsum1'>{headerData?.CompanyFullName}</div>
                                                        <div className='lhhead1sum1'>{headerData?.CompanyAddress}</div>
                                                        <div className='lhhead1sum1'>{headerData?.CompanyAddress2}-{headerData?.CompanyPinCode}, {headerData?.CompanyState}({headerData?.CompanyCountry})</div>
                                                        <div className='lhhead1sum1'>T {headerData?.CompanyTellNo} {headerData?.CompanyTollFreeNo}</div>
                                                        <div className='lhhead1sum1'>{headerData?.CompanyEmail} {headerData?.CompanyWebsite}</div>
                                                    </div>
                                                    <div><img src={headerData?.PrintLogo} id="sum1Img" alt="#summary1" /></div>
                                                </div>
                                                <div className='tbodysum1' key={i}>
                                                    <div className='wtbsum1 srwsum1'>{e?.SrNo}</div>
                                                    <div className='wtbsum1 designwsum1 d-flex justify-content-around'>
                                                        <div><img src={e?.DesignImage} alt="#summary1" id='imgDySum1' /></div>
                                                        <div className='designContentsum1'><p className='brbdesignsum1' style={{ fontWeight: "bold", textAlign: "center" }}>{e?.designno}</p><p className='brbdesignsum1 brbs1'>{e?.SrJobno}</p></div>
                                                    </div>
                                                    <div className='wtbsum1 alignleftsum1'>{e?.MetalTypePurity}</div>
                                                    <div className='wtbsum1 alignrightsum1'>{e?.grosswt?.toFixed(3)}</div>
                                                    <div className='wtbsum1 alignrightsum1'>{e?.NetWt?.toFixed(3)}</div>
                                                    <div className='wtbsum1 alignrightsum1'>{e?.totals?.diamonds?.Pcs}</div>
                                                    <div className='wtbsum1 alignrightsum1'>{e?.totals?.diamonds?.Wt?.toFixed(3)}</div>
                                                    <div className='wtbsum1 alignrightsum1'>{e?.totals?.colorstone?.Pcs}</div>
                                                    <div className='wtbsum1 alignrightsum1'>{e?.totals?.colorstone?.Wt?.toFixed(3)}</div>
                                                    <div className='wtbsum1 alignrightsum1'>{e?.OtherCharges?.toFixed(2)}</div>
                                                    <div className='wtbsum1 brightsum1 alignrightsum1'>₹ {e?.TotalAmount?.toFixed(2)}</div>
                                                </div>
                                            </>
                                            :
                                            <div className='tbodysum1' key={i}>
                                                <div className='wtbsum1 srwsum1'>{e?.SrNo}</div>
                                                <div className='wtbsum1 designwsum1 d-flex justify-content-around p-1'>
                                                    <div><img src={e?.DesignImage} alt="#summary1" id='imgDySum1' /></div>
                                                    <div className='designContentsum1'><p className='brbdesignsum1' style={{ fontWeight: "bold", textAlign: "center" }}>{e?.designno}</p><p className='brbdesignsum1 brbs1'>{e?.SrJobno}</p></div>
                                                </div>
                                                <div className='wtbsum1 alignleftsum1'>{e?.MetalTypePurity}</div>
                                                <div className='wtbsum1 alignrightsum1'>{e?.grosswt?.toFixed(3)}</div>
                                                <div className='wtbsum1 alignrightsum1'>{e?.NetWt?.toFixed(3)}</div>
                                                <div className='wtbsum1 alignrightsum1'>{e?.totals?.diamonds?.Pcs}</div>
                                                <div className='wtbsum1 alignrightsum1'>{e?.totals?.diamonds?.Wt?.toFixed(3)}</div>
                                                <div className='wtbsum1 alignrightsum1'>{e?.totals?.colorstone?.Pcs}</div>
                                                <div className='wtbsum1 alignrightsum1'>{e?.totals?.colorstone?.Wt?.toFixed(3)}</div>
                                                <div className='wtbsum1 alignrightsum1'>{e?.OtherCharges?.toFixed(2)}</div>
                                                <div className='wtbsum1 brightsum1 alignrightsum1'>₹ {e?.TotalAmount?.toFixed(2)}</div>
                                            </div>
                                        }
                                        </>
                                    );
                                })
                            }
                        </div>
                        <div className='secondheadsum1'>
                            <div className='secondtbodysum1'>
                            </div>
                            <div>
                                <div className='tbodysum1second'>
                                    <div className='wtbsum1 wtotalsum1 htotalrowsum1'><b className='totrowfssum1'>TOTAL</b></div>
                                    <div className='wtbsum1 htotalrowsum1 alignrightsum1'><b className='totrowfssum1'>{totalgrosswt?.toFixed(3)}</b></div>
                                    <div className='wtbsum1 htotalrowsum1 alignrightsum1'><b className='totrowfssum1'>{totalnetlosswt?.toFixed(3)}</b></div>
                                    <div className='wtbsum1 htotalrowsum1 alignrightsum1'><b className='totrowfssum1'>{mainObj?.mainTotal?.diamonds?.Pcs}</b></div>
                                    <div className='wtbsum1 htotalrowsum1 alignrightsum1'><b className='totrowfssum1'>{mainObj?.mainTotal?.diamonds?.Wt?.toFixed(3)}</b></div>
                                    <div className='wtbsum1 htotalrowsum1 alignrightsum1'><b className='totrowfssum1'>{mainObj?.mainTotal?.colorstone?.Pcs}</b></div>
                                    <div className='wtbsum1 htotalrowsum1 alignrightsum1'><b className='totrowfssum1'>{mainObj?.mainTotal?.colorstone?.Wt?.toFixed(3)}</b></div>
                                    <div className='wtbsum1 htotalrowsum1 alignrightsum1'><b className='totrowfssum1'>{totalOtherAmount?.toFixed(2)}</b></div>
                                    <div className='wtbsum1 brightsum1 htotalrowsum1 alignrightsum1'><b className='totrowfssum1'>₹ {TotalAmount?.toFixed(2)}</b></div>
                                </div>
                                <div className='totaldesignsum1'>
                                    <div className='d-flex justify-content-between wtotsum1'><p className='totgstsum1 gsttotsum1'>CGST @ {headerData?.CGST}% </p>	<p className='totgstsum1'>{headerData?.TotalCGSTAmount?.toFixed(2)}</p></div>
                                    <div className='d-flex justify-content-between wtotsum1'><p className='totgstsum1 gsttotsum1'>SGST @ {headerData?.SGST}%</p>	<p className='totgstsum1'>{headerData?.TotalSGSTAmount?.toFixed(2)}</p></div>
                                    <div className='d-flex justify-content-between wtotsum1'><p className='totgstsum1 gsttotsum1 fw-bold'>{headerData?.AddLess > 0 ? 'ADD' : 'Less'}</p><p className='totgstsum1 fw-bold'>{headerData?.AddLess?.toFixed(2)}</p></div>
                                </div>
                                <div className='grandtotalsum1'>
                                    <div className='amtwordssum1 px-2'>{inWords}</div>
                                    <div className='amtwordssum1 wtotsum1 d-flex align-items-center justify-content-end pe-4 wgtsum1'>Grand Total : ₹ {TotalAmount + headerData?.AddLess + headerData?.TotalCGSTAmount + headerData?.TotalSGSTAmount}/-  </div>
                                </div>
                            </div>
                            <div className='summarysum1'>
                                <div className='summarysum1fs'>Summary Detail</div>
                                <div className='summaryDetailsum1'>
                                    <div className='wsummarySum1'>
                                        {
                                            summaryDetail?.firstArr?.map((e, i) => {
                                                return (
                                                    <>
                                                        <div key={i} className="d-flex arrSum1"><div className='summwsum1 fs13sum1' style={{ width: "60%" }}>{e?.name}</div>
                                                            <div className='summwsum1 fs13sum1' style={{ width: "20%" }}> : </div>
                                                            <div className='summwsum1 fs13sum1' style={{ width: "20%" }}>{e?.value}</div>
                                                        </div>
                                                    </>
                                                );
                                            })
                                        }
                                    </div>
                                    <div className='wsummarySum1'>
                                        {
                                            summaryDetail?.secondArr?.map((e, i) => {
                                                return (
                                                    <>
                                                        <div className='d-flex arrSum1' key={i}>
                                                            <div className='summwsum1 fs13sum1' style={{ width: "60%" }}>{e?.name}</div>
                                                            <div className='summwsum1 fs13sum1' style={{ width: "20%" }}> : </div>
                                                            <div className='summwsum1 fs13sum1' style={{ width: "20%" }}>{e?.value}</div>
                                                        </div>
                                                    </>
                                                );
                                            })
                                        }
                                    </div>
                                    <div className='wsummarySum1'>
                                        {
                                            summaryDetail?.thirdArr?.map((e, i) => {
                                                return (
                                                    <>
                                                        <div className='d-flex arrSum1' key={i}>
                                                            <div className='summwsum1 fs13sum1' style={{ width: "60%" }}>{e?.name}</div>
                                                            <div className='summwsum1 fs13sum1' style={{ width: "20%" }}>:</div>
                                                            <div className='summwsum1 fs13sum1' style={{ width: "20%" }}>{e?.value}</div>
                                                        </div>
                                                    </>
                                                );
                                            })
                                        }
                                    </div>
                                    <div className='wsummarySum1'>
                                        {
                                            summaryDetail?.fourthArr?.map((e, i) => {
                                                return (
                                                    <>
                                                        <div className='d-flex arrSum1' key={i}>
                                                            <div className='summwsum1 fs13sum1' style={{ width: "60%" }}>{e?.name}</div>
                                                            <div className='summwsum1 fs13sum1' style={{ width: "20%" }}> : </div>
                                                            <div className='summwsum1 fs13sum1' style={{ width: "20%" }}>{e?.value}</div>
                                                        </div>
                                                    </>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='notessum1'>
                                <div className='noteSum1'>NOTE :</div>
                                <div className='noteDemosum1' dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}>
                                </div>
                            </div>
                            <div className='remarkSum1'>REMARKS IF ANY : <p className='remarkValSum1'>{headerData?.PrintRemark}</p></div>
                            <div className='footerSum1'>
                                <div className='footer1Sum1'><p className='footerSignValSum1'>RECEIVER's NAME & SIGNATURE</p></div>
                                <div className='footer1Sum1'><p className='footer2SignValSum1'>for,ORAIL SERVICE</p></div>
                            </div>
                        </div>
                    </div>
                </>
            }

        </>
    );
};

export default Summary1;