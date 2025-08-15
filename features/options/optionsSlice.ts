import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store'

interface optionsState {
    possibleAnswers: ['DER', 'DAS', 'DIE', 'DEN', 'DEM', 'DES'],
    options: string[],
    isLoading: boolean
}

const initialState: optionsState = {
    possibleAnswers: ['DER', 'DAS', 'DIE', 'DEN', 'DEM', 'DES'],
        options: [],
        isLoading: false
}


export const optionsSlice = createSlice({
    name: 'options',
    initialState,
    reducers: {
        generateOptions: (state, action: PayloadAction<string>) => {
            state.isLoading = true;
            const gap = action.payload;
            const randLosungIndex = Math.round(0 + Math.random() * ((3 - 1) - 0));
            state.options = [];

            for (let i = 0; i <= 3; i++) {
                let isUnique;

                if (i != randLosungIndex) {
                    let losungenIndex;

                    do {
                        isUnique = true;
                        losungenIndex = Math.round(0 + Math.random() * ((state.possibleAnswers.length - 1) - 0));
                        for (let u = 0; u <= 3; u++) {
                            if (state.options[u] == state.possibleAnswers[losungenIndex]) {
                                isUnique = false;
                            }
                        }
                    }
                    while (!isUnique);
                    state.options.push(state.possibleAnswers[losungenIndex].toUpperCase())
                }else {
                    state.options.push(gap);
                }
            }
            state.isLoading = false;
        }
    },
   
});

export const { generateOptions } = optionsSlice.actions;

export const selectOptions = (state: RootState) => state.options.options;
export const selectIsOptionsLoading = (state: RootState) => state.options.isLoading;

export default optionsSlice.reducer;