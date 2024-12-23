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
import { CircularProgress } from '@mui/material';
// ** Custom Component Import
// import CustomTextField from 'src/@core/components/mui/text-field'
import CustomTextField from '../../@core/components/mui/text-field'

// ** Third Party Imports
import axios from 'axios'

// ** Custom Components Imports
// import OptionsMenu from 'src/@core/components/option-menu'
import OptionsMenu from '../../@core/components/option-menu'
// import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomAvatar from '../../@core/components/mui/avatar'

// ** Utils Import
// import { getInitials } from 'src/@core/utils/get-initials'
import { getInitials } from '../../@core/utils/get-initials'
// import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { hexToRGBA } from '../../@core/utils/hex-to-rgba';




// import profileData from "../json/profile.json";
// import "./chartcss/analyticsproject.css"
import imgIcon from "../../images/avatars/1.png";
import { fetchDashboardData, fetchKPIDashboardData, formatAmount, formatAmountKWise } from '../../GlobalFunctions';
import "../kpianalytics.css"
import {  useDispatch, useSelector } from 'react-redux';
import { handleMfgLoaderFlag } from '../redux/slices/KPILaderFlag';
import moment from 'moment';


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


// const Manufacturning = ({tkn, bgColor, fdate, tdate, MFGData, columns, LWise, mfgTable}) => {
const Manufacturning = ({tkn, bgColor, fdate, tdate,  LWise, mfgTable}) => {

  const kpiMFGFlag = useSelector((state) => state?.kpi?.mfg);
  
  const dispatch = useDispatch();

  // ** State
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [value, setValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [totalRows, setTotalRows] = useState(0);

  const [apiData, setApiData] = useState([]);
  // const[columns, setColumns] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [apiData2, setApiData2] = useState([]);

  const [MFGData, setMFGData] = useState([]);
  const[columns, setColumns] = useState([]);
  
  
// const columns = [
//   {
//     flex: 0.1,
//     field: 'kpi',
//     minWidth: 220,
//     headerName: 'KPI',
//     renderCell: ({ row }) => {
//       // const { MetalType, MetalColor } = row
//       return (
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           {renderName(row)}
//           <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//             <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 900 }}>
//               {/* {MetalType} */}
//               {row?.kpi}
//             </Typography>
//             {/* <Typography noWrap variant='body2' sx={{ color: 'text.disabled', textTransform: 'capitalize' }}>
//               {MetalColor}
//             </Typography> */}
//           </Box>
//         </Box>
//       )
//     }
//   },
//   {
//     flex: 0.1,
//     minWidth: 105,
//     field: 'm_1',
//     headerName: 'M-1',
//     renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary', fontWeight:900 }}>{(row?.m_1)}</Typography>
//   },
//   {
//     flex: 0.1,
//     field: 'm_2',
//     minWidth: 120,
//     sortable: false,
//     headerName: 'M-2',
//     renderCell: ({ row }) => (
//       <Typography sx={{ color: 'text.secondary', fontWeight:900 }}>{(row?.m_2)}</Typography>
//       // <AvatarGroup className='pull-up'>
//       //   {row?.avatarGroup?.map((src, index) => (
//       //     // <CustomAvatar key={index} src={src} sx={{ height: 26, width: 26 }} />
//       //     <CustomAvatar key={index} src={imgIcon} sx={{ height: 26, width: 26 }} />
//       //   ))}
//       // </AvatarGroup>
//     )
//   },
//   {
//     flex: 0.1,
//     minWidth: 150,
//     field: 'm_3',
//     headerName: 'M-3',
//     renderCell: ({ row }) => (
//       <>
//         {/* <LinearProgress
//           style={{color:'#7367F0'}}
//           value={row.ProfitPer}
//           variant='determinate'
//           sx={{
//             mr: 3,
//             height: 8,
//             width: '100%',
//             borderRadius: 8,
//             backgroundColor: 'background.default',
//             '& .MuiLinearProgress-bar': {
//               borderRadius: 8,
//               backgroundColor:'#7367F0'
//             },
//           }}
//         /> */}
//         <Typography sx={{ color: 'text.secondary', fontWeight:900 }}>{`${row?.m_3}`}</Typography>
//       </>
//     )
//   },
//   // {
//   //   flex: 0.1,
//   //   minWidth: 100,
//   //   sortable: false,
//   //   field: 'actions',
//   //   headerName: 'ACTIONS',
//   //   renderCell: () => (
//   //     <OptionsMenu
//   //       iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
//   //       className='fs_analytics_l'
//   //       options={[
//   //         'Details',
//   //         'Archive',
//   //         { divider: true, dividerProps: { sx: { my: theme => `${theme.spacing(2)} !important` } } },
//   //         {
//   //           text: 'Delete',
//   //           menuItemProps: {
//   //             sx: {
//   //               color: 'error.main',
//   //               '&:not(.Mui-focusVisible):hover': {
//   //                 color: 'error.main',
//   //                 // backgroundColor: theme => hexToRGBA(theme.palette.error.main, 0.08)
//   //                 // backgroundColor: theme => hexToRGBA("#28C76F", 0.08)
//   //               }
//   //             }
//   //           }
//   //         }
//   //       ]}
//   //     />
//   //   )
//   // }
// ]

  // useEffect(() => {

  //   // const fetchData = async () => {
  //   //   try {

  //       // Fetch MonthWiseSaleAmount data
  //       // let MetalTypeColorWiseSale = await fetchDashboardData(tkn, "MetalTypeColorWiseSale");
  //     console.table(apiMFGData);
  //       setApiData(apiMFGData);
  //       setFilteredData(apiMFGData);

  //       let cols = apiMFGData?.map((e, i) => e?.manufacturelocationname);
  //       let cols2 = ['KPI', ...cols];
  //       console.log(cols2);
  //       let colmsl = [];
  //       cols2?.forEach((e, i) => {
  //         let obj = {
  //           flex: 0.1,
  //           minWidth: 105,
  //           field: `${e}`,
  //           headerName: `${e}`,
  //           renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary', fontWeight:900 }}>{(row?.e)}</Typography>
  //         }

  //         colmsl.push(obj);

  //       });

  //       setColumns(colmsl);

  //       let rowsData = [];

  //       apiMFGData?.forEach((e, i) => {
  //         let obj = {
  //           KPI:
  //         }
  //       })

  //   //   } catch (error) {
  //   //     console.error("Error fetching data:", error);
  //   //   }
  //   // };
  
  //   // fetchData(); 

  // },[fdate, tdate, apiMFGData]);











  
    // useEffect(() => {


    //   // Extract locations
    //   let cols = apiData?.map((e) => e?.manufacturelocationname)?.filter(Boolean);  // Filter out null locations
    //   let cols2 = ['KPI', ...cols];


    //   let colmsl = cols2?.map((location) => {
    //     return {
    //       flex: 0.1,
    //       minWidth: 105,
    //       field: `${location}`,
    //       headerName: `${location}`,
    //       renderCell: ({ row }) => (
    //         <Typography sx={{ color: 'text.secondary', fontWeight: 900 }}>
    //           {row?.[location]}
    //         </Typography>
    //       ),
    //     };
    //   });
    //   // setColumns(colmsl);

    //   // Set rows based on KPIs
    //   const kpis = [
    //     { name: 'Production(gm)', field: 'mfg_production_gms' },
    //     { name: 'Jobs', field: 'mfg_jobs' },
    //     { name: 'Labour Amount', field: 'labour_amount' }, // Assuming you want to handle it
    //     { name: 'Gross Loss (%)', field: 'mfg_grossloss' },
    //     { name: 'Rejection (%)', field: 'mfg_rejection' }, // Assuming you want to handle it
    //   ];

    //   let rowsData = kpis?.map((kpi) => {
    //     let row = { KPI: kpi?.name };
    //     // apiData?.forEach((e) => {
    //     //   if (e?.manufacturelocationname) {
    //     //     // row[e?.manufacturelocationname] = e[kpi?.field] || '';  // If no value, set '-'
    //     //     row[e.manufacturelocationname] = e[kpi.field] !== undefined ? e[kpi.field] : 'N/A';
    //     //   }
    //     // });

    //     apiData?.forEach((e) => {
    //       if (e?.manufacturelocationname) {
    //         // Default value for KPI fields
    //         row[e.manufacturelocationname] = e[kpi.field] !== undefined ? e[kpi.field] : 'N/A';
            
    //         // If the KPI is 'Labour Amount', we will fetch it from API 2
    //         if (kpi.name === 'Labour Amount') {
    //           // Find the matching location in API 2
    //           const matchingLocation = apiData2.find((locationData) => locationData.locationname === e.manufacturelocationname);
              
    //           if (matchingLocation) {
    //             row[e.manufacturelocationname] = matchingLocation.LabourAmount || 'N/A';
    //           }
    //         }
    //       }
    //     });

    //     return row;
    //   });

    //   setFilteredData(rowsData);

    // }, [apiData, apiData2]);

    useEffect(() => { 

      formateArray();

    },[LWise, mfgTable]);


    const formateArray = () => {
      try {
        const combinedData = {};
        const allLocations = new Set();
      
        // Merge data from kpidashboard_mfg
        mfgTable?.forEach((item) => {
          const location = item?.manufacturelocationname || "NoLocation";
      
          if (!combinedData[location]) {
            combinedData[location] = {};
          }
      
          // If manufacturelocationname is "-", merge with "NoLocation"
          if (location === "-") {
            combinedData["NoLocation"] = {
              ...combinedData["NoLocation"],
              "Production (gm)": (combinedData["NoLocation"]?.["Production (gm)"] || 0) + (item?.mfg_production_gms || 0),
              Jobs: (combinedData["NoLocation"]?.Jobs || 0) + (item?.mfg_jobs || 0),
              "Gross Loss (%)": (combinedData["NoLocation"]?.["Gross Loss (%)"] || 0) + (item?.mfg_grossloss || 0),
              "Rejection (%)": (combinedData["NoLocation"]?.["Rejection (%)"] || 0) + (item?.mfg_rejection || 0),
            };
          } else {
            combinedData[location] = {
              ...combinedData[location],
              "Production (gm)": (item?.mfg_production_gms)?.toFixed(3) || 0.000,
              Jobs: (item?.mfg_jobs) || 0.00,
              "Gross Loss (%)": (item?.mfg_grossloss)?.toFixed(3) || 0.000,
              "Rejection (%)": (item?.mfg_rejection)?.toFixed(3) || 0.000,
            };
          }
      
          allLocations.add(location);
        });
      
        // Merge data from SalesMarketing_TotalSaleLocationWise
        LWise?.forEach((item) => {
          const location = item?.locationname || "NoLocation";
      
          if (!combinedData[location]) {
            combinedData[location] = {};
          }
      
          // If locationname is "NoLocation", sum the respective fields
          if (location === "NoLocation") {
            combinedData["NoLocation"] = {
              ...combinedData["NoLocation"],
              "Labour Amount": (combinedData["NoLocation"]?.["Labour Amount"] || 0) + (item?.LabourAmount || 0),
            };
          } else {
            combinedData[location] = {
              ...combinedData[location],
              "Labour Amount": item?.LabourAmount || 0.00,
            };
          }
      
          allLocations.add(location);
        });
      
        // Define KPIs
        const kpis = [
          "Production (gm)",
          "Jobs",
          "Labour Amount",
          "Gross Loss (%)",
          "Rejection (%)",
        ];
      
        // Create Rows for the Table
        const tableRows = kpis?.map((kpi, index) => {
          const row = { id: index + 1, KPI: kpi };
          allLocations.forEach((location) => {
            // Apply conditional decimal formatting based on KPI name
            if (kpi === "Labour Amount") {
              row[location] = parseFloat(combinedData[location]?.[kpi] || 0.00)?.toFixed(2); // 2 decimals for amount
            } else if (kpi === "Production (gm)" || kpi === "Gross Loss (%)" || kpi === "Rejection (%)") {
              row[location] = parseFloat(combinedData[location]?.[kpi] || 0.000)?.toFixed(3); // 3 decimals for weight/loss
            } else {
              row[location] = (combinedData[location]?.[kpi] || 0.00);
            }
          });
          return row;
        });
      
        // Define Columns for the Table
        const tableColumns = [
          { field: "KPI", headerName: "KPI", width: 200 },
          ...Array?.from(allLocations)?.map((location) => ({
            field: location,
            headerName: location,
            flex: 1,
            minWidth: 170,
            maxWidth: 300,
          })),
        ];
      
        // Rename NoLocation header if necessary
        tableColumns?.forEach((e) => {
          if (e?.headerName?.toLowerCase() === "nolocation") {
            e.headerName = "OutRight";
          }
        });
      
        setMFGData(tableRows);
        setColumns(tableColumns);
      } catch (error) {
        console.log(error);
        // setPleaseWaitFlag(false);
      }
      
    }

  const getKPIProductionData = async() => {
    try {

      const currentTime = moment().format('HH:mm:ss');
      const body = {
          "con":"{\"id\":\"\",\"mode\":\"kpidashboard\",\"appuserid\":\"admin@hs.com\"}",
          "p":`{\"fdate\":\"${fdate}\",\"tdate\":\"${tdate}\"}`,  
          "f":"m-test2.orail.co.in (ConversionDetail)"
      }
      const headers = {
        Authorization:`Bearer ${tkn}`,
        YearCode:"e3t6ZW59fXt7MjB9fXt7b3JhaWwyNX19e3tvcmFpbDI1fX0=",
        version:"v4",
        sv:0
      }
      if(fdate && tdate){
        dispatch(handleMfgLoaderFlag(true))
        const response = await axios.post("http://zen/api/report.aspx", body, { headers: headers });
        if(response?.status === 200){
            if(response?.data?.Status === '200'){
              dispatch(handleMfgLoaderFlag(false))
              // if(response?.data?.Data?.rd?.length > 0){

              //   const apiArr = response?.data?.Data?.rd;
              //   const data = [
              //     {
              //       stats: `${apiArr[0]?.rm_baggingcompleted}`,
              //       title: 'Bagging Completed',
              //     },
              //     {
              //       stats: `${((apiArr[0]?.rm_avg_proc_time / (60 * 60 * 24))?.toFixed(2))} Days`,
              //       title: 'Avg. Process Time',
              //     },
              //     {
              //       stats: `${apiArr[0]?.rm_grossloss === null ? '' : apiArr[0]?.rm_grossloss}`,
              //       title: 'Gross Loss',
              //     },
              //     {
              //       stats: `${apiArr[0]?.rm_goldstock === null ? '' : apiArr[0]?.rm_goldstock}`,
              //       title: 'Gold Stock',
              //       wt:`${apiArr[0]?.rm_goldstock_wt === null ? '' : apiArr[0]?.rm_goldstock_wt}`
              //     },
              //     {
              //       stats: `${apiArr[0]?.rm_diastock === null ? '' : apiArr[0]?.rm_diastock}`,
              //       title: 'Diamond Stock',
              //       wt:`${apiArr[0]?.rm_diastock_wt === null ? '' : apiArr[0]?.rm_diastock_wt}`
              //     },
              //     {
              //       stats: `${apiArr[0]?.rm_csstock === null ? '' : apiArr[0]?.rm_csstock}`,
              //       title: 'Colour Stone Stock',
              //       wt:`${apiArr[0]?.rm_csstock_wt === null ? '' : apiArr[0]?.rm_csstock_wt}`
              //     }
              //   ];
                
              //   setApiData(data);

              // }
              if(response?.data?.Data?.rd1){
                const apiArr2 = response?.data?.Data?.rd1;
                // setApiMFGData(apiArr2);
                setApiData(apiArr2);
              }
            }
        }
      }


    } catch (error) {
      console.log(error);
    }
  }
  



  // useEffect(() => {
  //   getKPIProductionData();
  //   getLbrAmtData();
  // },[fdate, tdate]);

  const getLbrAmtData = async() => {
    try {
        if(fdate && tdate)      {
            // const response = await fetchKPIDashboardData(tkn, fdate, tdate, "SalesMarketing_TotalSaleLocationWise");
            const response = [];
            if(response){
              setApiData2(response);
            }
        }
    } catch (error) {
      console.log(error);
    }
  }

  // Handle pagination directly from local data
  const paginatedData = filteredData?.slice(
    paginationModel.page * paginationModel.pageSize,
    (paginationModel.page + 1) * paginationModel.pageSize
  )

  
  const handleFilter = val => {
    setPaginationModel({ ...paginationModel, page: 0 }); // Reset to first page on filter change

    setValue(val);

    const filteredData = apiData?.filter((item) => {
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
    

    // setFilteredData(filteredData);

    

  };

  // Handle pagination change
  const handlePageChange = (newPage) => {
    setPaginationModel({ ...paginationModel, page: newPage })
  };
  const handlePageSizeChange = (newPageSize) => {
    setPaginationModel({ ...paginationModel, pageSize: newPageSize })
  };
  const handlePaginationModelChange = newModel => {
    setPaginationModel(prevModel => ({
      ...prevModel,
      ...newModel
    }))
  }

  return data ? (
    <Card className='fs_analytics_l' style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'206px'}}>
      {/* <CardHeader
        title='Manufacturing'
        
        titleTypographyProps={{ sx: { mb: [0, 0] } }}
        action={<CustomTextField value={value} placeholder='Search' style={{boxShadow:'none', border:'1px solid #e8e8e8'}} onChange={e => handleFilter(e.target.value)} />}
        sx={{
          py: 0.5,
          flexDirection: ['column', 'row'],
          '& .MuiCardHeader-action': { m: 0 },
          alignItems: ['flex-start', 'center']
        }}
      /> */}
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

      { kpiMFGFlag ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding:'1rem',  }}>
              <CircularProgress sx={{color:'black'}} />
            </Box> : <DataGrid
             rows={MFGData}  // Use the sliced paginated data
             columns={columns}
             disableColumnMenu
            // columns={columns?.map(col => ({
            //   ...col,
            //   disableColumnFilter: true,  // Disable the filter icon for each column
            // }))}
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
             className="fs_analytics_l onlyDatagrid"
             rowHeight={35}
             getRowId={(row) => row?.KPI}   // Specify the unique identifier
             sx={{
              '& .MuiDataGrid-columnHeader': {
                // backgroundColor: '#2F2B3D', // Set the desired background color
                color: bgColor, // Set the text color (optional)
                fontWeight:'bolder !important',
                fontSize:'13px'
              },
              '& .MuiDataGrid-cell': {
                fontSize: '13px', // Set the font size for cell content
              },
              '& .MuiDataGrid-columnHeader:focus': {
                outline: 'none', // Remove outline when the header is focused
              },
              '& .MuiDataGrid-columnHeader:focus-within': {
                outline: 'none', // Remove outline when focus is within the header
              },
              '& .MuiDataGrid-cell:focus': {
                outline: 'none', // Remove outline for cells as well
              },
            }}
      />}
    </Card>
  ) : null
}

