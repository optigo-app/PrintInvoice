import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/InvoicePrint8.module.css";
import Loader from '../../components/Loader';
import {
    HeaderComponent,
    NumberWithCommas,
    apiCall,
    handleImageError,
    handlePrint,
    isObjectEmpty,
    taxGenrator,
} from "../../GlobalFunctions";

const InvoicePrint8 = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [image, setImage] = useState(false);
    const [header, setHeader] = useState(null);

    const loadData = (data) => {
        let head = HeaderComponent("1", data?.BillPrint_Json[0]);
        setHeader(head);
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
        loader ? <Loader /> : msg === "" ? <>
            <div className={`container max_width_container ${style?.invoiceprint8} mt-5 pad_60_allPrint px-1`}>
                {/* buttons */}
                <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4">
                    <div className="form-check pe-3 ">
                        <input className="form-check-input border-dark" type="checkbox" checked={image} onChange={e => setImage(!image)} />
                        <label className="form-check-label ">
                            With Image
                        </label>
                    </div>
                    <div className="form-check ps-3">
                        <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* header */}
                {header}
                {/* sub header */}
                <div className="d-flex border">
                    <div className="col-4 border-end p-2">
                        <p>Bill To,</p>
                        <p className="fw-bold">Dar Be Gold Jewelers</p>
                        <p>45/2 sangram shopping center</p>
                        <p>Chowk bazaar</p>
                        <p>lucknow394405</p>
                        <p>Hiralvasoya@vg.com</p>
                        <p>GSTIN-24FFFF0000B1J64 | PAN-DGJIF543D</p>
                        <p>STATE CODE-24</p>
                    </div>
                    <div className="col-4 border-end p-2">

                        <p>Ship To,</p>
                        <p className='fw-bold'>Dar Be Gold Jewelers</p>
                        <p>Hiral Vasoya</p>
                        <p>405 hari om society, Sai point</p>
                        <p>surat, Gujarat</p>
                        <p>India-395461</p>
                        <p>Mobile No : 984-563-2514</p>
                    </div>
                    <div className="col-4 p-2">
                        <div className='d-flex'><p className="fw-bold col-6">BILL NO</p> <p className='col-6'>	SK19532022</p></div>
                        <div className='d-flex'><p className="fw-bold col-6">DATE</p> <p className='col-6'>	12 Jan 2024</p></div>
                        <div className='d-flex'><p className="fw-bold col-6">HSN</p> <p className='col-6'>	85213</p></div>
                        <div className='d-flex'><p className="fw-bold col-6">NAME OF GOODS</p> <p className='col-6'>	Jewellery</p></div>
                        <div className='d-flex'><p className="fw-bold col-6">PLACE OF SUPPLY</p> <p className='col-6'>	Karnataka</p></div>
                        <div className='d-flex'><p className="fw-bold col-6">TERMS</p> <p className='col-6'>	7</p></div>
                    </div>
                </div>
                {/* table header */}
                <div className="d-flex border-start border-end border-bottom">
                    <div className="col-4 border-end px-1"><p className="fw-bold text-center">DESCRIPTION</p></div>
                    <div className="col-8 d-flex px-1">
                        <p className={`fw-bold text-center ${style?.Detail}`}>Detail</p>
                        <p className={`fw-bold text-center ${style?.Gross}`}>Gross Wt.</p>
                        <p className={`fw-bold text-center ${style?.Net}`}>Net Wt.</p>
                        <p className={`fw-bold text-center ${style?.Pcs}`}>Pcs</p>
                        <p className={`fw-bold text-center ${style?.Qty}`}>Qty</p>
                        <p className={`fw-bold text-center ${style?.Rate}`}>Rate</p>
                        <p className={`fw-bold text-center ${style?.Amount}`}>Amount</p>
                    </div>
                </div>
                {/* table data */}
                <div className="d-flex border-start border-end border-bottom">
                    <div className="col-4 border-end px-1 d-flex justify-content-center align-items-center flex-column"><p className=" text-center">DIAMOND STUDDED JEWELLERY</p><p className="fw-bold text-center">Total Pcs : 7</p></div>
                    <div className="col-8 px-1">
                        <div className="d-flex">
                            <p className={` ${style?.Detail}`}>GOLD 18K</p>
                            <p className={`text-end ${style?.Gross}`}>30.760 Gms</p>
                            <p className={`text-end ${style?.Net}`}>25.854 Gms	</p>
                            <p className={`text-end ${style?.Pcs}`}>120</p>
                            <p className={`text-end ${style?.Qty}`}>25.600 Ctw</p>
                            <p className={`text-end ${style?.Rate}`}>5,700.00</p>
                            <p className={`text-end ${style?.Amount}`}>1,47,367.80</p>
                        </div>
                        <div className="d-flex">
                            <p className={` ${style?.Detail}`}>GOLD 18K</p>
                            <p className={`text-end ${style?.Gross}`}>30.760 Gms</p>
                            <p className={`text-end ${style?.Net}`}>25.854 Gms	</p>
                            <p className={`text-end ${style?.Pcs}`}>120</p>
                            <p className={`text-end ${style?.Qty}`}>25.600 Ctw</p>
                            <p className={`text-end ${style?.Rate}`}>5,700.00</p>
                            <p className={`text-end ${style?.Amount}`}>1,47,367.80</p>
                        </div>
                        <div className="d-flex">
                            <p className={` ${style?.Detail}`}>GOLD 18K</p>
                            <p className={`text-end ${style?.Gross}`}>30.760 Gms</p>
                            <p className={`text-end ${style?.Net}`}>25.854 Gms	</p>
                            <p className={`text-end ${style?.Pcs}`}>120</p>
                            <p className={`text-end ${style?.Qty}`}>25.600 Ctw</p>
                            <p className={`text-end ${style?.Rate}`}>5,700.00</p>
                            <p className={`text-end ${style?.Amount}`}>1,47,367.80</p>
                        </div>
                        <div className="d-flex">
                            <p className={` ${style?.Detail}`}>GOLD 18K</p>
                            <p className={`text-end ${style?.Gross}`}>30.760 Gms</p>
                            <p className={`text-end ${style?.Net}`}>25.854 Gms	</p>
                            <p className={`text-end ${style?.Pcs}`}>120</p>
                            <p className={`text-end ${style?.Qty}`}>25.600 Ctw</p>
                            <p className={`text-end ${style?.Rate}`}>5,700.00</p>
                            <p className={`text-end ${style?.Amount}`}>1,47,367.80</p>
                        </div>
                        <div className="d-flex">
                            <p className={` ${style?.Detail}`}>GOLD 18K</p>
                            <p className={`text-end ${style?.Gross}`}>30.760 Gms</p>
                            <p className={`text-end ${style?.Net}`}>25.854 Gms	</p>
                            <p className={`text-end ${style?.Pcs}`}>120</p>
                            <p className={`text-end ${style?.Qty}`}>25.600 Ctw</p>
                            <p className={`text-end ${style?.Rate}`}>5,700.00</p>
                            <p className={`text-end ${style?.Amount}`}>1,47,367.80</p>
                        </div>
                        <div className="d-flex">
                            <p className={` ${style?.Detail}`}>GOLD 18K</p>
                            <p className={`text-end ${style?.Gross}`}>30.760 Gms</p>
                            <p className={`text-end ${style?.Net}`}>25.854 Gms	</p>
                            <p className={`text-end ${style?.Pcs}`}>120</p>
                            <p className={`text-end ${style?.Qty}`}>25.600 Ctw</p>
                            <p className={`text-end ${style?.Rate}`}>5,700.00</p>
                            <p className={`text-end ${style?.Amount}`}>1,47,367.80</p>
                        </div>

                        <div className="d-flex">
                            <p className={` ${style?.Detail}`}>GOLD 18K</p>
                            <p className={`text-end ${style?.Gross}`}>30.760 Gms</p>
                            <p className={`text-end ${style?.Net}`}>25.854 Gms	</p>
                            <p className={`text-end ${style?.Pcs}`}>120</p>
                            <p className={`text-end ${style?.Qty}`}>25.600 Ctw</p>
                            <p className={`text-end ${style?.Rate}`}>5,700.00</p>
                            <p className={`text-end ${style?.Amount}`}>1,47,367.80</p>
                        </div>
                        <div className="d-flex">
                            <p className={` ${style?.Detail}`}>GOLD 18K</p>
                            <p className={`text-end ${style?.Gross}`}>30.760 Gms</p>
                            <p className={`text-end ${style?.Net}`}>25.854 Gms	</p>
                            <p className={`text-end ${style?.Pcs}`}>120</p>
                            <p className={`text-end ${style?.Qty}`}>25.600 Ctw</p>
                            <p className={`text-end ${style?.Rate}`}>5,700.00</p>
                            <p className={`text-end ${style?.Amount}`}>1,47,367.80</p>
                        </div>
                    </div>
                </div>
                {/* table total */}
                <div className="d-flex border-start border-end border-bottom">
                    <div className="col-4 border-end px-1 d-flex justify-content-center align-items-center flex-column"><p className=" text-center"></p></div>
                    <div className="col-8 p-1 d-flex justify-content-between">
                        <p className={` ${style?.Detail} fw-bold`}>Total</p>
                        <p className={`text-end ${style?.Amount} fw-bold`}>1,47,367.80</p>
                    </div>
                </div>
                {/* table taxes */}
                <div className="d-flex border-start border-end border-bottom">
                    <div className="col-8 border-end"></div>
                    <div className="col-4 d-flex">
                        <div className="col-6 px-1">
                            <p>Discount</p>
                            <p className='fw-bold'>Total Amount</p>
                            <p>CGST @ 0.13%</p>
                            <p>SGST @ 0.13%</p>
                            <p>Less</p>
                        </div>
                        <div className="col-6 text-end px-1">
                            <p>1,857.50</p>
                            <p className='fw-bold'>2,75,000.18</p>
                            <p>357.37</p>
                            <p>357.37</p>
                            <p>-0.92</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default InvoicePrint8
