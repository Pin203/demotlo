const Boabrmodel = require("../Model/Boabrmodel");


async function getBoabr(req, res) {

    try {
        // Lấy giá trị boardId từ URL
        
        const projectId = req.query.projectId;
        
        // Gọi xuống Model, đưa boardId vào, nhờ Model đi hỏi database
       
        const board = await Boabrmodel.getboardIdbuyProject(projectId);
        // Trả kết quả (mảng các task) về cho trình duyệt, dạng JSON
        // -> đi ngược lên Router -> lên trình duyệt, hiện lên màn hình
        res.json(board)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function createBoabr(req, res) {
    try {
        // lấy giá trị 
        const { id, name,projectId} = req.body;
        // gửi xuống model 
        await Boabrmodel.creatboabr(id, name, projectId);

        res.status(201).json({ message: "Tạo task thành công" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}
async function updateboabr(req, res) {
    try {
        // lấy giá trị 
        const { name,id} = req.body;
        // gửi xuống model 
      
       const affected =  await Boabrmodel.updateboabr(name,id);
       
        if (affected === 0) {
            return res.status(404).json({ message: "Không tìm thấy boabr để cập nhật" });
        }
        res.status(200).json({ message: "update thành công" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}
async function deleteboabr(req, res) {
  try {
    const {id} = req.params;
   
    const affected = await Boabrmodel.deleteboabr(id);
     
    if (affected === 0) {
      return res.status(404).json({ message: "Không tìm thấy boabr để xóa" });
    }
    res.status(200).json({ message: "xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: err.message })
  }
}
module.exports = {getBoabr,createBoabr,updateboabr,deleteboabr};