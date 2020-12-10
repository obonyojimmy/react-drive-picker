/* global google */
import React from "react";
import { useScript } from "./utils";

const defaultScopes = ["https://www.googleapis.com/auth/drive.file"];

export function useDrivePicker(props) {
  const [oauthToken, setoauthToken] = React.useState(null);
  const [pickerApiLoaded, setpickerApiLoaded] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [loaded, error] = useScript("https://apis.google.com/js/api.js");
  const { CLIENT_ID, API_KEY, APP_ID, SCOPES = defaultScopes } = props;

  let picker = null;

  const loadPicker = React.useCallback(
    () => {
      if (loaded && !error && !oauthToken && !pickerApiLoaded) {
        loadApis();
      }
    },
    [loaded, error, oauthToken, pickerApiLoaded]
  );

  React.useEffect(
    () => {
      if (pickerApiLoaded && oauthToken) {
        createPicker();
      }
    },
    [pickerApiLoaded, oauthToken]
  );

  const loadApis = () => {
    window.gapi.load("auth", { callback: onAuthApiLoad });
    window.gapi.load("picker", { callback: onPickerApiLoad });
  };
  
  const onAuthApiLoad = () => {
    window.gapi.auth.authorize(
      {
        client_id: CLIENT_ID,
        scope: SCOPES,
        immediate: false
      },
      handleAuthResult
    );
  };
  const onPickerApiLoad = () => {
    setpickerApiLoaded(true);
  };
  const handleAuthResult = authResult => {
    if (authResult && !authResult.error) {
      setoauthToken(authResult.access_token);
    }
  };
  // Create and render a Picker object for searching images.
  const createPicker = () => {
    const view = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
      .setMimeTypes("application/vnd.google-apps.folder")
      .setSelectFolderEnabled(true)
      .setParent("root");
    picker = new google.picker.PickerBuilder()
      .enableFeature(google.picker.Feature.SUPPORT_DRIVES)
      .setAppId(APP_ID)
      .setOAuthToken(oauthToken)
      .addViewGroup(view)
      .setDeveloperKey(API_KEY)
      .setCallback(pickerCallback)
      .build();
    picker.setVisible(true);
  };
  const pickerCallback = data => {
    if (data.action === google.picker.Action.PICKED) {
      setData(data[google.picker.Response.DOCUMENTS]);
      picker.dispose();
    }
  };
  return [oauthToken, data, loadPicker];
}
