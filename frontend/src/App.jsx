import { useState, useRef, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { CloudUpload, InsertPhoto } from "@mui/icons-material";
import HeroSection from "./HeroSection";

export default function App() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  // Reference for scrolling
  const dropzoneRef = useRef(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Please upload an image under 5MB.");
        return;
      }

      setFile(file);
      setImage(URL.createObjectURL(file));
    },
  });

  useEffect(() => {
    if (file) {
      handlePrediction(file);
    }
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [file]);

  const handlePrediction = useCallback(async (file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://us-central1-fluted-cogency-453401-c4.cloudfunctions.net/predict",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) throw new Error("Failed to get response from server.");

      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error("Error predicting:", error);
      alert("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-yellow-400 p-6">
      <HeroSection
        scrollToDropzone={() =>
          dropzoneRef.current.scrollIntoView({ behavior: "smooth" })
        }
      />

      {/* Dropzone Section */}
      <section ref={dropzoneRef} className="flex flex-col items-center mt-10">
        <motion.div
          {...getRootProps()}
          className="w-96 h-64 flex flex-col justify-center items-center border-4 border-dashed border-yellow-400 rounded-lg cursor-pointer bg-gray-900 hover:bg-yellow-500/10 transition-all p-6 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <input {...getInputProps()} />
          <CloudUpload className="text-yellow-400 text-5xl" />
          <p className="text-lg mt-2 font-semibold">
            Drag & Drop an image here, or click to upload
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Supports JPG, PNG, and more
          </p>
        </motion.div>
      </section>

      {/* Uploaded Image Preview */}
      {image && (
        <div className="mt-6 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Card className="bg-gray-800 p-4 w-96 shadow-xl">
              <CardContent>
                <img src={image} alt="Uploaded" className="w-full rounded-lg" />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Prediction Section */}
      {loading && (
        <div className="flex justify-center mt-6">
          <CircularProgress color="inherit" />
        </div>
      )}
      {prediction && (
        <section className="mt-6 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Card className="bg-gray-800 p-6 w-96 shadow-xl">
              <CardContent>
                <h2 className="text-xl font-semibold text-yellow-400 flex items-center">
                  <InsertPhoto className="mr-2" /> Prediction Result
                </h2>
                <p className="text-lg mt-2">🌿 Class: {prediction.class}</p>
                <p className="text-lg">
                  🎯 Confidence: {prediction.confidence.toFixed(2)}%
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      )}
    </div>
  );
}
