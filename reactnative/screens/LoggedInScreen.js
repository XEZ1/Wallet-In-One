import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ScrollView, View, Button } from 'react-native';

import { useContext } from 'react';
import { userContext } from '../data';

import { logout } from '../authentication';

import { useTheme } from '../src/theme/ThemeProvider'

export default function LoggedInScreen({ navigation }) {

  const [user, setUser] = useContext(userContext)
  const {dark, colors, setScheme} = useTheme();

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow : 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        backgroundColor: colors.primary,
        }}
        style={styles.container}
    >
      <StatusBar/>
      <Text style={[{color: colors.text}]}>You are logged in</Text>
      <Button title="Logout" onPress={()=>{logout(user, setUser)}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
