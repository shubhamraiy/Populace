import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationComponentProps } from "react-native-navigation";
import MySafeArea from "@components/MySafeArea";
import MyTextInput from "@components/MyTextInput";
import { Utils } from "@Utils";
import { color, fontFamily, fontSize } from "@styles";
import CustomButton from "@components/CustomButton";
import TermsCondition from "@components/TermsCondition";
import { Navigator } from "@Navigator";
import { screenName } from "@screenName";
import { ApiServices } from "../services/ApiServices";
import { ApiEndPoint } from "../services/ApiEndPoint";

export interface Props extends NavigationComponentProps {
  propsData: any;
}

const RegisterSubmit: React.FC<Props> = props => {
  const { propsData } = props;

  const [email, setEmail] = useState(propsData?.email ?? "");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const isValidate = () => {
    if (Utils.isEmpty(email)) {
      Navigator.showAlert("Please enter email address");
      return false;
    } else if (!Utils.isEmailValid(email)) {
      Navigator.showAlert("Please enter valid email address");
      return false;
    } else if (Utils.isEmpty(phone)) {
      Navigator.showAlert("Please enter phone number");
      return false;
    } else if (phone.trim().length != 10) {
      Navigator.showAlert("Please enter valid phone number");
      return false;
    } else if (Utils.isEmpty(password)) {
      Navigator.showAlert("Please enter password");
      return false;
    } else if (Utils.isEmpty(confirmPassword)) {
      Navigator.showAlert("Please enter confirm password");
      return false;
    } else if (password.trim() !== confirmPassword.trim()) {
      Navigator.showAlert("Password and confirm password does not match");
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = async () => {
    if (isValidate()) {
      const raw = JSON.stringify({
        firstname: propsData?.firstName,
        lastname: propsData?.lastName,
        street: propsData?.street,
        streetname: propsData.streetName,
        city: propsData?.city,
        state: propsData?.state,
        zip: propsData?.zip,
        email: email,
        phone: phone,
        password: password,
        confirmPassword: confirmPassword,
        isGoogleRegister: propsData?.isGoogle ?? false,
        isAppleRegister: propsData?.isApple ?? false,
        token: propsData?.token ?? undefined,
      });

      const result: any = await ApiServices.post(ApiEndPoint.register, raw);
      if (result.status) {
        await Utils._setUserData(result?.data);
        Navigator.setRoot(screenName.Verification);
      }
    }
  };

  return (
    <MySafeArea componentId={props.componentId} isScroll={true}>
      <Text style={styles.tvRegister}>Registration</Text>

      <MyTextInput
        value={email}
        placeholder="Email Address"
        marginTop={Utils.calculateHeight(18)}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <MyTextInput
        value={phone}
        placeholder="Phone Number"
        marginTop={Utils.calculateHeight(8)}
        onChangeText={setPhone}
        maxLength={10}
        keyboardType="phone-pad"
      />
      <MyTextInput
        value={password}
        placeholder="Password"
        marginTop={Utils.calculateHeight(8)}
        onChangeText={setPassword}
        secureTextEntry
      />
      <MyTextInput
        value={confirmPassword}
        placeholder="Confirm Password"
        marginTop={Utils.calculateHeight(8)}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <CustomButton
        title={'Submit'}
        marginTop={Utils.calculateHeight(79)}
        onPress={() => onSubmit()}
      />

      <TermsCondition componentId={props.componentId} />
    </MySafeArea>
  );
};

export default RegisterSubmit;

const styles = StyleSheet.create({
  tvRegister: {
    color: color.white,
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.SemiBold,
    textAlign: "center",
    marginTop: Utils.calculateHeight(80),
  },
});
