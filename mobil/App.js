import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ekran bileşenleri
import GirisScreen from './screens/GirisScreen';
import KayitScreen from './screens/KayitScreen';
import AnaEkranScreen from './screens/AnaEkranScreen';
import YardimPaneliScreen from './screens/YardimPaneliScreen';
import ProfilPaneliScreen from './screens/ProfilPaneliScreen';
import KullaniciPaneliScreen from './screens/KullaniciPaneliScreen';
import GenelAyarlarScreen from './screens/GenelAyarlarScreen';
import CustomDrawerContent from './components/CustomDrawerContent';

// Servisler
import { supabase } from './services/supabaseConfig';
import AuthService from './services/AuthService';

// Context provider
import { AppContext, AppContextProvider } from './context/AppContext';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Tema destekli ana uygulama bileşeni
function MainApp() {
  const { getColors, t, isLoading: contextLoading, isGuestMode, user } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        // Misafir modu kontrolü
        const guestMode = await AsyncStorage.getItem('guestMode');
        if (guestMode === 'true') {
          console.log('Misafir modu aktif - Ana ekrana yönlendiriliyor');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Normal auth kontrolü
        const isAuth = await AuthService.isAuthenticated();
        setIsAuthenticated(isAuth);
        console.log('Auth durumu:', isAuth ? 'Giriş yapılmış' : 'Giriş yapılmamış');

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Authentication check error:', error);
        setIsLoading(false);
      }
    };

    checkLoginStatus();

    // Auth durumu değişikliklerini dinle
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('App.js - Auth durum değişikliği:', event);

        if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          // Misafir modu kontrolü
          const guestMode = await AsyncStorage.getItem('guestMode');
          if (guestMode === 'true') {
            console.log('Misafir modunda, auth durumu korunuyor');
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Ana drawer navigasyonu
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

  // Splash ekranı
  function SplashScreen() {
    return (
      <View style={[styles.splashContainer, { backgroundColor: getColors().background }]}>
        <Text style={[styles.splashText, { color: getColors().primary }]}>Turna AI</Text>
        <ActivityIndicator size="large" color={getColors().primary} />
      </View>
    );
  }

  // Yükleme durumunda splash ekranını göster
  if (isLoading || contextLoading) {
    return <SplashScreen />;
  }

  // Misafir modu veya user varsa authenticated kabul et
  const shouldShowMain = isAuthenticated || isGuestMode || user;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={getColors().statusBar}
        barStyle="light-content"
      />
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          initialRouteName={shouldShowMain ? "Main" : "Giris"}
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: getColors().background }
          }}
        >
          <Stack.Screen name="Giris" component={GirisScreen} options={{ animationEnabled: false }} />
          <Stack.Screen name="Kayit" component={KayitScreen} />
          <Stack.Screen
            name="Main"
            component={MainDrawerNavigator}
            options={{ gestureEnabled: false, animationEnabled: false }}
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