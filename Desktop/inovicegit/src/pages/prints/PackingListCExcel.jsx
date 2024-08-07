import React, { useEffect, useState } from 'react'
import { NumberWithCommas, apiCall, checkImageExists, checkImageExistss, checkMsg, handleGlobalImgError, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import style from "../../assets/css/prints/PackingListCExcel.module.css"
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';

const PackingListCExcel = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {

    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [headerData, setHeaderData] = useState({});

    const [checkBox, setCheckbox] = useState({
        image: false,
    });
    const [isImageWorking, setIsImageWorking] = useState(true);
    const handleImageErrors = () => {
        setIsImageWorking(false);
    };
    const [total, setTotal] = useState({
        s_lcPcs: 0,
        s_lcWt: 0,
        s_lbPcs: 0,
        s_lbWt: 0,
        d_bugPcs: 0,
        d_bugWt: 0,
        d_bug_slc_Pcs: 0,
        d_bug_slc_Wt: 0,
        d_prsPcs: 0,
        d_prsWt: 0,
        d_prs_SlcPcs: 0,
        d_prs_SlcWt: 0,
    })

    const [datas, setDatas] = useState({});

    const [data, setData] = useState([]);

    const loadData = async (data) => {
        let resultArr = [];
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
        setDatas(datas);

        let totals = {
            s_lcPcs: 0,
            s_lcWt: 0,
            s_lbPcs: 0,
            s_lbWt: 0,
            d_bugPcs: 0,
            d_bugWt: 0,
            d_bug_slc_Pcs: 0,
            d_bug_slc_Wt: 0,
            d_prsPcs: 0,
            d_prsWt: 0,
            d_prs_SlcPcs: 0,
            d_prs_SlcWt: 0,
            d_rnd_PD5_Wt:0,
            d_rnd_PD5_Pcs:0,
        }
        for (const e of datas?.resultArray || []) {
            let goldRate = 0;
            let goldAmount = 0;
            let findgoldDetails = e?.metal.find((ele, ind) => ele?.IsPrimaryMetal === 1);
            if (findgoldDetails !== undefined) {
                goldRate += findgoldDetails?.Rate;
                goldAmount += findgoldDetails?.Amount;
            }
            let ds_lcPcs = 0;
            let ds_lcWt = 0;
            let s_lbPcs = 0;
            let s_lbPWt = 0;
            let d_bugPcs = 0;
            let d_bugWt = 0;
            let d_bug_slc_Pcs = 0;
            let d_bug_slc_Wt = 0;
            let d_prsPcs = 0;
            let d_prsWt = 0;
            let d_prs_SlcPcs = 0;
            let d_prs_SlcWt = 0;
            let d_rnd_PD5_Wt= 0;
            let d_rnd_PD5_Pcs=0;
            e?.diamonds?.forEach((ele, ind) => {
                if ((ele?.QualityName)?.toLowerCase()?.includes("A2") && ele?.ShapeName?.toLowerCase()?.includes("rnd")) {
                    ds_lcPcs += ele?.Pcs;
                    ds_lcWt += ele?.Wt;
                } else if ((ele?.QualityName)?.toLowerCase()?.includes("A1") && ele?.ShapeName?.toLowerCase()?.includes("rnd")) {
                    s_lbPcs += ele?.Pcs;
                    s_lbPWt += ele?.Wt;
                } else if ((ele?.QualityName)?.toLowerCase()?.includes("A1") && ele?.ShapeName?.toLowerCase()?.includes("bug")) {
                    d_bugPcs += ele?.Pcs;
                    d_bugWt += ele?.Wt;
                } else if ((ele?.QualityName)?.toLowerCase()?.includes("A2") && ele?.ShapeName?.toLowerCase()?.includes("bug")) {
                    d_bug_slc_Pcs += ele?.Pcs;
                    d_bug_slc_Wt += ele?.Wt;
                } else if ((ele?.QualityName)?.toLowerCase()?.includes("A1") && ele?.ShapeName?.toLowerCase()?.includes("prs")) {
                    d_prsPcs += ele?.Pcs;
                    d_prsWt += ele?.Wt;
                } else if ((ele?.QualityName)?.toLowerCase()?.includes("A2") && ele?.ShapeName?.toLowerCase()?.includes("prs")) {
                    d_prs_SlcPcs += ele?.Pcs;
                    d_prs_SlcWt += ele?.Wt;
                } else if ((ele?.QualityName)?.toLowerCase()?.includes("PD5") && ele?.ShapeName?.toLowerCase()?.includes("rnd")) {
                    d_rnd_PD5_Pcs += ele?.Pcs;
                    d_rnd_PD5_Wt += ele?.Wt;
                }
            });

            totals.s_lcPcs += ds_lcPcs;
            totals.s_lcWt += ds_lcWt;
            totals.s_lbPcs += s_lbPcs;
            totals.s_lbWt += s_lbPWt;
            totals.d_bugPcs += d_bugPcs;
            totals.d_bugWt += d_bugWt;
            totals.d_bug_slc_Pcs += d_bug_slc_Pcs;
            totals.d_bug_slc_Wt += d_bug_slc_Wt;
            totals.d_prsPcs += d_prsPcs;
            totals.d_prsWt += d_prsWt;
            totals.d_prs_SlcPcs += d_prs_SlcPcs;
            totals.d_prs_SlcWt += d_prs_SlcWt;
            totals.d_rnd_PD5_Pcs += d_rnd_PD5_Pcs;
            totals.d_rnd_PD5_Wt += d_rnd_PD5_Wt;

            let obj = {
                MFG_DesignNo : e?.MFG_DesignNo,
                jobNo: e?.SrJobno,
                designNo: e?.designno,
                image: e?.DesignImage,
                showImage: false,
                category: e?.Categoryname,
                grosswt: e?.grosswt,
                netwt: e?.NetWt + e?.LossWt,
                mop: "",
                diaPcs: e?.totals?.diamonds?.Pcs,
                diaWt: e?.totals?.diamonds?.Wt,
                ds_lcPcs: ds_lcPcs,
                ds_lcWt: ds_lcWt,
                s_lbPcs: s_lbPcs,
                s_lbPWt: s_lbPWt,
                goldRate: goldRate,
                d_prsPcs: d_prsPcs,
                d_prsWt: d_prsWt,
                d_prs_SlcPcs: d_prs_SlcPcs,
                d_prs_SlcWt: d_prs_SlcWt,
                goldAmount: goldAmount,
                totalPcs: e?.totals?.diamonds?.Pcs,
                totalCts: e?.totals?.diamonds?.Wt,
                d_bugPcs: d_bugPcs,
                d_bugWt: d_bugWt,
                d_bug_slc_Pcs: d_bug_slc_Pcs,
                d_bug_slc_Wt: d_bug_slc_Wt,
                diaAmt: e?.totals?.diamonds?.Amount,
                size: e?.Size,
                remark: e?.lineid,
                colorStoneWt: e?.totals?.colorstone?.Wt
            };

            try {
                const exists = await checkImageExists(e?.DesignImage);
                if (exists) {
                    obj.showImage = true;
                    resultArr.push(obj);
                } else {
                    resultArr.push(obj);
                }
            } catch (error) {
                // console.error("Error checking image existence:", error);
                resultArr.push(obj);
            }

        };

        setTotal(totals);
        setData(resultArr);
        setTimeout(() => {
            const button = document.getElementById('test-table-xls-button');
            if (button !== null) {
                button.click();
            }
        }, 0);
    }
    
    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
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
                    // setMsg(data?.Message);
                    const err = checkMsg(data?.Message);
                    console.log(data?.Message);
                    setMsg(err);
                }
            } catch (error) {
                console.log(error);
            }
        };
        sendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return loader ? (
        <Loader />
    ) : msg === "" ? (
        <>
            {/* buttons */}
            <div className='d-none'>
                <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                    table="table-to-xls"
                    filename={`Packing_List_C_${headerData?.InvoiceNo}_${Date.now()}`}
                    sheet="tablexls"
                    buttonText="Download as XLS" />
                <table id='table-to-xls'>
                    <thead>
                        {/* <tr>
                            <th height={10}></th>
                        </tr> */}
                        <tr>
                            {/* <th width={10} height={50}></th> */}
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>SR NO</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>MFG. DESIGN NO</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>JOB no</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>DESIGN NO.</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' colSpan={2}>IMAGES</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>CATEGORY</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>GROSS WT</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>NET WT</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>MOP & ENAMEL</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>Gold Rate</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>Gold amt</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>Total pcs</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>Total Cts</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D RND (A2) Pcs</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D RND (A2) CW	</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D RND (A1) Pcs</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D RND (A1) CW</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D RND (PD5) Pcs</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D RND (PD5) CW</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D BUG (A1) Pcs</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D BUG (A1) CW</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D BUG (A2) Pcs</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D BUG (A2) CW</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D PR (A1) PCS</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D PR (A1) CW</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D PR (A2) PCS</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D PR (A2) CW</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D.RATE(-2 DIA)</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D.RATE +2-11</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D.RATE +11</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D.RATE-BG</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D PR RATE</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D AMT</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>SIZE</th>
                            <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>REMARK</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((e, i) => {
                            return e?.showImage ?
                                <React.Fragment key={i}>
                                    <tr>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{i + 1}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{e?.MFG_DesignNo}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{e?.jobNo}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{e?.designNo}</td>
                                        <td colSpan={2} height={1} style={{ padding: "10px", borderStart: "0.5px solid #fff", borderTop: "0.5px solid #000", borderEnd: "0.5px solid #000", borderBottom: "0.5px solid #fff" }} align='center'></td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{e?.category}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000" }} align='center'> &nbsp;{NumberWithCommas(e?.grosswt, 3)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{NumberWithCommas(e?.netwt, 3)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{NumberWithCommas(e?.colorStoneWt, 3)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.goldRate, 2)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.goldAmount, 2)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.diaPcs, 0)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.diaWt, 3)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.ds_lcPcs, 0)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.ds_lcWt, 3)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.s_lbPcs, 0)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.s_lbPWt, 3)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_rnd_PD5_Pcs, 0)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_rnd_PD5_Wt, 3)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_bugPcs, 0)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_bugWt, 3)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_bug_slc_Pcs, 0)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_bug_slc_Wt, 3)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_prsPcs, 0)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_prsWt, 3)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_prs_SlcPcs, 0)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_prs_SlcWt, 3)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.diaAmt, 2)}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{e?.size}</td>
                                        <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{e?.remark}</td>
                                    </tr>
                                    <tr>
                                    <td width={1} style={{ padding: "10px", borderStart: "0.5px solid #fff", borderTop: "0.5px solid #000", borderEnd: "0.5px solid #000", borderBottom: "0.5px solid #fff" }} align='center'></td>
                                        <td width={136} style={{ padding: "10px", borderStart: "0.5px solid #fff", borderBottom: "0.5px solid #000", borderEnd: "0.5px solid #000", borderTop: "0.5px solid #fff" }}
                                            align='center' height={e?.showImage ? 136 : 35}>&nbsp;{e?.showImage && <img src={e?.image} alt=' ' width={135} height={135} />}</td>
                                    </tr>
                                </React.Fragment> :
                                <tr key={i}>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{i + 1}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{e?.MFG_DesignNo}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{e?.jobNo}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{e?.designNo}</td>
                                    <td colSpan={2} style={{ padding: "10px", borderStart: "0.5px solid #000", borderTop: "0.5px solid #000", borderEnd: "0.5px solid #000", borderBottom: "0.5px solid #000" }} align='center' ></td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{e?.category}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000" }} align='center'> &nbsp;{NumberWithCommas(e?.grosswt, 3)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{NumberWithCommas(e?.netwt, 3)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{NumberWithCommas(e?.colorStoneWt, 3)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.goldRate, 2)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.goldAmount, 2)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.diaPcs, 0)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.diaWt, 3)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.ds_lcPcs, 0)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.ds_lcWt, 3)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.s_lbPcs, 0)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.s_lbPWt, 3)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_rnd_PD5_Pcs, 0)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_rnd_PD5_Wt, 3)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_bugPcs, 0)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_bugWt, 3)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_bug_slc_Pcs, 0)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_bug_slc_Wt, 3)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_prsPcs, 0)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_prsWt, 3)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_prs_SlcPcs, 0)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_prs_SlcWt, 3)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.diaAmt, 2)}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{e?.size}</td>
                                    <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{e?.remark}</td>
                                </tr>
                        })}
                        <tr>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center' height={40}> </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'> </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'> </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center' colSpan={4}> <b>TOTAL</b></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(datas?.mainTotal?.grosswt, 3)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(datas?.mainTotal?.netwtWithLossWt, 3)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(datas?.mainTotal?.colorstone?.Wt, 3)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'> </td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(datas?.mainTotal?.MetalAmount, 2)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(datas?.mainTotal?.diamonds?.Pcs, 0)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(datas?.mainTotal?.diamonds?.Wt, 3)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.s_lcPcs, 0)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.s_lcWt, 3)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.s_lbPcs, 0)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.s_lbWt, 3)}</td>

                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_rnd_PD5_Pcs, 0)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_rnd_PD5_Wt, 3)}</td>

                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_bugPcs, 0)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_bugWt, 3)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_bug_slc_Pcs, 0)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_bug_slc_Wt, 3)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_prsPcs, 0)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_prsWt, 3)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_prs_SlcPcs, 0)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_prs_SlcWt, 3)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(datas?.mainTotal?.diamonds?.Amount, 2)}</td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'></td>
                            <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
        </p>
    );
}

