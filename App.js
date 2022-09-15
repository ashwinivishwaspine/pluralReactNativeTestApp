/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import React from 'react';
 import { Buffer } from "buffer";

 import {Alert , View , Button,StyleSheet} from 'react-native';
 import { NativeModules } from 'react-native';
 import {generateCreateOrder} from './data1'
  const { PluralCheckoutSDK } = NativeModules;
  const environment = {
    QA: "QA",
    UAT: "UAT",
    PROD: "PROD",
  }
 
 const App = () => {
   const onPress =  async() => {
    let tokenData = await generateCreateOrder()
    console.log(tokenData.token)

    const options = {
        "channelId" : "APP",
        "countryCode" : "91",
        "emailId" : "ashwini.vishwas@pinelabs.com",
        "theme" : "Dark",
        "orderToken" : tokenData.token,
        "paymentMode" : "ALL",
        "showSavedCardsFeature" : false,
        "mobileNumber" : "9359612449"
      };

      const SDKCallback = async (arg) => {
        Alert.alert(arg,  
        "status code" +" "+ arg.statusCode,  
        [    
            {text: 'OK', onPress: () => console.log( "my arg is " + arg.statusCode ) } 
        ]  
    );  
      };
      
      PluralCheckoutSDK.start(options,environment.UAT,SDKCallback);
    }
      
   

   return (
     <View style={styles.container}>
     <Button
       title="Pay now"
       color="#841584"
       onPress={onPress}
     />
     </View>
   );
 };
 const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop:300
  }
})

 export default App;
