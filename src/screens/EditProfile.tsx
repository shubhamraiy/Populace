import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Navigation, NavigationComponentProps} from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import {color, fontFamily, fontSize} from '@styles';
import {Utils} from '@Utils';
import MyTextInput from '@components/MyTextInput';
import CustomButton from '@components/CustomButton';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';
import {ApiServices} from 'services/ApiServices';
import {ApiEndPoint} from 'services/ApiEndPoint';
import {MyAsyncStorage} from '@MyAsyncStorage';

export interface Props extends NavigationComponentProps {}

const EditProfile: React.FC<Props> = props => {
  const [user, setUser] = useState<any>({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isLoadingD, setLoadingD] = useState(false);

  const deleteUser = (user: any) => {
    Alert.alert('Are you sure?', 'Do you want to delete your account?', [
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          setLoadingD(true);
          await ApiServices.post(
            ApiEndPoint.deletePlayer,
            JSON.stringify({playerId: user?.id}),
          ).finally(async () => {
            await MyAsyncStorage.logOut();
            setLoadingD(false);
          });
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const deleteActiveUser = async (user: any) => {
    Alert.alert(
      'Are you sure?',
      `Do you want to delete your account?\n\n"Deleting your account will result in the cancellation of your subscription."`,
      [
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            setLoadingD(true);
            await ApiServices.post(
              ApiEndPoint.cancelStripeSubscription,
              JSON.stringify({
                userId: user?.id,
                subscriptionId: user?.subscription?.subscriptionId,
              }),
            )
              .then(async () => {
                await ApiServices.post(
                  ApiEndPoint.deletePlayer,
                  JSON.stringify({playerId: user?.id}),
                );
              })
              .finally(async () => {
                await MyAsyncStorage.logOut();
                setLoadingD(false);
              });
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  useEffect(() => {
    const unsubscribe = Navigation.events().registerComponentListener(
      {
        componentDidAppear: async () => {
          Utils._getUserData().then(user => {
            setUser(user);
            setFirstName(user?.firstname);
            setLastName(user?.lastname);
            setEmail(user?.email);
            setPhone(user?.phone);
          });
        },
      },
      props.componentId,
    );
    return () => unsubscribe.remove();
  }, []);

  const isValidate = () => {
    if (Utils.isEmpty(firstName)) {
      Navigator.showAlert('Please enter first name');
      return false;
    } else if (Utils.isEmpty(lastName)) {
      Navigator.showAlert('Please enter last name');
      return false;
    } else if (Utils.isEmpty(email)) {
      Navigator.showAlert('Please enter email address');
      return false;
    } else if (!Utils.isEmailValid(email)) {
      Navigator.showAlert('Please enter valid email address');
      return false;
    } else if (Utils.isEmpty(phone)) {
      Navigator.showAlert('Please enter phone number');
      return false;
    } else if (phone.trim().length !== 10) {
      Navigator.showAlert('Please enter valid phone number');
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = async (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
  ) => {
    if (isValidate()) {
      setLoading(true);
      const raw = JSON.stringify({
        id: await Utils._getUserId(),
        firstName: firstName,
        lastName: lastName,
        email: email?.toLowerCase(),
        phone: phone,
      });
      await ApiServices.post(ApiEndPoint.updateProfile, raw)
        .then(async (result: any) => {
          setLoading(false);
          if (result.status) {
            let userData: any = {...user};
            if (Object.keys(result.data).length > 0) {
              userData.firstname = result?.data?.firstname;
              userData.lastname = result?.data?.lastname;
              userData.email = result?.data?.email;
              userData.phone = result?.data?.phone;
              await Utils._setUserData(userData);
              Navigator.setPop(props.componentId);
            } else {
              Navigator.setRoot(screenName.Verification, {
                isEmailChanged: true,
              });
            }
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1}}>
        <MySafeArea componentId={props.componentId} isScroll={true}>
          <View style={styles.container}>
            <Text style={styles.tvProfile}>Profile</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 36,
              }}>
              <MyTextInput
                width={'48%'}
                value={firstName}
                placeholder="First Name"
                onChangeText={setFirstName}
              />
              <MyTextInput
                width={'48%'}
                value={lastName}
                placeholder="Last Name"
                onChangeText={setLastName}
              />
            </View>
            <MyTextInput
              value={email}
              placeholder="Email Address"
              marginTop={10}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <MyTextInput
              value={phone}
              placeholder="Phone Number"
              marginTop={10}
              onChangeText={setPhone}
              maxLength={10}
              keyboardType="phone-pad"
            />

            <CustomButton
              isLoading={isLoading}
              title={'Submit'}
              marginTop={Utils.calculateHeight(60)}
              onPress={() => onSubmit(firstName, lastName, email, phone)}
            />

            {/* <CustomButton
              isLoading={isLoadingD}
              title={'Delete Account'}
              marginTop={Utils.calculateHeight(20)}
              onPress={() => deleteUser(user?.id || '')}
            /> */}

            <Pressable
              disabled={isLoadingD}
              onPress={() => {
                if (user?.subscription?.status === 'canceled') {
                  deleteUser(user || {});
                } else {
                  deleteActiveUser(user || {});
                }
              }}
              style={{alignSelf: 'center', marginTop: 25}}>
              {isLoadingD ? (
                <ActivityIndicator color={color.danger} />
              ) : (
                <Text style={styles.deleteAc}>Delete Account</Text>
              )}
            </Pressable>
          </View>
        </MySafeArea>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // marginTop: 36
  },

  tvProfile: {
    marginTop: 30,
    color: color.white,
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.SemiBold,
    textAlign: 'center',
  },
  deleteAc: {
    color: color.danger,
    fontSize: 14,
    fontFamily: fontFamily.Bold,
  },
});
