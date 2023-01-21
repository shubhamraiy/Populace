import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationComponentProps } from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import { color, fontFamily, fontSize } from '@styles';
import { Utils } from '@Utils';
import { Navigator } from '@Navigator';
import { screenName } from '@screenName';
import { ApiServices } from 'services/ApiServices';
import { ApiEndPoint } from 'services/ApiEndPoint';

export interface Props extends NavigationComponentProps { }

const AccountDetails: React.FC<Props> = props => {

  const [result, setResult] = useState<any>()

  useEffect(() => {
    getAccountDetails()
  }, [])

  const getAccountDetails = async () => {

    const response: any = await ApiServices.post(ApiEndPoint.accountDetails, JSON.stringify({
      id: await Utils._getUserId()
    }))
    if (response?.status) {
      setResult(response?.data)
    }
  }

  const _renderItems = (title: any, value: any, id?: number) => {
    return (
      <Pressable
        onPress={() =>
          Navigator.setPush(props.componentId, screenName.AccountDetails)
        }
        style={[
          styles.renderContainer,
          { marginTop: id === 0 ? Utils.calculateHeight(60) : 0 },
        ]}>
        <View style={styles.container}>
          <Text style={styles.tvText}>{title}</Text>
          <Text style={styles.tvText}>{value}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <MySafeArea componentId={props.componentId}>
      <Text style={styles.tvTitle}>Account Details</Text>

      {_renderItems('Purchased Selected Tier', result?.selectedTierAmount, 0)}
      {_renderItems('Interest earned on current\npurchased tier', result?.interestOnCurrentTier, 1)}
      {_renderItems('Interest earned on current\npurchased tier', result?.interestAmount, 2)}
      {_renderItems('Winning amount earned', result?.totalWinningAmount, 3)}
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
    marginTop: Utils.calculateHeight(87),
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
