import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmlakPosApiClient from '../services/EmlakPosApiClient';

export default function UserDetails({ navigation }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [createDate, setCreateDate] = useState("");
    const [userLevel, setUserLevel] = useState("");
    const [activity, setActivity] = useState("");
    const apiClient = new EmlakPosApiClient();


    useEffect(() => {

        const loadUserData = async () => {
            const id = await AsyncStorage.getItem('id_user');
            await apiClient.clearApiParams();
            apiClient.setRequestDataParam('hash', id);
            apiClient.setCallAction('user/getuser');
            try {
                const response = await apiClient.callApi();
              
                if (response.data) {
                    const userInfo = response.data;
                    setFirstName(userInfo.firstname);
                    setLastName(userInfo.lastname);
                    setPhone(userInfo.phone || "");
                    setEmail(userInfo.email || "");
                    setCreateDate(userInfo.date_create || "");
                    setUserLevel(userInfo.user_level || "");
                    setActivity(userInfo.is_active);
                }
                await AsyncStorage.setItem('token',response.header.token);
            } catch (error) {
                console.error(error);
            }
        };

        loadUserData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Icon name='account-details' size={100} color="#3b5998" marginTop={50} />
            <Text style={styles.title}>{firstName} {lastName}</Text>

            <View style={styles.infoSection}>
                <View style={styles.rowLine}>
                    <View style={styles.row}>
                        <Text style={styles.infoText} width='100%'>{userLevel == "pos" ? "POS kullanıcısı" : "Yönetici"} </Text>
                    </View>
                </View>
                <View style={styles.rowLine}>
                    <View style={styles.row}>
                    <Text style={styles.infoText}>Durum: </Text>
                        <Text style={styles.contText}>{activity == "1" ? "Hesap Aktif" : "Hesap Kapalı"} </Text>
                    </View>
                </View>
                <View style={styles.rowLine}>
                    <View style={styles.row}>
                        <Text style={styles.infoText}>Telefon: </Text>
                        <Text style={styles.contText}>{phone}</Text>
                    </View>
                </View>
                <View style={styles.rowLine}>
                    <View style={styles.row}>
                        <Text style={styles.infoText}>Email: </Text>
                        <Text style={styles.contText}>{email}</Text>
                    </View>
                </View>
                <View style={styles.rowLine}>
                    <View style={styles.row}>
                        <Text style={styles.infoText}>Oluşturma: </Text>
                        <Text style={styles.contText}>{createDate}</Text>
                    </View>
                </View>

            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.goBack()}>
                <Icon name="logout" size={30} color="#3b5998" />
                <Text style={styles.buttonText}>Geri-Kullanıcı ayarları</Text>
            </TouchableOpacity>
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
    infoSection: {
        padding: 20,
        width: '95%',
        justifyContent: 'space-around',
    },
    infoText: {
        fontSize: 18,
        marginVertical: 5,
        color: "#3b5998",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        width: 110
    },
    contText: {
        fontSize: 16,
        marginRight: 5,
        maxWidth: '70%',
        color: "#3b5998",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 5
    },
    row: {
        justifyContent: 'flex-start',
        alignItems: "center",
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 50,
        borderColor: "#3b5998",

        marginVertical: 5,
        height: 50,
        width: '97%',
    },
    rowLine: {
        borderRadius: 50,
        color: "#3b5998",
        backgroundColor: "#3b5998",
        alignItems: "center",
        marginVertical: 10,
        height: 60,
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