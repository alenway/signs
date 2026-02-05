import { useEffect, useRef, useState } from "react";

export default function CameraView() {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [cameraOn, setCameraOn] = useState(false);

    useEffect(() => {
        if (!cameraOn) return;

        const enableCamera = async () => {
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

        enableCamera();

        return () => {
            streamRef.current?.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        };
    }, [cameraOn]);

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

            {/* Toggle Button */}
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
