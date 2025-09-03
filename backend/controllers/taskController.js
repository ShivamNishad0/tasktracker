import Task from "../middleware/taskModel.js";

//create a task


const normalizeCompleted = (val) => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') return ['true','yes','1','completed'].includes(val.toLowerCase());
    if (typeof val === 'number') return val === 1;
    return false;
};

export async function createTask(req, res) {
    try {
        const { title, description, priority ,dueDate, completed } = req.body;
        const task = new Task({
            title,
            description,
            priority,
            dueDate,
            // completed:completed==='yes' || completed===true,
            completed: normalizeCompleted(completed),
            owner: req.user._id // Assuming req.user is set by auth middleware
        });
        const saved = await task.save();
        res.status(201).json({ success: true, task: saved });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }   
};

//get all tasks for a user

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id }).sort({createdAt: -1});
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


//get a single task by id

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//update a task by id

export const updateTask = async (req, res) => {
    try {
        const data = {...req.body};
        if (data.completed !== undefined) {
            data.completed = normalizeCompleted(data.completed);
        }
        // if (data.completed!==undefined) {
        //     data.completed = data.completed==='yes' || data.completed===true;
        // }
        const updated=await Task.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            data,
            { new: true, runValidators: true}
        );
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        
    }
    res.status(200).json({ success: true, task: updated });
            
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


//delete a task by id

export const deleteTask = async (req, res) => {
    try {
        const deleted = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!deleted) 
            return res.status(404).json({ success: false, message: 'Task not found' });
        res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


