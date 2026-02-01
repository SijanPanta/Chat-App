export const getAllUsers = async (req, res) => {
  try {
    // TODO: Implement get all users logic
    res.status(200).json({ message: "Get all users" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement get user by id logic
    res.status(200).json({ message: `Get user ${id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {name,age}=req.body;
    // TODO: Implement update user logic
    res.status(200).json({ message: `Update user of ${id} to ${name} and ${age}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement delete user logic
    res.status(200).json({ message: `Delete user ${id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
