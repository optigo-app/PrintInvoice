// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { Bar } from 'react-chartjs-2'
import { Chart, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';
import { Box, CircularProgress, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

Chart.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const SettingPerGram = props => {
  // ** Props
  const { info, warning, labelColor, borderColor, legendColor, selectMaterial } = props;

  const { loading, data, error } = useSelector(state => state?.Vendor_Margin_Per_Carat);

  const [vendorNameList, setVendorNameList] = useState([]);
  const [costPerCarat, setCostperCarat] = useState([]);
  const [soldPerCarat, setSoldperCarat] = useState([]);

  const theme = useTheme();

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    elements: {
      bar: {
        borderRadius: {
          topRight: 15,
          bottomRight: 15
        }
      }
    },
    layout: {
      padding: { top: -4 }
    },
    scales: {
      x: {
        min: 0,
        grid: {
          drawTicks: false,
          color: borderColor
        },
        // ticks: { color: labelColor }
        ticks: { color: theme?.palette?.customColors?.grey }
      },
      y: {
        grid: {
          display: false,
          color: borderColor
        },
        // ticks: { color: labelColor }
        ticks: { color: theme?.palette?.customColors?.grey }
      }
    },
    plugins: {
      legend: {
        align: 'end',
        position: 'top',
        labels: { color: legendColor }
      }
    }
  }
  const comp_data = {
    // labels: ['MON', 'TUE', 'WED ', 'THU', 'FRI'],
    // labels: ['Chow', 'KK', 'Nancy', 'Pariya', 'SA', 'Tiffany', 'XBO', 'YF'],
    labels: vendorNameList ?? ['Chow', 'KK', 'Nancy', 'Pariya', 'SA', 'Tiffany', 'XBO', 'YF'],
    datasets: [
      {
        maxBarThickness: 15,
        backgroundColor: theme?.palette?.customColors?.orange,
        label: 'Cost Per Carat',
        borderColor: 'transparent',
        data: costPerCarat ?? [1300, 1030, 13704, 1793, 962, 728, 837, 894]
      },
      {
        maxBarThickness: 15,
        label: 'Sold Per Carat',
        // backgroundColor: warning,
        backgroundColor: theme?.palette?.customColors?.purple,
        borderColor: 'transparent',
        data: soldPerCarat ?? [1510, 1178, 14934, 2140, 1169, 758, 997, 1086]
      },
    ]
  }

  useEffect(() => {
    
    if(data?.DT?.length > 0){
      if(selectMaterial === 1 || selectMaterial === '1'){
        let arr0 = data?.DT?.slice()?.sort((a, b) => b?.Cost_Per_Carat_D - a?.Cost_Per_Carat_D)?.slice(0, 10)?.map((e) => e?.Vendor);
        setVendorNameList(arr0);
        let arr = data?.DT?.map((e) => e?.Cost_Per_Carat_D)?.sort((a, b) => b - a)?.slice(0, 10);
        let arr2 = data?.DT?.map((e) => e?.Sold_Per_Carat_D)?.sort((a, b) => b - a)?.slice(0, 10);
        setCostperCarat(arr);
        setSoldperCarat(arr2);
      }
      if(selectMaterial === 2 || selectMaterial === '2'){
        let arr0 = data?.DT?.slice()?.sort((a, b) => b?.Cost_Per_Carat_CS - a?.Cost_Per_Carat_CS)?.slice(0, 10)?.map((e) => e?.Vendor);
        setVendorNameList(arr0);
        let arr = data?.DT?.map((e) => e?.Cost_Per_Carat_CS)?.sort((a, b) => b - a)?.slice(0, 10);
        let arr2 = data?.DT?.map((e) => e?.Sold_Per_Carat_CS)?.sort((a, b) => b - a)?.slice(0, 10);
        setCostperCarat(arr);
        setSoldperCarat(arr2);
      }
      if(selectMaterial === 3 || selectMaterial === '3'){
        let arr0 = data?.DT?.slice()?.sort((a, b) => b?.Cost_Per_Carat_M - a?.Cost_Per_Carat_M)?.slice(0, 10)?.map((e) => e?.Vendor);
        setVendorNameList(arr0);
        let arr = data?.DT?.map((e) => e?.Cost_Per_Carat_M)?.sort((a, b) => b - a)?.slice(0, 10);
        let arr2 = data?.DT?.map((e) => e?.Sold_Per_Carat_M)?.sort((a, b) => b - a)?.slice(0, 10);
        setCostperCarat(arr);
        setSoldperCarat(arr2);
      }
    }else{
      setCostperCarat([]);
      setSoldperCarat([]);
    }
    
  },[data, selectMaterial]);

  return (
    <Card  className='fs_facd bs_facd' sx={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}}>
      <CardHeader title='Vendorwise Margin/ct '  />
      { loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding:'1rem', minHeight:'440px' }}>
                                    <CircularProgress sx={{color:'lightgrey'}} />
                                    </Box> : <CardContent>
        <Bar data={comp_data} height={400} options={options} />
      </CardContent>}
    </Card>
  )
}

export default SettingPerGram
