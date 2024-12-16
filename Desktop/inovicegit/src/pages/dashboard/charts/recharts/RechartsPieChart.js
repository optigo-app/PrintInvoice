// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Tooltip from '@mui/material/Tooltip';
// ** Third Party Imports
import {  PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

// ** Icon Imports
// import Icon from 'src/@core/components/icon'
import Icon from '../../@core/components/icon'
import { useState } from 'react';
import { fetchDashboardData, formatAmount, formatAmountKWise } from '../../GlobalFunctions';
import { useEffect } from 'react';


const RADIAN = Math.PI / 180

const renderCustomizedLabel = props => {
  // ** Props
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y}  textAnchor='middle' dominantBaseline='central'>
      {/* {`${(percent * 100).toFixed(0)}%`} */}
      {/* {`${(percent * 100)?.toFixed(0)}`} */}
    </text>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];  // Access data for the hovered segment
    return (
      <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '5px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <div className='customtooltip'>{name}</div>
        {/* <p>Value: {value}</p> */}
      </div>
    );
  }
  return null;
};

const RechartsPieChart = ({tkn,  fdate, tdate}) => {
  const [hoveredData, setHoveredData] = useState(null)

  const [apiData, setApiData] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {

        // Fetch MonthWiseSaleAmount data
        const VendorWiseNetWt = await fetchDashboardData(tkn,  fdate, tdate, "VendorWiseNetWt");
        setApiData(VendorWiseNetWt);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData(); 

  },[fdate, tdate]);


  // const data = [
  //   { name: 'R&D', value: 50, color: '#00d4bd' },
  //   { name: 'Operational', value: 85, color: '#ffe700' },
  //   { name: 'Networking', value: 16, color: '#FFA1A1' },
  //   { name: 'Hiring', value: 50, color: '#826bf8' }
  // ]
  const sortedData = apiData?.sort((a, b) => {
    const netWtA = a?.NetWt || 0;  // Default to 0 if SaleAmount is missing
    const netWtB = b?.NetWt || 0;
    return netWtB - netWtA;
  });
  // Step 2: Get the top 10 objects
  const top10 = sortedData?.slice(0, 5);
  
  // const data = [
  //   { name: 'R&D', value: 50, color: '#00d4bd' },
  //   { name: 'Operational', value: 85, color: '#ffe700' },
  //   { name: 'Networking', value: 16, color: '#FFA1A1' },
  //   { name: 'Hiring', value: 50, color: '#826bf8' },
  //   { name: 'Hiring', value: 50, color: '#EA5455' },
  //   { name: 'Hiring', value: 50, color: '#B9E9CF' },
  //   { name: 'Hiring', value: 50, color: '#FF9F43' },
  //   { name: 'Hiring', value: 50, color: '#A8AAAE' },
  //   { name: 'Hiring', value: 50, color: '#2196F3' },
  //   { name: 'Hiring', value: 50, color: '#F50057' },
  // ]
  const colors = ["#00d4bd", "#ffe700", "#FFA1A1", "#826bf8", "#EA5455","#B9E9CF", "#FF9F43","#A8AAAE","#2196F3","#F50057"]

  const data = top10?.map((item, index) => ({
    name: item?.Vendor,
    value: item?.NetWt || 0,
    color: colors[index] // Dynamically generate colors
  }))

  const handleMouseEnter = (obj) => {
    console.log(obj);

    return (
     <div>
        <Tooltip title="Delete">{obj?.value}</Tooltip>
     </div> 
    )

  }

  return (
    <Card className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'34.85rem'}}>
      <CardHeader
        title='Top Vendors'
        subheader='Overview of NetWt'
        // subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
      />
      <CardContent>
        <Box sx={{ height: 350,  position:'relative' }}>
          <ResponsiveContainer>
            <PieChart height={350} style={{ direction: 'ltr' }}>
              <Pie data={data} innerRadius={80} dataKey='value' label={renderCustomizedLabel} labelLine={false}
                  onMouseEnter={(data, index) => {
                    setHoveredData(data)
                  }}
                  onMouseLeave={() => setHoveredData(null)}
                  skipAnimation={false}
                  
              >
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              {/* <Tooltip content={<CustomTooltip />} /> */}
            </PieChart>
          </ResponsiveContainer>
          {hoveredData && (
            <Box
              sx={{
                position: 'absolute',
                zIndex:9999,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}
            >
              <Typography variant='h6' align='center' color='secondary' sx={{fontWeight:'bold'}}>
                {hoveredData?.name}: {(hoveredData?.value)} gm
              </Typography>
            </Box>
          )}
        </Box>
        {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1, justifyContent: 'center' }}>
          <Box
            sx={{
              mr: 5,
              display: 'flex',
              alignItems: 'center',
              '& svg': { mr: 1, color: '#00d4bd' }
            }}
          >
            <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2'>R&D</Typography>
          </Box>
          <Box
            sx={{
              mr: 5,
              display: 'flex',
              alignItems: 'center',
              '& svg': { mr: 1, color: '#00d4bd' }
            }}
          >
            <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2'>R&D</Typography>
          </Box>
          <Box
            sx={{
              mr: 5,
              display: 'flex',
              alignItems: 'center',
              '& svg': { mr: 1, color: '#00d4bd' }
            }}
          >
            <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2'>R&D</Typography>
          </Box>
          <Box
            sx={{
              mr: 5,
              display: 'flex',
              alignItems: 'center',
              '& svg': { mr: 1, color: '#00d4bd' }
            }}
          >
            <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2'>R&D</Typography>
          </Box>
          <Box
            sx={{
              mr: 5,
              display: 'flex',
              alignItems: 'center',
              '& svg': { mr: 1, color: '#00d4bd' }
            }}
          >
            <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2'>R&D</Typography>
          </Box>
          <Box
            sx={{
              mr: 5,
              display: 'flex',
              alignItems: 'center',
              '& svg': { mr: 1, color: '#00d4bd' }
            }}
          >
            <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2'>R&D</Typography>
          </Box>
          <Box
            sx={{
              mr: 5,
              display: 'flex',
              alignItems: 'center',
              '& svg': { mr: 1, color: '#ffe700' }
            }}
          >
            <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2'>Operational</Typography>
          </Box>
          <Box
            sx={{
              mr: 5,
              display: 'flex',
              alignItems: 'center',
              '& svg': { mr: 1, color: '#FFA1A1' }
            }}
          >
            <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2'>Networking</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: '#826bf8' } }}>
            <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2'>Hiring</Typography>
          </Box>
        </Box> */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2, mt:1.5, justifyContent: 'center' }}>
            {data?.map((item, index) => (
              <Box
                key={index}
                sx={{
                  mr: 5,
                  display: 'flex',
                  alignItems: 'center',
                  '& svg': { mr: 1, color: item?.color }
                }}
              >
            {/* <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2' sx={{
              cursor:'pointer',
              
            }} onMouseEnter={() => handleMouseEnter(item)}>{item?.name?.toUpperCase()}</Typography> */}
              <Tooltip sx={{
                  '& .MuiTooltip-tooltip': {
                    fontSize: '16px !important', // Force the font size change
                    fontWeight: 'bold !important', // Force bold text
                    backgroundColor: '#1976d2 !important', // Force background color change
                    color: 'white !important', // Force text color change
                  },
                // }} title={`Amount: ${formatAmount(item?.value)}`} arrow>
              }} title={<Typography className='fs_analytics_l'  sx={{color:'white'}}>{`Amount: ${formatAmountKWise(item?.value)}`}</Typography>} arrow>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Icon icon="mdi:circle" fontSize="0.75rem" />
                  <Typography variant="body2">{item?.name?.toUpperCase()}</Typography>
                </Box>
              </Tooltip>
         </Box>
  ))}
</Box>
      </CardContent>
    </Card>
  )
}

export default RechartsPieChart
