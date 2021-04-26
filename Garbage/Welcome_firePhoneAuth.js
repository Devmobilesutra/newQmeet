import React from 'react';
import { ActivityIndicator, View, Image, StyleSheet, Modal, ScrollView, Linking, TouchableOpacity, SafeAreaView, TouchableHighlight, Alert, BackHandler, } from 'react-native';
import { Container, Content, Text } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol } from 'react-native-responsive-screen';
import CodeInput from 'react-native-confirmation-code-input';
import Axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import TextInput1 from './Common_services/TextInput1';
import Header_Bar from './Common_services/App_Header'
import auth from '@react-native-firebase/auth';

class Welcome extends React.Component {

    state = {
        confirmation: '',
        modalVisible: false,
        name: '',
        owners_info: [],
        mobileNo: '8830819392',
        OTP: '',
        disable: true,
        error: '',
        confirm: '',
        loader: false,
    };

    async PhoneAuth() {
        this.setState({ loader: !this.state.loader });
        let phoneNumber = '+91' + this.state.mobileNo;
        console.log("Phone number", phoneNumber);
        this.state.confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        this.setState({ modalVisible: true, loader: !this.state.loader });
        console.log("otp", this.state.confirmation);
    }
    async Verify(code) {
        console.log('verify code');
        try {
            await this.state.confirmation.confirm(code);
            console.log("Verify");
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
                } else {
                    console.log('navigating to profile info');
                    this._storeData()
                    this.setState({ modalVisible: false });
                    this.props.navigation.navigate('Profile_info');
                }
            }
        } catch (error) {
            console.log('Invalid code.');
            Alert.alert('Invalid OTP');
        }
    }
    OpenUrl() {
        Linking.canOpenURL("https://www.theverge.com/2020/2/4/21122044/google-photos-privacy-breach-takeout-data-video-strangers").then(supported => {
            if (supported) {
                Linking.openURL("https://www.theverge.com/2020/2/4/21122044/google-photos-privacy-breach-takeout-data-video-strangers");
            } else {
                console.log("Don't know how to open URI: ");
            }
        });
    }
    closeModal() {
        // this.setState({ modalVisible: false })
        Alert.alert("Hold on!", "Are you sure you want to go back?", [
            { text: "YES", onPress: () => BackHandler.exitApp() }
        ], { cancelable: false });
        return true;
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

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
    }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backAction);
    }
    createTwoButtonAlert = () => {
        const { mobileNo } = this.state;

        let str = /^[0-9]+$/
        if (mobileNo == '') {
            Alert.alert("Please enter mobile number")
        } else if (mobileNo.length !== 10 && str.test(mobileNo)) {
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
                        // text: "Continue", onPress: () => { this.sendOtp() }
                        text: "Continue", onPress: () => { this.PhoneAuth() }
                        // text: "Continue", onPress: () => { this.setState({ modalVisible: !this.state.modalVisible }, () => console.log("pressed", this.state.modalVisible)) }
                    }
                ],
                { cancelable: false }
            );
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

    render() {
        return (
            <SafeAreaView style={styles.main} >
                <Modal transparent={true} visible={this.state.loader} >
                    <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                        <ActivityIndicator color='#2570EC' size='large' style={{ alignSelf: 'center' }} />
                    </View>
                </Modal>
                <ScrollView>
                    <Header_Bar />
                    <Container>
                        <Content contentContainerStyle={styles.content}>
                            <Text style={{ marginTop: hp('6%'), marginLeft: hp('-1%'), fontSize: wp('6.2%'), fontFamily: 'NotoSans-Regular' }}> Welcome to Qmeet </Text>
                            <Text style={{ fontSize: wp('3.5%'), fontFamily: 'Roboto_medium' }}> Please enter your mobile number </Text>
                            <TextInput1 placeholder="Mobile Number" onChangeText={(mobileNo) => { this.setState({ mobileNo: mobileNo }, () => console.log(this.state.mobileNo)) }} />
                            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                <Image style={styles.container} source={require('../img/two.png')} />
                            </View>
                            <View style={{ marginTop: hp('10%'), alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center' }} >
                                    <Text style={styles.T_n_CText}> By clicking on next, you agree with our</Text>
                                    <TouchableOpacity onPress={() => { this.OpenUrl() }}><Text style={styles.T_n_C}> Terms & Conditions </Text></TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    onPress={this.createTwoButtonAlert}
                                    disabled={this.state.mobileNo.length == 10 ? false : true}
                                    style={{
                                        backgroundColor: this.state.mobileNo.length == 10 ? '#2570EC' : '#808080',
                                        width: wp('85%'),
                                        height: hp('7.5%'),
                                        borderRadius: 50,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        margin: hp('3%'),
                                    }}>
                                    <Text style={{ color: 'white', fontSize: 14 }}>Next</Text>
                                </TouchableOpacity>
                            </View>
                            <Container padder>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={this.state.modalVisible}
                                    // onDismiss={() => { this.backAction }}
                                    onRequestClose={() => {
                                        this.setState({ modalVisible: false }, () => { this.closeModal() })
                                    }}
                                >
                                    <Content contentContainerStyle={styles.overlay}>
                                        <View style={styles.container2}>
                                            <Text style={{ fontFamily: 'Roboto_medium', fontSize: wp('3.8%') }}>
                                                Enter OTP sent to your mobile number
                                            </Text>
                                            <CodeInput
                                                ref="codeInputRef1"
                                                className={'border-b'}
                                                space={7}
                                                codeLength={6}
                                                size={40}
                                                codeInputStyle={{ fontWeight: '800', fontSize: 30 }}
                                                keyboardType="numeric"
                                                inputPosition="center"
                                                activeColor="#000000"
                                                inactiveColor="blue"
                                                autoFocus={false}
                                                ignoreCase={true}
                                                onFulfill={(code) => this.Verify(code)}
                                            />
                                        </View>
                                    </Content>
                                </Modal>
                            </Container>
                        </Content>
                    </Container>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        zIndex: 999,
        top: hp('4%'),
        width: '100%',
        height: hp('27%'),
    },
    content: {
        paddingLeft: 20,
        paddingRight: 20
    },
    header_bg: {
        backgroundColor: "#FFFFFF",
    },
    T_n_C: {
        fontSize: wp('3.5%'),
        color: '#EA4335',
    },
    T_n_CText: {
        fontSize: wp('3.5%'),
        color: '#343434',
    },
    main: {
        backgroundColor: '#FFFFFF',
        flex: 1,
    },
    nextButton: {
        width: wp('90%'),
        height: hp('7.5%'),
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        margin: hp('3%'),
    },
    //////////////////////////////modal style///////////////////////////////
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        flex: 1,
        justifyContent: 'flex-end',
    },
    container2: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        height: hp('60%'),
        padding: 30,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
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