export default PackingListCExcel

// import React, { useEffect, useState } from 'react'
// import { NumberWithCommas, apiCall, checkImageExists, checkImageExistss, handleGlobalImgError, isObjectEmpty } from '../../GlobalFunctions';
// import Loader from '../../components/Loader';
// import style from "../../assets/css/prints/PackingListCExcel.module.css"
// import ReactHTMLTableToExcel from 'react-html-table-to-excel';
// import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
// import { cloneDeep } from 'lodash';

// const PackingListCExcel = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {

//     const [loader, setLoader] = useState(true);
//     const [msg, setMsg] = useState("");
//     const [headerData, setHeaderData] = useState({});

//     const [checkBox, setCheckbox] = useState({
//         image: false,
//     });
//     const [isImageWorking, setIsImageWorking] = useState(true);
//     const handleImageErrors = () => {
//         setIsImageWorking(false);
//     };
//     const [total, setTotal] = useState({
//         s_lcPcs: 0,
//         s_lcWt: 0,
//         s_lbPcs: 0,
//         s_lbWt: 0,
//         d_bugPcs: 0,
//         d_bugWt: 0,
//         d_bug_slc_Pcs: 0,
//         d_bug_slc_Wt: 0,
//         d_prsPcs: 0,
//         d_prsWt: 0,
//         d_prs_SlcPcs: 0,
//         d_prs_SlcWt: 0,
//     })

