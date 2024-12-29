import React, { useEffect, useCallback } from 'react';
// import { useState } from 'react';
// import { QuestionRender } from './app/components';
// import { getAllKeys, getItem, putItem, removeItem } from './app/services/AsyncStorage';
// import * as backupData from './data.json';
// import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './app/components/home';
import { Pressable, View, StyleSheet, Animated, useAnimatedValue, AppRegistry } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faRotateRight, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { Provider } from 'react-redux';
import { Akkusativ, Dativ, Genitiv, Nominativ, Random, Repeat, Retry } from './app/components';
import { useSelector, useDispatch } from 'react-redux';
import { generateOptions } from './features/options/optionsSlice';
import { selectIsResetable, setIsDisabled } from './features/item/itemSlice';
import { store } from './app/store';

export default function App() {
  const opacityRef = useAnimatedValue(0);
  const dispatch = useDispatch();
  const isResetable = useSelector(selectIsResetable);

  function handleShow() {
    setIsResetable(true);
    Animated.timing(opacityRef, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  function handleHide() {
    setIsResetable(false);
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


  const MyStack = createNativeStackNavigator({
    screens: {
      Home: {
        screen: Home,
        options: {
          title: "D4F",
          headerRight: () => (
            <>
              <Animated.View style={[styles.icon1Container, isResetable ? { opacity: 1 } : { opacity: 0 }]}>
                <Pressable disabled={isResetable} style={styles.button} onPress={() => { dispatch(setIsDisabled(false)) }}
                >
                  <FontAwesomeIcon size={19} icon={faRotateRight} />
                </Pressable>
              </Animated.View>
              <View style={styles.icon2Container}>
                <Pressable style={styles.button} onPress={() => {
                  dispatch(generateItem())
                  dispatch(generateOptions())
                }}>
                  <FontAwesomeIcon size={19} icon={faChevronRight} />
                </Pressable>
              </View>
            </>)
        },
      },
      Dativ: {
        screen: Dativ,
        options: {
          headerRight: () => (
            <>
              <Animated.View style={[styles.icon1Container, isResetable ? { opacity: 1 } : { opacity: 0 }]}>
                <Pressable disabled={isResetable} style={styles.button} onPress={() => { dispatch(setIsDisabled(false)) }}
                >
                  <FontAwesomeIcon size={19} icon={faRotateRight} />
                </Pressable>
              </Animated.View>
              <View style={styles.icon2Container}>
                <Pressable style={styles.button} onPress={() => {
                  dispatch(generateItem())
                  dispatch(generateOptions())
                }}>
                  <FontAwesomeIcon size={19} icon={faChevronRight} />
                </Pressable>
              </View>
            </>)
        }
      },
      Akkusativ: {
        screen: Akkusativ,
        options: {
          headerRight: () => (
            <>
              <Animated.View style={[styles.icon1Container, isResetable ? { opacity: 1 } : { opacity: 0 }]}>
                <Pressable disabled={isResetable} style={styles.button} onPress={() => { dispatch(setIsDisabled(false)) }}
                >
                  <FontAwesomeIcon size={19} icon={faRotateRight} />
                </Pressable>
              </Animated.View>
              <View style={styles.icon2Container}>
                <Pressable style={styles.button} onPress={() => {
                  dispatch(generateItem())
                  dispatch(generateOptions())
                }}>
                  <FontAwesomeIcon size={19} icon={faChevronRight} />
                </Pressable>
              </View>
            </>)
        }
      },
      Genitiv: {
        screen: Genitiv,
        options: {
          headerRight: () => (
            <>
              <Animated.View style={[styles.icon1Container, isResetable ? { opacity: 1 } : { opacity: 0 }]}>
                <Pressable disabled={isResetable} style={styles.button} onPress={() => { dispatch(setIsDisabled(false)) }}
                >
                  <FontAwesomeIcon size={19} icon={faRotateRight} />
                </Pressable>
              </Animated.View>
              <View style={styles.icon2Container}>
                <Pressable style={styles.button} onPress={() => {
                  dispatch(generateItem())
                  dispatch(generateOptions())
                }}>
                  <FontAwesomeIcon size={19} icon={faChevronRight} />
                </Pressable>
              </View>
            </>)
        }
      },
      Nominativ: {
        screen: Nominativ,
        options: {
          headerRight: () => (
            <>
              <Animated.View style={[styles.icon1Container, isResetable ? { opacity: 1 } : { opacity: 0 }]}>
                <Pressable disabled={isResetable} style={styles.button} onPress={() => { dispatch(setIsDisabled(false)) }}
                >
                  <FontAwesomeIcon size={19} icon={faRotateRight} />
                </Pressable>
              </Animated.View>
              <View style={styles.icon2Container}>
                <Pressable style={styles.button} onPress={() => {
                  dispatch(generateItem())
                  dispatch(generateOptions())
                }}>
                  <FontAwesomeIcon size={19} icon={faChevronRight} />
                </Pressable>
              </View>
            </>)
        }
      },
      Random: {
        screen: Random,
        options: {
          title: 'Random Mix',
          headerRight: () => (
            <>
              <Animated.View style={[styles.icon1Container, isResetable ? { opacity: 1 } : { opacity: 0 }]}>
                <Pressable disabled={isResetable} style={styles.button} onPress={() => { dispatch(setIsDisabled(false)) }}
                >
                  <FontAwesomeIcon size={19} icon={faRotateRight} />
                </Pressable>
              </Animated.View>
              <View style={styles.icon2Container}>
                <Pressable style={styles.button} onPress={() => {
                  dispatch(generateItem())
                  dispatch(generateOptions())
                }}>
                  <FontAwesomeIcon size={19} icon={faChevronRight} />
                </Pressable>
              </View>
            </>)
        },
      },
      Retry: {
        screen: Retry,
        options: {
          title: 'Korrigieren',
          headerRight: () => (
            <>
              <Animated.View style={[styles.icon1Container, isResetable ? { opacity: 1 } : { opacity: 0 }]}>
                <Pressable disabled={isResetable} style={styles.button} onPress={() => { dispatch(setIsDisabled(false)) }}
                >
                  <FontAwesomeIcon size={19} icon={faRotateRight} />
                </Pressable>
              </Animated.View>
              <View style={styles.icon2Container}>
                <Pressable style={styles.button} onPress={() => {
                  dispatch(generateItem())
                  dispatch(generateOptions())
                }}>
                  <FontAwesomeIcon size={19} icon={faChevronRight} />
                </Pressable>
              </View>
            </>)
        },
      },
      Repeat: {
        screen: Repeat,
        options: {
          title: 'Widerholen',
          headerRight: () => (
            <>
              <Animated.View style={[styles.icon1Container, isResetable ? { opacity: 1 } : { opacity: 0 }]}>
                <Pressable disabled={isResetable} style={styles.button} onPress={() => { dispatch(setIsDisabled(false)) }}
                >
                  <FontAwesomeIcon size={19} icon={faRotateRight} />
                </Pressable>
              </Animated.View>
              <View style={styles.icon2Container}>
                <Pressable style={styles.button} onPress={() => {
                  dispatch(generateItem())
                  dispatch(generateOptions())
                }}>
                  <FontAwesomeIcon size={19} icon={faChevronRight} />
                </Pressable>
              </View>
            </>)
        }
      }
    },
  });

  const Navigation = createStaticNavigation(MyStack);

  return (
    <Provider store={store}><Navigation /></Provider>)

}


let styles = StyleSheet.create({
  icon1Container: {
    paddingRight: "10%"
  },
  icon2Container: {
    paddingLeft: "10%",
  },
  button: {
    padding: 0,
    margin: 0,
  }
});