import React, { Component } from 'react';
import { Container, Header, Title, Content, Left, Right, Body, Icon } from 'native-base';
import { Alert, StyleSheet, View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, BackHandler } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';

class Book_Appointment extends React.Component {

  state = {
    type: ''
  }
  backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to Exit?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => BackHandler.exitApp() }
    ]);
    return true;
  };

  async componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backAction);
    const user_type = await AsyncStorage.getItem('@user_type');
    this.setState({
      type: user_type
    })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backAction);
  }
  
  render() {

    const { type } = this.state
    return (
      <Container>
        <Header style={{backgroundColor:'white',height:hp('8%')}} androidStatusBarColor='grey' >
          <Left> 
          <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('profile_details')                  
                }}
              >
                <Text  style={{ fontSize:wp('6%')}}>  ☰  </Text>
              </TouchableOpacity>
          </Left>
          <Body >
          <Text
            style={{
              marginLeft:wp('16%'),
             alignItems:'center',
             justifyContent:'center',

              fontSize:wp('6%'),
              color: '#EA4335',
              fontFamily: 'Averia Serif Libre',
            }}>
            Q
            <Text
              style={{                
                fontSize:wp('7%'),
                color: '#5F6368',
                fontFamily: 'Averia Serif Libre',
              }}>
              meet
            </Text>
          </Text>
          </Body>
          <Right />
        </Header>
        <Content>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Image style={{width:'100%',height:hp('32%')}} source={require('../img/ten.png')} />
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center',marginTop:hp('3%')}}>
        <Text
            style={{
              fontSize:wp('5%'),
              fontWeight:'bold',
              color: '#2570EC',
            }}>Avoid staying in long queue
            
          </Text>

        </View>
        <View style={{alignItems: 'center', justifyContent: 'center',marginTop:hp('4%')}}>
        <Text
            style={{
              fontSize:wp('4%'),
              color: '#343434',
            }}>Book an appointment from anywhere and 
            
            
          </Text>

        </View>
        <View style={{alignItems: 'center', justifyContent: 'center',marginTop:hp('0.5%')}}>
        <Text
            style={{
              fontSize:wp('4%'),
            //   fontWeight:'bold',
              color: '#343434',
            }}>  
            check real time updates of             
          </Text>

        </View>
        <View style={{alignItems: 'center', justifyContent: 'center',marginTop:hp('0.5%')}}>
        <Text
            style={{
              fontSize:wp('4%'),
            //   fontWeight:'bold',
              color: '#343434',
            }}>your appointment
            
            
          </Text>

        </View>
        <View style={{justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('qrcode_scanner')}
            style={{
              backgroundColor: '#2570EC',
              width: wp('90%'),
              height: hp('7.5%'),
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: hp('13%'),
            }}>
            <Text style={{color: 'white', fontSize: wp('4%'),}}>Book appointment</Text>
          </TouchableOpacity>

          {type == '1' ? <TouchableOpacity
          onPress={() => this.props.navigation.navigate('BLogin1')}
          style={{alignItems: 'center', justifyContent: 'center',marginTop:hp('6%'),}}>
            <Text style={{ fontSize:wp('3.5%'), color: '#343434'}}> Provide best services to your customers? </Text>
            <Text style={{ fontSize:wp('3.5%'), color: 'red' }}> Sign-up your business with us </Text>
          </TouchableOpacity> : null}
        </View>
        </Content>
        
      </Container>
    );
  }
}
export default Book_Appointment;