import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function AlertModal({
  title,
  message,
  onConfirm,
  onCancel,
  show = true,
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-[inset_4px_4px_10px_#e4e9f2,inset_-4px_-4px_10px_#ffffff] rounded-2xl p-6 w-[90%] max-w-sm text-center"
          >
            {/* ⚠️ Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center shadow-inner">
                <AlertTriangle className="text-yellow-500" size={28} />
              </div>
            </div>

            {/* 📝 Title & Message */}
            <h2 className="text-xl font-extrabold text-gray-800 mb-2">
              {title}
            </h2>
            <p className="text-gray-600 text-sm mb-6">{message}</p>

            {/* 🔘 Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={onCancel}
                className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all shadow-[inset_3px_3px_6px_#e5e9ef,inset_-3px_-3px_6px_#ffffff]"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
