/**
 * NXApi 전역 타입 선언
 * nxcapi_web.js가 로드되면 window.NXApi가 자동으로 설정됩니다.
 */

declare global {
  interface Window {
    /**
     * NXApi 인스턴스
     * CTI 통신을 위한 WebSocket 기반 API
     */
    NXApi: {
      /**
       * WebSocket 연결
       * @param options 연결 옵션
       * @returns Promise<{ result: number; description?: string }>
       */
      connect: (options: {
        url?: string[];
        userId?: string;
        dn?: string;
        password?: string;
        [key: string]: any;
      }) => Promise<{ result: number; description?: string }>;

      /**
       * WebSocket 연결 해제
       * @returns Promise<{ result: number; description?: string }>
       */
      disconnect: () => Promise<{ result: number; description?: string }>;

     /**
     * 명령 전송
     * @param cmd 명령 객체
     * @returns Promise<any>
     */
      command: (cmd: {
        cmd: string;
        [key: string]: any;
      }) => Promise<any>;

            
      /**
       * 명령 전송
       * @param cmd 명령 객체
       * @returns Promise<any>
       */
      send: (cmd: {
        cmd: string;
        [key: string]: any;
      }) => Promise<any>;

      /**
       * 이벤트 핸들러 설정
       * @param callback 이벤트 콜백 함수
       */
      setEvent: (callback: (event: any) => void) => void;

      /**
       * DN 상태 조회
       * @param options 조회 옵션
       * @returns Promise<any>
       */
      queryDnStatus?: (options?: any) => Promise<any>;

      /**
       * 에이전트 상태 설정
       * @param options 상태 설정 옵션
       * @returns Promise<any>
       */
      setFeatureAgentStatus?: (options: {
        mode?: number;
        id?: string;
        part?: string;
        group?: string;
        reasoncode?: number;
        workmode?: number;
        [key: string]: any;
      }) => Promise<any>;

      [key: string]: any;
    };

    /**
     * NXError 상수 객체
     */
    NXError?: {
      [key: string]: number;
    };

    /**
     * NXEvent 상수 객체
     */
    NXEvent?: {
      [key: string]: number;
    };

    /**
     * cubeversion 전역 변수 (Cube 버전)
     */
    cubeversion?: number;
  }
  
  const NXApi: Window['NXApi'];

  /**
   * NXError 전역 상수
   */
  const NXError: Window['NXError'];

  /**
   * NXEvent 전역 상수
   */
  const NXEvent: Window['NXEvent'];

  /**
   * cubeversion 전역 변수
   */
  const cubeversion: number;
}

export {};

