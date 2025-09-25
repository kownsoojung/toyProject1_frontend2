# SiteCodeControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getList**](#getlist) | **GET** /api/sitecode/getList | |

# **getList**
> Array<SiteCodeDTO> getList()


### Example

```typescript
import {
    SiteCodeControllerApi,
    Configuration,
    SiteCodeSearchDTO
} from 'my-api-client';

const configuration = new Configuration();
const apiInstance = new SiteCodeControllerApi(configuration);

let arg2: SiteCodeSearchDTO; // (default to undefined)

const { status, data } = await apiInstance.getList(
    arg2
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **arg2** | **SiteCodeSearchDTO** |  | defaults to undefined|


### Return type

**Array<SiteCodeDTO>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

