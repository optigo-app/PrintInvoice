/*! For license information please see 3874.65f4189d.chunk.js.LICENSE.txt */
(self.webpackChunkinvoice=self.webpackChunkinvoice||[]).push([[3874],{41017:(e,l,i)=>{"use strict";i.r(l),i.d(l,{default:()=>v});var d=i(72791),n=i(1683),s=i(763),o=i(89995),t=i(80444),r=i(99318),a=i(80184);const v=e=>{var l,i,v,c,u,h,x,m,f,j,N,b,w,y,p,g,k,T,C,A,S,_,M,P,F,W;let{urls:I,token:D,invoiceNo:B,printName:E,evn:J,ApiVer:z}=e;const L=new r.ToWords,[O,R]=(0,d.useState)(null),[$,H]=(0,d.useState)(""),[Q,V]=(0,d.useState)(!0),[q,G]=(0,d.useState)(!0);return(0,d.useEffect)((()=>{(async()=>{try{const e=await(0,n.k_)(D,B,E,I,J,z);if("200"===(null===e||void 0===e?void 0:e.Status)){(0,n.nK)(null===e||void 0===e?void 0:e.Data)?(V(!1),H("Data Not Found")):(!function(e){var l,i;const d=s.cloneDeep(e);let n=null===d||void 0===d||null===(l=d.BillPrint_Json[0])||void 0===l||null===(i=l.Printlable)||void 0===i?void 0:i.split("\r\n");d.BillPrint_Json[0].address=n;const t=(0,o.g)(null===d||void 0===d?void 0:d.BillPrint_Json[0],null===d||void 0===d?void 0:d.BillPrint_Json1,null===d||void 0===d?void 0:d.BillPrint_Json2);R(t)}(null===e||void 0===e?void 0:e.Data),V(!1))}else V(!1),H(null===e||void 0===e?void 0:e.Message)}catch(e){console.error(e)}})()}),[]),(0,a.jsx)(a.Fragment,{children:Q?(0,a.jsx)(t.Z,{}):(0,a.jsx)(a.Fragment,{children:""===$?(0,a.jsx)("div",{children:(0,a.jsxs)("div",{className:"container7s mb-5 pb-5",children:[(0,a.jsx)("div",{className:"mt-5 mb-3 d-flex justify-content-end align-items-center HSDivs7",children:(0,a.jsx)("button",{className:"btn_white blue",onClick:()=>(0,n.Yj)(),children:"Print"})}),(0,a.jsx)("div",{className:"d-flex justify-content-end ",children:(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{className:"fw-bold d-flex justify-content-end",children:null===O||void 0===O||null===(l=O.header)||void 0===l?void 0:l.CompanyFullName}),(0,a.jsx)("div",{className:"d-flex justify-content-end",children:null===O||void 0===O||null===(i=O.header)||void 0===i?void 0:i.CompanyAddress}),(0,a.jsxs)("div",{className:"d-flex justify-content-end",children:[null===O||void 0===O||null===(v=O.header)||void 0===v?void 0:v.CompanyCity,"-",null===O||void 0===O||null===(c=O.header)||void 0===c?void 0:c.CompanyPinCode]}),(0,a.jsx)("div",{className:"d-flex justify-content-end",children:null===O||void 0===O||null===(u=O.header)||void 0===u?void 0:u.Company_VAT_GST_No})]})}),(0,a.jsx)("div",{className:"border-top border-bottom border-black text-center fw-bold fs-5",children:"TAX INVOICE"}),(0,a.jsxs)("div",{className:"border-bottom border-black py-1",children:[(0,a.jsxs)("div",{className:"d-flex",children:[(0,a.jsx)("div",{className:"w-50",children:"Invoice No : "}),(0,a.jsx)("div",{className:"w-50 fw-bold",children:null===O||void 0===O||null===(h=O.header)||void 0===h?void 0:h.InvoiceNo})]}),(0,a.jsxs)("div",{className:"d-flex",children:[(0,a.jsx)("div",{className:"w-50",children:"Date : "}),(0,a.jsx)("div",{className:"w-50 fw-bold",children:null===O||void 0===O||null===(x=O.header)||void 0===x?void 0:x.EntryDate})]}),(0,a.jsxs)("div",{className:"d-flex",children:[(0,a.jsx)("div",{className:"w-50",children:"HSN Code : "}),(0,a.jsx)("div",{className:"w-50 fw-bold",children:null===O||void 0===O||null===(m=O.header)||void 0===m?void 0:m.HSN_No})]}),(0,a.jsxs)("div",{className:"d-flex",children:[(0,a.jsx)("div",{className:"w-50",children:"Cashier : "}),(0,a.jsx)("div",{className:"w-50 fw-bold",children:null===O||void 0===O||null===(f=O.header)||void 0===f||null===(j=f.SalPerName)||void 0===j?void 0:j.split(" ")[0]})]})]}),(0,a.jsxs)("div",{className:"border-bottom border-black",children:[(0,a.jsxs)("div",{className:"d-flex",children:[(0,a.jsx)("div",{className:"w-50",children:"Customer Name:"}),(0,a.jsx)("div",{className:"fw-bold w-50",children:null===O||void 0===O||null===(N=O.header)||void 0===N?void 0:N.customerfirmname})]}),(0,a.jsxs)("div",{className:"d-flex",children:[(0,a.jsx)("div",{className:"w-50",children:"Customer Mobile:"}),(0,a.jsx)("div",{className:"fw-bold w-50",children:null===O||void 0===O||null===(b=O.header)||void 0===b?void 0:b.customermobileno})]})]}),(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{className:"fw-bold d-flex",children:[(0,a.jsx)("div",{className:"col1s7",children:"Sr#"}),(0,a.jsxs)("div",{className:"col2s7",children:[(0,a.jsx)("div",{children:"Job#"}),(0,a.jsx)("div",{children:"Design#"}),(0,a.jsx)("div",{children:"Product"})]}),(0,a.jsxs)("div",{className:"col3s7",children:[(0,a.jsx)("div",{children:"Net Wt"}),(0,a.jsx)("div",{children:"GrossWt"}),(0,a.jsx)("div",{children:"StoneWt"})]}),(0,a.jsx)("div",{className:"col4s7",children:"Qty"}),(0,a.jsx)("div",{className:"col5s7 d-flex justify-content-end pe-2",children:"MRP"})]}),(0,a.jsxs)("div",{children:[null===O||void 0===O||null===(w=O.resultArray)||void 0===w?void 0:w.map(((e,l)=>{var i,d,s,o,t;return(0,a.jsxs)("div",{className:"d-flex py-2 pbias7",children:[(0,a.jsx)("div",{className:"col1s7",children:null===e||void 0===e?void 0:e.SrNo}),(0,a.jsxs)("div",{className:"col2s7",children:[(0,a.jsx)("div",{children:null===e||void 0===e?void 0:e.SrJobno}),(0,a.jsx)("div",{children:null===e||void 0===e?void 0:e.designno}),(0,a.jsx)("div",{style:{wordBreak:"break-word"},children:null===e||void 0===e?void 0:e.Categoryname})]}),(0,a.jsxs)("div",{className:"col3s7",children:[(0,a.jsx)("div",{children:null===e||void 0===e||null===(i=e.NetWt)||void 0===i?void 0:i.toFixed(3)}),(0,a.jsx)("div",{children:null===e||void 0===e||null===(d=e.grosswt)||void 0===d?void 0:d.toFixed(3)}),(0,a.jsx)("div",{children:null===e||void 0===e||null===(s=e.totals)||void 0===s||null===(o=s.misc)||void 0===o||null===(t=o.Wt)||void 0===t?void 0:t.toFixed(3)})]}),(0,a.jsx)("div",{className:"col4s7",children:null===e||void 0===e?void 0:e.Quantity}),(0,a.jsx)("div",{className:"col5s7 d-flex justify-content-end pe-2",children:(0,n.dN)(null===e||void 0===e?void 0:e.TotalAmount)})]},l)})),(0,a.jsxs)("div",{className:"d-flex border-black border-top border-bottom",children:[(0,a.jsx)("div",{className:"col1s7"}),(0,a.jsx)("div",{className:"col2s7 fw-bold",children:"TOTAL"}),(0,a.jsxs)("div",{className:"col3s7",children:[(0,a.jsx)("div",{children:null===O||void 0===O||null===(y=O.mainTotal)||void 0===y||null===(p=y.netwt)||void 0===p?void 0:p.toFixed(3)}),(0,a.jsx)("div",{children:null===O||void 0===O||null===(g=O.mainTotal)||void 0===g||null===(k=g.grosswt)||void 0===k?void 0:k.toFixed(3)}),(0,a.jsx)("div",{children:null===O||void 0===O||null===(T=O.mainTotal)||void 0===T||null===(C=T.misc)||void 0===C||null===(A=C.Wt)||void 0===A?void 0:A.toFixed(3)})]}),(0,a.jsx)("div",{className:"col4s7",children:null===O||void 0===O||null===(S=O.mainTotal)||void 0===S?void 0:S.total_Quantity}),(0,a.jsx)("div",{className:"col5s7 d-flex justify-content-end pe-2",children:(0,n.dN)(null===O||void 0===O||null===(_=O.mainTotal)||void 0===_?void 0:_.total_amount)})]}),(0,a.jsx)("div",{className:"border-bottom border-black pbias7",children:(0,a.jsx)("div",{className:"d-flex justify-content-end",children:(0,a.jsxs)("div",{style:{width:"70%"},children:[null===O||void 0===O||null===(M=O.allTaxes)||void 0===M?void 0:M.map(((e,l)=>(0,a.jsxs)("div",{className:"d-flex",children:[(0,a.jsxs)("div",{className:"w-50 d-flex justify-content-end",children:[null===e||void 0===e?void 0:e.name," @ ",null===e||void 0===e?void 0:e.per]}),(0,a.jsx)("div",{className:"w-50 d-flex justify-content-end",children:null===e||void 0===e?void 0:e.amount})]},l))),(0,a.jsxs)("div",{className:"d-flex",children:[(0,a.jsx)("div",{className:"w-50 d-flex justify-content-end",children:(null===O||void 0===O||null===(P=O.header)||void 0===P?void 0:P.AddLess)>0?"Add":"Less"}),(0,a.jsx)("div",{className:"w-50 d-flex justify-content-end",children:null===O||void 0===O||null===(F=O.header)||void 0===F?void 0:F.AddLess})]})]})})}),(0,a.jsxs)("div",{className:"fw-bold border-black border-bottom pbias7",children:[(0,a.jsxs)("div",{className:"d-flex justify-content-end",children:["Final Amount:Rs.",(0,n.dN)(null===O||void 0===O?void 0:O.finalAmount)]}),(0,a.jsxs)("div",{className:"d-flex justify-content-end",children:["Payable Amount:Rs.",(0,n.dN)(null===O||void 0===O?void 0:O.finalAmount)]}),(0,a.jsxs)("div",{className:"fw-normal",style:{wordBreak:"break-word"},children:["In Words : ",L.convert(null===O||void 0===O?void 0:O.finalAmount)," Only"]})]}),(0,a.jsxs)("div",{className:"fw-bold pbias7",children:[(0,a.jsx)("div",{children:"Terms & Conditions :"}),(0,a.jsx)("div",{style:{wordBreak:"break-word"},dangerouslySetInnerHTML:{__html:null===O||void 0===O||null===(W=O.header)||void 0===W?void 0:W.Declaration}})]})]})]})]})}):(0,a.jsx)("p",{className:"text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto",children:$})})})}},62906:(e,l,i)=>{!function(){"use strict";"object"==typeof self&&self.self===self&&self||"object"==typeof i.g&&i.g.global===i.g&&i.g;var d=9007199254740991;function n(e){return!("number"!=typeof e||e!=e||e===1/0||e===-1/0)}function s(e){return"number"==typeof e&&Math.abs(e)<=d}var o=/(hundred|thousand|(m|b|tr|quadr)illion)$/,t=/teen$/,r=/y$/,a=/(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)$/,v={zero:"zeroth",one:"first",two:"second",three:"third",four:"fourth",five:"fifth",six:"sixth",seven:"seventh",eight:"eighth",nine:"ninth",ten:"tenth",eleven:"eleventh",twelve:"twelfth"};function c(e){return o.test(e)||t.test(e)?e+"th":r.test(e)?e.replace(r,"ieth"):a.test(e)?e.replace(a,u):e}function u(e,l){return v[l]}var h=1e3,x=1e6,m=1e9,f=1e12,j=1e15,N=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"],b=["zero","ten","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];function w(e,l){var i,d=parseInt(e,10);if(!n(d))throw new TypeError("Not a finite number: "+e+" ("+typeof e+")");if(!s(d))throw new RangeError("Input is not a safe number, it\u2019s either too large or too small.");return i=function e(l){var i,d,n=arguments[1];return 0===l?n?n.join(" ").replace(/,$/,""):"zero":(n||(n=[]),l<0&&(n.push("minus"),l=Math.abs(l)),l<20?(i=0,d=N[l]):l<100?(i=l%10,d=b[Math.floor(l/10)],i&&(d+="-"+N[i],i=0)):l<h?(i=l%100,d=e(Math.floor(l/100))+" hundred"):l<x?(i=l%h,d=e(Math.floor(l/h))+" thousand,"):l<m?(i=l%x,d=e(Math.floor(l/x))+" million,"):l<f?(i=l%m,d=e(Math.floor(l/m))+" billion,"):l<j?(i=l%f,d=e(Math.floor(l/f))+" trillion,"):l<=9007199254740992&&(i=l%j,d=e(Math.floor(l/j))+" quadrillion,"),n.push(d),e(i,n))}(d),l?c(i):i}var y={toOrdinal:function(e){var l=parseInt(e,10);if(!n(l))throw new TypeError("Not a finite number: "+e+" ("+typeof e+")");if(!s(l))throw new RangeError("Input is not a safe number, it\u2019s either too large or too small.");var i=String(l),d=Math.abs(l%100),o=11<=d&&d<=13,t=i.charAt(i.length-1);return i+(o?"th":"1"===t?"st":"2"===t?"nd":"3"===t?"rd":"th")},toWords:w,toWordsOrdinal:function(e){return c(w(e))}};e.exports&&(l=e.exports=y),l.numberToWords=y}()}}]);
//# sourceMappingURL=3874.65f4189d.chunk.js.map