export default Manufacturning

// // ** React Imports
// import { useState, useEffect } from 'react'

// // ** MUI Components
// import Box from '@mui/material/Box'
// import Card from '@mui/material/Card'
// import Typography from '@mui/material/Typography'
// import CardHeader from '@mui/material/CardHeader'
// import AvatarGroup from '@mui/material/AvatarGroup'
// import { DataGrid } from '@mui/x-data-grid'
// import LinearProgress from '@mui/material/LinearProgress'

// // ** Custom Component Import
// // import CustomTextField from 'src/@core/components/mui/text-field'
// import CustomTextField from '../../@core/components/mui/text-field'

// // ** Third Party Imports
// import axios from 'axios'

// // ** Custom Components Imports
// // import OptionsMenu from 'src/@core/components/option-menu'
// import OptionsMenu from '../../@core/components/option-menu'
// // import CustomAvatar from 'src/@core/components/mui/avatar'
// import CustomAvatar from '../../@core/components/mui/avatar'

// // ** Utils Import
// // import { getInitials } from 'src/@core/utils/get-initials'
// import { getInitials } from '../../@core/utils/get-initials'
// // import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
// import { hexToRGBA } from '../../@core/utils/hex-to-rgba';




// // import profileData from "../json/profile.json";
// // import "./chartcss/analyticsproject.css"
// import imgIcon from "../../images/avatars/1.png";
// import { fetchDashboardData, formatAmount, formatAmountKWise } from '../../GlobalFunctions';
// import "../kpianalytics.css"


