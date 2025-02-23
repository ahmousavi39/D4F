import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Pressable, Animated, useAnimatedValue, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { useAppDispatch, useAppSelector } from '../hook';
import { selectIsItemLoading, selectItem, generateItem,  updateData, setIsDisabled, selectIsDisabled } from '../../features/item/itemSlice';
import translate from 'google-translate-api-x';
import { selectLanguage } from '../../features/settings/settingsSlice';
import { getItem } from '../services/AsyncStorage';

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

export function QuestionRender() {
    const dispatch = useAppDispatch();
    const item = useAppSelector(selectItem);
    const question = item.question.split(" ");
    const possibleAnswers = ['DER', 'DAS', 'DIE', 'DEN', 'DEM', 'DES'];
    const isItemLoading = useAppSelector(selectIsItemLoading);
    const isDisabled = useAppSelector(selectIsDisabled);
    const language = useAppSelector(selectLanguage);

    const [isOption0, setIsOption0] = useState(null);
    const [isOption1, setIsOption1] = useState(null);
    const [isOption2, setIsOption2] = useState(null);
    const [isOption3, setIsOption3] = useState(null);

    const [options, setOptions] = useState([]);
    const [isDisabledState, setIsDisabledState] = useState(false);

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
        outputRange: ['#2196f3', '#02b523'],
    });

    const backgroundColorFalse = backgroundColorRef.interpolate({
        inputRange: [0, 1],
        outputRange: ['#2196f3', '#ff0000'],
    });


    const borderColorTrue = borderColorRef.interpolate({
        inputRange: [0, 1],
        outputRange: ['#ffffff', '#02b523'],
    });

    const borderColorFalse = borderColorRef.interpolate({
        inputRange: [0, 1],
        outputRange: ['#ffffff', '#ff0000'],
    });

    const generateOptions = () => {
        const randLosungIndex = Math.round(0 + Math.random() * ((3 - 1) - 0));
        let optionsDraft = [];
        setOptions([]);

        for (let i = 0; i <= 3; i++) {
            let isUnique;

            if (i != randLosungIndex) {
                let losungenIndex;

                do {
                    isUnique = true;
                    losungenIndex = Math.round(0 + Math.random() * ((possibleAnswers.length - 1) - 0));
                    for (let u = 0; u <= 3; u++) {
                        if (optionsDraft[u] == possibleAnswers[losungenIndex]) {
                            isUnique = false;
                        }
                    }
                }
                while (!isUnique);
                optionsDraft.push(possibleAnswers[losungenIndex].toUpperCase())
            } else {
                optionsDraft.push(item.answer);
            }
        }
        setOptions(optionsDraft)
    }


    const generation = () => {
        // dispatch(getData());
        dispatch(generateItem());
        generateOptions();
    }

    useEffect(() => {
        generation()
        resetResult()
    }, [item.answer]);

    useEffect(() => {
        if (!isDisabled) {
            handleRelease();
            setIsDisabledState(false);
            setIsOption0(null);
            setIsOption1(null);
            setIsOption2(null);
            setIsOption3(null);
        } else {
            setIsDisabledState(true);
        }
    }, [isDisabled]);

    const resetResult = () => {
        dispatch(setIsDisabled(false));
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
                resetResult();
                generation()
                handleRelease();

            }, 2000)
        } else {
            wrongSound();
        }
    }

    const tranlate = async (word: string) => {
        if (word !== "___") {
            const filteredWord = word.replace(/[!.?,]/g, "");
            const res = await translate(filteredWord, { from: 'de', to: language.key }).then(res => {
                alert(filteredWord + ": " + res.text)
            });
        }
    }


    return (
        <>
            {isItemLoading || options.length < 3 ? <Text>Loading...</Text> : (
                <SafeAreaProvider style={styles.mainClass}>
                    <View style={styles.question}>
                        <Text style={styles.questionText}>
                            {question.map(word => {
                                return <Text onPress={() => tranlate(word)} key={word}>{word} </Text>
                            })}
                        </Text>
                    </View>
                    <SafeAreaView style={styles.container}>
                        <View style={styles.smallContainer}>
                            <Pressable disabled={isDisabledState} style={styles.touch} onPress={() => onHandle(options[0], 0)}>
                                <Animated.View style={isOption0 ? [styles.button, { backgroundColor: backgroundColorCorrect }, { borderColor: borderColorTrue }] : isOption0 == false ? [styles.button, { backgroundColor: backgroundColorFalse }, { borderColor: borderColorFalse }] : [styles.button]}>
                                    <Text style={styles.text}>{options[0]}</Text>
                                </Animated.View>
                            </Pressable>
                            <Pressable disabled={isDisabledState} style={styles.touch} onPress={() => onHandle(options[1], 1)}>
                                <Animated.View style={isOption1 ? [styles.button, { backgroundColor: backgroundColorCorrect }, { borderColor: borderColorTrue }] : isOption1 == false ? [styles.button, { backgroundColor: backgroundColorFalse }, { borderColor: borderColorFalse }] : [styles.button]}>
                                    <Text style={styles.text}>{options[1]}</Text>
                                </Animated.View>
                            </Pressable>
                        </View>
                        <View style={styles.smallContainer}>
                            <Pressable disabled={isDisabledState} style={styles.touch} onPress={() => onHandle(options[2], 2)}>
                                <Animated.View style={isOption2 ? [styles.button, { backgroundColor: backgroundColorCorrect }, { borderColor: borderColorTrue }] : isOption2 == false ? [styles.button, { backgroundColor: backgroundColorFalse }, { borderColor: borderColorFalse }] : [styles.button]}>
                                    <Text style={styles.text}>{options[2]}</Text>
                                </Animated.View>
                            </Pressable>
                            <Pressable disabled={isDisabledState} style={styles.touch} onPress={() => onHandle(options[3], 3)}>
                                <Animated.View style={isOption3 ? [styles.button, { backgroundColor: backgroundColorCorrect }, { borderColor: borderColorTrue }] : isOption3 == false ? [styles.button, { backgroundColor: backgroundColorFalse }, { borderColor: borderColorFalse }] : [styles.button]}>
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
        height: "100%",
        backgroundColor: 'rgb(33, 150, 243)',

    },
    text: {
        color: "white",
        marginTop: "auto",
        marginBottom: "auto",
    },
    question: {
        backgroundColor: "rgba(221, 221, 221, 0.7)",
        width: "100%",
        height: "15%",
        marginTop: "10%",
        alignItems: "center",
        justifyContent: "center",
    },
    questionText: {
        fontSize: 18,
        textAlign: "center",

        maxWidth: "85%",
        marginRight: "auto",
        marginLeft: "auto"
    }
});