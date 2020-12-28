import React, { Component } from 'react';
import { BackHandler, StyleSheet, View, SafeAreaView, Image, TextInput, TouchableOpacity, Modal, Alert, PanResponder, ActivityIndicator } from 'react-native';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Icon, Fab, } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import moment from 'moment'
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import Axios from 'axios';
import DraggableFlatList from 'react-native-draggable-flatlist';

const styles = StyleSheet.create({

    //////////////////////////////modal style///////////////////////////////
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        flex: 1,
        justifyContent: 'flex-end',
    },
    container2: {
        backgroundColor: 'white',
        width: '100%',
        height: hp('60%'),
        padding: 25,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

class Appointment_List extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active: false,
            listArray: [],
            modalVisible: false,
            async_ownerNo: '',
            loader: '',
            customer_name: '',
            customer_number: '',
            dragIndex: 0,
            dropIndex: 0,
            oldList: [],
            direction: true,
        }
    }

    ownernumber = async () => {
        const own = await AsyncStorage.getItem('@owner_number'); // if user is owner 
        console.log("async owner number" + own)
        this.setState({
            async_ownerNo: own
        }, () => {
            firestore().collection('appointment').where('ownerId', '==', this.state.async_ownerNo).onSnapshot(data => {
                // Get  corresponding owners data from firestore
                console.log(data);
                let appointment_data = [];
                let timestamp;
                if (data) {
                    data.forEach((element) => {
                        console.log(element.data());
                        console.log(element.id);
                        delete element.data().timestamp; // temporarily delete ... some issue
                        appointment_data.push({
                            firebaseRef: element,
                            id: element.id,
                            ...element.data(),
                        });
                    });
                }
                this.setState(
                    {
                        listArray: _.sortBy(appointment_data, 'Appointment_No'),
                    },
                    () => {
                        console.log(this.state.listArray);
                    },
                );
            })
        })
    }
    backAction = () => {
        Alert.alert("Hold on!", "Are you sure you want to go back?", [
            {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
            },
            { text: "YES", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
    };
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backAction);
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        this.ownernumber()
    }
    updateRank = async (doc, rank) => {
        try {
            console.log(doc.firebaseRef);
            if (doc.firebaseRef && doc.firebaseRef.ref) {
                console.log(doc.firebaseRef.ref);
                return await doc.firebaseRef.ref.update({ Appointment_No: rank });
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    saveData = async () => {
        const { oldList, listArray, dragIndex, dropIndex } = this.state;
        try {
            const promises = listArray.map((ele, index) => {
                return this.updateRank(ele, index + 1);
            });
        } catch (error) {
            console.log(error);
        }
    };

    askSaveData = () => {
        const { oldList, listArray, dragIndex, dropIndex } = this.state;
        if (dragIndex === dropIndex) {
            this.setState({ listArray: oldList, oldList: [] });
            return;
        }
        const direction = dragIndex > dropIndex;
        const dDropI = direction ? dropIndex + 1 : dropIndex - 1;
        const dragItem = oldList[dragIndex];
        const dropItem = listArray[dDropI];

        // console.log('dDropI', dDropI);
        // console.log('dragItem', dragItem);
        // console.log('dropItem', dropItem);

        if (dragItem && dropItem) {
            Alert.alert(
                'Warning',
                `Do you want to move ${dragItem.user_name} ${direction ? 'before' : 'after'
                } ${dropItem.user_name} ?`,
                [
                    {
                        text: 'No',
                        onPress: () => {
                            this.setState({ listArray: oldList, oldList: [] });
                        },
                    },
                    {
                        text: 'Yes',
                        onPress: this.saveData,
                    },
                ],
                { cancelable: false },
            );
        }
        // Alert.prompt();
    };
    complete_appointmnet(Delete_id) {
        console.log('completed', Delete_id)
        this.setState({ loader: true })
        const deleteAppointment = functions().httpsCallable('deleteAppointment');
        deleteAppointment({
            id: Delete_id
        })
            .then(snapshot => {
                Alert.alert(
                    "",
                    "Appointment Deleted Succefully",
                    [
                        {
                            text: "OK", onPress: () => {
                                this.setState({ loader: false })
                            }
                        }
                    ],
                    { cancelable: false }
                );
            })
            .catch(err => {
                Alert.alert(
                    "Warning",
                    "Error Occured",
                    [
                        {
                            text: "OK", onPress: () => {
                                this.setState({ loader: false })
                            }
                        }
                    ],
                    { cancelable: false }
                );
            })
    }
    add_Appointment() {
        this.setState({ loader: true })
        console.log(" \n here we are to add customer")

        const addAppointment = functions().httpsCallable('offline_appointment');
        addAppointment({
            ownerId: this.state.async_ownerNo,
            user_number: this.state.customer_number,
            userName: this.state.customer_name,
            owner_token: this.state.owner_token,
        })
            .then(snap => {
                this.setState({
                    customer_name: '',
                    customer_number: '',
                    modalVisible: false,
                })
                console.log(snap)
                this.setState({ loader: false })
            })
            .catch(error => {
                Alert.alert('Problem occured while setting an Appointment :' + error)
                Alert.alert(
                    "",
                    "Problem occured while setting an Appointment, Check your internet :",
                    [
                        {
                            text: "OK", onPress: () => {
                                this.setState({ loader: false })
                            }
                        }
                    ],
                    { cancelable: false }
                );
            })
    }

    validate() {

        console.log(this.state.customer_number.length)
        let str = /^[0-9]+$/;
        let str1 = /^[a-zA-Z ]*$/;
        if (this.state.customer_number == '' || this.state.customer_name == '') {
            Alert.alert(
                "Please enter mobile number and name of customer"
            )
        } else if (this.state.customer_number.length != 10 || !str.test(this.state.customer_number)) {
            Alert.alert("please enter valid mobile Number")
        } else if (!str1.test(this.state.customer_name)) {
            Alert.alert("please enter valid Name of customer")
        }
        else {
            // if validations are true owner will be able to add appointments
            console.log('calling add appointment');
            try {
                const url = 'http://mobilesutra.com/Fintelekt-Dashboard/service/User/Send_sms';
                let formData = new FormData();
                // formData.append("contact_number", toString(this.state.mobileNo));
                // formData.append("sms_text", "playstore link to send to user");

                const config = {
                    //   headers: { 'content-type': 'multipart/form-data' }
                }

                console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh:", typeof (this.state.customer_number), this.state.mobileNo)
                let sms_data = {
                    "contact_number": this.state.customer_number,
                    "sms_text": "Testing in this mesage include playstore link to download app"
                }
                Axios.post(url, JSON.stringify(sms_data), config)
                    .then(response => {
                        console.log(response.data)
                    })
            } catch (err) {
                console.log(err)
            }
            this.add_Appointment()
        }
    }

    renderItemDrag = ({ item, index, drag, isActive }) => {
        console.log(isActive);
        return (
            <ListItem
                thumbnail
                onLongPress={drag}
                style={{ backgroundColor: isActive ? '#EEE8' : '#0000' }}>
                <Left>
                    <Text style={{ fontWeight: 'bold' }}>{item.Appointment_No}</Text>
                    {/* {console.log(item.Appointment_No)} */}
                    <Thumbnail
                        source={require('../img/face1.jpg')}
                    />
                </Left>
                <Body>
                    <Text>{item.user_name}</Text>
                    <Text note numberOfLines={1}>
                        {item.user_mobileNo}
                    </Text>
                </Body>
                <Right
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <Button transparent>
                        <Text style={{ fontSize: 12 }}>
                            {item.timestamp ? item.timestamp : null}
                        </Text>
                    </Button>
                    <Button bordered onPress={() => this.complete_appointmnet(item.id)}>
                        <Text>Done</Text>
                    </Button>
                </Right>
            </ListItem>
        );
    };
    render() {
        const { listArray } = this.state;
        return (
            <>
                <SafeAreaView style={{ width: '100%', height: '100%' }}>
                    <Modal transparent={true} visible={this.state.loader} >
                        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                            <ActivityIndicator color='#2570EC' size='large' style={{ alignSelf: 'center' }} />
                        </View>
                    </Modal>
                    {/* ------------------------- Header Bar ----------------------------------- */}
                    <Header style={{ backgroundColor: 'white', height: hp('8%') }} androidStatusBarColor='grey' >
                        <Left>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('profile_details_2')}
                            >
                                <Text style={{ fontSize: wp('6%') }}>  ☰  </Text>
                            </TouchableOpacity>
                        </Left>
                        <Body >
                            <Text
                                style={{
                                    marginLeft: wp('16%'),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: wp('6%'),
                                    color: '#EA4335',
                                    fontFamily: 'Averia Serif Libre',
                                }}>
                                Q
                                <Text
                                    style={{
                                        fontSize: wp('7%'),
                                        color: '#5F6368',
                                        fontFamily: 'Averia Serif Libre',
                                    }}>
                                    meet
                                </Text>
                            </Text>
                        </Body>
                        <Right />
                    </Header>
                    <DraggableFlatList
                        data={listArray}
                        renderItem={this.renderItemDrag}
                        onDragBegin={(e) => {
                            console.log('onDragBegin', e);
                            // this.setState({dragIndex: e});
                        }}
                        onRelease={(e) => {
                            console.log('onRelease', e);
                            // this.setState({dropIndex: e});
                        }}
                        keyExtractor={(item, index) =>
                            `draggable-item-${index}_${item.user_mobileNo}`
                        }
                        onDragEnd={({ data, from, to }) => {
                            console.log('onDragEnd data', data);
                            this.setState(
                                {
                                    listArray: data,
                                    dragIndex: from,
                                    dropIndex: to,
                                    oldList: listArray,
                                },
                                this.askSaveData,
                            );
                        }}
                    />
                    {/* ------------------------------------------ Fab Button ------------------------------------ */}
                    <TouchableOpacity
                        style={{ width: wp('20.9%'), height: hp('11.7%'), borderRadius: 50, alignSelf: 'flex-end', margin: wp('7%') }}
                        onPress={() => {
                            this.setState({
                                modalVisible: true
                            })
                        }}
                    >
                        <Image
                            style={{ width: wp('20.9%'), height: hp('11.7%'), borderRadius: 50 }}
                            source={require('../img/imageonline-co-overlayed-image.png')} />
                    </TouchableOpacity>
                    {/* ------------------------------- Modal To add appointment from owner Side ------------------------------------------ */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            // Alert.alert('Modal has been closed.');
                            this.setState({ modalVisible: false })
                        }}>
                        <View style={styles.overlay}>
                            <View style={styles.container2}>
                                <Text
                                    style={{ fontWeight: 'bold', marginTop: hp('4%') }}>
                                    Add customer’s details
                                </Text>
                                <TextInput
                                    placeholder="Customer Name"
                                    keyboardType="ascii-capable"
                                    fontSize={20}
                                    value={this.state.customer_name}
                                    onChangeText={(customer_name) => this.setState({ customer_name })}
                                    style={{
                                        color: '#5F6368',
                                        width: '100%',
                                        borderColor: '#2570EC',
                                        borderBottomWidth: 1,
                                    }}
                                />
                                <TextInput
                                    placeholder="Customer Phone Number"
                                    keyboardType="ascii-capable"
                                    fontSize={20}
                                    minLength={10}
                                    maxLength={10}
                                    keyboardType="numeric"
                                    value={this.state.customer_number}
                                    onChangeText={(customer_number) => this.setState({ customer_number })}
                                    style={{
                                        color: '#5F6368',
                                        width: '100%',
                                        borderColor: '#2570EC',
                                        borderBottomWidth: 1,
                                    }}
                                />
                                <Body style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                    alignItems: 'center',
                                    // marginTop: hp('3%'),
                                }}>
                                    <TouchableOpacity
                                        style={{
                                            borderWidth: 1,
                                            borderColor: '#2570EC',
                                            borderRadius: 24,
                                            height: 50,
                                            width: 150,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onPress={() => {
                                            this.setState({
                                                modalVisible: false
                                            })
                                        }}
                                    >
                                        <Text style={{ color: '#2570EC' }}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            marginLeft: wp('4%'),
                                            backgroundColor: this.state.customer_number.length == 10 && this.state.customer_name != '' ? '#2570EC' : '#808080',
                                            borderRadius: 24,
                                            height: 50,
                                            width: 150,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        disabled={this.state.customer_number.length == 10 && this.state.customer_name != '' ? false : true}
                                        onPress={() => { this.validate() }}
                                    >
                                        <Text style={{ color: '#FFFFFF' }}>Add Customer</Text>
                                    </TouchableOpacity>
                                </Body>

                            </View>
                        </View>
                    </Modal>
                </SafeAreaView>
            </>
        )
    }
}

export default Appointment_List;
