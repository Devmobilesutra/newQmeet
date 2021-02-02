// In App.js in a new project

import * as React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splashscreen from './screen/Splashscreen';
import Welcome from './screen/Welcome';
import Profile_info from './screen/Profile_info';
import BLogin1 from './screen/BLogin1';
import BLogin2 from './screen/BLogin2';
import BLogin3 from './screen/BLogin3';
import profile_details from './screen/Profile_details/profile_details';
import profile_details_2 from './screen/Profile_details/profile_details_2';
import Book_Appointment from './screen/Book_Appointment'
import qrcode_scanner from './screen/qrcode_scanner'
import Customer_Ticket from './screen/Customer_Ticket'
import confirm_Appointment from './screen/confirm_Appointment'
import Appointment_List from "./screen/Appointment_List";
import Appointment_Details from "./screen/Appointment_Details";
import Appointment_Details_2 from "./screen/Appointment_Details_2";
import EditBuisness from "./screen/EditBuisness";
import EditUser from "./screen/EditUser";
import { widthPercentageToDP } from 'react-native-responsive-screen';
import App_Header2 from './screen/Common_services/App_Header2'
import RN_Icon from 'react-native-vector-icons/AntDesign';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Splashscreen" component={Splashscreen} options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
        <Stack.Screen name="Profile_info" component={Profile_info} options={{ headerShown: false }} />
        <Stack.Screen name="BLogin1" component={BLogin1} options={{ headerShown: false }} />
        <Stack.Screen name="BLogin2" component={BLogin2} options={{ headerShown: false }} />
        <Stack.Screen name="BLogin3" component={BLogin3} options={{ headerShown: false }} />
        <Stack.Screen name="App_Header2" component={App_Header2} options={{ headerShown: false }} />
        <Stack.Screen name="profile_details" component={profile_details} options={{ headerShown: false }} />
        <Stack.Screen name="profile_details_2" component={profile_details_2} options={{ headerShown: false }} />
        <Stack.Screen name="Book_Appointment" component={Book_Appointment} options={{ headerShown: false }} />
        <Stack.Screen name="qrcode_scanner" component={qrcode_scanner}
          options={{
            title: 'Book Appointment',
            headerTitleStyle: { color: '#2570EC', },
            headerTitleAlign: 'center'
          }} />
        <Stack.Screen name="Customer_Ticket" component={Customer_Ticket} options={{ headerShown: false }} />
        <Stack.Screen name="confirm_Appointment" component={confirm_Appointment} options={{ headerShown: false }} />
        <Stack.Screen name="Appointment_Details" component={Appointment_Details} options={{ headerShown: false }} />
        <Stack.Screen name="EditBuisness" component={EditBuisness} options={{ headerShown: false }} />
        <Stack.Screen name="Appointment_List" component={Appointment_List} options={{ headerShown: false }} />
        <Stack.Screen name="Appointment_Details_2" component={Appointment_Details_2} options={{ headerShown: false }} />
        <Stack.Screen name="EditUser" component={EditUser} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
