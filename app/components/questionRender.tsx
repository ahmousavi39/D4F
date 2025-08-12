import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, Pressable, Animated, View, TouchableHighlight } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useAudioPlayer } from 'expo-audio';
import { MaterialIcons } from '@expo/vector-icons';
import { generateItem, updateData, setIsDisabled, selectItem, selectIsItemLoading, selectIsSolved, selectTabName, selectIsDisabled, selectData, selectIsQuestionNotLeft, goToPreviousQuestion, goToNextQuestion, selectHasPreviousQuestion, selectHasNextQuestion } from '../../features/item/itemSlice';
import { generateOptions, selectOptions, selectIsOptionsLoading } from '../../features/options/optionsSlice';
import { selectLanguage } from '../../features/settings/settingsSlice';
import { useAppDispatch, useAppSelector } from '../hook';
import { TappableQuestion } from './TappableQuestion';
// ...existing code...
import { useTheme } from '../theme';

const correctSoundSource = require('../../assets/correct.mp3');
const wrongSoundSource = require('../../assets/wrong.mp3');

export function QuestionRender() {
    const [isOption0, setIsOption0] = useState(null);
    const [isOption1, setIsOption1] = useState(null);
    const [isOption2, setIsOption2] = useState(null);
    const [isOption3, setIsOption3] = useState(null);
    const [isDisabledState, setIsDisabledState] = useState(false);
    const [showResetButton, setShowResetButton] = useState(false);
    const [dynamicOptions, setDynamicOptions] = useState([]);
    // ...existing code...

    const backgroundColorRef = useState(new Animated.Value(0))[0];
    const borderColorRef = useState(new Animated.Value(0))[0];

    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    // Redux selectors
    const item = useAppSelector(selectItem);
    const isItemLoading = useAppSelector(selectIsItemLoading);
    const isSolved = useAppSelector(selectIsSolved);
    const tabName = useAppSelector(selectTabName);
    const isDisabled = useAppSelector(selectIsDisabled);
    const isQuestionNotLeft = useAppSelector(selectIsQuestionNotLeft);
    const staticOptions = useAppSelector(selectOptions);
    const isOptionsLoading = useAppSelector(selectIsOptionsLoading);
    const selectedLanguage = useAppSelector(selectLanguage);
    const hasPreviousQuestion = useAppSelector(selectHasPreviousQuestion);
    const hasNextQuestion = useAppSelector(selectHasNextQuestion);

    const correctPlayer = useAudioPlayer(correctSoundSource);
    const wrongPlayer = useAudioPlayer(wrongSoundSource);

    const styles = useMemo(() => getStyles(theme), [theme]);

    const handlePress = () => {
        Animated.timing(backgroundColorRef, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();

        Animated.timing(borderColorRef, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const handleRelease = () => {
        Animated.timing(backgroundColorRef, {
            toValue: 0,
            duration: 30,
            useNativeDriver: false,
        }).start();

        Animated.timing(borderColorRef, {
            toValue: 0,
            duration: 60,
            useNativeDriver: false,
        }).start();
    };

    const backgroundColorCorrect = backgroundColorRef.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.secondary, theme.true],
    });

    const backgroundColorFalse = backgroundColorRef.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.secondary, theme.error],
    });

    const borderColorTrue = borderColorRef.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.border, theme.true],
    });

    const borderColorFalse = borderColorRef.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.border, theme.error],
    });

    // Dynamic option generation function
    const generateDynamicOptions = (correctAnswer, currentCase) => {
        const allArticles = {
            definite: ['der', 'die', 'das', 'den', 'dem', 'des'],
            indefinite: ['ein', 'eine', 'einer', 'einem', 'eines'],
            welch: ['welcher', 'welche', 'welches', 'welchen', 'welchem'],
            dies: ['dieser', 'diese', 'dieses', 'diesen', 'diesem']
        };

        // Determine the type of answer
        const correctLower = correctAnswer.toLowerCase();
        let articlePool;

        if (correctLower === 'welch') {
            articlePool = allArticles.welch;
        } else if (correctLower === 'dies') {
            articlePool = allArticles.dies;
        } else if (correctLower === 'ein') {
            articlePool = allArticles.indefinite;
        } else {
            // Handle specific forms like "welcher", "dieser", etc.
            if (allArticles.welch.includes(correctLower)) {
                articlePool = allArticles.welch;
            } else if (allArticles.dies.includes(correctLower)) {
                articlePool = allArticles.dies;
            } else if (allArticles.indefinite.includes(correctLower)) {
                articlePool = allArticles.indefinite;
            } else {
                articlePool = allArticles.definite;
            }
        }

        // Convert all articles to uppercase
        const capitalizedPool = articlePool.map(article => article.toUpperCase());
        const capitalizedCorrect = correctAnswer.toUpperCase();

        // Create options array starting with correct answer
        const options = [capitalizedCorrect];

        // Add 3 random incorrect options
        const availableOptions = capitalizedPool.filter(article =>
            article.toLowerCase() !== correctAnswer.toLowerCase()
        );

        while (options.length < 4 && availableOptions.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableOptions.length);
            const selectedOption = availableOptions.splice(randomIndex, 1)[0];
            options.push(selectedOption);
        }

        // Shuffle the options array
        const shuffledOptions = options
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

        return shuffledOptions;
    };

    // ...existing code...

    // Generate item and options when component mounts or tab changes
    useEffect(() => {
        dispatch(generateItem());
    }, [dispatch, tabName]);

    // Generate dynamic options when item changes
    useEffect(() => {
        if (item && item.answer && item.question !== "Done!") {
            const newOptions = generateDynamicOptions(item.answer, tabName);
            setDynamicOptions(newOptions);
        }
    }, [item, tabName]);

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
        setShowResetButton(false);
    };

    const showResult = (isCorrect, option) => {
        dispatch(setIsDisabled(true));
        if (!isCorrect) setShowResetButton(true);

        const setters = [setIsOption0, setIsOption1, setIsOption2, setIsOption3];
        setters[option](isCorrect);
    };

    const normalize = (str) => (str || '').toString().trim().toLowerCase();

    const onHandle = (selectedOption, optionIndex) => {
        const isCorrect = normalize(selectedOption) === normalize(item.answer);
        showResult(isCorrect, optionIndex);
        handlePress();

        // Update the item data in Redux
        dispatch(updateData(isCorrect));

        if (isCorrect) {
            correctPlayer.seekTo(0);
            correctPlayer.play();
            setTimeout(() => {
                dispatch(generateItem());
                handleRelease();
            }, 2000);
        } else {
            wrongPlayer.seekTo(0);
            wrongPlayer.play();
        }
    };

    const resetWrongAnswer = () => {
        resetResult();
        handleRelease();
    };

    const nextQuestion = () => {
        // Reset the UI state when navigating to next question
        resetResult();
        setIsOption0(null);
        setIsOption1(null);
        setIsOption2(null);
        setIsOption3(null);
        
        if (hasNextQuestion) {
            // Navigate to next question in history
            dispatch(goToNextQuestion());
        } else {
            // Generate new question
            dispatch(generateItem());
        }
    };

    const previousQuestion = () => {
        // Reset the UI state when navigating to previous question
        resetResult();
        setIsOption0(null);
        setIsOption1(null);
        setIsOption2(null);
        setIsOption3(null);
        
        dispatch(goToPreviousQuestion());
    };

    if (isItemLoading || isOptionsLoading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    // ...existing code...

    if (isQuestionNotLeft) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
                    <View style={styles.completedContainer}>
                        <Text style={styles.completedTitle}>🎉 Gut gemacht!</Text>
                        <Text style={styles.completedText}>Du hast alle Fragen in dieser Kategorie beantwortet!</Text>
                        <Pressable style={styles.restartButton} onPress={nextQuestion}>
                            <Text style={styles.restartButtonText}>Neu starten</Text>
                        </Pressable>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
                <View style={styles.container}>

                    <View style={styles.questionWrapper}>
                        <TappableQuestion
                            question={item.question}
                            targetLanguage={selectedLanguage.key}
                            style={styles.title}
                        />
                    </View>

                    <View style={styles.optionsContainer}>
                        <View style={styles.optionsRow}>
                            {dynamicOptions.slice(0, 2).map((option, i) => (
                                <TouchableHighlight
                                    key={i}
                                    disabled={isDisabledState}
                                    onPress={() => onHandle(option, i)}
                                    style={styles.touchableHighlight}
                                        underlayColor="transparent" // <-- Add this line to disable highlight color

                                >
                                    <Animated.View
                                        style={[
                                            styles.optionButton,
                                            (i === 0 && isOption0 !== null) && {
                                                backgroundColor: isOption0 ? backgroundColorCorrect : backgroundColorFalse,
                                                borderColor: isOption0 ? borderColorTrue : borderColorFalse
                                            },
                                            (i === 1 && isOption1 !== null) && {
                                                backgroundColor: isOption1 ? backgroundColorCorrect : backgroundColorFalse,
                                                borderColor: isOption1 ? borderColorTrue : borderColorFalse
                                            },
                                        ]}
                                    >
                                        <Text style={styles.optionText}>{option}</Text>
                                    </Animated.View>
                                </TouchableHighlight>
                            ))}
                        </View>
                        <View style={styles.optionsRow}>
                            {dynamicOptions.slice(2, 4).map((option, i) => (
                                <TouchableHighlight
                                    key={i + 2}
                                    disabled={isDisabledState}
                                    onPress={() => onHandle(option, i + 2)}
                                    style={styles.touchableHighlight}
                                        underlayColor="transparent" // <-- Add this line to disable highlight color

                                >
                                    <Animated.View
                                        style={[
                                            styles.optionButton,
                                            (i === 0 && isOption2 !== null) && {
                                                backgroundColor: isOption2 ? backgroundColorCorrect : backgroundColorFalse,
                                                borderColor: isOption2 ? borderColorTrue : borderColorFalse
                                            },
                                            (i === 1 && isOption3 !== null) && {
                                                backgroundColor: isOption3 ? backgroundColorCorrect : backgroundColorFalse,
                                                borderColor: isOption3 ? borderColorTrue : borderColorFalse
                                            },
                                        ]}
                                    >
                                        <Text style={styles.optionText}>{option}</Text>
                                    </Animated.View>
                                </TouchableHighlight>
                            ))}
                        </View>
                    </View>

                    <View style={styles.footer}>
                        {showResetButton && (
                            <Pressable style={styles.retryTextButton} onPress={resetWrongAnswer}>
                                <MaterialIcons name="refresh" size={36} color={theme.background} />
                            </Pressable>
                        )}
                        <Pressable style={styles.nextButton} onPress={nextQuestion}>
                            <MaterialIcons name="navigate-next" size={36} color={theme.primary} />
                        </Pressable>
                        <Pressable
                            style={[styles.backButton, !hasPreviousQuestion && { opacity: 0.3 }]}
                            onPress={previousQuestion}
                            disabled={!hasPreviousQuestion}
                        >
                            <MaterialIcons name="navigate-before" size={36} color={theme.primary} />
                        </Pressable>
                    </View>
                </View>

            </SafeAreaView>
        </SafeAreaProvider>
    );
}

