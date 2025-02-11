import { configureStore } from "@reduxjs/toolkit";
import PD from "./slices/PD";
import QC from "./slices/QC";
import InventoryRatio  from "./slices/InventoryRatio";
import QcInward  from "./slices/QcInward";
import AvgCollectionRatio  from "./slices/AvgCollectionRatio";
import SaleMarketingTotalSale from "./slices/SaleMarketingTotalSale";
import SaleMarketingOrder from "./slices/SaleMarketingOrder";
import SaleMarketingOrderComplete from "./slices/SaleMarketingOrderComplete";
import SalesMarketing_TotalSaleBusinessClassWise from "./slices/SalesMarketing_TotalSaleBusinessClassWise";
import SalesMarketing_TotalSaleLocationWise from "./slices/SalesMarketing_TotalSaleLocationWise";
import MFGTable from "./slices/MFGTable";


export const store = configureStore({
    reducer:{
        PD:PD,
        QC:QC,
        ITOR:InventoryRatio,
        QcInward:QcInward,
        AvgCollectionRatio:AvgCollectionRatio,
        SaleMarketingTotalSale:SaleMarketingTotalSale,
        SaleMarketingOrder:SaleMarketingOrder,
        SaleMarketingOrderComplete:SaleMarketingOrderComplete,
        SalesMarketing_TotalSaleBusinessClassWise:SalesMarketing_TotalSaleBusinessClassWise,
        SalesMarketing_TotalSaleLocationWise:SalesMarketing_TotalSaleLocationWise,
        MFGTable:MFGTable
    }
})

export default store;