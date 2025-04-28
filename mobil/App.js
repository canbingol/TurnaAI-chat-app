import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
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
import { AppContext, AppContextProvider } from './context/AppContext';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Tema destekli ana uygulama bileşeni
function MainApp() {
  const { getColors, t } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  // Navigasyon teması
  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: getColors().primary,
      background: getColors().background,
      card: getColors().card,
      text: getColors().text,
      border: getColors().border,
    },
  };

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

    // İlk kullanımda örnek kullanıcılar oluştur
    const initializeUsers = async () => {
      try {
        const existingUsers = await AsyncStorage.getItem('users');
        if (!existingUsers) {
          // Örnek kullanıcılar
          const sampleUsers = [
            {
              id: '1',
              name: 'Test Kullanıcı',
              email: 'test@example.com',
              password: '123456',
              avatar: null,
              createdAt: new Date().toISOString()
            }
          ];
          await AsyncStorage.setItem('users', JSON.stringify(sampleUsers));
        }
      } catch (error) {
        console.error('Kullanıcılar oluşturulurken hata:', error);
      }
    };

    initializeUsers();
  }, []);

  function MainDrawerNavigator() {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: getColors().primary,
          drawerActiveTintColor: '#FFFFFF',
          drawerInactiveTintColor: getColors().textSecondary,
          drawerLabelStyle: { marginLeft: -20 },
          drawerStyle: {
            backgroundColor: getColors().background,
            width: 280,
          }
        }}
      >
        <Drawer.Screen name="Ana Ekran" component={AnaEkranScreen} options={{ title: t('home') }} />
        <Drawer.Screen name="Profil" component={ProfilPaneliScreen} options={{ title: t('profile') }} />
        <Drawer.Screen name="Yardım" component={YardimPaneliScreen} options={{ title: t('help') }} />
        <Drawer.Screen name="Ayarlar" component={GenelAyarlarScreen} options={{ title: t('settings') }} />
      </Drawer.Navigator>
    );
  }

  function SplashScreen() {
    return (
      <View style={[styles.splashContainer, { backgroundColor: getColors().background }]}>
        <Text style={[styles.splashText, { color: getColors().primary }]}>Turna AI</Text>
        <ActivityIndicator size="large" color={getColors().primary} />
      </View>
    );
  }

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={getColors().statusBar}
        barStyle="light-content"
      />
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          initialRouteName={userToken ? "Main" : "Giris"}
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: getColors().background }
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
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

// Ana uygulama bileşeni
export default function App() {
  return (
    <AppContextProvider>
      <MainApp />
    </AppContextProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashText: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
    letterSpacing: 1,
  }
});