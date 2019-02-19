import { BackHandler, LayoutAnimation, Platform, UIManager, View } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export const INPUT_METHOD = {
    NONE: 'NONE',
    KEYBOARD: 'KEYBOARD',
    CUSTOM: 'CUSTOM',
};

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default class MessagingContainer extends Component {
    static propTypes = {
        // From KeyboardState
        containerHeight: PropTypes.number.isRequired,
        contentHeight: PropTypes.number.isRequired,
        keyboardHeight: PropTypes.number.isRequired,
        keyboardVisible: PropTypes.bool.isRequired,
        keyboardWillShow: PropTypes.bool.isRequired, 
        keyboardWillHide: PropTypes.bool.isRequired,
        keyboardAnimationDuration: PropTypes.number.isRequired,

        // Managing the IME
        inputMethod: PropTypes.oneOf(Object.values(INPUT_METHOD)).isRequired,
        onChangeInputMethod: PropTypes.func,

        // Rendering content
        children: PropTypes.node,
        renderInputMethodEditor: PropTypes.func.isRequired,
    };

    static defaultProps = {
        children: null,
        onChangeInputMethod: () => {},
    };

    componentDidMount() {
        this.subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                const { onChangeInputMethod, inputMethod } = this.props;

                if (inputMethod === INPUT_METHOD.CUSTOM) {
                    onChangeInputMethod(INPUT_METHOD.NONE);
                    return true;
                }

                return false;
            },
        );
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    componentWillReceiveProps(nextProps) {
        const { onChangeInputMethod } = this.props;
        const { keyboardAnimationDuration } = nextProps;

        if (!this.props.keyboardVisible && nextProps.keyboardVisible) {
            // Keybord shown
            onChangeInputMethod(INPUT_METHOD.KEYBOARD);
        } else if (
            // Keyboard hidden
            this.props.keyboardVisible &&
            !nextProps.keyboardVisible &&
            this.props.inputMethod !== INPUT_METHOD.CUSTOM
        ) {
            onChangeInputMethod(INPUT_METHOD.NONE);
        }

        const animation = LayoutAnimation.create(
            keyboardAnimationDuration,
            Platform.OS === 'android' ? LayoutAnimation.Types.easeInEaseOut : LayoutAnimation.Types.keyboard,
            LayoutAnimation.Properties.opacity,
        );
        LayoutAnimation.configureNext(animation);
    }

    render() {
        const {
            containerHeight,
            contentHeight,
            keyboardHeight,
            keyboardWillShow,
            keyboardWillHide,
            inputMethod,
            children,
            renderInputMethodEditor,
        } = this.props;

        const useContentHeight = keyboardWillShow || inputMethod === INPUT_METHOD.KEYBOARD;
        const showCustomInput = inputMethod === INPUT_METHOD.CUSTOM && !keyboardWillShow;
        const keyboardIsHidden = inputMethod === INPUT_METHOD.NONE && !keyboardWillShow;
        const keyboardIsHiding = inputMethod === INPUT_METHOD.KEYBOARD && keyboardWillHide;

        const containerStyle = {
            height: useContentHeight ? contentHeight : containerHeight,
        };
        
        const inputStyle = {
            height: showCustomInput ? keyboardHeight || 250 : 0,
            marginTop: isIphoneX() && (keyboardIsHidden || keyboardIsHiding) ? 24 : 0,
        };
        
        return (
            <View style={containerStyle}>
                {children}
                <View style={inputStyle}>
                    {renderInputMethodEditor()}
                </View>
            </View>
        )
    }
}