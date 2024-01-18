import React, { useEffect, useState } from 'react';
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
import style from '../../assets/css/prints/summary6.module.css';
import Loader from "../../components/Loader";
import { ToWords } from "to-words";
import headerStyle from "../../assets/css/headers/header1.module.css";
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';

const Summary6 = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const [header, setHeader] = useState(null);
    const [headerData, setHeaderData] = useState({});
    const [address, setAddress] = useState([]);
    const [footer, setFooter] = useState(null);
    const [summary, setSummary] = useState([]);
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
        setData(datas);
        let summaryItems = [];
        datas?.resultArray?.forEach((e, i) => {
            let findRecord = summaryItems.findIndex((ele, ind) => ele?.Categoryname === e?.Categoryname && ele?.SubCategoryname === e?.SubCategoryname);
            if (findRecord === -1) {
                summaryItems.push({ Categoryname: e?.Categoryname, SubCategoryname: e?.SubCategoryname, Quantity: e?.Quantity });
            } else {
                summaryItems[findRecord].Quantity += e?.Quantity;
            }
        })
        setSummary(summaryItems);
    };

    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls, evn);
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
        <div className='border-collapse p-2'>
            <table className={`container container-fluid max_width_container mt-1 ${style?.summary6} pad_60_allPrint table`} >
                <thead>
                    <tr>
                        <th className='d-flex flex-wrap pe-0 pb-0 ps-0 pt-2'>
                            <div className={`${headerStyle.headline} headerTitle w-100`}>{headerData?.PrintHeadLabel}</div>
                            <div className="d-flex justify-content-between w-100 align-items-center">
                                <div className={`${headerStyle.companyDetails} col-6`} style={{ minHeight: "unset" }}>
                                    <div className={`${headerStyle.companyhead} p-2`}>
                                        <div className={`${headerStyle.lines} fs-5`} style={{ fontWeight: "bold" }}>
                                            {headerData?.CompanyFullName}
                                        </div>
                                        <div className={`${headerStyle.lines} fw-normal`}>{headerData?.CompanyAddress}</div>
                                        <div className={`${headerStyle.lines} fw-normal`}>{headerData?.CompanyCity}-{headerData?.CompanyPinCode},{headerData?.CompanyState}({headerData?.CompanyCountry})</div>
                                        <div className={`${headerStyle.lines} fw-normal`}>T {headerData?.CompanyTellNo} {headerData?.CompanyTollFreeNo}</div>
                                        <div className={`${headerStyle.lines} fw-normal`}>
                                            {headerData?.CompanyEmail} | {headerData?.CompanyWebsite}
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end align-item-center col-6"><img src={headerData?.PrintLogo} alt="" className={`${headerStyle.headerImg} w-100 object-fit-contain`} style={{ maxWidth: "153.11px", maxHeight: "100px" }} /></div>
                            </div>
                        </th>
                    </tr>
                    <tr></tr>
                </thead>

                <tbody>
                    <tr>
                        <td className='border-0 pb-0'>
                            <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`} >
                                <div className="form-check ps-3">
                                    <input type="button" className="btn_white blue py-2 mt-2" value="Print" onClick={(e) => handlePrint(e)} />
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className='pt-0 ps-0 pe-0'>
                            {/* bill info */}
                            <div className="border d-flex justify-content-between">
                                <div className="col-6">
                                    <p><span className="fw-bold px-2">##: </span>{headerData?.InvoiceNo}</p>
                                </div>
                                <div className="col-3 px-2">
                                    <p> <span className="fw-bold">DATE : </span> 	{headerData?.EntryDate}  </p>
                                    <p> <span className="fw-bold"> {headerData?.HSN_No_Label} :</span>	{headerData?.HSN_No}  </p>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className='pt-0 ps-0 pe-0'>
                            {/* customer details */}
                            <div className="border-start border-end border-bottom d-flex px-2 pb-2 pt-1">
                                <div className="col-6">
                                    <p className="fw-bold fs-6">{headerData?.customerfirmname} </p>
                                    <p>{headerData?.customerregion}</p>
                                    <p>{headerData?.customercity} </p>
                                    <p>{headerData?.customermobileno}</p>
                                    <p>GSTIN-{headerData?.CustGstNo} | {headerData?.Cust_CST_STATE}-{headerData?.Cust_CST_STATE_No} | PAN-{headerData?.CustPanno}</p></div>
                                <div className="col-6"></div>
                            </div>
                        </td>
                    </tr>
                    {/* table header */}
                    <tr>
                        <td className='p-0 border'>
                            <div className="d-flex">
                                <div className={`${style?.sr} border-end fw-bold text-uppercase text-center p-1`}>sr
                                </div>
                                <div className={`${style?.design} border-end fw-bold text-uppercase text-center p-1`}>design
                                </div>
                                <div className={`${style?.metal} border-end fw-bold text-uppercase text-center p-1`}>metal
                                </div>
                                <div className={`${style?.gwt} border-end fw-bold text-uppercase text-center p-1`}>gwt
                                </div>
                                <div className={`${style?.nwt} border-end fw-bold text-uppercase text-center p-1`}>nwt
                                </div>
                                <div className={`${style?.dpcs} border-end fw-bold text-uppercase text-center p-1`}>dpcs
                                </div>
                                <div className={`${style?.dwt} border-end fw-bold text-uppercase text-center p-1`}>dwt
                                </div>
                                <div className={`${style?.cspcs} border-end fw-bold text-uppercase text-center p-1`}>cspcs
                                </div>
                                <div className={`${style?.cswt} border-end fw-bold text-uppercase text-center p-1`}>cswt
                                </div>
                                <div className={`${style?.order} border-end fw-bold text-uppercase text-center p-1`}>order
                                </div>
                                <div className={`${style?.total} fw-bold text-uppercase text-center p-1`}>total
                                </div>
                            </div>
                        </td>
                    </tr>
                    {/* table data */}
                    {
                        data?.resultArray.map((e, i) => {
                            return <tr key={i}>
                                <td className='p-0 border'>
                                    <div className="d-flex " key={i}>
                                        <div className={`${style?.sr} border-end d-flex align-items-center justify-content-center`}>{i + 1}
                                        </div>
                                        <div className={`${style?.design} border-end d-flex justify-content-between p-1  align-items-center`}>
                                            <div>
                                                <img src={e?.DesignImage} alt="" className='imgWidth2' onError={handleImageError} />
                                            </div>
                                            <div className='text-center'>
                                                <p>{e?.designno}</p>
                                                <p className='border-top'>{e?.SrJobno}</p>
                                            </div>
                                        </div>
                                        <div className={`${style?.metal} border-end d-flex align-items-center p-1`}>{e?.MetalTypePurity}
                                        </div>
                                        <div className={`${style?.gwt} border-end p-1 d-flex align-items-center justify-content-end`}>{NumberWithCommas(e?.grosswt, 3)}
                                        </div>
                                        <div className={`${style?.nwt} border-end p-1 d-flex align-items-center justify-content-end`}>{NumberWithCommas(e?.NetWt + e?.LossWt, 3)}
                                        </div>
                                        <div className={`${style?.dpcs} border-end p-1 d-flex align-items-center justify-content-end`}>{NumberWithCommas(e?.totals?.diamonds?.Pcs, 0)}
                                        </div>
                                        <div className={`${style?.dwt} border-end p-1 d-flex align-items-center justify-content-end`}>{NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}
                                        </div>
                                        <div className={`${style?.cspcs} border-end p-1 d-flex align-items-center justify-content-end`}>{NumberWithCommas(e?.totals?.colorstone?.Pcs, 0)}
                                        </div>
                                        <div className={`${style?.cswt} border-end p-1 d-flex align-items-center justify-content-end`}>{NumberWithCommas(e?.totals?.colorstone?.Wt, 3)}
                                        </div>
                                        <div className={`${style?.order} border-end p-1 d-flex align-items-center justify-content-end`}>0.00
                                        </div>
                                        <div className={`${style?.total} p-1 d-flex align-items-center justify-content-end`}>{NumberWithCommas(e?.TotalAmount / headerData?.CurrencyExchRate, 2)}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        })
                    }
                    {/* table total */}

                    <tr>
                        <td className='p-0 border'>
                            <div className="d-flex">
                                <div className={`${style?.sr} text-center`}>
                                </div>
                                <div className={`${style?.design} p-1`}>
                                    <p className="text-center fw-bold">Total</p>
                                </div>
                                <div className={`${style?.metal} border-end d-flex align-items-center p-1`}>
                                </div>
                                <div className={`${style?.gwt} border-end p-1 d-flex align-items-center justify-content-end fw-bold`}>{NumberWithCommas(data?.mainTotal?.grosswt, 3)}
                                </div>
                                <div className={`${style?.nwt} border-end p-1 d-flex align-items-center justify-content-end fw-bold`}>{NumberWithCommas(data?.mainTotal?.netwtWithLossWt, 3)}
                                </div>
                                <div className={`${style?.dpcs} border-end p-1 d-flex align-items-center justify-content-end fw-bold`}>{NumberWithCommas(data?.mainTotal?.diamonds?.Pcs, 0)}
                                </div>
                                <div className={`${style?.dwt} border-end p-1 d-flex align-items-center justify-content-end fw-bold`}>{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)}
                                </div>
                                <div className={`${style?.cspcs} border-end p-1 d-flex align-items-center justify-content-end fw-bold`}>{NumberWithCommas(data?.mainTotal?.colorstone?.Pcs, 3)}
                                </div>
                                <div className={`${style?.cswt} border-end p-1 d-flex align-items-center justify-content-end fw-bold`}>{NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)}
                                </div>
                                <div className={`${style?.order} border-end p-1 d-flex align-items-center justify-content-end fw-bold`}>00.00
                                </div>
                                <div className={`${style?.total} p-1 d-flex align-items-center justify-content-end fw-bold`}><span dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}></span> {NumberWithCommas(data?.mainTotal?.total_amount / headerData?.CurrencyExchRate, 2)}
                                </div>
                            </div>
                        </td>
                    </tr>
                    {/* taxes */}
                    <tr>
                        <td className='p-0 border'>
                            <div className="">
                                <div className="d-flex border-bottom p-1">
                                    <div className={`${style?.taxWords} text-center border-end`}>
                                    </div>
                                    <div className={`${style?.tax} p-1`}>
                                        {data?.allTaxes.map((e, i) => {
                                            return <div className="d-flex justify-content-between" key={i}>
                                                <p>{e?.name} @ {e?.per}</p>
                                                <p>{e?.amount}</p>
                                            </div>
                                        })}
                                        {
                                            headerData?.AddLess !== 0 && <div className="d-flex justify-content-between fw-bold">
                                                <p>{headerData?.AddLess > 0 ? "Add" : "Less"}</p>
                                                <p>{headerData?.AddLess}</p>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="d-flex p-1">
                                    <div className={`${style?.taxWords} border-end d-flex align-items-center fw-bold`}>
                                        <p>  {toWords.convert(+fixedValues(data?.finalAmount, 2))} Only	</p>
                                    </div>
                                    <div className={`${style?.tax} p-1`}>
                                        <div className="d-flex justify-content-end fw-bold">
                                            <p>Grand Total :</p>
                                            <p> <span dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}></span> {NumberWithCommas(data?.finalAmount, 2)}/-  </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    {/* Summary Detail */}
                    <tr>
                        <td className='p-0 border my-1'>
                            <div>
                                <p className="lightGrey fw-bold p-1 border-bottom"> Summary Detail </p>
                                <div className={`${style?.d_grid} flex-wrap p-1 d-grid`}>

                                    {summary.map((e, i) => {
                                        return <div className='d-flex' key={i}>
                                            <div className="col-7">{e?.Categoryname} | {e?.SubCategoryname}</div>
                                            <div className="col-1">:</div>
                                            <div className="col-4">{e?.Quantity}</div>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className='p-0'>
                            {headerData?.PrintRemark !== "" && <p><span className="fw-bold">REMARKS IF ANY :</span> {headerData?.PrintRemark}</p>}
                            <pre className='preText pt-1'>**  THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF TRANSACTIONS</pre>
                        </td>
                    </tr>
                </tbody>
            </table >
        </div>
    ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
        </p>
    );
}

export default Summary6;