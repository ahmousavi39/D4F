// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, Pressable, Animated, useAnimatedValue, View } from 'react-native';
// import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
// import { Audio } from 'expo-av';

// async function correctSound() {
//     const { sound } = await Audio.Sound.createAsync(
//         require('./correct.mp3')
//     );
//     await sound.playAsync();
// }

// async function wrongSound() {
//     const { sound } = await Audio.Sound.createAsync(
//         require('./wrong.mp3')
//     );
//     await sound.playAsync();
// }

// const QuestionRender = (props: any) => {
//     const { dativ, akkusativ, nominativ, genitiv, random, data, pushData, repeat, retry, isReLoad, reLoad, reGetData, isPending, canReset, cantReset, shouldReset } = props;
//     const [jsonData, setJsonData] = useState(data);

//     const [item, setItem] = useState({ question: "Empty", answer: "Done!", isFalse: true, isTried: true });
//     const [optionen, setOptionen] = useState([]);
//     const [theData, setTheData] = useState([]);
//     const [itemIndex, setItemIndex] = useState(0);
//     const [losungIndex, setLosungIndex] = useState(0);

//     const [isOption0, setIsOption0] = useState(null);
//     const [isOption1, setIsOption1] = useState(null);
//     const [isOption2, setIsOption2] = useState(null);
//     const [isOption3, setIsOption3] = useState(null);

//     const [isDisabled, setIsDisabled] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);

//     const losungen = ['DER', 'DAS', 'DIE', 'DEN', 'DEM', 'DES'];

//     const backgroundColorRef = useAnimatedValue(0);
//     const borderColorRef = useAnimatedValue(0);

//     // 2. The handlers
//     const handlePress = () => {
//         Animated.timing(backgroundColorRef, {
//             toValue: 1,
//             duration: 200,
//             useNativeDriver: true,
//         }).start();
//     };

//     const handleRelease = () => {
//         Animated.timing(backgroundColorRef, {
//             toValue: 0,
//             duration: 30,
//             useNativeDriver: true,
//         }).start();
//     };

//     // Interpolate the background color
//     const backgroundColorCorrect = backgroundColorRef.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['#2196f3', '#008000'],
//     });

//     const backgroundColorFalse = backgroundColorRef.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['#2196f3', '#ff0000'],
//     });

//     // 2. The handlers
//     const handleBorderPress = () => {
//         Animated.timing(borderColorRef, {
//             toValue: 1,
//             duration: 300,
//             useNativeDriver: true,
//         }).start();
//     };

//     const handleBorderRelease = () => {
//         Animated.timing(borderColorRef, {
//             toValue: 0,
//             duration: 60,
//             useNativeDriver: true,
//         }).start();
//     };

//     // Interpolate the background color
//     const borderColorTrue = borderColorRef.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['#ffffff', '#008000'],
//     });

//     const borderColorFalse = borderColorRef.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['#ffffff', '#ff0000'],
//     });

//     const resetResult = () => {
//         setIsOption0(null);
//         setIsOption1(null);
//         setIsOption2(null);
//         setIsOption3(null);
//     }


//     useEffect(() => {
//         setIsLoading(true);
//         cantReset();
//         let partData;
//         let dataLength;
//         let optionenSketch = ['', '', '', ''];
//         let randLosungIndex = Math.round(0 + Math.random() * (0 - 3));
//         let randItemIndex;
//         setLosungIndex(randLosungIndex);
//         setItemIndex(itemIndex);
//         let filtered;
//         let itemClone = item; 

//         if (dativ) {
//             partData = jsonData["dativ"];
//         } else if (akkusativ) {
//             partData = jsonData["akkusativ"];
//         } else if (nominativ) {
//             partData = jsonData["nominativ"];
//         } else if (genitiv) {
//             partData = jsonData["genitiv"];
//         } else {
//             partData = [].concat(jsonData["dativ"], jsonData["akkusativ"], jsonData["nominativ"], jsonData["genitiv"]);
//         }

