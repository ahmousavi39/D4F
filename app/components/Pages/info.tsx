import React, { useEffect } from 'react';
import { Pressable, View, StyleSheet, ScrollView } from 'react-native';
import { Text, TouchableHighlight } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { setLanguage } from '../../../features/settings/settingsSlice';
import { resetData } from '../../../features/item/itemSlice';
import { useAppDispatch, useAppSelector } from '../../hook';
import { selectLanguage } from '../../../features/settings/settingsSlice';
import { SelectList } from 'react-native-dropdown-select-list'
import { NominativInfo } from '../Info/nominativ';
import { AkkusativInfo } from '../Info/akkusativ';
import { DativInfo } from '../Info/dativ';
import { GenitivInfo } from '../Info/genitiv';
import { selectTabName } from '../../../features/item/itemSlice';
import {
  useNavigation,
} from '@react-navigation/native';

export function Info() {
  const navigation = useNavigation();
  const tabname = useAppSelector(selectTabName);

  return(
    <ScrollView>
      {navigation.getId() == "Home" ? (<><DativInfo></DativInfo>
    <AkkusativInfo></AkkusativInfo>
    <NominativInfo></NominativInfo>
    <GenitivInfo></GenitivInfo></>) : tabname == "AKKUSATIV" ? <AkkusativInfo></AkkusativInfo> : tabname == "DATIV" ? <DativInfo></DativInfo> : tabname == "GENITIV" ? <GenitivInfo></GenitivInfo> : <NominativInfo></NominativInfo>}
    <DativInfo></DativInfo>
    <AkkusativInfo></AkkusativInfo>
    <NominativInfo></NominativInfo>
    <GenitivInfo></GenitivInfo>
    </ScrollView>
  )
}