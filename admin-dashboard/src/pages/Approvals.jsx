import { useEffect, useState } from "react";

import VendorTable from "../components/VendorTable";
import TeamTable from "../components/TeamTable";
import DocumentTable from "../components/DocumentTable";
import DocumentPreview from "../components/DocumentPreview.jsx";
import {
  getPendingUsers,
  approveTeam,
  rejectTeam,
  approveVendor,
  rejectVendor,
  fetchVerificationDoc,
  updateVerificationStatus,
} from "../api/admin.api";

const VENDOR_KEY = "scylla.vendors";

export default function Approvals() {
  /* ---------------- CATEGORY BADGE COLORS ---------------- */
  const categoryBadge = (category) => {
    switch (category) {
      // Team categories
      case "Formula":
        return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
      case "BAJA":
        return "bg-purple-500/15 text-purple-400 border border-purple-500/30";
      case "Karting":
        return "bg-pink-500/15 text-pink-400 border border-pink-500/30";
      case "Moto":
        return "bg-orange-500/15 text-orange-400 border border-orange-500/30";

      // Vendor categories
      case "Fabrication":
        return "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30";
      case "Tyres":
        return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30";
      case "Telemetry":
        return "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30";
      case "CAD Design":
        return "bg-pink-500/15 text-pink-400 border border-pink-500/30";
      case "Safety Equipment":
        return "bg-red-500/15 text-red-400 border border-red-500/30";

      default:
        return "bg-slate-500/15 text-slate-400 border border-slate-500/30";
    }
  };



  const [vendors, setVendors] = useState([])

  const [teams, setTeams] = useState([]);

  /* ---------------- DOCUMENT DATA ---------------- */
  // const initialDocuments = [
  //   {
  //     id: "doc1",
  //     title: "GST Certificate",
  //     owner: "PrecisionTech Fabrication",
  //     disclosingParty: "PrecisionTech Fabrication",
  //     receivingParty: "Scylla Motorsports Association",
  //     effectiveDate: "11 Dec 2024",
  //     type: "Vendor",
  //     submitted: "Dec 11, 2024",
  //     status: "Pending",
  //   },
  //   {
  //     id: "doc2",
  //     title: "University ID",
  //     owner: "Velocity Racing",
  //     disclosingParty: "Velocity Racing",
  //     receivingParty: "Scylla Motorsports Association",
  //     effectiveDate: "10 Dec 2024",
  //     type: "Team",
  //     submitted: "Dec 10, 2024",
  //     status: "Approved",
  //   },
  //   {
  //     id: "doc3",
  //     title: "Insurance Paper",
  //     owner: "Nitro Moto",
  //     disclosingParty: "Nitro Moto",
  //     receivingParty: "Scylla Motorsports Association",
  //     effectiveDate: "09 Dec 2024",
  //     type: "Team",
  //     submitted: "Dec 9, 2024",
  //     status: "Rejected",
  //   },
  // ];

  const [documents, setDocuments] = useState([]);

  const statusPriority = {
    Pending: 0,
    Approved: 1,
    Rejected: 2,
  };


  /* ---------------- SELECTED MODAL DATA ---------------- */
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState("");

  /* ---------------- UI STATE ---------------- */
  const [activeTab, setActiveTab] = useState("Vendor Verification");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  /* ---------------- FILTER ---------------- */
  // const filterData = (data) =>
  //   data.filter((item) => {
  //     const q = search.toLowerCase();
  //     const matchText = Object.values(item).some((v) =>
  //       String(v).toLowerCase().includes(q)
  //     );
  //     const matchStatus = statusFilter === "All" || item.status === statusFilter;
  //     return matchText && matchStatus;
  //   });

  const filterData = (data) =>
    data
      .filter((item) => {
        const q = search.toLowerCase();
        const matchText = Object.values(item).some((v) =>
          String(v).toLowerCase().includes(q)
        );
        const matchStatus =
          statusFilter === "All" || item.status === statusFilter;

        return matchText && matchStatus;
      })
      .sort(
        (a, b) =>
          (statusPriority[a.status] ?? 99) -
          (statusPriority[b.status] ?? 99)
      );


  /* ---------------- VIEW HANDLERS ---------------- */
  const handleViewVendor = (id) => {
    const vendor = vendors.find((v) => v.id === id);
    setModalData(vendor);
    setModalType("Vendor");
  };

  const handleViewTeam = (id) => {
    const team = teams.find((t) => t.id === id);
    setModalData(team);
    setModalType("Team");
  };

 const handleViewDocument = (doc) => {
  console.log("DOC CLICKED 👉", doc);
  setSelectedDoc(doc);
};




  /* ---------------- APPROVE/REJECT ---------------- */
  const handleApproveVendor = async (id) => {
    await approveVendor(id);
    loadPendingUsers();
  };

  const handleRejectVendor = async (id) => {
    await rejectVendor(id);
    loadPendingUsers();
  };


  const handleApproveTeam = async (id) => {
    await approveTeam(id);
    loadPendingUsers();
  };

  const handleRejectTeam = async (id) => {
    await rejectTeam(id);
    loadPendingUsers();
  };


  const handleApproveDocument = async () => {
    await updateVerificationStatus(
      selectedDoc.ownerType,
      selectedDoc.id,
      "approved"
    );
    setSelectedDoc(null);
    loadVerificationDocuments();
  };

  const handleRejectDocument = async () => {
    await updateVerificationStatus(
      selectedDoc.ownerType,
      selectedDoc.id,
      "rejected"
    );
    setSelectedDoc(null);
    loadVerificationDocuments();
  };



  /* ---------------- RESET HANDLERS ---------------- */
  const handleResetVendors = () => {
    if (confirm("Reset all vendors to default?")) {
      localStorage.removeItem(VENDOR_KEY);
      setVendors(initialVendors);
    }
  };

  const handleResetTeams = () => {
    if (confirm("Reset all teams to default?")) {
      setTeams(initialTeams);
    }
  };

  const handleResetDocuments = () => {
    if (confirm("Reset all documents to default?")) {
      setDocuments(initialDocuments);
    }
  };


  useEffect(() => {
    loadPendingUsers();
  }, []);

  useEffect(() => {
    if (activeTab === "Document Approval") {
      loadVerificationDocuments();
    }
  }, [activeTab]);


  const loadPendingUsers = async () => {
    try {
      const { data } = await getPendingUsers();

      setTeams(
        data.teams.map(team => ({
          id: team._id,
          team: team.name,
          term: team.name
            .trim()
            .split(" ")
            .filter(Boolean)
            .map(word => word[0].toUpperCase())
            .slice(0, 2)
            .join(""),
          category: team.category,
          university: team.email,
          submitted: team.createdAt.slice(0, 10),
          status: capitalize(team.status),
        }))
      );

      setVendors(
        data.vendors.map(vendor => ({
          id: vendor._id,
          name: vendor.businessName,
          email: vendor.email,
          category: vendor.category,
          gst: vendor.gstNumber,
          location: vendor.location,
          submitted: vendor.createdAt.slice(0, 10),
          status: capitalize(vendor.status),
        }))
      );

    } catch (err) {
      console.error("Failed to fetch pending users", err);
    }
  };

  // const loadVerificationDocuments = async () => {
  //   try {
  //     const res = await fetchVerificationDoc();

  //     setDocuments(
  //       res.data.documents.map(doc => ({
  //         id: doc.ownerId,
  //         ownerType: doc.ownerType,
  //         owner: doc.ownerName,
  //         title: "Verification Document",
  //         pdfUrl: doc.verificationDoc || "",
  //         status: capitalize(doc.status),
  //         submitted: doc.submittedAt?.slice(0, 10),
  //       }))
  //     );
  //   } catch (err) {
  //     console.error("Failed to load documents", err);
  //   }
  // };

const loadVerificationDocuments = async () => {
  try {
    const res = await fetchVerificationDoc();

    setDocuments(
      res.data.documents.map(doc => ({
        id: doc.ownerId,
        type: capitalize(doc.ownerType),     // Vendor | Team
        ownerType: doc.ownerType,             // vendor | team
        owner: doc.ownerName,                 // teamName / businessName
        title: "Verification Document",
       pdfUrl:
          doc.verificationDoc ||
          doc.verificationDocs ||
          doc.document ||
          doc.docUrl ||
          doc.fileUrl ||
          "",         // 🔑 MUST EXIST
        status: capitalize(doc.status),
        submitted: doc.submittedAt?.slice(0, 10),
      }))
    );
  } catch (err) {
    console.error("Failed to load documents", err);
  }
};




  const capitalize = (s = "") =>
    s.charAt(0).toUpperCase() + s.slice(1);


  /* ---------------- UI ---------------- */
  return (
    <div className="h-screen bg-slate-950 text-white overflow-y-auto pb-20">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="bg-black rounded-xl p-4 mb-6 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
            <h1 className="text-xl font-semibold text-white mb-4">User Approvals</h1>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {["Team Verification", "Vendor Verification", "Document Approval"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl transition ${activeTab === tab
                    ? "bg-cyan-500 text-black"
                    : "bg-slate-800 text-cyan-300"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex justify-end items-center space-x-2 mb-4">
              <input
                className="bg-slate-700 w-full sm:w-64 md:w-80 lg:w-96 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="bg-slate-700 px-3 py-2 rounded-xl text-sm text-white border border-slate-600 focus:outline-none transition"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>

              {/* Reset Button */}
              <button
                onClick={() => {
                  if (activeTab === "Vendor Verification") handleResetVendors();
                  else if (activeTab === "Team Verification") handleResetTeams();
                  else if (activeTab === "Document Approval") handleResetDocuments();
                }}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-white text-sm"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Tables */}
          {activeTab === "Vendor Verification" && (
            <VendorTable
              vendors={filterData(vendors)}
              categoryBadge={categoryBadge}
              onView={handleViewVendor}
              onApprove={handleApproveVendor}
              onReject={handleRejectVendor}
            />
          )}

          {activeTab === "Team Verification" && (
            <TeamTable
              teams={filterData(teams)}
              categoryBadge={categoryBadge}
              onView={handleViewTeam}
              onApprove={handleApproveTeam}
              onReject={handleRejectTeam}
            />
          )}

          {activeTab === "Document Approval" && (
            <DocumentTable
              documents={filterData(documents)}
              onView={handleViewDocument}
              onApprove={handleApproveDocument}
              onReject={handleRejectDocument}
            />
          )}

          {/* Document Preview */}
          <DocumentPreview
            doc={selectedDoc}
            onClose={() => setSelectedDoc(null)}
            onApprove={handleApproveDocument}
            onReject={handleRejectDocument}
          />


          {/* Vendor / Team Modal */}
          {modalData && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#0f141b] p-6 rounded-xl w-80 sm:w-96 text-white shadow-lg">
                <h2 className="text-lg font-semibold mb-4">{modalType} Details</h2>

                <div className="space-y-3 text-sm">
                  {modalType === "Team" && (
                    <>
                      <div className="flex justify-between">
                        <span className="font-semibold text-cyan-400">Team:</span> <span>{modalData.team}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-cyan-400">Term:</span> <span>{modalData.term}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-cyan-400">Category:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${categoryBadge(modalData.category)}`}>
                          {modalData.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-cyan-400">University:</span> <span>{modalData.university}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-cyan-400">Submitted:</span> <span>{modalData.submitted}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-cyan-400">Status:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${modalData.status === "Approved"
                          ? "bg-green-500/15 text-green-400 border border-green-500/30"
                          : modalData.status === "Rejected"
                            ? "bg-red-500/15 text-red-400 border border-red-500/30"
                            : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                          }`}
                        >
                          {modalData.status}
                        </span>
                      </div>
                    </>
                  )}

                  {modalType === "Vendor" && (
                    <>
                      <div className="flex justify-between">
                        <span className="font-semibold text-cyan-400">Name:</span> <span>{modalData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-cyan-400">Email:</span> <span>{modalData.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-cyan-400">Category:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${categoryBadge(modalData.category)}`}>
                          {modalData.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-cyan-400">GST:</span> <span>{modalData.gst}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-cyan-400">Location:</span> <span>{modalData.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-cyan-400">Submitted:</span> <span>{modalData.submitted}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-cyan-400">Status:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${modalData.status === "Approved"
                          ? "bg-green-500/15 text-green-400 border border-green-500/30"
                          : modalData.status === "Rejected"
                            ? "bg-red-500/15 text-red-400 border border-red-500/30"
                            : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                          }`}
                        >
                          {modalData.status}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setModalData(null)}
                  className="mt-6 bg-cyan-500 hover:bg-cyan-400 px-4 py-2 rounded-lg text-black font-semibold w-full"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
