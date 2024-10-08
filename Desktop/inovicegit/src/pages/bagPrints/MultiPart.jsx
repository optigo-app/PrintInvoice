import React from 'react'
import "../../assets/css/bagprint/multipart.css";
import queryString from 'query-string';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "../../assets/css/bagprint/jobbagsticker.css"
import Loader from '../../components/Loader';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import { GetUniquejob } from '../../GlobalFunctions/GetUniqueJob';
import { handlePrint } from '../../GlobalFunctions/HandlePrint';
import { FetchDatas } from '../../GlobalFunctions/FetchDatas';
import { Box, Button, Typography } from "@mui/material";
const MultiPart = ({ queries, headers }) => {
    const location = useLocation();
    const [filterData, setFilterData] = useState([]);
    const [jobsData, setJobsData] = useState([]);
    const [countObj, setCountObj] = useState({});
    const queryParams = queryString.parse(location.search);
    const resultString = GetUniquejob(queryParams?.str_srjobno);
    const [data, setData] = useState([]);
      
  useEffect(() => {
    const fetchData = async () => {
      try {
        const abc = await FetchDatas(queryParams, resultString, queries, headers);
        let diaList = [];
        let clsList = [];
        let miscList = [];
        let findingList = [];
        let obj = {
            dia:0,
            cls:0,
            misc:0,
            finding:0
        }
        let arr = [];
        abc[0]?.allDatas?.rd1?.forEach((a) => {
            
            if(a?.MasterManagement_DiamondStoneTypeid === 5){
                arr.push(a);
                findingList.push(a);
                //finding
            }
            if(a?.MasterManagement_DiamondStoneTypeid === 7){
                arr.push(a);
                miscList.push(a);
                //misc
            }
            if(a?.MasterManagement_DiamondStoneTypeid === 3){
                arr.push(a);
                diaList.push(a);
                //dia
            }
            if(a?.MasterManagement_DiamondStoneTypeid === 4){
                arr.push(a);
                clsList.push(a);
                //clr
            }
        })
        const uniqueDiamondJobs = new Set(diaList.map(d => d.SerialJobno));
        const uniqueClsJobs = new Set(clsList.map(d => d.SerialJobno));
        const uniqueMiscJobs = new Set(miscList.map(d => d.SerialJobno));
        const uniqueFindingJobs = new Set(findingList.map(d => d.SerialJobno));
        // Store the unique job count in obj.dia
        obj.dia = uniqueDiamondJobs.size;
        obj.cls = uniqueClsJobs.size;
        obj.misc = uniqueMiscJobs.size;
        obj.finding = uniqueFindingJobs.size;

        setCountObj(obj);

        // obj.dia = diaList?.length;
        setJobsData(arr);
        
        abc?.length > 0 ? setData(abc) : setData([])
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    useEffect(() => {
        if (Object.keys(queryParams)?.length !== 0) {
            atob(queryParams?.imagepath);
        }
    }, [queryParams]);

    const handleButtonClick = (args) => {
        console.log(args);
    }
  
//   useEffect(() => {
//       if (data?.length !== 0) {
//           setTimeout(() => {
//               window.print();
//           }, 4000);
//       }
//   }, [data]);

  return (
    <div>
    {
      data?.length === 0 ? <Loader /> : <React.Fragment>
        <div className="print_btn"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
                Print
            </button></div>
            <div className='w-100 d-flex align-items-center justify-content-center'>
                <div className='multipart_container p-1'>
                    <div className='d-flex align-items-center justify-content-center py-2'>
                        <div className='multipart_head'>Multi Part Bagging Total Jobs : </div>
                        <div className='multipart_head text-center' style={{minWidth:'100px'}}>{data?.length}</div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center py-2'>
                    <div style={{ margin: "1rem" }}>
                        <Box className="diaCount diaextra">{countObj.dia}</Box>
                        <Button
                            color="success"
                            variant="contained"
                            sx={{
                                fontWeight: "bold",
                                backgroundColor: `#28C76F`,
                                textTransform: "none",
                                minWidth:'120px'
                            }}
                            className='succ_btn'
                            onClick={() => handleButtonClick('diamond')}
                        >
                            <Typography sx={{color:'white', fontWeight:'bold'}}>Diamond</Typography>
                        </Button>
                    </div>
                    <div style={{ margin: "1rem" }}>
                        <Box className="diaCount diaextra1">{countObj.cls}</Box>
                        <Button
                            color="success"
                            variant="contained"
                            sx={{
                                fontWeight: "bold",
                                backgroundColor: `#EA5455`,
                                textTransform: "none",
                                minWidth:'120px'
                            }}
                            className='cls_btn'
                            onClick={() => handleButtonClick('colorstone')}
                        >
                            <Typography sx={{color:'white', fontWeight:'bold'}}>ColorStone</Typography>
                        </Button>
                    </div>
                    <div style={{ margin: "1rem" }}>
                        <Box className="diaCount diaextra2">{countObj.misc}</Box>
                        <Button
                            color="success"
                            variant="contained"
                            sx={{
                                fontWeight: "bold",
                                backgroundColor: `#FF9F43`,
                                textTransform: "none",
                                minWidth:'120px'
                            }}
                            className='misc_btn'
                            onClick={() => handleButtonClick('misc')}
                        >
                            <Typography sx={{color:'white', fontWeight:'bold'}}>Misc</Typography>
                        </Button>
                    </div>
                    <div style={{ margin: "1rem" }}>
                        <Box className="diaCount diaextra3">{countObj.finding}</Box>
                        <Button
                            color="success"
                            variant="contained"
                            sx={{
                                fontWeight: "bold",
                                backgroundColor: `#655BD3`,
                                textTransform: "none",
                                minWidth:'120px'
                            }}
                            className='find_btn'
                            onClick={() => handleButtonClick('finding')}
                        >
                            <Typography sx={{color:'white', fontWeight:'bold'}}>Finding</Typography>
                        </Button>
                    </div>
                    </div>
                </div>
            </div>
            {/* <div className='mainjobbagsticker'>
            {Array.from({ length: queries?.pageStart }, (_, index) => (
                    index > 0 && <div key={index} className="container  ml_5 mb_10"></div>
                ))}
                {
                  data?.length > 0 && data?.map((e, index) => {
                    return(
                      <React.Fragment key={index}>
                        {
                          e?.additional?.pages?.length > 0 ? e?.additional?.pages?.map((e, i) => {
                            return(
                              <div className='containerjbsbg' key={i}>
                            { e?.data?.rd?.serialjobno?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.serialjobno}</div>}
                            { e?.data?.rd?.Designcode?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.Designcode}</div>}
                            { e?.data?.rd?.CustomerCode?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.CustomerCode}</div>}
                            { e?.data?.rd?.OrderNo?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.OrderNo}</div>}
                            { e?.data?.rd?.promiseDatef?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.promiseDatef}</div>}
                            { e?.data?.rd?.mastermanagement_maketypename?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.mastermanagement_maketypename}</div>}
                            { e?.data?.rd?.MetalType?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.MetalType?.split(" ")[1] + " " +e?.data?.rd?.MetalColorCo}</div>}
                            { e?.data?.rd?.MetalWeight > 0 && <div className='fsjbsbg'>{(+e?.data?.rd?.MetalWeight)?.toFixed(3)}gm</div>}
                            <div className='fsjbsbg'>{(+e?.data?.rd?.MetalWeight)?.toFixed(3)}gm</div>
                            { e?.data?.rd?.Size?.length > 0 && <div className='fsjbsbg'>Size: {e?.data?.rd?.Size}</div>}
                            <div className='d-flex justify-content-start align-items-center'>
                            <QRCodeGenerator
                              text={e?.data?.rd.serialjobno}
                            />
                            </div>
                          </div>
                            )
                          }) : 
                          
                          <div className='containerjbsbg'>
                            { e?.data?.rd?.serialjobno?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.serialjobno}</div>}
                            { e?.data?.rd?.Designcode?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.Designcode}</div>}
                            { e?.data?.rd?.CustomerCode?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.CustomerCode}</div>}
                            { e?.data?.rd?.OrderNo?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.OrderNo}</div>}
                            { e?.data?.rd?.promiseDatef?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.promiseDatef}</div>}
                            { e?.data?.rd?.mastermanagement_maketypename?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.mastermanagement_maketypename}</div>}
                            { e?.data?.rd?.MetalType?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.MetalType?.split(" ")[1] +" " +e?.data?.rd?.MetalColorCo}</div>}
                            { e?.data?.rd?.MetalWeight > 0 && <div className='fsjbsbg'>{(+e?.data?.rd?.MetalWeight)?.toFixed(3)}gm</div>}
                            { e?.data?.rd?.Size?.length > 0 && <div className='fsjbsbg'>Size: {e?.data?.rd?.Size}</div>}
                            <div className='d-flex justify-content-start align-items-center'>
                            <QRCodeGenerator
                              text={e?.data?.rd.serialjobno}
                            />
                            </div>
                          </div>
                        }
                      </React.Fragment>
                    )
                  })
                }
            </div> */}
      </React.Fragment>
    }
</div>
  )
}

export default MultiPart