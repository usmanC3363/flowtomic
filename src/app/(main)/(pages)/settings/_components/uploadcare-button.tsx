"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as UC from "@uploadcare/file-uploader";
import "@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";

type Props = {
  onUpload: (cdnUrl: string) => any;
};

const UploadCareButton = ({ onUpload }: Props) => {
  const router = useRouter();
  const ctxRef = useRef<HTMLElement>(null);

  // const ctxProviderRef = useRef<
  //   typeof LR.UploadCtxProvider.prototype & LR.UploadCtxProvider
  // >(null);

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
    <div className="">
      <FileUploaderRegular
        sourceList="local, camera, facebook, gdrive"
        classNameUploader="uc-light"
        pubkey="f9dc58d927b38dfb233e"
      />
    </div>
  );
};

export default UploadCareButton;
