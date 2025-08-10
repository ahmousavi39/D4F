import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllKeys, getItem, putItem, removeItem } from '../../app/services/AsyncStorage';
import * as backupData from '../../data.json';
import type { RootState } from '../../app/store'
import {
  useNavigation
} from '@react-navigation/native';

interface itemObjectState {
    id: string; question: string; answer: string; isTried: boolean; isFalse: boolean;
}

type tabNameState = "DATIV" | "AKKUSATIV" | "NOMINATIV" | "GENITIV" | "RANDOM" | "REPEAT" | "RETRY";

interface itemState {
    item: { id: string; question: string; answer: string; isTried: boolean; isFalse: boolean; },
    data: { "nominativ": itemObjectState[]; "genitiv": itemObjectState[]; "dativ": itemObjectState[]; "akkusativ": itemObjectState[]; },
    // partData: itemObjectState[],
    randitemIndex: number,
    isLoading: boolean,
    isSolved: boolean,
    tabName: tabNameState,
    isReseable: boolean,
    isDisabled: boolean,
    dataName: "DATIV" | "AKKUSATIV" | "NOMINATIV" | "GENITIV",
    isQuestionNotLeft: boolean,
    questionHistory: itemObjectState[],
    currentQuestionIndex: number
}

const initialState: itemState = {
    item: { id: "", question: "", answer: "", isFalse: true, isTried: true },
    data: backupData,
    // partData: backupData["dativ"],
    randitemIndex: 0,
    isLoading: false,
    isSolved: false,
    tabName: "DATIV",
    isReseable: false,
    isDisabled: false,
    dataName: "DATIV",
    isQuestionNotLeft: false,
    questionHistory: [],
    currentQuestionIndex: -1
}

export const loadData = createAsyncThunk('data/loadData', async () => {
    if ((await getAllKeys()).includes("data")) {
        const data = await getItem('data');
        return data;
    } else {
        await putItem("data", backupData);
        return backupData;
    }
});