//     const [datas, setDatas] = useState({});

//     const [data, setData] = useState([]);

//     const loadData = async (data) => {
//         let resultArr = [];
//         let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
//         setDatas(datas);
//         let datas2 = cloneDeep(datas);
//         datas?.resultArray?.forEach((e) => {
//             let dia = [];
//             e?.diamonds?.forEach((a) => {
//                 let findrec = dia?.findIndex((al) => al?.ShapeName === a?.ShapeName && al?.QualityName === a?.QualityName);
//                 if(findrec === -1){
//                     dia.push(a);
//                 }else{
//                     dia[findrec].Wt += a?.Wt;
//                     dia[findrec].Pcs += a?.Pcs;
//                 }
//             })
//         })


//         let totals = {
//             s_lcPcs: 0,
//             s_lcWt: 0,
//             s_lbPcs: 0,
//             s_lbWt: 0,
//             d_bugPcs: 0,
//             d_bugWt: 0,
//             d_bug_slc_Pcs: 0,
//             d_bug_slc_Wt: 0,
//             d_prsPcs: 0,
//             d_prsWt: 0,
//             d_prs_SlcPcs: 0,
//             d_prs_SlcWt: 0,
//             d_rnd_PD5_Wt:0,
//             d_rnd_PD5_Pcs:0,
//         }
//         for (const e of datas?.resultArray || []) {
//             let goldRate = 0;
//             let goldAmount = 0;
//             let findgoldDetails = e?.metal.find((ele, ind) => ele?.IsPrimaryMetal === 1);
//             if (findgoldDetails !== undefined) {
//                 goldRate += findgoldDetails?.Rate;
//                 goldAmount += findgoldDetails?.Amount;
//             }
//             let ds_lcPcs = 0;
//             let ds_lcWt = 0;
//             let s_lbPcs = 0;
//             let s_lbPWt = 0;
//             let d_bugPcs = 0;
//             let d_bugWt = 0;
//             let d_bug_slc_Pcs = 0;
//             let d_bug_slc_Wt = 0;
//             let d_prsPcs = 0;
//             let d_prsWt = 0;
//             let d_prs_SlcPcs = 0;
//             let d_prs_SlcWt = 0;
//             let d_rnd_PD5_Wt= 0;
//             let d_rnd_PD5_Pcs=0;
//             e?.diamonds?.forEach((ele, ind) => {
//                 if ((ele?.QualityName)?.toLowerCase()?.includes("a2") && ele?.ShapeName?.toLowerCase()?.includes("rnd")) {
//                     ds_lcPcs += ele?.Pcs;
//                     ds_lcWt += ele?.Wt;
//                 } else if ((ele?.QualityName)?.toLowerCase()?.includes("a1") && ele?.ShapeName?.toLowerCase()?.includes("rnd")) {
//                     s_lbPcs += ele?.Pcs;
//                     s_lbPWt += ele?.Wt;
//                 } else if ((ele?.QualityName)?.toLowerCase()?.includes("a1") && ele?.ShapeName?.toLowerCase()?.includes("bug")) {
//                     d_bugPcs += ele?.Pcs;
//                     d_bugWt += ele?.Wt;
//                 } else if ((ele?.QualityName)?.toLowerCase()?.includes("a2") && ele?.ShapeName?.toLowerCase()?.includes("bug")) {
//                     d_bug_slc_Pcs += ele?.Pcs;
//                     d_bug_slc_Wt += ele?.Wt;
//                 } else if ((ele?.QualityName)?.toLowerCase()?.includes("a1") && ele?.ShapeName?.toLowerCase()?.includes("prs")) {
//                     d_prsPcs += ele?.Pcs;
//                     d_prsWt += ele?.Wt;
//                 } else if ((ele?.QualityName)?.toLowerCase()?.includes("a2") && ele?.ShapeName?.toLowerCase()?.includes("prs")) {
//                     d_prs_SlcPcs += ele?.Pcs;
//                     d_prs_SlcWt += ele?.Wt;
//                 } else if ((ele?.QualityName)?.toLowerCase()?.includes("pd5") && ele?.ShapeName?.toLowerCase()?.includes("rnd")) {
//                     d_rnd_PD5_Pcs += ele?.Pcs;
//                     d_rnd_PD5_Wt += ele?.Wt;
//                 }
//             });
            
