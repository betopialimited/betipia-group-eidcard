import { getFrameById } from "@/lib/framesConfig";
import FrameGeneratorClient from "./FrameGeneratorClient";

export async function generateStaticParams() {
  const { frames } = await import("@/lib/framesConfig");
  return frames.map((frame) => ({
    id: frame.id,
  }));
}

export default async function FrameGenerator({ params }) {
  const { id } = await params;
  const frame = getFrameById(id);

  if (!frame) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Frame Not Found
          </h1>
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 justify-center"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    );
  }

  return <FrameGeneratorClient frame={frame} frameId={id} />;
}
