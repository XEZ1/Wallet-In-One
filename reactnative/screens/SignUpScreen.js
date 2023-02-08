import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Button, TextInput, Alert } from 'react-native';

import { useContext, useState } from 'react';
import { userContext } from '../data';

import { api_url, login } from '../authentication';

export default function SignUpScreen({ navigation }) {

  const [ user, setUser] = useContext(userContext)

  const [ username, setUsername ] = useState()
  const [ email, setEmail ] = useState()
  const [ firstName, setFirstName ] = useState()
  const [ lastName, setLastName ] = useState()
  const [ password, setPassword ] = useState()
  const [ passwordConfirmation, setPasswordConfirmation ] = useState()

  const [ errors, setErrors ] = useState({})
  
  //192.168.1.81,10.0.2.2
  const signUpHandler = () => {
    fetch(api_url + '/sign_up/', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first_name: firstName ,
        last_name: lastName ,
        username: username ,
        email: email,
        new_password: password,
        password_confirmation: passwordConfirmation 
    }),
    }).then(res => res.json().then(data => ({status: res.status, body: data})) )
    .then((data) => {
          // console.log('Response:', data);
          if (data['status'] == 400){
            setErrors(data['body'])
            Alert.alert('Error', 'There were some errors');
          }
          else if (data['status'] == 201){
            Alert.alert('Success', 'Account created successfully');
            login(username, password, user, setUser)
          }
    })
    .catch((error) => {
          console.error('Error:', error);
    });
  };

  const inputStyle = (name) => {
    if (name in errors){
      return [styles.input, styles.error]
    }
    return [styles.input]
  }

  function ErrorMessage(props){
    if (props.name in errors){
      return (
        <>
          {errors[props.name].map((value, index) => {
            return <Text key={index} style={styles.errorText}>{value}</Text>
          })}
        </>
      )
    }
    return null;
  }
  
  return (
    <ScrollView style={styles.container}>
        <StatusBar style="auto" />

      
        <Text style={styles.text} >Username:</Text>
        <TextInput style={inputStyle('username')} onChangeText={setUsername} testID='username'/>
        <ErrorMessage name='username'></ErrorMessage>

        <Text style={styles.text} >Email:</Text>
        <TextInput style={inputStyle('email')} onChangeText={setEmail} testID='email'/>
        <ErrorMessage name='email'></ErrorMessage>

        <Text style={styles.text} >First Name:</Text>
        <TextInput style={inputStyle('first_name')} onChangeText={setFirstName} testID='first_name'/>
        <ErrorMessage name='first_name'></ErrorMessage>

        <Text style={styles.text} >Last Name:</Text>
        <TextInput style={inputStyle('last_name')} onChangeText={setLastName} testID='last_name'/>
        <ErrorMessage name='last_name'></ErrorMessage>

        <Text style={styles.text} >Password:</Text>
        <TextInput style={inputStyle('new_password')} onChangeText={setPassword}  secureTextEntry={true} testID='new_password'/>
        <ErrorMessage name='new_password'></ErrorMessage>

        <Text style={styles.text} >Password Confirmation:</Text>
        <TextInput style={inputStyle('password_confirmation')} onChangeText={setPasswordConfirmation} secureTextEntry={true} testID='password_confirmation'/>
        <ErrorMessage name='password_confirmation'></ErrorMessage>

        <View style={styles.parent}>
          <Button style={styles.button} title="Sign Up" onPress={signUpHandler}/>
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
    marginTop: 20,
    flex: 1,
    width: "100%",
    alignSelf:'flex-start',
  },
  text:{
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 0.5,
    padding: 10,
    borderColor: 'gray',
    borderRadius: 5,
  },
  button:{
  },
  error:{
    borderColor: 'red',
  },
  errorText:{
    marginLeft: 10,
    color: 'red',
  }
});
