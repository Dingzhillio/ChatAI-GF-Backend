import asyncHandler from "express-async-handler";
import User from "../models/usersModel.js";

const countTime = asyncHandler(async (req, res) => {
    const { user_id, time } = req.body;

    const user = await User.findById(user_id);
    console.log(user.remainTime);
    const remainTime = user.remainTime;
    
    await User.findByIdAndUpdate(user_id, {
        remainTime: remainTime - time
    })
    res.status(200).json({msg: "Success"})
})

export {countTime}