import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SavedProvider } from './SavedContext';
import Loader from './Components/Loader';
import Menu from './Components/Menu';        
import Maps from './Components/Maps';
import Saved from './Components/Saved';
import CustomTabBar from './Components/CustomTabBar';
import Start from './Components/Start';
import Culture from './Components/Culture';
import Tips from './Components/Tips';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
  name="Culture"
  component={Culture}
  options={{

    unmountOnBlur: false,
  }}
/>
      
      <Tab.Screen
  name="Maps"
  component={Maps}
  options={{

    unmountOnBlur: false,
  }}
/>
  <Tab.Screen
  name="Menu"
  component={Menu}
  options={{

    unmountOnBlur: false,
  }}
/>
<Tab.Screen
  name="Tips"
  component={Tips}
  options={{

    unmountOnBlur: false,
  }}
/>

<Tab.Screen
  name="Saved"
  component={Saved}
  options={{

    unmountOnBlur: false,
  }}
/>

    </Tab.Navigator>
  );
}

export default function App() {
  const [loaderEnded, setLoaderEnded] = useState(false);

  return (
    

     
    <SavedProvider>
    <NavigationContainer>
      {!loaderEnded ? (
        <Loader onEnd={() => setLoaderEnded(true)} />
      ) : (
        <Stack.Navigator 
        initialRouteName="Start" 
        screenOptions={{ headerShown: false }}
      >
       
      
        <Stack.Screen name="Tabs" component={MyTabs} />
        
        <Stack.Screen name="Start" component={Start} />
      </Stack.Navigator>
      )}
    </NavigationContainer>
    </SavedProvider> 
  );
}