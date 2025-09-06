"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/split-dto.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const filePath = './src/api/generated/data-contracts.ts';
const content = fs_1.default.readFileSync(filePath, 'utf-8');
const regex = /export interface (\w+) {([\s\S]*?)}/g;
let match;
while ((match = regex.exec(content)) !== null) {
    const [full, name, body] = match;
    const dtoContent = `export interface ${name} {${body}}\n`;
    fs_1.default.writeFileSync(path_1.default.join('./src/api/generated/models', `${name}.ts`), dtoContent);
}
