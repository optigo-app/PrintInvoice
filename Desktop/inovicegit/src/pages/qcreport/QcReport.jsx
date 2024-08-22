import React, { useEffect, useState } from "react";
import './index.css'
import {IconButton } from '@mui/material';

import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Grid,Box } from "@mui/material";
import dayjs from "dayjs";
import axios from 'axios';
import * as XLSX from 'xlsx';
import { CheckCircle, Cancel, DoNotDisturb, Dashboard, BarChart, PieChart } from '@mui/icons-material';
import { FaCheckCircle, FaTimesCircle, FaTachometerAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const useQueryParams = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};


const QcReport = () => {
  const [jobIdDisabled, setJobIdDisabled] = useState(false);
  const [ischecked, setIschecked] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const queryParams = useQueryParams();
  const Yc = queryParams.get("Yc");
  console.log("yc",Yc);
    const [myData, setMyData] = useState([]);
  const [searchTerms, setSearchTerms] = useState({
    roleId: "",
    fromDate: "",
    toDate: "",
    status: "",
    question: "",
  });
  const [loading, setLoading] = useState(true); 

  const handleJobIdToggle = () => {
    setJobIdDisabled(prev => !prev);
    setIschecked(prev => !prev);
  };

  const handleSearchChange = (field) => (event) => {
    setSearchTerms((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleClearSearch = (field) => () => {
    setSearchTerms((prev) => ({
      ...prev,
      [field]: "",
    }));
  };
  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "Report.xlsx");
  };
  
  const formatDate = (date) => dayjs(date).format("DD-MMM-YYYY");

  const filteredRows = myData.filter((row) => {
    const jobIdMatch = searchTerms.roleId
      ? row.jobId.toLowerCase().includes(searchTerms.roleId.toLowerCase())
      : true;

    const fromDate = searchTerms.fromDate ? dayjs(searchTerms.fromDate) : null;
    const toDate = searchTerms.toDate ? dayjs(searchTerms.toDate) : null;
    const qcDate = dayjs(row.Entrydate, "DD-MMM-YYYY");

    const dateMatch =
      (!fromDate || qcDate.isAfter(fromDate.subtract(1, "day"))) &&
      (!toDate || qcDate.isBefore(toDate.add(1, "day")));

    const statusMatch = searchTerms.status
      ? row.StatusName.toLowerCase().includes(searchTerms.status.toLowerCase())
      : true;

    return jobIdMatch && dateMatch && statusMatch;
  });

  const handleClearAllFilters = () => {
    setSearchTerms({
      roleId: "",
      fromDate: "",
      toDate: "",
      status: "",
      question: "",
    });
  };

  const getColumns = () => {
    const alwaysVisibleColumns = [
      { field: "id", headerName: "id", width: 80 },
      {
        field: "jobId",
        headerName: "Job ID",
        width: 150,
        renderCell: (params) => (
          <div>
            <div className="text-gray-500  text-base">{params.value}</div>
            <div className="text-gray-400 text-xs">{params.row.locationName}</div>
          </div>
        ),
        renderHeader: (params) => (
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              onChange={handleJobIdToggle}
            />
            {params.colDef.headerName}
          </div>
        ),
      },
      { field: "Entrydate", headerName: "Entry Date", width: 150 },
      {
        field: "StatusName",
        headerName: "Status",
        width: 150,
        renderCell: (params) => (
          <span
            className={`py-1 px-2 rounded ${params.value === "Approved"
                ? "text-green-600 bg-green-100"
                : params.value === "On Hold"
                ? "text-blue-600 bg-blue-100"
                : params.value === "Rejected"
                ? "text-red-600 bg-red-100"
                : "text-gray-600"
              }`}
          >
            {params.value}
          </span>
        ),
      },
    ];
  
    const dynamicColumns = myData.length > 0
      ? Object.keys(myData[0]).filter(key => ![ 'id','jobId', 'Entrydate', 'StatusName', 'locationName'].includes(key))
        .map(key => ({
          field: key,
          headerName: key,
          width: 150,
        }))
      : [];
  
    return [...alwaysVisibleColumns, ...dynamicColumns];
  };
  


  const totalApproved = filteredRows.filter(row => row.StatusName === "Approved").length;
  const totalRejected = filteredRows.filter(row => row.StatusName === "Rejected").length;
  const totalEntries = filteredRows.length;
  
  const getDateWiseData = (data) => {
    const dateWiseMap = new Map();
  
    data.forEach(item => {
        const date = item.Entrydate;
        if (!dateWiseMap.has(date)) {
            dateWiseMap.set(date, []);
        }
        dateWiseMap.get(date).push(item);
    });
  
    const dateWiseArray = Array.from(dateWiseMap.entries()).map(([date, items], index) => {
        const aggregatedItem = { Entrydate: date, id: index + 1 }; 
  
        items.forEach(item => {
            Object.keys(item).forEach(key => {
                if (key !== 'Entrydate' && key !== 'id' && key !== 'jobId') {
                    const currentValue = item[key];
                    if (currentValue === null || currentValue === undefined) {
                        return;
                    }
                    
                    if (!aggregatedItem[key]) {
                        aggregatedItem[key] = currentValue;
                    } else {
                        const values = items.map(i => i[key]).filter(val => val !== null && val !== undefined);
                        const filteredValues = values.filter(val => val !== "");
                        const uniqueValues = [...new Set(filteredValues)];
                        
                        if (uniqueValues.length === 0) {
                            aggregatedItem[key] = "-";
                        } else if (uniqueValues.length === 1) {
                            aggregatedItem[key] = uniqueValues[0];
                        } else {
                            const containsDash = uniqueValues.includes("-");
                            const nonDashValues = uniqueValues.filter(val => val !== "-");

                            if (containsDash && nonDashValues.length === 0) {
                                aggregatedItem[key] = "-";
                            } else if (containsDash && nonDashValues.length > 0) {
                                aggregatedItem[key] = nonDashValues.join(",");
                            } else {
                                aggregatedItem[key] = uniqueValues.join(",");
                            }
                        }
                    }
                }
            });
  
            aggregatedItem['jobId'] = "-";            
            aggregatedItem['locationName'] = " ";            
            aggregatedItem['StatusName'] = (aggregatedItem['StatusName'] || '') + (aggregatedItem['StatusName'] ? ',' : '') + item['StatusName'];
        });
  
        if (aggregatedItem['StatusName']) {
            const statusValues = aggregatedItem['StatusName'].split(',');
            const statusUnique = [...new Set(statusValues)];
            if (statusUnique.length > 1) {
                aggregatedItem['StatusName'] = statusUnique.join(",");
            } else if (statusUnique.length === 1) {
                const count = statusValues.filter(val => val === statusUnique[0]).length;
                aggregatedItem['StatusName'] = count > 1 ? `(${count})${statusUnique[0]}` : statusUnique[0];
            }
        }
  
        return aggregatedItem;
    });
  
    return dateWiseArray;
};

useEffect(() => {
  const fetchData = async () => {
    try {
      const headers = {
        Authorization: '',
        // YearCode: 'e3t6ZW59fXt7MjB9fXt7b3JhaWwyNX19e3tvcmFpbDI1fX0=',
        YearCode: `${Yc}`,
        version: 'v4',
        'Content-Type': 'application/json',
      };

      const data = {
        con: "{\"id\":\"\",\"mode\":\"QCAnalysis\",\"appuserid\":\"admin@hs.com\"}",
        p: 'eyJTZXJpYWxKb2JubyI6IjAwMDAwMDkyMjIiLCJjdXN0b21lcmlkIjoiMjMiLCJCYWdQcmludE5hbWUiOiIifQ==',
        f: 'm-test2.orail.co.in (BAGPRINT1)',
      };

      const response = await axios.post('http://zen/api/M.asmx/Optigo', data, { headers });

      const parsedResponse = JSON.parse(response.data.d);

      const organizedData = organizeDataByJobId(parsedResponse.rd);

      const uniqueQuestions = Array.from(new Set(
        parsedResponse.rd
          .map(item => item.QCQuetionvalue)
          .filter(value => value !== null && value !== undefined && value !== "")
      ));

      const jobIdArray = [];
      let serialNumber = 1;

      organizedData.forEach(job => {
        job.Statuses.forEach(status => {
          const jobData = {
            id: serialNumber++,
            jobId: job.stockbarcode,
            StatusName: status|| "-",
            Entrydate: job.Entrydate,
            locationName: job.locationName || "-", 
            ...uniqueQuestions.reduce((acc, question) => {
              acc[question] = job.Questions[question] || "-";
              return acc;
            }, {})
          };
          jobIdArray.push(jobData);
        });

        if (job.Statuses.length === 0) {
          const jobData = {
            id: serialNumber++,
            jobId: job.stockbarcode,
            StatusName: "-",
            Entrydate: job.Entrydate,
            locationName: job.locationName || "-",

            ...uniqueQuestions.reduce((acc, question) => {
              acc[question] = job.Questions[question] || "-";
              return acc;
            }, {})
          };
          jobIdArray.push(jobData);
        }
      });

      const dateWiseArray = getDateWiseData(jobIdArray);

      if (!ischecked) {
        setMyData(jobIdArray);
      } else {
        setMyData(dateWiseArray);
      }

      setFilteredData(ischecked ? jobIdArray : dateWiseArray);
      setLoading(false);
      console.log("JobidArray", jobIdArray);

    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false); 
    }
  };

  fetchData();
}, [ischecked]);

const organizeDataByJobId = (data) => {
  const organizedData = [];

  data.forEach((item) => {
    const jobId = item.stockbarcode;
    const question = item.QCQuetionvalue;
    const statusName = item.StatusName || "-";
    const locationName = item.locationname || ""; 

    let existingJob = organizedData.find(d => d.stockbarcode === jobId);

    if (!existingJob) {
      existingJob = {
        srNo: organizedData.length + 1,
        Entrydate: formatDate(item.Entrydate),
        stockbarcode: jobId,
        locationName: locationName, 
        Statuses: [],
        Questions: {},
      };
      organizedData.push(existingJob);
    }

    existingJob.Questions[question] = item.asoptionvalue || "-";

    if (statusName !== "-" && statusName !== "") {
      existingJob.Statuses.push(statusName);
    }
  });

  return organizedData;
};



  // const organizeDataByJobId = (data) => {
  //   const organizedData = [];

  //   data.forEach((item) => {
  //     const jobId = item.stockbarcode;
  //     const question = item.QCQuetionvalue;
  //     const statusName = item.StatusName || "-";

  //     let existingJob = organizedData.find(d => d.stockbarcode === jobId);

  //     if (!existingJob) {
  //       existingJob = {
  //         srNo: organizedData.length + 1,
  //         Entrydate: formatDate(item.Entrydate),
  //         stockbarcode: jobId,
  //         Statuses: [],
  //         Questions: {},
  //       };
  //       organizedData.push(existingJob);
  //     }

  //     existingJob.Questions[question] = item.asoptionvalue || "-";

  //     if (statusName !== "-" && statusName !== "") {
  //       existingJob.Statuses.push(statusName);
  //     }
  //   });

  //   return organizedData;
  // };
  const stats = [
    {
      icon: <FaCheckCircle size={24} color="#ffffff" />,
      title: 'Total Approved',
      value: totalApproved,
      color: '#E0F7FA',
      iconBg: '#00ACC1',
    },
    {
      icon: <FaTimesCircle size={24} color="#ffffff" />,
      title: 'Total Rejected',
      value: totalRejected,
      color: '#FFEBEE',
      iconBg: '#E57373',
    },
    {
      icon: <FaTachometerAlt size={24} color="#ffffff" />,
      title: 'Total Entries',
      value: totalEntries,
      color: '#E8F5E9',
      iconBg: '#81C784',
    },
  ];


  return (
    <div className="p-4 bg-[#F3F2F5]">
     <div className="mb-6">
     <Card sx={{ boxShadow: 3, padding: 2, backgroundColor: '#ffffff' }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Statistics
        </Typography>
        <Grid container spacing={2}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: 2,
                  borderRadius: 2,
                  backgroundColor: stat.color,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: stat.iconBg,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                  }}
                >
                  {stat.icon}
                </Box>
                <Box ml={2}>
                  <Typography variant="h5" component="div">
                    {stat.value.toLocaleString()}k
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>
     </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-gray-700">From</label>
            <div className="relative">
              <input
                type="date"
                value={searchTerms.fromDate}
                onChange={handleSearchChange("fromDate")}
                className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 customdate-input "
                placeholder="From Date"
              />
              {searchTerms.fromDate && (
                <ClearIcon
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointe"
                  onClick={handleClearSearch("fromDate")}
                />
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-700">To</label>
            <div className="relative">
              <input
                type="date"
                value={searchTerms.toDate}
                onChange={handleSearchChange("toDate")}
                className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 customdate-input "
                placeholder="To Date"
              />
              {searchTerms.toDate && (
                <ClearIcon
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={handleClearSearch("toDate")}
                />
              )}
            </div>
          </div>
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Search by Job ID</label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerms.roleId}
              onChange={handleSearchChange("roleId")}
              className="w-full p-2 pl-10 border border-gray-300 ps-10 rounded focus:outline-none focus:ring-blue-500 custom-input"
              placeholder="Search..."
            />
            {searchTerms.roleId && (
              <ClearIcon
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer "
                onClick={handleClearSearch("roleId")}
              />
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Search by Status</label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerms.status}
              onChange={handleSearchChange("status")}
              className="w-full p-2 pl-10 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 custom-input"
              placeholder="Search..."
            />
            {searchTerms.status && (
              <ClearIcon
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={handleClearSearch("status")}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className=" mx-auto my-0  justify-center">
          <label className="block mb-1 text-transparent">Clear</label>
          <button
            onClick={handleClearAllFilters}
            className="px-4 py-2 bg-red-500 text-white  rounded hover:bg-red-600"
          >
            Clear Filters
          </button>
          </div>

          <div className=" mx-auto my-0  justify-center">
          <label className="block mb-1 text-transparent">Clear</label>
          <button
                  onClick={handleExportToExcel}
            className="px-4 py-2 bg-green-700 text-white  rounded hover:bg-green-600"
          >
            Clear Excel
          </button>
          </div>
        </div>

       
      </div>

      <div className="w-full flex items-center justify-center h-[80vh]">
        {loading ? (
          <CircularProgress />
        ) : (
          <DataGrid
          rows={filteredRows}
          columns={getColumns()}
          pageSize={10}
          rowsPerPageOptions={[10]}
        
          sx={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff !important",
            height: '80vh !important',
            "& .MuiDataGrid-columnHeaders": {
              fontWeight: "bold",
              fontSize: "1rem",
              borderBottom: "2px solid #e0e0e0",
              "& .MuiDataGrid-columnHeader": {
                borderRight: "1px solid #e0e0e0",
                color: "rgba(47, 43, 61, 0.78)",
                backgroundColor: "#F6F6F7 !important",
              },
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.875rem",
              border: "1px solid #F7F7F7",
              color: "rgba(47, 43, 61, 0.78)",
            },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-footerContainer": {
              justifyContent: "flex-end",
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-selectLabel, & .MuiDataGrid-footerContainer .MuiTablePagination-displayedRows": {
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#757575",
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-actions": {
              marginRight: "1rem",
            },
          }}
        />
        )}
      </div>
    </div>
  );
};

export default QcReport;
