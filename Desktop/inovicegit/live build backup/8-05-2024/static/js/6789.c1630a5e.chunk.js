"use strict";(self.webpackChunkinvoice=self.webpackChunkinvoice||[]).push([[6789],{26005:(l,s,n)=>{n.d(s,{n:()=>a});const a=(l,s)=>{let n=[];for(let d=0;d<(null===s||void 0===s?void 0:s.length);d+=l){var a;const i=null===s||void 0===s?void 0:s.slice(d,d+l);let e=l-(null===s||void 0===s||null===(a=s.slice(d,d+l))||void 0===a?void 0:a.length);null===n||void 0===n||n.push({data:i,length:e})}return n}},44663:(l,s,n)=>{n.d(s,{e:()=>d});var a=n(31243);const d=async l=>{try{var s,n,d;let i={SerialJobno:"".concat(null===l||void 0===l?void 0:l.jobno),customerid:"".concat(null===l||void 0===l?void 0:l.custid),BagPrintName:"".concat(null===l||void 0===l?void 0:l.printname)},e=JSON.stringify(i),o=btoa(e),c={con:'{"id":"","mode":"'.concat(null===l||void 0===l?void 0:l.printname,'","appuserid":"').concat(null===l||void 0===l?void 0:l.appuserid,'"}'),p:"".concat(o),f:"".concat(null===l||void 0===l?void 0:l.appuserid," ").concat(null===l||void 0===l?void 0:l.printname)},t=atob(null===l||void 0===l?void 0:l.url);const r=await a.Z.post(t,c,{headers:null===l||void 0===l?void 0:l.headers});let v=null===JSON||void 0===JSON?void 0:JSON.parse(null===r||void 0===r||null===(s=r.data)||void 0===s?void 0:s.d);const u=null===v||void 0===v||null===(n=v.rd)||void 0===n?void 0:n.sort(((l,s)=>{var n,a;return parseInt(null===l||void 0===l||null===(n=l.serialjobno)||void 0===n?void 0:n.split("/")[1],10)-parseInt(null===s||void 0===s||null===(a=s.serialjobno)||void 0===a?void 0:a.split("/")[1],10)})),A=null===v||void 0===v||null===(d=v.rd1)||void 0===d?void 0:d.sort(((l,s)=>{var n,a;return parseInt(null===l||void 0===l||null===(n=l.SerialJobno)||void 0===n?void 0:n.split("/")[1],10)-parseInt(null===s||void 0===s||null===(a=s.SerialJobno)||void 0===a?void 0:a.split("/")[1],10)}));return{rd:u,rd1:A}}catch(i){console.log(i)}}},22941:(l,s,n)=>{n.d(s,{E:()=>a});const a=l=>{var s;const n=null===l||void 0===l?void 0:l.split(","),a=[...new Set(n)];return null===a||void 0===a||null===(s=a.map((l=>"'".concat(l,"'"))))||void 0===s?void 0:s.join(",")}},99008:(l,s,n)=>{n.d(s,{M:()=>d});var a=n(46507);const d=l=>{l.target.src=a}},13752:(l,s,n)=>{n.d(s,{Y:()=>a});const a=l=>{l.preventDefault(),window.print()}},9886:(l,s,n)=>{n.d(s,{U:()=>d});const a=l=>{let s=null===l||void 0===l?void 0:l.trim();if("01 Jan 1900"===s)return"";{let l=null===s||void 0===s?void 0:s.slice(7,11);if("00"===(null===l||void 0===l?void 0:l.slice(2,4))){var n;const l=new Date(s),a=null===(n=String(null===l||void 0===l?void 0:l.getDate()))||void 0===n?void 0:n.padStart(2,"0"),d=null===l||void 0===l?void 0:l.toLocaleString("default",{month:"short"}),i=String(null===l||void 0===l?void 0:l.getFullYear());return"".concat(a).concat(d).concat(i)}{var a,d;const l=new Date(s),n=null===(a=String(null===l||void 0===l?void 0:l.getDate()))||void 0===a?void 0:a.padStart(2,"0"),i=null===l||void 0===l?void 0:l.toLocaleString("default",{month:"short"}),e=null===(d=String(null===l||void 0===l?void 0:l.getFullYear()))||void 0===d?void 0:d.slice(-2);return"".concat(n).concat(i).concat(e)}}},d=(l,s)=>{let n=[];return null===l||void 0===l||l.forEach(((l,d)=>{var i,e;let o={};o.rd={...l},o.rd.orderDatef=a(null===o||void 0===o||null===(i=o.rd)||void 0===i?void 0:i.OrderDate),o.rd.promiseDatef=a(null===o||void 0===o||null===(e=o.rd)||void 0===e?void 0:e.promisedate);let c=null===s||void 0===s?void 0:s.filter((s=>(null===s||void 0===s?void 0:s.SerialJobno)===(null===l||void 0===l?void 0:l.serialjobno)));o.rd1=c,null===n||void 0===n||n.push(o)})),n}},80310:(l,s,n)=>{n.d(s,{Z:()=>o});var a=n(72791),d=n(80330),i=n.n(d),e=n(80184);const o=l=>{let{data:s}=l;const n=(0,a.useRef)(null),[d,o]=(0,a.useState)("");(0,a.useEffect)((()=>{n.current&&i()(n.current,s)}),[s]);const c=(0,a.useRef)(null);return(0,a.useEffect)((()=>{(()=>{const l=c.current;if(l){l.getContext("2d").clearRect(0,0,l.width,l.height),i()(l,s,{format:"CODE128",displayValue:!0});const n=l.toDataURL("image/png");o(n)}})()}),[]),(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("canvas",{ref:c,className:"d_none"}),d&&(0,e.jsx)("img",{src:d,alt:"Barcode",className:"barcode_sticker",loading:"eager"})]})}},96435:(l,s,n)=>{n.r(s),n.d(s,{default:()=>p});var a=n(53573),d=n(72791),i=n(57689),e=n(26005),o=n(44663),c=n(99008),t=n(13752),r=n(80310),v=n(80444),u=n(9886),A=n(22941),h=n(1683),m=n(80184);const p=l=>{let{queries:s,headers:p}=l;const[x,j]=(0,d.useState)([]),N=(0,i.TH)(),w=a.Z.parse(null===N||void 0===N?void 0:N.search),g=(0,A.E)(null===w||void 0===w?void 0:w.str_srjobno);return(0,d.useEffect)((()=>{var l;0!==(null===(l=Object.keys(w))||void 0===l?void 0:l.length)&&atob(null===w||void 0===w?void 0:w.imagepath);(async()=>{try{const l=[],n={jobno:g,custid:s.custid,printname:s.printname,appuserid:s.appuserid,url:s.url,headers:p};let a=await(0,o.e)(n),d=(0,u.U)(null===a||void 0===a?void 0:a.rd,null===a||void 0===a?void 0:a.rd1);null===d||void 0===d||d.map((s=>{var n,a,d,i,o,c,t,r,v,u,A;let h=[],m=[],p=[],x=[];null===s||void 0===s||null===(n=s.rd1)||void 0===n||n.forEach(((l,s)=>{3===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)&&h.push(l),4===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)&&m.push(l),5===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)&&x.push(l),7===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)&&p.push(l)}));let j=0,N={ActualPcs:0,ActualWeight:0,MasterManagement_DiamondStoneTypeid:4},g={ActualPcs:0,ActualWeight:0,MasterManagement_DiamondStoneTypeid:3},f={ActualPcs:0,ActualWeight:0,MasterManagement_DiamondStoneTypeid:7},b={ActualPcs:0,ActualWeight:0,MasterManagement_DiamondStoneTypeid:5},S=[],D=[],W=[],P=[];null===s||void 0===s||null===(a=s.rd1)||void 0===a||a.map(((l,s)=>{"- - - "!==(null===l||void 0===l?void 0:l.ConcatedFullShapeQualityColorCode)&&j++,3===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)?(S.push(l),g.ActualPcs=(null===g||void 0===g?void 0:g.ActualPcs)+(null===l||void 0===l?void 0:l.ActualPcs),g.ActualWeight=(null===g||void 0===g?void 0:g.ActualWeight)+(null===l||void 0===l?void 0:l.ActualWeight)):4===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)?(D.push(l),N.ActualPcs=(null===N||void 0===N?void 0:N.ActualPcs)+(null===l||void 0===l?void 0:l.ActualPcs),N.ActualWeight=(null===N||void 0===N?void 0:N.ActualWeight)+(null===l||void 0===l?void 0:l.ActualWeight)):5===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)?(P.push(l),b.ActualPcs=(null===b||void 0===b?void 0:b.ActualPcs)+(null===l||void 0===l?void 0:l.ActualPcs),b.ActualWeight=(null===b||void 0===b?void 0:b.ActualWeight)+(null===l||void 0===l?void 0:l.ActualWeight)):7===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)&&(W.push(l),f.ActualPcs=(null===f||void 0===f?void 0:f.ActualPcs)+(null===l||void 0===l?void 0:l.ActualPcs),f.ActualWeight=(null===f||void 0===f?void 0:f.ActualWeight)+(null===l||void 0===l?void 0:l.ActualWeight))})),g.ActualPcs=+(null===(d=g.ActualPcs)||void 0===d?void 0:d.toFixed(3)),g.ActualWeight=+(null===(i=g.ActualWeight)||void 0===i?void 0:i.toFixed(3)),N.ActualPcs=+(null===(o=N.ActualPcs)||void 0===o?void 0:o.toFixed(3)),N.ActualWeight=+(null===(c=N.ActualWeight)||void 0===c?void 0:c.toFixed(3)),f.ActualPcs=+(null===(t=f.ActualPcs)||void 0===t?void 0:t.toFixed(3)),f.ActualWeight=+(null===(r=f.ActualWeight)||void 0===r?void 0:r.toFixed(3)),b.ActualPcs=+(null===(v=b.ActualPcs)||void 0===v?void 0:v.toFixed(3)),b.ActualWeight=+(null===(u=b.ActualWeight)||void 0===u?void 0:u.toFixed(3));let T=[],y=null===T||void 0===T?void 0:T.concat(S,D,W,P),M=null===w||void 0===w?void 0:w.imagepath;M=atob(null===w||void 0===w?void 0:w.imagepath);let C=M+(null===s||void 0===s||null===(A=s.rd)||void 0===A?void 0:A.ThumbImagePath),k=(0,e.n)(14,y);l.push({data:s,additional:{length:j,clr:N,dia:g,f:b,img:C,misc:f,pages:k}})})),j(l)}catch(l){console.log(l)}})()}),[]),(0,d.useEffect)((()=>{0!==(null===x||void 0===x?void 0:x.length)&&setTimeout((()=>{window.print()}),5e3)}),[null===x||void 0===x?void 0:x.length]),(0,m.jsx)(m.Fragment,{children:0===(null===x||void 0===x?void 0:x.length)?(0,m.jsx)(v.Z,{}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("button",{className:"btn_white blue print_btn btn17",onClick:l=>(0,t.Y)(l),children:"Print"}),(0,m.jsxs)("div",{className:"samebgp17A pad_60_allPrint",children:[Array.from({length:null===s||void 0===s?void 0:s.pageStart},((l,s)=>s>0&&(0,m.jsx)("div",{className:"bgn17A",style:{border:"0px"}},s))),(null===x||void 0===x?void 0:x.length)>0&&(null===x||void 0===x?void 0:x.map(((l,s)=>{var a,i,e,o,t,v,u,A,p,x,j,N,w,g,f,b,S,D,W,P,T,y,M,C,k,E,F,I,R,_,O,V,L,Z,J,z,U,B,Y,Q,G,H,K,q,X,$,ll,sl,nl,al,dl,il,el,ol,cl,tl,rl,vl,ul,Al,hl,ml,pl,xl,jl,Nl,wl,gl,fl,bl,Sl,Dl,Wl,Pl,Tl;return(0,m.jsxs)(d.Fragment,{children:[(null===l||void 0===l||null===(a=l.additional)||void 0===a||null===(i=a.pages)||void 0===i?void 0:i.length)>0?null===l||void 0===l||null===(e=l.additional)||void 0===e||null===(o=e.pages)||void 0===o?void 0:o.map(((s,a)=>{var d,i,e,o,t,v,u,A,p,x,j,N,w,g,f,b,S,D,W,P,T,y,M,C,k,E,F,I,R,_,O,V,L,Z,J,z,U,B,Y,Q,G,H,K,q,X,$,ll,sl,nl,al,dl,il;return(0,m.jsxs)("div",{className:"bgn17A",children:[(0,m.jsxs)("div",{className:"headn17A",children:[(0,m.jsxs)("div",{className:"headInfon17A",children:[(0,m.jsxs)("div",{className:"jobn17A",children:[(0,m.jsx)("p",{className:"fsn17A",children:(0,m.jsx)("span",{className:"fsbn17Ajob",children:null===l||void 0===l||null===(d=l.data)||void 0===d||null===(i=d.rd)||void 0===i?void 0:i.serialjobno})}),(0,m.jsx)("p",{className:"fsn17A",children:null===l||void 0===l||null===(e=l.data)||void 0===e||null===(o=e.rd)||void 0===o?void 0:o.Designcode}),(0,m.jsxs)("p",{className:"fsn17A",style:{marginRight:"3px"},children:[null===l||void 0===l||null===(t=l.data)||void 0===t||null===(v=t.rd)||void 0===v?void 0:v.MetalType," ",null===l||void 0===l||null===(u=l.data)||void 0===u||null===(A=u.rd)||void 0===A?void 0:A.MetalColorCo]})]}),(0,m.jsxs)("div",{className:"maten17A",children:[(0,m.jsxs)("div",{className:"custn17Amate",children:[(0,m.jsx)("p",{className:"cparan17A",children:"CUST"}),(0,m.jsx)("p",{className:"cparaValn17A",children:null===l||void 0===l||null===(p=l.data)||void 0===p||null===(x=p.rd)||void 0===x?void 0:x.CustomerCode})]}),(0,m.jsxs)("div",{className:"custn17Amate",children:[(0,m.jsx)("p",{className:"cparan17A",children:"SIZE"}),(0,m.jsx)("p",{className:"cparaValn17A",children:null===l||void 0===l||null===(j=l.data)||void 0===j||null===(N=j.rd)||void 0===N?void 0:N.Size})]}),(0,m.jsxs)("div",{className:"custn17Amate",children:[(0,m.jsx)("p",{className:"cparan17A",children:"ORD.DT."}),(0,m.jsx)("p",{className:"cparaValn17A",children:null!==(w=null===l||void 0===l||null===(g=l.data)||void 0===g||null===(f=g.rd)||void 0===f?void 0:f.orderDatef)&&void 0!==w?w:""})]}),(0,m.jsxs)("div",{className:"custn17Amate brn17A",children:[(0,m.jsx)("p",{className:"cpara18A",children:"DEL.DT."}),(0,m.jsx)("p",{className:"cparaValn17A",children:null!==(b=null===l||void 0===l||null===(S=l.data)||void 0===S||null===(D=S.rd)||void 0===D?void 0:D.promiseDatef)&&void 0!==b?b:""})]})]}),(0,m.jsxs)("div",{className:"insn17A",style:{color:"red"},children:["INS: \xa0",null===(W=" "+(0,h.WW)(null===l||void 0===l||null===(P=l.data)||void 0===P||null===(T=P.rd)||void 0===T?void 0:T.officeuse)+" "+((null===l||void 0===l||null===(y=l.data)||void 0===y||null===(M=y.rd)||void 0===M||null===(C=M.ProductInstruction)||void 0===C?void 0:C.length)>0?(0,h.WW)(null===l||void 0===l||null===(k=l.data)||void 0===k||null===(E=k.rd)||void 0===E?void 0:E.ProductInstruction):(0,h.WW)(null===l||void 0===l||null===(F=l.data)||void 0===F||null===(I=F.rd)||void 0===I?void 0:I.QuoteRemark)))||void 0===W?void 0:W.slice(0,140)]})]}),(0,m.jsx)("div",{className:"imgn17A",children:(0,m.jsx)("img",{src:""!==(null===l||void 0===l||null===(R=l.additional)||void 0===R?void 0:R.img)?null===l||void 0===l||null===(_=l.additional)||void 0===_?void 0:_.img:n(46507),alt:"",onError:l=>(0,c.M)(l),id:"imgn17A",loading:"eager"})})]}),(0,m.jsxs)("div",{className:"mateTablen17A",children:[(0,m.jsxs)("div",{children:[(0,m.jsxs)("div",{className:"mateHeadn17A",children:[(0,m.jsx)("p",{className:"fshn17A coden17A",children:"CODE"}),(0,m.jsx)("p",{className:"fshn17A sizen17A",children:"SIZE"}),(0,m.jsx)("p",{className:"fshn17A pcsn17A",children:"PCS"}),(0,m.jsx)("p",{className:"fshn17A pcsn17A",children:"WT"}),(0,m.jsx)("p",{className:"fshn17A wtn17A",children:"PCS"}),(0,m.jsx)("p",{className:"fshn17A wtn17A",children:"WT"})]}),(null===s||void 0===s||null===(O=s.data)||void 0===O?void 0:O.length)>0&&(null===s||void 0===s||null===(V=s.data)||void 0===V?void 0:V.map(((l,s)=>{var n,a;return(0,m.jsxs)("div",{className:"mateBodyn17A",children:[(0,m.jsx)("p",{className:"bodycoden17A coden17A",children:null===l||void 0===l||null===(n=l.ConcatedFullShapeQualityColorName)||void 0===n?void 0:n.toUpperCase()}),(0,m.jsx)("p",{className:"bodyn17A sizen17A",style:{justifyContent:"flex-start",paddingLeft:"2px"},children:null===l||void 0===l?void 0:l.Sizename}),(0,m.jsx)("p",{className:"bodyn17A pcsn17A",children:null===l||void 0===l?void 0:l.ActualPcs}),(0,m.jsx)("p",{className:"bodyn17A pcsn17A",children:null===l||void 0===l||null===(a=l.ActualWeight)||void 0===a?void 0:a.toFixed(3)}),(0,m.jsx)("p",{className:"bodyn17A wtn17A"}),(0,m.jsx)("p",{className:"bodyn17A wtn17A"})]},s)}))),Array.from({length:null===s||void 0===s?void 0:s.length},((l,s)=>(0,m.jsxs)("div",{className:"mateBodyn17A",children:[(0,m.jsx)("p",{className:"fshn17A coden17A"}),(0,m.jsx)("p",{className:"fshn17A sizen17A"}),(0,m.jsx)("p",{className:"fshn17A pcsn17A"}),(0,m.jsx)("p",{className:"fshn17A pcsn17A"}),(0,m.jsx)("p",{className:"fshn17A wtn17A"}),(0,m.jsx)("p",{className:"fshn17A wtn17A"})]},s)))]}),(0,m.jsx)("div",{className:"barcoden17A",children:void 0!==(null===l||void 0===l||null===(L=l.data)||void 0===L||null===(Z=L.rd)||void 0===Z?void 0:Z.serialjobno)&&(0,m.jsx)(r.Z,{data:null===l||void 0===l||null===(J=l.data)||void 0===J||null===(z=J.rd)||void 0===z?void 0:z.serialjobno})})]}),(0,m.jsxs)("div",{className:"footern17A",children:[(0,m.jsxs)("div",{className:"dian17A",children:[(0,m.jsx)("div",{className:"fsn17A brbn17A",children:"DIAM."}),(0,m.jsxs)("div",{className:"fsn17A",children:[null===l||void 0===l||null===(U=l.additional)||void 0===U||null===(B=U.dia)||void 0===B?void 0:B.ActualPcs,"/",null===l||void 0===l||null===(Y=l.additional)||void 0===Y||null===(Q=Y.dia)||void 0===Q||null===(G=Q.ActualWeight)||void 0===G?void 0:G.toFixed(3)]}),(0,m.jsx)("div",{className:"fsn17A"})]}),(0,m.jsxs)("div",{className:"dian17A",children:[(0,m.jsx)("div",{className:"fsn17A brbn17A",children:"CS"}),(0,m.jsxs)("div",{className:"fsn17A",children:[null===l||void 0===l||null===(H=l.additional)||void 0===H||null===(K=H.clr)||void 0===K?void 0:K.ActualPcs,"/",null===l||void 0===l||null===(q=l.additional)||void 0===q||null===(X=q.clr)||void 0===X||null===($=X.ActualWeight)||void 0===$?void 0:$.toFixed(3)]}),(0,m.jsx)("div",{className:"fsn17A"})]}),(0,m.jsxs)("div",{className:"miscn17A",children:[(0,m.jsx)("div",{className:"fsn17A brbn17A",children:"METAL"}),(0,m.jsx)("div",{className:"fsn17A",children:null===l||void 0===l||null===(ll=l.data)||void 0===ll||null===(sl=ll.rd)||void 0===sl||null===(nl=sl.QuotGrossWeight)||void 0===nl?void 0:nl.toFixed(3)}),(0,m.jsx)("div",{className:"fsn17A"})]}),(0,m.jsxs)("div",{className:"miscn17A",style:{marginRight:"32.5px"},children:[(0,m.jsx)("div",{className:"fsn17A brbn17A",children:"MISC"}),(0,m.jsx)("div",{className:"fsn17A",children:null===l||void 0===l||null===(al=l.additional)||void 0===al||null===(dl=al.misc)||void 0===dl||null===(il=dl.ActualWeight)||void 0===il?void 0:il.toFixed(3)}),(0,m.jsx)("div",{className:"fsn17A"})]})]})]},a)})):(0,m.jsxs)("div",{className:"bgn17A",children:[(0,m.jsxs)("div",{className:"headn17A",children:[(0,m.jsxs)("div",{className:"headInfon17A",children:[(0,m.jsxs)("div",{className:"jobn17A",children:[(0,m.jsx)("p",{className:"fsn17A",children:(0,m.jsx)("span",{className:"fsbn17Ajob",children:null===l||void 0===l||null===(t=l.data)||void 0===t||null===(v=t.rd)||void 0===v?void 0:v.serialjobno})}),(0,m.jsx)("p",{className:"fsn17A",children:null===l||void 0===l||null===(u=l.data)||void 0===u||null===(A=u.rd)||void 0===A?void 0:A.Designcode}),(0,m.jsxs)("p",{className:"fsn17A",style:{marginRight:"3px"},children:[null===l||void 0===l||null===(p=l.data)||void 0===p||null===(x=p.rd)||void 0===x?void 0:x.MetalType," ",null===l||void 0===l||null===(j=l.data)||void 0===j||null===(N=j.rd)||void 0===N?void 0:N.MetalColorCo]})]}),(0,m.jsxs)("div",{className:"maten17A",children:[(0,m.jsxs)("div",{className:"custn17Amate",children:[(0,m.jsx)("p",{className:"cparan17A",children:"CUST"}),(0,m.jsx)("p",{className:"cparaValn17A"}),null===l||void 0===l||null===(w=l.data)||void 0===w||null===(g=w.rd)||void 0===g?void 0:g.CustomerCode]}),(0,m.jsxs)("div",{className:"custn17Amate",children:[(0,m.jsx)("p",{className:"cparan17A",children:"SIZE"}),(0,m.jsx)("p",{className:"cparaValn17A",children:null===l||void 0===l||null===(f=l.data)||void 0===f||null===(b=f.rd)||void 0===b?void 0:b.Size})]}),(0,m.jsxs)("div",{className:"custn17Amate",children:[(0,m.jsx)("p",{className:"cparan17A",children:"ORD.DT."}),(0,m.jsx)("p",{className:"cparaValn17A",children:null===l||void 0===l||null===(S=l.data)||void 0===S||null===(D=S.rd)||void 0===D?void 0:D.orderDatef})]}),(0,m.jsxs)("div",{className:"custn17Amate brn17A",children:[(0,m.jsx)("p",{className:"cpara18A",children:"DEL.DT."}),(0,m.jsx)("p",{className:"cparaValn17A",children:null===l||void 0===l||null===(W=l.data)||void 0===W||null===(P=W.rd)||void 0===P?void 0:P.promiseDatef})]})]}),(0,m.jsxs)("div",{className:"insn17A",children:["INS :",null===(T=" "+(0,h.WW)(null===l||void 0===l||null===(y=l.data)||void 0===y||null===(M=y.rd)||void 0===M?void 0:M.officeuse)+" "+((null===l||void 0===l||null===(C=l.data)||void 0===C||null===(k=C.rd)||void 0===k||null===(E=k.ProductInstruction)||void 0===E?void 0:E.length)>0?(0,h.WW)(null===l||void 0===l||null===(F=l.data)||void 0===F||null===(I=F.rd)||void 0===I?void 0:I.ProductInstruction):(0,h.WW)(null===l||void 0===l||null===(R=l.data)||void 0===R||null===(_=R.rd)||void 0===_?void 0:_.QuoteRemark)))||void 0===T?void 0:T.slice(0,140)]})]}),(0,m.jsx)("div",{className:"imgn17A",children:(0,m.jsx)("img",{src:""!==(null===l||void 0===l||null===(O=l.additional)||void 0===O?void 0:O.img)?null===l||void 0===l||null===(V=l.additional)||void 0===V?void 0:V.img:n(46507),alt:"",onError:l=>(0,c.M)(l),id:"img18A",loading:"eager"})})]}),(0,m.jsxs)("div",{className:"mateTablen17A",children:[(0,m.jsxs)("div",{children:[(0,m.jsxs)("div",{className:"mateHeadn17A",children:[(0,m.jsx)("p",{className:"fshn17A coden17A",children:"CODE"}),(0,m.jsx)("p",{className:"fshn17A sizen17A",children:"SIZE"}),(0,m.jsx)("p",{className:"fshn17A pcsn17A",children:"PCS"}),(0,m.jsx)("p",{className:"fshn17A pcsn17A",children:"WT"}),(0,m.jsx)("p",{className:"fshn17A wtn17A",children:"PCS"}),(0,m.jsx)("p",{className:"fshn17A wtn17A",children:"WT"})]}),Array.from({length:14},((l,s)=>(0,m.jsxs)("div",{className:"mateBodyn17A",children:[(0,m.jsx)("p",{className:"fshn17A coden17A"}),(0,m.jsx)("p",{className:"fshn17A sizen17A"}),(0,m.jsx)("p",{className:"fshn17A pcsn17A"}),(0,m.jsx)("p",{className:"fshn17A pcsn17A"}),(0,m.jsx)("p",{className:"fshn17A wtn17A"}),(0,m.jsx)("p",{className:"fshn17A wtn17A"})]},s)))]}),(0,m.jsx)("div",{className:"barcoden17A",children:void 0!==(null===l||void 0===l||null===(L=l.data)||void 0===L||null===(Z=L.rd)||void 0===Z?void 0:Z.serialjobno)&&(0,m.jsx)(r.Z,{data:null===l||void 0===l||null===(J=l.data)||void 0===J||null===(z=J.rd)||void 0===z?void 0:z.serialjobno})})]}),(0,m.jsxs)("div",{className:"footern17A",children:[(0,m.jsxs)("div",{className:"dian17A",children:[(0,m.jsx)("div",{className:"fsn17A brbn17A",children:"DIAM."}),(0,m.jsxs)("div",{className:"fs18A",children:[null===l||void 0===l||null===(U=l.additional)||void 0===U||null===(B=U.dia)||void 0===B?void 0:B.ActualPcs,"/",null===l||void 0===l||null===(Y=l.additional)||void 0===Y||null===(Q=Y.dia)||void 0===Q||null===(G=Q.ActualWeight)||void 0===G?void 0:G.toFixed(3)]}),(0,m.jsx)("div",{className:"fsn17A"})]}),(0,m.jsxs)("div",{className:"dian17A",children:[(0,m.jsx)("div",{className:"fsn17A brbn17A",children:"CS"}),(0,m.jsxs)("div",{className:"fs18A",children:[null===l||void 0===l||null===(H=l.additional)||void 0===H||null===(K=H.clr)||void 0===K?void 0:K.ActualPcs,"/",null===l||void 0===l||null===(q=l.additional)||void 0===q||null===(X=q.clr)||void 0===X||null===($=X.ActualWeight)||void 0===$?void 0:$.toFixed(3)]}),(0,m.jsx)("div",{className:"fsn17A"})]}),(0,m.jsxs)("div",{className:"miscn17A",children:[(0,m.jsx)("div",{className:"fsn17A brbn17A",children:"METAL"}),(0,m.jsx)("div",{className:"fs18A",children:null===l||void 0===l||null===(ll=l.data)||void 0===ll||null===(sl=ll.rd)||void 0===sl?void 0:sl.QuotGrossWeight}),(0,m.jsx)("div",{className:"fsn17A"})]}),(0,m.jsxs)("div",{className:"miscn17A",style:{marginRight:"3rem"},children:[(0,m.jsx)("div",{className:"fsn17A brbn17A",children:"MISC"}),(0,m.jsx)("div",{className:"fs18A",children:null===l||void 0===l||null===(nl=l.additional)||void 0===nl||null===(al=nl.misc)||void 0===al||null===(dl=al.ActualWeight)||void 0===dl?void 0:dl.toFixed(3)}),(0,m.jsx)("div",{className:"fsn17A"})]})]})]}),(0,m.jsxs)("div",{className:"bgn17A",children:[(0,m.jsxs)("div",{className:"headn17AD",children:[(0,m.jsxs)("div",{className:"headInfon17AD",children:[(0,m.jsxs)("div",{className:"jobn17A",children:[(0,m.jsx)("p",{className:"fs18A",children:(0,m.jsx)("span",{className:"fsbn17Ajob",children:null===l||void 0===l||null===(il=l.data)||void 0===il||null===(el=il.rd)||void 0===el?void 0:el.serialjobno})}),(0,m.jsx)("p",{className:"fsn17A",children:null===l||void 0===l||null===(ol=l.data)||void 0===ol||null===(cl=ol.rd)||void 0===cl?void 0:cl.Designcode}),(0,m.jsxs)("p",{className:"fsn17A",children:[null===l||void 0===l||null===(tl=l.data)||void 0===tl||null===(rl=tl.rd)||void 0===rl?void 0:rl.MetalType," ",null===l||void 0===l||null===(vl=l.data)||void 0===vl||null===(ul=vl.rd)||void 0===ul?void 0:ul.MetalColorCo]})]}),(0,m.jsxs)("div",{className:"Dmaten17A",children:[(0,m.jsxs)("div",{className:"custn17Amate",children:[(0,m.jsx)("p",{className:"cparan17A",children:"SALES REP."}),(0,m.jsx)("p",{className:"cparaValn17A",children:null===l||void 0===l||null===(Al=l.data)||void 0===Al||null===(hl=Al.rd)||void 0===hl?void 0:hl.SalesrepCode})]}),(0,m.jsxs)("div",{className:"custn17Amate",children:[(0,m.jsx)("p",{className:"cparan17A",children:"FROS"}),(0,m.jsx)("p",{className:"cparaValn17A",children:null===l||void 0===l||null===(ml=l.data)||void 0===ml||null===(pl=ml.rd)||void 0===pl?void 0:pl.MetalFrosting})]}),(0,m.jsxs)("div",{className:"custn17Amate",children:[(0,m.jsx)("p",{className:"cparan17A",children:"LAB"}),(0,m.jsx)("p",{className:"cparaValn17A",children:null===l||void 0===l||null===(xl=l.data)||void 0===xl||null===(jl=xl.rd)||void 0===jl?void 0:jl.MasterManagement_labname})]}),(0,m.jsxs)("div",{className:"custn17Amate brn17A",children:[(0,m.jsx)("p",{className:"cparan17A",children:"MAKETYPE"}),(0,m.jsx)("p",{className:"cparaValn17A",children:null===l||void 0===l||null===(Nl=l.data)||void 0===Nl||null===(wl=Nl.rd)||void 0===wl?void 0:wl.mastermanagement_maketypename})]})]}),(0,m.jsx)("div",{className:"testn17A",children:(0,m.jsx)("p",{children:null===l||void 0===l||null===(gl=l.data)||void 0===gl||null===(fl=gl.rd)||void 0===fl?void 0:fl.PO})}),(0,m.jsxs)("div",{className:"tronn17A",children:[(0,m.jsx)("p",{className:"pn17AD",children:"Y TR NO"}),(0,m.jsx)("p",{className:"pn17AD",children:"W TR NO"}),(0,m.jsx)("p",{className:"pn17AD",children:"P TR NO"}),(0,m.jsx)("p",{className:"pn17AD",children:"Y CST WT."}),(0,m.jsx)("p",{className:"pn17AD",children:"W CST WT."}),(0,m.jsx)("p",{className:"pn17AD",style:{borderRight:"0px"},children:"P CST WT."})]}),(0,m.jsx)("div",{className:"metn17AD",children:(0,m.jsx)("div",{children:"METAL"})})]}),(0,m.jsx)("div",{className:"imgn17AD",children:(0,m.jsx)("img",{src:""!==(null===l||void 0===l||null===(bl=l.additional)||void 0===bl?void 0:bl.img)?null===l||void 0===l||null===(Sl=l.additional)||void 0===Sl?void 0:Sl.img:n(46507),alt:"",onError:l=>(0,c.M)(l),id:"imgn17AD",loading:"eager"})})]}),(0,m.jsx)("section",{children:(0,m.jsxs)("div",{className:"cvdn17A",children:[(0,m.jsxs)("div",{className:"stvin17A",children:[(0,m.jsx)("div",{className:"onen17A",children:"STONE"}),(0,m.jsx)("div",{className:"onen17A",children:"VISUAL"})]}),(0,m.jsx)("div",{children:(0,m.jsx)("div",{className:"cvdtestn17A",children:"CVD TEST"})}),(0,m.jsx)("div",{className:"barcoden17AD",children:void 0!==(null===l||void 0===l||null===(Dl=l.data)||void 0===Dl||null===(Wl=Dl.rd)||void 0===Wl?void 0:Wl.serialjobno)&&(0,m.jsx)(r.Z,{data:null===l||void 0===l||null===(Pl=l.data)||void 0===Pl||null===(Tl=Pl.rd)||void 0===Tl?void 0:Tl.serialjobno})})]})}),(0,m.jsxs)("main",{className:"mainn17A",children:[(0,m.jsxs)("div",{className:"theadrown17A",children:[(0,m.jsx)("p",{className:"thrown17A deptn17Aw",children:"DEPT."}),(0,m.jsx)("p",{className:"thrown17A apn17Aw",children:"AP"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw",children:"ISSUE"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw",children:"RECEIVE"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw",children:"SCRAP"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw",children:"PCS"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw br177Anone",children:"WORKER"})]}),(0,m.jsxs)("div",{className:"theadrown17A",children:[(0,m.jsx)("p",{className:"thrown17A deptn17Aw",children:"GRD."}),(0,m.jsx)("p",{className:"thrown17A apn17Aw"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw br177Anone"})]}),(0,m.jsxs)("div",{className:"theadrown17A",children:[(0,m.jsx)("p",{className:"thrown17A deptn17Aw",children:"FIL."}),(0,m.jsx)("p",{className:"thrown17A apn17Aw"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw br177Anone"})]}),(0,m.jsxs)("div",{className:"theadrown17A",children:[(0,m.jsx)("p",{className:"thrown17A deptn17Aw",children:"ASM."}),(0,m.jsx)("p",{className:"thrown17A apn17Aw"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw br177Anone"})]}),(0,m.jsxs)("div",{className:"theadrown17A",children:[(0,m.jsx)("p",{className:"thrown17A deptn17Aw",children:"CNC."}),(0,m.jsx)("p",{className:"thrown17A apn17Aw"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw br177Anone"})]}),(0,m.jsxs)("div",{className:"theadrown17A",children:[(0,m.jsx)("p",{className:"thrown17A deptn17Aw",children:"EP/PI."}),(0,m.jsx)("p",{className:"thrown17A apn17Aw"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw br177Anone"})]}),(0,m.jsxs)("div",{className:"theadrown17A",children:[(0,m.jsx)("p",{className:"thrown17A deptn17Aw",children:"SET."}),(0,m.jsx)("p",{className:"thrown17A apn17Aw"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw br177Anone"})]}),(0,m.jsxs)("div",{className:"theadrown17A",children:[(0,m.jsx)("p",{className:"thrown17A deptn17Aw",children:"FPL."}),(0,m.jsx)("p",{className:"thrown17A apn17Aw"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw br177Anone"})]}),(0,m.jsxs)("div",{className:"theadrown17A",children:[(0,m.jsx)("p",{className:"thrown17A deptn17Aw",children:"PLT."}),(0,m.jsx)("p",{className:"thrown17A apn17Aw"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw br177Anone"})]}),(0,m.jsxs)("div",{className:"theadrown17A",style:{borderBottom:"0px"},children:[(0,m.jsx)("p",{className:"thrown17A deptn17Aw",children:"ENM."}),(0,m.jsx)("p",{className:"thrown17A apn17Aw"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw"}),(0,m.jsx)("p",{className:"thrown17A issuen17Aw"}),(0,m.jsx)("p",{className:"thrown17A workn17Aw br177Anone"})]})]})]})]},"uniqueKey_".concat(s))})))]})]})})}}}]);
//# sourceMappingURL=6789.c1630a5e.chunk.js.map