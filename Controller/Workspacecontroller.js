const Workspacemodel = require('../Model/Workspacemodel')

async function getWorkspaces(req, res) {
  try {
    const workspaces = await Workspacemodel.getAllWorkspaces();
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function createWork(req, res) {
  try {
    const { id, name } = req.body;
    await Workspacemodel.createWorkspaces(id, name);
    res.status(201).json({ message: "Tạo không gian thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
async function updateWork(req, res) {
  try {
    const { name, id } = req.body;
    const affected = await Workspacemodel.updateWorkspaces(name, id);
     
    if (affected === 0) {
      return res.status(404).json({ message: "Không tìm thấy Workspaces để cập nhật" });
    }
    res.status(200).json({ message: "update thành công" });
  } catch (error) {
    res.status(500).json({ error: err.message })
  }
}
async function deleteWork(req, res) {
  try {
    const {id} = req.params;
   
    const affected = await Workspacemodel.deleteWorkspaces(id);
     
    if (affected === 0) {
      return res.status(404).json({ message: "Không tìm thấy Workspaces để xóa" });
    }
    res.status(200).json({ message: "xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: err.message })
  }
}
module.exports = { getWorkspaces, createWork,updateWork,deleteWork };