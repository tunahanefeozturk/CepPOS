import * as React from 'react';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import EmlakPosApiClient from '../services/EmlakPosApiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Pay({ route, navigation }) {
    const [phone, setPhone] = useState('');
    const { paramCart,amo } = route.params;
    const apiClient = new EmlakPosApiClient();

    const handlePaySMS= async()=>{
        if(phone.length!==11){
            Alert.alert("Alıcı cep telefonunu kontrol ediniz.",'Telfon numarası 11 haneli olmalıdır')
        }
    
        try {
            await apiClient.clearApiParams();
            apiClient.setRequestDataParam('cart', paramCart);
            apiClient.setRequestDataParam('callback', 'sendsms');
            apiClient.setRequestDataParam('phone', phone);
            apiClient.setCallAction('transaction/registerTransaction');
            const response = await apiClient.callApi();
            console.log(response);
            await AsyncStorage.setItem('token',response.header.token);
        } catch (error) {
            console.log(error);
        }
    };

    return (

        <SafeAreaView style={styles.container}>
           
            <Icon name='contactless-payment' size={100} color="#3b5998" />
            <Text style={styles.title}> SMS ile Ödeme</Text>
            <Text style={styles.amountText}>{amo}₺</Text>
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Icon name="phone" size={24} color="#3b5998" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="0 (5XX) XXX XX XX"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType='numeric'
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handlePaySMS}>
                    <Text style={styles.buttonText}>Gönder</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    form: {
        width: '100%',
        paddingHorizontal: 20
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    icon: {
        marginRight: 10,

    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    amountText: {
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
        fontSize: 20,
        color: 'green'
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        height: 'auto',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
});