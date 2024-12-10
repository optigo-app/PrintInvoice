import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchComponentData = createAsyncThunk(
    'dashboard/fetchComponentData',
    async (dateFilter, { rejectWithValue }) => {
    //   try {
    //     const body = {
    //         "con":"{\"id\":\"\",\"mode\":\"kpidashboard\",\"appuserid\":\"admin@hs.com\"}",
    //         "p":`{\"fdate\":\"${fdatef}\",\"tdate\":\"${tdatef}\"}`,  
    //         "f":"m-test2.orail.co.in (ConversionDetail)"
    //     }

    //     const headers = {
    //       Authorization:`Bearer ${tkn}`,
    //       YearCode:"e3t6ZW59fXt7MjB9fXt7b3JhaWwyNX19e3tvcmFpbDI1fX0=",
    //       version:"v4",
    //       sv:0
    //     }
    //     const [mfgComp, comp2, comp3] = await Promise.all([
    //       axios.post(`http://zen/api/report.aspx`, body, { headers: headers }),
    //       axios.post(`/api/component2`, { params: dateFilter }),
    //       axios.post(`/api/component3`, { params: dateFilter }),
    //       // Add other API calls here
    //     ]);
    //     return {
    //         mfgComp: mfgComp.data,
    //         pd: PD.data,
    //         comp3: comp3.data,
    //       // Add other components here
    //     };
    //   } catch (error) {
    //     return rejectWithValue(error.response?.data || 'API Error');
    //   }
    }
  );

const KPILoaderFlags = createSlice({
    name:'kpi',
    initialState:{
        loading:false ,  
        data:{},
        error:null,
        mfg:false,
        apiCall:false
    },
    reducers:{
        handleMfgLoaderFlag : (state, action) => {
            state.mfg = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchComponentData.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchComponentData.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
          })
          .addCase(fetchComponentData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });
      },
});

export const { handleMfgLoaderFlag } = KPILoaderFlags.actions;
export default KPILoaderFlags.reducer;