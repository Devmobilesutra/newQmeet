import React, { Component } from 'react';
import { Accordion, Container, Header, Title, Content, Footer, FooterTab, List, ListItem, Left, Right, Body, Icon, Text, View, Card, CardItem, Tab, Tabs, TabHeading, Thumbnail } from 'native-base';
import IconRV from 'react-native-vector-icons/Ionicons';
import { BackHandler, Button, StyleSheet, Modal, SafeAreaView, Image, TextInput, TouchableOpacity, Alert, } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as lor,
    removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';

class profile_details extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ownerId: '',
            user_name: '',
            user_data: '',
            switch: false
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
        this.props.navigation.navigate('Book_Appointment')
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
                        // console.log(datasnap)
                        let data_array = []
                        datasnap.forEach(e => {
                            data_array.push(e.data())
                        })

                        console.log("data fetched from firebase", data_array)
                        this.setState({
                            user_data: data_array,
                            user_name: data_array[0].name,
                            mobile_no: data_array[0].mobile_no,
                            user_profile: data_array[0].imageurl
                        }, () => console.log(this.state.user_data[0].name, "99999999", this.state.user_name))
                    }, err => {
                        console.log("data fetching error", err)
                    })
            })
    }
    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: 'white', height: hp('8%') }} androidStatusBarColor='grey' >
                    <Left>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Book_Appointment')}
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
                        <TouchableOpacity>
                            <ListItem thumbnail>
                                <Left>
                                    <Thumbnail source={this.state.user_profile || require('../../img/five.jpg')} style={{ width: 52.03, height: 52.03, borderRadius: 52.03 }} />
                                </Left>
                                <Body>
                                    <Text>{this.state.user_name}</Text>
                                    <Text note numberOfLines={1}>{this.state.mobile_no}</Text>
                                </Body>
                                <Right>
                                    <Text style={{ fontSize: 30 }}> 〉 </Text>
                                </Right>
                            </ListItem>
                        </TouchableOpacity>
                    </List>
                    {/* ----------------------------- Book Appointment ---------------------------------------------------------- */}
                    <List style={{ borderBottomWidth: 1, borderBottomColor: '#E4E4E4' }}>
                        <ListItem thumbnail>
                            <Body>
                                <TouchableOpacity
                                    onPress={() => { this.props.navigation.navigate('qrcode_scanner') }}
                                >
                                    <Text style={{ fontStyle: 'normal', fontFamily: 'NotoSans', fontWeight: '500', fontSize: 16 }}>Book appointment</Text>
                                </TouchableOpacity>
                            </Body>
                        </ListItem>
                    </List>
                    {/* ----------------------------- Business sign-up ---------------------------------------------------------- */}
                    <List style={{ borderBottomWidth: 1, borderBottomColor: '#E4E4E4' }}>
                        <ListItem thumbnail>
                            <Body style={{ flexDirection: 'row' }}>
                                {/* <Text style={{ fontStyle: 'normal', fontFamily: 'NotoSans', fontWeight: '500', fontSize: 13 }}>Business sign-up</Text> */}
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('EditUser')}>
                                    <Text style={{ fontStyle: 'normal', fontFamily: 'NotoSans', fontWeight: '500', fontSize: 16 }}>Business sign-up</Text>
                                </TouchableOpacity>
                            </Body>
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
export default profile_details;
