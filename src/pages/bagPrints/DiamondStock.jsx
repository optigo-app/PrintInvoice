
import queryString from "query-string";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/bagprint/print20A.css";
import BarcodeGenerator from "../../components/BarcodeGenerator";
import Loader from "../../components/Loader";
import { GetStockData } from "../../GlobalFunctions/GetStockData";
import { GetUniquejob } from "../../GlobalFunctions/GetUniqueJob";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import { organizeData } from "../../GlobalFunctions/OrganizeBagPrintData";
import { GetChunkData } from "../../GlobalFunctions/GetChunkData";
import { checkArr, checkInstruction } from "../../GlobalFunctions";
import BarcodeStickerGen from './BarcodeStickerGen';
function DiamondStock({ queries, headers }) {
      const [data, setData] = useState([]);
      const location = useLocation();
      const queryParams = queryString.parse(location.search);
      const resultString = GetUniquejob(queryParams?.str_srjobno);
      const chunkSize10 = 10;
      
      console.log("TCL: DiamondStock -> ", queries?.rfbag)

     useEffect(() => {
      
    
        const fetchData = async () => {
          try {
            const responseData = [];
            const objs = {
            rfbag: queries?.rfbag,
              jobno: resultString,
              custid: queries?.custid,
              printname: queries?.printname,
              appuserid: queries?.appuserid,
              url: queries?.url,
              headers: headers,
              
            };
    
            const allDatas = await GetStockData(objs);
        
            
            setData(allDatas?.rd);
          } catch (error) {
            console.log(error);
          }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      
      const containerStyle = {
        display: 'flex',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'white',
        padding: '20px',
        border: '1px solid #ddd',
        width: 'fit-content',
        gap: '20px',
      };
    
      const leftColumnStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      };
    
      const rowStyle = {
        display: 'flex',
        alignItems: 'baseline',
        fontSize: '24px',
      };
    
      const labelStyle = {
        color: '#888',
        width: '120px',
        fontWeight: 'normal',
      };
    
      const valueStyle = {
        color: '#000',
        fontWeight: 'bold',
        fontSize: '28px',
      };
    
      const barcodeContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      };
    
      // Simulated barcode using CSS gradients
       
    
      const serialStyle = {
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        fontSize: '42px',
        fontWeight: 'bold',
        letterSpacing: '2px',
        transform: 'rotate(180deg)',
      };

      const styleBarcode = {
        objectFit: 'cover',
        position: 'absolute',
        height: '20px',
        left: '13.55rem',
        top: '100px',
        transform: 'rotate(90deg)',
        width: '200px'
      };
    
  return (
    <div>
    {data?.map((item, index) => (
      <div key={index}>
           <div style={containerStyle}>
      {/* Data Section */}
      <div style={leftColumnStyle}>
        <h1 style={{ fontSize: '36px', margin: '0 0 10px 0', letterSpacing: '2px' }}>{item?.itemname}</h1>
        
        <div style={rowStyle}>
          <span style={labelStyle}>M.Type :</span>
          <span style={valueStyle}>{item?.materialtypename}</span>
        </div>

        <div style={rowStyle}>
          <span style={labelStyle}>Lot# :</span>
          <span style={valueStyle}>DS2804</span>
        </div>

        <div style={rowStyle}>
          <span style={labelStyle}>Shape :</span>
          <span style={valueStyle}>{item?.shape}</span>
        </div>

        <div style={rowStyle}>
          <span style={labelStyle}>Clarity :</span>
          <span style={valueStyle}>{item?.clarity}</span>
        </div>

        <div style={rowStyle}>
          <span style={labelStyle}>Color :</span>
          <span style={valueStyle}>{item?.color}</span>
        </div>

        <div style={rowStyle}>
          <span style={labelStyle}>Size :</span>
          <span style={valueStyle}>{item?.size}</span>
        </div>

        <div style={rowStyle}>
          <span style={labelStyle}>Wt(ctw) :</span>
          <span style={valueStyle}>{item?.TotalRemainingWeight}</span>
        </div>

        <div style={rowStyle}>
          <span style={labelStyle}>Pcs :</span>
          <span style={valueStyle}>{item?.TotalRemainingPcs}</span>
        </div>

        <div style={rowStyle}>
          <span style={labelStyle}>Cust :</span>
          <span style={valueStyle}>{item?.istoreCust_Customercode}</span>
        </div>
      </div>

      {/* Barcode Section */}
      <div style={barcodeContainerStyle}>
        <div style={styleBarcode}>
        {/* <BarcodeStickerGen data={item?.rfbag} /> */}
        {/* <BarcodeGenerator data={item?.rfbag}/> */}
        </div>
        <div style={serialStyle}>{item?.rfbag}</div>
      </div>
    </div>
      </div>
    ))}

  
    </div>
  )
}

export default DiamondStock
