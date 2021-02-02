import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import { Container, Header, Title, Content, Footer, FooterTab, Left, Right, Body, Icon, Text, View, Card, CardItem, Tab, Tabs, TabHeading, Thumbnail } from 'native-base';
import { BackHandler, ActivityIndicator, StyleSheet, Modal, SafeAreaView, Image, TextInput, TouchableOpacity, Alert, TouchableHighlight } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import RN_Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import storage from '@react-native-firebase/storage';
import { ImageBackground } from 'react-native';

class EditBuisness extends Component {

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
      Business_Name: '',
      fs_imageurl: '',
      avatarSource: '',
      fs_imageurl1: '',
      isLoading: false,

    };
  }

  setImage = () => {
    console.log('setImage function')
    const options = {
      mediaType: 'photo',
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      saveToPhotos: true,
      // storageOptions: {
      //     skipBackup: true
      // }
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };

        if (source && response.fileSize <= 2000000) {

          // code copied from https://www.pluralsight.com/guides/upload-images-to-firebase-storage-in-react-native
          let path = this.getPlatformPath(response).value;
          let fileName = this.getFileName(response.fileName, path);
          this.setState({ imagePath: path, avatarSource: response.uri });
          this.uploadImageToStorage(path, fileName);

        } else {
          Alert.alert('File should be less than 2MBs')
        }
      }
    });
  }

  getFileName(name, path) {
    if (name != null) { return name; }

    if (Platform.OS === "ios") {
      path = "~" + path.substring(path.indexOf("/Documents"));
    }
    return path.split("/").pop();
  }

  uploadImageToStorage(path, name) {
    this.setState({ isLoading: true });
    let reference = storage().ref(name);
    console.log('name', name)
    let task = reference.putFile(path);
    task.then(async () => {
      console.log('Image uploaded to the bucket!', await reference.getDownloadURL());
      this.setState({ isLoading: false, status: 'Image uploaded successfully', fs_imageurl1: await reference.getDownloadURL() });
    }).catch((e) => {
      status = 'Something went wrong';
      console.log('uploading image error => ', e);
      this.setState({ isLoading: false, status: 'Something went wrong' });
    });
  }

  /**
   * Get platform specific value from response
   */
  getPlatformPath({ path, uri }) {
    return Platform.select({
      android: { "value": path },
      ios: { "value": uri }
    })
  }

  getPlatformURI(imagePath) {
    let imgSource = imagePath;
    if (isNaN(imagePath)) {
      imgSource = { uri: this.state.imagePath };
      if (Platform.OS == 'android') {
        imgSource.uri = "file:///" + imgSource.uri;
      }
    }
    return imgSource
  }

  // UploadImage = (path, mime = 'application/octet-stream') => {

  //   this.setState({ loader: false })
  //   if (path) {
  //     //code
  //     console.log("File type", path)

  //     const sessionId = new Date().getTime();

  //     var storageRef = storage().ref(`shop_images`).child(`${sessionId}`);

  //     var task = storageRef.putFile(this.state.avatarSource.uri, { contentType: mime })
  //       .on(
  //         'state_changed', taskSnapshot => {
  //           console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
  //         },
  //         error => {
  //           console.log('err while uploading data onto firebase storage', error)
  //         },
  //         () => {
  //           storageRef.getDownloadURL()
  //             .then((downloadurl) => {
  //               console.log("file availale at :", downloadurl);
  //               this.setState({ fs_imageurl: downloadurl, loader: false })
  //             })
  //         }
  //       );
  //   } else {
  //     //code
  //     console.log('image uploading error')
  //   }
  // }
  backAction = () => {
    this.props.navigation.navigate('profile_details_2')
    return true;
  };
  componentDidMount() {
    console.log('Edit Buisness_Name')
    this.asyncData() //fetching data from asyn storage
    this.backHandler = BackHandler.addEventListener( // back button handling
      "hardwareBackPress",
      this.backAction
    );
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backAction); // on component unmount backhandler will be removed
  }
  asyncData = async () => {
    const owner_number = await AsyncStorage.getItem('@owner_number')
    console.log(owner_number)
    this.setState({ owner_number })
    await firestore()
      .collection('owner')
      .doc(owner_number)
      .get()
      .then(querySnapshop => {
        console.log('user ID', querySnapshop.id)
        console.log('owner data', querySnapshop.data())
        console.log('owner data', querySnapshop.data().image_url)
        let AST = querySnapshop.data().appointment_start_time
        let AET = querySnapshop.data().appointment_end_time
        let BST = querySnapshop.data().buisness_start_time
        let BET = querySnapshop.data().buisness_end_time
        let BusinessName = querySnapshop.data().Buisness_Name

        console.log(AST)
        console.log(AET)
        console.log(BST)
        console.log(BET)
        if (AST && AET && BST && BET) {
          this.setState({
            start_time: querySnapshop.data().buisness_start_time,
            end_time: querySnapshop.data().buisness_end_time,
            app_start_time: querySnapshop.data().appointment_start_time,
            app_end_time: querySnapshop.data().appointment_end_time,
            Business_Name: querySnapshop.data().Buisness_name,
            avatarSource: querySnapshop.data().image_url
          })
        }
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

    if (this.state.Business_Name) {

      if (this.state.start_time) {

        if (this.state.end_time) {

          if (this.state.app_start_time) {

            if (this.state.app_end_time) {
              var end_time;
              var app_end_time;
              if(moment(new Date(this.state.end_time.seconds * 1000 + this.state.end_time.nanoseconds / 1000000)).format('hh:mm:ss a') != 'Invalid date') {
                end_time = new Date(this.state.end_time.seconds * 1000 + this.state.end_time.nanoseconds / 1000000)
              } else {
                end_time = this.state.end_time
              }
              if(moment(new Date(this.state.app_end_time.seconds * 1000 + this.state.app_end_time.nanoseconds / 1000000)).format('hh:mm:ss a') != 'Invalid date') {
                app_end_time = new Date(this.state.app_end_time.seconds * 1000 + this.state.app_end_time.nanoseconds / 1000000)
              } else {
                app_end_time = this.state.app_end_time
              }
              if (app_end_time.getTime() > end_time.getTime()) {
                console.log('Appointment End time should be less than Buisness End Time')
                Alert.alert('Appointment End time should be less than Buisness End Time')
              } else {
                console.log("data format", this.state.app_end_time)
                console.log("what is it", new Date(this.state.app_end_time).getTime() > new Date(this.state.app_start_time).getTime())
                console.log("Appointment start time", moment(this.state.app_start_time).format('hh:mm:ss a'))
                console.log("Appointment end time", moment(this.state.app_end_time).format('hh:mm:ss a'))
                console.log("Buisness start time", moment(this.state.start_time).format('hh:mm:ss a'))
                console.log("Buisness end time", moment(this.state.end_time).format('hh:mm:ss a'))
                console.log('owner number', this.state.owner_number)
                console.log('oimage url 1', this.state.fs_imageurl1)
                const uploadtime = await firestore()
                  .collection('owner')
                  .doc(this.state.owner_number)
                  .update({
                    Buisness_name: this.state.Business_Name,
                    buisness_start_time: this.state.start_time,
                    buisness_end_time: this.state.end_time,
                    appointment_start_time: this.state.app_start_time,
                    appointment_end_time: this.state.app_end_time,
                    image_url: this.state.fs_imageurl1 ? this.state.fs_imageurl1 : this.state.avatarSource,
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
    } else {
      Alert.alert("Please Enter Your Name")
    }
  }
  render() {
    return (
      <Container>
        <Modal transparent={true} visible={this.state.isLoading} >
          <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <ActivityIndicator color='#2570EC' size='large' style={{ alignSelf: 'center' }} />
          </View>
        </Modal>
        <Header style={styles.header_bg} androidStatusBarColor="grey">
          <Left style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('profile_details_2') }}>
              <RN_Icon name='arrowleft' size={30} color="#000" />
            </TouchableOpacity>
          </Left>
          <Body style={styles.Header_Body}>
            <Title style={styles.Header_Name}>Edit Buisness Details</Title>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>
        <Content>
          <TouchableHighlight onPress={() => { this.setImage() }} style={{ alignItems: 'center', justifyContent: 'center' }}>
            <ImageBackground style={{ width: wp('100%'), height: 250, zIndex: 900, backgroundColor: 'grey', justifyContent: 'center', alignItems: 'center' }} source={this.state.avatarSource ? { uri: this.state.avatarSource } : require('../img/b1.jpg')} >
              <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                <Text style={{ color: 'white', textAlign: 'center' }}> click here to select New shop Profile</Text>
              </View>
            </ImageBackground>
          </TouchableHighlight>

          <View style={{ margin: wp('0.5%'), marginTop: 20 }}>
            <Text style={{
              marginLeft: hp('2%'),
              marginRight: hp('2%')
            }}> Edit Your Business Name</Text>
            <TextInput
              value={this.state.Business_Name}
              onChangeText={(Business_Name) => {
                this.setState({ Business_Name: Business_Name, disable: false })
              }}
              placeholder={'Enter Your Buisness Name'}
              keyboardType="ascii-capable"
              fontSize={27}
              style={{
                marginLeft: hp('2%'),
                marginRight: hp('2%'),
                color: '#5F6368',
                width: wp('90%'),
                borderColor: 'blue',
                borderBottomWidth: 1.5,
              }}></TextInput>
          </View>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: wp('5%'), fontWeight: '600', fontStyle: 'normal', fontFamily: 'Roboto' }}>
              Business time
            </Text>
            <Text style={{ fontSize: wp('3.8%'), fontStyle: 'normal', fontFamily: 'NotoSans' }}>
              Your daily business time
            </Text>
          </View>
          <CardItem style={{ borderRadius: 8, borderWidth: 1, borderColor: '#BDBDBD', height: hp('12%'), marginBottom: hp('5%'), }}>
            <TouchableOpacity onPress={() => { this.start_buisness_time() }}>
              <Body style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' }} >
                <View>
                  <Text>Start Time</Text>
                  <Text>
                    {this.state.start_time ?
                      moment(new Date(this.state.start_time.seconds * 1000 + this.state.start_time.nanoseconds / 1000000)).format('hh:mm:ss a') == 'Invalid date' ? moment(this.state.start_time).format('hh:mm:ss a')
                        : moment(new Date(this.state.start_time.seconds * 1000 + this.state.start_time.nanoseconds / 1000000)).format('hh:mm:ss a')
                      : '--:--'}
                  </Text>
                </View>
                <View>
                  <Text>End Time</Text>
                  <Text>
                    {this.state.end_time ?
                      moment(new Date(this.state.end_time.seconds * 1000 + this.state.end_time.nanoseconds / 1000000)).format('hh:mm:ss a') == 'Invalid date' ? moment(this.state.end_time).format('hh:mm:ss a') : moment(new Date(this.state.end_time.seconds * 1000 + this.state.end_time.nanoseconds / 1000000)).format('hh:mm:ss a')
                      : '--:--'}
                  </Text>
                </View>
                <Text>
                  <RN_Icon name='right' size={25} color="#000" />
                </Text>
              </Body>
            </TouchableOpacity>
          </CardItem>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: wp('5%'), fontStyle: 'normal', fontFamily: 'Roboto' }}>
              Appointment booking time
            </Text>
            <Text style={{ fontSize: wp('3.8%'), fontWeight: '500', fontStyle: 'normal', fontFamily: 'NotoSans' }}>
              Your customers can book an appointment daily
            </Text>
          </View>
          <CardItem style={{ borderRadius: 8, borderWidth: 1, borderColor: '#BDBDBD', height: hp('12%'), }}>
            <TouchableOpacity onPress={() => { this.open_appointment() }}>
              <Body style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
                <View>
                  <Text>Start Time</Text>
                  <Text>
                    {this.state.app_start_time ?
                      moment(new Date(this.state.app_start_time.seconds * 1000 + this.state.app_start_time.nanoseconds / 1000000)).format('hh:mm:ss a') == 'Invalid date' ? moment(this.state.app_start_time).format('hh:mm:ss a') : moment(new Date(this.state.app_start_time.seconds * 1000 + this.state.app_start_time.nanoseconds / 1000000)).format('hh:mm:ss a')
                      : '--:--'}
                  </Text>
                </View>
                <View>
                  <Text>End Time</Text>
                  <Text>
                    {this.state.app_end_time ?
                      moment(new Date(this.state.app_end_time.seconds * 1000 + this.state.app_end_time.nanoseconds / 1000000)).format('hh:mm:ss a') == 'Invalid date' ? moment(this.state.app_end_time).format('hh:mm:ss a') : moment(new Date(this.state.app_end_time.seconds * 1000 + this.state.app_end_time.nanoseconds / 1000000)).format('hh:mm:ss a')
                      : '--:--'}
                  </Text>
                </View>
                <Text>
                  <RN_Icon name='right' size={25} color="#000" />
                </Text>
              </Body>
            </TouchableOpacity>
          </CardItem>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => { this.signUp() }}
              style={{ backgroundColor: '#2570EC', width: wp('90%'), height: hp('7.5%'), borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginTop: hp('7%'), marginBottom: hp('7%') }}>
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
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '700'
  }
})
export default EditBuisness;
