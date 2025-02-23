import React from 'react';
import { switchTab } from '../../../features/item/itemSlice';
import { QuestionRender } from '../questionRender';
import { useDispatch } from 'react-redux';

export function Nominativ() {
    const dispatch = useDispatch();
    dispatch(switchTab("NOMINATIV"))

    return (
        <QuestionRender />
    );
}
