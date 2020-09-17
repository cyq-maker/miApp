import React from 'react';
import { Link } from 'react-router-dom';
import './login.less';
import api from '../../api/index';

class Register extends React.Component {
    state = {
        name: '',
        phone: '',
        password: '',
        code: '',
        // 发送验证码按钮状态
        isRun: false,
        runTime: 30
    };
    render() {
        let { name, phone, password, code, isRun, runTime } = this.state;
        return <div className="loginBox">
            <div className="header">
                <span>小米有品账号注册</span>
            </div>
            <div className="main">
                <div className="container">
                    <div className="inpItem">
                        <input type="text" placeholder="用户名" value={name} onChange={ev => {
                            this.setState({ name: ev.target.value })
                        }} />
                    </div>
                    <div className="inpItem">
                        <input type="text" placeholder="手机号" value={phone} onChange={ev => {
                            this.setState({ phone: ev.target.value })
                        }} />
                    </div>
                    <div className="inpItem">
                        <input type="text" placeholder="短信验证码" value={code} onChange={ev => {
                            this.setState({ code: ev.target.value })
                        }} />
                        <a onClick={this.sendCode}>
                            {isRun ? `${runTime}s后重发` : '获取验证码'}
                        </a>
                    </div>

                    <div className="inpItem">
                        <input type="password" placeholder="密码" value={password} onChange={ev => {
                            this.setState({ password: ev.target.value })
                        }} />
                    </div>
                    <div className="other">
                        <Link to='/personal/login' className='register'>已有账号，登录</Link>

                    </div>
                    <div className="submitBtn">
                        <button className="submit" onClick={this.register}>立即注册</button>
                    </div>

                </div>
            </div>

        </div>
    }
    checkPhone = () => {
        return /^1\d{10}$/.test(this.state.phone);
    };
    checkName = () => {
        return /^\w{2,20}$/.test(this.state.name);
    };
    checkCode = () => {
        return /^\d{6}$/.test(this.state.code);
    };
    checkPassword = () => {
        return /^\w{6,16}$/.test(this.state.password);
    };
    // 发送验证码
    sendCode = async () => {
        let { runTime } = this.state;
        if (!this.checkPhone) {
            window.alert('必须保证手机号码不为空或者格式正确');
            return;
        }
        let data = await api.personal.phone(this.state.phone);
        if (parseInt(data.code) === 0) {
            window.alert('当前手机号已注册，请登录或者找回密码');
            return;
        }
        data = await api.personal.registerCode(this.state.phone);
        if (parseInt(data.code) !== 0) {
            window.alert('账号已注册');
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
    // 注册
    register = async () => {
        if (!this.checkName()) {
            window.alert('用户名必须是2-20位');
            return;
        }
        if (!this.checkPhone()) {
            window.alert('手机号格式错误');
            return;
        }
        if (!this.checkCode()) {
            window.alert('请输入有效验证码');
            return;
        }
        if (!this.checkPassword()) {
            window.alert('请输入6-16位数字，下划线，字母的密码');
            return;
        }

        let data = await api.personal.checkCode(this.state.phone, this.state.code);
        if (parseInt(data.code) !== 0) {
            window.alert('验证码错误，请输入有效验证码');
            return;
        }
        data = await api.personal.register(this.state.name, this.state.phone, this.state.password);
        if (parseInt(data.code) !== 0) {
            window.alert('注册失败，请稍后重试');
            return;
        }
        window.alert('注册成功，请登录', {
            handled: type => {
                this.props.history.push('/personal/login');
            }
        });

    }
}
export default Register;