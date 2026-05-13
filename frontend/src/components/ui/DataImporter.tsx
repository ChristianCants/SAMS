import { useState, useRef } from "react";
import { Upload, X, FileSpreadsheet, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import * as xlsx from "xlsx";
import { supabase } from "../../lib/supabase";

interface DataImporterProps {
  tableName: string; // "profiles" or "student_scores"
  onSuccess?: () => void;
  onClose: () => void;
  // Field mappings. E.g., { "Name": "full_name", "Email": "email" }
  fieldMapping: Record<string, string>;
  // For student_scores, we need to inject the activity_id for all rows
  staticFields?: Record<string, any>; 
  title?: string;
  description?: string;
}

export default function DataImporter({ 
  tableName, 
  onSuccess, 
  onClose, 
  fieldMapping, 
  staticFields = {},
  title = "Import Data",
  description = "Upload an Excel (.xlsx) or CSV file. Unrecognized columns will be dynamically saved to metadata."
}: DataImporterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    setError(null);
    setSuccess(null);
    
    if (!selectedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
      setError("Please upload a valid Excel or CSV file.");
      return;
    }
    
    setFile(selectedFile);
  };

  const processFile = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = xlsx.read(data);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert sheet to JSON
      const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: "" }) as Record<string, any>[];

      if (jsonData.length === 0) {
        throw new Error("The uploaded file is empty.");
      }

      // Process rows to map fields and bundle metadata
      const formattedData = jsonData.map(row => {
        const formattedRow: Record<string, any> = { ...staticFields };
        const metadata: Record<string, any> = {};

        // Loop through the uploaded file's columns
        for (const [key, value] of Object.entries(row)) {
          if (value === "") continue; // skip empty cells

          const mappedKey = fieldMapping[key] || fieldMapping[key.toLowerCase()];
          
          if (mappedKey) {
            // Recognized column
            formattedRow[mappedKey] = value;
          } else {
            // Unrecognized column - dump into metadata!
            metadata[key] = value;
          }
        }
        
        // Assign the JSON metadata
        formattedRow.metadata = metadata;
        
        return formattedRow;
      });

      // Insert to Supabase
      const { error: dbError } = await supabase
        .from(tableName)
        .upsert(formattedData, { 
          // For Upsert, we let it use the primary key (id) or unique constraints
          // profiles will upsert on id (but we probably need email if id isn't in the CSV)
          // For scores, it will upsert on (activity_id, student_id)
          onConflict: tableName === "profiles" ? "id" : "activity_id,student_id",
          ignoreDuplicates: false 
        });

      if (dbError) throw dbError;

      setSuccess(`Successfully imported ${formattedData.length} records!`);
      
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process the file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-lg flex gap-2 text-red-600 text-sm">
              <AlertTriangle size={18} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3 bg-green-50 border border-green-100 rounded-lg flex gap-2 text-green-700 text-sm">
              <CheckCircle2 size={18} className="shrink-0" />
              <p>{success}</p>
            </div>
          )}

          <div 
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${
              isDragging 
                ? "border-[#4f46e5] bg-[#4f46e5]/5" 
                : file ? "border-[#10b981] bg-[#10b981]/5" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFile(e.dataTransfer.files[0]);
              }
            }}
          >
            <input 
              type="file" 
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              className="hidden" 
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />

            {file ? (
              <>
                <FileSpreadsheet size={40} className="text-[#10b981] mb-3" strokeWidth={1.5} />
                <p className="text-sm font-semibold text-gray-800">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">Ready to process</p>
                <button 
                  onClick={() => setFile(null)} 
                  className="mt-4 text-xs font-semibold text-red-500 hover:text-red-600"
                >
                  Remove File
                </button>
              </>
            ) : (
              <>
                <Upload size={40} className="text-gray-400 mb-3" strokeWidth={1.5} />
                <p className="text-sm font-semibold text-gray-800">Drag & drop your file here</p>
                <p className="text-xs text-gray-500 mt-1">Supports .csv and .xlsx</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                  Browse Files
                </button>
              </>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={processFile}
            disabled={!file || isUploading || !!success}
            className="px-5 py-2 bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white text-sm font-semibold rounded-lg shadow-md shadow-[#4f46e5]/20 transition-all flex items-center gap-2 disabled:opacity-60 disabled:shadow-none"
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {isUploading ? "Processing..." : "Import Data"}
          </button>
        </div>

      </div>
    </div>
  );
}
