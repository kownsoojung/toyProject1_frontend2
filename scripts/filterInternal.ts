import * as fs from "fs";
import * as path from "path";

// OpenAPI 원본 JSON
const RAW_JSON = path.join("scripts", "openapi.json");
// 필터링 후 JSON
const FILTERED_JSON = path.join("scripts", "openapi.filtered.json");

// 제거할 외부 API 패키지 이름 또는 path prefix
const EXCLUDE_PATH_PREFIXES = ["/skt"];   // 예: SKTApiController 관련 API 제거

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
//npm run gen:api:all
// 필터링된 JSON 저장
fs.writeFileSync(FILTERED_JSON, JSON.stringify(spec, null, 2));
console.log("Internal + 외부 APIs removed. Filtered JSON ready.");
