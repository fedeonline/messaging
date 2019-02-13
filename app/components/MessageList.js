import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { MessageShape } from '../utils/MessageUtils';
import { MapView } from 'expo';

const keyExtractor = item => item.id.toString();

export default class MessageList extends Component {
    static propTypes = {
        messages: PropTypes.arrayOf(MessageShape).isRequired,
        onPressMessage: PropTypes.func,
    };

    static defaultProps = {
        onPressMessage: () => {},
    };

    renderMessageItem = ({ item }) => {
        const { onPressMessage } = this.props;

        return (
            <View key={item.id} style={styles.messageRow}>
                <TouchableOpacity onPress={() => onPressMessage(item)}>
                    {this.renderMessageBody(item)}
                </TouchableOpacity>
            </View>
        )
    };

    renderMessageBody  = ({ type, text, uri, coordinate }) => {
        //TODO: to be written
    };

    render() {
        const { messages } = this.props;

        return (
            <FlatList
                style={StyleSheet.container}
                inverteddata={messages}
                renderItem={this.renderMessageItem}
                keyExtractor={keyExtractor}
                keyboardShouldPersistTaps={'handled'}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'visible', // Prevents clipping on resize!
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 4,
        marginRight: 10,
        marginLeft: 60,
    },
    messageBubble: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: 'rgb(16,135,255)',
        borderRadius: 20,
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    map: {
        width: 250,
        height: 250,
        borderRadius: 10,
    },
})