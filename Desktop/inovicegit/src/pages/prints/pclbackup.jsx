import React, { useEffect, useState } from 'react';
import orail from "../../assets/img/orail.png";
import "../../assets/css/prints/packinglist.css";
import Button from '../../GlobalFunctions/Button';
import axios from 'axios';
const PackingList = ({ urls, token, invoiceNo, printName }) => {

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
        // totlbramt:0,

    };
    let diamondList = [];
    let colorStoneList = [];
    let miscList = [];
    let metalList = [];
    let findingList = [];
    let stoneMiscList = [];

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
                setHeaderData(datas?.BillPrint_Json[0]);
                setDynamicList1(datas?.BillPrint_Json1);
                setDynamicList2(datas?.BillPrint_Json2);
            } else {
                // console.log(data?.data?.Status, data?.data?.Message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);
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
    const handleImageError = (e) => {
        e.target.src = "https://d12oja0ew7x0i8.cloudfront.net/images/Article_Images/ImageForArticle_19533_16006923254289023.png";
    };
    dynamicList1.map((e) => {
        // totalObj.totlbramt = totalObj.totlbramt + e?.MaKingCharge_Unit;
        totalObj.totalAmt = totalObj.totalAmt + e?.TotalAmount;
        totalObj.totmakingAmt = totalObj.totmakingAmt + e?.MakingAmount;
        totalObj.totDiscount = totalObj.totDiscount + e?.DiscountAmt;
        totalObj.totgrosswt = totalObj.totgrosswt + e?.grosswt;
        totalObj.totnetwt = totalObj.totnetwt + e?.NetWt;
        totalObj.totOthAmt = totalObj.totOthAmt + e?.OtherCharges + e?.MiscAmount;
    });
    // console.log("headerData", dynamicList1);

    // console.log("dynamicList2", totalObj.totOthAmt);

    return (
        <>
            <div className='btnpcl'>
                <Button />
            </div>
            <div className='pclprint pad_60_allPrint'>
                <div className='pclheader'>
                    <div className='orailpcl'><img src={headerData?.PrintLogo} alt="orail" id='orailpcl' /></div>
                    <div className='addresspcl'>{headerData?.CompanyAddress} {headerData?.CompanyAddress2} {headerData?.CompanyCity} - {headerData?.CompanyPinCode}</div>
                    <div className='pclheaderplist'>PACKING LIST</div>
                    <div><b style={{ fontSize: "12px" }}>{headerData?.PrintRemark}</b></div>
                </div>
                <div className='pclsubheader'>
                    <div className='partynamepcl'><b className='partypcl'>Party:</b><div className='contentpclparty'>{headerData?.customerfirmname}</div></div>
                    <div>
                        <div className='invnopcl'><div className='invnolabelpcl'>Invoice No: </div><b className='pclinvno'>{headerData?.InvoiceNo}</b></div>
                        <div className='invnopcl'><div className='invnolabelpcl'>Date: </div><b className='pclinvno'>{headerData?.EntryDate}</b></div>
                    </div>
                </div>
                <div className='pcltable'>
                    <div className='pcltablehead'>
                        <div className='srnopcl'>Sr No.</div>
                        <div className='jewelcodepcl'>Jewelcode</div>
                        <div className='diapclheader'>
                            <div className='diarowpcl'>Diamond</div>
                            <div className='diarowmaterialpcl'>
                                <div className='dia1pcl'>Shape</div>
                                <div className='dia1pcl'>Size</div>
                                <div className='dia1pcl'>Wt</div>
                                <div className='dia1pcl'>Rate</div>
                                <div className='dia1pcl'>Amount</div>
                            </div>
                        </div>
                        <div className='metalpclheader'>
                            <div className='diarowpcl'>Metal</div>
                            <div className='diarowmaterialpcl'>
                                <div className='dia1pcl'>Kt</div>
                                <div className='dia1pcl'>Gr Wt</div>
                                <div className='dia1pcl'>N + L</div>
                                <div className='dia1pcl'>Rate</div>
                                <div className='dia1pcl'>Amount</div>
                            </div>
                        </div>
                        <div className='stonepclheader'>
                            <div className='strowpcl'>Stone</div>
                            <div className='strowmaterialpcl'>
                                <div className='shppcl'>Shape</div>
                                <div className='shppcl'>Wt</div>
                                <div className='shppcl'>Rate</div>
                                <div className='shppcl'>Amount</div>
                            </div>
                        </div>
                        <div className='labourpclheader'>
                            <div className='lbrowpcl'>Labour</div>
                            <div className='labourrowmaerialpcl'>
                                <div className='lbrpcl'>Rate</div>
                                <div className='lbrpcl'>Amount</div>
                            </div>
                        </div>
                        <div className='otherpclheader'>
                            <div className='othrowpcl'>Other</div>
                            <div className='othermaterialpcl'>
                                <div className='othpcl'>Code</div>
                                <div className='othpcl'>Amount</div>
                            </div>
                        </div>
                        <div className='pricepclheader'>
                            <div className='pricerowpcl'>Price</div>
                        </div>
                    </div>
                    {
                        // Array.from({ length: 16 }, (_, index) => (
                        dynamicList1?.length > 0 && dynamicList1?.map((ele, i) => {

                            let diapcs = 0;
                            let diawt = 0;
                            let diarate = 0;
                            let diaamt = 0;
                            let mtpcs = 0;
                            let mtwt = 0;
                            let clswt = 0;
                            let clspcs = 0;
                            let clsrt = 0;
                            let clsamt = 0;
                            // let mtrate = 0;
                            let mtamt = 0;
                            let stpcs = 0;
                            let stwt = 0;
                            // let strate = 0;
                            let stamt = 0;
                            let totmakAmt = 0;
                            let lbramt = 0;
                            let othamt = 0;
                            totmakAmt = totmakAmt + ele?.MakingAmount;
                            lbramt = lbramt + ele?.MakingAmount;
                            othamt = othamt + ele?.OtherCharges + ele?.MiscAmount;
                            return (
                                <>
                                    <div className='pcltabletot'>
                                        <div className='pcltablebody' key={i} >
                                            <div className='srnopclbody'>{ele?.SrNo}</div>
                                            <div className='jewelcodepclbody'>
                                                <div className='designnojwpcl'>{ele?.SrJobno}</div>
                                                <div className='designimgpcl'><img src={ele?.DesignImage} alt='packinglist' onError={(e) => handleImageError(e)} id='designimgpclid' /></div>
                                                <div className='designnojwpcl'>certificateno</div>
                                            </div>
                                            {/* diamond */}
                                            <div className='diatotbodypcl' >
                                                <div className='diaentrypcl'>
                                                    {
                                                        diamondList?.map((e, i) => {
                                                            if (ele?.SrJobno == e?.StockBarcode) {
                                                                diapcs = diapcs + (+(e?.Pcs));
                                                                diawt = diawt + (+(e?.Wt));
                                                                diarate = diarate + (+(e?.Rate));
                                                                diaamt = diaamt + (+(e?.Amount));
                                                                return (
                                                                    <>
                                                                        <div className="lbrpclbody">
                                                                            <div className='othpclbody flexpcl' style={{ width: "56.5px", alignItems: "flex-start", paddingLeft: "1px" }}>{e?.ShapeName}</div>
                                                                            <div className='othpclbody flexpcl' style={{ width: "56.5px" }}>{e?.SizeName}</div>
                                                                            <div className='othpclbody flexpcl' style={{ width: "56.9px", alignItems: "flex-end", paddingRight: "1px" }}>{e?.Wt?.toFixed(3)}</div>
                                                                            <div className='othpclbody flexpcl' style={{ width: "56.5px", alignItems: "flex-end", paddingRight: "1px" }}>{e?.Rate?.toFixed(2)}</div>
                                                                            <div className='othpclbody flexpcl' style={{ borderRight: "0px", width: "56.5px", alignItems: "flex-end", paddingRight: "1px" }}>{e?.Amount?.toFixed(2)}</div>
                                                                        </div>
                                                                    </>
                                                                );
                                                            }
                                                        })
                                                    }
                                                    {/* <div className='stonepclemptyrow'>
                                                        <div className='othpclbody flexpcl' style={{ width: "60.7px" }}></div>
                                                        <div className='othpclbody flexpcl' style={{ width: "60.7px" }}></div>
                                                        <div className='othpclbody flexpcl' style={{ width: "60.7px" }}></div>
                                                        <div className='othpclbody flexpcl' style={{ width: "60.7px" }}></div>
                                                        <div className='othpclbody flexpcl' style={{ borderRight: "0px", width: "60.7px" }}></div></div> */}
                                                </div>
                                                {/* diamond total */}
                                                < div className='diarowmaterialpclbody' >
                                                    <div className='dia1pclbody bgpcl' ></div>
                                                    <div className='dia1pclbody bgpcl' ></div>
                                                    <div className='dia1pclbody bgpcl' >{diawt?.toFixed(3)}</div>
                                                    <div className='dia1pclbody bgpcl' ></div>
                                                    <div className='dia1pclbody bgpcl' >{diaamt?.toFixed(2)}</div>
                                                </div>

                                            </div>
                                            {/* metal */}
                                            <div className='diatotbodypcl'>
                                                <div className='metalpclheaderbody' style={{ borderBottom: "0px" }}>
                                                    {
                                                        metalList?.map((e, i) => {
                                                            if (ele?.SrJobno == e?.StockBarcode) {
                                                                mtpcs = mtpcs + (+(ele?.grosswt));
                                                                mtwt = mtwt + (+(ele?.NetWt));
                                                                mtamt = mtamt + (+(e?.Amount));
                                                                return (
                                                                    <>
                                                                        <div className="lbrpclbody">
                                                                            <div className='othpclbody flexpcl' style={{ width: "56.5px", alignItems: "flex-start", paddingLeft: "1px" }}>{e?.ShapeName} {e?.QualityName}</div>
                                                                            <div className='othpclbody flexpcl' style={{ width: "56.9px", alignItems: "flex-end", paddingRight: "1px" }}>{((+ele?.grosswt?.toFixed(3)) + (+ele?.LossWt?.toFixed(3)))?.toFixed(3)}</div>
                                                                            <div className='othpclbody flexpcl' style={{ width: "56.5px", alignItems: "flex-end", paddingRight: "1px" }}>{
                                                                                (
                                                                                    (+ele?.NetWt?.toFixed(3)) + (+ele?.LossWt?.toFixed(3))
                                                                                )?.toFixed(3)
                                                                            }</div>
                                                                            <div className='othpclbody flexpcl' style={{ width: "56.5px", alignItems: "flex-end", paddingRight: "1px" }}>{e?.Rate?.toFixed(2)}</div>
                                                                            <div className='othpclbody flexpcl' style={{ borderRight: "0px", width: "56.5px", alignItems: "flex-end", paddingRight: "1px" }}>{e?.Amount?.toFixed(2)}</div>
                                                                        </div>
                                                                    </>
                                                                );
                                                            }
                                                        })
                                                    }
                                                    {/* <div className='stonepclemptyrow'>
                                                        <div className='othpclbody flexpcl' style={{ width: "60.7px" }}></div>
                                                        <div className='othpclbody flexpcl' style={{ width: "60.7px" }}></div>
                                                        <div className='othpclbody flexpcl' style={{ width: "60.7px" }}></div>
                                                        <div className='othpclbody flexpcl' style={{ width: "60.7px" }}></div>
                                                        <div className='othpclbody flexpcl' style={{ borderRight: "0px", width: "60.7px" }}></div></div> */}
                                                </div>
                                                {/* metal total */}
                                                <div className='diarowmaterialpclbody' style={{ height: "15px", borderTop: "1px solid #989898" }}>
                                                    <div className='dia1pclbody bgpcl'></div>
                                                    <div className='dia1pclbody bgpcl'>{mtwt}</div>
                                                    <div className='dia1pclbody bgpcl'>{ }</div>
                                                    <div className='dia1pclbody bgpcl'></div>
                                                    <div className='dia1pclbody bgpcl'>{mtamt?.toFixed(2)}</div>
                                                </div>
                                            </div>
                                            {/* color stone */}
                                            <div className='stonetotpcl'>
                                                <div className='stonepclheaderbody'>
                                                    {
                                                        colorStoneList?.map((e, i) => {
                                                            if (ele?.SrJobno == e?.StockBarcode) {
                                                                clsamt = clsamt + e?.Amount;
                                                                clswt = clswt + e?.Wt;
                                                                clsrt = clsrt + e?.Rate;
                                                                clspcs = clspcs + e?.Pcs;
                                                                return (
                                                                    <>
                                                                        <div className='lbrpclbody'>
                                                                            <div className='othpclbody flexpcl' style={{ alignItems: "flex-start", paddingLeft: "1px", width: "58px" }}>{e?.ShapeName}</div>
                                                                            <div className='othpclbody flexpcl' style={{ alignItems: "flex-end", paddingRight: "1px" }}>{e?.Wt?.toFixed(3)}</div>
                                                                            <div className='othpclbody flexpcl' style={{ alignItems: "flex-end", paddingRight: "1px" }}>{e?.Rate?.toFixed(2)}</div>
                                                                            <div className='othpclbody flexpcl' style={{ borderRight: "0px", alignItems: "flex-end", paddingRight: "1px" }}>{e?.Amount?.toFixed(2)}</div>
                                                                        </div>
                                                                    </>
                                                                );
                                                            }
                                                        })
                                                    }
                                                    {/* <div className='stonepclemptyrow'>
                                                        <div className='brpclstn'></div>
                                                        <div className='brpclstn'></div>
                                                        <div className='brpclstn'></div>
                                                        <div className='brpclstn' style={{ borderRight: "0px" }}></div></div> */}
                                                </div>
                                                {/* color stone total */}
                                                <div className='strowmaterialpclbody' style={{ height: "16px" }}>
                                                    <div className='shppcl bgpcl' ></div>
                                                    <div className='shppcl bgpcl' >{clswt?.toFixed(3)}</div>
                                                    <div className='shppcl bgpcl' ></div>
                                                    <div className='shppcl bgpcl' >{clsamt?.toFixed(2)}</div>
                                                </div>

                                            </div>
                                            {/* labour charge */}
                                            <div className='labourtotpcl'>
                                                <div className='labourpclheaderbody'>
                                                    <div className='lbrpclbody'>
                                                        <div className='othpclbody flexpcl' style={{ alignItems: "flex-end", paddingRight: "1px" }}>{ele?.MaKingCharge_Unit?.toFixed(2)}</div>
                                                        <div className='othpclbody flexpcl' style={{ borderRight: "0px", alignItems: "flex-end", paddingRight: "1px" }}>{ele?.MakingAmount?.toFixed(2)}</div>
                                                    </div>
                                                    <div className='lbrpcl' style={{ width: "0px" }}></div>
                                                </div>
                                                {/* labour total */}
                                                <div className='labourrowmaerialpclbody'>
                                                    <div className='lbrpcl bgpcl' style={{ borderBottm: "1px" }}></div>
                                                    <div className='lbrpcl bgpcl' style={{ borderBottm: "1px" }}>{lbramt?.toFixed(2)}</div>
                                                </div>

                                            </div>
                                            <div className='labourtotpcl'>
                                                <div className='otherpclheaderbody'>
                                                    <div className='lbrpclbody'>
                                                        <div className='othpclbody flexpcl' style={{ width: "58.5px" }}>
                                                            {/* <p>Hallmark</p> */}
                                                        </div>
                                                        <div className='othpclbody flexpcl' style={{ borderRight: "0px", alignItems: "flex-end", paddingRight: "1px" }}>
                                                            <p>{ele?.OtherCharges?.toFixed(2)} </p> {ele?.MiscAmount === 0 ? '' : <p>{ele?.MiscAmount?.toFixed(2)}</p>}
                                                        </div>
                                                    </div>
                                                    <div className='lbrpcl' style={{ width: "0px" }}></div>
                                                </div>
                                                {/* other total */}
                                                <div className='othermaterialpclbody' >
                                                    <div className='othpclbody bgpcl' style={{ width: "58.5px" }}></div>
                                                    <div className='othpclbody bgpcl'>{othamt?.toFixed(2)}</div>
                                                </div>

                                            </div>
                                            <div className='labourtotpcl'>
                                                <div className='pricepclheaderbody'>
                                                    <div className='pricerowpclbody' style={{ alignItems: "flex-end", paddingRight: "1px" }}>{ele?.UnitCost?.toFixed(2)}</div>
                                                </div>
                                                <div className='pricerowpclbody bgpcl' style={{ height: "16px" }}>{ele?.UnitCost?.toFixed(2)}</div>
                                                {/* <div className='pricerowpclbody bgpcl' style={{ height: "15px" }}>{totalObj.totalAmt?.toFixed(2)}</div> */}
                                            </div>
                                        </div>
                                        <div className='rowtotalpcl'>
                                            <div className='srnorowtotpcl'></div>
                                            <div className='jewrowtotpcl'></div>
                                            <div className='diarowtotpcl'></div>
                                            <div className='metalrowtotpcl'></div>
                                            <div className='stonerowtotpcl'></div>
                                            {/* <div className='labourrowtotpcl' style={{ width: "230px", display: "flex", justifyContent: "space-around", alignItems: "center" }}><div>Discount {ele?.Discount}% @Total Amount</div><div>{(((ele?.UnitCost) * 5)/100)?.toFixed(2)}</div></div> */}
                                            <div className='labourrowtotpcl' style={{ width: "230px", height: "15px", alignItems: "center", justifyContent: "space-around" }}><div className='dispcl'>Discount {ele?.Discount}% @Total Amount</div><div className='dispcl' style={{ width: "59px", borderRight: "0px" }}>{ele?.DiscountAmt?.toFixed(2)}</div></div>
                                            <div className='pricerowtotpcl' style={{ width: "82px" }}>{ele?.TotalAmount?.toFixed(2)}</div>
                                        </div>
                                    </div>

                                </>
                            );
                        })

                        // ))
                    }
                    <div className='rowtotalpcl'>
                        <div className='srnorowtotpcl'></div>
                        <div className='jewrowtotpcl'>TOTAL</div>
                        <div className='diarowtotpcl'>
                            <div className='diaptotpcl'></div>
                            <div className='diaptotpcl'></div>
                            <div className='diaptotpcl'>{totalObj.totdiawt?.toFixed(3)}</div>
                            <div className='diaptotpcl'></div>
                            <div className='diaptotpcl' style={{ borderRight: "0px" }}>{totalObj?.totdiaamt?.toFixed(2)}</div>
                        </div>
                        <div className='metalrowtotpcl'>
                            <div className='diaptotpcl'></div>
                            <div className='diaptotpcl'>{totalObj.totgrosswt?.toFixed(3)}</div>
                            <div className='diaptotpcl'>{totalObj.totnetwt?.toFixed(3)}</div>
                            <div className='diaptotpcl'></div>
                            <div className='diaptotpcl' style={{borderRight:"0px"}}>{totalObj.totmtamt?.toFixed(2)}</div>
                        </div>
                        <div className='stonerowtotpcl'>
                            <div className='stnptotpcl'></div>
                            <div className='stnptotpcl'>{totalObj.totcswt?.toFixed(3)}</div>
                            <div className='stnptotpcl'></div>
                            <div className='stnptotpcl' style={{ borderRight: "0px" }}>{totalObj?.totcsamt?.toFixed(2)}</div>
                        </div>
                        <div className='labourrowtotpcl' style={{ width: "230px" }}>
                            <div className='lbrtotpcl'></div>
                            <div className='lbrtotpcl'>{totalObj.totmakingAmt}</div>
                            <div className='lbrtotpcl'></div>
                            <div className='lbrtotpcl' style={{ borderRight: "0px" }}>{totalObj?.totOthAmt?.toFixed(2)}</div>
                            {/* <div className='lbrtotpcl'>
                            </div>
                            <div className='labourrowtotpcl'>
                                <div className='othtotcl'>{totalObj.totmakingAmt}</div>
                                </div> */}
                        </div>
                        <div className='pricerowtotpcl'>{totalObj.totalAmt?.toFixed(2)}</div>
                    </div>
                    <div className='pclsummary'>
                        <div className='totdispcl'>
                            <p>Total Discount</p><p>{totalObj?.totDiscount?.toFixed(2)}</p>
                        </div>
                        <div className='totdispcl'>
                            <p>CGST @ {headerData?.CGST?.toFixed(2)}%	</p><p>{headerData?.TotalCGSTAmount?.toFixed(2)}</p>
                        </div>
                        <div className='totdispcl'>
                            <p>SGST @ {headerData?.SGST?.toFixed(2)}%	</p><p>{headerData?.TotalSGSTAmount?.toFixed(2)}</p>
                        </div>
                        <div className='totdispcl'>
                            <p>Less	</p><p>{headerData?.AddLess?.toFixed(2)}</p>
                        </div>
                        <div className='totdispcl'>
                            <p>Grand Total</p><p>{((totalObj.totalAmt) + (headerData?.TotalCGSTAmount) + (headerData?.TotalSGSTAmount) + (headerData?.AddLess))?.toFixed(2)} </p>
                        </div>
                    </div>
                </div >

            </div >

        </>
    );
};

export default PackingList;