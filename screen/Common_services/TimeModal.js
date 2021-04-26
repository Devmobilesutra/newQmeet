import moment from 'moment';
import { Tabs, Tab, TabHeading, Body, Container } from 'native-base';
import React, { Component } from 'react'
import { Text, TouchableOpacity, Modal, StyleSheet, View, Dimensions } from 'react-native'
import DatePicker from 'react-native-date-picker';
import { BottomSheet } from 'react-native-elements';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol, } from 'react-native-responsive-screen';

const Height = Dimensions.get('window').height;
export default class TimeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
        }
    }
    render() {
        console.log("state", this.props.BM1, this.props.BM2, this.props.AM1, this.props.AM2);
        // const { onTouchOutside } = this.props;
        // const { show } = this.state;
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.props.modal}
                    onRequestClose={() => { console.log("jkbsc") }}
                >
                    <View style={styles.background}>
                        {/* {console.log("clicked")} */}
                        <View style={styles.ModalContainer}>
                            <Tabs>
                                <Tab
                                    heading="Start Time"
                                    activeTabStyle={{ backgroundColor: '#FFFFFF' }}
                                    activeTextStyle={{ color: '#2570EC' }}
                                    tabStyle={{ backgroundColor: '#2570EC', elevation: 0 }}
                                >
                                    <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <DatePicker
                                            date={this.state.date}
                                            mode="time"
                                            isVisible={true}
                                            androidVariant="nativeAndroid"
                                            onDateChange={this.props.ST}
                                        />
                                        <Body style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                                            <TouchableOpacity
                                                onPress={() => this.props.toggle(this.props.number)}
                                                style={{
                                                    backgroundColor: 'rgba(37, 112, 236, 0.2)',
                                                    borderRadius: 24,
                                                    height: 50,
                                                    width: wp('40'),
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}>
                                                <Text style={{ color: '#2570EC' }}>Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => this.props.toggle(this.props.number)}
                                                style={{
                                                    marginLeft: wp('4%'),
                                                    backgroundColor: '#2570EC',
                                                    borderRadius: 24,
                                                    height: 50,
                                                    width: wp('40'),
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}>
                                                <Text style={{ color: '#FFFFFF' }}>Done</Text>
                                            </TouchableOpacity>
                                        </Body>
                                    </Container>
                                </Tab>
                                <Tab
                                    heading="End Time"
                                    activeTabStyle={{ backgroundColor: '#FFFFFF' }}
                                    activeTextStyle={{ color: '#2570EC' }}
                                    tabStyle={{ backgroundColor: '#2570EC', elevation: 0 }}
                                >
                                    <Container padder style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <DatePicker
                                            date={this.state.date}
                                            mode="time"
                                            isVisible={true}
                                            androidVariant="nativeAndroid"
                                            onDateChange={this.props.ET}
                                        />
                                        <Body style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                                            <TouchableOpacity
                                                onPress={() => this.props.toggle(this.props.number)}
                                                style={{
                                                    backgroundColor: 'rgba(37, 112, 236, 0.2)',
                                                    borderRadius: 24,
                                                    height: 50,
                                                    width: wp('40'),
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}>
                                                <Text style={{ color: '#2570EC' }}>Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => this.props.toggle(this.props.number)}
                                                style={{
                                                    marginLeft: wp('4%'),
                                                    backgroundColor: '#2570EC',
                                                    borderRadius: 24,
                                                    height: 50,
                                                    width: wp('40'),
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}>
                                                <Text style={{ color: '#FFFFFF' }}>Done</Text>
                                            </TouchableOpacity>
                                        </Body>
                                    </Container>
                                </Tab>
                            </Tabs>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#000000AA',
        justifyContent: 'flex-end',
        // zIndex: 999
    },
    ModalContainer: {
        flex: 1,
        // zIndex: 999,
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxHeight: Height * 0.6,
        // paddingHorizontal: 10,
        // borderTopLeftRadius: 10,
        // borderTopRightRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});