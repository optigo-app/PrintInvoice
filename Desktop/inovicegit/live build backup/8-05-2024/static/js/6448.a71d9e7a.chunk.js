"use strict";(self.webpackChunkinvoice=self.webpackChunkinvoice||[]).push([[6448],{44663:(e,d,i)=>{i.d(d,{e:()=>s});var l=i(31243);const s=async e=>{try{var d,i,s;let o={SerialJobno:"".concat(null===e||void 0===e?void 0:e.jobno),customerid:"".concat(null===e||void 0===e?void 0:e.custid),BagPrintName:"".concat(null===e||void 0===e?void 0:e.printname)},r=JSON.stringify(o),a=btoa(r),t={con:'{"id":"","mode":"'.concat(null===e||void 0===e?void 0:e.printname,'","appuserid":"').concat(null===e||void 0===e?void 0:e.appuserid,'"}'),p:"".concat(a),f:"".concat(null===e||void 0===e?void 0:e.appuserid," ").concat(null===e||void 0===e?void 0:e.printname)},n=atob(null===e||void 0===e?void 0:e.url);const _=await l.Z.post(n,t,{headers:null===e||void 0===e?void 0:e.headers});let c=null===JSON||void 0===JSON?void 0:JSON.parse(null===_||void 0===_||null===(d=_.data)||void 0===d?void 0:d.d);const v=null===c||void 0===c||null===(i=c.rd)||void 0===i?void 0:i.sort(((e,d)=>{var i,l;return parseInt(null===e||void 0===e||null===(i=e.serialjobno)||void 0===i?void 0:i.split("/")[1],10)-parseInt(null===d||void 0===d||null===(l=d.serialjobno)||void 0===l?void 0:l.split("/")[1],10)})),u=null===c||void 0===c||null===(s=c.rd1)||void 0===s?void 0:s.sort(((e,d)=>{var i,l;return parseInt(null===e||void 0===e||null===(i=e.SerialJobno)||void 0===i?void 0:i.split("/")[1],10)-parseInt(null===d||void 0===d||null===(l=d.SerialJobno)||void 0===l?void 0:l.split("/")[1],10)}));return{rd:v,rd1:u}}catch(o){console.log(o)}}},22941:(e,d,i)=>{i.d(d,{E:()=>l});const l=e=>{var d;const i=null===e||void 0===e?void 0:e.split(","),l=[...new Set(i)];return null===l||void 0===l||null===(d=l.map((e=>"'".concat(e,"'"))))||void 0===d?void 0:d.join(",")}},99008:(e,d,i)=>{i.d(d,{M:()=>s});var l=i(46507);const s=e=>{e.target.src=l}},13752:(e,d,i)=>{i.d(d,{Y:()=>l});const l=e=>{e.preventDefault(),window.print()}},9886:(e,d,i)=>{i.d(d,{U:()=>s});const l=e=>{let d=null===e||void 0===e?void 0:e.trim();if("01 Jan 1900"===d)return"";{let e=null===d||void 0===d?void 0:d.slice(7,11);if("00"===(null===e||void 0===e?void 0:e.slice(2,4))){var i;const e=new Date(d),l=null===(i=String(null===e||void 0===e?void 0:e.getDate()))||void 0===i?void 0:i.padStart(2,"0"),s=null===e||void 0===e?void 0:e.toLocaleString("default",{month:"short"}),o=String(null===e||void 0===e?void 0:e.getFullYear());return"".concat(l).concat(s).concat(o)}{var l,s;const e=new Date(d),i=null===(l=String(null===e||void 0===e?void 0:e.getDate()))||void 0===l?void 0:l.padStart(2,"0"),o=null===e||void 0===e?void 0:e.toLocaleString("default",{month:"short"}),r=null===(s=String(null===e||void 0===e?void 0:e.getFullYear()))||void 0===s?void 0:s.slice(-2);return"".concat(i).concat(o).concat(r)}}},s=(e,d)=>{let i=[];return null===e||void 0===e||e.forEach(((e,s)=>{var o,r;let a={};a.rd={...e},a.rd.orderDatef=l(null===a||void 0===a||null===(o=a.rd)||void 0===o?void 0:o.OrderDate),a.rd.promiseDatef=l(null===a||void 0===a||null===(r=a.rd)||void 0===r?void 0:r.promisedate);let t=null===d||void 0===d?void 0:d.filter((d=>(null===d||void 0===d?void 0:d.SerialJobno)===(null===e||void 0===e?void 0:e.serialjobno)));a.rd1=t,null===i||void 0===i||i.push(a)})),i}},80310:(e,d,i)=>{i.d(d,{Z:()=>a});var l=i(72791),s=i(80330),o=i.n(s),r=i(80184);const a=e=>{let{data:d}=e;const i=(0,l.useRef)(null),[s,a]=(0,l.useState)("");(0,l.useEffect)((()=>{i.current&&o()(i.current,d)}),[d]);const t=(0,l.useRef)(null);return(0,l.useEffect)((()=>{(()=>{const e=t.current;if(e){e.getContext("2d").clearRect(0,0,e.width,e.height),o()(e,d,{format:"CODE128",displayValue:!0});const i=e.toDataURL("image/png");a(i)}})()}),[]),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("canvas",{ref:t,className:"d_none"}),s&&(0,r.jsx)("img",{src:s,alt:"Barcode",className:"barcode_sticker",loading:"eager"})]})}},33200:(e,d,i)=>{i.r(d),i.d(d,{default:()=>h});var l=i(72791),s=i(80310),o=i(57689),r=i(53573),a=i(80444),t=i(44663),n=i(13752),_=i(99008),c=i(9886),v=i(22941),u=i(1683),A=i(80184);const h=e=>{let{queries:d,headers:i}=e;const[h,m]=(0,l.useState)([]),x=(0,o.TH)(),g=null===r.Z||void 0===r.Z?void 0:r.Z.parse(null===x||void 0===x?void 0:x.search),j=(0,v.E)(null===g||void 0===g?void 0:g.str_srjobno);return(0,l.useEffect)((()=>{var e;0!==(null===(e=Object.keys(g))||void 0===e?void 0:e.length)&&atob(null===g||void 0===g?void 0:g.imagepath);(async()=>{try{const e=[],l={jobno:j,custid:d.custid,printname:d.printname,appuserid:d.appuserid,url:d.url,headers:i},s=await(0,t.e)(l);let o=(0,c.U)(null===s||void 0===s?void 0:s.rd,null===s||void 0===s?void 0:s.rd1);null===o||void 0===o||o.map((d=>{var i,l,s;let o=[],r=0,a={Shapename:"TOTAL",Sizename:"",ActualPcs:0,ActualWeight:0},t={Shapename:"TOTAL",Sizename:"",ActualPcs:0,ActualWeight:0},n={Shapename:"TOTAL",Sizename:"",ActualPcs:0,ActualWeight:0},_={Shapename:"TOTAL",Sizename:"",ActualPcs:0,ActualWeight:0};null===d||void 0===d||null===(i=d.rd1)||void 0===i||i.map(((e,d)=>{"- - - "!==(null===e||void 0===e?void 0:e.ConcatedFullShapeQualityColorCode)&&r++,3===(null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeid)?(t.ActualPcs=t.ActualPcs+(null===e||void 0===e?void 0:e.ActualPcs),t.ActualWeight=t.ActualWeight+(null===e||void 0===e?void 0:e.ActualWeight)):4===(null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeid)?(a.ActualPcs=a.ActualPcs+(null===e||void 0===e?void 0:e.ActualPcs),a.ActualWeight=a.ActualWeight+(null===e||void 0===e?void 0:e.ActualWeight)):5===(null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeid)?(_.ActualPcs=_.ActualPcs+(null===e||void 0===e?void 0:e.ActualPcs),_.ActualWeight=_.ActualWeight+(null===e||void 0===e?void 0:e.ActualWeight)):7===(null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeid)&&(n.ActualPcs=n.ActualPcs+(null===e||void 0===e?void 0:e.ActualPcs),n.ActualWeight=n.ActualWeight+(null===e||void 0===e?void 0:e.ActualWeight))}));let c={...d},v=null===g||void 0===g?void 0:g.imagepath;v=atob(null===g||void 0===g?void 0:g.imagepath);let u=v+(null===d||void 0===d||null===(l=d.rd)||void 0===l?void 0:l.ThumbImagePath);for(let e=0;e<(null===d||void 0===d||null===(A=d.rd1)||void 0===A?void 0:A.length);e+=8){var A,h,m,x;const i=null===d||void 0===d||null===(h=d.rd1)||void 0===h?void 0:h.slice(e,e+8);let l=8-(null===d||void 0===d||null===(m=d.rd1)||void 0===m||null===(x=m.slice(e,e+8))||void 0===x?void 0:x.length);o.push({data:i,length:l})}let j=null===d||void 0===d||null===(s=d.rd1)||void 0===s?void 0:s.filter((e=>0!==(null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeid))),b=[...null===j||void 0===j?void 0:j.filter((e=>3===(null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeid))),...null===j||void 0===j?void 0:j.filter((e=>4===(null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeid)))],N=[];for(let e=0;e<(null===b||void 0===b?void 0:b.length);e+=8){const d=null===b||void 0===b?void 0:b.slice(e,e+8);let i=[];for(let e=0;e<(null===d||void 0===d?void 0:d.length);e+=4){const l=null===d||void 0===d?void 0:d.slice(e,e+4);let s=4-(null===l||void 0===l?void 0:l.length);i.push({data:l,length:s})}1===(null===i||void 0===i?void 0:i.length)&&i.push({data:[],length:4}),1!==N.length&&N.push(i)}e.push({data:c.rd,additional:{length:r,clr:a,dia:t,f:_,img:u,misc:n,page:o,pages:N}})})),m(e)}catch(e){console.log(e)}})()}),[]),(0,l.useEffect)((()=>{0!==(null===h||void 0===h?void 0:h.length)&&setTimeout((()=>{window.print()}),5e3)}),[h]),(0,A.jsx)(A.Fragment,{children:0===h.length?(0,A.jsx)(a.Z,{}):(0,A.jsx)(A.Fragment,{children:(0,A.jsxs)("section",{className:"print_12A",children:[(0,A.jsx)("div",{className:"print_btn d-flex justify-content-end",children:(0,A.jsx)("button",{className:"btn_white blue print_btn ",onClick:e=>(0,n.Y)(e),children:"Print"})}),(0,A.jsxs)("div",{className:"print_12A_flex pad_60_allPrint",children:[Array.from({length:null===d||void 0===d?void 0:d.pageStart},((e,d)=>d>0&&(0,A.jsx)("div",{className:"section_12A"},d))),(null===h||void 0===h?void 0:h.length)>0&&(null===h||void 0===h?void 0:h.map(((e,d)=>{var i,o,r,a,t,n,c,v,h,m,x,g,j,b,N,p,S,f,T,E,D,W,P,I,C,O;return(0,A.jsx)(l.Fragment,{children:(null===e||void 0===e||null===(i=e.additional)||void 0===i||null===(o=i.pages)||void 0===o?void 0:o.length)>0?null===e||void 0===e||null===(r=e.additional)||void 0===r||null===(a=r.pages)||void 0===a?void 0:a.map(((d,i)=>{var o,r,a,t,n,c,v,h,m,x,g,j,b,N,p,S,f,T,E,D,W,P;return(0,A.jsx)(l.Fragment,{children:(0,A.jsx)("div",{className:"section_12A",children:(0,A.jsxs)("div",{className:"container_12A",children:[(0,A.jsxs)("div",{className:"job_no_12A",children:[(0,A.jsxs)("div",{className:"design_no_12A bg12fs",children:["Bag#:",null===e||void 0===e||null===(o=e.data)||void 0===o?void 0:o.serialjobno]}),(0,A.jsx)("div",{className:"blank_12A"}),(0,A.jsxs)("div",{className:"design_m3_12A bg12fs",children:["Design#:",null===e||void 0===e||null===(r=e.data)||void 0===r?void 0:r.Designcode]})]}),(0,A.jsxs)("div",{className:"d_flex",children:[(0,A.jsxs)("div",{className:"order_no_sec_12A",children:[(0,A.jsxs)("div",{className:"order_no_12A border_bottom_2_12A",children:[(0,A.jsx)("div",{className:"order_no_text_12A border_right_2_12A",children:"ORDER NO."}),(0,A.jsx)("div",{className:"testing_text_12A border_right_2_12A",children:null===e||void 0===e||null===(a=e.data)||void 0===a?void 0:a.PO}),(0,A.jsx)("div",{className:"metal_col_12A border_right_2_12A",children:"METAL COL/KT"}),(0,A.jsxs)("div",{className:"gold_18k_12A border_right_2_12A",children:[null===e||void 0===e||null===(t=e.data)||void 0===t?void 0:t.MetalType," ",null===e||void 0===e||null===(n=e.data)||void 0===n?void 0:n.MetalColorCo]})]}),(0,A.jsxs)("div",{className:"order_no_12A border_bottom_2_12A",children:[(0,A.jsx)("div",{className:"order_no_text_12A border_right_2_12A",children:"ORDER DATE."}),(0,A.jsx)("div",{className:"testing_text_12A border_right_2_12A",children:null===e||void 0===e||null===(c=e.data)||void 0===c?void 0:c.OrderDate}),(0,A.jsx)("div",{className:"metal_col_12A border_right_2_12A",children:"GROSS WT"}),(0,A.jsx)("div",{className:"gold_18k_12A border_right_2_12A",children:null===e||void 0===e||null===(v=e.data)||void 0===v||null===(h=v.ActualGrossweight)||void 0===h?void 0:h.toFixed(3)})]}),(0,A.jsxs)("div",{className:"order_no_12A border_bottom_2_12A",children:[(0,A.jsx)("div",{className:"order_no_text_12A border_right_2_12A",children:"CLIENT CODE"}),(0,A.jsx)("div",{className:"testing_text_12A border_right_2_12A",children:null===e||void 0===e||null===(m=e.data)||void 0===m?void 0:m.CustomerCode}),(0,A.jsx)("div",{className:"metal_col_12A border_right_2_12A",children:"NET WT"}),(0,A.jsx)("div",{className:"gold_18k_12A border_right_2_12A",children:null===e||void 0===e||null===(x=e.data)||void 0===x||null===(g=x.netwt)||void 0===g?void 0:g.toFixed(3)})]}),(0,A.jsxs)("div",{className:"order_no_12A border_bottom_2_12A",children:[(0,A.jsx)("div",{className:"order_no_text_12A border_right_2_12A",children:"SIZE INST"}),(0,A.jsx)("div",{className:"testing_text_12A border_right_2_12A"}),(0,A.jsx)("div",{className:"metal_col_12A border_right_2_12A",children:"DIA PCS/WT"}),(0,A.jsxs)("div",{className:"gold_18k_12A border_right_2_12A",style:{paddingLeft:"0px"},children:[(0,A.jsx)("div",{style:{width:"40.5px",borderRight:"1px solid",height:"10px"}}),(0,A.jsx)("div",{})]})]}),(0,A.jsxs)("div",{className:"order_no_12A border_bottom_2_12A",children:[(0,A.jsx)("div",{className:"order_no_text_12A border_right_2_12A",children:"DEL. DATE"}),(0,A.jsx)("div",{className:"testing_text_12A border_right_2_12A",children:null===e||void 0===e||null===(j=e.data)||void 0===j?void 0:j.promisedate}),(0,A.jsx)("div",{className:"metal_col_12A border_right_2_12A",children:"CS PCS/WT"}),(0,A.jsxs)("div",{className:"gold_18k_12A border_right_2_12A",style:{paddingLeft:"0px"},children:[(0,A.jsx)("div",{style:{width:"40.5px",borderRight:"1px solid",height:"10px"}}),(0,A.jsx)("div",{})]})]})]}),(0,A.jsx)("div",{className:"img_sec_12A border_bottom_2_12A",children:(0,A.jsx)("img",{src:"http://zen/R50B3/UFS/ufs2/orail228FT0OWNGEI6DC3BVS/Design_Image/rxGjOQumr7MDE0NTIzMw==/Red_Medium/0145233_05082023173015962.jpg",onError:e=>(0,_.M)(e),alt:""})})]}),(0,A.jsx)("div",{className:"master_detail_12A border_bottom_2_12A",children:"Master detail"}),(0,A.jsx)("div",{className:"table_12A",children:(0,A.jsx)("div",{className:"master_sec_12A d_flex ",children:null===d||void 0===d?void 0:d.map(((e,d)=>{var i,l;return(0,A.jsxs)("div",{className:"",children:[(0,A.jsxs)("div",{className:"d_flex border_bottom_1_12A",children:[(0,A.jsx)("div",{className:"Item_sec_12A border_right_1_12A",children:"Item"}),(0,A.jsx)("div",{className:"Size_sec_12A border_right_1_12A",children:"Size"}),(0,A.jsx)("div",{className:"Pcs_sec_12A border_right_1_12A",children:"Pcs"}),(0,A.jsx)("div",{className:"Wt_sec_12A ".concat(0===d&&"border_right_1_12A"),children:"Wt"})]}),(null===e||void 0===e||null===(i=e.data)||void 0===i?void 0:i.length)>0&&(null===e||void 0===e||null===(l=e.data)||void 0===l?void 0:l.map(((e,i)=>(0,A.jsxs)("div",{className:"d_flex border_bottom_1_12A",children:[(0,A.jsx)("div",{className:"Item_sec_12A border_right_1_12A hide12A",children:null===e||void 0===e?void 0:e.Shapecode}),(0,A.jsx)("div",{className:"Size_sec_12A border_right_1_12A hide12A",children:null===e||void 0===e?void 0:e.Sizename}),(0,A.jsx)("div",{className:"Pcs_sec_12A border_right_1_12A hide12A",children:null===e||void 0===e?void 0:e.ActualPcs}),(0,A.jsx)("div",{className:"Wt_sec_12A ".concat(0===d&&"border_right_1_12A"," hide12A")})]},i)))),(null===e||void 0===e?void 0:e.length)>0&&Array.from({length:null===e||void 0===e?void 0:e.length},((e,i)=>(0,A.jsxs)("div",{className:" d_flex border_bottom_1_12A",children:[(0,A.jsx)("div",{className:"Item_sec_12A border_right_1_12A"}),(0,A.jsx)("div",{className:"Size_sec_12A border_right_1_12A"}),(0,A.jsx)("div",{className:"Pcs_sec_12A border_right_1_12A"}),(0,A.jsx)("div",{className:"Wt_sec_12A ".concat(0===d&&"border_right_1_12A")})]},i)))]},d)}))})}),(0,A.jsxs)("div",{className:"d_flex",children:[(0,A.jsxs)("div",{className:"dept_12A",children:[(0,A.jsxs)("div",{className:"dept_sec_12A border_bottom_1_12A",children:[(0,A.jsx)("div",{className:"dept_sec_text1_12A border_right_1_12A",children:"DEPT"}),(0,A.jsx)("div",{className:"issue_sec_12A border_right_1_12A",children:"ISSUE"}),(0,A.jsx)("div",{className:"ex_issue_sec_12A border_right_1_12A",children:"EX. ISSUE"}),(0,A.jsx)("div",{className:"receive_sec_12A border_right_1_12A",children:"RECV"}),(0,A.jsx)("div",{className:"ex_receive_sec_12A border_right_1_12A",children:"EX RECV"}),(0,A.jsx)("div",{className:"dust_sec_12A border_right_1_12A",children:"DUST"}),(0,A.jsx)("div",{className:"loss_sec_12A border_right_1_12A",children:"LOSS"})]}),Array.from({length:7},((e,d)=>(0,A.jsxs)("div",{className:"dept_sec_12A border_bottom_1_12A",children:[(0,A.jsx)("div",{className:"dept_sec_text1_12A border_right_1_12A"}),(0,A.jsx)("div",{className:"issue_sec_12A border_right_1_12A"}),(0,A.jsx)("div",{className:"ex_issue_sec_12A border_right_1_12A"}),(0,A.jsx)("div",{className:"receive_sec_12A border_right_1_12A"}),(0,A.jsx)("div",{className:"ex_receive_sec_12A border_right_1_12A"}),(0,A.jsx)("div",{className:"dust_sec_12A border_right_1_12A"}),(0,A.jsx)("div",{className:"loss_sec_12A border_right_1_12A"})]},"key".concat(d))))]}),(0,A.jsx)("div",{className:"barcode_12A border_bottom_1_12A",children:(0,A.jsx)(s.Z,{data:null===e||void 0===e||null===(b=e.data)||void 0===b?void 0:b.serialjobno})})]}),(0,A.jsx)("div",{className:"instruction_12A",children:(0,A.jsxs)("p",{children:["INST:",null===(N=" "+(0,u.WW)(null===e||void 0===e||null===(p=e.data)||void 0===p?void 0:p.officeuse)+" "+((null===e||void 0===e||null===(S=e.data)||void 0===S||null===(f=S.rd)||void 0===f||null===(T=f.ProductInstruction)||void 0===T?void 0:T.length)>0?(0,u.WW)(null===e||void 0===e||null===(E=e.data)||void 0===E||null===(D=E.rd)||void 0===D?void 0:D.ProductInstruction):(0,u.WW)(null===e||void 0===e||null===(W=e.data)||void 0===W||null===(P=W.rd)||void 0===P?void 0:P.QuoteRemark)))||void 0===N?void 0:N.slice(0,113)]})})]})})},i)})):(0,A.jsx)("div",{className:"section_12A",children:(0,A.jsxs)("div",{className:"container_12A",children:[(0,A.jsxs)("div",{className:"job_no_12A",children:[(0,A.jsxs)("div",{className:"design_no_12A",children:["Bag#:",null===e||void 0===e||null===(t=e.data)||void 0===t?void 0:t.serialjobno]}),(0,A.jsx)("div",{className:"blank_12A"}),(0,A.jsxs)("div",{className:"design_m3_12A",children:["Design#:",null===e||void 0===e||null===(n=e.data)||void 0===n?void 0:n.Designcode]})]}),(0,A.jsxs)("div",{className:"d_flex",children:[(0,A.jsxs)("div",{className:"order_no_sec_12A",children:[(0,A.jsxs)("div",{className:"order_no_12A border_bottom_2_12A",children:[(0,A.jsx)("div",{className:"order_no_text_12A border_right_2_12A",children:"ORDER NO."}),(0,A.jsx)("div",{className:"testing_text_12A border_right_2_12A",children:null===e||void 0===e||null===(c=e.data)||void 0===c?void 0:c.PO}),(0,A.jsx)("div",{className:"metal_col_12A border_right_2_12A",children:"METAL COL/KT"}),(0,A.jsxs)("div",{className:"gold_18k_12A border_right_2_12A",children:[null===e||void 0===e||null===(v=e.data)||void 0===v?void 0:v.MetalType," ",null===e||void 0===e||null===(h=e.data)||void 0===h?void 0:h.MetalColorCo]})]}),(0,A.jsxs)("div",{className:"order_no_12A border_bottom_2_12A",children:[(0,A.jsx)("div",{className:"order_no_text_12A border_right_2_12A",children:"ORDER DATE."}),(0,A.jsx)("div",{className:"testing_text_12A border_right_2_12A",children:null===e||void 0===e||null===(m=e.data)||void 0===m?void 0:m.OrderDate}),(0,A.jsx)("div",{className:"metal_col_12A border_right_2_12A",children:"GROSS WT"}),(0,A.jsx)("div",{className:"gold_18k_12A border_right_2_12A",children:null===e||void 0===e||null===(x=e.data)||void 0===x||null===(g=x.ActualGrossweight)||void 0===g?void 0:g.toFixed(3)})]}),(0,A.jsxs)("div",{className:"order_no_12A border_bottom_2_12A",children:[(0,A.jsx)("div",{className:"order_no_text_12A border_right_2_12A",children:"CLIENT CODE"}),(0,A.jsx)("div",{className:"testing_text_12A border_right_2_12A",children:null===e||void 0===e||null===(j=e.data)||void 0===j?void 0:j.CustomerCode}),(0,A.jsx)("div",{className:"metal_col_12A border_right_2_12A",children:"NET WT"}),(0,A.jsx)("div",{className:"gold_18k_12A border_right_2_12A",children:null===e||void 0===e||null===(b=e.data)||void 0===b||null===(N=b.netwt)||void 0===N?void 0:N.toFixed(3)})]}),(0,A.jsxs)("div",{className:"order_no_12A border_bottom_2_12A",children:[(0,A.jsx)("div",{className:"order_no_text_12A border_right_2_12A",children:"SIZE INST"}),(0,A.jsx)("div",{className:"testing_text_12A border_right_2_12A"}),(0,A.jsx)("div",{className:"metal_col_12A border_right_2_12A",children:"DIA PCS/WT"}),(0,A.jsx)("div",{className:"gold_18k_12A border_right_2_12A"})]}),(0,A.jsxs)("div",{className:"order_no_12A border_bottom_2_12A",children:[(0,A.jsx)("div",{className:"order_no_text_12A border_right_2_12A",children:"DEL. DATE"}),(0,A.jsx)("div",{className:"testing_text_12A border_right_2_12A",children:null===e||void 0===e||null===(p=e.data)||void 0===p?void 0:p.promisedate}),(0,A.jsx)("div",{className:"metal_col_12A border_right_2_12A",children:"CS PCS/WT"}),(0,A.jsx)("div",{className:"gold_18k_12A border_right_2_12A"})]})]}),(0,A.jsx)("div",{className:"img_sec_12A border_bottom_2_12A",children:(0,A.jsx)("img",{src:"http://zen/R50B3/UFS/ufs2/orail228FT0OWNGEI6DC3BVS/Design_Image/rxGjOQumr7MDE0NTIzMw==/Red_Medium/0145233_05082023173015962.jpg",onError:e=>(0,_.M)(e),alt:""})})]}),(0,A.jsx)("div",{className:"master_detail_12A border_bottom_2_12A",children:"Master detail"}),(0,A.jsxs)("div",{className:"table_12A t12A",children:[(0,A.jsxs)("div",{className:"w4A",children:[(0,A.jsx)("div",{className:"item12A bg12fs",children:"Item"}),(0,A.jsx)("div",{className:"size12A bg12fs",children:"Size"}),(0,A.jsx)("div",{className:"pcs12A bg12fs",children:"Pcs"}),(0,A.jsx)("div",{className:"wt12A bg12fs",children:"Wt"}),(0,A.jsx)("div",{className:"item12A bg12fs",children:"Item"}),(0,A.jsx)("div",{className:"size12A bg12fs",children:"Size"}),(0,A.jsx)("div",{className:"pcs12A bg12fs",children:"Pcs"}),(0,A.jsx)("div",{className:"wt12A bg12fs",style:{borderRight:"0px"},children:"Wt"})]}),Array.from({length:4},((e,d)=>(0,A.jsxs)("div",{className:"w4A",children:[(0,A.jsx)("div",{className:"item12A"}),(0,A.jsx)("div",{className:"size12A"}),(0,A.jsx)("div",{className:"pcs12A"}),(0,A.jsx)("div",{className:"wt12A"}),(0,A.jsx)("div",{className:"item12A"}),(0,A.jsx)("div",{className:"size12A"}),(0,A.jsx)("div",{className:"pcs12A"}),(0,A.jsx)("div",{className:"wt12A",style:{borderRight:"0px"}})]},d)))]}),(0,A.jsxs)("div",{className:"d_flex",children:[(0,A.jsxs)("div",{className:"dept_12A",children:[(0,A.jsxs)("div",{className:"dept_sec_12A border_bottom_1_12A",children:[(0,A.jsx)("div",{className:"dept_sec_text1_12A border_right_1_12A",children:"DEPT"}),(0,A.jsx)("div",{className:"issue_sec_12A border_right_1_12A",children:"ISSUE"}),(0,A.jsx)("div",{className:"ex_issue_sec_12A border_right_1_12A",children:"EX. ISSUE"}),(0,A.jsx)("div",{className:"receive_sec_12A border_right_1_12A",children:"RECV"}),(0,A.jsx)("div",{className:"ex_receive_sec_12A border_right_1_12A",children:"EX RECV"}),(0,A.jsx)("div",{className:"dust_sec_12A border_right_1_12A",children:"DUST"}),(0,A.jsx)("div",{className:"loss_sec_12A border_right_1_12A",children:"LOSS"})]}),Array.from({length:7},((e,d)=>(0,A.jsxs)("div",{className:"dept_sec_12A border_bottom_1_12A",children:[(0,A.jsx)("div",{className:"dept_sec_text1_12A border_right_1_12A"}),(0,A.jsx)("div",{className:"issue_sec_12A border_right_1_12A"}),(0,A.jsx)("div",{className:"ex_issue_sec_12A border_right_1_12A"}),(0,A.jsx)("div",{className:"receive_sec_12A border_right_1_12A"}),(0,A.jsx)("div",{className:"ex_receive_sec_12A border_right_1_12A"}),(0,A.jsx)("div",{className:"dust_sec_12A border_right_1_12A"}),(0,A.jsx)("div",{className:"loss_sec_12A border_right_1_12A"})]},"key".concat(d))))]}),(0,A.jsx)("div",{className:"barcode_12A border_bottom_1_12A",children:(0,A.jsx)(s.Z,{data:null===e||void 0===e||null===(S=e.data)||void 0===S?void 0:S.serialjobno})})]}),(0,A.jsx)("div",{className:"instruction_12A",children:(0,A.jsxs)("p",{children:["INST:",null===(f=" "+(0,u.WW)(null===e||void 0===e||null===(T=e.data)||void 0===T?void 0:T.officeuse)+" "+((null===e||void 0===e||null===(E=e.data)||void 0===E||null===(D=E.rd)||void 0===D||null===(W=D.ProductInstruction)||void 0===W?void 0:W.length)>0?(0,u.WW)(null===e||void 0===e||null===(P=e.data)||void 0===P||null===(I=P.rd)||void 0===I?void 0:I.ProductInstruction):(0,u.WW)(null===e||void 0===e||null===(C=e.data)||void 0===C||null===(O=C.rd)||void 0===O?void 0:O.QuoteRemark)))||void 0===f?void 0:f.slice(0,113)]})})]})})},d)})))]})]})})})}}}]);
//# sourceMappingURL=6448.a71d9e7a.chunk.js.map