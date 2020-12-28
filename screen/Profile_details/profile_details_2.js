import React, { Component } from 'react';
import { Accordion, Button, Container, Header, Title, Content, Footer, FooterTab, List, ListItem, Left, Right, Body, Icon, Text, View, Card, CardItem, Tab, Tabs, TabHeading, Thumbnail, Switch } from 'native-base';
import IconRV from 'react-native-vector-icons/Ionicons';
import { BackHandler, StyleSheet, Modal, SafeAreaView, Image, TextInput, TouchableOpacity, Alert, } from 'react-native';
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol } from 'react-native-responsive-screen';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';

class profile_details_2 extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ownerId: '',
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
        BackHandler.removeEventListener("hardwareBackPress", this.backAction);
    }
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.backAction);
        this.get_localData()
            .then(() => {
                console.log("------------", this.state.ownerId)
                // let id = this.state.ownerId
                // console.log(id,"id -----------------")
                const fs_data = firestore()
                    .collection('user')
                    .where('mobile_no', '==', this.state.ownerId)
                    .get()
                    .then((datasnap) => {
                        console.log(datasnap)
                        let data_array = []
                        datasnap.forEach(e => {
                            data_array.push(e.data())
                        })

                        firestore().collection('owner').doc(this.state.ownerId).get().then((snapShot) => {
                            console.log(snapShot.data().Availablity)
                            console.log("llllllllllllllllllll",snapShot.data().image_url)
                            this.setState({
                                myswitch: snapShot.data().Availablity,
                                owner_profile: snapShot.data().image_url
                            }, () => {
                                console.log('owner_profile',this.state.owner_profile)
                            })
                        })

                        console.log("data fetched from firebase", data_array)
                        this.setState({
                            user_data: data_array,
                            owner_name: data_array[0].name
                        }, () => console.log(this.state.user_data[0].name, "99999999", this.state.owner_name))
                    }, err => {
                        console.log("data fetching error", err)
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
    render() {
        const uri = "../../img/face1.jpg";
        // const owner_name = this.state.user_data[0].name
        return (
            <Container>
                <Header style={{ backgroundColor: 'white', height: hp('8%') }} androidStatusBarColor='grey' >
                    <Left>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Appointment_List')}
                        >
                            <Text style={{ fontSize: wp('6%') }}>  ←  </Text>
                        </TouchableOpacity>
                    </Left>
                    <Body style={{
                        // justifyContent: 'center',
                        // alignItems: 'center'
                    }}>
                        <Text
                            style={{
                                fontSize: wp('5%'),
                                color: '#2570EC',
                                fontWeight: '700',
                                fontFamily: 'Averia Serif Libre',
                            }}>
                            Profile Details
                            </Text>
                    </Body>
                </Header>
                <Content style={{ padding: 20 }}>
                    <List style={{ borderBottomWidth: 1, borderBottomColor: '#E4E4E4' }}>
                        <ListItem thumbnail>
                            <Left>
                                <Thumbnail source={this.state.owner_profile ? {uri : this.state.owner_profile } : require('../../img/five.jpg')} style={{ width: 52.03, height: 52.03, borderRadius: 52.03 }} />
                            </Left>
                            <Body>
                                <Text>{this.state.owner_name}</Text>
                                <Text note numberOfLines={1}>{this.state.ownerId}</Text>
                            </Body>
                            <Right>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('EditBuisness')} >
                                    <Text style={{ fontSize: 30 }}> 〉  </Text>
                                </TouchableOpacity>
                            </Right>
                        </ListItem>
                    </List>
                    {/* ----------------------------- Business Details ---------------------------------------------------------- */}
                    <List style={{ borderBottomWidth: 1, borderBottomColor: '#E4E4E4' }}>
                        <ListItem thumbnail>
                            <Body style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('EditBuisness')} style={{ flexDirection: 'row', justifyContent: 'space-between' }}> */}
                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontStyle: 'normal', fontFamily: 'NotoSans', fontWeight: '500', fontSize: 16 }}>Business Details</Text>
                                    <Text style={{ fontSize: wp('6%'), marginLeft: wp('25%') }}>  〉  </Text>
                                </TouchableOpacity>
                            </Body>
                        </ListItem>
                    </List>
                    {/* ----------------------------- Allow Online Booking ---------------------------------------------------------- */}
                    <List style={{ borderBottomWidth: 1, borderBottomColor: '#E4E4E4' }}>
                        <ListItem thumbnail>
                            <Body>
                                <Text style={{ fontStyle: 'normal', fontFamily: 'NotoSans', fontWeight: '500', fontSize: 16 }}>Allow Online Booking</Text>
                            </Body>
                            <Right>
                                <Button transparent>
                                    {/* <Switch onValueChange = {() => { this.handlerHere() }} value={this.state.switch} />{this.state.switch ? <Text>ON</Text> : <Text>OFF</Text>} */}
                                    <Switch onValueChange={() => { this.handlerHere1() }} value={this.state.myswitch} />{this.state.myswitch ? <Text>ON</Text> : <Text>OFF</Text>}
                                </Button>
                            </Right>
                        </ListItem>
                    </List>


                </Content>
                <TouchableOpacity
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
    }
})
export default profile_details_2;
