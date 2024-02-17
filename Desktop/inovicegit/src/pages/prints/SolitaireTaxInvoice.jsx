import React, { useEffect, useState } from 'react'
import style from "../../assets/css/prints/solitaireTaxInvoice.module.css";
import { ToWords } from 'to-words';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';
import Loader from '../../components/Loader';
import {
    HeaderComponent,
    NumberWithCommas,
    apiCall,
    handleImageError,
    handlePrint,
    isObjectEmpty,
    taxGenrator,
    FooterComponent,
    fixedValues,
} from "../../GlobalFunctions";
import { NavLink } from 'react-router-dom';
import { blue } from '@mui/material/colors';

const SolitaireTaxInvoice = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const toWords = new ToWords();
    const [data, setData] = useState({});
    const [label, setlabel] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const [header, setHeader] = useState(null);
    const [footer, setFooter] = useState(null);
    const [document, setDocument] = useState({
        aadharcard: "",
        nri: "",
        passport: "",
    });

    const loadData = (data) => {
        let head = HeaderComponent("1", data?.BillPrint_Json[0]);
        setHeader(head);
        let footers = FooterComponent("2", data?.BillPrint_Json[0]);
        setFooter(footers);
        setHeaderData(data?.BillPrint_Json[0]);
        let printArr = data?.BillPrint_Json[0]?.Printlable.split("\r\n");
        setlabel(printArr);
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
        let resultArray = [];
        datas?.resultArray?.map((e, i) => {
            let obj = cloneDeep(e);
            let metalRate = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1)?.Rate || 0;
            obj.metalRate = metalRate;
            let diamonds = cloneDeep(e?.diamonds);
            let blankDiamonds = [];
            diamonds?.forEach((ele, ind) => {
                let findDiamond = blankDiamonds?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName && elem?.QualityName === ele?.QualityName && elem?.Colorname === ele?.Colorname);
                if (findDiamond === -1) {
                    blankDiamonds.push(ele);
                } else {
                    blankDiamonds[findDiamond].Wt += ele?.Wt
                    blankDiamonds[findDiamond].Pcs += ele?.Pcs
                    blankDiamonds[findDiamond].Amount += ele?.Amount
                }
            });
            let colorStone = cloneDeep(e?.colorstone);
            let blankColorStone = [];
            colorStone?.forEach((ele, ind) => {
                let findColorStone = blankColorStone?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName && elem?.QualityName === ele?.QualityName && elem?.Colorname === ele?.Colorname);
                if (findColorStone === -1) {
                    blankColorStone.push(ele);
                } else {
                    blankColorStone[findColorStone].Wt += ele?.Wt
                    blankColorStone[findColorStone].Pcs += ele?.Pcs
                    blankColorStone[findColorStone].Amount += ele?.Amount
                }
            });
            obj.blankDiamonds = blankDiamonds;
            obj.blankColorStone = blankColorStone;
            resultArray.push(obj);
        });
        datas.resultArray = resultArray;
        setData(datas);
        console.log(datas);
        let documentDetails = data?.BillPrint_Json[0]?.DocumentDetail.split("#@#");
        let documents = {
            aadharcard: "",
            nri: "",
            passport: "",
        };
        documentDetails?.forEach((e, i) => {
            let data = e?.split("#-#");
            if (data[0] === "Aadhar Card") {
                documents.aadharcard = data[1];
            } else if (data[0] === "NRI ID") {
                documents.nri = data[1];
            } else if (data[0] === "FOREIGN PASSPORT") {
                documents.passport = data[1];
            }
        });
        setDocument(documents);
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
            <div className={`container max_width_container ${style?.solitaireTaxInvoice} pad_60_allPrint px-1 mt-1`}>
                {/* buttons */}
                <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
                    <div className="form-check ps-3">
                        <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* header */}
                <div className="d-flex border p-2 justify-content-between align-items-center">
                    <p className="fw-bold" style={{ fontSize: "22px" }}>{headerData?.PrintHeadLabel}</p>
                    <img src={headerData?.PrintLogo} alt='logo' className='logoimg' />
                </div>
                {/* sub header */}
                <div className="d-flex border-start border-end border-bottom p-2 justify-content-between">
                    <div className="col-6">
                        <p>{headerData?.lblBillTo}</p>
                        <p className='fs-6 fw-bold'>{headerData?.customerfirmname}</p>
                        <p>{headerData?.customerstreet}</p>
                        <p>{headerData?.customerregion}</p>
                        <p>{headerData?.customercity} - {headerData?.PinCode}</p>
                        <p>Tel : {headerData?.customermobileno}</p>
                        <p>{headerData?.CompanyEmail}</p>
                    </div>
                    <div className="col-4">
                        <p>Invoice#: <span className="fw-bold">{headerData?.InvoiceNo}</span> Dated <span className="fw-bold"> {headerData?.EntryDate}</span></p>
                        <p>{headerData?.HSN_No_Label}: <span className="fw-bold">{headerData?.HSN_No}</span></p>
                        <p>PAN#: <span className="fw-bold">{headerData?.CustPanno}</span></p>
                        <p>GSTIN <span className="fw-bold">{headerData?.CustGstNo} | </span>{headerData?.Cust_CST_STATE} {headerData?.Cust_CST_STATE_No}</p>
                        <p>Ref.Name: <span className="fw-bold">{headerData?.SalPerName}</span></p>
                    </div>
                </div>
                {/* table header */}
                <div className="d-flex border-start border-end border-bottom lightGrey">
                    <div className={`${style?.SR} text-center border-end py-1`}><p className="fw-bold">SR#</p></div>
                    <div className={`${style?.DESCRIPTION} text-center border-end py-1`}><p className="fw-bold">DESCRIPTION</p></div>
                    <div className={`${style?.AMOUNT} text-center border-end py-1`}><p className="fw-bold">AMOUNT</p></div>
                    <div className={`${style?.DISCOUNT} text-center border-end py-1`}><p className="fw-bold">DISCOUNT</p></div>
                    <div className={`${style?.TOTAL} text-center py-1`}><p className="fw-bold">TOTAL</p></div>
                </div>
                {/* table body */}
                {data?.resultArray?.map((e, i) => {
                    return <React.Fragment key={i}>
                        <div className="d-flex border-start border-end border-bottom">
                            <div className={`${style?.SR} text-center border-end py-1`}>
                                <p className="">{NumberWithCommas(i + 1)}</p>
                                <img src={e?.DesignImage} alt="" className='imgWidth' onError={handleImageError} />
                                <p className="fw-bold">{e?.designno}</p>
                            </div>
                            <div className={`${style?.DESCRIPTION}  border-end p-1`}>
                                <p><span className="fw-bold">MOUNTING - </span> ID: 9XIW1 | {e?.Categoryname} Size : {e?.Size} </p>
                                <p>{e?.MetalTypePurity} {e?.MetalColor} | {NumberWithCommas(e?.grosswt, 3)} gms GW | {NumberWithCommas(e?.NetWt, 3)} gms NW</p>
                                {e?.diamonds?.map((ele, ind) => {
                                    return <p key={ind}>Diamond: {NumberWithCommas(ele?.Pcs, 0)} PCs | {NumberWithCommas(ele?.Wt, 3)} Cts | {ele?.ShapeName} {ele?.QualityName} {ele?.Colorname}</p>
                                })}
                                {e?.colorstone?.map((ele, ind) => {
                                    return <p key={ind}>Colorstone: {NumberWithCommas(ele?.Pcs, 0)} PCs | {NumberWithCommas(ele?.Wt, 3)} Cts | {ele?.ShapeName} {ele?.QualityName} {ele?.Colorname}</p>
                                })}
                                {e?.JobRemark !== "" && <>
                                    <p className='text-decoration-underline fw-bold pt-2'>REMARKS</p>
                                    <p>{e?.JobRemark}</p>
                                </>}
                            </div>
                            <div className={`${style?.AMOUNT} text-end border-end p-1`}><p className="">{NumberWithCommas(e?.UnitCost, 2)}	</p></div>
                            <div className={`${style?.DISCOUNT} text-end border-end p-1`}><p className="">{NumberWithCommas(e?.DiscountAmt, 2)}</p></div>
                            <div className={`${style?.TOTAL}  p-1`}><p className="text-end"></p></div>
                        </div>
                        <div className="d-flex border-start border-end border-bottom lightGrey">
                            <div className={`${style?.SR} text-center border-end py-1`}>
                                <p className=""></p>
                            </div>
                            <div className={`${style?.DESCRIPTION}  border-end p-1`}>
                                <p className="fw-bold">AMOUNT </p>
                            </div>
                            <div className={`${style?.AMOUNT} text-end border-end p-1`}><p className="fw-bold">{NumberWithCommas(e?.UnitCost, 2)} </p></div>
                            <div className={`${style?.DISCOUNT}  border-end p-1 text-end`}><p className="fw-bold">{NumberWithCommas(e?.DiscountAmt, 2)}</p></div>
                            <div className={`${style?.TOTAL}  p-1 text-end`}><p className="fw-bold">{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
                        </div>
                    </React.Fragment>
                })}

                {/* table total */}
                <div className="d-flex border-start border-end border-bottom lightGrey">
                    <div className={`${style?.SR} text-center border-end py-1`}>
                        <p className=""></p>
                    </div>
                    <div className={`${style?.DESCRIPTION}  border-end p-1`}>
                        <p className="fw-bold">TOTAL </p>
                    </div>
                    <div className={`${style?.AMOUNT} text-end border-end p-1`}><p className="fw-bold">{NumberWithCommas(data?.mainTotal?.total_unitcost, 2)} </p></div>
                    <div className={`${style?.DISCOUNT}  border-end p-1 text-end`}><p className="fw-bold">{NumberWithCommas(data?.mainTotal?.total_discount_amount, 2)}</p></div>
                    <div className={`${style?.TOTAL}  p-1 text-end`}><p className="fw-bold">{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p></div>
                </div>
                {/* taxes */}
                <div className="d-flex border-start border-end border-bottom ">
                    <div className={`${style?.REMARKS}  border-end p-1`}>
                        <p className="fw-bold text-decoration-underline">REMARKS</p>
                        <p>{headerData?.PrintRemark} </p>
                    </div>
                    <div className={`${style?.WORDS} border-end p-1`}>
                        {
                            data?.allTaxes?.map((e, i) => {
                                return <p className="" key={i}>{e?.name} @ {e?.per}</p>
                            })
                        }
                        <p className="">Total </p>
                        {headerData?.AddLess !== 0 && <p className="">{headerData?.AddLess > 0 ? "Add" : "Less"}</p>}
                    </div>
                    <div className={`${style?.TOTAL}  p-1 text-end`}>
                        {
                            data?.allTaxes?.map((e, i) => {
                                return <p className="" key={i}>{NumberWithCommas(e?.amount, 2)}</p>
                            })
                        }
                        <p className="fw-bold">{NumberWithCommas(data?.finalAmount - headerData?.AddLess, 2)}</p>
                        {headerData?.AddLess !== 0 && <p className="fw-bold">{NumberWithCommas(headerData?.AddLess, 2)}</p>}
                    </div>
                </div>
                {/* grand total */}
                <div className="d-flex border-start border-end border-bottom justify-content-between p-1 lightGrey">
                    <p className="fw-bold">GRAND TOTAL</p>
                    <p className="fw-bold">{NumberWithCommas(data?.finalAmount, 2)}</p>
                </div>
                {/* SIGNATURE  */}
                <div className="my-1 d-flex border">
                    <div className="col-6 border-end pb-5">
                        <p className="fw-bold lightGrey text-center p-1 border-bottom mb-5">
                            RECEIVER'S SIGNATURE & SEAL
                        </p>
                    </div>
                    <div className="col-6 pb-5">
                        <p className="fw-bold lightGrey text-center p-1 border-bottom mb-5">
                            AUTHORIZED SIGNATURE & SEAL
                        </p>
                    </div>
                </div>
                {/* pre text */}
                <pre className="preText mb-0">**   THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF TRANSACTIONS</pre>
                {/* terms and conditions */}
                <p className="p-2 text-decoration-underline">TERMS AND CONDITIONS</p>
                {/* declaration */}
                <div className="border p-2">
                    <div dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}></div>
                </div>
                {/* footer */}
                <div className="border-start border-end border-bottom py-1">
                    <div className="text-center">
                        <div>  <span className="fw-bold">{headerData?.CompanyFullName}</span>{headerData?.CompanyAddress},{headerData?.CompanyCity} - {headerData?.CompanyPinCode}</div>
                        <div>  Tel. <span className="fw-bold">{headerData?.CompanyTellNo}.</span> | Fax. <span className="fw-bold">022-688669565</span> | Email: <span className="fw-bold">{headerData?.CompanyEmail}</span> | Website: <NavLink to={`${headerData?.CompanyWebsite}`} className={"text-decoration-underline"} style={{ color: "blue" }}>{headerData?.CompanyWebsite}</NavLink></div>
                        <div>  {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Com_pannumber}</div>
                    </div>
                </div>
            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default SolitaireTaxInvoice;