export const itemSlice = createSlice({
    name: 'item',
    initialState,
    reducers: {
        generateItem: (state) => {
            state.isLoading = true;
            state.isReseable = false;
            state.isDisabled = false;
            let partData;

            switch (state.tabName) {
                case "DATIV":
                    partData = state.data.dativ.filter((item) => (item.isTried && item.isFalse || !item.isTried));
                    break;
                case "AKKUSATIV":
                    partData = state.data.akkusativ.filter((item) => (item.isTried && item.isFalse || !item.isTried));
                    break;
                case "NOMINATIV":
                    partData = state.data.nominativ.filter((item) => (item.isTried && item.isFalse || !item.isTried));
                    break;
                case "GENITIV":
                    partData = state.data.genitiv.filter((item) => (item.isTried && item.isFalse || !item.isTried));
                    break;
                case "RANDOM":
                    partData = [].concat(state.data.dativ, state.data.akkusativ, state.data.nominativ, state.data.genitiv).filter((item) => (item.isTried && item.isFalse || !item.isTried));
                    break;
                case "REPEAT":
                    partData = [].concat(state.data.dativ, state.data.akkusativ, state.data.nominativ, state.data.genitiv).filter((item) => (item.isTried));
                    break;
                case "RETRY":
                    partData = [].concat(state.data.dativ, state.data.akkusativ, state.data.nominativ, state.data.genitiv).filter((item) => (item.isFalse));
                    break;
                default:
                    break;
            }

            do {
                state.randitemIndex = Math.round(0 + Math.random() * ((partData.length - 1) - 0));
            } while (partData.length != 1 && partData[state.randitemIndex]?.id == state.item?.id && state.item != undefined);

            if (partData.length > 0) {
                const newItem = { ...partData[state.randitemIndex], answer: partData[state.randitemIndex].answer.toUpperCase() };
                
                // Add current item to history before changing to new item
                if (state.item.id !== "" && state.item.id !== "Done!") {
                    // Remove item if it already exists in history to avoid duplicates
                    state.questionHistory = state.questionHistory.filter(historyItem => historyItem.id !== state.item.id);
                    // Add to end of history
                    state.questionHistory.push(state.item);
                    // Keep only last 10 questions in history
                    if (state.questionHistory.length > 10) {
                        state.questionHistory = state.questionHistory.slice(-10);
                    }
                }
                
                state.item = newItem;
                state.currentQuestionIndex = state.questionHistory.length;

                if (partData[state.randitemIndex].id[0] == "D") {
                    state.dataName = "DATIV"
                } else if (partData[state.randitemIndex].id[0] == "A") {
                    state.dataName = "AKKUSATIV"
                } else if (partData[state.randitemIndex].id[0] == "N") {
                    state.dataName = "NOMINATIV"
                } else {
                    state.dataName = "GENITIV"
                }
            } else {
                state.item = { id: "Done!", question: "Done!", answer: "~_~", isFalse: true, isTried: true };
                state.isQuestionNotLeft = true;
            }
            state.isLoading = false;
        },
        goToPreviousQuestion: (state) => {
            if (state.questionHistory.length > 0) {
                // Get the last question from history
                const previousQuestion = state.questionHistory[state.questionHistory.length - 1];
                
                // Remove it from history
                state.questionHistory = state.questionHistory.slice(0, -1);
                
                // Set it as current item
                state.item = previousQuestion;
                state.currentQuestionIndex = state.questionHistory.length;
                
                // Update dataName based on question ID
                if (previousQuestion.id[0] == "D") {
                    state.dataName = "DATIV"
                } else if (previousQuestion.id[0] == "A") {
                    state.dataName = "AKKUSATIV"
                } else if (previousQuestion.id[0] == "N") {
                    state.dataName = "NOMINATIV"
                } else {
                    state.dataName = "GENITIV"
                }
                
                state.isReseable = false;
                state.isDisabled = false;
            }
        },
        switchTab: (state, action: PayloadAction<tabNameState>) => {
            state.isLoading = true;
            const tabName = action.payload;
            state.tabName = tabName;
            state.isLoading = false;
        },
        setIsQuestionNotLeft: (state, action: PayloadAction<boolean>) => {
            state.isQuestionNotLeft = action.payload;
        },
        updateData: (state, action: PayloadAction<boolean>) => {
            state.isSolved = action.payload;
            state.isReseable = !state.isSolved;
            let itemIndex;

            if (state.dataName == "DATIV") {
                itemIndex = state.data.dativ.findIndex(item => item.id == state.item.id);
                state.data.dativ[itemIndex].isTried = true;
                state.isSolved ? state.data.dativ[itemIndex].isFalse = false : state.data.dativ[itemIndex].isFalse = true;
            } else if (state.dataName == "AKKUSATIV") {
                itemIndex = state.data.akkusativ.findIndex(item => item.id == state.item.id);
                state.data.akkusativ[itemIndex].isTried = true;
                state.isSolved ? state.data.akkusativ[itemIndex].isFalse = false : state.data.akkusativ[itemIndex].isFalse = true;
            } else if (state.dataName == "NOMINATIV") {
                itemIndex = state.data.nominativ.findIndex(item => item.id == state.item.id);
                state.data.nominativ[itemIndex].isTried = true;
                state.isSolved ? state.data.nominativ[itemIndex].isFalse = false : state.data.nominativ[itemIndex].isFalse = true;
            } else if (state.dataName == "GENITIV") {
                itemIndex = state.data.genitiv.findIndex(item => item.id == state.item.id);
                state.data.genitiv[itemIndex].isTried = true;
                state.isSolved ? state.data.genitiv[itemIndex].isFalse = false : state.data.genitiv[itemIndex].isFalse = true;
            }

            const pushData = async () => {
                await putItem('data', state.data);
            }

            pushData();
        },
        setIsDisabled: (state, action: PayloadAction<boolean>) => {
            state.isDisabled = action.payload
        },
        resetData: (state) => {
            state.data = backupData;
            const removeData = async () => {
                await removeItem('data');
                await putItem('data', backupData);
            }

            removeData();
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadData.fulfilled, (state, action) => {
            state.data = action.payload;
        });
    },
});

export const { generateItem, goToPreviousQuestion, updateData, switchTab, setIsDisabled, resetData, setIsQuestionNotLeft } = itemSlice.actions;

export const selectItem = (state: RootState) => state.item.item;
export const selectIsItemLoading = (state: RootState) => state.item.isLoading;
export const selectIsSolved = (state: RootState) => state.item.isSolved;
export const selectTabName = (state: RootState) => state.item.tabName;
export const selectDataName = (state: RootState) => state.item.dataName;
export const selectIsResetable = (state: RootState) => state.item.isReseable;
export const selectIsDisabled = (state: RootState) => state.item.isDisabled;
export const selectData = (state: RootState) => state.item.data;
export const selectIsQuestionNotLeft = (state: RootState) => state.item.isQuestionNotLeft;
export const selectHasPreviousQuestion = (state: RootState) => state.item.questionHistory.length > 0;

export default itemSlice.reducer;