// // ** renders name column
// const renderName = row => {
//   if (row.avatar) {
//     // return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
//     return <CustomAvatar src={imgIcon} sx={{ mr: 2.5, width: 38, height: 38 }} />
//   } else {
//     return (
//       <>
//       {/* <CustomAvatar
//         skin='light'
//         color={row.avatarColor || 'primary'}
//         sx={{ mr: 2.5, width: 38, height: 38, fontSize: theme => theme.typography.body1.fontSize }}
//       >
//         {getInitials(row.name || 'John Doe')}
//       </CustomAvatar> */}
//       </>
//     )
//   }
// }


// const Manufacturning = ({tkn, manufacturingData, bgColor}) => {
//   // ** State
//   const [data, setData] = useState([])
//   const [filteredData, setFilteredData] = useState([])
//   const [value, setValue] = useState('')
//   const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
//   const [totalRows, setTotalRows] = useState(0);

//   const [apiData, setApiData] = useState([]);
  
  
// const columns = [
//   {
//     flex: 0.1,
//     field: 'kpi',
//     minWidth: 220,
//     headerName: 'KPI',
//     renderCell: ({ row }) => {
//       // const { MetalType, MetalColor } = row
//       return (
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           {renderName(row)}
//           <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//             <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 900 }}>
//               {/* {MetalType} */}
//               {row?.kpi}
//             </Typography>
//             {/* <Typography noWrap variant='body2' sx={{ color: 'text.disabled', textTransform: 'capitalize' }}>
//               {MetalColor}
//             </Typography> */}
//           </Box>
//         </Box>
//       )
//     }
//   },
//   {
//     flex: 0.1,
//     minWidth: 105,
//     field: 'm_1',
//     headerName: 'M-1',
//     renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary', fontWeight:900 }}>{(row?.m_1)}</Typography>
//   },
//   {
//     flex: 0.1,
//     field: 'm_2',
//     minWidth: 120,
//     sortable: false,
//     headerName: 'M-2',
//     renderCell: ({ row }) => (
//       <Typography sx={{ color: 'text.secondary', fontWeight:900 }}>{(row?.m_2)}</Typography>
//       // <AvatarGroup className='pull-up'>
//       //   {row?.avatarGroup?.map((src, index) => (
//       //     // <CustomAvatar key={index} src={src} sx={{ height: 26, width: 26 }} />
//       //     <CustomAvatar key={index} src={imgIcon} sx={{ height: 26, width: 26 }} />
//       //   ))}
//       // </AvatarGroup>
//     )
//   },
//   {
//     flex: 0.1,
//     minWidth: 150,
//     field: 'm_3',
//     headerName: 'M-3',
//     renderCell: ({ row }) => (
//       <>
//         {/* <LinearProgress
//           style={{color:'#7367F0'}}
//           value={row.ProfitPer}
//           variant='determinate'
//           sx={{
//             mr: 3,
//             height: 8,
//             width: '100%',
//             borderRadius: 8,
//             backgroundColor: 'background.default',
//             '& .MuiLinearProgress-bar': {
//               borderRadius: 8,
//               backgroundColor:'#7367F0'
//             },
//           }}
//         /> */}
//         <Typography sx={{ color: 'text.secondary', fontWeight:900 }}>{`${row?.m_3}`}</Typography>
//       </>
//     )
//   },
//   // {
//   //   flex: 0.1,
//   //   minWidth: 100,
//   //   sortable: false,
//   //   field: 'actions',
//   //   headerName: 'ACTIONS',
//   //   renderCell: () => (
//   //     <OptionsMenu
//   //       iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
//   //       className='fs_analytics_l'
//   //       options={[
//   //         'Details',
//   //         'Archive',
//   //         { divider: true, dividerProps: { sx: { my: theme => `${theme.spacing(2)} !important` } } },
//   //         {
//   //           text: 'Delete',
//   //           menuItemProps: {
//   //             sx: {
//   //               color: 'error.main',
//   //               '&:not(.Mui-focusVisible):hover': {
//   //                 color: 'error.main',
//   //                 // backgroundColor: theme => hexToRGBA(theme.palette.error.main, 0.08)
//   //                 // backgroundColor: theme => hexToRGBA("#28C76F", 0.08)
//   //               }
//   //             }
//   //           }
//   //         }
//   //       ]}
//   //     />
//   //   )
//   // }
// ]

