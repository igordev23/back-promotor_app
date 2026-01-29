"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const promotor_routes_1 = __importDefault(require("./promotor.routes"));
const supervisor_routes_1 = __importDefault(require("./supervisor.routes"));
const router = (0, express_1.Router)();
// WEB - Supervisor
router.use('/supervisor', supervisor_routes_1.default);
// MOBILE - Promotor
router.use('/promotor', promotor_routes_1.default);
exports.default = router;
