import React, { useState } from 'react';
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Login from '../../src/pages/Login';
import Verification from '../../src/pages/Verification';
import Signin from '../../src/pages/Signin';
import UserReg from '../../src/pages/UserReg';
import Forgotpass from '../../src/pages/Forgotpass';
import ForgotPassVerific from '../../src/pages/ForgotPassVerific';
import AttendedReg from '../../src/pages/AttendedReg';
import UnattendedReg from '../../src/pages/UnattendedReg';
import Home from '../../src/pages/Home';
import Orders from '../../src/pages/Orders';
import Operations from '../../src/pages/Operations';
import Help from '../../src/pages/Help';
import FastPay from '../../src/pages/FastPay';
import Communication from '../../src/pages/Communication';
import Users from '../../src/pages/Users';
import UserDetails from '../../src/pages/UserDetails';
import ChangePass from '../../src/pages/ChangePass';
import Daily from '../../src/pages/Daily';
import Pay from '../../src/pages/Pay';
import PaySMS from '../../src/pages/PaySMS';
import PayMail from '../../src/pages/PayMail';
import PayQR from '../../src/pages/PayQR';
import WebViewScreen from '../../src/pages/WebViewScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

type HeaderProps = {
  navigation: DrawerNavigationProp<any>;
};
const Header: React.FC<HeaderProps> = ({ navigation }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.openDrawer()}>
        <Icon name="bars" size={24} color="white" />
      </TouchableOpacity>
      <Image
        source={require('../../src/images/headerLogo.png')}
        style={styles.headerImage}
        resizeMode="contain"
      />
      <TouchableOpacity style={styles.bellIcon}>
        <Icon name="bell" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


function DrawerScreens() {
  return (
    <Drawer.Navigator   screenOptions={{ header: ({ navigation }) => <Header navigation={navigation} />,drawerStyle:styles.drawer,drawerLabelStyle:styles.drawerContent}}>
      <Drawer.Screen name="Home" component={Home} options={{    
           drawerIcon: ({focused, size}) => (
              <Icon
                 name="home"
                 size={size}
                 color={focused ? '#7cc' : 'white'}
              />
           ),
        }}/>
      <Drawer.Screen name="Orders" component={Orders} options={{      
           drawerIcon: ({focused, size}) => (
              <Icon
                 name="shopping-cart"
                 size={size}
                 color={focused ? '#7cc' : 'white'}
              />
           ),
        }}/>
      <Drawer.Screen name="Operations" component={Operations} options={{     
           drawerIcon: ({focused, size}) => (
              <MIcon
                 name="chart-line"
                 size={size}
                 color={focused ? '#7cc' : 'white'}
              />
           ),
        }}/>
      <Drawer.Screen name="FastPay" component={FastPay} options={{
           drawerIcon: ({focused, size}) => (
              <Icon
                 name="credit-card"
                 size={size}
                 color={focused ? '#7cc' : 'white'}
              />
           ),
        }}/>
      <Drawer.Screen name="Users" component={Users} options={{
           drawerIcon: ({focused, size}) => (
              <MIcon
                 name="account"
                 size={size}
                 color={focused ? '#7cc' : 'white'}
              />
           ),
        }} />
      <Drawer.Screen name="Daily" component={Daily} options={{
           drawerIcon: ({focused, size}) => (
              <MIcon
                 name="calendar-check"
                 size={size}
                 color={focused ? '#7cc' : 'white'}
              />
           ),
        }}/>
      <Drawer.Screen name="Help" component={Help} options={{
           drawerIcon: ({focused, size}) => (
              <Icon
                 name="question"
                 size={size}
                 color={focused ? '#7cc' : 'white'}
              />
           ),
        }}/>
      <Drawer.Screen name="Çıkış" component={Login} options={{
           drawerIcon: ({focused, size}) => (
              <Icon
                 name="sign-out"
                 size={size}
                 color={focused ? '#7cc' : 'white'}
              />
           ),
        }}/>
    </Drawer.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Verification" component={Verification} options={{ headerShown: false }} />
      <Stack.Screen name="Signin" component={Signin} options={{ headerShown: false }} />
      <Stack.Screen name="UserReg" component={UserReg} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPass" component={Forgotpass} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassVerific" component={ForgotPassVerific} options={{ headerShown: false }} />
      <Stack.Screen name="AttendedReg" component={AttendedReg} options={{ headerShown: false }} />
      <Stack.Screen name="UnattendedReg" component={UnattendedReg} options={{ headerShown: false }} />
      <Stack.Screen name="Help" component={Help} options={{ headerShown: false }} />
      <Stack.Screen name="Communication" component={Communication} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={DrawerScreens} options={{ headerShown: false }} />
      <Stack.Screen name="Orders" component={DrawerScreens} options={{ headerShown: false }} />
      <Stack.Screen name="Operations" component={DrawerScreens} options={{ headerShown: false }} />
      <Stack.Screen name="FastPay" component={FastPay} options={{ headerShown: false }} />
      <Stack.Screen name="Users" component={DrawerScreens} options={{ headerShown: false }} />
      <Stack.Screen name="UserDetails" component={UserDetails} options={{ headerShown: false }} />
      <Stack.Screen name="ChangePass" component={ChangePass} options={{ headerShown: false }} />
      <Stack.Screen name="Daily" component={DrawerScreens} options={{ headerShown: false }} />
      <Stack.Screen name="Pay" component={Pay} options={{ headerShown: false }} />
      <Stack.Screen name="PaySMS" component={PaySMS} options={{ headerShown: false }} />
      <Stack.Screen name="PayMail" component={PayMail} options={{ headerShown: false }} />
      <Stack.Screen name="PayQR" component={PayQR} options={{ headerShown: false }} />
      <Stack.Screen name="WebViewScreen" component={WebViewScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return <MainStack />;
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: "#3b5998", // Use the background color from the image
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  menuIcon: {
    padding: 5,
  },
  headerImage: {
    width: '70%', // Görüntü genişliği
    height: 50, // Görüntü yüksekliği
    marginRight: 10,
  },
  bellIcon: {
    padding: 5,
  },
  drawer:{
    backgroundColor: "#3b5998",
  },
  drawerContent:{
  
    color:"white",
    textDecorationColor:'white'
  }
});