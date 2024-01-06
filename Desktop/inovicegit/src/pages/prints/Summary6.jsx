import React, { useEffect, useState } from 'react';
import {
    FooterComponent,
    HeaderComponent,
    apiCall,
    fixedValues,
    handleImageError,
    isObjectEmpty,
    numberToWord,
    NumberWithCommas,
    taxGenrator,
    handlePrint
} from "../../GlobalFunctions";
import style from '../../assets/css/prints/summary6.module.css';
import Loader from "../../components/Loader";
import { ToWords } from "to-words";
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';


const Summary6 = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const [header, setHeader] = useState(null);
    const [headerData, setHeaderData] = useState({});
    const [address, setAddress] = useState([]);
    const [footer, setFooter] = useState(null);
    const toWords = new ToWords();

    const loadData = (data) => {
        let head = HeaderComponent("1", data?.BillPrint_Json[0]);
        setHeader(head);
        setHeaderData(data?.BillPrint_Json[0]);
        let adr = data?.BillPrint_Json[0]?.Printlable.split(`\r\n`);
        setAddress(adr);
        setFooter(FooterComponent("2", data?.BillPrint_Json[0]));
        let datas = OrganizeDataPrint(
            data?.BillPrint_Json[0],
            data?.BillPrint_Json1,
            data?.BillPrint_Json2
        );
        console.log(datas);
        setData(datas);
    };

    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls, evn);
                if (data?.Status === "200") {
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
        };
        sendData();
    }, []);

    return loader ? (
        <Loader />
    ) : msg === "" ? (
        <div
            className={`container container-fluid max_width_container mt-1 ${style?.summary6} pad_60_allPrint`}
        >
            {/* buttons */}
            <div
                className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}
            >
                <div className="form-check ps-3">
                    <input
                        type="button"
                        className="btn_white blue py-1 mt-2"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            {/* header */}
            {header}
            <div className="border-bottom"></div>
            {/* bill info */}
            <div className="mt-2 border d-flex justify-content-between">
                <div className="col-6">
                    <p><span className="fw-bold px-2">##: </span>{headerData?.InvoiceNo}</p>
                </div>
                <div className="col-3 px-2">
                    <p> <span className="fw-bold">DATE : </span> 	{headerData?.EntryDate}  </p>
                    <p> <span className="fw-bold"> {headerData?.HSN_No_Label} :</span>	{headerData?.HSN_No}  </p>
                </div>
            </div>
            {/* customer details */}
            <div className="border-start border-end border-bottom d-flex px-2 pb-2 pt-1">
                <div className="col-6">
                    <p className="fw-bold fs-6">{headerData?.customerfirmname} </p>
                    <p>{headerData?.customerregion}</p>
                    <p>{headerData?.customercity} </p>
                    <p>{headerData?.customermobileno}</p>
                    <p>GSTIN-{headerData?.CustGstNo} | {headerData?.Cust_CST_STATE}-{headerData?.Cust_CST_STATE_No} | PAN-{headerData?.CustPanno}</p></div>
                <div className="col-6"></div>
            </div>
            {/* table header */}
            <div className="d-flex border-start border-end border-bottom">
                <div className={`${style?.sr} border-end fw-bold text-uppercase text-center`}>sr
                </div>
                <div className={`${style?.design} border-end fw-bold text-uppercase text-center`}>design
                </div>
                <div className={`${style?.metal} border-end fw-bold text-uppercase text-center`}>metal
                </div>
                <div className={`${style?.gwt} border-end fw-bold text-uppercase text-center`}>gwt
                </div>
                <div className={`${style?.nwt} border-end fw-bold text-uppercase text-center`}>nwt
                </div>
                <div className={`${style?.dpcs} border-end fw-bold text-uppercase text-center`}>dpcs
                </div>
                <div className={`${style?.dwt} border-end fw-bold text-uppercase text-center`}>dwt
                </div>
                <div className={`${style?.cspcs} border-end fw-bold text-uppercase text-center`}>cspcs
                </div>
                <div className={`${style?.cswt} border-end fw-bold text-uppercase text-center`}>cswt
                </div>
                <div className={`${style?.order} border-end fw-bold text-uppercase text-center`}>order
                </div>
                <div className={`${style?.total} fw-bold text-uppercase text-center`}>total
                </div>
            </div>
            {/* table data */}
            {data?.resultArray.map((e, i) => {
                return <div className="d-flex border-start border-end border-bottom" key={i}>
                    <div className={`${style?.sr} border-end d-flex align-items-center justify-content-center`}>{i+1}
                    </div>
                    <div className={`${style?.design} border-end d-flex justify-content-between p-1  align-items-center`}>
                        <div>
                            <img src={e?.DesignImage} alt="" className='imgWidth2' onError={handleImageError}/>
                        </div>
                        <div className='text-center'>
                            <p>{e?.designno}</p>
                            <p className='border-top'>{e?.SrJobno}</p>
                        </div>
                    </div>
                    <div className={`${style?.metal} border-end d-flex align-items-center p-1`}>{e?.MetalTypePurity}
                    </div>
                    <div className={`${style?.gwt} border-end p-1 d-flex align-items-center justify-content-end`}>{NumberWithCommas(e?.grosswt, 3)}
                    </div>
                    <div className={`${style?.nwt} border-end p-1 d-flex align-items-center justify-content-end`}>{NumberWithCommas(e?.NetWt+e?.LossWt, 3)}
                    </div>
                    <div className={`${style?.dpcs} border-end p-1 d-flex align-items-center justify-content-end`}>{NumberWithCommas(data)}
                    </div>
                    <div className={`${style?.dwt} border-end p-1 d-flex align-items-center justify-content-end`}>0.080
                    </div>
                    <div className={`${style?.cspcs} border-end p-1 d-flex align-items-center justify-content-end`}>0
                    </div>
                    <div className={`${style?.cswt} border-end p-1 d-flex align-items-center justify-content-end`}>0.000
                    </div>
                    <div className={`${style?.order} border-end p-1 d-flex align-items-center justify-content-end`}>47.00
                    </div>
                    <div className={`${style?.total} p-1 d-flex align-items-center justify-content-end`}>₹ 5,813.93
                    </div>
                </div>
            })}

            {/* table total */}
            <div className="d-flex border-start border-end border-bottom">
                <div className={`${style?.sr} text-center`}>
                </div>
                <div className={`${style?.design} p-1`}>
                    <p className="text-center fw-bold">Total</p>
                </div>
                <div className={`${style?.metal} border-end d-flex align-items-center p-1`}>
                </div>
                <div className={`${style?.gwt} border-end p-1 d-flex align-items-center justify-content-end fw-bold`}>47.760
                </div>
                <div className={`${style?.nwt} border-end p-1 d-flex align-items-center justify-content-end fw-bold`}>41.691
                </div>
                <div className={`${style?.dpcs} border-end p-1 d-flex align-items-center justify-content-end fw-bold`}>120
                </div>
                <div className={`${style?.dwt} border-end p-1 d-flex align-items-center justify-content-end fw-bold`}>25.600
                </div>
                <div className={`${style?.cspcs} border-end p-1 d-flex align-items-center justify-content-end fw-bold`}>19
                </div>
                <div className={`${style?.cswt} border-end p-1 d-flex align-items-center justify-content-end fw-bold`}>5.560
                </div>
                <div className={`${style?.order} border-end p-1 d-flex align-items-center justify-content-end fw-bold`}>522.00
                </div>
                <div className={`${style?.total} p-1 d-flex align-items-center justify-content-end fw-bold`}>₹ 56,064.63
                </div>
            </div>
            {/* taxes */}
            <div className="border-start border-end border-bottom">
                <div className="d-flex border-bottom p-1">
                    <div className={`${style?.taxWords} text-center border-end`}>
                    </div>
                    <div className={`${style?.tax} p-1`}>
                        <div className="d-flex justify-content-between">
                            <p>CGST @ 0.13%</p>
                            <p>72.88</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p>SGST @ 0.13%</p>
                            <p>72.88</p>
                        </div>
                        <div className="d-flex justify-content-between fw-bold">
                            <p>Less</p>
                            <p>-0.39</p>
                        </div>
                    </div>
                </div>
                <div className="d-flex p-1">
                    <div className={`${style?.taxWords} border-end d-flex align-items-center fw-bold`}>
                        <p>  Fifty-Six Thousand Two Hundred and Ten Only	</p>
                    </div>
                    <div className={`${style?.tax} p-1`}>
                        <div className="d-flex justify-content-end fw-bold">
                            <p>Grand Total :</p>
                            <p>₹ 56,210.00/-  </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Summary Detail */}
            <div className="border my-1">
                <p className="lightGrey fw-bold p-1 border-bottom"> Summary Detail </p>
                <div className={`${style?.d_grid} flex-wrap p-1 d-grid`}>
                    <div className='d-flex'>
                        <div className="col-7">Necklace | Casted-simple</div>
                        <div className="col-1">:</div>
                        <div className="col-4">1</div>
                    </div>
                    <div className='d-flex'>
                        <div className="col-7">Necklace | Casted-simple</div>
                        <div className="col-1">:</div>
                        <div className="col-4">1</div>
                    </div>
                    <div className='d-flex'>
                        <div className="col-7">Necklace | Casted-simple</div>
                        <div className="col-1">:</div>
                        <div className="col-4">1</div>
                    </div>
                    <div className='d-flex'>
                        <div className="col-7">Necklace | Casted-simple</div>
                        <div className="col-1">:</div>
                        <div className="col-4">1</div>
                    </div>
                    <div className='d-flex'>
                        <div className="col-7">Necklace | Casted-simple</div>
                        <div className="col-1">:</div>
                        <div className="col-4">1</div>
                    </div>
                    <div className='d-flex'>
                        <div className="col-7">Necklace | Casted-simple</div>
                        <div className="col-1">:</div>
                        <div className="col-4">1</div>
                    </div>
                    <div className='d-flex'>
                        <div className="col-7">Necklace | Casted-simple</div>
                        <div className="col-1">:</div>
                        <div className="col-4">1</div>
                    </div>
                    <div className='d-flex'>
                        <div className="col-7">Necklace | Casted-simple</div>
                        <div className="col-1">:</div>
                        <div className="col-4">1</div>
                    </div>
                </div>
            </div>
            <p><span className="fw-bold">REMARKS IF ANY :</span> Insert Print Remark for bill</p>
            <pre className='preText pt-1'>**  THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF TRANSACTIONS</pre>
        </div>
    ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
        </p>
    );
}

export default Summary6;