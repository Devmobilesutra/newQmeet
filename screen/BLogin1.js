import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, Alert, TouchableHighlight, Modal, ActivityIndicator, BackHandler } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon } from 'native-base';
import { Thumbnail } from 'native-base';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-picker';

const options = {
    title: 'my pic app',
    takePhotoButtonTitle: 'Take photo with your camera',
    chooseFromLibraryButtonTitle: 'Choose photo from library',
}

class BLogin1 extends React.Component {
    state = {
        owner_number: '',
        buisness_Name: '',
        userId: '',
        fs_imageurl: '',
        user_token: '',
        loader: '',
        avatarSource1: '',
        avatarSource: ''
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backAction);
    }
    backAction = () => {
        this.props.navigation.navigate('Book_Appointment')
        return true;
    };
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.backAction);
        this.data()
    }

    data = async () => {

        try {
            const value = await AsyncStorage.getItem('@owner_number');
            this.setState({
                owner_number: value
            })

            const owner = await firestore().collection('owner').doc(value).get()
            console.log("llllll", owner.exists)
            if (owner.exists) {
                console.log(owner)
                console.log(owner.data().Buisness_name)
                console.log(owner.data().image_url)
                let image
                if (owner.data().image_url) {
                    image = owner.data().image_url
                } else {
                    image = '../img/face1.jpg'
                }
                this.setState({
                    buisness_Name: owner.data().Buisness_name,
                    avatarSource1: image,
                }, () => {
                    console.log(this.state.avatarSource1)
                })
            }
            await firestore()
                .collection('user')
                .where('mobile_no', '==', value)
                .get()
                .then((data) => {
                    data.forEach(e => {
                        console.log("e has values", e);
                        this.setState({
                            userId: e.id,
                            user_token: e.data().user_token
                        })
                    })
                })
        } catch {
            console.log('my error')
            Alert.alert('Please create your user account first')
        }

    }
    save_data = () => {
        let docId = this.state.owner_number
        const uploadedData = firestore()
            .collection('owner')
            .doc(docId)
            .set({
                user_Id: this.state.userId,
                Buisness_name: this.state.buisness_Name,
                buisness_start_time: '',
                buisness_end_time: '',
                appointment_start_time: '',
                appointment_end_time: '',
                image_url: this.state.fs_imageurl,
                owner_token: this.state.user_token,
                Availablity: false
            })
            .then(async () => {
                console.log('Buisess name added succefully')
                const setvalue = await AsyncStorage.setItem(
                    '@user_type', '2' // 1 for user and two for owner. by default all are users
                );
                this.props.navigation.navigate('BLogin2');
            })
            .catch(err => {
                Alert.alert('please contact mobilesutra err : ', err)
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
        task.then(() => {
            console.log('Image uploaded to the bucket!');
            this.setState({ isLoading: false, status: 'Image uploaded successfully', fs_imageurl: reference.getDownloadURL() });
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

    //     this.setState({ loader: false })
    //     if (path) {
    //         //code
    //         console.log("File type", path)

    //         const sessionId = new Date().getTime();

    //         var storageRef = storage().ref(`shop_images`).child(`${sessionId}`);

    //         var task = storageRef.putFile(this.state.avatarSource.uri, { contentType: mime })
    //             .on(
    //                 'state_changed', taskSnapshot => {
    //                     console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
    //                 },
    //                 error => {
    //                     console.log('err while uploading data onto firebase storage', error)
    //                 },
    //                 () => {
    //                     storageRef.getDownloadURL()
    //                         .then((downloadurl) => {
    //                             console.log("file availale at :", downloadurl);
    //                             this.setState({ fs_imageurl: downloadurl, loader: false })
    //                         })
    //                 }
    //             );
    //     } else {
    //         //code
    //         console.log('image uploading error')
    //     }
    // }
    render() {
        // https://firebasestorage.googleapis.com/v0/b/queue-bf183.appspot.com/o/shop_images%2F1606303166308?alt=media&token=4a4064e9-79e4-484a-867d-a9aa326eafa6
        return (
            <SafeAreaView
                style={{
                    backgroundColor: 'white',
                    flex: 1,
                }}>
                <Modal transparent={true} visible={this.state.loader} ><ActivityIndicator color='#2570EC' size='large' /></Modal>
                {/* ------------------------- Header Bar ----------------------------------- */}
                <Header style={{ backgroundColor: 'white', height: hp('8%') }} androidStatusBarColor='grey' >
                    <Left>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Book_Appointment')}
                        >
                            <Text style={{ fontSize: wp('6%') }}>  ☰  </Text>
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <Text
                            numberOfLines={1}
                            style={{
                                textAlign: 'center',
                                marginLeft: wp('9%'),
                                marginRight: wp('-16%'),
                                fontSize: wp('5%'),
                                color: '#2570EC',
                                fontFamily: 'Averia Serif Libre',
                            }}>
                            Business sign-up
                        </Text>
                    </Body>
                    <Right />
                </Header>
                <View style={{ marginTop: hp('3%'), }}>
                    <Text style={{ marginLeft: wp('3%'), fontWeight: 'bold', fontSize: wp('3.5%') }}>
                        Please enter your business name and its profile photo (optional)
                    </Text>
                </View>
                <View>
                    <TextInput
                        keyboardType="ascii-capable"
                        placeholder="Your Business name"
                        fontSize={35}
                        value={this.state.buisness_Name}
                        onChangeText={(buisness_Name) => this.setState({ buisness_Name })}
                        style={{
                            width: wp('90%'),
                            margin: wp('3%'),
                            color: '#5F6368',
                            borderColor: 'blue',
                            borderBottomWidth: 1,
                        }}></TextInput>
                </View>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: hp('10%'),
                    }}>

                    <TouchableHighlight onPress={() => { this.setImage() }}>
                        <Thumbnail
                            style={{ borderRadius: 100, height: hp('30%'), width: wp('55%'), }}
                            large
                            source={this.state.avatarSource ?
                                this.state.avatarSource : require('../img/face1.jpg')}
                        />
                    </TouchableHighlight>
                    {this.state.avatarSource ? <Text> image already uploaded</Text> : null}
                </View>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: wp('2%'),
                    }}>
                    <TouchableOpacity
                        onPress={() => {
                            // this.props.navigation.navigate('BLogin2');
                            this.save_data()
                        }}
                        style={{
                            backgroundColor: '#2570EC',
                            width: wp('90%'),
                            height: hp('7.5%'),
                            borderRadius: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: hp('10%'),
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Text style={{ color: 'white', fontSize: 14 }}>Next</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}

export default BLogin1;
