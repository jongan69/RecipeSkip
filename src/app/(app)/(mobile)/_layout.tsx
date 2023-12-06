import { Drawer } from 'expo-router/drawer';
import Header from '../../../components/Header'; // import your custom header component
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon, useThemeMode } from '@rneui/themed';
import { View } from '../../../components/Themed';
import SearchBox from '../../../components/SearchBox';

export default function Layout() {
  const [isVisible, setVisible] = React.useState(false);
  const { mode, setMode } = useThemeMode();

  const HomeButton = () => {
    return !isVisible ? (
      <TouchableOpacity onPress={() => { }} style={{ marginLeft: 10 }}>
        <Icon name="home" color="black" />
      </TouchableOpacity>
    ) : null;
  };

  const CloseSearchButton = () => {
    return (
      <TouchableOpacity onPress={() => setVisible(false)}>
        <Icon name="close" color="black" />
      </TouchableOpacity>
    );
  };

  const SearchButton = () => {
    return !isVisible ? (
      <TouchableOpacity
        style={{ marginLeft: 10 }}
        onPress={() => setVisible(true)}>
        <Icon type="material" name="search" color="black" />
      </TouchableOpacity>
    ) :
      <View style={{ display: 'flex', flexDirection: 'row', resizeMode: 'contain'}}>
        <SearchBox />
        <CloseSearchButton />
      </View>;
  };



  const ThemeHeaderButton = () => {
    return (
      <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => setMode(mode === 'light' ? 'dark' : 'light')} >
        <Icon type="feather" name={mode === 'light' ? 'sun' : 'moon'} color="black" />
      </TouchableOpacity>
    );
  };

  return (
    <Drawer
      screenOptions={{
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <HomeButton />
            <SearchButton />
            <ThemeHeaderButton />
          </View>
        )
      }}
    >
      <Drawer.Screen name="index" />
      <Drawer.Screen name="main" />
    </Drawer>
  );
}
