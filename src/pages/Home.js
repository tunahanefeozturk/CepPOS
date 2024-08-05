import React, { useState, useEffect } from 'react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet ,Image } from 'react-native';
import Operations from './Operations';
import Orders from './Orders';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();


function HomeScreen({navigation }) {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      const storedFirstName = await AsyncStorage.getItem('user_info_firstname');
      const storedLastName = await AsyncStorage.getItem('user_info_lastname');
      if (storedFirstName) setFirstName(storedFirstName);
      if (storedLastName) setLastName(storedLastName);
    };

    loadUserData();
  }, []);
 
  return ( 
    
    <SafeAreaView style={styles.container}>
      
      <Icon name='home' size={100} color="#3b5998"/>
      <Text style={styles.title}>Ana Menü</Text>
      <Text marginBottom={10}>{firstName} {lastName}</Text>
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Orders')}>
          <Icon name="shopping-cart" size={30} color="#3b5998" />
          <Text style={styles.buttonText}>Yeni Sipariş</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}  onPress={() => navigation.navigate('FastPay')}>
          <Icon name="credit-card" size={30} color="#3b5998" />
          <Text style={styles.buttonText}>Hızlı Ödeme</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Daily')}>
          <Icon name="calendar" size={30} color="#3b5998" />
          <Text style={styles.buttonText}>Günlük</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Operations')}>
          <MIcon name="chart-line" size={30} color="#3b5998" />
          <Text style={styles.buttonText}>İşlemler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}  onPress={() => navigation.navigate('Users')}>
          <Icon name="users" size={30} color="#3b5998" />
          <Text style={styles.buttonText}>Kullanıcılar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Help')}>
          <Icon name="question-circle" size={30} color="#3b5998" />
          <Text style={styles.buttonText}>Yardım</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
        <Icon name="sign-out" size={30} color="#3b5998" />
        <Text style={styles.buttonText}>Güvenli Çıkış</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
            return <Icon name={iconName} size={size} color={color} />;
          } else if (route.name === 'Orders') {
            iconName = 'shopping-cart';      
            return <Icon name={iconName} size={size} color={color} />; 
          } else if (route.name === 'Operations') {
            iconName = "chart-line";
            return <MIcon name={iconName} size={size} color={color} />;
          } 
        },
        tabBarActiveTintColor: '#7cc',
        tabBarInactiveTintColor: 'white',
        tabBarActiveBackgroundColor:'#3b5998',
        tabBarInactiveBackgroundColor:'#3b5998',
      })}
    >
        
      <Tab.Screen  name="Home" component={HomeScreen} options={{ title: 'Yeni Sipariş' ,headerShown: false}}/> 
      <Tab.Screen name="Orders" component={Orders} options={{ title: 'Yeni Sipariş' ,headerShown: false}} />
      <Tab.Screen name="Operations" component={Operations} options={{ title: 'İşlemler' ,headerShown: false}} />
    </Tab.Navigator>
  );
}



function App() {
  return (
   
    <MainTabNavigator/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width:350
  },
  menuButton: {
    width: 150,
    height: 100,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    marginTop: 10,
    fontSize: 14,
    color: '#3b5998',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },

});

export default App;
