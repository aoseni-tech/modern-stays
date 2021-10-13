import express from 'express';
const router = express.Router({mergeParams:true});
const {checkStayValidity,validationResult}= require('../schemaValidations/staySchemaValidation');
const wrapAsync = require('../utils/wrapAsync');
const {setStayQuery} = require('../middlewares/setStayQuery');

import { isAuthenticated } from '../middlewares/isAuthenticated';
import {authenticatePost}  from '../middlewares/authenticatePost'
import {isHost}  from '../middlewares/isHost'
const stays = require('../controllers/stays');

router.route('')
.get(setStayQuery,wrapAsync(stays.getStays))
.post(checkStayValidity,wrapAsync(stays.createNewStay));

router.get('/new',isAuthenticated,validationResult,stays.renderNewStayForm)
router.get('/:id/update',isAuthenticated,isHost,validationResult,wrapAsync(stays.renderEditStayForm));

router.route('/:id')
 .get(wrapAsync(stays.showStay))
.put(authenticatePost,isHost,checkStayValidity,wrapAsync(stays.editStay))
.delete(authenticatePost,isHost,wrapAsync(stays.deleteStay))

module.exports = router;