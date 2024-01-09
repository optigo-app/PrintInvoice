import React, { useEffect, useState } from 'react';
import { ToWords } from 'to-words';
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
import style from '../../assets/css/prints/summary9.module.css';
import Loader from "../../components/Loader";
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';

const Summary9 = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const [headerData, setHeaderData] = useState({});
    const toWords = new ToWords();
    const [checkBox, setCheckbox] = useState({
        header: false,
        image: false,
        summary: false
    })

    const loadData = (data) => {
        setHeaderData(data?.BillPrint_Json[0]);
        let datas = OrganizeDataPrint(
            data?.BillPrint_Json[0],
            data?.BillPrint_Json1,
            data?.BillPrint_Json2
        );
        let resultArray = [];
        datas.resultArray.forEach((e, i) => {
            let findMetalrate = e?.metal.findIndex((ele, ind) => ele?.IsPrimaryMetal === 1);
            let obj = { ...e };
            if (findMetalrate === -1) {
                obj.metalrate = 0;
            } else {
                obj.metalrate = e?.metal[findMetalrate]?.Rate;
            }
            resultArray.push(obj);
        })
        datas.resultArray = resultArray;
        console.log(datas);
        setData(datas);
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

    const handleChange = (e) => {
        const { name, checked } = e?.target;
        setCheckbox({ ...checkBox, [name]: checked });
    }

    return loader ? (
        <Loader />
    ) : msg === "" ? (
        <div
            className={`container container-fluid max_width_container mt-1 ${style?.summary9} pad_60_allPrint`}
        >
            {/* buttons */}
            <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`} >
                <div className="form-check d-flex align-items-center">
                    <input className="border-dark me-2" type="checkbox" checked={checkBox?.header} onChange={e => handleChange(e)} name='header' />
                    <label className="">
                        With Header
                    </label>
                </div>
                <div className="form-check d-flex align-items-center">
                    <input className="border-dark me-2" type="checkbox" checked={checkBox?.image} onChange={e => handleChange(e)} name='image' />
                    <label className="">
                        With Image
                    </label>
                </div>
                <div className="form-check d-flex align-items-center">
                    <input className="border-dark me-2" type="checkbox" checked={checkBox?.summary} onChange={e => handleChange(e)} name='summary' />
                    <label className="">
                        With Summary
                    </label>
                </div>
                <div className={`form-check ps-3 ${style?.printBtn}`}>
                    <input
                        type="button"
                        className="btn_white blue py-2 mt-2"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            {/* header */}
            <div className="border d-flex justify-content-between p-2">
                <p>INVOICE# : <span className="fw-bold">{headerData?.InvoiceNo}</span></p>
                <p>DATE : <span className="fw-bold">{headerData?.EntryDate}</span></p>
            </div>
            <div className="border-start border-end border-bottom d-flex justify-content-between p-2">
                <div>
                    <p>{headerData?.lblBillTo}</p>
                    <p className='fw-bold'>{headerData?.customerfirmname}</p>
                    <p>{headerData?.customerAddress1}</p>
                    <p>{headerData?.customerAddress2}</p>
                    <p>{headerData?.customercity}{headerData?.customerpincode}</p>
                    <p>{headerData?.customeremail1}</p>
                    <p>{headerData?.Cust_CST_STATE_No_}</p>
                    <p>{headerData?.vat_cst_pan}</p>

                </div>
                <div>
                    <p>Gold Rate: <span className="fw-bold">{NumberWithCommas(headerData?.MetalRate24K, 2)}</span></p>
                    <p>{headerData?.HSN_No_Label} : <span className="fw-bold">{headerData?.HSN_No}</span></p>
                </div>
            </div>
            {/* table title */}
            <div className="d-flex border-start border-end border-bottom">
                <div className={`${style?.SR} fw-bold text-center border-end d-flex justify-content-center align-items-center`}>SR#</div>
                <div className={`${style?.DESIGN} fw-bold text-center border-end d-flex justify-content-center align-items-center`}>DESIGN</div>
                <div className={`${style?.STONE} fw-bold text-center border-end`}>
                    <div className="grid h-100">
                        <div className="d-flex w-100 justify-content-center border-bottom p-1">STONE/MINA/KUNDAN</div>
                        <div className="d-flex">
                            <div className="col-3 text-center p-1 border-end">NAME</div>
                            <div className="col-3 text-center p-1 border-end">PCS/WT</div>
                            <div className="col-3 text-center p-1 border-end">RATE</div>
                            <div className="col-3 text-center p-1">AMOUNT</div>
                        </div>
                    </div>
                </div>
                <div className={`${style?.GWT} fw-bold text-center border-end d-flex justify-content-center align-items-center`}>G WT</div>
                <div className={`${style?.NWT} fw-bold text-center border-end d-flex justify-content-center align-items-center`}>NWT</div>
                <div className={`${style?.PURITY} fw-bold text-center border-end d-flex justify-content-center align-items-center`}>PURITY</div>
                <div className={`${style?.WASTAGE} fw-bold text-center border-end d-flex justify-content-center align-items-center`}>WASTAGE</div>
                <div className={`${style?.GOLDRate} fw-bold text-center border-end d-flex justify-content-center align-items-center`}>GOLD RATE</div>
                <div className={`${style?.PUREWT} fw-bold text-center border-end d-flex justify-content-center align-items-center`}>PURE WT</div>
                <div className={`${style?.TOTALMISC} fw-bold text-center border-end d-flex justify-content-center align-items-center`}>TOTAL MISC CHRGS</div>
                <div className={`${style?.GOLDAMOUNT} fw-bold text-center border-end d-flex justify-content-center align-items-center`}>GOLD AMOUNT</div>
                <div className={`${style?.TOTALAMT} fw-bold text-center d-flex justify-content-center align-items-center`}>TOTAL AMT</div>
            </div>
            {/* table data */}
            {data?.resultArray.map((e, i) => {
                return <div className="d-flex border-start border-end border-bottom" key={i}>
                    <div className={`${style?.SR} text-center border-end p-1`}>1</div>
                    <div className={`${style?.DESIGN} fw-bold  border-end p-1`}>
                        <p>{e?.SrJobno} - {e?.Categoryname}</p>
                        <img src={e?.DesignImage} alt="" className='w-100 imgWidth' onError={handleImageError} />
                        <p> {e?.MetalTypePurity}</p>
                        {e?.HUID !== "" && <p>HUID-{e?.HUID}</p>}
                    </div>
                    <div className={`${style?.STONE}   border-end d-flex`}>
                        <div className="col-3  p-1 border-end">
                            {e?.colorstone.map((ele, ind) => {
                                return <p key={ind} className={`${style?.shapeName}`}>{ele?.ShapeName}</p>
                            })}
                            {e?.misc.map((ele, ind) => {
                                return <p key={ind} className={`${style?.shapeName}`}>{ele?.ShapeName}</p>
                            })}
                        </div>
                        <div className="col-3  p-1 border-end text-end">
                            {e?.colorstone.map((ele, ind) => {
                                return <p key={ind} className={`${style?.shapeName}`}>{NumberWithCommas(ele?.Pcs, 0)}/{NumberWithCommas(ele?.Wt, 3)}</p>
                            })}
                            {e?.misc.map((ele, ind) => {
                                return <p key={ind} className={`${style?.shapeName}`}>{NumberWithCommas(ele?.Pcs, 0)}/{NumberWithCommas(ele?.Wt, 3)}</p>
                            })}
                        </div>
                        <div className="col-3  p-1 border-end text-end">
                            {e?.colorstone.map((ele, ind) => {
                                return <p key={ind} className={`${style?.shapeName}`}>{NumberWithCommas(ele?.Rate, 2)}</p>
                            })}
                            {e?.misc.map((ele, ind) => {
                                return <p key={ind} className={`${style?.shapeName}`}>{NumberWithCommas(ele?.Rate, 2)}</p>
                            })}
                        </div>
                        <div className="col-3  p-1 text-end">
                            {e?.colorstone.map((ele, ind) => {
                                return <p key={ind} className={`${style?.shapeName}`}>{NumberWithCommas(ele?.Amount, 2)}</p>
                            })}
                            {e?.misc.map((ele, ind) => {
                                return <p key={ind} className={`${style?.shapeName}`}>{NumberWithCommas(ele?.Amount, 2)}</p>
                            })}
                        </div>
                    </div>
                    <div className={`${style?.GWT} border-end p-1 text-end`}>{NumberWithCommas(e?.grosswt, 3)}</div>
                    <div className={`${style?.NWT} border-end p-1 text-end`}>{NumberWithCommas(e?.NetWt, 3)}</div>
                    <div className={`${style?.PURITY} border-end p-1 text-end`}>{NumberWithCommas(e?.MetalPriceRatio, 3)}</div>
                    <div className={`${style?.WASTAGE} border-end p-1 text-end`}>{NumberWithCommas(e?.Wastage, 3)}</div>
                    <div className={`${style?.GOLDRate} border-end p-1 text-end`}>{NumberWithCommas(e?.metalrate, 2)}</div>
                    <div className={`${style?.PUREWT} border-end p-1 text-end`}>{NumberWithCommas(e?.PureNetWt, 3)}</div>
                    <div className={`${style?.TOTALMISC} border-end p-1 text-end`}>{NumberWithCommas(e?.MiscAmount, 2)}</div>
                    <div className={`${style?.GOLDAMOUNT} border-end p-1 text-end`}>{NumberWithCommas(e?.totals?.metal?.Amount, 2)}</div>
                    <div className={`${style?.TOTALAMT} p-1 text-end`}>{NumberWithCommas(e?.TotalAmount, 2)}</div>
                </div>
            })}
            {/* table total */}
            <div className="d-flex border-start border-end border-bottom lightGrey">
                <div className={`${style?.tableTotal} text-center border-end p-1 fw-bold`}>TOTAL</div>
                <div className={`${style?.STONE}   border-end d-flex`}>
                    <div className="col-3  p-1 border-end"></div>
                    <div className="col-3  p-1 border-end text-end fw-bold">{NumberWithCommas(data?.mainTotal?.colorstone?.Pcs + data?.mainTotal?.misc?.Pcs, 0)}/{NumberWithCommas(data?.mainTotal?.colorstone?.Wt + data?.mainTotal?.misc?.Wt, 3)}</div>
                    <div className="col-3  p-1 border-end text-end fw-bold"></div>
                    <div className="col-3  p-1 text-end fw-bold">480.00</div>
                </div>
                <div className={`${style?.GWT} border-end p-1 text-end fw-bold`}>10.230</div>
                <div className={`${style?.NWT} border-end p-1 text-end fw-bold`}>8.609</div>
                <div className={`${style?.PURITY} border-end p-1 text-end fw-bold`}></div>
                <div className={`${style?.WASTAGE} border-end p-1 text-end fw-bold`}></div>
                <div className={`${style?.GOLDRate} border-end p-1 text-end fw-bold`}></div>
                <div className={`${style?.PUREWT} border-end p-1 text-end fw-bold`}>6.543</div>
                <div className={`${style?.TOTALMISC} border-end p-1 text-end fw-bold`}>540.00</div>
                <div className={`${style?.GOLDAMOUNT} border-end p-1 text-end fw-bold`}>42,528.46</div>
                <div className={`${style?.TOTALAMT} p-1 text-end fw-bold`}>45,659.54</div>
            </div>
            {/* summary */}
            <div className="my-1 d-flex">
                <div className="col-8 pe-1">
                    <div className="border">
                        <p className="lightGrey p-1 fw-bold text-center">Summary Detail</p>
                        <div className="d-grid p-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                            <div className="d-flex"><div className="col-9">BRIDAL MS | Regular </div><div className="col-1">:</div><div className="col-2">1</div></div>
                            <div className="d-flex"><div className="col-9">Necklace | Necklace </div><div className="col-1">:</div><div className="col-2">3</div></div>
                            <div className="d-flex"><div className="col-9">Ring | Light Weight </div><div className="col-1">:</div><div className="col-2">1</div></div>
                            <div className="d-flex"><div className="col-9">Star Jewellery | Star Diamond</div><div className="col-1">:</div><div className="col-2">1</div></div>
                            <div className="d-flex"><div className="col-9">woman bangel | Bangles </div><div className="col-1">:</div><div className="col-2">1</div></div>
                        </div>
                    </div>
                </div>
                <div className="ps-1 col-4">
                    <div className='p-1 border h-100'>
                        <div className="d-flex justify-content-between">
                            <p>IGST @ 0.25%</p>
                            <p>199.16</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className='fw-bold'>Less</p>
                            <p className='fw-bold'>-0.98</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* total */}
            <div className="mb-1 border lightGrey d-flex">
                <div className="col-8 text-end p-1 PS-2">
                    <p className="fw-bold">TOTAL</p>
                </div>
                <div className="col-4 p-1 ps-2">
                    <div className="d-flex justify-content-between">
                        <p>CASH :</p>
                        <p className='fw-bold'>79,860.27</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p>Gold in 24K :</p>
                        <p className='fw-bold'>36.935</p>
                    </div>
                </div>
            </div>
            {/* summary */}
            <div className="d-flex justify-content-between">
                <div className="col-6 pe-1">
                    <div className="border">
                        <p className="fw-bold lightGrey p-1">SUMMARY</p>
                        <div className="d-flex justify-content-between">
                            <div className="col-6 px-1 border-end pb-4 position-relative">
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold">GOLD IN 24KT</p>
                                    <p>36.935 gm</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold">GROSS WT	</p>
                                    <p>54.380 gm</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold">NET WT </p>
                                    <p>47.323 gm	</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold">MINA/KUNDAN	</p>
                                    <p>4 / 1.050 gm	</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold">STONE WT</p>
                                    <p>13 / 5.000 ctw	</p>
                                </div>
                                <div className="d-flex justify-content-between lightGrey position-absolute start-0 bottom-0 w-100 px-1 py-1">
                                    <p className="fw-bold">STONE WT</p>
                                    <p>13 / 5.000 ctw	</p>
                                </div>
                            </div>
                            <div className="col-6 px-1 pb-4 position-relative">
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold">GOLD</p>
                                    <p>36.935 gm</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold">MINA/KUNDAN	</p>
                                    <p>54.380 gm</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold">CST </p>
                                    <p>47.323 gm	</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold">MAKING	</p>
                                    <p>4 / 1.050 gm	</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold">OTHER</p>
                                    <p>13 / 5.000 ctw	</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold">LESS</p>
                                    <p>13 / 5.000 ctw	</p>
                                </div>
                                <div className="d-flex justify-content-between lightGrey position-absolute start-0 bottom-0 w-100 px-1 py-1">
                                    <p className="fw-bold">STONE WT</p>
                                    <p>13 / 5.000 ctw	</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 ps-1">
                    <div className="border h-100">
                        <div className="d-flex lightGrey">
                            <p className={`fw-bold ${style?.w_20} text-center p-1`}>Metal Type</p>
                            <p className={`fw-bold ${style?.w_20} text-center p-1`}>GWt (gm)</p>
                            <p className={`fw-bold ${style?.w_20} text-center p-1`}>Net Wt (gm)</p>
                            <p className={`fw-bold ${style?.w_20} text-center p-1`}>Pure Wt (gm)</p>
                            <p className={`fw-bold ${style?.w_20} text-center p-1`}>Gold Amount</p>
                        </div>
                        <div className="d-flex ">
                            <p className={`${style?.w_20} text-center p-1`}>GOLD 18K</p>
                            <p className={`${style?.w_20} text-center p-1`}>54.380</p>
                            <p className={`${style?.w_20} text-center p-1`}>47.323</p>
                            <p className={`${style?.w_20} text-center p-1`}>36.935</p>
                            <p className={`${style?.w_20} text-center p-1`}>60,357.63</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* note */}
            <div className="my-1 border p-1">
                <p className="fw-bold">NOTE :</p>
                1.I/We hereby certify that my/our registration certificate under the Goods And Service Tax Act 2017. Is in force on the date on which the sale of the goods specified in the tax invoice has been effected by me/us & it shall accounted for in the turnover of sales while filing of return & the due tax.If any payable on the sale has been paid or shall be paids.
                2.Returns of goods are subject to Terms & Conditions as mentioned in www.orail.com.
                3.The support is limited to working hours.
                4.Any case disapprency to jurdisory of state of gujarat.
            </div>
            {/* print remark */}
            <div>
                <p><span className="fw-bold">REMARKS :</span> React print remark_Test</p>
            </div>
            {/* TERMS INCLUDED : */}
            <div className='pb-2'>
                <p className="fw-bold">TERMS INCLUDED :</p>
                <div className="d-flex border">
                    <div className='text-center pt-5 border-end col-6'>
                        <p className='fw-bold'>RECEIVER'S SIGNATURE & SEAL</p>
                    </div>
                    <div className='text-center pt-5 col-6'>
                        <p className='fw-bold'>for,Classmate corporation Pvt Ltd</p>
                    </div>
                </div>
            </div>
            {/* metal table */}
            <div className="d-flex border">
                <div className={`${style?.metalCol} p-1 fw-bold text-center border-end`}>Metal Type</div>
                <div className={`${style?.metalCol} p-1 fw-bold text-center border-end`}>Gwt</div>
                <div className={`${style?.metalCol} p-1 fw-bold text-center border-end`}>Net wt</div>
                <div className={`${style?.metalCol} p-1 fw-bold text-center border-end`}>Tunch</div>
                <div className={`${style?.metalCol} p-1 fw-bold text-center border-end`}>Pure wt</div>
                <div className={`${style?.metalCol} p-1 fw-bold text-center border-end`}>Gold Price 24 kt</div>
                <div className={`${style?.metalCol} p-1 fw-bold text-center`}>Gold Amount</div>
            </div>
            <div className="d-flex border-start border-end border-bottom">
                <div className={`${style?.metalCol} p-1 text-center border-end`}>GOLD 18K</div>
                <div className={`${style?.metalCol} p-1 text-end border-end`}>54.380</div>
                <div className={`${style?.metalCol} p-1 text-end border-end`}>47.323</div>
                <div className={`${style?.metalCol} p-1 text-end border-end`}>76.000</div>
                <div className={`${style?.metalCol} p-1 text-end border-end`}>35.965</div>
                <div className={`${style?.metalCol} p-1 text-end border-end`}>600.00</div>
                <div className={`${style?.metalCol} p-1 text-end`}>60357.62</div>
            </div>
            {/* metal table total */}
            <div className="d-flex border-start border-end border-bottom lightGrey">
                <div className={`${style?.metalCol} p-1 fw-bold text-center border-end`}>GOLD 18K</div>
                <div className={`${style?.metalCol} p-1 fw-bold text-end border-end`}>54.380</div>
                <div className={`${style?.metalCol} p-1 fw-bold text-end border-end`}>47.323</div>
                <div className={`${style?.metalCol} p-1 fw-bold text-end border-end`}>76.000</div>
                <div className={`${style?.metalCol} p-1 fw-bold text-end border-end`}>35.965</div>
                <div className={`${style?.metalCol} p-1 fw-bold text-end border-end`}>600.00</div>
                <div className={`${style?.metalCol} p-1 fw-bold text-end`}>60357.62</div>
            </div>
            {/* misc and colorstone tables */}
            <div className="d-flex mt-1">
                <div className="col-6 pe-1">
                    <div className="border d-flex">
                        <div className='fw-bold col-3 text-center p-1 border-end'>Misc Type</div>
                        <div className='fw-bold col-3 text-center p-1 border-end'>Misc Ctw</div>
                        <div className='fw-bold col-3 text-center p-1 border-end'>Misc Price</div>
                        <div className='fw-bold col-3 text-center p-1'>Misc Amount</div>
                    </div>
                    <div className="border-start border-end border-bottom d-flex">
                        <div className='col-3 text-center p-1 border-end'>MISC</div>
                        <div className='col-3 text-center p-1 border-end'>0.550</div>
                        <div className='col-3 text-center p-1 border-end'>0.00</div>
                        <div className='col-3 text-center p-1'>0.00</div>
                    </div>
                    <div className="border-start border-end border-bottom d-flex">
                        <div className='col-3 text-center p-1 border-end'>MISC</div>
                        <div className='col-3 text-center p-1 border-end'>0.550</div>
                        <div className='col-3 text-center p-1 border-end'>0.00</div>
                        <div className='col-3 text-center p-1'>0.00</div>
                    </div>
                    <div className="border-start border-end border-bottom d-flex lightGrey">
                        <div className='col-3 text-end p-1 border-end fw-bold'> Total</div>
                        <div className='col-3 text-center p-1 border-end fw-bold'>3.050</div>
                        <div className='col-3 text-center p-1 border-end fw-bold'></div>
                        <div className='col-3 text-center p-1 fw-bold'> 540.00</div>
                    </div>
                </div>
                <div className="col-6 ps-1">
                    <div className="border d-flex">
                        <div className='fw-bold col-3 text-center p-1 border-end'>CS Type</div>
                        <div className='fw-bold col-3 text-center p-1 border-end'>CS Ctw</div>
                        <div className='fw-bold col-3 text-center p-1 border-end'>CS Price</div>
                        <div className='fw-bold col-3 text-center p-1'>CS Amount</div>
                    </div>
                    <div className="border-start border-end border-bottom d-flex">
                        <div className='col-3 text-center p-1 border-end'>MISC</div>
                        <div className='col-3 text-center p-1 border-end'>0.550</div>
                        <div className='col-3 text-center p-1 border-end'>0.00</div>
                        <div className='col-3 text-center p-1'>0.00</div>
                    </div>
                    <div className="border-start border-end border-bottom d-flex">
                        <div className='col-3 text-center p-1 border-end'>MISC</div>
                        <div className='col-3 text-center p-1 border-end'>0.550</div>
                        <div className='col-3 text-center p-1 border-end'>0.00</div>
                        <div className='col-3 text-center p-1'>0.00</div>
                    </div>
                    <div className="border-start border-end border-bottom d-flex lightGrey">
                        <div className='col-3 text-end p-1 border-end fw-bold'> </div>
                        <div className='col-3 text-center p-1 border-end fw-bold'>3.050</div>
                        <div className='col-3 text-center p-1 border-end fw-bold'></div>
                        <div className='col-3 text-center p-1 fw-bold'> 540.00</div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
        </p>
    );
}

export default Summary9