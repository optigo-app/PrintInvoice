"use strict";(self.webpackChunkinvoice=self.webpackChunkinvoice||[]).push([[6219],{26005:(l,d,i)=>{i.d(d,{n:()=>e});const e=(l,d)=>{let i=[];for(let a=0;a<(null===d||void 0===d?void 0:d.length);a+=l){var e;const s=null===d||void 0===d?void 0:d.slice(a,a+l);let o=l-(null===d||void 0===d||null===(e=d.slice(a,a+l))||void 0===e?void 0:e.length);null===i||void 0===i||i.push({data:s,length:o})}return i}},44663:(l,d,i)=>{i.d(d,{e:()=>a});var e=i(31243);const a=async l=>{try{var d,i,a;let s={SerialJobno:"".concat(null===l||void 0===l?void 0:l.jobno),customerid:"".concat(null===l||void 0===l?void 0:l.custid),BagPrintName:"".concat(null===l||void 0===l?void 0:l.printname)},o=JSON.stringify(s),n=btoa(o),c={con:'{"id":"","mode":"'.concat(null===l||void 0===l?void 0:l.printname,'","appuserid":"').concat(null===l||void 0===l?void 0:l.appuserid,'"}'),p:"".concat(n),f:"".concat(null===l||void 0===l?void 0:l.appuserid," ").concat(null===l||void 0===l?void 0:l.printname)},t=atob(null===l||void 0===l?void 0:l.url);const r=await e.Z.post(t,c,{headers:null===l||void 0===l?void 0:l.headers});let v=null===JSON||void 0===JSON?void 0:JSON.parse(null===r||void 0===r||null===(d=r.data)||void 0===d?void 0:d.d);const u=null===v||void 0===v||null===(i=v.rd)||void 0===i?void 0:i.sort(((l,d)=>{var i,e;return parseInt(null===l||void 0===l||null===(i=l.serialjobno)||void 0===i?void 0:i.split("/")[1],10)-parseInt(null===d||void 0===d||null===(e=d.serialjobno)||void 0===e?void 0:e.split("/")[1],10)})),h=null===v||void 0===v||null===(a=v.rd1)||void 0===a?void 0:a.sort(((l,d)=>{var i,e;return parseInt(null===l||void 0===l||null===(i=l.SerialJobno)||void 0===i?void 0:i.split("/")[1],10)-parseInt(null===d||void 0===d||null===(e=d.SerialJobno)||void 0===e?void 0:e.split("/")[1],10)}));return{rd:u,rd1:h}}catch(s){console.log(s)}}},22941:(l,d,i)=>{i.d(d,{E:()=>e});const e=l=>{var d;const i=null===l||void 0===l?void 0:l.split(","),e=[...new Set(i)];return null===e||void 0===e||null===(d=e.map((l=>"'".concat(l,"'"))))||void 0===d?void 0:d.join(",")}},99008:(l,d,i)=>{i.d(d,{M:()=>a});var e=i(46507);const a=l=>{l.target.src=e}},13752:(l,d,i)=>{i.d(d,{Y:()=>e});const e=l=>{l.preventDefault(),window.print()}},9886:(l,d,i)=>{i.d(d,{U:()=>a});const e=l=>{let d=null===l||void 0===l?void 0:l.trim();if("01 Jan 1900"===d)return"";{let l=null===d||void 0===d?void 0:d.slice(7,11);if("00"===(null===l||void 0===l?void 0:l.slice(2,4))){var i;const l=new Date(d),e=null===(i=String(null===l||void 0===l?void 0:l.getDate()))||void 0===i?void 0:i.padStart(2,"0"),a=null===l||void 0===l?void 0:l.toLocaleString("default",{month:"short"}),s=String(null===l||void 0===l?void 0:l.getFullYear());return"".concat(e).concat(a).concat(s)}{var e,a;const l=new Date(d),i=null===(e=String(null===l||void 0===l?void 0:l.getDate()))||void 0===e?void 0:e.padStart(2,"0"),s=null===l||void 0===l?void 0:l.toLocaleString("default",{month:"short"}),o=null===(a=String(null===l||void 0===l?void 0:l.getFullYear()))||void 0===a?void 0:a.slice(-2);return"".concat(i).concat(s).concat(o)}}},a=(l,d)=>{let i=[];return null===l||void 0===l||l.forEach(((l,a)=>{var s,o;let n={};n.rd={...l},n.rd.orderDatef=e(null===n||void 0===n||null===(s=n.rd)||void 0===s?void 0:s.OrderDate),n.rd.promiseDatef=e(null===n||void 0===n||null===(o=n.rd)||void 0===o?void 0:o.promisedate);let c=null===d||void 0===d?void 0:d.filter((d=>(null===d||void 0===d?void 0:d.SerialJobno)===(null===l||void 0===l?void 0:l.serialjobno)));n.rd1=c,null===i||void 0===i||i.push(n)})),i}},80310:(l,d,i)=>{i.d(d,{Z:()=>n});var e=i(72791),a=i(80330),s=i.n(a),o=i(80184);const n=l=>{let{data:d}=l;const i=(0,e.useRef)(null),[a,n]=(0,e.useState)("");(0,e.useEffect)((()=>{i.current&&s()(i.current,d)}),[d]);const c=(0,e.useRef)(null);return(0,e.useEffect)((()=>{(()=>{const l=c.current;if(l){l.getContext("2d").clearRect(0,0,l.width,l.height),s()(l,d,{format:"CODE128",displayValue:!0});const i=l.toDataURL("image/png");n(i)}})()}),[]),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("canvas",{ref:c,className:"d_none"}),a&&(0,o.jsx)("img",{src:a,alt:"Barcode",className:"barcode_sticker",loading:"eager"})]})}},63268:(l,d,i)=>{i.r(d),i.d(d,{default:()=>A});var e=i(53573),a=i(72791),s=i(57689),o=i(26005),n=i(44663),c=i(13752),t=i(99008),r=i(80310),v=i(80444),u=i(9886),h=i(22941),m=i(1683),x=i(80184);const A=l=>{let{queries:d,headers:A}=l;const[j,N]=(0,a.useState)([]),p=(0,s.TH)(),g=e.Z.parse(p.search),f=(0,h.E)(null===g||void 0===g?void 0:g.str_srjobno);return(0,a.useEffect)((()=>{0!==Object.keys(g).length&&atob(g.imagepath);(async()=>{try{const l=[],i={jobno:f,custid:d.custid,printname:d.printname,appuserid:d.appuserid,url:d.url,headers:A},e=await(0,n.e)(i);let a=(0,u.U)(null===e||void 0===e?void 0:e.rd,null===e||void 0===e?void 0:e.rd1);null===a||void 0===a||a.forEach((d=>{var i,e,a,s,n,c,t,r,v,u;let h=0,m={ActualPcs:0,ActualWeight:0},x={ActualPcs:0,ActualWeight:0},A={ActualPcs:0,ActualWeight:0},j={ActualPcs:0,ActualWeight:0},N=[],p=[],f=[],y=[];null===d||void 0===d||null===(i=d.rd1)||void 0===i||i.map(((l,d)=>{"- - - "!==(null===l||void 0===l?void 0:l.ConcatedFullShapeQualityColorCode)&&h++,3===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)?(N.push(l),x.ActualPcs=x.ActualPcs+(null===l||void 0===l?void 0:l.ActualPcs),x.ActualWeight=x.ActualWeight+(null===l||void 0===l?void 0:l.ActualWeight)):4===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)?(p.push(l),m.ActualPcs=m.ActualPcs+(null===l||void 0===l?void 0:l.ActualPcs),m.ActualWeight=m.ActualWeight+(null===l||void 0===l?void 0:l.ActualWeight)):5===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)?(y.push(l),j.ActualPcs=j.ActualPcs+(null===l||void 0===l?void 0:l.ActualPcs),j.ActualWeight=j.ActualWeight+(null===l||void 0===l?void 0:l.ActualWeight)):7===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)&&(f.push(l),A.ActualPcs=A.ActualPcs+(null===l||void 0===l?void 0:l.ActualPcs),A.ActualWeight=A.ActualWeight+(null===l||void 0===l?void 0:l.ActualWeight))})),x.ActualPcs=+(null===(e=x.ActualPcs)||void 0===e?void 0:e.toFixed(3)),x.ActualWeight=+(null===(a=x.ActualWeight)||void 0===a?void 0:a.toFixed(3)),m.ActualPcs=+(null===(s=m.ActualPcs)||void 0===s?void 0:s.toFixed(3)),m.ActualWeight=+(null===(n=m.ActualWeight)||void 0===n?void 0:n.toFixed(3)),A.ActualPcs=+(null===(c=A.ActualPcs)||void 0===c?void 0:c.toFixed(3)),A.ActualWeight=+(null===(t=A.ActualWeight)||void 0===t?void 0:t.toFixed(3)),j.ActualPcs=+(null===(r=j.ActualPcs)||void 0===r?void 0:r.toFixed(3)),j.ActualWeight=+(null===(v=j.ActualWeight)||void 0===v?void 0:v.toFixed(3));let b=[].concat(N,p,f,y),D=g.imagepath;D=atob(g.imagepath);let S=D+(null===d||void 0===d||null===(u=d.rd)||void 0===u?void 0:u.ThumbImagePath),W=(0,o.n)(17,b);l.push({data:d,additional:{length:h,clr:m,dia:x,f:j,img:S,misc:A,pages:W}})})),N(l)}catch(l){console.log(l)}})()}),[]),(0,a.useEffect)((()=>{0!==j.length&&setTimeout((()=>{window.print()}),5e3)}),[j]),(0,x.jsx)(x.Fragment,{children:0===j.length?(0,x.jsx)(v.Z,{}):(0,x.jsxs)(a.Fragment,{children:[(0,x.jsx)("div",{className:"print_btn ",children:(0,x.jsx)("button",{className:"btn_white blue print_btn",onClick:l=>(0,c.Y)(l),children:"Print"})}),(0,x.jsxs)("div",{className:"bag5Afinal pad_60_allPrint",children:[Array.from({length:null===d||void 0===d?void 0:d.pageStart},((l,d)=>d>0&&(0,x.jsx)("div",{className:"container5A",style:{border:"0px"}},d))),(null===j||void 0===j?void 0:j.length)>0&&(null===j||void 0===j?void 0:j.map(((l,d)=>{var e,s,o,n,c,v,u,h,A,j,N,p,g,f,y,b,D,S,W,P,C,T,w,E,I,R,M,F,L,O,_,z,Z,k,J,B,Q,V,H,U,Y,G,K,q,X,$,ll,dl,il,el,al,sl,ol,nl,cl,tl,rl,vl,ul,hl,ml,xl,Al,jl,Nl,pl,gl,fl,yl,bl,Dl,Sl,Wl,Pl,Cl,Tl,wl,El,Il,Rl,Ml,Fl,Ll;return(0,x.jsxs)(a.Fragment,{children:[(null===l||void 0===l||null===(e=l.additional)||void 0===e||null===(s=e.pages)||void 0===s?void 0:s.length)>0?null===l||void 0===l||null===(o=l.additional)||void 0===o||null===(n=o.pages)||void 0===n?void 0:n.map(((d,e)=>{var s,o,n,c,v,u,h,A,j,N,p,g,f,y,b,D,S,W,P,C,T,w,E,I,R,M,F,L,O,_,z,Z,k,J,B,Q,V,H,U,Y,G,K,q,X,$,ll,dl;return(0,x.jsx)("div",{className:"container5A",children:(0,x.jsxs)("div",{className:"bag5A",children:[(0,x.jsxs)("div",{className:"flex5A",children:[(0,x.jsx)("div",{className:"header5A",children:(0,x.jsxs)("div",{className:"head5A",children:[(0,x.jsxs)("div",{className:"head5Ajob",children:[(0,x.jsx)("div",{className:"lh5A8",children:null===l||void 0===l||null===(s=l.data)||void 0===s||null===(o=s.rd)||void 0===o?void 0:o.serialjobno}),(0,x.jsx)("div",{className:"lh5A8",children:null===l||void 0===l||null===(n=l.data)||void 0===n||null===(c=n.rd)||void 0===c?void 0:c.Designcode}),(0,x.jsxs)("div",{className:"pr5A lh5A8",children:[null===l||void 0===l||null===(v=l.data)||void 0===v||null===(u=v.rd)||void 0===u?void 0:u.MetalType," ",null===l||void 0===l||null===(h=l.data)||void 0===h||null===(A=h.rd)||void 0===A?void 0:A.MetalColorCo]})]}),(0,x.jsxs)("div",{className:"head5Ainfo",children:[(0,x.jsxs)("div",{className:"info5Amid",children:[(0,x.jsx)("p",{className:"f5A diffColor",children:"CUST."}),(0,x.jsx)("p",{className:"f5A",children:null===l||void 0===l||null===(j=l.data)||void 0===j||null===(N=j.rd)||void 0===N?void 0:N.CustomerCode})]}),(0,x.jsxs)("div",{className:"info5Amid",children:[(0,x.jsx)("p",{className:"f5A diffColor",children:"ORD. DT."}),(0,x.jsx)("p",{className:"f5A",children:null!==(p=null===l||void 0===l||null===(g=l.data)||void 0===g||null===(f=g.rd)||void 0===f?void 0:f.orderDatef)&&void 0!==p?p:""})]}),(0,x.jsxs)("div",{className:"info5Aend",children:[(0,x.jsx)("p",{className:"f5A diffColor",children:"DEL. DT."}),(0,x.jsx)("p",{className:"f5A"})]}),(0,x.jsxs)("div",{className:"info5Alast",children:[(0,x.jsx)("p",{className:"f5A diffColor",style:{borderRight:"0px"},children:"SIZE"}),(0,x.jsx)("p",{className:"f5A",style:{borderRight:"0px"},children:null===l||void 0===l||null===(y=l.data)||void 0===y||null===(b=y.rd)||void 0===b?void 0:b.Size})]})]})]})}),(0,x.jsxs)("div",{className:"section5A",children:[(0,x.jsxs)("div",{className:"seaction5AheadA",children:[(0,x.jsx)("div",{className:"seaction5AheadCode",children:"CODE"}),(0,x.jsx)("div",{className:"seaction5AheadSize",children:"SIZE"}),(0,x.jsx)("div",{className:"seaction5AheadPcs",children:"PCS"}),(0,x.jsx)("div",{className:"seaction5AheadWT",children:"WT"}),(0,x.jsx)("div",{className:"seaction5AheadPcs",children:"PCS"}),(0,x.jsx)("div",{className:"seaction5AheadWT",children:"WT"})]}),null===d||void 0===d||null===(D=d.data)||void 0===D?void 0:D.map(((l,d)=>{var i,e;return(0,x.jsx)(a.Fragment,{children:5===l.MasterManagement_DiamondStoneTypeid?(0,x.jsx)("div",{className:"seaction5Amid",children:(0,x.jsxs)("div",{className:"seaction5Ahead",style:{fontWeight:"normal"},children:[(0,x.jsxs)("div",{className:"seaction5AheadCode",style:{width:"138px"},children:[null===l||void 0===l?void 0:l.LimitedShapeQualityColorCode," ",null===l||void 0===l?void 0:l.Quality," ",null===l||void 0===l?void 0:l.ColorName]}),(0,x.jsx)("div",{className:"seaction5AheadPcs",children:null===l||void 0===l?void 0:l.ActualPcs}),(0,x.jsx)("div",{className:"seaction5AheadWT",children:null===l||void 0===l||null===(i=l.ActualWeight)||void 0===i?void 0:i.toFixed(3)}),(0,x.jsx)("div",{className:"seaction5AheadPcs"}),(0,x.jsx)("div",{className:"seaction5AheadWT"})]})},d):(0,x.jsx)("div",{className:"seaction5Amid",children:(0,x.jsxs)("div",{className:"seaction5Ahead",style:{fontWeight:"normal"},children:[(0,x.jsx)("div",{className:"seaction5AheadCode",children:null===l||void 0===l?void 0:l.LimitedShapeQualityColorCode}),(0,x.jsx)("div",{className:"seaction5AheadSize",children:null===l||void 0===l?void 0:l.Sizename}),(0,x.jsx)("div",{className:"seaction5AheadPcs",children:null===l||void 0===l?void 0:l.ActualPcs}),(0,x.jsx)("div",{className:"seaction5AheadWT",children:null===l||void 0===l||null===(e=l.ActualWeight)||void 0===e?void 0:e.toFixed(3)}),(0,x.jsx)("div",{className:"seaction5AheadPcs"}),(0,x.jsx)("div",{className:"seaction5AheadWT"})]})},d)},d)})),Array.from({length:null===d||void 0===d?void 0:d.length},((l,d)=>(0,x.jsx)("div",{className:"seaction5Amid",children:(0,x.jsxs)("div",{className:"seaction5Ahead",style:{fontWeight:"normal"},children:[(0,x.jsx)("div",{className:"seaction5AheadCode"}),(0,x.jsx)("div",{className:"seaction5AheadSize"}),(0,x.jsx)("div",{className:"seaction5AheadPcs"}),(0,x.jsx)("div",{className:"seaction5AheadWT"}),(0,x.jsx)("div",{className:"seaction5AheadPcs"}),(0,x.jsx)("div",{className:"seaction5AheadWT"})]})},d)))]}),(0,x.jsx)("div",{className:"footer5A imp5A",children:(0,x.jsxs)("p",{className:"footer5AIns",children:[" ",(0,x.jsxs)("span",{className:"footer5AIns",style:{color:"red",paddingLeft:"2px",lineHeight:"11px"},children:["CAST INS."," "+(0,m.WW)(null===l||void 0===l||null===(S=l.data)||void 0===S||null===(W=S.rd)||void 0===W?void 0:W.officeuse)+" "+((null===l||void 0===l||null===(P=l.data)||void 0===P||null===(C=P.rd)||void 0===C||null===(T=C.ProductInstruction)||void 0===T?void 0:T.length)>0?(0,m.WW)(null===l||void 0===l||null===(w=l.data)||void 0===w||null===(E=w.rd)||void 0===E?void 0:E.ProductInstruction):(0,m.WW)(null===l||void 0===l||null===(I=l.data)||void 0===I||null===(R=I.rd)||void 0===R?void 0:R.QuoteRemark))]})]})})]}),(0,x.jsx)("div",{className:"aside5A",children:(0,x.jsxs)("div",{className:"imgPart5A",children:[(0,x.jsx)("div",{className:"img5A",children:(0,x.jsx)("img",{src:""!==(null===l||void 0===l||null===(M=l.additional)||void 0===M?void 0:M.img)?null===l||void 0===l||null===(F=l.additional)||void 0===F?void 0:F.img:i(46507),style:{height:"6rem",width:"7rem"},alt:"",onError:l=>(0,t.M)(l),loading:"eager"})}),(0,x.jsxs)("div",{className:"barcodeInfo5A",children:[(0,x.jsxs)("div",{style:{display:"flex",flexDirection:"column"},children:[(0,x.jsx)("div",{className:"diaInfo5A",children:(0,x.jsxs)("div",{className:"diaflex5A",children:[(0,x.jsx)("p",{className:"f5Aval",children:"DIAMOND"}),(0,x.jsxs)("p",{className:"diaVal5A",children:[null===l||void 0===l||null===(L=l.additional)||void 0===L||null===(O=L.dia)||void 0===O?void 0:O.ActualPcs,"/",null===l||void 0===l||null===(_=l.additional)||void 0===_||null===(z=_.dia)||void 0===z||null===(Z=z.ActualWeight)||void 0===Z?void 0:Z.toFixed(3)]})," "]})}),(0,x.jsx)("div",{className:"diaInfo5A",children:(0,x.jsxs)("div",{className:"diaflex5A",children:[(0,x.jsx)("p",{className:"f5Aval",style:{height:"33px"}})," "]})}),(0,x.jsx)("div",{className:"diaInfo5A",children:(0,x.jsxs)("div",{className:"diaflex5A",children:[(0,x.jsx)("p",{className:"f5Aval",children:"CS"}),(0,x.jsxs)("p",{className:"diaVal5A",children:[null===l||void 0===l||null===(k=l.additional)||void 0===k||null===(J=k.clr)||void 0===J?void 0:J.ActualPcs,"/",null===l||void 0===l||null===(B=l.additional)||void 0===B||null===(Q=B.clr)||void 0===Q||null===(V=Q.ActualWeight)||void 0===V?void 0:V.toFixed(2)]})," "]})}),(0,x.jsx)("div",{className:"diaInfo5A",children:(0,x.jsxs)("div",{className:"diaflex5A",children:[(0,x.jsx)("p",{className:"f5Aval",style:{height:"33px"}})," "]})}),(0,x.jsx)("div",{className:"diaInfo5A",children:(0,x.jsxs)("div",{className:"diaflex5A",children:[(0,x.jsx)("p",{className:"f5Aval",children:"METAL"}),(0,x.jsx)("p",{className:"diaVal5A",children:null===l||void 0===l||null===(H=l.data)||void 0===H||null===(U=H.rd)||void 0===U||null===(Y=U.netwt)||void 0===Y?void 0:Y.toFixed(3)})," "]})}),(0,x.jsx)("div",{style:{borderRight:"1px solid #989898",height:"39px"}})]}),(0,x.jsx)("div",{className:"barcode5A",children:0!==(null===l||void 0===l||null===(G=l.data)||void 0===G||null===(K=G.rd)||void 0===K?void 0:K.length)&&void 0!==(null===l||void 0===l||null===(q=l.data)||void 0===q?void 0:q.rd)&&(0,x.jsx)(x.Fragment,{children:void 0!==(null===l||void 0===l||null===(X=l.data)||void 0===X||null===($=X.rd)||void 0===$?void 0:$.serialjobno)&&(0,x.jsx)(r.Z,{data:null===l||void 0===l||null===(ll=l.data)||void 0===ll||null===(dl=ll.rd)||void 0===dl?void 0:dl.serialjobno})})})]})]})})]})},e)})):(0,x.jsx)("div",{className:"container5A",children:(0,x.jsxs)("div",{className:"bag5A",children:[(0,x.jsxs)("div",{className:"flex5A",children:[(0,x.jsx)("div",{className:"header5A",children:(0,x.jsxs)("div",{className:"head5A",children:[(0,x.jsxs)("div",{className:"head5Ajob",children:[(0,x.jsx)("div",{className:"lh5A8",children:null===l||void 0===l||null===(c=l.data)||void 0===c||null===(v=c.rd)||void 0===v?void 0:v.serialjobno}),(0,x.jsx)("div",{className:"lh5A8",children:null===l||void 0===l||null===(u=l.data)||void 0===u||null===(h=u.rd)||void 0===h?void 0:h.Designcode}),(0,x.jsxs)("div",{className:"pr5A lh5A8",children:[null===l||void 0===l||null===(A=l.data)||void 0===A||null===(j=A.rd)||void 0===j?void 0:j.MetalType," ",null===l||void 0===l||null===(N=l.data)||void 0===N||null===(p=N.rd)||void 0===p?void 0:p.MetalColorCo]})]}),(0,x.jsxs)("div",{className:"head5Ainfo",children:[(0,x.jsxs)("div",{className:"info5Amid",children:[(0,x.jsx)("p",{className:"f5A diffColor",children:"CUST."}),(0,x.jsx)("p",{className:"f5A",children:null===l||void 0===l||null===(g=l.data)||void 0===g||null===(f=g.rd)||void 0===f?void 0:f.CustomerCode})]}),(0,x.jsxs)("div",{className:"info5Amid",children:[(0,x.jsx)("p",{className:"f5A diffColor",children:"ORD. DT."}),(0,x.jsx)("p",{className:"f5A",children:null!==(y=null===l||void 0===l||null===(b=l.data)||void 0===b||null===(D=b.rd)||void 0===D?void 0:D.orderDatef)&&void 0!==y?y:""})]}),(0,x.jsxs)("div",{className:"info5Aend",children:[(0,x.jsx)("p",{className:"f5A diffColor",children:"DEL. DT."}),(0,x.jsx)("p",{className:"f5A"})]}),(0,x.jsxs)("div",{className:"info5Alast",children:[(0,x.jsx)("p",{className:"f5A diffColor",style:{borderRight:"0px"},children:"SIZE"}),(0,x.jsx)("p",{className:"f5A",style:{borderRight:"0px"},children:null===l||void 0===l||null===(S=l.data)||void 0===S||null===(W=S.rd)||void 0===W?void 0:W.Size})]})]})]})}),(0,x.jsxs)("div",{className:"section5A",children:[(0,x.jsxs)("div",{className:"seaction5AheadA",children:[(0,x.jsx)("div",{className:"seaction5AheadCode",children:"CODE"}),(0,x.jsx)("div",{className:"seaction5AheadSize",children:"SIZE"}),(0,x.jsx)("div",{className:"seaction5AheadPcs",children:"PCS"}),(0,x.jsx)("div",{className:"seaction5AheadWT",children:"WT"}),(0,x.jsx)("div",{className:"seaction5AheadPcs",children:"PCS"}),(0,x.jsx)("div",{className:"seaction5AheadWT",children:"WT"})]}),(0,x.jsx)("div",{className:"seaction5Amid",children:(0,x.jsxs)("div",{className:"seaction5Ahead",style:{fontWeight:"normal"},children:[(0,x.jsx)("div",{className:"seaction5AheadCode",children:(null===l||void 0===l||null===(P=l.data)||void 0===P||null===(C=P.rd)||void 0===C?void 0:C.MetalType)+" "+(null===l||void 0===l||null===(T=l.data)||void 0===T||null===(w=T.rd)||void 0===w?void 0:w.MetalColorCo)}),(0,x.jsx)("div",{className:"seaction5AheadSize"}),(0,x.jsx)("div",{className:"seaction5AheadPcs"}),(0,x.jsx)("div",{className:"seaction5AheadWT"}),(0,x.jsx)("div",{className:"seaction5AheadPcs"}),(0,x.jsx)("div",{className:"seaction5AheadWT"})]})}),Array.from({length:16},((l,d)=>(0,x.jsx)("div",{className:"seaction5Amid",children:(0,x.jsxs)("div",{className:"seaction5Ahead",style:{fontWeight:"normal"},children:[(0,x.jsx)("div",{className:"seaction5AheadCode"}),(0,x.jsx)("div",{className:"seaction5AheadSize"}),(0,x.jsx)("div",{className:"seaction5AheadPcs"}),(0,x.jsx)("div",{className:"seaction5AheadWT"}),(0,x.jsx)("div",{className:"seaction5AheadPcs"}),(0,x.jsx)("div",{className:"seaction5AheadWT"})]})},d)))]}),(0,x.jsx)("div",{className:"footer5A imp5A",children:(0,x.jsxs)("p",{className:"footer5AIns",children:[" ",(0,x.jsxs)("span",{className:"footer5AIns",style:{color:"red",paddingLeft:"2px",lineHeight:"11px"},children:["CAST INS."," "+(0,m.WW)(null===l||void 0===l||null===(E=l.data)||void 0===E||null===(I=E.rd)||void 0===I?void 0:I.officeuse)+" "+((null===l||void 0===l||null===(R=l.data)||void 0===R||null===(M=R.rd)||void 0===M||null===(F=M.ProductInstruction)||void 0===F?void 0:F.length)>0?(0,m.WW)(null===l||void 0===l||null===(L=l.data)||void 0===L||null===(O=L.rd)||void 0===O?void 0:O.ProductInstruction):(0,m.WW)(null===l||void 0===l||null===(_=l.data)||void 0===_||null===(z=_.rd)||void 0===z?void 0:z.QuoteRemark))]})]})})]}),(0,x.jsx)("div",{className:"aside5A",children:(0,x.jsxs)("div",{className:"imgPart5A",children:[(0,x.jsx)("div",{className:"img5A",children:(0,x.jsx)("img",{src:""!==(null===l||void 0===l||null===(Z=l.additional)||void 0===Z?void 0:Z.img)?null===l||void 0===l||null===(k=l.additional)||void 0===k?void 0:k.img:i(46507),style:{height:"6rem",width:"7rem"},alt:"",onError:l=>(0,t.M)(l),loading:"eager"})}),(0,x.jsxs)("div",{className:"barcodeInfo5A",children:[(0,x.jsxs)("div",{style:{display:"flex",flexDirection:"column"},children:[(0,x.jsx)("div",{className:"diaInfo5A",children:(0,x.jsxs)("div",{className:"diaflex5A",children:[(0,x.jsx)("p",{className:"f5Aval",children:"DIAMOND"}),(0,x.jsxs)("p",{className:"diaVal5A",children:[null===l||void 0===l||null===(J=l.additional)||void 0===J||null===(B=J.dia)||void 0===B?void 0:B.ActualPcs,"/",null===l||void 0===l||null===(Q=l.additional)||void 0===Q||null===(V=Q.dia)||void 0===V||null===(H=V.ActualWeight)||void 0===H?void 0:H.toFixed(3)]})," "]})}),(0,x.jsx)("div",{className:"diaInfo5A",children:(0,x.jsxs)("div",{className:"diaflex5A",children:[(0,x.jsx)("p",{className:"f5Aval",style:{height:"33px"}})," "]})}),(0,x.jsx)("div",{className:"diaInfo5A",children:(0,x.jsxs)("div",{className:"diaflex5A",children:[(0,x.jsx)("p",{className:"f5Aval",children:"CS"}),(0,x.jsxs)("p",{className:"diaVal5A",children:[null===l||void 0===l||null===(U=l.additional)||void 0===U||null===(Y=U.clr)||void 0===Y?void 0:Y.ActualPcs,"/",null===l||void 0===l||null===(G=l.additional)||void 0===G||null===(K=G.clr)||void 0===K||null===(q=K.ActualWeight)||void 0===q?void 0:q.toFixed(2)]})," "]})}),(0,x.jsx)("div",{className:"diaInfo5A",children:(0,x.jsxs)("div",{className:"diaflex5A",children:[(0,x.jsx)("p",{className:"f5Aval",style:{height:"33px"}})," "]})}),(0,x.jsx)("div",{className:"diaInfo5A",children:(0,x.jsxs)("div",{className:"diaflex5A",children:[(0,x.jsx)("p",{className:"f5Aval",children:"METAL"}),(0,x.jsx)("p",{className:"diaVal5A",children:null===l||void 0===l||null===(X=l.data)||void 0===X||null===($=X.rd)||void 0===$||null===(ll=$.netwt)||void 0===ll?void 0:ll.toFixed(3)})," "]})}),(0,x.jsx)("div",{style:{borderRight:"1px solid #989898",height:"39px"}})]}),(0,x.jsx)("div",{className:"barcode5A",children:0!==(null===l||void 0===l||null===(dl=l.data)||void 0===dl||null===(il=dl.rd)||void 0===il?void 0:il.length)&&void 0!==(null===l||void 0===l||null===(el=l.data)||void 0===el?void 0:el.rd)&&(0,x.jsx)(x.Fragment,{children:void 0!==(null===l||void 0===l||null===(al=l.data)||void 0===al||null===(sl=al.rd)||void 0===sl?void 0:sl.serialjobno)&&(0,x.jsx)(r.Z,{data:null===l||void 0===l||null===(ol=l.data)||void 0===ol||null===(nl=ol.rd)||void 0===nl?void 0:nl.serialjobno})})})]})]})})]})}),(0,x.jsx)("div",{className:"container5A",children:(0,x.jsxs)("div",{className:"bag5AD",children:[(0,x.jsxs)("div",{className:"header5AD",children:[(0,x.jsxs)("div",{className:"sectionHead5A",children:[(0,x.jsxs)("div",{className:"head5AjobD",children:[(0,x.jsx)("div",{className:"lh5A8",children:null===l||void 0===l||null===(cl=l.data)||void 0===cl||null===(tl=cl.rd)||void 0===tl?void 0:tl.serialjobno}),(0,x.jsx)("div",{className:"lh5A8",children:null===l||void 0===l||null===(rl=l.data)||void 0===rl||null===(vl=rl.rd)||void 0===vl?void 0:vl.Designcode}),(0,x.jsxs)("div",{className:"pr5A lh5A8",children:[null===l||void 0===l||null===(ul=l.data)||void 0===ul||null===(hl=ul.rd)||void 0===hl?void 0:hl.MetalType," ",null===l||void 0===l||null===(ml=l.data)||void 0===ml||null===(xl=ml.rd)||void 0===xl?void 0:xl.MetalColorCo]})]}),(0,x.jsxs)("div",{className:"mat5AD",children:[(0,x.jsx)("div",{className:"border5A",style:{color:"#c7c7c7",textAlign:"center"},children:"PRIORITY"}),(0,x.jsx)("div",{className:"border5A",style:{color:"#c7c7c7",textAlign:"center"},children:"LOC."}),(0,x.jsx)("div",{className:"border5A",style:{borderRight:"0px",color:"#c7c7c7",textAlign:"center"},children:"Q.C."})]}),(0,x.jsxs)("div",{className:"mat5ADE",children:[(0,x.jsxs)("div",{className:"border5A hw5A",children:[(0,x.jsx)("p",{className:"f5ADuplicate",children:"SALES REP."})," ",(0,x.jsx)("p",{className:"f5ADuplicate",children:null===l||void 0===l||null===(Al=l.data)||void 0===Al||null===(jl=Al.rd)||void 0===jl?void 0:jl.SalesrepCode})]}),(0,x.jsxs)("div",{className:"border5A hw5A",children:[(0,x.jsx)("p",{className:"f5ADuplicate",children:"FROSTING"})," ",(0,x.jsx)("p",{className:"f5ADuplicate",children:null===l||void 0===l||null===(Nl=l.data)||void 0===Nl||null===(pl=Nl.rd)||void 0===pl?void 0:pl.MetalFrosting})]}),(0,x.jsxs)("div",{className:"border5A hw5A",style:{borderRight:"0px"},children:[(0,x.jsx)("p",{className:"f5ADuplicate",children:"ENAMELING"}),(0,x.jsx)("p",{className:"f5ADuplicate",children:null===l||void 0===l||null===(gl=l.data)||void 0===gl||null===(fl=gl.rd)||void 0===fl?void 0:fl.Enamelling})]})]}),(0,x.jsxs)("div",{className:"mat5ADE",children:[(0,x.jsxs)("div",{className:"border5A hw5A",children:[(0,x.jsx)("p",{className:"f5ADuplicate",children:"LAB"})," ",(0,x.jsx)("p",{className:"f5ADuplicate",children:null===l||void 0===l||null===(yl=l.data)||void 0===yl||null===(bl=yl.rd)||void 0===bl?void 0:bl.MasterManagement_labname})]}),(0,x.jsxs)("div",{className:"border5A hw5A",children:[(0,x.jsx)("p",{className:"f5ADuplicate",children:"SNAP"})," ",(0,x.jsx)("p",{className:"f5ADuplicate",children:null===l||void 0===l||null===(Dl=l.data)||void 0===Dl||null===(Sl=Dl.rd)||void 0===Sl?void 0:Sl.MasterManagement_ProductImageType})]}),(0,x.jsxs)("div",{className:"border5A hw5A",style:{borderRight:"0px"},children:[(0,x.jsx)("p",{className:"f5ADuplicate",children:"MAKETYPE"}),(0,x.jsx)("p",{className:"f5ADuplicate",children:null===l||void 0===l||null===(Wl=l.data)||void 0===Wl||null===(Pl=Wl.rd)||void 0===Pl?void 0:Pl.mastermanagement_maketypename})," "]})]}),(0,x.jsxs)("div",{className:"mat5AD",children:[(0,x.jsx)("div",{className:"border5A",style:{color:"#c7c7c7",textAlign:"center"},children:"TR NO."}),(0,x.jsx)("div",{className:"border5A",style:{color:"#c7c7c7",textAlign:"center"},children:"TR NO."}),(0,x.jsx)("div",{className:"border5A",style:{borderRight:"0px",color:"#c7c7c7",textAlign:"center"},children:"TR NO."})]}),(0,x.jsxs)("div",{className:"mat5AD",style:{borderBottom:"0px"},children:[(0,x.jsx)("div",{className:"border5A",style:{color:"#c7c7c7",textAlign:"center"},children:"TR WT."}),(0,x.jsx)("div",{className:"border5A",style:{color:"#c7c7c7",textAlign:"center"},children:"TR WT."}),(0,x.jsx)("div",{className:"border5A",style:{borderRight:"0px",color:"#c7c7c7",textAlign:"center"},children:"TR WT."})]})]}),(0,x.jsx)("div",{className:"img5AD",children:(0,x.jsx)("img",{src:""!==(null===l||void 0===l||null===(Cl=l.additional)||void 0===Cl?void 0:Cl.img)?null===l||void 0===l||null===(Tl=l.additional)||void 0===Tl?void 0:Tl.img:i(46507),style:{height:"7rem",width:"7rem"},alt:"",onError:l=>(0,t.M)(l),loading:"eager"})})]}),(0,x.jsxs)("div",{className:"enteryBarcode5AD",children:[(0,x.jsxs)("div",{className:"enteryBarcode5ADyn",children:[(0,x.jsxs)("div",{className:"entry5AHead",style:{fontWeight:"normal",width:"290px"},children:[(0,x.jsxs)("div",{className:"rmcode3a",style:{width:"43px",display:"flex",justifyContent:"center"},children:["DEPT"," "]}),(0,x.jsx)("div",{className:"rmcode3a",style:{width:"52px",display:"flex",justifyContent:"center"},children:"ISSUE"}),(0,x.jsx)("div",{className:"rmcode3a",style:{width:"52px",display:"flex",justifyContent:"center"},children:"RECEIVE"}),(0,x.jsx)("div",{className:"rmcode3a",style:{width:"52px",display:"flex",justifyContent:"center"},children:"SCRAP"}),(0,x.jsx)("div",{className:"rmcode3a",style:{width:"37px",display:"flex",justifyContent:"center"},children:"PCS"}),(0,x.jsx)("div",{className:"rmcode3a",style:{borderRight:"0px",width:"56px",display:"flex",justifyContent:"center"},children:"WORKER"})]}),(0,x.jsxs)("div",{className:"entryheader5A",children:[(0,x.jsxs)("div",{className:"entry5AHeadD",style:{fontWeight:"normal"},children:[(0,x.jsxs)("div",{className:"rmcode5aD",style:{width:"46px"},children:["GRD"," "]}),(0,x.jsx)("div",{className:"rmcode5aD",style:{width:"46px"},children:"FIL"}),(0,x.jsx)("div",{className:"rmcode5aD",style:{width:"46px"},children:"PPL"}),(0,x.jsxs)("div",{className:"rmcode5aD",style:{width:"46px"},children:["SET."," "]}),(0,x.jsx)("div",{className:"rmcode5aD",style:{width:"46px"},children:"ASM"}),(0,x.jsx)("div",{className:"rmcode5aD",style:{width:"46px"},children:"FPL"}),(0,x.jsx)("div",{className:"rmcode5aD",style:{width:"46px"},children:"PLT"}),(0,x.jsx)("div",{className:"rmcode5aD",style:{width:"46px"}}),(0,x.jsx)("div",{className:"rmcode5aD",style:{borderBottom:"1px solid #989898",width:"46px"}})]}),(0,x.jsx)("div",{children:Array.from({length:9},((l,d)=>(0,x.jsxs)("div",{className:"entry5AHeadEntry",style:{fontWeight:"normal"},children:[(0,x.jsx)("div",{className:"rmcode5aDE",style:{width:"52px"}}),(0,x.jsx)("div",{className:"rmcode5aDE",style:{width:"51px"}}),(0,x.jsx)("div",{className:"rmcode5aDE",style:{width:"51px"}}),(0,x.jsx)("div",{className:"rmcode5aDE",style:{width:"37px"}}),(0,x.jsx)("div",{className:"rmcode5aDE",style:{width:"56px",borderRight:"0px"}})]},d)))})]}),(0,x.jsxs)("div",{children:[(0,x.jsx)("div",{className:"ins5Afooter",children:(0,x.jsx)("p",{style:{fontSize:"12px"},children:"SLS. INS."})}),(0,x.jsx)("div",{className:"ins5Afooter",children:(0,x.jsx)("p",{style:{fontSize:"12px"},children:"PRD. INS."})}),(0,x.jsx)("div",{className:"ins5Afooter",style:{borderBottom:"0px"},children:(0,x.jsx)("p",{style:{fontSize:"12px"},children:"QC. INS."})})]})]}),(0,x.jsx)("div",{className:"barcode5AD",children:0!==(null===l||void 0===l||null===(wl=l.data)||void 0===wl||null===(El=wl.rd)||void 0===El?void 0:El.length)&&void 0!==(null===l||void 0===l||null===(Il=l.data)||void 0===Il?void 0:Il.rd)&&(0,x.jsx)(x.Fragment,{children:void 0!==(null===l||void 0===l||null===(Rl=l.data)||void 0===Rl||null===(Ml=Rl.rd)||void 0===Ml?void 0:Ml.serialjobno)&&(0,x.jsx)(r.Z,{data:null===l||void 0===l||null===(Fl=l.data)||void 0===Fl||null===(Ll=Fl.rd)||void 0===Ll?void 0:Ll.serialjobno})})})]})]})})]},d)})))]})]})})}}}]);
//# sourceMappingURL=6219.6138ec48.chunk.js.map