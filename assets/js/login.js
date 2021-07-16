$(function() {
    //点击“去注册账号”的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show()
    })

    //点击去登录的链接
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    //通过form.verify（）函数自定义校验规则
    form.verify({
        //自定义一个叫做pwd校验规则
        pwd: [/^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        //校验两次密码是否一致的规则
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    //监听注册表单的提交事件
    $('#form-reg').on('submit', function(e) {
        e.preventDefault();
        $.post('/api/reguser', {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val()
            }, function(res) {
                if (resizeBy.status !== 0) {
                    // return console.log(res.message)
                    return layer.msg(res.message);
                } else {
                    // console.log('注册成功')
                    layer.msg('注册成功，请登录');
                    $('#link_log'), click();
                }
            })
            // console.log('ok')
    })



    //监听登录表单的提交事件
    $('#form-login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //快速获取表单数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                } else {
                    layer.msg('登陆成功');
                    //将登录成功得到的token字符串，保存到localStorage中
                    localStorage.setItem('token', res.token);
                    console.log(res);
                    //跳转到后台主页面
                    location.href = '/index.html'
                }
            }
        })
    })
})