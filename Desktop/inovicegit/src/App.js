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
      {atob(printname) === "Summary 4" && <Summary4 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
      {atob(printname) === "Tax Invoice 1" && <TaxInvoice1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
      {atob(printname) === "Packing List 3" && <PackingList3 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
      {atob(printname) === "Misc Print" && <MiscPrint1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
      {atob(printname) === "Estimate Print" && <EstimatePrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
      {atob(printname) === "Retail" && <RetailPrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
      {atob(printname) === "detailPrint11" && <DetailPrint11 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname}/>}
    </>
  );
}

export default App;
