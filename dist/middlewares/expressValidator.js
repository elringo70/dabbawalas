"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationRequest = void 0;
const express_validator_1 = require("express-validator");
function validationRequest(req, res, next) {
    const errors = express_validator_1.validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        console.log(errors.array());
    }
    next();
}
exports.validationRequest = validationRequest;
