import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getItem, putItem } from './services/AsyncStorage';

const LightTheme = {
    background: '#f3f3f3ff',
    text: '#111827',
    border: '#f3f3f3ff',
    primary: '#7c3aed',
    secondary: '#3b82f6',
    true: '#16a34a',
    error: '#dc2626',
    disBackground: 'rgba(0, 0, 0, 0.5)',
    card: '#fc4848e0',
    cardText: '#f9fafb',
    inputText: 'rgba(0, 0, 0, 0.5)',
    inputBorder: '#cbd5e1',
    inputBackground: '#ffffff',
    shadow: 'rgba(0, 0, 0, 0.08)',
    progress: '#16a34a',
    progressWrapper: '#e5e7eb',
    headerBackground: '#ffffff',
    headerTitle: '#111827',
    sectionBackground: '#ffffffff',
    sectionSelectedBackground: '#f3f3f3ff',
    optionText: '#ffffff',
    dativ: '#fc4848e0',
    akkusativ: '#b948fce0',
    nominativ: '#48e15ee0',
    genitiv: '#007AFF',
    random:  '#5D6D7E'
};

const DarkTheme = {
    background: '#0f172a',
    text: '#f8fafc',
    border: '#0f172a',
    true: '#48e15ee0',
    primary: '#a78bfa',
    secondary: '#ffffffff',
    error: '#ff4a4aff',
    disBackground: 'rgba(0, 0, 0, 0.5)',
    card: '#1e293b',
    cardText: '#f8fafc',
    inputBorder: '#475569',
    inputBackground: '#1e293b',
    shadow: 'rgba(0, 0, 0, 0.4)',
    progress: '#22c55e',
    progressWrapper: '#1f2937',
    inputText: 'rgba(255, 255, 255, 0.5)',
    headerBackground: '#1e293b',
    headerTitle: '#f8fafc',
    sectionBackground: '#1e293b',
    sectionSelectedBackground: '#0f172a',
    optionText: '#0f172a',
    dativ: '#fc4848e0',
    akkusativ: '#b948fce0',
    nominativ: '#48e15ee0',
    genitiv: '#007AFF',
    random: '#5D6D7E'
};


const ThemeContext = createContext({
    theme: LightTheme,
    mode: 'light',
    setMode: (mode: 'light' | 'dark' | 'system') => { },
    isLoading: true,
});

export function ThemeProvider({ children }) {
    const systemScheme = useColorScheme();
    const [mode, setMode] = useState<'light' | 'dark' | 'system'>('system');
    const [isLoading, setIsLoading] = useState(true);

    // Load theme from storage on app startup
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedMode = await getItem('theme_mode');
                if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
                    setMode(savedMode);
                }
            } catch (error) {
                console.error('Error loading theme:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadTheme();
    }, []);

    // Save theme to storage whenever it changes
    const handleSetMode = async (newMode: 'light' | 'dark' | 'system') => {
        try {
            await putItem('theme_mode', newMode);
            setMode(newMode);
        } catch (error) {
            console.error('Error saving theme:', error);
            // Still set the mode even if saving fails
            setMode(newMode);
        }
    };

    const theme = useMemo(() => {
        const resolved = mode === 'system' ? systemScheme : mode;
        return resolved === 'dark' ? DarkTheme : LightTheme;
    }, [mode, systemScheme]);

    return (
        <ThemeContext.Provider value={{ theme, mode, setMode: handleSetMode, isLoading }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
