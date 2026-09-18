const Category = require("../models/Category");
const Team = require("../models/Team");
const Vendor = require("../models/Vendor");

const GROUPS = ["vendor-categories", "vehicle-classes", "motorsport-disciplines"];
const KINDS = ["vendor-type", "company-type", "vendor-nature", "vehicle-class", "motorsport-discipline"];

const defaultCategories = [
  ["vendor-categories", "vendor-type", "Tyre Supplier", "Racing tyres and wheel gun hardware", "ACTIVE"],
  ["vendor-categories", "vendor-type", "Fabrication Workshop", "Custom chassis and frame construction", "ACTIVE"],
  ["vendor-categories", "vendor-type", "CAD / Design Service", "3D modeling and engineering design", "ACTIVE"],
  ["vendor-categories", "vendor-type", "Telemetry Provider", "Data acquisition and analysis services", "DISABLED"],
  ["vendor-categories", "vendor-type", "Safety Equipment Supplier", "Racing suits, helmets, and safety gear", "ACTIVE"],
  ["vendor-categories", "company-type", "Private Limited (Pvt Ltd)", "Registered private limited company", "ACTIVE"],
  ["vendor-categories", "company-type", "Limited (Ltd)", "Public limited company structure", "ACTIVE"],
  ["vendor-categories", "company-type", "LLP", "Limited liability partnership", "ACTIVE"],
  ["vendor-categories", "company-type", "Proprietorship", "Sole proprietor business", "ACTIVE"],
  ["vendor-categories", "company-type", "Individual / Freelancer", "Independent service provider", "ACTIVE"],
  ["vendor-categories", "vendor-nature", "Service-Based Vendor", "Professional services such as design, fabrication, and telemetry analysis.", "ACTIVE"],
  ["vendor-categories", "vendor-nature", "Product-Based Vendor", "Physical goods and equipment suppliers", "DISABLED"],
  ["vendor-categories", "vendor-nature", "Telemetry Provider", "Data acquisition and analysis systems", "ACTIVE"],
  ["vendor-categories", "vendor-nature", "Safety Equipment Supplier", "Racing suits, helmets, and safety gear", "ACTIVE"],
  ["vendor-categories", "vendor-nature", "Fabrication Workshop", "Custom chassis and frame fabrication", "ACTIVE"],
  ["vendor-categories", "vendor-nature", "CAD / Design Service", "3D modeling and engineering design", "ACTIVE"],
  ["vehicle-classes", "vehicle-class", "Karting", "Karting and sprint racing", "ACTIVE"],
  ["vehicle-classes", "vehicle-class", "Off-road Endurance", "Mechanical off-road endurance racing", "ACTIVE"],
  ["vehicle-classes", "vehicle-class", "Electric Off-road", "Electric-powered off-road racing", "ACTIVE"],
  ["vehicle-classes", "vehicle-class", "aBAJA", "Autonomous off-road challenges", "DISABLED"],
  ["vehicle-classes", "vehicle-class", "Formula", "Formula-style circuit racing", "ACTIVE"],
  ["vehicle-classes", "vehicle-class", "SUPRA", "GT and circuit racing", "ACTIVE"],
  ["motorsport-disciplines", "motorsport-discipline", "Quad Bike", "Four-wheeled off-road motorsport vehicle for endurance, rally, and BAJA-style competitions.", "DISABLED"],
  ["motorsport-disciplines", "motorsport-discipline", "Motocross Bike", "Two-wheeled off-road motorcycle for closed-circuit motocross racing.", "ACTIVE"],
];

const validateCategoryInput = ({ group, kind, name }) => {
  if (!GROUPS.includes(group)) return "Invalid category group";
  if (!KINDS.includes(kind)) return "Invalid category kind";
  if (!name?.trim()) return "Category name is required";
  if (group === "vendor-categories" && !["vendor-type", "company-type", "vendor-nature"].includes(kind)) return "Invalid vendor category kind";
  if (group === "vehicle-classes" && kind !== "vehicle-class") return "Invalid vehicle class kind";
  if (group === "motorsport-disciplines" && kind !== "motorsport-discipline") return "Invalid motorsport discipline kind";
  return null;
};

const seedDefaults = async () => {
  if (await Category.exists()) return;
  await Category.insertMany(defaultCategories.map(([group, kind, name, description, status]) => ({ group, kind, name, description, status })));
};

const getUsageCount = async (category) => {
  if (category.group === "vendor-categories" && category.kind !== "company-type") {
    return Vendor.countDocuments({ category: category.name });
  }
  if (category.group === "motorsport-disciplines") {
    return Team.countDocuments({ category: category.name });
  }
  return 0;
};

const serialize = async (category) => ({
  ...category.toObject ? category.toObject() : category,
  usageCount: await getUsageCount(category),
});

exports.listCategories = async (req, res) => {
  try {
    await seedDefaults();
    const filter = {};
    if (req.query.group) filter.group = req.query.group;
    if (req.query.search?.trim()) filter.name = { $regex: req.query.search.trim(), $options: "i" };
    const categories = await Category.find(filter).sort({ group: 1, kind: 1, name: 1 });
    res.json({ categories: await Promise.all(categories.map(serialize)) });
  } catch (error) {
    console.error("List categories error:", error);
    res.status(500).json({ error: "Failed to load categories" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { group, kind, name, description = "", status = "ACTIVE" } = req.body;
    const validationError = validateCategoryInput({ group, kind, name });
    if (validationError) return res.status(400).json({ error: validationError });
    if (!["ACTIVE", "DISABLED"].includes(status)) return res.status(400).json({ error: "Invalid category status" });

    const category = await Category.create({
      group,
      kind,
      name: name.trim(),
      description: description.trim(),
      status,
      createdBy: req.user.id,
    });
    res.status(201).json({ category: await serialize(category) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: "A category with this name already exists in this group" });
    console.error("Create category error:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const update = {};
    if (req.body.name !== undefined) {
      if (!req.body.name.trim()) return res.status(400).json({ error: "Category name is required" });
      update.name = req.body.name.trim();
    }
    if (req.body.description !== undefined) update.description = String(req.body.description).trim();
    if (req.body.status !== undefined) {
      if (!["ACTIVE", "DISABLED"].includes(req.body.status)) return res.status(400).json({ error: "Invalid category status" });
      update.status = req.body.status;
    }

    const category = await Category.findByIdAndUpdate(req.params.id, { $set: update }, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ category: await serialize(category) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: "A category with this name already exists in this group" });
    console.error("Update category error:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    const usageCount = await getUsageCount(category);
    if (usageCount > 0) return res.status(409).json({ error: "This category is in use and cannot be deleted", usageCount });
    await category.deleteOne();
    res.json({ message: "Category deleted" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};
