import React, { useEffect, useState } from 'react'
import { apiCall, handlePrint, isObjectEmpty, taxGenrator } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import style from "../../assets/css/prints/ExportInvoice.module.css";

const ExportInvoice = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const loadData = (data) => {
        console.log(data);
    };

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
        };
        sendData();
    }, []);

    return (<>
        {loader ? <Loader /> : msg === "" ? <div className={`container max_width_container ${style?.exportInvoice} mt-1 pad_60_allPrint px-1`}>
            {/* Print Button */}
            <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} pt-4 pb-4`}>
                <div className="form-check">
                    <input
                        type="button"
                        className="btn_white blue me-0"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            <div>
                {/* Heading */}
                <div className="bgGrey p-1">
                    <p className="fs-5 text-uppercase text-white p-1 text-center fw-bold text-decoration-underline lh-1">Export invoice</p>
                    <p className="fs-6 text-uppercase text-white p-1 text-center text-decoration-underline lh-1 fw-semibold">Supply meant for export on payment of integrated tax</p>
                </div>
             <div className='border-black border'>
                   {/* company details */}
                   <div className="d-flex border-top border-bottom border-black">
                    <div className='p-2 col-6 border-end border-black'>
                        <div className="d-flex justify-content-between">
                            <p className="text-decoration-underline fw-semibold"> Exporter </p>
                            {/* <p className="text-decoration-underline"> Ref. Person Details </p> */}
                        </div>
                        <p className='fs-5 fw-bold py-1'>GatiSoftTech</p>
                        <p className='fw-semibold'>61, Bethany Circle, Closter</p>
                        <p className='fw-semibold'>NJ-07624-1665,</p>
                        <p className='fw-semibold'>New Jersy, New Jersy, USA</p>
                        <p className='fw-semibold'>Telephone No :</p>
                        <p className='fw-semibold'>Email Id :</p>
                    </div>
                    <div className='col-6'>
                        <div className='d-flex border-bottom border-black'>
                            <div className="col-6 border-end border-black p-2">
                                <div className="d-flex">
                                    <p className='pe-2 fw-semibold'>Invoice No :</p>
                                    <p className='fw-bold'>EXP0002</p>
                                </div>
                                <div className="d-flex">
                                    <p className='pe-2 fw-semibold'>Invoice Dt :</p>
                                    <p className='fw-bold'>28-06-19</p>
                                </div>
                                <div className="d-flex">
                                    <p className='pe-2 fw-semibold'>EDF No. :</p>
                                    <p className='fw-bold'></p>
                                </div>
                            </div>
                            <div className="col-6 d-flex flex-column justify-content-between align-items-center p-2">
                                <p className='text-uppercase fw-semibold'>Exporter's reference</p>
                                <p className='text-uppercase fw-semibold'>under Chapter 4</p>
                            </div>
                        </div>
                        <div className='p-2'>
                            <p className="fw-bold">Buyer's Order No. & Date</p>
                            <p className="fw-semibold">Performa inv. No :</p>
                        </div>
                    </div>
                </div>
                {/* customner details */}
                <div className="d-flex border-bottom border-black">
                    <div className='p-2 col-6 border-end border-black'>
                        <div className="d-flex justify-content-between">
                            <p className="text-decoration-underline fw-semibold"> Consignee </p>
                            <p className="text-decoration-underline fw-semibold"> Ref. Person Details </p>
                        </div>
                        <p className='fs-5 fw-bold py-1'>GatiSoftTech</p>
                        <p className='fw-semibold'>61, Bethany Circle, Closter</p>
                        <p className='fw-semibold'>NJ-07624-1665,</p>
                        <p className='fw-semibold'>New Jersy, New Jersy, USA</p>
                        <p className='fw-semibold'>Telephone No :</p>
                        <p className='fw-semibold'>Email Id :</p>
                    </div>
                    <div className='col-6'>
                        <div className='d-flex border-bottom border-black'>
                            <div className="col-6 border-end border-black p-2">
                                <div className="d-flex">
                                    <p className='pe-2 fw-semibold'>Other Reference(s) :</p>
                                    <p className='fw-bold'>PAN-AAJFT1263F</p>
                                </div>
                            </div>
                            <div className="col-6 p-2">
                                <div className="d-flex">
                                    <p className='pe-2 fw-semibold'>IEC No. :</p>
                                    <p className='fw-bold'>5214006365</p>
                                </div>
                                <p className='pe-2 fw-semibold'>GSTIN-24AAJFT1263FIZD</p>
                            </div>
                        </div>
                        <div className='p-2'>
                            <p className="fw-bold">Buyer (if other than consignee)</p>
                        </div>
                    </div>
                </div>
                {/* pre-carriage by */}
                <div className="d-flex border-bottom border-black">
                    <div className='col-6 border-end border-black'>
                        <div className="d-flex border-bottom border-black">
                            <div className="col-6 pt-1 px-1 pb-4 border-end border-black">
                                <p className="fw-semibold">Pre-Carriage By </p>
                            </div>
                            <div className="col-6 pt-1 px-1 pb-4">
                                <p className="fw-semibold">Place of Receipt by Pre-carrier N.A. </p>
                            </div>
                        </div>
                        <div className="d-flex border-bottom border-black">
                            <div className="col-6 pt-1 px-1 pb-4 border-end border-black">
                                <p className="fw-semibold">Vessel/Flight No.</p>
                            </div>
                            <div className="col-6 pt-1 px-1 pb-4">
                                <p className="fw-semibold">Port of Loading</p>
                            </div>
                        </div>
                        <div className="d-flex border-bottom border-black">
                            <div className="col-6 pt-1 px-1 pb-4 border-end border-black">
                                <p className="fw-semibold">Port of Discharge</p>
                            </div>
                            <div className="col-6 pt-1 px-1 pb-4">
                                <p className="fw-semibold">Final Destination</p>
                            </div>
                        </div>
                        <div className={`d-flex ${style?.min_height41_59}`}>
                            <div className="col-4 border-end border-black p-1 text-center">
                                <p className="fw-semibold">Marks & Nos. AS ADDRESS</p>
                            </div>
                            <div className="col-4 border-end border-black p-1 text-center">
                                <p className="fw-semibold">No & KIND OF PKGS</p>
                            </div>
                            <div className="col-4 p-1 text-center">
                                <p className="fw-semibold">QUANTITY 2</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-6'>
                        <div className="d-flex border-black border-bottom">
                            <div className="col-6 p-2 border-black border-end">
                                <p className="fw-semibold text-center">Country of Origin of Goods </p>
                                <p className="fw-bold text-center pt-1">INDIA</p>
                            </div>
                            <div className="col-6 py-2">
                                <p className="fw-semibold text-center">Country of Final Destination</p>
                            </div>
                        </div>
                        <div className="d-flex border-black border-bottom">
                            <div className="col-6 p-2">
                                <p className="fw-semibold"> Terms of Delivery and payment </p>
                                <p className="fw-semibold"> Bank Name :  </p>
                                <p className={`fw-semibold ${style?.min_height34}`}> Bank Add : </p>
                            </div>
                            <div className="col-6 p-2">
                                <div className="d-flex">
                                    <div className="col-6">
                                        <p className="fw-semibold text-end"> Payment Terms : </p>
                                        <p className="fw-semibold text-end"> A/C No. : </p>
                                    </div>
                                    <div className="col-6">
                                        <p className="fw-semibold"> </p>
                                        <p className="fw-semibold"> </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex">
                            <p className="px-2 pt-1  fw-semibold"> Description of Goods </p>
                        </div>
                    </div>
                </div>
                {/* Blank-Line */}
                <div className="d-flex border-bottom border-black pb-4"></div>
                {/* table header */}
                <div className="d-flex border-bottom border-black">
                    <div className={`${style?.rtgs} p-1 text-center border-end border-black`}><p className='fw-semibold h-100'>RITC (IIS) Code</p></div>
                    <div className={`${style?.srNo} p-1 text-center border-end border-black`}><p className='fw-semibold h-100'></p></div>
                    <div className={`${style?.goods} p-1 text-center`}><p className='fw-semibold'>Description of Goods</p></div>
                    <div className={`${style?.kt} p-1 text-center border-end border-black border-start`}><p className='fw-semibold h-100'>KT</p></div>
                    <div className={`${style?.pcs} p-1 text-center border-end border-black`}><p className='fw-semibold h-100'>Pcs</p></div>
                    <div className={`${style?.grossWt} p-1 text-center border-end border-black`}><p className='fw-semibold h-100'>Gross Wt</p></div>
                    <div className={`${style?.NetWt} p-1 text-center`}><p className='fw-semibold h-100'>Net Wt</p></div>
                    <div className={`${style?.Rate} text-center border-end border-black`}><p className='fw-semibold border-start border-black p-1 h-100'>Rate ($)</p></div>
                    <div className={`${style?.value} p-1 text-center`}><p className='fw-semibold h-100'>Value ($)</p></div>
                </div>
                {/* table data */}
                <div className="d-flex border-black border_left">
                    <div className={`${style?.rtgs} text-center`} style={{ borderRight: "1px solid #ffffff00 !important" }}><p className='fw-semibold p-1'>71131910</p></div>
                    <div className={`${style?.srNo} text-center`} style={{ borderRight: "1px solid #ffffff00 !important" }}><p className='fw-semibold p-1'>{`1)`}</p></div>
                    <div className={`${style?.goods} text-center`}><p className='fw-semibold p-1'>18K plain Gold Jewellery</p></div>
                    <div className={`${style?.kt} text-center border-end border-black border-start`}><p className='fw-semibold p-1'>18K</p></div>
                    <div className={`${style?.pcs} text-center border-end border-black`}><p className='fw-semibold p-1'>1</p></div>
                    <div className={`${style?.grossWt} text-center border-end border-black`}><p className='fw-semibold p-1'>1.99</p></div>
                    <div className={`${style?.NetWt} text-center`}><p className='fw-semibold p-1'>1.99</p></div>
                    <div className={`${style?.Rate} text-center border-end border-black`}><p className='fw-semibold border-start border-black p-1 h-100'>27.14</p></div>
                    <div className={`${style?.value} text-center border-black`}><p className='fw-semibold p-1'>68.22</p></div>
                </div>
                <div className="d-flex border-black border_left">
                    <div className={`${style?.rtgs} text-center`} style={{ borderRight: "1px solid #ffffff00 !important" }}><p className='fw-semibold  p-1'>71131910</p></div>
                    <div className={`${style?.srNo} text-center`} style={{ borderRight: "1px solid #ffffff00 !important" }}><p className='fw-semibold  p-1'>{`2)`}</p></div>
                    <div className={`${style?.goods} text-center`}><p className='fw-semibold  p-1'>18K plain Gold Jewellery</p></div>
                    <div className={`${style?.kt} border-bottom text-center border-end border-black border-start`}><p className='fw-semibold  p-1'>14K</p></div>
                    <div className={`${style?.pcs} border-bottom text-center border-end border-black`}><p className='fw-semibold  p-1'>1</p></div>
                    <div className={`${style?.grossWt} border-bottom text-center border-end border-black`}><p className='fw-semibold  p-1'>1.99</p></div>
                    <div className={`${style?.NetWt} border-bottom text-center border-black`}><p className='fw-semibold  p-1'>1.99</p></div>
                    <div className={`${style?.Rate} border-bottom text-center border-end border-black`}><p className='fw-semibold border-start border-black p-1 h-100'>27.14</p></div>
                    <div className={`${style?.value}  border-bottom text-center border-black`}><p className='fw-semibold p-1'>68.22</p></div>
                </div>
                {/* table total */}
                <div className="d-flex border_left">
                    <div className={`${style?.small} `}>
                        <div className="d-flex pb-4">
                            <div className="col-5  border-black border-top h-100">
                                <p className="fw-semibold border-start border-bottom border-black px-2 py-1">Item</p>
                                <p className="fw-semibold border-start border-black px-2 py-1">Baby Bracelet</p>
                                <p className="fw-semibold border-start border-bottom border-black px-2 py-1">Earning</p>
                                <p className="fw-semibold border-start border-bottom border-black px-2 py-1">Total</p>
                            </div>
                            <div className="col-3 border-black border-top">
                                <p className="fw-semibold border-bottom border-start border-end border-black px-2 py-1">KT</p>
                                <p className="fw-semibold border-start border-end border-black px-2 py-1">18K</p>
                                <p className="fw-semibold border-bottom border-start border-end border-black px-2 py-1">14K</p>
                                <p className="fw-semibold border-bottom border-start border-end border-black px-2 py-1" style={{ minHeight: "25.36px" }}></p>
                            </div>
                            <div className="col-3 border-black  border-top">
                                <p className="fw-semibold border-end border-bottom border-black px-2 py-1">QTY</p>
                                <p className="fw-semibold border-end border-black px-2 py-1">1</p>
                                <p className="fw-semibold border-end border-bottom border-black px-2 py-1">1</p>
                                <p className="fw-semibold border-end border-bottom border-black px-2 py-1" style={{ minHeight: "25.36px" }}>2</p>
                            </div>
                        </div>
                        <div className="d-flex border border-black">
                            <div className={`${style?.w_20} border-end border-black d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">Total USD</p></div>
                            <div className={`${style?.w_20} border-end border-black d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">RBI  Exch. Rate</p></div>
                            <div className={`${style?.w_20} border-end border-black d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">Taxable Val INR</p></div>
                            <div className={`${style?.w_20} border-end border-black d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">IGST</p></div>
                            <div className={`${style?.w_20} d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">IGST INR</p></div>
                        </div>
                        <div className="d-flex border-start border-end border-bottom border-black">
                            <div className={`${style?.w_20} border-end border-black d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">173.59</p></div>
                            <div className={`${style?.w_20} border-end border-black d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">69.70</p></div>
                            <div className={`${style?.w_20} border-end border-black d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">12099.22</p></div>
                            <div className={`${style?.w_20} border-end border-black d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">3%</p></div>
                            <div className={`${style?.w_20} d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">362.98</p></div>
                        </div>
                        <div className="py-2">
                            <div className="d-flex border border-black">
                                <div className='col-4 border-end border-black'>
                                    <p className="fw-semibold p-1 border-bottom border-black">
                                        Gold Purchased from
                                    </p>
                                    <p className="fw-semibold p-1">
                                        Invoice No. & Date
                                    </p>
                                </div>
                                <div className='col-8'></div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style?.kt} border-black border-start border-end h-100`}>
                        <p className='fw-semibold text-center border-black border-bottom p-1'>Total</p>
                    </div>
                    <div className={`${style?.pcs} border-black border-end h-100`} style={{ width: "6.99%", minWidth: "6.99%", }}>
                        <p className='fw-semibold text-center border-black border-bottom p-1'>2</p>
                    </div>
                    <div className={`${style?.grossWt} border-black border-end h-100`} style={{ width: "9.99%", minWidth: "9.99%", }}>
                        <p className='fw-semibold text-center border-black border-bottom p-1'>3.44</p>
                    </div>
                    <div className={`${style?.NetWt} border-black h-100`} style={{ width: "9.99%", minWidth: "9.99%", }}>
                        <p className='fw-semibold text-center border-black border-bottom p-1'>3.43</p>
                    </div>
                    <div className={`${style?.Rate} border-black border-end h-100`} style={{ width: "16.9%", minWidth: "16.9%", }}>
                        <p className='fw-semibold p-1 text-center border-black border-bottom border-start text-uppercase'>GOLD VALUE</p>
                        <p className='fw-semibold p-1 text-center border-black border-bottom border-start text-uppercase'>Studding Value</p>
                        <p className='fw-semibold p-1 text-center border-black border-bottom border-start text-uppercase'>making value</p>
                        <p className='fw-semibold p-1 text-center border-black border-bottom border-start text-uppercase'>fob us $</p>
                        <p className='fw-semibold p-1 text-center border-black border-bottom border-start text-uppercase'>freight</p>
                        <p className='fw-semibold p-1 text-center border-black border-bottom border-start text-uppercase'>cif us $</p>
                    </div>
                    <div className={`${style?.value} border-black h-100 `} style={{ width: "10.2%", minWidth: "10.2%", }}>
                        <p className='fw-semibold text-center border-black border-bottom p-1'>107.27</p>
                        <p className='fw-semibold text-center border-black border-bottom p-1'>21.52</p>
                        <p className='fw-semibold text-center border-black border-bottom p-1'>13.43</p>
                        <p className='fw-semibold text-center border-black border-bottom p-1'>173.59</p>
                        <p className='fw-semibold text-center border-black border-bottom p-1'>250.00</p>
                        <p className='fw-semibold text-center border-black border-bottom p-1'>428.80</p>
                    </div>
                </div>
                {/* Amount chargable */}
                <p className="fw-semibold px-2"> Amount Chargable : </p>
                <p className="fw-medium px-2"> CIF US $:- FOUR HUNDRED TWENTY EIGHT AND EIGHTY Cent ONLY </p>
                <div className="d-flex justify-content-between pb-3 pt-2">
                    <p className='fw-semibold px-2'>GJEPC CERT.NO.</p>
                    <p className='fw-semibold px-2'>DATE: 28-06-19</p>
                    <p className='fw-semibold px-2'>RATE US$ : 1405.70</p>
                    <p className='fw-semibold px-2'>PER Toz FOR 0.9999 FINE GOLD</p>
                </div>
                {/* table header */}
                <div className="border-top border-bottom d-flex border-black">
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Gold KT</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Gold Gr Wt Gms</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Gold Nt Wt Gms</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Total Gold Wt Gms</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Gold Rate in US$</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Gold Value US$</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Net Gold Fine 999 Gms</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Total Gold 999 Gms</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">VA %</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Making Charges US$</p></div>
                    <div className={`${style?.smallstudding} border-end border-black`}>
                        <div className="d-grid h-100">
                            <div className="d-flex border-black border-bottom d-flex justify-content-center align-items-center">
                                <p className="fw-semibold  text-center">Studding Value $</p>
                            </div>
                            <div className="d-flex">
                                <div className="col-4 d-flex justify-content-center align-items-center border-end border-black"><p className="fw-semibold text-center">Type</p></div>
                                <div className="col-4 d-flex justify-content-center align-items-center border-end border-black"><p className="fw-semibold text-center">Wt cts</p></div>
                                <div className="col-4 d-flex justify-content-center align-items-center"><p className="fw-semibold text-center">Value US$</p></div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style?.smallgold} d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Total FOB US$</p></div>
                </div>
                {/* table data */}
                <div className="border-bottom d-flex border-black">
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">14K</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">1.45</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">1.44</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">1.44</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">27.12</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">39.05</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">0.86</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">0.86</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">22.17</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">13.43</p></div>
                    <div className={`${style?.smallstudding} border-end border-black`}>
                        <div className="d-grid h-100">
                            <div className="d-flex">
                                <div className="col-4 d-flex justify-content-center align-items-center border-end border-black"><p className="fw-semibold text-center">Dia</p></div>
                                <div className="col-4 d-flex justify-content-center align-items-center border-end border-black"><p className="fw-semibold text-center">0.05</p></div>
                                <div className="col-4 d-flex justify-content-center align-items-center"><p className="fw-semibold text-center">21.52</p></div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style?.smallgold} d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">173.59</p></div>
                </div>
                <div className="border-bottom d-flex border-black">
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">14K</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">1.45</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">1.44</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">1.44</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">27.12</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">39.05</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">0.86</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">0.86</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">22.17</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">13.43</p></div>
                    <div className={`${style?.smallstudding} border-end border-black`}>
                        <div className="d-grid h-100">
                            <div className="d-flex">
                                <div className="col-4 d-flex justify-content-center align-items-center border-end border-black"><p className="fw-semibold text-center">Dia</p></div>
                                <div className="col-4 d-flex justify-content-center align-items-center border-end border-black"><p className="fw-semibold text-center">0.05</p></div>
                                <div className="col-4 d-flex justify-content-center align-items-center"><p className="fw-semibold text-center">21.52</p></div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style?.smallgold} d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">173.59</p></div>
                </div>
                {/* table total */}
                <div className=" border-bottom d-flex border-black">
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center"></p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">1.45</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">1.44</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">1.44</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">27.12</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">39.05</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">0.86</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">0.86</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">22.17</p></div>
                    <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">13.43</p></div>
                    <div className={`${style?.smallstudding} border-end border-black`}>
                        <div className="d-grid h-100">
                            <div className="d-flex">
                                <div className="col-4 d-flex justify-content-center align-items-center border-end border-black"><p className="fw-bold text-center">Dia</p></div>
                                <div className="col-4 d-flex justify-content-center align-items-center border-end border-black"><p className="fw-bold text-center">0.05</p></div>
                                <div className="col-4 d-flex justify-content-center align-items-center"><p className="fw-bold text-center">21.52</p></div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style?.smallgold} d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">173.59</p></div>
                </div>
                {/* signature */}
                <div className="pt-5">
                    <p className="fw-bold pb-2 px-2">
                        the diamonds herein invoices have been purchased from legitimate Sources not involved in funding conflict and in compliance with UN Resolution - The Seller
                        hereby guranatee that these diamonds and conflict free based on personal knowledge and the written guarantee provided by supplier of these diamonds.
                    </p>
                    <p className="fw-medium text-uppercase text-center px-2">
                        door to door insurance covered by <span className='text-lowercase'>bmc vama</span>
                    </p>
                    <div className="d-flex pt-4">
                        <div className="col-6 px-2">
                            <p className="fw-bold pb-1">Declaration : </p>
                           <p className="fw-medium"> We declare that this invoice shows the actual price of the goods described and that all particulars are true correct.</p>
                        </div>
                        <div className="col-6 border-start border-top border-black d-flex p-2" style={{minHeight: "65px"}}>
                            <div className="col-4 d-flex flex-column justify-content-between">
                            <p className="fw-semibold">Signature & Date</p>
                            <p className="fw-semibold">Authorised Sign</p>
                            </div>
                            <div className="col-4">
                               <p className="fw-semibold"> 28-06-19</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
            </div>
        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
    </>
    );
}

export default ExportInvoice
