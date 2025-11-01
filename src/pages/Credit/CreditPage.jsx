import { useState } from "react";
import { useCredits } from "../../context/CreditContext";
import { Search } from "lucide-react";

export default function CreditPage() {
  const { credits, loading, addCredit, updateCredit, deleteCredit } =
    useCredits();

  const [newCredit, setNewCredit] = useState({
    name: "",
    amount: "",
    dueDate: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    amount: "",
    dueDate: "",
  });

  const [payingId, setPayingId] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const handleAdd = async (e) => {
    e.preventDefault();
    await addCredit({
      ...newCredit,
      amount: Number(newCredit.amount),
      remaining: Number(newCredit.amount),
      status: "Unpaid",
      createdAt: new Date().toISOString(),
    });
    setNewCredit({ name: "", amount: "", dueDate: "" });
  };

  const handleEdit = (credit) => {
    setEditingId(credit.id);
    setEditData({
      name: credit.name,
      amount: credit.amount,
      dueDate: credit.dueDate,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateCredit(editingId, {
      ...editData,
      amount: Number(editData.amount),
    });
    setEditingId(null);
  };

  // 💸 Partial Payment Logic
  const handlePartialPay = async (credit) => {
    const pay = Number(paymentAmount);
    if (isNaN(pay) || pay <= 0) return alert("Enter a valid amount.");
    if (pay > credit.remaining)
      return alert("Payment exceeds remaining balance!");

    const newRemaining = credit.remaining - pay;
    const updatedData = {
      remaining: newRemaining,
      status: newRemaining <= 0 ? "Paid" : "Unpaid",
      lastPaymentDate: new Date().toISOString(),
    };

    await updateCredit(credit.id, updatedData);
    alert(
      newRemaining <= 0
        ? "✅ Fully Paid!"
        : `💰 Payment recorded! Remaining ₱${newRemaining.toLocaleString()}`
    );

    setPayingId(null);
    setPaymentAmount("");
  };

  if (loading) return <p className="text-center mt-8">Loading utang list...</p>;

  // 🔎 Filter by search
  const filteredCredits = credits.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🔽 Sort logic
  const sortedCredits = [...filteredCredits].sort((a, b) => {
    if (sortBy === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "oldest")
      return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "remaining") return (b.remaining ?? 0) - (a.remaining ?? 0);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  // 📊 Totals summary
  const totalUnpaid = credits
    .filter((c) => c.status === "Unpaid")
    .reduce((sum, c) => sum + Number(c.remaining ?? 0), 0);

  const totalPaid = credits
    .filter((c) => c.status === "Paid")
    .reduce((sum, c) => sum + Number(c.amount ?? 0), 0);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2
        className="text-2xl font-extrabold mb-6 text-center 
  bg-gradient-to-r from-pink-400 via-fuchsia-400 to-sky-400 
  bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(255,192,203,0.4)]"
      >
        Utang Tracker
      </h2>

      {/* 📊 Totals Overview */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-100 text-blue-800 p-3 rounded-lg text-center">
          <p className="text-sm font-semibold">Total Records</p>
          <h3 className="text-xl font-bold">{credits.length}</h3>
        </div>
        <div className="bg-red-100 text-red-800 p-3 rounded-lg text-center">
          <p className="text-sm font-semibold">Unpaid Total</p>
          <h3 className="text-xl font-bold">₱{totalUnpaid.toLocaleString()}</h3>
        </div>
        <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center">
          <p className="text-sm font-semibold">Paid Total</p>
          <h3 className="text-xl font-bold">₱{totalPaid.toLocaleString()}</h3>
        </div>
      </div>

      {/* 🔍 Search + Sort */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-2/3">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search debtor name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border p-2 rounded-md text-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="remaining">Highest Remaining</option>
          <option value="name">Name (A–Z)</option>
        </select>
      </div>

      {/* ➕ Add New Credit */}
      <form
        onSubmit={handleAdd}
        className="mb-8 space-y-3 bg-gray-50 p-4 rounded-lg border"
      >
        <h3 className="font-semibold text-gray-700">Add New Record</h3>
        <input
          type="text"
          placeholder="Customer Name"
          className="w-full p-2 border rounded-md"
          value={newCredit.name}
          onChange={(e) => setNewCredit({ ...newCredit, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Amount (₱)"
          className="w-full p-2 border rounded-md"
          value={newCredit.amount}
          onChange={(e) =>
            setNewCredit({ ...newCredit, amount: e.target.value })
          }
          required
        />
        <input
          type="date"
          className="w-full p-2 border rounded-md"
          value={newCredit.dueDate}
          onChange={(e) =>
            setNewCredit({ ...newCredit, dueDate: e.target.value })
          }
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Utang
        </button>
      </form>

      {/* 🧾 Credit List */}
      <div className="space-y-3">
        {sortedCredits.length === 0 ? (
          <p className="text-gray-500 text-center italic">
            No matching results.
          </p>
        ) : (
          sortedCredits.map((c) => {
            const isOverdue =
              c.status === "Unpaid" && new Date(c.dueDate) < new Date();
            const almostPaid = c.remaining < 100 && c.remaining > 0;

            return (
              <div
                key={c.id}
                className={`p-4 border rounded-lg shadow-sm transition transform hover:scale-[1.01] ${
                  isOverdue
                    ? "border-red-600 bg-red-50"
                    : c.status === "Unpaid"
                    ? "border-yellow-400"
                    : "border-green-400 bg-green-50"
                }`}
              >
                {editingId === c.id ? (
                  // ✏️ Edit Mode
                  <form onSubmit={handleUpdate} className="space-y-2">
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      required
                    />
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md"
                      value={editData.amount}
                      onChange={(e) =>
                        setEditData({ ...editData, amount: e.target.value })
                      }
                      required
                    />
                    <input
                      type="date"
                      className="w-full p-2 border rounded-md"
                      value={editData.dueDate}
                      onChange={(e) =>
                        setEditData({ ...editData, dueDate: e.target.value })
                      }
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  // 👁️ View Mode
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          {c.name}
                          {isOverdue && (
                            <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full">
                              Overdue
                            </span>
                          )}
                          {almostPaid && (
                            <span className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full">
                              Almost Paid
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-600">
                          Original: ₱{Number(c.amount).toLocaleString()} <br />
                          Remaining:{" "}
                          <span
                            className={`font-semibold ${
                              c.remaining > 0
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            ₱{Number(c.remaining ?? c.amount).toLocaleString()}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Due: {new Date(c.dueDate).toLocaleDateString()}
                        </p>
                        {c.lastPaymentDate && (
                          <p className="text-xs text-gray-400">
                            Last updated:{" "}
                            {new Date(c.lastPaymentDate).toLocaleDateString()}
                          </p>
                        )}
                        <p
                          className={`text-sm font-bold mt-1 ${
                            c.status === "Unpaid"
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {c.status}
                        </p>
                      </div>

                      <div className="flex gap-2 items-start">
                        {c.status === "Unpaid" && (
                          <>
                            <button
                              onClick={() => setPayingId(c.id)}
                              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                            >
                              Pay
                            </button>
                            <button
                              onClick={() => handleEdit(c)}
                              className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                            >
                              Edit
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteCredit(c.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* 💰 Payment Field */}
                    {payingId === c.id && (
                      <div className="mt-3 flex gap-2 items-center">
                        <input
                          type="number"
                          placeholder="Enter amount"
                          className="border rounded-md p-2 w-1/2"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                        />
                        <button
                          onClick={() => handlePartialPay(c)}
                          className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                        >
                          Confirm Pay
                        </button>
                        <button
                          onClick={() => setPayingId(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
