"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConfigurationHandler = exports.getConfigurationHandler = void 0;
const config_service_1 = require("@/service/config.service");
async function getConfigurationHandler(_req, res) {
    const configs = await (0, config_service_1.getConfigrugationValue)();
    res.send(configs);
}
exports.getConfigurationHandler = getConfigurationHandler;
async function updateConfigurationHandler(req, res) {
    await (0, config_service_1.updateConfig)(req.body);
    res.send('Cập nhật cấu hình cài đặt thành công');
}
exports.updateConfigurationHandler = updateConfigurationHandler;
