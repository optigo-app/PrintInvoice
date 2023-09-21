import React from 'react';
import "../assets/css/itemwiseprint.css";
import { handlePrint } from '../GlobalFunctions';
import { usePDF } from 'react-to-pdf';

const ItemWisePrint = () => {
    const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });
    return (
        <div className=' itemWisePrintfont'>
            {/* Print Button */}
            <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 pt-4 portrait_container">
                <div className="form-check">
                    <input type="button" className="btn_white blue" value="pdf" onClick={() => toPDF()} />
                </div>
                <div className="form-check">
                    <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                </div>
            </div>
            {/* Heading */}
            <div ref={targetRef} className='portrait_container'>
                <div className="bgLightPink p-2 border">
                    <p className='fw-bold'>ITEM DETAIL PRINT</p>
                </div>
                {/* Address */}
                <div className="border-start border-end border-bottom p-2 d-flex justify-content-between">
                    <div className="col-6">
                        <p className="fw-bold">TO, SHAH PVT LMT</p>
                        <p className="px-2">Adajan</p>
                        <p className="px-2">Surat-395009</p>
                        <p className="px-2">Phno:-000-000-0001</p>
                    </div>
                    <div className="col-3">
                        <div className="d-flex">
                            <div className="col-6"><p>INVOICE NO</p></div>
                            <div className="col-6"><p className='fw-bold'>SK13712022</p></div>
                        </div>
                        <div className="d-flex">
                            <div className="col-6"><p>DATE</p></div>
                            <div className="col-6"><p className='fw-bold'>14 Sep 2023</p></div>
                        </div>
                        <div className="d-flex">
                            <div className="col-6"><p>24K RATE</p></div>
                            <div className="col-6"><p className='fw-bold'>500</p></div>
                        </div>
                    </div>
                </div>
                {/* Table Heading */}
                <div className="bgLightPink d-flex border-start border-end border-bottom main_pad_item_wise_print">
                    <div className="metaltypeItemWisePrint border-end">
                        <p className="fw-bold">
                            METAL TYPE
                        </p>
                    </div>
                    <div className="categoryItemWisePrint border-end">
                        <p className="fw-bold">
                            CATEGORY
                        </p>
                    </div>
                    <div className="pkgItemWisePrint border-end">
                        <p className="fw-bold">
                            PKG WT
                        </p>
                    </div>
                    <div className="countItemWisePrint border-end">
                        <p className="fw-bold">
                            COUNT
                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold">
                            DPCS
                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold">
                            DWT
                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold">
                            RATE
                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold">
                            DAMT
                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold">
                            CPCS
                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold">
                            CWT
                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold">
                            RATE
                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold">
                            CAMT
                        </p>
                    </div>

                    <div className="gwtItemWisePrint border-end">
                        <p className="fw-bold">
                            GWT
                        </p>
                    </div>
                    <div className="gwtItemWisePrint border-end">
                        <p className="fw-bold">
                            NWT
                        </p>
                    </div>

                    <div className="rateItemWisePrint border-end">
                        <p className="fw-bold">
                            RATE
                        </p>
                    </div>

                    <div className="mAmtItemWisePrint border-end">
                        <p className="fw-bold">
                            M AMT
                        </p>
                    </div>

                    <div className="otherAmtItemWisePrint border-end">
                        <p className="fw-bold">
                            OTHER AMT
                        </p>
                    </div>

                    <div className="percentageItemWiseprint border-end">
                        <p className="fw-bold">
                            %
                        </p>
                    </div>

                    <div className="wastageItemWisePrint border-end">
                        <p className="fw-bold">
                            WASTAGE
                        </p>
                    </div>
                    <div className="makingItemWisePrint border-end">
                        <p className="fw-bold">
                            MAKING %
                        </p>
                    </div>
                    <div className="labourItemWisePrint border-end">
                        <p className="fw-bold">
                            LABOR AMT
                        </p>
                    </div>

                    <div className="fineAmt border-end">
                        <p className="fw-bold">
                            FINE
                        </p>
                    </div>
                    <div className="totalAmt">
                        <p className="fw-bold">
                            TOTAL AMT
                        </p>
                    </div>
                </div>
                {/* Data */}
                <div className="d-flex border-start border-end border-bottom main_pad_item_wise_print_row">
                    <div className="metaltypeItemWisePrint border-end">
                        <p className="fw-bold">
                            GOLD 18K
                        </p>
                    </div>
                    <div className="categoryItemWisePrint border-end">
                        <p className="fw-bold">
                            AURORA-RNG
                        </p>
                    </div>
                    <div className="pkgItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="countItemWisePrint border-end">
                        <p className="fw-bold text-end">
                            2
                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>

                    <div className="gwtItemWisePrint border-end">
                        <p className="fw-bold text-end">
                            2.850
                        </p>
                    </div>
                    <div className="gwtItemWisePrint border-end">
                        <p className="fw-bold text-end">
                            2.850
                        </p>
                    </div>

                    <div className="rateItemWisePrint border-end">
                        <p className="fw-bold text-end">
                            380.00
                        </p>
                    </div>

                    <div className="mAmtItemWisePrint border-end">
                        <p className="fw-bold text-end">
                            1,083.00
                        </p>
                    </div>

                    <div className="otherAmtItemWisePrint border-end">
                        <p className="fw- text-end">

                        </p>
                    </div>

                    <div className="percentageItemWiseprint border-end">
                        <p className="fw-bold text-end">
                            75.000
                        </p>
                    </div>

                    <div className="wastageItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="makingItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="labourItemWisePrint border-end">
                        <p className="fw-bold text-end">
                            1,425.00
                        </p>
                    </div>

                    <div className="fineAmt border-end">
                        <p className="fw-bold text-end">
                            2.137
                        </p>
                    </div>
                    <div className="totalAmt">
                        <p className="fw-bold text-end">
                            2,508.00
                        </p>
                    </div>
                </div>
                {/* Tax */}
                <div className="bgLightPink d-flex border-start border-end border-bottom main_pad_item_wise_print_row">
                    <div className="cgstTotalItemWiseRow border-end">
                        <p className="fw-bold text-end">IGST @ 0.25%</p>
                    </div>
                    <div className="cgstAmountItemWiseRow">
                        <p className="fw-bold text-end">6.27</p>
                    </div>
                </div>
                {/* Total */}
                <div className="d-flex border-start border-end border-bottom main_pad_item_wise_print_row">
                    <div className="metaltypeItemWisePrint border-end d-flex justify-content-center align-items-center">
                        <p className="fw-bold">
                            Total
                        </p>
                    </div>
                    <div className="categoryItemWisePrint border-end">
                        <p className="fw-bold">
                        </p>
                    </div>
                    <div className="pkgItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="countItemWisePrint border-end">
                        <p className="fw-bold text-end">
                            2
                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="dpcsItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>

                    <div className="gwtItemWisePrint border-end">
                        <p className="fw-bold text-end">
                            2.850
                        </p>
                    </div>
                    <div className="gwtItemWisePrint border-end">
                        <p className="fw-bold text-end">
                            2.850
                        </p>
                    </div>

                    <div className="rateItemWisePrint border-end">
                        <p className="fw-bold text-end">
                        </p>
                    </div>

                    <div className="mAmtItemWisePrint border-end">
                        <p className="fw-bold text-end">
                            1,083.00
                        </p>
                    </div>

                    <div className="otherAmtItemWisePrint border-end">
                        <p className="fw- text-end">

                        </p>
                    </div>

                    <div className="percentageItemWiseprint border-end">
                        <p className="fw-bold text-end">
                        </p>
                    </div>

                    <div className="wastageItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="makingItemWisePrint border-end">
                        <p className="fw-bold text-end">

                        </p>
                    </div>
                    <div className="labourItemWisePrint border-end">
                        <p className="fw-bold text-end">
                            1,425.00
                        </p>
                    </div>

                    <div className="fineAmt border-end">
                        <p className="fw-bold text-end">
                            2.137
                        </p>
                    </div>
                    <div className="totalAmt">
                        <p className="fw-bold text-end">
                            2,508.00
                        </p>
                    </div>
                </div>
                {/* Amount In Words */}
                <div className="d-flex border-start border-end border-bottom p-2">
                    <p>Amount in Words : </p>
                    <p className="fw-bold">Two Thousand Five Hundred and Fourteen Point Twenty Seven Only</p>
                </div>
                <div className="d-flex border-start border-end border-bottom p-2">
                    <p className='pe-3'>Order Due Days : <span className="fw-bold">1</span></p>
                    <p>Order Due Date : <span className="fw-bold">15 Sep 2023</span></p>
                </div>
            </div>

        </div>
    )
}

export default ItemWisePrint