 
 
import "../../assets/css/bagprint/UserSalesReport.css";
import React from "react";
 

function UserSalesReport() {
  return (
    <div className="report-container" id="tblsummary1">
      
      {/* 1. Top Summary Row */}
      <div className="report-row">
        <div className="col-sr"   />
        <div className="col-designation"   />
        <div className="col-user" style={{ borderRight: "1px solid #C7C7C7" }} />

        {/* Assigned To Memo Totals */}
        <div className="cell cell-header col-stat">2</div>
        <div className="cell cell-header col-stat">13.933</div>
        <div className="cell cell-header col-stat">13.757</div>

        {/* Memo To Customer Totals */}
        <div className="cell cell-header col-stat">1</div>
        <div className="cell cell-header col-stat">5.600</div>
        <div className="cell cell-header col-stat">5.600</div>

        {/* Billed To Customer Totals */}
        <div className="cell cell-header col-stat">1</div>
        <div className="cell cell-header col-stat">8.333</div>
        <div className="cell cell-header col-stat">8.157</div>

        {/* Memo Return Totals */}
        <div className="cell cell-header col-stat">0</div>
        <div className="cell cell-header col-stat">0.000</div>
        <div className="cell cell-header col-stat">0.000</div>

        {/* Remaining Totals */}
        <div className="cell cell-header col-stat">0</div>
        <div className="cell cell-header col-stat">0.000</div>
        <div className="cell cell-header col-stat">0.000</div>
      </div>

      {/* 2. Group Header Row */}
      <div className="report-row">
        <div className="col-sr" />
        <div className="col-designation"   />
        <div className="col-user" style={{ borderRight: "1px solid #C7C7C7" }} />

        <div className="cell cell-header col-group">Assigned To Memo</div>
        <div className="cell cell-header col-group">Memo To Customer</div>
        <div className="cell cell-header col-group">Billed To Customer</div>
        <div className="cell cell-header col-group">Memo Return</div>
        <div className="cell cell-header col-group">Remaining</div>
      </div>

      {/* 3. Column Header Row */}
      <div className="report-row">
        <div className="cell cell-header col-sr">Sr#</div>
        <div className="cell cell-header col-designation">Designation</div>
        <div className="cell cell-header col-user">User</div>

        {/* Repeating Headers for all 5 groups */}
        {[...Array(5)].map((_, i) => (
          <React.Fragment key={i}>
            <div className="cell cell-header col-stat">Count</div>
            <div className="cell cell-header col-stat">Gross</div>
            <div className="cell cell-header col-stat">Net</div>
          </React.Fragment>
        ))}
      </div>

      {/* 4. Row 1: FULL STACK DEVELOPER */}
      <div className="report-row">
        <div className="cell cell-number col-sr">1</div>
        <div className="cell cell-text col-designation">FULL STACK DEVELOPER</div>
        <div className="cell cell-text col-user">anokhi</div>

        {/* Assigned */}
        <div className="cell cell-number col-stat">1</div>
        <div className="cell cell-number col-stat">5.600</div>
        <div className="cell cell-number col-stat">5.600</div>
        {/* Memo To Cust */}
        <div className="cell cell-number col-stat">1</div>
        <div className="cell cell-number col-stat">5.600</div>
        <div className="cell cell-number col-stat">5.600</div>
        {/* Billed */}
        <div className="cell cell-number col-stat">0</div>
        <div className="cell cell-number col-stat">0.000</div>
        <div className="cell cell-number col-stat">0.000</div>
        {/* Return */}
        <div className="cell cell-number col-stat">0</div>
        <div className="cell cell-number col-stat">0.000</div>
        <div className="cell cell-number col-stat">0.000</div>
        {/* Remaining */}
        <div className="cell cell-number col-stat">0</div>
        <div className="cell cell-number col-stat">0.000</div>
        <div className="cell cell-number col-stat">0.000</div>
      </div>

      {/* 5. Row 2: Admin */}
      <div className="report-row">
        <div className="cell cell-number col-sr">2</div>
        <div className="cell cell-text col-designation">Admin</div>
        <div className="cell cell-text col-user">driya</div>

        {/* Assigned */}
        <div className="cell cell-number col-stat">1</div>
        <div className="cell cell-number col-stat">8.333</div>
        <div className="cell cell-number col-stat">8.157</div>
        {/* Memo To Cust */}
        <div className="cell cell-number col-stat">0</div>
        <div className="cell cell-number col-stat">0.000</div>
        <div className="cell cell-number col-stat">0.000</div>
        {/* Billed */}
        <div className="cell cell-number col-stat">1</div>
        <div className="cell cell-number col-stat">8.333</div>
        <div className="cell cell-number col-stat">8.157</div>
        {/* Return */}
        <div className="cell cell-number col-stat">0</div>
        <div className="cell cell-number col-stat">0.000</div>
        <div className="cell cell-number col-stat">0.000</div>
        {/* Remaining */}
        <div className="cell cell-number col-stat">0</div>
        <div className="cell cell-number col-stat">0.000</div>
        <div className="cell cell-number col-stat">0.000</div>
      </div>
    </div>
  );
}

export default UserSalesReport;