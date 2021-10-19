"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressesController = void 0;
const addresses_1 = __importDefault(require("../models/addresses"));
class AddressesController {
    getAllStates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            try {
                const query = `
                SELECT *
                FROM estados
                ORDER BY nombre ASC
            `;
                const states = yield addresses_1.default.fetchAll(query);
                res.status(200).json(states);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error al traer los estados'
                });
            }
        });
    }
    getAllCitiesFromState(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const { state } = req.params;
            try {
                const query = `
                SELECT *
                FROM municipios
                WHERE estado=${state}
                ORDER BY nombre ASC
            `;
                const states = yield addresses_1.default.fetchAll(query);
                res.status(200).json(states);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error al traer los estados'
                });
            }
        });
    }
    getAllMunicipalitiesFromCity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const { municipality } = req.params;
            try {
                const query = `
                SELECT *
                FROM colonias
                WHERE municipio=${municipality}
                ORDER BY nombre ASC
            `;
                const states = yield addresses_1.default.fetchAll(query);
                res.status(200).json(states);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error al traer las colonias'
                });
            }
        });
    }
}
exports.addressesController = new AddressesController();
