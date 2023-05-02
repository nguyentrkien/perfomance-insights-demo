import axios from "axios"
import { createAsyncThunk, createSlice, configureStore, current } from "@reduxjs/toolkit"
import { combineReducers } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { elementType } from "prop-types";

const initialState = {
    getVariables: [],
    getDatas: [],
    getAssets: [],
    isGetAssets: false,
    // dashboards: [
    //     {name: 'overview', type: 'overview', asset: 'edge', id: 'overview'},
    //     {name: 'add', type: 'add', asset: 'edge', id: 'add'},
    // ],
    timerange: ['day','month','year'],
    period: ['minute','hour','day'],
    Aggregation: ['Average','Max','Min','Sum'],
    singleData: '',
    getInitData: false,
    auth: {
        login: {
            currentUser: {
                    id: "6446820d293e88c724cc6976",
                    name: "Admin",
                    email: "proytb.123@gmail.com",
                    dashboards: [
                        {
                            "name": "overview",
                            "type": "overview",
                            "asset": "edge",
                            "id": "overview",
                            "_id": "6446820d293e88c724cc6977"
                        },
                        {
                            "name": "add",
                            "type": "add",
                            "asset": "edge",
                            "id": "add",
                            "_id": "6446820d293e88c724cc6978"
                        },
                        {
                            "name": "overview",
                            "type": "overview",
                            "asset": "Test1",
                            "id": "overview",
                            "_id": "644682008qwe88c724ccx977"
                        },
                        {
                            "name": "add",
                            "type": "add",
                            "asset": "Test1",
                            "id": "add",
                            "_id": "6446820d293e88cqe2zcc6978"
                        },
                    ],
                    widgets: [],
                    kpis: [],
                    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjY0NDY4MjBkMjkzZTg4YzcyNGNjNjk3NiIsIm5hbWUiOiJ0YWluIiwiZW1haWwiOiJ0ZXN0a3BpQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJE5TbUxkazQ1ZnFCL1FGRm90eDNPeHVIV1VhZzFSTjZveW94Tmp2Z3Y4QmNXQy9ySE1YakxPIiwiZGFzaGJvYXJkcyI6W3sibmFtZSI6Im92ZXJ2aWV3IiwidHlwZSI6Im92ZXJ2aWV3IiwiYXNzZXQiOiJlZGdlIiwiaWQiOiJvdmVydmlldyIsIl9pZCI6IjY0NDY4MjBkMjkzZTg4YzcyNGNjNjk3NyJ9LHsibmFtZSI6ImFkZCIsInR5cGUiOiJhZGQiLCJhc3NldCI6ImVkZ2UiLCJpZCI6ImFkZCIsIl9pZCI6IjY0NDY4MjBkMjkzZTg4YzcyNGNjNjk3OCJ9LHsibmFtZSI6InRlc3QiLCJ0eXBlIjoiZGFzaGJvYXJkIiwiYXNzZXQiOiJlZGdlIiwiaWQiOiI4OGNjMmMxOCIsIm5vdyI6dHJ1ZSwic3RhcnREYXRlIjoiMjAyMy0wNC0yNFQxNzowMDowMC4wMDBaIiwidG9EYXRlIjoiMjAyMy0wNC0yNVQwNjoxODoxNy4xNDVaIiwidGltZXJhbmdlIjoiZGF5IiwiX2lkIjoiNjQ0NzcwYTkzMDY1YjUxNWRhNjM3N2UzIn1dLCJ3aWRnZXRzIjpbXSwia3BpcyI6W3siaWQiOiIyMzRlM2RiMiIsIm5hbWUiOiJ2YWx1ZSIsImZvcm11bGEiOlt7ImlkIjoiYzZlIiwidHlwZSI6IlBhcmFtIiwidGV4dCI6ImEiLCJsYWJlbCI6IlZhcl90ZXN0IiwidmFySWQiOiIwMGRhNWQ3Y2Y0MTc0OTY2OGFmNTliMjU3YWRkMDI1MiJ9LHsiaWQiOiI5NjgiLCJ0eXBlIjoib3BlcmF0b3IiLCJvcGVyYXRvciI6IisifSx7ImlkIjoiZmNjIiwidHlwZSI6IlBhcmFtIiwidGV4dCI6ImIiLCJsYWJlbCI6Im5ldyIsInZhcklkIjoiMGIzMmRiZGQyYWQyNGY0MmJlYjI3YzQxMmQ1ZDFhMzUifV0sImRhdGUiOiI0LzI1LzIwMjMsIDE6MDM6MjkgUE0iLCJfaWQiOiI2NDQ3NmQzMTMwNjViNTE1ZGE2Mzc3ZTEifSx7ImlkIjoiNGMxMjUzNmQiLCJuYW1lIjoibmV3IGtwaSIsImZvcm11bGEiOlt7ImlkIjoiYWJhIiwidHlwZSI6IlBhcmFtIiwidGV4dCI6ImEiLCJsYWJlbCI6IlZhcl90ZXN0IiwidmFySWQiOiIwMGRhNWQ3Y2Y0MTc0OTY2OGFmNTliMjU3YWRkMDI1MiJ9LHsiaWQiOiI3ZWUiLCJ0eXBlIjoib3BlcmF0b3IiLCJvcGVyYXRvciI6IisifSx7ImlkIjoiMjQ2IiwidHlwZSI6IlBhcmFtIiwidGV4dCI6ImIiLCJsYWJlbCI6Im5ldyIsInZhcklkIjoiMGIzMmRiZGQyYWQyNGY0MmJlYjI3YzQxMmQ1ZDFhMzUifSx7ImlkIjoiOWJhIiwidHlwZSI6Im9wZXJhdG9yIiwib3BlcmF0b3IiOiItIn0seyJpZCI6IjQxZCIsInR5cGUiOiJQYXJhbSIsInRleHQiOiJjIiwibGFiZWwiOiJWYXJfdGVzdDIiLCJ2YXJJZCI6IjhjZDkzMDVlMmUxZjQ0NDVhYWFkN2MwNDAyN2Q3MzEwIn1dLCJkYXRlIjoiNC8yNS8yMDIzLCAyOjQyOjQxIFBNIiwiX2lkIjoiNjQ0Nzg0NzEzMDY1YjUxNWRhNjM3N2ZjIn1dLCJfX3YiOjB9LCJpYXQiOjE2ODI2NTA4MDQsImV4cCI6MTcxNDE4NjgwNH0.xIfWEZZaVIt8DJ3n2PCykIJg79AswMqCfSRrWLOpNbQ"
            }
        }
    },
    historyAlert: [],
}

