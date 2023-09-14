import React from 'react';
import Summary4 from './Summary4';
import TaxInvoice1 from './TaxInvoice1';
import PackingList3 from './PackingList3';
import MiscPrint1 from './MiscPrint1';
import EstimatePrint from './EstimatePrint';
import RetailPrint from './RetailPrint';
import DetailPrint11 from './DetailPrint11';
import DetailPrint1 from './DetailPrint1';

const AllDesign = () => {
    const queryString = window.location.search;
    const queryParams = new URLSearchParams(queryString);
    const param = queryParams.get('bill');
    const billNum = queryParams.get('billNo');
    const urls = queryParams.get('up');
    const token = queryParams.get('tkn');
    const invoiceno = queryParams.get('invn');
    const printname = queryParams.get('pnm');
  return (
    <>
    {atob(printname).toLowerCase() === "summary 4" && <Summary4 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
    {atob(printname).toLowerCase() === "tax invoice 1" && <TaxInvoice1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
    {atob(printname).toLowerCase() === "packing list 3" && <PackingList3 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
    {atob(printname).toLowerCase() === "misc print 1" && <MiscPrint1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
    {atob(printname).toLowerCase() === "estimate print" && <EstimatePrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
    {atob(printname).toLowerCase() === "retail" && <RetailPrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
    {atob(printname).toLowerCase() === "detail print 11" && <DetailPrint11 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
    {atob(printname).toLowerCase() === "detail print 1" && <DetailPrint1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
  </>
  )
}

export default AllDesign