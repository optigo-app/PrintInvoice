import React, { useEffect, useState } from 'react'
import { CapitalizeWords, apiCall, handleImageError, handlePrint, isObjectEmpty, taxGenrator } from '../../GlobalFunctions';
import "../../assets/css/prints/retailPrint.css";
import Loader from '../../components/Loader';
import { ToWords } from 'to-words';

const RetailPrint = ({ urls, token, invoiceNo, printName, evn }) => {
    const [jsonData1, setJsonData1] = useState({});
    const [dataFill, setDataFill] = useState([]);
    const [total, setTotal] = useState({});
    const [rate, setRate] = useState(true);
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [taxes, setTaxes] = useState([]);
    const toWords = new ToWords();

    const loadData = (data) => {
        setJsonData1(data?.BillPrint_Json[0]);
        let resultArr = [];
        let totalObj = {
            pcs: 0,
            materialWeight: 0,
            rate: 0,
            amount: 0,
            making: 0,
            others: 0,
            totalAmount: 0,
            sgstAmount: 0,
            cgstAmount: 0,
            addLess: 0,
            grandTotal: 0,
            textInNumbers: ""
        }
        data?.BillPrint_Json1.forEach((e, i) => {
            let materialArray = [];
            data?.BillPrint_Json2.forEach((ele, ind) => {
                if (ele?.StockBarcode === e?.SrJobno) {
                    materialArray.push(ele);
                    totalObj.amount += ele?.Amount;
                    totalObj.pcs += ele?.Pcs;
                    totalObj.materialWeight += ele?.Wt;
                    totalObj.rate += ele?.Rate;
                    totalObj.amount += ele?.Amount;
                }
            });
            totalObj.materialWeight = +((totalObj.materialWeight).toFixed(2));
            totalObj.addLess = data.BillPrint_Json[0].AddLess;
            totalObj.amount = +((totalObj.amount).toFixed(2));
            totalObj.totalAmount += (e?.TotalAmount);
            totalObj.making += e?.MakingAmount;
            totalObj.others += e?.OtherCharges;
            totalObj.sgstAmount = +(((data?.BillPrint_Json[0]?.SGST) * (e?.TotalAmount) / 100).toFixed(2));
            totalObj.cgstAmount = +(((data?.BillPrint_Json[0]?.CGST) * (e?.TotalAmount) / 100).toFixed(2));
            // totalObj.grandTotal = +((totalObj.totalAmount + totalObj.sgstAmount + totalObj.cgstAmount + totalObj.addLess).toFixed(2));

            let obj = { ...e };
            obj.materials = materialArray;
            resultArr.push(obj);
        });
        // tax
        let taxValue = taxGenrator(data?.BillPrint_Json[0], totalObj.totalAmount);
        setTaxes(taxValue);
        taxValue.forEach((e, i) => {
            totalObj.grandTotal += +(e?.amount);
        });
        totalObj.grandTotal += totalObj.totalAmount + totalObj.addLess;
        totalObj.totalAmount = (totalObj.totalAmount).toFixed(2);
        totalObj.textInNumbers = toWords.convert(totalObj.grandTotal);
        setTotal(totalObj);
        setDataFill(resultArr);
    }

    const handleChange = (e) => {
        rate ? setRate(false) : setRate(true);
    }

    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls, evn);
                if(data?.Status === '200'){
                    let isEmpty = isObjectEmpty(data?.Data);
                    if(!isEmpty){
                        loadData(data?.Data);
                        setLoader(false);
                    }else{
                        setLoader(false);
                        setMsg("Data Not Found");
                    }
                }else{
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
        <>
            {loader ? <Loader /> : msg === "" ? <div className='container containerRetailPrint mt-5 pad_60_allPrint'>
                {/* print button */}
                <div className="d-flex w-100 justify-content-end align-items-baseline">
                    <div className="form-check pe-3 mb-0">
                        <input className="form-check-input border-dark" type="checkbox" checked={rate} onChange={e => handleChange(e)} />
                        <label className="form-check-label h6 mb-0 pt-1">
                            With Rate
                        </label>
                    </div>
                    <div className="printBtn_sec text-end">
                        <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* headline retail print */}
                <div className='headlinepRetailPrint w-100 mt-4 py-1 px-2'>
                    <b>
                        {jsonData1?.PrintHeadLabel}
                    </b>
                </div>
                {/* company address */}
                <div className="mt-2 px-2">
                    <h5 className='fw-bold'>{jsonData1?.CompanyFullName}</h5>
                    <p>{jsonData1?.CompanyAddress}</p>
                    <p>{jsonData1?.CompanyAddress2}</p>
                    <p>{jsonData1?.CompanyCity} {jsonData1?.CompanyPinCode} {jsonData1?.CompanyState} {jsonData1?.CompanyCountry}</p>
                    <p>T {jsonData1?.CompanyTellNo} | TOLL FREE {jsonData1?.CompanyTollFreeNo}</p>
                    <p>{jsonData1?.CompanyEmail} | {jsonData1?.CompanyWebsite}</p>
                    <p>{jsonData1?.Company_VAT_GST_No} | {jsonData1?.Cust_CST_STATE} - {jsonData1?.Company_CST_STATE_No} | PAN-CCAAI0741B1Z2</p>
                </div>
                {/* bill to */}
                <div className="d-flex border mt-2">
                    <div className="col-4 p-1 border-end">
                        <p className='line_height_110'>{ } </p>
                        <p className='fw-bold line_height_110'>{jsonData1?.CustName}</p>
                        <p className='line_height_110'>{jsonData1?.customerAddress2}</p>
                        <p className='line_height_110'>{jsonData1?.customercity}{jsonData1?.customerpincode}</p>
                        <p className='line_height_110'>{jsonData1?.customeremail1}</p>
                    </div>
                    <div className="col-4 p-1 border-end">
                        <p className='line_height_110'>Ship To, </p>
                        <p className='fw-bold'>{jsonData1?.CustName}</p>
                        <p className='line_height_110'>{jsonData1?.CustName}</p>
                        <p className='pt-2 line_height_110'>{jsonData1?.customerAddress2}</p>
                        <p className='line_height_110'>{jsonData1?.customercity}, {jsonData1?.State}</p>
                        <p className='line_height_110'>{jsonData1?.CompanyCountry}-{jsonData1?.customerpincode}</p>
                        <p className='line_height_110'>Mobile No. : {jsonData1?.customermobileno}</p>
                    </div>
                    <div className="col-4 p-1 position-relative">
                        <div className="d-flex">
                            <div className="col-3">
                                <p className='fw-bold'>BILL NO</p>
                                <p className='fw-bold'>DATE</p>
                                <p className='fw-bold'>HSN</p>
                            </div>
                            <div className="col-9">
                                <p>{jsonData1?.InvoiceNo}</p>
                                <p>{jsonData1?.EntryDate}</p>
                                <p>{jsonData1?.HSN_No}</p>
                            </div>
                        </div>
                        <p className='mt-5 position-absolute bottom-0 pb-1'>{jsonData1?.MetalRate24K && (jsonData1?.MetalRate24K).toFixed(2)}</p>
                    </div>
                </div>
                {/* table */}
                <div className="d-flex mt-1 border">
                    <div className="srNoRetailPrint border-end d-flex justify-content-center align-items-center">
                        <p className='fw-bold'>Sr#</p>
                    </div>
                    <div className="poductDiscriptionRetailPrint border-end d-flex justify-content-center align-items-center">
                        <p className='fw-bold'>Product Description</p>
                    </div>
                    <div className="materialDescriptionRetailPrint border-end">
                        <div className="border-bottom p-1 d-flex justify-content-center align-items-center">
                            <p className='fw-bold'>Material Description</p>
                        </div>
                        <div className="d-flex">
                            <div className="materialRetailPrint border-end d-flex justify-content-center align-items-center">
                                <p className='fw-bold'>Material</p>
                            </div>
                            <div className="qtyRetailPrint border-end d-flex justify-content-center align-items-center">
                                <p className='fw-bold'>Qty</p>
                            </div>
                            <div className="pcsRetailPrint border-end d-flex justify-content-center align-items-center">
                                <p className='fw-bold'>Pcs</p>
                            </div>
                            <div className="wtRetailPrint border-end d-flex justify-content-center align-items-center">
                                <p className='fw-bold'>Wt.</p>
                            </div>
                            <div className="rateRetailPrint border-end d-flex justify-content-center align-items-center">
                                <p className='fw-bold'>{rate && "Rate"}</p>
                            </div>
                            <div className="amountRetailPrint d-flex justify-content-center align-items-center">
                                <p className='fw-bold'>Amount</p>
                            </div>
                        </div>
                    </div>
                    <div className="makingRetailPrint border-end d-flex justify-content-center align-items-center">
                        <p className='fw-bold'>Making</p>
                    </div>
                    <div className="othersRetailPrint border-end d-flex justify-content-center align-items-center">
                        <p className='fw-bold'>Others</p>
                    </div>
                    <div className="totalRetailPrint d-flex justify-content-center align-items-center">
                        <p className='fw-bold'>Total</p>
                    </div>
                </div>
                {/* data */}
                {dataFill.map((e, i) => {
                    return <div className="d-flex border-bottom border-start border-end" key={i}>
                        <div className="srNoRetailPrint border-end p-1 d-flex justify-content-center align-items-center">
                            <p className='fw-bold'>{e?.SrNo}</p>
                        </div>
                        <div className="poductDiscriptionRetailPrint border-end p-1">
                            <p>{e?.SubCategoryname} {e?.Categoryname} {e?.designno} | {e?.SrJobno}</p>
                            <img src={e?.DesignImage} alt="" className='w-100' onError={handleImageError} />
                            <p className='text-center fw-bold'>Tunch: {e?.Tunch}</p>
                            <p className='text-center fw-bold'>{e?.grosswt}gm <span className='fw-normal'>Gross</span></p>
                        </div>
                        <div className="materialDescriptionRetailPrint border-end">
                            <div className="d-grid h-100">
                                {e?.materials.length > 0 && e?.materials.map((ele, ind) => {
                                    return <div className="d-flex border-bottom" key={ind}>
                                        <div className="materialRetailPrint border-end p-1">
                                            <p>{ele?.ShapeName}</p>
                                        </div>
                                        <div className="qtyRetailPrint border-end p-1">
                                            <p>{ele?.QualityName}</p>
                                        </div>
                                        <div className="pcsRetailPrint border-end p-1">
                                            <p className='text-end'>{ele?.Pcs}</p>
                                        </div>
                                        <div className="wtRetailPrint border-end p-1">
                                            <p className='text-end'>{(ele?.Wt)?.toFixed(3)}</p>
                                        </div>
                                        <div className="rateRetailPrint border-end p-1">
                                            <p className='text-end'>{rate && (ele?.Rate)?.toFixed(2)}</p>
                                        </div>
                                        <div className="amountRetailPrint p-1">
                                            <p className='text-end'>{(ele?.Amount)?.toFixed(3)}</p>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                        <div className="makingRetailPrint border-end p-1">
                            <p className='text-end'>{(e?.MakingAmount).toFixed(2)}</p>
                        </div>
                        <div className="othersRetailPrint border-end p-1">
                            <p className='text-end'>{(e?.OtherCharges).toFixed(2)}</p>
                        </div>
                        <div className="totalRetailPrint p-1">
                            <p className='text-end'>{(e?.TotalAmount).toFixed(2)}</p>
                        </div>
                    </div>
                })}
                {/* total */}
                <div className="d-flex border-bottom border-start border-end">
                    <div className="srNoRetailPrint border-end p-1 d-flex justify-content-center align-items-center">
                    </div>
                    <div className="poductDiscriptionRetailPrint border-end p-1 d-flex align-items-center">
                        <p className="fw-bold">TOTAL</p>
                    </div>
                    <div className="materialDescriptionRetailPrint border-end">
                        <div className="d-flex">
                            <div className="materialRetailPrint border-end p-1">
                                <p className='fw-bold'></p>
                            </div>
                            <div className="qtyRetailPrint border-end p-1">
                                <p className='fw-bold'></p>
                            </div>
                            <div className="pcsRetailPrint border-end p-1 text-end">
                                <p className='fw-bold text-end'>{total?.pcs}</p>
                            </div>
                            <div className="wtRetailPrint border-end p-1">
                                <p className='fw-bold lh-1 text-end'>{total?.materialWeight} Ctw</p>
                                <p className='fw-bold lh-1 text-end'>{total?.materialWeight / 5} gm</p>
                            </div>
                            <div className="rateRetailPrint border-end p-1">
                                <p className='fw-bold text-end'>{rate && total?.rate}</p>
                            </div>
                            <div className="amountRetailPrint p-1">
                                <p className='fw-bold text-end'>{total?.amount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="makingRetailPrint border-end p-1">
                        <p className='fw-bold text-end'>{total?.making}</p>
                    </div>
                    <div className="othersRetailPrint border-end p-1">
                        <p className='fw-bold text-end'>{total?.others}</p>
                    </div>
                    <div className="totalRetailPrint p-1">
                        <p className='fw-bold text-end'>{total?.totalAmount}</p>
                    </div>
                </div>
                {/* grand total */}
                <div className="d-flex border-start border-end border-bottom">
                    <div className="totalInWordsRetailPrint p-1 d-flex flex-column align-items-start justify-content-end p-1 border-end">
                        <p>In Words Indian Rupees</p>
                        <p className='fw-bold'>{total?.textInNumbers} Only</p>
                    </div>
                    <div className="cgstRetailPrint p-1 text-end p-1 border-end">
                        {taxes.length > 0 && taxes.map((e, i) => {
                            return <p key={i}>{e?.name} @ {e?.per}</p>
                        })}
                        <p>Add</p>
                        <p className='fw-bold'>GRAND TOTAL</p>
                    </div>
                    <div className="totalRetailPrint p-1 text-end p-1">
                        {taxes.length > 0 && taxes.map((e, i) => {
                            return <p key={i}>{e?.amount}</p>
                        })}
                        <p>{total?.addLess}</p>
                        <p className='fw-bold'>₹{(total?.grandTotal)?.toFixed(2)}</p>
                    </div>
                </div>
                {/* note */}
                <div className="note border mt-1 p-1">
                    <div dangerouslySetInnerHTML={{ __html: jsonData1?.Declaration }} className='pt-2'></div>
                </div>
                {/* bank detail */}
                <div className="d-flex mt-1 border">
                    <div className="col-4 p-1 border-end">
                        <p className='fw-bold'>Bank Detail</p>
                        <p>Bank Name: {jsonData1?.bankname}</p>
                        <p>Branch: {jsonData1?.bankaddress}</p>
                        <p>{jsonData1?.customercity1}-{jsonData1?.PinCode}</p>
                        <p>Account Name: {jsonData1?.accountname}</p>
                        <p>Account No. : {jsonData1?.accountnumber}</p>
                        <p>RTGS/NEFT IFSC: {jsonData1?.rtgs_neft_ifsc}</p>
                    </div>
                    <div className="col-4 border-end d-flex flex-column justify-content-between p-1">
                        <p>Signature</p>
                        <p className='fw-bold'>{jsonData1?.CustName}</p>
                    </div>
                    <div className="col-4 border-end d-flex flex-column justify-content-between p-1">
                        <p>Signature</p>
                        <p className='fw-bold'>{jsonData1?.CompanyFullName}</p>
                    </div>
                </div>
            </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
        </>
    )
}

export default RetailPrint
