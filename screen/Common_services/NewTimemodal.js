import moment from 'moment';
import { Tabs, Tab, TabHeading, Body, Container } from 'native-base';
import React, { Component } from 'react'
import { Text, TouchableOpacity, Modal, StyleSheet, View, Dimensions } from 'react-native'
import DatePicker from 'react-native-date-picker';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

const Height = Dimensions.get('window').height;

export default class NewTimeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            startTime: '',
            time: ''
        }
    }
    render() {

        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.props.modal}
                    onRequestClose={() => { console.log("jkbsc") }}
                >
                    <View style={styles.background}>
                        <View style={styles.ModalContainer}>
                            <Container style={{ flex: 1, justifyContent: 'center', alignItems: 'center', color: 'black' }}>
                                <DatePicker
                                    date={this.state.date}
                                    mode="time"
                                    androidVariant="nativeAndroid"
                                    textColor="black"
                                    onDateChange={(date) => this.props.selctedTime(date, this.props.number)}
                                />
                                <Body style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <TouchableOpacity
                                        onPress={() => this.props.toggle(this.props.number)}
                                        style={{
                                            backgroundColor: 'rgba(37, 112, 236, 0.2)',
                                            borderRadius: 24,
                                            height: 50,
                                            width: widthPercentageToDP('40'),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <Text style={{ color: '#2570EC' }}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => this.props.toggle(this.props.number)}
                                        style={{
                                            marginLeft: widthPercentageToDP('4%'),
                                            backgroundColor: '#2570EC',
                                            borderRadius: 24,
                                            height: 50,
                                            width: widthPercentageToDP('40'),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <Text style={{ color: '#FFFFFF' }}>Done</Text>
                                    </TouchableOpacity>
                                </Body>
                            </Container>
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
    },
    ModalContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxHeight: Height * 0.6,
        paddingVertical: heightPercentageToDP('5'),
        justifyContent: 'center',
        alignItems: 'center'
    }
});