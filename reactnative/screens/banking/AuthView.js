import React, { useState } from 'react';
import { ActivityIndicator, View, Button } from 'react-native';
import { WebView } from 'react-native-webview'
import Loading from './Loading'
import { useTheme } from 'reactnative/src/theme/ThemeProvider'

export default function AuthWebView({ url, onCancel, stateChange}) {
  const [isLoading, setIsLoading] = useState(true);
  const {dark, colors, setScheme} = useTheme();

  return (
    <View
    style={{flex:1, backgroundColor: colors.background}}
    >
      {isLoading ? (
        <Loading/>
      ) : null}
      <Button title="Cancel" onPress={onCancel}/>
      <WebView
        source={{ uri: url }}
        onLoad={() => setIsLoading(false)}
        onNavigationStateChange={stateChange}
      />
    </View>
  );
};