import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Screens
import GirisScreen from './screens/GirisScreen';
import KayitScreen from './screens/KayitScreen';
import AnaEkranScreen from './screens/AnaEkranScreen';
import YardimPaneliScreen from './screens/YardimPaneliScreen';
import ProfilPaneliScreen from './screens/ProfilPaneliScreen';
import KullaniciPaneliScreen from './screens/KullaniciPaneliScreen';
import GenelAyarlarScreen from './screens/GenelAyarlarScreen';
import CustomDrawerContent from './components/CustomDrawerContent';

// Context yapısı
import { AppContextProvider } from './context/AppContext';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MainDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#8A2BE2',
        drawerActiveTintColor: '#FFFFFF',
        drawerInactiveTintColor: '#888',
        drawerStyle: {
          backgroundColor: '#121212'
        }
      }}
    >
      <Drawer.Screen name="Ana Ekran" component={AnaEkranScreen} />
      <Drawer.Screen name="Profil" component={ProfilPaneliScreen} />
    </Drawer.Navigator>
  );
}

function SplashScreen() {
  return (
    <View style={styles.splashContainer}>
      <Text style={styles.splashText}>Turna AI</Text>
      <ActivityIndicator size="large" color="#8A2BE2" />
    </View>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    // Giriş durumunu kontrol et
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
        setTimeout(() => {
          setIsLoading(false);
        }, 1500); // 1.5 saniyelik bir splash screen gösterelim
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <AppContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={userToken ? "Main" : "Giris"}
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#121212' }
          }}
        >
          <Stack.Screen name="Giris" component={GirisScreen} />
          <Stack.Screen name="Kayit" component={KayitScreen} />
          <Stack.Screen
            name="Main"
            component={MainDrawerNavigator}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="KullaniciPaneli" component={KullaniciPaneliScreen} />
          <Stack.Screen name="GenelAyarlar" component={GenelAyarlarScreen} />
          <Stack.Screen name="Yardım" component={YardimPaneliScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContextProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  splashText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 20,
  }
});