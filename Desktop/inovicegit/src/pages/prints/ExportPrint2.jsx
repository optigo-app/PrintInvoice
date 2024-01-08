import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/exportPrint2.module.css";
import { NumberWithCommas, apiCall, fixedValues, handlePrint, isObjectEmpty, numberToWord } from '../../GlobalFunctions';
import Loader from '../../components/Loader';

const ExportPrint2 = ({ urls, token, invoiceNo, printName, evn }) => {
    const [loader, setLoader] = useState(true);
    const [data, setData] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const [msg, setMsg] = useState("");

    const loadData = (data) => {

        // setData(arr);
        setHeaderData(data?.BillPrint_Json[0]);
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
        loader ? <Loader /> : msg === "" ? <div className={`container max_width_container pad_60_allPrint mt-2 ${style?.exportprint2}`}>
            {/* print button */}
            <div className={`d-flex justify-content-end mb-4 align-items-center ${style?.print_sec_sum4} pt-4 pb-4`}>
                <div className="form-check ps-3 mt-2">
                    <input
                        type="button"
                        className="btn_white blue"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            {/* company address */}
            <div className='pb-2'>
                <p className="fs-6 fw-semibold">SEZ RULE NO. 46(2)</p>
                <p className="fs-6 fw-semibold py-1">Gatisofttech</p>
                <p className='fw-bold'>202,Sai Darshan Appt, Bhim Kacchi Street,</p>
                <p className='fw-bold'>Nr.Central Bank Of India, Nanpura,</p>
                <p className='fw-bold'>surat-395001. India</p>
            </div>
            {/* table title */}
            <p className="fw-semibold text-center border border-black p-1">VALUE ADDITION</p>
            <div className="d-flex border-start border-end border-bottom p-1 border-black">
                <div className="col-3 px-1">
                    <p className="fw-bold"> Inv Exp No: 134/19-20</p>
                </div>
                <div className="col-3 px-1">
                    <p className="fw-bold"> Dated: 22-07-2019</p>
                </div>
                <div className="col-3 px-1">
                    <p className="fw-bold"> EDF No:</p>
                </div>
                <div className="col-3 px-1">
                    <p className="fw-bold">Dated:</p>
                </div>
            </div>
            <div className="d-flex border-start border-end border-bottom border-black">
                <div className={`${style?.des} border-end border-black`}>
                    <div className="d-grid h-100">
                        <div className='d-flex border-bottom border-black justify-content-center align-items-center'></div>
                        <div className='d-flex'>
                            <div className="col-2 p-1 fw-bold border-end border-black d-flex justify-content-center align-items-center"><p className="text-center">Sr. No.</p></div>
                            <div className="col-8 p-1 fw-bold border-end border-black d-flex justify-content-center align-items-center"><p className="text-center">Description</p></div>
                            <div className="col-2 p-1 fw-bold d-flex justify-content-center align-items-center"><p className="text-center">Qty</p></div>
                        </div>
                    </div>
                </div>
                <div className={`${style?.material} border-end border-black`}>
                    <div className="d-grid h-100">
                        <div className="d-flex justify-content-center align-items-center">
                            <p className="fw-bold text-center border-bottom border-black p-1 w-100">Details of Metal</p>
                        </div>
                        <div className="d-flex">
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>Grs Wt (gms)</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center al ign-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>Net Wt (gms)</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>Findings Wt (gms)</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>Wt Loss</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>% Wt Loss</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>Total Wt (gms)</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>Metal Rate/gm IMP</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>Total Metal Cost</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1`}><p className='fw-bold text-center'>Finding Cost</p></div>
                        </div>
                    </div>
                </div>
                <div className={`${style?.studding} border-end border-black`}>
                    <div className="d-grid h-100">
                        <div className="d-flex">
                            <p className="fw-bold text-center border-bottom border-black p-1 w-100 d-flex justify-content-center align-items-center">Details Of Studding</p>
                        </div>
                        <div className="d-flex">
                            <div className={`col-3 p-1 d-flex justify-content-center align-items-center border-end border-black`}><p className='fw-bold text-center'>Tot Pcs</p></div>
                            <div className={`col-4 p-1 d-flex justify-content-center align-items-center border-end border-black`}><p className='fw-bold text-center'>Weight (Cts)</p></div>
                            <div className={`col-5 p-1 d-flex justify-content-center align-items-center`}><p className='fw-bold text-center'>Total Value in US$</p></div>
                        </div>
                    </div>
                </div>
                <div className={`${style?.fob} p-1 d-flex justify-content-center align-items-center`}>
                    <p className="fw-bold text-center">FOB Value in US$</p>
                </div>
            </div>
            {/* table data */}
            <div className="d-flex border-start border-end border-bottom border-black">
                <div className={`${style?.des} border-end border-black d-flex`}>
                    <div className="col-2 p-1 fw-bold border-end border-black d-flex justify-content-center align-items-center"><p className="text-center">1</p></div>
                    <div className="col-8 p-1 fw-bold border-end border-black d-flex justify-content-center align-items-center"><p className="text-center">2</p></div>
                    <div className="col-2 p-1 fw-bold d-flex justify-content-center align-items-center"><p className="text-center">3</p></div>
                </div>
                <div className={`${style?.material} border-end border-black d-flex w-100`}>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>4</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>5</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'></p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>6</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'></p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>7</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>8</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1 border-end border-black`}><p className='fw-bold text-center'>9</p></div>
                            <div className={`${style?.grs} d-flex justify-content-center align-items-center p-1`}><p className='fw-bold text-center'>10</p></div>
                </div>
                <div className={`${style?.studding} border-end border-black d-flex`}>
                            <div className={`col-3 p-1 d-flex justify-content-center align-items-center border-end border-black`}><p className='fw-bold text-center'></p></div>
                            <div className={`col-4 p-1 d-flex justify-content-center align-items-center border-end border-black`}><p className='fw-bold text-center'></p></div>
                            <div className={`col-5 p-1 d-flex justify-content-center align-items-center`}><p className='fw-bold text-center'>11</p></div>
                </div>
                <div className={`${style?.fob} p-1 d-flex justify-content-center align-items-center`}>
                    <p className="fw-bold text-center">12</p>
                </div>
            </div>
            <div className="d-flex border-start border-end border-bottom border-black">
               <p className="fw-semibold p-1">Gold 10KT, Studded Gold Jewellery, 5.00%</p>
            </div>
            <div className="d-flex border-start border-end border-bottom border-black">
                <div className={`${style?.des} border-end border-black d-flex`}>
                    <div className="col-2 p-1 fw-bold border-end border-black"><p className="text-center">1</p></div>
                    <div className="col-8 p-1 fw-bold border-end border-black"><p className="">ER1003476</p></div>
                    <div className="col-2 p-1 fw-bold"><p className="text-end">1</p></div>
                </div>
                <div className={`${style?.material} border-end border-black d-flex w-100`}>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>3.430</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>3.232</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>G</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>0.162</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>5.00</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>3.394</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>18.72</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>63.25</p></div>
                            <div className={`${style?.grs} p-1`}><p className='fw-bold text-end'></p></div>
                </div>
                <div className={`${style?.studding} border-end border-black d-flex`}>
                            <div className={`col-3 p-1 border-end border-black`}><p className='fw-bold text-end'>40</p></div>
                            <div className={`col-4 p-1 border-end border-black`}><p className='fw-bold text-end'>1.000</p></div>
                            <div className={`col-5 p-1`}><p className='fw-bold text-end'>324.00</p></div>
                </div>
                <div className={`${style?.fob} p-1`}>
                    <p className="fw-bold text-end">407.32</p>
                </div>
            </div>
            <div className="d-flex border-start border-end border-bottom border-black">
                <div className={`${style?.des} border-end border-black d-flex`}>
                    <div className="col-10 p-1 fw-bold border-end border-black"><p>Total for</p></div>
                    <div className="col-2 p-1 fw-bold"><p className="text-end">3</p></div>
                </div>
                <div className={`${style?.material} border-end border-black d-flex w-100`}>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>3.430</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>3.232</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>G</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>0.162</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>5.00</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>3.394</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>18.72</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>63.25</p></div>
                            <div className={`${style?.grs} p-1`}><p className='fw-bold text-end'></p></div>
                </div>
                <div className={`${style?.studding} border-end border-black d-flex`}>
                            <div className={`col-3 p-1 border-end border-black`}><p className='fw-bold text-end'>40</p></div>
                            <div className={`col-4 p-1 border-end border-black`}><p className='fw-bold text-end'>1.000</p></div>
                            <div className={`col-5 p-1`}><p className='fw-bold text-end'>324.00</p></div>
                </div>
                <div className={`${style?.fob} p-1`}>
                    <p className="fw-bold text-end">407.32</p>
                </div>
            </div>
            <div className="d-flex border-start border-end border-bottom border-black">
               <p className="fw-semibold p-1">Gold 10KT, Studded Gold Jewellery, 5.00%</p>
            </div>
            <div className="d-flex border-start border-end border-bottom border-black">
                <div className={`${style?.des} border-end border-black d-flex`}>
                    <div className="col-2 p-1 fw-bold border-end border-black"><p className="text-center">4</p></div>
                    <div className="col-8 p-1 fw-bold border-end border-black"><p className="">ER1003476</p></div>
                    <div className="col-2 p-1 fw-bold"><p className="text-end">1</p></div>
                </div>
                <div className={`${style?.material} border-end border-black d-flex w-100`}>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>3.430</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>3.232</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>G</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>0.162</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>5.00</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>3.394</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>18.72</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>63.25</p></div>
                            <div className={`${style?.grs} p-1`}><p className='fw-bold text-end'></p></div>
                </div>
                <div className={`${style?.studding} border-end border-black d-flex`}>
                            <div className={`col-3 p-1 border-end border-black`}><p className='fw-bold text-end'>40</p></div>
                            <div className={`col-4 p-1 border-end border-black`}><p className='fw-bold text-end'>1.000</p></div>
                            <div className={`col-5 p-1`}><p className='fw-bold text-end'>324.00</p></div>
                </div>
                <div className={`${style?.fob} p-1`}>
                    <p className="fw-bold text-end">407.32</p>
                </div>
            </div>
            <div className="d-flex border-start border-end border-bottom border-black">
                <div className={`${style?.des} border-end border-black d-flex`}>
                    <div className="col-2 p-1 fw-bold border-end border-black"><p className="text-center"></p></div>
                    <div className="col-8 p-1 fw-bold border-end border-black"><p className="">SF (Findings)</p></div>
                    <div className="col-2 p-1 fw-bold"><p className="text-end">1</p></div>
                </div>
                <div className={`${style?.material} border-end border-black d-flex w-100`}>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'></p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'></p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'></p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>0.162</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'></p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'></p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>0.96</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'></p></div>
                            <div className={`${style?.grs} p-1`}><p className='fw-bold text-end'>12.02</p></div>
                </div>
                <div className={`${style?.studding} border-end border-black d-flex`}>
                            <div className={`col-3 p-1 border-end border-black`}><p className='fw-bold text-end'></p></div>
                            <div className={`col-4 p-1 border-end border-black`}><p className='fw-bold text-end'></p></div>
                            <div className={`col-5 p-1`}><p className='fw-bold text-end'></p></div>
                </div>
                <div className={`${style?.fob} p-1`}>
                    <p className="fw-bold text-end">407.32</p>
                </div>
            </div>
            <div className="d-flex border-start border-end border-bottom border-black">
                <div className={`${style?.des} border-end border-black d-flex`}>
                    <div className="col-10 p-1 fw-bold border-end border-black"><p>Total for</p></div>
                    <div className="col-2 p-1 fw-bold"><p className="text-end">3</p></div>
                </div>
                <div className={`${style?.material} border-end border-black d-flex w-100`}>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>3.430</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>3.232</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>G</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>0.162</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>5.00</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>3.394</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>18.72</p></div>
                            <div className={`${style?.grs} p-1 border-end border-black`}><p className='fw-bold text-end'>63.25</p></div>
                            <div className={`${style?.grs} p-1`}><p className='fw-bold text-end'></p></div>
                </div>
                <div className={`${style?.studding} border-end border-black d-flex`}>
                            <div className={`col-3 p-1 border-end border-black`}><p className='fw-bold text-end'>40</p></div>
                            <div className={`col-4 p-1 border-end border-black`}><p className='fw-bold text-end'>1.000</p></div>
                            <div className={`col-5 p-1`}><p className='fw-bold text-end'>324.00</p></div>
                </div>
                <div className={`${style?.fob} p-1`}>
                    <p className="fw-bold text-end">407.32</p>
                </div>
            </div>
        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default ExportPrint2;


