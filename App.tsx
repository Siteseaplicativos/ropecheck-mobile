import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import NewInspectionScreen from './src/screens/NewInspectionScreen';
import ViewInspectionScreen from './src/screens/ViewInspectionScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2c3e50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewInspection"
        component={NewInspectionScreen}
        options={{ title: 'Nova Inspeção' }}
      />
      <Stack.Screen
        name="ViewInspection"
        component={ViewInspectionScreen}
        options={{ title: 'Detalhes da Inspeção' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#FF6B35',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: '#f5f5f5',
            borderTopWidth: 1,
            borderTopColor: '#ddd',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            title: 'Inspeções',
            tabBarLabel: 'Inspeções',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>📋</Text>,
          }}
        />
        <Tab.Screen
          name="Info"
          component={InfoScreen}
          options={{
            title: 'Sobre',
            tabBarLabel: 'Sobre',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>ℹ️</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function InfoScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InfoContent"
        options={{ title: 'Sobre RopeCheck' }}
      >
        {() => (
          <InfoContent />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function InfoContent() {
  return null; // Placeholder for info screen
}
