import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllKeys, getItem, putItem, removeItem, clear } from '../../app/services/AsyncStorage';
import * as backupData from '../../data.json';
import type { RootState } from '../../app/store'
import {
  useNavigation
} from '@react-navigation/native';

interface itemObjectState {
    id: string; sentence: string; gap: string; isTried: boolean; isFalse: boolean;
}

type tabNameState = "DATIV" | "AKKUSATIV" | "NOMINATIV" | "GENITIV" | "RANDOM" | "REPEAT" | "RETRY";

interface itemState {
    item: { id: string; sentence: string; gap: string; isTried: boolean; isFalse: boolean; },
    data: { "nominativ": itemObjectState[]; "genetiv": itemObjectState[]; "dativ": itemObjectState[]; "akkusativ": itemObjectState[]; },
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
    item: { id: "", sentence: "", gap: "", isFalse: true, isTried: true },
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
        
        // Migrate old data format to new format if needed
        const migrateData = (dataObj) => {
            if (!dataObj || typeof dataObj !== 'object') return backupData;
            
            const migratedData = { ...dataObj };
            
            // Check each category for old format and migrate
            ['nominativ', 'akkusativ', 'dativ', 'genetiv'].forEach(category => {
                if (Array.isArray(migratedData[category])) {
                    migratedData[category] = migratedData[category].map(item => {
                        if (item && typeof item === 'object') {
                            // If item has old field names, migrate them
                            if (item.question && !item.sentence) {
                                return {
                                    ...item,
                                    sentence: item.question,
                                    gap: item.answer || item.gap,
                                    // Remove old fields
                                    question: undefined,
                                    answer: undefined
                                };
                            }
                        }
                        return item;
                    });
                }
            });
            
            return migratedData;
        };
        
        const migratedData = migrateData(data);
        
        // Save the migrated data back to AsyncStorage
        await putItem("data", migratedData);
        
        return migratedData;
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

            // Ensure data arrays exist and are arrays
            if (!state.data || typeof state.data !== 'object') {
                console.error('Data not loaded properly');
                state.item = { id: "Error", sentence: "Data not loaded", gap: "Error", isFalse: true, isTried: true };
                state.isLoading = false;
                return;
            }

            const safeFilterArray = (array) => {
                if (!Array.isArray(array)) return [];
                return array.filter((item) => item && typeof item === 'object' && item.id && item.sentence && item.gap);
            };

            switch (state.tabName) {
                case "DATIV":
                    partData = safeFilterArray(state.data.dativ).filter((item) => item && (item.isTried && item.isFalse || !item.isTried));
                    break;
                case "AKKUSATIV":
                    partData = safeFilterArray(state.data.akkusativ).filter((item) => item && (item.isTried && item.isFalse || !item.isTried));
                    break;
                case "NOMINATIV":
                    partData = safeFilterArray(state.data.nominativ).filter((item) => item && (item.isTried && item.isFalse || !item.isTried));
                    break;
                case "GENITIV":
                    partData = safeFilterArray(state.data.genetiv).filter((item) => item && (item.isTried && item.isFalse || !item.isTried));
                    break;
                case "RANDOM":
                    const allData = [].concat(
                        safeFilterArray(state.data.dativ), 
                        safeFilterArray(state.data.akkusativ), 
                        safeFilterArray(state.data.nominativ), 
                        safeFilterArray(state.data.genetiv)
                    );
                    partData = allData.filter((item) => item && (item.isTried && item.isFalse || !item.isTried));
                    break;
                case "REPEAT":
                    const allDataRepeat = [].concat(
                        safeFilterArray(state.data.dativ), 
                        safeFilterArray(state.data.akkusativ), 
                        safeFilterArray(state.data.nominativ), 
                        safeFilterArray(state.data.genetiv)
                    );
                    partData = allDataRepeat.filter((item) => item && item.isTried);
                    break;
                case "RETRY":
                    const allDataRetry = [].concat(
                        safeFilterArray(state.data.dativ), 
                        safeFilterArray(state.data.akkusativ), 
                        safeFilterArray(state.data.nominativ), 
                        safeFilterArray(state.data.genetiv)
                    );
                    partData = allDataRetry.filter((item) => item && item.isFalse);
                    break;
                default:
                    partData = [];
                    break;
            }

            if (partData.length > 0) {
                do {
                    state.randitemIndex = Math.round(0 + Math.random() * ((partData.length - 1) - 0));
                } while (partData.length != 1 && partData[state.randitemIndex]?.id == state.item?.id && state.item != undefined);
            } else {
                state.randitemIndex = 0;
            }

