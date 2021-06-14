import React, { Component } from 'react';
import { ImageBackground, BackHandler, StyleSheet, View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, StatusBar, TouchableHighlight, Linking, Alert } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { ScrollView } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol } from 'react-native-responsive-screen';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon } from 'native-base';
import RN_Icon from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
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
        this.props.navigation.navigate('Book_Appointment');
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
            console.log("qr code state", this.state.qr)
            if(this.state.qr) {
                this.check_availability(this.state.qr.replace(/"/g, ""))
            }
        })
        console.log("id", e.data)
    }
    check_availability(check_ownerId) {
        console.log("This is Check Avilability");
        firestore().collection('owner').doc(check_ownerId).get()
            .then(data => {
                if(data.exists) {
                    console.log("fetched owner details", data.data()) 
                    this.props.navigation.navigate('confirm_Appointment', {
                        ownerId: check_ownerId
                    })
                    return
                } else if (!data.exists) {
                    Alert.alert(
                        'Warning',
                        `This mobile number is not registered with us`,
                        [{
                            text: 'OK', onPress: () => {
                                this.props.navigation.navigate('Book_Appointment'); 
                            }
                        }],
                        { cancelable: false }
                    );
                }             
            })
    }
    render() {
        return (
            <>
                {/* <StatusBar barStyle="dark-content"></StatusBar> */}
                <SafeAreaView style={{ backgroundColor: '#FFFFFF' }}>
                    <ScrollView>
                        <QRCodeScanner
                            onRead={this.onRead}
                            reactivate={true}
                            reactivateTimeout={3000}
                            showMarker={true}
                            markerStyle={{ borderColor: '#FFF', borderRadius: 15 }}
                        />

                        <View style={{ width: '100%', marginTop: 40, justifyContent: 'flex-start', alignItems: 'center' }}>
                            <View style={{ width: '90%', margin: 40, justifyContent: 'center', alignItems: 'center', borderColor: 'grey' }} >
                                <Image source={require('../Assets/or_line.png')} style={{ width: 300}} />
                            </View>
                            
                            <Text style={{ alignSelf: 'flex-start', marginLeft: wp('3%'), fontFamily: 'Roboto_medium', fontWeight: '700', fontStyle: 'normal' }}> Enter vendor’s mobile number </Text>
                            <TextInput
                                value={this.state.mobileNo}
                                onChangeText={(mobileNo) => this.setState({ mobileNo })}
                                keyboardType="numeric"
                                maxLength={10}
                                fontSize={wp('9%')}
                                style={{
                                    width: '90%',
                                    color: '#2570EC',
                                    borderColor: 'blue',
                                    borderBottomWidth: 1,
                                }} />
                            <TouchableHighlight
                                style={{ ...styles.buttonTouchable, backgroundColor: this.state.mobileNo.length == 10 ? '#2570EC' : '#808080' }}
                                onPress={() => {
                                    if (this.state.mobileNo.length == 10) {
                                        // this.props.navigation.navigate('confirm_Appointment', { ownerId: this.state.mobileNo });
                                        this.check_availability(this.state.mobileNo);
                                    } else {
                                        Alert.alert("Please Enter vendor’s mobile Number")
                                    }
                                }}>
                                <Text style={{ color: '#FFFFFF' }}>Next</Text>
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