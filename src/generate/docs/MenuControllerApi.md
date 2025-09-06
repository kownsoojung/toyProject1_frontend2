# MenuControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getList**](#getlist) | **GET** /api/menu/getList | |

# **getList**
> Array<MenuAgentDTO> getList()


### Example

```typescript
import {
    MenuControllerApi,
    Configuration
} from 'my-api-client';

const configuration = new Configuration();
const apiInstance = new MenuControllerApi(configuration);

const { status, data } = await apiInstance.getList();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<MenuAgentDTO>**

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

