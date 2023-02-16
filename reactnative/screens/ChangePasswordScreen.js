import { api_url } from '../authentication';


export default function ChangePasswordScreen() {


    const changePasswordHandler = () => {
        fetch(api_url, + '/change_password/', {
            method: 'POST',
            headers
        })
    }

}