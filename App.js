import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { Akkusativ,Home, Dativ, Genitiv, Nominativ, Random, Repeat, Retry, RightHeaderHome, RightHeader, Info, Settings, LeftHeader } from './app/components';
import { store } from './app/store';
import { createStaticNavigation } from '@react-navigation/native';

export default function App() {

  const MyStack = createNativeStackNavigator({
    screens: {
      Home: {
        screen: () => <Home />,
        options: {
          title: "D4F",
          headerRight: () => (<RightHeaderHome />)
        },
      },
      Dativ: {
        screen: () => <Dativ />,
        options: {
          headerRight: () => (<RightHeader />),
          headerLeft: () => (<LeftHeader />),
          headerTitleAlign: "center"
        }
      },
      Akkusativ: {
        screen: () => <Akkusativ />,
        options: {
          headerRight: () => (<RightHeader />),
          headerLeft: () => (<LeftHeader />),
          headerTitleAlign: "center"
        }
      },
      Genitiv: {
        screen: () => <Genitiv />,
        options: {
          headerRight: () => (<RightHeader />),
          headerLeft: () => (<LeftHeader />),
          headerTitleAlign: "center"
        }
      },
      Nominativ: {
        screen: () => <Nominativ />,
        options: {
          headerRight: () => (<RightHeader />),
          headerLeft: () => (<LeftHeader />),
          headerTitleAlign: "center"
        }
      },
      Random: {
        screen: () => <Random />,
        options: {
          title: 'Random Mix',
          headerRight: () => (<RightHeader />),
          headerLeft: () => (<LeftHeader />),
          headerTitleAlign: "center"
        },
      },
      Retry: {
        screen: () => <Retry />,
        options: {
          title: 'Korrigieren',
          headerRight: () => (<RightHeader />),
          headerLeft: () => (<LeftHeader />),
          headerTitleAlign: "center"
        },
      },
      Repeat: {
        screen: () => <Repeat />,
        options: {
          title: 'Widerholen',
          headerRight: () => (<RightHeader />),
          headerLeft: () => (<LeftHeader />),
          headerTitleAlign: "center"
        }
      },
      Info: {
        screen: () => <Info />,
        options: {
          title: 'Info'
        }
      },
      Settings: {
        screen: () => <Settings />,
        options: {
          title: 'Einstellungen'
        }
      }
    },
  });

  const Navigation = createStaticNavigation(MyStack);

  return (
    <Provider store={store}><Navigation /></Provider>)

}
