"use client";
import type { NextPage } from "next";
import { useState, useRef } from "react";

const Explore: NextPage = () => {
  const [url, setUrl] = useState<string>("");
  const [displayUrl, setDisplayUrl] = useState<string>("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure URL has protocol
    let formattedUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      formattedUrl = `https://${url}`;
    }
    setDisplayUrl(formattedUrl);
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-screen">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL"
          className="flex-1 px-4 py-2 text-white bg-gray-800 rounded-lg"
        />
        <button
          type="submit"
          className="px-4 py-2 w-[130px] button-bg rounded-lg flex justify-center items-center gap-2"
        >
          Load
        </button>
      </form>

      {displayUrl && (
        <div className="w-full h-[80vh] rounded-lg overflow-hidden border border-gray-300">
          <iframe
            ref={iframeRef}
            src={displayUrl}
            className="w-full h-full"
            title="Website Preview"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      )}
    </div>
  );
};

export default Explore;
