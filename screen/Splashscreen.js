import React, { Component } from 'react';
import { Button, StyleSheet, View, Text, TouchableOpacity, Alert, SafeAreaView, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import { Container, Header, Title, Content, Left, Right, Body, Icon } from 'native-base';

class Splashscreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  unsubscribe = () => NetInfo.addEventListener(state => {
    console.log("Connection type", state.type);
    console.log("Is connected?", state.isConnected);
    return state.isConnected
  });

  componentDidMount() {

    setTimeout(() => {
      try {
        NetInfo.addEventListener(async (state) => {
          console.log("Connection type", state.type);
          console.log("Is connected?", state.isConnected);

          if (state.isConnected === true) {

            console.log('yeah')
            const value = await AsyncStorage.getItem('@owner_number');
            const user_type = await AsyncStorage.getItem('@user_type');
            console.log("@owner_number", value)
            if (value !== null) {
              // We have data!!      
              console.log('if condition')
              let ownerId

              if (user_type === '2') {

                console.log('owner')
                this.props.navigation.navigate('Appointment_List')

              } else if (user_type === '1') {

                const appIsexist = await firestore().collection('appointment').where('user_mobileNo', '==', value).get()

                console.log("appIsexist boolean value ",appIsexist.empty)
                // appIsexist.forEach( e => {
                //   console.log(e.data())
                // })
                if(appIsexist.empty){
                  this.props.navigation.navigate('Book_Appointment')
                } else {
                  var Book_ownerId = ''
                  appIsexist.forEach( element => {
                    console.log(element.data().ownerId)
                    Book_ownerId = element.data().ownerId
                  })
                  this.props.navigation.navigate('Customer_Ticket', { ownerId: Book_ownerId })
                }
              } else {

                console.log('not Exist')
                this.props.navigation.navigate('Welcome')

              }
            } else {
              this.props.navigation.navigate('Welcome')
            }
          }
          else {
            Alert.alert('Check internet')
          }
        });
      } catch (error) {
        // Error retrieving data
        console.log('sorry')
        this.props.navigation.navigate('Welcome')
      }
    }, 3000);
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <Content contentContainerStyle={styles.container}>
            <Image
              style={styles.SplashScreen_Logo}
              source={require('../Assets/SplashScreen_Logo.jpg')}
            />
            <Image
              style={styles.SplashScreen_Vector}
              source={require('../Assets/SplashScreen_Vector.jpg')}
            />
          </Content>
        </Container>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  SplashScreen_Logo: {
    width: 105,
    height: 144,
  },
  SplashScreen_Vector: {
    marginTop: wp('40%'),
    width: 90.42,
    height: 25.44,
  }
});

export default Splashscreen;
