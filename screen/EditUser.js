import React, { Component } from 'react';
import { BackHandler, StyleSheet, View, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Title, Left, Body, Right, Button, Icon, Fab, H1, } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import { TouchableHighlight } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import RN_Icon from 'react-native-vector-icons/AntDesign';

const options = {
    title: 'Select Avatar',
    storageOptions: {
        noData: true
    },
};

class EditUser extends React.Component {

    state = {
        owners_info: [],
        owners_Name: '',
        mobileno: '',
        avatarSource1: '',
        avatarSource: '',
        modalVisible: false,
        fs_imageurl: '',
        imageurl: '',
        disable: true,
        isLoading: false,
        id: '',
    }

    backAction = () => {
        console.log("params send from respective profile details", this.props.route.params.navigation_page)
        // this.props.navigation.navigate(this.props.route.params.navigation_page)
        if (this.props.route.params.navigation_page === 2) {
            this.props.navigation.navigate('profile_details_2')
        }
        if (this.props.route.params.navigation_page === 1) {
            this.props.navigation.navigate('profile_details')
        }

        return true;
    };
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backAction);
    }
    async componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.backAction);
        const value = await AsyncStorage.getItem('@owner_number');
        console.log('own no', value)
        this.setState({ mobileno: value })
        const data = await firestore().collection('user').where('mobile_no', '==', value).get()
        console.log("data cha id", data)
        data.forEach(element => {
            console.log(element.id)
            this.setState({
                id: element.id,
                owners_Name: element.data().name,
                imageurl: element.data().imageurl,
            })
        });
    }
    save_info = async () => {

        if (this.state.owners_Name && this.state.mobileno.length == 10) {

            this.setState({ isLoading: true })
            console.log(this.state.owners_Name)
            console.log("selected image", this.state.fs_imageurl)
            console.log(typeof (this.state.mobileno))
            const uploadedData = await firestore()
                .collection('user')
                // .where('mobile_no', '==', this.state.mobileno)
                .doc(this.state.id)
                .update({
                    name: this.state.owners_Name,
                    mobile_no: this.state.mobileno,
                    imageurl: this.state.imageurl
                })
            this.setState({ isLoading: false })
            console.log("page name", this.props.route.params.navigation_page);
            if (this.props.route.params.navigation_page === 1) {
                this.props.navigation.navigate('profile_details')
            } else {
                this.props.navigation.navigate('profile_details_2')
            }

        } else {
            Alert.alert('Enter the Details Properly')
        }
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

                // You can also display the image using data:
                //   const source = { uri: 'data:image/jpeg;base64,' + response.data };

                if (source && response.fileSize <= 2000000) {

                    // code copied from https://www.pluralsight.com/guides/upload-images-to-firebase-storage-in-react-native
                    let path = this.getPlatformPath(response).value;
                    let fileName = this.getFileName(response.fileName, path);
                    this.setState({ imagePath: path, fs_imageurl: source });
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
        let task = reference.putFile(path);
        task.then(async (response) => {
            console.log('Image uploaded to the bucket! ==', await reference.getDownloadURL());
            this.setState({ isLoading: false, status: 'Image uploaded successfully', imageurl: await reference.getDownloadURL() });
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
            <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }} >
                <Modal transparent={true} visible={this.state.isLoading} >
                    <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                        <ActivityIndicator color='#2570EC' size='large' style={{ alignSelf: 'center' }} />
                    </View>
                </Modal>
                <Header style={styles.header_bg} androidStatusBarColor="grey">
                    <Left style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => {
                            this.props.route.params.navigation_page === 2
                                ? this.props.navigation.navigate('profile_details_2')
                                : this.props.navigation.navigate('profile_details')
                        }}>
                            <RN_Icon name='arrowleft' size={30} color="#000" />
                        </TouchableOpacity>
                    </Left>
                    <Body style={styles.Header_Body}>
                        <Title style={styles.Header_Name}>Edit User Details</Title>
                    </Body>
                    <Right style={{ flex: 1 }} />
                </Header>
                <ScrollView>
                    <Content style={{ padding: 20 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%'), color: '#343434', marginTop: hp('2%'), }}>
                            Enter your name
                        </Text>
                        <TextInput
                            value={this.state.owners_Name}
                            onChangeText={(owners_Name) => {
                                this.setState({ owners_Name: owners_Name, disable: false })
                            }}
                            keyboardType="ascii-capable"
                            fontSize={30}
                            style={{
                                color: '#5F6368',
                                borderColor: 'blue',
                                borderBottomWidth: 1.5,
                            }} />

                        <View style={{
                            marginTop: hp('5%'),
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>

                            <Text
                                style={{
                                    fontFamily: 'Roboto_medium',
                                    fontStyle: 'normal',
                                    alignContent: 'center',
                                    fontWeight: '500',
                                    fontSize: 14,
                                    color: '#343434',
                                }}>
                                Profile Image is optional
                        </Text>
                            <TouchableHighlight onPress={() => { this.setImage() }}>
                                <Thumbnail
                                    style={{ borderRadius: 170, height: 170, width: 170 }}
                                    large source={this.state.imageurl ? { uri: this.state.imageurl } :
                                        this.state.fs_imageurl ? this.state.fs_imageurl : require('../img/five.jpg')} />
                            </TouchableHighlight>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: this.state.disable ? '#D3D3D3' : '#2570EC',
                                    width: wp('85%'),
                                    height: hp('7.5%'),
                                    borderRadius: 50,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: hp('14%')
                                }}
                                disabled={this.state.disable}
                                onPress={() => { this.save_info() }}
                            >
                                <Text style={{ color: 'white', fontSize: 14 }}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </Content>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
export default EditUser;

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
});