//             totals.s_lcPcs += ds_lcPcs;
//             totals.s_lcWt += ds_lcWt;
//             totals.s_lbPcs += s_lbPcs;
//             totals.s_lbWt += s_lbPWt;
//             totals.d_bugPcs += d_bugPcs;
//             totals.d_bugWt += d_bugWt;
//             totals.d_bug_slc_Pcs += d_bug_slc_Pcs;
//             totals.d_bug_slc_Wt += d_bug_slc_Wt;
//             totals.d_prsPcs += d_prsPcs;
//             totals.d_prsWt += d_prsWt;
//             totals.d_prs_SlcPcs += d_prs_SlcPcs;
//             totals.d_prs_SlcWt += d_prs_SlcWt;
//             totals.d_rnd_PD5_Pcs += d_rnd_PD5_Pcs;
//             totals.d_rnd_PD5_Wt += d_rnd_PD5_Wt;

//             let obj = {
//                 MFG_DesignNo : e?.MFG_DesignNo,
//                 jobNo: e?.SrJobno,
//                 designNo: e?.designno,
//                 image: e?.DesignImage,
//                 showImage: false,
//                 category: e?.Categoryname,
//                 grosswt: e?.grosswt,
//                 netwt: e?.NetWt + e?.LossWt,
//                 mop: "",
//                 diaPcs: e?.totals?.diamonds?.Pcs,
//                 diaWt: e?.totals?.diamonds?.Wt,
//                 ds_lcPcs: ds_lcPcs,
//                 ds_lcWt: ds_lcWt,
//                 s_lbPcs: s_lbPcs,
//                 s_lbPWt: s_lbPWt,
//                 goldRate: goldRate,
//                 d_prsPcs: d_prsPcs,
//                 d_prsWt: d_prsWt,
//                 d_prs_SlcPcs: d_prs_SlcPcs,
//                 d_prs_SlcWt: d_prs_SlcWt,
//                 goldAmount: goldAmount,
//                 totalPcs: e?.totals?.diamonds?.Pcs,
//                 totalCts: e?.totals?.diamonds?.Wt,
//                 d_bugPcs: d_bugPcs,
//                 d_bugWt: d_bugWt,
//                 d_bug_slc_Pcs: d_bug_slc_Pcs,
//                 d_bug_slc_Wt: d_bug_slc_Wt,
//                 diaAmt: e?.totals?.diamonds?.Amount,
//                 size: e?.Size,
//                 remark: e?.lineid,
//                 colorStoneWt: e?.totals?.colorstone?.Wt
//             };

