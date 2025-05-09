import React from 'react';
import { ScrollView } from 'react-native';
import {  useAppSelector } from '../../hook';
import { NominativInfo } from '../Info/nominativ';
import { AkkusativInfo } from '../Info/akkusativ';
import { DativInfo } from '../Info/dativ';
import { GenitivInfo } from '../Info/genitiv';
import { selectDataName } from '../../../features/item/itemSlice';
import {
  useNavigation,
} from '@react-navigation/native';

export function Info() {
  const navigation = useNavigation();
  const dataName = useAppSelector(selectDataName);

  return(
    <ScrollView>
      {navigation.getId() == "Home" ? (<><DativInfo></DativInfo>
    <AkkusativInfo></AkkusativInfo>
    <NominativInfo></NominativInfo>
    <GenitivInfo></GenitivInfo></>) : dataName == "AKKUSATIV" ? <AkkusativInfo></AkkusativInfo> : dataName == "DATIV" ? <DativInfo></DativInfo> : dataName == "GENITIV" ? <GenitivInfo></GenitivInfo> : <NominativInfo></NominativInfo>}
    </ScrollView>
  )
}