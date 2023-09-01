// import axios from 'axios';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "../assets/css/packinglist3.css";
// import orailImage from './orail.png';

const PackingList3 = ({ urls, token, invoiceNo, printName }) => {
    const [headerData, setHeaderData] = useState({});
    const [imgShow, setImgShow] = useState(true);
    const [dynamicList1, setDynamicList1] = useState([]);
    const [dynamicList2, setDynamicList2] = useState([]);
    const totalObj = {
        totdiapcs: 0,
        totdiawt: 0,
        totdiaamt: 0,
        totcspcs: 0,
        totcswt: 0,
        totcsamt: 0,
        totmiscpcs: 0,
        totmiscwt: 0,
        totmiscamt: 0,
        totmtpcs: 0,
        totmtwt: 0,
        totmtamt: 0,
        totstpcs: 0,
        totstwt: 0,
        totstamt: 0,
        totalAmt: 0,
        totmakingAmt: 0,
        totOthAmt: 0,
        totDiscount: 0,
        totfinewt: 0,
        totgrosswt: 0,
        totnetwt: 0,

    };
    let diamondList = [];
    let colorStoneList = [];
    let miscList = [];
    let metalList = [];
    let findingList = [];
    let stoneMiscList = [];

    async function loadData() {
        try {
            // const data = await import(`../assets/json/${billNumber}.json`);
            // let datas = {};
            // datas.BillPrint_Json = data.BillPrint_Json;
            // datas.BillPrint_Json1 = data.BillPrint_Json1;
            // datas.BillPrint_Json2 = data.BillPrint_Json2;
            const body = {
                "token": token,
                "invoiceno": invoiceNo,
                "printname": printName
            };

            const data = await axios.post(urls, body);
            console.log(data);
            if (data?.data?.Status == 200) {
                console.log(data?.data?.Data);
                let datas = data?.data?.Data;
                setHeaderData(datas?.BillPrint_Json[0]);
                setDynamicList1(datas?.BillPrint_Json1);
                setDynamicList2(datas?.BillPrint_Json2);
            }else{
                // console.log(data?.data?.Status, data?.data?.Message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleImageError = (e) => {
        e.target.src = "https://d12oja0ew7x0i8.cloudfront.net/images/Article_Images/ImageForArticle_19533_16006923254289023.png";
    };


    dynamicList2?.length > 0 && dynamicList2.map((e, i) => {

        if (e?.MasterManagement_DiamondStoneTypeid === 1) {
            totalObj.totdiapcs = totalObj.totdiapcs + (+e?.Pcs);
            totalObj.totdiawt = totalObj.totdiawt + (+e?.Wt);
            totalObj.totdiaamt = totalObj.totdiaamt + (+e?.Amount);
            diamondList.push(e);
        }
        if (e?.MasterManagement_DiamondStoneTypeid === 2) {
            totalObj.totcspcs = totalObj.totcspcs + e?.Pcs;
            totalObj.totcswt = totalObj.totcswt + e?.Wt;
            totalObj.totcsamt = totalObj.totcsamt + e?.Amount;
            colorStoneList.push(e);
        }
        if (e?.MasterManagement_DiamondStoneTypeid === 3) {
            totalObj.totmiscpcs = totalObj.totmiscpcs + e?.Pcs;
            totalObj.totmiscwt = totalObj.totmiscwt + e?.Wt;
            totalObj.totmiscamt = totalObj.totmiscamt + e?.Amount;
            miscList.push(e);
        }
        if (e?.MasterManagement_DiamondStoneTypeid === 4) {
            totalObj.totmtpcs = totalObj.totmtpcs + e?.Pcs;
            totalObj.totmtwt = totalObj.totmtwt + e?.Wt;
            totalObj.totmtamt = totalObj.totmtamt + e?.Amount;
            metalList.push(e);
        }
        if (e?.MasterManagement_DiamondStoneTypeid === 5) {
            findingList.push(e);
        }
        if (e?.MasterManagement_DiamondStoneTypeid === 2 || e.MasterManagement_DiamondStoneTypeid === 3) {
            totalObj.totstpcs = totalObj.totstpcs + e?.Pcs;
            totalObj.totstwt = totalObj.totstwt + e?.Wt;
            totalObj.totstamt = totalObj.totstamt + e?.Amount;
        }

    });


    // eslint-disable-next-line array-callback-return
    dynamicList1.map((e) => {
        totalObj.totalAmt = totalObj.totalAmt + e?.TotalAmount;
        totalObj.totmakingAmt = totalObj.totmakingAmt + e?.MakingAmount;
        totalObj.totDiscount = totalObj.totDiscount + e?.DiscountAmt;
        totalObj.totgrosswt = totalObj.totgrosswt + e?.grosswt;
        totalObj.totnetwt = totalObj.totnetwt + e?.NetWt;
        totalObj.totOthAmt = totalObj.totOthAmt + e?.OtherCharges;
    });

    // eslint-disable-next-line array-callback-return
    dynamicList2.map((e) => {
        totalObj.totfinewt = totalObj.totfinewt + e?.FineWt;
    });

    totalObj.totDiscount = Number(totalObj.totDiscount?.toFixed(3));

    stoneMiscList = colorStoneList.concat(miscList);

    const d = dynamicList2.reduce((grouped, e) => {
        if (e.MasterManagement_DiamondStoneTypeid === 1 && e.ShapeName === "RND") {
            const key = `${e.ShapeName} ${e.QualityName} ${e.Colorname}`;

            if (!grouped[key]) {
                grouped[key] = [];
            }

            grouped[key].push(e);
        }
        return grouped;
    }, {});

    const e = dynamicList2.reduce((grouped, e) => {
        if (e.MasterManagement_DiamondStoneTypeid === 1 && e.ShapeName !== "RND") {
            const key = `${e.ShapeName} ${e.QualityName} ${e.Colorname}`;

            if (!grouped[key]) {
                grouped[key] = [];
            }

            grouped[key].push(e);
        }
        return grouped;
    }, {});

    const calculatedData = [];
    const calData = [];

    for (const key in d) {
        if (d.hasOwnProperty(key)) {
            const group = d[key];

            const totalPcs = group.reduce((sum, item) => sum + item.Pcs, 0);
            const totalWt = group.reduce((sum, item) => sum + item.Wt, 0);

            calculatedData.push({
                ShapeName: key,
                totalPcs,
                totalWt,
            });

        }
    }
    for (const key in e) {
        if (e.hasOwnProperty(key)) {
            const group = e[key];

            const totalPcs = group.reduce((sum, item) => sum + item.Pcs, 0);
            const totalWt = group.reduce((sum, item) => sum + item.Wt, 0);

            calData.push({
                ShapeName: key,
                totalPcs,
                totalWt,
            });

        }
    }
    let totalPcs1 = 0;
    let totalWt1 = 0;

    for (const obj of calData) {
        totalPcs1 += obj.totalPcs;
        totalWt1 += obj.totalWt;
    }
    let other = {
        ShapeName: "OTHER",
        totalPcs: totalPcs1,
        totalWt: totalWt1,
    };

    calculatedData.push(other);
    const handleCheckedChange = (e) => {
        console.log(e.target.checked);
        let isCHecked = e.target.checked;
        (isCHecked) ? setImgShow(true) : setImgShow(false);
    };

    const handlePrint = (e) => {
        window.print();
    };

    return (
        <>
            <div>
                <div className='printpcl3'>
                    <div className='chboxlabelpcl3'><input type="checkbox" id='chbox' checked={imgShow} onChange={(e) => handleCheckedChange(e)} /> <label htmlFor='chbox'>With Image</label></div><div><button className='btn_white blue' onClick={(e) => handlePrint(e)}>Print</button></div>
                </div>
                <div className='containerPCL3'>
                    <div className='headlinepcl3'><b style={{ fontSize: "15px" }}>JEWELLERY PACKAGING LIST</b></div>
                    <div className='headpcl3'>
                        <div className='headpcl3Content'>
                            <div className='fslhpcl3'><h5><b style={{ fontSize: "13px" }}>{headerData?.CompanyFullName}</b></h5></div>
                            <div className='fslhpcl3'>{headerData?.CompanyAddress}</div>
                            <div className='fslhpcl3'>{headerData?.CompanyAddress2}</div>
                            <div className='fslhpcl3'>{headerData?.CompanyCity}-{headerData?.CompanyPinCode}, {headerData?.CompanyState}({headerData?.CompanyCountry})</div>
                            <div className='fslhpcl3'>T {headerData?.CompanyTellNo}</div>
                            <div className='fslhpcl3'>{headerData?.CompanyEmail} | {headerData?.CompanyWebsite}</div>
                            {/* <div className='fslhpcl3'>{headerData?.Company_VAT_GST_No} | {headerData?.Cust_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-EDJHF236D</div> */}
                            <div className='fslhpcl3'>{headerData?.Company_VAT_GST_No} | {headerData?.Cust_CST_STATE}-{headerData?.vat_cst_pan}</div>
                        </div>
                        <div className='headpcl3Img'><img src={headerData?.PrintLogo} alt='#' id='pcl3Img' onError={(e) => handleImageError(e)} /></div>
                    </div>
                    <div className='dynamicHeadpcl3main'>
                        <div className='dynamicHeadpcl31'>
                            <div className='fslhpcl3'>{headerData?.lblBillTo}</div>
                            <div className='fslhpcl3'><b className='pcl313'>{headerData?.customerfirmname}</b></div>
                            <div className='fslhpcl3'>{headerData?.customerAddress2}</div>
                            <div className='fslhpcl3'>{headerData?.customerAddress1}</div>
                            <div className='fslhpcl3'>{headerData?.customerAddress3}</div>
                            <div className='fslhpcl3'>{headerData?.customercity}{headerData?.customerpincode}</div>
                            <div className='fslhpcl3'>{headerData?.customeremail1}</div>
                            <div className='fslhpcl3'>{headerData?.vat_cst_pan}</div>
                            <div className='fslhpcl3'>{headerData?.Cust_CST_STATE}-{headerData?.Cust_CST_STATE_No}</div>
                        </div>
                        <div className='dynamicHeadpcl32'>
                            <div className='fslhpcl3'>Ship to</div>
                            <div className='fslhpcl3'><b className='pcl313'>{headerData?.customerfirmname}</b></div>
                            <div className='fslhpcl3'>{headerData?.CustName}</div>
                            <div className='fslhpcl3'>{headerData?.customerstreet}</div>
                            <div className='fslhpcl3'>{headerData?.customercity}, {headerData?.State}</div>
                            <div className='fslhpcl3'>India-{headerData?.PinCode}</div>
                            <div className='fslhpcl3'>Mobile No : {headerData?.customermobileno}</div>
                        </div>
                        <div className='dynamicHeadpcl33'>
                            <div className='billnopcl3'><div className='pcl3billnow fslhpcl3 '><b className='pcl313'>BILL NO</b></div><div className='billno3pdlpcl3 pcl313'>{headerData?.InvoiceNo}</div></div>
                            <div className='billnopcl3'><div className='pcl3billnow fslhpcl3'><b className='pcl313'>DATE</b></div><div className='billno3pdlpcl3 pcl313'>{headerData?.EntryDate}</div></div>
                            <div className='billnopcl3'><div className='pcl3billnow fslhpcl3'><b className='pcl313'>HSN</b></div><div className='billno3pdlpcl3 pcl313'>{headerData?.HSN_No}</div></div>
                        </div>
                    </div>
                    <div className='pcl3Table'>
                        <div className='pcl3tableHead'>
                            <div className='th1pcl3'><b>Sr</b></div>
                            <div className='th2pcl3'><b>Design</b></div>
                            <div className='th3pcl3'>
                                <div className='th3flexpcl3'>
                                    <div className='th3flex1pcl3'>
                                        <b>Diamond</b>
                                    </div>
                                    <div className='th3flex2pcl3'>
                                        <div className='th3Wpcl3'><b>Code</b></div>
                                        <div className='th3Wpcl3'><b>Size</b></div>
                                        <div className='th3Wpcl3'><b>Pcs</b></div>
                                        <div className='th3Wpcl3'><b>Wt</b></div>
                                        <div className='th3Wpcl3'><b>Rate</b></div>
                                        <div className='th3Wpcl3'><b>Amount</b></div>
                                    </div>
                                </div>
                            </div>
                            <div className='th4pcl3'>
                                <div className='th4flexpcl3'>
                                    <div className='th4flex1pcl3'>
                                        <b>Metal</b>
                                    </div>
                                    <div className='th4flex2pcl3'>
                                        <div className='th4Wpcl3'><b>Quality</b></div>
                                        <div className='th4Wpcl3'><b>GWt</b></div>
                                        <div className='th4Wpcl3'><b>N+L</b></div>
                                        <div className='th4Wpcl3'><b>Rate</b></div>
                                        <div className='th4Wpcl3'><b>Amount</b></div>
                                    </div>
                                </div>
                            </div>
                            <div className='th5pcl3'>
                                <div className='th5flexpcl3'>
                                    <div className='th5flex1pcl3'>
                                        <b>Stone & Misc</b>
                                    </div>
                                    <div className='th5flex2pcl3'>
                                        <div className='th5Wpcl3'><b>Code</b></div>
                                        <div className='th5Wpcl3'><b>Size</b></div>
                                        <div className='th5Wpcl3'><b>Pcs</b></div>
                                        <div className='th5Wpcl3'><b>Wt</b></div>
                                        <div className='th5Wpcl3'><b>Rate</b></div>
                                        <div className='th5Wpcl3'><b>Amount</b></div>
                                    </div>
                                </div>
                            </div>
                            <div className='th6pcl3'>
                                <div className='th6flexpcl3'>
                                    <div className='th6flex1pcl3' style={{ height: "25px" }}><b>Labour & Other Charges</b></div>
                                    <div className='th6flex2pcl3'>
                                        <div className='th6Wpcl3'><b>Charges</b></div>
                                        <div className='th6Wpcl3'><b>Rate</b></div>
                                        <div className='th6Wpcl3'><b>Amount</b></div>
                                    </div>
                                </div>
                            </div>
                            <div className='th7pcl3'><b style={{ fontSize: "11px" }}>Total Amount</b></div>
                        </div>

                        <div>
                            {
                                dynamicList1?.length > 0 && dynamicList1.map((e, i) => {
                                    let diapcs = 0;
                                    let diawt = 0;
                                    let diarate = 0;
                                    let diaamt = 0;
                                    let mtpcs = 0;
                                    let mtwt = 0;
                                    // let mtrate = 0;
                                    let mtamt = 0;
                                    let stpcs = 0;
                                    let stwt = 0;
                                    // let strate = 0;
                                    let stamt = 0;
                                    let totmakAmt = 0;
                                    totmakAmt = totmakAmt + e?.MakingAmount;
                                    return (
                                        <>
                                            < div className='pcl3TableCopy' key={i} >
                                                <div className='tableBodypcl3'>
                                                    <div className='thDpcl3'><b>{e?.SrNo}</b></div>
                                                </div>

                                                <div className='tableBodypcl3'>
                                                    <div className='th2Dpcl3'>
                                                        <div className='th2DJobpcl3'>
                                                            <div>{e?.designno}</div>
                                                            <div><div>{e?.SrJobno}</div><div>{e?.MetalColor}</div></div>
                                                        </div>
                                                        {imgShow ? <div className='imgpcl3'><img src={(e?.DesignImage) === ('' || undefined) ? e?.defaultimagename : e?.DesignImage} id="Imgpcl3" alt='#' /></div> : ''}
                                                        <div><div>Certificate# :</div>
                                                            <div><b>20231408EDFR#</b></div></div>
                                                        <div className='th2DEpcl3'><div>HUID :</div><div><b>{e?.HUID}</b></div></div>
                                                        <div className='th2DEpcl3'><div><b>PO : </b></div><div><b>{e?.PO}</b></div></div>
                                                        <div>{e?.lineid}</div>
                                                        <div className='th2DEpcl3'><div>Tunch : </div><div> {e?.Tunch}</div> </div>
                                                        <div><b>{e?.grosswt?.toFixed(3)} gm</b> Gross</div>
                                                        <div className='th2DEpcl3'><div>Size : </div><div>{e?.Size}</div></div>
                                                    </div>
                                                </div>

                                                <div className='diamondPcl3 positionpcl3'>
                                                    <div>
                                                        {
                                                            //diamond
                                                            diamondList?.length > 0 && diamondList?.map((ele, index) => {
                                                                if (((ele?.StockBarcode) == (e?.SrJobno))) {
                                                                    diapcs = diapcs + (+(ele?.Pcs));
                                                                    diawt = diawt + (+(ele?.Wt));
                                                                    diarate = diarate + (+(ele?.Rate));
                                                                    diaamt = diaamt + (+(ele?.Amount));
                                                                    return (
                                                                        <>
                                                                            <div className='diamondValuepcl3' key={index}>
                                                                                <div className='th3Wpcl3 brRightDpcl3'>{ele?.ShapeName}</div>
                                                                                <div className='th3Wpcl3 brRightDpcl3'>{ele?.SizeName}</div>
                                                                                <div className='th3Wpcl3 brRightDpcl3'>{ele?.Pcs}</div>
                                                                                <div className='th3Wpcl3 brRightDpcl3'>{ele?.Wt}</div>
                                                                                <div className='th3Wpcl3 brRightDpcl3'>{ele?.Rate}</div>
                                                                                <div className='th3Wpcl3 brRightDpcl3'><b>{ele?.Amount}</b></div>
                                                                            </div>
                                                                        </>
                                                                    );
                                                                }
                                                            })

                                                        }
                                                    </div>
                                                    <div className='diamondValuepcl3 positionpcl3D' style={{ width: "264px", border: "1px solid #989898", backgroundColor: "#e8e8e8", borderRight:"0px" }}>
                                                        <div className='th3Wpcl3 brRightDpcl3'></div>
                                                        <div className='th3Wpcl3 brRightDpcl3'></div>
                                                        <div className='th3Wpcl3 brRightDpcl3'><b>{diapcs}</b></div>
                                                        <div className='th3Wpcl3 brRightDpcl3'><b>{diawt.toFixed(3)}</b></div>
                                                        <div className='th3Wpcl3 brRightDpcl3'><b>{diarate}</b></div>
                                                        <div className='th3Wpcl3 brRightDpcl3'><b>{diaamt?.toFixed(2)}</b></div>
                                                    </div>
                                                </div>
                                                <div className='metalPcl3 positionpcl3'>
                                                    <div>
                                                        {
                                                            //metal
                                                            metalList?.length > 0 && metalList?.map((ele, index) => {
                                                                if ((ele?.StockBarcode) == (e?.SrJobno)) {
                                                                    mtpcs = mtpcs + (+(e?.grosswt));
                                                                    mtwt = mtwt + (+(e?.NetWt));
                                                                    mtamt = mtamt + (+(ele?.Amount));
                                                                    return (
                                                                        <>
                                                                            <div className='MetalPcl3' key={index}>
                                                                                <div className='th4Wpcl3 brRightDpcl3'>{ele?.ShapeName}</div>
                                                                                <div className='th4Wpcl3 brRightDpcl3'>{e?.grosswt?.toFixed(3)}</div>
                                                                                <div className='th4Wpcl3 brRightDpcl3'>{e?.NetWt}</div>
                                                                                <div className='th4Wpcl3 brRightDpcl3'>{ele?.Rate}</div>
                                                                                <div className='th4Wpcl3 brRightDpcl3'><b>{ele?.Amount?.toFixed(2)}</b></div>
                                                                            </div>
                                                                        </>
                                                                    );
                                                                }

                                                            })

                                                        }
                                                    </div>
                                                    <div className='MetalPcl3 positionpcl3D' style={{ width: "200px", border: "1px solid #989898", backgroundColor: "#e8e8e8", borderBottom:"0px" }}>
                                                        <div className='th4Wpcl3 brRightDpcl3'></div>
                                                        <div className='th4Wpcl3 brRightDpcl3'><b>{mtpcs}</b></div>
                                                        <div className='th4Wpcl3 brRightDpcl3'><b>{mtwt?.toFixed(3) == 0 ? '0' : mtwt?.toFixed(3)}</b></div>
                                                        <div className='th4Wpcl3 brRightDpcl3'></div>
                                                        <div className='th4Wpcl3 brRightDpcl3'></div>
                                                        <div className='th4Wpcl3 brRightDpcl3'><b>{mtamt == '' ? '0' : mtamt}</b></div>
                                                    </div>

                                                </div>
                                                <div className='diamondPcl3 positionpcl3'>
                                                    <div>
                                                        {
                                                            //stone&misc
                                                            stoneMiscList?.length > 0 && stoneMiscList?.map((ele, index) => {

                                                                if ((ele?.StockBarcode) == (e?.SrJobno)) {
                                                                    stpcs = stpcs + (+(ele?.Pcs));
                                                                    stwt = stwt + (+(ele?.Wt));
                                                                    stamt = stamt + (+(ele?.Amount));
                                                                    return (
                                                                        <>
                                                                            <div className='diamondValuepcl3' key={index}>
                                                                                <div className='th3Wpcl3 brRightDpcl3'>{ele?.ShapeName} </div>
                                                                                <div className='th3Wpcl3 brRightDpcl3'>{ele?.SizeName}</div>
                                                                                <div className='th3Wpcl3 brRightDpcl3'>{ele?.Pcs}</div>
                                                                                <div className='th3Wpcl3 brRightDpcl3'>{ele?.Wt}</div>
                                                                                <div className='th3Wpcl3 brRightDpcl3'>{ele?.Rate}</div>
                                                                                <div className='th3Wpcl3 brRightDpcl3'><b>{ele?.Amount}</b></div>
                                                                            </div>
                                                                        </>
                                                                    );
                                                                }

                                                            })

                                                        }
                                                    </div>
                                                    <div className='diamondValuepcl3 positionpcl3D' style={{ width: "264px", border: "1px solid #989898", backgroundColor: "#e8e8e8", borderBottom:"0px", borderRight:"0px", borderLeft:"0px" }}>
                                                        <div className='th3Wpcl3 brRightDpcl3'></div>
                                                        <div className='th3Wpcl3 brRightDpcl3'></div>
                                                        <div className='th3Wpcl3 brRightDpcl3'><b>{stpcs == '' ? '0' : stpcs}</b></div>
                                                        <div className='th3Wpcl3 brRightDpcl3'><b>{(stwt?.toFixed(3)) == '' ? '0' : (stwt?.toFixed(3))}</b></div>
                                                        <div className='th3Wpcl3 brRightDpcl3'></div>
                                                        <div className='th3Wpcl3 brRightDpcl3'><b>{stamt == '' ? '0' : stamt}</b></div>
                                                    </div>

                                                </div>
                                                <div className='labourPcl3 positionpcl3'>
                                                    <div className='th6flex2pcl3'>
                                                        <div className='th6Wpcl3 brRightDpcl3'>Labour</div>
                                                        <div className='th6Wpcl3 brRightDpcl3'>{e?.MaKingCharge_Unit}</div>
                                                        <div className='th6Wpcl3 brRightDpcl3'>{e?.MakingAmount}</div>
                                                    </div>
                                                    <div>
                                                        {
                                                            e?.OtherCharges?.length > 0 ? <div className='th6flex2pcl3'>
                                                                <div className='th6Wpcl3 brRightDpcl3'>Other Charges</div>
                                                                <div className='th6Wpcl3 brRightDpcl3'></div>
                                                                <div className='th6Wpcl3 brRightDpcl3'>{e?.OtherCharges}</div>
                                                            </div> : ''
                                                        }
                                                    </div>
                                                    <div className='th6flex2pcl3 positionpcl3D' style={{ backgroundColor: "#e8e8e8", border: "1px solid #989898", width: "149px", borderBottom:"0px", borderRight:"0px", borderLeft:"0px" }}>
                                                        <div className='th6Wpcl3 brRightDpcl3'></div>
                                                        <div className='th6Wpcl3 brRightDpcl3'></div>
                                                        <div className='th6Wpcl3 brRightDpcl3'><b>{totmakAmt}</b></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className='totalAndDiscountpcl3'>
                                                        <div className='th7pcl3ss'><b>{e?.TotalAmount?.toFixed(2)}</b></div>
                                                        <div className='th7pcl3Dis' style={{ backgroundColor: "#e8e8e8", border: "1px solid #989898", width: "68px", borderBottom:"0px", borderRight:"0px", borderLeft:"0px" }}><b>{e?.TotalAmount?.toFixed(2)}</b></div>
                                                    </div>

                                                </div>
                                            </div>
                                        </>
                                    );
                                })
                            }
                            <div className='pcl3TableCopyD'>
                                <div className='tableBodypcl3' style={{ backgroundColor: "#e8e8e8" }}>
                                    <div className='thDEpcl3'><b></b></div>
                                </div>

                                <div className='tableBodypcl3' style={{ backgroundColor: "#e8e8e8", borderBottom:"0px" }}>
                                    <div className='th2Dpcl3'>
                                        <div >TOTAL</div>
                                    </div>
                                </div>

                                <div className='diamondPcl3 positionpcl3'>
                                    <div className='diamondValuepcl3 positionpcl3D' style={{ backgroundColor: "#e8e8e8", border: "1px solid #989898", width: "264px", borderBottom:"0px", borderTop:"0px" }}>
                                        <div className='th3Wpcl3 brRightDpcl3'></div>
                                        <div className='th3Wpcl3 brRightDpcl3'></div>
                                        <div className='th3Wpcl3 brRightDpcl3'><b>{totalObj.totdiapcs}</b></div>
                                        <div className='th3Wpcl3 brRightDpcl3'><b>{totalObj.totdiawt.toFixed(3)}</b></div>
                                        <div className='th3Wpcl3 brRightDpcl3'></div>
                                        <div className='th3Wpcl3 brRightDpcl3'><b>{totalObj.totdiaamt.toFixed(3)}</b></div>
                                    </div>

                                </div>
                                <div className='metalPcl3 positionpcl3'>
                                    <div className='MetalPcl3 positionpcl3D' style={{ backgroundColor: "#e8e8e8", width: "200px", lineHeight: "10px", border: "1px solid #989898", borderBottom:"0px", borderTop:"0px", borderLeft:"0px" }}>
                                        <div className='th4Wpcl3 brRightDpcl3'></div>
                                        <div className='th4Wpcl3 brRightDpcl3'><b>{totalObj.totgrosswt?.toFixed(3)}</b></div>
                                        <div className='th4Wpcl3 brRightDpcl3'><b>{totalObj.totnetwt?.toFixed(3)}</b></div>
                                        <div className='th4Wpcl3 brRightDpcl3'></div>
                                        <div className='th4Wpcl3 brRightDpcl3'></div>
                                        <div className='th4Wpcl3 brRightDpcl3'><b>{totalObj.totmtamt.toFixed(3)}</b></div>
                                    </div>
                                </div>
                                <div className='diamondPcl3 positionpcl3'>
                                    <div className='diamondValuepcl3 positionpcl3D' style={{ backgroundColor: "#e8e8e8", width: "264px" }}>
                                        <div className='th3Wpcl3 brRightDpcl3'></div>
                                        <div className='th3Wpcl3 brRightDpcl3'></div>
                                        <div className='th3Wpcl3 brRightDpcl3'><b>{totalObj.totstpcs}</b></div>
                                        <div className='th3Wpcl3 brRightDpcl3'><b>{totalObj.totstwt.toFixed(3)}</b></div>
                                        <div className='th3Wpcl3 brRightDpcl3'></div>
                                        <div className='th3Wpcl3 brRightDpcl3'><b>{totalObj.totstamt.toFixed(3)}</b></div>
                                    </div>
                                </div>
                                <div className='labourPcl3'>
                                    <div className='th6flex2pcl3  ' style={{ backgroundColor: "#e8e8e8", width: "148px", height: "15pt" }}>
                                        <div className='th6Wpcl3 brRightDpcl3'></div>
                                        <div className='th6Wpcl3 brRightDpcl3'></div>
                                        <div className='th6Wpcl3 brRightDpcl3'><b>{totalObj.totmakingAmt}</b></div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <div className='th7Dpcl3' style={{ backgroundColor: "#e8e8e8", width: "69px", fontSize: "12px" }}><b>{totalObj.totalAmt}</b></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='sumarypcl3'>
                            <div className='amountSummarySectionpcl3'>
                                <div className='fapcl3'><div className='mrpWpcl3'>Total Discount</div><div className='mrpWpcl3'>{totalObj?.totDiscount}</div> </div>
                                <div className='fapcl3'><div className='mrpWpcl3'>Total Amount</div><div className='mrpWpcl3'>{(totalObj.totalAmt) - (totalObj?.totDiscount)}</div> </div>
                                <div className='fapcl3'><div className='mrpWpcl3'>CGST @ {headerData?.CGST}%</div><div className='mrpWpcl3'>{headerData?.TotalCGSTAmount} </div> </div>
                                <div className='fapcl3'><div className='mrpWpcl3'>SGST @ {headerData?.SGST}%</div><div className='mrpWpcl3'>{headerData?.TotalSGSTAmount}</div> </div>
                                <div className='fapcl3'><div className='mrpWpcl3'>Less </div><div className='mrpWpcl3'>{headerData?.AddLess}</div> </div>
                                <div className='fapcl3'><div className='mrpWpcl3'><b>Final Amount</b></div><div className='mrpWpcl3'><b>{(totalObj.totalAmt) - (totalObj?.totDiscount) + (headerData?.TotalCGSTAmount) + (headerData?.TotalSGSTAmount) + (headerData?.AddLess)}</b> </div> </div>
                            </div>
                        </div>
                        <div className='footerTotalpcl3'>
                            <div className='footerSummarypcl3'><div className='sumpcl3'>SUMMARY</div>
                                <div className='flexSumpcl3'>
                                    <div className='amountSummarySectionpcl3SUM'>
                                        <div className='fapcl3D'><div className='mrpWpcl3D textrightpcl3'><b>GOLD IN 24KT</b></div><div className='mrpWpcl3D textrightpcl3'>{totalObj.totfinewt} gm</div> </div>
                                        <div className='fapcl3D'><div className='mrpWpcl3D'><b>GROSS WT</b></div><div className='mrpWpcl3D'>{totalObj.totgrosswt?.toFixed(3)} gm</div> </div>
                                        <div className='fapcl3D'><div className='mrpWpcl3D'><b>NET WT</b></div><div className='mrpWpcl3D'>{totalObj.totnetwt?.toFixed(3)} gm</div> </div>
                                        <div className='fapcl3D'><div className='mrpWpcl3D'><b>LOSS WT</b></div><div className='mrpWpcl3D'>1,423.47 gm</div> </div>
                                        <div className='fapcl3D'><div className='mrpWpcl3D'><b>DIAMOND WT</b></div><div className='mrpWpcl3D'>{totalObj.totdiapcs}/{totalObj.totdiawt.toFixed(3)} cts</div> </div>
                                        <div className='fapcl3D'><div className='mrpWpcl3D'><b>STONE WT</b></div><div className='mrpWpcl3D'>{totalObj.totcspcs}/{totalObj.totcswt.toFixed(3)} cts</div></div>
                                        <div className='fapcl3D'><div className='mrpWpcl3D'><b>MISC WT</b></div><div className='mrpWpcl3D'>{totalObj.totmiscpcs}/{totalObj.totmiscwt.toFixed(3)} gm</div> </div>
                                        <div className='diaDetailpcl3' style={{ width: "186pt", height: "18pt" }}></div>
                                    </div>
                                    <div className='amountSummarySectionpcl3SUM'>
                                        <div className='fapcl3D'><div className='mrpWpcl3D'><b>GOLD</b></div><div className='mrpWpcl3D'>{totalObj.totmtamt.toFixed(3)}</div> </div>
                                        <div className='fapcl3D'><div className='mrpWpcl3D'><b>DIAMOND</b></div><div className='mrpWpcl3D'>{totalObj.totdiaamt?.toFixed(3)}</div> </div>
                                        <div className='fapcl3D'><div className='mrpWpcl3D'><b>CST</b></div><div className='mrpWpcl3D'>{totalObj.totcsamt?.toFixed(3)}</div></div>
                                        <div className='fapcl3D'><div className='mrpWpcl3D'><b>MISC</b></div><div className='mrpWpcl3D'>{totalObj.totmiscamt?.toFixed(3)}</div></div>
                                        <div className='fapcl3D'><div className='mrpWpcl3D'><b>MAKING</b></div><div className='mrpWpcl3D'>{totalObj.totmakingAmt?.toFixed(3)} </div> </div>
                                        <div className='fapcl3D'><div className='mrpWpcl3D'><b>OTHER</b></div><div className='mrpWpcl3D'>{totalObj.totOthAmt?.toFixed(3)}</div> </div>
                                        <div className='fapcl3D'><div className='mrpWpcl3D'><b>LESS</b></div><div className='mrpWpcl3D'>{headerData?.AddLess} </div> </div>
                                        <div className='fapcl3'><div className='mrpWpcl3 diaDetailpcl3' style={{ width: "182pt" }}><b>Total</b></div><div className='mrpWpcl3 diaDetailpcl3'><b>{(totalObj.totalAmt) - (totalObj?.totDiscount) + (headerData?.TotalCGSTAmount) + (headerData?.TotalSGSTAmount) + (headerData?.AddLess)}</b> </div> </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='diaDetailpcl3'>DIAMOND DETAILS</div>
                                <div className='amountSummarySectionpcl3DIAM'>
                                    {

                                        calculatedData?.length > 0 && calculatedData?.map((e, i) => {
                                            return (
                                                <>
                                                    <div className='fapcl3D' key={i}><div className='mrpWpcl3D'><b>{e?.ShapeName}</b></div><div className='mrpWpcl3D'>{e?.totalPcs?.toFixed(2)}/{e?.totalWt?.toFixed(3)}</div> </div>
                                                </>
                                            );
                                        })
                                    }
                                    <div className='diaDetailpcl3' style={{ height: "18pt" }}></div>
                                </div>
                            </div>
                            <div><div className='diaDetailpcl3'>OTHER DETAILS</div>
                                <div className='amountSummarySectionpcl3DIAM'>
                                    <div className='fapcl3D'><div className='mrpWpcl3D'><b>RATE IN 24KT</b></div><div className='mrpWpcl3D'>{headerData?.MetalRate24K?.toFixed(2)}</div> </div>
                                </div>
                            </div>
                            <div><div className='diaDetailpcl3'>REMARK</div>
                                <div className='amountSummarySectionpcl3DIAM'>
                                    <div className='fapcl3D'><div className='mrpWpcl3D'>{`${headerData?.Remark}`}</div>
                                    </div>
                                </div>
                            </div>
                            <div className='createdPcl3'><i>Created By</i></div>
                            <div className='createdPcl3'><i>Checked By</i></div>
                        </div>
                        <div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default PackingList3;