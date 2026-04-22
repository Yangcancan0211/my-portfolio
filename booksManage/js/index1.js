//1.渲染图书列表(查)
const creator = `张三`  //假设当前用户为张三
//封装渲染函数 并获取图书列表
function getBooksList() {
    //1.1获取数据
     axios({
        url: 'http://hmajax.itheima.net/api/books',
        params: {
            creator
        }
     }).then(result => {
        console.log(result);
        const booklist = result.data.data
        console.log(booklist);
        //1.2渲染列表
      const htmlStr = booklist.map((item, index) => {
            return `<tr>
      <td>${index + 1}</td>
      <td>${item.bookname}</td>
      <td>${item.author}</td>
      <td>${item.publisher}</td>
      <td data-id=${item.id}>
        <span class="del">删除</span>
        <span class="edit">编辑</span>
      </td>
    </tr>`
        }).join('')
        console.log(htmlStr);
        document.querySelector('.list').innerHTML = htmlStr
     })
}
//页面加载完成后 获取并渲染图书列表
getBooksList()
//2.新增图书(增)
// 2.1新增图书的显示与隐藏 =>属性
// 2.2收集表单数据 并提交到服务器保存=> JS
// 2.3刷新图书列表


//2.1创建弹框对象
const addModalDom = document.querySelector('.add-modal')
const addModal = new bootstrap.Modal(addModalDom)
//保存按钮 点击 隐藏弹框
document.querySelector('.add-btn').addEventListener('click', ()=> {
  //2.2收集数据
  const addForm = document.querySelector('.add-form')
  const bookObj = serialize(addForm, { hash: true, empty: true })
  console.log(bookObj);
  //提交到服务器
  axios({
    url: 'http://hmajax.itheima.net/api/books',
    method: 'POST',
    data: {
      ...bookObj,
      creator
    }
  }).then(result => {
    console.log(result);
    //2.3刷新图书列表
    getBooksList()
    //重置表单
    addForm.reset()
    //隐藏弹框
    addModal.hide()
  })

})

//3.删除图书(删)
// 3.1 删除元素绑定点击事件->获取图书id
// 3.2 调用删除接口
// 3.3 刷新图书列表
document.querySelector('.list').addEventListener('click',  e => {
  //获取触发事件的目标元素
  console.log(e.target);
  if(e.target.classList.contains('del')) {
    console.log('删除元素');
    //获取图书id
    const theId = e.target.parentNode.dataset.id
    //调用删除接口
    axios({
      url: `http://hmajax.itheima.net/api/books/${theId}`,
      method: 'DELETE'
    }).then(result => {
      getBooksList()
    })
  }
})

//4.编辑图书(改)
// 弹框的显示与隐藏
//获取编辑的图书数据
//提交修改数据到服务器
const editDom = document.querySelector('.edit-modal')
const editModal = new bootstrap.Modal(editDom)
document.querySelector('.list').addEventListener('clickp', e => {
     //判断点击是否是编辑元素
     if(e.target.classList.contains('edit')) {
      const theId = e.target.parentNode.dataset.id
      axios({
        url: `http://hmajax.itheima.net/api/books/${theId}`,
      }).then(result => {
        const bookObj = result.data.data
        // document.querySelector('.edit-form .bookname').value = bookObj.bookname
        // document.querySelector('.edit-form .author').value = bookObj.author
        // 数据对象“属性”和标签“类名”一致
        // 遍历数据对象，使用属性去获取对应的标签，快速赋值
        const keys = Object.keys(bookObj) // ['id', 'bookname', 'author', 'publisher']
        keys.forEach(key => {
          document.querySelector(`.edit-form .${key}`).value = bookObj[key]
        })
      })
      editModal.show()
     }
})
//  隐藏弹框
document.querySelector('.edit-btn').addEventListener('click', () => {
  // 4.3 提交保存修改，并刷新列表
  const editForm = document.querySelector('.edit-form')
  const { id, bookname, author, publisher } = serialize(editForm, { hash: true, empty: true})
  // 保存正在编辑的图书id，隐藏起来：无需让用户修改
  // <input type="hidden" class="id" name="id" value="84783">
  axios({
    url: `http://hmajax.itheima.net/api/books/${id}`,
    method: 'PUT',
    data: {
      bookname,
      author,
      publisher,
      creator
    }
  }).then(() => {
    // 修改成功以后，重新获取并刷新列表
    getBooksList()

    // 隐藏弹框
    editModal.hide()
  })
})