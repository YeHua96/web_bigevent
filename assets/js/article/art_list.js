$(function() {


    var layer = layui.layer;
    var laypage = layui.laypage;

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);
        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + '-' + hh + ':' + mm + ':' + ss
    }

    //定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: '',
    };

    initTable();
    initCate();

    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                } else {

                    //使用模板引擎渲染页面的数据
                    console.log('list');
                    console.log(res);
                    var htmlstr = template('tpl-table', res);
                    $('tbody').html(htmlstr);
                    renderPage(res.total);
                }
            }
        })
    }

    //初始化文章分类列表
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取分类数据失败！')
                } else {
                    //调用模板引擎渲染分类的可选项
                    var htmlstr = template('tpl-cate', res);
                    $('[name=cate-id]').html(htmlstr);
                    //通知layui重新渲染表单区域的UI结构
                    layui.form.render();
                }
            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取表单中选项的值
        var cate_id = $('[name=cate-id]').val();
        var state = $('[name=state]').val();
        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        //根据最新的筛选条件，重新渲染表格的数据
        initTable();
    })


    //定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的ID
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            //分页发生切换的时候，触发JUMP回调
            jump: function(obj, first) {
                console.log(obj.curr);
                //把最新的页码值，复值到q这个查询参数对象中
                q.pagenum = obj.curr;
                //把最新的条目数赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit;


                //根据最新的q获取对应的数据列表，并渲染表格

                if (!first) { initTable(); }

            }
        })

    };

    //通过代理的形式，为删除按键绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {

        //获取按钮个数
        var len = $('.btn-delete').length;

        var id = $(this).attr('data-id');

        layui.layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layui.layer.msg('删除文章失败！')
                    } else {
                        layui.layer.msg('删除文章成功！');


                        //判断页码是否还有数据
                        if (len === 1) {
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        }
                        initTable();
                    }
                }
            })


            layui.layer.close(index);
        })

    })
})