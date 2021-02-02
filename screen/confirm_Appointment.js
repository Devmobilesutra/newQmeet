import React, { Component } from 'react';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Thumbnail, Icon } from 'native-base';
import { Dimensions, ImageBackground, StyleSheet, View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import functions from '@react-native-firebase/functions';
import moment from "moment";
import RN_Icon from 'react-native-vector-icons/AntDesign';

const styles = StyleSheet.create({
  header_bg: {
    backgroundColor: "#FFFFFF",
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#D4D4D4',
    marginLeft: 10,
    marginRight: 10
  },
  Header_Body: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  Header_Name: {
    fontFamily: 'NotoSans-Regular',
    color: '#2570EC',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '700'
  },
  content: {
    padding: 20
  },
})

class confirm_Appointment extends React.Component {

  state = {
    loader: false,
    ShopImage_url: '',
    shop_name: '',
    availability: '',
    appointment: '',
    userId: '',
    owner_number: '',
    user_name: '',
    user_number: '',
    owner_token: '',
    user_token: '',
    B_startTime: '',
    B_endTime: '',
    A_startTime: '',
    A_endTime: '',
    message: null,
    name: '',
    can_make_app: false,
  }
  componentWillUnmount() {
    this.setState({ can_make_app: false })
  }
  async componentDidMount() {
    this.setState({ loader: true })
    //fetching data for app user
    var value1 = await AsyncStorage.getItem('@owner_number'); // mobile no of app user
    var user_name1;
    let sap = await firestore().collection('user').where('mobile_no', '==', value1).get()
    sap.forEach(element => {
      console.log(element.data())
      user_name1 = element.data().name
    });
    // fetching data for that of owner profile with its data related to his user profile
    console.log("prop owner Id", this.props.route.params.ownerId)
    firestore().collection('owner').doc(this.props.route.params.ownerId).get().then(async (snapshot) => {

      const d = snapshot.data().user_Id;
      console.log(d)

      const snap = await firestore().doc(`user/${d}`).get();

      this.setState({
        // data of app user
        name: user_name1,
        // data of business owner from owner collection
        owner_number: snapshot.id,
        ShopImage_url: snapshot.data().image_url,
        shop_name: snapshot.data().Buisness_name,
        availability: snapshot.data().Availablity,
        userId: snapshot.data().user_Id,
        owner_token: snapshot.data().owner_token,
        B_startTime: snapshot.data().buisness_start_time,
        B_endTime: snapshot.data().buisness_end_time,
        A_startTime: snapshot.data().appointment_start_time,
        A_endTime: snapshot.data().appointment_end_time,
        // data of business owner from user collection
        user_number: snap.data().mobile_no,
        profileImage_url: snap.data().imageurl,
        user_token: snap.data().user_token,
        user_name: snap.data().name
      })
      this.checkOwner_availability()
    })
  }
  async checkOwner_availability() {
    console.log('checkOwner_availability function')
    var { name, availability, shop_name, B_startTime, B_endTime, A_startTime, A_endTime, can_make_app } = this.state;
    console.log("data set to variales", name ,availability, B_startTime, B_endTime, A_startTime, A_endTime, can_make_app);
    if (availability === true) {

      // Checking whether user taking appointment in available time period or not set bu=y owner
      var end_time = new Date(A_endTime.seconds * 1000 + A_endTime.nanoseconds / 1000000);
      var start_time = new Date(A_startTime.seconds * 1000 + A_startTime.nanoseconds / 1000000);
      var test = end_time.getTime() < new Date().getTime();
      var test2 = moment(end_time).format('HH:mm:ss') < moment().format('HH:mm:ss');
      // var test = 

      console.log(
        "this is end", end_time, typeof (end_time),
        "end time with moment", moment(end_time).format('HH:mm:ss'),
        " this is current time", moment(new Date()).format('HH:mm:ss'),
        " if cond", test,
        ' if cond with moment', test2)

      if (moment(end_time).format('HH:mm:ss') < moment().format('HH:mm:ss')) {
        this.setState({ message: `${shop_name}'s Online appointment time has over` })
      } else {
        this.setState({ can_make_app: true })
      }

    } else if (availability === false) {
      this.setState({ message: `Currently online appointment has stopped by business ${shop_name}` })
    }
    this.setState({ loader: false })
  }
  async confirm_Appointment() {

    if (await AsyncStorage.getItem('@owner_number') == 'true') { // checking whether user already set an appointment or not
      Alert.alert('You have already set an appointment')
    } else {

      this.setState({ loader: true })
      const value = await AsyncStorage.getItem('@owner_number');
      let userId
      let uName
      let utoken
      let user_image

      let sap = await firestore().collection('user').where('mobile_no', '==', value).get()
      sap.forEach(element => {
        console.log(element.data())
        userId = element.id;
        user_image = element.data().imageurl
        if (this.state.name) {
          uName = this.state.name
        }
        utoken = element.data().user_token
      });
      console.log(' confirm appointment ', userId + uName + utoken)

      const online_appointment1 = functions().httpsCallable('online_appointment1');
        online_appointment1({
            appointment_mode: false,
            ownerId: this.state.owner_number,
            userId: userId,
            user_number: value,
            userName: uName,
            owner_token: this.state.owner_token ? this.state.owner_token : null,
            user_token: utoken,
            user_image: user_image,
            appointment_mode: true
        }).then( async (data) => {
            console.log(" indian time will be ", data)
            
              // SetAppointment flag set to true since user had made an appointment
              await AsyncStorage.setItem('@SetAppointment', 'true');
              await AsyncStorage.setItem('@Book_ownerId', this.props.route.params.ownerId);

              this.setState({ loader: false })
              this.props.navigation.navigate('Appointment_Details', { ownerId: this.props.route.params.ownerId.replace(/"/g, "") })
        }).catch(err => {
            console.error();
            this.setState({ loader: false, customer_name: '', customer_number: '' });
        })
      // const appoinment_number = await firestore()
      //   .collection('appointment-count')
      //   .doc(this.state.owner_number)
      //   .get()
      //   .then(async (response) => {
      //     console.log('appointment number for making an appointment from appoiintment count collection', response.data().Appointment_numbers)
      //     await firestore()
      //       .collection('appointment')
      //       .add({
      //         ownerId: this.state.owner_number,
      //         timestamp: new Date(),
      //         userId: userId,
      //         user_mobileNo: value,
      //         user_name: uName,
      //         Appointment_No: response.data().Appointment_numbers,
      //         owner_token: this.state.owner_token,
      //         user_token: utoken,
      //         appointment_mode: true,
      //         user_image : user_image
      //       })
      //       .then(async (res) => {
      //         console.log(res)

      //         // SetAppointment flag set to true since user had made an appointment
      //         await AsyncStorage.setItem('@SetAppointment', 'true');
      //         await AsyncStorage.setItem('@Book_ownerId', this.props.route.params.ownerId);

      //         this.setState({ loader: false })
      //         this.props.navigation.navigate('Appointment_Details', { ownerId: this.props.route.params.ownerId.replace(/"/g, "") })
      //       })
      //   })
    }
  }

  render() {
    return (
      <Container>
        <Modal transparent={true} visible={this.state.loader} >
          <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <ActivityIndicator color='#2570EC' size='large' style={{ alignSelf: 'center' }} />
          </View>
        </Modal>
        {/* ------------------------- Header Bar ----------------------------------- */}
        <Header style={styles.header_bg} androidStatusBarColor="grey">
          <Left style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('qrcode_scanner') }}>
              <RN_Icon name='arrowleft' size={30} color="#000" />
            </TouchableOpacity>
          </Left>
          <Body style={styles.Header_Body}>
            <Title style={styles.Header_Name}>Book appointment</Title>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>
        <Container>
          <View >
            <Text numberOfLines={1} style={{ position: 'absolute', zIndex: 1, color: 'white', fontSize: wp('6.8%'), marginLeft: wp('40%'), marginTop: hp('26%'), fontWeight: 'bold' }}>{this.state.shop_name}</Text>
            <Text numberOfLines={1} style={{ position: 'absolute', zIndex: 1, color: '#2570EC', fontSize: wp('5%'), marginLeft: wp('40%'), marginTop: hp('32%'), fontWeight: 'bold' }}>{this.state.user_name}</Text>
            <Text numberOfLines={1} style={{ position: 'absolute', zIndex: 2, color: 'black', fontSize: wp('3.5%'), marginLeft: wp('40%'), marginTop: hp('36%'), fontWeight: 'bold' }}>{this.state.owner_number}</Text>
            {/* <View style={{ backgroundColor: 'black' }}>
              <Image style={{ width: '100%', height: hp('32%') }} source={this.state.ShopImage_url ? { uri: this.state.ShopImage_url } : require('../img/b1.jpg')} />
            </View> */}
            <ImageBackground style={{ width: wp('100%'), height: hp('32%'), backgroundColor: 'grey', justifyContent: 'center', alignItems: 'center' }} source={this.state.ShopImage_url ? { uri: this.state.ShopImage_url } : require('../img/b1.jpg')} >
              <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
              </View>
            </ImageBackground>
          </View>
          <View style={{ position: 'absolute' }}>

            <Image
              source={this.state.profileImage_url ? { uri: this.state.profileImage_url } : require('../img/face1.jpg')}
              style={{
                marginLeft: 35,
                marginTop: hp('24%'),
                width: wp('28%'),
                height: hp('15%'),
                borderWidth: 2,
                borderRadius: 100,
                zIndex: 999
              }} />
          </View>
        </Container>
        <Container contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>

          {this.state.can_make_app === true ?
            <Content >
              <Text style={{ fontFamily: 'Roboto_medium', fontWeight: '700', fontSize: 13, fontStyle: 'normal', marginLeft: wp('5%'), marginTop: hp('3%'), color: 'black' }}>
                Enter your name
                </Text>
              <TextInput
                value={this.state.name}
                onChangeText={(name) => { this.setState({ name: name }) }}
                keyboardType="ascii-capable"
                fontSize={26}
                placeholder='Your Name'
                style={{
                  marginTop: hp('1%'),
                  margin: hp('2%'),
                  color: '#5F6368',
                  borderColor: 'blue',
                  borderBottomWidth: 1,
                }} />
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => this.confirm_Appointment()}
                  style={{
                    backgroundColor: '#2570EC',
                    width: wp('90%'),
                    height: hp('7.5%'),
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: hp('10%'),
                    marginBottom: hp('10%')
                  }}>
                  <Text style={{ color: 'white', fontSize: wp('4%'), }}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </Content>
            :
            <Content contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', padding: wp('3%') }}>
              <Text style={{ color: 'red', fontSize: 20, textAlign: 'center' }}>{this.state.message}</Text>
            </Content>}
        </Container>
      </Container>
    );
  }
}
export default confirm_Appointment;
