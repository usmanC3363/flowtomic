"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as UC from "@uploadcare/file-uploader";
import "@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css";

type Props = {
  onUpload: (cdnUrl: string) => any;
};

const UploadCareButton = ({ onUpload }: Props) => {
  const router = useRouter();
  const ctxRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctxEl = ctxRef.current;
    if (!ctxEl) return;

    const handleSuccess = async (e: CustomEvent<{ cdnUrl: string }>) => {
      const result = await onUpload(e.detail.cdnUrl);
      if (result) {
        router.refresh();
      }
    };

    ctxEl.addEventListener("file-upload-success", handleSuccess);
    return () => {
      ctxEl.removeEventListener("file-upload-success", handleSuccess);
    };
  }, [onUpload, router]);

  // Ensure Web Components are registered
  UC.defineComponents(UC);

  return (
    <div>
      <uc-config ctx-name="my-uploader" pubkey="YOUR_PUBLIC_KEY" />

      <uc-upload-ctx-provider ctx-name="my-uploader" ref={ctxRef} />

      <uc-file-uploader-regular ctx-name="my-uploader" />
    </div>
  );
};

export default UploadCareButton;
