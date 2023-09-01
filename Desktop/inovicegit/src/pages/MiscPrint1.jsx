import React, { useEffect, useState } from 'react';
import "../assets/css/miscPrint1.css";
import { apiCall, handlePrint } from '../GlobalFunctions';
import Loader from '../components/Loader';

const MiscPrint1 = ({ urls, token, invoiceNo, printName }) => {

    const [primary, setPrimary] = useState({});
    const [jsonData, setJsonData] = useState([]);
    const [total, setTotal] = useState({});
    const [loader, setLoader] = useState(true);

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
            resultData.push(obj);
        });
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
       {loader ? <Loader /> :  <div className='container_Misc_1 pt-4'>
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
                <div className="discriptionMisc1 border-end p-1 fw-bold">Description</div>
                <div className="grsWtMisc1 border-end p-1 text-end">
                    <p className='fw-bold'>Grs Wt</p>
                    <p className='fw-bold'>Net Wt</p>
                </div>
                <div className=" border-end">
                    <div className="stoneDetailsMisc1 border-bottom p-1 text-center fs-4 fw-bold">Stone Details</div>
                    <div className="d-flex">
                        <div className="text-end kundMisc1 border-end p-1 fw-bold">Kund</div>
                        <div className="text-end motiMisc1 border-end p-1 fw-bold">Moti</div>
                        <div className="text-end bmotiMisc1 border-end p-1 fw-bold">Bmoti</div>
                        <div className="text-end mopMisc1 border-end p-1 fw-bold">MOP</div>
                        <div className="text-end stoneMisc1 border-end p-1 fw-bold">STONE</div>
                        <div className="text-end minaMisc1 border-end p-1 fw-bold">Mina</div>
                        <div className="text-end bandaiMisc1 p-1 fw-bold">Bandai</div>
                    </div>
                </div>
                <div className="lessWtMisc1 border-end p-1 fw-bold text-end">Less Wt.</div>
                <div className="mperMisc1 border-end p-1 text-center">
                    <p className='fw-bold'>M%</p>
                    <p className='fw-bold'>w%</p>
                </div>
                <div className="fineMisc1 border-end p-1 text-end"><p className='fw-bold'>Fine Wt</p></div>
                <div className="Amount p-1 text-end fw-bold">Amount</div>
            </div>
            {jsonData.length > 0 && jsonData.map((e, i) => {
                return <div className="d-flex border-bottom border-start border-end" key={i}>
                    <div className="discriptionMisc1 border-end p-1 height53Misc1"><p className='fs-4'>{e?.SubCategoryname}</p></div>
                    <div className="grsWtMisc1 border-end p-1 text-end height53Misc1">
                        <p className='fs-4'>{e?.grosswt}</p>
                        <p className='fs-4'>{e?.NetWt}</p>
                    </div>
                    <div className=" border-end">
                        <div className="d-flex height53Misc1">
                            <div className="w-100 text-end kundMisc1 border-end p-1">
                                <p className='lh-1 fs-4'>{e?.Kund?.weight}</p>
                                <p className='lh-1 fs-4'>{e?.Kund?.pcs}</p>
                                <p className='lh-1 fs-4'>{e?.Kund?.Rate}</p>
                            </div>
                            <div className="w-100 text-end motiMisc1 border-end p-1">
                                <p className='lh-1 fs-4'>{e?.Moti?.weight}</p>
                                <p className='lh-1 fs-4'>{e?.Moti?.pcs}</p>
                                <p className='lh-1 fs-4'>{e?.Moti?.Rate}</p>
                            </div>
                            <div className="w-100 text-end bmotiMisc1 border-end p-1">
                                <p className='lh-1 fs-4'>{e?.Bmoti?.weight}</p>
                                <p className='lh-1 fs-4'>{e?.Bmoti?.pcs}</p>
                                <p className='lh-1 fs-4'>{e?.Bmoti?.Rate}</p>
                            </div>
                            <div className="w-100 text-end mopMisc1 border-end p-1">
                                <p className='lh-1 fs-4'>{e?.MOPs?.weight}</p>
                                <p className='lh-1 fs-4'>{e?.MOPs?.pcs}</p>
                                <p className='lh-1 fs-4'>{e?.MOPs?.Rate}</p>
                            </div>
                            <div className="w-100 text-end stoneMisc1 border-end p-1">
                                <p className='lh-1 fs-4'>{e?.Stone?.weight}</p>
                                <p className='lh-1 fs-4'>{e?.Stone?.pcs}</p>
                                <p className='lh-1 fs-4'>{e?.Stone?.Rate}</p>
                            </div>
                            <div className="w-100 text-end minaMisc1 border-end p-1">
                                <p className='lh-1 fs-4'>{e?.Mina?.weight}</p>
                                <p className='lh-1 fs-4'>{e?.Mina?.pcs}</p>
                                <p className='lh-1 fs-4'>{e?.Mina?.Rate}</p>
                            </div>
                            <div className="w-100 text-end bandaiMisc1 p-1">
                                <p className='lh-1 fs-4'>{e?.Bandai?.weight}</p>
                                <p className='lh-1 fs-4'>{e?.Bandai?.pcs}</p>
                                <p className='lh-1 fs-4'>{e?.Bandai?.Rate}</p>
                            </div>
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
                <div className="discriptionMisc1 border-end p-1 fw-bold height53Misc1">TOTAL</div>
                <div className="grsWtMisc1 border-end p-1 text-end height53Misc1">
                    <p className='fw-bold fs-4'>{total?.grsWt}</p>
                    <p className='fw-bold fs-4'>{total?.netWt}</p>
                </div>
                <div className=" border-end">
                    <div className="d-flex">
                        <div className="text-end kundMisc1 border-end p-1 fw-bold height53Misc1">
                            <p className='fw-bold lh-1 fs-4'>{total?.Kund?.weight}</p>
                            <p className='fw-bold lh-1 fs-4'>{total?.Kund?.pcs}</p>
                            <p className='fw-bold lh-1 fs-4'>{total?.Kund?.Rate}</p>
                        </div>
                        <div className="text-end motiMisc1 border-end p-1 fw-bold height53Misc1">
                            <p className='fw-bold lh-1 fs-4'>{total?.Moti?.weight}</p>
                            <p className='fw-bold lh-1 fs-4'>{total?.Moti?.pcs}</p>
                            <p className='fw-bold lh-1 fs-4'>{total?.Moti?.Rate}</p>
                        </div>
                        <div className="text-end bmotiMisc1 border-end p-1 fw-bold height53Misc1">
                            <p className='fw-bold lh-1 fs-4'>{total?.Bmoti?.weight}</p>
                            <p className='fw-bold lh-1 fs-4'>{total?.Bmoti?.pcs}</p>
                            <p className='fw-bold lh-1 fs-4'>{total?.Bmoti?.Rate}</p>
                        </div>
                        <div className="text-end mopMisc1 border-end p-1 fw-bold height53Misc1">
                            <p className='fw-bold lh-1 fs-4'>{total?.MOPs?.weight}</p>
                            <p className='fw-bold lh-1 fs-4'>{total?.MOPs?.pcs}</p>
                            <p className='fw-bold lh-1 fs-4'>{total?.MOPs?.Rate}</p>
                        </div>
                        <div className="text-end stoneMisc1 border-end p-1 fw-bold height53Misc1">
                            <p className='fw-bold lh-1 fs-4'>{total?.Stone?.weight}</p>
                            <p className='fw-bold lh-1 fs-4'>{total?.Stone?.pcs}</p>
                            <p className='fw-bold lh-1 fs-4'>{total?.Stone?.Rate}</p>
                        </div>
                        <div className="text-end minaMisc1 border-end p-1 fw-bold height53Misc1">
                            <p className='fw-bold lh-1 fs-4'>{total?.Mina?.weight}</p>
                            <p className='fw-bold lh-1 fs-4'>{total?.Mina?.pcs}</p>
                            <p className='fw-bold lh-1 fs-4'>{total?.Mina?.Rate}</p>
                        </div>
                        <div className="text-end bandaiMisc1 p-1 fw-bold height53Misc1">
                            <p className='fw-bold lh-1 fs-4'>{total?.Bandai?.weight}</p>
                            <p className='fw-bold lh-1 fs-4'>{total?.Bandai?.pcs}</p>
                            <p className='fw-bold lh-1 fs-4'>{total?.Bandai?.Rate}</p>
                        </div>
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