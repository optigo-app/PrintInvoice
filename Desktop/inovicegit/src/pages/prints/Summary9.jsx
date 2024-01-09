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
                <p>INVOICE# : <span className="fw-bold">SK19082022</span></p>
                <p>DATE : <span className="fw-bold">29 Dec 2023</span></p>
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
            <div className="d-flex border-start border-end border-bottom">
                <div className={`${style?.SR} text-center border-end p-1`}>1</div>
                <div className={`${style?.DESIGN} fw-bold  border-end p-1`}>
                    <p>1/16344 - Ring</p>
                    <img src="http://zen/lib/jo/28/images/default.jpg" alt="" className='w-100 imgWidth' />
                    <p> GOLD 18K</p>
                    <p>HUID-JHFGDJD</p>
                </div>
                <div className={`${style?.STONE}   border-end d-flex`}>
                    <div className="col-3  p-1 border-end">ASH</div>
                    <div className="col-3  p-1 border-end text-end">7/3.000</div>
                    <div className="col-3  p-1 border-end text-end">160.00</div>
                    <div className="col-3  p-1 text-end">480.00</div>
                </div>
                <div className={`${style?.GWT} border-end p-1 text-end`}>10.230</div>
                <div className={`${style?.NWT} border-end p-1 text-end`}>8.609</div>
                <div className={`${style?.PURITY} border-end p-1 text-end`}>76.000</div>
                <div className={`${style?.WASTAGE} border-end p-1 text-end`}>0.000</div>
                <div className={`${style?.GOLDRate} border-end p-1 text-end`}>4940.00</div>
                <div className={`${style?.PUREWT} border-end p-1 text-end`}>6.543</div>
                <div className={`${style?.TOTALMISC} border-end p-1 text-end`}>540.00</div>
                <div className={`${style?.GOLDAMOUNT} border-end p-1 text-end`}>42,528.46</div>
                <div className={`${style?.TOTALAMT} p-1 text-end`}>45,659.54</div>
            </div>
            {/* table total */}
            <div className="d-flex border-start border-end border-bottom lightGrey">
                <div className={`${style?.tableTotal} text-center border-end p-1 fw-bold`}>TOTAL</div>
                <div className={`${style?.STONE}   border-end d-flex`}>
                    <div className="col-3  p-1 border-end"></div>
                    <div className="col-3  p-1 border-end text-end fw-bold">7/3.000</div>
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
                <div className="col-6 p-1">
                    <div className="border">
                        <p className="fw-bold text-center lightGrey p-1"></p>
                        <div className="d-flex justify-content-between"></div>
                    </div>
                </div>
                <div className="col-6 p-1">
                    <div className="border">

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