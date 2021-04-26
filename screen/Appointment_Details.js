import React, { Component } from 'react';
import { Alert, BackHandler, StyleSheet, ScrollView, View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Thumbnail, Icon } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import moment from 'moment';

class Appointment_Details extends React.Component {

  state = {
    Appointment_No: '',
    message: '',
    appointment: '',
    BST: '',
    BET: '',
    BST2: '',
    BET2: '',

    AST: '',
    AET: '',
    AST2: '',
    AET2: '',
    
    buisness_name: ''
  }
  backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => BackHandler.exitApp() }
    ]);
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backAction);
  }
  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
    console.log(this.props.route.params.ownerId)
    const value = await AsyncStorage.getItem('@owner_number');
    console.log("asyc", value)

    firestore().collection('appointment').where('user_mobileNo', '==', value).onSnapshot(async (snapshot) => {
      console.log(snapshot)
      const Shop_data = await firestore().collection('owner').doc(this.props.route.params.ownerId).get()
      console.log("This is shop data", Shop_data.data())
      snapshot.forEach(element => {
        // console.log(element.data())
        if (Shop_data.data().shift) {
          this.setState({
            Appointment_No: element.data().Appointment_No,

            shift: Shop_data.data().shift,

            BST: Shop_data.data().buisness_start_time,
            BET: Shop_data.data().buisness_end_time,

            BST2: Shop_data.data().second_buisness_start_time,
            BET2: Shop_data.data().second_buisness_end_time,
            
            AST: Shop_data.data().appointment_start_time,
            AET: Shop_data.data().appointment_end_time,

            AST2: Shop_data.data().second_appointment_start_time,
            AET2: Shop_data.data().second_appointment_end_time,

            buisness_name: Shop_data.data().Buisness_name
          })
        } else {
          this.setState({
            Appointment_No: element.data().Appointment_No,

            shift: Shop_data.data().shift,

            BST: Shop_data.data().buisness_start_time,
            BET: Shop_data.data().buisness_end_time,
            
            AST: Shop_data.data().appointment_start_time,
            AET: Shop_data.data().appointment_end_time,

            buisness_name: Shop_data.data().Buisness_name
          })
        }

      });
    })
  }

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: '#2570EC', flex: 1 }}>
        <ScrollView>
          <View style={{ padding: wp('2%'), alignItems: 'center', justifyContent: 'center', }}>
            <Text style={{ marginTop: hp('1%'), fontSize: wp('5%'), color: 'white', }}>
              Appointment Details
          </Text>
            <View style={{ marginTop: hp('2%'), borderBottomWidth: 1, borderColor: '#D4D4D4', width: '100%', }} />
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', }}>
            <View style={styles.RectangleShape}>
              <View style={{ marginTop: hp('2%'), alignItems: 'center', justifyContent: 'center' }}>
                <Thumbnail large source={require('../img/right.png')} />
                <Text style={{ marginTop: hp('3%'), fontSize: wp('6%'), textAlign: 'center' }}>
                  Your appointment has been added successfully.
              </Text>
              </View>
              <View style={{ zIndex: 11, marginTop: hp('5%'), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                <View style={{ backgroundColor: '#2570EC', width: wp('6.47%'), height: hp('3.5%'), borderRadius: 100, }} />
                <View style={{ zIndex: 2, borderBottomWidth: 2, borderStyle: 'dashed', borderColor: '#D4D4D4', width: wp('79%'), }} />
                <View style={{ backgroundColor: '#2570EC', width: wp('6.47%'), height: hp('3.5%'), borderRadius: 100, }} />
              </View>
              <View style={{ flexDirection: 'column', marginTop: hp('1%'), justifyContent: 'center', alignItems: 'center', }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: wp('3.5%'), fontWeight: 'bold' }}>Your number</Text>
                  <Text style={{ fontSize: wp('14%'), fontWeight: 'bold', color: '#2570EC' }}>{this.state.Appointment_No}</Text>
                </View>
              </View>
            </View>
            {this.state.Appointment_No != 1 ?
              <Text style={styles.message_text}>Thanks for your Booking.</Text>
              : <Text style={styles.message_text}>Its your turn now.</Text>}
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: hp('5%') }}>

            <Text style={styles.message_text}>{this.state.buisness_name} </Text>
            {this.state.shift ?
              <View>
                <Text style={styles.message_text}>Fisrt Half : From {moment(new Date(this.state.AST.seconds * 1000 + this.state.AST.nanoseconds / 1000000)).format('hh:mm a')} to {moment(new Date(this.state.AET.seconds * 1000 + this.state.AET.nanoseconds / 1000000)).format('hh:mm a')}</Text>
                <Text style={styles.message_text}>Second Half : From {moment(new Date(this.state.AST2.seconds * 1000 + this.state.AST2.nanoseconds / 1000000)).format('hh:mm a')} to {moment(new Date(this.state.AET2.seconds * 1000 + this.state.AET2.nanoseconds / 1000000)).format('hh:mm a')}</Text>
              </View>
              : <Text style={styles.message_text}>From {moment(new Date(this.state.AST.seconds * 1000 + this.state.AST.nanoseconds / 1000000)).format('hh:mm a')} to {moment(new Date(this.state.AET.seconds * 1000 + this.state.AET.nanoseconds / 1000000)).format('hh:mm a')}</Text>}
          </View>
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', width: wp('88%'), height: hp('7.5%'), borderRadius: 50, marginTop: hp('5%'), marginBottom: hp('5%') }}
              onPress={() => {
                this.props.navigation.navigate('Customer_Ticket', { ownerId: this.props.route.params.ownerId });
              }}>
              <Text style={{ color: '#2570EC', fontSize: wp('5%') }}>Okay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
export default Appointment_Details;

const styles = StyleSheet.create({
  RectangleShape: {
    marginTop: 20,
    width: wp('85 * 2%'),
    height: 'auto',
    borderRadius: 25,
    backgroundColor: 'white'
  },
  message_text: {
    color: '#FFFFFF',
    fontFamily: 'NotoSans-Regular',
    fontSize: 18,
    fontWeight: "500",
    fontStyle: 'normal',
    textAlign: 'center'
  }
});