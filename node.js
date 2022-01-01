const express = require("express")
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const ejs = require("ejs")
mongoose.connect('mongodb://172.21.2.236:27017/190110910621')
const schema = {
    username:String,
    password:String,
    sex:String,
    age:Number,
    class:String
}
const mydata = mongoose.model('users', schema)

app.use('/',express.static('public'))
app.get("/toLogin",(req,res)=>{
    const filePath = path.resolve(__dirname,"./public/login.html")
    console.log("跳转到管理员登录界面:",filePath)
    res.sendFile(filePath)
})
app.get("/toLogin1",(req,res)=>{
    const filePath = path.resolve(__dirname,"./public/login1.html")
    console.log("跳转到用户登录界面:",filePath)
    res.sendFile(filePath)
})
app.get("/toRegister",(req,res)=>{
    const filePath = path.resolve(__dirname,"./public/register.html")
    console.log("跳转到用户注册界面:",filePath)
    res.sendFile(filePath)
})
app.get("/domLogin",(req,res)=>{
    // 获取账号
    console.log(req.query);
    const {username,password}=req.query
    // 非空验证
    if(!username || !password){
        res.send("账号密码不能为空!")
    }
    // 账号密码验证(管理员只能用pxc和123456登录)
    else if(username != "pxc"){
        res.send("账号错误!")
    }
    else if(password != "123456"){
        res.send("密码错误!")
    }
    // 登录处理
    else{
        const filePath = path.resolve(__dirname,"./public/managerindex.html")
        console.log("跳转到主页:",filePath)
        res.sendFile(filePath)
    }
})
app.get("/doRegister",(req,res)=>{
    // 获取账号
    console.log(req.query);
    const username = req.query.username
    const password = req.query.password
    const sex = req.query.sex
    const age = req.query.age
    const reg = /^[a-z_]{1,10}$/
    // 非空验证
    if(!username || !password){
        console.log(username)
        console.log(password)
        res.send("账号密码不能为空!")
        res.end()
    }
    // 正则判断
    else if(!reg.test(username)){
        res.send("账号校验不通过!")
    }
    // 判断是否存在
    else{
        mydata.findOne({username: username},function(err, data){
            if(data){
                res.send('用户名已被注册')
            }else{
                const u = new mydata({ username:username,password:password,sex:sex,age:age})
                u.save()
                console.log('注册成功')
                const filePath = path.resolve(__dirname,"./public/login1.html")
                console.log("跳转到用户登录界面:",filePath)
                res.sendFile(filePath)
            }
        })
    }
})
app.get("/douLogin",(req,res)=>{
    // 获取账号
    console.log(req.query);
    const username = req.query.username
    const password = req.query.password
    mydata.findOne({username: username,password: password},function(err, data){
        if(data){
            console.log('登录成功!')
            const filePath = path.resolve(__dirname,"./public/userindex.html")
            console.log("跳转到用户主页:",filePath)
            res.sendFile(filePath)
        }else{
            res.send('账号或密码错误!')
        }
    })
})
app.get("/add",(req,res)=>{
    console.log(req.query)
    const username = req.query.username
    const lession = req.query.class
    mydata.findOne({username: username},function(err, data){
        if(data){
            mydata.update({'username':username},{$set:{'class':lession}})
            res.send("选课成功！")
        }else{
            res.send("账户错误！")
        }
    })
})
app.get("/show",(req,res)=>{
    console.log(req.query)
    const username = req.query.username
    mydata.findOne({username: username},function(err, data){
        if(data){
            ejs.renderFile('result.html', {result:'姓名:'+data.username+"\r"+'性别:'+data.sex+"\n"+
        "年龄:"+data.age+"\n"+"课程:"+data.class}, function(err, str){
                if(err){console.log("File is error.")}
                else {
                res.setHeader('Content-Type', 'textml')
                res.end(str)
                }
            });

        }else{
            res.send("该学生不存在！")
        }
    })
})
app.get("/delete",(req,res)=>{
    console.log(req.query)
    const username = req.query.username
    mydata.findOne({username: username},function(err, data){
        if(data){
            mydata.remove({'username':username})
            res.send("删除成功！")
        }else{
            res.send("该学生不存在！")
        }
    })
})
app.listen(10621)

