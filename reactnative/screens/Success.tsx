import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';

const SuccessComponent = () => {
    const [data, setData] = useState(null);

    const listAccounts = fetch('http://10.0.2.2:8000/stocks/list_accounts/')

      useEffect(() => {
        if (data == null) {

        }
      }, [data])
    return (
        <View>
          <View>
            <Text>Balance Response</Text>
          </View>
          <View>
            <Text>
                {
                  JSON.stringify(data)
                }
            </Text>
          </View>
        </View>
      );
    };



export default SuccessComponent;