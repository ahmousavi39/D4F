import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { Akkusativ,Home, Dativ, Genitiv, Nominativ, Random, Repeat, Retry, RightHeaderHome, RightHeader, Info, Settings, LeftHeader, AppInitializer } from './app/components';
import { store } from './app/store';
import { ThemeProvider, useTheme } from './app/theme';

const Stack = createNativeStackNavigator();

function ThemedApp() {
  const { theme } = useTheme();
  const navigationRef = React.useRef();

  return (
    <AppInitializer>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.headerBackground,
            },
            headerTitleStyle: {
              color: theme.headerTitle,
            },
            headerTintColor: theme.headerTitle,
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={Home} 
            options={{
              title: "Die vier Fälle",
              headerRight: () => (<RightHeaderHome />),
            }}
          />
          <Stack.Screen 
            name="Dativ" 
            component={Dativ} 
            options={{
              headerRight: () => (<RightHeader />),
              headerBackVisible: true,
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen 
            name="Akkusativ" 
            component={Akkusativ} 
            options={{
              headerRight: () => (<RightHeader />),
              headerBackVisible: true,
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen 
            name="Genitiv" 
            component={Genitiv} 
            options={{
              headerRight: () => (<RightHeader />),
              headerBackVisible: true,
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen 
            name="Nominativ" 
            component={Nominativ} 
            options={{
              headerRight: () => (<RightHeader />),
              headerBackVisible: true,
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen 
            name="Random" 
            component={Random} 
            options={{
              title: 'Random Mix',
              headerRight: () => (<RightHeader />),
              headerBackVisible: true,
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen 
            name="Repeat" 
            component={Repeat} 
            options={{
              title: 'Wiederholung',
              headerRight: () => (<RightHeader />),
              headerBackVisible: true,
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen 
            name="Retry" 
            component={Retry} 
            options={{
              title: 'Nochmals versuchen',
              headerRight: () => (<RightHeader />),
              headerBackVisible: true,
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen 
            name="Info" 
            component={Info} 
            options={{
              title: 'Info',
            }}
          />
          <Stack.Screen 
            name="Settings" 
            component={Settings} 
            options={{
              title: 'Einstellungen',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppInitializer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </Provider>
  );
}
