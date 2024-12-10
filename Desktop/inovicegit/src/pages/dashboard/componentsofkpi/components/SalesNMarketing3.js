// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import {  fetchKPIDashboardData,  formatAmountKWise } from '../../GlobalFunctions';
import { CircularProgress } from '@mui/material';
import { checkNullUndefined } from './global';

//SALES AND MARKETING 2ST BLOCK
const SalesNMarketing3 = ({tkn, fdate, tdate, bgColor, SM3}) => {
  const theme = useTheme();

  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);
        // const SalesMarketing_TotalSaleBusinessClassWise = await fetchKPIDashboardData(tkn, fdate, tdate, "SalesMarketing_TotalSaleBusinessClassWise");
        const SalesMarketing_TotalSaleBusinessClassWise = 1;
        
        if(SalesMarketing_TotalSaleBusinessClassWise){
          setLoading(false);
          const formatedArr = SalesMarketing_TotalSaleBusinessClassWise?.slice(0, 4);
          const formatedArr2 = SalesMarketing_TotalSaleBusinessClassWise?.slice(4);
          const obj = {
            CustomerType : "Other",
            MetalAmount:0
          }
          
          formatedArr2?.forEach((a) => {
            obj.MetalAmount += a?.MetalAmount;
          })
          
          formatedArr.push(obj);
          
          setApiData(formatedArr);
          
        }
        } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
  
    // fetchData(); 

  },[fdate, tdate]);

  
  return (
    <Card className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'230px'}}>

      <CardContent  sx={{
        maxHeight: '412px',
        overflow: 'auto',
        paddingBottom:'0px',
        '&::-webkit-scrollbar': {
          width: '6px',  // Customize scrollbar width
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#BDBDBD',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        },
      }}>
        {
          loading ? 
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress sx={{color:'black'}} />
            </Box> :
         SM3?.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                '& img': { mr: 4 },
                alignItems: 'center',
                // mb: index !== data.length - 1 ? 4.5 : undefined
                mb: index !== apiData?.length - 1 ? 2.15 : undefined
              }}
            >


              <Box
                sx={{
                  rowGap: 1,
                  columnGap: 4,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom:'0px'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant='h6' color={bgColor} >{ item?.CustomerType === undefined ? '' : "Cust.-"}{item?.CustomerType?.toLowerCase() === 'manufacturer' ? 'MFG' : checkNullUndefined(item?.CustomerType)}</Typography>
              
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    '& svg': { mr: 1 },
                    alignItems: 'center',
                   }}
                >
                  { item?.CustomerType === undefined ? <Typography variant='h6'>&nbsp;</Typography> : <Typography variant='h6' color={theme?.palette?.grey?.[700]} sx={{fontWeight:'bolder'}}>{` ${checkNullUndefined(formatAmountKWise(item?.MetalAmount))}`}</Typography>}
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default SalesNMarketing3;
