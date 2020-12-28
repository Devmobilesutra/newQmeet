import React, { Component } from 'react';
import { Button, BackHandler, StyleSheet, View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, Dimensions, ToastAndroid, ScrollView, PermissionsAndroid, Alert, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import { Left } from 'native-base';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    qrview: {
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 50,
        flexDirection: 'row',
    },
    topView: {
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Buisness_name: {
        fontSize: 26,
    },
    mobile: {
        fontSize: 20,
    },
    buttonContainer: {
        marginHorizontal: 10,
        minWidth: 120,
    },
});

class BLogin3 extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            QRCode_value: '',
            Buisness_name: 'Your Buisness name',
            mobile: ''
        };
    }

    backAction = () => {
        // Alert.alert("Hold on!", "Are you sure you want to go back?", [
        //   {
        //     text: "Cancel",
        //     onPress: () => null,
        //     style: "cancel"
        //   },
        //   { text: "YES", onPress: () => BackHandler.exitApp() }
        // ]);
        this.props.navigation.navigate('profile_details_2')
        return true;

      };
    
      componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backAction);
      }
    componentDidMount() {
        this.getuser()
        // this.getDataURL()
        BackHandler.addEventListener("hardwareBackPress", this.backAction);
    }
    getuser = async () => {
        const owner_number = await AsyncStorage.getItem('@owner_number')
        await firestore()
            .collection('owner')
            .doc(owner_number)
            .get()
            .then((firebase_data) => {
                console.log(firebase_data.data())
                this.setState({
                    QRCode_value: firebase_data.id,
                    Buisness_name: firebase_data.data().Buisness_name,
                    mobile: firebase_data.id
                }, () => {
                    console.log("OR Code Array", this.state.QRCode_value)
                    console.log("owner Number", this.state.mobile)
                })
            })
    }

    getQR = () =>
        new Promise((resolve, reject) => {
            if (this.svg) {
                this.svg.toDataURL((dataURL) => {
                    resolve(dataURL);
                });
            } else {
                reject(new Error('Error getting QR Data url '));
            }
        });

    requestReadPermission = async (view = false) => {

        try {
            console.log('permission')
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Grant for read and write permissions',
                    message:
                        'If you want to Grant for read and write permissions, if you not grant for permission, you cannot continue to operate',
                    buttonNeutral: 'Ask later',
                    buttonNegative: 'Deny',
                    buttonPositive: 'Allow',
                },
            );
            console.log('granted', granted)
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.createPDF(view);
            } else {

                ToastAndroid.show(
                    'Failed to obtain read and write permissions',
                    ToastAndroid.LONG,
                );
            }
        } catch (err) {
            console.log('err', err)
            ToastAndroid.show(
                'FCatch Error',
                ToastAndroid.LONG,
            );
        }
    };

    createPDF = async (view = false) => {
        // const { route } = this.props;
        // const { Buisness_name, mobile } = route.params;
        try {
            const qrcode = await this.getQR();
            let options = {
                html: `
        <div style="height:200px;display:flex;align-items:center;justify-content:center;flex-direction:column">
                <h1  style="font-size:50px">QMeet</h1>
                <p style="font-size:20px">Online Appointment Booking App</p>
        </div>
        <div style="height:200px;display:flex;align-items:center;justify-content:center;flex-direction:column">
            <h1>${this.state.Buisness_name}</h1>
            <p style="font-size:20px">Scan this QR code</p>
        </div>
        <div style="height:500px;display:flex;align-items:center;justify-content:center;margin:50px auto">
            <img src="data:image/png;base64,${qrcode}" height="400" width="400" />
        </div>
        <div style="height:200px;display:flex;align-items:center;justify-content:center;flex-direction:column">
            <h1>OR</h1>
            <p style="font-size:16px">Enter mobile Number</p>
            <h1>${this.state.mobile}</h1>            
        </div>
        <div style="height:200px;display:flex;align-items:center;justify-content:center;flex-direction:column">
            <p style="font-size:16px">Download Qmeet Application to book an Appointment</p>           
            <p style="font-size:16px">wwww.qmeetbooking.com</p>           
        </div>
        `,
                fileName: `${this.state.Buisness_name}`,
                directory: 'Documents',
            };

            let file = await RNHTMLtoPDF.convert(options);
            console.log(file.filePath);
            console.log('file generated');
            if (view) {
                this.executeView(file.filePath);
            } else {
                this.showAlert(
                    `File is downloaded in documents directory at ${this.state.Buisness_name}.pdf`,
                );
            }
        } catch (error) {
            console.log(error);
            this.showAlert('Faied to create pdf file');
        }
    };

    showAlert = (message) => {
        Alert.alert(
            '',
            message || '',
            [
                {
                    text: 'OK',
                    onPress: () => { this.props.navigation.navigate('Appointment_List') },
                },
            ],
            { cancelable: false },
        );
    };

    download = async (view = false) => {
        console.log('download')
        if (Platform.OS === 'android') {
            this.requestReadPermission(view);
        } else {
            this.createPDF(view);
        }
    };

    view = () => {
        this.download(true);
    };

    executeView = (filePath) => {
        const { navigation } = this.props;
        navigation.navigate('PDFView', {
            filePath,
        });
    };

    render() {

        return (
            <SafeAreaView style={styles.container}>
                {/* <Left >
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Test1') }}>
                        <Text>☰</Text>
                    </TouchableOpacity>
                </Left> */}
                <ScrollView>
                    <View
                        style={{ marginTop: hp('4%'), alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            style={{ width: wp('25%'), height: hp('14%') }}
                            source={require('../img/right.png')}
                        />
                    </View>
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Text
                            style={{
                                marginTop: hp('3%'),
                                fontSize: wp('7.5%'),
                                color: '#EA4335',
                            }}>
                            Thank you !
                        </Text>
                    </View>
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Text
                            style={{
                                marginTop: hp('2.5%'),
                                fontSize: wp('5.8%'),
                                color: 'black',
                                fontFamily: 'Averia Serif Libre',
                                textAlign: 'center'
                            }}>
                            Your business has been registered Succesfully.
                        </Text>
                        {/* <Text
                            style={{
                                fontSize: wp('5.8%'),
                                color: 'black',
                                fontFamily: 'Averia Serif Libre',
                            }}>
                            
                        </Text> */}
                    </View>

                    <View style={styles.qrview}>
                        <QRCode
                            // value={`${(Buisness_name || '').trim()}:${mobile}`}
                            value={JSON.stringify(this.state.QRCode_value)}
                            size={width * 0.6}
                            getRef={(c) => (this.svg = c)}
                        />
                    </View>

                    {/* <View style={styles.bottomView}>
                    <Button
                        title="Download"
                        onPress={this.download}
                        containerStyle={styles.buttonContainer}
                    />
                    <Button
                        title="View"
                        onPress={this.view}
                        containerStyle={styles.buttonContainer}
                    />
                </View> */}

                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                // this.props.navigation.navigate('qrcode_scanner');
                                this.download()
                            }}
                            style={{
                                backgroundColor: '#2570EC',
                                width: wp('90%'),
                                height: hp('7.5%'),
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: hp('9%'),
                            }}>
                            <Text style={{ color: '#FFFFFF', fontSize: wp('4%') }} >Download and print your QR</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
export default BLogin3;
