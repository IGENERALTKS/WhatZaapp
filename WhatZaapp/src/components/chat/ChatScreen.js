import React,{useState,useEffect} from "react";
import { View,Platform,KeyboardAvoidingView,Text } from "react-native";
import{
    Bubble,
    GiftedChat,
} from "react-native-gifted-chat";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useNavigation,useRoute } from "@react-navigation/native";
import { formatTimestamp} from "../../utils/helpers";
import { LinearGradient } from "expo-linear-gradient";

export default function ChatScreen() {
    const [messages,setMessages] = useState([]);
    const { userId,userName } = useRoute().params;
    const currentUser = auth().currentUser;
    const navigation = useNavigation();

    useEffect(() =>{
        const chatId = [currentUser.uid,userId].sort().join("_");
        const chatReference = firestore().collection("chats").doc(chatId);

        const unsubcribe=chatReference.onSnapshot((snapshot) =>{
            if(snapshot.exists){
                const chatData = snapshot.data();
                setMessages(chatData.messages);
            }
        });

        return() => unsubcribe();

    },[userId,currentUser.uid]);

    const onSend = async (newMessages = []) =>{
        const chatId = [currentUser.uid,userId].sort().join("_");
        const chatReference = firestore().collection("chats").doc(chatId);


        const formattesMessages = newMessages.map((message) =>({
            ...message,
            createdAt: new Date(message.createdAt),
        }));

        try{
            await chatReference.set(
                 {
                    messages: GiftedChat.append(messages,formattesMessages),
                 },
                 { merge: true }
            );
        } catch (error){
            console.log("Error upgating messages: ",error);
        }
    };

    const renderBubble = (props) =>{
        const { currentMessage } = props; 
        const isReceived = currentMessage.user._id !== currentUser.uid;

        return(
            <Bubble
                {...props}
                wrapperStyle={{
                    right:{
                        backgroundColor:"#4CAF50",
                    },
                    left:{
                        backgroundColor:"#2196F3",
                        marginLeft: isReceived ? 0 : 10,
                    },
                }}
                containerStyle={{
                    left:{
                        marginLeft: isReceived ? -40 :0,
                    },
                }}
                

                />
        );
    };

    
    ///// parei no minuto 1:06:59 
    //ele esta na linha 84 criando um const renderChatFooter

}
