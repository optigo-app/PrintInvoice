import { configureStore } from "@reduxjs/toolkit";
import PD from "./slices/PD";
import QC from "./slices/QC";
import InventoryRatio  from "./slices/InventoryRatio";
import QcInward  from "./slices/QcInward";
import AvgCollectionRatio  from "./slices/AvgCollectionRatio";
import SaleMarketingTotalSale from "./slices/SaleMarketingTotalSale";
import SaleMarketingOrder from "./slices/SaleMarketingOrder";
import SaleMarketingOrderComplete from "./slices/SaleMarketingOrderComplete";


export const store = configureStore({
    reducer:{
        PD:PD,
        QC:QC,
        ITOR:InventoryRatio,
        QcInward:QcInward,
        AvgCollectionRatio:AvgCollectionRatio,
        SaleMarketingTotalSale:SaleMarketingTotalSale,
        SaleMarketingOrder:SaleMarketingOrder,
        SaleMarketingOrderComplete:SaleMarketingOrderComplete
    }
})

export default store;