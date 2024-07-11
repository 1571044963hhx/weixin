import QQMapWX from '@/libs/qqmap-wx-jssdk'
import Schema from 'async-validator'
import { toast } from '@/utils/extendApi'
import { reqAddAddress, reqGetAddressInfo, reqGetAddressList, reqUpdateAddress } from '@/API/address'

Page({
  // 页面的初始数据
  data: {
    name: '', //收货人
    phone: '', //手机号码
    provinceName: '', //省
    provinceCode: '', //省编码
    cityName: '', //市
    cityCode: '', //市编码
    districtName: '', //区
    districtCode: '', //市编码
    address: '', //详细地址
    fullAddress: '', //完整地址
    isDefault: 0 //0是默认不展示
  },
  // 保存收货地址
  async saveAddrssForm(event) {
    const { provinceName, cityName, districtName, address } = this.data
    const fullAddress = provinceName + cityName + districtName + address
    const isDefault = this.data.isDefault ? 1 : 0
    const params = {
      ...this.data,
      fullAddress,
      isDefault
    }
    this.setData({
      ...params
    })
    // 调用方法对最终的请求参数进行验证
    const { valid } = await this.valiator(params)
    // 如果验证没有通过，不继续执行后续的逻辑
    if (!valid) return
    const res = this.ID?await reqUpdateAddress(params):await reqAddAddress(params)
    if (res.code === 200) {
      wx.navigateBack()
      toast({
        title: this.ID?'修改收货地址成功':'新增收货地址成功'
      })
    } else {
      toast({
        title:this.ID?'修改收货地址失败':'新增收货地址失败'
      })
    }
  },
  // 1. 收货人不能为空，且不能输入特殊字符
  // 2. 手机号不能为空，且输入的手机号必须合法
  // 3. 省市区不能为空
  // 4. 详细地址不能为空
  valiator(params) {
    // 验证收货人，是否只包含大小写字母、数字和中文字符
    const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'
    // 验证手机号
    const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'
    const rules = {
      name: [
        { required: true, message: '请输入收货人姓名' },
        { pattern: nameRegExp, message: '收货人姓名不合法' }
      ],
      phone: [
        { required: true, message: '请输入收货人电话' },
        { pattern: phoneReg, message: '收货人电话不合法' }
      ],
      provinceName: { required: true, message: '请输入收货人所在地区' },
      address: { required: true, message: '请输入收货人详细地址' }
    }
    const newValiator = new Schema(rules)
    //返回一个promise对象
    return new Promise((resolve) => {
      newValiator.validate(params, (errors, fields) => {
        if (errors) {
          toast({
            title: errors[0].message
          })
          resolve({ valid: false })
        } else {
          resolve({ valid: true })
        }
      })
    })
  },

  // 省市区选择
  onAddressChange(event) {
    const { value } = event.detail
    const { code } = event.detail
    this.setData({
      provinceName: value[0],
      cityName: value[1],
      districtName: value[2],
      provinceCode: code[0],
      cityCode: code[1],
      districtCode: code[2]
    })
  },
  async chooseLocation() {
    const res = await wx.chooseLocation()
    const { latitude, longitude, name } = res
    console.log(res)
    this.qqmapsdk.reverseGeocoder({
      location: {
        latitude,
        longitude
      },
      success: (res) => {
        const { adcode } = res.result.ad_info
        const { province, city, district, street, street_number } = res.result.address_component
        console.log(res)
        console.log(province, city, district)
        this.setData({
          //省市区
          provinceName: province,
          cityName: city,
          districtName: district,
          //省市区编码
          provinceCode: adcode.replace(adcode.substring(2, 6), '0000'),
          cityCode: adcode.replace(adcode.substring(4, 6), '00'),
          districtCode: district && adcode,

          address: street + street_number + name,
          fullAddress: res.result.address + name
        })
      },
      fail: (reason) => {
        console.log(reason)
      }
    })
  },
  async onLoad(option) {
    this.qqmapsdk = new QQMapWX({
      key: 'HF7BZ-KVERW-XYFR4-YPD4G-7NQWV-5PBL7'
    })
    this.ID = option.id
    if(this.ID){
      wx.setNavigationBarTitle({title:"修改收货地址"})
      const res = await reqGetAddressInfo(option.id)
      this.setData(res.data)
    }
  }
})
