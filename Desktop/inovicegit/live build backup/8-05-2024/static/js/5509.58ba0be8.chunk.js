"use strict";(self.webpackChunkinvoice=self.webpackChunkinvoice||[]).push([[5509],{11738:(o,t,e)=>{e.r(t),e.d(t,{default:()=>r});var n=e(72791);const d={exportPrintContainer:"export_exportPrintContainer__LW8Ty",withImageExport:"export_withImageExport__mAwhe",btn_white:"export_btn_white__7SxL5",rowExport:"export_rowExport__NbU1I",srNoExport:"export_srNoExport__VOFSr",itemExport:"export_itemExport__uaZuV",ktColExport:"export_ktColExport__Ih0ug",qtyExport:"export_qtyExport__6p+KN",grossExport:"export_grossExport__yf0Sx",netExport:"export_netExport__x1bh5",wastageExport:"export_wastageExport__E7n5V",totalGoldExport:"export_totalGoldExport__M-Wbi",goldGmExport:"export_goldGmExport__-GUAG",goldValueExport:"export_goldValueExport__XtCWz",padx_2:"export_padx_2__+XHuJ",diamondSec:"export_diamondSec__klxCe",diamondColorExport:"export_diamondColorExport__Lc2Gb",diaShapeExport:"export_diaShapeExport__4MuA9",diaPcsExport:"export_diaPcsExport__y+XWF",diaCtsExport:"export_diaCtsExport__YuQeJ",diaRateExport:"export_diaRateExport__HfopA",diaValueExport:"export_diaValueExport__KwqRQ",c2CsSec:"export_c2CsSec__g1+El",c2csPcsExport:"export_c2csPcsExport__2Rsg7",c2csCtsExport:"export_c2csCtsExport__xCZtX",c2csRateExport:"export_c2csRateExport__DtOyP",c2csValueExport:"export_c2csValueExport__ac-rq",totalCtsExport:"export_totalCtsExport__uz1ri",totalValExport:"export_totalValExport__GjIvf",enamelWtExport:"export_enamelWtExport__opPqA",labourValueExport:"export_labourValueExport__BlIDf",totalFobExport:"export_totalFobExport__kL9hM",print_sec_sum4:"export_print_sec_sum4__u4pJW"};var l=e(1683),i=e(80444),c=e(763),a=e(80184);const r=o=>{let{urls:t,token:e,invoiceNo:r,printName:s,evn:x,ApiVer:v}=o;const[u,p]=(0,n.useState)(!0),[m,E]=(0,n.useState)({}),[f,j]=(0,n.useState)([]),[_,h]=(0,n.useState)(""),[g,b]=(0,n.useState)(!0),[N,w]=(0,n.useState)({qtyPcsPair:0,grossWt:0,netWt:0,golSilValue:0,diaPcs:0,diaCts:0,diaValue:0,czCsPcs:0,czCsCts:0,czCsValue:0,totalCts:0,totalVal:0,labourVal:0,fobValue:0,counts:0});return(0,n.useEffect)((()=>{(async()=>{try{const o=await(0,l.k_)(e,r,s,t,x,v);if("200"===(null===o||void 0===o?void 0:o.Status)){(0,l.nK)(null===o||void 0===o?void 0:o.Data)?(p(!1),h("Data Not Found")):((o=>{console.log(o),E(null===o||void 0===o?void 0:o.BillPrint_Json[0]);let t=[];null===o||void 0===o||o.BillPrint_Json1.forEach(((e,n)=>{let d=(0,c.cloneDeep)(e),l=[],i=[],a=[],r=0,s=0,x=0,v=0;null===o||void 0===o||o.BillPrint_Json2.forEach(((o,t)=>{if((null===e||void 0===e?void 0:e.SrJobno)===(null===o||void 0===o?void 0:o.StockBarcode))if(1===(null===o||void 0===o?void 0:o.MasterManagement_DiamondStoneTypeid)){let t=null===i||void 0===i?void 0:i.findIndex(((t,e)=>(null===t||void 0===t?void 0:t.ShapeName)===(null===o||void 0===o?void 0:o.ShapeName)&&(null===t||void 0===t?void 0:t.QualityName)===(null===o||void 0===o?void 0:o.QualityName)&&(null===t||void 0===t?void 0:t.Colorname)===(null===o||void 0===o?void 0:o.Colorname)));-1===t?i.push(o):(i[t].Pcs+=null===o||void 0===o?void 0:o.Pcs,i[t].Wt+=null===o||void 0===o?void 0:o.Wt,i[t].Amount+=null===o||void 0===o?void 0:o.Amount)}else 2===(null===o||void 0===o?void 0:o.MasterManagement_DiamondStoneTypeid)?0===(null===a||void 0===a?void 0:a.length)?a.push(o):(a[0].Wt+=null===o||void 0===o?void 0:o.Wt,a[0].Pcs+=null===o||void 0===o?void 0:o.Pcs,a[0].Amount+=null===o||void 0===o?void 0:o.Amount,a[0].Rate=(a[0].Rate+(null===o||void 0===o?void 0:o.Rate))/2):4===(null===o||void 0===o?void 0:o.MasterManagement_DiamondStoneTypeid)?(l.push(o),1===(null===o||void 0===o?void 0:o.IsPrimaryMetal)&&(r+=null===o||void 0===o?void 0:o.Wt,x+=null===o||void 0===o?void 0:o.Amount,s+=null===o||void 0===o?void 0:o.Wt)):5===(null===o||void 0===o?void 0:o.MasterManagement_DiamondStoneTypeid)&&(v+=null===o||void 0===o?void 0:o.SettingAmount)})),d.metal=l,d.diamonds=i,d.colorstones=a,d.counts=1,d.primaryWt=r,d.goldWt=s,d.primaryAmount=x,d.findingSetAmount=v,t.push(d)}));let e=[];t.forEach(((o,t)=>{let n=e.findIndex(((t,e)=>(null===t||void 0===t?void 0:t.Categoryname)===(null===o||void 0===o?void 0:o.Categoryname)&&(null===t||void 0===t?void 0:t.MetalPurity)===(null===o||void 0===o?void 0:o.MetalPurity)));if(-1===n)e.push(o);else{var d,l,i;e[n].grosswt+=null===o||void 0===o?void 0:o.grosswt,e[n].NetWt+=null===o||void 0===o?void 0:o.NetWt,e[n].MetalAmount+=null===o||void 0===o?void 0:o.MetalAmount,e[n].MakingAmount+=null===o||void 0===o?void 0:o.MakingAmount,e[n].MiscAmount+=null===o||void 0===o?void 0:o.MiscAmount,e[n].TotalDiamondHandling+=null===o||void 0===o?void 0:o.TotalDiamondHandling,e[n].TotalAmount+=null===o||void 0===o?void 0:o.TotalAmount,e[n].metal=(null===(d=e[n])||void 0===d?void 0:d.metal).concat(null===o||void 0===o?void 0:o.metal),e[n].goldWt+=null===o||void 0===o?void 0:o.goldWt,e[n].MetalWeight+=null===o||void 0===o?void 0:o.MetalWeight,e[n].colorstones=(null===(l=e[n])||void 0===l?void 0:l.colorstones).concat(null===o||void 0===o?void 0:o.colorstones),e[n].counts+=1,e[n].primaryWt+=null===o||void 0===o?void 0:o.primaryWt,e[n].primaryAmount+=null===o||void 0===o?void 0:o.primaryAmount,e[n].TotalCsSetcost+=null===o||void 0===o?void 0:o.TotalCsSetcost,e[n].TotalDiaSetcost+=null===o||void 0===o?void 0:o.TotalDiaSetcost,e[n].findingSetAmount+=null===o||void 0===o?void 0:o.findingSetAmount;let t=null===(i=[...e[n].diamonds,...null===o||void 0===o?void 0:o.diamonds])||void 0===i?void 0:i.flat(),c=[];null===t||void 0===t||t.forEach(((o,t)=>{let e=null===c||void 0===c?void 0:c.findIndex(((t,e)=>(null===t||void 0===t?void 0:t.ShapeName)===(null===o||void 0===o?void 0:o.ShapeName)&&(null===t||void 0===t?void 0:t.QualityName)===(null===o||void 0===o?void 0:o.QualityName)&&(null===t||void 0===t?void 0:t.Colorname)===(null===o||void 0===o?void 0:o.Colorname)));-1===e?null===c||void 0===c||c.push(o):(c[e].Pcs+=null===o||void 0===o?void 0:o.Pcs,c[e].Wt+=null===o||void 0===o?void 0:o.Wt,c[e].Amount+=null===o||void 0===o?void 0:o.Amount)})),e[n].diamonds=c}}));let n={...N},d=[];e.forEach(((o,t)=>{let e={...o};e.totalCts=0,e.totalVal=0,e.metalWt=0,e.metalAmount=0,n.grossWt+=null===o||void 0===o?void 0:o.grosswt,n.netWt+=null===o||void 0===o?void 0:o.NetWt,n.labourVal+=(null===o||void 0===o?void 0:o.MakingAmount)+(null===o||void 0===o?void 0:o.TotalCsSetcost)+(null===o||void 0===o?void 0:o.TotalDiaSetcost),n.fobValue+=null===o||void 0===o?void 0:o.TotalAmount,n.counts+=null===o||void 0===o?void 0:o.counts,n.golSilValue+=null===o||void 0===o?void 0:o.primaryAmount,(null===o||void 0===o?void 0:o.diamonds.length)>0&&(null===o||void 0===o||o.diamonds.forEach(((o,t)=>{e.totalCts+=o.Wt,e.totalVal+=null===o||void 0===o?void 0:o.Amount,n.diaPcs+=null===o||void 0===o?void 0:o.Pcs,n.diaCts+=+(0,l.OP)(null===o||void 0===o?void 0:o.Wt,2),n.diaValue+=null===o||void 0===o?void 0:o.Amount,n.totalCts+=o.Wt,n.totalVal+=o.Amount}))),(null===o||void 0===o?void 0:o.colorstones.length)>0&&(null===o||void 0===o||o.colorstones.forEach(((o,t)=>{e.totalCts+=o.Wt,e.totalVal+=null===o||void 0===o?void 0:o.Amount,n.czCsPcs+=o.Pcs,n.czCsCts+=o.Wt,n.czCsValue+=o.Amount,n.totalCts+=o.Wt,n.totalVal+=o.Amount}))),(null===o||void 0===o?void 0:o.metal.length)>0&&(null===o||void 0===o||o.metal.forEach(((o,t)=>{e.metalWt+=o.Wt,e.metalAmount+=null===o||void 0===o?void 0:o.Amount}))),d.push(e)})),d.sort(((o,t)=>{const e=o.Categoryname.toLowerCase(),n=t.Categoryname.toLowerCase();return e<n?-1:e>n?1:0})),w(n),j(d),console.log(d)})(null===o||void 0===o?void 0:o.Data),p(!1))}else p(!1),h(null===o||void 0===o?void 0:o.Message)}catch(o){console.error(o)}})()}),[]),u?(0,a.jsx)(i.Z,{}):""===_?(0,a.jsx)(a.Fragment,{children:(0,a.jsxs)("div",{className:"pad_60_allPrint mt-2",children:[(0,a.jsx)("div",{className:"d-flex justify-content-end mb-4 align-items-center ".concat(null===d||void 0===d?void 0:d.print_sec_sum4," pt-4 ").concat(null===d||void 0===d?void 0:d.exportPrintContainer," max_width_container px-1"),children:(0,a.jsx)("div",{className:"form-check ps-3",children:(0,a.jsx)("input",{type:"button",className:"btn_white blue mt-2 ".concat(null===d||void 0===d?void 0:d.btn_white),value:"Print",onClick:o=>(0,l.Yj)(o),style:{padding:"3px 4px"}})})}),(0,a.jsx)("div",{className:"".concat(null===d||void 0===d?void 0:d.exportPrintContainer," max_width_container px-1"),children:(0,a.jsxs)("div",{className:"",children:[(0,a.jsx)("div",{className:"d-flex border",children:(0,a.jsxs)("div",{className:"d-flex col-7",children:[(0,a.jsxs)("div",{className:"col-2 ps-1 py-1 fw-semibold",children:[(0,a.jsx)("p",{children:"CompanyName :  "}),(0,a.jsx)("p",{children:"Inv .# : "}),(0,a.jsx)("p",{children:"Dated : "}),(0,a.jsx)("p",{children:"Party :"})]}),(0,a.jsxs)("div",{className:"col-10 py-1",children:[(0,a.jsxs)("p",{children:[" ",null===m||void 0===m?void 0:m.customerfirmname," "]}),(0,a.jsxs)("p",{children:[" ",null===m||void 0===m?void 0:m.InvoiceNo," "]}),(0,a.jsxs)("p",{children:[" ",null===m||void 0===m?void 0:m.EntryDate," "]}),(0,a.jsxs)("p",{children:[" ",null===m||void 0===m?void 0:m.CustName]})]})]})}),(0,a.jsxs)("div",{className:"d-flex border-start border-end border-bottom fw-semibold",children:[(0,a.jsx)("div",{className:"d-flex justify-content-center align-items-center border-end text-center ".concat(d.srNoExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:"Sr No"}),(0,a.jsx)("div",{className:"d-flex align-items-center border-end  ".concat(d.itemExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:"Item"}),(0,a.jsx)("div",{className:"d-flex  align-items-center border-end  ".concat(d.ktColExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:"KT/Col"}),(0,a.jsx)("div",{className:"d-flex justify-content-end align-items-center border-end text-end ".concat(d.qtyExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:"Qty (PCS & PAIR)"}),(0,a.jsx)("div",{className:"d-flex justify-content-end align-items-center border-end text-end ".concat(d.grossExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:"Gross Wt"}),(0,a.jsx)("div",{className:"d-flex justify-content-end align-items-center border-end text-end ".concat(d.netExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:"Net Wt"}),(0,a.jsx)("div",{className:"d-flex justify-content-end align-items-center border-end text-end ".concat(d.wastageExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:"wastage"}),(0,a.jsx)("div",{className:"d-flex justify-content-end align-items-center border-end text-end ".concat(d.totalGoldExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:"Total Gold Wt."}),(0,a.jsx)("div",{className:"d-flex justify-content-end align-items-center border-end text-end ".concat(d.goldGmExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:"Gold & sil Rate/gms $"}),(0,a.jsxs)("div",{className:"d-flex justify-content-center align-items-end flex-column border-end text-end ".concat(d.goldValueExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:[(0,a.jsx)("p",{children:"Gold & sil "}),(0,a.jsx)("p",{children:"Value $"})]}),(0,a.jsx)("div",{className:"".concat(null===d||void 0===d?void 0:d.diamondSec),children:(0,a.jsx)("div",{className:"d-grid h-100",children:(0,a.jsxs)("div",{className:"d-flex",children:[(0,a.jsx)("div",{className:"d-flex align-items-center border-end  ".concat(null===d||void 0===d?void 0:d.padx_2," ").concat(d.diaShapeExport," ").concat(d.rowExport),children:"Dia shape"}),(0,a.jsx)("div",{className:"d-flex align-items-center border-end ".concat(null===d||void 0===d?void 0:d.padx_2," ").concat(d.diamondColorExport," ").concat(d.rowExport),children:"e Diamond Color/Clarity"}),(0,a.jsx)("div",{className:"d-flex justify-content-end align-items-center border-end text-end ".concat(null===d||void 0===d?void 0:d.padx_2," ").concat(d.diaPcsExport," ").concat(d.rowExport),children:"Dia Pcs"}),(0,a.jsx)("div",{className:"d-flex justify-content-end align-items-center border-end text-end ".concat(null===d||void 0===d?void 0:d.padx_2," ").concat(d.diaCtsExport," ").concat(d.rowExport),children:"Dia Cts "}),(0,a.jsx)("div",{className:"d-flex justify-content-end align-items-center border-end text-end ".concat(null===d||void 0===d?void 0:d.padx_2," ").concat(d.diaRateExport," ").concat(d.rowExport),children:"Dia Rate"}),(0,a.jsx)("div",{className:"d-flex justify-content-end align-items-center border-end text-end ".concat(null===d||void 0===d?void 0:d.padx_2," ").concat(d.diaValueExport," ").concat(d.rowExport),children:"Dia Value"})]})})}),(0,a.jsx)("div",{className:"".concat(null===d||void 0===d?void 0:d.c2CsSec),children:(0,a.jsx)("div",{className:"d-grid h-100",children:(0,a.jsxs)("div",{className:"d-flex",children:[(0,a.jsx)("div",{className:"d-flex justify-content-end align-items-center border-end text-end ".concat(null===d||void 0===d?void 0:d.padx_2," ").concat(d.c2csPcsExport),children:"cz/cs Pcs"}),(0,a.jsx)("div",{className:"d-flex justify-content-end align-items-center border-end text-end ".concat(null===d||void 0===d?void 0:d.padx_2," ").concat(d.c2csCtsExport),children:"cz/cs Cts"}),(0,a.jsx)("div",{className:"d-flex justify-content-end align-items-center border-end text-end ".concat(null===d||void 0===d?void 0:d.padx_2," ").concat(d.c2csRateExport),children:"cz/cs Rate"}),(0,a.jsx)("div",{className:"d-flex justify-content-end align-items-center border-end text-end ".concat(null===d||void 0===d?void 0:d.padx_2," ").concat(d.c2csValueExport),children:"cz/cs Value"})]})})}),(0,a.jsx)("div",{className:"d-flex justify-content-end align-items-center border-end text-end ".concat(null===d||void 0===d?void 0:d.padx_2," ").concat(d.totalCtsExport," ").concat(d.rowExport),children:"Total Cts"}),(0,a.jsx)("div",{className:"d-flex justify-content-end align-items-center border-end text-end ".concat(null===d||void 0===d?void 0:d.padx_2," ").concat(d.totalValExport," ").concat(d.rowExport),children:"Total Val $"}),(0,a.jsx)("div",{className:"d-flex justify-content-end align-items-center border-end text-end ".concat(null===d||void 0===d?void 0:d.padx_2," ").concat(d.enamelWtExport," ").concat(d.rowExport),children:"enamel wt. gms"}),(0,a.jsx)("div",{className:"d-flex justify-content-end align-items-center border-end text-end ".concat(null===d||void 0===d?void 0:d.padx_2," ").concat(d.labourValueExport," ").concat(d.rowExport),children:"VA/Labor Value"}),(0,a.jsxs)("div",{className:"d-flex justify-content-center align-items-end text-end flex-column ".concat(null===d||void 0===d?void 0:d.padx_2," ").concat(d.totalFobExport," ").concat(d.rowExport),children:[(0,a.jsx)("p",{children:"Total FOB "}),(0,a.jsx)("p",{children:"Value $"})]})]}),f&&f.map(((o,t)=>(0,a.jsxs)("div",{className:"d-flex border-start border-end border-bottom",children:[(0,a.jsx)("div",{className:"border-end ".concat(d.srNoExport," d-flex align-items-center justify-content-center ").concat(d.rowExport," text-center ").concat(null===d||void 0===d?void 0:d.padx_2),children:t+1}),(0,a.jsx)("div",{className:"border-end ".concat(d.itemExport," d-flex align-items-center ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:null===o||void 0===o?void 0:o.Categoryname}),(0,a.jsx)("div",{className:"border-end ".concat(d.ktColExport," d-flex align-items-center ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:null===o||void 0===o?void 0:o.MetalPurity}),(0,a.jsx)("div",{className:"border-end ".concat(d.qtyExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===o||void 0===o?void 0:o.counts,0)}),(0,a.jsx)("div",{className:"border-end ".concat(d.grossExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.OP)(null===o||void 0===o?void 0:o.grosswt,3)}),(0,a.jsx)("div",{className:"border-end ".concat(d.netExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.OP)(null===o||void 0===o?void 0:o.NetWt,3)}),(0,a.jsx)("div",{className:"border-end ".concat(d.wastageExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2)}),(0,a.jsx)("div",{className:"border-end ".concat(d.totalGoldExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.OP)(null===o||void 0===o?void 0:o.MetalWeight,3)}),(0,a.jsx)("div",{className:"border-end ".concat(d.goldGmExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:0!==(null===o||void 0===o?void 0:o.NetWt)&&(0,l.dl)((null===o||void 0===o?void 0:o.primaryAmount)/(null===o||void 0===o?void 0:o.primaryWt),2)}),(0,a.jsx)("div",{className:"border-end ".concat(d.goldValueExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===o||void 0===o?void 0:o.primaryAmount,2)}),(0,a.jsx)("div",{className:"".concat(null===d||void 0===d?void 0:d.diamondSec),children:(0,a.jsx)("div",{className:"d-grid h-100",children:(null===o||void 0===o?void 0:o.diamonds.length)>0?null===o||void 0===o?void 0:o.diamonds.map(((t,e)=>(0,a.jsxs)("div",{className:"d-flex ".concat(e!==(null===o||void 0===o?void 0:o.diamonds.length)-1&&"border-bottom"),children:[(0,a.jsx)("div",{className:"border-end ".concat(d.diaShapeExport," d-flex align-items-center ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:null===t||void 0===t?void 0:t.ShapeName}),(0,a.jsxs)("div",{className:"border-end ".concat(d.diamondColorExport," d-flex align-items-center ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:[null===t||void 0===t?void 0:t.Colorname,"/",null===t||void 0===t?void 0:t.QualityName]}),(0,a.jsx)("div",{className:"border-end ".concat(d.diaPcsExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===t||void 0===t?void 0:t.Pcs,0)}),(0,a.jsx)("div",{className:"border-end ".concat(d.diaCtsExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(Math.round(100*((null===t||void 0===t?void 0:t.Wt)+Number.EPSILON))/100,2)}),(0,a.jsx)("div",{className:"border-end ".concat(d.diaRateExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:0!==(null===t||void 0===t?void 0:t.Wt)&&(0,l.dl)(Math.round(100*(null===t||void 0===t?void 0:t.Amount))/100/(Math.round(100*((null===t||void 0===t?void 0:t.Wt)+Number.EPSILON))/100),2)}),(0,a.jsx)("div",{className:"border-end ".concat(d.diaValueExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:0!==(null===t||void 0===t?void 0:t.Amount)&&(0,l.dl)(Math.round(100*(null===t||void 0===t?void 0:t.Amount))/100,2)})]},e))):(0,a.jsxs)("div",{className:"d-flex",children:[(0,a.jsx)("div",{className:"border-end ".concat(d.diaShapeExport," d-flex align-items-center ").concat(d.rowExport)}),(0,a.jsx)("div",{className:"border-end ".concat(d.diamondColorExport," d-flex align-items-center ").concat(d.rowExport)}),(0,a.jsx)("div",{className:"border-end ".concat(d.diaPcsExport," d-flex align-items-center justify-content-end ").concat(d.rowExport)}),(0,a.jsx)("div",{className:"border-end ".concat(d.diaCtsExport," d-flex align-items-center justify-content-end ").concat(d.rowExport)}),(0,a.jsx)("div",{className:"border-end ".concat(d.diaRateExport," d-flex align-items-center justify-content-end ").concat(d.rowExport)}),(0,a.jsx)("div",{className:"border-end ".concat(d.diaValueExport," d-flex align-items-center justify-content-end ").concat(d.rowExport)})]})})}),(0,a.jsx)("div",{className:"".concat(null===d||void 0===d?void 0:d.c2CsSec),children:(0,a.jsx)("div",{className:"d-grid h-100",children:(null===o||void 0===o?void 0:o.colorstones.length)>0?null===o||void 0===o?void 0:o.colorstones.map(((t,e)=>(0,a.jsxs)("div",{className:"d-flex ".concat(e!==(null===o||void 0===o?void 0:o.colorstones.length)-1&&"border-bottom"),children:[(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.c2csPcsExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===t||void 0===t?void 0:t.Pcs,0)}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.c2csCtsExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(Math.round(100*((null===t||void 0===t?void 0:t.Wt)+Number.EPSILON))/100,3)}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.c2csRateExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(Math.round(100*(null===t||void 0===t?void 0:t.Amount))/100/(Math.round(100*((null===t||void 0===t?void 0:t.Wt)+Number.EPSILON))/100),2)}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.c2csValueExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(Math.round(100*(null===t||void 0===t?void 0:t.Amount))/100,2)})]},e))):(0,a.jsxs)("div",{className:"d-flex",children:[(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.c2csPcsExport," ").concat(d.rowExport)}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.c2csCtsExport," ").concat(d.rowExport)}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.c2csRateExport," ").concat(d.rowExport)}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.c2csValueExport," ").concat(d.rowExport)})]})})}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.totalCtsExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===o||void 0===o?void 0:o.totalCts,3)}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.totalValExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===o||void 0===o?void 0:o.totalVal,2)}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.enamelWtExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2)}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.labourValueExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:(null===o||void 0===o?void 0:o.MakingAmount)+(null===o||void 0===o?void 0:o.TotalCsSetcost)+(null===o||void 0===o?void 0:o.TotalDiaSetcost)!==0&&(0,l.dl)((null===o||void 0===o?void 0:o.MakingAmount)+(null===o||void 0===o?void 0:o.TotalCsSetcost)+(null===o||void 0===o?void 0:o.TotalDiaSetcost),2)}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end ".concat(d.totalFobExport," ").concat(d.rowExport," ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===o||void 0===o?void 0:o.TotalAmount,2)})]},t))),(0,a.jsxs)("div",{className:"d-flex border-start border-end border-bottom",children:[(0,a.jsx)("div",{className:"border-end ".concat(d.srNoExport," d-flex align-items-center justify-content-end ").concat(d.rowExport)}),(0,a.jsx)("div",{className:"border-end ".concat(d.itemExport," d-flex align-items-center ").concat(d.rowExport)}),(0,a.jsx)("div",{className:"border-end ".concat(d.ktColExport," d-flex align-items-center ").concat(d.rowExport)}),(0,a.jsx)("div",{className:"border-end ".concat(d.qtyExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," fw-bold ").concat(null===d||void 0===d?void 0:d.padx_2),children:null===N||void 0===N?void 0:N.counts}),(0,a.jsx)("div",{className:"border-end ".concat(d.grossExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," fw-bold ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===N||void 0===N?void 0:N.grossWt,3)}),(0,a.jsx)("div",{className:"border-end ".concat(d.netExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," fw-bold ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===N||void 0===N?void 0:N.netWt,3)}),(0,a.jsx)("div",{className:"border-end ".concat(d.wastageExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," fw-bold")}),(0,a.jsx)("div",{className:"border-end ".concat(d.totalGoldExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," fw-bold")}),(0,a.jsx)("div",{className:"border-end ".concat(d.goldGmExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," fw-bold")}),(0,a.jsx)("div",{className:"border-end ".concat(d.goldValueExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," fw-bold ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===N||void 0===N?void 0:N.golSilValue,2)}),(0,a.jsxs)("div",{className:"d-flex  ".concat(null===d||void 0===d?void 0:d.diamondSec),children:[(0,a.jsx)("div",{className:"border-end ".concat(d.diaShapeExport," d-flex align-items-center ").concat(d.rowExport," fw-bold")}),(0,a.jsx)("div",{className:"border-end ".concat(d.diamondColorExport," d-flex align-items-center ").concat(d.rowExport," fw-bold")}),(0,a.jsx)("div",{className:"border-end ".concat(d.diaPcsExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," fw-bold ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===N||void 0===N?void 0:N.diaPcs,0)}),(0,a.jsx)("div",{className:"border-end ".concat(d.diaCtsExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," fw-bold ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===N||void 0===N?void 0:N.diaCts,3)}),(0,a.jsx)("div",{className:"border-end ".concat(d.diaRateExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," fw-bold ").concat(null===d||void 0===d?void 0:d.padx_2)}),(0,a.jsx)("div",{className:"border-end ".concat(d.diaValueExport," d-flex align-items-center justify-content-end ").concat(d.rowExport," fw-bold ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===N||void 0===N?void 0:N.diaValue,2)})]}),(0,a.jsxs)("div",{className:"d-flex ".concat(null===d||void 0===d?void 0:d.c2CsSec),children:[(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.c2csPcsExport," ").concat(d.rowExport," fw-bold ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===N||void 0===N?void 0:N.czCsPcs,0)}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.c2csCtsExport," ").concat(d.rowExport," fw-bold ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===N||void 0===N?void 0:N.czCsCts,3)}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.c2csRateExport," ").concat(d.rowExport," fw-bold")}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.c2csValueExport," ").concat(d.rowExport," fw-bold ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===N||void 0===N?void 0:N.czCsValue,2)})]}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.totalCtsExport," ").concat(d.rowExport," fw-bold ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===N||void 0===N?void 0:N.totalCts,3)}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.totalValExport," ").concat(d.rowExport," fw-bold ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===N||void 0===N?void 0:N.totalVal,2)}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.enamelWtExport," ").concat(d.rowExport," fw-bold")}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end border-end ".concat(d.labourValueExport," ").concat(d.rowExport," fw-bold ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===N||void 0===N?void 0:N.labourVal,2)}),(0,a.jsx)("div",{className:"d-flex align-items-center justify-content-end ".concat(d.totalFobExport," ").concat(d.rowExport," fw-bold ").concat(null===d||void 0===d?void 0:d.padx_2),children:(0,l.dl)(null===N||void 0===N?void 0:N.fobValue,2)})]})]})})]})}):(0,a.jsx)("p",{className:"text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto",children:_})}}}]);
//# sourceMappingURL=5509.58ba0be8.chunk.js.map