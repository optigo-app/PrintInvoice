"use strict";(self.webpackChunkinvoice=self.webpackChunkinvoice||[]).push([[2662],{26005:(e,s,l)=>{l.d(s,{n:()=>o});const o=(e,s)=>{let l=[];for(let d=0;d<(null===s||void 0===s?void 0:s.length);d+=e){var o;const a=null===s||void 0===s?void 0:s.slice(d,d+e);let i=e-(null===s||void 0===s||null===(o=s.slice(d,d+e))||void 0===o?void 0:o.length);null===l||void 0===l||l.push({data:a,length:i})}return l}},44663:(e,s,l)=>{l.d(s,{e:()=>d});var o=l(31243);const d=async e=>{try{var s,l,d;let a={SerialJobno:"".concat(null===e||void 0===e?void 0:e.jobno),customerid:"".concat(null===e||void 0===e?void 0:e.custid),BagPrintName:"".concat(null===e||void 0===e?void 0:e.printname)},i=JSON.stringify(a),c=btoa(i),t={con:'{"id":"","mode":"'.concat(null===e||void 0===e?void 0:e.printname,'","appuserid":"').concat(null===e||void 0===e?void 0:e.appuserid,'"}'),p:"".concat(c),f:"".concat(null===e||void 0===e?void 0:e.appuserid," ").concat(null===e||void 0===e?void 0:e.printname)},n=atob(null===e||void 0===e?void 0:e.url);const r=await o.Z.post(n,t,{headers:null===e||void 0===e?void 0:e.headers});let p=null===JSON||void 0===JSON?void 0:JSON.parse(null===r||void 0===r||null===(s=r.data)||void 0===s?void 0:s.d);const m=null===p||void 0===p||null===(l=p.rd)||void 0===l?void 0:l.sort(((e,s)=>{var l,o;return parseInt(null===e||void 0===e||null===(l=e.serialjobno)||void 0===l?void 0:l.split("/")[1],10)-parseInt(null===s||void 0===s||null===(o=s.serialjobno)||void 0===o?void 0:o.split("/")[1],10)})),v=null===p||void 0===p||null===(d=p.rd1)||void 0===d?void 0:d.sort(((e,s)=>{var l,o;return parseInt(null===e||void 0===e||null===(l=e.SerialJobno)||void 0===l?void 0:l.split("/")[1],10)-parseInt(null===s||void 0===s||null===(o=s.SerialJobno)||void 0===o?void 0:o.split("/")[1],10)}));return{rd:m,rd1:v}}catch(a){console.log(a)}}},22941:(e,s,l)=>{l.d(s,{E:()=>o});const o=e=>{var s;const l=null===e||void 0===e?void 0:e.split(","),o=[...new Set(l)];return null===o||void 0===o||null===(s=o.map((e=>"'".concat(e,"'"))))||void 0===s?void 0:s.join(",")}},99008:(e,s,l)=>{l.d(s,{M:()=>d});var o=l(46507);const d=e=>{e.target.src=o}},13752:(e,s,l)=>{l.d(s,{Y:()=>o});const o=e=>{e.preventDefault(),window.print()}},9886:(e,s,l)=>{l.d(s,{U:()=>d});const o=e=>{let s=null===e||void 0===e?void 0:e.trim();if("01 Jan 1900"===s)return"";{let e=null===s||void 0===s?void 0:s.slice(7,11);if("00"===(null===e||void 0===e?void 0:e.slice(2,4))){var l;const e=new Date(s),o=null===(l=String(null===e||void 0===e?void 0:e.getDate()))||void 0===l?void 0:l.padStart(2,"0"),d=null===e||void 0===e?void 0:e.toLocaleString("default",{month:"short"}),a=String(null===e||void 0===e?void 0:e.getFullYear());return"".concat(o).concat(d).concat(a)}{var o,d;const e=new Date(s),l=null===(o=String(null===e||void 0===e?void 0:e.getDate()))||void 0===o?void 0:o.padStart(2,"0"),a=null===e||void 0===e?void 0:e.toLocaleString("default",{month:"short"}),i=null===(d=String(null===e||void 0===e?void 0:e.getFullYear()))||void 0===d?void 0:d.slice(-2);return"".concat(l).concat(a).concat(i)}}},d=(e,s)=>{let l=[];return null===e||void 0===e||e.forEach(((e,d)=>{var a,i;let c={};c.rd={...e},c.rd.orderDatef=o(null===c||void 0===c||null===(a=c.rd)||void 0===a?void 0:a.OrderDate),c.rd.promiseDatef=o(null===c||void 0===c||null===(i=c.rd)||void 0===i?void 0:i.promisedate);let t=null===s||void 0===s?void 0:s.filter((s=>(null===s||void 0===s?void 0:s.SerialJobno)===(null===e||void 0===e?void 0:e.serialjobno)));c.rd1=t,null===l||void 0===l||l.push(c)})),l}},80310:(e,s,l)=>{l.d(s,{Z:()=>c});var o=l(72791),d=l(80330),a=l.n(d),i=l(80184);const c=e=>{let{data:s}=e;const l=(0,o.useRef)(null),[d,c]=(0,o.useState)("");(0,o.useEffect)((()=>{l.current&&a()(l.current,s)}),[s]);const t=(0,o.useRef)(null);return(0,o.useEffect)((()=>{(()=>{const e=t.current;if(e){e.getContext("2d").clearRect(0,0,e.width,e.height),a()(e,s,{format:"CODE128",displayValue:!0});const l=e.toDataURL("image/png");c(l)}})()}),[]),(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("canvas",{ref:t,className:"d_none"}),d&&(0,i.jsx)("img",{src:d,alt:"Barcode",className:"barcode_sticker",loading:"eager"})]})}},32100:(e,s,l)=>{l.r(s),l.d(s,{default:()=>A});var o=l(53573),d=l(72791),a=l(57689),i=l(80310),c=l(80444),t=l(44663),n=l(22941),r=l(99008),p=l(13752),m=l(9886),v=l(26005),h=l(1683),y=l(80184);const A=e=>{let{queries:s,headers:A}=e;const[x,u]=(0,d.useState)([]),j=(0,a.TH)(),f=o.Z.parse(j.search),N=(0,n.E)(null===f||void 0===f?void 0:f.str_srjobno);return(0,d.useEffect)((()=>{var e;0!==(null===(e=Object.keys(f))||void 0===e?void 0:e.length)&&atob(null===f||void 0===f?void 0:f.imagepath);(async()=>{try{const e=[],l={jobno:N,custid:null===s||void 0===s?void 0:s.custid,printname:null===s||void 0===s?void 0:s.printname,appuserid:null===s||void 0===s?void 0:s.appuserid,url:null===s||void 0===s?void 0:s.url,headers:A},o=await(0,t.e)(l);let d=(0,m.U)(null===o||void 0===o?void 0:o.rd,null===o||void 0===o?void 0:o.rd1);null===d||void 0===d||d.map((s=>{var l,o,d,a,i,c,t,n,r,p;let m=0,y={Shapename:"TOTAL",Sizename:"C TOTAL",ActualPcs:0,ActualWeight:0,MasterManagement_DiamondStoneTypeid:4},A={Shapename:"TOTAL",Sizename:"D TOTAL",ActualPcs:0,ActualWeight:0,MasterManagement_DiamondStoneTypeid:3},x={Shapename:"MISC TOTAL",Sizename:"MISC TOTAL",ActualPcs:0,ActualWeight:0,MasterManagement_DiamondStoneTypeid:7},u={Shapename:"TOTAL",Sizename:"F TOTAL",ActualPcs:0,ActualWeight:0,MasterManagement_DiamondStoneTypeid:5},j=[],N=[],w=[],b=[];null===s||void 0===s||null===(l=s.rd1)||void 0===l||l.map(((e,s)=>{"- - - "!==(null===e||void 0===e?void 0:e.ConcatedFullShapeQualityColorCode)&&m++,3===(null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeid)?(j.push(e),A.ActualPcs=A.ActualPcs+(null===e||void 0===e?void 0:e.ActualPcs),A.ActualWeight=A.ActualWeight+(null===e||void 0===e?void 0:e.ActualWeight)):4===(null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeid)?(N.push(e),y.ActualPcs=y.ActualPcs+(null===e||void 0===e?void 0:e.ActualPcs),y.ActualWeight=y.ActualWeight+(null===e||void 0===e?void 0:e.ActualWeight)):5===(null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeid)?(b.push(e),u.ActualPcs=u.ActualPcs+(null===e||void 0===e?void 0:e.ActualPcs),u.ActualWeight=u.ActualWeight+(null===e||void 0===e?void 0:e.ActualWeight)):7===(null===e||void 0===e?void 0:e.MasterManagement_DiamondStoneTypeid)&&(w.push(e),x.ActualPcs=x.ActualPcs+(null===e||void 0===e?void 0:e.ActualPcs),x.ActualWeight=x.ActualWeight+(null===e||void 0===e?void 0:e.ActualWeight))})),A.ActualPcs=+(null===(o=A.ActualPcs)||void 0===o?void 0:o.toFixed(3)),A.ActualWeight=+(null===(d=A.ActualWeight)||void 0===d?void 0:d.toFixed(3)),y.ActualPcs=+(null===(a=y.ActualPcs)||void 0===a?void 0:a.toFixed(3)),y.ActualWeight=+(null===(i=y.ActualWeight)||void 0===i?void 0:i.toFixed(3)),x.ActualPcs=+(null===(c=x.ActualPcs)||void 0===c?void 0:c.toFixed(3)),x.ActualWeight=+(null===(t=x.ActualWeight)||void 0===t?void 0:t.toFixed(3)),u.ActualPcs=+(null===(n=u.ActualPcs)||void 0===n?void 0:n.toFixed(3)),u.ActualWeight=+(null===(r=u.ActualWeight)||void 0===r?void 0:r.toFixed(3)),null===j||void 0===j||j.push(A),null===N||void 0===N||N.push(y),null===w||void 0===w||w.push(x),null===b||void 0===b||b.push(u);null===j||void 0===j||j.unshift({Shapename:"",Sizename:"Diamond Detail",ActualPcs:"",ActualWeight:"",MasterManagement_DiamondStoneTypeid:3}),null===N||void 0===N||N.unshift({Shapename:"",Sizename:"Colorstone Detail",ActualPcs:"",ActualWeight:"",MasterManagement_DiamondStoneTypeid:4}),null===w||void 0===w||w.unshift({Shapename:"",Sizename:"Misc Detail",ActualPcs:"",ActualWeight:"",MasterManagement_DiamondStoneTypeid:7}),null===b||void 0===b||b.unshift({Shapename:"",Sizename:"Finding Detail",ActualPcs:"",ActualWeight:"",MasterManagement_DiamondStoneTypeid:5});let g=(0,h.No)(j,N,w,[]),C=null===f||void 0===f?void 0:f.imagepath;C=atob(null===f||void 0===f?void 0:f.imagepath);let _=C+(null===s||void 0===s||null===(p=s.rd)||void 0===p?void 0:p.ThumbImagePath);const S=(0,v.n)(10,g);e.push({data:s,additional:{length:m,clr:y,dia:A,f:u,img:_,misc:x,pages:S}})})),u(e)}catch(e){console.log(e)}})()}),[]),(0,d.useEffect)((()=>{0!==(null===x||void 0===x?void 0:x.length)&&setTimeout((()=>{window.print()}),5e3)}),[null===x||void 0===x?void 0:x.length]),(0,y.jsx)(y.Fragment,{children:0===(null===x||void 0===x?void 0:x.length)?(0,y.jsx)(c.Z,{}):(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("div",{className:"d-flex justify-content-end align-items-center mt-3 me-5",children:(0,y.jsx)("button",{className:"btn_white blue print_btn",onClick:e=>(0,p.Y)(e),children:"Print"})}),(0,y.jsxs)("div",{className:"d-flex flex-wrap mb-5 pad_60_allPrint",children:[Array.from({length:null===s||void 0===s?void 0:s.pageStart},((e,s)=>s>0&&(0,y.jsx)("div",{className:"container7Acopy",style:{border:"0px"}},s))),(null===x||void 0===x?void 0:x.length)>0&&(null===x||void 0===x?void 0:x.map(((e,s)=>{var o,a,c,t,n,p,m,v,A,x,u,j,f,N,w,b,g,C,_,S,W,D,M,T,P,z,k,F,O,L,R,E,I,B,J,G,Z,H,K;return(0,y.jsx)(d.Fragment,{children:(null===e||void 0===e||null===(o=e.additional)||void 0===o||null===(a=o.pages)||void 0===a?void 0:a.length)>0?null===e||void 0===e||null===(c=e.additional)||void 0===c||null===(t=c.pages)||void 0===t?void 0:t.map(((s,o)=>{var a,c,t,n,p,m,v,A,x,u,j,f,N,w,b,g,C,_,S,W,D,M,T,P,z,k,F,O,L,R,E,I,B,J,G;return(0,y.jsx)(d.Fragment,{children:(0,y.jsxs)("div",{className:"container7Acopy ",children:[(0,y.jsxs)("div",{className:"head7Acopy",children:[(0,y.jsx)("div",{className:"headerdesc7Acopy",children:(0,y.jsxs)("div",{className:"headW7Acopy",children:[(0,y.jsxs)("div",{className:"jobno7Acopy",children:[(0,y.jsxs)("div",{className:"h-100 d-flex justify-content-center align-items-center",children:[(0,y.jsx)("span",{className:"fs20A fw-bold pe-1",children:"Odr Dt:"}),(0,y.jsx)("span",{className:"lh20A fs20A",children:null===e||void 0===e||null===(a=e.data)||void 0===a||null===(c=a.rd)||void 0===c?void 0:c.orderDatef})]}),(0,y.jsxs)("div",{className:"h-100 d-flex justify-content-center align-items-center",children:[(0,y.jsx)("span",{className:"fs20A fw-bold pe-1",children:"Due Dt:"}),(0,y.jsx)("span",{className:"lh20A fs20A",children:null===e||void 0===e||null===(t=e.data)||void 0===t||null===(n=t.rd)||void 0===n?void 0:n.promiseDatef})]}),(0,y.jsxs)("div",{className:"h-100 d-flex justify-content-center align-items-center",children:[(0,y.jsx)("span",{className:"fs20A fw-bold pe-1",children:"Party:"}),(0,y.jsx)("span",{className:"lh20A fs20A",children:null===e||void 0===e||null===(p=e.data)||void 0===p||null===(m=p.rd)||void 0===m||null===(v=m.CustomerCode)||void 0===v?void 0:v.slice(0,12)})]})]}),(0,y.jsxs)("div",{className:"barcodebag7Acopy",children:[(0,y.jsxs)("div",{style:{width:"45%"},children:[(0,y.jsxs)("div",{className:"h7Acopy fs7Acopy d-flex justify-content-between align-items-center w-100",children:[(0,y.jsx)("span",{className:"fs20A fw-bold h-100 d-flex justify-content-center align-items-center ",style:{fontSize:"10px",width:"38.5px"},children:"Bag No :"}),(0,y.jsx)("span",{className:"lh20A h-100 d-flex justify-content-center align-items-center fw-bold ",style:{width:"64px",fontSize:"11px"},children:null===e||void 0===e||null===(A=e.data)||void 0===A||null===(x=A.rd)||void 0===x||null===(u=x.serialjobno)||void 0===u?void 0:u.slice(0,9)})]}),(0,y.jsxs)("div",{className:"fs20A fs7Acopy d-flex justify-content-between align-items-center w-100",children:[(0,y.jsx)("span",{className:"fs7Acopy fw-bold h-100 d-flex justify-content-center align-items-center fw-bold",style:{fontSize:"10px",width:"38.5px"},children:"Dgn No :"}),(0,y.jsx)("span",{className:"fs20A lh20A h-100 d-flex justify-content-center align-items-center ps-1 fw-bold",style:{fontSize:"11px",width:"65px",lineHeight:"8.5px"},children:null===e||void 0===e||null===(j=e.data)||void 0===j||null===(f=j.rd)||void 0===f||null===(N=f.Designcode)||void 0===N?void 0:N.slice(0,20)})]})]}),(0,y.jsx)("div",{className:"barcodeGenerator7Acopy",style:{width:"55%"},children:(0,y.jsx)(i.Z,{data:null===e||void 0===e||null===(w=e.data)||void 0===w||null===(b=w.rd)||void 0===b?void 0:b.serialjobno})})]}),(0,y.jsxs)("div",{className:"remark7Acopy",children:[(0,y.jsxs)("div",{style:{width:"38.45mm",paddingLeft:"2px",paddingTop:"1px",maxHeight:"60px",overflow:"hidden"},children:[(0,y.jsx)("span",{className:"fs20A fw-bold",children:"Remark:"}),(0,y.jsx)("span",{className:"text-danger lh20A p-1",style:{fontSize:"8.6px"},children:" "+((null===e||void 0===e||null===(g=e.data)||void 0===g||null===(C=g.rd)||void 0===C||null===(_=C.ProductInstruction)||void 0===_?void 0:_.length)>0?(0,h.WW)(null===e||void 0===e||null===(S=e.data)||void 0===S||null===(W=S.rd)||void 0===W?void 0:W.ProductInstruction):(0,h.WW)(null===e||void 0===e||null===(D=e.data)||void 0===D||null===(M=D.rd)||void 0===M?void 0:M.QuoteRemark))})]}),(0,y.jsxs)("div",{className:"matinfo7Acopy",children:[(0,y.jsxs)("div",{className:"h327Acopy d-flex flex-column justify-content-between ",children:[(0,y.jsx)("span",{className:"fs20A h-100 d-flex justify-content-start align-items-center w-100",style:{fontSize:"7.5px"},children:"KT/CLR:"}),(0,y.jsxs)("span",{className:"fs20A h-100 d-flex justify-content-end align-items-center w-100 lh20A fw-bold",style:{fontSize:"10.5px",paddingRight:"2px"},children:[null===e||void 0===e||null===(T=e.data)||void 0===T||null===(P=T.rd)||void 0===P?void 0:P.MetalType," ",null===e||void 0===e||null===(z=e.data)||void 0===z||null===(k=z.rd)||void 0===k?void 0:k.MetalColorCo]})]}),(0,y.jsxs)("div",{className:"h327Acopy d-flex flex-column justify-content-between ",children:[(0,y.jsx)("span",{className:"fs20A h-100 d-flex justify-content-start align-items-center w-100",style:{fontSize:"7.5px"},children:"Size:"}),(0,y.jsx)("span",{className:"fs20A h-100 d-flex justify-content-end align-items-center w-100 lh20A fw-bold",style:{fontSize:"10.5px",paddingRight:"2px"},children:null===e||void 0===e||null===(F=e.data)||void 0===F||null===(O=F.rd)||void 0===O?void 0:O.Size})]}),(0,y.jsxs)("div",{className:"h327Acopy d-flex flex-column justify-content-between",style:{borderBottom:"0px"},children:[(0,y.jsx)("span",{className:"fs20A h-100 d-flex justify-content-start align-items-center w-100",style:{fontSize:"7.5px"},children:"Est Wt:"}),(0,y.jsx)("span",{className:"fs20A h-100 d-flex justify-content-end align-items-center w-100 lh20A fw-bold",style:{fontSize:"10.5px",paddingRight:"5px"},children:null===e||void 0===e||null===(L=e.data)||void 0===L||null===(R=L.rd)||void 0===R||null===(E=R.ActualGrossweight)||void 0===E?void 0:E.toFixed(3)})]})]})]})]})}),(0,y.jsxs)("div",{className:"img7Acopy",children:[" ",(0,y.jsx)("img",{src:""!==(null===e||void 0===e||null===(I=e.additional)||void 0===I?void 0:I.img)?null===e||void 0===e||null===(B=e.additional)||void 0===B?void 0:B.img:l(46507),id:"img7Acopy",alt:"",onError:e=>(0,r.M)(e),loading:"eager"})]})]}),(0,y.jsxs)("div",{className:"emptyTable7Acopy",children:[(0,y.jsxs)("div",{className:"thead7Acopy",children:[(0,y.jsx)("div",{style:{width:"9.86mm",minWidth:"9.86mm"},className:"headCol7Acopy border-start border-top border_color border_top_left_print7Acopy",children:"Dept."}),(0,y.jsx)("div",{style:{width:"12.16mm",minWidth:"12.16mm"},className:"headCol7Acopy border-top border_color",children:"Worker"}),(0,y.jsx)("div",{style:{width:"15.30mm",minWidth:"15.30mm"},className:"headCol7Acopy border-top border_color",children:"Metal In."}),(0,y.jsx)("div",{style:{width:"18.94mm",minWidth:"18.94mm"},className:"headCol7Acopy border-top border_color",children:"Ext. less."}),(0,y.jsx)("div",{style:{width:"15.07mm",minWidth:"15.07mm"},className:"headCol7Acopy border-top border_color",children:"Metal Out."}),(0,y.jsx)("div",{style:{width:"11.34mm",minWidth:"11.34mm"},className:"headCol7Acopy border-top border_color",children:"Diff"}),(0,y.jsx)("div",{style:{width:"9.89mm",borderRight:"0px"},className:"headCol7Acopy border-top border_color border_top_right_print7Acopy border-end",children:"Entry"})]}),(0,y.jsxs)("div",{className:"d-flex",children:[(0,y.jsxs)("div",{children:[(0,y.jsx)("div",{className:"wheadsep7Acopy border-start border_color fw-bold",children:"Grind"}),(0,y.jsx)("div",{className:"wheadsep7Acopy border-start border_color fw-bold",children:"Filli"}),(0,y.jsx)("div",{className:"wheadsep7Acopy border-start border_color fw-bold",children:"Buff."}),(0,y.jsx)("div",{className:"wheadsep7Acopy border-start border_color fw-bold",children:"Filli."}),(0,y.jsx)("div",{className:"wheadsep7Acopy border-start border_color fw-bold",children:"PPOL"}),(0,y.jsx)("div",{className:"wheadsep7Acopy border-start border_color fw-bold",children:"Sett."}),(0,y.jsx)("div",{className:"wheadsep7Acopy border-start border_color fw-bold",children:"M FN"}),(0,y.jsx)("div",{className:"wheadsep7Acopy border-start border_color fw-bold",children:"F POL"}),(0,y.jsx)("div",{className:"wheadsep7Acopy border-start border_color fw-bold",children:"Mina"}),(0,y.jsx)("div",{className:"wheadsep7Acopy border_color border-start border_bottom_left_print7Acopy fw-bold",children:"Other"})]}),(0,y.jsxs)("div",{children:[(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"})]}),(0,y.jsxs)("div",{children:[(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"})]}),(0,y.jsxs)("div",{children:[(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"})]}),(0,y.jsxs)("div",{children:[(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"})]}),(0,y.jsxs)("div",{children:[(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"})]}),(0,y.jsxs)("div",{children:[(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border-end border_color",style:{minWidth:"9.5mm !important"}}),(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border-end border_color"}),(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border-end border_color"}),(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border-end border_color"}),(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border-end border_color"}),(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border-end border_color"}),(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border-end border_color"}),(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border-end border_color"}),(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border-end border_color"}),(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border_bottom_right_print7Acopy border-end border_color"})]})]})]}),(0,y.jsxs)("div",{className:"footerEntry7Acopy",children:[(0,y.jsxs)("div",{className:"entry7Acopy",children:[(0,y.jsx)("div",{className:"entryCol7Acopy",children:"Cast 1:"}),(0,y.jsx)("div",{className:"entryCol7Acopy",children:"Cast 2:"}),(0,y.jsx)("div",{className:"entryCol7Acopy",children:"Lock:"}),(0,y.jsx)("div",{className:"entryCol7Acopy",children:"PTCK:"}),(0,y.jsx)("div",{className:"entryCol7Acopy",children:"Chain:"}),(0,y.jsx)("div",{className:"entryCol7Acopy",style:{borderBottom:"0px"},children:"Ex Mtl:"})]}),(0,y.jsx)("div",{className:"diacsentry7Acopy",children:(0,y.jsx)("div",{className:"fw-bold ps-1",children:(null===s||void 0===s||null===(J=s.data)||void 0===J?void 0:J.length)>0&&(null===s||void 0===s||null===(G=s.data)||void 0===G?void 0:G.map(((e,s)=>(0,y.jsxs)("div",{children:[" ","Diamond Detail"===(null===e||void 0===e?void 0:e.Sizename)||"Colorstone Detail"===(null===e||void 0===e?void 0:e.Sizename)||"Misc Detail"===(null===e||void 0===e?void 0:e.Sizename)?(0,y.jsx)("div",{className:"fs20A",style:{paddingTop:"1px",paddingBottom:"1px"},children:(null===e||void 0===e?void 0:e.Sizename)+" : "}):(0,y.jsx)(d.Fragment,{children:"C TOTAL"===(null===e||void 0===e?void 0:e.Sizename)||"D TOTAL"===(null===e||void 0===e?void 0:e.Sizename)||"MISC TOTAL"===(null===e||void 0===e?void 0:e.Sizename)?(0,y.jsxs)("div",{className:"fw-normal fs20A fw-bold",style:{fontSize:"9px"},children:[(null===e||void 0===e?void 0:e.Sizename)+" "," :"," ",(null===e||void 0===e?void 0:e.ActualPcs)+" "]}):(0,y.jsxs)("div",{className:"fw-normal fs20A",style:{fontSize:"9px"},children:[(null===e||void 0===e?void 0:e.Sizename)+" "," /"," ",(null===e||void 0===e?void 0:e.ActualPcs)+" "]})})]},s))))})}),(0,y.jsx)("div",{className:"emptybox7Acopy"})]}),(0,y.jsxs)("div",{className:"footercss7Acopy",children:[(0,y.jsxs)("div",{className:"footer7Acopy",children:[(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"16.10mm"},children:"Gross Wt."}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"18.00mm"},children:"Diamond"}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"18.00mm"},children:"Color Stone"}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"12.00mm"},children:"Misc"}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"12.00mm"},children:"Mina"}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"16.10mm",borderRight:"0px"},children:"Net Wt."})]}),(0,y.jsxs)("div",{className:"footer7Acopy brbnone7Acopy brl7Acopy1",children:[(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"16.10mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"18.00mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"18.00mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"12.00mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"12.00mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"16.10mm",borderRight:"0px"}})]}),(0,y.jsxs)("div",{className:"footer7Acopy brbnone7Acopy brl7Acopy2",style:{borderTop:"1px dashed #989898"},children:[" ",(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"16.10mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"18.00mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"18.00mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"12.00mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"12.00mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"16.10mm",borderRight:"0px"}})]})]})]})},o)})):(0,y.jsxs)("div",{className:"container7Acopy",children:[(0,y.jsxs)("div",{className:"head7Acopy",children:[(0,y.jsx)("div",{className:"headerdesc7Acopy",children:(0,y.jsxs)("div",{className:"headW7Acopy",children:[(0,y.jsxs)("div",{className:"jobno7Acopy",children:[(0,y.jsxs)("div",{children:[(0,y.jsx)("span",{className:"fs7Acopy fw-bold pe-1",children:"Odr Dt:"}),(0,y.jsx)("span",{className:"lh20A fs20A",children:null===e||void 0===e||null===(n=e.data)||void 0===n||null===(p=n.rd)||void 0===p?void 0:p.orderDatef})]}),(0,y.jsxs)("div",{children:[(0,y.jsx)("span",{className:"fs7Acopy fw-bold pe-1",children:"Due Dt:"}),(0,y.jsx)("span",{className:"lh20A fs20A",children:null===e||void 0===e||null===(m=e.data)||void 0===m||null===(v=m.rd)||void 0===v?void 0:v.promiseDatef})]}),(0,y.jsxs)("div",{className:"fs7Acopy",children:[(0,y.jsx)("span",{className:"fw-bold pe-1",children:"Party:"}),(0,y.jsx)("span",{className:"lh20A fs20A",children:null===e||void 0===e||null===(A=e.data)||void 0===A||null===(x=A.rd)||void 0===x||null===(u=x.CustomerCode)||void 0===u?void 0:u.slice(0,12)})]})]}),(0,y.jsxs)("div",{className:"barcodebag7Acopy",children:[(0,y.jsxs)("div",{style:{width:"45%"},children:[(0,y.jsxs)("div",{className:"h7Acopy fs7Acopy d-flex",children:[(0,y.jsx)("span",{className:" fw-bold h-100 d-flex justify-content-center align-items-center",style:{width:"38.5px",fontSize:"10px"},children:"Bag No:"}),(0,y.jsx)("span",{className:"fs7Acopy h-100 d-flex justify-content-center align-items-center fw-bold",style:{width:"64px",fontSize:"11px"},children:null===e||void 0===e||null===(j=e.data)||void 0===j||null===(f=j.rd)||void 0===f||null===(N=f.serialjobno)||void 0===N?void 0:N.slice(0,9)})]}),(0,y.jsxs)("div",{className:"h7Acopy fs7Acopy d-flex",children:[(0,y.jsx)("span",{className:" fw-bold h-100 d-flex justify-content-center align-items-center fw-bold",style:{width:"38.5px",fontSize:"10px"},children:"Dgn No:"}),(0,y.jsx)("span",{className:" h-100 d-flex justify-content-center align-items-center ps-1 fw-bold",style:{width:"64px",fontSize:"11px",lineHeight:"8.5px"},children:null===e||void 0===e||null===(w=e.data)||void 0===w||null===(b=w.rd)||void 0===b||null===(g=b.Designcode)||void 0===g?void 0:g.slice(0,21)})]})]}),(0,y.jsx)("div",{className:"barcodeGenerator7Acopy",children:(0,y.jsx)(i.Z,{data:null===e||void 0===e||null===(C=e.data)||void 0===C||null===(_=C.rd)||void 0===_?void 0:_.serialjobno})})]}),(0,y.jsxs)("div",{className:"remark7Acopy",children:[(0,y.jsxs)("div",{style:{width:"38.45mm",paddingLeft:"2px",paddingTop:"1px"},children:[(0,y.jsxs)("span",{className:"fw-bold fs20A",style:{fontSize:"8.6px"},children:[" ","Remark:"," "," "+((null===e||void 0===e||null===(S=e.data)||void 0===S||null===(W=S.rd)||void 0===W||null===(D=W.ProductInstruction)||void 0===D?void 0:D.length)>0?(0,h.WW)(null===e||void 0===e||null===(M=e.data)||void 0===M||null===(T=M.rd)||void 0===T?void 0:T.ProductInstruction):(0,h.WW)(null===e||void 0===e||null===(P=e.data)||void 0===P||null===(z=P.rd)||void 0===z?void 0:z.QuoteRemark))]})," ",(0,y.jsx)("span",{children:null===e||void 0===e||null===(k=e.data)||void 0===k||null===(F=k.rd)||void 0===F?void 0:F.remark})]}),(0,y.jsxs)("div",{className:"matinfo7Acopy",children:[(0,y.jsxs)("div",{className:"h327Acopy d-flex flex-column justify-content-between ",children:[(0,y.jsx)("span",{className:"fs20A h-100 d-flex justify-content-start align-items-center w-100",style:{fontSize:"7.5px"},children:"KT/CLR:"}),(0,y.jsxs)("span",{className:"fs20A h-100 d-flex justify-content-end align-items-center w-100 lh20A fw-bold",style:{fontSize:"10.5px",paddingRight:"2px"},children:[null===e||void 0===e||null===(O=e.data)||void 0===O||null===(L=O.rd)||void 0===L?void 0:L.MetalType," ",null===e||void 0===e||null===(R=e.data)||void 0===R||null===(E=R.rd)||void 0===E?void 0:E.MetalColorCo]})]}),(0,y.jsxs)("div",{className:"h327Acopy d-flex flex-column justify-content-between ",children:[(0,y.jsx)("span",{className:"fs20A h-100 d-flex justify-content-start align-items-center w-100",style:{fontSize:"7.5px"},children:"Size:"}),(0,y.jsx)("span",{className:"fs20A h-100 d-flex justify-content-end align-items-center w-100 lh20A fw-bold",style:{fontSize:"10.5px",paddingRight:"2px"},children:null===e||void 0===e||null===(I=e.data)||void 0===I||null===(B=I.rd)||void 0===B?void 0:B.Size})]}),(0,y.jsxs)("div",{className:"h327Acopy d-flex flex-column justify-content-between",style:{borderBottom:"0px"},children:[(0,y.jsx)("span",{className:"fs20A h-100 d-flex justify-content-start align-items-center w-100",style:{fontSize:"7.5px"},children:"Est Wt:"}),(0,y.jsx)("span",{className:"fs20A h-100 d-flex justify-content-end align-items-center w-100 lh20A fw-bold",style:{fontSize:"10.5px",paddingRight:"5px"},children:null===e||void 0===e||null===(J=e.data)||void 0===J||null===(G=J.rd)||void 0===G||null===(Z=G.ActualGrossweight)||void 0===Z?void 0:Z.toFixed(3)})]})]})]})]})}),(0,y.jsxs)("div",{className:"img7Acopy",children:[" ",(0,y.jsx)("img",{src:""!==(null===e||void 0===e||null===(H=e.additional)||void 0===H?void 0:H.img)?null===e||void 0===e||null===(K=e.additional)||void 0===K?void 0:K.img:l(46507),id:"img7Acopy",alt:"",onError:e=>(0,r.M)(e),loading:"eager"})]})]}),(0,y.jsxs)("div",{className:"emptyTable7Acopy",children:[(0,y.jsxs)("div",{className:"thead7Acopy",children:[(0,y.jsx)("div",{style:{width:"9.86mm",minWidth:"9.86mm"},className:"headCol7Acopy border-start border-top border_color border_top_left_print7Acopy",children:"Dept."}),(0,y.jsx)("div",{style:{width:"12.16mm",minWidth:"12.16mm"},className:"headCol7Acopy border-top border_color",children:"Worker"}),(0,y.jsx)("div",{style:{width:"15.30mm",minWidth:"15.30mm"},className:"headCol7Acopy border-top border_color",children:"Metal In."}),(0,y.jsx)("div",{style:{width:"18.94mm",minWidth:"18.94mm"},className:"headCol7Acopy border-top border_color",children:"Ext. less."}),(0,y.jsx)("div",{style:{width:"15.07mm",minWidth:"15.07mm"},className:"headCol7Acopy border-top border_color",children:"Metal Out."}),(0,y.jsx)("div",{style:{width:"11.34mm",minWidth:"11.34mm"},className:"headCol7Acopy border-top border_color",children:"Diff"}),(0,y.jsx)("div",{style:{width:"9.89mm",borderRight:"0px"},className:"headCol7Acopy border-top border_color border_top_right_print7Acopy border-end",children:"Entry"})]}),(0,y.jsxs)("div",{className:"d-flex",children:[(0,y.jsxs)("div",{children:[(0,y.jsx)("div",{className:"wheadsep7Acopy border-start border_color fw-bold",children:"Grind"}),(0,y.jsx)("div",{className:"wheadsep7Acopy border-start border_color fw-bold",children:"Filli"}),(0,y.jsx)("div",{className:"wheadsep7Acopy border-start border_color fw-bold",children:"Buff."}),(0,y.jsx)("div",{className:"wheadsep7Acopy border-start border_color fw-bold",children:"Filli."}),(0,y.jsx)("div",{className:"wheadsep7Acopy border-start border_color fw-bold",children:"PPOL"}),(0,y.jsx)("div",{className:"wheadsep7Acopy border-start border_color fw-bold",children:"Sett."}),(0,y.jsx)("div",{className:"wheadsep7Acopy border-start border_color fw-bold",children:"M FN"}),(0,y.jsx)("div",{className:"wheadsep7Acopy border-start border_color fw-bold",children:"F POL"}),(0,y.jsx)("div",{className:"wheadsep7Acopy border-start border_color fw-bold",children:"Mina"}),(0,y.jsx)("div",{className:"wheadsep7Acopy border_color border-start border_bottom_left_print7Acopy fw-bold ",children:"Other"})]}),(0,y.jsxs)("div",{children:[(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy worker7Acopy"})]}),(0,y.jsxs)("div",{children:[(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy metal7Acopy"})]}),(0,y.jsxs)("div",{children:[(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy ext7Acopy"})]}),(0,y.jsxs)("div",{children:[(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy mo7Acopy"})]}),(0,y.jsxs)("div",{children:[(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"}),(0,y.jsx)("div",{className:"wheadsep7Acopy diff7Acopy"})]}),(0,y.jsxs)("div",{children:[(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border-end border_color",style:{minWidth:"9.5mm !important"}}),(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border-end border_color"}),(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border-end border_color"}),(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border-end border_color"}),(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border-end border_color"}),(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border-end border_color"}),(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border-end border_color"}),(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border-end border_color"}),(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border-end border_color"}),(0,y.jsx)("div",{className:"wheadsep7Acopy enbrb7Acopy border_bottom_right_print7Acopy border-end border_color"})]})]})]}),(0,y.jsxs)("div",{className:"footerEntry7Acopy",children:[(0,y.jsxs)("div",{className:"entry7Acopy",children:[(0,y.jsx)("div",{className:"entryCol7Acopy",children:"Cast 1:"}),(0,y.jsx)("div",{className:"entryCol7Acopy",children:"Cast 2:"}),(0,y.jsx)("div",{className:"entryCol7Acopy",children:"Lock:"}),(0,y.jsx)("div",{className:"entryCol7Acopy",children:"PTCK:"}),(0,y.jsx)("div",{className:"entryCol7Acopy",children:"Chain:"}),(0,y.jsx)("div",{className:"entryCol7Acopy",style:{borderBottom:"0px"},children:"Ex Mtl:"})]}),(0,y.jsx)("div",{className:"diacsentry7Acopy",children:(0,y.jsx)("div",{className:"fw-bold pt-1 ps-1",children:"CS/ Dia Detail:"})}),(0,y.jsx)("div",{className:"emptybox7Acopy"})]}),(0,y.jsxs)("div",{className:"footercss7Acopy",children:[(0,y.jsxs)("div",{className:"footer7Acopy",children:[(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"16.10mm"},children:"Gross Wt."}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"18.00mm"},children:"Diamond"}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"18.00mm"},children:"Color Stone"}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"12.00mm"},children:"Misc"}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"12.00mm"},children:"Mina"}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"16.10mm",borderRight:"0px"},children:"Net Wt."})]}),(0,y.jsxs)("div",{className:"footer7Acopy brbnone7Acopy brl7Acopy1",children:[(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"16.10mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"18.00mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"18.00mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"12.00mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"12.00mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"16.10mm",borderRight:"0px"}})]}),(0,y.jsxs)("div",{className:"footer7Acopy brbnone7Acopy brl7Acopy2",style:{borderTop:"1px dashed #989898"},children:[" ",(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"16.10mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"18.00mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"18.00mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"12.00mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"12.00mm"}}),(0,y.jsx)("div",{className:"footerCol7Acopyall",style:{width:"16.10mm",borderRight:"0px"}})]})]})]})},s)})))]})]})})}}}]);
//# sourceMappingURL=2662.df401e5d.chunk.js.map