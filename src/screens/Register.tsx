import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState, useRef, createRef} from 'react';
import {NavigationComponentProps} from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import MyTextInput from '@components/MyTextInput';
import {Utils} from '@Utils';
import {appStyles, color, fontFamily, fontSize} from '@styles';
import CustomButton from '@components/CustomButton';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';
import PopUpStates from '@components/PopUpState';
import {KeyboardAwareView} from 'react-native-keyboard-aware-view';
import {Formik} from 'formik';
import {initRegister} from 'utils/validations';

export interface Props extends NavigationComponentProps {
  propsData: any;
}

const Register: React.FC<Props> = props => {
  const {propsData} = props;
  const names = propsData?.name?.split(' ');
  const defaultFname: string =
    names?.length > 0 ? (names[0] !== 'null' ? names[0] : '') : '';
  const defaultLname: string =
    names?.length > 0 ? (names[1] !== 'null' ? names[1] : '') : '';
  const [visible, setVisible] = useState(false);
  // const reflastName = useRef<TextInput | null>(null);
  const reffirstName: any = createRef();
  const reflastName: any = createRef();
  const refstreet: any = createRef();
  const refstreetName: any = createRef();
  const refcity: any = createRef();
  const refstate: any = createRef();
  const refzip: any = createRef();

  const isValidate = (data: any) => {
    if (data.firstname === '') {
      Navigator.showAlert('Please enter first name');
      reffirstName.current?.focus();
      return false;
    } else if (data.lastname === '') {
      Navigator.showAlert('Please enter last name');
      reflastName.current?.focus();
      return false;
    } else if (data.street === '') {
      Navigator.showAlert('Please enter street');
      refstreet.current?.focus();
      return false;
    } else if (data.streetname === '') {
      Navigator.showAlert('Please enter street name');
      refstreetName.current?.focus();
    } else if (data.city === '') {
      Navigator.showAlert('Please enter city');
      refcity.current?.focus();
      return false;
    } else if (data.state === '') {
      Navigator.showAlert('Please enter state');
      refstate.current?.focus();
      return false;
    } else if (data.zip === '') {
      Navigator.showAlert('Please enter zip');
      refzip.current?.focus();
      return false;
    } else {
      return true;
    }
  };

  const onNext = (data: any) => {
    const sendData = {
      ...data,
      email: propsData?.toRegisterEmail,
      token: propsData?.token,
      isGoogle: propsData?.isGoogle,
      isApple: propsData?.isApple,
    };
    Navigator.setPush(props.componentId, screenName.RegisterSubmit, sendData);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        firstname: defaultFname,
        lastname: defaultLname,
        street: '',
        streetname: '',
        city: '',
        state: '',
        zip: '',
      }}
      validationSchema={initRegister}
      onSubmit={values => onNext(values)}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
      }) => (
        <View style={{flex: 1}}>
          <KeyboardAwareView animated={true}>
            <MySafeArea componentId={props.componentId} isScroll={true}>
              <TouchableWithoutFeedback
                onPress={() => {
                  // isValidate(values);
                  Keyboard.dismiss();
                }}>
                <View>
                  <Text style={styles.tvRegister}>Registration</Text>
                  <MyTextInput
                    value={''}
                    placeholder="First Name"
                    marginTop={Utils.calculateHeight(18)}
                    children={
                      <>
                        <TextInput
                          onBlur={handleBlur('firstname')}
                          value={values.firstname}
                          onChangeText={handleChange('firstname')}
                          style={appStyles.inputContainer}
                          ref={reffirstName}
                          returnKeyType="next"
                          onSubmitEditing={() => reflastName.current?.focus()}
                          blurOnSubmit={false}
                        />
                        {touched.firstname && errors.firstname && (
                          <Text style={{color: 'red'}}>{errors.firstname}</Text>
                        )}
                      </>
                    }
                  />
                  <MyTextInput
                    value={''}
                    placeholder="Last Name"
                    marginTop={Utils.calculateHeight(8)}
                    children={
                      <>
                        <TextInput
                          onBlur={handleBlur('lastname')}
                          value={values.lastname}
                          onChangeText={handleChange('lastname')}
                          style={appStyles.inputContainer}
                          ref={reflastName}
                          returnKeyType="next"
                          onSubmitEditing={() => refstreet.current?.focus()}
                          blurOnSubmit={false}
                        />
                        {touched.lastname && errors.lastname && (
                          <Text style={{color: 'red'}}>{errors.lastname}</Text>
                        )}
                      </>
                    }
                  />
                  <MyTextInput
                    value={''}
                    placeholder="Street"
                    marginTop={Utils.calculateHeight(8)}
                    children={
                      <>
                        <TextInput
                          onBlur={handleBlur('street')}
                          value={values.street}
                          onChangeText={handleChange('street')}
                          style={appStyles.inputContainer}
                          ref={refstreet}
                          returnKeyType="next"
                          onSubmitEditing={() => refstreetName.current?.focus()}
                          blurOnSubmit={false}
                        />
                        {touched.street && errors.street && (
                          <Text style={{color: 'red'}}>{errors.street}</Text>
                        )}
                      </>
                    }
                  />
                  <MyTextInput
                    value={''}
                    placeholder="Street Name"
                    marginTop={Utils.calculateHeight(8)}
                    children={
                      <>
                        <TextInput
                          onBlur={handleBlur('streetname')}
                          value={values.streetname}
                          onChangeText={handleChange('streetname')}
                          style={appStyles.inputContainer}
                          ref={refstreetName}
                          returnKeyType="next"
                          onSubmitEditing={() => refcity.current?.focus()}
                          blurOnSubmit={false}
                        />
                        {touched.streetname && errors.streetname && (
                          <Text style={{color: 'red'}}>
                            {errors.streetname}
                          </Text>
                        )}
                      </>
                    }
                  />
                  <MyTextInput
                    value={''}
                    placeholder="City"
                    marginTop={Utils.calculateHeight(8)}
                    children={
                      <>
                        <TextInput
                          onBlur={handleBlur('city')}
                          value={values.city}
                          onChangeText={handleChange('city')}
                          style={appStyles.inputContainer}
                          ref={refcity}
                          returnKeyType="next"
                          onSubmitEditing={() => refstate.current?.focus()}
                          blurOnSubmit={false}
                        />
                        {touched.city && errors.city && (
                          <Text style={{color: 'red'}}>{errors.city}</Text>
                        )}
                      </>
                    }
                  />
                  <Pressable onPress={() => setVisible(!visible)}>
                    <MyTextInput
                      value={''}
                      placeholder="State"
                      marginTop={Utils.calculateHeight(8)}
                      children={
                        <>
                          <TextInput
                            onBlur={handleBlur('state')}
                            value={values.state}
                            style={appStyles.inputContainer}
                            onPressIn={() => setVisible(true)}
                            onChangeText={() => setVisible(true)}
                            ref={refstate}
                            returnKeyType="next"
                            onSubmitEditing={() => refzip.current?.focus()}
                            blurOnSubmit={false}
                          />
                          {touched.state && errors.state && (
                            <Text style={{color: 'red'}}>{errors.state}</Text>
                          )}
                        </>
                      }
                    />
                  </Pressable>

                  <MyTextInput
                    value={''}
                    placeholder="Zip"
                    marginTop={Utils.calculateHeight(8)}
                    children={
                      <TextInput
                        onBlur={handleBlur('zip')}
                        value={values.zip}
                        onChangeText={text => {
                          if (text.match(/^\d+$/)) {
                            setFieldValue('zip', text);
                          } else {
                            setFieldValue('zip', '');
                          }
                        }}
                        keyboardType={'number-pad'}
                        style={appStyles.inputContainer}
                        textContentType="postalCode"
                        ref={refzip}
                      />
                    }
                  />
                  {touched.zip && errors.zip && (
                    <Text style={{color: 'red'}}>{errors.zip}</Text>
                  )}
                  <CustomButton
                    title={'Next'}
                    marginTop={Utils.calculateHeight(46)}
                    onPress={() => {
                      if (isValidate(values)) {
                        handleSubmit();
                      }
                    }}
                  />

                  <PopUpStates
                    isVisible={visible}
                    onPress={(item: any) => {
                      setFieldValue('state', item.name);
                      setVisible(!visible);
                    }}
                    onClose={() => setVisible(!visible)}
                  />
                </View>
              </TouchableWithoutFeedback>
            </MySafeArea>
          </KeyboardAwareView>
        </View>
      )}
    </Formik>
  );
};

export default Register;

const styles = StyleSheet.create({
  tvRegister: {
    color: color.white,
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.SemiBold,
    textAlign: 'center',
    marginTop: Utils.calculateHeight(80),
  },
});
