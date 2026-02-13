import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [code, setCode] = useState("");
    const [confirm, setConfirm] = useState(null);
    const navigation = useNavigation();

    const signInWithPhoneNumber = async () =>{
        try{
            //Validar formato do número de telefone//Validate phone number format
            const phoneRegex=/^\+\d{10,15}$/;
            if(!phoneRegex.test(phoneNumber)){
                alert("Número inválido.Ex: (e.g., +5542988704065).");
                return;
            }

            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
            setConfirm(confirmation);
        } catch (error) {
            alert("Erro ao enviar código. Por favor, tente novamente mais tarde.");
            console.log("error sending code: ", error);
        }
    };

    const confirmCode = async () =>{
        try{
            //Validar formato do código//Validate code format
            if(!code || code.length !== 6){
                alert("Código inválido. Por favor, insira um código de 6 dígitos.");
                return;
            }

            const userCredential = await confirm.confirm(code);
            const user = userCredential.user;

            //Verifique se o novo ou existente//Check if the new or existing
            const userDocument = await firestore()
                .collection("users")
                .doc(user.uid)
                .get();

            if(userDocument.exists){
                //O usuário existe, navegue até o painel//User is existing, navagate to dashboard
                navigation.navigate("Dashboard");
            } else {
                navigation.navigate("Detail", { uid: user.uid });
            }
        } catch (error) {
            alert("Invalid code. Please enter the correct code");
            console.log("Invalid code", error);
        }
    };
    return(
        <View
            style={{
                flex: 1,
                backgroundColor: "#000",
                position: "relative",
                padding: 20,
            }}
        >
            <View
                style={{
                    flex:1,
                    backgroundColor:"#000",
                    position:"absolute",
                    top:0,
                    left:0,
                    right:0,
                    height:"25%",
                }}
            />
            <View
                style={{
                    flex:1,
                    backgroundColor:"#ADD8E6",
                    borderTopLeftRadius:100,
                    position:"absolute",
                    top:"25%",
                    left:0,
                    right:0,
                    bottom:0,
                }}
            >  
                <Text
                    style={{
                        fontSize: 32,
                        fontWeight: "bold",
                        marginBottom: 40,
                        marginTop: 20,
                        textAlign: "center",
                    }}
                >
                    WhatZap 2
                </Text>

                {!confirm ? (
                    <>
                        <Text
                            style={{
                                marginBottom: 20,
                                fontSize: 18,
                                color: "#808080",
                            }}
                        >
                               Número de telefone com código do país:
                        </Text>
                        <TextInput
                            style={{
                                height: 50,
                                width: "100%",
                                borderColor: "black",
                                borderWidth: 1,
                                marginBottom: 30,
                                paddingHorizontal: 10,
                                borderRadius: 10,
                                backgroundColor: "#fff",
                            }}
                            placeholder="+5542912345678"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                        />
                        <TouchableOpacity
                            onPress={signInWithPhoneNumber}
                            style={{
                                backgroundColor: "#007BFF",
                                padding: 10,
                                borderRadius: 5,
                                marginBottom: 20,
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: 22,
                                    fontWeight: "bold",
                                }}
                            >
                                Verify Phone number
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text
                            style={{
                                marginBottom: 20,
                                fontSize: 18,
                                color: "#808080",
                            }}
                        >
                            Enter the code sent to your phone
                        </Text>
                        <TextInput
                            style={{
                                height: 50,
                                width: "100%",
                                borderColor: "black",
                                borderWidth: 1,
                                marginBottom: 30,
                                paddingHorizontal: 10,
                                borderRadius: 10,
                                backgroundColor: "#fff",
                            }}
                            placeholder="Enter code"
                            value={code}
                            onChangeText={setCode}
                            keyboardType="number-pad"
                        />
                        <TouchableOpacity
                            onPress={confirmCode}
                            style={{
                                backgroundColor: "#007BFF",
                                padding: 10,
                                borderRadius: 5,
                                marginBottom: 20,
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: 22,
                                    fontWeight: "bold",
                                }}
                            >
                                Confirm Code
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}