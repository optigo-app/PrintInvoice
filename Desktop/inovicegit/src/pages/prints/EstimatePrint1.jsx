import React from 'react'
import { apiCall, handlePrint, isObjectEmpty, otherAmountDetail } from '../../GlobalFunctions';
import { useState } from 'react';
import { useEffect } from 'react';
import Loader from '../../components/Loader';
import style from "../../assets/css/prints/estimatePrint1.module.css";

const EstimatePrint1 = ({ token, invoiceNo, printName, urls, evn }) => {

    const [image, setImage] = useState(true);
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [json0Data, setJson0Data] = useState({});
    const [document, setDocument] = useState([]);

    const loadData = (data) => {
        setJson0Data(data?.BillPrint_Json[0]);
        let documnets = otherAmountDetail(data?.BillPrint_Json[0]?.DocumentDetail);
        console.log(data);
        setDocument(documnets);

        let dataArr = [];
        data?.BillPrint_Json1.forEach((e, i) => {
            console.log(e);
        })

    }

    const handleChange = (e) => {
        image ? setImage(false) : setImage(true);
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
    return (<>
        {loader ? <Loader /> : msg === "" ? <div className={`container max_width_container pad_60_allPrint ${style?.estimate1Container}`}>
            {/* print button */}
            <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} pb-4 mt-5 w-100`}>
                <div className="form-check pe-3 mb-0">
                    <input className="form-check-input border-dark" type="checkbox" checked={image} onChange={e => handleChange(e)} name='image' />
                    <label className="form-check-label h6 mb-0 pt-1">
                        With Image
                    </label>
                </div>
                <div className="form-check ps-3">
                    <input type="button" className="btn_white blue mt-0 py-1" value="Print" onClick={(e) => handlePrint(e)} />
                </div>
            </div>
            {/* gst no  */}
            <div className='d-flex justify-content-center pt-2'>
                <p>{json0Data?.Company_VAT_GST_No} | {json0Data?.Company_CST_STATE}-{json0Data?.Company_CST_STATE_No} | PAN-{json0Data?.Pannumber}</p>
            </div>
            {/* print name */}
            <div className="border p-1 border-2 min_height_label bgGrey text-center" >
                <p className='text-uppercase fw-bold text-white'>{json0Data?.PrintHeadLabel}</p>
            </div>
            {/* customer detail */}
            <div className="my-1 border border-black d-flex">
                <div className="col-7 p-2 border-end">
                    <p>Customer Name : <span className="fw-bold">{json0Data?.CustName}</span></p>
                    <p>{json0Data?.customerAddress1}</p>
                    <p>{json0Data?.customerAddress2}</p>
                    <p>{json0Data?.customercity}-{json0Data?.customerpincode}</p>
                    <p>{json0Data?.customercountry}</p>
                    <p>{json0Data?.customeremail1}</p>
                    <p>Phno:{json0Data?.customermobileno}</p>
                    <p>{json0Data?.vat_cst_pan} | Aadhar-{json0Data?.aadharno}</p>
                    <p>{json0Data?.Cust_CST_STATE} {json0Data?.Cust_CST_STATE_No}</p>
                </div>
                <div className="col-5 p-2">
                    <p><span className="fw-bold">INVOICE NO </span>{json0Data?.InvoiceNo}  </p>
                    <p><span className="fw-bold">DATE </span>{json0Data?.DueDate} </p>
                    {document.map((e, i) => {
                        return <p key={i}><span className="fw-bold">{e?.label} </span>{e?.value}  </p>
                    })}
                </div>
            </div>
            {/* table header */}
            <div className="border d-flex">
                <div className="col-3 d-flex">
                    <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center"><p className="fw-bold">Sr#</p></div>
                    <div className="col-6 p-1 border-end d-flex align-items-center justify-content-center"><p className="fw-bold text-center">Product Description</p></div>
                    <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center"><p className="fw-bold">HSN</p></div>
                </div>
                <div className='col-6'>
                    <div className="d-grid h-100 w-100 border-end">
                        <div className="d-flex align-items-center justify-content-center w-100 border-bottom"><p className="fw-bold">Material Description</p></div>
                        <div className="d-flex align-items-center justify-content-center w-100">
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className='fw-bold'>Material</p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className='fw-bold'>Carat</p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className='fw-bold'>GWT</p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className='fw-bold'>LESS WT.</p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className='fw-bold'>NWT</p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1'><p className='fw-bold'>Rate</p></div>
                        </div>
                    </div>
                </div>
                <div className="col-3 d-flex">
                    <div className="col-4 p-1 border-end d-flex align-items-center justify-content-center"><p className="fw-bold">Making</p></div>
                    <div className="col-4 p-1 border-end d-flex align-items-center justify-content-center"><p className="fw-bold text-center">Material Charges</p></div>
                    <div className="col-4 p-1 d-flex align-items-center justify-content-center"><p className="fw-bold">Total</p></div>
                </div>
            </div>
            {/* table data */}
            <div className="border-start border-bottom border-end d-flex no_break">
                <div className="col-3 d-flex">
                    <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center"><p className="">1</p></div>
                    <div className="col-6 p-1 border-end">
                        <p> LITE WEIGHT  Ring</p>
                        <p>1829 | 1/15263</p>
                        {image && <img src="http://zen/R50B3/UFS/ufs2/orail228FT0OWNGEI6DC3BVS/Design_Image/Gj6nwcTL0pMDE0OTIyNg==/Red_Thumb/0149226_04112023155022392.jpg" alt="" className={`w-100 ${style?.img}`} />}
                        <p className="text-center" p>HUID-FGH5324</p>
                    </div>
                    <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center"><p className="">{json0Data?.HSN_No}</p></div>
                </div>
                <div className='col-6'>
                    <div className="d-grid h-100 border-end">
                        <div className="d-flex border-bottom">
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''>GOLD	</p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''>18K	</p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''>15.000	</p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''>LESS WT.</p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''>15.000</p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1'><p className=''>380.00</p></div>
                        </div>
                        <div className="d-flex">
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''>Other Charge	</p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''>	</p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''></p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''></p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className=''></p></div>
                            <div className='col-2 d-flex align-items-center justify-content-center p-1'><p className=''></p></div>
                        </div>
                    </div>
                </div>
                <div className="col-3 d-flex">
                    <div className="col-4 p-1 border-end d-flex align-items-center justify-content-center"><p className="">200.00</p></div>
                    <div className="col-4 border-end d-flex align-items-center justify-content-center">
                        <div className="d-grid h-100 w-100">
                            <div className="d-flex align-items-center justify-content-end p-1 border-bottom"><p className=''>5,700.00		</p> </div>
                            <div className="d-flex align-items-center justify-content-end p-1 border-bottom"><p className=''>157.00 </p> </div>
                        </div>
                    </div>
                    <div className="col-4 p-1 d-flex align-items-center justify-content-end"><p className="">10,607.00</p></div>
                </div>
            </div>
            {/* table total */}
            <div className="border-start border-bottom border-end d-flex no_break">
                <div className="col-3 d-flex">
                    <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center"></div>
                    <div className="col-6 p-1 border-end d-flex align-items-center">
                        <p className='fw-bold fs-6'>TOTAL</p>
                    </div>
                    <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center"></div>
                </div>
                <div className='col-6 d-flex border-end'>
                    <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'></div>
                    <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'></div>
                    <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className="fw-bold">26.523</p></div>
                    <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end'><p className='fw-bold'>8.064 Ctw	</p></div>
                    <div className='col-2 d-flex align-items-center justify-content-center p-1 border-end flex-column'>
                        <p className='fw-bold'>0.500 gm </p>
                        <p className='fw-bold'>24.810</p>
                    </div>
                    <div className='col-2 d-flex align-items-center justify-content-center p-1'><p className=''></p></div>
                </div>
                <div className="col-3 d-flex">
                    <div className="col-4 p-1 border-end d-flex align-items-center justify-content-center"></div>
                    <div className="col-4 border-end d-flex align-items-center justify-content-end p-1"> <p className='fw-bold'>5,700.00		</p> </div>
                    <div className="col-4 p-1 d-flex align-items-center justify-content-end"><p className="fw-bold">10,607.00</p></div>
                </div>
            </div>
            {/* tax */}
            <div className="border-start border-bottom border-end d-flex no_break">
                <div className="col-9 border-end">
                    <div className="d-grid w-100 h-100">
                        <div className="border-bottom p-1">
                            <p>Narration / Remark: <span className="fw-bold">Task 342 & 320 Estiamte Print bill</span></p>
                        </div>
                        <div className="p-1">
                            <p>Old Gold Purchase Description : </p>
                        </div>
                    </div>
                </div>

                <div className="col-2 border-end">
                    <p className='p-1'>Discount</p>
                    <p className='p-1'>Total Amt. before Tax</p>
                    <p className='p-1'>CGST @ 0.13%</p>
                    <p className='p-1'>SGST @ 0.13%</p>
                    <p className='p-1'>Less</p>
                    <p className='p-1'>Total Amt. after Tax</p>
                    <p className='p-1'>Old Gold</p>
                    <p className='p-1'>Advance</p>
                    <p className='p-1'>Recv.in Cash</p>
                    <p className='p-1'>Recv.in Bank</p>
                    <p className='p-1'>Net Bal. Amount</p>
                </div>
                <div className="col-1 ">
                    <p className='p-1 text-end'>0.00</p>
                    <p className='p-1 text-end'>19,200.20</p>
                    <p className='p-1 text-end'>24.96</p>
                    <p className='p-1 text-end'>24.96</p>
                    <p className='p-1 text-end'>-0.12</p>
                    <p className='p-1 text-end'>19,250.00</p>
                    <p className='p-1 text-end'>0.00</p>
                    <p className='p-1 text-end'>0.00</p>
                    <p className='p-1 text-end'>0.00</p>
                    <p className='p-1 text-end'>0.00</p>
                    <p className='p-1 text-end'>19,250.00</p>
                </div>
            </div>
            {/* grand total */}
            <div className="border-start border-bottom border-end d-flex no_break">
                <div className="col-9 p-1 border-end">
                    <p className=''>In Words Indian Rupees</p>
                    <p className=''>Nineteen Thousand Two Hundred and Fifty Only</p>
                </div>
                <div className="col-2 border-end d-flex align-items-center p-1">
                    <p className="fw-bold">GRAND TOTAL	</p>
                </div>
                <div className="col-1 d-flex align-items-center justify-content-end p-1">
                    <p className="fw-bold">₹ 19,250.00</p>
                </div>
            </div>
            {/* remark */}
            <div className="border-start border-bottom border-end d-flex pt-2 no_break">
                <div dangerouslySetInnerHTML={{ __html: json0Data?.Declaration }}></div>
            </div>
            {/* bank detail */}
            <div className="border-start border-bottom border-end d-flex no_break">
                <div className="col-4 p-2 border-end">
                    <p className='fw-bold'>Bank Detail</p>
                    <p>Bank Name:{json0Data?.bankname}</p>
                    <p>Branch: {json0Data?.bankaddress}</p>
                    <p>Account Name: {json0Data?.accountname}</p>
                    <p>Account No. : {json0Data?.accountnumber}</p>
                    <p>RTGS/NEFT IFSC: {json0Data?.rtgs_neft_ifsc}</p>
                </div>
                <div className="col-4 d-flex flex-column justify-content-between p-2 border-end">
                    <p>Signature</p>
                    <p className='fw-bold'>{json0Data?.customerfirmname}</p>
                </div>
                <div className="col-4 d-flex flex-column justify-content-between p-2">
                    <p>Signature</p>
                    <p className='fw-bold'>{json0Data?.CompanyFullName}</p>
                </div>
            </div>

        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
    </>
    )
}



export default EstimatePrint1;




// customerfirmname
// CompanyFullName