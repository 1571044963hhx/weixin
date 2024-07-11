export const setstorage = (key, data) => {
  try {
    wx.setStorageSync(key, data)
  } catch (error) {
    console.error(`数据${key}保存失败`, error)
  }
}
/**
 * @description 用于封装异步存储在浏览器上的数据
 * @param {*} key 存储的键
 * @param {*} data 存储的值
 */
export const asyncsetstorage = (key, data) => {
  return new Promise((resolve) => {
    wx.setStorage({
      key,
      data,
      complete(res) {
        resolve(res)
      }
    })
  })
}
export const getstorage = (key) => {
  try {
    return wx.getStorageSync(key)
  } catch (error) {
    console.error(`数据${key}获取失败`, error)
  }
}
export const asyncgetstorage = (key) => {
  return new Promise((resolve) => {
    wx.getStorage({
      key,
      complete(res) {
        resolve(res)
      }
    })
  })
}
export const removestorage = (key) => {
  try {
    wx.removeStorageSync(key)
  } catch (error) {
    console.error(`数据${key}移除失败`, error)
  }
}
export const asyncremovestorage = (key) => {
  return new Promise((resolve) => {
    wx.removeStorage({
      key,
      complete(res) {
        resolve(res)
      }
    })
  })
}
export const clearstorage = () => {
  try {
    wx.removeStorageSync()
  } catch (error) {
    console.error(`所有数据清除失败`, error)
  }
}
export const asyncclearstorage = () => {
  return new Promise((resolve) => {
    wx.removeStorage({
      complete(res) {
        resolve(res)
      }
    })
  })
}
