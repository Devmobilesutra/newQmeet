import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Icon, Fab, H1, } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import { TouchableHighlight } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import { v4 as uuidv4 } from 'uuid';
import storage from '@react-native-firebase/storage';

const options = {
    // title: 'Select Avatar',
    // storageOptions: {
    //     noData: true
    // },
    noData: true
};

class Profile_info extends React.Component {

    state = {
        owners_info: [],
        owners_Name: '',
        mobileno: '',
        avatarSource: '',
        modalVisible: false,
        fs_imageurl: '',
        disable: true,
        isLoading: false,
        imagePath: require('../img/face1.jpg')
    }

    componentDidMount() {

        this.retrievData()
        this.requestUserPermission()
    }

    componentWillUnmount() {
        this.setState({
            owners_info: [],
            owners_Name: '',
            mobileno: '',
            modalVisible: false,
            disable: true,
            isLoading: false,
            fs_imageurl: '',
            ImageSize: 0,
            imagePath: require("../img/face1.jpg"),
        })
    }

    async requestUserPermission() {
        
    }

    retrievData = async () => {
        const value = await AsyncStorage.getItem('@owner_number');
        console.log('own no', value)
        this.setState({
            mobileno: value
        })
        const data = await firestore().collection('user').doc(value).get()
        console.log(data)
        console.log(data.exists)
    }
    save_info = async () => {

        this.setState({
            isLoading: true
        })
        console.log(this.state.owners_Name)
        const uploadedData = await firestore()
            .collection('user')
            .add({
                name: this.state.owners_Name,
                mobile_no: this.state.mobileno,
                imageurl: this.state.fs_imageurl,
                user_token: this.state.user_token,
            })
        await AsyncStorage.setItem('@user_type', '1');// 1 for user and two for owner. by default all are users
        console.log(await AsyncStorage.getItem('@user_type'))
        this.setState({ isLoading: false }, () => {
            this.props.navigation.navigate('Book_Appointment')
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
                
                if (source && response.fileSize <= 300000) {

                    // code copied from https://www.pluralsight.com/guides/upload-images-to-firebase-storage-in-react-native
                    let path = this.getPlatformPath(response).value;
                    let fileName = this.getFileName(response.fileName, path);
                    this.setState({ imagePath: path, avatarSource: source });
                    this.uploadImageToStorage(path, fileName);

                } else {
                    Alert.alert('File should be less than 300KBs')
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
        let task = reference.putFile(path);
        task.then(async (response) => {
            console.log('Image uploaded to the bucket!');
            // const url = await storage().ref('images/profile-1.png').getDownloadURL();
            this.setState({ isLoading: false, status: 'Image uploaded successfully', fs_imageurl: await reference.getDownloadURL() });

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

    render() {
        return (
            <SafeAreaView
                style={{
                    backgroundColor: 'white',
                    flex: 1,
                }}>
                <Modal transparent={true} visible={this.state.isLoading} >
                    <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                        <ActivityIndicator color='#2570EC' size='large' style={{ alignSelf: 'center' }} />
                    </View>
                </Modal>
                <ScrollView>
                    <Header style={{ backgroundColor: 'white', height: hp('8%') }} androidStatusBarColor='grey' >
                        <Body style={{
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text
                                style={{
                                    fontSize: wp('5%'),
                                    color: '#2570EC',
                                    fontWeight: '700',
                                    fontFamily: 'Averia Serif Libre',
                                }}>
                                Profile Info
                            </Text>
                        </Body>
                    </Header>
                    <View
                        style={{
                            paddingLeft: wp('5%'),
                        }}>
                        <Text
                            style={{

                                fontWeight: 'bold',
                                fontSize: wp('3.5%'),
                                color: '#343434',
                                marginTop: hp('2%'),
                            }}>
                            Please enter your name and profile photo (optional)
                        </Text>

                        <View>
                            <TextInput
                                value={this.state.owners_Name}
                                onChangeText={(owners_Name) => {
                                    this.setState({ owners_Name: owners_Name, disable: false })
                                }}
                                keyboardType="ascii-capable"
                                // keyboardType="numeric"
                                fontSize={30}
                                style={{
                                    // margin: hp('2%'),
                                    color: '#5F6368',
                                    //height: 90,
                                    width: wp('90%'),
                                    borderColor: 'blue',
                                    borderBottomWidth: 1.5,
                                }}></TextInput>
                        </View>
                    </View>
                    <View style={{
                        marginTop: hp('10%'),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <TouchableHighlight onPress={() => { this.setImage() }}>
                            <Thumbnail
                             style={{ borderRadius: 100, height: hp('30%'), width: wp('55%'), }} 
                             large source={this.state.avatarSource ? this.state.avatarSource  : require('../img/five.jpg')} />
                        </TouchableHighlight>
                    </View>
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: this.state.disable ? '#D3D3D3' : '#2570EC',
                                width: wp('90%'),
                                height: hp('7.5%'),
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: hp('14%'),
                            }}
                            disabled={this.state.disable}
                            onPress={() => { this.save_info() }}
                        >
                            <Text style={{ color: 'white', fontSize: 14 }}>Use Qmeet</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
export default Profile_info;

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
        width: '100%',
        height: hp('60%'),
        paddingTop: 12,
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