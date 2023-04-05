import axios from "axios"
import { createAsyncThunk, createSlice, configureStore, current } from "@reduxjs/toolkit"

const initialState = {
    getVariables: [],
    getDatas: [],
    getAssets: [],
    isGetAssets: false,
    dashboards: [
        {name: 'overview', type: 'overview', asset: 'edge', id: 'overview'},
        {name: 'add', type: 'add', asset: 'edge', id: 'add'},
    ],
    timerange: ['day','month','year'],
    widgets: [],
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

const StateSlice = createSlice({
    name: "AppState",
    initialState,
    reducers: {
        addDashboard: (state, action) => {state.dashboards.push(action.payload); return state},
        addWidget: (state, action) => {state.widgets.push(action.payload); return state},
        updateWidget: (state, action) => {
            const updateState = current(state.widgets).map((element) => {
                if ((element.asset == action.payload.asset) && (element.id == action.payload.id)){
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
            return {
                ...state,
                widgets: updateState,
            }
        },
        deleteDashboard: (state, action) => {state.dashboards = ['0']; return state},
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
    },
}) 
export const {addDashboard, deleteDashboard, addWidget, updateWidget} = StateSlice.actions;
export const State = configureStore({
    reducer: StateSlice.reducer
})