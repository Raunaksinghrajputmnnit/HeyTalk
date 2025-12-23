import User from "../models/User.js";
import FriendRequest from  "../models/FriendRequest.js";
export async  function getRecommendedUsers(req,res){
  try {
    const currentUserId=req.user.id;
    const currentUser=req.user
    const recommendedUsers=await User.find({
        $and:[
            {_id:{$ne:currentUserId}},
            {$id:{$nin:currentUser.friends}},
            {isOnboarded:true}
        ]
    })
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.log("Error in getRecommenUser controller",error.message);
    res.status(500).json({message:"Internal serber error"})
  }
}
export async  function getMyFriends(req,res){
   try {
    const user=await User.findById(req.user.id)
    .select("friends")
    .populate("friends","fullname profilePic nativeLanguage learningLanguage");
    res.status(200).json(user.friends);
   } catch (error) {
      console.log("error in getMyfrined controller ",error.message);
      res.status(500).json({message:"Internal Server Error"});
   }
}
export async function sendFriendRequest(req,res){
    try {
        const myId=req.user.id;
        const {id:recipientId}=req.params
        if(myId=== recipientId){
            return res.status(400).json({message:"you cant send friend request to Yourself"})
        }
        const recipient=await User.findById({message:"Recipent not found"});
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message:"You are already friedns with this user"});
        }
        const existingRequest=await FriendRequest.findone({
            $or:[
              {sender:myId,recipient:recipientId},
              {sender:recipientId,recipent:myId},
            ],
        });
        if(existingRequest){
            return res.status(400)
            .json({message:"A friend request already exits between you and this user"})
        }
        const friendRequest=await FriendRequest.create({
            sender:myId,
            recipent:recipientId,

        });
        res.status(201).json(friendRequest)
    } catch (error) {
        console.log("erro in sednFriendRequtes controleer ",error.message);
        res.status(500).json({message:"Inetrnal Server Error"});
    }
}
export async function acceptFriendRequest(req,res){
    try {
        const {id:requestId}=req.params
        const friendRequest=await tFriendRequest.findById(requestId);
        if(!friendRequest){
            return res.status(404).json({message:"Friend request not found"});

        }
        if(friendRequest.recipient.toString()!=req.user.id){
            return res.status(403).json({message:"You are not authorized to accept this request"});
        }
        friendRequest.status="accepted";
        await friendRequest.save();
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends:friendRequest.recipent},
        });
        await User.findByIdAndUpdate(friendRequest.recipent,{
            $addToSet:{friends:friendRequest.recipent},
        });

        res.status(200).json({message:"Friedn request acepetd"});


    } catch (error) {
        console.log()
    }
}
export async function getFriendRequests(req,res){
    try {
        const incomingReqs=await friendRequest.find({
            recipent:req.user.id,
            status:"pending",
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage");
        const acceptedReq=await FriendRequest.find({
            sender:req.user.id,
            status:"accepted",
    
        }).populate("recipent","fullname profilePic");
        res.status(200).json({incomingReqs,acceptedReq});
    } catch (error) {
        console.log("Error in getpending friendREquest controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}
export async function getOutgoingFriendReqs(req, res) {
    try {
      const outgoingRequests = await FriendRequest.find({
        sender: req.user.id,
        status: "pending",
      }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");
  
      res.status(200).json(outgoingRequests);
    } catch (error) {
      console.log("Error in getOutgoingFriendReqs controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }