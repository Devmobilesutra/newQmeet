import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor, removeOrientationListener as rol } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    textInput: {
        borderColor: '#2570EC',
        borderBottomWidth: 1,
    },
    input: {
        
    }
});
const TextInput1 = (props) => {
    return (
        <View style={styles.textInput}>
            <TextInput
                placeholder={props.placeholder}
                value={props.number}
                keyboardType="phone-pad"
                minLength={10}
                maxLength={10}
                fontSize={30}
                onChangeText={props.onChangeText}
                style={styles.input} />
        </View>
    );
}

export default TextInput1;