// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { Bar } from 'react-chartjs-2'
import { Chart, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';
import { useTheme } from '@mui/material';

Chart.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const SettingPerGram = props => {
  // ** Props
  const { info, warning, labelColor, borderColor, legendColor } = props

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
console.log(theme.palette);
  const data = {
    // labels: ['MON', 'TUE', 'WED ', 'THU', 'FRI'],
    labels: ['Chow', 'KK', 'Nancy', 'Pariya', 'SA', 'Tiffany', 'XBO', 'YF'],
    datasets: [
      {
        maxBarThickness: 15,
        label: 'Sold Per Carat',
        // backgroundColor: warning,
        backgroundColor: theme?.palette?.customColors?.red,
        borderColor: 'transparent',
        data: [1510, 1178, 14934, 2140, 1169, 758, 997, 1086]
      },
      {
        maxBarThickness: 15,
        backgroundColor: theme?.palette?.customColors?.green,
        label: 'Cost Per Carat',
        borderColor: 'transparent',
        data: [1300, 1030, 13704, 1793, 962, 728, 837, 894]
      }
    ]
  }

  return (
    <Card  className='fs_facd bs_facd' sx={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}}>
      <CardHeader title='Vendorwise Margin/ct '  />
      <CardContent>
        <Bar data={data} height={400} options={options} />
      </CardContent>
    </Card>
  )
}

export default SettingPerGram