//   useEffect(() => {

//     const fetchData = async () => {
//       try {

//         // Fetch MonthWiseSaleAmount data
//         // let MetalTypeColorWiseSale = await fetchDashboardData(tkn, "MetalTypeColorWiseSale");

//         setApiData(manufacturingData);
//         setFilteredData(manufacturingData);

//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
  
//     fetchData(); 

//   },[manufacturingData]);





//   // useEffect(() => {
//   //   setData(profileData.data)
//   // }, [])

//   // Handle pagination directly from local data
//   const paginatedData = filteredData?.slice(
//     paginationModel.page * paginationModel.pageSize,
//     (paginationModel.page + 1) * paginationModel.pageSize
//   )

  
//   const handleFilter = val => {
//     setPaginationModel({ ...paginationModel, page: 0 }); // Reset to first page on filter change

//     setValue(val);

//     const filteredData = apiData?.filter((item) => {
//       const metalType = item.MetalType?.toLowerCase();  // Make sure both values are lowercase for case-insensitive comparison
//       const metalColor = item.MetalColor?.toLowerCase();
//       const saleAmt = item.SaleAmount?.toString()?.toLowerCase();
//       const netWt = item.NetWt?.toString()?.toLowerCase();
//       const profitPer = item.ProfitPer?.toString()?.toLowerCase();
//       const searchVal = val?.toLowerCase();
  
