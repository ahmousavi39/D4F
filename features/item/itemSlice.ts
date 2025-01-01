import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllKeys, getItem, putItem, removeItem } from '../../app/services/AsyncStorage';
import * as backupData from '../../data.json';
import type { RootState } from '../../app/store'

interface itemObjectState {
    id: string; question: string; answer: string; isTried: boolean; isFalse: boolean;
}

type tabNameState = "DATIV" | "AKKUSATIV" | "NOMINATIV" | "GENITIV" | "RANDOM" | "REPEAT" | "RETRY";

interface itemState {
    item: { id: string; question: string; answer: string; isTried: boolean; isFalse: boolean; },
    data: { "nominativ": itemObjectState[]; "genitiv": itemObjectState[]; "dativ": itemObjectState[]; "akkusativ": itemObjectState[]; },
    partData: itemObjectState[],
    randItemIndex: number,
    isLoading: boolean,
    isSolved: boolean,
    tabName: tabNameState,
    isReseable: boolean,
    isDisabled: boolean
}

const initialState: itemState = {
    item: { id: "", question: "Empty", answer: "Done!", isFalse: true, isTried: true },
    data: backupData,
    partData: backupData["dativ"],
    randItemIndex: 0,
    isLoading: false,
    isSolved: false,
    tabName: "DATIV",
    isReseable: false,
    isDisabled: false
}

export const itemSlice = createSlice({
    name: 'item',
    initialState,
    reducers: {
        generateItem: (state) => {
            state.isLoading = true;
            state.isReseable = false;
            switch (state.tabName) {
                case "DATIV":
                    state.partData = state.data["dativ"].filter((item) => (item.isTried && item.isFalse || !item.isTried));
                    break;
                case "AKKUSATIV":
                    state.partData = state.data["akkusativ"].filter((item) => (item.isTried && item.isFalse || !item.isTried));
                    break;
                case "NOMINATIV":
                    state.partData = state.data["nominativ"].filter((item) => (item.isTried && item.isFalse || !item.isTried));
                    break;
                case "GENITIV":
                    state.partData = state.data["genitiv"].filter((item) => (item.isTried && item.isFalse || !item.isTried));
                    break;
                case "RANDOM":
                    state.partData = [].concat(state.data["dativ"], state.data["akkusativ"], state.data["nominativ"], state.data["genitiv"]).filter((item) => (item.isTried && item.isFalse || !item.isTried));;
                    break;
                case "REPEAT":
                    state.partData = [].concat(state.data["dativ"], state.data["akkusativ"], state.data["nominativ"], state.data["genitiv"]).filter((item) => (item.isTried));
                    break;
                case "RETRY":
                    state.partData = [].concat(state.data["dativ"], state.data["akkusativ"], state.data["nominativ"], state.data["genitiv"]).filter((item) => (item.isFalse));
                    break;
                default:
                    break;
            }

            state.randItemIndex = Math.round(0 + Math.random() * ((state.partData.length - 1) - 0));

            if (state.partData.length > 0) {
                state.item = state.partData[state.randItemIndex];
            }
            state.isLoading = false;
        },
        switchTab: (state, action: PayloadAction<tabNameState>) => {
            state.isLoading = true;
            const tabName = action.payload;
            state.tabName = tabName;
            state.isLoading = false;
        },
        getData: (state) => {
            state.isLoading = true;

            const handleData = async () => {
                const savedData = await getAllKeys();

                if (!savedData.includes("data")) {
                    await putItem('data', JSON.stringify(backupData));
                }
                state.data = JSON.parse(await getItem('data'));
                state.isLoading = false;
            }

            handleData();
        },
        updateData: (state, action : PayloadAction<boolean>) => {
            state.isSolved = action.payload;
            state.isReseable = !state.isSolved
            state.partData[state.randItemIndex].isTried = true;
            state.isSolved ? state.partData[state.randItemIndex].isFalse = false : state.partData[state.randItemIndex].isFalse = true;

            if (state.item.id[0] == "D") {
                state.data = { ...state.data, "dativ": state.partData };
            } else if (state.item.id[0] == "A") {
                state.data = { ...state.data, "akkusativ": state.partData };
            } else if (state.item.id[0] == "N") {
                state.data = { ...state.data, "nominativ": state.partData };
            } else if (state.item.id[0] == "G") {
                state.data = { ...state.data, "genitiv": state.partData };
            }

            const pushData = async () => {
                await removeItem('data');
                await putItem('data', state.data);
            }
            
            pushData();
        },
        setIsDisabled: (state, action: PayloadAction<boolean>) => {
            state.isDisabled = action.payload
        }
    },
});

export const { generateItem, getData, updateData, switchTab, setIsDisabled } = itemSlice.actions;

export const selectItem = (state: RootState) => state.item.item;
export const selectIsItemLoading = (state: RootState) => state.item.isLoading;
export const selectIsSolved = (state: RootState) => state.item.isSolved;
export const selectTabName = (state: RootState) => state.item.tabName;
export const selectIsResetable = (state: RootState) => state.item.isReseable;
export const selectIsDisabled = (state: RootState) => state.item.isDisabled;

export default itemSlice.reducer;