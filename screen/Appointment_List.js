import React, { Component } from 'react';
import { BackHandler, StyleSheet, View, SafeAreaView, ScrollView, Image, ImageBackground, TextInput, TouchableOpacity, Modal, Alert, PanResponder, ActivityIndicator } from 'react-native';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Icon, Fab, } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import moment from 'moment'
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import Axios from 'axios';
import DraggableFlatList from 'react-native-draggable-flatlist';
import RN_Icon from 'react-native-vector-icons/Ionicons';
import RN_Icon1 from 'react-native-vector-icons/AntDesign';
import ActionButton from 'react-native-action-button';

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
    header_bg: {
        backgroundColor: "#FFFFFF",
        elevation: 0,
    }
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
            EditFlag: false,
            Buisness_Name: ''
        }
    }

    ownernumber = async () => {
        const own = await AsyncStorage.getItem('@owner_number'); // if user is owner 
        console.log("async owner number" + own)
        this.setState({
            async_ownerNo: own
        }, () => {
            firestore().collection('owner').doc(this.state.async_ownerNo).onSnapshot(Buisness_Name => {
                console.log("cuisness name", Buisness_Name.exists, " ", Buisness_Name);
                if (Buisness_Name.exists) {
                    this.setState({ Buisness_Name: Buisness_Name.data().Buisness_name });
                }
            });

            firestore().collection('appointment').where('ownerId', '==', this.state.async_ownerNo)
                .onSnapshot(data => {
                    // Get  corresponding owners data from firestore
                    console.log(data);
                    let appointment_data = [];
                    let timestamp;
                    if (data) {
                        data.forEach((element) => {
                            console.log(element.data());
                            console.log(element.id);
                            //delete element.data().timestamp; // temporarily delete ... some issue
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
    async componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        this.ownernumber();
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
    async add_Appointment() {
        this.setState({ loader: true })
        console.log(" \n here we are to add customer", this.state.customer_name);
        const { EditFlag, customer_number } = this.state;
        console.log("edit flag", EditFlag)
        if (EditFlag) {
            this.EditAppointment();
            return;
        }

        const existingUser = await firestore().collection('user').where('mobile_no', '==', customer_number).get();
        if (existingUser.empty) {
            var userId = null;
            var user_token = null;
            var user_image = null;
        } else {
            existingUser.forEach(d => {
                console.log("data of usre", d)
                userId = d.id;
                user_token = d.data().user_token;
                user_image = d.data().imageurl;
            });
        }
        const online_appointment1 = functions().httpsCallable('online_appointment1');

        online_appointment1({
            appointment_mode: false,
            ownerId: this.state.async_ownerNo,
            userId: userId,
            user_number: this.state.customer_number,
            userName: this.state.customer_name,
            owner_token: null,
            user_token: user_token,
            user_image: user_image,
            appointment_mode: false
        }).then(data => {
            console.log(" indian time will be ", data)
            this.setState({ loader: false, customer_name: '', customer_number: '', modalVisible: false });
        }).catch(err => {
            console.error(" errrrrrrr", err);
            this.setState({ loader: false, customer_name: '', customer_number: '' });
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
            console.log('calling add appointment', this.state.customer_number);
            try {
                const url = 'http://mobilesutra.com/Fintelekt-Dashboard/service/User/Send_sms';
                let formData = new FormData();

                const config = {
                    //   headers: { 'content-type': 'multipart/form-data' }
                }

                console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh:", typeof (this.state.customer_number), this.state.customer_number)
                let sms_data = {
                    "contact_number": this.state.customer_number,
                    "sms_text": "Please download and install Qmeet app to get real time updates for your number in queue"
                }
                Axios.post(url, JSON.stringify(sms_data), config)
                    .then(response => {
                        console.log("mystatus", response.data)
                    });
            } catch (err) {
                console.log("API Message sending Error", err)
            }
            this.add_Appointment()
        }
    }

    deleteAlert(app_number) {
        Alert.alert(
            "",
            "do you want to remove this booking",
            [
                {
                    color: '#fff',
                    text: "Yes",
                    onPress: () => this.complete_appointmnet(app_number),
                    style: "cancel",
                },
                {
                    text: "No", onPress: () => { null }
                }
            ],
            { cancelable: false }
        );
    }
    Alert_removeAllAppointment() {
        Alert.alert(
            "",
            "Do you want to remove all appointments",
            [
                {
                    color: '#fff',
                    text: "Yes",
                    onPress: () => this.removeAllAppointment(),
                    style: "cancel",
                },
                {
                    text: "No", onPress: () => { null }
                }
            ],
            { cancelable: false }
        );
    }
    async removeAllAppointment() {
        console.table("list to delete appointments", this.state.listArray);
        const { listArray } = this.state;
        listArray.forEach(async (d) => {
            console.log("item id ", d.id);
            await firestore().collection('appointment').doc(d.id).delete()
                .then(data => { console.log('Data deleted') })
                .catch(err => { console.log(" Error ocuured while deleteing data", err) })
        })
    }
    edit_walkIn_Customer(Name, Number, Id) {
        console.log("edit_walkIn_Customer")
        this.setState({ customer_name: Name, customer_number: Number, EditFlag: true, modalVisible: true, edit_Id: Id });
    }
    async EditAppointment() {
        const { edit_Id, customer_name, customer_number } = this.state;
        await firestore().collection('appointment').doc(edit_Id).update({
            user_name: customer_name,
            user_mobileNo: customer_number
        }).then(data => { this.setState({ modalVisible: false, EditFlag: false, customer_name: '', customer_number: '', loader: false }) })
            .catch(error => { console.error(error); this.setState({ modalVisible: false, EditFlag: false, customer_name: '', customer_number: '', loader: false }) });
    }
    renderItemDrag = ({ item, index, drag, isActive }) => {
        console.log(isActive);
        return (
            <ScrollView>
                <ListItem
                    avatar
                    noBorder
                    onPress={() => { item.appointment_mode == false ? this.edit_walkIn_Customer(item.user_name, item.user_mobileNo, item.id) : null }}
                    onLongPress={drag}
                    style={{ backgroundColor: isActive ? '#EEE8' : '#0000', borderBottomWidth: 1, borderColor: '#E4E4E4' }}>
                    <Left style={{ justifyContent: 'space-around' }}>
                        <Text style={{
                            fontWeight: 'bold',
                            color: item.appointment_mode == false ? '#EA4335' : 'black'
                        }}>{item.Appointment_No}</Text>
                        <Thumbnail
                            source={item.user_image && item.user_image !== null && item.user_image !== "" ? { uri: item.user_image } : require('../img/face1.jpg')}
                        />
                    </Left>
                    <Body noBorder>
                        <Text numberOfLines={1}>{item.user_name}</Text>
                        <Text note numberOfLines={1}>
                            {item.user_mobileNo}
                        </Text>
                    </Body>
                    <Right
                        noBorder
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'space-evenly',
                            alignItems: 'flex-end',
                            overflow: 'hidden'
                        }}>
                        <Text style={{ color: '#6B6B6B', textAlign: 'right', fontFamily: 'Roboto_medium', fontSize: 13, fontStyle: 'normal', fontWeight: '400' }}>
                            {item.timestamp ? moment(new Date(item.timestamp.seconds * 1000 + item.timestamp.nanoseconds / 1000000)).format('hh:mm A') : null}
                        </Text>
                        <Button
                            style={{ backgroundColor: '#2570EC', borderRadius: 4, width: 83, height: 30, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => this.deleteAlert(item.id)}>
                            <Text style={{ fontFamily: 'Roboto_medium', fontWeight: '700', fontStyle: 'normal', fontSize: 13 }}>Done</Text>
                        </Button>
                    </Right>
                </ListItem>
            </ScrollView>
        );
    };
    render() {
        const { listArray, Buisness_Name } = this.state;
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
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('profile_details_2') }}>
                                <RN_Icon name="menu" size={30} color="#000000" />
                            </TouchableOpacity>
                        </Left>
                        <Body style={{ position: 'relative', marginLeft: wp('-30%'), justifyContent: 'center', alignItems: 'center' }}>
                            {/* <Image style={{ width: 79, height: 36 }} source={require('../Assets/Group_31.jpg')} /> */}
                            <View style={{ width: wp('70%') }}>
                                <Text numberOfLines={1} style={{ color: '#2570EC', fontSize: 16, fontFamily: 'NotoSans-Regular', fontWeight: '700', fontStyle: 'normal', textAlign: 'center' }}>{Buisness_Name}</Text>
                            </View>
                        </Body>
                    </Header>
                    <DraggableFlatList
                        style={{ backgroundColor: 'white', borderColor: '#E4E4E4', borderTopWidth: 1 }}
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
                        // activeOpacity={0.5}
                        style={{
                            opacity: 0.9,
                            position: 'absolute',
                            alignItems: 'center',
                            justifyContent: 'center',
                            right: 30, bottom: 30,
                            // width: 80,height: 80,
                            // borderRadius: 50,
                            backgroundColor: 'white',
                            // color: 'red'
                        }}
                        onPress={() => {
                            this.setState({
                                modalVisible: true
                            })
                        }}
                    >
                        <ImageBackground source={require('../Assets/Plus_btn.png')} style={{ width: 60, height: 60, borderRadius: 50, backgroundColor: '#FFFFFF' }}></ImageBackground>
                    </TouchableOpacity>

                    <TouchableOpacity
                        // activeOpacity={0.5}
                        style={{
                            opacity: 0.9,
                            position: 'absolute',
                            alignItems: 'center',
                            justifyContent: 'center',
                            left: 30, bottom: 30,
                            // width: 80,height: 80,
                            // borderRadius: 50,
                            backgroundColor: 'white',
                            // color: 'red'
                        }}
                        onPress={() => { this.Alert_removeAllAppointment() }}>
                        <ImageBackground source={require('../Assets/deleteAllIcon.png')} style={{ width: 60, height: 60, borderRadius: 50, backgroundColor: '#FFFFFF' }}></ImageBackground>
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
                        <Content contentContainerStyle={styles.overlay}>
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
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    // marginTop: hp('3%'),
                                }}>
                                    <TouchableOpacity
                                        style={{
                                            borderWidth: 1,
                                            borderColor: '#2570EC',
                                            borderRadius: 24,
                                            height: hp('7%'),
                                            width: wp('40%'),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onPress={() => {
                                            this.setState({
                                                modalVisible: false,
                                                customer_name: "",
                                                customer_number: ""
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
                                            height: hp('7%'),
                                            width: wp('40%'),
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
                        </Content>
                    </Modal>
                </SafeAreaView>
            </>
        )
    }
}

export default Appointment_List;
