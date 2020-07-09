import React from 'react';
import {
  StyleSheet, Image, PermissionsAndroid,
   Platform,Dimensions,  View,  Text,  Alert,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

//import { Marker } from 'react-native-maps'; 
let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
class App extends React.Component {
  constructor() {
    super();
    // this.state = {
    //   currentLongitude: '',
    //   currentLatitude: '',
    // };
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
    };
  }
  componentDidMount = () => {
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
      .then(data => {
        console.log("data response", data);
      }).catch(err => {
      });
    Alert.alert(
      'Alert Title',
      'To continue,turn on current location',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.location() },
      ]
    );
  }
  callLocation(that) {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log("call location osition", position);
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        });
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    // that.watchID = Geolocation.watchPosition((position) => {
    //   console.log("postion of geolaction", position);
    //   // const currentLongitude = JSON.stringify(position.coords.longitude);
    //   // const currentLatitude = JSON.stringify(position.coords.latitude);
    //   // console.log("postion of geolaction1", currentLongitude);
    //   // console.log("postion of geolaction2", currentLatitude);
    //   // that.setState({ currentLongitude: currentLongitude });
    //   // that.setState({ currentLatitude: currentLatitude });
    //   this.setState({
    //     region: {
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //       latitudeDelta: LATITUDE_DELTA,
    //       longitudeDelta: LONGITUDE_DELTA,
    //     }
    //   });

    // });
  }
  componentWillUnmount = () => {
    Geolocation.clearWatch(this.watchID);
  }
  location = () => {
    var that = this;
    if (Platform.OS === 'ios') {
      this.callLocation(that);
    } else {
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            'title': 'Location Access Required',
            'message': 'This App needs to Access your location'
          }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            that.callLocation(that);
          } else {
            alert("Permission Denied");
          }
        } catch (err) {
          alert("err", err);
          console.warn("erooe", err)
        }
      }
      requestLocationPermission();
    }
  }
  render() {
    // // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
    // const LATITUDE_DELTA = 0.015;
    // const LONGITUDE_DELTA = 0.0121;
    // const { currentLongitude, currentLatitude } = this.state;
    // let initialRegion = {
    //   latitude:currentLatitude,
    //   longitude:currentLongitude,
    //   latitudeDelta:LATITUDE_DELTA,
    //   longitudeDelta: LONGITUDE_DELTA
    // }
    return (
      <View>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            // region={initialRegion}
            // region={{
            //   longitude: -122.4324,
            //   latitude: 37.78825,
            //   latitudeDelta: 0.015,
            //   longitudeDelta: 0.0121,
            // }}
            region={ this.state.region }
            provider={PROVIDER_GOOGLE}
            //strokeWidth={0.1}
          >
 <MapView.Marker
          coordinate={ this.state.region }
        />

          </MapView>
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 400 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'blue' }}>
            GET LOCATION
      </Text>
          <Image
            source={require('./ICON/location.png')}
            style={{ width: 70, height: 70 }}
          />
          <Text style={styles.boldText}>
            You are Here
          </Text>
          <Text style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, fontSize: 20, fontWeight: 'bold' }}>
            Longitude: {this.state.region.longitude}
          </Text>
          <Text style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, fontSize: 20, fontWeight: 'bold' }}>
            Latitude: {this.state.region.latitude}
          </Text>
        </View>
      </View>
    );
  };
}
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    padding: 16,
    backgroundColor: 'white'
  },
  boldText: {
    fontSize: 30,
    color: 'red',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})
