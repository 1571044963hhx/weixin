//使用该behavior目的是获取token，有点多次一举了，可以直接使用ComponentWithStore
import { BehaviorWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '../store/userstore'

export const userBehavior = BehaviorWithStore({
  storeBindings: {
    store: userStore,
    fields: ['token']
  }
})
