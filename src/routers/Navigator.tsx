import { Navigation } from 'react-native-navigation';
import { registerScreens, screenName } from '@screenName';
import { color } from '@styles';
import { LogBox } from 'react-native';
import { OptionsModalPresentationStyle } from 'react-native-navigation/lib/src/interfaces/Options';
import { Utils } from '@Utils';

registerScreens();

// const bottomTabEventListener = Navigation.events().registerBottomTabSelectedListener(({ selectedTab, unselectedTab }) => {
//   Navigation.popToRoot(screenName.Subscription)
//   Navigation.popToRoot(screenName.HowItWork)
//   Navigation.popToRoot(screenName.Home)
//   Navigation.popToRoot(screenName.MyAccount)
//   Navigation.popToRoot(screenName.Profile)
// })


export const Navigator = {

  setSplash(screen: any) {
    LogBox.ignoreAllLogs();
    LogBox.ignoreLogs(['flexWrap:']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    Navigation.events().registerAppLaunchedListener(async () => {
      this.setDefault();
      this.setRoot(screen);
    });
    Navigation.events().registerBottomTabSelectedListener(({ selectedTabIndex, unselectedTabIndex }) => {
      Navigation.popToRoot(screenName.Subscription)
      Navigation.popToRoot(screenName.HowItWork)
      Navigation.popToRoot(screenName.Home)
      Navigation.popToRoot(screenName.MyAccount)
      Navigation.popToRoot(screenName.Profile)
    })
  },

  // isSubscribe = () => {
  //
  // },

  setHome() {
    Navigation.setRoot({
      root: {
        bottomTabs: {
          id: 'BOTTOM_TABS_LAYOUT',
          children: [
            {
              stack: {
                id: screenName.Subscription,
                children: [
                  {
                    component: {
                      id: screenName.Subscription,
                      name: screenName.Subscription,
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    // selectTabOnPress: await Utils.isSubscribe(),
                    icon: require('@images/bottomTab/ic_subscription.png'),
                    text: 'Subscription',
                  },
                },
              },
            },
            {
              stack: {
                id: screenName.HowItWork,
                children: [
                  {
                    component: {
                      id: screenName.HowItWork,
                      name: screenName.HowItWork,
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    icon: require('@images/bottomTab/ic_how_it_work.png'),
                    text: 'How it works',
                    // selectTabOnPress: await Utils.isSubscribe(),
                  },
                },
              },
            },
            {
              stack: {
                id: screenName.Home,
                children: [
                  {
                    component: {
                      id: screenName.Home,
                      name: screenName.Home,
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    icon: require('@images/bottomTab/ic_home.png'),
                    text: 'Home',
                  },
                },
              },
            },
            {
              stack: {
                id: screenName.MyAccount,
                children: [
                  {
                    component: {
                      id: screenName.MyAccount,
                      name: screenName.MyAccount,
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    icon: require('@images/bottomTab/ic_my_account.png'),
                    text: 'My Account',
                    // selectTabOnPress: await Utils.isSubscribe(),
                  },
                },
              },
            },
            {
              stack: {
                id: screenName.Profile,
                children: [
                  {
                    component: {
                      id: screenName.Profile,
                      name: screenName.Profile,
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    icon: require('@images/bottomTab/ic_profile.png'),
                    text: 'Profile',
                    // selectTabOnPress: await Utils.isSubscribe(),
                  },
                },
              },
            },
          ],
        },
      },
    });
  },

  setRoot(screenName: any, propsData?: any) {
    Navigation.setRoot({
      root: {
        stack: {
          id: screenName,
          children: [
            {
              component: {
                id: screenName,
                name: screenName,
                passProps: { propsData },
              },
            },
          ],
        },
      },
    });
  },

  setPush(componentId: any, screenName: any, propsData?: any) {
    Navigation.push(componentId, {
      component: {
        name: screenName,
        id: screenName,
        passProps: { propsData },
      },
    });
  },

  setPop(componentId: any) {
    Navigation.pop(componentId);
  },

  setPopTo(screenName: any) {
    Navigation.popTo(screenName);
  },

  setPopToRoot(componentId: any) {
    Navigation.popToRoot(componentId);
  },

  showMenu(componentId: any) {
    Navigation.mergeOptions(componentId, {
      sideMenu: {
        left: {
          // width: Utils.calculateWidth(250),
          visible: true,
        },
      },
    });
  },
  hideMenu(componentId: any) {
    Navigation.mergeOptions(componentId, {
      sideMenu: {
        left: {
          visible: false,
        },
      },
    });
  },

  setMergeOption(componentId: string, currentTabIndex: number) {
    Navigation.mergeOptions(componentId, {
      bottomTabs: {
        currentTabIndex: currentTabIndex,
        // drawBehind: true,
      },
    });
  },

  setBottomTab(tabId: any, tabIndex: any) {
    Navigation.mergeOptions(tabId, {
      sideMenu: {
        left: {
          visible: false,
        },
      },
      bottomTabs: {
        currentTabIndex: tabIndex,
      },
    });
  },

  showModal(screenName: any, propsData?: any, colors?: string) {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: screenName,
              passProps: { propsData },
              options: {
                overlay: {
                  interceptTouchOutside: true, // this make touch events pass through the invisible parts of the overlay
                },
                modalPresentationStyle:
                  OptionsModalPresentationStyle.currentContext,

                layout: {
                  backgroundColor: colors ?? 'transparent',
                  componentBackgroundColor: 'transparent',
                },
                // topBar: {
                //     title: {
                //         text: '',
                //     },
                // },
              },
            },
          },
        ],
      },
    });
  },

  dismissModal() {
    Navigation.dismissAllModals();
  },

  showLoader(isLoading: boolean) {
    if (isLoading) {
      this.showOverlay(screenName.MyLoader);
    } else {
      Navigation.dismissOverlay(screenName.MyLoader);
    }
  },

  showOverlay(name: string, propsData?: any) {
    Navigation.showOverlay({
      component: {
        name: name,
        id: name,
        passProps: { propsData },
        options: {
          overlay: {
            interceptTouchOutside: false,
          },
          layout: {
            backgroundColor: '#25222238',
            componentBackgroundColor: '#25222238',
            orientation: ['portrait'],
          },
        },
      },
    });
  },

  dismissOverlay() {
    Navigation.dismissAllOverlays();
  },

  showAlert(
    msg: string,
    type = 'danger' || 'info' || 'success' || 'warning',
    milliSecond?: number,
  ) {
    Navigation.showOverlay({
      component: {
        name: screenName.MyFlash,
        id: screenName.MyFlash,
        passProps: {
          msg: msg,
          type: type,
        },
        options: {
          overlay: {
            interceptTouchOutside: false,
          },
          layout: {
            backgroundColor: 'transparent',
            componentBackgroundColor: 'transparent',
            orientation: ['portrait'],
          },
        },
      },
    })
      .then(() => {
        setTimeout(() => {
          Navigation.dismissOverlay(screenName.MyFlash);
        }, milliSecond ?? 1000);
      })
      .catch(err => {
        Navigation.dismissOverlay(screenName.MyFlash);
      });
  },


  setDefault() {
    Navigation.setDefaultOptions({
      topBar: {
        visible: false,
      },
      bottomTab: {
        iconColor: color.white,
        selectedIconColor: color.black,
        // iconHeight: 24, // for android specific
        // iconWidth: 24,  // for android specific
        textColor: color.white,
        selectedTextColor: color.white,
        iconInsets: {
          top: 5, // for ios specific
        },
      },
      bottomTabs: {
        backgroundColor: color.celticBlue,
        titleDisplayMode: 'alwaysShow',
        currentTabId: screenName.Home
      },
      statusBar: {
        // backgroundColor: color.black,
        // style: 'light',
      },
      layout: { orientation: ['portrait'] },
    });
  },
};
