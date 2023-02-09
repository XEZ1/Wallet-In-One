import requests
from .models import Token

credentials = {
	"secret_id": "5aa6c2d1-2e27-4c46-b030-2d9add58a256",
	"secret_key": "3f36bdccfb992be6d8db4773e180151290e81c1b0e44bf195f15957e97efbfef204e7e0991ce98923874e03bebf3403fb5e5edc3da5db802e4f9e4aefe38432a"
}

base_url = 'https://ob.nordigen.com/api/v2'
base_headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

def post(endpoint, headers = {}, body = {}):
    return requests.post(f'{base_url}{endpoint}', headers=base_headers|headers, json=body).json()

def get(endpoint, headers = {}, body = {}):
    return requests.get(f'{base_url}{endpoint}', headers=base_headers|headers, json=body).json()

def generate_tokens():
    return post('/token/new/', body = credentials)

def refresh_access_token(refresh_token):
    return post('/token/refresh/', body = {'refresh': refresh_token})

def new_refresh_token():
    Token.objects.all().delete()

    r = generate_tokens()
    if r.get('status_code') == 401 and r.get('summary')== "Authentication failed":
        return None
    else:
        token = Token(refresh_token = r['refresh'], access_token = r['access'])
        token.set_access_expiry(r['access_expires'])
        token.set_refresh_expiry(r['refresh_expires'])
        token.save()
        return token.access_token

def get_access_token(force_regenerate=False):
    if not Token.objects.all().exists():
        return new_refresh_token()

    token = Token.objects.latest('refresh_token_expiration')
    
    if (not force_regenerate and not token.access_expired()):
        return token.access_token

    # Access token needs to be refreshed
    
    if (token.refresh_expired()):
        return new_refresh_token()
    
    print(token.refresh_token)
    r = refresh_access_token(token.refresh_token)

    if r.get('status_code') == 401 and r.get('detail') == "Token is invalid or expired":
        print('invalid')
        return new_refresh_token()
    
    token.access_token = r['access']
    token.set_access_expiry(r['access_expires'])
    token.save()

    return token.access_token

def auth_request(method, endpoint, headers = {}, body = {}):
    token = get_access_token()
    r = method(endpoint, headers | {'Authorization': f'Bearer {token}'}, body)
    
    if isinstance(r,dict) and r.get('status_code') == 401 and r.get("detail") == "Token is invalid or expired":
        token = get_access_token(force_regenerate=True)
        r = method(endpoint, headers, body)
    return r

def auth_get(endpoint, headers = {}, body = {}):
    return auth_request(get, endpoint, headers = {}, body = {})

def auth_post(endpoint, headers = {}, body = {}):
    return auth_request(post, endpoint, headers = {}, body = {})

# Main Methods

def get_institutions():
    return auth_get('/institutions/?country=gb')
