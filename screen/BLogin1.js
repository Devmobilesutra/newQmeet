import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert, TouchableHighlight, Modal, ActivityIndicator, BackHandler } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import { Container, Header, Title, Content, Left, Right, Body } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import RN_Icon from 'react-native-vector-icons/Ionicons';
import { ImageBackground } from 'react-native';

const options = {
    // title: 'Select Avatar',
    // storageOptions: {
    //     noData: true
    // },
    noData: true
};

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
})

class BLogin1 extends React.Component {
    state = {
        owner_number: '',
        buisness_Name: '',
        userId: '',
        fs_imageurl: '',
        user_token: '',
        loader: '',
        avatarSource1: '',
        avatarSource: '',
        fileName: '',
        imagePath:  ''
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
            this.setState({owner_number: value})
            await firestore()
                .collection('user')
                .where('mobile_no', '==', value)
                .get()
                .then((data) => {
                    data.forEach(e => {
                        console.log("e has values", e);
                        this.setState({ userId: e.id, user_token: e.data().user_token })
                    })
                })
        } catch {
            console.log('my error')
            Alert.alert('Please create your user account first')
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

                if (source && response.fileSize <= 2000000) {
                    // code copied from https://www.pluralsight.com/guides/upload-images-to-firebase-storage-in-react-native
                    let path = this.getPlatformPath(response).value;
                    let fileName = this.getFileName(response.fileName, path);
                    this.setState({ imagePath: path, avatarSource: source, fileName: fileName });
                    // this.uploadImageToStorage(path, fileName);

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
    render() {
        let { imagePath } = this.state;
        let imgSource = this.getPlatformURI(imagePath)
        return (
            <SafeAreaView style={{ backgroundColor: 'white', flex: 1, }}>
                <Modal transparent={true} visible={this.state.loader} >
                    <ActivityIndicator color='#2570EC' size='large' />
                </Modal>
                {/* ------------------------- Header Bar ----------------------------------- */}
                <Header style={styles.header_bg} androidStatusBarColor="grey">
                    <Left style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Book_Appointment') }}>
                            <RN_Icon name='menu' size={30} color="#000" />
                        </TouchableOpacity>
                    </Left>
                    <Body style={styles.Header_Body}>
                        <Title style={styles.Header_Name}>Business sign-up</Title>
                    </Body>
                    <Right style={{ flex: 1 }} />
                </Header>
                {/* ----------------------- Body Of Screen ------------------------------- */}
                <Container>
                    <Content contentContainerStyle={styles.content}>
                        <View>
                            <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>
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

                            <TouchableHighlight onPress={() => { this.setImage() }} style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('10%'), }}>
                                <ImageBackground style={{ width: wp('100%'), height: 250, zIndex: 900, backgroundColor: 'grey', justifyContent: 'center', alignItems: 'center' }} source={imgSource ? imgSource : require('../img/b1.jpg')} >
                                    <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                                        <Text style={{ color: 'white' }}>Click here to select Image</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableHighlight>
                            {/* {this.state.avatarSource ? <Text> image already uploaded</Text> : null} */}

                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate('BLogin2',
                                        {
                                            imagePath: this.state.imagePath,
                                            buisness_Name: this.state.buisness_Name,
                                            fileName: this.state.fileName,
                                            owner_number: this.state.owner_number,
                                            userId: this.state.userId,
                                            user_token: this.state.user_token
                                        })
                                }}
                                // onPress={() => { this.save_data() }}
                                disabled={this.state.buisness_Name.length > 3 ? false : true}
                                style={{
                                    backgroundColor: this.state.buisness_Name.length > 3 ? '#2570EC' : '#808080',
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
                    </Content>
                </Container>
            </SafeAreaView>
        );
    }
}

export default BLogin1;
