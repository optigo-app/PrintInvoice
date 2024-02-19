import React, { useEffect, useState } from 'react'
import style from "../../assets/css/prints/RetailPrint2.module.css";
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

const RetailPrint2 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
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
        console.log(datas);
        setData(datas);
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
            <div className={`container max_width_container ${style?.retailPrint2} pad_60_allPrint px-1 mt-1 retailPrint2`}>
                {/* buttons */}
                <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
                    <div className="form-check ps-3">
                        <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* header */}
                {header}
                {/* sub header */}
                <div className="d-flex border">
                    <div className="col-4 border-end p-2">
                        <p>{headerData?.lblBillTo} {headerData?.customerfirmname}</p>
                        <p>Address: {headerData?.customerAddress1}</p>
                        <p>{headerData?.customerAddress2}</p>
                        <p>{headerData?.customercity}{headerData?.customerpincode}</p>
                        <p>{headerData?.customeremail1}</p>
                        <p>Phno:{headerData?.customermobileno}</p>
                        <p>{headerData?.vat_cst_pan}</p>
                        <p>{headerData?.Cust_CST_STATE_No_}</p>
                    </div>
                    <div className="col-4 border-end p-2">
                        <p>Shipping Address</p>
                        <p>Address: {headerData?.CustName}</p>
                        <p>{headerData?.customerstreet}</p>
                        <p>{headerData?.customercity1}, {headerData?.customerstate}</p>
                        <p>{headerData?.customercountry}{headerData?.customerpincode}</p>
                        <p>Mobile No : {headerData?.customermobileno}</p>
                        <p>Email : {headerData?.customeremail1}</p>
                    </div>
                    <div className="col-4 p-2">
                        <div className="d-flex">
                            <div className="col-6"><p className="fw-bold"> Tax Invoice No:</p></div>
                            <div className="col-6"><p>: {headerData?.InvoiceNo}</p></div>
                        </div>
                        <div className="d-flex">
                            <div className="col-6"><p className="fw-bold">Date	</p></div>
                            <div className="col-6"><p> : {headerData?.EntryDate}</p></div>
                        </div>
                        <div className="d-flex">
                            <div className="col-6"><p className="fw-bold">{headerData?.HSN_No_Label}/SAC</p></div>
                            <div className="col-6"><p>	: {headerData?.HSN_No}</p></div>
                        </div>
                        <div className="d-flex">
                            <div className="col-6"><p className="fw-bold">Due Date</p></div>
                            <div className="col-6"><p>: {headerData?.DueDate}</p></div>
                        </div>
                    </div>
                </div>
                {/* table header  */}
                <div className="d-flex mt-1 border">
                    <div className={`d-flex justify-content-center align-items-center ${style?.Sr} border-end`}><p className='p-1 fw-bold text-center'>Sr#	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Item} border-end`}><p className='p-1 fw-bold text-center'>Item Name	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Product} border-end`}><p className='p-1 fw-bold text-center'>Product Design	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Design} border-end`}><p className='p-1 fw-bold text-center'>Design No	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.QR} border-end`}><p className='p-1 fw-bold text-center'>QR Code	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Certificate} border-end`}><p className='p-1 fw-bold text-center'>Certificate No IGI & BIS</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Metal} border-end`}><p className='p-1 fw-bold text-center'>Metal Details	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Gross} border-end`}><p className='p-1 fw-bold text-center'>Gross Wt	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Less} border-end`}><p className='p-1 fw-bold text-center'>Less Wt	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Net} border-end`}><p className='p-1 fw-bold text-center'>Net Wt	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DiaQuality} border-end`}><p className='p-1 fw-bold text-center'>Dia Quality	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DiaColor} border-end`}><p className='p-1 fw-bold text-center'>Dia Color	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DiaPcs} border-end`}><p className='p-1 fw-bold text-center'>Dia Pcs	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DiaWt} border-end`}><p className='p-1 fw-bold text-center'>Dia Wt	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.MRP} border-end`}><p className='p-1 fw-bold text-center'>MRP		</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.discountPer} border-end`}><p className='p-1 fw-bold text-center'> Dis %		</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DisAmt} border-end`}><p className='p-1 fw-bold text-center'>Dis Amt	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.TotalAmount} `}><p className='p-1 fw-bold text-center'>Total Amount</p></div>
                </div>
                {/* table body */}
                {
                    data?.resultArray?.map((e, i) => {
                        return <div className="d-flex border-start border-end border-bottom" key={i}>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Sr} border-end`}><p className='p-1 text-center'>{NumberWithCommas(i+1)}</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Item} border-end`}><p className='p-1 text-center'>{e?.Categoryname}</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Product} border-end`}><p className='p-1 text-center'><img className='imgWidth' src={e?.DesignImage} alt="" onError={handleImageError} />	</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Design} border-end`}><p className='p-1 text-center'>{e?.designno}	</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.QR} border-end`}><p className='p-1 text-center'>{e?.SrJobno}	</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Certificate} border-end`}><p className='p-1 text-center'>{e?.CertificateNo}	</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Metal} border-end`}><p className='p-1 text-center'>{e?.MetalTypePurity}</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Gross} border-end`}><p className='p-1 text-center'>8.560	</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Less} border-end`}><p className='p-1 text-center'>0.200	</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Net} border-end`}><p className='p-1 text-center'>7.060	</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.DiaQuality} border-end`}><p className='p-1 text-center'>A1 PD	</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.DiaColor} border-end`}><p className='p-1 text-center'>A2 SI	</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.DiaPcs} border-end`}><p className='p-1 text-center'>4	</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.DiaWt} border-end`}><p className='p-1 text-center'>1.00	</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.MRP} border-end`}><p className='p-1 text-center'>9534.83			</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.discountPer} border-end`}><p className='p-1 text-center'> 0.09		</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.DisAmt} border-end`}><p className='p-1 text-center'>9.03	</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.TotalAmount} `}><p className='p-1 text-center'>9525.80</p></div>
                        </div>
                    })
                }

                {/* table total */}
                <div className="d-flex border-start border-end border-bottom">
                    <div className={`d-flex justify-content-center align-items-center ${style?.Sr} border-end`}><p className='p-1 text-center'>		</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Item} border-end`}><p className='p-1 text-center fw-bold'>TOTAL		</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Product} border-end`}><p className='p-1 text-center'></p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Design} border-end`}><p className='p-1 text-center'>	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.QR} border-end`}><p className='p-1 text-center'></p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Certificate} border-end`}><p className='p-1 text-center'>	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Metal} border-end`}><p className='p-1 text-center'>	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Gross} border-end`}><p className='p-1 text-center fw-bold'>44.550</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Less} border-end`}><p className='p-1 text-center'>	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Net} border-end`}><p className='p-1 text-center fw-bold'>33.033	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DiaQuality} border-end`}><p className='p-1 text-center'></p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DiaColor} border-end`}><p className='p-1 text-center'></p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DiaPcs} border-end`}><p className='p-1 text-center'>	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DiaWt} border-end`}><p className='p-1 text-center fw-bold'>7.73</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.MRP} border-end`}><p className='p-1 text-center fw-bold'>32160.20		</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.discountPer} border-end`}><p className='p-1 text-center fw-bold'> 0.23		</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DisAmt} border-end`}><p className='p-1 text-center fw-bold'>19.11</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.TotalAmount} `}><p className='p-1 text-center fw-bold'>32141.09</p></div>
                </div>
                {/* bank details */}
                <div className="my-1 border d-flex">
                    <div className="col-4 border-end p-2">
                        <p>Value in Words:</p>
                        <p className='fw-bold'>Thirty two thousand two hundred and twenty one point thirty two only</p>
                    </div>
                    <div className="col-4 border-end p-2">
                        Bank Details :
                        Bank Name:Kotak Mahindra Bank
                        Branch: SHOP NO-1 WTC , UDHNA DARWAJA SURAT-395004
                        Account Name:Orail
                        Account No. :147275899632
                        RTGS/NEFT IFSC:Kotak00000405
                    </div>
                    <div className="col-4 p-2">
                        <p className='d-flex justify-content-between'><span>IGST @ 0.25 </span><span> 80.35</span></p>
                        <p className='d-flex justify-content-between'><span>Less        </span><span> -0.12</span></p>
                        <p className='fw-bold d-flex justify-content-between'><span>Bill Amt    </span><span> 32221.32</span></p>
                        <p className='fw-bold d-flex justify-content-between'><span>Grand Total </span><span> 32221.32</span></p>
                    </div>
                </div>
                {/* signature */}
                <div className="border my-1 d-flex">
                    <div className="col-4 d-flex justify-content-between flex-column p-2 border-end">
                        <p className='pb-4'>Signature-Stamp</p>
                        <p className="fw-bold pt-4">Prashant Rajput pvt ltd</p>
                    </div>
                    <div className="col-4 d-flex justify-content-between flex-column p-2 border-end"></div>
                    <div className="col-4 d-flex justify-content-between flex-column p-2">
                        <p className='pb-4'>Signature-Stamp</p>
                        <p className="fw-bold pt-4">ORAIL SERVICE</p>
                    </div>
                </div>
            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default RetailPrint2
