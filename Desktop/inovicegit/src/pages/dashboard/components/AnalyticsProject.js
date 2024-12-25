// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import AvatarGroup from '@mui/material/AvatarGroup'
import { DataGrid } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'

// ** Custom Component Import
// import CustomTextField from 'src/@core/components/mui/text-field'
import CustomTextField from '../@core/components/mui/text-field'

// ** Third Party Imports
import axios from 'axios'

// ** Custom Components Imports
// import OptionsMenu from 'src/@core/components/option-menu'
import OptionsMenu from '../@core/components/option-menu'
// import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomAvatar from '../@core/components/mui/avatar'

// ** Utils Import
// import { getInitials } from 'src/@core/utils/get-initials'
import { getInitials } from '../@core/utils/get-initials'
// import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { hexToRGBA } from '../@core/utils/hex-to-rgba';




// import profileData from "../json/profile.json";
import "./chartcss/analyticsproject.css"
import imgIcon from "../images/avatars/1.png"
import { fetchDashboardData, formatAmount, formatAmountKWise } from '../GlobalFunctions';

// ** renders name column
const renderName = row => {
  if (row.avatar) {
    // return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
    return <CustomAvatar src={imgIcon} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <>
      {/* <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 2.5, width: 38, height: 38, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(row.name || 'John Doe')}
      </CustomAvatar> */}
      </>
    )
  }
}

