import React, { Component } from 'react';
import { Button, StyleSheet, View, Text, TouchableOpacity, Alert, SafeAreaView, } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';

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

                // let appointment = await AsyncStorage.getItem('@SetAppointment')
                // let Book_ownerId = await AsyncStorage.getItem('@Book_ownerId')
                // console.log('user')
                // if (appointment == 'true') {
                //   this.props.navigation.navigate('Customer_Ticket', { ownerId: Book_ownerId })
                // } else {
                //   this.props.navigation.navigate('Book_Appointment')
                // }

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
        <View style={styles.container}>
          <View
            style={{
              marginTop: hp('12%'),
              borderRadius: 100,
              width: wp('35%'),
              height: hp('18%'),
              backgroundColor: '#E9E9E9',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: wp('20%'),
                color: '#818181',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'Averia Serif Libre',
              }}>
              Q
            </Text>
          </View>
          <View
            style={{
              marginTop: hp('3%'),
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#2570EC',
                width: wp('6.47%'),
                height: hp('3.5%'),
                borderRadius: 100,
                marginRight: wp('3%'),
              }}
            />
            <View
              style={{
                backgroundColor: '#FBBC05',
                width: wp('6.47%'),
                height: hp('3.5%'),
                borderRadius: 100,
                marginRight: wp('3%'),
              }}
            />
            <View
              style={{
                backgroundColor: '#EA4335',
                width: wp('6.47%'),
                height: hp('3.5%'),
                borderRadius: 100,
                marginRight: wp('3%'),
              }}
            />
            <View
              style={{
                backgroundColor: '#199039',
                width: wp('6.47%'),
                height: hp('3.5%'),
                borderRadius: 100,
              }}
            />
          </View>

          <TouchableOpacity
            style={{
              marginTop: hp('35%'),
            }}
          // onPress={() => this.props.navigation.navigate('Welcome')}
          >
            <Text
              style={{
                fontSize: 40,
                color: '#C4C4C4',
                fontFamily: 'Averia Serif Libre',
              }}>
              Qmeet
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
});

export default Splashscreen;
