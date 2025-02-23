import React from 'react';
import { switchTab } from '../../../features/item/itemSlice';
import { QuestionRender } from '../questionRender';
import { useDispatch } from 'react-redux';

export function Random() {
    const dispatch = useDispatch();
    dispatch(switchTab("RANDOM"))

    return (
        <QuestionRender />
    );
}
