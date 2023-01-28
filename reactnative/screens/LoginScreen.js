import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Button, TextInput, Alert } from 'react-native';

import { useContext, useState } from 'react';
import { userContext } from '../data';

export default function SignUpScreen({ navigation }) {

  const [ user, setUser] = useContext(userContext)

  const [ username, setUsername ] = useState()
  const [ password, setPassword ] = useState()

  const [ errors, setErrors ] = useState({})
  
  const loginHandler = () => {}

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
        <TextInput style={inputStyle('username')} onChangeText={setUsername}/>
        <ErrorMessage name='username'></ErrorMessage>

        <Text style={styles.text} >Password:</Text>
        <TextInput style={inputStyle('new_password')} onChangeText={setPassword}  secureTextEntry={true}/>
        <ErrorMessage name='new_password'></ErrorMessage>

        <View style={styles.parent}>
          <Button style={styles.button} title="Log In" onPress={loginHandler} />
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