            if (partData.length > 0 && state.randitemIndex < partData.length) {
                const selectedItem = partData[state.randitemIndex];
                if (selectedItem) {
                    const newItem = { ...selectedItem, gap: selectedItem.gap.toUpperCase() };
                    
                    // Add current item to history before changing to new item
                    if (state.item.id !== "" && state.item.id !== "Done!") {
                        // If we're not at the end of history, truncate it to current position
                        if (state.currentQuestionIndex < state.questionHistory.length) {
                            state.questionHistory = state.questionHistory.slice(0, state.currentQuestionIndex);
                        }
                        
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

                    if (selectedItem.id[0] == "D") {
                        state.dataName = "DATIV"
                    } else if (selectedItem.id[0] == "A") {
                        state.dataName = "AKKUSATIV"
                    } else if (selectedItem.id[0] == "N") {
                        state.dataName = "NOMINATIV"
                    } else {
                        state.dataName = "GENITIV"
                    }
                } else {
                    state.item = { id: "Done!", sentence: "Done!", gap: "~_~", isFalse: true, isTried: true };
                    state.isQuestionNotLeft = true;
                }
            } else {
                state.item = { id: "Done!", sentence: "Done!", gap: "~_~", isFalse: true, isTried: true };
                state.isQuestionNotLeft = true;
            }
            state.isLoading = false;
        },
        goToPreviousQuestion: (state) => {
            if (state.currentQuestionIndex > 0) {
                // Add current item to forward history if not already there
                if (state.currentQuestionIndex === state.questionHistory.length) {
                    state.questionHistory.push(state.item);
                }
                
                // Move to previous question
                state.currentQuestionIndex--;
                const previousQuestion = state.questionHistory[state.currentQuestionIndex];
                
                // Set it as current item
                state.item = previousQuestion;
                
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
        goToNextQuestion: (state) => {
            if (state.currentQuestionIndex < state.questionHistory.length - 1) {
                // Move to next question in history
                state.currentQuestionIndex++;
                const nextQuestion = state.questionHistory[state.currentQuestionIndex];
                
                // Set it as current item
                state.item = nextQuestion;
                
                // Update dataName based on question ID
                if (nextQuestion.id[0] == "D") {
                    state.dataName = "DATIV"
                } else if (nextQuestion.id[0] == "A") {
                    state.dataName = "AKKUSATIV"
                } else if (nextQuestion.id[0] == "N") {
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
                if (itemIndex !== -1) {
                    state.data.dativ[itemIndex].isTried = true;
                    state.isSolved ? state.data.dativ[itemIndex].isFalse = false : state.data.dativ[itemIndex].isFalse = true;
                }
            } else if (state.dataName == "AKKUSATIV") {
                itemIndex = state.data.akkusativ.findIndex(item => item.id == state.item.id);
                if (itemIndex !== -1) {
                    state.data.akkusativ[itemIndex].isTried = true;
                    state.isSolved ? state.data.akkusativ[itemIndex].isFalse = false : state.data.akkusativ[itemIndex].isFalse = true;
                }
            } else if (state.dataName == "NOMINATIV") {
                itemIndex = state.data.nominativ.findIndex(item => item.id == state.item.id);
                if (itemIndex !== -1) {
                    state.data.nominativ[itemIndex].isTried = true;
                    state.isSolved ? state.data.nominativ[itemIndex].isFalse = false : state.data.nominativ[itemIndex].isFalse = true;
                }
            } else if (state.dataName == "GENITIV") {
                itemIndex = state.data.genetiv.findIndex(item => item.id == state.item.id);
                if (itemIndex !== -1) {
                    state.data.genetiv[itemIndex].isTried = true;
                    state.isSolved ? state.data.genetiv[itemIndex].isFalse = false : state.data.genetiv[itemIndex].isFalse = true;
                }
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
                // Clear all AsyncStorage to ensure clean state
                await clear();
                await putItem('data', backupData);
            }

            removeData();
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadData.fulfilled, (state, action) => {
            const data = action.payload;
            
            // Additional validation to ensure all items have the correct structure
            const validateItem = (item) => {
                return item && 
                       typeof item === 'object' && 
                       typeof item.id === 'string' && 
                       typeof item.sentence === 'string' && 
                       typeof item.gap === 'string' && 
                       typeof item.isTried === 'boolean' && 
                       typeof item.isFalse === 'boolean';
            };
            
            // Validate that the loaded data has the expected structure
            if (data && typeof data === 'object' && 
                Array.isArray(data.nominativ) && 
                Array.isArray(data.akkusativ) && 
                Array.isArray(data.dativ) && 
                Array.isArray(data.genetiv)) {
                
                // Double-check that all items in arrays have correct structure
                const allValid = ['nominativ', 'akkusativ', 'dativ', 'genetiv'].every(category =>
                    data[category].every(validateItem)
                );
                
                if (allValid) {
                    state.data = data;
                } else {
                    console.error('Some items have invalid structure, using backup data');
                    state.data = backupData;
                }
            } else {
                console.error('Invalid data structure loaded, using backup data');
                state.data = backupData;
            }
        });
    },
});

export const { generateItem, goToPreviousQuestion, goToNextQuestion, updateData, switchTab, setIsDisabled, resetData, setIsQuestionNotLeft } = itemSlice.actions;

export const selectItem = (state: RootState) => state.item.item;
export const selectIsItemLoading = (state: RootState) => state.item.isLoading;
export const selectIsSolved = (state: RootState) => state.item.isSolved;
export const selectTabName = (state: RootState) => state.item.tabName;
export const selectDataName = (state: RootState) => state.item.dataName;
export const selectIsResetable = (state: RootState) => state.item.isReseable;
export const selectIsDisabled = (state: RootState) => state.item.isDisabled;
export const selectData = (state: RootState) => state.item.data;
export const selectIsQuestionNotLeft = (state: RootState) => state.item.isQuestionNotLeft;
export const selectHasPreviousQuestion = (state: RootState) => state.item.currentQuestionIndex > 0;
export const selectHasNextQuestion = (state: RootState) => state.item.currentQuestionIndex < state.item.questionHistory.length - 1;

export default itemSlice.reducer;