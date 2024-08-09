import React, { useEffect, useState } from "react";
import { GetData } from "../../GlobalFunctions/GetData";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import Loader from "../../components/Loader";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import QRCodeGenerator from "../../components/QRCodeGenerator";
import "../../assets/css/bagprint/searchmaterial.css";

const SearchMaterial = ({ queries, headers }) => {
  
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location.search);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const objs = {
          jobno: queryParams?.str_srjobno,
          custid: queries.custid,
          printname: queries.printname,
          appuserid: queries.appuserid,
          url: queries.url,
          headers: headers,
        };

        const allDatas = await GetData(objs);

        const showObj = {
          istoreCust_Customercode:'',
          rfbag:'',
          materialtypename:'',
          job:'',
          ShapeName:'',
          QualityName:'',
          Colorname:'',
          SizeName:'',
          Wt: 0,
          Pcs: 0,
          ItemName:'',
          findingaccessoriesname:'',
          Mastermanagement_itemid:''
        }

        let apiData = allDatas?.rd[0];

        //metal
        if(apiData?.Mastermanagement_itemid === 1){
          
          showObj.ItemName = 'METAL';

          showObj.istoreCust_Customercode = '';
          showObj.rfbag = apiData?.rfbag;
          showObj.materialtypename = apiData?.materialtypename;
          showObj.job = apiData?.job;
          showObj.Mastermanagement_itemid = apiData?.Mastermanagement_itemid;

          showObj.ShapeName = apiData?.metaltypename;
          showObj.QualityName = apiData?.metalpurity;
          showObj.Colorname = apiData?.metalcolorname;
          showObj.SizeName = '';
          showObj.Wt = apiData?.materialWt;
          showObj.Pcs = '';
          
        }

        //diamond
        if(apiData?.Mastermanagement_itemid === 3){

          showObj.ItemName = 'DIA';

          showObj.Mastermanagement_itemid = apiData?.Mastermanagement_itemid;
          showObj.istoreCust_Customercode = apiData?.istoreCust_Customercode;
          showObj.rfbag = apiData?.rfbag;
          showObj.materialtypename = apiData?.materialtypename;
          showObj.job = apiData?.job;

          showObj.ShapeName = apiData?.diamondshapename;
          showObj.QualityName = apiData?.diamondclarityname;
          showObj.Colorname = apiData?.diamondcolorname;
          showObj.SizeName = apiData?.diamondsize;
          showObj.Wt = apiData?.materialWt;
          showObj.Pcs = '';
          
        }

        //colorstone
        if(apiData?.Mastermanagement_itemid === 4){

          showObj.ItemName = 'CS';

          showObj.Mastermanagement_itemid = apiData?.Mastermanagement_itemid;
          showObj.istoreCust_Customercode = apiData?.istoreCust_Customercode;
          showObj.rfbag = apiData?.rfbag;
          showObj.materialtypename = apiData?.materialtypename;
          showObj.job = apiData?.job;

          showObj.ShapeName = apiData?.fancystoneshapename;
          showObj.QualityName = apiData?.fancystonequalityname;
          showObj.Colorname = apiData?.fancystonecolorname;
          showObj.SizeName = apiData?.fancystonesize;
          showObj.Wt = apiData?.materialWt;
          showObj.Pcs = '';

        }

        //finding
        if(apiData?.Mastermanagement_itemid === 5){
          showObj.ItemName = 'FINDING';

          showObj.findingaccessoriesname = apiData?.findingaccessoriesname;
          showObj.Mastermanagement_itemid = apiData?.Mastermanagement_itemid;
          showObj.istoreCust_Customercode = '';
          showObj.rfbag = apiData?.rfbag;
          showObj.materialtypename = apiData?.materialtypename;
          showObj.job = apiData?.job;

          showObj.ShapeName = apiData?.metaltypename + " " + apiData?.findingpurity;
          showObj.QualityName = apiData?.findingtypename;
          showObj.Colorname = apiData?.findingcolorname;
          showObj.SizeName = apiData?.fancystonesize;
          showObj.Wt = (apiData?.findingctw)?.toFixed(3) + " gm";
          showObj.Pcs = apiData?.findingpcs;

        }

        //misc
        if(apiData?.Mastermanagement_itemid === 7){

          showObj.ItemName = 'MISC';

          showObj.Mastermanagement_itemid = apiData?.Mastermanagement_itemid;
          showObj.istoreCust_Customercode = apiData?.istoreCust_Customercode;
          showObj.rfbag = apiData?.rfbag;
          showObj.materialtypename = apiData?.materialtypename;
          showObj.job = apiData?.job;

          showObj.ShapeName = apiData?.fancystoneshapename;
          showObj.QualityName = apiData?.fancystonequalityname;
          showObj.Colorname = apiData?.fancystonecolorname;
          showObj.SizeName = apiData?.fancystonesize;
          showObj.Wt = apiData?.materialWt;
          showObj.Pcs = '';

        }

        setData(showObj);

      } catch (error) {
        console.log(error);
      }

    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {data?.length === 0 ? (
        <Loader />
      ) : (
        <>
            <div style={{display:'flex'}}>
            <div className="sm_container">
              <div className="div2_SM">
                <div className="center_sm_rf mt_8_SM">{data?.istoreCust_Customercode}</div>
                <div className="qrcodebgSM center_sm_rf">
                  <QRCodeGenerator text={data?.rfbag} />
                </div>
              </div>
              <div className="div1_SM">
                <div>{data?.ItemName} : <span className="rfbagValSM">{data?.rfbag}</span></div>
                <div> {data?.materialtypename} {data?.ShapeName} { data?.Mastermanagement_itemid === 5 ? data?.QualityName + " " + data?.findingaccessoriesname : data?.QualityName} {data?.Colorname}</div>
                <div>{data?.job}</div>
                { data?.Wt !== '' && <div>{data?.Wt}</div>}
                { data?.SizeName !== '' && <div>{data?.SizeName}</div>}
              </div>
            </div>
            <div className="print_btn_SM end_SM">
            <button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)} >
              Print
            </button>
          </div>
          </div>
        </>
      )}
    </>
  );
};

export default SearchMaterial;

