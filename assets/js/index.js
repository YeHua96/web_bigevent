$(function() {
    getUserInfo();



    var layer = layui.layer;


    //点击实现按键退出
    $('#btnLogout').on('click', function() {
        console.log('ok')
        layer.confirm('确定退出登录？', { icon: 3, tutle: '提示' }, function(index) {
            //清楚本地存储的token
            localStorage.removeItem('token');
            //更新跳转到登录页面
            location.href = '/login.html'
                //关闭confirm询问框
            layer.close(index)
        })
    })

})

//获取用户的基本信息
function getUserInfo() {
    console.log(localStorage.getItem('token'))
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //header就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            //调用renderAvatar渲染用户头像
            renderAvatar(res.data);
            console.log(res)
        },
        //无论成功还是失败，最终都调用
        // complete: function(res) {
        //     //在complete回调函数中，可以使用res.response.JSON拿到服务器响应回来的数据
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //强制清空token
        //         localStorage.removeItem('token');

        //         //强制跳转到登录页面
        //         location.href = '/login.html';
        //     }
        // }

    })

}

function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    //渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show;
        $('text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        console.log(first)
        $('.text-avatar').html(first).show();
    }
}