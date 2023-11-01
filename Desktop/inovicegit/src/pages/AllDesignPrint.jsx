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
import ManufactureMgt from './prints/ManufactureMgt';
import RetailTaxInvoice from './prints/RetailTaxInvoice';
import ExcelToJsonDownloads from './prints/ExcelToJsonDownloads';
import RetailInvoice2_3 from './prints/RetailInvoice2_3';
import ExcelToJsonDownloadA from './prints/ExcelToJsonDownloadA';


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
  let etp = queryParams.get('etp');
  if(etp === null) {
    etp = "cHJpbnQ="
  }
  let printName = atob(printname).toLowerCase();
  let etpType = atob(etp).toLowerCase();
  return (
    <>
      {(printName === "summary 4" && etpType === "print") && <Summary4 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "summary 12" && etpType === "print") && <Summary12 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "tax invoice 1" && etpType === "print") && <TaxInvoice1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "packing list 3" && etpType === "print") && <PackingList3 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "misc print 1" && etpType === "print") && <MiscPrint1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {((printName === "estimate print") && etpType === "print") && <EstimatePrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {((printName === "retail" || printName === "retail1 print" || printName === "retail print 1") && etpType === "print") && <RetailPrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "detail print 11" && etpType === "print") && <DetailPrint11 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {((printName === "detail print1 (l)" || printName === "detail print1 (p)") && etpType === "print") && <DetailPrint1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "invoice print" && etpType === "print") && <InvoicePrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {((printName === "item wise print" || printName === "item wise print1" || printName === "item wise print2") && etpType === "print") && <ItemWisePrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} /> }
      {(printName === "jewellery item wise" && etpType === "print") && <HallmarkItemWisePrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {((printName === "jewellary invoice print" || printName === "labour print") && etpType === "print") && <JewelleryInvoicePrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "detail print 12" && etpType === "print") && <DetailPrint12 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "export declaration form" && etpType === "print") && <ExportDeclarationForm billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "packing list" && etpType === "print") && <PackingList billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "summary 1" && etpType === "print") && <Summary1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "jewellery invoice" && etpType === "print") && <JewelleryInvoice billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "invoice print 2" && etpType === "print") && <InvoicePrint2 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "invoice print3" && etpType === "print") && <InvoicePrint3 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "tax invoice" && etpType === "print") && <TaxInvoice billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "rough estimate" && etpType === "print") && <RoughEstimate billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "export" && etpType === "print") && <Export billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "export print" && etpType === "print") && <ExportPrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "export print 1" && etpType === "print") && <ExportPrint1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "summary 13" && etpType === "print") && <Summary13 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "jewellery retail invoice c" && etpType === "print") && <JewelleryRetailInvoicePrintc billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "retail invoice print 4" && etpType === "print") && <RetailInvoicePrint4 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "invoice print r" && etpType === "print") && <InvoicePrint4Clone billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "sale format b" && etpType === "excel") && <ExcelToJsonDownload bill
      Number={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "sale format s" && etpType === "excel") && <ExcelToJsonDownloads billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "sale format a" && etpType === "excel") && <ExcelToJsonDownloadA billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "manufacture mgt" && etpType === "print") && <ManufactureMgt billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {(printName === "retail tax invoice" && etpType === "print") && <RetailTaxInvoice billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
      {((printName === "retail invoice 2" || printName === "retail invoice 3") && etpType === "print") && <RetailInvoice2_3 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />}
    </>
  );
};

export default AllDesignPrint;