import queryString from 'query-string';
import React from 'react'
import { useLocation } from 'react-router-dom';
import { GetUniquejob } from '../../GlobalFunctions/GetUniqueJob';
import { useState } from 'react';
import { useEffect } from 'react';
import { GetData } from '../../GlobalFunctions/GetData';
import { organizeData } from '../../GlobalFunctions/OrganizeBagPrintData';
import Loader from '../../components/Loader';
import { handlePrint } from '../../GlobalFunctions/HandlePrint';
import "../../assets/css/bagprint/jobbagsticker.css"
import QRCodeGenerator from '../../components/QRCodeGenerator';
const Jobbagsticker = ({ queries, headers }) => {
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const resultString = GetUniquejob(queryParams?.str_srjobno);
  const [data, setData] = useState([]);
  useEffect(() => {
      if (Object.keys(queryParams)?.length !== 0) {
          atob(queryParams?.imagepath);
      }
  }, [queryParams]);
  useEffect(() => {
    const fetchData = async () => {
        try {
            const responseData = [];
            const objs = {
                jobno: resultString,
                custid: queries.custid,
                printname: queries.printname,
                appuserid: queries.appuserid,
                url: queries.url,
                headers: headers,
              };
              let allDatas = await GetData(objs);
      
              let datas = organizeData(allDatas?.rd, allDatas?.rd1);

              // eslint-disable-next-line array-callback-return
              datas?.map((a) => {

                let length = 0;
                let clr = {
                    clrPcs: 0,
                    clrWt: 0
                };
                let dia = {
                    diaPcs: 0,
                    diaWt: 0
                };
                let misc = {
                    miscWt: 0
                };
                let ArrofSevenSize = [];
                let ArrofFiveSize = [];
                // eslint-disable-next-line array-callback-return
                a?.rd1?.map((e, i) => {
                    if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
                        length++;
                    }
                    if (e?.MasterManagement_DiamondStoneTypeid === 3) {
                        dia.diaPcs = dia.diaPcs + e?.ActualPcs;
                        dia.diaWt = dia.diaWt + e?.ActualWeight;
                    } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
                        clr.clrPcs = clr.clrPcs + e?.ActualPcs;
                        clr.clrWt = clr.clrWt + e?.ActualWeight;
                    } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
                        misc.miscWt = misc.miscWt + e?.ActualWeight;
                    }
                    if (e?.MasterManagement_DiamondStoneTypeid === 3) {
                        ArrofSevenSize.push(e);
                    } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
                        ArrofFiveSize.push(e);
                    } else {
                        return '';
                    }
                });
                let imagePath = queryParams?.imagepath;
                imagePath = atob(queryParams?.imagepath);
                
                let img = imagePath + a?.rd?.ThumbImagePath;
                responseData.push({ data: a, additional: { length: length, clr: clr, dia: dia, img: img, misc: misc } });


              })
            setData(responseData);
        } catch (error) {
            console.log(error);
        }
    };
    fetchData();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

// useEffect(() => {
//     if (data?.length !== 0) {
//         setTimeout(() => {
//             window.print();
//         }, 4000);
//     }
// }, [data]);
  return (
    <div>
        {
          data?.length === 0 ? <Loader /> : <React.Fragment>
            <div className="print_btn"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
                    Print
                </button></div>
                <div className='mainjobbagsticker'>
                {Array.from({ length: queries?.pageStart }, (_, index) => (
                        index > 0 && <div key={index} className="container  ml_5 mb_10"></div>
                    ))}
                    {
                      data?.length > 0 && data?.map((e, index) => {
                        return(
                          
                                <div className='containerjbsbg'>
                                { e?.data?.rd?.serialjobno?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.serialjobno}</div>} 
                                { e?.data?.rd?.Designcode?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.Designcode}</div>} 
                                { e?.data?.rd?.CustomerCode?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.CustomerCode}</div>} 
                                { e?.data?.rd?.OrderNo?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.OrderNo}</div>} 
                                { e?.data?.rd?.promisedate?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.promisedate}</div>} 
                                { e?.data?.rd?.mastermanagement_maketypename?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.mastermanagement_maketypename}</div>} 
                                { e?.data?.rd?.MetalType?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.MetalType}</div>} 
                                { e?.data?.rd?.MetalWeight?.length > 0 && <div className='fsjbsbg'>{(+e?.data?.rd?.MetalWeight)?.toFixed(3)}gm</div>} 
                                { e?.data?.rd?.Size?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.Size}</div>}                                 
                                <div className='d-flex justify-content-center align-items-center'>
                                <QRCodeGenerator
                                  text={e?.data?.rd.serialjobno}
                                />
                                </div>
                              </div>
                          
                          
                        )
                      })
                    }
                </div>
          </React.Fragment>
        }
    </div>
  )
}

export default Jobbagsticker