import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

export default function Map({latitude, longitude}){
    return(
        <MapView
        style={{...StyleSheet.absoluteFillObject}}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
    <Marker coordinate={{ latitude: latitude, longitude: longitude }} />
      </MapView>
    )
}