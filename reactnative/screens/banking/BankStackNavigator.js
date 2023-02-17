import React from "react";
import { Text, TouchableOpacity } from 'react-native'
import { createStackNavigator} from "@react-navigation/stack";

import AddBankScreen from './AddBankScreen'
import BankAccountsScreen from './BankAccountsScreen'
import BankTransactionsScreen from './BankTransactionsScreen'

const Stack = createStackNavigator();

export default function BankStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Bank Accounts" 
        component={BankAccountsScreen} 
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity 
              style={{ marginRight: 15 }} 
              onPress={() => navigation.navigate('Add Bank Account')}
            >
              <Text style={{ color: '#007AFF' }}>Add</Text>
            </TouchableOpacity>
          )
        })}/>
      <Stack.Screen 
        name="Add Bank Account"
        component={AddBankScreen} />
      <Stack.Screen name="All Bank Transactions" component={BankTransactionsScreen} />
    </Stack.Navigator>
  );
}
