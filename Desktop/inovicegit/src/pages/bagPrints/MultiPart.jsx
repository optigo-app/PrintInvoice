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
    const [countObj, setCountObj] = useState({});
    const queryParams = queryString.parse(location.search);
    const resultString = GetUniquejob(queryParams?.str_srjobno);
    const [data, setData] = useState([]);
    const [title, setTitle] = useState('');
      
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
            finding:0,
            diamondJobList:[],
            colorStoneList:[],
            miscJobList:[],
            findingJobList:[]
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
        const uniqueDiamondJobs = [...new Set(diaList.map(d => d.SerialJobno))];
        const uniqueClsJobs = [...new Set(clsList.map(d => d.SerialJobno))];
        const uniqueMiscJobs = [...new Set(miscList.map(d => d.SerialJobno))];
        const uniqueFindingJobs = [...new Set(findingList.map(d => d.SerialJobno))];
        // Store the unique job count in obj.dia
        obj.dia = uniqueDiamondJobs.length;
        obj.diamondJobList = uniqueDiamondJobs;

        obj.cls = uniqueClsJobs.length;
        obj.colorStoneList = uniqueClsJobs;

        obj.misc = uniqueMiscJobs.length;
        obj.miscJobList = uniqueMiscJobs;

        obj.finding = uniqueFindingJobs.length;
        obj.findingJobList = uniqueFindingJobs;

        setCountObj(obj);

        // obj.dia = diaList?.length;
        // setJobsData(arr);
        
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
        setTitle('');
        setFilterData([]);
        if(args === 'diamond'){
            let finalArr = [];
            data?.forEach((e, i) => {
                countObj?.diamondJobList?.forEach((a) => {
                    if(e?.data?.rd?.serialjobno === a){
                        finalArr.push(e);
                    }
                })
            })
            setTimeout(() => {
                setFilterData(finalArr);
                setTitle('DIAMOND')

                // setData(finalArr);
            },0);
            if(finalArr.length > 0){
                setTimeout(() => {
                    window.print();
                }, 1000) 
            }
        }
        if(args === 'colorstone'){
            let finalArr = [];
            data?.forEach((e, i) => {
                countObj?.colorStoneList?.forEach((a) => {
                    if(e?.data?.rd?.serialjobno === a){
                        finalArr.push(e);
                    }
                })
            })
            setTimeout(() => {
                setFilterData(finalArr);
                setTitle('COLORSTONE')

                // setData(finalArr);
            },0);
            if(finalArr.length > 0){
                setTimeout(() => {
                    window.print();
                }, 1000) 
            }
        }
        if(args === 'misc'){
            let finalArr = [];
            data?.forEach((e, i) => {
                countObj?.miscJobList?.forEach((a) => {
                    if(e?.data?.rd?.serialjobno === a){
                        finalArr.push(e);
                    }
                })
            })
            setTimeout(() => {
                setFilterData(finalArr);
                setTitle('MISC')

                // setData(finalArr);
            },0);
            if(finalArr.length > 0){
                setTimeout(() => {
                    window.print();
                }, 1000) 
            }
        }
        if(args === 'finding'){
            let finalArr = [];
            data?.forEach((e, i) => {
                countObj?.findingJobList?.forEach((a) => {
                    if(e?.data?.rd?.serialjobno === a){
                        finalArr.push(e);
                    }
                })
            })
            setTimeout(() => {
                setFilterData(finalArr);
                setTitle('FINDING')

                // setData(finalArr);
            },0);
            if(finalArr.length > 0){
                setTimeout(() => {
                    window.print();
                }, 1000) 
            }
        }
    }
  

  return (
    <div className='bg_color_mlt'>
    {
      data?.length === 0 ? <Loader /> : <React.Fragment>
        {/* <div className="print_btn"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
                Print
            </button></div> */}
            <div className='hideOnPrint bg_color_container h_100_vh_mlt'>
                <div className='w-100 d-flex align-items-center justify-content-center'>
                    <div className=' d-flex flex-column justify-content-between align-items-center p-1'>
                        <div className='d-flex align-items-center justify-content-center py-2'>
                            <div className='multipart_head' style={{fontFamily:'Helvetica, Verdana, sans-serif'}}>Multi Part Bagging Process For &nbsp;</div>
                            <div className='multipart_head text-center number-box border border_color_head' style={{minWidth:'100px'}}>{data?.length}</div>
                            <div className='multipart_head'>&nbsp;{data?.length > 1 ? 'Jobs' : 'Job'}</div>
                        </div>
                        <div className='d-flex  justify-content-between align-items-center py-2 flex-wrap'>
                            <div style={{margin:'1rem', boxSizing:'border-box'}} className='bg-white'>
                                <Box className="border rounded box_css_mlt d-flex flex-column border_color_head justify-content-between align-items-center ">
                                    <div className='w-100 d-flex justify-content-center align-items-center py-2 border-bottom border_color_head'><Typography sx={{fontWeight:'bold'}}>DIAMOND BAGS</Typography></div>
                                    <div className='p-2 text-break text-center'>
                                            Your Selection having <span className='number-box border border_color_head'>{countObj?.dia}</span>  <span className='fw-bold'>Jobs</span> for <span className='fw-bold'>Diamond </span> bagging.
                                    </div>

                                    <div className='p-1 d-flex justify-content-center align-items-center pb-2'>
                                        <Button variant='contained' size='small' color='primary' disabled={countObj.dia < 1} onClick={() => handleButtonClick('diamond')}>Print</Button>
                                    </div>
                                </Box>
                            </div>
                            <div style={{margin:'1rem', boxSizing:'border-box'}} className='bg-white'>
                                <Box className="border rounded box_css_mlt d-flex flex-column border_color_head justify-content-between align-items-center ">
                                    <div className='w-100 d-flex justify-content-center align-items-center py-2 border-bottom border_color_head'><Typography sx={{fontWeight:'bold'}}>COLORSTONE BAGS</Typography></div>
                                    <div className='p-2 text-break text-center'>
                                            Your Selection having <span className='number-box border border_color_head'>{countObj?.cls}</span>  <span className='fw-bold'>Jobs</span> for <span className='fw-bold'>Colorstone </span> bagging.
                                    </div>

                                    <div className='p-1 d-flex justify-content-center align-items-center pb-2'>
                                        <Button variant='contained' size='small' color='primary' disabled={countObj.cls < 1} onClick={() => handleButtonClick('colorstone')}>Print</Button>
                                    </div>
                                </Box>
                            </div>
                            <div style={{margin:'1rem', boxSizing:'border-box'}} className='bg-white'>
                                <Box className="border rounded box_css_mlt d-flex flex-column border_color_head justify-content-between align-items-center ">
                                    <div className='w-100 d-flex justify-content-center align-items-center py-2 border-bottom border_color_head'><Typography sx={{fontWeight:'bold'}}>MISC BAGS</Typography></div>
                                    <div className='p-2 text-break text-center'>
                                            Your Selection having <span className='number-box border border_color_head'>{countObj?.misc}</span>  <span className='fw-bold'>Jobs</span> for <span className='fw-bold'>Misc </span> bagging.
                                    </div>

                                    <div className='p-1 d-flex justify-content-center align-items-center pb-2'>
                                        <Button variant='contained' size='small' color='primary' disabled={countObj.misc < 1} onClick={() => handleButtonClick('misc')}>Print</Button>
                                    </div>
                                </Box>
                            </div>
                            <div style={{margin:'1rem', boxSizing:'border-box'}} className='bg-white'>
                                <Box className="border rounded box_css_mlt d-flex flex-column border_color_head justify-content-between align-items-center ">
                                    <div className='w-100 d-flex justify-content-center align-items-center py-2 border-bottom border_color_head'><Typography sx={{fontWeight:'bold'}}>FINDING BAGS</Typography></div>
                                    <div className='p-2 text-break text-center'>
                                            Your Selection having <span className='number-box border border_color_head'>{countObj?.finding}</span>  <span className='fw-bold'>Jobs</span> for <span className='fw-bold'>Finding </span> bagging.
                                    </div>

                                    <div className='p-1 d-flex justify-content-center align-items-center pb-2'>
                                        <Button variant='contained' size='small' color='primary' disabled={countObj.finding < 1} onClick={() => handleButtonClick('finding')}>Print</Button>
                                    </div>
                                </Box>
                            </div>
                        {/* <div style={{ margin: "1rem" }}>
                            <Box className="diaCount diaextra">{countObj.dia}</Box>
                            <Button
                                color="success"
                                variant="contained"
                                sx={{ fontWeight: "bold", backgroundColor: `#28C76F`, textTransform: "none", minWidth:'120px' }}
                                className='succ_btn'
                                disabled={countObj.dia < 1}
                                onClick={() => handleButtonClick('diamond')}
                            >
                                {console.log(countObj.dia)}
                                <Typography sx={{color:'white', fontWeight:'bold'}}>Diamond</Typography>
                            </Button>
                        </div>
                        <div style={{ margin: "1rem" }}>
                            <Box className="diaCount diaextra1">{countObj.cls}</Box>
                            <Button
                                color="success"
                                variant="contained"
                                sx={{ fontWeight: "bold", backgroundColor: `#EA5455`, textTransform: "none", minWidth:'120px' }} className='cls_btn'
                                disabled={countObj.cls < 1}
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
                                sx={{ fontWeight: "bold", backgroundColor: `#FF9F43`, textTransform: "none", minWidth:'120px' }}
                                className='misc_btn'
                                disabled={countObj.misc < 1}
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
                                sx={{ fontWeight: "bold", backgroundColor: `#655BD3`, textTransform: "none", minWidth:'120px' }}
                                className='find_btn'
                                disabled={countObj.finding < 1}
                                onClick={() => handleButtonClick('finding')}
                            >
                                <Typography sx={{color:'white', fontWeight:'bold'}}>Finding</Typography>
                            </Button>
                        </div> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className='mainjobbagsticker showOnPrint'>
            {Array.from({ length: queries?.pageStart }, (_, index) => (
                    index > 0 && <div key={index} className="container  ml_5 mb_10"></div>
                ))}
                {
                  filterData?.length > 0 && filterData?.map((e, index) => {
                    return(
                      <React.Fragment key={index}>
                        {
                          e?.additional?.pages?.length > 0 ? e?.additional?.pages?.map((e, i) => {
                            return(
                              <div className='containerjbsbg' key={i}>
                                <div className=' fsjbsbg fw-bold py-1 d-flex align-items-center'>{title}</div>
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
                                <div className=' fsjbsbg fw-bold py-1 d-flex align-items-center'>{title}</div>
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
            </div>
      </React.Fragment>
    }
</div>
  )
}

export default MultiPart