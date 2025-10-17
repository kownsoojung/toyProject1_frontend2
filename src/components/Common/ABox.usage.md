# ABox 컴포넌트 사용법

## 📦 컴포넌트 종류

### 1. MainFormBox
전체 높이를 차지하는 메인 폼 컨테이너

```tsx
<MainFormBox>
  <FormHeader>헤더</FormHeader>
  <AutoBox>내용</AutoBox>
</MainFormBox>
```

### 2. AutoBox
남은 공간을 자동으로 채우는 Box (flex: 1)

```tsx
<AutoBox minHeight={300}>
  자동으로 늘어나는 영역
</AutoBox>
```

### 3. ABox
고정 높이 Box

```tsx
<ABox height={100} mb={2}>
  고정 높이 박스
</ABox>
```

---

## 🎯 RatioBox - 비율로 나누기

### **비율 사용 (1:2:3)**

```tsx
import { RatioBox } from '@/components/Common';

// 가로로 1:2:3 비율
<RatioBox ratios={[1, 2, 3]} direction="row" gap={2}>
  <Box sx={{ bgcolor: 'lightblue', p: 2 }}>1</Box>
  <Box sx={{ bgcolor: 'lightgreen', p: 2 }}>2</Box>
  <Box sx={{ bgcolor: 'lightyellow', p: 2 }}>3</Box>
</RatioBox>

// 세로로 2:1 비율
<RatioBox ratios={[2, 1]} direction="column" gap={2}>
  <Box sx={{ bgcolor: 'lightblue', p: 2 }}>상단 (2배)</Box>
  <Box sx={{ bgcolor: 'lightgreen', p: 2 }}>하단 (1배)</Box>
</RatioBox>
```

### **픽셀(px) 크기 사용**

```tsx
// 왼쪽 200px, 나머지 자동
<RatioBox sizes={['200px', 'auto']} direction="row" gap={2}>
  <Box sx={{ bgcolor: 'lightblue', p: 2 }}>고정 200px</Box>
  <Box sx={{ bgcolor: 'lightgreen', p: 2 }}>나머지 영역</Box>
</RatioBox>

// 왼쪽 300px, 가운데 자동, 오른쪽 200px
<RatioBox sizes={['300px', 'auto', '200px']} direction="row" gap={2}>
  <Box sx={{ bgcolor: 'lightblue', p: 2 }}>300px</Box>
  <Box sx={{ bgcolor: 'lightgreen', p: 2 }}>자동</Box>
  <Box sx={{ bgcolor: 'lightyellow', p: 2 }}>200px</Box>
</RatioBox>
```

### **퍼센트(%) 사용**

```tsx
<RatioBox sizes={['30%', '70%']} direction="row" gap={2}>
  <Box sx={{ bgcolor: 'lightblue', p: 2 }}>30%</Box>
  <Box sx={{ bgcolor: 'lightgreen', p: 2 }}>70%</Box>
</RatioBox>
```

---

## 🎨 FlexBox - 간단한 Flex 컨테이너

```tsx
import { FlexBox } from '@/components/Common';

// 가로 정렬
<FlexBox direction="row" gap={2}>
  <Button>버튼1</Button>
  <Button>버튼2</Button>
  <Button>버튼3</Button>
</FlexBox>

// 세로 정렬
<FlexBox direction="column" gap={1}>
  <TextField label="이름" />
  <TextField label="이메일" />
  <Button>제출</Button>
</FlexBox>
```

---

## 💡 실전 예제

### **대시보드 레이아웃 (좌측 메뉴 + 컨텐츠)**

```tsx
<MainFormBox>
  <RatioBox sizes={['250px', 'auto']} direction="row" gap={2}>
    {/* 좌측 메뉴 - 고정 250px */}
    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
      <Typography variant="h6">메뉴</Typography>
      <List>...</List>
    </Box>
    
    {/* 메인 컨텐츠 - 나머지 영역 */}
    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
      <Typography variant="h5">컨텐츠</Typography>
      <div>...</div>
    </Box>
  </RatioBox>
</MainFormBox>
```

### **폼 레이아웃 (라벨 + 입력)**

```tsx
<RatioBox ratios={[1, 3]} direction="row" gap={2}>
  <Typography sx={{ display: 'flex', alignItems: 'center' }}>
    이름:
  </Typography>
  <TextField fullWidth placeholder="이름을 입력하세요" />
</RatioBox>
```

### **3단 레이아웃**

```tsx
<RatioBox ratios={[1, 2, 1]} direction="row" gap={2}>
  {/* 좌측 사이드바 */}
  <Box sx={{ bgcolor: 'grey.100', p: 2 }}>
    사이드바
  </Box>
  
  {/* 메인 컨텐츠 (2배 크기) */}
  <Box sx={{ bgcolor: 'white', p: 2 }}>
    메인 컨텐츠
  </Box>
  
  {/* 우측 위젯 */}
  <Box sx={{ bgcolor: 'grey.100', p: 2 }}>
    위젯
  </Box>
</RatioBox>
```

### **상단 헤더 + 하단 컨텐츠**

```tsx
<MainFormBox>
  <RatioBox sizes={['80px', 'auto']} direction="column" gap={0}>
    {/* 헤더 - 고정 80px */}
    <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
      <Typography variant="h4">헤더</Typography>
    </Box>
    
    {/* 컨텐츠 - 나머지 영역 */}
    <Box sx={{ p: 2, overflow: 'auto' }}>
      <div>스크롤 가능한 컨텐츠...</div>
    </Box>
  </RatioBox>
</MainFormBox>
```

---

## 📋 Props 설명

### RatioBox Props

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `ratios` | `number[]` | - | 비율 배열 (예: [1, 2, 3]) |
| `sizes` | `(number\|string)[]` | - | 크기 배열 (예: ['200px', 'auto', '30%']) |
| `direction` | `'row' \| 'column'` | `'row'` | 방향 (가로/세로) |
| `gap` | `number \| string` | `2` | 간격 |
| `sxProps` | `SxProps` | - | 추가 스타일 |

**주의:** `sizes`와 `ratios` 중 하나만 사용하세요. `sizes`가 우선순위가 높습니다.

### FlexBox Props

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `direction` | `'row' \| 'column'` | `'row'` | 방향 |
| `gap` | `number \| string` | `2` | 간격 |
| `sxProps` | `SxProps` | - | 추가 스타일 |

---

## 🎯 팁

1. **gap 값**: Material-UI는 8px 단위로 간격을 조정합니다 (gap={2} = 16px)
2. **overflow**: 내용이 넘칠 때는 `overflow: 'auto'` 추가
3. **최소 크기**: 너무 작아지는 것을 방지하려면 `minWidth`, `minHeight` 사용
4. **중첩 사용**: RatioBox 안에 또 다른 RatioBox 사용 가능

```tsx
<RatioBox ratios={[1, 3]} direction="row" gap={2}>
  <Box>좌측</Box>
  <RatioBox ratios={[2, 1]} direction="column" gap={1}>
    <Box>상단</Box>
    <Box>하단</Box>
  </RatioBox>
</RatioBox>
```

