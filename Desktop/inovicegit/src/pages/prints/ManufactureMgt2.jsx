import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/manufacturemgt.module.css";
import Loader from '../../components/Loader';
import { FooterComponent, HeaderComponent, NumberWithCommas, apiCall, handleImageError, handlePrint, isObjectEmpty } from '../../GlobalFunctions';

const ManufactureMgt = ({ token, invoiceNo, printName, urls, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [headerComp, setHeaderComp] = useState(null);
    const [headerData, setHeaderData] = useState({});
    const [data, setData] = useState([]);

    const loadData = (data) => {
        setHeaderData(data?.BillPrint_Json[0]);
        let headerDatas = data?.BillPrint_Json[0];
        let head = HeaderComponent(2, headerDatas);
        setHeaderComp(head);

        let resultArr = [];
        data?.BillPrint_Json1.forEach((e, i) => {
            let obj = { ...e };
            let metalColorCode = "";
            let diamonds = [];
            let colorStones = [];
            let miscs = [];

            let diamondWt = 0;
            let colorWt = 0;
            let miscWt = 0;

            data?.BillPrint_Json2.forEach((ele, ind) => {
                if (ele?.StockBarcode === e?.SrJobno) {
                    if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                        if (ele?.IsPrimaryMetal === 1) {
                            metalColorCode = ele?.MetalColorCode;
                        } else if (metalColorCode === "") {
                            metalColorCode = ele?.MetalColorCode;
                        }
                    } else if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
                        // let findDiamonds = 
                        diamondWt += ele?.Wt;
                        diamonds.push(ele);
                    } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
                        colorWt += ele?.Wt;
                        colorStones.push(ele);
                    } else if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
                        miscWt += ele?.Wt;
                        miscs.push(ele);
                    }
                }
            });

            obj.metalColorCode = metalColorCode;
            obj.diamonds = diamonds;
            obj.diamondWt = diamondWt;
            obj.colorWt = colorWt;
            obj.miscWt = miscWt;
            obj.colorStones = colorStones;
            obj.miscs = miscs;

            resultArr.push(obj);
        });
        setData(resultArr)
    }

    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls, evn);
                if (data?.Status === '200' && evn === "alteration") {
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
                {/* buttons */}
                <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}>
                    <div className="form-check ps-3">
                        <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* company address */}
                {headerComp}
                {/* customer address */}
                <div className="mt-1 p-2 border-top d-flex">
                    <div className="col-6">
                        <p>To,</p>
                        <p className='fs-6 fw-bold'>{headerData?.customerfirmname}</p>
                        <p>{headerData?.customerstreet}</p>
                        <p>{headerData?.customerregion}</p>
                        <p>{headerData?.customercity}-{headerData?.customerpincode}</p>
                        <p>Tel: {headerData?.customermobileno}</p>
                        <p>{headerData?.customeremail1}</p>
                    </div>
                    <div className="col-6 d-flex justify-content-end">
                        <div className="col-8 d-flex flex-column justify-content-center pe-4">
                            <p>Invoice#: <span className="fw-bold">{headerData?.InvoiceNo}</span> Dated <span className="fw-bold">{headerData?.EntryDate}</span></p>
                            <p>Due Date: <span className="fw-bold">{headerData?.DueDate}</span></p>
                            {/* <p>GSTIN: <span className="fw-bold">24</span> | {headerData?.Cust_CST_STATE} <span className="fw-bold">{headerData?.Cust_CST_STATE_No}</span></p> */}
                        </div>
                    </div>
                </div>
                <div className="pt-2">
                    {/* Table Header */}
                    <div className="d-flex border lightGrey">
                        <div className="col-1 border-end">
                            <p className="fw-bold p-1 text-center">SR NO</p>
                        </div>
                        <div className="col-3 border-end">
                            <p className="fw-bold p-1 text-center">ITEM CODE</p>
                        </div>
                        <div className="col-8">
                            <p className="fw-bold p-1 text-center">DESCRIPTION</p>
                        </div>
                    </div>
                    {/* Table Data */}
                    {data.map((e, i) => {
                        return <div className="d-flex border-start border-bottom border-end" key={i}>
                            <div className="col-1 border-end">
                                <p className="fw-bold p-1">{i + 1}</p>
                            </div>
                            <div className="col-3 border-end">
                                <p className=" p-1"> Job: {e?.SrJobno} </p>
                                <p className=" p-1"> Design: {e?.designno} </p>
                                <img src={e?.DesignImage} alt="" className={`${style?.img_manufacture} p-1`} onError={handleImageError} />
                            </div>
                            <div className="col-8">
                                <p className="fw-bold p-1 text_secondary">RECEIVED JEWELLERY</p>
                                <p className="px-1 pb-1 pt-2">{e?.MetalTypePurity} {e?.metalColorCode} |
                                    {NumberWithCommas(e?.grosswt, 3)} gms GW |
                                    {NumberWithCommas(e?.NetWt, 3)} gms NW |
                                    DIA: {NumberWithCommas(e?.diamondWt, 3)} Cts |
                                    CS: {NumberWithCommas(e?.colorWt, 3)}Cts |
                                    MISC: {NumberWithCommas(e?.miscWt, 3)} gms </p>

                                {e?.diamonds.map((ele, ind) => {
                                    return <p key={ind} className='p-1'>{ele?.MasterManagement_DiamondStoneTypeName}: {ele?.Pcs} PCs | {ele?.Wt} Cts | {ele?.ShapeName} {ele?.QualityName} {ele?.Colorname} </p>
                                })}

                                {e?.colorStones.map((ele, ind) => {
                                    return <p key={ind} className='p-1'>{ele?.MasterManagement_DiamondStoneTypeName}: {ele?.Pcs} PCs | {ele?.Wt} Cts | {ele?.ShapeName} {ele?.QualityName} {ele?.Colorname} </p>
                                })}

                                {e?.miscs.map((ele, ind) => {
                                    return <p key={ind} className='p-1'>{ele?.MasterManagement_DiamondStoneTypeName}: {ele?.Pcs} PCs | {ele?.Wt} gms | {ele?.ShapeName} {ele?.QualityName} {ele?.Colorname} </p>
                                })}

                            </div>
                        </div>
                    })}
                    {/* signature */}
                    <div className={`d-flex border-start border-bottom border-end ${style?.height_manufacture}`}>
                        <div className="col-6 p-2 d-flex justify-content-between flex-column border-end position-relative">
                            <p>Signature :</p>
                            <p className="fw-bold">{headerData?.customerfirmname}</p>
                            {/* <p className={`position-absolute ${style?.blankArea} bgGrey border-start border-bottom`}></p> */}
                        </div>
                        <div className="col-6 p-2 d-flex justify-content-between flex-column position-relative">
                            <p>Signature :</p>
                            <p className="fw-bold">{headerData?.CompanyFullName}</p>
                            {/* <p className={`position-absolute ${style?.blankArea} bgGrey border-start border-end border-bottom`}></p> */}
                        </div>
                    </div>
                </div>
            </div> :
            <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default ManufactureMgt



