/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './src/views/Login';
import Home from './src/views/Home';
import ListTask from './src/views/ListTask';
const Stack = createNativeStackNavigator();

function App () {

  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="ListTask"
    screenOptions={{
      headerShown: false
    }}
    >
    <Stack.Screen
        name="Login"
        component={Login}
      /> 
      <Stack.Screen
        name="ListTask"
        component={ListTask}
      /> 
       <Stack.Screen
          name="Home"
          component={Home}
    /> 
    </Stack.Navigator>
  </NavigationContainer>
  );

}


export default App;
