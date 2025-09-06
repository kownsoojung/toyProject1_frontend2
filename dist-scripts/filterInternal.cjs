"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// OpenAPI 원본 JSON
const RAW_JSON = path.join("scripts", "openapi.json");
// 필터링 후 JSON
const FILTERED_JSON = path.join("scripts", "openapi.filtered.json");
// 제거할 외부 API 패키지 이름 또는 path prefix
const EXCLUDE_PATH_PREFIXES = ["/skt"]; // 예: SKTApiController 관련 API 제거
// OpenAPI JSON 읽기
const spec = JSON.parse(fs.readFileSync(RAW_JSON, "utf-8"));
// paths 순회
for (const apiPath in spec.paths) {
    // 외부 API 제거
    if (EXCLUDE_PATH_PREFIXES.some(prefix => apiPath.startsWith(prefix))) {
        delete spec.paths[apiPath];
        continue;
    }
    // x-internal=true 제거
    for (const method in spec.paths[apiPath]) {
        if (spec.paths[apiPath][method]["x-internal"] === true) {
            delete spec.paths[apiPath][method];
        }
    }
    // 만약 해당 path에 메서드가 하나도 남지 않았으면 path 자체 제거
    if (Object.keys(spec.paths[apiPath]).length === 0) {
        delete spec.paths[apiPath];
    }
}
// 필터링된 JSON 저장
fs.writeFileSync(FILTERED_JSON, JSON.stringify(spec, null, 2));
console.log("Internal + 외부 APIs removed. Filtered JSON ready.");
