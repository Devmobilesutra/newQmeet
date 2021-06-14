import React, { Component } from 'react';
import { Accordion, Button, Badge, Container, Header, Title, Content, Footer, FooterTab, List, ListItem, Left, Right, Body, Icon, Text, View, Card, CardItem, Tab, Tabs, TabHeading, Thumbnail, Switch } from 'native-base';
import IconRV from 'react-native-vector-icons/Ionicons';
import { BackHandler, StyleSheet, Modal, SafeAreaView, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import moment from 'moment';
import RN_Icon from 'react-native-vector-icons/AntDesign';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol } from 'react-native-responsive-screen';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';

class profile_details_2 extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ownerId: '',
            userId: '',
            owner_name: '',
            user_data: '',
            switch: false,
            owner_profile: ''
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
        this.props.navigation.navigate('Appointment_List')
        return true;
    };
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backAction)
    }
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.backAction);
        // this.props
        this.get_localData()
            .then(() => {
                console.log("------------", this.state.ownerId)
                // let id = this.state.ownerId
                // console.log(id,"id -----------------")
                firestore().collection('owner').doc(this.state.ownerId).onSnapshot((snapShot) => {
                    // console.log(snapShot.data().Availablity)
                    // console.log("llllllllllllllllllll", snapShot.data().image_url)
                    console.log("exist ", snapShot.exists, typeof (snapShot.exists))
                    if (snapShot.exists) {
                        const fs_data = firestore()
                            .collection('user')
                            .where('mobile_no', '==', this.state.ownerId)
                            .onSnapshot((datasnap) => {
                                console.log(datasnap)
                                if (!datasnap.empty) {
                                    datasnap.forEach(e => {
                                        this.setState({
                                            user_data: e.data(),
                                            owner_name: e.data().name,
                                            owner_profile: e.data().imageurl,
                                            userId: e.id,

                                        })
                                    })
                                }

                            }, err => {
                                console.log("data fetching error", err)
                                Alert.alert('Please check internet connection or try again later')
                            })
                        console.log(snapShot.data().Availablity);
                        this.setState({ myswitch: snapShot.data().Availablity }) // checking availability of business from owner table
                    }
                })
            })
    }

    handlerHere1() {
        // console.log()
        this.setState({
            myswitch: !this.state.myswitch
        }, () => {
            console.log(this.state.myswitch)
            firestore().collection('owner').doc(this.state.ownerId).update({
                Availablity: this.state.myswitch
            }).then(snapShot => {
                console.log('swich change')
            }).
                catch(err => {
                    Alert.alert('not able to change switch currently')
                })
        })
    }
    async deleteAccount() {
        // deleting user from system
        console.log("deleting user", this.state.ownerId)

        this.setState({ isLoader: true })
        const user = await firestore().collection('appointment').where('ownerId', '==', this.state.ownerId).get()
        console.log(user.empty)
        if (!user.empty) {
            user.forEach(async (data) => {
                console.log(data.id)
                await firestore().collection('appointment').doc(data.id).delete().then(
                    datasnap => {
                        console.log("data deleted from appointment table", datasnap);
                    })
            })
            await firestore().doc(`user/${this.state.userId}`).delete().then(
                datasnap => {
                    console.log("data deleted from user table", datasnap);
                })
            await firestore().doc(`owner/${this.state.ownerId}`).delete().then(
                datasnap => {
                    console.log("data deleted from owner table ", datasnap);
                })
            await firestore().doc(`appointment-count/${this.state.ownerId}`).delete().then(
                datasnap => {
                    console.log("data deleted from appointment count table", datasnap);
                    this.props.navigation.navigate("Welcome");
                })
            const type = await AsyncStorage.clear()
        } else {
            await firestore().doc(`user/${this.state.userId}`).delete().then(
                datasnap => {
                    console.log("data deleted from user table", datasnap);
                    this.props.navigation.navigate("Welcome");
                })
            await firestore().doc(`owner/${this.state.ownerId}`).delete().then(
                datasnap => {
                    console.log("data deleted from owner table ", datasnap);
                })
            await firestore().doc(`appointment-count/${this.state.ownerId}`).delete().then(
                async (datasnap) => {
                    console.log("data deleted from appointment count table", datasnap);
                    this.props.navigation.navigate("Welcome");
                })
            const type = await AsyncStorage.clear();
        }

    }
    deleteAccount1() {
        Alert.alert("Hold On!", "Do you really want to delete your account?",
            [
                {
                    text: "No",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "YES", onPress: () => this.deleteAccount() }
            ]);
    }
    render() {
        const uri = "../../img/face1.jpg";
        // const owner_name = this.state.user_data[0].name
        return (
            <Container>
                <Header style={styles.header_bg} androidStatusBarColor="grey">

                    <Left style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Appointment_List') }}>
                            <RN_Icon name='arrowleft' size={30} color="#000" />
                        </TouchableOpacity>
                    </Left>
                    <Body style={styles.Header_Body}>
                        <Title style={styles.Header_Name}>Profile details</Title>
                    </Body>
                    <Right style={{ flex: 1 }} />
                </Header >
                <Content style={{ padding: 20 }}>
                    <List>
                        <TouchableOpacity >
                            <ListItem thumbnail onPress={() => { this.props.navigation.navigate('EditUser', { navigation_page: 2 }) }} style={{ borderBottomWidth: 1, borderBottomColor: '#E4E4E4' }}>
                                <Left>
                                    <Thumbnail source={this.state.owner_profile ? { uri: this.state.owner_profile } : require('../../img/five.jpg')} style={{ width: 52.03, height: 52.03, borderRadius: 52.03 }} />
                                </Left>
                                <Body>
                                    <Text numberOfLines={1}>{this.state.owner_name}</Text>
                                    <Text note numberOfLines={1}>{this.state.ownerId}</Text>
                                </Body>
                                <Right>
                                    <RN_Icon name="right" size={30} color="#000000" />
                                </Right>
                            </ListItem>
                        </TouchableOpacity>
                    </List>
                    {/* ----------------------------- Business Details ---------------------------------------------------------- */}
                    <List>
                        <ListItem>
                            <Body>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('EditBuisness') }}>
                                    <Text style={{ fontStyle: 'normal', fontFamily: 'NotoSans', fontWeight: '500', fontSize: 16 }}>Business Details</Text>
                                </TouchableOpacity>
                            </Body>
                            <Right>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('EditBuisness') }}>
                                    <RN_Icon name="right" size={30} color="#000000" />
                                </TouchableOpacity>
                            </Right>
                        </ListItem>
                    </List>
                    {/* ----------------------------- Contact Us Page ---------------------------------------------------------- */}
                    <List>
                        <ListItem>
                            <Body>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Contact_Us') }}>
                                    <Text style={{ fontStyle: 'normal', fontFamily: 'NotoSans', fontWeight: '500', fontSize: 16 }}>Contact Us</Text>
                                </TouchableOpacity>
                            </Body>
                            <Right>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Contact_Us') }}>
                                    <RN_Icon name="right" size={30} color="#000000" />
                                </TouchableOpacity>
                            </Right>
                        </ListItem>
                    </List>
                    {/* ----------------------------- Allow Online Booking ---------------------------------------------------------- */}
                    <List>
                        <ListItem>
                            <Body>
                                <Text style={{ fontStyle: 'normal', fontFamily: 'NotoSans', fontWeight: '500', fontSize: 16 }}>Allow Online Booking</Text>
                            </Body>
                            <Right>
                                <Button transparent>
                                    <Switch onValueChange={() => { this.handlerHere1() }} value={this.state.myswitch} />
                                    {this.state.myswitch ?
                                        <Badge style={{ backgroundColor: '#199039' }}>
                                            <Text style={{ color: 'white' }}>ON</Text>
                                        </Badge> :
                                        <Badge style={{ backgroundColor: '#EA4335' }}>
                                            <Text style={{ color: 'white' }}>OFF</Text>
                                        </Badge>}
                                </Button>
                            </Right>
                        </ListItem>
                    </List>
                </Content>
                <TouchableOpacity
                    onPress={() => { this.deleteAccount1() }}
                    style={{
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        elevation: 0,
                        marginBottom: 103,
                        marginRight: 27
                    }}
                >
                    <Text style={{ color: '#2570EC' }}>DELETE ACCOUNT</Text>
                </TouchableOpacity>
            </Container >
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
export default profile_details_2;