//             try {
//                 const exists = await checkImageExists(e?.DesignImage);
//                 if (exists) {
//                     obj.showImage = true;
//                     resultArr.push(obj);
//                 } else {
//                     resultArr.push(obj);
//                 }
//             } catch (error) {
//                 // console.error("Error checking image existence:", error);
//                 resultArr.push(obj);
//             }

//         };

//         setTotal(totals);
//         setData(resultArr);
//         setTimeout(() => {
//             const button = document.getElementById('test-table-xls-button');
//             if (button !== null) {
//                 button.click();
//             }
//         }, 0);
//     }
    
//     useEffect(() => {
//         const sendData = async () => {
//             try {
//                 const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
//                 if (data?.Status === "200") {
//                     let isEmpty = isObjectEmpty(data?.Data);
//                     if (!isEmpty) {
//                         loadData(data?.Data);
//                         setLoader(false);
//                     } else {
//                         setLoader(false);
//                         setMsg("Data Not Found");
//                     }
//                 } else {
//                     setLoader(false);
//                     setMsg(data?.Message);
//                 }
//             } catch (error) {
//                 console.error(error);
//             }
//         };
//         sendData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);
//     return loader ? (
//         <Loader />
//     ) : msg === "" ? (
//         <>
//             {/* buttons */}
//             <div className='d-none'>
//                 <ReactHTMLTableToExcel
//                     id="test-table-xls-button"
//                     className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
//                     table="table-to-xls"
//                     filename={`Packing_List_C_${headerData?.InvoiceNo}_${Date.now()}`}
//                     sheet="tablexls"
//                     buttonText="Download as XLS" />
//                 <table id='table-to-xls'>
//                     <thead>
//                         {/* <tr>
//                             <th height={10}></th>
//                         </tr> */}
//                         <tr>
//                             {/* <th width={10} height={50}></th> */}
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>SR NO</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>MFG. DESIGN NO</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>JOB no</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>DESIGN NO.</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' colSpan={2}>IMAGES</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>CATEGORY</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>GROSS WT</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>NET WT</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>MOP & ENAMEL</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>Gold Rate</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>Gold amt</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>Total pcs</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>Total Cts</th>

