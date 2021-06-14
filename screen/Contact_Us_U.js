// A new Page added - 27-04-21
import React, { Component } from 'react'
import { Accordion, Container, Header, Title, Content, Footer, FooterTab, List, ListItem, Left, Right, Body, Icon, Text, View, Card, CardItem, Tab, Tabs, TabHeading, Thumbnail } from 'native-base';
import { BackHandler, Button, StyleSheet, Modal, SafeAreaView, Image, TextInput, TouchableOpacity, ToastAndroid, Alert, } from 'react-native';
import RN_Icon from 'react-native-vector-icons/AntDesign';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

export default class Contact_Us_U extends Component {
    render() {
        return (
            <Container>
                <Header style={styles.header_bg} androidStatusBarColor="grey">
                    <Left style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('profile_details') }}>
                            <RN_Icon name='arrowleft' size={30} color="#000" />
                        </TouchableOpacity>
                    </Left>
                    <Body style={styles.Header_Body}>
                        <Title style={styles.Header_Name}>Contact Us</Title>
                    </Body>
                    <Right style={{ flex: 1 }} />
                </Header>
                <View style={{ padding: 20, justifyContent: 'center', alignItems: 'center', width: widthPercentageToDP('100'), height: heightPercentageToDP('70') }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Roboto_medium', fontWeight: '700', fontSize: widthPercentageToDP('10%') }}>Mobile No </Text>
                        <Text style={{ color: '#2570EC', fontFamily: 'Roboto_medium', fontWeight: '300', fontSize: widthPercentageToDP('6%') }}>9922684648</Text>
                        {/* <Text style={{ color: '#2570EC', fontFamily: 'Roboto_medium', fontWeight: '300', fontSize: widthPercentageToDP('6%') }}>9762742960</Text> */}
                    </View>
                    <Text>{'\n\n'}</Text>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Roboto_medium', fontWeight: '700', fontSize: widthPercentageToDP('9%') }}>Visit Our Website </Text>
                        <Text style={{ color: '#2570EC', fontFamily: 'Roboto_medium', fontWeight: '300', fontSize: widthPercentageToDP('6%') }}>www.qmeet.in</Text>
                    </View>
                </View>
            </Container>
        )
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