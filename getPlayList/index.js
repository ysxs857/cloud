// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'ysxs-2gtnjser07cdcf97'
})

const db = cloud.database()

const palylistCollection = db.collection('playlist')

const axios = require('axios')

const URL = 'https://ysxs.cn.utools.club/top/playlist/highquality?before=1503639064232&limit=20'

exports.main = async (event, context) => {
  const{
    data
  } = await axios.get(URL)
  console.log('######' + JSON.stringify(data))

  if (data.code >= 1000){
    console.log(data.msg)
    return 0
  }
  const playlist = data.playlists

  const newData = []

  for (let i = 0, len = playlist.length; i < len; i++){
    let pl = playlist[i]
    pl.createTime = db.serverDate()
    newData.push(pl)
  }
  console.log(newData)
  if (newData.length > 0){
    await palylistCollection.add({
      data: [...newData]
    }).then((res) =>{
      console.log('插入成功')
    }).catch((err) => {
      console.log(err)
      console.error('插入失败')
    })
  }
  return newData.length
}