//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>Quality</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D RND PCS</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D RND WT</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D BUG PCS</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D BUG WT</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D PRS PCS</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D PRS WT</th>
//                             {/* <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D RND (A2) Pcs</th> */}
//                             {/* <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D RND (A2) CW	</th> */}
//                             {/* <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D RND (A1) Pcs</th> */}
//                             {/* <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D RND (A1) CW</th> */}
//                             {/* <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D RND (PD5) Pcs</th> */}
//                             {/* <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D RND (PD5) CW</th> */}
//                             {/* <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D BUG (A1) Pcs</th> */}
//                             {/* <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D BUG (A1) CW</th> */}
//                             {/* <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D BUG (A2) Pcs</th> */}
//                             {/* <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D BUG (A2) CW</th> */}
//                             {/* <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D PR (A1) PCS</th> */}
//                             {/* <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D PR (A1) CW</th> */}
//                             {/* <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D PR (A2) PCS</th> */}
//                             {/* <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D PR (A2) CW</th> */}
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D.RATE(-2 DIA)</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D.RATE +2-11</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D.RATE +11</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D.RATE-BG</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D PR RATE</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>D AMT</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>SIZE</th>
//                             <th style={{ padding: "1px", border: "0.5px solid #000", }} align='center' width={100}>REMARK</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {data.map((e, i) => {
//                             return e?.showImage ?
//                                 <React.Fragment key={i}>
//                                     <tr>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{i + 1}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{e?.MFG_DesignNo}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{e?.jobNo}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{e?.designNo}</td>
//                                         <td colSpan={2} height={1} style={{ padding: "10px", borderStart: "0.5px solid #fff", borderTop: "0.5px solid #000", borderEnd: "0.5px solid #000", borderBottom: "0.5px solid #fff" }} align='center'></td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{e?.category}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000" }} align='center'> &nbsp;{NumberWithCommas(e?.grosswt, 3)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{NumberWithCommas(e?.netwt, 3)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{NumberWithCommas(e?.colorStoneWt, 3)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.goldRate, 2)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.goldAmount, 2)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.diaPcs, 0)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.diaWt, 3)}</td>

