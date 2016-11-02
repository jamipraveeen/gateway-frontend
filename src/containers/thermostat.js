/*
 * Copyright (C) 2016 OpenMotics BVBA
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import {computedFrom} from "aurelia-framework";
import Shared from "../components/shared";
import {BaseObject} from "./baseobject";
import {Schedule} from "./schedule";

export class Thermostat extends BaseObject {
    constructor(id, type) {
        super();
        this.api = Shared.get('api');
        this.processing = false;
        this.key = 'id';
        this.id = id;
        this.type = type;
        this.name = undefined;
        this.output0Id = undefined;
        this.output0Value = undefined;
        this.output1Id = undefined;
        this.output1Value = undefined;
        this.sensorId = undefined;
        this.outside = undefined;
        this.currentSetpoint = undefined;
        this.mode = undefined;
        this.actualTemperature = undefined;
        this.airco = undefined;
        this.autoMonday = undefined;
        this.autoTuesday = undefined;
        this.autoWednesday = undefined;
        this.autoThursday = undefined;
        this.autoFriday = undefined;
        this.autoSaturday = undefined;
        this.autoSunday = undefined;
        this.permanentManual = undefined;
        this.pidP = undefined;
        this.pidI = undefined;
        this.pidD = undefined;
        this.pidInt = undefined;
        this.setpoint0 = undefined;
        this.setpoint1 = undefined;
        this.setpoint2 = undefined;
        this.setpoint3 = undefined;
        this.setpoint4 = undefined;
        this.setpoint5 = undefined;
        this.mappingConfiguration = {
            id: 'id',
            name: 'name',
            output0Id: 'output0',
            output1Id: 'output1',
            sensorId: 'sensor',
            autoMonday: [['auto_mon', 'sensor'], (schedule, sensorId) => {
                return new Schedule(schedule, sensorId === 240);
            }],
            autoTuesday: [['auto_tue', 'sensor'], (schedule, sensorId) => {
                return new Schedule(schedule, sensorId === 240);
            }],
            autoWednesday: [['auto_wed', 'sensor'], (schedule, sensorId) => {
                return new Schedule(schedule, sensorId === 240);
            }],
            autoThursday: [['auto_thu', 'sensor'], (schedule, sensorId) => {
                return new Schedule(schedule, sensorId === 240);
            }],
            autoFriday: [['auto_fri', 'sensor'], (schedule, sensorId) => {
                return new Schedule(schedule, sensorId === 240);
            }],
            autoSaturday: [['auto_sat', 'sensor'], (schedule, sensorId) => {
                return new Schedule(schedule, sensorId === 240);
            }],
            autoSunday: [['auto_sun', 'sensor'], (schedule, sensorId) => {
                return new Schedule(schedule, sensorId === 240);
            }],
            permanentManual: 'permanent_manual',
            pidP: 'pid_p',
            pidI: 'pid_i',
            pidD: 'pid_d',
            pidInt: 'pid_int',
            setpoint0: 'setp0',
            setpoint1: 'setp1',
            setpoint2: 'setp2',
            setpoint3: 'setp3',
            setpoint4: 'setp4',
            setpoint5: 'setp5'
        };
        this.mappingStatus = {
            id: 'id',
            name: 'name',
            actualTemperature: 'act',
            airco: 'airco',
            mode: 'mode',
            output0Value: 'output0',
            output1Value: 'output1',
            sensorId: 'sensor_nr',
            currentSetpoint: 'csetp'
        };
    }

    @computedFrom('sensorId')
    get isRelay() {
        return this.sensorId === 240;
    }

    @computedFrom('currentSetpoint')
    get relayStatus() {
        return this.currentSetpoint > 20;
    }

    @computedFrom('output0Id', 'sensorId')
    get isConfigured() {
        // Please note that this property needs configuration to be loaded
        return this.output0Id <= 240 && this.sensorId <= 240 && this.name !== '';
    }

    @computedFrom('type')
    get isHeating() {
        return this.type === 'heating';
    }

    @computedFrom('name', 'id')
    get identifier() {
        if (this.id === undefined) {
            return '';
        }
        return this.name !== '' ? this.name : this.id;
    }

    setCurrentSetpoint() {
        this._skip = true;
        this.api.setCurrentSetpoint(this.id, this.currentSetpoint)
            .then(() => {
                this._freeze = false;
                this.processing = false;
            })
            .catch(() => {
                this._freeze = false;
                this.processing = false;
                console.error('Could not set current setpoint for Thermostat ' + this.name);
            });
    }

    toggle() {
        this._freeze = true;
        this.processing = true;
        if (this.isRelay) {
            if (this.currentSetpoint > 20) {
                this.currentSetpoint = 10;
            } else {
                this.currentSetpoint = 30;
            }
            this.setCurrentSetpoint();
        } else {
            this._freeze = false;
            this.processing = false;
            throw 'A non-relay Thermostat cannot be toggled'
        }
    }

    change(event) {
        this._freeze = true;
        this.processing = true;
        if (!this.isRelay) {
            this.currentSetpoint = event.detail.value;
            this.setCurrentSetpoint();
        } else {
            this._freeze = false;
            this.processing = false;
            throw 'A relay Thermostat can not be changed'
        }
    }
}