const columns = [
  {
    flex: 0.1,
    field: 'MetalType',
    minWidth: 220,
    headerName: 'METALTYPE  AND  COLOR WISE',
    renderCell: ({ row }) => {
      const { MetalType, MetalColor } = row
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderName(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {MetalType}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled', textTransform: 'capitalize' }}>
              {MetalColor}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: 'SaleAmount',
    headerName: 'SALE AMOUNT',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{formatAmountKWise(row?.SaleAmount)}</Typography>
  },
  {
    flex: 0.1,
    field: 'NetWt',
    minWidth: 120,
    sortable: false,
    headerName: 'NETWT',
    renderCell: ({ row }) => (
      <Typography sx={{ color: 'text.secondary' }}>{(row?.NetWt)?.toFixed(3)}</Typography>
      // <AvatarGroup className='pull-up'>
      //   {row?.avatarGroup?.map((src, index) => (
      //     // <CustomAvatar key={index} src={src} sx={{ height: 26, width: 26 }} />
      //     <CustomAvatar key={index} src={imgIcon} sx={{ height: 26, width: 26 }} />
      //   ))}
      // </AvatarGroup>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'ProfitPer',
    headerName: 'PROFIT PERCENTAGE',
    renderCell: ({ row }) => (
      <>
        {/* <LinearProgress
          style={{color:'#7367F0'}}
          value={row.ProfitPer}
          variant='determinate'
          sx={{
            mr: 3,
            height: 8,
            width: '100%',
            borderRadius: 8,
            backgroundColor: 'background.default',
            '& .MuiLinearProgress-bar': {
              borderRadius: 8,
              backgroundColor:'#7367F0'
            },
          }}
        /> */}
        <Typography sx={{ color: 'text.secondary' }}>{`${row?.ProfitPer}%`}</Typography>
      </>
    )
  },
  // {
  //   flex: 0.1,
  //   minWidth: 100,
  //   sortable: false,
  //   field: 'actions',
  //   headerName: 'ACTIONS',
  //   renderCell: () => (
  //     <OptionsMenu
  //       iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
  //       className='fs_analytics_l'
  //       options={[
  //         'Details',
  //         'Archive',
  //         { divider: true, dividerProps: { sx: { my: theme => `${theme.spacing(2)} !important` } } },
  //         {
  //           text: 'Delete',
  //           menuItemProps: {
  //             sx: {
  //               color: 'error.main',
  //               '&:not(.Mui-focusVisible):hover': {
  //                 color: 'error.main',
  //                 // backgroundColor: theme => hexToRGBA(theme.palette.error.main, 0.08)
  //                 // backgroundColor: theme => hexToRGBA("#28C76F", 0.08)
  //               }
  //             }
  //           }
  //         }
  //       ]}
  //     />
  //   )
  // }
]

const AnalyticsProject = ({tkn,  fdate, tdate, MetalTypeColorWiseSaleData}) => {
  // ** State
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [value, setValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [totalRows, setTotalRows] = useState(0);

  const [apiData, setApiData] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {

        // Fetch MonthWiseSaleAmount data
        // let MetalTypeColorWiseSale = await fetchDashboardData(tkn,  fdate, tdate, "MetalTypeColorWiseSale");

        setApiData(MetalTypeColorWiseSaleData);
        setFilteredData(MetalTypeColorWiseSaleData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData(); 

  // },[fdate, tdate]);
},[MetalTypeColorWiseSaleData]);





  // useEffect(() => {
  //   setData(profileData.data)
  // }, [])

  // Handle pagination directly from local data
  const paginatedData = filteredData?.slice(
    paginationModel.page * paginationModel.pageSize,
    (paginationModel.page + 1) * paginationModel.pageSize
  )

  
  const handleFilter = val => {
    setPaginationModel({ ...paginationModel, page: 0 }); // Reset to first page on filter change

    setValue(val);

    const filteredData = MetalTypeColorWiseSaleData?.filter((item) => {
      const metalType = item.MetalType?.toLowerCase();  // Make sure both values are lowercase for case-insensitive comparison
      const metalColor = item.MetalColor?.toLowerCase();
      const saleAmt = item.SaleAmount?.toString()?.toLowerCase();
      const netWt = item.NetWt?.toString()?.toLowerCase();
      const profitPer = item.ProfitPer?.toString()?.toLowerCase();
      const searchVal = val?.toLowerCase();
  
      return (
        metalType?.includes(searchVal) ||
        saleAmt?.includes(searchVal) ||
        netWt?.includes(searchVal) ||
        profitPer?.includes(searchVal) ||
        metalColor?.includes(searchVal)  // Check if either MetalType or MetalColor includes the search term
      );
    });
    

    setFilteredData(filteredData);

    

  };

  // Handle pagination change
  const handlePageChange = (newPage) => {
    setPaginationModel({ ...paginationModel, page: newPage })
  };

  const handlePageSizeChange = (newPageSize) => {
    setPaginationModel({ ...paginationModel, pageSize: newPageSize })
  };
  const rowsWithId = apiData.map(item => ({ ...item, id: item.SrNo }));


  
  const handlePaginationModelChange = newModel => {
    setPaginationModel(prevModel => ({
      ...prevModel,
      ...newModel
    }))
  }

  return data ? (
    <Card className='fs_analytics_l' style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'36.45rem', }}>
      <CardHeader
        title='MetalType & MetalColor Wise Sale Amount'
        titleTypographyProps={{ sx: { mb: [2, 0] } }}
        action={<CustomTextField value={value} placeholder='Search' style={{boxShadow:'none', border:'1px solid #e8e8e8'}} onChange={e => handleFilter(e.target.value)} />}
        sx={{
          py: 2.5,
          flexDirection: ['column', 'row'],
          '& .MuiCardHeader-action': { m: 0 },
          alignItems: ['flex-start', 'center']
        }}
      />
      {/* <DataGrid
        // autoHeight
        // pagination
        // rows={data}
        // rowHeight={62}
        // columns={columns}
        // checkboxSelection
        // pageSizeOptions={[5, 10]}
        // disableRowSelectionOnClick
        // paginationModel={paginationModel}
        // onPaginationModelChange={setPaginationModel}
        // className='fs_analytics_l '
        autoHeight
        pagination
        rows={rowsWithId}
        rowHeight={78.9}
        columns={columns}
        checkboxSelection
        pageSizeOptions={[5, 10]}
        paginationMode="client"  // This is now client-side pagination
        page={paginationModel.page}
        pageSize={paginationModel.pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        disableRowSelectionOnClick
        className='fs_analytics_l'
      /> */}

      <DataGrid
             rows={filteredData}  // Use the sliced paginated data
             columns={columns}
            //  paginationModel={paginationModel}
            //  onPaginationModelChange={handlePaginationModelChange}
            //  pageSizeOptions={[5]}
            //  pagination
            //  pageSizeOptions={[5, 10, 15, 20]}
            //  paginationMode="client"
            //  page={paginationModel.page}
            //  pageSize={paginationModel.pageSize}
            //  onPageChange={handlePageChange}
            //  onPageSizeChange={handlePageSizeChange}
             disableRowSelectionOnClick
             className="fs_analytics_l kayradashboard"
             rowHeight={71}
             getRowId={(row) => row?.SrNo}  // Specify the unique identifier
             sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none', // Remove outline on focus
              },
            }}
      />
    </Card>
  ) : null
}

export default AnalyticsProject
