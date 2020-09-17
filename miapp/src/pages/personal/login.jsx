import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './login.less';
import api from '../../api';
import actions from '../../store/actions/index.js';


class Login extends React.Component {
    state = {
        type: 1,
        name: '',
        password: '',
        isRun: false,
        runTime: 30
    };
    render() {
        let { type, name, password, isRun, runTime } = this.state;
        return <div className="loginBox">
            <div className="header">
                <span>欢迎登录小米有品</span>
            </div>
            <div className="main">
                <div className="container">
                    <div className="inpItem">
                        <input type="text" placeholder="用户名或者手机号" value={name} onChange={ev => {
                            this.setState({ name: ev.target.value });
                        }} />
                    </div>
                    {
                        type === 1 ? <>
                            <div className="inpItem">
                                <input type="text" placeholder="短信验证码" value={password} onChange={ev => {
                                    this.setState({ password: ev.target.value });
                                }} />
                                <a className={isRun ? 'noClick' : ''} onClick={this.sendCode} >
                                    {isRun ? `${runTime}S后重新获取` : '获取验证码'}
                                </a>
                            </div>
                        </> : <>
                                <div className="inpItem">
                                    <input type="password" placeholder="密码" value={password} onChange={ev => {
                                        this.setState({ password: ev.target.value });
                                    }} />
                                </div>
                            </>
                    }

                    <div className="changeLogin" onClick={this.changeLogin}>
                        {type === 1 ? '密码登录' : '短信验证码登录'}
                    </div>
                    <div className="submitBtn">
                        <button className="submit" onClick={this.handleLogin}>登录</button>
                    </div>
                    <div className="other">
                        <Link to='/personal/register?noback' className='register'>立即注册</Link>
                        {
                            type === 1 ? <></> : <div className="forget" onClick={ev => {
                                this.setState({
                                    type: 1
                                });
                            }}>忘记密码</div>
                        }
                    </div>
                </div>


            </div>

        </div>
    }
    changeLogin = () => {
        let { type } = this.state;
        this.setState({
            type: type === 1 ? 2 : 1,
            name: '',
            password: ''
        });
    }
    handleLogin = async () => {
        let { name, password, type } = this.state;
        let data;
        if (type === 1) {
            if (!(/^1\d{10}$/.test(name))) {
                window.alert('手机号格式不正确');
                return;
            }
            if (!(/^\d{6}$/.test(password))) {
                window.alert('验证码不正确');
                return;
            }
            data = await api.personal.checkCode(name, password);
        } else {
            if (name.length === 0) {
                window.alert('账号不为空');
                return;
            }
            if (!(/^\w{6,16}$/.test(password))) {
                window.alert('密码格式不正确');
                return;
            }
            data = await api.personal.phone(name);
            if (parseInt(data.code) !== 0) {
                window.alert('账号未注册');
                return;
            }
            data = await api.personal.loginPOST(name, password, type);
        }

        if (parseInt(data.code) !== 0) {
            window.alert(type === 1 ? '验证码不正确' : '账号密码不匹配');
            return;
        }
        window.alert('登录成功');
        this.props.loginSuccess(data.data);
        const search = this.props.location.search;
        if (search && search.includes('noback')) {
            this.props.history.go(-1);
        } else {
            this.props.history.push('/personal');
        }

    }
    sendCode = async () => {
        let { name, isRun, runTime } = this.state;
        if (!(/^1\d{10}$/.test(name))) {
            window.alert('手机号格式不正确');
            return;
        }
        let data = await api.personal.phone(name);

        if (parseInt(data.code) !== 0) {
            window.alert('账号未注册');
            return;
        }
        data = await api.personal.loginCode(name);
        if (parseInt(data.code) !== 0) {
            window.alert('发送失败');
            return;
        }
        this.setState({ isRun: true });
        this.codeTimer = setInterval(() => {
            let time = this.state.runTime;
            time--;
            if (time === 0) {
                clearInterval(this.codeTimer);
                this.setState({ isRun: false, runTime: 30 });
                return;
            }
            this.setState({ runTime: time });
        }, 1000);
    }
}
export default connect(null, actions.personal)(Login);