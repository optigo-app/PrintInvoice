"use strict";(self.webpackChunkinvoice=self.webpackChunkinvoice||[]).push([[8079],{99008:(e,l,i)=>{i.d(l,{M:()=>o});var d=i(46507);const o=e=>{e.target.src=d}},31553:(e,l,i)=>{i.r(l),i.d(l,{default:()=>_});var d=i(72791),o=i(1683),n=i(80444);const s={containerretailInvoice2:"retailInovice2_3_containerretailInvoice2__VgC2K",containerretailInvoice2_font:"retailInovice2_3_containerretailInvoice2_font__C-9Fp",terms:"retailInovice2_3_terms__Op075",font_16:"retailInovice2_3_font_16__-FY6C",font_13:"retailInovice2_3_font_13__yE8IO",font_13_head:"retailInovice2_3_font_13_head__Nkgi5",font_12:"retailInovice2_3_font_12__oXkQ6",font_12_head:"retailInovice2_3_font_12_head__MuNJF",discription_retailInvoice_2_3:"retailInovice2_3_discription_retailInvoice_2_3__Ixkhv",discription_retailInvoice_2_3_3:"retailInovice2_3_discription_retailInvoice_2_3_3__hd0H5",kt_retailInvoice_2_3:"retailInovice2_3_kt_retailInvoice_2_3__+7g3f",kt_retailInvoice_2_3_3:"retailInovice2_3_kt_retailInvoice_2_3_3__erYGX",diaWt_retailInvoice_2_3:"retailInovice2_3_diaWt_retailInvoice_2_3__OWhr3",gwt_retailInvoice_2_3:"retailInovice2_3_gwt_retailInvoice_2_3__T6NdG",metalRate_retailInvoice_2_3:"retailInovice2_3_metalRate_retailInvoice_2_3__RUDFQ",scheme_retailInvoice_2_3:"retailInovice2_3_scheme_retailInvoice_2_3__AB20O",scheme_retailInvoice_2_3_3:"retailInovice2_3_scheme_retailInvoice_2_3_3__Rswqm",dwt_retailInvoice_2_3:"retailInovice2_3_dwt_retailInvoice_2_3__AVMJi",dwt_retailInvoice_2_3_3:"retailInovice2_3_dwt_retailInvoice_2_3_3__oTYiA",gwt_retailInvoice_2_3_3:"retailInovice2_3_gwt_retailInvoice_2_3_3__BbeUv",diaWt_retailInvoice_2_3_3:"retailInovice2_3_diaWt_retailInvoice_2_3_3__x7ZQP",image_retailInvoice_2_3:"retailInovice2_3_image_retailInvoice_2_3__W6R86",img_retailInvoice_2_3:"retailInovice2_3_img_retailInvoice_2_3__SluIj",pad_end_retail_invoice_2_3:"retailInovice2_3_pad_end_retail_invoice_2_3__9F0dY",print_sec_sum4:"retailInovice2_3_print_sec_sum4__ATob6",printBtn_sec:"retailInovice2_3_printBtn_sec__iH1sP"};var t=i(85709),a=i(99008),c=(i(763),i(32323)),v=i(51914),r=i(80184);const _=e=>{let{token:l,invoiceNo:i,printName:_,urls:m,evn:u,ApiVer:x}=e;const[h,j]=(0,d.useState)(!0),[N,p]=(0,d.useState)(""),[b,I]=(0,d.useState)(null),[f,w]=(0,d.useState)({}),[y,g]=(0,d.useState)("retail invoice 3"===atob(_).toLowerCase()),[k,A]=(0,d.useState)([]),[W,C]=(0,d.useState)({Qty:0,grosswt:0,diaWt:0,csWt:0,miscWt:0,NetWt:0,UnitCost:0,DiscountAmt:0,TotalAmount:0}),[S,T]=(0,d.useState)([]),[D,P]=(0,d.useState)({valueAfterDiscount:0,netInvoiceValue:0,totalAmountPaid:0,balanceAmount:0}),[R,M]=(0,d.useState)([]),[B,L]=(0,d.useState)(0),[V,Z]=(0,d.useState)({}),[F,O]=(0,d.useState)(!0),[E,Q]=(0,d.useState)([]),[J,H]=(0,d.useState)({maxWidth:"120px",maxHeight:"95px",minHeight:"95px"});return(0,d.useEffect)((()=>{(async()=>{try{const e=await(0,o.k_)(l,i,_,m,u,x);if("200"===(null===e||void 0===e?void 0:e.Status)){(0,o.nK)(null===e||void 0===e?void 0:e.Data)?(j(!1),p("Data Not Found")):((e=>{var l;console.log(e);let i={...W},d=null===e||void 0===e?void 0:e.BillPrint_Json[0];w(d);let n=(0,o.Gt)(null===d||void 0===d?void 0:d.HeaderNo,d);I(n);let s=[],t=0;null===e||void 0===e||e.BillPrint_Json1.forEach(((l,d)=>{var n;let a=0,c=0,v=0,r=0,_="",m=0,u=0,x=0,h=0;t+=null===l||void 0===l?void 0:l.DiscountAmt;let j=0;null===e||void 0===e||e.BillPrint_Json2.forEach(((e,i)=>{(null===l||void 0===l?void 0:l.SrJobno)===(null===e||void 0===e?void 0:e.StockBarcode)&&(4===(null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeid)?(_=null===e||void 0===e?void 0:e.QualityName,x++,1===(null===e||void 0===e?void 0:e.IsPrimaryMetal)?(u+=null===e||void 0===e?void 0:e.Wt,r=null===e||void 0===e?void 0:e.Rate):h+=null===e||void 0===e?void 0:e.Amount):1===(null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeid)?a+=null===e||void 0===e?void 0:e.Wt:2===(null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeid)?c+=null===e||void 0===e?void 0:e.Wt:3===(null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeid)&&(v+=null===e||void 0===e?void 0:e.Wt),5===(null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeid)&&(j+=null===e||void 0===e?void 0:e.SettingAmount))}));let N=(0,o.zA)(null===e||void 0===e||null===(n=e.BillPrint_Json[0])||void 0===n?void 0:n.InvPayDet);M(N),console.log(N),m=1===x?(null===l||void 0===l?void 0:l.NetWt)+(null===l||void 0===l?void 0:l.LossWt):u,i.Qty+=null===l||void 0===l?void 0:l.Quantity,i.diaWt+=a,i.csWt+=c,i.miscWt+=v,i.NetWt+=m,i.grosswt+=null===l||void 0===l?void 0:l.grosswt,i.UnitCost+=(null===l||void 0===l?void 0:l.UnitCost)-h-j,i.DiscountAmt+=null===l||void 0===l?void 0:l.DiscountAmt,i.TotalAmount+=null===l||void 0===l?void 0:l.TotalAmount;let p={...l};p.diaWt=a,p.csWt=c,p.miscWt=v,p.metalRate=r,p.metalQuality=_,p.netWtLoss=m,p.findingAmount=j,p.secondaryMetalAmt=h,p.Qty=1,null===s||void 0===s||s.push(p)})),console.log(t),null===s||void 0===s||s.sort(((e,l)=>{var i,d,o,n;let s=(null===e||void 0===e||null===(i=e.designno)||void 0===i?void 0:i.toLowerCase())+(null===e||void 0===e||null===(d=e.SrJobno)||void 0===d?void 0:d.toLowerCase()),t=(null===l||void 0===l||null===(o=l.designno)||void 0===o?void 0:o.toLowerCase())+(null===l||void 0===l||null===(n=l.SrJobno)||void 0===n?void 0:n.toLowerCase());return s<t?-1:s>t?1:0})),A(s),C(i);let a=(0,o.xB)(d,null===i||void 0===i?void 0:i.TotalAmount);T(a);let c=a.reduce(((e,l)=>(e.tax+=+l.amount,e)),{tax:0}),v={...D},r=(null===i||void 0===i?void 0:i.TotalAmount)+(null===d||void 0===d?void 0:d.AddLess),_=r+(null===c||void 0===c?void 0:c.tax),m=(0,o.zA)(null===d||void 0===d?void 0:d.BankPayDet),u=m.reduce(((e,l)=>e+ +l.amount),0),x=(null===e||void 0===e||null===(l=e.BillPrint_Json[0])||void 0===l?void 0:l.CashReceived)+(null===m||void 0===m?void 0:m.reduce(((e,l)=>e+(null===l||void 0===l?void 0:l.amount)),0));L(x),v.valueAfterDiscount=r,v.netInvoiceValue=_,v.totalAmountPaid=u,v.balanceAmount=_-u,P(v),Q(m)})(null===e||void 0===e?void 0:e.Data),j(!1))}else j(!1),p(null===e||void 0===e?void 0:e.Message)}catch(e){console.error(e)}})();let e="retail invoice 3"===atob(_).toLowerCase(),d={...V};d.discription=e?null===s||void 0===s?void 0:s.discription_retailInvoice_2_3_3:null===s||void 0===s?void 0:s.discription_retailInvoice_2_3,d.kt=e?null===s||void 0===s?void 0:s.kt_retailInvoice_2_3_3:null===s||void 0===s?void 0:s.kt_retailInvoice_2_3,d.dwt=e?null===s||void 0===s?void 0:s.dwt_retailInvoice_2_3_3:null===s||void 0===s?void 0:s.dwt_retailInvoice_2_3,d.gwt=e?null===s||void 0===s?void 0:s.gwt_retailInvoice_2_3_3:null===s||void 0===s?void 0:s.gwt_retailInvoice_2_3,d.scheme=e?null===s||void 0===s?void 0:s.scheme_retailInvoice_2_3_3:null===s||void 0===s?void 0:s.scheme_retailInvoice_2_3,d.diaWt=e?null===s||void 0===s?void 0:s.diaWt_retailInvoice_2_3_3:null===s||void 0===s?void 0:s.diaWt_retailInvoice_2_3,Z(d)}),[]),h?(0,r.jsx)(n.Z,{}):""===N?(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)("div",{className:"container ".concat(null===s||void 0===s?void 0:s.containerretailInvoice2," pad_60_allPrint px-1 containerretailInvoice2 pt-1"),children:[(0,r.jsx)("div",{className:"".concat(null===s||void 0===s?void 0:s.printBtn_sec," text-end container pt-4 pb-4 px-0"),children:(0,r.jsx)("input",{type:"button",className:"btn_white blue me-0",value:"Print",onClick:e=>(0,o.Yj)(e)})}),(0,r.jsxs)("div",{className:"retailInvoice_2_3",children:[(0,r.jsx)("div",{className:"".concat(v.Z.headline," headerTitle target_header"),children:null===f||void 0===f?void 0:f.PrintHeadLabel}),(0,r.jsxs)("div",{className:"".concat(v.Z.companyDetails," target_header"),children:[(0,r.jsxs)("div",{className:"".concat(v.Z.companyhead," p-2"),children:[(0,r.jsx)("div",{className:v.Z.lines,style:{fontWeight:"bold"},children:null===f||void 0===f?void 0:f.CompanyFullName}),(0,r.jsx)("div",{className:v.Z.lines,children:null===f||void 0===f?void 0:f.CompanyAddress}),(0,r.jsx)("div",{className:v.Z.lines,children:null===f||void 0===f?void 0:f.CompanyAddress2}),(0,r.jsxs)("div",{className:v.Z.lines,children:[null===f||void 0===f?void 0:f.CompanyCity,"-",null===f||void 0===f?void 0:f.CompanyPinCode,",",null===f||void 0===f?void 0:f.CompanyState,"(",null===f||void 0===f?void 0:f.CompanyCountry,")"]}),(0,r.jsxs)("div",{className:v.Z.lines,children:["T ",null===f||void 0===f?void 0:f.CompanyTellNo,""!==(null===f||void 0===f?void 0:f.CompanyTollFreeNo)&&" | TOLL FREE ".concat(null===f||void 0===f?void 0:f.CompanyTollFreeNo)]}),(0,r.jsxs)("div",{className:v.Z.lines,children:[null===f||void 0===f?void 0:f.CompanyEmail," | ",null===f||void 0===f?void 0:f.CompanyWebsite]}),(0,r.jsxs)("div",{className:v.Z.lines,children:[null===f||void 0===f?void 0:f.Company_VAT_GST_No," | ",null===f||void 0===f?void 0:f.Company_CST_STATE,"-",null===f||void 0===f?void 0:f.Company_CST_STATE_No," | PAN-",null===f||void 0===f?void 0:f.Pannumber]})]}),(0,r.jsx)("div",{style:{width:"30%"},className:"d-flex justify-content-end align-item-center h-100",children:(0,r.jsx)(c.Z,{imageUrl:null===f||void 0===f?void 0:f.PrintLogo,styles:J})})]}),"                "]}),(0,r.jsxs)("div",{className:"".concat(null===s||void 0===s?void 0:s.containerretailInvoice2_font),children:[(0,r.jsxs)("div",{className:"d-flex justify-content-between pt-1 ".concat(null===s||void 0===s?void 0:s.font_13_head),children:[(0,r.jsxs)("div",{className:"col-3 border-black border py-2 px-1 d-flex",children:[(0,r.jsx)("div",{className:"col-4",children:(0,r.jsx)("p",{className:"fw-bold mb-0",children:"BILL NO: "})}),(0,r.jsx)("div",{className:"col-8",children:(0,r.jsx)("p",{className:"mb-0",children:null===f||void 0===f?void 0:f.InvoiceNo})})]}),(0,r.jsxs)("div",{className:"col-3 border-black border py-2 px-1 d-flex",children:[(0,r.jsx)("div",{className:"col-4",children:(0,r.jsx)("p",{className:"fw-bold mb-0",children:"HSN: "})}),(0,r.jsx)("div",{className:"col-8",children:(0,r.jsx)("p",{className:"mb-0",children:null===f||void 0===f?void 0:f.HSN_No})})]}),(0,r.jsxs)("div",{className:"col-3 border-black border py-2 px-1 d-flex",children:[(0,r.jsx)("div",{className:"col-4",children:(0,r.jsx)("p",{className:"fw-bold mb-0",children:"Date: "})}),(0,r.jsx)("div",{className:"col-8",children:(0,r.jsx)("p",{className:"mb-0",children:null===f||void 0===f?void 0:f.EntryDate})})]})]}),(0,r.jsx)("div",{className:"d-flex pt-2 w-100",children:(0,r.jsx)("div",{className:"border-black border pt-2 pb-1 px-1 w-100",children:(0,r.jsxs)("div",{className:"d-flex w-100",children:[(0,r.jsx)("div",{className:"pe-4",children:(0,r.jsx)("p",{className:"fw-bold mb-0 ".concat(null===s||void 0===s?void 0:s.font_13_head),children:"TO, "})}),(0,r.jsxs)("div",{children:[(0,r.jsx)("p",{className:"fw-bold mb-0 ".concat(null===s||void 0===s?void 0:s.font_12_head," pb-1"),children:null===f||void 0===f?void 0:f.CustName}),(0,r.jsx)("p",{className:"mb-0 ".concat(null===s||void 0===s?void 0:s.font_13_head),children:null===f||void 0===f?void 0:f.customerstreet}),(0,r.jsx)("p",{className:"mb-0 ".concat(null===s||void 0===s?void 0:s.font_13_head),children:null===f||void 0===f?void 0:f.customerAddress2}),(0,r.jsxs)("p",{className:"mb-0 ".concat(null===s||void 0===s?void 0:s.font_13_head),children:[null===f||void 0===f?void 0:f.customercity,null===f||void 0===f?void 0:f.customerpincode]})]})]})})}),(0,r.jsx)("div",{className:"d-flex w-100",children:(0,r.jsx)("div",{className:"border-black border-start border-end border-bottom py-2 px-1 w-100",children:(0,r.jsx)("p",{className:"fw-bold mb-0 ".concat(null===s||void 0===s?void 0:s.font_13),children:null===f||void 0===f?void 0:f.RetailInvoiceMsg})})}),(0,r.jsxs)("div",{className:"",children:[(0,r.jsxs)("div",{className:"border-black border-start border-end border-bottom p-1 w-100 d-flex ".concat(null===s||void 0===s?void 0:s.font_13),children:[(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.discription),style:{wordBreak:"normal"},children:(0,r.jsx)("p",{style:{wordBreak:"normal"},children:"Product Description"})}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.kt),children:(0,r.jsx)("p",{className:"text-center",children:"KT"})}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.kt),children:(0,r.jsx)("p",{className:"text-center",children:"Qty"})}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.gwt),children:(0,r.jsx)("p",{className:"text-center",children:"Gross Wt(gms)"})}),(0,r.jsxs)("div",{className:"".concat(null===V||void 0===V?void 0:V.diaWt),children:[(0,r.jsx)("p",{className:"text-center",children:"Dia Wt"}),(0,r.jsx)("p",{className:"text-center",children:"(gms/carat)"})]}),(0,r.jsxs)("div",{className:"".concat(null===V||void 0===V?void 0:V.dwt),children:[(0,r.jsx)("p",{className:"text-center",children:"Stone Wt"}),(0,r.jsx)("p",{className:"text-center",children:"(carat)"})]}),(0,r.jsxs)("div",{className:"".concat(null===V||void 0===V?void 0:V.dwt),children:[(0,r.jsx)("p",{className:"text-center",children:"Misc Wt"}),(0,r.jsx)("p",{className:"text-center",children:"(gms)"})]}),!y&&(0,r.jsx)("div",{className:"".concat(null===s||void 0===s?void 0:s.metalRate_retailInvoice_2_3),children:(0,r.jsx)("p",{className:"text-center",children:"Metal Rate"})}),(0,r.jsx)("div",{className:"".concat(null===s||void 0===s?void 0:s.metalRate_retailInvoice_2_3),children:(0,r.jsx)("p",{className:"text-center",children:"Net Wt(gms)"})}),(0,r.jsx)("div",{className:"".concat(null===s||void 0===s?void 0:s.metalRate_retailInvoice_2_3),children:(0,r.jsx)("p",{className:"text-center",children:"Price(Rs)"})}),!y&&(0,r.jsx)("div",{className:"".concat(null===s||void 0===s?void 0:s.image_retailInvoice_2_3),children:(0,r.jsx)("p",{className:"text-center",children:"Image"})}),!y&&(0,r.jsxs)("div",{className:"".concat(null===V||void 0===V?void 0:V.scheme),children:[(0,r.jsx)("p",{className:"text-center",children:"Scheme"}),(0,r.jsx)("p",{className:"text-center",children:"Discount"})]}),(0,r.jsxs)("div",{className:"".concat(null===V||void 0===V?void 0:V.scheme),children:[" ",!y&&(0,r.jsx)("p",{className:"text-center",children:"Scheme"}),(0,r.jsx)("p",{className:"text-center",children:"Discount(Rs)"})]}),(0,r.jsxs)("div",{className:"".concat(null===V||void 0===V?void 0:V.scheme),children:[(0,r.jsx)("p",{className:"text-end",children:"Product"}),(0,r.jsxs)("p",{className:"text-end",children:[" ",y?"Amount":"Value","(Rs)"]})]})]}),k.length>0&&k.map(((e,l)=>(0,r.jsxs)("div",{className:"border-black border-start border-end p-1 w-100 d-flex ".concat(null===s||void 0===s?void 0:s.font_13),children:[(0,r.jsxs)("div",{className:"".concat(null===V||void 0===V?void 0:V.discription),children:[(0,r.jsxs)("p",{style:{wordBreak:"normal"},children:[null===e||void 0===e?void 0:e.designno," ",null===e||void 0===e?void 0:e.SrJobno]}),(0,r.jsxs)("p",{style:{wordBreak:"normal"},children:[null===e||void 0===e?void 0:e.MetalPurity," ",null===e||void 0===e?void 0:e.Categoryname]})]}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.kt),children:(0,r.jsx)("p",{className:"text-center",children:null===e||void 0===e?void 0:e.MetalPurity})}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.kt),children:(0,r.jsx)("p",{className:"text-center",children:(0,o.dl)(null===e||void 0===e?void 0:e.Quantity,0)})}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.gwt),children:(0,r.jsx)("p",{className:"text-center",children:(0,o.dl)(null===e||void 0===e?void 0:e.grosswt,3)})}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.diaWt),children:(0,r.jsx)("p",{className:"text-center",children:(0,o.dl)(null===e||void 0===e?void 0:e.diaWt,3)})}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.dwt),children:(0,r.jsx)("p",{className:"text-center",children:(0,o.dl)(null===e||void 0===e?void 0:e.csWt,3)})}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.dwt),children:(0,r.jsx)("p",{className:"text-center",children:(0,o.dl)(null===e||void 0===e?void 0:e.miscWt,3)})}),!y&&(0,r.jsx)("div",{className:"".concat(null===s||void 0===s?void 0:s.metalRate_retailInvoice_2_3),children:(0,r.jsx)("p",{className:"text-center",children:(0,o.dl)(null===e||void 0===e?void 0:e.metalRate,2)})}),(0,r.jsx)("div",{className:"".concat(null===s||void 0===s?void 0:s.metalRate_retailInvoice_2_3),children:(0,r.jsx)("p",{className:"text-center",children:(0,o.dl)(null===e||void 0===e?void 0:e.netWtLoss,3)})}),(0,r.jsx)("div",{className:"".concat(null===s||void 0===s?void 0:s.metalRate_retailInvoice_2_3),children:(0,r.jsx)("p",{className:"text-center",children:(0,o.dl)((null===e||void 0===e?void 0:e.UnitCost)-(null===e||void 0===e?void 0:e.findingAmount)-(null===e||void 0===e?void 0:e.secondaryMetalAmt),2)})}),!y&&(0,r.jsx)("div",{className:"".concat(null===s||void 0===s?void 0:s.image_retailInvoice_2_3," "),children:(0,r.jsx)("img",{src:null===e||void 0===e?void 0:e.DesignImage,alt:"",className:"".concat(null===s||void 0===s?void 0:s.img_retailInvoice_2_3," w-100 mx-auto d-block"),style:{maxWidth:"50px",maxHeight:"50px"},onError:a.M})}),!y&&(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.scheme),children:(0,r.jsx)("p",{className:"text-center",children:0!==(null===e||void 0===e?void 0:e.Discount)?(0,r.jsxs)(r.Fragment,{children:[" ",(0,o.dl)(null===e||void 0===e?void 0:e.Discount,2),"% On Total Amount"]}):"-"})}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.scheme),children:(0,r.jsx)("p",{className:"text-center",children:(0,o.dl)(null===e||void 0===e?void 0:e.DiscountAmt,2)})}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.scheme),children:(0,r.jsx)("p",{className:"text-end",children:(0,o.dl)(null===e||void 0===e?void 0:e.TotalAmount,2)})})]},l))),(0,r.jsxs)("div",{className:"border-black border-start border-end  p-1 w-100 d-flex border-bottom ".concat(null===s||void 0===s?void 0:s.font_13),children:[(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.discription),children:(0,r.jsx)("p",{children:"Total"})}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.kt),children:(0,r.jsx)("p",{className:""})}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.kt),children:(0,r.jsx)("p",{className:"text-center",children:(0,o.dl)(null===W||void 0===W?void 0:W.Qty,0)})}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.gwt),children:(0,r.jsx)("p",{className:"text-center",children:(0,o.dl)(null===W||void 0===W?void 0:W.grosswt,3)})}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.diaWt),children:(0,r.jsx)("p",{className:"text-center",children:(0,o.dl)(null===W||void 0===W?void 0:W.diaWt,3)})}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.dwt),children:(0,r.jsx)("p",{className:"text-center",children:(0,o.dl)(null===W||void 0===W?void 0:W.csWt,3)})}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.dwt),children:(0,r.jsx)("p",{className:"text-center",children:(0,o.dl)(null===W||void 0===W?void 0:W.miscWt,3)})}),!y&&(0,r.jsx)("div",{className:"".concat(null===s||void 0===s?void 0:s.metalRate_retailInvoice_2_3),children:(0,r.jsx)("p",{className:"text-center"})}),(0,r.jsx)("div",{className:"".concat(null===s||void 0===s?void 0:s.metalRate_retailInvoice_2_3),children:(0,r.jsx)("p",{className:"text-center",children:(0,o.dl)(null===W||void 0===W?void 0:W.NetWt,3)})}),(0,r.jsx)("div",{className:"".concat(null===s||void 0===s?void 0:s.metalRate_retailInvoice_2_3),children:(0,r.jsx)("p",{className:"text-center",children:(0,o.dl)(null===W||void 0===W?void 0:W.UnitCost,2)})}),(0,r.jsx)("div",{className:"".concat(null===s||void 0===s?void 0:s.image_retailInvoice_2_3)}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.scheme),children:(0,r.jsx)("p",{className:"text-center"})}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.scheme),children:(0,r.jsx)("p",{className:"text-center",children:(0,o.dl)(null===W||void 0===W?void 0:W.DiscountAmt,2)})}),(0,r.jsx)("div",{className:"".concat(null===V||void 0===V?void 0:V.scheme),children:(0,r.jsx)("p",{className:"text-end",children:(0,o.dl)(null===W||void 0===W?void 0:W.TotalAmount,2)})})]}),(0,r.jsxs)("div",{className:"border-black border-start border-end border-bottom p-1 w-100 d-flex justify-content-end ".concat(null===s||void 0===s?void 0:s.font_13_head),children:[(0,r.jsx)("div",{className:"".concat(null===s||void 0===s?void 0:s.pad_end_retail_invoice_2_3),children:(0,r.jsx)("p",{children:"Product Total Value"})}),(0,r.jsx)("div",{children:(0,r.jsx)("p",{children:(0,o.dl)(null===W||void 0===W?void 0:W.TotalAmount,2)})})]}),(0,r.jsxs)("div",{className:"border-black border-start border-end border-bottom w-100 d-flex ".concat(null===s||void 0===s?void 0:s.font_13_head),children:[(0,r.jsxs)("div",{className:"col-6 border-black border-end",children:[(0,r.jsx)("p",{className:"fw-bold p-1",children:"Payment Details"}),(0,r.jsxs)("div",{className:"d-flex p-1 border-black border-bottom",children:[(0,r.jsx)("div",{className:"col-4",children:(0,r.jsx)("p",{children:"Payment Mode"})}),(0,r.jsx)("div",{className:"col-3",children:(0,r.jsx)("p",{children:"Doc no."})}),(0,r.jsx)("div",{className:"col-3",children:(0,r.jsx)("p",{children:"Customer Name"})}),(0,r.jsx)("div",{className:"col-2 text-end",children:(0,r.jsx)("p",{children:"Amount(Rs)"})})]}),0===(null===f||void 0===f?void 0:f.CashReceived)&&0===E.length&&(0,r.jsxs)("div",{className:"d-flex justify-content-between px-1 border-bottom border-black",children:[(0,r.jsx)("div",{className:"col-4",children:(0,r.jsx)("p",{children:"NA"})}),(0,r.jsx)("div",{className:"col-3",children:(0,r.jsx)("p",{})}),(0,r.jsx)("div",{className:"col-3",children:(0,r.jsx)("p",{})}),(0,r.jsx)("div",{className:"col-2 text-end",children:(0,r.jsx)("p",{children:"NA"})})]}),null===R||void 0===R?void 0:R.map(((e,l)=>(0,r.jsxs)("div",{className:"d-flex p-1 border-black border-bottom justify-content-between px-2",children:[(0,r.jsx)("div",{className:"col-4",children:(0,r.jsx)("p",{children:null===e||void 0===e?void 0:e.BankName})}),(0,r.jsx)("div",{className:"col-3",children:(0,r.jsx)("p",{children:null===e||void 0===e?void 0:e.label})}),(0,r.jsx)("div",{className:"col-3",children:(0,r.jsx)("p",{})}),(0,r.jsx)("div",{className:"col-2 text-end text-break",children:(0,r.jsx)("p",{className:"",children:(0,o.dl)(null===e||void 0===e?void 0:e.amount,2)})})]},l))),(0,r.jsxs)("div",{className:"d-flex p-1 border-black border-bottom justify-content-between",children:[(0,r.jsx)("div",{className:"col-4",children:(0,r.jsx)("p",{className:"fw-bold",children:"Total Amount Paid"})}),(0,r.jsx)("div",{className:"col-3",children:(0,r.jsx)("p",{className:"fw-bold"})}),(0,r.jsx)("div",{className:"col-3",children:(0,r.jsx)("p",{className:"fw-bold"})}),(0,r.jsx)("div",{className:"col-2 text-end",children:(0,r.jsx)("p",{className:"fw-bold",children:(0,o.dl)(null===R||void 0===R?void 0:R.reduce(((e,l)=>e+ +(null===l||void 0===l?void 0:l.amount)),0),2)})})]}),(0,r.jsxs)("div",{className:"d-flex p-1 justify-content-between",children:[(0,r.jsx)("div",{className:"col-4",children:(0,r.jsx)("p",{className:"fw-bold",children:"Balance Amount"})}),(0,r.jsx)("div",{className:"col-3",children:(0,r.jsx)("p",{className:"fw-bold"})}),(0,r.jsx)("div",{className:"col-3",children:(0,r.jsx)("p",{className:"fw-bold"})}),(0,r.jsx)("div",{className:"col-2 text-end",children:(0,r.jsx)("p",{className:"fw-bold",children:(0,o.dl)((null===D||void 0===D?void 0:D.netInvoiceValue)-(null===R||void 0===R?void 0:R.reduce(((e,l)=>e+ +(null===l||void 0===l?void 0:l.amount)),0)),2)})})]})]}),(0,r.jsxs)("div",{className:"col-6",children:[(0,r.jsxs)("div",{className:"d-flex border-black border-bottom justify-content-between p-1",children:[(0,r.jsx)("p",{children:"Total Value"}),(0,r.jsx)("p",{children:(0,o.dl)(null===W||void 0===W?void 0:W.TotalAmount,2)})]}),S.length>0&&S.map(((e,l)=>(0,r.jsxs)("div",{className:"d-flex border-black border-bottom justify-content-between p-1",children:[(0,r.jsxs)("p",{children:[null===e||void 0===e?void 0:e.name," @ ",null===e||void 0===e?void 0:e.per]}),(0,r.jsx)("p",{children:null===e||void 0===e?void 0:e.amount})]},l))),0!==(null===f||void 0===f?void 0:f.AddLess)&&(0,r.jsxs)("div",{className:"d-flex border-black border-bottom justify-content-between p-1",children:[(0,r.jsxs)("p",{children:[(null===f||void 0===f?void 0:f.AddLess)>0?"Add":"Less"," :- Other Discount"]}),(0,r.jsx)("p",{children:(0,o.dl)(Math.abs(null===f||void 0===f?void 0:f.AddLess),2)})]}),(0,r.jsxs)("div",{className:"d-flex border-black border-bottom justify-content-between p-1",children:[(0,r.jsx)("p",{children:"Value after Disocunt"}),(0,r.jsx)("p",{children:(0,o.dl)(null===D||void 0===D?void 0:D.valueAfterDiscount,2)})]}),(0,r.jsxs)("div",{className:"d-flex border-black border-bottom justify-content-between p-1",children:[(0,r.jsx)("p",{children:"Net Invoice Value"}),(0,r.jsx)("p",{children:(0,o.dl)(null===D||void 0===D?void 0:D.netInvoiceValue,2)})]}),(0,r.jsxs)("div",{className:"d-flex justify-content-between p-1",children:[(0,r.jsx)("p",{children:"Total Amount to be Paid"}),(0,r.jsx)("p",{children:(0,o.dl)(null===D||void 0===D?void 0:D.netInvoiceValue,2)})]})]})]}),(0,r.jsxs)("div",{className:"border-black border-bottom border-start w-100 d-flex ".concat(null===s||void 0===s?void 0:s.font_13_head),children:[(0,r.jsx)("div",{className:"col-6"}),(0,r.jsx)("div",{className:"col-6 border-black border-end",children:(0,r.jsx)("div",{className:"d-flex justify-content-between p-1",children:(0,r.jsxs)("p",{style:{wordBreak:"normal"},children:["Value In Words :- Rupees ",(0,o.uV)(+(0,o.OP)(null===D||void 0===D?void 0:D.netInvoiceValue,2))," Only"]})})})]}),(0,r.jsxs)("div",{className:"border-black border-start border-end border-bottom w-100 p-1  ".concat(null===s||void 0===s?void 0:s.terms),children:[(0,r.jsx)("p",{className:"fw-bold ".concat(null===s||void 0===s?void 0:s.font_13_head),children:"TERMS AND CONDITIONS:-"}),(0,r.jsx)("div",{dangerouslySetInnerHTML:{__html:null===f||void 0===f?void 0:f.Declaration},className:""})]})]}),(0,r.jsx)("div",{className:"retailInvoice_2_3_footer_Font_12 mt-1",children:(0,r.jsx)(t.Z,{data:f,className:""})})]})]})}):(0,r.jsx)("p",{className:"text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto",children:N})}}}]);
//# sourceMappingURL=8079.01955161.chunk.js.map