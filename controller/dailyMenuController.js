const DailyMenu = require("../model/dailyMenuModel");

const createDailyMenu = async (req, res) => {
  try {
    const { menuTitle, price } = req.body;

    if (!menuTitle || !price || !req.file) {
      return res.status(400).json({ error: "Incomplete credentials" });
    }

    const menuImage = req.file.path; // Cloudinary URL
    const privateMenuImage = req.file.filename; // Cloudinary public_id

    const createMenuVar = await DailyMenu.create({
      menuTitle,
      price,
      menuImage,
      privateMenuImage,
    });

    res.status(201).json({
      message: "Daily menu created successfully",
      createMenuVar,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllDailyMenus = async (req, res) => {
  try {
    const menuVar = await DailyMenu.find();
    res.status(200).json(menuVar);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getSingleDailyMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const menuVar = await DailyMenu.findById(id);

    if (!menuVar) {
      return res.status(404).json({ error: "Menu not found" });
    }
    res.status(200).json(menuVar);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateDailyMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { menuTitle, price } = req.body;

    let updatedFields = { menuTitle, price };

    const existingMenu = await DailyMenu.findById(id);

    if (!existingMenu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    if (req.file) {
      // delete old image from cloudinary
      if (existingMenu.privateMenuImage) {
        await cloudinary.uploader.destroy(existingMenu.privateMenuImage);
      }

      // save new image
      updatedFields.menuImage = req.file.path;
      updatedFields.privateMenuImage = req.file.filename;
    }

    const updatedMenu = await DailyMenu.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteDailyMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const menuVar = await DailyMenu.findById(id);

    if (!menuVar) {
      return res.status(404).json({ error: "Menu not found" });
    }

    // delete image from cloudinary
    if (menuVar.privateMenuImage) {
      await cloudinary.uploader.destroy(menuVar.privateMenuImage);
    }

    // delete menu from database
    await DailyMenu.findByIdAndDelete(id);

    res.status(200).json({
      message: "Daily menu deleted successfully",
      menuVar,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createDailyMenu,
  getAllDailyMenus,
  getSingleDailyMenu,
  updateDailyMenu,
  deleteDailyMenu,
};
