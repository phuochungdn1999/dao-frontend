import { Dispatch } from 'redux';
import axios from 'axios';
import { BridgeActionTypes } from '../../enum/enums';
import { dev } from '../../configs/config';

export const updateBridgeInfo = (info) => {
  return ({
    type: BridgeActionTypes.UPDATE_BRIDGE_INFO,
    payload: info,
  });
};

export const checkServerStatus = async (dispatch) => {
  let urlArray = dev() ? process.env.REACT_APP_SERVER_URLS?.split(' ') : process.env.REACT_APP_SERVER_BRIDGE?.split(' ');
  //let urlArray = process.env.REACT_APP_SERVER_BRIDGE?.split(' ');
  let allOks = true;
  if (urlArray && urlArray.length > 0) {
    for (let i = 0; i < urlArray.length; i++) {
      let isOke = true;
      axios
        .get('https://' + urlArray[0] + '/CheckServer')
        .then((res) => {
          if (res != null) {
            if (res.status === 200) {
            } else {
              console.error('Error HTTP: ' + res.status);
              isOke = false;
            }
          }
        })
        .catch((err) => {
          console.error(err);
          dispatch(updateBridgeInfo({ serverstatus: false }));
        });
      allOks = isOke;
    }
    dispatch(updateBridgeInfo({ serverstatus: allOks }));
  }
};

