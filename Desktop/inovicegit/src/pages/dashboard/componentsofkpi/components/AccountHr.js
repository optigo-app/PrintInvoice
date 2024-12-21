import { Card, CircularProgress, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AccountNHR from './AccountNHR'
import { checkNullUndefined } from './global';

const AccountHr = ({ tkn, InventoryRatio, saleMTs, PrdDev, avgCollRatio, apiData1, bgColor, fdate, tdate }) => {

    // Check if the necessary props are available
    if (!InventoryRatio || !saleMTs || !PrdDev || !avgCollRatio) {
        return <>
                    <Grid container spacing={1}>
                {new Array(6).fill(null).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card variant="outlined" sx={{ padding: 2, height: '100%' }}>
                            <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
                            {/* <Typography variant="h6" align="center">Loading...</Typography> */}
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>;  // Or you can use a loader component here
    }

    const data = [
        {
            heading: 'Fix Asset Laverage Ratio',
            totalValue: parseFloat(checkNullUndefined(
                (
                    (
                        (saleMTs?.LabourAmount / (InventoryRatio?.DT?.[0]?.AvgInventory || 1)) /
                        (InventoryRatio?.DT?.[0]?.NoOfDays || 1)
                    ) * 365
                )
            )),
            series: [],
            subheading: 'Account & HR'
        },
        {
            heading: 'Revenue Per Employees',
            totalValue: parseFloat(checkNullUndefined(((saleMTs?.OnlySaleLabourAmount / (PrdDev?.RevenueEmployeeCount || 1)))))?.toFixed(2),
            series: [],
            subheading: 'Account & HR'
        },
        {
            heading: 'Avg. Due Debtors',
            totalValue: parseFloat(checkNullUndefined(checkNullUndefined(PrdDev?.TotalOverDueDays / (PrdDev?.TotalBillCount || 1))))?.toFixed(2),
            series: [],
            subheading: 'Account & HR'
        },
        {
            heading: 'Inventory Turn Over Ratio',
            totalValue: parseFloat(checkNullUndefined(InventoryRatio?.DT?.[0]?.InventoryRatio || 0))?.toFixed(2),
            series: [],
            subheading: 'Account & HR'
        },
        {
            heading: 'Avg. Collection Period',
            totalValue: parseFloat(checkNullUndefined(((avgCollRatio?.[0]?.Sun_Debtor || 0) / (saleMTs?.Amount || 1)) * 365))?.toFixed(2),
            series: [],
            subheading: 'Account & HR'
        },
        {
            heading: 'Labour vs Exp',
            totalValue: parseFloat(checkNullUndefined((((
                (saleMTs?.LabourAmount || 0) - 
                (InventoryRatio?.DT?.[0]?.Direct_Expense || 0) + 
                (InventoryRatio?.DT1?.[0]?.InDirect_Expense || 0)
            ) / (saleMTs?.LabourAmount || 1)) * 100)))?.toFixed(2),
            series: [],
            subheading: 'Account & HR'
        }
    ];

    return (
        <Grid container spacing={1}>
            {data?.length ? (
                data?.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <AccountNHR tkn={tkn} data={item} bgColor={bgColor} fdate={fdate} tdate={tdate} />
                    </Grid>
                ))
            ) : (
                <div>No data available</div>
            )}
        </Grid>
    );
};

export default AccountHr;
