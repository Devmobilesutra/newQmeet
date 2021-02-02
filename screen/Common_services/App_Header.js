import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol } from 'react-native-responsive-screen';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';

const styles = StyleSheet.create({
    header_bg: {
        backgroundColor: "#FFFFFF",
        elevation: 0,        
    }
})

const App_Header = (props) => {
    return (
        <Header style={styles.header_bg} androidStatusBarColor="grey">
            <Body style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'trnasparent', shadowOpacity: '0.1' }}>
                <Image style={{ width: 76.92, height: 25.44}} source={require('../../Assets/Group_31.jpg')} />
            </Body>
        </Header>
    );
}

export default App_Header;