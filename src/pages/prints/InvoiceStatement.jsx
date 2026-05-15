import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/CustomerDailyStatement.module.css"
import { NumberWithCommas, apiCall, checkMsg, handlePrint, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';

const InvoiceStatement = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const [headerData, setHeaderData] = useState({});
    const [category, setCategory] = useState([]);

    const loadData = (data) => {
        let categories = [];
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
        setHeaderData(data?.BillPrint_Json[0]);
        let resultArr = [];
        datas?.resultArray?.forEach((e, i) => {
            let obj = cloneDeep(e);
            let findBrandName = -1;
            if (findBrandName === -1) {
                resultArr.push(obj);
            } else {
                if (obj?.MaKingCharge_Unit !== resultArr[findBrandName]?.MaKingCharge_Unit) {
                    resultArr[findBrandName].MaKingCharge_Unit = "MIX";
                } else {
                    // resultArr[findBrandName].MaKingCharge_Unit += obj?.MaKingCharge_Unit;
                }
                if (obj?.Tunch === resultArr[findBrandName]?.Tunch) {
                    resultArr[findBrandName].Tunch = "MIX";
                }
                resultArr[findBrandName].Quantity += obj?.Quantity;
                resultArr[findBrandName].Wastage += obj?.Wastage;
                resultArr[findBrandName].totals.colorstone.Wt += obj?.totals.colorstone.Wt;

            }
        });

        const categoryMap = {};

        data?.BillPrint_Json1?.forEach((e) => {
            const key = e?.Categoryname;

            if (!categoryMap[key]) {
                categoryMap[key] = {
                    Categoryname: key,
                    pcs: 0,
                    grosswt: 0,
                    netwt: 0,
                    wastage: 0,
                    fine: 0,
                };
            }

            categoryMap[key].pcs += 1;
            categoryMap[key].grosswt += e?.grosswt || 0;
            categoryMap[key].netwt += e?.NetWt || 0;
            categoryMap[key].wastage += e?.Wastage || 0;
            categoryMap[key].fine += e?.PureNetWt || 0;
        });

        // convert object → array
        const finalCategories = Object.values(categoryMap);

        // ✅ calculate total
        const totalObj = finalCategories.reduce(
            (acc, cur) => {
                acc.pcs += cur.pcs;
                acc.grosswt += cur.grosswt;
                acc.netwt += cur.netwt;
                acc.wastage += cur.wastage;
                acc.fine += cur.fine;
                return acc;
            },
            {
                Categoryname: "Total",
                pcs: 0,
                grosswt: 0,
                netwt: 0,
                wastage: 0,
                fine: 0,
            }
        );

        // ✅ push total row
        finalCategories.push(totalObj);

        // set state
        setCategory(finalCategories);




        datas.resultArray = resultArr;
        setData(datas);
    }

    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
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
                    // setMsg(data?.Message);
                    const err = checkMsg(data?.Message);
                    console.log(data?.Message);
                    setMsg(err);
                }
            } catch (error) {
                console.error(error);
            }
        }
        sendData();

    }, []);


    const thStyle = {
        border: "1px solid black",
        padding: "6px",
        fontWeight: "bold",
    };

    const tdStyle = {
        border: "1px solid black",
        padding: "6px",
    };
    const th = {
        border: "1px solid black",
        padding: "6px",
        fontWeight: "bold",
        textAlign: "center",
    };

    const td = {
        border: "1px solid black",
        padding: "6px",
        textAlign: "center",
    };

    const subText = {
        fontSize: "10px",
        color: "red",
    };

    const groupBySubCategory = (data) => {
        const map = {};

        data?.forEach((e) => {
            console.log("TCL: groupBySubCategory ->ee ", e)
            const key = e?.SubCategoryname || "Unknown";

            if (!map[key]) {
                map[key] = {
                    SubCategoryname: key,
                    items: [],
                    pcs: 0,
                    grosswt: 0,
                    netwt: 0,
                    stonewt: 0,
                    fine: 0,
                    cash: 0,
                    purity: 0,
                    Wastage: 0,
                };
            }

            // 👉 calculate stone weight from diamond + colorstone
            const stoneWt =
                (e?.totals?.misc?.Wt || 0);

            map[key].items.push(e);
            map[key].pcs += e?.Quantity || 0;
            map[key].grosswt += e?.grosswt || 0;
            map[key].netwt += e?.NetWt || 0;
            map[key].stonewt += stoneWt;
            map[key].fine += e?.PureNetWt || 0;
            map[key].cash += e?.TotalAmount || 0;
            map[key].purity = e?.MetalPriceRatio || 0; // or avg if needed
            map[key].Wastage += e?.Wastage || 0; // or avg if needed
        });

        return Object.values(map);
    };

    const groupedData = groupBySubCategory(data?.resultArray || []);


    const grandTotal = groupedData.reduce(
        (acc, cur) => {
            acc.pcs += cur.pcs;
            acc.grosswt += cur.grosswt;
            acc.stonewt += cur.stonewt;
            acc.netwt += cur.netwt;
            acc.wastage += cur.wastage;
            acc.fine += cur.fine;
            acc.cash += cur.cash;
            acc.Wastage += cur.Wastage;
            return acc;
        },
        {
            pcs: 0,
            grosswt: 0,
            stonewt: 0,
            netwt: 0,
            wastage: 0,
            fine: 0,
            cash: 0,
            Wastage: 0,
        }
    );




    console.log("TCL: InvoiceStatement -> data?.resultArray fgfyh", groupedData)
    console.log("TCL: InvoiceStatement -> data?.resultArray fgfyh", grandTotal)
    return (
        loader ? <Loader /> : msg === "" ? <div className={`container max_width_container pad_60_allPrint mt-2 ${style?.CustomerDailyStatement} px-1`}>
            {/* print button */}
            <div className={`d-flex justify-content-center mb-4 align-items-center ${style?.print_sec_sum4} pt-4 pb-4 `}>
                <div className="form-check ps-3 mt-2">
                    <input
                        type="button"
                        className="btn_white blue"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            {/* customer details */}
            <div style={{ border: "1px solid black", padding: "12px" }}>
                <div className="d-flex">
                    <p>Bill Statement of:<span className='ps-3 fw-bold pe-4'>{headerData?.Customercode}</span></p>
                    <p>Date: <span className="ps-3 fw-bold">{headerData?.EntryDate}</span></p>
                </div>

                <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "12px" }}>
                    <thead>
                        <tr>
                            <th style={th} rowSpan={2}>Bill#</th>
                            <th style={th} rowSpan={2}>
                                Item <br />

                            </th>
                            <th style={th} rowSpan={2}>Pcs</th>
                            <th style={th} rowSpan={2}>Gross Wt</th>
                            <th style={th} rowSpan={2}>
                                Stone Wt
                            </th>
                            <th style={th} rowSpan={2}>
                                net/CT wt
                            </th>
                            <th style={th} rowSpan={2}>Purity</th>
                            <th style={th} rowSpan={2}>Wastage</th>
                            <th style={th} colSpan="2">Final</th>
                        </tr>

                        <tr>

                            <th style={th}>Fine</th>
                            <th style={th}>Cash</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* Row group 1 */}
                        {groupedData?.map((group, i) => (
                             
                                    <tr key={i}>
                                        {/* Bill# only once */}
                                        {i === 0 && (
                                            <td rowSpan={groupedData.length} style={{ ...tdStyle }}>
                                                {`${headerData?.InvoiceNo}`}
                                            </td>
                                        )}

                                        {/* Subcategory */}
                                        <td style={tdStyle}>
                                            {group.SubCategoryname}
                                        </td>

                                        <td style={tdStyle} align="right">{group?.pcs}</td>
                                        <td style={tdStyle} align="right">{group?.grosswt?.toFixed(3)}</td>

                                        {/* Stone wt */}
                                        <td style={tdStyle} align="right">
                                            {(
                                                (group?.stonewt || 0)
                                            ).toFixed(3)}
                                        </td>

                                        {/* Net wt */}
                                        <td style={tdStyle} align="right">{group?.netwt?.toFixed(3)}</td>

                                        {/* Purity */}
                                        <td style={tdStyle} align="right">{group?.purity}</td>

                                        {/* Wastage */}
                                        <td style={tdStyle} align="right">{group?.Wastage?.toFixed(2)}</td>

                                        {/* Fine */}
                                        <td style={tdStyle} align="right"> {group?.fine?.toFixed(3)}</td>

                                        {/* Cash */}
                                        <td style={tdStyle} align="right">
                                            {group?.cash?.toLocaleString()}
                                        </td>
                                    </tr>
                              
                        ))}

                        {/* Cash Receive rows */}
                        <tr>
                            <td style={td}>V264<br /><span style={subText}>Cash Receive</span></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}>-50.00</td>
                        </tr>

                        <tr>
                            <td style={td}>V265<br /><span style={subText}>Cash Receive</span></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}>-515.00</td>
                        </tr>

                        <tr>
                            <td style={td}>V266<br /><span style={subText}>Cash Receive</span></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}>-500.00</td>
                        </tr>

                        {/* Total Row */}
                        <tr>
                            <td style={{ ...td, fontWeight: "bold" }}>Total</td>
                            <td style={td}></td>
                            <td style={{ ...td, textAlign: "right" }} align="right">{grandTotal?.pcs}</td>
                            <td style={{ ...td, textAlign: "right" }} align="right">{grandTotal?.grosswt?.toFixed(3)}</td>
                            <td style={{ ...td, textAlign: "right" }} align="right">{grandTotal?.stonewt?.toFixed(3)}</td>
                            <td style={{ ...td, textAlign: "right" }} align="right">{grandTotal?.netwt?.toFixed(3)}</td>
                            <td style={{ ...td, textAlign: "right" }} align="right"></td>
                            <td style={{ ...td, textAlign: "right" }} align="right">{grandTotal?.Wastage?.toFixed(2)}</td>
                            <td style={{ ...td, textAlign: "right" }} align="right">
                                {grandTotal?.fine?.toFixed(3)}
                            </td>
                            <td style={{ ...td, textAlign: "right" }}>{grandTotal?.cash?.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>

                <div style={{
                    border: "1px solid black",
                    paddingLeft: "10px",
                    paddingBottom: "10px",
                    marginTop: "3px",
                }}>
                    <div> <b>Remarks :</b> <span>{headerData?.Remark}</span></div>
                </div>

                {/* summary */}
                <table style={{ borderCollapse: "collapse", width: "60%", textAlign: "center", marginTop: "3px" }}>
                    <thead>
                        <tr>
                            <th colSpan="6" style={{ border: "1px solid black", padding: "6px" }}>
                                PRODUCT SUMMARY
                            </th>
                        </tr>
                        <tr>
                            <th style={thStyle}>CATEGORY</th>
                            <th style={thStyle}>PIECES</th>
                            <th style={thStyle}>GORSS WT</th>
                            <th style={thStyle}>NET WT</th>
                            <th style={thStyle}>WASTAGE</th>
                            <th style={thStyle}>FINE</th>
                        </tr>
                    </thead>

                    <tbody>
                        {category?.map((item, ind) => (
                            <tr key={ind}>
                                <td style={{
                                    ...tdStyle,
                                    fontWeight: item?.Categoryname === "Total" ? "bold" : "normal",
                                }}>{item?.Categoryname == "Total" ? "Total" : item?.Categoryname}</td>
                                <td style={tdStyle}>{item?.pcs}</td>
                                <td style={tdStyle}>{item?.grosswt?.toFixed(3)}</td>
                                <td style={tdStyle}>{item?.netwt?.toFixed(3)}</td>
                                <td style={tdStyle}>{item?.wastage?.toFixed(3)}</td>
                                <td style={tdStyle}>{item?.fine?.toFixed(3)}</td>
                            </tr>
                        ))}

                        {/* <tr key={ind}>
                                <td style={tdStyle}>Total</td>
                                <td style={tdStyle}>{item?.pcs}</td>
                                <td style={tdStyle}>{item?.grosswt?.toFixed(3)}</td>
                                <td style={tdStyle}>{item?.netwt?.toFixed(3)}</td>
                                <td style={tdStyle}>{item?.wastage?.toFixed(3)}</td>
                                <td style={tdStyle}>{item?.fine?.toFixed(3)}</td>
                            </tr> */}



                    </tbody>
                </table>
            </div>

        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default InvoiceStatement
