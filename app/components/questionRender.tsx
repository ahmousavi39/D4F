import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Pressable, Animated, useAnimatedValue, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { useAppDispatch, useAppSelector } from '../hook';
import { generateOptions, selectIsOptionsLoading,selectOptions } from '../../features/options/optionsSlice';
import { selectIsItemLoading, selectItem, generateItem, getData, updateData, setIsDisabled, selectIsDisabled } from '../../features/item/itemSlice';

async function correctSound() {
    const { sound } = await Audio.Sound.createAsync(
        require('../../assets/correct.mp3')
    );
    await sound.playAsync();
}

async function wrongSound() {
    const { sound } = await Audio.Sound.createAsync(
        require('../../assets/wrong.mp3')
    );
    await sound.playAsync();
}

export function QuestionRender(){
    const dispatch = useAppDispatch();
    const item = useAppSelector(selectItem);
    const options = useAppSelector(selectOptions);
    const isItemLoading = useAppSelector(selectIsItemLoading);
    const isOptionsLoading = useAppSelector(selectIsOptionsLoading);
    const isDisabled = useAppSelector(selectIsDisabled);

    const [isOption0, setIsOption0] = useState(null);
    const [isOption1, setIsOption1] = useState(null);
    const [isOption2, setIsOption2] = useState(null);
    const [isOption3, setIsOption3] = useState(null);


    const backgroundColorRef = useAnimatedValue(0);
    const borderColorRef = useAnimatedValue(0);

    const handlePress = () => {
        Animated.timing(backgroundColorRef, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();

        Animated.timing(borderColorRef, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleRelease = () => {
        Animated.timing(backgroundColorRef, {
            toValue: 0,
            duration: 30,
            useNativeDriver: true,
        }).start();

        Animated.timing(borderColorRef, {
            toValue: 0,
            duration: 60,
            useNativeDriver: true,
        }).start();
    };

    const backgroundColorCorrect = backgroundColorRef.interpolate({
        inputRange: [0, 1],
        outputRange: ['#2196f3', '#008000'],
    });

    const backgroundColorFalse = backgroundColorRef.interpolate({
        inputRange: [0, 1],
        outputRange: ['#2196f3', '#ff0000'],
    });


    const borderColorTrue = borderColorRef.interpolate({
        inputRange: [0, 1],
        outputRange: ['#ffffff', '#008000'],
    });

    const borderColorFalse = borderColorRef.interpolate({
        inputRange: [0, 1],
        outputRange: ['#ffffff', '#ff0000'],
    });

    const generation = () => {
        dispatch(getData());
        dispatch(generateItem());
        dispatch(generateOptions(item.answer));
    }

    useEffect(() => {
        generation()
        resetResult()
    }, []);

    const resetResult = () => {
        dispatch(setIsDisabled(false));
        setIsOption0(null);
        setIsOption1(null);
        setIsOption2(null);
        setIsOption3(null);
    }

    const showResult = (isSolved: boolean, option: number) => {
        dispatch(setIsDisabled(true));
        if (isSolved) {
            switch (option) {
                case 0:
                    setIsOption0(true);
                    break;
                case 1:
                    setIsOption1(true);
                    break;
                case 2:
                    setIsOption2(true);
                    break;
                default:
                    setIsOption3(true);
                    break;
            }
        } else {
            switch (option) {
                case 0:
                    setIsOption0(false);
                    break;
                case 1:
                    setIsOption1(false);
                    break;
                case 2:
                    setIsOption2(false);
                    break;
                default:
                    setIsOption3(false);
                    break;
            }
        }

    }

    const onHandle = (title: any, option: number) => {
        let isSolved = title == item.answer ? true : false;

        dispatch(updateData(isSolved));

        showResult(isSolved, option);

        handlePress();

        if (isSolved) {
            correctSound();
            setTimeout(() => {
                handleRelease();
                resetResult();
                generation()
                resetResult();
            }, 2000)
        } else {
            wrongSound();
        }
    }

    return (
        <>


            {isItemLoading || isOptionsLoading ? <Text>Loading...</Text> : (
                <SafeAreaProvider style={styles.mainClass}>
                    <Text style={styles.question}>{item.question}</Text>
                    <SafeAreaView style={styles.container}>
                        <View style={styles.smallContainer}>
                            <Pressable disabled={isDisabled} style={styles.touch} onPress={() => onHandle(options[0], 0)}>
                                <Animated.View style={isOption0 && isDisabled ? [styles.button, styles.greenButton, { backgroundColor: backgroundColorCorrect }, { borderColor: borderColorTrue }] : isOption0 == false && isDisabled ? [styles.button, styles.errorButton, { backgroundColor: backgroundColorFalse }, { borderColor: borderColorFalse }] : [styles.button, styles.primaryButton]}>
                                    <Text style={styles.text}>{options[0]}</Text>
                                </Animated.View>
                            </Pressable>
                            <Pressable disabled={isDisabled} style={styles.touch} onPress={() => onHandle(options[1], 1)}>
                                <Animated.View style={isOption1 && isDisabled ? [styles.button, styles.greenButton, { backgroundColor: backgroundColorCorrect }, { borderColor: borderColorTrue }] : isOption1 == false && isDisabled ? [styles.button, styles.errorButton, { backgroundColor: backgroundColorFalse }, { borderColor: borderColorFalse }] : [styles.button, styles.primaryButton]}>
                                    <Text style={styles.text}>{options[1]}</Text>
                                </Animated.View>
                            </Pressable>
                        </View>
                        <View style={styles.smallContainer}>
                            <Pressable disabled={isDisabled} style={styles.touch} onPress={() => onHandle(options[2], 2)}>
                                <Animated.View style={isOption2 && isDisabled ? [styles.button, styles.greenButton, { backgroundColor: backgroundColorCorrect }, { borderColor: borderColorTrue }] : isOption2 == false && isDisabled ? [styles.button, styles.errorButton, { backgroundColor: backgroundColorFalse }, { borderColor: borderColorFalse }] : [styles.button, styles.primaryButton]}>
                                    <Text style={styles.text}>{options[2]}</Text>
                                </Animated.View>
                            </Pressable>
                            <Pressable disabled={isDisabled} style={styles.touch} onPress={() => onHandle(options[3], 3)}>
                                <Animated.View style={isOption3 && isDisabled ? [styles.button, styles.greenButton, { backgroundColor: backgroundColorCorrect }, { borderColor: borderColorTrue }] : isOption3 == false && isDisabled ? [styles.button, styles.errorButton, { backgroundColor: backgroundColorFalse }, { borderColor: borderColorFalse }] : [styles.button, styles.primaryButton]}>
                                    <Text style={styles.text}>{options[3]}</Text>
                                </Animated.View>
                            </Pressable>
                        </View>
                    </SafeAreaView>
                </SafeAreaProvider>
            )}
        </>
    );
};

let styles = StyleSheet.create({
    mainClass: {
        backgroundColor: "white"
    },
    touch: {
        width: "50%"
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    smallContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: "20%",
        padding: 5
    },
    title: {
        fontSize: 32,
    },
    errorButton: {
        borderWidth: 5,
        borderColor: "#ff0000"

    },
    greenButton: {
        borderWidth: 5,
        borderColor: "#008000"
    },
    primaryButton: {
        backgroundColor: 'rgb(33, 150, 243)',
    },
    button: {
        alignItems: 'center',
        padding: 10,
        margin: 5,
        height: "100%"
    },
    text: {
        color: "white",
        marginTop: "auto",
        marginBottom: "auto",
    },
    question: {
        fontSize: 18,
        textAlign: "center",
        paddingTop: "7.5%",
        backgroundColor: "rgba(221, 221, 221, 0.7)",
        width: "100%",
        height: "15%",
        marginTop: "10%"
    }
});