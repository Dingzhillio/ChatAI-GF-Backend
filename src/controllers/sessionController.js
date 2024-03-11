import asyncHandler from "express-async-handler";

const session = asyncHandler(async (req, res) => {
  req.session.plan_id = req.body.plan_id;
  // req.session.user_id = req.body.user_id;
//   console.log(req.session.plan_id);
  res.status(200);
});
export { session };
