// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { PolarArea } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// ** Custom Components Imports
import OptionsMenu from '../@core/components/option-menu'
import { useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { capitalizeFirstLetter, fetchDashboardData } from '../GlobalFunctions';

// Register required chart components
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

// ** Custom Components Imports


const AnalyticsSalesRepWiseSaleAmt = props => {

    const [apiData, setApiData] = useState([]);
  
    useEffect(() => {
  
      const fetchData = async () => {
        try {
  
          // Fetch MonthWiseSaleAmount data
          // const ProgressWiseOrder = await fetchDashboardData(props?.tkn, props?.fdate, props?.tdate, "SalesrepWiseSaleAmount");
          const arr = props?.SalesrepWiseSaleAmount?.sort((a, b) => b?.SaleAmount - a?.SaleAmount)?.slice(0, 5);

          setApiData(arr);
          
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      fetchData(); 
  
    // },[ props?.fdate, props?.tdate]);
    },[props?.SalesrepWiseSaleAmount]);

    const theme = useTheme();
  // ** Props
//   const { info, grey, green, yellow, primary, warning, legendColor } = props;
  const { info, grey, green, yellow, primary, warning, legendColor } = props;

  const SalesRepName = props?.SalesrepWiseSaleAmount?.sort((a, b) => b?.SaleAmount - a?.SaleAmount)?.slice(0, 5)?.map((e) => capitalizeFirstLetter(e?.SalesRep));
  const SaleAmt = props?.SalesrepWiseSaleAmount?.sort((a, b) => b?.SaleAmount - a?.SaleAmount)?.slice(0, 5)?.map((e) => (e?.SaleAmount));
  const profitAmt = props?.SalesrepWiseSaleAmount?.sort((a, b) => b?.SaleAmount - a?.SaleAmount)?.slice(0, 5)?.map((e) => e?.Profit);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    layout: {
      padding: {
        top: -5,
        bottom: -45
      }
    },
    scales: {
      r: {
        grid: { display: false },
        ticks: { display: false }
      }
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 25,
          boxWidth: 9,
          color: legendColor,
          usePointStyle: true
        }
      }
    },
  }

  const data = {
    // labels: ['Africa', 'Asia', 'Europe', 'America', 'Antarctica', 'Australia'],
    labels: SalesRepName,
    datasets: [
      {
        borderWidth: 0,
        label: 'Sale Amount',
        // data: [19, 17.5, 15, 13.5, 11, 9],
        data: SaleAmt,
        backgroundColor: [theme?.palette?.customColors?.purple, "#E7D400", theme?.palette?.customColors?.orange, theme?.palette?.customColors?.info, theme?.palette?.customColors?.grey, theme?.palette?.customColors?.green]
      }
    ]
  }

  return (
    <Card className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'34.85rem'}}>
      <CardHeader
        title='Top Sales Representative Wise Sale Amount'
        // action={
        //   <OptionsMenu
        //     iconProps={{ fontSize: 20 }}
        //     options={['Refresh', 'Edit', 'Share']}
        //     iconButtonProps={{ size: 'small', className: 'card-more-options', sx: { color: 'text.secondary' } }}
        //   />
        // }
      />
      <CardContent>
        <PolarArea data={data} height={350} options={options} />
      </CardContent>
    </Card>
  )
}

export default AnalyticsSalesRepWiseSaleAmt;