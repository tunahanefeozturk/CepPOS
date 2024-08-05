import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EmlakPosApiClient from '../services/EmlakPosApiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Daily = ({navigation}) => {
  const apiClient = new EmlakPosApiClient();
  const [amount,setAmount]=useState("");
  const [noft,setNoft]=useState("");

  useEffect(() => {
    fetchDaily();
  }, []);

  const fetchDaily = async () => {
    await apiClient.clearApiParams();
    apiClient.setCallAction('store/dailysummary');
    try {
      const response = await apiClient.callApi();
      setAmount(response.data.total_amount);
      setNoft(response.data.total_noft)
      await AsyncStorage.setItem('token',response.header.token);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  return (
    <View style={styles.container}>
   
      
      <Icon name='calendar-check' size={100} color="#3b5998"/>
          <Text style={styles.title}>Bugün Tahsilatlar</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Yapılan Tahsilat Sayısı</Text>
              <Text style={styles.value}>{noft}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Yapılan Tahsilat Tutarı</Text>
              <Text style={styles.value}>{amount} ₺</Text>
            </View>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.menuButton}>
            <Icon name="email-send" size={30} color="#3b5998" />
              <Text style={styles.buttonText}>E-posta Adresime Gönder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Operations')}>
            <Icon name="format-list-bulleted" size={30} color="#3b5998" />
              <Text style={styles.buttonText}>Tüm Tahsilatları Gör</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Home')}>
        <Icon name="logout" size={30} color="#3b5998" />
        <Text style={styles.buttonText}>Geri - Ana Menü</Text>
      </TouchableOpacity>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    alignItems:'center',
    
  },
 
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  column: {
    alignItems: 'center',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    marginHorizontal:20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    padding:2
  },
  label: {
    fontSize: 16,
    color: '#fff',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuButton: {
    width: 150,
    height: 100,
    margin: 30,
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

export default Daily;
