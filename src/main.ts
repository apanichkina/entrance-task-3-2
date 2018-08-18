import * as fs from 'fs';
import {Home} from './perseptron';

interface IInput {
  name: string;
}

console.log('Hello');
const Vikhino = new Home();
const inputdata = fs.readFileSync('./data/input.json', 'utf8');
const input: IInput = JSON.parse(inputdata);

Vikhino.setName(`Oleg love ${input.name}`);

const result: IInput = {
  name: Vikhino.getName(),
};

fs.writeFileSync('./data/output.json', JSON.stringify(result));
