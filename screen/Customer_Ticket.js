import React, { Component } from 'react';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import functions from '@react-native-firebase/functions';
import RN_Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {
  Alert,
  ActivityIndicator,
  BackHandler,
  Modal,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';

class Customer_Ticket extends React.Component {

  state = {
    Appointment_No: '',
    Appointment_id: '',
    Appointment_Timestamp: '',
    Appointment_Mobile: '',

    ShopImage: '',
    owner_profile: '',
    Buisness_Name: '',
    Owner_Name: '',
    Owner_Number: '',

    loader: false,

    shift: false,

    BST: '',
    BET: '',
    BST2: '',
    BET2: '',

    AST: '',
    AET: '',
    AST2: '',
    AET2: '',

    // For Owner Messages
    ownerMessage: '',
    PausedFlag: false
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
    this.setState({ loader: true });
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
    console.log('customer Ticket')
    console.log(this.props.route.params.ownerId, "\n type ", typeof (this.props.route.params.ownerId)) // Qr code scanned number

    const value = await AsyncStorage.getItem('@owner_number'); // userId (mobile no) of a app user
    console.log("asyc", value)

    firestore().collection('owner').doc(this.props.route.params.ownerId).onSnapshot((data) => {
      console.log(data.data().flag)
      this.setState({
        PausedFlag: data.data().flag.status,
        ownerMessage: data.data().flag.message,
      }, () => { console.log(" --- Paused flag " + typeof this.state.PausedFlag + " \n Message " + this.state.ownerMessage) })
    })
    const shop_image = await firestore().collection('owner').doc(this.props.route.params.ownerId).get() // fetching shop image from firebase
    // console.log(shop_image.data().image_url)
    console.log(shop_image.data().user_Id)
    console.log(shop_image.data().Buisness_name);

    const owner_profile = await firestore().collection('user').doc(shop_image.data().user_Id)
      .get()
      .then(owner_profile => {
        console.log(owner_profile.data().name)
        console.log(owner_profile.data().mobile_no)
        if (shop_image.data().image_url != undefined || shop_image.data().image_url !== "") { // for setting owner business image
          this.setState({
            ShopImage: shop_image.data().image_url
          })
        }
        if (owner_profile.data().imageurl != undefined) { // for setting owner's profile image 
          this.setState({
            owner_profile: owner_profile.data().imageurl
          })
        }

        console.log("shift 44444444444", shop_image.data().shift);
        // setting image to state for displaying
        if (shop_image.data().shift) {
          this.setState({
            // ShopImage: shop_image.data().image_url,
            // owner_profile: owner_profile.data().imageurl,

            Buisness_Name: shop_image.data().Buisness_name,
            Owner_Name: owner_profile.data().name,
            Owner_Number: owner_profile.data().mobile_no,

            shift: shop_image.data().shift,

            BST: shop_image.data().buisness_start_time,
            BET: shop_image.data().buisness_end_time,

            BST2: shop_image.data().second_buisness_start_time,
            BET2: shop_image.data().second_buisness_end_time,

            AST: shop_image.data().appointment_start_time,
            AET: shop_image.data().appointment_end_time,

            AST2: shop_image.data().second_appointment_start_time,
            AET2: shop_image.data().second_appointment_end_time,
          })
        } else {
          this.setState({

            Buisness_Name: shop_image.data().Buisness_name,
            Owner_Name: owner_profile.data().name,
            Owner_Number: owner_profile.data().mobile_no,

            shift: shop_image.data().shift,

            BST: shop_image.data().buisness_start_time,
            BET: shop_image.data().buisness_end_time,

            AST: shop_image.data().appointment_start_time,
            AET: shop_image.data().appointment_end_time,
          })
        }
      })

    firestore().collection('appointment').where('user_mobileNo', '==', value).onSnapshot(snapshot => { // realtime appointment changes from firebase
      console.log(snapshot)
      if (snapshot.empty) {
        this.setState({
          Appointment_No: null,
          Appointment_id: '',

          loader: false
        })
      } else {
        snapshot.forEach(element => {
          console.log("appoillllllllllllllllllllllllllllllllllllllll", element.id)
          this.setState({

            Appointment_No: element.data().Appointment_No,
            Appointment_id: element.id,
            Appointment_Timestamp: element.data().timestamp,
            Appointment_Mobile: element.data().user_mobileNo,

            loader: false
          })

        });
      }
    })
  }

  // alert to notify user that he canceled appointment succefully
  async MyAlert() {
    let appointment = await AsyncStorage.setItem('@SetAppointment', 'false')
    let Book_ownerId = await AsyncStorage.setItem('@Book_ownerId', '')
    Alert.alert(
      "",
      "Your Appointment was Completed Succesfully",
      [
        {
          text: "OK", onPress: () => {
            this.setState({ loader: false })
            this.props.navigation.navigate('Book_Appointment')
          }
        }
      ],
      { cancelable: false }
    );
  }

  // Firebase call to cancel or delete an appointment from user side
  cancel_appointment() {
    const { Appointment_No, Appointment_Mobile, Appointment_Timestamp, Appointment_id } = this.state;
    console.log('completed', this.state.Appointment_id)
    this.setState({ loader: true })

    const deleteAppointment = functions().httpsCallable('deleteAppointment');
    deleteAppointment({
      id: this.state.Appointment_id,
      Appointment_Mobile: Appointment_Mobile,
      Appointment_No: Appointment_No,
      Appointment_Timestamp: Appointment_Timestamp,
      Appointment_id: Appointment_id,
      OwnerId: this.props.route.params.ownerId
    })
      .then(async (snapshot) => {
        let appointment = await AsyncStorage.setItem('@SetAppointment', 'false')
        let Book_ownerId = await AsyncStorage.setItem('@Book_ownerId', '')
        this.setState({ loader: false })
        Alert.alert(
          "",
          "Your Appointment is been canceled Succesfully",
          [
            {
              text: "OK", onPress: () => {
                this.props.navigation.navigate('Book_Appointment')
              }
            }
          ],
          { cancelable: false }
        );
      })
      .catch(err => {
        Alert.alert(
          "Warning",
          "Error Occured",
          [
            {
              text: "OK", onPress: () => {
                this.setState({ loader: false })
              }
            }
          ],
          { cancelable: false }
        );
      })
  }

  // firebase messaging functions


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
            <TouchableOpacity
              onPress={() => { this.props.navigation.navigate('profile_details') }}
            >
              <RN_Icon name="menu" size={30} color="#000000" />
            </TouchableOpacity>
          </Left>
          <Body style={styles.Header_Body}>
            <Title style={styles.Header_Name}>Book appointment</Title>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>
        <Content>
          <View >
            <Text numberOfLines={1} style={{ position: 'absolute', zIndex: 1, color: 'white', fontSize: wp('6.8%'), marginLeft: wp('40%'), marginTop: hp('26%'), fontWeight: 'bold' }}>{this.state.Buisness_Name}</Text>
            <Text numberOfLines={1} style={{ position: 'absolute', zIndex: 1, color: '#2570EC', fontSize: wp('5%'), marginLeft: wp('40%'), marginTop: hp('32%'), fontWeight: 'bold' }}>{this.state.Owner_Name}</Text>
            <Text numberOfLines={1} style={{ position: 'absolute', zIndex: 2, color: 'black', fontSize: wp('3.5%'), marginLeft: wp('40%'), marginTop: hp('36%'), fontWeight: 'bold' }}>{this.state.Owner_Number}</Text>
            <View style={{ backgroundColor: 'black', opacity: 0.6 }}>
              <Image style={{ width: '100%', height: hp('32%') }} source={this.state.ShopImage ? { uri: this.state.ShopImage } : require('../img/b1.jpg')} />
            </View>
          </View>
          <View style={{ position: 'absolute' }}>

            <Image
              source={this.state.owner_profile ? { uri: this.state.owner_profile } : require('../img/five.jpg')}
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
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {this.state.Appointment_No ?
              <View style={styles.RectangleShape}>
                <View>
                  <View style={{
                    margin: 'auto',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Text style={{ fontSize: wp('3.5%'), fontWeight: 'bold', textAlign: 'center' }}>Your number</Text>
                    {this.state.Appointment_No ?
                      <Text style={{ fontSize: wp('12%'), color: '#2570EC' }}>{this.state.Appointment_No}</Text>
                      : <Text style={{ textAlign: 'center' }}> Either your appointment is deleted or you have cancelled appointment </Text>}
                  </View>
                </View>
                {/* {this.MyAlert()} */}
              </View> :
              <View style={styles.RectangleShape}>
                <View>
                  <View style={{
                    margin: hp('1.5%'),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>

                    <Text style={{ fontSize: wp('3.5%'), fontWeight: 'bold' }}>Your turn is over</Text>
                    {/* <TouchableOpacity onPress={() => {this.MyAlert()}}><Text>OK</Text></TouchableOpacity>*/}
                    <TouchableOpacity
                      onPress={() => { this.props.navigation.navigate('Book_Appointment') }}
                      style={{
                        backgroundColor: '#2570EC',
                        width: wp('30%'),
                        height: hp('6%'),
                        borderRadius: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: hp('3%'),
                      }}>
                      <Text style={{ color: 'white', fontSize: 16 }}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            }
            {/* {this.state.Appointment_No != 1 ?
              <Text style={styles.message_text}>Thanks for your Booking.</Text>
              : <Text style={styles.message_text}>Its your turn now.</Text>} */}
            {this.state.Appointment_No != 1 ?
              <Text style={styles.message_text}>Thanks for your Booking.</Text>
              : this.state.PausedFlag === false ? <Text style={styles.message_text}>Its your turn now.</Text> : null}
          </View>
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 'auto',
            padding: 20,
            // margin: 5
          }}>

            <Text style={styles.message_text}>{this.state.Buisness_Name} Time </Text>
            <Text style={styles.message_text}>
              {/* <Text>From {moment(new Date(this.state.BST.seconds * 1000 + this.state.BST.nanoseconds / 1000000)).format('hh:mm a')} to {moment(new Date(this.state.BET.seconds * 1000 + this.state.BET.nanoseconds / 1000000)).format('hh:mm a')}</Text> */}
              {this.state.shift ?
                <View>
                  <Text style={styles.message_text1}>Fisrt Half : From {moment(new Date(this.state.AST.seconds * 1000 + this.state.AST.nanoseconds / 1000000)).format('hh:mm a')} to {moment(new Date(this.state.AET.seconds * 1000 + this.state.AET.nanoseconds / 1000000)).format('hh:mm a')}</Text>
                  <Text style={styles.message_text1}>Second Half : From {moment(new Date(this.state.AST2.seconds * 1000 + this.state.AST2.nanoseconds / 1000000)).format('hh:mm a')} to {moment(new Date(this.state.AET2.seconds * 1000 + this.state.AET2.nanoseconds / 1000000)).format('hh:mm a')}</Text>
                </View>
                : <Text style={styles.message_text1}>From {moment(new Date(this.state.AST.seconds * 1000 + this.state.AST.nanoseconds / 1000000)).format('hh:mm a')} to {moment(new Date(this.state.AET.seconds * 1000 + this.state.AET.nanoseconds / 1000000)).format('hh:mm a')}</Text>}
            </Text>
            {this.state.PausedFlag == true ? <Text>{this.state.ownerMessage}</Text> : <Text>Queue has been started</Text>}
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "",
                  "Do you really want to cancel this appointment",
                  [
                    {
                      text: "No", onPress: () => { console.log('no deletion') }
                    },
                    {
                      text: "Yes", onPress: () => {
                        this.cancel_appointment()
                      }
                    }
                  ],
                  { cancelable: false }
                );
              }}
              style={{
                color: 'white',
                fontSize: wp('4%'),
                backgroundColor: '#FFFFFF',
                width: 200,
                height: hp('6%'),
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 15,
                marginBottom: 20
              }}>
              <Text style={{
                textAlign: 'center',
                color: 'black'
              }}> Cancel Appointment</Text>
            </TouchableOpacity>
          </View>
        </Content>
      </Container >
    );
  }
}
export default Customer_Ticket;

const styles = StyleSheet.create({
  RectangleShape: {
    marginTop: hp('14%'),
    width: wp('90 * 2%'),
    height: 'auto',
    borderRadius: 15,
    borderWidth: 1,
    backgroundColor: '#F2F2F2'
  },
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
  message_text: {
    color: '#EA4335',
    fontFamily: 'NotoSans-Regular',
    fontSize: 18,
    fontWeight: "500",
    fontStyle: 'normal',
    textAlign: 'center'
  },
  message_text1: {
    color: '#EA4335',
    fontFamily: 'NotoSans-Regular',
    fontSize: 14,
    fontWeight: "500",
    fontStyle: 'normal',
    textAlign: 'center'
  },
  message_text_owner: {
    color: '#EA4335',
    fontFamily: 'NotoSans-Regular',
    fontSize: wp('4'),
    fontWeight: "500",
    fontStyle: 'normal',
    textAlign: 'center'
  }
});