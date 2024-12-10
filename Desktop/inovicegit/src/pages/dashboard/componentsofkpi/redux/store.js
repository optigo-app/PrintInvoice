import { configureStore } from "@reduxjs/toolkit";
import KPILoaderFlags from "../redux/slices/KPILaderFlag";

export const store = configureStore({
    reducer:{
        kpi:KPILoaderFlags
    }
});

export default store;