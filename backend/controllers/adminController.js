const Team = require("../models/Team");
const Vendor = require("../models/Vendor");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mailer");
const logTeamActivity = require("../utils/activityLogger");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const crypto = require("crypto");
const RegistrationInvitation = require("../models/RegistrationInvitation");

const createRegistrationInvitation = async (req, res, type) => {
  const name = (type === "team" ? req.body.name : req.body.businessName)?.trim();
  const email = req.body.email?.trim().toLowerCase();
  if (!name || !email) return res.status(400).json({ error: "Name and email are required" });

  const existingAccount = type === "team"
    ? await Team.findOne({ email }).select("_id").lean()
    : await Vendor.findOne({ email }).select("_id").lean();
  if (existingAccount) return res.status(409).json({ error: `A ${type} account with this email already exists` });

  const existingInvite = await RegistrationInvitation.findOne({ email, type, status: "pending" });
  if (existingInvite) return res.status(409).json({ error: "A pending invitation already exists for this email" });

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const invitation = await RegistrationInvitation.create({ name, email, type, tokenHash });

  const baseUrl = (process.env.DEPLOYMENT_URL || process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")[0]
    .replace(/\/$/, "");
  const registerUrl = `${type === "team" ? (process.env.TEAM_REGISTER_URL || `${baseUrl}/team/register`) : (process.env.VENDOR_REGISTER_URL || `${baseUrl}/vendor/register`)}?invite=${token}`;
  const label = type === "team" ? "Team" : "Vendor";
  try {
    await sendMail({
      to: email,
      subject: `Your Scylla Racing ${label} invitation`,
      text: `Hello ${name},\n\nScylla Racing invites you to register as a ${label}. Complete your registration here: ${registerUrl}\n\nThis invitation is intended for ${email}.`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033"><h2 style="color:#0879e8">Scylla Racing ${label} invitation</h2><p>Hello ${name},</p><p>You have been invited to register as a Scylla Racing ${label}.</p><p><a href="${registerUrl}" style="display:inline-block;background:#0879e8;color:#fff;padding:12px 18px;border-radius:6px;text-decoration:none">Complete registration</a></p><p>Or copy this link: ${registerUrl}</p><p>This invitation is intended for <strong>${email}</strong>.</p></div>`,
    });
  } catch (mailError) {
    await RegistrationInvitation.findByIdAndDelete(invitation._id);
    console.error(`${label} invitation email failed:`, mailError.message);
    return res.status(502).json({ error: "Invitation was not sent. Check the email server configuration and try again." });
  }

  res.status(201).json({ message: `${label} invitation sent`, email, registerUrl });
};

exports.getRegistrationInvitations = async (_req, res) => {
  try {
    const invitations = await RegistrationInvitation.find()
      .select("name email type status createdAt convertedAt")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ invitations });
  } catch (err) {
    console.error("Failed to fetch registration invitations:", err);
    res.status(500).json({ error: "Failed to fetch invitation history" });
  }
};

exports.deleteRegistrationInvitation = async (req, res) => {
  try {
    const invitation = await RegistrationInvitation.findByIdAndDelete(req.params.id);
    if (!invitation) return res.status(404).json({ error: "Invitation not found" });
    res.json({ message: "Invitation deleted" });
  } catch (err) {
    console.error("Failed to delete registration invitation:", err);
    res.status(500).json({ error: "Failed to delete invitation" });
  }
};


exports.upload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 50 * 1024 * 1024 },
}).single("file");


