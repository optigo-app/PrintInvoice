import { ToastContainer } from "react-toastify";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import router from './routes/router';
import { BrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom';
import AllDesign from "./pages/AllDesign";
import QcReport from "./pages/qcreport/QcReport";


function App() {
  console.log('location', window.location);
  console.log("location url 1",window.location?.origin +  window.location.pathname);
  return (
    <>
       <RouterProvider router={router}/>
       {/* <BrowserRouter> */}
       {/* <Routes> */}
        {/* <Route path={`${window.location?.origin + window.location.pathname}/`} element={<AllDesign />} />
        <Route path={`${window.location?.origin + window.location.pathname}/qcreport`} element={<QcReport />} /> */}
        {/* <Route path={`/R50B3/RBIP/`} element={<AllDesign />} />
        <Route path={`/R50B3/RBIP/qcreport`} element={<QcReport />} />
       </Routes> */}
       {/* </BrowserRouter> */}
       <ToastContainer />
    </>
  );
}

export default App;


