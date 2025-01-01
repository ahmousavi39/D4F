import React  from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './app/components/home';
import { Provider } from 'react-redux';
import { Akkusativ, Dativ, Genitiv, Nominativ, Random, Repeat, Retry } from './app/components';
import { RightHeader } from './app/components/rightHeader';
import { store } from './app/store';
import { createStaticNavigation } from '@react-navigation/native';

export default function App() {

  const MyStack = createNativeStackNavigator({
    screens: {
      Home: {
        screen: () => <Home />,
        options: {
          title: "D4F"
        },
      },
      Dativ: {
        screen: () => <Dativ />,
        options: {
          headerRight: () => (<RightHeader />)
        }
      },
      Akkusativ: {
        screen: () => <Akkusativ />,
        options: {
          headerRight: () => (<RightHeader />)
        }
      },
      Genitiv: {
        screen: () => <Genitiv />,
        options: {
          headerRight: () => (<RightHeader />)
        }
      },
      Nominativ: {
        screen: () => <Nominativ />,
        options: {
          headerRight: () => (<RightHeader />)
        }
      },
      Random: {
        screen: () => <Random />,
        options: {
          title: 'Random Mix',
          headerRight: () => (<RightHeader />)
        },
      },
      Retry: {
        screen: () => <Retry />,
        options: {
          title: 'Korrigieren',
          headerRight: () => (<RightHeader />)
        },
      },
      Repeat: {
        screen: () => <Repeat />,
        options: {
          title: 'Widerholen',
          headerRight: () => (<RightHeader />)
        }
      }
    },
  });

  const Navigation = createStaticNavigation(MyStack);

  return (
    <Provider store={store}><Navigation /></Provider>)

}
