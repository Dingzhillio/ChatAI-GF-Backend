import { mongoose } from 'mongoose';

const membershipPlanSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        cost: {
            type: Number,
            required: true
        },
        min: {
            type: Number,
            required: true
        }
    }
);

const MembershipPlan = mongoose.model('MembershipPlan', membershipPlanSchema)

export default MembershipPlan;