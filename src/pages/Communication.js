import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Communication({navigation}) {
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
            <Icon name='phone' size={100} color="#3b5998" />
            <Text style={styles.title}>İletişim</Text>
            
            <Text style={styles.content}>Müşteri Hizmetleri(0850 222 2626)</Text>
          
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
