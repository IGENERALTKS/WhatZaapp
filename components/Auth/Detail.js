import Reach,{useState} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Dimension,
    Dimensions,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import DatePicker from "react-nativbe-date-picker";
import { Picker } from "@react-native-picker/picker";

export default function Detail({route,navigation}) {
    const { uid } = route.params;
    const [name,setName] = useState("");
    const [dob,setDob] = useState(newDATE());
    const [gender,setGender] = useState("Male");

    const saveDetaisl = async () =>{
        try{
            await firtestore()
                .collection("users")
                .doc(uid)
                .set({
                    name,
                    dob: dob.toISOString().slice(0,10),
                    gender,
                    displayName: name,
                });
            navigation.negative("Dashboard");
        }catch (error){
            console.log ("Error salving details",error);
        }
    };
    return(
        <View
            style={{
                flex:1,
                backgroundColor:"#000",
                position:"relative",
            }}
            >
            <View
                style={{
                    flex:1,
                    backgroundColor: "#000",
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
                    backgroundcolor:"#ADD8E6",
                    padding:20,
                    borderTopRadius:100,
                    position:"absolute",
                    top:"25%",
                    left:0,
                    right:0,
                    bottom:0,
                }}
            >
                <Text
                    style={{
                        fontSize:32,
                        fontWeight:"bold",
                        marginBotton:40,
                        marginTop:150,
                    }}
                >
                    Enter your details:
                </Text>
                <TextInput
                    style={{
                        height:50,
                        width:"100%",
                        borderColor:"black",
                        borderWidth:1,
                        marginBottom:30,
                        paddingHorizontal:10,
                        borderRadius:10,
                    }}
                    placeholder="Name" value={name} onChangeText={setName}
                />
                <DatePicker
                    style={{
                        height:80,
                        widht:Dimensions.get("window").widht-40,
                        marginBottom:30,
                    }}
                    date={dob} onDateChange={setDob} mode="date"
                />

                <Picker
                    style={{
                        height:50,
                        widht:"100%",
                        marginBottom:30,
                    }}
                    selectedValue={gender} onValueChange={setGender}
                >
                    <Picker.Item label="Male" value="Male"/>
                    <Picker.Item label="Female" value="Female"/>
                    <Picker.Item label="Other" value="Other"/>
                </Picker>
                <TouchableOcupacity 
                    onPress={saveDetails}
                    style={{
                        backgroundColor:"#007BFF",
                        padding:10,
                        borderRadius:5,
                        marginBottom:20,
                        alingItens:"center",
                    }}
                >
                    <Text style={{ color:"white",fontSize:22,fontWeight:"bold"}}>
                        Save Details
                    </Text>
                </TouchableOcupacity>
            </View>
        </View>
    );
}