// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=SlMvMTgyLzI1LTI2&evn=c2FsZQ==&pnm=SW52b2ljZSBFeGNlbCBP&up=aHR0cDovL3plbi9qby9hcGktbGliL0FwcC9TYWxlQmlsbF9Kc29u&ctv=NzE=&ifid=PackingList3&pid=undefined&etp=ZXhjZWw=
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { apiCall, checkMsg, fixedValues, formatAmount, handleImageError, isObjectEmpty, NumberWithCommas } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { cloneDeep } from 'lodash';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';

const InvoiceExcelO = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [result, setResult] = useState(null);
    const [result2, setResult2] = useState(null);
    const [result3, setResult3] = useState(null);
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState([]);
    const [header, setHeader] = useState({});
    const [total, setTotal] = useState({});
    const [isImageWorking, setIsImageWorking] = useState(true);
      const handleImageErrors = () => {
        setIsImageWorking(false);
      };
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
                  let findrec = dia?.findIndex((ele) => ele?.ShapeName === obj?.ShapeName && ele?.QualityName === obj?.QualityName && ele?.Colorname === obj?.Colorname && ele?.SizeName === obj?.SizeName && ele?.Rate === obj?.Rate)
                  if(findrec === -1){
                      dia.push(obj);
                  }else{
                      dia[findrec].Wt += obj?.Wt;
                      dia[findrec].Pcs += obj?.Pcs;
                      dia[findrec].Rate = obj?.Rate;
                      dia[findrec].Amount += obj?.Amount;
                  }
              })
              el.diamonds = dia;
  
              let clr = [];
              el?.colorstone?.forEach((a) => {
                  let obj = cloneDeep(a);
                  let findrec = clr?.findIndex((ele) => ele?.ShapeName === obj?.ShapeName && ele?.QualityName === obj?.QualityName && ele?.Colorname === obj?.Colorname && ele?.isRateOnPcs === obj?.isRateOnPcs && ele?.SizeName === obj?.SizeName && ele?.Rate === obj?.Rate)
                  if(findrec === -1){
                      clr.push(obj);
                  }else{
                      clr[findrec].Wt += obj?.Wt;
                      clr[findrec].Pcs += obj?.Pcs;
                      clr[findrec].Rate = obj?.Rate;
                      clr[findrec].Amount += obj?.Amount;
                  }
              })
              el.colorstone = clr;
  
              let miscAr = [];
              el?.misc?.forEach((a) => {
                  let obj = cloneDeep(a);
                  let findrec = miscAr?.findIndex((ele) => ele?.ShapeName === obj?.ShapeName && ele?.QualityName === obj?.QualityName && ele?.Colorname === obj?.Colorname && ele?.isRateOnPcs === obj?.isRateOnPcs && ele?.SizeName === obj?.SizeName && ele?.Rate === obj?.Rate)
                  if(findrec === -1){
                      miscAr.push(obj);
                  }else{
                      miscAr[findrec].Wt += obj?.Wt;
                      miscAr[findrec].Pcs += obj?.Pcs;
                      miscAr[findrec].Rate = obj?.Rate;
                      miscAr[findrec].Amount += obj?.Amount;
                  }
              })
              el.misc = miscAr;
  
              let misc2arr = el?.misc?.filter((e) => e?.IsHSCOE === 0);
  
              el.misc = misc2arr;
  
              let clr_misc_ar = [...el?.colorstone, ...el?.misc];
  
              el.colorstone = clr_misc_ar;
  
          })
  
          let finalArr = [];
  
          datas?.resultArray?.forEach((e, i) => {
  
              let arr = [];
  
              let len = 7;
  
              if(e?.diamonds?.length > e?.colorstone?.length){
                  if(e?.diamonds?.length > 7){
                      len = e?.diamonds?.length;
                  }
              }
              else if(e?.diamonds?.length < e?.colorstone?.length){
                      if(e?.colorstone?.length > 7){
                      len = e?.colorstone?.length;
                  }
              }
  
              let findMetal = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1)
              let obj = {};
              obj.sr = i+1;
              obj.srflag = true;
              obj.srRowSpan = len;
              obj.SrJobno = `${e?.SrJobno}`;
              obj.designno = e?.designno;
            
              obj.dia_code = e?.diamonds[0] ? (e?.diamonds[0]?.ShapeName + " " + e?.diamonds[0]?.QualityName + " " + e?.diamonds[0]?.Colorname) : '';
              obj.dia_size = e?.diamonds[0] ? e?.diamonds[0]?.SizeName : '';
              obj.dia_pcs = e?.diamonds[0] ? e?.diamonds[0]?.Pcs : '';
              obj.dia_wt = e?.diamonds[0] ? ((e?.diamonds[0]?.Wt)?.toFixed(3)) : '';
              obj.dia_rate = e?.diamonds[0] ? (Math.round(((e?.diamonds[0]?.Amount / datas?.header?.CurrencyExchRate) / (e?.diamonds[0]?.Wt === 0 ? 1 : e?.diamonds[0]?.Wt)))) : '';
              obj.dia_amt = e?.diamonds[0] ? (e?.diamonds[0]?.Amount) : '';
              // obj.dia_rate = e?.diamonds[0] ? (Math.round(((e?.diamonds[0]?.Amount / result?.header?.CurrencyExchRate) / (e?.diamonds[0]?.Wt === 0 ? 1 : e?.diamonds[0]?.Wt)))) : '';
  
              obj.met_quality = '';
              obj.met_wt = 0;
              obj.met_rate = 0;
              obj.met_amt = 0;
              
                  obj.met_wt = e?.NetWt;
                  // obj.met_rate = findMetal ? (Math.round(((findMetal?.Amount / datas?.header?.CurrencyExchRate)) / e?.NetWt)) : '';
                  obj.met_rate = findMetal ? (Math.round((findMetal?.Rate) )) : '';
                  obj.met_amt = findMetal ? ((findMetal?.Amount)) : '';
                  obj.met_quality = findMetal ? (findMetal?.ShapeName + " " + findMetal?.QualityName) : '';
              
              obj.cls_code = e?.colorstone[0] ? (` ${e?.colorstone[0]?.MasterManagement_DiamondStoneTypeid === 3 ? 'M:' : ''} ${e?.colorstone[0]?.ShapeName}` + 
                " " + e?.colorstone[0]?.QualityName + 
                " " + e?.colorstone[0]?.Colorname) : '';
              obj.cls_size = e?.colorstone[0] ? (e?.colorstone[0]?.SizeName) : '';
              obj.cls_pcs = e?.colorstone[0] ? (e?.colorstone[0]?.Pcs) : '';
              obj.cls_wt = e?.colorstone[0] ? ((e?.colorstone[0]?.Wt)?.toFixed(3)) : '';
              // obj.cls_rate = e?.colorstone[0] ? (Math.round(((e?.colorstone[0]?.Amount / result?.header?.CurrencyExchRate)) / ( e?.colorstone[0]?.isRateOnPcs === 1 ? (e?.colorstone[0]?.Pcs === 0 ? 1 : e?.colorstone[0]?.Pcs) :  (e?.colorstone[0]?.Wt === 0 ? 1 : e?.colorstone[0]?.Wt)))) : '';
              obj.cls_rate = e?.colorstone[0] ? (Math.round(((e?.colorstone[0]?.Amount / datas?.header?.CurrencyExchRate)) / ( e?.colorstone[0]?.isRateOnPcs === 1 ? (e?.colorstone[0]?.Pcs === 0 ? 1 : e?.colorstone[0]?.Pcs) :  (e?.colorstone[0]?.Wt === 0 ? 1 : e?.colorstone[0]?.Wt)))) : '';
              obj.cls_amt = e?.colorstone[0] ? ((e?.colorstone[0]?.Amount)) : '';
  
              obj.oth_amt = ( e?.OtherCharges + e?.TotalDiamondHandling + e?.MiscAmount);
              obj.labour_rate = e?.MaKingCharge_Unit;
              obj.labour_amt = (e?.MakingAmount + e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount);
              obj.total_amount = e?.TotalAmount;
           
              Array?.from({length : len})?.map((el, ind) => {
  
                  let obj = {};
            
                  obj.srflag = false
                  obj.img = e?.DesignImage;
                  obj.imgflag = false;
                  if(ind === 0){
                      obj.imgflag = true;
                  }
                  obj.tunch = ((e?.Tunch)?.toFixed(3));
  
                  obj.tunchflag = false;
                  if(ind === 4){
                      obj.tunchflag = true;
                  }
  
                  obj.grosswt = ((e?.grosswt)?.toFixed(3));
  
                  obj.grosswetflag = false;
                  if(ind === 5){
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
  
                  if(e?.diamonds[ind+1]){
                      obj.diaflag = true;
                      obj.dia_code = (e?.diamonds[ind + 1]?.ShapeName + " " + e?.diamonds[ind + 1]?.QualityName + " " + e?.diamonds[ind + 1]?.Colorname);
                      obj.dia_size = e?.diamonds[ind + 1]?.SizeName;
                      obj.dia_pcs = e?.diamonds[ind + 1]?.Pcs;
                      obj.dia_wt = ((e?.diamonds[ind + 1]?.Wt)?.toFixed(3));
                      // obj.dia_rate = (Math.round((e?.diamonds[ind + 1]?.Amount / result?.header?.CurrencyExchRate) / (e?.diamonds[ind + 1]?.Wt === 0 ? 1 : e?.diamonds[ind + 1]?.Wt)));
                      obj.dia_rate = (Math.round((e?.diamonds[ind + 1]?.Amount / datas?.header?.CurrencyExchRate) / (e?.diamonds[ind + 1]?.Wt === 0 ? 1 : e?.diamonds[ind + 1]?.Wt)));
                      obj.dia_amt = ((e?.diamonds[ind + 1]?.Amount));
                  }
  
                  // colorstone
                  obj.cls_code = '';
                  obj.cls_size = '';
                  obj.cls_pcs = 0;
                  obj.cls_wt = 0;
                  obj.cls_rate = 0;
                  obj.cls_amt = 0;
                  obj.clsflag = false;
  
                  if(e?.colorstone[ind+1]){
                      obj.clsflag = true;
                      obj.cls_code = `${e?.colorstone[ind+1]?.MasterManagement_DiamondStoneTypeid === 3 ? 'M:' : ''}  ${e?.colorstone[ind + 1]?.ShapeName}` + 
                      " " + e?.colorstone[ind + 1]?.QualityName + " " + e?.colorstone[ind + 1]?.Colorname;
                      obj.cls_size = e?.colorstone[ind + 1]?.SizeName;
                      obj.cls_pcs = e?.colorstone[ind + 1]?.Pcs;
                      obj.cls_wt = ((e?.colorstone[ind + 1]?.Wt)?.toFixed(3));
                      // obj.cls_rate = (Math.round(((e?.colorstone[ind + 1]?.Amount / result?.header?.CurrencyExchRate)) / (e?.colorstone[ind + 1]?.Wt === 0 ? 1 : e?.colorstone[ind + 1]?.Wt)));
                      obj.cls_rate = (Math.round(((e?.colorstone[ind + 1]?.Amount / datas?.header?.CurrencyExchRate)) / (e?.colorstone[ind + 1]?.Wt === 0 ? 1 : e?.colorstone[ind + 1]?.Wt)));
                      obj.cls_amt = ((e?.colorstone[ind + 1]?.Amount));
                      
                  }
  
                  obj.JobRemark = e?.JobRemark;
                  obj.jobRemarkflag = false;
                  if(ind === 1 && e?.JobRemark !== ''){
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
  
          let catewise = [];
  
          datas?.resultArray?.forEach((e, i) => {
              let obj = cloneDeep(e);
              let findrec = catewise?.findIndex((a) => a?.Categoryname === obj?.Categoryname)
              if(findrec === -1){
                  catewise.push(obj)
              }else{
                  catewise[findrec].Quantity += obj?.Quantity;
              }
          })
  
          catewise.sort((a, b) => a.Categoryname.localeCompare(b.Categoryname));
          
          setResult3(catewise)
          setTimeout(() => {
            const button = document.getElementById('test-table-xls-button');
            button.click();
          }, 500);
      }

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
                    // setMsg(data?.Message);
                    const err = checkMsg(data?.Message);
                    console.log(data?.Message);
                    setMsg(err);
                }
            } catch (error) {
                console.error(error);
            }
        }
        sendData();
    }, []);

    console.log("result", result);
    console.log("result2", result2);
    console.log("result3", result3);
    
    // style...
    const txtTop = {
        verticalAlign: "top",
    };
    const brRight = {
        borderRight: "0.5px solid #000000",
    };
    const brLeft = {
        borderLeft: "1px solid #000000",
    };
    const brTop = {
        borderTop: "1px solid #000000",
    };
    const brBotm = {
        borderBottom: "1px solid #000000",
    };
    const hdSty = {
        backgroundColor: "rgb(6, 80, 150)",
        color: "#FFFFFF"
    };
    return (
        <>
            {loader ? <Loader /> : msg === "" ?
                <> <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                    table="table-to-xls"
                    filename={`Sale_Format_S_${header?.InvoiceNo}_${Date.now()}`}
                    sheet="tablexls"
                    buttonText="Download as XLS" />
                    <table id="table-to-xls" className='d-none'>
                        <tbody>
                            <tr>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>SR NO</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>DIVISION</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>PCS</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>IMAGES</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>BARCODE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>DESIGN CODE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>ITEM DESCRIPTION</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>METAL COLOUR</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>GOLD KARAT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>GROWS WEIGHT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>NET WT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>GOLD RATE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>GOLD VALUE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>D OR C</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>STONE TYPE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL DMD PCS</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL Ct/GMS (DMD)</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>COLOUR</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>CLARITY</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>SHAPE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>MM SIZE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>SIEVE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>Total Dia Rate</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL AMOUNT USD</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>Total Dia + Cs Cost</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>Total DMD ct</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>Total DMD Pcs</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>DIAMOND VALUE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL CLR CT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL CLR PCS</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>COLORSTONE VALUE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>Labour</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>STONE RATE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL 1 DESIGN AMOUNT USD</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>NO OF PCS</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL QUANTITY AMOUNT USD</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}></th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL QUANTITY AMOUNT USD</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL GROSS WT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL NET WT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>GOLD RATE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>GOLD VALUE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL DIA CT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL DIA PCS</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL DIAMOND VALUE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL COLOR CT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL CLR PCS</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL CLR VALUE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL LABOUR</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL SETTING</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm }}>TOTAL VALUE</th>
                            </tr>
                            {result?.resultArray?.length > 0 && result?.resultArray?.map((e, i) => {
                                return <tr key={i}>
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}><div>{e?.SrNo}</div></td>
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}><div>D</div></td>
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{e?.metal?.map((el, id) => (<div key={id}>{el?.Pcs}</div>))}</td>
                                    <td width={155} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>
                                        {e?.image !== "" && 
                                            <>
                                                <div>{`\u00A0`}</div>
                                                <div>
                                                    <img 
                                                        src={e?.DesignImage} 
                                                        alt="" 
                                                        onError={handleImageError} 
                                                        width={150} 
                                                        height={80} 
                                                        style={{ objectFit: "contain" }} 
                                                    />
                                                </div>
                                                <div>{`\u00A0`}</div>
                                            </>
                                        }
                                    </td>
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>  <div>{e?.SrJobno}</div></td>
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}><div>{e?.designno}</div></td>
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}><div>{e?.Categoryname}</div></td> {/** item desc. */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{e?.metal?.map((el, id) => (<div key={id}>{el?.Colorname}</div>))}</td>
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}><div>{e?.MetalPurity}</div></td> {/** gold karat */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}><div>{fixedValues(e?.grosswt,3)}</div></td>
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}><div>{fixedValues(e?.NetWt,3)}</div></td>
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{e?.metal?.map((el, id) => (<div key={id}>{NumberWithCommas(el?.Rate,2)}</div>))}</td> 
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{e?.metal?.map((el, id) => (<div key={id}>{NumberWithCommas(el?.Amount,2)}</div>))}</td> 
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>
                                        <div>{e?.MasterManagement_DiamondStoneTypeName === "DIAMOND" ? "D" : 
                                            e?.MasterManagement_DiamondStoneTypeName === "COLOR STONE" ? "C" : ""}</div>
                                    </td> {/** d or c */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** stone type */} 
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}><div>{e?.diaColorPcs}</div></td>
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** total gms dmd */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** color */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** clarity */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** shape */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** mm size */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}><div>{e?.seiveGroup}</div></td>
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}><div>{e?.diaColorRate}</div></td>
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** total amt usd */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** total dia = cs cost */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** total dmd ct */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** total dmd pcs */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** dia value */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** total clr ct */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** total clr pcs */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** colorstone value */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}><div>{e?.labourValue}</div></td>
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** stone rate */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** setting */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** total 1 amount usd */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** no of pcs */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** total quantity amount usd */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td>
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** total gross */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** net */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** gold rate */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** gold value */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** total dia ct */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** total dia pcs */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** total dia value */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** total color ct */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** total color pcs */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** total color value */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}><div>{e?.totalLabour}</div></td> 
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}>{}</td> {/** total setting */}
                                    <td width={100} style={{ textAlign: "center", ...brRight, ...brBotm, ...txtTop }}><div>{e?.totalAmount}</div></td>
                                </tr>
                            })}
                            {/* <tr>
                                <td width={100} style={{ textAlign: "center" }}></td>
                                <td width={100} style={{ textAlign: "center" }}></td>
                                <td width={200} style={{ textAlign: "center" }}></td>
                                <td width={100} style={{ textAlign: "center" }}></td>
                                <td width={100} style={{ textAlign: "center" }}></td>
                                <td width={160} style={{ textAlign: "center" }}> </td>
                                <td width={150} style={{ textAlign: "center" }}></td>
                                <td width={100} style={{ textAlign: "center" }}></td>
                                <td width={100} style={{ textAlign: "center" }}></td>
                                <td width={100} style={{ textAlign: "center" }}></td>
                                <td width={100} style={{ textAlign: "center" }}></td>
                                <td width={100} style={{ textAlign: "center" }}></td>
                                <td width={100} style={{ textAlign: "center" }}></td>
                                <td width={100} style={{ textAlign: "center" }}></td>
                                <td width={100} style={{ textAlign: "center" }}></td>
                                <td width={100} style={{ textAlign: "center" }}></td>
                                <td width={100} style={{ textAlign: "center" }}></td>
                                <td width={100} style={{ textAlign: "center", fontWeight: total?.totalObjTital ? "bold" : "normal" }}>{total?.diaColorPcs}</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: total?.totalObjTital ? "bold" : "normal" }}>{total?.diaColorCts !== "" && fixedValues(+total?.diaColorCts, 3)}</td>
                                <td width={100} style={{ textAlign: "center" }}>{total?.diaColorRate !== "" && NumberWithCommas(+total?.diaColorRate, 2)}</td>
                                <td width={300} style={{ textAlign: "center", fontWeight: total?.totalObjTital ? "bold" : "normal" }}>{total?.diamondColorStoneQuality}</td>
                                <td width={100} style={{ textAlign: "center", fontWeight: total?.totalObjTital ? "bold" : "normal" }}>{(total?.diaColorMiscAmount !== "" && total?.diaColorMiscAmount !== 0) && NumberWithCommas(total?.diaColorMiscAmount, 2)}</td>
                                <td width={100} style={{ textAlign: "center" }}></td>
                                <td width={100} style={{ textAlign: "center" }}></td>
                                <td width={100} style={{ textAlign: "center" }}></td>
                                <td width={100} style={{ textAlign: "center" }}></td>
                                <td width={100} style={{ textAlign: "center", fontWeight: "bold" }} className='keep_zeroes_2'>{NumberWithCommas(total?.totalAmount, 2)}</td>
                            </tr> */}
                        </tbody>
                    </table></> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
        </>
    )
}

export default InvoiceExcelO;