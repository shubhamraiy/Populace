import {Navigation} from 'react-native-navigation';
import Splash from '../screens/Splash';
import MyFlash from '@components/MyFlash';
import MyLoader from '@components/MyLoader';
import Auth from 'screens/Auth';
import Home from 'screens/Home';
import Subscription from 'screens/Subscription';
import HowItWork from 'screens/HowItWork';
import MyAccount from 'screens/MyAccount';
import Profile from 'screens/Profile';
import SignUp from 'screens/SignUp';
import Register from 'screens/Register';
import RegisterSubmit from 'screens/RegisterSubmit';
import Verification from 'screens/Verification';
import SignIn from 'screens/SignIn';
import ForgotPassword from 'screens/ForgotPassword';
import NewPassword from 'screens/NewPassword';
import EditProfile from '../screens/EditProfile';
import EditAddress from '../screens/EditAddress';
import AccountDetails from '../screens/AccountDetails';
import SweepPickNumber from '../screens/SweepPickNumber';
import SweepTableNumber from '../screens/SweepTableNumber';
import PopUpSubmitNumber from '@components/PopUpSubmitNumber';
import TermsPrivacyTab from '../screens/TermsPrivacyTab';
import PopUpCancelPlan from '@components/PopUpCancelPlan';
import RequestWithdraw from '../screens/RequestWithdraw';
import ModePickingNumber from '../screens/ModePickingNumber';
import ChangePassword from '../screens/ChangePassword';
import ViewPickNumber from '../screens/ViewPickNumber';
import FinancialServices from '../screens/FinancialServices';
import InsuranceServices from '../screens/InsuranceServices';
import DiscountServices from 'screens/DiscountNetwork';
import PaymentWebView from 'screens/PaymentWebView';
import PayStripe from 'screens/PayStripe';
import RequestWithdrawDetails from 'screens/RequestWithdrawDetails';

export const screenName = {
  Splash: 'Splash',
  MyFlash: 'MyFlash',
  MyLoader: 'MyLoader',
  Auth: 'Auth',
  Home: 'Home',
  Subscription: 'Subscription',
  HowItWork: 'HowItWork',
  MyAccount: 'MyAccount',
  Profile: 'Profile',
  SignUp: 'SignUp',
  Register: 'Register',
  RegisterSubmit: 'RegisterSubmit',
  Verification: 'Verification',
  SignIn: 'SignIn',
  ForgotPassword: 'ForgotPassword',
  NewPassword: 'NewPassword',
  EditProfile: 'EditProfile',
  EditAddress: 'EditAddress',
  AccountDetails: 'AccountDetails',
  SweepPickNumber: 'SweepPickNumber',
  SweepTableNumber: 'SweepTableNumber',
  PopUpSubmitNumber: 'PopUpSubmitNumber',
  TermsPrivacyTab: 'TermsPrivacyTab',
  PopUpCancelPlan: 'PopUpCancelPlan',
  RequestWithdraw: 'RequestWithdraw',
  ModePickingNumber: 'ModePickingNumber',
  ChangePassword: 'ChangePassword',
  ViewPickNumber: 'ViewPickNumber',
  FinancialServices: 'FinancialServices',
  InsuranceServices: 'InsuranceServices',
  DiscountServices: 'DiscountServices',
  RequestWithdrawDetails: 'RequestWithdrawDetails',
  Payment: 'PaymentWebView',
  StripePay: 'StripePaypal',
};

export function registerScreens() {
  Navigation.registerComponent(screenName.Splash, () => Splash);
  Navigation.registerComponent(screenName.Auth, () => Auth);
  Navigation.registerComponent(screenName.Home, () => Home);
  Navigation.registerComponent(screenName.Subscription, () => Subscription);
  Navigation.registerComponent(screenName.HowItWork, () => HowItWork);
  Navigation.registerComponent(screenName.MyAccount, () => MyAccount);
  Navigation.registerComponent(screenName.Profile, () => Profile);
  Navigation.registerComponent(screenName.MyFlash, () => MyFlash);
  Navigation.registerComponent(screenName.MyLoader, () => MyLoader);
  Navigation.registerComponent(screenName.SignUp, () => SignUp);
  Navigation.registerComponent(screenName.Register, () => Register);
  Navigation.registerComponent(screenName.RegisterSubmit, () => RegisterSubmit);
  Navigation.registerComponent(screenName.Verification, () => Verification);
  Navigation.registerComponent(screenName.SignIn, () => SignIn);
  Navigation.registerComponent(screenName.ForgotPassword, () => ForgotPassword);
  Navigation.registerComponent(screenName.NewPassword, () => NewPassword);
  Navigation.registerComponent(screenName.EditProfile, () => EditProfile);
  Navigation.registerComponent(screenName.EditAddress, () => EditAddress);
  Navigation.registerComponent(screenName.AccountDetails, () => AccountDetails);
  Navigation.registerComponent(
    screenName.SweepPickNumber,
    () => SweepPickNumber,
  );
  Navigation.registerComponent(
    screenName.SweepTableNumber,
    () => SweepTableNumber,
  );
  Navigation.registerComponent(
    screenName.PopUpSubmitNumber,
    () => PopUpSubmitNumber,
  );
  Navigation.registerComponent(
    screenName.TermsPrivacyTab,
    () => TermsPrivacyTab,
  );
  Navigation.registerComponent(
    screenName.PopUpCancelPlan,
    () => PopUpCancelPlan,
  );
  Navigation.registerComponent(
    screenName.RequestWithdraw,
    () => RequestWithdraw,
  );
  Navigation.registerComponent(
    screenName.ModePickingNumber,
    () => ModePickingNumber,
  );
  Navigation.registerComponent(screenName.ChangePassword, () => ChangePassword);
  Navigation.registerComponent(screenName.ViewPickNumber, () => ViewPickNumber);
  Navigation.registerComponent(
    screenName.FinancialServices,
    () => FinancialServices,
  );
  Navigation.registerComponent(
    screenName.InsuranceServices,
    () => InsuranceServices,
  );
  Navigation.registerComponent(
    screenName.DiscountServices,
    () => DiscountServices,
  );
  Navigation.registerComponent(
    screenName.RequestWithdrawDetails,
    () => RequestWithdrawDetails,
  );
  Navigation.registerComponent(screenName.Payment, () => PaymentWebView);
  Navigation.registerComponent(screenName.StripePay, () => PayStripe);
}