//       return (
//         metalType?.includes(searchVal) ||
//         saleAmt?.includes(searchVal) ||
//         netWt?.includes(searchVal) ||
//         profitPer?.includes(searchVal) ||
//         metalColor?.includes(searchVal)  // Check if either MetalType or MetalColor includes the search term
//       );
//     });
    

//     setFilteredData(filteredData);

    

//   };

//   // Handle pagination change
//   const handlePageChange = (newPage) => {
//     setPaginationModel({ ...paginationModel, page: newPage })
//   };

//   const handlePageSizeChange = (newPageSize) => {
//     setPaginationModel({ ...paginationModel, pageSize: newPageSize })
//   };
//   const rowsWithId = apiData.map(item => ({ ...item, id: item.SrNo }));


  
//   const handlePaginationModelChange = newModel => {
//     setPaginationModel(prevModel => ({
//       ...prevModel,
//       ...newModel
//     }))
//   }

//   return data ? (
//     <Card className='fs_analytics_l' style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}}>
//       {/* <CardHeader
//         title='Manufacturing'
        
//         titleTypographyProps={{ sx: { mb: [0, 0] } }}
//         action={<CustomTextField value={value} placeholder='Search' style={{boxShadow:'none', border:'1px solid #e8e8e8'}} onChange={e => handleFilter(e.target.value)} />}
//         sx={{
//           py: 0.5,
//           flexDirection: ['column', 'row'],
//           '& .MuiCardHeader-action': { m: 0 },
//           alignItems: ['flex-start', 'center']
//         }}
//       /> */}
//       {/* <DataGrid
//         // autoHeight
//         // pagination
//         // rows={data}
//         // rowHeight={62}
//         // columns={columns}
//         // checkboxSelection
//         // pageSizeOptions={[5, 10]}
//         // disableRowSelectionOnClick
//         // paginationModel={paginationModel}
//         // onPaginationModelChange={setPaginationModel}
//         // className='fs_analytics_l '
//         autoHeight
//         pagination
//         rows={rowsWithId}
//         rowHeight={78.9}
//         columns={columns}
//         checkboxSelection
//         pageSizeOptions={[5, 10]}
//         paginationMode="client"  // This is now client-side pagination
//         page={paginationModel.page}
//         pageSize={paginationModel.pageSize}
//         onPageChange={handlePageChange}
//         onPageSizeChange={handlePageSizeChange}
//         disableRowSelectionOnClick
//         className='fs_analytics_l'
//       /> */}