function getStyles(theme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-evenly', // distribute space evenly between question, options, and footer
        },

        questionWrapper: {
            marginBottom: 100, // add bottom margin for bigger gap
            flex: 1, // back to original flex
            alignItems: 'center',
            paddingHorizontal: 10,
            justifyContent: 'center', // center the question vertically in its space
            
        },

        optionsContainer: {
            paddingHorizontal: 20,
            justifyContent: 'center',
            flex: 2, // back to original flex
            marginBottom: 80,
        },

        optionsRow: {
            flexDirection: 'row',
            justifyContent: 'center'
        },

        title: {
            fontSize: 22,
            fontWeight: '600',
            textAlign: 'center',
            marginTop: 20,
            color: theme.text,
            
        },
        touchableHighlight: {
            alignItems: 'center',
            // padding: 10,
            margin: 5,
            width: '50%',
            maxWidth: 250,
            aspectRatio: 1,
            backfaceVisibility: 'hidden',
            color: 'transparent'
        },
        optionButton: {
            backgroundColor: theme.secondary,
            borderWidth: 2,
            borderColor: theme.secondary,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            width: '100%',
            height: '100%',
            borderRadius: 10,
        },
        optionText: {
            color: theme.optionText,
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
        },
        actions: {
            marginTop: 30,
            alignItems: 'center',
            gap: 12,
        },

        retryTextButton: {
            alignSelf: 'center',
            position: 'absolute',
            backgroundColor: theme.error,
            paddingHorizontal: 48,
            paddingVertical: 2,
            borderRadius: 8,
            marginVertical: "auto",
            marginTop: 10

        },
        nextButton: {
            position: 'absolute',
            right: 20,
            backgroundColor: 'transparent',
            marginVertical: "auto",
            marginTop: 12

        },
        backButton: {
            position: 'absolute',
            left: 20,
            backgroundColor: 'transparent',
            marginVertical: "auto",
            marginTop: 12
        },
        footer: {
            width: "100%",
            height: 59,
            backgroundColor: "transparent",
            position: "relative", // changed from absolute to relative
            marginTop: 20, // add some top margin
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        loadingText: {
            fontSize: 18,
            color: theme.text,
        },
        completedContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 40,
        },
        completedTitle: {
            fontSize: 32,
            fontWeight: '700',
            color: theme.true,
            marginBottom: 16,
            textAlign: 'center',
        },
        completedText: {
            fontSize: 18,
            color: theme.text,
            textAlign: 'center',
            marginBottom: 32,
            lineHeight: 24,
        },
        restartButton: {
            backgroundColor: theme.secondary,
            paddingHorizontal: 32,
            paddingVertical: 16,
            borderRadius: 12,
        },
        restartButtonText: {
            color: theme.optionText,
            fontSize: 18,
            fontWeight: '600',
        },
    });
}
