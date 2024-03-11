import asyncHandler from 'express-async-handler';
import MembershipPlan from '../models/membershipModel.js';

const createMembership = asyncHandler(async (req, res) => {
    const {name, cost, min} = req.body;

    const MembershipPlanInfo = await MembershipPlan.findOne({name: name});

    if (MembershipPlanInfo) {
        res.status(404);
        throw new Error('Plan already exists');
    }

    const membershipPlan = await MembershipPlan.create({name, cost, min}) 

    if(membershipPlan) {
        res.status(201).json({
            _id: membershipPlan._id,
            name: membershipPlan.name,
            cost: membershipPlan.cost,
            min: membershipPlan.min
        })
    } else {
        res.status(400);
        throw new Error('Invalid membership data')
    }
})

const fetchMembership = asyncHandler(async (req, res) => {
    const membershipPlanInfo = await MembershipPlan.find({})
    // console.log(membershipPlanInfo);
    res.json({plan: membershipPlanInfo})
})
export {createMembership, fetchMembership}