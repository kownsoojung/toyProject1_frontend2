# useApiQuery vs useAutoQuery 사용 가이드

## 📚 개요

API 조회를 위한 두 가지 훅:
- **`useApiQuery`**: 수동 조회 (버튼 클릭 시) 👈 **일반 조회**
- **`useAutoQuery`**: 자동 조회 (컴포넌트 마운트 시)

---

## 🔵 useApiQuery - 수동 조회 (일반 조회)

### **언제 사용?**
- ✅ 버튼 클릭 시 조회
- ✅ 검색 버튼 클릭 시
- ✅ 특정 조건 만족 시에만 조회
- ✅ 사용자 액션이 필요한 경우

### **기본 사용법**

```tsx
import { useApiQuery } from '@/hooks/useAutoQuery';

function UserSearch() {
  const [searchText, setSearchText] = useState('');
  
  const { data, refetch, isLoading } = useApiQuery({
    queryKey: ['users', searchText],
    url: '/api/users/search',
    params: { keyword: searchText },
    options: { enabled: false }  // 자동 조회 안 함
  });

  const handleSearch = () => {
    refetch();  // 버튼 클릭 시 조회
  };

  return (
    <div>
      <input value={searchText} onChange={(e) => setSearchText(e.target.value)} />
      <button onClick={handleSearch}>검색</button>
      {isLoading && <span>로딩중...</span>}
      {data && <div>{data.length}건 조회됨</div>}
    </div>
  );
}
```

### **조건부 조회**

```tsx
const [userId, setUserId] = useState<number | null>(null);

const { data, refetch } = useApiQuery({
  queryKey: ['userDetail', userId],
  url: `/api/users/${userId}`,
  options: { 
    enabled: false  // 수동 조회
  }
});

// userId가 설정되면 자동 조회하고 싶다면
useEffect(() => {
  if (userId) {
    refetch();
  }
}, [userId, refetch]);
```

---

## 🟢 useAutoQuery - 자동 조회

### **언제 사용?**
- ✅ 페이지 로드 시 데이터 필요
- ✅ 코드 목록 (공통 코드)
- ✅ 초기 데이터 로딩
- ✅ 실시간 데이터 갱신

### **기본 사용법**

```tsx
import { useAutoQuery } from '@/hooks/useAutoQuery';

function UserList() {
  // 컴포넌트 마운트 시 자동으로 조회
  const { data, isLoading, error } = useAutoQuery({
    queryKey: 'users',
    url: '/api/users',
  });

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러: {error.message}</div>;

  return (
    <ul>
      {data?.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

### **파라미터와 함께**

```tsx
function CodeList({ codeType }: { codeType: string }) {
  const { data } = useAutoQuery({
    queryKey: ['codes', codeType],  // codeType 변경 시 자동 재조회
    url: '/api/codes',
    params: { codeType }
  });

  return <select>...</select>;
}
```

### **커스텀 옵션**

```tsx
const { data } = useAutoQuery({
  queryKey: 'dashboard',
  url: '/api/dashboard',
  options: {
    refetchInterval: 30000,  // 30초마다 자동 갱신
    staleTime: 10000,        // 10초 동안 캐시 사용
  }
});
```

---

## 📊 비교표

| 기능 | useApiQuery | useAutoQuery |
|------|-------------|--------------|
| **기본 동작** | 수동 조회 | 자동 조회 |
| **enabled** | `false` | `true` |
| **주 사용처** | 검색, 버튼 클릭 | 초기 데이터, 코드 |
| **refetch** | 필수 사용 | 선택 사용 |
| **캐싱** | 설정 가능 | 항상 최신 (기본) |

---

## 🎯 실전 예제

### **예제 1: 검색 기능**

```tsx
function ProductSearch() {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    keyword: ''
  });

  // 수동 조회 - 검색 버튼 클릭 시
  const { data, refetch, isLoading } = useApiQuery({
    queryKey: ['products', filters],
    url: '/api/products/search',
    params: filters,
  });

  return (
    <div>
      <input 
        placeholder="검색어" 
        onChange={(e) => setFilters({...filters, keyword: e.target.value})}
      />
      <button onClick={() => refetch()}>검색</button>
      
      {isLoading ? <Spinner /> : <ProductList products={data} />}
    </div>
  );
}
```

### **예제 2: 코드 목록 (자동 조회)**

```tsx
import { useAutoQuery } from '@/hooks/useAutoQuery';

