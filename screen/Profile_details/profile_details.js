import React, { Component } from 'react';
import { Accordion, Container, Header, Title, Content, Footer, FooterTab, List, ListItem, Left, Right, Body, Icon, Text, View, Card, CardItem, Tab, Tabs, TabHeading, Thumbnail } from 'native-base';
import { BackHandler, Button, StyleSheet, Modal, SafeAreaView, Image, TextInput, TouchableOpacity, ToastAndroid, Alert, } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as lor,
    removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import RN_Icon from 'react-native-vector-icons/AntDesign';
import App_Header2 from '../Common_services/App_Header2'

class profile_details extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ownerId: '',
            user_name: '',
            user_data: '',
            switch: false,
            isLoader: false,
            SetAppointment: ''
        };
    }
    async get_localData() {
        const owner = await AsyncStorage.getItem('@owner_number')
        console.log('lll', owner)
        this.setState({ ownerId: owner }, () => {
            // console.log("------------", this.state.ownerId)
        })
    }

    backAction = () => {
        this.props.navigation.goBack()
        return true;
    };
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backAction);
    }
    async componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.backAction);
        let SetAppointment = await AsyncStorage.getItem('@SetAppointment');
        console.log("SetAppointment", SetAppointment);
        this.get_localData()
            .then(() => {
                console.log("------------", this.state.ownerId)
                const fs_data = firestore()
                    .collection('user')
                    .where('mobile_no', '==', this.state.ownerId)
                    .onSnapshot(
                        (datasnap) => {
                            if (!datasnap.empty) {
                                datasnap.forEach(e => {
                                    this.setState({
                                        userId: e.id,
                                        user_data: e.data(),
                                        user_name: e.data().name,
                                        mobile_no: e.data().mobile_no,
                                        user_profile: e.data().imageurl,

                                        //Set Appointment for (stopping user from making another appointment)
                                        SetAppointment: SetAppointment
                                    })
                                })
                            }

                        }, err => {
                            console.log("data fetching error", err)
                        })
            })
    }
    deleteAccount() {
        Alert.alert("Hold On!", "Do you really want to delete your account?",
            [
                {
                    text: "No",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "YES", onPress: () => this.deleteAccount1() }
            ]);
    }
    async deleteAccount1() {
        // deleting user from system
        console.warn("deleting user")

        this.setState({ isLoader: true })
        const user = await firestore().collection('appointment').where('user_mobileNo', '==', this.state.ownerId).get()
        console.log(user.empty)
        if (!user.empty) {
            user.forEach(async (data) => {
                console.log(data.id)
                await firestore().collection('appointment').doc(data.id).delete().then(
                    datasnap => {
                        console.log("data deleted", datasnap)
                    })
            })
            await firestore().doc(`user/${this.state.userId}`).delete().then(
                datasnap => {
                    console.log("data deleted from user table", datasnap)
                    this.props.navigation.navigate("Welcome")
                })
            const type = await AsyncStorage.clear()
        } else {
            await firestore().doc(`user/${this.state.userId}`).delete().then(
                datasnap => {
                    console.log("data deleted from user table", datasnap);
                    this.props.navigation.navigate("Welcome")
                })
            const type = await AsyncStorage.clear()
        }

    }
    clickedAlert() {
        return (
            ToastAndroid.show("You have booked an Appointment, please let it complete first", ToastAndroid.SHORT)
        )
    }
    render() {
        return (
            <Container>
                <Header style={styles.header_bg} androidStatusBarColor="grey">
                    <Left style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                            <RN_Icon name='arrowleft' size={30} color="#000" />
                        </TouchableOpacity>
                    </Left>
                    <Body style={styles.Header_Body}>
                        <Title style={styles.Header_Name}>Profile details</Title>
                    </Body>
                    <Right style={{ flex: 1 }} />
                </Header>
                <Content style={{ padding: 20 }}>
                    <List style={{ borderBottomWidth: 1, borderBottomColor: '#E4E4E4' }}>
                        <TouchableOpacity >
                            <ListItem thumbnail onPress={() => this.props.navigation.navigate('EditUser', { navigation_page: 1 })}>
                                <Left>
                                    <Thumbnail source={this.state.user_profile ? { uri: this.state.user_profile } : require('../../img/five.jpg')} style={{ width: 52.03, height: 52.03, borderRadius: 52.03 }} />
                                </Left>
                                <Body>
                                    <Text numberOfLines={1}>{this.state.user_name}</Text>
                                    <Text note numberOfLines={1}>{this.state.mobile_no}</Text>
                                </Body>
                                <Right>
                                    <RN_Icon name="right" size={30} color="#000000" />
                                </Right>
                            </ListItem>
                        </TouchableOpacity>
                    </List>
                    {/* ----------------------------- Book Appointment ---------------------------------------------------------- */}
                    <List style={{ borderBottomWidth: 1, borderBottomColor: '#E4E4E4' }}>
                        <ListItem thumbnail>
                            <Body>
                                <TouchableOpacity
                                    onPress={() => { this.state.SetAppointment ? ToastAndroid.show("You already have one booking", ToastAndroid.SHORT, ToastAndroid.CENTER) : this.props.navigation.navigate('qrcode_scanner') }}
                                // disabled={this.state.SetAppointment === true ? false : true}
                                >
                                    <Text style={{ fontStyle: 'normal', fontFamily: 'NotoSans', fontWeight: '500', fontSize: 16 }}>Book appointment</Text>
                                </TouchableOpacity>
                            </Body>
                        </ListItem>
                    </List>
                    {/* ----------------------------- Business sign-up ---------------------------------------------------------- */}
                    <List style={{ borderBottomWidth: 1, borderBottomColor: '#E4E4E4' }}>
                        <ListItem thumbnail>
                            <Body>
                                {/* <Text style={{ fontStyle: 'normal', fontFamily: 'NotoSans', fontWeight: '500', fontSize: 13 }}>Business sign-up</Text> */}
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('BLogin1')}>
                                    <Text style={{ fontStyle: 'normal', fontFamily: 'NotoSans', fontWeight: '500', fontSize: 16 }}>Business sign-up</Text>
                                </TouchableOpacity>
                            </Body>
                        </ListItem>
                    </List>
                    <List>
                        <ListItem>
                            <Body>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Contact_Us_U') }}>
                                    <Text style={{ fontStyle: 'normal', fontFamily: 'NotoSans', fontWeight: '500', fontSize: 16 }}>Contact Us</Text>
                                </TouchableOpacity>
                            </Body>
                            <Right>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Contact_Us_U') }}>
                                    <RN_Icon name="right" size={30} color="#000000" />
                                </TouchableOpacity>
                            </Right>
                        </ListItem>
                    </List>
                </Content>
                <TouchableOpacity
                    onPress={() => { this.deleteAccount() }}
                    style={{
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        // position: "absolute",
                        elevation: 0,
                        marginBottom: 103,
                        marginRight: 27
                    }}
                >
                    <Text style={{ color: '#2570EC' }}>DELETE ACCOUNT</Text>
                </TouchableOpacity>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
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
})
export default profile_details;
