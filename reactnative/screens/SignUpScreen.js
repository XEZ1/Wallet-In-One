import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Button, TextInput } from 'react-native';

import { useContext, useState } from 'react';
import { userContext } from '../data';

export default function SignUpScreen({ navigation }) {

  const [ user, setUser] = useContext(userContext)

  const [ username, setUsername ] = useState()
  const [ email, setEmail ] = useState()
  const [ firstName, setFirstName ] = useState()
  const [ LastName, setLastName ] = useState()
  const [ password, setPassword ] = useState()
  const [ passwordConfirmation, setPasswordConfirmation ] = useState()
  
  return (
    <ScrollView style={styles.container}>
        <StatusBar style="auto" />

        <Text style={styles.text} >Username:</Text>
        <TextInput style={styles.input} onChangeText={setUsername}/>

        <Text style={styles.text} >Email:</Text>
        <TextInput style={styles.input} onChangeText={setEmail}/>

        <Text style={styles.text} >First Name:</Text>
        <TextInput style={styles.input} onChangeText={setFirstName}/>

        <Text style={styles.text} >Last Name:</Text>
        <TextInput style={styles.input} onChangeText={setLastName}/>

        <Text style={styles.text} >Password:</Text>
        <TextInput style={styles.input} onChangeText={setPassword}  secureTextEntry={true}/>

        <Text style={styles.text} >Password Confirmation:</Text>
        <TextInput style={styles.input} onChangeText={setPasswordConfirmation} secureTextEntry={true}/>

        <View style={styles.parent}>
          <Button style={styles.button} title="Sign Up" />
          {/* <Button style={styles.button} title="Login" onPress={() => setUser({...user, 'signedIn': true})} /> */}
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 30,
  },
  parent:{
    flex: 1,
    width: "100%",
    alignSelf:'flex-start',
  },
  text:{
    flexDirection: 'row', justifyContent: 'flex-start'
  },
  input: {
    height: 40,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    padding: 10,
    borderColor: 'gray',
    borderRadius: 5,
  },
  button:{
  }
});
