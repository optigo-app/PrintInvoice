// import React from 'react'
// import { TitanWipApi } from '../MyAPI/TitanWipApi/TitanWipApi';

// const TitanWip = () => {


//   const APICall = () => {
//     TitanWipApi()
//       .then((response) => {

//         console.log('resss', response);
        
//       })
//       .catch((err) => console.log(err))
//       .finally(() => {});
//   };

//   React.useEffect(() => {
//     APICall();
//   }, []);

//   return (
//     <div>TitanWip</div>
//   )
// }

// export default TitanWip


// http://localhost:3001/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&pid=18149&sv=MA==&report_api_url=aHR0cDovL3plbi9hcGkvTS5hc214L09wdGlnbw==&LId=MTU5MzE=&LUId=dWRheUBhZG1pbi5jby5pbg==


// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&pid=18149&sv=MA==&report_api_url=aHR0cDovL3plbi9hcGkvcmVwb3J0LmFzcHg=&LId=MTU5MzE=&LUId=dWRheUBhZG1pbi5jby5pbg== newwwwwwwwwwwww
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import "./Testgrid.css";
import DatePicker from "react-datepicker";
import masterData from "./masterData.json";
import mainButton from "../assets/Mail_32.png";
import printButton from "../assets/print.png";
import gridView from "../assets/GriedView.png";
import imageView from "../assets/ImageView2.png";
import "react-datepicker/dist/react-datepicker.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  Drawer,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import emailjs from "emailjs-com";
import { MdExpandMore, MdOpenInFull } from "react-icons/md";
import CustomTextField from "../TextFiled/Index";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AiFillSetting } from "react-icons/ai";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TitanWipApi } from "../MyAPI/TitanWipApi/TitanWipApi";

