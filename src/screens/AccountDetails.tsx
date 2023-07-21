import {
  Image,
  ImageSourcePropType,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Navigation, NavigationComponentProps} from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import {color, fontFamily, fontSize} from '@styles';
import {Utils} from '@Utils';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';
import {ApiServices} from 'services/ApiServices';
import {ApiEndPoint} from 'services/ApiEndPoint';

export interface Props extends NavigationComponentProps {}

const AccountDetails: React.FC<Props> = props => {
  const [result, setResult] = useState<any>({});
  const [user, setuser] = useState<any>({});
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getAccountDetails();
    if (Object.keys(user).length < 1) {
      getUser();
    }
  }, []);
  const getUser = async () => {
    await Utils._getUserData().then(user => {
      setuser(user);
      SubscriptionCheck(user);
    });
  };

  const SubscriptionCheck = async (user: any) => {
    const json = JSON.stringify({
      playerId: user.id,
    });
    await ApiServices.post(ApiEndPoint.getPlayerInfo, json).then(
      async (response: any) => {
        if (response?.status) {
          setuser(response?.data);
          await Utils._setUserData(response?.data);
        }
      },
    );
  };

  useEffect(() => {
    const unsubscribe = Navigation.events().registerComponentListener(
      {
        componentDidAppear: async () => {
          getUser();
        },
      },
      props.componentId,
    );
    return () => unsubscribe.remove();
  }, []);

  const getAccountDetails = async () => {
    setLoading(true);
    await ApiServices.post(
      ApiEndPoint.accountDetails,
      JSON.stringify({
        id: await Utils._getUserId(),
      }),
    )
      .then((response: any) => {
        if (response?.status) {
          setResult(response?.data || {});
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const _renderItems = (title: any, value: any, id?: number) => {
    return (
      <Pressable
        onPress={() =>
          Navigator.setPush(props.componentId, screenName.AccountDetails)
        }
        style={[
          styles.renderContainer,
          {marginTop: id === 0 ? Utils.calculateHeight(60) : 0},
        ]}>
        <View style={styles.container}>
          <Text style={styles.tvText}>{title}</Text>

          {id !== 0 ? (
            <Text style={styles.tvText}>{value}</Text>
          ) : (
            <Text style={styles.tvText}>
              {user?.subscription?.status !== 'active'
                ? user?.subscription?.status || ''
                : value}
            </Text>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <MySafeArea
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          tintColor="#fff"
          onRefresh={getAccountDetails}
        />
      }
      componentId={props.componentId}
      isScroll={true}>
      <Text style={styles.tvTitle}>Account Details</Text>
      {_renderItems('Purchased Selected Tier', result?.selectedTierAmount, 0)}
      {_renderItems(
        'Interest earned on current\npurchased tier',
        result?.interestOnCurrentTier,
        1,
      )}
      {_renderItems(
        'Interest earned on current\npurchased tier',
        result?.interestAmount,
        2,
      )}
      {_renderItems('Winning amount earned', result?.totalWinningAmount, 3)}
      {_renderItems('Withdraw amount', result?.withdrawAmount, 5)}
      {_renderItems('Total account balance', result?.totalBalanceAmount, 4)}
    </MySafeArea>
  );
};

export default AccountDetails;

const styles = StyleSheet.create({
  renderContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    height: Utils.calculateHeight(60),
    justifyContent: 'center',
    // paddingVertical: Utils.calculateHeight(15),
    marginBottom: 1,
  },

  tvTitle: {
    color: color.white,
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.SemiBold,
    textAlign: 'center',
    marginTop: Utils.calculateHeight(57),
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ivImage: {
    height: 24,
    width: 24,
  },
  tvText: {
    color: color.white,
    fontSize: fontSize.size_16,
    fontFamily: fontFamily.Medium,
  },
});
