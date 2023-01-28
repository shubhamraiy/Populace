import MySafeArea from '@components/MySafeArea';
import React, {useEffect, useState} from 'react';
import {NavigationComponentProps} from 'react-native-navigation';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import {Utils} from '@Utils';
import {color, fontFamily, fontSize} from '@styles';
import {ApiServices} from '../services/ApiServices';
import {ApiEndPoint} from '../services/ApiEndPoint';

export interface Props extends NavigationComponentProps {
  propsData: any;
}

const TermsPrivacyTab: React.FC<Props> = props => {
  const [isSelected, setIsSelected] = useState(true);
  const { propsData } = props;
  const [terms, setTerms] = useState<any>();
  const [privacy, setPrivacy] = useState<any>();

  const getPrivacyTerms = async () => {
    const ttttt: any = await ApiServices.get(ApiEndPoint.termsCondition);
    // console.log('TTTTT:', ttttt);
    if (ttttt.status) {
      setTerms(ttttt?.data);
    }
  };
  const getPrivacyPolicy = async () => {
    const ppppp: any = await ApiServices.get(ApiEndPoint.privacyPolicy);
    // console.log('PPPPP:', ppppp);

    if (ppppp.status) {
      setPrivacy(ppppp?.data);
    }
  };

  useEffect(() => {
    getPrivacyTerms();
    getPrivacyPolicy();
    setIsSelected(propsData?.isTerms ?? true)
  }, []);

  return (
    <MySafeArea componentId={props.componentId}>
      <ImageBackground
        style={styles.ibContainer}
        resizeMode={'stretch'}
        source={require('@images/bg_terms_privacy.png')}>
        <Pressable
          onPress={() => setIsSelected(true)}
          style={[
            styles.selectedContainer,
            {backgroundColor: isSelected ? '#3FA9F5' : undefined},
          ]}>
          <Text style={styles.tvSelected}>Terms and Condition</Text>
        </Pressable>

        <Pressable
          onPress={() => setIsSelected(false)}
          style={[
            styles.selectedContainer,
            {backgroundColor: !isSelected ? '#3FA9F5' : undefined},
          ]}>
          <Text style={styles.tvSelected}>Privacy Policy</Text>
        </Pressable>
      </ImageBackground>

      <Text style={styles.tvTitle}>
        {isSelected ? 'Terms and Conditions' : 'Privacy Policy'}
      </Text>

      <ScrollView>
        <Text style={styles.tvSubTitle}>{isSelected ? terms : privacy}</Text>
      </ScrollView>
    </MySafeArea>
  );
};

export default TermsPrivacyTab;

const styles = StyleSheet.create({
  ibContainer: {
    height: Utils.calculateHeight(52),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tvSelected: {
    fontSize: fontSize.size_13,
    color: color.white,
    fontFamily: fontFamily.SemiBold,
  },
  selectedContainer: {
    borderRadius: 100,
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  tvTitle: {
    marginTop: Utils.calculateHeight(18),
    fontSize: fontSize.size_18,
    color: color.white,
    fontFamily: fontFamily.SemiBold,
    textAlign: 'center',
  },
  tvSubTitle: {
    marginTop: Utils.calculateHeight(24),
    fontSize: fontSize.size_14,
    color: color.white,
    fontFamily: fontFamily.Regular,
    textAlign: 'justify',
    lineHeight: 18.75,
  },
});
