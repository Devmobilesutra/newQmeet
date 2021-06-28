import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import { Container, Header, Title, Content, Accordion, FooterTab, Left, Right, Body, Icon, Text, View, Card, CardItem, Tab, Tabs, TabHeading } from 'native-base';
import { ActivityIndicator, Dimensions, StyleSheet, Modal, SafeAreaView, Image, TextInput, TouchableOpacity, Alert, } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import storage from '@react-native-firebase/storage';
import RN_Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import TimeModal from "./Common_services/TimeModal";

class BLogin2 extends Component {

  constructor(props) {
    super(props)
    this.state = {
      //new
      BM1: false,
      BM2: false,
      AM1: false,
      AM2: false,

      BST1: '',
      BST2: '',
      BET1: '',
      BET2: '',

      AST1: '',
      AST2: '',
      AET1: '',
      AET2: '',

      shift: false,

      userId: '',
      date: new Date(),
      owner_number: '',
      loader: false,
      fs_imageurl: ''
    };
    this.toggle = this.toggle.bind(this);
    this.Business_ST = this.Business_ST.bind(this);
    this.Business_ET = this.Business_ET.bind(this);
    this.Appointment_ST = this.Appointment_ST.bind(this);
    this.Appointment_ET = this.Appointment_ET.bind(this);

    this.Business_ST2 = this.Business_ST2.bind(this);
    this.Business_ET2 = this.Business_ET2.bind(this);
    this.Appointment_ST2 = this.Appointment_ST2.bind(this);
    this.Appointment_ET2 = this.Appointment_ET2.bind(this);
  }

  toggle(modal_no) {
    const { BM1, BM2, AM1, AM2 } = this.state;
    console.log("toogle state", modal_no);
    if (modal_no === 1) {
      this.setState({ BM1: !BM1 });
    } else if (modal_no === 2) {
      this.setState({ BM2: !BM2 });
    } else if (modal_no === 3) {
      this.setState({ AM1: !AM1 });
    } else if (modal_no === 4) {
      this.setState({ AM2: !AM2 });
    }
  }
  // functions for first half
  Business_ST(BST1) {
    console.log("BST1", moment(BST1).format('HH:mm:ss'));
    this.setState({ BST1 });
  }
  Business_ET(BET1) {
    console.log("BET1", moment(BET1).format('HH:mm:ss'));
    this.setState({ BET1 });
  }
  Appointment_ST(AST1) {
    console.log("AST1", moment(AST1).format('HH:mm:ss'));
    this.setState({ AST1 });
  }
  Appointment_ET(AET1) {
    console.log("AET1", moment(AET1).format('HH:mm:ss'));
    this.setState({ AET1 });
  }
  // functions for second half
  Business_ST2(BST2) {
    console.log("BST1", moment(BST2).format('HH:mm:ss A'));
    this.setState({ BST2 });
  }
  Business_ET2(BET2) {
    console.log("BET1", moment(BET2).format('HH:mm:ss A'));
    this.setState({ BET2 });
  }
  Appointment_ST2(AST2) {
    console.log("AST1", moment(AST2).format('HH:mm:ss A'));
    this.setState({ AST2 });
  }
  Appointment_ET2(AET2) {
    console.log("AET1", moment(AET2).format('HH:mm:ss A'));
    this.setState({ AET2 });
  }

  async componentDidMount() {
    console.log('Image Path', this.props.route.params.imagePath);
    console.log('Business Name', this.props.route.params.buisness_Name);
    console.log('fileName Path', this.props.route.params.fileName);
    console.log('User Id', this.props.route.params.userId);
    // const user_data = await firestore().collection('user').where('mobile_no', '==', this.props.route.params.userId).get();
  }

