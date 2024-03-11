import express from 'express';

import * as chatController from '../controllers/chatController.js'
import * as stripeController from '../controllers/stripeController.js';
import * as membershipController from '../controllers/membershipController.js';
import { checkAuth } from '../middleware/authMiddleware.js';
import * as sessionController from '../controllers/sessionController.js';
import * as countTimecontroller from '../controllers/countTimeController.js'
import * as chtController from '../controllers/chtController.js';

const mainRoute = express.Router()

mainRoute.post('/chat/create', chatController.createHistory);
mainRoute.post('/chat/fetch', chatController.fetchChats);
mainRoute.post('/chat/bot', chatController.botRes)

mainRoute.post('/voice', chatController.textToSpeech);
mainRoute.get('/voice/:id', chatController.getVoice);

mainRoute.post('/membership/create', membershipController.createMembership);
mainRoute.get('/membership', membershipController.fetchMembership)

mainRoute.post('/session', sessionController.session);
mainRoute.get('/stripe/pay', stripeController.stripe_pay);
mainRoute.get('/stripe/success', stripeController.stripe_success)
mainRoute.get('/stripe/cancel', stripeController.stripe_fail);

mainRoute.post('/count', countTimecontroller.countTime);

mainRoute.post('/cht/create', chtController.createCht);
mainRoute.post('/cht/fetch', chtController.getCht);

export default mainRoute;