//Login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const Admin = require("../models/Admin");
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");

  try {
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    // req.user comes from your JWT middleware
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.json(admin);
  } catch (err) {
    console.error("Error fetching admin profile:", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.updateAdmin = async (req, res) => {
  try {
    const adminId = req.user.id; // <--- safe now
    const { name, email, password } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updatedAdmin) return res.status(404).json({ error: "Admin not found" });

    res.json({
      message: "Admin details updated successfully",
      admin: updatedAdmin,
    });
  } catch (err) {
    console.error("Error updating admin:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// Pending users
exports.getPendingUsers = async (req, res) => {
  const teams = await Team.find();
  const vendors = await Vendor.find();

  res.json({ teams, vendors });
};

// Approve Team
// exports.approveTeam = async (req, res) => {
//   await Team.findByIdAndUpdate(req.params.id, { status: "approved" });
//   res.json({ message: "Team approved" });
//   await sendMail(
//       Team.email,
//       "Team Approved ✅",
//       `Your team "${team.name}" has been approved by admin.`,
//       `<h3>Hello ${team.name}</h3><p>Your team has been <b>approved</b>. You can now access the dashboard.</p>`
//     );

//     res.json({ message: "Team approved and email sent." });
// };


exports.approveTeam = async (req, res) => {
  try {
    // 1️⃣ Get team
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // 2️⃣ Approve team
    team.status = "approved";
    await team.save();

    // 3️⃣ Log FIRST activity
    await logTeamActivity(
      team._id,
      "TEAM_APPROVED",
      "Team approved",
      `Your team "${team.name}" has been approved`
    );

    res.json({ message: "Team approved" });

    // 4️⃣ Send email (non-blocking is even better)
    sendMail({
      to: team.email,
      subject: "Team Approved ✅",
      text: `Your team "${team.name}" has been approved by admin.`,
      html: `
        <h3>Hello ${team.name}</h3>
        <p>Your team has been <b>approved</b>.</p>
        <p>You can now access your dashboard.</p>
      `
    }).catch(err => {
      console.error("Email sending failed:", err.message);
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve team" });
  }
};


// Reject Team
exports.rejectTeam = async (req, res) => {
  try {
    // 1️⃣ Fetch team
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ error: "Team not found" });

    // 2️⃣ Update status
    team.status = "rejected";
    await team.save();

    // 3️⃣ Log activity
    await logTeamActivity(
      team._id,
      "TEAM_REJECTED",
      "Team rejected",
      `Your team "${team.name}" has been rejected`
    );

    // 4️⃣ Send email asynchronously
    sendMail({
      to: team.email,
      subject:"Team Rejected ❌",
      text: `Your team "${team.name}" has been rejected by admin.`,
      html:
      `<h3>Hello ${team.name}</h3>
       <p>Your team has been <b>rejected</b>. Please contact admin for more details.</p>`
  }).catch(err => console.error("Email error:", err));

    // 5️⃣ Respond once
    res.json({ message: "Team rejected and email sent." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reject team" });
  }
};


// Approve Vendor
exports.approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    // await Vendor.findByIdAndUpdate(req.params.id, { status: "approved" });

    vendor.status = "approved";
    await vendor.save();


   if (vendor.email) {
  sendMail({
    to: vendor.email,
    subject: "Vendor Approved ✅",
    text: `Your vendorship "${vendor.businessName}" has been approved.`,
    html:
    `<h3>Hello ${vendor.businessName}</h3>
     <p>Your vendorship has been <b>approved</b>.</p>`
   }).catch(err => console.error("Email error nahi hua:", err.message));
}

    res.json({ message: "Vendor approved and email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve vendor" });
  }
};


// reject vendor
exports.rejectVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });

    vendor.status = "rejected";
    await vendor.save()
    


    sendMail({
      to:vendor.email,
      subject:"Vendorship Rejected ❌",
      text:`Your vendorship "${vendor.businessName}" has been rejected by admin.`,
      html:
      `<h3>Hello ${vendor.businessName}</h3>
       <p>Your vendorship has been <b>rejected</b>. Please contact admin for more details.</p>`
  }).catch(err => console.error("Email error:", err));

    // 5️⃣ Respond once
    return res.json({ message: "vendor rejected and email sent." });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reject vendor" });
  }
}


const Product = require("../models/Product");

exports.getPendingProducts = async (req, res) => {
  const products = await Product.find({ status: "pending" });
  res.json(products);
};

