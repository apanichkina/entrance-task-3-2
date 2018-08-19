import * as fs from 'fs';
import {IInput} from './interfaces/input';
import {LogicManager} from './classes/logic';

const input = fs.readFileSync('./data/input.json', 'utf8');
const inputData: IInput = JSON.parse(input);

const manager: LogicManager = new LogicManager();
const result = manager.Evaluate(inputData);

fs.writeFileSync('./data/output.json', JSON.stringify(result));
