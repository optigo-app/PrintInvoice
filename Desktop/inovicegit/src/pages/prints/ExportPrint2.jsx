import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/exportPrint2.module.css";
import { NumberWithCommas, apiCall, fixedValues, handlePrint, isObjectEmpty, numberToWord } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import lodash from 'lodash';

const ExportPrint2 = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [data, setData] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const [msg, setMsg] = useState("");

    const loadData = (data) => {
        // setData(arr);
        let datas = OrganizeDataPrint(
            data?.BillPrint_Json[0],
            data?.BillPrint_Json1,
            data?.BillPrint_Json2
        );
        setHeaderData(data?.BillPrint_Json[0]);

        // Your array
        // let dataArray = lodash.cloneDeep(datas?.resultArray);
        let dataArray = [];

        // Grouping based on "MetalTypePurity" and "lossWt"
        // const groupedData = dataArray.reduce((groups, item) => {
        //     const key = `${item.MetalTypePurity}_${item.LossPer}`;
        //     (groups[key] = groups[key] || []).push(item);
        //     return groups;
        // }, {});
        // console.log(groupedData);

        // Calculate totals for each group
        // const groupTotals = Object.keys(groupedData).map(groupKey => {
        //     const group = groupedData[groupKey];
        //     // const totalAmount = calculateGroupTotal(group);
        //         console.log(group);
        //     return {
        //         Quantity: group[0].Quantity,
        //         MetalTypePurity: group[0].MetalTypePurity,
        //         LossWt: group[0].LossWt,
        //         TotalAmount: group[0].TotalAmount,
        //         grosswt: group[0].grosswt,
        //         NetWt: group[0].NetWt,
        //         TotalWt: group[0].NetWt + group[0].LossWt,
        //     };
        // });
        datas.resultArray.forEach((e, i) => {
            let findPurPer = dataArray.findIndex((ele, ind) => ele?.MetalTypePurity === e?.MetalTypePurity && ele?.LossPer === e?.LossPer);
            let findMetalAmount = e?.metal?.find((elem, index) => elem?.IsPrimaryMetal === 1)?.Amount;
            let findMetalRate = e?.metal?.find((elem, index) => elem?.IsPrimaryMetal === 1)?.Rate;
            let obj = lodash.cloneDeep(e);
            obj.metalRate = findMetalRate;
            obj.metalAmount = findMetalAmount;
            if (findPurPer === -1) {
                dataArray.push({
                    MetalTypePurity: e?.MetalTypePurity,
                    LossPer: e?.LossPer,
                    MetalType: e?.MetalType,
                    row: [obj],
                    total: {
                        grosswt: e?.grosswt,
                        NetWt: e?.NetWt,
                        LossWt: e?.LossWt,
                        Quantity: e?.Quantity,
                        LossPer: e?.LossPer,
                        totalWt: e?.NetWt + e?.LossWt,
                        metalAmount: findMetalAmount,
                        diaCsPcs: e?.totals?.diamonds?.Pcs + e?.totals?.colorstone?.Pcs,
                        diaCsWt: e?.totals?.diamonds?.Wt + e?.totals?.colorstone?.Wt,
                        diaCsAmount: e?.totals?.diamonds?.Wt + e?.totals?.colorstone?.Wt
                    }
                });
            } else {
                dataArray[findPurPer].row.push(e);
                dataArray[findPurPer].total.grosswt += e?.grosswt;
                dataArray[findPurPer].total.NetWt += e?.NetWt;
                dataArray[findPurPer].total.LossWt += e?.LossWt;
                dataArray[findPurPer].total.LossPer += e?.LossPer;
                dataArray[findPurPer].total.Quantity += e?.Quantity;
                dataArray[findPurPer].total.totalWt += e?.NetWt + e?.LossWt;
                dataArray[findPurPer].total.metalAmount += findMetalAmount;
                dataArray[findPurPer].total.diaCsPcs += e?.totals?.diamonds?.Pcs + e?.totals?.colorstone?.Pcs;
                dataArray[findPurPer].total.diaCsWt += e?.totals?.diamonds?.Wt + e?.totals?.colorstone?.Wt;
                dataArray[findPurPer].total.diaCsAmount += e?.totals?.diamonds?.Wt + e?.totals?.colorstone?.Wt;
            }
        });
        setData(dataArray);
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
        loader ? <Loader /> : msg === "" ? <div className={`container max_width_container pad_60_allPrint mt-2 ${style?.exportprint2}`}>
            {/* print button */}
            <div className={`d-flex justify-content-end mb-4 align-items-center ${style?.print_sec_sum4} pt-4 pb-4`}>
                <div className="form-check ps-3 mt-2">
                    <input
                        type="button"
                        className="btn_white blue"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            {/* company address */}
            <div className='pb-2'>
                <p className="fs-6 fw-semibold">SEZ RULE NO. 46(2)</p>
                <p className="fs-6 fw-semibold py-1">{headerData?.customerfirmname}</p>
                <p className='fw-bold'>{headerData?.customerAddress1}</p>
                <p className='fw-bold'>{headerData?.customerAddress2}</p>
                <p className='fw-bold'>{headerData?.customerAddress3}</p>
                <p className='fw-bold'>{headerData?.customercity}{headerData?.customerpincode}, {headerData?.customercountry}</p>
            </div>
            {/* table title */}
            <p className="fw-semibold text-center border border-black p-1">VALUE ADDITION</p>
            <div className="d-flex border-start border-end border-bottom p-1 border-black">
                <div className="col-3 px-1">
                    <p className="fw-bold"> Inv Exp No: {headerData?.InvoiceNo}</p>
                </div>
                <div className="col-3 px-1">
                    <p className="fw-bold"> Dated: {headerData?.EntryDate}</p>
                </div>
                <div className="col-3 px-1">
                    <p className="fw-bold"> EDF No:</p>
                </div>
                <div className="col-3 px-1">
                    <p className="fw-bold">Dated: {headerData?.DueDate}</p>
                </div>
            </div>
            <div className="d-flex border-start border-end border-bottom border-black">
                <div className={`${style?.des} border-end border-black`}>
                    <div className="d-grid h-100">
                        <div className='d-flex border-bottom border-black justify-content-center align-items-center'></div>
                        <div className='d-flex'>
                            <div className="col-2 p-1 fw-bold border-end border-black d-flex justify-content-center align-items-center"><p className="text-center">Sr. No.</p></div>
                            <div className="col-8 p-1 fw-bold border-end border-black d-flex justify-content-center align-items-center"><p className="text-center">Description</p></div>
                            <div className="col-2 p-1 fw-bold d-flex justify-content-center align-items-center"><p className="text-center">Qty</p></div>
                        </div>
                    </div>
                </div>
                <div className={`${style?.material} border-end border-black`}>
                    <div className="d-grid h-100">
                        <div className="d-flex justify-content-center align-items-center">
                            <p className="fw-bold text-center border-bottom border-black p-1 w-100">Details of Metal</p>
                        </div>
                        <div className="d-flex">
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>Grs Wt (gms)</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center al ign-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>Net Wt (gms)</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>Findings Wt (gms)</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>Wt Loss</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>% Wt Loss</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>Total Wt (gms)</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>Metal Rate/gm IMP</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>Total Metal Cost</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1`}><p className='fw-bold text-center'>Finding Cost</p></div>
                        </div>
                    </div>
                </div>
                <div className={`${style?.studding} border-end border-black`}>
                    <div className="d-grid h-100">
                        <div className="d-flex">
                            <p className="fw-bold text-center border-bottom border-black p-1 w-100 d-flex justify-content-center align-items-center">Details Of Studding</p>
                        </div>
                        <div className="d-flex">
                            <div className={`col-3 p-1 d-flex justify-content-center align-items-center border-end border-black`}><p className='fw-bold text-center'>Tot Pcs</p></div>
                            <div className={`col-4 p-1 d-flex justify-content-center align-items-center border-end border-black`}><p className='fw-bold text-center'>Weight (Cts)</p></div>
                            <div className={`col-5 p-1 d-flex justify-content-center align-items-center`}><p className='fw-bold text-center'>Total Value in US$</p></div>
                        </div>
                    </div>
                </div>
                <div className={`${style?.fob} p-1 d-flex justify-content-center align-items-center`}>
                    <p className="fw-bold text-center">FOB Value in US$</p>
                </div>
            </div>
            {/* table data */}
            {
                data?.map((e, i) => {
                    return <div key={i}>
                        <div className="d-flex border-start border-end border-bottom border-black">
                            <p className="fw-semibold p-1">{e?.MetalTypePurity}, Studded {e?.MetalType} Jewellery, {NumberWithCommas(e?.LossPer, 2)}%</p>
                        </div>
                        {
                            e?.row.map((ele, ind) => {
                                return <div className="d-flex border-start border-end border-bottom border-black" key={ind}>
                                    <div className={`${style?.des} border-end border-black d-flex`}>
                                        <div className="col-2 p-1 fw-bold border-end border-black"><p className="text-center">{ind + 1}</p></div>
                                        <div className="col-8 p-1 fw-bold border-end border-black"><p className="">{ele?.SrJobno}</p></div>
                                        <div className="col-2 p-1 fw-bold"><p className="text-end">{ele?.Quantity}</p></div>
                                    </div>
                                    <div className={`${style?.material} border-end border-black d-flex w-100`}>
                                        <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>{NumberWithCommas(ele?.grosswt, 3)}</p></div>
                                        <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>{NumberWithCommas(ele?.NetWt, 3)}</p></div>
                                        <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'></p></div>
                                        <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>{NumberWithCommas(ele?.LossWt, 3)}</p></div>
                                        <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>{NumberWithCommas(ele?.LossPer, 2)}</p></div>
                                        <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>{NumberWithCommas(ele?.LossWt + ele?.NetWt, 2)}</p></div>
                                        <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>{ele?.metalRate !== undefined && NumberWithCommas(ele?.metalRate, 2)}</p></div>
                                        <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>{NumberWithCommas(ele?.totals?.metal?.Amount, 2)}</p></div>
                                        <div className={`${style?.grs} p-1`}><p className='fw-bold text-end'></p></div>
                                    </div>
                                    <div className={`${style?.studding} border-end border-black d-flex`}>
                                        <div className={`col-3 p-1 border-end border-black`}><p className='fw-bold text-end'>{NumberWithCommas(ele?.totals?.diamonds?.Pcs + ele?.totals?.colorstone?.Pcs, 2)}</p></div>
                                        <div className={`col-4 p-1 border-end border-black`}><p className='fw-bold text-end'>{NumberWithCommas(ele?.totals?.diamonds?.Wt + ele?.totals?.colorstone?.Wt, 2)}</p></div>
                                        <div className={`col-5 p-1`}><p className='fw-bold text-end'>{NumberWithCommas(ele?.totals?.diamonds?.Amount + ele?.totals?.colorstone?.Amount, 2)}</p></div>
                                    </div>
                                    <div className={`${style?.fob} p-1`}>
                                        <p className="fw-bold text-end">407.32</p>
                                    </div>
                                </div>
                            })
                        }
                        <div className="d-flex border-start border-end border-bottom border-black">
                            <div className={`${style?.des} border-end border-black d-flex`}>
                                <div className="col-10 p-1 fw-bold border-end border-black"><p>Total for</p></div>
                                <div className="col-2 p-1 fw-bold"><p className="text-end">{NumberWithCommas(e?.total?.Quantity, 0)}</p></div>
                            </div>
                            <div className={`${style?.material} border-end border-black d-flex w-100`}>
                                <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>{NumberWithCommas(e?.total?.grosswt, 3)}</p></div>
                                <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>{NumberWithCommas(e?.total?.NetWt, 3)}</p></div>
                                <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'></p></div>
                                <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>{NumberWithCommas(e?.total?.LossWt, 3)}</p></div>
                                <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>{NumberWithCommas(e?.total?.LossPer, 2)}</p></div>
                                <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>{NumberWithCommas(e?.total?.totalWt, 3)}</p></div>
                                <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'></p></div>
                                <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>{NumberWithCommas(e?.total?.metalAmount, 2)}</p></div>
                                <div className={`${style?.grs} p-1`}><p className='fw-bold text-end'></p></div>
                            </div>
                            <div className={`${style?.studding} border-end border-black d-flex`}>
                                <div className={`col-3 p-1 border-end border-black`}><p className='fw-bold text-end'>{NumberWithCommas(e?.total?.diaCsPcs, 2)}</p></div>
                                <div className={`col-4 p-1 border-end border-black`}><p className='fw-bold text-end'>{NumberWithCommas(e?.total?.diaCsWt, 3)}</p></div>
                                <div className={`col-5 p-1`}><p className='fw-bold text-end'>{NumberWithCommas(e?.total?.diaCsAmount, 2)}</p></div>
                            </div>
                            <div className={`${style?.fob} p-1`}>
                                <p className="fw-bold text-end"></p>
                            </div>
                        </div>
                    </div>
                })
            }
            {/* table total */}
            <div className="d-flex border-start border-end border-bottom border-black">
                <div className={`${style?.des} border-end border-black d-flex`}>
                    <div className="col-10 p-1 fw-bold border-end border-black"><p>Grand Total</p></div>
                    <div className="col-2 p-1 fw-bold"><p className="text-end">23</p></div>
                </div>
                <div className={`${style?.material} border-end border-black d-flex w-100`}>
                    <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>38.190</p></div>
                    <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>23.054</p></div>
                    <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>12.520</p></div>
                    <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>1.153</p></div>
                    <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'></p></div>
                    <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>24.207</p></div>
                    <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'></p></div>
                    <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>196.21</p></div>
                    <div className={`${style?.grs} p-1`}><p className='fw-bold text-end'>12.02</p></div>
                </div>
                <div className={`${style?.studding} border-end border-black d-flex`}>
                    <div className={`col-3 p-1 border-end border-black`}><p className='fw-bold text-end'>160</p></div>
                    <div className={`col-4 p-1 border-end border-black`}><p className='fw-bold text-end'>13.080</p></div>
                    <div className={`col-5 p-1`}><p className='fw-bold text-end'>2352.67</p></div>
                </div>
                <div className={`${style?.fob} p-1`}>
                    <p className="fw-bold text-end">2677.76</p>
                </div>
            </div>
            {/* total stone wt */}
            <div className="d-flex justify-content-end pt-2">
                <div className="col-8 d-flex">
                    <div className="col-4">
                        <p className="fw-bold">Total Stone Wt.</p>
                    </div>
                    <div className="col-4">
                        <div className="d-flex h-100 flex-column justify-content-between">
                            <div>
                                <div className="d-flex pb-2">
                                    <div className="col-4"><p className="fw-bold">Diamond</p></div>
                                    <div className="col-4"><p className="fw-bold">13.080</p></div>
                                    <div className="col-4"><p className="fw-bold">13.08</p></div>
                                </div>
                                <div className="d-flex pb-2">
                                    <div className="col-4"><p className="fw-bold">Color Stone</p></div>
                                    <div className="col-4"><p className="fw-bold">0.208</p></div>
                                    <div className="col-4"><p className="fw-bold">100.20</p></div>
                                </div>
                            </div>
                            <div className='border-top border-black border-dotted mt-2'>
                                <div className="d-flex">
                                    <div className="col-4"><p className="fw-bold">Color Stone</p></div>
                                    <div className="col-4"><p className="fw-bold">0.208</p></div>
                                    <div className="col-4"><p className="fw-bold">100.20</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="d-flex flex-column justify-content-between">
                            <div>
                                <div className="d-flex pb-2">
                                    <div className="col-4">
                                        <p className="fw-bold">Gold</p>
                                    </div>
                                    <div className="col-4">
                                        <p className="fw-bold">10.143</p>
                                    </div>
                                    <div className="col-4">
                                        <p className="fw-bold">189.88</p>
                                    </div>
                                </div>
                                <div className="d-flex pb-2">
                                    <div className="col-4">
                                        <p className="fw-bold">Silver</p>
                                    </div>
                                    <div className="col-4">
                                        <p className="fw-bold">14.064</p>
                                    </div>
                                    <div className="col-4">
                                        <p className="fw-bold">6.33</p>
                                    </div>
                                </div>
                                <div className="d-flex pb-2">
                                    <div className="col-4">
                                        <p className="fw-bold">Palladium</p>
                                    </div>
                                    <div className="col-4">
                                        <p className="fw-bold"></p>
                                    </div>
                                    <div className="col-4">
                                        <p className="fw-bold"></p>
                                    </div>
                                </div>
                                <div className="d-flex pb-2">
                                    <div className="col-4">
                                        <p className="fw-bold">Brass</p>
                                    </div>
                                    <div className="col-4">
                                        <p className="fw-bold">0.000</p>
                                    </div>
                                    <div className="col-4">
                                        <p className="fw-bold">0.000</p>
                                    </div>
                                </div>
                                <div className="d-flex pb-2">
                                    <div className="col-4">
                                        <p className="fw-bold">Gold Access</p>
                                    </div>
                                    <div className="col-4">
                                        <p className="fw-bold">0.000</p>
                                    </div>
                                    <div className="col-4">
                                        <p className="fw-bold">0.000</p>
                                    </div>
                                </div>
                                <div className="d-flex pb-2">
                                    <div className="col-4">
                                        <p className="fw-bold">Silver Access</p>
                                    </div>
                                    <div className="col-4">
                                        <p className="fw-bold">12.520</p>
                                    </div>
                                    <div className="col-4">
                                        <p className="fw-bold">12.02</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="d-flex pb-2">
                                    <div className="col-4">
                                        <p className="fw-bold">Silver Access</p>
                                    </div>
                                    <div className="col-4">
                                        <p className="fw-bold">12.520</p>
                                    </div>
                                    <div className="col-4">
                                        <p className="fw-bold">12.02</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default ExportPrint2;


