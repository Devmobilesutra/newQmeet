import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import { Container, Header, Title, Content, Accordion, FooterTab, Left, Right, Body, Icon, Text, View, Card, CardItem, Tab, Tabs, TabHeading } from 'native-base';
import { ActivityIndicator, BackHandler, Dimensions, StyleSheet, Modal, TouchableHighlight, ImageBackground, TextInput, TouchableOpacity, Alert, } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import storage from '@react-native-firebase/storage';
import RN_Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import ImagePicker from 'react-native-image-picker';
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

            Business_Name: '',
            userId: '',
            date: new Date(),
            owner_number: '',
            loader: false,
            fs_imageurl: '',
            avatarSource: '',
            fs_imageurl1: '',
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
        console.log("AET1 ---", moment(AET1).format('HH:mm:ss'));
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
    backAction = () => {
        this.props.navigation.navigate('profile_details_2')
        return true;
    };
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backAction)
    }
    async componentDidMount() {
        console.log('Edit business Details page');
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction);
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
                if (AST && AET && BST && BET) {
                    this.setState({
                        BST1: querySnapshop.data().buisness_start_time,
                        BET1: querySnapshop.data().buisness_end_time,
                        AST1: querySnapshop.data().appointment_start_time,
                        AET1: querySnapshop.data().appointment_end_time,

                        BST2: querySnapshop.data().shift ? querySnapshop.data().second_buisness_start_time : null,
                        BET2: querySnapshop.data().shift ? querySnapshop.data().second_buisness_end_time : null,
                        AST2: querySnapshop.data().shift ? querySnapshop.data().second_appointment_start_time : null,
                        AET2: querySnapshop.data().shift ? querySnapshop.data().second_appointment_end_time : null,

                        Business_Name: querySnapshop.data().Buisness_name,
                        avatarSource: querySnapshop.data().image_url
                    });
                }
            });
    }

    async signUp1() {
        console.log("owner Number", this.state.owner_number);
        const { BST1, BST2, BET1, BET2, AST1, AST2, AET1, AET2, shift } = this.state;
        if (!BST1 && !BET1) {
            Alert.alert(
                "", "Set Business start time or Business End time of first half",
                [{
                    color: '#fff',
                    text: "OK",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                }]
            );
        } else {
            if (!AST1 && !AET1) {
                Alert.alert(
                    "", "Set Appointment start time or Appointment End time of first half",
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
                    if (!BST2 && !BET2) {
                        Alert.alert(
                            "", "Set Business start time or business end of second half",
                            [{
                                color: '#fff',
                                text: "OK",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel",
                            }]
                        );
                    } else {
                        if (!AST2 && !AET2) {
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

                            var end_time;
                            var app_end_time;
                            if (moment(new Date(this.state.BET1.seconds * 1000 + this.state.BET1.nanoseconds / 1000000)).format('hh:mm:ss a') != 'Invalid date') {
                                end_time = new Date(this.state.BET1.seconds * 1000 + this.state.BET1.nanoseconds / 1000000)
                            } else {
                                end_time = this.state.BET1
                            }
                            if (moment(new Date(this.state.AET1.seconds * 1000 + this.state.AET1.nanoseconds / 1000000)).format('hh:mm:ss a') != 'Invalid date') {
                                app_end_time = new Date(this.state.AET1.seconds * 1000 + this.state.AET1.nanoseconds / 1000000)
                            } else {
                                app_end_time = this.state.AET1
                            }
                            console.log("app_end_time", moment(app_end_time).format("HH:mm:ss"), "\n end_time", moment(end_time).format("HH:mm:ss"))
                            if (moment(app_end_time).format("HH:mm:ss") > moment(end_time).format("HH:mm:ss")) {
                                // console.log("BET1", moment(end_time).format("HH:mm:ss"), "\n AET1", moment(end_time2).format("HH:mm:ss"));
                                Alert.alert(
                                    "", "Appointment End time should be less than Buisness End Time of First Half",
                                    [{
                                        color: '#fff',
                                        text: "OK",
                                        onPress: () => console.log("Cancel Pressed"),
                                        style: "cancel",
                                    }]
                                );
                                // Alert.alert('Set');
                            } else {

                                var end_time2;
                                var app_end_time2;
                                if (moment(new Date(this.state.BET2.seconds * 1000 + this.state.BET2.nanoseconds / 1000000)).format('hh:mm:ss a') != 'Invalid date') {
                                    end_time2 = new Date(this.state.BET2.seconds * 1000 + this.state.BET2.nanoseconds / 1000000)
                                } else {
                                    end_time2 = this.state.BET2
                                }
                                if (moment(new Date(this.state.AET2.seconds * 1000 + this.state.AET2.nanoseconds / 1000000)).format('hh:mm:ss a') != 'Invalid date') {
                                    app_end_time2 = new Date(this.state.AET2.seconds * 1000 + this.state.AET2.nanoseconds / 1000000)
                                } else {
                                    app_end_time2 = this.state.AET2
                                }
                                console.log("app_end_time2", moment(app_end_time2).format("HH:mm:ss"), "\n end_time2", moment(end_time2).format("HH:mm:ss"))
                                if (moment(app_end_time2).format("HH:mm:ss") > moment(end_time2).format("HH:mm:ss")) {
                                    // console.log("BET1", moment(end_time).format("HH:mm:ss"), "\n AET1", moment(end_time2).format("HH:mm:ss"));
                                    Alert.alert(
                                        "", "Appointment End time should be less than Buisness End Time of Second Half",
                                        [{
                                            color: '#fff',
                                            text: "OK",
                                            onPress: () => console.log("Cancel Pressed"),
                                            style: "cancel",
                                        }]
                                    );
                                    // Alert.alert('Set');
                                } else {
                                    console.log("Go ahead");
                                    firestore().collection('owner').doc(this.state.owner_number).update({
                                        // user_Id: this.props.route.params.userId,
                                        Buisness_name: this.state.Business_Name,

                                        buisness_start_time: BST1,
                                        buisness_end_time: BET1,
                                        appointment_start_time: AST1,
                                        appointment_end_time: AET1,

                                        second_buisness_start_time: BST2,
                                        second_buisness_end_time: BET2,
                                        second_appointment_start_time: AST2,
                                        second_appointment_end_time: AET2,

                                        image_url: this.state.fs_imageurl1 ? this.state.fs_imageurl1 : this.state.avatarSource,
                                        Availablity: true,
                                        shift: shift
                                    }).then(() => {
                                        console.log('succefull signup');
                                        this.props.navigation.navigate('BLogin3');
                                    })
                                }
                            }

                        }
                    }
                } else {

                    var end_time;
                    var app_end_time;
                    if (moment(new Date(this.state.BET1.seconds * 1000 + this.state.BET1.nanoseconds / 1000000)).format('hh:mm:ss a') != 'Invalid date') {
                        end_time = new Date(this.state.BET1.seconds * 1000 + this.state.BET1.nanoseconds / 1000000)
                    } else {
                        end_time = this.state.BET1
                    }
                    if (moment(new Date(this.state.AET1.seconds * 1000 + this.state.AET1.nanoseconds / 1000000)).format('hh:mm:ss a') != 'Invalid date') {
                        app_end_time = new Date(this.state.AET1.seconds * 1000 + this.state.AET1.nanoseconds / 1000000)
                    } else {
                        app_end_time = this.state.AET1
                    }
                    console.log("app_end_time", moment(app_end_time).format("HH:mm:ss"), "\n end_time", moment(end_time).format("HH:mm:ss"))
                    if (moment(app_end_time).format("HH:mm:ss") > moment(end_time).format("HH:mm:ss")) {
                        // console.log("BET1", moment(end_time).format("HH:mm:ss"), "\n AET1", moment(end_time2).format("HH:mm:ss"));
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
                        console.log("false Go ahead");
                        firestore().collection('owner').doc(this.state.owner_number).update({
                            //   user_Id: this.props.route.params.userId,
                            Buisness_name: this.state.Business_Name,

                            buisness_start_time: BST1,
                            buisness_end_time: BET1,
                            appointment_start_time: AST1,
                            appointment_end_time: AET1,

                            image_url: this.state.fs_imageurl1 ? this.state.fs_imageurl1 : this.state.avatarSource,
                            Availablity: true,
                            shift: shift
                        }).then(() => {
                            console.log('succefull signup');
                            this.props.navigation.navigate('BLogin3');
                        })
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
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('profile_details_2') }}>
                            <RN_Icon name='arrowleft' size={30} color="#000" />
                        </TouchableOpacity>
                    </Left>
                    <Body style={styles.Header_Body}>
                        <Title style={styles.Header_Name}>Edit Vendor's Details</Title>
                    </Body>
                    <Right style={{ flex: 1 }} />
                </Header>
                <Content>
                    <TouchableHighlight onPress={() => { this.setImage() }} style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <ImageBackground style={{ width: wp('100%'), height: 170, zIndex: 900, backgroundColor: 'grey', justifyContent: 'center', alignItems: 'center' }} source={this.state.avatarSource ? { uri: this.state.avatarSource } : require('../img/b1.jpg')} >
                            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                                <Text style={{ color: 'white', textAlign: 'center' }}> click here to select New shop Profile</Text>
                            </View>
                        </ImageBackground>
                    </TouchableHighlight>
                    <View style={{ margin: wp('0.5%'), marginTop: 20 }}>
                        <Text style={{
                            marginLeft: hp('2%'),
                            marginRight: hp('2%')
                        }}> Edit Your Vendor Name</Text>
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
                                        <Text>{this.state.BST1 ? moment(new Date(this.state.BST1.seconds * 1000 + this.state.BST1.nanoseconds / 1000000)).format('hh:mm:ss a') == 'Invalid date' ? moment(this.state.BST1).format('hh:mm:ss a') : moment(new Date(this.state.BST1.seconds * 1000 + this.state.BST1.nanoseconds / 1000000)).format('hh:mm:ss a') : '--:--'}</Text>
                                    </View>
                                    <View>
                                        <Text>End Time</Text>
                                        <Text>{this.state.BET1 ? moment(new Date(this.state.BET1.seconds * 1000 + this.state.BET1.nanoseconds / 1000000)).format('hh:mm:ss a') == 'Invalid date' ? moment(this.state.BET1).format('hh:mm:ss a') : moment(new Date(this.state.BET1.seconds * 1000 + this.state.BET1.nanoseconds / 1000000)).format('hh:mm:ss a') : '--:--'}</Text>
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
                                            <Text>{this.state.BST2 ? moment(new Date(this.state.BST2.seconds * 1000 + this.state.BST2.nanoseconds / 1000000)).format('hh:mm:ss a') == 'Invalid date' ? moment(this.state.BST2).format('hh:mm:ss a')
                                                : moment(new Date(this.state.BST2.seconds * 1000 + this.state.BST2.nanoseconds / 1000000)).format('hh:mm:ss a')
                                                : '--:--'}</Text>
                                        </View>
                                        <View>
                                            <Text>End Time</Text>
                                            <Text>{this.state.BET2 ? moment(new Date(this.state.BET2.seconds * 1000 + this.state.BET2.nanoseconds / 1000000)).format('hh:mm:ss a') == 'Invalid date' ? moment(this.state.BET2).format('hh:mm:ss a')
                                                : moment(new Date(this.state.BET2.seconds * 1000 + this.state.BET2.nanoseconds / 1000000)).format('hh:mm:ss a')
                                                : '--:--'}</Text>
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
                                        <Text>{this.state.AST1 ? moment(new Date(this.state.AST1.seconds * 1000 + this.state.AST1.nanoseconds / 1000000)).format('hh:mm:ss a') == 'Invalid date' ? moment(this.state.AST1).format('hh:mm:ss a')
                                            : moment(new Date(this.state.AST1.seconds * 1000 + this.state.AST1.nanoseconds / 1000000)).format('hh:mm:ss a')
                                            : '--:--'}</Text>
                                    </View>
                                    <View>
                                        <Text>End Time</Text>
                                        <Text>{this.state.AET1 ? moment(new Date(this.state.AET1.seconds * 1000 + this.state.AET1.nanoseconds / 1000000)).format('hh:mm:ss a') == 'Invalid date' ? moment(this.state.AET1).format('hh:mm:ss a')
                                            : moment(new Date(this.state.AET1.seconds * 1000 + this.state.AET1.nanoseconds / 1000000)).format('hh:mm:ss a')
                                            : '--:--'}</Text>
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
                                                <Text>{this.state.AST2 ? moment(new Date(this.state.AST2.seconds * 1000 + this.state.AST2.nanoseconds / 1000000)).format('hh:mm:ss a') == 'Invalid date' ? moment(this.state.AST2).format('hh:mm:ss a')
                                                    : moment(new Date(this.state.AST2.seconds * 1000 + this.state.AST2.nanoseconds / 1000000)).format('hh:mm:ss a')
                                                    : '--:--'}</Text>
                                            </View>
                                            <View>
                                                <Text>End Time</Text>
                                                <Text>{this.state.AET2 ? moment(new Date(this.state.AET2.seconds * 1000 + this.state.AET2.nanoseconds / 1000000)).format('hh:mm:ss a') == 'Invalid date' ? moment(this.state.AET2).format('hh:mm:ss a')
                                                    : moment(new Date(this.state.AET2.seconds * 1000 + this.state.AET2.nanoseconds / 1000000)).format('hh:mm:ss a')
                                                    : '--:--'}</Text>
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
                    </Content>
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
