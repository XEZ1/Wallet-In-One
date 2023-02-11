import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ScrollView, View, Button } from 'react-native';

import { useContext } from 'react';
import { userContext } from '../data';

import { logout } from '../authentication';

import { useTheme } from '../src/theme/ThemeProvider'
import { TouchableOpacity } from 'react-native';

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
        backgroundColor: colors.background,
        }}
        style={styles.container}
    >
      <StatusBar/>
      <Text style={[{color: colors.text}]}>You are logged in</Text>
      <TouchableOpacity
        onPress={()=>{logout(user, setUser)}}
      >
        <Text style={[{backgroundColor: colors.primary}, {color: colors.text}, styles.button]}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    width: "75%",
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: '4%',
    paddingHorizontal: "12%",
    paddingVertical: "2%",
    fontSize:  20,
  },
});
