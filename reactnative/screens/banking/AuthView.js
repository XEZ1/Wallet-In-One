import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview'
import Loading from './Loading'

export default function AuthWebView({ url }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <Loading/>
      ) : null}
      <WebView
        source={{ uri: url }}
        onLoad={() => setIsLoading(false)}
        onNavigationStateChange={(event) => {
          if (event.url.startsWith('http://www.example.com/')) {
            console.log('redirect')
          }
        }}
      />
    </View>
  );
};