import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const WebViewScreen = ({ route, navigation }) => {
  const { url } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <WebView 
        source={{ uri: url }} 
        style={{ flex: 1 }}
        onLoadStart={() => navigation.setOptions({ title: 'Loading...' })}
        onLoadEnd={() => navigation.setOptions({ title: '3D Secure' })}
        renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
        startInLoadingState={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WebViewScreen;
