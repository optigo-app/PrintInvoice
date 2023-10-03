import React, { useEffect, useState } from 'react';
import convertor from "number-to-words";
import "../../assets/css/prints/taxInvoice1.css";
import { CapitalizeWords, apiCall, handlePrint } from '../../GlobalFunctions';
import Loader from '../../components/Loader';

const TaxInvoice1 = ({  urls, token, invoiceNo, printName, evn  }) => {
    const [image, setimage] = useState(false);
    const [BillPrint_Json, setBillPrint_Json] = useState({});
    const [BillPrint_Jso1, setBillPrint_Json1] = useState([]);
    const [BillPrint_Json2, setBillPrint_Json2] = useState([]);
    const [resultArr, setResultArr] = useState([]);
    const [totalAmount, setTotalAmount] = useState({});
    const [loader, setLoader] = useState(true);

    const handleChange = (e) => {
        image ? setimage(false) : setimage(true);
    }

    const handleImageError = (e) => {
        e.target.src = "http://zen/lib/jo/28/images/default.jpg"
    }



    const findMaterials = (json2, json1, json0) => {

        const groupedObjects = {};
        json2.forEach(item => {
            if (json1.some(srItem => srItem.SrJobno === item.StockBarcode)) {
                if (!groupedObjects[item.StockBarcode]) {
                    groupedObjects[item.StockBarcode] = [];
                }
                groupedObjects[item.StockBarcode].push(item);
            }
        });
        const resultArray = Object.keys(groupedObjects).map(key => ({
            SrjobNo: key,
            data: groupedObjects[key]
        }));

        let arrResult = [];
        resultArray.forEach((e, i) => {
            const mergedArray = e.data.reduce((result, current) => {
                const existingItem = result.find(item => item.Rate === current.Rate && item.ShapeName === current.ShapeName);
                if (existingItem) {
                    existingItem.gwt += current.gwt;
                    existingItem.cst += current.cst;
                    existingItem.Rate += current.Rate;
                    existingItem.Amount += current.Amount;
                } else {
                    result.push({ ...current });
                }

                return result;
            }, []);
            arrResult.push({ jobNo: e.SrjobNo, data: mergedArray })
        })
        let finalArr = [];
        let totalobj = {
            TotalAmount: 0,
            totalOtherAmount: 0,
            netWeight: 0,
            diaWt: 0,
            gwt: 0,
            discountAmt: 0,
        };
        json1.forEach((e, i) => {
            arrResult.forEach((ele, ind) => {
                if (e.SrJobno === ele.jobNo) {
                    let totalAmount = 0;
                    let arr = [];
                    ele.data.forEach((element, index) => {
                        let obj = { ...element }
                        if (element.MasterManagement_DiamondStoneTypeid === 4) {
                            obj.materialCharges = 0;
                        } else {
                            obj.materialCharges = +((obj.Rate * obj.Wt).toFixed(2));
                            totalobj.totalOtherAmount += obj.materialCharges;
                        }
                        arr.push(obj);
                        totalobj.TotalAmount += element.Amount;
                        if (element.ShapeName !== "GOLD" && element.ShapeName !== "MISC") {
                            totalobj.diaWt += element.Wt;
                        }
                    });
                    finalArr.push({ jobNo: e.SrJobno, data: arr, mainData: e, totalAmount: totalAmount });
                    totalobj.totalOtherAmount += e?.OtherCharges;
                    totalobj.netWeight += e?.NetWt;
                    totalobj.gwt += e?.grosswt;
                    totalobj.discountAmt += e?.DiscountAmt;
                }
            });
        });
        totalobj.cgstTax = +((json0[0].CGST / 100 * +(totalobj.TotalAmount)).toFixed(2));
        totalobj.sgstTax = +((json0[0].SGST / 100 * +(totalobj.TotalAmount)).toFixed(2));
        totalobj.TotalAmount = +((totalobj.TotalAmount).toFixed(2));
        totalobj.totalOtherAmount = +((totalobj.totalOtherAmount).toFixed(2));
        totalobj.totalAmountAfterTax = +((totalobj.TotalAmount + totalobj.cgstTax + totalobj.sgstTax - totalobj.discountAmt).toFixed(2));
        totalobj.diaWt = +((totalobj.diaWt).toFixed(2));
        totalobj.gwt = +((totalobj.gwt).toFixed(2));
        totalobj.discountAmt = +((totalobj.discountAmt).toFixed(2));
        totalobj.netBalanceAmount = +((totalobj.totalAmountAfterTax - json0[0].OldGoldAmount - json0[0].AdvanceAmount - json0[0].CashReceived - json0[0].BankReceived).toFixed(2));
        totalobj.textnumber = CapitalizeWords(convertor.toWords(Math.round(totalobj.netBalanceAmount)));
        totalobj.weightInGram = +((totalobj.diaWt / 5).toFixed(2));
        setTotalAmount(totalobj);
        setResultArr(finalArr);
    }

    const loadData = (datas) => {
        setBillPrint_Json(datas?.BillPrint_Json[0]);
        setBillPrint_Json1(datas?.BillPrint_Json1);
        setBillPrint_Json2(datas?.BillPrint_Json2);
        findMaterials(datas?.BillPrint_Json2, datas?.BillPrint_Json1, datas?.BillPrint_Json);
    }

    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls, evn);
                loadData(data);
                setLoader(false)
            } catch (error) {
                console.error(error);
            }
        }

        sendData();
    }, []);

    return (
        <>{
            loader ? <Loader /> : <div className='container taxinvoice1 pt-5 mt-5'>
            <div className="d-flex justify-content-end align-items-center print_sec_sum4 pb-4">
                <div className="form-check pe-3 mb-0">
                    <input className="form-check-input border-dark" type="checkbox" checked={image} onChange={e => handleChange(e)} />
                    <label className="form-check-label h6 mb-0">
                        With Image
                    </label>
                </div>
                <div className="form-check ps-3">
                    <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <p className='pe-1'>{BillPrint_Json?.Company_VAT_GST_No}</p>
                <p className='ps-1 pe-1'>|</p>
                <p className='ps-1 pe-1'>{BillPrint_Json?.Company_CST_STATE}-{BillPrint_Json?.Company_CST_STATE_No}</p>
                <p className='pe-1 ps-1'>|</p>
                <p className='ps-1'>PAN-EDJHF236D</p>
            </div>
            <div className="taxinvoice1Head fw-bold text-center mb-1">
                {BillPrint_Json?.PrintHeadLabel}
            </div>
            <div className="headerInvoice1 d-flex border mb-1 border-2 border-black">
                <div className="header_textInvoice1 border-end p-1">
                    <p className='customer_name_invoice1'>Customer Name: <span className='fw-bold'>{BillPrint_Json?.CustName}</span></p>
                    <p>{BillPrint_Json?.customerAddress1}</p>
                    <p>{BillPrint_Json?.customerAddress2}</p>
                    <p>{BillPrint_Json?.customercity}-{BillPrint_Json?.customerpincode}</p>
                    <p>{BillPrint_Json?.CompanyCountry}</p>
                    <p>{BillPrint_Json?.CompanyEmail}</p>
                    <p>Phno:{BillPrint_Json?.customermobileno}</p>
                    <p>{BillPrint_Json?.vat_cst_pan}</p>
                    <p>{BillPrint_Json?.Cust_CST_STATE} - {BillPrint_Json?.Cust_CST_STATE_No}</p>
                </div>
                <div className="header_text_invoice_num p-1">
                    <div className="d-flex w-100 justify-content-between">
                        <p className='customer_data_invoice1 fw-bold'>INVOICE NO</p>
                        <p>{BillPrint_Json?.InvoiceNo}</p>
                    </div>
                    <div className="d-flex w-100 justify-content-between">
                        <p className='customer_data_invoice1 fw-bold'>DATE</p>
                        <p>{BillPrint_Json?.EntryDate}</p>
                    </div>
                </div>
            </div>
            <div className="d-flex border-top border-bottom table_invoice1 border-2 border-black">
                <div className='sr_invoice1 d-flex align-items-center justify-content-center fw-bold border-start border-2 border-black'>Sr#</div>
                <div className='product_discription_invoice1 d-flex align-items-center justify-content-center border-start fw-bold border-end'>Product Description</div>
                <div className='hsn_invoice1 d-flex align-items-center justify-content-center fw-bold border-end'>HSN</div>
                <div className='material_invoice1'>
                    <div className="headHeightInvoice1 d-flex align-items-center justify-content-center fw-bold border-end border-bottom">Material Description</div>
                    <div className="headHeightInvoice1 d-flex">
                        <div className="material_invoice_1 d-flex align-items-center justify-content-center fw-bold border-end">
                            Material
                        </div>
                        <div className="Carat_invoice_1 d-flex align-items-center justify-content-center fw-bold border-end">
                            Carat
                        </div>
                        <div className="GWT_invoice_1 d-flex align-items-center justify-content-center fw-bold border-end">
                            GWT
                        </div>
                        <div className="STONE_invoice_1 d-flex align-items-center justify-content-center fw-bold border-end">
                            Less Wt
                        </div>
                        <div className="NWT_invoice_1 d-flex align-items-center justify-content-center fw-bold border-end">
                            NWT
                        </div>
                        <div className="Rate_invoice_1 d-flex align-items-center justify-content-center fw-bold border-end rateInvoice1">
                            Rate
                        </div>
                    </div>
                </div>
                <div className='making_invoice1 d-flex align-items-center justify-content-center fw-bold border-end'>Making</div>
                <div className='others_invoice1 d-flex align-items-center justify-content-center fw-bold border-end flex-column'>
                    <p>Material</p>
                    <p>Charge</p>
                </div>
                <div className='total_invoice1 d-flex align-items-center justify-content-center fw-bold border-end border-2 border-black'>Total</div>
            </div>
            {resultArr.length > 0 && resultArr.map((e, i) => {
                return <div className="d-flex w-100 border-bottom table_row_invoice1 border-2 border-black" key={i}>
                    <div className='sr_invoice1 min_padding_invoice1 border-start border-2 border-black'>{e?.mainData?.SrNo}</div>
                    <div className='product_discription_invoice1 min_padding_invoice1 border-start border-end'>
                        <p> {e?.mainData?.Categoryname} {e?.mainData?.Collectionname} {e?.mainData?.DesignNo} | {e?.jobNo}</p>
                        {image && <img src={e?.mainData?.DesignImage} alt="" className='w-100' onError={handleImageError} />}
                        <p className={`${!image && "pt-3"}`}>HUID-{e?.mainData?.HUID} </p>
                    </div>
                    <div className='hsn_invoice1 min_padding_invoice1 border-end'>{BillPrint_Json?.HSN_No}</div>
                    <div className='material_invoice_inner1 border-end'>
                        {e?.data.length > 0 && e?.data.map((ele, ind) => {
                            return <div className={`d-flex ${ind !== e?.data?.length - 1 && `border-bottom`} material_inner_invoice1`} key={ind}>
                                <div className='min_padding_invoice1 material_invoice_1 border-end justify-content-center'>{ele?.ShapeName}</div>
                                <div className='min_padding_invoice1 Carat_invoice_1 border-end justify-content-center'>{ind === 0 && ele?.QualityName}</div>
                                <div className='min_padding_invoice1 GWT_invoice_1 border-end justify-content-center'>{ind === 0 && e?.mainData?.grosswt}</div>
                                <div className='min_padding_invoice1 STONE_invoice_1 border-end justify-content-center'>{ele?.ShapeName !== "GOLD" && ele?.Wt}</div>
                                <div className='min_padding_invoice1 NWT_invoice_1 border-end justify-content-center'>{ind === 0 && e?.mainData?.NetWt}</div>
                                <div className='min_padding_invoice1 Rate_invoice_1 justify-content-end'>{ele?.MasterManagement_DiamondStoneTypeid === 4 && (ele?.Rate).toFixed(2)}</div>
                            </div>
                        })}

                    </div>
                    <div className='d-flex align-items-center justify-content-center making_invoice1 p-1 border-end'>{e?.mainData?.MakingAmount}</div>
                    <div className='others_invoice1  border-end'>
                        <div className="d-grid h-100">
                            <div className='text-center border-bottom material_inner_invoice1 p-1 minHeight20_5_taxInvoice1'>
                                {(e?.mainData?.OtherCharges).toFixed(2)}
                            </div>
                            {e?.data.length > 0 && e?.data.map((ele, ind) => {
                                return <div className={`text-center ${ind !== e?.data.length - 1 && `border-bottom`} material_inner_invoice1 p-1 minHeight20_5_taxInvoice1`} key={ind}>
                                    {(ele?.materialCharges).toFixed(2)}
                                </div>
                            })}
                        </div>
                    </div>
                    <div className='d-flex align-items-center justify-content-end total_invoice1 min_padding_invoice1 border-end border-2 border-black'>{(e?.totalAmount).toFixed(2)}</div>
                </div>
            })}
            <div className="d-flex headHeightInvoice1 border-bottom print_break_avoid_invoice1 border-2 border-black">
                <div className='p-1 d-flex align-items-center sr_invoice1 border-start border-2 border-black'></div>
                <div className='p-1 d-flex align-items-center product_discription_invoice1 border-end border-start total_sec_invoice1 fw-bold'>TOTAL</div>
                <div className='p-1 d-flex align-items-center hsn_invoice1 border-end'></div>
                <div className='d-flex align-items-center material_invoice_inner1 border-end'>
                    <div className='d-flex material_inner_invoice1 h-100'>
                        <div className='p-1 min_padding_invoice1 material_invoice_1 border-end'></div>
                        <div className='p-1 min_padding_invoice1 Carat_invoice_1 border-end'></div>
                        <div className='p-1 min_padding_invoice1 GWT_invoice_1 border-end justify-content-center'>{totalAmount?.gwt}</div>
                        <div className='p-1 min_padding_invoice1 STONE_invoice_1 border-end fw-bold d-block text-center'><p>{totalAmount?.diaWt} Ctw </p><p>{totalAmount?.weightInGram} gm</p></div>
                        <div className='p-1 NWT_invoice_1 border-end fw-bold d-block align-items-center d-flex justify-content-center'>{totalAmount?.netWeight}</div>
                        <div className='p-1 min_padding_invoice1 Rate_invoice_1 fw-bold'></div>
                    </div>
                </div>
                <div className='p-1 d-flex align-items-center making_invoice1 border-end'></div>
                <div className='p-1 d-flex align-items-center others_invoice1 border-end fw-bold justify-content-center'>{totalAmount?.totalOtherAmount}</div>
                <div className='p-1 d-flex align-items-center total_invoice1 border-end fw-bold justify-content-end border-2 border-black'>{totalAmount?.TotalAmount}</div>
            </div>
            <div className="d-flex border-start border-end border-bottom print_break_avoid_invoice1 border-2 border-black">
                <div className="oldGoldInvoice1 border-end d-grid">
                    <div className='d-flex p-1 border-bottom'><p>Narration / Remark:</p></div>
                    <div className='d-flex border-bottom p-1'> <p>Old Gold Purchase Description :</p></div>
                </div>
                <div className="cgst_inovice1 border-end p-1 text-end">
                    <p>Discount</p>
                    <p>Total Amt. before Tax</p>
                    <p>CGST @ {BillPrint_Json?.CGST}%</p>
                    <p>SGST @ {BillPrint_Json?.SGST}%</p>
                    <p>Total Amt. after Tax</p>
                    <p>Old Gold</p>
                    <p>Advance</p>
                    <p>Recv.in Cash</p>
                    <p>Recv.in Bank</p>
                    <p>Net Bal. Amount</p>
                </div>
                <div className="totalSumInvoice1 p-1 text-end">
                    <p>{totalAmount?.discountAmt}</p>
                    <p>{totalAmount?.TotalAmount}</p>
                    <p>{totalAmount?.cgstTax}</p>
                    <p>{totalAmount?.sgstTax}</p>
                    <p>{totalAmount?.totalAmountAfterTax}</p>
                    <p>{BillPrint_Json?.OldGoldAmount !== undefined && (BillPrint_Json?.OldGoldAmount).toFixed(2)}</p>
                    <p>{BillPrint_Json?.AdvanceAmount !== undefined && (BillPrint_Json?.AdvanceAmount).toFixed(2)}</p>
                    <p>{BillPrint_Json?.CashReceived !== undefined && (BillPrint_Json?.CashReceived).toFixed(2)}</p>
                    <p>{BillPrint_Json?.BankReceived !== undefined && (BillPrint_Json?.BankReceived).toFixed(2)}</p>
                    <p>{totalAmount?.netBalanceAmount !== undefined && (totalAmount?.netBalanceAmount).toFixed(2)}</p>
                </div>
            </div>
            <div className="d-flex border-start border-end border-bottom border-2 border-black print_break_avoid_invoice1">
                <div className="p-1 totalNumbersinvoice1 border-end">
                    <p>In Words Indian Rupees</p>
                    <p className='fw-bold'>{totalAmount?.textnumber}</p>
                </div>
                <div className="p-1 totalTaxinvoice1 border-end text-end align-items-center d-flex justify-content-end fw-bold">
                    GRAND TOTAL
                </div>
                <div className="p-1 d-flex align-items-center justify-content-end totalTaxNumberinvoice1 fw-bold">
                    ₹ {totalAmount?.netBalanceAmount !== undefined && (totalAmount?.netBalanceAmount).toFixed(2)}
                </div>
            </div>
            <div className="d-flex border-start border-end border-bottom p-1 print_break_avoid_invoice1 border-2 border-black">
                <div dangerouslySetInnerHTML={{ __html: BillPrint_Json?.Declaration }} className='pt-1'></div>
            </div>
            <div className="d-flex border-start border-end border-bottom print_break_avoid_invoice1 border-2 border-black">
                <div className='onlineBankinvoice1 border-end p-1'>
                    <p className='fw-bold'>Bank Detail</p>
                    <p>Bank Name: {BillPrint_Json?.bankname}</p>
                    <p>Branch: {BillPrint_Json?.bankaddress}</p>
                    <p>Account Name: {BillPrint_Json?.accountname}</p>
                    <p>Account No. : {BillPrint_Jso1?.accountnumber}</p>
                    <p>RTGS/NEFT IFSC: {BillPrint_Json?.rtgs_neft_ifsc}</p>
                </div>
                <div className='Signatureinvoice1 border-end d-flex justify-content-between flex-column p-1'>
                    <p>Signature</p>
                    <p className='fw-bold'>Kamlesh Patil</p>
                </div>
                <div className='Signature2invoice1 d-flex justify-content-between flex-column p-1'>
                    <p>Signature</p>
                    <p className='fw-bold'>ORAIL SERVICE</p>
                </div>
            </div>
        </div>
        }</>
    
    )
}

export default TaxInvoice1