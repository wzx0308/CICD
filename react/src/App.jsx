import React, { Component } from 'react'
import './App.css'
import axios from 'axios'

export default class App extends Component {
  state={
    options:[
      {
        title:"p标签是干什么用的",
        option:['实现换行的',"显示图片的","制作按钮的","实现分段的"],
        answer:0
      },
      {
        title:"button标签是干什么用的",
        option:["实现分段的",'实现换行的',"显示图片的","制作按钮的"],
        answer:3
      },
      {
        title:"img标签是干什么用的",
        option:["制作按钮的","实现分段的",'实现换行的',"显示图片的",],
        answer:3
      }
    ],
    isshow:sessionStorage.getItem('token')?true:false,
    err:'',
    curIndex:0,
    time:0,
    answers:{},
    isSubmit:false,
    userIndex:-1,
    zhengque:0
  }
  refInput=React.createRef()
  login= async()=>{
    const res = await axios.post('/api/login',
      {name:this.refInput.current.value})
      console.log(res.data)
      if(res.data.code==200){
        sessionStorage.setItem('token',res.data.token)
        sessionStorage.setItem('name',this.refInput.current.value)
        this.setState({
          isshow:true
        })
      }else{
        this.setState({err:res.data.msg})
      }
    // this.setState({
    //   isshow:true
    // })
  }
  handelSubmit=()=>{
    this.setState({
      time:3,
      isSubmit:true,
      userIndex:-1,
      zhengque:this.state.zhengque+1
    })
    const timer= setInterval(()=>{
      this.setState((prevState)=>{
        return {
          time:prevState.time-1}
      })
      if(this.state.time==0){
        clearInterval(timer)
        this.setState({
          isSubmit:false,
          curIndex:this.state.curIndex+1,
          time:3
        })
      }
    },1000)
    const {answers,options,userIndex}=this.state
    const data={
      isTrue:userIndex==options[this.state.curIndex].answer
    }
    this.setState({
      answers:{...answers,[this.state.curIndex]:data}
    })

  }
  chongxing=()=>{
    this.setState({
      curIndex:0,
      answers:{},
      zhengque:0
    })
  }
  tui=()=>{
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('name')
    this.setState({
      isshow:false
    })

  }
  
  render() {
    const zhengque = Object.values(this.state.answers).filter(a => a.isTrue).length
    const cuowu = Object.values(this.state.answers).filter(a => !a.isTrue).length
    return (
      <div className='box'>
        <div className='left'>
          {this.state.isshow?(
            <div>
              <h1>在线答题系统</h1>
              <p>当前用户:{sessionStorage.getItem('name')}</p>
              <button onClick={()=>this.tui()}>退出答题</button>
            </div>
          ):(
            <div>
            <p>用户名：<input type="text" placeholder='请输入用户名' ref={this.refInput}/>
          <span>{this.state.err}</span></p>
          <button onClick={()=>this.login()}>登录</button>
          </div>
          )}
          
        </div>
        <div className='right'>
          {this.state.isshow?null:(
            <div className='zhe'></div>
          )}
          {this.state.options.length>this.state.curIndex?(
            <div>
              <h3>答题系统</h3>
          <h1>
            <p>{this.state.options[this.state.curIndex].title}</p>
          </h1>
          <ul>
            {this.state.options[this.state.curIndex].option.map((item,index)=>{
              return (
                <li key={item}>
                  <input type="radio" name='answer' checked={this.state.userIndex==index} onChange={()=>this.setState({userIndex:index})}/>
                  {item}
                </li>
              )
            })}
          </ul>
          {this.state.isSubmit?(
            <div>
              <button disabled>{this.state.answers[this.state.curIndex].isTrue?"回答正确":"回答错误"}</button>
            <p>倒计时:{this.state.time}自动进入下一题</p>
            </div>
          ):(
            <button onClick={()=>this.handelSubmit()}>提交答案</button>
          )}
            <p>
              共有{this.state.options.length}道题，
              答对{cuowu}道，
              答错{this.state.zhengque}道
            </p>
            </div>
          ):
          (
            <div>
                <p>答题结束</p>
                <button onClick={()=>this.chongxing()}>重新开始</button>
              </div>
          )}
          
        </div>
      </div>
    )
  }
}
