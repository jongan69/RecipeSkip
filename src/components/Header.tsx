import React from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import { Header as HeaderRNE, Icon } from '@rneui/themed';
import { useThemeMode  } from '@rneui/themed';

import SearchBox from './SearchBox';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type HeaderComponentProps = {
  title: string,
  view?: string,
};

const Header: React.FunctionComponent<HeaderComponentProps> = (props) => {
  const [isVisible, setVisible] = React.useState(false);
  const { mode, setMode } = useThemeMode();

  const docsNavigate = () => {
    Linking.openURL(`https://reactnativeelements.com/docs/${props.view}`);
  };

  const HomeButton = () => {
    return !isVisible ? (
      <TouchableOpacity onPress={docsNavigate}>
        <Icon name="home" color="white" />
      </TouchableOpacity>
    ) : null;
  };

  const SearchButton = () => {
    return !isVisible ? (
      <TouchableOpacity
        style={{ marginLeft: 10 }}
        onPress={() => setVisible(true)}>
        <Icon type="material" name="search" color="white" />
      </TouchableOpacity>
    ) : null;
  };

  const CloseSearchButton = () => {
    return (
      <TouchableOpacity onPress={() => setVisible(false)}>
        <Icon name="close" color="white" />
      </TouchableOpacity>
    );
  };

  const ThemeHeaderButton = () => {
    return (
      <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => setMode(mode === 'light' ? 'dark' : 'light')} >
        <Icon  type="feather" name={mode === 'light' ? 'sun' : 'moon' } color="white" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <HeaderRNE
        containerStyle={styles.headerContainer}
        leftComponent={{
          icon: 'menu',
          color: '#fff',
        }}
        rightComponent={
          <View style={styles.headerRight}>
            <HomeButton />
            <SearchButton />
            <ThemeHeaderButton/>
          </View>
        }
        centerComponent={
          !isVisible ? (
            { text: 'Stonks', style: styles.heading }
          ) : (
            <>
              <CloseSearchButton />
              <SearchBox />
            </>
          )
        }
      />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    paddingTop: '15%',
  },
  heading: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'center',
  },
});

export default Header;
