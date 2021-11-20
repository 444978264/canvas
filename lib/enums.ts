export enum STAGE_STATUS {
  LOADING, // 加载资源
  PAUSED, // 暂停
  PLAY, // 播放
  TRANSITION, // 转场
}

export enum Events {
  FRAME,
  CLICK,
  SWITCH_SCENE,
  FIRST_FRAME,
  LOADING,
  Capture,
  Bubbling,
}
