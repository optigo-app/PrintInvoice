import React, { useEffect, useState } from 'react';
import "../assets/css/miscPrint1.css";
import { apiCall, handlePrint } from '../GlobalFunctions';
import Loader from '../components/Loader';

const MiscPrint1 = ({ urls, token, invoiceNo, printName }) => {

    const [primary, setPrimary] = useState({});
    const [jsonData, setJsonData] = useState([]);
    const [total, setTotal] = useState({});
    const [loader, setLoader] = useState(true);
    const [materialNames, setMaterialNames] = useState([]);
    const [totalItems, setTotalItems] = useState([]);

    const loadData = (datas) => {
        setPrimary(datas?.BillPrint_Json[0]);
        let resultData = [];
        let total = {
            grsWt: 0,
            netWt: 0,
            Kund: {
                weight: 2.1,
                pcs: 5,
                Rate: 0
            },
            Moti: {
                weight: 0,
                pcs: 0,
                Rate: 0,
            },
            Bmoti: {
                weight: 0,
                pcs: 0,
                Rate: 0,
            },
            MOPs: {
                weight: 0,
                pcs: 0,
                Rate: 0,
            },
            Stone: {
                weight: 0,
                pcs: 0,
                Rate: 0,
            },
            Mina: {
                weight: 0,
                pcs: 0,
                Rate: 0,
            },
            Bandai: {
                weight: 0,
                pcs: 0,
                Rate: 0,
            },
            fineWeight: 0,
            amount: 0,
            MetalPriceRatio: 0,
            Wastage: 0,
            lessWeight: 0,
        }
        let materialName = [];
        datas?.BillPrint_Json1.forEach((e, i) => {
            let Kund = {
                weight: 0,
                pcs: 0,
                Rate: 0,
            }
            let Moti = {
                weight: 0,
                pcs: 0,
                Rate: 0,
            }
            let Bmoti = {
                weight: 0,
                pcs: 0,
                Rate: 0,
            }
            let MOPs = {
                weight: 0,
                pcs: 0,
                Rate: 0,
            }
            let Stone = {
                weight: 0,
                pcs: 0,
                Rate: 0,
            }
            let Mina = {
                weight: 0,
                pcs: 0,
                Rate: 0,
            }
            let Bandai = {
                weight: 0,
                pcs: 0,
                Rate: 0,
            }
            let fineWeight = 0;
            let lessWeight = 0;
            let amount = 0;
            total.grsWt += e?.grosswt;
            total.netWt += e?.NetWt;
            total.MetalPriceRatio += e?.MetalPriceRatio;
            total.Wastage += e?.Wastage;
            let arr = [];
            total.amount += e?.TotalAmount;
            let materialMiscs = [];
            datas?.BillPrint_Json2.forEach((ele, ind) => {
                if (e.SrJobno === ele.StockBarcode) {
                    if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
                        if (ele?.ShapeName === "KUNDAN") {
                            Kund.weight += ele?.Wt;
                            lessWeight += +((ele?.Wt).toFixed(2));
                            total.lessWeight += +((ele?.Wt).toFixed(2));
                            Kund.pcs += ele?.Pcs;
                            Kund.Rate += ele?.Rate;
                            total.Kund.weight += ele?.Wt;
                            total.Kund.pcs += ele?.Pcs;
                            total.Kund.Rate += ele?.Rate;
                            arr.push(ele);
                        }
                        else if (ele?.ShapeName === "MOTI") {
                            Moti.weight += ele?.Wt;
                            lessWeight += +((ele?.Wt).toFixed(2));
                            total.lessWeight += +((ele?.Wt).toFixed(2));
                            Moti.pcs += ele?.Pcs;
                            Moti.Rate += ele?.Rate;
                            total.Moti.weight += ele?.Wt;
                            total.Moti.pcs += ele?.Pcs;
                            total.Moti.Rate += ele?.Rate;
                            arr.push(ele);
                        }
                        else if (ele?.ShapeName === "BMoti") {
                            Bmoti.weight += ele?.Wt;
                            lessWeight += +((ele?.Wt).toFixed(2));
                            total.lessWeight += +((ele?.Wt).toFixed(2));
                            Bmoti.pcs += ele?.Pcs;
                            Bmoti.Rate += ele?.Rate;
                            total.Bmoti.weight += ele?.Wt;
                            total.Bmoti.pcs += ele?.Pcs;
                            total.Bmoti.Rate += ele?.Rate;
                            arr.push(ele);
                        }
                        else if (ele?.ShapeName === "MOP") {
                            MOPs.weight += ele?.Wt;
                            lessWeight += +((ele?.Wt).toFixed(2));
                            total.lessWeight += +((ele?.Wt).toFixed(2));
                            MOPs.pcs += ele?.Pcs;
                            MOPs.Rate += ele?.Rate;
                            total.MOPs.weight += ele?.Wt;
                            total.MOPs.pcs += ele?.Pcs;
                            total.MOPs.Rate += ele?.Rate;
                            arr.push(ele);
                        }
                        else if (ele?.ShapeName === "STONE") {
                            Stone.weight += ele?.Wt;
                            lessWeight += +((ele?.Wt).toFixed(2));
                            total.lessWeight += +((ele?.Wt).toFixed(2));
                            Stone.pcs += ele?.Pcs;
                            Stone.Rate += ele?.Rate;
                            total.Stone.weight += ele?.Wt;
                            total.Stone.pcs += ele?.Pcs;
                            total.Stone.Rate += ele?.Rate;
                            arr.push(ele);
                        }
                        else if (ele?.ShapeName === "Mina") {
                            Mina.weight += ele?.Wt;
                            lessWeight += +((ele?.Wt).toFixed(2));
                            total.lessWeight += +((ele?.Wt).toFixed(2));
                            Mina.pcs += ele?.Pcs;
                            Mina.Rate += ele?.Rate;
                            total.Mina.weight += ele?.Wt;
                            total.Mina.pcs += ele?.Pcs;
                            total.Mina.Rate += ele?.Rate;
                            arr.push(ele);
                        }
                        else if (ele?.ShapeName === "Bandai") {
                            Bandai.weight += ele?.Wt;
                            lessWeight += +((ele?.Wt).toFixed(2));
                            total.lessWeight += +((ele?.Wt).toFixed(2));
                            Bandai.pcs += ele?.Pcs;
                            Bandai.Rate += ele?.Rate;
                            total.Bandai.weight += ele?.Wt;
                            total.Bandai.pcs += ele?.Pcs;
                            total.Bandai.Rate += ele?.Rate;
                            arr.push(ele);
                        }
                        let findIndex = materialMiscs.findIndex((elem => elem.ShapeName === ele.ShapeName));
                        if (findIndex === -1) {
                            materialMiscs.push(ele);
                        } else {
                            materialMiscs[findIndex].Wt += ele?.Wt;
                            materialMiscs[findIndex].Pcs += ele?.Pcs;
                            materialMiscs[findIndex].Rate += ele?.Rate;
                        }
                        if (materialName.length === 0) {
                            materialName.push({ name: ele?.ShapeName });
                        } else {
                            if (materialName.length < 8) {
                                let findName = materialName.findIndex((el => el.name === ele?.ShapeName));
                                if (findName === -1) {
                                    materialName.push({ name: ele?.ShapeName });
                                }
                            }
                        }
                        fineWeight += ele?.FineWt;
                        amount += ele?.Amount;
                        total.fineWeight += ele?.FineWt;
                    }
                }
            });
            let obj = { ...e };
            obj.Kund = Kund;
            obj.Moti = Moti;
            obj.Bmoti = Bmoti;
            obj.MOPs = MOPs;
            obj.Stone = Stone;
            obj.Mina = Mina;
            obj.Bandai = Bandai;
            obj.fineWeight = fineWeight;
            obj.amount = amount;
            obj.lessWeight = lessWeight;
            obj.materialMiscs = materialMiscs;
            resultData.push(obj);
        });
        let totals = [];
        materialName.forEach((e, i) => {
            totals.push({ name: e?.name, Wt: 0, Pcs: 0, Rate: 0 });
        });
        materialName.forEach((e, i) => {
            resultData.forEach((ele, ind) => {
                ele?.materialMiscs.forEach((elem, index) => {
                    if (e?.name === elem?.ShapeName) {
                        let findIndex = totals.findIndex(elle => elle.name === elem?.ShapeName);
                        totals[findIndex].Wt += elem.Wt;
                        totals[findIndex].Pcs += elem.Pcs;
                        totals[findIndex].Rate += elem.Rate;
                    }
                });
            });
        });
        console.log(totals);
        setTotalItems(totals);
        setMaterialNames(materialName);
        setJsonData(resultData);
        total.lessWeight = (total?.lessWeight).toFixed(2);
        setTotal(total);
    }

    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls);
                loadData(data);
                setLoader(false);
            } catch (error) {
                console.error(error);
            }
        }
        sendData();
    }, []);

    return (
        <>
            {loader ? <Loader /> : <div className='container_Misc_1 pt-4'>
                <div className="printBtn_sec text-end">
                    <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                </div>
                <div className="header_misc_1 mt-4 border d-flex justify-content-between">
                    <div className='p-2 fs-4 fw-bold'>
                        Customer Name: {primary?.CustName}
                    </div>
                    <div className="p-2 text-end ">
                        <p className='fs-4 fw-bold'><span className='fs-4 
                    fw-normal'>Invoice:</span> {primary?.InvoiceNo}</p>
                        <p className='fs-4 fw-bold'><span className='fs-4 
                    fw-normal'>Date:</span> {primary?.EntryDate}</p>
                    </div>
                </div>
                <div className="d-flex border-bottom border-start border-end">
                    <div className="regNoMiscPrint1 border-end p-1 fw-bold">Reg. No.</div>
                    <div className="discriptionMisc1 border-end p-1 fw-bold">Description</div>
                    <div className="grsWtMisc1 border-end p-1 text-end">
                        <p className='fw-bold'>Grs Wt</p>
                        <p className='fw-bold'>Net Wt</p>
                    </div>
                    <div className="">
                        <div className="stoneDetailsMisc1 border-bottom p-1 text-center fs-4 fw-bold border-end">Stone Details</div>
                        <div className="d-flex">
                            {materialNames.length > 0 && materialNames.map((e, i) => {
                                return <div className={`text-end kundMisc1 border-end p-1 fw-bold`} key={i}>{e?.name}</div>
                            })}
                            {materialNames.length < 8 && Array.from({ length: 8 - materialNames.length }, (_, index) => {
                                return <div className={`text-end kundMisc1 border-end p-1 fw-bold`} key={index}></div>
                            })}
                        </div>
                    </div>
                    <div className="lessWtMisc1 border-end p-1 fw-bold text-end">Less Wt.</div>
                    <div className="mperMisc1 border-end p-1 text-center">
                        <p className='fw-bold text-end'>M%</p>
                        <p className='fw-bold text-end'>w%</p>
                    </div>
                    <div className="fineMisc1 border-end p-1 text-end"><p className='fw-bold'>Fine Wt</p></div>
                    <div className="Amount p-1 text-end fw-bold">Amount</div>
                </div>
                {jsonData.length > 0 && jsonData.map((e, i) => {
                    return <div className="d-flex border-bottom border-start border-end" key={i}>
                        <div className="regNoMiscPrint1 p-1 border-end text-end">{e?.SrJobno}</div>
                        <div className="discriptionMisc1 border-end p-1 height53Misc1"><p className='fs-4'>{e?.SubCategoryname}</p></div>
                        <div className="grsWtMisc1 border-end p-1 text-end height53Misc1">
                            <p className='fs-4'>{e?.grosswt}</p>
                            <p className='fs-4'>{e?.NetWt}</p>
                        </div>
                        <div>
                            <div className="d-flex height53Misc1">
                                {materialNames.length > 0 && materialNames.map((ele, i) => {
                                    const findMaterial = e?.materialMiscs.find(elem => ele?.name === elem?.ShapeName);
                                    return findMaterial ? <div className="w-100 text-end kundMisc1 border-end p-1" key={i}>
                                        <p className='lh-1 fs-4'>{findMaterial?.Wt}</p>
                                        <p className='lh-1 fs-4'>{findMaterial?.Pcs}</p>
                                    </div> : <div className="w-100 text-end kundMisc1 border-end p-1" key={i}>
                                        <p className='lh-1 fs-4'></p>
                                        <p className='lh-1 fs-4'></p>
                                    </div>
                                })}
                                {materialNames.length < 8 && Array.from({ length: 8 - materialNames.length }, (_, index) => {
                                    return <div className="w-100 text-end kundMisc1 border-end p-1" key={index}>
                                        <p className='lh-1 fs-4'></p>
                                        <p className='lh-1 fs-4'></p>
                                        <p className='lh-1 fs-4'></p>
                                    </div>
                                })}
                            </div>
                        </div>
                        <div className="lessWtMisc1 border-end p-1 height53Misc1 text-end">{e?.lessWeight}</div>
                        <div className="mperMisc1 border-end p-1 text-center height53Misc1">
                            <p className='text-end'>{e?.MetalPriceRatio}</p>
                            <p className='text-end'>{e?.Wastage}</p>
                        </div>
                        <div className="fineMisc1 border-end p-1 text-end height53Misc1 text-end">{e?.fineWeight}</div>
                        <div className="Amount p-1 text-end height53Misc1 text-end">{e?.TotalAmount}</div>
                    </div>
                })}
                <div className="d-flex border-bottom border-start border-end">
                    <div className="regNoMiscPrint1 p-1 border-end text-end">{jsonData?.length}</div>
                    <div className="discriptionMisc1 border-end p-1 fw-bold height53Misc1">TOTAL</div>
                    <div className="grsWtMisc1 border-end p-1 text-end height53Misc1">
                        <p className='fw-bold fs-4'>{total?.grsWt}</p>
                        <p className='fw-bold fs-4'>{total?.netWt}</p>
                    </div>
                    <div>
                        <div className="d-flex">
                            {materialNames.length > 0 && materialNames.map((ele, i) => {
                                const findMaterial = totalItems.find(elem => ele?.name === elem?.name);
                                return findMaterial ? <div className="w-100 text-end kundMisc1 border-end p-1" key={i}>
                                    <p className='lh-1 fs-4'>{findMaterial?.Wt}</p>
                                    <p className='lh-1 fs-4'>{findMaterial?.Pcs}</p>
                                </div> : <div className="w-100 text-end kundMisc1 border-end p-1" key={i}>
                                    <p className='lh-1 fs-4'></p>
                                    <p className='lh-1 fs-4'></p>
                                </div>
                            })}
                             {materialNames.length < 8 && Array.from({ length: 8 - materialNames.length }, (_, index) => {
                                    return <div className="w-100 text-end kundMisc1 border-end p-1" key={index}>
                                        <p className='lh-1 fs-4'></p>
                                        <p className='lh-1 fs-4'></p>
                                    </div>
                                })}
                        </div>
                    </div>
                    <div className="lessWtMisc1 border-end p-1 fw-bold height53Misc1 text-end">{total?.lessWeight}</div>
                    <div className="mperMisc1 border-end p-1 text-center height53Misc1">
                        <p className='fw-bold text-end'>{total?.MetalPriceRatio}</p>
                        <p className='fw-bold text-end'>{total?.Wastage}</p>
                    </div>
                    <div className="fineMisc1 border-end p-1 text-end height53Misc1"><p className='fw-bold text-end'>{total?.fineWeight}</p></div>
                    <div className="Amount p-1 text-end fw-bold height53Misc1 text-end">{total?.amount}</div>
                </div>
            </div>}
        </>
    )
}

export default MiscPrint1