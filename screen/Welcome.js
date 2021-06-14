import React from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    StyleSheet,
    Modal,
    Button,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    TouchableHighlight,
    Alert,
    BackHandler,
    Linking
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol } from 'react-native-responsive-screen';
import CodeInput from 'react-native-confirmation-code-input';
import Axios from 'axios';
import firestore from '@react-native-firebase/firestore';
// import messaging from '@react-native-firebase/messaging';

class Welcome extends React.Component {

    state = {
        modalVisible: false,
        name: '',
        owners_info: [],
        mobileNo: '',
        OTP: '',
        disable: true,
        error: '',
        confirm: ''
    };

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

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );

    }


    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backAction);
    }

    sendOtp() {
        this.setState({ modalVisible: true });

        console.log('send otp');

        try {

            var userId = 'sanjayathavale@mobilesutra.com';
            var pwd = 'Mobileyahoo16%04';
            // var number = 918830819392;
            var number = this.state.mobileNo;
            var rand = Math.floor(1000 + Math.random() * 9000);
            console.log("rand :", rand);
            var text = `Your OTP For Login ${rand} \n Mobilesutra`;
            var TemplateID = '1007292876278292741';
            var encodedUri = encodeURI(`https://www.businesssms.co.in/smsaspx?ID=${userId}&Pwd=${pwd}&PhNo=91${number}&Text=${text}&TemplateID=${TemplateID}`);
            Axios.get(encodedUri)
                .then(response => {
                    console.log('sma api response', response, '\n', response.data);
                    this.setState({
                        modalVisible: true,
                        OTP: rand
                    }, () => { console.log("otp state :", this.state.OTP) })
                })
                .catch(error => {
                    console.log(error);
                });

        } catch (err) {
            console.log(err)
        }
    }
    createTwoButtonAlert = () => {

        let str = /^[0-9]+$/
        if (this.state.mobileNo == '') {
            Alert.alert(
                "Please enter mobile number"
            )
        } else if (this.state.mobileNo.length !== 10 && str.test(this.state.mobileNo)) {
            Alert.alert("please enter valid mobile Number")
        }
        else {
            Alert.alert(
                "",
                "We will be verifying the phone number. Do you want to continue, or you would want to change the number.",
                [
                    {
                        color: '#fff',
                        text: "Edit Number",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                    },
                    {
                        text: "Continue", onPress: () => { this.sendOtp() }
                    }
                ],
                { cancelable: false }
            );
        }
    }
    async profiler(userInput) {

        console.log('profiler function');
        console.log(userInput);

        if (userInput == this.state.OTP) {
            const already_user = await firestore().collection('owner').doc(this.state.mobileNo).get()
            console.log(already_user)
            if (already_user.exists) {
                this._storeData_2()
                this.setState({ modalVisible: false });
                this.props.navigation.navigate('Appointment_List', { ownerId: this.state.mobileNo })
                return this.state.mobileNo
            } else {

                console.log('else part')
                const App_user = await firestore().collection('user').where('mobile_no', '==', this.state.mobileNo).get()
                console.log(App_user)
                if (!App_user.empty) {
                    const appointment = await firestore().collection('appointment').where('user_mobileNo', '==', this.state.mobileNo).get()
                    if (!appointment.empty) {
                        console.log('user has already booked an appointment')
                        let app_owner = ''
                        console.log('owner number', appointment.forEach(e => {
                            console.log("ownerData", e.data().ownerId)
                            app_owner = e.data().ownerId
                        }))
                        this._storeData_1()
                        this.setState({ modalVisible: false });
                        this.props.navigation.navigate('Customer_Ticket', { ownerId: app_owner })
                    } else {
                        console.log('its user')
                        this._storeData_1()
                        this.setState({ modalVisible: false });
                        this.props.navigation.navigate('Book_Appointment', { ownerId: this.state.mobileNo })
                    }

                    return this.state.mobileNo
                } else {
                    console.log('navigating to profile info')
                    if (this.state.OTP == userInput) {
                        this._storeData()
                        this.setState({ modalVisible: false });
                        this.props.navigation.navigate('Profile_info');
                    } else {
                        Alert.alert("Please, Enter Valid OTP");
                    }
                }
            }
        } else {
            console.log('navigating to profile info')
            if (this.state.OTP == userInput) {
                this._storeData()
                this.setState({ modalVisible: false });
                this.props.navigation.navigate('Profile_info');
            } else {
                Alert.alert("Please, Enter Valid OTP");
            }
        }
    }
    _storeData = async () => {
        try {
            const setvalue = await AsyncStorage.setItem(
                '@owner_number', this.state.mobileNo,
            );
            const type = await AsyncStorage.setItem(
                '@user_type', '0' // 1 for user and two for owner. by default all are users
            );
            console.log("async value", await AsyncStorage.getItem('@owner_number'), await AsyncStorage.getItem('@user_type'))
        } catch (error) {
            // Error saving data
            console.log(error)
        }
    };

    _storeData_1 = async () => {
        try {
            const setvalue = await AsyncStorage.setItem(
                '@owner_number', this.state.mobileNo,
            );
            const type = await AsyncStorage.setItem(
                '@user_type', '1' // 1 for user and two for owner. by default all are users
            );
            console.log("async value", await AsyncStorage.getItem('@owner_number'), await AsyncStorage.getItem('@user_type'))
        } catch (error) {
            // Error saving data
            console.log(error)
        }
    };

    _storeData_2 = async () => {
        try {
            const setvalue = await AsyncStorage.setItem(
                '@owner_number', this.state.mobileNo,
            );
            const type = await AsyncStorage.setItem(
                '@user_type', '2' // 1 for user and two for owner. by default all are users
            );
            console.log("async value", await AsyncStorage.getItem('@owner_number'), await AsyncStorage.getItem('@user_type'))
        } catch (error) {
            // Error saving data
            console.log(error)
        }
    };
    // opening url
    async openUrl() {
        const supported = await Linking.canOpenURL('http://qmeet.in/Terms');
        if (supported) {
            console.log("supported", supported);
            Linking.openURL('http://qmeet.in')
        } else {
            console.log("un supported", supported);
        }
    }
    render() {
        return (
            <SafeAreaView
                style={{
                    backgroundColor: 'white',
                    flex: 1,
                }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }}>
                    <Text
                        style={{
                            fontSize: wp('9%'),
                            color: '#EA4335',
                            fontFamily: 'Averia Serif Libre',
                        }}>
                        Q
                        <Text
                            style={{
                                fontSize: wp('9%'),
                                color: '#5F6368',
                                fontFamily: 'Averia Serif Libre',
                            }}>
                            meet
                        </Text>
                    </Text>
                </View>
                <View
                    style={{
                        marginLeft: wp('5%'),
                    }}>
                    <Text
                        style={{
                            marginTop: hp('7%'),
                            fontSize: wp('6.5%'),
                        }}>
                        Welcome to Qmeet
              </Text>
                    <Text
                        style={{
                            fontSize: wp('4%'),
                            fontFamily: 'Averia Serif Libre',
                        }}>
                        Please enter your mobile number
              </Text>
                </View>
                <TextInput
                    value={this.state.mobileNo}
                    onChangeText={(mobileNo) => {
                        this.setState({ mobileNo: mobileNo })
                    }}
                    keyboardType="numeric"
                    minLength={10}
                    maxLength={10}
                    fontSize={30}
                    style={{
                        marginLeft: wp('5%'),
                        marginRight: wp('5%'),
                        color: '#5F6368',
                        borderColor: 'blue',
                        borderBottomWidth: 1,
                    }}></TextInput>
                {this.state.error ? <Text> {this.state.error}</Text> : null}
                <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                    <Image style={styles.container} source={require('../img/two.png')} />
                </View>
                <View
                    style={{
                        marginTop: hp('10%'),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Text
                        style={{
                            fontSize: wp('3.5%'),
                            color: '#343434',
                        }}>
                        By clicking on next, you agree with our
                    </Text>
                    <TouchableOpacity
                        onPress={() => { this.openUrl() }}
                        style={{
                            fontSize: wp('3.5%'),
                            color: '#EA4335',
                        }}>

                        <Text
                            style={{
                                fontSize: wp('3.5%'),
                                color: '#EA4335',
                            }}>
                            Terms & Conditions
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.createTwoButtonAlert}
                        // onPress={() => {this.signInWithPhoneNumber('+91 9404080613')}}
                        // onPress={this.validation}
                        disabled={this.state.mobileNo.length == 10 ? false : true}
                        style={{
                            backgroundColor: this.state.mobileNo.length == 10 ? '#2570EC' : '#808080',
                            // backgroundColor: '#2570EC',
                            width: wp('90%'),
                            height: hp('7.5%'),
                            borderRadius: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: hp('3%'),
                        }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>Next</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false })
                    }}>
                    <View style={styles.overlay}>
                        <View style={styles.container2}>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                }}
                            >
                                Enter OTP sent to your mobile number
                            </Text>
                            <CodeInput
                                ref="codeInputRef1"
                                // secureTextEntry
                                className={'border-b'}
                                space={wp('2')}
                                codeLength={4}
                                size={wp('20')}
                                codeInputStyle={{ fontWeight: '800', fontSize: wp('10') }}
                                keyboardType="numeric"
                                inputPosition="center"
                                activeColor="#000000"
                                inactiveColor="blue"
                                autoFocus={false}
                                ignoreCase={true}
                                onFulfill={(code) => this.profiler(code)}
                            />
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        top: hp('4%'),
        width: '90%',
        height: hp('27%'),
    },

    //////////////////////////////modal style///////////////////////////////
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        flex: 1,
        justifyContent: 'flex-end',
    },
    container2: {
        backgroundColor: 'white',
        width: wp('100%'),
        height: hp('60%'),
        // paddingTop: 12,
        paddingHorizontal: wp('8'),
        paddingVertical: hp('8'),
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    openButton: {
        backgroundColor: '#F194FF',
        marginBottom: hp('9%'),
        width: wp('90%'),
        height: hp('7.5%'),
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStyle: {
        color: 'white',
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
export default Welcome;

