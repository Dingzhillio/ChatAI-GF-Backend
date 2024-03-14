import asyncHandler from "express-async-handler";
import MembershipPlan from "../models/membershipModel.js";
import stripe from "stripe";
import dotenv from "dotenv";
import User from "../models/usersModel.js";

dotenv.config();

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

const stripe_pay = asyncHandler(async (req, res) => {
  const plan_id = req.query.plan_id;
  const user_id = req.query.user_id;
  console.log("stripe pay ok")
  const plan_info = await MembershipPlan.findById(plan_id);
  // console.log(plan_info)

  if (!plan_info) {
    res.status(404);
    throw new Error("Plan does not exit");
  }

  const success_url = process.env.BASIC_URL + "stripe/success";
  const cancel_url = process.env.BASIC_URL + "stripe/cancel";

  try {
    const session = await stripeInstance.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan_info.name,
            },
            unit_amount: plan_info.cost * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        success_url +
        `?session_id={CHECKOUT_SESSION_ID}&plan_id=${plan_id}&user_id=${user_id}`,
      cancel_url: cancel_url,
    });

    // res.redirect(process.env.DOMAN_URL);
    res.status(200).json(session);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

const stripe_success = asyncHandler(async (req, res) => {
  const plan_id = req.query.plan_id;
  const stripe_session = await stripeInstance.checkout.sessions.retrieve(
    req.query.session_id
  );

  const plan_info = await MembershipPlan.findById(plan_id);
  const plan_name = plan_info.name;
  const plan_cost = plan_info.cost;
  const plan_min = plan_info.min;

  const user_id = req.query.user_id;
  const userInfo = await User.findById(user_id);
  const remainTime = userInfo.remainTime;

  if (stripe_session.status == "complete") {
    await User.findByIdAndUpdate(user_id, {
      remainTime: remainTime + plan_min,
    });

    res.redirect(process.env.DOMAIN_URL);
  } else {
    res.redirect(process.env.DOMAIN_URL);
  }
});

const stripe_fail = (req, res) => {
  res.redirect(process.env.DOMAIN_URL);
};

export { stripe_pay, stripe_success, stripe_fail, stripeInstance };
