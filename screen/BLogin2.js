import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import { Container, Header, Title, Content, Footer, FooterTab, Left, Right, Body, Icon, Text, View, Card, CardItem, Tab, Tabs, TabHeading } from 'native-base';
import { ActivityIndicator, StyleSheet, Modal, SafeAreaView, Image, TextInput, TouchableOpacity, Alert, } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import storage from '@react-native-firebase/storage';
import RN_Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { Value } from 'react-native-reanimated';

class BLogin2 extends Component {

  constructor(props) {
    super(props)
    this.state = {
      buisness_modalVisible: false,
      appointment_modalVisible: false,
      start_time: '',
      end_time: '',
      app_start_time: '',
      app_end_time: '',
      date: new Date(),
      owner_number: '',
      loader: false,
      fs_imageurl: ''
    };
  }

  componentDidMount() {
    console.log('Image Path', this.props.route.params.imagePath)
    console.log('Image Path', this.props.route.params.buisness_Name)
    // this.asyncData()
  }
  /*..**************************appointment start Time******************************..*/
  open_appointment() {
    this.setState({ appointment_modalVisible: !this.state.appointment_modalVisible })
  }
  close_appointment() {
    this.setState({
      appointment_modalVisible: !this.state.appointment_modalVisible,
      app_start_time: null
    }, () => {
      // Alert.alert('appointment time', moment(this.state.app_start_time).format('DD.MM.YY'))
    })
  }
  set_app_startTime() {
    this.setState({
      appointment_modalVisible: !this.state.appointment_modalVisible
    }, () => {
      // Alert.alert('appointment time', moment(this.state.app_start_time).format('DD.MM.YY'))
    })
  }

  /*..**************************appointment end Time******************************..*/
  cancel_appointment_endTime() {
    this.setState({
      appointment_modalVisible: !this.state.appointment_modalVisible,
      app_end_time: ''
    }, () => {
      // Alert.alert('appointment time', moment(this.state.app_end_time).format('DD.MM.YY'))
    })
  }
  set_appointment_endTime() {
    this.setState({
      appointment_modalVisible: !this.state.appointment_modalVisible,
    }, () => {
      // Alert.alert('appointment time', moment(this.state.app_end_time).format('hh:mm:ss a'))
    })
  }


  /*...................********************buisness start Time****************************...................*/
  cancel_start_time = () => {
    this.setState({
      buisness_modalVisible: !this.state.buisness_modalVisible,
      start_time: null,
    }, () => {
      console.log("start time1", this.state.start_time)
      // Alert.alert("sssssssssss",moment(this.state.start_time).format('DD.MM.YY'))
    })
  }
  start_buisness_time() {
    this.setState({
      buisness_modalVisible: !this.state.buisness_modalVisible,
    }, () => {
      console.log("start time2", moment(this.state.start_time).format('hh:mm:ss a'))
      // Alert.alert("sssssssssss", moment(this.state.start_time).format('DD.MM.YY'))
    })
  }

  /*...................********************buisness end Time****************************...................*/
  cancel_end_time() {
    console.log('cancel button')
    this.setState({
      buisness_modalVisible: !this.state.buisness_modalVisible,
      end_time: null,
    }, () => {
      console.log("start time2", this.state.start_time)
      // Alert.alert("eeeeeeeeeee", moment(this.state.start_time).format('HH.MM.SS'))
      console.log()
    })
  }

  end_buisness_time() {
    console.log('Show Buisness Modal end')
    console.log("end time2", this.state.end_time)
    this.setState({
      buisness_modalVisible: !this.state.buisness_modalVisible
    }, () => {
      console.log("start time2", moment(this.state.end_time).format('hh:mm:ss a'))
    })
  }

