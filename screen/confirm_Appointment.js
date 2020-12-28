import React, { Component } from 'react';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Thumbnail, Icon } from 'native-base';
import { StyleSheet, View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import functions from '@react-native-firebase/functions';
import moment from "moment";

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
  }
  async componentDidMount() {
    this.setState({
      loader: true
    })
    console.log(this.props.route.params.ownerId)
    const owner = firestore().collection('owner').doc(this.props.route.params.ownerId).get().then(owner => {
      if (!owner.exists) {
        Alert.alert(
          'Warning',
          `Youe Entered Wrong Owner Number`,
          [
            {
              text: 'OK',
              onPress: () => {
                this.props.navigation.navigate('qrcode_scanner');
              },
            },
          ],
          { cancelable: false },
        );
      }

      const checkAvailability = functions().httpsCallable('check');
      checkAvailability({
        ownerId: this.props.route.params.ownerId.replace(/"/g, "") //owner number was coming with double quotes so i just remove them by replace function
      })
        .then(snapshot => {
          console.log('Available');
          console.log("check function snapshot", snapshot)
          console.log("check function snapshot 2", snapshot.data.msg)

          if (snapshot.data.msg) {
            this.setState({
              message: snapshot.data.msg,
              appointment: snapshot.data.appointment
            }, () => {
              console.log(this.state.message)
              console.log(this.state.appointment)
              this.checkOwner_availability()
            })
          } else {
            this.setState({
              message: '',
              appointment: false
            }, () => {
              this.checkOwner_availability()
            })
          }
        })
        .catch(err => {
          Alert.alert('You Entered a wrong number');
          console.log('Not Available', err);
        })
    })
  }
  async checkOwner_availability() {
    console.log('here is me')
    firestore()
      .collection('owner')
      .doc(this.props.route.params.ownerId.replace(/"/g, ""))
      .get()
      .then(snapshot => {

        console.log(this.props.route.params.ownerId)
        console.log(snapshot)
        console.log("url : ", snapshot.data().user_Id)
        this.setState({
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
        })
        const d = snapshot.data().user_Id;
        console.log(d)

        firestore()
          .doc(`user/${d}`)
          .get()
          .then(snap => {
            console.log("my isd llllllllll", snap.data())
            this.setState({
              user_number: snap.data().mobile_no,
              user_name: snap.data().name,
              profileImage_url: snap.data().imageurl,
              user_token: snap.data().user_token
            })
          }).catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
      })
    this.setState({
      loader: false
    })
  }
  async confirm_Appointment() {

    if (await AsyncStorage.getItem('@owner_number') == 'true') { // checking whether user already set an appointment or not

      Alert.alert('You have already set an appointment')

    } else {

      this.setState({
        loader: true
      })
      const value = await AsyncStorage.getItem('@owner_number');
      let userId
      let uName
      let utoken

      let sap = await firestore().collection('user').where('mobile_no', '==', value).get()
      sap.forEach(element => {
        console.log(element.data())
        userId = element.id
        if (this.state.name) {
          uName = this.state.name
        } else {
          uName = element.data().name
        }
        utoken = element.data().user_token
      });
      console.log(' confirm appointment ', userId + uName + utoken)
      const addAppointment = functions().httpsCallable('online_appointment');
      addAppointment({
        ownerId: this.state.owner_number,
        userId: userId,
        user_number: value,
        userName: uName,
        user_token: utoken,
        owner_token: this.state.owner_token
      })
        .then(async (snap) => {
          console.log("appointment set for user :", snap)

          // SetAppointment flag set to true since user had made an appointment
          await AsyncStorage.setItem('@SetAppointment', 'true');
          await AsyncStorage.setItem('@Book_ownerId', this.props.route.params.ownerId);

          this.setState({ loader: false })
          this.props.navigation.navigate('Appointment_Details', { ownerId: this.props.route.params.ownerId.replace(/"/g, "") })
        })
        .catch(error => {
          this.setState({
            loader: false
          })
          Alert.alert('Problem occured while an Appointment :' + error)
        })
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
        <Header style={{
          backgroundColor: 'white', height: hp('8%'), alignItems: 'center',
          justifyContent: 'center',
        }} androidStatusBarColor='grey'>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Book_Appointment')} >
              <Text style={{ fontSize: wp('8%') }}>←</Text>
            </TouchableOpacity>
          </Left>
          <Body >
            <Text style={{
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontStyle: 'normal',
              fontFamily: 'Noto Sans',
              fontSize: wp('5%'),
              color: '#2570EC',
              fontFamily: 'Averia Serif Libre',
            }}> Book appointment </Text>
          </Body>
        </Header>
        <Content>
          <View >
            <Text style={{ position: 'absolute', zIndex: 1, color: 'white', fontSize: wp('6.8%'), marginLeft: wp('40%'), marginTop: hp('26%'), fontWeight: 'bold' }}>{this.state.shop_name}</Text>
            <Text style={{ position: 'absolute', zIndex: 1, color: '#2570EC', fontSize: wp('5%'), marginLeft: wp('40%'), marginTop: hp('32%'), fontWeight: 'bold' }}>{this.state.user_name}</Text>
            <Text style={{ position: 'absolute', zIndex: 2, color: 'black', fontSize: wp('3.5%'), marginLeft: wp('40%'), marginTop: hp('36%'), fontWeight: 'bold' }}>{this.state.owner_number}</Text>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.7)', opacity: 0.4 }}>
              <Image style={{ width: '100%', height: hp('32%') }} source={this.state.ShopImage_url ? { uri: this.state.ShopImage_url } : require('../img/b1.jpg')} />
            </View>
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
              }} />
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: hp('12%'),
              borderBottomWidth: 1,
              borderColor: '#D4D4D4',
              width: wp('90%'),
              marginLeft: wp('5%')
            }}
          />
          {/* {this.show()} */}
        </Content>
        <Content contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>

          {this.state.appointment === true ?
            <Content>
              <View>
                <Text style={{ fontWeight: 'bold', fontSize: wp('4%'), marginLeft: wp('5%'), marginTop: hp('3%'), color: 'black' }}>
                  Enter your name
                </Text>
                <TextInput
                  value={this.state.name}
                  onChangeText={(name) => {
                    this.setState({ name: name })
                  }}
                  keyboardType="ascii-capable"
                  fontSize={35}
                  placeholder='Your Name Please'
                  style={{
                    marginTop: hp('1%'),
                    margin: hp('2%'),
                    color: '#5F6368',
                    borderColor: 'blue',
                    borderBottomWidth: 1,
                  }}></TextInput>
              </View>

              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ justifyContent: 'center', alignItems: 'center', margin: wp('3%') }}>{this.state.message}</Text>
                <TouchableOpacity
                  onPress={() => this.confirm_Appointment()}
                  style={{
                    backgroundColor: '#2570EC',
                    width: wp('90%'),
                    height: hp('7.5%'),
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // marginTop: hp('15%'),
                  }}>
                  <Text style={{ color: 'white', fontSize: wp('4%'), }}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </Content>
            :
            <Content contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', padding: wp('3%') }}>
              <Text style={{ color: 'red', fontSize: 20 }}>{this.state.message}</Text>
            </Content>}
        </Content>
      </Container>
    );
  }
}
export default confirm_Appointment;