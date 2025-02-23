import React from 'react';
import { Pressable, View, StyleSheet, Animated, useAnimatedValue, AppRegistry, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faRotateRight, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useAppDispatch, useAppSelector } from '../hook';
import { selectIsResetable, generateItem, setIsDisabled } from '../../features/item/itemSlice';
import { generateOptions } from '../../features/options/optionsSlice';

export function RightHeader() {
      const opacityRef = useAnimatedValue(0);
      const dispatch = useAppDispatch();
      const isResetable = useAppSelector(selectIsResetable);
    
      function handleShow() {
        Animated.timing(opacityRef, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      };
    
      function handleHide() {
        Animated.timing(opacityRef, {
          toValue: 0,
          duration: 30,
          useNativeDriver: true,
        }).start();
      };
    
      const resetOpcity = opacityRef.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      });
      

    return (
        <>
            <View style={[styles.icon1Container, isResetable ? { opacity: 1 } : { opacity: 0 }]}>
                <Pressable disabled={!isResetable} style={styles.button} onPress={() => { dispatch(setIsDisabled(false)) }}
                >
                    <FontAwesomeIcon size={19} icon={faRotateRight} />
                </Pressable>
            </View>
            <View style={styles.icon2Container}>
                <Pressable style={styles.button} onPress={() => {
                    dispatch(generateItem())
                    dispatch(generateOptions())
                }}>
                    <FontAwesomeIcon size={19} icon={faChevronRight} />
                </Pressable>
            </View>
        </>
    );
}

let styles = StyleSheet.create({
    icon1Container: {
      paddingRight: 10
    },
    icon2Container: {
      paddingLeft: 10,
    },
    button: {
      padding: 0,
      margin: 0,
    }
  });