  signUp = async () => {

    if (this.state.start_time) {

      if (this.state.end_time) {

        if (this.state.app_start_time) {

          if (this.state.app_end_time) {
            if (this.state.app_end_time.getTime() > this.state.end_time.getTime()) {
              console.log('ggggjwke.ds nIUGBRkjvihugrkn .djclmIJhu:dv acmlIJOe:whhhhhhmKLDWIOEJWURH')
              Alert.alert('Appointment End time should be less than Buisness End Time')
            } else {

              console.log("Appointment start time", moment(this.state.app_start_time).format('hh:mm:ss a'))
              console.log("Appointment end time", moment(this.state.app_end_time).format('hh:mm:ss a'))
              console.log("Buisness start time", moment(this.state.start_time).format('hh:mm:ss a'))
              console.log("Buisness end time", moment(this.state.end_time).format('hh:mm:ss a'))

              this.setState({ loader: true });
              let download_url
              if (this.props.route.params.fileName) {
                let reference = storage().ref(this.props.route.params.fileName);
                let task = reference.putFile(this.props.route.params.imagePath);
                task.then(async (response) => {
                  console.log('Image uploaded to the bucket!');
                  let download_url = await reference.getDownloadURL()

                  firestore()
                    .collection('owner')
                    .doc(this.props.route.params.owner_number)
                    .set({
                      user_Id: this.props.route.params.userId,
                      Buisness_name: this.props.route.params.buisness_Name,
                      buisness_start_time: this.state.start_time,
                      buisness_end_time: this.state.end_time,
                      appointment_start_time: this.state.app_start_time,
                      appointment_end_time: this.state.app_end_time,
                      image_url: download_url ? download_url : '',
                      Availablity: true
                    }).then(async () => {
                      console.log('your are registered succesfully')
                      const setvalue = await AsyncStorage.setItem(
                        '@user_type', '2' // 1 for user and two for owner. by default all are users
                      );
                      this.setState({ loader: false });
                      this.props.navigation.navigate('BLogin3')
                    })
                }).catch((e) => {
                  console.log('uploading image error => ', e);
                  this.setState({ loader: false });
                });
              } else {
                firestore()
                  .collection('owner')
                  .doc(this.props.route.params.owner_number)
                  .set({
                    user_Id: this.props.route.params.userId,
                    Buisness_name: this.props.route.params.buisness_Name,
                    buisness_start_time: this.state.start_time,
                    buisness_end_time: this.state.end_time,
                    appointment_start_time: this.state.app_start_time,
                    appointment_end_time: this.state.app_end_time,
                    image_url: download_url ? download_url : '',
                    Availablity: true
                  }).then(async () => {
                    console.log('your are registered succesfully')
                    const setvalue = await AsyncStorage.setItem(
                      '@user_type', '2' // 1 for user and two for owner. by default all are users
                    );
                    this.setState({ loader: false });
                    this.props.navigation.navigate('BLogin3')
                  })
              }

              console.log('owner number', this.props.route.params.owner_number)
              console.log('fs_imageurl', this.state.fs_imageurl)
            }
          } else {
            Alert.alert("Please select your Appointment end time")
          }
        } else {
          Alert.alert("Please select your Appointment start time")
        }
      } else {
        Alert.alert("Please select your Buisness end time")
      }
    } else {
      Alert.alert("Please select your Buisness start time")
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
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('BLogin1') }}>
              <RN_Icon name='arrowleft' size={30} color="#000" />
            </TouchableOpacity>
          </Left>
          <Body style={styles.Header_Body}>
            <Title style={styles.Header_Name}>Business sign-up</Title>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>
        <Content padder>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: wp('6%'), fontWeight: '600', fontStyle: 'normal', fontFamily: 'Roboto' }}>
              Business time
            </Text>
            <Text style={{ fontSize: wp('3.8%'), fontStyle: 'normal', fontFamily: 'NotoSans' }}>
              Your daily business time
            </Text>
          </View>
          <CardItem style={{
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#BDBDBD',
            height: hp('12%'),
            marginBottom: hp('5%'),
          }}>
            <TouchableOpacity
              onPress={() => {
                this.start_buisness_time()
              }}
            >
              <Body
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <View>
                  <Text>Start Time</Text>
                  <Text>{this.state.start_time ? moment(this.state.start_time).format('hh:mm:ss a') : '--:--'}</Text>
                </View>
                <View>
                  <Text>End Time</Text>
                  <Text>{this.state.end_time ? moment(this.state.end_time).format('hh:mm:ss a') : '--:--'}</Text>
                </View>
                <Text>
                  <RN_Icon name='right' size={25} color="#000" />
                </Text>
              </Body>
            </TouchableOpacity>
          </CardItem>
          <View style={{ padding: 20 }}>
            <Text numberOfLines={1} style={{ fontSize: wp('6%'), fontStyle: 'normal', fontFamily: 'Roboto' }}>
              Appointment booking time
            </Text>
            <Text style={{ fontSize: wp('3.8%'), fontWeight: '500', fontStyle: 'normal', fontFamily: 'NotoSans' }}>
              Your customers can book an appointment daily
            </Text>
          </View>
          <CardItem style={{
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#BDBDBD',
            height: hp('12%'),
          }}>
            <TouchableOpacity onPress={() => {
              this.open_appointment()
            }}>
              <Body
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <View>
                  <Text>Start Time</Text>
                  <Text>{this.state.app_start_time ? moment(this.state.app_start_time).format('hh:mm:ss a') : '--:--'} </Text>
                </View>
                <View>
                  <Text>End Time</Text>
                  <Text>{this.state.app_end_time ? moment(this.state.app_end_time).format('hh:mm:ss a') : '--:--'} </Text>
                </View>
                <Text>
                  <RN_Icon name='right' size={25} color="#000" />
                </Text>
              </Body>
            </TouchableOpacity>
          </CardItem>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <TouchableOpacity
              onPress={() => {
                // this.props.navigation.navigate('BLogin3')
                this.signUp()
              }}
              style={{
                backgroundColor: '#2570EC',
                width: wp('90%'),
                height: hp('7.5%'),
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: hp('12%'),
              }}
            >
              <Text style={{ color: '#FFFFFF' }}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/*-----------------------buisness_time modal-------------------------------*/}
          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.buisness_modalVisible}>
              <View style={styles.overlay}>
                <View style={styles.container2}>
                  <Tabs hasTabs>
                    <Tab
                      heading="Start Time"
                      activeTabStyle={{ backgroundColor: '#FFFFFF' }}
                      activeTextStyle={{ color: '#2570EC' }}
                      tabStyle={{ backgroundColor: '#2570EC', elevation: 0 }}
                    // tabContainerStyle={{ elevation: 0 }}
                    >
                      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp('5%'), }}>
                        <DatePicker
                          date={this.state.date}
                          mode="time"
                          isVisible={true}
                          androidVariant="nativeAndroid"
                          onDateChange={(start_time) => this.setState({ start_time })}
                        />
                        <Body
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: hp('5%'),
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              backgroundColor: 'rgba(37, 112, 236, 0.2)',
                              borderRadius: 24,
                              height: 50,
                              width: 150,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onPress={() => { this.cancel_start_time() }}
                          >
                            <Text style={{ color: '#2570EC' }}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              marginLeft: wp('4%'),
                              backgroundColor: '#2570EC',
                              borderRadius: 24,
                              height: 50,
                              width: 150,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onPress={() => { this.start_buisness_time() }}
                          >
                            <Text style={{ color: '#FFFFFF' }}>Done</Text>
                          </TouchableOpacity>
                        </Body>
                      </View>
                    </Tab>
                    <Tab
                      heading="End Time"
                      activeTabStyle={{ backgroundColor: '#FFFFFF' }}
                      activeTextStyle={{ color: '#2570EC' }}
                      tabStyle={{ backgroundColor: '#2570EC' }}
                    >
                      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                        <DatePicker
                          date={this.state.date}
                          mode="time"
                          isVisible={true}
                          androidVariant="nativeAndroid"
                          onDateChange={(end_time) => { this.setState({ end_time }) }}
                        />
                        <Body
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 60
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              backgroundColor: 'rgba(37, 112, 236, 0.2)',
                              borderRadius: 24,
                              height: 50,
                              width: 150,
                              justifyContent: 'center',
                              alignItems: 'center',
                              // marginTop: 90
                            }} end_buisness_time
                            onPress={() => { this.cancel_end_time() }}
                          >
                            <Text style={{ color: '#2570EC' }}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              marginLeft: wp('4%'),
                              backgroundColor: '#2570EC',
                              borderRadius: 24,
                              height: 50,
                              width: 150,
                              justifyContent: 'center',
                              alignItems: 'center',
                              // marginTop: 90
                            }}
                            onPress={() => { this.end_buisness_time() }}
                          >
                            <Text style={{ color: '#FFFFFF' }}>Done</Text>
                          </TouchableOpacity>
                        </Body>
                      </View>
                    </Tab>
                  </Tabs>
                </View>
              </View>
            </Modal>
          </View>

          {/*-----------------------appointment_time modal-------------------------------*/}
          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.appointment_modalVisible}>
              <View style={styles.overlay}>
                <View style={styles.container2}>
                  <Tabs hasTabs>
                    <Tab
                      heading="Start Time"
                      activeTabStyle={{ backgroundColor: '#FFFFFF' }}
                      activeTextStyle={{ color: '#2570EC' }}
                      tabStyle={{ backgroundColor: '#2570EC' }}
                    >
                      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                        <DatePicker
                          date={this.state.date}
                          mode="time"
                          isVisible={true}
                          androidVariant="nativeAndroid"
                          onDateChange={(app_start_time) => this.setState({ app_start_time })}
                        />
                        <Body
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 60
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              backgroundColor: 'rgba(37, 112, 236, 0.2)',
                              borderRadius: 24,
                              height: 50,
                              width: 150,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onPress={() => { this.close_appointment() }}
                          >
                            <Text style={{ color: '#2570EC' }}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              marginLeft: wp('4%'),
                              backgroundColor: '#2570EC',
                              borderRadius: 24,
                              height: 50,
                              width: 150,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onPress={() => { this.set_app_startTime() }}
                          >
                            <Text style={{ color: '#FFFFFF' }}>Done</Text>
                          </TouchableOpacity>
                        </Body>
                      </View>
                    </Tab>
                    <Tab
                      heading="End Time"
                      activeTabStyle={{ backgroundColor: '#FFFFFF' }}
                      activeTextStyle={{ color: '#2570EC' }}
                      tabStyle={{ backgroundColor: '#2570EC' }}
                    >
                      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                        <DatePicker
                          date={this.state.date}
                          mode="time"
                          isVisible={true}
                          androidVariant="nativeAndroid"
                          onDateChange={(app_end_time) => { this.setState({ app_end_time }) }}
                        />

                        <Body
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 60
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              backgroundColor: 'rgba(37, 112, 236, 0.2)',
                              borderRadius: 24,
                              height: 50,
                              width: 150,
                              justifyContent: 'center',
                              alignItems: 'center',
                              // marginTop: 90
                            }}
                            onPress={() => { this.cancel_appointment_endTime() }}
                          >
                            <Text style={{ color: '#2570EC' }}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              marginLeft: wp('4%'),
                              backgroundColor: '#2570EC',
                              borderRadius: 24,
                              height: 50,
                              width: 150,
                              justifyContent: 'center',
                              alignItems: 'center',
                              // marginTop: 90
                            }}
                            onPress={() => { this.set_appointment_endTime() }}
                          >
                            <Text style={{ color: '#FFFFFF' }}>Done</Text>
                          </TouchableOpacity>
                        </Body>
                      </View>
                    </Tab>
                  </Tabs>
                </View>
              </View>
            </Modal>
          </View>

        </Content>
      </Container>
    );
  }
}

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
  //////////////////////////////modal style///////////////////////////////
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  container2: {
    backgroundColor: 'white',
    width: '100%',
    height: 450,
    paddingTop: 12,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabTextStyle: {
    color: 'red'
  }
})
export default BLogin2;
