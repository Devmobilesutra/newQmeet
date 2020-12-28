import React, { Component } from 'react';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body,Thumbnail, Icon} from 'native-base';
import {
    Alert,
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
  
class Owner_Shop_profile extends React.Component {

  render() {

    return (
      <Container>
        <Content>
        
        <View >
        <Text style={{position:'absolute',zIndex:1,color:'white',fontSize:wp('6.8%'),marginLeft:wp('40%'),marginTop:hp('26%'),fontWeight:'bold'}}>Hair saloon</Text>
        <Text style={{position:'absolute',zIndex:1,color:'#2570EC',fontSize:wp('5%'),marginLeft:wp('40%'),marginTop:hp('32%'),fontWeight:'bold'}}>Dr.Siddhesh</Text>
        <Text style={{position:'absolute',zIndex:2,color:'black',fontSize:wp('3.5%'),marginLeft:wp('40%'),marginTop:hp('36%'),fontWeight:'bold'}}>9623126675</Text>
         <Image style={{width:'100%',height:hp('32%')}} source={require('../img/b1.jpg')} />
        </View>
        <View style={{position:'absolute'}}>
        
        <Image
            source={require('../img/five.jpg')}
            style={{
                
                marginLeft:35,
              marginTop: hp('24%'),
              width: wp('28%'),
              height: hp('15%'),
              borderWidth:2,
              borderRadius: 100,
            }}/>
            
            
        </View>
        <View
            style={{
                justifyContent:'center',
                alignItems:'center',
              marginTop: hp('12%'),
              borderBottomWidth: 1,
              borderColor: '#D4D4D4',
              width:wp('90%'),
              marginLeft:wp('5%')
            }}
          />

        <View>
            <Text style={{fontWeight:'bold',fontSize:wp('4%'),marginLeft:wp('5%'),marginTop:hp('3%')}}>
                Enter your name
            </Text>
          <TextInput
            keyboardType="ascii-capable"
            fontSize={35}
            style={{
              marginTop:hp('1%'),
              margin: hp('2%'),
              color: '#5F6368',
              borderColor: 'blue',
              borderBottomWidth: 1,
            }}></TextInput>
        </View>

        <View style={{justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity
             onPress={() => this.props.navigation.navigate('BLogin1')}
            style={{
              backgroundColor: '#2570EC',
              width: wp('90%'),
              height: hp('7.5%'),
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: hp('15%'),
            }}>
            <Text style={{color: 'white', fontSize: wp('4%'),}}>Confirm</Text>
          </TouchableOpacity>

        </View>
        </Content>
        
        </Container>
      );
    }
  }
  export default Owner_Shop_profile;