export const getVar = createAsyncThunk("State/getVar",
    async () => {
        const {data: {variables}}= await axios.get(`http://localhost:4000/Variables`)
        return variables
    }
)

export const getAssets = createAsyncThunk("State/getAssets",
    async () => {
        const {data: {assets}}= await axios.get(`http://localhost:4000/Assets`)
        return assets
    }
)


export const getDatas = createAsyncThunk("State/getDatas",
    async ({variableId, startDate, toDate, timeRange}) => {
        var dataRequest = JSON.stringify({
            "from": `${startDate}`,
            "to": `${toDate}`,
            "calculationTimeRange": timeRange,
            "dataSources": [
              {
                "id": `${variableId}`,
                "type": "Variable",
                "aggregation": "Average"
              }
            ]
          });
          
        var config = {
            method: 'post',
            url: 'http://localhost:4000/CalculateTrend',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : dataRequest
          };
        var {data} = await axios(config);
        return data
    }
)

export const getSingleData = createAsyncThunk("State/singleData",
    async ({variableId, startDate, toDate}) => {
        console.log(variableId, startDate, toDate)
        // const {data}= await axios.get(`http://localhost:4000/Data/00da5d7cf41749668af59b257add0252?from=2023-04-10T01:52:23.933Z&to=2023-04-10T01:52:24.935Z`)
        const {data:{data}}= await axios.get(`http://localhost:4000/Data/${variableId}?from=${startDate}&to=${toDate}`)
        console.log(data)
        return data
    }
)

