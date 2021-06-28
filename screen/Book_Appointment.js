import React, { Component } from 'react';
import { Container, Header, Title, Content, Left, Right, Body, Icon } from 'native-base';
import { Alert, StyleSheet, View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, BackHandler } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import RN_Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

class Book_Appointment extends React.Component {

  state = {
    type: ''
  }
  backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to Exit?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => BackHandler.exitApp() }
    ]);
    return true;
  };

  async componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backAction);
    const user_type = await AsyncStorage.getItem('@user_type');
    const SetAppointment = await AsyncStorage.getItem('@SetAppointment');
    const value = await AsyncStorage.getItem('@owner_number'); // userId (mobile no) of a app user
    console.log("asyc", value)

    console.log("SetAppointment", SetAppointment)
    this.setState({
      type: user_type
    })
    firestore().collection('appointment').where('user_mobileNo', '==', value).onSnapshot(snapshot => { // realtime appointment changes from firebase
      console.log("snapshot ?", snapshot.empty)
      // snapshot.forEach(d => {
      //   console.log("data", d.data())
      // })

      if (snapshot.empty) {
        snapshot.forEach(d => {
          console.log("ddddddddddddddddd", d.data())
        })
        // console.log("owner id", snapshot.ownerId)
        // this.props.navigation.navigate('Customer_Ticket',  snapshot.ownerId )
      } else {
        var OwnerID
        snapshot.forEach(d => {
          console.log("fffffffffff", d.data().ownerId);
          OwnerID = d.data().ownerId;
        })
        this.props.navigation.navigate('Customer_Ticket', { ownerId: OwnerID })
      }
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backAction);
  }

  render() {

    const { type } = this.state
    return (
      <Container>
        {/* Header Section Start */}
        <Header style={{ backgroundColor: 'white', height: hp('8%') }} androidStatusBarColor='grey' >
          <Left>
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('profile_details') }}>
              {/* <Text style={{ fontSize: wp('5.5%'), fontWeight: 'bold' }}>  ☰  </Text> */}
              <RN_Icon name="menu" size={30} color="#000000" />
            </TouchableOpacity>
          </Left>
          <Body style={{ position: 'relative', marginLeft: wp('-30%'), justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ width: 79, height: 36 }} source={require('../Assets/Group_31.jpg')} />
          </Body>
          {/* <Right /> */}
        </Header>
        {/* Header Section End */}

        <Container>
          <Content>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image style={{ width: '100%', height: hp('32%') }} source={require('../img/ten.png')} />
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('3%') }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'NotoSans-Regular',
                  fontStyle: 'normal',
                  fontWeight: '600',
                  color: '#2570EC',
                  lineHeight: 21.79,
                  textAlign: 'center'
                }}>Avoid staying in long queue
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: hp('4%') }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Roboto_medium',
                  fontSize: 15,
                  fontWeight: '100',
                  color: '#343434',
                  lineHeight: 20
                }}>
                Book an appointment from anywhere and{'\n'}
                check real time updates of{'\n'}
                your appointment
              </Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('qrcode_scanner')}
                style={{
                  backgroundColor: '#2570EC',
                  width: wp('90%'),
                  height: hp('7.5%'),
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp('13%'),
                }}>
                <Text style={{ color: 'white', fontSize: wp('4%'), }}>Book appointment</Text>
              </TouchableOpacity>

              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('6%'), marginBottom: hp('6%') }}>
                <Text style={{ fontSize: wp('3.5%'), color: '#343434', textAlign: 'center' }}> Provide best services to your customers? </Text>
                <TouchableOpacity onPress={() =>
                  this.props.navigation.navigate('businessForm')
                  // this.props.navigation.navigate('BLogin1')
                }><Text style={{ fontSize: wp('3.5%'), color: 'red', textAlign: 'center' }}> Sign-up your business with us </Text></TouchableOpacity>
              </View>
            </View>
          </Content>
        </Container>
      </Container>
    );
  }
}
export default Book_Appointment;