import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import { Container, Header, Title, Content, Footer, FooterTab, Left, Right, Body, Icon, Text, View, Card, CardItem, Tab, Tabs, TabHeading } from 'native-base';
import { Button, StyleSheet, Modal, SafeAreaView, Image, TextInput, TouchableOpacity, Alert, } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
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
    };
  }

  componentDidMount() {
    this.asyncData()
  }
  asyncData = async () => {
    const owner_number = await AsyncStorage.getItem('@owner_number')
    this.setState({ owner_number })
    await firestore()
      .collection('owner')
      .doc(owner_number)
      .get()
      .then(querySnapshop => {
        console.log('user ID', querySnapshop.id)
        console.log('owner data', querySnapshop.data())
        let AST = querySnapshop.data().appointment_start_time
        let AET = querySnapshop.data().appointment_end_time
        let BST = querySnapshop.data().buisness_start_time
        let BET = querySnapshop.data().buisness_end_time

        // if (AST && AET && BST && BET) {
        //   this.setState({
        //     start_time: querySnapshop.data().buisness_start_time,
        //     end_time: querySnapshop.data().buisness_end_time,
        //     app_start_time: querySnapshop.data().appointment_start_time,
        //     app_end_time: querySnapshop.data().appointment_end_time,
        //   })
        // }
        // querySnapshop.forEach( doc => {
        //   console.log('user ID', doc.id, doc.data())
        // })
      })
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
              console.log('owner number', this.state.owner_number)
              const uploadtime = await firestore()
                .collection('owner')
                .doc(this.state.owner_number)
                .update({
                  buisness_start_time: this.state.start_time,
                  buisness_end_time: this.state.end_time,
                  appointment_start_time: this.state.app_start_time,
                  appointment_end_time: this.state.app_end_time,
                  Availablity: true
                }).then(() => {
                  console.log('your are registered succesfully')
                  this.props.navigation.navigate('BLogin3')
                })
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
        {/* ------------------------- Header Bar ----------------------------------- */}
        <Header style={{ backgroundColor: 'white', height: hp('8%') }} androidStatusBarColor='grey' >
          <Left>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Book_Appointment')}
            >
              <Text style={{ fontSize: wp('6%') }}>  ←  </Text>
            </TouchableOpacity>
          </Left>
          <Body>
            <Text
              numberOfLines={1}
              style={{
                textAlign: 'center',
                marginLeft: wp('9%'),
                marginRight: wp('-16%'),
                fontSize: wp('5%'),
                color: '#2570EC',
                fontFamily: 'Averia Serif Libre',
              }}>
              Business sign-up
            </Text>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <View
            style={{
              padding: 20
            }}
          >
            <Text
              style={{ fontSize: wp('6%'), fontWeight: '600', fontStyle: 'normal', fontFamily: 'Roboto' }}>
              Business time
          </Text>
            <Text
              style={{ fontSize: wp('3.8%'), fontStyle: 'normal', fontFamily: 'NotoSans' }}>
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
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <Text>
                  Start Time {"\n"} {this.state.start_time ? moment(this.state.start_time).format('hh:mm:ss a') : '--:--'}
                </Text>
                <Text>
                  End Time {"\n"} {this.state.end_time ? moment(this.state.end_time).format('hh:mm:ss a') : '--:--'}
                </Text>
                <Text>
                  <Text style={{ fontSize: wp('6%'), }}> 〉  </Text>
                </Text>
              </Body>
            </TouchableOpacity>
          </CardItem>
          <View
            style={{
              padding: 20
            }}
          >
            <Text style={{ fontSize: wp('6%'), fontStyle: 'normal', fontFamily: 'Roboto' }}>
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
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <Text>
                  Start Time {"\n"} {this.state.app_start_time ? moment(this.state.app_start_time).format('hh:mm:ss a') : '--:--'}
                </Text>
                <Text>
                  End Time {"\n"} {this.state.app_end_time ? moment(this.state.app_end_time).format('hh:mm:ss a') : '--:--'}
                </Text>
                <Text>
                  <Text style={{ fontSize: wp('6%'), }}>  〉  </Text>
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
                      tabStyle={{ backgroundColor: '#2570EC' }}
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
