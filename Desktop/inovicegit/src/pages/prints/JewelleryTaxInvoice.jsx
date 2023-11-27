import React, { useEffect, useState } from 'react';
import { HeaderComponent, SubheaderComponent, apiCall, handlePrint, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import style from "../../assets/css/prints/jewelleryTaxInvoice.module.css";

const JewelleryTaxInvoice = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [json0Data, setJson0Data] = useState({});
    const [headerComp, setHeaderComp] = useState(null);
    const [customerDetail, setCustomerDetail] = useState({
        pan: "",
        gst: ""
    })
    const [msg, setMsg] = useState("");

    const loadData = (data) => {
        console.log(data);
        let json0Data = data.BillPrint_Json[0];
        let custDetail = { ...customerDetail };
        let custpanGstArr = data.BillPrint_Json[0]?.vat_cst_pan.split("|");
        let custpans = custpanGstArr[1].split("-");
        let custGst = custpanGstArr[0].split("-");
        custDetail.pan = custpans[1];
        custDetail.gst = custGst[1];
        setCustomerDetail(custDetail);
        setJson0Data(json0Data);
        let head = HeaderComponent(1, json0Data);
        setHeaderComp(head);

        let resultArr = [];
        data?.BillPrint_Json1.forEach((e, i) => {
            let obj = { ...e };
            let materials = [];
            data?.BillPrint_Json2.forEach((ele, ind) => {
                if (obj?.SrJobno === ele?.StockBarcode) {
                    if (ele?.MasterManagement_DiamondStoneTypeid === 1 || ele?.MasterManagement_DiamondStoneTypeid === 2) {
                        let findRecord = materials.findIndex(elem => elem?.MasterManagement_DiamondStoneTypeid === ele?.MasterManagement_DiamondStoneTypeid &&
                            elem?.ShapeName === ele?.ShapeName && elem?.Colorname === ele?.Colorname && elem?.QualityName === ele?.QualityName && elem?.Rate === ele?.Rate);
                            if(findRecord === -1){
                                materials.push(ele);
                            }else{
                                materials[findRecord].Pcs += ele?.Pcs;
                                materials[findRecord].Wt += ele?.Wt;
                                materials[findRecord].Amount += ele?.Amount;
                            }
                    }if(ele?.MasterManagement_DiamondStoneTypeid === 3){
                        console.log(ele);
                    }
                }
            })
        });

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
            <div className={`container max_width_container pad_60_allPrint ${style?.containerJewellery}`}>
                {/* buttons */}
                <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4">
                    <div className="form-check ps-3">
                        <input type="button" className="btn_white blue py-1" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* header */}
                {headerComp}
                {/* sub header */}
                <div className="mt-2 no_break">
                    <div className="border d-flex justify-content-between">
                        <div className="col-6 p-2">
                            <p className='lh-1 pb-1'>To, </p>
                            <p className='fw-semibold lh-1 pb-1'>{json0Data?.CustName}</p>
                            <p className='lh-1 pb-1'>{json0Data?.State},  {json0Data?.PinCode}</p>
                            <p className='lh-1 pb-1'>Tel : {json0Data?.customermobileno}</p>
                            <p className='lh-1 pb-1'>{json0Data?.customeremail1}</p>
                        </div>
                        <div className="col-5 px-2 py-3">
                            <p className='lh-1 pb-1'>Invoice<span className='fw-semibold'>#: {json0Data?.InvoiceNo}</span> </p>
                            <p className='lh-1 pb-1'>PAN<span className='fw-semibold'>#: {customerDetail?.pan}</span> </p>
                            <p className='lh-1 pb-1'>GSTIN <span className='fw-semibold'>{customerDetail?.gst} {(json0Data?.Cust_CST_STATE !== "" && json0Data?.Cust_CST_STATE_No !== "") && <>| {json0Data?.Cust_CST_STATE} {json0Data?.Cust_CST_STATE_No}</>} </span></p>
                            <p className='lh-1 pb-1'>Due Date: <span className='fw-semibold'>{json0Data?.DueDate}</span></p>
                        </div>
                    </div>
                </div>
                {/* table header */}
                <div className="d-flex border lightGrey no_break">
                    <div className="col-1 p-1 border-end"><p className='fw-semibold text-center'>SR NO</p></div>
                    <div className="col-2 p-1 border-end"><p className='fw-semibold text-center'>ITEM CODE</p></div>
                    <div className="col-5 p-1 border-end"><p className='fw-semibold text-center'>DESCRIPTION</p></div>
                    <div className="col-2 p-1 border-end"><p className='fw-semibold text-center'>IMAGE</p></div>
                    <div className="col-2 p-1"><p className='fw-semibold text-center'>AMOUNT (INR)</p></div>
                </div>
                {/* table data */}
                <div className="d-flex border-start border-end border-bottom no_break">
                    <div className="col-1 p-1 border-end"><p className='text-center'>1</p></div>
                    <div className="col-2 p-1 border-end"> <p>Job: 1/3238 </p> <p>Design: <span className="fw-semibold">343</span> </p> </div>
                    <div className="col-5 p-1 border-end"><p className='lh-1 pb-1'>GOLD 24k YL | 50.000 gms GW | 50.000 gms NW </p></div>
                    <div className="col-2 p-1 border-end"><img src="" alt="" className='d-block mx-auto' /></div>
                    <div className="col-2 p-1"><p className='text-end'>₹ 38,500.00 </p></div>
                </div>
            </div>
        </> : <p className='text-danger fs-2 fw-semibold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default JewelleryTaxInvoice;