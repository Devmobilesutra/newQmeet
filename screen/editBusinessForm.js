import { Container, Tabs, Tab, Header, Left, Body, Title, Right, Content, Switch, Button, Badge } from 'native-base'
import React, { Component } from 'react'
import { Alert, ActivityIndicator, Modal, BackHandler, Text, View, TouchableOpacity, StyleSheet, TextInput, TouchableHighlight, ImageBackground } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

import TimeModal from "./Common_services/NewTimemodal";
import RN_Icon from 'react-native-vector-icons/AntDesign';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const options = {
    noData: true
};

export default class editBusinessForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            owner_number: '',
            buisness_Name: '',
            avatarSource: '',
            fileName: '',
            imagePath: '',
            isLoading: false,

            // For the business time
            modal: false,
            number: null,

            Time1_startTime: '',
            Time1_endTime: '',

            Time2_startTime: '',
            Time2_endTime: '',

            businessTimeSwitch: true,

            // For appointment time
            aTime1_startTime: '',
            aTime1_endTime: '',

            aTime2_startTime: '',
            aTime2_endTime: '',

            appointmentTimeSwitch: true,
        }
    }

    handleSwitch() {
        this.setState({ businessTimeSwitch: !this.state.businessTimeSwitch, appointmentTimeSwitch: !this.state.appointmentTimeSwitch })
    }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backAction);
    }
    backAction = () => {
        this.props.navigation.navigate('profile_details_2')
        return true;
    };
    async componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.backAction);
        const value = await AsyncStorage.getItem('@owner_number');

        firestore().collection('owner').doc(value).get()
            .then(data => {
                console.log(`owners data: `, data.data());
                this.setState({
                    owner_number: value,

                    buisness_Name: data.data().Buisness_name,
                    avatarSource: data.data().image_url,

                    // For appointment time
                    Time1_startTime: data.data().buisness_start_time,
                    Time1_endTime: data.data().buisness_end_time,

                    Time2_startTime: data.data().second_buisness_start_time,
                    Time2_endTime: data.data().second_buisness_end_time,

                    businessTimeSwitch: data.data().shift,

                    // For appointment time
                    aTime1_startTime: data.data().appointment_start_time,
                    aTime1_endTime: data.data().appointment_end_time,

                    aTime2_startTime: data.data().second_appointment_start_time,
                    aTime2_endTime: data.data().second_appointment_end_time,

                    appointmentTimeSwitch: data.data().shift,
                });
            })

    }
    setImage = () => {
        console.log('setImage function')
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
                    this.setState({ imagePath: path, avatarSource: null, fileName: fileName });

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

    toggle(number) {
        const { modal } = this.state;
        console.log('this is modal', number);
        this.setState({ number: number, modal: !modal });
    }
    cancelToggle(number) {
        if (number === 1) {
            console.log('Time 1: ', date, "number 1: ", number);
            this.setState({ Time1_startTime: '' });
        } else if (number === 2) {
            console.log('Time 2: ', date, "number 2: ", number);
            this.setState({ Time1_endTime: '' });
        } else if (number === 3) {
            console.log('Time 3: ', date, "number 3: ", number);
            this.setState({ Time2_startTime: '' });
        } else if (number === 4) {
            this.setState({ Time2_endTime: '' });
            console.log('Time 4: ', date, "number 4: ", number);
        } else if (number === 5) {
            console.log('Time 5: ', date, "number 5: ", number);
            this.setState({ aTime1_startTime: '' });
        } else if (number === 6) {
            console.log('Time 6: ', date, "number 6: ", number);
            this.setState({ aTime1_endTime: '' });
        } else if (number === 7) {
            console.log('Time 7: ', date, "number 7: ", number);
            this.setState({ aTime2_startTime: '' });
        } else if (number === 8) {
            this.setState({ aTime2_endTime: '' });
            console.log('Time 8: ', date, "number 8: ", number);
        }
    }
    selctedTime(date, number) {
        if (number === 1) {
            console.log('Time 1: ', moment(date).format('HH:mm:ss'), "number 1: ", number);
            this.setState({ Time1_startTime: date });
        } else if (number === 2) {
            console.log('Time 2: ', moment(date).format('HH:mm:ss'), "number 2: ", number);
            this.setState({ Time1_endTime: date });
        } else if (number === 3) {
            console.log('Time 3: ', moment(date).format('HH:mm:ss'), "number 3: ", number);
            this.setState({ Time2_startTime: date });
        } else if (number === 4) {
            this.setState({ Time2_endTime: date });
            console.log('Time 4: ', moment(date).format('HH:mm:ss'), "number 4: ", number);
        } else if (number === 5) {
            console.log('Time 5: ', moment(date).format('HH:mm:ss'), "number 5: ", number);
            this.setState({ aTime1_startTime: date });
        } else if (number === 6) {
            console.log('Time 6: ', moment(date).format('HH:mm:ss'), "number 6: ", number);
            this.setState({ aTime1_endTime: date });
        } else if (number === 7) {
            console.log('Time 7: ', moment(date).format('HH:mm:ss'), "number 7: ", number);
            this.setState({ aTime2_startTime: date });
        } else if (number === 8) {
            this.setState({ aTime2_endTime: date });
            console.log('Time 8: ', moment(date).format('HH:mm:ss'), "number 8: ", number);
        }
    }
    alertModal(sentence) {
        console.log("sentence: ", sentence);
        return (
            Alert.alert(
                "", `${sentence}`,
                [{
                    color: '#fff',
                    text: "OK",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                }]
            )
        )
    }
    businessTimeValidation() {
        const { Time1_startTime, Time1_endTime, Time2_startTime, Time2_endTime, businessTimeSwitch, appointmentTimeSwitch, aTime1_startTime, aTime1_endTime, aTime2_startTime, aTime2_endTime } = this.state;
        console.log('businessTimeValidation');
        if (Time1_startTime == '' || Time1_startTime == undefined) {
            this.alertModal('Set Business start time of Time 1');
            return
        }
        if (Time1_endTime == '' || Time1_endTime == undefined) {
            this.alertModal('Set Business end time of Time 1');
            return
        }
        if (businessTimeSwitch === true) {
            if (Time2_startTime == '' || Time2_startTime == undefined) {
                this.alertModal('Set Business start time of Time 2');
                return
            }
            if (Time2_endTime == '' || Time2_endTime == undefined) {
                this.alertModal('Set Business end time of Time 2');
                return
            }
        }

        this.tabs.goToPage(2)
    }
    appointmentTimeValidation() {
        const { Time1_startTime, Time1_endTime, Time2_startTime, Time2_endTime, businessTimeSwitch, appointmentTimeSwitch, aTime1_startTime, aTime1_endTime, aTime2_startTime, aTime2_endTime } = this.state;
        console.log('appointmentTimeValidation');
        if (aTime1_startTime == '' || aTime1_startTime == undefined) {
            this.alertModal('Set Business start time of Time 1');
            return
        }
        if (aTime1_endTime == '' || aTime1_endTime == undefined) {
            this.alertModal('Set Business end time of Time 1');
            return
        }
        if (Time1_endTime < aTime1_endTime) {
            this.alertModal('Appointment End time should be less than Buisness End Time of First Half');
            return
        }
        if (appointmentTimeSwitch === true) {
            if (aTime2_startTime == '' || aTime2_startTime == undefined) {
                this.alertModal('Set appointment start time of Time 2');
                return
            }
            if (aTime2_endTime == '' || aTime2_endTime == undefined) {
                this.alertModal('Set appointment end time of Time 2');
                return
            }
            if (Time2_endTime < aTime2_endTime) {
                this.alertModal('Appointment End time should be less than Buisness End Time of Second Half');
                return
            }
        }
        console.log('All the times are valid');
        // this.tabs.goToPage(2)
        this.signUp();
    }
    signUp() {
        const { avatarSource, owner_number, imagePath, fileName, buisness_Name, Time1_startTime, Time1_endTime, Time2_startTime, Time2_endTime, businessTimeSwitch, appointmentTimeSwitch, aTime1_startTime, aTime1_endTime, aTime2_startTime, aTime2_endTime } = this.state;
        this.setState({ isLoading: true });
        console.log('uploading image to firebase: ', imagePath, "fileName: ", fileName);
        if (imagePath) {
            console.log('uploading image to firebase');
            let reference = storage().ref(fileName);
            let task = reference.putFile(imagePath);
            task.then(async (response) => {
                console.log('Image uploaded to the bucket!');
                reference.getDownloadURL().then(url => {
                    console.log("Stored URL: ", url);
                    firestore().collection('owner').doc(owner_number).set({
                        user_Id: '',
                        Buisness_name: buisness_Name,

                        buisness_start_time: Time1_startTime,
                        buisness_end_time: Time1_endTime,
                        appointment_start_time: aTime1_startTime,
                        appointment_end_time: aTime1_endTime,

                        second_buisness_start_time: Time2_startTime,
                        second_buisness_end_time: Time2_endTime,
                        second_appointment_start_time: aTime2_startTime,
                        second_appointment_end_time: aTime2_endTime,

                        image_url: url,
                        Availablity: true,
                        shift: businessTimeSwitch,

                        flag: {
                            status: true,
                            message: ''
                        }
                    }).then(async () => {
                        console.log('succefull signup second half');
                        const type = await AsyncStorage.setItem('@user_type', '2');// 1 for user and two for owner. by default all are users
                        console.log("type second time :", await AsyncStorage.getItem('@user_type'));
                        // this.setState({ loader: false })
                        // this.props.navigation.navigate('BLogin3');
                    })
                })
                this.setState({ isLoading: false, status: 'Image uploaded successfully' });
                this.props.navigation.navigate('BLogin3');
            }).catch((e) => {
                status = 'Something went wrong';
                console.log('uploading image error => ', e);
                this.setState({ isLoading: false, status: 'Something went wrong' });
            });
        } else {
            firestore().collection('owner').doc(owner_number).update({
                user_Id: '',
                Buisness_name: buisness_Name,

                buisness_start_time: Time1_startTime,
                buisness_end_time: Time1_endTime,
                appointment_start_time: aTime1_startTime,
                appointment_end_time: aTime1_endTime,

                second_buisness_start_time: Time2_startTime,
                second_buisness_end_time: Time2_endTime,
                second_appointment_start_time: aTime2_startTime,
                second_appointment_end_time: aTime2_endTime,

                image_url: avatarSource ? avatarSource : '',
                Availablity: true,
                shift: businessTimeSwitch,

                flag: {
                    status: true,
                    message: ''
                }
            }).then(async () => {
                console.log('succefull signup second half');
                const type = await AsyncStorage.setItem('@user_type', '2');// 1 for user and two for owner. by default all are users
                console.log("type second time :", await AsyncStorage.getItem('@user_type'));
                this.setState({ isLoading: false });
                this.props.navigation.navigate('BLogin3');
            })
        }
    }
    render() {
        let { imagePath } = this.state;
        let imgSource = this.getPlatformURI(imagePath);
        const { avatarSource, Time1_startTime, Time1_endTime, Time2_startTime, Time2_endTime, businessTimeSwitch, appointmentTimeSwitch, aTime1_startTime, aTime1_endTime, aTime2_startTime, aTime2_endTime } = this.state;
        return (
            <Container>
                <Modal transparent={true} visible={this.state.isLoading} >
                    <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                        <ActivityIndicator color='#2570EC' size='large' style={{ alignSelf: 'center' }} />
                    </View>
                </Modal>
                {/* ------------------------- Header Bar ----------------------------------- */}
                <Header style={styles.header_bg} androidStatusBarColor="grey">
                    <Left style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('profile_details_2') }}>
                            <RN_Icon name='arrowleft' size={30} color="#000" />
                        </TouchableOpacity>
                    </Left>
                    <Body style={styles.Header_Body}>
                        <Title style={styles.Header_Name}>Edit Business Details</Title>
                    </Body>
                    <Right style={{ flex: 1 }} />
                </Header>
                <Tabs locked={true} ref={c => this.tabs = c} >
                    <Tab
                        heading="Business Details"
                        activeTabStyle={{ backgroundColor: '#FFFFFF' }}
                        activeTextStyle={{ color: '#2570EC' }}
                        tabStyle={{ backgroundColor: '#FFFFFF', elevation: 0 }}
                    >

                        {/* //////////////// Pic selection and business name tab /////////////// */}
                        <Container>
                            <Content contentContainerStyle={styles.content}>
                                <View>
                                    <Text style={{ fontWeight: 'bold', fontSize: widthPercentageToDP('3.5%') }}>
                                        Enter business name and its photo
                                    </Text>

                                    <TextInput
                                        keyboardType="ascii-capable"
                                        placeholder="Your Business name"
                                        fontSize={35}
                                        value={this.state.buisness_Name}
                                        onChangeText={(buisness_Name) => this.setState({ buisness_Name })}
                                        style={{
                                            color: '#5F6368',
                                            borderColor: 'blue',
                                            borderBottomWidth: 1,
                                        }} />

                                    <TouchableHighlight onPress={() => { this.setImage() }} style={{ alignItems: 'center', justifyContent: 'center', marginTop: heightPercentageToDP('10%'), }}>
                                        <ImageBackground style={{ width: widthPercentageToDP('100%'), height: 250, zIndex: 900, backgroundColor: 'grey', justifyContent: 'center', alignItems: 'center' }} source={avatarSource ? { uri: avatarSource } : imgSource ? imgSource : require('../img/b1.jpg')} >
                                            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                                                <Text style={{ color: 'white' }}>Click here to select Image</Text>
                                            </View>
                                        </ImageBackground>
                                    </TouchableHighlight>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.tabs.goToPage(1);
                                        }}
                                        disabled={this.state.buisness_Name.length > 3 ? false : true}
                                        style={{
                                            backgroundColor: this.state.buisness_Name.length > 3 ? '#2570EC' : '#808080',
                                            width: widthPercentageToDP('90%'),
                                            height: heightPercentageToDP('7.5%'),
                                            borderRadius: 50,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: heightPercentageToDP('10%'),
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                        <Text style={{ color: 'white', fontSize: 14 }}>Next</Text>
                                    </TouchableOpacity>
                                </View>
                            </Content>
                        </Container>
                    </Tab>
                    <Tab
                        heading="Business Time"
                        activeTabStyle={{ backgroundColor: '#FFFFFF' }}
                        activeTextStyle={{ color: '#2570EC' }}
                        tabStyle={{ backgroundColor: '#FFFFFF', elevation: 0 }}
                    >

                        {/* /////////// This is Busioness Time ///////////////// */}
                        <Container>
                            <Content contentContainerStyle={styles.mainView}>
                                <View style={styles.timeHeadings}>
                                    <Text style={{ fontFamily: 'NotoSans-Regular', fontWeight: '500', fontStyle: 'normal', fontSize: widthPercentageToDP('7') }}>Business time</Text>
                                    <Text style={{ fontFamily: 'NotoSans-Regular', fontWeight: '500', fontStyle: 'normal', fontSize: widthPercentageToDP('4.3') }}>Time, when you actually start your work</Text>
                                </View>
                                <View style={{ borderBottomColor: '#BDBDBD', borderBottomWidth: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#BDBDBD', paddingBottom: heightPercentageToDP('2'), paddingTop: heightPercentageToDP('2') }}>
                                        <Text style={{ flex: 8, fontFamily: 'NotoSans-Regular', fontWeight: '500', fontStyle: 'normal', fontSize: widthPercentageToDP('4.3') }}>Time 1 (Morning to Afteroon)</Text>
                                        <Button transparent>
                                            <Switch onValueChange={() => { this.handleSwitch() }} value={this.state.businessTimeSwitch} />
                                        </Button>
                                    </View>
                                    <View style={styles.Time}>
                                        <View style={styles.box}>
                                            <TouchableOpacity onPress={() => this.toggle(1)}>
                                                <Text style={{ flex: 6, fontFamily: 'Roboto', fontWeight: '700', fontStyle: 'normal', fontSize: widthPercentageToDP('4') }}>Start time</Text>
                                                <Text style={{ flex: 8, fontFamily: 'Roboto', fontWeight: '500', fontStyle: 'normal', fontSize: widthPercentageToDP('5') }}>
                                                    {/* {moment(Time1_startTime).format('HH:mm:ss')} */}
                                                    {Time1_startTime ? moment(new Date(Time1_startTime.seconds * 1000 + Time1_startTime.nanoseconds / 1000000)).format('hh:mm A') == 'Invalid date' ? moment(Time1_startTime).format('hh:mm A')
                                                        : moment(new Date(Time1_startTime.seconds * 1000 + Time1_startTime.nanoseconds / 1000000)).format('hh:mm A')
                                                        : '--:--'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.box}>
                                            <TouchableOpacity onPress={() => { this.toggle(2) }}>
                                                <Text style={{ flex: 6, fontFamily: 'Roboto', fontWeight: '700', fontStyle: 'normal', fontSize: widthPercentageToDP('4') }}>End time</Text>
                                                <Text style={{ flex: 8, fontFamily: 'Roboto', fontWeight: '500', fontStyle: 'normal', fontSize: widthPercentageToDP('5') }}>
                                                    {/* {moment(Time1_endTime).format('HH:mm:ss')} */}
                                                    {Time1_endTime ? moment(new Date(Time1_endTime.seconds * 1000 + Time1_endTime.nanoseconds / 1000000)).format('hh:mm A') == 'Invalid date' ? moment(Time1_endTime).format('hh:mm A')
                                                        : moment(new Date(Time1_endTime.seconds * 1000 + Time1_endTime.nanoseconds / 1000000)).format('hh:mm A')
                                                        : '--:--'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                {businessTimeSwitch ? <View style={{ borderBottomColor: '#BDBDBD', borderBottomWidth: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#BDBDBD', paddingBottom: heightPercentageToDP('2'), paddingTop: heightPercentageToDP('2') }}>
                                        <Text style={{ flex: 8, fontFamily: 'NotoSans-Regular', fontWeight: '500', fontStyle: 'normal', fontSize: widthPercentageToDP('4') }}>Time 2 (Afteroon to Evening)</Text>
                                        <Button transparent>
                                            <Switch onValueChange={() => { this.handleSwitch() }} value={this.state.businessTimeSwitch} />
                                        </Button>
                                    </View>
                                    <View style={styles.Time}>
                                        <View style={styles.box}>
                                            <TouchableOpacity onPress={() => { this.toggle(3) }}>
                                                <Text style={{ flex: 6, fontFamily: 'Roboto', fontWeight: '700', fontStyle: 'normal', fontSize: widthPercentageToDP('4') }}>Start time</Text>
                                                <Text style={{ flex: 8, fontFamily: 'Roboto', fontWeight: '500', fontStyle: 'normal', fontSize: widthPercentageToDP('5') }}>
                                                    {/* {moment(Time2_startTime).format('HH:mm:ss')} */}
                                                    {Time2_startTime ? moment(new Date(Time2_startTime.seconds * 1000 + Time2_startTime.nanoseconds / 1000000)).format('hh:mm A') == 'Invalid date' ? moment(Time2_startTime).format('hh:mm A')
                                                        : moment(new Date(Time2_startTime.seconds * 1000 + Time2_startTime.nanoseconds / 1000000)).format('hh:mm A')
                                                        : '--:--'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.box}>
                                            <TouchableOpacity onPress={() => { this.toggle(4) }}>
                                                <Text style={{ flex: 6, fontFamily: 'Roboto', fontWeight: '700', fontStyle: 'normal', fontSize: widthPercentageToDP('4') }}>End time</Text>
                                                <Text style={{ flex: 8, fontFamily: 'Roboto', fontWeight: '500', fontStyle: 'normal', fontSize: widthPercentageToDP('5') }}>
                                                    {/* {moment(Time2_endTime).format('HH:mm:ss')} */}
                                                    {Time2_endTime ? moment(new Date(Time2_endTime.seconds * 1000 + Time2_endTime.nanoseconds / 1000000)).format('hh:mm A') == 'Invalid date' ? moment(Time2_endTime).format('hh:mm A')
                                                        : moment(new Date(Time2_endTime.seconds * 1000 + Time2_endTime.nanoseconds / 1000000)).format('hh:mm A')
                                                        : '--:--'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View> : null}
                                <View style={styles.buttonView}>
                                    <TouchableOpacity
                                        onPress={() => { this.tabs.goToPage(0) }}
                                        style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#2570EC33', borderRadius: 27, height: heightPercentageToDP('9'), width: widthPercentageToDP('40') }}>
                                        <Text style={{ color: '#2570EC', fontFamily: 'Roboto', fontWeight: '400', fontStyle: 'normal' }}>Back</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => { this.businessTimeValidation() }}
                                        style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#2570EC', borderRadius: 27, height: heightPercentageToDP('9'), width: widthPercentageToDP('40') }}>
                                        <Text style={{ color: '#FFFFFF', fontFamily: 'Roboto', fontWeight: '400', fontStyle: 'normal' }}>Next</Text>
                                    </TouchableOpacity>
                                </View>


                                {/* ---------------Modal Section--------------- */}
                                <TimeModal modal={this.state.modal} selctedTime={(date, number) => this.selctedTime(date, number)} toggle={(number) => this.toggle(number)} number={this.state.number} />
                            </Content>
                        </Container>

                    </Tab>
                    <Tab
                        heading="Appointment Time"
                        activeTabStyle={{ backgroundColor: '#FFFFFF' }}
                        activeTextStyle={{ color: '#2570EC' }}
                        tabStyle={{ backgroundColor: '#FFFFFF', elevation: 0 }}
                    >

                        {/* /////////// This is Appointment Time ///////////////// */}
                        <Container>
                            <Content contentContainerStyle={styles.mainView}>
                                <View style={styles.timeHeadings}>
                                    <Text style={{ fontFamily: 'NotoSans-Regular', fontWeight: '500', fontStyle: 'normal', fontSize: widthPercentageToDP('7') }}>Appointment time</Text>
                                    <Text style={{ fontFamily: 'NotoSans-Regular', fontWeight: '500', fontStyle: 'normal', fontSize: widthPercentageToDP('4.3') }}>Time, when you want to get appointments in queue</Text>
                                </View>
                                <View style={{ borderBottomColor: '#BDBDBD', borderBottomWidth: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#BDBDBD', paddingBottom: heightPercentageToDP('2'), paddingTop: heightPercentageToDP('2') }}>
                                        <Text style={{ flex: 8, fontFamily: 'NotoSans-Regular', fontWeight: '500', fontStyle: 'normal', fontSize: widthPercentageToDP('4.3') }}>Appointment time (Morning to Afteroon)</Text>
                                        {/* <Button transparent>
                                            <Switch onValueChange={() => { this.handleSwitch() }} value={this.state.businessTimeSwitch} />
                                        </Button> */}
                                    </View>
                                    <View style={styles.Time}>
                                        <View style={styles.box}>
                                            <TouchableOpacity onPress={() => this.toggle(5)}>
                                                <Text style={{ flex: 6, fontFamily: 'Roboto', fontWeight: '700', fontStyle: 'normal', fontSize: widthPercentageToDP('4') }}>Start time</Text>
                                                <Text style={{ flex: 8, fontFamily: 'Roboto', fontWeight: '500', fontStyle: 'normal', fontSize: widthPercentageToDP('5') }}>
                                                    {/* {moment(aTime1_startTime).format('HH:mm:ss')} */}
                                                    {aTime1_startTime ? moment(new Date(aTime1_startTime.seconds * 1000 + aTime1_startTime.nanoseconds / 1000000)).format('hh:mm A') == 'Invalid date' ? moment(aTime1_startTime).format('hh:mm A')
                                                        : moment(new Date(aTime1_startTime.seconds * 1000 + aTime1_startTime.nanoseconds / 1000000)).format('hh:mm A')
                                                        : '--:--'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.box}>
                                            <TouchableOpacity onPress={() => { this.toggle(6) }}>
                                                <Text style={{ flex: 6, fontFamily: 'Roboto', fontWeight: '700', fontStyle: 'normal', fontSize: widthPercentageToDP('4') }}>End time</Text>
                                                <Text style={{ flex: 8, fontFamily: 'Roboto', fontWeight: '500', fontStyle: 'normal', fontSize: widthPercentageToDP('5') }}>
                                                    {/* {moment(aTime1_endTime).format('HH:mm:ss')} */}
                                                    {aTime1_endTime ? moment(new Date(aTime1_endTime.seconds * 1000 + aTime1_endTime.nanoseconds / 1000000)).format('hh:mm A') == 'Invalid date' ? moment(aTime1_endTime).format('hh:mm A')
                                                        : moment(new Date(aTime1_endTime.seconds * 1000 + aTime1_endTime.nanoseconds / 1000000)).format('hh:mm A')
                                                        : '--:--'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                {appointmentTimeSwitch ? <View style={{ borderBottomColor: '#BDBDBD', borderBottomWidth: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#BDBDBD', paddingBottom: heightPercentageToDP('2'), paddingTop: heightPercentageToDP('2') }}>
                                        <Text style={{ flex: 8, fontFamily: 'NotoSans-Regular', fontWeight: '500', fontStyle: 'normal', fontSize: widthPercentageToDP('4') }}>Time 2 (Afteroon to Evening)</Text>
                                        {/* <Button transparent>
                                            <Switch onValueChange={() => { this.handleSwitch() }} value={this.state.businessTimeSwitch} />
                                        </Button> */}
                                    </View>
                                    <View style={styles.Time}>
                                        <View style={styles.box}>
                                            <TouchableOpacity onPress={() => { this.toggle(7) }}>
                                                <Text style={{ flex: 6, fontFamily: 'Roboto', fontWeight: '700', fontStyle: 'normal', fontSize: widthPercentageToDP('4') }}>Start time</Text>
                                                <Text style={{ flex: 8, fontFamily: 'Roboto', fontWeight: '500', fontStyle: 'normal', fontSize: widthPercentageToDP('5') }}>
                                                    {/* {moment(aTime2_startTime).format('HH:mm:ss')} */}
                                                    {aTime2_startTime ? moment(new Date(aTime2_startTime.seconds * 1000 + aTime2_startTime.nanoseconds / 1000000)).format('hh:mm A') == 'Invalid date' ? moment(aTime2_startTime).format('hh:mm A')
                                                        : moment(new Date(aTime2_startTime.seconds * 1000 + aTime2_startTime.nanoseconds / 1000000)).format('hh:mm A')
                                                        : '--:--'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.box}>
                                            <TouchableOpacity onPress={() => { this.toggle(8) }}>
                                                <Text style={{ flex: 6, fontFamily: 'Roboto', fontWeight: '700', fontStyle: 'normal', fontSize: widthPercentageToDP('4') }}>End time</Text>
                                                <Text style={{ flex: 8, fontFamily: 'Roboto', fontWeight: '500', fontStyle: 'normal', fontSize: widthPercentageToDP('5') }}>
                                                    {/* {moment(aTime2_endTime).format('HH:mm:ss')} */}
                                                    {aTime2_endTime ? moment(new Date(aTime2_endTime.seconds * 1000 + aTime2_endTime.nanoseconds / 1000000)).format('hh:mm A') == 'Invalid date' ? moment(aTime2_endTime).format('hh:mm A')
                                                        : moment(new Date(aTime2_endTime.seconds * 1000 + aTime2_endTime.nanoseconds / 1000000)).format('hh:mm A')
                                                        : '--:--'}
                                                    </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View> : null}
                                <View style={styles.buttonView}>
                                    <TouchableOpacity
                                        onPress={() => this.tabs.goToPage(1)}
                                        style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#2570EC33', borderRadius: 27, height: heightPercentageToDP('9'), width: widthPercentageToDP('40') }}>
                                        <Text style={{ color: '#2570EC', fontFamily: 'Roboto', fontWeight: '400', fontStyle: 'normal' }}>Back</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => { this.appointmentTimeValidation() }}
                                        style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#2570EC', borderRadius: 27, height: heightPercentageToDP('9'), width: widthPercentageToDP('40') }}>
                                        <Text style={{ color: '#FFFFFF', fontFamily: 'Roboto', fontWeight: '400', fontStyle: 'normal' }}>Next</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* ---------------Modal Section--------------- */}
                                <TimeModal modal={this.state.modal} selctedTime={(date, number) => this.selctedTime(date, number)} toggle={(number) => this.toggle(number)} number={this.state.number} />
                            </Content>
                        </Container>

                    </Tab>
                </Tabs>
            </Container>
        )
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
    },
    mainView: {
        padding: widthPercentageToDP('5'),
        // backgroundColor: 'green'
    },
    mainList: {
        flexDirection: 'row',
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: heightPercentageToDP('15'),
    },
    timeHeadings: {
        borderBottomWidth: 1,
        borderBottomColor: '#BDBDBD',
        paddingBottom: heightPercentageToDP('3')
    },
    Time: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: heightPercentageToDP('3'),
        paddingBottom: heightPercentageToDP('3'),
        // backgroundColor: 'orange'
    },
    box: {
        flexDirection: 'column',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#BDBDBD',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: widthPercentageToDP('3'),
        width: widthPercentageToDP('40'),
        height: heightPercentageToDP('10')
    }
})