package com.awesomeproject;

import static com.awesomeproject.ReactNativeJson.convertMapToJson;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.pine.plural_sdk.Callbacks.Interface.IPinePGResponseCallback;
import com.pine.plural_sdk.Callbacks.PinePGPaymentManager;
import com.pine.plural_sdk.Constants.Environment;
import com.pine.plural_sdk.Constants.PluralPGConfig;

import org.json.JSONException;
import org.json.JSONObject;

public class PluralSDKModule extends ReactContextBaseJavaModule {
    ReactApplicationContext context;
    PinePGPaymentManager objPinePGPaymentManager = null;

    public PluralSDKModule(ReactApplicationContext context) {
        this.context = context;
        this.objPinePGPaymentManager = new PinePGPaymentManager();
    }

    @NonNull
    @Override
    public String getName() {
        return "PluralCheckoutSDK";
    }

    void addMerchant(String env) {
        switch (env) {
            case "DEV":
                    PluralPGConfig.createRequestForPinePG(Environment.DEV);
                break;
            case "UAT":
                    PluralPGConfig.createRequestForPinePG(Environment.UAT);
                break;
            case "QA":
                    PluralPGConfig.createRequestForPinePG(Environment.QA);
                break;
            case "PROD":
                PluralPGConfig.createRequestForPinePG(Environment.PROD);
                break;
        }
    }

    @ReactMethod
    public void start(ReadableMap options, String environment, Callback callback) throws JSONException {

        addMerchant(environment);
        JSONObject jsonObject = convertMapToJson(options);

        this.objPinePGPaymentManager.startPayment(context.getCurrentActivity(), jsonObject, new IPinePGResponseCallback() {
            @Override
            public void onErrorOccured(int code, String message) {
                WritableNativeMap object = new WritableNativeMap();
                object.putInt("statusCode",code);
                object.putString("message",  message);
                callback.invoke(object);
            }

            @Override
            public void onTransactionResponse(JSONObject jsonObject) {
                WritableNativeMap object = new WritableNativeMap();
                object.putString("statusCode","200");
                try {
                JSONObject json = new JSONObject();
                json.put("paymentId", jsonObject.getString("payment_id"));
                json.put("pluralOrderId", jsonObject.getString("plural_order_id"));

                object.putMap("message", ReactNativeJson.convertJsonToMap(json));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                callback.invoke(object);
            }

            @Override
            public void onCancelTxn(int code, String message) {
                WritableNativeMap object = new WritableNativeMap();
                object.putInt("statusCode",code);
                object.putString("message", message);
                callback.invoke(object);
            }
        });

    }

}
