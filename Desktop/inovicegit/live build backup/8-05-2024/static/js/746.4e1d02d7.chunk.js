"use strict";(self.webpackChunkinvoice=self.webpackChunkinvoice||[]).push([[746],{70741:(l,d,o)=>{o.r(d),o.d(d,{default:()=>u});var i=o(72791);const e={containerJewellery:"saleorder_containerJewellery__dTt40",srNo:"saleorder_srNo__TbTOz",image:"saleorder_image__-ydhQ",itemCode:"saleorder_itemCode__jIskU",description:"saleorder_description__YOBYp",unitPrice:"saleorder_unitPrice__UOWeL",amount:"saleorder_amount__RxyYl",quantity:"saleorder_quantity__hSvZf",total:"saleorder_total__0Kof4",remarks:"saleorder_remarks__oojqa",gold18k:"saleorder_gold18k__3lplZ",grandTotal:"saleorder_grandTotal__7hpQw",quantityTotal:"saleorder_quantityTotal__iVbZ1",print_sec_sum4:"saleorder_print_sec_sum4__2Pw8y"};var n=o(1683),s=o(80444),t=o(51914),a=o(67037),r=o(32323),v=o(80184);const u=l=>{var d,o;let{token:u,invoiceNo:c,printName:m,urls:x,evn:h,ApiVer:b}=l;const[p,j]=(0,i.useState)(!0),[N,y]=(0,i.useState)(""),[f,_]=(0,i.useState)([]),[T,g]=(0,i.useState)(null),[C,S]=(0,i.useState)(null),[A,I]=(0,i.useState)({}),[w,D]=(0,i.useState)([]),[M,O]=(0,i.useState)([]),[P,L]=(0,i.useState)({TotalAmount:0,afterTax:0,grandTotal:0,UnitCost:0,Quantity:0}),[E,Q]=(0,i.useState)(!0),[W,k]=(0,i.useState)([]),[G,R]=(0,i.useState)([]),[Z,U]=(0,i.useState)(atob(h).toLowerCase()),[B,H]=(0,i.useState)({maxWidth:"120px",maxHeight:"95px",minHeight:"95px"});return(0,i.useEffect)((()=>{(async()=>{try{const l=await(0,n.k_)(u,c,m,x,h,b);if("200"===(null===l||void 0===l?void 0:l.Status)){(0,n.nK)(null===l||void 0===l?void 0:l.Data)?(j(!1),y("Data Not Found")):((l=>{var d,o;let i=(0,n.Gt)("1",null===l||void 0===l?void 0:l.BillPrint_Json[0]);g(i),I(null===l||void 0===l?void 0:l.BillPrint_Json[0]);let e=(0,n.ci)("2",null===l||void 0===l?void 0:l.BillPrint_Json[0]);S(e);let s=[],t=[],a=[],r={...P};null===l||void 0===l||l.BillPrint_Json1.forEach(((d,o)=>{var i,e;let n=0,v=0,u=0;r.Quantity+=null===d||void 0===d?void 0:d.Quantity;let c=t.findIndex((l=>"GOLD IN 24KT"===(null===l||void 0===l?void 0:l.label)));-1===c?t.push({label:"GOLD IN 24KT",value:(null===d||void 0===d?void 0:d.convertednetwt)*(null===d||void 0===d?void 0:d.Quantity),id:1,suffix:" gm",name:"GOLD IN 24KT"}):t[c].value+=(null===d||void 0===d?void 0:d.convertednetwt)*(null===d||void 0===d?void 0:d.Quantity);let m=t.findIndex(((l,d)=>"Gross Wt"===(null===l||void 0===l?void 0:l.label)));-1===m?t.push({label:"Gross Wt",value:(null===d||void 0===d?void 0:d.grosswt)*(null===d||void 0===d?void 0:d.Quantity),id:2,suffix:" gm",name:"Gross Wt"}):t[m].value+=(null===d||void 0===d?void 0:d.grosswt)*(null===d||void 0===d?void 0:d.Quantity);let x=t.findIndex(((l,d)=>"NET WT"===(null===l||void 0===l?void 0:l.label)));-1===x?t.push({label:"NET WT",value:(null===d||void 0===d?void 0:d.NetWt)*(null===d||void 0===d?void 0:d.Quantity),id:4,suffix:" gm",name:"NET WT"}):t[x].value+=(null===d||void 0===d?void 0:d.NetWt)*(null===d||void 0===d?void 0:d.Quantity);let h=t.findIndex(((l,d)=>"Labour"===(null===l||void 0===l?void 0:l.label)));-1===h?t.push({label:"Labour",value:0,id:7,suffix:"",name:"Labour",amount:null===d||void 0===d?void 0:d.MakingAmount}):t[h].amount+=null===d||void 0===d?void 0:d.MakingAmount;let b=a.findIndex((l=>"LABOUR"===(null===l||void 0===l?void 0:l.label)));-1===b?a.push({label:"LABOUR",value:0,id:5,suffix:"",name:"LABOUR",amount:(null===d||void 0===d?void 0:d.MakingAmount)*(null===d||void 0===d?void 0:d.Quantity)}):a[b].amount+=(null===d||void 0===d?void 0:d.MakingAmount)*(null===d||void 0===d?void 0:d.Quantity);let p=a.findIndex((l=>"OTHER"===(null===l||void 0===l?void 0:l.label)));-1===p?a.push({label:"OTHER",value:0,id:6,suffix:"",name:"OTHER",amount:((null===d||void 0===d?void 0:d.OtherCharges)+(null===d||void 0===d?void 0:d.TotalDiamondHandling))*(null===d||void 0===d?void 0:d.Quantity)}):a[p].amount+=((null===d||void 0===d?void 0:d.OtherCharges)+(null===d||void 0===d?void 0:d.TotalDiamondHandling))*(null===d||void 0===d?void 0:d.Quantity),null===l||void 0===l||l.BillPrint_Json2.forEach(((l,o)=>{if((null===l||void 0===l?void 0:l.StockBarcode)===(null===d||void 0===d?void 0:d.SrJobno)){let o=a.findIndex((l=>"LABOUR"===(null===l||void 0===l?void 0:l.label)));-1!==o&&(a[o].amount+=(null===l||void 0===l?void 0:l.SettingAmount)*(null===d||void 0===d?void 0:d.Quantity));let i=t.findIndex(((d,o)=>(null===d||void 0===d?void 0:d.label)===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeName)&&5!==(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)));if(-1!==i&&(t[i].value+=(null===l||void 0===l?void 0:l.Wt)*(null===d||void 0===d?void 0:d.Quantity),t[i].amount+=(null===l||void 0===l?void 0:l.Amount)*(null===d||void 0===d?void 0:d.Quantity),t[i].Pcs+=(null===l||void 0===l?void 0:l.Pcs)*(null===d||void 0===d?void 0:d.Quantity)),1===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)){n+=null===l||void 0===l?void 0:l.Wt,-1===i&&t.push({label:"DIAMOND",value:(null===l||void 0===l?void 0:l.Wt)*(null===d||void 0===d?void 0:d.Quantity),id:5,suffix:" Cts",name:"Dia Wt",amount:(null===l||void 0===l?void 0:l.Amount)*(null===d||void 0===d?void 0:d.Quantity),Pcs:(null===l||void 0===l?void 0:l.Pcs)*(null===d||void 0===d?void 0:d.Quantity)});let o=a.findIndex((l=>"DIAMOND"===(null===l||void 0===l?void 0:l.label)));-1===o?a.push({label:"DIAMOND",value:0,id:2,suffix:"",name:"DIAMOND",amount:(null===l||void 0===l?void 0:l.Amount)*(null===d||void 0===d?void 0:d.Quantity),Pcs:null===l||void 0===l?void 0:l.Pcs}):(a[o].amount+=(null===l||void 0===l?void 0:l.Amount)*(null===d||void 0===d?void 0:d.Quantity),a[o].Pcs+=null===l||void 0===l?void 0:l.Pcs)}else if(2===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)){v+=null===l||void 0===l?void 0:l.Wt,-1===i&&t.push({label:"COLOR STONE",value:(null===l||void 0===l?void 0:l.Wt)*(null===d||void 0===d?void 0:d.Quantity),id:6,suffix:" Cts",name:"Cs Wt",amount:(null===l||void 0===l?void 0:l.Amount)*(null===d||void 0===d?void 0:d.Quantity),Pcs:(null===l||void 0===l?void 0:l.Pcs)*(null===d||void 0===d?void 0:d.Quantity)});let o=a.findIndex((l=>"CST"===(null===l||void 0===l?void 0:l.label)));-1===o?a.push({label:"CST",value:0,id:3,suffix:"",name:"CST",amount:(null===l||void 0===l?void 0:l.Amount)*(null===d||void 0===d?void 0:d.Quantity),Pcs:null===l||void 0===l?void 0:l.Pcs}):(a[o].amount+=(null===l||void 0===l?void 0:l.Amount)*(null===d||void 0===d?void 0:d.Quantity),a[o].Pcs+=null===l||void 0===l?void 0:l.Pcs)}else if(3===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)){u+=null===l||void 0===l?void 0:l.Wt,-1===i&&t.push({label:"MISC",value:(null===l||void 0===l?void 0:l.Wt)*(null===d||void 0===d?void 0:d.Quantity),id:7,suffix:" gms",name:"Misc Wt",amount:(null===l||void 0===l?void 0:l.Amount)*(null===d||void 0===d?void 0:d.Quantity),Pcs:(null===l||void 0===l?void 0:l.Pcs)*(null===d||void 0===d?void 0:d.Quantity)});let o=a.findIndex((l=>"MISC"===(null===l||void 0===l?void 0:l.label)));-1===o?a.push({label:"MISC",value:0,id:4,suffix:"",name:"MISC",amount:(null===l||void 0===l?void 0:l.Amount)*(null===d||void 0===d?void 0:d.Quantity)}):a[o].amount+=(null===l||void 0===l?void 0:l.Amount)*(null===d||void 0===d?void 0:d.Quantity)}else if(4===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)){let o=a.findIndex((l=>"GOLD"===(null===l||void 0===l?void 0:l.label)));-1===o?a.push({label:"GOLD",value:0,id:1,suffix:"",name:"GOLD",amount:(null===l||void 0===l?void 0:l.Amount)*(null===d||void 0===d?void 0:d.Quantity)}):a[o].amount+=(null===l||void 0===l?void 0:l.Amount)*(null===d||void 0===d?void 0:d.Quantity)}else if(5===(null===l||void 0===l?void 0:l.MasterManagement_DiamondStoneTypeid)){let o=a.findIndex((l=>"GOLD"===(null===l||void 0===l?void 0:l.label)));-1===o?a.push({label:"GOLD",value:0,id:1,suffix:"",name:"GOLD",amount:(null===l||void 0===l?void 0:l.Amount)*(null===d||void 0===d?void 0:d.Quantity)}):a[o].amount+=(null===l||void 0===l?void 0:l.Amount)*(null===d||void 0===d?void 0:d.Quantity)}}}));let j={...d};j.TotalAmount=null===d||void 0===d?void 0:d.TotalAmount,j.UnitCost=(null===d||void 0===d?void 0:d.UnitCost)/(null===l||void 0===l||null===(i=l.BillPrint_Json[0])||void 0===i?void 0:i.CurrencyExchRate),r.TotalAmount+=(null===j||void 0===j?void 0:j.TotalAmount)/(null===l||void 0===l||null===(e=l.BillPrint_Json[0])||void 0===e?void 0:e.CurrencyExchRate),r.UnitCost+=(null===j||void 0===j?void 0:j.UnitCost)/j.Quantity,j.diamondWt=n,j.colorStoneWt=v,j.miscWt=u,s.push(j)}));let v=t.findIndex(((l,d)=>"DIAMOND"===(null===l||void 0===l?void 0:l.label))),u=t.findIndex(((l,d)=>"NET WT"===(null===l||void 0===l?void 0:l.label)));var c,m;-1!==u&&t.push({label:"(M+D) WT",value:(-1!==v?+(0,n.OP)(null===(c=t[v])||void 0===c?void 0:c.value,3)/5:0)+(null===(m=t[u])||void 0===m?void 0:m.value),id:3,suffix:" gm",name:"(M+D) WT"}),t.sort(((l,d)=>l.id-d.id));let x=(0,n.b1)(null===l||void 0===l?void 0:l.BillPrint_Json[0],null===r||void 0===r?void 0:r.TotalAmount);k(x),r.afterTax=x.reduce(((l,d)=>l+ +(null===d||void 0===d?void 0:d.amount)),0)+(null===r||void 0===r?void 0:r.TotalAmount),r.grandTotal=r.afterTax+(null===l||void 0===l||null===(d=l.BillPrint_Json[0])||void 0===d?void 0:d.AddLess),L(r),_(s),a.sort(((l,d)=>l.id-d.id)),O(a),D(t);let h=null===l||void 0===l||null===(o=l.BillPrint_Json[0])||void 0===o?void 0:o.Printlable.split("\n");R(h)})(null===l||void 0===l?void 0:l.Data),j(!1))}else j(!1),y(null===l||void 0===l?void 0:l.Message)}catch(l){console.error(l)}})()}),[]),p?(0,v.jsx)(s.Z,{}):""===N?(0,v.jsxs)("div",{className:"container max_width_container pad_60_allPrint ".concat(null===e||void 0===e?void 0:e.containerJewellery," jewelleryinvoiceContain mt-1"),children:[(0,v.jsx)("div",{className:"d-flex justify-content-end align-items-center ".concat(null===e||void 0===e?void 0:e.print_sec_sum4," mb-4"),children:(0,v.jsx)("div",{className:"form-check ps-3",children:(0,v.jsx)("input",{type:"button",className:"btn_white blue py-1",value:"Print",onClick:l=>(0,n.Yj)(l)})})}),(0,v.jsx)("div",{className:"".concat(t.Z.headline," headerTitle"),children:null===A||void 0===A?void 0:A.PrintHeadLabel}),(0,v.jsxs)("div",{className:t.Z.companyDetails,children:[(0,v.jsxs)("div",{className:"".concat(t.Z.companyhead," p-2"),children:[(0,v.jsx)("span",{className:t.Z.lines,style:{fontWeight:"bold"},children:null===A||void 0===A?void 0:A.CompanyFullName}),(0,v.jsx)("span",{className:t.Z.lines,children:null===A||void 0===A?void 0:A.CompanyAddress}),(0,v.jsx)("span",{className:t.Z.lines,children:null===A||void 0===A?void 0:A.CompanyAddress2}),(0,v.jsxs)("span",{className:t.Z.lines,children:[null===A||void 0===A?void 0:A.CompanyCity,"-",null===A||void 0===A?void 0:A.CompanyPinCode,",",null===A||void 0===A?void 0:A.CompanyState,"(",null===A||void 0===A?void 0:A.CompanyCountry,")"]}),(0,v.jsxs)("span",{className:t.Z.lines,children:["Tell No: ",null===A||void 0===A?void 0:A.CompanyTellNo]}),(0,v.jsxs)("span",{className:t.Z.lines,children:[null===A||void 0===A?void 0:A.CompanyEmail," | ",null===A||void 0===A?void 0:A.CompanyWebsite]}),(0,v.jsx)("span",{className:t.Z.lines})]}),(0,v.jsx)("div",{style:{width:"30%"},className:"d-flex justify-content-end align-item-center h-100",children:(0,v.jsx)(r.Z,{imageUrl:null===A||void 0===A?void 0:A.PrintLogo,styles:B})})]}),(0,v.jsxs)("div",{className:"border-top border-start border-end d-flex",children:[(0,v.jsxs)("div",{className:"col-4 p-2 border-end",children:[(0,v.jsx)("p",{children:" To,"}),(0,v.jsx)("p",{className:"fw-bold",children:null===A||void 0===A?void 0:A.customerfirmname}),(0,v.jsx)("p",{children:null===A||void 0===A?void 0:A.customerstreet}),(0,v.jsx)("p",{children:null===A||void 0===A?void 0:A.customerregion}),(0,v.jsx)("p",{children:null===A||void 0===A?void 0:A.customercity}),(0,v.jsxs)("p",{children:[null===A||void 0===A?void 0:A.customerstate," , ",null===A||void 0===A?void 0:A.customercountry," ",null===A||void 0===A?void 0:A.customerpincode]}),(0,v.jsxs)("p",{children:["Tel : ",null===A||void 0===A?void 0:A.customermobileno]}),(0,v.jsx)("p",{children:null===A||void 0===A?void 0:A.customeremail1})]}),(0,v.jsxs)("div",{className:"col-4 p-2",children:[(0,v.jsx)("p",{children:"Ship To,"}),(0,v.jsx)("p",{className:"fw-bold",children:null===A||void 0===A?void 0:A.customerfirmname}),G.map(((l,d)=>(0,v.jsxs)("p",{children:[" ",l]},d)))]}),(0,v.jsx)("div",{className:"col-4 d-flex justify-content-end p-2",children:(0,v.jsxs)("div",{className:"col-9 d-flex flex-column justify-content-center",children:[(0,v.jsxs)("p",{children:["DATE:"," ",(0,v.jsx)("span",{className:"ps-1 fw-bold",children:null===A||void 0===A?void 0:A.EntryDate})]}),(0,v.jsxs)("p",{children:["orders"===Z&&"ORDER","quote"===Z&&"QUOTATION","#:"," ",(0,v.jsx)("span",{className:"ps-1 fw-bold",children:null===A||void 0===A?void 0:A.InvoiceNo})," "]}),""!==(null===(d=f[0])||void 0===d?void 0:d.PO)&&(0,v.jsxs)("p",{children:["PO#: ",(0,v.jsx)("span",{className:"ps-1 fw-bold",children:null===(o=f[0])||void 0===o?void 0:o.PO})," "]}),""!==(null===A||void 0===A?void 0:A.DueDate)&&(0,v.jsxs)("p",{children:["PROMISE DATE#:"," ",(0,v.jsx)("span",{className:"ps-1 fw-bold",children:null===A||void 0===A?void 0:A.DueDate})]})]})})]}),(0,v.jsx)("div",{className:"",children:(0,v.jsxs)("table",{className:"table w-100 table-border mb-0",children:[(0,v.jsx)("thead",{children:(0,v.jsxs)("tr",{children:[(0,v.jsx)("th",{className:"".concat(null===e||void 0===e?void 0:e.srNo," p-1 text-center lightGrey_table  border "),style:{wordBreak:"normal"},children:"SR NO"}),(0,v.jsx)("th",{className:"".concat(null===e||void 0===e?void 0:e.image," p-1 text-center lightGrey_table  border"),children:"IMAGE"}),(0,v.jsx)("th",{className:"".concat(null===e||void 0===e?void 0:e.itemCode," p-1 text-center lightGrey_table  border"),children:"ITEM CODE"}),(0,v.jsx)("th",{className:"".concat(null===e||void 0===e?void 0:e.description," p-1 text-center lightGrey_table  border"),children:"DESCRIPTION"}),(0,v.jsx)("th",{className:"".concat(null===e||void 0===e?void 0:e.quantity," p-1 text-center lightGrey_table  border"),children:"QTY"}),(0,v.jsx)("th",{className:"".concat(null===e||void 0===e?void 0:e.unitPrice," p-1 text-center lightGrey_table  border"),children:"UNIT PRICE"}),(0,v.jsxs)("th",{className:"".concat(null===e||void 0===e?void 0:e.amount," p-1 text-center lightGrey_table border"),style:{wordBreak:"normal"},children:["AMOUNT (",null===A||void 0===A?void 0:A.CurrencyCode,")"]})]})}),(0,v.jsxs)("tbody",{children:[f.map(((l,d)=>(0,v.jsxs)("tr",{className:"no_break",children:[(0,v.jsx)("td",{className:"".concat(null===e||void 0===e?void 0:e.srNo," p-1 border-end border-start border-bottom"),children:(0,v.jsx)("p",{className:" text-center",children:d+1})}),(0,v.jsx)("td",{className:"".concat(null===e||void 0===e?void 0:e.image," p-1  border-end border-start border-bottom"),children:(0,v.jsx)("img",{src:null===l||void 0===l?void 0:l.DesignImage,alt:"",onError:n.Mp,className:"w-100 imgWidth"})}),(0,v.jsx)("td",{className:"".concat(null===e||void 0===e?void 0:e.itemCode," p-1  border-end border-start border-bottom"),children:(0,v.jsx)("p",{children:(0,v.jsx)("span",{className:"fw-bold",children:null===l||void 0===l?void 0:l.designno})})}),(0,v.jsxs)("td",{className:"".concat(null===e||void 0===e?void 0:e.description," p-1 border-end border-start border-bottom "),children:[(0,v.jsxs)("p",{children:[(0,v.jsxs)("span",{className:"fw-bold",children:[null===l||void 0===l?void 0:l.MetalType,": "]})," ",null===l||void 0===l?void 0:l.MetalPurity," ",null===l||void 0===l?void 0:l.MetalColor]}),(0,v.jsx)("p",{children:0!==(null===l||void 0===l?void 0:l.NetWt)&&(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)("span",{className:"fw-bold",children:"NET WT: "}),"".concat((0,n.dl)(null===l||void 0===l?void 0:l.NetWt,3)," gms NW")]})}),(0,v.jsx)("p",{children:0!==(null===l||void 0===l?void 0:l.diamondWt)&&(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)("span",{className:"fw-bold",children:"DIA WT: "}),"".concat((0,n.dl)(null===l||void 0===l?void 0:l.diamondWt,3)," Cts")]})}),(0,v.jsx)("p",{children:0!==(null===l||void 0===l?void 0:l.colorStoneWt)&&(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)("span",{className:"fw-bold",children:"CS: "}),"".concat((0,n.dl)(null===l||void 0===l?void 0:l.colorStoneWt,3)," Cts")]})}),(0,v.jsx)("p",{children:0!==(null===l||void 0===l?void 0:l.miscWt)&&(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)("span",{className:"fw-bold",children:"MISC: "}),"".concat((0,n.dl)(null===l||void 0===l?void 0:l.miscWt,3)," gms")]})}),(0,v.jsx)("p",{children:0!==(null===l||void 0===l?void 0:l.grosswt)&&(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)("span",{className:"fw-bold",children:"GROSS WT: "}),"".concat((0,n.dl)(null===l||void 0===l?void 0:l.grosswt,3)," gms GW")]})}),""!==(null===l||void 0===l?void 0:l.Size)&&(0,v.jsxs)("p",{className:"pt-1",children:[(0,v.jsx)("span",{className:"fw-bold",children:"SIZE: "})," ",null===l||void 0===l?void 0:l.Size]}),(""!==(null===l||void 0===l?void 0:l.Collectionname)||""!==(null===l||void 0===l?void 0:l.Categoryname)||""!==(null===l||void 0===l?void 0:l.SubCategoryname))&&(0,v.jsxs)("p",{className:"pt-2",children:[(0,v.jsx)("span",{className:"fw-bold",children:" PRODUCT: "})," ",null===l||void 0===l?void 0:l.Collectionname,", ",null===l||void 0===l?void 0:l.Categoryname,","," ",null===l||void 0===l?void 0:l.SubCategoryname]}),""!==(null===l||void 0===l?void 0:l.JobRemark)&&(0,v.jsxs)("p",{className:"pt-1",children:[(0,v.jsx)("span",{className:"fw-bold",children:"REMARKS:"})," ",null===l||void 0===l?void 0:l.JobRemark]})]}),(0,v.jsx)("td",{className:"".concat(null===e||void 0===e?void 0:e.quantity," p-1 border-end border-start border-bottom "),children:(0,v.jsxs)("p",{className:"text-end",children:[" ",null===l||void 0===l?void 0:l.Quantity]})}),(0,v.jsx)("td",{className:"".concat(null===e||void 0===e?void 0:e.unitPrice," p-1 border-end border-start border-bottom text-end"),children:(0,v.jsxs)("p",{children:[(0,v.jsx)("span",{dangerouslySetInnerHTML:{__html:null===A||void 0===A?void 0:A.Currencysymbol}})," ",(0,n.dl)((null===l||void 0===l?void 0:l.UnitCost)/(null===l||void 0===l?void 0:l.Quantity),2)]})}),(0,v.jsx)("td",{className:"".concat(null===e||void 0===e?void 0:e.amount," p-1  text-end border-start border-bottom border-end"),children:(0,v.jsxs)("p",{children:[(0,v.jsx)("span",{dangerouslySetInnerHTML:{__html:null===A||void 0===A?void 0:A.Currencysymbol}})," ",(0,n.dl)((null===l||void 0===l?void 0:l.TotalAmount)/(null===A||void 0===A?void 0:A.CurrencyExchRate),2)]})})]},d))),(0,v.jsxs)("tr",{className:"no_break",children:[(0,v.jsx)("td",{className:"".concat(null===e||void 0===e?void 0:e.srNo," p-1 border-end border-start border-bottom lightGrey_table"),children:" "}),(0,v.jsxs)("td",{className:"".concat(null===e||void 0===e?void 0:e.image," p-1  border-start border-bottom lightGrey_table"),children:[" ",(0,v.jsx)("p",{className:"fw-bold",children:"TOTAL"})," "]}),(0,v.jsx)("td",{className:"".concat(null===e||void 0===e?void 0:e.itemCode," p-1   border-start border-bottom lightGrey_table"),children:" "}),(0,v.jsx)("td",{className:"".concat(null===e||void 0===e?void 0:e.description," p-1  border-start border-bottom lightGrey_table "),children:" "}),(0,v.jsxs)("td",{className:"".concat(null===e||void 0===e?void 0:e.quantity," p-1 border-end border-start border-bottom lightGrey_table"),children:[" ",(0,v.jsxs)("p",{className:"text-end fw-bold",children:[" ",(0,n.dl)(null===P||void 0===P?void 0:P.Quantity,0)]})," "]}),(0,v.jsxs)("td",{className:"".concat(null===e||void 0===e?void 0:e.unitPrice," p-1 border-end border-start border-bottom lightGrey_table text-end"),children:[" ",(0,v.jsxs)("p",{className:"fw-bold",children:[" ",(0,v.jsx)("span",{dangerouslySetInnerHTML:{__html:null===A||void 0===A?void 0:A.Currencysymbol}})," "," ",(0,n.dl)(null===P||void 0===P?void 0:P.UnitCost,2)," "]})," "]}),(0,v.jsxs)("td",{className:"".concat(null===e||void 0===e?void 0:e.amount," p-1  text-end border-start border-bottom lightGrey_table border-end"),children:[" ",(0,v.jsxs)("p",{className:"fw-bold",children:[" ",(0,v.jsx)("span",{dangerouslySetInnerHTML:{__html:null===A||void 0===A?void 0:A.Currencysymbol}})," ",(0,n.dl)(null===P||void 0===P?void 0:P.TotalAmount,2)," "]})," "]})]})]})]})}),(0,v.jsxs)("div",{className:"border-start border-end border-bottom d-flex no_break",children:[(0,v.jsxs)("div",{className:"".concat(null===e||void 0===e?void 0:e.gold18k," border-end"),children:[(0,v.jsx)("p",{className:"fw-semibold text-center border-bottom py-1 lightGrey",children:"SUMMARY"}),(0,v.jsxs)("div",{className:"d-flex h-100",children:[(0,v.jsx)("div",{className:"col-6 border-end p-1 ",children:w.map(((l,d)=>0!==(null===l||void 0===l?void 0:l.value)&&(0,v.jsxs)("div",{className:"d-flex justify-content-between",children:[(0,v.jsx)("p",{className:"fw-bold",children:(null===l||void 0===l?void 0:l.name).toUpperCase()}),(0,v.jsxs)("p",{children:[(null===l||void 0===l?void 0:l.Pcs)&&"".concat((0,n.dl)(null===l||void 0===l?void 0:l.Pcs,0)," / "),(0,n.dl)(+(null===l||void 0===l?void 0:l.value),3)," ",null===l||void 0===l?void 0:l.suffix]})]},d)))}),(0,v.jsx)("div",{className:"col-6 p-1 ",children:M.map(((l,d)=>0!==(null===l||void 0===l?void 0:l.amount)&&(0,v.jsxs)("div",{className:"d-flex justify-content-between",children:[(0,v.jsx)("p",{className:"fw-bold",children:null===l||void 0===l?void 0:l.name}),(0,v.jsx)("p",{children:(0,n.dl)((null===l||void 0===l?void 0:l.amount)/(null===A||void 0===A?void 0:A.CurrencyExchRate),2)})]},d)))})]})]}),(0,v.jsxs)("div",{className:"".concat(null===e||void 0===e?void 0:e.remarks," p-1 border-end"),children:[(0,v.jsx)("p",{className:"fw-bold text-decoration-underline fw-bold",children:"REMARKS: "}),(0,v.jsx)("p",{dangerouslySetInnerHTML:{__html:null===A||void 0===A?void 0:A.PrintRemark}})]}),(0,v.jsxs)("div",{className:"".concat(null===e||void 0===e?void 0:e.grandTotal," p-1 border-end"),children:[W.map(((l,d)=>(0,v.jsxs)("p",{className:"text-end",children:[null===l||void 0===l?void 0:l.name," @ ",null===l||void 0===l?void 0:l.per]},d))),(0,v.jsx)("p",{className:"text-end",children:" TOTAL "}),0!==(null===A||void 0===A?void 0:A.AddLess)&&(0,v.jsx)("p",{className:"text-end",children:(null===A||void 0===A?void 0:A.AddLess)>0?"ADD":"LESS"})]}),(0,v.jsxs)("div",{className:"".concat(null===e||void 0===e?void 0:e.amount," p-1 text-end fw-bold"),children:[W.map(((l,d)=>(0,v.jsxs)("p",{children:[(0,v.jsx)("span",{dangerouslySetInnerHTML:{__html:null===A||void 0===A?void 0:A.Currencysymbol}})," ",null===l||void 0===l?void 0:l.amount]},d))),(0,v.jsxs)("p",{children:[(0,v.jsx)("span",{dangerouslySetInnerHTML:{__html:null===A||void 0===A?void 0:A.Currencysymbol}})," ",(0,n.dl)(null===P||void 0===P?void 0:P.afterTax,2)]}),0!==(null===A||void 0===A?void 0:A.AddLess)&&(0,v.jsxs)("p",{children:[(0,v.jsx)("span",{dangerouslySetInnerHTML:{__html:null===A||void 0===A?void 0:A.Currencysymbol}})," ",(0,n.dl)(null===A||void 0===A?void 0:A.AddLess,2)]})]})]}),(0,v.jsxs)("div",{className:"border-start border-end border-bottom d-flex lightGrey no_break",children:[(0,v.jsxs)("div",{className:"".concat(null===e||void 0===e?void 0:e.gold18k," p-1 border-end d-flex"),children:[(0,v.jsx)("div",{className:"col-6 border-end"}),(0,v.jsxs)("div",{className:"col-6 d-flex justify-content-between",children:[(0,v.jsx)("p",{className:"fw-bold",children:"TOTAL"}),(0,v.jsxs)("p",{className:"fw-bold",children:[" ",(0,v.jsx)("span",{dangerouslySetInnerHTML:{__html:null===A||void 0===A?void 0:A.Currencysymbol}})," ",(0,n.dl)(null===P||void 0===P?void 0:P.grandTotal,2)]})]})]}),(0,v.jsx)("div",{className:"".concat(null===e||void 0===e?void 0:e.remarks," p-1 fw-bold border-end")}),(0,v.jsx)("div",{className:"".concat(null===e||void 0===e?void 0:e.grandTotal," p-1 border-end"),children:(0,v.jsx)("p",{className:"fw-bold text-end",children:" GRAND TOTAL"})}),(0,v.jsx)("div",{className:"".concat(null===e||void 0===e?void 0:e.amount," p-1 text-end fw-bold"),children:(0,v.jsxs)("p",{children:[" ",(0,v.jsx)("span",{dangerouslySetInnerHTML:{__html:null===A||void 0===A?void 0:A.Currencysymbol}})," ",(0,n.dl)(null===P||void 0===P?void 0:P.grandTotal,2)]})})]}),(0,v.jsx)("div",{className:"py-1 no_break",children:(0,v.jsx)("p",{className:"computerGenerated",children:"** THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF TRANSACTIONS"})}),(0,v.jsx)("div",{className:"border-start border-end border-top p-2 no_break",children:(0,v.jsx)("div",{dangerouslySetInnerHTML:{__html:null===A||void 0===A?void 0:A.Declaration}})}),(0,v.jsxs)("div",{className:"d-flex border no_break",children:[(0,v.jsxs)("div",{className:"col-4 border-end p-1",children:[(0,v.jsx)("div",{className:a.Z.linesf3,style:{fontWeight:"bold"},children:"Bank Detail"}),(0,v.jsxs)("div",{className:a.Z.linesf3,children:["Bank Name: ",null===A||void 0===A?void 0:A.bankname]}),(0,v.jsxs)("div",{className:a.Z.linesf3,children:["Branch: ",null===A||void 0===A?void 0:A.bankaddress]}),(0,v.jsxs)("div",{className:a.Z.linesf3,children:["Account Name: ",null===A||void 0===A?void 0:A.accountname]}),(0,v.jsxs)("div",{className:a.Z.linesf3,children:["Account No. : ",null===A||void 0===A?void 0:A.accountnumber]}),(0,v.jsxs)("div",{className:a.Z.linesf3,children:["RTGS/NEFT IFSC: ",null===A||void 0===A?void 0:A.rtgs_neft_ifsc]})]}),(0,v.jsxs)("div",{className:"col-4 border-end p-1 d-flex justify-content-between flex-column",children:[(0,v.jsx)("div",{className:a.Z.linesf3,children:"Signature"}),(0,v.jsx)("div",{className:"fw-bold",children:null===A||void 0===A?void 0:A.customerfirmname})]}),(0,v.jsxs)("div",{className:"p-1 d-flex justify-content-between flex-column",children:[(0,v.jsx)("div",{className:a.Z.linesf3,children:"Signature"}),(0,v.jsx)("div",{className:"fw-bold",children:null===A||void 0===A?void 0:A.CompanyFullName})]})]})]}):(0,v.jsx)("p",{className:"text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto",children:N})}}}]);
//# sourceMappingURL=746.4e1d02d7.chunk.js.map