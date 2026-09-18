const express = require("express");
const router = express.Router();

const authUser = require("../middlewares/authUser");
const adminAuth = require("../middlewares/adminAuth");
const adminCtrl = require("../controllers/adminController");
const { getAdminDashboardStats } = require("../controllers/adminDashboardController");
const { getAdminAnalytics } = require("../controllers/analyticsController");




// Admin Login 
router.post("/login", adminCtrl.adminLogin);

router.get("/",adminAuth, adminCtrl.getAdminProfile);

router.put("/update",adminAuth, adminCtrl.updateAdmin);

// Pending Users (Teams + Vendors) 
// router.get("/pending", adminAuth, adminCtrl.getPendingUsers);
router.get("/pending",adminAuth, adminCtrl.getPendingUsers);
router.get("/registration-invitations", adminAuth, adminCtrl.getRegistrationInvitations);
router.delete("/registration-invitations/:id", adminAuth, adminCtrl.deleteRegistrationInvitation);

// Approve / Reject Teams 
// router.put("/team/:id/approve", adminAuth, adminCtrl.approveTeam);
router.put("/team/:id/approve",adminAuth, adminCtrl.approveTeam);
// router.put("/team/:id/reject", adminAuth, adminCtrl.rejectTeam);
router.put("/team/:id/reject",adminAuth, adminCtrl.rejectTeam);

// Approve Vendors 
// router.put("/vendor/:id/approve", adminAuth, adminCtrl.approveVendor);
router.put("/vendor/:id/approve", adminCtrl.approveVendor);
// reject vendor
// router.put("/vendor/:id/reject", adminAuth,adminCtrl.rejectVendor);
router.put("/vendor/:id/reject", adminCtrl.rejectVendor);

//Pending Products
// router.get("/products/pending", adminAuth, adminCtrl.getPendingProducts);
router.get("/products/pending",adminAuth, adminCtrl.getPendingProducts);
// router.put("/products/:id/approve", adminAuth, adminCtrl.approveProduct);
router.put("/products/:id/approve", adminCtrl.approveProduct);
// router.put("/products/:id/reject", adminAuth, adminCtrl.rejectProduct);
router.put("/products/:id/reject", adminCtrl.rejectProduct);

// ==================== VENDOR CRUD (Admin) ====================
// Create
router.post(
  "/vendor",
  adminAuth,
  adminCtrl.uploadVendorFilesAdmin,
  adminCtrl.createVendorByAdmin
);
// Read all (optionally ?status=pending|approved|rejected)
router.get("/vendor", adminAuth, adminCtrl.getAllVendorsByAdmin);
// Read one
router.get("/vendor/:id", adminAuth, adminCtrl.getVendorByIdAdmin);
// Delete
router.delete("/vendor/:id", adminAuth, adminCtrl.deleteVendorByAdmin);

// ==================== TEAM CRUD (Admin) ====================
// Create
router.post(
  "/team",
  adminAuth,
  adminCtrl.uploadTeamFilesAdmin,
  adminCtrl.createTeamByAdmin
);
// Read all (optionally ?status=pending|approved|rejected)
router.get("/team", adminAuth, adminCtrl.getAllTeamsByAdmin);
// Read one
router.get("/team/:id", adminAuth, adminCtrl.getTeamByIdAdmin);
// Delete
router.delete("/team/:id", adminAuth, adminCtrl.deleteTeamByAdmin);

// Admin Dashboard
// router.get("/dashboard", authUser(["admin"]), getAdminDashboardStats);
router.get("/dashboard",adminAuth, getAdminDashboardStats);
router.get("/analytics", adminAuth, getAdminAnalytics);


// verification docs
router.get("/verification",adminAuth,adminCtrl.fetchVerificationDoc);


router.patch(
  "/verification/:ownerType/:id",
  adminCtrl.updateVerificationStatus
);

// content moderation
// add content moderation
router.post("/content", adminAuth, adminCtrl.upload, adminCtrl.saveAdminContent);

// fetch content moderation
router.get("/content", adminAuth, adminCtrl.getAdminContent);


// approve the media at admin level
router.patch("/media/:mediaId/approve", adminAuth, adminCtrl.approveMedia);

// delete the media
router.delete("/media/:mediaId", adminAuth, adminCtrl.deleteAdminMedia);

// update the media
router.put("/media/:mediaId", adminAuth, adminCtrl.updateAdminMedia);



module.exports = router;