//       <DataGrid
//              rows={filteredData}  // Use the sliced paginated data
//              columns={columns}
//              paginationModel={paginationModel}
//              onPaginationModelChange={handlePaginationModelChange}
//              pageSizeOptions={[5]}
//             //  pagination
//             //  pageSizeOptions={[5, 10, 15, 20]}
//             //  paginationMode="client"
//             //  page={paginationModel.page}
//             //  pageSize={paginationModel.pageSize}
//             //  onPageChange={handlePageChange}
//             //  onPageSizeChange={handlePageSizeChange}
//              disableRowSelectionOnClick
//              className="fs_analytics_l"
//              rowHeight={30}
//              getRowId={(row) => row?.id}  // Specify the unique identifier
//              sx={{
//               '& .MuiDataGrid-columnHeader': {
//                 // backgroundColor: '#2F2B3D', // Set the desired background color
//                 color: bgColor, // Set the text color (optional)
//                 fontWeight:'bolder !important'
//               },
//               '& .MuiDataGrid-columnHeader:focus': {
//                 outline: 'none', // Remove outline when the header is focused
//               },
//               '& .MuiDataGrid-columnHeader:focus-within': {
//                 outline: 'none', // Remove outline when focus is within the header
//               },
//               '& .MuiDataGrid-cell:focus': {
//                 outline: 'none', // Remove outline for cells as well
//               },
//             }}
//       />
//     </Card>
//   ) : null
// }

// export default Manufacturning
