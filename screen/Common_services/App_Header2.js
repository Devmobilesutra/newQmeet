import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol } from 'react-native-responsive-screen';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text } from 'native-base';
import RN_Icon from 'react-native-vector-icons/AntDesign';

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
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '700'
    }
})

const App_Header2 = (props) => {
    return (
        <Header style={styles.header_bg} androidStatusBarColor="grey">
            <Left style={{ flex: 1 }}>
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Book_Appointment')}}>
                    <RN_Icon name='arrowleft' size={30} color="#000" />
                </TouchableOpacity>
            </Left>
            <Body style={styles.Header_Body}>
                <Title style={styles.Header_Name}>Profile details</Title>
            </Body>
            <Right style={{ flex: 1 }} />
        </Header>
    );
}

export default App_Header2;