import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/manufacturemgt.module.css";
import Loader from '../../components/Loader';
import { FooterComponent, HeaderComponent, apiCall, isObjectEmpty } from '../../GlobalFunctions';

const ManufactureMgt = ({ token, invoiceNo, printName, urls, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [headerComp, setHeaderComp] = useState(null);
    const [headerData, setHeaderData] = useState({});

    const loadData = (data) => {
        console.log(data);
        setHeaderData(data?.BillPrint_Json[0]);
        let headerDatas = data?.BillPrint_Json[0];
        let head = HeaderComponent(2, headerDatas);
        setHeaderComp(head);
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
        loader ? <Loader /> : msg === "" ?
            <div className={`container-fluid max_width_container pt-2 ${style?.manufacture_container} pad_60_allPrint`}>
                {headerComp}
                <div className="pt-2">
                    {/* Table Header */}
                    <div className="d-flex border">
                        <div className="col-2 border-end">
                            <p className="fw-bold p-1">SR NO</p>
                        </div>
                        <div className="col-3 border-end">
                            <p className="fw-bold p-1">ITEM CODE</p>
                        </div>
                        <div className="col-7">
                            <p className="fw-bold p-1">DESCRIPTION</p>
                        </div>
                    </div>
                    {/* Table Data */}
                    <div className="d-flex border-start border-bottom border-end">
                        <div className="col-2 border-end">
                            <p className="fw-bold p-1">1</p>
                        </div>
                        <div className="col-3 border-end">
                            <p className="fw-bold p-1"> Job: 1/14361 </p>
                            <p className="fw-bold p-1"> Design: 1537 </p>
                            <img src="https://resize.indiatvnews.com/en/resize/newbucket/400_-/2018/01/jewellery-1515647069.jpg" alt="" className={`${style?.img_manufacture} p-1`} />
                            <p className="fw-bold p-1"> 23 </p>
                        </div>
                        <div className="col-7">
                            <p className="fw-bold p-1 text-secondary">ISSUE JEWELLERY</p>
                            <p className="px-1 py-2">GOLD 18K YW53 | 9.095 gms GW | 3.256 gms NW | DIA: 2.243 Cts | CS: 0.540 Cts | MISC: 7.525 gms </p>
                            <p className="pt-2 px-1 pb-1 fw-bold text-decoration">REMARKS :</p>
                            <p className="p-1">design wise remark</p>
                        </div>
                    </div>
                    <div className="d-flex border-start border-bottom border-end">
                        <div className="col-2 border-end">
                            <p className="fw-bold p-1">1</p>
                        </div>
                        <div className="col-3 border-end">
                            <p className="fw-bold p-1"> Job: 1/14361 </p>
                            <p className="fw-bold p-1"> Design: 1537 </p>
                            <img src="https://resize.indiatvnews.com/en/resize/newbucket/400_-/2018/01/jewellery-1515647069.jpg" alt="" className={`${style?.img_manufacture} p-1`} />
                            <p className="fw-bold p-1"> 23 </p>
                        </div>
                        <div className="col-7">
                            <p className="fw-bold p-1 text-secondary">ISSUE JEWELLERY</p>
                            <p className="px-1 py-2">GOLD 18K YW53 | 9.095 gms GW | 3.256 gms NW | DIA: 2.243 Cts | CS: 0.540 Cts | MISC: 7.525 gms </p>
                            <p className="pt-2 px-1 pb-1 fw-bold text-decoration">REMARKS :</p>
                            <p className="p-1">design wise remark</p>
                        </div>
                    </div>
                    <div className="d-flex border-start border-bottom border-end">
                        <div className="col-2 border-end">
                            <p className="fw-bold p-1">1</p>
                        </div>
                        <div className="col-3 border-end">
                            <p className="fw-bold p-1"> Job: 1/14361 </p>
                            <p className="fw-bold p-1"> Design: 1537 </p>
                            <img src="https://resize.indiatvnews.com/en/resize/newbucket/400_-/2018/01/jewellery-1515647069.jpg" alt="" className={`${style?.img_manufacture} p-1`} />
                            <p className="fw-bold p-1"> 23 </p>
                        </div>
                        <div className="col-7">
                            <p className="fw-bold p-1 text-secondary">ISSUE JEWELLERY</p>
                            <p className="px-1 py-2">GOLD 18K YW53 | 9.095 gms GW | 3.256 gms NW | DIA: 2.243 Cts | CS: 0.540 Cts | MISC: 7.525 gms </p>
                            <p className="pt-2 px-1 pb-1 fw-bold text-decoration">REMARKS :</p>
                            <p className="p-1">design wise remark</p>
                        </div>
                    </div>
                    {/* signature */}
                    <div className={`d-flex border-start border-bottom border-end ${style?.height_manufacture} pad_20_allPrint`}>
                        <div className="col-6 p-2 d-flex justify-content-between flex-column border-end position-relative">
                            <p>Signature :</p>
                            <p className="fw-bold">{headerData?.CustName}</p>
                            <p className={`position-absolute ${style?.blankArea} bgGrey border-start border-bottom`}></p>
                        </div>
                        <div className="col-6 p-2 d-flex justify-content-between flex-column position-relative">
                            <p>Signature :</p>
                            <p className="fw-bold">{headerData?.CompanyFullName}</p>
                            <p className={`position-absolute ${style?.blankArea} bgGrey border-start border-end border-bottom`}></p>
                        </div>
                    </div>
                </div>
            </div> :
            <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default ManufactureMgt




// ORAIL SERVICE Shangai-La Plaza Mall Nagpur
// Nagpur-605001, Maharashtra (India)
// T 78945612301
// darren@orail.co.in | www.optigoapps.com
// GSTIN-22AAAAA0000A125 STATE CODE-22 | PAN-EDJHF236D
// To,
// Gopinath Pvt Ltd
// 45.69 Madhav Parl soc,near
// adajan patiya
// Adajdn
// Surat - 395004
// Tel: 872-588-5214
// gopinath@co.in
// Invoice#: SK14812022
// Dated 04 Oct 2023
// HSN: 85213
// Orail
// SR NO
// ITEM CODE
// DESCRIPTION
// 1
// ISSUE JEWELLERY
// Job: 1/14361
// Design: 1537
// GOLD 18K YW53 | 9.095 gms GW | 3.256 gms NW | DIA: 2.243 Cts | CS: 0.540 Cts | MISC: 7.525 gms
// 23
// 2
// Job: 1/14362 Design: 1538
// 26
// Signature
// ISSUE JEWELLERY
// GOLD 18K YW53 | 8.841 gms GW | 3.025 gms NW | DIA: 0.637 Cts CS: 0.694 Cts | MISC: 6.187 gms
// REMARKS
// design wise remark
// Signature
// Kishan Patel
// ORAIL SERVICE