exports.approveProduct = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { status: "approved" });
  res.json({ message: "Product approved" });
};

exports.rejectProduct = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { status: "rejected" });
  res.json({ message: "Product rejected" });
};


// verification docs

exports.fetchVerificationDoc = async (req, res) => {
  const teams = await Team.find(
    {},
    "name verificationDoc status createdAt aiReview"
  );

  const vendors = await Vendor.find(
    {},
    "businessName verificationDoc status createdAt aiReview"
  );

  const documents = [
    ...teams.map(team => ({
      ownerType: "Team",
      ownerId: team._id,
      ownerName: team.name,
      fileUrl: team.verificationDoc,
      status: team.status,
      submittedAt: team.createdAt,
      aiReview: team.aiReview,
    })),
    ...vendors.map(vendor => ({
      ownerType: "Vendor",
      ownerId: vendor._id,
      ownerName: vendor.businessName,
      fileUrl: vendor.verificationDoc,
      status: vendor.status,
      submittedAt: vendor.createdAt,
      aiReview: vendor.aiReview,
    }))
  ];

  res.json({ documents });
};


exports.updateVerificationStatus = async (req, res) => {
  const { ownerType, id } = req.params;
  const { status } = req.body; // approved | rejected

  const Model = ownerType === "Team" ? Team : Vendor;

  const owner = await Model.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!owner) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json({
    message: `${ownerType} verification ${status}`,
    status: owner.status,
  });
};


