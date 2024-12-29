import React from 'react';
import { switchTab } from '../../features/item/itemSlice';
import { QuestionRender } from './questionRender';
import { useDispatch } from 'react-redux';

export function Dativ() {
    const dispatch = useDispatch();
    dispatch(switchTab("DATIV"))

    return (
        <QuestionRender />
    );
}
