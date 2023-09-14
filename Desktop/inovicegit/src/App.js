import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import Summary4 from './pages/Summary4';
import TaxInvoice1 from './pages/TaxInvoice1';
import PackingList3 from './pages/PackingList3';
import MiscPrint1 from './pages/MiscPrint1';
import EstimatePrint from './pages/EstimatePrint';
import RetailPrint from './pages/RetailPrint';
import DetailPrint11 from './pages/DetailPrint11';
import InvoicePrint from './pages/InvoicePrint';
import router from './routes/router';
import { RouterProvider } from 'react-router-dom';
function App() {

  return (
    <>
       <RouterProvider router={router}/>
    </>
  );
}

export default App;