// 커스텀 Hook으로 만들기
export function useCode(codeType: string) {
  return useAutoQuery({
    queryKey: ['codes', codeType],
    url: '/api/common/codes',
    params: { codeType }
  });
}

// 사용
function UserForm() {
  const { data: genderCodes } = useCode('GENDER');
  const { data: countryCodes } = useCode('COUNTRY');

  return (
    <form>
      <select>
        {genderCodes?.map(code => (
          <option key={code.value} value={code.value}>
            {code.label}
          </option>
        ))}
      </select>
    </form>
  );
}
```

### **예제 3: 상세 조회 (조건부)**

```tsx
function UserDetail({ userId }: { userId?: number }) {
  // userId가 있을 때만 조회
  const { data, isLoading } = useAutoQuery({
    queryKey: ['user', userId],
    url: `/api/users/${userId}`,
    options: {
      enabled: !!userId,  // userId가 있을 때만 자동 조회
    }
  });

  if (!userId) return <div>사용자를 선택하세요</div>;
  if (isLoading) return <Spinner />;
  
  return <div>{data?.name}</div>;
}
```

### **예제 4: 그리드 조회 (수동 + 새로고침)**

```tsx
function DataGrid() {
  const gridRef = useRef<AFormGridHandle>(null);
  const [params, setParams] = useState({ page: 1, pageSize: 10 });

  const { data, refetch, isLoading } = useApiQuery({
    queryKey: ['gridData', params],
    url: '/api/data',
    params,
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleSearch = (searchParams: any) => {
    setParams({ ...params, ...searchParams });
    refetch();
  };

  return (
    <div>
      <SearchForm onSearch={handleSearch} />
      <button onClick={handleRefresh}>새로고침</button>
      <AFormGrid data={data} loading={isLoading} />
    </div>
  );
}
```

---

## 💡 팁

### **1. queryKey 설계**
```tsx
// ✅ 좋은 예
['users']                    // 전체 목록
['users', userId]            // 특정 사용자
['users', { status: 'active' }]  // 필터링된 목록

// ❌ 나쁜 예
['getUserList']              // 동사 사용
['data']                     // 너무 일반적
```

### **2. enabled 활용**
```tsx
// 조건부 자동 조회
const { data } = useAutoQuery({
  queryKey: 'data',
  url: '/api/data',
  options: {
    enabled: !!userId && isAuthenticated  // 조건 만족 시만 조회
  }
});
```

### **3. 에러 처리**
```tsx
const { data, error, isError } = useAutoQuery({
  queryKey: 'data',
  url: '/api/data',
  options: {
    retry: 3,  // 3번 재시도
    onError: (error) => {
      console.error('조회 실패:', error);
      toast.error('데이터 로딩 실패');
    }
  }
});
```

---

## 🔄 마이그레이션

기존 `UseAutoQuery` 사용 코드:

```tsx
// Before
UseAutoQuery({ 
  isAuto: true,  // 자동 조회
  queryKey: 'codes',
  url: '/api/codes'
});

// After
useAutoQuery({
  queryKey: 'codes',
  url: '/api/codes'
});
```

```tsx
// Before
UseAutoQuery({ 
  isAuto: false,  // 수동 조회
  queryKey: 'users',
  url: '/api/users'
});

// After
useApiQuery({
  queryKey: 'users',
  url: '/api/users'
});
```

