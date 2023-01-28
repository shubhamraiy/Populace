import {
  Alert,
  FlatList,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Navigation, NavigationComponentProps } from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import CustomButton from '@components/CustomButton';
import { color, fontFamily, fontSize } from '@styles';
import { Utils } from '@Utils';
import TextWithIcon from '@components/TextWithIcon';
import { Navigator } from '@Navigator';
import { screenName } from '@screenName';
import { ApiServices } from '../services/ApiServices';
import { ApiEndPoint } from '../services/ApiEndPoint';

export interface Props extends NavigationComponentProps {
  propsData: any
}

const Subscription: React.FC<Props> = props => {
  const { propsData } = props
  const DATA = [
    {
      title: 'Tier_1',
      tier: 'tier1',

      data: [
        {
          id: 1,
          expireOn: '',
          plan: 'monthly',
          title: '$10 per month',
          isSelected: false,
          amount: '$10',
          amountInr: '10',
        },
        {
          id: 2,
          expireOn: '',
          plan: 'yearly',
          title: '$120 per year',
          isSelected: false,
          amount: '$120',
          amountInr: '120',
        },
      ],
    },
    {
      title: 'Tier_2',
      tier: 'tier2',
      data: [
        {
          id: 3,
          expireOn: '',
          plan: 'monthly',
          title: '$20 per month',
          isSelected: false,
          amount: '$20',
          amountInr: '20',
        },
        {
          id: 4,
          expireOn: '',
          plan: 'yearly',
          title: '$240 per year',
          isSelected: false,
          amount: '$240',
          amountInr: '240',
        },
      ],
    },
    {
      title: 'Tier_3',
      tier: 'tier3',
      data: [
        {
          id: 5,
          expireOn: '',
          plan: 'monthly',
          title: '$30 per month',
          isSelected: false,
          amount: '$30',
          amountInr: '30',
        },
        {
          id: 6,
          expireOn: '',
          plan: 'yearly',
          title: '$360 per year',
          isSelected: false,
          amount: '$360',
          amountInr: '360',
        },
      ],
    },
  ];

  const [data, setData] = useState(DATA);
  const [saveItems, setSaveItems] = useState<any>();
  const [selectedTier, setSelectedTier] = useState('');
  const [isGrade, setIsGrade] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>();

  useEffect(() => {
    const unsubscribe = Navigation.events().registerComponentListener(
      {
        componentDidAppear: () => {
          Utils._getUserData().then(user => {
            // console.log("UserData:", user);
            // console.log(Object.keys(user.subscription).length);
            setSaveItems({
              plan: user?.subscription?.plan,
              amountInr: user?.subscription?.amount,
            })
            setCurrentPlan(user);
            setSelectedTier(user.subscription.tier);
            const filterData: any = [];
            data.map((item: any) => {
              item?.data?.map((i: any) => {
                if (item?.tier === user?.subscription?.tier) {
                  if (i.plan === user?.subscription?.plan) {
                    setSaveItems(i);
                    i.isSelected = true;
                  }
                  return i;
                }
              });
              filterData.push(item);
            });
            setData(filterData);
          });
        }
      },
      props.componentId,
    );
    return () => unsubscribe.remove();
  }, []);



  // type 0 for default 1 for downgrade 2 for upgrade 
  const subscriptionPost = async (type: number) => {
    if (saveItems) {
      const json = JSON.stringify({
        id: await Utils._getUserId(),
        tier: selectedTier,
        plan: saveItems.plan,
        amount: saveItems.amountInr,
      });

      const response: any = await ApiServices.post(
        type === 0 ? ApiEndPoint.subscriptionPost : type === 1 ? ApiEndPoint.downgradeSubscription : ApiEndPoint.upgradeSubscription, json,);

      if (response?.status) {
        await Utils._setUserData(response?.data);
        setCurrentPlan(response?.data);
        setSelectedTier(response?.data.subscription.tier);
        Navigator.showAlert(response?.message, 'success');
        if (propsData?.isShow) {
          Navigator.setHome()
          Navigation.popToRoot(screenName.Subscription)
          Navigation.popToRoot(screenName.HowItWork)
          Navigation.popToRoot(screenName.Home)
          Navigation.popToRoot(screenName.MyAccount)
          Navigation.popToRoot(screenName.Profile)
        }
        Navigator.setMergeOption(props.componentId, 2);
      }
    } else {
      Navigator.showAlert('Please select plan');
    }
  };

  const _renderItems = (item: any, index: any) => {
    return (
      <View>
        <Text style={styles.tvItemTitle}>{item.title}</Text>
        <View style={styles.rowContainer}>
          <CustomButton
            title={item?.data[0].title}
            FontSize={fontSize.size_12}
            titleColor={
              saveItems?.id === item.data[0].id
                ? color.white
                : color.sapphireBlue
            }
            backgroundColor={
              saveItems?.id === item.data[0].id ? color.royalBlue : color.white
            }
            FontFamily={fontFamily.Medium}
            height={Utils.calculateHeight(39)}
            width={'45%'}
            onPress={() => {
              if (currentPlan?.isSubscribe) {
                if (item.data[0]?.amountInr !== currentPlan?.subscription?.amount) {
                  Alert.alert('Plan Change', 'Do you want to change your plan?', [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Yes', onPress: () => {
                        setSelectedTier(item.tier);
                        setSaveItems(item.data[0]);
                      }
                    },
                  ]);
                } else {
                  setSelectedTier(item.tier);
                  setSaveItems(item.data[0]);
                }
              } else {
                setSelectedTier(item.tier);
                setSaveItems(item.data[0]);
              }

            }}
          />
          <CustomButton
            title={item?.data[1].title}
            FontFamily={fontFamily.Medium}
            backgroundColor={
              saveItems?.id === item.data[1].id ? color.royalBlue : color.white
            }
            titleColor={
              saveItems?.id === item.data[1].id
                ? color.white
                : color.sapphireBlue
            }
            FontSize={fontSize.size_12}
            height={Utils.calculateHeight(39)}
            width={'45%'}
            onPress={() => {
              if (currentPlan?.isSubscribe) {
                if (item.data[1].amountInr !== currentPlan?.subscription?.amount) {
                  Alert.alert('Plan Change', 'Do you want to change your plan?', [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Yes', onPress: () => {
                        setSelectedTier(item.tier);
                        setSaveItems(item.data[1]);
                      }
                    },
                  ]);
                } else {
                  setSelectedTier(item.tier);
                  setSaveItems(item.data[1]);
                }
              } else {
                setSelectedTier(item.tier);
                setSaveItems(item.data[1]);
              }
            }}
          />
        </View>
        {(item.data[0].amountInr == currentPlan?.subscription?.amount) &&
          <Text style={{ ...styles.tvItemTitle, marginTop: 0 }}>
            Expiry date: {currentPlan?.subscription?.expireDate + " ($" + currentPlan?.subscription?.amount + ")"}</Text>
        }
      </View>
    );
  };

  const _btnDownUpGrade = () => {
    return (
      <View style={{ marginTop: Utils.calculateHeight(30) }}>
        <View style={styles.rowContainerSpaceBetween}>
          <CustomButton
            title={'Upgrade'}
            width={'47%'}
            onPress={() => {
              if (currentPlan?.subscription?.tier > selectedTier) {
                Navigator.showAlert('Selected plan downgraded');
              } else if (currentPlan?.subscription?.amount === saveItems?.amountInr) {
                Alert.alert("Current plan selected")
              } else {
                // Navigator.showAlert('Success', 'success');
                subscriptionPost(2)

              }
            }}
          />

          <CustomButton
            title={'Downgrade'}
            width={'47%'}
            backgroundColor={color.denim}
            onPress={() => {
              // console.log('Downgrade', selectedTier);
              if (currentPlan?.subscription?.tier < selectedTier) {
                Navigator.showAlert('Selected plan upgradeable');
              } else if (currentPlan?.subscription?.amount == saveItems?.amountInr) {
                Alert.alert("Current plan selected")
              } else {
                // Navigator.showAlert('Success', 'success');
                subscriptionPost(1)
              }
            }}
          />
        </View>
        {currentPlan?.isSubscribe && <Text
          onPress={() => Navigator.showOverlay(screenName.PopUpCancelPlan)}
          style={styles.tvCancel}>
          Cancel
        </Text>}
      </View>
    );
  };

  return (
    <MySafeArea componentId={props.componentId} isHideBack isScroll={true}>
      <Text style={styles.tvTitle}>Subscription Payment</Text>

      <FlatList
        style={{ marginTop: Utils.calculateHeight(24) }}
        data={data}
        scrollEnabled={false}
        renderItem={({ item, index }) => _renderItems(item, index)}
      />


      {currentPlan?.isSubscribe ?
        _btnDownUpGrade() :
        (<>
          <Pressable
            style={styles.btnAndroidIosPay}
            onPress={() => subscriptionPost(0)}>
            <TextWithIcon
              title={'Android Pay'}
              icon={require('@images/ic_android.png')}
            />
            <Text> / </Text>
            <TextWithIcon
              title={'Apple Pay'}
              icon={require('@images/ic_apple.png')}
            />
          </Pressable>
          <CustomButton
            title={'Credit/Debit card'}
            marginTop={Utils.calculateHeight(30)}
            onPress={() => subscriptionPost(0)}
          />
        </>
        )
      }
    </MySafeArea>
  );
};

