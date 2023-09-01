import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import Summary4 from './pages/Summary4';
import TaxInvoice1 from './pages/TaxInvoice1';
import PackingList3 from './pages/PackingList3';
import MiscPrint1 from './pages/MiscPrint1';
import EstimatePrint from './pages/EstimatePrint';
import RetailPrint from './pages/RetailPrint';
import DetailPrint11 from './pages/DetailPrint11';
function App() {
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
      {/* <CursorEffect /> */}
      {atob(printname).toLowerCase() === "summary 4" && <Summary4 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
      {atob(printname).toLowerCase() === "tax invoice 1" && <TaxInvoice1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
      {atob(printname).toLowerCase() === "packing list 3" && <PackingList3 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
      {atob(printname).toLowerCase() === "misc print 1" && <MiscPrint1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
      {atob(printname).toLowerCase() === "estimate print" && <EstimatePrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
      {atob(printname).toLowerCase() === "retail" && <RetailPrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
      {atob(printname).toLowerCase() === "detailprint11" && <DetailPrint11 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
    </>
  );
}

export default App;
