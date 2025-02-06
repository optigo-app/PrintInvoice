import { Box, Card, CardContent, CircularProgress, Grid, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AccountNHR from './AccountNHR'
import { checkNullUndefined } from './global';

const AccountHr = ({  InventoryRatio, InventoryRatioDT, InventoryRatioDT1, InventoryRatioDT2, InventoryRatioDT3, AvgColPeriod, saleMTs, saleMTs2, PrdDev,  bgColor, acrLoader, irLoader, PDLoader }) => {
        
    const theme = useTheme();
    
    if (acrLoader) {
        return <>
                    <Grid container spacing={1}>
                 {["Fix Asset Laverage Ratio","Revenue Per Employees","Avg. Due Debtors", "Inventory Turn Over Ratio", "Avg. Collection Period", "Labour vs Exp"]?.map((e, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card   className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'115px', display:'flex', justifyContent:'center', alignItems:'center'}}>
                        { ( PDLoader ||  irLoader || acrLoader) ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding:'1rem',  }}>
                                    <CircularProgress sx={{color:'lightgrey'}} />
                                    </Box> : <CardContent>
                                <Box sx={{ gap: 2, display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>
                                <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                    <Typography variant='h6' sx={{ mb: 0.75, color:bgColor,  }}>
                                        {e}
                                    </Typography>
                                    </div>
                                    <div>
                                    <Typography variant='h5' sx={{ mb: 0.75, color:theme?.palette?.grey[700], fontWeight:'bolder' }}>
                                        0.00
                                    </Typography>
                            
                                    </div>
                                </Box>
                                </Box>
                            </CardContent>}
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>;  
    }


    const data = [
        {
            heading: 'Fix Asset Laverage Ratio',
            totalValue: (parseFloat(checkNullUndefined(
                (
                    // (
                    //     ( (InventoryRatio?.DT2?.[0]?.AvgInventory === 0 ? 0 : saleMTs2?.LabourAmount) / (InventoryRatio?.DT2?.[0]?.AvgInventory === 0 ? 1 : InventoryRatio?.DT2?.[0]?.AvgInventory )) /
                    //     (InventoryRatio?.DT2?.[0]?.NoOfDays === 0 ? 1 : InventoryRatio?.DT2?.[0]?.NoOfDays)
                    // ) * 365
                    (
                        (saleMTs2?.LabourAmount / (InventoryRatioDT2?.AvgInventory || 1)) /
                        (InventoryRatioDT2?.NoOfDays || 1)
                    ) * 365
                )
            )))?.toFixed(0),
            series: [],
            subheading: 'Account & HR'
        },
        {
            heading: 'Revenue Per Employees',
            // totalValue: Math.round(parseFloat(checkNullUndefined(((( PrdDev?.RevenueEmployeeCount === 0 ? 0 : saleMTs?.OnlySaleLabourAmount) / (PrdDev?.RevenueEmployeeCount === 0 ? 1 : PrdDev?.RevenueEmployeeCount )))))),
            totalValue: Math.round(parseFloat(checkNullUndefined(
                saleMTs?.OnlySaleLabourAmount / (PrdDev?.RevenueEmployeeCount || 1)
              ))),
            series: [],
            subheading: 'Account & HR'
        },
        {
            heading: 'Avg. Overdue Deb. Days',
            // totalValue: Math.round(parseInt(checkNullUndefined(checkNullUndefined(( PrdDev?.TotalBillCount === 0 ? 0 : PrdDev?.TotalOverDueDays) / (PrdDev?.TotalBillCount === 0 ? 1 : PrdDev?.TotalBillCount ))))?.toFixed(2)),
            totalValue: Math.round(parseInt(checkNullUndefined(PrdDev?.TotalOverDueDays / (PrdDev?.TotalBillCount || 1)))),
            series: [],
            subheading: 'Account & HR'
        },
        {
            heading: 'Inventory Turn Over Ratio',
            totalValue: Math.round(checkNullUndefined(InventoryRatioDT?.InventoryTurnOverRatio || 0)),
            series: [],
            subheading: 'Account & HR'
        },
        {
            heading: 'Avg. Collection Period',
            // totalValue: parseFloat(checkNullUndefined(
            //     ((((((AvgColPeriod?.DT[0]?.Sun_Debtor ?? 0) + (AvgColPeriod?.DT1[0]?.Sun_Debtor ?? 0)) / 2)
            //      / 
            //      (((AvgColPeriod?.DT2[0]?.SaleAccAmount ?? 0) - (AvgColPeriod?.DT2[0]?.SaleReturnAccAmount ?? 0)) === 0 ? 1
            //       : ((AvgColPeriod?.DT2[0]?.SaleAccAmount ?? 0) - (AvgColPeriod?.DT2[0]?.SaleReturnAccAmount ?? 0)))
            //     )) * 365)
            // )),
            totalValue: parseFloat(checkNullUndefined(
                // ((((((AvgColPeriod?.DT[0]?.Sun_Debtor ?? 0) + (AvgColPeriod?.DT1[0]?.Sun_Debtor ?? 0)) / 2)
                // / 
                // (((AvgColPeriod?.DT2[0]?.SaleAccAmount ?? 0) - (AvgColPeriod?.DT2[0]?.SaleReturnAccAmount ?? 0)) === 0 ? 1
                // : ((AvgColPeriod?.DT2[0]?.SaleAccAmount ?? 0) - (AvgColPeriod?.DT2[0]?.SaleReturnAccAmount ?? 0)))
                // )) * 365)
                (
                    ((AvgColPeriod?.DT[0]?.Sun_Debtor ?? 0) + (AvgColPeriod?.DT1[0]?.Sun_Debtor ?? 0)) / 2
                  ) / 
                  (
                    (AvgColPeriod?.DT2[0]?.SaleAccAmount ?? 0) - (AvgColPeriod?.DT2[0]?.SaleReturnAccAmount ?? 0) || 1
                  ) * 365
                  
            )) || 0,  // If the result is NaN, it will return 0
            
            series: [],
            subheading: 'Account & HR'
        },

        {
            heading: 'Labour vs Exp',
            totalValue: 
            // parseFloat(checkNullUndefined((
            // (
            //     (
            //     ((saleMTs2?.OnlySaleLabourAmount - saleMTs2?.OnlySaleReturnLabourAmount) ) - 
            //     ((InventoryRatio?.DT2?.[0]?.Direct_Expense || 0) + (InventoryRatio?.DT3?.[0]?.InDirect_Expense || 0))
            //     ) 
            //     / 
            //     ((saleMTs2?.OnlySaleLabourAmount - saleMTs2?.OnlySaleReturnLabourAmount) || 1)
            // ) * 100)))?.toFixed(2),
            parseFloat(checkNullUndefined(
                ((saleMTs2?.OnlySaleLabourAmount - saleMTs2?.OnlySaleReturnLabourAmount - (InventoryRatioDT2?.Direct_Expense || 0) - (InventoryRatioDT3?.InDirect_Expense || 0)) /
                (saleMTs2?.OnlySaleLabourAmount - saleMTs2?.OnlySaleReturnLabourAmount || 1)) * 100
              ))?.toFixed(2)
              ,
            series: [],
            subheading: 'Account & HR'
        }
    ];



    return (
        <Grid container spacing={1}>
            {data?.length ? (
                data?.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <AccountNHR  data={item} bgColor={bgColor}   />
                    </Grid>
                ))
            ) : (
                <div>No data available</div>
            )}
        </Grid>
    );
};

export default AccountHr;