$(function() {

    initArtCateList();


    //获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res)

                var htmlStr = template('tpl-table', res);

                $('tbody').html(htmlStr);
            }
        })
    }

    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    //通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        console.log('ok');
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('新增分类失败！')
                } else {
                    initArtCateList();
                    layui.layer.msg('新增分类成功！');
                    //根据索引，关闭对应的弹出层
                    layui.layer.close(indexAdd);
                }

            }
        })
    })

    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function(e) {
        console.log('ok');
        indexEdit = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })


        var id = $(this).attr('data-id');
        //发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                console.log(res);
                layui.form.val('form-edit', res.data)
            }
        })
    })

    //通过代理的形式，为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新分类数据失败！')
                } else {
                    layui.layer.msg('更新分类数据成功！');
                    layui.layer.close(indexEdit);
                    initArtCateList();
                }
            }
        })
    })
    $('tbody').on('click', ".btn-delete", function() {

        var id = $(this).attr('data-id');
        console.log(id);
        layui.layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layui.layer.msg('删除分类失败！')
                    } else {
                        layui.layer.msg('删除分类成功！');
                        layui.layer.close(index);
                        initArtCateList();
                    }
                }
            })
        })
    })

})