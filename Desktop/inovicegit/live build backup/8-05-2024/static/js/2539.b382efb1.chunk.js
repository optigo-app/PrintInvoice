"use strict";(self.webpackChunkinvoice=self.webpackChunkinvoice||[]).push([[2539],{80380:(l,d,i)=>{i.d(d,{Z:()=>s});i(72791);var e=i(80184);const s=()=>(0,e.jsx)("div",{className:"d-flex justify-content-end align-items-center mt-1",children:(0,e.jsx)("button",{className:"btn_white blue",value:"Print",onClick:l=>(l=>{l.preventDefault(),window.print()})(l),children:"Print"})})},41457:(l,d,i)=>{i.r(d),i.d(d,{default:()=>r});var e=i(72791),s=(i(872),i(80380)),o=i(80444),n=i(1683),c=i(89995),t=i(58121),a=i.n(t),v=i(80184);const r=l=>{var d,i,t,r,p,u,h,m,x,f,j,N,w,_,b,y,g,A,R,C,T,S,k,F,E,D,P,M,I,W,H,L,J,O,B,U,z,Q,K,G,Z,V,q,X,Y,$,ll,dl,il,el,sl,ol,nl,cl,tl,al,vl,rl,pl,ul,hl,ml,xl,fl,jl,Nl,wl,_l,bl,yl,gl,Al;let{urls:Rl,token:Cl,invoiceNo:Tl,printName:Sl,evn:kl,ApiVer:Fl}=l;const[El,Dl]=(0,e.useState)({}),[Pl,Ml]=(0,e.useState)([]),[Il,Wl]=(0,e.useState)([]),[Hl,Ll]=(0,e.useState)({}),[Jl,Ol]=(0,e.useState)(null),[Bl,Ul]=(0,e.useState)(0),[zl,Ql]=(0,e.useState)(0),[Kl,Gl]=(0,e.useState)(0),[Zl,Vl]=(0,e.useState)(0),[ql,Xl]=(0,e.useState)(""),[Yl,$l]=(0,e.useState)([]),[ld,dd]=(0,e.useState)([]),[id,ed]=(0,e.useState)([]),[sd,od]=(0,e.useState)(""),[nd,cd]=(0,e.useState)(!0),[td,ad]=(0,e.useState)(!0);(0,e.useEffect)((()=>{(async()=>{try{const l=await(0,n.k_)(Cl,Tl,Sl,Rl,kl,Fl);if("200"===(null===l||void 0===l?void 0:l.Status)){(0,n.nK)(null===l||void 0===l?void 0:l.Data)?(cd(!1),od("Data Not Found")):(vd(null===l||void 0===l?void 0:l.Data),Xl(null===l||void 0===l?void 0:l.Data),cd(!1))}else cd(!1),od(null===l||void 0===l?void 0:l.Message)}catch(l){console.error(l)}})()}),[]);const vd=l=>{var d,i,e,s;let o=null===l||void 0===l||null===(d=l.BillPrint_Json[0])||void 0===d||null===(i=d.Printlable)||void 0===i?void 0:i.split("\r\n");l.BillPrint_Json[0].address=o;const n=(0,c.g)(null===l||void 0===l?void 0:l.BillPrint_Json[0],null===l||void 0===l?void 0:l.BillPrint_Json1,null===l||void 0===l?void 0:l.BillPrint_Json2);null===n||void 0===n||null===(e=n.resultArray)||void 0===e||e.forEach((l=>{var d,i;let e=[];null===l||void 0===l||null===(d=l.diamonds)||void 0===d||d.forEach((l=>{let d=a()(l),i=null===e||void 0===e?void 0:e.findIndex((d=>(null===d||void 0===d?void 0:d.ShapeName)===(null===l||void 0===l?void 0:l.ShapeName)&&(null===d||void 0===d?void 0:d.SizeName)===(null===l||void 0===l?void 0:l.SizeName)&&(null===d||void 0===d?void 0:d.QualityName)===(null===l||void 0===l?void 0:l.QualityName)&&(null===d||void 0===d?void 0:d.Colorname)===(null===l||void 0===l?void 0:l.Colorname)&&(null===d||void 0===d?void 0:d.Rate)===(null===l||void 0===l?void 0:l.Rate)));-1===i?e.push(d):(e[i].Wt+=null===d||void 0===d?void 0:d.Wt,e[i].Pcs+=null===d||void 0===d?void 0:d.Pcs,e[i].Amount+=null===d||void 0===d?void 0:d.Amount)})),l.diamonds=e;let s=[];null===l||void 0===l||null===(i=l.colorstone)||void 0===i||i.forEach((l=>{let d=a()(l),i=null===s||void 0===s?void 0:s.findIndex((d=>(null===d||void 0===d?void 0:d.ShapeName)===(null===l||void 0===l?void 0:l.ShapeName)&&(null===d||void 0===d?void 0:d.SizeName)===(null===l||void 0===l?void 0:l.SizeName)&&(null===d||void 0===d?void 0:d.QualityName)===(null===l||void 0===l?void 0:l.QualityName)&&(null===d||void 0===d?void 0:d.Colorname)===(null===l||void 0===l?void 0:l.Colorname)&&(null===d||void 0===d?void 0:d.Rate)===(null===l||void 0===l?void 0:l.Rate)));-1===i?s.push(d):(s[i].Wt+=null===d||void 0===d?void 0:d.Wt,s[i].Pcs+=null===d||void 0===d?void 0:d.Pcs,s[i].Amount+=null===d||void 0===d?void 0:d.Amount)})),l.colorstone=s}));let t=[];null===n||void 0===n||null===(s=n.resultArray)||void 0===s||s.forEach((l=>{let d={...l},i=[];1===(null===l||void 0===l?void 0:l.IsCriteriabasedAmount)?(1===(null===l||void 0===l?void 0:l.IsMetalAmount)&&i.push("Metal"),1===(null===l||void 0===l?void 0:l.IsDiamondAmount)&&i.push("Diamond"),1===(null===l||void 0===l?void 0:l.IsStoneAmount)&&i.push("Stone"),1===(null===l||void 0===l?void 0:l.IsMiscAmount)&&i.push("Misc"),1===(null===l||void 0===l?void 0:l.IsLabourAmount)&&i.push("Labour"),1===(null===l||void 0===l?void 0:l.IsSolitaireAmount)&&i.push("Solitaire")):0!==(null===l||void 0===l?void 0:l.Discount)&&i.push("Total Amount"),d.discountOn=i,d.str_discountOn=null===i||void 0===i?void 0:i.join(", "),d.str_discountOn=(null===d||void 0===d?void 0:d.str_discountOn)+" Amount",t.push(d)})),n.resultArray=t,Ol(n),cd(!1)};return(0,v.jsx)(v.Fragment,{children:nd?(0,v.jsx)(o.Z,{}):(0,v.jsx)(v.Fragment,{children:""===sd?(0,v.jsxs)(v.Fragment,{children:[(0,v.jsxs)("div",{className:"btnpcl",children:[" ",(0,v.jsx)(s.Z,{})," "]}),(0,v.jsxs)("div",{className:"pclprint pad_60_allPrint",children:[(0,v.jsxs)("div",{className:"pclheader",children:[(0,v.jsx)("div",{className:"orailpcl",children:td&&""!==(null===Jl||void 0===Jl||null===(d=Jl.header)||void 0===d?void 0:d.PrintLogo)&&(0,v.jsx)("img",{src:null===Jl||void 0===Jl||null===(i=Jl.header)||void 0===i?void 0:i.PrintLogo,alt:"",className:"w-100 h-auto ms-auto d-block object-fit-contain",onError:()=>{ad(!1)},height:120,width:150,style:{maxWidth:"116px"}})}),(0,v.jsxs)("div",{className:"addresspcl fspcl",children:[null===Jl||void 0===Jl||null===(t=Jl.header)||void 0===t||null===(r=t.CompanyAddress)||void 0===r?void 0:r.split(",")[0]," ",null===Jl||void 0===Jl||null===(p=Jl.header)||void 0===p||null===(u=p.CompanyAddress2)||void 0===u?void 0:u.split(",")[0]," ",null===Jl||void 0===Jl||null===(h=Jl.header)||void 0===h?void 0:h.CompanyCity," -"," ",null===Jl||void 0===Jl||null===(m=Jl.header)||void 0===m?void 0:m.CompanyPinCode]}),(0,v.jsx)("div",{className:"pclheaderplist",children:null===Jl||void 0===Jl||null===(x=Jl.header)||void 0===x?void 0:x.PrintHeadLabel}),(0,v.jsxs)("div",{className:"d-flex fw-bold justify-content-center align-items-center",children:["( ",""===(null===Jl||void 0===Jl||null===(f=Jl.header)||void 0===f?void 0:f.PrintRemark)?"":(0,v.jsx)("b",{className:"d-flex fspcl",dangerouslySetInnerHTML:{__html:null===Jl||void 0===Jl||null===(j=Jl.header)||void 0===j||null===(N=j.PrintRemark)||void 0===N?void 0:N.replace(/<br\s*\/?>/gi," ")}})," )"]})]}),(0,v.jsxs)("div",{className:"pclsubheader",children:[(0,v.jsxs)("div",{className:"partynamepcl",children:[(0,v.jsx)("b",{className:"partypcl fspcl_3 ",children:"Party:"})," ",(0,v.jsxs)("div",{className:"contentpclparty fspcl_3",children:[" ",null===Jl||void 0===Jl||null===(w=Jl.header)||void 0===w?void 0:w.customerfirmname," "]})]}),(0,v.jsxs)("div",{className:"w-25",children:[(0,v.jsxs)("div",{className:"d-flex justify-content-between align-items-center",children:[(0,v.jsxs)("div",{className:"d-flex justify-content-end align-items-center fspcl_3 w-50",children:[" Invoice No:"," "," "]})," ",(0,v.jsxs)("b",{className:"d-flex justify-content-end align-items-center fspcl_3 w-50",children:[" ",null===Jl||void 0===Jl||null===(_=Jl.header)||void 0===_?void 0:_.InvoiceNo," "]})]}),(0,v.jsxs)("div",{className:"d-flex align-items-center",children:[(0,v.jsxs)("div",{className:"d-flex justify-content-end align-items-center fspcl_3 w-50",children:[" Date:"," "," "]})," ",(0,v.jsxs)("b",{className:"d-flex justify-content-end align-items-center fspcl_3 w-50",children:[" ",null===Jl||void 0===Jl||null===(b=Jl.header)||void 0===b?void 0:b.EntryDate," "]})]})]})]}),(0,v.jsxs)("div",{className:"pcltable",children:[(0,v.jsx)("div",{className:"pcltablecontent",children:(0,v.jsxs)("table",{children:[(0,v.jsx)("thead",{children:(0,v.jsx)("tr",{children:(0,v.jsx)("td",{children:(0,v.jsxs)("div",{className:"pcltablehead border-start border-end border-bottom border-black ",children:[(0,v.jsx)("div",{className:"srnopclthead centerpcl fwboldpcl srfslhpcl fspcl",style:{wordBreak:"break-word"},children:" Sr No "}),(0,v.jsx)("div",{className:"jewpclthead fwboldpcl fspcl fspcl",children:" Jewelcode "}),(0,v.jsxs)("div",{className:"diamheadpcl",children:[(0,v.jsx)("div",{className:"diamhpclcol1 fwboldpcl fspcl",children:" Diamond "}),(0,v.jsxs)("div",{className:"diamhpclcol",children:[(0,v.jsx)("div",{className:"dcolsthpcl centerpcl fwboldpcl fspcl",style:{width:"27%"},children:" Shape "}),(0,v.jsx)("div",{className:"dcolsthpcl centerpcl fwboldpcl fspcl",style:{width:"27%"},children:" Size "}),(0,v.jsx)("div",{className:"dcolsthpcl centerpcl fwboldpcl fspcl",style:{width:"22%"},children:" Wt "}),(0,v.jsx)("div",{className:"dcolsthpcl centerpcl fwboldpcl fspcl",style:{width:"22%"},children:" Rate "}),(0,v.jsx)("div",{className:"dcolsthpcl centerpcl fwboldpcl fspcl",style:{borderRight:"0px",width:"27%"},children:" Amount "})]})]}),(0,v.jsxs)("div",{className:"diamheadpcl",children:[(0,v.jsx)("div",{className:"diamhpclcol1 fwboldpcl fspcl",children:" Metal "}),(0,v.jsxs)("div",{className:"diamhpclcol w-100",children:[(0,v.jsx)("div",{className:"dcolsthpcl centerpcl fwboldpcl fspcl",style:{width:"22%"},children:" KT "}),(0,v.jsx)("div",{className:"dcolsthpcl centerpcl fwboldpcl fspcl",style:{width:"18%"},children:" Gr Wt "}),(0,v.jsx)("div",{className:"dcolsthpcl centerpcl fwboldpcl fspcl",style:{width:"18%"},children:" N + L "}),(0,v.jsx)("div",{className:"dcolsthpcl centerpcl fwboldpcl fspcl",style:{width:"20%"},children:" Rate "}),(0,v.jsx)("div",{className:"dcolsthpcl centerpcl fwboldpcl fspcl",style:{borderRight:"0px",width:"22%"},children:" Amount "})]})]}),(0,v.jsxs)("div",{className:"shptheadpcl",children:[(0,v.jsx)("div",{className:"shpcolpcl1 fwboldpcl fspcl",children:" Stone "}),(0,v.jsxs)("div",{className:"shpcolpclcol",children:[(0,v.jsx)("div",{className:"shpthcolspcl centerpcl fwboldpcl fspcl",style:{width:"27%"},children:" Shape "}),(0,v.jsx)("div",{className:"shpthcolspcl centerpcl fwboldpcl fspcl",style:{width:"22%"},children:" Wt "}),(0,v.jsx)("div",{className:"shpthcolspcl centerpcl fwboldpcl fspcl",style:{width:"23%"},children:" Rate "}),(0,v.jsx)("div",{className:"shpthcolspcl centerpcl fwboldpcl fspcl",style:{borderRight:"0px",width:"28%"},children:" Amount "})]})]}),(0,v.jsxs)("div",{className:"lotheadpcl",children:[(0,v.jsx)("div",{className:"lbhthpcl fwboldpcl fspcl",children:" Labour "}),(0,v.jsxs)("div",{className:"lbhthpclcol",children:[(0,v.jsx)("div",{className:"lopclcol centerpcl fwboldpcl fspcl",children:" Rate "}),(0,v.jsx)("div",{className:"lopclcol centerpcl fwboldpcl fspcl",style:{borderRight:"0px"},children:" Amount "})]})]}),(0,v.jsxs)("div",{className:"lotheadpcl",children:[(0,v.jsx)("div",{className:"lbhthpcl fwboldpcl fspcl",children:" Other "}),(0,v.jsxs)("div",{className:"lbhthpclcol",children:[(0,v.jsx)("div",{className:"lopclcol centerpcl fwboldpcl fspcl",children:" Code "}),(0,v.jsx)("div",{className:"lopclcol centerpcl fwboldpcl fspcl",style:{borderRight:"0px"},children:" Amount "})]})]}),(0,v.jsx)("div",{className:"pricetheadpcl fwboldpcl fspcl",children:" Price "})]})})})}),(0,v.jsx)("tbody",{children:null===Jl||void 0===Jl||null===(y=Jl.resultArray)||void 0===y?void 0:y.map(((l,d)=>{var i,e,s,o,c,t,a,r,p,u,h,m,x,f,j,N,w,_,b,y,g,A,R,C,T,S,k,F,E,D,P,M,I,W,H,L,J,O,B,U,z,Q,K,G,Z,V,q,X,Y,$,ll,dl,il,el,sl,ol,nl,cl,tl,al,vl,rl,pl;return(0,v.jsx)("tr",{children:(0,v.jsx)("td",{children:(0,v.jsxs)("div",{className:"tablebodypcl border-start border-end border-bottom border-black",style:{marginTop:"-2px"},children:[(0,v.jsxs)("div",{className:"tbodyrowpcl",children:[(0,v.jsxs)("div",{className:"pcltbr1c1 fspcl",children:[" ",d+1," "]}),(0,v.jsxs)("div",{className:"pcltbr1c2 fspcl",children:[(0,v.jsxs)("div",{className:"fspcl w-100  text-break",children:[" ",(null===l||void 0===l?void 0:l.JewelCodePrefix)+(null===l||void 0===l?void 0:l.Category_Prefix)+(null===l||void 0===l||null===(i=l.SrJobno)||void 0===i?void 0:i.split("/")[1])," "]}),(0,v.jsx)("div",{className:"designimgpcl fspcl",children:(0,v.jsx)("img",{src:null===l||void 0===l?void 0:l.DesignImage,alt:"packinglist",id:"designimgpclid",onError:l=>(0,n.Mp)(l)})}),""===(null===l||void 0===l?void 0:l.HUID)?"":(0,v.jsxs)("div",{className:"fspcl text-break",children:[" HUID - ",null===l||void 0===l?void 0:l.HUID," "]}),(0,v.jsx)("div",{className:"fspcl text-break text-center w-100",children:null===l||void 0===l?void 0:l.lineid})]}),(0,v.jsxs)("div",{className:"pcltbr1c3 fspcl",children:[(0,v.jsxs)("div",{className:"dcolsthpcl fspcl pt-1",style:{width:"27%"},children:[" ",null===l||void 0===l||null===(e=l.diamonds)||void 0===e?void 0:e.map(((l,d)=>(0,v.jsx)("div",{className:" fspcl text-break",children:"  "},d)))]}),(0,v.jsx)("div",{className:"dcolsthpcl fspcl pt-1",style:{width:"27%"},children:null===l||void 0===l||null===(s=l.diamonds)||void 0===s?void 0:s.map(((l,d)=>(0,v.jsxs)("div",{className:" fspcl text-break ",children:[" ",null===l||void 0===l?void 0:l.SizeName," "]},d)))}),(0,v.jsx)("div",{className:"dcolsthpcl fspcl pt-1",style:{width:"22%"},children:null===l||void 0===l||null===(o=l.diamonds)||void 0===o?void 0:o.map(((l,d)=>{var i;return(0,v.jsxs)("div",{className:" fspcl end_pcl_new end_p_pcl_new",children:[" ",null===l||void 0===l||null===(i=l.Wt)||void 0===i?void 0:i.toFixed(3)," "]},d)}))}),(0,v.jsx)("div",{className:"dcolsthpcl fspcl pt-1",style:{width:"22%"},children:null===l||void 0===l||null===(c=l.diamonds)||void 0===c?void 0:c.map(((l,d)=>(0,v.jsxs)("div",{className:" fspcl end_pcl_new end_p_pcl_new",children:[" ",(0,n.dN)(null===l||void 0===l?void 0:l.Rate)," "]},d)))}),(0,v.jsx)("div",{className:"dcolsthpcl fspcl pt-1",style:{borderRight:"0px",width:"27%"},children:null===l||void 0===l||null===(t=l.diamonds)||void 0===t?void 0:t.map(((l,d)=>{var i;return(0,v.jsxs)("div",{className:" fspcl end_pcl_new end_p_pcl_new",children:[" ",(0,n.dN)((null===l||void 0===l?void 0:l.Amount)/(null===Jl||void 0===Jl||null===(i=Jl.header)||void 0===i?void 0:i.CurrencyExchRate))," "]},d)}))})]}),(0,v.jsxs)("div",{className:"pcltbr1c3 fspcl d-flex flex-column justify-content-start",children:[""!==(null===l||void 0===l?void 0:l.JobRemark)?(0,v.jsxs)(v.Fragment,{children:[(0,v.jsxs)("div",{className:"w-100 d-flex",style:{borderBottom:"1px solid #989898"},children:[(0,v.jsx)("div",{className:"dcolsthpcl fspcl",style:{width:"22%"},children:null===l||void 0===l||null===(a=l.metal)||void 0===a?void 0:a.map(((l,d)=>(0,v.jsxs)("div",{className:"leftpcl fspcl p_2_pcl text-break",children:[" "," "," ",(null===l||void 0===l?void 0:l.ShapeName)+" "+(null===l||void 0===l?void 0:l.QualityName)," "," "]},d)))}),(0,v.jsx)("div",{className:"dcolsthpcl  fspcl p_2_pcl end_pcl_new end_p_pcl_new",style:{width:"18%"},children:null===l||void 0===l||null===(r=l.grosswt)||void 0===r?void 0:r.toFixed(3)}),(0,v.jsx)("div",{className:"dcolsthpcl end_pcl_new end_p_pcl_new fspcl p_2_pcl",style:{width:"18%"},children:null===l||void 0===l||null===(p=l.totals)||void 0===p||null===(u=p.metal)||void 0===u||null===(h=u.IsPrimaryMetal)||void 0===h?void 0:h.toFixed(3)}),(0,v.jsx)("div",{className:"dcolsthpcl fspcl p_2_pcl",style:{width:"20%"},children:null===l||void 0===l||null===(m=l.metal)||void 0===m?void 0:m.map(((l,d)=>(0,v.jsxs)("div",{className:"end_pcl_new end_p_pcl_new fspcl ",children:[" "," "," ",(0,n.dN)(null===l||void 0===l?void 0:l.Rate)," "," "," "," "]},d)))}),(0,v.jsx)("div",{className:"dcolsthpcl fspcl",style:{borderRight:"0px",width:"22%"},children:null===l||void 0===l||null===(x=l.metal)||void 0===x?void 0:x.map(((l,d)=>{var i;return(0,v.jsxs)("div",{className:"end_pcl_new end_p_pcl_new fspcl p_2_pcl",children:[" "," "," ",(0,n.dN)((null===l||void 0===l?void 0:l.Amount)/(null===Jl||void 0===Jl||null===(i=Jl.header)||void 0===i?void 0:i.CurrencyExchRate))," "," "]},d)}))})]}),(0,v.jsxs)("div",{className:"mt-3 ps-1",children:["Remark: ",(0,v.jsx)("br",{})," ",(0,v.jsxs)("b",{className:"text-break",children:[" ",null===l||void 0===l?void 0:l.JobRemark]})]})]}):(0,v.jsxs)("div",{className:"w-100 d-flex h-100",children:[(0,v.jsx)("div",{style:{width:"22%"},className:"be_1_pcl pt-1",children:null===l||void 0===l||null===(f=l.metal)||void 0===f?void 0:f.map(((l,d)=>(0,v.jsxs)("div",{className:" fspcl text-break",children:[1===(null===l||void 0===l?void 0:l.IsPrimaryMetal)&&(null===l||void 0===l?void 0:l.ShapeName)+" "+(null===l||void 0===l?void 0:l.QualityName)," "]},d)))}),(0,v.jsx)("div",{style:{width:"18%"},className:"be_1_pcl d-flex justify-content-end pt-1 end_p_pcl_new",children:null===l||void 0===l||null===(j=l.grosswt)||void 0===j?void 0:j.toFixed(3)}),(0,v.jsx)("div",{style:{width:"18%"},className:"be_1_pcl d-flex justify-content-end pt-1  end_p_pcl_new",children:null===l||void 0===l||null===(N=l.totals)||void 0===N||null===(w=N.metal)||void 0===w||null===(_=w.IsPrimaryMetal)||void 0===_?void 0:_.toFixed(3)}),(0,v.jsxs)("div",{style:{width:"20%"},className:"be_1_pcl ",children:[" ",null===l||void 0===l||null===(b=l.metal)||void 0===b?void 0:b.map(((l,d)=>(0,v.jsxs)("div",{className:"end_pcl_new end_p_pcl_new fspcl pt-1",children:[" ",1===(null===l||void 0===l?void 0:l.IsPrimaryMetal)&&0!==(null===l||void 0===l?void 0:l.Rate)&&(0,n.dN)(null===l||void 0===l?void 0:l.Rate)," "," "]},d)))]}),(0,v.jsx)("div",{style:{width:"22%"},children:null===l||void 0===l||null===(y=l.metal)||void 0===y?void 0:y.map(((l,d)=>{var i;return(0,v.jsxs)("div",{className:"end_pcl_new end_p_pcl_new fspcl pt-1",children:[1===(null===l||void 0===l?void 0:l.IsPrimaryMetal)&&0!==(null===l||void 0===l?void 0:l.Amount)&&(0,n.dN)((null===l||void 0===l?void 0:l.Amount)/(null===Jl||void 0===Jl||null===(i=Jl.header)||void 0===i?void 0:i.CurrencyExchRate))," "]},d)}))})]}),(0,v.jsx)("div",{children:(0,v.jsx)("div",{})})]}),(0,v.jsxs)("div",{className:"pcltbr1c5 fspcl",children:[(0,v.jsx)("div",{className:"shpthcolspcl fspcl pt-1",style:{width:"27%"},children:null===l||void 0===l||null===(g=l.colorstone)||void 0===g?void 0:g.map(((l,d)=>(0,v.jsx)("div",{className:" fspcl text-break",children:null===l||void 0===l?void 0:l.ShapeName},d)))}),(0,v.jsx)("div",{className:"shpthcolspcl fspcl pt-1",style:{width:"22%"},children:null===l||void 0===l||null===(A=l.colorstone)||void 0===A?void 0:A.map(((l,d)=>{var i;return(0,v.jsx)("div",{className:"end_pcl_new end_p_pcl_new fspcl",children:null===l||void 0===l||null===(i=l.Wt)||void 0===i?void 0:i.toFixed(3)},d)}))}),(0,v.jsx)("div",{className:"shpthcolspcl fspcl pt-1",style:{width:"23%"},children:null===l||void 0===l||null===(R=l.colorstone)||void 0===R?void 0:R.map(((l,d)=>{var i;return(0,v.jsx)("div",{className:"end_pcl_new end_p_pcl_new fspcl",children:(0,n.dN)((null===l||void 0===l?void 0:l.Amount)/(null===Jl||void 0===Jl||null===(i=Jl.header)||void 0===i?void 0:i.CurrencyExchRate)/(null===l||void 0===l?void 0:l.Wt))},d)}))}),(0,v.jsx)("div",{className:"shpthcolspcl fspcl pt-1",style:{borderRight:"0px",width:"28%"},children:null===l||void 0===l||null===(C=l.colorstone)||void 0===C?void 0:C.map(((l,d)=>{var i;return(0,v.jsxs)("div",{className:"end_pcl_new end_p_pcl_new fspcl",children:[" ",(0,n.dN)((null===l||void 0===l?void 0:l.Amount)/(null===Jl||void 0===Jl||null===(i=Jl.header)||void 0===i?void 0:i.CurrencyExchRate))," "]},d)}))})]}),(0,v.jsxs)("div",{className:"pcltbr1c6 fspcl ",children:[(0,v.jsxs)("div",{className:"lopclcol d-flex justify-content-end end_p_pcl_new fspcl pt-1 ",children:[" ",0!==(null===l||void 0===l?void 0:l.MaKingCharge_Unit)&&(0,n.dN)(null===l||void 0===l?void 0:l.MaKingCharge_Unit)," "]}),(0,v.jsxs)("div",{className:"lopclcol d-flex justify-content-end end_p_pcl_new fspcl pt-1",style:{borderRight:"0px"},children:[" ",(null===l||void 0===l?void 0:l.MakingAmount)+(null===l||void 0===l?void 0:l.TotalCsSetcost)+(null===l||void 0===l?void 0:l.TotalDiaSetcost)!==0&&(0,n.dN)(((null===l||void 0===l?void 0:l.MakingAmount)+(null===l||void 0===l?void 0:l.TotalCsSetcost)+(null===l||void 0===l?void 0:l.TotalDiaSetcost))/(null===Jl||void 0===Jl||null===(T=Jl.header)||void 0===T?void 0:T.CurrencyExchRate))," "]})]}),(0,v.jsxs)("div",{className:"pcltbr1c6 fspcl",children:[(0,v.jsxs)("div",{className:"lopclcol fspcl pt-1 ",children:[(0,v.jsx)("div",{children:0===(null===l||void 0===l?void 0:l.MiscAmount)?"":"OTHER"}),(0,v.jsx)("div",{children:0===(null===l||void 0===l?void 0:l.TotalDiamondHandling)?"":"HANDLING"}),(0,v.jsx)("div",{children:null===l||void 0===l||null===(S=l.other_details)||void 0===S?void 0:S.map(((l,d)=>d<3&&(0,v.jsx)("div",{className:"text-break",children:null===l||void 0===l?void 0:l.label},d)))})]}),(0,v.jsxs)("div",{className:"lopclcol fspcl pt-1",style:{borderRight:"0px"},children:[(0,v.jsxs)("div",{className:" d-flex flex-column justify-content-end align-items-end  fspcl",children:[(0,v.jsx)("div",{children:0===(null===l||void 0===l?void 0:l.MiscAmount)?"":(0,n.dN)((null===l||void 0===l?void 0:l.MiscAmount)/(null===Jl||void 0===Jl||null===(k=Jl.header)||void 0===k?void 0:k.CurrencyExchRate))}),(0,v.jsx)("div",{children:0===(null===l||void 0===l?void 0:l.TotalDiamondHandling)?"":(0,n.dN)(null===l||void 0===l?void 0:l.TotalDiamondHandling)}),(0,v.jsx)("div",{children:null===l||void 0===l||null===(F=l.other_details)||void 0===F?void 0:F.map(((l,d)=>d<3?(0,v.jsx)("div",{children:null===l||void 0===l?void 0:l.value},d):""))})]}),(0,v.jsx)("div",{className:" fspcl d-flex flex-column justify-content-end align-items-end w-100"})]})]}),(0,v.jsx)("div",{className:"pcltbr1c7 d-flex justify-content-end end_p_pcl_new  fwboldpcl fspcl pt-1",style:{borderRight:"0px"},children:(0,n.dN)((null===l||void 0===l?void 0:l.UnitCost)/(null===Jl||void 0===Jl||null===(E=Jl.header)||void 0===E?void 0:E.CurrencyExchRate))})]}),(0,v.jsxs)("div",{className:"tbodyrowpcltot fspcl",style:{borderTop:"1px solid #989898",backgroundColor:"#F5F5F5 !important"},children:[(0,v.jsx)("div",{className:"srpcltotrowtb fspcl",style:{backgroundColor:"#F5F5F5 !important",height:"14px"}}),(0,v.jsx)("div",{className:"jwlpcltotrowtb fspcl",style:{backgroundColor:"#F5F5F5 !important",height:"14px"}}),(0,v.jsxs)("div",{className:"diapcltotrowtb fspcl",children:[(0,v.jsx)("div",{className:"dcolsthpcl",style:{width:"27%"}}),(0,v.jsx)("div",{className:"dcolsthpcl",style:{width:"27%"}}),(0,v.jsx)("div",{className:"dcolsthpcl  fwboldpcl fspcl d-flex justify-content-end align-items-center end_p_pcl_new",style:{width:"22%"},children:0===(null===l||void 0===l||null===(D=l.totals)||void 0===D||null===(P=D.diamonds)||void 0===P?void 0:P.Wt)?"":null===l||void 0===l||null===(M=l.totals)||void 0===M||null===(I=M.diamonds)||void 0===I||null===(W=I.Wt)||void 0===W?void 0:W.toFixed(3)}),(0,v.jsx)("div",{className:"dcolsthpcl",style:{width:"22%"}}),(0,v.jsx)("div",{className:"dcolsthpcl  fwboldpcl fspcl d-flex justify-content-end align-items-center end_p_pcl_new",style:{borderRight:"0px",width:"27%"},children:0===(null===l||void 0===l||null===(H=l.totals)||void 0===H||null===(L=H.diamonds)||void 0===L?void 0:L.Amount)?"":(0,n.dN)((null===l||void 0===l||null===(J=l.totals)||void 0===J||null===(O=J.diamonds)||void 0===O?void 0:O.Amount)/(null===Jl||void 0===Jl||null===(B=Jl.header)||void 0===B?void 0:B.CurrencyExchRate))})]}),(0,v.jsxs)("div",{className:"diapcltotrowtb",children:[(0,v.jsx)("div",{className:"dcolsthpcl",style:{width:"22%"}}),(0,v.jsx)("div",{className:"dcolsthpcl  fwboldpcl fspcl d-flex justify-content-end align-items-center end_p_pcl_new",style:{width:"18%"},children:null===l||void 0===l||null===(U=l.grosswt)||void 0===U?void 0:U.toFixed(3)}),(0,v.jsx)("div",{className:"dcolsthpcl  fwboldpcl fspcld-flex justify-content-end align-items-center end_pcl_new end_p_pcl_new",style:{width:"18%"},children:null===l||void 0===l||null===(z=l.totals)||void 0===z||null===(Q=z.metal)||void 0===Q||null===(K=Q.IsPrimaryMetal)||void 0===K?void 0:K.toFixed(3)}),(0,v.jsx)("div",{className:"dcolsthpcl",style:{width:"20%"}}),(0,v.jsx)("div",{className:"dcolsthpcl  fwboldpcl fspcl d-flex justify-content-end align-items-center",style:{borderRight:"0px",width:"22%"},children:null===l||void 0===l||null===(G=l.metal)||void 0===G?void 0:G.map(((l,d)=>{var i;return(0,v.jsxs)("div",{className:"end_pcl_new end_p_pcl_new fspcl pt-1",children:[" "," "," ",1===(null===l||void 0===l?void 0:l.IsPrimaryMetal)&&0!==(null===l||void 0===l?void 0:l.Amount)&&(0,n.dN)((null===l||void 0===l?void 0:l.Amount)/(null===Jl||void 0===Jl||null===(i=Jl.header)||void 0===i?void 0:i.CurrencyExchRate))," "," "]},d)}))})]}),(0,v.jsxs)("div",{className:"stnpcltotrowtb",children:[(0,v.jsx)("div",{className:"shpthcolspcl",style:{width:"27%"}}),(0,v.jsx)("div",{className:"shpthcolspcl  fwboldpcl fspcl d-flex justify-content-end align-items-center end_pcl_new end_p_pcl_new",style:{width:"22%"},children:0===(null===l||void 0===l||null===(Z=l.totals)||void 0===Z||null===(V=Z.colorstone)||void 0===V?void 0:V.Wt)?"":null===l||void 0===l||null===(q=l.totals)||void 0===q||null===(X=q.colorstone)||void 0===X||null===(Y=X.Wt)||void 0===Y?void 0:Y.toFixed(3)}),(0,v.jsx)("div",{className:"shpthcolspcl",style:{width:"23%"}}),(0,v.jsx)("div",{className:"shpthcolspcl  fwboldpcl fspcl d-flex justify-content-end align-items-center end_p_pcl_new",style:{borderRight:"0px",width:"28%"},children:0===(null===l||void 0===l||null===($=l.totals)||void 0===$||null===(ll=$.colorstone)||void 0===ll?void 0:ll.Amount)?"":(0,n.dN)((null===l||void 0===l||null===(dl=l.totals)||void 0===dl||null===(il=dl.colorstone)||void 0===il?void 0:il.Amount)/(null===Jl||void 0===Jl||null===(el=Jl.header)||void 0===el?void 0:el.CurrencyExchRate))})]}),(0,v.jsxs)("div",{className:"lopcltotrowtb",children:[(0,v.jsx)("div",{className:"lopclcol"}),(0,v.jsx)("div",{className:"lopclcol  fwboldpcl fspcl d-flex justify-content-end align-items-center end_p_pcl_new",style:{borderRight:"0px"},children:(null===l||void 0===l?void 0:l.MakingAmount)+(null===l||void 0===l?void 0:l.TotalCsSetcost)+(null===l||void 0===l?void 0:l.TotalDiaSetcost)===0?"":(0,n.dN)(((null===l||void 0===l?void 0:l.MakingAmount)+(null===l||void 0===l?void 0:l.TotalCsSetcost)+(null===l||void 0===l?void 0:l.TotalDiaSetcost))/(null===Jl||void 0===Jl||null===(sl=Jl.header)||void 0===sl?void 0:sl.CurrencyExchRate))})]}),(0,v.jsx)("div",{className:"lopcltotrowtb",children:(0,v.jsx)("div",{className:"lopclcol  fwboldpcl fspcl d-flex justify-content-end align-items-center w-100 end_p_pcl_new",style:{borderRight:"0px"},children:(null===l||void 0===l?void 0:l.other_details_arr_total_amount)+(null===l||void 0===l||null===(ol=l.totals)||void 0===ol||null===(nl=ol.misc)||void 0===nl?void 0:nl.Amount)+(null===l||void 0===l?void 0:l.TotalDiamondHandling)===0?"":(0,n.dN)((null===l||void 0===l?void 0:l.other_details_arr_total_amount)+(null===l||void 0===l||null===(cl=l.totals)||void 0===cl||null===(tl=cl.misc)||void 0===tl?void 0:tl.Amount)/(null===Jl||void 0===Jl||null===(al=Jl.header)||void 0===al?void 0:al.CurrencyExchRate)+(null===l||void 0===l?void 0:l.TotalDiamondHandling))})}),(0,v.jsx)("div",{className:"prpcltotrowtb  fwboldpcl fspcl d-flex justify-content-end align-items-center end_p_pcl_new",style:{borderRight:"0px"},children:(0,n.dN)((null===l||void 0===l?void 0:l.UnitCost)/(null===Jl||void 0===Jl||null===(vl=Jl.header)||void 0===vl?void 0:vl.CurrencyExchRate))})]}),0===(null===l||void 0===l?void 0:l.DiscountAmt)?"":(0,v.jsxs)("div",{className:"tbodyrowpcltot fspcl",style:{borderTop:"1px solid #989898"},children:[(0,v.jsx)("div",{className:"srpcltotrowtb fspcl",style:{backgroundColor:"#F5F5F5 !important",height:"13px"}}),(0,v.jsx)("div",{className:"jwlpcltotrowtb fspcl",style:{backgroundColor:"#F5F5F5 !important",height:"13px"}}),(0,v.jsx)("div",{className:"diapcltotrowtb fspcl"}),(0,v.jsx)("div",{className:"diapcltotrowtb"}),(0,v.jsxs)("div",{className:"lopcltotrowtb dispcltotrowtb ",style:{width:"41%"},children:[(0,v.jsxs)("div",{className:"discpclcs fwboldpcl fspcl2 d-flex justify-content-end pe-2",children:[" Discount ",0===(null===l||void 0===l?void 0:l.Discount)?"-":(0,v.jsx)("span",{className:"text-break",children:"".concat((0,n.dN)(null===l||void 0===l?void 0:l.Discount)," % On ").concat(null===l||void 0===l?void 0:l.str_discountOn)})," "]}),(0,v.jsx)("div",{className:"disvalpclcs  fwboldpcl fspcl d-flex justify-content-end end_pcl_new end_p_pcl_new",style:{borderRight:"0px",width:"28.7%"},children:(0,n.dN)((null===l||void 0===l?void 0:l.DiscountAmt)/(null===Jl||void 0===Jl||null===(rl=Jl.header)||void 0===rl?void 0:rl.CurrencyExchRate))})]}),(0,v.jsx)("div",{className:"prpcltotrowtb  fwboldpcl fspcl end_pcl_new end_p_pcl_new",style:{borderRight:"0px"},children:(0,n.dN)((null===l||void 0===l?void 0:l.TotalAmount)/(null===Jl||void 0===Jl||null===(pl=Jl.header)||void 0===pl?void 0:pl.CurrencyExchRate))})]})]})})},d)}))})]})}),(0,v.jsxs)("div",{className:"tbodyrowpcltot border-start border-end border-black border-bottom",style:{marginTop:"-1.2px"},children:[(0,v.jsx)("div",{className:"srpcltotrowtb"}),(0,v.jsx)("div",{className:"jwlpcltotrowtb fspcl",children:(0,v.jsx)("b",{className:"fspcl",children:"TOTAL"})}),(0,v.jsxs)("div",{className:"diapcltotrowtb",children:[(0,v.jsx)("div",{className:"dcolsthpcl",style:{width:"27%",backgroundColor:"#F5F5F5 !important"}}),(0,v.jsx)("div",{className:"dcolsthpcl",style:{width:"27%",backgroundColor:"#F5F5F5 !important"}}),(0,v.jsx)("div",{className:"dcolsthpcl  fwboldpcl fspcl d-flex justify-content-end align-items-center end_p_pcl_new",style:{width:"22%"},children:0!==(null===Jl||void 0===Jl||null===(g=Jl.mainTotal)||void 0===g||null===(A=g.diamonds)||void 0===A?void 0:A.Wt)&&(null===Jl||void 0===Jl||null===(R=Jl.mainTotal)||void 0===R||null===(C=R.diamonds)||void 0===C||null===(T=C.Wt)||void 0===T?void 0:T.toFixed(3))}),(0,v.jsx)("div",{className:"dcolsthpcl",style:{width:"22%"}}),(0,v.jsx)("div",{className:"dcolsthpcl  fwboldpcl fspcl d-flex justify-content-end align-items-center end_p_pcl_new",style:{borderRight:"0px",width:"27%"},children:0!==(null===Jl||void 0===Jl||null===(S=Jl.mainTotal)||void 0===S||null===(k=S.diamonds)||void 0===k?void 0:k.Amount)&&(0,n.dN)((null===Jl||void 0===Jl||null===(F=Jl.mainTotal)||void 0===F||null===(E=F.diamonds)||void 0===E?void 0:E.Amount)/(null===Jl||void 0===Jl||null===(D=Jl.header)||void 0===D?void 0:D.CurrencyExchRate))})]}),(0,v.jsxs)("div",{className:"diapcltotrowtb",children:[(0,v.jsx)("div",{className:"dcolsthpcl",style:{width:"22%"}}),(0,v.jsx)("div",{className:"dcolsthpcl  fwboldpcl fspcl d-flex justify-content-end align-items-center end_p_pcl_new",style:{width:"18%"},children:null===Jl||void 0===Jl||null===(P=Jl.mainTotal)||void 0===P||null===(M=P.grosswt)||void 0===M?void 0:M.toFixed(3)}),(0,v.jsx)("div",{className:"dcolsthpcl  fwboldpcl fspcl d-flex justify-content-end align-items-center end_p_pcl_new",style:{width:"18%"},children:null===Jl||void 0===Jl||null===(I=Jl.mainTotal)||void 0===I||null===(W=I.metal)||void 0===W||null===(H=W.IsPrimaryMetal)||void 0===H?void 0:H.toFixed(3)}),(0,v.jsx)("div",{className:"dcolsthpcl",style:{width:"20%"}}),(0,v.jsx)("div",{className:"dcolsthpcl  fwboldpcl fspcl d-flex justify-content-end align-items-center end_p_pcl_new",style:{borderRight:"0px",width:"22%"},children:0!==(null===Jl||void 0===Jl||null===(L=Jl.mainTotal.metal)||void 0===L?void 0:L.IsPrimaryMetal_Amount)&&(0,n.dN)((null===Jl||void 0===Jl||null===(J=Jl.mainTotal.metal)||void 0===J?void 0:J.IsPrimaryMetal_Amount)/(null===Jl||void 0===Jl||null===(O=Jl.header)||void 0===O?void 0:O.CurrencyExchRate))})]}),(0,v.jsxs)("div",{className:"stnpcltotrowtb",children:[(0,v.jsx)("div",{className:"shpthcolspcl",style:{width:"27%"}}),(0,v.jsx)("div",{className:"shpthcolspcl  fwboldpcl fspcl d-flex justify-content-end align-items-center end_p_pcl_new",style:{width:"22%"},children:0!==(null===Jl||void 0===Jl||null===(B=Jl.mainTotal)||void 0===B||null===(U=B.colorstone)||void 0===U?void 0:U.Wt)&&(null===Jl||void 0===Jl||null===(z=Jl.mainTotal)||void 0===z||null===(Q=z.colorstone)||void 0===Q||null===(K=Q.Wt)||void 0===K?void 0:K.toFixed(3))}),(0,v.jsx)("div",{className:"shpthcolspcl",style:{width:"23%"}}),(0,v.jsx)("div",{className:"shpthcolspcl  fwboldpcl fspcl d-flex justify-content-end align-items-center end_p_pcl_new",style:{borderRight:"0px",width:"28%"},children:0!==(null===Jl||void 0===Jl||null===(G=Jl.mainTotal.colorstone)||void 0===G?void 0:G.Amount)&&(0,n.dN)((null===Jl||void 0===Jl||null===(Z=Jl.mainTotal.colorstone)||void 0===Z?void 0:Z.Amount)/(null===Jl||void 0===Jl||null===(V=Jl.header)||void 0===V?void 0:V.CurrencyExchRate))})]}),(0,v.jsxs)("div",{className:"lopcltotrowtb",children:[(0,v.jsx)("div",{className:"lopclcol"}),(0,v.jsx)("div",{className:"lopclcol  fwboldpcl fspcl d-flex justify-content-end align-items-center end_p_pcl_new",style:{borderRight:"0px"},children:(null===Jl||void 0===Jl||null===(q=Jl.mainTotal)||void 0===q?void 0:q.total_Making_Amount)+(null===Jl||void 0===Jl||null===(X=Jl.mainTotal)||void 0===X||null===(Y=X.diamonds)||void 0===Y?void 0:Y.SettingAmount)+(null===Jl||void 0===Jl||null===($=Jl.mainTotal)||void 0===$||null===(ll=$.colorstone)||void 0===ll?void 0:ll.SettingAmount)!==0&&(0,n.dN)(((null===Jl||void 0===Jl||null===(dl=Jl.mainTotal)||void 0===dl?void 0:dl.total_Making_Amount)+(null===Jl||void 0===Jl||null===(il=Jl.mainTotal)||void 0===il||null===(el=il.diamonds)||void 0===el?void 0:el.SettingAmount)+(null===Jl||void 0===Jl||null===(sl=Jl.mainTotal)||void 0===sl||null===(ol=sl.colorstone)||void 0===ol?void 0:ol.SettingAmount))/(null===Jl||void 0===Jl||null===(nl=Jl.header)||void 0===nl?void 0:nl.CurrencyExchRate))})]}),(0,v.jsxs)("div",{className:"lopcltotrowtb",children:[(0,v.jsx)("div",{className:"lopclcol"}),(0,v.jsx)("div",{className:"lopclcol  fwboldpcl fspcl d-flex justify-content-end align-items-center end_p_pcl_new",style:{borderRight:"0px"},children:(null===Jl||void 0===Jl||null===(cl=Jl.mainTotal)||void 0===cl?void 0:cl.total_other)+(null===Jl||void 0===Jl||null===(tl=Jl.mainTotal)||void 0===tl?void 0:tl.total_diamondHandling)+(null===Jl||void 0===Jl||null===(al=Jl.mainTotal)||void 0===al?void 0:al.totalMiscAmount)!==0&&(0,n.dN)(((null===Jl||void 0===Jl||null===(vl=Jl.mainTotal)||void 0===vl?void 0:vl.total_other)+(null===Jl||void 0===Jl||null===(rl=Jl.mainTotal)||void 0===rl?void 0:rl.total_diamondHandling)+(null===Jl||void 0===Jl||null===(pl=Jl.mainTotal)||void 0===pl?void 0:pl.totalMiscAmount))/(null===Jl||void 0===Jl||null===(ul=Jl.header)||void 0===ul?void 0:ul.CurrencyExchRate))})]}),(0,v.jsx)("div",{className:"prpcltotrowtb  fwboldpcl fspcl d-flex justify-content-end align-items-center end_p_pcl_new",style:{borderRight:"0px"},children:(0,n.dN)((null===Jl||void 0===Jl||null===(hl=Jl.mainTotal)||void 0===hl?void 0:hl.total_amount)/(null===Jl||void 0===Jl||null===(ml=Jl.header)||void 0===ml?void 0:ml.CurrencyExchRate))})]}),(0,v.jsxs)("div",{className:"tablebodypcl  border-start border-end border-bottom border-black",children:[(0,v.jsxs)("div",{className:"totdispcl",children:[(0,v.jsx)("div",{className:"summaryalignpcl fspcl",children:"Total Discount"}),(0,v.jsx)("div",{className:"fspcl w-50 d-flex justify-content-end align-items-center ",children:(0,n.dN)((null===Jl||void 0===Jl||null===(xl=Jl.mainTotal)||void 0===xl?void 0:xl.total_discount_amount)/(null===Jl||void 0===Jl||null===(fl=Jl.header)||void 0===fl?void 0:fl.CurrencyExchRate))})]}),(null===Jl||void 0===Jl||null===(jl=Jl.allTaxes)||void 0===jl?void 0:jl.length)>0&&(null===Jl||void 0===Jl||null===(Nl=Jl.allTaxes)||void 0===Nl?void 0:Nl.map(((l,d)=>(0,v.jsxs)("div",{className:"d-flex totdispcl fspcl",children:[(0,v.jsxs)("div",{className:"d-flex justify-content-end w-50",children:[null===l||void 0===l?void 0:l.name," ",null===l||void 0===l?void 0:l.per]}),(0,v.jsx)("div",{className:"d-flex justify-content-end w-50",children:(0,n.dN)(null===l||void 0===l?void 0:l.amount)})]},d)))),(0,v.jsxs)("div",{className:"totdispcl",children:[(0,v.jsx)("div",{className:"summaryalignpcl fspcl w-50 d-flex justify-content-end align-items-center",children:(null===Jl||void 0===Jl||null===(wl=Jl.header)||void 0===wl?void 0:wl.AddLess)>0?"ADD":"Less"}),(0,v.jsx)("div",{className:"fspcl",children:(0,n.dN)((null===Jl||void 0===Jl||null===(_l=Jl.header)||void 0===_l?void 0:_l.AddLess)/(null===Jl||void 0===Jl||null===(bl=Jl.header)||void 0===bl?void 0:bl.CurrencyExchRate))})]}),(0,v.jsxs)("div",{className:"totdispcl",children:[(0,v.jsx)("div",{className:"summaryalignpcl fspcl",children:"Grand Total"}),(0,v.jsx)("div",{className:"fspcl w-50 d-flex justify-content-end align-items-center",children:(0,n.dN)(((null===Jl||void 0===Jl||null===(yl=Jl.mainTotal)||void 0===yl?void 0:yl.total_amount)+(null===Jl||void 0===Jl||null===(gl=Jl.header)||void 0===gl?void 0:gl.AddLess))/(null===Jl||void 0===Jl||null===(Al=Jl.header)||void 0===Al?void 0:Al.CurrencyExchRate)+(null===Jl||void 0===Jl?void 0:Jl.allTaxesTotal))})]})]})]})]})]}):(0,v.jsx)("p",{className:"text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto",children:sd})})})}},872:()=>{}}]);
//# sourceMappingURL=2539.b382efb1.chunk.js.map