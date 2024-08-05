import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


export default function Help({ navigation }) {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.headerContainer}>
                <Image
                    source={require('../images/logo.png')}
                    style={styles.headerImage}
                    resizeMode="cover"
                />
            </View>
            <Icon name='question' size={100} color="#3b5998" />
            <Text style={styles.title}>Yardım Menüsü</Text>
            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Communication')}>
                    <Icon name="phone" size={30} color="#3b5998" />
                    <Text style={styles.buttonText}>İletişim</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('')}>
                    <Icon name="envelope" size={30} color="#3b5998" />
                    <Text style={styles.buttonText}>Bize Yazın</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('')}>
                    <Icon name="question-circle" size={30} color="#3b5998" />
                    <Text style={styles.buttonText}>Sıkça Sorulan Sorular</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Home')}>
                <Icon name="sign-out" size={30} color="#3b5998" />
                <Text style={styles.buttonText}>Geri - Ana Menü</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    headerContainer: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    headerImage: {
        width: '50%',
        height: '100%',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#3b5998',
    },
    menuContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
    menuButton: {
        width: 100,
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
    content: {
        fontSize: 18,
        marginTop: 20,
        textAlign: 'center',
        color: '#3b5998',
    },
});