//         if (repeat) {
//             filtered = partData.filter((item) => (item.isTried));
//         } else if (retry) {
//             filtered = partData.filter((item) => (item.isFalse));
//         } else {
//             filtered = partData.filter((item) => (item.isTried && item.isFalse || !item.isTried));
//         }

//         dataLength = filtered.length - 1;
//         setTheData(filtered);
//         randItemIndex = Math.round(0 + Math.random() * (dataLength - 0));

//         if (filtered.length > 0) {
//             itemClone = filtered[randItemIndex];
//             setItem(itemClone);
//         }

//         optionenSketch[randLosungIndex] = itemClone.answer.toUpperCase();

//         for (let i = 0; i <= 3; i++) {
//             let isUnique;

//             if (i != randLosungIndex) {
//                 let losungenIndex;

//                 do {
//                     isUnique = true;
//                     losungenIndex = Math.round(0 + Math.random() * ((losungen.length - 1) - 0));
//                     for (let u = 0; u <= 3; u++) {
//                         if (optionenSketch[u] == losungen[losungenIndex]) {
//                             isUnique = false;
//                         }
//                     }
//                 }
//                 while (!isUnique);
//                 optionenSketch[i] = losungen[losungenIndex].toUpperCase()
//             }
//         }
//         setOptionen(optionenSketch);
//         setIsDisabled(false);
//         setIsLoading(false);
//     }, [isReLoad]);

//     const updateData = (isSolved: boolean) => {
//         let mainCloneData = theData;

//         mainCloneData[itemIndex].isTried = true;
//         isSolved ? mainCloneData[itemIndex].isFalse = false : mainCloneData[itemIndex].isFalse = true;

//         let updatedData;

//         if (dativ) {
//             updatedData = { ...jsonData, "dativ": mainCloneData };
//         } else if (akkusativ) {
//             updatedData = { ...jsonData, "akkusativ": mainCloneData };
//         } else if (nominativ) {
//             updatedData = { ...jsonData, "nominativ": mainCloneData };
//         } else if (genitiv) {
//             updatedData = { ...jsonData, "genitiv": mainCloneData };
//         } else {
//             updatedData = mainCloneData;
//         }

//         pushData(updatedData);
//     }

//     const showResult = (isSolved: boolean, option: number) => {
//         setIsDisabled(true);
//         if (isSolved) {
//             switch (option) {
//                 case 0:
//                     setIsOption0(true);
//                     break;
//                 case 1:
//                     setIsOption1(true);
//                     break;
//                 case 2:
//                     setIsOption2(true);
//                     break;
//                 default:
//                     setIsOption3(true);
//                     break;
//             }
//         } else {
//             switch (option) {
//                 case 0:
//                     setIsOption0(false);
//                     break;
//                 case 1:
//                     setIsOption1(false);
//                     break;
//                 case 2:
//                     setIsOption2(false);
//                     break;
//                 default:
//                     setIsOption3(false);
//                     break;
//             }
//         }

//     }

//     const onHandle = (title: any, option: number) => {
//         let isSolved = false;
//         title == optionen[losungIndex] ? isSolved = true : isSolved = false;

//         updateData(isSolved);

//         showResult(isSolved, option);

//         handlePress();
//         handleBorderPress();

//         if(isSolved){
//             correctSound();
//             setTimeout(() => {
//                 handleRelease();
//                 handleBorderRelease();
//                 resetResult();
//                 reGetData();
//             }, 2000)
//         }else{
//             wrongSound();
//             canReset();
//         }
//     }

//     return (
//         <>
//             <SafeAreaProvider style={styles.mainClass}>
//                 <Text style={styles.question}>{isLoading || isPending ? "Loading..." : item.question}</Text>