//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;</td>
//                                         {/* <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.ds_lcPcs, 0)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.ds_lcWt, 3)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.s_lbPcs, 0)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.s_lbPWt, 3)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_rnd_PD5_Pcs, 0)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_rnd_PD5_Wt, 3)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_bugPcs, 0)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_bugWt, 3)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_bug_slc_Pcs, 0)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_bug_slc_Wt, 3)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_prsPcs, 0)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_prsWt, 3)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_prs_SlcPcs, 0)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_prs_SlcWt, 3)}</td> */}
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.diaAmt, 2)}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{e?.size}</td>
//                                         <td rowSpan={2} style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{e?.remark}</td>
//                                     </tr>
//                                     <tr>
//                                     <td width={1} style={{ padding: "10px", borderStart: "0.5px solid #fff", borderTop: "0.5px solid #000", borderEnd: "0.5px solid #000", borderBottom: "0.5px solid #fff" }} align='center'></td>
//                                         <td width={136} style={{ padding: "10px", borderStart: "0.5px solid #fff", borderBottom: "0.5px solid #000", borderEnd: "0.5px solid #000", borderTop: "0.5px solid #fff" }}
//                                             align='center' height={e?.showImage ? 136 : 35}>&nbsp;{e?.showImage && <img src={e?.image} alt=' ' width={135} height={135} />}</td>
//                                     </tr>
//                                 </React.Fragment> :
//                                 <tr key={i}>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{i + 1}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{e?.MFG_DesignNo}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{e?.jobNo}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{e?.designNo}</td>
//                                     <td colSpan={2} style={{ padding: "10px", borderStart: "0.5px solid #000", borderTop: "0.5px solid #000", borderEnd: "0.5px solid #000", borderBottom: "0.5px solid #000" }} align='center' ></td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{e?.category}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000" }} align='center'> &nbsp;{NumberWithCommas(e?.grosswt, 3)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{NumberWithCommas(e?.netwt, 3)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'> &nbsp;{NumberWithCommas(e?.colorStoneWt, 3)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.goldRate, 2)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.goldAmount, 2)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.diaPcs, 0)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.diaWt, 3)}</td>

//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;</td>
//                                     {/* <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.ds_lcPcs, 0)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.ds_lcWt, 3)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.s_lbPcs, 0)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.s_lbPWt, 3)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_rnd_PD5_Pcs, 0)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_rnd_PD5_Wt, 3)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_bugPcs, 0)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_bugWt, 3)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_bug_slc_Pcs, 0)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_bug_slc_Wt, 3)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_prsPcs, 0)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_prsWt, 3)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_prs_SlcPcs, 0)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.d_prs_SlcWt, 3)}</td> */}
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;0.00</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{NumberWithCommas(e?.diaAmt, 2)}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{e?.size}</td>
//                                     <td style={{ padding: "1px", border: "0.5px solid #000", }} align='center'>&nbsp;{e?.remark}</td>
//                                 </tr>
//                         })}
//                         <tr>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center' height={40}> </td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'> </td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'> </td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center' colSpan={4}> <b>TOTAL</b></td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(datas?.mainTotal?.grosswt, 3)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(datas?.mainTotal?.netwtWithLossWt, 3)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(datas?.mainTotal?.colorstone?.Wt, 3)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'> </td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(datas?.mainTotal?.MetalAmount, 2)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(datas?.mainTotal?.diamonds?.Pcs, 0)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(datas?.mainTotal?.diamonds?.Wt, 3)}</td>

//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;</td>
//                             {/* <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.s_lcPcs, 0)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.s_lcWt, 3)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.s_lbPcs, 0)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.s_lbWt, 3)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_rnd_PD5_Pcs, 0)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_rnd_PD5_Wt, 3)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_bugPcs, 0)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_bugWt, 3)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_bug_slc_Pcs, 0)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_bug_slc_Wt, 3)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_prsPcs, 0)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_prsWt, 3)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_prs_SlcPcs, 0)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(total?.d_prs_SlcWt, 3)}</td> */}
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'></td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'></td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'></td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'></td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'></td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'>&nbsp;{NumberWithCommas(datas?.mainTotal?.diamonds?.Amount, 2)}</td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'></td>
//                             <td style={{ padding: "1px", border: "0.5px solid #000", fontWeight: "bold" }} align='center'></td>
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>
//         </>
//     ) : (
//         <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
//             {msg}
//         </p>
//     );
// }

// export default PackingListCExcel