let popperPlacement = "bottom-start";
const ItemType = {
  COLUMN: "COLUMN",
};
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const DraggableColumn = ({
  col,
  index,
  moveColumn,
  checkedColumns,
  setCheckedColumns,
}) => {
  const [{ isDragging }, ref] = useDrag({
    type: ItemType.COLUMN,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType.COLUMN,
    hover(item) {
      if (item.index !== index) {
        moveColumn(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px",
        border: "1px solid lightgray",
        marginBottom: "15px",
        height: "55px",
        background: isDragging ? "#e0e0e0" : "rgb(234, 234, 234)",
        borderRadius: "4px",
        cursor: "grab",
        opacity: isDragging ? 0.5 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={checkedColumns[col.field]}
            onChange={() =>
              setCheckedColumns((prev) => ({
                ...prev,
                [col.field]: !prev[col.field],
              }))
            }
          />
        }
        label={col.headerName}
      />
    </div>
  );
};

export default function TitanWip() {
  const [commonSearch, setCommonSearch] = React.useState("");
  const [toDate, setToDate] = React.useState(null);
  const [fromDate, setFromDate] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const gridContainerRef = React.useRef(null);
  const [showImageView, setShowImageView] = React.useState(false);
  const [selectedColors, setSelectedColors] = React.useState([]);
  const [openPopup, setOpenPopup] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const [columns, setColumns] = React.useState([]);
  const [openPDate, setOpenPDate] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedRd3Name, setSelectedRd3Name] = React.useState("");
  
  const [masterKeyData, setMasterKeyData] = React.useState();
  const [allColumIdWiseName, setAllColumIdWiseName] = React.useState();
  const [allColumData, setAllColumData] = React.useState();
  const [allRowData, setAllRowData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [checkedColumns, setCheckedColumns] = React.useState({});

  const APICall = () => {
    setIsLoading(true);
    TitanWipApi()
      .then((response) => {
        setMasterKeyData(response?.Data?.rd[0]);
        setAllColumData(response?.Data?.rd1);
        setAllColumIdWiseName(response?.Data?.rd2);
        setAllRowData(response?.Data?.rd3);
        setIsLoading(false);
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  };

  React.useEffect(() => {
    APICall();
  }, []);

  React.useEffect(() => {
    if (allColumData) {
      const initialCheckedColumns = {};
      Object.values(allColumData).forEach((col) => {
        initialCheckedColumns[col.field] = col.ColumShow;
      });
      setCheckedColumns(initialCheckedColumns);
    }
  }, [allColumData]);

  React.useEffect(() => {
    if (!allColumData) return;
    const columnData = Object.values(allColumData)
      ?.filter((col) => col.ColumShow)
      ?.map((col) => {
        const isPriorityFilter = col.proiorityFilter === true;
        return {
          field: col.Field,
          headerName: col.HeaderName,
          width: col.Width,
          align: col.ColumAlign || "left",
          headerAlign: col.Align,
          filterable: col.ColumFilter,
          suggestionFilter: col.SuggestionFilter,
          hrefLink: col.HrefLink,
          filterTypes: [
            col.NormalFilter && "NormalFilter",
            col.DateRangeFilter && "DateRangeFilter",
            col.MultiSelection && "MultiSelection",
            col.RangeFilter && "RangeFilter",
            col.SuggestionFilter && "suggestionFilter",
            col.SelectDropdownFilter && "selectDropdownFilter",
          ].filter(Boolean),

          renderCell: (params) => {
            if (isPriorityFilter) {
              const matchedPriority = "";
              //  masterData.rd3.find(
              //   (priority) => priority.id === params.row.PriorityId
              // );
              if (matchedPriority) {
                return (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: matchedPriority.olorcode,
                        color: matchedPriority.fontcolorcode,
                        borderRadius: col.BorderRadius || "4px",
                        fontSize: col.FontSize || "12px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "20px",
                        borderRadius: "10px",
                        width: "100%",
                      }}
                    >
                      {params.value}
                    </span>
                  </div>
                );
              }
            } else if (col.Field === "Status") {
              const status = params.row.Status || ""; 
              let backgroundColor = "";
              let color = "";

              switch (status.toLowerCase()) {
                case "active":
                  backgroundColor = "rgba(0, 207, 232, 0.16)";
                  color = "#00CFE8";
                  break;
                case "professional":
                  backgroundColor = "rgba(40, 199, 111, 0.16)";
                  color = "#28C76F";
                  break;
                case "current":
                  backgroundColor = "rgba(115, 103, 240, 0.16)";
                  color = "#7367F0";
                  break;
                case "rejected":
                  backgroundColor = "rgba(234, 84, 85, 0.16)";
                  color = "#EA5455";
                  break;
                default:
                  backgroundColor = "transparent";
                  color = "black";
                  break;
              }

              return (
                <span
                  style={{
                    backgroundColor: backgroundColor,
                    color: color,
                    fontSize: col.FontSize || "inherit",
                    textTransform: col.ColumTitleCapital ? "uppercase" : "none",
                    padding: "5px 20px",
                    borderRadius: "5px",
                  }}
                >
                  {status}
                </span>
              );
            } else if (col.Field === "lastname") {
              const surname = params.row.firstname || ""; // Ensure that surname exists
              const name = params.row.lastname || ""; // Ensure that name exists
              return (
                <span
                  style={{
                    color: col.Color || "inherit",
                    backgroundColor: col.BackgroundColor || "inherit",
                    fontSize: col.FontSize || "inherit",
                    textTransform: col.ColumTitleCapital ? "uppercase" : "none",
                    padding: "5px 20px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <p className="mainName"> {`${surname}`} </p>
                  <p className="subname"> {`${surname} ${name}`} </p>
                </span>
              );
            } else if (col.HrefLink) {
              return (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "blue",
                    textDecoration: "underline",
                    fontSize: col.FontSize || "inherit",
                    padding: "5px 20px",
                  }}
                  onClick={() => handleCellClick(params)}
                >
                  {params.value}
                </a>
              );
            } else {
              return (
                <span
                  style={{
                    color: col.Color || "inherit",
                    backgroundColor: col.BackgroundColor || "inherit",
                    fontSize: col.FontSize || "inherit",
                    textTransform: col.ColumTitleCapital ? "uppercase" : "none",
                    padding: "5px 20px",
                    borderRadius: col.BorderRadius,
                  }}
                >
                  {params.value}
                </span>
              );
            }
          },
        };
      });
    setColumns(columnData);
  }, [allColumData]);

  // const hideColumns = Object.values(allColumData)
  //   .filter((col) => !col.ColumShow)
  //   .map((col) => ({
  //     field: col.field,
  //     headerName: col.headerName,
  //     width: col.Width,
  //     align: col.ColumAlign || "left",
  //     headerAlign: col.Align,
  //     filterable: col.ColumFilter,
  //     suggestionFilter: col.suggestionFilter,
  //     hrefLink: col.hrefLink,
  //     filterTypes: [
  //       col.NormalFilter && "NormalFilter",
  //       col.DateRangeFilter && "DateRangeFilter",
  //       col.MultiSelection && "MultiSelection",
  //       col.RangeFilter && "RangeFilter",
  //       col.suggestionFilter && "suggestionFilter",
  //       col.selectDropdownFilter && "selectDropdownFilter",
  //     ].filter(Boolean),

  //     renderCell: (params) => {
  //       if (col.hrefLink) {
  //         return (
  //           <a
  //             target="_blank"
  //             rel="noopener noreferrer"
  //             style={{
  //               color: "blue",
  //               textDecoration: "underline",
  //               fontSize: col.FontSize || "inherit",
  //               padding: "5px 20px",
  //             }}
  //             onClick={() => handleCellClick(params)}
  //           >
  //             {params.value}
  //           </a>
  //         );
  //       } else {
  //         return (
  //           <span
  //             style={{
  //               color: col.color || "inherit",
  //               backgroundColor: col.backgroundColor || "inherit",
  //               fontSize: col.FontSize || "inherit",
  //               textTransform: col.ColumTitleCapital ? "uppercase" : "none",
  //               padding: "5px 20px",
  //               borderRadius: col.borderRadius,
  //             }}
  //           >
  //             {params.value}
  //           </span>
  //         );
  //       }
  //     },
  //   }));

  const handleCellClick = (params) => {
    if (params.colDef.hrefLink) {
      setOpen(true);
    } else {
    }
  };

  const originalRows = allColumIdWiseName && allRowData 
  ? allRowData.map((row) => {
      const formattedRow = {};
      Object.keys(row).forEach((key) => {
        formattedRow[allColumIdWiseName[0][key]] = row[key];
      });
      return { id: row["1"], ...formattedRow };
    })
  : [];

  const [pageSize, setPageSize] = React.useState(10);
  const [filteredRows, setFilteredRows] = React.useState(originalRows);
  const [filters, setFilters] = React.useState({});

  React.useEffect(() => {
    const newFilteredRows = originalRows?.filter((row) => {
      const passesFilters = Object.keys(filters).every((filterField) => {
        if (!filters[filterField] || filters[filterField].length === 0)
          return true;

        const filterValue = filters[filterField];

        if (Array.isArray(filterValue)) {
          return filterValue.includes(row[filterField]);
        }

        if (filterField.includes("_min") || filterField.includes("_max")) {
          const baseField = filterField.replace("_min", "").replace("_max", "");
          const rowValue = parseFloat(row[baseField]);
          if (isNaN(rowValue)) return false;
          if (filterField.includes("_min") && filterValue) {
            if (rowValue < parseFloat(filterValue)) return false;
          }
          if (filterField.includes("_max") && filterValue) {
            if (rowValue > parseFloat(filterValue)) return false;
          }

          return true;
        }

        const rowValue = row[filterField] ? row[filterField].toString() : "";
        return rowValue.toLowerCase().includes(filterValue.toLowerCase());
      });

      if (selectedColors.length > 0 && row.PriorityId) {
        if (!selectedColors.includes(row.PriorityId)) {
          return false; // If the row's PriorityId doesn't match selected color filter
        }
      }

      if (passesFilters && fromDate && toDate) {
        const dateColumn = columns.find(
          (col) =>
            col.filterTypes && col.filterTypes.includes("DateRangeFilter")
        );
        if (dateColumn) {
          const rowDate = new Date(row[dateColumn.field]);
          if (rowDate >= fromDate && rowDate <= toDate) {
            return true;
          }
          return false;
        }
      }

      if (passesFilters) {
        return Object.values(row).some((value) =>
          value.toString().toLowerCase().includes(commonSearch.toLowerCase())
        );
      }
      return false;
    });
    setFilteredRows(newFilteredRows);
  }, [filters, originalRows, commonSearch, fromDate, toDate, columns]);

  const handleFilterChange = (field, value, filterType) => {
    setFilters((prevFilters) => {
      if (filterType === "MultiSelection") {
        const selectedValues = prevFilters[field] || [];
        let newValues;

        if (value.checked) {
          newValues = [...selectedValues, value.value];
        } else {
          newValues = selectedValues.filter((v) => v !== value.value);
        }

        return {
          ...prevFilters,
          [field]: newValues,
        };
      }
      return {
        ...prevFilters,
        [field]: value,
      };
    });
  };

  const renderFilter = (col) => {
    if (!col.filterTypes || col.filterTypes.length === 0) return null;
    const filtersToRender = col.filterTypes;

    return filtersToRender.map((filterType) => {
      switch (filterType) {
        case "NormalFilter":
          return (
            <div style={{ width: "100%", margin: "10px 20px" }}>
              <CustomTextField
                key={`filter-${col.field}-NormalFilter`}
                type="text"
                placeholder={`Filter by ${col.headerName}`}
                value={filters[col.field] || ""}
                onChange={(e) => handleFilterChange(col.field, e.target.value)}
                className="filter_column_box"
              />
            </div>
          );
        case "suggestionFilter": {
          const uniqueValues = [
            ...new Set(originalRows.map((row) => row[col.field])),
          ];

          return (
            <div
              key={`filter-${col.field}-suggestionFilter`}
              style={{ width: "100%", margin: "10px 20px" }}
            >
              <CustomTextField
                fullWidth
                placeholder={`Search ${col.headerName}`}
                value={filters[col.field] || ""}
                onChange={(e) => handleFilterChange(col.field, e.target.value)}
                InputProps={{
                  inputProps: {
                    list: `suggestions-${col.field}`,
                  },
                }}
                customBorderColor="rgba(47, 43, 61, 0.2)"
                borderoutlinedColor="#00CFE8"
                customTextColor="#2F2B3DC7"
                customFontSize="0.8125rem"
                size="small"
                variant="filled"
              />
              <datalist id={`suggestions-${col.field}`}>
                {uniqueValues.map((value) => (
                  <option
                    key={`suggestion-${col.field}-${value}`}
                    value={value}
                  />
                ))}
              </datalist>
            </div>
          );
        }

        default:
          return null;
      }
    });
  };

  const renderDateFilter = (col) => {
    if (!col.filterTypes || col.filterTypes.length === 0) return null;
    const filtersToRender = col.filterTypes;

    return filtersToRender.map((filterType) => {
      switch (filterType) {
        case "DateRangeFilter":
          return (
            <DatePicker
              key={`filter-${col.field}-DateRangeFilter`}
              selectsRange
              showYearDropdown
              showMonthDropdown
              monthsShown={2}
              endDate={toDate}
              selected={fromDate}
              startDate={fromDate}
              shouldCloseOnSelect={false}
              id="date-range-picker-months"
              onChange={handleOnChangeRange}
              customInput={
                <CustomTextField
                  customBorderColor="rgba(47, 43, 61, 0.2)"
                  borderoutlinedColor="#00CFE8"
                  customTextColor="#2F2B3DC7"
                  customFontSize="0.8125rem"
                  label="Specific Date Range"
                />
              }
              popperPlacement={popperPlacement}
              dateFormat="dd-MM-yyyy"
              placeholderText={"dd-mm-yyyy dd-mm-yyyy"}
              className="rangeDatePicker"
            />
          );
        default:
          return null;
      }
    });
  };

  const renderFilterDropDown = (col) => {
    if (!col.filterTypes || col.filterTypes.length === 0) return null;
    const filtersToRender = col.filterTypes;
    return filtersToRender.map((filterType) => {
      switch (filterType) {
        case "selectDropdownFilter": {
          const uniqueValues = [
            ...new Set(originalRows.map((row) => row[col.field])),
          ];
          return (
            <div
              key={`filter-${col.field}-selectDropdownFilter`}
              style={{ width: "100%", margin: "20px" }}
            >
              <CustomTextField
                select
                fullWidth
                label={`Select ${col.headerName}`}
                value={filters[col.field] || ""}
                onChange={(e) => handleFilterChange(col.field, e.target.value)}
                customBorderColor="rgba(47, 43, 61, 0.2)"
                borderoutlinedColor="#00CFE8"
                customTextColor="#2F2B3DC7"
                customFontSize="0.8125rem"
                size="small"
                className="selectDropDownMain"
                variant="filled"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {uniqueValues.map((value) => (
                  <MenuItem key={`select-${col.field}-${value}`} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </CustomTextField>
            </div>
          );
        }
        default:
          return null;
      }
    });
  };

  const renderFilterRange = (col) => {
    if (!col.filterTypes || col.filterTypes.length === 0) return null;
    const filtersToRender = col.filterTypes;
    return filtersToRender.map((filterType) => {
      switch (filterType) {
        case "RangeFilter":
          return (
            <div key={`filter-${col.field}-RangeFilter`}>
              <div>
                <Typography>{col.headerName} :</Typography>
              </div>
              <CustomTextField
                type="number"
                className="minTexBox"
                customBorderColor="rgba(47, 43, 61, 0.2)"
                placeholder="Min"
                value={filters[`${col.field}_min`] || ""}
                onChange={(e) => {
                  const value = e.target.value
                    ? parseFloat(e.target.value)
                    : "";
                  setFilters((prev) => ({
                    ...prev,
                    [`${col.field}_min`]: value,
                  }));
                }}
                InputLabelProps={{ shrink: true }}
              />

              <CustomTextField
                type="number"
                placeholder="Max"
                className="minTexBox"
                customBorderColor="rgba(47, 43, 61, 0.2)"
                value={filters[`${col.field}_max`] || ""}
                onChange={(e) => {
                  const value = e.target.value
                    ? parseFloat(e.target.value)
                    : "";
                  setFilters((prev) => ({
                    ...prev,
                    [`${col.field}_max`]: value,
                  }));
                }}
                InputLabelProps={{ shrink: true }}
                style={{ marginLeft: "10px" }}
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  const renderFilterMulti = (col) => {
    if (!col.filterTypes || col.filterTypes.length === 0) return null;
    const filtersToRender = col.filterTypes;
    return filtersToRender.map((filterType) => {
      switch (filterType) {
        case "MultiSelection":
          const uniqueValues = [
            ...new Set(originalRows.map((row) => row[col.field])),
          ];
          return (
            <div key={col.field}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<MdExpandMore />}
                  aria-controls={`${col.field}-content`}
                  id={`${col.field}-header`}
                >
                  <Typography>{col.headerName}</Typography>
                </AccordionSummary>
                <AccordionDetails className="gridMetalComboMain">
                  {uniqueValues.map((value) => (
                    <label key={value}>
                      <input
                        type="checkbox"
                        value={value}
                        checked={(filters[col.field] || []).includes(value)}
                        onChange={(e) =>
                          handleFilterChange(
                            col.field,
                            { value, checked: e.target.checked },
                            "MultiSelection"
                          )
                        }
                      />
                      {value}
                    </label>
                  ))}
                </AccordionDetails>
              </Accordion>
            </div>
          );

        default:
          return null;
      }
    });
  };

  const handleOnChangeRange = (dates) => {
    const [start, end] = dates;
    setFromDate(start);
    setToDate(end);
  };

  const handleClose = () => setOpen(false);

  const [sideFilterOpen, setSideFilterOpen] = React.useState(false);
  const toggleDrawer = (newOpen) => () => {
    setSideFilterOpen(newOpen);
  };

  const renderSummary = () => {
    const summaryColumns = columns.filter((col) => {
      const columnData = Object.values(allColumData).find(
        (data) => data.Field === col.field
      );
      return columnData?.Summary;
    });

    return (
      <div className="summaryBox">
        {summaryColumns.map((col) => (
          <div className="summaryItem">
            <div key={col.Field} className="boxViewTotal">
              <div>
                <p className="boxViewTotalValue">
                  {col.Field === "jobCount"
                    ? filteredRows?.reduce(
                        (sum, row) => sum + (parseInt(row[col.field], 10) || 0),
                        0
                      )
                    : filteredRows?.length}
                </p>
                <p className="boxViewTotalTitle">{col.headerName}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (gridContainerRef.current.requestFullscreen) {
        gridContainerRef.current.requestFullscreen();
      } else if (gridContainerRef.current.mozRequestFullScreen) {
        gridContainerRef.current.mozRequestFullScreen();
      } else if (gridContainerRef.current.webkitRequestFullscreen) {
        gridContainerRef.current.webkitRequestFullscreen();
      } else if (gridContainerRef.current.msRequestFullscreen) {
        gridContainerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, "data.xlsx");
  };

  const handleClearFilter = () => {
    setFromDate(null);
    setToDate(null);
    setFilters({});
  };

  const handleSendEmail = () => {
    const templateParams = {
      to_name: "Recipient",
      from_name: "Sender",
      message: "Your message content here",
    };
    emailjs
      .send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        templateParams,
        "YOUR_USER_ID"
      )
      .then(
        (response) => {
          console.log("Email sent successfully", response);
        },
        (error) => {
          console.log("Error sending email", error);
        }
      );
  };

  const handlePrint = () => {};

  const handleImg = () => {
    setShowImageView((prevState) => !prevState);
  };

  const toggleColorSelection = (colorId) => {
    setSelectedColors((prevSelected) => {
      if (prevSelected.includes(colorId)) {
        return prevSelected.filter((id) => id !== colorId);
      } else {
        return [...prevSelected, colorId];
      }
    });
  };

  const moveColumn = (fromIndex, toIndex) => {
    const newColumns = [...columns];
    const [movedColumn] = newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, movedColumn);
    setColumns(newColumns);
  };

  const handleClickOpenPoup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };


  // console.log('filteredRowsfilteredRows',filteredRows);
  // console.log('originalRows',originalRows);
  
  const handleSave = () => {
    console.log("Saving data...");
    console.log("Selected Date:", selectedDate);
    console.log("Selected Rd3 Name:", selectedRd3Name);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="mainGridView"
        sx={{ width: "100vw", display: "flex", flexDirection: "column" }}
        ref={gridContainerRef}
      >
        {isLoading && (
          <div className="loader-overlay">
            <CircularProgress className="loadingBarManage" />
          </div>
        )}

        <Dialog open={openPopup} onClose={handleClosePopup}>
          <div className="ConversionMain">
            {/* <p className="settingPopupTitle">Report Setting</p> */}
            {/* <div className="controlPopupTextMain">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Show Excel Export"
              />
            </div> */}

            <div className="filterDrawer">
              <p className="dataGridPopupColumSetting">Column Settings</p>
              {columns.map((col, index) => (
                <DraggableColumn
                  key={col.field}
                  col={col}
                  index={index}
                  moveColumn={moveColumn}
                  checkedColumns={checkedColumns}
                  setCheckedColumns={setCheckedColumns}
                />
              ))}
            </div>
          </div>
        </Dialog>
        <Drawer
          open={sideFilterOpen}
          onClose={toggleDrawer(false)}
          className="drawerMain"
        >
          <p style={{ margin: "20px 20px 0px 20px", fontSize: "25px" }}>
            Filter
          </p>
          {/* {hideColumns
            .filter((col) => col.filterable)
            .map((col) => (
              <div key={col.field} style={{ margin: "5px 20px" }}>
                {renderFilterMulti(col)}
              </div>
            ))} */}

          {columns
            .filter((col) => col.filterable)
            .map((col) => (
              <div key={col.field} style={{ margin: "5px 20px" }}>
                {renderFilterMulti(col)}
              </div>
            ))}

          {columns
            .filter((col) => col.filterable)
            .map((col) => (
              <div key={col.field} style={{ margin: "5px 20px" }}>
                {renderFilterRange(col)}
              </div>
            ))}

          {columns
            .filter((col) => col.filterable)
            .map((col) => (
              <div key={col.field} style={{ display: "flex", gap: "10px" }}>
                {renderFilterDropDown(col)}
              </div>
            ))}

          {columns
            .filter((col) => col.filterable)
            .map((col) => (
              <div key={col.field} style={{ display: "flex", gap: "10px" }}>
                {renderFilter(col)}
              </div>
            ))}
        </Drawer>

        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Modal>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {renderSummary()}

          <div className="topSettingBtnPopup" onClick={handleClickOpenPoup}>
            <AiFillSetting style={{ height: "25px", width: "25px" }} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "10px", alignItems: "end" }}>
            <button onClick={toggleDrawer(true)} className="FiletrBtnOpen">
              Open Filter
            </button>
            {columns
              .filter((col) => col.filterable)
              .map((col) => (
                <div key={col.field} style={{ display: "flex", gap: "10px" }}>
                  {renderDateFilter(col)}
                </div>
              ))}
            <div
              className="date-selector"
              style={{ display: "flex", gap: "10px" }}
            >
              <button
                className="FiletrBtnOpen"
                onClick={() => setOpenPDate(!openPDate)}
              >
                Set P.Date
              </button>

              <div
                className={`transition-container ${
                  openPDate ? "open" : "closed"
                }`}
                style={{
                  transition: "0.5s ease",
                  opacity: openPDate ? 1 : 0,
                  maxHeight: openPDate ? "300px" : "0",
                  overflow: "hidden",
                  display: openPDate ? "flex" : "none",
                  gap: "10px",
                }}
              >
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd-MM-yyyy"
                  customInput={
                    <CustomTextField
                      customBorderColor="rgba(47, 43, 61, 0.2)"
                      borderoutlinedColor="#00CFE8"
                      customTextColor="#2F2B3DC7"
                      customFontSize="0.8125rem"
                      style={{ Width: "100px" }}
                    />
                  }
                  placeholderText="Select Date"
                />

                <CustomTextField
                  select
                  fullWidth
                  value={filters.someField || ""}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  customBorderColor="rgba(47, 43, 61, 0.2)"
                  borderoutlinedColor="#00CFE8"
                  customTextColor="#2F2B3DC7"
                  customFontSize="0.8125rem"
                  size="small"
                  className="selectDropDownMain"
                  variant="filled"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {masterData.rd3.map((item) => (
                    <MenuItem key={item.id} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </CustomTextField>

                <button
                  onClick={handleSave}
                  variant="contained"
                  className="FiletrBtnOpen"
                  sx={{ marginTop: 2 }}
                >
                  Save
                </button>
              </div>
            </div>

            {/* <div style={{ display: "flex" }}>
              {masterData?.rd3.map((data) => (
                <abbr title={data?.name}>
                  <p
                    key={data.id}
                    style={{
                      backgroundColor: data?.colorcode,
                      cursor: "pointer",
                      border: selectedColors.includes(data.id)
                        ? "2px solid black"
                        : "none",
                    }}
                    className="colorFiled"
                    onClick={() => toggleColorSelection(data.id)} // Handle color click
                  ></p>
                </abbr>
              ))}
            </div> */}
          </div>
          <div style={{ display: "flex", alignItems: "end", gap: "10px" }}>
            {masterKeyData?.mailButton && (
              <img
                src={mainButton}
                style={{ cursor: "pointer" }}
                onClick={handleSendEmail}
              />
            )}

            {masterKeyData?.PrintButton && (
              <img
                src={printButton}
                style={{ cursor: "pointer", height: "40px", width: "40px" }}
                onClick={handlePrint}
              />
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {showImageView ? (
                <img
                  src={gridView}
                  className="imageViewImgGrid"
                  onClick={handleImg}
                />
              ) : (
                <img
                  src={imageView}
                  className="imageViewImg"
                  onClick={handleImg}
                />
              )}
            </div>

            <button onClick={handleClearFilter} className="ClearFilterButton">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                class="mr-2"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"></path>
              </svg>
              Clear Filters
            </button>

            {masterKeyData?.ExcelExport && (
              <button onClick={exportToExcel} className="exportButton">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 384 512"
                  class="mr-2"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm60.1 106.5L224 336l60.1 93.5c5.1 8-.6 18.5-10.1 18.5h-34.9c-4.4 0-8.5-2.4-10.6-6.3C208.9 405.5 192 373 192 373c-6.4 14.8-10 20-36.6 68.8-2.1 3.9-6.1 6.3-10.5 6.3H110c-9.5 0-15.2-10.5-10.1-18.5l60.3-93.5-60.3-93.5c-5.2-8 .6-18.5 10.1-18.5h34.8c4.4 0 8.5 2.4 10.6 6.3 26.1 48.8 20 33.6 36.6 68.5 0 0 6.1-11.7 36.6-68.5 2.1-3.9 6.2-6.3 10.6-6.3H274c9.5-.1 15.2 10.4 10.1 18.4zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"></path>
                </svg>
                Export to Excel
              </button>
            )}

            {masterKeyData?.fullScreenGridButton && (
              <button className="fullScreenButton" onClick={toggleFullScreen}>
                <MdOpenInFull style={{ marginInline: "5px" }} />
                FullScreenGrid{" "}
              </button>
            )}

            <CustomTextField
              type="text"
              placeholder="Common Search..."
              value={commonSearch}
              customBorderColor="rgba(47, 43, 61, 0.2)"
              onChange={(e) => setCommonSearch(e.target.value)}
            />
          </div>
        </div>

        <div style={{ height: "calc(100vh - 200px)" }}>
          {showImageView ? (
            <div>
              <img
                className="imageViewImgage"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVXLW1j3zO3UP6dIu96A3IpZihTe3fVRsm9g&s"
              />
              <img
                className="imageViewImgage"
                src="https://help.earthsoft.com/ent-data_grid_widget-sample.png"
              />
              <img
                className="imageViewImgage"
                src="https://i0.wp.com/thewwwmagazine.com/wp-content/uploads/2020/07/Screenshot-2020-07-09-at-7.36.56-PM.png?resize=1404%2C1058&ssl=1"
              />
              <img
                className="imageViewImgage"
                src="https://docs.devexpress.com/WPF/images/wpf-data-grid.png"
              />
              <img
                className="imageViewImgage"
                src="https://www.infragistics.com/products/ignite-ui-web-components/web-components/images/general/landing-grid-page.png"
              />
              <img
                className="imageViewImgage"
                src="https://i0.wp.com/angularscript.com/wp-content/uploads/2020/04/Angular-Data-Grid-For-The-Enterprise-nGrid.png?fit=1245%2C620&ssl=1"
              />
              <img
                className="imageViewImgage"
                src="https://angularscript.com/wp-content/uploads/2015/12/ng-bootstrap-grid-370x297.jpg"
              />
            </div>
          ) : (
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 15, 25, 50]}
              className="simpleGridView"
              checkboxSelection
              pagination
              sx={{
                "& .MuiDataGrid-menuIcon": {
                  display: "none",
                },
                marginLeft: 2,
                marginRight: 2,
                marginBottom: 2,
              }}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
}
