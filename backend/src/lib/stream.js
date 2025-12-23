import {StreamChat} from "stream-chat"
import "dotenv/config"

const apikey=process.env.STREAM_API_KEY
const apiSecret=process.env.STREAM_API_SECRET

if(!apikey || !apiSecret){
    console.log("Steam API KEY or secret is missing")
}
const streamClient=StreamChat.getInstance(apikey,apiSecret);

export const upsertStreamUser=async (userData)=>{
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.log("Eroro upersting Stream Users ",error);
    }
};
export const generateStreamToken=(userId)=>{
    try {
       const userIdstr=userId.toString();
       return streamClient.createToken(userIdstr);

    } catch (error) {
        console.error("Error generating Stream token:",error);
    }
};