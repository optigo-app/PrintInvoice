/*! For license information please see 2727.6761f056.chunk.js.LICENSE.txt */
(self.webpackChunkinvoice=self.webpackChunkinvoice||[]).push([[2727],{75455:(e,n,i)=>{"use strict";i.d(n,{T:()=>t,Z:()=>d});var l=i(99318);const t=e=>{var n;const i=new l.ToWords,t=null===(n=parseFloat(e))||void 0===n?void 0:n.toFixed(2),d=null===t||void 0===t?void 0:t.toString(),o=null===d||void 0===d?void 0:d.split(".")[1],s=null===o||void 0===o?void 0:o.padEnd(2,"0"),r={"00":"Zero","01":"One","02":"Two","03":"Three","04":"Four","05":"Five","06":"Six","07":"Seven","08":"Eight","09":"Nine",10:"Ten",11:"Eleven",12:"Twelve",13:"Thirteen",14:"Fourteen",15:"Fifteen",16:"Sixteen",17:"Seventeen",18:"Eighteen",19:"Nineteen",20:"Twenty",30:"Thirty",40:"Forty",50:"Fifty",60:"Sixty",70:"Seventy",80:"Eighty",90:"Ninety"},a=void 0===r[s]?null===i||void 0===i?void 0:i.convert(s):r[s];return"".concat(i.convert(Math.floor(t))," Point ").concat(a," Only /-")},d=t},17980:(e,n,i)=>{"use strict";i.r(n),i.d(n,{default:()=>v});var l=i(72791),t=i(1683),d=(i(60006),i(80444)),o=i(99318),s=i(763),r=i(89995),a=i(75455),c=i(80184);const v=e=>{var n,i,v,u,m;let{urls:x,token:h,invoiceNo:p,printName:f,evn:j,ApiVer:N}=e;const[b,y]=(0,l.useState)({}),[_,P]=(0,l.useState)([]),[g,R]=(0,l.useState)({}),[w,W]=(0,l.useState)(!0),[A,C]=(0,l.useState)(!0),[E,S]=(0,l.useState)(""),[T,M]=(0,l.useState)([]),[k,L]=(0,l.useState)({}),[O,D]=(0,l.useState)({totalWt:0});let I=atob(f).toLowerCase();const F=(e,n,i)=>"retail1 print"===I?i?e:"".concat(e,"NoRate"):i?n:"".concat(n,"NoRate"),[B,Q]=(0,l.useState)({Material:F("materialRetailPrint1","materialRetailPrint",!0),Qty:F("qtyRetailPrint1","qtyRetailPrint",!0),Pcs:F("pcsRetailPrint1","pcsRetailPrint",!0),Wt:F("wtRetailPrint1","wtRetailPrint",!0),Amount:F("","amountRetailPrint",!0),total:F("totalRetail1Print","totalRetailPrint",!0)}),H=new o.ToWords,[J,z]=(0,l.useState)(!0);return(0,l.useEffect)((()=>{(async()=>{try{const e=await(0,t.k_)(h,p,f,x,j,N);if("200"===(null===e||void 0===e?void 0:e.Status)){(0,t.nK)(null===e||void 0===e?void 0:e.Data)?(C(!1),S("Data Not Found")):((e=>{var n,i;let l=(0,r.g)(null===e||void 0===e?void 0:e.BillPrint_Json[0],null===e||void 0===e?void 0:e.BillPrint_Json1,null===e||void 0===e?void 0:e.BillPrint_Json2),d=[],o={pcs:0,materialWeight:0,rate:0,amount:0,making:0,others:0,totalAmount:0,sgstAmount:0,cgstAmount:0,addLess:0,grandTotal:0,textInNumbers:"",goldWeight:0},a=0;null===l||void 0===l||null===(n=l.resultArray)||void 0===n||n.forEach(((e,n)=>{var i,l,t,r,c;let v=(0,s.cloneDeep)(e),u=0,m=0,x=0;null===e||void 0===e||null===(i=e.metal)||void 0===i||i.forEach(((e,n)=>{1===(null===e||void 0===e?void 0:e.IsPrimaryMetal)?u+=null===e||void 0===e?void 0:e.Wt:(m+=null===e||void 0===e?void 0:e.Wt,x+=null===e||void 0===e?void 0:e.Wt,a+=null===e||void 0===e?void 0:e.Wt)}));let h=[];null===e||void 0===e||null===(l=e.diamonds)||void 0===l||l.forEach(((e,n)=>{a+=null===e||void 0===e?void 0:e.Wt,o.pcs+=null===e||void 0===e?void 0:e.Pcs,0===(null===h||void 0===h?void 0:h.length)?null===h||void 0===h||h.push(e):(h[0].Wt+=null===e||void 0===e?void 0:e.Wt,h[0].Pcs+=null===e||void 0===e?void 0:e.Pcs,h[0].Amount+=null===e||void 0===e?void 0:e.Amount)}));let p=[],f={Pcs:0,Amount:0},j={Wt:0,Amount:0};null===e||void 0===e||null===(t=e.colorstone)||void 0===t||t.forEach(((e,n)=>{a+=null===e||void 0===e?void 0:e.Wt,o.pcs+=null===e||void 0===e?void 0:e.Pcs,0===(null===e||void 0===e?void 0:e.isRateOnPcs)?(j.Wt+=null===e||void 0===e?void 0:e.Wt,j.Amount+=null===e||void 0===e?void 0:e.Amount):(f.Pcs+=null===e||void 0===e?void 0:e.Pcs,f.Amount+=null===e||void 0===e?void 0:e.Amount);let i=null===p||void 0===p?void 0:p.findIndex(((n,i)=>(null===n||void 0===n?void 0:n.isRateOnPcs)===(null===e||void 0===e?void 0:e.isRateOnPcs)));-1===i?null===p||void 0===p||p.push(e):(p[i].Wt+=null===e||void 0===e?void 0:e.Wt,p[i].Pcs+=null===e||void 0===e?void 0:e.Pcs,p[i].Amount+=null===e||void 0===e?void 0:e.Amount)}));let N=[];null===e||void 0===e||null===(r=e.misc)||void 0===r||r.forEach(((e,n)=>{a+=(null===e||void 0===e?void 0:e.ServWt)+(null===e||void 0===e?void 0:e.Wt),(null===e||void 0===e?void 0:e.Wt)+(null===e||void 0===e?void 0:e.ServWt)!==0&&(o.pcs+=null===e||void 0===e?void 0:e.Pcs);let i=null===N||void 0===N?void 0:N.findIndex(((n,i)=>(null===n||void 0===n?void 0:n.ShapeName)===(null===e||void 0===e?void 0:e.ShapeName)&&(null===n||void 0===n?void 0:n.ISHSCODE)===(null===e||void 0===e?void 0:e.ISHSCODE)));-1===i?null===N||void 0===N||N.push(e):(N[i].Wt+=null===e||void 0===e?void 0:e.Wt,N[i].Pcs+=null===e||void 0===e?void 0:e.Pcs,N[i].Amount+=null===e||void 0===e?void 0:e.Amount)}));let b=[];null===e||void 0===e||null===(c=e.finding)||void 0===c||c.forEach(((e,n)=>{a+=null===e||void 0===e?void 0:e.Wt,o.pcs+=null===e||void 0===e?void 0:e.Pcs,0===(null===b||void 0===b?void 0:b.length)?null===b||void 0===b||b.push(e):(b[0].Wt+=null===e||void 0===e?void 0:e.Wt,b[0].Pcs+=null===e||void 0===e?void 0:e.Pcs,b[0].Amount+=null===e||void 0===e?void 0:e.Amount)})),a+=null===e||void 0===e?void 0:e.MetalWeight,v.netWtLossWt=u,v.diamonds=h,v.colorstone=p,v.misc=N,v.secondaryWt=null===e||void 0===e?void 0:e.MetalWeight,v.secondaryWts=x,v.finding=b,null===d||void 0===d||d.push(v)})),D({...O,totalWt:a}),l.resultArray=d,L(l),y(null===e||void 0===e?void 0:e.BillPrint_Json[0]);let c=(0,t.xB)(null===e||void 0===e?void 0:e.BillPrint_Json[0],o.totalAmount);M(c),c.forEach(((e,n)=>{o.grandTotal+=+(null===e||void 0===e?void 0:e.amount)})),o.grandTotal+=o.totalAmount+o.addLess,o.totalAmount=o.totalAmount.toFixed(2),o.textInNumbers=H.convert(o.grandTotal),null===l||void 0===l||null===(i=l.resultArray)||void 0===i||i.sort(((e,n)=>{var i,l,t,d;let o=(null===e||void 0===e||null===(i=e.designno)||void 0===i?void 0:i.toLowerCase())+(null===e||void 0===e||null===(l=e.SrJobno)||void 0===l?void 0:l.toLowerCase()),s=(null===n||void 0===n||null===(t=n.designno)||void 0===t?void 0:t.toLowerCase())+(null===n||void 0===n||null===(d=n.SrJobno)||void 0===d?void 0:d.toLowerCase());return o<s?-1:o>s?1:0})),console.log(l),R(o),P(l)})(null===e||void 0===e?void 0:e.Data),C(!1))}else C(!1),S(null===e||void 0===e?void 0:e.Message)}catch(e){console.error(e)}})()}),[]),(0,c.jsx)(c.Fragment,{children:A?(0,c.jsx)(d.Z,{}):""===E?(0,c.jsxs)("div",{className:"container containerRetailPrint containerRetail1Prints pad_60_allPrint",children:[(0,c.jsx)("div",{className:"d-flex w-100 justify-content-end align-items-baseline print_sec_sum4 no_break position-relative",children:(0,c.jsx)("div",{className:"printBtn_sec text-end position-absolute printBtnRetailPrint",children:(0,c.jsx)("input",{type:"button",className:"btn_white blue me-0",value:"Print",onClick:e=>(0,t.Yj)(e)})})}),(0,c.jsx)("div",{className:"px-1 no_break",children:(0,c.jsx)("div",{className:"headlinepRetailPrint headlinepRetail1Print w-100 px-2 fw-bold",children:null===b||void 0===b?void 0:b.PrintHeadLabel})}),(0,c.jsxs)("div",{className:"mt-2 px-1 d-flex no_break",children:[(0,c.jsxs)("div",{className:"col-6",children:[(0,c.jsx)("h6",{className:"fw-bold",children:null===b||void 0===b?void 0:b.CompanyFullName}),(0,c.jsx)("p",{className:"ft_12_retail1Print",children:null===b||void 0===b?void 0:b.CompanyAddress}),(0,c.jsx)("p",{className:"ft_12_retail1Print",children:null===b||void 0===b?void 0:b.CompanyAddress2}),(0,c.jsxs)("p",{className:"ft_12_retail1Print",children:[null===b||void 0===b?void 0:b.CompanyCity," ",null===b||void 0===b?void 0:b.CompanyPinCode," ",null===b||void 0===b?void 0:b.CompanyState," ",null===b||void 0===b?void 0:b.CompanyCountry]}),(0,c.jsxs)("p",{className:"ft_12_retail1Print",children:["T ",null===b||void 0===b?void 0:b.CompanyTellNo," | TOLL FREE ",null===b||void 0===b?void 0:b.CompanyTollFreeNo]}),(0,c.jsxs)("p",{className:"ft_12_retail1Print",children:[null===b||void 0===b?void 0:b.CompanyEmail," | ",null===b||void 0===b?void 0:b.CompanyWebsite]}),(0,c.jsxs)("p",{className:"ft_12_retail1Print",children:[null===b||void 0===b?void 0:b.Company_VAT_GST_No," | ",null===b||void 0===b?void 0:b.Company_CST_STATE," - ",null===b||void 0===b?void 0:b.Company_CST_STATE_No," | PAN-",null===b||void 0===b?void 0:b.Pannumber]})]}),(0,c.jsx)("div",{className:"col-6",children:J&&""!==(null===b||void 0===b?void 0:b.PrintLogo)&&(0,c.jsx)("img",{src:null===b||void 0===b?void 0:b.PrintLogo,alt:"",className:"retailPrintLogo d-block ms-auto",onError:()=>{z(!1)},height:120,width:150})})]}),(0,c.jsxs)("div",{className:"d-flex border mt-2 no_break justify-content-between",children:[(0,c.jsxs)("div",{className:"py-2 px-1",children:[(0,c.jsxs)("p",{className:"line_height_110 ft_12_retail1Print",children:[null===b||void 0===b?void 0:b.lblBillTo," "]}),(0,c.jsx)("p",{className:"fw-bold line_height_110",children:null===b||void 0===b?void 0:b.CustName})]}),(0,c.jsx)("div",{className:"p-1 position-relative pe-5",children:(0,c.jsxs)("div",{className:"d-flex",children:[(0,c.jsxs)("div",{className:"",style:{minWidth:"60px"},children:[(0,c.jsx)("p",{className:"fw-bold ft_12_retail1Print",children:"BILL NO"}),(0,c.jsx)("p",{className:"fw-bold ft_12_retail1Print",children:"DATE"}),(0,c.jsx)("p",{className:"fw-bold ft_12_retail1Print",children:"HSN"})]}),(0,c.jsxs)("div",{className:"",style:{minWidth:"max-content"},children:[(0,c.jsx)("p",{className:"ft_12_retail1Print",children:null===b||void 0===b?void 0:b.InvoiceNo}),(0,c.jsx)("p",{className:"ft_12_retail1Print",children:null===b||void 0===b?void 0:b.EntryDate}),(0,c.jsx)("p",{className:"ft_12_retail1Print",children:null===b||void 0===b?void 0:b.HSN_No})]})]})})]}),(0,c.jsxs)("div",{className:"d-flex mt-1 border no_break ft_12_retail1Print",children:[(0,c.jsx)("div",{className:"srNoRetailPrint border-end d-flex justify-content-center align-items-center",children:(0,c.jsx)("p",{className:"fw-bold",children:"Sr#"})}),(0,c.jsx)("div",{className:"poductDiscriptionRetailPrint border-end d-flex justify-content-center align-items-center",children:(0,c.jsx)("p",{className:"fw-bold",children:"Product Description"})}),(0,c.jsxs)("div",{className:"materialDescriptionRetailPrint border-end",children:[(0,c.jsx)("div",{className:"border-bottom p-1 d-flex justify-content-center align-items-center",children:(0,c.jsx)("p",{className:"fw-bold",children:"Material Description"})}),(0,c.jsxs)("div",{className:"d-flex",children:[(0,c.jsx)("div",{className:"".concat(B.Material," border-end d-flex justify-content-center align-items-center"),children:(0,c.jsx)("p",{className:"fw-bold",children:"Material"})}),(0,c.jsx)("div",{className:"".concat(B.Qty," border-end d-flex justify-content-center align-items-center"),children:(0,c.jsx)("p",{className:"fw-bold",children:"Qty"})}),(0,c.jsx)("div",{className:"".concat(B.Pcs," border-end d-flex justify-content-center align-items-center"),children:(0,c.jsx)("p",{className:"fw-bold",children:"Pcs"})}),(0,c.jsx)("div",{className:"".concat(B.Wt," border-end d-flex justify-content-center align-items-center"),children:(0,c.jsx)("p",{className:"fw-bold",children:"Wt."})}),w&&(0,c.jsx)("div",{className:"".concat("retail1 print"===I?"rateRetailPrint1":"rateRetailPrint border-end"," d-flex justify-content-center align-items-center"),children:(0,c.jsx)("p",{className:"fw-bold",children:"Rate"})}),"retail1 print"!==I&&(0,c.jsx)("div",{className:"".concat(B.Amount," d-flex justify-content-center align-items-center"),children:(0,c.jsx)("p",{className:"fw-bold",children:"Amount"})})]})]}),(0,c.jsx)("div",{className:"makingRetailPrint border-end d-flex justify-content-center align-items-center",children:(0,c.jsx)("p",{className:"fw-bold",children:"Making"})}),(0,c.jsx)("div",{className:"othersRetailPrint border-end d-flex justify-content-center align-items-center",children:(0,c.jsx)("p",{className:"fw-bold",children:"Others"})}),(0,c.jsx)("div",{className:"".concat(null===B||void 0===B?void 0:B.total," d-flex justify-content-center align-items-center"),children:(0,c.jsx)("p",{className:"fw-bold",children:"Total"})})]}),null===_||void 0===_||null===(n=_.resultArray)||void 0===n?void 0:n.map(((e,n)=>{var i,l,d,o,s;return(0,c.jsxs)("div",{className:"d-flex border-start border-end no_break ft_12_retail1Print",children:[(0,c.jsx)("div",{className:"srNoRetailPrint border-bottom border-end p-1 d-flex justify-content-center align-items-center",children:(0,c.jsx)("p",{className:"fw-bold",children:(0,t.dl)(n+1,0)})}),(0,c.jsxs)("div",{className:"poductDiscriptionRetailPrint border-bottom border-end p-1",children:[(0,c.jsxs)("p",{children:[null===e||void 0===e?void 0:e.SubCategoryname," ",null===e||void 0===e?void 0:e.Categoryname," "]}),(0,c.jsx)("img",{src:null===e||void 0===e?void 0:e.DesignImage,alt:"",className:"w-100 product_image_retailPrint",onError:t.Mp}),(0,c.jsxs)("p",{className:"text-center fw-bold pt-1",children:[(0,t.OP)(null===e||void 0===e?void 0:e.grosswt,3)," gm ",(0,c.jsx)("span",{className:"fw-normal",children:"Gross"})]})]}),(0,c.jsx)("div",{className:"materialDescriptionRetailPrint border-end",children:(0,c.jsxs)("div",{className:"d-grid h-100",children:[null===e||void 0===e||null===(i=e.metal)||void 0===i?void 0:i.map(((n,i)=>1===(null===n||void 0===n?void 0:n.IsPrimaryMetal)&&(0,c.jsxs)("div",{className:"d-flex border-bottom",children:[(0,c.jsx)("div",{className:"".concat(B.Material," border-end p-1 d-flex align-items-center"),children:(0,c.jsx)("p",{children:1===(null===n||void 0===n?void 0:n.IsPrimaryMetal)&&(null===n||void 0===n?void 0:n.ShapeName)})}),(0,c.jsx)("div",{className:"".concat(B.Qty," border-end p-1 d-flex align-items-center"),children:(0,c.jsx)("p",{children:1===(null===n||void 0===n?void 0:n.IsPrimaryMetal)&&(null===n||void 0===n?void 0:n.QualityName)})}),(0,c.jsx)("div",{className:"".concat(B.Pcs," border-end p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end"})}),(0,c.jsx)("div",{className:"".concat(B.Wt," border-end p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:(0,t.dl)(null===e||void 0===e?void 0:e.secondaryWt,3)})}),(0,c.jsx)("div",{className:"".concat("retail1 print"===I?"rateRetailPrint1":"rateRetailPrint border-end"," p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:(0,t.dl)((null===n||void 0===n?void 0:n.Rate)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2)})}),"retail1 print"!==I&&(0,c.jsx)("div",{className:"".concat(B.Amount," p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:(0,t.dl)((null===n||void 0===n?void 0:n.Amount)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2)})})]},i))),null===e||void 0===e||null===(l=e.diamonds)||void 0===l?void 0:l.map(((e,n)=>(0,c.jsxs)("div",{className:"d-flex border-bottom",children:[(0,c.jsx)("div",{className:"".concat(B.Material," border-end p-1 d-flex align-items-center"),children:(0,c.jsx)("p",{children:null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeName})}),(0,c.jsx)("div",{className:"".concat(B.Qty," border-end p-1 d-flex align-items-center"),children:(0,c.jsx)("p",{})}),(0,c.jsx)("div",{className:"".concat(B.Pcs," border-end p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:(0,t.dl)(null===e||void 0===e?void 0:e.Pcs,0)})}),(0,c.jsx)("div",{className:"".concat(B.Wt," border-end p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:(0,t.dl)(null===e||void 0===e?void 0:e.Wt,3)})}),w&&(0,c.jsx)("div",{className:"".concat("retail1 print"===I?"rateRetailPrint1":"rateRetailPrint border-end"," p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:0!==(null===e||void 0===e?void 0:e.Wt)?(0,t.dl)((null===e||void 0===e?void 0:e.Amount)/(null===b||void 0===b?void 0:b.CurrencyExchRate)/(null===e||void 0===e?void 0:e.Wt),2):"0.00"})}),"retail1 print"!==I&&(0,c.jsx)("div",{className:"".concat(B.Amount," p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:(0,t.dl)((null===e||void 0===e?void 0:e.Amount)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2)})})]},n))),null===e||void 0===e||null===(d=e.colorstone)||void 0===d?void 0:d.map(((e,n)=>(0,c.jsxs)("div",{className:"d-flex border-bottom",children:[(0,c.jsx)("div",{className:"".concat(B.Material," border-end p-1 d-flex align-items-center"),children:(0,c.jsx)("p",{children:null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeName})}),(0,c.jsx)("div",{className:"".concat(B.Qty," border-end p-1 d-flex align-items-center"),children:(0,c.jsx)("p",{})}),(0,c.jsx)("div",{className:"".concat(B.Pcs," border-end p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:(0,t.dl)(null===e||void 0===e?void 0:e.Pcs,0)})}),(0,c.jsx)("div",{className:"".concat(B.Wt," border-end p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:(0,t.dl)(null===e||void 0===e?void 0:e.Wt,3)})}),w&&(0,c.jsx)("div",{className:"".concat("retail1 print"===I?"rateRetailPrint1":"rateRetailPrint border-end"," p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:0===(null===e||void 0===e?void 0:e.isRateOnPcs)?0!==(null===e||void 0===e?void 0:e.Wt)?(0,t.dl)((null===e||void 0===e?void 0:e.Amount)/((null===e||void 0===e?void 0:e.Wt)*(null===b||void 0===b?void 0:b.CurrencyExchRate)),2):"0.00":0!==(null===e||void 0===e?void 0:e.Pcs)?(0,t.dl)((null===e||void 0===e?void 0:e.Amount)/((null===e||void 0===e?void 0:e.Pcs)*(null===b||void 0===b?void 0:b.CurrencyExchRate)),2):"0.00"})}),"retail1 print"!==I&&(0,c.jsx)("div",{className:"".concat(B.Amount," p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:(0,t.dl)((null===e||void 0===e?void 0:e.Amount)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2)})})]},n))),null===e||void 0===e||null===(o=e.misc)||void 0===o?void 0:o.map(((e,n)=>(0!==(null===e||void 0===e?void 0:e.Wt)||0!==(null===e||void 0===e?void 0:e.ServWt))&&(0,c.jsxs)("div",{className:"d-flex border-bottom",children:[(0,c.jsx)("div",{className:"".concat(B.Material," border-end p-1 d-flex align-items-center"),children:(0,c.jsx)("p",{children:null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeName})}),(0,c.jsx)("div",{className:"".concat(B.Qty," border-end p-1 d-flex align-items-center"),children:(0,c.jsx)("p",{})}),(0,c.jsx)("div",{className:"".concat(B.Pcs," border-end p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:(0,t.dl)(null===e||void 0===e?void 0:e.Pcs,0)})}),(0,c.jsx)("div",{className:"".concat(B.Wt," border-end p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:0===(null===e||void 0===e?void 0:e.IsHSCOE)?(0,t.dl)(null===e||void 0===e?void 0:e.Wt,3):(0,t.dl)(null===e||void 0===e?void 0:e.ServWt,3)})}),w&&(0,c.jsx)("div",{className:"".concat("retail1 print"===I?"rateRetailPrint1":"rateRetailPrint border-end"," p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:0===(null===e||void 0===e?void 0:e.isRateOnPcs)?0!==(null===e||void 0===e?void 0:e.Wt)?(0,t.dl)((null===e||void 0===e?void 0:e.Amount)/(null===e||void 0===e?void 0:e.Wt)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2):"0.00":0!==(null===e||void 0===e?void 0:e.Pcs)?(0,t.dl)((null===e||void 0===e?void 0:e.Amount)/(null===e||void 0===e?void 0:e.Pcs)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2):"0.00"})}),"retail1 print"!==I&&(0,c.jsx)("div",{className:"".concat(B.Amount," p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:(0,t.dl)((null===e||void 0===e?void 0:e.Amount)/(null===b||void 0===b?void 0:b.CurrencyExchRate)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2)})})]},n))),null===e||void 0===e||null===(s=e.finding)||void 0===s?void 0:s.map(((e,n)=>(0,c.jsxs)("div",{className:"d-flex border-bottom",children:[(0,c.jsx)("div",{className:"".concat(B.Material," border-end p-1 d-flex align-items-center"),children:(0,c.jsx)("p",{})}),(0,c.jsx)("div",{className:"".concat(B.Qty," border-end p-1 d-flex align-items-center"),children:(0,c.jsx)("p",{})}),(0,c.jsx)("div",{className:"".concat(B.Pcs," border-end p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:(0,t.dl)(null===e||void 0===e?void 0:e.Pcs,0)})}),(0,c.jsx)("div",{className:"".concat(B.Wt," border-end p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:(0,t.dl)(null===e||void 0===e?void 0:e.Wt,3)})}),w&&(0,c.jsx)("div",{className:"".concat("retail1 print"===I?"rateRetailPrint1":"rateRetailPrint border-end"," p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end"})}),"retail1 print"!==I&&(0,c.jsx)("div",{className:"".concat(B.Amount," p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end"})})]},n))),0!==(null===e||void 0===e?void 0:e.secondaryWts)&&(0,c.jsxs)("div",{className:"d-flex border-bottom",children:[(0,c.jsx)("div",{className:"".concat(B.Material," border-end p-1 d-flex align-items-center"),children:(0,c.jsx)("p",{})}),(0,c.jsx)("div",{className:"".concat(B.Qty," border-end p-1 d-flex align-items-center"),children:(0,c.jsx)("p",{})}),(0,c.jsx)("div",{className:"".concat(B.Pcs," border-end p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end"})}),(0,c.jsx)("div",{className:"".concat(B.Wt," border-end p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:(0,t.dl)(null===e||void 0===e?void 0:e.secondaryWts,3)})}),(0,c.jsx)("div",{className:"".concat("retail1 print"===I?"rateRetailPrint1":"rateRetailPrint border-end"," p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end"})}),"retail1 print"!==I&&(0,c.jsx)("div",{className:"".concat(B.Amount," p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end"})})]})]})}),(0,c.jsx)("div",{className:"makingRetailPrint border-bottom border-end p-1 d-flex ".concat("retail print 1"===I?"flex-column align-items-end justify-content-center":"align-items-center justify-content-end "),children:(0,c.jsx)("p",{className:"text-end",children:(0,t.dl)((null===e||void 0===e?void 0:e.MaKingCharge_Unit)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2)})}),(0,c.jsx)("div",{className:"othersRetailPrint border-bottom border-end p-1 d-flex align-items-center justify-content-end",children:(0,c.jsx)("p",{className:"text-end",children:(0,t.dl)(((null===e||void 0===e?void 0:e.OtherCharges)+(null===e||void 0===e?void 0:e.TotalDiamondHandling)+(null===e||void 0===e?void 0:e.MiscAmount))/(null===b||void 0===b?void 0:b.CurrencyExchRate),2)})}),(0,c.jsx)("div",{className:"".concat(null===B||void 0===B?void 0:B.total," border-bottom p-1 d-flex align-items-center justify-content-end"),children:(0,c.jsx)("p",{className:"text-end",children:(0,t.dl)((null===e||void 0===e?void 0:e.TotalAmount)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2)})})]},n)})),(0,c.jsxs)("div",{className:"d-flex border-bottom border-start border-end no_break",children:[(0,c.jsx)("div",{className:"srNoRetailPrint border-end p-1 d-flex justify-content-center align-items-center"}),(0,c.jsx)("div",{className:"poductDiscriptionRetailPrint border-end p-1 d-flex align-items-center",children:(0,c.jsx)("p",{className:"fw-bold ft_17_retailPrint",children:"TOTAL"})}),(0,c.jsx)("div",{className:"materialDescriptionRetailPrint border-end",children:(0,c.jsxs)("div",{className:"d-flex",children:[(0,c.jsx)("div",{className:"".concat(B.Material," border-end p-1 min_height_44_retail_print_1 ft_12_retail1Print"),children:(0,c.jsx)("p",{className:"fw-bold"})}),(0,c.jsx)("div",{className:"".concat(B.Qty," border-end p-1 min_height_44_retail_print_1 ft_12_retail1Print"),children:(0,c.jsx)("p",{className:"fw-bold"})}),(0,c.jsx)("div",{className:"".concat(B.Pcs," border-end p-1 text-end d-flex align-items-center justify-content-end min_height_44_retail_print_1 ft_12_retail1Print"),children:(0,c.jsx)("p",{className:"fw-bold text-end",children:(0,t.dl)(null===g||void 0===g?void 0:g.pcs,0)})}),(0,c.jsx)("div",{className:"".concat(B.Wt," border-end p-1 d-flex align-items-end justify-content-around flex-column min_height_44_retail_print_1 ft_12_retail1Print"),children:(0,c.jsxs)("p",{className:"fw-bold lh-1 text-end",children:[(0,t.OP)(null===O||void 0===O?void 0:O.totalWt,3)," "]})}),w&&(0,c.jsx)("div",{className:"".concat("retail1 print"===I?"rateRetailPrint1":"rateRetailPrint border-end"," p-1 d-flex align-items-center justify-content-end min_height_44_retail_print_1 ft_12_retail1Print"),children:(0,c.jsx)("p",{className:"fw-bold text-end"})}),"retail1 print"!==I&&(0,c.jsx)("div",{className:"".concat(B.Amount," p-1 d-flex align-items-center justify-content-end min_height_44_retail_print_1 ft_12_retail1Print"),children:(0,c.jsx)("p",{className:"fw-bold text-end"})})]})}),(0,c.jsx)("div",{className:"makingRetailPrint border-end p-1 d-flex align-items-center justify-content-end ft_12_retail1Print",children:(0,c.jsx)("p",{className:"fw-bold text-end"})}),(0,c.jsx)("div",{className:"othersRetailPrint border-end p-1 d-flex align-items-center justify-content-end ft_12_retail1Print",children:(0,c.jsx)("p",{className:"fw-bold text-end",children:(0,t.dl)((null===_||void 0===_||null===(i=_.mainTotal)||void 0===i?void 0:i.total_otherCharge_Diamond_Handling)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2)})}),(0,c.jsx)("div",{className:"".concat(null===B||void 0===B?void 0:B.total," p-1 d-flex align-items-center justify-content-end ft_12_retail1Print"),children:(0,c.jsx)("p",{className:"fw-bold text-end",children:(0,t.dl)((null===_||void 0===_||null===(v=_.mainTotal)||void 0===v?void 0:v.total_amount)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2)})})]}),(0,c.jsxs)("div",{className:"d-flex border-start border-end border-bottom no_break",children:[(0,c.jsxs)("div",{className:"retail1PrintInWords p-1 d-flex flex-column align-items-start justify-content-end p-1 border-end",children:[(0,c.jsxs)("p",{className:"ft_12_retail1Print",children:["In Words ",null===b||void 0===b?void 0:b.Currencyname]}),(0,c.jsxs)("p",{className:"fw-bold ft_12_retail1Print",children:[(0,a.Z)(+(0,t.OP)(+(0,t.OP)((null===_||void 0===_||null===(u=_.mainTotal)||void 0===u?void 0:u.total_amount)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2)+(null===T||void 0===T?void 0:T.reduce(((e,n)=>e+ +(0,t.OP)(+(null===n||void 0===n?void 0:n.amount)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2)),0))+ +(0,t.OP)((null===b||void 0===b?void 0:b.AddLess)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2),2))," "]})]}),(0,c.jsxs)("div",{className:"retail1PrintInNumbers py-1 text-end border-end ft_12_retail1Print",children:[T.length>0&&T.map(((e,n)=>(0,c.jsxs)("p",{className:"pb-1 px-1",children:[null===e||void 0===e?void 0:e.name," @ ",null===e||void 0===e?void 0:e.per]},n))),0!==(null===b||void 0===b?void 0:b.AddLess)&&(0,c.jsx)("p",{className:"ft_12_retail1Print px-1",children:(null===b||void 0===b?void 0:b.AddLess)>0?"Add":"Less"}),(0,c.jsx)("p",{className:"fw-bold py-1 border-top ft_12_retail1Print px-1",children:"GRAND TOTAL"})]}),(0,c.jsxs)("div",{className:"retail1PrintInNumbers1 py-1 text-end ft_12_retail1Print",children:[T.length>0&&T.map(((e,n)=>(0,c.jsx)("p",{className:"pb-1 px-1",children:(0,t.dl)(+(null===e||void 0===e?void 0:e.amount)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2)},n))),0!==(null===b||void 0===b?void 0:b.AddLess)&&(0,c.jsx)("p",{className:"ft_12_retail1Print px-1",children:(0,t.dl)((null===b||void 0===b?void 0:b.AddLess)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2)}),(0,c.jsxs)("p",{className:"fw-bold py-1 border-top ft_12_retail1Print px-1",children:[(0,c.jsx)("span",{dangerouslySetInnerHTML:{__html:null===b||void 0===b?void 0:b.Currencysymbol}}),(0,t.dl)(+(0,t.OP)((null===_||void 0===_||null===(m=_.mainTotal)||void 0===m?void 0:m.total_amount)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2)+(null===T||void 0===T?void 0:T.reduce(((e,n)=>e+ +(0,t.OP)(+(null===n||void 0===n?void 0:n.amount)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2)),0))+ +(0,t.OP)((null===b||void 0===b?void 0:b.AddLess)/(null===b||void 0===b?void 0:b.CurrencyExchRate),2),2)]})]})]}),(0,c.jsx)("div",{className:"note border-start border-end border-bottom p-1 pb-3 no_break",children:(0,c.jsx)("div",{dangerouslySetInnerHTML:{__html:null===b||void 0===b?void 0:b.Declaration},className:"pt-2"})}),(0,c.jsx)("div",{className:"note border-start border-end border-bottom p-1 no_break",children:(0,c.jsxs)("p",{children:[(0,c.jsx)("span",{className:"fw-bold",children:"REMARKS : "}),null===b||void 0===b?void 0:b.PrintRemark]})}),(0,c.jsxs)("div",{className:"word_break_normal_retail_print d-flex border-start border-end border-bottom no_break ft_12_retail1Print",children:[(0,c.jsxs)("div",{className:"col-4 p-2 border-end",children:[(0,c.jsx)("p",{className:"fw-bold",children:"Bank Detail"}),(0,c.jsxs)("p",{children:["Bank Name: ",null===b||void 0===b?void 0:b.bankname]}),(0,c.jsxs)("p",{children:["Branch: ",null===b||void 0===b?void 0:b.bankaddress]}),(0,c.jsxs)("p",{children:[null===b||void 0===b?void 0:b.customercity1,"-",null===b||void 0===b?void 0:b.PinCode]}),(0,c.jsxs)("p",{children:["Account Name: ",null===b||void 0===b?void 0:b.accountname]}),(0,c.jsxs)("p",{children:["Account No. : ",null===b||void 0===b?void 0:b.accountnumber]}),(0,c.jsxs)("p",{children:["RTGS/NEFT IFSC: ",null===b||void 0===b?void 0:b.rtgs_neft_ifsc]})]}),(0,c.jsxs)("div",{className:"col-4 border-end d-flex flex-column justify-content-between p-2",children:[(0,c.jsx)("p",{children:"Signature"}),(0,c.jsx)("p",{className:"fw-bold",children:null===b||void 0===b?void 0:b.customerfirmname})]}),(0,c.jsxs)("div",{className:"col-4 d-flex flex-column justify-content-between p-2",children:[(0,c.jsx)("p",{children:"Signature"}),(0,c.jsx)("p",{className:"fw-bold",children:null===b||void 0===b?void 0:b.CompanyFullName})]})]})]}):(0,c.jsx)("p",{className:"text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto",children:E})})}},62906:(e,n,i)=>{!function(){"use strict";"object"==typeof self&&self.self===self&&self||"object"==typeof i.g&&i.g.global===i.g&&i.g;var l=9007199254740991;function t(e){return!("number"!=typeof e||e!=e||e===1/0||e===-1/0)}function d(e){return"number"==typeof e&&Math.abs(e)<=l}var o=/(hundred|thousand|(m|b|tr|quadr)illion)$/,s=/teen$/,r=/y$/,a=/(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)$/,c={zero:"zeroth",one:"first",two:"second",three:"third",four:"fourth",five:"fifth",six:"sixth",seven:"seventh",eight:"eighth",nine:"ninth",ten:"tenth",eleven:"eleventh",twelve:"twelfth"};function v(e){return o.test(e)||s.test(e)?e+"th":r.test(e)?e.replace(r,"ieth"):a.test(e)?e.replace(a,u):e}function u(e,n){return c[n]}var m=1e3,x=1e6,h=1e9,p=1e12,f=1e15,j=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"],N=["zero","ten","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];function b(e,n){var i,l=parseInt(e,10);if(!t(l))throw new TypeError("Not a finite number: "+e+" ("+typeof e+")");if(!d(l))throw new RangeError("Input is not a safe number, it\u2019s either too large or too small.");return i=function e(n){var i,l,t=arguments[1];return 0===n?t?t.join(" ").replace(/,$/,""):"zero":(t||(t=[]),n<0&&(t.push("minus"),n=Math.abs(n)),n<20?(i=0,l=j[n]):n<100?(i=n%10,l=N[Math.floor(n/10)],i&&(l+="-"+j[i],i=0)):n<m?(i=n%100,l=e(Math.floor(n/100))+" hundred"):n<x?(i=n%m,l=e(Math.floor(n/m))+" thousand,"):n<h?(i=n%x,l=e(Math.floor(n/x))+" million,"):n<p?(i=n%h,l=e(Math.floor(n/h))+" billion,"):n<f?(i=n%p,l=e(Math.floor(n/p))+" trillion,"):n<=9007199254740992&&(i=n%f,l=e(Math.floor(n/f))+" quadrillion,"),t.push(l),e(i,t))}(l),n?v(i):i}var y={toOrdinal:function(e){var n=parseInt(e,10);if(!t(n))throw new TypeError("Not a finite number: "+e+" ("+typeof e+")");if(!d(n))throw new RangeError("Input is not a safe number, it\u2019s either too large or too small.");var i=String(n),l=Math.abs(n%100),o=11<=l&&l<=13,s=i.charAt(i.length-1);return i+(o?"th":"1"===s?"st":"2"===s?"nd":"3"===s?"rd":"th")},toWords:b,toWordsOrdinal:function(e){return v(b(e))}};e.exports&&(n=e.exports=y),n.numberToWords=y}()},60006:()=>{}}]);
//# sourceMappingURL=2727.6761f056.chunk.js.map