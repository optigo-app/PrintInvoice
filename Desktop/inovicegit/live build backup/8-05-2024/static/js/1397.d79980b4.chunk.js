/*! For license information please see 1397.d79980b4.chunk.js.LICENSE.txt */
(self.webpackChunkinvoice=self.webpackChunkinvoice||[]).push([[1397],{79515:(e,n,o)=>{"use strict";o.r(n),o.d(n,{default:()=>s});var d=o(72791),l=o(1683);const i={summaryInCurrency:"SummaryInCurrency_summaryInCurrency__ef7Ou",SR:"SummaryInCurrency_SR__ZN4wW",QLTY:"SummaryInCurrency_QLTY__lW9GT",PURITY:"SummaryInCurrency_PURITY__pxgRN",DIAWT:"SummaryInCurrency_DIAWT__MxU1U",DIARATE:"SummaryInCurrency_DIARATE__GEkQz",DIAAMT:"SummaryInCurrency_DIAAMT__HoJXX",GWT:"SummaryInCurrency_GWT__mFD-t",NWT:"SummaryInCurrency_NWT__n4Lwo",MAKING:"SummaryInCurrency_MAKING__7z+AS",CSAMT:"SummaryInCurrency_CSAMT__9neTq",GOLDFINE:"SummaryInCurrency_GOLDFINE__CaBqE",GOLDAMT:"SummaryInCurrency_GOLDAMT__IezUu",AMOUNT:"SummaryInCurrency_AMOUNT__2zhRz",word_break:"SummaryInCurrency_word_break__LRbx7",DESIGN:"SummaryInCurrency_DESIGN__GRWqF",total:"SummaryInCurrency_total__d5kqv",font_14:"SummaryInCurrency_font_14__Yjohp",font_15:"SummaryInCurrency_font_15__BZjqi",font_16:"SummaryInCurrency_font_16__nKTxE",font_18:"SummaryInCurrency_font_18__FIbYe",print_sec_sum4:"SummaryInCurrency_print_sec_sum4__r2Ztq"};var t=o(80444),r=o(89995),a=o(763),c=o(80184);const s=e=>{var n,o,s,v,u,m,x,h,f,b,_,N,p,j,y,w,T,I;let{urls:A,token:g,invoiceNo:S,printName:D,evn:M,ApiVer:k}=e;const[C,G]=(0,d.useState)(!0),[E,W]=(0,d.useState)(""),[R,O]=(0,d.useState)({}),[L,K]=(0,d.useState)({}),[H,P]=(0,d.useState)({image:!0}),[U,Y]=(0,d.useState)(!0);return(0,d.useEffect)((()=>{(async()=>{try{const e=await(0,l.k_)(g,S,D,A,M,k);if("200"===(null===e||void 0===e?void 0:e.Status)){(0,l.nK)(null===e||void 0===e?void 0:e.Data)?(G(!1),W("Data Not Found")):((e=>{var n;K(null===e||void 0===e?void 0:e.BillPrint_Json[0]);let o=(0,r.g)(null===e||void 0===e?void 0:e.BillPrint_Json[0],null===e||void 0===e?void 0:e.BillPrint_Json1,null===e||void 0===e?void 0:e.BillPrint_Json2),d=[];null===o||void 0===o||null===(n=o.resultArray)||void 0===n||n.forEach(((e,n)=>{var o,l;let i=(0,a.cloneDeep)(e),t=[];null===e||void 0===e||null===(o=e.diamonds)||void 0===o||o.forEach(((e,n)=>{let o=null===t||void 0===t?void 0:t.findIndex((n=>(null===n||void 0===n?void 0:n.ShapeName)===(null===e||void 0===e?void 0:e.ShapeName)&&(null===n||void 0===n?void 0:n.Colorname)===(null===e||void 0===e?void 0:e.Colorname)&&(null===n||void 0===n?void 0:n.QualityName)===(null===e||void 0===e?void 0:e.QualityName)&&(null===n||void 0===n?void 0:n.Rate)===(null===e||void 0===e?void 0:e.Rate)));-1===o?null===t||void 0===t||t.push(e):(t[o].Amount+=null===e||void 0===e?void 0:e.Amount,t[o].Wt+=null===e||void 0===e?void 0:e.Wt,t[o].Pcs+=null===e||void 0===e?void 0:e.Pcs)})),i.diamonds=t,i.metalAmounts=null===e||void 0===e||null===(l=e.metal)||void 0===l?void 0:l.reduce(((e,n)=>1===(null===n||void 0===n?void 0:n.IsPrimaryMetal)?e+(null===n||void 0===n?void 0:n.Amount):e),0),null===d||void 0===d||d.push(i)})),o.resultArray=d,O(o),console.log(o)})(null===e||void 0===e?void 0:e.Data),G(!1))}else G(!1),W(null===e||void 0===e?void 0:e.Message)}catch(e){console.error(e)}})()}),[]),C?(0,c.jsx)(t.Z,{}):""===E?(0,c.jsxs)("div",{className:"container container-fluid max_width_container mt-1 ".concat(null===i||void 0===i?void 0:i.summaryInCurrency," pad_60_allPrint px-1"),children:[(0,c.jsxs)("div",{className:"d-flex justify-content-end align-items-center ".concat(null===i||void 0===i?void 0:i.print_sec_sum4," mb-4 ").concat(null===i||void 0===i?void 0:i.font_16),children:[(0,c.jsxs)("div",{className:"form-check d-flex align-items-center pt-1",children:[(0,c.jsx)("input",{className:"border-dark me-2",type:"checkbox",checked:null===H||void 0===H?void 0:H.image,onChange:e=>(e=>{const{name:n,checked:o}=null===e||void 0===e?void 0:e.target;P({...H,[n]:o})})(e),name:"image"}),(0,c.jsx)("label",{className:"",children:"With Image"})]}),(0,c.jsx)("div",{className:"form-check ps-3 ".concat(null===i||void 0===i?void 0:i.printBtn),children:(0,c.jsx)("input",{type:"button",className:"btn_white blue py-2 mt-2",value:"Print",onClick:e=>(0,l.Yj)(e)})})]}),(0,c.jsxs)("div",{className:"border d-flex justify-content-between p-2 ".concat(null===i||void 0===i?void 0:i.font_18),children:[(0,c.jsxs)("p",{children:["ESTIMATE# : ",(0,c.jsx)("span",{className:"fw-bold",children:null===L||void 0===L?void 0:L.InvoiceNo})]}),(0,c.jsxs)("div",{children:[(0,c.jsxs)("p",{className:"text-end pb-1",children:["DATE : ",(0,c.jsx)("span",{className:"fw-bold",children:null===L||void 0===L?void 0:L.EntryDate})]}),""!==(null===L||void 0===L?void 0:L.HSN_No_Label)&&(0,c.jsxs)("p",{className:"text-end pt-1",children:[null===L||void 0===L?void 0:L.HSN_No_Label," : ",(0,c.jsx)("span",{className:"fw-bold",children:null===L||void 0===L?void 0:L.HSN_No})]})]})]}),(0,c.jsxs)("div",{className:"border-start border-end border-bottom d-flex justify-content-between p-2 ".concat(null===i||void 0===i?void 0:i.font_15),children:[(0,c.jsxs)("div",{className:"d-flex",children:[(0,c.jsx)("div",{className:"pe-2",children:(0,c.jsx)("p",{className:"fw-bold",children:"TO, "})}),(0,c.jsxs)("div",{children:[(0,c.jsx)("p",{className:"fw-bold",children:null===L||void 0===L?void 0:L.CustName}),(0,c.jsx)("p",{children:null===L||void 0===L?void 0:L.customerstreet}),(0,c.jsx)("p",{children:null===L||void 0===L?void 0:L.customerregion}),(0,c.jsxs)("p",{children:[null===L||void 0===L?void 0:L.customercity,null===L||void 0===L?void 0:L.customerpincode]}),(0,c.jsxs)("p",{children:["Phno:-",null===L||void 0===L?void 0:L.customermobileno]})]})]}),(0,c.jsx)("div",{children:(0,c.jsx)("p",{children:(0,c.jsxs)("span",{className:"fw-bold",children:["HKD ",null===L||void 0===L?void 0:L.MetalRate24K]})})})]}),(0,c.jsxs)("div",{className:"border-start border-end border-bottom d-flex",children:[(0,c.jsx)("div",{className:"d-flex justify-content-center align-items-center fw-bold text-center p-1 ".concat(null===i||void 0===i?void 0:i.SR," border-end"),children:"SR#"}),(0,c.jsx)("div",{className:"d-flex justify-content-center align-items-center fw-bold text-center p-1 ".concat(null===i||void 0===i?void 0:i.DESIGN," border-end"),children:"DESIGN"}),(0,c.jsx)("div",{className:"d-flex justify-content-center align-items-center fw-bold text-center p-1 ".concat(null===i||void 0===i?void 0:i.PURITY," border-end"),children:"PURITY"}),(0,c.jsx)("div",{className:"d-flex justify-content-center align-items-center fw-bold text-center p-1 ".concat(null===i||void 0===i?void 0:i.QLTY," border-end"),children:"QLTY"}),(0,c.jsx)("div",{className:"d-flex justify-content-center align-items-center fw-bold text-center p-1 ".concat(null===i||void 0===i?void 0:i.DIAWT," border-end"),children:"DIA WT"}),(0,c.jsx)("div",{className:"d-flex justify-content-center align-items-center fw-bold text-center p-1 ".concat(null===i||void 0===i?void 0:i.DIARATE," border-end"),children:"DIA RATE (IN HKD)"}),(0,c.jsx)("div",{className:"d-flex justify-content-center align-items-center fw-bold text-center p-1 ".concat(null===i||void 0===i?void 0:i.DIAAMT," border-end"),children:"DIA AMT (IN HKD)"}),(0,c.jsx)("div",{className:"d-flex justify-content-center align-items-center fw-bold text-center p-1 ".concat(null===i||void 0===i?void 0:i.GWT," border-end"),children:"G WT"}),(0,c.jsx)("div",{className:"d-flex justify-content-center align-items-center fw-bold text-center p-1 ".concat(null===i||void 0===i?void 0:i.NWT," border-end"),children:"NWT"}),(0,c.jsx)("div",{className:"d-flex justify-content-center align-items-center fw-bold text-center p-1 ".concat(null===i||void 0===i?void 0:i.MAKING," border-end"),children:"MAKING (IN HKD)"}),(0,c.jsx)("div",{className:"d-flex justify-content-center align-items-center fw-bold text-center p-1 ".concat(null===i||void 0===i?void 0:i.CSAMT," border-end"),children:"CSAMT (IN HKD)"}),(0,c.jsx)("div",{className:"d-flex justify-content-center align-items-center fw-bold text-center p-1 ".concat(null===i||void 0===i?void 0:i.GOLDFINE," border-end"),children:"GOLD FINE"}),(0,c.jsx)("div",{className:"d-flex justify-content-center align-items-center fw-bold text-center p-1 ".concat(null===i||void 0===i?void 0:i.GOLDAMT," border-end"),children:"GOLD AMT (IN HKD)"}),(0,c.jsx)("div",{className:"d-flex justify-content-center align-items-center fw-bold text-center p-1 ".concat(null===i||void 0===i?void 0:i.AMOUNT),children:"AMOUNT (IN HKD)"})]}),R.resultArray.map(((e,n)=>{var o,d,t,r,a,s;return(0,c.jsxs)("div",{className:"no_break border-start border-end border-bottom d-flex",children:[(0,c.jsx)("div",{className:"text-center p-1 ".concat(null===i||void 0===i?void 0:i.SR," border-end"),children:n+1}),(0,c.jsxs)("div",{className:"fw-bold p-1 ".concat(null===i||void 0===i?void 0:i.DESIGN," border-end"),children:[(0,c.jsxs)("p",{children:[null===e||void 0===e?void 0:e.designno," (",null===e||void 0===e?void 0:e.BrandName,")"]}),(0,c.jsx)("p",{children:null===e||void 0===e?void 0:e.SrJobno}),(null===H||void 0===H?void 0:H.image)&&(0,c.jsx)("img",{src:null===e||void 0===e?void 0:e.DesignImage,alt:"",className:"imgWidth w-100",onError:l.Mp})]}),(0,c.jsx)("div",{className:"p-1 ".concat(null===i||void 0===i?void 0:i.PURITY," border-end"),children:null===e||void 0===e?void 0:e.MetalTypePurity}),(0,c.jsx)("div",{className:"p-1 ".concat(null===i||void 0===i?void 0:i.QLTY," border-end"),children:null===e||void 0===e?void 0:e.diamonds.map(((e,n)=>(0,c.jsx)("p",{className:"".concat(null===i||void 0===i?void 0:i.word_break),children:null===e||void 0===e?void 0:e.QualityName},n)))}),(0,c.jsx)("div",{className:"text-end p-1 ".concat(null===i||void 0===i?void 0:i.DIAWT," border-end"),children:null===e||void 0===e?void 0:e.diamonds.map(((e,n)=>(0,c.jsx)("p",{className:"".concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)(null===e||void 0===e?void 0:e.Wt,3)},n)))}),(0,c.jsx)("div",{className:"text-end p-1 ".concat(null===i||void 0===i?void 0:i.DIARATE," border-end"),children:null===e||void 0===e?void 0:e.diamonds.map(((e,n)=>(0,c.jsx)("p",{className:"".concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)(null===e||void 0===e?void 0:e.Rate,2)},n)))}),(0,c.jsx)("div",{className:"text-end p-1 ".concat(null===i||void 0===i?void 0:i.DIAAMT," border-end"),children:null===e||void 0===e?void 0:e.diamonds.map(((e,n)=>(0,c.jsx)("p",{className:"".concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)(null===e||void 0===e?void 0:e.Amount,2)},n)))}),(0,c.jsx)("div",{className:"text-end p-1 ".concat(null===i||void 0===i?void 0:i.GWT," border-end ").concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)(null===e||void 0===e?void 0:e.grosswt,3)}),(0,c.jsx)("div",{className:"text-end p-1 ".concat(null===i||void 0===i?void 0:i.NWT," border-end ").concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)(null===e||void 0===e?void 0:e.NetWt,3)}),(0,c.jsx)("div",{className:"text-end p-1 ".concat(null===i||void 0===i?void 0:i.MAKING," border-end ").concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)((null===e||void 0===e?void 0:e.MakingAmount)+(null===e||void 0===e?void 0:e.TotalDiamondHandling)+(null===e||void 0===e||null===(o=e.totals)||void 0===o||null===(d=o.diamonds)||void 0===d?void 0:d.SettingAmount)+(null===e||void 0===e||null===(t=e.totals)||void 0===t||null===(r=t.colorstone)||void 0===r?void 0:r.SettingAmount)+(null===e||void 0===e?void 0:e.OtherCharges)+(null===e||void 0===e?void 0:e.MiscAmount),2)}),(0,c.jsx)("div",{className:"text-end p-1 ".concat(null===i||void 0===i?void 0:i.CSAMT," border-end ").concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)(null===e||void 0===e||null===(a=e.totals)||void 0===a||null===(s=a.colorstone)||void 0===s?void 0:s.Amount,2)}),(0,c.jsx)("div",{className:"text-end p-1 ".concat(null===i||void 0===i?void 0:i.GOLDFINE," border-end ").concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)(null===e||void 0===e?void 0:e.convertednetwt,2)}),(0,c.jsx)("div",{className:"text-end p-1 ".concat(null===i||void 0===i?void 0:i.GOLDAMT," border-end ").concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)((null===e||void 0===e?void 0:e.metalAmounts)/(null===L||void 0===L?void 0:L.CurrencyExchRate),2)}),(0,c.jsx)("div",{className:"text-end p-1 ".concat(null===i||void 0===i?void 0:i.AMOUNT," ").concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)((null===e||void 0===e?void 0:e.TotalAmount)/(null===L||void 0===L?void 0:L.CurrencyExchRate),2)})]},n)})),(0,c.jsxs)("div",{className:"no_break border-start border-end border-bottom d-flex lightGrey ".concat(null===i||void 0===i?void 0:i.word_break),children:[(0,c.jsx)("div",{className:"fw-bold p-1 ".concat(null===i||void 0===i?void 0:i.total," border-end"),children:(0,c.jsx)("p",{className:"fw-bold text-center",children:"Total"})}),(0,c.jsx)("div",{className:"text-end fw-bold p-1 ".concat(null===i||void 0===i?void 0:i.DIAWT," border-end ").concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)(null===R||void 0===R||null===(n=R.mainTotal)||void 0===n||null===(o=n.diamonds)||void 0===o?void 0:o.Wt,3)}),(0,c.jsx)("div",{className:"text-end fw-bold p-1 ".concat(null===i||void 0===i?void 0:i.DIARATE," border-end")}),(0,c.jsx)("div",{className:"text-end fw-bold p-1 ".concat(null===i||void 0===i?void 0:i.DIAAMT," border-end ").concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)(null===R||void 0===R||null===(s=R.mainTotal)||void 0===s||null===(v=s.diamonds)||void 0===v?void 0:v.Amount,2)}),(0,c.jsx)("div",{className:"text-end fw-bold p-1 ".concat(null===i||void 0===i?void 0:i.GWT," border-end ").concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)(null===R||void 0===R||null===(u=R.mainTotal)||void 0===u?void 0:u.grosswt,3)}),(0,c.jsx)("div",{className:"text-end fw-bold p-1 ".concat(null===i||void 0===i?void 0:i.NWT," border-end ").concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)(null===R||void 0===R||null===(m=R.mainTotal)||void 0===m?void 0:m.netwt,3)}),(0,c.jsx)("div",{className:"text-end fw-bold p-1 ".concat(null===i||void 0===i?void 0:i.MAKING," border-end ").concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)((null===R||void 0===R||null===(x=R.mainTotal)||void 0===x?void 0:x.total_Making_Amount)+(null===R||void 0===R||null===(h=R.mainTotal)||void 0===h||null===(f=h.diamonds)||void 0===f?void 0:f.SettingAmount)+(null===R||void 0===R||null===(b=R.mainTotal)||void 0===b||null===(_=b.colorstone)||void 0===_?void 0:_.SettingAmount)+(null===R||void 0===R||null===(N=R.mainTotal)||void 0===N?void 0:N.total_otherCharge_Diamond_Handling),2)}),(0,c.jsx)("div",{className:"text-end fw-bold p-1 ".concat(null===i||void 0===i?void 0:i.CSAMT," border-end ").concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)(null===R||void 0===R||null===(p=R.mainTotal)||void 0===p||null===(j=p.colorstone)||void 0===j?void 0:j.Amount,2)}),(0,c.jsx)("div",{className:"text-end fw-bold p-1 ".concat(null===i||void 0===i?void 0:i.GOLDFINE," border-end ").concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)(null===R||void 0===R||null===(y=R.mainTotal)||void 0===y?void 0:y.convertednetwt,2)}),(0,c.jsx)("div",{className:"text-end fw-bold p-1 ".concat(null===i||void 0===i?void 0:i.GOLDAMT," border-end ").concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)(null===R||void 0===R||null===(w=R.mainTotal)||void 0===w?void 0:w.MetalAmount,2)}),(0,c.jsx)("div",{className:"text-end fw-bold p-1 ".concat(null===i||void 0===i?void 0:i.AMOUNT," ").concat(null===i||void 0===i?void 0:i.word_break),children:(0,l.dl)(null===R||void 0===R||null===(T=R.mainTotal)||void 0===T?void 0:T.total_amount,2)})]}),(0,c.jsxs)("div",{className:"no_break my-1 d-flex justify-content-between p-1 lightGrey border ".concat(null===i||void 0===i?void 0:i.font_14),children:[(0,c.jsxs)("p",{children:["  Gold in 24K : ",(0,c.jsx)("span",{className:"fw-bold",children:(0,l.dl)(null===R||void 0===R||null===(I=R.mainTotal)||void 0===I?void 0:I.convertednetwt,3)})]}),(0,c.jsxs)("p",{className:"fw-bold",children:[" TOTAL IN HKD :   ",(0,l.dl)(null===R||void 0===R?void 0:R.finalAmount,2),"  "]})]}),(0,c.jsx)("div",{className:"no_break my-1 text-end p-1 border ".concat(null===i||void 0===i?void 0:i.font_14),children:(0,c.jsxs)("p",{className:"fw-bold",children:[" TOTAL IN Hong Kong Dollar :    HK$ ",(0,l.dl)(null===R||void 0===R?void 0:R.finalAmount,2),"    "]})})]}):(0,c.jsx)("p",{className:"text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto",children:E})}},62906:(e,n,o)=>{!function(){"use strict";"object"==typeof self&&self.self===self&&self||"object"==typeof o.g&&o.g.global===o.g&&o.g;var d=9007199254740991;function l(e){return!("number"!=typeof e||e!=e||e===1/0||e===-1/0)}function i(e){return"number"==typeof e&&Math.abs(e)<=d}var t=/(hundred|thousand|(m|b|tr|quadr)illion)$/,r=/teen$/,a=/y$/,c=/(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)$/,s={zero:"zeroth",one:"first",two:"second",three:"third",four:"fourth",five:"fifth",six:"sixth",seven:"seventh",eight:"eighth",nine:"ninth",ten:"tenth",eleven:"eleventh",twelve:"twelfth"};function v(e){return t.test(e)||r.test(e)?e+"th":a.test(e)?e.replace(a,"ieth"):c.test(e)?e.replace(c,u):e}function u(e,n){return s[n]}var m=1e3,x=1e6,h=1e9,f=1e12,b=1e15,_=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"],N=["zero","ten","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];function p(e,n){var o,d=parseInt(e,10);if(!l(d))throw new TypeError("Not a finite number: "+e+" ("+typeof e+")");if(!i(d))throw new RangeError("Input is not a safe number, it\u2019s either too large or too small.");return o=function e(n){var o,d,l=arguments[1];return 0===n?l?l.join(" ").replace(/,$/,""):"zero":(l||(l=[]),n<0&&(l.push("minus"),n=Math.abs(n)),n<20?(o=0,d=_[n]):n<100?(o=n%10,d=N[Math.floor(n/10)],o&&(d+="-"+_[o],o=0)):n<m?(o=n%100,d=e(Math.floor(n/100))+" hundred"):n<x?(o=n%m,d=e(Math.floor(n/m))+" thousand,"):n<h?(o=n%x,d=e(Math.floor(n/x))+" million,"):n<f?(o=n%h,d=e(Math.floor(n/h))+" billion,"):n<b?(o=n%f,d=e(Math.floor(n/f))+" trillion,"):n<=9007199254740992&&(o=n%b,d=e(Math.floor(n/b))+" quadrillion,"),l.push(d),e(o,l))}(d),n?v(o):o}var j={toOrdinal:function(e){var n=parseInt(e,10);if(!l(n))throw new TypeError("Not a finite number: "+e+" ("+typeof e+")");if(!i(n))throw new RangeError("Input is not a safe number, it\u2019s either too large or too small.");var o=String(n),d=Math.abs(n%100),t=11<=d&&d<=13,r=o.charAt(o.length-1);return o+(t?"th":"1"===r?"st":"2"===r?"nd":"3"===r?"rd":"th")},toWords:p,toWordsOrdinal:function(e){return v(p(e))}};e.exports&&(n=e.exports=j),n.numberToWords=j}()}}]);
//# sourceMappingURL=1397.d79980b4.chunk.js.map