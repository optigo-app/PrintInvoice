import { Box, Button, Card, Chip, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
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
            loadData((response?.data?.Data?.DT || []), (response?.data?.Data?.DT1 || []));
          }else{
            setLoader(false);
          }
        } catch (error) {
          console.log(error);
          setLoader(false);
        }
      }

      const loadData = (dt, dt1) => {

        let resultArray = [];

        dt?.forEach((e) => {
          let nestedDetails = [];
          dt1?.forEach((el) => {
            if(e?.BrachName === el?.BrachName){
              nestedDetails.push(el);
            }
          })
          let obj = cloneDeep(e);

          obj.branchDetails = nestedDetails;
          resultArray.push(obj);
        })

        console.log(resultArray);
        setResult(resultArray);
        
        
      }

  return (
    <div className='theme_fs_brs hp_container'>
        <Typography align='center' my={1} sx={{color:theme?.palette?.customColors?.btnFontThemeColor}}>Search your design by designno/tagno/designset</Typography>
      
      <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', }}>
        <Button
          variant="contained"
          sx={buttonStyles('Design')}
          className="theme_fs_brs"
          onClick={() => setActiveButton('Design')}
        >
          Design
        </Button>
        <Button
          variant="contained"
          sx={buttonStyles('TagNo')}
          className="theme_fs_brs"
          onClick={() => setActiveButton('TagNo')}
        >
          Tag No
        </Button>
        <Button
          variant="contained"
          sx={buttonStyles('DesignSet')}
          className="theme_fs_brs"
          onClick={() => setActiveButton('DesignSet')}
        >
          Design Set
        </Button>
      </Box>
      <Box style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%'}} sx={{my:2}}>
        <input type="text" className='input_field_hp' value={searchVal} disabled={loader} onChange={(e) => handleSearch(e)} /> 
        <Button variant='contained' 
          onClick={() => handleApply()}
          disabled={loader}
          sx={{backgroundColor:theme?.palette?.customColors?.purple, py:1.2, ml:1, borderRadius:'10px'}}
        >Apply</Button>
      </Box>
      <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}><Typography sx={{color:theme?.palette?.customColors?.btnFontThemeColor, fontWeight:'600', minWidth:'21rem'}} variant='h5'>Total Set Available: 5</Typography></Box>
      <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%'}}>
        <Box my={2} sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}} marginRight={12}>
                <Typography sx={{color:theme?.palette?.customColors?.btnFontThemeColor}} variant='h6'>Selected Design</Typography>
                <Button variant='contained' sx={{color:theme?.palette?.customColors?.btnFontThemeColor, backgroundColor:theme?.palette?.customColors?.btngrpThemeColor, mx:1}}>LR-125(5)</Button>
                <Button variant='contained' sx={{color:theme?.palette?.customColors?.btnFontThemeColor, backgroundColor:theme?.palette?.customColors?.btngrpThemeColor, mx:1}}>LR-125(5)</Button>
            </Box>
            <Button
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
                { viewDetailsFlag ? 'HIDE' : 'VIEW' } DETAILS
            </Button>
        </Box>
      </Box>
      { !viewDetailsFlag && <Box sx={{display:'flex', flexWrap:'wrap', justifyContent:"space-around", alignItems:'center'}} mt={1} mb={6}>
      {
        result?.map((e, i) => {
            return <Card sx={{boxShadow: '0 4px 20px rgba(0, 0, 0, 0.00)', border:"1px solid #e8e8e8",borderRadius:'16px', width:"25rem", m:1 }} key={i}  >
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

            {
              e?.branchDetails?.map((el, ind) => {
                return <Box  sx={{backgroundColor:theme?.palette?.customColors?.cardBgThemeColor}} p={1} key={ind}>
                <Box sx={{backgroundColor:'white', borderRadius:'8px', display:'flex', justifyContent:'space-between', alignItems:'center'}} p={1} m={1}>
                    <div>
                        <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center'}}>
                            <Typography variant='h6' sx={{color:theme?.palette?.primary?.main}} mr={1}>{el?.designno}&nbsp;</Typography>
                            <Typography variant='h6' style={{color:theme?.palette?.customColors?.secondary?.main}}>({el?.TotalDesign})</Typography>
                        </div>
                        <Typography mt={0.5} style={{color:theme?.palette?.customColors?.btnFontThemeColor, marginBottom:'4px', fontWeight:'bolder'}}>{el?.Metal_Purity_Name} {el?.MetalColorName} - SI</Typography>
                    </div>
                    <div>
                        <div className='custom_chip_hp'><CheckCircleIcon fontSize='xs' color='success' sx={{mr:1}} /><span style={{color:'grey'}}>SIZE {el?.JewellerySize}</span>&nbsp;-&nbsp; {el?.JewellerySize === '' && 'NOT'} AVAILABLE</div>
                    </div>
                </Box>
            </Box>
              })
            }
          </Card>
        })
      }
      </Box>}
    </div>
  )
}

export default HomePage