const StateSlice = createSlice({
    name: "AppState",
    initialState,
    reducers: {
        addDashboard: (state, action) => {state.auth.login.currentUser.dashboards.push(action.payload); return state},
        addWidget: (state, action) => {state.auth.login.currentUser.widgets.push(action.payload); return state},
        addKpi: (state, action) => {state.auth.login.currentUser.kpis.push(action.payload); return state},
        updateWidget: (state, action) => {
            const updateState = current(state.auth.login.currentUser.widgets).map((element) => {
                if ((element.asset == action.payload.asset) && (element.id == action.payload.id) && (element.id_widget == action.payload.id_widget)){
                    if (action.payload.type == 'resize')
                        return {
                            ...element,
                            width: action.payload.width, 
                            height: action.payload.height,
                            ratio: action.payload.ratio,
                        }
                    else {
                        return {
                            ...element,
                            lastX: action.payload.lastX, 
                            lastY: action.payload.lastY,
                        }
                    }
                }
                else
                    return element
            }); 
            state.auth.login.currentUser.widgets = updateState;
        },
        deleteWidget: (state, action) => {
            const updateState = current(state.auth.login.currentUser.widgets).filter((element) => 
                ((element.id != action.payload.id) || (element.id_widget != action.payload.id_widget))) 
            if (updateState[0] == undefined)
                state.auth.login.currentUser.widgets = [];
            else 
                state.auth.login.currentUser.widgets = updateState;

        },
        deleteDashboard: (state, action) => {
            const updateStateDashboards = current(state.auth.login.currentUser.dashboards).filter((element) => (element.id != action.payload.id)) 
            const updateStateWidgets = current(state.auth.login.currentUser.widgets).filter((element) => (element.id != action.payload.id)) 
            state.auth.login.currentUser.dashboards = updateStateDashboards;
            state.auth.login.currentUser.widgets = updateStateWidgets;
        },
        // loginSuccess: (state, action) => {state.auth.login.currentUser = action.payload; return state},
        // logoutSuccess: (state, action) => {state.auth.login.currentUser = null; return state},
        addHistoryAlert: (state, action) => {state.historyAlert.push(action.payload); return state},
        removeHistoryAlert: (state, action) => {
            const updateState = current(state.historyAlert).filter((element) => ((element.id != action.payload.id))); 
            if (updateState[0] == undefined)
                state.historyAlert = [];
            else 
                state.historyAlert = updateState;
        },
        removeKpi: (state, action) => {
            const updateState = current(state.auth.login.currentUser.kpis).filter((element) => ((element.id != action.payload.id))); 
            if (updateState[0] == undefined)
                state.auth.login.currentUser.kpis = [];
            else 
                state.auth.login.currentUser.kpis = updateState;
        },
    },
    extraReducers: (builder) =>{
        builder.addCase(getVar.fulfilled,(state,action)=> {
            // console.log(action.payload);
            state.getVariables = action.payload;
        })
        builder.addCase(getAssets.fulfilled,(state,action)=> {
            // console.log(action.payload);
            state.getAssets = action.payload;
            state.isGetAssets = true;
        })
        builder.addCase(getDatas.fulfilled,(state,action)=> {
            state.getDatas = action.payload;
        })
        builder.addCase(getSingleData.fulfilled,(state,action)=> {
            state.singleData = action.payload[0].values[0].value;
            state.getInitData = true;
        })
        builder.addCase(PURGE, (state) => {
            initialState.removeAll(state);
        });
    },
}) 

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  }
// const rootReducer = combineReducers({all: StateSlice.reducer})
const persistedReducer = persistReducer(persistConfig, StateSlice.reducer)

export const {
        addDashboard, 
        deleteDashboard, 
        addWidget, 
        addKpi, 
        updateWidget, 
        deleteWidget,  
        addHistoryAlert, 
        removeHistoryAlert,
        removeKpi
    } 
    = StateSlice.actions;
export const State = configureStore({
    // reducer: StateSlice.reducer,
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }),
})
  
export let persistor = persistStore(State);
