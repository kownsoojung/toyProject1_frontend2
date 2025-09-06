// scripts/split-dto.ts
import fs from 'fs';
import path from 'path';

const filePath = './src/api/generated/data-contracts.ts';
const content = fs.readFileSync(filePath, 'utf-8');

const regex = /export interface (\w+) {([\s\S]*?)}/g;
let match;

while ((match = regex.exec(content)) !== null) {
    const [full, name, body] = match;
    const dtoContent = `export interface ${name} {${body}}\n`;
    fs.writeFileSync(path.join('./src/api/generated/models', `${name}.ts`), dtoContent);
}
