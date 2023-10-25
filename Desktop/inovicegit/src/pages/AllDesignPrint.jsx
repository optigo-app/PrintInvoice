import React from 'react';
import Summary4 from './prints/Summary4';
import TaxInvoice1 from './prints/TaxInvoice1';
import PackingList3 from './prints/PackingList3';
import MiscPrint1 from './prints/MiscPrint1';
import EstimatePrint from './prints/EstimatePrint';
import RetailPrint from './prints/RetailPrint';
import DetailPrint11 from './prints/DetailPrint11';
import DetailPrint1 from './prints/DetailPrint1';
import InvoicePrint from './prints/InvoicePrint';
import ItemWisePrint from './prints/ItemWisePrint';
import Summary12 from './prints/Summary12';
import DetailPrint12 from './prints/DetailPrint12';
import ExportDeclarationForm from './prints/ExportDeclarationForm';
import PackingList from './prints/PackingList';
import Summary1 from './prints/Summary1';
import JewelleryInvoice from './prints/JewelleryInvoice';
import InvoicePrint2 from './prints/InvoicePrint2';
import InvoicePrint3 from './prints/InvoicePrint3';
import TaxInvoice from './prints/TaxInvoice';
import RoughEstimate from './prints/RoughEstimate';
import JewelleryInvoicePrint from './prints/JewelleryInvoicePrint';
import Export from "./prints/Export";
import ExportPrint1 from "./prints/ExportPrint1";
import ExportPrint from "./prints/ExportPrint";
import Summary13 from './prints/Summary13';
import HallmarkItemWisePrint from './prints/HallmarkItemWisePrint';
import JewelleryRetailInvoicePrintc from './prints/JewelleryRetailInvoicePrintc';
import RetailInvoicePrint4 from './prints/RetailInvoicePrint4';
import InvoicePrint4Clone from './prints/InvoicePrint4Clone';
import ExcelToJsonDownload from './prints/ExcelToJsonDownload';


const AllDesignPrint = () => {
  const queryString = window.location.search;
  const queryParams = new URLSearchParams(queryString);
  // const param = queryParams.get('bill');
  const billNum = queryParams.get('billNo');
  const urls = queryParams.get('up');
  const token = queryParams.get('tkn');
  const invoiceno = queryParams.get('invn');
  const printname = queryParams.get('pnm');
  const evn = queryParams.get('evn');
  const etp = queryParams.get('etp');
  // console.log(invoiceno, atob(invoiceno));
  // console.log(invoiceno, atob(invoiceno));
  return (
    <>
      {(atob(printname).toLowerCase() === "summary 4" && atob(etp).toLowerCase() === "print") && <Summary4 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "summary 12" && atob(etp).toLowerCase() === "print") && <Summary12 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "tax invoice 1" && atob(etp).toLowerCase() === "print") && <TaxInvoice1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "packing list 3" && atob(etp).toLowerCase() === "print") && <PackingList3 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "misc print 1" && atob(etp).toLowerCase() === "print") && <MiscPrint1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "estimate print" && atob(etp).toLowerCase() === "print") && <EstimatePrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "retail" && atob(etp).toLowerCase() === "print") && <RetailPrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "detail print 11" && atob(etp).toLowerCase() === "print") && <DetailPrint11 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {((atob(printname).toLowerCase() === "detail print1 (l)" || atob(printname).toLowerCase() === "detail print1 (p)") && atob(etp).toLowerCase() === "print") && <DetailPrint1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "invoice print" && atob(etp).toLowerCase() === "print") && <InvoicePrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {
        ((atob(printname).toLowerCase() === "item wise print"
          || atob(printname).toLowerCase() === "item wise print1"
          || atob(printname).toLowerCase() === "item wise print2") && atob(etp).toLowerCase() === "print")
        && <ItemWisePrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />
      }
      {(atob(printname).toLowerCase() === "jewellery item wise" && atob(etp).toLowerCase() === "print") && <HallmarkItemWisePrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {
        ((atob(printname).toLowerCase() === "jewellary invoice print"
          || atob(printname).toLowerCase() === "labour print") && atob(etp).toLowerCase() === "print")
        && <JewelleryInvoicePrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "detail print 12" && atob(etp).toLowerCase() === "print") && <DetailPrint12 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "export declaration form" && atob(etp).toLowerCase() === "print") && <ExportDeclarationForm billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "packing list" && atob(etp).toLowerCase() === "print") && <PackingList billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "summary 1" && atob(etp).toLowerCase() === "print") && <Summary1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "jewellery invoice" && atob(etp).toLowerCase() === "print") && <JewelleryInvoice billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "invoice print 2" && atob(etp).toLowerCase() === "print") && <InvoicePrint2 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "invoice print3" && atob(etp).toLowerCase() === "print") && <InvoicePrint3 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "tax invoice" && atob(etp).toLowerCase() === "print") && <TaxInvoice billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "rough estimate" && atob(etp).toLowerCase() === "print") && <RoughEstimate billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "export" && atob(etp).toLowerCase() === "print") && <Export billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "export print" && atob(etp).toLowerCase() === "print") && <ExportPrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "export print 1" && atob(etp).toLowerCase() === "print") && <ExportPrint1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "summary 13" && atob(etp).toLowerCase() === "print") && <Summary13 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "jewellery retail invoice c" && atob(etp).toLowerCase() === "print") && <JewelleryRetailInvoicePrintc billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "retail invoice print 4" && atob(etp).toLowerCase() === "print") && <RetailInvoicePrint4 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(atob(printname).toLowerCase() === "invoice print 4 clone" && atob(etp).toLowerCase() === "print") && <InvoicePrint4Clone billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
     
      {atob(etp).toLowerCase() === "excel" && <ExcelToJsonDownload billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
    </>
  );
};

export default AllDesignPrint;