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
    FooterComponent,
} from "../../GlobalFunctions";
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';

const InvoicePrint8 = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [image, setImage] = useState(false);
    const [header, setHeader] = useState(null);
    const [footer, setFooter] = useState(null);
    const [headerData, setHeaderData] = useState({});
    const [label, setlabel] = useState([]);

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
        let metals = [];
        let diamonds = [];
        let colorstone = [];
        let misc = [];
        let othercharges1 = [];
        let othercharges2 = [];
        datas?.resultArray?.forEach((e, i) => {
            let findGold = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1);
            if(findGold !== undefined){
                let findMetals = metals?.findIndex((elem, index) => elem?.metalRate === findGold?.Rate && elem?.MetalTypePurity === e?.MetalTypePurity);
                if(findMetals === -1){
                    let obj = cloneDeep(e);
                    obj.metalRate = findGold?.Rate;
                    obj.metalAmount = findGold?.Amount;
                    obj.metalPcs = findGold?.Pcs;
                    obj.metalWt = findGold?.Wt;
                }else{
                    metals[findMetals].grosswt = e?.grosswt;
                    metals[findMetals].NetWt = e?.NetWt;
                    metals[findMetals].metalAmount = e?.metalAmount;
                }
            }
        });

        data?.BillPrint_Json2?.forEach((ele, ind) => {
            if(ele?.MasterManagement_DiamondStoneTypeid === 1){

            }else if(ele?.MasterManagement_DiamondStoneTypeid === 2){
                
            }else if(ele?.MasterManagement_DiamondStoneTypeid === 3){
                
            }else if(ele?.MasterManagement_DiamondStoneTypeid === 4){
                
            }
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
            <div className={`container max_width_container ${style?.invoiceprint8} pad_60_allPrint px-1 mt-1`}>
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
                        <p>Bill To,</p>
                        <p className="fw-bold">{headerData?.customerfirmname}</p>
                        <p>{headerData?.customerAddress1}</p>
                        <p>{headerData?.customerAddress2}</p>
                        <p>{headerData?.customercity}-{headerData?.PinCode}</p>
                        <p>{headerData?.CompanyEmail}</p>
                        <p>{headerData?.vat_cst_pan}</p>
                        <p>{headerData?.CustGstNo}</p>
                    </div>
                    <div className="col-4 border-end p-2">

                        <p>Ship To,</p>
                        <p className='fw-bold'>{headerData?.customerfirmname}</p>
                        {label?.map((ele, ind) => {
                          return  <p key={ind}>{ele}</p>
                        })}
                    </div> 
                    <div className="col-4 p-2">
                        <div className='d-flex'><p className="fw-bold col-6">BILL NO</p> <p className='col-6'>	{headerData?.InvoiceNo}</p></div>
                        <div className='d-flex'><p className="fw-bold col-6">DATE</p> <p className='col-6'>	{headerData?.EntryDate}</p></div>
                        <div className='d-flex'><p className="fw-bold col-6">{headerData?.HSN_No}</p> <p className='col-6'>	{headerData?.HSN_No_Label}</p></div>
                        <div className='d-flex'><p className="fw-bold col-6">NAME OF GOODS</p> <p className='col-6'>	{headerData?.NameOfGoods}</p></div>
                        <div className='d-flex'><p className="fw-bold col-6">PLACE OF SUPPLY</p> <p className='col-6'>	{headerData?.State}</p></div>
                        <div className='d-flex'><p className="fw-bold col-6">TERMS</p><p className='col-6'>{headerData?.DueDays}</p></div>
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
                {/* Grand Total */}
                <div className="my-1">
                    <div className="border d-flex">
                        <div className="col-8 border-end px-2">
                            <p className="fw-bold">IN Words Indian Rupees</p>
                            <p className="fw-bold">Thirty-Nine Thousand One Hundred and Twenty-One Point Forty-Six Only.</p>
                        </div>
                        <div className="col-4 p-2 d-flex justify-content-between">
                            <p className="fw-bold">Grand Total</p>
                            <p className="fw-bold">39,121.46</p>
                        </div>
                    </div>
                </div>
                {/* Note */}
                <div className="border-start border-end border-bottom px-2">
                    <div dangerouslySetInnerHTML={{__html: headerData?.Declaration}}></div>
                </div>
                {/* print remark */}
                <div className='px-2'>
                    <p><span className="fw-bold">REMARKS : </span> {headerData?.PrintRemark}</p>
                </div>
                {/* note */}
                {footer}
            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default InvoicePrint8
