import React, { Component } from 'react';
import { ImageBackground, BackHandler, StyleSheet, View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, StatusBar, TouchableHighlight, Linking, Alert } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { ScrollView } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol } from 'react-native-responsive-screen';
// import Qmeet_line from "../img/qmeet_line";
class qrcode_scanner extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mobileNo: '',
            user_id: '',
            user_mobileNo: '',
            user_name: '',
            qr: '',
        }
    }

    backAction = () => {
        this.props.navigation.navigate('Book_Appointment')
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

    onRead = e => {
        this.setState({
            qr: e.data
        }, () => {
            this.props.navigation.navigate('confirm_Appointment', {
                ownerId: this.state.qr.replace(/"/g, "")
            })
        })
        console.log("id", e.data)
        // Linking.openURL(e.data).catch( err => {
        //     Alert.alert("Invalid QR Code", e.data)
        // })

    }
    render() {
        return (
            <>
                <StatusBar barStyle="dark-content"></StatusBar>
                <SafeAreaView>
                    <ScrollView
                        contentInsetAdjustmentBehavior='automatic'
                    >
                        {/* <Header /> */}
                        <QRCodeScanner
                            onRead={this.onRead}
                            reactivate={true}
                            reactivateTimeout={3000}
                            showMarker={true}
                            markerStyle={{ borderColor: '#FFF', borderRadius: 15 }}
                        />
                        {/* <Text>{'\n'}</Text> */}

                        <View style={{ width: '100%', marginTop: 40, justifyContent: 'flex-start', alignItems: 'center' }}>
                            <View style={{ borderBottomWidth: 1, width: '90%', margin: 40, justifyContent: 'center', alignItems: 'center', borderColor: 'grey' }} >
                                <View style={{ top: wp('4%'), width: wp('9%'), height: hp('4%'), backgroundColor: '#DDDDDD', justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{ fontSize: 20, zIndex: 999, position: 'relative', textAlign: 'center' }}>OR</Text>
                                </View>
                            </View>
                            <Text style={{ alignSelf: 'flex-start', marginLeft: wp('3%') }}> Enter Buisnes Mobile No </Text>
                            <TextInput
                                value={this.state.mobileNo}
                                onChangeText={(mobileNo) => this.setState({ mobileNo })}
                                keyboardType="phone-pad"
                                maxLength={10}
                                fontSize={35}
                                style={{
                                    width: '90%',
                                    color: '#2570EC',
                                    borderColor: 'blue',
                                    borderBottomWidth: 1,
                                }} />
                            <TouchableHighlight
                                style={{ ...styles.buttonTouchable }}
                                onPress={() => {
                                    if (this.state.mobileNo) {
                                        this.props.navigation.navigate('confirm_Appointment', { ownerId: this.state.mobileNo });
                                    } else {
                                        Alert.alert("Please Enter buisess's mobile Number")
                                    }
                                }}>
                                <Text style={{ color: '#FFFFFF'}}>Next</Text>
                            </TouchableHighlight>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        );
    }
}

export default qrcode_scanner;

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        margin: hp('5%'),
        backgroundColor: '#2570EC',
        width: wp('90%'),
        height: hp('7.5%'),
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    }
});