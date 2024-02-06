import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/InvoicePrint9.module.css";
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
} from "../../GlobalFunctions";

const InvoicePrint9 = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [header, setHeader] = useState(null);
    const [image, setImage] = useState(false);
    const [footer, setFooter] = useState(null);
    const [label, setlabel] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const loadData = (data) => {
        let head = HeaderComponent("1", data?.BillPrint_Json[0]);
        setHeader(head);
        let footers = FooterComponent("2", data?.BillPrint_Json[0]);
        setFooter(footers);
        setHeaderData(data?.BillPrint_Json[0]);
        let printArr = data?.BillPrint_Json[0]?.Printlable.split("\r\n");
        setlabel(printArr);
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
            <div className={`container max_width_container ${style?.invoiceprint9} pad_60_allPrint px-1 mt-1`}>
                {/* buttons */}
                <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
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
                <div className='pb-2 border-bottom'>
                    {header}
                </div>
                {/* print heading */}
                <p className="fs-5 text-center fw-bold">{headerData?.PrintHeadLabel}</p>
                {/* sub header */}
                <div className="border d-flex">
                    <div className="col-8 px-1 py-2 border-end">
                        <p className="fw-bold">Buyer Details,</p>
                        <p className="fw-bold">{headerData?.customerfirmname}</p>
                        <p>{headerData?.customerAddress1}</p>
                        <p>{headerData?.customerAddress2}</p>
                        <p>{headerData?.customerAddress3}</p>
                        <p>{headerData?.customercity1}{headerData?.customerpincode}, {headerData?.State}</p>
                        <p>{headerData?.customeremail1}</p>
                        <p>{headerData?.Cust_CST_STATE} {headerData?.Cust_CST_STATE_No}</p>
                    </div>
                    <div className="col-4 py-2 px-1">
                        <div className="d-flex">
                            <p className='fw-bold col-6'>BILL NO</p>
                            <p className='col-6'>   {headerData?.InvoiceNo}  </p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-6'>DATE</p>
                            <p className='col-6'>   {headerData?.EntryDate}  </p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-6'>GSTIN</p>
                            <p className='col-6'>   {headerData?.CustGstNo}  </p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-6'>PAN NO</p>
                            <p className='col-6'>   {headerData?.CustPanno}  </p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-6'>AADHAR NO</p>
                            <p className='col-6'>  {headerData?.aadharno}   </p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-6'>FOREIGN PASSPORT</p>
                            <p className='col-6'>     </p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-6'>DRIVING LICENCE</p>
                            <p className='col-6'>     </p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-6'>MOBILE</p>
                            <p className='col-6'>   {headerData?.customermobileno} [India]  </p>
                        </div>
                    </div>
                </div>
                {/* table header */}
                <div className="d-flex border">
                    <div className={`${style?.Image} px-1`}><p className="fw-bold fs-6">Image	</p></div>
                    <div className={`${style?.SNo} px-1`}><p className="fw-bold fs-6">S.No	</p></div>
                    <div className={`${style?.Description} px-1`}><p className="fw-bold fs-6">Description	</p></div>
                    <div className={`${style?.HSN} px-1`}><p className="fw-bold fs-6">HSN	</p></div>
                    <div className={`${style?.Pcs} px-1`}><p className="fw-bold fs-6 text-end">Pcs	</p></div>
                    <div className={`${style?.GGms} px-1`}><p className="fw-bold fs-6 text-end">G.Gms.Mg	</p></div>
                    <div className={`${style?.Stone} px-1`}><p className="fw-bold fs-6 text-end">Stone Wt	</p></div>
                    <div className={`${style?.NGms} px-1`}><p className="fw-bold fs-6 text-end">N.Gms.Mg	</p></div>
                    <div className={`${style?.Rate} px-1`}><p className="fw-bold fs-6 text-end">Rate	</p></div>
                    <div className={`${style?.VA} px-1`}><p className="fw-bold fs-6 text-end">V.A	</p></div>
                    <div className={`${style?.Amount} px-1`}><p className="fw-bold fs-6 text-end">Amount</p></div>
                </div>
                {/* table data */}
                <div className="d-flex border">
                    <div className={`${style?.Image} px-1 border-end`}>
                        <p className="fw-bold fs-6">1/16601	</p>
                        <img src="http://zen/R50B3/UFS/ufs2/orail228FT0OWNGEI6DC3BVS/Design_Image/bD8ZTq6u5WMDE0ODkxMQ==/Red_Thumb/0148911_22112023120600745.jpg" alt="" className='imgWidth' />
                    </div>
                    <div className={`${style?.SNo} px-1 border-end`}><p className="fw-bold fs-6">1</p></div>
                    <div className={`${style?.Description} px-1`}>
                        <p className="fw-bold fs-6">Regular-18K</p>
                        <p className=" fs-6">DIAMONDS mix vvs Round	</p>
                        <p className=" fs-6">OTHER</p>
                    </div>
                    <div className={`${style?.HSN} px-1`}><p className="fw-bold fs-6">85213</p></div>
                    <div className={`${style?.Pcs} px-1`}>
                        <p className="fw-bold fs-6 text-end">1</p>
                        <p className="fs-6 text-end">5</p>
                    </div>
                    <div className={`${style?.GGms} px-1`}><p className="fw-bold fs-6 text-end">10.000 g</p></div>
                    <div className={`${style?.Stone} px-1`}>
                        <p className="fw-bold fs-6 text-end">0.016 g</p>
                        <p className="fs-6 text-end">0.080 cst</p>
                    </div>
                    <div className={`${style?.NGms} px-1`}><p className="fw-bold fs-6 text-end">9.984 g</p></div>
                    <div className={`${style?.Rate} px-1`}>
                        <p className="fw-bold fs-6 text-end">5,700.00</p>
                        <p className="fs-6 text-end">1,000.00</p>
                    </div>
                    <div className={`${style?.VA} px-1`}><p className="fw-bold fs-6 text-end">2566.80</p></div>
                    <div className={`${style?.Amount} px-1`}>
                        <p className="fw-bold fs-6 text-end">59,475.60</p>
                        <p className="fs-6 text-end"> 80.00 </p>
                    </div>
                </div>
                {/* table total */}
                <div className="d-flex border">
                    <div className={`${style?.Image} px-1 border-end`}>
                        <p className="fw-bold fs-6">1/16601	</p>
                        <img src="http://zen/R50B3/UFS/ufs2/orail228FT0OWNGEI6DC3BVS/Design_Image/bD8ZTq6u5WMDE0ODkxMQ==/Red_Thumb/0148911_22112023120600745.jpg" alt="" className='imgWidth' />
                    </div>
                    <div className={`${style?.SNo} px-1 border-end`}><p className="fw-bold fs-6">1</p></div>
                    <div className={`${style?.Description} px-1`}>
                        <p className="fw-bold fs-6">Regular-18K</p>
                        <p className=" fs-6">DIAMONDS mix vvs Round	</p>
                        <p className=" fs-6">OTHER</p>
                    </div>
                    <div className={`${style?.HSN} px-1`}><p className="fw-bold fs-6">85213</p></div>
                    <div className={`${style?.Pcs} px-1`}>
                        <p className="fw-bold fs-6 text-end">1</p>
                        <p className="fs-6 text-end">5</p>
                    </div>
                    <div className={`${style?.GGms} px-1`}><p className="fw-bold fs-6 text-end">10.000 g</p></div>
                    <div className={`${style?.Stone} px-1`}>
                        <p className="fw-bold fs-6 text-end">0.016 g</p>
                        <p className="fs-6 text-end">0.080 cst</p>
                    </div>
                    <div className={`${style?.NGms} px-1`}><p className="fw-bold fs-6 text-end">9.984 g</p></div>
                    <div className={`${style?.Rate} px-1`}>
                        <p className="fw-bold fs-6 text-end">5,700.00</p>
                        <p className="fs-6 text-end">1,000.00</p>
                    </div>
                    <div className={`${style?.VA} px-1`}><p className="fw-bold fs-6 text-end">2566.80</p></div>
                    <div className={`${style?.Amount} px-1`}>
                        <p className="fw-bold fs-6 text-end">59,475.60</p>
                        <p className="fs-6 text-end"> 80.00 </p>
                    </div>
                </div>
                {/* note */}
                {footer}
            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default InvoicePrint9
