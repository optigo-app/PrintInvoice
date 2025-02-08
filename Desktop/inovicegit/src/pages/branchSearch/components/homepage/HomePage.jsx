import { Alert, Box, Button, Card, Chip, Snackbar, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import "./homepage.css"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { cloneDeep } from 'lodash';
const HomePage = ({Token}) => {
    const theme = useTheme();
    const [viewDetailsFlag, setViewDetailsFlag] = useState(false);
    const [activeButton, setActiveButton] = useState('Design'); 

    const [searchVal, setSearchVal] = useState('');
    const [result, setResult] = useState([]);
    const [selectedDesign, setSelectedDesign] = useState([]);

    const [loader, setLoader] = useState(false);
    
    
    const buttonStyles = (buttonName) => ({
        mx: 1,
        py: 1,
        backgroundColor:
          activeButton === buttonName
            ? theme?.palette?.customColors?.btnThemeColor // Active button color
            : theme?.palette?.customColors?.btngrpThemeColor, // Inactive button color
        color:
          activeButton === buttonName
            ? 'white' // Active button text color
            : theme?.palette?.customColors?.btnFontThemeColor, // Inactive button text color
        boxShadow: 'none',
        borderRadius: '12px',
        '&:hover': {
          backgroundColor:
            activeButton === buttonName
              ? theme?.palette?.customColors?.btnThemeColor // Keep the hover effect for active button
              : theme?.palette?.customColors?.btngrpThemeColor, // Hover for inactive button
        },
    });

      const handleSearch = (e) => {
        setSearchVal(e.target.value);
      }

      const handleApply = () => {
        fetchData(searchVal);
        setViewDetailsFlag(true);
      }

      const fetchData = async (val) => {
        try {
          setLoader(true);
          let apiUrl = '';
          if(window.location?.hostname?.toLowerCase() === 'zen' || window.location?.hostname?.toLowerCase() === 'localhost'){
            apiUrl = "http://zen/jo/api-lib/App/BranchProductSearch";
          }else{
            apiUrl = "https://view.optigoapps.com/linkedapp/App/BranchProductSearch";
          }

          const body = {
              "Token" : `${Token}`
              ,"ReqData":`[{\"Token\":\"${Token}\",\"Evt\":\"ProductStock\",\"SearchBy\":\"${activeButton}\",\"SearchValue\":\"${val}\"}]`
            }

          const response = await axios.post(apiUrl, body);
          if(response?.data?.Status === "200"){
            setLoader(false);
            loadData((response?.data?.Data?.DT || []), (response?.data?.Data?.DT1 || []), (response?.data?.Data?.DT2 || []));
          }else{
            setLoader(false);
          }
        } catch (error) {
          console.log(error);
          setLoader(false);
          setMessage("Some Error Occured!");
          setOpen(true);
        }
      }

      // const loadData = (dt, dt1, dt2) => {

      //   let resultArray = [];

      //   dt?.forEach((e) => {
      //     let nestedDetails = [];
      //     dt1?.forEach((el) => {
      //       if(e?.BrachName === el?.BrachName){
      //         nestedDetails.push(el);
      //       }
      //     })
      //     let obj = cloneDeep(e);

      //     obj.branchDetails = nestedDetails;
      //     resultArray.push(obj);
      //   });

        
        
      //   let result = resultArray?.filter((e) => e?.branchDetails?.length > 0);


      //   // result?.forEach(branch => {
      //   //   // Initialize excludesDesigns as an empty array
      //   //   branch.excludesDesigns = [];
        
      //   //   // Loop over each design in the branchDetails
      //   //   branch?.branchDetails?.forEach(detail => {
      //   //     // Check if the designno exists in the availableDesigns array
      //   //     const isDesignAvailable = dt2?.some(design => design.designno === detail.designno);
        
      //   //     // If designno is not in the availableDesigns array, add it to excludesDesigns
      //   //     if (!isDesignAvailable) {
      //   //       branch.excludesDesigns.push(detail.designno);
      //   //     }
      //   //   });
      //   // });
      //   let finalArray = [];
      //   result?.forEach((branch) => {
      //     // Initialize excludesDesigns as an empty array
      //     let obj = {...branch};
      //     obj.excludesDesigns = [];
          
      //     obj?.branchDetails?.forEach((a) => {
      //       dt2?.forEach((al) => {
      //         if(a?.designno !== al?.designno && a?.BrachName === obj?.BrachName){
      //           obj.excludesDesigns.push(al?.designno);
      //         }
      //       })
      //     })
      //     finalArray.push(obj);
      //     // Step 5: Loop over each design in the branchDetails
        
            

      //       // Step 6: Check if the designno exists in dt2
      //       // const isDesignAvailable = dt2?.filter((design) => design.designno !== detail.designno);
      //       // console.log(`Is design ${detail.designno} available:`, isDesignAvailable);  // Log availability check

      //       // console.log(isDesignAvailable);
            

      //       // Step 7: If designno is not in the availableDesigns array, add it to excludesDesigns
      //       // if (!isDesignAvailable) {
      //       //   console.log(`Design ${detail.designno} not available, adding to excludesDesigns`);  // Log when adding to excludesDesigns
      //       //   branch.excludesDesigns.push(detail.designno);
      //       // }
      //     // });
      //   });
      

      //   let finalArray2 = [];

      //   finalArray?.forEach((a) => {
      //     let obj = {...a};

      //     if(a?.excludesDesigns?.length === dt2?.length){
      //       obj.excludesDesigns = [];
      //     }
      //     finalArray2.push(obj);
      //   })
        
      //   setResult(finalArray2);
        
        
      // }

      const loadData = (dt, dt1, dt2) => {

        let resultArray = dt?.map((e) => {
          let nestedDetails = dt1?.filter((el) => el?.BrachName === e?.BrachName);
          return { ...e, branchDetails: nestedDetails };
        }).filter((e) => e?.branchDetails?.length > 0);
      
        let finalArray = resultArray?.map((branch) => {
          let obj = { ...branch, excludeDesigns: [] };
          
          branch?.branchDetails?.forEach((a) => {
            dt2?.forEach((al) => {
              if (a?.designno !== al?.designno && a?.BrachName === obj?.BrachName) {
                obj.excludeDesigns.push(al?.designno);
              }
            });
          });
          return obj;
        });
      
        let finalArray2 = finalArray?.map((a) => {
          if (a?.excludeDesigns?.length === dt2?.length) {
            a.excludeDesigns = [];
          }
          return a;
        });
      
        setResult(finalArray2);
      };
      
      useEffect(() => {
        setResult([]);
        setSearchVal('');

        if(activeButton === "design" || activeButton === "tagno"){
          setViewDetailsFlag(true);
        }else{
          setViewDetailsFlag(false);
        }

      },[activeButton]);

      const [open, setOpen] = useState(false);
      const [message, setMessage] = useState('');
    
      // Handle open and close of Snackbar
      const handleClickMSG = (msg) => {
        setMessage(msg);
        setOpen(true);
      };
    
      const handleCloseMSG = () => {
        setOpen(false);
      };

  return (
    <div className='theme_fs_brs hp_container'>
        <Typography align='center' my={1} sx={{color:theme?.palette?.customColors?.btnFontThemeColor}}>Search your design by designno/tagno/designset</Typography>
      
      <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', }}>
        <Button
          variant="contained"
          sx={buttonStyles('Design')}
          className="theme_fs_brs"
          onClick={() => {
            setActiveButton('Design');
            setViewDetailsFlag(false);  // No effect on viewDetailsFlag for Design
          }}
        >
          Design
        </Button>
        <Button
          variant="contained"
          sx={buttonStyles('TagNo')}
          className="theme_fs_brs"
          onClick={() => {
            setActiveButton('TagNo'); 
            setViewDetailsFlag(false);  // No effect on viewDetailsFlag for TagNo
          }}
        >
          Tag No
        </Button>
        <Button
          variant="contained"
          sx={buttonStyles('DesignSet')}
          className="theme_fs_brs"
          onClick={() => {
            setActiveButton('DesignSet');
            setViewDetailsFlag(false);  // Initially hide the cards for DesignSet
          }}
        >
          Design Set
        </Button>
      </Box>
      <Box style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%'}} sx={{my:2}}>
        <input type="text" className='input_field_hp' placeholder='NCKB002 1/179 DesSet1' value={searchVal} disabled={loader} onChange={(e) => handleSearch(e)} /> 
        <Button variant='contained' 
          onClick={() => handleApply()}
          disabled={loader}
          sx={{backgroundColor:theme?.palette?.customColors?.purple, py:1.2, ml:1, borderRadius:'10px'}}
        >Apply</Button>
      </Box>
      { activeButton === "DesignSet" &&  <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}><Typography sx={{color:theme?.palette?.customColors?.btnFontThemeColor, fontWeight:'600', minWidth:'21rem'}} variant='h5'>Total Set Available: 5</Typography></Box>}
      <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%'}}>
        <Box my={2} sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            { activeButton?.toLowerCase() === "designset" && <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}} marginRight={12}>
                <Typography sx={{color:theme?.palette?.customColors?.btnFontThemeColor}} variant='h6'>Selected Design</Typography>
                <Button variant='contained' sx={{color:theme?.palette?.customColors?.btnFontThemeColor, backgroundColor:theme?.palette?.customColors?.btngrpThemeColor, mx:1}}>LR-125(5)</Button>
                <Button variant='contained' sx={{color:theme?.palette?.customColors?.btnFontThemeColor, backgroundColor:theme?.palette?.customColors?.btngrpThemeColor, mx:1}}>LR-125(5)</Button>
            </Box>}
            {/* { activeButton?.toLowerCase() === "designset" && <Button
                variant="contained"
                sx={{
                    color: 'white', // Set the text color to white
                    fontWeight: 'bold', // Make the text bold
                    background: 'linear-gradient(to right, #D26CF3, #9A63FC)', // Apply the gradient
                    mx: 1, // Add horizontal margin
                    '&:hover': {
                    background: 'linear-gradient(to right, #C55DE9, #8C5BEF)', // Optional: Slightly different gradient on hover
                    },
                }}
                onClick={() => setViewDetailsFlag(!viewDetailsFlag)}
                >
                { !viewDetailsFlag ? 'HIDE' : 'VIEW' } DETAILS
            </Button>} */}
        </Box>
      </Box>
      {  <Box sx={{display:'flex', flexWrap:'wrap', justifyContent:"space-around", alignItems:'center'}} mt={1} mb={6}>
      {
        result?.map((e, i) => {
            return <Card sx={{boxShadow: '0 4px 20px rgba(0, 0, 0, 0.00)', border:"1px solid #e8e8e8",borderRadius:'16px', width:"30rem", m:1 }} key={i}  >
            <Typography variant='h5' p={1} my={2} mt={1} ml={1}>{e?.BrachName}</Typography>        
            <Box py={2} px={2}>
                <div style={{textWrap:'wrap', wordBreak:'break-word', color:theme?.palette?.customColors?.btnFontThemeColor}}>{e?.CompanyAddress}{e?.CompanyAddress2}</div>
                <div style={{textWrap:'wrap', wordBreak:'break-word', color:theme?.palette?.customColors?.btnFontThemeColor}}>{e?.CompanyCity}, {e?.CompanyPinCode}, { e?.CompanyTellNo === "" ? '' : "T -"} {e?.CompanyTellNo}</div>
            </Box>
            { activeButton === "DesignSet" && <Box sx={{backgroundColor:theme?.palette?.customColors?.cardBgThemeColor, pt:0.5, pb:0.5, px:1}} >
              <Typography variant='h6' sx={{color:theme?.palette?.secondary?.main, fontWeight:'bold'}} pt={2} px={1}>
                 <>SETS AVAILABLE - {e?.branchDetails?.length}</>
              </Typography>
            </Box>}
            { (activeButton === "DesignSet"  && e?.excludeDesigns?.length > 0) && <Box sx={{backgroundColor:theme?.palette?.customColors?.cardBgThemeColor, pt:0, pb:0.5, px:1}} >
              <Typography variant='h6' sx={{color:theme?.palette?.secondary?.main, fontWeight:'bold'}} pt={1} px={1}>
                 <><span style={{color:theme?.palette?.customColors?.purple}}>EXCLUDES&nbsp;&nbsp;-&nbsp;&nbsp;</span><span style={{color:theme?.palette?.warning?.main}}>{e?.excludeDesigns?.join(",")}</span></>
              </Typography>
            </Box>}

            {
              e?.branchDetails?.map((el, ind) => {
                return <Box  sx={{backgroundColor:theme?.palette?.customColors?.cardBgThemeColor}} p={1} key={ind}>
                <Box sx={{backgroundColor:'white', borderRadius:'8px', display:'flex', justifyContent:'space-between', alignItems:'center'}} p={1} m={1}>
                    <div>
                        <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center'}}>
                            <Typography variant='h6' sx={{color:theme?.palette?.primary?.main}} mr={1}>{el?.designno}&nbsp;</Typography>
                            <Typography variant='h6' style={{color:theme?.palette?.customColors?.secondary?.main}}>({el?.TotalDesign})</Typography>
                        </div>
                        <Typography mt={0.5} style={{color:theme?.palette?.customColors?.btnFontThemeColor, marginBottom:'4px', fontWeight:'bolder'}}>
                          {el?.Metal_Purity_Name} {el?.MetalColorName} {el?.Metal_Type_Name} {el?.DQuality + " - " +el?.DColor}</Typography>
                    </div>
                    <div>
                        <div className='custom_chip_hp'>
                          <CheckCircleIcon fontSize='xs' color='success' sx={{mr:1}} />
                          <span style={{color:'grey'}}>SIZE {el?.JewellerySize}</span>&nbsp;-&nbsp; {el?.JewellerySize === '' && 'NOT'} AVAILABLE
                        </div>
                    </div>
                </Box>
            </Box>
              })
            }
          </Card>
        })
      }
      </Box>}

      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseMSG} anchorOrigin={{
          vertical: 'bottom',  // Position it at the top of the screen
          horizontal: 'center',  // Align it horizontally to the center
          bottom:30,
        }}
        sx={{
          marginBottom:'100px'
        }}>
        <Alert onClose={handleCloseMSG} severity="error" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default HomePage