  async signUp1() {
    const { BST1, BST2, BET1, BET2, AST1, AST2, AET1, AET2, shift } = this.state;
    if (!BST1) {
      Alert.alert(
        "", "Set Business start time of first half",
        [{
          color: '#fff',
          text: "OK",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        }]
      );
    } else {
      if (!BET1) {
        Alert.alert(
          "", "Set Business End time of first half",
          [{
            color: '#fff',
            text: "OK",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          }]
        );
      } else {
        if (!AST1) {
          Alert.alert(
            "", "Set Appointment start time of first half",
            [{
              color: '#fff',
              text: "OK",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            }]
          );
        } else {
          if (!AET1) {
            Alert.alert(
              "", "Set Appointment End time of first half",
              [{
                color: '#fff',
                text: "OK",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              }]
            );
          } else {
            if (shift) {
              // for second half
              if (!BST2) {
                Alert.alert(
                  "", "Set Business start time second half",
                  [{
                    color: '#fff',
                    text: "OK",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  }]
                );
              } else {
                if (!BET2) {
                  Alert.alert(
                    "", "Set Business end time of second half",
                    [{
                      color: '#fff',
                      text: "OK",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    }]
                  );
                } else {
                  if (!AST2) {
                    Alert.alert(
                      "", "Set Appointment start time of Second half",
                      [{
                        color: '#fff',
                        text: "OK",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                      }]
                    );
                  } else {
                    if (!AET2) {
                      Alert.alert(
                        "", "Set Appointment start time or Appointment End time of Second half",
                        [{
                          color: '#fff',
                          text: "OK",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel",
                        }]
                      );
                    } else {
                      if (BET1.getTime() < AET1.getTime()) {
                        Alert.alert(
                          "", "Appointment End time should be less than Buisness End Time of First Half",
                          [{
                            color: '#fff',
                            text: "OK",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel",
                          }]
                        );
                      } else {
                        if (BET2.getTime() < AET2.getTime()) {
                          Alert.alert(
                            "", "Appointment End time should be less than Buisness End Time of Second Half",
                            [{
                              color: '#fff',
                              text: "OK",
                              onPress: () => console.log("Cancel Pressed"),
                              style: "cancel",
                            }]
                          );
                          // Alert.alert('Set Appointment End time should be less than Buisness End Time');
                        } else {
                          let download_url;
                          if (this.props.route.params.fileName) {
                            // with image
                            this.setState({ loader: true });
                            console.log("fileName regular :", this.props.route.params.fileName);
                            let reference = storage().ref(this.props.route.params.fileName);
                            let task = reference.putFile(this.props.route.params.imagePath);
                            task.then(async (response) => {
                              console.log('Image uploaded to the bucket!', await reference.getDownloadURL());
                              download_url = reference.getDownloadURL().then(d => {
                                console.log('url', d);
                                firestore().collection('owner').doc(this.props.route.params.owner_number).set({
                                  user_Id: this.props.route.params.userId,
                                  Buisness_name: this.props.route.params.buisness_Name,

                                  buisness_start_time: BST1,
                                  buisness_end_time: BET1,
                                  appointment_start_time: AST1,
                                  appointment_end_time: AET1,

                                  second_buisness_start_time: BST2,
                                  second_buisness_end_time: BET2,
                                  second_appointment_start_time: AST2,
                                  second_appointment_end_time: AET2,

                                  image_url: d ? d : '',
                                  Availablity: true,
                                  shift: shift,

                                  flag: {
                                    status: true,
                                    message: ''
                                  }
                                }).then(async () => {
                                  console.log('succefull signup second half');
                                  const type = await AsyncStorage.setItem('@user_type', '2');// 1 for user and two for owner. by default all are users
                                  console.log("type second time :", await AsyncStorage.getItem('@user_type'));
                                  this.setState({ loader: false })
                                  this.props.navigation.navigate('BLogin3');
                                })
                              });
                            });
                          } else {
                            // without image
                            this.setState({ loader: true });
                            console.log("Without image second time")
                            firestore().collection('owner').doc(this.props.route.params.owner_number).set({
                              user_Id: this.props.route.params.userId,
                              Buisness_name: this.props.route.params.buisness_Name,

                              buisness_start_time: BST1,
                              buisness_end_time: BET1,
                              appointment_start_time: AST1,
                              appointment_end_time: AET1,

                              second_buisness_start_time: BST2,
                              second_buisness_end_time: BET2,
                              second_appointment_start_time: AST2,
                              second_appointment_end_time: AET2,

                              image_url: '',
                              Availablity: true,
                              shift: shift,
                              
                              flag: {
                                status: true,
                                message: ''
                              }
                            }).then(async () => {
                              console.log('succefull signup second half');
                              const type = await AsyncStorage.setItem('@user_type', '2');// 1 for user and two for owner. by default all are users
                              console.log("type second time :", await AsyncStorage.getItem('@user_type'));
                              this.setState({ loader: false })
                              this.props.navigation.navigate('BLogin3');
                            })
                          }
                        }
                      }

                    }
                  }
                }
              }
            } else {
              if (BET1.getTime() < AET1.getTime()) {
                Alert.alert(
                  "", "Appointment End time should be less than Buisness End Time",
                  [{
                    color: '#fff',
                    text: "OK",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  }]
                );
              } else {
                let download_url;
                if (this.props.route.params.fileName) {
                  //With image
                  this.setState({ loader: true })
                  console.log("fileName regular :", this.props.route.params.fileName);
                  let reference = storage().ref(this.props.route.params.fileName);
                  let task = reference.putFile(this.props.route.params.imagePath);
                  task.then(async (response) => {
                    console.log('Image uploaded to the bucket!',);
                    download_url = reference.getDownloadURL().then(d => {
                      console.log("url", d);
                      firestore().collection('owner').doc(this.props.route.params.owner_number).set({
                        user_Id: this.props.route.params.userId,
                        Buisness_name: this.props.route.params.buisness_Name,

                        buisness_start_time: BST1,
                        buisness_end_time: BET1,
                        appointment_start_time: AST1,
                        appointment_end_time: AET1,

                        image_url: d ? d : '',
                        Availablity: true,
                        shift: shift,
                        
                        flag: {
                          status: true,
                          message: ''
                        }
                      }).then(async () => {
                        console.log('succefull signup First Half');
                        const type = await AsyncStorage.setItem('@user_type', '2');// 1 for user and two for owner. by default all are users
                        console.log("type one time :", await AsyncStorage.getItem('@user_type'));
                        this.setState({ loader: false })
                        this.props.navigation.navigate('BLogin3');
                      })
                    });
                  });
                } else {
                  //Without image
                  this.setState({ loader: true })
                  console.log("Without image first time")
                  firestore().collection('owner').doc(this.props.route.params.owner_number).set({
                    user_Id: this.props.route.params.userId,
                    Buisness_name: this.props.route.params.buisness_Name,

                    buisness_start_time: BST1,
                    buisness_end_time: BET1,
                    appointment_start_time: AST1,
                    appointment_end_time: AET1,

                    image_url: '',
                    Availablity: true,
                    shift: shift,
                    
                    flag: {
                      status: true,
                      message: ''
                    }
                  }).then(async () => {
                    console.log('succefull signup First Half');
                    const type = await AsyncStorage.setItem('@user_type', '2');// 1 for user and two for owner. by default all are users
                    console.log("type one time :", await AsyncStorage.getItem('@user_type'));
                    this.setState({ loader: false })
                    this.props.navigation.navigate('BLogin3');
                  })
                }
              }
            }
            // }
          }
        }
      }
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

        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', margin: 5 }}>
          <Text>First Half</Text>
          <TouchableOpacity
            onPress={() => { this.setState({ shift: !this.state.shift }) }}
            style={{
              height: 20, width: 20, borderRadius: 10, borderWidth: 1, borderColor: '#ACACAC', alignItems: 'center', justifyContent: 'center',
            }}>
            <View style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: this.state.shift ? '#FFFFFF' : '#2570EC',
            }}></View>
          </TouchableOpacity>
          <Text>Second Half</Text>
          <TouchableOpacity
            onPress={() => { this.setState({ shift: !this.state.shift }) }}
            style={{
              height: 20, width: 20, borderRadius: 10, borderWidth: 1, borderColor: '#ACACAC', alignItems: 'center', justifyContent: 'center',
            }}>
            <View style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: this.state.shift ? '#2570EC' : '#FFFFFF',
            }}></View>
          </TouchableOpacity>
        </View>
        <Content padder>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: wp('6%'), fontWeight: '600', fontStyle: 'normal', fontFamily: 'Roboto' }}>
              Business time
            </Text>
            <Text style={{ fontSize: wp('3.8%'), fontStyle: 'normal', fontFamily: 'NotoSans' }}>
              Your daily business time
            </Text>
          </View>

          {/* first half of business time */}
          <Text style={{ fontSize: wp('3.8%'), fontStyle: 'normal', fontFamily: 'NotoSans' }}>
            First half
          </Text>
          <CardItem style={{
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#BDBDBD',
            height: hp('12%'),
            marginBottom: hp('5%'),
          }}>
            <TouchableOpacity
              onPress={() => {
                // this.start_buisness_time()
                this.setState({ BM1: !this.state.BM1 });
              }}
            >
              <Body style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
                <View>
                  <Text>Start Time</Text>
                  <Text>{this.state.BST1 ? moment(this.state.BST1).format('hh:mm:ss a') : '--:--'}</Text>
                </View>
                <View>
                  <Text>End Time</Text>
                  <Text>{this.state.BET1 ? moment(this.state.BET1).format('hh:mm:ss a') : '--:--'}</Text>
                </View>
                <Text>
                  <RN_Icon name='right' size={25} color="#000" />
                </Text>
              </Body>
            </TouchableOpacity>
          </CardItem>

          {this.state.shift === true ? <View>
            {/* Second half of business time */}
            <Text style={{ fontSize: wp('3.8%'), fontStyle: 'normal', fontFamily: 'NotoSans' }}>
              Second half
          </Text>
            <CardItem style={{ borderRadius: 8, borderWidth: 1, borderColor: '#BDBDBD', height: hp('12%'), marginBottom: hp('5%') }}>
              <TouchableOpacity
                onPress={() => { this.setState({ BM2: !this.state.BM2 }) }}>
                <Body
                  style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
                  <View>
                    <Text>Start Time</Text>
                    <Text>{this.state.BST2 ? moment(this.state.BST2).format('hh:mm:ss a') : '--:--'}</Text>
                  </View>
                  <View>
                    <Text>End Time</Text>
                    <Text>{this.state.BET2 ? moment(this.state.BET2).format('hh:mm:ss a') : '--:--'}</Text>
                  </View>
                  <Text>
                    <RN_Icon name='right' size={25} color="#000" />
                  </Text>
                </Body>
              </TouchableOpacity>
            </CardItem>
          </View> : null}

          <View style={{ padding: 20 }}>
            <Text numberOfLines={1} style={{ fontSize: wp('6%'), fontStyle: 'normal', fontFamily: 'Roboto' }}>
              Appointment booking time
            </Text>
            <Text style={{ fontSize: wp('3.8%'), fontWeight: '500', fontStyle: 'normal', fontFamily: 'NotoSans' }}>
              Your customers can book an appointment daily
            </Text>
          </View>

          {/* First half of Appointment time */}
          <Text style={{ fontSize: wp('3.8%'), fontStyle: 'normal', fontFamily: 'NotoSans' }}>
            First half
          </Text>
          <CardItem style={{ borderRadius: 8, borderWidth: 1, borderColor: '#BDBDBD', height: hp('12%'), marginBottom: hp('5%') }}>
            <TouchableOpacity onPress={() => { this.setState({ AM1: !this.state.AM1 }) }}>
              <Body style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
                <View>
                  <Text>Start Time</Text>
                  <Text>{this.state.AST1 ? moment(this.state.AST1).format('hh:mm:ss a') : '--:--'} </Text>
                </View>
                <View>
                  <Text>End Time</Text>
                  <Text>{this.state.AET1 ? moment(this.state.AET1).format('hh:mm:ss a') : '--:--'} </Text>
                </View>
                <Text>
                  <RN_Icon name='right' size={25} color="#000" />
                </Text>
              </Body>
            </TouchableOpacity>
          </CardItem>

          {this.state.shift === true ?
            <View>
              {/* Second half of Appointment time */}
              <Text style={{ fontSize: wp('3.8%'), fontStyle: 'normal', fontFamily: 'NotoSans' }}>
                Second half
              </Text>
              <CardItem style={{ borderRadius: 8, borderWidth: 1, borderColor: '#BDBDBD', height: hp('12%'), }}>
                <TouchableOpacity onPress={() => { this.setState({ AM2: !this.state.AM2 }) }}>
                  <Body
                    style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
                    <View>
                      <Text>Start Time</Text>
                      <Text>{this.state.AST2 ? moment(this.state.AST2).format('hh:mm:ss a') : '--:--'} </Text>
                    </View>
                    <View>
                      <Text>End Time</Text>
                      <Text>{this.state.AET2 ? moment(this.state.AET2).format('hh:mm:ss a') : '--:--'} </Text>
                    </View>
                    <Text>
                      <RN_Icon name='right' size={25} color="#000" />
                    </Text>
                  </Body>
                </TouchableOpacity>
              </CardItem>
            </View> : null}

          <View style={{ justifyContent: 'center', alignItems: 'center' }} >
            <TouchableOpacity
              // onPress={() => { this.signUp() }}
              onPress={() => { this.signUp1() }}
              style={{ backgroundColor: '#2570EC', width: wp('90%'), height: hp('7.5%'), borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginTop: hp('12%'), }} >
              <Text style={{ color: '#FFFFFF' }}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* ---------------Modal Section--------------- */}

          {/* First Half of Buisness */}
          <TimeModal modal={this.state.BM1} toggle={this.toggle} ST={this.Business_ST} ET={this.Business_ET} number={1} />
          {/* Second Half of Business */}
          <TimeModal modal={this.state.BM2} toggle={this.toggle} ST={this.Business_ST2} ET={this.Business_ET2} number={2} />
          <TimeModal modal={this.state.AM1} toggle={this.toggle} ST={this.Appointment_ST} ET={this.Appointment_ET} number={3} />
          <TimeModal modal={this.state.AM2} toggle={this.toggle} ST={this.Appointment_ST2} ET={this.Appointment_ET2} number={4} />
          {/* ---------------Modal Section End--------------- */}
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
