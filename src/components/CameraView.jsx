import { useRef, useState } from "react";

export default function CameraView() {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [cameraOn, setCameraOn] = useState(false);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });

            streamRef.current = stream;
            videoRef.current.srcObject = stream;
            setCameraOn(true);
        } catch (err) {
            console.error("Camera access denied:", err);
        }
    };

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        setCameraOn(false);
    };

    return (
        <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-4 shadow-lg">
            {/* Header */}
            <h1 className="text-lg font-semibold text-center mb-4">
                Sign Language to Text
            </h1>

            {/* Camera Container */}
            <div className="relative w-full aspect-square bg-black rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                {cameraOn ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <p className="text-zinc-400 text-sm">Camera is off</p>
                )}
            </div>

            {/* Controls */}
            <button
                onClick={cameraOn ? stopCamera : startCamera}
                className={`w-full py-3 rounded-xl font-medium transition
          ${
              cameraOn
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
          }`}
            >
                {cameraOn ? "Stop Camera" : "Start Camera"}
            </button>

            {/* Prediction Panel */}
            <div className="mt-4 flex items-center justify-between bg-zinc-800 rounded-xl px-4 py-3">
                <div>
                    <p className="text-xs text-zinc-400">Prediction</p>
                    <p className="text-2xl font-bold">—</p>
                </div>

                <div className="text-right">
                    <p className="text-xs text-zinc-400">Confidence</p>
                    <p className="text-lg font-medium">—%</p>
                </div>
            </div>
        </div>
    );
}
