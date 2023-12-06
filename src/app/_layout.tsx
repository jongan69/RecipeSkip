import React, { useState } from "react";
import { LogBox, Platform } from 'react-native';
import { Slot, Stack } from 'expo-router';

import {
  ThemeProvider,
  DarkTheme,
  useTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { ThemeContext } from "../theme/Theme";
import themes from "../theme/Themes";

import { SessionProvider } from '../auth/ctx';
import { MagicTools } from "../auth/magicSdk";

import useCachedResources from "../resources/hooks/useCachedResources";
import WebNavbar from "../components/web/Navbar.web";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';
LogBox.ignoreLogs(['Warning: Could not find image']);

export default function Root() {
  const isLoadingComplete = useCachedResources();
  const [themeName, setThemeName] = useState(useTheme().dark ? 'dark' : 'light');
  const theme = themes[themeName].theme;

  const toggleTheme = () => {
    const nextTheme = themeName === 'light' ? 'dark' : 'light';
    setThemeName(nextTheme);
  };


  if (!isLoadingComplete) {
    return null;
  }

  if (Platform.OS === 'web') {
    // Use a basic custom layout on web.
    return (
      <SessionProvider>
        <ThemeProvider value={themeName === "light" ? DefaultTheme : DarkTheme}>
          <WebNavbar />
          <Stack screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen
              name="index" // This is the name of the page and must match the url from root
              options={{
                // drawerLabel: "Home",
                title: "Home",
              }}
            />
            <Stack.Screen
              name="about" // This is the name of the page and must match the url from root
              options={{
                title: "About",
              }}
            />

          </Stack>
        </ThemeProvider>
      </SessionProvider>
    );
  } else {
    // Set up the auth context and render our layout inside of it.
    return (
      // Magic SDK seems to break on Web
      <MagicTools>
        <ThemeProvider value={themeName === "light" ? DefaultTheme : DarkTheme}>
          <ThemeContext.Provider value={{ theme, toggleTheme }}>
              <Slot />
          </ThemeContext.Provider>
        </ThemeProvider>
      </MagicTools>
    );
  }
}