// add content in admin content moderation
exports.saveAdminContent = async (req, res) => {
  try {
    const { title, description, severity } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    if (!["low", "medium", "high"].includes(severity)) {
      return res.status(400).json({ error: "Invalid severity" });
    }

    // upload to cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "admin-content",
    });

    // 🔥 SINGLE ADMIN (ONLY ONE EXISTS)
    const admin = await Admin.findOne({ role: "admin" });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // 🔥 PUSH NEW CONTENT
    admin.content.push({
      fileUrl: uploadResult.secure_url,
      fileType:
        uploadResult.resource_type === "video" ? "video" : "image",
      title,
      description,
      severity,
      // status defaults to pending
    });

    await admin.save();

    res.status(201).json({
      message: "Content added successfully",
      content: admin.content[admin.content.length - 1],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// get fetch media at content moderation/admin
exports.getAdminContent = async (req, res) => {
  try {
    // since only ONE admin exists
    const admin = await Admin.findOne({ role: "admin" }).select("content");

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      count: admin.content.length,
      content: admin.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// approve the admin

exports.approveMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;

    const admin = await Admin.findOne(); // single admin
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const media = admin.content.id(mediaId);
    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }

    media.status = "approved";
    await admin.save();

    res.json({
      success: true,
      message: "Media approved",
      media,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// delete the media 
exports.deleteAdminMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;

    // Find the admin who owns this media (if multiple admins, you can use req.admin.id)
    const admin = await Admin.findOne({ "content._id": mediaId });
    if (!admin) return res.status(404).json({ error: "Media not found" });

    // Remove the media from the content array
    admin.content = admin.content.filter((item) => item._id.toString() !== mediaId);
    await admin.save();

    res.status(200).json({ message: "Media deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete media" });
  }
};


// ==================================================================
// ADMIN CRUD — VENDORS (create / read / delete)
// Approve/Reject already exist above; these add full management.
// ==================================================================

// Multer for admin-created vendor files
exports.uploadVendorFilesAdmin = multer({ dest: "uploads/" }).fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
  { name: "verificationDoc", maxCount: 1 },
]);

// Create Vendor (by Admin)
exports.createVendorByAdmin = async (req, res) => {
  return createRegistrationInvitation(req, res, "vendor");
  /*
  try {
    const {
      businessName,
      category,
      gstNumber,
      email,
      password,
      description,
      companyDesc,
      location,
      status,
    } = req.body;

    if (!businessName || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const accountPassword = password || require("crypto").randomBytes(9).toString("base64url");

    const existing = await Vendor.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "A vendor with this email already exists" });
    }

    let logoUrl, bannerUrl, docUrl;
    const fs = require("fs");

    if (req.files?.logo?.[0]) {
      const up = await cloudinary.uploader.upload(req.files.logo[0].path, { folder: "vendors/logos" });
      logoUrl = up.secure_url;
      fs.unlinkSync(req.files.logo[0].path);
    }
    if (req.files?.banner?.[0]) {
      const up = await cloudinary.uploader.upload(req.files.banner[0].path, { folder: "vendors/banners" });
      bannerUrl = up.secure_url;
      fs.unlinkSync(req.files.banner[0].path);
    }
    if (req.files?.verificationDoc?.[0]) {
      const up = await cloudinary.uploader.upload(req.files.verificationDoc[0].path, {
        folder: "vendors/docs",
        resource_type: "auto",
      });
      docUrl = up.secure_url;
      fs.unlinkSync(req.files.verificationDoc[0].path);
    }

    const hashedPassword = await bcrypt.hash(accountPassword, 10);

    const vendor = new Vendor({
      businessName,
      category: category || "General",
      gstNumber: gstNumber || "Not provided",
      email: email.toLowerCase(),
      password: hashedPassword,
      description,
      companyDesc,
      location,
      logo: logoUrl || "",
      banner: bannerUrl || "",
      verificationDoc: docUrl || "",
      // Admin-created vendors are approved by default; pass status explicitly to override.
      status: ["pending", "approved", "rejected"].includes(status) ? status : "approved",
    });

    await vendor.save();

    const vendorObj = vendor.toObject();
    delete vendorObj.password;

    const vendorLoginUrl = process.env.VENDOR_LOGIN_URL || `${(process.env.FRONTEND_URL || "http://localhost:5173").split(",")[0]}/vendor/login`;
    sendMail({
      to: vendor.email,
      subject: "Your Scylla Racing vendor account is ready",
      text: `Hello ${vendor.businessName},\n\nYour vendor account has been created by Scylla Racing admin.\nLogin: ${vendorLoginUrl}\nEmail: ${vendor.email}\nPassword: ${accountPassword}\n\nPlease sign in and update your profile after your first login.`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033"><h2 style="color:#0879e8">Welcome to Scylla Racing</h2><p>Hello ${vendor.businessName},</p><p>Your vendor account has been created by the Scylla Racing admin team.</p><p><strong>Login:</strong> <a href="${vendorLoginUrl}">${vendorLoginUrl}</a><br><strong>Email:</strong> ${vendor.email}<br><strong>Temporary password:</strong> ${accountPassword}</p><p>Please sign in and update your profile after your first login.</p></div>`,
    }).catch((mailError) => console.error("Vendor onboarding email failed:", mailError.message));

    res.status(201).json({ message: "Vendor created successfully", vendor: vendorObj });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to create vendor" });
  }
  */
};

// Get all vendors (Admin) — every status, optional ?status= filter
exports.getAllVendorsByAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.status = status;
    }

    const vendors = await Vendor.find(filter).select("-password").sort({ createdAt: -1 });
    res.json({ count: vendors.length, vendors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
};

// Get single vendor (Admin)
exports.getVendorByIdAdmin = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).select("-password");
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    res.json(vendor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch vendor" });
  }
};

// Delete vendor (Admin)
exports.deleteVendorByAdmin = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    res.json({ message: "Vendor deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete vendor" });
  }
};

// ==================================================================
// ADMIN CRUD — TEAMS (create / read / delete)
// ==================================================================

exports.uploadTeamFilesAdmin = multer({ dest: "uploads/" }).fields([
  { name: "logo", maxCount: 1 },
  { name: "verificationDoc", maxCount: 1 },
]);

