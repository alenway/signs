import { useEffect, useRef, useState } from "react";

export default function CameraView() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [cameraOn, setCameraOn] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);

    // Handle camera ON / OFF
    useEffect(() => {
        if (!cameraOn) return;

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user" },
                });

                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }
            } catch (err) {
                console.error("Camera error:", err);
                setCameraOn(false);
            }
        };

        startCamera();

        return () => {
            streamRef.current?.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        };
    }, [cameraOn]);

    // Capture frame from video
    const captureFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const SIZE = 224; // ML input size
        canvas.width = SIZE;
        canvas.height = SIZE;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, SIZE, SIZE);

        const imageData = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageData);
    };

    return (
        <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-4 shadow-lg">
            {/* Header */}
            <h1 className="text-lg font-semibold text-center mb-4">
                Sign Language to Text
            </h1>

            {/* Camera View */}
            <div className="relative w-full aspect-square bg-black rounded-xl overflow-hidden mb-4">
                {cameraOn ? (
                    <video
                        ref={videoRef}
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-zinc-400 text-sm">Camera is OFF</p>
                    </div>
                )}
            </div>

            {/* Camera Toggle */}
            <button
                onClick={() => setCameraOn((prev) => !prev)}
                className={`w-full py-3 rounded-xl font-medium transition
          ${
              cameraOn
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
          }`}
            >
                Camera {cameraOn ? "OFF" : "ON"}
            </button>

            {/* Capture Button */}
            <button
                onClick={captureFrame}
                disabled={!cameraOn}
                className="w-full mt-3 py-3 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
                Capture Frame
            </button>

            {/* Captured Image Preview */}
            {capturedImage && (
                <div className="mt-4">
                    <p className="text-xs text-zinc-400 mb-2">Captured Frame</p>
                    <img
                        src={capturedImage}
                        alt="Captured"
                        className="w-32 h-32 rounded-lg object-cover border border-zinc-700"
                    />
                </div>
            )}

            {/* Hidden Canvas */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
