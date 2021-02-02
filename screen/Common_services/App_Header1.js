import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol } from 'react-native-responsive-screen';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';

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

const App_Header1 = (props) => {
    return (
        <Header style={styles.header_bg} androidStatusBarColor="grey">
            <Body style={styles.Header_Body}>
                <Text style={styles.Header_Name}>{props.Header_Name}</Text>
            </Body>
        </Header>
    );
}

export default App_Header1;