export default Subscription;

const styles = StyleSheet.create({
  tvTitle: {
    marginTop: Utils.calculateHeight(57),
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.SemiBold,
    color: color.white,
    textAlign: 'center',
  },

  rowContainer: {
    marginTop: Utils.calculateHeight(3),
    flexDirection: 'row',
    paddingVertical: Utils.calculateHeight(13),
    paddingHorizontal: Utils.calculateWidth(10),
    justifyContent: 'space-between',
    backgroundColor: '#0C2271',
    borderRadius: 5,
  },
  rowContainerSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tvItemTitle: {
    marginTop: Utils.calculateHeight(10),
    fontSize: fontSize.size_14,
    fontFamily: fontFamily.Medium,
    color: color.white,
  },
  ivSocialIcon: {
    height: 20,
    width: 20,
  },
  btnAndroidIosPay: {
    backgroundColor: color.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: Utils.calculateHeight(52),
    marginTop: Utils.calculateHeight(67),
    borderRadius: 5,
  },
  tvCancel: {
    color: color.white,
    alignSelf: 'flex-end',
    fontSize: fontSize.size_14,
    fontFamily: fontFamily.SemiBold,
    marginTop: Utils.calculateHeight(5),
    marginBottom: Utils.calculateHeight(20),
  },
});
