import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Fab,
} from 'native-base';
import FAB from 'react-native-fab'
import * as firebase from 'firebase';
import firebaseConfig from '../config'

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

class add_Customer extends React.Component {
  state = {
    active: false,
    customers: [],
  };

  componentDidMount() {
    console.log(" here we are")
    let dbRef2 = firebase.database().ref('Customer/')
    dbRef2.on('value', (Datasnap) => {
      const data = Datasnap.val();
      var DataList = []
      for (let index in data) {
        DataList.push({ index, ...data[index] })
      }
      console.log(DataList)
      this.setState({
        customers: DataList
      })
    });
  }

  render() {
    return (
      <View>
        <SafeAreaView>

          <FlatList
            data={this.state.customers}
            keyExtractor={({ item, index }) => index.toString()}
            renderItem={({ item, index }) => (
              // <TouchableOpacity
              //   key={index}
              //   onPress={(event) => this.removeIt(item.index)}>
              //   <View style={{ backgroundColor: 'white', borderBottomWidth: 1, marginBottom: 10, padding: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              //     <TouchableOpacity
              //       style={styles.circle}
              //     >
              //       <Text>{index}</Text>
              //     </TouchableOpacity>
              //     <Text>{item.Name}{'\n'}{item.Number}</Text>
              //     <Text>{item.time}</Text>
              //   </View>
              // </TouchableOpacity>
              <List>
                <ListItem thumbnail>
                  <Left>
                    <Thumbnail square source={{ uri: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fhuman&psig=AOvVaw1uCUDWB7V4MoHC5hY12_5D&ust=1602824555635000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKDOx_botewCFQAAAAAdAAAAABAD' }} />
                  </Left>
                  <Body>
                    <Text>{item.Name}</Text>
                    <Text note numberOfLines={1}>
                      Its time to build a difference . .
                    </Text>
                  </Body>
                  <Right>
                    <Button transparent>
                      <Text>View</Text>
                    </Button>
                  </Right>
                </ListItem>
              </List>
            )}
          />

          <FAB
            buttonColor="red"
            iconTextColor="#FFFFFF"
            onClickAction={() => { this.props.navigation.navigate('add_Customer') }}
            visible={true}
            iconTextComponent={<Text style={{ fontSize: 'bold', fontWeight: '400'}}>+</Text>}         
          />
        </SafeAreaView>
      </View>
    );
  }
}
export default add_Customer;
