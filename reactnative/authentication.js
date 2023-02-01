import * as SecureStore from 'expo-secure-store';

export const api_url = 'http://10.0.2.2:8000'

export const fetchAPI = async (url, body=null, headers={}, method = "POST") => {
    try{
        var payload =  {
            method: method,
            headers: {
                    ...headers,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
            }
        }

        if (method == 'POST'){
            payload = {...payload, body: JSON.stringify(body)}
        }

        var res = await fetch(api_url + url, payload)
        
        var data = await res.json();

        return {status: res.status, body: data}
    }
    catch(error){
        return {status: 'Error', body: error.toString()}
    }
}

export const validateToken = async (token) => {
    response = await fetchAPI('/validate_token',{}, {'Authorization': 'Token '+ token }, "GET");

    //console.log('resp',response);
    
    if (response['body']['token_valid']){
        return true;
    }

    return false;
}

export const initAuthState = async (user, setUser) => {
    let token = await SecureStore.getItemAsync('token')
    if (token){
        tokenValid = await validateToken(token);
        if (tokenValid){
            setUser({...user, 'signedIn': true})
        }
    }
};

export const login = async (username, password, user, setUser) => {
    var response = await fetchAPI('/login/', {'username': username, 'password': password}, {}, "POST")
    //console.log('login resp',response)
    if (response["body"]['token']){
        await SecureStore.setItemAsync('token', response["body"]['token'])
        setUser({...user, 'signedIn': true})
    }
    return response;
};

export const logout = async (user, setUser) => {
    //console.log('logged out')
    await SecureStore.deleteItemAsync('token')
    setUser({...user, 'signedIn': false})
};