import * as types from './actionTypes';
import {gql} from '@apollo/client';
import {client} from '@client';

const query = gql`
       query {
    getRewardInfoForPartner {
      ok
      error
      referralCode
      totalCashBonus
      remainingCashBonus
      cashBonusForReferredUser
      cashBonusForReferralPartner
      cashBonusForReferredPartner
      rewards {
        rewardType
        rewardEarned
        createdAt
        updatedAt
        booking {
          billuId
          id
        }
      }
      redeemByCustomer{
      id
      createdAt
      cashBonus
      billuId
      booking_status
      customer_name
      customer{
        customerDetails{
          name
        }
      }
    }
       transaction {
        redeem
        redeemOn
        redeemOnText
        redeemOnDate
        type
        typeText
        booking {
          billuId
          id
        }
        ecomOrder{
          id
				orderNumber
        orderDate
          
        }
        
      }
     
      referralList {
        referalCashBonus
        referredCashBonus
        updatedAt
        createdAt
        referredUser {
          id
          store {
            storeDetails {
              name
            }
          }
          customer {
            customerDetails {
              name
            }
          }
        }
        referralUser {
          id
          customer {
            customerDetails {
              name
            }
          }
          store {
            pinCode
            storeDetails {
              name
              address
              area
            }
          }
        }
      }
    }
  }
`;

function getData() {
    return {
        type: types.FETCHING_DATA,
    };
}

function getFetchingDataSuccess(res: any) {
    if (!res.data) {
        return getDataFailure('No data');
    }

    return {
        type: types.FETCHING_DATA_SUCCESS,
        data: res.data.getRewardInfoForPartner,
    };
}

function getDataFailure(message: string) {
    return {
        type: types.FETCHING_DATA_FAILURE,
        message: message,
    };
}

export function reset() {
    return (dispatch: any) => {
        dispatch({
            type: types.RESET_DATA,
        });
    };
}

export function getRewardInfoForPartner() {
    return (dispatch: any) => {
        dispatch(getData());
        client
            .query({
                query: query,
                variables: {

                },
                fetchPolicy: 'no-cache',
            })
            .then((result) => {


                dispatch(getFetchingDataSuccess(result));
            })
            .catch((err) => {

                dispatch(getDataFailure('Something went wrong.'));


            });
    };
}
