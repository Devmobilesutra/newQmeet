import React, { Component } from 'react';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon } from 'native-base';
import {

  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';

class Appointment_Details_2 extends React.Component {

  render() {

    return (
      <Container>
        <Header style={{ backgroundColor: 'white', height: hp('8%') }} androidStatusBarColor='grey' >
          <Left>
            <TouchableOpacity>
              <Text style={{ fontSize: wp('7%') }} > ☰</Text>
            </TouchableOpacity>
          </Left>
          <Body >
            <Text
              style={{
                marginLeft: wp('12%'),
                alignItems: 'center',
                justifyContent: 'center',

                fontSize: wp('7%'),
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

        </Header>
        <Content>
          <View >
            <Text style={{ position: 'absolute', zIndex: 1, color: 'white', fontSize: wp('6.8%'), marginLeft: wp('40%'), marginTop: hp('26%'), fontWeight: 'bold' }}>Hair saloon</Text>
            <Text style={{ position: 'absolute', zIndex: 1, color: '#2570EC', fontSize: wp('5%'), marginLeft: wp('40%'), marginTop: hp('32%'), fontWeight: 'bold' }}>Dr.Siddhesh</Text>
            <Text style={{ position: 'absolute', zIndex: 2, color: 'black', fontSize: wp('3.5%'), marginLeft: wp('40%'), marginTop: hp('36%'), fontWeight: 'bold' }}>9623126675</Text>
            <Image style={{ width: '100%', height: hp('32%') }} source={require('../img/b1.jpg')} />
          </View>
          <View style={{ position: 'absolute' }}>

            <Image
              source={require('../img/five.jpg')}
              style={{

                marginLeft: 35,
                marginTop: hp('24%'),
                width: wp('28%'),
                height: hp('15%'),
                borderWidth: 2,
                borderRadius: 100,
              }} />


          </View>
          <View style={{

            alignItems: 'center',
            justifyContent: 'center',
          }}>

            <View style={styles.RectangleShape}>
              {/* <View
                 style={{marginLeft:wp('20%'),zIndex:33, justifyContent:'center',alignItems:'center',height:wp('%'), borderLeftWidth: 1,  borderRightColor: 'black',}}/> */}
              <View>


                <View style={{
                  flexDirection: 'row',
                  marginTop: hp('1.5%'),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <View>
                    <Text style={{ fontSize: wp('3.5%'), fontWeight: 'bold' }}>Your number</Text>
                  </View>
                  <View>
                    <Text style={{ marginLeft: wp('25%'), fontSize: wp('3.5%'), fontWeight: 'bold' }}>Current number</Text>
                  </View>

                </View>
                <View style={{
                  flexDirection: 'row',
                  // marginTop:hp('1%'),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <View>
                    <Text style={{ fontSize: wp('13%'), color: '#2570EC', marginRight: wp('38%'), }}>14</Text>
                  </View>

                  <Text style={{ fontSize: wp('13%'), color: '#2570EC' }}>05</Text>
                </View>

              </View>

            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp('3%') }}>
              <Text style={{ fontSize: wp('5.8%'), color: 'red' }}>Host will be available in 15 min.</Text>
            </View>

          </View>
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#2570EC',
                width: wp('88%'),
                height: hp('7.5%'),
                borderRadius: 50,

                marginTop: hp('5%'),
              }}
              onPress={() => {
                this.props.navigation.navigate('CTicket');
              }}>
              <Text style={{ color: 'white', fontSize: wp('4%') }}>Book next appointment</Text>
            </TouchableOpacity>
          </View>
        </Content>
      </Container>
    );
  }
}
export default Appointment_Details_2;

const styles = StyleSheet.create({
  RectangleShape: {
    marginTop: hp('14%'),
    width: wp('90 * 2%'),
    height: hp('14%'),
    borderRadius: 15,
    borderWidth: 1,
    backgroundColor: '#F2F2F2'

  }

});