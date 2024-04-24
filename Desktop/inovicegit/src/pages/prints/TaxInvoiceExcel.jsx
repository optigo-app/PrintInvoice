import React, { useEffect, useState } from 'react'
import { apiCall, formatAmount, handleGlobalImgError, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import  ReactHTMLTableToExcel  from 'react-html-table-to-excel';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';

const TaxInvoiceExcel = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [result, setResult] = useState(null);
    const [result2, setResult2] = useState(null);
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const [isImageWorking, setIsImageWorking] = useState(true);

    const handleImageErrors = () => {
      setIsImageWorking(false);
    };

    useEffect(() => {
        const sendData = async () => {
          try {
            const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadData = (data) => {
        const copydata = cloneDeep(data);

        let address = copydata?.BillPrint_Json[0]?.Printlable?.split("\r\n");
        copydata.BillPrint_Json[0].address = address;
    
        const datas = OrganizeDataPrint(
          copydata?.BillPrint_Json[0],
          copydata?.BillPrint_Json1,
          copydata?.BillPrint_Json2
        );

        datas?.resultArray?.forEach((el) => {
            let dia = [];
            el?.diamonds?.forEach((a) => {
                let obj = cloneDeep(a);
                let findrec = dia?.findIndex((ele) => ele?.ShapeName === obj?.ShapeName && ele?.QualityName === obj?.QualityName && ele?.Colorname === obj?.Colorname)
                if(findrec === -1){
                    dia.push(obj);
                }else{
                    dia[findrec].Wt += obj?.Wt;
                    dia[findrec].Pcs += obj?.Pcs;
                    dia[findrec].Rate += obj?.Rate;
                    dia[findrec].Amount += obj?.Amount;
                }
            })
            el.diamonds = dia;
            let clr = [];
            el?.colorstone?.forEach((a) => {
                let obj = cloneDeep(a);
                let findrec = clr?.findIndex((ele) => ele?.ShapeName === obj?.ShapeName && ele?.QualityName === obj?.QualityName && ele?.Colorname === obj?.Colorname && ele?.isRateOnPcs === obj?.isRateOnPcs)
                if(findrec === -1){
                    clr.push(obj);
                }else{
                    clr[findrec].Wt += obj?.Wt;
                    clr[findrec].Pcs += obj?.Pcs;
                    clr[findrec].Rate += obj?.Rate;
                    clr[findrec].Amount += obj?.Amount;
                }
            })
            el.colorstone = clr;
        })

        let finalArr = [];
        datas?.resultArray?.forEach((e, i) => {
            let findMetal = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1)
            let obj = {};
            obj.sr = (i + 1);
            obj.SrJobno = `${e?.SrJobno}`;
            obj.designno = e?.designno;

            obj.dia_code = e?.diamonds[0] ? e?.diamonds[0]?.ShapeName : '';
            obj.dia_size = e?.diamonds[0] ? e?.diamonds[0]?.SizeName : '';
            obj.dia_pcs = e?.diamonds[0] ? e?.diamonds[0]?.Pcs : '';
            obj.dia_wt = e?.diamonds[0] ? ((e?.diamonds[0]?.Wt)?.toFixed(3)) : '';
            obj.dia_rate = e?.diamonds[0] ? (Math.round((e?.diamonds[0]?.Amount / e?.diamonds[0]?.Wt))) : '';
            obj.dia_amt = e?.diamonds[0] ? (formatAmount(e?.diamonds[0]?.Amount)) : '';


            obj.met_quality = '';
            obj.met_wt = 0;
            obj.met_rate = 0;
            obj.met_amt = 0;
            // if(findMetal ){
                obj.met_wt = e?.NetWt;
                obj.met_rate = findMetal ? (Math.round(findMetal?.Amount / e?.NetWt)) : '';
                obj.met_amt = findMetal ? (formatAmount(findMetal?.Amount)) : '';
                obj.met_quality = findMetal ? (findMetal?.ShapeName + " " + findMetal?.QualityName) : '';
            // }


            obj.cls_code = e?.colorstone[0] ? (e?.colorstone[0]?.ShapeName) : '';
            obj.cls_size = e?.colorstone[0] ? (e?.colorstone[0]?.SizeName) : '';
            obj.cls_pcs = e?.colorstone[0] ? (e?.colorstone[0]?.Pcs) : '';
            obj.cls_wt = e?.colorstone[0] ? ((e?.colorstone[0]?.Wt)?.toFixed(3)) : '';
            obj.cls_rate = e?.colorstone[0] ? (Math.round(e?.colorstone[0]?.Amount / e?.colorstone[0]?.Wt)) : '';
            obj.cls_amt = e?.colorstone[0] ? (formatAmount(e?.colorstone[0]?.Amount)) : '';


            obj.oth_amt = ( e?.OtherCharges + e?.TotalDiamondHandling + e?.MiscAmount);
            obj.labour_rate = e?.MaKingCharge_Unit;
            obj.labour_amt = (e?.MakingAmount + e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount);
            obj.total_amount = e?.TotalAmount;
            
            let arr = [];
            let len = 3;
            if(e?.diamonds?.length > e?.colorstone?.length){
                if(e?.diamonds?.length > 3){
                    len = e?.diamonds?.length;
                }
            }else if(e?.diamonds?.length < e?.colorstone?.length){
                    if(e?.colorstone?.length > 3){
                    len = e?.colorstone?.length;
                }
            }
            Array?.from({length : len})?.map((el, i) => {
                let obj = {};
                obj.img = e?.DesignImage;
                obj.imgflag = false;
                if(i === 0){
                    obj.imgflag = true;
                }
                obj.tunch = ((e?.Tunch)?.toFixed(3));
                obj.tunchflag = false;
                if(i === 0){
                    obj.tunchflag = true;
                }

                obj.grosswt = ((e?.grosswt)?.toFixed(3));
                obj.grosswetflag = false;
                if(i === 1){
                    obj.grosswetflag = true;
                }

                //diamond
                obj.dia_code = '';
                obj.dia_size = '';
                obj.dia_pcs = 0;
                obj.dia_wt = 0;
                obj.dia_rate = 0;
                obj.dia_amt = 0;
                obj.diaflag = false;
                if(e?.diamonds[i+1]){
                    obj.diaflag = true;
                    obj.dia_code = e?.diamonds[i+1]?.ShapeName + " " + e?.diamonds[i+1]?.QualityName + " " + e?.diamonds[i+1]?.Colorname;
                    obj.dia_size = e?.diamonds[i+1]?.SizeName;
                    obj.dia_pcs = e?.diamonds[i+1]?.Pcs;
                    obj.dia_wt = ((e?.diamonds[i+1]?.Wt)?.toFixed(3));
                    obj.dia_rate = (Math.round(e?.diamonds[i+1]?.Amount / (e?.diamonds[i+1]?.Wt === 0 ? 1 : e?.diamonds[i+1]?.Wt)));
                    obj.dia_amt = (formatAmount(e?.diamonds[i+1]?.Amount));
                }

                // colorstone
                obj.cls_code = '';
                obj.cls_size = '';
                obj.cls_pcs = 0;
                obj.cls_wt = 0;
                obj.cls_rate = 0;
                obj.cls_amt = 0;
                obj.clsflag = false;
                if(e?.colorstone[i+1]){
                    obj.clsflag = true;
                    obj.cls_code = e?.colorstone[i+1]?.ShapeName + " " + e?.colorstone[i+1]?.QualityName + " " + e?.colorstone[i+1]?.Colorname;
                    obj.cls_size = e?.colorstone[i+1]?.SizeName;
                    obj.cls_pcs = e?.colorstone[i+1]?.Pcs;
                    obj.cls_wt = ((e?.colorstone[i+1]?.Wt)?.toFixed(3));
                    obj.cls_rate = (Math.round(e?.colorstone[i+1]?.Amount / (e?.colorstone[i+1]?.Wt === 0 ? 1 : e?.colorstone[i+1]?.Wt)));
                    obj.cls_amt = (formatAmount(e?.colorstone[i+1]?.Amount));
                }

                obj.JobRemark = e?.JobRemark;
                obj.jobRemarkflag = false;
                if(i === 1 && e?.JobRemark !== ''){
                    obj.jobRemarkflag = true;
                }

                arr.push(obj);

            })

            obj.matrialArr = arr;
            obj.values = e;

            finalArr.push(obj);
        })

        setResult2(finalArr);
        setResult(datas);

        setTimeout(() => {
            const button = document.getElementById('test-table-xls-button');
            button.click();
          }, 2000);
    }

    //styles and css
    const tableCellStyle = {
        height: '40px',
        backgroundColor: '#939292',
        color: 'white',
        fontSize:'20px',
        fontWeight:'bold'
    };
    console.log(result)

    
   

  return (
    <>
    {
        loader ? <Loader /> : <>
        {
            msg === '' ? <>
            <div style={{paddingBottom:'5rem'}}>
                <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                    table="table-to-xls"
                    filename={`DetailPrint11_${result?.header?.InvoiceNo}_${Date.now()}`}
                    sheet="tablexls"
                    buttonText="Download as XLS"
                 />
                <table id='table-to-xls'>
                    <tbody>

                        {/* head line */}
                        <tr> <td colSpan={23} style={tableCellStyle}>{result?.header?.PrintHeadLabel}</td> </tr>
                        

                        {/* company header */}
                        <tr > <td style={{fontSize:'18px', fontWeight:'bold', paddingBottom:'5px'}} colSpan={21}>{result?.header?.CompanyFullName}</td> <td colSpan={2}></td> </tr>
                        <tr> 
                            <td  colSpan={21}> {result?.header?.CompanyAddress} </td> 
                            <td width={132} style={{ padding:'5px'}} colSpan={2} rowSpan={5}>{isImageWorking && (result?.header?.PrintLogo !== "" && 
                                    <img src={result?.header?.PrintLogo} alt="" 
                                    className='w-25 h-auto ms-auto d-block object-fit-contain'
                                    onError={handleImageErrors} width={132} />)}
                            </td>
                        </tr>
                        <tr> <td  colSpan={21}> {result?.header?.CompanyAddress2} </td> </tr>
                        <tr> <td  colSpan={21}> {result?.header?.CompanyCity} - {result?.header?.CompanyPinCode}, {result?.header?.CompanyState} ({result?.header?.CompanyCountry}) </td> </tr>
                        <tr> <td  colSpan={21}>T {result?.header?.CompanyTellNo} | TOLL FREE {result?.header?.CompanyTollFreeNo} </td> </tr>
                        <tr> <td  colSpan={21}> {result?.header?.CompanyAddress} </td> </tr>
                        <tr> <td  colSpan={21}> {result?.header?.Company_VAT_GST_No} | {result?.header?.Company_CST_STATE} - {result?.header?.Company_CST_STATE_No} | {result?.header?.Com_pannumber} </td> </tr>
                        <tr>
                            <td></td>
                        </tr>
                        {/* customer header */}
                        <tr>
                            <th  align='start' style={{borderLeft:'1px solid #e8e8e8', borderTop:'1px solid #e8e8e8', textAlign:'start'}}>TO,</th>
                            <th align='left' colSpan={18} style={{borderTop:'1px solid #e8e8e8'}}>{result?.header?.customerfirmname}</th>
                            <td colSpan={2} style={{borderTop:'1px solid #e8e8e8'}}></td>
                            <th colSpan={2} style={{borderTop:'1px solid #e8e8e8', borderRight:'1px solid #e8e8e8'}}></th>
                        </tr>                       
                        <tr>
                            <td rowSpan={5} style={{borderBottom:'1px solid #e8e8e8', borderLeft:'1px solid #e8e8e8'}}></td>
                            <td colSpan={18}>{result?.header?.customerstreet}</td>
                            <td colSpan={2} >INVOICE#:</td>
                            <th colSpan={2} style={{borderRight:'1px solid #e8e8e8'}}>{result?.header?.InvoiceNo}</th>
                        </tr>
                        <tr>
                            
                            <td colSpan={18}>{result?.header?.customerAddress2}</td>
                            <td colSpan={2}>DATE#:</td>
                            <th colSpan={2} style={{borderRight:'1px solid #e8e8e8'}}>{result?.header?.EntryDate}</th>
                        </tr>
                        <tr>
                            
                            <td colSpan={18}>{result?.header?.customercity}{result?.header?.customerpincode}</td>
                            <td colSpan={2}>{result?.header?.HSN_No_Label} :</td>
                            <th colSpan={2} style={{borderRight:'1px solid #e8e8e8'}}>{result?.header?.HSN_No}</th>
                        </tr>
                        <tr>
                            
                            <td colSpan={18}>Phno: {result?.header?.customermobileno}</td>
                            <td colSpan={2}></td>
                            <th colSpan={2} style={{borderRight:'1px solid #e8e8e8'}}></th>
                        </tr>
                        <tr>
                            <td style={{borderBottom:'1px solid #e8e8e8'}} colSpan={18}>GSTIN : {result?.header?.CustGstNo} | {result?.header?.Cust_CST_STATE} - {result?.header?.Cust_CST_STATE_No} | PAN - {result?.header?.CustPanno}</td>
                            <td colSpan={2} style={{borderBottom:'1px solid #e8e8e8'}}></td>
                            <th colSpan={2} style={{borderBottom:'1px solid #e8e8e8', borderRight:'1px solid #e8e8e8'}}></th>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>

                        {/* table */}
                        <tr>
                            <th style={{borderLeft:'1px solid #989898',borderTop:'1px solid #989898', backgroundColor:'#F5F5F5'}}>Sr</th>
                            <th style={{borderLeft:'1px solid #989898',borderTop:'1px solid #989898',  backgroundColor:'#F5F5F5'}} colSpan={2}>Design</th>
                            <th style={{borderLeft:'1px solid #989898',borderTop:'1px solid #989898', borderBottom:'1px solid #989898',  backgroundColor:'#F5F5F5'}} colSpan={6}>Diamond</th>
                            <th style={{borderLeft:'1px solid #989898',borderTop:'1px solid #989898', borderBottom:'1px solid #989898',  backgroundColor:'#F5F5F5'}} colSpan={4}>Metal</th>
                            <th style={{borderLeft:'1px solid #989898',borderTop:'1px solid #989898', borderBottom:'1px solid #989898',  backgroundColor:'#F5F5F5'}} colSpan={6}>Stone</th>
                            <th style={{borderLeft:'1px solid #989898',borderTop:'1px solid #989898', borderBottom:'1px solid #989898',  backgroundColor:'#F5F5F5'}} colSpan={1}>Other</th>
                            <th style={{borderLeft:'1px solid #989898',borderTop:'1px solid #989898', borderBottom:'1px solid #989898',  backgroundColor:'#F5F5F5'}} colSpan={2}>Labour</th>
                            <th style={{borderLeft:'1px solid #989898',borderTop:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}} colSpan={1}>Total</th>
                        </tr>
                        <tr>
                            <th style={{borderLeft:'1px solid #989898', borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}></th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}} colSpan={2}></th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}} >Code</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}} >Size</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}>Pcs</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}>Wt</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}>Rate</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}>Amount</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}>Quality</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}>Wt</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}>Rate</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}>Amount</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}>Code</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}>Size</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}>Pcs</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}>Wt</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}>Rate</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}>Amount</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}>Amount</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}>Rate</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}>Amount</th>
                            <th style={{borderBottom:'1px solid #989898', borderRight:'1px solid #989898',  backgroundColor:'#F5F5F5'}}>Amount</th>
                        </tr>
                        {
                            result2?.map((e) => {
                                return (<>
                                    <tr>
                                        <td width={90} style={{borderRight:'1px solid #989898'}} align='center'>{e?.sr}</td>
                                        <td width={90}>&nbsp;{e?.SrJobno}</td>
                                        <td width={90} style={{borderRight:'1px solid #989898'}}>{e?.designno}</td>
                                        <td width={90}>{e?.dia_code}</td>
                                        <td width={90}>{e?.dia_size}</td>
                                        <td width={90}>{e?.dia_pcs}</td>
                                        <td width={90}>{e?.dia_wt}</td>
                                        <td width={90}>{e?.dia_rate}</td>
                                        <td width={90} style={{borderRight:'1px solid #989898'}}>{e?.dia_amt}</td>
                                        <td width={90}>{e?.met_quality}</td>
                                        <td width={90}>{e?.met_wt}</td>
                                        <td width={90}>{e?.met_rate}</td>
                                        <td width={90} style={{borderRight:'1px solid #989898'}}>{e?.met_amt}</td>
                                        <td width={90}>{e?.cls_code}</td>
                                        <td width={90}>{e?.cls_size}</td>
                                        <td width={90}>{e?.cls_pcs}</td>
                                        <td width={90}>{e?.cls_wt}</td>
                                        <td width={90}>{e?.cls_rate}</td>
                                        <td width={90} style={{borderRight:'1px solid #989898'}}>{e?.cls_amt}</td>
                                        <td width={90} style={{borderRight:'1px solid #989898'}}>{e?.oth_amt}</td>
                                        <td width={90} style={{borderRight:'1px solid #989898'}}>{e?.labour_rate}</td>
                                        <td width={90} style={{borderRight:'1px solid #989898'}}>{e?.labour_amt}</td>
                                        <td width={90} style={{borderRight:'1px solid #989898'}}>{e?.total_amount}</td>
                                    </tr>
                                    {
                                        e?.matrialArr?.map((val, ind) => {
                                            return <tr key={ind}>
                                                <td width={90} style={{borderRight:'1px solid #989898'}} align='center'></td>
                                                <td  colSpan={2} style={{borderRight:'1px solid #989898', verticalAlign:'center'}} align='center'>
                                                    <span style={{textAlign:'center'}}>{val?.imgflag && <img src={val?.img} alt=""  onError={eve => handleGlobalImgError(eve, result?.header?.DefImage)} width={70}  style={{ paddingLeft: "10px", objectFit: "contain", verticalAlign:'center' }} />}</span>
                                                    <div style={{textAlign:'center'}}>{val?.tunchflag && `Tunch : `} {val?.tunchflag && val?.tunch}</div>
                                                    <div style={{textAlign:'center'}}>{val?.grosswetflag && val?.grosswt} {val?.grosswetflag && ' gm Gross'}</div>
                                                </td>
                                                {/* <td width={90}></td> */}
                                                <td width={90}>{ val?.diaflag && val?.dia_code}</td>
                                                <td width={90}>{val?.diaflag && val?.dia_size}</td>
                                                <td width={90}>{val?.diaflag && val?.dia_pcs}</td>
                                                <td width={90}>{val?.diaflag && val?.dia_wt}</td>
                                                <td width={90}>{val?.diaflag && val?.dia_rate}</td>
                                                <td width={90} style={{borderRight:'1px solid #989898'}}>{val?.diaflag && val?.dia_amt}</td>
                                                <td width={90}></td>
                                                <td width={90}></td>
                                                <td width={90}></td>
                                                <td width={90} style={{borderRight:'1px solid #989898'}}></td>
                                                <td width={90}>{val?.clsflag && val?.cls_code}</td>
                                                <td width={90}>{val?.clsflag && val?.cls_size}</td>
                                                <td width={90}>{val?.clsflag && val?.cls_pcs}</td>
                                                <td width={90}>{val?.clsflag && val?.cls_wt}</td>
                                                <td width={90}>{val?.clsflag && val?.cls_rate}</td>
                                                <td width={90} style={{borderRight:'1px solid #989898'}}>{val?.clsflag && val?.cls_amt}</td>
                                                <td width={90} style={{borderRight:'1px solid #989898'}}></td>
                                                <td width={90} style={{borderRight:'1px solid #989898'}}></td>
                                                <td width={90} style={{borderRight:'1px solid #989898'}}></td>
                                                <td width={90} style={{borderRight:'1px solid #989898'}}></td>
                                            </tr>
                                        })
                                    }
                                    <tr>
                                        <td style={{borderRight:'1px solid #989898', borderBottom:'1px solid #989898'}}></td>
                                        <td style={{borderRight:'1px solid #989898', borderBottom:'1px solid #989898'}} align='center' colSpan={2}>{ e?.values?.CertificateNo === '' ? '' : 'Cert#:'}<b>{e?.values?.CertificateNo === '' ? '' : e?.values?.CertificateNo}</b></td>
                                        {/* <td align='center' ><td></td></td> */}
                                        {/* diamonds */}
                                        <td style={{backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}></td>
                                        <td style={{backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}></td>
                                        <th align='right' style={{backgroundColor:'#F5F5F5',borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}} >{e?.values?.totals?.diamonds?.Pcs === 0 ? '' : e?.values?.totals?.diamonds?.Pcs}</th>
                                        <th align='right' style={{backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}>{ e?.values?.totals?.diamonds?.Wt === 0 ? '' : (e?.values?.totals?.diamonds?.Wt)?.toFixed(3)}</th>
                                        {/* <td>{((e?.values?.totals?.diamonds?.Amount / (e?.values?.totals?.diamonds?.Wt === 0 ? 1 : e?.values?.totals?.diamonds?.Wt)))}</td> */}
                                        <th align='right' style={{backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}></th>
                                        <th align='right' style={{borderRight:'1px solid #989898', backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}>{ e?.values?.totals?.diamonds?.Amount === 0 ? '' : formatAmount((e?.values?.totals?.diamonds?.Amount))}</th>
                                        <th align='right' style={{backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}></th>
                                        {/* <td>{e?.values?.totals?.metal?.IsPrimaryMetal}</td> */}
                                        <th align='right' style={{backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}>{ e?.met_wt === 0 ? '' : ((e?.met_wt)?.toFixed(3))}</th>
                                        <td style={{backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}></td>
                                        <th align='right' style={{borderRight:'1px solid #989898', backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}>{e?.met_amt === 0 ? '' : e?.met_amt}</th>
                                        <td align='right' style={{backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}></td>
                                        <td align='right' style={{backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}></td>
                                        <th align='right' style={{backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}>{e?.values?.totals?.colorstone?.Pcs === 0 ? '' : e?.values?.totals?.colorstone?.Pcs}</th>
                                        <th align='right' style={{backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}>{e?.values?.totals?.colorstone?.Wt === 0 ? '' : e?.values?.totals?.colorstone?.Wt?.toFixed()}</th>
                                        <td align='right' style={{backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}></td>
                                        <th align='right' style={{borderRight:'1px solid #989898', backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}>{ e?.values?.totals?.colorstone?.Amount === 0 ? '' : formatAmount((e?.values?.totals?.colorstone?.Amount))}</th>
                                        <th align='right' style={{borderRight:'1px solid #989898', backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}>{e?.oth_amt === 0 ? '' : formatAmount(e?.oth_amt)}</th>
                                        <td align='right' style={{borderRight:'1px solid #989898', backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}></td>
                                        <th align='right' style={{borderRight:'1px solid #989898', backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}>{ e?.labour_amt === 0 ? '' : formatAmount(e?.labour_amt)}</th>
                                        <th align='right' style={{borderRight:'1px solid #989898', backgroundColor:'#F5F5F5', borderTop:'1px solid #989898', borderBottom:'1px solid #989898',borderLeft:'1px solid #e8e8e8'}}>{ e?.total_amount === 0 ? '' : formatAmount(e?.total_amount)}</th>
                                    </tr>
                                    </>
                                )
                            })
                        }
                          <tr>
                                <th align='center' style={{borderRight:'1px solid #989898', borderBottom:'1px solid #989898', borderTop:'1px solid #989898', borderLeft:'1px solid #989898', backgroundColor:'#F5F5F5'}} colSpan={3}>TOTAL</th>
                                <td style={{backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}}></td>
                                <td style={{backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}}></td>
                                <th style={{backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}} align='right'>{result?.mainTotal?.diamonds?.Pcs === 0 ? '' : result?.mainTotal?.diamonds?.Pcs}</th>
                                <th style={{backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}} align='right'>{ result?.mainTotal?.diamonds?.Wt === 0 ? '' : result?.mainTotal?.diamonds?.Wt?.toFixed(3)}</th>
                                <td style={{backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}}></td>
                                <th style={{borderRight:'1px solid #989898', backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}} align='right'>{ result?.mainTotal?.diamonds?.Amount === 0 ? '' : formatAmount(result?.mainTotal?.diamonds?.Amount)}</th>
                                <td style={{backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}}></td>
                                <th style={{backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}} align='right'>{ result?.mainTotal?.netwt === 0 ? '' : result?.mainTotal?.netwt?.toFixed(3)}</th>
                                <td style={{backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}}></td>
                                <th style={{borderRight:'1px solid #989898', backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}} align='right'>{ result?.mainTotal?.MetalAmount === 0 ? '' : formatAmount(result?.mainTotal?.MetalAmount)}</th>
                                <td style={{backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}}></td>
                                <td style={{backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}}></td>
                                <th style={{backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}} align='right'>{result?.mainTotal?.colorstone?.Pcs === 0 ? '' : result?.mainTotal?.colorstone?.Pcs}</th>
                                <th style={{backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}} align='right'>{result?.mainTotal?.colorstone?.Wt === 0 ? '' : result?.mainTotal?.colorstone?.Wt?.toFixed(3)}</th>
                                <td style={{backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}}></td>
                                <th style={{borderRight:'1px solid #989898', backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}} align='right'>{ result?.mainTotal?.colorstone?.Amount === 0 ? '' :  formatAmount(result?.mainTotal?.colorstone?.Amount)}</th>
                                <th style={{borderRight:'1px solid #989898', backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}} align='right'>{ (result?.mainTotal?.total_other + result?.mainTotal?.total_diamondHandling) === 0 ? '' :  formatAmount((result?.mainTotal?.total_other + result?.mainTotal?.total_diamondHandling))}</th>
                                <td style={{backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898', borderRight:'1px solid #989898'}}></td>
                                <th style={{borderRight:'1px solid #989898', backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}} align='right'>{ (result?.mainTotal?.total_Making_Amount + result?.mainTotal?.diamonds?.SettingAmount + result?.mainTotal?.colorstone?.SettingAmount) === 0 ? '' : formatAmount((result?.mainTotal?.total_Making_Amount + result?.mainTotal?.diamonds?.SettingAmount + result?.mainTotal?.colorstone?.SettingAmount))}</th>
                                <th style={{borderRight:'1px solid #989898', backgroundColor:'#F5F5F5', borderBottom:'1px solid #989898'}} align='right'>{ (result?.mainTotal.total_amount + result?.header?.AddLess + (result?.allTaxesTotal * result?.header?.CurrencyExchRate)) === 0 ? '' :  formatAmount((result?.mainTotal.total_amount + result?.header?.AddLess + (result?.allTaxesTotal * result?.header?.CurrencyExchRate)))}</th>
                            </tr>
                     
                    
                    </tbody>
                </table> 
            </div>
            </> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
          </p>
        }
        </>
    }
    </>
  )
}

export default TaxInvoiceExcel