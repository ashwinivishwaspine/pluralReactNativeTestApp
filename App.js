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
        if (arg.statusCode == 200){ // transcation successful
          successShowAlert(arg.message);
        }else if (arg.statusCode == 400){ // error occurs
          showAlert(arg.message);
        }else{ // 300 // trans cancelled 
          showAlert(arg.message);
        }
 
      };
      
      PluralCheckoutSDK.start(options,environment.UAT,SDKCallback);
    }

    function successShowAlert(message){
      let messageTemp = "Success Reponse: paymentId= " + message.paymentId + " pluralOrderId=" + message.pluralOrderId ;
      Alert.alert("Alert",  
      messageTemp,  
      [    
          {text: 'OK', onPress: () => console.log( messageTemp)} 
      ]  
  ); 
    }

   function showAlert(message){

    Alert.alert("Alert",  
      message,  
      [    
          {text: 'OK', onPress: () => console.log( "Callback Reponse: paymentId= " + message.paymentId + " " + "pluralOrderId=" + message.pluralOrderId) } 
      ]  
  ); 
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
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
    }
})

 export default App;
