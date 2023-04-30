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
            currentUser: {},
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
        loginSuccess: (state, action) => {state.auth.login.currentUser = action.payload; return state},
        logoutSuccess: (state, action) => {state.auth.login.currentUser = null; return state},
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
        loginSuccess, 
        logoutSuccess, 
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