// Create Team (by Admin)
exports.createTeamByAdmin = async (req, res) => {
  return createRegistrationInvitation(req, res, "team");
  /*
  try {
    const {
      name,
      tagline,
      description,
      email,
      contactNo,
      category,
      password,
      status,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const accountPassword = password || require("crypto").randomBytes(9).toString("base64url");

    const existing = await Team.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "A team with this email already exists" });
    }

    let location;
    if (req.body.location) {
      try {
        location = JSON.parse(req.body.location);
      } catch {
        return res.status(400).json({ error: "Invalid location data" });
      }
    }

    let logoUrl, docUrl;
    const fs = require("fs");

    if (req.files?.logo?.[0]) {
      const up = await cloudinary.uploader.upload(req.files.logo[0].path, { folder: "teams/logos" });
      logoUrl = up.secure_url;
      fs.unlinkSync(req.files.logo[0].path);
    }
    if (req.files?.verificationDoc?.[0]) {
      const up = await cloudinary.uploader.upload(req.files.verificationDoc[0].path, {
        folder: "teams/docs",
        resource_type: "auto",
      });
      docUrl = up.secure_url;
      fs.unlinkSync(req.files.verificationDoc[0].path);
    }

    const hashedPassword = await bcrypt.hash(accountPassword, 10);

    const team = new Team({
      name,
      tagline,
      description,
      email: email.toLowerCase(),
      contactNo: contactNo || "Not provided",
      category: category || "General",
      password: hashedPassword,
      logo: logoUrl || "",
      verificationDoc: docUrl || "",
      location,
      status: ["pending", "approved", "rejected"].includes(status) ? status : "approved",
    });

    await team.save();

    const teamObj = team.toObject();
    delete teamObj.password;

    const teamLoginUrl = process.env.TEAM_LOGIN_URL || `${(process.env.FRONTEND_URL || "http://localhost:5173").split(",")[0]}/team/login`;
    sendMail({
      to: team.email,
      subject: "Your Scylla Racing team account is ready",
      text: `Hello ${team.name},\n\nYour team account has been created by Scylla Racing admin.\nLogin: ${teamLoginUrl}\nEmail: ${team.email}\nPassword: ${accountPassword}\n\nPlease sign in and update your team profile after your first login.`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033"><h2 style="color:#0879e8">Welcome to Scylla Racing</h2><p>Hello ${team.name},</p><p>Your team account has been created by the Scylla Racing admin team.</p><p><strong>Login:</strong> <a href="${teamLoginUrl}">${teamLoginUrl}</a><br><strong>Email:</strong> ${team.email}<br><strong>Temporary password:</strong> ${accountPassword}</p><p>Please sign in and update your team profile after your first login.</p></div>`,
    }).catch((mailError) => console.error("Team onboarding email failed:", mailError.message));

    res.status(201).json({ message: "Team created successfully", team: teamObj });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to create team" });
  }
  */
};

// Get all teams (Admin) — every status, optional ?status= filter
exports.getAllTeamsByAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.status = status;
    }

    const teams = await Team.find(filter).select("-password").sort({ createdAt: -1 });
    res.json({ count: teams.length, teams });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};

// Get single team (Admin)
exports.getTeamByIdAdmin = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).select("-password");
    if (!team) return res.status(404).json({ error: "Team not found" });
    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch team" });
  }
};

// Delete team (Admin)
exports.deleteTeamByAdmin = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ error: "Team not found" });
    res.json({ message: "Team deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete team" });
  }
};


// Update admin media info
exports.updateAdminMedia = async (req, res) => {
  const { mediaId } = req.params;
  const { title, description, severity } = req.body;

  if (!title || !severity) {
    return res.status(400).json({ error: "Title and severity are required" });
  }

  try {
    const admin = await Admin.findOne({ "content._id": mediaId });

    if (!admin) return res.status(404).json({ error: "Media not found" });

    // Find the media in content array
    const media = admin.content.id(mediaId);
    media.title = title;
    media.description = description;
    media.severity = severity.toLowerCase();

    await admin.save();

    res.json({ message: "Media updated successfully", content: media });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};