//                 <SafeAreaView style={styles.container}>
//                     <View style={styles.smallContainer}>
//                         <Pressable disabled={isDisabled && shouldReset == false} style={styles.touch} onPress={() => onHandle(optionen[0], 0)}>
//                             <Animated.View style={isOption0 && shouldReset == false ? [styles.button, styles.greenButton, { backgroundColor: backgroundColorCorrect }, { borderColor: borderColorTrue }] : isOption0 == false  && shouldReset == false ? [styles.button, styles.errorButton, { backgroundColor: backgroundColorFalse }, { borderColor: borderColorFalse }] : [styles.button, styles.primaryButton]}>
//                                 <Text style={styles.text}>{optionen[0]}</Text>
//                             </Animated.View>
//                         </Pressable>
//                         <Pressable disabled={isDisabled && shouldReset == false} style={styles.touch} onPress={() => onHandle(optionen[1], 1)}>
//                             <Animated.View style={isOption1 && shouldReset == false ? [styles.button, styles.greenButton, { backgroundColor: backgroundColorCorrect }, { borderColor: borderColorTrue }] : isOption1 == false && shouldReset == false ? [styles.button, styles.errorButton, { backgroundColor: backgroundColorFalse }, { borderColor: borderColorFalse }] : [styles.button, styles.primaryButton]}>
//                                 <Text style={styles.text}>{optionen[1]}</Text>
//                             </Animated.View>
//                         </Pressable>
//                     </View>
//                     <View style={styles.smallContainer}>
//                         <Pressable disabled={isDisabled && shouldReset == false} style={styles.touch} onPress={() => onHandle(optionen[2], 2)}>
//                             <Animated.View style={isOption2 && shouldReset == false ? [styles.button, styles.greenButton, { backgroundColor: backgroundColorCorrect }, { borderColor: borderColorTrue }] : isOption2 == false && shouldReset == false ? [styles.button, styles.errorButton, { backgroundColor: backgroundColorFalse }, { borderColor: borderColorFalse }] : [styles.button, styles.primaryButton]}>
//                                 <Text style={styles.text}>{optionen[2]}</Text>
//                             </Animated.View>
//                         </Pressable>
//                         <Pressable disabled={isDisabled && shouldReset == false} style={styles.touch} onPress={() => onHandle(optionen[3], 3)}>
//                             <Animated.View style={isOption3 && shouldReset == false ? [styles.button, styles.greenButton, { backgroundColor: backgroundColorCorrect }, { borderColor: borderColorTrue }] : isOption3 == false && shouldReset == false ? [styles.button, styles.errorButton, { backgroundColor: backgroundColorFalse }, { borderColor: borderColorFalse }] : [styles.button, styles.primaryButton]}>
//                                 <Text style={styles.text}>{optionen[3]}</Text>
//                             </Animated.View>
//                         </Pressable>
//                     </View>
//                 </SafeAreaView>
//             </SafeAreaProvider>
//         </>
//     );
// };

// let styles = StyleSheet.create({
//     mainClass: {
//         backgroundColor: "white"
//     },
//     touch: {
//         width: "50%"
//     },
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         paddingHorizontal: 10,
//     },
//     smallContainer: {
//         display: "flex",
//         flexDirection: "row",
//         alignItems: "center",
//         width: "100%",
//         height: "20%",
//         padding: 5
//     },
//     title: {
//         fontSize: 32,
//     },
//     errorButton: {
//         borderWidth: 5,
//         borderColor: "#ff0000"

//     },
//     greenButton: {
//         borderWidth: 5,
//         borderColor: "#008000"
//     },
//     primaryButton: {
//         backgroundColor: 'rgb(33, 150, 243)',
//     },
//     button: {
//         alignItems: 'center',
//         padding: 10,
//         margin: 5,
//         height: "100%"
//     },
//     text: {
//         color: "white",
//         marginTop: "auto",
//         marginBottom: "auto",
//     },
//     question: {
//         fontSize: 18,
//         textAlign: "center",
//         paddingTop: "7.5%",
//         backgroundColor: "rgba(221, 221, 221, 0.7)",
//         width: "100%",
//         height: "15%",
//         marginTop: "10%"
//     }
// });

// export {QuestionRender};