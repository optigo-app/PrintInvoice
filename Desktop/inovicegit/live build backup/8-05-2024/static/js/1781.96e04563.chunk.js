"use strict";(self.webpackChunkinvoice=self.webpackChunkinvoice||[]).push([[1781],{26005:(l,i,d)=>{d.d(i,{n:()=>o});const o=(l,i)=>{let d=[];for(let e=0;e<(null===i||void 0===i?void 0:i.length);e+=l){var o;const a=null===i||void 0===i?void 0:i.slice(e,e+l);let s=l-(null===i||void 0===i||null===(o=i.slice(e,e+l))||void 0===o?void 0:o.length);null===d||void 0===d||d.push({data:a,length:s})}return d}},44663:(l,i,d)=>{d.d(i,{e:()=>e});var o=d(31243);const e=async l=>{try{var i,d,e;let a={SerialJobno:"".concat(null===l||void 0===l?void 0:l.jobno),customerid:"".concat(null===l||void 0===l?void 0:l.custid),BagPrintName:"".concat(null===l||void 0===l?void 0:l.printname)},s=JSON.stringify(a),n=btoa(s),t={con:'{"id":"","mode":"'.concat(null===l||void 0===l?void 0:l.printname,'","appuserid":"').concat(null===l||void 0===l?void 0:l.appuserid,'"}'),p:"".concat(n),f:"".concat(null===l||void 0===l?void 0:l.appuserid," ").concat(null===l||void 0===l?void 0:l.printname)},v=atob(null===l||void 0===l?void 0:l.url);const c=await o.Z.post(v,t,{headers:null===l||void 0===l?void 0:l.headers});let r=null===JSON||void 0===JSON?void 0:JSON.parse(null===c||void 0===c||null===(i=c.data)||void 0===i?void 0:i.d);const u=null===r||void 0===r||null===(d=r.rd)||void 0===d?void 0:d.sort(((l,i)=>{var d,o;return parseInt(null===l||void 0===l||null===(d=l.serialjobno)||void 0===d?void 0:d.split("/")[1],10)-parseInt(null===i||void 0===i||null===(o=i.serialjobno)||void 0===o?void 0:o.split("/")[1],10)})),h=null===r||void 0===r||null===(e=r.rd1)||void 0===e?void 0:e.sort(((l,i)=>{var d,o;return parseInt(null===l||void 0===l||null===(d=l.SerialJobno)||void 0===d?void 0:d.split("/")[1],10)-parseInt(null===i||void 0===i||null===(o=i.SerialJobno)||void 0===o?void 0:o.split("/")[1],10)}));return{rd:u,rd1:h}}catch(a){console.log(a)}}},22941:(l,i,d)=>{d.d(i,{E:()=>o});const o=l=>{var i;const d=null===l||void 0===l?void 0:l.split(","),o=[...new Set(d)];return null===o||void 0===o||null===(i=o.map((l=>"'".concat(l,"'"))))||void 0===i?void 0:i.join(",")}},99008:(l,i,d)=>{d.d(i,{M:()=>e});var o=d(46507);const e=l=>{l.target.src=o}},13752:(l,i,d)=>{d.d(i,{Y:()=>o});const o=l=>{l.preventDefault(),window.print()}},9886:(l,i,d)=>{d.d(i,{U:()=>e});const o=l=>{let i=null===l||void 0===l?void 0:l.trim();if("01 Jan 1900"===i)return"";{let l=null===i||void 0===i?void 0:i.slice(7,11);if("00"===(null===l||void 0===l?void 0:l.slice(2,4))){var d;const l=new Date(i),o=null===(d=String(null===l||void 0===l?void 0:l.getDate()))||void 0===d?void 0:d.padStart(2,"0"),e=null===l||void 0===l?void 0:l.toLocaleString("default",{month:"short"}),a=String(null===l||void 0===l?void 0:l.getFullYear());return"".concat(o).concat(e).concat(a)}{var o,e;const l=new Date(i),d=null===(o=String(null===l||void 0===l?void 0:l.getDate()))||void 0===o?void 0:o.padStart(2,"0"),a=null===l||void 0===l?void 0:l.toLocaleString("default",{month:"short"}),s=null===(e=String(null===l||void 0===l?void 0:l.getFullYear()))||void 0===e?void 0:e.slice(-2);return"".concat(d).concat(a).concat(s)}}},e=(l,i)=>{let d=[];return null===l||void 0===l||l.forEach(((l,e)=>{var a,s;let n={};n.rd={...l},n.rd.orderDatef=o(null===n||void 0===n||null===(a=n.rd)||void 0===a?void 0:a.OrderDate),n.rd.promiseDatef=o(null===n||void 0===n||null===(s=n.rd)||void 0===s?void 0:s.promisedate);let t=null===i||void 0===i?void 0:i.filter((i=>(null===i||void 0===i?void 0:i.SerialJobno)===(null===l||void 0===l?void 0:l.serialjobno)));n.rd1=t,null===d||void 0===d||d.push(n)})),d}},50194:(l,i,d)=>{d.d(i,{Z:()=>s});var o=d(72791),e=d(22057),a=d(80184);const s=function(l){let{text:i}=l;const[d,s]=(0,o.useState)("lintangwisesa");return(0,a.jsx)(a.Fragment,{children:d?(0,a.jsx)(e.ZP,{id:"myqr",value:i,includeMargin:!0,className:"qrcodegen"}):(0,a.jsx)("p",{children:"No QR code preview"})})}},85354:(l,i,d)=>{d.r(i),d.d(i,{default:()=>A});var o=d(53573),e=d(72791),a=d(57689),s=d(26005),n=d(44663),t=d(13752),v=d(99008),c=d(50194),r=d(80444),u=d(9886),h=d(22941),x=d(1683),m=d(80184);const A=l=>{let{queries:i,headers:A}=l;const[j,p]=(0,e.useState)([]),N=(0,a.TH)(),g=o.Z.parse(N.search),w=(0,h.E)(null===g||void 0===g?void 0:g.str_srjobno);return(0,e.useEffect)((()=>{var l;0!==(null===(l=Object.keys(g))||void 0===l?void 0:l.length)&&atob(null===g||void 0===g?void 0:g.imagepath);(async()=>{try{const l=[],d={jobno:w,custid:i.custid,printname:i.printname,appuserid:i.appuserid,url:i.url,headers:A},o=await(0,n.e)(d);let e=(0,u.U)(null===o||void 0===o?void 0:o.rd,null===o||void 0===o?void 0:o.rd1);null===e||void 0===e||e.map((i=>{var d,o,e,a,n,t,v,c,r,u,h,x,m,A;let j=0,p={Sizename:"",ActualPcs:0,ActualWeight:0},N={Sizename:"",ActualPcs:0,ActualWeight:0},w={Sizename:"",ActualPcs:0,ActualWeight:0},y={Sizename:"",ActualPcs:0,ActualWeight:0},b={ConcatedFullShapeQualityColorCode:""},f=[],S=[],W=[],C=[];null===i||void 0===i||null===(d=i.rd1)||void 0===d||d.forEach(((l,i)=>{"- - - "!==(null===l||void 0===l?void 0:l.ConcatedFullShapeQualityColorCode)&&j++,3===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)?(f.push(l),N.ActualPcs=N.ActualPcs+(null===l||void 0===l?void 0:l.ActualPcs),N.ActualWeight=N.ActualWeight+(null===l||void 0===l?void 0:l.ActualWeight)):4===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)?(S.push(l),p.ActualPcs=p.ActualPcs+(null===l||void 0===l?void 0:l.ActualPcs),p.ActualWeight=p.ActualWeight+(null===l||void 0===l?void 0:l.ActualWeight)):5===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)?(C.push(l),y.ActualPcs=y.ActualPcs+(null===l||void 0===l?void 0:l.ActualPcs),y.ActualWeight=y.ActualWeight+(null===l||void 0===l?void 0:l.ActualWeight)):7===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)&&(W.push(l),w.ActualPcs=w.ActualPcs+(null===l||void 0===l?void 0:l.ActualPcs),w.ActualWeight=w.ActualWeight+(null===l||void 0===l?void 0:l.ActualWeight))})),N.ActualPcs=+(null===(o=N.ActualPcs)||void 0===o?void 0:o.toFixed(3)),N.ActualWeight=+(null===(e=N.ActualWeight)||void 0===e?void 0:e.toFixed(3)),p.ActualPcs=+(null===(a=p.ActualPcs)||void 0===a?void 0:a.toFixed(3)),p.ActualWeight=+(null===(n=p.ActualWeight)||void 0===n?void 0:n.toFixed(3)),w.ActualPcs=+(null===(t=w.ActualPcs)||void 0===t?void 0:t.toFixed(3)),w.ActualWeight=+(null===(v=w.ActualWeight)||void 0===v?void 0:v.toFixed(3)),y.ActualPcs=+(null===(c=y.ActualPcs)||void 0===c?void 0:c.toFixed(3)),y.ActualWeight=+(null===(r=y.ActualWeight)||void 0===r?void 0:r.toFixed(3));let P=[].concat(f,S,W,C),T=null===g||void 0===g?void 0:g.imagepath;T=atob(null===g||void 0===g?void 0:g.imagepath);let M=T+(null===i||void 0===i||null===(u=i.rd)||void 0===u?void 0:u.ThumbImagePath);b.ConcatedFullShapeQualityColorCode=(null==(null===i||void 0===i||null===(h=i.rd)||void 0===h?void 0:h.MetalType)?"NA":null===i||void 0===i||null===(x=i.rd)||void 0===x?void 0:x.MetalType)+" "+(null==(null===i||void 0===i||null===(m=i.rd)||void 0===m?void 0:m.MetalColorCo)?"NA":null===i||void 0===i||null===(A=i.rd)||void 0===A?void 0:A.MetalColorCo),P.unshift(b);let D=(0,s.n)(12,P);const F=(new Date).toLocaleString("en-US",{year:"numeric",month:"2-digit",day:"2-digit",hour:"numeric",minute:"numeric",second:"numeric",hour12:!0});i.rd.showingDateTimeByJob=F,l.push({data:i,additional:{length:j,clr:p,dia:N,f:y,img:M,misc:w,pages:D}})})),p(l)}catch(l){console.log(l)}})()}),[]),(0,e.useEffect)((()=>{0!==(null===j||void 0===j?void 0:j.length)&&setTimeout((()=>{window.print()}),5e3)}),[j]),(0,m.jsx)(m.Fragment,{children:0===j.length?(0,m.jsx)(r.Z,{}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("div",{className:"print_btn",children:(0,m.jsx)("button",{className:"btn_white blue print_btn",onClick:l=>(0,t.Y)(l),children:"Print"})}),(0,m.jsxs)("div",{className:"print6Aflex pad_60_allPrint",children:[Array.from({length:null===i||void 0===i?void 0:i.pageStart},((l,i)=>i>0&&(0,m.jsx)("div",{className:"containerWD6A",style:{border:"0px"},children:(0,m.jsx)("div",{className:"container6A",style:{border:"0px"}})},i))),(null===j||void 0===j?void 0:j.length)>0&&(null===j||void 0===j?void 0:j.map(((l,i)=>{var o,a,s,n,t,r,u,h,A,j,p,N,g,w,y,b,f,S,W,C,P,T,M,D,F,I,R,z,O,E,J,k,_,q,Q,Z,B,L,U,G,Y,H,K,V,X,$,ll,il,dl,ol,el,al,sl,nl,tl,vl,cl,rl,ul,hl,xl,ml,Al,jl,pl,Nl,gl,wl,yl,bl,fl,Sl,Wl,Cl,Pl,Tl;return(0,m.jsx)(e.Fragment,{children:(null===l||void 0===l||null===(o=l.additional)||void 0===o||null===(a=o.pages)||void 0===a?void 0:a.length)>0?null===l||void 0===l||null===(s=l.additional)||void 0===s||null===(n=s.pages)||void 0===n?void 0:n.map(((i,o)=>{var e,a,s,n,t,r,u,h,A,j,p,N,g,w,y,b,f,S,W,C,P,T,M,D,F,I,R,z,O,E,J,k,_,q,Q,Z,B,L,U,G,Y,H,K,V,X,$,ll,il,dl,ol,el,al,sl,nl,tl,vl,cl,rl,ul,hl,xl,ml,Al,jl,pl,Nl;return(0,m.jsxs)("div",{className:"containerWD6A",children:[(0,m.jsxs)("div",{className:"container6A",children:[(0,m.jsxs)("div",{className:"jobInfo6A",children:[(0,m.jsxs)("div",{className:"jobInfo6Aheader",children:[(0,m.jsxs)("div",{className:"jobName6AD h6A",style:{fontWeight:"bold"},children:[(0,m.jsx)("div",{children:null===l||void 0===l||null===(e=l.data)||void 0===e||null===(a=e.rd)||void 0===a?void 0:a.serialjobno}),(0,m.jsx)("div",{children:null===l||void 0===l||null===(s=l.data)||void 0===s||null===(n=s.rd)||void 0===n?void 0:n.Designcode}),(0,m.jsx)("div",{className:"text-danger",children:(null==(null===l||void 0===l||null===(t=l.data)||void 0===t||null===(r=t.rd)||void 0===r?void 0:r.MetalType)?"NA":null===l||void 0===l||null===(u=l.data)||void 0===u||null===(h=u.rd)||void 0===h?void 0:h.MetalType)+" "+(null==(null===l||void 0===l||null===(A=l.data)||void 0===A||null===(j=A.rd)||void 0===j?void 0:j.MetalColorCo)?"NA":null===l||void 0===l||null===(p=l.data)||void 0===p||null===(N=p.rd)||void 0===N?void 0:N.MetalColorCo)})]}),(0,m.jsxs)("div",{className:"jobName6A",children:[(0,m.jsx)("div",{className:"job6Ahww text-secondary",children:"TR NO."}),(0,m.jsx)("div",{className:"job6Ahww text-secondary",children:"TR NO."}),(0,m.jsx)("div",{className:"job6Ahww text-secondary",children:"TR NO."}),(0,m.jsx)("div",{className:"job6Ahww borderRight6A",style:{width:"50.5px"},children:null===l||void 0===l||null===(g=l.data)||void 0===g||null===(w=g.rd)||void 0===w?void 0:w.OrderNo})]}),(0,m.jsxs)("div",{className:"jobName6A",children:[(0,m.jsx)("div",{className:"job6Ahww",style:{fontSize:"".concat((null===l||void 0===l||null===(y=l.data)||void 0===y||null===(b=y.rd)||void 0===b||null===(f=b.ProductType)||void 0===f?void 0:f.length)>18?"8.5px":"9.5px")},children:null===l||void 0===l||null===(S=l.data)||void 0===S||null===(W=S.rd)||void 0===W?void 0:W.ProductType}),(0,m.jsx)("div",{className:"job6Ahww",children:null===l||void 0===l||null===(C=l.data)||void 0===C||null===(P=C.rd)||void 0===P?void 0:P.Size}),(0,m.jsx)("div",{className:"job6Ahww",children:null===l||void 0===l||null===(T=l.data)||void 0===T||null===(M=T.rd)||void 0===M?void 0:M.CustomerCode}),(0,m.jsx)("div",{className:"job6Ahww borderRight6A",style:{width:"50.5px"},children:null===l||void 0===l||null===(D=l.data.rd)||void 0===D?void 0:D.PO})]}),(0,m.jsxs)("div",{className:"jobName6A",children:[(0,m.jsx)("div",{className:"job6Ahww",children:"CS WT/PC"}),(0,m.jsx)("div",{className:"job6Ahww",children:"DIA WT/PC"}),(0,m.jsx)("div",{className:"job6Ahww",children:"Nt Wt/Gr Wt"}),(0,m.jsx)("div",{className:"job6Ahww borderRight6A",style:{backgroundColor:"".concat(null===l||void 0===l||null===(F=l.data)||void 0===F||null===(I=F.rd)||void 0===I?void 0:I.prioritycolorcode),width:"50.5px"},children:null===l||void 0===l||null===(R=l.data)||void 0===R||null===(z=R.rd)||void 0===z?void 0:z.prioritycode})]}),(0,m.jsxs)("div",{className:"jobName6A",style:{borderBottom:"0px"},children:[(0,m.jsxs)("div",{className:"job6Ahww",children:[null===l||void 0===l||null===(O=l.additional)||void 0===O||null===(E=O.clr)||void 0===E||null===(J=E.ActualWeight)||void 0===J?void 0:J.toFixed(3),"/",null===l||void 0===l||null===(k=l.additional)||void 0===k||null===(_=k.clr)||void 0===_?void 0:_.ActualPcs]}),(0,m.jsxs)("div",{className:"job6Ahww",children:[null===l||void 0===l||null===(q=l.additional)||void 0===q||null===(Q=q.dia)||void 0===Q||null===(Z=Q.ActualWeight)||void 0===Z?void 0:Z.toFixed(3),"/",null===l||void 0===l||null===(B=l.additional)||void 0===B||null===(L=B.dia)||void 0===L?void 0:L.ActualPcs]}),(0,m.jsxs)("div",{className:"job6Ahww",children:[null===l||void 0===l||null===(U=l.data)||void 0===U||null===(G=U.rd)||void 0===G||null===(Y=G.MetalWeight)||void 0===Y?void 0:Y.toFixed(3),"/",null===l||void 0===l||null===(H=l.data)||void 0===H||null===(K=H.rd)||void 0===K||null===(V=K.ActualGrossweight)||void 0===V?void 0:V.toFixed(3)]}),(0,m.jsx)("div",{className:"job6Ahww borderRight6A",style:{width:"50.5px"},children:null!==(X=null===l||void 0===l||null===($=l.data)||void 0===$||null===(ll=$.rd)||void 0===ll?void 0:ll.promiseDatef)&&void 0!==X?X:""})]})]}),(0,m.jsxs)("div",{className:"imgSize6A",children:[" ",(0,m.jsx)("img",{src:""!==(null===l||void 0===l||null===(il=l.additional)||void 0===il?void 0:il.img)?null===l||void 0===l||null===(dl=l.additional)||void 0===dl?void 0:dl.img:d(46507),id:"img6A",alt:"",onError:l=>(0,v.M)(l),loading:"eager"})]})]}),(0,m.jsx)("div",{className:"main6A",children:(0,m.jsxs)("div",{className:"required6A",children:[(0,m.jsxs)("div",{className:"lbh6A d-flex justify-content-between align-items-center",children:[(0,m.jsx)("div",{style:{width:"282px",borderRight:"1px solid #989898"},className:"d-flex justify-content-center align-items-center",children:"Required Material"}),(0,m.jsx)("div",{style:{width:"64px",lineHeight:"9px",fontSize:"11px"},className:"d-flex justify-content-center align-items-center",children:"Issue Material"})]}),(0,m.jsxs)("div",{className:"main6Ahead",style:{height:"16px"},children:[(0,m.jsx)("div",{className:"right6Aa code6A",style:{width:"120px"},children:"CODE"}),(0,m.jsx)("div",{className:"right6Ab code6A",style:{width:"90px"},children:"SIZE"}),(0,m.jsx)("div",{className:"right6Ac code6A",style:{width:"31px"},children:"PCS"}),(0,m.jsx)("div",{className:"right6Ad code6A",style:{width:"40px"},children:"WT"}),(0,m.jsx)("div",{className:"right6Ac code6A",style:{width:"33px",borderLeft:"1px solid #989898"},children:"PCS"}),(0,m.jsx)("div",{className:"right6Ad code6A",style:{width:"32px"},children:"WT"})]}),null===i||void 0===i||null===(ol=i.data)||void 0===ol?void 0:ol.map(((l,i)=>{var d,o,e;return(0,m.jsxs)("div",{className:"main6Ahead",children:[(0,m.jsx)("div",{className:"right6Aa",style:{width:"120px",fontSize:(null===l||void 0===l||null===(d=l.ConcatedFullShapeQualityColorCode)||void 0===d?void 0:d.length)>44?"9px":"10px"},children:null==(null===l||void 0===l?void 0:l.ConcatedFullShapeQualityColorCode)?"NA":null===l||void 0===l?void 0:l.ConcatedFullShapeQualityColorCode}),(0,m.jsx)("div",{className:"right6Ab",style:{width:"90px"},children:null===l||void 0===l?void 0:l.Sizename}),(0,m.jsx)("div",{className:"right6Ac",style:{width:"31px"},children:null===l||void 0===l?void 0:l.ActualPcs}),(0,m.jsx)("div",{className:"right6Ad",style:{width:"40px"},children:null===l||void 0===l||null===(o=l.ActualWeight)||void 0===o?void 0:o.toFixed(3)}),(0,m.jsx)("div",{className:"right6Ac",style:{borderLeft:"1px solid #989898",width:"33px"},children:0===(null===l||void 0===l?void 0:l.IssuePcs)?"":null===l||void 0===l?void 0:l.IssuePcs}),(0,m.jsx)("div",{className:"right6Ad",style:{width:"32px"},children:0===(null===l||void 0===l?void 0:l.IssueWeight)?"":null===l||void 0===l||null===(e=l.IssueWeight)||void 0===e?void 0:e.toFixed(3)})]},i)})),Array.from({length:null===i||void 0===i?void 0:i.length},((l,i)=>(0,m.jsxs)("div",{className:"main6Ahead",children:[(0,m.jsx)("div",{className:"right6Aa",style:{width:"120px"}}),(0,m.jsx)("div",{className:"right6Ab",style:{width:"90px"}}),(0,m.jsx)("div",{className:"right6Ac",style:{width:"31px"}}),(0,m.jsx)("div",{className:"right6Ad",style:{width:"40px"}}),(0,m.jsx)("div",{className:"right6Ac",style:{width:"33px",borderLeft:"1px solid #989898"}}),(0,m.jsx)("div",{className:"right6Ad",style:{width:"32px"}})]},i)))]})}),(0,m.jsxs)("div",{className:"job6Afooter",children:[(0,m.jsxs)("div",{className:"job6AfooterDesc",style:{borderTop:"0px",height:"81px"},children:[(0,m.jsx)("div",{className:"cust6A",children:(0,m.jsxs)("p",{className:"f6A",children:["CUST. INS.",(0,m.jsx)("span",{className:"f6A ",children:" "+((null===l||void 0===l||null===(el=l.data)||void 0===el||null===(al=el.rd)||void 0===al||null===(sl=al.ProductInstruction)||void 0===sl?void 0:sl.length)>0?(0,x.WW)(null===l||void 0===l||null===(nl=l.data)||void 0===nl||null===(tl=nl.rd)||void 0===tl?void 0:tl.ProductInstruction):(0,x.WW)(null===l||void 0===l||null===(vl=l.data)||void 0===vl||null===(cl=vl.rd)||void 0===cl?void 0:cl.QuoteRemark))})]})}),(0,m.jsx)("div",{className:"cust6A",children:(0,m.jsxs)("p",{className:"f6A",children:["PRD. INS.",(0,m.jsx)("span",{className:"f6A ",children:" "+(0,x.WW)(null===l||void 0===l||null===(rl=l.data)||void 0===rl||null===(ul=rl.rd)||void 0===ul?void 0:ul.officeuse)})]})}),(0,m.jsx)("div",{className:"cust6A",style:{borderBottom:"0px"},children:(0,m.jsxs)("p",{className:"f6A",children:["STM. INS.",(0,m.jsx)("span",{className:"f6A ",children:" "+(0,x.WW)(null===l||void 0===l||null===(hl=l.data)||void 0===hl||null===(xl=hl.rd)||void 0===xl?void 0:xl.stamping)})]})})]}),(0,m.jsx)("div",{className:"qrcodebg6A",children:(0,m.jsx)(c.Z,{text:null===l||void 0===l||null===(ml=l.data)||void 0===ml?void 0:ml.rd.serialjobno})})]})]}),(0,m.jsx)("div",{className:"d-flex justify-content-start ps-5",style:{fontSize:"9px"},children:(null===l||void 0===l||null===(Al=l.data)||void 0===Al||null===(jl=Al.rd)||void 0===jl?void 0:jl.showingDateTimeByJob)+" "+(null===l||void 0===l||null===(pl=l.data)||void 0===pl||null===(Nl=pl.rd)||void 0===Nl?void 0:Nl.Certifiacte)})]},o)})):(0,m.jsxs)("div",{className:"containerWD6A",children:[(0,m.jsxs)("div",{className:"container6A",children:[(0,m.jsxs)("div",{className:"jobInfo6A",children:[(0,m.jsxs)("div",{className:"jobInfo6Aheader",children:[(0,m.jsxs)("div",{className:"jobName6AD h6A",style:{fontWeight:"bold"},children:[(0,m.jsx)("div",{children:null===l||void 0===l||null===(t=l.data)||void 0===t||null===(r=t.rd)||void 0===r?void 0:r.serialjobno}),(0,m.jsx)("div",{children:null===l||void 0===l||null===(u=l.data)||void 0===u||null===(h=u.rd)||void 0===h?void 0:h.Designcode}),(0,m.jsx)("div",{className:"pe-1",style:{color:"red"},children:(null==(null===l||void 0===l||null===(A=l.data)||void 0===A||null===(j=A.rd)||void 0===j?void 0:j.MetalType)?"NA":null===l||void 0===l||null===(p=l.data)||void 0===p||null===(N=p.rd)||void 0===N?void 0:N.MetalType)+" "+(null==(null===l||void 0===l||null===(g=l.data)||void 0===g||null===(w=g.rd)||void 0===w?void 0:w.MetalColorCo)?"NA":null===l||void 0===l||null===(y=l.data)||void 0===y||null===(b=y.rd)||void 0===b?void 0:b.MetalColorCo)})]}),(0,m.jsxs)("div",{className:"jobName6A",children:[(0,m.jsx)("div",{className:"job6Ahww",children:"TR NO."}),(0,m.jsx)("div",{className:"job6Ahww",children:"TR NO."}),(0,m.jsx)("div",{className:"job6Ahww",children:"TR NO."}),(0,m.jsx)("div",{className:"job6Ahww borderRight6A",style:{width:"50.5px"},children:null===l||void 0===l||null===(f=l.data)||void 0===f||null===(S=f.rd)||void 0===S?void 0:S.OrderNo})]}),(0,m.jsxs)("div",{className:"jobName6A",children:[(0,m.jsx)("div",{className:"job6Ahww",style:{fontSize:"".concat((null===l||void 0===l||null===(W=l.data)||void 0===W||null===(C=W.rd)||void 0===C||null===(P=C.ProductType)||void 0===P?void 0:P.length)>18?"8.5px":"9.5px")},children:null===l||void 0===l||null===(T=l.data)||void 0===T||null===(M=T.rd)||void 0===M?void 0:M.ProductType}),(0,m.jsx)("div",{className:"job6Ahww",children:null===l||void 0===l||null===(D=l.data)||void 0===D||null===(F=D.rd)||void 0===F?void 0:F.Size}),(0,m.jsx)("div",{className:"job6Ahww",children:null===l||void 0===l||null===(I=l.data)||void 0===I||null===(R=I.rd)||void 0===R?void 0:R.CustomerCode}),(0,m.jsx)("div",{className:"job6Ahww borderRight6A",style:{width:"50.5px"},children:null===l||void 0===l||null===(z=l.data.rd)||void 0===z?void 0:z.PO})]}),(0,m.jsxs)("div",{className:"jobName6A",children:[(0,m.jsx)("div",{className:"job6Ahww",children:"CS WT/PC"}),(0,m.jsx)("div",{className:"job6Ahww",children:"DIA WT/PC"}),(0,m.jsx)("div",{className:"job6Ahww",children:"Nt Wt/Gr Wt"}),(0,m.jsx)("div",{className:"job6Ahww borderRight6A",style:{backgroundColor:"".concat(null===l||void 0===l||null===(O=l.data)||void 0===O||null===(E=O.rd)||void 0===E?void 0:E.prioritycolorcode),width:"50.5px"},children:null===l||void 0===l||null===(J=l.data)||void 0===J||null===(k=J.rd)||void 0===k?void 0:k.prioritycode})]}),(0,m.jsxs)("div",{className:"jobName6A",style:{borderBottom:"0px"},children:[(0,m.jsxs)("div",{className:"job6Ahww",children:[null===l||void 0===l||null===(_=l.additional)||void 0===_||null===(q=_.clr)||void 0===q||null===(Q=q.ActualWeight)||void 0===Q?void 0:Q.toFixed(3),"/",null===l||void 0===l||null===(Z=l.additional)||void 0===Z||null===(B=Z.clr)||void 0===B?void 0:B.ActualPcs]}),(0,m.jsxs)("div",{className:"job6Ahww",children:[null===l||void 0===l||null===(L=l.additional)||void 0===L||null===(U=L.dia)||void 0===U||null===(G=U.ActualWeight)||void 0===G?void 0:G.toFixed(3),"/",null===l||void 0===l||null===(Y=l.additional)||void 0===Y||null===(H=Y.dia)||void 0===H?void 0:H.ActualPcs]}),(0,m.jsxs)("div",{className:"job6Ahww",children:[null===l||void 0===l||null===(K=l.data)||void 0===K||null===(V=K.rd)||void 0===V||null===(X=V.ActualGrossweight)||void 0===X?void 0:X.toFixed(3),"/",null===l||void 0===l||null===($=l.data)||void 0===$||null===(ll=$.rd)||void 0===ll||null===(il=ll.MetalWeight)||void 0===il?void 0:il.toFixed(3)]}),(0,m.jsx)("div",{className:"job6Ahww borderRight6A",style:{width:"50.5px"},children:null!==(dl=null===l||void 0===l||null===(ol=l.data)||void 0===ol||null===(el=ol.rd)||void 0===el?void 0:el.promiseDatef)&&void 0!==dl?dl:""})]})]}),(0,m.jsxs)("div",{className:"imgSize6A",children:[" ",(0,m.jsx)("img",{src:""!==(null===l||void 0===l||null===(al=l.additional)||void 0===al?void 0:al.img)?null===l||void 0===l||null===(sl=l.additional)||void 0===sl?void 0:sl.img:d(46507),id:"img6A",alt:"",onError:l=>(0,v.M)(l),loading:"eager"})]})]}),(0,m.jsxs)("div",{className:"main6A",style:{width:"345px"},children:[(0,m.jsxs)("div",{className:"required6A",style:{width:"275.57px"},children:[(0,m.jsx)("div",{className:"lbh6A",children:"Required Material"}),(0,m.jsxs)("div",{className:"main6Ahead",children:[(0,m.jsx)("div",{className:"right6Aa",style:{width:"120px"},children:"CODE"}),(0,m.jsx)("div",{className:"right6Ab",style:{width:"90px"},children:"SIZE"}),(0,m.jsx)("div",{className:"right6Ac",style:{width:"31px"},children:"PCS"}),(0,m.jsx)("div",{className:"right6Ad",style:{width:"40px"},children:"WT"})]}),(0,m.jsxs)("div",{className:"main6Ahead",style:{height:"18px"},children:[(0,m.jsx)("div",{className:"right6Aa",style:{width:"120px"},children:(null==(null===l||void 0===l||null===(nl=l.data)||void 0===nl||null===(tl=nl.rd)||void 0===tl?void 0:tl.MetalType)?"NA":null===l||void 0===l||null===(vl=l.data)||void 0===vl||null===(cl=vl.rd)||void 0===cl?void 0:cl.MetalType)+" "+(null==(null===l||void 0===l||null===(rl=l.data)||void 0===rl||null===(ul=rl.rd)||void 0===ul?void 0:ul.MetalColorCo)?"NA":null===l||void 0===l||null===(hl=l.data)||void 0===hl||null===(xl=hl.rd)||void 0===xl?void 0:xl.MetalColorCo)}),(0,m.jsx)("div",{className:"right6Ab",style:{width:"90px"}}),(0,m.jsx)("div",{className:"right6Ac",style:{width:"31px"}}),(0,m.jsx)("div",{className:"right6Ad",style:{width:"40px"}})]}),Array.from({length:11},((l,i)=>(0,m.jsxs)("div",{className:"main6Ahead",style:{height:"20px"},children:[(0,m.jsx)("div",{className:"right6Aa",style:{width:"120px"}}),(0,m.jsx)("div",{className:"right6Ab",style:{width:"90px"}}),(0,m.jsx)("div",{className:"right6Ac",style:{width:"31px"}}),(0,m.jsx)("div",{className:"right6Ad",style:{width:"40px"}})]},i)))]}),(0,m.jsxs)("div",{className:"issue6A",style:{width:"70px"},children:[(0,m.jsx)("div",{className:"lbh6A",children:(0,m.jsx)("p",{style:{borderRight:"0px"},children:"Issue Material"})}),(0,m.jsxs)("div",{className:"aside6A",style:{width:"70px"},children:[(0,m.jsx)("div",{className:"right6Ac w-50",children:"PCS"}),(0,m.jsx)("div",{className:"right6Ad w-50",children:"WT"})]}),(0,m.jsxs)("div",{className:"aside6A",style:{height:"18px"},children:[(0,m.jsx)("div",{className:"right6Ac w-50"}),(0,m.jsx)("div",{className:"right6Ad w-50"})]}),Array.from({length:11},((l,i)=>(0,m.jsxs)("div",{className:"aside6A",style:{height:"20px",width:"70px"},children:[(0,m.jsx)("div",{className:"right6Ac w-50"}),(0,m.jsx)("div",{className:"right6Ad w-50"})]},i)))]})]}),(0,m.jsxs)("div",{className:"job6Afooter",children:[(0,m.jsxs)("div",{className:"job6AfooterDesc",style:{borderTop:"0px",height:"81px"},children:[(0,m.jsx)("div",{className:"cust6A",children:(0,m.jsxs)("p",{className:"f6A ",style:{fontSize:"11px"},children:["CUST. INS.",(0,m.jsx)("span",{className:"f6A pt-1",style:{color:"red"},children:" "+((null===l||void 0===l||null===(ml=l.data)||void 0===ml||null===(Al=ml.rd)||void 0===Al||null===(jl=Al.ProductInstruction)||void 0===jl?void 0:jl.length)>0?(0,x.WW)(null===l||void 0===l||null===(pl=l.data)||void 0===pl||null===(Nl=pl.rd)||void 0===Nl?void 0:Nl.ProductInstruction):(0,x.WW)(null===l||void 0===l||null===(gl=l.data)||void 0===gl||null===(wl=gl.rd)||void 0===wl?void 0:wl.QuoteRemark))})]})}),(0,m.jsx)("div",{className:"cust6A",children:(0,m.jsxs)("p",{className:"f6A",style:{fontSize:"11px"},children:["PRD. INS.",(0,m.jsx)("span",{className:"f6A pt-1",style:{color:"red"},children:" "+(0,x.WW)(null===l||void 0===l||null===(yl=l.data)||void 0===yl||null===(bl=yl.rd)||void 0===bl?void 0:bl.officeuse)})]})}),(0,m.jsx)("div",{className:"cust6A",style:{borderBottom:"0px"},children:(0,m.jsxs)("p",{className:"f6A",style:{fontSize:"11px"},children:["STM. INS.",(0,m.jsx)("span",{className:"f6A pt-1",style:{color:"red"},children:" "+(0,x.WW)(null===l||void 0===l||null===(fl=l.data)||void 0===fl||null===(Sl=fl.rd)||void 0===Sl?void 0:Sl.stamping)})]})})]}),(0,m.jsx)("div",{className:"qrcodebg6A",children:(0,m.jsx)(c.Z,{text:null===l||void 0===l||null===(Wl=l.data)||void 0===Wl||null===(Cl=Wl.rd)||void 0===Cl?void 0:Cl.serialjobno})})]})]},i),(0,m.jsx)("div",{className:"d-flex justify-content-start ps-5",style:{fontSize:"9px"},children:null===l||void 0===l||null===(Pl=l.data)||void 0===Pl||null===(Tl=Pl.rd)||void 0===Tl?void 0:Tl.showingDateTimeByJob})]})},i)})))]})]})})}}}]);
//# sourceMappingURL=1781.96e04563.chunk.js.map