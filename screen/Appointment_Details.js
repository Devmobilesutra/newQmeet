import React, { Component } from 'react';
import { Button, StyleSheet, View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, } from 'react-native';
import { Thumbnail, Icon } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';

class Appointment_Details extends React.Component {

  
  state = {
    Appointment_No: ''
  }
  async componentDidMount() {
    console.log(this.props.route.params.ownerId)
    const value = await AsyncStorage.getItem('@owner_number');
    console.log("asyc",value)
    firestore().collection('appointment').where('user_mobileNo', '==', value).onSnapshot( snapshot => {
      console.log(snapshot)
      snapshot.forEach(element => {
        // console.log(element.data())
        this.setState({
          Appointment_No: element.data().Appointment_No
        })
      });
    })
  }

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: '#2570EC', flex: 1 }}>
        <View style={{ padding: wp('2%'), alignItems: 'center', justifyContent: 'center', }}>
          <Text style={{ marginTop: hp('1%'), fontSize: wp('5%'), color: 'white', }}>
            Appointment detail
          </Text>
          <View style={{ marginTop: hp('2%'), borderBottomWidth: 1, borderColor: '#D4D4D4', width: '100%', }} />
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', }}>
          <View style={styles.RectangleShape}>
            <View style={{ marginTop: hp('2%'), alignItems: 'center', justifyContent: 'center' }}>
              <Thumbnail large source={require('../img/right.png')} />
              <Text style={{ marginTop: hp('3%'), fontSize: wp('6%') }}>
                Your appointment has been
                </Text>
              <Text style={{ fontSize: wp('6%') }}>
                added successfully.
                </Text>
            </View>
            <View style={{ zIndex: 11, marginTop: hp('6%'), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
              <View style={{ backgroundColor: '#2570EC', width: wp('6.47%'), height: hp('3.5%'), borderRadius: 100, }} />
              <View style={{ zIndex: 2, borderBottomWidth: 2, borderColor: '#D4D4D4', width: wp('79%'), }} />
              <View style={{ backgroundColor: '#2570EC', width: wp('6.47%'), height: hp('3.5%'), borderRadius: 100, }} />
            </View>
            <View style={{ flexDirection: 'row', marginTop: hp('1%'), justifyContent: 'center', alignItems: 'center', }}>
              <View>
                <Text style={{ fontSize: wp('3.5%'), fontWeight: 'bold' }}>Your number</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
              <View>
                <Text style={{ fontSize: wp('14%'), fontWeight: 'bold', color: '#2570EC' }}>{this.state.Appointment_No}</Text>
              </View>
            </View>
          </View>

        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp('5%') }}>
          {/* <Text style={{ fontSize: wp('5.8%'), color: 'white' }}>Host will be available in 15 min.</Text> */}
        </View>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', width: wp('88%'), height: hp('7.5%'), borderRadius: 50, marginTop: hp('5%'), }}
            onPress={() => {
              this.props.navigation.navigate('Customer_Ticket',{ ownerId: this.props.route.params.ownerId });
            }}>
            <Text style={{ color: '#2570EC', fontSize: wp('5%') }}>Okay</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
export default Appointment_Details;

const styles = StyleSheet.create({
  RectangleShape: {
    marginTop: 20,
    width: wp('85 * 2%'),
    height: hp('50%'),
    borderRadius: 25,
    backgroundColor: 'white'

  }

});