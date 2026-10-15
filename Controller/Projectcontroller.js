const Projectmodel = require("../Model/Projectmodel")


async function getProject(req, res) {

    try {
        // Lấy giá trị boardId từ URL
        
        const WorkspacesId = req.query.workspacesId;
     
        // Gọi xuống Model, đưa boardId vào, nhờ Model đi hỏi database
       
        const project = await Projectmodel.getProjecByworks(WorkspacesId);
        // Trả kết quả (mảng các task) về cho trình duyệt, dạng JSON
        // -> đi ngược lên Router -> lên trình duyệt, hiện lên màn hình
        res.json(project)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function createProject(req, res) {
    try {
        // lấy giá trị 
        const { id, name,workspacesId} = req.body;
        // gửi xuống model 
        await Projectmodel.creatproject(id, name, workspacesId);
        
        res.status(201).json({ message: "Tạo task thành công" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}
async function updateproject(req, res) {
    try {
        // lấy giá trị 
        const { name,id} = req.body;
        // gửi xuống model 
        if (!id) {
            return res.status(400).json({ error: "Thiếu id task" });
        }
       const affected =  await Projectmodel.updateproject(name,id);
       
        if (affected === 0) {
            return res.status(404).json({ message: "Không tìm thấy project để cập nhật" });
        }
        res.status(200).json({ message: "update thành công" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}
async function deleteproject(req, res) {
  try {
    const {id} = req.params;
   
    const affected = await Projectmodel.deleteproject(id);
     
    if (affected === 0) {
      return res.status(404).json({ message: "Không tìm thấy project để xóa" });
    }
    res.status(200).json({ message: "xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: err.message })
  }
}
module.exports ={
getProject,
createProject,
updateproject,
deleteproject
}