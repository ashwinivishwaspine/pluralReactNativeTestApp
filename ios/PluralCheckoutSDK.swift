//
//  CalendarModuleFoo.swift
//  AwesomeProject
//
//  Created by Ashwini Vishwas on 02/08/22.
//

import Foundation
import UIKit

import PluralCheckout

@objc(PluralCheckoutSDK)
class PluralCheckoutSDK: NSObject {
  
  static var onResponseCallback:RCTResponseSenderBlock?=nil;


  @objc
  func start(_ options:NSDictionary,environment:NSString,onReponse:@escaping RCTResponseSenderBlock){
    
    PluralCheckoutSDK.onResponseCallback = onReponse
    
    let optionsData = Plural()
    
    optionsData.setTheme(theme: options["theme"] as? String ?? "default")
      .setChannelId(channelId: options["channelId"] as? String ?? "APP")
      .setPaymentMode(paymentMode: options["paymentMode"] as? String ?? "ALL")
      .setCountryCode(countryCode: options["countryCode"] as? String ?? "91")
      .setMobileNum(mobileNumber: options["mobileNumber"] as? String ?? "null")
      .setEmailId(emailId: options["emailId"] as! String)
      .setshowSavedCardsFeature(showSavedCardsFeature: (options["showSavedCardsFeature"]  as? Bool ?? true))
      .setOrderToken(orderToken: options["orderToken"] as? String ?? "")
    
    var envTOPass: PluralEnvironment
    
    switch environment{
    case "UAT":
      envTOPass = PluralEnvironment.isUAT
    case "PROD":
      envTOPass = PluralEnvironment.isProd
    case "QA":
      envTOPass = PluralEnvironment.isQA
    default:
      envTOPass = PluralEnvironment.isDev
    }
    
    DispatchQueue.main.async {
      let rootViewController = UIApplication.shared.delegate?.window??.rootViewController;
      PluralPGPaymentManager.open(options: optionsData, environment: envTOPass, context: rootViewController!, pluralPGResponseCallback: MerchantCallbackResponse())
    }
    
  }
  @objc static func requiresMainQueueSetup() -> Bool {return true;}
  
}



public class MerchantCallbackResponse:UIViewController, IPluralPGResponseCallback
{
  public func onErrorOccured(code: Int, message: String) {
    let resultsDict = [
     "statusCode" : 400,
     "message": message
    ] as [String : Any]
    
    PluralCheckoutSDK.onResponseCallback!([resultsDict])  }
  
  
  public func onTransactionResponse(paymentId: String, pluralOrderId: String) {
    let dict = ["paymentId":paymentId,"pluralOrderId":pluralOrderId]
    
    let resultsDict = [
     "statusCode" : 200,
     "message": dict
    ] as [String : Any]
    
    PluralCheckoutSDK.onResponseCallback!([resultsDict])
    
  }
  
  public func onCancelTxn() {
   
    let resultsDict = [
     "statusCode" : 300,
     "message": "transcation cancelled by user"
    ] as [String : Any]
    PluralCheckoutSDK.onResponseCallback!([resultsDict])
  }
  
  

}
